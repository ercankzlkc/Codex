import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Kind} from './game';
const mats=new Map<number,T.MeshStandardMaterial>();const geometries=new Map<string,T.BufferGeometry>();
function material(c:number){if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.95,flatShading:true}));return mats.get(c)!}
export function part(p:T.Group,g:T.BufferGeometry,c:number,x=0,y=0,z=0){const m=new T.Mesh(g,material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
export function box(p:T.Group,c:number,x:number,y:number,z:number,w:number,h:number,d:number){const key=`b${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new T.BoxGeometry(w,h,d));return part(p,geometries.get(key)!,c,x,y,z)}
export function ball(p:T.Group,c:number,x:number,y:number,z:number,r:number){const key=`s${r}`;if(!geometries.has(key))geometries.set(key,new T.IcosahedronGeometry(r,0));return part(p,geometries.get(key)!,c,x,y,z)}
export function tree(p:T.Group,x:number,z:number,v=0,s=1){
  const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);
  const variant=v%10,h=.65+(variant%3)*.1;
  part(g,new T.CylinderGeometry(.035,.065,h,6),variant%2?0x806044:0x705137,0,h/2,0);
  const colors=[0x47755a,0x73966a,0x568568,0x8ba66e,0x396650,0x67945d,0x658875,0x94aa70,0x4c7952,0x7d9d59];
  if(variant<4){for(let j=0;j<3+variant%2;j++)part(g,new T.ConeGeometry(.29-j*.047,.46,6+variant),colors[(variant+j)%10],0,h*.65+j*.2,0)}
  else if(variant<8){for(let j=0;j<4;j++){const a=j*2.4;const leaf=ball(g,colors[(variant+j)%10],Math.cos(a)*.15,h+.12+j*.065,Math.sin(a)*.13,.26+(variant%2)*.035);leaf.scale.y=variant===7?1.5:1}}
  else{for(let j=0;j<3;j++){const leaf=ball(g,colors[variant],(j-1)*.13,h+j*.17,0,.25);leaf.scale.set(.85,1.3,.85)}}
}
let wheatTemplate:T.Group|undefined;
function wheatTuft(){
  if(wheatTemplate)return wheatTemplate.clone();
  const source=new T.Group();
  for(let stalk=0;stalk<3;stalk++){
    const stem=new T.Group(),height=.31+stalk*.025,lean=(stalk-1)*.13;stem.position.set((stalk-1)*.033,0,(stalk%2)*.022);stem.rotation.z=lean;source.add(stem);
    part(stem,new T.CylinderGeometry(.0035,.005,height,5),0xc4a555,0,height/2,0);
    for(let leaf=0;leaf<2;leaf++){
      const sign=leaf?1:-1,base=height*(.36+leaf*.2),blade=new T.BufferGeometry();
      blade.setAttribute('position',new T.Float32BufferAttribute([0,base,0,sign*.052,base+.035,.013,sign*.075,base+.022,0,0,base,0,sign*.075,base+.022,0,sign*.052,base+.035,-.013],3));blade.computeVertexNormals();const m=part(stem,blade,leaf?0xcbb669:0xa79c50);(m.material as T.MeshStandardMaterial).side=T.DoubleSide;
    }
    for(let row=0;row<5;row++)for(const sign of [-1,1]){
      const y=height-.01+row*.022,z=(row%2-.5)*.009,width=.011*(1-row*.09);
      const grain=ball(stem,sign<0?0xe2bb5d:0xf0d17c,sign*.011,y,z,.018);grain.scale.set(width/.018,1.25,.65);grain.rotation.z=-sign*.48;
      const awn=part(stem,new T.CylinderGeometry(.0008,.0014,.047,3),0xe6ce8c,sign*.021,y+.03,z);awn.rotation.z=-sign*.33;
    }
    const tip=part(stem,new T.ConeGeometry(.008,.04,5),0xe9c969,0,height+.112,0);tip.rotation.z=-.06;
  }
  source.updateMatrixWorld(true);const batches=new Map<T.Material,T.BufferGeometry[]>();
  source.traverse(o=>{if(o instanceof T.Mesh){const mat=o.material as T.Material;if(!batches.has(mat))batches.set(mat,[]);batches.get(mat)!.push(o.geometry.clone().applyMatrix4(o.matrixWorld))}});
  wheatTemplate=new T.Group();for(const [mat,parts] of batches){const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());if(geometry){const mesh=new T.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;wheatTemplate.add(mesh)}}
  return wheatTemplate.clone();
}
const resourceTemplates=new Map<string,T.Group>();
export function resourceModel(kind:string){
  const cached=resourceTemplates.get(kind);if(cached)return cached.clone();
  const g=new T.Group();
  if(kind==='wood')for(let i=0;i<3;i++){
    const log=new T.Group();log.position.set((i%2-.5)*.065,.035+Math.floor(i/2)*.058,0);g.add(log);
    const bark=part(log,new T.CylinderGeometry(.035,.035,.22,8),0x88603c);bark.rotation.x=Math.PI/2;
    for(const z of [-.112,.112]){const end=part(log,new T.CircleGeometry(.028,8),0xd6b17c,0,0,z);end.rotation.y=z<0?Math.PI:0}
  }
  else if(kind==='fish')for(let i=0;i<2;i++){const fish=new T.Group();fish.position.set((i-.5)*.065,.035,0);const body=ball(fish,0x8fb9bf,0,0,0,.065);body.scale.set(.45,.5,1.4);const tail=part(fish,new T.ConeGeometry(.034,.052,3),0x588e9b,0,0,-.10);tail.rotation.x=Math.PI/2;ball(fish,0x243c3b,.022,.014,.055,.008);g.add(fish)}
  else if(kind==='wheat'){
    const bundle=wheatTuft();bundle.scale.setScalar(.55);bundle.position.y=-.025;bundle.rotation.z=.22;g.add(bundle);
    const tie=part(g,new T.TorusGeometry(.026,.005,4,8),0x9c7950,0,.07,0);tie.rotation.x=Math.PI/2;
  }
  else if(kind==='berry') {for(let i=0;i<6;i++){const x=(i%3-1)*.048,z=(Math.floor(i/3)-.5)*.055;const fruit=ball(g,0xd65d53,x,.032,z,.034);fruit.scale.y=1.15;part(g,new T.ConeGeometry(.026,.018,5),0x5e8d4a,x,.072,z)}}
  else if(kind==='stone')for(let i=0;i<3;i++)ball(g,0x97a6a0,(i%2-.5)*.065,.035+Math.floor(i/2)*.045,0,.052);
  else for(let i=0;i<3;i++){box(g,0x6e9050,(i-1)*.04,.05,0,.01,.13,.01);ball(g,0xe7c08c,(i-1)*.04,.12,0,.03)}
  resourceTemplates.set(kind,g);return g.clone();
}

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
  for(const z of [-.3,0,.3]){
    box(plot,0x816044,0,.022,z,.9,.044,.17);
    for(let x=-.34;x<.4;x+=.14){
      const plant=wheatTuft();plant.position.set(x+Math.sin(order*7)*.012,.025,z+Math.cos(order*5)*.014);plant.userData.cropOrder=order++;
      plant.userData.cropHeight=.9+(order%5)*.045;plant.scale.y=plant.userData.cropHeight;plant.rotation.y=order*2.399;
      plot.add(plant);
    }
  }
  fence(plot,-.49);return plot;
}
function flowerGarden(){
  const g=new T.Group();part(g,new T.CylinderGeometry(.28,.32,.12,10),0xb8b5a0,0,.07,0);part(g,new T.CylinderGeometry(.22,.22,.04,12),0x7eafb5,0,.15,0);part(g,new T.CylinderGeometry(.05,.08,.28,8),0xc8c2a9,0,.25,0);ball(g,0xced2b5,0,.42,0,.09);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,flower=new T.Group();flower.position.set(Math.cos(a)*.4,0,Math.sin(a)*.4);flower.userData.flowerOrder=i;ball(flower,0x678952,0,.12,0,.13);ball(flower,i%2?0xdfae86:0xe8d7aa,0,.24,0,.055);g.add(flower)}return g;
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
  if(kind==='stone'){if(!templates.has(kind)){const g=new T.Group();for(let i=0;i<3;i++){const rock=new T.Group();rock.userData.treeIndex=i;rock.position.set([-.27,.24,0][i],0,[-.18,-.1,.29][i]);const m=ball(rock,[0x8c9a99,0xa5afa5,0x7c8e8b][i],0,.13,0,.23);m.scale.set(1,.85,1.05);ball(rock,0xc7c3a4,.08,.23,.05,.055);g.add(rock)}templates.set(kind,g)}return templates.get(kind)!.clone()}
  if(kind==='garden'){if(!templates.has(kind))templates.set(kind,flowerGarden());return templates.get(kind)!.clone()}
  if(kind==='fisher'||kind==='farm'){
    if(!templates.has(kind))templates.set(kind,kind==='fisher'?fishingHut():wheatPlot());
    return templates.get(kind)!.clone();
  }
  if(kind==='forest'){
    const plot=new T.Group(),offset=Math.random()*Math.PI*2;
    for(let i=0;i<3;i++){const a=offset+i*Math.PI*2/3+(Math.random()-.5)*.32,r=.40+Math.random()*.10;tree(plot,Math.cos(a)*r,Math.sin(a)*r,Math.floor(Math.random()*10),.66+Math.random()*.17);plot.children[i].userData.treeIndex=i}
    return plot;
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

