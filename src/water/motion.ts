import type * as T from 'three';

/** One motion field for water, submerged light and living reef. Time is in real seconds. */
export type OceanUniforms = Record<string, T.IUniform>;
export const WAKE_COUNT = 24;
export const WAKE_LIFE = 2.2;

export const seaWaves = /* glsl */ `
uniform vec4 uShippingLane;uniform vec2 uShippingOpen;
float shipMelt(vec2 p){
  vec2 a=uShippingLane.xy,b=uShippingLane.zw,v=b-a;
  float t=clamp(dot(p-a,v)/max(.001,dot(v,v)),0.,1.);
  // Broken floes leave a gently irregular bank; the bow never clears ice ahead of itself.
  float edge=.025*sin(dot(p,vec2(8.7,5.3)))+.014*sin(dot(p,vec2(-14.1,10.7)));
  float bank=1.-smoothstep(uShippingOpen.x*.75+edge,uShippingOpen.x+edge,length(p-a-v*t));
  float ahead=dot(p-b,v/max(length(v),.001));
  float front=1.-smoothstep(-.02+edge,.12+edge,ahead);
  return bank*front*uShippingOpen.y;
}

vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8);
  float pa=dot(p,a)-uTime*.72, pb=dot(p,b)+uTime*.55, pc=dot(p,c)-uTime*.94;
  float h=.022*sin(pa)+.011*sin(pb)+.0035*sin(pc);
  vec2 gradient=.022*cos(pa)*a+.011*cos(pb)*b+.0035*cos(pc)*c;
  return vec3(h,gradient)*(1.-uFreeze*(1.-shipMelt(p)));
}
vec2 seaCurrent(vec2 p) {
  float a=dot(p,vec2(.88,1.31))-uTime*.72;
  float b=dot(p,vec2(1.93,-.62))+uTime*.55;
  return vec2(.65*sin(a)+.35*sin(b),.48*cos(a*.83)+.26*sin(b))*(1.-uFreeze*.85);
}
`;

export const wakeField = /* glsl */ `
uniform float uSceneTime;
uniform vec3 uLanding;
uniform vec4 uWakes[${WAKE_COUNT}],uWakeDirs[${WAKE_COUNT}];
// A swept segment creates a continuous wake, with an analytic height gradient.
// Every impulse starts and ends at zero; no bright bead chain or slot-reuse pop.
vec4 waterDisturbance(vec2 p) {
  vec2 slope=vec2(0.);float height=0.,crest=0.;
  for(int i=0;i<${WAKE_COUNT};i++){
    float age=uTime-uWakes[i].z,energy=uWakes[i].w;
    if(age>=0.&&age<${WAKE_LIFE}&&energy>.001){
      vec2 dir=uWakeDirs[i].xy,delta=p-uWakes[i].xy;
      float along=clamp(dot(delta,dir),-uWakeDirs[i].z,0.);
      vec2 radial=delta-dir*along;
      float distance=length(radial),speed=.52+.15*energy;
      float front=.035+age*speed,width=.075+age*.045;
      float q=(distance-front)/width;
      float second=(distance-front+speed*.28)/(width*1.12);
      if(abs(q)<3.5||abs(second)<3.5){
        float bell=exp(-q*q),echo=exp(-second*second);
        float trailing=.38*smoothstep(.28,.47,age);
        float fade=smoothstep(0.,.085,age)*(1.-smoothstep(.85,${WAKE_LIFE},age))*exp(-age*.65);
        float amplitude=(.012+.019*energy)*energy*fade*uWakeDirs[i].w;
        // Crest plus the shallow return trough conserve the sense of displaced water.
        float wave=(1.-2.*q*q)*bell+trailing*(1.-2.*second*second)*echo;
        height+=amplitude*wave;
        float gradient=(4.*q*q*q-6.*q)*bell/width;
        gradient+=trailing*(4.*second*second*second-6.*second)*echo/(width*1.12);
        slope+=radial/max(distance,.015)*amplitude*gradient;
        crest+=max(0.,wave)*energy*fade*uWakeDirs[i].w;
      }
    }
  }
  float age=uSceneTime-uLanding.z;
  if(age>=0.&&age<2.1){
    vec2 delta=p-uLanding.xy;float r=length(delta);
    float front=r-(.65+max(0.,age-.3)*.95),q=front/.16;
    float fade=smoothstep(0.,.12,age)*(1.-smoothstep(.6,2.1,age));
    float bell=exp(-q*q),amplitude=.024*fade;
    height+=amplitude*(1.-2.*q*q)*bell;
    slope+=delta/max(r,.02)*amplitude*(4.*q*q*q-6.*q)*bell/.16;
  }
  float thaw=1.-smoothstep(.10,.80,uFreeze);
  return vec4(clamp(slope,vec2(-.38),vec2(.38)),clamp(height,-.05,.05),min(crest,1.))*thaw;
}
`;

