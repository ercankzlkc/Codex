import type {WebGLRenderer} from 'three';

/** Wall-clock FPS: deliberately independent of the simulation's clamped time step. */
export class PerformanceHud{
  private element=document.createElement('aside');
  private started=0;private frames=0;private triangles=0;
  constructor(){
    this.element.id='performance-hud';this.element.setAttribute('aria-label','Performans göstergesi');
    this.element.innerHTML='<span><small>FPS</small><b data-fps>—</b></span><span title="Karede çizilen üçgen sayısı; gölge çizimleri dahil"><small>POLİGON</small><b data-triangles>—</b></span>';
    document.querySelector('#app')!.append(this.element);
    document.addEventListener('visibilitychange',()=>{this.started=0;this.frames=0;this.triangles=0});
  }
  update(renderer:WebGLRenderer){
    if(document.hidden)return;
    const now=performance.now();
    if(!this.started){this.started=now;return}
    this.frames++;this.triangles+=renderer.info.render.triangles;
    const elapsed=now-this.started;if(elapsed<500)return;
    const fps=this.frames*1000/elapsed;
    this.element.querySelector('[data-fps]')!.textContent=String(Math.round(fps));
    this.element.querySelector('[data-triangles]')!.textContent=Math.round(this.triangles/this.frames).toLocaleString('tr-TR');
    this.element.dataset.health=fps>=50?'good':fps>=30?'fair':'low';
    this.started=now;this.frames=0;this.triangles=0;
  }
}
