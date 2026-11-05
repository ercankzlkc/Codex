/** The hand owns the gesture; the caller owns placement rules and game state. */
export interface CardDragCallbacks {
  canStart(index: number): boolean;
  start(index: number): void;
  move(x: number, y: number): boolean;
  drop(x: number, y: number): boolean;
  cancel(): void;
  tap(index: number): void;
}

interface Gesture {
  pointerId: number;
  index: number;
  source: HTMLElement;
  origin: DOMRect;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  width: number;
  height: number;
  started: boolean;
  valid: boolean;
  ghost: HTMLElement | null;
  visualX:number;
  visualY:number;
}

/**
 * Pointer/touch drag with a four-pixel threshold and a click/keyboard fallback.
 * Capture stays on the hand, so rebuilding its card buttons during selection
 * cannot lose the gesture. Game effects happen only in the drop callback.
 */
export class CardDrag {
  private gesture: Gesture | null = null;
  private readonly listeners = new AbortController();
  private readonly settling = new Set<HTMLElement>();
  private disposed = false;
  private animationFrame=0;

  constructor(
    private readonly hand: HTMLElement,
    private readonly callbacks: CardDragCallbacks,
  ) {
    const options = { signal: this.listeners.signal };
    hand.addEventListener('pointerdown', this.onDown, options);
    // Window listeners also work if a browser releases capture unexpectedly.
    window.addEventListener('pointermove', this.onMove, { ...options, passive: false });
    window.addEventListener('pointerup', this.onUp, options);
    window.addEventListener('pointercancel', this.onPointerCancel, options);
    hand.addEventListener('lostpointercapture', this.onLostCapture, options);
    hand.addEventListener('click', this.onClick, { ...options, capture: true });
    hand.addEventListener('dragstart', this.onNativeDrag, options);
    window.addEventListener('keydown', this.onKey, options);
    window.addEventListener('blur', this.onBlur, options);
    document.addEventListener('visibilitychange', this.onVisibility, options);
  }

  private cardFrom(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    const card = target.closest<HTMLElement>('[data-card]');
    return card && this.hand.contains(card) ? card : null;
  }

  private isAvailable(card: HTMLElement, index: number): boolean {
    return Number.isInteger(index)
      && !card.matches(':disabled, [disabled], [aria-disabled="true"]')
      && this.callbacks.canStart(index);
  }

  private onDown = (event: PointerEvent): void => {
    if (this.disposed || this.gesture || !event.isPrimary || event.button !== 0) return;
    const source = this.cardFrom(event.target);
    if (!source) return;
    const index = Number(source.dataset.card);
    if (!this.isAvailable(source, index)) return;
    const origin = source.getBoundingClientRect();
    const width = source.offsetWidth || origin.width;
    const height = source.offsetHeight || origin.height;
    this.gesture = {
      pointerId: event.pointerId,
      index,
      source,
      origin,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      width,
      height,
      started: false,
      valid: false,
      ghost: null,visualX:event.clientX,visualY:event.clientY,
    };
    // Prevent native image dragging, text selection and touch scrolling.
    event.preventDefault();
    try { this.hand.setPointerCapture(event.pointerId); } catch { /* Window fallback. */ }
  };

