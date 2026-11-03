import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Kind} from './game';
const mats=new Map<number,T.MeshStandardMaterial>();const geometries=new Map<string,T.BufferGeometry>();
function material(c:number){if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.95,flatShading:true}));return mats.get(c)!}
export function part(p:T.Group,g:T.BufferGeometry,c:number,x=0,y=0,z=0){const m=new T.Mesh(g,material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
export function box(p:T.Group,c:number,x:number,y:number,z:number,w:number,h:number,d:number){const key=`b${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new T.BoxGeometry(w,h,d));return part(p,geometries.get(key)!,c,x,y,z)}
export function ball(p:T.Group,c:number,x:number,y:number,z:number,r:number){const key=`s${r}`;if(!geometries.has(key))geometries.set(key,new T.IcosahedronGeometry(r,0));return part(p,geometries.get(key)!,c,x,y,z)}
export function tree(p:T.Group,x:number,z:number,v=0,s=1){let g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);part(g,new T.CylinderGeometry(.045,.07,.7,5),0x77573a,0,.35,0);if(v%2===0){for(let j=0;j<3;j++)part(g,new T.ConeGeometry(.35-j*.065,.55,7),[0x47755a,0x57856a,0x396650][(v+j)%3],0,.55+j*.23,0)}else{ball(g,0x73966a,-.12,.78,0,.33);ball(g,0x8ba66e,.15,.85,.04,.31);ball(g,0x668d61,0,1.07,0,.29)}}
function fence(p:T.Group,z:number){for(let x=-.45;x<=.46;x+=.3)box(p,0xbca57a,x,.17,z,.045,.34,.045);for(let y=.13;y<.3;y+=.13)box(p,0xcdb68c,0,y,z,.95,.035,.035)}
function house(p:T.Group,big=false,lumber=false,store=false){let w=big?.83:.64,h=big?.7:.48,d=.62;box(p,0xa38d6d,0,.06,0,w+.08,.12,d+.08);box(p,store?0xb58e5b:0xf1dfb8,0,h/2+.1,0,w,h,d);for(let x of [-w/2,w/2])box(p,0x866345,x,h/2+.1,.32,.045,h,.025);box(p,0x866345,0,.2,.325,.16,.32,.035);box(p,0xc7a36d,.025,.19,.35,.02,.025,.025);for(let x of [-.22,.22]){box(p,0x876541,x,.42,.322,.16,.17,.035);box(p,0x91b7b2,x,.42,.345,.115,.12,.02);box(p,0xe5d8b0,x,.42,.36,.018,.13,.015)}let roof=new T.BufferGeometry();let rw=w/2+.12,rd=d/2+.1,base=h+.1,peak=base+.38;roof.setAttribute('position',new T.Float32BufferAttribute([-rw,base,-rd,rw,base,-rd,0,peak,-rd,-rw,base,rd,0,peak,rd,rw,base,rd,-rw,base,-rd,0,peak,-rd,0,peak,rd,-rw,base,-rd,0,peak,rd,-rw,base,rd,rw,base,-rd,rw,base,rd,0,peak,rd,rw,base,-rd,0,peak,rd,0,peak,-rd],3));roof.computeVertexNormals();const roofMesh=part(p,roof,lumber?0x5d7978:store?0x967655:0xba7051);(roofMesh.material as T.MeshStandardMaterial).side=T.DoubleSide;box(p,0xe3d3b4,.2,peak-.06,-.12,.13,.4,.13);box(p,0x9c8a72,.2,peak+.15,-.12,.17,.06,.17);for(let j=0;j<3;j++)box(p,0x78553c,-.27+j*.24,.11,.48,.19,.035,.16);if(lumber){for(let j=0;j<4;j++){let log=part(p,new T.CylinderGeometry(.075,.075,.46,7),0x9f7a4c,.43,.1+j%2*.13,-.16+Math.floor(j/2)*.18);log.rotation.x=Math.PI/2}}if(store){for(let x of [-.38,.38]){box(p,0xb4935e,x,.16,.43,.2,.3,.2);box(p,0x735b3f,x,.17,.535,.22,.03,.02)}}ball(p,0x759557,-.43,.13,.32,.16)}
function createModel(kind:Kind){let p=new T.Group();if(kind==='forest'){tree(p,-.23,-.2,0,.88);tree(p,.23,-.03,1,.79);tree(p,-.08,.27,2,.7)}else if(kind==='house'||kind==='manor'||kind==='lumber'||kind==='store')house(p,kind==='manor',kind==='lumber',kind==='store');else if(kind==='berry'||kind==='farm'){for(let z of [-.3,0,.3]){box(p,0x816044,0,.035,z,.9,.065,.18);for(let x=-.34;x<.4;x+=.17){if(kind==='berry'){ball(p,0x5f894c,x,.15,z,.12);for(let k=0;k<2;k++)ball(p,0xc25b50,x+(k-.5)*.07,.24,z,.037)}else{for(let k=0;k<3;k++){let a=x+(k-1)*.035;box(p,0xb49d50,a,.2,z,.014,.35,.014);part(p,new T.ConeGeometry(.035,.14,4),0xe6c776,a,.4,z)}}}}fence(p,-.49);if(kind==='farm'){box(p,0xa28b52,.4,.2,.4,.12,.4,.1);box(p,0xd8c596,.4,.35,.4,.34,.12,.1)}}else if(kind==='garden'){part(p,new T.CylinderGeometry(.28,.32,.12,10),0xb8b5a0,0,.07,0);part(p,new T.CylinderGeometry(.22,.22,.04,12),0x7eafb5,0,.15,0);part(p,new T.CylinderGeometry(.05,.08,.28,8),0xc8c2a9,0,.25,0);ball(p,0xced2b5,0,.42,0,.09);for(let j=0;j<8;j++){let a=j/8*Math.PI*2;ball(p,0x678952,Math.cos(a)*.4,.12,Math.sin(a)*.4,.13);ball(p,j%2?0xdfae86:0xe8d7aa,Math.cos(a)*.4,.24,Math.sin(a)*.4,.055)}}else if(kind==='festival'){for(let x of [-.35,.35])box(p,0x8b6748,x,.4,0,.04,.8,.04);box(p,0xd8ba70,0,.73,0,.75,.035,.035);for(let j=0;j<5;j++)part(p,new T.ConeGeometry(.08,.18,3),j%2?0xa86155:0xe4c77a,-.28+j*.14,.64,0)}else{for(let j=0;j<3;j++){ball(p,0xc6a76d,(j-1)*.2,.18,0,.2);box(p,0x7c8d51,(j-1)*.2,.36,0,.04,.15,.04)}}return p}


// Bake a model once, merging meshes that share a material. Instances reuse GPU buffers.
const templates = new Map<Kind, T.Group>();
function berryPlot(){
  const plot=new T.Group();
  let order=0;
  for(const z of [-.3,0,.3]){
    box(plot,0x816044,0,.035,z,.9,.065,.18);
    for(let x=-.34;x<.4;x+=.17){
      const plant=new T.Group();plant.position.set(x,.065,z);plant.userData.plantOrder=order++;
      ball(plant,0x5f894c,0,.085,0,.12);
      for(let i=0;i<2;i++)ball(plant,0xc25b50,(i-.5)*.07,.175,0,.037);
      plot.add(plant);
    }
  }
  fence(plot,-.49);return plot;
}
function wheatPlot(){
  const plot=new T.Group();let order=0;
  for(const z of [-.3,0,.3]){box(plot,0x816044,0,.025,z,.9,.05,.18);for(let x=-.34;x<.4;x+=.17){
    const plant=new T.Group();plant.position.set(x,0,z);plant.userData.cropOrder=order++;
    for(let j=0;j<3;j++){box(plant,0xb5a45b,(j-1)*.035,.19,0,.015,.32,.018);part(plant,new T.ConeGeometry(.036,.15,4),0xe7cf83,(j-1)*.035,.39,0)}plot.add(plant);
  }}fence(plot,-.49);return plot;
}
function fishingHut(){
  const g=new T.Group();box(g,0x86674d,0,.04,-.22,.62,.08,.59);box(g,0xd5c498,0,.29,-.24,.48,.5,.42);
  const roof=part(g,new T.ConeGeometry(.46,.34,4),0x668d91,0,.68,-.24);roof.rotation.y=Math.PI/4;
  box(g,0x785e47,0,.22,-.01,.15,.34,.025);box(g,0x8cb9b0,-.15,.39,-.015,.12,.13,.025);
  for(let i=0;i<12;i++)box(g,i%2?0xb49a70:0xcab184,0,.025,.25+i*.095,.39,.045,.087);
  for(const x of [-.15,.15])for(const z of [.45,1.15])box(g,0x826c52,x,-.18,z,.045,.43,.045);
  part(g,new T.CylinderGeometry(.095,.075,.15,8),0x7f9993,.28,.1,.13);
  box(g,0xc9b78f,-.27,.14,.03,.13,.25,.15);return g;
}
export function model(kind: Kind): T.Group {
  if(kind==='fisher'||kind==='farm'){
    if(!templates.has(kind))templates.set(kind,kind==='fisher'?fishingHut():wheatPlot());
    return templates.get(kind)!.clone();
  }
  if(kind==='forest'){
    if(!templates.has(kind)){
      const plot=new T.Group();tree(plot,-.23,-.2,0,.88);tree(plot,.23,-.03,1,.79);tree(plot,-.08,.27,2,.7);
      plot.children.forEach((t,i)=>t.userData.treeIndex=i);templates.set(kind,plot);
    }
    return templates.get(kind)!.clone();
  }
  if(kind==='berry'){
    if(!templates.has(kind))templates.set(kind,berryPlot());
    return templates.get(kind)!.clone();
  }
  let template = templates.get(kind);
  if (!template) {
    const source = createModel(kind);
    source.updateMatrixWorld(true);
    const batches = new Map<T.Material, T.BufferGeometry[]>();
    source.traverse(object => {
      if (!(object instanceof T.Mesh)) return;
      const mat = object.material as T.Material;
      const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
      if (!batches.has(mat)) batches.set(mat, []);
      batches.get(mat)!.push(geometry);
    });
    template = new T.Group();
    for (const [mat, geometries] of batches) {
      const merged = mergeGeometries(geometries, false);
      geometries.forEach(g => g.dispose());
      if (!merged) continue;
      const mesh = new T.Mesh(merged, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      template.add(mesh);
    }
    templates.set(kind, template);
  }
  return template.clone();
}

