import {koiFish} from './koi';
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Kind} from './game';
const mats=new Map<number,T.MeshStandardMaterial>();const geometries=new Map<string,T.BufferGeometry>();
function material(c:number){if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.84,flatShading:true}));return mats.get(c)!}
export function part(p:T.Group,g:T.BufferGeometry,c:number,x=0,y=0,z=0){const m=new T.Mesh(g,material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m}
export function box(p:T.Group,c:number,x:number,y:number,z:number,w:number,h:number,d:number){const key=`b${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new RoundedBoxGeometry(w,h,d,1,Math.min(.012,Math.min(w,h,d)*.16)));return part(p,geometries.get(key)!,c,x,y,z)}
export function ball(p:T.Group,c:number,x:number,y:number,z:number,r:number){const key=`s${r}`;if(!geometries.has(key))geometries.set(key,new T.IcosahedronGeometry(r,1));return part(p,geometries.get(key)!,c,x,y,z)}
/** Keep decorative detail in shared material batches, with consistent geometry attributes. */
function batchParts(root:T.Group){
  root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),batches=new Map<T.Material,T.BufferGeometry[]>();
  root.traverse(object=>{if(object instanceof T.Mesh){const geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();geometry.deleteAttribute('uv');geometry.applyMatrix4(inverse.clone().multiply(object.matrixWorld));const mat=object.material as T.Material;if(!batches.has(mat))batches.set(mat,[]);batches.get(mat)!.push(geometry)}});
  root.clear();for(const [mat,parts] of batches){const merged=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());if(merged){const indexed=mergeVertices(merged,1e-6);merged.dispose();const mesh=new T.Mesh(indexed,mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh)}}
}
const treeTemplates=new Map<number,T.Group>();
export function tree(p:T.Group,x:number,z:number,v=0,s=1){
  const cached=treeTemplates.get(v%10);
  if(cached){const g=cached.clone();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);return}
  const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);
  const variant=v%10,h=.65+(variant%3)*.1;
  part(g,new T.CylinderGeometry(.035,.065,h,8),variant%2?0x806044:0x705137,0,h/2,0);
  const colors=[0x47755a,0x73966a,0x568568,0x8ba66e,0x396650,0x67945d,0x658875,0x94aa70,0x4c7952,0x7d9d59];
  if(variant<4){for(let j=0;j<3+variant%2;j++)part(g,new T.ConeGeometry(.29-j*.047,.46,9+variant),colors[(variant+j)%10],0,h*.65+j*.2,0)}
  else if(variant<8){for(let j=0;j<4;j++){const a=j*2.4;const leaf=ball(g,colors[(variant+j)%10],Math.cos(a)*.15,h+.12+j*.065,Math.sin(a)*.13,.26+(variant%2)*.035);leaf.scale.y=variant===7?1.5:1}}
  else{for(let j=0;j<3;j++){const leaf=ball(g,colors[variant],(j-1)*.13,h+j*.17,0,.25);leaf.scale.set(.85,1.3,.85)}}
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;beam(g,0x806044,new T.Vector3(0,.12,0),new T.Vector3(Math.cos(a)*.1,.015,Math.sin(a)*.1),.026)}
  batchParts(g);
  const template=g.clone();template.position.set(0,0,0);template.scale.setScalar(1);treeTemplates.set(variant,template);
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
  wheatTemplate=new T.Group();for(const [mat,parts] of batches){const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());if(geometry){const indexed=mergeVertices(geometry,1e-6);geometry.dispose();const mesh=new T.Mesh(indexed,mat);mesh.castShadow=true;mesh.receiveShadow=true;wheatTemplate.add(mesh)}}
  return wheatTemplate.clone();
}
const resourceTemplates=new Map<string,T.Group>();
export function resourceModel(kind:string){
  if(kind==='fish'){const group=new T.Group();for(let i=0;i<2;i++){const fish=koiFish(.19);fish.position.set((i-.5)*.065,.035,0);group.add(fish)}return group;}
  const cached=resourceTemplates.get(kind);if(cached)return cached.clone();
  const g=new T.Group();
  if(kind==='wood')for(let i=0;i<3;i++){
    const log=new T.Group();log.position.set((i%2-.5)*.065,.035+Math.floor(i/2)*.058,0);g.add(log);
    const bark=part(log,new T.CylinderGeometry(.035,.035,.22,8),0x88603c);bark.rotation.x=Math.PI/2;
    for(const z of [-.112,.112]){const end=part(log,new T.CircleGeometry(.028,8),0xd6b17c,0,0,z);end.rotation.y=z<0?Math.PI:0}
  }
  else if(kind==='wheat'){
    const bundle=wheatTuft();bundle.scale.setScalar(.55);bundle.position.y=-.025;bundle.rotation.z=.22;g.add(bundle);
    const tie=part(g,new T.TorusGeometry(.026,.005,4,8),0x9c7950,0,.07,0);tie.rotation.x=Math.PI/2;
  }
  else if(kind==='berry') {for(let i=0;i<6;i++){const x=(i%3-1)*.048,z=(Math.floor(i/3)-.5)*.055;const fruit=ball(g,0xd65d53,x,.032,z,.034);fruit.scale.y=1.15;part(g,new T.ConeGeometry(.026,.018,5),0x5e8d4a,x,.072,z)}}
  else if(kind==='stone')for(let i=0;i<3;i++)ball(g,0x97a6a0,(i%2-.5)*.065,.035+Math.floor(i/2)*.045,0,.052);
  else for(let i=0;i<3;i++){box(g,0x6e9050,(i-1)*.04,.05,0,.01,.13,.01);ball(g,0xe7c08c,(i-1)*.04,.12,0,.03)}
  resourceTemplates.set(kind,g);return g.clone();
}

/** A single readable item for the hand-to-storage flight, sharing cached assets. */
export function resourceUnitModel(kind:string){
  const group=resourceModel(kind);
  if(kind!=='wheat'){
    const keep=group.children.slice(0,kind==='berry'||kind==='happy'?2:1);
    group.clear();for(const item of keep){item.position.x=0;item.position.z=0;group.add(item)}
  }
  return group;
}

function beam(p:T.Group,color:number,a:T.Vector3,b:T.Vector3,width=.025){
  const delta=b.clone().sub(a),m=box(p,color,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,width,delta.length(),width);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;
}
function windowFrame(p:T.Group,x:number,y:number,z:number,shutters=true){
  box(p,0x694f3c,x,y,z,.16,.19,.022);box(p,0x84b4b7,x,y,z+.014,.123,.148,.014);
  box(p,0xe8d6ae,x,y,z+.026,.014,.153,.015);box(p,0xe8d6ae,x,y,z+.027,.13,.014,.015);
  box(p,0xb59a70,x,y-.105,z+.027,.19,.028,.055);
  if(shutters)for(const sign of [-1,1]){box(p,0x6c8d84,x+sign*.108,y,z+.008,.048,.17,.023);for(let k=0;k<3;k++)box(p,0x54786e,x+sign*.108,y-.045+k*.045,z+.022,.039,.009,.01)}
}
function tiledRoof(p:T.Group,w:number,d:number,base:number,rise:number,tint:number){
  const run=w/2+.085,depth=d+.16,angle=Math.atan2(rise,run),slope=Math.hypot(run,rise);
  // Closed roof shell, then four staggered rows of gently bevelled tiles.
  const shell=new T.BufferGeometry(),v=[-run,base,-depth/2,run,base,-depth/2,0,base+rise,-depth/2,-run,base,depth/2,0,base+rise,depth/2,run,base,depth/2,-run,base,-depth/2,0,base+rise,-depth/2,0,base+rise,depth/2,-run,base,-depth/2,0,base+rise,depth/2,-run,base,depth/2,run,base,-depth/2,run,base,depth/2,0,base+rise,depth/2,run,base,-depth/2,0,base+rise,depth/2,0,base+rise,-depth/2];
  shell.setAttribute('position',new T.Float32BufferAttribute(v,3));shell.computeVertexNormals();const cover=part(p,shell,0x775b48);(cover.material as T.Material).side=T.DoubleSide;
  const baseColor=new T.Color(tint);
  for(const sign of [-1,1])for(let row=0;row<4;row++)for(let col=0;col<7+(row%2);col++){
    const t=(row+.5)/4,x=sign*run*t,y=base+rise*(1-t)+.014;
    const left=Math.max(-depth/2,-depth/2+(col-(row%2)*.5)*depth/7),right=Math.min(depth/2,-depth/2+(col+1-(row%2)*.5)*depth/7),z=(left+right)/2;
    const c=baseColor.clone().multiplyScalar([.94,1,1.055][(row*3+col*5+(sign+1))%3]).getHex();
    const tile=box(p,c,x,y,z,slope/4+.018,.026,Math.max(.015,right-left-.005));tile.rotation.z=-sign*angle;
  }
  for(let i=0;i<8;i++){const cap=part(p,new T.CylinderGeometry(.028,.028,depth/8+.008,6),tint,0,base+rise+.027,-depth/2+(i+.5)*depth/8);cap.rotation.x=Math.PI/2}
  for(const z of [-depth/2-.008,depth/2+.008])for(const sign of [-1,1])beam(p,0x795b42,new T.Vector3(sign*run,base-.012,z),new T.Vector3(0,base+rise,z),.035);
}
function barrel(p:T.Group,x:number,z:number){
  part(p,new T.CylinderGeometry(.077,.065,.20,10),0xae8c5d,x,.10,z);
  for(const y of [.035,.15]){const hoop=part(p,new T.TorusGeometry(.071,.007,4,10),0x667571,x,y,z);hoop.rotation.x=Math.PI/2}
  part(p,new T.CylinderGeometry(.065,.065,.012,10),0xc5a777,x,.206,z);
}
function crate(p:T.Group,x:number,z:number){
  box(p,0xb49765,x,.105,z,.18,.20,.17);
  for(const y of [.04,.17])box(p,0x816347,x,y,z+.09,.19,.023,.018);
  beam(p,0x8d704b,new T.Vector3(x-.073,.035,z+.102),new T.Vector3(x+.073,.175,z+.102),.019);
}
function house(p:T.Group,big=false,lumber=false,store=false){
  const w=big?.83:.64,h=big?.70:.49,d=.60,wall=store?0xc7af81:lumber?0xd9c8a2:0xf0dfb8;
  box(p,0x9e9b83,0,.045,0,w+.08,.09,d+.07);
  for(let i=0;i<5;i++)box(p,i%2?0xb9b59b:0xaaa78f,-w/2+(i+.5)*w/5,.09,d/2+.025,w/5-.009,.075,.05);
  box(p,wall,0,h/2+.12,0,w,h,d);
  box(p,0x9d805b,0,.15,d/2+.014,w,.04,.026);box(p,0xc0a57c,0,h+.102,d/2+.012,w,.035,.035);
  for(const x of [-w/2+.012,w/2-.012])for(const z of [-d/2-.008,d/2+.012])box(p,0x816347,x,h/2+.13,z,.035,h+.04,.035);
  const doorZ=d/2+.035,doorW=store?.23:.145;
  box(p,0x70503a,0,.26,doorZ,doorW+.036,.32,.034);
  for(let i=0;i<(store?5:3);i++)box(p,i%2?0x92704c:0xa17c50,-doorW/2+(i+.5)*doorW/(store?5:3),.26,doorZ+.021,doorW/(store?5:3)-.004,.28,.02);
  part(p,new T.SphereGeometry(.008,6,4),0xe0bf6c,.047,.255,doorZ+.038);
  box(p,0xb6b49b,0,.075,.42,.29,.045,.16);box(p,0xc9c4a8,0,.035,.49,.35,.035,.14);
  const windowY=h*.64+.12;for(const x of [-w*.32,w*.32])windowFrame(p,x,windowY,d/2+.022,!store);
  if(big){box(p,0x9c805c,0,h*.62+.12,d/2+.025,w,.025,.026);windowFrame(p,0,h+.17,d/2+.023,false)}
  const gable=new T.BufferGeometry();gable.setAttribute('position',new T.Float32BufferAttribute([-w/2,h+.12,d/2,w/2,h+.12,d/2,0,h+.45,d/2,w/2,h+.12,-d/2,-w/2,h+.12,-d/2,0,h+.45,-d/2],3));gable.computeVertexNormals();part(p,gable,wall);
  tiledRoof(p,w,d,h+.12,.34,lumber?0x628783:store?0x9d805b:big?0x758c80:0xb77255);
  const cx=w*.27,cz=-.14;
  box(p,0xc3b397,cx,h+.42,cz,.105,.31,.105);for(let i=0;i<3;i++)box(p,0xa78d70,cx,h+.32+i*.07,cz+.056,.108,.012,.012);
  box(p,0x887762,cx,h+.58,cz,.14,.035,.14);box(p,0x4d574c,cx,h+.60,cz,.074,.012,.075);
  // Restrained blue door canopy and lantern give every building the same craft language.
  const awning=box(p,lumber?0x66877c:0x789c95,0,.47,doorZ+.055,doorW+.09,.027,.15);awning.rotation.x=.12;
  box(p,0x746047,.13,.37,doorZ+.04,.012,.10,.012);box(p,0xe8c782,.13,.34,doorZ+.057,.035,.048,.032);
  if(store){crate(p,-.38,.43);barrel(p,.37,.40)}
  else if(lumber){for(let j=0;j<5;j++){const log=resourceModel('wood');log.position.set(.36,.02+Math.floor(j/2)*.07,-.17+(j%2)*.13);log.scale.setScalar(.7);p.add(log)}}
  else{const planter=new T.Group();planter.position.set(-.26,0,.42);box(planter,0x92714e,0,.11,0,.19,.12,.095);for(let j=0;j<3;j++){const leaf=ball(planter,0x739458,(j-1)*.05,.195,0,.049);leaf.scale.y=.65;ball(planter,j%2?0xdab677:0xc98268,(j-1)*.05,.225,.006,.018)}p.add(planter)}
}
let kingdomTemplate:T.Group|null=null;
/** A small coastal royal hall, sharing the village's stone, timber and tiled roofs. */
export function kingdomCenter():T.Group{
  if(kingdomTemplate)return kingdomTemplate.clone();
  const hall=new T.Group();hall.name='kingdom-center';
  const stone=0xc3bea2,wall=0xead9ae,timber=0x806044,teal=0x547f79,gold=0xcfaa58;
  // Broad dressed-stone base and two low entrance steps keep the door accessible.
  box(hall,stone,0,.065,0,.86,.13,.72);
  for(let row=0;row<2;row++)for(let i=0;i<6;i++)box(hall,i%2?0xb8b296:0xd0c8a9,-.36+i*.145,row*.058+.037,.365,.136,.051,.045);
  box(hall,0xd1c6a4,0,.04,.46,.36,.065,.19);box(hall,0xbab195,0,.075,.39,.29,.07,.14);
  box(hall,wall,0,.48,0,.79,.72,.62);
  for(const x of [-.39,.39])for(const z of [-.30,.31])box(hall,timber,x,.48,z,.045,.74,.045);
  for(const y of [.17,.62,.83])box(hall,timber,0,y,.322,.81,.035,.032);
  // Tall double door, brass straps and a crown seal distinguish the public entrance.
  box(hall,0x725336,0,.33,.332,.22,.39,.04);
  for(const x of [-.055,.055]){
    box(hall,0x98774b,x,.33,.36,.097,.35,.024);
    for(const y of [.23,.42])box(hall,gold,x,y,.377,.085,.014,.012);
    ball(hall,gold,x*.26,.33,.38,.011);
  }
  for(const x of [-.137,.137])box(hall,stone,x,.34,.35,.04,.44,.06);
  box(hall,stone,0,.56,.35,.31,.045,.06);
  const seal=new T.Group();seal.position.set(0,.735,.354);hall.add(seal);
  part(seal,new T.CylinderGeometry(.077,.077,.025,8).rotateX(Math.PI/2),teal);
  box(seal,gold,0,-.015,.023,.085,.032,.016);
  for(const [x,y] of [[-.033,.022],[0,.036],[.033,.022]]){
    box(seal,gold,x,y-.018,.023,.016,.055,.016);ball(seal,gold,x,y+.011,.023,.013);
  }
  for(const x of [-.275,.275]){
    windowFrame(hall,x,.45,.328,true);
    box(hall,0x77866b,x,.355,.354,.17,.035,.09);
  }
  tiledRoof(hall,.88,.77,.85,.32,0xa66f50);
  box(hall,gold,0,1.18,0,.91,.025,.035);
  // The rear bell tower stays within the centre's existing navigation footprint.
  const tower=new T.Group();tower.position.set(-.33,0,-.21);hall.add(tower);
  part(tower,new T.CylinderGeometry(.18,.215,1.03,8),stone,0,.54,0);
  for(const y of [.22,.58,.94])part(tower,new T.CylinderGeometry(.193,.193,.045,8),0xa49c80,0,y,0);
  for(const x of [-.115,.115])box(tower,timber,x,1.16,0,.03,.27,.22);
  box(tower,teal,0,1.3,0,.29,.055,.27);
  part(tower,new T.CylinderGeometry(.058,.083,.10,8),gold,0,1.13,0);
  part(tower,new T.ConeGeometry(.265,.35,8),teal,0,1.49,0);
  box(tower,timber,0,1.82,0,.018,.34,.018);
  const flag=new T.Shape();flag.moveTo(.01,0);flag.lineTo(.25,-.035);flag.lineTo(.19,-.105);flag.lineTo(.25,-.175);flag.lineTo(.01,-.175);flag.closePath();
  const banner=part(tower,new T.ShapeGeometry(flag),teal,0,1.95,0);(banner.material as T.MeshStandardMaterial).side=T.DoubleSide;
  box(tower,gold,.075,1.86,.009,.085,.016,.018);
  // A matching pair of small pennants frames the royal hall's doorway.
  for(const x of [-.38,.38]){
    box(hall,timber,x,.70,.38,.012,.31,.012);
    box(hall,teal,x,.69,.39,.08,.18,.013);box(hall,gold,x,.72,.40,.05,.013,.008);
    part(hall,new T.ConeGeometry(.041,.055,3),teal,x,.58,.39);
  }
  batchParts(hall);kingdomTemplate=hall;return hall.clone();
}

function createModel(kind:Kind){let p=new T.Group();if(kind==='forest'){tree(p,-.23,-.2,0,.88);tree(p,.23,-.03,1,.79);tree(p,-.08,.27,2,.7)}else if(kind==='house'||kind==='manor'||kind==='lumber'||kind==='store')house(p,kind==='manor',kind==='lumber',kind==='store');else if(kind==='berry'||kind==='farm'){for(let z of [-.3,0,.3]){box(p,0x816044,0,.035,z,.9,.065,.18);for(let x=-.34;x<.4;x+=.17){if(kind==='berry'){ball(p,0x5f894c,x,.15,z,.12);for(let k=0;k<2;k++)ball(p,0xc25b50,x+(k-.5)*.07,.24,z,.037)}else{for(let k=0;k<3;k++){let a=x+(k-1)*.035;box(p,0xb49d50,a,.2,z,.014,.35,.014);part(p,new T.ConeGeometry(.035,.14,4),0xe6c776,a,.4,z)}}}}if(kind==='farm'){box(p,0xa28b52,.4,.2,.4,.12,.4,.1);box(p,0xd8c596,.4,.35,.4,.34,.12,.1)}}else if(kind==='garden'){part(p,new T.CylinderGeometry(.28,.32,.12,10),0xb8b5a0,0,.07,0);part(p,new T.CylinderGeometry(.22,.22,.04,12),0x7eafb5,0,.15,0);part(p,new T.CylinderGeometry(.05,.08,.28,8),0xc8c2a9,0,.25,0);ball(p,0xced2b5,0,.42,0,.09);for(let j=0;j<8;j++){let a=j/8*Math.PI*2;ball(p,0x678952,Math.cos(a)*.4,.12,Math.sin(a)*.4,.13);ball(p,j%2?0xdfae86:0xe8d7aa,Math.cos(a)*.4,.24,Math.sin(a)*.4,.055)}}else if(kind==='festival'){for(let x of [-.35,.35])box(p,0x8b6748,x,.4,0,.04,.8,.04);box(p,0xd8ba70,0,.73,0,.75,.035,.035);for(let j=0;j<5;j++)part(p,new T.ConeGeometry(.08,.18,3),j%2?0xa86155:0xe4c77a,-.28+j*.14,.64,0)}else{for(let j=0;j<3;j++){ball(p,0xc6a76d,(j-1)*.2,.18,0,.2);box(p,0x7c8d51,(j-1)*.2,.36,0,.04,.15,.04)}}return p}


// Bake a model once, merging meshes that share a material. Instances reuse GPU buffers.
const templates = new Map<Kind, T.Group>();
function berryPlot(){
  const plot=new T.Group();
  let order=0;
  for(const z of [-.3,0,.3]){
    box(plot,0x816044,0,.035,z,.9,.065,.18);
    for(let x=-.34;x<.4;x+=.17){
      const plant=new T.Group();plant.position.set(x,.065,z);plant.userData.plantOrder=order++;
      const leaves=new T.Group();plant.add(leaves);for(let j=0;j<5;j++){const a=j*2.4;const leaf=ball(leaves,j%2?0x71974e:0x5c8549,Math.cos(a)*.055,.065+Math.sin(j)*.012,Math.sin(a)*.045,.064);leaf.scale.set(1,.45,1.5);leaf.rotation.y=-a;}batchParts(leaves);
      for(let i=0;i<3;i++){const fruit=new T.Group();fruit.position.set((i-1)*.044,.12,(i%2)*.035);const berry=ball(fruit,0xcf6250,0,0,0,.029);berry.scale.set(.9,1.2,.85);for(let j=0;j<3;j++)ball(fruit,0xf1d299,Math.sin(j*2.3)*.018,.008-j*.01,.021,.0028);part(fruit,new T.ConeGeometry(.018,.013,5),0x587f43,0,.033,0);batchParts(fruit);plant.add(fruit)}
      plot.add(plant);
    }
  }
  return plot;
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
  return plot;
}
function flowerGarden(){
  const g=new T.Group();part(g,new T.CylinderGeometry(.28,.32,.12,10),0xb8b5a0,0,.07,0);part(g,new T.CylinderGeometry(.22,.22,.04,12),0x7eafb5,0,.15,0);part(g,new T.CylinderGeometry(.05,.08,.28,8),0xc8c2a9,0,.25,0);ball(g,0xced2b5,0,.42,0,.09);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,flower=new T.Group();flower.position.set(Math.cos(a)*.4,0,Math.sin(a)*.4);flower.userData.flowerOrder=i;ball(flower,0x678952,0,.12,0,.13);ball(flower,i%2?0xdfae86:0xe8d7aa,0,.24,0,.055);for(let petal=0;petal<5;petal++){const a=petal*Math.PI*2/5;const m=ball(flower,i%2?0xdba889:0xe9cf96,Math.cos(a)*.035,.25,Math.sin(a)*.035,.024);m.scale.y=.45}box(flower,0x6c884d,0,.17,0,.009,.12,.009);g.add(flower)}return g;
}
function fishingHut(){
  const g=new T.Group(),hut=new T.Group();hut.position.set(0,0,-.23);hut.scale.set(.76,.82,.76);house(hut,false,false,false);g.add(hut);
  // Pier dimensions and walkable centre stay unchanged.
  for(let i=0;i<12;i++){
    const z=.25+i*.095;box(g,i%3?0xbba078:0xcbb78c,0,.025,z,.39,.045,.087);
    for(const x of [-.125,.125])part(g,new T.CylinderGeometry(.004,.004,.002,5),0x777b68,x,.049,z);
  }
  for(const x of [-.15,.15])for(const z of [.45,1.15]){box(g,0x826c52,x,-.18,z,.045,.43,.045);part(g,new T.CylinderGeometry(.033,.033,.028,8),0xc6b28d,x,.055,z)}
  barrel(g,.28,.06);crate(g,-.27,.03);
  const coil=part(g,new T.TorusGeometry(.062,.009,5,14),0xccba8a,.28,.215,.06);coil.rotation.x=Math.PI/2;
  const net=new T.Group();net.position.set(.22,.14,-.28);net.rotation.z=.14;
  for(let i=0;i<5;i++)for(const sign of [-1,1])beam(net,0x9caf9a,new T.Vector3(-.07+i*.025,0,0),new T.Vector3(-.02+i*.025,.14,sign*.025),.004);g.add(net);
  return g;
}
/** Timber quay and a merchant cutter, kept separate for the arrival animation. */
function harbor(){
  const g=new T.Group();
  for(let i=0;i<13;i++)box(g,i%3?0xb19a75:0xc7b089,0,.015,.12+i*.095,.86,.07,.086);
  for(const x of [-.37,.37])for(const z of [.2,.78,1.26]){
    box(g,0x786049,x,-.18,z,.065,.47,.065);
    part(g,new T.CylinderGeometry(.046,.046,.035,8),0xd1bb91,x,.075,z);
  }
  box(g,0xd4c5a0,-.25,.3,-.24,.48,.6,.44);
  const boothRoof=new T.Group();boothRoof.position.set(-.25,0,-.24);g.add(boothRoof);tiledRoof(boothRoof,.51,.50,.61,.19,0x9d7254);
  windowFrame(g,-.25,.34,.0,false);box(g,0x735e48,-.25,.17,.01,.13,.32,.025);
  for(const x of [-.49,-.01])box(g,0x8a7557,x,.31,-.02,.025,.60,.025);
  const rope=new T.Mesh(new T.TorusGeometry(.065,.012,5,12),material(0xb6a27a));rope.rotation.y=Math.PI/2;rope.position.set(.36,.10,.5);g.add(rope);
  crate(g,.28,.12);barrel(g,.3,-.22);
  const sign=box(g,0x355f60,.38,.49,-.08,.3,.22,.04);
  box(g,0xcbb17a,.38,.48,-.05,.04,.15,.02);sign.rotation.y=-.1;
  for(let i=0;i<3;i++){crate(g,-.27+i*.25,.90);if(i%2===0)crate(g,-.27+i*.25,1.13)}
  const ship=new T.Group();ship.name='merchant';ship.position.set(1.12,-.31,2.6);
  const hullPoints:number[]=[],widths=[.03,.38,.62,.65,.58,.3,.015],zs=[-1.65,-1.35,-.8,0,.85,1.4,1.65];
  const ring=(i:number)=>[[-widths[i],.20],[-widths[i]*.9,-.10],[0,-.35],[widths[i]*.9,-.10],[widths[i],.20]];
  for(let i=0;i<zs.length-1;i++)for(let side=0;side<4;side++){
    const a=ring(i)[side],b=ring(i+1)[side],c=ring(i)[side+1],d=ring(i+1)[side+1];
    hullPoints.push(a[0],a[1],zs[i],b[0],b[1],zs[i+1],c[0],c[1],zs[i],c[0],c[1],zs[i],b[0],b[1],zs[i+1],d[0],d[1],zs[i+1]);
  }
  const hullGeo=new T.BufferGeometry();hullGeo.setAttribute('position',new T.Float32BufferAttribute(hullPoints,3));hullGeo.computeVertexNormals();
  const hull=part(ship,hullGeo,0x71533d);(hull.material as T.MeshStandardMaterial).side=T.DoubleSide;
  for(let i=0;i<zs.length-1;i++){const length=zs[i+1]-zs[i];box(ship,i%2?0xb49a70:0xc1aa7d,0,.19,(zs[i]+zs[i+1])/2,Math.max(.08,(widths[i]+widths[i+1])*.95),.055,length+.015)}
  for(const side of [-1,1])for(let i=1;i<zs.length-1;i++){
    box(ship,0x4d6962,side*widths[i],.29,zs[i],.045,.20,.045);
    if(i<zs.length-2)beam(ship,0xa98d60,new T.Vector3(side*widths[i],.37,zs[i]),new T.Vector3(side*widths[i+1],.37,zs[i+1]),.035);
  }
  box(ship,0xd0c5a4,0,.46,-.97,.73,.50,.53);const cabinRoof=new T.Group();cabinRoof.position.set(0,0,-.97);ship.add(cabinRoof);tiledRoof(cabinRoof,.76,.58,.72,.20,0x647e70);
  for(const x of [-.23,.23])box(ship,0x476a70,x,.5,-.69,.15,.13,.018);
  for(const z of [-.38,.70]){
    box(ship,0x7e674b,0,1.02,z,.055,1.7,.055);box(ship,0x7e674b,0,1.62,z,1.13,.045,.045);
    const vertices:number[]=[],colors:number[]=[];
    const sailPoint=(u:number,v:number)=>{const width=.53-.12*v;return new T.Vector3((u-.5)*2*width,1.59-v*.71,z+Math.sin(u*Math.PI)*Math.sin(v*Math.PI)*.12+v*.11)};
    for(let row=0;row<6;row++)for(let col=0;col<6;col++){
      const a=sailPoint(col/6,row/6),b=sailPoint((col+1)/6,row/6),c=sailPoint(col/6,(row+1)/6),d=sailPoint((col+1)/6,(row+1)/6);
      const color=new T.Color(col===2?0x9bb2a0:row%2?0xe4d8b5:0xeee2c0);
      for(const point of [a,b,c,c,b,d]){vertices.push(point.x,point.y,point.z);colors.push(color.r,color.g,color.b)}
    }
    const sail=new T.BufferGeometry();sail.setAttribute('position',new T.Float32BufferAttribute(vertices,3));sail.setAttribute('color',new T.Float32BufferAttribute(colors,3));sail.computeVertexNormals();
    const cloth=new T.Mesh(sail,new T.MeshStandardMaterial({vertexColors:true,roughness:.95,side:T.DoubleSide}));cloth.castShadow=true;cloth.receiveShadow=true;ship.add(cloth);
    for(const side of [-1,1])beam(ship,0xc2b48b,new T.Vector3(side*.53,1.59,z),new T.Vector3(side*.41,.88,z+.11),.009);
    beam(ship,0x9e987c,new T.Vector3(0,1.85,z),new T.Vector3(.56,.3,z+.45),.012);
  }
  for(let i=0;i<20;i++)box(ship,i%3?0xae956b:0xc5ae7d,0,.226,-1.0+i*.105,.91,.018,.093);
  for(const side of [-1,1])for(let i=1;i<zs.length-2;i++)for(const y of [.09,-.03])beam(ship,0x9e8057,new T.Vector3(side*widths[i]*.96,y,zs[i]),new T.Vector3(side*widths[i+1]*.96,y,zs[i+1]),.022);
  for(const x of [-.25,.25])for(const z of [.05,.35])crate(ship,x,z);
  for(const z of [-1.25,1.10])barrel(ship,.22,z);
  const anchor=new T.Group();anchor.position.set(-.53,.05,1.02);ship.add(anchor);box(anchor,0x59635b,0,0,0,.025,.20,.025);box(anchor,0x59635b,0,-.06,0,.15,.025,.025);
  const rescue=part(ship,new T.TorusGeometry(.09,.019,5,12),0xc8bb91,-.62,.24,.1);rescue.rotation.y=Math.PI/2;
  const pennant=part(ship,new T.ConeGeometry(.10,.34,3),0xb88f5c,0,1.93,-.38);pennant.rotation.z=Math.PI/2;
  const crew=(parent:T.Group,x:number,z:number,index:number)=>{
    const worker=new T.Group();worker.name=`merchant-crew-${index}`;worker.position.set(x,index===2?.06:.22,z);worker.userData.origin=new T.Vector3(x,index===2?.06:.22,z);parent.add(worker);
    const cargo=new T.Group();cargo.name='carried-crate';cargo.position.set(0,.28,.17);worker.add(cargo);box(cargo,0xae8e5e,0,0,0,.12,.12,.12);
  };
  const bridge=box(g,0xbba377,.60,.14,1.575,1.11,.035,.24);bridge.rotation.y=-Math.atan2(.65,.9);bridge.name='merchant-gangway';
  crew(ship,-.22,-.42,0);crew(ship,.27,.65,1);crew(g,.15,.7,2);
  g.add(ship);return g;
}
export function model(kind: Kind): T.Group {
  if(kind==='harbor'){if(!templates.has(kind))templates.set(kind,harbor());return templates.get(kind)!.clone()}
  if(kind==='stone'){if(!templates.has(kind)){const g=new T.Group();for(let i=0;i<3;i++){const rock=new T.Group();rock.userData.treeIndex=i;rock.position.set([-.27,.24,0][i],0,[-.18,-.1,.29][i]);const m=ball(rock,[0x8c9a99,0xa5afa5,0x7c8e8b][i],0,.13,0,.23);m.scale.set(1,.85,1.05);for(let j=0;j<3;j++){const x=-.09+j*.065;beam(rock,0xc7c7a7,new T.Vector3(x,.18+j*.012,.19),new T.Vector3(x+.055,.197+j*.012,.18),.012)}batchParts(rock);g.add(rock)}templates.set(kind,g)}return templates.get(kind)!.clone()}
  if(kind==='garden'){if(!templates.has(kind))templates.set(kind,flowerGarden());return templates.get(kind)!.clone()}
  if(kind==='fisher'||kind==='farm'){
    if(!templates.has(kind)){const source=kind==='fisher'?fishingHut():wheatPlot();if(kind==='fisher')batchParts(source);templates.set(kind,source);}
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
    const source=createModel(kind);batchParts(source);template=source;
    templates.set(kind, template);
  }
  return template.clone();
}


export function cozyFlowerGeometry(){
  const parts:T.BufferGeometry[]=[];
  const add=(geometry:T.BufferGeometry,color:number,matrix:T.Matrix4)=>{
    geometry.applyMatrix4(matrix);const c=new T.Color(color),colors=new Float32Array(geometry.getAttribute('position').count*3);
    for(let i=0;i<colors.length;i+=3){colors[i]=c.r;colors[i+1]=c.g;colors[i+2]=c.b}
    geometry.setAttribute('color',new T.BufferAttribute(colors,3));parts.push(geometry);
  };
  const pose=new T.Object3D();pose.position.set(0,.035,0);pose.updateMatrix();add(new T.CylinderGeometry(.003,.004,.07,4),0x66865c,pose.matrix);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;pose.position.set(Math.cos(a)*.017,.07,Math.sin(a)*.017);pose.rotation.set(.2,a,0);pose.scale.set(1,.28,.65);pose.updateMatrix();add(new T.SphereGeometry(.018,5,3),0xe5b9a5,pose.matrix)}
  pose.position.set(0,.074,0);pose.rotation.set(0,0,0);pose.scale.set(1,.4,1);pose.updateMatrix();add(new T.SphereGeometry(.009,5,3),0xd5ae59,pose.matrix);
  pose.position.set(.012,.026,0);pose.rotation.set(0,0,-.5);pose.scale.set(1,.25,.45);pose.updateMatrix();add(new T.SphereGeometry(.021,4,2),0x779467,pose.matrix);
  const result=mergeGeometries(parts)!;for(const part of parts)part.dispose();return result;
}