const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/** Evaluate once per colony, not the wake loop on every coral vertex. Matches wakeField. */
export function sampleReefCurrent(uniforms:OceanUniforms,x:number,z:number,out:{x:number;y:number}){
  const time=uniforms.uTime.value as number,freeze=uniforms.uFreeze.value as number;
  const a=x*.88+z*1.31-time*.72,b=x*1.93-z*.62+time*.55;
  let sx=0,sz=0;
  const wakes=uniforms.uWakes.value as T.Vector4[],directions=uniforms.uWakeDirs.value as T.Vector4[];
  for(let i=0;i<WAKE_COUNT;i++){
    const wake=wakes[i],age=time-wake.z;if(age<0||age>=WAKE_LIFE||wake.w<=.001)continue;
    const dir=directions[i],dx=x-wake.x,dz=z-wake.y,along=Math.max(-dir.z,Math.min(0,dx*dir.x+dz*dir.y));
    const rx=dx-dir.x*along,rz=dz-dir.y*along,distance=Math.hypot(rx,rz),width=.075+age*.045,speed=.52+.15*wake.w;
    const front=.035+age*speed,q=(distance-front)/width,second=(distance-front+speed*.28)/(width*1.12);
    if(Math.abs(q)>=3.5&&Math.abs(second)>=3.5)continue;
    const fade=smooth(0,.085,age)*(1-smooth(.85,WAKE_LIFE,age))*Math.exp(-age*.65),trailing=.38*smooth(.28,.47,age);
    const primary=(4*q*q*q-6*q)*Math.exp(-q*q)/width;
    const echo=trailing*(4*second*second*second-6*second)*Math.exp(-second*second)/(width*1.12);
    const gradient=(.012+.019*wake.w)*wake.w*fade*dir.w*(primary+echo)/Math.max(distance,.015);
    sx+=rx*gradient;sz+=rz*gradient;
  }
  const thaw=1-smooth(.1,.8,freeze),current=1-freeze*.85;
  out.x=(.65*Math.sin(a)+.35*Math.sin(b))*.075*current+Math.max(-.38,Math.min(.38,sx))*.3*thaw;
  out.y=(.48*Math.cos(a*.83)+.26*Math.sin(b))*.060*current+Math.max(-.38,Math.min(.38,sz))*.3*thaw;
}

/** CPU counterpart of seaWave, used by floating props. */
export function oceanSurface(x:number,z:number,time:number,winter:number){
  const a=x*.88+z*1.31-time*.72,b=x*1.93-z*.62+time*.55,c=x*-2.7+z*3.8-time*.94;
  const strength=1-winter;
  return {height:(.022*Math.sin(a)+.011*Math.sin(b)+.0035*Math.sin(c))*strength,
    dx:(.022*Math.cos(a)*.88+.011*Math.cos(b)*1.93+.0035*Math.cos(c)*-2.7)*strength,
    dz:(.022*Math.cos(a)*1.31+.011*Math.cos(b)*-.62+.0035*Math.cos(c)*3.8)*strength};
}
