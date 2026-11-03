(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const ni=1.03,wf=Math.sqrt(3),ps=64,hr=129,Fp=[{q:1,r:0},{q:0,r:1},{q:-1,r:1},{q:-1,r:0},{q:0,r:-1},{q:1,r:-1}];function uc(s,e){return Number.isInteger(s)&&Number.isInteger(e)&&Math.abs(s)<=ps&&Math.abs(e)<=ps?(s+ps)*hr+e+ps:-1}const dt=uc(0,0);function Aa(s){return{q:Math.floor(s/hr)-ps,r:s%hr-ps}}function tn(s){if(!Number.isInteger(s)||s<0||s>=hr*hr)return[];const{q:e,r:t}=Aa(s);return Fp.map(n=>uc(e+n.q,t+n.r))}function rt(s){const{q:e,r:t}=Aa(s);return{x:ni*wf*(e+t/2),z:ni*1.5*t}}function Xt(s,e){const t=(s/wf-e/3)/ni,n=2*e/3/ni,i=-t-n;let r=Math.round(t),a=Math.round(n);const o=Math.round(i),l=Math.abs(r-t),c=Math.abs(a-n),h=Math.abs(o-i);return l>c&&l>h?r=-a-o:c>h&&(a=-r-o),uc(r,a)}function kp(s){const e=new Set;for(const t of s.keys())for(const n of tn(t))n>=0&&!s.has(n)&&e.add(n);return[...e]}function Op(s,e){return e>=0&&!s.has(e)&&tn(e).some(t=>s.has(t))}function ur(s,e=ni){const t=(s-.5)*Math.PI/3;return{x:Math.cos(t)*e,z:Math.sin(t)*e}}function fa(s){const e=[];for(const t of s.keys()){const n=rt(t);tn(t).forEach((i,r)=>{if(s.has(i))return;const a=ur(r),o=ur(r+1);e.push({id:t,side:r,ax:n.x+a.x,az:n.z+a.z,bx:n.x+o.x,bz:n.z+o.z})})}return e}const _i=[{id:"stone",name:"Taş Ocağı",cost:3,workers:2,desc:"+3 taş / teslimat",bonus:"Kazmayla çıkarılır · yeniden oluşur"},{id:"fisher",name:"Balıkçı Kulübesi",cost:7,workers:1,desc:"+3 balık / teslimat",bonus:"Kıyıda iskele · olta balıkçılığı"},{id:"forest",name:"Orman",cost:0,workers:1,desc:"+2 odun / teslimat",bonus:"Komşu orman +1 · oduncu kulübesi +2 odun"},{id:"berry",name:"Çilek Bahçesi",cost:2,workers:1,desc:"+4 yiyecek / teslimat",bonus:"Komşu orman: +1 yiyecek"},{id:"house",name:"Ev",cost:5,workers:0,desc:"+2 nüfus · +2 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"lumber",name:"Oduncu Kulübesi",cost:5,workers:0,desc:"Komşu ormanlara +2 odun",bonus:"Her komşu ormana +2 odun"},{id:"farm",name:"Çiftlik",cost:7,workers:2,desc:"+4 yiyecek / teslimat",bonus:"Komşu depo: +2 yiyecek"},{id:"store",name:"Depo",cost:6,workers:0,desc:"60 ürün kapasitesi",bonus:"Ürünler teslim edilince depoya eklenir"},{id:"garden",name:"Bahçe",cost:3,workers:1,desc:"+2 refah / teslimat",bonus:"Komşu ev başına +1 refah"},{id:"manor",name:"Büyük Ev",cost:10,workers:0,desc:"+4 nüfus · +4 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"festival",name:"Şenlik",cost:4,workers:0,desc:"+16 refah · −3 yiyecek",bonus:"Anında uygulanır · yer kaplamaz",event:!0},{id:"harvest",name:"Acil Hasat",cost:0,workers:0,desc:"+12 yiyecek · −5 refah",bonus:"Anında uygulanır · yer kaplamaz",event:!0}],fr=["wood","stone","berry","farm","fish"],da=.8;function Ra(s,e){const t=Aa(s),n=Aa(e);return Math.max(Math.abs(t.q-n.q),Math.abs(t.r-n.r),Math.abs(t.q+t.r-n.q-n.r))}class Ef{board=new Map([[dt,"house"]]);wood=18;stone=0;happy=70;foods={berry:8,wheat:4,fish:0};priorities={wood:30,stone:15,berry:30,farm:15,fish:10};meal=0;mealPerson=0;meals=[];storageLevels=new Map([[dt,1]]);storageStocks=new Map([[dt,{wood:18,stone:0,berry:8,wheat:4,fish:0}]]);storageCapacity(e){return this.storageStocks.has(e)?(e===dt?80:60)*(this.storageLevels.get(e)??1):0}storageUsed(e){const t=this.storageStocks.get(e);return t?Object.values(t).reduce((n,i)=>n+i,0):0}storageFree(e){return Math.max(0,this.storageCapacity(e)-this.storageUsed(e))}canStore(e,t){return this.storageStocks.has(e)&&(t==="happy"||this.storageFree(e)>0)}upgradeCost(e){return 12*(this.storageLevels.get(e)??1)}upgradeStore(e){return!this.storageStocks.has(e)||this.wood<this.upgradeCost(e)?!1:(this.spendWood(this.upgradeCost(e)),this.storageLevels.set(e,(this.storageLevels.get(e)??1)+1),!0)}spendWood(e){this.wood-=e;let t=e;for(const n of this.storageStocks.values()){const i=Math.min(t,n.wood);if(n.wood-=i,t-=i,!t)break}}addFood(e,t){for(const[n,i]of this.storageStocks){const r=Math.min(t,this.storageFree(n));if(i[e]+=r,this.foods[e]+=r,t-=r,!t)break}}takeMeals(){const e=this.meals;return this.meals=[],e}wouldSealFishery(e){return[...this.board].some(([t,n])=>n==="fisher"&&tn(t).every(i=>i===e||this.board.has(i)))}get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}get foodPerMinute(){return this.people*2}consumeFood(e){let t=0;for(;t<e&&this.food>0;){const n=Object.keys(this.foods).sort((i,r)=>this.foods[r]-this.foods[i])[0];this.foods[n]--;for(const i of this.storageStocks.values())if(i[n]>0){i[n]--;break}t++}return t}tick(e){this.meal+=e*this.people/30;const t=Math.floor(this.meal);if(t){this.meal-=t;for(let n=0;n<t;n++){const i=this.consumeFood(1)>0,r=this.residents[this.mealPerson++%this.people].id;this.meals.push({id:r,ate:i}),i||(this.happy=Math.max(0,this.happy-.35))}}}categoryFor(e){const t=this.board.get(e);return t==="stone"?"stone":t==="forest"?"wood":t==="berry"?"berry":t==="farm"?"farm":t==="fisher"?"fish":null}workTargets(){const e=fr.filter(a=>[...this.board.keys()].some(o=>this.categoryFor(o)===a&&this.storageFor(o).length)),t={wood:0,stone:0,berry:0,farm:0,fish:0},n=e.reduce((a,o)=>a+this.priorities[o],0);if(!n)return t;const i=e.map(a=>({c:a,raw:this.people*this.priorities[a]/n}));for(const a of i)t[a.c]=Math.floor(a.raw);let r=this.people-Object.values(t).reduce((a,o)=>a+o,0);for(const a of i.sort((o,l)=>l.raw%1-o.raw%1))r-- >0&&t[a.c]++;return t}setPriority(e,t){t=Math.max(0,Math.min(100,Math.round(t)));const n=fr.filter(a=>a!==e),i=n.reduce((a,o)=>a+this.priorities[o],0);this.priorities[e]=t;let r=100-t;n.forEach((a,o)=>{const l=o===n.length-1?r:Math.min(r,Math.round((100-t)*(i?this.priorities[a]/i:1/n.length)));this.priorities[a]=l,r-=l})}residents=[{id:0,home:dt}];get people(){return this.residents.length}hand=[];rng;constructor(e=Math.random){this.rng=e,this.hand=["forest","berry","house"].map(t=>_i.find(n=>n.id===t))}neighbors(e){return tn(e)}draw(){const e=_i.filter(t=>!["farm","manor"].includes(t.id)||this.people>=3);for(this.hand=[];this.hand.length<3;)this.hand.push(e.splice(Math.floor(this.rng()*e.length),1)[0]);this.hand.some(t=>t.cost<=this.wood)||(this.hand[0]=_i.find(t=>t.id==="forest")),this.people>=3&&![...this.board.values()].includes("fisher")&&!this.hand.some(t=>t.id==="fisher")&&(this.hand[2]=_i.find(t=>t.id==="fisher"))}production(){return this.calculateProduction(this.board,this.people)}calculateProduction(e,t){let n=0;const i=new Set,r=l=>l==="berry"||l==="farm"||l==="fisher",a=[...e].map(([l,c])=>({k:c,i:l})).sort((l,c)=>Number(r(c.k)||c.i===dt)-Number(r(l.k)||l.i===dt));for(const{k:l,i:c}of a){const h=_i.find(f=>f.id===l),u=c===dt?0:h?.workers;u!==void 0&&n+u<=t&&(n+=u,i.add(c))}const o=[...e].flatMap(([l,c])=>{if(!c)return[];const h=this.neighbors(l),u=h.map(m=>e.get(m));let f=0,d=0,g=0,v=!1;return i.has(l)&&(c==="forest"&&(f=2+h.filter(p=>e.get(p)==="lumber"&&i.has(p)).length*2+u.filter(p=>p==="forest").length,v=f>2),c==="berry"&&(d=4+u.filter(m=>m==="forest").length,v=d>4),c==="fisher"&&(d=3),c==="farm"&&(d=4+(u.includes("store")?2:0),v=d>9),c==="garden"&&(g=2+u.filter(m=>m==="house"||m==="manor").length,v=g>2),(c==="house"||c==="manor")&&u.includes("garden")&&(g=1,v=!0)),[{i:l,wood:f,food:d,happy:g,active:i.has(l),bonus:v}]});return{wood:o.reduce((l,c)=>l+c.wood,0),food:o.reduce((l,c)=>l+c.food,0),happy:o.reduce((l,c)=>l+c.happy,0),used:n,idle:t-n,rows:o}}valid(e,t){return this.hand.includes(e)&&e.cost<=this.wood&&(e.id!=="festival"||this.food>=3)&&(e.event?this.board.has(t):Op(this.board,t)&&!this.wouldSealFishery(t))&&(e.id!=="fisher"||tn(t).some(n=>!this.board.has(n)))}preview(e,t){if(!this.valid(e,t))return null;const n=tn(t).map(c=>this.board.get(c)),i=e.id==="house"?2:e.id==="manor"?4:0,r=e.id==="forest"?2+n.filter(c=>c==="forest").length+2*n.filter(c=>c==="lumber").length:0,a=e.id==="berry"?4+n.filter(c=>c==="forest").length:e.id==="farm"?4+n.filter(c=>c==="store").length*2:e.id==="fisher"?3:0,o=e.id==="stone"?3:0,l=e.id==="garden"?2+n.filter(c=>c==="house"||c==="manor").length:0;return{wood:r,stone:o,food:a,happy:l,people:i,neighbors:tn(t).filter(c=>this.board.has(c)),localBonus:r>2||a>4||l>2}}play(e,t=dt){if(!this.valid(e,t))return null;this.spendWood(e.cost),e.event||this.board.set(t,e.id),e.id==="store"&&(this.storageLevels.set(t,1),this.storageStocks.set(t,{wood:0,stone:0,berry:0,wheat:0,fish:0}));const n=e.id==="house"?2:e.id==="manor"?4:0;for(let i=0;i<n;i++)this.residents.push({id:this.residents.length,home:t});return e.id==="festival"&&(this.happy=Math.min(100,this.happy+16),this.consumeFood(3)),e.id==="harvest"&&(this.addFood("berry",12),this.happy=Math.max(0,this.happy-5)),this.draw(),this.production()}remove(e){if(e===dt||!this.board.has(e))return!1;const t=this.storageStocks.get(e);if(t){this.wood-=t.wood,this.stone-=t.stone;for(const n of["berry","wheat","fish"])this.foods[n]-=t[n];this.storageStocks.delete(e),this.storageLevels.delete(e)}this.board.delete(e);for(const n of this.residents)n.home===e&&(n.home=dt);return!0}productAt(e){const t=this.board.get(e),n=tn(e).map(i=>this.board.get(i));return t==="fisher"&&tn(e).some(i=>!this.board.has(i))?{resource:"food",amount:3,capacity:1}:t==="stone"?{resource:"stone",amount:3,capacity:2}:t==="forest"?{resource:"wood",amount:2+n.filter(i=>i==="forest").length+2*n.filter(i=>i==="lumber").length,capacity:3}:t==="berry"?{resource:"food",amount:4+n.filter(i=>i==="forest").length,capacity:2}:t==="farm"?{resource:"food",amount:4+n.filter(i=>i==="store").length*2,capacity:2}:t==="garden"?{resource:"happy",amount:2+n.filter(i=>i==="house"||i==="manor").length,capacity:1}:null}storageFor(e){return[...this.board].filter(([t,n])=>t===dt||n==="store").sort(([t],[n])=>Ra(e,t)-Ra(e,n)).map(([t])=>t)}deliver(e,t,n,i){const r=this.productAt(e);if(!r||r.resource!==n||!this.storageFor(e).includes(t))return 0;const a=Math.max(0,Math.min(r.amount,Math.floor(i),n==="happy"?1/0:this.storageFree(t)));if(n==="happy"){const l=this.happy;return this.happy=Math.min(100,this.happy+a),Number((this.happy-l).toFixed(2))}const o=this.storageStocks.get(t);if(!o)return 0;if(n==="food"){const l=this.board.get(e),c=l==="fisher"?"fish":l==="farm"?"wheat":"berry";this.foods[c]+=a,o[c]+=a}else n==="stone"?(this.stone+=a,o.stone+=a):(this.wood+=a,o.wood+=a);return a}}const fc="180",zp=0,uh=1,Bp=2,Tf=1,Af=2,Qn=3,si=0,rn=1,Gt=2,bi=0,xs=1,fh=2,dh=3,ph=4,Hp=5,ki=100,Vp=101,Gp=102,Wp=103,Xp=104,jp=200,$p=201,Yp=202,qp=203,Jo=204,Qo=205,Kp=206,Zp=207,Jp=208,Qp=209,em=210,tm=211,nm=212,im=213,sm=214,el=0,tl=1,nl=2,Es=3,il=4,sl=5,rl=6,al=7,dc=0,rm=1,am=2,Mi=0,om=1,lm=2,cm=3,ol=4,hm=5,um=6,fm=7,mh="attached",dm="detached",Rf=300,Ts=301,As=302,ll=303,cl=304,Ha=306,Vi=1e3,yi=1001,Ca=1002,Zt=1003,Cf=1004,er=1005,Kt=1006,pa=1007,zn=1008,Vn=1009,Pf=1010,If=1011,dr=1012,pc=1013,Gi=1014,An=1015,Mr=1016,mc=1017,gc=1018,pr=1020,Lf=35902,Df=35899,Nf=1021,Uf=1022,sn=1023,mr=1026,gr=1027,vc=1028,_c=1029,Ff=1030,xc=1031,yc=1033,ma=33776,ga=33777,va=33778,_a=33779,hl=35840,ul=35841,fl=35842,dl=35843,pl=36196,ml=37492,gl=37496,vl=37808,_l=37809,xl=37810,yl=37811,bl=37812,Ml=37813,Sl=37814,wl=37815,El=37816,Tl=37817,Al=37818,Rl=37819,Cl=37820,Pl=37821,Il=36492,Ll=36494,Dl=36495,Nl=36283,Ul=36284,Fl=36285,kl=36286,pm=2200,mm=2201,gm=2202,vr=2300,_r=2301,ao=2302,ms=2400,gs=2401,Pa=2402,bc=2500,vm=2501,_m=0,kf=1,Ol=2,xm=3200,ym=3201,Mc=0,bm=1,xi="",Ft="srgb",Jt="srgb-linear",Ia="linear",ft="srgb",Zi=7680,gh=519,Mm=512,Sm=513,wm=514,Of=515,Em=516,Tm=517,Am=518,Rm=519,zl=35044,vh="300 es",Bn=2e3,La=2001;class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _h=1234567;const sr=Math.PI/180,Rs=180/Math.PI;function Cn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[s&255]+Bt[s>>8&255]+Bt[s>>16&255]+Bt[s>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function $e(s,e,t){return Math.max(e,Math.min(t,s))}function Sc(s,e){return(s%e+e)%e}function Cm(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Pm(s,e,t){return s!==e?(t-s)/(e-s):0}function rr(s,e,t){return(1-t)*s+t*e}function Im(s,e,t,n){return rr(s,e,1-Math.exp(-t*n))}function Lm(s,e=1){return e-Math.abs(Sc(s,e*2)-e)}function Dm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Nm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Um(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Fm(s,e){return s+Math.random()*(e-s)}function km(s){return s*(.5-Math.random())}function Om(s){s!==void 0&&(_h=s);let e=_h+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zm(s){return s*sr}function Bm(s){return s*Rs}function Hm(s){return(s&s-1)===0&&s!==0}function Vm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Gm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Wm(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*f,o*c);break;case"YZY":s.set(l*f,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*f,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*d,o*c);break;case"YXY":s.set(l*d,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*d,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function En(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ht(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ye={DEG2RAD:sr,RAD2DEG:Rs,generateUUID:Cn,clamp:$e,euclideanModulo:Sc,mapLinear:Cm,inverseLerp:Pm,lerp:rr,damp:Im,pingpong:Lm,smoothstep:Dm,smootherstep:Nm,randInt:Um,randFloat:Fm,randFloatSpread:km,seededRandom:Om,degToRad:zm,radToDeg:Bm,isPowerOfTwo:Hm,ceilPowerOfTwo:Vm,floorPowerOfTwo:Gm,setQuaternionFromProperEuler:Wm,normalize:ht,denormalize:En};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=r[a+0],d=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==f||c!==d||h!==g){let m=1-o;const p=l*f+c*d+h*g+u*v,x=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const E=Math.sqrt(b),T=Math.atan2(E,p*x);m=Math.sin(m*T)/E,o=Math.sin(o*T)/E}const _=o*x;if(l=l*m+f*_,c=c*m+d*_,h=h*m+g*_,u=u*m+v*_,m===1-o){const E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-o*d,e[t+2]=c*g+h*d+o*f-l*u,e[t+3]=h*g-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),f=l(n/2),d=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,t=0,n=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return oo.copy(this).projectOnVector(e),this.sub(oo)}reflect(e){return this.sub(oo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const oo=new R,xh=new Pn;class Ge{constructor(e,t,n,i,r,a,o,l,c){Ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=i[0],m=i[3],p=i[6],x=i[1],b=i[4],_=i[7],E=i[2],T=i[5],A=i[8];return r[0]=a*v+o*x+l*E,r[3]=a*m+o*b+l*T,r[6]=a*p+o*_+l*A,r[1]=c*v+h*x+u*E,r[4]=c*m+h*b+u*T,r[7]=c*p+h*_+u*A,r[2]=f*v+d*x+g*E,r[5]=f*m+d*b+g*T,r[8]=f*p+d*_+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,g=t*u+n*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=f*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(lo.makeScale(e,t)),this}rotate(e){return this.premultiply(lo.makeRotation(-e)),this}translate(e,t){return this.premultiply(lo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const lo=new Ge;function zf(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function xr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Xm(){const s=xr("canvas");return s.style.display="block",s}const yh={};function yr(s){s in yh||(yh[s]=!0,console.warn(s))}function jm(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const bh=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mh=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $m(){const s={enabled:!0,workingColorSpace:Jt,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ft&&(i.r=ii(i.r),i.g=ii(i.g),i.b=ii(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ft&&(i.r=ys(i.r),i.g=ys(i.g),i.b=ys(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xi?Ia:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return yr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return yr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Jt]:{primaries:e,whitePoint:n,transfer:Ia,toXYZ:bh,fromXYZ:Mh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ft},outputColorSpaceConfig:{drawingBufferColorSpace:Ft}},[Ft]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:bh,fromXYZ:Mh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ft}}}),s}const tt=$m();function ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ys(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ji;class Ym{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ji===void 0&&(Ji=xr("canvas")),Ji.width=e.width,Ji.height=e.height;const i=Ji.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qm=0;class wc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qm++}),this.uuid=Cn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(co(i[a].image)):r.push(co(i[a]))}else r=co(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function co(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ym.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Km=0;const ho=new R;class Pt extends qi{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,n=yi,i=yi,r=Kt,a=zn,o=sn,l=Vn,c=Pt.DEFAULT_ANISOTROPY,h=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Km++}),this.uuid=Cn(),this.name="",this.source=new wc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ho).x}get height(){return this.source.getSize(ho).y}get depth(){return this.source.getSize(ho).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vi:e.x=e.x-Math.floor(e.x);break;case yi:e.x=e.x<0?0:1;break;case Ca:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vi:e.y=e.y-Math.floor(e.y);break;case yi:e.y=e.y<0?0:1;break;case Ca:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=Rf;Pt.DEFAULT_ANISOTROPY=1;class nt{constructor(e=0,t=0,n=0,i=1){nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,_=(d+1)/2,E=(p+1)/2,T=(h+f)/4,A=(u+v)/4,C=(g+m)/4;return b>_&&b>E?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=T/n,r=A/n):_>E?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=T/i,r=C/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=A/r,i=C/r),this.set(n,i,r,t),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Zm extends qi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new Pt(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new wc(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends Zm{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Bf extends Pt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jm extends Pt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class un{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(yn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(yn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=yn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,yn):yn.fromBufferAttribute(r,a),yn.applyMatrix4(e.matrixWorld),this.expandByPoint(yn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Dr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Dr.copy(n.boundingBox)),Dr.applyMatrix4(e.matrixWorld),this.union(Dr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,yn),yn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gs),Nr.subVectors(this.max,Gs),Qi.subVectors(e.a,Gs),es.subVectors(e.b,Gs),ts.subVectors(e.c,Gs),ci.subVectors(es,Qi),hi.subVectors(ts,es),Ci.subVectors(Qi,ts);let t=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-Ci.z,Ci.y,ci.z,0,-ci.x,hi.z,0,-hi.x,Ci.z,0,-Ci.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-Ci.y,Ci.x,0];return!uo(t,Qi,es,ts,Nr)||(t=[1,0,0,0,1,0,0,0,1],!uo(t,Qi,es,ts,Nr))?!1:(Ur.crossVectors(ci,hi),t=[Ur.x,Ur.y,Ur.z],uo(t,Qi,es,ts,Nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(yn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const $n=[new R,new R,new R,new R,new R,new R,new R,new R],yn=new R,Dr=new un,Qi=new R,es=new R,ts=new R,ci=new R,hi=new R,Ci=new R,Gs=new R,Nr=new R,Ur=new R,Pi=new R;function uo(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Pi.fromArray(s,r);const o=i.x*Math.abs(Pi.x)+i.y*Math.abs(Pi.y)+i.z*Math.abs(Pi.z),l=e.dot(Pi),c=t.dot(Pi),h=n.dot(Pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Qm=new un,Ws=new R,fo=new R;class Wn{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Qm.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ws.subVectors(e,this.center);const t=Ws.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ws,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ws.copy(e.center).add(fo)),this.expandByPoint(Ws.copy(e.center).sub(fo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Yn=new R,po=new R,Fr=new R,ui=new R,mo=new R,kr=new R,go=new R;class Sr{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yn.copy(this.origin).addScaledVector(this.direction,t),Yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){po.copy(e).add(t).multiplyScalar(.5),Fr.copy(t).sub(e).normalize(),ui.copy(this.origin).sub(po);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Fr),o=ui.dot(this.direction),l=-ui.dot(Fr),c=ui.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(po).addScaledVector(Fr,f),d}intersectSphere(e,t){Yn.subVectors(e.center,this.origin);const n=Yn.dot(this.direction),i=Yn.dot(Yn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Yn)!==null}intersectTriangle(e,t,n,i,r){mo.subVectors(t,e),kr.subVectors(n,e),go.crossVectors(mo,kr);let a=this.direction.dot(go),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ui.subVectors(this.origin,e);const l=o*this.direction.dot(kr.crossVectors(ui,kr));if(l<0)return null;const c=o*this.direction.dot(mo.cross(ui));if(c<0||l+c>a)return null;const h=-o*ui.dot(go);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class We{constructor(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m){We.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m)}set(e,t,n,i,r,a,o,l,c,h,u,f,d,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new We().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ns.setFromMatrixColumn(e,0).length(),r=1/ns.setFromMatrixColumn(e,1).length(),a=1/ns.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f+v*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-g,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,d=l*u,g=c*h,v=c*u;t[0]=f-v*o,t[4]=-a*u,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*h,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,d=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+v,t[1]=l*u,t[5]=v*c+f,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-f*u,t[8]=g*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+v,t[5]=a*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=o*h,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(e0,e,t0)}lookAt(e,t,n){const i=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),fi.crossVectors(n,cn),fi.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),fi.crossVectors(n,cn)),fi.normalize(),Or.crossVectors(cn,fi),i[0]=fi.x,i[4]=Or.x,i[8]=cn.x,i[1]=fi.y,i[5]=Or.y,i[9]=cn.y,i[2]=fi.z,i[6]=Or.z,i[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],b=n[7],_=n[11],E=n[15],T=i[0],A=i[4],C=i[8],y=i[12],S=i[1],I=i[5],F=i[9],z=i[13],V=i[2],W=i[6],j=i[10],K=i[14],H=i[3],ae=i[7],he=i[11],Te=i[15];return r[0]=a*T+o*S+l*V+c*H,r[4]=a*A+o*I+l*W+c*ae,r[8]=a*C+o*F+l*j+c*he,r[12]=a*y+o*z+l*K+c*Te,r[1]=h*T+u*S+f*V+d*H,r[5]=h*A+u*I+f*W+d*ae,r[9]=h*C+u*F+f*j+d*he,r[13]=h*y+u*z+f*K+d*Te,r[2]=g*T+v*S+m*V+p*H,r[6]=g*A+v*I+m*W+p*ae,r[10]=g*C+v*F+m*j+p*he,r[14]=g*y+v*z+m*K+p*Te,r[3]=x*T+b*S+_*V+E*H,r[7]=x*A+b*I+_*W+E*ae,r[11]=x*C+b*F+_*j+E*he,r[15]=x*y+b*z+_*K+E*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+r*l*u-i*c*u-r*o*f+n*c*f+i*o*d-n*l*d)+v*(+t*l*d-t*c*f+r*a*f-i*a*d+i*c*h-r*l*h)+m*(+t*c*u-t*o*d-r*a*u+n*a*d+r*o*h-n*c*h)+p*(-i*o*h-t*l*u+t*o*f+i*a*u-n*a*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],v=e[13],m=e[14],p=e[15],x=u*m*c-v*f*c+v*l*d-o*m*d-u*l*p+o*f*p,b=g*f*c-h*m*c-g*l*d+a*m*d+h*l*p-a*f*p,_=h*v*c-g*u*c+g*o*d-a*v*d-h*o*p+a*u*p,E=g*u*l-h*v*l-g*o*f+a*v*f+h*o*m-a*u*m,T=t*x+n*b+i*_+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=x*A,e[1]=(v*f*r-u*m*r-v*i*d+n*m*d+u*i*p-n*f*p)*A,e[2]=(o*m*r-v*l*r+v*i*c-n*m*c-o*i*p+n*l*p)*A,e[3]=(u*l*r-o*f*r-u*i*c+n*f*c+o*i*d-n*l*d)*A,e[4]=b*A,e[5]=(h*m*r-g*f*r+g*i*d-t*m*d-h*i*p+t*f*p)*A,e[6]=(g*l*r-a*m*r-g*i*c+t*m*c+a*i*p-t*l*p)*A,e[7]=(a*f*r-h*l*r+h*i*c-t*f*c-a*i*d+t*l*d)*A,e[8]=_*A,e[9]=(g*u*r-h*v*r-g*n*d+t*v*d+h*n*p-t*u*p)*A,e[10]=(a*v*r-g*o*r+g*n*c-t*v*c-a*n*p+t*o*p)*A,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*d-t*o*d)*A,e[12]=E*A,e[13]=(h*v*i-g*u*i+g*n*f-t*v*f-h*n*m+t*u*m)*A,e[14]=(g*o*i-a*v*i-g*n*l+t*v*l+a*n*m-t*o*m)*A,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*f+t*o*f)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,g=r*u,v=a*h,m=a*u,p=o*u,x=l*c,b=l*h,_=l*u,E=n.x,T=n.y,A=n.z;return i[0]=(1-(v+p))*E,i[1]=(d+_)*E,i[2]=(g-b)*E,i[3]=0,i[4]=(d-_)*T,i[5]=(1-(f+p))*T,i[6]=(m+x)*T,i[7]=0,i[8]=(g+b)*A,i[9]=(m-x)*A,i[10]=(1-(f+v))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ns.set(i[0],i[1],i[2]).length();const a=ns.set(i[4],i[5],i[6]).length(),o=ns.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],bn.copy(this);const c=1/r,h=1/a,u=1/o;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,t.setFromRotationMatrix(bn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=Bn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===Bn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===La)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=Bn,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===Bn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===La)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ns=new R,bn=new We,e0=new R(0,0,0),t0=new R(1,1,1),fi=new R,Or=new R,cn=new R,Sh=new We,wh=new Pn;class Ln{constructor(e=0,t=0,n=0,i=Ln.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Sh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wh.setFromEuler(this),this.setFromQuaternion(wh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ln.DEFAULT_ORDER="XYZ";let Ec=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},n0=0;const Eh=new R,is=new Pn,qn=new We,zr=new R,Xs=new R,i0=new R,s0=new Pn,Th=new R(1,0,0),Ah=new R(0,1,0),Rh=new R(0,0,1),Ch={type:"added"},r0={type:"removed"},ss={type:"childadded",child:null},vo={type:"childremoved",child:null};class _t extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:n0++}),this.uuid=Cn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new R,t=new Ln,n=new Pn,i=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new We},normalMatrix:{value:new Ge}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.multiply(is),this}rotateOnWorldAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.premultiply(is),this}rotateX(e){return this.rotateOnAxis(Th,e)}rotateY(e){return this.rotateOnAxis(Ah,e)}rotateZ(e){return this.rotateOnAxis(Rh,e)}translateOnAxis(e,t){return Eh.copy(e).applyQuaternion(this.quaternion),this.position.add(Eh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Th,e)}translateY(e){return this.translateOnAxis(Ah,e)}translateZ(e){return this.translateOnAxis(Rh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zr.copy(e):zr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Xs,zr,this.up):qn.lookAt(zr,Xs,this.up),this.quaternion.setFromRotationMatrix(qn),i&&(qn.extractRotation(i.matrixWorld),is.setFromRotationMatrix(qn),this.quaternion.premultiply(is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ch),ss.child=e,this.dispatchEvent(ss),ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(r0),vo.child=e,this.dispatchEvent(vo),vo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ch),ss.child=e,this.dispatchEvent(ss),ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,i0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,s0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}_t.DEFAULT_UP=new R(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new R,Kn=new R,_o=new R,Zn=new R,rs=new R,as=new R,Ph=new R,xo=new R,yo=new R,bo=new R,Mo=new nt,So=new nt,wo=new nt;class Tn{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Mn.subVectors(e,t),i.cross(Mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Mn.subVectors(i,t),Kn.subVectors(n,t),_o.subVectors(e,t);const a=Mn.dot(Mn),o=Mn.dot(Kn),l=Mn.dot(_o),c=Kn.dot(Kn),h=Kn.dot(_o),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Zn)===null?!1:Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Zn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Zn.x),l.addScaledVector(a,Zn.y),l.addScaledVector(o,Zn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Mo.setScalar(0),So.setScalar(0),wo.setScalar(0),Mo.fromBufferAttribute(e,t),So.fromBufferAttribute(e,n),wo.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Mo,r.x),a.addScaledVector(So,r.y),a.addScaledVector(wo,r.z),a}static isFrontFacing(e,t,n,i){return Mn.subVectors(n,t),Kn.subVectors(e,t),Mn.cross(Kn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),Kn.subVectors(this.a,this.b),Mn.cross(Kn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Tn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Tn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Tn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Tn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Tn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;rs.subVectors(i,n),as.subVectors(r,n),xo.subVectors(e,n);const l=rs.dot(xo),c=as.dot(xo);if(l<=0&&c<=0)return t.copy(n);yo.subVectors(e,i);const h=rs.dot(yo),u=as.dot(yo);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(rs,a);bo.subVectors(e,r);const d=rs.dot(bo),g=as.dot(bo);if(g>=0&&d<=g)return t.copy(r);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(as,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ph.subVectors(r,i),o=(u-h)/(u-h+(d-g)),t.copy(i).addScaledVector(Ph,o);const p=1/(m+v+f);return a=v*p,o=f*p,t.copy(n).addScaledVector(rs,a).addScaledVector(as,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Hf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Br={h:0,s:0,l:0};function Eo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=tt.workingColorSpace){if(e=Sc(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Eo(a,r,e+1/3),this.g=Eo(a,r,e),this.b=Eo(a,r,e-1/3)}return tt.colorSpaceToWorking(this,i),this}setStyle(e,t=Ft){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ft){const n=Hf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=ys(e.r),this.g=ys(e.g),this.b=ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ft){return tt.workingToColorSpace(Ht.copy(this),e),Math.round($e(Ht.r*255,0,255))*65536+Math.round($e(Ht.g*255,0,255))*256+Math.round($e(Ht.b*255,0,255))}getHexString(e=Ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Ht.copy(this),t);const n=Ht.r,i=Ht.g,r=Ht.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Ft){tt.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,n=Ht.g,i=Ht.b;return e!==Ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(di),this.setHSL(di.h+e,di.s+t,di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(di),e.getHSL(Br);const n=rr(di.h,Br.h,t),i=rr(di.s,Br.s,t),r=rr(di.l,Br.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new fe;fe.NAMES=Hf;let a0=0;class In extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=Cn(),this.name="",this.type="Material",this.blending=xs,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jo,this.blendDst=Qo,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zi,this.stencilZFail=Zi,this.stencilZPass=Zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Jo&&(n.blendSrc=this.blendSrc),this.blendDst!==Qo&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class qt extends In{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.combine=dc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new R,Hr=new Oe;let o0=0;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:o0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=zl,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Hr.fromBufferAttribute(this,t),Hr.applyMatrix3(e),this.setXY(t,Hr.x,Hr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=En(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=En(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=En(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=En(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==zl&&(e.usage=this.usage),e}}class Vf extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Gf extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class qe extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let l0=0;const vn=new We,To=new _t,os=new R,hn=new un,js=new un,Ut=new R;class wt extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=Cn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(zf(e)?Gf:Vf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return vn.makeRotationFromQuaternion(e),this.applyMatrix4(vn),this}rotateX(e){return vn.makeRotationX(e),this.applyMatrix4(vn),this}rotateY(e){return vn.makeRotationY(e),this.applyMatrix4(vn),this}rotateZ(e){return vn.makeRotationZ(e),this.applyMatrix4(vn),this}translate(e,t,n){return vn.makeTranslation(e,t,n),this.applyMatrix4(vn),this}scale(e,t,n){return vn.makeScale(e,t,n),this.applyMatrix4(vn),this}lookAt(e){return To.lookAt(e),To.updateMatrix(),this.applyMatrix4(To.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new qe(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new un);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];js.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(hn.min,js.min),hn.expandByPoint(Ut),Ut.addVectors(hn.max,js.max),hn.expandByPoint(Ut)):(hn.expandByPoint(js.min),hn.expandByPoint(js.max))}hn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ut.fromBufferAttribute(o,c),l&&(os.fromBufferAttribute(e,c),Ut.add(os)),i=Math.max(i,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new R,l[C]=new R;const c=new R,h=new R,u=new R,f=new Oe,d=new Oe,g=new Oe,v=new R,m=new R;function p(C,y,S){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,S),f.fromBufferAttribute(r,C),d.fromBufferAttribute(r,y),g.fromBufferAttribute(r,S),h.sub(c),u.sub(c),d.sub(f),g.sub(f);const I=1/(d.x*g.y-g.x*d.y);isFinite(I)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(I),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(I),o[C].add(v),o[y].add(v),o[S].add(v),l[C].add(m),l[y].add(m),l[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,y=x.length;C<y;++C){const S=x[C],I=S.start,F=S.count;for(let z=I,V=I+F;z<V;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const b=new R,_=new R,E=new R,T=new R;function A(C){E.fromBufferAttribute(i,C),T.copy(E);const y=o[C];b.copy(y),b.sub(E.multiplyScalar(E.dot(y))).normalize(),_.crossVectors(T,y);const I=_.dot(l[C])<0?-1:1;a.setXYZW(C,b.x,b.y,b.z,I)}for(let C=0,y=x.length;C<y;++C){const S=x[C],I=S.start,F=S.count;for(let z=I,V=I+F;z<V;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new kt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new wt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ih=new We,Ii=new Sr,Vr=new Wn,Lh=new R,Gr=new R,Wr=new R,Xr=new R,Ao=new R,jr=new R,Dh=new R,$r=new R;class He extends _t{constructor(e=new wt,t=new qt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){jr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Ao.fromBufferAttribute(u,e),a?jr.addScaledVector(Ao,h):jr.addScaledVector(Ao.sub(t),h))}t.add(jr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(r),Ii.copy(e.ray).recast(e.near),!(Vr.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(Vr,Lh)===null||Ii.origin.distanceToSquared(Lh)>(e.far-e.near)**2))&&(Ih.copy(r).invert(),Ii.copy(e.ray).applyMatrix4(Ih),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ii)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let _=x,E=b;_<E;_+=3){const T=o.getX(_),A=o.getX(_+1),C=o.getX(_+2);i=Yr(this,p,e,n,c,h,u,T,A,C),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=o.getX(m),b=o.getX(m+1),_=o.getX(m+2);i=Yr(this,a,e,n,c,h,u,x,b,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let _=x,E=b;_<E;_+=3){const T=_,A=_+1,C=_+2;i=Yr(this,p,e,n,c,h,u,T,A,C),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const x=m,b=m+1,_=m+2;i=Yr(this,a,e,n,c,h,u,x,b,_),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function c0(s,e,t,n,i,r,a,o){let l;if(e.side===rn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===si,o),l===null)return null;$r.copy(o),$r.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo($r);return c<t.near||c>t.far?null:{distance:c,point:$r.clone(),object:s}}function Yr(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Gr),s.getVertexPosition(l,Wr),s.getVertexPosition(c,Xr);const h=c0(s,e,t,n,Gr,Wr,Xr,Dh);if(h){const u=new R;Tn.getBarycoord(Dh,Gr,Wr,Xr,u),i&&(h.uv=Tn.getInterpolatedAttribute(i,o,l,c,u,new Oe)),r&&(h.uv1=Tn.getInterpolatedAttribute(r,o,l,c,u,new Oe)),a&&(h.normal=Tn.getInterpolatedAttribute(a,o,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new R,materialIndex:0};Tn.getNormal(Gr,Wr,Xr,f.normal),h.face=f,h.barycoord=u}return h}class Fs extends wt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new qe(c,3)),this.setAttribute("normal",new qe(h,3)),this.setAttribute("uv",new qe(u,2));function g(v,m,p,x,b,_,E,T,A,C,y){const S=_/A,I=E/C,F=_/2,z=E/2,V=T/2,W=A+1,j=C+1;let K=0,H=0;const ae=new R;for(let he=0;he<j;he++){const Te=he*I-z;for(let Ke=0;Ke<W;Ke++){const mt=Ke*S-F;ae[v]=mt*x,ae[m]=Te*b,ae[p]=V,c.push(ae.x,ae.y,ae.z),ae[v]=0,ae[m]=0,ae[p]=T>0?1:-1,h.push(ae.x,ae.y,ae.z),u.push(Ke/A),u.push(1-he/C),K+=1}}for(let he=0;he<C;he++)for(let Te=0;Te<A;Te++){const Ke=f+Te+W*he,mt=f+Te+W*(he+1),bt=f+(Te+1)+W*(he+1),ot=f+(Te+1)+W*he;l.push(Ke,mt,ot),l.push(mt,bt,ot),H+=6}o.addGroup(d,H,y),d+=H,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Cs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Yt(s){const e={};for(let t=0;t<s.length;t++){const n=Cs(s[t]);for(const i in n)e[i]=n[i]}return e}function h0(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Wf(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const u0={clone:Cs,merge:Yt};var f0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,d0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ri extends In{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=f0,this.fragmentShader=d0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cs(e.uniforms),this.uniformsGroups=h0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Xf extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const pi=new R,Nh=new Oe,Uh=new Oe;class nn extends Xf{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(pi.x,pi.y).multiplyScalar(-e/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(pi.x,pi.y).multiplyScalar(-e/pi.z)}getViewSize(e,t){return this.getViewBounds(e,Nh,Uh),t.subVectors(Uh,Nh)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ls=-90,cs=1;class p0 extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new nn(ls,cs,e,t);i.layers=this.layers,this.add(i);const r=new nn(ls,cs,e,t);r.layers=this.layers,this.add(r);const a=new nn(ls,cs,e,t);a.layers=this.layers,this.add(a);const o=new nn(ls,cs,e,t);o.layers=this.layers,this.add(o);const l=new nn(ls,cs,e,t);l.layers=this.layers,this.add(l);const c=new nn(ls,cs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===La)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class jf extends Pt{constructor(e=[],t=Ts,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class m0 extends Wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new jf(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Fs(5,5,5),r=new ri({name:"CubemapFromEquirect",uniforms:Cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:bi});r.uniforms.tEquirect.value=t;const a=new He(i,r),o=t.minFilter;return t.minFilter===zn&&(t.minFilter=Kt),new p0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}class Pe extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const g0={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(g0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Pe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Fh extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ln,this.environmentIntensity=1,this.environmentRotation=new Ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class v0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=zl,this.updateRanges=[],this.version=0,this.uuid=Cn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $t=new R;class Tc{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=En(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=En(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=En(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=En(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Tc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const kh=new R,Oh=new nt,zh=new nt,_0=new R,Bh=new We,qr=new R,Co=new Wn,Hh=new We,Po=new Sr;class x0 extends He{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=mh,this.bindMatrix=new We,this.bindMatrixInverse=new We,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new un),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qr),this.boundingBox.expandByPoint(qr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Wn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qr),this.boundingSphere.expandByPoint(qr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Co.copy(this.boundingSphere),Co.applyMatrix4(i),e.ray.intersectsSphere(Co)!==!1&&(Hh.copy(i).invert(),Po.copy(e.ray).applyMatrix4(Hh),!(this.boundingBox!==null&&Po.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Po)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new nt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===mh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===dm?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Oh.fromBufferAttribute(i.attributes.skinIndex,e),zh.fromBufferAttribute(i.attributes.skinWeight,e),kh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=zh.getComponent(r);if(a!==0){const o=Oh.getComponent(r);Bh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(_0.copy(kh).applyMatrix4(Bh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class $f extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Va extends Pt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Zt,h=Zt,u,f){super(null,a,o,l,c,h,i,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Vh=new We,y0=new We;class Ac{constructor(e=[],t=[]){this.uuid=Cn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new We)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new We;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:y0;Vh.multiplyMatrices(o,t[r]),Vh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Ac(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Va(t,e,e,sn,An);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new $f),this.bones.push(a),this.boneInverses.push(new We().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Bl extends kt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const hs=new We,Gh=new We,Kr=[],Wh=new un,b0=new We,$s=new He,Ys=new Wn;class Rc extends He{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Bl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,b0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new un),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),Wh.copy(e.boundingBox).applyMatrix4(hs),this.boundingBox.union(Wh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),Ys.copy(e.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(Ys)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if($s.geometry=this.geometry,$s.material=this.material,$s.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ys.copy(this.boundingSphere),Ys.applyMatrix4(n),e.ray.intersectsSphere(Ys)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,hs),Gh.multiplyMatrices(n,hs),$s.matrixWorld=Gh,$s.raycast(e,Kr);for(let a=0,o=Kr.length;a<o;a++){const l=Kr[a];l.instanceId=r,l.object=this,t.push(l)}Kr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Bl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Va(new Float32Array(i*this.count),i,this.count,vc,An));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Io=new R,M0=new R,S0=new Ge;class ei{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Io.subVectors(n,t).cross(M0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Io),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||S0.getNormalMatrix(e),i=this.coplanarPoint(Io).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Wn,w0=new Oe(.5,.5),Zr=new R;class Cc{constructor(e=new ei,t=new ei,n=new ei,i=new ei,r=new ei,a=new ei){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],v=r[9],m=r[10],p=r[11],x=r[12],b=r[13],_=r[14],E=r[15];if(i[0].setComponents(c-a,d-h,p-g,E-x).normalize(),i[1].setComponents(c+a,d+h,p+g,E+x).normalize(),i[2].setComponents(c+o,d+u,p+v,E+b).normalize(),i[3].setComponents(c-o,d-u,p-v,E-b).normalize(),n)i[4].setComponents(l,f,m,_).normalize(),i[5].setComponents(c-l,d-f,p-m,E-_).normalize();else if(i[4].setComponents(c-l,d-f,p-m,E-_).normalize(),t===Bn)i[5].setComponents(c+l,d+f,p+m,E+_).normalize();else if(t===La)i[5].setComponents(l,f,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);const t=w0.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Zr.x=i.normal.x>0?e.max.x:e.min.x,Zr.y=i.normal.y>0?e.max.y:e.min.y,Zr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ga extends In{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Da=new R,Na=new R,Xh=new We,qs=new Sr,Jr=new Wn,Lo=new R,jh=new R;class Wa extends _t{constructor(e=new wt,t=new Ga){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Da.fromBufferAttribute(t,i-1),Na.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Da.distanceTo(Na);e.setAttribute("lineDistance",new qe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(i),Jr.radius+=r,e.ray.intersectsSphere(Jr)===!1)return;Xh.copy(i).invert(),qs.copy(e.ray).applyMatrix4(Xh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=h.getX(v),x=h.getX(v+1),b=Qr(this,e,qs,l,p,x,v);b&&t.push(b)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(d),p=Qr(this,e,qs,l,v,m,g-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=Qr(this,e,qs,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Qr(this,e,qs,l,g-1,d,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Qr(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Da.fromBufferAttribute(o,i),Na.fromBufferAttribute(o,r),t.distanceSqToSegment(Da,Na,Lo,jh)>n)return;Lo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Lo);if(!(c<e.near||c>e.far))return{distance:c,point:jh.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const $h=new R,Yh=new R;class E0 extends Wa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)$h.fromBufferAttribute(t,i),Yh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+$h.distanceTo(Yh);e.setAttribute("lineDistance",new qe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yf extends Wa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class qf extends In{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const qh=new We,Hl=new Sr,ea=new Wn,ta=new R;class T0 extends _t{constructor(e=new wt,t=new qf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ea.copy(n.boundingSphere),ea.applyMatrix4(i),ea.radius+=r,e.ray.intersectsSphere(ea)===!1)return;qh.copy(i).invert(),Hl.copy(e.ray).applyMatrix4(qh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,v=d;g<v;g++){const m=c.getX(g);ta.fromBufferAttribute(u,m),Kh(ta,m,l,i,e,t,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,v=d;g<v;g++)ta.fromBufferAttribute(u,g),Kh(ta,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Kh(s,e,t,n,i,r,a){const o=Hl.distanceSqToPoint(s);if(o<t){const l=new R;Hl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class A0 extends Pt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Kf extends Pt{constructor(e,t,n=Gi,i,r,a,o=Zt,l=Zt,c,h=mr,u=1){if(h!==mr&&h!==gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Zf extends Pt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class wr extends wt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new R,h=new Oe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const d=n+u/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new qe(a,3)),this.setAttribute("normal",new qe(o,3)),this.setAttribute("uv",new qe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class It extends wt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const v=[],m=n/2;let p=0;x(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new qe(u,3)),this.setAttribute("normal",new qe(f,3)),this.setAttribute("uv",new qe(d,2));function x(){const _=new R,E=new R;let T=0;const A=(t-e)/n;for(let C=0;C<=r;C++){const y=[],S=C/r,I=S*(t-e)+e;for(let F=0;F<=i;F++){const z=F/i,V=z*l+o,W=Math.sin(V),j=Math.cos(V);E.x=I*W,E.y=-S*n+m,E.z=I*j,u.push(E.x,E.y,E.z),_.set(W,A,j).normalize(),f.push(_.x,_.y,_.z),d.push(z,1-S),y.push(g++)}v.push(y)}for(let C=0;C<i;C++)for(let y=0;y<r;y++){const S=v[y][C],I=v[y+1][C],F=v[y+1][C+1],z=v[y][C+1];(e>0||y!==0)&&(h.push(S,I,z),T+=3),(t>0||y!==r-1)&&(h.push(I,F,z),T+=3)}c.addGroup(p,T,0),p+=T}function b(_){const E=g,T=new Oe,A=new R;let C=0;const y=_===!0?e:t,S=_===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*S,0),f.push(0,S,0),d.push(.5,.5),g++;const I=g;for(let F=0;F<=i;F++){const V=F/i*l+o,W=Math.cos(V),j=Math.sin(V);A.x=y*j,A.y=m*S,A.z=y*W,u.push(A.x,A.y,A.z),f.push(0,S,0),T.x=W*.5+.5,T.y=j*.5*S+.5,d.push(T.x,T.y),g++}for(let F=0;F<i;F++){const z=E+F,V=I+F;_===!0?h.push(V,V+1,z):h.push(V+1,V,z),C+=3}c.addGroup(p,C,_===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new It(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class dn extends It{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new dn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Xa extends wt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new qe(r,3)),this.setAttribute("normal",new qe(r.slice(),3)),this.setAttribute("uv",new qe(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const b=new R,_=new R,E=new R;for(let T=0;T<t.length;T+=3)d(t[T+0],b),d(t[T+1],_),d(t[T+2],E),l(b,_,E,x)}function l(x,b,_,E){const T=E+1,A=[];for(let C=0;C<=T;C++){A[C]=[];const y=x.clone().lerp(_,C/T),S=b.clone().lerp(_,C/T),I=T-C;for(let F=0;F<=I;F++)F===0&&C===T?A[C][F]=y:A[C][F]=y.clone().lerp(S,F/I)}for(let C=0;C<T;C++)for(let y=0;y<2*(T-C)-1;y++){const S=Math.floor(y/2);y%2===0?(f(A[C][S+1]),f(A[C+1][S]),f(A[C][S])):(f(A[C][S+1]),f(A[C+1][S+1]),f(A[C+1][S]))}}function c(x){const b=new R;for(let _=0;_<r.length;_+=3)b.x=r[_+0],b.y=r[_+1],b.z=r[_+2],b.normalize().multiplyScalar(x),r[_+0]=b.x,r[_+1]=b.y,r[_+2]=b.z}function h(){const x=new R;for(let b=0;b<r.length;b+=3){x.x=r[b+0],x.y=r[b+1],x.z=r[b+2];const _=m(x)/2/Math.PI+.5,E=p(x)/Math.PI+.5;a.push(_,1-E)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){const b=a[x+0],_=a[x+2],E=a[x+4],T=Math.max(b,_,E),A=Math.min(b,_,E);T>.9&&A<.1&&(b<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function d(x,b){const _=x*3;b.x=e[_+0],b.y=e[_+1],b.z=e[_+2]}function g(){const x=new R,b=new R,_=new R,E=new R,T=new Oe,A=new Oe,C=new Oe;for(let y=0,S=0;y<r.length;y+=9,S+=6){x.set(r[y+0],r[y+1],r[y+2]),b.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),T.set(a[S+0],a[S+1]),A.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),E.copy(x).add(b).add(_).divideScalar(3);const I=m(E);v(T,S+0,x,I),v(A,S+2,b,I),v(C,S+4,_,I)}}function v(x,b,_,E){E<0&&x.x===1&&(a[b]=x.x-1),_.x===0&&_.z===0&&(a[b]=E/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xa(e.vertices,e.indices,e.radius,e.details)}}class Er extends Xa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Er(e.radius,e.detail)}}class Pc extends Xa{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Pc(e.radius,e.detail)}}class Xi extends wt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,f=t/l,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*f-a;for(let b=0;b<c;b++){const _=b*u-r;g.push(_,-x,0),v.push(0,0,1),m.push(b/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const b=x+c*p,_=x+c*(p+1),E=x+1+c*(p+1),T=x+1+c*p;d.push(b,_,T),d.push(_,E,T)}this.setIndex(d),this.setAttribute("position",new qe(g,3)),this.setAttribute("normal",new qe(v,3)),this.setAttribute("uv",new qe(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ic extends wt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let u=e;const f=(t-e)/i,d=new R,g=new Oe;for(let v=0;v<=i;v++){for(let m=0;m<=n;m++){const p=r+m/n*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let v=0;v<i;v++){const m=v*(n+1);for(let p=0;p<n;p++){const x=p+m,b=x,_=x+n+1,E=x+n+2,T=x+1;o.push(b,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new qe(l,3)),this.setAttribute("normal",new qe(c,3)),this.setAttribute("uv",new qe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ic(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ja extends wt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new R,f=new R,d=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],b=p/n;let _=0;p===0&&a===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(i+T*r)*Math.sin(a+b*o),u.y=e*Math.cos(a+b*o),u.z=e*Math.sin(i+T*r)*Math.sin(a+b*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(T+_,1-b),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){const b=h[p][x+1],_=h[p][x],E=h[p+1][x],T=h[p+1][x+1];(p!==0||a>0)&&d.push(b,_,T),(p!==n-1||l<Math.PI)&&d.push(_,E,T)}this.setIndex(d),this.setAttribute("position",new qe(g,3)),this.setAttribute("normal",new qe(v,3)),this.setAttribute("uv",new qe(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ja(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Lc extends wt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new R,u=new R,f=new R;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){const v=g/i*r,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(v),u.y=(e+t*Math.cos(m))*Math.sin(v),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){const v=(i+1)*d+g-1,m=(i+1)*(d-1)+g-1,p=(i+1)*(d-1)+g,x=(i+1)*d+g;a.push(v,m,x),a.push(m,p,x)}this.setIndex(a),this.setAttribute("position",new qe(o,3)),this.setAttribute("normal",new qe(l,3)),this.setAttribute("uv",new qe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lc(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Gn extends In{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xn extends Gn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Dc extends In{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ln,this.combine=dc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class R0 extends In{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class C0 extends In{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function na(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function P0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function I0(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Zh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function Jf(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class Tr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class L0 extends Tr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ms,endingEnd:ms}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case gs:r=e,o=2*t-n;break;case Pa:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case gs:a=e,l=2*n-t;break;case Pa:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(i-t),v=g*g,m=v*g,p=-f*m+2*f*v-f*g,x=(1+f)*m+(-1.5-2*f)*v+(-.5+f)*g+1,b=(-1-d)*m+(1.5+d)*v+.5*g,_=d*m-d*v;for(let E=0;E!==o;++E)r[E]=p*a[h+E]+x*a[c+E]+b*a[l+E]+_*a[u+E];return r}}class Qf extends Tr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[c+f]*u+a[l+f]*h;return r}}class D0 extends Tr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Nn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=na(t,this.TimeBufferType),this.values=na(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:na(e.times,Array),values:na(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new D0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Qf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new L0(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case vr:t=this.InterpolantFactoryMethodDiscrete;break;case _r:t=this.InterpolantFactoryMethodLinear;break;case ao:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return vr;case this.InterpolantFactoryMethodLinear:return _r;case this.InterpolantFactoryMethodSmooth:return ao}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&P0(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ao,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){const v=t[u+g];if(v!==t[f+g]||v!==t[d+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Nn.prototype.ValueTypeName="";Nn.prototype.TimeBufferType=Float32Array;Nn.prototype.ValueBufferType=Float32Array;Nn.prototype.DefaultInterpolation=_r;class ks extends Nn{constructor(e,t,n){super(e,t,n)}}ks.prototype.ValueTypeName="bool";ks.prototype.ValueBufferType=Array;ks.prototype.DefaultInterpolation=vr;ks.prototype.InterpolantFactoryMethodLinear=void 0;ks.prototype.InterpolantFactoryMethodSmooth=void 0;class ed extends Nn{constructor(e,t,n,i){super(e,t,n,i)}}ed.prototype.ValueTypeName="color";class Ps extends Nn{constructor(e,t,n,i){super(e,t,n,i)}}Ps.prototype.ValueTypeName="number";class N0 extends Tr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Pn.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Is extends Nn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new N0(this.times,this.values,this.getValueSize(),e)}}Is.prototype.ValueTypeName="quaternion";Is.prototype.InterpolantFactoryMethodSmooth=void 0;class Os extends Nn{constructor(e,t,n){super(e,t,n)}}Os.prototype.ValueTypeName="string";Os.prototype.ValueBufferType=Array;Os.prototype.DefaultInterpolation=vr;Os.prototype.InterpolantFactoryMethodLinear=void 0;Os.prototype.InterpolantFactoryMethodSmooth=void 0;class Ls extends Nn{constructor(e,t,n,i){super(e,t,n,i)}}Ls.prototype.ValueTypeName="vector";class Vl{constructor(e="",t=-1,n=[],i=bc){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Cn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(F0(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Nn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=I0(l);l=Zh(l,1,h),c=Zh(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ps(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let f=i[u];f||(i[u]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,f,d,g,v){if(d.length!==0){const m=[],p=[];Jf(d,m,p,g),m.length!==0&&v.push(new u(f,m,p))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const f=c[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let v=0;v<f[g].morphTargets.length;v++)d[f[g].morphTargets[v]]=-1;for(const v in d){const m=[],p=[];for(let x=0;x!==f[g].morphTargets.length;++x){const b=f[g];m.push(b.time),p.push(b.morphTarget===v?1:0)}i.push(new Ps(".morphTargetInfluence["+v+"]",m,p))}l=d.length*a}else{const d=".bones["+t[u].name+"]";n(Ls,d+".position",f,"pos",i),n(Is,d+".quaternion",f,"rot",i),n(Ls,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function U0(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ps;case"vector":case"vector2":case"vector3":case"vector4":return Ls;case"color":return ed;case"quaternion":return Is;case"bool":case"boolean":return ks;case"string":return Os}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function F0(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=U0(s.type);if(s.times===void 0){const t=[],n=[];Jf(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const ti={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class k0{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const O0=new k0;class zs{constructor(e){this.manager=e!==void 0?e:O0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}zs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Jn={};class z0 extends Error{constructor(e,t){super(e),this.response=t}}class td extends zs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ti.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Jn[e]!==void 0){Jn[e].push({onLoad:t,onProgress:n,onError:i});return}Jn[e]=[],Jn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Jn[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0;let v=0;const m=new ReadableStream({start(p){x();function x(){u.read().then(({done:b,value:_})=>{if(b)p.close();else{v+=_.byteLength;const E=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:d});for(let T=0,A=h.length;T<A;T++){const C=h[T];C.onProgress&&C.onProgress(E)}p.enqueue(_),x()}},b=>{p.error(b)})}}});return new Response(m)}else throw new z0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{ti.add(`file:${e}`,c);const h=Jn[e];delete Jn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=Jn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Jn[e];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const us=new WeakMap;class B0 extends zs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ti.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=us.get(a);u===void 0&&(u=[],us.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=xr("img");function l(){h(),t&&t(this);const u=us.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}us.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),ti.remove(`image:${e}`);const f=us.get(this)||[];for(let d=0;d<f.length;d++){const g=f[d];g.onError&&g.onError(u)}us.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ti.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class H0 extends zs{constructor(e){super(e)}load(e,t,n,i){const r=new Pt,a=new B0(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class $a extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Jh extends $a{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Do=new We,Qh=new R,eu=new R;class Nc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.mapType=Vn,this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cc,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Qh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qh),eu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eu),t.updateMatrixWorld(),Do.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Do,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Do)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class V0 extends Nc{constructor(){super(new nn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Rs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class G0 extends $a{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new V0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const tu=new We,Ks=new R,No=new R;class W0 extends Nc{constructor(){super(new nn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Oe(4,2),this._viewportCount=6,this._viewports=[new nt(2,1,1,1),new nt(0,1,1,1),new nt(3,1,1,1),new nt(1,1,1,1),new nt(3,0,1,1),new nt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ks.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ks),No.copy(n.position),No.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(No),n.updateMatrixWorld(),i.makeTranslation(-Ks.x,-Ks.y,-Ks.z),tu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(tu,n.coordinateSystem,n.reversedDepth)}}class X0 extends $a{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new W0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ar extends Xf{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class j0 extends Nc{constructor(){super(new Ar(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gl extends $a{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new j0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ar{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Uo=new WeakMap;class $0 extends zs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ti.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(Uo.has(a)===!0)i&&i(Uo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ti.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Uo.set(l,c),ti.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ti.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class Y0 extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class q0{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Pn.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;Pn.multiplyQuaternionsFlat(e,a,e,t,e,n),Pn.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const Uc="\\[\\]\\.:\\/",K0=new RegExp("["+Uc+"]","g"),Fc="[^"+Uc+"]",Z0="[^"+Uc.replace("\\.","")+"]",J0=/((?:WC+[\/:])*)/.source.replace("WC",Fc),Q0=/(WCOD+)?/.source.replace("WCOD",Z0),eg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Fc),tg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Fc),ng=new RegExp("^"+J0+Q0+eg+tg+"$"),ig=["material","materials","bones","map"];class sg{constructor(e,t,n){const i=n||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ct{constructor(e,t,n){this.path=t,this.parsedPath=n||ct.parseTrackName(t),this.node=ct.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ct.Composite(e,t,n):new ct(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(K0,"")}static parseTrackName(e){const t=ng.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);ig.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=ct.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ct.Composite=sg;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class rg{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:ms,endingEnd:ms};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=mm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case vm:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case bc:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===gm;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===pm){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=gs,i.endingEnd=gs):(e?i.endingStart=this.zeroSlopeAtStart?gs:ms:i.endingStart=Pa,t?i.endingEnd=this.zeroSlopeAtEnd?gs:ms:i.endingEnd=Pa)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}}const ag=new Float32Array(1);class og extends qi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const f=i[u],d=f.name;let g=h[d];if(g!==void 0)++g.referenceCount,a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,d));continue}const v=t&&t._propertyBindings[u].binding.parsedPath;g=new q0(ct.create(n,d,v),f.ValueTypeName,f.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,d),a[u]=g}o[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,f=(e._localRoot||this._root).uuid;delete u[f],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Qf(new Float32Array(2),new Float32Array(2),1,ag),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?Vl.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=bc),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new rg(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Vl.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const nu=new We;class nd{constructor(e,t,n=0,i=1/0){this.ray=new Sr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ec,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return nu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nu),this}intersectObject(e,t=!0,n=[]){return Wl(e,this,n,t),n.sort(iu),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Wl(e[i],this,n,t);return n.sort(iu),n}}function iu(s,e){return s.distance-e.distance}function Wl(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Wl(r[a],e,t,!0)}}class lg{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=$e(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos($e(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}function su(s,e,t,n){const i=cg(n);switch(t){case Nf:return s*e;case vc:return s*e/i.components*i.byteLength;case _c:return s*e/i.components*i.byteLength;case Ff:return s*e*2/i.components*i.byteLength;case xc:return s*e*2/i.components*i.byteLength;case Uf:return s*e*3/i.components*i.byteLength;case sn:return s*e*4/i.components*i.byteLength;case yc:return s*e*4/i.components*i.byteLength;case ma:case ga:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case va:case _a:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ul:case dl:return Math.max(s,16)*Math.max(e,8)/4;case hl:case fl:return Math.max(s,8)*Math.max(e,8)/2;case pl:case ml:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case gl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case vl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case _l:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case xl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case yl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case bl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case wl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case El:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Tl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Al:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Rl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Cl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Pl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Il:case Ll:case Dl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Nl:case Ul:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Fl:case kl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cg(s){switch(s){case Vn:case Pf:return{byteLength:1,components:1};case dr:case If:case Mr:return{byteLength:2,components:1};case mc:case gc:return{byteLength:2,components:4};case Gi:case pc:case An:return{byteLength:4,components:1};case Lf:case Df:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fc);function id(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function hg(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var ug=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fg=`#ifdef USE_ALPHAHASH
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
#endif`,dg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vg=`#ifdef USE_AOMAP
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
#endif`,_g=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xg=`#ifdef USE_BATCHING
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
#endif`,yg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wg=`#ifdef USE_IRIDESCENCE
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
#endif`,Eg=`#ifdef USE_BUMPMAP
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
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ig=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ng=`#define PI 3.141592653589793
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
} // validated`,Ug=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fg=`vec3 transformedNormal = objectNormal;
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
#endif`,kg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Og=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gg=`#ifdef USE_ENVMAP
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
#endif`,Wg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,jg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
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
#endif`,Yg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jg=`#ifdef USE_GRADIENTMAP
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
}`,Qg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ev=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nv=`uniform bool receiveShadow;
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
#endif`,iv=`#ifdef USE_ENVMAP
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
#endif`,sv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,av=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ov=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lv=`PhysicalMaterial material;
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
#endif`,cv=`struct PhysicalMaterial {
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
}`,hv=`
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
#endif`,uv=`#if defined( RE_IndirectDiffuse )
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
#endif`,fv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_v=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yv=`#if defined( USE_POINTS_UV )
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
#endif`,bv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ev=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`#ifdef USE_MORPHTARGETS
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
#endif`,Av=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Iv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dv=`#ifdef USE_NORMALMAP
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
#endif`,Nv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ov=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$v=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qv=`float getShadowMask() {
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
}`,Kv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zv=`#ifdef USE_SKINNING
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
#endif`,Jv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qv=`#ifdef USE_SKINNING
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
#endif`,e_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,t_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,s_=`#ifdef USE_TRANSMISSION
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
#endif`,r_=`#ifdef USE_TRANSMISSION
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
#endif`,a_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,o_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const h_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u_=`uniform sampler2D t2D;
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
}`,f_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,d_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,p_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g_=`#include <common>
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
}`,v_=`#if DEPTH_PACKING == 3200
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
}`,__=`#define DISTANCE
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
}`,x_=`#define DISTANCE
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
}`,y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,b_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M_=`uniform float scale;
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
}`,S_=`uniform vec3 diffuse;
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
}`,w_=`#include <common>
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
}`,E_=`uniform vec3 diffuse;
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
}`,T_=`#define LAMBERT
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
}`,A_=`#define LAMBERT
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
}`,R_=`#define MATCAP
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
}`,C_=`#define MATCAP
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
}`,P_=`#define NORMAL
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
}`,I_=`#define NORMAL
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
}`,L_=`#define PHONG
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
}`,D_=`#define PHONG
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
}`,N_=`#define STANDARD
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
}`,U_=`#define STANDARD
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
}`,F_=`#define TOON
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
}`,k_=`#define TOON
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
}`,O_=`uniform float size;
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
}`,z_=`uniform vec3 diffuse;
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
}`,B_=`#include <common>
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
}`,H_=`uniform vec3 color;
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
}`,V_=`uniform float rotation;
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
}`,G_=`uniform vec3 diffuse;
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
}`,je={alphahash_fragment:ug,alphahash_pars_fragment:fg,alphamap_fragment:dg,alphamap_pars_fragment:pg,alphatest_fragment:mg,alphatest_pars_fragment:gg,aomap_fragment:vg,aomap_pars_fragment:_g,batching_pars_vertex:xg,batching_vertex:yg,begin_vertex:bg,beginnormal_vertex:Mg,bsdfs:Sg,iridescence_fragment:wg,bumpmap_pars_fragment:Eg,clipping_planes_fragment:Tg,clipping_planes_pars_fragment:Ag,clipping_planes_pars_vertex:Rg,clipping_planes_vertex:Cg,color_fragment:Pg,color_pars_fragment:Ig,color_pars_vertex:Lg,color_vertex:Dg,common:Ng,cube_uv_reflection_fragment:Ug,defaultnormal_vertex:Fg,displacementmap_pars_vertex:kg,displacementmap_vertex:Og,emissivemap_fragment:zg,emissivemap_pars_fragment:Bg,colorspace_fragment:Hg,colorspace_pars_fragment:Vg,envmap_fragment:Gg,envmap_common_pars_fragment:Wg,envmap_pars_fragment:Xg,envmap_pars_vertex:jg,envmap_physical_pars_fragment:iv,envmap_vertex:$g,fog_vertex:Yg,fog_pars_vertex:qg,fog_fragment:Kg,fog_pars_fragment:Zg,gradientmap_pars_fragment:Jg,lightmap_pars_fragment:Qg,lights_lambert_fragment:ev,lights_lambert_pars_fragment:tv,lights_pars_begin:nv,lights_toon_fragment:sv,lights_toon_pars_fragment:rv,lights_phong_fragment:av,lights_phong_pars_fragment:ov,lights_physical_fragment:lv,lights_physical_pars_fragment:cv,lights_fragment_begin:hv,lights_fragment_maps:uv,lights_fragment_end:fv,logdepthbuf_fragment:dv,logdepthbuf_pars_fragment:pv,logdepthbuf_pars_vertex:mv,logdepthbuf_vertex:gv,map_fragment:vv,map_pars_fragment:_v,map_particle_fragment:xv,map_particle_pars_fragment:yv,metalnessmap_fragment:bv,metalnessmap_pars_fragment:Mv,morphinstance_vertex:Sv,morphcolor_vertex:wv,morphnormal_vertex:Ev,morphtarget_pars_vertex:Tv,morphtarget_vertex:Av,normal_fragment_begin:Rv,normal_fragment_maps:Cv,normal_pars_fragment:Pv,normal_pars_vertex:Iv,normal_vertex:Lv,normalmap_pars_fragment:Dv,clearcoat_normal_fragment_begin:Nv,clearcoat_normal_fragment_maps:Uv,clearcoat_pars_fragment:Fv,iridescence_pars_fragment:kv,opaque_fragment:Ov,packing:zv,premultiplied_alpha_fragment:Bv,project_vertex:Hv,dithering_fragment:Vv,dithering_pars_fragment:Gv,roughnessmap_fragment:Wv,roughnessmap_pars_fragment:Xv,shadowmap_pars_fragment:jv,shadowmap_pars_vertex:$v,shadowmap_vertex:Yv,shadowmask_pars_fragment:qv,skinbase_vertex:Kv,skinning_pars_vertex:Zv,skinning_vertex:Jv,skinnormal_vertex:Qv,specularmap_fragment:e_,specularmap_pars_fragment:t_,tonemapping_fragment:n_,tonemapping_pars_fragment:i_,transmission_fragment:s_,transmission_pars_fragment:r_,uv_pars_fragment:a_,uv_pars_vertex:o_,uv_vertex:l_,worldpos_vertex:c_,background_vert:h_,background_frag:u_,backgroundCube_vert:f_,backgroundCube_frag:d_,cube_vert:p_,cube_frag:m_,depth_vert:g_,depth_frag:v_,distanceRGBA_vert:__,distanceRGBA_frag:x_,equirect_vert:y_,equirect_frag:b_,linedashed_vert:M_,linedashed_frag:S_,meshbasic_vert:w_,meshbasic_frag:E_,meshlambert_vert:T_,meshlambert_frag:A_,meshmatcap_vert:R_,meshmatcap_frag:C_,meshnormal_vert:P_,meshnormal_frag:I_,meshphong_vert:L_,meshphong_frag:D_,meshphysical_vert:N_,meshphysical_frag:U_,meshtoon_vert:F_,meshtoon_frag:k_,points_vert:O_,points_frag:z_,shadow_vert:B_,shadow_frag:H_,sprite_vert:V_,sprite_frag:G_},re={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},On={basic:{uniforms:Yt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Yt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Yt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Yt([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Yt([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Yt([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Yt([re.points,re.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Yt([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Yt([re.common,re.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Yt([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Yt([re.sprite,re.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Yt([re.common,re.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Yt([re.lights,re.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};On.physical={uniforms:Yt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const ia={r:0,b:0,g:0},Di=new Ln,W_=new We;function X_(s,e,t,n,i,r,a){const o=new fe(0);let l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(b){let _=b.isScene===!0?b.background:null;return _&&_.isTexture&&(_=(b.backgroundBlurriness>0?t:e).get(_)),_}function v(b){let _=!1;const E=g(b);E===null?p(o,l):E&&E.isColor&&(p(E,1),_=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(b,_){const E=g(_);E&&(E.isCubeTexture||E.mapping===Ha)?(h===void 0&&(h=new He(new Fs(1,1,1),new ri({name:"BackgroundCubeMaterial",uniforms:Cs(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Di.copy(_.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(W_.makeRotationFromEuler(Di)),h.material.toneMapped=tt.getTransfer(E.colorSpace)!==ft,(u!==E||f!==E.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=E,f=E.version,d=s.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new He(new Xi(2,2),new ri({name:"BackgroundMaterial",uniforms:Cs(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==ft,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=E,f=E.version,d=s.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,_){b.getRGB(ia,Wf(s)),n.buffers.color.setClear(ia.r,ia.g,ia.b,_,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,_=1){o.set(b),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(o,l)},render:v,addToRenderList:m,dispose:x}}function j_(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(S,I,F,z,V){let W=!1;const j=u(z,F,I);r!==j&&(r=j,c(r.object)),W=d(S,z,F,V),W&&g(S,z,F,V),V!==null&&e.update(V,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,_(S,I,F,z),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return s.createVertexArray()}function c(S){return s.bindVertexArray(S)}function h(S){return s.deleteVertexArray(S)}function u(S,I,F){const z=F.wireframe===!0;let V=n[S.id];V===void 0&&(V={},n[S.id]=V);let W=V[I.id];W===void 0&&(W={},V[I.id]=W);let j=W[z];return j===void 0&&(j=f(l()),W[z]=j),j}function f(S){const I=[],F=[],z=[];for(let V=0;V<t;V++)I[V]=0,F[V]=0,z[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:z,object:S,attributes:{},index:null}}function d(S,I,F,z){const V=r.attributes,W=I.attributes;let j=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){const he=V[H];let Te=W[H];if(Te===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(Te=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(Te=S.instanceColor)),he===void 0||he.attribute!==Te||Te&&he.data!==Te.data)return!0;j++}return r.attributesNum!==j||r.index!==z}function g(S,I,F,z){const V={},W=I.attributes;let j=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){let he=W[H];he===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(he=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(he=S.instanceColor));const Te={};Te.attribute=he,he&&he.data&&(Te.data=he.data),V[H]=Te,j++}r.attributes=V,r.attributesNum=j,r.index=z}function v(){const S=r.newAttributes;for(let I=0,F=S.length;I<F;I++)S[I]=0}function m(S){p(S,0)}function p(S,I){const F=r.newAttributes,z=r.enabledAttributes,V=r.attributeDivisors;F[S]=1,z[S]===0&&(s.enableVertexAttribArray(S),z[S]=1),V[S]!==I&&(s.vertexAttribDivisor(S,I),V[S]=I)}function x(){const S=r.newAttributes,I=r.enabledAttributes;for(let F=0,z=I.length;F<z;F++)I[F]!==S[F]&&(s.disableVertexAttribArray(F),I[F]=0)}function b(S,I,F,z,V,W,j){j===!0?s.vertexAttribIPointer(S,I,F,V,W):s.vertexAttribPointer(S,I,F,z,V,W)}function _(S,I,F,z){v();const V=z.attributes,W=F.getAttributes(),j=I.defaultAttributeValues;for(const K in W){const H=W[K];if(H.location>=0){let ae=V[K];if(ae===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(ae=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(ae=S.instanceColor)),ae!==void 0){const he=ae.normalized,Te=ae.itemSize,Ke=e.get(ae);if(Ke===void 0)continue;const mt=Ke.buffer,bt=Ke.type,ot=Ke.bytesPerElement,$=bt===s.INT||bt===s.UNSIGNED_INT||ae.gpuType===pc;if(ae.isInterleavedBufferAttribute){const Z=ae.data,pe=Z.stride,Fe=ae.offset;if(Z.isInstancedInterleavedBuffer){for(let we=0;we<H.locationSize;we++)p(H.location+we,Z.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let we=0;we<H.locationSize;we++)m(H.location+we);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let we=0;we<H.locationSize;we++)b(H.location+we,Te/H.locationSize,bt,he,pe*ot,(Fe+Te/H.locationSize*we)*ot,$)}else{if(ae.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,ae.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Z=0;Z<H.locationSize;Z++)m(H.location+Z);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let Z=0;Z<H.locationSize;Z++)b(H.location+Z,Te/H.locationSize,bt,he,Te*ot,Te/H.locationSize*Z*ot,$)}}else if(j!==void 0){const he=j[K];if(he!==void 0)switch(he.length){case 2:s.vertexAttrib2fv(H.location,he);break;case 3:s.vertexAttrib3fv(H.location,he);break;case 4:s.vertexAttrib4fv(H.location,he);break;default:s.vertexAttrib1fv(H.location,he)}}}}x()}function E(){C();for(const S in n){const I=n[S];for(const F in I){const z=I[F];for(const V in z)h(z[V].object),delete z[V];delete I[F]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const I=n[S.id];for(const F in I){const z=I[F];for(const V in z)h(z[V].object),delete z[V];delete I[F]}delete n[S.id]}function A(S){for(const I in n){const F=n[I];if(F[S.id]===void 0)continue;const z=F[S.id];for(const V in z)h(z[V].object),delete z[V];delete F[S.id]}}function C(){y(),a=!0,r!==i&&(r=i,c(r.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:y,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function $_(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];t.update(d,n,1)}function l(c,h,u,f){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*f[v];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Y_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==sn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const C=A===Mr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Vn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==An&&!C)}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function q_(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new ei,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,b=x*4;let _=p.clippingState||null;l.value=_,_=h(g,f,b,d);for(let E=0;E!==b;++E)_[E]=t[E];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,_=d;b!==v;++b,_+=4)a.copy(u[b]).applyMatrix4(x,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function K_(s){let e=new WeakMap;function t(a,o){return o===ll?a.mapping=Ts:o===cl&&(a.mapping=As),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ll||o===cl)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new m0(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const vs=4,ru=[.125,.215,.35,.446,.526,.582],Oi=20,Fo=new Ar,au=new fe;let ko=null,Oo=0,zo=0,Bo=!1;const Fi=(1+Math.sqrt(5))/2,fs=1/Fi,ou=[new R(-Fi,fs,0),new R(Fi,fs,0),new R(-fs,0,Fi),new R(fs,0,Fi),new R(0,Fi,-fs),new R(0,Fi,fs),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Z_=new R;class lu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=Z_}=r;ko=this._renderer.getRenderTarget(),Oo=this._renderer.getActiveCubeFace(),zo=this._renderer.getActiveMipmapLevel(),Bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ko,Oo,zo),this._renderer.xr.enabled=Bo,e.scissorTest=!1,sa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ts||e.mapping===As?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ko=this._renderer.getRenderTarget(),Oo=this._renderer.getActiveCubeFace(),zo=this._renderer.getActiveMipmapLevel(),Bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:Mr,format:sn,colorSpace:Jt,depthBuffer:!1},i=cu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cu(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=J_(r)),this._blurMaterial=Q_(r,e,t)}return i}_compileMaterial(e){const t=new He(this._lodPlanes[0],e);this._renderer.compile(t,Fo)}_sceneToCubeUV(e,t,n,i,r){const l=new nn(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(au),u.toneMapping=Mi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));const v=new qt({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),m=new He(new Fs,v);let p=!1;const x=e.background;x?x.isColor&&(v.color.copy(x),e.background=null,p=!0):(v.color.copy(au),p=!0);for(let b=0;b<6;b++){const _=b%3;_===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):_===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));const E=this._cubeSize;sa(i,_*E,b>2?E:0,E,E),u.setRenderTarget(i),p&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ts||e.mapping===As;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=uu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hu());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new He(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;sa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Fo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ou[(i-r-1)%ou.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new He(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Oi-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Oi;m>Oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Oi}`);const p=[];let x=0;for(let A=0;A<Oi;++A){const C=A/v,y=Math.exp(-C*C/2);p.push(y),A===0?x+=y:A<m&&(x+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:b}=this;f.dTheta.value=g,f.mipInt.value=b-n;const _=this._sizeLods[i],E=3*_*(i>b-vs?i-b+vs:0),T=4*(this._cubeSize-_);sa(t,E,T,3*_,2*_),l.setRenderTarget(t),l.render(u,Fo)}}function J_(s){const e=[],t=[],n=[];let i=s;const r=s-vs+1+ru.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-vs?l=ru[a-s+vs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*d),b=new Float32Array(m*g*d),_=new Float32Array(p*g*d);for(let T=0;T<d;T++){const A=T%3*2/3-1,C=T>2?0:-1,y=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];x.set(y,v*g*T),b.set(f,m*g*T);const S=[T,T,T,T,T,T];_.set(S,p*g*T)}const E=new wt;E.setAttribute("position",new kt(x,v)),E.setAttribute("uv",new kt(b,m)),E.setAttribute("faceIndex",new kt(_,p)),e.push(E),i>vs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function cu(s,e,t){const n=new Wi(s,e,t);return n.texture.mapping=Ha,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function sa(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Q_(s,e,t){const n=new Float32Array(Oi),i=new R(0,1,0);return new ri({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:kc(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function hu(){return new ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kc(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function uu(){return new ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function kc(){return`

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
	`}function ex(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ll||l===cl,h=l===Ts||l===As;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new lu(s)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||h&&d&&i(d)?(t===null&&(t=new lu(s)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function tx(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&yr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function nx(s,e,t,n){const i={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const d in f)e.update(f[d],s.ARRAY_BUFFER)}function c(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(d!==null){const x=d.array;v=d.version;for(let b=0,_=x.length;b<_;b+=3){const E=x[b+0],T=x[b+1],A=x[b+2];f.push(E,T,T,A,A,E)}}else if(g!==void 0){const x=g.array;v=g.version;for(let b=0,_=x.length/3-1;b<_;b+=3){const E=b+0,T=b+1,A=b+2;f.push(E,T,T,A,A,E)}}else return;const m=new(zf(f)?Gf:Vf)(f,1);m.version=v;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function ix(s,e,t){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*a),t.update(d,n,1)}function c(f,d,g){g!==0&&(s.drawElementsInstanced(n,d,r,f*a,g),t.update(d,n,g))}function h(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function u(f,d,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/a,d[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=d[x]*v[x];t.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sx(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function rx(s,e,t){const n=new WeakMap,i=new nt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var d=S;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*u),C=new Bf(A,E,T,u);C.type=An,C.needsUpdate=!0;const y=_*4;for(let I=0;I<u;I++){const F=p[I],z=x[I],V=b[I],W=E*T*4*I;for(let j=0;j<F.count;j++){const K=j*y;g===!0&&(i.fromBufferAttribute(F,j),A[W+K+0]=i.x,A[W+K+1]=i.y,A[W+K+2]=i.z,A[W+K+3]=0),v===!0&&(i.fromBufferAttribute(z,j),A[W+K+4]=i.x,A[W+K+5]=i.y,A[W+K+6]=i.z,A[W+K+7]=0),m===!0&&(i.fromBufferAttribute(V,j),A[W+K+8]=i.x,A[W+K+9]=i.y,A[W+K+10]=i.z,A[W+K+11]=V.itemSize===4?i.w:1)}}f={count:u,texture:C,size:new Oe(E,T)},n.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function ax(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const sd=new Pt,fu=new Kf(1,1),rd=new Bf,ad=new Jm,od=new jf,du=[],pu=[],mu=new Float32Array(16),gu=new Float32Array(9),vu=new Float32Array(4);function Bs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=du[i];if(r===void 0&&(r=new Float32Array(i),du[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Lt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Dt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ya(s,e){let t=pu[e];t===void 0&&(t=new Int32Array(e),pu[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function ox(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function lx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2fv(this.addr,e),Dt(t,e)}}function cx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;s.uniform3fv(this.addr,e),Dt(t,e)}}function hx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4fv(this.addr,e),Dt(t,e)}}function ux(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;vu.set(n),s.uniformMatrix2fv(this.addr,!1,vu),Dt(t,n)}}function fx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;gu.set(n),s.uniformMatrix3fv(this.addr,!1,gu),Dt(t,n)}}function dx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;mu.set(n),s.uniformMatrix4fv(this.addr,!1,mu),Dt(t,n)}}function px(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function mx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2iv(this.addr,e),Dt(t,e)}}function gx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3iv(this.addr,e),Dt(t,e)}}function vx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4iv(this.addr,e),Dt(t,e)}}function _x(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function xx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2uiv(this.addr,e),Dt(t,e)}}function yx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3uiv(this.addr,e),Dt(t,e)}}function bx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4uiv(this.addr,e),Dt(t,e)}}function Mx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(fu.compareFunction=Of,r=fu):r=sd,t.setTexture2D(e||r,i)}function Sx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ad,i)}function wx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||od,i)}function Ex(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||rd,i)}function Tx(s){switch(s){case 5126:return ox;case 35664:return lx;case 35665:return cx;case 35666:return hx;case 35674:return ux;case 35675:return fx;case 35676:return dx;case 5124:case 35670:return px;case 35667:case 35671:return mx;case 35668:case 35672:return gx;case 35669:case 35673:return vx;case 5125:return _x;case 36294:return xx;case 36295:return yx;case 36296:return bx;case 35678:case 36198:case 36298:case 36306:case 35682:return Mx;case 35679:case 36299:case 36307:return Sx;case 35680:case 36300:case 36308:case 36293:return wx;case 36289:case 36303:case 36311:case 36292:return Ex}}function Ax(s,e){s.uniform1fv(this.addr,e)}function Rx(s,e){const t=Bs(e,this.size,2);s.uniform2fv(this.addr,t)}function Cx(s,e){const t=Bs(e,this.size,3);s.uniform3fv(this.addr,t)}function Px(s,e){const t=Bs(e,this.size,4);s.uniform4fv(this.addr,t)}function Ix(s,e){const t=Bs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Lx(s,e){const t=Bs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Dx(s,e){const t=Bs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Nx(s,e){s.uniform1iv(this.addr,e)}function Ux(s,e){s.uniform2iv(this.addr,e)}function Fx(s,e){s.uniform3iv(this.addr,e)}function kx(s,e){s.uniform4iv(this.addr,e)}function Ox(s,e){s.uniform1uiv(this.addr,e)}function zx(s,e){s.uniform2uiv(this.addr,e)}function Bx(s,e){s.uniform3uiv(this.addr,e)}function Hx(s,e){s.uniform4uiv(this.addr,e)}function Vx(s,e,t){const n=this.cache,i=e.length,r=Ya(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||sd,r[a])}function Gx(s,e,t){const n=this.cache,i=e.length,r=Ya(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||ad,r[a])}function Wx(s,e,t){const n=this.cache,i=e.length,r=Ya(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||od,r[a])}function Xx(s,e,t){const n=this.cache,i=e.length,r=Ya(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||rd,r[a])}function jx(s){switch(s){case 5126:return Ax;case 35664:return Rx;case 35665:return Cx;case 35666:return Px;case 35674:return Ix;case 35675:return Lx;case 35676:return Dx;case 5124:case 35670:return Nx;case 35667:case 35671:return Ux;case 35668:case 35672:return Fx;case 35669:case 35673:return kx;case 5125:return Ox;case 36294:return zx;case 36295:return Bx;case 36296:return Hx;case 35678:case 36198:case 36298:case 36306:case 35682:return Vx;case 35679:case 36299:case 36307:return Gx;case 35680:case 36300:case 36308:case 36293:return Wx;case 36289:case 36303:case 36311:case 36292:return Xx}}class $x{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tx(t.type)}}class Yx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jx(t.type)}}class qx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Ho=/(\w+)(\])?(\[|\.)?/g;function _u(s,e){s.seq.push(e),s.map[e.id]=e}function Kx(s,e,t){const n=s.name,i=n.length;for(Ho.lastIndex=0;;){const r=Ho.exec(n),a=Ho.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){_u(t,c===void 0?new $x(o,s,e):new Yx(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new qx(o),_u(t,u)),t=u}}}class xa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Kx(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function xu(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Zx=37297;let Jx=0;function Qx(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const yu=new Ge;function ey(s){tt._getMatrix(yu,tt.workingColorSpace,s);const e=`mat3( ${yu.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(s)){case Ia:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function bu(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Qx(s.getShaderSource(e),o)}else return r}function ty(s,e){const t=ey(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ny(s,e){let t;switch(e){case om:t="Linear";break;case lm:t="Reinhard";break;case cm:t="Cineon";break;case ol:t="ACESFilmic";break;case um:t="AgX";break;case fm:t="Neutral";break;case hm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ra=new R;function iy(){tt.getLuminanceCoefficients(ra);const s=ra.x.toFixed(4),e=ra.y.toFixed(4),t=ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sy(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function ry(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ay(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function tr(s){return s!==""}function Mu(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Su(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const oy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xl(s){return s.replace(oy,cy)}const ly=new Map;function cy(s,e){let t=je[e];if(t===void 0){const n=ly.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Xl(t)}const hy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wu(s){return s.replace(hy,uy)}function uy(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Eu(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function fy(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Tf?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Af?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Qn&&(e="SHADOWMAP_TYPE_VSM"),e}function dy(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ts:case As:e="ENVMAP_TYPE_CUBE";break;case Ha:e="ENVMAP_TYPE_CUBE_UV";break}return e}function py(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===As&&(e="ENVMAP_MODE_REFRACTION"),e}function my(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case dc:e="ENVMAP_BLENDING_MULTIPLY";break;case rm:e="ENVMAP_BLENDING_MIX";break;case am:e="ENVMAP_BLENDING_ADD";break}return e}function gy(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vy(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=fy(t),c=dy(t),h=py(t),u=my(t),f=gy(t),d=sy(t),g=ry(r),v=i.createProgram();let m,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(tr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(tr).join(`
`),p.length>0&&(p+=`
`)):(m=[Eu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),p=[Eu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?je.tonemapping_pars_fragment:"",t.toneMapping!==Mi?ny("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,ty("linearToOutputTexel",t.outputColorSpace),iy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(tr).join(`
`)),a=Xl(a),a=Mu(a,t),a=Su(a,t),o=Xl(o),o=Mu(o,t),o=Su(o,t),a=wu(a),o=wu(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===vh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=x+m+a,_=x+p+o,E=xu(i,i.VERTEX_SHADER,b),T=xu(i,i.FRAGMENT_SHADER,_);i.attachShader(v,E),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function A(I){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(v)||"",z=i.getShaderInfoLog(E)||"",V=i.getShaderInfoLog(T)||"",W=F.trim(),j=z.trim(),K=V.trim();let H=!0,ae=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,T);else{const he=bu(i,E,"vertex"),Te=bu(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+W+`
`+he+`
`+Te)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(j===""||K==="")&&(ae=!1);ae&&(I.diagnostics={runnable:H,programLog:W,vertexShader:{log:j,prefix:m},fragmentShader:{log:K,prefix:p}})}i.deleteShader(E),i.deleteShader(T),C=new xa(i,v),y=ay(i,v)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(v,Zx)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jx++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let _y=0;class xy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new yy(e),t.set(e,n)),n}}class yy{constructor(e){this.id=_y++,this.code=e,this.usedTimes=0}}function by(s,e,t,n,i,r,a){const o=new Ec,l=new xy,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,S,I,F,z){const V=F.fog,W=z.geometry,j=y.isMeshStandardMaterial?F.environment:null,K=(y.isMeshStandardMaterial?t:e).get(y.envMap||j),H=K&&K.mapping===Ha?K.image.height:null,ae=g[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const he=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Te=he!==void 0?he.length:0;let Ke=0;W.morphAttributes.position!==void 0&&(Ke=1),W.morphAttributes.normal!==void 0&&(Ke=2),W.morphAttributes.color!==void 0&&(Ke=3);let mt,bt,ot,$;if(ae){const lt=On[ae];mt=lt.vertexShader,bt=lt.fragmentShader}else mt=y.vertexShader,bt=y.fragmentShader,l.update(y),ot=l.getVertexShaderID(y),$=l.getFragmentShaderID(y);const Z=s.getRenderTarget(),pe=s.state.buffers.depth.getReversed(),Fe=z.isInstancedMesh===!0,we=z.isBatchedMesh===!0,et=!!y.map,zt=!!y.matcap,L=!!K,Mt=!!y.aoMap,Be=!!y.lightMap,Ne=!!y.bumpMap,ve=!!y.normalMap,St=!!y.displacementMap,_e=!!y.emissiveMap,Xe=!!y.metalnessMap,Nt=!!y.roughnessMap,Rt=y.anisotropy>0,P=y.clearcoat>0,M=y.dispersion>0,k=y.iridescence>0,X=y.sheen>0,q=y.transmission>0,G=Rt&&!!y.anisotropyMap,Se=P&&!!y.clearcoatMap,ie=P&&!!y.clearcoatNormalMap,xe=P&&!!y.clearcoatRoughnessMap,ye=k&&!!y.iridescenceMap,te=k&&!!y.iridescenceThicknessMap,ce=X&&!!y.sheenColorMap,De=X&&!!y.sheenRoughnessMap,be=!!y.specularMap,oe=!!y.specularColorMap,Ve=!!y.specularIntensityMap,D=q&&!!y.transmissionMap,ne=q&&!!y.thicknessMap,se=!!y.gradientMap,de=!!y.alphaMap,J=y.alphaTest>0,Y=!!y.alphaHash,ge=!!y.extensions;let ze=Mi;y.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ze=s.toneMapping);const gt={shaderID:ae,shaderType:y.type,shaderName:y.name,vertexShader:mt,fragmentShader:bt,defines:y.defines,customVertexShaderID:ot,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:we,batchingColor:we&&z._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&z.instanceColor!==null,instancingMorph:Fe&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Z===null?s.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Jt,alphaToCoverage:!!y.alphaToCoverage,map:et,matcap:zt,envMap:L,envMapMode:L&&K.mapping,envMapCubeUVHeight:H,aoMap:Mt,lightMap:Be,bumpMap:Ne,normalMap:ve,displacementMap:f&&St,emissiveMap:_e,normalMapObjectSpace:ve&&y.normalMapType===bm,normalMapTangentSpace:ve&&y.normalMapType===Mc,metalnessMap:Xe,roughnessMap:Nt,anisotropy:Rt,anisotropyMap:G,clearcoat:P,clearcoatMap:Se,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:M,iridescence:k,iridescenceMap:ye,iridescenceThicknessMap:te,sheen:X,sheenColorMap:ce,sheenRoughnessMap:De,specularMap:be,specularColorMap:oe,specularIntensityMap:Ve,transmission:q,transmissionMap:D,thicknessMap:ne,gradientMap:se,opaque:y.transparent===!1&&y.blending===xs&&y.alphaToCoverage===!1,alphaMap:de,alphaTest:J,alphaHash:Y,combine:y.combine,mapUv:et&&v(y.map.channel),aoMapUv:Mt&&v(y.aoMap.channel),lightMapUv:Be&&v(y.lightMap.channel),bumpMapUv:Ne&&v(y.bumpMap.channel),normalMapUv:ve&&v(y.normalMap.channel),displacementMapUv:St&&v(y.displacementMap.channel),emissiveMapUv:_e&&v(y.emissiveMap.channel),metalnessMapUv:Xe&&v(y.metalnessMap.channel),roughnessMapUv:Nt&&v(y.roughnessMap.channel),anisotropyMapUv:G&&v(y.anisotropyMap.channel),clearcoatMapUv:Se&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:ie&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:te&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:De&&v(y.sheenRoughnessMap.channel),specularMapUv:be&&v(y.specularMap.channel),specularColorMapUv:oe&&v(y.specularColorMap.channel),specularIntensityMapUv:Ve&&v(y.specularIntensityMap.channel),transmissionMapUv:D&&v(y.transmissionMap.channel),thicknessMapUv:ne&&v(y.thicknessMap.channel),alphaMapUv:de&&v(y.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ve||Rt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(et||de),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pe,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:Ke,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:ze,decodeVideoTexture:et&&y.map.isVideoTexture===!0&&tt.getTransfer(y.map.colorSpace)===ft,decodeVideoTextureEmissive:_e&&y.emissiveMap.isVideoTexture===!0&&tt.getTransfer(y.emissiveMap.colorSpace)===ft,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Gt,flipSided:y.side===rn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ge&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&y.extensions.multiDraw===!0||we)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const I in y.defines)S.push(I),S.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(x(S,y),b(S,y),S.push(s.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function x(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function b(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){const S=g[y.type];let I;if(S){const F=On[S];I=u0.clone(F.uniforms)}else I=y.uniforms;return I}function E(y,S){let I;for(let F=0,z=h.length;F<z;F++){const V=h[F];if(V.cacheKey===S){I=V,++I.usedTimes;break}}return I===void 0&&(I=new vy(s,S,y,r),h.push(I)),I}function T(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function A(y){l.remove(y)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:C}}function My(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Sy(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Tu(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Au(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u,f,d,g,v,m){let p=s[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},s[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),e++,p}function o(u,f,d,g,v,m){const p=a(u,f,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function l(u,f,d,g,v,m){const p=a(u,f,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function c(u,f){t.length>1&&t.sort(u||Sy),n.length>1&&n.sort(f||Tu),i.length>1&&i.sort(f||Tu)}function h(){for(let u=e,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function wy(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Au,s.set(n,[a])):i>=r.length?(a=new Au,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Ey(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new fe};break;case"SpotLight":t={position:new R,direction:new R,color:new fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new fe,groundColor:new fe};break;case"RectAreaLight":t={color:new fe,position:new R,halfWidth:new R,halfHeight:new R};break}return s[e.id]=t,t}}}function Ty(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Ay=0;function Ry(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Cy(s){const e=new Ey,t=Ty(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const i=new R,r=new We,a=new We;function o(c){let h=0,u=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,x=0,b=0,_=0,E=0,T=0,A=0;c.sort(Ry);for(let y=0,S=c.length;y<S;y++){const I=c[y],F=I.color,z=I.intensity,V=I.distance,W=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=F.r*z,u+=F.g*z,f+=F.b*z;else if(I.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(I.sh.coefficients[j],z);A++}else if(I.isDirectionalLight){const j=e.get(I);if(j.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const K=I.shadow,H=t.get(I);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[d]=H,n.directionalShadowMap[d]=W,n.directionalShadowMatrix[d]=I.shadow.matrix,x++}n.directional[d]=j,d++}else if(I.isSpotLight){const j=e.get(I);j.position.setFromMatrixPosition(I.matrixWorld),j.color.copy(F).multiplyScalar(z),j.distance=V,j.coneCos=Math.cos(I.angle),j.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),j.decay=I.decay,n.spot[v]=j;const K=I.shadow;if(I.map&&(n.spotLightMap[E]=I.map,E++,K.updateMatrices(I),I.castShadow&&T++),n.spotLightMatrix[v]=K.matrix,I.castShadow){const H=t.get(I);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=W,_++}v++}else if(I.isRectAreaLight){const j=e.get(I);j.color.copy(F).multiplyScalar(z),j.halfWidth.set(I.width*.5,0,0),j.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=j,m++}else if(I.isPointLight){const j=e.get(I);if(j.color.copy(I.color).multiplyScalar(I.intensity),j.distance=I.distance,j.decay=I.decay,I.castShadow){const K=I.shadow,H=t.get(I);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=I.shadow.matrix,b++}n.point[g]=j,g++}else if(I.isHemisphereLight){const j=e.get(I);j.skyColor.copy(I.color).multiplyScalar(z),j.groundColor.copy(I.groundColor).multiplyScalar(z),n.hemi[p]=j,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=re.LTC_FLOAT_1,n.rectAreaLTC2=re.LTC_FLOAT_2):(n.rectAreaLTC1=re.LTC_HALF_1,n.rectAreaLTC2=re.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==d||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==x||C.numPointShadows!==b||C.numSpotShadows!==_||C.numSpotMaps!==E||C.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=_+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,C.directionalLength=d,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=x,C.numPointShadows=b,C.numSpotShadows=_,C.numSpotMaps=E,C.numLightProbes=A,n.version=Ay++)}function l(c,h){let u=0,f=0,d=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const b=c[p];if(b.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),u++}else if(b.isSpotLight){const _=n.spot[d];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(m),d++}else if(b.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),_.halfWidth.set(b.width*.5,0,0),_.halfHeight.set(0,b.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const _=n.point[f];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(b.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:n}}function Ru(s){const e=new Cy(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Py(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Ru(s),e.set(i,[o])):r>=a.length?(o=new Ru(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ly=`uniform sampler2D shadow_pass;
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
}`;function Dy(s,e,t){let n=new Cc;const i=new Oe,r=new Oe,a=new nt,o=new R0({depthPacking:ym}),l=new C0,c={},h=t.maxTextureSize,u={[si]:rn,[rn]:si,[Gt]:Gt},f=new ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Iy,fragmentShader:Ly}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new wt;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new He(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tf;let p=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const y=s.getRenderTarget(),S=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),F=s.state;F.setBlending(bi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Qn&&this.type===Qn,V=p===Qn&&this.type!==Qn;for(let W=0,j=T.length;W<j;W++){const K=T[W],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const ae=H.getFrameExtents();if(i.multiply(ae),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ae.x),i.x=r.x*ae.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ae.y),i.y=r.y*ae.y,H.mapSize.y=r.y)),H.map===null||z===!0||V===!0){const Te=this.type!==Qn?{minFilter:Zt,magFilter:Zt}:{};H.map!==null&&H.map.dispose(),H.map=new Wi(i.x,i.y,Te),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const he=H.getViewportCount();for(let Te=0;Te<he;Te++){const Ke=H.getViewport(Te);a.set(r.x*Ke.x,r.y*Ke.y,r.x*Ke.z,r.y*Ke.w),F.viewport(a),H.updateMatrices(K,Te),n=H.getFrustum(),_(A,C,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===Qn&&x(H,C),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(y,S,I)};function x(T,A){const C=e.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wi(i.x,i.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(A,null,C,f,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(A,null,C,d,v,null)}function b(T,A,C,y){let S=null;const I=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)S=I;else if(S=C.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=S.uuid,z=A.uuid;let V=c[F];V===void 0&&(V={},c[F]=V);let W=V[z];W===void 0&&(W=S.clone(),V[z]=W,A.addEventListener("dispose",E)),S=W}if(S.visible=A.visible,S.wireframe=A.wireframe,y===Qn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:u[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=s.properties.get(S);F.light=C}return S}function _(T,A,C,y,S){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Qn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const z=e.update(T),V=T.material;if(Array.isArray(V)){const W=z.groups;for(let j=0,K=W.length;j<K;j++){const H=W[j],ae=V[H.materialIndex];if(ae&&ae.visible){const he=b(T,ae,y,S);T.onBeforeShadow(s,T,A,C,z,he,H),s.renderBufferDirect(C,null,z,he,T,H),T.onAfterShadow(s,T,A,C,z,he,H)}}}else if(V.visible){const W=b(T,V,y,S);T.onBeforeShadow(s,T,A,C,z,W,null),s.renderBufferDirect(C,null,z,W,T,null),T.onAfterShadow(s,T,A,C,z,W,null)}}const F=T.children;for(let z=0,V=F.length;z<V;z++)_(F[z],A,C,y,S)}function E(T){T.target.removeEventListener("dispose",E);for(const C in c){const y=c[C],S=T.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const Ny={[el]:tl,[nl]:rl,[il]:al,[Es]:sl,[tl]:el,[rl]:nl,[al]:il,[sl]:Es};function Uy(s,e){function t(){let D=!1;const ne=new nt;let se=null;const de=new nt(0,0,0,0);return{setMask:function(J){se!==J&&!D&&(s.colorMask(J,J,J,J),se=J)},setLocked:function(J){D=J},setClear:function(J,Y,ge,ze,gt){gt===!0&&(J*=ze,Y*=ze,ge*=ze),ne.set(J,Y,ge,ze),de.equals(ne)===!1&&(s.clearColor(J,Y,ge,ze),de.copy(ne))},reset:function(){D=!1,se=null,de.set(-1,0,0,0)}}}function n(){let D=!1,ne=!1,se=null,de=null,J=null;return{setReversed:function(Y){if(ne!==Y){const ge=e.get("EXT_clip_control");Y?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),ne=Y;const ze=J;J=null,this.setClear(ze)}},getReversed:function(){return ne},setTest:function(Y){Y?Z(s.DEPTH_TEST):pe(s.DEPTH_TEST)},setMask:function(Y){se!==Y&&!D&&(s.depthMask(Y),se=Y)},setFunc:function(Y){if(ne&&(Y=Ny[Y]),de!==Y){switch(Y){case el:s.depthFunc(s.NEVER);break;case tl:s.depthFunc(s.ALWAYS);break;case nl:s.depthFunc(s.LESS);break;case Es:s.depthFunc(s.LEQUAL);break;case il:s.depthFunc(s.EQUAL);break;case sl:s.depthFunc(s.GEQUAL);break;case rl:s.depthFunc(s.GREATER);break;case al:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}de=Y}},setLocked:function(Y){D=Y},setClear:function(Y){J!==Y&&(ne&&(Y=1-Y),s.clearDepth(Y),J=Y)},reset:function(){D=!1,se=null,de=null,J=null,ne=!1}}}function i(){let D=!1,ne=null,se=null,de=null,J=null,Y=null,ge=null,ze=null,gt=null;return{setTest:function(lt){D||(lt?Z(s.STENCIL_TEST):pe(s.STENCIL_TEST))},setMask:function(lt){ne!==lt&&!D&&(s.stencilMask(lt),ne=lt)},setFunc:function(lt,jn,Un){(se!==lt||de!==jn||J!==Un)&&(s.stencilFunc(lt,jn,Un),se=lt,de=jn,J=Un)},setOp:function(lt,jn,Un){(Y!==lt||ge!==jn||ze!==Un)&&(s.stencilOp(lt,jn,Un),Y=lt,ge=jn,ze=Un)},setLocked:function(lt){D=lt},setClear:function(lt){gt!==lt&&(s.clearStencil(lt),gt=lt)},reset:function(){D=!1,ne=null,se=null,de=null,J=null,Y=null,ge=null,ze=null,gt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,x=null,b=null,_=null,E=null,T=null,A=new fe(0,0,0),C=0,y=!1,S=null,I=null,F=null,z=null,V=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,K=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),j=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),j=K>=2);let ae=null,he={};const Te=s.getParameter(s.SCISSOR_BOX),Ke=s.getParameter(s.VIEWPORT),mt=new nt().fromArray(Te),bt=new nt().fromArray(Ke);function ot(D,ne,se,de){const J=new Uint8Array(4),Y=s.createTexture();s.bindTexture(D,Y),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ge=0;ge<se;ge++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(ne,0,s.RGBA,1,1,de,0,s.RGBA,s.UNSIGNED_BYTE,J):s.texImage2D(ne+ge,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,J);return Y}const $={};$[s.TEXTURE_2D]=ot(s.TEXTURE_2D,s.TEXTURE_2D,1),$[s.TEXTURE_CUBE_MAP]=ot(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[s.TEXTURE_2D_ARRAY]=ot(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),$[s.TEXTURE_3D]=ot(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(s.DEPTH_TEST),a.setFunc(Es),Ne(!1),ve(uh),Z(s.CULL_FACE),Mt(bi);function Z(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function pe(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function Fe(D,ne){return u[D]!==ne?(s.bindFramebuffer(D,ne),u[D]=ne,D===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=ne),D===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=ne),!0):!1}function we(D,ne){let se=d,de=!1;if(D){se=f.get(ne),se===void 0&&(se=[],f.set(ne,se));const J=D.textures;if(se.length!==J.length||se[0]!==s.COLOR_ATTACHMENT0){for(let Y=0,ge=J.length;Y<ge;Y++)se[Y]=s.COLOR_ATTACHMENT0+Y;se.length=J.length,de=!0}}else se[0]!==s.BACK&&(se[0]=s.BACK,de=!0);de&&s.drawBuffers(se)}function et(D){return g!==D?(s.useProgram(D),g=D,!0):!1}const zt={[ki]:s.FUNC_ADD,[Vp]:s.FUNC_SUBTRACT,[Gp]:s.FUNC_REVERSE_SUBTRACT};zt[Wp]=s.MIN,zt[Xp]=s.MAX;const L={[jp]:s.ZERO,[$p]:s.ONE,[Yp]:s.SRC_COLOR,[Jo]:s.SRC_ALPHA,[em]:s.SRC_ALPHA_SATURATE,[Jp]:s.DST_COLOR,[Kp]:s.DST_ALPHA,[qp]:s.ONE_MINUS_SRC_COLOR,[Qo]:s.ONE_MINUS_SRC_ALPHA,[Qp]:s.ONE_MINUS_DST_COLOR,[Zp]:s.ONE_MINUS_DST_ALPHA,[tm]:s.CONSTANT_COLOR,[nm]:s.ONE_MINUS_CONSTANT_COLOR,[im]:s.CONSTANT_ALPHA,[sm]:s.ONE_MINUS_CONSTANT_ALPHA};function Mt(D,ne,se,de,J,Y,ge,ze,gt,lt){if(D===bi){v===!0&&(pe(s.BLEND),v=!1);return}if(v===!1&&(Z(s.BLEND),v=!0),D!==Hp){if(D!==m||lt!==y){if((p!==ki||_!==ki)&&(s.blendEquation(s.FUNC_ADD),p=ki,_=ki),lt)switch(D){case xs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fh:s.blendFunc(s.ONE,s.ONE);break;case dh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ph:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case xs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fh:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case dh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ph:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}x=null,b=null,E=null,T=null,A.set(0,0,0),C=0,m=D,y=lt}return}J=J||ne,Y=Y||se,ge=ge||de,(ne!==p||J!==_)&&(s.blendEquationSeparate(zt[ne],zt[J]),p=ne,_=J),(se!==x||de!==b||Y!==E||ge!==T)&&(s.blendFuncSeparate(L[se],L[de],L[Y],L[ge]),x=se,b=de,E=Y,T=ge),(ze.equals(A)===!1||gt!==C)&&(s.blendColor(ze.r,ze.g,ze.b,gt),A.copy(ze),C=gt),m=D,y=!1}function Be(D,ne){D.side===Gt?pe(s.CULL_FACE):Z(s.CULL_FACE);let se=D.side===rn;ne&&(se=!se),Ne(se),D.blending===xs&&D.transparent===!1?Mt(bi):Mt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const de=D.stencilWrite;o.setTest(de),de&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),_e(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(s.SAMPLE_ALPHA_TO_COVERAGE):pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(D){S!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),S=D)}function ve(D){D!==zp?(Z(s.CULL_FACE),D!==I&&(D===uh?s.cullFace(s.BACK):D===Bp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pe(s.CULL_FACE),I=D}function St(D){D!==F&&(j&&s.lineWidth(D),F=D)}function _e(D,ne,se){D?(Z(s.POLYGON_OFFSET_FILL),(z!==ne||V!==se)&&(s.polygonOffset(ne,se),z=ne,V=se)):pe(s.POLYGON_OFFSET_FILL)}function Xe(D){D?Z(s.SCISSOR_TEST):pe(s.SCISSOR_TEST)}function Nt(D){D===void 0&&(D=s.TEXTURE0+W-1),ae!==D&&(s.activeTexture(D),ae=D)}function Rt(D,ne,se){se===void 0&&(ae===null?se=s.TEXTURE0+W-1:se=ae);let de=he[se];de===void 0&&(de={type:void 0,texture:void 0},he[se]=de),(de.type!==D||de.texture!==ne)&&(ae!==se&&(s.activeTexture(se),ae=se),s.bindTexture(D,ne||$[D]),de.type=D,de.texture=ne)}function P(){const D=he[ae];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function M(){try{s.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{s.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{s.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{s.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{s.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{s.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{s.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{s.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{s.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(D){mt.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),mt.copy(D))}function De(D){bt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),bt.copy(D))}function be(D,ne){let se=c.get(ne);se===void 0&&(se=new WeakMap,c.set(ne,se));let de=se.get(D);de===void 0&&(de=s.getUniformBlockIndex(ne,D.name),se.set(D,de))}function oe(D,ne){const de=c.get(ne).get(D);l.get(ne)!==de&&(s.uniformBlockBinding(ne,de,D.__bindingPointIndex),l.set(ne,de))}function Ve(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},ae=null,he={},u={},f=new WeakMap,d=[],g=null,v=!1,m=null,p=null,x=null,b=null,_=null,E=null,T=null,A=new fe(0,0,0),C=0,y=!1,S=null,I=null,F=null,z=null,V=null,mt.set(0,0,s.canvas.width,s.canvas.height),bt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Z,disable:pe,bindFramebuffer:Fe,drawBuffers:we,useProgram:et,setBlending:Mt,setMaterial:Be,setFlipSided:Ne,setCullFace:ve,setLineWidth:St,setPolygonOffset:_e,setScissorTest:Xe,activeTexture:Nt,bindTexture:Rt,unbindTexture:P,compressedTexImage2D:M,compressedTexImage3D:k,texImage2D:ye,texImage3D:te,updateUBOMapping:be,uniformBlockBinding:oe,texStorage2D:ie,texStorage3D:xe,texSubImage2D:X,texSubImage3D:q,compressedTexSubImage2D:G,compressedTexSubImage3D:Se,scissor:ce,viewport:De,reset:Ve}}function Fy(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,M){return d?new OffscreenCanvas(P,M):xr("canvas")}function v(P,M,k){let X=1;const q=Rt(P);if((q.width>k||q.height>k)&&(X=k/Math.max(q.width,q.height)),X<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const G=Math.floor(X*q.width),Se=Math.floor(X*q.height);u===void 0&&(u=g(G,Se));const ie=M?g(G,Se):u;return ie.width=G,ie.height=Se,ie.getContext("2d").drawImage(P,0,0,G,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+G+"x"+Se+")."),ie}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){s.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(P,M,k,X,q=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let G=M;if(M===s.RED&&(k===s.FLOAT&&(G=s.R32F),k===s.HALF_FLOAT&&(G=s.R16F),k===s.UNSIGNED_BYTE&&(G=s.R8)),M===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.R8UI),k===s.UNSIGNED_SHORT&&(G=s.R16UI),k===s.UNSIGNED_INT&&(G=s.R32UI),k===s.BYTE&&(G=s.R8I),k===s.SHORT&&(G=s.R16I),k===s.INT&&(G=s.R32I)),M===s.RG&&(k===s.FLOAT&&(G=s.RG32F),k===s.HALF_FLOAT&&(G=s.RG16F),k===s.UNSIGNED_BYTE&&(G=s.RG8)),M===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RG8UI),k===s.UNSIGNED_SHORT&&(G=s.RG16UI),k===s.UNSIGNED_INT&&(G=s.RG32UI),k===s.BYTE&&(G=s.RG8I),k===s.SHORT&&(G=s.RG16I),k===s.INT&&(G=s.RG32I)),M===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGB8UI),k===s.UNSIGNED_SHORT&&(G=s.RGB16UI),k===s.UNSIGNED_INT&&(G=s.RGB32UI),k===s.BYTE&&(G=s.RGB8I),k===s.SHORT&&(G=s.RGB16I),k===s.INT&&(G=s.RGB32I)),M===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),k===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),k===s.UNSIGNED_INT&&(G=s.RGBA32UI),k===s.BYTE&&(G=s.RGBA8I),k===s.SHORT&&(G=s.RGBA16I),k===s.INT&&(G=s.RGBA32I)),M===s.RGB&&(k===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),k===s.UNSIGNED_INT_10F_11F_11F_REV&&(G=s.R11F_G11F_B10F)),M===s.RGBA){const Se=q?Ia:tt.getTransfer(X);k===s.FLOAT&&(G=s.RGBA32F),k===s.HALF_FLOAT&&(G=s.RGBA16F),k===s.UNSIGNED_BYTE&&(G=Se===ft?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function _(P,M){let k;return P?M===null||M===Gi||M===pr?k=s.DEPTH24_STENCIL8:M===An?k=s.DEPTH32F_STENCIL8:M===dr&&(k=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Gi||M===pr?k=s.DEPTH_COMPONENT24:M===An?k=s.DEPTH_COMPONENT32F:M===dr&&(k=s.DEPTH_COMPONENT16),k}function E(P,M){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Zt&&P.minFilter!==Kt?Math.log2(Math.max(M.width,M.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?M.mipmaps.length:1}function T(P){const M=P.target;M.removeEventListener("dispose",T),C(M),M.isVideoTexture&&h.delete(M)}function A(P){const M=P.target;M.removeEventListener("dispose",A),S(M)}function C(P){const M=n.get(P);if(M.__webglInit===void 0)return;const k=P.source,X=f.get(k);if(X){const q=X[M.__cacheKey];q.usedTimes--,q.usedTimes===0&&y(P),Object.keys(X).length===0&&f.delete(k)}n.remove(P)}function y(P){const M=n.get(P);s.deleteTexture(M.__webglTexture);const k=P.source,X=f.get(k);delete X[M.__cacheKey],a.memory.textures--}function S(P){const M=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(M.__webglFramebuffer[X]))for(let q=0;q<M.__webglFramebuffer[X].length;q++)s.deleteFramebuffer(M.__webglFramebuffer[X][q]);else s.deleteFramebuffer(M.__webglFramebuffer[X]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[X])}else{if(Array.isArray(M.__webglFramebuffer))for(let X=0;X<M.__webglFramebuffer.length;X++)s.deleteFramebuffer(M.__webglFramebuffer[X]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let X=0;X<M.__webglColorRenderbuffer.length;X++)M.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[X]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const k=P.textures;for(let X=0,q=k.length;X<q;X++){const G=n.get(k[X]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(k[X])}n.remove(P)}let I=0;function F(){I=0}function z(){const P=I;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),I+=1,P}function V(P){const M=[];return M.push(P.wrapS),M.push(P.wrapT),M.push(P.wrapR||0),M.push(P.magFilter),M.push(P.minFilter),M.push(P.anisotropy),M.push(P.internalFormat),M.push(P.format),M.push(P.type),M.push(P.generateMipmaps),M.push(P.premultiplyAlpha),M.push(P.flipY),M.push(P.unpackAlignment),M.push(P.colorSpace),M.join()}function W(P,M){const k=n.get(P);if(P.isVideoTexture&&Xe(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&k.__version!==P.version){const X=P.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(k,P,M);return}}else P.isExternalTexture&&(k.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+M)}function j(P,M){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){$(k,P,M);return}t.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+M)}function K(P,M){const k=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&k.__version!==P.version){$(k,P,M);return}t.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+M)}function H(P,M){const k=n.get(P);if(P.version>0&&k.__version!==P.version){Z(k,P,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+M)}const ae={[Vi]:s.REPEAT,[yi]:s.CLAMP_TO_EDGE,[Ca]:s.MIRRORED_REPEAT},he={[Zt]:s.NEAREST,[Cf]:s.NEAREST_MIPMAP_NEAREST,[er]:s.NEAREST_MIPMAP_LINEAR,[Kt]:s.LINEAR,[pa]:s.LINEAR_MIPMAP_NEAREST,[zn]:s.LINEAR_MIPMAP_LINEAR},Te={[Mm]:s.NEVER,[Rm]:s.ALWAYS,[Sm]:s.LESS,[Of]:s.LEQUAL,[wm]:s.EQUAL,[Am]:s.GEQUAL,[Em]:s.GREATER,[Tm]:s.NOTEQUAL};function Ke(P,M){if(M.type===An&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Kt||M.magFilter===pa||M.magFilter===er||M.magFilter===zn||M.minFilter===Kt||M.minFilter===pa||M.minFilter===er||M.minFilter===zn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,ae[M.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,ae[M.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,ae[M.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,he[M.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,he[M.minFilter]),M.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,Te[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Zt||M.minFilter!==er&&M.minFilter!==zn||M.type===An&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function mt(P,M){let k=!1;P.__webglInit===void 0&&(P.__webglInit=!0,M.addEventListener("dispose",T));const X=M.source;let q=f.get(X);q===void 0&&(q={},f.set(X,q));const G=V(M);if(G!==P.__cacheKey){q[G]===void 0&&(q[G]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,k=!0),q[G].usedTimes++;const Se=q[P.__cacheKey];Se!==void 0&&(q[P.__cacheKey].usedTimes--,Se.usedTimes===0&&y(M)),P.__cacheKey=G,P.__webglTexture=q[G].texture}return k}function bt(P,M,k){return Math.floor(Math.floor(P/k)/M)}function ot(P,M,k,X){const G=P.updateRanges;if(G.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,k,X,M.data);else{G.sort((te,ce)=>te.start-ce.start);let Se=0;for(let te=1;te<G.length;te++){const ce=G[Se],De=G[te],be=ce.start+ce.count,oe=bt(De.start,M.width,4),Ve=bt(ce.start,M.width,4);De.start<=be+1&&oe===Ve&&bt(De.start+De.count-1,M.width,4)===oe?ce.count=Math.max(ce.count,De.start+De.count-ce.start):(++Se,G[Se]=De)}G.length=Se+1;const ie=s.getParameter(s.UNPACK_ROW_LENGTH),xe=s.getParameter(s.UNPACK_SKIP_PIXELS),ye=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let te=0,ce=G.length;te<ce;te++){const De=G[te],be=Math.floor(De.start/4),oe=Math.ceil(De.count/4),Ve=be%M.width,D=Math.floor(be/M.width),ne=oe,se=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ve),s.pixelStorei(s.UNPACK_SKIP_ROWS,D),t.texSubImage2D(s.TEXTURE_2D,0,Ve,D,ne,se,k,X,M.data)}P.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ie),s.pixelStorei(s.UNPACK_SKIP_PIXELS,xe),s.pixelStorei(s.UNPACK_SKIP_ROWS,ye)}}function $(P,M,k){let X=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(X=s.TEXTURE_3D);const q=mt(P,M),G=M.source;t.bindTexture(X,P.__webglTexture,s.TEXTURE0+k);const Se=n.get(G);if(G.version!==Se.__version||q===!0){t.activeTexture(s.TEXTURE0+k);const ie=tt.getPrimaries(tt.workingColorSpace),xe=M.colorSpace===xi?null:tt.getPrimaries(M.colorSpace),ye=M.colorSpace===xi||ie===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let te=v(M.image,!1,i.maxTextureSize);te=Nt(M,te);const ce=r.convert(M.format,M.colorSpace),De=r.convert(M.type);let be=b(M.internalFormat,ce,De,M.colorSpace,M.isVideoTexture);Ke(X,M);let oe;const Ve=M.mipmaps,D=M.isVideoTexture!==!0,ne=Se.__version===void 0||q===!0,se=G.dataReady,de=E(M,te);if(M.isDepthTexture)be=_(M.format===gr,M.type),ne&&(D?t.texStorage2D(s.TEXTURE_2D,1,be,te.width,te.height):t.texImage2D(s.TEXTURE_2D,0,be,te.width,te.height,0,ce,De,null));else if(M.isDataTexture)if(Ve.length>0){D&&ne&&t.texStorage2D(s.TEXTURE_2D,de,be,Ve[0].width,Ve[0].height);for(let J=0,Y=Ve.length;J<Y;J++)oe=Ve[J],D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,De,oe.data):t.texImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,ce,De,oe.data);M.generateMipmaps=!1}else D?(ne&&t.texStorage2D(s.TEXTURE_2D,de,be,te.width,te.height),se&&ot(M,te,ce,De)):t.texImage2D(s.TEXTURE_2D,0,be,te.width,te.height,0,ce,De,te.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){D&&ne&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,be,Ve[0].width,Ve[0].height,te.depth);for(let J=0,Y=Ve.length;J<Y;J++)if(oe=Ve[J],M.format!==sn)if(ce!==null)if(D){if(se)if(M.layerUpdates.size>0){const ge=su(oe.width,oe.height,M.format,M.type);for(const ze of M.layerUpdates){const gt=oe.data.subarray(ze*ge/oe.data.BYTES_PER_ELEMENT,(ze+1)*ge/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,ze,oe.width,oe.height,1,ce,gt)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,oe.width,oe.height,te.depth,ce,oe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,be,oe.width,oe.height,te.depth,0,oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?se&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,oe.width,oe.height,te.depth,ce,De,oe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,J,be,oe.width,oe.height,te.depth,0,ce,De,oe.data)}else{D&&ne&&t.texStorage2D(s.TEXTURE_2D,de,be,Ve[0].width,Ve[0].height);for(let J=0,Y=Ve.length;J<Y;J++)oe=Ve[J],M.format!==sn?ce!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,oe.data):t.compressedTexImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,De,oe.data):t.texImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,ce,De,oe.data)}else if(M.isDataArrayTexture)if(D){if(ne&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,be,te.width,te.height,te.depth),se)if(M.layerUpdates.size>0){const J=su(te.width,te.height,M.format,M.type);for(const Y of M.layerUpdates){const ge=te.data.subarray(Y*J/te.data.BYTES_PER_ELEMENT,(Y+1)*J/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Y,te.width,te.height,1,ce,De,ge)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ce,De,te.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,be,te.width,te.height,te.depth,0,ce,De,te.data);else if(M.isData3DTexture)D?(ne&&t.texStorage3D(s.TEXTURE_3D,de,be,te.width,te.height,te.depth),se&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ce,De,te.data)):t.texImage3D(s.TEXTURE_3D,0,be,te.width,te.height,te.depth,0,ce,De,te.data);else if(M.isFramebufferTexture){if(ne)if(D)t.texStorage2D(s.TEXTURE_2D,de,be,te.width,te.height);else{let J=te.width,Y=te.height;for(let ge=0;ge<de;ge++)t.texImage2D(s.TEXTURE_2D,ge,be,J,Y,0,ce,De,null),J>>=1,Y>>=1}}else if(Ve.length>0){if(D&&ne){const J=Rt(Ve[0]);t.texStorage2D(s.TEXTURE_2D,de,be,J.width,J.height)}for(let J=0,Y=Ve.length;J<Y;J++)oe=Ve[J],D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,ce,De,oe):t.texImage2D(s.TEXTURE_2D,J,be,ce,De,oe);M.generateMipmaps=!1}else if(D){if(ne){const J=Rt(te);t.texStorage2D(s.TEXTURE_2D,de,be,J.width,J.height)}se&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ce,De,te)}else t.texImage2D(s.TEXTURE_2D,0,be,ce,De,te);m(M)&&p(X),Se.__version=G.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function Z(P,M,k){if(M.image.length!==6)return;const X=mt(P,M),q=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+k);const G=n.get(q);if(q.version!==G.__version||X===!0){t.activeTexture(s.TEXTURE0+k);const Se=tt.getPrimaries(tt.workingColorSpace),ie=M.colorSpace===xi?null:tt.getPrimaries(M.colorSpace),xe=M.colorSpace===xi||Se===ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const ye=M.isCompressedTexture||M.image[0].isCompressedTexture,te=M.image[0]&&M.image[0].isDataTexture,ce=[];for(let Y=0;Y<6;Y++)!ye&&!te?ce[Y]=v(M.image[Y],!0,i.maxCubemapSize):ce[Y]=te?M.image[Y].image:M.image[Y],ce[Y]=Nt(M,ce[Y]);const De=ce[0],be=r.convert(M.format,M.colorSpace),oe=r.convert(M.type),Ve=b(M.internalFormat,be,oe,M.colorSpace),D=M.isVideoTexture!==!0,ne=G.__version===void 0||X===!0,se=q.dataReady;let de=E(M,De);Ke(s.TEXTURE_CUBE_MAP,M);let J;if(ye){D&&ne&&t.texStorage2D(s.TEXTURE_CUBE_MAP,de,Ve,De.width,De.height);for(let Y=0;Y<6;Y++){J=ce[Y].mipmaps;for(let ge=0;ge<J.length;ge++){const ze=J[ge];M.format!==sn?be!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,ze.width,ze.height,be,ze.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,Ve,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,ze.width,ze.height,be,oe,ze.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,Ve,ze.width,ze.height,0,be,oe,ze.data)}}}else{if(J=M.mipmaps,D&&ne){J.length>0&&de++;const Y=Rt(ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,de,Ve,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(te){D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ce[Y].width,ce[Y].height,be,oe,ce[Y].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ve,ce[Y].width,ce[Y].height,0,be,oe,ce[Y].data);for(let ge=0;ge<J.length;ge++){const gt=J[ge].image[Y].image;D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,gt.width,gt.height,be,oe,gt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,Ve,gt.width,gt.height,0,be,oe,gt.data)}}else{D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,be,oe,ce[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ve,be,oe,ce[Y]);for(let ge=0;ge<J.length;ge++){const ze=J[ge];D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,be,oe,ze.image[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,Ve,be,oe,ze.image[Y])}}}m(M)&&p(s.TEXTURE_CUBE_MAP),G.__version=q.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function pe(P,M,k,X,q,G){const Se=r.convert(k.format,k.colorSpace),ie=r.convert(k.type),xe=b(k.internalFormat,Se,ie,k.colorSpace),ye=n.get(M),te=n.get(k);if(te.__renderTarget=M,!ye.__hasExternalTextures){const ce=Math.max(1,M.width>>G),De=Math.max(1,M.height>>G);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?t.texImage3D(q,G,xe,ce,De,M.depth,0,Se,ie,null):t.texImage2D(q,G,xe,ce,De,0,Se,ie,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,q,te.__webglTexture,0,St(M)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,q,te.__webglTexture,G),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Fe(P,M,k){if(s.bindRenderbuffer(s.RENDERBUFFER,P),M.depthBuffer){const X=M.depthTexture,q=X&&X.isDepthTexture?X.type:null,G=_(M.stencilBuffer,q),Se=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ie=St(M);_e(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ie,G,M.width,M.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,ie,G,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,G,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,P)}else{const X=M.textures;for(let q=0;q<X.length;q++){const G=X[q],Se=r.convert(G.format,G.colorSpace),ie=r.convert(G.type),xe=b(G.internalFormat,Se,ie,G.colorSpace),ye=St(M);k&&_e(M)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,xe,M.width,M.height):_e(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye,xe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,xe,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function we(P,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(M.depthTexture);X.__renderTarget=M,(!X.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W(M.depthTexture,0);const q=X.__webglTexture,G=St(M);if(M.depthTexture.format===mr)_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0);else if(M.depthTexture.format===gr)_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function et(P){const M=n.get(P),k=P.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==P.depthTexture){const X=P.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),X){const q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,X.removeEventListener("dispose",q)};X.addEventListener("dispose",q),M.__depthDisposeCallback=q}M.__boundDepthTexture=X}if(P.depthTexture&&!M.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");const X=P.texture.mipmaps;X&&X.length>0?we(M.__webglFramebuffer[0],P):we(M.__webglFramebuffer,P)}else if(k){M.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[X]),M.__webglDepthbuffer[X]===void 0)M.__webglDepthbuffer[X]=s.createRenderbuffer(),Fe(M.__webglDepthbuffer[X],P,!1);else{const q=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=M.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,G)}}else{const X=P.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),Fe(M.__webglDepthbuffer,P,!1);else{const q=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,G)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function zt(P,M,k){const X=n.get(P);M!==void 0&&pe(X.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&et(P)}function L(P){const M=P.texture,k=n.get(P),X=n.get(M);P.addEventListener("dispose",A);const q=P.textures,G=P.isWebGLCubeRenderTarget===!0,Se=q.length>1;if(Se||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=M.version,a.memory.textures++),G){k.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer[ie]=[];for(let xe=0;xe<M.mipmaps.length;xe++)k.__webglFramebuffer[ie][xe]=s.createFramebuffer()}else k.__webglFramebuffer[ie]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)k.__webglFramebuffer[ie]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(Se)for(let ie=0,xe=q.length;ie<xe;ie++){const ye=n.get(q[ie]);ye.__webglTexture===void 0&&(ye.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&_e(P)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ie=0;ie<q.length;ie++){const xe=q[ie];k.__webglColorRenderbuffer[ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[ie]);const ye=r.convert(xe.format,xe.colorSpace),te=r.convert(xe.type),ce=b(xe.internalFormat,ye,te,xe.colorSpace,P.isXRRenderTarget===!0),De=St(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,De,ce,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ie,s.RENDERBUFFER,k.__webglColorRenderbuffer[ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),Fe(k.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),Ke(s.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let xe=0;xe<M.mipmaps.length;xe++)pe(k.__webglFramebuffer[ie][xe],P,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else pe(k.__webglFramebuffer[ie],P,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(M)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let ie=0,xe=q.length;ie<xe;ie++){const ye=q[ie],te=n.get(ye);let ce=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ce=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,te.__webglTexture),Ke(ce,ye),pe(k.__webglFramebuffer,P,ye,s.COLOR_ATTACHMENT0+ie,ce,0),m(ye)&&p(ce)}t.unbindTexture()}else{let ie=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ie=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ie,X.__webglTexture),Ke(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let xe=0;xe<M.mipmaps.length;xe++)pe(k.__webglFramebuffer[xe],P,M,s.COLOR_ATTACHMENT0,ie,xe);else pe(k.__webglFramebuffer,P,M,s.COLOR_ATTACHMENT0,ie,0);m(M)&&p(ie),t.unbindTexture()}P.depthBuffer&&et(P)}function Mt(P){const M=P.textures;for(let k=0,X=M.length;k<X;k++){const q=M[k];if(m(q)){const G=x(P),Se=n.get(q).__webglTexture;t.bindTexture(G,Se),p(G),t.unbindTexture()}}}const Be=[],Ne=[];function ve(P){if(P.samples>0){if(_e(P)===!1){const M=P.textures,k=P.width,X=P.height;let q=s.COLOR_BUFFER_BIT;const G=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=n.get(P),ie=M.length>1;if(ie)for(let ye=0;ye<M.length;ye++)t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer);const xe=P.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ye=0;ye<M.length;ye++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);const te=n.get(M[ye]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,te,0)}s.blitFramebuffer(0,0,k,X,0,0,k,X,q,s.NEAREST),l===!0&&(Be.length=0,Ne.length=0,Be.push(s.COLOR_ATTACHMENT0+ye),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Be.push(G),Ne.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ne)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ie)for(let ye=0;ye<M.length;ye++){t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);const te=n.get(M[ye]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,te,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const M=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function St(P){return Math.min(i.maxSamples,P.samples)}function _e(P){const M=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Xe(P){const M=a.render.frame;h.get(P)!==M&&(h.set(P,M),P.update())}function Nt(P,M){const k=P.colorSpace,X=P.format,q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||k!==Jt&&k!==xi&&(tt.getTransfer(k)===ft?(X!==sn||q!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),M}function Rt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=j,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=zt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=_e}function ky(s,e){function t(n,i=xi){let r;const a=tt.getTransfer(i);if(n===Vn)return s.UNSIGNED_BYTE;if(n===mc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===gc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Lf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Df)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Pf)return s.BYTE;if(n===If)return s.SHORT;if(n===dr)return s.UNSIGNED_SHORT;if(n===pc)return s.INT;if(n===Gi)return s.UNSIGNED_INT;if(n===An)return s.FLOAT;if(n===Mr)return s.HALF_FLOAT;if(n===Nf)return s.ALPHA;if(n===Uf)return s.RGB;if(n===sn)return s.RGBA;if(n===mr)return s.DEPTH_COMPONENT;if(n===gr)return s.DEPTH_STENCIL;if(n===vc)return s.RED;if(n===_c)return s.RED_INTEGER;if(n===Ff)return s.RG;if(n===xc)return s.RG_INTEGER;if(n===yc)return s.RGBA_INTEGER;if(n===ma||n===ga||n===va||n===_a)if(a===ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ma)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ma)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===va)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===hl||n===ul||n===fl||n===dl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===hl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ul)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===dl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pl||n===ml||n===gl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===pl||n===ml)return a===ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===gl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===vl||n===_l||n===xl||n===yl||n===bl||n===Ml||n===Sl||n===wl||n===El||n===Tl||n===Al||n===Rl||n===Cl||n===Pl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_l)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ml)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Sl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===wl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===El)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Tl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Al)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Rl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Cl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Il||n===Ll||n===Dl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Il)return a===ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ll)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Dl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nl||n===Ul||n===Fl||n===kl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Nl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===kl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Oy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zy=`
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

}`;class By{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Zf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ri({vertexShader:Oy,fragmentShader:zy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new Xi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hy extends qi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const v=typeof XRWebGLBinding<"u",m=new By,p={},x=t.getContextAttributes();let b=null,_=null;const E=[],T=[],A=new Oe;let C=null;const y=new nn;y.viewport=new nt;const S=new nn;S.viewport=new nt;const I=[y,S],F=new Y0;let z=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=E[$];return Z===void 0&&(Z=new Ro,E[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=E[$];return Z===void 0&&(Z=new Ro,E[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=E[$];return Z===void 0&&(Z=new Ro,E[$]=Z),Z.getHandSpace()};function W($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const pe=E[Z];pe!==void 0&&(pe.update($.inputSource,$.frame,c||a),pe.dispatchEvent({type:$.type,data:$.inputSource}))}function j(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",j),i.removeEventListener("inputsourceschange",K);for(let $=0;$<E.length;$++){const Z=T[$];Z!==null&&(T[$]=null,E[$].disconnect(Z))}z=null,V=null,m.reset();for(const $ in p)delete p[$];e.setRenderTarget(b),d=null,f=null,u=null,i=null,_=null,ot.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",j),i.addEventListener("inputsourceschange",K),x.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Fe=null,we=null;x.depth&&(we=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=x.stencil?gr:mr,Fe=x.stencil?pr:Gi);const et={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(et),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Wi(f.textureWidth,f.textureHeight,{format:sn,type:Vn,depthTexture:new Kf(f.textureWidth,f.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,pe),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new Wi(d.framebufferWidth,d.framebufferHeight,{format:sn,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),ot.setContext(i),ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const pe=$.removed[Z],Fe=T.indexOf(pe);Fe>=0&&(T[Fe]=null,E[Fe].disconnect(pe))}for(let Z=0;Z<$.added.length;Z++){const pe=$.added[Z];let Fe=T.indexOf(pe);if(Fe===-1){for(let et=0;et<E.length;et++)if(et>=T.length){T.push(pe),Fe=et;break}else if(T[et]===null){T[et]=pe,Fe=et;break}if(Fe===-1)break}const we=E[Fe];we&&we.connect(pe)}}const H=new R,ae=new R;function he($,Z,pe){H.setFromMatrixPosition(Z.matrixWorld),ae.setFromMatrixPosition(pe.matrixWorld);const Fe=H.distanceTo(ae),we=Z.projectionMatrix.elements,et=pe.projectionMatrix.elements,zt=we[14]/(we[10]-1),L=we[14]/(we[10]+1),Mt=(we[9]+1)/we[5],Be=(we[9]-1)/we[5],Ne=(we[8]-1)/we[0],ve=(et[8]+1)/et[0],St=zt*Ne,_e=zt*ve,Xe=Fe/(-Ne+ve),Nt=Xe*-Ne;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Nt),$.translateZ(Xe),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),we[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Rt=zt+Xe,P=L+Xe,M=St-Nt,k=_e+(Fe-Nt),X=Mt*L/P*Rt,q=Be*L/P*Rt;$.projectionMatrix.makePerspective(M,k,X,q,Rt,P),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Te($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let Z=$.near,pe=$.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),F.near=S.near=y.near=Z,F.far=S.far=y.far=pe,(z!==F.near||V!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,V=F.far),F.layers.mask=$.layers.mask|6,y.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const Fe=$.parent,we=F.cameras;Te(F,Fe);for(let et=0;et<we.length;et++)Te(we[et],Fe);we.length===2?he(F,y,S):F.projectionMatrix.copy(y.projectionMatrix),Ke($,F,Fe)};function Ke($,Z,pe){pe===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Rs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function($){return p[$]};let mt=null;function bt($,Z){if(h=Z.getViewerPose(c||a),g=Z,h!==null){const pe=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let Fe=!1;pe.length!==F.cameras.length&&(F.cameras.length=0,Fe=!0);for(let L=0;L<pe.length;L++){const Mt=pe[L];let Be=null;if(d!==null)Be=d.getViewport(Mt);else{const ve=u.getViewSubImage(f,Mt);Be=ve.viewport,L===0&&(e.setRenderTargetTextures(_,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(_))}let Ne=I[L];Ne===void 0&&(Ne=new nn,Ne.layers.enable(L),Ne.viewport=new nt,I[L]=Ne),Ne.matrix.fromArray(Mt.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Mt.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Be.x,Be.y,Be.width,Be.height),L===0&&(F.matrix.copy(Ne.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Fe===!0&&F.cameras.push(Ne)}const we=i.enabledFeatures;if(we&&we.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const L=u.getDepthInformation(pe[0]);L&&L.isValid&&L.texture&&m.init(L,i.renderState)}if(we&&we.includes("camera-access")&&v){e.state.unbindTexture(),u=n.getBinding();for(let L=0;L<pe.length;L++){const Mt=pe[L].camera;if(Mt){let Be=p[Mt];Be||(Be=new Zf,p[Mt]=Be);const Ne=u.getCameraImage(Mt);Be.sourceTexture=Ne}}}}for(let pe=0;pe<E.length;pe++){const Fe=T[pe],we=E[pe];Fe!==null&&we!==void 0&&we.update(Fe,Z,c||a)}mt&&mt($,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const ot=new id;ot.setAnimationLoop(bt),this.setAnimationLoop=function($){mt=$},this.dispose=function(){}}}const Ni=new Ln,Vy=new We;function Gy(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Wf(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,b,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,x,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===rn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===rn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=e.get(p),b=x.envMap,_=x.envMapRotation;b&&(m.envMap.value=b,Ni.copy(_),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),m.envMapRotation.value.setFromMatrix4(Vy.makeRotationFromEuler(Ni)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Wy(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,b){const _=b.program;n.uniformBlockBinding(x,_)}function c(x,b){let _=i[x.id];_===void 0&&(g(x),_=h(x),i[x.id]=_,x.addEventListener("dispose",m));const E=b.program;n.updateUBOMapping(x,E);const T=e.render.frame;r[x.id]!==T&&(f(x),r[x.id]=T)}function h(x){const b=u();x.__bindingPointIndex=b;const _=s.createBuffer(),E=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,E,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,_),_}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const b=i[x.id],_=x.uniforms,E=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let T=0,A=_.length;T<A;T++){const C=Array.isArray(_[T])?_[T]:[_[T]];for(let y=0,S=C.length;y<S;y++){const I=C[y];if(d(I,T,y,E)===!0){const F=I.__offset,z=Array.isArray(I.value)?I.value:[I.value];let V=0;for(let W=0;W<z.length;W++){const j=z[W],K=v(j);typeof j=="number"||typeof j=="boolean"?(I.__data[0]=j,s.bufferSubData(s.UNIFORM_BUFFER,F+V,I.__data)):j.isMatrix3?(I.__data[0]=j.elements[0],I.__data[1]=j.elements[1],I.__data[2]=j.elements[2],I.__data[3]=0,I.__data[4]=j.elements[3],I.__data[5]=j.elements[4],I.__data[6]=j.elements[5],I.__data[7]=0,I.__data[8]=j.elements[6],I.__data[9]=j.elements[7],I.__data[10]=j.elements[8],I.__data[11]=0):(j.toArray(I.__data,V),V+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(x,b,_,E){const T=x.value,A=b+"_"+_;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const C=E[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(x){const b=x.uniforms;let _=0;const E=16;for(let A=0,C=b.length;A<C;A++){const y=Array.isArray(b[A])?b[A]:[b[A]];for(let S=0,I=y.length;S<I;S++){const F=y[S],z=Array.isArray(F.value)?F.value:[F.value];for(let V=0,W=z.length;V<W;V++){const j=z[V],K=v(j),H=_%E,ae=H%K.boundary,he=H+ae;_+=ae,he!==0&&E-he<K.storage&&(_+=E-he),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=K.storage}}}const T=_%E;return T>0&&(_+=E-T),x.__size=_,x.__cache={},this}function v(x){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){const b=x.target;b.removeEventListener("dispose",m);const _=a.indexOf(b.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);a=[],i={},r={}}return{bind:l,update:c,dispose:p}}class Cu{constructor(e={}){const{canvas:t=Xm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let E=!1;this._outputColorSpace=Ft;let T=0,A=0,C=null,y=-1,S=null;const I=new nt,F=new nt;let z=null;const V=new fe(0);let W=0,j=t.width,K=t.height,H=1,ae=null,he=null;const Te=new nt(0,0,j,K),Ke=new nt(0,0,j,K);let mt=!1;const bt=new Cc;let ot=!1,$=!1;const Z=new We,pe=new R,Fe=new nt,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let et=!1;function zt(){return C===null?H:1}let L=n;function Mt(w,N){return t.getContext(w,N)}try{const w={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${fc}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",J,!1),L===null){const N="webgl2";if(L=Mt(N,w),L===null)throw Mt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Be,Ne,ve,St,_e,Xe,Nt,Rt,P,M,k,X,q,G,Se,ie,xe,ye,te,ce,De,be,oe,Ve;function D(){Be=new tx(L),Be.init(),be=new ky(L,Be),Ne=new Y_(L,Be,e,be),ve=new Uy(L,Be),Ne.reversedDepthBuffer&&f&&ve.buffers.depth.setReversed(!0),St=new sx(L),_e=new My,Xe=new Fy(L,Be,ve,_e,Ne,be,St),Nt=new K_(_),Rt=new ex(_),P=new hg(L),oe=new j_(L,P),M=new nx(L,P,St,oe),k=new ax(L,M,P,St),te=new rx(L,Ne,Xe),ie=new q_(_e),X=new by(_,Nt,Rt,Be,Ne,oe,ie),q=new Gy(_,_e),G=new wy,Se=new Py(Be),ye=new X_(_,Nt,Rt,ve,k,d,l),xe=new Dy(_,k,Ne),Ve=new Wy(L,St,Ne,ve),ce=new $_(L,Be,St),De=new ix(L,Be,St),St.programs=X.programs,_.capabilities=Ne,_.extensions=Be,_.properties=_e,_.renderLists=G,_.shadowMap=xe,_.state=ve,_.info=St}D();const ne=new Hy(_,L);this.xr=ne,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=Be.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Be.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(j,K,!1))},this.getSize=function(w){return w.set(j,K)},this.setSize=function(w,N,O=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,K=N,t.width=Math.floor(w*H),t.height=Math.floor(N*H),O===!0&&(t.style.width=w+"px",t.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(j*H,K*H).floor()},this.setDrawingBufferSize=function(w,N,O){j=w,K=N,H=O,t.width=Math.floor(w*O),t.height=Math.floor(N*O),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(I)},this.getViewport=function(w){return w.copy(Te)},this.setViewport=function(w,N,O,B){w.isVector4?Te.set(w.x,w.y,w.z,w.w):Te.set(w,N,O,B),ve.viewport(I.copy(Te).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy(Ke)},this.setScissor=function(w,N,O,B){w.isVector4?Ke.set(w.x,w.y,w.z,w.w):Ke.set(w,N,O,B),ve.scissor(F.copy(Ke).multiplyScalar(H).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(w){ve.setScissorTest(mt=w)},this.setOpaqueSort=function(w){ae=w},this.setTransparentSort=function(w){he=w},this.getClearColor=function(w){return w.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor(...arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha(...arguments)},this.clear=function(w=!0,N=!0,O=!0){let B=0;if(w){let U=!1;if(C!==null){const Q=C.texture.format;U=Q===yc||Q===xc||Q===_c}if(U){const Q=C.texture.type,le=Q===Vn||Q===Gi||Q===dr||Q===pr||Q===mc||Q===gc,me=ye.getClearColor(),ue=ye.getClearAlpha(),Le=me.r,Ue=me.g,Ae=me.b;le?(g[0]=Le,g[1]=Ue,g[2]=Ae,g[3]=ue,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Le,v[1]=Ue,v[2]=Ae,v[3]=ue,L.clearBufferiv(L.COLOR,0,v))}else B|=L.COLOR_BUFFER_BIT}N&&(B|=L.DEPTH_BUFFER_BIT),O&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",J,!1),ye.dispose(),G.dispose(),Se.dispose(),_e.dispose(),Nt.dispose(),Rt.dispose(),k.dispose(),oe.dispose(),Ve.dispose(),X.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",Un),ne.removeEventListener("sessionend",rh),Ai.stop()};function se(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const w=St.autoReset,N=xe.enabled,O=xe.autoUpdate,B=xe.needsUpdate,U=xe.type;D(),St.autoReset=w,xe.enabled=N,xe.autoUpdate=O,xe.needsUpdate=B,xe.type=U}function J(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Y(w){const N=w.target;N.removeEventListener("dispose",Y),ge(N)}function ge(w){ze(w),_e.remove(w)}function ze(w){const N=_e.get(w).programs;N!==void 0&&(N.forEach(function(O){X.releaseProgram(O)}),w.isShaderMaterial&&X.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,O,B,U,Q){N===null&&(N=we);const le=U.isMesh&&U.matrixWorld.determinant()<0,me=Pp(w,N,O,B,U);ve.setMaterial(B,le);let ue=O.index,Le=1;if(B.wireframe===!0){if(ue=M.getWireframeAttribute(O),ue===void 0)return;Le=2}const Ue=O.drawRange,Ae=O.attributes.position;let Je=Ue.start*Le,ut=(Ue.start+Ue.count)*Le;Q!==null&&(Je=Math.max(Je,Q.start*Le),ut=Math.min(ut,(Q.start+Q.count)*Le)),ue!==null?(Je=Math.max(Je,0),ut=Math.min(ut,ue.count)):Ae!=null&&(Je=Math.max(Je,0),ut=Math.min(ut,Ae.count));const At=ut-Je;if(At<0||At===1/0)return;oe.setup(U,B,me,O,ue);let xt,pt=ce;if(ue!==null&&(xt=P.get(ue),pt=De,pt.setIndex(xt)),U.isMesh)B.wireframe===!0?(ve.setLineWidth(B.wireframeLinewidth*zt()),pt.setMode(L.LINES)):pt.setMode(L.TRIANGLES);else if(U.isLine){let Ce=B.linewidth;Ce===void 0&&(Ce=1),ve.setLineWidth(Ce*zt()),U.isLineSegments?pt.setMode(L.LINES):U.isLineLoop?pt.setMode(L.LINE_LOOP):pt.setMode(L.LINE_STRIP)}else U.isPoints?pt.setMode(L.POINTS):U.isSprite&&pt.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)yr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Be.get("WEBGL_multi_draw"))pt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ce=U._multiDrawStarts,Et=U._multiDrawCounts,it=U._multiDrawCount,on=ue?P.get(ue).bytesPerElement:1,Ki=_e.get(B).currentProgram.getUniforms();for(let ln=0;ln<it;ln++)Ki.setValue(L,"_gl_DrawID",ln),pt.render(Ce[ln]/on,Et[ln])}else if(U.isInstancedMesh)pt.renderInstances(Je,At,U.count);else if(O.isInstancedBufferGeometry){const Ce=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,Et=Math.min(O.instanceCount,Ce);pt.renderInstances(Je,At,Et)}else pt.render(Je,At)};function gt(w,N,O){w.transparent===!0&&w.side===Gt&&w.forceSinglePass===!1?(w.side=rn,w.needsUpdate=!0,Lr(w,N,O),w.side=si,w.needsUpdate=!0,Lr(w,N,O),w.side=Gt):Lr(w,N,O)}this.compile=function(w,N,O=null){O===null&&(O=w),p=Se.get(O),p.init(N),b.push(p),O.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),w!==O&&w.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const B=new Set;return w.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const Q=U.material;if(Q)if(Array.isArray(Q))for(let le=0;le<Q.length;le++){const me=Q[le];gt(me,O,U),B.add(me)}else gt(Q,O,U),B.add(Q)}),p=b.pop(),B},this.compileAsync=function(w,N,O=null){const B=this.compile(w,N,O);return new Promise(U=>{function Q(){if(B.forEach(function(le){_e.get(le).currentProgram.isReady()&&B.delete(le)}),B.size===0){U(w);return}setTimeout(Q,10)}Be.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let lt=null;function jn(w){lt&&lt(w)}function Un(){Ai.stop()}function rh(){Ai.start()}const Ai=new id;Ai.setAnimationLoop(jn),typeof self<"u"&&Ai.setContext(self),this.setAnimationLoop=function(w){lt=w,ne.setAnimationLoop(w),w===null?Ai.stop():Ai.start()},ne.addEventListener("sessionstart",Un),ne.addEventListener("sessionend",rh),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(N),N=ne.getCamera()),w.isScene===!0&&w.onBeforeRender(_,w,N,C),p=Se.get(w,b.length),p.init(N),b.push(p),Z.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),bt.setFromProjectionMatrix(Z,Bn,N.reversedDepth),$=this.localClippingEnabled,ot=ie.init(this.clippingPlanes,$),m=G.get(w,x.length),m.init(),x.push(m),ne.enabled===!0&&ne.isPresenting===!0){const Q=_.xr.getDepthSensingMesh();Q!==null&&so(Q,N,-1/0,_.sortObjects)}so(w,N,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(ae,he),et=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,et&&ye.addToRenderList(m,w),this.info.render.frame++,ot===!0&&ie.beginShadows();const O=p.state.shadowsArray;xe.render(O,w,N),ot===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,U=m.transmissive;if(p.setupLights(),N.isArrayCamera){const Q=N.cameras;if(U.length>0)for(let le=0,me=Q.length;le<me;le++){const ue=Q[le];oh(B,U,w,ue)}et&&ye.render(w);for(let le=0,me=Q.length;le<me;le++){const ue=Q[le];ah(m,w,ue,ue.viewport)}}else U.length>0&&oh(B,U,w,N),et&&ye.render(w),ah(m,w,N);C!==null&&A===0&&(Xe.updateMultisampleRenderTarget(C),Xe.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(_,w,N),oe.resetDefaultState(),y=-1,S=null,b.pop(),b.length>0?(p=b[b.length-1],ot===!0&&ie.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function so(w,N,O,B){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)O=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||bt.intersectsSprite(w)){B&&Fe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Z);const le=k.update(w),me=w.material;me.visible&&m.push(w,le,me,O,Fe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||bt.intersectsObject(w))){const le=k.update(w),me=w.material;if(B&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Fe.copy(w.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),Fe.copy(le.boundingSphere.center)),Fe.applyMatrix4(w.matrixWorld).applyMatrix4(Z)),Array.isArray(me)){const ue=le.groups;for(let Le=0,Ue=ue.length;Le<Ue;Le++){const Ae=ue[Le],Je=me[Ae.materialIndex];Je&&Je.visible&&m.push(w,le,Je,O,Fe.z,Ae)}}else me.visible&&m.push(w,le,me,O,Fe.z,null)}}const Q=w.children;for(let le=0,me=Q.length;le<me;le++)so(Q[le],N,O,B)}function ah(w,N,O,B){const U=w.opaque,Q=w.transmissive,le=w.transparent;p.setupLightsView(O),ot===!0&&ie.setGlobalState(_.clippingPlanes,O),B&&ve.viewport(I.copy(B)),U.length>0&&Ir(U,N,O),Q.length>0&&Ir(Q,N,O),le.length>0&&Ir(le,N,O),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function oh(w,N,O,B){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new Wi(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?Mr:Vn,minFilter:zn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const Q=p.state.transmissionRenderTarget[B.id],le=B.viewport||I;Q.setSize(le.z*_.transmissionResolutionScale,le.w*_.transmissionResolutionScale);const me=_.getRenderTarget(),ue=_.getActiveCubeFace(),Le=_.getActiveMipmapLevel();_.setRenderTarget(Q),_.getClearColor(V),W=_.getClearAlpha(),W<1&&_.setClearColor(16777215,.5),_.clear(),et&&ye.render(O);const Ue=_.toneMapping;_.toneMapping=Mi;const Ae=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),ot===!0&&ie.setGlobalState(_.clippingPlanes,B),Ir(w,O,B),Xe.updateMultisampleRenderTarget(Q),Xe.updateRenderTargetMipmap(Q),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let ut=0,At=N.length;ut<At;ut++){const xt=N[ut],pt=xt.object,Ce=xt.geometry,Et=xt.material,it=xt.group;if(Et.side===Gt&&pt.layers.test(B.layers)){const on=Et.side;Et.side=rn,Et.needsUpdate=!0,lh(pt,O,B,Ce,Et,it),Et.side=on,Et.needsUpdate=!0,Je=!0}}Je===!0&&(Xe.updateMultisampleRenderTarget(Q),Xe.updateRenderTargetMipmap(Q))}_.setRenderTarget(me,ue,Le),_.setClearColor(V,W),Ae!==void 0&&(B.viewport=Ae),_.toneMapping=Ue}function Ir(w,N,O){const B=N.isScene===!0?N.overrideMaterial:null;for(let U=0,Q=w.length;U<Q;U++){const le=w[U],me=le.object,ue=le.geometry,Le=le.group;let Ue=le.material;Ue.allowOverride===!0&&B!==null&&(Ue=B),me.layers.test(O.layers)&&lh(me,N,O,ue,Ue,Le)}}function lh(w,N,O,B,U,Q){w.onBeforeRender(_,N,O,B,U,Q),w.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),U.onBeforeRender(_,N,O,B,w,Q),U.transparent===!0&&U.side===Gt&&U.forceSinglePass===!1?(U.side=rn,U.needsUpdate=!0,_.renderBufferDirect(O,N,B,U,w,Q),U.side=si,U.needsUpdate=!0,_.renderBufferDirect(O,N,B,U,w,Q),U.side=Gt):_.renderBufferDirect(O,N,B,U,w,Q),w.onAfterRender(_,N,O,B,U,Q)}function Lr(w,N,O){N.isScene!==!0&&(N=we);const B=_e.get(w),U=p.state.lights,Q=p.state.shadowsArray,le=U.state.version,me=X.getParameters(w,U.state,Q,N,O),ue=X.getProgramCacheKey(me);let Le=B.programs;B.environment=w.isMeshStandardMaterial?N.environment:null,B.fog=N.fog,B.envMap=(w.isMeshStandardMaterial?Rt:Nt).get(w.envMap||B.environment),B.envMapRotation=B.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,Le===void 0&&(w.addEventListener("dispose",Y),Le=new Map,B.programs=Le);let Ue=Le.get(ue);if(Ue!==void 0){if(B.currentProgram===Ue&&B.lightsStateVersion===le)return hh(w,me),Ue}else me.uniforms=X.getUniforms(w),w.onBeforeCompile(me,_),Ue=X.acquireProgram(me,ue),Le.set(ue,Ue),B.uniforms=me.uniforms;const Ae=B.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ae.clippingPlanes=ie.uniform),hh(w,me),B.needsLights=Lp(w),B.lightsStateVersion=le,B.needsLights&&(Ae.ambientLightColor.value=U.state.ambient,Ae.lightProbe.value=U.state.probe,Ae.directionalLights.value=U.state.directional,Ae.directionalLightShadows.value=U.state.directionalShadow,Ae.spotLights.value=U.state.spot,Ae.spotLightShadows.value=U.state.spotShadow,Ae.rectAreaLights.value=U.state.rectArea,Ae.ltc_1.value=U.state.rectAreaLTC1,Ae.ltc_2.value=U.state.rectAreaLTC2,Ae.pointLights.value=U.state.point,Ae.pointLightShadows.value=U.state.pointShadow,Ae.hemisphereLights.value=U.state.hemi,Ae.directionalShadowMap.value=U.state.directionalShadowMap,Ae.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ae.spotShadowMap.value=U.state.spotShadowMap,Ae.spotLightMatrix.value=U.state.spotLightMatrix,Ae.spotLightMap.value=U.state.spotLightMap,Ae.pointShadowMap.value=U.state.pointShadowMap,Ae.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=Ue,B.uniformsList=null,Ue}function ch(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=xa.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function hh(w,N){const O=_e.get(w);O.outputColorSpace=N.outputColorSpace,O.batching=N.batching,O.batchingColor=N.batchingColor,O.instancing=N.instancing,O.instancingColor=N.instancingColor,O.instancingMorph=N.instancingMorph,O.skinning=N.skinning,O.morphTargets=N.morphTargets,O.morphNormals=N.morphNormals,O.morphColors=N.morphColors,O.morphTargetsCount=N.morphTargetsCount,O.numClippingPlanes=N.numClippingPlanes,O.numIntersection=N.numClipIntersection,O.vertexAlphas=N.vertexAlphas,O.vertexTangents=N.vertexTangents,O.toneMapping=N.toneMapping}function Pp(w,N,O,B,U){N.isScene!==!0&&(N=we),Xe.resetTextureUnits();const Q=N.fog,le=B.isMeshStandardMaterial?N.environment:null,me=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Jt,ue=(B.isMeshStandardMaterial?Rt:Nt).get(B.envMap||le),Le=B.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Ue=!!O.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Ae=!!O.morphAttributes.position,Je=!!O.morphAttributes.normal,ut=!!O.morphAttributes.color;let At=Mi;B.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(At=_.toneMapping);const xt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,pt=xt!==void 0?xt.length:0,Ce=_e.get(B),Et=p.state.lights;if(ot===!0&&($===!0||w!==S)){const jt=w===S&&B.id===y;ie.setState(B,w,jt)}let it=!1;B.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==Et.state.version||Ce.outputColorSpace!==me||U.isBatchedMesh&&Ce.batching===!1||!U.isBatchedMesh&&Ce.batching===!0||U.isBatchedMesh&&Ce.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ce.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ce.instancing===!1||!U.isInstancedMesh&&Ce.instancing===!0||U.isSkinnedMesh&&Ce.skinning===!1||!U.isSkinnedMesh&&Ce.skinning===!0||U.isInstancedMesh&&Ce.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ce.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ce.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ce.instancingMorph===!1&&U.morphTexture!==null||Ce.envMap!==ue||B.fog===!0&&Ce.fog!==Q||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==ie.numPlanes||Ce.numIntersection!==ie.numIntersection)||Ce.vertexAlphas!==Le||Ce.vertexTangents!==Ue||Ce.morphTargets!==Ae||Ce.morphNormals!==Je||Ce.morphColors!==ut||Ce.toneMapping!==At||Ce.morphTargetsCount!==pt)&&(it=!0):(it=!0,Ce.__version=B.version);let on=Ce.currentProgram;it===!0&&(on=Lr(B,N,U));let Ki=!1,ln=!1,Vs=!1;const Tt=on.getUniforms(),mn=Ce.uniforms;if(ve.useProgram(on.program)&&(Ki=!0,ln=!0,Vs=!0),B.id!==y&&(y=B.id,ln=!0),Ki||S!==w){ve.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Tt.setValue(L,"projectionMatrix",w.projectionMatrix),Tt.setValue(L,"viewMatrix",w.matrixWorldInverse);const Qt=Tt.map.cameraPosition;Qt!==void 0&&Qt.setValue(L,pe.setFromMatrixPosition(w.matrixWorld)),Ne.logarithmicDepthBuffer&&Tt.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Tt.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,ln=!0,Vs=!0)}if(U.isSkinnedMesh){Tt.setOptional(L,U,"bindMatrix"),Tt.setOptional(L,U,"bindMatrixInverse");const jt=U.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),Tt.setValue(L,"boneTexture",jt.boneTexture,Xe))}U.isBatchedMesh&&(Tt.setOptional(L,U,"batchingTexture"),Tt.setValue(L,"batchingTexture",U._matricesTexture,Xe),Tt.setOptional(L,U,"batchingIdTexture"),Tt.setValue(L,"batchingIdTexture",U._indirectTexture,Xe),Tt.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&Tt.setValue(L,"batchingColorTexture",U._colorsTexture,Xe));const gn=O.morphAttributes;if((gn.position!==void 0||gn.normal!==void 0||gn.color!==void 0)&&te.update(U,O,on),(ln||Ce.receiveShadow!==U.receiveShadow)&&(Ce.receiveShadow=U.receiveShadow,Tt.setValue(L,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(mn.envMap.value=ue,mn.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&N.environment!==null&&(mn.envMapIntensity.value=N.environmentIntensity),ln&&(Tt.setValue(L,"toneMappingExposure",_.toneMappingExposure),Ce.needsLights&&Ip(mn,Vs),Q&&B.fog===!0&&q.refreshFogUniforms(mn,Q),q.refreshMaterialUniforms(mn,B,H,K,p.state.transmissionRenderTarget[w.id]),xa.upload(L,ch(Ce),mn,Xe)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(xa.upload(L,ch(Ce),mn,Xe),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Tt.setValue(L,"center",U.center),Tt.setValue(L,"modelViewMatrix",U.modelViewMatrix),Tt.setValue(L,"normalMatrix",U.normalMatrix),Tt.setValue(L,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const jt=B.uniformsGroups;for(let Qt=0,ro=jt.length;Qt<ro;Qt++){const Ri=jt[Qt];Ve.update(Ri,on),Ve.bind(Ri,on)}}return on}function Ip(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function Lp(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,N,O){const B=_e.get(w);B.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),_e.get(w.texture).__webglTexture=N,_e.get(w.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:O,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,N){const O=_e.get(w);O.__webglFramebuffer=N,O.__useDefaultFramebuffer=N===void 0};const Dp=L.createFramebuffer();this.setRenderTarget=function(w,N=0,O=0){C=w,T=N,A=O;let B=!0,U=null,Q=!1,le=!1;if(w){const ue=_e.get(w);if(ue.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(L.FRAMEBUFFER,null),B=!1;else if(ue.__webglFramebuffer===void 0)Xe.setupRenderTarget(w);else if(ue.__hasExternalTextures)Xe.rebindTextures(w,_e.get(w.texture).__webglTexture,_e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ae=w.depthTexture;if(ue.__boundDepthTexture!==Ae){if(Ae!==null&&_e.has(Ae)&&(w.width!==Ae.image.width||w.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Xe.setupDepthRenderbuffer(w)}}const Le=w.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(le=!0);const Ue=_e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ue[N])?U=Ue[N][O]:U=Ue[N],Q=!0):w.samples>0&&Xe.useMultisampledRTT(w)===!1?U=_e.get(w).__webglMultisampledFramebuffer:Array.isArray(Ue)?U=Ue[O]:U=Ue,I.copy(w.viewport),F.copy(w.scissor),z=w.scissorTest}else I.copy(Te).multiplyScalar(H).floor(),F.copy(Ke).multiplyScalar(H).floor(),z=mt;if(O!==0&&(U=Dp),ve.bindFramebuffer(L.FRAMEBUFFER,U)&&B&&ve.drawBuffers(w,U),ve.viewport(I),ve.scissor(F),ve.setScissorTest(z),Q){const ue=_e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,ue.__webglTexture,O)}else if(le){const ue=N;for(let Le=0;Le<w.textures.length;Le++){const Ue=_e.get(w.textures[Le]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Le,Ue.__webglTexture,O,ue)}}else if(w!==null&&O!==0){const ue=_e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ue.__webglTexture,O)}y=-1},this.readRenderTargetPixels=function(w,N,O,B,U,Q,le,me=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=_e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&le!==void 0&&(ue=ue[le]),ue){ve.bindFramebuffer(L.FRAMEBUFFER,ue);try{const Le=w.textures[me],Ue=Le.format,Ae=Le.type;if(!Ne.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ne.textureTypeReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-B&&O>=0&&O<=w.height-U&&(w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),L.readPixels(N,O,B,U,be.convert(Ue),be.convert(Ae),Q))}finally{const Le=C!==null?_e.get(C).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(w,N,O,B,U,Q,le,me=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=_e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&le!==void 0&&(ue=ue[le]),ue)if(N>=0&&N<=w.width-B&&O>=0&&O<=w.height-U){ve.bindFramebuffer(L.FRAMEBUFFER,ue);const Le=w.textures[me],Ue=Le.format,Ae=Le.type;if(!Ne.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ne.textureTypeReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Je),L.bufferData(L.PIXEL_PACK_BUFFER,Q.byteLength,L.STREAM_READ),w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),L.readPixels(N,O,B,U,be.convert(Ue),be.convert(Ae),0);const ut=C!==null?_e.get(C).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,ut);const At=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await jm(L,At,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Je),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Q),L.deleteBuffer(Je),L.deleteSync(At),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,N=null,O=0){const B=Math.pow(2,-O),U=Math.floor(w.image.width*B),Q=Math.floor(w.image.height*B),le=N!==null?N.x:0,me=N!==null?N.y:0;Xe.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,O,0,0,le,me,U,Q),ve.unbindTexture()};const Np=L.createFramebuffer(),Up=L.createFramebuffer();this.copyTextureToTexture=function(w,N,O=null,B=null,U=0,Q=null){Q===null&&(U!==0?(yr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=U,U=0):Q=0);let le,me,ue,Le,Ue,Ae,Je,ut,At;const xt=w.isCompressedTexture?w.mipmaps[Q]:w.image;if(O!==null)le=O.max.x-O.min.x,me=O.max.y-O.min.y,ue=O.isBox3?O.max.z-O.min.z:1,Le=O.min.x,Ue=O.min.y,Ae=O.isBox3?O.min.z:0;else{const gn=Math.pow(2,-U);le=Math.floor(xt.width*gn),me=Math.floor(xt.height*gn),w.isDataArrayTexture?ue=xt.depth:w.isData3DTexture?ue=Math.floor(xt.depth*gn):ue=1,Le=0,Ue=0,Ae=0}B!==null?(Je=B.x,ut=B.y,At=B.z):(Je=0,ut=0,At=0);const pt=be.convert(N.format),Ce=be.convert(N.type);let Et;N.isData3DTexture?(Xe.setTexture3D(N,0),Et=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Xe.setTexture2DArray(N,0),Et=L.TEXTURE_2D_ARRAY):(Xe.setTexture2D(N,0),Et=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const it=L.getParameter(L.UNPACK_ROW_LENGTH),on=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ki=L.getParameter(L.UNPACK_SKIP_PIXELS),ln=L.getParameter(L.UNPACK_SKIP_ROWS),Vs=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,xt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,xt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Le),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ue),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ae);const Tt=w.isDataArrayTexture||w.isData3DTexture,mn=N.isDataArrayTexture||N.isData3DTexture;if(w.isDepthTexture){const gn=_e.get(w),jt=_e.get(N),Qt=_e.get(gn.__renderTarget),ro=_e.get(jt.__renderTarget);ve.bindFramebuffer(L.READ_FRAMEBUFFER,Qt.__webglFramebuffer),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,ro.__webglFramebuffer);for(let Ri=0;Ri<ue;Ri++)Tt&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(w).__webglTexture,U,Ae+Ri),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(N).__webglTexture,Q,At+Ri)),L.blitFramebuffer(Le,Ue,le,me,Je,ut,le,me,L.DEPTH_BUFFER_BIT,L.NEAREST);ve.bindFramebuffer(L.READ_FRAMEBUFFER,null),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(U!==0||w.isRenderTargetTexture||_e.has(w)){const gn=_e.get(w),jt=_e.get(N);ve.bindFramebuffer(L.READ_FRAMEBUFFER,Np),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,Up);for(let Qt=0;Qt<ue;Qt++)Tt?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,gn.__webglTexture,U,Ae+Qt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,gn.__webglTexture,U),mn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,jt.__webglTexture,Q,At+Qt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,jt.__webglTexture,Q),U!==0?L.blitFramebuffer(Le,Ue,le,me,Je,ut,le,me,L.COLOR_BUFFER_BIT,L.NEAREST):mn?L.copyTexSubImage3D(Et,Q,Je,ut,At+Qt,Le,Ue,le,me):L.copyTexSubImage2D(Et,Q,Je,ut,Le,Ue,le,me);ve.bindFramebuffer(L.READ_FRAMEBUFFER,null),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else mn?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Et,Q,Je,ut,At,le,me,ue,pt,Ce,xt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(Et,Q,Je,ut,At,le,me,ue,pt,xt.data):L.texSubImage3D(Et,Q,Je,ut,At,le,me,ue,pt,Ce,xt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Q,Je,ut,le,me,pt,Ce,xt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Q,Je,ut,xt.width,xt.height,pt,xt.data):L.texSubImage2D(L.TEXTURE_2D,Q,Je,ut,le,me,pt,Ce,xt);L.pixelStorei(L.UNPACK_ROW_LENGTH,it),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,on),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ki),L.pixelStorei(L.UNPACK_SKIP_ROWS,ln),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Vs),Q===0&&N.generateMipmaps&&L.generateMipmap(Et),ve.unbindTexture()},this.initRenderTarget=function(w){_e.get(w).__webglFramebuffer===void 0&&Xe.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Xe.setTextureCube(w,0):w.isData3DTexture?Xe.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Xe.setTexture2DArray(w,0):Xe.setTexture2D(w,0),ve.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,ve.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}function jl(s,e){(e==null||e>s.length)&&(e=s.length);for(var t=0,n=Array(e);t<e;t++)n[t]=s[t];return n}function Xy(s){if(Array.isArray(s))return s}function jy(s){if(Array.isArray(s))return jl(s)}function $y(s,e){if(!(s instanceof e))throw new TypeError("Cannot call a class as a function")}function Yy(s,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(s,ld(n.key),n)}}function qy(s,e,t){return e&&Yy(s.prototype,e),Object.defineProperty(s,"prototype",{writable:!1}),s}function ya(s,e){var t=typeof Symbol<"u"&&s[Symbol.iterator]||s["@@iterator"];if(!t){if(Array.isArray(s)||(t=Oc(s))||e){t&&(s=t);var n=0,i=function(){};return{s:i,n:function(){return n>=s.length?{done:!0}:{done:!1,value:s[n++]}},e:function(l){throw l},f:i}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var r,a=!0,o=!1;return{s:function(){t=t.call(s)},n:function(){var l=t.next();return a=l.done,l},e:function(l){o=!0,r=l},f:function(){try{a||t.return==null||t.return()}finally{if(o)throw r}}}}function Re(s,e,t){return(e=ld(e))in s?Object.defineProperty(s,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):s[e]=t,s}function Ky(s){if(typeof Symbol<"u"&&s[Symbol.iterator]!=null||s["@@iterator"]!=null)return Array.from(s)}function Zy(s,e){var t=s==null?null:typeof Symbol<"u"&&s[Symbol.iterator]||s["@@iterator"];if(t!=null){var n,i,r,a,o=[],l=!0,c=!1;try{if(r=(t=t.call(s)).next,e===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(n=r.call(t)).done)&&(o.push(n.value),o.length!==e);l=!0);}catch(h){c=!0,i=h}finally{try{if(!l&&t.return!=null&&(a=t.return(),Object(a)!==a))return}finally{if(c)throw i}}return o}}function Jy(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Qy(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Pu(s,e){var t=Object.keys(s);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(s);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(s,i).enumerable})),t.push.apply(t,n)}return t}function ee(s){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?Pu(Object(t),!0).forEach(function(n){Re(s,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(t)):Pu(Object(t)).forEach(function(n){Object.defineProperty(s,n,Object.getOwnPropertyDescriptor(t,n))})}return s}function qa(s,e){return Xy(s)||Zy(s,e)||Oc(s,e)||Jy()}function Dn(s){return jy(s)||Ky(s)||Oc(s)||Qy()}function e1(s,e){if(typeof s!="object"||!s)return s;var t=s[Symbol.toPrimitive];if(t!==void 0){var n=t.call(s,e);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(s)}function ld(s){var e=e1(s,"string");return typeof e=="symbol"?e:e+""}function Ua(s){"@babel/helpers - typeof";return Ua=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Ua(s)}function Oc(s,e){if(s){if(typeof s=="string")return jl(s,e);var t={}.toString.call(s).slice(8,-1);return t==="Object"&&s.constructor&&(t=s.constructor.name),t==="Map"||t==="Set"?Array.from(s):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?jl(s,e):void 0}}var Iu=function(){},zc={},cd={},hd=null,ud={mark:Iu,measure:Iu};try{typeof window<"u"&&(zc=window),typeof document<"u"&&(cd=document),typeof MutationObserver<"u"&&(hd=MutationObserver),typeof performance<"u"&&(ud=performance)}catch{}var t1=zc.navigator||{},Lu=t1.userAgent,Du=Lu===void 0?"":Lu,wi=zc,yt=cd,Nu=hd,aa=ud;wi.document;var li=!!yt.documentElement&&!!yt.head&&typeof yt.addEventListener=="function"&&typeof yt.createElement=="function",fd=~Du.indexOf("MSIE")||~Du.indexOf("Trident/"),oa,n1=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,i1=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,dd={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},"slab-duo":{"fa-regular":"regular",fasldr:"regular"},"slab-press-duo":{"fa-regular":"regular",faslpdr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},vellum:{"fa-solid":"solid",favs:"solid"},pixel:{"fa-regular":"regular",fapr:"regular"},mosaic:{"fa-solid":"solid",fams:"solid"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},s1={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},pd=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],Ot="classic",Rr="duotone",md="sharp",gd="sharp-duotone",vd="chisel",_d="etch",xd="graphite",yd="jelly",bd="jelly-duo",Md="jelly-fill",Sd="mosaic",wd="notdog",Ed="notdog-duo",Td="pixel",Ad="slab",Rd="slab-duo",Cd="slab-press",Pd="slab-press-duo",Id="thumbprint",Ld="utility",Dd="utility-duo",Nd="utility-fill",Ud="vellum",Fd="whiteboard",r1="Classic",a1="Duotone",o1="Sharp",l1="Sharp Duotone",c1="Chisel",h1="Etch",u1="Graphite",f1="Jelly",d1="Jelly Duo",p1="Jelly Fill",m1="Mosaic",g1="Notdog",v1="Notdog Duo",_1="Pixel",x1="Slab",y1="Slab Duo",b1="Slab Press",M1="Slab Press Duo",S1="Thumbprint",w1="Utility",E1="Utility Duo",T1="Utility Fill",A1="Vellum",R1="Whiteboard",kd=[Ot,Rr,md,gd,vd,_d,xd,yd,bd,Md,Sd,wd,Ed,Td,Ad,Rd,Cd,Pd,Id,Ld,Dd,Nd,Ud,Fd];oa={},Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(oa,Ot,r1),Rr,a1),md,o1),gd,l1),vd,c1),_d,h1),xd,u1),yd,f1),bd,d1),Md,p1),Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(oa,Sd,m1),wd,g1),Ed,v1),Td,_1),Ad,x1),Rd,y1),Cd,b1),Pd,M1),Id,S1),Ld,w1),Re(Re(Re(Re(oa,Dd,E1),Nd,T1),Ud,A1),Fd,R1);var C1={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},"slab-duo":{400:"fasldr"},"slab-press-duo":{400:"faslpdr"},vellum:{900:"favs"},mosaic:{900:"fams"},pixel:{400:"fapr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},P1={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Slab Duo":{400:"fasldr",normal:"fasldr"},"Font Awesome 7 Slab Press Duo":{400:"faslpdr",normal:"faslpdr"},"Font Awesome 7 Pixel":{400:"fapr",normal:"fapr"},"Font Awesome 7 Mosaic":{900:"fams",normal:"fams"},"Font Awesome 7 Vellum":{900:"favs",normal:"favs"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},I1=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["mosaic",{defaultShortPrefixId:"fams",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["pixel",{defaultShortPrefixId:"fapr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-duo",{defaultShortPrefixId:"fasldr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press-duo",{defaultShortPrefixId:"faslpdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["vellum",{defaultShortPrefixId:"favs",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),L1={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},mosaic:{solid:"fams"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},pixel:{regular:"fapr"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-duo":{regular:"fasldr"},"slab-press":{regular:"faslpr"},"slab-press-duo":{regular:"faslpdr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},vellum:{solid:"favs"},whiteboard:{semibold:"fawsb"}},Od=["fak","fa-kit","fakd","fa-kit-duotone"],Uu={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},D1=["kit"],N1="kit",U1="kit-duotone",F1="Kit",k1="Kit Duotone";Re(Re({},N1,F1),U1,k1);var O1={kit:{"fa-kit":"fak"}},z1={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},B1={kit:{fak:"fa-kit"}},Fu={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},la,ca={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},H1=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],V1="classic",G1="duotone",W1="sharp",X1="sharp-duotone",j1="chisel",$1="etch",Y1="graphite",q1="jelly",K1="jelly-duo",Z1="jelly-fill",J1="mosaic",Q1="notdog",eb="notdog-duo",tb="pixel",nb="slab",ib="slab-duo",sb="slab-press",rb="slab-press-duo",ab="thumbprint",ob="utility",lb="utility-duo",cb="utility-fill",hb="vellum",ub="whiteboard",fb="Classic",db="Duotone",pb="Sharp",mb="Sharp Duotone",gb="Chisel",vb="Etch",_b="Graphite",xb="Jelly",yb="Jelly Duo",bb="Jelly Fill",Mb="Mosaic",Sb="Notdog",wb="Notdog Duo",Eb="Pixel",Tb="Slab",Ab="Slab Duo",Rb="Slab Press",Cb="Slab Press Duo",Pb="Thumbprint",Ib="Utility",Lb="Utility Duo",Db="Utility Fill",Nb="Vellum",Ub="Whiteboard";la={},Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(la,V1,fb),G1,db),W1,pb),X1,mb),j1,gb),$1,vb),Y1,_b),q1,xb),K1,yb),Z1,bb),Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(la,J1,Mb),Q1,Sb),eb,wb),tb,Eb),nb,Tb),ib,Ab),sb,Rb),rb,Cb),ab,Pb),ob,Ib),Re(Re(Re(Re(la,lb,Lb),cb,Db),hb,Nb),ub,Ub);var Fb="kit",kb="kit-duotone",Ob="Kit",zb="Kit Duotone";Re(Re({},Fb,Ob),kb,zb);var Bb={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},"slab-duo":{"fa-regular":"fasldr"},"slab-press-duo":{"fa-regular":"faslpdr"},pixel:{"fa-regular":"fapr"},mosaic:{"fa-solid":"fams"},vellum:{"fa-solid":"favs"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Hb={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],"slab-duo":["fasldr"],"slab-press-duo":["faslpdr"],pixel:["fapr"],mosaic:["fams"],vellum:["favs"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},$l={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},"slab-duo":{fasldr:"fa-regular"},"slab-press-duo":{faslpdr:"fa-regular"},pixel:{fapr:"fa-regular"},mosaic:{fams:"fa-solid"},vellum:{favs:"fa-solid"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},Vb=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],zd=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fasldr","faslpdr","fapr","fams","favs","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(H1,Vb),Gb=["solid","regular","light","thin","duotone","brands","semibold"],Bd=[1,2,3,4,5,6,7,8,9,10],Wb=Bd.concat([11,12,13,14,15,16,17,18,19,20]),Xb=["aw","fw","pull-left","pull-right"],jb=[].concat(Dn(Object.keys(Hb)),Gb,Xb,["2xs","xs","sm","lg","xl","2xl","beat","beat-fade","border","bounce","buzz","canvas-square","canvas-roomy","fade","flip-360","flip-both","flip-horizontal","flip-vertical","flip","float","inverse","jello","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","spin-snap","spin-snap-4","spin-snap-8","stack-1x","stack-2x","stack","swing","ul","wag","width-auto","width-fixed",ca.GROUP,ca.SWAP_OPACITY,ca.PRIMARY,ca.SECONDARY]).concat(Bd.map(function(s){return"".concat(s,"x")})).concat(Wb.map(function(s){return"w-".concat(s)})),$b={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},ai="___FONT_AWESOME___",Yl=16,Hd="fa",Vd="svg-inline--fa",ji="data-fa-i2svg",ql="data-fa-pseudo-element",Yb="data-fa-pseudo-element-pending",Bc="data-prefix",Hc="data-icon",ku="fontawesome-i2svg",qb="async",Kb=["HTML","HEAD","STYLE","SCRIPT"],Gd=["::before","::after",":before",":after"],Wd=(function(){try{return!0}catch{return!1}})();function Cr(s){return new Proxy(s,{get:function(t,n){return n in t?t[n]:t[Ot]}})}var Xd=ee({},dd);Xd[Ot]=ee(ee(ee(ee({},{"fa-duotone":"duotone"}),dd[Ot]),Uu.kit),Uu["kit-duotone"]);var Zb=Cr(Xd),Kl=ee({},L1);Kl[Ot]=ee(ee(ee(ee({},{duotone:"fad"}),Kl[Ot]),Fu.kit),Fu["kit-duotone"]);var Ou=Cr(Kl),Zl=ee({},$l);Zl[Ot]=ee(ee({},Zl[Ot]),B1.kit);var Vc=Cr(Zl),Jl=ee({},Bb);Jl[Ot]=ee(ee({},Jl[Ot]),O1.kit);Cr(Jl);var Jb=n1,jd="fa-layers-text",Qb=i1,eM=ee({},C1);Cr(eM);var tM=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Vo=s1,nM=[].concat(Dn(D1),Dn(jb)),or=wi.FontAwesomeConfig||{};function iM(s){var e=yt.querySelector("script["+s+"]");if(e)return e.getAttribute(s)}function sM(s){return s===""?!0:s==="false"?!1:s==="true"?!0:s}if(yt&&typeof yt.querySelector=="function"){var rM=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];rM.forEach(function(s){var e=qa(s,2),t=e[0],n=e[1],i=sM(iM(t));i!=null&&(or[n]=i)})}var $d={styleDefault:"solid",familyDefault:Ot,cssPrefix:Hd,replacementClass:Vd,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};or.familyPrefix&&(or.cssPrefix=or.familyPrefix);var Ds=ee(ee({},$d),or);Ds.autoReplaceSvg||(Ds.observeMutations=!1);var Ee={};Object.keys($d).forEach(function(s){Object.defineProperty(Ee,s,{enumerable:!0,set:function(t){Ds[s]=t,lr.forEach(function(n){return n(Ee)})},get:function(){return Ds[s]}})});Object.defineProperty(Ee,"familyPrefix",{enumerable:!0,set:function(e){Ds.cssPrefix=e,lr.forEach(function(t){return t(Ee)})},get:function(){return Ds.cssPrefix}});wi.FontAwesomeConfig=Ee;var lr=[];function aM(s){return lr.push(s),function(){lr.splice(lr.indexOf(s),1)}}var ds=Yl,Hn={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function oM(s){if(!(!s||!li)){var e=yt.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=s;for(var t=yt.head.childNodes,n=null,i=t.length-1;i>-1;i--){var r=t[i],a=(r.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(a)>-1&&(n=r)}return yt.head.insertBefore(e,n),s}}var lM="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function zu(){for(var s=12,e="";s-- >0;)e+=lM[Math.random()*62|0];return e}function Hs(s){for(var e=[],t=(s||[]).length>>>0;t--;)e[t]=s[t];return e}function Gc(s){return s.classList?Hs(s.classList):(s.getAttribute("class")||"").split(" ").filter(function(e){return e})}function Yd(s){return"".concat(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function cM(s){return Object.keys(s||{}).reduce(function(e,t){return e+"".concat(t,'="').concat(Yd(s[t]),'" ')},"").trim()}function Ka(s){return Object.keys(s||{}).reduce(function(e,t){return e+"".concat(t,": ").concat(s[t].trim(),";")},"")}function Wc(s){return s.size!==Hn.size||s.x!==Hn.x||s.y!==Hn.y||s.rotate!==Hn.rotate||s.flipX||s.flipY}function hM(s){var e=s.transform,t=s.containerWidth,n=s.iconWidth,i={transform:"translate(".concat(t/2," 256)")},r="translate(".concat(e.x*32,", ").concat(e.y*32,") "),a="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),o="rotate(".concat(e.rotate," 0 0)"),l={transform:"".concat(r," ").concat(a," ").concat(o)},c={transform:"translate(".concat(n/2*-1," -256)")};return{outer:i,inner:l,path:c}}function uM(s){var e=s.transform,t=s.width,n=t===void 0?Yl:t,i=s.height,r=i===void 0?Yl:i,a="";return fd?a+="translate(".concat(e.x/ds-n/2,"em, ").concat(e.y/ds-r/2,"em) "):a+="translate(calc(-50% + ".concat(e.x/ds,"em), calc(-50% + ").concat(e.y/ds,"em)) "),a+="scale(".concat(e.size/ds*(e.flipX?-1:1),", ").concat(e.size/ds*(e.flipY?-1:1),") "),a+="rotate(".concat(e.rotate,"deg) "),a}var fM=`:root, :host {
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
}`;function qd(){var s=Hd,e=Vd,t=Ee.cssPrefix,n=Ee.replacementClass,i=fM;if(t!==s||n!==e){var r=new RegExp("\\.".concat(s,"\\-"),"g"),a=new RegExp("\\--".concat(s,"\\-"),"g"),o=new RegExp("\\.".concat(e),"g");i=i.replace(r,".".concat(t,"-")).replace(a,"--".concat(t,"-")).replace(o,".".concat(n))}return i}var Bu=!1;function Go(){Ee.autoAddCss&&!Bu&&(oM(qd()),Bu=!0)}var dM={mixout:function(){return{dom:{css:qd,insertCss:Go}}},hooks:function(){return{beforeDOMElementCreation:function(){Go()},beforeI2svg:function(){Go()}}}},oi=wi||{};oi[ai]||(oi[ai]={});oi[ai].styles||(oi[ai].styles={});oi[ai].hooks||(oi[ai].hooks={});oi[ai].shims||(oi[ai].shims=[]);var Rn=oi[ai],Kd=[],Zd=function(){yt.removeEventListener("DOMContentLoaded",Zd),Fa=1,Kd.map(function(e){return e()})},Fa=!1;li&&(Fa=(yt.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(yt.readyState),Fa||yt.addEventListener("DOMContentLoaded",Zd));function pM(s){li&&(Fa?setTimeout(s,0):Kd.push(s))}function Pr(s){var e=s.tag,t=s.attributes,n=t===void 0?{}:t,i=s.children,r=i===void 0?[]:i;return typeof s=="string"?Yd(s):"<".concat(e," ").concat(cM(n),">").concat(r.map(Pr).join(""),"</").concat(e,">")}function Hu(s,e,t){if(s&&s[e]&&s[e][t])return{prefix:e,iconName:t,icon:s[e][t]}}var Wo=function(e,t,n,i){var r=Object.keys(e),a=r.length,o=t,l,c,h;for(n===void 0?(l=1,h=e[r[0]]):(l=0,h=n);l<a;l++)c=r[l],h=o(h,e[c],c,e);return h};function Jd(s){return Dn(s).length!==1?null:s.codePointAt(0).toString(16)}function Vu(s){return Object.keys(s).reduce(function(e,t){var n=s[t],i=!!n.icon;return i?e[n.iconName]=n.icon:e[t]=n,e},{})}function Ql(s,e){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=t.skipHooks,i=n===void 0?!1:n,r=Vu(e);typeof Rn.hooks.addPack=="function"&&!i?Rn.hooks.addPack(s,Vu(e)):Rn.styles[s]=ee(ee({},Rn.styles[s]||{}),r),s==="fas"&&Ql("fa",e)}var br=Rn.styles,mM=Rn.shims,Qd=Object.keys(Vc),gM=Qd.reduce(function(s,e){return s[e]=Object.keys(Vc[e]),s},{}),Xc=null,ep={},tp={},np={},ip={},sp={};function vM(s){return~nM.indexOf(s)}function _M(s,e){var t=e.split("-"),n=t[0],i=t.slice(1).join("-");return n===s&&i!==""&&!vM(i)?i:null}var rp=function(){var e=function(r){return Wo(br,function(a,o,l){return a[l]=Wo(o,r,{}),a},{})};ep=e(function(i,r,a){if(r[3]&&(i[r[3]]=a),r[2]){var o=r[2].filter(function(l){return typeof l=="number"});o.forEach(function(l){i[l.toString(16)]=a})}return i}),tp=e(function(i,r,a){if(i[a]=a,r[2]){var o=r[2].filter(function(l){return typeof l=="string"});o.forEach(function(l){i[l]=a})}return i}),sp=e(function(i,r,a){var o=r[2];return i[a]=a,o.forEach(function(l){i[l]=a}),i});var t="far"in br||Ee.autoFetchSvg,n=Wo(mM,function(i,r){var a=r[0],o=r[1],l=r[2];return o==="far"&&!t&&(o="fas"),typeof a=="string"&&(i.names[a]={prefix:o,iconName:l}),typeof a=="number"&&(i.unicodes[a.toString(16)]={prefix:o,iconName:l}),i},{names:{},unicodes:{}});np=n.names,ip=n.unicodes,Xc=Za(Ee.styleDefault,{family:Ee.familyDefault})};aM(function(s){Xc=Za(s.styleDefault,{family:Ee.familyDefault})});rp();function jc(s,e){return(ep[s]||{})[e]}function xM(s,e){return(tp[s]||{})[e]}function Bi(s,e){return(sp[s]||{})[e]}function ap(s){return np[s]||{prefix:null,iconName:null}}function yM(s){var e=ip[s],t=jc("fas",s);return e||(t?{prefix:"fas",iconName:t}:null)||{prefix:null,iconName:null}}function Ei(){return Xc}var op=function(){return{prefix:null,iconName:null,rest:[]}};function bM(s){var e=Ot,t=Qd.reduce(function(n,i){return n[i]="".concat(Ee.cssPrefix,"-").concat(i),n},{});return kd.forEach(function(n){(s.includes(t[n])||s.some(function(i){return gM[n].includes(i)}))&&(e=n)}),e}function Za(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.family,n=t===void 0?Ot:t,i=Zb[n][s];if(n===Rr&&!s)return"fad";var r=Ou[n][s]||Ou[n][i],a=s in Rn.styles?s:null,o=r||a||null;return o}function MM(s){var e=[],t=null;return s.forEach(function(n){var i=_M(Ee.cssPrefix,n);i?t=i:n&&e.push(n)}),{iconName:t,rest:e}}function Gu(s){return s.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var Wu=zd.concat(Od);function Ja(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.skipLookups,n=t===void 0?!1:t,i=null,r=Gu(s.filter(function(d){return Wu.includes(d)})),a=Gu(s.filter(function(d){return!Wu.includes(d)})),o=r.filter(function(d){return i=d,!pd.includes(d)}),l=qa(o,1),c=l[0],h=c===void 0?null:c,u=bM(r),f=ee(ee({},MM(a)),{},{prefix:Za(h,{family:u})});return ee(ee(ee({},f),TM({values:s,family:u,styles:br,config:Ee,canonical:f,givenPrefix:i})),SM(n,i,f))}function SM(s,e,t){var n=t.prefix,i=t.iconName;if(s||!n||!i)return{prefix:n,iconName:i};var r=e==="fa"?ap(i):{},a=Bi(n,i);return i=r.iconName||a||i,n=r.prefix||n,n==="far"&&!br.far&&br.fas&&!Ee.autoFetchSvg&&(n="fas"),{prefix:n,iconName:i}}var wM=kd.filter(function(s){return s!==Ot||s!==Rr}),EM=Object.keys($l).filter(function(s){return s!==Ot}).map(function(s){return Object.keys($l[s])}).flat();function TM(s){var e=s.values,t=s.family,n=s.canonical,i=s.givenPrefix,r=i===void 0?"":i,a=s.styles,o=a===void 0?{}:a,l=s.config,c=l===void 0?{}:l,h=t===Rr,u=e.includes("fa-duotone")||e.includes("fad"),f=c.familyDefault==="duotone",d=n.prefix==="fad"||n.prefix==="fa-duotone";if(!h&&(u||f||d)&&(n.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(n.prefix="fab"),!n.prefix&&wM.includes(t)){var g=Object.keys(o).find(function(m){return EM.includes(m)});if(g||c.autoFetchSvg){var v=I1.get(t).defaultShortPrefixId;n.prefix=v,n.iconName=Bi(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||r==="fa")&&(n.prefix=Ei()||"fas"),n}var AM=(function(){function s(){$y(this,s),this.definitions={}}return qy(s,[{key:"add",value:function(){for(var t=this,n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];var a=i.reduce(this._pullDefinitions,{});Object.keys(a).forEach(function(o){t.definitions[o]=ee(ee({},t.definitions[o]||{}),a[o]),Ql(o,a[o]);var l=Vc[Ot][o];l&&Ql(l,a[o]),rp()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(t,n){var i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(function(r){var a=i[r],o=a.prefix,l=a.iconName,c=a.icon,h=c[2];t[o]||(t[o]={}),h.length>0&&h.forEach(function(u){typeof u=="string"&&(t[o][u]=c)}),t[o][l]=c}),t}}])})(),Xu=[],_s={},bs={},RM=Object.keys(bs);function CM(s,e){var t=e.mixoutsTo;return Xu=s,_s={},Object.keys(bs).forEach(function(n){RM.indexOf(n)===-1&&delete bs[n]}),Xu.forEach(function(n){var i=n.mixout?n.mixout():{};if(Object.keys(i).forEach(function(a){typeof i[a]=="function"&&(t[a]=i[a]),Ua(i[a])==="object"&&Object.keys(i[a]).forEach(function(o){t[a]||(t[a]={}),t[a][o]=i[a][o]})}),n.hooks){var r=n.hooks();Object.keys(r).forEach(function(a){_s[a]||(_s[a]=[]),_s[a].push(r[a])})}n.provides&&n.provides(bs)}),t}function ec(s,e){for(var t=arguments.length,n=new Array(t>2?t-2:0),i=2;i<t;i++)n[i-2]=arguments[i];var r=_s[s]||[];return r.forEach(function(a){e=a.apply(null,[e].concat(n))}),e}function $i(s){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++)t[n-1]=arguments[n];var i=_s[s]||[];i.forEach(function(r){r.apply(null,t)})}function Ti(){var s=arguments[0],e=Array.prototype.slice.call(arguments,1);return bs[s]?bs[s].apply(null,e):void 0}function tc(s){s.prefix==="fa"&&(s.prefix="fas");var e=s.iconName,t=s.prefix||Ei();if(e)return e=Bi(t,e)||e,Hu(lp.definitions,t,e)||Hu(Rn.styles,t,e)}var lp=new AM,PM=function(){Ee.autoReplaceSvg=!1,Ee.observeMutations=!1,$i("noAuto")},IM={i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return li?($i("beforeI2svg",e),Ti("pseudoElements2svg",e),Ti("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;Ee.autoReplaceSvg===!1&&(Ee.autoReplaceSvg=!0),Ee.observeMutations=!0,pM(function(){DM({autoReplaceSvgRoot:t}),$i("watch",e)})}},LM={icon:function(e){if(e===null)return null;if(Ua(e)==="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:Bi(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],n=Za(e[0]);return{prefix:n,iconName:Bi(n,t)||t}}if(typeof e=="string"&&(e.indexOf("".concat(Ee.cssPrefix,"-"))>-1||e.match(Jb))){var i=Ja(e.split(" "),{skipLookups:!0});return{prefix:i.prefix||Ei(),iconName:Bi(i.prefix,i.iconName)||i.iconName}}if(typeof e=="string"){var r=Ei();return{prefix:r,iconName:Bi(r,e)||e}}}},pn={noAuto:PM,config:Ee,dom:IM,parse:LM,library:lp,findIconDefinition:tc,toHtml:Pr},DM=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot,n=t===void 0?yt:t;(Object.keys(Rn.styles).length>0||Ee.autoFetchSvg)&&li&&Ee.autoReplaceSvg&&pn.dom.i2svg({node:n})};function Qa(s,e){return Object.defineProperty(s,"abstract",{get:e}),Object.defineProperty(s,"html",{get:function(){return s.abstract.map(function(n){return Pr(n)})}}),Object.defineProperty(s,"node",{get:function(){if(li){var n=yt.createElement("div");return n.innerHTML=s.html,n.children}}}),s}function NM(s){var e=s.children,t=s.main,n=s.mask,i=s.attributes,r=s.styles,a=s.transform;if(Wc(a)&&t.found&&!n.found){var o=t.width,l=t.height,c={x:o/l/2,y:.5};i.style=Ka(ee(ee({},r),{},{"transform-origin":"".concat(c.x+a.x/16,"em ").concat(c.y+a.y/16,"em")}))}return[{tag:"svg",attributes:i,children:e}]}function UM(s){var e=s.prefix,t=s.iconName,n=s.children,i=s.attributes,r=s.symbol,a=r===!0?"".concat(e,"-").concat(Ee.cssPrefix,"-").concat(t):r;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:ee(ee({},i),{},{id:a}),children:n}]}]}function FM(s){var e=["aria-label","aria-labelledby","title","role"];return e.some(function(t){return t in s})}function $c(s){var e=s.icons,t=e.main,n=e.mask,i=s.prefix,r=s.iconName,a=s.transform,o=s.symbol,l=s.maskId,c=s.extra,h=s.watchable,u=h===void 0?!1:h,f=n.found?n:t,d=f.width,g=f.height,v=[Ee.replacementClass,r?"".concat(Ee.cssPrefix,"-").concat(r):""].filter(function(E){return c.classes.indexOf(E)===-1}).filter(function(E){return E!==""||!!E}).concat(c.classes).join(" "),m={children:[],attributes:ee(ee({},c.attributes),{},{"data-prefix":i,"data-icon":r,class:v,role:c.attributes.role||"img",viewBox:"0 0 ".concat(d," ").concat(g)})};!FM(c.attributes)&&!c.attributes["aria-hidden"]&&(m.attributes["aria-hidden"]="true"),u&&(m.attributes[ji]="");var p=ee(ee({},m),{},{prefix:i,iconName:r,main:t,mask:n,maskId:l,transform:a,symbol:o,styles:ee({},c.styles)}),x=n.found&&t.found?Ti("generateAbstractMask",p)||{children:[],attributes:{}}:Ti("generateAbstractIcon",p)||{children:[],attributes:{}},b=x.children,_=x.attributes;return p.children=b,p.attributes=_,o?UM(p):NM(p)}function ju(s){var e=s.content,t=s.width,n=s.height,i=s.transform,r=s.extra,a=s.watchable,o=a===void 0?!1:a,l=ee(ee({},r.attributes),{},{class:r.classes.join(" ")});o&&(l[ji]="");var c=ee({},r.styles);Wc(i)&&(c.transform=uM({transform:i,width:t,height:n}),c["-webkit-transform"]=c.transform);var h=Ka(c);h.length>0&&(l.style=h);var u=[];return u.push({tag:"span",attributes:l,children:[e]}),u}function kM(s){var e=s.content,t=s.extra,n=ee(ee({},t.attributes),{},{class:t.classes.join(" ")}),i=Ka(t.styles);i.length>0&&(n.style=i);var r=[];return r.push({tag:"span",attributes:n,children:[e]}),r}var Xo=Rn.styles;function nc(s){var e=s[0],t=s[1],n=s.slice(4),i=qa(n,1),r=i[0],a=null;return Array.isArray(r)?a={tag:"g",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(Vo.GROUP)},children:[{tag:"path",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(Vo.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(Vo.PRIMARY),fill:"currentColor",d:r[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:e,height:t,icon:a}}var OM={found:!1,width:512,height:512};function zM(s,e){!Wd&&!Ee.showMissingIcons&&s&&console.error('Icon with name "'.concat(s,'" and prefix "').concat(e,'" is missing.'))}function ic(s,e){var t=e;return e==="fa"&&Ee.styleDefault!==null&&(e=Ei()),new Promise(function(n,i){if(t==="fa"){var r=ap(s)||{};s=r.iconName||s,e=r.prefix||e}if(s&&e&&Xo[e]&&Xo[e][s]){var a=Xo[e][s];return n(nc(a))}zM(s,e),n(ee(ee({},OM),{},{icon:Ee.showMissingIcons&&s?Ti("missingIconAbstract")||{}:{}}))})}var $u=function(){},sc=Ee.measurePerformance&&aa&&aa.mark&&aa.measure?aa:{mark:$u,measure:$u},nr='FA "7.3.1"',BM=function(e){return sc.mark("".concat(nr," ").concat(e," begins")),function(){return cp(e)}},cp=function(e){sc.mark("".concat(nr," ").concat(e," ends")),sc.measure("".concat(nr," ").concat(e),"".concat(nr," ").concat(e," begins"),"".concat(nr," ").concat(e," ends"))},Yc={begin:BM,end:cp},ba=function(){};function Yu(s){var e=s.getAttribute?s.getAttribute(ji):null;return typeof e=="string"}function HM(s){var e=s.getAttribute?s.getAttribute(Bc):null,t=s.getAttribute?s.getAttribute(Hc):null;return e&&t}function VM(s){return s&&s.classList&&s.classList.contains&&s.classList.contains(Ee.replacementClass)}function GM(){if(Ee.autoReplaceSvg===!0)return Ma.replace;var s=Ma[Ee.autoReplaceSvg];return s||Ma.replace}function WM(s){return yt.createElementNS("http://www.w3.org/2000/svg",s)}function XM(s){return yt.createElement(s)}function hp(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.ceFn,n=t===void 0?s.tag==="svg"?WM:XM:t;if(typeof s=="string")return yt.createTextNode(s);var i=n(s.tag);Object.keys(s.attributes||[]).forEach(function(a){i.setAttribute(a,s.attributes[a])});var r=s.children||[];return r.forEach(function(a){i.appendChild(hp(a,{ceFn:n}))}),i}function jM(s){var e=" ".concat(s.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var Ma={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(i){t.parentNode.insertBefore(hp(i),t)}),t.getAttribute(ji)===null&&Ee.keepOriginalSource){var n=yt.createComment(jM(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~Gc(t).indexOf(Ee.replacementClass))return Ma.replace(e);var i=new RegExp("".concat(Ee.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var r=n[0].attributes.class.split(" ").reduce(function(o,l){return l===Ee.replacementClass||l.match(i)?o.toSvg.push(l):o.toNode.push(l),o},{toNode:[],toSvg:[]});n[0].attributes.class=r.toSvg.join(" "),r.toNode.length===0?t.removeAttribute("class"):t.setAttribute("class",r.toNode.join(" "))}var a=n.map(function(o){return Pr(o)}).join(`
`);t.setAttribute(ji,""),t.innerHTML=a}};function qu(s){s()}function up(s,e){var t=typeof e=="function"?e:ba;if(s.length===0)t();else{var n=qu;Ee.mutateApproach===qb&&(n=wi.requestAnimationFrame||qu),n(function(){var i=GM(),r=Yc.begin("mutate");s.map(i),r(),t()})}}var qc=!1;function fp(){qc=!0}function rc(){qc=!1}var ka=null;function Ku(s){if(Nu&&Ee.observeMutations){var e=s.treeCallback,t=e===void 0?ba:e,n=s.nodeCallback,i=n===void 0?ba:n,r=s.pseudoElementsCallback,a=r===void 0?ba:r,o=s.observeMutationsRoot,l=o===void 0?yt:o;ka=new Nu(function(c){if(!qc){var h=Ei();Hs(c).forEach(function(u){if(u.type==="childList"&&u.addedNodes.length>0&&!Yu(u.addedNodes[0])&&(Ee.searchPseudoElements&&a(u.target),t(u.target)),u.type==="attributes"&&u.target.parentNode&&Ee.searchPseudoElements&&a([u.target],!0),u.type==="attributes"&&Yu(u.target)&&~tM.indexOf(u.attributeName))if(u.attributeName==="class"&&HM(u.target)){var f=Ja(Gc(u.target)),d=f.prefix,g=f.iconName;u.target.setAttribute(Bc,d||h),g&&u.target.setAttribute(Hc,g)}else VM(u.target)&&i(u.target)})}}),li&&ka.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function $M(){ka&&ka.disconnect()}function YM(s){var e=s.getAttribute("style"),t=[];return e&&(t=e.split(";").reduce(function(n,i){var r=i.split(":"),a=r[0],o=r.slice(1);return a&&o.length>0&&(n[a]=o.join(":").trim()),n},{})),t}function qM(s){var e=s.getAttribute("data-prefix"),t=s.getAttribute("data-icon"),n=s.innerText!==void 0?s.innerText.trim():"",i=Ja(Gc(s));return i.prefix||(i.prefix=Ei()),e&&t&&(i.prefix=e,i.iconName=t),i.iconName&&i.prefix||(i.prefix&&n.length>0&&(i.iconName=xM(i.prefix,s.innerText)||jc(i.prefix,Jd(s.innerText))),!i.iconName&&Ee.autoFetchSvg&&s.firstChild&&s.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=s.firstChild.data)),i}function KM(s){var e=Hs(s.attributes).reduce(function(t,n){return t.name!=="class"&&t.name!=="style"&&(t[n.name]=n.value),t},{});return e}function ZM(){return{iconName:null,prefix:null,transform:Hn,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Zu(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},t=qM(s),n=t.iconName,i=t.prefix,r=t.rest,a=KM(s),o=ec("parseNodeAttributes",{},s),l=e.styleParser?YM(s):[];return ee({iconName:n,prefix:i,transform:Hn,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:l,attributes:a}},o)}var JM=Rn.styles;function dp(s){var e=Ee.autoReplaceSvg==="nest"?Zu(s,{styleParser:!1}):Zu(s);return~e.extra.classes.indexOf(jd)?Ti("generateLayersText",s,e):Ti("generateSvgReplacementMutation",s,e)}function QM(){return[].concat(Dn(Od),Dn(zd))}function Ju(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!li)return Promise.resolve();var t=yt.documentElement.classList,n=function(u){return t.add("".concat(ku,"-").concat(u))},i=function(u){return t.remove("".concat(ku,"-").concat(u))},r=Ee.autoFetchSvg?QM():pd.concat(Object.keys(JM));r.includes("fa")||r.push("fa");var a=[".".concat(jd,":not([").concat(ji,"])")].concat(r.map(function(h){return".".concat(h,":not([").concat(ji,"])")})).join(", ");if(a.length===0)return Promise.resolve();var o=[];try{o=Hs(s.querySelectorAll(a))}catch{}if(o.length>0)n("pending"),i("complete");else return Promise.resolve();var l=Yc.begin("onTree"),c=o.reduce(function(h,u){try{var f=dp(u);f&&h.push(f)}catch(d){Wd||d.name==="MissingIcon"&&console.error(d)}return h},[]);return new Promise(function(h,u){Promise.all(c).then(function(f){up(f,function(){n("active"),n("complete"),i("pending"),typeof e=="function"&&e(),l(),h()})}).catch(function(f){l(),u(f)})})}function eS(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;dp(s).then(function(t){t&&up([t],e)})}function tS(s){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(e||{}).icon?e:tc(e||{}),i=t.mask;return i&&(i=(i||{}).icon?i:tc(i||{})),s(n,ee(ee({},t),{},{mask:i}))}}var nS=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,i=n===void 0?Hn:n,r=t.symbol,a=r===void 0?!1:r,o=t.mask,l=o===void 0?null:o,c=t.maskId,h=c===void 0?null:c,u=t.classes,f=u===void 0?[]:u,d=t.attributes,g=d===void 0?{}:d,v=t.styles,m=v===void 0?{}:v;if(e){var p=e.prefix,x=e.iconName,b=e.icon;return Qa(ee({type:"icon"},e),function(){return $i("beforeDOMElementCreation",{iconDefinition:e,params:t}),$c({icons:{main:nc(b),mask:l?nc(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:p,iconName:x,transform:ee(ee({},Hn),i),symbol:a,maskId:h,extra:{attributes:g,styles:m,classes:f}})})}},iS={mixout:function(){return{icon:tS(nS)}},hooks:function(){return{mutationObserverCallbacks:function(t){return t.treeCallback=Ju,t.nodeCallback=eS,t}}},provides:function(e){e.i2svg=function(t){var n=t.node,i=n===void 0?yt:n,r=t.callback,a=r===void 0?function(){}:r;return Ju(i,a)},e.generateSvgReplacementMutation=function(t,n){var i=n.iconName,r=n.prefix,a=n.transform,o=n.symbol,l=n.mask,c=n.maskId,h=n.extra;return new Promise(function(u,f){Promise.all([ic(i,r),l.iconName?ic(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(d){var g=qa(d,2),v=g[0],m=g[1];u([t,$c({icons:{main:v,mask:m},prefix:r,iconName:i,transform:a,symbol:o,maskId:c,extra:h,watchable:!0})])}).catch(f)})},e.generateAbstractIcon=function(t){var n=t.children,i=t.attributes,r=t.main,a=t.transform,o=t.styles,l=Ka(o);l.length>0&&(i.style=l);var c;return Wc(a)&&(c=Ti("generateAbstractTransformGrouping",{main:r,transform:a,containerWidth:r.width,iconWidth:r.width})),n.push(c||r.icon),{children:n,attributes:i}}}},sS={mixout:function(){return{layer:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=n.classes,r=i===void 0?[]:i;return Qa({type:"layer"},function(){$i("beforeDOMElementCreation",{assembler:t,params:n});var a=[];return t(function(o){Array.isArray(o)?o.map(function(l){a=a.concat(l.abstract)}):a=a.concat(o.abstract)}),[{tag:"span",attributes:{class:["".concat(Ee.cssPrefix,"-layers")].concat(Dn(r)).join(" ")},children:a}]})}}}},rS={mixout:function(){return{counter:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var i=n.classes,r=i===void 0?[]:i,a=n.attributes,o=a===void 0?{}:a,l=n.styles,c=l===void 0?{}:l;return Qa({type:"counter",content:t},function(){return $i("beforeDOMElementCreation",{content:t,params:n}),kM({content:t.toString(),extra:{attributes:o,styles:c,classes:["".concat(Ee.cssPrefix,"-layers-counter")].concat(Dn(r))}})})}}}},aS={mixout:function(){return{text:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=n.transform,r=i===void 0?Hn:i,a=n.classes,o=a===void 0?[]:a,l=n.attributes,c=l===void 0?{}:l,h=n.styles,u=h===void 0?{}:h;return Qa({type:"text",content:t},function(){return $i("beforeDOMElementCreation",{content:t,params:n}),ju({content:t,transform:ee(ee({},Hn),r),extra:{attributes:c,styles:u,classes:["".concat(Ee.cssPrefix,"-layers-text")].concat(Dn(o))}})})}}},provides:function(e){e.generateLayersText=function(t,n){var i=n.transform,r=n.extra,a=null,o=null;if(fd){var l=parseInt(getComputedStyle(t).fontSize,10),c=t.getBoundingClientRect();a=c.width/l,o=c.height/l}return Promise.resolve([t,ju({content:t.innerHTML,width:a,height:o,transform:i,extra:r,watchable:!0})])}}},pp=new RegExp('"',"ug"),Qu=[1105920,1112319],ef=ee(ee(ee(ee({},{FontAwesome:{normal:"fas",400:"fas"}}),P1),$b),z1),ac=Object.keys(ef).reduce(function(s,e){return s[e.toLowerCase()]=ef[e],s},{}),oS=Object.keys(ac).reduce(function(s,e){var t=ac[e];return s[e]=t[900]||Dn(Object.entries(t))[0][1],s},{});function lS(s){var e=s.replace(pp,"");return Jd(Dn(e)[0]||"")}function cS(s){var e=s.getPropertyValue("font-feature-settings").includes("ss01"),t=s.getPropertyValue("content"),n=t.replace(pp,""),i=n.codePointAt(0),r=i>=Qu[0]&&i<=Qu[1],a=n.length===2?n[0]===n[1]:!1;return r||a||e}function hS(s,e){var t=s.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(e),i=isNaN(n)?"normal":n;return(ac[t]||{})[i]||oS[t]}function tf(s,e){var t="".concat(Yb).concat(e.replace(":","-"));return new Promise(function(n,i){if(s.getAttribute(t)!==null)return n();var r=Hs(s.children),a=r.filter(function(T){return T.getAttribute(ql)===e})[0],o=wi.getComputedStyle(s,e),l=o.getPropertyValue("font-family"),c=l.match(Qb),h=o.getPropertyValue("font-weight"),u=o.getPropertyValue("content");if(a&&!c)return s.removeChild(a),n();if(c&&u!=="none"&&u!==""){var f=o.getPropertyValue("content"),d=hS(l,h),g=lS(f),v=c[0].startsWith("FontAwesome"),m=cS(o),p=jc(d,g),x=p;if(v){var b=yM(g);b.iconName&&b.prefix&&(p=b.iconName,d=b.prefix)}if(p&&!m&&(!a||a.getAttribute(Bc)!==d||a.getAttribute(Hc)!==x)){s.setAttribute(t,x),a&&s.removeChild(a);var _=ZM(),E=_.extra;E.attributes[ql]=e,ic(p,d).then(function(T){var A=$c(ee(ee({},_),{},{icons:{main:T,mask:op()},prefix:d,iconName:x,extra:E,watchable:!0})),C=yt.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?s.insertBefore(C,s.firstChild):s.appendChild(C),C.outerHTML=A.map(function(y){return Pr(y)}).join(`
`),s.removeAttribute(t),n()}).catch(i)}else n()}else n()})}function uS(s){return Promise.all([tf(s,"::before"),tf(s,"::after")])}function fS(s){return s.parentNode!==document.head&&!~Kb.indexOf(s.tagName.toUpperCase())&&!s.getAttribute(ql)&&(!s.parentNode||s.parentNode.tagName!=="svg")}var dS=function(e){return!!e&&Gd.some(function(t){return e.includes(t)})},pS=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(c){return c.trim()})});var i=ya(n),r;try{for(i.s();!(r=i.n()).done;){var a=r.value;if(dS(a)){var o=Gd.reduce(function(l,c){return l.replace(c,"")},a);o!==""&&o!=="*"&&t.add(o)}}}catch(l){i.e(l)}finally{i.f()}return t};function nf(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(li){var t;if(e)t=s;else if(Ee.searchPseudoElementsFullScan)t=s.querySelectorAll("*");else{var n=new Set,i=ya(document.styleSheets),r;try{for(i.s();!(r=i.n()).done;){var a=r.value;try{var o=ya(a.cssRules),l;try{for(o.s();!(l=o.n()).done;){var c=l.value,h=pS(c.selectorText),u=ya(h),f;try{for(u.s();!(f=u.n()).done;){var d=f.value;n.add(d)}}catch(v){u.e(v)}finally{u.f()}}}catch(v){o.e(v)}finally{o.f()}}catch(v){Ee.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(a.href," (").concat(v.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(v){i.e(v)}finally{i.f()}if(!n.size)return;var g=Array.from(n).join(", ");try{t=s.querySelectorAll(g)}catch{}}return new Promise(function(v,m){var p=Hs(t).filter(fS).map(uS),x=Yc.begin("searchPseudoElements");fp(),Promise.all(p).then(function(){x(),rc(),v()}).catch(function(){x(),rc(),m()})})}}var mS={hooks:function(){return{mutationObserverCallbacks:function(t){return t.pseudoElementsCallback=nf,t}}},provides:function(e){e.pseudoElements2svg=function(t){var n=t.node,i=n===void 0?yt:n;Ee.searchPseudoElements&&nf(i)}}},sf=!1,gS={mixout:function(){return{dom:{unwatch:function(){fp(),sf=!0}}}},hooks:function(){return{bootstrap:function(){Ku(ec("mutationObserverCallbacks",{}))},noAuto:function(){$M()},watch:function(t){var n=t.observeMutationsRoot;sf?rc():Ku(ec("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},rf=function(e){var t={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce(function(n,i){var r=i.toLowerCase().split("-"),a=r[0],o=r.slice(1).join("-");if(a&&o==="h")return n.flipX=!0,n;if(a&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(a){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},t)},vS={mixout:function(){return{parse:{transform:function(t){return rf(t)}}}},hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-transform");return i&&(t.transform=rf(i)),t}}},provides:function(e){e.generateAbstractTransformGrouping=function(t){var n=t.main,i=t.transform,r=t.containerWidth,a=t.iconWidth,o={transform:"translate(".concat(r/2," 256)")},l="translate(".concat(i.x*32,", ").concat(i.y*32,") "),c="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),h="rotate(".concat(i.rotate," 0 0)"),u={transform:"".concat(l," ").concat(c," ").concat(h)},f={transform:"translate(".concat(a/2*-1," -256)")},d={outer:o,inner:u,path:f};return{tag:"g",attributes:ee({},d.outer),children:[{tag:"g",attributes:ee({},d.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:ee(ee({},n.icon.attributes),d.path)}]}]}}}},jo={x:0,y:0,width:"100%",height:"100%"};function af(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return s.attributes&&(s.attributes.fill||e)&&(s.attributes.fill="black"),s}function _S(s){return s.tag==="g"?s.children:[s]}var xS={hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-mask"),r=i?Ja(i.split(" ").map(function(a){return a.trim()})):op();return r.prefix||(r.prefix=Ei()),t.mask=r,t.maskId=n.getAttribute("data-fa-mask-id"),t}}},provides:function(e){e.generateAbstractMask=function(t){var n=t.children,i=t.attributes,r=t.main,a=t.mask,o=t.maskId,l=t.transform,c=r.width,h=r.icon,u=a.width,f=a.icon,d=hM({transform:l,containerWidth:u,iconWidth:c}),g={tag:"rect",attributes:ee(ee({},jo),{},{fill:"white"})},v=h.children?{children:h.children.map(af)}:{},m={tag:"g",attributes:ee({},d.inner),children:[af(ee({tag:h.tag,attributes:ee(ee({},h.attributes),d.path)},v))]},p={tag:"g",attributes:ee({},d.outer),children:[m]},x="mask-".concat(o||zu()),b="clip-".concat(o||zu()),_={tag:"mask",attributes:ee(ee({},jo),{},{id:x,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[g,p]},E={tag:"defs",children:[{tag:"clipPath",attributes:{id:b},children:_S(f)},_]};return n.push(E,{tag:"rect",attributes:ee({fill:"currentColor","clip-path":"url(#".concat(b,")"),mask:"url(#".concat(x,")")},jo)}),{children:n,attributes:i}}}},yS={provides:function(e){var t=!1;wi.matchMedia&&(t=wi.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){var n=[],i={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:ee(ee({},i),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var a=ee(ee({},r),{},{attributeName:"opacity"}),o={tag:"circle",attributes:ee(ee({},i),{},{cx:"256",cy:"364",r:"28"}),children:[]};return t||o.children.push({tag:"animate",attributes:ee(ee({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:ee(ee({},a),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:ee(ee({},i),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:t?[]:[{tag:"animate",attributes:ee(ee({},a),{},{values:"1;0;0;0;0;1;"})}]}),t||n.push({tag:"path",attributes:ee(ee({},i),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:ee(ee({},a),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},bS={hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-symbol"),r=i===null?!1:i===""?!0:i;return t.symbol=r,t}}}},MS=[dM,iS,sS,rS,aS,mS,gS,vS,xS,yS,bS];CM(MS,{mixoutsTo:pn});pn.noAuto;pn.config;pn.library;pn.dom;pn.parse;pn.findIconDefinition;pn.toHtml;var SS=pn.icon;pn.layer;pn.text;pn.counter;var wS={prefix:"fas",iconName:"tree",icon:[448,512,[127794],"f1bb","M224-32c7 0 13.7 3.1 18.3 8.5l136 160c6.1 7.1 7.4 17.1 3.5 25.6S369.4 176 360 176l-24.9 0 75.2 88.5c6.1 7.1 7.4 17.1 3.5 25.6S401.4 304 392 304l-38.5 0 88.8 104.5c6.1 7.1 7.4 17.1 3.5 25.6S433.4 448 424 448l-168 0 0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64-168 0c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L94.5 304 56 304c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L112.9 176 88 176c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6l136-160C210.3-28.9 217-32 224-32z"]},ES={prefix:"fas",iconName:"apple-whole",icon:[448,512,[127822,127823,"apple-alt"],"f5d1","M224 112c-8.8 0-16-7.2-16-16l0-16c0-44.2 35.8-80 80-80l16 0c8.8 0 16 7.2 16 16l0 16c0 44.2-35.8 80-80 80l-16 0zM0 288c0-76.3 35.7-160 112-160 27.3 0 59.7 10.3 82.7 19.3 18.8 7.3 39.9 7.3 58.7 0 22.9-8.9 55.4-19.3 82.7-19.3 76.3 0 112 83.7 112 160 0 128-80 224-160 224-16.5 0-38.1-6.6-51.5-11.3-8.1-2.8-16.9-2.8-25 0-13.4 4.7-35 11.3-51.5 11.3-80 0-160-96-160-224z"]},TS={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"]},AS={prefix:"fas",iconName:"mountain",icon:[512,512,[127956],"f6fc","M256.5 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5-7.2 12.1-20.3 19.5-34.3 19.5l-432 0c-14.1 0-27.1-7.4-34.3-19.5s-7.5-27.1-.8-39.5l216-400 2.9-4.6C231.7 6.2 243.6 0 256.5 0zM170.4 249.9l26.8 26.8c6.2 6.2 16.4 6.2 22.6 0l43.3-43.3c6-6 14.1-9.4 22.6-9.4l42.8 0-72.1-133.5-86.1 159.4z"]},mp={prefix:"fas",iconName:"seedling",icon:[512,512,[127793,"sprout"],"f4d8","M512 32C512 140.1 435.4 230.3 333.6 251.4 325.7 193.3 299.6 141 261.1 100.5 301.2 40 369.9 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 192c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"]},RS={prefix:"fas",iconName:"users",icon:[640,512,[],"f0c0","M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"]},$o={prefix:"fas",iconName:"utensils",icon:[512,512,[127860,61685,"cutlery"],"f2e7","M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"]},CS={prefix:"fas",iconName:"crown",icon:[576,512,[128081],"f521","M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z"]},PS={prefix:"fas",iconName:"box-open",icon:[640,512,[],"f49e","M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"]},of={prefix:"fas",iconName:"wheat-awn",icon:[576,512,["wheat-alt"],"e2cd","M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z"]},IS={prefix:"fas",iconName:"circle-question",icon:[512,512,[62108,"question-circle"],"f059","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm0-336c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]},LS={prefix:"fas",iconName:"fish",icon:[576,512,[128031],"f578","M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8 4.7 9.2 4.7 20.1 0 29.3-14.1 27.4-41.9 66.8-81 99.8-39.2 33.1-92 61.5-155.5 61.5s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9s-12.4-26-5.3-38.6L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},DS={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"]},NS={prefix:"fas",iconName:"rotate-left",icon:[512,512,["rotate-back","rotate-backward","undo-alt"],"f2ea","M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z"]},US={prefix:"fas",iconName:"mug-hot",icon:[576,512,[9749],"f7b6","M152-16c-13.3 0-24 10.7-24 24 0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C183.5 31.7 176 24.1 176 8 176-5.3 165.3-16 152-16zM96 192c-17.7 0-32 14.3-32 32l0 192c0 53 43 96 96 96l192 0c41.8 0 77.4-26.7 90.5-64l5.5 0c70.7 0 128-57.3 128-128S518.7 192 448 192L96 192zM448 384l0-128c35.3 0 64 28.7 64 64s-28.7 64-64 64zM288 8c0-13.3-10.7-24-24-24S240-5.3 240 8c0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C295.5 31.7 288 24.1 288 8z"]},FS={prefix:"fas",iconName:"route",icon:[512,512,[],"f4d7","M512 96c0 50.2-59.1 125.1-84.6 155-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8 6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96 0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8-25.2-27.4-85-97.9-85-148.4 0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};const kS={wood:wS,stone:AS,fish:LS,berry:ES,wheat:of,farm:of,food:$o,people:RS,happy:TS,crest:CS,help:IS,reset:NS,rest:US,carry:PS,full:DS,garden:mp,eat:$o,hungry:$o,search:FS},fn=s=>SS(kS[s]??mp,{attributes:{"aria-hidden":"true"}}).html.join("");class OS{camera=new Ar(-8,8,5,-5,.1,80);element;target=new R(0,.12,0);desiredTarget=new R(0,.12,0);offset=new R;spherical=new lg;right=new R;forward=new R;up=new R(0,1,0);distance=20;clearanceHeight=2.5;setClearance(e){this.clearanceHeight=Math.max(2.2,e+.7)}maxPitch(){return Math.min(1.36,Math.acos(Ye.clamp((this.clearanceHeight-this.target.y)/this.distance,0,.95)))}yaw=Math.PI/4;desiredYaw=Math.PI/4;pitch=.86;desiredPitch=.86;desiredZoom=1;halfHeight=3.5;desiredHalfHeight=3.5;viewportWidth=1280;shiftFraction=0;islandRadius=2.8;islandCenter=new R(0,.3,0);frameIsland(e,t=!1){if(!e.length)return;const n=e.map(r=>r.x),i=e.map(r=>r.z);this.islandCenter.set((Math.min(...n)+Math.max(...n))/2,.3,(Math.min(...i)+Math.max(...i))/2),this.islandRadius=Math.max(...e.map(r=>Math.hypot(r.x-this.islandCenter.x,r.z-this.islandCenter.z)))+2.65,this.distance=Math.max(20,this.islandRadius*3),this.camera.far=this.distance+this.islandRadius*3+40,this.desiredTarget.copy(this.islandCenter),this.resize(this.viewportWidth,this.viewportHeight),t&&(this.target.copy(this.desiredTarget),this.halfHeight=this.desiredHalfHeight,this.applyProjection(),this.applyTransform())}applyProjection(){const e=this.viewportWidth/this.viewportHeight,t=this.shiftFraction*this.halfHeight;Object.assign(this.camera,{left:-this.halfHeight*e,right:this.halfHeight*e,top:this.halfHeight+t,bottom:-this.halfHeight+t}),this.camera.updateProjectionMatrix()}viewportHeight=900;placement=!1;pointer=null;disposed=!1;cleanup=new AbortController;constructor(e){this.element=e,this.camera.zoom=1;const t=this.cleanup.signal;e.addEventListener("pointerdown",this.onPointerDown,{signal:t}),e.addEventListener("pointermove",this.onPointerMove,{signal:t}),e.addEventListener("pointerup",this.onPointerUp,{signal:t}),e.addEventListener("pointercancel",this.onPointerUp,{signal:t}),e.addEventListener("lostpointercapture",this.onPointerUp,{signal:t}),e.addEventListener("wheel",this.onWheel,{passive:!1,signal:t}),e.addEventListener("contextmenu",this.onContextMenu,{signal:t}),window.addEventListener("keydown",this.onKeyDown,{signal:t}),window.addEventListener("blur",this.onBlur,{signal:t}),this.resize(e.clientWidth||1280,e.clientHeight||900),this.applyTransform()}resize(e,t){const n=Math.max(1,e),i=Math.max(1,t),r=n/i,a=n<700?100:85,o=n<700?205:i<760?190:225,l=Math.max(i*.43,i-a-o);this.viewportWidth=n,this.viewportHeight=i,this.desiredHalfHeight=Math.max(this.islandRadius/(r*.9),(this.islandRadius*.68+.61)*i/l),this.shiftFraction=(a-o)/i,this.applyProjection()}update(e){if(this.disposed)return;const t=Math.min(Math.max(e,0),.1),n=1-Math.exp(-11*t),i=1-Math.exp(-12*t);!this.placement&&Math.abs(this.halfHeight-this.desiredHalfHeight)>1e-4&&(this.halfHeight=Ye.lerp(this.halfHeight,this.desiredHalfHeight,n),this.applyProjection()),this.yaw=Ye.lerp(this.yaw,this.desiredYaw,n),this.pitch=Ye.lerp(this.pitch,this.desiredPitch,n),this.target.lerp(this.desiredTarget,n);const r=Ye.lerp(this.camera.zoom,this.desiredZoom,i);Math.abs(r-this.camera.zoom)>1e-6&&(this.camera.zoom=r,this.camera.updateProjectionMatrix()),this.applyTransform()}setPlacement(e){this.placement=e,e&&(this.releasePointer(),this.desiredYaw=this.yaw,this.desiredPitch=this.pitch,this.desiredTarget.copy(this.target),this.desiredZoom=this.camera.zoom)}reset(){this.releasePointer(),this.desiredTarget.copy(this.islandCenter),this.desiredYaw=Math.PI/4,this.desiredPitch=.86,this.desiredZoom=1}dispose(){this.disposed=!0,this.releasePointer(),this.cleanup.abort()}get audioFocus(){return this.target}applyTransform(){this.pitch=Math.min(this.pitch,this.maxPitch());const e=Math.sin(this.pitch),t=Math.cos(this.pitch),n=this.shiftFraction*this.halfHeight-this.halfHeight/this.camera.zoom,i=this.shiftFraction*this.halfHeight+this.halfHeight/this.camera.zoom,r=Math.max(this.distance,(-.18+.6-this.target.y-n*e)/t);this.spherical.set(r,this.pitch,this.yaw);const a=r+(Math.abs(i)+Math.abs(n))/t+this.islandRadius*3+40;Math.abs(this.camera.far-a)>.01&&(this.camera.far=a,this.camera.updateProjectionMatrix()),this.offset.setFromSpherical(this.spherical),this.camera.position.copy(this.target).add(this.offset),this.camera.lookAt(this.target),this.camera.updateMatrixWorld()}onPointerDown=e=>{this.placement||e.pointerType==="touch"||e.button!==1&&e.button!==2||e.target instanceof HTMLElement&&e.target.closest("button, input, dialog, [data-card]")||(e.preventDefault(),this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,pan:e.button===1||e.shiftKey},this.element.setPointerCapture(e.pointerId),this.element.style.cursor="grabbing")};onPointerMove=e=>{if(!this.pointer||e.pointerId!==this.pointer.id)return;const t=e.clientX-this.pointer.x,n=e.clientY-this.pointer.y;if(this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.pan){const i=2*this.halfHeight/(this.viewportHeight*this.desiredZoom);this.right.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),this.forward.crossVectors(this.up,this.right),this.desiredTarget.addScaledVector(this.right,-t*i*.8),this.desiredTarget.addScaledVector(this.forward,n*i*.8);const r=Math.hypot(this.desiredTarget.x-this.islandCenter.x,this.desiredTarget.z-this.islandCenter.z);r>.85&&(this.desiredTarget.x=this.islandCenter.x+(this.desiredTarget.x-this.islandCenter.x)*.85/r,this.desiredTarget.z=this.islandCenter.z+(this.desiredTarget.z-this.islandCenter.z)*.85/r)}else this.desiredYaw-=t*.0035,this.desiredPitch=Ye.clamp(this.desiredPitch-n*.0025,.48,this.maxPitch())};onPointerUp=e=>{this.pointer?.id===e.pointerId&&this.releasePointer()};releasePointer(){const e=this.pointer;this.pointer=null,e&&this.element.hasPointerCapture(e.id)&&this.element.releasePointerCapture(e.id),this.element.style.cursor=""}onWheel=e=>{if(e.preventDefault(),this.placement)return;const t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?this.viewportHeight:1);this.desiredZoom=Ye.clamp(this.desiredZoom*Math.exp(-t*.001),.7,3.5)};onContextMenu=e=>e.preventDefault();onBlur=()=>this.releasePointer();onKeyDown=e=>{e.key.toLowerCase()!=="h"||e.ctrlKey||e.altKey||e.metaKey||this.placement||document.querySelector("dialog[open]")||e.target instanceof HTMLElement&&(e.target.isContentEditable||e.target.closest("input, textarea, select"))||this.reset()}}const Oa=.45,zi=1.5,ha=1.05,Zs=1.85;function Sn(s,e,t){const n=Math.max(0,Math.min(1,(s-e)/(t-e)));return n*n*(3-2*n)}const Kc=.1,Zc=1.25,gp=1.4,st=.13,wn=-.18,zS=new fe("#80ac71"),BS=new fe("#b8c982");function HS(s,e,t){const n=.5+.23*Math.sin(s*.94+e*.47)+.16*Math.cos(e*1.27-s*.52)+.09*Math.sin(s*1.8-e*.98);return t.copy(zS).lerp(BS,Ye.smoothstep(n,.1,.9))}const oc=ni*Math.cos(Math.PI/6);function Sa(s,e){const t=tn(s).map(u=>!e.has(u));function n(u,f,d){const g=(u+5)%6,v=u%6,m=g*Math.PI/3,p=v*Math.PI/3,x=oc+(t[g]?f:0),b=oc+(t[v]?f:0),_=Math.sin(p-m);return new R((x*Math.sin(p)-b*Math.sin(m))/_,d,(Math.cos(m)*b-Math.cos(p)*x)/_)}const i=rt(s),r=[],a=[],o=(u,f,d,g,v=1)=>{const m=new fe(g).multiplyScalar(v);for(const p of[u,f,d])r.push(p.x,p.y,p.z),(g===10795903||g===9546604)&&(HS(i.x+p.x,i.z+p.z,m),p.y<st&&m.multiplyScalar(.89)),a.push(m.r,m.g,m.b)},l=[[-.095,st],[-.035,.074],[.05,-.016],[.15,-.16],[.28,-.37],[.42,-.58]],c=[9546604,11057024,14469014,15257502,14140311];for(let u=0;u<6;u++){const f=l.map(([d,g])=>{const v=n(u,d,g),m=n(u+1,d,g);return Array.from({length:5},(p,x)=>{const b=x/4,_=v.clone().lerp(m,b);if(t[u]&&x>0&&x<4){const E=.025*Math.sin(s*.61+u*2.8+b*Math.PI*2)*Math.sin(b*Math.PI);_.x+=Math.cos(u*Math.PI/3)*E,_.z+=Math.sin(u*Math.PI/3)*E}return _})});for(let d=0;d<4;d++)if(o(new R(0,st,0),f[0][d+1],f[0][d],10795903,1+.009*Math.sin(u+d+s)),!!t[u])for(let g=0;g<l.length-1;g++){const[v,m,p,x]=[f[g][d],f[g][d+1],f[g+1][d],f[g+1][d+1]],b=1+.035*Math.sin(s+u*1.7+d);o(v,m,p,c[g],b),o(p,m,x,c[g],b+.01)}}const h=new wt;return h.setAttribute("position",new qe(r,3)),h.setAttribute("color",new qe(a,3)),h.computeVertexNormals(),h}const vp={value:0};function VS(s,e=()=>!1){const t=new Pe,n=rt(s);t.position.set(n.x,st,n.z);const i=[],r=[];function a(h,u){i.push(...h);const f=new fe(u);for(let d=0;d<3;d++)r.push(f.r,f.g,f.b)}const o=[];for(let h=0;h<500&&o.length<55;h++){const u=(Math.random()-.5)*1.8,f=(Math.random()-.5)*1.8;Array.from({length:6},(d,g)=>u*Math.cos(g*Math.PI/3)+f*Math.sin(g*Math.PI/3)).some(d=>d>oc-.19)||e(u,f)||o.some(d=>Math.hypot(d.x-u,d.z-f)<.075)||o.push({x:u,z:f})}for(let h=0;h<o.length;h++){const{x:u,z:f}=o[h],d=p=>{const x=Math.sin(s*17.31+h*71.13+p*29.7)*43758.5453;return x-Math.floor(x)},g=3+Math.floor(d(0)*4),v=d(1)*Math.PI*2,m=[7575134,8824939,10205563,11651210,8365420];for(let p=0;p<g;p++){const x=v+(d(p+2)-.5)*2.4,b=Math.cos(x),_=Math.sin(x),E=u+(d(p+20)-.5)*.06,T=f+(d(p+40)-.5)*.06,A=.035+d(p+60)*.07,C=.009+d(p+80)*.008,y=.012+d(p+100)*.035,S=E+b*y*.3,I=T+_*y*.3,F=E+b*y,z=T+_*y,V=m[Math.floor(d(p+120)*m.length)];a([E-_*C,.004,T+b*C,E+_*C,.004,T-b*C,S+_*C*.55,A*.55,I-b*C*.55],V),a([E-_*C,.004,T+b*C,S+_*C*.55,A*.55,I-b*C*.55,S-_*C*.55,A*.55,I+b*C*.55],V),a([S-_*C*.55,A*.55,I+b*C*.55,S+_*C*.55,A*.55,I-b*C*.55,F,A,z],V)}}const l=new wt;l.setAttribute("position",new qe(i,3)),l.setAttribute("color",new qe(r,3)),l.computeVertexNormals();const c=new Dc({vertexColors:!0,side:Gt});return c.onBeforeCompile=h=>{h.uniforms.grassTime=vp,h.vertexShader=`uniform float grassTime;
`+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
    float phase=position.x*31.0+position.z*23.0;
    float bend=sin(grassTime*1.8+phase)*0.18+sin(grassTime*2.7+phase*1.7)*0.09;
    transformed.x+=bend*position.y;transformed.z+=cos(grassTime*1.6+phase)*position.y*0.12;`)},c.customProgramCacheKey=()=>"meadow-wind",t.add(new He(l,c)),t}const mi=7,lf=3.8,Vt=256,wa=(s,e,t)=>{const n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)};class cf{pixels=new Uint8Array(Vt*Vt*4);texture=new Va(this.pixels,Vt,Vt,sn);region=new nt;constructor(){this.texture.minFilter=this.texture.magFilter=Kt,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}rebuild(e,t,n){const i=t.flatMap(g=>[g.ax,g.bx]),r=t.flatMap(g=>[g.az,g.bz]),a=n?.x??Math.min(...i)-mi,o=n?.y??Math.min(...r)-mi;n?this.region.copy(n):this.region.set(a,o,Math.max(...i)-a+mi,Math.max(...r)-o+mi);const l=t.map(g=>{const v=g.bx-g.ax,m=g.bz-g.az;return{...g,dx:v,dz:m,inv:1/(v*v+m*m)}}),c=this.region.z/Vt,h=this.region.w/Vt,u=16,f=Math.hypot(c,h)*u*.5;function d(g,v,m){const p=v-g.ax,x=m-g.az,b=Math.max(0,Math.min(1,(p*g.dx+x*g.dz)*g.inv)),_=p-b*g.dx,E=x-b*g.dz;return _*_+E*E}for(let g=0;g<Vt;g+=u)for(let v=0;v<Vt;v+=u){const m=a+(v+u/2)*c,p=o+(g+u/2)*h,x=l.map(E=>d(E,m,p)),b=Math.min(mi+f,Math.sqrt(Math.min(...x))+2*f),_=l.filter((E,T)=>x[T]<=b*b);for(let E=g;E<g+u;E++)for(let T=v;T<v+u;T++){const A=a+(T+.5)*c,C=o+(E+.5)*h;let y=mi*mi;for(const j of _)y=Math.min(y,d(j,A,C));const S=Math.sqrt(y)*(e.has(Xt(A,C))?-1:1),I=.5+.25*Math.sin(A*.79+C*.36)+.18*Math.cos(C*.94-A*.51)+.07*Math.sin(A*1.41-C*.88),F=wa(.18,2.2+2.3*I,S),z=.31+.23*wa(.24,1.65,S)+F*(1.15+.43*(1-I))+1.55*wa(2.9,6.9,S),V=Math.round(65535*Math.max(0,Math.min(1,(S+1)/(mi+1)))),W=(E*Vt+T)*4;this.pixels[W]=V>>8,this.pixels[W+1]=V&255,this.pixels[W+2]=Math.round(255*Math.min(z/lf,1)),this.pixels[W+3]=255}}this.texture.needsUpdate=!0}depthAt(e,t){const n=Math.max(0,Math.min(Vt-1,(e-this.region.x)/this.region.z*Vt-.5)),i=Math.max(0,Math.min(Vt-1,(t-this.region.y)/this.region.w*Vt-.5)),r=Math.floor(n),a=Math.floor(i),o=Math.min(r+1,Vt-1),l=Math.min(a+1,Vt-1),c=(h,u)=>this.pixels[(u*Vt+h)*4+2]*lf/255;return Ye.lerp(Ye.lerp(c(r,a),c(o,a),n-r),Ye.lerp(c(r,l),c(o,l),n-r),i-a)}}function GS(){const t=new Uint8Array(589824);let n=70816;const i=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),r=Array.from({length:64},()=>[.15+.7*i(),.15+.7*i()]),a=2*Math.PI;for(let l=0;l<384;l++)for(let c=0;c<384;c++){const h=(c+.5)/384,u=(l+.5)/384,f=h*8,d=u*8,g=Math.floor(f),v=Math.floor(d);let m=10,p=10,x=10;for(let _=-1;_<=1;_++)for(let E=-1;E<=1;E++){const T=r[(v+_+8)%8*8+(g+E+8)%8],A=g+E+T[0]-f,C=v+_+T[1]-d,y=A*A+C*C;y<m?(x=p,p=m,m=y):y<p?(x=p,p=y):y<x&&(x=y)}const b=(l*384+c)*4;t[b]=255*Math.min(1,Math.sqrt(p)-Math.sqrt(m)),t[b+1]=255*(1-wa(.015,.35,Math.sqrt(x)-Math.sqrt(m))),t[b+2]=255*(.5+.21*Math.sin(a*(2*h+u)+.9*Math.sin(a*u))+.16*Math.cos(a*(h-2*u))+.09*Math.sin(a*(3*u-h)+.7)),t[b+3]=255*(.5+.22*Math.cos(a*(u-h)+.7*Math.cos(a*h))+.14*Math.sin(a*(h+2*u)+1.3)+.09*Math.cos(a*(3*h+u)))}const o=new Va(t,384,384,sn);return o.wrapS=o.wrapT=Vi,o.minFilter=zn,o.magFilter=Kt,o.generateMipmaps=!0,o.needsUpdate=!0,o}const _p=`
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
`,xp=`
vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8), d=vec2(5.2,2.1);
  float pa=dot(p,a)-uTime*1.05, pb=dot(p,b)+uTime*.81;
  float pc=dot(p,c)-uTime*1.47, pd=dot(p,d)+uTime*1.92;
  float height=.027*sin(pa)+.016*sin(pb)+.007*sin(pc)+.003*sin(pd);
  vec2 gradient=.027*cos(pa)*a+.016*cos(pb)*b+.007*cos(pc)*c+.003*cos(pd)*d;
  return vec3(height,gradient);
}
`,WS=`
uniform float uTime;
`+xp+`
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=seaWave(p).x;
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`,XS=_p+xp+`
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
}`,jS=`
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
`,Fn=100,hf=Ye.lerp;class $S{root=new Pe;field=new cf;previousField=new cf;previousBoard=new Map;transitionAt=-10;transitionStart=Oa;transitionEnd=zi;pendingEdges=null;uniforms={uWakes:{value:Array.from({length:12},()=>new nt(0,0,-10,0))},uWakeDirs:{value:Array.from({length:12},()=>new nt(1,0,0,0))},uCoastMix:{value:1},uPreviousCoast:{value:this.previousField.texture},uTime:{value:0},uLight:{value:GS()},uCoast:{value:this.field.texture},uRegion:{value:this.field.region},uLanding:{value:new R(0,0,-10)},uMint:{value:new fe("#87efd4")},uTurquoise:{value:new fe("#20d0c6")},uLagoon:{value:new fe("#22b7c7")},uDeep:{value:new fe("#318fc4")}};viewCorner=new R;viewDirection=new R;fitView(e){if(e.getWorldDirection(this.viewDirection),this.viewDirection.y>=-.01)return;let t=1/0,n=-1/0,i=1/0,r=-1/0;for(const a of[-1,1])for(const o of[-1,1]){const l=this.viewCorner.set(a,o,-1).unproject(e);l.addScaledVector(this.viewDirection,(wn-l.y)/this.viewDirection.y),t=Math.min(t,l.x),n=Math.max(n,l.x),i=Math.min(i,l.z),r=Math.max(r,l.z)}this.surface.position.set((t+n)/2,wn,(i+r)/2),this.surface.scale.set(Math.max(1,(n-t+16)/160),Math.max(1,(r-i+16)/160),1)}nextWake=0;sandGeometry=new Xi(1,1,Fn,Fn).rotateX(-Math.PI/2);sandStart=new qe(new Float32Array((Fn+1)**2),1);sandStartTint=new qe(new Float32Array((Fn+1)**2*3),3);sandTint=new qe(new Float32Array((Fn+1)**2*3),3);stones;surface;silhouettes=new Er(1,0);constructor(){const e=new He(new Xi(160,160,180,180),new ri({uniforms:this.uniforms,vertexShader:WS,fragmentShader:XS,transparent:!0,depthWrite:!1,toneMapped:!1}));this.surface=e,e.rotation.x=-Math.PI/2,e.position.y=wn,e.renderOrder=2,this.sandGeometry.setAttribute("color",this.sandTint),this.sandGeometry.setAttribute("aBedStart",this.sandStart),this.sandGeometry.setAttribute("aTintStart",this.sandStartTint);const t=new He(this.sandGeometry,this.receiver(!0));t.receiveShadow=!0,this.stones=new Rc(this.silhouettes,this.receiver(!1),192),this.stones.count=0,this.stones.receiveShadow=!0,this.root.add(t,this.stones,e)}receiver(e){const t=new Dc({color:16777215,vertexColors:e,transparent:e,depthWrite:!e});return t.onBeforeCompile=n=>{n.uniforms.uLight=this.uniforms.uLight,n.uniforms.uTime=this.uniforms.uTime,n.uniforms.uWakes=this.uniforms.uWakes,n.uniforms.uWakeDirs=this.uniforms.uWakeDirs,n.uniforms.uLanding=this.uniforms.uLanding,n.vertexShader=`varying vec3 vReceiver;
`+n.vertexShader,e&&(n.uniforms.uCoastMix=this.uniforms.uCoastMix,n.vertexShader=`uniform float uCoastMix;
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
`+_p+`
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
`+jS+(e?`
diffuseColor.a *= 1. - smoothstep(.65, 1.65, max(0., -.18-vReceiver.y));`:""))},t.customProgramCacheKey=()=>e?"lagoon-sand-disturbance-v3":"lagoon-rock-disturbance-v3",t}sync(e,t,n,i=-1){this.field.rebuild(e,t),this.surface.position.x=this.field.region.x+this.field.region.z/2,this.surface.position.z=this.field.region.y+this.field.region.w/2,this.surface.scale.setScalar(Math.max(1,this.field.region.z/70,this.field.region.w/70));const r=n>=0?n:i,a=r>=0&&this.previousBoard.size>0;if(this.transitionStart=i>=0?Kc:Oa,this.transitionEnd=i>=0?Zc:zi,this.previousField.rebuild(a?this.previousBoard:e,a?fa(this.previousBoard):t,this.field.region),this.uniforms.uCoastMix.value=a?0:1,this.transitionAt=a?this.uniforms.uTime.value:-10,this.shapeBed(),a?this.pendingEdges=t:(this.placeStones(t),this.pendingEdges=null),this.previousBoard=new Map(e),r>=0){const o=rt(r);this.uniforms.uLanding.value.set(o.x,o.z,this.uniforms.uTime.value)}else this.uniforms.uLanding.value.z=-10}shapeBed(){const e=this.field.region,t=this.sandGeometry.getAttribute("position"),n=new fe("#d4cc9e"),i=new fe("#79b8aa"),r=new fe("#467f87"),a=new fe;for(let o=0;o<=Fn;o++)for(let l=0;l<=Fn;l++){const c=e.x+e.z*l/Fn,h=e.y+e.w*o/Fn,u=o*(Fn+1)+l,f=this.field.depthAt(c,h),d=this.previousField.depthAt(c,h);this.sandStart.setX(u,wn-d),a.copy(n).lerp(i,Ye.smoothstep(d,.28,1.1)).lerp(r,Ye.smoothstep(d,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+h*.83)+.02*Math.cos(c*1.88-h*3.2)),this.sandStartTint.setXYZ(u,a.r,a.g,a.b),t.setXYZ(u,c,wn-f,h),a.copy(n).lerp(i,Ye.smoothstep(f,.28,1.1)).lerp(r,Ye.smoothstep(f,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+h*.83)+.02*Math.cos(c*1.88-h*3.2)),this.sandTint.setXYZ(u,a.r,a.g,a.b)}t.needsUpdate=!0,this.sandTint.needsUpdate=!0,this.sandStart.needsUpdate=!0,this.sandStartTint.needsUpdate=!0,this.sandGeometry.computeVertexNormals(),this.sandGeometry.computeBoundingSphere()}placeStones(e){const t=new _t,n=new fe("#99a590"),i=new fe("#467c85"),r=new fe;let a=0;for(const o of e){let l=Math.imul(o.id+1,127)+o.side*317;const c=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296),h=.18+c()*.64,u=.43+c()*.51,f=Math.cos(o.side*Math.PI/3),d=Math.sin(o.side*Math.PI/3),g=.075+c()*.074,v=c()<.33?1:3;for(let m=0;m<v&&a<this.stones.instanceMatrix.count;m++){const p=h+(c()-.5)*.25,x=u+m*.075,b=hf(o.ax,o.bx,p)+f*x,_=hf(o.az,o.bz,p)+d*x,E=this.field.depthAt(b,_),T=g/(1+m*.64);t.position.set(b,wn-E+T*.25,_),t.rotation.set(c()*.32,c()*6.28,c()*.26),t.scale.set(T*(1.25+c()*.45),T*(.6+c()*.18),T),t.updateMatrix(),this.stones.setMatrixAt(a,t.matrix),r.copy(n).lerp(i,Ye.smoothstep(E,.31,1.03)*.84+.09).multiplyScalar(.88+c()*.2),this.stones.setColorAt(a++,r)}}this.stones.count=a,this.stones.instanceMatrix.needsUpdate=!0,this.stones.instanceColor&&(this.stones.instanceColor.needsUpdate=!0),this.stones.computeBoundingSphere()}stir(e,t,n,i,r,a){const o=this.nextWake;this.nextWake=(o+1)%12,this.uniforms.uWakes.value[o].set(e,t,this.uniforms.uTime.value,.15+.85*r),this.uniforms.uWakeDirs.value[o].set(n,i,Math.min(a,1.2),(this.uniforms.uTime.value*1.37+o*.618)%1)}clearWakes(){for(const e of this.uniforms.uWakes.value)e.set(0,0,-10,0)}update(e){this.uniforms.uTime.value=e,this.uniforms.uCoastMix.value=Sn(e-this.transitionAt,this.transitionStart,this.transitionEnd),this.pendingEdges&&this.uniforms.uCoastMix.value>=1&&(this.placeStones(this.pendingEdges),this.pendingEdges=null)}}function yp(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new wt;let c=0;for(let h=0;h<s.length;++h){const u=s[h];let f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0;const u=[];for(let f=0;f<s.length;++f){const d=s[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=s[f].attributes.position.count}l.setIndex(u)}for(const h in r){const u=uf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][f]);const g=uf(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function uf(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new kt(a,t,n);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<t;g++){const v=h.getComponent(f,g);o.setComponent(f+u,g,v)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function ff(s,e){if(e===_m)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Ol||e===kf){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===Ol)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}const Yo=new Map,Ms=new Map;function YS(s){return Yo.has(s)||Yo.set(s,new Gn({color:s,roughness:.95,flatShading:!0})),Yo.get(s)}function at(s,e,t,n=0,i=0,r=0){const a=new He(e,YS(t));return a.position.set(n,i,r),a.castShadow=!0,a.receiveShadow=!0,s.add(a),a}function ke(s,e,t,n,i,r,a,o){const l=`b${r},${a},${o}`;return Ms.has(l)||Ms.set(l,new Fs(r,a,o)),at(s,Ms.get(l),e,t,n,i)}function vt(s,e,t,n,i,r){const a=`s${r}`;return Ms.has(a)||Ms.set(a,new Er(r,0)),at(s,Ms.get(a),e,t,n,i)}function cr(s,e,t,n=0,i=1){const r=new Pe;r.position.set(e,0,t),r.scale.setScalar(i),s.add(r);const a=n%10,o=.65+a%3*.1;at(r,new It(.035,.065,o,6),a%2?8413252:7360823,0,o/2,0);const l=[4683098,7575146,5670248,9152110,3761744,6788189,6654069,9742960,5011794,8232281];if(a<4)for(let c=0;c<3+a%2;c++)at(r,new dn(.29-c*.047,.46,6+a),l[(a+c)%10],0,o*.65+c*.2,0);else if(a<8)for(let c=0;c<4;c++){const h=c*2.4,u=vt(r,l[(a+c)%10],Math.cos(h)*.15,o+.12+c*.065,Math.sin(h)*.13,.26+a%2*.035);u.scale.y=a===7?1.5:1}else for(let c=0;c<3;c++)vt(r,l[a],(c-1)*.13,o+c*.17,0,.25).scale.set(.85,1.3,.85)}let Js;function bp(){if(Js)return Js.clone();const s=new Pe;for(let t=0;t<3;t++){const n=new Pe,i=.31+t*.025,r=(t-1)*.13;n.position.set((t-1)*.033,0,t%2*.022),n.rotation.z=r,s.add(n),at(n,new It(.0035,.005,i,5),12887381,0,i/2,0);for(let o=0;o<2;o++){const l=o?1:-1,c=i*(.36+o*.2),h=new wt;h.setAttribute("position",new qe([0,c,0,l*.052,c+.035,.013,l*.075,c+.022,0,0,c,0,l*.075,c+.022,0,l*.052,c+.035,-.013],3)),h.computeVertexNormals();const u=at(n,h,o?13350505:10984528);u.material.side=Gt}for(let o=0;o<5;o++)for(const l of[-1,1]){const c=i-.01+o*.022,h=(o%2-.5)*.009,u=.011*(1-o*.09),f=vt(n,l<0?14859101:15782268,l*.011,c,h,.018);f.scale.set(u/.018,1.25,.65),f.rotation.z=-l*.48;const d=at(n,new It(8e-4,.0014,.047,3),15126156,l*.021,c+.03,h);d.rotation.z=-l*.33}const a=at(n,new dn(.008,.04,5),15321449,0,i+.112,0);a.rotation.z=-.06}s.updateMatrixWorld(!0);const e=new Map;s.traverse(t=>{if(t instanceof He){const n=t.material;e.has(n)||e.set(n,[]),e.get(n).push(t.geometry.clone().applyMatrix4(t.matrixWorld))}}),Js=new Pe;for(const[t,n]of e){const i=yp(n,!1);if(n.forEach(r=>r.dispose()),i){const r=new He(i,t);r.castShadow=!0,r.receiveShadow=!0,Js.add(r)}}return Js.clone()}const df=new Map;function Mp(s){const e=df.get(s);if(e)return e.clone();const t=new Pe;if(s==="wood")for(let n=0;n<3;n++){const i=new Pe;i.position.set((n%2-.5)*.065,.035+Math.floor(n/2)*.058,0),t.add(i);const r=at(i,new It(.035,.035,.22,8),8937532);r.rotation.x=Math.PI/2;for(const a of[-.112,.112]){const o=at(i,new wr(.028,8),14070140,0,0,a);o.rotation.y=a<0?Math.PI:0}}else if(s==="fish")for(let n=0;n<2;n++){const i=new Pe;i.position.set((n-.5)*.065,.035,0),vt(i,9419199,0,0,0,.065).scale.set(.45,.5,1.4);const a=at(i,new dn(.034,.052,3),5803675,0,0,-.1);a.rotation.x=Math.PI/2,vt(i,2374715,.022,.014,.055,.008),t.add(i)}else if(s==="wheat"){const n=bp();n.scale.setScalar(.55),n.position.y=-.025,n.rotation.z=.22,t.add(n);const i=at(t,new Lc(.026,.005,4,8),10254672,0,.07,0);i.rotation.x=Math.PI/2}else if(s==="berry")for(let n=0;n<6;n++){const i=(n%3-1)*.048,r=(Math.floor(n/3)-.5)*.055,a=vt(t,14048595,i,.032,r,.034);a.scale.y=1.15,at(t,new dn(.026,.018,5),6196554,i,.072,r)}else if(s==="stone")for(let n=0;n<3;n++)vt(t,9938592,(n%2-.5)*.065,.035+Math.floor(n/2)*.045,0,.052);else for(let n=0;n<3;n++)ke(t,7245904,(n-1)*.04,.05,0,.01,.13,.01),vt(t,15188108,(n-1)*.04,.12,0,.03);return df.set(s,t),t.clone()}function Jc(s,e){for(let t=-.45;t<=.46;t+=.3)ke(s,12363130,t,.17,e,.045,.34,.045);for(let t=.13;t<.3;t+=.13)ke(s,13481612,0,t,e,.95,.035,.035)}function qS(s,e=!1,t=!1,n=!1){let i=e?.83:.64,r=e?.7:.48,a=.62;ke(s,10718573,0,.06,0,i+.08,.12,a+.08),ke(s,n?11898459:15851448,0,r/2+.1,0,i,r,a);for(let d of[-i/2,i/2])ke(s,8807237,d,r/2+.1,.32,.045,r,.025);ke(s,8807237,0,.2,.325,.16,.32,.035),ke(s,13083501,.025,.19,.35,.02,.025,.025);for(let d of[-.22,.22])ke(s,8873281,d,.42,.322,.16,.17,.035),ke(s,9549746,d,.42,.345,.115,.12,.02),ke(s,15063216,d,.42,.36,.018,.13,.015);let o=new wt,l=i/2+.12,c=a/2+.1,h=r+.1,u=h+.38;o.setAttribute("position",new qe([-l,h,-c,l,h,-c,0,u,-c,-l,h,c,0,u,c,l,h,c,-l,h,-c,0,u,-c,0,u,c,-l,h,-c,0,u,c,-l,h,c,l,h,-c,l,h,c,0,u,c,l,h,-c,0,u,c,0,u,-c],3)),o.computeVertexNormals();const f=at(s,o,t?6125944:n?9860693:12218449);f.material.side=Gt,ke(s,14930868,.2,u-.06,-.12,.13,.4,.13),ke(s,10259058,.2,u+.15,-.12,.17,.06,.17);for(let d=0;d<3;d++)ke(s,7886140,-.27+d*.24,.11,.48,.19,.035,.16);if(t)for(let d=0;d<4;d++){let g=at(s,new It(.075,.075,.46,7),10451532,.43,.1+d%2*.13,-.16+Math.floor(d/2)*.18);g.rotation.x=Math.PI/2}if(n)for(let d of[-.38,.38])ke(s,11834206,d,.16,.43,.2,.3,.2),ke(s,7559999,d,.17,.535,.22,.03,.02);vt(s,7705943,-.43,.13,.32,.16)}function KS(s){let e=new Pe;if(s==="forest")cr(e,-.23,-.2,0,.88),cr(e,.23,-.03,1,.79),cr(e,-.08,.27,2,.7);else if(s==="house"||s==="manor"||s==="lumber"||s==="store")qS(e,s==="manor",s==="lumber",s==="store");else if(s==="berry"||s==="farm"){for(let t of[-.3,0,.3]){ke(e,8478788,0,.035,t,.9,.065,.18);for(let n=-.34;n<.4;n+=.17)if(s==="berry"){vt(e,6261068,n,.15,t,.12);for(let i=0;i<2;i++)vt(e,12737360,n+(i-.5)*.07,.24,t,.037)}else for(let i=0;i<3;i++){let r=n+(i-1)*.035;ke(e,11836752,r,.2,t,.014,.35,.014),at(e,new dn(.035,.14,4),15124342,r,.4,t)}}Jc(e,-.49),s==="farm"&&(ke(e,10652498,.4,.2,.4,.12,.4,.1),ke(e,14206358,.4,.35,.4,.34,.12,.1))}else if(s==="garden"){at(e,new It(.28,.32,.12,10),12105120,0,.07,0),at(e,new It(.22,.22,.04,12),8302517,0,.15,0),at(e,new It(.05,.08,.28,8),13157033,0,.25,0),vt(e,13554357,0,.42,0,.09);for(let t=0;t<8;t++){let n=t/8*Math.PI*2;vt(e,6785362,Math.cos(n)*.4,.12,Math.sin(n)*.4,.13),vt(e,t%2?14659206:15259562,Math.cos(n)*.4,.24,Math.sin(n)*.4,.055)}}else if(s==="festival"){for(let t of[-.35,.35])ke(e,9135944,t,.4,0,.04,.8,.04);ke(e,14203504,0,.73,0,.75,.035,.035);for(let t=0;t<5;t++)at(e,new dn(.08,.18,3),t%2?11034965:14993274,-.28+t*.14,.64,0)}else for(let t=0;t<3;t++)vt(e,13018989,(t-1)*.2,.18,0,.2),ke(e,8162641,(t-1)*.2,.36,0,.04,.15,.04);return e}const en=new Map;function ZS(){const s=new Pe;let e=0;for(const t of[-.3,0,.3]){ke(s,8478788,0,.035,t,.9,.065,.18);for(let n=-.34;n<.4;n+=.17){const i=new Pe;i.position.set(n,.065,t),i.userData.plantOrder=e++,vt(i,6261068,0,.085,0,.12);for(let r=0;r<2;r++)vt(i,12737360,(r-.5)*.07,.175,0,.037);s.add(i)}}return Jc(s,-.49),s}function JS(){const s=new Pe;let e=0;for(const t of[-.3,0,.3]){ke(s,8478788,0,.022,t,.9,.044,.17);for(let n=-.34;n<.4;n+=.14){const i=bp();i.position.set(n+Math.sin(e*7)*.012,.025,t+Math.cos(e*5)*.014),i.userData.cropOrder=e++,i.userData.cropHeight=.9+e%5*.045,i.scale.y=i.userData.cropHeight,i.rotation.y=e*2.399,s.add(i)}}return Jc(s,-.49),s}function QS(){const s=new Pe;at(s,new It(.28,.32,.12,10),12105120,0,.07,0),at(s,new It(.22,.22,.04,12),8302517,0,.15,0),at(s,new It(.05,.08,.28,8),13157033,0,.25,0),vt(s,13554357,0,.42,0,.09);for(let e=0;e<8;e++){const t=e/8*Math.PI*2,n=new Pe;n.position.set(Math.cos(t)*.4,0,Math.sin(t)*.4),n.userData.flowerOrder=e,vt(n,6785362,0,.12,0,.13),vt(n,e%2?14659206:15259562,0,.24,0,.055),s.add(n)}return s}function ew(){const s=new Pe;ke(s,8808269,0,.04,-.22,.62,.08,.59),ke(s,14009496,0,.29,-.24,.48,.5,.42);const e=at(s,new dn(.46,.34,4),6720913,0,.68,-.24);e.rotation.y=Math.PI/4,ke(s,7888455,0,.22,-.01,.15,.34,.025),ke(s,9222576,-.15,.39,-.015,.12,.13,.025);for(let t=0;t<12;t++)ke(s,t%2?11836016:13283716,0,.025,.25+t*.095,.39,.045,.087);for(const t of[-.15,.15])for(const n of[.45,1.15])ke(s,8547410,t,-.18,n,.045,.43,.045);return at(s,new It(.095,.075,.15,8),8362387,.28,.1,.13),ke(s,13219727,-.27,.14,.03,.13,.25,.15),s}function Ea(s){if(s==="stone"){if(!en.has(s)){const t=new Pe;for(let n=0;n<3;n++){const i=new Pe;i.userData.treeIndex=n,i.position.set([-.27,.24,0][n],0,[-.18,-.1,.29][n]),vt(i,[9214617,10858405,8162955][n],0,.13,0,.23).scale.set(1,.85,1.05),vt(i,13091748,.08,.23,.05,.055),t.add(i)}en.set(s,t)}return en.get(s).clone()}if(s==="garden")return en.has(s)||en.set(s,QS()),en.get(s).clone();if(s==="fisher"||s==="farm")return en.has(s)||en.set(s,s==="fisher"?ew():JS()),en.get(s).clone();if(s==="forest"){const t=new Pe,n=Math.random()*Math.PI*2;for(let i=0;i<3;i++){const r=n+i*Math.PI*2/3+(Math.random()-.5)*.32,a=.4+Math.random()*.1;cr(t,Math.cos(r)*a,Math.sin(r)*a,Math.floor(Math.random()*10),.66+Math.random()*.17),t.children[i].userData.treeIndex=i}return t}if(s==="berry")return en.has(s)||en.set(s,ZS()),en.get(s).clone();let e=en.get(s);if(!e){const t=KS(s);t.updateMatrixWorld(!0);const n=new Map;t.traverse(i=>{if(!(i instanceof He))return;const r=i.material,a=i.geometry.clone().applyMatrix4(i.matrixWorld);n.has(r)||n.set(r,[]),n.get(r).push(a)}),e=new Pe;for(const[i,r]of n){const a=yp(r,!1);if(r.forEach(l=>l.dispose()),!a)continue;const o=new He(a,i);o.castShadow=!0,o.receiveShadow=!0,e.add(o)}en.set(s,e)}return e.clone()}class tw extends zs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new aw(t)}),this.register(function(t){return new ow(t)}),this.register(function(t){return new gw(t)}),this.register(function(t){return new vw(t)}),this.register(function(t){return new _w(t)}),this.register(function(t){return new cw(t)}),this.register(function(t){return new hw(t)}),this.register(function(t){return new uw(t)}),this.register(function(t){return new fw(t)}),this.register(function(t){return new rw(t)}),this.register(function(t){return new dw(t)}),this.register(function(t){return new lw(t)}),this.register(function(t){return new mw(t)}),this.register(function(t){return new pw(t)}),this.register(function(t){return new iw(t)}),this.register(function(t){return new xw(t)}),this.register(function(t){return new yw(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ar.extractUrlBase(e);a=ar.resolveURL(c,this.path)}else a=ar.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new td(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Sp){try{a[Ze.KHR_BINARY_GLTF]=new bw(e)}catch(u){i&&i(u);return}r=JSON.parse(a[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Nw(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(u){case Ze.KHR_MATERIALS_UNLIT:a[u]=new sw;break;case Ze.KHR_DRACO_MESH_COMPRESSION:a[u]=new Mw(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:a[u]=new Sw;break;case Ze.KHR_MESH_QUANTIZATION:a[u]=new ww;break;default:f.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function nw(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class iw{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new fe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Jt);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Gl(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new X0(h),c.distance=u;break;case"spot":c=new G0(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),kn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class sw{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return qt}extendParams(e,t,n){const i=[];e.color=new fe(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Jt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Ft))}return Promise.all(i)}}class rw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class aw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Oe(o,o)}return Promise.all(r)}}class ow{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class lw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(r)}}class cw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new fe(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Jt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,Ft)),a.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(r)}}class hw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(r)}}class uw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new fe().setRGB(o[0],o[1],o[2],Jt),Promise.all(r)}}class fw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class dw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new fe().setRGB(o[0],o[1],o[2],Jt),a.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,Ft)),Promise.all(r)}}class pw{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(r)}}class mw{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Xn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(r)}}class gw{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class vw{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class _w{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class xw{constructor(e){this.name=Ze.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,f,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(d),h,u,f,i.mode,i.filter),d})})}else return null}}class yw{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==_n.TRIANGLES&&c.mode!==_n.TRIANGLE_STRIP&&c.mode!==_n.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(const g of u){const v=new We,m=new R,p=new Pn,x=new R(1,1,1),b=new Rc(g.geometry,g.material,f);for(let _=0;_<f;_++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,_),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,_),l.SCALE&&x.fromBufferAttribute(l.SCALE,_),b.setMatrixAt(_,v.compose(m,p,x));for(const _ in l)if(_==="_COLOR_0"){const E=l[_];b.instanceColor=new Bl(E.array,E.itemSize,E.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&g.geometry.setAttribute(_,l[_]);_t.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),d.push(b)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const Sp="glTF",Qs=12,pf={JSON:1313821514,BIN:5130562};class bw{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Qs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Sp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Qs,r=new DataView(e,Qs);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===pf.JSON){const c=new Uint8Array(e,Qs+a,o);this.content=n.decode(c)}else if(l===pf.BIN){const c=Qs+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Mw{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=lc[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=lc[h]||h.toLowerCase();if(a[h]!==void 0){const f=n.accessors[e.attributes[h]],d=Ss[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,f){i.decodeDracoFile(h,function(d){for(const g in d.attributes){const v=d.attributes[g],m=l[g];m!==void 0&&(v.normalized=m)}u(d)},o,c,Jt,f)})})}}class Sw{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ww{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class wp extends Tr{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,f=u*u,d=f*u,g=e*c,v=g-c,m=-2*d+3*f,p=d-f,x=1-m,b=p-f+u;for(let _=0;_!==o;_++){const E=a[v+_+o],T=a[v+_+l]*h,A=a[g+_+o],C=a[g+_]*h;r[_]=x*E+b*T+m*A+p*C}return r}}const Ew=new Pn;class Tw extends wp{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return Ew.fromArray(r).normalize().toArray(r),r}}const _n={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ss={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},mf={9728:Zt,9729:Kt,9984:Cf,9985:pa,9986:er,9987:zn},gf={33071:yi,33648:Ca,10497:Vi},qo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},lc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},gi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Aw={CUBICSPLINE:void 0,LINEAR:_r,STEP:vr},Ko={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Rw(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Gn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:si})),s.DefaultMaterial}function Ui(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function kn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Cw(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(f)}if(i){const f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(f)}if(r){const f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],f=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function Pw(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Iw(s){let e;const t=s.extensions&&s.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Zo(t.attributes):e=s.indices+":"+Zo(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Zo(s.targets[n]);return e}function Zo(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function cc(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Lw(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Dw=new We;class Nw{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new nw,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new H0(this.options.manager):this.textureLoader=new $0(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new td(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Ui(r,o,i),kn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(ar.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=qo[i.type],o=Ss[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new kt(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=qo[i.type],c=Ss[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let v,m;if(d&&d!==u){const p=Math.floor(f/d),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let b=t.cache.get(x);b||(v=new c(o,p*d,i.count*d/h),b=new v0(v,d/h),t.cache.add(x,b)),m=new Tc(b,l,f%d/h,g)}else o===null?v=new c(i.count*l):v=new c(o,f,i.count*l),m=new kt(v,l,g);if(i.sparse!==void 0){const p=qo.SCALAR,x=Ss[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,E=new x(a[1],b,i.sparse.count*p),T=new c(a[2],_,i.sparse.count*l);o!==null&&(m=new kt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let A=0,C=E.length;A<C;A++){const y=E[A];if(m.setX(y,T[A*l]),l>=2&&m.setY(y,T[A*l+1]),l>=3&&m.setZ(y,T[A*l+2]),l>=4&&m.setW(y,T[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const f=(r.samplers||{})[a.sampler]||{};return h.magFilter=mf[f.magFilter]||Kt,h.minFilter=mf[f.minFilter]||zn,h.wrapS=gf[f.wrapS]||Vi,h.wrapT=gf[f.wrapT]||Vi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Zt&&h.minFilter!==Kt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const f=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(f,d){let g=f;t.isImageBitmapLoader===!0&&(g=function(v){const m=new Pt(v);m.needsUpdate=!0,f(m)}),t.load(ar.resolveURL(u,r.path),g,void 0,d)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),kn(u,a),u.userData.mimeType=a.mimeType||Lw(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new qf,In.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Ga,In.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Gn}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ze.KHR_MATERIALS_UNLIT]){const u=i[Ze.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new fe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Jt),o.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Ft)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Gt);const h=r.alphaMode||Ko.OPAQUE;if(h===Ko.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Ko.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==qt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Oe(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==qt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==qt){const u=r.emissiveFactor;o.emissive=new fe().setRGB(u[0],u[1],u[2],Jt)}return r.emissiveTexture!==void 0&&a!==qt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Ft)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),kn(u,r),t.associations.set(u,{materials:e}),r.extensions&&Ui(i,u,r),u})}createUniqueName(e){const t=ct.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return vf(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=Iw(c),u=i[h];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=vf(new wt,c,t),i[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?Rw(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,g=h.length;d<g;d++){const v=h[d],m=a[d];let p;const x=c[d];if(m.mode===_n.TRIANGLES||m.mode===_n.TRIANGLE_STRIP||m.mode===_n.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new x0(v,x):new He(v,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===_n.TRIANGLE_STRIP?p.geometry=ff(p.geometry,kf):m.mode===_n.TRIANGLE_FAN&&(p.geometry=ff(p.geometry,Ol));else if(m.mode===_n.LINES)p=new E0(v,x);else if(m.mode===_n.LINE_STRIP)p=new Wa(v,x);else if(m.mode===_n.LINE_LOOP)p=new Yf(v,x);else if(m.mode===_n.POINTS)p=new T0(v,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Pw(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),kn(p,r),m.extensions&&Ui(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&Ui(i,u[0],r),u[0];const f=new Pe;r.extensions&&Ui(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new nn(Ye.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ar(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),kn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const f=new We;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ac(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,f=i.channels.length;u<f;u++){const d=i.channels[u],g=i.samplers[d.sampler],v=d.target,m=v.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,x=i.parameters!==void 0?i.parameters[g.output]:g.output;v.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(g),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const f=u[0],d=u[1],g=u[2],v=u[3],m=u[4],p=[];for(let b=0,_=f.length;b<_;b++){const E=f[b],T=d[b],A=g[b],C=v[b],y=m[b];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const S=n._createAnimationTracks(E,T,A,C,y);if(S)for(let I=0;I<S.length;I++)p.push(S[I])}const x=new Vl(r,void 0,p);return kn(x,i),x})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,Dw)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new $f:c.length>1?h=new Pe:c.length===1?h=c[0]:h=new _t,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),kn(h,r),r.extensions&&Ui(n,h,r),r.matrix!==void 0){const u=new We;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Pe;n.name&&(r.name=i.createUniqueName(n.name)),kn(r,n),n.extensions&&Ui(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++)r.add(l[h]);const c=h=>{const u=new Map;for(const[f,d]of i.associations)(f instanceof In||f instanceof Pt)&&u.set(f,d);return h.traverse(f=>{const d=i.associations.get(f);d!=null&&u.set(f,d)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];gi[r.path]===gi.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(o);let c;switch(gi[r.path]){case gi.weights:c=Ps;break;case gi.rotation:c=Is;break;case gi.translation:case gi.scale:c=Ls;break;default:n.itemSize===1?c=Ps:c=Ls;break}const h=i.interpolation!==void 0?Aw[i.interpolation]:_r,u=this._getArrayFromAccessor(n);for(let f=0,d=l.length;f<d;f++){const g=new c(l[f]+"."+gi[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=cc(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Is?Tw:wp;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Uw(s,e,t){const n=e.attributes,i=new un;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new R(l[0],l[1],l[2]),new R(c[0],c[1],c[2])),o.normalized){const h=cc(Ss[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new R,l=new R;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){const v=cc(Ss[f.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new Wn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function vf(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=lc[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return tt.workingColorSpace!==Jt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),kn(s,e),Uw(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Cw(s,e.targets,t):s})}function Fw(s){const e=new Map,t=new Map,n=s.clone();return Ep(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Ep(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)Ep(s.children[n],e.children[n],t)}class kw{constructor(e,t){this.splash=t,e.add(this.root),new tw().load("/Codex/models/seagull.glb",r=>{const a=r.animations.find(o=>o.name==="ArmatureAction");if(!a){console.error("Martı uçuş animasyonu bulunamadı");return}for(let o=0;o<5;o++){const l=new Pe,c=Fw(r.scene);l.add(c);const h=new un().setFromObject(c),u=h.getSize(new R),f=h.getCenter(new R),d=.55/Math.max(u.x,u.y,u.z);c.scale.multiplyScalar(d),c.position.addScaledVector(f,-d);const g=new og(c);g.clipAction(a).play(),g.update(o*.27),this.root.add(l),this.soundBirds.push(l),this.birds.push({root:l,mixer:g,phase:o*1.93})}},void 0,r=>console.error("Martı modeli yüklenemedi",r));const n=new Gn({color:8959413,metalness:.18,roughness:.5}),i=new dn(.055,.12,3);for(let r=0;r<2;r++){const a=new Pe,o=new He(new ja(.09,7,5),n);o.scale.set(.5,.65,1.7),a.add(o);const l=new He(i,n);l.rotation.x=-Math.PI/2,l.position.z=-.18,a.add(l),a.visible=!1,this.root.add(a),this.fish.push({root:a,start:new R,direction:new R,age:-1,wait:5+r*7,duration:1.25})}}splash;soundBirds=[];root=new Pe;birds=[];fish=[];center=new R;radius=4;board=new Map;sync(e){this.board=e;const t=[...e.keys()].map(rt);t.length&&(this.center.set(t.reduce((n,i)=>n+i.x,0)/t.length,0,t.reduce((n,i)=>n+i.z,0)/t.length),this.radius=Math.max(3,...t.map(n=>Math.hypot(n.x-this.center.x,n.z-this.center.z)+1.7)))}reset(){for(let e=0;e<this.fish.length;e++){const t=this.fish[e];t.root.visible=!1,t.age=-1,t.wait=5+e*7}}update(e,t){this.birds.forEach((n,i)=>{const r=e*(.11+i*.007)+n.phase,a=this.radius+Math.sin(e*.09+n.phase)*.8;n.root.position.set(this.center.x+Math.cos(r)*a,2.4+i*.24+Math.sin(e*.6+n.phase)*.14,this.center.z+Math.sin(r)*a*.7),n.root.rotation.set(0,Math.atan2(-Math.sin(r),Math.cos(r)*.7),Math.sin(r+n.phase)*.15),n.mixer.update(t)});for(const n of this.fish){if(n.age<0){if(n.wait-=t,n.wait>0)continue;let a=!1;for(let o=0;o<12;o++){const l=Math.random()*Math.PI*2,c=this.radius*(.75+Math.random()*.65),h=l+Math.PI/2;if(n.start.set(this.center.x+Math.sin(l)*c,wn,this.center.z+Math.cos(l)*c),n.direction.set(Math.sin(h)*1.5,0,Math.cos(h)*1.5),[0,.25,.5,.75,1].every(u=>!this.board.has(Xt(n.start.x+n.direction.x*u,n.start.z+n.direction.z*u)))){a=!0;break}}if(!a){n.wait=3;continue}n.age=0,n.root.visible=!0,this.splash(n.start.x,n.start.z)}n.age+=t;const i=Math.min(1,n.age/n.duration);n.root.position.copy(n.start).addScaledVector(n.direction,i),n.root.position.y+=Math.sin(i*Math.PI)*.65;const r=n.direction.clone();r.y=Math.cos(i*Math.PI)*Math.PI*.65,n.root.quaternion.setFromUnitVectors(new R(0,0,1),r.normalize()),(i>=1||this.board.has(Xt(n.root.position.x,n.root.position.z)))&&(this.splash(n.root.position.x,n.root.position.z),n.root.visible=!1,n.age=-1,n.wait=8+Math.random()*15)}}}class Ow{root=new Pe;land=new Map;water=new $S;landMat=new Gn({vertexColors:!0,roughness:1,flatShading:!0,side:Gt});wildlife;last=0;sinking=new Map;pendingBoard=null;constructor(e){e.add(this.root),e.background=new fe(9682891),this.root.add(this.water.root),this.wildlife=new kw(e,(t,n)=>this.stir(t,n,1,0,.35,.1))}sync(e,t){this.wildlife.sync(e);for(const i of this.land.keys())e.has(i)||this.removeLand(i);this.pendingBoard=t>=0?new Map(e):null;const n=fa(e);this.water.sync(e,n,t);for(const i of e.keys()){const r=n.filter(h=>h.id===i).map(h=>h.side).join(","),a=this.land.get(i);if(a){t<0&&a.signature!==r&&(a.surface.geometry.dispose(),a.surface.geometry=Sa(i,e),a.signature=r);continue}const o=rt(i),l=new Pe;l.position.set(o.x,i===t?-1.1:0,o.z),i===t&&l.scale.set(.35,1,.35);const c=new He(Sa(i,e),this.landMat);if(c.castShadow=!0,c.receiveShadow=!0,l.add(c),i===dt){const h=new Pe;h.position.set(.44,st,-.37),cr(h,0,0,1,.47),l.add(h)}l.visible=i!==t,this.root.add(l),this.land.set(i,{root:l,surface:c,signature:r,age:i===t?0:zi})}}setMeadow(e,t){const n=this.land.get(e);if(!n)return;n.grass&&(n.root.remove(n.grass),n.grass.traverse(r=>{r instanceof He&&(r.geometry.dispose(),r.material.dispose())}));const i=VS(e,(r,a)=>t.some(o=>r>o.min.x-.065&&r<o.max.x+.065&&a>o.min.z-.065&&a<o.max.z+.065)||e===dt&&Math.hypot(r-.44,a+.37)<.24);i.position.set(0,st,0),n.root.add(i),n.grass=i}demolish(e,t){this.pendingBoard=new Map(e),this.sinking.set(t,0),this.water.sync(e,fa(e),-1,t)}removeLand(e){const t=this.land.get(e);t&&(this.root.remove(t.root),t.surface.geometry.dispose(),t.root.traverse(n=>{n instanceof He&&n!==t.surface&&n.material.vertexColors&&(n.geometry.dispose(),n.material.dispose())}),this.land.delete(e))}get soundBirds(){return this.wildlife.soundBirds}fitWaterView(e){this.water.fitView(e)}stir(e,t,n,i,r,a){this.water.stir(e,t,n,i,r,a)}update(e){vp.value=e;const t=Math.max(0,e-this.last);this.last=e,this.water.update(e),this.wildlife.update(e,t);for(const n of this.land.values())if(n.age<zi){n.age=Math.min(zi,n.age+t);const i=Sn(n.age,Oa,zi);n.root.visible=n.age>=Oa,n.root.position.y=-1.1*(1-i),n.root.scale.set(.35+.65*i,1,.35+.65*i)}for(const[n,i]of this.sinking){const r=i+t;this.sinking.set(n,r);const a=this.land.get(n),o=Sn(r,Kc,Zc);a&&(a.root.position.y=-1.6*o,a.root.scale.set(1-.7*o,1-.18*o,1-.7*o),a.root.rotation.z=Math.sin(r*25)*Math.sin(o*Math.PI)*.025),r>=gp&&(this.removeLand(n),this.sinking.delete(n))}if(this.pendingBoard&&this.sinking.size===0&&[...this.land.values()].every(n=>n.age>=zi)){const n=this.pendingBoard,i=fa(n);for(const[r,a]of this.land){const o=i.filter(l=>l.id===r).map(l=>l.side).join(",");a.signature!==o&&(a.surface.geometry.dispose(),a.surface.geometry=Sa(r,n),a.signature=o)}this.pendingBoard=null}}reset(){this.wildlife.reset(),this.pendingBoard=null,this.sinking.clear(),this.water.clearWakes();for(const e of this.land.keys())this.removeLand(e)}}function vi(s,e=st){const{x:t,z:n}=rt(s);return new R(t,e,n)}function zw(s){return new wt().setFromPoints(Array.from({length:6},(e,t)=>{const n=ur(t,s);return new R(n.x,0,n.z)}))}class Bw{root=new Pe;markers=new Pe;ray=new nd;plane=new ei(new R(0,1,0),-st);hit=new R;occupied=new Set;rim=zw(ni*.94);rimMat=new Ga({color:16578264,transparent:!0,opacity:.9,depthWrite:!1});fillGeo=new wr(ni*.94,6,Math.PI/2).rotateX(-Math.PI/2);fillMat=new qt({color:12708029,transparent:!0,opacity:.16,depthWrite:!1});hoverMat=new qt({color:12117915,transparent:!0,opacity:.48,depthWrite:!1});hover=new He(this.fillGeo,this.hoverMat);constructor(e){this.root.add(this.markers,this.hover),this.hover.visible=!1,e.add(this.root)}rebuild(e){this.occupied=new Set(e.keys()),this.markers.clear();for(const t of kp(e)){const n=new Pe;n.position.copy(vi(t,wn+.055)),n.userData.id=t;const i=new He(this.fillGeo,this.fillMat),r=new Yf(this.rim,this.rimMat);i.renderOrder=4,r.renderOrder=5,n.add(i,r),this.markers.add(n)}}pick(e,t,n,i){const r=i.getBoundingClientRect();if(this.ray.setFromCamera(new Oe((e-r.left)/r.width*2-1,1-(t-r.top)/r.height*2),n),this.plane.constant=-st,!this.ray.ray.intersectPlane(this.plane,this.hit))return-1;const a=Xt(this.hit.x,this.hit.z);return this.occupied.has(a)?a:(this.plane.constant=.125,this.ray.ray.intersectPlane(this.plane,this.hit)?Xt(this.hit.x,this.hit.z):-1)}nearestAvailable(e,t,n,i,r){const a=i.getBoundingClientRect(),o=new R;let l=-1,c=1/0;for(const h of this.markers.children){const u=h.userData.id;if(!r(u))continue;const f=h.position;if(o.copy(f).project(n),o.z<-1||o.z>1)continue;const d=a.left+(o.x+1)*a.width/2,g=a.top+(1-o.y)*a.height/2,v=Math.hypot(e-d,t-g);if(v>=c)continue;let m=0;for(let p=0;p<6;p++){const x=ur(p,ni);o.set(f.x+x.x,f.y,f.z+x.z).project(n),m=Math.max(m,Math.hypot(a.left+(o.x+1)*a.width/2-d,a.top+(1-o.y)*a.height/2-g))}v<=m*1.2&&(l=u,c=v)}return l}showAvailable(e,t){this.markers.visible=e,this.markers.children.forEach(n=>n.visible=t(n.userData.id))}setHover(e,t,n){this.hover.visible=n&&e>=0,this.hover.visible&&(this.hover.position.copy(vi(e,this.occupied.has(e)?st+.012:wn+.067)),this.hover.renderOrder=6,this.hoverMat.color.setHex(t?11790741:14653320))}}class Hw{constructor(e,t,n,i=()=>[]){this.game=e,this.ready=t,this.yaw=n,this.obstacles=i}game;ready;yaw;obstacles;cache=new Map;step=.1;invalidate(){this.cache.clear()}free(e,t){for(const[g,v]of this.game.board)if(v==="fisher"&&this.ready(g)){const m=rt(g),p=this.yaw(g),x=e-m.x,b=t-m.z,_=x*Math.cos(p)-b*Math.sin(p),E=x*Math.sin(p)+b*Math.cos(p);if(Math.abs(_)<.13&&E>.1&&E<1.04)return!0}const n=Xt(e,t),i=this.game.board.get(n);if(!i||!this.ready(n))return!1;const r=rt(n),a=e-r.x,o=t-r.z;for(let g=0;g<6;g++)if(!this.game.board.has(tn(n)[g])&&a*Math.cos(g*Math.PI/3)+o*Math.sin(g*Math.PI/3)>.745)return!1;const l=this.yaw(n),c=Math.cos(l),h=Math.sin(l),u=a*c-o*h,f=a*h+o*c,d=(g,v,m,p,x=da)=>u>g*x-.075&&u<v*x+.075&&f>m*x-.075&&f<p*x+.075;if(i==="house"||i==="manor"||i==="store"||i==="lumber"){const g=i==="manor"?.54:.43;if(d(-g,g,-.39,.58)||i==="store"&&(d(-.51,-.25,.26,.59)||d(.25,.51,.26,.59))||n===dt&&d(-.6,-.1,-.48,.04))return!1}else if(i==="fisher"){if(d(-.34,.34,-.57,.16))return!1}else if(i==="berry"||i==="farm"){if(d(-.5,.5,-.57,.4,.75))return!1}else if(i==="garden"){if(Math.hypot(u,f)<.44)return!1}else if(i==="forest"||i==="stone"){for(const g of this.obstacles(n))if(Math.hypot(e-g.x,t-g.z)<g.r)return!1}return!0}segment(e,t){const n=Math.max(1,Math.ceil(Math.hypot(t.x-e.x,t.z-e.z)/.055));for(let i=1;i<=n;i++)if(!this.free(e.x+(t.x-e.x)*i/n,e.z+(t.z-e.z)*i/n))return!1;return!0}nearest(e,t,n=(r,a)=>!0,i=.8){let r=null,a=1/0;for(let o=-i;o<=i;o+=this.step)for(let l=-i;l<=i;l+=this.step){const c=Math.round((e+l)/this.step)*this.step,h=Math.round((t+o)/this.step)*this.step,u=(c-e)**2+(h-t)**2;u<a&&this.free(c,h)&&n(c,h)&&(a=u,r={x:c,z:h,tile:Xt(c,h)})}return r}path(e,t,n=()=>0,i=.8){const r=this.nearest(e.x,e.z,(_,E)=>this.segment(e,{x:_,z:E})),a=this.nearest(t.x,t.z,()=>!0,i);if(!r||!a)return null;const o=(_,E)=>`${_},${E}`,l=Math.round(r.x/this.step),c=Math.round(r.z/this.step),h=Math.round(a.x/this.step),u=Math.round(a.z/this.step),f=o(h,u),d=[],g=_=>{d.push(_);for(let E=d.length-1;E>0;){const T=E-1>>1;if(d[T].score<=_.score)break;d[E]=d[T],d[T]=_,E=T}},v=()=>{const _=d[0],E=d.pop();if(d.length){d[0]=E;let T=0;for(;;){let A=T*2+1;if(A>=d.length||(A+1<d.length&&d[A+1].score<d[A].score&&A++,d[T].score<=d[A].score))break;[d[T],d[A]]=[d[A],d[T]],T=A}}return _},m=o(l,c),p=new Map([[m,0]]),x=new Map,b=new Map([[m,{x:l,z:c}]]);g({x:l,z:c,key:m,cost:0,score:Math.hypot(h-l,u-c)});for(let _=0;d.length&&_<14e3;_++){const E=v();if(E.cost===p.get(E.key)){if(E.key===f){const T=[];for(let y=f;;y=x.get(y)){const S=b.get(y);if(T.push({x:S.x*this.step,z:S.z*this.step,tile:Xt(S.x*this.step,S.z*this.step)}),y===m)break}T.reverse();const A=[];let C=0;for(;C<T.length;){let y=Math.min(T.length-1,C+12);for(;y>C&&!this.segment(C?T[C-1]:r,T[y]);)y--;A.push(T[y]),C=y+1}return this.free(t.x,t.z)&&this.segment(A[A.length-1]??r,t)&&A.push({...t,tile:Xt(t.x,t.z)}),A}for(const[T,A]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){const C=E.x+T,y=E.z+A,S=o(C,y),I=C*this.step,F=y*this.step;let z=this.cache.get(S);if(z===void 0&&(z=this.free(I,F),this.cache.set(S,z)),!z||!this.segment({x:E.x*this.step,z:E.z*this.step},{x:I,z:F}))continue;const V=E.cost+Math.hypot(T,A)+n(I,F);V>=(p.get(S)??1/0)||(p.set(S,V),x.set(S,E.key),b.set(S,{x:C,z:y}),g({x:C,z:y,key:S,cost:V,score:V+Math.hypot(h-C,u-y)}))}}}return null}}class Vw{constructor(e,t,n){this.hooks=t,this.overlay=n,e.add(this.root)}hooks;overlay;root=new Pe;game=null;nav=null;citizens=[];time=0;spawned=new Set;spawnClock=0;buckets=new Map;assignedTo(e){return this.citizens.filter(t=>t.job?.source===e).length}assignedCounts(){return Object.fromEntries(fr.map(e=>[e,this.citizens.filter(t=>t.job?.category===e).length]))}get working(){return this.citizens.filter(e=>e.job!==null).length}refreshNavigation(){this.nav?.invalidate()}rebalance(){if(!this.game)return;const e=this.game.workTargets(),t=this.assignedCounts();for(const n of[...this.citizens].reverse())n.job?.category&&!["to-store","to-pickup","picking"].includes(n.stage)&&t[n.job.category]>e[n.job.category]&&(t[n.job.category]--,this.releaseJob(n))}releaseJob(e){e.job&&this.hooks.harvestProgress(e.job.source,e.id,0),e.job=null,e.stage="idle",e.path=[],e.retry=.1,e.bundle.visible=!1,e.line.visible=!1,e.bobber.visible=!1,e.fish.visible=!1,e.axe.visible=!1,e.pickaxe.visible=!1,e.rod.visible=!1,e.waitReason="",e.target=null}reset(e){for(const t of this.citizens)t.status.remove(),t.line.geometry.dispose(),t.line.material.dispose(),t.bobber.geometry.dispose(),t.bobber.material.dispose();this.root.clear(),this.citizens=[],this.spawned.clear(),this.game=e,this.time=0,this.spawnClock=0,this.nav=new Hw(e,t=>this.hooks.ready(t),t=>this.hooks.yaw(t),t=>this.hooks.obstacles(t))}neighbors(e,t){const n=[],i=Math.floor(e/.32),r=Math.floor(t/.32);for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++)n.push(...this.buckets.get(`${i+a}:${r+o}`)??[]);return n}clear(e,t,n){return this.neighbors(t,n).every(i=>i===e||Math.hypot(i.root.position.x-t,i.root.position.z-n)>.21)}route(e,t,n,i=!1){const r=rt(t),a=this.hooks.yaw(t),o=n??new R(r.x+Math.sin(a)*.65,st,r.z+Math.cos(a)*.65),l=this.nav.path(e.root.position,o,(c,h)=>this.neighbors(c,h).reduce((u,f)=>u+(f!==e&&Math.hypot(f.root.position.x-c,f.root.position.z-h)<.32?4:0),0)+e.avoid.reduce((u,f)=>u+(Math.hypot(f.x-c,f.z-h)<.26?8:0),0),i?.18:.65);return l?.length?(e.nodeMarker="",e.stuck=0,e.bestDistance=1/0,e.path=l,e.target=new R(l[l.length-1].x,st,l[l.length-1].z),this.hooks.trail(l),!0):!1}spawn(e,t){const n=rt(t),i=this.hooks.yaw(t),r=this.nav.nearest(n.x+Math.sin(i)*.65,n.z+Math.cos(i)*.65,(C,y)=>this.citizens.every(S=>Math.hypot(S.root.position.x-C,S.root.position.z-y)>.23),1.1);if(!r)return;const a=new Pe,o=new Pe;a.add(o),o.position.y=.16,ke(o,[7969937,11897456,10132338,8229283][e%4],0,.075,0,.115,.15,.075),vt(o,14858897,0,.2,0,.062),vt(o,[6441788,9728847,5130302][e%3],0,.228,-.012,.052);for(const C of[-.022,.022])vt(o,4537906,C,.205,.054,.006);const l=[-1,1].map(C=>{const y=new Pe;return y.position.set(C*.083,.125,0),o.add(y),ke(y,14660235,0,-.065,0,.035,.13,.035),y}),c=[-1,1].map(C=>{const y=new Pe;return y.position.set(C*.035,.155,0),a.add(y),ke(y,5858653,0,-.065,0,.044,.13,.045),ke(y,6706759,0,-.13,.018,.05,.035,.075),y}),h=new Pe;h.position.set(0,.235,.12),h.visible=!1,a.add(h);const u=new Pe;ke(u,9136455,0,-.13,.04,.022,.19,.022),ke(u,10464938,.025,-.19,.04,.09,.045,.025),l[0].add(u),u.visible=!1;const f=new Pe;f.position.set(0,.125,.015),o.add(f),ke(f,9136455,0,-.095,0,.023,.29,.023);const d=ke(f,11450290,0,-.25,0,.028,.035,.16);for(const C of[-1,1]){const y=new He(new dn(.023,.095,4),d.material);y.position.set(0,-.25,C*.112),y.rotation.x=C*Math.PI/2,f.add(y)}f.visible=!1;const g=new Pe;g.position.set(0,-.12,0),ke(g,8677451,0,.28,0,.013,.58,.013),g.rotation.x=1,l[0].add(g),g.visible=!1;const v=new Wa(new wt().setAttribute("position",new kt(new Float32Array(36),3)),new Ga({color:14869969,transparent:!0,opacity:.8}));v.frustumCulled=!1,v.visible=!1;const m=new ja(.032,12,12).toNonIndexed(),p=[],x=m.getAttribute("position");for(let C=0;C<x.count;C+=3){const y=(x.getY(C)+x.getY(C+1)+x.getY(C+2))/3,S=new fe(Math.floor((y+.032)/.016)%2===0?14965840:16774623);for(let I=0;I<3;I++)p.push(S.r,S.g,S.b)}m.scale(.85,1.25,.85),m.setAttribute("color",new qe(p,3));const b=new He(m,new Gn({vertexColors:!0,roughness:.55}));b.visible=!1;const _=new Pe;vt(_,9747131,0,0,0,.055).scale.set(.55,.7,1.6);const T=Gw();_.add(T),_.visible=!1,a.position.set(r.x,st,r.z),a.rotation.y=i+Math.PI;const A=document.createElement("div");A.className="citizen-status",A.setAttribute("role","img"),this.overlay.append(A),this.root.add(a,v,b,_),this.spawned.add(e),this.citizens.push({id:e,root:a,body:o,arms:l,legs:c,bundle:h,axe:u,pickaxe:f,rod:g,line:v,bobber:b,fish:_,stage:"idle",path:[],target:null,job:null,clock:0,retry:.6+e%7*.1,phase:e*1.73,birth:e===0?1:0,speed:0,wait:0,status:A,lastStatus:"",eatUntil:0,hungry:!1,waitReason:"",searchUntil:0,stuck:0,bestDistance:1/0,nodeMarker:"",avoid:[]})}findJob(e){const t=this.game,n=Xt(e.root.position.x,e.root.position.z),i=t.workTargets(),r=this.assignedCounts(),a=[...t.board.keys()].map(o=>({source:o,recipe:t.productAt(o),category:t.categoryFor(o)})).filter(({source:o,recipe:l,category:c})=>l&&this.hooks.resourceReady(o)&&this.hooks.ready(o)&&(c?r[c]<i[c]:t.happy<70)&&this.assignedTo(o)<l.capacity).sort((o,l)=>Ra(n,o.source)-Ra(n,l.source));for(const{source:o,recipe:l,category:c}of a){const h=t.storageFor(o).find(d=>this.hooks.ready(d)&&t.canStore(d,l.resource));if(h===void 0)continue;let u=l.resource==="wood"||l.resource==="stone"?-1:e.id%2;if((c==="farm"||c==="berry")&&(u=[0,1].find(d=>!this.citizens.some(g=>g.job?.source===o&&g.job.tree===d&&!["to-store","to-pickup","picking"].includes(g.stage)))??-1,u<0))continue;if(l.resource==="wood"||l.resource==="stone")for(let d=0;d<3;d++){const g=this.hooks.pickTree(o,(e.id+d)%3);if(g>=0&&!this.citizens.some(v=>v.job?.source===o&&v.job.tree===g&&!["to-store","to-pickup","picking"].includes(v.stage))){u=g;break}}if((l.resource==="wood"||l.resource==="stone")&&u<0)continue;const f=t.board.get(o)==="fisher"?this.hooks.fishingSpot(o):null;if(!(t.board.get(o)==="fisher"&&!f)&&this.route(e,o,f?.stand??this.hooks.workPoint(o,u)))return e.job={source:o,store:h,resource:l.resource,amount:l.amount,tree:u,category:c},e.stage="to-work",e.clock=0,!0}return!1}wander(e){const t=Xt(e.root.position.x,e.root.position.z),n=[t,...tn(t)].filter(o=>this.game.board.has(o)&&this.hooks.ready(o));if(!n.length)return;const i=n[Math.floor((Math.sin(this.time+e.phase)+1)*.499*n.length)],r=rt(i),a=this.time*.7+e.phase;this.route(e,i,new R(r.x+Math.sin(a)*.7,st,r.z+Math.cos(a)*.7))}move(e,t){if(!e.path.length)return e.speed*=Math.exp(-10*t),!1;const n=e.path[0];if(!this.nav.free(n.x,n.z))return e.path=[],!1;const i=n.x-e.root.position.x,r=n.z-e.root.position.z,a=Math.hypot(i,r);if(a<.035)return e.path.shift(),e.nodeMarker="",!1;const o=`${n.x}:${n.z}`;if(e.nodeMarker!==o?(e.nodeMarker=o,e.bestDistance=a,e.stuck=0):a<e.bestDistance-.035?(e.bestDistance=a,e.stuck=0):e.stuck+=t,e.stuck>1.1)return this.recover(e),!1;const l=Math.atan2(i,r),c=Ye.euclideanModulo(l-e.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;e.speed+=((.82+e.id%4*.025)*Math.max(.35,1-Math.abs(c)/Math.PI*.65)-e.speed)*(1-Math.exp(-7*t));const h=Math.min(a,e.speed*t),u=i/a,f=r/a,d={x:e.root.position.x,z:e.root.position.z},g=Math.min(.06,t*.8),m=[{x:d.x+u*h,z:d.z+f*h},{x:d.x+u*h-f*g,z:d.z+f*h+u*g},{x:d.x+u*h+f*g,z:d.z+f*h-u*g},{x:d.x-f*g,z:d.z+u*g},{x:d.x+f*g,z:d.z-u*g}].find(p=>this.clear(e,p.x,p.z)&&this.nav.segment(d,p));return m?(e.wait=0,e.root.position.x=m.x,e.root.position.z=m.z,e.root.rotation.y+=c*(1-Math.exp(-15*t)),Math.hypot(n.x-m.x,n.z-m.z)<.035&&e.path.shift(),!0):(e.wait+=t,e.speed*=.8,e.wait>.6&&this.recover(e),!1)}recover(e){if(this.nav.invalidate(),e.searchUntil=this.time+1.5,e.wait=0,e.stuck=0,e.path[0]&&e.avoid.push({x:e.path[0].x,z:e.path[0].z,until:this.time+4}),e.path=[],e.stage==="to-store"){e.target=null,e.job&&(e.job.store=-1),e.retry=0;return}if(e.stage==="to-pickup"){e.target=null,e.retry=.2;return}if(e.job){const t=e.job.category==="fish"?this.hooks.fishingSpot(e.job.source)?.stand:this.hooks.workPoint(e.job.source,e.job.tree);if(t&&this.route(e,e.job.source,t))return;e.retry=.5}else e.retry=.2}carry(e){e.job&&(e.bundle.clear(),e.bundle.add(Mp(e.job.resource==="food"?e.job.category==="fish"?"fish":e.job.category==="farm"?"wheat":"berry":e.job.resource)),e.bundle.visible=!0,e.stage="to-store",e.path=[],e.target=null,e.retry=0,e.body.rotation.x=0)}sendToStorage(e){const t=e.job;if(!t)return;const n=this.game;if(t.resource==="happy"&&n.happy>=100){this.releaseJob(e);return}const i=n.storageFor(t.source).filter(o=>this.hooks.ready(o)),r=i.filter(o=>n.canStore(o,t.resource));if(!r.length){e.waitReason=i.length?"full":"path",e.retry=.7;return}if(t.store>=0&&r.includes(t.store)&&e.target&&Math.hypot(e.root.position.x-e.target.x,e.root.position.z-e.target.z)<.1&&Math.hypot(e.root.position.x-rt(t.store).x,e.root.position.z-rt(t.store).z)<1.05){const o=this.hooks.deliver(t.source,t.store,t.resource,t.amount);if(t.amount-=o,t.amount<=0){this.releaseJob(e),e.retry=.35;return}e.target=null,t.store=-1,e.retry=.1;return}const a=r.sort((o,l)=>Math.hypot(e.root.position.x-rt(o).x,e.root.position.z-rt(o).z)-Math.hypot(e.root.position.x-rt(l).x,e.root.position.z-rt(l).z));for(const o of a){const l=rt(o),c=this.hooks.yaw(o),u=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3].map(f=>new R(l.x+Math.sin(c+f)*.67,st,l.z+Math.cos(c+f)*.67)).filter(f=>this.nav.free(f.x,f.z)&&this.clear(e,f.x,f.z)).sort((f,d)=>e.root.position.distanceTo(f)-e.root.position.distanceTo(d));for(const f of u)if(this.route(e,o,f,!0)){t.store=o,e.waitReason="";return}}e.waitReason="path",e.searchUntil=this.time+1.2,e.retry=.6}updateStatuses(e,t,n){const i=new R;for(const r of this.citizens){const a=r.eatUntil>this.time,o=r.bundle.visible,l=a?r.hungry?"hungry":"eat":o?r.waitReason==="full"?"full":"carry":r.job?r.job.category??"garden":"rest",c=l==="carry"?r.job?.category??"garden":l,h=`${l}:${c}`;if(h!==r.lastStatus){r.lastStatus=h,r.status.innerHTML=fn(c),r.status.dataset.state=l;const g=l==="carry"?`Depoya taşıyor · ${_f[c]??""}`:_f[l]??"Dinleniyor";r.status.setAttribute("aria-label",g),r.status.title=g}i.copy(r.root.position),i.y+=.58,i.project(e),r.status.hidden=i.z<-1||i.z>1,r.status.style.left=`${(i.x+1)*t/2}px`,r.status.style.top=`${(1-i.y)*n/2}px`;const u=e,f=n/((u.top-u.bottom)/u.zoom),d=Ye.smoothstep(f,42,100);r.status.style.opacity=String(r.birth*d),r.status.style.setProperty("--status-scale",String(.35+.65*d)),r.status.hidden=r.status.hidden||d<.01}}fishing(e,t){const n=this.hooks.fishingSpot(e.job.source);if(!n)return;const i=e.clock,r=i-t,a=n.water;e.root.rotation.y=Math.atan2(a.x-e.root.position.x,a.z-e.root.position.z),e.rod.visible=!0;const o=Ye.smoothstep(i,.7,1.35),l=Ye.smoothstep(i,5.8,7.2);e.arms[0].rotation.x=i<.7?-.8-i*.5:i<1.35?-.95+o*.9:i>5.8?-.1-l*.9:-.1,e.arms[1].rotation.x=-.35,e.rod.rotation.x=.75,e.root.updateMatrixWorld(!0);const c=e.rod.localToWorld(new R(0,.58,0)),h=e.root.localToWorld(new R(0,.24,.15)),u=new R().lerpVectors(c,a,o);u.y+=Math.sin(o*Math.PI)*.45,i>=1.35&&(u.copy(a),u.y+=Math.sin(this.time*4)*.015),i>5.8&&(u.lerpVectors(a,h,l),u.y+=Math.sin(l*Math.PI)*.38),e.bobber.visible=i>.7&&i<7.25,e.bobber.position.copy(u),e.line.visible=e.bobber.visible;const f=e.line.geometry.getAttribute("position");for(let d=0;d<12;d++){const g=d/11;f.setXYZ(d,Ye.lerp(c.x,u.x,g),Ye.lerp(c.y,u.y,g)-Math.sin(g*Math.PI)*.06,Ye.lerp(c.z,u.z,g))}f.needsUpdate=!0,e.fish.visible=i>5.9&&i<7.2,e.fish.position.copy(u),e.fish.rotation.z=Math.sin(this.time*22)*.25,r<1.35&&i>=1.35&&this.hooks.splash(a.x,a.z),i>1.35&&i<5.8&&Math.floor(i/.9)!==Math.floor(r/.9)&&this.hooks.splash(a.x,a.z)}update(e){const t=this.game;if(!(!t||!this.nav)){this.time+=e,t.tick(e),this.spawnClock-=e;for(const n of t.takeMeals()){const i=this.citizens.find(r=>r.id===n.id);i&&(i.eatUntil=this.time+1.5,i.hungry=!n.ate)}if(this.spawnClock<=0){for(const n of t.residents)!this.spawned.has(n.id)&&this.hooks.ready(n.home)&&this.spawn(n.id,n.home);this.spawnClock=.35}this.buckets.clear();for(const n of this.citizens){const i=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`;this.buckets.has(i)||this.buckets.set(i,[]),this.buckets.get(i).push(n)}for(const n of this.citizens){n.avoid=n.avoid.filter(m=>m.until>this.time),n.birth=Math.min(1,n.birth+e*2),n.root.scale.setScalar(Math.max(.01,n.birth*n.birth*(3-2*n.birth)));const i=Xt(n.root.position.x,n.root.position.z);if(!this.nav.free(n.root.position.x,n.root.position.z)){const m=rt(t.residents[n.id]?.home??dt),p=this.nav.nearest(t.board.has(i)?n.root.position.x:m.x,t.board.has(i)?n.root.position.z:m.z,(x,b)=>this.citizens.every(_=>_===n||Math.hypot(_.root.position.x-x,_.root.position.z-b)>.23),1.2);if(p){const x=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`,b=this.buckets.get(x);if(b){const E=b.indexOf(n);E>=0&&b.splice(E,1)}n.root.position.x=p.x,n.root.position.z=p.z,n.path=[];const _=`${Math.floor(p.x/.32)}:${Math.floor(p.z/.32)}`;this.buckets.has(_)||this.buckets.set(_,[]),this.buckets.get(_).push(n)}else continue}if(n.job&&!t.board.has(n.job.source)&&this.releaseJob(n),n.retry-=e,n.eatUntil>this.time){n.axe.visible=!1,n.pickaxe.visible=!1,n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.body.rotation.x=.06,n.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12,n.arms[1].rotation.x=n.bundle.visible?-.8:-.2,n.legs.forEach(m=>m.rotation.x=0);continue}n.stage==="idle"&&n.retry<=0&&(n.retry=1.5+n.id%3*.2,!this.findJob(n)&&!n.path.length&&this.wander(n));const r=this.move(n,e);if(n.stage==="to-work"&&!n.path.length&&n.job&&n.retry<=0)if(n.target&&Math.hypot(n.target.x-n.root.position.x,n.target.z-n.root.position.z)<.17)n.stage="working",n.clock=0;else{const m=n.job.category==="fish"?this.hooks.fishingSpot(n.job.source)?.stand:this.hooks.workPoint(n.job.source,n.job.tree);(!m||!this.route(n,n.job.source,m))&&(n.retry=.6,n.searchUntil=this.time+1)}n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1;const a=n.stage==="working",o=a&&n.job?.resource==="stone",l=a&&(n.job?.resource==="wood"||n.job?.resource==="stone"),c=a&&n.job?.category==="fish",h=this.time*9+n.phase;n.root.position.y=st+(c?.035:0)+(r?Math.abs(Math.sin(h))*.012:Math.sin(this.time*2+n.phase)*.002),n.body.rotation.x=a?l?.12:.45+Math.sin(n.clock*4)**2*.22:r?.05:Math.sin(this.time*1.4+n.phase)*.02;const u=n.clock*1.7%1,f=Ye.smoothstep(u,0,.6),d=Ye.smoothstep(u,.6,.76),g=Ye.smoothstep(u,.76,1);n.arms[0].rotation.x=l?-.3-f*1.9+d*2.1-g*.2:a?-.9:r?Math.sin(h)*.45:Math.sin(this.time*1.7+n.phase)*.08,n.arms[1].rotation.x=o?n.arms[0].rotation.x:l?-.25:a?-.9:r?-Math.sin(h)*.45:-Math.sin(this.time*1.7+n.phase)*.08,n.arms[0].rotation.z=o?.45:0,n.arms[1].rotation.z=o?-.45:0;const v=-.95-f*1.95+d*1.65+g*.3;if(o&&n.arms.forEach(m=>m.rotation.x=v),n.pickaxe.rotation.x=o?v:0,n.legs[0].rotation.x=r?Math.sin(h)*.55:0,n.legs[1].rotation.x=r?-Math.sin(h)*.55:0,n.axe.visible=!!l&&n.job?.resource==="wood",n.pickaxe.visible=!!l&&n.job?.resource==="stone",a&&n.job){if(c){const p=this.hooks.fishingSpot(n.job.source);if(!p||Math.hypot(n.root.position.x-p.stand.x,n.root.position.z-p.stand.z)>.22){n.clock=0,n.stage="to-work",n.path=[],n.target=null,n.retry=0;continue}}n.clock+=e,l&&n.clock>.3&&Math.floor(n.clock*1.7-.72)!==Math.floor((n.clock-e)*1.7-.72)&&this.hooks.impact(n.job.source,n.job.tree);const m=c?7.5:l?n.job.resource==="stone"?6.8:6:2.4;if(c)n.body.rotation.x=.05,this.fishing(n,e);else{const p=this.hooks.workPoint(n.job.source,n.job.tree);n.root.rotation.y=Math.atan2(p.x-.12-n.root.position.x,p.z-.15-n.root.position.z),this.hooks.harvestProgress(n.job.source,n.id,Math.min(1,n.clock/m))}n.clock>=m&&(this.hooks.harvest(n.job.source,n.job.resource,n.job.tree,n.id)?n.job.resource==="wood"?(n.stage="to-pickup",n.path=[],n.target=null,n.retry=.9):this.carry(n):this.releaseJob(n),n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.rod.visible=!1)}if(n.stage==="to-pickup"&&n.job&&!n.path.length&&n.retry<=0){const m=this.hooks.pickup(n.job.source,n.job.tree,!1);if(!m){this.releaseJob(n);continue}n.target&&n.root.position.distanceTo(n.target)<.17?(n.stage="picking",n.clock=0,n.root.rotation.y=Math.atan2(m.x-n.root.position.x,m.z-.23-n.root.position.z)):this.route(n,n.job.source,m,!0)||(n.retry=.4)}n.stage==="picking"&&n.job&&(n.clock+=e,n.body.rotation.x=Math.sin(Math.min(1,n.clock/.85)*Math.PI)*.85,n.arms.forEach(m=>m.rotation.x=-.8),n.clock>=.85&&(this.hooks.pickup(n.job.source,n.job.tree,!0)?this.carry(n):(n.stage="to-pickup",n.retry=.25))),n.stage==="to-store"&&n.job&&!n.path.length&&n.retry<=0&&this.sendToStorage(n),n.bundle.visible&&n.arms.forEach(m=>m.rotation.x=-.8)}}}}function Gw(){const s=new He(new dn(.05,.065,3),new Gn({color:7576476,roughness:.7}));return s.position.z=-.09,s.rotation.x=Math.PI/2,s}const _f={stone:"Taş çıkarıyor",wood:"Odun kesiyor",berry:"Çilek topluyor",farm:"Buğday biçiyor",fish:"Balık tutuyor",garden:"Çiçek topluyor",carry:"Depoya taşıyor",full:"Depo dolu",rest:"Dinleniyor",eat:"Yemek yiyor",hungry:"Yiyecek yok",search:"Alternatif yol arıyor"};function Ww(){const s=document.createElement("canvas");s.width=64,s.height=64;const e=s.getContext("2d"),t=e.createRadialGradient(32,32,1,32,32,31);t.addColorStop(0,"rgba(50,61,39,.43)"),t.addColorStop(.6,"rgba(55,63,39,.19)"),t.addColorStop(1,"rgba(58,65,42,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);const n=new A0(s);return n.colorSpace=Ft,new qt({map:n,transparent:!0,depthWrite:!1})}function Xw(){const s=Ea("house"),e=new Pe;e.position.set(-.34,0,-.21),s.add(e),at(e,new It(.205,.24,.77,8),15062190,0,.405,0),at(e,new It(.24,.2,.065,8),9795928,0,.812,0),at(e,new It(.16,.16,.29,8),6847604,0,.99,0);for(let i=0;i<4;i++){let r=i*Math.PI/2+.4;ke(e,12296567,Math.cos(r)*.172,.99,Math.sin(r)*.172,.038,.3,.038)}at(e,new dn(.29,.37,8),5734528,0,1.29,0),ke(e,9402454,0,1.58,0,.023,.23,.023);const t=new wt;t.setAttribute("position",new qe([0,1.69,0,.26,1.62,.018,0,1.56,0],3)),t.computeVertexNormals();const n=new He(t,new Dc({color:14394711,side:Gt}));return e.add(n),s}class jw{constructor(e){this.el=e,this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Af,this.renderer.toneMapping=ol,this.renderer.toneMappingExposure=1.03,e.append(this.renderer.domElement),this.cameraControl=new OS(this.renderer.domElement),this.scene.add(new Jh(16773592,8689792,1.55),this.root);const t=this.sun;t.position.set(-5,10,4),t.castShadow=!0,Object.assign(t.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31}),t.shadow.mapSize.set(2048,2048),t.shadow.bias=-12e-5,t.shadow.normalBias=.015,this.scene.add(t,t.target),this.environment=new Ow(this.scene),this.villagers=new Vw(this.scene,{ready:r=>this.ready(r),yaw:r=>this.buildings.get(r)?.rotation.y??0,resourceReady:r=>this.resourceReady(r),pickTree:(r,a)=>this.pickTree(r,a),workPoint:(r,a)=>this.workPoint(r,a),obstacles:r=>this.obstacles(r),pickup:(r,a,o)=>this.pickup(r,a,o),harvest:(r,a,o,l)=>this.harvest(r,a,o,l),harvestProgress:(r,a,o)=>{const l=`${r}:${a}`;o?this.harvestParts.set(l,{id:r,progress:o}):this.harvestParts.delete(l)},fishingSpot:r=>this.fishingSpot(r),impact:(r,a)=>this.woodImpact(r,a),splash:(r,a)=>this.environment.stir(r,a,1,0,.45,.1),trail:r=>this.addTrail(r),deliver:(r,a,o,l)=>this.onDelivery(r,a,o,l)},this.el),this.scene.add(this.trails),this.trails.count=0,this.trails.frustumCulled=!1,this.grid=new Bw(this.scene);const n=()=>{const{clientWidth:r,clientHeight:a}=e;this.renderer.setSize(r,a),this.cameraControl.resize(r,a)};new ResizeObserver(n).observe(e),n();const i=this.renderer.domElement;i.addEventListener("pointermove",r=>{this.selected&&!r.buttons&&this.point(r.clientX,r.clientY)}),i.addEventListener("pointerleave",()=>{this.setHover(-1),this.lastSea=null,this.onInspect(-1,0,0,null)}),i.addEventListener("pointermove",r=>{this.stirSea(r),this.inspectPointer(r)}),i.addEventListener("click",r=>{if(r.button===0){if(this.selected){const a=this.point(r.clientX,r.clientY);a>=0&&this.onPick(a)}else if(!this.placing&&!document.querySelector("dialog[open]")){const a=this.grid.pick(r.clientX,r.clientY,this.cameraControl.camera,this.el);this.editTile(this.board.has(a)?a:-1)}}}),window.addEventListener("wheel",r=>{if((!this.selected||this.selected.event)&&this.editing<0||document.querySelector("dialog[open]"))return;r.preventDefault(),r.stopImmediatePropagation();const a=r.deltaY*(r.deltaMode===1?16:r.deltaMode===2?300:1);this.wheelRotation=Ye.clamp(this.wheelRotation+a,-240,240);const o=Math.trunc(this.wheelRotation/60);o&&(this.wheelRotation-=o*60,this.rotateSelection(o))},{capture:!0,passive:!1}),window.addEventListener("keydown",r=>{r.key.toLowerCase()!=="r"||r.repeat||r.ctrlKey||r.metaKey||r.altKey||document.querySelector("dialog[open]")||r.target instanceof Element&&r.target.closest("input,textarea,select,[contenteditable]")||(this.selected&&!this.selected.event||this.editing>=0)&&(r.preventDefault(),this.rotateSelection(r.shiftKey?-1:1))}),this.renderer.setAnimationLoop(this.frame)}el;scene=new Fh;renderer=new Cu({antialias:!0,alpha:!1,powerPreference:"high-performance"});cameraControl;grid;environment;villagers;game=null;fullStores=new Map;treeCycles=new Map;drops=new Map;storageDecor=new Map;fields=new Map;harvestParts=new Map;loaders=new Map;trails=new Rc(new wr(.055,5).rotateX(-Math.PI/2),new qt({color:13417621,transparent:!0,opacity:.42,depthWrite:!1}),8e3);trailPoints=[];trailKeys=new Set;fisherOffset=0;sparkMat=new qt({color:16768138});stoneChipMat=new Gn({color:10069664,roughness:1});woodHits=new Map;root=new Pe;buildings=new Map;editing=-1;rotationTargets=new Map;demolitions=[];ghost=null;ghostModel=null;desiredGhostYaw=0;ghostManualCell=-1;placedManualCell=-1;lastRotationWake=0;wheelRotation=0;placementQueued=!1;previewLand=null;previewLandMat=new Gn({vertexColors:!0,roughness:1,flatShading:!0,side:Gt});seaRay=new nd;seaPlane=new ei(new R(0,1,0),-wn);seaPoint=new R;lastSea=null;board=new Map;sun=new Gl(16769463,2.35);ghostPalette=[];ghostTarget=new R;contact=Ww();contactGeo=new Xi(1.48,1.26).rotateX(-Math.PI/2);moteGeo=new Er(.032,0);moteMats=[15321987,12966298,14333578].map(e=>new qt({color:e}));builds=[];motes=[];labels=[];rings=[];ringGeo=new Ic(.47,.49,32).rotateX(-Math.PI/2);projection=new R;selected=null;previousTime=performance.now();time=0;hover=-1;valid=e=>!1;onHover=e=>{};onPick=e=>{};onTileSelect=e=>{};onSoundFrame=(e,t,n)=>{};onDelivery=(e,t,n,i)=>0;onInspect=(e,t,n,i)=>{};bindGame(e){this.game=e,this.villagers.reset(e)}ready(e){return this.board.has(e)&&this.buildings.has(e)&&!this.builds.some(t=>t.id===e)&&!this.demolitions.some(t=>t.id===e)}pickTree(e,t){for(let n=0;n<3;n++){const i=(t+n)%3;if(!this.treeCycles.has(`${e}:${i}`)&&this.buildings.get(e)?.children.some(r=>r.userData.treeIndex===i))return i}return-1}workPoint(e,t){const n=rt(e),i=this.buildings.get(e),r=i?.children.find(c=>c.userData.treeIndex===t);if(r){r.updateWorldMatrix(!0,!1);const c=r.getWorldPosition(new R),h=this.board.get(e)==="stone";return new R(c.x+.05,st,c.z+(h?.38:.26))}const a=i?.rotation.y??0,o=["farm","berry"].includes(this.board.get(e)??"")?t%2?-.18:.18:0,l=.62;return new R(n.x+o*Math.cos(a)+l*Math.sin(a),st,n.z-o*Math.sin(a)+l*Math.cos(a))}obstacles(e){const t=this.buildings.get(e);return t?t.children.filter(n=>n.userData.treeIndex!==void 0&&n.visible&&!this.treeCycles.has(`${e}:${n.userData.treeIndex}`)).map(n=>{const i=n.getWorldPosition(new R);return{x:i.x,z:i.z,r:this.board.get(e)==="stone"?.31:.14}}):[]}pickup(e,t,n){const i=`${e}:${t}`,r=this.drops.get(i);if(!r||r.claimed)return null;const a=r.group.position.clone();if(a.z+=.23,a.y=st,n){if(r.age<1.7)return null;r.claimed=!0,this.scene.remove(r.group),this.drops.delete(i)}return a}dust(e,t=18){for(let n=0;n<t;n++){const i=new qt({color:n%2?12891022:14010022,transparent:!0,opacity:.42,depthWrite:!1}),r=new He(this.moteGeo,i);r.position.copy(e),r.position.y+=.08,this.scene.add(r),this.motes.push({mesh:r,velocity:new R((Math.random()-.5)*.65,.12+Math.random()*.22,(Math.random()-.5)*.65),life:1.3+Math.random()*.5,dust:!0})}}upgradeStorage(e){const t=this.buildings.get(e);if(!t||!this.game)return;let n=this.storageDecor.get(e);n||(n=new Pe,t.add(n),this.storageDecor.set(e,n)),n.clear();const i=this.game.storageLevels.get(e)??1;for(let a=0;a<Math.min(i-1,8);a++){const o=a%2?-.47:.47,l=-.24+Math.floor(a/2)*.16;ke(n,11766358,o,.12,l,.19,.23,.14),ke(n,7492411,o,.12,l+.075,.2,.026,.018)}for(let a=0;a<Math.min(i,8);a++)at(n,new Pc(.04),15121766,-.21+a*.06,.64,.34);n.userData.upgradedAt=this.time,this.burst(e);const r=document.createElement("div");r.className="float bonus",r.textContent=`Depo seviye ${i} · ${this.game.storageCapacity(e)} kapasite`,this.el.append(r),this.labels.push({el:r,position:vi(e,1.1),life:2.5,delay:0})}harvest(e,t,n,i){if(this.harvestParts.delete(`${e}:${i}`),!this.ready(e))return!1;if(t==="wood"||t==="stone"){const r=`${e}:${n}`,a=this.buildings.get(e)?.children.find(o=>o.userData.treeIndex===n);if(!a||this.treeCycles.has(r))return!1;if(this.treeCycles.set(r,{id:e,tree:a,age:0,scale:a.scale.clone()}),this.villagers.refreshNavigation(),t==="stone"){const o=a.getWorldPosition(new R);this.dust(o,20);for(let l=0;l<30;l++){const c=new He(this.moteGeo,l%6===0?this.sparkMat:this.stoneChipMat);c.position.copy(o).add(new R((Math.random()-.5)*.23,.12+Math.random()*.2,(Math.random()-.5)*.23)),this.scene.add(c),this.motes.push({mesh:c,velocity:new R((Math.random()-.5)*1.6,.65+Math.random()*1.25,(Math.random()-.5)*1.6),life:1.5+Math.random()*.7})}}if(t==="wood"){const o=new Pe;o.position.copy(a.getWorldPosition(new R)),o.position.z-=.12;const l=Mp("wood");o.add(l),l.scale.setScalar(1.65);const c=l.children.map(h=>({mesh:h,velocity:new R((Math.random()-.5)*.14,1+Math.random()*.35,(Math.random()-.5)*.14),spin:new R(Math.random()*3,Math.random()*2,Math.random()*3)}));o.visible=!1,this.scene.add(o),this.drops.set(r,{group:o,age:0,claimed:!1,pieces:c})}a.updateWorldMatrix(!0,!1),this.makeLoader(r,e,a.getWorldPosition(new R).add(new R(0,.5,0)),30)}else if(this.board.get(e)==="berry"||this.board.get(e)==="farm"||this.board.get(e)==="garden"){const r=this.fieldState(e);if(r.stock<=0)return!1;r.stock--;const a=this.workPoint(e,n);if(this.dust(a,6),this.board.get(e)==="berry"){const o=this.buildings.get(e)?.children.filter(l=>l.userData.plantOrder!==void 0)??[];o.slice(Math.floor(r.stock/r.max*o.length),Math.ceil((r.stock+1)/r.max*o.length)).forEach(l=>l.userData.hitAt=this.time)}if(r.stock===0){r.age=0;const o=rt(e);this.makeLoader(`field:${e}`,e,new R(o.x,st+.6,o.z),30)}}else if(this.board.get(e)==="fisher"&&!this.fishingSpot(e))return!1;return!0}updateStorageLabels(){const e=this.game;if(!e)return;const t=this.cameraControl.camera,n=this.el.clientHeight/((t.top-t.bottom)/t.zoom),i=Ye.smoothstep(n,42,100);for(const[r,a]of this.fullStores)(!e.storageStocks.has(r)||e.storageFree(r)>0)&&(a.remove(),this.fullStores.delete(r));for(const r of e.storageStocks.keys()){if(e.storageFree(r)>0||!this.ready(r))continue;let a=this.fullStores.get(r);a||(a=document.createElement("div"),a.className="storage-full",a.innerHTML=`${fn("full")}<span>Depo dolu</span>`,a.setAttribute("role","status"),this.el.append(a),this.fullStores.set(r,a));const o=this.screenPoint(r,1.1);a.style.left=`${o.x}px`,a.style.top=`${o.y}px`,a.style.opacity=String(i),a.style.setProperty("--status-scale",String(.35+.65*i)),a.hidden=i<.01}}woodImpact(e,t){const n=this.buildings.get(e)?.children.find(a=>a.userData.treeIndex===t);if(!n)return;this.woodHits.set(n,.2),n.updateWorldMatrix(!0,!1);const i=n.getWorldPosition(new R),r=this.board.get(e)==="stone";r&&this.dust(i.clone().add(new R(0,.14,.17)),4);for(let a=0;a<(r?14:7);a++){const o=new He(this.moteGeo,r?a<2?this.sparkMat:this.stoneChipMat:this.moteMats[0]);o.scale.setScalar(.85),o.position.copy(i).add(new R(.02,.22,.16)),this.scene.add(o),this.motes.push({mesh:o,velocity:new R((Math.random()-.5)*.9,.65+Math.random()*.55,.25+Math.random()*.65),life:r?1.1:.7})}}fieldState(e){if(!this.fields.has(e)){const t=this.board.get(e)==="farm"?4:3;this.fields.set(e,{stock:t,max:t,age:0})}return this.fields.get(e)}resourceReady(e){const t=this.board.get(e);return t==="forest"||t==="stone"?this.pickTree(e,0)>=0:t==="berry"||t==="farm"||t==="garden"?this.fieldState(e).stock>0:t==="fisher"?!!this.fishingSpot(e):!0}coastalYaw(e,t=0,n=0){const i=rt(e),r=tn(e).filter(f=>!this.board.has(f)).map(f=>{const d=rt(f);return Math.atan2(d.x-i.x,d.z-i.z)});if(!r.length)return t;const a=(f,d)=>Ye.euclideanModulo(f-d+Math.PI,Math.PI*2)-Math.PI;let o=t;if(n&&r.length>1){const f=Math.sign(n);for(let d=0;d<Math.abs(n);d++){const g=r.map(v=>({a:v,d:Ye.euclideanModulo((v-o)*f,Math.PI*2)})).filter(v=>v.d>.04).sort((v,m)=>v.d-m.d)[0];g&&(o+=g.d*f)}return o}const l=[...this.board.keys()].map(rt),c=l.reduce((f,d)=>({x:f.x+d.x/l.length,z:f.z+d.z/l.length}),{x:0,z:0}),h=f=>{const d=i.x+Math.sin(f)*2.8,g=i.z+Math.cos(f)*2.8;return Math.min(...l.map(v=>Math.hypot(d-v.x,g-v.z)))+Math.hypot(d-c.x,g-c.z)*.15},u=r.sort((f,d)=>h(d)-h(f)||Math.abs(a(f,t))-Math.abs(a(d,t)))[0];return t+a(u,t)}alignFisheries(){for(const[e,t]of this.board)if(t==="fisher"){const n=this.buildings.get(e);if(!n)continue;const i=this.rotationTargets.get(e)??n.rotation.y;if(n.userData.manualCoast){const a=rt(e);if(!this.board.has(Xt(a.x+Math.sin(i)*1.75,a.z+Math.cos(i)*1.75)))continue;n.userData.manualCoast=!1}const r=this.coastalYaw(e,i);Math.abs(r-i)>.01&&this.rotationTargets.set(e,r)}}fishingSpot(e){const t=this.buildings.get(e);if(!t||this.board.get(e)!=="fisher"||!this.ready(e))return null;const n=rt(e),i=this.rotationTargets.get(e)??t.rotation.y,r=Math.sin(i),a=Math.cos(i),o=new R(n.x+r*1.75,wn+.03,n.z+a*1.75);return this.board.has(Xt(o.x,o.z))?null:{stand:new R(n.x+r*.94,st,n.z+a*.94),water:o}}makeLoader(e,t,n,i){this.loaders.get(e)?.el.remove();const r=document.createElement("div");r.className="regrowth-loader",r.innerHTML="<i></i><span></span>",r.setAttribute("aria-label","Yeniden büyüyor"),this.el.append(r),this.loaders.set(e,{id:t,el:r,point:n,total:i})}updateLoader(e,t){const n=this.loaders.get(e);if(!n)return;if(!this.board.has(n.id)||t>=n.total){n.el.remove(),this.loaders.delete(e);return}const i=this.cameraControl.camera,r=this.el.clientHeight/((i.top-i.bottom)/i.zoom),a=Ye.smoothstep(r,42,100);n.el.style.opacity=String(a),n.el.hidden=a<.01;const o=n.point.clone().project(i);n.el.style.left=`${(o.x+1)*this.el.clientWidth/2}px`,n.el.style.top=`${(1-o.y)*this.el.clientHeight/2}px`,n.el.style.setProperty("--progress",`${t/n.total*360}deg`),n.el.querySelector("span").textContent=`${Math.ceil(n.total-t)}s`}addTrail(e){const t=new _t;for(let n=1;n<e.length;n++){const i=e[n-1],r=e[n],a=Math.ceil(Math.hypot(r.x-i.x,r.z-i.z)/.16);for(let o=0;o<=a;o++){const l=Ye.lerp(i.x,r.x,o/Math.max(1,a)),c=Ye.lerp(i.z,r.z,o/Math.max(1,a)),h=`${Math.round(l/.13)}:${Math.round(c/.13)}`;if(this.trailKeys.has(h)||this.trailPoints.length>=8e3)continue;this.trailKeys.add(h);const u=Xt(l,c);this.trailPoints.push({tile:u,x:l,z:c}),t.position.set(l,st+.007,c),t.rotation.y=n+o*.8,t.scale.set(1,.7,.8),t.updateMatrix(),this.trails.setMatrixAt(this.trailPoints.length-1,t.matrix)}}this.trails.count=this.trailPoints.length,this.trails.instanceMatrix.needsUpdate=!0}screenPoint(e,t=.7){const n=rt(e),i=new R(n.x,t,n.z).project(this.cameraControl.camera);return{x:(i.x+1)*this.el.clientWidth/2,y:(1-i.y)*this.el.clientHeight/2}}inspectPointer(e){if(this.selected||e.buttons||document.querySelector("dialog[open]")){this.onInspect(-1,0,0,null);return}const t=this.grid.pick(e.clientX,e.clientY,this.cameraControl.camera,this.el);if(!this.board.has(t)){this.onInspect(-1,0,0,null),this.renderer.domElement.style.cursor="";return}this.renderer.domElement.style.cursor="pointer";const n=rt(t),i=Array.from({length:6},(r,a)=>{const o=ur(a),l=new R(n.x+o.x,st,n.z+o.z).project(this.cameraControl.camera);return{x:(l.x+1)*this.el.clientWidth/2,y:(1-l.y)*this.el.clientHeight/2}});this.onInspect(t,e.clientX,e.clientY,{left:Math.min(...i.map(r=>r.x)),right:Math.max(...i.map(r=>r.x)),top:Math.min(...i.map(r=>r.y))-35,bottom:Math.max(...i.map(r=>r.y))})}holdSelection(){this.placementQueued=!0,this.cameraControl.setPlacement(!1)}get placementRotation(){return this.placedManualCell=this.ghostManualCell,this.desiredGhostYaw}rotateSelection(e){if(this.lastRotationWake=this.time-.06,this.villagers.refreshNavigation(),this.selected&&!this.selected.event)this.selected.id==="fisher"&&(this.ghostManualCell=this.hover),this.desiredGhostYaw=this.selected.id==="fisher"&&this.hover>=0?this.coastalYaw(this.hover,this.desiredGhostYaw,e):this.desiredGhostYaw+e*Math.PI/3;else if(this.editing>=0&&!this.placing){const t=this.buildings.get(this.editing);if(t){this.board.get(this.editing)==="fisher"&&(t.userData.manualCoast=!0);const n=this.rotationTargets.get(this.editing)??t.rotation.y;this.rotationTargets.set(this.editing,this.board.get(this.editing)==="fisher"?this.coastalYaw(this.editing,n,e):n+e*Math.PI/3)}}}get placing(){return this.builds.length>0||this.demolitions.length>0}editTile(e){this.editing=e,this.wheelRotation=0,this.grid.setHover(e,!0,e>=0),this.onTileSelect(e)}demolish(e,t){const n=this.buildings.get(t);n&&(this.editTile(-1),this.rotationTargets.delete(t),this.board=e,this.grid.rebuild(e),this.grid.showAvailable(!1,this.valid),this.environment.demolish(e,t),this.demolitions.push({id:t,group:n,time:0}))}point(e,t){if(this.placementQueued)return this.hover;const n=document.elementFromPoint(e,t);let i=n===this.renderer.domElement?this.grid.pick(e,t,this.cameraControl.camera,this.el):-1;if(n===this.renderer.domElement&&this.selected&&!this.selected.event&&!this.valid(i)){const r=this.grid.nearestAvailable(e,t,this.cameraControl.camera,this.el,this.valid);r>=0&&(i=r)}return this.setHover(i),i}stirSea(e){if(e.buttons||this.selected||e.pointerType==="touch"){this.lastSea=null;return}const t=this.renderer.domElement.getBoundingClientRect();if(this.seaRay.setFromCamera(new Oe((e.clientX-t.left)/t.width*2-1,1-(e.clientY-t.top)/t.height*2),this.cameraControl.camera),!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(Xt(this.seaPoint.x,this.seaPoint.z))){this.lastSea=null;return}const{x:n,z:i}=this.seaPoint,r=performance.now()/1e3,a=this.lastSea;if(a&&r-a.time<.04||(this.lastSea={x:n,z:i,time:r},!a||r-a.time>.25))return;const o=n-a.x,l=i-a.z,c=Math.hypot(o,l);c<.025||c>2||this.environment.stir(n,i,o/c,l/c,Math.min(1,c/(r-a.time)/12),c)}setHover(e,t=!1){if(this.editing>=0&&!this.selected){this.grid.setHover(this.editing,!0,!0);return}if(!t&&e===this.hover)return;this.hover=e;const n=e>=0&&this.valid(e);if(this.grid.setHover(e,n,!!this.selected),this.ghost){const i=this.ghost.visible;this.ghost.visible=e>=0,e>=0&&(this.selected?.id==="fisher"&&this.ghostManualCell!==e&&(this.desiredGhostYaw=this.coastalYaw(e,this.desiredGhostYaw)),this.ghostTarget.copy(vi(e,this.board.has(e)?st+.035:st+.025)),i||this.ghost.position.copy(this.ghostTarget),this.ghostPalette.forEach(({mat:r,base:a})=>{r.color.copy(a).lerp(new fe(n?12969902:15304821),n?.04:.65),r.opacity=n?1:.45,r.transparent=!n,r.depthWrite=n}))}if(this.previewLand&&(this.ghost?.remove(this.previewLand),this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&n&&!this.selected?.event&&!this.board.has(e)){const i=new Map(this.board);i.set(e,this.selected.id),this.previewLand=new He(Sa(e,i),this.previewLandMat),this.previewLand.position.y=-st-.025/.7,this.previewLand.receiveShadow=!0,this.ghost.add(this.previewLand)}this.onHover(e)}setSelection(e,t=!1){this.ghostManualCell=-1,this.editTile(-1),this.onInspect(-1,0,0,null);const n=!!e&&e===this.selected,i=n?this.desiredGhostYaw:0,r=n?this.ghostModel?.rotation.y??i:0;this.cameraControl.setPlacement(t),this.previewLand&&(this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&(this.scene.remove(this.ghost),this.ghost=null),this.ghostPalette.forEach(a=>a.mat.dispose()),this.ghostPalette=[],this.selected=e,this.fisherOffset=n?this.fisherOffset:0,this.placementQueued=!1,this.ghostModel=null,this.desiredGhostYaw=i,this.wheelRotation=0,e&&(this.ghost=new Pe,this.ghostModel=Ea(e.id),this.ghostModel.rotation.y=r,this.ghost.add(this.ghostModel),this.ghost.scale.setScalar(.7),this.ghost.traverse(a=>{if(a instanceof He){const o=a.material.clone();this.ghostPalette.push({mat:o,base:o.color.clone()}),o.transparent=!0,o.opacity=.72,o.depthWrite=!1,a.material=o,a.castShadow=!1,a.receiveShadow=!1,a.renderOrder=0}}),this.scene.add(this.ghost),this.ghost.visible=!1),this.grid.showAvailable(!!e&&!e.event,this.valid),this.setHover(-1,!0)}refreshMeadow(e){const t=this.buildings.get(e);if(!t)return;const n=t.scale.clone(),i=t.position.y,r=this.board.get(e);t.scale.setScalar(["house","manor","store","lumber","fisher"].includes(r)?da:["berry","farm"].includes(r)?.75:1),t.position.y=st,t.updateWorldMatrix(!0,!0);const a=rt(e),o=[];t.traverse(l=>{if(l instanceof He&&l.material!==this.contact){const c=new un().setFromObject(l);c.translate(new R(-a.x,0,-a.z)),o.push(c)}}),this.environment.setMeadow(e,o),t.scale.copy(n),t.position.y=i,t.updateWorldMatrix(!0,!0)}sync(e,t=-1,n=0,i=!1){const r=this.buildings.size===0;if(this.board=e,this.villagers.refreshNavigation(),this.trailPoints.some(a=>!e.has(a.tile))){const a=this.trailPoints.filter(o=>e.has(o.tile));this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const o of a)this.addTrail([o,{...o,x:o.x+.001}])}if(r||t>=0||i){this.grid.rebuild(e),this.environment.sync(e,t);const a=[...e.keys()].map(rt);this.cameraControl.frameIsland(a,r);const o=(Math.max(...a.map(h=>h.x))+Math.min(...a.map(h=>h.x)))/2,l=(Math.max(...a.map(h=>h.z))+Math.min(...a.map(h=>h.z)))/2,c=Math.max(3,...a.map(h=>Math.hypot(h.x-o,h.z-l)+2));this.sun.target.position.set(o,0,l),this.sun.position.set(o-5,10,l+4),Object.assign(this.sun.shadow.camera,{left:-c,right:c,top:c,bottom:-c,far:35+c}),this.sun.shadow.camera.updateProjectionMatrix()}if(e.forEach((a,o)=>{const l=this.buildings.get(o);if(!a){l&&(this.root.remove(l),this.buildings.delete(o));return}if(l)return;const c=o===dt&&a==="house"?Xw():Ea(a),h=new He(this.contactGeo,this.contact);h.position.y=.0025,h.renderOrder=1,c.add(h),c.scale.setScalar(["house","manor","store","lumber","fisher"].includes(a)?da:["berry","farm"].includes(a)?.75:1),c.position.copy(vi(o)),this.root.add(c),this.buildings.set(o,c),o===t&&(a==="fisher"&&this.placedManualCell===o&&(c.userData.manualCoast=!0),c.rotation.y=n,c.scale.setScalar(.01),c.visible=!1,c.position.y-=.74,this.builds.push({id:o,group:c,time:0,kind:a}))}),this.alignFisheries(),this.cameraControl.setClearance(Math.max(1.7,...[...this.buildings.values()].map(a=>new un().setFromObject(a).max.y))),r||i)for(const a of e.keys())this.refreshMeadow(a);else t>=0&&this.refreshMeadow(t)}pulse(e,t){const n=new qt({color:t,transparent:!0,opacity:.8,depthWrite:!1}),i=new He(this.ringGeo,n);i.position.copy(vi(e,st+.024)),i.renderOrder=4,this.scene.add(i),this.rings.push({mesh:i,time:0})}burst(e){this.pulse(e,16768922);for(let t=0;t<14;t++){const n=t/14*Math.PI*2,i=new He(this.moteGeo,this.moteMats[t%3]);i.position.copy(vi(e,.18)),i.position.x+=Math.cos(n)*.22,i.position.z+=Math.sin(n)*.22,this.scene.add(i),this.motes.push({mesh:i,velocity:new R(Math.cos(n)*.62,.62+Math.random()*.7,Math.sin(n)*.62),life:1})}}feedback(e,t,n=[]){e.rows.filter(i=>i.wood||i.food||i.happy||!i.active).forEach((i,r)=>{const a=document.createElement("div");a.className="float"+(i.bonus?" bonus":""),a.textContent=[i.wood&&`+${i.wood} odun`,i.food&&`+${i.food} yiyecek`,i.happy&&`+${i.happy} refah`,!i.active&&"İşçi bekliyor"].filter(Boolean).join(" · "),a.style.opacity="0",this.el.append(a),this.labels.push({el:a,position:vi(i.i,1.05),life:1.4,delay:(i.i===t?1.5:.1)+r*.035}),(n.includes(i.i)||i.bonus&&i.i===t)&&this.pulse(i.i,16242041)})}reset(){for(const e of this.fullStores.values())e.remove();this.fullStores.clear(),this.placedManualCell=-1,this.setSelection(null),this.cameraControl.reset(),this.treeCycles.clear(),this.woodHits.clear(),this.fields.clear(),this.harvestParts.clear(),this.loaders.forEach(e=>e.el.remove()),this.loaders.clear(),this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const e of this.drops.values())this.scene.remove(e.group);this.drops.clear(),this.storageDecor.clear(),this.root.clear(),this.environment.reset(),this.buildings.clear(),this.builds=[],this.demolitions=[],this.rotationTargets.clear();for(const{el:e}of this.labels)e.remove();this.labels=[];for(const{mesh:e,dust:t}of this.motes)this.scene.remove(e),t&&e.material.dispose();this.motes=[];for(const{mesh:e}of this.rings)this.scene.remove(e),e.material.dispose();this.rings=[]}frame=e=>{const t=Math.min(.065,(e-this.previousTime)/1e3);if(this.previousTime=e,this.time+=t,this.cameraControl.update(t),this.environment.fitWaterView(this.cameraControl.camera),this.environment.update(this.time),this.onSoundFrame(this.cameraControl.camera,this.cameraControl.audioFocus,this.environment.soundBirds),this.ghost?.visible&&(this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-32*t)),this.ghostModel)){const n=this.desiredGhostYaw-this.ghostModel.rotation.y;if(this.ghostModel.rotation.y+=n*(1-Math.exp(-16*t)),Math.abs(n)>.025&&this.time-this.lastRotationWake>.05&&this.valid(this.hover)){const i=this.ghostModel.rotation.y,r=Math.sign(n),a=this.ghost.position;this.environment.stir(a.x+Math.cos(i)*.68,a.z+Math.sin(i)*.68,-Math.sin(i)*r,Math.cos(i)*r,.32,.1),this.lastRotationWake=this.time}}for(const[n,i]of this.rotationTargets){const r=this.buildings.get(n);if(!r){this.rotationTargets.delete(n);continue}this.villagers.refreshNavigation();const a=i-r.rotation.y;if(r.rotation.y+=a*(1-Math.exp(-16*t)),Math.abs(a)<.001)r.rotation.y=i,this.rotationTargets.delete(n),this.refreshMeadow(n);else if(this.time-this.lastRotationWake>.05){const o=r.rotation.y,l=Math.sign(a);this.environment.stir(r.position.x+Math.cos(o)*.8,r.position.z+Math.sin(o)*.8,-Math.sin(o)*l,Math.cos(o)*l,.35,.1),this.lastRotationWake=this.time}}this.demolitions=this.demolitions.filter(n=>{n.time+=t;const i=Sn(n.time,Kc,Zc);return n.group.position.y=st-1.6*i,n.group.scale.setScalar(1-.7*i),n.group.rotation.z=Math.sin(n.time*25)*Math.sin(i*Math.PI)*.035,n.time>=gp?(this.root.remove(n.group),this.buildings.delete(n.id),this.sync(this.board,-1,0,!0),!1):!0}),this.builds=this.builds.filter(n=>{const i=n.time;if(n.time=Math.min(Zs,n.time+t),n.group.visible=n.time>=ha,n.time<ha)return!0;i<1.42&&n.time>=1.42&&this.burst(n.id);const r=Sn(n.time,ha,Zs),a=Math.sin(Math.PI*r)*.14,o=["house","manor","store","lumber","fisher"].includes(n.kind)?da:["berry","farm"].includes(n.kind)?.75:1;return n.group.scale.set(Math.max(.01,(r+a)*o),Math.max(.01,(r+a*1.6)*o),Math.max(.01,(r+a)*o)),n.group.position.y=st-.24*(1-r),n.kind==="berry"&&n.group.children.forEach(l=>{if(l.userData.plantOrder!==void 0){const c=Sn(n.time,ha+l.userData.plantOrder*.018,Zs);l.scale.setScalar(Math.max(.01,c))}}),n.time>=Zs&&(this.villagers.refreshNavigation(),this.cameraControl.setClearance(Math.max(1.7,...[...this.buildings.values()].map(l=>new un().setFromObject(l).max.y)))),n.time<Zs});for(const[n,i]of this.drops){const r=Number(n.split(":")[0]);if(!this.board.has(r)){this.scene.remove(i.group),this.drops.delete(n);continue}const a=i.age;if(i.age+=t,i.group.visible=i.age>.72,a<=.72&&i.age>.72){this.dust(i.group.position,32);for(let l=0;l<14;l++){const c=new He(this.moteGeo,this.moteMats[2]);c.position.copy(i.group.position).add(new R(0,.1,0)),this.scene.add(c),this.motes.push({mesh:c,velocity:new R((Math.random()-.5)*1.2,.4+Math.random()*.8,(Math.random()-.5)*1.2),life:1.2})}}if(i.age>.72)for(const l of i.pieces)l.velocity.y-=t*3.5,l.mesh.position.addScaledVector(l.velocity,t),l.mesh.position.y<.035&&(l.mesh.position.y=.035,l.velocity.y=Math.abs(l.velocity.y)*.27,l.velocity.x*=.75,l.velocity.z*=.75,l.spin.multiplyScalar(.65)),l.velocity.x*=Math.exp(-t*1.8),l.velocity.z*=Math.exp(-t*1.8),l.mesh.rotation.x+=l.spin.x*t,l.mesh.rotation.z+=l.spin.z*t;for(let l=0;l<i.pieces.length;l++)for(let c=l+1;c<i.pieces.length;c++){const h=i.pieces[l],u=i.pieces[c],f=u.mesh.position.x-h.mesh.position.x,d=u.mesh.position.z-h.mesh.position.z,g=Math.hypot(f,d);if(g>0&&g<.07&&Math.abs(h.mesh.position.y-u.mesh.position.y)<.055){const v=(.07-g)*.5;h.mesh.position.x-=f/g*v,u.mesh.position.x+=f/g*v,h.mesh.position.z-=d/g*v,u.mesh.position.z+=d/g*v}}const o=rt(r);for(const l of i.pieces){const c=i.group.position.x+l.mesh.position.x*1.65-o.x,h=i.group.position.z+l.mesh.position.z*1.65-o.z,u=Math.hypot(c,h);u>.63&&(l.mesh.position.x=(o.x+c/u*.63-i.group.position.x)/1.65,l.mesh.position.z=(o.z+h/u*.63-i.group.position.z)/1.65,l.velocity.x*=-.2,l.velocity.z*=-.2)}}for(const n of this.storageDecor.values()){const i=this.time-(n.userData.upgradedAt??-99);n.scale.setScalar(1+(i<1?Math.sin(i*Math.PI)*.13:0))}this.villagers.update(document.hidden?0:t),this.villagers.updateStatuses(this.cameraControl.camera,this.el.clientWidth,this.el.clientHeight),this.updateStorageLabels();for(const[n,i]of this.woodHits){const r=i-t;n.rotation.x=Math.sin(r*45)*.035*Math.max(0,r/.2),r<=0?(n.rotation.x=0,this.woodHits.delete(n)):this.woodHits.set(n,r)}for(const[n,i]of this.treeCycles){if(!this.board.has(i.id)){this.updateLoader(n,99),this.treeCycles.delete(n);continue}i.age+=t,this.updateLoader(n,i.age),this.board.get(i.id)==="stone"&&i.age<.85?(i.tree.scale.copy(i.scale).multiplyScalar(1-Sn(i.age,0,.85)),i.tree.position.y=-.08*Sn(i.age,0,.85)):i.age<.85?(i.tree.rotation.z=Sn(i.age,0,.85)*1.5,i.tree.scale.copy(i.scale).multiplyScalar(1-.12*i.age/.85)):i.age<26?i.tree.visible=!1:(i.tree.visible=!0,i.tree.rotation.z=0,i.tree.position.y=0,i.tree.scale.copy(i.scale).multiplyScalar(Math.max(.01,Sn(i.age,26,30)))),i.age>=30&&(i.tree.scale.copy(i.scale),this.treeCycles.delete(n),this.villagers.refreshNavigation())}for(const[n,i]of this.fields){if(!this.board.has(n)){this.updateLoader(`field:${n}`,99),this.fields.delete(n);continue}const r=this.board.get(n),a=30;i.stock===0&&(i.age+=t,this.updateLoader(`field:${n}`,i.age),i.age>=a&&(i.stock=i.max,i.age=0));const o=[...this.harvestParts.values()].filter(h=>h.id===n).reduce((h,u)=>h+u.progress,0),l=i.stock===0?Sn(i.age,a-4,a):Math.max(0,(i.stock-o)/i.max),c=this.buildings.get(n)?.children.filter(h=>h.userData.plantOrder!==void 0||h.userData.cropOrder!==void 0||h.userData.flowerOrder!==void 0)??[];c.forEach((h,u)=>{const f=this.time-(h.userData.hitAt??-99);h.rotation.z=f<.55?Math.sin(f*30)*.16*(1-f/.55):0;const d=Ye.clamp(l*c.length-u,0,1);r==="farm"?h.scale.y=(h.userData.cropHeight??1)*(.08+.92*d):h.children.slice(1).forEach(g=>g.scale.setScalar(Math.max(.01,d)))})}this.motes=this.motes.filter(n=>(n.life-=t*(n.dust?1:1.15),n.velocity.y-=t*(n.dust?.12:2.7),n.mesh.position.addScaledVector(n.velocity,t),n.mesh.position.y<st+.015&&(n.mesh.position.y=st+.015,n.velocity.y=Math.abs(n.velocity.y)*.28,n.velocity.x*=.85,n.velocity.z*=.85),n.mesh.scale.setScalar(n.dust?2.5+(1.8-n.life)*3:Math.max(0,Math.min(1.5,n.life))),n.dust&&(n.mesh.material.opacity=Math.min(.42,n.life*.4)),n.life<=0&&(this.scene.remove(n.mesh),n.dust&&n.mesh.material.dispose()),n.life>0)),this.rings=this.rings.filter(n=>{n.time+=t*1.65,n.mesh.scale.setScalar(.4+n.time*1.15);const i=n.mesh.material;return i.opacity=Math.max(0,1-n.time)*.7,n.time>=1&&(this.scene.remove(n.mesh),i.dispose()),n.time<1}),this.labels=this.labels.filter(n=>{if(n.delay>0)return n.delay-=t,!0;n.life-=t,n.position.y+=t*.38;const i=this.projection.copy(n.position).project(this.cameraControl.camera);return n.el.style.left=`${(i.x+1)*.5*this.el.clientWidth}px`,n.el.style.top=`${(1-i.y)*.5*this.el.clientHeight}px`,n.el.style.opacity=String(Math.max(0,Math.min(1,n.life*2.8))),n.life<=0&&n.el.remove(),n.life>0}),this.renderer.render(this.scene,this.cameraControl.camera)};thumbnails(){const e={},t=new Fh;t.add(new Jh(16774109,8557944,1.65));const n=new Gl(16769464,2.55);n.position.set(-3,5,4),t.add(n);const i=new Ar(-.96,.96,.75,-.75,.1,20);i.position.set(2.9,2.25,3.7),i.lookAt(0,.43,0);const r=new Cu({alpha:!0,antialias:!0});r.setSize(280,220),r.toneMapping=ol;for(const a of _i){const o=Ea(a.id);at(o,new It(.72,.75,.068,6),10336124,0,-.034,0),t.add(o),r.render(t,i),e[a.id]=r.domElement.toDataURL(),t.remove(o)}return r.dispose(),r.forceContextLoss(),e}}class $w{constructor(e,t){this.hand=e,this.callbacks=t;const n={signal:this.listeners.signal};e.addEventListener("pointerdown",this.onDown,n),window.addEventListener("pointermove",this.onMove,{...n,passive:!1}),window.addEventListener("pointerup",this.onUp,n),window.addEventListener("pointercancel",this.onPointerCancel,n),e.addEventListener("lostpointercapture",this.onLostCapture,n),e.addEventListener("click",this.onClick,{...n,capture:!0}),e.addEventListener("dragstart",this.onNativeDrag,n),window.addEventListener("keydown",this.onKey,n),window.addEventListener("blur",this.onBlur,n),document.addEventListener("visibilitychange",this.onVisibility,n)}hand;callbacks;gesture=null;listeners=new AbortController;settling=new Set;disposed=!1;animationFrame=0;cardFrom(e){if(!(e instanceof Element))return null;const t=e.closest("[data-card]");return t&&this.hand.contains(t)?t:null}isAvailable(e,t){return Number.isInteger(t)&&!e.matches(':disabled, [disabled], [aria-disabled="true"]')&&this.callbacks.canStart(t)}onDown=e=>{if(this.disposed||this.gesture||!e.isPrimary||e.button!==0)return;const t=this.cardFrom(e.target);if(!t)return;const n=Number(t.dataset.card);if(!this.isAvailable(t,n))return;const i=t.getBoundingClientRect(),r=t.offsetWidth||i.width,a=t.offsetHeight||i.height;this.gesture={pointerId:e.pointerId,index:n,source:t,origin:i,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,width:r,height:a,anchorX:Math.min(1,Math.max(0,(e.clientX-i.left)/i.width)),anchorY:Math.min(1,Math.max(0,(e.clientY-i.top)/i.height)),started:!1,valid:!1,ghost:null,visualX:e.clientX,visualY:e.clientY,tilt:0,visualTilt:0},e.preventDefault();try{this.hand.setPointerCapture(e.pointerId)}catch{}};onMove=e=>{const t=this.gesture;if(!(!t||e.pointerId!==t.pointerId)){if(e.preventDefault(),!t.started){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<4)return;if(!this.isAvailable(t.source,t.index)){this.cancel();return}t.started=!0,t.visualX=e.clientX,t.visualY=e.clientY;const n=t.source.cloneNode(!0);n.removeAttribute("id"),n.removeAttribute("data-card"),n.removeAttribute("aria-pressed"),n.querySelectorAll("[id]").forEach(i=>i.removeAttribute("id")),n.classList.remove("selected","drag-source"),n.classList.add("drag-card"),n.setAttribute("aria-hidden","true"),n.setAttribute("inert",""),n.tabIndex=-1,Object.assign(n.style,{position:"fixed",left:"0",top:"0",margin:"0",width:`${t.width}px`,height:`${t.height}px`,pointerEvents:"none",zIndex:"100",transition:"none",transformOrigin:"50% 50%",willChange:"transform"}),t.ghost=n,document.body.append(n),document.body.classList.add("is-dragging"),this.callbacks.start(t.index),this.hand.querySelector(`[data-card="${t.index}"]`)?.classList.add("drag-source"),t.source.classList.add("drag-source"),this.follow(t,performance.now())}this.gesture===t&&(t.valid=this.callbacks.move(e.clientX,e.clientY),t.ghost?.classList.toggle("drop-valid",t.valid),t.ghost?.classList.toggle("drop-invalid",!t.valid),t.tilt=Math.max(-7,Math.min(7,(e.clientX-t.lastX)*.22)),t.lastX=e.clientX,t.lastY=e.clientY)}};follow(e,t){if(this.gesture!==e||!e.ghost)return;const n=performance.now(),i=Math.min(.05,Math.max(.001,(n-t)/1e3)),r=1-Math.exp(-38*i);e.visualX+=(e.lastX-e.visualX)*r,e.visualY+=(e.lastY-e.visualY)*r,e.visualTilt+=(e.tilt-e.visualTilt)*(1-Math.exp(-22*i)),e.tilt*=Math.exp(-12*i),e.ghost.style.transform=this.followTransform(e),this.animationFrame=requestAnimationFrame(()=>this.follow(e,n))}followTransform(e){const n=e.visualX-e.width*(.5+(e.anchorX-.5)*.84),i=e.visualY-e.height*(.5+(e.anchorY-.5)*.84);return`translate3d(${n}px, ${i}px, 0) rotate(${e.visualTilt}deg) scale(${.84})`}onUp=e=>{const t=this.gesture;if(!t||e.pointerId!==t.pointerId||(!t.started&&Math.hypot(e.clientX-t.startX,e.clientY-t.startY)>=4&&this.onMove(e),this.gesture!==t))return;if(this.release(t),!t.started){this.isAvailable(t.source,t.index)&&this.callbacks.tap(t.index);return}t.lastX=e.clientX,t.lastY=e.clientY;const i=this.callbacks.move(e.clientX,e.clientY)&&this.callbacks.drop(e.clientX,e.clientY);i||this.callbacks.cancel(),this.settle(t,i)};release(e){this.gesture=null,cancelAnimationFrame(this.animationFrame),this.animationFrame=0,document.body.classList.remove("is-dragging"),e.source.classList.remove("drag-source"),this.hand.querySelectorAll(".drag-source").forEach(t=>t.classList.remove("drag-source")),this.hand.hasPointerCapture(e.pointerId)&&this.hand.releasePointerCapture(e.pointerId)}settle(e,t){const n=e.ghost;if(!n)return;if(t){n.remove();return}n.classList.remove("drop-valid","drop-invalid"),this.settling.add(n);const r=this.hand.querySelector(`[data-card="${e.index}"]`)?.getBoundingClientRect()??e.origin,a=r.left+(r.width-e.width)/2,o=r.top+(r.height-e.height)/2,l=t?`translate3d(${e.lastX-e.width/2}px, ${e.lastY-e.height/2}px, 0) scale(.15)`:`translate3d(${a}px, ${o}px, 0) rotate(0deg) scale(1)`,c=matchMedia("(prefers-reduced-motion: reduce)").matches?0:t?180:280;n.animate([{transform:n.style.transform||this.followTransform(e),opacity:1},{transform:l,opacity:t?0:.2}],{duration:c,easing:"cubic-bezier(.2,.8,.25,1)",fill:"forwards"}).finished.catch(()=>{}).then(()=>{n.remove(),this.settling.delete(n)})}cancel(){const e=this.gesture;e&&(this.release(e),e.started&&(this.callbacks.cancel(),this.settle(e,!1)))}onClick=e=>{const t=this.cardFrom(e.target);if(t&&(e.preventDefault(),e.stopImmediatePropagation(),e.detail===0&&!this.gesture)){const n=Number(t.dataset.card);this.isAvailable(t,n)&&this.callbacks.tap(n)}};onNativeDrag=e=>{e.preventDefault()};onPointerCancel=e=>{e.pointerId===this.gesture?.pointerId&&this.cancel()};onLostCapture=e=>{e.pointerId===this.gesture?.pointerId&&this.cancel()};onKey=e=>{e.key==="Escape"&&this.gesture&&(e.preventDefault(),this.cancel())};onBlur=()=>{this.cancel()};onVisibility=()=>{document.hidden&&this.cancel()};dispose(){this.cancel(),this.disposed=!0,this.listeners.abort(),this.settling.forEach(e=>{e.getAnimations().forEach(t=>t.cancel()),e.remove()}),this.settling.clear()}}const xf={hover:[["card-slide-1","card-slide-3"],.16],lift:[["card-fan-1","card-fan-2"],.39],drop:[["card-place-1","card-place-3"],.45],earth:[["footstep_grass_001","footstep_grass_003"],.46],build:[["impactWood_light_000","impactWood_light_003"],.33],reward:[["chip-lay-2"],.22],bonus:[["chips-stack-3"],.3],turn:[["card-shove-2"],.2],invalid:[["impactSoft_medium_002"],.27]},ua=["seagull-1","seagull-2","seagull-3"],yf=s=>Math.max(0,Math.min(1,s));class Yw{muted=!1;levels={master:.72,sfx:.7,ambience:.36};ctx=null;buses={};wave=null;clips=new Map;live=new Set;pending=new Set;lastHover=0;birdVoice=null;birdClipIndex=0;nextBirdAt=3;lastSpatial=-1;ear=new R;forward=new R;up=new R;birdPosition=new R;projected=new R;constructor(){try{const t=JSON.parse(localStorage.getItem("lk-audio-v2")||"{}");this.muted=typeof t.muted=="boolean"?t.muted:localStorage.getItem("lk-mute")==="1";for(const n of Object.keys(this.levels))Number.isFinite(t[n])&&(this.levels[n]=yf(t[n]))}catch{}const e=()=>this.unlock();window.addEventListener("pointerdown",e,{passive:!0}),window.addEventListener("keydown",e),document.addEventListener("visibilitychange",()=>{document.hidden&&this.cancel(),this.apply()})}unlock(){if(window.AudioContext){if(!this.ctx){this.ctx=new AudioContext;const e=this.ctx.createGain();e.connect(this.ctx.destination),this.buses.master=e;for(const o of["sfx","ambience"]){const l=this.ctx.createGain();l.connect(e),this.buses[o]=l}const t=new Audio(new URL("audio/shore.mp3",document.baseURI).href);t.preload="none",t.loop=!0,this.wave=t;const n=this.ctx.createChannelSplitter(2),i=this.ctx.createChannelMerger(2),r=this.ctx.createGain();r.gain.value=.8,this.ctx.createMediaElementSource(t).connect(n);for(const[o,l,c]of[[0,0,1.1],[1,1,1.1],[0,1,-.1],[1,0,-.1]]){const h=this.ctx.createGain();h.gain.value=c,n.connect(h,o),h.connect(i,0,l)}i.connect(r).connect(this.buses.ambience);const a=new Set(Object.values(xf).flatMap(([o])=>[...o]));for(const o of a)fetch(new URL("audio/"+o+".ogg",document.baseURI)).then(l=>{if(!l.ok)throw Error(o);return l.arrayBuffer()}).then(l=>this.ctx.decodeAudioData(l)).then(l=>this.clips.set(o,l)).catch(()=>{});for(const o of ua)fetch(new URL(`audio/${o}.mp3`,document.baseURI)).then(l=>{if(!l.ok)throw Error(o);return l.arrayBuffer()}).then(l=>this.ctx.decodeAudioData(l)).then(l=>this.clips.set(o,this.pointSourceBuffer(l))).catch(()=>{});this.nextBirdAt=this.ctx.currentTime+3,this.apply()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0&&this.wave.play().catch(()=>{})}}set(e,t){this.levels[e]=yf(t),this.apply(),this.save()}toggle(){this.muted=!this.muted,this.apply(),this.save()}save(){try{localStorage.setItem("lk-audio-v2",JSON.stringify({...this.levels,muted:this.muted}))}catch{}}apply(){if(this.ctx){for(const e of["master","sfx","ambience"]){const t=e==="master"&&(this.muted||document.hidden)?0:this.levels[e];this.buses[e]?.gain.setTargetAtTime(t*t,this.ctx.currentTime,.035)}this.muted||document.hidden||!this.levels.ambience||!this.levels.master?(this.wave?.pause(),this.stopBird(),this.ctx&&(this.nextBirdAt=this.ctx.currentTime+3)):this.wave?.paused&&this.wave.play().catch(()=>{})}}pointSourceBuffer(e){const t=new Float32Array(e.length);for(let m=0;m<e.numberOfChannels;m++){const p=e.getChannelData(m);for(let x=0;x<t.length;x++)t[x]+=p[x]/e.numberOfChannels}const n=Math.max(1,Math.floor(e.sampleRate*.1)),i=[];for(let m=0;m<t.length;m+=n){let p=0;for(let x=m;x<Math.min(t.length,m+n);x++)p+=t[x]*t[x];i.push(p)}const r=Math.min(e.length,Math.floor(e.sampleRate*5)),a=Math.ceil(r/n);let o=0,l=-1,c=0;for(let m=0;m<i.length;m++)c+=i[m],m>=a&&(c-=i[m-a]),m>=a-1&&c>l&&(l=c,o=Math.min((m-a+1)*n,t.length-r));const h=this.ctx.createBuffer(1,r,e.sampleRate),u=h.getChannelData(0);u.set(t.subarray(o,o+r));let f=0,d=0;for(const m of u)f+=m*m,d=Math.max(d,Math.abs(m));const g=Math.sqrt(f/Math.max(1,u.length)),v=Math.min(3,.14/Math.max(.001,g),.85/Math.max(.001,d));for(let m=0;m<u.length;m++)u[m]*=v;return h}updateSpatial(e,t,n){const i=this.ctx;if(!i||i.state!=="running"||this.muted||document.hidden||!this.levels.ambience||!this.levels.master)return;const r=i.currentTime;if(r-this.lastSpatial<1/30)return;this.lastSpatial=r,e.getWorldDirection(this.forward),this.up.set(0,1,0).applyQuaternion(e.quaternion),this.ear.copy(t).addScaledVector(this.forward,-8/Math.max(.5,e.zoom));const a=i.listener;if(a.positionX)for(const[c,h]of[[a.positionX,this.ear.x],[a.positionY,this.ear.y],[a.positionZ,this.ear.z],[a.forwardX,this.forward.x],[a.forwardY,this.forward.y],[a.forwardZ,this.forward.z],[a.upX,this.up.x],[a.upY,this.up.y],[a.upZ,this.up.z]])c.setTargetAtTime(h,r,.06);else a.setPosition(this.ear.x,this.ear.y,this.ear.z),a.setOrientation(this.forward.x,this.forward.y,this.forward.z,this.up.x,this.up.y,this.up.z);if(this.birdVoice&&r>this.birdVoice.endsAt+.5&&this.stopBird(),!this.birdVoice&&r>=this.nextBirdAt&&n.length){let c,h=1/0;for(const u of n){u.getWorldPosition(this.birdPosition),this.projected.copy(this.birdPosition).project(e);const f=this.birdPosition.distanceTo(this.ear)+(Math.abs(this.projected.x)>1.15||Math.abs(this.projected.y)>1.15?5:0);f<h&&(h=f,c=u)}c&&this.startBird(c,r)}const o=this.birdVoice;if(!o)return;o.bird.getWorldPosition(this.birdPosition),o.panner.positionX?(o.panner.positionX.setTargetAtTime(this.birdPosition.x,r,.06),o.panner.positionY.setTargetAtTime(this.birdPosition.y,r,.06),o.panner.positionZ.setTargetAtTime(this.birdPosition.z,r,.06)):o.panner.setPosition(this.birdPosition.x,this.birdPosition.y,this.birdPosition.z);const l=this.birdPosition.distanceTo(this.ear);o.filter.frequency.setTargetAtTime(Ye.lerp(6500,1500,Ye.smoothstep(l,3,20)),r,.12)}startBird(e,t){const n=this.ctx;let i;for(let u=0;u<ua.length;u++){const f=ua[this.birdClipIndex++%ua.length];if(i=this.clips.get(f),i)break}if(!i){this.nextBirdAt=t+5;return}const r=n.createBufferSource(),a=n.createPanner(),o=n.createGain(),l=n.createBiquadFilter();r.buffer=i,a.panningModel="HRTF",a.distanceModel="inverse",a.refDistance=3.5,a.rolloffFactor=.9,a.maxDistance=40,e.getWorldPosition(this.birdPosition),a.setPosition(this.birdPosition.x,this.birdPosition.y,this.birdPosition.z),l.type="lowpass",l.frequency.value=4e3,l.Q.value=.3;const c=Math.min(5,i.duration);o.gain.setValueAtTime(0,t),o.gain.linearRampToValueAtTime(.6,t+.25),o.gain.setValueAtTime(.6,t+Math.max(.25,c-.65)),o.gain.linearRampToValueAtTime(0,t+c),r.connect(l).connect(a).connect(o).connect(this.buses.ambience);const h={source:r,panner:a,gain:o,filter:l,bird:e,endsAt:t+c};this.birdVoice=h,this.nextBirdAt=t+22+Math.random()*4,r.onended=()=>{r.disconnect(),l.disconnect(),a.disconnect(),o.disconnect(),this.birdVoice===h&&(this.birdVoice=null)},r.start(t,0,c)}stopBird(){const e=this.birdVoice;if(!e)return;this.birdVoice=null;const t=this.ctx.currentTime;e.gain.gain.cancelScheduledValues(t),e.gain.gain.setValueAtTime(e.gain.gain.value,t),e.gain.gain.linearRampToValueAtTime(0,t+.08),e.source.stop(t+.1)}resetAmbience(){this.stopBird(),this.birdClipIndex=0,this.lastSpatial=-1,this.nextBirdAt=(this.ctx?.currentTime??0)+3}play(e){if(this.muted||document.hidden||!this.ctx||this.ctx.state!=="running"||this.live.size>=3)return;if(e==="hover"){if(performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}const[t,n]=xf[e],i=this.clips.get(t[Math.floor(Math.random()*t.length)]);if(!i)return;const r=this.ctx.createBufferSource();r.buffer=i,r.playbackRate.value=.92+Math.random()*.1;const a=this.ctx.createGain();a.gain.value=n*(.9+Math.random()*.13),r.connect(a).connect(this.buses.sfx),r.onended=()=>{this.live.delete(r),r.disconnect(),a.disconnect()},this.live.add(r),r.start()}sequence(e,t,n){this.cancel(),this.play("drop");const i=(r,a)=>{const o=window.setTimeout(()=>{this.pending.delete(o),this.play(r)},a);this.pending.add(o)};e||i("earth",145),t&&i("build",325),i(n?"bonus":"reward",520),i("turn",855)}cancel(){for(const e of this.pending)clearTimeout(e);this.pending.clear()}}const Qc=document.querySelector("#app");Qc.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${fn("help")}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${fn("reset")}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <button id="population-toggle" aria-expanded="false" aria-controls="work-panel">${fn("people")}<span>Görevler</span><b id="population-badge">1</b></button>
 <section id="work-panel" hidden aria-label="Nüfus görev dağılımı"><header><strong>İş öncelikleri</strong><button data-work-balance>Dengele</button><button data-work-close aria-label="Kapat">×</button></header><p id="work-summary"></p><div id="work-rows"></div></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;const Ie=s=>Qc.querySelector(s),Yi=Ie("#hand"),za=Ie("#placement"),Ta=Ie("#log"),xn=Ie("dialog"),Qe=new jw(Ie("#world")),qw=Qe.thumbnails(),an=new Yw;Qe.onSoundFrame=(s,e,t)=>an.updateSpatial(s,e,t);let Me=new Ef,Wt=null,Ns,hc,Us=!1,ws=null,Hi=-1;function eh(s){return s.cost<=Me.wood&&(s.id!=="festival"||Me.food>=3)}function Si(s,e=!1){s||(ws=null),Wt=s,Ie("#event-target").hidden=!s?.event,Qe.setSelection(s,e),Yi.classList.toggle("choosing",!!s),Yi.querySelectorAll("[data-card]").forEach(t=>{const n=!!s&&Me.hand[Number(t.dataset.card)]===s;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),Ie(".hand-label span").textContent=s?s.event?"Adanın üzerine bırak":"Kıyıya bırak · Tekerlek / R ile döndür":"Bir kartı adaya sürükle"}function ir(s){za.textContent=s,za.hidden=!s}Qe.valid=s=>!!Wt&&s>=0&&Me.valid(Wt,s);Qe.onHover=s=>{if(!Wt||s<0){ir("");return}if(!Qe.valid(s)){ir(Wt.event?"Mevcut karaya bırak":Me.wouldSealFishery(s)?"Balıkçının son kıyısı açık kalmalı":"Yalnızca kıyıdaki boş bir altıgene bırak"),za.dataset.valid="false";return}if(za.dataset.valid="true",Wt.event){ir(Wt.desc);return}const e=Me.preview(Wt,s),t=[e.stone&&`+${e.stone} taş / teslimat`,e.wood&&`+${e.wood} odun / teslimat`,e.food&&`+${e.food} yiyecek / teslimat`,e.happy&&`+${e.happy} refah / teslimat`,e.people&&`+${e.people} nüfus`].filter(Boolean),n=e.localBonus||e.neighbors.length>0;ir((n?"Komşuluk · ":"")+(t.join("  ·  ")||"Yerleşime uygun"))};function th(s){clearTimeout(hc),Ta.textContent=s,Ta.classList.add("visible"),hc=window.setTimeout(()=>Ta.classList.remove("visible"),2400)}function eo(s){if(!Wt||s<0||!Qe.valid(s))return!1;if(Us)return ws=s,Qe.holdSelection(),ir("Ada hazırlanıyor…"),!0;const e=Qe.placementRotation,t=Wt,n=Me.preview(t,s);return Me.play(t,s)?(Us=!0,an.sequence(!!t.event,["house","manor","store","lumber"].includes(t.id),n.localBonus||n.neighbors.length>0),Si(null),Qe.sync(Me.board,t.event?-1:s,e),t.event&&Qe.burst(s),sh(),th(t.event?`${t.name} uygulandı`:`${t.name} · yerleşim hazırlanıyor`),Yi.animate([{opacity:.35,transform:"translateY(17px)"},{opacity:1,transform:"translateY(0)"}],{duration:330,easing:"ease-out"}),clearTimeout(Ns),Ns=window.setTimeout(nh,2e3),!0):!1}function nh(){if(Qe.placing){Ns=window.setTimeout(nh,100);return}if(Us=!1,ws!==null){const s=ws;ws=null,eo(s)}}Qe.onTileSelect=s=>{Hi=s;const e=Ie("#tile-editor");if(e.hidden=s<0,s<0){Ie("#storage-upgrade").hidden=!0;return}Ie("#tile-editor strong").textContent=s===dt?"Krallık merkezi":_i.find(n=>n.id===Me.board.get(s))?.name??"Yerleşim",Ie("#tile-editor small").textContent=s===dt?"Merkez korunur · R / tekerlek ile döndür":"R / tekerlek · Silmede kaynak iadesi yok";const t=Ie("[data-tile-delete]");t.disabled=s===dt,t.title=s===dt?"Krallık merkezi silinemez":"Yapı ve toprak denize çöker",ih()};function ih(){const s=Ie("#storage-upgrade"),e=Hi;if(s.hidden=!Me.storageStocks.has(e),s.hidden)return;const t=Me.storageUsed(e),n=Me.storageCapacity(e),i=Me.upgradeCost(e);Ie("#storage-meter").textContent=`Seviye ${Me.storageLevels.get(e)} · ${t} / ${n} dolu`;const r=Ie("#storage-progress");r.max=n,r.value=t;const a=Ie("#upgrade-store");a.innerHTML=`${fn("carry")} ${n} → ${n+(e===dt?80:60)} kapasite <span>${fn("wood")} ${i} · Yükselt</span>`,a.disabled=Me.wood<i,a.title=`Kapasite +${e===dt?80:60}`}Ie("#upgrade-store").onclick=()=>{Me.upgradeStore(Hi)&&(Qe.upgradeStorage(Hi),io(),ih(),an.play("build"),th(`Depo yükseltildi · Seviye ${Me.storageLevels.get(Hi)} · ${Me.storageCapacity(Hi)} kapasite`))};Ie("[data-tile-left]").onclick=()=>Qe.rotateSelection(-1);Ie("[data-tile-right]").onclick=()=>Qe.rotateSelection(1);Ie("[data-tile-close]").onclick=()=>Qe.editTile(-1);Ie("[data-tile-delete]").onclick=()=>{const s=Hi;Qe.placing||!Me.remove(s)||(Us=!0,to.cancel(),Si(null),Qe.demolish(Me.board,s),sh(),th("Yerleşim kaldırıldı · kaynak iadesi yok"),clearTimeout(Ns),Ns=window.setTimeout(nh,1500))};Qe.onPick=eo;Ie("#event-target").onclick=()=>{Wt?.event&&eo(dt)};function bf(s,e){return Wt?.event&&document.elementFromPoint(s,e)?.closest("#event-target")?dt:Qe.point(s,e)}Yi.addEventListener("pointerover",s=>{const e=s.target.closest("button");e&&!e.disabled&&!e.contains(s.relatedTarget)&&!Us&&!Wt&&an.play("hover")});const to=new $w(Yi,{canStart:s=>ws===null&&!xn.open&&!!Me.hand[s]&&eh(Me.hand[s]),start:s=>{an.play("lift"),Si(Me.hand[s],!0)},move:(s,e)=>Qe.valid(bf(s,e)),drop:(s,e)=>eo(bf(s,e)),cancel:()=>{an.play("invalid"),Si(null)},tap:s=>{const e=Me.hand[s];Si(Wt===e?null:e)}}),Mf={stone:"Taş",wood:"Odun",berry:"Çilek",farm:"Buğday",fish:"Balık"},Kw={stone:"stone",wood:"wood",berry:"berry",farm:"wheat",fish:"fish"};Ie("#work-rows").innerHTML=fr.map(s=>`<label class="work-row" data-work="${s}"><span>${fn(Kw[s])}<b>${Mf[s]}</b><small></small><em></em></span><input type="range" min="0" max="100" value="${Me.priorities[s]}" aria-label="${Mf[s]} iş önceliği" data-priority="${s}"></label>`).join("");function no(){const s=Qe.villagers.assignedCounts(),e=Me.workTargets();Ie("#population-badge").textContent=String(Me.people),Ie("#work-summary").textContent=`${Qe.villagers.working} çalışıyor · ${Math.max(0,Me.people-Qe.villagers.working)} boşta`;for(const t of fr){const n=Ie(`[data-work="${t}"]`),i=n.querySelector("input");document.activeElement!==i&&(i.value=String(Me.priorities[t])),n.querySelector("small").textContent=`${s[t]} / ${e[t]} kişi`,n.querySelector("em").textContent=`%${Me.priorities[t]}`,n.classList.toggle("inactive",![...Me.board.keys()].some(r=>Me.categoryFor(r)===t))}}function Tp(){const s=Ie("#work-panel");s.hidden=!s.hidden,Ie("#population-toggle").setAttribute("aria-expanded",String(!s.hidden)),no()}Ie("#population-toggle").onclick=Tp;Ie("[data-work-close]").onclick=()=>{Ie("#work-panel").hidden=!0,Ie("#population-toggle").setAttribute("aria-expanded","false")};Ie("[data-work-balance]").onclick=()=>{Me.priorities={wood:20,stone:20,berry:20,farm:20,fish:20},Qe.villagers.rebalance(),no()};Qc.querySelectorAll("[data-priority]").forEach(s=>s.oninput=()=>{Me.setPriority(s.dataset.priority,Number(s.value)),Qe.villagers.rebalance(),no()});function Ap(){const s=Ie("#food-details");s.innerHTML=["berry","wheat","fish"].map(e=>`<span>${fn(e)}<small>${e==="berry"?"Çilek":e==="wheat"?"Buğday":"Balık"}</small><b>${Me.foods[e]}</b></span>`).join("")+`<em>−${Me.foodPerMinute} / dk · ${Me.people} sakin</em>`}function Sf(){const s=Ie("#food-details"),e=Ie('[data-resource="food"]').getBoundingClientRect();Ap(),s.hidden=!1,s.style.left=`${Math.max(12,Math.min(innerWidth-s.offsetWidth-12,e.left+e.width/2-s.offsetWidth/2))}px`,s.style.top=`${e.bottom+14}px`}const Ba=new Map;function Zw(s,e){const t=Ie(`[data-resource="${s}"] b`),n=Ba.get(s);if(!n){t.textContent=String(e),Ba.set(s,{value:e,target:e,frame:0});return}if(n.target===e)return;cancelAnimationFrame(n.frame);const i=n.value,r=n.target,a=performance.now();n.target=e,t.dataset.change=e>r?"up":"down";const o=l=>{const c=Math.min(1,(l-a)/550);n.value=i+(e-i)*(1-(1-c)**3),t.textContent=String(Math.round(n.value)),c<1?n.frame=requestAnimationFrame(o):(t.textContent=String(e),window.setTimeout(()=>{n.target===e&&delete t.dataset.change},500))};n.frame=requestAnimationFrame(o)}function io(){const s=Ie("#stats");s.children.length||(s.innerHTML=[["wood","Odun"],["stone","Taş"],["food","Yiyecek"],["people","Nüfus"],["happy","Refah"]].map(([t,n])=>`<div class="resource" data-resource="${t}">${fn(t)}<div><small>${n}</small><b>0</b></div><em></em></div>`).join(""));const e=Ie('[data-resource="food"]');e.onmouseenter=Sf,e.onmouseleave=()=>Ie("#food-details").hidden=!0,e.onfocus=Sf,e.onblur=()=>Ie("#food-details").hidden=!0,e.tabIndex=0,e.setAttribute("aria-describedby","food-details"),Ie('[data-resource="people"]').onclick=Tp;for(const t of["wood","stone","food","people","happy"])Zw(t,t==="happy"?Math.round(Me.happy):Me[t]),Ie(`[data-resource="${t}"] em`).textContent=t==="people"?`${Qe.villagers.working}/${Me.people} çalışıyor`:t==="happy"?"Köyün ruhu":t==="food"?`−${Me.foodPerMinute}/dk`:"Depoda";Yi.querySelectorAll("[data-card]").forEach(t=>{const n=Me.hand[Number(t.dataset.card)];t.disabled=!n||!eh(n)}),no(),ih(),Ie("#food-details").hidden||Ap()}function sh(){io(),Yi.innerHTML=Me.hand.map((s,e)=>`<button class="card tone-${s.id}" data-card="${e}" aria-pressed="false" ${eh(s)?"":"disabled"}>
    <span class="cost" title="${s.cost} odun">${fn("wood")}${s.cost}</span><span class="type">${s.event?"ANLIK":s.workers?"ÜRETİM":"YERLEŞİM"}</span>
    <img src="${qw[s.id]}" alt="" draggable="false"><strong>${s.name}</strong><span class="rule"></span><span class="effect">${s.desc}</span><small>${s.bonus}</small>
  </button>`).join("")}Qe.onDelivery=(s,e,t,n)=>{const i=Me.deliver(s,e,t,n);if(!i)return 0;io(),an.play("reward");const r=Ie(`[data-resource="${t}"]`),a=r.getBoundingClientRect(),o=Qe.screenPoint(e,.6),l=document.createElement("div");l.className=`delivery-spark ${t}`,l.innerHTML=`${fn(t==="food"?Me.board.get(s)==="fisher"?"fish":Me.board.get(s)==="farm"?"wheat":"berry":t)}<b>+${i}</b>`,document.body.append(l);const c=a.left+a.width/2,h=a.top+a.height/2;return l.animate([{transform:`translate(${o.x}px,${o.y}px) scale(.7)`,opacity:0},{transform:`translate(${o.x}px,${o.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${c}px,${h}px) scale(.5)`,opacity:0}],{duration:950,easing:"cubic-bezier(.3,.65,.3,1)"}).finished.catch(()=>{}).then(()=>l.remove()),r.animate([{transform:"scale(1)",backgroundColor:"transparent"},{transform:"scale(1.10)",backgroundColor:"#d8e6b4"},{transform:"scale(1)",backgroundColor:"transparent"}],{duration:650}),i};Qe.onInspect=(s,e,t,n)=>{const i=Ie("#tile-tooltip");if(s<0||!n||Wt||xn.open){i.hidden=!0;return}const r=Me.board.get(s),a=_i.find(m=>m.id===r),o=Me.productAt(s),l=[];s===dt?l.push("Merkez deposu",`${Me.storageUsed(s)} / ${Me.storageCapacity(s)} dolu`):r==="store"?l.push(`${Me.storageUsed(s)} / ${Me.storageCapacity(s)} dolu`,"Tıkla · kapasiteyi yükselt"):o?l.push(`+${o.amount} ${o.resource==="stone"?"taş":o.resource==="wood"?"odun":o.resource==="food"?r==="fisher"?"balık":r==="farm"?"buğday":"çilek":"refah"} / teslimat`,`${Qe.villagers.assignedTo(s)} / ${o.capacity} çalışan`,"Ürünler depoya taşınır"):r==="house"||r==="manor"?l.push(`${Me.residents.filter(m=>m.home===s).length} sakinin evi`,"Sakinler yakındaki işlere yürüyerek gider"):r==="lumber"?l.push("Komşu ormanlara +2 odun","Oduncular komşu ormanlarda çalışır"):a&&l.push(a.desc,a.bonus);const c=s===dt?"crest":{forest:"wood",stone:"stone",berry:"berry",farm:"wheat",fisher:"fish",store:"carry",house:"people",manor:"people",lumber:"wood",garden:"garden"}[r??""]??"garden";i.querySelector("strong").innerHTML=`${fn(c)}<span>${s===dt?"Krallık merkezi":a?.name??"Yerleşim"}</span>`,i.querySelector("div").innerHTML=l.map(m=>`<span>${m}</span>`).join(""),i.hidden=!1;const h=i.offsetWidth,u=i.offsetHeight,f=14;let d=e+26,g=t+22;d<n.right+8&&d+h>n.left-8&&g<n.bottom+8&&g+u>n.top-8&&(d=n.right+f,g=t-u/2),d+h>innerWidth-f&&(d=n.left-h-f,g=t-u/2),d<f&&(d=Math.max(f,Math.min(innerWidth-h-f,e-h/2)),g=n.top-u-f,g<f&&(g=n.bottom+f)),i.style.left=`${Math.max(f,Math.min(innerWidth-h-f,d))}px`,i.style.top=`${Math.max(f,Math.min(innerHeight-u-f,g))}px`};window.setInterval(io,200);function Rp(s){to.cancel(),Si(null),xn.innerHTML=s,xn.open||xn.showModal();const e=xn.querySelector("[data-audio]");e&&(e.onclick=()=>{an.toggle(),e.textContent=an.muted?"Ses kapalı":"Ses açık"}),xn.querySelectorAll("input[data-level]").forEach(t=>{t.oninput=()=>an.set(t.dataset.level,Number(t.value)/100)}),xn.querySelector("[data-close]")?.addEventListener("click",()=>xn.close()),xn.querySelector("[data-new]")?.addEventListener("click",()=>{xn.close(),Cp()})}function Cp(){clearTimeout(Ns),clearTimeout(hc),Ta.classList.remove("visible"),document.querySelectorAll(".delivery-spark").forEach(s=>s.remove()),Ie("#food-details").hidden=!0,Ie("#work-panel").hidden=!0,Ie("#population-toggle").setAttribute("aria-expanded","false"),to.cancel(),an.cancel(),an.resetAmbience();for(const s of Ba.values())cancelAnimationFrame(s.frame);Ba.clear(),Me=new Ef,Wt=null,Us=!1,Qe.reset(),Qe.sync(Me.board),Qe.bindGame(Me),Si(null),sh()}Ie("#restart").onclick=()=>Rp("<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>");Ie("#help").onclick=()=>Rp(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Sağ alttaki Görevler panelinden odun, taş, çilek, buğday ve balık işlerinin önceliğini değiştirebilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · ortala<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><div class="mixer">${["master","sfx","ambience"].map((s,e)=>`<label>${["Genel ses","Efektler","Kıyı ambiyansı"][e]}<input data-level="${s}" aria-label="${["Genel ses","Efektler","Kıyı ambiyansı"][e]}" type="range" min="0" max="100" value="${Math.round(an.levels[s]*100)}"></label>`).join("")}</div><button data-audio>Ses ${an.muted?"kapalı":"açık"}</button><button data-close>Oyuna dön</button>`);document.addEventListener("keydown",s=>{s.key==="Escape"&&!xn.open&&(to.cancel(),Si(null))});Cp();
