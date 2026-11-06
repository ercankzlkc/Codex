import * as T from 'three';
import {SEA_Y} from './scenery';

export const shipIce={lane:{value:new T.Vector4()},open:{value:new T.Vector2(.70,0)}};
const CHIP_LIMIT=128,CONTACT_STEP=.13;

function icePlate(){
  // A thick, irregular floe has readable top and broken edges at the game's camera distance.
  const shape=new T.Shape();
  shape.moveTo(-.15,-.09);shape.lineTo(-.07,-.14);shape.lineTo(.11,-.10);
  shape.lineTo(.17,.015);shape.lineTo(.055,.14);shape.lineTo(-.12,.10);shape.closePath();
  return new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:false,steps:1}).rotateX(-Math.PI/2).center();
}

type IceChip={
  at:T.Vector3;v:T.Vector3;rotation:T.Vector3;spin:T.Vector3;color:T.Color;
  age:number;life:number;size:number;phase:number;floating:boolean;
};

export class ShippingIce{
  private mesh=new T.InstancedMesh(icePlate(),new T.MeshLambertMaterial({
    color:0xffffff,transparent:true,opacity:.94,depthWrite:false,flatShading:true,
  }),CHIP_LIMIT);
  private chips:IceChip[]=[];
  private pose=new T.Object3D();
  private last:T.Vector3|null=null;
  private contact=new T.Vector3();
  constructor(scene:T.Scene){
    this.mesh.count=0;this.mesh.frustumCulled=false;
    // Water renders at 2. Shards stay visible above it, with hull depth testing
    // and the scene's actual day/night lighting rather than an emissive overlay.
    this.mesh.renderOrder=4;this.mesh.receiveShadow=true;this.mesh.userData.iceChip=true;scene.add(this.mesh);
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  }
  reset(){this.chips=[];this.mesh.count=0;shipIce.open.value.y=0;this.last=null}

  private fracture(bow:T.Vector3,dx:number,dz:number,width:number){
    for(let i=0;i<8&&this.chips.length<CHIP_LIMIT;i++){
      const side=i%2?-1:1,pair=Math.floor(i/2),large=pair===0||pair===2;
      // The point opens first, then each shoulder pushes floes sideways along the hull.
      const spread=pair===3?.10:width*[.30,.68,1.][pair];
      const along=pair===3?.07:-pair*.24;
      const at=new T.Vector3(bow.x+dx*along+dz*spread*side,SEA_Y+.035,bow.z+dz*along-dx*spread*side);
      const push=(large?.25:.38)+Math.random()*.19;
      this.chips.push({at,
        v:new T.Vector3(dz*side*push+dx*.08,(large?.26:.43)+Math.random()*.22,-dx*side*push+dz*.08),
        rotation:new T.Vector3((Math.random()-.5)*.35,Math.random()*Math.PI*2,(Math.random()-.5)*.35),
        spin:new T.Vector3((Math.random()-.5)*(large?1.8:5),side*(.35+Math.random()),(Math.random()-.5)*(large?1.8:5)),
        color:new T.Color().setHSL(.53+Math.random()*.025,.20+Math.random()*.10,.72+Math.random()*.17),
        age:0,life:2.1+Math.random()*.85,size:large?.95+Math.random()*.52:.34+Math.random()*.38,
        phase:Math.random()*Math.PI*2,floating:false,
      });
    }
  }

  /** bow is the moving hull's leading contact at sea level; width is its half-width. */
  update(dt:number,bow:T.Vector3|null,direction:T.Vector3,winter:number,width=.62){
    const step=Math.max(0,Math.min(.1,dt)),heading=Math.hypot(direction.x,direction.z);
    if(bow&&winter>.15&&heading>.001){
      const dx=direction.x/heading,dz=direction.z/heading;
      if(!this.last){this.last=bow.clone();this.fracture(bow,dx,dz,width)}
      else{
        const distance=bow.distanceTo(this.last);
        if(distance>2.5)this.last.copy(bow);
        else if(distance>=CONTACT_STEP){
          const count=Math.min(5,Math.floor(distance/CONTACT_STEP));
          this.contact.copy(bow).sub(this.last).multiplyScalar(CONTACT_STEP/distance);
          for(let i=0;i<count;i++){
            this.last.add(this.contact);this.fracture(this.last,dx,dz,width);
          }
        }
      }
    }else this.last=null;
    this.chips=this.chips.filter(chip=>{chip.age+=step;return chip.age<chip.life});
    this.chips.forEach((chip,i)=>{
      if(!chip.floating)chip.v.y-=step*1.7;
      chip.at.addScaledVector(chip.v,step);
      if(!chip.floating&&chip.at.y<SEA_Y+.014&&chip.v.y<0){chip.floating=true;chip.v.y=0}
      if(chip.floating){
        const drag=Math.exp(-step*1.45);chip.v.x*=drag;chip.v.z*=drag;
        chip.at.y=T.MathUtils.damp(chip.at.y,SEA_Y+.012+Math.sin(chip.age*3+chip.phase)*.007,8,step);
        chip.spin.multiplyScalar(Math.exp(-step*2));
        chip.rotation.x=T.MathUtils.damp(chip.rotation.x,0,5,step);
        chip.rotation.z=T.MathUtils.damp(chip.rotation.z,0,5,step);
      }
      chip.rotation.addScaledVector(chip.spin,step);
      const fade=T.MathUtils.smoothstep(chip.age,chip.life-.65,chip.life);
      this.pose.position.copy(chip.at);this.pose.position.y-=fade*.07;
      this.pose.rotation.set(chip.rotation.x,chip.rotation.y,chip.rotation.z);
      this.pose.scale.set(chip.size*(1-fade),chip.size*(1-fade),chip.size*(1-fade)*.82);
      this.pose.updateMatrix();this.mesh.setMatrixAt(i,this.pose.matrix);this.mesh.setColorAt(i,chip.color);
    });
    this.mesh.count=this.chips.length;this.mesh.instanceMatrix.needsUpdate=true;
    if(this.mesh.instanceColor)this.mesh.instanceColor.needsUpdate=true;
  }
}
