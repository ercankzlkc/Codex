// The optical field is sampled in world XZ on the sand, stones and water.
// Refraction shifts the surface image slightly away from the light on the bed.
export const optics = /* glsl */ `
uniform float uTime;
uniform float uNight,uFreeze,uAutumn,uSummer;
uniform sampler2D uLight;
const mat2 turn = mat2(.891, .454, -.454, .891);
vec2 current(vec2 p) {
  vec2 longFlow = texture2D(uLight, turn*p*.057 + vec2(.14,.37) + uTime*vec2(.0056,-.00385)).ba - .5;
  vec2 crossFlow = texture2D(uLight, p*.136 - vec2(.11,.64) + uTime*vec2(-.00735,.00455)).ab - .5;
  return longFlow*.72 + crossFlow*.31;
}
uniform vec3 uLanding;
uniform vec4 uWakes[12],uWakeDirs[12];
vec4 waterDisturbance(vec2 p){
  float wake=0.;vec2 displacement=vec2(0.);
  for(int i=0;i<12;i++){
    float elapsed=uTime-uWakes[i].z;
    if(elapsed>=0.&&elapsed<1.5&&uWakes[i].w>0.){
      float speed=uWakes[i].w,seed=uWakeDirs[i].w*6.28318;
      vec2 dir=uWakeDirs[i].xy;
      vec2 delta=p-uWakes[i].xy-dir*elapsed*.12*speed;
      float radius=length(delta),theta=atan(delta.y,delta.x);
      float travel=.07+elapsed*(.50+1.05*speed);
      float front=radius-travel+.009*sin(theta*3.+seed+elapsed*2.);
      float width=.065+.035*speed;
      float crest=exp(-pow(front/width,2.));
      float trough=exp(-pow((front+.09)/(.085+.02*speed),2.));
      float second=exp(-pow((radius-travel*.70-.015)/width,2.))*.30;
      float fade=exp(-elapsed*(2.2+.4*speed))*speed;
      float shape=crest-trough*.30+second;
      wake+=shape*fade;
      displacement+=delta/max(radius,.02)*(crest-trough)*fade*.30;
    }
  }
  float age=uTime-uLanding.z;
  if(age>=0.&&age<2.1){
    vec2 delta=p-uLanding.xy;float r=length(delta);
    float front=r-(.65+max(0.,age-.3)*.95);
    float pulse=exp(-front*front*38.)*sin(front*17.)*(1.-smoothstep(.6,2.1,age));
    displacement+=delta/max(r,.02)*pulse*.25;
    wake+=pulse*.3;
  }
  return vec4(displacement,wake,clamp(length(displacement)*3.8,0.,1.));
}
struct Lens {float thread; float halo; float knot;};
Lens lightNet(vec2 p,vec2 flow,vec4 disturbance) {
  p+=disturbance.xy;
  vec2 largeUV=turn*p*.123 + flow*.175 + uTime*vec2(.0084,-.005775);
  vec2 smallBend=texture2D(uLight,largeUV*1.91+vec2(.28,.61)).ba-.5;
  vec4 field=texture2D(uLight,largeUV+smallBend*.067);
  float width=.009+.020*field.g+.017*field.b;
  float aa=clamp(fwidth(field.r)*.65,.004,.032);
  float core=1.-smoothstep(max(.0,width-aa),width+aa+.021,field.r);
  float halo=1.-smoothstep(.0,.19+field.g*.065,field.r);
  float visibility=smoothstep(.18,.76,field.a)*(.51+.49*field.b)*(1.-disturbance.w*.70);
  return Lens(core*visibility,halo*halo*visibility,field.g*field.g*core);
}
`;
// Height and analytic derivatives share exactly the same wave phases.
const waves = /* glsl */ `
vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8), d=vec2(5.2,2.1);
  float pa=dot(p,a)-uTime*1.05, pb=dot(p,b)+uTime*.81;
  float pc=dot(p,c)-uTime*1.47, pd=dot(p,d)+uTime*1.92;
  float height=.027*sin(pa)+.016*sin(pb)+.007*sin(pc)+.003*sin(pd);
  vec2 gradient=.027*cos(pa)*a+.016*cos(pb)*b+.007*cos(pc)*c+.003*cos(pd)*d;
  return vec3(height,gradient)*(1.-uFreeze);
}
`;
export const waterVertex = /* glsl */ `
#include <common>
#include <shadowmap_pars_vertex>
uniform float uTime;
uniform float uFreeze;
` + waves + /* glsl */ `
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=seaWave(p).x;
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
  vec4 worldPosition=vec4(vWorld,1.);
  vec3 transformedNormal=normalize(normalMatrix*normal);
  #include <shadowmap_vertex>
}`;
export const waterFragment = /* glsl */ `
#include <common>
#include <packing>
uniform bool receiveShadow;
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
` + optics + waves + /* glsl */ `
uniform sampler2D uCoast,uPreviousCoast;
uniform float uCoastMix;
uniform vec4 uRegion;
uniform vec3 uMint, uTurquoise, uLagoon, uDeep;
uniform vec3 uSunDirection,uReflectionEye;
uniform vec4 uTorchLights[4];
// Smooth, nonperiodic roughness. No high-frequency sine bars or screen-space streaks.
float waterHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float waterNoise(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(waterHash(i),waterHash(i+vec2(1.,0.)),f.x),mix(waterHash(i+vec2(0.,1.)),waterHash(i+vec2(1.)),f.x),f.y);
}
varying vec3 vWorld;
void main() {
  vec2 p=vWorld.xz;
  vec2 atlasUV=(p-uRegion.xy)/uRegion.zw;
  vec2 uv=clamp(atlasUV,vec2(0.),vec2(1.));
  vec4 mask=mix(texture2D(uPreviousCoast,uv),texture2D(uCoast,uv),uCoastMix);
  float shore=dot(mask.rg,vec2(65280.,255.))/65535.*8.-1.;
  float border=min(min(atlasUV.x,atlasUV.y),min(1.-atlasUV.x,1.-atlasUV.y));
  float depth=mix(3.8,mask.b*3.8,smoothstep(0.,.10,border));
  vec2 flow=current(p);
  vec4 weather=texture2D(uLight,turn*p*.038+flow*.053+vec2(.29,.51));
  float shelf=1.-smoothstep(.45,2.65,depth);
  float bank=.62*weather.b+.38*weather.a;
  float channel=smoothstep(.16,.90,bank);
  vec3 offshore=mix(uLagoon,uDeep,channel);
  vec3 pigment=mix(uMint,uTurquoise,smoothstep(.20,1.04,depth));
  pigment=mix(pigment,offshore,smoothstep(.88,3.15,depth));
  // Large, quiet colour variations in open water continue past the depth atlas.
  pigment*=.95+.10*weather.a;
  pigment=mix(pigment,pigment*vec3(.86,1.06,1.08),uSummer*.45);
  pigment=mix(pigment,pigment*vec3(1.12,.97,.85),uAutumn*.4);
  float age=uTime-uLanding.z;
  float radius=length(p-uLanding.xy);
  float ring=0.,arrivalFoam=0.;
  if(age>=0.&&age<2.1){
    vec2 delta=p-uLanding.xy;
    float angle=atan(delta.y,delta.x);
    float broken=smoothstep(.16,.74,.46+.30*sin(angle*3.+age*1.6)+.18*sin(angle*7.-age*1.2));
    float swell=radius+.045*sin(angle*4.+age*2.);
    float gatherRadius=mix(1.45,.65,smoothstep(0.,.48,age));
    float gather=exp(-pow((swell-gatherRadius)*8.,2.))*sin(3.14159*clamp(age/.6,0.,1.));
    float travel=max(0.,age-.38);
    float front=swell-(.77+travel*.95);
    float fade=smoothstep(.32,.65,age)*(1.-smoothstep(.8,1.85,age));
    float outward=exp(-front*front*55.)*cos(front*23.)*fade;
    float second=swell-(.65+max(0.,age-.70)*1.15);
    ring=(gather*.45+outward*.65)*broken;
    arrivalFoam=(max(outward,0.)*.36+exp(-second*second*80.)*fade*.16)*broken;
  }
  vec4 disturbance=waterDisturbance(p);
  float wake=disturbance.z;vec2 wakeSlope=disturbance.xy*.24;
  float seaGate=smoothstep(.06,.38,shore);
  wake*=seaGate;wakeSlope*=seaGate;
  vec2 distorted=p+.055*flow+vec2(.013,-.017)*sin(uTime*.42+p.y+flow.x);
  distorted+=.055*ring*(p-uLanding.xy)/max(radius,.01);
  disturbance*=seaGate;
  Lens lens=lightNet(distorted,flow,disturbance);
  float sunVisibility=getShadowMask();
  float sunlight=(.48+.44*weather.a)*sunVisibility;
  float focus=(lens.thread*.45+lens.halo*.20+lens.knot*.095)*sunlight;
  // Most refracted light is on the bed. The surface carries a fainter echo offshore.
  pigment+=vec3(.16,.30,.27)*focus*(.18+.22*shelf);
  pigment*=mix(vec3(.61,.72,.76),vec3(1.),sunVisibility);
  vec2 rippleUV=p*2.7+uTime*vec2(-.065,.04);
  vec2 microRipples=(vec2(waterNoise(rippleUV),waterNoise(rippleUV+vec2(19.7,5.2)))-.5)*.038;
  vec2 slope=seaWave(p).yz*.65+flow*.018+wakeSlope+microRipples;
  vec3 normal=normalize(vec3(-slope.x,1.,-slope.y));
  // The orthographic camera may move back to keep its near plane above water.
  // A fixed-distance reflection eye avoids scaling a giant glare patch with that move.
  vec3 eye=normalize(uReflectionEye-vWorld);
  float fresnel=.025+.975*pow(1.-max(dot(normal,eye),0.),5.);
  vec3 sky=mix(vec3(.22,.48,.65),vec3(.53,.79,.87),max(eye.y,0.));
  pigment=mix(pigment,sky,fresnel*.45);
  vec3 halfway=normalize(uSunDirection+eye);
  float sunDot=max(dot(normal,halfway),0.);
  float footprint=max(fwidth(sunDot),.00001);
  float fineSun=pow(sunDot,720.)/(1.+footprint*900.);
  float halo=pow(sunDot,180.);
  float breakup=smoothstep(.38,.78,waterNoise(p*4.3+flow*.45+uTime*vec2(.045,-.025)));
  float reflection=(fineSun*breakup*.21+halo*.012)*smoothstep(.18,.9,depth)*seaGate*sunVisibility;
  pigment=mix(pigment,vec3(1.,.96,.83),clamp(reflection,0.,.23));
  // The beach crosses sea level at roughly .16 units beyond an exposed hex edge.
  float gate=smoothstep(-.07,.065,shore);
  float drift=.5+.5*sin(uTime*1.25+flow.y*7.+dot(p,vec2(.49,.71)));
  float wash=.205+.083*drift+.070*flow.x;
  float surfDistance=abs(shore-wash);
  float aa=max(.006,fwidth(shore)*.68);
  float rim=1.-smoothstep(.010,.029+aa,surfDistance);
  float lace=texture2D(uLight,turn*p*.29+flow*.13+uTime*vec2(.003,-.004)).r;
  float gaps=smoothstep(.10,.66,drift*.4+weather.a*.6+flow.y*.55);
  float fringe=(1.-smoothstep(.012,.081,lace))*(1.-smoothstep(.025,.105,surfDistance));
    // Scalloped arcs peel off in short patches as a wash retreats.
  float retreat=.28+.27*drift+.11*flow.y;
  float tornEdge=abs(shore-retreat-.048*sin(dot(p,vec2(3.1,-2.2))+flow.x*4.));
  float backwash=(1.-smoothstep(.003,.021+aa,tornEdge))*smoothstep(.48,.82,weather.a+flow.x*.56)*drift;
  float foam=gate*clamp(rim*(.32+.63*gaps)+fringe*gaps*.42+backwash*.49,0.,1.);
  pigment=mix(pigment,vec3(.86,.93,.87)*mix(.75,1.,sunVisibility),foam*.72);
  pigment+=max(ring,0.)*vec3(.21,.32,.29);
  pigment=mix(pigment,vec3(.73,.93,.88),clamp(arrivalFoam*gate,0.,.5));
  pigment+=max(wake,0.)*vec3(.10,.17,.16);
  pigment*=1.+min(wake,0.)*.07;
  float opacity=1.-.78*exp(-1.25*max(0.,depth-.25));
  opacity=mix(opacity,1.,smoothstep(2.38,3.25,depth));
  opacity=mix(opacity,.94,foam);
  // Freeze the entire visible ocean, with stable fine cracks and a gradual frost front.
  float frostNoise=waterNoise(p*.8)*.6+waterNoise(p*3.1)*.4;
  float freeze=smoothstep(frostNoise*.32,.48+frostNoise*.32,uFreeze);
  // Open the ice over the landing hex before the shared land-rise starts at .6s.
  vec2 iceDelta=abs(p-uLanding.xy);
  float hexDistance=max(iceDelta.x,iceDelta.x*.5+iceDelta.y*.8660254);
  float brokenHex=1.-smoothstep(.85,.94,hexDistance);
  float breakOpen=smoothstep(0.,.22,age)*(1.-smoothstep(1.6,2.1,age));
  if(age>=0.&&age<2.1)freeze*=1.-brokenHex*breakOpen;
  float cell=texture2D(uLight,p*.12).r;
  float cracks=(1.-smoothstep(.006,.025,cell));
  vec3 iceColor=mix(vec3(.57,.77,.85),vec3(.83,.92,.95),waterNoise(p*1.8));
  iceColor*=1.-cracks*.16;
  pigment=mix(pigment,iceColor,freeze);
  opacity=mix(opacity,1.,freeze);
  pigment*=mix(vec3(1.),vec3(.07,.13,.25),uNight*.94);
  // View-dependent reflections use the actual emitters and the water's continuous normals.
  for(int i=0;i<4;i++){
    if(uTorchLights[i].w>.001){
      vec3 delta=uTorchLights[i].xyz-vWorld;
      float distance2=dot(delta,delta);
      vec3 lightDir=normalize(delta),halfDir=normalize(lightDir+eye);
      float specular=pow(max(dot(normal,halfDir),0.),48.);
      float gentleScatter=.012*max(dot(normal,lightDir),0.);
      pigment+=vec3(1.,.43,.12)*(specular*.6+gentleScatter)*uTorchLights[i].w/(1.+distance2*2.5)*(1.-uFreeze*.9);
    }
  }
  gl_FragColor=vec4(pigment,opacity);
  #include <colorspace_fragment>
}`;

/** Injected into Lambert materials so sun shadows still fall on submerged sand and rocks. */
export const receiverLight = /* glsl */ `
  vec2 bedPosition=vReceiver.xz;
  float immersion=max(0.,-.18-vReceiver.y);
  vec2 refraction=current(bedPosition);
  vec2 projected=bedPosition + immersion*vec2(.19,-.12) + refraction*(.15+.11*immersion);
  vec4 disturbance=waterDisturbance(bedPosition);
  Lens sunprint=lightNet(projected*1.24,refraction,disturbance);
  float transmission=exp(-immersion*.98);
  float concentration=sunprint.thread*.64 + sunprint.halo*.32 + sunprint.knot*.18;
  diffuseColor.rgb*=.90 + transmission*(.09+concentration*.49);
  diffuseColor.rgb+=vec3(.21,.37,.30)*concentration*transmission*(1.-uNight)*(1.-uFreeze);
`;


