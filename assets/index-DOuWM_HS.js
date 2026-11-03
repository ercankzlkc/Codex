(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=e(r);fetch(r.href,a)}})();const ii=1.03,Qu=Math.sqrt(3),Zi=64,Ur=129,td=[{q:1,r:0},{q:0,r:1},{q:-1,r:1},{q:-1,r:0},{q:0,r:-1},{q:1,r:-1}];function ll(i,t){return Number.isInteger(i)&&Number.isInteger(t)&&Math.abs(i)<=Zi&&Math.abs(t)<=Zi?(i+Zi)*Ur+t+Zi:-1}const he=ll(0,0);function Ga(i){return{q:Math.floor(i/Ur)-Zi,r:i%Ur-Zi}}function Ye(i){if(!Number.isInteger(i)||i<0||i>=Ur*Ur)return[];const{q:t,r:e}=Ga(i);return td.map(n=>ll(t+n.q,e+n.r))}function ie(i){const{q:t,r:e}=Ga(i);return{x:ii*Qu*(t+e/2),z:ii*1.5*e}}function ke(i,t){const e=(i/Qu-t/3)/ii,n=2*t/3/ii,r=-e-n;let a=Math.round(e),s=Math.round(n);const o=Math.round(r),l=Math.abs(a-e),c=Math.abs(s-n),u=Math.abs(o-r);return l>c&&l>u?a=-s-o:c>u&&(s=-a-o),ll(a,s)}function ed(i){const t=new Set;for(const e of i.keys())for(const n of Ye(e))n>=0&&!i.has(n)&&t.add(n);return[...t]}function nd(i,t){return t>=0&&!i.has(t)&&Ye(t).some(e=>i.has(e))}function Nr(i,t=ii){const e=(i-.5)*Math.PI/3;return{x:Math.cos(e)*t,z:Math.sin(e)*t}}function Ca(i){const t=[];for(const e of i.keys()){const n=ie(e);Ye(e).forEach((r,a)=>{if(i.has(r))return;const s=Nr(a),o=Nr(a+1);t.push({id:e,side:a,ax:n.x+s.x,az:n.z+s.z,bx:n.x+o.x,bz:n.z+o.z})})}return t}const Zn=[{id:"stone",name:"Taş Ocağı",cost:3,workers:2,desc:"+3 taş / teslimat",bonus:"Kazmayla çıkarılır · yeniden oluşur"},{id:"fisher",name:"Balıkçı Kulübesi",cost:7,workers:1,desc:"+3 balık / teslimat",bonus:"Kıyıda iskele · olta balıkçılığı"},{id:"forest",name:"Orman",cost:0,workers:1,desc:"+2 odun / teslimat",bonus:"Komşu orman +1 · oduncu kulübesi +2 odun"},{id:"berry",name:"Çilek Bahçesi",cost:2,workers:1,desc:"+4 yiyecek / teslimat",bonus:"Komşu orman: +1 yiyecek"},{id:"house",name:"Ev",cost:5,workers:0,desc:"+2 nüfus · +2 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"lumber",name:"Oduncu Kulübesi",cost:5,workers:0,desc:"Komşu ormanlara +2 odun",bonus:"Her komşu ormana +2 odun"},{id:"farm",name:"Çiftlik",cost:7,workers:2,desc:"+4 yiyecek / teslimat",bonus:"Komşu depo: +2 yiyecek"},{id:"store",name:"Depo",cost:6,workers:0,desc:"60 ürün kapasitesi",bonus:"Ürünler teslim edilince depoya eklenir"},{id:"garden",name:"Bahçe",cost:3,workers:1,desc:"+2 refah / teslimat",bonus:"Komşu ev başına +1 refah"},{id:"manor",name:"Büyük Ev",cost:10,workers:0,desc:"+4 nüfus · +4 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"festival",name:"Şenlik",cost:4,workers:0,desc:"+16 refah · −3 yiyecek",bonus:"Anında uygulanır · yer kaplamaz",event:!0},{id:"harvest",name:"Acil Hasat",cost:0,workers:0,desc:"+12 yiyecek · −5 refah",bonus:"Anında uygulanır · yer kaplamaz",event:!0}],Fr=["wood","stone","berry","farm","fish"],eo=.8;function Va(i,t){const e=Ga(i),n=Ga(t);return Math.max(Math.abs(e.q-n.q),Math.abs(e.r-n.r),Math.abs(e.q+e.r-n.q-n.r))}class tf{board=new Map([[he,"house"]]);wood=18;stone=0;happy=70;foods={berry:8,wheat:4,fish:0};priorities={wood:30,stone:15,berry:30,farm:15,fish:10};meal=0;mealPerson=0;meals=[];storageLevels=new Map([[he,1]]);storageStocks=new Map([[he,{wood:18,stone:0,berry:8,wheat:4,fish:0}]]);storageCapacity(t){return this.storageStocks.has(t)?(t===he?80:60)*(this.storageLevels.get(t)??1):0}storageUsed(t){const e=this.storageStocks.get(t);return e?Object.values(e).reduce((n,r)=>n+r,0):0}storageFree(t){return Math.max(0,this.storageCapacity(t)-this.storageUsed(t))}canStore(t,e){return this.storageStocks.has(t)&&(e==="happy"||this.storageFree(t)>0)}upgradeCost(t){return 12*(this.storageLevels.get(t)??1)}upgradeStore(t){return!this.storageStocks.has(t)||this.wood<this.upgradeCost(t)?!1:(this.spendWood(this.upgradeCost(t)),this.storageLevels.set(t,(this.storageLevels.get(t)??1)+1),!0)}spendWood(t){this.wood-=t;let e=t;for(const n of this.storageStocks.values()){const r=Math.min(e,n.wood);if(n.wood-=r,e-=r,!e)break}}addFood(t,e){for(const[n,r]of this.storageStocks){const a=Math.min(e,this.storageFree(n));if(r[t]+=a,this.foods[t]+=a,e-=a,!e)break}}takeMeals(){const t=this.meals;return this.meals=[],t}wouldSealFishery(t){return[...this.board].some(([e,n])=>n==="fisher"&&Ye(e).every(r=>r===t||this.board.has(r)))}get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}get foodPerMinute(){return this.people*2}consumeFood(t){let e=0;for(;e<t&&this.food>0;){const n=Object.keys(this.foods).sort((r,a)=>this.foods[a]-this.foods[r])[0];this.foods[n]--;for(const r of this.storageStocks.values())if(r[n]>0){r[n]--;break}e++}return e}tick(t){this.meal+=t*this.people/30;const e=Math.floor(this.meal);if(e){this.meal-=e;for(let n=0;n<e;n++){const r=this.consumeFood(1)>0,a=this.residents[this.mealPerson++%this.people].id;this.meals.push({id:a,ate:r}),r||(this.happy=Math.max(0,this.happy-.35))}}}categoryFor(t){const e=this.board.get(t);return e==="stone"?"stone":e==="forest"?"wood":e==="berry"?"berry":e==="farm"?"farm":e==="fisher"?"fish":null}workTargets(){const t=Fr.filter(s=>[...this.board.keys()].some(o=>this.categoryFor(o)===s&&this.storageFor(o).length)),e={wood:0,stone:0,berry:0,farm:0,fish:0},n=t.reduce((s,o)=>s+this.priorities[o],0);if(!n)return e;const r=t.map(s=>({c:s,raw:this.people*this.priorities[s]/n}));for(const s of r)e[s.c]=Math.floor(s.raw);let a=this.people-Object.values(e).reduce((s,o)=>s+o,0);for(const s of r.sort((o,l)=>l.raw%1-o.raw%1))a-- >0&&e[s.c]++;return e}setPriority(t,e){e=Math.max(0,Math.min(100,Math.round(e)));const n=Fr.filter(s=>s!==t),r=n.reduce((s,o)=>s+this.priorities[o],0);this.priorities[t]=e;let a=100-e;n.forEach((s,o)=>{const l=o===n.length-1?a:Math.min(a,Math.round((100-e)*(r?this.priorities[s]/r:1/n.length)));this.priorities[s]=l,a-=l})}residents=[{id:0,home:he}];get people(){return this.residents.length}hand=[];rng;constructor(t=Math.random){this.rng=t,this.hand=["forest","berry","house"].map(e=>Zn.find(n=>n.id===e))}neighbors(t){return Ye(t)}draw(){const t=Zn.filter(e=>!["farm","manor"].includes(e.id)||this.people>=3);for(this.hand=[];this.hand.length<3;)this.hand.push(t.splice(Math.floor(this.rng()*t.length),1)[0]);this.hand.some(e=>e.cost<=this.wood)||(this.hand[0]=Zn.find(e=>e.id==="forest")),this.people>=3&&![...this.board.values()].includes("fisher")&&!this.hand.some(e=>e.id==="fisher")&&(this.hand[2]=Zn.find(e=>e.id==="fisher"))}production(){return this.calculateProduction(this.board,this.people)}calculateProduction(t,e){let n=0;const r=new Set,a=l=>l==="berry"||l==="farm"||l==="fisher",s=[...t].map(([l,c])=>({k:c,i:l})).sort((l,c)=>Number(a(c.k)||c.i===he)-Number(a(l.k)||l.i===he));for(const{k:l,i:c}of s){const u=Zn.find(d=>d.id===l),f=c===he?0:u?.workers;f!==void 0&&n+f<=e&&(n+=f,r.add(c))}const o=[...t].flatMap(([l,c])=>{if(!c)return[];const u=this.neighbors(l),f=u.map(m=>t.get(m));let d=0,h=0,g=0,v=!1;return r.has(l)&&(c==="forest"&&(d=2+u.filter(p=>t.get(p)==="lumber"&&r.has(p)).length*2+f.filter(p=>p==="forest").length,v=d>2),c==="berry"&&(h=4+f.filter(m=>m==="forest").length,v=h>4),c==="fisher"&&(h=3),c==="farm"&&(h=4+(f.includes("store")?2:0),v=h>9),c==="garden"&&(g=2+f.filter(m=>m==="house"||m==="manor").length,v=g>2),(c==="house"||c==="manor")&&f.includes("garden")&&(g=1,v=!0)),[{i:l,wood:d,food:h,happy:g,active:r.has(l),bonus:v}]});return{wood:o.reduce((l,c)=>l+c.wood,0),food:o.reduce((l,c)=>l+c.food,0),happy:o.reduce((l,c)=>l+c.happy,0),used:n,idle:e-n,rows:o}}valid(t,e){return this.hand.includes(t)&&t.cost<=this.wood&&(t.id!=="festival"||this.food>=3)&&(t.event?this.board.has(e):nd(this.board,e)&&!this.wouldSealFishery(e))&&(t.id!=="fisher"||Ye(e).some(n=>!this.board.has(n)))}preview(t,e){if(!this.valid(t,e))return null;const n=Ye(e).map(c=>this.board.get(c)),r=t.id==="house"?2:t.id==="manor"?4:0,a=t.id==="forest"?2+n.filter(c=>c==="forest").length+2*n.filter(c=>c==="lumber").length:0,s=t.id==="berry"?4+n.filter(c=>c==="forest").length:t.id==="farm"?4+n.filter(c=>c==="store").length*2:t.id==="fisher"?3:0,o=t.id==="stone"?3:0,l=t.id==="garden"?2+n.filter(c=>c==="house"||c==="manor").length:0;return{wood:a,stone:o,food:s,happy:l,people:r,neighbors:Ye(e).filter(c=>this.board.has(c)),localBonus:a>2||s>4||l>2}}play(t,e=he){if(!this.valid(t,e))return null;this.spendWood(t.cost),t.event||this.board.set(e,t.id),t.id==="store"&&(this.storageLevels.set(e,1),this.storageStocks.set(e,{wood:0,stone:0,berry:0,wheat:0,fish:0}));const n=t.id==="house"?2:t.id==="manor"?4:0;for(let r=0;r<n;r++)this.residents.push({id:this.residents.length,home:e});return t.id==="festival"&&(this.happy=Math.min(100,this.happy+16),this.consumeFood(3)),t.id==="harvest"&&(this.addFood("berry",12),this.happy=Math.max(0,this.happy-5)),this.draw(),this.production()}remove(t){if(t===he||!this.board.has(t))return!1;const e=this.storageStocks.get(t);if(e){this.wood-=e.wood,this.stone-=e.stone;for(const n of["berry","wheat","fish"])this.foods[n]-=e[n];this.storageStocks.delete(t),this.storageLevels.delete(t)}this.board.delete(t);for(const n of this.residents)n.home===t&&(n.home=he);return!0}productAt(t){const e=this.board.get(t),n=Ye(t).map(r=>this.board.get(r));return e==="fisher"&&Ye(t).some(r=>!this.board.has(r))?{resource:"food",amount:3,capacity:1}:e==="stone"?{resource:"stone",amount:3,capacity:2}:e==="forest"?{resource:"wood",amount:2+n.filter(r=>r==="forest").length+2*n.filter(r=>r==="lumber").length,capacity:3}:e==="berry"?{resource:"food",amount:4+n.filter(r=>r==="forest").length,capacity:2}:e==="farm"?{resource:"food",amount:4+n.filter(r=>r==="store").length*2,capacity:2}:e==="garden"?{resource:"happy",amount:2+n.filter(r=>r==="house"||r==="manor").length,capacity:1}:null}storageFor(t){return[...this.board].filter(([e,n])=>e===he||n==="store").sort(([e],[n])=>Va(t,e)-Va(t,n)).map(([e])=>e)}deliver(t,e,n,r){const a=this.productAt(t);if(!a||a.resource!==n||!this.storageFor(t).includes(e))return 0;const s=Math.max(0,Math.min(a.amount,Math.floor(r),n==="happy"?1/0:this.storageFree(e)));if(n==="happy"){const l=this.happy;return this.happy=Math.min(100,this.happy+s),Number((this.happy-l).toFixed(2))}const o=this.storageStocks.get(e);if(!o)return 0;if(n==="food"){const l=this.board.get(t),c=l==="fisher"?"fish":l==="farm"?"wheat":"berry";this.foods[c]+=s,o[c]+=s}else n==="stone"?(this.stone+=s,o.stone+=s):(this.wood+=s,o.wood+=s);return s}}const cl="180",id=0,nc=1,rd=2,ef=1,nf=2,Nn=3,ri=0,$e=1,Oe=2,ti=0,tr=1,ic=2,rc=3,ac=4,ad=5,vi=100,sd=101,od=102,ld=103,cd=104,ud=200,fd=201,hd=202,dd=203,no=204,io=205,pd=206,md=207,gd=208,vd=209,_d=210,xd=211,yd=212,Md=213,bd=214,ro=0,ao=1,so=2,ar=3,oo=4,lo=5,co=6,uo=7,ul=0,Sd=1,Ed=2,ei=0,wd=1,Td=2,Ad=3,fo=4,Rd=5,Cd=6,Pd=7,rf=300,sr=301,or=302,ho=303,po=304,ns=306,Wa=1e3,Mi=1001,mo=1002,tn=1003,Ld=1004,ta=1005,ln=1006,vs=1007,Qn=1008,Rn=1009,af=1010,sf=1011,Or=1012,fl=1013,Ei=1014,wn=1015,Yr=1016,hl=1017,dl=1018,zr=1020,of=35902,lf=35899,cf=1021,uf=1022,Qe=1023,kr=1026,Br=1027,pl=1028,ml=1029,ff=1030,gl=1031,vl=1033,Pa=33776,La=33777,Ia=33778,Da=33779,go=35840,vo=35841,_o=35842,xo=35843,yo=36196,Mo=37492,bo=37496,So=37808,Eo=37809,wo=37810,To=37811,Ao=37812,Ro=37813,Co=37814,Po=37815,Lo=37816,Io=37817,Do=37818,Uo=37819,No=37820,Fo=37821,Oo=36492,zo=36494,ko=36495,Bo=36283,Ho=36284,Go=36285,Vo=36286,Id=3200,Dd=3201,_l=0,Ud=1,Jn="",Je="srgb",lr="srgb-linear",Xa="linear",ae="srgb",Ui=7680,sc=519,Nd=512,Fd=513,Od=514,hf=515,zd=516,kd=517,Bd=518,Hd=519,oc=35044,lc="300 es",Tn=2e3,Ya=2001;class dr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const a=r.indexOf(e);a!==-1&&r.splice(a,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let cc=1234567;const Pr=Math.PI/180,Hr=180/Math.PI;function pr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function Xt(i,t,e){return Math.max(t,Math.min(e,i))}function xl(i,t){return(i%t+t)%t}function Gd(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function Vd(i,t,e){return i!==t?(e-i)/(t-i):0}function Lr(i,t,e){return(1-e)*i+e*t}function Wd(i,t,e,n){return Lr(i,t,1-Math.exp(-e*n))}function Xd(i,t=1){return t-Math.abs(xl(i,t*2)-t)}function Yd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function $d(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function jd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function qd(i,t){return i+Math.random()*(t-i)}function Kd(i){return i*(.5-Math.random())}function Zd(i){i!==void 0&&(cc=i);let t=cc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jd(i){return i*Pr}function Qd(i){return i*Hr}function tp(i){return(i&i-1)===0&&i!==0}function ep(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function np(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ip(i,t,e,n,r){const a=Math.cos,s=Math.sin,o=a(e/2),l=s(e/2),c=a((t+n)/2),u=s((t+n)/2),f=a((t-n)/2),d=s((t-n)/2),h=a((n-t)/2),g=s((n-t)/2);switch(r){case"XYX":i.set(o*u,l*f,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*f,o*c);break;case"ZXZ":i.set(l*f,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*h,o*c);break;case"YXY":i.set(l*h,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*h,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ki(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Kt={DEG2RAD:Pr,RAD2DEG:Hr,generateUUID:pr,clamp:Xt,euclideanModulo:xl,mapLinear:Gd,inverseLerp:Vd,lerp:Lr,damp:Wd,pingpong:Xd,smoothstep:Yd,smootherstep:$d,randInt:jd,randFloat:qd,randFloatSpread:Kd,seededRandom:Zd,degToRad:Jd,radToDeg:Qd,isPowerOfTwo:tp,ceilPowerOfTwo:ep,floorPowerOfTwo:np,setQuaternionFromProperEuler:ip,normalize:Ve,denormalize:Ki};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),a=this.x-t.x,s=this.y-t.y;return this.x=a*n-s*r+t.x,this.y=a*r+s*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $r{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,a,s,o){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3];const d=a[s+0],h=a[s+1],g=a[s+2],v=a[s+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=d,t[e+1]=h,t[e+2]=g,t[e+3]=v;return}if(f!==v||l!==d||c!==h||u!==g){let m=1-o;const p=l*d+c*h+u*g+f*v,b=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const w=Math.sqrt(E),T=Math.atan2(w,p*b);m=Math.sin(m*T)/w,o=Math.sin(o*T)/w}const _=o*b;if(l=l*m+d*_,c=c*m+h*_,u=u*m+g*_,f=f*m+v*_,m===1-o){const w=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=w,c*=w,u*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,a,s){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=a[s],d=a[s+1],h=a[s+2],g=a[s+3];return t[e]=o*g+u*f+l*h-c*d,t[e+1]=l*g+u*d+c*f-o*h,t[e+2]=c*g+u*h+o*d-l*f,t[e+3]=u*g-o*f-l*d-c*h,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,a=t._z,s=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),f=o(a/2),d=l(n/2),h=l(r/2),g=l(a/2);switch(s){case"XYZ":this._x=d*u*f+c*h*g,this._y=c*h*f-d*u*g,this._z=c*u*g+d*h*f,this._w=c*u*f-d*h*g;break;case"YXZ":this._x=d*u*f+c*h*g,this._y=c*h*f-d*u*g,this._z=c*u*g-d*h*f,this._w=c*u*f+d*h*g;break;case"ZXY":this._x=d*u*f-c*h*g,this._y=c*h*f+d*u*g,this._z=c*u*g+d*h*f,this._w=c*u*f-d*h*g;break;case"ZYX":this._x=d*u*f-c*h*g,this._y=c*h*f+d*u*g,this._z=c*u*g-d*h*f,this._w=c*u*f+d*h*g;break;case"YZX":this._x=d*u*f+c*h*g,this._y=c*h*f+d*u*g,this._z=c*u*g-d*h*f,this._w=c*u*f-d*h*g;break;case"XZY":this._x=d*u*f-c*h*g,this._y=c*h*f-d*u*g,this._z=c*u*g+d*h*f,this._w=c*u*f+d*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],a=e[8],s=e[1],o=e[5],l=e[9],c=e[2],u=e[6],f=e[10],d=n+o+f;if(d>0){const h=.5/Math.sqrt(d+1);this._w=.25/h,this._x=(u-l)*h,this._y=(a-c)*h,this._z=(s-r)*h}else if(n>o&&n>f){const h=2*Math.sqrt(1+n-o-f);this._w=(u-l)/h,this._x=.25*h,this._y=(r+s)/h,this._z=(a+c)/h}else if(o>f){const h=2*Math.sqrt(1+o-n-f);this._w=(a-c)/h,this._x=(r+s)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+f-n-o);this._w=(s-r)/h,this._x=(a+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,a=t._z,s=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+s*o+r*c-a*l,this._y=r*u+s*l+a*o-n*c,this._z=a*u+s*c+n*l-r*o,this._w=s*u-n*o-r*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,a=this._z,s=this._w;let o=s*t._w+n*t._x+r*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=s,this._x=n,this._y=r,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const h=1-e;return this._w=h*s+e*this._w,this._x=h*n+e*this._x,this._y=h*r+e*this._y,this._z=h*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=s*f+this._w*d,this._x=n*f+this._x*d,this._y=r*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(uc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(uc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*r,this.y=a[1]*e+a[4]*n+a[7]*r,this.z=a[2]*e+a[5]*n+a[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,a=t.elements,s=1/(a[3]*e+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*r+a[12])*s,this.y=(a[1]*e+a[5]*n+a[9]*r+a[13])*s,this.z=(a[2]*e+a[6]*n+a[10]*r+a[14])*s,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,a=t.x,s=t.y,o=t.z,l=t.w,c=2*(s*r-o*n),u=2*(o*e-a*r),f=2*(a*n-s*e);return this.x=e+l*c+s*f-o*u,this.y=n+l*u+o*c-a*f,this.z=r+l*f+a*u-s*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r,this.y=a[1]*e+a[5]*n+a[9]*r,this.z=a[2]*e+a[6]*n+a[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,a=t.z,s=e.x,o=e.y,l=e.z;return this.x=r*l-a*o,this.y=a*s-n*l,this.z=n*o-r*s,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return _s.copy(this).projectOnVector(t),this.sub(_s)}reflect(t){return this.sub(_s.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _s=new I,uc=new $r;class Bt{constructor(t,e,n,r,a,s,o,l,c){Bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,a,s,o,l,c)}set(t,e,n,r,a,s,o,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=o,u[3]=e,u[4]=a,u[5]=l,u[6]=n,u[7]=s,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,a=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],d=n[2],h=n[5],g=n[8],v=r[0],m=r[3],p=r[6],b=r[1],E=r[4],_=r[7],w=r[2],T=r[5],A=r[8];return a[0]=s*v+o*b+l*w,a[3]=s*m+o*E+l*T,a[6]=s*p+o*_+l*A,a[1]=c*v+u*b+f*w,a[4]=c*m+u*E+f*T,a[7]=c*p+u*_+f*A,a[2]=d*v+h*b+g*w,a[5]=d*m+h*E+g*T,a[8]=d*p+h*_+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],a=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*s*u-e*o*c-n*a*u+n*o*l+r*a*c-r*s*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],a=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=u*s-o*c,d=o*l-u*a,h=c*a-s*l,g=e*f+n*d+r*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(r*c-u*n)*v,t[2]=(o*n-r*s)*v,t[3]=d*v,t[4]=(u*e-r*l)*v,t[5]=(r*a-o*e)*v,t[6]=h*v,t[7]=(n*l-c*e)*v,t[8]=(s*e-n*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,a,s,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*s+c*o)+s+t,-r*c,r*l,-r*(-c*s+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(xs.makeScale(t,e)),this}rotate(t){return this.premultiply(xs.makeRotation(-t)),this}translate(t,e){return this.premultiply(xs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const xs=new Bt;function df(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function $a(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function rp(){const i=$a("canvas");return i.style.display="block",i}const fc={};function Gr(i){i in fc||(fc[i]=!0,console.warn(i))}function ap(i,t,e){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}const hc=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dc=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sp(){const i={enabled:!0,workingColorSpace:lr,spaces:{},convert:function(r,a,s){return this.enabled===!1||a===s||!a||!s||(this.spaces[a].transfer===ae&&(r.r=kn(r.r),r.g=kn(r.g),r.b=kn(r.b)),this.spaces[a].primaries!==this.spaces[s].primaries&&(r.applyMatrix3(this.spaces[a].toXYZ),r.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===ae&&(r.r=er(r.r),r.g=er(r.g),r.b=er(r.b))),r},workingToColorSpace:function(r,a){return this.convert(r,this.workingColorSpace,a)},colorSpaceToWorking:function(r,a){return this.convert(r,a,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Jn?Xa:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,a=this.workingColorSpace){return r.fromArray(this.spaces[a].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,a,s){return r.copy(this.spaces[a].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,a){return Gr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,a)},toWorkingColorSpace:function(r,a){return Gr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,a)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[lr]:{primaries:t,whitePoint:n,transfer:Xa,toXYZ:hc,fromXYZ:dc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:t,whitePoint:n,transfer:ae,toXYZ:hc,fromXYZ:dc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),i}const te=sp();function kn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function er(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ni;class op{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ni===void 0&&(Ni=$a("canvas")),Ni.width=t.width,Ni.height=t.height;const r=Ni.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),n=Ni}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=$a("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=kn(a[s]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(kn(e[n]/255)*255):e[n]=kn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let lp=0;class yl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=pr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(ys(r[s].image)):a.push(ys(r[s]))}else a=ys(r);n.url=a}return e||(t.images[this.uuid]=n),n}}function ys(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?op.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let cp=0;const Ms=new I;class Be extends dr{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,n=Mi,r=Mi,a=ln,s=Qn,o=Qe,l=Rn,c=Be.DEFAULT_ANISOTROPY,u=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=pr(),this.name="",this.source=new yl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ms).x}get height(){return this.source.getSize(Ms).y}get depth(){return this.source.getSize(Ms).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Wa:t.x=t.x-Math.floor(t.x);break;case Mi:t.x=t.x<0?0:1;break;case mo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Wa:t.y=t.y-Math.floor(t.y);break;case Mi:t.y=t.y<0?0:1;break;case mo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=rf;Be.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,r=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,a=this.w,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r+s[12]*a,this.y=s[1]*e+s[5]*n+s[9]*r+s[13]*a,this.z=s[2]*e+s[6]*n+s[10]*r+s[14]*a,this.w=s[3]*e+s[7]*n+s[11]*r+s[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,a;const l=t.elements,c=l[0],u=l[4],f=l[8],d=l[1],h=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+h+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,_=(h+1)/2,w=(p+1)/2,T=(u+d)/4,A=(f+v)/4,C=(g+m)/4;return E>_&&E>w?E<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(E),r=T/n,a=A/n):_>w?_<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(_),n=T/r,a=C/r):w<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(w),n=A/a,r=C/a),this.set(n,r,a,e),this}let b=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(f-v)/b,this.z=(d-u)/b,this.w=Math.acos((c+h+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class up extends dr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const r={width:t,height:e,depth:n.depth},a=new Be(r);this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ln,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new yl(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wi extends up{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class pf extends Be{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=Mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class fp extends Be{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=Mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pi{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)t.isMesh===!0?t.getVertexPosition(s,un):un.fromBufferAttribute(a,s),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ea.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ea.copy(n.boundingBox)),ea.applyMatrix4(t.matrixWorld),this.union(ea)}const r=t.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xr),na.subVectors(this.max,xr),Fi.subVectors(t.a,xr),Oi.subVectors(t.b,xr),zi.subVectors(t.c,xr),Wn.subVectors(Oi,Fi),Xn.subVectors(zi,Oi),ui.subVectors(Fi,zi);let e=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-ui.z,ui.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,ui.z,0,-ui.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-ui.y,ui.x,0];return!bs(e,Fi,Oi,zi,na)||(e=[1,0,0,0,1,0,0,0,1],!bs(e,Fi,Oi,zi,na))?!1:(ia.crossVectors(Wn,Xn),e=[ia.x,ia.y,ia.z],bs(e,Fi,Oi,zi,na))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Pn=[new I,new I,new I,new I,new I,new I,new I,new I],un=new I,ea=new Pi,Fi=new I,Oi=new I,zi=new I,Wn=new I,Xn=new I,ui=new I,xr=new I,na=new I,ia=new I,fi=new I;function bs(i,t,e,n,r){for(let a=0,s=i.length-3;a<=s;a+=3){fi.fromArray(i,a);const o=r.x*Math.abs(fi.x)+r.y*Math.abs(fi.y)+r.z*Math.abs(fi.z),l=t.dot(fi),c=e.dot(fi),u=n.dot(fi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const hp=new Pi,yr=new I,Ss=new I;class mr{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):hp.setFromPoints(t).getCenter(n);let r=0;for(let a=0,s=t.length;a<s;a++)r=Math.max(r,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;yr.subVectors(t,this.center);const e=yr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(yr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ss.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(yr.copy(t.center).add(Ss)),this.expandByPoint(yr.copy(t.center).sub(Ss))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ln=new I,Es=new I,ra=new I,Yn=new I,ws=new I,aa=new I,Ts=new I;class Ml{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Es.copy(t).add(e).multiplyScalar(.5),ra.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(Es);const a=t.distanceTo(e)*.5,s=-this.direction.dot(ra),o=Yn.dot(this.direction),l=-Yn.dot(ra),c=Yn.lengthSq(),u=Math.abs(1-s*s);let f,d,h,g;if(u>0)if(f=s*l-o,d=s*o-l,g=a*u,f>=0)if(d>=-g)if(d<=g){const v=1/u;f*=v,d*=v,h=f*(f+s*d+2*o)+d*(s*f+d+2*l)+c}else d=a,f=Math.max(0,-(s*d+o)),h=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(s*d+o)),h=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-s*a+o)),d=f>0?-a:Math.min(Math.max(-a,-l),a),h=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-a,-l),a),h=d*(d+2*l)+c):(f=Math.max(0,-(s*a+o)),d=f>0?a:Math.min(Math.max(-a,-l),a),h=-f*f+d*(d+2*l)+c);else d=s>0?-a:a,f=Math.max(0,-(s*d+o)),h=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Es).addScaledVector(ra,d),h}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);const n=Ln.dot(this.direction),r=Ln.dot(Ln)-n*n,a=t.radius*t.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,a,s,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,r=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,r=(t.min.x-d.x)*c),u>=0?(a=(t.min.y-d.y)*u,s=(t.max.y-d.y)*u):(a=(t.max.y-d.y)*u,s=(t.min.y-d.y)*u),n>s||a>r||((a>n||isNaN(n))&&(n=a),(s<r||isNaN(r))&&(r=s),f>=0?(o=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(o=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,n,r,a){ws.subVectors(e,t),aa.subVectors(n,t),Ts.crossVectors(ws,aa);let s=this.direction.dot(Ts),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;Yn.subVectors(this.origin,t);const l=o*this.direction.dot(aa.crossVectors(Yn,aa));if(l<0)return null;const c=o*this.direction.dot(ws.cross(Yn));if(c<0||l+c>s)return null;const u=-o*Yn.dot(Ts);return u<0?null:this.at(u/s,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,r,a,s,o,l,c,u,f,d,h,g,v,m){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,a,s,o,l,c,u,f,d,h,g,v,m)}set(t,e,n,r,a,s,o,l,c,u,f,d,h,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=a,p[5]=s,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=d,p[3]=h,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/ki.setFromMatrixColumn(t,0).length(),a=1/ki.setFromMatrixColumn(t,1).length(),s=1/ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*s,e[9]=n[9]*s,e[10]=n[10]*s,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,a=t.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=s*u,h=s*f,g=o*u,v=o*f;e[0]=l*u,e[4]=-l*f,e[8]=c,e[1]=h+g*c,e[5]=d-v*c,e[9]=-o*l,e[2]=v-d*c,e[6]=g+h*c,e[10]=s*l}else if(t.order==="YXZ"){const d=l*u,h=l*f,g=c*u,v=c*f;e[0]=d+v*o,e[4]=g*o-h,e[8]=s*c,e[1]=s*f,e[5]=s*u,e[9]=-o,e[2]=h*o-g,e[6]=v+d*o,e[10]=s*l}else if(t.order==="ZXY"){const d=l*u,h=l*f,g=c*u,v=c*f;e[0]=d-v*o,e[4]=-s*f,e[8]=g+h*o,e[1]=h+g*o,e[5]=s*u,e[9]=v-d*o,e[2]=-s*c,e[6]=o,e[10]=s*l}else if(t.order==="ZYX"){const d=s*u,h=s*f,g=o*u,v=o*f;e[0]=l*u,e[4]=g*c-h,e[8]=d*c+v,e[1]=l*f,e[5]=v*c+d,e[9]=h*c-g,e[2]=-c,e[6]=o*l,e[10]=s*l}else if(t.order==="YZX"){const d=s*l,h=s*c,g=o*l,v=o*c;e[0]=l*u,e[4]=v-d*f,e[8]=g*f+h,e[1]=f,e[5]=s*u,e[9]=-o*u,e[2]=-c*u,e[6]=h*f+g,e[10]=d-v*f}else if(t.order==="XZY"){const d=s*l,h=s*c,g=o*l,v=o*c;e[0]=l*u,e[4]=-f,e[8]=c*u,e[1]=d*f+v,e[5]=s*u,e[9]=h*f-g,e[2]=g*f-h,e[6]=o*u,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(dp,t,pp)}lookAt(t,e,n){const r=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),$n.crossVectors(n,Ke),$n.lengthSq()===0&&(Math.abs(n.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),$n.crossVectors(n,Ke)),$n.normalize(),sa.crossVectors(Ke,$n),r[0]=$n.x,r[4]=sa.x,r[8]=Ke.x,r[1]=$n.y,r[5]=sa.y,r[9]=Ke.y,r[2]=$n.z,r[6]=sa.z,r[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,a=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],d=n[9],h=n[13],g=n[2],v=n[6],m=n[10],p=n[14],b=n[3],E=n[7],_=n[11],w=n[15],T=r[0],A=r[4],C=r[8],x=r[12],M=r[1],L=r[5],F=r[9],z=r[13],W=r[2],V=r[6],Y=r[10],K=r[14],H=r[3],st=r[7],ut=r[11],wt=r[15];return a[0]=s*T+o*M+l*W+c*H,a[4]=s*A+o*L+l*V+c*st,a[8]=s*C+o*F+l*Y+c*ut,a[12]=s*x+o*z+l*K+c*wt,a[1]=u*T+f*M+d*W+h*H,a[5]=u*A+f*L+d*V+h*st,a[9]=u*C+f*F+d*Y+h*ut,a[13]=u*x+f*z+d*K+h*wt,a[2]=g*T+v*M+m*W+p*H,a[6]=g*A+v*L+m*V+p*st,a[10]=g*C+v*F+m*Y+p*ut,a[14]=g*x+v*z+m*K+p*wt,a[3]=b*T+E*M+_*W+w*H,a[7]=b*A+E*L+_*V+w*st,a[11]=b*C+E*F+_*Y+w*ut,a[15]=b*x+E*z+_*K+w*wt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],a=t[12],s=t[1],o=t[5],l=t[9],c=t[13],u=t[2],f=t[6],d=t[10],h=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+a*l*f-r*c*f-a*o*d+n*c*d+r*o*h-n*l*h)+v*(+e*l*h-e*c*d+a*s*d-r*s*h+r*c*u-a*l*u)+m*(+e*c*f-e*o*h-a*s*f+n*s*h+a*o*u-n*c*u)+p*(-r*o*u-e*l*f+e*o*d+r*s*f-n*s*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],a=t[3],s=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=t[9],d=t[10],h=t[11],g=t[12],v=t[13],m=t[14],p=t[15],b=f*m*c-v*d*c+v*l*h-o*m*h-f*l*p+o*d*p,E=g*d*c-u*m*c-g*l*h+s*m*h+u*l*p-s*d*p,_=u*v*c-g*f*c+g*o*h-s*v*h-u*o*p+s*f*p,w=g*f*l-u*v*l-g*o*d+s*v*d+u*o*m-s*f*m,T=e*b+n*E+r*_+a*w;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=b*A,t[1]=(v*d*a-f*m*a-v*r*h+n*m*h+f*r*p-n*d*p)*A,t[2]=(o*m*a-v*l*a+v*r*c-n*m*c-o*r*p+n*l*p)*A,t[3]=(f*l*a-o*d*a-f*r*c+n*d*c+o*r*h-n*l*h)*A,t[4]=E*A,t[5]=(u*m*a-g*d*a+g*r*h-e*m*h-u*r*p+e*d*p)*A,t[6]=(g*l*a-s*m*a-g*r*c+e*m*c+s*r*p-e*l*p)*A,t[7]=(s*d*a-u*l*a+u*r*c-e*d*c-s*r*h+e*l*h)*A,t[8]=_*A,t[9]=(g*f*a-u*v*a-g*n*h+e*v*h+u*n*p-e*f*p)*A,t[10]=(s*v*a-g*o*a+g*n*c-e*v*c-s*n*p+e*o*p)*A,t[11]=(u*o*a-s*f*a-u*n*c+e*f*c+s*n*h-e*o*h)*A,t[12]=w*A,t[13]=(u*v*r-g*f*r+g*n*d-e*v*d-u*n*m+e*f*m)*A,t[14]=(g*o*r-s*v*r-g*n*l+e*v*l+s*n*m-e*o*m)*A,t[15]=(s*f*r-u*o*r+u*n*l-e*f*l-s*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,a=t.z;return e[0]*=n,e[4]*=r,e[8]*=a,e[1]*=n,e[5]*=r,e[9]*=a,e[2]*=n,e[6]*=r,e[10]*=a,e[3]*=n,e[7]*=r,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),a=1-n,s=t.x,o=t.y,l=t.z,c=a*s,u=a*o;return this.set(c*s+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*s,0,c*l-r*o,u*l+r*s,a*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,a,s){return this.set(1,n,a,0,t,1,s,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,a=e._x,s=e._y,o=e._z,l=e._w,c=a+a,u=s+s,f=o+o,d=a*c,h=a*u,g=a*f,v=s*u,m=s*f,p=o*f,b=l*c,E=l*u,_=l*f,w=n.x,T=n.y,A=n.z;return r[0]=(1-(v+p))*w,r[1]=(h+_)*w,r[2]=(g-E)*w,r[3]=0,r[4]=(h-_)*T,r[5]=(1-(d+p))*T,r[6]=(m+b)*T,r[7]=0,r[8]=(g+E)*A,r[9]=(m-b)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let a=ki.set(r[0],r[1],r[2]).length();const s=ki.set(r[4],r[5],r[6]).length(),o=ki.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),t.x=r[12],t.y=r[13],t.z=r[14],fn.copy(this);const c=1/a,u=1/s,f=1/o;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=u,fn.elements[5]*=u,fn.elements[6]*=u,fn.elements[8]*=f,fn.elements[9]*=f,fn.elements[10]*=f,e.setFromRotationMatrix(fn),n.x=a,n.y=s,n.z=o,this}makePerspective(t,e,n,r,a,s,o=Tn,l=!1){const c=this.elements,u=2*a/(e-t),f=2*a/(n-r),d=(e+t)/(e-t),h=(n+r)/(n-r);let g,v;if(l)g=a/(s-a),v=s*a/(s-a);else if(o===Tn)g=-(s+a)/(s-a),v=-2*s*a/(s-a);else if(o===Ya)g=-s/(s-a),v=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,a,s,o=Tn,l=!1){const c=this.elements,u=2/(e-t),f=2/(n-r),d=-(e+t)/(e-t),h=-(n+r)/(n-r);let g,v;if(l)g=1/(s-a),v=s/(s-a);else if(o===Tn)g=-2/(s-a),v=-(s+a)/(s-a);else if(o===Ya)g=-1/(s-a),v=-a/(s-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ki=new I,fn=new ue,dp=new I(0,0,0),pp=new I(1,1,1),$n=new I,sa=new I,Ke=new I,pc=new ue,mc=new $r;class xn{constructor(t=0,e=0,n=0,r=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,a=r[0],s=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],d=r[6],h=r[10];switch(e){case"XYZ":this._y=Math.asin(Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,h),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Xt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,h),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-Xt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return pc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return mc.setFromEuler(this),this.setFromQuaternion(mc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";let bl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},mp=0;const gc=new I,Bi=new $r,In=new ue,oa=new I,Mr=new I,gp=new I,vp=new $r,vc=new I(1,0,0),_c=new I(0,1,0),xc=new I(0,0,1),yc={type:"added"},_p={type:"removed"},Hi={type:"childadded",child:null},As={type:"childremoved",child:null};class Te extends dr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mp++}),this.uuid=pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new I,e=new xn,n=new $r,r=new I(1,1,1);function a(){n.setFromEuler(e,!1)}function s(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ue},normalMatrix:{value:new Bt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.premultiply(Bi),this}rotateX(t){return this.rotateOnAxis(vc,t)}rotateY(t){return this.rotateOnAxis(_c,t)}rotateZ(t){return this.rotateOnAxis(xc,t)}translateOnAxis(t,e){return gc.copy(t).applyQuaternion(this.quaternion),this.position.add(gc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(vc,t)}translateY(t){return this.translateOnAxis(_c,t)}translateZ(t){return this.translateOnAxis(xc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oa.copy(t):oa.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Mr,oa,this.up):In.lookAt(oa,Mr,this.up),this.quaternion.setFromRotationMatrix(In),r&&(In.extractRotation(r.matrixWorld),Bi.setFromRotationMatrix(In),this.quaternion.premultiply(Bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yc),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_p),As.child=t,this.dispatchEvent(As),As.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yc),Hi.child=t,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const s=this.children[n].getObjectByProperty(t,e);if(s!==void 0)return s}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,t,gp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mr,vp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));r.material=o}else r.material=a(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(a(t.animations,l))}}if(e){const o=s(t.geometries),l=s(t.materials),c=s(t.textures),u=s(t.images),f=s(t.shapes),d=s(t.skeletons),h=s(t.animations),g=s(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=r,n;function s(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Te.DEFAULT_UP=new I(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new I,Dn=new I,Rs=new I,Un=new I,Gi=new I,Vi=new I,Mc=new I,Cs=new I,Ps=new I,Ls=new I,Is=new de,Ds=new de,Us=new de;class mn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),hn.subVectors(t,e),r.cross(hn);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(t,e,n,r,a){hn.subVectors(r,e),Dn.subVectors(n,e),Rs.subVectors(t,e);const s=hn.dot(hn),o=hn.dot(Dn),l=hn.dot(Rs),c=Dn.dot(Dn),u=Dn.dot(Rs),f=s*c-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,h=(c*l-o*u)*d,g=(s*u-o*l)*d;return a.set(1-h-g,g,h)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(t,e,n,r,a,s,o,l){return this.getBarycoord(t,e,n,r,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Un.x),l.addScaledVector(s,Un.y),l.addScaledVector(o,Un.z),l)}static getInterpolatedAttribute(t,e,n,r,a,s){return Is.setScalar(0),Ds.setScalar(0),Us.setScalar(0),Is.fromBufferAttribute(t,e),Ds.fromBufferAttribute(t,n),Us.fromBufferAttribute(t,r),s.setScalar(0),s.addScaledVector(Is,a.x),s.addScaledVector(Ds,a.y),s.addScaledVector(Us,a.z),s}static isFrontFacing(t,e,n,r){return hn.subVectors(n,e),Dn.subVectors(t,e),hn.cross(Dn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),hn.cross(Dn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,a){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,r,a)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,a=this.c;let s,o;Gi.subVectors(r,n),Vi.subVectors(a,n),Cs.subVectors(t,n);const l=Gi.dot(Cs),c=Vi.dot(Cs);if(l<=0&&c<=0)return e.copy(n);Ps.subVectors(t,r);const u=Gi.dot(Ps),f=Vi.dot(Ps);if(u>=0&&f<=u)return e.copy(r);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return s=l/(l-u),e.copy(n).addScaledVector(Gi,s);Ls.subVectors(t,a);const h=Gi.dot(Ls),g=Vi.dot(Ls);if(g>=0&&h<=g)return e.copy(a);const v=h*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Vi,o);const m=u*g-h*f;if(m<=0&&f-u>=0&&h-g>=0)return Mc.subVectors(a,r),o=(f-u)/(f-u+(h-g)),e.copy(r).addScaledVector(Mc,o);const p=1/(m+v+d);return s=v*p,o=d*p,e.copy(n).addScaledVector(Gi,s).addScaledVector(Vi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const mf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},la={h:0,s:0,l:0};function Ns(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Rt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,r=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,r),this}setHSL(t,e,n,r=te.workingColorSpace){if(t=xl(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,s=2*n-a;this.r=Ns(s,a,t+1/3),this.g=Ns(s,a,t),this.b=Ns(s,a,t-1/3)}return te.colorSpaceToWorking(this,r),this}setStyle(t,e=Je){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(s===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Je){const n=mf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=kn(t.r),this.g=kn(t.g),this.b=kn(t.b),this}copyLinearToSRGB(t){return this.r=er(t.r),this.g=er(t.g),this.b=er(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Je){return te.workingToColorSpace(Ne.copy(this),t),Math.round(Xt(Ne.r*255,0,255))*65536+Math.round(Xt(Ne.g*255,0,255))*256+Math.round(Xt(Ne.b*255,0,255))}getHexString(t=Je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(Ne.copy(this),e);const n=Ne.r,r=Ne.g,a=Ne.b,s=Math.max(n,r,a),o=Math.min(n,r,a);let l,c;const u=(o+s)/2;if(o===s)l=0,c=0;else{const f=s-o;switch(c=u<=.5?f/(s+o):f/(2-s-o),s){case n:l=(r-a)/f+(r<a?6:0);break;case r:l=(a-n)/f+2;break;case a:l=(n-r)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(Ne.copy(this),e),t.r=Ne.r,t.g=Ne.g,t.b=Ne.b,t}getStyle(t=Je){te.workingToColorSpace(Ne.copy(this),t);const e=Ne.r,n=Ne.g,r=Ne.b;return t!==Je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(jn),this.setHSL(jn.h+t,jn.s+e,jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jn),t.getHSL(la);const n=Lr(jn.h,la.h,e),r=Lr(jn.s,la.s,e),a=Lr(jn.l,la.l,e);return this.setHSL(n,r,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*r,this.g=a[1]*e+a[4]*n+a[7]*r,this.b=a[2]*e+a[5]*n+a[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ne=new Rt;Rt.NAMES=mf;let xp=0;class Li extends dr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=pr(),this.name="",this.type="Material",this.blending=tr,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=no,this.blendDst=io,this.blendEquation=vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Rt(0,0,0),this.blendAlpha=0,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ui,this.stencilZFail=Ui,this.stencilZPass=Ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==tr&&(n.blending=this.blending),this.side!==ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==no&&(n.blendSrc=this.blendSrc),this.blendDst!==io&&(n.blendDst=this.blendDst),this.blendEquation!==vi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const s=[];for(const o in a){const l=a[o];delete l.metadata,s.push(l)}return s}if(e){const a=r(t.textures),s=r(t.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class On extends Li{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=ul,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new I,ca=new Wt;let yp=0;class en{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oc,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ca.fromBufferAttribute(this,e),ca.applyMatrix3(t),this.setXY(e,ca.x,ca.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ki(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ki(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ki(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ki(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ki(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,a){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),r=Ve(r,this.array),a=Ve(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oc&&(t.usage=this.usage),t}}class gf extends en{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class vf extends en{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Jt extends en{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Mp=0;const sn=new ue,Fs=new Te,Wi=new I,Ze=new Pi,br=new Pi,Pe=new I;class Ee extends dr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=pr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(df(t)?vf:gf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Bt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Fs.lookAt(t),Fs.updateMatrix(),this.applyMatrix4(Fs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,a=t.length;r<a;r++){const s=t[r];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Jt(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const a=t[r];e.setXYZ(r,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const a=e[n];Ze.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let a=0,s=e.length;a<s;a++){const o=e[a];br.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Ze.min,br.min),Ze.expandByPoint(Pe),Pe.addVectors(Ze.max,br.max),Ze.expandByPoint(Pe)):(Ze.expandByPoint(br.min),Ze.expandByPoint(br.max))}Ze.getCenter(n);let r=0;for(let a=0,s=t.count;a<s;a++)Pe.fromBufferAttribute(t,a),r=Math.max(r,n.distanceToSquared(Pe));if(e)for(let a=0,s=e.length;a<s;a++){const o=e[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Pe.fromBufferAttribute(o,c),l&&(Wi.fromBufferAttribute(t,c),Pe.add(Wi)),r=Math.max(r,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new I,l[C]=new I;const c=new I,u=new I,f=new I,d=new Wt,h=new Wt,g=new Wt,v=new I,m=new I;function p(C,x,M){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,x),f.fromBufferAttribute(n,M),d.fromBufferAttribute(a,C),h.fromBufferAttribute(a,x),g.fromBufferAttribute(a,M),u.sub(c),f.sub(c),h.sub(d),g.sub(d);const L=1/(h.x*g.y-g.x*h.y);isFinite(L)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(f,-h.y).multiplyScalar(L),m.copy(f).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(L),o[C].add(v),o[x].add(v),o[M].add(v),l[C].add(m),l[x].add(m),l[M].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let C=0,x=b.length;C<x;++C){const M=b[C],L=M.start,F=M.count;for(let z=L,W=L+F;z<W;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const E=new I,_=new I,w=new I,T=new I;function A(C){w.fromBufferAttribute(r,C),T.copy(w);const x=o[C];E.copy(x),E.sub(w.multiplyScalar(w.dot(x))).normalize(),_.crossVectors(T,x);const L=_.dot(l[C])<0?-1:1;s.setXYZW(C,E.x,E.y,E.z,L)}for(let C=0,x=b.length;C<x;++C){const M=b[C],L=M.start,F=M.count;for(let z=L,W=L+F;z<W;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new en(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,h=n.count;d<h;d++)n.setXYZ(d,0,0,0);const r=new I,a=new I,s=new I,o=new I,l=new I,c=new I,u=new I,f=new I;if(t)for(let d=0,h=t.count;d<h;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,v),s.fromBufferAttribute(e,m),u.subVectors(s,a),f.subVectors(r,a),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,h=e.count;d<h;d+=3)r.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),s.fromBufferAttribute(e,d+2),u.subVectors(s,a),f.subVectors(r,a),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u);let h=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?h=l[v]*o.data.stride+o.offset:h=l[v]*u;for(let p=0;p<u;p++)d[g++]=c[h++]}return new en(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=t(l,n);e.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let u=0,f=c.length;u<f;u++){const d=c[u],h=t(d,n);l.push(h)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const h=c[f];u.push(h.toJSON(t.data))}u.length>0&&(r[l]=u,a=!0)}a&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const a=t.morphAttributes;for(const c in a){const u=[],f=a[c];for(let d=0,h=f.length;d<h;d++)u.push(f[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const s=t.groups;for(let c=0,u=s.length;c<u;c++){const f=s[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bc=new ue,hi=new Ml,ua=new mr,Sc=new I,fa=new I,ha=new I,da=new I,Os=new I,pa=new I,Ec=new I,ma=new I;class Yt extends Te{constructor(t=new Ee,e=new On){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(a&&o){pa.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const u=o[l],f=a[l];u!==0&&(Os.fromBufferAttribute(f,t),s?pa.addScaledVector(Os,u):pa.addScaledVector(Os.sub(e),u))}e.add(pa)}return e}raycast(t,e){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(a),hi.copy(t.ray).recast(t.near),!(ua.containsPoint(hi.origin)===!1&&(hi.intersectSphere(ua,Sc)===null||hi.origin.distanceToSquared(Sc)>(t.far-t.near)**2))&&(bc.copy(a).invert(),hi.copy(t.ray).applyMatrix4(bc),!(n.boundingBox!==null&&hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,hi)))}_computeIntersections(t,e,n){let r;const a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,f=a.attributes.normal,d=a.groups,h=a.drawRange;if(o!==null)if(Array.isArray(s))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=s[m.materialIndex],b=Math.max(m.start,h.start),E=Math.min(o.count,Math.min(m.start+m.count,h.start+h.count));for(let _=b,w=E;_<w;_+=3){const T=o.getX(_),A=o.getX(_+1),C=o.getX(_+2);r=ga(this,p,t,n,c,u,f,T,A,C),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,h.start),v=Math.min(o.count,h.start+h.count);for(let m=g,p=v;m<p;m+=3){const b=o.getX(m),E=o.getX(m+1),_=o.getX(m+2);r=ga(this,s,t,n,c,u,f,b,E,_),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=s[m.materialIndex],b=Math.max(m.start,h.start),E=Math.min(l.count,Math.min(m.start+m.count,h.start+h.count));for(let _=b,w=E;_<w;_+=3){const T=_,A=_+1,C=_+2;r=ga(this,p,t,n,c,u,f,T,A,C),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,h.start),v=Math.min(l.count,h.start+h.count);for(let m=g,p=v;m<p;m+=3){const b=m,E=m+1,_=m+2;r=ga(this,s,t,n,c,u,f,b,E,_),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function bp(i,t,e,n,r,a,s,o){let l;if(t.side===$e?l=n.intersectTriangle(s,a,r,!0,o):l=n.intersectTriangle(r,a,s,t.side===ri,o),l===null)return null;ma.copy(o),ma.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ma);return c<e.near||c>e.far?null:{distance:c,point:ma.clone(),object:i}}function ga(i,t,e,n,r,a,s,o,l,c){i.getVertexPosition(o,fa),i.getVertexPosition(l,ha),i.getVertexPosition(c,da);const u=bp(i,t,e,n,fa,ha,da,Ec);if(u){const f=new I;mn.getBarycoord(Ec,fa,ha,da,f),r&&(u.uv=mn.getInterpolatedAttribute(r,o,l,c,f,new Wt)),a&&(u.uv1=mn.getInterpolatedAttribute(a,o,l,c,f,new Wt)),s&&(u.normal=mn.getInterpolatedAttribute(s,o,l,c,f,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new I,materialIndex:0};mn.getNormal(fa,ha,da,d.normal),u.face=d,u.barycoord=f}return u}class Ii extends Ee{constructor(t=1,e=1,n=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const l=[],c=[],u=[],f=[];let d=0,h=0;g("z","y","x",-1,-1,n,e,t,s,a,0),g("z","y","x",1,-1,n,e,-t,s,a,1),g("x","z","y",1,1,t,n,e,r,s,2),g("x","z","y",1,-1,t,n,-e,r,s,3),g("x","y","z",1,-1,t,e,n,r,a,4),g("x","y","z",-1,-1,t,e,-n,r,a,5),this.setIndex(l),this.setAttribute("position",new Jt(c,3)),this.setAttribute("normal",new Jt(u,3)),this.setAttribute("uv",new Jt(f,2));function g(v,m,p,b,E,_,w,T,A,C,x){const M=_/A,L=w/C,F=_/2,z=w/2,W=T/2,V=A+1,Y=C+1;let K=0,H=0;const st=new I;for(let ut=0;ut<Y;ut++){const wt=ut*L-z;for(let $t=0;$t<V;$t++){const le=$t*M-F;st[v]=le*b,st[m]=wt*E,st[p]=W,c.push(st.x,st.y,st.z),st[v]=0,st[m]=0,st[p]=T>0?1:-1,u.push(st.x,st.y,st.z),f.push($t/A),f.push(1-ut/C),K+=1}}for(let ut=0;ut<C;ut++)for(let wt=0;wt<A;wt++){const $t=d+wt+V*ut,le=d+wt+V*(ut+1),me=d+(wt+1)+V*(ut+1),ee=d+(wt+1)+V*ut;l.push($t,le,ee),l.push(le,me,ee),H+=6}o.addGroup(h,H,x),h+=H,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function cr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function We(i){const t={};for(let e=0;e<i.length;e++){const n=cr(i[e]);for(const r in n)t[r]=n[r]}return t}function Sp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function _f(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}const Ep={clone:cr,merge:We};var wp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bn extends Li{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wp,this.fragmentShader=Tp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=cr(t.uniforms),this.uniformsGroups=Sp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?e.uniforms[r]={type:"t",value:s.toJSON(t).uuid}:s&&s.isColor?e.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?e.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?e.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?e.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?e.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?e.uniforms[r]={type:"m4",value:s.toArray()}:e.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class xf extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=Tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new I,wc=new Wt,Tc=new Wt;class pn extends xf{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Hr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hr*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,wc,Tc),e.subVectors(Tc,wc)}setViewOffset(t,e,n,r,a,s){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Pr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;a+=s.offsetX*r/l,e-=s.offsetY*n/c,r*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xi=-90,Yi=1;class Ap extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new pn(Xi,Yi,t,e);r.layers=this.layers,this.add(r);const a=new pn(Xi,Yi,t,e);a.layers=this.layers,this.add(a);const s=new pn(Xi,Yi,t,e);s.layers=this.layers,this.add(s);const o=new pn(Xi,Yi,t,e);o.layers=this.layers,this.add(o);const l=new pn(Xi,Yi,t,e);l.layers=this.layers,this.add(l);const c=new pn(Xi,Yi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,a,s,o,l]=e;for(const c of e)this.remove(c);if(t===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ya)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,l,c,u]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),h=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,a),t.setRenderTarget(n,1,r),t.render(e,s),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,d,h),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yf extends Be{constructor(t=[],e=sr,n,r,a,s,o,l,c,u){super(t,e,n,r,a,s,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Rp extends wi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new yf(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ii(5,5,5),a=new Bn({name:"CubemapFromEquirect",uniforms:cr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:ti});a.uniforms.tEquirect.value=e;const s=new Yt(r,a),o=e.minFilter;return e.minFilter===Qn&&(e.minFilter=ln),new Ap(1,10,this).update(t,s),e.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(t,e=!0,n=!0,r=!0){const a=t.getRenderTarget();for(let s=0;s<6;s++)t.setRenderTarget(this,s),t.clear(e,n,r);t.setRenderTarget(a)}}class Ht extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cp={type:"move"};class zs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,a=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){s=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),h=.02,g=.005;c.inputState.pinching&&d>h+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=h-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cp)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ht;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Ac extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Sl extends Be{constructor(t=null,e=1,n=1,r,a,s,o,l,c=tn,u=tn,f,d){super(null,s,o,l,c,u,r,a,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rc extends en{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const $i=new ue,Cc=new ue,va=[],Pc=new Pi,Pp=new ue,Sr=new Yt,Er=new mr;class Mf extends Yt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Rc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Pp)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Pi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),Pc.copy(t.boundingBox).applyMatrix4($i),this.boundingBox.union(Pc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new mr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),Er.copy(t.boundingSphere).applyMatrix4($i),this.boundingSphere.union(Er)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,r=this.morphTexture.source.data.data,a=n.length+1,s=t*a+1;for(let o=0;o<n.length;o++)n[o]=r[s+o]}raycast(t,e){const n=this.matrixWorld,r=this.count;if(Sr.geometry=this.geometry,Sr.material=this.material,Sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Er.copy(this.boundingSphere),Er.applyMatrix4(n),t.ray.intersectsSphere(Er)!==!1))for(let a=0;a<r;a++){this.getMatrixAt(a,$i),Cc.multiplyMatrices(n,$i),Sr.matrixWorld=Cc,Sr.raycast(t,va);for(let s=0,o=va.length;s<o;s++){const l=va[s];l.instanceId=a,l.object=this,e.push(l)}va.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Rc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Sl(new Float32Array(r*this.count),r,this.count,pl,wn));const a=this.morphTexture.source.data.data;let s=0;for(let c=0;c<n.length;c++)s+=n[c];const o=this.geometry.morphTargetsRelative?1:1-s,l=r*t;a[l]=o,a.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ks=new I,Lp=new I,Ip=new Bt;class Fn{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=ks.subVectors(n,e).cross(Lp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ks),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ip.getNormalMatrix(t),r=this.coplanarPoint(ks).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const di=new mr,Dp=new Wt(.5,.5),_a=new I;class El{constructor(t=new Fn,e=new Fn,n=new Fn,r=new Fn,a=new Fn,s=new Fn){this.planes=[t,e,n,r,a,s]}set(t,e,n,r,a,s){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Tn,n=!1){const r=this.planes,a=t.elements,s=a[0],o=a[1],l=a[2],c=a[3],u=a[4],f=a[5],d=a[6],h=a[7],g=a[8],v=a[9],m=a[10],p=a[11],b=a[12],E=a[13],_=a[14],w=a[15];if(r[0].setComponents(c-s,h-u,p-g,w-b).normalize(),r[1].setComponents(c+s,h+u,p+g,w+b).normalize(),r[2].setComponents(c+o,h+f,p+v,w+E).normalize(),r[3].setComponents(c-o,h-f,p-v,w-E).normalize(),n)r[4].setComponents(l,d,m,_).normalize(),r[5].setComponents(c-l,h-d,p-m,w-_).normalize();else if(r[4].setComponents(c-l,h-d,p-m,w-_).normalize(),e===Tn)r[5].setComponents(c+l,h+d,p+m,w+_).normalize();else if(e===Ya)r[5].setComponents(l,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(t){di.center.set(0,0,0);const e=Dp.distanceTo(t.center);return di.radius=.7071067811865476+e,di.applyMatrix4(t.matrixWorld),this.intersectsSphere(di)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(_a.x=r.normal.x>0?t.max.x:t.min.x,_a.y=r.normal.y>0?t.max.y:t.min.y,_a.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(_a)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wl extends Li{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ja=new I,qa=new I,Lc=new ue,wr=new Ml,xa=new mr,Bs=new I,Ic=new I;class bf extends Te{constructor(t=new Ee,e=new wl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let r=1,a=e.count;r<a;r++)ja.fromBufferAttribute(e,r-1),qa.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=ja.distanceTo(qa);t.setAttribute("lineDistance",new Jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,a=t.params.Line.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xa.copy(n.boundingSphere),xa.applyMatrix4(r),xa.radius+=a,t.ray.intersectsSphere(xa)===!1)return;Lc.copy(r).invert(),wr.copy(t.ray).applyMatrix4(Lc);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const h=Math.max(0,s.start),g=Math.min(u.count,s.start+s.count);for(let v=h,m=g-1;v<m;v+=c){const p=u.getX(v),b=u.getX(v+1),E=ya(this,t,wr,l,p,b,v);E&&e.push(E)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(h),p=ya(this,t,wr,l,v,m,g-1);p&&e.push(p)}}else{const h=Math.max(0,s.start),g=Math.min(d.count,s.start+s.count);for(let v=h,m=g-1;v<m;v+=c){const p=ya(this,t,wr,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=ya(this,t,wr,l,g-1,h,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ya(i,t,e,n,r,a,s){const o=i.geometry.attributes.position;if(ja.fromBufferAttribute(o,r),qa.fromBufferAttribute(o,a),e.distanceSqToSegment(ja,qa,Bs,Ic)>n)return;Bs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Bs);if(!(c<t.near||c>t.far))return{distance:c,point:Ic.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class Up extends bf{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Np extends Be{constructor(t,e,n,r,a,s,o,l,c){super(t,e,n,r,a,s,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Sf extends Be{constructor(t,e,n=Ei,r,a,s,o=tn,l=tn,c,u=kr,f=1){if(u!==kr&&u!==Br)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:f};super(d,r,a,s,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new yl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ef extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class is extends Ee{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const a=[],s=[],o=[],l=[],c=new I,u=new Wt;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const h=n+f/e*r;c.x=t*Math.cos(h),c.y=t*Math.sin(h),s.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(s[d]/t+1)/2,u.y=(s[d+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new Jt(s,3)),this.setAttribute("normal",new Jt(o,3)),this.setAttribute("uv",new Jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new is(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class He extends Ee{constructor(t=1,e=1,n=1,r=32,a=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),a=Math.floor(a);const u=[],f=[],d=[],h=[];let g=0;const v=[],m=n/2;let p=0;b(),s===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new Jt(f,3)),this.setAttribute("normal",new Jt(d,3)),this.setAttribute("uv",new Jt(h,2));function b(){const _=new I,w=new I;let T=0;const A=(e-t)/n;for(let C=0;C<=a;C++){const x=[],M=C/a,L=M*(e-t)+t;for(let F=0;F<=r;F++){const z=F/r,W=z*l+o,V=Math.sin(W),Y=Math.cos(W);w.x=L*V,w.y=-M*n+m,w.z=L*Y,f.push(w.x,w.y,w.z),_.set(V,A,Y).normalize(),d.push(_.x,_.y,_.z),h.push(z,1-M),x.push(g++)}v.push(x)}for(let C=0;C<r;C++)for(let x=0;x<a;x++){const M=v[x][C],L=v[x+1][C],F=v[x+1][C+1],z=v[x][C+1];(t>0||x!==0)&&(u.push(M,L,z),T+=3),(e>0||x!==a-1)&&(u.push(L,F,z),T+=3)}c.addGroup(p,T,0),p+=T}function E(_){const w=g,T=new Wt,A=new I;let C=0;const x=_===!0?t:e,M=_===!0?1:-1;for(let F=1;F<=r;F++)f.push(0,m*M,0),d.push(0,M,0),h.push(.5,.5),g++;const L=g;for(let F=0;F<=r;F++){const W=F/r*l+o,V=Math.cos(W),Y=Math.sin(W);A.x=x*Y,A.y=m*M,A.z=x*V,f.push(A.x,A.y,A.z),d.push(0,M,0),T.x=V*.5+.5,T.y=Y*.5*M+.5,h.push(T.x,T.y),g++}for(let F=0;F<r;F++){const z=w+F,W=L+F;_===!0?u.push(W,W+1,z):u.push(W+1,W,z),C+=3}c.addGroup(p,C,_===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new He(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yn extends He{constructor(t=1,e=1,n=32,r=1,a=!1,s=0,o=Math.PI*2){super(0,t,e,n,r,a,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:s,thetaLength:o}}static fromJSON(t){return new yn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Tl extends Ee{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const a=[],s=[];o(r),c(n),u(),this.setAttribute("position",new Jt(a,3)),this.setAttribute("normal",new Jt(a.slice(),3)),this.setAttribute("uv",new Jt(s,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const E=new I,_=new I,w=new I;for(let T=0;T<e.length;T+=3)h(e[T+0],E),h(e[T+1],_),h(e[T+2],w),l(E,_,w,b)}function l(b,E,_,w){const T=w+1,A=[];for(let C=0;C<=T;C++){A[C]=[];const x=b.clone().lerp(_,C/T),M=E.clone().lerp(_,C/T),L=T-C;for(let F=0;F<=L;F++)F===0&&C===T?A[C][F]=x:A[C][F]=x.clone().lerp(M,F/L)}for(let C=0;C<T;C++)for(let x=0;x<2*(T-C)-1;x++){const M=Math.floor(x/2);x%2===0?(d(A[C][M+1]),d(A[C+1][M]),d(A[C][M])):(d(A[C][M+1]),d(A[C+1][M+1]),d(A[C+1][M]))}}function c(b){const E=new I;for(let _=0;_<a.length;_+=3)E.x=a[_+0],E.y=a[_+1],E.z=a[_+2],E.normalize().multiplyScalar(b),a[_+0]=E.x,a[_+1]=E.y,a[_+2]=E.z}function u(){const b=new I;for(let E=0;E<a.length;E+=3){b.x=a[E+0],b.y=a[E+1],b.z=a[E+2];const _=m(b)/2/Math.PI+.5,w=p(b)/Math.PI+.5;s.push(_,1-w)}g(),f()}function f(){for(let b=0;b<s.length;b+=6){const E=s[b+0],_=s[b+2],w=s[b+4],T=Math.max(E,_,w),A=Math.min(E,_,w);T>.9&&A<.1&&(E<.2&&(s[b+0]+=1),_<.2&&(s[b+2]+=1),w<.2&&(s[b+4]+=1))}}function d(b){a.push(b.x,b.y,b.z)}function h(b,E){const _=b*3;E.x=t[_+0],E.y=t[_+1],E.z=t[_+2]}function g(){const b=new I,E=new I,_=new I,w=new I,T=new Wt,A=new Wt,C=new Wt;for(let x=0,M=0;x<a.length;x+=9,M+=6){b.set(a[x+0],a[x+1],a[x+2]),E.set(a[x+3],a[x+4],a[x+5]),_.set(a[x+6],a[x+7],a[x+8]),T.set(s[M+0],s[M+1]),A.set(s[M+2],s[M+3]),C.set(s[M+4],s[M+5]),w.copy(b).add(E).add(_).divideScalar(3);const L=m(w);v(T,M+0,b,L),v(A,M+2,E,L),v(C,M+4,_,L)}}function v(b,E,_,w){w<0&&b.x===1&&(s[E]=b.x-1),_.x===0&&_.z===0&&(s[E]=w/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tl(t.vertices,t.indices,t.radius,t.details)}}class jr extends Tl{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new jr(t.radius,t.detail)}}class Ti extends Ee{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const a=t/2,s=e/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,f=t/o,d=e/l,h=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const b=p*d-s;for(let E=0;E<c;E++){const _=E*f-a;g.push(_,-b,0),v.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const E=b+c*p,_=b+c*(p+1),w=b+1+c*(p+1),T=b+1+c*p;h.push(E,_,T),h.push(_,w,T)}this.setIndex(h),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(v,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ti(t.width,t.height,t.widthSegments,t.heightSegments)}}class Al extends Ee{constructor(t=.5,e=1,n=32,r=1,a=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:a,thetaLength:s},n=Math.max(3,n),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let f=t;const d=(e-t)/r,h=new I,g=new Wt;for(let v=0;v<=r;v++){for(let m=0;m<=n;m++){const p=a+m/n*s;h.x=f*Math.cos(p),h.y=f*Math.sin(p),l.push(h.x,h.y,h.z),c.push(0,0,1),g.x=(h.x/e+1)/2,g.y=(h.y/e+1)/2,u.push(g.x,g.y)}f+=d}for(let v=0;v<r;v++){const m=v*(n+1);for(let p=0;p<n;p++){const b=p+m,E=b,_=b+n+1,w=b+n+2,T=b+1;o.push(E,_,T),o.push(_,w,T)}}this.setIndex(o),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(c,3)),this.setAttribute("uv",new Jt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Al(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Vr extends Ee{constructor(t=1,e=32,n=16,r=0,a=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:a,thetaStart:s,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(s+o,Math.PI);let c=0;const u=[],f=new I,d=new I,h=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const b=[],E=p/n;let _=0;p===0&&s===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let w=0;w<=e;w++){const T=w/e;f.x=-t*Math.cos(r+T*a)*Math.sin(s+E*o),f.y=t*Math.cos(s+E*o),f.z=t*Math.sin(r+T*a)*Math.sin(s+E*o),g.push(f.x,f.y,f.z),d.copy(f).normalize(),v.push(d.x,d.y,d.z),m.push(T+_,1-E),b.push(c++)}u.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const E=u[p][b+1],_=u[p][b],w=u[p+1][b],T=u[p+1][b+1];(p!==0||s>0)&&h.push(E,_,T),(p!==n-1||l<Math.PI)&&h.push(_,w,T)}this.setIndex(h),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(v,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class gn extends Li{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_l,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Rl extends Li{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_l,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=ul,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Fp extends Li{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Id,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Op extends Li{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class wf extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Rt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Dc extends wf{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Rt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Hs=new ue,Uc=new I,Nc=new I;class zp{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new El,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Uc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Uc),Nc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Nc),e.updateMatrixWorld(),Hs.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hs,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Hs)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class rs extends xf{constructor(t=-1,e=1,n=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-t,s=n+t,o=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,s=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class kp extends zp{constructor(){super(new rs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fc extends wf{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new kp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Bp extends pn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const Oc=new ue;class Tf{constructor(t,e,n=0,r=1/0){this.ray=new Ml(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new bl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Oc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Oc),this}intersectObject(t,e=!0,n=[]){return Wo(t,this,n,e),n.sort(zc),n}intersectObjects(t,e=!0,n=[]){for(let r=0,a=t.length;r<a;r++)Wo(t[r],this,n,e);return n.sort(zc),n}}function zc(i,t){return i.distance-t.distance}function Wo(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const a=i.children;for(let s=0,o=a.length;s<o;s++)Wo(a[s],t,e,!0)}}class Hp{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Xt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Xt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}function kc(i,t,e,n){const r=Gp(n);switch(e){case cf:return i*t;case pl:return i*t/r.components*r.byteLength;case ml:return i*t/r.components*r.byteLength;case ff:return i*t*2/r.components*r.byteLength;case gl:return i*t*2/r.components*r.byteLength;case uf:return i*t*3/r.components*r.byteLength;case Qe:return i*t*4/r.components*r.byteLength;case vl:return i*t*4/r.components*r.byteLength;case Pa:case La:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ia:case Da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vo:case xo:return Math.max(i,16)*Math.max(t,8)/4;case go:case _o:return Math.max(i,8)*Math.max(t,8)/2;case yo:case Mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case bo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case So:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Eo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case wo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case To:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ro:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Co:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Po:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Lo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Io:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Do:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Uo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case No:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Fo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Oo:case zo:case ko:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Bo:case Ho:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Go:case Vo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Gp(i){switch(i){case Rn:case af:return{byteLength:1,components:1};case Or:case sf:case Yr:return{byteLength:2,components:1};case hl:case dl:return{byteLength:2,components:4};case Ei:case fl:case wn:return{byteLength:4,components:1};case of:case lf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cl);function Af(){let i=null,t=!1,e=null,n=null;function r(a,s){e(a,s),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function Vp(i){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,f=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let h;if(c instanceof Float32Array)h=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=i.SHORT;else if(c instanceof Uint32Array)h=i.UNSIGNED_INT;else if(c instanceof Int32Array)h=i.INT;else if(c instanceof Int8Array)h=i.BYTE;else if(c instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((h,g)=>h.start-g.start);let d=0;for(let h=1;h<f.length;h++){const g=f[d],v=f[h];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,f[d]=v)}f.length=d+1;for(let h=0,g=f.length;h<g;h++){const v=f[h];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:a,update:s}}var Wp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$p=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Zp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Qp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,im=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,_m=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ym="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Em=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Am=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Im=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Um=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Fm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Om=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,km=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ym=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$m=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Km=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,t0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,e0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,n0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,i0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,r0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,a0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,s0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,o0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,l0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,c0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,h0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,d0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,p0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,m0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,g0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,v0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,x0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,y0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,M0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,b0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,S0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,E0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,w0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,T0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,A0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,R0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,C0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,P0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,L0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,I0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,D0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,U0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,N0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,F0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,O0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,z0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,k0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,B0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,H0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,G0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const V0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,W0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,j0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,K0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Z0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,J0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ng=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ig=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ug=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_g=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Mg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:Wp,alphahash_pars_fragment:Xp,alphamap_fragment:Yp,alphamap_pars_fragment:$p,alphatest_fragment:jp,alphatest_pars_fragment:qp,aomap_fragment:Kp,aomap_pars_fragment:Zp,batching_pars_vertex:Jp,batching_vertex:Qp,begin_vertex:tm,beginnormal_vertex:em,bsdfs:nm,iridescence_fragment:im,bumpmap_pars_fragment:rm,clipping_planes_fragment:am,clipping_planes_pars_fragment:sm,clipping_planes_pars_vertex:om,clipping_planes_vertex:lm,color_fragment:cm,color_pars_fragment:um,color_pars_vertex:fm,color_vertex:hm,common:dm,cube_uv_reflection_fragment:pm,defaultnormal_vertex:mm,displacementmap_pars_vertex:gm,displacementmap_vertex:vm,emissivemap_fragment:_m,emissivemap_pars_fragment:xm,colorspace_fragment:ym,colorspace_pars_fragment:Mm,envmap_fragment:bm,envmap_common_pars_fragment:Sm,envmap_pars_fragment:Em,envmap_pars_vertex:wm,envmap_physical_pars_fragment:Fm,envmap_vertex:Tm,fog_vertex:Am,fog_pars_vertex:Rm,fog_fragment:Cm,fog_pars_fragment:Pm,gradientmap_pars_fragment:Lm,lightmap_pars_fragment:Im,lights_lambert_fragment:Dm,lights_lambert_pars_fragment:Um,lights_pars_begin:Nm,lights_toon_fragment:Om,lights_toon_pars_fragment:zm,lights_phong_fragment:km,lights_phong_pars_fragment:Bm,lights_physical_fragment:Hm,lights_physical_pars_fragment:Gm,lights_fragment_begin:Vm,lights_fragment_maps:Wm,lights_fragment_end:Xm,logdepthbuf_fragment:Ym,logdepthbuf_pars_fragment:$m,logdepthbuf_pars_vertex:jm,logdepthbuf_vertex:qm,map_fragment:Km,map_pars_fragment:Zm,map_particle_fragment:Jm,map_particle_pars_fragment:Qm,metalnessmap_fragment:t0,metalnessmap_pars_fragment:e0,morphinstance_vertex:n0,morphcolor_vertex:i0,morphnormal_vertex:r0,morphtarget_pars_vertex:a0,morphtarget_vertex:s0,normal_fragment_begin:o0,normal_fragment_maps:l0,normal_pars_fragment:c0,normal_pars_vertex:u0,normal_vertex:f0,normalmap_pars_fragment:h0,clearcoat_normal_fragment_begin:d0,clearcoat_normal_fragment_maps:p0,clearcoat_pars_fragment:m0,iridescence_pars_fragment:g0,opaque_fragment:v0,packing:_0,premultiplied_alpha_fragment:x0,project_vertex:y0,dithering_fragment:M0,dithering_pars_fragment:b0,roughnessmap_fragment:S0,roughnessmap_pars_fragment:E0,shadowmap_pars_fragment:w0,shadowmap_pars_vertex:T0,shadowmap_vertex:A0,shadowmask_pars_fragment:R0,skinbase_vertex:C0,skinning_pars_vertex:P0,skinning_vertex:L0,skinnormal_vertex:I0,specularmap_fragment:D0,specularmap_pars_fragment:U0,tonemapping_fragment:N0,tonemapping_pars_fragment:F0,transmission_fragment:O0,transmission_pars_fragment:z0,uv_pars_fragment:k0,uv_pars_vertex:B0,uv_vertex:H0,worldpos_vertex:G0,background_vert:V0,background_frag:W0,backgroundCube_vert:X0,backgroundCube_frag:Y0,cube_vert:$0,cube_frag:j0,depth_vert:q0,depth_frag:K0,distanceRGBA_vert:Z0,distanceRGBA_frag:J0,equirect_vert:Q0,equirect_frag:tg,linedashed_vert:eg,linedashed_frag:ng,meshbasic_vert:ig,meshbasic_frag:rg,meshlambert_vert:ag,meshlambert_frag:sg,meshmatcap_vert:og,meshmatcap_frag:lg,meshnormal_vert:cg,meshnormal_frag:ug,meshphong_vert:fg,meshphong_frag:hg,meshphysical_vert:dg,meshphysical_frag:pg,meshtoon_vert:mg,meshtoon_frag:gg,points_vert:vg,points_frag:_g,shadow_vert:xg,shadow_frag:yg,sprite_vert:Mg,sprite_frag:bg},at={common:{diffuse:{value:new Rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Rt(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},En={basic:{uniforms:We([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:We([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Rt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:We([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Rt(0)},specular:{value:new Rt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:We([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:We([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Rt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:We([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:We([at.points,at.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:We([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:We([at.common,at.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:We([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:We([at.sprite,at.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:We([at.common,at.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:We([at.lights,at.fog,{color:{value:new Rt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};En.physical={uniforms:We([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Rt(0)},specularColor:{value:new Rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const Ma={r:0,b:0,g:0},pi=new xn,Sg=new ue;function Eg(i,t,e,n,r,a,s){const o=new Rt(0);let l=a===!0?0:1,c,u,f=null,d=0,h=null;function g(E){let _=E.isScene===!0?E.background:null;return _&&_.isTexture&&(_=(E.backgroundBlurriness>0?e:t).get(_)),_}function v(E){let _=!1;const w=g(E);w===null?p(o,l):w&&w.isColor&&(p(w,1),_=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,s):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,_){const w=g(_);w&&(w.isCubeTexture||w.mapping===ns)?(u===void 0&&(u=new Yt(new Ii(1,1,1),new Bn({name:"BackgroundCubeMaterial",uniforms:cr(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),pi.copy(_.backgroundRotation),pi.x*=-1,pi.y*=-1,pi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Sg.makeRotationFromEuler(pi)),u.material.toneMapped=te.getTransfer(w.colorSpace)!==ae,(f!==w||d!==w.version||h!==i.toneMapping)&&(u.material.needsUpdate=!0,f=w,d=w.version,h=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new Yt(new Ti(2,2),new Bn({name:"BackgroundMaterial",uniforms:cr(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=te.getTransfer(w.colorSpace)!==ae,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(f!==w||d!==w.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,f=w,d=w.version,h=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,_){E.getRGB(Ma,_f(i)),n.buffers.color.setClear(Ma.r,Ma.g,Ma.b,_,s)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,_=1){o.set(E),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(o,l)},render:v,addToRenderList:m,dispose:b}}function wg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let a=r,s=!1;function o(M,L,F,z,W){let V=!1;const Y=f(z,F,L);a!==Y&&(a=Y,c(a.object)),V=h(M,z,F,W),V&&g(M,z,F,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(V||s)&&(s=!1,_(M,L,F,z),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function f(M,L,F){const z=F.wireframe===!0;let W=n[M.id];W===void 0&&(W={},n[M.id]=W);let V=W[L.id];V===void 0&&(V={},W[L.id]=V);let Y=V[z];return Y===void 0&&(Y=d(l()),V[z]=Y),Y}function d(M){const L=[],F=[],z=[];for(let W=0;W<e;W++)L[W]=0,F[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:z,object:M,attributes:{},index:null}}function h(M,L,F,z){const W=a.attributes,V=L.attributes;let Y=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){const ut=W[H];let wt=V[H];if(wt===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(wt=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(wt=M.instanceColor)),ut===void 0||ut.attribute!==wt||wt&&ut.data!==wt.data)return!0;Y++}return a.attributesNum!==Y||a.index!==z}function g(M,L,F,z){const W={},V=L.attributes;let Y=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){let ut=V[H];ut===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(ut=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(ut=M.instanceColor));const wt={};wt.attribute=ut,ut&&ut.data&&(wt.data=ut.data),W[H]=wt,Y++}a.attributes=W,a.attributesNum=Y,a.index=z}function v(){const M=a.newAttributes;for(let L=0,F=M.length;L<F;L++)M[L]=0}function m(M){p(M,0)}function p(M,L){const F=a.newAttributes,z=a.enabledAttributes,W=a.attributeDivisors;F[M]=1,z[M]===0&&(i.enableVertexAttribArray(M),z[M]=1),W[M]!==L&&(i.vertexAttribDivisor(M,L),W[M]=L)}function b(){const M=a.newAttributes,L=a.enabledAttributes;for(let F=0,z=L.length;F<z;F++)L[F]!==M[F]&&(i.disableVertexAttribArray(F),L[F]=0)}function E(M,L,F,z,W,V,Y){Y===!0?i.vertexAttribIPointer(M,L,F,W,V):i.vertexAttribPointer(M,L,F,z,W,V)}function _(M,L,F,z){v();const W=z.attributes,V=F.getAttributes(),Y=L.defaultAttributeValues;for(const K in V){const H=V[K];if(H.location>=0){let st=W[K];if(st===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(st=M.instanceColor)),st!==void 0){const ut=st.normalized,wt=st.itemSize,$t=t.get(st);if($t===void 0)continue;const le=$t.buffer,me=$t.type,ee=$t.bytesPerElement,$=me===i.INT||me===i.UNSIGNED_INT||st.gpuType===fl;if(st.isInterleavedBufferAttribute){const Z=st.data,dt=Z.stride,Nt=st.offset;if(Z.isInstancedInterleavedBuffer){for(let bt=0;bt<H.locationSize;bt++)p(H.location+bt,Z.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let bt=0;bt<H.locationSize;bt++)m(H.location+bt);i.bindBuffer(i.ARRAY_BUFFER,le);for(let bt=0;bt<H.locationSize;bt++)E(H.location+bt,wt/H.locationSize,me,ut,dt*ee,(Nt+wt/H.locationSize*bt)*ee,$)}else{if(st.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,st.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Z=0;Z<H.locationSize;Z++)m(H.location+Z);i.bindBuffer(i.ARRAY_BUFFER,le);for(let Z=0;Z<H.locationSize;Z++)E(H.location+Z,wt/H.locationSize,me,ut,wt*ee,wt/H.locationSize*Z*ee,$)}}else if(Y!==void 0){const ut=Y[K];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(H.location,ut);break;case 3:i.vertexAttrib3fv(H.location,ut);break;case 4:i.vertexAttrib4fv(H.location,ut);break;default:i.vertexAttrib1fv(H.location,ut)}}}}b()}function w(){C();for(const M in n){const L=n[M];for(const F in L){const z=L[F];for(const W in z)u(z[W].object),delete z[W];delete L[F]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const F in L){const z=L[F];for(const W in z)u(z[W].object),delete z[W];delete L[F]}delete n[M.id]}function A(M){for(const L in n){const F=n[L];if(F[M.id]===void 0)continue;const z=F[M.id];for(const W in z)u(z[W].object),delete z[W];delete F[M.id]}}function C(){x(),s=!0,a!==r&&(a=r,c(a.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:x,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function Tg(i,t,e){let n;function r(c){n=c}function a(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function s(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),e.update(u,n,f))}function o(c,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,f);let h=0;for(let g=0;g<f;g++)h+=u[g];e.update(h,n,1)}function l(c,u,f,d){if(f===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<c.length;g++)s(c[g],u[g],d[g]);else{h.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v]*d[v];e.update(g,n,1)}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Ag(i,t,e,n){let r;function a(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(A){return!(A!==Qe&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===Yr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Rn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==wn&&!C)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:h,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:_,vertexTextures:w,maxSamples:T}}function Rg(i){const t=this;let e=null,n=0,r=!1,a=!1;const s=new Fn,o=new Bt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const h=f.length!==0||d||n!==0||r;return r=d,n=f.length,h},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=u(f,d,0)},this.setState=function(f,d,h){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!r||g===null||g.length===0||a&&!m)a?u(null):c();else{const b=a?0:n,E=b*4;let _=p.clippingState||null;l.value=_,_=u(g,d,E,h);for(let w=0;w!==E;++w)_[w]=e[w];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,d,h,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=h+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,_=h;E!==v;++E,_+=4)s.copy(f[E]).applyMatrix4(b,o),s.normal.toArray(m,_),m[_+3]=s.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Cg(i){let t=new WeakMap;function e(s,o){return o===ho?s.mapping=sr:o===po&&(s.mapping=or),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===ho||o===po)if(t.has(s)){const l=t.get(s).texture;return e(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new Rp(l.height);return c.fromEquirectangularTexture(i,s),t.set(s,c),s.addEventListener("dispose",r),e(c.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}const Ji=4,Bc=[.125,.215,.35,.446,.526,.582],_i=20,Gs=new rs,Hc=new Rt;let Vs=null,Ws=0,Xs=0,Ys=!1;const gi=(1+Math.sqrt(5))/2,ji=1/gi,Gc=[new I(-gi,ji,0),new I(gi,ji,0),new I(-ji,0,gi),new I(ji,0,gi),new I(0,gi,-ji),new I(0,gi,ji),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Pg=new I;class Vc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,a={}){const{size:s=256,position:o=Pg}=a;Vs=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Xs=this._renderer.getActiveMipmapLevel(),Ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,r,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vs,Ws,Xs),this._renderer.xr.enabled=Ys,t.scissorTest=!1,ba(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===sr||t.mapping===or?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vs=this._renderer.getRenderTarget(),Ws=this._renderer.getActiveCubeFace(),Xs=this._renderer.getActiveMipmapLevel(),Ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:Yr,format:Qe,colorSpace:lr,depthBuffer:!1},r=Wc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lg(a)),this._blurMaterial=Ig(a,t,e)}return r}_compileMaterial(t){const e=new Yt(this._lodPlanes[0],t);this._renderer.compile(e,Gs)}_sceneToCubeUV(t,e,n,r,a){const l=new pn(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,h=f.toneMapping;f.getClearColor(Hc),f.toneMapping=ei,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null));const v=new On({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),m=new Yt(new Ii,v);let p=!1;const b=t.background;b?b.isColor&&(v.color.copy(b),t.background=null,p=!0):(v.color.copy(Hc),p=!0);for(let E=0;E<6;E++){const _=E%3;_===0?(l.up.set(0,c[E],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+u[E],a.y,a.z)):_===1?(l.up.set(0,0,c[E]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+u[E],a.z)):(l.up.set(0,c[E],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+u[E]));const w=this._cubeSize;ba(r,_*w,E>2?w:0,w,w),f.setRenderTarget(r),p&&f.render(m,l),f.render(t,l)}m.geometry.dispose(),m.material.dispose(),f.toneMapping=h,f.autoClear=d,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===sr||t.mapping===or;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xc());const a=r?this._cubemapMaterial:this._equirectMaterial,s=new Yt(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const l=this._cubeSize;ba(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(s,Gs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let a=1;a<r;a++){const s=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Gc[(r-a-1)%Gc.length];this._blur(t,a-1,a,s,o)}e.autoClear=n}_blur(t,e,n,r,a){const s=this._pingPongRenderTarget;this._halfBlur(t,s,e,n,r,"latitudinal",a),this._halfBlur(s,t,n,n,r,"longitudinal",a)}_halfBlur(t,e,n,r,a,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Yt(this._lodPlanes[r],c),d=c.uniforms,h=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*h):2*Math.PI/(2*_i-1),v=a/g,m=isFinite(a)?1+Math.floor(u*v):_i;m>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const p=[];let b=0;for(let A=0;A<_i;++A){const C=A/v,x=Math.exp(-C*C/2);p.push(x),A===0?b+=x:A<m&&(b+=2*x)}for(let A=0;A<p.length;A++)p[A]=p[A]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=s==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const _=this._sizeLods[r],w=3*_*(r>E-Ji?r-E+Ji:0),T=4*(this._cubeSize-_);ba(e,w,T,3*_,2*_),l.setRenderTarget(e),l.render(f,Gs)}}function Lg(i){const t=[],e=[],n=[];let r=i;const a=i-Ji+1+Bc.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);e.push(o);let l=1/o;s>i-Ji?l=Bc[s-i+Ji-1]:s===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],h=6,g=6,v=3,m=2,p=1,b=new Float32Array(v*g*h),E=new Float32Array(m*g*h),_=new Float32Array(p*g*h);for(let T=0;T<h;T++){const A=T%3*2/3-1,C=T>2?0:-1,x=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];b.set(x,v*g*T),E.set(d,m*g*T);const M=[T,T,T,T,T,T];_.set(M,p*g*T)}const w=new Ee;w.setAttribute("position",new en(b,v)),w.setAttribute("uv",new en(E,m)),w.setAttribute("faceIndex",new en(_,p)),t.push(w),r>Ji&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Wc(i,t,e){const n=new wi(i,t,e);return n.texture.mapping=ns,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ba(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Ig(i,t,e){const n=new Float32Array(_i),r=new I(0,1,0);return new Bn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Xc(){return new Bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Yc(){return new Bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Cl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Dg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ho||l===po,u=l===sr||l===or;if(c||u){let f=t.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Vc(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const h=o.image;return c&&h&&h.height>0||u&&h&&r(h)?(e===null&&(e=new Vc(i)),f=c?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function s(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:s}}function Ug(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Gr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Ng(i,t,e,n){const r={},a=new WeakMap;function s(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",s),delete r[d.id];const h=a.get(d);h&&(t.remove(h),a.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(f,d){return r[d.id]===!0||(d.addEventListener("dispose",s),r[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const h in d)t.update(d[h],i.ARRAY_BUFFER)}function c(f){const d=[],h=f.index,g=f.attributes.position;let v=0;if(h!==null){const b=h.array;v=h.version;for(let E=0,_=b.length;E<_;E+=3){const w=b[E+0],T=b[E+1],A=b[E+2];d.push(w,T,T,A,A,w)}}else if(g!==void 0){const b=g.array;v=g.version;for(let E=0,_=b.length/3-1;E<_;E+=3){const w=E+0,T=E+1,A=E+2;d.push(w,T,T,A,A,w)}}else return;const m=new(df(d)?vf:gf)(d,1);m.version=v;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function u(f){const d=a.get(f);if(d){const h=f.index;h!==null&&d.version<h.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function Fg(i,t,e){let n;function r(d){n=d}let a,s;function o(d){a=d.type,s=d.bytesPerElement}function l(d,h){i.drawElements(n,h,a,d*s),e.update(h,n,1)}function c(d,h,g){g!==0&&(i.drawElementsInstanced(n,h,a,d*s,g),e.update(h,n,g))}function u(d,h,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,a,d,0,g);let m=0;for(let p=0;p<g;p++)m+=h[p];e.update(m,n,1)}function f(d,h,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/s,h[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,h,0,a,d,0,v,0,g);let p=0;for(let b=0;b<g;b++)p+=h[b]*v[b];e.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Og(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,s,o){switch(e.calls++,s){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function zg(i,t,e){const n=new WeakMap,r=new de;function a(s,o,l){const c=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==f){let M=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var h=M;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let w=o.attributes.position.count*_,T=1;w>t.maxTextureSize&&(T=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const A=new Float32Array(w*T*4*f),C=new pf(A,w,T,f);C.type=wn,C.needsUpdate=!0;const x=_*4;for(let L=0;L<f;L++){const F=p[L],z=b[L],W=E[L],V=w*T*4*L;for(let Y=0;Y<F.count;Y++){const K=Y*x;g===!0&&(r.fromBufferAttribute(F,Y),A[V+K+0]=r.x,A[V+K+1]=r.y,A[V+K+2]=r.z,A[V+K+3]=0),v===!0&&(r.fromBufferAttribute(z,Y),A[V+K+4]=r.x,A[V+K+5]=r.y,A[V+K+6]=r.z,A[V+K+7]=0),m===!0&&(r.fromBufferAttribute(W,Y),A[V+K+8]=r.x,A[V+K+9]=r.y,A[V+K+10]=r.z,A[V+K+11]=W.itemSize===4?r.w:1)}}d={count:f,texture:C,size:new Wt(w,T)},n.set(o,d),o.addEventListener("dispose",M)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:a}}function kg(i,t,e,n){let r=new WeakMap;function a(l){const c=n.render.frame,u=l.geometry,f=t.get(l,u);if(r.get(f)!==c&&(t.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return f}function s(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:s}}const Rf=new Be,$c=new Sf(1,1),Cf=new pf,Pf=new fp,Lf=new yf,jc=[],qc=[],Kc=new Float32Array(16),Zc=new Float32Array(9),Jc=new Float32Array(4);function gr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let a=jc[r];if(a===void 0&&(a=new Float32Array(r),jc[r]=a),t!==0){n.toArray(a,0);for(let s=1,o=0;s!==t;++s)o+=e,i[s].toArray(a,o)}return a}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function as(i,t){let e=qc[t];e===void 0&&(e=new Int32Array(t),qc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Bg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function Vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function Wg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Jc.set(n),i.uniformMatrix2fv(this.addr,!1,Jc),Re(e,n)}}function Xg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Zc.set(n),i.uniformMatrix3fv(this.addr,!1,Zc),Re(e,n)}}function Yg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Kc.set(n),i.uniformMatrix4fv(this.addr,!1,Kc),Re(e,n)}}function $g(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function Zg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function tv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function ev(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?($c.compareFunction=hf,a=$c):a=Rf,e.setTexture2D(t||a,r)}function nv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Pf,r)}function iv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Lf,r)}function rv(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Cf,r)}function av(i){switch(i){case 5126:return Bg;case 35664:return Hg;case 35665:return Gg;case 35666:return Vg;case 35674:return Wg;case 35675:return Xg;case 35676:return Yg;case 5124:case 35670:return $g;case 35667:case 35671:return jg;case 35668:case 35672:return qg;case 35669:case 35673:return Kg;case 5125:return Zg;case 36294:return Jg;case 36295:return Qg;case 36296:return tv;case 35678:case 36198:case 36298:case 36306:case 35682:return ev;case 35679:case 36299:case 36307:return nv;case 35680:case 36300:case 36308:case 36293:return iv;case 36289:case 36303:case 36311:case 36292:return rv}}function sv(i,t){i.uniform1fv(this.addr,t)}function ov(i,t){const e=gr(t,this.size,2);i.uniform2fv(this.addr,e)}function lv(i,t){const e=gr(t,this.size,3);i.uniform3fv(this.addr,e)}function cv(i,t){const e=gr(t,this.size,4);i.uniform4fv(this.addr,e)}function uv(i,t){const e=gr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function fv(i,t){const e=gr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function hv(i,t){const e=gr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function dv(i,t){i.uniform1iv(this.addr,t)}function pv(i,t){i.uniform2iv(this.addr,t)}function mv(i,t){i.uniform3iv(this.addr,t)}function gv(i,t){i.uniform4iv(this.addr,t)}function vv(i,t){i.uniform1uiv(this.addr,t)}function _v(i,t){i.uniform2uiv(this.addr,t)}function xv(i,t){i.uniform3uiv(this.addr,t)}function yv(i,t){i.uniform4uiv(this.addr,t)}function Mv(i,t,e){const n=this.cache,r=t.length,a=as(e,r);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let s=0;s!==r;++s)e.setTexture2D(t[s]||Rf,a[s])}function bv(i,t,e){const n=this.cache,r=t.length,a=as(e,r);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let s=0;s!==r;++s)e.setTexture3D(t[s]||Pf,a[s])}function Sv(i,t,e){const n=this.cache,r=t.length,a=as(e,r);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let s=0;s!==r;++s)e.setTextureCube(t[s]||Lf,a[s])}function Ev(i,t,e){const n=this.cache,r=t.length,a=as(e,r);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let s=0;s!==r;++s)e.setTexture2DArray(t[s]||Cf,a[s])}function wv(i){switch(i){case 5126:return sv;case 35664:return ov;case 35665:return lv;case 35666:return cv;case 35674:return uv;case 35675:return fv;case 35676:return hv;case 5124:case 35670:return dv;case 35667:case 35671:return pv;case 35668:case 35672:return mv;case 35669:case 35673:return gv;case 5125:return vv;case 36294:return _v;case 36295:return xv;case 36296:return yv;case 35678:case 36198:case 36298:case 36306:case 35682:return Mv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return Sv;case 36289:case 36303:case 36311:case 36292:return Ev}}class Tv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=av(e.type)}}class Av{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wv(e.type)}}class Rv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(t,e[o.id],n)}}}const $s=/(\w+)(\])?(\[|\.)?/g;function Qc(i,t){i.seq.push(t),i.map[t.id]=t}function Cv(i,t,e){const n=i.name,r=n.length;for($s.lastIndex=0;;){const a=$s.exec(n),s=$s.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===r){Qc(e,c===void 0?new Tv(o,i,t):new Av(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Rv(o),Qc(e,f)),e=f}}}class Ua{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const a=t.getActiveUniform(e,r),s=t.getUniformLocation(e,a.name);Cv(a,s,this)}}setValue(t,e,n,r){const a=this.map[e];a!==void 0&&a.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let a=0,s=e.length;a!==s;++a){const o=e[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,a=t.length;r!==a;++r){const s=t[r];s.id in e&&n.push(s)}return n}}function tu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Pv=37297;let Lv=0;function Iv(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let s=r;s<a;s++){const o=s+1;n.push(`${o===t?">":" "} ${o}: ${e[s]}`)}return n.join(`
`)}const eu=new Bt;function Dv(i){te._getMatrix(eu,te.workingColorSpace,i);const t=`mat3( ${eu.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case Xa:return[t,"LinearTransferOETF"];case ae:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function nu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),a=(i.getShaderInfoLog(t)||"").trim();if(n&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+Iv(i.getShaderSource(t),o)}else return a}function Uv(i,t){const e=Dv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Nv(i,t){let e;switch(t){case wd:e="Linear";break;case Td:e="Reinhard";break;case Ad:e="Cineon";break;case fo:e="ACESFilmic";break;case Cd:e="AgX";break;case Pd:e="Neutral";break;case Rd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Sa=new I;function Fv(){te.getLuminanceCoefficients(Sa);const i=Sa.x.toFixed(4),t=Sa.y.toFixed(4),e=Sa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ov(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ar).join(`
`)}function zv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function kv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(t,r),s=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[s]={type:a.type,location:i.getAttribLocation(t,s),locationSize:o}}return e}function Ar(i){return i!==""}function iu(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ru(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Bv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xo(i){return i.replace(Bv,Gv)}const Hv=new Map;function Gv(i,t){let e=Vt[t];if(e===void 0){const n=Hv.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Xo(e)}const Vv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function au(i){return i.replace(Vv,Wv)}function Wv(i,t,e,n){let r="";for(let a=parseInt(t);a<parseInt(e);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function su(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Xv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ef?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===nf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Nn&&(t="SHADOWMAP_TYPE_VSM"),t}function Yv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case sr:case or:t="ENVMAP_TYPE_CUBE";break;case ns:t="ENVMAP_TYPE_CUBE_UV";break}return t}function $v(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===or&&(t="ENVMAP_MODE_REFRACTION"),t}function jv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ul:t="ENVMAP_BLENDING_MULTIPLY";break;case Sd:t="ENVMAP_BLENDING_MIX";break;case Ed:t="ENVMAP_BLENDING_ADD";break}return t}function qv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Kv(i,t,e,n){const r=i.getContext(),a=e.defines;let s=e.vertexShader,o=e.fragmentShader;const l=Xv(e),c=Yv(e),u=$v(e),f=jv(e),d=qv(e),h=Ov(e),g=zv(a),v=r.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ar).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ar).join(`
`),p.length>0&&(p+=`
`)):(m=[su(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ar).join(`
`),p=[su(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?Vt.tonemapping_pars_fragment:"",e.toneMapping!==ei?Nv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Uv("linearToOutputTexel",e.outputColorSpace),Fv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ar).join(`
`)),s=Xo(s),s=iu(s,e),s=ru(s,e),o=Xo(o),o=iu(o,e),o=ru(o,e),s=au(s),o=au(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===lc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=b+m+s,_=b+p+o,w=tu(r,r.VERTEX_SHADER,E),T=tu(r,r.FRAGMENT_SHADER,_);r.attachShader(v,w),r.attachShader(v,T),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(L){if(i.debug.checkShaderErrors){const F=r.getProgramInfoLog(v)||"",z=r.getShaderInfoLog(w)||"",W=r.getShaderInfoLog(T)||"",V=F.trim(),Y=z.trim(),K=W.trim();let H=!0,st=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,w,T);else{const ut=nu(r,w,"vertex"),wt=nu(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+ut+`
`+wt)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(Y===""||K==="")&&(st=!1);st&&(L.diagnostics={runnable:H,programLog:V,vertexShader:{log:Y,prefix:m},fragmentShader:{log:K,prefix:p}})}r.deleteShader(w),r.deleteShader(T),C=new Ua(r,v),x=kv(r,v)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,Pv)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Lv++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=T,this}let Zv=0;class Jv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(t);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Qv(t),e.set(t,n)),n}}class Qv{constructor(t){this.id=Zv++,this.code=t,this.usedTimes=0}}function t_(i,t,e,n,r,a,s){const o=new bl,l=new Jv,c=new Set,u=[],f=r.logarithmicDepthBuffer,d=r.vertexTextures;let h=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,M,L,F,z){const W=F.fog,V=z.geometry,Y=x.isMeshStandardMaterial?F.environment:null,K=(x.isMeshStandardMaterial?e:t).get(x.envMap||Y),H=K&&K.mapping===ns?K.image.height:null,st=g[x.type];x.precision!==null&&(h=r.getMaxPrecision(x.precision),h!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));const ut=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,wt=ut!==void 0?ut.length:0;let $t=0;V.morphAttributes.position!==void 0&&($t=1),V.morphAttributes.normal!==void 0&&($t=2),V.morphAttributes.color!==void 0&&($t=3);let le,me,ee,$;if(st){const ne=En[st];le=ne.vertexShader,me=ne.fragmentShader}else le=x.vertexShader,me=x.fragmentShader,l.update(x),ee=l.getVertexShaderID(x),$=l.getFragmentShaderID(x);const Z=i.getRenderTarget(),dt=i.state.buffers.depth.getReversed(),Nt=z.isInstancedMesh===!0,bt=z.isBatchedMesh===!0,qt=!!x.map,De=!!x.matcap,P=!!K,ge=!!x.aoMap,zt=!!x.lightMap,Dt=!!x.bumpMap,gt=!!x.normalMap,ve=!!x.displacementMap,vt=!!x.emissiveMap,Gt=!!x.metalnessMap,Ce=!!x.roughnessMap,be=x.anisotropy>0,R=x.clearcoat>0,y=x.dispersion>0,O=x.iridescence>0,X=x.sheen>0,q=x.transmission>0,G=be&&!!x.anisotropyMap,Mt=R&&!!x.clearcoatMap,it=R&&!!x.clearcoatNormalMap,_t=R&&!!x.clearcoatRoughnessMap,xt=O&&!!x.iridescenceMap,et=O&&!!x.iridescenceThicknessMap,ct=X&&!!x.sheenColorMap,It=X&&!!x.sheenRoughnessMap,yt=!!x.specularMap,ot=!!x.specularColorMap,kt=!!x.specularIntensityMap,D=q&&!!x.transmissionMap,nt=q&&!!x.thicknessMap,rt=!!x.gradientMap,ht=!!x.alphaMap,J=x.alphaTest>0,j=!!x.alphaHash,mt=!!x.extensions;let Ft=ei;x.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Ft=i.toneMapping);const ce={shaderID:st,shaderType:x.type,shaderName:x.name,vertexShader:le,fragmentShader:me,defines:x.defines,customVertexShaderID:ee,customFragmentShaderID:$,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:bt,batchingColor:bt&&z._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&z.instanceColor!==null,instancingMorph:Nt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:lr,alphaToCoverage:!!x.alphaToCoverage,map:qt,matcap:De,envMap:P,envMapMode:P&&K.mapping,envMapCubeUVHeight:H,aoMap:ge,lightMap:zt,bumpMap:Dt,normalMap:gt,displacementMap:d&&ve,emissiveMap:vt,normalMapObjectSpace:gt&&x.normalMapType===Ud,normalMapTangentSpace:gt&&x.normalMapType===_l,metalnessMap:Gt,roughnessMap:Ce,anisotropy:be,anisotropyMap:G,clearcoat:R,clearcoatMap:Mt,clearcoatNormalMap:it,clearcoatRoughnessMap:_t,dispersion:y,iridescence:O,iridescenceMap:xt,iridescenceThicknessMap:et,sheen:X,sheenColorMap:ct,sheenRoughnessMap:It,specularMap:yt,specularColorMap:ot,specularIntensityMap:kt,transmission:q,transmissionMap:D,thicknessMap:nt,gradientMap:rt,opaque:x.transparent===!1&&x.blending===tr&&x.alphaToCoverage===!1,alphaMap:ht,alphaTest:J,alphaHash:j,combine:x.combine,mapUv:qt&&v(x.map.channel),aoMapUv:ge&&v(x.aoMap.channel),lightMapUv:zt&&v(x.lightMap.channel),bumpMapUv:Dt&&v(x.bumpMap.channel),normalMapUv:gt&&v(x.normalMap.channel),displacementMapUv:ve&&v(x.displacementMap.channel),emissiveMapUv:vt&&v(x.emissiveMap.channel),metalnessMapUv:Gt&&v(x.metalnessMap.channel),roughnessMapUv:Ce&&v(x.roughnessMap.channel),anisotropyMapUv:G&&v(x.anisotropyMap.channel),clearcoatMapUv:Mt&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:it&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_t&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:et&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:It&&v(x.sheenRoughnessMap.channel),specularMapUv:yt&&v(x.specularMap.channel),specularColorMapUv:ot&&v(x.specularColorMap.channel),specularIntensityMapUv:kt&&v(x.specularIntensityMap.channel),transmissionMapUv:D&&v(x.transmissionMap.channel),thicknessMapUv:nt&&v(x.thicknessMap.channel),alphaMapUv:ht&&v(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(gt||be),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!V.attributes.uv&&(qt||ht),fog:!!W,useFog:x.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:dt,skinning:z.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:wt,morphTextureStride:$t,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ft,decodeVideoTexture:qt&&x.map.isVideoTexture===!0&&te.getTransfer(x.map.colorSpace)===ae,decodeVideoTextureEmissive:vt&&x.emissiveMap.isVideoTexture===!0&&te.getTransfer(x.emissiveMap.colorSpace)===ae,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Oe,flipSided:x.side===$e,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:mt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&x.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function p(x){const M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)M.push(L),M.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(b(M,x),E(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function b(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function E(x,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),x.push(o.mask)}function _(x){const M=g[x.type];let L;if(M){const F=En[M];L=Ep.clone(F.uniforms)}else L=x.uniforms;return L}function w(x,M){let L;for(let F=0,z=u.length;F<z;F++){const W=u[F];if(W.cacheKey===M){L=W,++L.usedTimes;break}}return L===void 0&&(L=new Kv(i,M,x,a),u.push(L)),L}function T(x){if(--x.usedTimes===0){const M=u.indexOf(x);u[M]=u[u.length-1],u.pop(),x.destroy()}}function A(x){l.remove(x)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:w,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:C}}function e_(){let i=new WeakMap;function t(s){return i.has(s)}function e(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function r(s,o,l){i.get(s)[o]=l}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:a}}function n_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ou(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function lu(){const i=[];let t=0;const e=[],n=[],r=[];function a(){t=0,e.length=0,n.length=0,r.length=0}function s(f,d,h,g,v,m){let p=i[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:h,groupOrder:g,renderOrder:f.renderOrder,z:v,group:m},i[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=h,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=v,p.group=m),t++,p}function o(f,d,h,g,v,m){const p=s(f,d,h,g,v,m);h.transmission>0?n.push(p):h.transparent===!0?r.push(p):e.push(p)}function l(f,d,h,g,v,m){const p=s(f,d,h,g,v,m);h.transmission>0?n.unshift(p):h.transparent===!0?r.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||n_),n.length>1&&n.sort(d||ou),r.length>1&&r.sort(d||ou)}function u(){for(let f=t,d=i.length;f<d;f++){const h=i[f];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:e,transmissive:n,transparent:r,init:a,push:o,unshift:l,finish:u,sort:c}}function i_(){let i=new WeakMap;function t(n,r){const a=i.get(n);let s;return a===void 0?(s=new lu,i.set(n,[s])):r>=a.length?(s=new lu,a.push(s)):s=a[r],s}function e(){i=new WeakMap}return{get:t,dispose:e}}function r_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Rt};break;case"SpotLight":e={position:new I,direction:new I,color:new Rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Rt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Rt,groundColor:new Rt};break;case"RectAreaLight":e={color:new Rt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function a_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let s_=0;function o_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function l_(i){const t=new r_,e=a_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const r=new I,a=new ue,s=new ue;function o(c){let u=0,f=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let h=0,g=0,v=0,m=0,p=0,b=0,E=0,_=0,w=0,T=0,A=0;c.sort(o_);for(let x=0,M=c.length;x<M;x++){const L=c[x],F=L.color,z=L.intensity,W=L.distance,V=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=F.r*z,f+=F.g*z,d+=F.b*z;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(L.sh.coefficients[Y],z);A++}else if(L.isDirectionalLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const K=L.shadow,H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[h]=H,n.directionalShadowMap[h]=V,n.directionalShadowMatrix[h]=L.shadow.matrix,b++}n.directional[h]=Y,h++}else if(L.isSpotLight){const Y=t.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(F).multiplyScalar(z),Y.distance=W,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,n.spot[v]=Y;const K=L.shadow;if(L.map&&(n.spotLightMap[w]=L.map,w++,K.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[v]=K.matrix,L.castShadow){const H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=V,_++}v++}else if(L.isRectAreaLight){const Y=t.get(L);Y.color.copy(F).multiplyScalar(z),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=Y,m++}else if(L.isPointLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){const K=L.shadow,H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=L.shadow.matrix,E++}n.point[g]=Y,g++}else if(L.isHemisphereLight){const Y=t.get(L);Y.skyColor.copy(L.color).multiplyScalar(z),Y.groundColor.copy(L.groundColor).multiplyScalar(z),n.hemi[p]=Y,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==h||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==b||C.numPointShadows!==E||C.numSpotShadows!==_||C.numSpotMaps!==w||C.numLightProbes!==A)&&(n.directional.length=h,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=_+w-T,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,C.directionalLength=h,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=b,C.numPointShadows=E,C.numSpotShadows=_,C.numSpotMaps=w,C.numLightProbes=A,n.version=s_++)}function l(c,u){let f=0,d=0,h=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const E=c[p];if(E.isDirectionalLight){const _=n.directional[f];_.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),f++}else if(E.isSpotLight){const _=n.spot[h];_.position.setFromMatrixPosition(E.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),h++}else if(E.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(E.matrixWorld),_.position.applyMatrix4(m),s.identity(),a.copy(E.matrixWorld),a.premultiply(m),s.extractRotation(a),_.halfWidth.set(E.width*.5,0,0),_.halfHeight.set(0,E.height*.5,0),_.halfWidth.applyMatrix4(s),_.halfHeight.applyMatrix4(s),g++}else if(E.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(E.matrixWorld),_.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(E.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function cu(i){const t=new l_(i),e=[],n=[];function r(u){c.camera=u,e.length=0,n.length=0}function a(u){e.push(u)}function s(u){n.push(u)}function o(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:s}}function c_(i){let t=new WeakMap;function e(r,a=0){const s=t.get(r);let o;return s===void 0?(o=new cu(i),t.set(r,[o])):a>=s.length?(o=new cu(i),s.push(o)):o=s[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const u_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,f_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function h_(i,t,e){let n=new El;const r=new Wt,a=new Wt,s=new de,o=new Fp({depthPacking:Dd}),l=new Op,c={},u=e.maxTextureSize,f={[ri]:$e,[$e]:ri,[Oe]:Oe},d=new Bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:u_,fragmentShader:f_}),h=d.clone();h.defines.HORIZONTAL_PASS=1;const g=new Ee;g.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Yt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ef;let p=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const x=i.getRenderTarget(),M=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),F=i.state;F.setBlending(ti),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Nn&&this.type===Nn,W=p===Nn&&this.type!==Nn;for(let V=0,Y=T.length;V<Y;V++){const K=T[V],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const st=H.getFrameExtents();if(r.multiply(st),a.copy(H.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(a.x=Math.floor(u/st.x),r.x=a.x*st.x,H.mapSize.x=a.x),r.y>u&&(a.y=Math.floor(u/st.y),r.y=a.y*st.y,H.mapSize.y=a.y)),H.map===null||z===!0||W===!0){const wt=this.type!==Nn?{minFilter:tn,magFilter:tn}:{};H.map!==null&&H.map.dispose(),H.map=new wi(r.x,r.y,wt),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ut=H.getViewportCount();for(let wt=0;wt<ut;wt++){const $t=H.getViewport(wt);s.set(a.x*$t.x,a.y*$t.y,a.x*$t.z,a.y*$t.w),F.viewport(s),H.updateMatrices(K,wt),n=H.getFrustum(),_(A,C,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===Nn&&b(H,C),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,M,L)};function b(T,A){const C=t.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,h.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,h.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new wi(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,C,d,v,null),h.uniforms.shadow_pass.value=T.mapPass.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,C,h,v,null)}function E(T,A,C,x){let M=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)M=L;else if(M=C.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=M.uuid,z=A.uuid;let W=c[F];W===void 0&&(W={},c[F]=W);let V=W[z];V===void 0&&(V=M.clone(),W[z]=V,A.addEventListener("dispose",w)),M=V}if(M.visible=A.visible,M.wireframe=A.wireframe,x===Nn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=i.properties.get(M);F.light=C}return M}function _(T,A,C,x,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===Nn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const z=t.update(T),W=T.material;if(Array.isArray(W)){const V=z.groups;for(let Y=0,K=V.length;Y<K;Y++){const H=V[Y],st=W[H.materialIndex];if(st&&st.visible){const ut=E(T,st,x,M);T.onBeforeShadow(i,T,A,C,z,ut,H),i.renderBufferDirect(C,null,z,ut,T,H),T.onAfterShadow(i,T,A,C,z,ut,H)}}}else if(W.visible){const V=E(T,W,x,M);T.onBeforeShadow(i,T,A,C,z,V,null),i.renderBufferDirect(C,null,z,V,T,null),T.onAfterShadow(i,T,A,C,z,V,null)}}const F=T.children;for(let z=0,W=F.length;z<W;z++)_(F[z],A,C,x,M)}function w(T){T.target.removeEventListener("dispose",w);for(const C in c){const x=c[C],M=T.target.uuid;M in x&&(x[M].dispose(),delete x[M])}}}const d_={[ro]:ao,[so]:co,[oo]:uo,[ar]:lo,[ao]:ro,[co]:so,[uo]:oo,[lo]:ar};function p_(i,t){function e(){let D=!1;const nt=new de;let rt=null;const ht=new de(0,0,0,0);return{setMask:function(J){rt!==J&&!D&&(i.colorMask(J,J,J,J),rt=J)},setLocked:function(J){D=J},setClear:function(J,j,mt,Ft,ce){ce===!0&&(J*=Ft,j*=Ft,mt*=Ft),nt.set(J,j,mt,Ft),ht.equals(nt)===!1&&(i.clearColor(J,j,mt,Ft),ht.copy(nt))},reset:function(){D=!1,rt=null,ht.set(-1,0,0,0)}}}function n(){let D=!1,nt=!1,rt=null,ht=null,J=null;return{setReversed:function(j){if(nt!==j){const mt=t.get("EXT_clip_control");j?mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.ZERO_TO_ONE_EXT):mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.NEGATIVE_ONE_TO_ONE_EXT),nt=j;const Ft=J;J=null,this.setClear(Ft)}},getReversed:function(){return nt},setTest:function(j){j?Z(i.DEPTH_TEST):dt(i.DEPTH_TEST)},setMask:function(j){rt!==j&&!D&&(i.depthMask(j),rt=j)},setFunc:function(j){if(nt&&(j=d_[j]),ht!==j){switch(j){case ro:i.depthFunc(i.NEVER);break;case ao:i.depthFunc(i.ALWAYS);break;case so:i.depthFunc(i.LESS);break;case ar:i.depthFunc(i.LEQUAL);break;case oo:i.depthFunc(i.EQUAL);break;case lo:i.depthFunc(i.GEQUAL);break;case co:i.depthFunc(i.GREATER);break;case uo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ht=j}},setLocked:function(j){D=j},setClear:function(j){J!==j&&(nt&&(j=1-j),i.clearDepth(j),J=j)},reset:function(){D=!1,rt=null,ht=null,J=null,nt=!1}}}function r(){let D=!1,nt=null,rt=null,ht=null,J=null,j=null,mt=null,Ft=null,ce=null;return{setTest:function(ne){D||(ne?Z(i.STENCIL_TEST):dt(i.STENCIL_TEST))},setMask:function(ne){nt!==ne&&!D&&(i.stencilMask(ne),nt=ne)},setFunc:function(ne,Cn,bn){(rt!==ne||ht!==Cn||J!==bn)&&(i.stencilFunc(ne,Cn,bn),rt=ne,ht=Cn,J=bn)},setOp:function(ne,Cn,bn){(j!==ne||mt!==Cn||Ft!==bn)&&(i.stencilOp(ne,Cn,bn),j=ne,mt=Cn,Ft=bn)},setLocked:function(ne){D=ne},setClear:function(ne){ce!==ne&&(i.clearStencil(ne),ce=ne)},reset:function(){D=!1,nt=null,rt=null,ht=null,J=null,j=null,mt=null,Ft=null,ce=null}}}const a=new e,s=new n,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},d=new WeakMap,h=[],g=null,v=!1,m=null,p=null,b=null,E=null,_=null,w=null,T=null,A=new Rt(0,0,0),C=0,x=!1,M=null,L=null,F=null,z=null,W=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,K=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),Y=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),Y=K>=2);let st=null,ut={};const wt=i.getParameter(i.SCISSOR_BOX),$t=i.getParameter(i.VIEWPORT),le=new de().fromArray(wt),me=new de().fromArray($t);function ee(D,nt,rt,ht){const J=new Uint8Array(4),j=i.createTexture();i.bindTexture(D,j),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let mt=0;mt<rt;mt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(nt,0,i.RGBA,1,1,ht,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(nt+mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return j}const $={};$[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),s.setFunc(ar),Dt(!1),gt(nc),Z(i.CULL_FACE),ge(ti);function Z(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function dt(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Nt(D,nt){return f[D]!==nt?(i.bindFramebuffer(D,nt),f[D]=nt,D===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=nt),D===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=nt),!0):!1}function bt(D,nt){let rt=h,ht=!1;if(D){rt=d.get(nt),rt===void 0&&(rt=[],d.set(nt,rt));const J=D.textures;if(rt.length!==J.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let j=0,mt=J.length;j<mt;j++)rt[j]=i.COLOR_ATTACHMENT0+j;rt.length=J.length,ht=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,ht=!0);ht&&i.drawBuffers(rt)}function qt(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const De={[vi]:i.FUNC_ADD,[sd]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};De[ld]=i.MIN,De[cd]=i.MAX;const P={[ud]:i.ZERO,[fd]:i.ONE,[hd]:i.SRC_COLOR,[no]:i.SRC_ALPHA,[_d]:i.SRC_ALPHA_SATURATE,[gd]:i.DST_COLOR,[pd]:i.DST_ALPHA,[dd]:i.ONE_MINUS_SRC_COLOR,[io]:i.ONE_MINUS_SRC_ALPHA,[vd]:i.ONE_MINUS_DST_COLOR,[md]:i.ONE_MINUS_DST_ALPHA,[xd]:i.CONSTANT_COLOR,[yd]:i.ONE_MINUS_CONSTANT_COLOR,[Md]:i.CONSTANT_ALPHA,[bd]:i.ONE_MINUS_CONSTANT_ALPHA};function ge(D,nt,rt,ht,J,j,mt,Ft,ce,ne){if(D===ti){v===!0&&(dt(i.BLEND),v=!1);return}if(v===!1&&(Z(i.BLEND),v=!0),D!==ad){if(D!==m||ne!==x){if((p!==vi||_!==vi)&&(i.blendEquation(i.FUNC_ADD),p=vi,_=vi),ne)switch(D){case tr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ic:i.blendFunc(i.ONE,i.ONE);break;case rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ac:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case tr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ic:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case rc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ac:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}b=null,E=null,w=null,T=null,A.set(0,0,0),C=0,m=D,x=ne}return}J=J||nt,j=j||rt,mt=mt||ht,(nt!==p||J!==_)&&(i.blendEquationSeparate(De[nt],De[J]),p=nt,_=J),(rt!==b||ht!==E||j!==w||mt!==T)&&(i.blendFuncSeparate(P[rt],P[ht],P[j],P[mt]),b=rt,E=ht,w=j,T=mt),(Ft.equals(A)===!1||ce!==C)&&(i.blendColor(Ft.r,Ft.g,Ft.b,ce),A.copy(Ft),C=ce),m=D,x=!1}function zt(D,nt){D.side===Oe?dt(i.CULL_FACE):Z(i.CULL_FACE);let rt=D.side===$e;nt&&(rt=!rt),Dt(rt),D.blending===tr&&D.transparent===!1?ge(ti):ge(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),s.setFunc(D.depthFunc),s.setTest(D.depthTest),s.setMask(D.depthWrite),a.setMask(D.colorWrite);const ht=D.stencilWrite;o.setTest(ht),ht&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),vt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):dt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(D){M!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),M=D)}function gt(D){D!==id?(Z(i.CULL_FACE),D!==L&&(D===nc?i.cullFace(i.BACK):D===rd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):dt(i.CULL_FACE),L=D}function ve(D){D!==F&&(Y&&i.lineWidth(D),F=D)}function vt(D,nt,rt){D?(Z(i.POLYGON_OFFSET_FILL),(z!==nt||W!==rt)&&(i.polygonOffset(nt,rt),z=nt,W=rt)):dt(i.POLYGON_OFFSET_FILL)}function Gt(D){D?Z(i.SCISSOR_TEST):dt(i.SCISSOR_TEST)}function Ce(D){D===void 0&&(D=i.TEXTURE0+V-1),st!==D&&(i.activeTexture(D),st=D)}function be(D,nt,rt){rt===void 0&&(st===null?rt=i.TEXTURE0+V-1:rt=st);let ht=ut[rt];ht===void 0&&(ht={type:void 0,texture:void 0},ut[rt]=ht),(ht.type!==D||ht.texture!==nt)&&(st!==rt&&(i.activeTexture(rt),st=rt),i.bindTexture(D,nt||$[D]),ht.type=D,ht.texture=nt)}function R(){const D=ut[st];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Mt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function it(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function et(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ct(D){le.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),le.copy(D))}function It(D){me.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),me.copy(D))}function yt(D,nt){let rt=c.get(nt);rt===void 0&&(rt=new WeakMap,c.set(nt,rt));let ht=rt.get(D);ht===void 0&&(ht=i.getUniformBlockIndex(nt,D.name),rt.set(D,ht))}function ot(D,nt){const ht=c.get(nt).get(D);l.get(nt)!==ht&&(i.uniformBlockBinding(nt,ht,D.__bindingPointIndex),l.set(nt,ht))}function kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},st=null,ut={},f={},d=new WeakMap,h=[],g=null,v=!1,m=null,p=null,b=null,E=null,_=null,w=null,T=null,A=new Rt(0,0,0),C=0,x=!1,M=null,L=null,F=null,z=null,W=null,le.set(0,0,i.canvas.width,i.canvas.height),me.set(0,0,i.canvas.width,i.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:Z,disable:dt,bindFramebuffer:Nt,drawBuffers:bt,useProgram:qt,setBlending:ge,setMaterial:zt,setFlipSided:Dt,setCullFace:gt,setLineWidth:ve,setPolygonOffset:vt,setScissorTest:Gt,activeTexture:Ce,bindTexture:be,unbindTexture:R,compressedTexImage2D:y,compressedTexImage3D:O,texImage2D:xt,texImage3D:et,updateUBOMapping:yt,uniformBlockBinding:ot,texStorage2D:it,texStorage3D:_t,texSubImage2D:X,texSubImage3D:q,compressedTexSubImage2D:G,compressedTexSubImage3D:Mt,scissor:ct,viewport:It,reset:kt}}function m_(i,t,e,n,r,a,s){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,u=new WeakMap;let f;const d=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return h?new OffscreenCanvas(R,y):$a("canvas")}function v(R,y,O){let X=1;const q=be(R);if((q.width>O||q.height>O)&&(X=O/Math.max(q.width,q.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const G=Math.floor(X*q.width),Mt=Math.floor(X*q.height);f===void 0&&(f=g(G,Mt));const it=y?g(G,Mt):f;return it.width=G,it.height=Mt,it.getContext("2d").drawImage(R,0,0,G,Mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+G+"x"+Mt+")."),it}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function b(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(R,y,O,X,q=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let G=y;if(y===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),y===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),y===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),y===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),y===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),y===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),y===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(G=i.R11F_G11F_B10F)),y===i.RGBA){const Mt=q?Xa:te.getTransfer(X);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=Mt===ae?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function _(R,y){let O;return R?y===null||y===Ei||y===zr?O=i.DEPTH24_STENCIL8:y===wn?O=i.DEPTH32F_STENCIL8:y===Or&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Ei||y===zr?O=i.DEPTH_COMPONENT24:y===wn?O=i.DEPTH_COMPONENT32F:y===Or&&(O=i.DEPTH_COMPONENT16),O}function w(R,y){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==tn&&R.minFilter!==ln?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function T(R){const y=R.target;y.removeEventListener("dispose",T),C(y),y.isVideoTexture&&u.delete(y)}function A(R){const y=R.target;y.removeEventListener("dispose",A),M(y)}function C(R){const y=n.get(R);if(y.__webglInit===void 0)return;const O=R.source,X=d.get(O);if(X){const q=X[y.__cacheKey];q.usedTimes--,q.usedTimes===0&&x(R),Object.keys(X).length===0&&d.delete(O)}n.remove(R)}function x(R){const y=n.get(R);i.deleteTexture(y.__webglTexture);const O=R.source,X=d.get(O);delete X[y.__cacheKey],s.memory.textures--}function M(R){const y=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let q=0;q<y.__webglFramebuffer[X].length;q++)i.deleteFramebuffer(y.__webglFramebuffer[X][q]);else i.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)i.deleteFramebuffer(y.__webglFramebuffer[X]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const O=R.textures;for(let X=0,q=O.length;X<q;X++){const G=n.get(O[X]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),s.memory.textures--),n.remove(O[X])}n.remove(R)}let L=0;function F(){L=0}function z(){const R=L;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),L+=1,R}function W(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function V(R,y){const O=n.get(R);if(R.isVideoTexture&&Gt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const X=R.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(O,R,y);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+y)}function Y(R,y){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){$(O,R,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+y)}function K(R,y){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){$(O,R,y);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+y)}function H(R,y){const O=n.get(R);if(R.version>0&&O.__version!==R.version){Z(O,R,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+y)}const st={[Wa]:i.REPEAT,[Mi]:i.CLAMP_TO_EDGE,[mo]:i.MIRRORED_REPEAT},ut={[tn]:i.NEAREST,[Ld]:i.NEAREST_MIPMAP_NEAREST,[ta]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[vs]:i.LINEAR_MIPMAP_NEAREST,[Qn]:i.LINEAR_MIPMAP_LINEAR},wt={[Nd]:i.NEVER,[Hd]:i.ALWAYS,[Fd]:i.LESS,[hf]:i.LEQUAL,[Od]:i.EQUAL,[Bd]:i.GEQUAL,[zd]:i.GREATER,[kd]:i.NOTEQUAL};function $t(R,y){if(y.type===wn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===ln||y.magFilter===vs||y.magFilter===ta||y.magFilter===Qn||y.minFilter===ln||y.minFilter===vs||y.minFilter===ta||y.minFilter===Qn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,st[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,st[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,st[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ut[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ut[y.minFilter]),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,wt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===tn||y.minFilter!==ta&&y.minFilter!==Qn||y.type===wn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function le(R,y){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",T));const X=y.source;let q=d.get(X);q===void 0&&(q={},d.set(X,q));const G=W(y);if(G!==R.__cacheKey){q[G]===void 0&&(q[G]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,O=!0),q[G].usedTimes++;const Mt=q[R.__cacheKey];Mt!==void 0&&(q[R.__cacheKey].usedTimes--,Mt.usedTimes===0&&x(y)),R.__cacheKey=G,R.__webglTexture=q[G].texture}return O}function me(R,y,O){return Math.floor(Math.floor(R/O)/y)}function ee(R,y,O,X){const G=R.updateRanges;if(G.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,O,X,y.data);else{G.sort((et,ct)=>et.start-ct.start);let Mt=0;for(let et=1;et<G.length;et++){const ct=G[Mt],It=G[et],yt=ct.start+ct.count,ot=me(It.start,y.width,4),kt=me(ct.start,y.width,4);It.start<=yt+1&&ot===kt&&me(It.start+It.count-1,y.width,4)===ot?ct.count=Math.max(ct.count,It.start+It.count-ct.start):(++Mt,G[Mt]=It)}G.length=Mt+1;const it=i.getParameter(i.UNPACK_ROW_LENGTH),_t=i.getParameter(i.UNPACK_SKIP_PIXELS),xt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let et=0,ct=G.length;et<ct;et++){const It=G[et],yt=Math.floor(It.start/4),ot=Math.ceil(It.count/4),kt=yt%y.width,D=Math.floor(yt/y.width),nt=ot,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,kt,D,nt,rt,O,X,y.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,it),i.pixelStorei(i.UNPACK_SKIP_PIXELS,_t),i.pixelStorei(i.UNPACK_SKIP_ROWS,xt)}}function $(R,y,O){let X=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=i.TEXTURE_3D);const q=le(R,y),G=y.source;e.bindTexture(X,R.__webglTexture,i.TEXTURE0+O);const Mt=n.get(G);if(G.version!==Mt.__version||q===!0){e.activeTexture(i.TEXTURE0+O);const it=te.getPrimaries(te.workingColorSpace),_t=y.colorSpace===Jn?null:te.getPrimaries(y.colorSpace),xt=y.colorSpace===Jn||it===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let et=v(y.image,!1,r.maxTextureSize);et=Ce(y,et);const ct=a.convert(y.format,y.colorSpace),It=a.convert(y.type);let yt=E(y.internalFormat,ct,It,y.colorSpace,y.isVideoTexture);$t(X,y);let ot;const kt=y.mipmaps,D=y.isVideoTexture!==!0,nt=Mt.__version===void 0||q===!0,rt=G.dataReady,ht=w(y,et);if(y.isDepthTexture)yt=_(y.format===Br,y.type),nt&&(D?e.texStorage2D(i.TEXTURE_2D,1,yt,et.width,et.height):e.texImage2D(i.TEXTURE_2D,0,yt,et.width,et.height,0,ct,It,null));else if(y.isDataTexture)if(kt.length>0){D&&nt&&e.texStorage2D(i.TEXTURE_2D,ht,yt,kt[0].width,kt[0].height);for(let J=0,j=kt.length;J<j;J++)ot=kt[J],D?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,It,ot.data):e.texImage2D(i.TEXTURE_2D,J,yt,ot.width,ot.height,0,ct,It,ot.data);y.generateMipmaps=!1}else D?(nt&&e.texStorage2D(i.TEXTURE_2D,ht,yt,et.width,et.height),rt&&ee(y,et,ct,It)):e.texImage2D(i.TEXTURE_2D,0,yt,et.width,et.height,0,ct,It,et.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){D&&nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,yt,kt[0].width,kt[0].height,et.depth);for(let J=0,j=kt.length;J<j;J++)if(ot=kt[J],y.format!==Qe)if(ct!==null)if(D){if(rt)if(y.layerUpdates.size>0){const mt=kc(ot.width,ot.height,y.format,y.type);for(const Ft of y.layerUpdates){const ce=ot.data.subarray(Ft*mt/ot.data.BYTES_PER_ELEMENT,(Ft+1)*mt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Ft,ot.width,ot.height,1,ct,ce)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ot.width,ot.height,et.depth,ct,ot.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,yt,ot.width,ot.height,et.depth,0,ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ot.width,ot.height,et.depth,ct,It,ot.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,yt,ot.width,ot.height,et.depth,0,ct,It,ot.data)}else{D&&nt&&e.texStorage2D(i.TEXTURE_2D,ht,yt,kt[0].width,kt[0].height);for(let J=0,j=kt.length;J<j;J++)ot=kt[J],y.format!==Qe?ct!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,ot.data):e.compressedTexImage2D(i.TEXTURE_2D,J,yt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ot.width,ot.height,ct,It,ot.data):e.texImage2D(i.TEXTURE_2D,J,yt,ot.width,ot.height,0,ct,It,ot.data)}else if(y.isDataArrayTexture)if(D){if(nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,yt,et.width,et.height,et.depth),rt)if(y.layerUpdates.size>0){const J=kc(et.width,et.height,y.format,y.type);for(const j of y.layerUpdates){const mt=et.data.subarray(j*J/et.data.BYTES_PER_ELEMENT,(j+1)*J/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,et.width,et.height,1,ct,It,mt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,ct,It,et.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,yt,et.width,et.height,et.depth,0,ct,It,et.data);else if(y.isData3DTexture)D?(nt&&e.texStorage3D(i.TEXTURE_3D,ht,yt,et.width,et.height,et.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,ct,It,et.data)):e.texImage3D(i.TEXTURE_3D,0,yt,et.width,et.height,et.depth,0,ct,It,et.data);else if(y.isFramebufferTexture){if(nt)if(D)e.texStorage2D(i.TEXTURE_2D,ht,yt,et.width,et.height);else{let J=et.width,j=et.height;for(let mt=0;mt<ht;mt++)e.texImage2D(i.TEXTURE_2D,mt,yt,J,j,0,ct,It,null),J>>=1,j>>=1}}else if(kt.length>0){if(D&&nt){const J=be(kt[0]);e.texStorage2D(i.TEXTURE_2D,ht,yt,J.width,J.height)}for(let J=0,j=kt.length;J<j;J++)ot=kt[J],D?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ct,It,ot):e.texImage2D(i.TEXTURE_2D,J,yt,ct,It,ot);y.generateMipmaps=!1}else if(D){if(nt){const J=be(et);e.texStorage2D(i.TEXTURE_2D,ht,yt,J.width,J.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,It,et)}else e.texImage2D(i.TEXTURE_2D,0,yt,ct,It,et);m(y)&&p(X),Mt.__version=G.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Z(R,y,O){if(y.image.length!==6)return;const X=le(R,y),q=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);const G=n.get(q);if(q.version!==G.__version||X===!0){e.activeTexture(i.TEXTURE0+O);const Mt=te.getPrimaries(te.workingColorSpace),it=y.colorSpace===Jn?null:te.getPrimaries(y.colorSpace),_t=y.colorSpace===Jn||Mt===it?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const xt=y.isCompressedTexture||y.image[0].isCompressedTexture,et=y.image[0]&&y.image[0].isDataTexture,ct=[];for(let j=0;j<6;j++)!xt&&!et?ct[j]=v(y.image[j],!0,r.maxCubemapSize):ct[j]=et?y.image[j].image:y.image[j],ct[j]=Ce(y,ct[j]);const It=ct[0],yt=a.convert(y.format,y.colorSpace),ot=a.convert(y.type),kt=E(y.internalFormat,yt,ot,y.colorSpace),D=y.isVideoTexture!==!0,nt=G.__version===void 0||X===!0,rt=q.dataReady;let ht=w(y,It);$t(i.TEXTURE_CUBE_MAP,y);let J;if(xt){D&&nt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,kt,It.width,It.height);for(let j=0;j<6;j++){J=ct[j].mipmaps;for(let mt=0;mt<J.length;mt++){const Ft=J[mt];y.format!==Qe?yt!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,0,0,Ft.width,Ft.height,yt,Ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,kt,Ft.width,Ft.height,0,Ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,0,0,Ft.width,Ft.height,yt,ot,Ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt,kt,Ft.width,Ft.height,0,yt,ot,Ft.data)}}}else{if(J=y.mipmaps,D&&nt){J.length>0&&ht++;const j=be(ct[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,kt,j.width,j.height)}for(let j=0;j<6;j++)if(et){D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ct[j].width,ct[j].height,yt,ot,ct[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,kt,ct[j].width,ct[j].height,0,yt,ot,ct[j].data);for(let mt=0;mt<J.length;mt++){const ce=J[mt].image[j].image;D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,0,0,ce.width,ce.height,yt,ot,ce.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,kt,ce.width,ce.height,0,yt,ot,ce.data)}}else{D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,yt,ot,ct[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,kt,yt,ot,ct[j]);for(let mt=0;mt<J.length;mt++){const Ft=J[mt];D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,0,0,yt,ot,Ft.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,mt+1,kt,yt,ot,Ft.image[j])}}}m(y)&&p(i.TEXTURE_CUBE_MAP),G.__version=q.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function dt(R,y,O,X,q,G){const Mt=a.convert(O.format,O.colorSpace),it=a.convert(O.type),_t=E(O.internalFormat,Mt,it,O.colorSpace),xt=n.get(y),et=n.get(O);if(et.__renderTarget=y,!xt.__hasExternalTextures){const ct=Math.max(1,y.width>>G),It=Math.max(1,y.height>>G);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?e.texImage3D(q,G,_t,ct,It,y.depth,0,Mt,it,null):e.texImage2D(q,G,_t,ct,It,0,Mt,it,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,q,et.__webglTexture,0,ve(y)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,q,et.__webglTexture,G),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(R,y,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer){const X=y.depthTexture,q=X&&X.isDepthTexture?X.type:null,G=_(y.stencilBuffer,q),Mt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=ve(y);vt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,G,y.width,y.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,G,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,G,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Mt,i.RENDERBUFFER,R)}else{const X=y.textures;for(let q=0;q<X.length;q++){const G=X[q],Mt=a.convert(G.format,G.colorSpace),it=a.convert(G.type),_t=E(G.internalFormat,Mt,it,G.colorSpace),xt=ve(y);O&&vt(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt,_t,y.width,y.height):vt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt,_t,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,_t,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(y.depthTexture);X.__renderTarget=y,(!X.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),V(y.depthTexture,0);const q=X.__webglTexture,G=ve(y);if(y.depthTexture.format===kr)vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,q,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,q,0);else if(y.depthTexture.format===Br)vt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,q,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function qt(R){const y=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==R.depthTexture){const X=R.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){const q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",q)};X.addEventListener("dispose",q),y.__depthDisposeCallback=q}y.__boundDepthTexture=X}if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const X=R.texture.mipmaps;X&&X.length>0?bt(y.__webglFramebuffer[0],R):bt(y.__webglFramebuffer,R)}else if(O){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=i.createRenderbuffer(),Nt(y.__webglDepthbuffer[X],R,!1);else{const q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=y.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,G)}}else{const X=R.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Nt(y.__webglDepthbuffer,R,!1);else{const q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,G)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function De(R,y,O){const X=n.get(R);y!==void 0&&dt(X.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&qt(R)}function P(R){const y=R.texture,O=n.get(R),X=n.get(y);R.addEventListener("dispose",A);const q=R.textures,G=R.isWebGLCubeRenderTarget===!0,Mt=q.length>1;if(Mt||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=y.version,s.memory.textures++),G){O.__webglFramebuffer=[];for(let it=0;it<6;it++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[it]=[];for(let _t=0;_t<y.mipmaps.length;_t++)O.__webglFramebuffer[it][_t]=i.createFramebuffer()}else O.__webglFramebuffer[it]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let it=0;it<y.mipmaps.length;it++)O.__webglFramebuffer[it]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Mt)for(let it=0,_t=q.length;it<_t;it++){const xt=n.get(q[it]);xt.__webglTexture===void 0&&(xt.__webglTexture=i.createTexture(),s.memory.textures++)}if(R.samples>0&&vt(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let it=0;it<q.length;it++){const _t=q[it];O.__webglColorRenderbuffer[it]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[it]);const xt=a.convert(_t.format,_t.colorSpace),et=a.convert(_t.type),ct=E(_t.internalFormat,xt,et,_t.colorSpace,R.isXRRenderTarget===!0),It=ve(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,It,ct,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+it,i.RENDERBUFFER,O.__webglColorRenderbuffer[it])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),$t(i.TEXTURE_CUBE_MAP,y);for(let it=0;it<6;it++)if(y.mipmaps&&y.mipmaps.length>0)for(let _t=0;_t<y.mipmaps.length;_t++)dt(O.__webglFramebuffer[it][_t],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,_t);else dt(O.__webglFramebuffer[it],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);m(y)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let it=0,_t=q.length;it<_t;it++){const xt=q[it],et=n.get(xt);let ct=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ct=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,et.__webglTexture),$t(ct,xt),dt(O.__webglFramebuffer,R,xt,i.COLOR_ATTACHMENT0+it,ct,0),m(xt)&&p(ct)}e.unbindTexture()}else{let it=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(it=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(it,X.__webglTexture),$t(it,y),y.mipmaps&&y.mipmaps.length>0)for(let _t=0;_t<y.mipmaps.length;_t++)dt(O.__webglFramebuffer[_t],R,y,i.COLOR_ATTACHMENT0,it,_t);else dt(O.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,it,0);m(y)&&p(it),e.unbindTexture()}R.depthBuffer&&qt(R)}function ge(R){const y=R.textures;for(let O=0,X=y.length;O<X;O++){const q=y[O];if(m(q)){const G=b(R),Mt=n.get(q).__webglTexture;e.bindTexture(G,Mt),p(G),e.unbindTexture()}}}const zt=[],Dt=[];function gt(R){if(R.samples>0){if(vt(R)===!1){const y=R.textures,O=R.width,X=R.height;let q=i.COLOR_BUFFER_BIT;const G=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=n.get(R),it=y.length>1;if(it)for(let xt=0;xt<y.length;xt++)e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer);const _t=R.texture.mipmaps;_t&&_t.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let xt=0;xt<y.length;xt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),it){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[xt]);const et=n.get(y[xt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,et,0)}i.blitFramebuffer(0,0,O,X,0,0,O,X,q,i.NEAREST),l===!0&&(zt.length=0,Dt.length=0,zt.push(i.COLOR_ATTACHMENT0+xt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(zt.push(G),Dt.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,zt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),it)for(let xt=0;xt<y.length;xt++){e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[xt]);const et=n.get(y[xt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,et,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const y=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function ve(R){return Math.min(r.maxSamples,R.samples)}function vt(R){const y=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Gt(R){const y=s.render.frame;u.get(R)!==y&&(u.set(R,y),R.update())}function Ce(R,y){const O=R.colorSpace,X=R.format,q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==lr&&O!==Jn&&(te.getTransfer(O)===ae?(X!==Qe||q!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function be(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=V,this.setTexture2DArray=Y,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=De,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=vt}function g_(i,t){function e(n,r=Jn){let a;const s=te.getTransfer(r);if(n===Rn)return i.UNSIGNED_BYTE;if(n===hl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===dl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===of)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===lf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===af)return i.BYTE;if(n===sf)return i.SHORT;if(n===Or)return i.UNSIGNED_SHORT;if(n===fl)return i.INT;if(n===Ei)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===Yr)return i.HALF_FLOAT;if(n===cf)return i.ALPHA;if(n===uf)return i.RGB;if(n===Qe)return i.RGBA;if(n===kr)return i.DEPTH_COMPONENT;if(n===Br)return i.DEPTH_STENCIL;if(n===pl)return i.RED;if(n===ml)return i.RED_INTEGER;if(n===ff)return i.RG;if(n===gl)return i.RG_INTEGER;if(n===vl)return i.RGBA_INTEGER;if(n===Pa||n===La||n===Ia||n===Da)if(s===ae)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===Pa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===La)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ia)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===Pa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===La)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ia)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Da)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===go||n===vo||n===_o||n===xo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===go)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===vo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_o)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===yo||n===Mo||n===bo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===yo||n===Mo)return s===ae?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===bo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===So||n===Eo||n===wo||n===To||n===Ao||n===Ro||n===Co||n===Po||n===Lo||n===Io||n===Do||n===Uo||n===No||n===Fo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===So)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Eo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===wo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===To)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ao)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ro)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Co)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Po)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Lo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Io)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Do)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Uo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===No)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Fo)return s===ae?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Oo||n===zo||n===ko)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===Oo)return s===ae?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===zo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ko)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Bo||n===Ho||n===Go||n===Vo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===Bo)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Ho)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Go)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Vo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const v_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,__=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class x_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ef(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Bn({vertexShader:v_,fragmentShader:__,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Yt(new Ti(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class y_ extends dr{constructor(t,e){super();const n=this;let r=null,a=1,s=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,h=null,g=null;const v=typeof XRWebGLBinding<"u",m=new x_,p={},b=e.getContextAttributes();let E=null,_=null;const w=[],T=[],A=new Wt;let C=null;const x=new pn;x.viewport=new de;const M=new pn;M.viewport=new de;const L=[x,M],F=new Bp;let z=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=w[$];return Z===void 0&&(Z=new zs,w[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=w[$];return Z===void 0&&(Z=new zs,w[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=w[$];return Z===void 0&&(Z=new zs,w[$]=Z),Z.getHandSpace()};function V($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const dt=w[Z];dt!==void 0&&(dt.update($.inputSource,$.frame,c||s),dt.dispatchEvent({type:$.type,data:$.inputSource}))}function Y(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",K);for(let $=0;$<w.length;$++){const Z=T[$];Z!==null&&(T[$]=null,w[$].disconnect(Z))}z=null,W=null,m.reset();for(const $ in p)delete p[$];t.setRenderTarget(E),h=null,d=null,f=null,r=null,_=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:h},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(r,e)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(E=t.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,Nt=null,bt=null;b.depth&&(bt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=b.stencil?Br:kr,Nt=b.stencil?zr:Ei);const qt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:a};f=this.getBinding(),d=f.createProjectionLayer(qt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new wi(d.textureWidth,d.textureHeight,{format:Qe,type:Rn,depthTexture:new Sf(d.textureWidth,d.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const dt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:a};h=new XRWebGLLayer(r,e,dt),r.updateRenderState({baseLayer:h}),t.setPixelRatio(1),t.setSize(h.framebufferWidth,h.framebufferHeight,!1),_=new wi(h.framebufferWidth,h.framebufferHeight,{format:Qe,type:Rn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(o),ee.setContext(r),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const dt=$.removed[Z],Nt=T.indexOf(dt);Nt>=0&&(T[Nt]=null,w[Nt].disconnect(dt))}for(let Z=0;Z<$.added.length;Z++){const dt=$.added[Z];let Nt=T.indexOf(dt);if(Nt===-1){for(let qt=0;qt<w.length;qt++)if(qt>=T.length){T.push(dt),Nt=qt;break}else if(T[qt]===null){T[qt]=dt,Nt=qt;break}if(Nt===-1)break}const bt=w[Nt];bt&&bt.connect(dt)}}const H=new I,st=new I;function ut($,Z,dt){H.setFromMatrixPosition(Z.matrixWorld),st.setFromMatrixPosition(dt.matrixWorld);const Nt=H.distanceTo(st),bt=Z.projectionMatrix.elements,qt=dt.projectionMatrix.elements,De=bt[14]/(bt[10]-1),P=bt[14]/(bt[10]+1),ge=(bt[9]+1)/bt[5],zt=(bt[9]-1)/bt[5],Dt=(bt[8]-1)/bt[0],gt=(qt[8]+1)/qt[0],ve=De*Dt,vt=De*gt,Gt=Nt/(-Dt+gt),Ce=Gt*-Dt;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Ce),$.translateZ(Gt),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),bt[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const be=De+Gt,R=P+Gt,y=ve-Ce,O=vt+(Nt-Ce),X=ge*P/R*be,q=zt*P/R*be;$.projectionMatrix.makePerspective(y,O,X,q,be,R),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function wt($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let Z=$.near,dt=$.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(dt=m.depthFar)),F.near=M.near=x.near=Z,F.far=M.far=x.far=dt,(z!==F.near||W!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,W=F.far),F.layers.mask=$.layers.mask|6,x.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const Nt=$.parent,bt=F.cameras;wt(F,Nt);for(let qt=0;qt<bt.length;qt++)wt(bt[qt],Nt);bt.length===2?ut(F,x,M):F.projectionMatrix.copy(x.projectionMatrix),$t($,F,Nt)};function $t($,Z,dt){dt===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(dt.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Hr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&h===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function($){return p[$]};let le=null;function me($,Z){if(u=Z.getViewerPose(c||s),g=Z,u!==null){const dt=u.views;h!==null&&(t.setRenderTargetFramebuffer(_,h.framebuffer),t.setRenderTarget(_));let Nt=!1;dt.length!==F.cameras.length&&(F.cameras.length=0,Nt=!0);for(let P=0;P<dt.length;P++){const ge=dt[P];let zt=null;if(h!==null)zt=h.getViewport(ge);else{const gt=f.getViewSubImage(d,ge);zt=gt.viewport,P===0&&(t.setRenderTargetTextures(_,gt.colorTexture,gt.depthStencilTexture),t.setRenderTarget(_))}let Dt=L[P];Dt===void 0&&(Dt=new pn,Dt.layers.enable(P),Dt.viewport=new de,L[P]=Dt),Dt.matrix.fromArray(ge.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(ge.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(zt.x,zt.y,zt.width,zt.height),P===0&&(F.matrix.copy(Dt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Nt===!0&&F.cameras.push(Dt)}const bt=r.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){f=n.getBinding();const P=f.getDepthInformation(dt[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(bt&&bt.includes("camera-access")&&v){t.state.unbindTexture(),f=n.getBinding();for(let P=0;P<dt.length;P++){const ge=dt[P].camera;if(ge){let zt=p[ge];zt||(zt=new Ef,p[ge]=zt);const Dt=f.getCameraImage(ge);zt.sourceTexture=Dt}}}}for(let dt=0;dt<w.length;dt++){const Nt=T[dt],bt=w[dt];Nt!==null&&bt!==void 0&&bt.update(Nt,Z,c||s)}le&&le($,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const ee=new Af;ee.setAnimationLoop(me),this.setAnimationLoop=function($){le=$},this.dispose=function(){}}}const mi=new xn,M_=new ue;function b_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,_f(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,b,E,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),u(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&h(m,p,_)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),v(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(s(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===$e&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===$e&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),E=b.envMap,_=b.envMapRotation;E&&(m.envMap.value=E,mi.copy(_),mi.x*=-1,mi.y*=-1,mi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),m.envMapRotation.value.setFromMatrix4(M_.makeRotationFromEuler(mi)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function s(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$e&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function S_(i,t,e,n){let r={},a={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,E){const _=E.program;n.uniformBlockBinding(b,_)}function c(b,E){let _=r[b.id];_===void 0&&(g(b),_=u(b),r[b.id]=_,b.addEventListener("dispose",m));const w=E.program;n.updateUBOMapping(b,w);const T=t.render.frame;a[b.id]!==T&&(d(b),a[b.id]=T)}function u(b){const E=f();b.__bindingPointIndex=E;const _=i.createBuffer(),w=b.__size,T=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,w,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,_),_}function f(){for(let b=0;b<o;b++)if(s.indexOf(b)===-1)return s.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const E=r[b.id],_=b.uniforms,w=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let T=0,A=_.length;T<A;T++){const C=Array.isArray(_[T])?_[T]:[_[T]];for(let x=0,M=C.length;x<M;x++){const L=C[x];if(h(L,T,x,w)===!0){const F=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let W=0;for(let V=0;V<z.length;V++){const Y=z[V],K=v(Y);typeof Y=="number"||typeof Y=="boolean"?(L.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,F+W,L.__data)):Y.isMatrix3?(L.__data[0]=Y.elements[0],L.__data[1]=Y.elements[1],L.__data[2]=Y.elements[2],L.__data[3]=0,L.__data[4]=Y.elements[3],L.__data[5]=Y.elements[4],L.__data[6]=Y.elements[5],L.__data[7]=0,L.__data[8]=Y.elements[6],L.__data[9]=Y.elements[7],L.__data[10]=Y.elements[8],L.__data[11]=0):(Y.toArray(L.__data,W),W+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(b,E,_,w){const T=b.value,A=E+"_"+_;if(w[A]===void 0)return typeof T=="number"||typeof T=="boolean"?w[A]=T:w[A]=T.clone(),!0;{const C=w[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return w[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(b){const E=b.uniforms;let _=0;const w=16;for(let A=0,C=E.length;A<C;A++){const x=Array.isArray(E[A])?E[A]:[E[A]];for(let M=0,L=x.length;M<L;M++){const F=x[M],z=Array.isArray(F.value)?F.value:[F.value];for(let W=0,V=z.length;W<V;W++){const Y=z[W],K=v(Y),H=_%w,st=H%K.boundary,ut=H+st;_+=st,ut!==0&&w-ut<K.storage&&(_+=w-ut),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=K.storage}}}const T=_%w;return T>0&&(_+=w-T),b.__size=_,b.__cache={},this}function v(b){const E={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(E.boundary=4,E.storage=4):b.isVector2?(E.boundary=8,E.storage=8):b.isVector3||b.isColor?(E.boundary=16,E.storage=12):b.isVector4?(E.boundary=16,E.storage=16):b.isMatrix3?(E.boundary=48,E.storage=48):b.isMatrix4?(E.boundary=64,E.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),E}function m(b){const E=b.target;E.removeEventListener("dispose",m);const _=s.indexOf(E.__bindingPointIndex);s.splice(_,1),i.deleteBuffer(r[E.id]),delete r[E.id],delete a[E.id]}function p(){for(const b in r)i.deleteBuffer(r[b]);s=[],r={},a={}}return{bind:l,update:c,dispose:p}}class uu{constructor(t={}){const{canvas:e=rp(),context:n=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=s;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const b=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let w=!1;this._outputColorSpace=Je;let T=0,A=0,C=null,x=-1,M=null;const L=new de,F=new de;let z=null;const W=new Rt(0);let V=0,Y=e.width,K=e.height,H=1,st=null,ut=null;const wt=new de(0,0,Y,K),$t=new de(0,0,Y,K);let le=!1;const me=new El;let ee=!1,$=!1;const Z=new ue,dt=new I,Nt=new de,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qt=!1;function De(){return C===null?H:1}let P=n;function ge(S,U){return e.getContext(S,U)}try{const S={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${cl}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",ht,!1),e.addEventListener("webglcontextcreationerror",J,!1),P===null){const U="webgl2";if(P=ge(U,S),P===null)throw ge(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let zt,Dt,gt,ve,vt,Gt,Ce,be,R,y,O,X,q,G,Mt,it,_t,xt,et,ct,It,yt,ot,kt;function D(){zt=new Ug(P),zt.init(),yt=new g_(P,zt),Dt=new Ag(P,zt,t,yt),gt=new p_(P,zt),Dt.reversedDepthBuffer&&d&&gt.buffers.depth.setReversed(!0),ve=new Og(P),vt=new e_,Gt=new m_(P,zt,gt,vt,Dt,yt,ve),Ce=new Cg(_),be=new Dg(_),R=new Vp(P),ot=new wg(P,R),y=new Ng(P,R,ve,ot),O=new kg(P,y,R,ve),et=new zg(P,Dt,Gt),it=new Rg(vt),X=new t_(_,Ce,be,zt,Dt,ot,it),q=new b_(_,vt),G=new i_,Mt=new c_(zt),xt=new Eg(_,Ce,be,gt,O,h,l),_t=new h_(_,O,Dt),kt=new S_(P,ve,Dt,gt),ct=new Tg(P,zt,ve),It=new Fg(P,zt,ve),ve.programs=X.programs,_.capabilities=Dt,_.extensions=zt,_.properties=vt,_.renderLists=G,_.shadowMap=_t,_.state=gt,_.info=ve}D();const nt=new y_(_,P);this.xr=nt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const S=zt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=zt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(S){S!==void 0&&(H=S,this.setSize(Y,K,!1))},this.getSize=function(S){return S.set(Y,K)},this.setSize=function(S,U,k=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=S,K=U,e.width=Math.floor(S*H),e.height=Math.floor(U*H),k===!0&&(e.style.width=S+"px",e.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(Y*H,K*H).floor()},this.setDrawingBufferSize=function(S,U,k){Y=S,K=U,H=k,e.width=Math.floor(S*k),e.height=Math.floor(U*k),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(L)},this.getViewport=function(S){return S.copy(wt)},this.setViewport=function(S,U,k,B){S.isVector4?wt.set(S.x,S.y,S.z,S.w):wt.set(S,U,k,B),gt.viewport(L.copy(wt).multiplyScalar(H).round())},this.getScissor=function(S){return S.copy($t)},this.setScissor=function(S,U,k,B){S.isVector4?$t.set(S.x,S.y,S.z,S.w):$t.set(S,U,k,B),gt.scissor(F.copy($t).multiplyScalar(H).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(S){gt.setScissorTest(le=S)},this.setOpaqueSort=function(S){st=S},this.setTransparentSort=function(S){ut=S},this.getClearColor=function(S){return S.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,k=!0){let B=0;if(S){let N=!1;if(C!==null){const Q=C.texture.format;N=Q===vl||Q===gl||Q===ml}if(N){const Q=C.texture.type,lt=Q===Rn||Q===Ei||Q===Or||Q===zr||Q===hl||Q===dl,pt=xt.getClearColor(),ft=xt.getClearAlpha(),Lt=pt.r,Ut=pt.g,Tt=pt.b;lt?(g[0]=Lt,g[1]=Ut,g[2]=Tt,g[3]=ft,P.clearBufferuiv(P.COLOR,0,g)):(v[0]=Lt,v[1]=Ut,v[2]=Tt,v[3]=ft,P.clearBufferiv(P.COLOR,0,v))}else B|=P.COLOR_BUFFER_BIT}U&&(B|=P.DEPTH_BUFFER_BIT),k&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",ht,!1),e.removeEventListener("webglcontextcreationerror",J,!1),xt.dispose(),G.dispose(),Mt.dispose(),vt.dispose(),Ce.dispose(),be.dispose(),O.dispose(),ot.dispose(),kt.dispose(),X.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",bn),nt.removeEventListener("sessionend",Kl),li.stop()};function rt(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ht(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const S=ve.autoReset,U=_t.enabled,k=_t.autoUpdate,B=_t.needsUpdate,N=_t.type;D(),ve.autoReset=S,_t.enabled=U,_t.autoUpdate=k,_t.needsUpdate=B,_t.type=N}function J(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function j(S){const U=S.target;U.removeEventListener("dispose",j),mt(U)}function mt(S){Ft(S),vt.remove(S)}function Ft(S){const U=vt.get(S).programs;U!==void 0&&(U.forEach(function(k){X.releaseProgram(k)}),S.isShaderMaterial&&X.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,k,B,N,Q){U===null&&(U=bt);const lt=N.isMesh&&N.matrixWorld.determinant()<0,pt=jh(S,U,k,B,N);gt.setMaterial(B,lt);let ft=k.index,Lt=1;if(B.wireframe===!0){if(ft=y.getWireframeAttribute(k),ft===void 0)return;Lt=2}const Ut=k.drawRange,Tt=k.attributes.position;let jt=Ut.start*Lt,re=(Ut.start+Ut.count)*Lt;Q!==null&&(jt=Math.max(jt,Q.start*Lt),re=Math.min(re,(Q.start+Q.count)*Lt)),ft!==null?(jt=Math.max(jt,0),re=Math.min(re,ft.count)):Tt!=null&&(jt=Math.max(jt,0),re=Math.min(re,Tt.count));const ye=re-jt;if(ye<0||ye===1/0)return;ot.setup(N,B,pt,k,ft);let fe,oe=ct;if(ft!==null&&(fe=R.get(ft),oe=It,oe.setIndex(fe)),N.isMesh)B.wireframe===!0?(gt.setLineWidth(B.wireframeLinewidth*De()),oe.setMode(P.LINES)):oe.setMode(P.TRIANGLES);else if(N.isLine){let Ct=B.linewidth;Ct===void 0&&(Ct=1),gt.setLineWidth(Ct*De()),N.isLineSegments?oe.setMode(P.LINES):N.isLineLoop?oe.setMode(P.LINE_LOOP):oe.setMode(P.LINE_STRIP)}else N.isPoints?oe.setMode(P.POINTS):N.isSprite&&oe.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Gr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),oe.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(zt.get("WEBGL_multi_draw"))oe.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Ct=N._multiDrawStarts,_e=N._multiDrawCounts,Qt=N._multiDrawCount,je=ft?R.get(ft).bytesPerElement:1,Di=vt.get(B).currentProgram.getUniforms();for(let qe=0;qe<Qt;qe++)Di.setValue(P,"_gl_DrawID",qe),oe.render(Ct[qe]/je,_e[qe])}else if(N.isInstancedMesh)oe.renderInstances(jt,ye,N.count);else if(k.isInstancedBufferGeometry){const Ct=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,_e=Math.min(k.instanceCount,Ct);oe.renderInstances(jt,ye,_e)}else oe.render(jt,ye)};function ce(S,U,k){S.transparent===!0&&S.side===Oe&&S.forceSinglePass===!1?(S.side=$e,S.needsUpdate=!0,Qr(S,U,k),S.side=ri,S.needsUpdate=!0,Qr(S,U,k),S.side=Oe):Qr(S,U,k)}this.compile=function(S,U,k=null){k===null&&(k=S),p=Mt.get(k),p.init(U),E.push(p),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),S!==k&&S.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const B=new Set;return S.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const Q=N.material;if(Q)if(Array.isArray(Q))for(let lt=0;lt<Q.length;lt++){const pt=Q[lt];ce(pt,k,N),B.add(pt)}else ce(Q,k,N),B.add(Q)}),p=E.pop(),B},this.compileAsync=function(S,U,k=null){const B=this.compile(S,U,k);return new Promise(N=>{function Q(){if(B.forEach(function(lt){vt.get(lt).currentProgram.isReady()&&B.delete(lt)}),B.size===0){N(S);return}setTimeout(Q,10)}zt.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let ne=null;function Cn(S){ne&&ne(S)}function bn(){li.stop()}function Kl(){li.start()}const li=new Af;li.setAnimationLoop(Cn),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(S){ne=S,nt.setAnimationLoop(S),S===null?li.stop():li.start()},nt.addEventListener("sessionstart",bn),nt.addEventListener("sessionend",Kl),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(U),U=nt.getCamera()),S.isScene===!0&&S.onBeforeRender(_,S,U,C),p=Mt.get(S,E.length),p.init(U),E.push(p),Z.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),me.setFromProjectionMatrix(Z,Tn,U.reversedDepth),$=this.localClippingEnabled,ee=it.init(this.clippingPlanes,$),m=G.get(S,b.length),m.init(),b.push(m),nt.enabled===!0&&nt.isPresenting===!0){const Q=_.xr.getDepthSensingMesh();Q!==null&&ms(Q,U,-1/0,_.sortObjects)}ms(S,U,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(st,ut),qt=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,qt&&xt.addToRenderList(m,S),this.info.render.frame++,ee===!0&&it.beginShadows();const k=p.state.shadowsArray;_t.render(k,S,U),ee===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const Q=U.cameras;if(N.length>0)for(let lt=0,pt=Q.length;lt<pt;lt++){const ft=Q[lt];Jl(B,N,S,ft)}qt&&xt.render(S);for(let lt=0,pt=Q.length;lt<pt;lt++){const ft=Q[lt];Zl(m,S,ft,ft.viewport)}}else N.length>0&&Jl(B,N,S,U),qt&&xt.render(S),Zl(m,S,U);C!==null&&A===0&&(Gt.updateMultisampleRenderTarget(C),Gt.updateRenderTargetMipmap(C)),S.isScene===!0&&S.onAfterRender(_,S,U),ot.resetDefaultState(),x=-1,M=null,E.pop(),E.length>0?(p=E[E.length-1],ee===!0&&it.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function ms(S,U,k,B){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)k=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||me.intersectsSprite(S)){B&&Nt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Z);const lt=O.update(S),pt=S.material;pt.visible&&m.push(S,lt,pt,k,Nt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||me.intersectsObject(S))){const lt=O.update(S),pt=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Nt.copy(S.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Nt.copy(lt.boundingSphere.center)),Nt.applyMatrix4(S.matrixWorld).applyMatrix4(Z)),Array.isArray(pt)){const ft=lt.groups;for(let Lt=0,Ut=ft.length;Lt<Ut;Lt++){const Tt=ft[Lt],jt=pt[Tt.materialIndex];jt&&jt.visible&&m.push(S,lt,jt,k,Nt.z,Tt)}}else pt.visible&&m.push(S,lt,pt,k,Nt.z,null)}}const Q=S.children;for(let lt=0,pt=Q.length;lt<pt;lt++)ms(Q[lt],U,k,B)}function Zl(S,U,k,B){const N=S.opaque,Q=S.transmissive,lt=S.transparent;p.setupLightsView(k),ee===!0&&it.setGlobalState(_.clippingPlanes,k),B&&gt.viewport(L.copy(B)),N.length>0&&Jr(N,U,k),Q.length>0&&Jr(Q,U,k),lt.length>0&&Jr(lt,U,k),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function Jl(S,U,k,B){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new wi(1,1,{generateMipmaps:!0,type:zt.has("EXT_color_buffer_half_float")||zt.has("EXT_color_buffer_float")?Yr:Rn,minFilter:Qn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace}));const Q=p.state.transmissionRenderTarget[B.id],lt=B.viewport||L;Q.setSize(lt.z*_.transmissionResolutionScale,lt.w*_.transmissionResolutionScale);const pt=_.getRenderTarget(),ft=_.getActiveCubeFace(),Lt=_.getActiveMipmapLevel();_.setRenderTarget(Q),_.getClearColor(W),V=_.getClearAlpha(),V<1&&_.setClearColor(16777215,.5),_.clear(),qt&&xt.render(k);const Ut=_.toneMapping;_.toneMapping=ei;const Tt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),ee===!0&&it.setGlobalState(_.clippingPlanes,B),Jr(S,k,B),Gt.updateMultisampleRenderTarget(Q),Gt.updateRenderTargetMipmap(Q),zt.has("WEBGL_multisampled_render_to_texture")===!1){let jt=!1;for(let re=0,ye=U.length;re<ye;re++){const fe=U[re],oe=fe.object,Ct=fe.geometry,_e=fe.material,Qt=fe.group;if(_e.side===Oe&&oe.layers.test(B.layers)){const je=_e.side;_e.side=$e,_e.needsUpdate=!0,Ql(oe,k,B,Ct,_e,Qt),_e.side=je,_e.needsUpdate=!0,jt=!0}}jt===!0&&(Gt.updateMultisampleRenderTarget(Q),Gt.updateRenderTargetMipmap(Q))}_.setRenderTarget(pt,ft,Lt),_.setClearColor(W,V),Tt!==void 0&&(B.viewport=Tt),_.toneMapping=Ut}function Jr(S,U,k){const B=U.isScene===!0?U.overrideMaterial:null;for(let N=0,Q=S.length;N<Q;N++){const lt=S[N],pt=lt.object,ft=lt.geometry,Lt=lt.group;let Ut=lt.material;Ut.allowOverride===!0&&B!==null&&(Ut=B),pt.layers.test(k.layers)&&Ql(pt,U,k,ft,Ut,Lt)}}function Ql(S,U,k,B,N,Q){S.onBeforeRender(_,U,k,B,N,Q),S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(_,U,k,B,S,Q),N.transparent===!0&&N.side===Oe&&N.forceSinglePass===!1?(N.side=$e,N.needsUpdate=!0,_.renderBufferDirect(k,U,B,N,S,Q),N.side=ri,N.needsUpdate=!0,_.renderBufferDirect(k,U,B,N,S,Q),N.side=Oe):_.renderBufferDirect(k,U,B,N,S,Q),S.onAfterRender(_,U,k,B,N,Q)}function Qr(S,U,k){U.isScene!==!0&&(U=bt);const B=vt.get(S),N=p.state.lights,Q=p.state.shadowsArray,lt=N.state.version,pt=X.getParameters(S,N.state,Q,U,k),ft=X.getProgramCacheKey(pt);let Lt=B.programs;B.environment=S.isMeshStandardMaterial?U.environment:null,B.fog=U.fog,B.envMap=(S.isMeshStandardMaterial?be:Ce).get(S.envMap||B.environment),B.envMapRotation=B.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,Lt===void 0&&(S.addEventListener("dispose",j),Lt=new Map,B.programs=Lt);let Ut=Lt.get(ft);if(Ut!==void 0){if(B.currentProgram===Ut&&B.lightsStateVersion===lt)return ec(S,pt),Ut}else pt.uniforms=X.getUniforms(S),S.onBeforeCompile(pt,_),Ut=X.acquireProgram(pt,ft),Lt.set(ft,Ut),B.uniforms=pt.uniforms;const Tt=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Tt.clippingPlanes=it.uniform),ec(S,pt),B.needsLights=Kh(S),B.lightsStateVersion=lt,B.needsLights&&(Tt.ambientLightColor.value=N.state.ambient,Tt.lightProbe.value=N.state.probe,Tt.directionalLights.value=N.state.directional,Tt.directionalLightShadows.value=N.state.directionalShadow,Tt.spotLights.value=N.state.spot,Tt.spotLightShadows.value=N.state.spotShadow,Tt.rectAreaLights.value=N.state.rectArea,Tt.ltc_1.value=N.state.rectAreaLTC1,Tt.ltc_2.value=N.state.rectAreaLTC2,Tt.pointLights.value=N.state.point,Tt.pointLightShadows.value=N.state.pointShadow,Tt.hemisphereLights.value=N.state.hemi,Tt.directionalShadowMap.value=N.state.directionalShadowMap,Tt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Tt.spotShadowMap.value=N.state.spotShadowMap,Tt.spotLightMatrix.value=N.state.spotLightMatrix,Tt.spotLightMap.value=N.state.spotLightMap,Tt.pointShadowMap.value=N.state.pointShadowMap,Tt.pointShadowMatrix.value=N.state.pointShadowMatrix),B.currentProgram=Ut,B.uniformsList=null,Ut}function tc(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=Ua.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function ec(S,U){const k=vt.get(S);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function jh(S,U,k,B,N){U.isScene!==!0&&(U=bt),Gt.resetTextureUnits();const Q=U.fog,lt=B.isMeshStandardMaterial?U.environment:null,pt=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:lr,ft=(B.isMeshStandardMaterial?be:Ce).get(B.envMap||lt),Lt=B.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ut=!!k.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Tt=!!k.morphAttributes.position,jt=!!k.morphAttributes.normal,re=!!k.morphAttributes.color;let ye=ei;B.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ye=_.toneMapping);const fe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,oe=fe!==void 0?fe.length:0,Ct=vt.get(B),_e=p.state.lights;if(ee===!0&&($===!0||S!==M)){const Ge=S===M&&B.id===x;it.setState(B,S,Ge)}let Qt=!1;B.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==_e.state.version||Ct.outputColorSpace!==pt||N.isBatchedMesh&&Ct.batching===!1||!N.isBatchedMesh&&Ct.batching===!0||N.isBatchedMesh&&Ct.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ct.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ct.instancing===!1||!N.isInstancedMesh&&Ct.instancing===!0||N.isSkinnedMesh&&Ct.skinning===!1||!N.isSkinnedMesh&&Ct.skinning===!0||N.isInstancedMesh&&Ct.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ct.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ct.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ct.instancingMorph===!1&&N.morphTexture!==null||Ct.envMap!==ft||B.fog===!0&&Ct.fog!==Q||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==it.numPlanes||Ct.numIntersection!==it.numIntersection)||Ct.vertexAlphas!==Lt||Ct.vertexTangents!==Ut||Ct.morphTargets!==Tt||Ct.morphNormals!==jt||Ct.morphColors!==re||Ct.toneMapping!==ye||Ct.morphTargetsCount!==oe)&&(Qt=!0):(Qt=!0,Ct.__version=B.version);let je=Ct.currentProgram;Qt===!0&&(je=Qr(B,U,N));let Di=!1,qe=!1,_r=!1;const xe=je.getUniforms(),rn=Ct.uniforms;if(gt.useProgram(je.program)&&(Di=!0,qe=!0,_r=!0),B.id!==x&&(x=B.id,qe=!0),Di||M!==S){gt.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),xe.setValue(P,"projectionMatrix",S.projectionMatrix),xe.setValue(P,"viewMatrix",S.matrixWorldInverse);const Xe=xe.map.cameraPosition;Xe!==void 0&&Xe.setValue(P,dt.setFromMatrixPosition(S.matrixWorld)),Dt.logarithmicDepthBuffer&&xe.setValue(P,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&xe.setValue(P,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,qe=!0,_r=!0)}if(N.isSkinnedMesh){xe.setOptional(P,N,"bindMatrix"),xe.setOptional(P,N,"bindMatrixInverse");const Ge=N.skeleton;Ge&&(Ge.boneTexture===null&&Ge.computeBoneTexture(),xe.setValue(P,"boneTexture",Ge.boneTexture,Gt))}N.isBatchedMesh&&(xe.setOptional(P,N,"batchingTexture"),xe.setValue(P,"batchingTexture",N._matricesTexture,Gt),xe.setOptional(P,N,"batchingIdTexture"),xe.setValue(P,"batchingIdTexture",N._indirectTexture,Gt),xe.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&xe.setValue(P,"batchingColorTexture",N._colorsTexture,Gt));const an=k.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&et.update(N,k,je),(qe||Ct.receiveShadow!==N.receiveShadow)&&(Ct.receiveShadow=N.receiveShadow,xe.setValue(P,"receiveShadow",N.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(rn.envMap.value=ft,rn.flipEnvMap.value=ft.isCubeTexture&&ft.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&U.environment!==null&&(rn.envMapIntensity.value=U.environmentIntensity),qe&&(xe.setValue(P,"toneMappingExposure",_.toneMappingExposure),Ct.needsLights&&qh(rn,_r),Q&&B.fog===!0&&q.refreshFogUniforms(rn,Q),q.refreshMaterialUniforms(rn,B,H,K,p.state.transmissionRenderTarget[S.id]),Ua.upload(P,tc(Ct),rn,Gt)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Ua.upload(P,tc(Ct),rn,Gt),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&xe.setValue(P,"center",N.center),xe.setValue(P,"modelViewMatrix",N.modelViewMatrix),xe.setValue(P,"normalMatrix",N.normalMatrix),xe.setValue(P,"modelMatrix",N.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Ge=B.uniformsGroups;for(let Xe=0,gs=Ge.length;Xe<gs;Xe++){const ci=Ge[Xe];kt.update(ci,je),kt.bind(ci,je)}}return je}function qh(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function Kh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(S,U,k){const B=vt.get(S);B.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),vt.get(S.texture).__webglTexture=U,vt.get(S.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:k,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const k=vt.get(S);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const Zh=P.createFramebuffer();this.setRenderTarget=function(S,U=0,k=0){C=S,T=U,A=k;let B=!0,N=null,Q=!1,lt=!1;if(S){const ft=vt.get(S);if(ft.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(P.FRAMEBUFFER,null),B=!1;else if(ft.__webglFramebuffer===void 0)Gt.setupRenderTarget(S);else if(ft.__hasExternalTextures)Gt.rebindTextures(S,vt.get(S.texture).__webglTexture,vt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Tt=S.depthTexture;if(ft.__boundDepthTexture!==Tt){if(Tt!==null&&vt.has(Tt)&&(S.width!==Tt.image.width||S.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Gt.setupDepthRenderbuffer(S)}}const Lt=S.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(lt=!0);const Ut=vt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ut[U])?N=Ut[U][k]:N=Ut[U],Q=!0):S.samples>0&&Gt.useMultisampledRTT(S)===!1?N=vt.get(S).__webglMultisampledFramebuffer:Array.isArray(Ut)?N=Ut[k]:N=Ut,L.copy(S.viewport),F.copy(S.scissor),z=S.scissorTest}else L.copy(wt).multiplyScalar(H).floor(),F.copy($t).multiplyScalar(H).floor(),z=le;if(k!==0&&(N=Zh),gt.bindFramebuffer(P.FRAMEBUFFER,N)&&B&&gt.drawBuffers(S,N),gt.viewport(L),gt.scissor(F),gt.setScissorTest(z),Q){const ft=vt.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,ft.__webglTexture,k)}else if(lt){const ft=U;for(let Lt=0;Lt<S.textures.length;Lt++){const Ut=vt.get(S.textures[Lt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Lt,Ut.__webglTexture,k,ft)}}else if(S!==null&&k!==0){const ft=vt.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ft.__webglTexture,k)}x=-1},this.readRenderTargetPixels=function(S,U,k,B,N,Q,lt,pt=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ft=vt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&lt!==void 0&&(ft=ft[lt]),ft){gt.bindFramebuffer(P.FRAMEBUFFER,ft);try{const Lt=S.textures[pt],Ut=Lt.format,Tt=Lt.type;if(!Dt.textureFormatReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Dt.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-B&&k>=0&&k<=S.height-N&&(S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pt),P.readPixels(U,k,B,N,yt.convert(Ut),yt.convert(Tt),Q))}finally{const Lt=C!==null?vt.get(C).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(S,U,k,B,N,Q,lt,pt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ft=vt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&lt!==void 0&&(ft=ft[lt]),ft)if(U>=0&&U<=S.width-B&&k>=0&&k<=S.height-N){gt.bindFramebuffer(P.FRAMEBUFFER,ft);const Lt=S.textures[pt],Ut=Lt.format,Tt=Lt.type;if(!Dt.textureFormatReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Dt.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const jt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,jt),P.bufferData(P.PIXEL_PACK_BUFFER,Q.byteLength,P.STREAM_READ),S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+pt),P.readPixels(U,k,B,N,yt.convert(Ut),yt.convert(Tt),0);const re=C!==null?vt.get(C).__webglFramebuffer:null;gt.bindFramebuffer(P.FRAMEBUFFER,re);const ye=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await ap(P,ye,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,jt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Q),P.deleteBuffer(jt),P.deleteSync(ye),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,k=0){const B=Math.pow(2,-k),N=Math.floor(S.image.width*B),Q=Math.floor(S.image.height*B),lt=U!==null?U.x:0,pt=U!==null?U.y:0;Gt.setTexture2D(S,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,lt,pt,N,Q),gt.unbindTexture()};const Jh=P.createFramebuffer(),Qh=P.createFramebuffer();this.copyTextureToTexture=function(S,U,k=null,B=null,N=0,Q=null){Q===null&&(N!==0?(Gr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=N,N=0):Q=0);let lt,pt,ft,Lt,Ut,Tt,jt,re,ye;const fe=S.isCompressedTexture?S.mipmaps[Q]:S.image;if(k!==null)lt=k.max.x-k.min.x,pt=k.max.y-k.min.y,ft=k.isBox3?k.max.z-k.min.z:1,Lt=k.min.x,Ut=k.min.y,Tt=k.isBox3?k.min.z:0;else{const an=Math.pow(2,-N);lt=Math.floor(fe.width*an),pt=Math.floor(fe.height*an),S.isDataArrayTexture?ft=fe.depth:S.isData3DTexture?ft=Math.floor(fe.depth*an):ft=1,Lt=0,Ut=0,Tt=0}B!==null?(jt=B.x,re=B.y,ye=B.z):(jt=0,re=0,ye=0);const oe=yt.convert(U.format),Ct=yt.convert(U.type);let _e;U.isData3DTexture?(Gt.setTexture3D(U,0),_e=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Gt.setTexture2DArray(U,0),_e=P.TEXTURE_2D_ARRAY):(Gt.setTexture2D(U,0),_e=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const Qt=P.getParameter(P.UNPACK_ROW_LENGTH),je=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Di=P.getParameter(P.UNPACK_SKIP_PIXELS),qe=P.getParameter(P.UNPACK_SKIP_ROWS),_r=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,fe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,fe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Lt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ut),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Tt);const xe=S.isDataArrayTexture||S.isData3DTexture,rn=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const an=vt.get(S),Ge=vt.get(U),Xe=vt.get(an.__renderTarget),gs=vt.get(Ge.__renderTarget);gt.bindFramebuffer(P.READ_FRAMEBUFFER,Xe.__webglFramebuffer),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,gs.__webglFramebuffer);for(let ci=0;ci<ft;ci++)xe&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,vt.get(S).__webglTexture,N,Tt+ci),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,vt.get(U).__webglTexture,Q,ye+ci)),P.blitFramebuffer(Lt,Ut,lt,pt,jt,re,lt,pt,P.DEPTH_BUFFER_BIT,P.NEAREST);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(N!==0||S.isRenderTargetTexture||vt.has(S)){const an=vt.get(S),Ge=vt.get(U);gt.bindFramebuffer(P.READ_FRAMEBUFFER,Jh),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Qh);for(let Xe=0;Xe<ft;Xe++)xe?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,an.__webglTexture,N,Tt+Xe):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,an.__webglTexture,N),rn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ge.__webglTexture,Q,ye+Xe):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ge.__webglTexture,Q),N!==0?P.blitFramebuffer(Lt,Ut,lt,pt,jt,re,lt,pt,P.COLOR_BUFFER_BIT,P.NEAREST):rn?P.copyTexSubImage3D(_e,Q,jt,re,ye+Xe,Lt,Ut,lt,pt):P.copyTexSubImage2D(_e,Q,jt,re,Lt,Ut,lt,pt);gt.bindFramebuffer(P.READ_FRAMEBUFFER,null),gt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else rn?S.isDataTexture||S.isData3DTexture?P.texSubImage3D(_e,Q,jt,re,ye,lt,pt,ft,oe,Ct,fe.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(_e,Q,jt,re,ye,lt,pt,ft,oe,fe.data):P.texSubImage3D(_e,Q,jt,re,ye,lt,pt,ft,oe,Ct,fe):S.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Q,jt,re,lt,pt,oe,Ct,fe.data):S.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Q,jt,re,fe.width,fe.height,oe,fe.data):P.texSubImage2D(P.TEXTURE_2D,Q,jt,re,lt,pt,oe,Ct,fe);P.pixelStorei(P.UNPACK_ROW_LENGTH,Qt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,je),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Di),P.pixelStorei(P.UNPACK_SKIP_ROWS,qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,_r),Q===0&&U.generateMipmaps&&P.generateMipmap(_e),gt.unbindTexture()},this.initRenderTarget=function(S){vt.get(S).__webglFramebuffer===void 0&&Gt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Gt.setTextureCube(S,0):S.isData3DTexture?Gt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Gt.setTexture2DArray(S,0):Gt.setTexture2D(S,0),gt.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,gt.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}}function Yo(i,t){(t==null||t>i.length)&&(t=i.length);for(var e=0,n=Array(t);e<t;e++)n[e]=i[e];return n}function E_(i){if(Array.isArray(i))return i}function w_(i){if(Array.isArray(i))return Yo(i)}function T_(i,t){if(!(i instanceof t))throw new TypeError("Cannot call a class as a function")}function A_(i,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,If(n.key),n)}}function R_(i,t,e){return t&&A_(i.prototype,t),Object.defineProperty(i,"prototype",{writable:!1}),i}function Na(i,t){var e=typeof Symbol<"u"&&i[Symbol.iterator]||i["@@iterator"];if(!e){if(Array.isArray(i)||(e=Pl(i))||t){e&&(i=e);var n=0,r=function(){};return{s:r,n:function(){return n>=i.length?{done:!0}:{done:!1,value:i[n++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,s=!0,o=!1;return{s:function(){e=e.call(i)},n:function(){var l=e.next();return s=l.done,l},e:function(l){o=!0,a=l},f:function(){try{s||e.return==null||e.return()}finally{if(o)throw a}}}}function At(i,t,e){return(t=If(t))in i?Object.defineProperty(i,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):i[t]=e,i}function C_(i){if(typeof Symbol<"u"&&i[Symbol.iterator]!=null||i["@@iterator"]!=null)return Array.from(i)}function P_(i,t){var e=i==null?null:typeof Symbol<"u"&&i[Symbol.iterator]||i["@@iterator"];if(e!=null){var n,r,a,s,o=[],l=!0,c=!1;try{if(a=(e=e.call(i)).next,t===0){if(Object(e)!==e)return;l=!1}else for(;!(l=(n=a.call(e)).done)&&(o.push(n.value),o.length!==t);l=!0);}catch(u){c=!0,r=u}finally{try{if(!l&&e.return!=null&&(s=e.return(),Object(s)!==s))return}finally{if(c)throw r}}return o}}function L_(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function I_(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function fu(i,t){var e=Object.keys(i);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(i);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(i,r).enumerable})),e.push.apply(e,n)}return e}function tt(i){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?fu(Object(e),!0).forEach(function(n){At(i,n,e[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(e)):fu(Object(e)).forEach(function(n){Object.defineProperty(i,n,Object.getOwnPropertyDescriptor(e,n))})}return i}function ss(i,t){return E_(i)||P_(i,t)||Pl(i,t)||L_()}function Mn(i){return w_(i)||C_(i)||Pl(i)||I_()}function D_(i,t){if(typeof i!="object"||!i)return i;var e=i[Symbol.toPrimitive];if(e!==void 0){var n=e.call(i,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(i)}function If(i){var t=D_(i,"string");return typeof t=="symbol"?t:t+""}function Ka(i){"@babel/helpers - typeof";return Ka=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ka(i)}function Pl(i,t){if(i){if(typeof i=="string")return Yo(i,t);var e={}.toString.call(i).slice(8,-1);return e==="Object"&&i.constructor&&(e=i.constructor.name),e==="Map"||e==="Set"?Array.from(i):e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?Yo(i,t):void 0}}var hu=function(){},Ll={},Df={},Uf=null,Nf={mark:hu,measure:hu};try{typeof window<"u"&&(Ll=window),typeof document<"u"&&(Df=document),typeof MutationObserver<"u"&&(Uf=MutationObserver),typeof performance<"u"&&(Nf=performance)}catch{}var U_=Ll.navigator||{},du=U_.userAgent,pu=du===void 0?"":du,ai=Ll,pe=Df,mu=Uf,Ea=Nf;ai.document;var Vn=!!pe.documentElement&&!!pe.head&&typeof pe.addEventListener=="function"&&typeof pe.createElement=="function",Ff=~pu.indexOf("MSIE")||~pu.indexOf("Trident/"),wa,N_=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,F_=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,Of={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},"slab-duo":{"fa-regular":"regular",fasldr:"regular"},"slab-press-duo":{"fa-regular":"regular",faslpdr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},vellum:{"fa-solid":"solid",favs:"solid"},pixel:{"fa-regular":"regular",fapr:"regular"},mosaic:{"fa-solid":"solid",fams:"solid"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},O_={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},zf=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],Ie="classic",qr="duotone",kf="sharp",Bf="sharp-duotone",Hf="chisel",Gf="etch",Vf="graphite",Wf="jelly",Xf="jelly-duo",Yf="jelly-fill",$f="mosaic",jf="notdog",qf="notdog-duo",Kf="pixel",Zf="slab",Jf="slab-duo",Qf="slab-press",th="slab-press-duo",eh="thumbprint",nh="utility",ih="utility-duo",rh="utility-fill",ah="vellum",sh="whiteboard",z_="Classic",k_="Duotone",B_="Sharp",H_="Sharp Duotone",G_="Chisel",V_="Etch",W_="Graphite",X_="Jelly",Y_="Jelly Duo",$_="Jelly Fill",j_="Mosaic",q_="Notdog",K_="Notdog Duo",Z_="Pixel",J_="Slab",Q_="Slab Duo",tx="Slab Press",ex="Slab Press Duo",nx="Thumbprint",ix="Utility",rx="Utility Duo",ax="Utility Fill",sx="Vellum",ox="Whiteboard",oh=[Ie,qr,kf,Bf,Hf,Gf,Vf,Wf,Xf,Yf,$f,jf,qf,Kf,Zf,Jf,Qf,th,eh,nh,ih,rh,ah,sh];wa={},At(At(At(At(At(At(At(At(At(At(wa,Ie,z_),qr,k_),kf,B_),Bf,H_),Hf,G_),Gf,V_),Vf,W_),Wf,X_),Xf,Y_),Yf,$_),At(At(At(At(At(At(At(At(At(At(wa,$f,j_),jf,q_),qf,K_),Kf,Z_),Zf,J_),Jf,Q_),Qf,tx),th,ex),eh,nx),nh,ix),At(At(At(At(wa,ih,rx),rh,ax),ah,sx),sh,ox);var lx={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},"slab-duo":{400:"fasldr"},"slab-press-duo":{400:"faslpdr"},vellum:{900:"favs"},mosaic:{900:"fams"},pixel:{400:"fapr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},cx={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Slab Duo":{400:"fasldr",normal:"fasldr"},"Font Awesome 7 Slab Press Duo":{400:"faslpdr",normal:"faslpdr"},"Font Awesome 7 Pixel":{400:"fapr",normal:"fapr"},"Font Awesome 7 Mosaic":{900:"fams",normal:"fams"},"Font Awesome 7 Vellum":{900:"favs",normal:"favs"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},ux=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["mosaic",{defaultShortPrefixId:"fams",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["pixel",{defaultShortPrefixId:"fapr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-duo",{defaultShortPrefixId:"fasldr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press-duo",{defaultShortPrefixId:"faslpdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["vellum",{defaultShortPrefixId:"favs",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),fx={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},mosaic:{solid:"fams"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},pixel:{regular:"fapr"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-duo":{regular:"fasldr"},"slab-press":{regular:"faslpr"},"slab-press-duo":{regular:"faslpdr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},vellum:{solid:"favs"},whiteboard:{semibold:"fawsb"}},lh=["fak","fa-kit","fakd","fa-kit-duotone"],gu={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},hx=["kit"],dx="kit",px="kit-duotone",mx="Kit",gx="Kit Duotone";At(At({},dx,mx),px,gx);var vx={kit:{"fa-kit":"fak"}},_x={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},xx={kit:{fak:"fa-kit"}},vu={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Ta,Aa={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},yx=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],Mx="classic",bx="duotone",Sx="sharp",Ex="sharp-duotone",wx="chisel",Tx="etch",Ax="graphite",Rx="jelly",Cx="jelly-duo",Px="jelly-fill",Lx="mosaic",Ix="notdog",Dx="notdog-duo",Ux="pixel",Nx="slab",Fx="slab-duo",Ox="slab-press",zx="slab-press-duo",kx="thumbprint",Bx="utility",Hx="utility-duo",Gx="utility-fill",Vx="vellum",Wx="whiteboard",Xx="Classic",Yx="Duotone",$x="Sharp",jx="Sharp Duotone",qx="Chisel",Kx="Etch",Zx="Graphite",Jx="Jelly",Qx="Jelly Duo",t1="Jelly Fill",e1="Mosaic",n1="Notdog",i1="Notdog Duo",r1="Pixel",a1="Slab",s1="Slab Duo",o1="Slab Press",l1="Slab Press Duo",c1="Thumbprint",u1="Utility",f1="Utility Duo",h1="Utility Fill",d1="Vellum",p1="Whiteboard";Ta={},At(At(At(At(At(At(At(At(At(At(Ta,Mx,Xx),bx,Yx),Sx,$x),Ex,jx),wx,qx),Tx,Kx),Ax,Zx),Rx,Jx),Cx,Qx),Px,t1),At(At(At(At(At(At(At(At(At(At(Ta,Lx,e1),Ix,n1),Dx,i1),Ux,r1),Nx,a1),Fx,s1),Ox,o1),zx,l1),kx,c1),Bx,u1),At(At(At(At(Ta,Hx,f1),Gx,h1),Vx,d1),Wx,p1);var m1="kit",g1="kit-duotone",v1="Kit",_1="Kit Duotone";At(At({},m1,v1),g1,_1);var x1={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},"slab-duo":{"fa-regular":"fasldr"},"slab-press-duo":{"fa-regular":"faslpdr"},pixel:{"fa-regular":"fapr"},mosaic:{"fa-solid":"fams"},vellum:{"fa-solid":"favs"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},y1={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],"slab-duo":["fasldr"],"slab-press-duo":["faslpdr"],pixel:["fapr"],mosaic:["fams"],vellum:["favs"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},$o={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},"slab-duo":{fasldr:"fa-regular"},"slab-press-duo":{faslpdr:"fa-regular"},pixel:{fapr:"fa-regular"},mosaic:{fams:"fa-solid"},vellum:{favs:"fa-solid"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},M1=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],ch=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fasldr","faslpdr","fapr","fams","favs","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(yx,M1),b1=["solid","regular","light","thin","duotone","brands","semibold"],uh=[1,2,3,4,5,6,7,8,9,10],S1=uh.concat([11,12,13,14,15,16,17,18,19,20]),E1=["aw","fw","pull-left","pull-right"],w1=[].concat(Mn(Object.keys(y1)),b1,E1,["2xs","xs","sm","lg","xl","2xl","beat","beat-fade","border","bounce","buzz","canvas-square","canvas-roomy","fade","flip-360","flip-both","flip-horizontal","flip-vertical","flip","float","inverse","jello","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","spin-snap","spin-snap-4","spin-snap-8","stack-1x","stack-2x","stack","swing","ul","wag","width-auto","width-fixed",Aa.GROUP,Aa.SWAP_OPACITY,Aa.PRIMARY,Aa.SECONDARY]).concat(uh.map(function(i){return"".concat(i,"x")})).concat(S1.map(function(i){return"w-".concat(i)})),T1={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},Hn="___FONT_AWESOME___",jo=16,fh="fa",hh="svg-inline--fa",Ai="data-fa-i2svg",qo="data-fa-pseudo-element",A1="data-fa-pseudo-element-pending",Il="data-prefix",Dl="data-icon",_u="fontawesome-i2svg",R1="async",C1=["HTML","HEAD","STYLE","SCRIPT"],dh=["::before","::after",":before",":after"],ph=(function(){try{return!0}catch{return!1}})();function Kr(i){return new Proxy(i,{get:function(e,n){return n in e?e[n]:e[Ie]}})}var mh=tt({},Of);mh[Ie]=tt(tt(tt(tt({},{"fa-duotone":"duotone"}),Of[Ie]),gu.kit),gu["kit-duotone"]);var P1=Kr(mh),Ko=tt({},fx);Ko[Ie]=tt(tt(tt(tt({},{duotone:"fad"}),Ko[Ie]),vu.kit),vu["kit-duotone"]);var xu=Kr(Ko),Zo=tt({},$o);Zo[Ie]=tt(tt({},Zo[Ie]),xx.kit);var Ul=Kr(Zo),Jo=tt({},x1);Jo[Ie]=tt(tt({},Jo[Ie]),vx.kit);Kr(Jo);var L1=N_,gh="fa-layers-text",I1=F_,D1=tt({},lx);Kr(D1);var U1=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],js=O_,N1=[].concat(Mn(hx),Mn(w1)),Ir=ai.FontAwesomeConfig||{};function F1(i){var t=pe.querySelector("script["+i+"]");if(t)return t.getAttribute(i)}function O1(i){return i===""?!0:i==="false"?!1:i==="true"?!0:i}if(pe&&typeof pe.querySelector=="function"){var z1=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];z1.forEach(function(i){var t=ss(i,2),e=t[0],n=t[1],r=O1(F1(e));r!=null&&(Ir[n]=r)})}var vh={styleDefault:"solid",familyDefault:Ie,cssPrefix:fh,replacementClass:hh,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Ir.familyPrefix&&(Ir.cssPrefix=Ir.familyPrefix);var ur=tt(tt({},vh),Ir);ur.autoReplaceSvg||(ur.observeMutations=!1);var Et={};Object.keys(vh).forEach(function(i){Object.defineProperty(Et,i,{enumerable:!0,set:function(e){ur[i]=e,Dr.forEach(function(n){return n(Et)})},get:function(){return ur[i]}})});Object.defineProperty(Et,"familyPrefix",{enumerable:!0,set:function(t){ur.cssPrefix=t,Dr.forEach(function(e){return e(Et)})},get:function(){return ur.cssPrefix}});ai.FontAwesomeConfig=Et;var Dr=[];function k1(i){return Dr.push(i),function(){Dr.splice(Dr.indexOf(i),1)}}var qi=jo,An={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function B1(i){if(!(!i||!Vn)){var t=pe.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=i;for(var e=pe.head.childNodes,n=null,r=e.length-1;r>-1;r--){var a=e[r],s=(a.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(s)>-1&&(n=a)}return pe.head.insertBefore(t,n),i}}var H1="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function yu(){for(var i=12,t="";i-- >0;)t+=H1[Math.random()*62|0];return t}function vr(i){for(var t=[],e=(i||[]).length>>>0;e--;)t[e]=i[e];return t}function Nl(i){return i.classList?vr(i.classList):(i.getAttribute("class")||"").split(" ").filter(function(t){return t})}function _h(i){return"".concat(i).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function G1(i){return Object.keys(i||{}).reduce(function(t,e){return t+"".concat(e,'="').concat(_h(i[e]),'" ')},"").trim()}function os(i){return Object.keys(i||{}).reduce(function(t,e){return t+"".concat(e,": ").concat(i[e].trim(),";")},"")}function Fl(i){return i.size!==An.size||i.x!==An.x||i.y!==An.y||i.rotate!==An.rotate||i.flipX||i.flipY}function V1(i){var t=i.transform,e=i.containerWidth,n=i.iconWidth,r={transform:"translate(".concat(e/2," 256)")},a="translate(".concat(t.x*32,", ").concat(t.y*32,") "),s="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),o="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(a," ").concat(s," ").concat(o)},c={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:l,path:c}}function W1(i){var t=i.transform,e=i.width,n=e===void 0?jo:e,r=i.height,a=r===void 0?jo:r,s="";return Ff?s+="translate(".concat(t.x/qi-n/2,"em, ").concat(t.y/qi-a/2,"em) "):s+="translate(calc(-50% + ".concat(t.x/qi,"em), calc(-50% + ").concat(t.y/qi,"em)) "),s+="scale(".concat(t.size/qi*(t.flipX?-1:1),", ").concat(t.size/qi*(t.flipY?-1:1),") "),s+="rotate(".concat(t.rotate,"deg) "),s}var X1=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-slab-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Duo';
  --fa-font-slab-press-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Press Duo';
  --fa-font-pixel-regular: normal 400 1em/1 'Font Awesome 7 Pixel';
  --fa-font-mosaic-solid: normal 900 1em/1 'Font Awesome 7 Mosaic';
  --fa-font-vellum-solid: normal 900 1em/1 'Font Awesome 7 Vellum';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-canvas-square {
  padding-block: 0.125em;
  margin-block-end: -0.125em;
}

.fa-canvas-roomy {
  padding-block: 0.25em;
  padding-inline: 0.125em;
  margin-block-end: -0.25em;
  box-sizing: content-box;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.5s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip-360 {
  animation-name: fa-flip-360;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.75s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

.fa-spin-snap {
  animation-name: fa-spin-snap;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-4 {
  animation-name: fa-spin-snap-4;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2.4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-8 {
  animation-name: fa-spin-snap-8;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-buzz {
  animation-name: fa-buzz;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.6s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-wag {
  animation-name: fa-wag;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: bottom center;
}

.fa-float {
  animation-name: fa-float;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
  will-change: transform;
}

.fa-swing {
  animation-name: fa-swing;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: top center;
}

.fa-jello {
  animation-name: fa-jello;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-flip-360,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse,
  .fa-buzz,
  .fa-float,
  .fa-jello,
  .fa-spin-snap,
  .fa-spin-snap-4,
  .fa-spin-snap-8,
  .fa-swing,
  .fa-wag {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  45% {
    transform: scale(calc(1.22 * var(--fa-beat-scale, 1.22)));
  }
  65% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  90% {
    transform: scale(1);
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
    animation-timing-function: var(--fa-animation-timing);
  }
  14% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.06), var(--fa-bounce-start-scale-y, 0.94)) translateY(var(--fa-bounce-anticipation, 3px));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  32% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.94), var(--fa-bounce-jump-scale-y, 1.12)) translateY(calc(-1 * var(--fa-bounce-height, 0.5em)));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  52% {
    transform: scale(1, 1) translateY(calc(-1 * var(--fa-bounce-height, 0.5em) * 1.1));
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  70% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.06), var(--fa-bounce-land-scale-y, 0.92)) translateY(0);
    animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
  }
  85% {
    transform: scale(0.98, 1.04) translateY(calc(-2px * var(--fa-bounce-rebound, 1)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  0% {
    opacity: 1;
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  40% {
    opacity: var(--fa-fade-opacity, 0.4);
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fa-beat-fade {
  0% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  25% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  45% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  65% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
}
@keyframes fa-flip {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  35% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: linear;
  }
  65% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.5));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  92% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-flip-360 {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  50% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  80% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(35deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  20% {
    transform: rotate(-22deg) translateX(-1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  35% {
    transform: rotate(15deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  50% {
    transform: rotate(-9deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  65% {
    transform: rotate(5deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  78% {
    transform: rotate(-3deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  90% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  12% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  16.67% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  28.67% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  33.33% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  45.33% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  62% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  66.67% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  78.67% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  83.33% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  95.33% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-4 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  15% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  40% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  65% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  90% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-8 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  9% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  12.5% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  21.5% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  34% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  37.5% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  46.5% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  59% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  62.5% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  71.5% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  84% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  87.5% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  96.5% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-buzz {
  0% {
    transform: translateX(0) rotate(0deg);
    animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
  }
  5% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.5deg);
  }
  10% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.5deg);
  }
  15% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.3deg);
  }
  20% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.3deg);
  }
  25% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.7)) rotate(0.2deg);
  }
  30% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
  }
  35% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.4)) rotate(0.1deg);
  }
  40% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
@keyframes fa-wag {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  12% {
    transform: rotate(var(--fa-wag-angle, 12deg));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  24% {
    transform: rotate(2deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  36% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.85));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  48% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  58% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.6));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  15% {
    transform: translateY(calc(-0.4 * var(--fa-float-height, 6px))) translateX(var(--fa-float-drift, 1px)) rotate(var(--fa-float-tilt, 1deg)) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  35% {
    transform: translateY(calc(-1 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x, 0.98), var(--fa-float-stretch-y, 1.03));
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
  }
  50% {
    transform: translateY(calc(-0.92 * var(--fa-float-height, 6px))) translateX(calc(-0.5 * var(--fa-float-drift, 1px))) rotate(calc(-0.5 * var(--fa-float-tilt, 1deg))) scale(0.995, 1.01);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  70% {
    transform: translateY(calc(-0.3 * var(--fa-float-height, 6px))) translateX(calc(-1 * var(--fa-float-drift, 1px))) rotate(calc(-1 * var(--fa-float-tilt, 1deg))) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  90% {
    transform: translateY(calc(0.05 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
  }
}
@keyframes fa-swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(var(--fa-swing-angle, 22deg));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  18% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.85));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  28% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.65));
    animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
  }
  38% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.45));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  56% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.1));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  64% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-jello {
  0% {
    transform: scale(1, 1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  12% {
    transform: scale(var(--fa-jello-scale-x, 1.15), calc(2 - var(--fa-jello-scale-x, 1.15)));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  24% {
    transform: scale(calc(2 - var(--fa-jello-scale-y, 1.12)), var(--fa-jello-scale-y, 1.12));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  36% {
    transform: scale(calc(1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5), calc(2 - (1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5)));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: scale(calc(2 - (1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3)), calc(1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  58% {
    transform: scale(1.02, 0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function xh(){var i=fh,t=hh,e=Et.cssPrefix,n=Et.replacementClass,r=X1;if(e!==i||n!==t){var a=new RegExp("\\.".concat(i,"\\-"),"g"),s=new RegExp("\\--".concat(i,"\\-"),"g"),o=new RegExp("\\.".concat(t),"g");r=r.replace(a,".".concat(e,"-")).replace(s,"--".concat(e,"-")).replace(o,".".concat(n))}return r}var Mu=!1;function qs(){Et.autoAddCss&&!Mu&&(B1(xh()),Mu=!0)}var Y1={mixout:function(){return{dom:{css:xh,insertCss:qs}}},hooks:function(){return{beforeDOMElementCreation:function(){qs()},beforeI2svg:function(){qs()}}}},Gn=ai||{};Gn[Hn]||(Gn[Hn]={});Gn[Hn].styles||(Gn[Hn].styles={});Gn[Hn].hooks||(Gn[Hn].hooks={});Gn[Hn].shims||(Gn[Hn].shims=[]);var vn=Gn[Hn],yh=[],Mh=function(){pe.removeEventListener("DOMContentLoaded",Mh),Za=1,yh.map(function(t){return t()})},Za=!1;Vn&&(Za=(pe.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(pe.readyState),Za||pe.addEventListener("DOMContentLoaded",Mh));function $1(i){Vn&&(Za?setTimeout(i,0):yh.push(i))}function Zr(i){var t=i.tag,e=i.attributes,n=e===void 0?{}:e,r=i.children,a=r===void 0?[]:r;return typeof i=="string"?_h(i):"<".concat(t," ").concat(G1(n),">").concat(a.map(Zr).join(""),"</").concat(t,">")}function bu(i,t,e){if(i&&i[t]&&i[t][e])return{prefix:t,iconName:e,icon:i[t][e]}}var Ks=function(t,e,n,r){var a=Object.keys(t),s=a.length,o=e,l,c,u;for(n===void 0?(l=1,u=t[a[0]]):(l=0,u=n);l<s;l++)c=a[l],u=o(u,t[c],c,t);return u};function bh(i){return Mn(i).length!==1?null:i.codePointAt(0).toString(16)}function Su(i){return Object.keys(i).reduce(function(t,e){var n=i[e],r=!!n.icon;return r?t[n.iconName]=n.icon:t[e]=n,t},{})}function Qo(i,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=e.skipHooks,r=n===void 0?!1:n,a=Su(t);typeof vn.hooks.addPack=="function"&&!r?vn.hooks.addPack(i,Su(t)):vn.styles[i]=tt(tt({},vn.styles[i]||{}),a),i==="fas"&&Qo("fa",t)}var Wr=vn.styles,j1=vn.shims,Sh=Object.keys(Ul),q1=Sh.reduce(function(i,t){return i[t]=Object.keys(Ul[t]),i},{}),Ol=null,Eh={},wh={},Th={},Ah={},Rh={};function K1(i){return~N1.indexOf(i)}function Z1(i,t){var e=t.split("-"),n=e[0],r=e.slice(1).join("-");return n===i&&r!==""&&!K1(r)?r:null}var Ch=function(){var t=function(a){return Ks(Wr,function(s,o,l){return s[l]=Ks(o,a,{}),s},{})};Eh=t(function(r,a,s){if(a[3]&&(r[a[3]]=s),a[2]){var o=a[2].filter(function(l){return typeof l=="number"});o.forEach(function(l){r[l.toString(16)]=s})}return r}),wh=t(function(r,a,s){if(r[s]=s,a[2]){var o=a[2].filter(function(l){return typeof l=="string"});o.forEach(function(l){r[l]=s})}return r}),Rh=t(function(r,a,s){var o=a[2];return r[s]=s,o.forEach(function(l){r[l]=s}),r});var e="far"in Wr||Et.autoFetchSvg,n=Ks(j1,function(r,a){var s=a[0],o=a[1],l=a[2];return o==="far"&&!e&&(o="fas"),typeof s=="string"&&(r.names[s]={prefix:o,iconName:l}),typeof s=="number"&&(r.unicodes[s.toString(16)]={prefix:o,iconName:l}),r},{names:{},unicodes:{}});Th=n.names,Ah=n.unicodes,Ol=ls(Et.styleDefault,{family:Et.familyDefault})};k1(function(i){Ol=ls(i.styleDefault,{family:Et.familyDefault})});Ch();function zl(i,t){return(Eh[i]||{})[t]}function J1(i,t){return(wh[i]||{})[t]}function bi(i,t){return(Rh[i]||{})[t]}function Ph(i){return Th[i]||{prefix:null,iconName:null}}function Q1(i){var t=Ah[i],e=zl("fas",i);return t||(e?{prefix:"fas",iconName:e}:null)||{prefix:null,iconName:null}}function si(){return Ol}var Lh=function(){return{prefix:null,iconName:null,rest:[]}};function ty(i){var t=Ie,e=Sh.reduce(function(n,r){return n[r]="".concat(Et.cssPrefix,"-").concat(r),n},{});return oh.forEach(function(n){(i.includes(e[n])||i.some(function(r){return q1[n].includes(r)}))&&(t=n)}),t}function ls(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.family,n=e===void 0?Ie:e,r=P1[n][i];if(n===qr&&!i)return"fad";var a=xu[n][i]||xu[n][r],s=i in vn.styles?i:null,o=a||s||null;return o}function ey(i){var t=[],e=null;return i.forEach(function(n){var r=Z1(Et.cssPrefix,n);r?e=r:n&&t.push(n)}),{iconName:e,rest:t}}function Eu(i){return i.sort().filter(function(t,e,n){return n.indexOf(t)===e})}var wu=ch.concat(lh);function cs(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.skipLookups,n=e===void 0?!1:e,r=null,a=Eu(i.filter(function(h){return wu.includes(h)})),s=Eu(i.filter(function(h){return!wu.includes(h)})),o=a.filter(function(h){return r=h,!zf.includes(h)}),l=ss(o,1),c=l[0],u=c===void 0?null:c,f=ty(a),d=tt(tt({},ey(s)),{},{prefix:ls(u,{family:f})});return tt(tt(tt({},d),ay({values:i,family:f,styles:Wr,config:Et,canonical:d,givenPrefix:r})),ny(n,r,d))}function ny(i,t,e){var n=e.prefix,r=e.iconName;if(i||!n||!r)return{prefix:n,iconName:r};var a=t==="fa"?Ph(r):{},s=bi(n,r);return r=a.iconName||s||r,n=a.prefix||n,n==="far"&&!Wr.far&&Wr.fas&&!Et.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var iy=oh.filter(function(i){return i!==Ie||i!==qr}),ry=Object.keys($o).filter(function(i){return i!==Ie}).map(function(i){return Object.keys($o[i])}).flat();function ay(i){var t=i.values,e=i.family,n=i.canonical,r=i.givenPrefix,a=r===void 0?"":r,s=i.styles,o=s===void 0?{}:s,l=i.config,c=l===void 0?{}:l,u=e===qr,f=t.includes("fa-duotone")||t.includes("fad"),d=c.familyDefault==="duotone",h=n.prefix==="fad"||n.prefix==="fa-duotone";if(!u&&(f||d||h)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&iy.includes(e)){var g=Object.keys(o).find(function(m){return ry.includes(m)});if(g||c.autoFetchSvg){var v=ux.get(e).defaultShortPrefixId;n.prefix=v,n.iconName=bi(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||a==="fa")&&(n.prefix=si()||"fas"),n}var sy=(function(){function i(){T_(this,i),this.definitions={}}return R_(i,[{key:"add",value:function(){for(var e=this,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];var s=r.reduce(this._pullDefinitions,{});Object.keys(s).forEach(function(o){e.definitions[o]=tt(tt({},e.definitions[o]||{}),s[o]),Qo(o,s[o]);var l=Ul[Ie][o];l&&Qo(l,s[o]),Ch()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(e,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(a){var s=r[a],o=s.prefix,l=s.iconName,c=s.icon,u=c[2];e[o]||(e[o]={}),u.length>0&&u.forEach(function(f){typeof f=="string"&&(e[o][f]=c)}),e[o][l]=c}),e}}])})(),Tu=[],Qi={},nr={},oy=Object.keys(nr);function ly(i,t){var e=t.mixoutsTo;return Tu=i,Qi={},Object.keys(nr).forEach(function(n){oy.indexOf(n)===-1&&delete nr[n]}),Tu.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(s){typeof r[s]=="function"&&(e[s]=r[s]),Ka(r[s])==="object"&&Object.keys(r[s]).forEach(function(o){e[s]||(e[s]={}),e[s][o]=r[s][o]})}),n.hooks){var a=n.hooks();Object.keys(a).forEach(function(s){Qi[s]||(Qi[s]=[]),Qi[s].push(a[s])})}n.provides&&n.provides(nr)}),e}function tl(i,t){for(var e=arguments.length,n=new Array(e>2?e-2:0),r=2;r<e;r++)n[r-2]=arguments[r];var a=Qi[i]||[];return a.forEach(function(s){t=s.apply(null,[t].concat(n))}),t}function Ri(i){for(var t=arguments.length,e=new Array(t>1?t-1:0),n=1;n<t;n++)e[n-1]=arguments[n];var r=Qi[i]||[];r.forEach(function(a){a.apply(null,e)})}function oi(){var i=arguments[0],t=Array.prototype.slice.call(arguments,1);return nr[i]?nr[i].apply(null,t):void 0}function el(i){i.prefix==="fa"&&(i.prefix="fas");var t=i.iconName,e=i.prefix||si();if(t)return t=bi(e,t)||t,bu(Ih.definitions,e,t)||bu(vn.styles,e,t)}var Ih=new sy,cy=function(){Et.autoReplaceSvg=!1,Et.observeMutations=!1,Ri("noAuto")},uy={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Vn?(Ri("beforeI2svg",t),oi("pseudoElements2svg",t),oi("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=t.autoReplaceSvgRoot;Et.autoReplaceSvg===!1&&(Et.autoReplaceSvg=!0),Et.observeMutations=!0,$1(function(){hy({autoReplaceSvgRoot:e}),Ri("watch",t)})}},fy={icon:function(t){if(t===null)return null;if(Ka(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:bi(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=ls(t[0]);return{prefix:n,iconName:bi(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(Et.cssPrefix,"-"))>-1||t.match(L1))){var r=cs(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||si(),iconName:bi(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var a=si();return{prefix:a,iconName:bi(a,t)||t}}}},nn={noAuto:cy,config:Et,dom:uy,parse:fy,library:Ih,findIconDefinition:el,toHtml:Zr},hy=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=t.autoReplaceSvgRoot,n=e===void 0?pe:e;(Object.keys(vn.styles).length>0||Et.autoFetchSvg)&&Vn&&Et.autoReplaceSvg&&nn.dom.i2svg({node:n})};function us(i,t){return Object.defineProperty(i,"abstract",{get:t}),Object.defineProperty(i,"html",{get:function(){return i.abstract.map(function(n){return Zr(n)})}}),Object.defineProperty(i,"node",{get:function(){if(Vn){var n=pe.createElement("div");return n.innerHTML=i.html,n.children}}}),i}function dy(i){var t=i.children,e=i.main,n=i.mask,r=i.attributes,a=i.styles,s=i.transform;if(Fl(s)&&e.found&&!n.found){var o=e.width,l=e.height,c={x:o/l/2,y:.5};r.style=os(tt(tt({},a),{},{"transform-origin":"".concat(c.x+s.x/16,"em ").concat(c.y+s.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function py(i){var t=i.prefix,e=i.iconName,n=i.children,r=i.attributes,a=i.symbol,s=a===!0?"".concat(t,"-").concat(Et.cssPrefix,"-").concat(e):a;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:tt(tt({},r),{},{id:s}),children:n}]}]}function my(i){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(e){return e in i})}function kl(i){var t=i.icons,e=t.main,n=t.mask,r=i.prefix,a=i.iconName,s=i.transform,o=i.symbol,l=i.maskId,c=i.extra,u=i.watchable,f=u===void 0?!1:u,d=n.found?n:e,h=d.width,g=d.height,v=[Et.replacementClass,a?"".concat(Et.cssPrefix,"-").concat(a):""].filter(function(w){return c.classes.indexOf(w)===-1}).filter(function(w){return w!==""||!!w}).concat(c.classes).join(" "),m={children:[],attributes:tt(tt({},c.attributes),{},{"data-prefix":r,"data-icon":a,class:v,role:c.attributes.role||"img",viewBox:"0 0 ".concat(h," ").concat(g)})};!my(c.attributes)&&!c.attributes["aria-hidden"]&&(m.attributes["aria-hidden"]="true"),f&&(m.attributes[Ai]="");var p=tt(tt({},m),{},{prefix:r,iconName:a,main:e,mask:n,maskId:l,transform:s,symbol:o,styles:tt({},c.styles)}),b=n.found&&e.found?oi("generateAbstractMask",p)||{children:[],attributes:{}}:oi("generateAbstractIcon",p)||{children:[],attributes:{}},E=b.children,_=b.attributes;return p.children=E,p.attributes=_,o?py(p):dy(p)}function Au(i){var t=i.content,e=i.width,n=i.height,r=i.transform,a=i.extra,s=i.watchable,o=s===void 0?!1:s,l=tt(tt({},a.attributes),{},{class:a.classes.join(" ")});o&&(l[Ai]="");var c=tt({},a.styles);Fl(r)&&(c.transform=W1({transform:r,width:e,height:n}),c["-webkit-transform"]=c.transform);var u=os(c);u.length>0&&(l.style=u);var f=[];return f.push({tag:"span",attributes:l,children:[t]}),f}function gy(i){var t=i.content,e=i.extra,n=tt(tt({},e.attributes),{},{class:e.classes.join(" ")}),r=os(e.styles);r.length>0&&(n.style=r);var a=[];return a.push({tag:"span",attributes:n,children:[t]}),a}var Zs=vn.styles;function nl(i){var t=i[0],e=i[1],n=i.slice(4),r=ss(n,1),a=r[0],s=null;return Array.isArray(a)?s={tag:"g",attributes:{class:"".concat(Et.cssPrefix,"-").concat(js.GROUP)},children:[{tag:"path",attributes:{class:"".concat(Et.cssPrefix,"-").concat(js.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(Et.cssPrefix,"-").concat(js.PRIMARY),fill:"currentColor",d:a[1]}}]}:s={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:t,height:e,icon:s}}var vy={found:!1,width:512,height:512};function _y(i,t){!ph&&!Et.showMissingIcons&&i&&console.error('Icon with name "'.concat(i,'" and prefix "').concat(t,'" is missing.'))}function il(i,t){var e=t;return t==="fa"&&Et.styleDefault!==null&&(t=si()),new Promise(function(n,r){if(e==="fa"){var a=Ph(i)||{};i=a.iconName||i,t=a.prefix||t}if(i&&t&&Zs[t]&&Zs[t][i]){var s=Zs[t][i];return n(nl(s))}_y(i,t),n(tt(tt({},vy),{},{icon:Et.showMissingIcons&&i?oi("missingIconAbstract")||{}:{}}))})}var Ru=function(){},rl=Et.measurePerformance&&Ea&&Ea.mark&&Ea.measure?Ea:{mark:Ru,measure:Ru},Rr='FA "7.3.1"',xy=function(t){return rl.mark("".concat(Rr," ").concat(t," begins")),function(){return Dh(t)}},Dh=function(t){rl.mark("".concat(Rr," ").concat(t," ends")),rl.measure("".concat(Rr," ").concat(t),"".concat(Rr," ").concat(t," begins"),"".concat(Rr," ").concat(t," ends"))},Bl={begin:xy,end:Dh},Fa=function(){};function Cu(i){var t=i.getAttribute?i.getAttribute(Ai):null;return typeof t=="string"}function yy(i){var t=i.getAttribute?i.getAttribute(Il):null,e=i.getAttribute?i.getAttribute(Dl):null;return t&&e}function My(i){return i&&i.classList&&i.classList.contains&&i.classList.contains(Et.replacementClass)}function by(){if(Et.autoReplaceSvg===!0)return Oa.replace;var i=Oa[Et.autoReplaceSvg];return i||Oa.replace}function Sy(i){return pe.createElementNS("http://www.w3.org/2000/svg",i)}function Ey(i){return pe.createElement(i)}function Uh(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.ceFn,n=e===void 0?i.tag==="svg"?Sy:Ey:e;if(typeof i=="string")return pe.createTextNode(i);var r=n(i.tag);Object.keys(i.attributes||[]).forEach(function(s){r.setAttribute(s,i.attributes[s])});var a=i.children||[];return a.forEach(function(s){r.appendChild(Uh(s,{ceFn:n}))}),r}function wy(i){var t=" ".concat(i.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var Oa={replace:function(t){var e=t[0];if(e.parentNode)if(t[1].forEach(function(r){e.parentNode.insertBefore(Uh(r),e)}),e.getAttribute(Ai)===null&&Et.keepOriginalSource){var n=pe.createComment(wy(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){var e=t[0],n=t[1];if(~Nl(e).indexOf(Et.replacementClass))return Oa.replace(t);var r=new RegExp("".concat(Et.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var a=n[0].attributes.class.split(" ").reduce(function(o,l){return l===Et.replacementClass||l.match(r)?o.toSvg.push(l):o.toNode.push(l),o},{toNode:[],toSvg:[]});n[0].attributes.class=a.toSvg.join(" "),a.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",a.toNode.join(" "))}var s=n.map(function(o){return Zr(o)}).join(`
`);e.setAttribute(Ai,""),e.innerHTML=s}};function Pu(i){i()}function Nh(i,t){var e=typeof t=="function"?t:Fa;if(i.length===0)e();else{var n=Pu;Et.mutateApproach===R1&&(n=ai.requestAnimationFrame||Pu),n(function(){var r=by(),a=Bl.begin("mutate");i.map(r),a(),e()})}}var Hl=!1;function Fh(){Hl=!0}function al(){Hl=!1}var Ja=null;function Lu(i){if(mu&&Et.observeMutations){var t=i.treeCallback,e=t===void 0?Fa:t,n=i.nodeCallback,r=n===void 0?Fa:n,a=i.pseudoElementsCallback,s=a===void 0?Fa:a,o=i.observeMutationsRoot,l=o===void 0?pe:o;Ja=new mu(function(c){if(!Hl){var u=si();vr(c).forEach(function(f){if(f.type==="childList"&&f.addedNodes.length>0&&!Cu(f.addedNodes[0])&&(Et.searchPseudoElements&&s(f.target),e(f.target)),f.type==="attributes"&&f.target.parentNode&&Et.searchPseudoElements&&s([f.target],!0),f.type==="attributes"&&Cu(f.target)&&~U1.indexOf(f.attributeName))if(f.attributeName==="class"&&yy(f.target)){var d=cs(Nl(f.target)),h=d.prefix,g=d.iconName;f.target.setAttribute(Il,h||u),g&&f.target.setAttribute(Dl,g)}else My(f.target)&&r(f.target)})}}),Vn&&Ja.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Ty(){Ja&&Ja.disconnect()}function Ay(i){var t=i.getAttribute("style"),e=[];return t&&(e=t.split(";").reduce(function(n,r){var a=r.split(":"),s=a[0],o=a.slice(1);return s&&o.length>0&&(n[s]=o.join(":").trim()),n},{})),e}function Ry(i){var t=i.getAttribute("data-prefix"),e=i.getAttribute("data-icon"),n=i.innerText!==void 0?i.innerText.trim():"",r=cs(Nl(i));return r.prefix||(r.prefix=si()),t&&e&&(r.prefix=t,r.iconName=e),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=J1(r.prefix,i.innerText)||zl(r.prefix,bh(i.innerText))),!r.iconName&&Et.autoFetchSvg&&i.firstChild&&i.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=i.firstChild.data)),r}function Cy(i){var t=vr(i.attributes).reduce(function(e,n){return e.name!=="class"&&e.name!=="style"&&(e[n.name]=n.value),e},{});return t}function Py(){return{iconName:null,prefix:null,transform:An,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Iu(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},e=Ry(i),n=e.iconName,r=e.prefix,a=e.rest,s=Cy(i),o=tl("parseNodeAttributes",{},i),l=t.styleParser?Ay(i):[];return tt({iconName:n,prefix:r,transform:An,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:l,attributes:s}},o)}var Ly=vn.styles;function Oh(i){var t=Et.autoReplaceSvg==="nest"?Iu(i,{styleParser:!1}):Iu(i);return~t.extra.classes.indexOf(gh)?oi("generateLayersText",i,t):oi("generateSvgReplacementMutation",i,t)}function Iy(){return[].concat(Mn(lh),Mn(ch))}function Du(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!Vn)return Promise.resolve();var e=pe.documentElement.classList,n=function(f){return e.add("".concat(_u,"-").concat(f))},r=function(f){return e.remove("".concat(_u,"-").concat(f))},a=Et.autoFetchSvg?Iy():zf.concat(Object.keys(Ly));a.includes("fa")||a.push("fa");var s=[".".concat(gh,":not([").concat(Ai,"])")].concat(a.map(function(u){return".".concat(u,":not([").concat(Ai,"])")})).join(", ");if(s.length===0)return Promise.resolve();var o=[];try{o=vr(i.querySelectorAll(s))}catch{}if(o.length>0)n("pending"),r("complete");else return Promise.resolve();var l=Bl.begin("onTree"),c=o.reduce(function(u,f){try{var d=Oh(f);d&&u.push(d)}catch(h){ph||h.name==="MissingIcon"&&console.error(h)}return u},[]);return new Promise(function(u,f){Promise.all(c).then(function(d){Nh(d,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),l(),u()})}).catch(function(d){l(),f(d)})})}function Dy(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Oh(i).then(function(e){e&&Nh([e],t)})}function Uy(i){return function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:el(t||{}),r=e.mask;return r&&(r=(r||{}).icon?r:el(r||{})),i(n,tt(tt({},e),{},{mask:r}))}}var Ny=function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=e.transform,r=n===void 0?An:n,a=e.symbol,s=a===void 0?!1:a,o=e.mask,l=o===void 0?null:o,c=e.maskId,u=c===void 0?null:c,f=e.classes,d=f===void 0?[]:f,h=e.attributes,g=h===void 0?{}:h,v=e.styles,m=v===void 0?{}:v;if(t){var p=t.prefix,b=t.iconName,E=t.icon;return us(tt({type:"icon"},t),function(){return Ri("beforeDOMElementCreation",{iconDefinition:t,params:e}),kl({icons:{main:nl(E),mask:l?nl(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:p,iconName:b,transform:tt(tt({},An),r),symbol:s,maskId:u,extra:{attributes:g,styles:m,classes:d}})})}},Fy={mixout:function(){return{icon:Uy(Ny)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=Du,e.nodeCallback=Dy,e}}},provides:function(t){t.i2svg=function(e){var n=e.node,r=n===void 0?pe:n,a=e.callback,s=a===void 0?function(){}:a;return Du(r,s)},t.generateSvgReplacementMutation=function(e,n){var r=n.iconName,a=n.prefix,s=n.transform,o=n.symbol,l=n.mask,c=n.maskId,u=n.extra;return new Promise(function(f,d){Promise.all([il(r,a),l.iconName?il(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(h){var g=ss(h,2),v=g[0],m=g[1];f([e,kl({icons:{main:v,mask:m},prefix:a,iconName:r,transform:s,symbol:o,maskId:c,extra:u,watchable:!0})])}).catch(d)})},t.generateAbstractIcon=function(e){var n=e.children,r=e.attributes,a=e.main,s=e.transform,o=e.styles,l=os(o);l.length>0&&(r.style=l);var c;return Fl(s)&&(c=oi("generateAbstractTransformGrouping",{main:a,transform:s,containerWidth:a.width,iconWidth:a.width})),n.push(c||a.icon),{children:n,attributes:r}}}},Oy={mixout:function(){return{layer:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,a=r===void 0?[]:r;return us({type:"layer"},function(){Ri("beforeDOMElementCreation",{assembler:e,params:n});var s=[];return e(function(o){Array.isArray(o)?o.map(function(l){s=s.concat(l.abstract)}):s=s.concat(o.abstract)}),[{tag:"span",attributes:{class:["".concat(Et.cssPrefix,"-layers")].concat(Mn(a)).join(" ")},children:s}]})}}}},zy={mixout:function(){return{counter:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,a=r===void 0?[]:r,s=n.attributes,o=s===void 0?{}:s,l=n.styles,c=l===void 0?{}:l;return us({type:"counter",content:e},function(){return Ri("beforeDOMElementCreation",{content:e,params:n}),gy({content:e.toString(),extra:{attributes:o,styles:c,classes:["".concat(Et.cssPrefix,"-layers-counter")].concat(Mn(a))}})})}}}},ky={mixout:function(){return{text:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,a=r===void 0?An:r,s=n.classes,o=s===void 0?[]:s,l=n.attributes,c=l===void 0?{}:l,u=n.styles,f=u===void 0?{}:u;return us({type:"text",content:e},function(){return Ri("beforeDOMElementCreation",{content:e,params:n}),Au({content:e,transform:tt(tt({},An),a),extra:{attributes:c,styles:f,classes:["".concat(Et.cssPrefix,"-layers-text")].concat(Mn(o))}})})}}},provides:function(t){t.generateLayersText=function(e,n){var r=n.transform,a=n.extra,s=null,o=null;if(Ff){var l=parseInt(getComputedStyle(e).fontSize,10),c=e.getBoundingClientRect();s=c.width/l,o=c.height/l}return Promise.resolve([e,Au({content:e.innerHTML,width:s,height:o,transform:r,extra:a,watchable:!0})])}}},zh=new RegExp('"',"ug"),Uu=[1105920,1112319],Nu=tt(tt(tt(tt({},{FontAwesome:{normal:"fas",400:"fas"}}),cx),T1),_x),sl=Object.keys(Nu).reduce(function(i,t){return i[t.toLowerCase()]=Nu[t],i},{}),By=Object.keys(sl).reduce(function(i,t){var e=sl[t];return i[t]=e[900]||Mn(Object.entries(e))[0][1],i},{});function Hy(i){var t=i.replace(zh,"");return bh(Mn(t)[0]||"")}function Gy(i){var t=i.getPropertyValue("font-feature-settings").includes("ss01"),e=i.getPropertyValue("content"),n=e.replace(zh,""),r=n.codePointAt(0),a=r>=Uu[0]&&r<=Uu[1],s=n.length===2?n[0]===n[1]:!1;return a||s||t}function Vy(i,t){var e=i.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(sl[e]||{})[r]||By[e]}function Fu(i,t){var e="".concat(A1).concat(t.replace(":","-"));return new Promise(function(n,r){if(i.getAttribute(e)!==null)return n();var a=vr(i.children),s=a.filter(function(T){return T.getAttribute(qo)===t})[0],o=ai.getComputedStyle(i,t),l=o.getPropertyValue("font-family"),c=l.match(I1),u=o.getPropertyValue("font-weight"),f=o.getPropertyValue("content");if(s&&!c)return i.removeChild(s),n();if(c&&f!=="none"&&f!==""){var d=o.getPropertyValue("content"),h=Vy(l,u),g=Hy(d),v=c[0].startsWith("FontAwesome"),m=Gy(o),p=zl(h,g),b=p;if(v){var E=Q1(g);E.iconName&&E.prefix&&(p=E.iconName,h=E.prefix)}if(p&&!m&&(!s||s.getAttribute(Il)!==h||s.getAttribute(Dl)!==b)){i.setAttribute(e,b),s&&i.removeChild(s);var _=Py(),w=_.extra;w.attributes[qo]=t,il(p,h).then(function(T){var A=kl(tt(tt({},_),{},{icons:{main:T,mask:Lh()},prefix:h,iconName:b,extra:w,watchable:!0})),C=pe.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?i.insertBefore(C,i.firstChild):i.appendChild(C),C.outerHTML=A.map(function(x){return Zr(x)}).join(`
`),i.removeAttribute(e),n()}).catch(r)}else n()}else n()})}function Wy(i){return Promise.all([Fu(i,"::before"),Fu(i,"::after")])}function Xy(i){return i.parentNode!==document.head&&!~C1.indexOf(i.tagName.toUpperCase())&&!i.getAttribute(qo)&&(!i.parentNode||i.parentNode.tagName!=="svg")}var Yy=function(t){return!!t&&dh.some(function(e){return t.includes(e)})},$y=function(t){if(!t)return[];var e=new Set,n=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(c){return c.trim()})});var r=Na(n),a;try{for(r.s();!(a=r.n()).done;){var s=a.value;if(Yy(s)){var o=dh.reduce(function(l,c){return l.replace(c,"")},s);o!==""&&o!=="*"&&e.add(o)}}}catch(l){r.e(l)}finally{r.f()}return e};function Ou(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(Vn){var e;if(t)e=i;else if(Et.searchPseudoElementsFullScan)e=i.querySelectorAll("*");else{var n=new Set,r=Na(document.styleSheets),a;try{for(r.s();!(a=r.n()).done;){var s=a.value;try{var o=Na(s.cssRules),l;try{for(o.s();!(l=o.n()).done;){var c=l.value,u=$y(c.selectorText),f=Na(u),d;try{for(f.s();!(d=f.n()).done;){var h=d.value;n.add(h)}}catch(v){f.e(v)}finally{f.f()}}}catch(v){o.e(v)}finally{o.f()}}catch(v){Et.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(s.href," (").concat(v.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(v){r.e(v)}finally{r.f()}if(!n.size)return;var g=Array.from(n).join(", ");try{e=i.querySelectorAll(g)}catch{}}return new Promise(function(v,m){var p=vr(e).filter(Xy).map(Wy),b=Bl.begin("searchPseudoElements");Fh(),Promise.all(p).then(function(){b(),al(),v()}).catch(function(){b(),al(),m()})})}}var jy={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=Ou,e}}},provides:function(t){t.pseudoElements2svg=function(e){var n=e.node,r=n===void 0?pe:n;Et.searchPseudoElements&&Ou(r)}}},zu=!1,qy={mixout:function(){return{dom:{unwatch:function(){Fh(),zu=!0}}}},hooks:function(){return{bootstrap:function(){Lu(tl("mutationObserverCallbacks",{}))},noAuto:function(){Ty()},watch:function(e){var n=e.observeMutationsRoot;zu?al():Lu(tl("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},ku=function(t){var e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var a=r.toLowerCase().split("-"),s=a[0],o=a.slice(1).join("-");if(s&&o==="h")return n.flipX=!0,n;if(s&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(s){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},e)},Ky={mixout:function(){return{parse:{transform:function(e){return ku(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,n){var r=n.getAttribute("data-fa-transform");return r&&(e.transform=ku(r)),e}}},provides:function(t){t.generateAbstractTransformGrouping=function(e){var n=e.main,r=e.transform,a=e.containerWidth,s=e.iconWidth,o={transform:"translate(".concat(a/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),c="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),u="rotate(".concat(r.rotate," 0 0)"),f={transform:"".concat(l," ").concat(c," ").concat(u)},d={transform:"translate(".concat(s/2*-1," -256)")},h={outer:o,inner:f,path:d};return{tag:"g",attributes:tt({},h.outer),children:[{tag:"g",attributes:tt({},h.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:tt(tt({},n.icon.attributes),h.path)}]}]}}}},Js={x:0,y:0,width:"100%",height:"100%"};function Bu(i){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return i.attributes&&(i.attributes.fill||t)&&(i.attributes.fill="black"),i}function Zy(i){return i.tag==="g"?i.children:[i]}var Jy={hooks:function(){return{parseNodeAttributes:function(e,n){var r=n.getAttribute("data-fa-mask"),a=r?cs(r.split(" ").map(function(s){return s.trim()})):Lh();return a.prefix||(a.prefix=si()),e.mask=a,e.maskId=n.getAttribute("data-fa-mask-id"),e}}},provides:function(t){t.generateAbstractMask=function(e){var n=e.children,r=e.attributes,a=e.main,s=e.mask,o=e.maskId,l=e.transform,c=a.width,u=a.icon,f=s.width,d=s.icon,h=V1({transform:l,containerWidth:f,iconWidth:c}),g={tag:"rect",attributes:tt(tt({},Js),{},{fill:"white"})},v=u.children?{children:u.children.map(Bu)}:{},m={tag:"g",attributes:tt({},h.inner),children:[Bu(tt({tag:u.tag,attributes:tt(tt({},u.attributes),h.path)},v))]},p={tag:"g",attributes:tt({},h.outer),children:[m]},b="mask-".concat(o||yu()),E="clip-".concat(o||yu()),_={tag:"mask",attributes:tt(tt({},Js),{},{id:b,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[g,p]},w={tag:"defs",children:[{tag:"clipPath",attributes:{id:E},children:Zy(d)},_]};return n.push(w,{tag:"rect",attributes:tt({fill:"currentColor","clip-path":"url(#".concat(E,")"),mask:"url(#".concat(b,")")},Js)}),{children:n,attributes:r}}}},Qy={provides:function(t){var e=!1;ai.matchMedia&&(e=ai.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:tt(tt({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var s=tt(tt({},a),{},{attributeName:"opacity"}),o={tag:"circle",attributes:tt(tt({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||o.children.push({tag:"animate",attributes:tt(tt({},a),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:tt(tt({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:tt(tt({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:tt(tt({},s),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:tt(tt({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:tt(tt({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},tM={hooks:function(){return{parseNodeAttributes:function(e,n){var r=n.getAttribute("data-fa-symbol"),a=r===null?!1:r===""?!0:r;return e.symbol=a,e}}}},eM=[Y1,Fy,Oy,zy,ky,jy,qy,Ky,Jy,Qy,tM];ly(eM,{mixoutsTo:nn});nn.noAuto;nn.config;nn.library;nn.dom;nn.parse;nn.findIconDefinition;nn.toHtml;var nM=nn.icon;nn.layer;nn.text;nn.counter;var iM={prefix:"fas",iconName:"tree",icon:[448,512,[127794],"f1bb","M224-32c7 0 13.7 3.1 18.3 8.5l136 160c6.1 7.1 7.4 17.1 3.5 25.6S369.4 176 360 176l-24.9 0 75.2 88.5c6.1 7.1 7.4 17.1 3.5 25.6S401.4 304 392 304l-38.5 0 88.8 104.5c6.1 7.1 7.4 17.1 3.5 25.6S433.4 448 424 448l-168 0 0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64-168 0c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L94.5 304 56 304c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L112.9 176 88 176c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6l136-160C210.3-28.9 217-32 224-32z"]},rM={prefix:"fas",iconName:"apple-whole",icon:[448,512,[127822,127823,"apple-alt"],"f5d1","M224 112c-8.8 0-16-7.2-16-16l0-16c0-44.2 35.8-80 80-80l16 0c8.8 0 16 7.2 16 16l0 16c0 44.2-35.8 80-80 80l-16 0zM0 288c0-76.3 35.7-160 112-160 27.3 0 59.7 10.3 82.7 19.3 18.8 7.3 39.9 7.3 58.7 0 22.9-8.9 55.4-19.3 82.7-19.3 76.3 0 112 83.7 112 160 0 128-80 224-160 224-16.5 0-38.1-6.6-51.5-11.3-8.1-2.8-16.9-2.8-25 0-13.4 4.7-35 11.3-51.5 11.3-80 0-160-96-160-224z"]},aM={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"]},sM={prefix:"fas",iconName:"mountain",icon:[512,512,[127956],"f6fc","M256.5 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5-7.2 12.1-20.3 19.5-34.3 19.5l-432 0c-14.1 0-27.1-7.4-34.3-19.5s-7.5-27.1-.8-39.5l216-400 2.9-4.6C231.7 6.2 243.6 0 256.5 0zM170.4 249.9l26.8 26.8c6.2 6.2 16.4 6.2 22.6 0l43.3-43.3c6-6 14.1-9.4 22.6-9.4l42.8 0-72.1-133.5-86.1 159.4z"]},kh={prefix:"fas",iconName:"seedling",icon:[512,512,[127793,"sprout"],"f4d8","M512 32C512 140.1 435.4 230.3 333.6 251.4 325.7 193.3 299.6 141 261.1 100.5 301.2 40 369.9 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 192c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"]},oM={prefix:"fas",iconName:"users",icon:[640,512,[],"f0c0","M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"]},Qs={prefix:"fas",iconName:"utensils",icon:[512,512,[127860,61685,"cutlery"],"f2e7","M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"]},lM={prefix:"fas",iconName:"crown",icon:[576,512,[128081],"f521","M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z"]},cM={prefix:"fas",iconName:"box-open",icon:[640,512,[],"f49e","M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"]},Hu={prefix:"fas",iconName:"wheat-awn",icon:[576,512,["wheat-alt"],"e2cd","M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z"]},uM={prefix:"fas",iconName:"circle-question",icon:[512,512,[62108,"question-circle"],"f059","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm0-336c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]},fM={prefix:"fas",iconName:"fish",icon:[576,512,[128031],"f578","M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8 4.7 9.2 4.7 20.1 0 29.3-14.1 27.4-41.9 66.8-81 99.8-39.2 33.1-92 61.5-155.5 61.5s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9s-12.4-26-5.3-38.6L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},hM={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"]},dM={prefix:"fas",iconName:"rotate-left",icon:[512,512,["rotate-back","rotate-backward","undo-alt"],"f2ea","M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z"]},pM={prefix:"fas",iconName:"mug-hot",icon:[576,512,[9749],"f7b6","M152-16c-13.3 0-24 10.7-24 24 0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C183.5 31.7 176 24.1 176 8 176-5.3 165.3-16 152-16zM96 192c-17.7 0-32 14.3-32 32l0 192c0 53 43 96 96 96l192 0c41.8 0 77.4-26.7 90.5-64l5.5 0c70.7 0 128-57.3 128-128S518.7 192 448 192L96 192zM448 384l0-128c35.3 0 64 28.7 64 64s-28.7 64-64 64zM288 8c0-13.3-10.7-24-24-24S240-5.3 240 8c0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C295.5 31.7 288 24.1 288 8z"]},mM={prefix:"fas",iconName:"route",icon:[512,512,[],"f4d7","M512 96c0 50.2-59.1 125.1-84.6 155-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8 6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96 0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8-25.2-27.4-85-97.9-85-148.4 0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};const gM={wood:iM,stone:sM,fish:fM,berry:rM,wheat:Hu,farm:Hu,food:Qs,people:oM,happy:aM,crest:lM,help:uM,reset:dM,rest:pM,carry:cM,full:hM,garden:kh,eat:Qs,hungry:Qs,search:mM},_n=i=>nM(gM[i]??kh,{attributes:{"aria-hidden":"true"}}).html.join("");class vM{camera=new rs(-8,8,5,-5,.1,80);element;target=new I(0,.12,0);desiredTarget=new I(0,.12,0);offset=new I;spherical=new Hp;right=new I;forward=new I;up=new I(0,1,0);distance=20;yaw=Math.PI/4;desiredYaw=Math.PI/4;pitch=.86;desiredPitch=.86;desiredZoom=1;halfHeight=3.5;desiredHalfHeight=3.5;viewportWidth=1280;shiftFraction=0;islandRadius=2.8;islandCenter=new I(0,.3,0);frameIsland(t,e=!1){if(!t.length)return;const n=t.map(a=>a.x),r=t.map(a=>a.z);this.islandCenter.set((Math.min(...n)+Math.max(...n))/2,.3,(Math.min(...r)+Math.max(...r))/2),this.islandRadius=Math.max(...t.map(a=>Math.hypot(a.x-this.islandCenter.x,a.z-this.islandCenter.z)))+2.65,this.distance=Math.max(20,this.islandRadius*3),this.camera.far=this.distance+this.islandRadius*3+40,this.desiredTarget.copy(this.islandCenter),this.resize(this.viewportWidth,this.viewportHeight),e&&(this.target.copy(this.desiredTarget),this.halfHeight=this.desiredHalfHeight,this.applyProjection(),this.applyTransform())}applyProjection(){const t=this.viewportWidth/this.viewportHeight,e=this.shiftFraction*this.halfHeight;Object.assign(this.camera,{left:-this.halfHeight*t,right:this.halfHeight*t,top:this.halfHeight+e,bottom:-this.halfHeight+e}),this.camera.updateProjectionMatrix()}viewportHeight=900;placement=!1;pointer=null;disposed=!1;cleanup=new AbortController;constructor(t){this.element=t,this.camera.zoom=1;const e=this.cleanup.signal;t.addEventListener("pointerdown",this.onPointerDown,{signal:e}),t.addEventListener("pointermove",this.onPointerMove,{signal:e}),t.addEventListener("pointerup",this.onPointerUp,{signal:e}),t.addEventListener("pointercancel",this.onPointerUp,{signal:e}),t.addEventListener("lostpointercapture",this.onPointerUp,{signal:e}),t.addEventListener("wheel",this.onWheel,{passive:!1,signal:e}),t.addEventListener("contextmenu",this.onContextMenu,{signal:e}),window.addEventListener("keydown",this.onKeyDown,{signal:e}),window.addEventListener("blur",this.onBlur,{signal:e}),this.resize(t.clientWidth||1280,t.clientHeight||900),this.applyTransform()}resize(t,e){const n=Math.max(1,t),r=Math.max(1,e),a=n/r,s=n<700?100:85,o=n<700?205:r<760?190:225,l=Math.max(r*.43,r-s-o);this.viewportWidth=n,this.viewportHeight=r,this.desiredHalfHeight=Math.max(this.islandRadius/(a*.9),(this.islandRadius*.68+.61)*r/l),this.shiftFraction=(s-o)/r,this.applyProjection()}update(t){if(this.disposed)return;const e=Math.min(Math.max(t,0),.1),n=1-Math.exp(-11*e),r=1-Math.exp(-12*e);!this.placement&&Math.abs(this.halfHeight-this.desiredHalfHeight)>1e-4&&(this.halfHeight=Kt.lerp(this.halfHeight,this.desiredHalfHeight,n),this.applyProjection()),this.yaw=Kt.lerp(this.yaw,this.desiredYaw,n),this.pitch=Kt.lerp(this.pitch,this.desiredPitch,n),this.target.lerp(this.desiredTarget,n);const a=Kt.lerp(this.camera.zoom,this.desiredZoom,r);Math.abs(a-this.camera.zoom)>1e-6&&(this.camera.zoom=a,this.camera.updateProjectionMatrix()),this.applyTransform()}setPlacement(t){this.placement=t,t&&(this.releasePointer(),this.desiredYaw=this.yaw,this.desiredPitch=this.pitch,this.desiredTarget.copy(this.target),this.desiredZoom=this.camera.zoom)}reset(){this.releasePointer(),this.desiredTarget.copy(this.islandCenter),this.desiredYaw=Math.PI/4,this.desiredPitch=.86,this.desiredZoom=1}dispose(){this.disposed=!0,this.releasePointer(),this.cleanup.abort()}applyTransform(){this.spherical.set(this.distance,this.pitch,this.yaw),this.offset.setFromSpherical(this.spherical),this.camera.position.copy(this.target).add(this.offset),this.camera.lookAt(this.target),this.camera.updateMatrixWorld()}onPointerDown=t=>{this.placement||t.pointerType==="touch"||t.button!==1&&t.button!==2||t.target instanceof HTMLElement&&t.target.closest("button, input, dialog, [data-card]")||(t.preventDefault(),this.pointer={id:t.pointerId,x:t.clientX,y:t.clientY,pan:t.button===1||t.shiftKey},this.element.setPointerCapture(t.pointerId),this.element.style.cursor="grabbing")};onPointerMove=t=>{if(!this.pointer||t.pointerId!==this.pointer.id)return;const e=t.clientX-this.pointer.x,n=t.clientY-this.pointer.y;if(this.pointer.x=t.clientX,this.pointer.y=t.clientY,this.pointer.pan){const r=2*this.halfHeight/(this.viewportHeight*this.desiredZoom);this.right.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),this.forward.crossVectors(this.up,this.right),this.desiredTarget.addScaledVector(this.right,-e*r*.8),this.desiredTarget.addScaledVector(this.forward,n*r*.8);const a=Math.hypot(this.desiredTarget.x-this.islandCenter.x,this.desiredTarget.z-this.islandCenter.z);a>.85&&(this.desiredTarget.x=this.islandCenter.x+(this.desiredTarget.x-this.islandCenter.x)*.85/a,this.desiredTarget.z=this.islandCenter.z+(this.desiredTarget.z-this.islandCenter.z)*.85/a)}else this.desiredYaw-=e*.0035,this.desiredPitch=Kt.clamp(this.desiredPitch-n*.0025,.7,1.02)};onPointerUp=t=>{this.pointer?.id===t.pointerId&&this.releasePointer()};releasePointer(){const t=this.pointer;this.pointer=null,t&&this.element.hasPointerCapture(t.id)&&this.element.releasePointerCapture(t.id),this.element.style.cursor=""}onWheel=t=>{if(t.preventDefault(),this.placement)return;const e=t.deltaY*(t.deltaMode===1?16:t.deltaMode===2?this.viewportHeight:1);this.desiredZoom=Kt.clamp(this.desiredZoom*Math.exp(-e*.001),.7,2.6)};onContextMenu=t=>t.preventDefault();onBlur=()=>this.releasePointer();onKeyDown=t=>{t.key.toLowerCase()!=="h"||t.ctrlKey||t.altKey||t.metaKey||this.placement||document.querySelector("dialog[open]")||t.target instanceof HTMLElement&&(t.target.isContentEditable||t.target.closest("input, textarea, select"))||this.reset()}}const Qa=.45,xi=1.5,Ra=1.05,Tr=1.85;function dn(i,t,e){const n=Math.max(0,Math.min(1,(i-t)/(e-t)));return n*n*(3-2*n)}const Gl=.1,Vl=1.25,Bh=1.4,se=.13,zn=-.18,_M=new Rt("#80ac71"),xM=new Rt("#b8c982");function yM(i,t,e){const n=.5+.23*Math.sin(i*.94+t*.47)+.16*Math.cos(t*1.27-i*.52)+.09*Math.sin(i*1.8-t*.98);return e.copy(_M).lerp(xM,Kt.smoothstep(n,.1,.9))}const Gu=ii*Math.cos(Math.PI/6);function za(i,t){const e=Ye(i).map(f=>!t.has(f));function n(f,d,h){const g=(f+5)%6,v=f%6,m=g*Math.PI/3,p=v*Math.PI/3,b=Gu+(e[g]?d:0),E=Gu+(e[v]?d:0),_=Math.sin(p-m);return new I((b*Math.sin(p)-E*Math.sin(m))/_,h,(Math.cos(m)*E-Math.cos(p)*b)/_)}const r=ie(i),a=[],s=[],o=(f,d,h,g,v=1)=>{const m=new Rt(g).multiplyScalar(v);for(const p of[f,d,h])a.push(p.x,p.y,p.z),(g===10795903||g===9546604)&&(yM(r.x+p.x,r.z+p.z,m),p.y<se&&m.multiplyScalar(.89)),s.push(m.r,m.g,m.b)},l=[[-.095,se],[-.035,.074],[.05,-.016],[.15,-.16],[.28,-.37],[.42,-.58]],c=[9546604,11057024,14469014,15257502,14140311];for(let f=0;f<6;f++){const d=l.map(([h,g])=>{const v=n(f,h,g),m=n(f+1,h,g);return Array.from({length:5},(p,b)=>{const E=b/4,_=v.clone().lerp(m,E);if(e[f]&&b>0&&b<4){const w=.025*Math.sin(i*.61+f*2.8+E*Math.PI*2)*Math.sin(E*Math.PI);_.x+=Math.cos(f*Math.PI/3)*w,_.z+=Math.sin(f*Math.PI/3)*w}return _})});for(let h=0;h<4;h++)if(o(new I(0,se,0),d[0][h+1],d[0][h],10795903,1+.009*Math.sin(f+h+i)),!!e[f])for(let g=0;g<l.length-1;g++){const[v,m,p,b]=[d[g][h],d[g][h+1],d[g+1][h],d[g+1][h+1]],E=1+.035*Math.sin(i+f*1.7+h);o(v,m,p,c[g],E),o(p,m,b,c[g],E+.01)}}const u=new Ee;return u.setAttribute("position",new Jt(a,3)),u.setAttribute("color",new Jt(s,3)),u.computeVertexNormals(),u}function MM(i){const t=new Ht,e=ie(i);t.position.set(e.x,se,e.z);const n=[],r=[];function a(o,l){n.push(...o);const c=new Rt(l);for(let u=0;u<3;u++)r.push(c.r,c.g,c.b)}for(let o=0;o<21;o++){const l=o*2.399+i*.44,c=.59+.18*(.5+.5*Math.sin(o*12+i)),u=Math.cos(l)*c,f=Math.sin(l)*c,d=m=>{const p=Math.sin(i*17.31+o*71.13+m*29.7)*43758.5453;return p-Math.floor(p)},h=3+Math.floor(d(0)*4),g=d(1)*Math.PI*2,v=[7575134,8824939,10205563,11651210,8365420];for(let m=0;m<h;m++){const p=g+(d(m+2)-.5)*2.4,b=Math.cos(p),E=Math.sin(p),_=u+(d(m+20)-.5)*.06,w=f+(d(m+40)-.5)*.06,T=.035+d(m+60)*.07,A=.009+d(m+80)*.008,C=.012+d(m+100)*.035,x=_+b*C*.3,M=w+E*C*.3,L=_+b*C,F=w+E*C,z=v[Math.floor(d(m+120)*v.length)];a([_-E*A,.004,w+b*A,_+E*A,.004,w-b*A,x+E*A*.55,T*.55,M-b*A*.55],z),a([_-E*A,.004,w+b*A,x+E*A*.55,T*.55,M-b*A*.55,x-E*A*.55,T*.55,M+b*A*.55],z),a([x-E*A*.55,T*.55,M+b*A*.55,x+E*A*.55,T*.55,M-b*A*.55,L,T,F],z)}if(o%4===0&&a([u-.025,.054,f+.012,u+.027,.053,f,u,.083,f-.014],o%2?16045456:15854533),o%5===0){const m=Nr(o%6,.05);a([u-.045,.005,f,u+m.x,.029,f+m.z,u+.065,.006,f+.034],13156769)}}const s=new Ee;return s.setAttribute("position",new Jt(n,3)),s.setAttribute("color",new Jt(r,3)),s.computeVertexNormals(),t.add(new Yt(s,new Rl({vertexColors:!0,side:Oe}))),t}const Kn=7,Vu=3.8,Fe=256,ka=(i,t,e)=>{const n=Math.max(0,Math.min(1,(e-i)/(t-i)));return n*n*(3-2*n)};class Wu{pixels=new Uint8Array(Fe*Fe*4);texture=new Sl(this.pixels,Fe,Fe,Qe);region=new de;constructor(){this.texture.minFilter=this.texture.magFilter=ln,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}rebuild(t,e,n){const r=e.flatMap(g=>[g.ax,g.bx]),a=e.flatMap(g=>[g.az,g.bz]),s=n?.x??Math.min(...r)-Kn,o=n?.y??Math.min(...a)-Kn;n?this.region.copy(n):this.region.set(s,o,Math.max(...r)-s+Kn,Math.max(...a)-o+Kn);const l=e.map(g=>{const v=g.bx-g.ax,m=g.bz-g.az;return{...g,dx:v,dz:m,inv:1/(v*v+m*m)}}),c=this.region.z/Fe,u=this.region.w/Fe,f=16,d=Math.hypot(c,u)*f*.5;function h(g,v,m){const p=v-g.ax,b=m-g.az,E=Math.max(0,Math.min(1,(p*g.dx+b*g.dz)*g.inv)),_=p-E*g.dx,w=b-E*g.dz;return _*_+w*w}for(let g=0;g<Fe;g+=f)for(let v=0;v<Fe;v+=f){const m=s+(v+f/2)*c,p=o+(g+f/2)*u,b=l.map(w=>h(w,m,p)),E=Math.min(Kn+d,Math.sqrt(Math.min(...b))+2*d),_=l.filter((w,T)=>b[T]<=E*E);for(let w=g;w<g+f;w++)for(let T=v;T<v+f;T++){const A=s+(T+.5)*c,C=o+(w+.5)*u;let x=Kn*Kn;for(const Y of _)x=Math.min(x,h(Y,A,C));const M=Math.sqrt(x)*(t.has(ke(A,C))?-1:1),L=.5+.25*Math.sin(A*.79+C*.36)+.18*Math.cos(C*.94-A*.51)+.07*Math.sin(A*1.41-C*.88),F=ka(.18,2.2+2.3*L,M),z=.31+.23*ka(.24,1.65,M)+F*(1.15+.43*(1-L))+1.55*ka(2.9,6.9,M),W=Math.round(65535*Math.max(0,Math.min(1,(M+1)/(Kn+1)))),V=(w*Fe+T)*4;this.pixels[V]=W>>8,this.pixels[V+1]=W&255,this.pixels[V+2]=Math.round(255*Math.min(z/Vu,1)),this.pixels[V+3]=255}}this.texture.needsUpdate=!0}depthAt(t,e){const n=Math.max(0,Math.min(Fe-1,(t-this.region.x)/this.region.z*Fe-.5)),r=Math.max(0,Math.min(Fe-1,(e-this.region.y)/this.region.w*Fe-.5)),a=Math.floor(n),s=Math.floor(r),o=Math.min(a+1,Fe-1),l=Math.min(s+1,Fe-1),c=(u,f)=>this.pixels[(f*Fe+u)*4+2]*Vu/255;return Kt.lerp(Kt.lerp(c(a,s),c(o,s),n-a),Kt.lerp(c(a,l),c(o,l),n-a),r-s)}}function bM(){const e=new Uint8Array(589824);let n=70816;const r=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),a=Array.from({length:64},()=>[.15+.7*r(),.15+.7*r()]),s=2*Math.PI;for(let l=0;l<384;l++)for(let c=0;c<384;c++){const u=(c+.5)/384,f=(l+.5)/384,d=u*8,h=f*8,g=Math.floor(d),v=Math.floor(h);let m=10,p=10,b=10;for(let _=-1;_<=1;_++)for(let w=-1;w<=1;w++){const T=a[(v+_+8)%8*8+(g+w+8)%8],A=g+w+T[0]-d,C=v+_+T[1]-h,x=A*A+C*C;x<m?(b=p,p=m,m=x):x<p?(b=p,p=x):x<b&&(b=x)}const E=(l*384+c)*4;e[E]=255*Math.min(1,Math.sqrt(p)-Math.sqrt(m)),e[E+1]=255*(1-ka(.015,.35,Math.sqrt(b)-Math.sqrt(m))),e[E+2]=255*(.5+.21*Math.sin(s*(2*u+f)+.9*Math.sin(s*f))+.16*Math.cos(s*(u-2*f))+.09*Math.sin(s*(3*f-u)+.7)),e[E+3]=255*(.5+.22*Math.cos(s*(f-u)+.7*Math.cos(s*u))+.14*Math.sin(s*(u+2*f)+1.3)+.09*Math.cos(s*(3*u+f)))}const o=new Sl(e,384,384,Qe);return o.wrapS=o.wrapT=Wa,o.minFilter=Qn,o.magFilter=ln,o.generateMipmaps=!0,o.needsUpdate=!0,o}const Hh=`
uniform float uTime;
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
`,Gh=`
vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8), d=vec2(5.2,2.1);
  float pa=dot(p,a)-uTime*1.05, pb=dot(p,b)+uTime*.81;
  float pc=dot(p,c)-uTime*1.47, pd=dot(p,d)+uTime*1.92;
  float height=.027*sin(pa)+.016*sin(pb)+.007*sin(pc)+.003*sin(pd);
  vec2 gradient=.027*cos(pa)*a+.016*cos(pb)*b+.007*cos(pc)*c+.003*cos(pd)*d;
  return vec3(height,gradient);
}
`,SM=`
uniform float uTime;
`+Gh+`
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=seaWave(p).x;
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`,EM=Hh+Gh+`
uniform sampler2D uCoast,uPreviousCoast;
uniform float uCoastMix;
uniform vec4 uRegion;
uniform vec3 uMint, uTurquoise, uLagoon, uDeep;
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
  float sunlight=.48+.44*weather.a;
  float focus=(lens.thread*.45+lens.halo*.20+lens.knot*.095)*sunlight;
  // Most refracted light is on the bed. The surface carries a fainter echo offshore.
  pigment+=vec3(.16,.30,.27)*focus*(.30+.35*shelf);
  vec2 slope=seaWave(p).yz+flow*.025+wakeSlope;
  vec3 normal=normalize(vec3(-slope.x,1.,-slope.y));
  vec3 eye=normalize(cameraPosition-vWorld);
  float fresnel=.025+.975*pow(1.-max(dot(normal,eye),0.),5.);
  vec3 sky=mix(vec3(.22,.48,.65),vec3(.53,.79,.87),max(eye.y,0.));
  pigment=mix(pigment,sky,fresnel*.60);
  vec3 halfway=normalize(normalize(vec3(-.5,1.,.4))+eye);
  float glint=pow(max(dot(normal,halfway),0.),150.);
  pigment+=vec3(.85,.87,.76)*glint*.48;
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
  pigment=mix(pigment,vec3(.88,.96,.83),foam);
  pigment+=max(ring,0.)*vec3(.21,.32,.29);
  pigment=mix(pigment,vec3(.73,.93,.88),clamp(arrivalFoam*gate,0.,.5));
  pigment+=max(wake,0.)*vec3(.10,.17,.16);
  pigment*=1.+min(wake,0.)*.07;
  float opacity=1.-.78*exp(-1.25*max(0.,depth-.25));
  opacity=mix(opacity,1.,smoothstep(2.38,3.25,depth));
  opacity=mix(opacity,.94,foam);
  gl_FragColor=vec4(pigment,opacity);
  #include <colorspace_fragment>
}`,wM=`
  vec2 bedPosition=vReceiver.xz;
  float immersion=max(0.,-.18-vReceiver.y);
  vec2 refraction=current(bedPosition);
  vec2 projected=bedPosition + immersion*vec2(.19,-.12) + refraction*(.15+.11*immersion);
  vec4 disturbance=waterDisturbance(bedPosition);
  Lens sunprint=lightNet(projected*1.24,refraction,disturbance);
  float transmission=exp(-immersion*.98);
  float concentration=sunprint.thread*.64 + sunprint.halo*.32 + sunprint.knot*.18;
  diffuseColor.rgb*=.90 + transmission*(.09+concentration*.49);
  diffuseColor.rgb+=vec3(.21,.37,.30)*concentration*transmission;
`,Sn=100,Xu=Kt.lerp;class TM{root=new Ht;field=new Wu;previousField=new Wu;previousBoard=new Map;transitionAt=-10;transitionStart=Qa;transitionEnd=xi;pendingEdges=null;uniforms={uWakes:{value:Array.from({length:12},()=>new de(0,0,-10,0))},uWakeDirs:{value:Array.from({length:12},()=>new de(1,0,0,0))},uCoastMix:{value:1},uPreviousCoast:{value:this.previousField.texture},uTime:{value:0},uLight:{value:bM()},uCoast:{value:this.field.texture},uRegion:{value:this.field.region},uLanding:{value:new I(0,0,-10)},uMint:{value:new Rt("#87efd4")},uTurquoise:{value:new Rt("#20d0c6")},uLagoon:{value:new Rt("#22b7c7")},uDeep:{value:new Rt("#318fc4")}};nextWake=0;sandGeometry=new Ti(1,1,Sn,Sn).rotateX(-Math.PI/2);sandStart=new Jt(new Float32Array((Sn+1)**2),1);sandStartTint=new Jt(new Float32Array((Sn+1)**2*3),3);sandTint=new Jt(new Float32Array((Sn+1)**2*3),3);stones;surface;silhouettes=new jr(1,0);constructor(){const t=new Yt(new Ti(160,160,180,180),new Bn({uniforms:this.uniforms,vertexShader:SM,fragmentShader:EM,transparent:!0,depthWrite:!1,toneMapped:!1}));this.surface=t,t.rotation.x=-Math.PI/2,t.position.y=zn,t.renderOrder=2,this.sandGeometry.setAttribute("color",this.sandTint),this.sandGeometry.setAttribute("aBedStart",this.sandStart),this.sandGeometry.setAttribute("aTintStart",this.sandStartTint);const e=new Yt(this.sandGeometry,this.receiver(!0));e.receiveShadow=!0,this.stones=new Mf(this.silhouettes,this.receiver(!1),192),this.stones.count=0,this.stones.receiveShadow=!0,this.root.add(e,this.stones,t)}receiver(t){const e=new Rl({color:16777215,vertexColors:t,transparent:t,depthWrite:!t});return e.onBeforeCompile=n=>{n.uniforms.uLight=this.uniforms.uLight,n.uniforms.uTime=this.uniforms.uTime,n.uniforms.uWakes=this.uniforms.uWakes,n.uniforms.uWakeDirs=this.uniforms.uWakeDirs,n.uniforms.uLanding=this.uniforms.uLanding,n.vertexShader=`varying vec3 vReceiver;
`+n.vertexShader,t&&(n.uniforms.uCoastMix=this.uniforms.uCoastMix,n.vertexShader=`uniform float uCoastMix;
attribute float aBedStart;
attribute vec3 aTintStart;
`+n.vertexShader,n.vertexShader=n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
transformed.y=mix(aBedStart,position.y,uCoastMix);`),n.vertexShader=n.vertexShader.replace("#include <color_vertex>",`#include <color_vertex>
vColor=mix(aTintStart,color,uCoastMix);`)),n.vertexShader=n.vertexShader.replace("#include <project_vertex>",`
        vec4 receiverLocal=vec4(transformed,1.);
        #ifdef USE_INSTANCING
          receiverLocal=instanceMatrix*receiverLocal;
        #endif
        vReceiver=(modelMatrix*receiverLocal).xyz;
        #include <project_vertex>`),n.fragmentShader=`varying vec3 vReceiver;
`+Hh+`
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
`+wM+(t?`
diffuseColor.a *= 1. - smoothstep(.65, 1.65, max(0., -.18-vReceiver.y));`:""))},e.customProgramCacheKey=()=>t?"lagoon-sand-disturbance-v3":"lagoon-rock-disturbance-v3",e}sync(t,e,n,r=-1){this.field.rebuild(t,e),this.surface.position.x=this.field.region.x+this.field.region.z/2,this.surface.position.z=this.field.region.y+this.field.region.w/2,this.surface.scale.setScalar(Math.max(1,this.field.region.z/70,this.field.region.w/70));const a=n>=0?n:r,s=a>=0&&this.previousBoard.size>0;if(this.transitionStart=r>=0?Gl:Qa,this.transitionEnd=r>=0?Vl:xi,this.previousField.rebuild(s?this.previousBoard:t,s?Ca(this.previousBoard):e,this.field.region),this.uniforms.uCoastMix.value=s?0:1,this.transitionAt=s?this.uniforms.uTime.value:-10,this.shapeBed(),s?this.pendingEdges=e:(this.placeStones(e),this.pendingEdges=null),this.previousBoard=new Map(t),a>=0){const o=ie(a);this.uniforms.uLanding.value.set(o.x,o.z,this.uniforms.uTime.value)}else this.uniforms.uLanding.value.z=-10}shapeBed(){const t=this.field.region,e=this.sandGeometry.getAttribute("position"),n=new Rt("#d4cc9e"),r=new Rt("#79b8aa"),a=new Rt("#467f87"),s=new Rt;for(let o=0;o<=Sn;o++)for(let l=0;l<=Sn;l++){const c=t.x+t.z*l/Sn,u=t.y+t.w*o/Sn,f=o*(Sn+1)+l,d=this.field.depthAt(c,u),h=this.previousField.depthAt(c,u);this.sandStart.setX(f,zn-h),s.copy(n).lerp(r,Kt.smoothstep(h,.28,1.1)).lerp(a,Kt.smoothstep(h,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+u*.83)+.02*Math.cos(c*1.88-u*3.2)),this.sandStartTint.setXYZ(f,s.r,s.g,s.b),e.setXYZ(f,c,zn-d,u),s.copy(n).lerp(r,Kt.smoothstep(d,.28,1.1)).lerp(a,Kt.smoothstep(d,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+u*.83)+.02*Math.cos(c*1.88-u*3.2)),this.sandTint.setXYZ(f,s.r,s.g,s.b)}e.needsUpdate=!0,this.sandTint.needsUpdate=!0,this.sandStart.needsUpdate=!0,this.sandStartTint.needsUpdate=!0,this.sandGeometry.computeVertexNormals(),this.sandGeometry.computeBoundingSphere()}placeStones(t){const e=new Te,n=new Rt("#99a590"),r=new Rt("#467c85"),a=new Rt;let s=0;for(const o of t){let l=Math.imul(o.id+1,127)+o.side*317;const c=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296),u=.18+c()*.64,f=.43+c()*.51,d=Math.cos(o.side*Math.PI/3),h=Math.sin(o.side*Math.PI/3),g=.075+c()*.074,v=c()<.33?1:3;for(let m=0;m<v&&s<this.stones.instanceMatrix.count;m++){const p=u+(c()-.5)*.25,b=f+m*.075,E=Xu(o.ax,o.bx,p)+d*b,_=Xu(o.az,o.bz,p)+h*b,w=this.field.depthAt(E,_),T=g/(1+m*.64);e.position.set(E,zn-w+T*.25,_),e.rotation.set(c()*.32,c()*6.28,c()*.26),e.scale.set(T*(1.25+c()*.45),T*(.6+c()*.18),T),e.updateMatrix(),this.stones.setMatrixAt(s,e.matrix),a.copy(n).lerp(r,Kt.smoothstep(w,.31,1.03)*.84+.09).multiplyScalar(.88+c()*.2),this.stones.setColorAt(s++,a)}}this.stones.count=s,this.stones.instanceMatrix.needsUpdate=!0,this.stones.instanceColor&&(this.stones.instanceColor.needsUpdate=!0),this.stones.computeBoundingSphere()}stir(t,e,n,r,a,s){const o=this.nextWake;this.nextWake=(o+1)%12,this.uniforms.uWakes.value[o].set(t,e,this.uniforms.uTime.value,.15+.85*a),this.uniforms.uWakeDirs.value[o].set(n,r,Math.min(s,1.2),(this.uniforms.uTime.value*1.37+o*.618)%1)}clearWakes(){for(const t of this.uniforms.uWakes.value)t.set(0,0,-10,0)}update(t){this.uniforms.uTime.value=t,this.uniforms.uCoastMix.value=dn(t-this.transitionAt,this.transitionStart,this.transitionEnd),this.pendingEdges&&this.uniforms.uCoastMix.value>=1&&(this.placeStones(this.pendingEdges),this.pendingEdges=null)}}function AM(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),a={},s={},o=i[0].morphTargetsRelative,l=new Ee;let c=0;for(let u=0;u<i.length;++u){const f=i[u];let d=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const h in f.attributes){if(!n.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+h+'" attribute exists among all geometries, or in none of them.'),null;a[h]===void 0&&(a[h]=[]),a[h].push(f.attributes[h]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const h in f.morphAttributes){if(!r.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;s[h]===void 0&&(s[h]=[]),s[h].push(f.morphAttributes[h])}if(t){let h;if(e)h=f.index.count;else if(f.attributes.position!==void 0)h=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,h,u),c+=h}}if(e){let u=0;const f=[];for(let d=0;d<i.length;++d){const h=i[d].index;for(let g=0;g<h.count;++g)f.push(h.getX(g)+u);u+=i[d].attributes.position.count}l.setIndex(f)}for(const u in a){const f=Yu(a[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(const u in s){const f=s[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<f;++d){const h=[];for(let v=0;v<s[u].length;++v)h.push(s[u][v][d]);const g=Yu(h);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function Yu(i){let t,e,n,r=-1,a=0;for(let c=0;c<i.length;++c){const u=i[c];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=u.count*e}const s=new t(a),o=new en(s,e,n);let l=0;for(let c=0;c<i.length;++c){const u=i[c];if(u.isInterleavedBufferAttribute){const f=l/e;for(let d=0,h=u.count;d<h;d++)for(let g=0;g<e;g++){const v=u.getComponent(d,g);o.setComponent(d+f,g,v)}}else s.set(u.array,l);l+=u.count*e}return r!==void 0&&(o.gpuType=r),o}const to=new Map,ir=new Map;function RM(i){return to.has(i)||to.set(i,new gn({color:i,roughness:.95,flatShading:!0})),to.get(i)}function Me(i,t,e,n=0,r=0,a=0){const s=new Yt(t,RM(e));return s.position.set(n,r,a),s.castShadow=!0,s.receiveShadow=!0,i.add(s),s}function Ot(i,t,e,n,r,a,s,o){const l=`b${a},${s},${o}`;return ir.has(l)||ir.set(l,new Ii(a,s,o)),Me(i,ir.get(l),t,e,n,r)}function Se(i,t,e,n,r,a){const s=`s${a}`;return ir.has(s)||ir.set(s,new jr(a,0)),Me(i,ir.get(s),t,e,n,r)}function Si(i,t,e,n=0,r=1){let a=new Ht;if(a.position.set(t,0,e),a.scale.setScalar(r),i.add(a),Me(a,new He(.045,.07,.7,5),7821114,0,.35,0),n%2===0)for(let s=0;s<3;s++)Me(a,new yn(.35-s*.065,.55,7),[4683098,5735786,3761744][(n+s)%3],0,.55+s*.23,0);else Se(a,7575146,-.12,.78,0,.33),Se(a,9152110,.15,.85,.04,.31),Se(a,6720865,0,1.07,0,.29)}function Wl(i,t){for(let e=-.45;e<=.46;e+=.3)Ot(i,12363130,e,.17,t,.045,.34,.045);for(let e=.13;e<.3;e+=.13)Ot(i,13481612,0,e,t,.95,.035,.035)}function CM(i,t=!1,e=!1,n=!1){let r=t?.83:.64,a=t?.7:.48,s=.62;Ot(i,10718573,0,.06,0,r+.08,.12,s+.08),Ot(i,n?11898459:15851448,0,a/2+.1,0,r,a,s);for(let h of[-r/2,r/2])Ot(i,8807237,h,a/2+.1,.32,.045,a,.025);Ot(i,8807237,0,.2,.325,.16,.32,.035),Ot(i,13083501,.025,.19,.35,.02,.025,.025);for(let h of[-.22,.22])Ot(i,8873281,h,.42,.322,.16,.17,.035),Ot(i,9549746,h,.42,.345,.115,.12,.02),Ot(i,15063216,h,.42,.36,.018,.13,.015);let o=new Ee,l=r/2+.12,c=s/2+.1,u=a+.1,f=u+.38;o.setAttribute("position",new Jt([-l,u,-c,l,u,-c,0,f,-c,-l,u,c,0,f,c,l,u,c,-l,u,-c,0,f,-c,0,f,c,-l,u,-c,0,f,c,-l,u,c,l,u,-c,l,u,c,0,f,c,l,u,-c,0,f,c,0,f,-c],3)),o.computeVertexNormals();const d=Me(i,o,e?6125944:n?9860693:12218449);d.material.side=Oe,Ot(i,14930868,.2,f-.06,-.12,.13,.4,.13),Ot(i,10259058,.2,f+.15,-.12,.17,.06,.17);for(let h=0;h<3;h++)Ot(i,7886140,-.27+h*.24,.11,.48,.19,.035,.16);if(e)for(let h=0;h<4;h++){let g=Me(i,new He(.075,.075,.46,7),10451532,.43,.1+h%2*.13,-.16+Math.floor(h/2)*.18);g.rotation.x=Math.PI/2}if(n)for(let h of[-.38,.38])Ot(i,11834206,h,.16,.43,.2,.3,.2),Ot(i,7559999,h,.17,.535,.22,.03,.02);Se(i,7705943,-.43,.13,.32,.16)}function PM(i){let t=new Ht;if(i==="forest")Si(t,-.23,-.2,0,.88),Si(t,.23,-.03,1,.79),Si(t,-.08,.27,2,.7);else if(i==="house"||i==="manor"||i==="lumber"||i==="store")CM(t,i==="manor",i==="lumber",i==="store");else if(i==="berry"||i==="farm"){for(let e of[-.3,0,.3]){Ot(t,8478788,0,.035,e,.9,.065,.18);for(let n=-.34;n<.4;n+=.17)if(i==="berry"){Se(t,6261068,n,.15,e,.12);for(let r=0;r<2;r++)Se(t,12737360,n+(r-.5)*.07,.24,e,.037)}else for(let r=0;r<3;r++){let a=n+(r-1)*.035;Ot(t,11836752,a,.2,e,.014,.35,.014),Me(t,new yn(.035,.14,4),15124342,a,.4,e)}}Wl(t,-.49),i==="farm"&&(Ot(t,10652498,.4,.2,.4,.12,.4,.1),Ot(t,14206358,.4,.35,.4,.34,.12,.1))}else if(i==="garden"){Me(t,new He(.28,.32,.12,10),12105120,0,.07,0),Me(t,new He(.22,.22,.04,12),8302517,0,.15,0),Me(t,new He(.05,.08,.28,8),13157033,0,.25,0),Se(t,13554357,0,.42,0,.09);for(let e=0;e<8;e++){let n=e/8*Math.PI*2;Se(t,6785362,Math.cos(n)*.4,.12,Math.sin(n)*.4,.13),Se(t,e%2?14659206:15259562,Math.cos(n)*.4,.24,Math.sin(n)*.4,.055)}}else if(i==="festival"){for(let e of[-.35,.35])Ot(t,9135944,e,.4,0,.04,.8,.04);Ot(t,14203504,0,.73,0,.75,.035,.035);for(let e=0;e<5;e++)Me(t,new yn(.08,.18,3),e%2?11034965:14993274,-.28+e*.14,.64,0)}else for(let e=0;e<3;e++)Se(t,13018989,(e-1)*.2,.18,0,.2),Ot(t,8162641,(e-1)*.2,.36,0,.04,.15,.04);return t}const Le=new Map;function LM(){const i=new Ht;let t=0;for(const e of[-.3,0,.3]){Ot(i,8478788,0,.035,e,.9,.065,.18);for(let n=-.34;n<.4;n+=.17){const r=new Ht;r.position.set(n,.065,e),r.userData.plantOrder=t++,Se(r,6261068,0,.085,0,.12);for(let a=0;a<2;a++)Se(r,12737360,(a-.5)*.07,.175,0,.037);i.add(r)}}return Wl(i,-.49),i}function IM(){const i=new Ht;let t=0;for(const e of[-.3,0,.3]){Ot(i,8478788,0,.025,e,.9,.05,.18);for(let n=-.34;n<.4;n+=.17){const r=new Ht;r.position.set(n,0,e),r.userData.cropOrder=t++;for(let a=0;a<3;a++)Ot(r,11904091,(a-1)*.035,.19,0,.015,.32,.018),Me(r,new yn(.036,.15,4),15191939,(a-1)*.035,.39,0);i.add(r)}}return Wl(i,-.49),i}function DM(){const i=new Ht;Me(i,new He(.28,.32,.12,10),12105120,0,.07,0),Me(i,new He(.22,.22,.04,12),8302517,0,.15,0),Me(i,new He(.05,.08,.28,8),13157033,0,.25,0),Se(i,13554357,0,.42,0,.09);for(let t=0;t<8;t++){const e=t/8*Math.PI*2,n=new Ht;n.position.set(Math.cos(e)*.4,0,Math.sin(e)*.4),n.userData.flowerOrder=t,Se(n,6785362,0,.12,0,.13),Se(n,t%2?14659206:15259562,0,.24,0,.055),i.add(n)}return i}function UM(){const i=new Ht;Ot(i,8808269,0,.04,-.22,.62,.08,.59),Ot(i,14009496,0,.29,-.24,.48,.5,.42);const t=Me(i,new yn(.46,.34,4),6720913,0,.68,-.24);t.rotation.y=Math.PI/4,Ot(i,7888455,0,.22,-.01,.15,.34,.025),Ot(i,9222576,-.15,.39,-.015,.12,.13,.025);for(let e=0;e<12;e++)Ot(i,e%2?11836016:13283716,0,.025,.25+e*.095,.39,.045,.087);for(const e of[-.15,.15])for(const n of[.45,1.15])Ot(i,8547410,e,-.18,n,.045,.43,.045);return Me(i,new He(.095,.075,.15,8),8362387,.28,.1,.13),Ot(i,13219727,-.27,.14,.03,.13,.25,.15),i}function Ba(i){if(i==="stone"){if(!Le.has(i)){const e=new Ht;for(let n=0;n<3;n++){const r=new Ht;r.userData.treeIndex=n,r.position.set([-.27,.24,0][n],0,[-.18,-.1,.29][n]),Se(r,[9214617,10858405,8162955][n],0,.13,0,.23).scale.set(1,.85,1.05),Se(r,13091748,.08,.23,.05,.055),e.add(r)}Le.set(i,e)}return Le.get(i).clone()}if(i==="garden")return Le.has(i)||Le.set(i,DM()),Le.get(i).clone();if(i==="fisher"||i==="farm")return Le.has(i)||Le.set(i,i==="fisher"?UM():IM()),Le.get(i).clone();if(i==="forest"){if(!Le.has(i)){const e=new Ht;Si(e,-.23,-.2,0,.88),Si(e,.23,-.03,1,.79),Si(e,-.08,.27,2,.7),e.children.forEach((n,r)=>n.userData.treeIndex=r),Le.set(i,e)}return Le.get(i).clone()}if(i==="berry")return Le.has(i)||Le.set(i,LM()),Le.get(i).clone();let t=Le.get(i);if(!t){const e=PM(i);e.updateMatrixWorld(!0);const n=new Map;e.traverse(r=>{if(!(r instanceof Yt))return;const a=r.material,s=r.geometry.clone().applyMatrix4(r.matrixWorld);n.has(a)||n.set(a,[]),n.get(a).push(s)}),t=new Ht;for(const[r,a]of n){const s=AM(a,!1);if(a.forEach(l=>l.dispose()),!s)continue;const o=new Yt(s,r);o.castShadow=!0,o.receiveShadow=!0,t.add(o)}Le.set(i,t)}return t.clone()}class NM{constructor(t,e){this.splash=e,t.add(this.root);const n=new gn({color:16118236,roughness:.85}),r=new gn({color:7438982,roughness:.85}),a=new Vr(.055,6,4),s=new Ee().setAttribute("position",new Jt([0,0,0,.23,.015,-.03,.14,0,.06],3));s.computeVertexNormals(),n.side=Oe,r.side=Oe;for(let c=0;c<5;c++){const u=new Ht,f=new Yt(a,n);f.scale.set(.65,.7,1.6),u.add(f);const d=new Yt(a,n);d.scale.setScalar(.6),d.position.set(0,.025,.09),u.add(d);const h=new Yt(new yn(.015,.055,4),new gn({color:14199907}));h.rotation.x=Math.PI/2,h.position.set(0,.02,.14),u.add(h);const g=[-1,1].map(v=>{const m=new Ht,p=new Yt(s,n);p.scale.x=v,m.add(p);const b=new Yt(s,r);return b.scale.set(v*.3,1,.65),b.position.x=v*.16,m.add(b),u.add(m),m});this.root.add(u),this.birds.push({root:u,wings:g,phase:c*1.93})}const o=new gn({color:8959413,metalness:.18,roughness:.5}),l=new yn(.055,.12,3);for(let c=0;c<2;c++){const u=new Ht,f=new Yt(new Vr(.09,7,5),o);f.scale.set(.5,.65,1.7),u.add(f);const d=new Yt(l,o);d.rotation.x=-Math.PI/2,d.position.z=-.18,u.add(d),u.visible=!1,this.root.add(u),this.fish.push({root:u,start:new I,direction:new I,age:-1,wait:5+c*7,duration:1.25})}}splash;root=new Ht;birds=[];fish=[];center=new I;radius=4;board=new Map;sync(t){this.board=t;const e=[...t.keys()].map(ie);e.length&&(this.center.set(e.reduce((n,r)=>n+r.x,0)/e.length,0,e.reduce((n,r)=>n+r.z,0)/e.length),this.radius=Math.max(3,...e.map(n=>Math.hypot(n.x-this.center.x,n.z-this.center.z)+1.7)))}reset(){for(let t=0;t<this.fish.length;t++){const e=this.fish[t];e.root.visible=!1,e.age=-1,e.wait=5+t*7}}update(t,e){this.birds.forEach((n,r)=>{const a=t*(.11+r*.007)+n.phase,s=this.radius+Math.sin(t*.09+n.phase)*.8;n.root.position.set(this.center.x+Math.cos(a)*s,2.4+r*.24+Math.sin(t*.6+n.phase)*.14,this.center.z+Math.sin(a)*s*.7),n.root.rotation.set(0,Math.atan2(-Math.sin(a),Math.cos(a)*.7),Math.sin(a+n.phase)*.15);const o=Math.sin(t*4.8+n.phase)*.38;n.wings[0].rotation.z=-o,n.wings[1].rotation.z=o});for(const n of this.fish){if(n.age<0){if(n.wait-=e,n.wait>0)continue;let s=!1;for(let o=0;o<12;o++){const l=Math.random()*Math.PI*2,c=this.radius*(.75+Math.random()*.65),u=l+Math.PI/2;if(n.start.set(this.center.x+Math.sin(l)*c,zn,this.center.z+Math.cos(l)*c),n.direction.set(Math.sin(u)*1.5,0,Math.cos(u)*1.5),[0,.25,.5,.75,1].every(f=>!this.board.has(ke(n.start.x+n.direction.x*f,n.start.z+n.direction.z*f)))){s=!0;break}}if(!s){n.wait=3;continue}n.age=0,n.root.visible=!0,this.splash(n.start.x,n.start.z)}n.age+=e;const r=Math.min(1,n.age/n.duration);n.root.position.copy(n.start).addScaledVector(n.direction,r),n.root.position.y+=Math.sin(r*Math.PI)*.65;const a=n.direction.clone();a.y=Math.cos(r*Math.PI)*Math.PI*.65,n.root.quaternion.setFromUnitVectors(new I(0,0,1),a.normalize()),(r>=1||this.board.has(ke(n.root.position.x,n.root.position.z)))&&(this.splash(n.root.position.x,n.root.position.z),n.root.visible=!1,n.age=-1,n.wait=8+Math.random()*15)}}}class FM{root=new Ht;land=new Map;water=new TM;landMat=new gn({vertexColors:!0,roughness:1,flatShading:!0,side:Oe});wildlife;last=0;sinking=new Map;pendingBoard=null;constructor(t){t.add(this.root),t.background=new Rt(9682891),this.root.add(this.water.root),this.wildlife=new NM(t,(e,n)=>this.stir(e,n,1,0,.35,.1))}sync(t,e){this.wildlife.sync(t);for(const r of this.land.keys())t.has(r)||this.removeLand(r);this.pendingBoard=e>=0?new Map(t):null;const n=Ca(t);this.water.sync(t,n,e);for(const r of t.keys()){const a=n.filter(f=>f.id===r).map(f=>f.side).join(","),s=this.land.get(r);if(s){e<0&&s.signature!==a&&(s.surface.geometry.dispose(),s.surface.geometry=za(r,t),s.signature=a);continue}const o=ie(r),l=new Ht;l.position.set(o.x,r===e?-1.1:0,o.z),r===e&&l.scale.set(.35,1,.35);const c=new Yt(za(r,t),this.landMat);c.castShadow=!0,c.receiveShadow=!0;const u=MM(r);if(u.position.set(0,se,0),l.add(c,u),r===he){const f=new Ht;f.position.set(.44,se,-.37),Si(f,0,0,1,.47),l.add(f)}l.visible=r!==e,this.root.add(l),this.land.set(r,{root:l,surface:c,signature:a,age:r===e?0:xi})}}demolish(t,e){this.pendingBoard=new Map(t),this.sinking.set(e,0),this.water.sync(t,Ca(t),-1,e)}removeLand(t){const e=this.land.get(t);e&&(this.root.remove(e.root),e.surface.geometry.dispose(),e.root.traverse(n=>{n instanceof Yt&&n!==e.surface&&n.material.vertexColors&&(n.geometry.dispose(),n.material.dispose())}),this.land.delete(t))}stir(t,e,n,r,a,s){this.water.stir(t,e,n,r,a,s)}update(t){const e=Math.max(0,t-this.last);this.last=t,this.water.update(t),this.wildlife.update(t,e);for(const n of this.land.values())if(n.age<xi){n.age=Math.min(xi,n.age+e);const r=dn(n.age,Qa,xi);n.root.visible=n.age>=Qa,n.root.position.y=-1.1*(1-r),n.root.scale.set(.35+.65*r,1,.35+.65*r)}for(const[n,r]of this.sinking){const a=r+e;this.sinking.set(n,a);const s=this.land.get(n),o=dn(a,Gl,Vl);s&&(s.root.position.y=-1.6*o,s.root.scale.set(1-.7*o,1-.18*o,1-.7*o),s.root.rotation.z=Math.sin(a*25)*Math.sin(o*Math.PI)*.025),a>=Bh&&(this.removeLand(n),this.sinking.delete(n))}if(this.pendingBoard&&this.sinking.size===0&&[...this.land.values()].every(n=>n.age>=xi)){const n=this.pendingBoard,r=Ca(n);for(const[a,s]of this.land){const o=r.filter(l=>l.id===a).map(l=>l.side).join(",");s.signature!==o&&(s.surface.geometry.dispose(),s.surface.geometry=za(a,n),s.signature=o)}this.pendingBoard=null}}reset(){this.wildlife.reset(),this.pendingBoard=null,this.sinking.clear(),this.water.clearWakes();for(const t of this.land.keys())this.removeLand(t)}}function yi(i,t=se){const{x:e,z:n}=ie(i);return new I(e,t,n)}function OM(i){return new Ee().setFromPoints(Array.from({length:6},(t,e)=>{const n=Nr(e,i);return new I(n.x,0,n.z)}))}class zM{root=new Ht;markers=new Ht;ray=new Tf;plane=new Fn(new I(0,1,0),-se);hit=new I;occupied=new Set;rim=OM(ii*.94);rimMat=new wl({color:16578264,transparent:!0,opacity:.9,depthWrite:!1});fillGeo=new is(ii*.94,6,Math.PI/2).rotateX(-Math.PI/2);fillMat=new On({color:12708029,transparent:!0,opacity:.16,depthWrite:!1});hoverMat=new On({color:12117915,transparent:!0,opacity:.48,depthWrite:!1});hover=new Yt(this.fillGeo,this.hoverMat);constructor(t){this.root.add(this.markers,this.hover),this.hover.visible=!1,t.add(this.root)}rebuild(t){this.occupied=new Set(t.keys()),this.markers.clear();for(const e of ed(t)){const n=new Ht;n.position.copy(yi(e,zn+.055)),n.userData.id=e;const r=new Yt(this.fillGeo,this.fillMat),a=new Up(this.rim,this.rimMat);r.renderOrder=4,a.renderOrder=5,n.add(r,a),this.markers.add(n)}}pick(t,e,n,r){const a=r.getBoundingClientRect();if(this.ray.setFromCamera(new Wt((t-a.left)/a.width*2-1,1-(e-a.top)/a.height*2),n),this.plane.constant=-se,!this.ray.ray.intersectPlane(this.plane,this.hit))return-1;const s=ke(this.hit.x,this.hit.z);return this.occupied.has(s)?s:(this.plane.constant=.125,this.ray.ray.intersectPlane(this.plane,this.hit)?ke(this.hit.x,this.hit.z):-1)}showAvailable(t,e){this.markers.visible=t,this.markers.children.forEach(n=>n.visible=e(n.userData.id))}setHover(t,e,n){this.hover.visible=n&&t>=0,this.hover.visible&&(this.hover.position.copy(yi(t,this.occupied.has(t)?se+.012:zn+.067)),this.hover.renderOrder=6,this.hoverMat.color.setHex(e?11790741:14653320))}}class kM{constructor(t,e,n){this.game=t,this.ready=e,this.yaw=n}game;ready;yaw;cache=new Map;step=.1;invalidate(){this.cache.clear()}free(t,e){for(const[g,v]of this.game.board)if(v==="fisher"&&this.ready(g)){const m=ie(g),p=this.yaw(g),b=t-m.x,E=e-m.z,_=b*Math.cos(p)-E*Math.sin(p),w=b*Math.sin(p)+E*Math.cos(p);if(Math.abs(_)<.13&&w>.1&&w<1.04)return!0}const n=ke(t,e),r=this.game.board.get(n);if(!r||!this.ready(n))return!1;const a=ie(n),s=t-a.x,o=e-a.z;for(let g=0;g<6;g++)if(!this.game.board.has(Ye(n)[g])&&s*Math.cos(g*Math.PI/3)+o*Math.sin(g*Math.PI/3)>.745)return!1;const l=this.yaw(n),c=Math.cos(l),u=Math.sin(l),f=s*c-o*u,d=s*u+o*c,h=(g,v,m,p,b=eo)=>f>g*b-.075&&f<v*b+.075&&d>m*b-.075&&d<p*b+.075;if(r==="house"||r==="manor"||r==="store"||r==="lumber"){const g=r==="manor"?.54:.43;if(h(-g,g,-.39,.58)||r==="store"&&(h(-.51,-.25,.26,.59)||h(.25,.51,.26,.59))||n===he&&h(-.6,-.1,-.48,.04))return!1}else if(r==="fisher"){if(h(-.34,.34,-.57,.16))return!1}else if(r==="berry"||r==="farm"){if(h(-.5,.5,-.57,.4,.75))return!1}else if(r==="garden"){if(Math.hypot(f,d)<.44)return!1}else if(r==="forest"||r==="stone"){for(const[g,v]of r==="stone"?[[-.27,-.18],[.24,-.1],[0,.29]]:[[-.23,-.2],[.23,-.03],[-.08,.27]])if(Math.hypot(f-g,d-v)<(r==="stone"?.23:.14))return!1}return!0}segment(t,e){const n=Math.max(1,Math.ceil(Math.hypot(e.x-t.x,e.z-t.z)/.055));for(let r=1;r<=n;r++)if(!this.free(t.x+(e.x-t.x)*r/n,t.z+(e.z-t.z)*r/n))return!1;return!0}nearest(t,e,n=(a,s)=>!0,r=.8){let a=null,s=1/0;for(let o=-r;o<=r;o+=this.step)for(let l=-r;l<=r;l+=this.step){const c=Math.round((t+l)/this.step)*this.step,u=Math.round((e+o)/this.step)*this.step,f=(c-t)**2+(u-e)**2;f<s&&this.free(c,u)&&n(c,u)&&(s=f,a={x:c,z:u,tile:ke(c,u)})}return a}path(t,e,n=()=>0,r=.8){const a=this.nearest(t.x,t.z,(_,w)=>this.segment(t,{x:_,z:w})),s=this.nearest(e.x,e.z,()=>!0,r);if(!a||!s)return null;const o=(_,w)=>`${_},${w}`,l=Math.round(a.x/this.step),c=Math.round(a.z/this.step),u=Math.round(s.x/this.step),f=Math.round(s.z/this.step),d=o(u,f),h=[],g=_=>{h.push(_);for(let w=h.length-1;w>0;){const T=w-1>>1;if(h[T].score<=_.score)break;h[w]=h[T],h[T]=_,w=T}},v=()=>{const _=h[0],w=h.pop();if(h.length){h[0]=w;let T=0;for(;;){let A=T*2+1;if(A>=h.length||(A+1<h.length&&h[A+1].score<h[A].score&&A++,h[T].score<=h[A].score))break;[h[T],h[A]]=[h[A],h[T]],T=A}}return _},m=o(l,c),p=new Map([[m,0]]),b=new Map,E=new Map([[m,{x:l,z:c}]]);g({x:l,z:c,key:m,cost:0,score:Math.hypot(u-l,f-c)});for(let _=0;h.length&&_<14e3;_++){const w=v();if(w.cost===p.get(w.key)){if(w.key===d){const T=[];for(let x=d;;x=b.get(x)){const M=E.get(x);if(T.push({x:M.x*this.step,z:M.z*this.step,tile:ke(M.x*this.step,M.z*this.step)}),x===m)break}T.reverse();const A=[];let C=0;for(;C<T.length;){let x=Math.min(T.length-1,C+12);for(;x>C&&!this.segment(C?T[C-1]:a,T[x]);)x--;A.push(T[x]),C=x+1}return this.free(e.x,e.z)&&this.segment(A[A.length-1]??a,e)&&A.push({...e,tile:ke(e.x,e.z)}),A}for(const[T,A]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){const C=w.x+T,x=w.z+A,M=o(C,x),L=C*this.step,F=x*this.step;let z=this.cache.get(M);if(z===void 0&&(z=this.free(L,F),this.cache.set(M,z)),!z||!this.segment({x:w.x*this.step,z:w.z*this.step},{x:L,z:F}))continue;const W=w.cost+Math.hypot(T,A)+n(L,F);W>=(p.get(M)??1/0)||(p.set(M,W),b.set(M,w.key),E.set(M,{x:C,z:x}),g({x:C,z:x,key:M,cost:W,score:W+Math.hypot(u-C,f-x)}))}}}return null}}class BM{constructor(t,e,n){this.hooks=e,this.overlay=n,t.add(this.root)}hooks;overlay;root=new Ht;game=null;nav=null;citizens=[];time=0;spawned=new Set;spawnClock=0;buckets=new Map;assignedTo(t){return this.citizens.filter(e=>e.job?.source===t).length}assignedCounts(){return Object.fromEntries(Fr.map(t=>[t,this.citizens.filter(e=>e.job?.category===t).length]))}get working(){return this.citizens.filter(t=>t.job!==null).length}refreshNavigation(){this.nav?.invalidate()}rebalance(){if(!this.game)return;const t=this.game.workTargets(),e=this.assignedCounts();for(const n of[...this.citizens].reverse())n.job?.category&&n.stage!=="to-store"&&e[n.job.category]>t[n.job.category]&&(e[n.job.category]--,this.releaseJob(n))}releaseJob(t){t.job&&this.hooks.harvestProgress(t.job.source,t.id,0),t.job=null,t.stage="idle",t.path=[],t.retry=.1,t.bundle.visible=!1,t.line.visible=!1,t.bobber.visible=!1,t.fish.visible=!1,t.axe.visible=!1,t.pickaxe.visible=!1,t.rod.visible=!1,t.waitReason="",t.target=null}reset(t){for(const e of this.citizens)e.status.remove(),e.bundle.geometry.dispose(),e.bundle.material.dispose(),e.line.geometry.dispose(),e.line.material.dispose(),e.bobber.geometry.dispose(),e.bobber.material.dispose();this.root.clear(),this.citizens=[],this.spawned.clear(),this.game=t,this.time=0,this.spawnClock=0,this.nav=new kM(t,e=>this.hooks.ready(e),e=>this.hooks.yaw(e))}neighbors(t,e){const n=[],r=Math.floor(t/.32),a=Math.floor(e/.32);for(let s=-1;s<=1;s++)for(let o=-1;o<=1;o++)n.push(...this.buckets.get(`${r+s}:${a+o}`)??[]);return n}clear(t,e,n){return this.neighbors(e,n).every(r=>r===t||Math.hypot(r.root.position.x-e,r.root.position.z-n)>.21)}route(t,e,n,r=!1){const a=ie(e),s=this.hooks.yaw(e),o=n??new I(a.x+Math.sin(s)*.65,se,a.z+Math.cos(s)*.65),l=this.nav.path(t.root.position,o,(c,u)=>this.neighbors(c,u).reduce((f,d)=>f+(d!==t&&Math.hypot(d.root.position.x-c,d.root.position.z-u)<.32?4:0),0)+t.avoid.reduce((f,d)=>f+(Math.hypot(d.x-c,d.z-u)<.26?8:0),0),r?.18:.65);return l?.length?(t.nodeMarker="",t.stuck=0,t.bestDistance=1/0,t.path=l,t.target=new I(l[l.length-1].x,se,l[l.length-1].z),this.hooks.trail(l),!0):!1}spawn(t,e){const n=ie(e),r=this.hooks.yaw(e),a=this.nav.nearest(n.x+Math.sin(r)*.65,n.z+Math.cos(r)*.65,(C,x)=>this.citizens.every(M=>Math.hypot(M.root.position.x-C,M.root.position.z-x)>.23),1.1);if(!a)return;const s=new Ht,o=new Ht;s.add(o),o.position.y=.16,Ot(o,[7969937,11897456,10132338,8229283][t%4],0,.075,0,.115,.15,.075),Se(o,14858897,0,.2,0,.062),Se(o,[6441788,9728847,5130302][t%3],0,.228,-.012,.052);for(const C of[-.022,.022])Se(o,4537906,C,.205,.054,.006);const l=[-1,1].map(C=>{const x=new Ht;return x.position.set(C*.083,.125,0),o.add(x),Ot(x,14660235,0,-.065,0,.035,.13,.035),x}),c=[-1,1].map(C=>{const x=new Ht;return x.position.set(C*.035,.155,0),s.add(x),Ot(x,5858653,0,-.065,0,.044,.13,.045),Ot(x,6706759,0,-.13,.018,.05,.035,.075),x}),u=new Yt(new Ii(.11,.1,.09),new gn({color:11306581,roughness:1}));u.position.set(0,.235,.11),u.visible=!1,s.add(u);const f=new Ht;Ot(f,9136455,0,-.13,.04,.022,.19,.022),Ot(f,10464938,.025,-.19,.04,.09,.045,.025),l[0].add(f),f.visible=!1;const d=new Ht;Ot(d,9136455,0,-.13,.04,.022,.22,.022);const h=Ot(d,11450290,0,-.23,.04,.17,.025,.027);h.rotation.z=.16,l[0].add(d),d.visible=!1;const g=new Ht;g.position.set(0,-.12,0),Ot(g,8677451,0,.28,0,.013,.58,.013),g.rotation.x=1,l[0].add(g),g.visible=!1;const v=new bf(new Ee().setAttribute("position",new en(new Float32Array(36),3)),new wl({color:14869969,transparent:!0,opacity:.8}));v.frustumCulled=!1,v.visible=!1;const m=new Vr(.032,12,12).toNonIndexed(),p=[],b=m.getAttribute("position");for(let C=0;C<b.count;C+=3){const x=(b.getY(C)+b.getY(C+1)+b.getY(C+2))/3,M=new Rt(Math.floor((x+.032)/.016)%2===0?14965840:16774623);for(let L=0;L<3;L++)p.push(M.r,M.g,M.b)}m.scale(.85,1.25,.85),m.setAttribute("color",new Jt(p,3));const E=new Yt(m,new gn({vertexColors:!0,roughness:.55}));E.visible=!1;const _=new Ht;Se(_,9747131,0,0,0,.055).scale.set(.55,.7,1.6);const T=HM();_.add(T),_.visible=!1,s.position.set(a.x,se,a.z),s.rotation.y=r+Math.PI;const A=document.createElement("div");A.className="citizen-status",A.setAttribute("role","img"),this.overlay.append(A),this.root.add(s,v,E,_),this.spawned.add(t),this.citizens.push({id:t,root:s,body:o,arms:l,legs:c,bundle:u,axe:f,pickaxe:d,rod:g,line:v,bobber:E,fish:_,stage:"idle",path:[],target:null,job:null,clock:0,retry:.6+t%7*.1,phase:t*1.73,birth:t===0?1:0,speed:0,wait:0,status:A,lastStatus:"",eatUntil:0,hungry:!1,waitReason:"",searchUntil:0,stuck:0,bestDistance:1/0,nodeMarker:"",avoid:[]})}findJob(t){const e=this.game,n=ke(t.root.position.x,t.root.position.z),r=e.workTargets(),a=this.assignedCounts(),s=[...e.board.keys()].map(o=>({source:o,recipe:e.productAt(o),category:e.categoryFor(o)})).filter(({source:o,recipe:l,category:c})=>l&&this.hooks.resourceReady(o)&&this.hooks.ready(o)&&(c?a[c]<r[c]:e.happy<70)&&this.assignedTo(o)<l.capacity).sort((o,l)=>Va(n,o.source)-Va(n,l.source));for(const{source:o,recipe:l,category:c}of s){const u=e.storageFor(o).find(h=>this.hooks.ready(h)&&e.canStore(h,l.resource));if(u===void 0)continue;let f=l.resource==="wood"||l.resource==="stone"?-1:t.id%2;if((c==="farm"||c==="berry")&&(f=[0,1].find(h=>!this.citizens.some(g=>g.job?.source===o&&g.job.tree===h&&g.stage!=="to-store"))??-1,f<0))continue;if(l.resource==="wood"||l.resource==="stone")for(let h=0;h<3;h++){const g=this.hooks.pickTree(o,(t.id+h)%3);if(g>=0&&!this.citizens.some(v=>v.job?.source===o&&v.job.tree===g&&v.stage!=="to-store")){f=g;break}}if((l.resource==="wood"||l.resource==="stone")&&f<0)continue;const d=e.board.get(o)==="fisher"?this.hooks.fishingSpot(o):null;if(!(e.board.get(o)==="fisher"&&!d)&&this.route(t,o,d?.stand??this.hooks.workPoint(o,f)))return t.job={source:o,store:u,resource:l.resource,amount:l.amount,tree:f,category:c},t.stage="to-work",t.clock=0,!0}return!1}wander(t){const e=ke(t.root.position.x,t.root.position.z),n=[e,...Ye(e)].filter(o=>this.game.board.has(o)&&this.hooks.ready(o));if(!n.length)return;const r=n[Math.floor((Math.sin(this.time+t.phase)+1)*.499*n.length)],a=ie(r),s=this.time*.7+t.phase;this.route(t,r,new I(a.x+Math.sin(s)*.7,se,a.z+Math.cos(s)*.7))}move(t,e){if(!t.path.length)return t.speed*=Math.exp(-10*e),!1;const n=t.path[0];if(!this.nav.free(n.x,n.z))return t.path=[],!1;const r=n.x-t.root.position.x,a=n.z-t.root.position.z,s=Math.hypot(r,a);if(s<.035)return t.path.shift(),t.nodeMarker="",!1;const o=`${n.x}:${n.z}`;if(t.nodeMarker!==o?(t.nodeMarker=o,t.bestDistance=s,t.stuck=0):s<t.bestDistance-.035?(t.bestDistance=s,t.stuck=0):t.stuck+=e,t.stuck>1.1)return this.recover(t),!1;const l=Math.atan2(r,a),c=Kt.euclideanModulo(l-t.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;t.speed+=((.82+t.id%4*.025)*Math.max(.35,1-Math.abs(c)/Math.PI*.65)-t.speed)*(1-Math.exp(-7*e));const u=Math.min(s,t.speed*e),f=r/s,d=a/s,h={x:t.root.position.x,z:t.root.position.z},g=Math.min(.06,e*.8),m=[{x:h.x+f*u,z:h.z+d*u},{x:h.x+f*u-d*g,z:h.z+d*u+f*g},{x:h.x+f*u+d*g,z:h.z+d*u-f*g},{x:h.x-d*g,z:h.z+f*g},{x:h.x+d*g,z:h.z-f*g}].find(p=>this.clear(t,p.x,p.z)&&this.nav.segment(h,p));return m?(t.wait=0,t.root.position.x=m.x,t.root.position.z=m.z,t.root.rotation.y+=c*(1-Math.exp(-15*e)),Math.hypot(n.x-m.x,n.z-m.z)<.035&&t.path.shift(),!0):(t.wait+=e,t.speed*=.8,t.wait>.6&&this.recover(t),!1)}recover(t){if(this.nav.invalidate(),t.searchUntil=this.time+1.5,t.wait=0,t.stuck=0,t.path[0]&&t.avoid.push({x:t.path[0].x,z:t.path[0].z,until:this.time+4}),t.path=[],t.stage==="to-store"){t.target=null,t.job&&(t.job.store=-1),t.retry=0;return}if(t.job){const e=t.job.category==="fish"?this.hooks.fishingSpot(t.job.source)?.stand:this.hooks.workPoint(t.job.source,t.job.tree);if(e&&this.route(t,t.job.source,e))return;t.retry=.5}else t.retry=.2}sendToStorage(t){const e=t.job;if(!e)return;const n=this.game;if(e.resource==="happy"&&n.happy>=100){this.releaseJob(t);return}const r=n.storageFor(e.source).filter(o=>this.hooks.ready(o)),a=r.filter(o=>n.canStore(o,e.resource));if(!a.length){t.waitReason=r.length?"full":"path",t.retry=.7;return}if(e.store>=0&&a.includes(e.store)&&t.target&&Math.hypot(t.root.position.x-t.target.x,t.root.position.z-t.target.z)<.1&&Math.hypot(t.root.position.x-ie(e.store).x,t.root.position.z-ie(e.store).z)<1.05){const o=this.hooks.deliver(e.source,e.store,e.resource,e.amount);if(e.amount-=o,e.amount<=0){this.releaseJob(t),t.retry=.35;return}t.target=null,e.store=-1,t.retry=.1;return}const s=a.sort((o,l)=>Math.hypot(t.root.position.x-ie(o).x,t.root.position.z-ie(o).z)-Math.hypot(t.root.position.x-ie(l).x,t.root.position.z-ie(l).z));for(const o of s){const l=ie(o),c=this.hooks.yaw(o),f=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3].map(d=>new I(l.x+Math.sin(c+d)*.67,se,l.z+Math.cos(c+d)*.67)).filter(d=>this.nav.free(d.x,d.z)&&this.clear(t,d.x,d.z)).sort((d,h)=>t.root.position.distanceTo(d)-t.root.position.distanceTo(h));for(const d of f)if(this.route(t,o,d,!0)){e.store=o,t.waitReason="";return}}t.waitReason="path",t.searchUntil=this.time+1.2,t.retry=.6}updateStatuses(t,e,n){const r=new I;for(const a of this.citizens){const s=a.eatUntil>this.time,o=a.bundle.visible,l=s?a.hungry?"hungry":"eat":o?a.waitReason==="full"?"full":"carry":a.job?a.job.category??"garden":"rest",c=l==="carry"?a.job?.category??"garden":l,u=`${l}:${c}`;if(u!==a.lastStatus){a.lastStatus=u,a.status.innerHTML=_n(c),a.status.dataset.state=l;const g=l==="carry"?`Depoya taşıyor · ${$u[c]??""}`:$u[l]??"Dinleniyor";a.status.setAttribute("aria-label",g),a.status.title=g}r.copy(a.root.position),r.y+=.58,r.project(t),a.status.hidden=r.z<-1||r.z>1,a.status.style.left=`${(r.x+1)*e/2}px`,a.status.style.top=`${(1-r.y)*n/2}px`;const f=t,d=n/((f.top-f.bottom)/f.zoom),h=Kt.smoothstep(d,42,100);a.status.style.opacity=String(a.birth*h),a.status.style.setProperty("--status-scale",String(.35+.65*h)),a.status.hidden=a.status.hidden||h<.01}}fishing(t,e){const n=this.hooks.fishingSpot(t.job.source);if(!n)return;const r=t.clock,a=r-e,s=n.water;t.root.rotation.y=Math.atan2(s.x-t.root.position.x,s.z-t.root.position.z),t.rod.visible=!0;const o=Kt.smoothstep(r,.7,1.35),l=Kt.smoothstep(r,5.8,7.2);t.arms[0].rotation.x=r<.7?-.8-r*.5:r<1.35?-.95+o*.9:r>5.8?-.1-l*.9:-.1,t.arms[1].rotation.x=-.35,t.rod.rotation.x=.75,t.root.updateMatrixWorld(!0);const c=t.rod.localToWorld(new I(0,.58,0)),u=t.root.localToWorld(new I(0,.24,.15)),f=new I().lerpVectors(c,s,o);f.y+=Math.sin(o*Math.PI)*.45,r>=1.35&&(f.copy(s),f.y+=Math.sin(this.time*4)*.015),r>5.8&&(f.lerpVectors(s,u,l),f.y+=Math.sin(l*Math.PI)*.38),t.bobber.visible=r>.7&&r<7.25,t.bobber.position.copy(f),t.line.visible=t.bobber.visible;const d=t.line.geometry.getAttribute("position");for(let h=0;h<12;h++){const g=h/11;d.setXYZ(h,Kt.lerp(c.x,f.x,g),Kt.lerp(c.y,f.y,g)-Math.sin(g*Math.PI)*.06,Kt.lerp(c.z,f.z,g))}d.needsUpdate=!0,t.fish.visible=r>5.9&&r<7.2,t.fish.position.copy(f),t.fish.rotation.z=Math.sin(this.time*22)*.25,a<1.35&&r>=1.35&&this.hooks.splash(s.x,s.z),r>1.35&&r<5.8&&Math.floor(r/.9)!==Math.floor(a/.9)&&this.hooks.splash(s.x,s.z)}update(t){const e=this.game;if(!(!e||!this.nav)){this.time+=t,e.tick(t),this.spawnClock-=t;for(const n of e.takeMeals()){const r=this.citizens.find(a=>a.id===n.id);r&&(r.eatUntil=this.time+1.5,r.hungry=!n.ate)}if(this.spawnClock<=0){for(const n of e.residents)!this.spawned.has(n.id)&&this.hooks.ready(n.home)&&this.spawn(n.id,n.home);this.spawnClock=.35}this.buckets.clear();for(const n of this.citizens){const r=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`;this.buckets.has(r)||this.buckets.set(r,[]),this.buckets.get(r).push(n)}for(const n of this.citizens){n.avoid=n.avoid.filter(g=>g.until>this.time),n.birth=Math.min(1,n.birth+t*2),n.root.scale.setScalar(Math.max(.01,n.birth*n.birth*(3-2*n.birth)));const r=ke(n.root.position.x,n.root.position.z);if(!this.nav.free(n.root.position.x,n.root.position.z)){const g=ie(e.residents[n.id]?.home??he),v=this.nav.nearest(e.board.has(r)?n.root.position.x:g.x,e.board.has(r)?n.root.position.z:g.z,(m,p)=>this.citizens.every(b=>b===n||Math.hypot(b.root.position.x-m,b.root.position.z-p)>.23),1.2);if(v){const m=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`,p=this.buckets.get(m);if(p){const E=p.indexOf(n);E>=0&&p.splice(E,1)}n.root.position.x=v.x,n.root.position.z=v.z,n.path=[];const b=`${Math.floor(v.x/.32)}:${Math.floor(v.z/.32)}`;this.buckets.has(b)||this.buckets.set(b,[]),this.buckets.get(b).push(n)}else continue}if(n.job&&!e.board.has(n.job.source)&&this.releaseJob(n),n.retry-=t,n.eatUntil>this.time){n.axe.visible=!1,n.pickaxe.visible=!1,n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.body.rotation.x=.06,n.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12,n.arms[1].rotation.x=n.bundle.visible?-.8:-.2,n.legs.forEach(g=>g.rotation.x=0);continue}n.stage==="idle"&&n.retry<=0&&(n.retry=1.5+n.id%3*.2,!this.findJob(n)&&!n.path.length&&this.wander(n));const a=this.move(n,t);if(n.stage==="to-work"&&!n.path.length&&n.job&&n.retry<=0)if(n.target&&Math.hypot(n.target.x-n.root.position.x,n.target.z-n.root.position.z)<.17)n.stage="working",n.clock=0;else{const g=n.job.category==="fish"?this.hooks.fishingSpot(n.job.source)?.stand:this.hooks.workPoint(n.job.source,n.job.tree);(!g||!this.route(n,n.job.source,g))&&(n.retry=.6,n.searchUntil=this.time+1)}n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1;const s=n.stage==="working",o=s&&(n.job?.resource==="wood"||n.job?.resource==="stone"),l=s&&n.job?.category==="fish",c=this.time*9+n.phase;n.root.position.y=se+(l?.035:0)+(a?Math.abs(Math.sin(c))*.012:Math.sin(this.time*2+n.phase)*.002),n.body.rotation.x=s?o?.12:.45+Math.sin(n.clock*4)**2*.22:a?.05:Math.sin(this.time*1.4+n.phase)*.02;const u=n.clock*1.7%1,f=Kt.smoothstep(u,0,.6),d=Kt.smoothstep(u,.6,.76),h=Kt.smoothstep(u,.76,1);if(n.arms[0].rotation.x=o?-.3-f*1.9+d*2.1-h*.2:s?-.9:a?Math.sin(c)*.45:Math.sin(this.time*1.7+n.phase)*.08,n.arms[1].rotation.x=o?-.25:s?-.9:a?-Math.sin(c)*.45:-Math.sin(this.time*1.7+n.phase)*.08,n.legs[0].rotation.x=a?Math.sin(c)*.55:0,n.legs[1].rotation.x=a?-Math.sin(c)*.55:0,n.axe.visible=!!o&&n.job?.resource==="wood",n.pickaxe.visible=!!o&&n.job?.resource==="stone",s&&n.job){if(l){const v=this.hooks.fishingSpot(n.job.source);if(!v||Math.hypot(n.root.position.x-v.stand.x,n.root.position.z-v.stand.z)>.22){n.clock=0,n.stage="to-work",n.path=[],n.target=null,n.retry=0;continue}}n.clock+=t,o&&n.clock>.3&&Math.floor(n.clock*1.7-.72)!==Math.floor((n.clock-t)*1.7-.72)&&this.hooks.impact(n.job.source,n.job.tree);const g=l?7.5:o?n.job.resource==="stone"?6.8:6:2.4;if(l)n.body.rotation.x=.05,this.fishing(n,t);else{const v=this.hooks.workPoint(n.job.source,n.job.tree);n.root.rotation.y=Math.atan2(v.x-.12-n.root.position.x,v.z-.15-n.root.position.z),this.hooks.harvestProgress(n.job.source,n.id,Math.min(1,n.clock/g))}n.clock>=g&&(this.hooks.harvest(n.job.source,n.job.resource,n.job.tree,n.id)?(n.bundle.visible=!0,n.bundle.material.color.setHex(n.job.category==="fish"?9088955:n.job.category==="farm"?14137438:n.job.resource==="stone"?9872028:n.job.resource==="wood"?10844239:12019029),n.stage="to-store",n.path=[],n.retry=0):this.releaseJob(n),n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.rod.visible=!1)}n.stage==="to-store"&&n.job&&!n.path.length&&n.retry<=0&&this.sendToStorage(n),n.bundle.visible&&n.arms.forEach(g=>g.rotation.x=-.8)}}}}function HM(){const i=new Yt(new yn(.05,.065,3),new gn({color:7576476,roughness:.7}));return i.position.z=-.09,i.rotation.x=Math.PI/2,i}const $u={stone:"Taş çıkarıyor",wood:"Odun kesiyor",berry:"Çilek topluyor",farm:"Buğday biçiyor",fish:"Balık tutuyor",garden:"Çiçek topluyor",carry:"Depoya taşıyor",full:"Depo dolu",rest:"Dinleniyor",eat:"Yemek yiyor",hungry:"Yiyecek yok",search:"Alternatif yol arıyor"};function GM(){const i=document.createElement("canvas");i.width=64,i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,1,32,32,31);e.addColorStop(0,"rgba(50,61,39,.43)"),e.addColorStop(.6,"rgba(55,63,39,.19)"),e.addColorStop(1,"rgba(58,65,42,0)"),t.fillStyle=e,t.fillRect(0,0,64,64);const n=new Np(i);return n.colorSpace=Je,new On({map:n,transparent:!0,depthWrite:!1})}function VM(){const i=Ba("house"),t=new Ht;t.position.set(-.34,0,-.21),i.add(t),Me(t,new He(.205,.24,.77,8),15062190,0,.405,0),Me(t,new He(.24,.2,.065,8),9795928,0,.812,0),Me(t,new He(.16,.16,.29,8),6847604,0,.99,0);for(let r=0;r<4;r++){let a=r*Math.PI/2+.4;Ot(t,12296567,Math.cos(a)*.172,.99,Math.sin(a)*.172,.038,.3,.038)}Me(t,new yn(.29,.37,8),5734528,0,1.29,0),Ot(t,9402454,0,1.58,0,.023,.23,.023);const e=new Ee;e.setAttribute("position",new Jt([0,1.69,0,.26,1.62,.018,0,1.56,0],3)),e.computeVertexNormals();const n=new Yt(e,new Rl({color:14394711,side:Oe}));return t.add(n),i}class WM{constructor(t){this.el=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nf,this.renderer.toneMapping=fo,this.renderer.toneMappingExposure=1.03,t.append(this.renderer.domElement),this.cameraControl=new vM(this.renderer.domElement),this.scene.add(new Dc(16773592,8689792,1.55),this.root);const e=this.sun;e.position.set(-5,10,4),e.castShadow=!0,Object.assign(e.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31}),e.shadow.mapSize.set(2048,2048),e.shadow.bias=-12e-5,e.shadow.normalBias=.015,this.scene.add(e,e.target),this.environment=new FM(this.scene),this.villagers=new BM(this.scene,{ready:a=>this.ready(a),yaw:a=>this.buildings.get(a)?.rotation.y??0,resourceReady:a=>this.resourceReady(a),pickTree:(a,s)=>this.pickTree(a,s),workPoint:(a,s)=>this.workPoint(a,s),harvest:(a,s,o,l)=>this.harvest(a,s,o,l),harvestProgress:(a,s,o)=>{const l=`${a}:${s}`;o?this.harvestParts.set(l,{id:a,progress:o}):this.harvestParts.delete(l)},fishingSpot:a=>this.fishingSpot(a),impact:(a,s)=>this.woodImpact(a,s),splash:(a,s)=>this.environment.stir(a,s,1,0,.45,.1),trail:a=>this.addTrail(a),deliver:(a,s,o,l)=>this.onDelivery(a,s,o,l)},this.el),this.scene.add(this.trails),this.trails.count=0,this.trails.frustumCulled=!1,this.grid=new zM(this.scene);const n=()=>{const{clientWidth:a,clientHeight:s}=t;this.renderer.setSize(a,s),this.cameraControl.resize(a,s)};new ResizeObserver(n).observe(t),n();const r=this.renderer.domElement;r.addEventListener("pointermove",a=>{this.selected&&!a.buttons&&this.point(a.clientX,a.clientY)}),r.addEventListener("pointerleave",()=>{this.setHover(-1),this.lastSea=null,this.onInspect(-1,0,0,null)}),r.addEventListener("pointermove",a=>{this.stirSea(a),this.inspectPointer(a)}),r.addEventListener("click",a=>{if(a.button===0){if(this.selected){const s=this.point(a.clientX,a.clientY);s>=0&&this.onPick(s)}else if(!this.placing&&!document.querySelector("dialog[open]")){const s=this.grid.pick(a.clientX,a.clientY,this.cameraControl.camera,this.el);this.editTile(this.board.has(s)?s:-1)}}}),window.addEventListener("wheel",a=>{if((!this.selected||this.selected.event)&&this.editing<0||document.querySelector("dialog[open]"))return;a.preventDefault(),a.stopImmediatePropagation();const s=a.deltaY*(a.deltaMode===1?16:a.deltaMode===2?300:1);this.wheelRotation=Kt.clamp(this.wheelRotation+s,-240,240);const o=Math.trunc(this.wheelRotation/60);o&&(this.wheelRotation-=o*60,this.rotateSelection(o))},{capture:!0,passive:!1}),window.addEventListener("keydown",a=>{a.key.toLowerCase()!=="r"||a.repeat||a.ctrlKey||a.metaKey||a.altKey||document.querySelector("dialog[open]")||a.target instanceof Element&&a.target.closest("input,textarea,select,[contenteditable]")||(this.selected&&!this.selected.event||this.editing>=0)&&(a.preventDefault(),this.rotateSelection(a.shiftKey?-1:1))}),this.renderer.setAnimationLoop(this.frame)}el;scene=new Ac;renderer=new uu({antialias:!0,alpha:!1,powerPreference:"high-performance"});cameraControl;grid;environment;villagers;game=null;fullStores=new Map;treeCycles=new Map;fields=new Map;harvestParts=new Map;loaders=new Map;trails=new Mf(new is(.055,5).rotateX(-Math.PI/2),new On({color:13417621,transparent:!0,opacity:.42,depthWrite:!1}),8e3);trailPoints=[];trailKeys=new Set;fisherOffset=0;sparkMat=new On({color:16768138});stoneChipMat=new gn({color:10069664,roughness:1});woodHits=new Map;root=new Ht;buildings=new Map;editing=-1;rotationTargets=new Map;demolitions=[];ghost=null;ghostModel=null;desiredGhostYaw=0;ghostManualCell=-1;placedManualCell=-1;lastRotationWake=0;wheelRotation=0;placementQueued=!1;previewLand=null;previewLandMat=new gn({vertexColors:!0,roughness:1,flatShading:!0,side:Oe});seaRay=new Tf;seaPlane=new Fn(new I(0,1,0),-zn);seaPoint=new I;lastSea=null;board=new Map;sun=new Fc(16769463,2.35);ghostPalette=[];ghostTarget=new I;contact=GM();contactGeo=new Ti(1.48,1.26).rotateX(-Math.PI/2);moteGeo=new jr(.032,0);moteMats=[15321987,12966298,14333578].map(t=>new On({color:t}));builds=[];motes=[];labels=[];rings=[];ringGeo=new Al(.47,.49,32).rotateX(-Math.PI/2);projection=new I;selected=null;previousTime=performance.now();time=0;hover=-1;valid=t=>!1;onHover=t=>{};onPick=t=>{};onTileSelect=t=>{};onDelivery=(t,e,n,r)=>0;onInspect=(t,e,n,r)=>{};bindGame(t){this.game=t,this.villagers.reset(t)}ready(t){return this.board.has(t)&&this.buildings.has(t)&&!this.builds.some(e=>e.id===t)&&!this.demolitions.some(e=>e.id===t)}pickTree(t,e){for(let n=0;n<3;n++){const r=(e+n)%3;if(!this.treeCycles.has(`${t}:${r}`)&&this.buildings.get(t)?.children.some(a=>a.userData.treeIndex===r))return r}return-1}workPoint(t,e){const n=ie(t),r=this.buildings.get(t),a=r?.children.find(c=>c.userData.treeIndex===e);if(a){a.updateWorldMatrix(!0,!1);const c=a.getWorldPosition(new I);return new I(c.x+.18,se,c.z+.18)}const s=r?.rotation.y??0,o=["farm","berry"].includes(this.board.get(t)??"")?e%2?-.18:.18:0,l=.62;return new I(n.x+o*Math.cos(s)+l*Math.sin(s),se,n.z-o*Math.sin(s)+l*Math.cos(s))}harvest(t,e,n,r){if(this.harvestParts.delete(`${t}:${r}`),!this.ready(t))return!1;if(e==="wood"||e==="stone"){const a=`${t}:${n}`,s=this.buildings.get(t)?.children.find(o=>o.userData.treeIndex===n);if(!s||this.treeCycles.has(a))return!1;this.treeCycles.set(a,{id:t,tree:s,age:0,scale:s.scale.clone()}),s.updateWorldMatrix(!0,!1),this.makeLoader(a,t,s.getWorldPosition(new I).add(new I(0,.5,0)),30)}else if(this.board.get(t)==="berry"||this.board.get(t)==="farm"||this.board.get(t)==="garden"){const a=this.fieldState(t);if(a.stock<=0)return!1;if(a.stock--,a.stock===0){a.age=0;const s=ie(t);this.makeLoader(`field:${t}`,t,new I(s.x,se+.6,s.z),30)}}else if(this.board.get(t)==="fisher"&&!this.fishingSpot(t))return!1;return!0}updateStorageLabels(){const t=this.game;if(!t)return;const e=this.cameraControl.camera,n=this.el.clientHeight/((e.top-e.bottom)/e.zoom),r=Kt.smoothstep(n,42,100);for(const[a,s]of this.fullStores)(!t.storageStocks.has(a)||t.storageFree(a)>0)&&(s.remove(),this.fullStores.delete(a));for(const a of t.storageStocks.keys()){if(t.storageFree(a)>0||!this.ready(a))continue;let s=this.fullStores.get(a);s||(s=document.createElement("div"),s.className="storage-full",s.innerHTML=`${_n("full")}<span>Depo dolu</span>`,s.setAttribute("role","status"),this.el.append(s),this.fullStores.set(a,s));const o=this.screenPoint(a,1.1);s.style.left=`${o.x}px`,s.style.top=`${o.y}px`,s.style.opacity=String(r),s.style.setProperty("--status-scale",String(.35+.65*r)),s.hidden=r<.01}}woodImpact(t,e){const n=this.buildings.get(t)?.children.find(s=>s.userData.treeIndex===e);if(!n)return;this.woodHits.set(n,.2),n.updateWorldMatrix(!0,!1);const r=n.getWorldPosition(new I),a=this.board.get(t)==="stone";for(let s=0;s<(a?7:5);s++){const o=new Yt(this.moteGeo,a?s<2?this.sparkMat:this.stoneChipMat:this.moteMats[0]);o.scale.setScalar(.45),o.position.copy(r).add(new I(0,.25,0)),this.scene.add(o),this.motes.push({mesh:o,velocity:new I((Math.random()-.5)*.45,.35+Math.random()*.25,(Math.random()-.5)*.45),life:a?.35:.45})}}fieldState(t){if(!this.fields.has(t)){const e=this.board.get(t)==="farm"?4:3;this.fields.set(t,{stock:e,max:e,age:0})}return this.fields.get(t)}resourceReady(t){const e=this.board.get(t);return e==="forest"||e==="stone"?this.pickTree(t,0)>=0:e==="berry"||e==="farm"||e==="garden"?this.fieldState(t).stock>0:e==="fisher"?!!this.fishingSpot(t):!0}coastalYaw(t,e=0,n=0){const r=ie(t),a=Ye(t).filter(d=>!this.board.has(d)).map(d=>{const h=ie(d);return Math.atan2(h.x-r.x,h.z-r.z)});if(!a.length)return e;const s=(d,h)=>Kt.euclideanModulo(d-h+Math.PI,Math.PI*2)-Math.PI;let o=e;if(n&&a.length>1){const d=Math.sign(n);for(let h=0;h<Math.abs(n);h++){const g=a.map(v=>({a:v,d:Kt.euclideanModulo((v-o)*d,Math.PI*2)})).filter(v=>v.d>.04).sort((v,m)=>v.d-m.d)[0];g&&(o+=g.d*d)}return o}const l=[...this.board.keys()].map(ie),c=l.reduce((d,h)=>({x:d.x+h.x/l.length,z:d.z+h.z/l.length}),{x:0,z:0}),u=d=>{const h=r.x+Math.sin(d)*2.8,g=r.z+Math.cos(d)*2.8;return Math.min(...l.map(v=>Math.hypot(h-v.x,g-v.z)))+Math.hypot(h-c.x,g-c.z)*.15},f=a.sort((d,h)=>u(h)-u(d)||Math.abs(s(d,e))-Math.abs(s(h,e)))[0];return e+s(f,e)}alignFisheries(){for(const[t,e]of this.board)if(e==="fisher"){const n=this.buildings.get(t);if(!n)continue;const r=this.rotationTargets.get(t)??n.rotation.y;if(n.userData.manualCoast){const s=ie(t);if(!this.board.has(ke(s.x+Math.sin(r)*1.75,s.z+Math.cos(r)*1.75)))continue;n.userData.manualCoast=!1}const a=this.coastalYaw(t,r);Math.abs(a-r)>.01&&this.rotationTargets.set(t,a)}}fishingSpot(t){const e=this.buildings.get(t);if(!e||this.board.get(t)!=="fisher"||!this.ready(t))return null;const n=ie(t),r=this.rotationTargets.get(t)??e.rotation.y,a=Math.sin(r),s=Math.cos(r),o=new I(n.x+a*1.75,zn+.03,n.z+s*1.75);return this.board.has(ke(o.x,o.z))?null:{stand:new I(n.x+a*.94,se,n.z+s*.94),water:o}}makeLoader(t,e,n,r){this.loaders.get(t)?.el.remove();const a=document.createElement("div");a.className="regrowth-loader",a.innerHTML="<i></i><span></span>",a.setAttribute("aria-label","Yeniden büyüyor"),this.el.append(a),this.loaders.set(t,{id:e,el:a,point:n,total:r})}updateLoader(t,e){const n=this.loaders.get(t);if(!n)return;if(!this.board.has(n.id)||e>=n.total){n.el.remove(),this.loaders.delete(t);return}const r=this.cameraControl.camera,a=this.el.clientHeight/((r.top-r.bottom)/r.zoom),s=Kt.smoothstep(a,42,100);n.el.style.opacity=String(s),n.el.hidden=s<.01;const o=n.point.clone().project(r);n.el.style.left=`${(o.x+1)*this.el.clientWidth/2}px`,n.el.style.top=`${(1-o.y)*this.el.clientHeight/2}px`,n.el.style.setProperty("--progress",`${e/n.total*360}deg`),n.el.querySelector("span").textContent=`${Math.ceil(n.total-e)}s`}addTrail(t){const e=new Te;for(let n=1;n<t.length;n++){const r=t[n-1],a=t[n],s=Math.ceil(Math.hypot(a.x-r.x,a.z-r.z)/.16);for(let o=0;o<=s;o++){const l=Kt.lerp(r.x,a.x,o/Math.max(1,s)),c=Kt.lerp(r.z,a.z,o/Math.max(1,s)),u=`${Math.round(l/.13)}:${Math.round(c/.13)}`;if(this.trailKeys.has(u)||this.trailPoints.length>=8e3)continue;this.trailKeys.add(u);const f=ke(l,c);this.trailPoints.push({tile:f,x:l,z:c}),e.position.set(l,se+.007,c),e.rotation.y=n+o*.8,e.scale.set(1,.7,.8),e.updateMatrix(),this.trails.setMatrixAt(this.trailPoints.length-1,e.matrix)}}this.trails.count=this.trailPoints.length,this.trails.instanceMatrix.needsUpdate=!0}screenPoint(t,e=.7){const n=ie(t),r=new I(n.x,e,n.z).project(this.cameraControl.camera);return{x:(r.x+1)*this.el.clientWidth/2,y:(1-r.y)*this.el.clientHeight/2}}inspectPointer(t){if(this.selected||t.buttons||document.querySelector("dialog[open]")){this.onInspect(-1,0,0,null);return}const e=this.grid.pick(t.clientX,t.clientY,this.cameraControl.camera,this.el);if(!this.board.has(e)){this.onInspect(-1,0,0,null),this.renderer.domElement.style.cursor="";return}this.renderer.domElement.style.cursor="pointer";const n=ie(e),r=Array.from({length:6},(a,s)=>{const o=Nr(s),l=new I(n.x+o.x,se,n.z+o.z).project(this.cameraControl.camera);return{x:(l.x+1)*this.el.clientWidth/2,y:(1-l.y)*this.el.clientHeight/2}});this.onInspect(e,t.clientX,t.clientY,{left:Math.min(...r.map(a=>a.x)),right:Math.max(...r.map(a=>a.x)),top:Math.min(...r.map(a=>a.y))-35,bottom:Math.max(...r.map(a=>a.y))})}holdSelection(){this.placementQueued=!0,this.cameraControl.setPlacement(!1)}get placementRotation(){return this.placedManualCell=this.ghostManualCell,this.desiredGhostYaw}rotateSelection(t){if(this.lastRotationWake=this.time-.06,this.villagers.refreshNavigation(),this.selected&&!this.selected.event)this.selected.id==="fisher"&&(this.ghostManualCell=this.hover),this.desiredGhostYaw=this.selected.id==="fisher"&&this.hover>=0?this.coastalYaw(this.hover,this.desiredGhostYaw,t):this.desiredGhostYaw+t*Math.PI/3;else if(this.editing>=0&&!this.placing){const e=this.buildings.get(this.editing);if(e){this.board.get(this.editing)==="fisher"&&(e.userData.manualCoast=!0);const n=this.rotationTargets.get(this.editing)??e.rotation.y;this.rotationTargets.set(this.editing,this.board.get(this.editing)==="fisher"?this.coastalYaw(this.editing,n,t):n+t*Math.PI/3)}}}get placing(){return this.builds.length>0||this.demolitions.length>0}editTile(t){this.editing=t,this.wheelRotation=0,this.grid.setHover(t,!0,t>=0),this.onTileSelect(t)}demolish(t,e){const n=this.buildings.get(e);n&&(this.editTile(-1),this.rotationTargets.delete(e),this.board=t,this.grid.rebuild(t),this.grid.showAvailable(!1,this.valid),this.environment.demolish(t,e),this.demolitions.push({id:e,group:n,time:0}))}point(t,e){if(this.placementQueued)return this.hover;const r=document.elementFromPoint(t,e)===this.renderer.domElement?this.grid.pick(t,e,this.cameraControl.camera,this.el):-1;return this.setHover(r),r}stirSea(t){if(t.buttons||this.selected||t.pointerType==="touch"){this.lastSea=null;return}const e=this.renderer.domElement.getBoundingClientRect();if(this.seaRay.setFromCamera(new Wt((t.clientX-e.left)/e.width*2-1,1-(t.clientY-e.top)/e.height*2),this.cameraControl.camera),!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(ke(this.seaPoint.x,this.seaPoint.z))){this.lastSea=null;return}const{x:n,z:r}=this.seaPoint,a=performance.now()/1e3,s=this.lastSea;if(s&&a-s.time<.04||(this.lastSea={x:n,z:r,time:a},!s||a-s.time>.25))return;const o=n-s.x,l=r-s.z,c=Math.hypot(o,l);c<.025||c>2||this.environment.stir(n,r,o/c,l/c,Math.min(1,c/(a-s.time)/12),c)}setHover(t,e=!1){if(this.editing>=0&&!this.selected){this.grid.setHover(this.editing,!0,!0);return}if(!e&&t===this.hover)return;this.hover=t;const n=t>=0&&this.valid(t);if(this.grid.setHover(t,n,!!this.selected),this.ghost){const r=this.ghost.visible;this.ghost.visible=t>=0,t>=0&&(this.selected?.id==="fisher"&&this.ghostManualCell!==t&&(this.desiredGhostYaw=this.coastalYaw(t,this.desiredGhostYaw)),this.ghostTarget.copy(yi(t,this.board.has(t)?se+.035:se+.025)),r||this.ghost.position.copy(this.ghostTarget),this.ghostPalette.forEach(({mat:a,base:s})=>{a.color.copy(s).lerp(new Rt(n?12969902:15304821),n?.04:.65),a.opacity=n?1:.45,a.transparent=!n,a.depthWrite=n}))}if(this.previewLand&&(this.ghost?.remove(this.previewLand),this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&n&&!this.selected?.event&&!this.board.has(t)){const r=new Map(this.board);r.set(t,this.selected.id),this.previewLand=new Yt(za(t,r),this.previewLandMat),this.previewLand.position.y=-se-.025/.7,this.previewLand.receiveShadow=!0,this.ghost.add(this.previewLand)}this.onHover(t)}setSelection(t,e=!1){this.ghostManualCell=-1,this.editTile(-1),this.onInspect(-1,0,0,null);const n=!!t&&t===this.selected,r=n?this.desiredGhostYaw:0,a=n?this.ghostModel?.rotation.y??r:0;this.cameraControl.setPlacement(e),this.previewLand&&(this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&(this.scene.remove(this.ghost),this.ghost=null),this.ghostPalette.forEach(s=>s.mat.dispose()),this.ghostPalette=[],this.selected=t,this.fisherOffset=n?this.fisherOffset:0,this.placementQueued=!1,this.ghostModel=null,this.desiredGhostYaw=r,this.wheelRotation=0,t&&(this.ghost=new Ht,this.ghostModel=Ba(t.id),this.ghostModel.rotation.y=a,this.ghost.add(this.ghostModel),this.ghost.scale.setScalar(.7),this.ghost.traverse(s=>{if(s instanceof Yt){const o=s.material.clone();this.ghostPalette.push({mat:o,base:o.color.clone()}),o.transparent=!0,o.opacity=.72,o.depthWrite=!1,s.material=o,s.castShadow=!1,s.receiveShadow=!1,s.renderOrder=0}}),this.scene.add(this.ghost),this.ghost.visible=!1),this.grid.showAvailable(!!t&&!t.event,this.valid),this.setHover(-1,!0)}sync(t,e=-1,n=0,r=!1){const a=this.buildings.size===0;if(this.board=t,this.villagers.refreshNavigation(),this.trailPoints.some(s=>!t.has(s.tile))){const s=this.trailPoints.filter(o=>t.has(o.tile));this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const o of s)this.addTrail([o,{...o,x:o.x+.001}])}if(a||e>=0||r){this.grid.rebuild(t),this.environment.sync(t,e);const s=[...t.keys()].map(ie);this.cameraControl.frameIsland(s,a);const o=(Math.max(...s.map(u=>u.x))+Math.min(...s.map(u=>u.x)))/2,l=(Math.max(...s.map(u=>u.z))+Math.min(...s.map(u=>u.z)))/2,c=Math.max(3,...s.map(u=>Math.hypot(u.x-o,u.z-l)+2));this.sun.target.position.set(o,0,l),this.sun.position.set(o-5,10,l+4),Object.assign(this.sun.shadow.camera,{left:-c,right:c,top:c,bottom:-c,far:35+c}),this.sun.shadow.camera.updateProjectionMatrix()}t.forEach((s,o)=>{const l=this.buildings.get(o);if(!s){l&&(this.root.remove(l),this.buildings.delete(o));return}if(l)return;const c=o===he&&s==="house"?VM():Ba(s),u=new Yt(this.contactGeo,this.contact);u.position.y=.0025,u.renderOrder=1,c.add(u),c.scale.setScalar(["house","manor","store","lumber","fisher"].includes(s)?eo:["berry","farm"].includes(s)?.75:1),c.position.copy(yi(o)),this.root.add(c),this.buildings.set(o,c),o===e&&(s==="fisher"&&this.placedManualCell===o&&(c.userData.manualCoast=!0),c.rotation.y=n,c.scale.setScalar(.01),c.visible=!1,c.position.y-=.74,this.builds.push({id:o,group:c,time:0,kind:s}))}),this.alignFisheries()}pulse(t,e){const n=new On({color:e,transparent:!0,opacity:.8,depthWrite:!1}),r=new Yt(this.ringGeo,n);r.position.copy(yi(t,se+.024)),r.renderOrder=4,this.scene.add(r),this.rings.push({mesh:r,time:0})}burst(t){this.pulse(t,16768922);for(let e=0;e<14;e++){const n=e/14*Math.PI*2,r=new Yt(this.moteGeo,this.moteMats[e%3]);r.position.copy(yi(t,.18)),r.position.x+=Math.cos(n)*.22,r.position.z+=Math.sin(n)*.22,this.scene.add(r),this.motes.push({mesh:r,velocity:new I(Math.cos(n)*.62,.62+Math.random()*.7,Math.sin(n)*.62),life:1})}}feedback(t,e,n=[]){t.rows.filter(r=>r.wood||r.food||r.happy||!r.active).forEach((r,a)=>{const s=document.createElement("div");s.className="float"+(r.bonus?" bonus":""),s.textContent=[r.wood&&`+${r.wood} odun`,r.food&&`+${r.food} yiyecek`,r.happy&&`+${r.happy} refah`,!r.active&&"İşçi bekliyor"].filter(Boolean).join(" · "),s.style.opacity="0",this.el.append(s),this.labels.push({el:s,position:yi(r.i,1.05),life:1.4,delay:(r.i===e?1.5:.1)+a*.035}),(n.includes(r.i)||r.bonus&&r.i===e)&&this.pulse(r.i,16242041)})}reset(){for(const t of this.fullStores.values())t.remove();this.fullStores.clear(),this.placedManualCell=-1,this.setSelection(null),this.cameraControl.reset(),this.treeCycles.clear(),this.woodHits.clear(),this.fields.clear(),this.harvestParts.clear(),this.loaders.forEach(t=>t.el.remove()),this.loaders.clear(),this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0,this.root.clear(),this.environment.reset(),this.buildings.clear(),this.builds=[],this.demolitions=[],this.rotationTargets.clear();for(const{el:t}of this.labels)t.remove();this.labels=[];for(const{mesh:t}of this.motes)this.scene.remove(t);this.motes=[];for(const{mesh:t}of this.rings)this.scene.remove(t),t.material.dispose();this.rings=[]}frame=t=>{const e=Math.min(.065,(t-this.previousTime)/1e3);if(this.previousTime=t,this.time+=e,this.cameraControl.update(e),this.environment.update(this.time),this.ghost?.visible&&(this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-32*e)),this.ghostModel)){const n=this.desiredGhostYaw-this.ghostModel.rotation.y;if(this.ghostModel.rotation.y+=n*(1-Math.exp(-16*e)),Math.abs(n)>.025&&this.time-this.lastRotationWake>.05&&this.valid(this.hover)){const r=this.ghostModel.rotation.y,a=Math.sign(n),s=this.ghost.position;this.environment.stir(s.x+Math.cos(r)*.68,s.z+Math.sin(r)*.68,-Math.sin(r)*a,Math.cos(r)*a,.32,.1),this.lastRotationWake=this.time}}for(const[n,r]of this.rotationTargets){const a=this.buildings.get(n);if(!a){this.rotationTargets.delete(n);continue}this.villagers.refreshNavigation();const s=r-a.rotation.y;if(a.rotation.y+=s*(1-Math.exp(-16*e)),Math.abs(s)<.001)a.rotation.y=r,this.rotationTargets.delete(n);else if(this.time-this.lastRotationWake>.05){const o=a.rotation.y,l=Math.sign(s);this.environment.stir(a.position.x+Math.cos(o)*.8,a.position.z+Math.sin(o)*.8,-Math.sin(o)*l,Math.cos(o)*l,.35,.1),this.lastRotationWake=this.time}}this.demolitions=this.demolitions.filter(n=>{n.time+=e;const r=dn(n.time,Gl,Vl);return n.group.position.y=se-1.6*r,n.group.scale.setScalar(1-.7*r),n.group.rotation.z=Math.sin(n.time*25)*Math.sin(r*Math.PI)*.035,n.time>=Bh?(this.root.remove(n.group),this.buildings.delete(n.id),this.sync(this.board,-1,0,!0),!1):!0}),this.builds=this.builds.filter(n=>{const r=n.time;if(n.time=Math.min(Tr,n.time+e),n.group.visible=n.time>=Ra,n.time<Ra)return!0;r<1.42&&n.time>=1.42&&this.burst(n.id);const a=dn(n.time,Ra,Tr),s=Math.sin(Math.PI*a)*.14,o=["house","manor","store","lumber","fisher"].includes(n.kind)?eo:["berry","farm"].includes(n.kind)?.75:1;return n.group.scale.set(Math.max(.01,(a+s)*o),Math.max(.01,(a+s*1.6)*o),Math.max(.01,(a+s)*o)),n.group.position.y=se-.24*(1-a),n.kind==="berry"&&n.group.children.forEach(l=>{if(l.userData.plantOrder!==void 0){const c=dn(n.time,Ra+l.userData.plantOrder*.018,Tr);l.scale.setScalar(Math.max(.01,c))}}),n.time>=Tr&&this.villagers.refreshNavigation(),n.time<Tr}),this.villagers.update(document.hidden?0:e),this.villagers.updateStatuses(this.cameraControl.camera,this.el.clientWidth,this.el.clientHeight),this.updateStorageLabels();for(const[n,r]of this.woodHits){const a=r-e;n.rotation.x=Math.sin(a*45)*.035*Math.max(0,a/.2),a<=0?(n.rotation.x=0,this.woodHits.delete(n)):this.woodHits.set(n,a)}for(const[n,r]of this.treeCycles){if(!this.board.has(r.id)){this.updateLoader(n,99),this.treeCycles.delete(n);continue}r.age+=e,this.updateLoader(n,r.age),this.board.get(r.id)==="stone"&&r.age<.6?(r.tree.scale.copy(r.scale).multiplyScalar(1-dn(r.age,0,.6)),r.tree.position.y=-.08*dn(r.age,0,.6)):r.age<.6?(r.tree.rotation.z=dn(r.age,0,.6)*1.5,r.tree.scale.copy(r.scale).multiplyScalar(1-.12*r.age/.6)):r.age<26?r.tree.visible=!1:(r.tree.visible=!0,r.tree.rotation.z=0,r.tree.position.y=0,r.tree.scale.copy(r.scale).multiplyScalar(Math.max(.01,dn(r.age,26,30)))),r.age>=30&&(r.tree.scale.copy(r.scale),this.treeCycles.delete(n))}for(const[n,r]of this.fields){if(!this.board.has(n)){this.updateLoader(`field:${n}`,99),this.fields.delete(n);continue}const a=this.board.get(n),s=30;r.stock===0&&(r.age+=e,this.updateLoader(`field:${n}`,r.age),r.age>=s&&(r.stock=r.max,r.age=0));const o=[...this.harvestParts.values()].filter(u=>u.id===n).reduce((u,f)=>u+f.progress,0),l=r.stock===0?dn(r.age,s-4,s):Math.max(0,(r.stock-o)/r.max),c=this.buildings.get(n)?.children.filter(u=>u.userData.plantOrder!==void 0||u.userData.cropOrder!==void 0||u.userData.flowerOrder!==void 0)??[];c.forEach((u,f)=>{const d=Kt.clamp(l*c.length-f,0,1);a==="farm"?u.scale.y=.08+.92*d:u.children.slice(1).forEach(h=>h.scale.setScalar(Math.max(.01,d)))})}this.motes=this.motes.filter(n=>(n.life-=e*1.65,n.velocity.y-=e*2.7,n.mesh.position.addScaledVector(n.velocity,e),n.mesh.scale.setScalar(Math.max(0,n.life)),n.life<=0&&this.scene.remove(n.mesh),n.life>0)),this.rings=this.rings.filter(n=>{n.time+=e*1.65,n.mesh.scale.setScalar(.4+n.time*1.15);const r=n.mesh.material;return r.opacity=Math.max(0,1-n.time)*.7,n.time>=1&&(this.scene.remove(n.mesh),r.dispose()),n.time<1}),this.labels=this.labels.filter(n=>{if(n.delay>0)return n.delay-=e,!0;n.life-=e,n.position.y+=e*.38;const r=this.projection.copy(n.position).project(this.cameraControl.camera);return n.el.style.left=`${(r.x+1)*.5*this.el.clientWidth}px`,n.el.style.top=`${(1-r.y)*.5*this.el.clientHeight}px`,n.el.style.opacity=String(Math.max(0,Math.min(1,n.life*2.8))),n.life<=0&&n.el.remove(),n.life>0}),this.renderer.render(this.scene,this.cameraControl.camera)};thumbnails(){const t={},e=new Ac;e.add(new Dc(16774109,8557944,1.65));const n=new Fc(16769464,2.55);n.position.set(-3,5,4),e.add(n);const r=new rs(-.96,.96,.75,-.75,.1,20);r.position.set(2.9,2.25,3.7),r.lookAt(0,.43,0);const a=new uu({alpha:!0,antialias:!0});a.setSize(280,220),a.toneMapping=fo;for(const s of Zn){const o=Ba(s.id);Me(o,new He(.72,.75,.068,6),10336124,0,-.034,0),e.add(o),a.render(e,r),t[s.id]=a.domElement.toDataURL(),e.remove(o)}return a.dispose(),a.forceContextLoss(),t}}class XM{constructor(t,e){this.hand=t,this.callbacks=e;const n={signal:this.listeners.signal};t.addEventListener("pointerdown",this.onDown,n),window.addEventListener("pointermove",this.onMove,{...n,passive:!1}),window.addEventListener("pointerup",this.onUp,n),window.addEventListener("pointercancel",this.onPointerCancel,n),t.addEventListener("lostpointercapture",this.onLostCapture,n),t.addEventListener("click",this.onClick,{...n,capture:!0}),t.addEventListener("dragstart",this.onNativeDrag,n),window.addEventListener("keydown",this.onKey,n),window.addEventListener("blur",this.onBlur,n),document.addEventListener("visibilitychange",this.onVisibility,n)}hand;callbacks;gesture=null;listeners=new AbortController;settling=new Set;disposed=!1;animationFrame=0;cardFrom(t){if(!(t instanceof Element))return null;const e=t.closest("[data-card]");return e&&this.hand.contains(e)?e:null}isAvailable(t,e){return Number.isInteger(e)&&!t.matches(':disabled, [disabled], [aria-disabled="true"]')&&this.callbacks.canStart(e)}onDown=t=>{if(this.disposed||this.gesture||!t.isPrimary||t.button!==0)return;const e=this.cardFrom(t.target);if(!e)return;const n=Number(e.dataset.card);if(!this.isAvailable(e,n))return;const r=e.getBoundingClientRect(),a=e.offsetWidth||r.width,s=e.offsetHeight||r.height;this.gesture={pointerId:t.pointerId,index:n,source:e,origin:r,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,width:a,height:s,anchorX:Math.min(1,Math.max(0,(t.clientX-r.left)/r.width)),anchorY:Math.min(1,Math.max(0,(t.clientY-r.top)/r.height)),started:!1,valid:!1,ghost:null,visualX:t.clientX,visualY:t.clientY,tilt:0,visualTilt:0},t.preventDefault();try{this.hand.setPointerCapture(t.pointerId)}catch{}};onMove=t=>{const e=this.gesture;if(!(!e||t.pointerId!==e.pointerId)){if(t.preventDefault(),!e.started){if(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)<4)return;if(!this.isAvailable(e.source,e.index)){this.cancel();return}e.started=!0,e.visualX=t.clientX,e.visualY=t.clientY;const n=e.source.cloneNode(!0);n.removeAttribute("id"),n.removeAttribute("data-card"),n.removeAttribute("aria-pressed"),n.querySelectorAll("[id]").forEach(r=>r.removeAttribute("id")),n.classList.remove("selected","drag-source"),n.classList.add("drag-card"),n.setAttribute("aria-hidden","true"),n.setAttribute("inert",""),n.tabIndex=-1,Object.assign(n.style,{position:"fixed",left:"0",top:"0",margin:"0",width:`${e.width}px`,height:`${e.height}px`,pointerEvents:"none",zIndex:"100",transition:"none",transformOrigin:"50% 50%",willChange:"transform"}),e.ghost=n,document.body.append(n),document.body.classList.add("is-dragging"),this.callbacks.start(e.index),this.hand.querySelector(`[data-card="${e.index}"]`)?.classList.add("drag-source"),e.source.classList.add("drag-source"),this.follow(e,performance.now())}this.gesture===e&&(e.valid=this.callbacks.move(t.clientX,t.clientY),e.ghost?.classList.toggle("drop-valid",e.valid),e.ghost?.classList.toggle("drop-invalid",!e.valid),e.tilt=Math.max(-7,Math.min(7,(t.clientX-e.lastX)*.22)),e.lastX=t.clientX,e.lastY=t.clientY)}};follow(t,e){if(this.gesture!==t||!t.ghost)return;const n=performance.now(),r=Math.min(.05,Math.max(.001,(n-e)/1e3)),a=1-Math.exp(-38*r);t.visualX+=(t.lastX-t.visualX)*a,t.visualY+=(t.lastY-t.visualY)*a,t.visualTilt+=(t.tilt-t.visualTilt)*(1-Math.exp(-22*r)),t.tilt*=Math.exp(-12*r),t.ghost.style.transform=this.followTransform(t),this.animationFrame=requestAnimationFrame(()=>this.follow(t,n))}followTransform(t){const n=t.visualX-t.width*(.5+(t.anchorX-.5)*.84),r=t.visualY-t.height*(.5+(t.anchorY-.5)*.84);return`translate3d(${n}px, ${r}px, 0) rotate(${t.visualTilt}deg) scale(${.84})`}onUp=t=>{const e=this.gesture;if(!e||t.pointerId!==e.pointerId||(!e.started&&Math.hypot(t.clientX-e.startX,t.clientY-e.startY)>=4&&this.onMove(t),this.gesture!==e))return;if(this.release(e),!e.started){this.isAvailable(e.source,e.index)&&this.callbacks.tap(e.index);return}e.lastX=t.clientX,e.lastY=t.clientY;const r=this.callbacks.move(t.clientX,t.clientY)&&this.callbacks.drop(t.clientX,t.clientY);r||this.callbacks.cancel(),this.settle(e,r)};release(t){this.gesture=null,cancelAnimationFrame(this.animationFrame),this.animationFrame=0,document.body.classList.remove("is-dragging"),t.source.classList.remove("drag-source"),this.hand.querySelectorAll(".drag-source").forEach(e=>e.classList.remove("drag-source")),this.hand.hasPointerCapture(t.pointerId)&&this.hand.releasePointerCapture(t.pointerId)}settle(t,e){const n=t.ghost;if(!n)return;if(e){n.remove();return}n.classList.remove("drop-valid","drop-invalid"),this.settling.add(n);const a=this.hand.querySelector(`[data-card="${t.index}"]`)?.getBoundingClientRect()??t.origin,s=a.left+(a.width-t.width)/2,o=a.top+(a.height-t.height)/2,l=e?`translate3d(${t.lastX-t.width/2}px, ${t.lastY-t.height/2}px, 0) scale(.15)`:`translate3d(${s}px, ${o}px, 0) rotate(0deg) scale(1)`,c=matchMedia("(prefers-reduced-motion: reduce)").matches?0:e?180:280;n.animate([{transform:n.style.transform||this.followTransform(t),opacity:1},{transform:l,opacity:e?0:.2}],{duration:c,easing:"cubic-bezier(.2,.8,.25,1)",fill:"forwards"}).finished.catch(()=>{}).then(()=>{n.remove(),this.settling.delete(n)})}cancel(){const t=this.gesture;t&&(this.release(t),t.started&&(this.callbacks.cancel(),this.settle(t,!1)))}onClick=t=>{const e=this.cardFrom(t.target);if(e&&(t.preventDefault(),t.stopImmediatePropagation(),t.detail===0&&!this.gesture)){const n=Number(e.dataset.card);this.isAvailable(e,n)&&this.callbacks.tap(n)}};onNativeDrag=t=>{t.preventDefault()};onPointerCancel=t=>{t.pointerId===this.gesture?.pointerId&&this.cancel()};onLostCapture=t=>{t.pointerId===this.gesture?.pointerId&&this.cancel()};onKey=t=>{t.key==="Escape"&&this.gesture&&(t.preventDefault(),this.cancel())};onBlur=()=>{this.cancel()};onVisibility=()=>{document.hidden&&this.cancel()};dispose(){this.cancel(),this.disposed=!0,this.listeners.abort(),this.settling.forEach(t=>{t.getAnimations().forEach(e=>e.cancel()),t.remove()}),this.settling.clear()}}const ju={hover:[["card-slide-1","card-slide-3"],.16],lift:[["card-fan-1","card-fan-2"],.39],drop:[["card-place-1","card-place-3"],.45],earth:[["footstep_grass_001","footstep_grass_003"],.46],build:[["impactWood_light_000","impactWood_light_003"],.33],reward:[["chip-lay-2"],.22],bonus:[["chips-stack-3"],.3],turn:[["card-shove-2"],.2],invalid:[["impactSoft_medium_002"],.27]},qu=i=>Math.max(0,Math.min(1,i));class YM{muted=!1;levels={master:.72,sfx:.7,ambience:.36};ctx=null;buses={};wave=null;clips=new Map;live=new Set;pending=new Set;lastHover=0;constructor(){try{const e=JSON.parse(localStorage.getItem("lk-audio-v2")||"{}");this.muted=typeof e.muted=="boolean"?e.muted:localStorage.getItem("lk-mute")==="1";for(const n of Object.keys(this.levels))Number.isFinite(e[n])&&(this.levels[n]=qu(e[n]))}catch{}const t=()=>this.unlock();window.addEventListener("pointerdown",t,{passive:!0}),window.addEventListener("keydown",t),document.addEventListener("visibilitychange",()=>{document.hidden?(this.wave?.pause(),this.cancel()):this.apply()})}unlock(){if(window.AudioContext){if(!this.ctx){this.ctx=new AudioContext;const t=this.ctx.createGain();t.connect(this.ctx.destination),this.buses.master=t;for(const r of["sfx","ambience"]){const a=this.ctx.createGain();a.connect(t),this.buses[r]=a}const e=new Audio(new URL("audio/shore.mp3",document.baseURI).href);e.preload="none",e.loop=!0,this.wave=e,this.ctx.createMediaElementSource(e).connect(this.buses.ambience);const n=new Set(Object.values(ju).flatMap(([r])=>[...r]));for(const r of n)fetch(new URL("audio/"+r+".ogg",document.baseURI)).then(a=>{if(!a.ok)throw Error(r);return a.arrayBuffer()}).then(a=>this.ctx.decodeAudioData(a)).then(a=>this.clips.set(r,a)).catch(()=>{});this.apply()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0&&this.wave.play().catch(()=>{})}}set(t,e){this.levels[t]=qu(e),this.apply(),this.save()}toggle(){this.muted=!this.muted,this.apply(),this.save()}save(){try{localStorage.setItem("lk-audio-v2",JSON.stringify({...this.levels,muted:this.muted}))}catch{}}apply(){if(this.ctx){for(const t of["master","sfx","ambience"]){const e=t==="master"&&this.muted?0:this.levels[t];this.buses[t]?.gain.setTargetAtTime(e*e,this.ctx.currentTime,.035)}this.muted||document.hidden||!this.levels.ambience||!this.levels.master?this.wave?.pause():this.wave?.paused&&this.wave.play().catch(()=>{})}}play(t){if(this.muted||document.hidden||!this.ctx||this.ctx.state!=="running"||this.live.size>=3)return;if(t==="hover"){if(performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}const[e,n]=ju[t],r=this.clips.get(e[Math.floor(Math.random()*e.length)]);if(!r)return;const a=this.ctx.createBufferSource();a.buffer=r,a.playbackRate.value=.92+Math.random()*.1;const s=this.ctx.createGain();s.gain.value=n*(.9+Math.random()*.13),a.connect(s).connect(this.buses.sfx),a.onended=()=>{this.live.delete(a),a.disconnect(),s.disconnect()},this.live.add(a),a.start()}sequence(t,e,n){this.cancel(),this.play("drop");const r=(a,s)=>{const o=window.setTimeout(()=>{this.pending.delete(o),this.play(a)},s);this.pending.add(o)};t||r("earth",145),e&&r("build",325),r(n?"bonus":"reward",520),r("turn",855)}cancel(){for(const t of this.pending)clearTimeout(t);this.pending.clear()}}const Xl=document.querySelector("#app");Xl.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${_n("help")}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${_n("reset")}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <button id="population-toggle" aria-expanded="false" aria-controls="work-panel">${_n("people")}<span>Görevler</span><b id="population-badge">1</b></button>
 <section id="work-panel" hidden aria-label="Nüfus görev dağılımı"><header><strong>İş öncelikleri</strong><button data-work-balance>Dengele</button><button data-work-close aria-label="Kapat">×</button></header><p id="work-summary"></p><div id="work-rows"></div></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;const Pt=i=>Xl.querySelector(i),Ci=Pt("#hand"),ts=Pt("#placement"),Ha=Pt("#log"),on=Pt("dialog"),Zt=new WM(Pt("#world")),$M=Zt.thumbnails(),cn=new YM;let St=new tf,ze=null,fr,ol,hr=!1,rr=null,Xr=-1;function Yl(i){return i.cost<=St.wood&&(i.id!=="festival"||St.food>=3)}function ni(i,t=!1){i||(rr=null),ze=i,Pt("#event-target").hidden=!i?.event,Zt.setSelection(i,t),Ci.classList.toggle("choosing",!!i),Ci.querySelectorAll("[data-card]").forEach(e=>{const n=!!i&&St.hand[Number(e.dataset.card)]===i;e.classList.toggle("selected",n),e.setAttribute("aria-pressed",String(n))}),Pt(".hand-label span").textContent=i?i.event?"Adanın üzerine bırak":"Kıyıya bırak · Tekerlek / R ile döndür":"Bir kartı adaya sürükle"}function Cr(i){ts.textContent=i,ts.hidden=!i}Zt.valid=i=>!!ze&&i>=0&&St.valid(ze,i);Zt.onHover=i=>{if(!ze||i<0){Cr("");return}if(!Zt.valid(i)){Cr(ze.event?"Mevcut karaya bırak":St.wouldSealFishery(i)?"Balıkçının son kıyısı açık kalmalı":"Yalnızca kıyıdaki boş bir altıgene bırak"),ts.dataset.valid="false";return}if(ts.dataset.valid="true",ze.event){Cr(ze.desc);return}const t=St.preview(ze,i),e=[t.stone&&`+${t.stone} taş / teslimat`,t.wood&&`+${t.wood} odun / teslimat`,t.food&&`+${t.food} yiyecek / teslimat`,t.happy&&`+${t.happy} refah / teslimat`,t.people&&`+${t.people} nüfus`].filter(Boolean),n=t.localBonus||t.neighbors.length>0;Cr((n?"Komşuluk · ":"")+(e.join("  ·  ")||"Yerleşime uygun"))};function Vh(i){clearTimeout(ol),Ha.textContent=i,Ha.classList.add("visible"),ol=window.setTimeout(()=>Ha.classList.remove("visible"),2400)}function fs(i){if(!ze||i<0||!Zt.valid(i))return!1;if(hr)return rr=i,Zt.holdSelection(),Cr("Ada hazırlanıyor…"),!0;const t=Zt.placementRotation,e=ze,n=St.preview(e,i);return St.play(e,i)?(hr=!0,cn.sequence(!!e.event,["house","manor","store","lumber"].includes(e.id),n.localBonus||n.neighbors.length>0),ni(null),Zt.sync(St.board,e.event?-1:i,t),e.event&&Zt.burst(i),ql(),Vh(e.event?`${e.name} uygulandı`:`${e.name} · yerleşim hazırlanıyor`),Ci.animate([{opacity:.35,transform:"translateY(17px)"},{opacity:1,transform:"translateY(0)"}],{duration:330,easing:"ease-out"}),clearTimeout(fr),fr=window.setTimeout($l,2e3),!0):!1}function $l(){if(Zt.placing){fr=window.setTimeout($l,100);return}if(hr=!1,rr!==null){const i=rr;rr=null,fs(i)}}Zt.onTileSelect=i=>{Xr=i;const t=Pt("#tile-editor");if(t.hidden=i<0,i<0){Pt("#storage-upgrade").hidden=!0;return}Pt("#tile-editor strong").textContent=i===he?"Krallık merkezi":Zn.find(n=>n.id===St.board.get(i))?.name??"Yerleşim",Pt("#tile-editor small").textContent=i===he?"Merkez korunur · R / tekerlek ile döndür":"R / tekerlek · Silmede kaynak iadesi yok";const e=Pt("[data-tile-delete]");e.disabled=i===he,e.title=i===he?"Krallık merkezi silinemez":"Yapı ve toprak denize çöker",jl()};function jl(){const i=Pt("#storage-upgrade"),t=Xr;if(i.hidden=!St.storageStocks.has(t),i.hidden)return;const e=St.storageUsed(t),n=St.storageCapacity(t),r=St.upgradeCost(t);Pt("#storage-meter").textContent=`Depo ${St.storageLevels.get(t)} · ${e} / ${n}`;const a=Pt("#storage-progress");a.max=n,a.value=e;const s=Pt("#upgrade-store");s.innerHTML=`Yükselt ${_n("wood")} ${r}`,s.disabled=St.wood<r,s.title=`Kapasite +${t===he?80:60}`}Pt("#upgrade-store").onclick=()=>{St.upgradeStore(Xr)&&(Zt.burst(Xr),ps(),jl(),cn.play("build"))};Pt("[data-tile-left]").onclick=()=>Zt.rotateSelection(-1);Pt("[data-tile-right]").onclick=()=>Zt.rotateSelection(1);Pt("[data-tile-close]").onclick=()=>Zt.editTile(-1);Pt("[data-tile-delete]").onclick=()=>{const i=Xr;Zt.placing||!St.remove(i)||(hr=!0,hs.cancel(),ni(null),Zt.demolish(St.board,i),ql(),Vh("Yerleşim kaldırıldı · kaynak iadesi yok"),clearTimeout(fr),fr=window.setTimeout($l,1500))};Zt.onPick=fs;Pt("#event-target").onclick=()=>{ze?.event&&fs(he)};function Ku(i,t){return ze?.event&&document.elementFromPoint(i,t)?.closest("#event-target")?he:Zt.point(i,t)}Ci.addEventListener("pointerover",i=>{const t=i.target.closest("button");t&&!t.disabled&&!t.contains(i.relatedTarget)&&!hr&&!ze&&cn.play("hover")});const hs=new XM(Ci,{canStart:i=>rr===null&&!on.open&&!!St.hand[i]&&Yl(St.hand[i]),start:i=>{cn.play("lift"),ni(St.hand[i],!0)},move:(i,t)=>Zt.valid(Ku(i,t)),drop:(i,t)=>fs(Ku(i,t)),cancel:()=>{cn.play("invalid"),ni(null)},tap:i=>{const t=St.hand[i];ni(ze===t?null:t)}}),Zu={stone:"Taş",wood:"Odun",berry:"Çilek",farm:"Buğday",fish:"Balık"},jM={stone:"stone",wood:"wood",berry:"berry",farm:"wheat",fish:"fish"};Pt("#work-rows").innerHTML=Fr.map(i=>`<label class="work-row" data-work="${i}"><span>${_n(jM[i])}<b>${Zu[i]}</b><small></small><em></em></span><input type="range" min="0" max="100" value="${St.priorities[i]}" aria-label="${Zu[i]} iş önceliği" data-priority="${i}"></label>`).join("");function ds(){const i=Zt.villagers.assignedCounts(),t=St.workTargets();Pt("#population-badge").textContent=String(St.people),Pt("#work-summary").textContent=`${Zt.villagers.working} çalışıyor · ${Math.max(0,St.people-Zt.villagers.working)} boşta`;for(const e of Fr){const n=Pt(`[data-work="${e}"]`),r=n.querySelector("input");document.activeElement!==r&&(r.value=String(St.priorities[e])),n.querySelector("small").textContent=`${i[e]} / ${t[e]} kişi`,n.querySelector("em").textContent=`%${St.priorities[e]}`,n.classList.toggle("inactive",![...St.board.keys()].some(a=>St.categoryFor(a)===e))}}function Wh(){const i=Pt("#work-panel");i.hidden=!i.hidden,Pt("#population-toggle").setAttribute("aria-expanded",String(!i.hidden)),ds()}Pt("#population-toggle").onclick=Wh;Pt("[data-work-close]").onclick=()=>{Pt("#work-panel").hidden=!0,Pt("#population-toggle").setAttribute("aria-expanded","false")};Pt("[data-work-balance]").onclick=()=>{St.priorities={wood:20,stone:20,berry:20,farm:20,fish:20},Zt.villagers.rebalance(),ds()};Xl.querySelectorAll("[data-priority]").forEach(i=>i.oninput=()=>{St.setPriority(i.dataset.priority,Number(i.value)),Zt.villagers.rebalance(),ds()});function Xh(){const i=Pt("#food-details");i.innerHTML=["berry","wheat","fish"].map(t=>`<span>${_n(t)}<small>${t==="berry"?"Çilek":t==="wheat"?"Buğday":"Balık"}</small><b>${St.foods[t]}</b></span>`).join("")+`<em>−${St.foodPerMinute} / dk · ${St.people} sakin</em>`}function Ju(){const i=Pt("#food-details"),t=Pt('[data-resource="food"]').getBoundingClientRect();Xh(),i.hidden=!1,i.style.left=`${Math.max(12,Math.min(innerWidth-i.offsetWidth-12,t.left+t.width/2-i.offsetWidth/2))}px`,i.style.top=`${t.bottom+14}px`}const es=new Map;function qM(i,t){const e=Pt(`[data-resource="${i}"] b`),n=es.get(i);if(!n){e.textContent=String(t),es.set(i,{value:t,target:t,frame:0});return}if(n.target===t)return;cancelAnimationFrame(n.frame);const r=n.value,a=n.target,s=performance.now();n.target=t,e.dataset.change=t>a?"up":"down";const o=l=>{const c=Math.min(1,(l-s)/550);n.value=r+(t-r)*(1-(1-c)**3),e.textContent=String(Math.round(n.value)),c<1?n.frame=requestAnimationFrame(o):(e.textContent=String(t),window.setTimeout(()=>{n.target===t&&delete e.dataset.change},500))};n.frame=requestAnimationFrame(o)}function ps(){const i=Pt("#stats");i.children.length||(i.innerHTML=[["wood","Odun"],["stone","Taş"],["food","Yiyecek"],["people","Nüfus"],["happy","Refah"]].map(([e,n])=>`<div class="resource" data-resource="${e}">${_n(e)}<div><small>${n}</small><b>0</b></div><em></em></div>`).join(""));const t=Pt('[data-resource="food"]');t.onmouseenter=Ju,t.onmouseleave=()=>Pt("#food-details").hidden=!0,t.onfocus=Ju,t.onblur=()=>Pt("#food-details").hidden=!0,t.tabIndex=0,t.setAttribute("aria-describedby","food-details"),Pt('[data-resource="people"]').onclick=Wh;for(const e of["wood","stone","food","people","happy"])qM(e,e==="happy"?Math.round(St.happy):St[e]),Pt(`[data-resource="${e}"] em`).textContent=e==="people"?`${Zt.villagers.working}/${St.people} çalışıyor`:e==="happy"?"Köyün ruhu":e==="food"?`−${St.foodPerMinute}/dk`:"Depoda";Ci.querySelectorAll("[data-card]").forEach(e=>{const n=St.hand[Number(e.dataset.card)];e.disabled=!n||!Yl(n)}),ds(),jl(),Pt("#food-details").hidden||Xh()}function ql(){ps(),Ci.innerHTML=St.hand.map((i,t)=>`<button class="card tone-${i.id}" data-card="${t}" aria-pressed="false" ${Yl(i)?"":"disabled"}>
    <span class="cost" title="${i.cost} odun">${_n("wood")}${i.cost}</span><span class="type">${i.event?"ANLIK":i.workers?"ÜRETİM":"YERLEŞİM"}</span>
    <img src="${$M[i.id]}" alt="" draggable="false"><strong>${i.name}</strong><span class="rule"></span><span class="effect">${i.desc}</span><small>${i.bonus}</small>
  </button>`).join("")}Zt.onDelivery=(i,t,e,n)=>{const r=St.deliver(i,t,e,n);if(!r)return 0;ps(),cn.play("reward");const a=Pt(`[data-resource="${e}"]`),s=a.getBoundingClientRect(),o=Zt.screenPoint(t,.6),l=document.createElement("div");l.className=`delivery-spark ${e}`,l.innerHTML=`${_n(e==="food"?St.board.get(i)==="fisher"?"fish":St.board.get(i)==="farm"?"wheat":"berry":e)}<b>+${r}</b>`,document.body.append(l);const c=s.left+s.width/2,u=s.top+s.height/2;return l.animate([{transform:`translate(${o.x}px,${o.y}px) scale(.7)`,opacity:0},{transform:`translate(${o.x}px,${o.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${c}px,${u}px) scale(.5)`,opacity:0}],{duration:950,easing:"cubic-bezier(.3,.65,.3,1)"}).finished.catch(()=>{}).then(()=>l.remove()),a.animate([{transform:"scale(1)",backgroundColor:"transparent"},{transform:"scale(1.10)",backgroundColor:"#d8e6b4"},{transform:"scale(1)",backgroundColor:"transparent"}],{duration:650}),r};Zt.onInspect=(i,t,e,n)=>{const r=Pt("#tile-tooltip");if(i<0||!n||ze||on.open){r.hidden=!0;return}const a=St.board.get(i),s=Zn.find(v=>v.id===a),o=St.productAt(i),l=[];i===he?l.push("Merkez deposu",`${St.storageUsed(i)} / ${St.storageCapacity(i)} dolu`):a==="store"?l.push(`${St.storageUsed(i)} / ${St.storageCapacity(i)} dolu`,"Tıkla · kapasiteyi yükselt"):o?l.push(`+${o.amount} ${o.resource==="stone"?"taş":o.resource==="wood"?"odun":o.resource==="food"?a==="fisher"?"balık":a==="farm"?"buğday":"çilek":"refah"} / teslimat`,`${Zt.villagers.assignedTo(i)} / ${o.capacity} çalışan`,"Ürünler depoya taşınır"):a==="house"||a==="manor"?l.push(`${St.residents.filter(v=>v.home===i).length} sakinin evi`,"Sakinler yakındaki işlere yürüyerek gider"):a==="lumber"?l.push("Komşu ormanlara +2 odun","Oduncular komşu ormanlarda çalışır"):s&&l.push(s.desc,s.bonus),r.querySelector("strong").textContent=i===he?"Krallık merkezi":s?.name??"Yerleşim",r.querySelector("div").innerHTML=l.map(v=>`<span>${v}</span>`).join(""),r.hidden=!1;const c=r.offsetWidth,u=r.offsetHeight,f=14;let d=t+26,h=e+22;d<n.right+8&&d+c>n.left-8&&h<n.bottom+8&&h+u>n.top-8&&(d=n.right+f,h=e-u/2),d+c>innerWidth-f&&(d=n.left-c-f,h=e-u/2),d<f&&(d=Math.max(f,Math.min(innerWidth-c-f,t-c/2)),h=n.top-u-f,h<f&&(h=n.bottom+f)),r.style.left=`${Math.max(f,Math.min(innerWidth-c-f,d))}px`,r.style.top=`${Math.max(f,Math.min(innerHeight-u-f,h))}px`};window.setInterval(ps,200);function Yh(i){hs.cancel(),ni(null),on.innerHTML=i,on.open||on.showModal();const t=on.querySelector("[data-audio]");t&&(t.onclick=()=>{cn.toggle(),t.textContent=cn.muted?"Ses kapalı":"Ses açık"}),on.querySelectorAll("input[data-level]").forEach(e=>{e.oninput=()=>cn.set(e.dataset.level,Number(e.value)/100)}),on.querySelector("[data-close]")?.addEventListener("click",()=>on.close()),on.querySelector("[data-new]")?.addEventListener("click",()=>{on.close(),$h()})}function $h(){clearTimeout(fr),clearTimeout(ol),Ha.classList.remove("visible"),document.querySelectorAll(".delivery-spark").forEach(i=>i.remove()),Pt("#food-details").hidden=!0,Pt("#work-panel").hidden=!0,Pt("#population-toggle").setAttribute("aria-expanded","false"),hs.cancel(),cn.cancel();for(const i of es.values())cancelAnimationFrame(i.frame);es.clear(),St=new tf,ze=null,hr=!1,Zt.reset(),Zt.sync(St.board),Zt.bindGame(St),ni(null),ql()}Pt("#restart").onclick=()=>Yh("<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>");Pt("#help").onclick=()=>Yh(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Sağ alttaki Görevler panelinden odun, taş, çilek, buğday ve balık işlerinin önceliğini değiştirebilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · ortala<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><div class="mixer">${["master","sfx","ambience"].map((i,t)=>`<label>${["Genel ses","Efektler","Kıyı ambiyansı"][t]}<input data-level="${i}" aria-label="${["Genel ses","Efektler","Kıyı ambiyansı"][t]}" type="range" min="0" max="100" value="${Math.round(cn.levels[i]*100)}"></label>`).join("")}</div><button data-audio>Ses ${cn.muted?"kapalı":"açık"}</button><button data-close>Oyuna dön</button>`);document.addEventListener("keydown",i=>{i.key==="Escape"&&!on.open&&(hs.cancel(),ni(null))});$h();
