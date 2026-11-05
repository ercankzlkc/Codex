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
  anchorX: number;
  anchorY: number;
  started: boolean;
  valid: boolean;
  ghost: HTMLElement | null;
  visualX:number;
  visualY:number;
  tilt:number;
  visualTilt:number;
  angularVelocity:number;
  previousVX:number;previousVY:number;
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
      anchorX: Math.min(1, Math.max(0, (event.clientX - origin.left) / origin.width)),
      anchorY: Math.min(1, Math.max(0, (event.clientY - origin.top) / origin.height)),
      started: false,
      valid: false,
      ghost: null,visualX:event.clientX,visualY:event.clientY,tilt:0,visualTilt:0,angularVelocity:0,previousVX:0,previousVY:0,
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
      // Clone before start(): selection is allowed to rebuild the hand.
      const ghost = gesture.source.cloneNode(true) as HTMLElement;
      ghost.removeAttribute('id');
      ghost.removeAttribute('data-card');
      ghost.removeAttribute('aria-pressed');
      ghost.querySelectorAll('[id]').forEach(child => child.removeAttribute('id'));
      ghost.classList.remove('selected', 'drag-source');
      ghost.classList.add('drag-card');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.setAttribute('inert', '');
      ghost.tabIndex = -1;
      Object.assign(ghost.style, {
        position: 'fixed', left: '0', top: '0', margin: '0',
        width: `${gesture.width}px`, height: `${gesture.height}px`,
        pointerEvents: 'none', zIndex: '100', transition: 'none',
        transformOrigin: `${gesture.anchorX*100}% ${gesture.anchorY*100}%`, willChange: 'transform',
      });
      gesture.ghost = ghost;
      document.body.append(ghost);
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
    gesture.tilt = Math.max(-7, Math.min(7, (event.clientX - gesture.lastX) * 0.22));
    gesture.lastX = event.clientX;
    gesture.lastY = event.clientY;

  };

  private follow(gesture:Gesture,last:number){
    if(this.gesture!==gesture||!gesture.ghost)return;
    const now=performance.now(),dt=Math.min(.05,Math.max(.001,(now-last)/1000));
    const ease=1-Math.exp(-38*dt);
    gesture.visualX+=(gesture.lastX-gesture.visualX)*ease;
    gesture.visualY+=(gesture.lastY-gesture.visualY)*ease;
    const vx=(gesture.lastX-gesture.visualX)*38,vy=(gesture.lastY-gesture.visualY)*38;
    const ax=(vx-gesture.previousVX),ay=(vy-gesture.previousVY);
    gesture.previousVX=vx;gesture.previousVY=vy;
    const dx=(.5-gesture.anchorX)*gesture.width,dy=(.5-gesture.anchorY)*gesture.height;
    // A suspended card rotates until its centre of mass hangs below the grip.
    const resting=Math.hypot(dx,dy)>8?Math.atan2(dx,dy)*180/Math.PI:0;
    const error=((resting-gesture.visualTilt+540)%360)-180;
    const torque=(ax*(gesture.anchorY-.5)-ay*(gesture.anchorX-.5))*.09;
    gesture.angularVelocity+=torque+error*35*dt;
    gesture.angularVelocity*=Math.exp(-5*dt);
    gesture.visualTilt+=gesture.angularVelocity*dt;
    gesture.ghost.style.transform=this.followTransform(gesture);
    this.animationFrame=requestAnimationFrame(()=>this.follow(gesture,now));
  }
  private followTransform(gesture: Gesture): string {
    const scale=.84;
    const x=gesture.visualX-gesture.width*gesture.anchorX;
    const y=gesture.visualY-gesture.height*gesture.anchorY;
    return `translate3d(${x}px, ${y}px, 0) rotate(${gesture.visualTilt}deg) scale(${scale})`;

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
    const currentCard = this.hand.querySelector<HTMLElement>(`[data-card="${gesture.index}"]`);
    const target = currentCard?.getBoundingClientRect() ?? gesture.origin;
    const x = target.left + (target.width - gesture.width) / 2;
    const y = target.top + (target.height - gesture.height) / 2;
    const end = accepted
      ? `translate3d(${gesture.lastX - gesture.width / 2}px, ${gesture.lastY - gesture.height / 2}px, 0) scale(.15)`
      : `translate3d(${x}px, ${y}px, 0) rotate(0deg) scale(1)`;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : accepted ? 180 : 280;
    const animation = ghost.animate([
      { transform: ghost.style.transform || this.followTransform(gesture), opacity: 1 },
      { transform: end, opacity: accepted ? 0 : 0.2 },
    ], { duration, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'forwards' });
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
