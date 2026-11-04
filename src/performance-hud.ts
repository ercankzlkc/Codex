import type {WebGLRenderer} from 'three';

/** Wall-clock FPS: deliberately independent of the simulation's clamped time step. */
export class PerformanceHud{
  private element=document.createElement('aside');
  private started=0;private frames=0;private triangles=0;private calls=0;private simulation=0;private submission=0;
  constructor(){
    this.element.id='performance-hud';this.element.setAttribute('aria-label','Performans göstergesi');
    this.element.innerHTML='<span><small>FPS</small><b data-fps>—</b></span><span title="Karede çizilen üçgen sayısı; gölge çizimleri dahil"><small>POLİGON</small><b data-triangles>—</b></span><span title="İşlemci simülasyon / WebGL çizim gönderimi; GPU süresi değildir"><small>İŞLEM / ÇİZİM</small><b data-timing>—</b></span><span><small>ÇİZİM ÇAĞRISI</small><b data-calls>—</b></span>';
    document.querySelector('#app')!.append(this.element);
    document.addEventListener('visibilitychange',()=>{this.started=0;this.frames=0;this.triangles=0;this.calls=0;this.simulation=0;this.submission=0});
  }
  update(renderer:WebGLRenderer,simulation=0,submission=0){
    if(document.hidden)return;
    const now=performance.now();
    if(!this.started){this.started=now;return}
    this.frames++;this.triangles+=renderer.info.render.triangles;this.calls+=renderer.info.render.calls;this.simulation+=simulation;this.submission+=submission;
    const elapsed=now-this.started;if(elapsed<500)return;
    const fps=this.frames*1000/elapsed;
    this.element.querySelector('[data-fps]')!.textContent=String(Math.round(fps));
    this.element.querySelector('[data-triangles]')!.textContent=Math.round(this.triangles/this.frames).toLocaleString('tr-TR');
    this.element.querySelector('[data-timing]')!.textContent=`${(this.simulation/this.frames).toFixed(1)} / ${(this.submission/this.frames).toFixed(1)} ms`;
    this.element.querySelector('[data-calls]')!.textContent=Math.round(this.calls/this.frames).toLocaleString('tr-TR');
    this.element.dataset.health=fps>=50?'good':fps>=30?'fair':'low';
    this.started=now;this.frames=0;this.triangles=0;this.calls=0;this.simulation=0;this.submission=0;
  }
}
