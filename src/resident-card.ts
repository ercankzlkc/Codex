import * as T from 'three';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {residentName,wishes} from './village-personality';
export const residentPortraits=new Map<number,string>();
export function residentIcon(id:number){
  const portrait=residentPortraits.get(id);if(portrait)return portrait;
  const skin=['#d8ae87','#b98565','#e3c39c'][id%3],shirt=['#819d8c','#ab9181','#9cabb4','#baae87'][id%4];
  return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><path d="M15 80V61Q17 46 40 46T65 61V80" fill="${shirt}"/><path d="M22 34Q20 10 40 10T58 34V42Q40 64 22 42Z" fill="${skin}"/><path d="M21 32V21Q25 6 42 10Q64 11 59 33L49 22Q37 30 21 32" fill="#685a48"/><path d="M30 37h2m16 0h2" stroke="#544c41" stroke-width="3" stroke-linecap="round"/><path d="M35 46q5 3 10 0" fill="none" stroke="#a77960" stroke-width="2"/></svg>`);
}
/** One small renderer, created only on the first hover and shared by all portraits. */
export class ResidentCard{
  private panel=document.createElement('aside');private renderer:T.WebGLRenderer|null=null;
  private scene=new T.Scene();private camera=new T.OrthographicCamera(-.28,.28,.35,-.35,.01,10);
  private preview:T.Object3D|null=null;private current=-1;
  private source:T.Object3D|null=null;private liveNodes:{source:T.Object3D;preview:T.Object3D}[]=[];
  constructor(){this.panel.id='resident-card';this.panel.hidden=true;document.querySelector('#app')!.append(this.panel);this.scene.add(new T.HemisphereLight(0xfff4db,0x657e73,2));const sun=new T.DirectionalLight(0xffe2b0,2.4);sun.position.set(2,4,3);this.scene.add(sun);this.camera.position.set(.6,.38,1.5);this.camera.lookAt(0,.23,0)}
  reset(){residentPortraits.clear();this.current=-1;this.hide();if(this.preview)this.scene.remove(this.preview);this.preview=null;this.source=null;this.liveNodes=[]}
  snapshot(id:number,source:T.Object3D){
    if(!this.renderer){this.renderer=new T.WebGLRenderer({alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(2,devicePixelRatio));this.renderer.setSize(112,140);this.renderer.outputColorSpace=T.SRGBColorSpace}
    const portrait=clone(source);if(this.preview)this.scene.remove(this.preview);this.scene.add(portrait);
    this.renderer.render(this.scene,this.camera);residentPortraits.set(id,this.renderer.domElement.toDataURL('image/png'));
    this.scene.remove(portrait);if(this.preview)this.scene.add(this.preview);this.current=-1;
    window.dispatchEvent(new CustomEvent('resident-portrait'));
  }
  hide(){this.panel.hidden=true}
  show(id:number,source:T.Object3D|null,status:string,x:number,y:number,energy:number,satiety:number){
    if(!source){this.hide();return}
    if(!this.renderer){this.renderer=new T.WebGLRenderer({alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(2,devicePixelRatio));this.renderer.setSize(112,140);this.renderer.outputColorSpace=T.SRGBColorSpace}
    if(this.current!==id||this.source!==source){
      this.current=id;if(this.preview)this.scene.remove(this.preview);this.preview=clone(source);this.scene.add(this.preview);this.source=source;
      const originals:T.Object3D[]=[],copies:T.Object3D[]=[];source.traverse(node=>originals.push(node));this.preview.traverse(node=>copies.push(node));
      this.liveNodes=originals.map((node,i)=>({source:node,preview:copies[i]}));
      this.preview.traverse(node=>{if(node instanceof T.Mesh)node.frustumCulled=false});
      this.panel.innerHTML=`<div class="resident-portrait"></div><div class="resident-copy"><small>YELKEN KOYU SAKİNİ</small><strong>${residentName(id)}</strong><b class="resident-action"></b><div class="resident-needs"><div class="need energy"><div><span>ϟ Enerji</span><strong></strong></div><div class="need-track" role="meter" aria-label="Enerji" aria-valuemin="0" aria-valuemax="100"><i></i></div></div><div class="need satiety"><div><span>♧ Tokluk</span><strong></strong></div><div class="need-track" role="meter" aria-label="Tokluk" aria-valuemin="0" aria-valuemax="100"><i></i></div></div></div><p>${wishes[id%3].text}</p></div>`;
      this.panel.querySelector('.resident-portrait')!.append(this.renderer.domElement);
    }
    this.panel.querySelector('.resident-action')!.textContent=status;
    for(const [key,value] of [['energy',energy],['satiety',satiety]] as const){
      const level=Math.round(T.MathUtils.clamp(value,0,100)),element=this.panel.querySelector(`.need.${key}`)!;
      element.querySelector('strong')!.textContent=`${level}%`;
      element.setAttribute('data-low',String(level<25));element.querySelector('.need-track')!.setAttribute('aria-valuenow',String(level));
      (element.querySelector('i') as HTMLElement).style.width=`${level}%`;
    }
    // Copy the live skeleton pose and tool transforms; no second animation clock can drift.
    for(const pair of this.liveNodes){pair.preview.position.copy(pair.source.position);pair.preview.quaternion.copy(pair.source.quaternion);pair.preview.scale.copy(pair.source.scale);pair.preview.visible=pair.source.visible}
    this.preview?.updateMatrixWorld(true);
    this.panel.hidden=false;this.panel.style.left=`${Math.max(10,Math.min(innerWidth-332,x+22))}px`;this.panel.style.top=`${Math.max(10,Math.min(innerHeight-220,y-95))}px`;
    this.renderer.render(this.scene,this.camera);
  }
}
