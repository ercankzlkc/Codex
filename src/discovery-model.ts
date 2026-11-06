import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {ChestLoot} from './chest-loot';

/** Keep the moving lid separate, while drawing its little details in material batches. */
function batchDetails(group:T.Group){
  group.updateWorldMatrix(true,true);
  const inverse=group.matrixWorld.clone().invert(),batches=new Map<T.Material,T.BufferGeometry[]>();
  group.traverse(object=>{
    if(!(object instanceof T.Mesh))return;
    const geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();
    geometry.deleteAttribute('uv');geometry.applyMatrix4(inverse.clone().multiply(object.matrixWorld));
    const material=object.material as T.Material;
    if(!batches.has(material))batches.set(material,[]);
    batches.get(material)!.push(geometry);
    object.geometry.dispose();
  });
  group.clear();
  for(const [material,parts] of batches){
    const geometry=mergeGeometries(parts,false);parts.forEach(part=>part.dispose());
    if(!geometry)continue;
    const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
  }
}

export function discoveryModel(loot:ChestLoot){
  const root=new T.Group();
  // Materials belong to this discovery, because removing a discovery disposes its meshes.
  const materials=new Map<string,T.MeshStandardMaterial>();
  const material=(color:number,metal=false)=>{
    const key=`${color}:${metal}`;
    if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color,roughness:metal?.6:.84,metalness:metal?.32:0,flatShading:true}));
    return materials.get(key)!;
  };
  const part=(parent:T.Group,geometry:T.BufferGeometry,color:number,x=0,y=0,z=0,metal=false)=>{
    const mesh=new T.Mesh(geometry,material(color,metal));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  };
  const add=(parent:T.Group,color:number,w:number,h:number,d:number,x=0,y=0,z=0,metal=false)=>part(parent,new RoundedBoxGeometry(w,h,d,1,Math.min(.006,Math.min(w,h,d)*.2)),color,x,y,z,metal);
    root.name='Floating treasure chest';
    const body=new T.Group();body.name='Planked chest';root.add(body);
    const wood=0x96744e,lightWood=0xac8759,darkWood=0x745839,inside=0x4b4433,metal=0x637466,metalLight=0x82917c,brass=0xb6a06b;
    // A real hollow box: the dark floor and inner lining remain visible when opened.
    add(body,darkWood,.438,.032,.292,0,-.018);
    for(let i=0;i<4;i++)add(body,inside,.096,.012,.235,(i-1.5)*.098,.006);
    for(const z of [-.139,.139]){
      for(let row=0;row<3;row++)add(body,[wood,lightWood,wood][row],.438,.046,.027,0,.029+row*.048,z);
      add(body,inside,.383,.12,.006,0,.076,Math.sign(z)*.121);
    }
    for(const x of [-.207,.207]){
      for(let row=0;row<3;row++)add(body,[lightWood,wood,lightWood][row],.025,.046,.252,x,.029+row*.048);
      add(body,inside,.006,.12,.232,Math.sign(x)*.19,.076);
    }
    for(const x of [-.209,.209])for(const z of [-.14,.14])add(body,darkWood,.029,.158,.029,x,.065,z);
    for(const z of [-.14,.14])add(body,lightWood,.456,.018,.029,0,.145,z);
    for(const x of [-.213,.213])add(body,lightWood,.029,.018,.253,x,.145);
    // Wide weathered straps wrap the body and line up with the lid's curved bands.
    for(const x of [-.139,.139]){
      for(const z of [-.157,.157]){
        add(body,metal,.029,.153,.009,x,.066,z,true);
        for(const y of [.012,.12])part(body,new T.SphereGeometry(.0048,6,4),metalLight,x,y,z+Math.sign(z)*.006,true);
      }
      add(body,metal,.029,.012,.316,x,-.034,0,true);
    }
    // Small inset grain marks break up the planks without competing with their silhouette.
    for(let row=0;row<3;row++)for(const side of [-1,1])add(body,darkWood,.054+row*.011,.0018,.0015,side*(.054+row*.012),.023+row*.048,.153);
    for(const side of [-1,1]){
      add(body,metal,.008,.031,.052,side*.229,.091,0,true);
      const handle=part(body,new T.TorusGeometry(.026,.005,5,10),metal,side*.236,.058,0,true);handle.rotation.y=Math.PI/2;
      for(const z of [-.015,.015])part(body,new T.SphereGeometry(.0045,6,4),metalLight,side*.235,.094,z,true);
    }
    const lid=new T.Group();lid.name='Arched hinged lid';lid.position.set(0,.151,-.153);root.add(lid);root.userData.lid=lid;
    const depth=.306,arch=.087,staves=10;
    const profile=(angle:number)=>({z:depth*.5*(1-Math.cos(angle)),y:.005+arch*Math.sin(angle)});
    // Rounded staves follow a barrel arch. Their fine seams read as crafted wood at game scale.
    for(let i=0;i<staves;i++){
      const a=profile(i*Math.PI/staves),b=profile((i+1)*Math.PI/staves),dy=b.y-a.y,dz=b.z-a.z,angle=-Math.atan2(dy,dz),length=Math.hypot(dy,dz);
      const plank=add(lid,i%3===1?lightWood:wood,.474,.023,length-.0012,0,(a.y+b.y)*.5,(a.z+b.z)*.5);plank.rotation.x=angle;
      for(const x of [-.139,.139]){
        const band=add(lid,metal,.029,.009,length+.0018,x,(a.y+b.y)*.5+Math.cos(angle)*.017,(a.z+b.z)*.5+Math.sin(angle)*.017,true);band.rotation.x=angle;
      }
    }
    // Shaped end cheeks close the arched lid, including its underside when it swings up.
    const cheek=new T.Shape();cheek.moveTo(0,-.006);
    for(let i=0;i<=16;i++){const point=profile(i*Math.PI/16);cheek.lineTo(point.z,point.y-.006)}
    cheek.lineTo(depth,-.006);cheek.closePath();
    for(const x of [-.219,.219]){
      const geometry=new T.ExtrudeGeometry(cheek,{depth:.022,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,steps:1});
      geometry.rotateY(-Math.PI/2);geometry.translate(x+.011,0,0);part(lid,geometry,lightWood);
      add(lid,darkWood,.025,.014,.295,x,-.008,depth*.5);
    }
    for(const z of [0,depth])add(lid,darkWood,.475,.019,.018,0,-.002,z);
    // Rear hinge barrels share the lid's actual pivot, so opening never detaches it.
    for(const x of [-.139,.139]){
      add(body,metal,.045,.044,.009,x,.123,-.161,true);
      add(lid,metal,.04,.022,.009,x,.012,-.006,true);
      const hinge=part(body,new T.CylinderGeometry(.011,.011,.046,8),brass,x,.151,-.156,true);hinge.rotation.z=Math.PI/2;
      for(const y of [.108,.132])part(body,new T.SphereGeometry(.004,6,4),metalLight,x,y,-.168,true);
      for(const z of [.012,depth-.012])part(lid,new T.SphereGeometry(.0045,6,4),metalLight,x,.03,z,true);
    }
    // A soft brass escutcheon and hanging hasp give the front a clear focal point.
    add(body,brass,.045,.052,.01,0,.087,.164,true);
    const keyhole=part(body,new T.CylinderGeometry(.006,.006,.0025,8),inside,0,.091,.171);keyhole.rotation.x=Math.PI/2;
    add(body,inside,.006,.011,.0025,0,.082,.171);
    add(lid,metal,.028,.047,.012,0,-.018,depth+.008,true);
    add(lid,brass,.016,.018,.014,0,-.034,depth+.011,true);
    for(const x of [-.015,.015])part(body,new T.SphereGeometry(.0035,6,4),metalLight,x,.101,.171,true);
    batchDetails(body);batchDetails(lid);
  const prizes=new T.Group();prizes.visible=false;root.add(prizes);root.userData.prizes=prizes;
  for(let i=0;i<Math.min(loot.amount,6);i++){
    const prize=new T.Group();prize.userData.phase=i*2.4;prizes.add(prize);
    if(loot.good==='gold'){
      const coin=part(prize,new T.CylinderGeometry(.027,.027,.009,12),0xd7b35a,0,0,0,true);coin.rotation.x=Math.PI*.38;
      const stamp=part(prize,new T.CylinderGeometry(.019,.019,.010,8),0xe5c977,0,0,0,true);stamp.rotation.copy(coin.rotation);
    }else if(loot.good==='wood'){
      for(const [y,z] of [[0,-.014],[0,.014],[.022,0]]){
        const log=part(prize,new T.CylinderGeometry(.015,.017,.083,7),0x89613e,0,y,z);log.rotation.z=Math.PI/2;
        for(const x of [-.042,.042]){const end=part(prize,new T.CylinderGeometry(.012,.012,.002,7),0xd7b078,x,y,z);end.rotation.z=Math.PI/2}
      }
      for(const x of [-.018,.018]){const rope=part(prize,new T.TorusGeometry(.028,.003,4,8),0xbca478,x,.007,0);rope.rotation.y=Math.PI/2}
    }else if(loot.good==='stone'){
      part(prize,new T.DodecahedronGeometry(.038,0),0x869085,-.012,0,0).scale.set(1.15,.78,1);
      part(prize,new T.DodecahedronGeometry(.026,0),0xa6ad98,.026,-.009,.013).rotation.set(.3,.8,.4);
    }else if(loot.good==='berry'){
      for(let j=0;j<4;j++){
        const angle=j*2.4,x=Math.cos(angle)*.022,z=Math.sin(angle)*.02,y=j===3?.018:0;
        const berry=part(prize,new T.SphereGeometry(.018,7,5),j%2?0xc9573e:0xb94035,x,y,z);berry.scale.y=1.14;
        for(let leaf=0;leaf<3;leaf++){const blade=part(prize,new T.ConeGeometry(.009,.021,3),0x658554,x,y+.022,z);blade.rotation.set(.65,leaf*Math.PI*2/3,.9)}
      }
    }else if(loot.good==='wheat'){
      for(let stalk=0;stalk<3;stalk++){
        const stem=part(prize,new T.CylinderGeometry(.0016,.0018,.09,4),0xb09c54,(stalk-1)*.014,0,0);stem.rotation.z=(stalk-1)*.12;
        for(let grain=0;grain<6;grain++){const kernel=part(prize,new T.SphereGeometry(.007,5,4),grain%2?0xd8bc6b:0xe6ca7b,(stalk-1)*.014+(grain%2?-.005:.005),.01+Math.floor(grain/2)*.013,0);kernel.scale.set(.75,1.6,.7);kernel.rotation.z=grain%2?-.4:.4}
      }
    }else{
      const fish=part(prize,new T.SphereGeometry(.031,8,5),0x91aba5);fish.scale.set(1.55,.65,.55);
      const belly=part(prize,new T.SphereGeometry(.024,7,4),0xc2cfb9,.006,-.008,0);belly.scale.set(1.55,.45,.66);
      const tail=part(prize,new T.ConeGeometry(.022,.035,3),0x65877e,-.057,0,0);tail.rotation.z=Math.PI/2;
      part(prize,new T.SphereGeometry(.0035,5,4),0x334e47,.03,.007,.017);
    }
    batchDetails(prize);
  }
  return root;
}
