import * as T from 'three';
export const climate={night:{value:0},winter:{value:0},autumn:{value:0}};
const installed=new WeakSet<T.Material>();
/** Surface snow follows upward-facing normals, preserving walls and muddy paths. */
export function seasonalSurface(material:T.MeshStandardMaterial|T.MeshLambertMaterial){
  if(installed.has(material))return;installed.add(material);
  const previous=material.onBeforeCompile,cache=material.customProgramCacheKey.bind(material),key=cache();
  material.onBeforeCompile=function(shader,renderer){
    previous.call(this,shader,renderer);
    shader.uniforms.uSeasonSnow=climate.winter;shader.uniforms.uSeasonAutumn=climate.autumn;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vSeasonNormal;varying vec3 vSeasonPosition;');
    shader.vertexShader=shader.vertexShader.replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvSeasonNormal=inverseTransformDirection(transformedNormal,viewMatrix);');
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 seasonLocal=vec4(transformed,1.);\n#ifdef USE_INSTANCING\nseasonLocal=instanceMatrix*seasonLocal;\n#endif\nvSeasonPosition=(modelMatrix*seasonLocal).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uSeasonSnow,uSeasonAutumn;varying vec3 vSeasonNormal;varying vec3 vSeasonPosition;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float vegetation=smoothstep(.015,.12,diffuseColor.g-max(diffuseColor.r*.88,diffuseColor.b));
      vec3 fallColor=vec3(.52,.28,.065)*( .8+diffuseColor.g*.6);
      diffuseColor.rgb=mix(diffuseColor.rgb,fallColor,uSeasonAutumn*vegetation*.85);
      float upward=smoothstep(.18,.75,normalize(vSeasonNormal).y);
      float grain=.5+.5*sin(vSeasonPosition.x*17.+sin(vSeasonPosition.z*13.))*sin(vSeasonPosition.z*19.);
      float snow=upward*smoothstep(grain*.22,.3+grain*.22,uSeasonSnow)*smoothstep(.025,.10,vSeasonPosition.y);
      // A light dusting reaches the upper coastal bevel and vertical tile rim.
      float rim=smoothstep(-.24,-.025,vSeasonPosition.y)*(1.-smoothstep(.08,.15,vSeasonPosition.y));
      snow=max(snow,rim*.28*smoothstep(.02,.8,uSeasonSnow));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.87,.93,.97),snow*.96);
    `);
  };
  material.customProgramCacheKey=()=>key+'-season-surface-v2';material.needsUpdate=true;
}
