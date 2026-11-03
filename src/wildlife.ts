import * as T from 'three';
import {fromWorld,position} from './hex';
import {SEA_Y} from './scenery';
/** Small shared meshes keep the coast alive without adding simulation workers. */
export class Wildlife {
  private root=new T.Group();
  private birds:{root:T.Group;wings:T.Group[];phase:number}[]=[];
  private fish:{root:T.Group;start:T.Vector3;direction:T.Vector3;age:number;wait:number;duration:number}[]=[];
  private center=new T.Vector3();private radius=4;
  private board:ReadonlyMap<number,unknown>=new Map();
  constructor(scene:T.Scene,private splash:(x:number,z:number)=>void){
    scene.add(this.root);
    const white=new T.MeshStandardMaterial({color:0xf5f1dc,roughness:.85}),dark=new T.MeshStandardMaterial({color:0x718286,roughness:.85});
    const bodyGeo=new T.SphereGeometry(.055,6,4),wingGeo=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute([0,0,0,.23,.015,-.03,.14,0,.06],3));wingGeo.computeVertexNormals();white.side=T.DoubleSide;dark.side=T.DoubleSide;
    for(let i=0;i<5;i++){
      const root=new T.Group(),body=new T.Mesh(bodyGeo,white);body.scale.set(.65,.7,1.6);root.add(body);
      const head=new T.Mesh(bodyGeo,white);head.scale.setScalar(.6);head.position.set(0,.025,.09);root.add(head);
      const beak=new T.Mesh(new T.ConeGeometry(.015,.055,4),new T.MeshStandardMaterial({color:0xd8ac63}));beak.rotation.x=Math.PI/2;beak.position.set(0,.02,.14);root.add(beak);
      const wings=[-1,1].map(sign=>{const pivot=new T.Group(),wing=new T.Mesh(wingGeo,white);wing.scale.x=sign;pivot.add(wing);const tip=new T.Mesh(wingGeo,dark);tip.scale.set(sign*.3,1,.65);tip.position.x=sign*.16;pivot.add(tip);root.add(pivot);return pivot});
      this.root.add(root);this.birds.push({root,wings,phase:i*1.93});
    }
    const silver=new T.MeshStandardMaterial({color:0x88b5b5,metalness:.18,roughness:.5}),tailGeo=new T.ConeGeometry(.055,.12,3);
    for(let i=0;i<2;i++){
      const root=new T.Group(),body=new T.Mesh(new T.SphereGeometry(.09,7,5),silver);body.scale.set(.5,.65,1.7);root.add(body);
      const tail=new T.Mesh(tailGeo,silver);tail.rotation.x=-Math.PI/2;tail.position.z=-.18;root.add(tail);root.visible=false;this.root.add(root);
      this.fish.push({root,start:new T.Vector3(),direction:new T.Vector3(),age:-1,wait:5+i*7,duration:1.25});
    }
  }
  sync(board:ReadonlyMap<number,unknown>){
    this.board=board;const points=[...board.keys()].map(position);if(!points.length)return;
    this.center.set(points.reduce((n,p)=>n+p.x,0)/points.length,0,points.reduce((n,p)=>n+p.z,0)/points.length);
    this.radius=Math.max(3,...points.map(p=>Math.hypot(p.x-this.center.x,p.z-this.center.z)+1.7));
  }
  reset(){for(let i=0;i<this.fish.length;i++){const f=this.fish[i];f.root.visible=false;f.age=-1;f.wait=5+i*7}}
  update(time:number,dt:number){
    this.birds.forEach((bird,i)=>{
      const a=time*(.11+i*.007)+bird.phase,r=this.radius+Math.sin(time*.09+bird.phase)*.8;
      bird.root.position.set(this.center.x+Math.cos(a)*r,2.4+i*.24+Math.sin(time*.6+bird.phase)*.14,this.center.z+Math.sin(a)*r*.7);
      bird.root.rotation.set(0,Math.atan2(-Math.sin(a),Math.cos(a)*.7),Math.sin(a+bird.phase)*.15);
      const flap=Math.sin(time*4.8+bird.phase)*.38;bird.wings[0].rotation.z=-flap;bird.wings[1].rotation.z=flap;
    });
    for(const f of this.fish){
      if(f.age<0){
        f.wait-=dt;if(f.wait>0)continue;
        let found=false;
        for(let n=0;n<12;n++){
          const a=Math.random()*Math.PI*2,r=this.radius*(.75+Math.random()*.65),heading=a+Math.PI/2;
          f.start.set(this.center.x+Math.sin(a)*r,SEA_Y,this.center.z+Math.cos(a)*r);f.direction.set(Math.sin(heading)*1.5,0,Math.cos(heading)*1.5);
          if([0,.25,.5,.75,1].every(t=>!this.board.has(fromWorld(f.start.x+f.direction.x*t,f.start.z+f.direction.z*t)))){found=true;break}
        }
        if(!found){f.wait=3;continue}
        f.age=0;f.root.visible=true;this.splash(f.start.x,f.start.z);
      }
      f.age+=dt;const t=Math.min(1,f.age/f.duration);
      f.root.position.copy(f.start).addScaledVector(f.direction,t);f.root.position.y+=Math.sin(t*Math.PI)*.65;
      const tangent=f.direction.clone();tangent.y=Math.cos(t*Math.PI)*Math.PI*.65;f.root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),tangent.normalize());
      if(t>=1||this.board.has(fromWorld(f.root.position.x,f.root.position.z))){this.splash(f.root.position.x,f.root.position.z);f.root.visible=false;f.age=-1;f.wait=8+Math.random()*15}
    }
  }
}
