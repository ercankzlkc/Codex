import * as T from 'three';
export function discoveryModel(type:number){
  const root=new T.Group();
  const add=(parent:T.Group,color:number,w:number,h:number,d:number,x=0,y=0,z=0)=>{const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.8}));mesh.position.set(x,y,z);parent.add(mesh);return mesh};
  if(type===1){
    add(root,0x5d503d,.34,.035,.24,0,-.025);
    for(const x of [-.17,.17])add(root,0x99764d,.025,.19,.24,x,.06);
    for(const z of [-.12,.12])for(let j=0;j<3;j++)add(root,j%2?0xa1855a:0x9a7b50,.34,.052,.023,0,.005+j*.055,z);
    const lid=new T.Group();lid.position.set(0,.15,-.12);root.add(lid);root.userData.lid=lid;
    for(let j=0;j<4;j++)add(lid,0xb18f5c,.36,.035,.062,0,.01,-.005+j*.062);
    for(const x of [-.11,.11]){add(root,0x526156,.026,.19,.025,x,.06,.134);add(lid,0x526156,.026,.044,.26,x,.015,.1)}
    add(lid,0xbfa56d,.038,.04,.025,0,-.01,.245);
  }else if(type===0){
    const bottle=new T.Mesh(new T.CylinderGeometry(.055,.075,.26,8),new T.MeshStandardMaterial({color:0x77aa98,roughness:.3,transparent:true,opacity:.85}));bottle.rotation.z=.6;root.add(bottle);
    add(root,0xc6af78,.05,.05,.05,-.075,.12);const note=add(root,0xf0e4c4,.035,.14,.035);note.rotation.z=.6;
  }else{
    for(let i=0;i<9;i++){const rib=new T.Mesh(new T.ConeGeometry(.035,.17,4),new T.MeshStandardMaterial({color:i%2?0xe0c7a1:0xeedab9,roughness:.8}));rib.rotation.set(Math.PI/2,0,(i-4)*.16);rib.position.set(Math.sin((i-4)*.16)*.07,.018,0);root.add(rib)}
  }
  const prizes=new T.Group();prizes.visible=false;root.add(prizes);root.userData.prizes=prizes;
  for(let i=0;i<6;i++){const coin=new T.Mesh(new T.CylinderGeometry(.025,.025,.009,10),new T.MeshStandardMaterial({color:0xd7b35a,metalness:.3,roughness:.45}));coin.userData.phase=i*2.4;prizes.add(coin)}
  return root;
}
