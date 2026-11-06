import * as T from 'three';
import {SEA_Y} from './scenery';

export const shipIce={lane:{value:new T.Vector4()},open:{value:new T.Vector2(.70,0)}};
const GRAIN_LIMIT=192,CHIP_LIMIT=40,CONTACT_STEP=.13;
// Same linear RGB as the snow layer in climate.ts; scene lighting handles nightfall.
const SNOW_COLOR=new T.Color().setRGB(.87,.93,.97);

function icePlate(){
  // Only a few thin chips remain among the finer, compact snow grains.
  const shape=new T.Shape();
  shape.moveTo(-.15,-.09);shape.lineTo(-.07,-.14);shape.lineTo(.11,-.10);
  shape.lineTo(.17,.015);shape.lineTo(.055,.14);shape.lineTo(-.12,.10);shape.closePath();
  return new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false,steps:1}).rotateX(-Math.PI/2).center();
}

type IceChip={
  at:T.Vector3;v:T.Vector3;rotation:T.Vector3;spin:T.Vector3;color:T.Color;
  age:number;life:number;size:number;phase:number;floating:boolean;
};

export class ShippingIce{
  private material=new T.MeshLambertMaterial({
    color:0xffffff,transparent:true,opacity:.96,depthWrite:false,flatShading:true,
  });
  private grainsMesh=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),this.material,GRAIN_LIMIT);
  private chipsMesh=new T.InstancedMesh(icePlate(),this.material,CHIP_LIMIT);
  private grains:IceChip[]=[];
  private chips:IceChip[]=[];
  private pose=new T.Object3D();
  private last:T.Vector3|null=null;
  private contact=new T.Vector3();
  constructor(scene:T.Scene){
    for(const mesh of [this.grainsMesh,this.chipsMesh]){
      mesh.count=0;mesh.frustumCulled=false;
      // Above the water render pass, while retaining hull depth testing and normal lighting.
      mesh.renderOrder=4;mesh.receiveShadow=true;mesh.userData.iceChip=true;scene.add(mesh);
      mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    }
  }
  reset(){
    this.grains=[];this.chips=[];this.grainsMesh.count=0;this.chipsMesh.count=0;
    shipIce.open.value.y=0;this.last=null;
  }

  private fracture(bow:T.Vector3,dx:number,dz:number,width:number){
    for(let i=0;i<16;i++){
      const grain=i<14,particles=grain?this.grains:this.chips;
      if(particles.length>=(grain?GRAIN_LIMIT:CHIP_LIMIT))continue;
      const side=i%2?-1:1,shoulder=Math.floor(i/2)%3;
      // Local clusters crumble at the point and both shoulders, instead of wide plates.
      const spread=width*[.24,.63,.95][shoulder]+(Math.random()-.5)*.10;
      const along=-shoulder*.19+(Math.random()-.5)*.10;
      const at=new T.Vector3(bow.x+dx*along+dz*spread*side,SEA_Y+.026,bow.z+dz*along-dx*spread*side);
      const push=(grain?.24:.20)+Math.random()*(grain?.32:.17);
      particles.push({at,
        v:new T.Vector3(dz*side*push+dx*.07,.24+Math.random()*(grain?.40:.18),-dx*side*push+dz*.07),
        rotation:new T.Vector3(Math.random()*.5,Math.random()*Math.PI*2,Math.random()*.5),
        spin:new T.Vector3((Math.random()-.5)*5,side*(.5+Math.random()),(Math.random()-.5)*5),
        color:SNOW_COLOR.clone().multiplyScalar(.94+Math.random()*.06),
        age:0,life:grain?.85+Math.random()*.55:1.3+Math.random()*.55,
        size:grain?.020+Math.random()*.019:.23+Math.random()*.19,
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
    this.grains=this.updateParticles(this.grains,this.grainsMesh,step,true);
    this.chips=this.updateParticles(this.chips,this.chipsMesh,step,false);
  }

  private updateParticles(particles:IceChip[],mesh:T.InstancedMesh,step:number,grain:boolean){
    let count=0;
    for(const chip of particles){
      chip.age+=step;
      if(chip.age>=chip.life)continue;
      particles[count]=chip;
      if(!chip.floating)chip.v.y-=step*(grain?2.5:1.7);
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
      const fade=T.MathUtils.smoothstep(chip.age,chip.life-.5,chip.life);
      this.pose.position.copy(chip.at);this.pose.position.y-=fade*.07;
      this.pose.rotation.set(chip.rotation.x,chip.rotation.y,chip.rotation.z);
      const size=chip.size*(1-fade);
      this.pose.scale.set(size,size*(grain?.72:1),size*.82);
      this.pose.updateMatrix();mesh.setMatrixAt(count,this.pose.matrix);mesh.setColorAt(count,chip.color);
      count++;
    }
    particles.length=count;
    mesh.count=count;mesh.instanceMatrix.needsUpdate=true;
    if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    return particles;
  }
}
