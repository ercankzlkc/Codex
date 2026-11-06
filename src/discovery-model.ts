import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

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

export function discoveryModel(type:number){
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
  if(type===1){
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
  }else if(type===0){
    const bottle=new T.Mesh(new T.CylinderGeometry(.055,.075,.26,8),new T.MeshStandardMaterial({color:0x77aa98,roughness:.3,transparent:true,opacity:.85}));bottle.rotation.z=.6;root.add(bottle);
    add(root,0xc6af78,.05,.05,.05,-.075,.12);const note=add(root,0xf0e4c4,.035,.14,.035);note.rotation.z=.6;
  }else{
    for(let i=0;i<9;i++){const rib=part(root,new T.ConeGeometry(.035,.17,4),i%2?0xe0c7a1:0xeedab9);rib.rotation.set(Math.PI/2,0,(i-4)*.16);rib.position.set(Math.sin((i-4)*.16)*.07,.018,0)}
  }
  const prizes=new T.Group();prizes.visible=false;root.add(prizes);root.userData.prizes=prizes;
  for(let i=0;i<6;i++){const coin=part(prizes,new T.CylinderGeometry(.025,.025,.009,10),0xd7b35a,0,0,0,true);coin.userData.phase=i*2.4}
  return root;
}
