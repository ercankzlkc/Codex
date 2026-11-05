import * as THREE from 'three';

/** A deliberately restrained tabletop camera. Left-pointer gestures belong to placement. */
export class CameraController {
  readonly camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 80);

  private readonly element: HTMLElement;
  private readonly target = new THREE.Vector3(0, 0.12, 0);
  private readonly desiredTarget = new THREE.Vector3(0, 0.12, 0);
  private readonly offset = new THREE.Vector3();
  private readonly spherical = new THREE.Spherical();
  private distance = 20;
  private clearanceHeight=2.5;
  /** Keep the orbit above sea level and the highest model, including when panning. */
  setClearance(highest:number):void{this.clearanceHeight=Math.max(2.2,highest+.7)}
  private maxPitch():number{return Math.min(.92,Math.acos(THREE.MathUtils.clamp((this.clearanceHeight-this.target.y)/this.distance,0,.95)))}
  private yaw = Math.PI / 4;
  private desiredYaw = Math.PI / 4;
  private pitch = 0.86;
  private desiredPitch = 0.86;
  private desiredZoom = 1;
  private halfHeight = 3.5;
  private desiredHalfHeight = 3.5;
  private viewportWidth = 1280;
  private shiftFraction = 0;
  private islandRadius = 2.8;
  private readonly islandCenter = new THREE.Vector3(0,.3,0);

  frameIsland(points: {x:number;z:number}[], immediate=false):void {
    if (!points.length) return;
    const xs=points.map(p=>p.x),zs=points.map(p=>p.z);
    this.islandCenter.set((Math.min(...xs)+Math.max(...xs))/2,.3,(Math.min(...zs)+Math.max(...zs))/2);
    this.islandRadius=Math.max(...points.map(p=>Math.hypot(p.x-this.islandCenter.x,p.z-this.islandCenter.z)))+2.65;
    this.distance=Math.max(20,this.islandRadius*3);this.camera.far=this.distance+this.islandRadius*3+40;
    this.desiredTarget.copy(this.islandCenter);
    this.resize(this.viewportWidth,this.viewportHeight);
    if(immediate){this.target.copy(this.desiredTarget);this.halfHeight=this.desiredHalfHeight;this.applyProjection();this.applyTransform()}
  }

  private applyProjection():void {
    const aspect=this.viewportWidth/this.viewportHeight;
    const shift=this.shiftFraction*this.halfHeight;
    Object.assign(this.camera,{left:-this.halfHeight*aspect,right:this.halfHeight*aspect,
      top:this.halfHeight+shift,bottom:-this.halfHeight+shift});
    this.camera.updateProjectionMatrix();
  }
  private viewportHeight = 900;
  private placement = false;
  private pointer: { id: number; x: number; y: number } | null = null;
  private disposed = false;
  private readonly cleanup = new AbortController();

  constructor(element: HTMLElement) {
    this.element = element;
    this.camera.zoom = 1;
    const signal = this.cleanup.signal;
    element.addEventListener('pointerdown', this.onPointerDown, { signal });
    element.addEventListener('pointermove', this.onPointerMove, { signal });
    element.addEventListener('pointerup', this.onPointerUp, { signal });
    element.addEventListener('pointercancel', this.onPointerUp, { signal });
    element.addEventListener('lostpointercapture', this.onPointerUp, { signal });
    element.addEventListener('wheel', this.onWheel, { passive: false, signal });
    element.addEventListener('contextmenu', this.onContextMenu, { signal });
    window.addEventListener('keydown', this.onKeyDown, { signal });
    window.addEventListener('blur', this.onBlur, { signal });
    this.resize(element.clientWidth || 1280, element.clientHeight || 900);
    this.applyTransform();
  }

  /** Frame the world in the space above the hand, rather than the viewport midpoint. */
  resize(width: number, height: number): void {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const aspect = safeWidth / safeHeight;
    const topReserved = safeWidth < 700 ? 100 : 72;
    const cardHeight = Math.min(212, Math.max(188, safeHeight * .22));
    const bottomReserved = safeWidth < 700 ? 205 : cardHeight + 28;
    const availableHeight = Math.max(safeHeight * 0.43, safeHeight - topReserved - bottomReserved);
    this.viewportWidth=safeWidth;this.viewportHeight=safeHeight;
    this.desiredHalfHeight=Math.max(this.islandRadius/(aspect*.90),(this.islandRadius*.68+.61)*safeHeight/availableHeight);
    this.shiftFraction=(topReserved-bottomReserved)/safeHeight;
    this.applyProjection();
  }

  update(dt: number): void {
    if (this.disposed) return;
    const step = Math.min(Math.max(dt, 0), 0.1);
    const motion = 1 - Math.exp(-11 * step);
    const zoom = 1 - Math.exp(-12 * step);
    if(!this.placement && Math.abs(this.halfHeight-this.desiredHalfHeight)>.0001){
      this.halfHeight=THREE.MathUtils.lerp(this.halfHeight,this.desiredHalfHeight,motion);
      this.applyProjection();
    }
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.desiredYaw, motion);
    this.pitch = THREE.MathUtils.lerp(this.pitch, this.desiredPitch, motion);
    this.desiredTarget.copy(this.islandCenter);
    if(!this.placement)this.target.lerp(this.islandCenter, motion);
    const nextZoom = THREE.MathUtils.lerp(this.camera.zoom, this.desiredZoom, zoom);
    if (Math.abs(nextZoom - this.camera.zoom) > 0.000001) {
      this.camera.zoom = nextZoom;
      this.camera.updateProjectionMatrix();
    }
    this.applyTransform();
  }

  /** Pause camera gestures and settle momentum while the player carries a card. */
  setPlacement(active: boolean): void {
    this.placement = active;
    if (!active) return;
    this.releasePointer();
    this.desiredYaw = this.yaw;
    this.desiredPitch = this.pitch;
    this.desiredTarget.copy(this.target);
    this.desiredZoom = this.camera.zoom;
  }

  /** Ease back to the opening composition. */
  reset(): void {
    this.releasePointer();
    this.desiredTarget.copy(this.islandCenter);
    this.desiredYaw = Math.PI / 4;
    this.desiredPitch = 0.86;
    this.desiredZoom = 1;
  }

  dispose(): void {
    this.disposed = true;
    this.releasePointer();
    this.cleanup.abort();
  }

  get audioFocus(){return this.target}

  private applyTransform(): void {
    this.desiredPitch=THREE.MathUtils.clamp(this.desiredPitch,.80,this.maxPitch());
    this.pitch=THREE.MathUtils.clamp(this.pitch,.80,this.maxPitch());
    // Orthographic zoom expands the ray origins too. Keep the entire near edge
    // above the water when looking low, rather than just the camera centre.
    const sin=Math.sin(this.pitch),cos=Math.cos(this.pitch);
    const bottom=this.shiftFraction*this.halfHeight-this.halfHeight/this.camera.zoom;
    const top=this.shiftFraction*this.halfHeight+this.halfHeight/this.camera.zoom;
    const orbit=Math.max(this.distance,(-.18+.6-this.target.y-bottom*sin)/cos);
    this.spherical.set(orbit, this.pitch, this.yaw);
    const far=orbit+(Math.abs(top)+Math.abs(bottom))/cos+this.islandRadius*3+40;
    if(Math.abs(this.camera.far-far)>.01){this.camera.far=far;this.camera.updateProjectionMatrix()}
    this.offset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(this.offset);
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (document.querySelector('dialog[open]') || this.placement || event.pointerType === 'touch' || (event.button !== 1 && event.button !== 2)) return;
    // A wrapper may also contain floating DOM feedback. Never steal a HUD gesture.
    if (event.target instanceof HTMLElement && event.target.closest('button, input, dialog, [data-card]')) return;
    event.preventDefault();
    if(event.button===1){this.reset();return}
    this.desiredTarget.copy(this.islandCenter);
    this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.element.setPointerCapture(event.pointerId);
    this.element.style.cursor = 'var(--cursor-grab)';
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    const dx = event.clientX - this.pointer.x;
    const dy = event.clientY - this.pointer.y;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.desiredTarget.copy(this.islandCenter);
    this.desiredYaw -= dx * 0.0035;
    this.desiredPitch = THREE.MathUtils.clamp(this.desiredPitch - dy * 0.0007, .80, this.maxPitch());
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (this.pointer?.id === event.pointerId) this.releasePointer();
  };

  private releasePointer(): void {
    const pointer = this.pointer;
    this.pointer = null;
    if (pointer && this.element.hasPointerCapture(pointer.id)) this.element.releasePointerCapture(pointer.id);
    this.element.style.cursor = '';
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    if (this.placement || document.querySelector('dialog[open]')) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.viewportHeight : 1);
    this.desiredZoom = THREE.MathUtils.clamp(this.desiredZoom * Math.exp(-delta * 0.001), 0.80, 3.2);
  };

  private onContextMenu = (event: MouseEvent): void => event.preventDefault();
  private onBlur = (): void => this.releasePointer();
  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key.toLowerCase() !== 'home' || event.ctrlKey || event.altKey || event.metaKey || this.placement) return;
    if (document.querySelector('dialog[open]') || event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest('input, textarea, select'))) return;
    this.reset();
  };
}