  private onMove = (event: PointerEvent): void => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    event.preventDefault();
    if (!gesture.started) {
      if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) < 4) return;
      if (!this.isAvailable(gesture.source, gesture.index)) {
        this.cancel();
        return;
      }
      gesture.started = true;
      gesture.visualX=event.clientX;gesture.visualY=event.clientY;
      // The full card stays in the hand. A compact token yields to the world preview.
      const ghost=document.createElement('div');ghost.className='drag-token';
      ghost.setAttribute('aria-hidden','true');ghost.setAttribute('inert','');
      const image=gesture.source.querySelector('img')?.cloneNode(true) as HTMLImageElement|undefined;
      if(image){image.alt='';image.draggable=false;ghost.append(image)}
      const caption=document.createElement('div'),name=document.createElement('strong'),hint=document.createElement('span');
      name.textContent=gesture.source.querySelector('strong')?.textContent??'Yerleşim';
      hint.textContent='Bir karo üzerine götür';caption.append(name,hint);ghost.append(caption);
      gesture.ghost=ghost;document.body.append(ghost);
      gesture.width=ghost.offsetWidth;gesture.height=ghost.offsetHeight;
      document.body.classList.add('is-dragging');
      this.callbacks.start(gesture.index);
      // The current hand may now contain a different DOM node for this card.
      this.hand.querySelector<HTMLElement>(`[data-card="${gesture.index}"]`)
        ?.classList.add('drag-source');
      gesture.source.classList.add('drag-source');
      this.follow(gesture,performance.now());
    }
    if (this.gesture !== gesture) return;
    gesture.valid = this.callbacks.move(event.clientX, event.clientY);
    gesture.ghost?.classList.toggle('drop-valid', gesture.valid);
    gesture.ghost?.classList.toggle('drop-invalid', !gesture.valid);
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;

  };

  private follow(gesture:Gesture,last:number){
    if(this.gesture!==gesture||!gesture.ghost)return;
    const now=performance.now(),dt=Math.min(.05,Math.max(.001,(now-last)/1000)),ease=1-Math.exp(-32*dt);
    gesture.visualX+=(gesture.lastX-gesture.visualX)*ease;
    gesture.visualY+=(gesture.lastY-gesture.visualY)*ease;
    gesture.ghost.style.transform=this.followTransform(gesture);
    this.animationFrame=requestAnimationFrame(()=>this.follow(gesture,now));
  }
  private followTransform(gesture:Gesture):string{
    const x=Math.max(10,Math.min(window.innerWidth-gesture.width-10,gesture.visualX+18));
    const y=Math.max(10,Math.min(window.innerHeight-gesture.height-10,gesture.visualY+18));
    return `translate3d(${x}px,${y}px,0) scale(${gesture.valid?.92:1})`;
  }

  private onUp = (event: PointerEvent): void => {
    const gesture = this.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    // A fast flick can reach pointerup before its final coalesced move event.
    if(!gesture.started&&Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY)>=4)this.onMove(event);
    if(this.gesture!==gesture)return;
    // Clear state before invoking caller code, allowing safe synchronous reset.
    this.release(gesture);
    if (!gesture.started) {
      if (this.isAvailable(gesture.source, gesture.index)) this.callbacks.tap(gesture.index);
      return;
    }
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;
    const valid = this.callbacks.move(event.clientX, event.clientY);
    const accepted = valid && this.callbacks.drop(event.clientX, event.clientY);
    if (!accepted) this.callbacks.cancel();
    this.settle(gesture, accepted);
  };

  private release(gesture: Gesture): void {
    this.gesture = null;
    cancelAnimationFrame(this.animationFrame);this.animationFrame=0;
    document.body.classList.remove('is-dragging');
    gesture.source.classList.remove('drag-source');
    this.hand.querySelectorAll('.drag-source').forEach(card => card.classList.remove('drag-source'));
    if (this.hand.hasPointerCapture(gesture.pointerId)) {
      this.hand.releasePointerCapture(gesture.pointerId);
    }
  }

  private settle(gesture: Gesture, accepted: boolean): void {
    const ghost = gesture.ghost;
    if (!ghost) return;
    if(accepted){ghost.remove();return}
    ghost.classList.remove('drop-valid','drop-invalid');
    this.settling.add(ghost);
    const currentCard=this.hand.querySelector<HTMLElement>(`[data-card="${gesture.index}"]`);
    const target=currentCard?.getBoundingClientRect()??gesture.origin;
    const x=target.left+(target.width-gesture.width)/2,y=target.top+(target.height-gesture.height)/2;
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:220;
    const animation=ghost.animate([
      {transform:ghost.style.transform||this.followTransform(gesture),opacity:gesture.valid?0:1},
      {transform:`translate3d(${x}px,${y}px,0) scale(.62)`,opacity:0},
    ],{duration,easing:'cubic-bezier(.2,.8,.25,1)',fill:'forwards'});
    void animation.finished.catch(() => {}).then(() => {
      ghost.remove();
      this.settling.delete(ghost);
    });
  }

  /** Cancels a held card without committing or advancing the turn. */
  cancel(): void {
    const gesture = this.gesture;
    if (!gesture) return;
    this.release(gesture);
    if (gesture.started) {
      this.callbacks.cancel();
      this.settle(gesture, false);
    }
  }

  private onClick = (event: MouseEvent): void => {
    const card = this.cardFrom(event.target);
    if (!card) return;
    // Pointer taps were handled on pointerup. Suppress their synthetic click,
    // including a click dispatched by the browser immediately after a drag.
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.detail === 0 && !this.gesture) {
      const index = Number(card.dataset.card);
      if (this.isAvailable(card, index)) this.callbacks.tap(index);
    }
  };

  private onNativeDrag = (event: DragEvent): void => { event.preventDefault(); };
  private onPointerCancel = (event: PointerEvent): void => {
    if (event.pointerId === this.gesture?.pointerId) this.cancel();
  };
  private onLostCapture = (event: PointerEvent): void => {
    if (event.pointerId === this.gesture?.pointerId) this.cancel();
  };
  private onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.gesture) {
      event.preventDefault();
      this.cancel();
    }
  };
  private onBlur = (): void => { this.cancel(); };
  private onVisibility = (): void => { if (document.hidden) this.cancel(); };

  dispose(): void {
    this.cancel();
    this.disposed = true;
    this.listeners.abort();
    this.settling.forEach(ghost => {
      ghost.getAnimations().forEach(animation => animation.cancel());
      ghost.remove();
    });
    this.settling.clear();
  }
}
