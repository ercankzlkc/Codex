import * as T from 'three';
import {SEA_Y} from './scenery';
export const shipIce={lane:{value:new T.Vector4()},open:{value:new T.Vector2(.76,0)}};
export class ShippingIce{
  private mesh=new T.InstancedMesh(new T.IcosahedronGeometry(.11,0),new T.MeshLambertMaterial({color:0xc2dde1,transparent:true,opacity:.85,depthWrite:false}),48);
  private chips:{at:T.Vector3;v:T.Vector3;age:number;spin:number}[]=[];private pose=new T.Object3D();private last=new T.Vector3(999,0,999);
  constructor(scene:T.Scene){this.mesh.count=0;this.mesh.frustumCulled=false;scene.add(this.mesh)}
  reset(){this.chips=[];this.mesh.count=0;shipIce.open.value.y=0;this.last.set(999,0,999)}
  update(dt:number,bow:T.Vector3|null,direction:T.Vector3,winter:number){
    if(bow&&winter>.15&&bow.distanceTo(this.last)>.3){
      this.last.copy(bow);
      for(let i=0;i<6&&this.chips.length<48;i++){const side=i%2?-1:1;this.chips.push({at:bow.clone().add(new T.Vector3(direction.z*side*.3,0,-direction.x*side*.3)),v:new T.Vector3(direction.z*side*.25,.12+Math.random()*.18,-direction.x*side*.25),age:0,spin:Math.random()*6})}
    }
    this.chips=this.chips.filter(chip=>{chip.age+=dt;return chip.age<1.5});
    this.chips.forEach((chip,i)=>{chip.v.y-=dt*.65;chip.at.addScaledVector(chip.v,dt);this.pose.position.copy(chip.at);this.pose.position.y=Math.max(SEA_Y-.25,this.pose.position.y);this.pose.rotation.set(chip.spin+chip.age,chip.spin,chip.age*.8);this.pose.scale.setScalar(1-Math.max(0,chip.age-1)*2);this.pose.scale.y*=.23;this.pose.updateMatrix();this.mesh.setMatrixAt(i,this.pose.matrix)});
    this.mesh.count=this.chips.length;this.mesh.instanceMatrix.needsUpdate=true;
  }
}
