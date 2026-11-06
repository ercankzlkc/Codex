import * as T from 'three';
import {torchField} from './torch-light';
export const climate={night:{value:0},winter:{value:0},autumn:{value:0},summer:{value:0}};
const installed=new WeakSet<T.Material>();
/** Surface snow follows upward-facing normals, preserving walls and muddy paths. */
export function seasonalSurface(material:T.MeshStandardMaterial|T.MeshLambertMaterial){
  if(installed.has(material))return;installed.add(material);
  const previous=material.onBeforeCompile,cache=material.customProgramCacheKey.bind(material),key=cache();
  material.onBeforeCompile=function(shader,renderer){
    previous.call(this,shader,renderer);
    shader.uniforms.uTorchField=torchField.map;shader.uniforms.uTorchHeat=torchField.heat;shader.uniforms.uTorchRegion=torchField.region;
    shader.uniforms.uSeasonSnow=climate.winter;shader.uniforms.uSeasonAutumn=climate.autumn;shader.uniforms.uSeasonSummer=climate.summer;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vSeasonNormal;varying vec3 vSeasonPosition;');
    shader.vertexShader=shader.vertexShader.replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvSeasonNormal=inverseTransformDirection(transformedNormal,viewMatrix);');
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 seasonLocal=vec4(transformed,1.);\n#ifdef USE_INSTANCING\nseasonLocal=instanceMatrix*seasonLocal;\n#endif\nvSeasonPosition=(modelMatrix*seasonLocal).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D uTorchField,uTorchHeat;uniform vec4 uTorchRegion;uniform float uSeasonSnow,uSeasonAutumn,uSeasonSummer;varying vec3 vSeasonNormal;varying vec3 vSeasonPosition;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float vegetation=smoothstep(.015,.12,diffuseColor.g-max(diffuseColor.r*.88,diffuseColor.b));
      diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.12,1.03,.86),uSeasonSummer*vegetation*.45);
      vec3 fallColor=vec3(.52,.28,.065)*( .8+diffuseColor.g*.6);
      diffuseColor.rgb=mix(diffuseColor.rgb,fallColor,uSeasonAutumn*vegetation*.85);
      float upward=smoothstep(.18,.75,normalize(vSeasonNormal).y);
      float grain=.5+.5*sin(vSeasonPosition.x*17.+sin(vSeasonPosition.z*13.))*sin(vSeasonPosition.z*19.);
      float snow=upward*smoothstep(grain*.22,.3+grain*.22,uSeasonSnow)*smoothstep(.025,.10,vSeasonPosition.y);
      // A light dusting reaches the upper coastal bevel and vertical tile rim.
      float rim=smoothstep(-.24,-.025,vSeasonPosition.y)*(1.-smoothstep(.08,.15,vSeasonPosition.y));
      snow=max(snow,rim*.28*smoothstep(.02,.8,uSeasonSnow));
      vec2 heatUv=(vSeasonPosition.xz-uTorchRegion.xy)/uTorchRegion.zw;
      float heatInside=step(0.,heatUv.x)*step(0.,heatUv.y)*step(heatUv.x,1.)*step(heatUv.y,1.);
      float warmth=texture2D(uTorchHeat,clamp(heatUv,0.,1.)).r*heatInside;
      // Only ground, the low shore and nearby grass thaw. Snowy roofs remain cold.
      float groundHeat=(1.-smoothstep(.30,.49,vSeasonPosition.y))*smoothstep(-.20,-.08,vSeasonPosition.y);
      snow*=1.-smoothstep(.05,.86,warmth)*groundHeat;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.87,.93,.97),snow*.96);
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
      vec2 torchUv=(vSeasonPosition.xz-uTorchRegion.xy)/uTorchRegion.zw;
      float torchInside=step(0.,torchUv.x)*step(0.,torchUv.y)*step(torchUv.x,1.)*step(torchUv.y,1.);
      float torchWarm=texture2D(uTorchField,clamp(torchUv,0.,1.)).r*torchInside;
      float torchHeight=exp(-max(0.,vSeasonPosition.y-.55)*1.3)*smoothstep(-.02,.10,vSeasonPosition.y);
      float torchSurface=.7+.3*max(0.,normalize(vSeasonNormal).y);
      outgoingLight+=diffuseColor.rgb*vec3(1.,.88,.70)*torchWarm*torchHeight*torchSurface*.46;
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey=()=>key+'-season-surface-v6-local-torch-thaw';material.needsUpdate=true;
}
