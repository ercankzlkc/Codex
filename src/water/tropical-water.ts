import * as T from 'three';
import { position, type ShoreEdge } from '../hex';
import { SEA_Y } from '../scenery';
import { LagoonField, lightField } from './field';
import { optics, receiverLight, waterFragment, waterVertex } from './shaders';

const SAND_STEPS=100;
const lerp=T.MathUtils.lerp;

export class TropicalWater {
  readonly root=new T.Group();
  private readonly field=new LagoonField();
  private readonly uniforms={
    uTime:{value:0},uLight:{value:lightField()},uCoast:{value:this.field.texture},
    uRegion:{value:this.field.region},uLanding:{value:new T.Vector3(0,0,-10)},
    // Artist palette in sRGB; Three converts to linear for lighting and blending.
    uMint:{value:new T.Color('#87efd4')},uTurquoise:{value:new T.Color('#20d0c6')},
    uLagoon:{value:new T.Color('#22b7c7')},uDeep:{value:new T.Color('#318fc4')},
  };
  private readonly sandGeometry=new T.PlaneGeometry(1,1,SAND_STEPS,SAND_STEPS).rotateX(-Math.PI/2);
  private readonly sandTint=new T.Float32BufferAttribute(new Float32Array((SAND_STEPS+1)**2*3),3);
  private readonly stones:T.InstancedMesh;
  private readonly silhouettes=new T.IcosahedronGeometry(1,0);
  constructor(){
    const surface=new T.Mesh(new T.PlaneGeometry(160,160,180,180),new T.ShaderMaterial({
      uniforms:this.uniforms,vertexShader:waterVertex,fragmentShader:waterFragment,
      transparent:true,depthWrite:false,toneMapped:false,
    }));
    surface.rotation.x=-Math.PI/2;surface.position.y=SEA_Y;surface.renderOrder=2;
    this.sandGeometry.setAttribute('color',this.sandTint);
    const sand=new T.Mesh(this.sandGeometry,this.receiver(true));sand.receiveShadow=true;
    this.stones=new T.InstancedMesh(this.silhouettes,this.receiver(false),192);
    this.stones.count=0;this.stones.receiveShadow=true;
    this.root.add(sand,this.stones,surface);
  }

  private receiver(sand:boolean){
    const mat=new T.MeshLambertMaterial({color:0xffffff,vertexColors:sand,transparent:sand,depthWrite:!sand});
    mat.onBeforeCompile=shader=>{
      shader.uniforms.uLight=this.uniforms.uLight;shader.uniforms.uTime=this.uniforms.uTime;
      shader.vertexShader='varying vec3 vReceiver;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
        vec4 receiverLocal=vec4(transformed,1.);
        #ifdef USE_INSTANCING
          receiverLocal=instanceMatrix*receiverLocal;
        #endif
        vReceiver=(modelMatrix*receiverLocal).xyz;
        #include <project_vertex>`);
      shader.fragmentShader='varying vec3 vReceiver;\n'+optics+'\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+receiverLight+(sand?'\ndiffuseColor.a *= 1. - smoothstep(.65, 1.65, max(0., -.18-vReceiver.y));':'' ));
    };
    mat.customProgramCacheKey=()=> 'lagoon-receiver-v1';
    return mat;
  }

  sync(board:ReadonlyMap<number,unknown>,edges:ShoreEdge[],placed:number){
    this.field.rebuild(board,edges);
    this.shapeBed();this.placeStones(edges);
    if(placed>=0){const p=position(placed);this.uniforms.uLanding.value.set(p.x,p.z,this.uniforms.uTime.value)}
    else this.uniforms.uLanding.value.z=-10;
  }
  private shapeBed(){
    const region=this.field.region;
    const vertices=this.sandGeometry.getAttribute('position');
    const sand=new T.Color('#d4cc9e'),silt=new T.Color('#79b8aa'),deep=new T.Color('#467f87'),c=new T.Color();
    for(let j=0;j<=SAND_STEPS;j++)for(let i=0;i<=SAND_STEPS;i++){
      const px=region.x+region.z*i/SAND_STEPS,pz=region.y+region.w*j/SAND_STEPS,idx=j*(SAND_STEPS+1)+i;
      const depth=this.field.depthAt(px,pz);
      vertices.setXYZ(idx,px,SEA_Y-depth,pz);
      c.copy(sand).lerp(silt,T.MathUtils.smoothstep(depth,.28,1.10))
        .lerp(deep,T.MathUtils.smoothstep(depth,.93,2.6))
        .multiplyScalar(.98+.027*Math.sin(px*2.73+pz*.83)+.02*Math.cos(px*1.88-pz*3.2));
      this.sandTint.setXYZ(idx,c.r,c.g,c.b);
    }
    vertices.needsUpdate=true;this.sandTint.needsUpdate=true;
    this.sandGeometry.computeVertexNormals();this.sandGeometry.computeBoundingSphere();
  }
  private placeStones(edges:ShoreEdge[]){
    const o=new T.Object3D(),warm=new T.Color('#99a590'),blue=new T.Color('#467c85'),color=new T.Color();
    let index=0;
    for(const edge of edges){
      // Seed per edge, so an undisturbed cove keeps its pebbles as the island grows.
      let seed=Math.imul(edge.id+1,127)+edge.side*317;
      const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
      const along=.18+rand()*.64,offset=.43+rand()*.51;
      const nx=Math.cos(edge.side*Math.PI/3),nz=Math.sin(edge.side*Math.PI/3);
      const size=.075+rand()*.074,amount=rand()<.33?1:3;
      for(let j=0;j<amount&&index<this.stones.instanceMatrix.count;j++){
        const t=along+(rand()-.5)*.25,off=offset+j*.075;
        const px=lerp(edge.ax,edge.bx,t)+nx*off,pz=lerp(edge.az,edge.bz,t)+nz*off;
        const depth=this.field.depthAt(px,pz),r=size/(1+j*.64);
        o.position.set(px,SEA_Y-depth+r*.25,pz);o.rotation.set(rand()*.32,rand()*6.28,rand()*.26);
        o.scale.set(r*(1.25+rand()*.45),r*(.60+rand()*.18),r);o.updateMatrix();
        this.stones.setMatrixAt(index,o.matrix);
        color.copy(warm).lerp(blue,T.MathUtils.smoothstep(depth,.31,1.03)*.84+.09)
          .multiplyScalar(.88+rand()*.2);this.stones.setColorAt(index++,color);
      }
    }
    this.stones.count=index;this.stones.instanceMatrix.needsUpdate=true;
    if(this.stones.instanceColor)this.stones.instanceColor.needsUpdate=true;
    this.stones.computeBoundingSphere();
  }
  update(time:number){this.uniforms.uTime.value=time}
}


