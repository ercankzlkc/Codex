// The optical field is sampled in world XZ on the sand, stones and water.
// Refraction shifts the surface image slightly away from the light on the bed.
export const optics = /* glsl */ `
uniform float uTime;
uniform sampler2D uLight;
const mat2 turn = mat2(.891, .454, -.454, .891);
vec2 current(vec2 p) {
  vec2 longFlow = texture2D(uLight, turn*p*.057 + vec2(.14,.37) + uTime*vec2(.0016,-.0011)).ba - .5;
  vec2 crossFlow = texture2D(uLight, p*.136 - vec2(.11,.64) + uTime*vec2(-.0021,.0013)).ab - .5;
  return longFlow*.72 + crossFlow*.31;
}
struct Lens {float thread; float halo; float knot;};
Lens lightNet(vec2 p,vec2 flow) {
  vec2 largeUV=turn*p*.123 + flow*.175 + uTime*vec2(.0024,-.00165);
  vec2 smallBend=texture2D(uLight,largeUV*1.91+vec2(.28,.61)).ba-.5;
  vec4 field=texture2D(uLight,largeUV+smallBend*.067);
  float width=.009+.020*field.g+.017*field.b;
  float aa=clamp(fwidth(field.r)*.65,.004,.032);
  float core=1.-smoothstep(max(.0,width-aa),width+aa+.021,field.r);
  float halo=1.-smoothstep(.0,.19+field.g*.065,field.r);
  float visibility=smoothstep(.18,.76,field.a)*(.51+.49*field.b);
  return Lens(core*visibility,halo*halo*visibility,field.g*field.g*core);
}
`;
export const waterVertex = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=.014*sin(dot(p,vec2(.88,1.31))+uTime*.64)
    +.009*sin(dot(p,vec2(1.93,-.62))-uTime*.47)
    +.005*sin(dot(p,vec2(-1.13,2.51))+uTime*.39);
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`;
export const waterFragment = optics + /* glsl */ `
uniform sampler2D uCoast;
uniform vec4 uRegion;
uniform vec3 uMint, uTurquoise, uLagoon, uDeep;
uniform vec3 uLanding;
varying vec3 vWorld;
void main() {
  vec2 p=vWorld.xz;
  vec2 uv=clamp((p-uRegion.xy)/uRegion.zw,vec2(0.),vec2(1.));
  vec4 mask=texture2D(uCoast,uv);
  float shore=dot(mask.rg,vec2(65280.,255.))/65535.*8.-1.;
  float depth=mask.b*3.8;
  vec2 flow=current(p);
  vec4 weather=texture2D(uLight,turn*p*.038+flow*.053+vec2(.29,.51));
  float shelf=1.-smoothstep(.45,2.65,depth);
  float bank=.62*weather.b+.38*weather.a;
  float channel=smoothstep(.20,.84,bank);
  vec3 offshore=mix(uLagoon,uDeep,channel);
  vec3 pigment=mix(uMint,uTurquoise,smoothstep(.20,1.04,depth));
  pigment=mix(pigment,offshore,smoothstep(.88,3.15,depth));
  // Large, quiet colour variations in open water continue past the depth atlas.
  pigment*=.95+.10*weather.a;
  float age=uTime-uLanding.z;
  float radius=length(p-uLanding.xy);
  float ring=0.;
  if(age>=0.&&age<1.85){
    float front=radius-(.74+age*.93);
    ring=exp(-115.*front*front)*sin(front*36.)*sin(3.14159*age/1.85)*smoothstep(.025,.22,shore);
  }
  vec2 distorted=p+.055*flow+vec2(.013,-.017)*sin(uTime*.42+p.y+flow.x);
  distorted+=.055*ring*(p-uLanding.xy)/max(radius,.01);
  Lens lens=lightNet(distorted,flow);
  float sunlight=.48+.44*weather.a;
  float focus=(lens.thread*.45+lens.halo*.20+lens.knot*.095)*sunlight;
  // Most refracted light is on the bed. The surface carries a fainter echo offshore.
  pigment+=mix(vec3(.09,.24,.22),vec3(.30,.45,.31),shelf)*focus*(.46+.23*shelf);
  vec2 slope=vec2(.022*cos(dot(p,vec2(.88,1.31))+uTime*.64),.021*cos(dot(p,vec2(1.93,-.62))-uTime*.47))+flow*.13;
  vec3 normal=normalize(vec3(-slope.x,1.,-slope.y));
  vec3 eye=normalize(vec3(viewMatrix[0][2],viewMatrix[1][2],viewMatrix[2][2]));
  float fresnel=pow(1.-max(dot(normal,eye),0.),3.);
  pigment=mix(pigment,vec3(.49,.77,.84),fresnel*.27);
  float fleck=lens.knot*pow(smoothstep(.46,.83,weather.b),3.)*smoothstep(-.04,.04,slope.x-slope.y);
  pigment+=vec3(.11,.105,.065)*fleck;
  // The beach crosses sea level at roughly .16 units beyond an exposed hex edge.
  float gate=smoothstep(-.07,.065,shore);
  float drift=.5+.5*sin(uTime*.79+flow.y*7.+dot(p,vec2(.49,.71)));
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
  pigment=mix(pigment,vec3(.88,.96,.83),foam);
  pigment+=max(ring,0.)*vec3(.12,.19,.17);
  float opacity=1.-.78*exp(-1.25*max(0.,depth-.25));
  opacity=mix(opacity,1.,smoothstep(2.38,3.25,depth));
  opacity=mix(opacity,.94,foam);
  gl_FragColor=vec4(pigment,opacity);
  #include <colorspace_fragment>
}`;

/** Injected into Lambert materials so sun shadows still fall on submerged sand and rocks. */
export const receiverLight = /* glsl */ `
  vec2 bedPosition=vReceiver.xz;
  float immersion=max(0.,-.18-vReceiver.y);
  vec2 refraction=current(bedPosition);
  vec2 projected=bedPosition + immersion*vec2(.19,-.12) + refraction*(.15+.11*immersion);
  Lens sunprint=lightNet(projected*1.24,refraction);
  float transmission=exp(-immersion*.98);
  float concentration=sunprint.thread*.64 + sunprint.halo*.32 + sunprint.knot*.18;
  diffuseColor.rgb*=.90 + transmission*(.09+concentration*.49);
  diffuseColor.rgb+=vec3(.21,.37,.30)*concentration*transmission;
`;


