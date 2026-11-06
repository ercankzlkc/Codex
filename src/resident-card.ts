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
  private scene=new T.Scene();private camera=new T.OrthographicCamera(-.23,.23,.29,-.29,.01,10);
  private preview:T.Object3D|null=null;private current=-1;
  constructor(){this.panel.id='resident-card';this.panel.hidden=true;document.querySelector('#app')!.append(this.panel);this.scene.add(new T.HemisphereLight(0xfff4db,0x657e73,2));const sun=new T.DirectionalLight(0xffe2b0,2.4);sun.position.set(2,4,3);this.scene.add(sun);this.camera.position.set(.6,.38,1.5);this.camera.lookAt(0,.23,0)}
  reset(){residentPortraits.clear();this.current=-1;this.hide();if(this.preview)this.scene.remove(this.preview);this.preview=null}
  snapshot(id:number,source:T.Object3D){
    if(!this.renderer){this.renderer=new T.WebGLRenderer({alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(2,devicePixelRatio));this.renderer.setSize(112,140);this.renderer.outputColorSpace=T.SRGBColorSpace}
    const portrait=clone(source);if(this.preview)this.scene.remove(this.preview);this.scene.add(portrait);
    this.renderer.render(this.scene,this.camera);residentPortraits.set(id,this.renderer.domElement.toDataURL('image/png'));
    this.scene.remove(portrait);if(this.preview)this.scene.add(this.preview);this.current=-1;
    window.dispatchEvent(new CustomEvent('resident-portrait'));
  }
  hide(){this.panel.hidden=true}
  show(id:number,source:T.Object3D|null,status:string,x:number,y:number){
    if(!source){this.hide();return}
    if(!this.renderer){this.renderer=new T.WebGLRenderer({alpha:true,antialias:true});this.renderer.setPixelRatio(Math.min(2,devicePixelRatio));this.renderer.setSize(112,140);this.renderer.outputColorSpace=T.SRGBColorSpace}
    if(this.current!==id){
      this.current=id;if(this.preview)this.scene.remove(this.preview);this.preview=clone(source);this.scene.add(this.preview);
      this.panel.innerHTML=`<div class="resident-portrait"></div><div class="resident-copy"><small>YELKEN KOYU SAKİNİ</small><strong>${residentName(id)}</strong><b></b><p>${wishes[id%3].text}</p></div>`;
      this.panel.querySelector('.resident-portrait')!.append(this.renderer.domElement);
    }
    this.panel.querySelector('.resident-copy b')!.textContent=status;
    this.panel.hidden=false;this.panel.style.left=`${Math.max(10,Math.min(innerWidth-292,x+22))}px`;this.panel.style.top=`${Math.max(10,Math.min(innerHeight-166,y-75))}px`;
    this.renderer.render(this.scene,this.camera);
  }
}
