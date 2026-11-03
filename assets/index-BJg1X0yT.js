(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Si=1.03,bf=Math.sqrt(3),ps=64,cr=129,Pp=[{q:1,r:0},{q:0,r:1},{q:-1,r:1},{q:-1,r:0},{q:0,r:-1},{q:1,r:-1}];function lc(s,e){return Number.isInteger(s)&&Number.isInteger(e)&&Math.abs(s)<=ps&&Math.abs(e)<=ps?(s+ps)*cr+e+ps:-1}const pt=lc(0,0);function wa(s){return{q:Math.floor(s/cr)-ps,r:s%cr-ps}}function tn(s){if(!Number.isInteger(s)||s<0||s>=cr*cr)return[];const{q:e,r:t}=wa(s);return Pp.map(n=>lc(e+n.q,t+n.r))}function rt(s){const{q:e,r:t}=wa(s);return{x:Si*bf*(e+t/2),z:Si*1.5*t}}function Wt(s,e){const t=(s/bf-e/3)/Si,n=2*e/3/Si,i=-t-n;let r=Math.round(t),a=Math.round(n);const o=Math.round(i),l=Math.abs(r-t),c=Math.abs(a-n),u=Math.abs(o-i);return l>c&&l>u?r=-a-o:c>u&&(a=-r-o),lc(r,a)}function Lp(s){const e=new Set;for(const t of s.keys())for(const n of tn(t))n>=0&&!s.has(n)&&e.add(n);return[...e]}function Dp(s,e){return e>=0&&!s.has(e)&&tn(e).some(t=>s.has(t))}function ur(s,e=Si){const t=(s-.5)*Math.PI/3;return{x:Math.cos(t)*e,z:Math.sin(t)*e}}function ua(s){const e=[];for(const t of s.keys()){const n=rt(t);tn(t).forEach((i,r)=>{if(s.has(i))return;const a=ur(r),o=ur(r+1);e.push({id:t,side:r,ax:n.x+a.x,az:n.z+a.z,bx:n.x+o.x,bz:n.z+o.z})})}return e}const vi=[{id:"stone",name:"Taş Ocağı",cost:3,workers:2,desc:"+3 taş / teslimat",bonus:"Kazmayla çıkarılır · yeniden oluşur"},{id:"fisher",name:"Balıkçı Kulübesi",cost:7,workers:1,desc:"+3 balık / teslimat",bonus:"Kıyıda iskele · olta balıkçılığı"},{id:"forest",name:"Orman",cost:0,workers:1,desc:"+2 odun / teslimat",bonus:"Komşu orman +1 · oduncu kulübesi +2 odun"},{id:"berry",name:"Çilek Bahçesi",cost:2,workers:1,desc:"+4 yiyecek / teslimat",bonus:"Komşu orman: +1 yiyecek"},{id:"house",name:"Ev",cost:5,workers:0,desc:"+2 nüfus · +2 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"lumber",name:"Oduncu Kulübesi",cost:5,workers:0,desc:"Komşu ormanlara +2 odun",bonus:"Her komşu ormana +2 odun"},{id:"farm",name:"Çiftlik",cost:7,workers:2,desc:"+4 yiyecek / teslimat",bonus:"Komşu depo: +2 yiyecek"},{id:"store",name:"Depo",cost:6,workers:0,desc:"60 ürün kapasitesi",bonus:"Ürünler teslim edilince depoya eklenir"},{id:"garden",name:"Bahçe",cost:3,workers:1,desc:"+2 refah / teslimat",bonus:"Komşu ev başına +1 refah"},{id:"manor",name:"Büyük Ev",cost:10,workers:0,desc:"+4 nüfus · +4 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"festival",name:"Şenlik",cost:4,workers:0,desc:"+16 refah · −3 yiyecek",bonus:"Anında uygulanır · yer kaplamaz",event:!0},{id:"harvest",name:"Acil Hasat",cost:0,workers:0,desc:"+12 yiyecek · −5 refah",bonus:"Anında uygulanır · yer kaplamaz",event:!0}],hr=["wood","stone","berry","farm","fish"],qo=.8;function Ea(s,e){const t=wa(s),n=wa(e);return Math.max(Math.abs(t.q-n.q),Math.abs(t.r-n.r),Math.abs(t.q+t.r-n.q-n.r))}class Mf{board=new Map([[pt,"house"]]);wood=18;stone=0;happy=70;foods={berry:8,wheat:4,fish:0};priorities={wood:30,stone:15,berry:30,farm:15,fish:10};meal=0;mealPerson=0;meals=[];storageLevels=new Map([[pt,1]]);storageStocks=new Map([[pt,{wood:18,stone:0,berry:8,wheat:4,fish:0}]]);storageCapacity(e){return this.storageStocks.has(e)?(e===pt?80:60)*(this.storageLevels.get(e)??1):0}storageUsed(e){const t=this.storageStocks.get(e);return t?Object.values(t).reduce((n,i)=>n+i,0):0}storageFree(e){return Math.max(0,this.storageCapacity(e)-this.storageUsed(e))}canStore(e,t){return this.storageStocks.has(e)&&(t==="happy"||this.storageFree(e)>0)}upgradeCost(e){return 12*(this.storageLevels.get(e)??1)}upgradeStore(e){return!this.storageStocks.has(e)||this.wood<this.upgradeCost(e)?!1:(this.spendWood(this.upgradeCost(e)),this.storageLevels.set(e,(this.storageLevels.get(e)??1)+1),!0)}spendWood(e){this.wood-=e;let t=e;for(const n of this.storageStocks.values()){const i=Math.min(t,n.wood);if(n.wood-=i,t-=i,!t)break}}addFood(e,t){for(const[n,i]of this.storageStocks){const r=Math.min(t,this.storageFree(n));if(i[e]+=r,this.foods[e]+=r,t-=r,!t)break}}takeMeals(){const e=this.meals;return this.meals=[],e}wouldSealFishery(e){return[...this.board].some(([t,n])=>n==="fisher"&&tn(t).every(i=>i===e||this.board.has(i)))}get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}get foodPerMinute(){return this.people*2}consumeFood(e){let t=0;for(;t<e&&this.food>0;){const n=Object.keys(this.foods).sort((i,r)=>this.foods[r]-this.foods[i])[0];this.foods[n]--;for(const i of this.storageStocks.values())if(i[n]>0){i[n]--;break}t++}return t}tick(e){this.meal+=e*this.people/30;const t=Math.floor(this.meal);if(t){this.meal-=t;for(let n=0;n<t;n++){const i=this.consumeFood(1)>0,r=this.residents[this.mealPerson++%this.people].id;this.meals.push({id:r,ate:i}),i||(this.happy=Math.max(0,this.happy-.35))}}}categoryFor(e){const t=this.board.get(e);return t==="stone"?"stone":t==="forest"?"wood":t==="berry"?"berry":t==="farm"?"farm":t==="fisher"?"fish":null}workTargets(){const e=hr.filter(a=>[...this.board.keys()].some(o=>this.categoryFor(o)===a&&this.storageFor(o).length)),t={wood:0,stone:0,berry:0,farm:0,fish:0},n=e.reduce((a,o)=>a+this.priorities[o],0);if(!n)return t;const i=e.map(a=>({c:a,raw:this.people*this.priorities[a]/n}));for(const a of i)t[a.c]=Math.floor(a.raw);let r=this.people-Object.values(t).reduce((a,o)=>a+o,0);for(const a of i.sort((o,l)=>l.raw%1-o.raw%1))r-- >0&&t[a.c]++;return t}setPriority(e,t){t=Math.max(0,Math.min(100,Math.round(t)));const n=hr.filter(a=>a!==e),i=n.reduce((a,o)=>a+this.priorities[o],0);this.priorities[e]=t;let r=100-t;n.forEach((a,o)=>{const l=o===n.length-1?r:Math.min(r,Math.round((100-t)*(i?this.priorities[a]/i:1/n.length)));this.priorities[a]=l,r-=l})}residents=[{id:0,home:pt}];get people(){return this.residents.length}hand=[];rng;constructor(e=Math.random){this.rng=e,this.hand=["forest","berry","house"].map(t=>vi.find(n=>n.id===t))}neighbors(e){return tn(e)}draw(){const e=vi.filter(t=>!["farm","manor"].includes(t.id)||this.people>=3);for(this.hand=[];this.hand.length<3;)this.hand.push(e.splice(Math.floor(this.rng()*e.length),1)[0]);this.hand.some(t=>t.cost<=this.wood)||(this.hand[0]=vi.find(t=>t.id==="forest")),this.people>=3&&![...this.board.values()].includes("fisher")&&!this.hand.some(t=>t.id==="fisher")&&(this.hand[2]=vi.find(t=>t.id==="fisher"))}production(){return this.calculateProduction(this.board,this.people)}calculateProduction(e,t){let n=0;const i=new Set,r=l=>l==="berry"||l==="farm"||l==="fisher",a=[...e].map(([l,c])=>({k:c,i:l})).sort((l,c)=>Number(r(c.k)||c.i===pt)-Number(r(l.k)||l.i===pt));for(const{k:l,i:c}of a){const u=vi.find(f=>f.id===l),h=c===pt?0:u?.workers;h!==void 0&&n+h<=t&&(n+=h,i.add(c))}const o=[...e].flatMap(([l,c])=>{if(!c)return[];const u=this.neighbors(l),h=u.map(g=>e.get(g));let f=0,d=0,m=0,v=!1;return i.has(l)&&(c==="forest"&&(f=2+u.filter(p=>e.get(p)==="lumber"&&i.has(p)).length*2+h.filter(p=>p==="forest").length,v=f>2),c==="berry"&&(d=4+h.filter(g=>g==="forest").length,v=d>4),c==="fisher"&&(d=3),c==="farm"&&(d=4+(h.includes("store")?2:0),v=d>9),c==="garden"&&(m=2+h.filter(g=>g==="house"||g==="manor").length,v=m>2),(c==="house"||c==="manor")&&h.includes("garden")&&(m=1,v=!0)),[{i:l,wood:f,food:d,happy:m,active:i.has(l),bonus:v}]});return{wood:o.reduce((l,c)=>l+c.wood,0),food:o.reduce((l,c)=>l+c.food,0),happy:o.reduce((l,c)=>l+c.happy,0),used:n,idle:t-n,rows:o}}valid(e,t){return this.hand.includes(e)&&e.cost<=this.wood&&(e.id!=="festival"||this.food>=3)&&(e.event?this.board.has(t):Dp(this.board,t)&&!this.wouldSealFishery(t))&&(e.id!=="fisher"||tn(t).some(n=>!this.board.has(n)))}preview(e,t){if(!this.valid(e,t))return null;const n=tn(t).map(c=>this.board.get(c)),i=e.id==="house"?2:e.id==="manor"?4:0,r=e.id==="forest"?2+n.filter(c=>c==="forest").length+2*n.filter(c=>c==="lumber").length:0,a=e.id==="berry"?4+n.filter(c=>c==="forest").length:e.id==="farm"?4+n.filter(c=>c==="store").length*2:e.id==="fisher"?3:0,o=e.id==="stone"?3:0,l=e.id==="garden"?2+n.filter(c=>c==="house"||c==="manor").length:0;return{wood:r,stone:o,food:a,happy:l,people:i,neighbors:tn(t).filter(c=>this.board.has(c)),localBonus:r>2||a>4||l>2}}play(e,t=pt){if(!this.valid(e,t))return null;this.spendWood(e.cost),e.event||this.board.set(t,e.id),e.id==="store"&&(this.storageLevels.set(t,1),this.storageStocks.set(t,{wood:0,stone:0,berry:0,wheat:0,fish:0}));const n=e.id==="house"?2:e.id==="manor"?4:0;for(let i=0;i<n;i++)this.residents.push({id:this.residents.length,home:t});return e.id==="festival"&&(this.happy=Math.min(100,this.happy+16),this.consumeFood(3)),e.id==="harvest"&&(this.addFood("berry",12),this.happy=Math.max(0,this.happy-5)),this.draw(),this.production()}remove(e){if(e===pt||!this.board.has(e))return!1;const t=this.storageStocks.get(e);if(t){this.wood-=t.wood,this.stone-=t.stone;for(const n of["berry","wheat","fish"])this.foods[n]-=t[n];this.storageStocks.delete(e),this.storageLevels.delete(e)}this.board.delete(e);for(const n of this.residents)n.home===e&&(n.home=pt);return!0}productAt(e){const t=this.board.get(e),n=tn(e).map(i=>this.board.get(i));return t==="fisher"&&tn(e).some(i=>!this.board.has(i))?{resource:"food",amount:3,capacity:1}:t==="stone"?{resource:"stone",amount:3,capacity:2}:t==="forest"?{resource:"wood",amount:2+n.filter(i=>i==="forest").length+2*n.filter(i=>i==="lumber").length,capacity:3}:t==="berry"?{resource:"food",amount:4+n.filter(i=>i==="forest").length,capacity:2}:t==="farm"?{resource:"food",amount:4+n.filter(i=>i==="store").length*2,capacity:2}:t==="garden"?{resource:"happy",amount:2+n.filter(i=>i==="house"||i==="manor").length,capacity:1}:null}storageFor(e){return[...this.board].filter(([t,n])=>t===pt||n==="store").sort(([t],[n])=>Ea(e,t)-Ea(e,n)).map(([t])=>t)}deliver(e,t,n,i){const r=this.productAt(e);if(!r||r.resource!==n||!this.storageFor(e).includes(t))return 0;const a=Math.max(0,Math.min(r.amount,Math.floor(i),n==="happy"?1/0:this.storageFree(t)));if(n==="happy"){const l=this.happy;return this.happy=Math.min(100,this.happy+a),Number((this.happy-l).toFixed(2))}const o=this.storageStocks.get(t);if(!o)return 0;if(n==="food"){const l=this.board.get(e),c=l==="fisher"?"fish":l==="farm"?"wheat":"berry";this.foods[c]+=a,o[c]+=a}else n==="stone"?(this.stone+=a,o.stone+=a):(this.wood+=a,o.wood+=a);return a}}const cc="180",Np=0,ou=1,Up=2,Sf=1,wf=2,Jn=3,ii=0,rn=1,Yt=2,yi=0,xs=1,lu=2,cu=3,uu=4,Fp=5,ki=100,kp=101,Op=102,zp=103,Bp=104,Hp=200,Vp=201,Gp=202,Wp=203,Ko=204,Zo=205,Xp=206,jp=207,$p=208,Yp=209,qp=210,Kp=211,Zp=212,Jp=213,Qp=214,Jo=0,Qo=1,el=2,Es=3,tl=4,nl=5,il=6,sl=7,uc=0,em=1,tm=2,bi=0,nm=1,im=2,sm=3,rl=4,rm=5,am=6,om=7,hu="attached",lm="detached",Ef=300,Ts=301,As=302,al=303,ol=304,Oa=306,Vi=1e3,xi=1001,Ta=1002,Zt=1003,Tf=1004,Qs=1005,Kt=1006,ha=1007,kn=1008,Bn=1009,Af=1010,Rf=1011,fr=1012,hc=1013,Gi=1014,En=1015,br=1016,fc=1017,dc=1018,dr=1020,Cf=35902,If=35899,Pf=1021,Lf=1022,sn=1023,pr=1026,mr=1027,pc=1028,mc=1029,Df=1030,gc=1031,vc=1033,fa=33776,da=33777,pa=33778,ma=33779,ll=35840,cl=35841,ul=35842,hl=35843,fl=36196,dl=37492,pl=37496,ml=37808,gl=37809,vl=37810,_l=37811,xl=37812,yl=37813,bl=37814,Ml=37815,Sl=37816,wl=37817,El=37818,Tl=37819,Al=37820,Rl=37821,Cl=36492,Il=36494,Pl=36495,Ll=36283,Dl=36284,Nl=36285,Ul=36286,cm=2200,um=2201,hm=2202,gr=2300,vr=2301,io=2302,ms=2400,gs=2401,Aa=2402,_c=2500,fm=2501,dm=0,Nf=1,Fl=2,pm=3200,mm=3201,xc=0,gm=1,_i="",Ut="srgb",Jt="srgb-linear",Ra="linear",ht="srgb",Zi=7680,fu=519,vm=512,_m=513,xm=514,Uf=515,ym=516,bm=517,Mm=518,Sm=519,kl=35044,du="300 es",On=2e3,Ca=2001;class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pu=1234567;const ir=Math.PI/180,Rs=180/Math.PI;function An(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[s&255]+Bt[s>>8&255]+Bt[s>>16&255]+Bt[s>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function je(s,e,t){return Math.max(e,Math.min(t,s))}function yc(s,e){return(s%e+e)%e}function wm(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Em(s,e,t){return s!==e?(t-s)/(e-s):0}function sr(s,e,t){return(1-t)*s+t*e}function Tm(s,e,t,n){return sr(s,e,1-Math.exp(-t*n))}function Am(s,e=1){return e-Math.abs(yc(s,e*2)-e)}function Rm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Cm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Im(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Pm(s,e){return s+Math.random()*(e-s)}function Lm(s){return s*(.5-Math.random())}function Dm(s){s!==void 0&&(pu=s);let e=pu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Nm(s){return s*ir}function Um(s){return s*Rs}function Fm(s){return(s&s-1)===0&&s!==0}function km(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Om(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function zm(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":s.set(o*u,l*h,l*f,o*c);break;case"YZY":s.set(l*f,o*u,l*h,o*c);break;case"ZXZ":s.set(l*h,l*f,o*u,o*c);break;case"XZX":s.set(o*u,l*m,l*d,o*c);break;case"YXY":s.set(l*d,o*u,l*m,o*c);break;case"ZYZ":s.set(l*m,l*d,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ct(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Ze={DEG2RAD:ir,RAD2DEG:Rs,generateUUID:An,clamp:je,euclideanModulo:yc,mapLinear:wm,inverseLerp:Em,lerp:sr,damp:Tm,pingpong:Am,smoothstep:Rm,smootherstep:Cm,randInt:Im,randFloat:Pm,randFloatSpread:Lm,seededRandom:Dm,degToRad:Nm,radToDeg:Um,isPowerOfTwo:Fm,ceilPowerOfTwo:km,floorPowerOfTwo:Om,setQuaternionFromProperEuler:zm,normalize:ct,denormalize:Sn};class Oe{constructor(e=0,t=0){Oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Rn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const f=r[a+0],d=r[a+1],m=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=d,e[t+2]=m,e[t+3]=v;return}if(h!==v||l!==f||c!==d||u!==m){let g=1-o;const p=l*f+c*d+u*m+h*v,y=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const E=Math.sqrt(b),T=Math.atan2(E,p*y);g=Math.sin(g*T)/E,o=Math.sin(o*T)/E}const _=o*y;if(l=l*g+f*_,c=c*g+d*_,u=u*g+m*_,h=h*g+v*_,g===1-o){const E=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=E,c*=E,u*=E,h*=E}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=r[a],f=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+u*h+l*d-c*f,e[t+1]=l*m+u*f+c*h-o*d,e[t+2]=c*m+u*d+o*f-l*h,e[t+3]=u*m-o*h-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),h=o(r/2),f=l(n/2),d=l(i/2),m=l(r/2);switch(a){case"XYZ":this._x=f*u*h+c*d*m,this._y=c*d*h-f*u*m,this._z=c*u*m+f*d*h,this._w=c*u*h-f*d*m;break;case"YXZ":this._x=f*u*h+c*d*m,this._y=c*d*h-f*u*m,this._z=c*u*m-f*d*h,this._w=c*u*h+f*d*m;break;case"ZXY":this._x=f*u*h-c*d*m,this._y=c*d*h+f*u*m,this._z=c*u*m+f*d*h,this._w=c*u*h-f*d*m;break;case"ZYX":this._x=f*u*h-c*d*m,this._y=c*d*h+f*u*m,this._z=c*u*m-f*d*h,this._w=c*u*h+f*d*m;break;case"YZX":this._x=f*u*h+c*d*m,this._y=c*d*h+f*u*m,this._z=c*u*m-f*d*h,this._w=c*u*h-f*d*m;break;case"XZY":this._x=f*u*h-c*d*m,this._y=c*d*h-f*u*m,this._z=c*u*m+f*d*h,this._w=c*u*h+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+o+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>h){const d=2*Math.sqrt(1+n-o-h);this._w=(u-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>h){const d=2*Math.sqrt(1+o-n-h);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+h-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=i*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-r*i),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=i+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return so.copy(this).projectOnVector(e),this.sub(so)}reflect(e){return this.sub(so.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const so=new I,mu=new Rn;class Ve{constructor(e,t,n,i,r,a,o,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],d=n[5],m=n[8],v=i[0],g=i[3],p=i[6],y=i[1],b=i[4],_=i[7],E=i[2],T=i[5],A=i[8];return r[0]=a*v+o*y+l*E,r[3]=a*g+o*b+l*T,r[6]=a*p+o*_+l*A,r[1]=c*v+u*y+h*E,r[4]=c*g+u*b+h*T,r[7]=c*p+u*_+h*A,r[2]=f*v+d*y+m*E,r[5]=f*g+d*b+m*T,r[8]=f*p+d*_+m*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*r,d=c*r-a*l,m=t*h+n*f+i*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=h*v,e[1]=(i*c-u*n)*v,e[2]=(o*n-i*a)*v,e[3]=f*v,e[4]=(u*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ro.makeScale(e,t)),this}rotate(e){return this.premultiply(ro.makeRotation(-e)),this}translate(e,t){return this.premultiply(ro.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ro=new Ve;function Ff(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function _r(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Bm(){const s=_r("canvas");return s.style.display="block",s}const gu={};function xr(s){s in gu||(gu[s]=!0,console.warn(s))}function Hm(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const vu=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_u=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vm(){const s={enabled:!0,workingColorSpace:Jt,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ht&&(i.r=ni(i.r),i.g=ni(i.g),i.b=ni(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(i.r=ys(i.r),i.g=ys(i.g),i.b=ys(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===_i?Ra:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return xr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return xr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Jt]:{primaries:e,whitePoint:n,transfer:Ra,toXYZ:vu,fromXYZ:_u,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:vu,fromXYZ:_u,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),s}const Qe=Vm();function ni(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ys(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ji;class Gm{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ji===void 0&&(Ji=_r("canvas")),Ji.width=e.width,Ji.height=e.height;const i=Ji.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=_r("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ni(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ni(t[n]/255)*255):t[n]=ni(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wm=0;class bc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=An(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(ao(i[a].image)):r.push(ao(i[a]))}else r=ao(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function ao(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Gm.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xm=0;const oo=new I;class It extends qi{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,n=xi,i=xi,r=Kt,a=kn,o=sn,l=Bn,c=It.DEFAULT_ANISOTROPY,u=_i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xm++}),this.uuid=An(),this.name="",this.source=new bc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Oe(0,0),this.repeat=new Oe(1,1),this.center=new Oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oo).x}get height(){return this.source.getSize(oo).y}get depth(){return this.source.getSize(oo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ef)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vi:e.x=e.x-Math.floor(e.x);break;case xi:e.x=e.x<0?0:1;break;case Ta:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vi:e.y=e.y-Math.floor(e.y);break;case xi:e.y=e.y<0?0:1;break;case Ta:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=Ef;It.DEFAULT_ANISOTROPY=1;class et{constructor(e=0,t=0,n=0,i=1){et.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],d=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,_=(d+1)/2,E=(p+1)/2,T=(u+f)/4,A=(h+v)/4,R=(m+g)/4;return b>_&&b>E?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=T/n,r=A/n):_>E?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=T/i,r=R/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=A/r,i=R/r),this.set(n,i,r,t),this}let y=Math.sqrt((g-m)*(g-m)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(h-v)/y,this.z=(f-u)/y,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jm extends qi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new et(0,0,e,t),this.scissorTest=!1,this.viewport=new et(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new It(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new bc(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends jm{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class kf extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $m extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,xn):xn.fromBufferAttribute(r,a),xn.applyMatrix4(e.matrixWorld),this.expandByPoint(xn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Lr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Lr.copy(n.boundingBox)),Lr.applyMatrix4(e.matrixWorld),this.union(Lr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xn),xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gs),Dr.subVectors(this.max,Gs),Qi.subVectors(e.a,Gs),es.subVectors(e.b,Gs),ts.subVectors(e.c,Gs),li.subVectors(es,Qi),ci.subVectors(ts,es),Ci.subVectors(Qi,ts);let t=[0,-li.z,li.y,0,-ci.z,ci.y,0,-Ci.z,Ci.y,li.z,0,-li.x,ci.z,0,-ci.x,Ci.z,0,-Ci.x,-li.y,li.x,0,-ci.y,ci.x,0,-Ci.y,Ci.x,0];return!lo(t,Qi,es,ts,Dr)||(t=[1,0,0,0,1,0,0,0,1],!lo(t,Qi,es,ts,Dr))?!1:(Nr.crossVectors(li,ci),t=[Nr.x,Nr.y,Nr.z],lo(t,Qi,es,ts,Dr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const jn=[new I,new I,new I,new I,new I,new I,new I,new I],xn=new I,Lr=new Vn,Qi=new I,es=new I,ts=new I,li=new I,ci=new I,Ci=new I,Gs=new I,Dr=new I,Nr=new I,Ii=new I;function lo(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Ii.fromArray(s,r);const o=i.x*Math.abs(Ii.x)+i.y*Math.abs(Ii.y)+i.z*Math.abs(Ii.z),l=e.dot(Ii),c=t.dot(Ii),u=n.dot(Ii);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Ym=new Vn,Ws=new I,co=new I;class Gn{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Ym.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ws.subVectors(e,this.center);const t=Ws.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ws,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(co.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ws.copy(e.center).add(co)),this.expandByPoint(Ws.copy(e.center).sub(co))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const $n=new I,uo=new I,Ur=new I,ui=new I,ho=new I,Fr=new I,fo=new I;class Mr{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=$n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($n.copy(this.origin).addScaledVector(this.direction,t),$n.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){uo.copy(e).add(t).multiplyScalar(.5),Ur.copy(t).sub(e).normalize(),ui.copy(this.origin).sub(uo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ur),o=ui.dot(this.direction),l=-ui.dot(Ur),c=ui.lengthSq(),u=Math.abs(1-a*a);let h,f,d,m;if(u>0)if(h=a*l-o,f=a*o-l,m=r*u,h>=0)if(f>=-m)if(f<=m){const v=1/u;h*=v,f*=v,d=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*l)+c;else f<=-m?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-l),r),d=-h*h+f*(f+2*l)+c):f<=m?(h=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-l),r),d=-h*h+f*(f+2*l)+c);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),d=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(uo).addScaledVector(Ur,f),d}intersectSphere(e,t){$n.subVectors(e.center,this.origin);const n=$n.dot(this.direction),i=$n.dot($n)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,$n)!==null}intersectTriangle(e,t,n,i,r){ho.subVectors(t,e),Fr.subVectors(n,e),fo.crossVectors(ho,Fr);let a=this.direction.dot(fo),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ui.subVectors(this.origin,e);const l=o*this.direction.dot(Fr.crossVectors(ui,Fr));if(l<0)return null;const c=o*this.direction.dot(ho.cross(ui));if(c<0||l+c>a)return null;const u=-o*ui.dot(fo);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ge{constructor(e,t,n,i,r,a,o,l,c,u,h,f,d,m,v,g){Ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,u,h,f,d,m,v,g)}set(e,t,n,i,r,a,o,l,c,u,h,f,d,m,v,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=f,p[3]=d,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ge().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ns.setFromMatrixColumn(e,0).length(),r=1/ns.setFromMatrixColumn(e,1).length(),a=1/ns.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*u,d=a*h,m=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=d+m*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,d=l*h,m=c*u,v=c*h;t[0]=f+v*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=d*o-m,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,d=l*h,m=c*u,v=c*h;t[0]=f-v*o,t[4]=-a*h,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*u,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,d=a*h,m=o*u,v=o*h;t[0]=l*u,t[4]=m*c-d,t[8]=f*c+v,t[1]=l*h,t[5]=v*c+f,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,d=a*c,m=o*l,v=o*c;t[0]=l*u,t[4]=v-f*h,t[8]=m*h+d,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=d*h+m,t[10]=f-v*h}else if(e.order==="XZY"){const f=a*l,d=a*c,m=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+v,t[5]=a*u,t[9]=d*h-m,t[2]=m*h-d,t[6]=o*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qm,e,Km)}lookAt(e,t,n){const i=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),hi.crossVectors(n,cn),hi.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),hi.crossVectors(n,cn)),hi.normalize(),kr.crossVectors(cn,hi),i[0]=hi.x,i[4]=kr.x,i[8]=cn.x,i[1]=hi.y,i[5]=kr.y,i[9]=cn.y,i[2]=hi.z,i[6]=kr.z,i[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],d=n[13],m=n[2],v=n[6],g=n[10],p=n[14],y=n[3],b=n[7],_=n[11],E=n[15],T=i[0],A=i[4],R=i[8],x=i[12],S=i[1],P=i[5],F=i[9],z=i[13],V=i[2],W=i[6],j=i[10],K=i[14],H=i[3],ae=i[7],ue=i[11],Te=i[15];return r[0]=a*T+o*S+l*V+c*H,r[4]=a*A+o*P+l*W+c*ae,r[8]=a*R+o*F+l*j+c*ue,r[12]=a*x+o*z+l*K+c*Te,r[1]=u*T+h*S+f*V+d*H,r[5]=u*A+h*P+f*W+d*ae,r[9]=u*R+h*F+f*j+d*ue,r[13]=u*x+h*z+f*K+d*Te,r[2]=m*T+v*S+g*V+p*H,r[6]=m*A+v*P+g*W+p*ae,r[10]=m*R+v*F+g*j+p*ue,r[14]=m*x+v*z+g*K+p*Te,r[3]=y*T+b*S+_*V+E*H,r[7]=y*A+b*P+_*W+E*ae,r[11]=y*R+b*F+_*j+E*ue,r[15]=y*x+b*z+_*K+E*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],d=e[14],m=e[3],v=e[7],g=e[11],p=e[15];return m*(+r*l*h-i*c*h-r*o*f+n*c*f+i*o*d-n*l*d)+v*(+t*l*d-t*c*f+r*a*f-i*a*d+i*c*u-r*l*u)+g*(+t*c*h-t*o*d-r*a*h+n*a*d+r*o*u-n*c*u)+p*(-i*o*u-t*l*h+t*o*f+i*a*h-n*a*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],d=e[11],m=e[12],v=e[13],g=e[14],p=e[15],y=h*g*c-v*f*c+v*l*d-o*g*d-h*l*p+o*f*p,b=m*f*c-u*g*c-m*l*d+a*g*d+u*l*p-a*f*p,_=u*v*c-m*h*c+m*o*d-a*v*d-u*o*p+a*h*p,E=m*h*l-u*v*l-m*o*f+a*v*f+u*o*g-a*h*g,T=t*y+n*b+i*_+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=y*A,e[1]=(v*f*r-h*g*r-v*i*d+n*g*d+h*i*p-n*f*p)*A,e[2]=(o*g*r-v*l*r+v*i*c-n*g*c-o*i*p+n*l*p)*A,e[3]=(h*l*r-o*f*r-h*i*c+n*f*c+o*i*d-n*l*d)*A,e[4]=b*A,e[5]=(u*g*r-m*f*r+m*i*d-t*g*d-u*i*p+t*f*p)*A,e[6]=(m*l*r-a*g*r-m*i*c+t*g*c+a*i*p-t*l*p)*A,e[7]=(a*f*r-u*l*r+u*i*c-t*f*c-a*i*d+t*l*d)*A,e[8]=_*A,e[9]=(m*h*r-u*v*r-m*n*d+t*v*d+u*n*p-t*h*p)*A,e[10]=(a*v*r-m*o*r+m*n*c-t*v*c-a*n*p+t*o*p)*A,e[11]=(u*o*r-a*h*r-u*n*c+t*h*c+a*n*d-t*o*d)*A,e[12]=E*A,e[13]=(u*v*i-m*h*i+m*n*f-t*v*f-u*n*g+t*h*g)*A,e[14]=(m*o*i-a*v*i-m*n*l+t*v*l+a*n*g-t*o*g)*A,e[15]=(a*h*i-u*o*i+u*n*l-t*h*l-a*n*f+t*o*f)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,f=r*c,d=r*u,m=r*h,v=a*u,g=a*h,p=o*h,y=l*c,b=l*u,_=l*h,E=n.x,T=n.y,A=n.z;return i[0]=(1-(v+p))*E,i[1]=(d+_)*E,i[2]=(m-b)*E,i[3]=0,i[4]=(d-_)*T,i[5]=(1-(f+p))*T,i[6]=(g+y)*T,i[7]=0,i[8]=(m+b)*A,i[9]=(g-y)*A,i[10]=(1-(f+v))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ns.set(i[0],i[1],i[2]).length();const a=ns.set(i[4],i[5],i[6]).length(),o=ns.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],yn.copy(this);const c=1/r,u=1/a,h=1/o;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=u,yn.elements[5]*=u,yn.elements[6]*=u,yn.elements[8]*=h,yn.elements[9]*=h,yn.elements[10]*=h,t.setFromRotationMatrix(yn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=On,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(n-i),f=(t+e)/(t-e),d=(n+i)/(n-i);let m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===On)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ca)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=On,l=!1){const c=this.elements,u=2/(t-e),h=2/(n-i),f=-(t+e)/(t-e),d=-(n+i)/(n-i);let m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===On)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ca)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ns=new I,yn=new Ge,qm=new I(0,0,0),Km=new I(1,1,1),hi=new I,kr=new I,cn=new I,xu=new Ge,yu=new Rn;class In{constructor(e=0,t=0,n=0,i=In.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],h=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-je(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yu.setFromEuler(this),this.setFromQuaternion(yu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}In.DEFAULT_ORDER="XYZ";let Mc=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Zm=0;const bu=new I,is=new Rn,Yn=new Ge,Or=new I,Xs=new I,Jm=new I,Qm=new Rn,Mu=new I(1,0,0),Su=new I(0,1,0),wu=new I(0,0,1),Eu={type:"added"},eg={type:"removed"},ss={type:"childadded",child:null},po={type:"childremoved",child:null};class vt extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zm++}),this.uuid=An(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new I,t=new In,n=new Rn,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ge},normalMatrix:{value:new Ve}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.multiply(is),this}rotateOnWorldAxis(e,t){return is.setFromAxisAngle(e,t),this.quaternion.premultiply(is),this}rotateX(e){return this.rotateOnAxis(Mu,e)}rotateY(e){return this.rotateOnAxis(Su,e)}rotateZ(e){return this.rotateOnAxis(wu,e)}translateOnAxis(e,t){return bu.copy(e).applyQuaternion(this.quaternion),this.position.add(bu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mu,e)}translateY(e){return this.translateOnAxis(Su,e)}translateZ(e){return this.translateOnAxis(wu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Or.copy(e):Or.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(Xs,Or,this.up):Yn.lookAt(Or,Xs,this.up),this.quaternion.setFromRotationMatrix(Yn),i&&(Yn.extractRotation(i.matrixWorld),is.setFromRotationMatrix(Yn),this.quaternion.premultiply(is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Eu),ss.child=e,this.dispatchEvent(ss),ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(eg),po.child=e,this.dispatchEvent(po),po.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Eu),ss.child=e,this.dispatchEvent(ss),ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,Jm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,Qm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}vt.DEFAULT_UP=new I(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new I,qn=new I,mo=new I,Kn=new I,rs=new I,as=new I,Tu=new I,go=new I,vo=new I,_o=new I,xo=new et,yo=new et,bo=new et;class wn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),bn.subVectors(e,t),i.cross(bn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){bn.subVectors(i,t),qn.subVectors(n,t),mo.subVectors(e,t);const a=bn.dot(bn),o=bn.dot(qn),l=bn.dot(mo),c=qn.dot(qn),u=qn.dot(mo),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,d=(c*l-o*u)*f,m=(a*u-o*l)*f;return r.set(1-d-m,m,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Kn.x),l.addScaledVector(a,Kn.y),l.addScaledVector(o,Kn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return xo.setScalar(0),yo.setScalar(0),bo.setScalar(0),xo.fromBufferAttribute(e,t),yo.fromBufferAttribute(e,n),bo.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(xo,r.x),a.addScaledVector(yo,r.y),a.addScaledVector(bo,r.z),a}static isFrontFacing(e,t,n,i){return bn.subVectors(n,t),qn.subVectors(e,t),bn.cross(qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),bn.cross(qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return wn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return wn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return wn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return wn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return wn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;rs.subVectors(i,n),as.subVectors(r,n),go.subVectors(e,n);const l=rs.dot(go),c=as.dot(go);if(l<=0&&c<=0)return t.copy(n);vo.subVectors(e,i);const u=rs.dot(vo),h=as.dot(vo);if(u>=0&&h<=u)return t.copy(i);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(rs,a);_o.subVectors(e,r);const d=rs.dot(_o),m=as.dot(_o);if(m>=0&&d<=m)return t.copy(r);const v=d*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(as,o);const g=u*m-d*h;if(g<=0&&h-u>=0&&d-m>=0)return Tu.subVectors(r,i),o=(h-u)/(h-u+(d-m)),t.copy(i).addScaledVector(Tu,o);const p=1/(g+v+f);return a=v*p,o=f*p,t.copy(n).addScaledVector(rs,a).addScaledVector(as,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},zr={h:0,s:0,l:0};function Mo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Qe.workingColorSpace){if(e=yc(e,1),t=je(t,0,1),n=je(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Mo(a,r,e+1/3),this.g=Mo(a,r,e),this.b=Mo(a,r,e-1/3)}return Qe.colorSpaceToWorking(this,i),this}setStyle(e,t=Ut){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const n=Of[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ni(e.r),this.g=ni(e.g),this.b=ni(e.b),this}copyLinearToSRGB(e){return this.r=ys(e.r),this.g=ys(e.g),this.b=ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return Qe.workingToColorSpace(Ht.copy(this),e),Math.round(je(Ht.r*255,0,255))*65536+Math.round(je(Ht.g*255,0,255))*256+Math.round(je(Ht.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Ht.copy(this),t);const n=Ht.r,i=Ht.g,r=Ht.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(i-r)/h+(i<r?6:0);break;case i:l=(r-n)/h+2;break;case r:l=(n-i)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Ut){Qe.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,n=Ht.g,i=Ht.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(fi),this.setHSL(fi.h+e,fi.s+t,fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(fi),e.getHSL(zr);const n=sr(fi.h,zr.h,t),i=sr(fi.s,zr.s,t),r=sr(fi.l,zr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new fe;fe.NAMES=Of;let tg=0;class Cn extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tg++}),this.uuid=An(),this.name="",this.type="Material",this.blending=xs,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ko,this.blendDst=Zo,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zi,this.stencilZFail=Zi,this.stencilZPass=Zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ko&&(n.blendSrc=this.blendSrc),this.blendDst!==Zo&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class qt extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new I,Br=new Oe;let ng=0;class Ft{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ng++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kl,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Br.fromBufferAttribute(this,t),Br.applyMatrix3(e),this.setXY(t,Br.x,Br.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kl&&(e.usage=this.usage),e}}class zf extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Bf extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nt extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ig=0;const mn=new Ge,So=new vt,os=new I,un=new Vn,js=new Vn,Nt=new I;class At extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ig++}),this.uuid=An(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ff(e)?Bf:zf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return mn.makeRotationFromQuaternion(e),this.applyMatrix4(mn),this}rotateX(e){return mn.makeRotationX(e),this.applyMatrix4(mn),this}rotateY(e){return mn.makeRotationY(e),this.applyMatrix4(mn),this}rotateZ(e){return mn.makeRotationZ(e),this.applyMatrix4(mn),this}translate(e,t,n){return mn.makeTranslation(e,t,n),this.applyMatrix4(mn),this}scale(e,t,n){return mn.makeScale(e,t,n),this.applyMatrix4(mn),this}lookAt(e){return So.lookAt(e),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new nt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];un.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];js.setFromBufferAttribute(o),this.morphTargetsRelative?(Nt.addVectors(un.min,js.min),un.expandByPoint(Nt),Nt.addVectors(un.max,js.max),un.expandByPoint(Nt)):(un.expandByPoint(js.min),un.expandByPoint(js.max))}un.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Nt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Nt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Nt.fromBufferAttribute(o,c),l&&(os.fromBufferAttribute(e,c),Nt.add(os)),i=Math.max(i,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<n.count;R++)o[R]=new I,l[R]=new I;const c=new I,u=new I,h=new I,f=new Oe,d=new Oe,m=new Oe,v=new I,g=new I;function p(R,x,S){c.fromBufferAttribute(n,R),u.fromBufferAttribute(n,x),h.fromBufferAttribute(n,S),f.fromBufferAttribute(r,R),d.fromBufferAttribute(r,x),m.fromBufferAttribute(r,S),u.sub(c),h.sub(c),d.sub(f),m.sub(f);const P=1/(d.x*m.y-m.x*d.y);isFinite(P)&&(v.copy(u).multiplyScalar(m.y).addScaledVector(h,-d.y).multiplyScalar(P),g.copy(h).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(P),o[R].add(v),o[x].add(v),o[S].add(v),l[R].add(g),l[x].add(g),l[S].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,x=y.length;R<x;++R){const S=y[R],P=S.start,F=S.count;for(let z=P,V=P+F;z<V;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const b=new I,_=new I,E=new I,T=new I;function A(R){E.fromBufferAttribute(i,R),T.copy(E);const x=o[R];b.copy(x),b.sub(E.multiplyScalar(E.dot(x))).normalize(),_.crossVectors(T,x);const P=_.dot(l[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,x=y.length;R<x;++R){const S=y[R],P=S.start,F=S.count;for(let z=P,V=P+F;z<V;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,u=new I,h=new I;if(e)for(let f=0,d=e.count;f<d;f+=3){const m=e.getX(f+0),v=e.getX(f+1),g=e.getX(f+2);i.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),h.subVectors(i,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let d=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*u;for(let p=0;p<u;p++)f[m++]=c[d++]}return new Ft(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new At,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const d=c[h];u.push(d.toJSON(e.data))}u.length>0&&(i[l]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Au=new Ge,Pi=new Mr,Hr=new Gn,Ru=new I,Vr=new I,Gr=new I,Wr=new I,wo=new I,Xr=new I,Cu=new I,jr=new I;class Ke extends vt{constructor(e=new At,t=new qt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Xr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(wo.fromBufferAttribute(h,e),a?Xr.addScaledVector(wo,u):Xr.addScaledVector(wo.sub(t),u))}t.add(Xr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hr.copy(n.boundingSphere),Hr.applyMatrix4(r),Pi.copy(e.ray).recast(e.near),!(Hr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Hr,Ru)===null||Pi.origin.distanceToSquared(Ru)>(e.far-e.near)**2))&&(Au.copy(r).invert(),Pi.copy(e.ray).applyMatrix4(Au),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Pi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=a[g.materialIndex],y=Math.max(g.start,d.start),b=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let _=y,E=b;_<E;_+=3){const T=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);i=$r(this,p,e,n,c,u,h,T,A,R),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const y=o.getX(g),b=o.getX(g+1),_=o.getX(g+2);i=$r(this,a,e,n,c,u,h,y,b,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=f.length;m<v;m++){const g=f[m],p=a[g.materialIndex],y=Math.max(g.start,d.start),b=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let _=y,E=b;_<E;_+=3){const T=_,A=_+1,R=_+2;i=$r(this,p,e,n,c,u,h,T,A,R),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const m=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const y=g,b=g+1,_=g+2;i=$r(this,a,e,n,c,u,h,y,b,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function sg(s,e,t,n,i,r,a,o){let l;if(e.side===rn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===ii,o),l===null)return null;jr.copy(o),jr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(jr);return c<t.near||c>t.far?null:{distance:c,point:jr.clone(),object:s}}function $r(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Vr),s.getVertexPosition(l,Gr),s.getVertexPosition(c,Wr);const u=sg(s,e,t,n,Vr,Gr,Wr,Cu);if(u){const h=new I;wn.getBarycoord(Cu,Vr,Gr,Wr,h),i&&(u.uv=wn.getInterpolatedAttribute(i,o,l,c,h,new Oe)),r&&(u.uv1=wn.getInterpolatedAttribute(r,o,l,c,h,new Oe)),a&&(u.normal=wn.getInterpolatedAttribute(a,o,l,c,h,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new I,materialIndex:0};wn.getNormal(Vr,Gr,Wr,f.normal),u.face=f,u.barycoord=h}return u}class Fs extends At{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,d=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,r,4),m("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(h,2));function m(v,g,p,y,b,_,E,T,A,R,x){const S=_/A,P=E/R,F=_/2,z=E/2,V=T/2,W=A+1,j=R+1;let K=0,H=0;const ae=new I;for(let ue=0;ue<j;ue++){const Te=ue*P-z;for(let $e=0;$e<W;$e++){const mt=$e*S-F;ae[v]=mt*y,ae[g]=Te*b,ae[p]=V,c.push(ae.x,ae.y,ae.z),ae[v]=0,ae[g]=0,ae[p]=T>0?1:-1,u.push(ae.x,ae.y,ae.z),h.push($e/A),h.push(1-ue/R),K+=1}}for(let ue=0;ue<R;ue++)for(let Te=0;Te<A;Te++){const $e=f+Te+W*ue,mt=f+Te+W*(ue+1),bt=f+(Te+1)+W*(ue+1),at=f+(Te+1)+W*ue;l.push($e,mt,at),l.push(mt,bt,at),H+=6}o.addGroup(d,H,x),d+=H,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Cs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function $t(s){const e={};for(let t=0;t<s.length;t++){const n=Cs(s[t]);for(const i in n)e[i]=n[i]}return e}function rg(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Hf(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const ag={clone:Cs,merge:$t};var og=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class si extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=og,this.fragmentShader=lg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cs(e.uniforms),this.uniformsGroups=rg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Vf extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const di=new I,Iu=new Oe,Pu=new Oe;class nn extends Vf{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,Iu,Pu),t.subVectors(Pu,Iu)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ir*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ls=-90,cs=1;class cg extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new nn(ls,cs,e,t);i.layers=this.layers,this.add(i);const r=new nn(ls,cs,e,t);r.layers=this.layers,this.add(r);const a=new nn(ls,cs,e,t);a.layers=this.layers,this.add(a);const o=new nn(ls,cs,e,t);o.layers=this.layers,this.add(o);const l=new nn(ls,cs,e,t);l.layers=this.layers,this.add(l);const c=new nn(ls,cs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ca)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Gf extends It{constructor(e=[],t=Ts,n,i,r,a,o,l,c,u){super(e,t,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ug extends Wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Gf(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Fs(5,5,5),r=new si({name:"CubemapFromEquirect",uniforms:Cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:yi});r.uniforms.tEquirect.value=t;const a=new Ke(i,r),o=t.minFilter;return t.minFilter===kn&&(t.minFilter=Kt),new cg(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}class Le extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hg={type:"move"};class Eo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,m=.005;c.inputState.pinching&&f>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hg)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Le;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Lu extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class fg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=kl,this.updateRanges=[],this.version=0,this.uuid=An()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const jt=new I;class Sc{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyMatrix4(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.applyNormalMatrix(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)jt.fromBufferAttribute(this,t),jt.transformDirection(e),this.setXYZ(t,jt.x,jt.y,jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Ft(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Sc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Du=new I,Nu=new et,Uu=new et,dg=new I,Fu=new Ge,Yr=new I,To=new Gn,ku=new Ge,Ao=new Mr;class pg extends Ke{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=hu,this.bindMatrix=new Ge,this.bindMatrixInverse=new Ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Vn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Yr),this.boundingBox.expandByPoint(Yr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Gn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Yr),this.boundingSphere.expandByPoint(Yr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),To.copy(this.boundingSphere),To.applyMatrix4(i),e.ray.intersectsSphere(To)!==!1&&(ku.copy(i).invert(),Ao.copy(e.ray).applyMatrix4(ku),!(this.boundingBox!==null&&Ao.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ao)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new et,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===hu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===lm?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Nu.fromBufferAttribute(i.attributes.skinIndex,e),Uu.fromBufferAttribute(i.attributes.skinWeight,e),Du.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Uu.getComponent(r);if(a!==0){const o=Nu.getComponent(r);Fu.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(dg.copy(Du).applyMatrix4(Fu),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Wf extends vt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class za extends It{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Zt,u=Zt,h,f){super(null,a,o,l,c,u,i,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ou=new Ge,mg=new Ge;class wc{constructor(e=[],t=[]){this.uuid=An(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ge;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:mg;Ou.multiplyMatrices(o,t[r]),Ou.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new wc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new za(t,e,e,sn,En);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new Wf),this.bones.push(a),this.boneInverses.push(new Ge().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Ol extends Ft{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const us=new Ge,zu=new Ge,qr=[],Bu=new Vn,gg=new Ge,$s=new Ke,Ys=new Gn;class Ec extends Ke{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ol(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,gg)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,us),Bu.copy(e.boundingBox).applyMatrix4(us),this.boundingBox.union(Bu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,us),Ys.copy(e.boundingSphere).applyMatrix4(us),this.boundingSphere.union(Ys)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if($s.geometry=this.geometry,$s.material=this.material,$s.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ys.copy(this.boundingSphere),Ys.applyMatrix4(n),e.ray.intersectsSphere(Ys)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,us),zu.multiplyMatrices(n,us),$s.matrixWorld=zu,$s.raycast(e,qr);for(let a=0,o=qr.length;a<o;a++){const l=qr[a];l.instanceId=r,l.object=this,t.push(l)}qr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ol(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new za(new Float32Array(i*this.count),i,this.count,pc,En));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ro=new I,vg=new I,_g=new Ve;class Qn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ro.subVectors(n,t).cross(vg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ro),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||_g.getNormalMatrix(e),i=this.coplanarPoint(Ro).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Gn,xg=new Oe(.5,.5),Kr=new I;class Tc{constructor(e=new Qn,t=new Qn,n=new Qn,i=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],f=r[6],d=r[7],m=r[8],v=r[9],g=r[10],p=r[11],y=r[12],b=r[13],_=r[14],E=r[15];if(i[0].setComponents(c-a,d-u,p-m,E-y).normalize(),i[1].setComponents(c+a,d+u,p+m,E+y).normalize(),i[2].setComponents(c+o,d+h,p+v,E+b).normalize(),i[3].setComponents(c-o,d-h,p-v,E-b).normalize(),n)i[4].setComponents(l,f,g,_).normalize(),i[5].setComponents(c-l,d-f,p-g,E-_).normalize();else if(i[4].setComponents(c-l,d-f,p-g,E-_).normalize(),t===On)i[5].setComponents(c+l,d+f,p+g,E+_).normalize();else if(t===Ca)i[5].setComponents(l,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);const t=xg.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Kr.x=i.normal.x>0?e.max.x:e.min.x,Kr.y=i.normal.y>0?e.max.y:e.min.y,Kr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Kr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ba extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ia=new I,Pa=new I,Hu=new Ge,qs=new Mr,Zr=new Gn,Co=new I,Vu=new I;class Ha extends vt{constructor(e=new At,t=new Ba){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Ia.fromBufferAttribute(t,i-1),Pa.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ia.distanceTo(Pa);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Zr.radius+=r,e.ray.intersectsSphere(Zr)===!1)return;Hu.copy(i).invert(),qs.copy(e.ray).applyMatrix4(Hu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const d=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let v=d,g=m-1;v<g;v+=c){const p=u.getX(v),y=u.getX(v+1),b=Jr(this,e,qs,l,p,y,v);b&&t.push(b)}if(this.isLineLoop){const v=u.getX(m-1),g=u.getX(d),p=Jr(this,e,qs,l,v,g,m-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let v=d,g=m-1;v<g;v+=c){const p=Jr(this,e,qs,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=Jr(this,e,qs,l,m-1,d,m-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Jr(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Ia.fromBufferAttribute(o,i),Pa.fromBufferAttribute(o,r),t.distanceSqToSegment(Ia,Pa,Co,Vu)>n)return;Co.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Co);if(!(c<e.near||c>e.far))return{distance:c,point:Vu.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const Gu=new I,Wu=new I;class yg extends Ha{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Gu.fromBufferAttribute(t,i),Wu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Gu.distanceTo(Wu);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xf extends Ha{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class jf extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xu=new Ge,zl=new Mr,Qr=new Gn,ea=new I;class bg extends vt{constructor(e=new At,t=new jf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(i),Qr.radius+=r,e.ray.intersectsSphere(Qr)===!1)return;Xu.copy(i).invert(),zl.copy(e.ray).applyMatrix4(Xu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=f,v=d;m<v;m++){const g=c.getX(m);ea.fromBufferAttribute(h,g),ju(ea,g,l,i,e,t,this)}}else{const f=Math.max(0,a.start),d=Math.min(h.count,a.start+a.count);for(let m=f,v=d;m<v;m++)ea.fromBufferAttribute(h,m),ju(ea,m,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ju(s,e,t,n,i,r,a){const o=zl.distanceSqToPoint(s);if(o<t){const l=new I;zl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Mg extends It{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class $f extends It{constructor(e,t,n=Gi,i,r,a,o=Zt,l=Zt,c,u=pr,h=1){if(u!==pr&&u!==mr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Yf extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Sr extends At{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new I,u=new Oe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const d=n+h/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[f]/e+1)/2,u.y=(a[f+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new nt(a,3)),this.setAttribute("normal",new nt(o,3)),this.setAttribute("uv",new nt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class kt extends At{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],h=[],f=[],d=[];let m=0;const v=[],g=n/2;let p=0;y(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(f,3)),this.setAttribute("uv",new nt(d,2));function y(){const _=new I,E=new I;let T=0;const A=(t-e)/n;for(let R=0;R<=r;R++){const x=[],S=R/r,P=S*(t-e)+e;for(let F=0;F<=i;F++){const z=F/i,V=z*l+o,W=Math.sin(V),j=Math.cos(V);E.x=P*W,E.y=-S*n+g,E.z=P*j,h.push(E.x,E.y,E.z),_.set(W,A,j).normalize(),f.push(_.x,_.y,_.z),d.push(z,1-S),x.push(m++)}v.push(x)}for(let R=0;R<i;R++)for(let x=0;x<r;x++){const S=v[x][R],P=v[x+1][R],F=v[x+1][R+1],z=v[x][R+1];(e>0||x!==0)&&(u.push(S,P,z),T+=3),(t>0||x!==r-1)&&(u.push(P,F,z),T+=3)}c.addGroup(p,T,0),p+=T}function b(_){const E=m,T=new Oe,A=new I;let R=0;const x=_===!0?e:t,S=_===!0?1:-1;for(let F=1;F<=i;F++)h.push(0,g*S,0),f.push(0,S,0),d.push(.5,.5),m++;const P=m;for(let F=0;F<=i;F++){const V=F/i*l+o,W=Math.cos(V),j=Math.sin(V);A.x=x*j,A.y=g*S,A.z=x*W,h.push(A.x,A.y,A.z),f.push(0,S,0),T.x=W*.5+.5,T.y=j*.5*S+.5,d.push(T.x,T.y),m++}for(let F=0;F<i;F++){const z=E+F,V=P+F;_===!0?u.push(V,V+1,z):u.push(V+1,V,z),R+=3}c.addGroup(p,R,_===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class an extends kt{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new an(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Va extends At{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),u(),this.setAttribute("position",new nt(r,3)),this.setAttribute("normal",new nt(r.slice(),3)),this.setAttribute("uv",new nt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const b=new I,_=new I,E=new I;for(let T=0;T<t.length;T+=3)d(t[T+0],b),d(t[T+1],_),d(t[T+2],E),l(b,_,E,y)}function l(y,b,_,E){const T=E+1,A=[];for(let R=0;R<=T;R++){A[R]=[];const x=y.clone().lerp(_,R/T),S=b.clone().lerp(_,R/T),P=T-R;for(let F=0;F<=P;F++)F===0&&R===T?A[R][F]=x:A[R][F]=x.clone().lerp(S,F/P)}for(let R=0;R<T;R++)for(let x=0;x<2*(T-R)-1;x++){const S=Math.floor(x/2);x%2===0?(f(A[R][S+1]),f(A[R+1][S]),f(A[R][S])):(f(A[R][S+1]),f(A[R+1][S+1]),f(A[R+1][S]))}}function c(y){const b=new I;for(let _=0;_<r.length;_+=3)b.x=r[_+0],b.y=r[_+1],b.z=r[_+2],b.normalize().multiplyScalar(y),r[_+0]=b.x,r[_+1]=b.y,r[_+2]=b.z}function u(){const y=new I;for(let b=0;b<r.length;b+=3){y.x=r[b+0],y.y=r[b+1],y.z=r[b+2];const _=g(y)/2/Math.PI+.5,E=p(y)/Math.PI+.5;a.push(_,1-E)}m(),h()}function h(){for(let y=0;y<a.length;y+=6){const b=a[y+0],_=a[y+2],E=a[y+4],T=Math.max(b,_,E),A=Math.min(b,_,E);T>.9&&A<.1&&(b<.2&&(a[y+0]+=1),_<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,b){const _=y*3;b.x=e[_+0],b.y=e[_+1],b.z=e[_+2]}function m(){const y=new I,b=new I,_=new I,E=new I,T=new Oe,A=new Oe,R=new Oe;for(let x=0,S=0;x<r.length;x+=9,S+=6){y.set(r[x+0],r[x+1],r[x+2]),b.set(r[x+3],r[x+4],r[x+5]),_.set(r[x+6],r[x+7],r[x+8]),T.set(a[S+0],a[S+1]),A.set(a[S+2],a[S+3]),R.set(a[S+4],a[S+5]),E.copy(y).add(b).add(_).divideScalar(3);const P=g(E);v(T,S+0,y,P),v(A,S+2,b,P),v(R,S+4,_,P)}}function v(y,b,_,E){E<0&&y.x===1&&(a[b]=y.x-1),_.x===0&&_.z===0&&(a[b]=E/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Va(e.vertices,e.indices,e.radius,e.details)}}class wr extends Va{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new wr(e.radius,e.detail)}}class Ac extends Va{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ac(e.radius,e.detail)}}class Xi extends At{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,h=e/o,f=t/l,d=[],m=[],v=[],g=[];for(let p=0;p<u;p++){const y=p*f-a;for(let b=0;b<c;b++){const _=b*h-r;m.push(_,-y,0),v.push(0,0,1),g.push(b/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const b=y+c*p,_=y+c*(p+1),E=y+1+c*(p+1),T=y+1+c*p;d.push(b,_,T),d.push(_,E,T)}this.setIndex(d),this.setAttribute("position",new nt(m,3)),this.setAttribute("normal",new nt(v,3)),this.setAttribute("uv",new nt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Rc extends At{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],u=[];let h=e;const f=(t-e)/i,d=new I,m=new Oe;for(let v=0;v<=i;v++){for(let g=0;g<=n;g++){const p=r+g/n*a;d.x=h*Math.cos(p),d.y=h*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),m.x=(d.x/t+1)/2,m.y=(d.y/t+1)/2,u.push(m.x,m.y)}h+=f}for(let v=0;v<i;v++){const g=v*(n+1);for(let p=0;p<n;p++){const y=p+g,b=y,_=y+n+1,E=y+n+2,T=y+1;o.push(b,_,T),o.push(_,E,T)}}this.setIndex(o),this.setAttribute("position",new nt(l,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rc(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ga extends At{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new I,f=new I,d=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){const y=[],b=p/n;let _=0;p===0&&a===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const T=E/t;h.x=-e*Math.cos(i+T*r)*Math.sin(a+b*o),h.y=e*Math.cos(a+b*o),h.z=e*Math.sin(i+T*r)*Math.sin(a+b*o),m.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),g.push(T+_,1-b),y.push(c++)}u.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){const b=u[p][y+1],_=u[p][y],E=u[p+1][y],T=u[p+1][y+1];(p!==0||a>0)&&d.push(b,_,T),(p!==n-1||l<Math.PI)&&d.push(_,E,T)}this.setIndex(d),this.setAttribute("position",new nt(m,3)),this.setAttribute("normal",new nt(v,3)),this.setAttribute("uv",new nt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ga(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Hn extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wn extends Hn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Cc extends Cn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xc,this.normalScale=new Oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Sg extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=pm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class wg extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ta(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Eg(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Tg(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function $u(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function qf(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class Er{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Ag extends Er{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ms,endingEnd:ms}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case gs:r=e,o=2*t-n;break;case Aa:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case gs:a=e,l=2*n-t;break;case Aa:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,d=this._weightNext,m=(n-t)/(i-t),v=m*m,g=v*m,p=-f*g+2*f*v-f*m,y=(1+f)*g+(-1.5-2*f)*v+(-.5+f)*m+1,b=(-1-d)*g+(1.5+d)*v+.5*m,_=d*g-d*v;for(let E=0;E!==o;++E)r[E]=p*a[u+E]+y*a[c+E]+b*a[l+E]+_*a[h+E];return r}}class Kf extends Er{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(i-t),h=1-u;for(let f=0;f!==o;++f)r[f]=a[c+f]*h+a[l+f]*u;return r}}class Rg extends Er{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Ln{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ta(t,this.TimeBufferType),this.values=ta(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ta(e.times,Array),values:ta(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Rg(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Kf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ag(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case gr:t=this.InterpolantFactoryMethodDiscrete;break;case vr:t=this.InterpolantFactoryMethodLinear;break;case io:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return gr;case this.InterpolantFactoryMethodLinear:return vr;case this.InterpolantFactoryMethodSmooth:return io}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Eg(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===io,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)l=!0;else{const h=o*n,f=h-n,d=h+n;for(let m=0;m!==n;++m){const v=t[h+m];if(v!==t[f+m]||v!==t[d+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[h+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Ln.prototype.ValueTypeName="";Ln.prototype.TimeBufferType=Float32Array;Ln.prototype.ValueBufferType=Float32Array;Ln.prototype.DefaultInterpolation=vr;class ks extends Ln{constructor(e,t,n){super(e,t,n)}}ks.prototype.ValueTypeName="bool";ks.prototype.ValueBufferType=Array;ks.prototype.DefaultInterpolation=gr;ks.prototype.InterpolantFactoryMethodLinear=void 0;ks.prototype.InterpolantFactoryMethodSmooth=void 0;class Zf extends Ln{constructor(e,t,n,i){super(e,t,n,i)}}Zf.prototype.ValueTypeName="color";class Is extends Ln{constructor(e,t,n,i){super(e,t,n,i)}}Is.prototype.ValueTypeName="number";class Cg extends Er{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let u=c+o;c!==u;c+=4)Rn.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Ps extends Ln{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Cg(this.times,this.values,this.getValueSize(),e)}}Ps.prototype.ValueTypeName="quaternion";Ps.prototype.InterpolantFactoryMethodSmooth=void 0;class Os extends Ln{constructor(e,t,n){super(e,t,n)}}Os.prototype.ValueTypeName="string";Os.prototype.ValueBufferType=Array;Os.prototype.DefaultInterpolation=gr;Os.prototype.InterpolantFactoryMethodLinear=void 0;Os.prototype.InterpolantFactoryMethodSmooth=void 0;class Ls extends Ln{constructor(e,t,n,i){super(e,t,n,i)}}Ls.prototype.ValueTypeName="vector";class Bl{constructor(e="",t=-1,n=[],i=_c){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=An(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Pg(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Ln.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const u=Tg(l);l=$u(l,1,u),c=$u(c,1,u),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Is(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(r);if(u&&u.length>1){const h=u[1];let f=i[h];f||(i[h]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,f,d,m,v){if(d.length!==0){const g=[],p=[];qf(d,g,p,m),g.length!==0&&v.push(new h(f,g,p))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const f=c[h].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let m;for(m=0;m<f.length;m++)if(f[m].morphTargets)for(let v=0;v<f[m].morphTargets.length;v++)d[f[m].morphTargets[v]]=-1;for(const v in d){const g=[],p=[];for(let y=0;y!==f[m].morphTargets.length;++y){const b=f[m];g.push(b.time),p.push(b.morphTarget===v?1:0)}i.push(new Is(".morphTargetInfluence["+v+"]",g,p))}l=d.length*a}else{const d=".bones["+t[h].name+"]";n(Ls,d+".position",f,"pos",i),n(Ps,d+".quaternion",f,"rot",i),n(Ls,d+".scale",f,"scl",i)}}return i.length===0?null:new this(r,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Ig(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Is;case"vector":case"vector2":case"vector3":case"vector4":return Ls;case"color":return Zf;case"quaternion":return Ps;case"bool":case"boolean":return ks;case"string":return Os}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Pg(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Ig(s.type);if(s.times===void 0){const t=[],n=[];qf(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const ei={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class Lg{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){o++,r===!1&&i.onStart!==void 0&&i.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,i.onProgress!==void 0&&i.onProgress(u,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const d=c[h],m=c[h+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Dg=new Lg;class zs{constructor(e){this.manager=e!==void 0?e:Dg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}zs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Zn={};class Ng extends Error{constructor(e,t){super(e),this.response=t}}class Jf extends zs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ei.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Zn[e]!==void 0){Zn[e].push({onLoad:t,onProgress:n,onError:i});return}Zn[e]=[],Zn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Zn[e],h=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,m=d!==0;let v=0;const g=new ReadableStream({start(p){y();function y(){h.read().then(({done:b,value:_})=>{if(b)p.close();else{v+=_.byteLength;const E=new ProgressEvent("progress",{lengthComputable:m,loaded:v,total:d});for(let T=0,A=u.length;T<A;T++){const R=u[T];R.onProgress&&R.onProgress(E)}p.enqueue(_),y()}},b=>{p.error(b)})}}});return new Response(g)}else throw new Ng(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),f=h&&h[1]?h[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(m=>d.decode(m))}}}).then(c=>{ei.add(`file:${e}`,c);const u=Zn[e];delete Zn[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=Zn[e];if(u===void 0)throw this.manager.itemError(e),c;delete Zn[e];for(let h=0,f=u.length;h<f;h++){const d=u[h];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const hs=new WeakMap;class Ug extends zs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ei.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let h=hs.get(a);h===void 0&&(h=[],hs.set(a,h)),h.push({onLoad:t,onError:i})}return a}const o=_r("img");function l(){u(),t&&t(this);const h=hs.get(this)||[];for(let f=0;f<h.length;f++){const d=h[f];d.onLoad&&d.onLoad(this)}hs.delete(this),r.manager.itemEnd(e)}function c(h){u(),i&&i(h),ei.remove(`image:${e}`);const f=hs.get(this)||[];for(let d=0;d<f.length;d++){const m=f[d];m.onError&&m.onError(h)}hs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ei.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Fg extends zs{constructor(e){super(e)}load(e,t,n,i){const r=new It,a=new Ug(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Wa extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Yu extends Wa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Io=new Ge,qu=new I,Ku=new I;class Ic{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Oe(512,512),this.mapType=Bn,this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tc,this._frameExtents=new Oe(1,1),this._viewportCount=1,this._viewports=[new et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;qu.setFromMatrixPosition(e.matrixWorld),t.position.copy(qu),Ku.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ku),t.updateMatrixWorld(),Io.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Io,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Io)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class kg extends Ic{constructor(){super(new nn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Rs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Og extends Wa{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new kg}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Zu=new Ge,Ks=new I,Po=new I;class zg extends Ic{constructor(){super(new nn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Oe(4,2),this._viewportCount=6,this._viewports=[new et(2,1,1,1),new et(0,1,1,1),new et(3,1,1,1),new et(1,1,1,1),new et(3,0,1,1),new et(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ks.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ks),Po.copy(n.position),Po.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Po),n.updateMatrixWorld(),i.makeTranslation(-Ks.x,-Ks.y,-Ks.z),Zu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zu,n.coordinateSystem,n.reversedDepth)}}class Bg extends Wa{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new zg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Tr extends Vf{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Hg extends Ic{constructor(){super(new Tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hl extends Wa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new Hg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class rr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Lo=new WeakMap;class Vg extends zs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ei.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{if(Lo.has(a)===!0)i&&i(Lo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(c),r.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return ei.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Lo.set(l,c),ei.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ei.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class Gg extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Wg{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Rn.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;Rn.multiplyQuaternionsFlat(e,a,e,t,e,n),Rn.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const Pc="\\[\\]\\.:\\/",Xg=new RegExp("["+Pc+"]","g"),Lc="[^"+Pc+"]",jg="[^"+Pc.replace("\\.","")+"]",$g=/((?:WC+[\/:])*)/.source.replace("WC",Lc),Yg=/(WCOD+)?/.source.replace("WCOD",jg),qg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Lc),Kg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Lc),Zg=new RegExp("^"+$g+Yg+qg+Kg+"$"),Jg=["material","materials","bones","map"];class Qg{constructor(e,t,n){const i=n||lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class lt{constructor(e,t,n){this.path=t,this.parsedPath=n||lt.parseTrackName(t),this.node=lt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new lt.Composite(e,t,n):new lt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Xg,"")}static parseTrackName(e){const t=Zg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Jg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=lt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}lt.Composite=Qg;lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};lt.prototype.GetterByBindingType=[lt.prototype._getValue_direct,lt.prototype._getValue_array,lt.prototype._getValue_arrayElement,lt.prototype._getValue_toArray];lt.prototype.SetterByBindingTypeAndVersioning=[[lt.prototype._setValue_direct,lt.prototype._setValue_direct_setNeedsUpdate,lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_array,lt.prototype._setValue_array_setNeedsUpdate,lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_arrayElement,lt.prototype._setValue_arrayElement_setNeedsUpdate,lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[lt.prototype._setValue_fromArray,lt.prototype._setValue_fromArray_setNeedsUpdate,lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class e0{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:ms,endingEnd:ms};for(let c=0;c!==a;++c){const u=r[c].createInterpolant(null);o[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=um,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case fm:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulateAdditive(o);break;case _c:default:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===hm;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===cm){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=gs,i.endingEnd=gs):(e?i.endingStart=this.zeroSlopeAtStart?gs:ms:i.endingStart=Aa,t?i.endingEnd=this.zeroSlopeAtEnd?gs:ms:i.endingEnd=Aa)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}}const t0=new Float32Array(1);class n0 extends qi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let u=c[l];u===void 0&&(u={},c[l]=u);for(let h=0;h!==r;++h){const f=i[h],d=f.name;let m=u[d];if(m!==void 0)++m.referenceCount,a[h]=m;else{if(m=a[h],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,d));continue}const v=t&&t._propertyBindings[h].binding.parsedPath;m=new Wg(lt.create(n,d,v),f.ValueTypeName,f.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,d),a[h]=m}o[h].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;const h=o.actionByRoot,f=(e._localRoot||this._root).uuid;delete h[f],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Kf(new Float32Array(2),new Float32Array(2),1,t0),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?Bl.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=_c),l!==void 0){const h=l.actionByRoot[r];if(h!==void 0&&h.blendMode===n)return h;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const u=new e0(this,a,t,n);return this._bindAction(u,c),this._addInactiveAction(u,o,r),u}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Bl.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const Ju=new Ge;class Qf{constructor(e,t,n=0,i=1/0){this.ray=new Mr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Mc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ju.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ju),this}intersectObject(e,t=!0,n=[]){return Vl(e,this,n,t),n.sort(Qu),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Vl(e[i],this,n,t);return n.sort(Qu),n}}function Qu(s,e){return s.distance-e.distance}function Vl(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Vl(r[a],e,t,!0)}}class i0{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}function eh(s,e,t,n){const i=s0(n);switch(t){case Pf:return s*e;case pc:return s*e/i.components*i.byteLength;case mc:return s*e/i.components*i.byteLength;case Df:return s*e*2/i.components*i.byteLength;case gc:return s*e*2/i.components*i.byteLength;case Lf:return s*e*3/i.components*i.byteLength;case sn:return s*e*4/i.components*i.byteLength;case vc:return s*e*4/i.components*i.byteLength;case fa:case da:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case pa:case ma:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case cl:case hl:return Math.max(s,16)*Math.max(e,8)/4;case ll:case ul:return Math.max(s,8)*Math.max(e,8)/2;case fl:case dl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case pl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ml:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case gl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case vl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case _l:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case xl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case yl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case bl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Ml:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Sl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case wl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Tl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Al:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Rl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Cl:case Il:case Pl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Ll:case Dl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Nl:case Ul:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function s0(s){switch(s){case Bn:case Af:return{byteLength:1,components:1};case fr:case Rf:case br:return{byteLength:2,components:1};case fc:case dc:return{byteLength:2,components:4};case Gi:case hc:case En:return{byteLength:4,components:1};case Cf:case If:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cc);function ed(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function r0(s){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(s.bindBuffer(c,o),h.length===0)s.bufferSubData(c,0,u);else{h.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<h.length;d++){const m=h[f],v=h[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++f,h[f]=v)}h.length=f+1;for(let d=0,m=h.length;d<m;d++){const v=h[d];s.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var a0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,o0=`#ifdef USE_ALPHAHASH
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
#endif`,l0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,c0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,h0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,f0=`#ifdef USE_AOMAP
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
#endif`,d0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p0=`#ifdef USE_BATCHING
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
#endif`,m0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,g0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,v0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,x0=`#ifdef USE_IRIDESCENCE
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
#endif`,y0=`#ifdef USE_BUMPMAP
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
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,M0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,w0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,E0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,T0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,R0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,C0=`#define PI 3.141592653589793
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
} // validated`,I0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,P0=`vec3 transformedNormal = objectNormal;
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
#endif`,L0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,D0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,N0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,U0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,F0="gl_FragColor = linearToOutputTexel( gl_FragColor );",k0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,O0=`#ifdef USE_ENVMAP
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
#endif`,z0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,B0=`#ifdef USE_ENVMAP
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
#endif`,H0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V0=`#ifdef USE_ENVMAP
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
#endif`,G0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,j0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$0=`#ifdef USE_GRADIENTMAP
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
}`,Y0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,q0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Z0=`uniform bool receiveShadow;
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
#endif`,J0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ev=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,iv=`PhysicalMaterial material;
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
#endif`,sv=`struct PhysicalMaterial {
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
}`,rv=`
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
#endif`,av=`#if defined( RE_IndirectDiffuse )
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
#endif`,ov=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,mv=`#if defined( USE_POINTS_UV )
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
#endif`,gv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_v=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bv=`#ifdef USE_MORPHTARGETS
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
#endif`,Mv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ev=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Av=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rv=`#ifdef USE_NORMALMAP
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
#endif`,Cv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Iv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Pv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Uv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ov=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Wv=`float getShadowMask() {
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
}`,Xv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jv=`#ifdef USE_SKINNING
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
#endif`,$v=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yv=`#ifdef USE_SKINNING
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
#endif`,qv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qv=`#ifdef USE_TRANSMISSION
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
#endif`,e_=`#ifdef USE_TRANSMISSION
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
#endif`,t_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,n_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,i_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,s_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const r_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,a_=`uniform sampler2D t2D;
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
}`,o_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,c_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h_=`#include <common>
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
}`,f_=`#if DEPTH_PACKING == 3200
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
}`,d_=`#define DISTANCE
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
}`,p_=`#define DISTANCE
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
}`,m_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,g_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,v_=`uniform float scale;
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
}`,__=`uniform vec3 diffuse;
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
}`,x_=`#include <common>
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
}`,y_=`uniform vec3 diffuse;
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
}`,b_=`#define LAMBERT
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
}`,M_=`#define LAMBERT
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
}`,S_=`#define MATCAP
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
}`,w_=`#define MATCAP
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
}`,E_=`#define NORMAL
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
}`,T_=`#define NORMAL
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
}`,A_=`#define PHONG
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
}`,R_=`#define PHONG
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
}`,C_=`#define STANDARD
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
}`,I_=`#define STANDARD
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
}`,P_=`#define TOON
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
}`,L_=`#define TOON
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
}`,D_=`uniform float size;
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
}`,N_=`uniform vec3 diffuse;
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
}`,U_=`#include <common>
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
}`,F_=`uniform vec3 color;
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
}`,k_=`uniform float rotation;
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
}`,O_=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:a0,alphahash_pars_fragment:o0,alphamap_fragment:l0,alphamap_pars_fragment:c0,alphatest_fragment:u0,alphatest_pars_fragment:h0,aomap_fragment:f0,aomap_pars_fragment:d0,batching_pars_vertex:p0,batching_vertex:m0,begin_vertex:g0,beginnormal_vertex:v0,bsdfs:_0,iridescence_fragment:x0,bumpmap_pars_fragment:y0,clipping_planes_fragment:b0,clipping_planes_pars_fragment:M0,clipping_planes_pars_vertex:S0,clipping_planes_vertex:w0,color_fragment:E0,color_pars_fragment:T0,color_pars_vertex:A0,color_vertex:R0,common:C0,cube_uv_reflection_fragment:I0,defaultnormal_vertex:P0,displacementmap_pars_vertex:L0,displacementmap_vertex:D0,emissivemap_fragment:N0,emissivemap_pars_fragment:U0,colorspace_fragment:F0,colorspace_pars_fragment:k0,envmap_fragment:O0,envmap_common_pars_fragment:z0,envmap_pars_fragment:B0,envmap_pars_vertex:H0,envmap_physical_pars_fragment:J0,envmap_vertex:V0,fog_vertex:G0,fog_pars_vertex:W0,fog_fragment:X0,fog_pars_fragment:j0,gradientmap_pars_fragment:$0,lightmap_pars_fragment:Y0,lights_lambert_fragment:q0,lights_lambert_pars_fragment:K0,lights_pars_begin:Z0,lights_toon_fragment:Q0,lights_toon_pars_fragment:ev,lights_phong_fragment:tv,lights_phong_pars_fragment:nv,lights_physical_fragment:iv,lights_physical_pars_fragment:sv,lights_fragment_begin:rv,lights_fragment_maps:av,lights_fragment_end:ov,logdepthbuf_fragment:lv,logdepthbuf_pars_fragment:cv,logdepthbuf_pars_vertex:uv,logdepthbuf_vertex:hv,map_fragment:fv,map_pars_fragment:dv,map_particle_fragment:pv,map_particle_pars_fragment:mv,metalnessmap_fragment:gv,metalnessmap_pars_fragment:vv,morphinstance_vertex:_v,morphcolor_vertex:xv,morphnormal_vertex:yv,morphtarget_pars_vertex:bv,morphtarget_vertex:Mv,normal_fragment_begin:Sv,normal_fragment_maps:wv,normal_pars_fragment:Ev,normal_pars_vertex:Tv,normal_vertex:Av,normalmap_pars_fragment:Rv,clearcoat_normal_fragment_begin:Cv,clearcoat_normal_fragment_maps:Iv,clearcoat_pars_fragment:Pv,iridescence_pars_fragment:Lv,opaque_fragment:Dv,packing:Nv,premultiplied_alpha_fragment:Uv,project_vertex:Fv,dithering_fragment:kv,dithering_pars_fragment:Ov,roughnessmap_fragment:zv,roughnessmap_pars_fragment:Bv,shadowmap_pars_fragment:Hv,shadowmap_pars_vertex:Vv,shadowmap_vertex:Gv,shadowmask_pars_fragment:Wv,skinbase_vertex:Xv,skinning_pars_vertex:jv,skinning_vertex:$v,skinnormal_vertex:Yv,specularmap_fragment:qv,specularmap_pars_fragment:Kv,tonemapping_fragment:Zv,tonemapping_pars_fragment:Jv,transmission_fragment:Qv,transmission_pars_fragment:e_,uv_pars_fragment:t_,uv_pars_vertex:n_,uv_vertex:i_,worldpos_vertex:s_,background_vert:r_,background_frag:a_,backgroundCube_vert:o_,backgroundCube_frag:l_,cube_vert:c_,cube_frag:u_,depth_vert:h_,depth_frag:f_,distanceRGBA_vert:d_,distanceRGBA_frag:p_,equirect_vert:m_,equirect_frag:g_,linedashed_vert:v_,linedashed_frag:__,meshbasic_vert:x_,meshbasic_frag:y_,meshlambert_vert:b_,meshlambert_frag:M_,meshmatcap_vert:S_,meshmatcap_frag:w_,meshnormal_vert:E_,meshnormal_frag:T_,meshphong_vert:A_,meshphong_frag:R_,meshphysical_vert:C_,meshphysical_frag:I_,meshtoon_vert:P_,meshtoon_frag:L_,points_vert:D_,points_frag:N_,shadow_vert:U_,shadow_frag:F_,sprite_vert:k_,sprite_frag:O_},re={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new Oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},Fn={basic:{uniforms:$t([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:$t([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:$t([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:$t([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:$t([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:$t([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:$t([re.points,re.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:$t([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:$t([re.common,re.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:$t([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:$t([re.sprite,re.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:$t([re.common,re.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:$t([re.lights,re.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Fn.physical={uniforms:$t([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const na={r:0,b:0,g:0},Di=new In,z_=new Ge;function B_(s,e,t,n,i,r,a){const o=new fe(0);let l=r===!0?0:1,c,u,h=null,f=0,d=null;function m(b){let _=b.isScene===!0?b.background:null;return _&&_.isTexture&&(_=(b.backgroundBlurriness>0?t:e).get(_)),_}function v(b){let _=!1;const E=m(b);E===null?p(o,l):E&&E.isColor&&(p(E,1),_=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(b,_){const E=m(_);E&&(E.isCubeTexture||E.mapping===Oa)?(u===void 0&&(u=new Ke(new Fs(1,1,1),new si({name:"BackgroundCubeMaterial",uniforms:Cs(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Di.copy(_.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(z_.makeRotationFromEuler(Di)),u.material.toneMapped=Qe.getTransfer(E.colorSpace)!==ht,(h!==E||f!==E.version||d!==s.toneMapping)&&(u.material.needsUpdate=!0,h=E,f=E.version,d=s.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Ke(new Xi(2,2),new si({name:"BackgroundMaterial",uniforms:Cs(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(E.colorSpace)!==ht,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||f!==E.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=E,f=E.version,d=s.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,_){b.getRGB(na,Hf(s)),n.buffers.color.setClear(na.r,na.g,na.b,_,a)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,_=1){o.set(b),l=_,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(o,l)},render:v,addToRenderList:g,dispose:y}}function H_(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(S,P,F,z,V){let W=!1;const j=h(z,F,P);r!==j&&(r=j,c(r.object)),W=d(S,z,F,V),W&&m(S,z,F,V),V!==null&&e.update(V,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,_(S,P,F,z),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return s.createVertexArray()}function c(S){return s.bindVertexArray(S)}function u(S){return s.deleteVertexArray(S)}function h(S,P,F){const z=F.wireframe===!0;let V=n[S.id];V===void 0&&(V={},n[S.id]=V);let W=V[P.id];W===void 0&&(W={},V[P.id]=W);let j=W[z];return j===void 0&&(j=f(l()),W[z]=j),j}function f(S){const P=[],F=[],z=[];for(let V=0;V<t;V++)P[V]=0,F[V]=0,z[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:z,object:S,attributes:{},index:null}}function d(S,P,F,z){const V=r.attributes,W=P.attributes;let j=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){const ue=V[H];let Te=W[H];if(Te===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(Te=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(Te=S.instanceColor)),ue===void 0||ue.attribute!==Te||Te&&ue.data!==Te.data)return!0;j++}return r.attributesNum!==j||r.index!==z}function m(S,P,F,z){const V={},W=P.attributes;let j=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){let ue=W[H];ue===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(ue=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(ue=S.instanceColor));const Te={};Te.attribute=ue,ue&&ue.data&&(Te.data=ue.data),V[H]=Te,j++}r.attributes=V,r.attributesNum=j,r.index=z}function v(){const S=r.newAttributes;for(let P=0,F=S.length;P<F;P++)S[P]=0}function g(S){p(S,0)}function p(S,P){const F=r.newAttributes,z=r.enabledAttributes,V=r.attributeDivisors;F[S]=1,z[S]===0&&(s.enableVertexAttribArray(S),z[S]=1),V[S]!==P&&(s.vertexAttribDivisor(S,P),V[S]=P)}function y(){const S=r.newAttributes,P=r.enabledAttributes;for(let F=0,z=P.length;F<z;F++)P[F]!==S[F]&&(s.disableVertexAttribArray(F),P[F]=0)}function b(S,P,F,z,V,W,j){j===!0?s.vertexAttribIPointer(S,P,F,V,W):s.vertexAttribPointer(S,P,F,z,V,W)}function _(S,P,F,z){v();const V=z.attributes,W=F.getAttributes(),j=P.defaultAttributeValues;for(const K in W){const H=W[K];if(H.location>=0){let ae=V[K];if(ae===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(ae=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(ae=S.instanceColor)),ae!==void 0){const ue=ae.normalized,Te=ae.itemSize,$e=e.get(ae);if($e===void 0)continue;const mt=$e.buffer,bt=$e.type,at=$e.bytesPerElement,$=bt===s.INT||bt===s.UNSIGNED_INT||ae.gpuType===hc;if(ae.isInterleavedBufferAttribute){const Z=ae.data,pe=Z.stride,ke=ae.offset;if(Z.isInstancedInterleavedBuffer){for(let we=0;we<H.locationSize;we++)p(H.location+we,Z.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let we=0;we<H.locationSize;we++)g(H.location+we);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let we=0;we<H.locationSize;we++)b(H.location+we,Te/H.locationSize,bt,ue,pe*at,(ke+Te/H.locationSize*we)*at,$)}else{if(ae.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,ae.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Z=0;Z<H.locationSize;Z++)g(H.location+Z);s.bindBuffer(s.ARRAY_BUFFER,mt);for(let Z=0;Z<H.locationSize;Z++)b(H.location+Z,Te/H.locationSize,bt,ue,Te*at,Te/H.locationSize*Z*at,$)}}else if(j!==void 0){const ue=j[K];if(ue!==void 0)switch(ue.length){case 2:s.vertexAttrib2fv(H.location,ue);break;case 3:s.vertexAttrib3fv(H.location,ue);break;case 4:s.vertexAttrib4fv(H.location,ue);break;default:s.vertexAttrib1fv(H.location,ue)}}}}y()}function E(){R();for(const S in n){const P=n[S];for(const F in P){const z=P[F];for(const V in z)u(z[V].object),delete z[V];delete P[F]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const P=n[S.id];for(const F in P){const z=P[F];for(const V in z)u(z[V].object),delete z[V];delete P[F]}delete n[S.id]}function A(S){for(const P in n){const F=n[P];if(F[S.id]===void 0)continue;const z=F[S.id];for(const V in z)u(z[V].object),delete z[V];delete F[S.id]}}function R(){x(),a=!0,r!==i&&(r=i,c(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:R,resetDefaultState:x,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:g,disableUnusedAttributes:y}}function V_(s,e,t){let n;function i(c){n=c}function r(c,u){s.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(s.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let d=0;for(let m=0;m<h;m++)d+=u[m];t.update(d,n,1)}function l(c,u,h,f){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<c.length;m++)a(c[m],u[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let m=0;for(let v=0;v<h;v++)m+=u[v]*f[v];t.update(m,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function G_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==sn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===br&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Bn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==En&&!R)}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),y=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:_,vertexTextures:E,maxSamples:T}}function W_(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Qn,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||n!==0||i;return i=f,n=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const m=h.clippingPlanes,v=h.clipIntersection,g=h.clipShadows,p=s.get(h);if(!i||m===null||m.length===0||r&&!g)r?u(null):c();else{const y=r?0:n,b=y*4;let _=p.clippingState||null;l.value=_,_=u(m,f,b,d);for(let E=0;E!==b;++E)_[E]=t[E];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,d,m){const v=h!==null?h.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=d+v*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let b=0,_=d;b!==v;++b,_+=4)a.copy(h[b]).applyMatrix4(y,o),a.normal.toArray(g,_),g[_+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function X_(s){let e=new WeakMap;function t(a,o){return o===al?a.mapping=Ts:o===ol&&(a.mapping=As),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===al||o===ol)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ug(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const vs=4,th=[.125,.215,.35,.446,.526,.582],Oi=20,Do=new Tr,nh=new fe;let No=null,Uo=0,Fo=0,ko=!1;const Fi=(1+Math.sqrt(5))/2,fs=1/Fi,ih=[new I(-Fi,fs,0),new I(Fi,fs,0),new I(-fs,0,Fi),new I(fs,0,Fi),new I(0,Fi,-fs),new I(0,Fi,fs),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],j_=new I;class sh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=j_}=r;No=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ah(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(No,Uo,Fo),this._renderer.xr.enabled=ko,e.scissorTest=!1,ia(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ts||e.mapping===As?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),No=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),ko=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:br,format:sn,colorSpace:Jt,depthBuffer:!1},i=rh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rh(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$_(r)),this._blurMaterial=Y_(r,e,t)}return i}_compileMaterial(e){const t=new Ke(this._lodPlanes[0],e);this._renderer.compile(t,Do)}_sceneToCubeUV(e,t,n,i,r){const l=new nn(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(nh),h.toneMapping=bi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null));const v=new qt({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),g=new Ke(new Fs,v);let p=!1;const y=e.background;y?y.isColor&&(v.color.copy(y),e.background=null,p=!0):(v.color.copy(nh),p=!0);for(let b=0;b<6;b++){const _=b%3;_===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):_===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));const E=this._cubeSize;ia(i,_*E,b>2?E:0,E,E),h.setRenderTarget(i),p&&h.render(g,l),h.render(e,l)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,e.background=y}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ts||e.mapping===As;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=oh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ah());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new Ke(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;ia(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Do)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ih[(i-r-1)%ih.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Ke(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Oi-1),v=r/m,g=isFinite(r)?1+Math.floor(u*v):Oi;g>Oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Oi}`);const p=[];let y=0;for(let A=0;A<Oi;++A){const R=A/v,x=Math.exp(-R*R/2);p.push(x),A===0?y+=x:A<g&&(y+=2*x)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:b}=this;f.dTheta.value=m,f.mipInt.value=b-n;const _=this._sizeLods[i],E=3*_*(i>b-vs?i-b+vs:0),T=4*(this._cubeSize-_);ia(t,E,T,3*_,2*_),l.setRenderTarget(t),l.render(h,Do)}}function $_(s){const e=[],t=[],n=[];let i=s;const r=s-vs+1+th.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-vs?l=th[a-s+vs-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,m=6,v=3,g=2,p=1,y=new Float32Array(v*m*d),b=new Float32Array(g*m*d),_=new Float32Array(p*m*d);for(let T=0;T<d;T++){const A=T%3*2/3-1,R=T>2?0:-1,x=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(x,v*m*T),b.set(f,g*m*T);const S=[T,T,T,T,T,T];_.set(S,p*m*T)}const E=new At;E.setAttribute("position",new Ft(y,v)),E.setAttribute("uv",new Ft(b,g)),E.setAttribute("faceIndex",new Ft(_,p)),e.push(E),i>vs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function rh(s,e,t){const n=new Wi(s,e,t);return n.texture.mapping=Oa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ia(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Y_(s,e,t){const n=new Float32Array(Oi),i=new I(0,1,0);return new si({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:yi,depthTest:!1,depthWrite:!1})}function ah(){return new si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:yi,depthTest:!1,depthWrite:!1})}function oh(){return new si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yi,depthTest:!1,depthWrite:!1})}function Dc(){return`

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
	`}function q_(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===al||l===ol,u=l===Ts||l===As;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new sh(s)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const d=o.image;return c&&d&&d.height>0||u&&d&&i(d)?(t===null&&(t=new sh(s)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function i(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function K_(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&xr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Z_(s,e,t,n){const i={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const d in f)e.update(f[d],s.ARRAY_BUFFER)}function c(h){const f=[],d=h.index,m=h.attributes.position;let v=0;if(d!==null){const y=d.array;v=d.version;for(let b=0,_=y.length;b<_;b+=3){const E=y[b+0],T=y[b+1],A=y[b+2];f.push(E,T,T,A,A,E)}}else if(m!==void 0){const y=m.array;v=m.version;for(let b=0,_=y.length/3-1;b<_;b+=3){const E=b+0,T=b+1,A=b+2;f.push(E,T,T,A,A,E)}}else return;const g=new(Ff(f)?Bf:zf)(f,1);g.version=v;const p=r.get(h);p&&e.remove(p),r.set(h,g)}function u(h){const f=r.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function J_(s,e,t){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){s.drawElements(n,d,r,f*a),t.update(d,n,1)}function c(f,d,m){m!==0&&(s.drawElementsInstanced(n,d,r,f*a,m),t.update(d,n,m))}function u(f,d,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];t.update(g,n,1)}function h(f,d,m,v){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)c(f[p]/a,d[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,v,0,m);let p=0;for(let y=0;y<m;y++)p+=d[y]*v[y];t.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Q_(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function ex(s,e,t){const n=new WeakMap,i=new et;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let S=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var d=S;f!==void 0&&f.texture.dispose();const m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let _=0;m===!0&&(_=1),v===!0&&(_=2),g===!0&&(_=3);let E=o.attributes.position.count*_,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*h),R=new kf(A,E,T,h);R.type=En,R.needsUpdate=!0;const x=_*4;for(let P=0;P<h;P++){const F=p[P],z=y[P],V=b[P],W=E*T*4*P;for(let j=0;j<F.count;j++){const K=j*x;m===!0&&(i.fromBufferAttribute(F,j),A[W+K+0]=i.x,A[W+K+1]=i.y,A[W+K+2]=i.z,A[W+K+3]=0),v===!0&&(i.fromBufferAttribute(z,j),A[W+K+4]=i.x,A[W+K+5]=i.y,A[W+K+6]=i.z,A[W+K+7]=0),g===!0&&(i.fromBufferAttribute(V,j),A[W+K+8]=i.x,A[W+K+9]=i.y,A[W+K+10]=i.z,A[W+K+11]=V.itemSize===4?i.w:1)}}f={count:h,texture:R,size:new Oe(E,T)},n.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const v=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function tx(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(i.get(h)!==c&&(e.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return h}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const td=new It,lh=new $f(1,1),nd=new kf,id=new $m,sd=new Gf,ch=[],uh=[],hh=new Float32Array(16),fh=new Float32Array(9),dh=new Float32Array(4);function Bs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=ch[i];if(r===void 0&&(r=new Float32Array(i),ch[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Pt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Lt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Xa(s,e){let t=uh[e];t===void 0&&(t=new Int32Array(e),uh[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function nx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function ix(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;s.uniform2fv(this.addr,e),Lt(t,e)}}function sx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;s.uniform3fv(this.addr,e),Lt(t,e)}}function rx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;s.uniform4fv(this.addr,e),Lt(t,e)}}function ax(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;dh.set(n),s.uniformMatrix2fv(this.addr,!1,dh),Lt(t,n)}}function ox(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;fh.set(n),s.uniformMatrix3fv(this.addr,!1,fh),Lt(t,n)}}function lx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;hh.set(n),s.uniformMatrix4fv(this.addr,!1,hh),Lt(t,n)}}function cx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function ux(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;s.uniform2iv(this.addr,e),Lt(t,e)}}function hx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;s.uniform3iv(this.addr,e),Lt(t,e)}}function fx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;s.uniform4iv(this.addr,e),Lt(t,e)}}function dx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function px(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;s.uniform2uiv(this.addr,e),Lt(t,e)}}function mx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;s.uniform3uiv(this.addr,e),Lt(t,e)}}function gx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;s.uniform4uiv(this.addr,e),Lt(t,e)}}function vx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(lh.compareFunction=Uf,r=lh):r=td,t.setTexture2D(e||r,i)}function _x(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||id,i)}function xx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||sd,i)}function yx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||nd,i)}function bx(s){switch(s){case 5126:return nx;case 35664:return ix;case 35665:return sx;case 35666:return rx;case 35674:return ax;case 35675:return ox;case 35676:return lx;case 5124:case 35670:return cx;case 35667:case 35671:return ux;case 35668:case 35672:return hx;case 35669:case 35673:return fx;case 5125:return dx;case 36294:return px;case 36295:return mx;case 36296:return gx;case 35678:case 36198:case 36298:case 36306:case 35682:return vx;case 35679:case 36299:case 36307:return _x;case 35680:case 36300:case 36308:case 36293:return xx;case 36289:case 36303:case 36311:case 36292:return yx}}function Mx(s,e){s.uniform1fv(this.addr,e)}function Sx(s,e){const t=Bs(e,this.size,2);s.uniform2fv(this.addr,t)}function wx(s,e){const t=Bs(e,this.size,3);s.uniform3fv(this.addr,t)}function Ex(s,e){const t=Bs(e,this.size,4);s.uniform4fv(this.addr,t)}function Tx(s,e){const t=Bs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Ax(s,e){const t=Bs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Rx(s,e){const t=Bs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Cx(s,e){s.uniform1iv(this.addr,e)}function Ix(s,e){s.uniform2iv(this.addr,e)}function Px(s,e){s.uniform3iv(this.addr,e)}function Lx(s,e){s.uniform4iv(this.addr,e)}function Dx(s,e){s.uniform1uiv(this.addr,e)}function Nx(s,e){s.uniform2uiv(this.addr,e)}function Ux(s,e){s.uniform3uiv(this.addr,e)}function Fx(s,e){s.uniform4uiv(this.addr,e)}function kx(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);Pt(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||td,r[a])}function Ox(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);Pt(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||id,r[a])}function zx(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);Pt(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||sd,r[a])}function Bx(s,e,t){const n=this.cache,i=e.length,r=Xa(t,i);Pt(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||nd,r[a])}function Hx(s){switch(s){case 5126:return Mx;case 35664:return Sx;case 35665:return wx;case 35666:return Ex;case 35674:return Tx;case 35675:return Ax;case 35676:return Rx;case 5124:case 35670:return Cx;case 35667:case 35671:return Ix;case 35668:case 35672:return Px;case 35669:case 35673:return Lx;case 5125:return Dx;case 36294:return Nx;case 36295:return Ux;case 36296:return Fx;case 35678:case 36198:case 36298:case 36306:case 35682:return kx;case 35679:case 36299:case 36307:return Ox;case 35680:case 36300:case 36308:case 36293:return zx;case 36289:case 36303:case 36311:case 36292:return Bx}}class Vx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=bx(t.type)}}class Gx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hx(t.type)}}class Wx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Oo=/(\w+)(\])?(\[|\.)?/g;function ph(s,e){s.seq.push(e),s.map[e.id]=e}function Xx(s,e,t){const n=s.name,i=n.length;for(Oo.lastIndex=0;;){const r=Oo.exec(n),a=Oo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){ph(t,c===void 0?new Vx(o,s,e):new Gx(o,s,e));break}else{let h=t.map[o];h===void 0&&(h=new Wx(o),ph(t,h)),t=h}}}class ga{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Xx(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function mh(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const jx=37297;let $x=0;function Yx(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const gh=new Ve;function qx(s){Qe._getMatrix(gh,Qe.workingColorSpace,s);const e=`mat3( ${gh.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(s)){case Ra:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function vh(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Yx(s.getShaderSource(e),o)}else return r}function Kx(s,e){const t=qx(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Zx(s,e){let t;switch(e){case nm:t="Linear";break;case im:t="Reinhard";break;case sm:t="Cineon";break;case rl:t="ACESFilmic";break;case am:t="AgX";break;case om:t="Neutral";break;case rm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const sa=new I;function Jx(){Qe.getLuminanceCoefficients(sa);const s=sa.x.toFixed(4),e=sa.y.toFixed(4),t=sa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Qx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(er).join(`
`)}function ey(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ty(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function er(s){return s!==""}function _h(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xh(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ny=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gl(s){return s.replace(ny,sy)}const iy=new Map;function sy(s,e){let t=Xe[e];if(t===void 0){const n=iy.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Gl(t)}const ry=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yh(s){return s.replace(ry,ay)}function ay(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function bh(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function oy(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Sf?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===wf?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function ly(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ts:case As:e="ENVMAP_TYPE_CUBE";break;case Oa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function cy(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===As&&(e="ENVMAP_MODE_REFRACTION"),e}function uy(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case uc:e="ENVMAP_BLENDING_MULTIPLY";break;case em:e="ENVMAP_BLENDING_MIX";break;case tm:e="ENVMAP_BLENDING_ADD";break}return e}function hy(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function fy(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=oy(t),c=ly(t),u=cy(t),h=uy(t),f=hy(t),d=Qx(t),m=ey(r),v=i.createProgram();let g,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(er).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(er).join(`
`),p.length>0&&(p+=`
`)):(g=[bh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(er).join(`
`),p=[bh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bi?"#define TONE_MAPPING":"",t.toneMapping!==bi?Xe.tonemapping_pars_fragment:"",t.toneMapping!==bi?Zx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Kx("linearToOutputTexel",t.outputColorSpace),Jx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(er).join(`
`)),a=Gl(a),a=_h(a,t),a=xh(a,t),o=Gl(o),o=_h(o,t),o=xh(o,t),a=yh(a),o=yh(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===du?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===du?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=y+g+a,_=y+p+o,E=mh(i,i.VERTEX_SHADER,b),T=mh(i,i.FRAGMENT_SHADER,_);i.attachShader(v,E),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function A(P){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(v)||"",z=i.getShaderInfoLog(E)||"",V=i.getShaderInfoLog(T)||"",W=F.trim(),j=z.trim(),K=V.trim();let H=!0,ae=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,T);else{const ue=vh(i,E,"vertex"),Te=vh(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+W+`
`+ue+`
`+Te)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(j===""||K==="")&&(ae=!1);ae&&(P.diagnostics={runnable:H,programLog:W,vertexShader:{log:j,prefix:g},fragmentShader:{log:K,prefix:p}})}i.deleteShader(E),i.deleteShader(T),R=new ga(i,v),x=ty(i,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let x;this.getAttributes=function(){return x===void 0&&A(this),x};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(v,jx)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$x++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let dy=0;class py{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new my(e),t.set(e,n)),n}}class my{constructor(e){this.id=dy++,this.code=e,this.usedTimes=0}}function gy(s,e,t,n,i,r,a){const o=new Mc,l=new py,c=new Set,u=[],h=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return c.add(x),x===0?"uv":`uv${x}`}function g(x,S,P,F,z){const V=F.fog,W=z.geometry,j=x.isMeshStandardMaterial?F.environment:null,K=(x.isMeshStandardMaterial?t:e).get(x.envMap||j),H=K&&K.mapping===Oa?K.image.height:null,ae=m[x.type];x.precision!==null&&(d=i.getMaxPrecision(x.precision),d!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const ue=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Te=ue!==void 0?ue.length:0;let $e=0;W.morphAttributes.position!==void 0&&($e=1),W.morphAttributes.normal!==void 0&&($e=2),W.morphAttributes.color!==void 0&&($e=3);let mt,bt,at,$;if(ae){const ot=Fn[ae];mt=ot.vertexShader,bt=ot.fragmentShader}else mt=x.vertexShader,bt=x.fragmentShader,l.update(x),at=l.getVertexShaderID(x),$=l.getFragmentShaderID(x);const Z=s.getRenderTarget(),pe=s.state.buffers.depth.getReversed(),ke=z.isInstancedMesh===!0,we=z.isBatchedMesh===!0,Je=!!x.map,zt=!!x.matcap,L=!!K,Mt=!!x.aoMap,Be=!!x.lightMap,Ne=!!x.bumpMap,ve=!!x.normalMap,St=!!x.displacementMap,_e=!!x.emissiveMap,We=!!x.metalnessMap,Dt=!!x.roughnessMap,Rt=x.anisotropy>0,C=x.clearcoat>0,M=x.dispersion>0,k=x.iridescence>0,X=x.sheen>0,q=x.transmission>0,G=Rt&&!!x.anisotropyMap,Se=C&&!!x.clearcoatMap,ie=C&&!!x.clearcoatNormalMap,xe=C&&!!x.clearcoatRoughnessMap,ye=k&&!!x.iridescenceMap,te=k&&!!x.iridescenceThicknessMap,ce=X&&!!x.sheenColorMap,De=X&&!!x.sheenRoughnessMap,be=!!x.specularMap,oe=!!x.specularColorMap,He=!!x.specularIntensityMap,D=q&&!!x.transmissionMap,ne=q&&!!x.thicknessMap,se=!!x.gradientMap,de=!!x.alphaMap,J=x.alphaTest>0,Y=!!x.alphaHash,ge=!!x.extensions;let ze=bi;x.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ze=s.toneMapping);const gt={shaderID:ae,shaderType:x.type,shaderName:x.name,vertexShader:mt,fragmentShader:bt,defines:x.defines,customVertexShaderID:at,customFragmentShaderID:$,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:we,batchingColor:we&&z._colorsTexture!==null,instancing:ke,instancingColor:ke&&z.instanceColor!==null,instancingMorph:ke&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Z===null?s.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Jt,alphaToCoverage:!!x.alphaToCoverage,map:Je,matcap:zt,envMap:L,envMapMode:L&&K.mapping,envMapCubeUVHeight:H,aoMap:Mt,lightMap:Be,bumpMap:Ne,normalMap:ve,displacementMap:f&&St,emissiveMap:_e,normalMapObjectSpace:ve&&x.normalMapType===gm,normalMapTangentSpace:ve&&x.normalMapType===xc,metalnessMap:We,roughnessMap:Dt,anisotropy:Rt,anisotropyMap:G,clearcoat:C,clearcoatMap:Se,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:M,iridescence:k,iridescenceMap:ye,iridescenceThicknessMap:te,sheen:X,sheenColorMap:ce,sheenRoughnessMap:De,specularMap:be,specularColorMap:oe,specularIntensityMap:He,transmission:q,transmissionMap:D,thicknessMap:ne,gradientMap:se,opaque:x.transparent===!1&&x.blending===xs&&x.alphaToCoverage===!1,alphaMap:de,alphaTest:J,alphaHash:Y,combine:x.combine,mapUv:Je&&v(x.map.channel),aoMapUv:Mt&&v(x.aoMap.channel),lightMapUv:Be&&v(x.lightMap.channel),bumpMapUv:Ne&&v(x.bumpMap.channel),normalMapUv:ve&&v(x.normalMap.channel),displacementMapUv:St&&v(x.displacementMap.channel),emissiveMapUv:_e&&v(x.emissiveMap.channel),metalnessMapUv:We&&v(x.metalnessMap.channel),roughnessMapUv:Dt&&v(x.roughnessMap.channel),anisotropyMapUv:G&&v(x.anisotropyMap.channel),clearcoatMapUv:Se&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ie&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:te&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:De&&v(x.sheenRoughnessMap.channel),specularMapUv:be&&v(x.specularMap.channel),specularColorMapUv:oe&&v(x.specularColorMap.channel),specularIntensityMapUv:He&&v(x.specularIntensityMap.channel),transmissionMapUv:D&&v(x.transmissionMap.channel),thicknessMapUv:ne&&v(x.thicknessMap.channel),alphaMapUv:de&&v(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ve||Rt),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(Je||de),fog:!!V,useFog:x.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pe,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:$e,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:ze,decodeVideoTexture:Je&&x.map.isVideoTexture===!0&&Qe.getTransfer(x.map.colorSpace)===ht,decodeVideoTextureEmissive:_e&&x.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(x.emissiveMap.colorSpace)===ht,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Yt,flipSided:x.side===rn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ge&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&x.extensions.multiDraw===!0||we)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const P in x.defines)S.push(P),S.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(y(S,x),b(S,x),S.push(s.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function y(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function b(x,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),x.push(o.mask)}function _(x){const S=m[x.type];let P;if(S){const F=Fn[S];P=ag.clone(F.uniforms)}else P=x.uniforms;return P}function E(x,S){let P;for(let F=0,z=u.length;F<z;F++){const V=u[F];if(V.cacheKey===S){P=V,++P.usedTimes;break}}return P===void 0&&(P=new fy(s,S,x,r),u.push(P)),P}function T(x){if(--x.usedTimes===0){const S=u.indexOf(x);u[S]=u[u.length-1],u.pop(),x.destroy()}}function A(x){l.remove(x)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:R}}function vy(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function _y(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Mh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Sh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(h,f,d,m,v,g){let p=s[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:d,groupOrder:m,renderOrder:h.renderOrder,z:v,group:g},s[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=h.renderOrder,p.z=v,p.group=g),e++,p}function o(h,f,d,m,v,g){const p=a(h,f,d,m,v,g);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):t.push(p)}function l(h,f,d,m,v,g){const p=a(h,f,d,m,v,g);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):t.unshift(p)}function c(h,f){t.length>1&&t.sort(h||_y),n.length>1&&n.sort(f||Mh),i.length>1&&i.sort(f||Mh)}function u(){for(let h=e,f=s.length;h<f;h++){const d=s[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:u,sort:c}}function xy(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Sh,s.set(n,[a])):i>=r.length?(a=new Sh,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function yy(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new fe};break;case"SpotLight":t={position:new I,direction:new I,color:new fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new fe,groundColor:new fe};break;case"RectAreaLight":t={color:new fe,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function by(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let My=0;function Sy(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function wy(s){const e=new yy,t=by(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new Ge,a=new Ge;function o(c){let u=0,h=0,f=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let d=0,m=0,v=0,g=0,p=0,y=0,b=0,_=0,E=0,T=0,A=0;c.sort(Sy);for(let x=0,S=c.length;x<S;x++){const P=c[x],F=P.color,z=P.intensity,V=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=F.r*z,h+=F.g*z,f+=F.b*z;else if(P.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(P.sh.coefficients[j],z);A++}else if(P.isDirectionalLight){const j=e.get(P);if(j.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const K=P.shadow,H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[d]=H,n.directionalShadowMap[d]=W,n.directionalShadowMatrix[d]=P.shadow.matrix,y++}n.directional[d]=j,d++}else if(P.isSpotLight){const j=e.get(P);j.position.setFromMatrixPosition(P.matrixWorld),j.color.copy(F).multiplyScalar(z),j.distance=V,j.coneCos=Math.cos(P.angle),j.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),j.decay=P.decay,n.spot[v]=j;const K=P.shadow;if(P.map&&(n.spotLightMap[E]=P.map,E++,K.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[v]=K.matrix,P.castShadow){const H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=W,_++}v++}else if(P.isRectAreaLight){const j=e.get(P);j.color.copy(F).multiplyScalar(z),j.halfWidth.set(P.width*.5,0,0),j.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=j,g++}else if(P.isPointLight){const j=e.get(P);if(j.color.copy(P.color).multiplyScalar(P.intensity),j.distance=P.distance,j.decay=P.decay,P.castShadow){const K=P.shadow,H=t.get(P);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[m]=H,n.pointShadowMap[m]=W,n.pointShadowMatrix[m]=P.shadow.matrix,b++}n.point[m]=j,m++}else if(P.isHemisphereLight){const j=e.get(P);j.skyColor.copy(P.color).multiplyScalar(z),j.groundColor.copy(P.groundColor).multiplyScalar(z),n.hemi[p]=j,p++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=re.LTC_FLOAT_1,n.rectAreaLTC2=re.LTC_FLOAT_2):(n.rectAreaLTC1=re.LTC_HALF_1,n.rectAreaLTC2=re.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const R=n.hash;(R.directionalLength!==d||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==b||R.numSpotShadows!==_||R.numSpotMaps!==E||R.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=_+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,R.directionalLength=d,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=b,R.numSpotShadows=_,R.numSpotMaps=E,R.numLightProbes=A,n.version=My++)}function l(c,u){let h=0,f=0,d=0,m=0,v=0;const g=u.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const b=c[p];if(b.isDirectionalLight){const _=n.directional[h];_.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(g),h++}else if(b.isSpotLight){const _=n.spot[d];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(g),d++}else if(b.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(b.width*.5,0,0),_.halfHeight.set(0,b.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(b.isPointLight){const _=n.point[f];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),f++}else if(b.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(b.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function wh(s){const e=new wy(s),t=[],n=[];function i(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Ey(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new wh(s),e.set(i,[o])):r>=a.length?(o=new wh(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Ty=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ay=`uniform sampler2D shadow_pass;
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
}`;function Ry(s,e,t){let n=new Tc;const i=new Oe,r=new Oe,a=new et,o=new Sg({depthPacking:mm}),l=new wg,c={},u=t.maxTextureSize,h={[ii]:rn,[rn]:ii,[Yt]:Yt},f=new si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Oe},radius:{value:4}},vertexShader:Ty,fragmentShader:Ay}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const m=new At;m.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ke(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sf;let p=this.type;this.render=function(T,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const x=s.getRenderTarget(),S=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),F=s.state;F.setBlending(yi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Jn&&this.type===Jn,V=p===Jn&&this.type!==Jn;for(let W=0,j=T.length;W<j;W++){const K=T[W],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const ae=H.getFrameExtents();if(i.multiply(ae),r.copy(H.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/ae.x),i.x=r.x*ae.x,H.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/ae.y),i.y=r.y*ae.y,H.mapSize.y=r.y)),H.map===null||z===!0||V===!0){const Te=this.type!==Jn?{minFilter:Zt,magFilter:Zt}:{};H.map!==null&&H.map.dispose(),H.map=new Wi(i.x,i.y,Te),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const ue=H.getViewportCount();for(let Te=0;Te<ue;Te++){const $e=H.getViewport(Te);a.set(r.x*$e.x,r.y*$e.y,r.x*$e.z,r.y*$e.w),F.viewport(a),H.updateMatrices(K,Te),n=H.getFrustum(),_(A,R,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===Jn&&y(H,R),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(x,S,P)};function y(T,A){const R=e.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wi(i.x,i.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(A,null,R,f,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(A,null,R,d,v,null)}function b(T,A,R,x){let S=null;const P=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)S=P;else if(S=R.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=S.uuid,z=A.uuid;let V=c[F];V===void 0&&(V={},c[F]=V);let W=V[z];W===void 0&&(W=S.clone(),V[z]=W,A.addEventListener("dispose",E)),S=W}if(S.visible=A.visible,S.wireframe=A.wireframe,x===Jn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=s.properties.get(S);F.light=R}return S}function _(T,A,R,x,S){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Jn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const z=e.update(T),V=T.material;if(Array.isArray(V)){const W=z.groups;for(let j=0,K=W.length;j<K;j++){const H=W[j],ae=V[H.materialIndex];if(ae&&ae.visible){const ue=b(T,ae,x,S);T.onBeforeShadow(s,T,A,R,z,ue,H),s.renderBufferDirect(R,null,z,ue,T,H),T.onAfterShadow(s,T,A,R,z,ue,H)}}}else if(V.visible){const W=b(T,V,x,S);T.onBeforeShadow(s,T,A,R,z,W,null),s.renderBufferDirect(R,null,z,W,T,null),T.onAfterShadow(s,T,A,R,z,W,null)}}const F=T.children;for(let z=0,V=F.length;z<V;z++)_(F[z],A,R,x,S)}function E(T){T.target.removeEventListener("dispose",E);for(const R in c){const x=c[R],S=T.target.uuid;S in x&&(x[S].dispose(),delete x[S])}}}const Cy={[Jo]:Qo,[el]:il,[tl]:sl,[Es]:nl,[Qo]:Jo,[il]:el,[sl]:tl,[nl]:Es};function Iy(s,e){function t(){let D=!1;const ne=new et;let se=null;const de=new et(0,0,0,0);return{setMask:function(J){se!==J&&!D&&(s.colorMask(J,J,J,J),se=J)},setLocked:function(J){D=J},setClear:function(J,Y,ge,ze,gt){gt===!0&&(J*=ze,Y*=ze,ge*=ze),ne.set(J,Y,ge,ze),de.equals(ne)===!1&&(s.clearColor(J,Y,ge,ze),de.copy(ne))},reset:function(){D=!1,se=null,de.set(-1,0,0,0)}}}function n(){let D=!1,ne=!1,se=null,de=null,J=null;return{setReversed:function(Y){if(ne!==Y){const ge=e.get("EXT_clip_control");Y?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),ne=Y;const ze=J;J=null,this.setClear(ze)}},getReversed:function(){return ne},setTest:function(Y){Y?Z(s.DEPTH_TEST):pe(s.DEPTH_TEST)},setMask:function(Y){se!==Y&&!D&&(s.depthMask(Y),se=Y)},setFunc:function(Y){if(ne&&(Y=Cy[Y]),de!==Y){switch(Y){case Jo:s.depthFunc(s.NEVER);break;case Qo:s.depthFunc(s.ALWAYS);break;case el:s.depthFunc(s.LESS);break;case Es:s.depthFunc(s.LEQUAL);break;case tl:s.depthFunc(s.EQUAL);break;case nl:s.depthFunc(s.GEQUAL);break;case il:s.depthFunc(s.GREATER);break;case sl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}de=Y}},setLocked:function(Y){D=Y},setClear:function(Y){J!==Y&&(ne&&(Y=1-Y),s.clearDepth(Y),J=Y)},reset:function(){D=!1,se=null,de=null,J=null,ne=!1}}}function i(){let D=!1,ne=null,se=null,de=null,J=null,Y=null,ge=null,ze=null,gt=null;return{setTest:function(ot){D||(ot?Z(s.STENCIL_TEST):pe(s.STENCIL_TEST))},setMask:function(ot){ne!==ot&&!D&&(s.stencilMask(ot),ne=ot)},setFunc:function(ot,Xn,Dn){(se!==ot||de!==Xn||J!==Dn)&&(s.stencilFunc(ot,Xn,Dn),se=ot,de=Xn,J=Dn)},setOp:function(ot,Xn,Dn){(Y!==ot||ge!==Xn||ze!==Dn)&&(s.stencilOp(ot,Xn,Dn),Y=ot,ge=Xn,ze=Dn)},setLocked:function(ot){D=ot},setClear:function(ot){gt!==ot&&(s.clearStencil(ot),gt=ot)},reset:function(){D=!1,ne=null,se=null,de=null,J=null,Y=null,ge=null,ze=null,gt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,y=null,b=null,_=null,E=null,T=null,A=new fe(0,0,0),R=0,x=!1,S=null,P=null,F=null,z=null,V=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,K=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),j=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),j=K>=2);let ae=null,ue={};const Te=s.getParameter(s.SCISSOR_BOX),$e=s.getParameter(s.VIEWPORT),mt=new et().fromArray(Te),bt=new et().fromArray($e);function at(D,ne,se,de){const J=new Uint8Array(4),Y=s.createTexture();s.bindTexture(D,Y),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ge=0;ge<se;ge++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(ne,0,s.RGBA,1,1,de,0,s.RGBA,s.UNSIGNED_BYTE,J):s.texImage2D(ne+ge,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,J);return Y}const $={};$[s.TEXTURE_2D]=at(s.TEXTURE_2D,s.TEXTURE_2D,1),$[s.TEXTURE_CUBE_MAP]=at(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[s.TEXTURE_2D_ARRAY]=at(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),$[s.TEXTURE_3D]=at(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(s.DEPTH_TEST),a.setFunc(Es),Ne(!1),ve(ou),Z(s.CULL_FACE),Mt(yi);function Z(D){u[D]!==!0&&(s.enable(D),u[D]=!0)}function pe(D){u[D]!==!1&&(s.disable(D),u[D]=!1)}function ke(D,ne){return h[D]!==ne?(s.bindFramebuffer(D,ne),h[D]=ne,D===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=ne),D===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=ne),!0):!1}function we(D,ne){let se=d,de=!1;if(D){se=f.get(ne),se===void 0&&(se=[],f.set(ne,se));const J=D.textures;if(se.length!==J.length||se[0]!==s.COLOR_ATTACHMENT0){for(let Y=0,ge=J.length;Y<ge;Y++)se[Y]=s.COLOR_ATTACHMENT0+Y;se.length=J.length,de=!0}}else se[0]!==s.BACK&&(se[0]=s.BACK,de=!0);de&&s.drawBuffers(se)}function Je(D){return m!==D?(s.useProgram(D),m=D,!0):!1}const zt={[ki]:s.FUNC_ADD,[kp]:s.FUNC_SUBTRACT,[Op]:s.FUNC_REVERSE_SUBTRACT};zt[zp]=s.MIN,zt[Bp]=s.MAX;const L={[Hp]:s.ZERO,[Vp]:s.ONE,[Gp]:s.SRC_COLOR,[Ko]:s.SRC_ALPHA,[qp]:s.SRC_ALPHA_SATURATE,[$p]:s.DST_COLOR,[Xp]:s.DST_ALPHA,[Wp]:s.ONE_MINUS_SRC_COLOR,[Zo]:s.ONE_MINUS_SRC_ALPHA,[Yp]:s.ONE_MINUS_DST_COLOR,[jp]:s.ONE_MINUS_DST_ALPHA,[Kp]:s.CONSTANT_COLOR,[Zp]:s.ONE_MINUS_CONSTANT_COLOR,[Jp]:s.CONSTANT_ALPHA,[Qp]:s.ONE_MINUS_CONSTANT_ALPHA};function Mt(D,ne,se,de,J,Y,ge,ze,gt,ot){if(D===yi){v===!0&&(pe(s.BLEND),v=!1);return}if(v===!1&&(Z(s.BLEND),v=!0),D!==Fp){if(D!==g||ot!==x){if((p!==ki||_!==ki)&&(s.blendEquation(s.FUNC_ADD),p=ki,_=ki),ot)switch(D){case xs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case lu:s.blendFunc(s.ONE,s.ONE);break;case cu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case uu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case xs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case lu:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case cu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case uu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}y=null,b=null,E=null,T=null,A.set(0,0,0),R=0,g=D,x=ot}return}J=J||ne,Y=Y||se,ge=ge||de,(ne!==p||J!==_)&&(s.blendEquationSeparate(zt[ne],zt[J]),p=ne,_=J),(se!==y||de!==b||Y!==E||ge!==T)&&(s.blendFuncSeparate(L[se],L[de],L[Y],L[ge]),y=se,b=de,E=Y,T=ge),(ze.equals(A)===!1||gt!==R)&&(s.blendColor(ze.r,ze.g,ze.b,gt),A.copy(ze),R=gt),g=D,x=!1}function Be(D,ne){D.side===Yt?pe(s.CULL_FACE):Z(s.CULL_FACE);let se=D.side===rn;ne&&(se=!se),Ne(se),D.blending===xs&&D.transparent===!1?Mt(yi):Mt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const de=D.stencilWrite;o.setTest(de),de&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),_e(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Z(s.SAMPLE_ALPHA_TO_COVERAGE):pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(D){S!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),S=D)}function ve(D){D!==Np?(Z(s.CULL_FACE),D!==P&&(D===ou?s.cullFace(s.BACK):D===Up?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):pe(s.CULL_FACE),P=D}function St(D){D!==F&&(j&&s.lineWidth(D),F=D)}function _e(D,ne,se){D?(Z(s.POLYGON_OFFSET_FILL),(z!==ne||V!==se)&&(s.polygonOffset(ne,se),z=ne,V=se)):pe(s.POLYGON_OFFSET_FILL)}function We(D){D?Z(s.SCISSOR_TEST):pe(s.SCISSOR_TEST)}function Dt(D){D===void 0&&(D=s.TEXTURE0+W-1),ae!==D&&(s.activeTexture(D),ae=D)}function Rt(D,ne,se){se===void 0&&(ae===null?se=s.TEXTURE0+W-1:se=ae);let de=ue[se];de===void 0&&(de={type:void 0,texture:void 0},ue[se]=de),(de.type!==D||de.texture!==ne)&&(ae!==se&&(s.activeTexture(se),ae=se),s.bindTexture(D,ne||$[D]),de.type=D,de.texture=ne)}function C(){const D=ue[ae];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function M(){try{s.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function k(){try{s.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{s.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{s.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{s.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{s.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{s.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{s.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{s.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(D){mt.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),mt.copy(D))}function De(D){bt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),bt.copy(D))}function be(D,ne){let se=c.get(ne);se===void 0&&(se=new WeakMap,c.set(ne,se));let de=se.get(D);de===void 0&&(de=s.getUniformBlockIndex(ne,D.name),se.set(D,de))}function oe(D,ne){const de=c.get(ne).get(D);l.get(ne)!==de&&(s.uniformBlockBinding(ne,de,D.__bindingPointIndex),l.set(ne,de))}function He(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},ae=null,ue={},h={},f=new WeakMap,d=[],m=null,v=!1,g=null,p=null,y=null,b=null,_=null,E=null,T=null,A=new fe(0,0,0),R=0,x=!1,S=null,P=null,F=null,z=null,V=null,mt.set(0,0,s.canvas.width,s.canvas.height),bt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Z,disable:pe,bindFramebuffer:ke,drawBuffers:we,useProgram:Je,setBlending:Mt,setMaterial:Be,setFlipSided:Ne,setCullFace:ve,setLineWidth:St,setPolygonOffset:_e,setScissorTest:We,activeTexture:Dt,bindTexture:Rt,unbindTexture:C,compressedTexImage2D:M,compressedTexImage3D:k,texImage2D:ye,texImage3D:te,updateUBOMapping:be,uniformBlockBinding:oe,texStorage2D:ie,texStorage3D:xe,texSubImage2D:X,texSubImage3D:q,compressedTexSubImage2D:G,compressedTexSubImage3D:Se,scissor:ce,viewport:De,reset:He}}function Py(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Oe,u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,M){return d?new OffscreenCanvas(C,M):_r("canvas")}function v(C,M,k){let X=1;const q=Rt(C);if((q.width>k||q.height>k)&&(X=k/Math.max(q.width,q.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const G=Math.floor(X*q.width),Se=Math.floor(X*q.height);h===void 0&&(h=m(G,Se));const ie=M?m(G,Se):h;return ie.width=G,ie.height=Se,ie.getContext("2d").drawImage(C,0,0,G,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+G+"x"+Se+")."),ie}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){s.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(C,M,k,X,q=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let G=M;if(M===s.RED&&(k===s.FLOAT&&(G=s.R32F),k===s.HALF_FLOAT&&(G=s.R16F),k===s.UNSIGNED_BYTE&&(G=s.R8)),M===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.R8UI),k===s.UNSIGNED_SHORT&&(G=s.R16UI),k===s.UNSIGNED_INT&&(G=s.R32UI),k===s.BYTE&&(G=s.R8I),k===s.SHORT&&(G=s.R16I),k===s.INT&&(G=s.R32I)),M===s.RG&&(k===s.FLOAT&&(G=s.RG32F),k===s.HALF_FLOAT&&(G=s.RG16F),k===s.UNSIGNED_BYTE&&(G=s.RG8)),M===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RG8UI),k===s.UNSIGNED_SHORT&&(G=s.RG16UI),k===s.UNSIGNED_INT&&(G=s.RG32UI),k===s.BYTE&&(G=s.RG8I),k===s.SHORT&&(G=s.RG16I),k===s.INT&&(G=s.RG32I)),M===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGB8UI),k===s.UNSIGNED_SHORT&&(G=s.RGB16UI),k===s.UNSIGNED_INT&&(G=s.RGB32UI),k===s.BYTE&&(G=s.RGB8I),k===s.SHORT&&(G=s.RGB16I),k===s.INT&&(G=s.RGB32I)),M===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),k===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),k===s.UNSIGNED_INT&&(G=s.RGBA32UI),k===s.BYTE&&(G=s.RGBA8I),k===s.SHORT&&(G=s.RGBA16I),k===s.INT&&(G=s.RGBA32I)),M===s.RGB&&(k===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),k===s.UNSIGNED_INT_10F_11F_11F_REV&&(G=s.R11F_G11F_B10F)),M===s.RGBA){const Se=q?Ra:Qe.getTransfer(X);k===s.FLOAT&&(G=s.RGBA32F),k===s.HALF_FLOAT&&(G=s.RGBA16F),k===s.UNSIGNED_BYTE&&(G=Se===ht?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function _(C,M){let k;return C?M===null||M===Gi||M===dr?k=s.DEPTH24_STENCIL8:M===En?k=s.DEPTH32F_STENCIL8:M===fr&&(k=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Gi||M===dr?k=s.DEPTH_COMPONENT24:M===En?k=s.DEPTH_COMPONENT32F:M===fr&&(k=s.DEPTH_COMPONENT16),k}function E(C,M){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Zt&&C.minFilter!==Kt?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function T(C){const M=C.target;M.removeEventListener("dispose",T),R(M),M.isVideoTexture&&u.delete(M)}function A(C){const M=C.target;M.removeEventListener("dispose",A),S(M)}function R(C){const M=n.get(C);if(M.__webglInit===void 0)return;const k=C.source,X=f.get(k);if(X){const q=X[M.__cacheKey];q.usedTimes--,q.usedTimes===0&&x(C),Object.keys(X).length===0&&f.delete(k)}n.remove(C)}function x(C){const M=n.get(C);s.deleteTexture(M.__webglTexture);const k=C.source,X=f.get(k);delete X[M.__cacheKey],a.memory.textures--}function S(C){const M=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(M.__webglFramebuffer[X]))for(let q=0;q<M.__webglFramebuffer[X].length;q++)s.deleteFramebuffer(M.__webglFramebuffer[X][q]);else s.deleteFramebuffer(M.__webglFramebuffer[X]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[X])}else{if(Array.isArray(M.__webglFramebuffer))for(let X=0;X<M.__webglFramebuffer.length;X++)s.deleteFramebuffer(M.__webglFramebuffer[X]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let X=0;X<M.__webglColorRenderbuffer.length;X++)M.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[X]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const k=C.textures;for(let X=0,q=k.length;X<q;X++){const G=n.get(k[X]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(k[X])}n.remove(C)}let P=0;function F(){P=0}function z(){const C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function V(C){const M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function W(C,M){const k=n.get(C);if(C.isVideoTexture&&We(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){const X=C.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(k,C,M);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+M)}function j(C,M){const k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){$(k,C,M);return}t.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+M)}function K(C,M){const k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){$(k,C,M);return}t.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+M)}function H(C,M){const k=n.get(C);if(C.version>0&&k.__version!==C.version){Z(k,C,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+M)}const ae={[Vi]:s.REPEAT,[xi]:s.CLAMP_TO_EDGE,[Ta]:s.MIRRORED_REPEAT},ue={[Zt]:s.NEAREST,[Tf]:s.NEAREST_MIPMAP_NEAREST,[Qs]:s.NEAREST_MIPMAP_LINEAR,[Kt]:s.LINEAR,[ha]:s.LINEAR_MIPMAP_NEAREST,[kn]:s.LINEAR_MIPMAP_LINEAR},Te={[vm]:s.NEVER,[Sm]:s.ALWAYS,[_m]:s.LESS,[Uf]:s.LEQUAL,[xm]:s.EQUAL,[Mm]:s.GEQUAL,[ym]:s.GREATER,[bm]:s.NOTEQUAL};function $e(C,M){if(M.type===En&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Kt||M.magFilter===ha||M.magFilter===Qs||M.magFilter===kn||M.minFilter===Kt||M.minFilter===ha||M.minFilter===Qs||M.minFilter===kn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,ae[M.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,ae[M.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,ae[M.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,ue[M.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,ue[M.minFilter]),M.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,Te[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Zt||M.minFilter!==Qs&&M.minFilter!==kn||M.type===En&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function mt(C,M){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",T));const X=M.source;let q=f.get(X);q===void 0&&(q={},f.set(X,q));const G=V(M);if(G!==C.__cacheKey){q[G]===void 0&&(q[G]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,k=!0),q[G].usedTimes++;const Se=q[C.__cacheKey];Se!==void 0&&(q[C.__cacheKey].usedTimes--,Se.usedTimes===0&&x(M)),C.__cacheKey=G,C.__webglTexture=q[G].texture}return k}function bt(C,M,k){return Math.floor(Math.floor(C/k)/M)}function at(C,M,k,X){const G=C.updateRanges;if(G.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,k,X,M.data);else{G.sort((te,ce)=>te.start-ce.start);let Se=0;for(let te=1;te<G.length;te++){const ce=G[Se],De=G[te],be=ce.start+ce.count,oe=bt(De.start,M.width,4),He=bt(ce.start,M.width,4);De.start<=be+1&&oe===He&&bt(De.start+De.count-1,M.width,4)===oe?ce.count=Math.max(ce.count,De.start+De.count-ce.start):(++Se,G[Se]=De)}G.length=Se+1;const ie=s.getParameter(s.UNPACK_ROW_LENGTH),xe=s.getParameter(s.UNPACK_SKIP_PIXELS),ye=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let te=0,ce=G.length;te<ce;te++){const De=G[te],be=Math.floor(De.start/4),oe=Math.ceil(De.count/4),He=be%M.width,D=Math.floor(be/M.width),ne=oe,se=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,He),s.pixelStorei(s.UNPACK_SKIP_ROWS,D),t.texSubImage2D(s.TEXTURE_2D,0,He,D,ne,se,k,X,M.data)}C.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ie),s.pixelStorei(s.UNPACK_SKIP_PIXELS,xe),s.pixelStorei(s.UNPACK_SKIP_ROWS,ye)}}function $(C,M,k){let X=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(X=s.TEXTURE_3D);const q=mt(C,M),G=M.source;t.bindTexture(X,C.__webglTexture,s.TEXTURE0+k);const Se=n.get(G);if(G.version!==Se.__version||q===!0){t.activeTexture(s.TEXTURE0+k);const ie=Qe.getPrimaries(Qe.workingColorSpace),xe=M.colorSpace===_i?null:Qe.getPrimaries(M.colorSpace),ye=M.colorSpace===_i||ie===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let te=v(M.image,!1,i.maxTextureSize);te=Dt(M,te);const ce=r.convert(M.format,M.colorSpace),De=r.convert(M.type);let be=b(M.internalFormat,ce,De,M.colorSpace,M.isVideoTexture);$e(X,M);let oe;const He=M.mipmaps,D=M.isVideoTexture!==!0,ne=Se.__version===void 0||q===!0,se=G.dataReady,de=E(M,te);if(M.isDepthTexture)be=_(M.format===mr,M.type),ne&&(D?t.texStorage2D(s.TEXTURE_2D,1,be,te.width,te.height):t.texImage2D(s.TEXTURE_2D,0,be,te.width,te.height,0,ce,De,null));else if(M.isDataTexture)if(He.length>0){D&&ne&&t.texStorage2D(s.TEXTURE_2D,de,be,He[0].width,He[0].height);for(let J=0,Y=He.length;J<Y;J++)oe=He[J],D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,De,oe.data):t.texImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,ce,De,oe.data);M.generateMipmaps=!1}else D?(ne&&t.texStorage2D(s.TEXTURE_2D,de,be,te.width,te.height),se&&at(M,te,ce,De)):t.texImage2D(s.TEXTURE_2D,0,be,te.width,te.height,0,ce,De,te.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){D&&ne&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,be,He[0].width,He[0].height,te.depth);for(let J=0,Y=He.length;J<Y;J++)if(oe=He[J],M.format!==sn)if(ce!==null)if(D){if(se)if(M.layerUpdates.size>0){const ge=eh(oe.width,oe.height,M.format,M.type);for(const ze of M.layerUpdates){const gt=oe.data.subarray(ze*ge/oe.data.BYTES_PER_ELEMENT,(ze+1)*ge/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,ze,oe.width,oe.height,1,ce,gt)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,oe.width,oe.height,te.depth,ce,oe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,be,oe.width,oe.height,te.depth,0,oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?se&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,oe.width,oe.height,te.depth,ce,De,oe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,J,be,oe.width,oe.height,te.depth,0,ce,De,oe.data)}else{D&&ne&&t.texStorage2D(s.TEXTURE_2D,de,be,He[0].width,He[0].height);for(let J=0,Y=He.length;J<Y;J++)oe=He[J],M.format!==sn?ce!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,oe.data):t.compressedTexImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,oe.width,oe.height,ce,De,oe.data):t.texImage2D(s.TEXTURE_2D,J,be,oe.width,oe.height,0,ce,De,oe.data)}else if(M.isDataArrayTexture)if(D){if(ne&&t.texStorage3D(s.TEXTURE_2D_ARRAY,de,be,te.width,te.height,te.depth),se)if(M.layerUpdates.size>0){const J=eh(te.width,te.height,M.format,M.type);for(const Y of M.layerUpdates){const ge=te.data.subarray(Y*J/te.data.BYTES_PER_ELEMENT,(Y+1)*J/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Y,te.width,te.height,1,ce,De,ge)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ce,De,te.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,be,te.width,te.height,te.depth,0,ce,De,te.data);else if(M.isData3DTexture)D?(ne&&t.texStorage3D(s.TEXTURE_3D,de,be,te.width,te.height,te.depth),se&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ce,De,te.data)):t.texImage3D(s.TEXTURE_3D,0,be,te.width,te.height,te.depth,0,ce,De,te.data);else if(M.isFramebufferTexture){if(ne)if(D)t.texStorage2D(s.TEXTURE_2D,de,be,te.width,te.height);else{let J=te.width,Y=te.height;for(let ge=0;ge<de;ge++)t.texImage2D(s.TEXTURE_2D,ge,be,J,Y,0,ce,De,null),J>>=1,Y>>=1}}else if(He.length>0){if(D&&ne){const J=Rt(He[0]);t.texStorage2D(s.TEXTURE_2D,de,be,J.width,J.height)}for(let J=0,Y=He.length;J<Y;J++)oe=He[J],D?se&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,ce,De,oe):t.texImage2D(s.TEXTURE_2D,J,be,ce,De,oe);M.generateMipmaps=!1}else if(D){if(ne){const J=Rt(te);t.texStorage2D(s.TEXTURE_2D,de,be,J.width,J.height)}se&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ce,De,te)}else t.texImage2D(s.TEXTURE_2D,0,be,ce,De,te);g(M)&&p(X),Se.__version=G.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function Z(C,M,k){if(M.image.length!==6)return;const X=mt(C,M),q=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+k);const G=n.get(q);if(q.version!==G.__version||X===!0){t.activeTexture(s.TEXTURE0+k);const Se=Qe.getPrimaries(Qe.workingColorSpace),ie=M.colorSpace===_i?null:Qe.getPrimaries(M.colorSpace),xe=M.colorSpace===_i||Se===ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const ye=M.isCompressedTexture||M.image[0].isCompressedTexture,te=M.image[0]&&M.image[0].isDataTexture,ce=[];for(let Y=0;Y<6;Y++)!ye&&!te?ce[Y]=v(M.image[Y],!0,i.maxCubemapSize):ce[Y]=te?M.image[Y].image:M.image[Y],ce[Y]=Dt(M,ce[Y]);const De=ce[0],be=r.convert(M.format,M.colorSpace),oe=r.convert(M.type),He=b(M.internalFormat,be,oe,M.colorSpace),D=M.isVideoTexture!==!0,ne=G.__version===void 0||X===!0,se=q.dataReady;let de=E(M,De);$e(s.TEXTURE_CUBE_MAP,M);let J;if(ye){D&&ne&&t.texStorage2D(s.TEXTURE_CUBE_MAP,de,He,De.width,De.height);for(let Y=0;Y<6;Y++){J=ce[Y].mipmaps;for(let ge=0;ge<J.length;ge++){const ze=J[ge];M.format!==sn?be!==null?D?se&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,ze.width,ze.height,be,ze.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,He,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,0,0,ze.width,ze.height,be,oe,ze.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge,He,ze.width,ze.height,0,be,oe,ze.data)}}}else{if(J=M.mipmaps,D&&ne){J.length>0&&de++;const Y=Rt(ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,de,He,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(te){D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ce[Y].width,ce[Y].height,be,oe,ce[Y].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,He,ce[Y].width,ce[Y].height,0,be,oe,ce[Y].data);for(let ge=0;ge<J.length;ge++){const gt=J[ge].image[Y].image;D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,gt.width,gt.height,be,oe,gt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,He,gt.width,gt.height,0,be,oe,gt.data)}}else{D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,be,oe,ce[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,He,be,oe,ce[Y]);for(let ge=0;ge<J.length;ge++){const ze=J[ge];D?se&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,0,0,be,oe,ze.image[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ge+1,He,be,oe,ze.image[Y])}}}g(M)&&p(s.TEXTURE_CUBE_MAP),G.__version=q.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function pe(C,M,k,X,q,G){const Se=r.convert(k.format,k.colorSpace),ie=r.convert(k.type),xe=b(k.internalFormat,Se,ie,k.colorSpace),ye=n.get(M),te=n.get(k);if(te.__renderTarget=M,!ye.__hasExternalTextures){const ce=Math.max(1,M.width>>G),De=Math.max(1,M.height>>G);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?t.texImage3D(q,G,xe,ce,De,M.depth,0,Se,ie,null):t.texImage2D(q,G,xe,ce,De,0,Se,ie,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,q,te.__webglTexture,0,St(M)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,q,te.__webglTexture,G),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ke(C,M,k){if(s.bindRenderbuffer(s.RENDERBUFFER,C),M.depthBuffer){const X=M.depthTexture,q=X&&X.isDepthTexture?X.type:null,G=_(M.stencilBuffer,q),Se=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ie=St(M);_e(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ie,G,M.width,M.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,ie,G,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,G,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,C)}else{const X=M.textures;for(let q=0;q<X.length;q++){const G=X[q],Se=r.convert(G.format,G.colorSpace),ie=r.convert(G.type),xe=b(G.internalFormat,Se,ie,G.colorSpace),ye=St(M);k&&_e(M)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ye,xe,M.width,M.height):_e(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ye,xe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,xe,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function we(C,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(M.depthTexture);X.__renderTarget=M,(!X.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W(M.depthTexture,0);const q=X.__webglTexture,G=St(M);if(M.depthTexture.format===pr)_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0);else if(M.depthTexture.format===mr)_e(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Je(C){const M=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){const X=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),X){const q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,X.removeEventListener("dispose",q)};X.addEventListener("dispose",q),M.__depthDisposeCallback=q}M.__boundDepthTexture=X}if(C.depthTexture&&!M.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");const X=C.texture.mipmaps;X&&X.length>0?we(M.__webglFramebuffer[0],C):we(M.__webglFramebuffer,C)}else if(k){M.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[X]),M.__webglDepthbuffer[X]===void 0)M.__webglDepthbuffer[X]=s.createRenderbuffer(),ke(M.__webglDepthbuffer[X],C,!1);else{const q=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=M.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,G)}}else{const X=C.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),ke(M.__webglDepthbuffer,C,!1);else{const q=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,G)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function zt(C,M,k){const X=n.get(C);M!==void 0&&pe(X.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&Je(C)}function L(C){const M=C.texture,k=n.get(C),X=n.get(M);C.addEventListener("dispose",A);const q=C.textures,G=C.isWebGLCubeRenderTarget===!0,Se=q.length>1;if(Se||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=M.version,a.memory.textures++),G){k.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer[ie]=[];for(let xe=0;xe<M.mipmaps.length;xe++)k.__webglFramebuffer[ie][xe]=s.createFramebuffer()}else k.__webglFramebuffer[ie]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){k.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)k.__webglFramebuffer[ie]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(Se)for(let ie=0,xe=q.length;ie<xe;ie++){const ye=n.get(q[ie]);ye.__webglTexture===void 0&&(ye.__webglTexture=s.createTexture(),a.memory.textures++)}if(C.samples>0&&_e(C)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ie=0;ie<q.length;ie++){const xe=q[ie];k.__webglColorRenderbuffer[ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[ie]);const ye=r.convert(xe.format,xe.colorSpace),te=r.convert(xe.type),ce=b(xe.internalFormat,ye,te,xe.colorSpace,C.isXRRenderTarget===!0),De=St(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,De,ce,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ie,s.RENDERBUFFER,k.__webglColorRenderbuffer[ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),ke(k.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),$e(s.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let xe=0;xe<M.mipmaps.length;xe++)pe(k.__webglFramebuffer[ie][xe],C,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else pe(k.__webglFramebuffer[ie],C,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);g(M)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let ie=0,xe=q.length;ie<xe;ie++){const ye=q[ie],te=n.get(ye);let ce=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ce=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,te.__webglTexture),$e(ce,ye),pe(k.__webglFramebuffer,C,ye,s.COLOR_ATTACHMENT0+ie,ce,0),g(ye)&&p(ce)}t.unbindTexture()}else{let ie=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ie,X.__webglTexture),$e(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let xe=0;xe<M.mipmaps.length;xe++)pe(k.__webglFramebuffer[xe],C,M,s.COLOR_ATTACHMENT0,ie,xe);else pe(k.__webglFramebuffer,C,M,s.COLOR_ATTACHMENT0,ie,0);g(M)&&p(ie),t.unbindTexture()}C.depthBuffer&&Je(C)}function Mt(C){const M=C.textures;for(let k=0,X=M.length;k<X;k++){const q=M[k];if(g(q)){const G=y(C),Se=n.get(q).__webglTexture;t.bindTexture(G,Se),p(G),t.unbindTexture()}}}const Be=[],Ne=[];function ve(C){if(C.samples>0){if(_e(C)===!1){const M=C.textures,k=C.width,X=C.height;let q=s.COLOR_BUFFER_BIT;const G=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=n.get(C),ie=M.length>1;if(ie)for(let ye=0;ye<M.length;ye++)t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer);const xe=C.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ye=0;ye<M.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);const te=n.get(M[ye]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,te,0)}s.blitFramebuffer(0,0,k,X,0,0,k,X,q,s.NEAREST),l===!0&&(Be.length=0,Ne.length=0,Be.push(s.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Be.push(G),Ne.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ne)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ie)for(let ye=0;ye<M.length;ye++){t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);const te=n.get(M[ye]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ye,s.TEXTURE_2D,te,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const M=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function St(C){return Math.min(i.maxSamples,C.samples)}function _e(C){const M=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function We(C){const M=a.render.frame;u.get(C)!==M&&(u.set(C,M),C.update())}function Dt(C,M){const k=C.colorSpace,X=C.format,q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==Jt&&k!==_i&&(Qe.getTransfer(k)===ht?(X!==sn||q!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),M}function Rt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=j,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=zt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=Je,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=_e}function Ly(s,e){function t(n,i=_i){let r;const a=Qe.getTransfer(i);if(n===Bn)return s.UNSIGNED_BYTE;if(n===fc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===dc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Cf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===If)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Af)return s.BYTE;if(n===Rf)return s.SHORT;if(n===fr)return s.UNSIGNED_SHORT;if(n===hc)return s.INT;if(n===Gi)return s.UNSIGNED_INT;if(n===En)return s.FLOAT;if(n===br)return s.HALF_FLOAT;if(n===Pf)return s.ALPHA;if(n===Lf)return s.RGB;if(n===sn)return s.RGBA;if(n===pr)return s.DEPTH_COMPONENT;if(n===mr)return s.DEPTH_STENCIL;if(n===pc)return s.RED;if(n===mc)return s.RED_INTEGER;if(n===Df)return s.RG;if(n===gc)return s.RG_INTEGER;if(n===vc)return s.RGBA_INTEGER;if(n===fa||n===da||n===pa||n===ma)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ll||n===cl||n===ul||n===hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ll)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===cl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ul)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fl||n===dl||n===pl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fl||n===dl)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===pl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ml||n===gl||n===vl||n===_l||n===xl||n===yl||n===bl||n===Ml||n===Sl||n===wl||n===El||n===Tl||n===Al||n===Rl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ml)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===gl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_l)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===bl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ml)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Sl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===El)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Tl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Al)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Rl)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Cl||n===Il||n===Pl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Cl)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Il)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ll||n===Dl||n===Nl||n===Ul)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ll)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Dl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Nl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Dy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ny=`
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

}`;class Uy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Yf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new si({vertexShader:Dy,fragmentShader:Ny,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ke(new Xi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fy extends qi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,d=null,m=null;const v=typeof XRWebGLBinding<"u",g=new Uy,p={},y=t.getContextAttributes();let b=null,_=null;const E=[],T=[],A=new Oe;let R=null;const x=new nn;x.viewport=new et;const S=new nn;S.viewport=new et;const P=[x,S],F=new Gg;let z=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=E[$];return Z===void 0&&(Z=new Eo,E[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=E[$];return Z===void 0&&(Z=new Eo,E[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=E[$];return Z===void 0&&(Z=new Eo,E[$]=Z),Z.getHandSpace()};function W($){const Z=T.indexOf($.inputSource);if(Z===-1)return;const pe=E[Z];pe!==void 0&&(pe.update($.inputSource,$.frame,c||a),pe.dispatchEvent({type:$.type,data:$.inputSource}))}function j(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",j),i.removeEventListener("inputsourceschange",K);for(let $=0;$<E.length;$++){const Z=T[$];Z!==null&&(T[$]=null,E[$].disconnect(Z))}z=null,V=null,g.reset();for(const $ in p)delete p[$];e.setRenderTarget(b),d=null,f=null,h=null,i=null,_=null,at.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(i,t)),h},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",j),i.addEventListener("inputsourceschange",K),y.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,ke=null,we=null;y.depth&&(we=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=y.stencil?mr:pr,ke=y.stencil?dr:Gi);const Je={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(Je),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Wi(f.textureWidth,f.textureHeight,{format:sn,type:Bn,depthTexture:new $f(f.textureWidth,f.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,pe),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new Wi(d.framebufferWidth,d.framebufferHeight,{format:sn,type:Bn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),at.setContext(i),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K($){for(let Z=0;Z<$.removed.length;Z++){const pe=$.removed[Z],ke=T.indexOf(pe);ke>=0&&(T[ke]=null,E[ke].disconnect(pe))}for(let Z=0;Z<$.added.length;Z++){const pe=$.added[Z];let ke=T.indexOf(pe);if(ke===-1){for(let Je=0;Je<E.length;Je++)if(Je>=T.length){T.push(pe),ke=Je;break}else if(T[Je]===null){T[Je]=pe,ke=Je;break}if(ke===-1)break}const we=E[ke];we&&we.connect(pe)}}const H=new I,ae=new I;function ue($,Z,pe){H.setFromMatrixPosition(Z.matrixWorld),ae.setFromMatrixPosition(pe.matrixWorld);const ke=H.distanceTo(ae),we=Z.projectionMatrix.elements,Je=pe.projectionMatrix.elements,zt=we[14]/(we[10]-1),L=we[14]/(we[10]+1),Mt=(we[9]+1)/we[5],Be=(we[9]-1)/we[5],Ne=(we[8]-1)/we[0],ve=(Je[8]+1)/Je[0],St=zt*Ne,_e=zt*ve,We=ke/(-Ne+ve),Dt=We*-Ne;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Dt),$.translateZ(We),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),we[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Rt=zt+We,C=L+We,M=St-Dt,k=_e+(ke-Dt),X=Mt*L/C*Rt,q=Be*L/C*Rt;$.projectionMatrix.makePerspective(M,k,X,q,Rt,C),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Te($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let Z=$.near,pe=$.far;g.texture!==null&&(g.depthNear>0&&(Z=g.depthNear),g.depthFar>0&&(pe=g.depthFar)),F.near=S.near=x.near=Z,F.far=S.far=x.far=pe,(z!==F.near||V!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,V=F.far),F.layers.mask=$.layers.mask|6,x.layers.mask=F.layers.mask&3,S.layers.mask=F.layers.mask&5;const ke=$.parent,we=F.cameras;Te(F,ke);for(let Je=0;Je<we.length;Je++)Te(we[Je],ke);we.length===2?ue(F,x,S):F.projectionMatrix.copy(x.projectionMatrix),$e($,F,ke)};function $e($,Z,pe){pe===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Rs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function($){return p[$]};let mt=null;function bt($,Z){if(u=Z.getViewerPose(c||a),m=Z,u!==null){const pe=u.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let ke=!1;pe.length!==F.cameras.length&&(F.cameras.length=0,ke=!0);for(let L=0;L<pe.length;L++){const Mt=pe[L];let Be=null;if(d!==null)Be=d.getViewport(Mt);else{const ve=h.getViewSubImage(f,Mt);Be=ve.viewport,L===0&&(e.setRenderTargetTextures(_,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(_))}let Ne=P[L];Ne===void 0&&(Ne=new nn,Ne.layers.enable(L),Ne.viewport=new et,P[L]=Ne),Ne.matrix.fromArray(Mt.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Mt.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Be.x,Be.y,Be.width,Be.height),L===0&&(F.matrix.copy(Ne.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),ke===!0&&F.cameras.push(Ne)}const we=i.enabledFeatures;if(we&&we.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){h=n.getBinding();const L=h.getDepthInformation(pe[0]);L&&L.isValid&&L.texture&&g.init(L,i.renderState)}if(we&&we.includes("camera-access")&&v){e.state.unbindTexture(),h=n.getBinding();for(let L=0;L<pe.length;L++){const Mt=pe[L].camera;if(Mt){let Be=p[Mt];Be||(Be=new Yf,p[Mt]=Be);const Ne=h.getCameraImage(Mt);Be.sourceTexture=Ne}}}}for(let pe=0;pe<E.length;pe++){const ke=T[pe],we=E[pe];ke!==null&&we!==void 0&&we.update(ke,Z,c||a)}mt&&mt($,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),m=null}const at=new ed;at.setAnimationLoop(bt),this.setAnimationLoop=function($){mt=$},this.dispose=function(){}}}const Ni=new In,ky=new Ge;function Oy(s,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Hf(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,y,b,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),h(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,y,b):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===rn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===rn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=e.get(p),b=y.envMap,_=y.envMapRotation;b&&(g.envMap.value=b,Ni.copy(_),Ni.x*=-1,Ni.y*=-1,Ni.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ni.y*=-1,Ni.z*=-1),g.envMapRotation.value.setFromMatrix4(ky.makeRotationFromEuler(Ni)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,b){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=b*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const y=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function zy(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){const _=b.program;n.uniformBlockBinding(y,_)}function c(y,b){let _=i[y.id];_===void 0&&(m(y),_=u(y),i[y.id]=_,y.addEventListener("dispose",g));const E=b.program;n.updateUBOMapping(y,E);const T=e.render.frame;r[y.id]!==T&&(f(y),r[y.id]=T)}function u(y){const b=h();y.__bindingPointIndex=b;const _=s.createBuffer(),E=y.__size,T=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,E,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,_),_}function h(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const b=i[y.id],_=y.uniforms,E=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let T=0,A=_.length;T<A;T++){const R=Array.isArray(_[T])?_[T]:[_[T]];for(let x=0,S=R.length;x<S;x++){const P=R[x];if(d(P,T,x,E)===!0){const F=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let W=0;W<z.length;W++){const j=z[W],K=v(j);typeof j=="number"||typeof j=="boolean"?(P.__data[0]=j,s.bufferSubData(s.UNIFORM_BUFFER,F+V,P.__data)):j.isMatrix3?(P.__data[0]=j.elements[0],P.__data[1]=j.elements[1],P.__data[2]=j.elements[2],P.__data[3]=0,P.__data[4]=j.elements[3],P.__data[5]=j.elements[4],P.__data[6]=j.elements[5],P.__data[7]=0,P.__data[8]=j.elements[6],P.__data[9]=j.elements[7],P.__data[10]=j.elements[8],P.__data[11]=0):(j.toArray(P.__data,V),V+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(y,b,_,E){const T=y.value,A=b+"_"+_;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const R=E[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function m(y){const b=y.uniforms;let _=0;const E=16;for(let A=0,R=b.length;A<R;A++){const x=Array.isArray(b[A])?b[A]:[b[A]];for(let S=0,P=x.length;S<P;S++){const F=x[S],z=Array.isArray(F.value)?F.value:[F.value];for(let V=0,W=z.length;V<W;V++){const j=z[V],K=v(j),H=_%E,ae=H%K.boundary,ue=H+ae;_+=ae,ue!==0&&E-ue<K.storage&&(_+=E-ue),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=K.storage}}}const T=_%E;return T>0&&(_+=E-T),y.__size=_,y.__cache={},this}function v(y){const b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),b}function g(y){const b=y.target;b.removeEventListener("dispose",g);const _=a.indexOf(b.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function p(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:p}}class Eh{constructor(e={}){const{canvas:t=Bm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const y=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let E=!1;this._outputColorSpace=Ut;let T=0,A=0,R=null,x=-1,S=null;const P=new et,F=new et;let z=null;const V=new fe(0);let W=0,j=t.width,K=t.height,H=1,ae=null,ue=null;const Te=new et(0,0,j,K),$e=new et(0,0,j,K);let mt=!1;const bt=new Tc;let at=!1,$=!1;const Z=new Ge,pe=new I,ke=new et,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function zt(){return R===null?H:1}let L=n;function Mt(w,N){return t.getContext(w,N)}try{const w={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${cc}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",J,!1),L===null){const N="webgl2";if(L=Mt(N,w),L===null)throw Mt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Be,Ne,ve,St,_e,We,Dt,Rt,C,M,k,X,q,G,Se,ie,xe,ye,te,ce,De,be,oe,He;function D(){Be=new K_(L),Be.init(),be=new Ly(L,Be),Ne=new G_(L,Be,e,be),ve=new Iy(L,Be),Ne.reversedDepthBuffer&&f&&ve.buffers.depth.setReversed(!0),St=new Q_(L),_e=new vy,We=new Py(L,Be,ve,_e,Ne,be,St),Dt=new X_(_),Rt=new q_(_),C=new r0(L),oe=new H_(L,C),M=new Z_(L,C,St,oe),k=new tx(L,M,C,St),te=new ex(L,Ne,We),ie=new W_(_e),X=new gy(_,Dt,Rt,Be,Ne,oe,ie),q=new Oy(_,_e),G=new xy,Se=new Ey(Be),ye=new B_(_,Dt,Rt,ve,k,d,l),xe=new Ry(_,k,Ne),He=new zy(L,St,Ne,ve),ce=new V_(L,Be,St),De=new J_(L,Be,St),St.programs=X.programs,_.capabilities=Ne,_.extensions=Be,_.properties=_e,_.renderLists=G,_.shadowMap=xe,_.state=ve,_.info=St}D();const ne=new Fy(_,L);this.xr=ne,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=Be.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Be.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(j,K,!1))},this.getSize=function(w){return w.set(j,K)},this.setSize=function(w,N,O=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,K=N,t.width=Math.floor(w*H),t.height=Math.floor(N*H),O===!0&&(t.style.width=w+"px",t.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(j*H,K*H).floor()},this.setDrawingBufferSize=function(w,N,O){j=w,K=N,H=O,t.width=Math.floor(w*O),t.height=Math.floor(N*O),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(Te)},this.setViewport=function(w,N,O,B){w.isVector4?Te.set(w.x,w.y,w.z,w.w):Te.set(w,N,O,B),ve.viewport(P.copy(Te).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy($e)},this.setScissor=function(w,N,O,B){w.isVector4?$e.set(w.x,w.y,w.z,w.w):$e.set(w,N,O,B),ve.scissor(F.copy($e).multiplyScalar(H).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(w){ve.setScissorTest(mt=w)},this.setOpaqueSort=function(w){ae=w},this.setTransparentSort=function(w){ue=w},this.getClearColor=function(w){return w.copy(ye.getClearColor())},this.setClearColor=function(){ye.setClearColor(...arguments)},this.getClearAlpha=function(){return ye.getClearAlpha()},this.setClearAlpha=function(){ye.setClearAlpha(...arguments)},this.clear=function(w=!0,N=!0,O=!0){let B=0;if(w){let U=!1;if(R!==null){const Q=R.texture.format;U=Q===vc||Q===gc||Q===mc}if(U){const Q=R.texture.type,le=Q===Bn||Q===Gi||Q===fr||Q===dr||Q===fc||Q===dc,me=ye.getClearColor(),he=ye.getClearAlpha(),Pe=me.r,Ue=me.g,Ae=me.b;le?(m[0]=Pe,m[1]=Ue,m[2]=Ae,m[3]=he,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=Pe,v[1]=Ue,v[2]=Ae,v[3]=he,L.clearBufferiv(L.COLOR,0,v))}else B|=L.COLOR_BUFFER_BIT}N&&(B|=L.DEPTH_BUFFER_BIT),O&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",J,!1),ye.dispose(),G.dispose(),Se.dispose(),_e.dispose(),Dt.dispose(),Rt.dispose(),k.dispose(),oe.dispose(),He.dispose(),X.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",Dn),ne.removeEventListener("sessionend",tu),Ai.stop()};function se(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const w=St.autoReset,N=xe.enabled,O=xe.autoUpdate,B=xe.needsUpdate,U=xe.type;D(),St.autoReset=w,xe.enabled=N,xe.autoUpdate=O,xe.needsUpdate=B,xe.type=U}function J(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Y(w){const N=w.target;N.removeEventListener("dispose",Y),ge(N)}function ge(w){ze(w),_e.remove(w)}function ze(w){const N=_e.get(w).programs;N!==void 0&&(N.forEach(function(O){X.releaseProgram(O)}),w.isShaderMaterial&&X.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,O,B,U,Q){N===null&&(N=we);const le=U.isMesh&&U.matrixWorld.determinant()<0,me=Ep(w,N,O,B,U);ve.setMaterial(B,le);let he=O.index,Pe=1;if(B.wireframe===!0){if(he=M.getWireframeAttribute(O),he===void 0)return;Pe=2}const Ue=O.drawRange,Ae=O.attributes.position;let qe=Ue.start*Pe,ut=(Ue.start+Ue.count)*Pe;Q!==null&&(qe=Math.max(qe,Q.start*Pe),ut=Math.min(ut,(Q.start+Q.count)*Pe)),he!==null?(qe=Math.max(qe,0),ut=Math.min(ut,he.count)):Ae!=null&&(qe=Math.max(qe,0),ut=Math.min(ut,Ae.count));const Tt=ut-qe;if(Tt<0||Tt===1/0)return;oe.setup(U,B,me,O,he);let _t,dt=ce;if(he!==null&&(_t=C.get(he),dt=De,dt.setIndex(_t)),U.isMesh)B.wireframe===!0?(ve.setLineWidth(B.wireframeLinewidth*zt()),dt.setMode(L.LINES)):dt.setMode(L.TRIANGLES);else if(U.isLine){let Ce=B.linewidth;Ce===void 0&&(Ce=1),ve.setLineWidth(Ce*zt()),U.isLineSegments?dt.setMode(L.LINES):U.isLineLoop?dt.setMode(L.LINE_LOOP):dt.setMode(L.LINE_STRIP)}else U.isPoints?dt.setMode(L.POINTS):U.isSprite&&dt.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)xr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Be.get("WEBGL_multi_draw"))dt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ce=U._multiDrawStarts,wt=U._multiDrawCounts,it=U._multiDrawCount,on=he?C.get(he).bytesPerElement:1,Ki=_e.get(B).currentProgram.getUniforms();for(let ln=0;ln<it;ln++)Ki.setValue(L,"_gl_DrawID",ln),dt.render(Ce[ln]/on,wt[ln])}else if(U.isInstancedMesh)dt.renderInstances(qe,Tt,U.count);else if(O.isInstancedBufferGeometry){const Ce=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,wt=Math.min(O.instanceCount,Ce);dt.renderInstances(qe,Tt,wt)}else dt.render(qe,Tt)};function gt(w,N,O){w.transparent===!0&&w.side===Yt&&w.forceSinglePass===!1?(w.side=rn,w.needsUpdate=!0,Pr(w,N,O),w.side=ii,w.needsUpdate=!0,Pr(w,N,O),w.side=Yt):Pr(w,N,O)}this.compile=function(w,N,O=null){O===null&&(O=w),p=Se.get(O),p.init(N),b.push(p),O.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),w!==O&&w.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const B=new Set;return w.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const Q=U.material;if(Q)if(Array.isArray(Q))for(let le=0;le<Q.length;le++){const me=Q[le];gt(me,O,U),B.add(me)}else gt(Q,O,U),B.add(Q)}),p=b.pop(),B},this.compileAsync=function(w,N,O=null){const B=this.compile(w,N,O);return new Promise(U=>{function Q(){if(B.forEach(function(le){_e.get(le).currentProgram.isReady()&&B.delete(le)}),B.size===0){U(w);return}setTimeout(Q,10)}Be.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let ot=null;function Xn(w){ot&&ot(w)}function Dn(){Ai.stop()}function tu(){Ai.start()}const Ai=new ed;Ai.setAnimationLoop(Xn),typeof self<"u"&&Ai.setContext(self),this.setAnimationLoop=function(w){ot=w,ne.setAnimationLoop(w),w===null?Ai.stop():Ai.start()},ne.addEventListener("sessionstart",Dn),ne.addEventListener("sessionend",tu),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(N),N=ne.getCamera()),w.isScene===!0&&w.onBeforeRender(_,w,N,R),p=Se.get(w,b.length),p.init(N),b.push(p),Z.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),bt.setFromProjectionMatrix(Z,On,N.reversedDepth),$=this.localClippingEnabled,at=ie.init(this.clippingPlanes,$),g=G.get(w,y.length),g.init(),y.push(g),ne.enabled===!0&&ne.isPresenting===!0){const Q=_.xr.getDepthSensingMesh();Q!==null&&to(Q,N,-1/0,_.sortObjects)}to(w,N,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(ae,ue),Je=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,Je&&ye.addToRenderList(g,w),this.info.render.frame++,at===!0&&ie.beginShadows();const O=p.state.shadowsArray;xe.render(O,w,N),at===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=g.opaque,U=g.transmissive;if(p.setupLights(),N.isArrayCamera){const Q=N.cameras;if(U.length>0)for(let le=0,me=Q.length;le<me;le++){const he=Q[le];iu(B,U,w,he)}Je&&ye.render(w);for(let le=0,me=Q.length;le<me;le++){const he=Q[le];nu(g,w,he,he.viewport)}}else U.length>0&&iu(B,U,w,N),Je&&ye.render(w),nu(g,w,N);R!==null&&A===0&&(We.updateMultisampleRenderTarget(R),We.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(_,w,N),oe.resetDefaultState(),x=-1,S=null,b.pop(),b.length>0?(p=b[b.length-1],at===!0&&ie.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function to(w,N,O,B){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)O=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||bt.intersectsSprite(w)){B&&ke.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Z);const le=k.update(w),me=w.material;me.visible&&g.push(w,le,me,O,ke.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||bt.intersectsObject(w))){const le=k.update(w),me=w.material;if(B&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),ke.copy(w.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),ke.copy(le.boundingSphere.center)),ke.applyMatrix4(w.matrixWorld).applyMatrix4(Z)),Array.isArray(me)){const he=le.groups;for(let Pe=0,Ue=he.length;Pe<Ue;Pe++){const Ae=he[Pe],qe=me[Ae.materialIndex];qe&&qe.visible&&g.push(w,le,qe,O,ke.z,Ae)}}else me.visible&&g.push(w,le,me,O,ke.z,null)}}const Q=w.children;for(let le=0,me=Q.length;le<me;le++)to(Q[le],N,O,B)}function nu(w,N,O,B){const U=w.opaque,Q=w.transmissive,le=w.transparent;p.setupLightsView(O),at===!0&&ie.setGlobalState(_.clippingPlanes,O),B&&ve.viewport(P.copy(B)),U.length>0&&Ir(U,N,O),Q.length>0&&Ir(Q,N,O),le.length>0&&Ir(le,N,O),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function iu(w,N,O,B){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new Wi(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?br:Bn,minFilter:kn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));const Q=p.state.transmissionRenderTarget[B.id],le=B.viewport||P;Q.setSize(le.z*_.transmissionResolutionScale,le.w*_.transmissionResolutionScale);const me=_.getRenderTarget(),he=_.getActiveCubeFace(),Pe=_.getActiveMipmapLevel();_.setRenderTarget(Q),_.getClearColor(V),W=_.getClearAlpha(),W<1&&_.setClearColor(16777215,.5),_.clear(),Je&&ye.render(O);const Ue=_.toneMapping;_.toneMapping=bi;const Ae=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),at===!0&&ie.setGlobalState(_.clippingPlanes,B),Ir(w,O,B),We.updateMultisampleRenderTarget(Q),We.updateRenderTargetMipmap(Q),Be.has("WEBGL_multisampled_render_to_texture")===!1){let qe=!1;for(let ut=0,Tt=N.length;ut<Tt;ut++){const _t=N[ut],dt=_t.object,Ce=_t.geometry,wt=_t.material,it=_t.group;if(wt.side===Yt&&dt.layers.test(B.layers)){const on=wt.side;wt.side=rn,wt.needsUpdate=!0,su(dt,O,B,Ce,wt,it),wt.side=on,wt.needsUpdate=!0,qe=!0}}qe===!0&&(We.updateMultisampleRenderTarget(Q),We.updateRenderTargetMipmap(Q))}_.setRenderTarget(me,he,Pe),_.setClearColor(V,W),Ae!==void 0&&(B.viewport=Ae),_.toneMapping=Ue}function Ir(w,N,O){const B=N.isScene===!0?N.overrideMaterial:null;for(let U=0,Q=w.length;U<Q;U++){const le=w[U],me=le.object,he=le.geometry,Pe=le.group;let Ue=le.material;Ue.allowOverride===!0&&B!==null&&(Ue=B),me.layers.test(O.layers)&&su(me,N,O,he,Ue,Pe)}}function su(w,N,O,B,U,Q){w.onBeforeRender(_,N,O,B,U,Q),w.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),U.onBeforeRender(_,N,O,B,w,Q),U.transparent===!0&&U.side===Yt&&U.forceSinglePass===!1?(U.side=rn,U.needsUpdate=!0,_.renderBufferDirect(O,N,B,U,w,Q),U.side=ii,U.needsUpdate=!0,_.renderBufferDirect(O,N,B,U,w,Q),U.side=Yt):_.renderBufferDirect(O,N,B,U,w,Q),w.onAfterRender(_,N,O,B,U,Q)}function Pr(w,N,O){N.isScene!==!0&&(N=we);const B=_e.get(w),U=p.state.lights,Q=p.state.shadowsArray,le=U.state.version,me=X.getParameters(w,U.state,Q,N,O),he=X.getProgramCacheKey(me);let Pe=B.programs;B.environment=w.isMeshStandardMaterial?N.environment:null,B.fog=N.fog,B.envMap=(w.isMeshStandardMaterial?Rt:Dt).get(w.envMap||B.environment),B.envMapRotation=B.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,Pe===void 0&&(w.addEventListener("dispose",Y),Pe=new Map,B.programs=Pe);let Ue=Pe.get(he);if(Ue!==void 0){if(B.currentProgram===Ue&&B.lightsStateVersion===le)return au(w,me),Ue}else me.uniforms=X.getUniforms(w),w.onBeforeCompile(me,_),Ue=X.acquireProgram(me,he),Pe.set(he,Ue),B.uniforms=me.uniforms;const Ae=B.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ae.clippingPlanes=ie.uniform),au(w,me),B.needsLights=Ap(w),B.lightsStateVersion=le,B.needsLights&&(Ae.ambientLightColor.value=U.state.ambient,Ae.lightProbe.value=U.state.probe,Ae.directionalLights.value=U.state.directional,Ae.directionalLightShadows.value=U.state.directionalShadow,Ae.spotLights.value=U.state.spot,Ae.spotLightShadows.value=U.state.spotShadow,Ae.rectAreaLights.value=U.state.rectArea,Ae.ltc_1.value=U.state.rectAreaLTC1,Ae.ltc_2.value=U.state.rectAreaLTC2,Ae.pointLights.value=U.state.point,Ae.pointLightShadows.value=U.state.pointShadow,Ae.hemisphereLights.value=U.state.hemi,Ae.directionalShadowMap.value=U.state.directionalShadowMap,Ae.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ae.spotShadowMap.value=U.state.spotShadowMap,Ae.spotLightMatrix.value=U.state.spotLightMatrix,Ae.spotLightMap.value=U.state.spotLightMap,Ae.pointShadowMap.value=U.state.pointShadowMap,Ae.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=Ue,B.uniformsList=null,Ue}function ru(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=ga.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function au(w,N){const O=_e.get(w);O.outputColorSpace=N.outputColorSpace,O.batching=N.batching,O.batchingColor=N.batchingColor,O.instancing=N.instancing,O.instancingColor=N.instancingColor,O.instancingMorph=N.instancingMorph,O.skinning=N.skinning,O.morphTargets=N.morphTargets,O.morphNormals=N.morphNormals,O.morphColors=N.morphColors,O.morphTargetsCount=N.morphTargetsCount,O.numClippingPlanes=N.numClippingPlanes,O.numIntersection=N.numClipIntersection,O.vertexAlphas=N.vertexAlphas,O.vertexTangents=N.vertexTangents,O.toneMapping=N.toneMapping}function Ep(w,N,O,B,U){N.isScene!==!0&&(N=we),We.resetTextureUnits();const Q=N.fog,le=B.isMeshStandardMaterial?N.environment:null,me=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Jt,he=(B.isMeshStandardMaterial?Rt:Dt).get(B.envMap||le),Pe=B.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Ue=!!O.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Ae=!!O.morphAttributes.position,qe=!!O.morphAttributes.normal,ut=!!O.morphAttributes.color;let Tt=bi;B.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Tt=_.toneMapping);const _t=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,dt=_t!==void 0?_t.length:0,Ce=_e.get(B),wt=p.state.lights;if(at===!0&&($===!0||w!==S)){const Xt=w===S&&B.id===x;ie.setState(B,w,Xt)}let it=!1;B.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==wt.state.version||Ce.outputColorSpace!==me||U.isBatchedMesh&&Ce.batching===!1||!U.isBatchedMesh&&Ce.batching===!0||U.isBatchedMesh&&Ce.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ce.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ce.instancing===!1||!U.isInstancedMesh&&Ce.instancing===!0||U.isSkinnedMesh&&Ce.skinning===!1||!U.isSkinnedMesh&&Ce.skinning===!0||U.isInstancedMesh&&Ce.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ce.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ce.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ce.instancingMorph===!1&&U.morphTexture!==null||Ce.envMap!==he||B.fog===!0&&Ce.fog!==Q||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==ie.numPlanes||Ce.numIntersection!==ie.numIntersection)||Ce.vertexAlphas!==Pe||Ce.vertexTangents!==Ue||Ce.morphTargets!==Ae||Ce.morphNormals!==qe||Ce.morphColors!==ut||Ce.toneMapping!==Tt||Ce.morphTargetsCount!==dt)&&(it=!0):(it=!0,Ce.__version=B.version);let on=Ce.currentProgram;it===!0&&(on=Pr(B,N,U));let Ki=!1,ln=!1,Vs=!1;const Et=on.getUniforms(),dn=Ce.uniforms;if(ve.useProgram(on.program)&&(Ki=!0,ln=!0,Vs=!0),B.id!==x&&(x=B.id,ln=!0),Ki||S!==w){ve.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Et.setValue(L,"projectionMatrix",w.projectionMatrix),Et.setValue(L,"viewMatrix",w.matrixWorldInverse);const Qt=Et.map.cameraPosition;Qt!==void 0&&Qt.setValue(L,pe.setFromMatrixPosition(w.matrixWorld)),Ne.logarithmicDepthBuffer&&Et.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Et.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,ln=!0,Vs=!0)}if(U.isSkinnedMesh){Et.setOptional(L,U,"bindMatrix"),Et.setOptional(L,U,"bindMatrixInverse");const Xt=U.skeleton;Xt&&(Xt.boneTexture===null&&Xt.computeBoneTexture(),Et.setValue(L,"boneTexture",Xt.boneTexture,We))}U.isBatchedMesh&&(Et.setOptional(L,U,"batchingTexture"),Et.setValue(L,"batchingTexture",U._matricesTexture,We),Et.setOptional(L,U,"batchingIdTexture"),Et.setValue(L,"batchingIdTexture",U._indirectTexture,We),Et.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&Et.setValue(L,"batchingColorTexture",U._colorsTexture,We));const pn=O.morphAttributes;if((pn.position!==void 0||pn.normal!==void 0||pn.color!==void 0)&&te.update(U,O,on),(ln||Ce.receiveShadow!==U.receiveShadow)&&(Ce.receiveShadow=U.receiveShadow,Et.setValue(L,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(dn.envMap.value=he,dn.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&N.environment!==null&&(dn.envMapIntensity.value=N.environmentIntensity),ln&&(Et.setValue(L,"toneMappingExposure",_.toneMappingExposure),Ce.needsLights&&Tp(dn,Vs),Q&&B.fog===!0&&q.refreshFogUniforms(dn,Q),q.refreshMaterialUniforms(dn,B,H,K,p.state.transmissionRenderTarget[w.id]),ga.upload(L,ru(Ce),dn,We)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ga.upload(L,ru(Ce),dn,We),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Et.setValue(L,"center",U.center),Et.setValue(L,"modelViewMatrix",U.modelViewMatrix),Et.setValue(L,"normalMatrix",U.normalMatrix),Et.setValue(L,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Xt=B.uniformsGroups;for(let Qt=0,no=Xt.length;Qt<no;Qt++){const Ri=Xt[Qt];He.update(Ri,on),He.bind(Ri,on)}}return on}function Tp(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function Ap(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,N,O){const B=_e.get(w);B.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),_e.get(w.texture).__webglTexture=N,_e.get(w.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:O,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,N){const O=_e.get(w);O.__webglFramebuffer=N,O.__useDefaultFramebuffer=N===void 0};const Rp=L.createFramebuffer();this.setRenderTarget=function(w,N=0,O=0){R=w,T=N,A=O;let B=!0,U=null,Q=!1,le=!1;if(w){const he=_e.get(w);if(he.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(L.FRAMEBUFFER,null),B=!1;else if(he.__webglFramebuffer===void 0)We.setupRenderTarget(w);else if(he.__hasExternalTextures)We.rebindTextures(w,_e.get(w.texture).__webglTexture,_e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ae=w.depthTexture;if(he.__boundDepthTexture!==Ae){if(Ae!==null&&_e.has(Ae)&&(w.width!==Ae.image.width||w.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");We.setupDepthRenderbuffer(w)}}const Pe=w.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(le=!0);const Ue=_e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ue[N])?U=Ue[N][O]:U=Ue[N],Q=!0):w.samples>0&&We.useMultisampledRTT(w)===!1?U=_e.get(w).__webglMultisampledFramebuffer:Array.isArray(Ue)?U=Ue[O]:U=Ue,P.copy(w.viewport),F.copy(w.scissor),z=w.scissorTest}else P.copy(Te).multiplyScalar(H).floor(),F.copy($e).multiplyScalar(H).floor(),z=mt;if(O!==0&&(U=Rp),ve.bindFramebuffer(L.FRAMEBUFFER,U)&&B&&ve.drawBuffers(w,U),ve.viewport(P),ve.scissor(F),ve.setScissorTest(z),Q){const he=_e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,he.__webglTexture,O)}else if(le){const he=N;for(let Pe=0;Pe<w.textures.length;Pe++){const Ue=_e.get(w.textures[Pe]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Pe,Ue.__webglTexture,O,he)}}else if(w!==null&&O!==0){const he=_e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,he.__webglTexture,O)}x=-1},this.readRenderTargetPixels=function(w,N,O,B,U,Q,le,me=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=_e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&le!==void 0&&(he=he[le]),he){ve.bindFramebuffer(L.FRAMEBUFFER,he);try{const Pe=w.textures[me],Ue=Pe.format,Ae=Pe.type;if(!Ne.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ne.textureTypeReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-B&&O>=0&&O<=w.height-U&&(w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),L.readPixels(N,O,B,U,be.convert(Ue),be.convert(Ae),Q))}finally{const Pe=R!==null?_e.get(R).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(w,N,O,B,U,Q,le,me=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=_e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&le!==void 0&&(he=he[le]),he)if(N>=0&&N<=w.width-B&&O>=0&&O<=w.height-U){ve.bindFramebuffer(L.FRAMEBUFFER,he);const Pe=w.textures[me],Ue=Pe.format,Ae=Pe.type;if(!Ne.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ne.textureTypeReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const qe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,qe),L.bufferData(L.PIXEL_PACK_BUFFER,Q.byteLength,L.STREAM_READ),w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+me),L.readPixels(N,O,B,U,be.convert(Ue),be.convert(Ae),0);const ut=R!==null?_e.get(R).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,ut);const Tt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Hm(L,Tt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,qe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Q),L.deleteBuffer(qe),L.deleteSync(Tt),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,N=null,O=0){const B=Math.pow(2,-O),U=Math.floor(w.image.width*B),Q=Math.floor(w.image.height*B),le=N!==null?N.x:0,me=N!==null?N.y:0;We.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,O,0,0,le,me,U,Q),ve.unbindTexture()};const Cp=L.createFramebuffer(),Ip=L.createFramebuffer();this.copyTextureToTexture=function(w,N,O=null,B=null,U=0,Q=null){Q===null&&(U!==0?(xr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=U,U=0):Q=0);let le,me,he,Pe,Ue,Ae,qe,ut,Tt;const _t=w.isCompressedTexture?w.mipmaps[Q]:w.image;if(O!==null)le=O.max.x-O.min.x,me=O.max.y-O.min.y,he=O.isBox3?O.max.z-O.min.z:1,Pe=O.min.x,Ue=O.min.y,Ae=O.isBox3?O.min.z:0;else{const pn=Math.pow(2,-U);le=Math.floor(_t.width*pn),me=Math.floor(_t.height*pn),w.isDataArrayTexture?he=_t.depth:w.isData3DTexture?he=Math.floor(_t.depth*pn):he=1,Pe=0,Ue=0,Ae=0}B!==null?(qe=B.x,ut=B.y,Tt=B.z):(qe=0,ut=0,Tt=0);const dt=be.convert(N.format),Ce=be.convert(N.type);let wt;N.isData3DTexture?(We.setTexture3D(N,0),wt=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(We.setTexture2DArray(N,0),wt=L.TEXTURE_2D_ARRAY):(We.setTexture2D(N,0),wt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const it=L.getParameter(L.UNPACK_ROW_LENGTH),on=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ki=L.getParameter(L.UNPACK_SKIP_PIXELS),ln=L.getParameter(L.UNPACK_SKIP_ROWS),Vs=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,_t.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,_t.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Pe),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ue),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ae);const Et=w.isDataArrayTexture||w.isData3DTexture,dn=N.isDataArrayTexture||N.isData3DTexture;if(w.isDepthTexture){const pn=_e.get(w),Xt=_e.get(N),Qt=_e.get(pn.__renderTarget),no=_e.get(Xt.__renderTarget);ve.bindFramebuffer(L.READ_FRAMEBUFFER,Qt.__webglFramebuffer),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,no.__webglFramebuffer);for(let Ri=0;Ri<he;Ri++)Et&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(w).__webglTexture,U,Ae+Ri),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(N).__webglTexture,Q,Tt+Ri)),L.blitFramebuffer(Pe,Ue,le,me,qe,ut,le,me,L.DEPTH_BUFFER_BIT,L.NEAREST);ve.bindFramebuffer(L.READ_FRAMEBUFFER,null),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(U!==0||w.isRenderTargetTexture||_e.has(w)){const pn=_e.get(w),Xt=_e.get(N);ve.bindFramebuffer(L.READ_FRAMEBUFFER,Cp),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ip);for(let Qt=0;Qt<he;Qt++)Et?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pn.__webglTexture,U,Ae+Qt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,pn.__webglTexture,U),dn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Xt.__webglTexture,Q,Tt+Qt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Xt.__webglTexture,Q),U!==0?L.blitFramebuffer(Pe,Ue,le,me,qe,ut,le,me,L.COLOR_BUFFER_BIT,L.NEAREST):dn?L.copyTexSubImage3D(wt,Q,qe,ut,Tt+Qt,Pe,Ue,le,me):L.copyTexSubImage2D(wt,Q,qe,ut,Pe,Ue,le,me);ve.bindFramebuffer(L.READ_FRAMEBUFFER,null),ve.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else dn?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(wt,Q,qe,ut,Tt,le,me,he,dt,Ce,_t.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(wt,Q,qe,ut,Tt,le,me,he,dt,_t.data):L.texSubImage3D(wt,Q,qe,ut,Tt,le,me,he,dt,Ce,_t):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Q,qe,ut,le,me,dt,Ce,_t.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Q,qe,ut,_t.width,_t.height,dt,_t.data):L.texSubImage2D(L.TEXTURE_2D,Q,qe,ut,le,me,dt,Ce,_t);L.pixelStorei(L.UNPACK_ROW_LENGTH,it),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,on),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ki),L.pixelStorei(L.UNPACK_SKIP_ROWS,ln),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Vs),Q===0&&N.generateMipmaps&&L.generateMipmap(wt),ve.unbindTexture()},this.initRenderTarget=function(w){_e.get(w).__webglFramebuffer===void 0&&We.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?We.setTextureCube(w,0):w.isData3DTexture?We.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?We.setTexture2DArray(w,0):We.setTexture2D(w,0),ve.unbindTexture()},this.resetState=function(){T=0,A=0,R=null,ve.reset(),oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}function Wl(s,e){(e==null||e>s.length)&&(e=s.length);for(var t=0,n=Array(e);t<e;t++)n[t]=s[t];return n}function By(s){if(Array.isArray(s))return s}function Hy(s){if(Array.isArray(s))return Wl(s)}function Vy(s,e){if(!(s instanceof e))throw new TypeError("Cannot call a class as a function")}function Gy(s,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(s,rd(n.key),n)}}function Wy(s,e,t){return e&&Gy(s.prototype,e),Object.defineProperty(s,"prototype",{writable:!1}),s}function va(s,e){var t=typeof Symbol<"u"&&s[Symbol.iterator]||s["@@iterator"];if(!t){if(Array.isArray(s)||(t=Nc(s))||e){t&&(s=t);var n=0,i=function(){};return{s:i,n:function(){return n>=s.length?{done:!0}:{done:!1,value:s[n++]}},e:function(l){throw l},f:i}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var r,a=!0,o=!1;return{s:function(){t=t.call(s)},n:function(){var l=t.next();return a=l.done,l},e:function(l){o=!0,r=l},f:function(){try{a||t.return==null||t.return()}finally{if(o)throw r}}}}function Re(s,e,t){return(e=rd(e))in s?Object.defineProperty(s,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):s[e]=t,s}function Xy(s){if(typeof Symbol<"u"&&s[Symbol.iterator]!=null||s["@@iterator"]!=null)return Array.from(s)}function jy(s,e){var t=s==null?null:typeof Symbol<"u"&&s[Symbol.iterator]||s["@@iterator"];if(t!=null){var n,i,r,a,o=[],l=!0,c=!1;try{if(r=(t=t.call(s)).next,e===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(n=r.call(t)).done)&&(o.push(n.value),o.length!==e);l=!0);}catch(u){c=!0,i=u}finally{try{if(!l&&t.return!=null&&(a=t.return(),Object(a)!==a))return}finally{if(c)throw i}}return o}}function $y(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Yy(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Th(s,e){var t=Object.keys(s);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(s);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(s,i).enumerable})),t.push.apply(t,n)}return t}function ee(s){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?Th(Object(t),!0).forEach(function(n){Re(s,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(t)):Th(Object(t)).forEach(function(n){Object.defineProperty(s,n,Object.getOwnPropertyDescriptor(t,n))})}return s}function ja(s,e){return By(s)||jy(s,e)||Nc(s,e)||$y()}function Pn(s){return Hy(s)||Xy(s)||Nc(s)||Yy()}function qy(s,e){if(typeof s!="object"||!s)return s;var t=s[Symbol.toPrimitive];if(t!==void 0){var n=t.call(s,e);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(s)}function rd(s){var e=qy(s,"string");return typeof e=="symbol"?e:e+""}function La(s){"@babel/helpers - typeof";return La=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},La(s)}function Nc(s,e){if(s){if(typeof s=="string")return Wl(s,e);var t={}.toString.call(s).slice(8,-1);return t==="Object"&&s.constructor&&(t=s.constructor.name),t==="Map"||t==="Set"?Array.from(s):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?Wl(s,e):void 0}}var Ah=function(){},Uc={},ad={},od=null,ld={mark:Ah,measure:Ah};try{typeof window<"u"&&(Uc=window),typeof document<"u"&&(ad=document),typeof MutationObserver<"u"&&(od=MutationObserver),typeof performance<"u"&&(ld=performance)}catch{}var Ky=Uc.navigator||{},Rh=Ky.userAgent,Ch=Rh===void 0?"":Rh,wi=Uc,yt=ad,Ih=od,ra=ld;wi.document;var oi=!!yt.documentElement&&!!yt.head&&typeof yt.addEventListener=="function"&&typeof yt.createElement=="function",cd=~Ch.indexOf("MSIE")||~Ch.indexOf("Trident/"),aa,Zy=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,Jy=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,ud={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},"slab-duo":{"fa-regular":"regular",fasldr:"regular"},"slab-press-duo":{"fa-regular":"regular",faslpdr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},vellum:{"fa-solid":"solid",favs:"solid"},pixel:{"fa-regular":"regular",fapr:"regular"},mosaic:{"fa-solid":"solid",fams:"solid"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},Qy={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},hd=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],Ot="classic",Ar="duotone",fd="sharp",dd="sharp-duotone",pd="chisel",md="etch",gd="graphite",vd="jelly",_d="jelly-duo",xd="jelly-fill",yd="mosaic",bd="notdog",Md="notdog-duo",Sd="pixel",wd="slab",Ed="slab-duo",Td="slab-press",Ad="slab-press-duo",Rd="thumbprint",Cd="utility",Id="utility-duo",Pd="utility-fill",Ld="vellum",Dd="whiteboard",e1="Classic",t1="Duotone",n1="Sharp",i1="Sharp Duotone",s1="Chisel",r1="Etch",a1="Graphite",o1="Jelly",l1="Jelly Duo",c1="Jelly Fill",u1="Mosaic",h1="Notdog",f1="Notdog Duo",d1="Pixel",p1="Slab",m1="Slab Duo",g1="Slab Press",v1="Slab Press Duo",_1="Thumbprint",x1="Utility",y1="Utility Duo",b1="Utility Fill",M1="Vellum",S1="Whiteboard",Nd=[Ot,Ar,fd,dd,pd,md,gd,vd,_d,xd,yd,bd,Md,Sd,wd,Ed,Td,Ad,Rd,Cd,Id,Pd,Ld,Dd];aa={},Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(aa,Ot,e1),Ar,t1),fd,n1),dd,i1),pd,s1),md,r1),gd,a1),vd,o1),_d,l1),xd,c1),Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(aa,yd,u1),bd,h1),Md,f1),Sd,d1),wd,p1),Ed,m1),Td,g1),Ad,v1),Rd,_1),Cd,x1),Re(Re(Re(Re(aa,Id,y1),Pd,b1),Ld,M1),Dd,S1);var w1={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},"slab-duo":{400:"fasldr"},"slab-press-duo":{400:"faslpdr"},vellum:{900:"favs"},mosaic:{900:"fams"},pixel:{400:"fapr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},E1={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Slab Duo":{400:"fasldr",normal:"fasldr"},"Font Awesome 7 Slab Press Duo":{400:"faslpdr",normal:"faslpdr"},"Font Awesome 7 Pixel":{400:"fapr",normal:"fapr"},"Font Awesome 7 Mosaic":{900:"fams",normal:"fams"},"Font Awesome 7 Vellum":{900:"favs",normal:"favs"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},T1=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["mosaic",{defaultShortPrefixId:"fams",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["pixel",{defaultShortPrefixId:"fapr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-duo",{defaultShortPrefixId:"fasldr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press-duo",{defaultShortPrefixId:"faslpdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["vellum",{defaultShortPrefixId:"favs",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),A1={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},mosaic:{solid:"fams"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},pixel:{regular:"fapr"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-duo":{regular:"fasldr"},"slab-press":{regular:"faslpr"},"slab-press-duo":{regular:"faslpdr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},vellum:{solid:"favs"},whiteboard:{semibold:"fawsb"}},Ud=["fak","fa-kit","fakd","fa-kit-duotone"],Ph={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},R1=["kit"],C1="kit",I1="kit-duotone",P1="Kit",L1="Kit Duotone";Re(Re({},C1,P1),I1,L1);var D1={kit:{"fa-kit":"fak"}},N1={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},U1={kit:{fak:"fa-kit"}},Lh={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},oa,la={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},F1=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],k1="classic",O1="duotone",z1="sharp",B1="sharp-duotone",H1="chisel",V1="etch",G1="graphite",W1="jelly",X1="jelly-duo",j1="jelly-fill",$1="mosaic",Y1="notdog",q1="notdog-duo",K1="pixel",Z1="slab",J1="slab-duo",Q1="slab-press",eb="slab-press-duo",tb="thumbprint",nb="utility",ib="utility-duo",sb="utility-fill",rb="vellum",ab="whiteboard",ob="Classic",lb="Duotone",cb="Sharp",ub="Sharp Duotone",hb="Chisel",fb="Etch",db="Graphite",pb="Jelly",mb="Jelly Duo",gb="Jelly Fill",vb="Mosaic",_b="Notdog",xb="Notdog Duo",yb="Pixel",bb="Slab",Mb="Slab Duo",Sb="Slab Press",wb="Slab Press Duo",Eb="Thumbprint",Tb="Utility",Ab="Utility Duo",Rb="Utility Fill",Cb="Vellum",Ib="Whiteboard";oa={},Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(oa,k1,ob),O1,lb),z1,cb),B1,ub),H1,hb),V1,fb),G1,db),W1,pb),X1,mb),j1,gb),Re(Re(Re(Re(Re(Re(Re(Re(Re(Re(oa,$1,vb),Y1,_b),q1,xb),K1,yb),Z1,bb),J1,Mb),Q1,Sb),eb,wb),tb,Eb),nb,Tb),Re(Re(Re(Re(oa,ib,Ab),sb,Rb),rb,Cb),ab,Ib);var Pb="kit",Lb="kit-duotone",Db="Kit",Nb="Kit Duotone";Re(Re({},Pb,Db),Lb,Nb);var Ub={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},"slab-duo":{"fa-regular":"fasldr"},"slab-press-duo":{"fa-regular":"faslpdr"},pixel:{"fa-regular":"fapr"},mosaic:{"fa-solid":"fams"},vellum:{"fa-solid":"favs"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Fb={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],"slab-duo":["fasldr"],"slab-press-duo":["faslpdr"],pixel:["fapr"],mosaic:["fams"],vellum:["favs"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Xl={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},"slab-duo":{fasldr:"fa-regular"},"slab-press-duo":{faslpdr:"fa-regular"},pixel:{fapr:"fa-regular"},mosaic:{fams:"fa-solid"},vellum:{favs:"fa-solid"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},kb=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],Fd=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fasldr","faslpdr","fapr","fams","favs","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(F1,kb),Ob=["solid","regular","light","thin","duotone","brands","semibold"],kd=[1,2,3,4,5,6,7,8,9,10],zb=kd.concat([11,12,13,14,15,16,17,18,19,20]),Bb=["aw","fw","pull-left","pull-right"],Hb=[].concat(Pn(Object.keys(Fb)),Ob,Bb,["2xs","xs","sm","lg","xl","2xl","beat","beat-fade","border","bounce","buzz","canvas-square","canvas-roomy","fade","flip-360","flip-both","flip-horizontal","flip-vertical","flip","float","inverse","jello","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","spin-snap","spin-snap-4","spin-snap-8","stack-1x","stack-2x","stack","swing","ul","wag","width-auto","width-fixed",la.GROUP,la.SWAP_OPACITY,la.PRIMARY,la.SECONDARY]).concat(kd.map(function(s){return"".concat(s,"x")})).concat(zb.map(function(s){return"w-".concat(s)})),Vb={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},ri="___FONT_AWESOME___",jl=16,Od="fa",zd="svg-inline--fa",ji="data-fa-i2svg",$l="data-fa-pseudo-element",Gb="data-fa-pseudo-element-pending",Fc="data-prefix",kc="data-icon",Dh="fontawesome-i2svg",Wb="async",Xb=["HTML","HEAD","STYLE","SCRIPT"],Bd=["::before","::after",":before",":after"],Hd=(function(){try{return!0}catch{return!1}})();function Rr(s){return new Proxy(s,{get:function(t,n){return n in t?t[n]:t[Ot]}})}var Vd=ee({},ud);Vd[Ot]=ee(ee(ee(ee({},{"fa-duotone":"duotone"}),ud[Ot]),Ph.kit),Ph["kit-duotone"]);var jb=Rr(Vd),Yl=ee({},A1);Yl[Ot]=ee(ee(ee(ee({},{duotone:"fad"}),Yl[Ot]),Lh.kit),Lh["kit-duotone"]);var Nh=Rr(Yl),ql=ee({},Xl);ql[Ot]=ee(ee({},ql[Ot]),U1.kit);var Oc=Rr(ql),Kl=ee({},Ub);Kl[Ot]=ee(ee({},Kl[Ot]),D1.kit);Rr(Kl);var $b=Zy,Gd="fa-layers-text",Yb=Jy,qb=ee({},w1);Rr(qb);var Kb=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],zo=Qy,Zb=[].concat(Pn(R1),Pn(Hb)),ar=wi.FontAwesomeConfig||{};function Jb(s){var e=yt.querySelector("script["+s+"]");if(e)return e.getAttribute(s)}function Qb(s){return s===""?!0:s==="false"?!1:s==="true"?!0:s}if(yt&&typeof yt.querySelector=="function"){var eM=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];eM.forEach(function(s){var e=ja(s,2),t=e[0],n=e[1],i=Qb(Jb(t));i!=null&&(ar[n]=i)})}var Wd={styleDefault:"solid",familyDefault:Ot,cssPrefix:Od,replacementClass:zd,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ar.familyPrefix&&(ar.cssPrefix=ar.familyPrefix);var Ds=ee(ee({},Wd),ar);Ds.autoReplaceSvg||(Ds.observeMutations=!1);var Ee={};Object.keys(Wd).forEach(function(s){Object.defineProperty(Ee,s,{enumerable:!0,set:function(t){Ds[s]=t,or.forEach(function(n){return n(Ee)})},get:function(){return Ds[s]}})});Object.defineProperty(Ee,"familyPrefix",{enumerable:!0,set:function(e){Ds.cssPrefix=e,or.forEach(function(t){return t(Ee)})},get:function(){return Ds.cssPrefix}});wi.FontAwesomeConfig=Ee;var or=[];function tM(s){return or.push(s),function(){or.splice(or.indexOf(s),1)}}var ds=jl,zn={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function nM(s){if(!(!s||!oi)){var e=yt.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=s;for(var t=yt.head.childNodes,n=null,i=t.length-1;i>-1;i--){var r=t[i],a=(r.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(a)>-1&&(n=r)}return yt.head.insertBefore(e,n),s}}var iM="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Uh(){for(var s=12,e="";s-- >0;)e+=iM[Math.random()*62|0];return e}function Hs(s){for(var e=[],t=(s||[]).length>>>0;t--;)e[t]=s[t];return e}function zc(s){return s.classList?Hs(s.classList):(s.getAttribute("class")||"").split(" ").filter(function(e){return e})}function Xd(s){return"".concat(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function sM(s){return Object.keys(s||{}).reduce(function(e,t){return e+"".concat(t,'="').concat(Xd(s[t]),'" ')},"").trim()}function $a(s){return Object.keys(s||{}).reduce(function(e,t){return e+"".concat(t,": ").concat(s[t].trim(),";")},"")}function Bc(s){return s.size!==zn.size||s.x!==zn.x||s.y!==zn.y||s.rotate!==zn.rotate||s.flipX||s.flipY}function rM(s){var e=s.transform,t=s.containerWidth,n=s.iconWidth,i={transform:"translate(".concat(t/2," 256)")},r="translate(".concat(e.x*32,", ").concat(e.y*32,") "),a="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),o="rotate(".concat(e.rotate," 0 0)"),l={transform:"".concat(r," ").concat(a," ").concat(o)},c={transform:"translate(".concat(n/2*-1," -256)")};return{outer:i,inner:l,path:c}}function aM(s){var e=s.transform,t=s.width,n=t===void 0?jl:t,i=s.height,r=i===void 0?jl:i,a="";return cd?a+="translate(".concat(e.x/ds-n/2,"em, ").concat(e.y/ds-r/2,"em) "):a+="translate(calc(-50% + ".concat(e.x/ds,"em), calc(-50% + ").concat(e.y/ds,"em)) "),a+="scale(".concat(e.size/ds*(e.flipX?-1:1),", ").concat(e.size/ds*(e.flipY?-1:1),") "),a+="rotate(".concat(e.rotate,"deg) "),a}var oM=`:root, :host {
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
}`;function jd(){var s=Od,e=zd,t=Ee.cssPrefix,n=Ee.replacementClass,i=oM;if(t!==s||n!==e){var r=new RegExp("\\.".concat(s,"\\-"),"g"),a=new RegExp("\\--".concat(s,"\\-"),"g"),o=new RegExp("\\.".concat(e),"g");i=i.replace(r,".".concat(t,"-")).replace(a,"--".concat(t,"-")).replace(o,".".concat(n))}return i}var Fh=!1;function Bo(){Ee.autoAddCss&&!Fh&&(nM(jd()),Fh=!0)}var lM={mixout:function(){return{dom:{css:jd,insertCss:Bo}}},hooks:function(){return{beforeDOMElementCreation:function(){Bo()},beforeI2svg:function(){Bo()}}}},ai=wi||{};ai[ri]||(ai[ri]={});ai[ri].styles||(ai[ri].styles={});ai[ri].hooks||(ai[ri].hooks={});ai[ri].shims||(ai[ri].shims=[]);var Tn=ai[ri],$d=[],Yd=function(){yt.removeEventListener("DOMContentLoaded",Yd),Da=1,$d.map(function(e){return e()})},Da=!1;oi&&(Da=(yt.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(yt.readyState),Da||yt.addEventListener("DOMContentLoaded",Yd));function cM(s){oi&&(Da?setTimeout(s,0):$d.push(s))}function Cr(s){var e=s.tag,t=s.attributes,n=t===void 0?{}:t,i=s.children,r=i===void 0?[]:i;return typeof s=="string"?Xd(s):"<".concat(e," ").concat(sM(n),">").concat(r.map(Cr).join(""),"</").concat(e,">")}function kh(s,e,t){if(s&&s[e]&&s[e][t])return{prefix:e,iconName:t,icon:s[e][t]}}var Ho=function(e,t,n,i){var r=Object.keys(e),a=r.length,o=t,l,c,u;for(n===void 0?(l=1,u=e[r[0]]):(l=0,u=n);l<a;l++)c=r[l],u=o(u,e[c],c,e);return u};function qd(s){return Pn(s).length!==1?null:s.codePointAt(0).toString(16)}function Oh(s){return Object.keys(s).reduce(function(e,t){var n=s[t],i=!!n.icon;return i?e[n.iconName]=n.icon:e[t]=n,e},{})}function Zl(s,e){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=t.skipHooks,i=n===void 0?!1:n,r=Oh(e);typeof Tn.hooks.addPack=="function"&&!i?Tn.hooks.addPack(s,Oh(e)):Tn.styles[s]=ee(ee({},Tn.styles[s]||{}),r),s==="fas"&&Zl("fa",e)}var yr=Tn.styles,uM=Tn.shims,Kd=Object.keys(Oc),hM=Kd.reduce(function(s,e){return s[e]=Object.keys(Oc[e]),s},{}),Hc=null,Zd={},Jd={},Qd={},ep={},tp={};function fM(s){return~Zb.indexOf(s)}function dM(s,e){var t=e.split("-"),n=t[0],i=t.slice(1).join("-");return n===s&&i!==""&&!fM(i)?i:null}var np=function(){var e=function(r){return Ho(yr,function(a,o,l){return a[l]=Ho(o,r,{}),a},{})};Zd=e(function(i,r,a){if(r[3]&&(i[r[3]]=a),r[2]){var o=r[2].filter(function(l){return typeof l=="number"});o.forEach(function(l){i[l.toString(16)]=a})}return i}),Jd=e(function(i,r,a){if(i[a]=a,r[2]){var o=r[2].filter(function(l){return typeof l=="string"});o.forEach(function(l){i[l]=a})}return i}),tp=e(function(i,r,a){var o=r[2];return i[a]=a,o.forEach(function(l){i[l]=a}),i});var t="far"in yr||Ee.autoFetchSvg,n=Ho(uM,function(i,r){var a=r[0],o=r[1],l=r[2];return o==="far"&&!t&&(o="fas"),typeof a=="string"&&(i.names[a]={prefix:o,iconName:l}),typeof a=="number"&&(i.unicodes[a.toString(16)]={prefix:o,iconName:l}),i},{names:{},unicodes:{}});Qd=n.names,ep=n.unicodes,Hc=Ya(Ee.styleDefault,{family:Ee.familyDefault})};tM(function(s){Hc=Ya(s.styleDefault,{family:Ee.familyDefault})});np();function Vc(s,e){return(Zd[s]||{})[e]}function pM(s,e){return(Jd[s]||{})[e]}function Bi(s,e){return(tp[s]||{})[e]}function ip(s){return Qd[s]||{prefix:null,iconName:null}}function mM(s){var e=ep[s],t=Vc("fas",s);return e||(t?{prefix:"fas",iconName:t}:null)||{prefix:null,iconName:null}}function Ei(){return Hc}var sp=function(){return{prefix:null,iconName:null,rest:[]}};function gM(s){var e=Ot,t=Kd.reduce(function(n,i){return n[i]="".concat(Ee.cssPrefix,"-").concat(i),n},{});return Nd.forEach(function(n){(s.includes(t[n])||s.some(function(i){return hM[n].includes(i)}))&&(e=n)}),e}function Ya(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.family,n=t===void 0?Ot:t,i=jb[n][s];if(n===Ar&&!s)return"fad";var r=Nh[n][s]||Nh[n][i],a=s in Tn.styles?s:null,o=r||a||null;return o}function vM(s){var e=[],t=null;return s.forEach(function(n){var i=dM(Ee.cssPrefix,n);i?t=i:n&&e.push(n)}),{iconName:t,rest:e}}function zh(s){return s.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var Bh=Fd.concat(Ud);function qa(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.skipLookups,n=t===void 0?!1:t,i=null,r=zh(s.filter(function(d){return Bh.includes(d)})),a=zh(s.filter(function(d){return!Bh.includes(d)})),o=r.filter(function(d){return i=d,!hd.includes(d)}),l=ja(o,1),c=l[0],u=c===void 0?null:c,h=gM(r),f=ee(ee({},vM(a)),{},{prefix:Ya(u,{family:h})});return ee(ee(ee({},f),bM({values:s,family:h,styles:yr,config:Ee,canonical:f,givenPrefix:i})),_M(n,i,f))}function _M(s,e,t){var n=t.prefix,i=t.iconName;if(s||!n||!i)return{prefix:n,iconName:i};var r=e==="fa"?ip(i):{},a=Bi(n,i);return i=r.iconName||a||i,n=r.prefix||n,n==="far"&&!yr.far&&yr.fas&&!Ee.autoFetchSvg&&(n="fas"),{prefix:n,iconName:i}}var xM=Nd.filter(function(s){return s!==Ot||s!==Ar}),yM=Object.keys(Xl).filter(function(s){return s!==Ot}).map(function(s){return Object.keys(Xl[s])}).flat();function bM(s){var e=s.values,t=s.family,n=s.canonical,i=s.givenPrefix,r=i===void 0?"":i,a=s.styles,o=a===void 0?{}:a,l=s.config,c=l===void 0?{}:l,u=t===Ar,h=e.includes("fa-duotone")||e.includes("fad"),f=c.familyDefault==="duotone",d=n.prefix==="fad"||n.prefix==="fa-duotone";if(!u&&(h||f||d)&&(n.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(n.prefix="fab"),!n.prefix&&xM.includes(t)){var m=Object.keys(o).find(function(g){return yM.includes(g)});if(m||c.autoFetchSvg){var v=T1.get(t).defaultShortPrefixId;n.prefix=v,n.iconName=Bi(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||r==="fa")&&(n.prefix=Ei()||"fas"),n}var MM=(function(){function s(){Vy(this,s),this.definitions={}}return Wy(s,[{key:"add",value:function(){for(var t=this,n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];var a=i.reduce(this._pullDefinitions,{});Object.keys(a).forEach(function(o){t.definitions[o]=ee(ee({},t.definitions[o]||{}),a[o]),Zl(o,a[o]);var l=Oc[Ot][o];l&&Zl(l,a[o]),np()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(t,n){var i=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(i).map(function(r){var a=i[r],o=a.prefix,l=a.iconName,c=a.icon,u=c[2];t[o]||(t[o]={}),u.length>0&&u.forEach(function(h){typeof h=="string"&&(t[o][h]=c)}),t[o][l]=c}),t}}])})(),Hh=[],_s={},bs={},SM=Object.keys(bs);function wM(s,e){var t=e.mixoutsTo;return Hh=s,_s={},Object.keys(bs).forEach(function(n){SM.indexOf(n)===-1&&delete bs[n]}),Hh.forEach(function(n){var i=n.mixout?n.mixout():{};if(Object.keys(i).forEach(function(a){typeof i[a]=="function"&&(t[a]=i[a]),La(i[a])==="object"&&Object.keys(i[a]).forEach(function(o){t[a]||(t[a]={}),t[a][o]=i[a][o]})}),n.hooks){var r=n.hooks();Object.keys(r).forEach(function(a){_s[a]||(_s[a]=[]),_s[a].push(r[a])})}n.provides&&n.provides(bs)}),t}function Jl(s,e){for(var t=arguments.length,n=new Array(t>2?t-2:0),i=2;i<t;i++)n[i-2]=arguments[i];var r=_s[s]||[];return r.forEach(function(a){e=a.apply(null,[e].concat(n))}),e}function $i(s){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++)t[n-1]=arguments[n];var i=_s[s]||[];i.forEach(function(r){r.apply(null,t)})}function Ti(){var s=arguments[0],e=Array.prototype.slice.call(arguments,1);return bs[s]?bs[s].apply(null,e):void 0}function Ql(s){s.prefix==="fa"&&(s.prefix="fas");var e=s.iconName,t=s.prefix||Ei();if(e)return e=Bi(t,e)||e,kh(rp.definitions,t,e)||kh(Tn.styles,t,e)}var rp=new MM,EM=function(){Ee.autoReplaceSvg=!1,Ee.observeMutations=!1,$i("noAuto")},TM={i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return oi?($i("beforeI2svg",e),Ti("pseudoElements2svg",e),Ti("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;Ee.autoReplaceSvg===!1&&(Ee.autoReplaceSvg=!0),Ee.observeMutations=!0,cM(function(){RM({autoReplaceSvgRoot:t}),$i("watch",e)})}},AM={icon:function(e){if(e===null)return null;if(La(e)==="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:Bi(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],n=Ya(e[0]);return{prefix:n,iconName:Bi(n,t)||t}}if(typeof e=="string"&&(e.indexOf("".concat(Ee.cssPrefix,"-"))>-1||e.match($b))){var i=qa(e.split(" "),{skipLookups:!0});return{prefix:i.prefix||Ei(),iconName:Bi(i.prefix,i.iconName)||i.iconName}}if(typeof e=="string"){var r=Ei();return{prefix:r,iconName:Bi(r,e)||e}}}},fn={noAuto:EM,config:Ee,dom:TM,parse:AM,library:rp,findIconDefinition:Ql,toHtml:Cr},RM=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot,n=t===void 0?yt:t;(Object.keys(Tn.styles).length>0||Ee.autoFetchSvg)&&oi&&Ee.autoReplaceSvg&&fn.dom.i2svg({node:n})};function Ka(s,e){return Object.defineProperty(s,"abstract",{get:e}),Object.defineProperty(s,"html",{get:function(){return s.abstract.map(function(n){return Cr(n)})}}),Object.defineProperty(s,"node",{get:function(){if(oi){var n=yt.createElement("div");return n.innerHTML=s.html,n.children}}}),s}function CM(s){var e=s.children,t=s.main,n=s.mask,i=s.attributes,r=s.styles,a=s.transform;if(Bc(a)&&t.found&&!n.found){var o=t.width,l=t.height,c={x:o/l/2,y:.5};i.style=$a(ee(ee({},r),{},{"transform-origin":"".concat(c.x+a.x/16,"em ").concat(c.y+a.y/16,"em")}))}return[{tag:"svg",attributes:i,children:e}]}function IM(s){var e=s.prefix,t=s.iconName,n=s.children,i=s.attributes,r=s.symbol,a=r===!0?"".concat(e,"-").concat(Ee.cssPrefix,"-").concat(t):r;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:ee(ee({},i),{},{id:a}),children:n}]}]}function PM(s){var e=["aria-label","aria-labelledby","title","role"];return e.some(function(t){return t in s})}function Gc(s){var e=s.icons,t=e.main,n=e.mask,i=s.prefix,r=s.iconName,a=s.transform,o=s.symbol,l=s.maskId,c=s.extra,u=s.watchable,h=u===void 0?!1:u,f=n.found?n:t,d=f.width,m=f.height,v=[Ee.replacementClass,r?"".concat(Ee.cssPrefix,"-").concat(r):""].filter(function(E){return c.classes.indexOf(E)===-1}).filter(function(E){return E!==""||!!E}).concat(c.classes).join(" "),g={children:[],attributes:ee(ee({},c.attributes),{},{"data-prefix":i,"data-icon":r,class:v,role:c.attributes.role||"img",viewBox:"0 0 ".concat(d," ").concat(m)})};!PM(c.attributes)&&!c.attributes["aria-hidden"]&&(g.attributes["aria-hidden"]="true"),h&&(g.attributes[ji]="");var p=ee(ee({},g),{},{prefix:i,iconName:r,main:t,mask:n,maskId:l,transform:a,symbol:o,styles:ee({},c.styles)}),y=n.found&&t.found?Ti("generateAbstractMask",p)||{children:[],attributes:{}}:Ti("generateAbstractIcon",p)||{children:[],attributes:{}},b=y.children,_=y.attributes;return p.children=b,p.attributes=_,o?IM(p):CM(p)}function Vh(s){var e=s.content,t=s.width,n=s.height,i=s.transform,r=s.extra,a=s.watchable,o=a===void 0?!1:a,l=ee(ee({},r.attributes),{},{class:r.classes.join(" ")});o&&(l[ji]="");var c=ee({},r.styles);Bc(i)&&(c.transform=aM({transform:i,width:t,height:n}),c["-webkit-transform"]=c.transform);var u=$a(c);u.length>0&&(l.style=u);var h=[];return h.push({tag:"span",attributes:l,children:[e]}),h}function LM(s){var e=s.content,t=s.extra,n=ee(ee({},t.attributes),{},{class:t.classes.join(" ")}),i=$a(t.styles);i.length>0&&(n.style=i);var r=[];return r.push({tag:"span",attributes:n,children:[e]}),r}var Vo=Tn.styles;function ec(s){var e=s[0],t=s[1],n=s.slice(4),i=ja(n,1),r=i[0],a=null;return Array.isArray(r)?a={tag:"g",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(zo.GROUP)},children:[{tag:"path",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(zo.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(Ee.cssPrefix,"-").concat(zo.PRIMARY),fill:"currentColor",d:r[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:e,height:t,icon:a}}var DM={found:!1,width:512,height:512};function NM(s,e){!Hd&&!Ee.showMissingIcons&&s&&console.error('Icon with name "'.concat(s,'" and prefix "').concat(e,'" is missing.'))}function tc(s,e){var t=e;return e==="fa"&&Ee.styleDefault!==null&&(e=Ei()),new Promise(function(n,i){if(t==="fa"){var r=ip(s)||{};s=r.iconName||s,e=r.prefix||e}if(s&&e&&Vo[e]&&Vo[e][s]){var a=Vo[e][s];return n(ec(a))}NM(s,e),n(ee(ee({},DM),{},{icon:Ee.showMissingIcons&&s?Ti("missingIconAbstract")||{}:{}}))})}var Gh=function(){},nc=Ee.measurePerformance&&ra&&ra.mark&&ra.measure?ra:{mark:Gh,measure:Gh},tr='FA "7.3.1"',UM=function(e){return nc.mark("".concat(tr," ").concat(e," begins")),function(){return ap(e)}},ap=function(e){nc.mark("".concat(tr," ").concat(e," ends")),nc.measure("".concat(tr," ").concat(e),"".concat(tr," ").concat(e," begins"),"".concat(tr," ").concat(e," ends"))},Wc={begin:UM,end:ap},_a=function(){};function Wh(s){var e=s.getAttribute?s.getAttribute(ji):null;return typeof e=="string"}function FM(s){var e=s.getAttribute?s.getAttribute(Fc):null,t=s.getAttribute?s.getAttribute(kc):null;return e&&t}function kM(s){return s&&s.classList&&s.classList.contains&&s.classList.contains(Ee.replacementClass)}function OM(){if(Ee.autoReplaceSvg===!0)return xa.replace;var s=xa[Ee.autoReplaceSvg];return s||xa.replace}function zM(s){return yt.createElementNS("http://www.w3.org/2000/svg",s)}function BM(s){return yt.createElement(s)}function op(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=e.ceFn,n=t===void 0?s.tag==="svg"?zM:BM:t;if(typeof s=="string")return yt.createTextNode(s);var i=n(s.tag);Object.keys(s.attributes||[]).forEach(function(a){i.setAttribute(a,s.attributes[a])});var r=s.children||[];return r.forEach(function(a){i.appendChild(op(a,{ceFn:n}))}),i}function HM(s){var e=" ".concat(s.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var xa={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(i){t.parentNode.insertBefore(op(i),t)}),t.getAttribute(ji)===null&&Ee.keepOriginalSource){var n=yt.createComment(HM(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~zc(t).indexOf(Ee.replacementClass))return xa.replace(e);var i=new RegExp("".concat(Ee.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var r=n[0].attributes.class.split(" ").reduce(function(o,l){return l===Ee.replacementClass||l.match(i)?o.toSvg.push(l):o.toNode.push(l),o},{toNode:[],toSvg:[]});n[0].attributes.class=r.toSvg.join(" "),r.toNode.length===0?t.removeAttribute("class"):t.setAttribute("class",r.toNode.join(" "))}var a=n.map(function(o){return Cr(o)}).join(`
`);t.setAttribute(ji,""),t.innerHTML=a}};function Xh(s){s()}function lp(s,e){var t=typeof e=="function"?e:_a;if(s.length===0)t();else{var n=Xh;Ee.mutateApproach===Wb&&(n=wi.requestAnimationFrame||Xh),n(function(){var i=OM(),r=Wc.begin("mutate");s.map(i),r(),t()})}}var Xc=!1;function cp(){Xc=!0}function ic(){Xc=!1}var Na=null;function jh(s){if(Ih&&Ee.observeMutations){var e=s.treeCallback,t=e===void 0?_a:e,n=s.nodeCallback,i=n===void 0?_a:n,r=s.pseudoElementsCallback,a=r===void 0?_a:r,o=s.observeMutationsRoot,l=o===void 0?yt:o;Na=new Ih(function(c){if(!Xc){var u=Ei();Hs(c).forEach(function(h){if(h.type==="childList"&&h.addedNodes.length>0&&!Wh(h.addedNodes[0])&&(Ee.searchPseudoElements&&a(h.target),t(h.target)),h.type==="attributes"&&h.target.parentNode&&Ee.searchPseudoElements&&a([h.target],!0),h.type==="attributes"&&Wh(h.target)&&~Kb.indexOf(h.attributeName))if(h.attributeName==="class"&&FM(h.target)){var f=qa(zc(h.target)),d=f.prefix,m=f.iconName;h.target.setAttribute(Fc,d||u),m&&h.target.setAttribute(kc,m)}else kM(h.target)&&i(h.target)})}}),oi&&Na.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function VM(){Na&&Na.disconnect()}function GM(s){var e=s.getAttribute("style"),t=[];return e&&(t=e.split(";").reduce(function(n,i){var r=i.split(":"),a=r[0],o=r.slice(1);return a&&o.length>0&&(n[a]=o.join(":").trim()),n},{})),t}function WM(s){var e=s.getAttribute("data-prefix"),t=s.getAttribute("data-icon"),n=s.innerText!==void 0?s.innerText.trim():"",i=qa(zc(s));return i.prefix||(i.prefix=Ei()),e&&t&&(i.prefix=e,i.iconName=t),i.iconName&&i.prefix||(i.prefix&&n.length>0&&(i.iconName=pM(i.prefix,s.innerText)||Vc(i.prefix,qd(s.innerText))),!i.iconName&&Ee.autoFetchSvg&&s.firstChild&&s.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=s.firstChild.data)),i}function XM(s){var e=Hs(s.attributes).reduce(function(t,n){return t.name!=="class"&&t.name!=="style"&&(t[n.name]=n.value),t},{});return e}function jM(){return{iconName:null,prefix:null,transform:zn,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function $h(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},t=WM(s),n=t.iconName,i=t.prefix,r=t.rest,a=XM(s),o=Jl("parseNodeAttributes",{},s),l=e.styleParser?GM(s):[];return ee({iconName:n,prefix:i,transform:zn,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:l,attributes:a}},o)}var $M=Tn.styles;function up(s){var e=Ee.autoReplaceSvg==="nest"?$h(s,{styleParser:!1}):$h(s);return~e.extra.classes.indexOf(Gd)?Ti("generateLayersText",s,e):Ti("generateSvgReplacementMutation",s,e)}function YM(){return[].concat(Pn(Ud),Pn(Fd))}function Yh(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!oi)return Promise.resolve();var t=yt.documentElement.classList,n=function(h){return t.add("".concat(Dh,"-").concat(h))},i=function(h){return t.remove("".concat(Dh,"-").concat(h))},r=Ee.autoFetchSvg?YM():hd.concat(Object.keys($M));r.includes("fa")||r.push("fa");var a=[".".concat(Gd,":not([").concat(ji,"])")].concat(r.map(function(u){return".".concat(u,":not([").concat(ji,"])")})).join(", ");if(a.length===0)return Promise.resolve();var o=[];try{o=Hs(s.querySelectorAll(a))}catch{}if(o.length>0)n("pending"),i("complete");else return Promise.resolve();var l=Wc.begin("onTree"),c=o.reduce(function(u,h){try{var f=up(h);f&&u.push(f)}catch(d){Hd||d.name==="MissingIcon"&&console.error(d)}return u},[]);return new Promise(function(u,h){Promise.all(c).then(function(f){lp(f,function(){n("active"),n("complete"),i("pending"),typeof e=="function"&&e(),l(),u()})}).catch(function(f){l(),h(f)})})}function qM(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;up(s).then(function(t){t&&lp([t],e)})}function KM(s){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(e||{}).icon?e:Ql(e||{}),i=t.mask;return i&&(i=(i||{}).icon?i:Ql(i||{})),s(n,ee(ee({},t),{},{mask:i}))}}var ZM=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,i=n===void 0?zn:n,r=t.symbol,a=r===void 0?!1:r,o=t.mask,l=o===void 0?null:o,c=t.maskId,u=c===void 0?null:c,h=t.classes,f=h===void 0?[]:h,d=t.attributes,m=d===void 0?{}:d,v=t.styles,g=v===void 0?{}:v;if(e){var p=e.prefix,y=e.iconName,b=e.icon;return Ka(ee({type:"icon"},e),function(){return $i("beforeDOMElementCreation",{iconDefinition:e,params:t}),Gc({icons:{main:ec(b),mask:l?ec(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:p,iconName:y,transform:ee(ee({},zn),i),symbol:a,maskId:u,extra:{attributes:m,styles:g,classes:f}})})}},JM={mixout:function(){return{icon:KM(ZM)}},hooks:function(){return{mutationObserverCallbacks:function(t){return t.treeCallback=Yh,t.nodeCallback=qM,t}}},provides:function(e){e.i2svg=function(t){var n=t.node,i=n===void 0?yt:n,r=t.callback,a=r===void 0?function(){}:r;return Yh(i,a)},e.generateSvgReplacementMutation=function(t,n){var i=n.iconName,r=n.prefix,a=n.transform,o=n.symbol,l=n.mask,c=n.maskId,u=n.extra;return new Promise(function(h,f){Promise.all([tc(i,r),l.iconName?tc(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(d){var m=ja(d,2),v=m[0],g=m[1];h([t,Gc({icons:{main:v,mask:g},prefix:r,iconName:i,transform:a,symbol:o,maskId:c,extra:u,watchable:!0})])}).catch(f)})},e.generateAbstractIcon=function(t){var n=t.children,i=t.attributes,r=t.main,a=t.transform,o=t.styles,l=$a(o);l.length>0&&(i.style=l);var c;return Bc(a)&&(c=Ti("generateAbstractTransformGrouping",{main:r,transform:a,containerWidth:r.width,iconWidth:r.width})),n.push(c||r.icon),{children:n,attributes:i}}}},QM={mixout:function(){return{layer:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=n.classes,r=i===void 0?[]:i;return Ka({type:"layer"},function(){$i("beforeDOMElementCreation",{assembler:t,params:n});var a=[];return t(function(o){Array.isArray(o)?o.map(function(l){a=a.concat(l.abstract)}):a=a.concat(o.abstract)}),[{tag:"span",attributes:{class:["".concat(Ee.cssPrefix,"-layers")].concat(Pn(r)).join(" ")},children:a}]})}}}},eS={mixout:function(){return{counter:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var i=n.classes,r=i===void 0?[]:i,a=n.attributes,o=a===void 0?{}:a,l=n.styles,c=l===void 0?{}:l;return Ka({type:"counter",content:t},function(){return $i("beforeDOMElementCreation",{content:t,params:n}),LM({content:t.toString(),extra:{attributes:o,styles:c,classes:["".concat(Ee.cssPrefix,"-layers-counter")].concat(Pn(r))}})})}}}},tS={mixout:function(){return{text:function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=n.transform,r=i===void 0?zn:i,a=n.classes,o=a===void 0?[]:a,l=n.attributes,c=l===void 0?{}:l,u=n.styles,h=u===void 0?{}:u;return Ka({type:"text",content:t},function(){return $i("beforeDOMElementCreation",{content:t,params:n}),Vh({content:t,transform:ee(ee({},zn),r),extra:{attributes:c,styles:h,classes:["".concat(Ee.cssPrefix,"-layers-text")].concat(Pn(o))}})})}}},provides:function(e){e.generateLayersText=function(t,n){var i=n.transform,r=n.extra,a=null,o=null;if(cd){var l=parseInt(getComputedStyle(t).fontSize,10),c=t.getBoundingClientRect();a=c.width/l,o=c.height/l}return Promise.resolve([t,Vh({content:t.innerHTML,width:a,height:o,transform:i,extra:r,watchable:!0})])}}},hp=new RegExp('"',"ug"),qh=[1105920,1112319],Kh=ee(ee(ee(ee({},{FontAwesome:{normal:"fas",400:"fas"}}),E1),Vb),N1),sc=Object.keys(Kh).reduce(function(s,e){return s[e.toLowerCase()]=Kh[e],s},{}),nS=Object.keys(sc).reduce(function(s,e){var t=sc[e];return s[e]=t[900]||Pn(Object.entries(t))[0][1],s},{});function iS(s){var e=s.replace(hp,"");return qd(Pn(e)[0]||"")}function sS(s){var e=s.getPropertyValue("font-feature-settings").includes("ss01"),t=s.getPropertyValue("content"),n=t.replace(hp,""),i=n.codePointAt(0),r=i>=qh[0]&&i<=qh[1],a=n.length===2?n[0]===n[1]:!1;return r||a||e}function rS(s,e){var t=s.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(e),i=isNaN(n)?"normal":n;return(sc[t]||{})[i]||nS[t]}function Zh(s,e){var t="".concat(Gb).concat(e.replace(":","-"));return new Promise(function(n,i){if(s.getAttribute(t)!==null)return n();var r=Hs(s.children),a=r.filter(function(T){return T.getAttribute($l)===e})[0],o=wi.getComputedStyle(s,e),l=o.getPropertyValue("font-family"),c=l.match(Yb),u=o.getPropertyValue("font-weight"),h=o.getPropertyValue("content");if(a&&!c)return s.removeChild(a),n();if(c&&h!=="none"&&h!==""){var f=o.getPropertyValue("content"),d=rS(l,u),m=iS(f),v=c[0].startsWith("FontAwesome"),g=sS(o),p=Vc(d,m),y=p;if(v){var b=mM(m);b.iconName&&b.prefix&&(p=b.iconName,d=b.prefix)}if(p&&!g&&(!a||a.getAttribute(Fc)!==d||a.getAttribute(kc)!==y)){s.setAttribute(t,y),a&&s.removeChild(a);var _=jM(),E=_.extra;E.attributes[$l]=e,tc(p,d).then(function(T){var A=Gc(ee(ee({},_),{},{icons:{main:T,mask:sp()},prefix:d,iconName:y,extra:E,watchable:!0})),R=yt.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?s.insertBefore(R,s.firstChild):s.appendChild(R),R.outerHTML=A.map(function(x){return Cr(x)}).join(`
`),s.removeAttribute(t),n()}).catch(i)}else n()}else n()})}function aS(s){return Promise.all([Zh(s,"::before"),Zh(s,"::after")])}function oS(s){return s.parentNode!==document.head&&!~Xb.indexOf(s.tagName.toUpperCase())&&!s.getAttribute($l)&&(!s.parentNode||s.parentNode.tagName!=="svg")}var lS=function(e){return!!e&&Bd.some(function(t){return e.includes(t)})},cS=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(c){return c.trim()})});var i=va(n),r;try{for(i.s();!(r=i.n()).done;){var a=r.value;if(lS(a)){var o=Bd.reduce(function(l,c){return l.replace(c,"")},a);o!==""&&o!=="*"&&t.add(o)}}}catch(l){i.e(l)}finally{i.f()}return t};function Jh(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(oi){var t;if(e)t=s;else if(Ee.searchPseudoElementsFullScan)t=s.querySelectorAll("*");else{var n=new Set,i=va(document.styleSheets),r;try{for(i.s();!(r=i.n()).done;){var a=r.value;try{var o=va(a.cssRules),l;try{for(o.s();!(l=o.n()).done;){var c=l.value,u=cS(c.selectorText),h=va(u),f;try{for(h.s();!(f=h.n()).done;){var d=f.value;n.add(d)}}catch(v){h.e(v)}finally{h.f()}}}catch(v){o.e(v)}finally{o.f()}}catch(v){Ee.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(a.href," (").concat(v.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(v){i.e(v)}finally{i.f()}if(!n.size)return;var m=Array.from(n).join(", ");try{t=s.querySelectorAll(m)}catch{}}return new Promise(function(v,g){var p=Hs(t).filter(oS).map(aS),y=Wc.begin("searchPseudoElements");cp(),Promise.all(p).then(function(){y(),ic(),v()}).catch(function(){y(),ic(),g()})})}}var uS={hooks:function(){return{mutationObserverCallbacks:function(t){return t.pseudoElementsCallback=Jh,t}}},provides:function(e){e.pseudoElements2svg=function(t){var n=t.node,i=n===void 0?yt:n;Ee.searchPseudoElements&&Jh(i)}}},Qh=!1,hS={mixout:function(){return{dom:{unwatch:function(){cp(),Qh=!0}}}},hooks:function(){return{bootstrap:function(){jh(Jl("mutationObserverCallbacks",{}))},noAuto:function(){VM()},watch:function(t){var n=t.observeMutationsRoot;Qh?ic():jh(Jl("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},ef=function(e){var t={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce(function(n,i){var r=i.toLowerCase().split("-"),a=r[0],o=r.slice(1).join("-");if(a&&o==="h")return n.flipX=!0,n;if(a&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(a){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},t)},fS={mixout:function(){return{parse:{transform:function(t){return ef(t)}}}},hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-transform");return i&&(t.transform=ef(i)),t}}},provides:function(e){e.generateAbstractTransformGrouping=function(t){var n=t.main,i=t.transform,r=t.containerWidth,a=t.iconWidth,o={transform:"translate(".concat(r/2," 256)")},l="translate(".concat(i.x*32,", ").concat(i.y*32,") "),c="scale(".concat(i.size/16*(i.flipX?-1:1),", ").concat(i.size/16*(i.flipY?-1:1),") "),u="rotate(".concat(i.rotate," 0 0)"),h={transform:"".concat(l," ").concat(c," ").concat(u)},f={transform:"translate(".concat(a/2*-1," -256)")},d={outer:o,inner:h,path:f};return{tag:"g",attributes:ee({},d.outer),children:[{tag:"g",attributes:ee({},d.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:ee(ee({},n.icon.attributes),d.path)}]}]}}}},Go={x:0,y:0,width:"100%",height:"100%"};function tf(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return s.attributes&&(s.attributes.fill||e)&&(s.attributes.fill="black"),s}function dS(s){return s.tag==="g"?s.children:[s]}var pS={hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-mask"),r=i?qa(i.split(" ").map(function(a){return a.trim()})):sp();return r.prefix||(r.prefix=Ei()),t.mask=r,t.maskId=n.getAttribute("data-fa-mask-id"),t}}},provides:function(e){e.generateAbstractMask=function(t){var n=t.children,i=t.attributes,r=t.main,a=t.mask,o=t.maskId,l=t.transform,c=r.width,u=r.icon,h=a.width,f=a.icon,d=rM({transform:l,containerWidth:h,iconWidth:c}),m={tag:"rect",attributes:ee(ee({},Go),{},{fill:"white"})},v=u.children?{children:u.children.map(tf)}:{},g={tag:"g",attributes:ee({},d.inner),children:[tf(ee({tag:u.tag,attributes:ee(ee({},u.attributes),d.path)},v))]},p={tag:"g",attributes:ee({},d.outer),children:[g]},y="mask-".concat(o||Uh()),b="clip-".concat(o||Uh()),_={tag:"mask",attributes:ee(ee({},Go),{},{id:y,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[m,p]},E={tag:"defs",children:[{tag:"clipPath",attributes:{id:b},children:dS(f)},_]};return n.push(E,{tag:"rect",attributes:ee({fill:"currentColor","clip-path":"url(#".concat(b,")"),mask:"url(#".concat(y,")")},Go)}),{children:n,attributes:i}}}},mS={provides:function(e){var t=!1;wi.matchMedia&&(t=wi.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){var n=[],i={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:ee(ee({},i),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var a=ee(ee({},r),{},{attributeName:"opacity"}),o={tag:"circle",attributes:ee(ee({},i),{},{cx:"256",cy:"364",r:"28"}),children:[]};return t||o.children.push({tag:"animate",attributes:ee(ee({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:ee(ee({},a),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:ee(ee({},i),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:t?[]:[{tag:"animate",attributes:ee(ee({},a),{},{values:"1;0;0;0;0;1;"})}]}),t||n.push({tag:"path",attributes:ee(ee({},i),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:ee(ee({},a),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},gS={hooks:function(){return{parseNodeAttributes:function(t,n){var i=n.getAttribute("data-fa-symbol"),r=i===null?!1:i===""?!0:i;return t.symbol=r,t}}}},vS=[lM,JM,QM,eS,tS,uS,hS,fS,pS,mS,gS];wM(vS,{mixoutsTo:fn});fn.noAuto;fn.config;fn.library;fn.dom;fn.parse;fn.findIconDefinition;fn.toHtml;var _S=fn.icon;fn.layer;fn.text;fn.counter;var xS={prefix:"fas",iconName:"tree",icon:[448,512,[127794],"f1bb","M224-32c7 0 13.7 3.1 18.3 8.5l136 160c6.1 7.1 7.4 17.1 3.5 25.6S369.4 176 360 176l-24.9 0 75.2 88.5c6.1 7.1 7.4 17.1 3.5 25.6S401.4 304 392 304l-38.5 0 88.8 104.5c6.1 7.1 7.4 17.1 3.5 25.6S433.4 448 424 448l-168 0 0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64-168 0c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L94.5 304 56 304c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6L112.9 176 88 176c-9.4 0-17.9-5.4-21.8-13.9s-2.6-18.5 3.5-25.6l136-160C210.3-28.9 217-32 224-32z"]},yS={prefix:"fas",iconName:"apple-whole",icon:[448,512,[127822,127823,"apple-alt"],"f5d1","M224 112c-8.8 0-16-7.2-16-16l0-16c0-44.2 35.8-80 80-80l16 0c8.8 0 16 7.2 16 16l0 16c0 44.2-35.8 80-80 80l-16 0zM0 288c0-76.3 35.7-160 112-160 27.3 0 59.7 10.3 82.7 19.3 18.8 7.3 39.9 7.3 58.7 0 22.9-8.9 55.4-19.3 82.7-19.3 76.3 0 112 83.7 112 160 0 128-80 224-160 224-16.5 0-38.1-6.6-51.5-11.3-8.1-2.8-16.9-2.8-25 0-13.4 4.7-35 11.3-51.5 11.3-80 0-160-96-160-224z"]},bS={prefix:"fas",iconName:"heart",icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"]},MS={prefix:"fas",iconName:"mountain",icon:[512,512,[127956],"f6fc","M256.5 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5-7.2 12.1-20.3 19.5-34.3 19.5l-432 0c-14.1 0-27.1-7.4-34.3-19.5s-7.5-27.1-.8-39.5l216-400 2.9-4.6C231.7 6.2 243.6 0 256.5 0zM170.4 249.9l26.8 26.8c6.2 6.2 16.4 6.2 22.6 0l43.3-43.3c6-6 14.1-9.4 22.6-9.4l42.8 0-72.1-133.5-86.1 159.4z"]},fp={prefix:"fas",iconName:"seedling",icon:[512,512,[127793,"sprout"],"f4d8","M512 32C512 140.1 435.4 230.3 333.6 251.4 325.7 193.3 299.6 141 261.1 100.5 301.2 40 369.9 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 192c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z"]},SS={prefix:"fas",iconName:"users",icon:[640,512,[],"f0c0","M320 16a104 104 0 1 1 0 208 104 104 0 1 1 0-208zM96 88a72 72 0 1 1 0 144 72 72 0 1 1 0-144zM0 416c0-70.7 57.3-128 128-128 12.8 0 25.2 1.9 36.9 5.4-32.9 36.8-52.9 85.4-52.9 138.6l0 16c0 11.4 2.4 22.2 6.7 32L32 480c-17.7 0-32-14.3-32-32l0-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32l0-16c0-53.2-20-101.8-52.9-138.6 11.7-3.5 24.1-5.4 36.9-5.4 70.7 0 128 57.3 128 128l0 32c0 17.7-14.3 32-32 32l-86.7 0zM472 160a72 72 0 1 1 144 0 72 72 0 1 1 -144 0zM160 432c0-88.4 71.6-160 160-160s160 71.6 160 160l0 16c0 17.7-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32l0-16z"]},Wo={prefix:"fas",iconName:"utensils",icon:[512,512,[127860,61685,"cutlery"],"f2e7","M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"]},wS={prefix:"fas",iconName:"crown",icon:[576,512,[128081],"f521","M313 87.2c9.2-7.3 15-18.6 15-31.2 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 12.6 5.9 23.9 15 31.2L194.6 194.8c-10 15.7-31.3 19.6-46.2 8.4L88.9 158.7c4.5-6.4 7.1-14.3 7.1-22.7 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 21.8 17.5 39.6 39.2 40L87.8 393.5c4.7 31.3 31.6 54.5 63.3 54.5l273.8 0c31.7 0 58.6-23.2 63.3-54.5L520.8 176c21.7-.4 39.2-18.2 39.2-40 0-22.1-17.9-40-40-40s-40 17.9-40 40c0 8.4 2.6 16.3 7.1 22.7l-59.4 44.6c-14.9 11.2-36.2 7.3-46.2-8.4L313 87.2z"]},ES={prefix:"fas",iconName:"box-open",icon:[640,512,[],"f49e","M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"]},nf={prefix:"fas",iconName:"wheat-awn",icon:[576,512,["wheat-alt"],"e2cd","M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z"]},TS={prefix:"fas",iconName:"circle-question",icon:[512,512,[62108,"question-circle"],"f059","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm0-336c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]},AS={prefix:"fas",iconName:"fish",icon:[576,512,[128031],"f578","M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8 4.7 9.2 4.7 20.1 0 29.3-14.1 27.4-41.9 66.8-81 99.8-39.2 33.1-92 61.5-155.5 61.5s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9s-12.4-26-5.3-38.6L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},RS={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"]},CS={prefix:"fas",iconName:"rotate-left",icon:[512,512,["rotate-back","rotate-backward","undo-alt"],"f2ea","M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z"]},IS={prefix:"fas",iconName:"mug-hot",icon:[576,512,[9749],"f7b6","M152-16c-13.3 0-24 10.7-24 24 0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C183.5 31.7 176 24.1 176 8 176-5.3 165.3-16 152-16zM96 192c-17.7 0-32 14.3-32 32l0 192c0 53 43 96 96 96l192 0c41.8 0 77.4-26.7 90.5-64l5.5 0c70.7 0 128-57.3 128-128S518.7 192 448 192L96 192zM448 384l0-128c35.3 0 64 28.7 64 64s-28.7 64-64 64zM288 8c0-13.3-10.7-24-24-24S240-5.3 240 8c0 38.9 23.4 59.4 39.1 73.1l1.1 1c16.3 14.3 23.8 21.8 23.8 37.9 0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C295.5 31.7 288 24.1 288 8z"]},PS={prefix:"fas",iconName:"route",icon:[512,512,[],"f4d7","M512 96c0 50.2-59.1 125.1-84.6 155-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8 6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96 0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8-25.2-27.4-85-97.9-85-148.4 0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]};const LS={wood:xS,stone:MS,fish:AS,berry:yS,wheat:nf,farm:nf,food:Wo,people:SS,happy:bS,crest:wS,help:TS,reset:CS,rest:IS,carry:ES,full:RS,garden:fp,eat:Wo,hungry:Wo,search:PS},hn=s=>_S(LS[s]??fp,{attributes:{"aria-hidden":"true"}}).html.join("");class DS{camera=new Tr(-8,8,5,-5,.1,80);element;target=new I(0,.12,0);desiredTarget=new I(0,.12,0);offset=new I;spherical=new i0;right=new I;forward=new I;up=new I(0,1,0);distance=20;yaw=Math.PI/4;desiredYaw=Math.PI/4;pitch=.86;desiredPitch=.86;desiredZoom=1;halfHeight=3.5;desiredHalfHeight=3.5;viewportWidth=1280;shiftFraction=0;islandRadius=2.8;islandCenter=new I(0,.3,0);frameIsland(e,t=!1){if(!e.length)return;const n=e.map(r=>r.x),i=e.map(r=>r.z);this.islandCenter.set((Math.min(...n)+Math.max(...n))/2,.3,(Math.min(...i)+Math.max(...i))/2),this.islandRadius=Math.max(...e.map(r=>Math.hypot(r.x-this.islandCenter.x,r.z-this.islandCenter.z)))+2.65,this.distance=Math.max(20,this.islandRadius*3),this.camera.far=this.distance+this.islandRadius*3+40,this.desiredTarget.copy(this.islandCenter),this.resize(this.viewportWidth,this.viewportHeight),t&&(this.target.copy(this.desiredTarget),this.halfHeight=this.desiredHalfHeight,this.applyProjection(),this.applyTransform())}applyProjection(){const e=this.viewportWidth/this.viewportHeight,t=this.shiftFraction*this.halfHeight;Object.assign(this.camera,{left:-this.halfHeight*e,right:this.halfHeight*e,top:this.halfHeight+t,bottom:-this.halfHeight+t}),this.camera.updateProjectionMatrix()}viewportHeight=900;placement=!1;pointer=null;disposed=!1;cleanup=new AbortController;constructor(e){this.element=e,this.camera.zoom=1;const t=this.cleanup.signal;e.addEventListener("pointerdown",this.onPointerDown,{signal:t}),e.addEventListener("pointermove",this.onPointerMove,{signal:t}),e.addEventListener("pointerup",this.onPointerUp,{signal:t}),e.addEventListener("pointercancel",this.onPointerUp,{signal:t}),e.addEventListener("lostpointercapture",this.onPointerUp,{signal:t}),e.addEventListener("wheel",this.onWheel,{passive:!1,signal:t}),e.addEventListener("contextmenu",this.onContextMenu,{signal:t}),window.addEventListener("keydown",this.onKeyDown,{signal:t}),window.addEventListener("blur",this.onBlur,{signal:t}),this.resize(e.clientWidth||1280,e.clientHeight||900),this.applyTransform()}resize(e,t){const n=Math.max(1,e),i=Math.max(1,t),r=n/i,a=n<700?100:85,o=n<700?205:i<760?190:225,l=Math.max(i*.43,i-a-o);this.viewportWidth=n,this.viewportHeight=i,this.desiredHalfHeight=Math.max(this.islandRadius/(r*.9),(this.islandRadius*.68+.61)*i/l),this.shiftFraction=(a-o)/i,this.applyProjection()}update(e){if(this.disposed)return;const t=Math.min(Math.max(e,0),.1),n=1-Math.exp(-11*t),i=1-Math.exp(-12*t);!this.placement&&Math.abs(this.halfHeight-this.desiredHalfHeight)>1e-4&&(this.halfHeight=Ze.lerp(this.halfHeight,this.desiredHalfHeight,n),this.applyProjection()),this.yaw=Ze.lerp(this.yaw,this.desiredYaw,n),this.pitch=Ze.lerp(this.pitch,this.desiredPitch,n),this.target.lerp(this.desiredTarget,n);const r=Ze.lerp(this.camera.zoom,this.desiredZoom,i);Math.abs(r-this.camera.zoom)>1e-6&&(this.camera.zoom=r,this.camera.updateProjectionMatrix()),this.applyTransform()}setPlacement(e){this.placement=e,e&&(this.releasePointer(),this.desiredYaw=this.yaw,this.desiredPitch=this.pitch,this.desiredTarget.copy(this.target),this.desiredZoom=this.camera.zoom)}reset(){this.releasePointer(),this.desiredTarget.copy(this.islandCenter),this.desiredYaw=Math.PI/4,this.desiredPitch=.86,this.desiredZoom=1}dispose(){this.disposed=!0,this.releasePointer(),this.cleanup.abort()}applyTransform(){this.spherical.set(this.distance,this.pitch,this.yaw),this.offset.setFromSpherical(this.spherical),this.camera.position.copy(this.target).add(this.offset),this.camera.lookAt(this.target),this.camera.updateMatrixWorld()}onPointerDown=e=>{this.placement||e.pointerType==="touch"||e.button!==1&&e.button!==2||e.target instanceof HTMLElement&&e.target.closest("button, input, dialog, [data-card]")||(e.preventDefault(),this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,pan:e.button===1||e.shiftKey},this.element.setPointerCapture(e.pointerId),this.element.style.cursor="grabbing")};onPointerMove=e=>{if(!this.pointer||e.pointerId!==this.pointer.id)return;const t=e.clientX-this.pointer.x,n=e.clientY-this.pointer.y;if(this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.pan){const i=2*this.halfHeight/(this.viewportHeight*this.desiredZoom);this.right.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),this.forward.crossVectors(this.up,this.right),this.desiredTarget.addScaledVector(this.right,-t*i*.8),this.desiredTarget.addScaledVector(this.forward,n*i*.8);const r=Math.hypot(this.desiredTarget.x-this.islandCenter.x,this.desiredTarget.z-this.islandCenter.z);r>.85&&(this.desiredTarget.x=this.islandCenter.x+(this.desiredTarget.x-this.islandCenter.x)*.85/r,this.desiredTarget.z=this.islandCenter.z+(this.desiredTarget.z-this.islandCenter.z)*.85/r)}else this.desiredYaw-=t*.0035,this.desiredPitch=Ze.clamp(this.desiredPitch-n*.0025,.7,1.02)};onPointerUp=e=>{this.pointer?.id===e.pointerId&&this.releasePointer()};releasePointer(){const e=this.pointer;this.pointer=null,e&&this.element.hasPointerCapture(e.id)&&this.element.releasePointerCapture(e.id),this.element.style.cursor=""}onWheel=e=>{if(e.preventDefault(),this.placement)return;const t=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?this.viewportHeight:1);this.desiredZoom=Ze.clamp(this.desiredZoom*Math.exp(-t*.001),.7,2.6)};onContextMenu=e=>e.preventDefault();onBlur=()=>this.releasePointer();onKeyDown=e=>{e.key.toLowerCase()!=="h"||e.ctrlKey||e.altKey||e.metaKey||this.placement||document.querySelector("dialog[open]")||e.target instanceof HTMLElement&&(e.target.isContentEditable||e.target.closest("input, textarea, select"))||this.reset()}}const Ua=.45,zi=1.5,ca=1.05,Zs=1.85;function Mn(s,e,t){const n=Math.max(0,Math.min(1,(s-e)/(t-e)));return n*n*(3-2*n)}const jc=.1,$c=1.25,dp=1.4,st=.13,ti=-.18,NS=new fe("#80ac71"),US=new fe("#b8c982");function FS(s,e,t){const n=.5+.23*Math.sin(s*.94+e*.47)+.16*Math.cos(e*1.27-s*.52)+.09*Math.sin(s*1.8-e*.98);return t.copy(NS).lerp(US,Ze.smoothstep(n,.1,.9))}const sf=Si*Math.cos(Math.PI/6);function ya(s,e){const t=tn(s).map(h=>!e.has(h));function n(h,f,d){const m=(h+5)%6,v=h%6,g=m*Math.PI/3,p=v*Math.PI/3,y=sf+(t[m]?f:0),b=sf+(t[v]?f:0),_=Math.sin(p-g);return new I((y*Math.sin(p)-b*Math.sin(g))/_,d,(Math.cos(g)*b-Math.cos(p)*y)/_)}const i=rt(s),r=[],a=[],o=(h,f,d,m,v=1)=>{const g=new fe(m).multiplyScalar(v);for(const p of[h,f,d])r.push(p.x,p.y,p.z),(m===10795903||m===9546604)&&(FS(i.x+p.x,i.z+p.z,g),p.y<st&&g.multiplyScalar(.89)),a.push(g.r,g.g,g.b)},l=[[-.095,st],[-.035,.074],[.05,-.016],[.15,-.16],[.28,-.37],[.42,-.58]],c=[9546604,11057024,14469014,15257502,14140311];for(let h=0;h<6;h++){const f=l.map(([d,m])=>{const v=n(h,d,m),g=n(h+1,d,m);return Array.from({length:5},(p,y)=>{const b=y/4,_=v.clone().lerp(g,b);if(t[h]&&y>0&&y<4){const E=.025*Math.sin(s*.61+h*2.8+b*Math.PI*2)*Math.sin(b*Math.PI);_.x+=Math.cos(h*Math.PI/3)*E,_.z+=Math.sin(h*Math.PI/3)*E}return _})});for(let d=0;d<4;d++)if(o(new I(0,st,0),f[0][d+1],f[0][d],10795903,1+.009*Math.sin(h+d+s)),!!t[h])for(let m=0;m<l.length-1;m++){const[v,g,p,y]=[f[m][d],f[m][d+1],f[m+1][d],f[m+1][d+1]],b=1+.035*Math.sin(s+h*1.7+d);o(v,g,p,c[m],b),o(p,g,y,c[m],b+.01)}}const u=new At;return u.setAttribute("position",new nt(r,3)),u.setAttribute("color",new nt(a,3)),u.computeVertexNormals(),u}const pp={value:0};function kS(s){const e=new Le,t=rt(s);e.position.set(t.x,st,t.z);const n=[],i=[];function r(l,c){n.push(...l);const u=new fe(c);for(let h=0;h<3;h++)i.push(u.r,u.g,u.b)}for(let l=0;l<42;l++){const c=l*2.399+s*.44,u=.56+Math.random()*.15,h=Math.cos(c)*u,f=Math.sin(c)*u,d=p=>{const y=Math.sin(s*17.31+l*71.13+p*29.7)*43758.5453;return y-Math.floor(y)},m=3+Math.floor(d(0)*4),v=d(1)*Math.PI*2,g=[7575134,8824939,10205563,11651210,8365420];for(let p=0;p<m;p++){const y=v+(d(p+2)-.5)*2.4,b=Math.cos(y),_=Math.sin(y),E=h+(d(p+20)-.5)*.06,T=f+(d(p+40)-.5)*.06,A=.035+d(p+60)*.07,R=.009+d(p+80)*.008,x=.012+d(p+100)*.035,S=E+b*x*.3,P=T+_*x*.3,F=E+b*x,z=T+_*x,V=g[Math.floor(d(p+120)*g.length)];r([E-_*R,.004,T+b*R,E+_*R,.004,T-b*R,S+_*R*.55,A*.55,P-b*R*.55],V),r([E-_*R,.004,T+b*R,S+_*R*.55,A*.55,P-b*R*.55,S-_*R*.55,A*.55,P+b*R*.55],V),r([S-_*R*.55,A*.55,P+b*R*.55,S+_*R*.55,A*.55,P-b*R*.55,F,A,z],V)}if(l%4===0&&r([h-.025,.054,f+.012,h+.027,.053,f,h,.083,f-.014],l%2?16045456:15854533),l%5===0){const p=ur(l%6,.05);r([h-.045,.005,f,h+p.x,.029,f+p.z,h+.065,.006,f+.034],13156769)}}const a=new At;a.setAttribute("position",new nt(n,3)),a.setAttribute("color",new nt(i,3)),a.computeVertexNormals();const o=new Cc({vertexColors:!0,side:Yt});return o.onBeforeCompile=l=>{l.uniforms.grassTime=pp,l.vertexShader=`uniform float grassTime;
`+l.vertexShader,l.vertexShader=l.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
    float phase=position.x*31.0+position.z*23.0;
    float bend=sin(grassTime*1.8+phase)*0.18+sin(grassTime*2.7+phase*1.7)*0.09;
    transformed.x+=bend*position.y;transformed.z+=cos(grassTime*1.6+phase)*position.y*0.12;`)},o.customProgramCacheKey=()=>"meadow-wind",e.add(new Ke(a,o)),e}const pi=7,rf=3.8,Vt=256,ba=(s,e,t)=>{const n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)};class af{pixels=new Uint8Array(Vt*Vt*4);texture=new za(this.pixels,Vt,Vt,sn);region=new et;constructor(){this.texture.minFilter=this.texture.magFilter=Kt,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}rebuild(e,t,n){const i=t.flatMap(m=>[m.ax,m.bx]),r=t.flatMap(m=>[m.az,m.bz]),a=n?.x??Math.min(...i)-pi,o=n?.y??Math.min(...r)-pi;n?this.region.copy(n):this.region.set(a,o,Math.max(...i)-a+pi,Math.max(...r)-o+pi);const l=t.map(m=>{const v=m.bx-m.ax,g=m.bz-m.az;return{...m,dx:v,dz:g,inv:1/(v*v+g*g)}}),c=this.region.z/Vt,u=this.region.w/Vt,h=16,f=Math.hypot(c,u)*h*.5;function d(m,v,g){const p=v-m.ax,y=g-m.az,b=Math.max(0,Math.min(1,(p*m.dx+y*m.dz)*m.inv)),_=p-b*m.dx,E=y-b*m.dz;return _*_+E*E}for(let m=0;m<Vt;m+=h)for(let v=0;v<Vt;v+=h){const g=a+(v+h/2)*c,p=o+(m+h/2)*u,y=l.map(E=>d(E,g,p)),b=Math.min(pi+f,Math.sqrt(Math.min(...y))+2*f),_=l.filter((E,T)=>y[T]<=b*b);for(let E=m;E<m+h;E++)for(let T=v;T<v+h;T++){const A=a+(T+.5)*c,R=o+(E+.5)*u;let x=pi*pi;for(const j of _)x=Math.min(x,d(j,A,R));const S=Math.sqrt(x)*(e.has(Wt(A,R))?-1:1),P=.5+.25*Math.sin(A*.79+R*.36)+.18*Math.cos(R*.94-A*.51)+.07*Math.sin(A*1.41-R*.88),F=ba(.18,2.2+2.3*P,S),z=.31+.23*ba(.24,1.65,S)+F*(1.15+.43*(1-P))+1.55*ba(2.9,6.9,S),V=Math.round(65535*Math.max(0,Math.min(1,(S+1)/(pi+1)))),W=(E*Vt+T)*4;this.pixels[W]=V>>8,this.pixels[W+1]=V&255,this.pixels[W+2]=Math.round(255*Math.min(z/rf,1)),this.pixels[W+3]=255}}this.texture.needsUpdate=!0}depthAt(e,t){const n=Math.max(0,Math.min(Vt-1,(e-this.region.x)/this.region.z*Vt-.5)),i=Math.max(0,Math.min(Vt-1,(t-this.region.y)/this.region.w*Vt-.5)),r=Math.floor(n),a=Math.floor(i),o=Math.min(r+1,Vt-1),l=Math.min(a+1,Vt-1),c=(u,h)=>this.pixels[(h*Vt+u)*4+2]*rf/255;return Ze.lerp(Ze.lerp(c(r,a),c(o,a),n-r),Ze.lerp(c(r,l),c(o,l),n-r),i-a)}}function OS(){const t=new Uint8Array(589824);let n=70816;const i=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),r=Array.from({length:64},()=>[.15+.7*i(),.15+.7*i()]),a=2*Math.PI;for(let l=0;l<384;l++)for(let c=0;c<384;c++){const u=(c+.5)/384,h=(l+.5)/384,f=u*8,d=h*8,m=Math.floor(f),v=Math.floor(d);let g=10,p=10,y=10;for(let _=-1;_<=1;_++)for(let E=-1;E<=1;E++){const T=r[(v+_+8)%8*8+(m+E+8)%8],A=m+E+T[0]-f,R=v+_+T[1]-d,x=A*A+R*R;x<g?(y=p,p=g,g=x):x<p?(y=p,p=x):x<y&&(y=x)}const b=(l*384+c)*4;t[b]=255*Math.min(1,Math.sqrt(p)-Math.sqrt(g)),t[b+1]=255*(1-ba(.015,.35,Math.sqrt(y)-Math.sqrt(g))),t[b+2]=255*(.5+.21*Math.sin(a*(2*u+h)+.9*Math.sin(a*h))+.16*Math.cos(a*(u-2*h))+.09*Math.sin(a*(3*h-u)+.7)),t[b+3]=255*(.5+.22*Math.cos(a*(h-u)+.7*Math.cos(a*u))+.14*Math.sin(a*(u+2*h)+1.3)+.09*Math.cos(a*(3*u+h)))}const o=new za(t,384,384,sn);return o.wrapS=o.wrapT=Vi,o.minFilter=kn,o.magFilter=Kt,o.generateMipmaps=!0,o.needsUpdate=!0,o}const mp=`
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
`,gp=`
vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8), d=vec2(5.2,2.1);
  float pa=dot(p,a)-uTime*1.05, pb=dot(p,b)+uTime*.81;
  float pc=dot(p,c)-uTime*1.47, pd=dot(p,d)+uTime*1.92;
  float height=.027*sin(pa)+.016*sin(pb)+.007*sin(pc)+.003*sin(pd);
  vec2 gradient=.027*cos(pa)*a+.016*cos(pb)*b+.007*cos(pc)*c+.003*cos(pd)*d;
  return vec3(height,gradient);
}
`,zS=`
uniform float uTime;
`+gp+`
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=seaWave(p).x;
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`,BS=mp+gp+`
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
}`,HS=`
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
`,Nn=100,of=Ze.lerp;class VS{root=new Le;field=new af;previousField=new af;previousBoard=new Map;transitionAt=-10;transitionStart=Ua;transitionEnd=zi;pendingEdges=null;uniforms={uWakes:{value:Array.from({length:12},()=>new et(0,0,-10,0))},uWakeDirs:{value:Array.from({length:12},()=>new et(1,0,0,0))},uCoastMix:{value:1},uPreviousCoast:{value:this.previousField.texture},uTime:{value:0},uLight:{value:OS()},uCoast:{value:this.field.texture},uRegion:{value:this.field.region},uLanding:{value:new I(0,0,-10)},uMint:{value:new fe("#87efd4")},uTurquoise:{value:new fe("#20d0c6")},uLagoon:{value:new fe("#22b7c7")},uDeep:{value:new fe("#318fc4")}};nextWake=0;sandGeometry=new Xi(1,1,Nn,Nn).rotateX(-Math.PI/2);sandStart=new nt(new Float32Array((Nn+1)**2),1);sandStartTint=new nt(new Float32Array((Nn+1)**2*3),3);sandTint=new nt(new Float32Array((Nn+1)**2*3),3);stones;surface;silhouettes=new wr(1,0);constructor(){const e=new Ke(new Xi(160,160,180,180),new si({uniforms:this.uniforms,vertexShader:zS,fragmentShader:BS,transparent:!0,depthWrite:!1,toneMapped:!1}));this.surface=e,e.rotation.x=-Math.PI/2,e.position.y=ti,e.renderOrder=2,this.sandGeometry.setAttribute("color",this.sandTint),this.sandGeometry.setAttribute("aBedStart",this.sandStart),this.sandGeometry.setAttribute("aTintStart",this.sandStartTint);const t=new Ke(this.sandGeometry,this.receiver(!0));t.receiveShadow=!0,this.stones=new Ec(this.silhouettes,this.receiver(!1),192),this.stones.count=0,this.stones.receiveShadow=!0,this.root.add(t,this.stones,e)}receiver(e){const t=new Cc({color:16777215,vertexColors:e,transparent:e,depthWrite:!e});return t.onBeforeCompile=n=>{n.uniforms.uLight=this.uniforms.uLight,n.uniforms.uTime=this.uniforms.uTime,n.uniforms.uWakes=this.uniforms.uWakes,n.uniforms.uWakeDirs=this.uniforms.uWakeDirs,n.uniforms.uLanding=this.uniforms.uLanding,n.vertexShader=`varying vec3 vReceiver;
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
`+mp+`
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
`+HS+(e?`
diffuseColor.a *= 1. - smoothstep(.65, 1.65, max(0., -.18-vReceiver.y));`:""))},t.customProgramCacheKey=()=>e?"lagoon-sand-disturbance-v3":"lagoon-rock-disturbance-v3",t}sync(e,t,n,i=-1){this.field.rebuild(e,t),this.surface.position.x=this.field.region.x+this.field.region.z/2,this.surface.position.z=this.field.region.y+this.field.region.w/2,this.surface.scale.setScalar(Math.max(1,this.field.region.z/70,this.field.region.w/70));const r=n>=0?n:i,a=r>=0&&this.previousBoard.size>0;if(this.transitionStart=i>=0?jc:Ua,this.transitionEnd=i>=0?$c:zi,this.previousField.rebuild(a?this.previousBoard:e,a?ua(this.previousBoard):t,this.field.region),this.uniforms.uCoastMix.value=a?0:1,this.transitionAt=a?this.uniforms.uTime.value:-10,this.shapeBed(),a?this.pendingEdges=t:(this.placeStones(t),this.pendingEdges=null),this.previousBoard=new Map(e),r>=0){const o=rt(r);this.uniforms.uLanding.value.set(o.x,o.z,this.uniforms.uTime.value)}else this.uniforms.uLanding.value.z=-10}shapeBed(){const e=this.field.region,t=this.sandGeometry.getAttribute("position"),n=new fe("#d4cc9e"),i=new fe("#79b8aa"),r=new fe("#467f87"),a=new fe;for(let o=0;o<=Nn;o++)for(let l=0;l<=Nn;l++){const c=e.x+e.z*l/Nn,u=e.y+e.w*o/Nn,h=o*(Nn+1)+l,f=this.field.depthAt(c,u),d=this.previousField.depthAt(c,u);this.sandStart.setX(h,ti-d),a.copy(n).lerp(i,Ze.smoothstep(d,.28,1.1)).lerp(r,Ze.smoothstep(d,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+u*.83)+.02*Math.cos(c*1.88-u*3.2)),this.sandStartTint.setXYZ(h,a.r,a.g,a.b),t.setXYZ(h,c,ti-f,u),a.copy(n).lerp(i,Ze.smoothstep(f,.28,1.1)).lerp(r,Ze.smoothstep(f,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+u*.83)+.02*Math.cos(c*1.88-u*3.2)),this.sandTint.setXYZ(h,a.r,a.g,a.b)}t.needsUpdate=!0,this.sandTint.needsUpdate=!0,this.sandStart.needsUpdate=!0,this.sandStartTint.needsUpdate=!0,this.sandGeometry.computeVertexNormals(),this.sandGeometry.computeBoundingSphere()}placeStones(e){const t=new vt,n=new fe("#99a590"),i=new fe("#467c85"),r=new fe;let a=0;for(const o of e){let l=Math.imul(o.id+1,127)+o.side*317;const c=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296),u=.18+c()*.64,h=.43+c()*.51,f=Math.cos(o.side*Math.PI/3),d=Math.sin(o.side*Math.PI/3),m=.075+c()*.074,v=c()<.33?1:3;for(let g=0;g<v&&a<this.stones.instanceMatrix.count;g++){const p=u+(c()-.5)*.25,y=h+g*.075,b=of(o.ax,o.bx,p)+f*y,_=of(o.az,o.bz,p)+d*y,E=this.field.depthAt(b,_),T=m/(1+g*.64);t.position.set(b,ti-E+T*.25,_),t.rotation.set(c()*.32,c()*6.28,c()*.26),t.scale.set(T*(1.25+c()*.45),T*(.6+c()*.18),T),t.updateMatrix(),this.stones.setMatrixAt(a,t.matrix),r.copy(n).lerp(i,Ze.smoothstep(E,.31,1.03)*.84+.09).multiplyScalar(.88+c()*.2),this.stones.setColorAt(a++,r)}}this.stones.count=a,this.stones.instanceMatrix.needsUpdate=!0,this.stones.instanceColor&&(this.stones.instanceColor.needsUpdate=!0),this.stones.computeBoundingSphere()}stir(e,t,n,i,r,a){const o=this.nextWake;this.nextWake=(o+1)%12,this.uniforms.uWakes.value[o].set(e,t,this.uniforms.uTime.value,.15+.85*r),this.uniforms.uWakeDirs.value[o].set(n,i,Math.min(a,1.2),(this.uniforms.uTime.value*1.37+o*.618)%1)}clearWakes(){for(const e of this.uniforms.uWakes.value)e.set(0,0,-10,0)}update(e){this.uniforms.uTime.value=e,this.uniforms.uCoastMix.value=Mn(e-this.transitionAt,this.transitionStart,this.transitionEnd),this.pendingEdges&&this.uniforms.uCoastMix.value>=1&&(this.placeStones(this.pendingEdges),this.pendingEdges=null)}}function GS(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new At;let c=0;for(let u=0;u<s.length;++u){const h=s[u];let f=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in h.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(h.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in h.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(h.morphAttributes[d])}if(e){let d;if(t)d=h.index.count;else if(h.attributes.position!==void 0)d=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,u),c+=d}}if(t){let u=0;const h=[];for(let f=0;f<s.length;++f){const d=s[f].index;for(let m=0;m<d.count;++m)h.push(d.getX(m)+u);u+=s[f].attributes.position.count}l.setIndex(h)}for(const u in r){const h=lf(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in a){const h=a[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let f=0;f<h;++f){const d=[];for(let v=0;v<a[u].length;++v)d.push(a[u][v][f]);const m=lf(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(m)}}return l}function lf(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const u=s[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const a=new e(r),o=new Ft(a,t,n);let l=0;for(let c=0;c<s.length;++c){const u=s[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let f=0,d=u.count;f<d;f++)for(let m=0;m<t;m++){const v=u.getComponent(f,m);o.setComponent(f+h,m,v)}}else a.set(u.array,l);l+=u.count*t}return i!==void 0&&(o.gpuType=i),o}function cf(s,e){if(e===dm)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Fl||e===Nf){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===Fl)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}const Xo=new Map,Ms=new Map;function WS(s){return Xo.has(s)||Xo.set(s,new Hn({color:s,roughness:.95,flatShading:!0})),Xo.get(s)}function ft(s,e,t,n=0,i=0,r=0){const a=new Ke(e,WS(t));return a.position.set(n,i,r),a.castShadow=!0,a.receiveShadow=!0,s.add(a),a}function Fe(s,e,t,n,i,r,a,o){const l=`b${r},${a},${o}`;return Ms.has(l)||Ms.set(l,new Fs(r,a,o)),ft(s,Ms.get(l),e,t,n,i)}function xt(s,e,t,n,i,r){const a=`s${r}`;return Ms.has(a)||Ms.set(a,new wr(r,0)),ft(s,Ms.get(a),e,t,n,i)}function lr(s,e,t,n=0,i=1){const r=new Le;r.position.set(e,0,t),r.scale.setScalar(i),s.add(r);const a=n%10,o=.65+a%3*.1;ft(r,new kt(.035,.065,o,6),a%2?8413252:7360823,0,o/2,0);const l=[4683098,7575146,5670248,9152110,3761744,6788189,6654069,9742960,5011794,8232281];if(a<4)for(let c=0;c<3+a%2;c++)ft(r,new an(.29-c*.047,.46,6+a),l[(a+c)%10],0,o*.65+c*.2,0);else if(a<8)for(let c=0;c<4;c++){const u=c*2.4,h=xt(r,l[(a+c)%10],Math.cos(u)*.15,o+.12+c*.065,Math.sin(u)*.13,.26+a%2*.035);h.scale.y=a===7?1.5:1}else for(let c=0;c<3;c++)xt(r,l[a],(c-1)*.13,o+c*.17,0,.25).scale.set(.85,1.3,.85)}const uf=new Map;function vp(s){const e=uf.get(s);if(e)return e.clone();const t=new Le;if(s==="wood")for(let n=0;n<3;n++){const i=new Le;i.position.set((n%2-.5)*.065,.035+Math.floor(n/2)*.058,0),t.add(i);const r=ft(i,new kt(.035,.035,.22,8),8937532);r.rotation.x=Math.PI/2;for(const a of[-.112,.112]){const o=ft(i,new Sr(.028,8),14070140,0,0,a);o.rotation.y=a<0?Math.PI:0}}else if(s==="fish")for(let n=0;n<2;n++){const i=new Le;i.position.set((n-.5)*.065,.035,0),xt(i,9419199,0,0,0,.065).scale.set(.45,.5,1.4);const a=ft(i,new an(.034,.052,3),5803675,0,0,-.1);a.rotation.x=Math.PI/2,xt(i,2374715,.022,.014,.055,.008),t.add(i)}else if(s==="wheat")for(let n=0;n<7;n++){const i=(n%4-1.5)*.023,r=(Math.floor(n/4)-.5)*.045;Fe(t,12166234,i,.04,r,.012,.17,.012);const a=ft(t,new an(.024,.075,5),15321970,i,.14,r);a.rotation.z=(n%3-1)*.15}else if(s==="berry")for(let n=0;n<6;n++){const i=(n%3-1)*.048,r=(Math.floor(n/3)-.5)*.055,a=xt(t,14048595,i,.032,r,.034);a.scale.y=1.15,ft(t,new an(.026,.018,5),6196554,i,.072,r)}else if(s==="stone")for(let n=0;n<3;n++)xt(t,9938592,(n%2-.5)*.065,.035+Math.floor(n/2)*.045,0,.052);else for(let n=0;n<3;n++)Fe(t,7245904,(n-1)*.04,.05,0,.01,.13,.01),xt(t,15188108,(n-1)*.04,.12,0,.03);return uf.set(s,t),t.clone()}function Yc(s,e){for(let t=-.45;t<=.46;t+=.3)Fe(s,12363130,t,.17,e,.045,.34,.045);for(let t=.13;t<.3;t+=.13)Fe(s,13481612,0,t,e,.95,.035,.035)}function XS(s,e=!1,t=!1,n=!1){let i=e?.83:.64,r=e?.7:.48,a=.62;Fe(s,10718573,0,.06,0,i+.08,.12,a+.08),Fe(s,n?11898459:15851448,0,r/2+.1,0,i,r,a);for(let d of[-i/2,i/2])Fe(s,8807237,d,r/2+.1,.32,.045,r,.025);Fe(s,8807237,0,.2,.325,.16,.32,.035),Fe(s,13083501,.025,.19,.35,.02,.025,.025);for(let d of[-.22,.22])Fe(s,8873281,d,.42,.322,.16,.17,.035),Fe(s,9549746,d,.42,.345,.115,.12,.02),Fe(s,15063216,d,.42,.36,.018,.13,.015);let o=new At,l=i/2+.12,c=a/2+.1,u=r+.1,h=u+.38;o.setAttribute("position",new nt([-l,u,-c,l,u,-c,0,h,-c,-l,u,c,0,h,c,l,u,c,-l,u,-c,0,h,-c,0,h,c,-l,u,-c,0,h,c,-l,u,c,l,u,-c,l,u,c,0,h,c,l,u,-c,0,h,c,0,h,-c],3)),o.computeVertexNormals();const f=ft(s,o,t?6125944:n?9860693:12218449);f.material.side=Yt,Fe(s,14930868,.2,h-.06,-.12,.13,.4,.13),Fe(s,10259058,.2,h+.15,-.12,.17,.06,.17);for(let d=0;d<3;d++)Fe(s,7886140,-.27+d*.24,.11,.48,.19,.035,.16);if(t)for(let d=0;d<4;d++){let m=ft(s,new kt(.075,.075,.46,7),10451532,.43,.1+d%2*.13,-.16+Math.floor(d/2)*.18);m.rotation.x=Math.PI/2}if(n)for(let d of[-.38,.38])Fe(s,11834206,d,.16,.43,.2,.3,.2),Fe(s,7559999,d,.17,.535,.22,.03,.02);xt(s,7705943,-.43,.13,.32,.16)}function jS(s){let e=new Le;if(s==="forest")lr(e,-.23,-.2,0,.88),lr(e,.23,-.03,1,.79),lr(e,-.08,.27,2,.7);else if(s==="house"||s==="manor"||s==="lumber"||s==="store")XS(e,s==="manor",s==="lumber",s==="store");else if(s==="berry"||s==="farm"){for(let t of[-.3,0,.3]){Fe(e,8478788,0,.035,t,.9,.065,.18);for(let n=-.34;n<.4;n+=.17)if(s==="berry"){xt(e,6261068,n,.15,t,.12);for(let i=0;i<2;i++)xt(e,12737360,n+(i-.5)*.07,.24,t,.037)}else for(let i=0;i<3;i++){let r=n+(i-1)*.035;Fe(e,11836752,r,.2,t,.014,.35,.014),ft(e,new an(.035,.14,4),15124342,r,.4,t)}}Yc(e,-.49),s==="farm"&&(Fe(e,10652498,.4,.2,.4,.12,.4,.1),Fe(e,14206358,.4,.35,.4,.34,.12,.1))}else if(s==="garden"){ft(e,new kt(.28,.32,.12,10),12105120,0,.07,0),ft(e,new kt(.22,.22,.04,12),8302517,0,.15,0),ft(e,new kt(.05,.08,.28,8),13157033,0,.25,0),xt(e,13554357,0,.42,0,.09);for(let t=0;t<8;t++){let n=t/8*Math.PI*2;xt(e,6785362,Math.cos(n)*.4,.12,Math.sin(n)*.4,.13),xt(e,t%2?14659206:15259562,Math.cos(n)*.4,.24,Math.sin(n)*.4,.055)}}else if(s==="festival"){for(let t of[-.35,.35])Fe(e,9135944,t,.4,0,.04,.8,.04);Fe(e,14203504,0,.73,0,.75,.035,.035);for(let t=0;t<5;t++)ft(e,new an(.08,.18,3),t%2?11034965:14993274,-.28+t*.14,.64,0)}else for(let t=0;t<3;t++)xt(e,13018989,(t-1)*.2,.18,0,.2),Fe(e,8162641,(t-1)*.2,.36,0,.04,.15,.04);return e}const en=new Map;function $S(){const s=new Le;let e=0;for(const t of[-.3,0,.3]){Fe(s,8478788,0,.035,t,.9,.065,.18);for(let n=-.34;n<.4;n+=.17){const i=new Le;i.position.set(n,.065,t),i.userData.plantOrder=e++,xt(i,6261068,0,.085,0,.12);for(let r=0;r<2;r++)xt(i,12737360,(r-.5)*.07,.175,0,.037);s.add(i)}}return Yc(s,-.49),s}function YS(){const s=new Le;let e=0;for(const t of[-.3,0,.3]){Fe(s,8478788,0,.025,t,.9,.05,.18);for(let n=-.34;n<.4;n+=.17){const i=new Le;i.position.set(n,0,t),i.userData.cropOrder=e++;for(let r=0;r<3;r++)Fe(i,11904091,(r-1)*.035,.19,0,.015,.32,.018),ft(i,new an(.036,.15,4),15191939,(r-1)*.035,.39,0);s.add(i)}}return Yc(s,-.49),s}function qS(){const s=new Le;ft(s,new kt(.28,.32,.12,10),12105120,0,.07,0),ft(s,new kt(.22,.22,.04,12),8302517,0,.15,0),ft(s,new kt(.05,.08,.28,8),13157033,0,.25,0),xt(s,13554357,0,.42,0,.09);for(let e=0;e<8;e++){const t=e/8*Math.PI*2,n=new Le;n.position.set(Math.cos(t)*.4,0,Math.sin(t)*.4),n.userData.flowerOrder=e,xt(n,6785362,0,.12,0,.13),xt(n,e%2?14659206:15259562,0,.24,0,.055),s.add(n)}return s}function KS(){const s=new Le;Fe(s,8808269,0,.04,-.22,.62,.08,.59),Fe(s,14009496,0,.29,-.24,.48,.5,.42);const e=ft(s,new an(.46,.34,4),6720913,0,.68,-.24);e.rotation.y=Math.PI/4,Fe(s,7888455,0,.22,-.01,.15,.34,.025),Fe(s,9222576,-.15,.39,-.015,.12,.13,.025);for(let t=0;t<12;t++)Fe(s,t%2?11836016:13283716,0,.025,.25+t*.095,.39,.045,.087);for(const t of[-.15,.15])for(const n of[.45,1.15])Fe(s,8547410,t,-.18,n,.045,.43,.045);return ft(s,new kt(.095,.075,.15,8),8362387,.28,.1,.13),Fe(s,13219727,-.27,.14,.03,.13,.25,.15),s}function Ma(s){if(s==="stone"){if(!en.has(s)){const t=new Le;for(let n=0;n<3;n++){const i=new Le;i.userData.treeIndex=n,i.position.set([-.27,.24,0][n],0,[-.18,-.1,.29][n]),xt(i,[9214617,10858405,8162955][n],0,.13,0,.23).scale.set(1,.85,1.05),xt(i,13091748,.08,.23,.05,.055),t.add(i)}en.set(s,t)}return en.get(s).clone()}if(s==="garden")return en.has(s)||en.set(s,qS()),en.get(s).clone();if(s==="fisher"||s==="farm")return en.has(s)||en.set(s,s==="fisher"?KS():YS()),en.get(s).clone();if(s==="forest"){const t=new Le,n=Math.random()*Math.PI*2;for(let i=0;i<3;i++){const r=n+i*Math.PI*2/3+(Math.random()-.5)*.32,a=.4+Math.random()*.1;lr(t,Math.cos(r)*a,Math.sin(r)*a,Math.floor(Math.random()*10),.66+Math.random()*.17),t.children[i].userData.treeIndex=i}return t}if(s==="berry")return en.has(s)||en.set(s,$S()),en.get(s).clone();let e=en.get(s);if(!e){const t=jS(s);t.updateMatrixWorld(!0);const n=new Map;t.traverse(i=>{if(!(i instanceof Ke))return;const r=i.material,a=i.geometry.clone().applyMatrix4(i.matrixWorld);n.has(r)||n.set(r,[]),n.get(r).push(a)}),e=new Le;for(const[i,r]of n){const a=GS(r,!1);if(r.forEach(l=>l.dispose()),!a)continue;const o=new Ke(a,i);o.castShadow=!0,o.receiveShadow=!0,e.add(o)}en.set(s,e)}return e.clone()}class ZS extends zs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new nw(t)}),this.register(function(t){return new iw(t)}),this.register(function(t){return new fw(t)}),this.register(function(t){return new dw(t)}),this.register(function(t){return new pw(t)}),this.register(function(t){return new rw(t)}),this.register(function(t){return new aw(t)}),this.register(function(t){return new ow(t)}),this.register(function(t){return new lw(t)}),this.register(function(t){return new tw(t)}),this.register(function(t){return new cw(t)}),this.register(function(t){return new sw(t)}),this.register(function(t){return new hw(t)}),this.register(function(t){return new uw(t)}),this.register(function(t){return new QS(t)}),this.register(function(t){return new mw(t)}),this.register(function(t){return new gw(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=rr.extractUrlBase(e);a=rr.resolveURL(c,this.path)}else a=rr.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Jf(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===_p){try{a[Ye.KHR_BINARY_GLTF]=new vw(e)}catch(h){i&&i(h);return}r=JSON.parse(a[Ye.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Iw(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],f=r.extensionsRequired||[];switch(h){case Ye.KHR_MATERIALS_UNLIT:a[h]=new ew;break;case Ye.KHR_DRACO_MESH_COMPRESSION:a[h]=new _w(r,this.dracoLoader);break;case Ye.KHR_TEXTURE_TRANSFORM:a[h]=new xw;break;case Ye.KHR_MESH_QUANTIZATION:a[h]=new yw;break;default:f.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function JS(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}const Ye={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class QS{constructor(e){this.parser=e,this.name=Ye.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const u=new fe(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Jt);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Hl(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Bg(u),c.distance=h;break;case"spot":c=new Og(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Un(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class ew{constructor(){this.name=Ye.KHR_MATERIALS_UNLIT}getMaterialType(){return qt}extendParams(e,t,n){const i=[];e.color=new fe(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Jt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Ut))}return Promise.all(i)}}class tw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class nw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Oe(o,o)}return Promise.all(r)}}class iw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class sw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(r)}}class rw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new fe(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Jt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,Ut)),a.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(r)}}class aw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(r)}}class ow{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new fe().setRGB(o[0],o[1],o[2],Jt),Promise.all(r)}}class lw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class cw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new fe().setRGB(o[0],o[1],o[2],Jt),a.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,Ut)),Promise.all(r)}}class uw{constructor(e){this.parser=e,this.name=Ye.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(r)}}class hw{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(r)}}class fw{constructor(e){this.parser=e,this.name=Ye.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class dw{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class pw{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class mw{constructor(e){this.name=Ye.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,f,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(d),u,h,f,i.mode,i.filter),d})})}else return null}}class gw{constructor(e){this.name=Ye.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==gn.TRIANGLES&&c.mode!==gn.TRIANGLE_STRIP&&c.mode!==gn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],f=c[0].count,d=[];for(const m of h){const v=new Ge,g=new I,p=new Rn,y=new I(1,1,1),b=new Ec(m.geometry,m.material,f);for(let _=0;_<f;_++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,_),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,_),l.SCALE&&y.fromBufferAttribute(l.SCALE,_),b.setMatrixAt(_,v.compose(g,p,y));for(const _ in l)if(_==="_COLOR_0"){const E=l[_];b.instanceColor=new Ol(E.array,E.itemSize,E.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&m.geometry.setAttribute(_,l[_]);vt.prototype.copy.call(b,m),this.parser.assignFinalMaterial(b),d.push(b)}return u.isGroup?(u.clear(),u.add(...d),u):d[0]}))}}const _p="glTF",Js=12,hf={JSON:1313821514,BIN:5130562};class vw{constructor(e){this.name=Ye.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Js),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==_p)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Js,r=new DataView(e,Js);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===hf.JSON){const c=new Uint8Array(e,Js+a,o);this.content=n.decode(c)}else if(l===hf.BIN){const c=Js+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class _w{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ye.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const u in a){const h=rc[u]||u.toLowerCase();o[h]=a[u]}for(const u in e.attributes){const h=rc[u]||u.toLowerCase();if(a[u]!==void 0){const f=n.accessors[e.attributes[u]],d=Ss[f.componentType];c[h]=d.name,l[h]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,f){i.decodeDracoFile(u,function(d){for(const m in d.attributes){const v=d.attributes[m],g=l[m];g!==void 0&&(v.normalized=g)}h(d)},o,c,Jt,f)})})}}class xw{constructor(){this.name=Ye.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class yw{constructor(){this.name=Ye.KHR_MESH_QUANTIZATION}}class xp extends Er{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=i-t,h=(n-t)/u,f=h*h,d=f*h,m=e*c,v=m-c,g=-2*d+3*f,p=d-f,y=1-g,b=p-f+h;for(let _=0;_!==o;_++){const E=a[v+_+o],T=a[v+_+l]*u,A=a[m+_+o],R=a[m+_]*u;r[_]=y*E+b*T+g*A+p*R}return r}}const bw=new Rn;class Mw extends xp{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return bw.fromArray(r).normalize().toArray(r),r}}const gn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ss={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ff={9728:Zt,9729:Kt,9984:Tf,9985:ha,9986:Qs,9987:kn},df={33071:xi,33648:Ta,10497:Vi},jo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},rc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},mi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Sw={CUBICSPLINE:void 0,LINEAR:vr,STEP:gr},$o={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function ww(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Hn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ii})),s.DefaultMaterial}function Ui(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Un(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ew(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(n){const f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):s.attributes.position;a.push(f)}if(i){const f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):s.attributes.normal;o.push(f)}if(r){const f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):s.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],f=c[2];return n&&(s.morphAttributes.position=u),i&&(s.morphAttributes.normal=h),r&&(s.morphAttributes.color=f),s.morphTargetsRelative=!0,s})}function Tw(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Aw(s){let e;const t=s.extensions&&s.extensions[Ye.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Yo(t.attributes):e=s.indices+":"+Yo(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Yo(s.targets[n]);return e}function Yo(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function ac(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Rw(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Cw=new Ge;class Iw{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new JS,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Fg(this.options.manager):this.textureLoader=new Vg(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Jf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Ui(r,o,i),Un(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,u]of a.children.entries())r(u,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ye.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(rr.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=jo[i.type],o=Ss[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Ft(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=jo[i.type],c=Ss[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,f=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0;let v,g;if(d&&d!==h){const p=Math.floor(f/d),y="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let b=t.cache.get(y);b||(v=new c(o,p*d,i.count*d/u),b=new fg(v,d/u),t.cache.add(y,b)),g=new Sc(b,l,f%d/u,m)}else o===null?v=new c(i.count*l):v=new c(o,f,i.count*l),g=new Ft(v,l,m);if(i.sparse!==void 0){const p=jo.SCALAR,y=Ss[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,E=new y(a[1],b,i.sparse.count*p),T=new c(a[2],_,i.sparse.count*l);o!==null&&(g=new Ft(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let A=0,R=E.length;A<R;A++){const x=E[A];if(g.setX(x,T[A*l]),l>=2&&g.setY(x,T[A*l+1]),l>=3&&g.setZ(x,T[A*l+2]),l>=4&&g.setW(x,T[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const f=(r.samplers||{})[a.sampler]||{};return u.magFilter=ff[f.magFilter]||Kt,u.minFilter=ff[f.minFilter]||kn,u.wrapS=df[f.wrapS]||Vi,u.wrapT=df[f.wrapT]||Vi,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Zt&&u.minFilter!==Kt,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(h){c=!0;const f=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(f,d){let m=f;t.isImageBitmapLoader===!0&&(m=function(v){const g=new It(v);g.needsUpdate=!0,f(g)}),t.load(rr.resolveURL(h,r.path),m,void 0,d)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),Un(h,a),h.userData.mimeType=a.mimeType||Rw(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ye.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ye.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[Ye.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new jf,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Ba,Cn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Hn}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[Ye.KHR_MATERIALS_UNLIT]){const h=i[Ye.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,r,t))}else{const h=r.pbrMetallicRoughness||{};if(o.color=new fe(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){const f=h.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Jt),o.opacity=f[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,Ut)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Yt);const u=r.alphaMode||$o.OPAQUE;if(u===$o.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===$o.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==qt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Oe(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;o.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&a!==qt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==qt){const h=r.emissiveFactor;o.emissive=new fe().setRGB(h[0],h[1],h[2],Jt)}return r.emissiveTexture!==void 0&&a!==qt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Ut)),Promise.all(c).then(function(){const h=new a(o);return r.name&&(h.name=r.name),Un(h,r),t.associations.set(h,{materials:e}),r.extensions&&Ui(i,h,r),h})}createUniqueName(e){const t=lt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[Ye.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return pf(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],u=Aw(c),h=i[u];if(h)a.push(h.promise);else{let f;c.extensions&&c.extensions[Ye.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=pf(new At,c,t),i[u]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const u=a[l].material===void 0?ww(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let d=0,m=u.length;d<m;d++){const v=u[d],g=a[d];let p;const y=c[d];if(g.mode===gn.TRIANGLES||g.mode===gn.TRIANGLE_STRIP||g.mode===gn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new pg(v,y):new Ke(v,y),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===gn.TRIANGLE_STRIP?p.geometry=cf(p.geometry,Nf):g.mode===gn.TRIANGLE_FAN&&(p.geometry=cf(p.geometry,Fl));else if(g.mode===gn.LINES)p=new yg(v,y);else if(g.mode===gn.LINE_STRIP)p=new Ha(v,y);else if(g.mode===gn.LINE_LOOP)p=new Xf(v,y);else if(g.mode===gn.POINTS)p=new bg(v,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&Tw(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Un(p,r),g.extensions&&Ui(i,p,g),t.assignFinalMaterial(p),h.push(p)}for(let d=0,m=h.length;d<m;d++)t.associations.set(h[d],{meshes:e,primitives:d});if(h.length===1)return r.extensions&&Ui(i,h[0],r),h[0];const f=new Le;r.extensions&&Ui(i,f,r),t.associations.set(f,{meshes:e});for(let d=0,m=h.length;d<m;d++)f.add(h[d]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new nn(Ze.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Tr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Un(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,u=a.length;c<u;c++){const h=a[c];if(h){o.push(h);const f=new Ge;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new wc(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,f=i.channels.length;h<f;h++){const d=i.channels[h],m=i.samplers[d.sampler],v=d.target,g=v.node,p=i.parameters!==void 0?i.parameters[m.input]:m.input,y=i.parameters!==void 0?i.parameters[m.output]:m.output;v.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",y)),c.push(m),u.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const f=h[0],d=h[1],m=h[2],v=h[3],g=h[4],p=[];for(let b=0,_=f.length;b<_;b++){const E=f[b],T=d[b],A=m[b],R=v[b],x=g[b];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const S=n._createAnimationTracks(E,T,A,R,x);if(S)for(let P=0;P<S.length;P++)p.push(S[P])}const y=new Bl(r,void 0,p);return Un(y,i),y})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const u=c[0],h=c[1],f=c[2];f!==null&&u.traverse(function(d){d.isSkinnedMesh&&d.bind(f,Cw)});for(let d=0,m=h.length;d<m;d++)u.add(h[d]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(r.isBone===!0?u=new Wf:c.length>1?u=new Le:c.length===1?u=c[0]:u=new vt,u!==c[0])for(let h=0,f=c.length;h<f;h++)u.add(c[h]);if(r.name&&(u.userData.name=r.name,u.name=a),Un(u,r),r.extensions&&Ui(n,u,r),r.matrix!==void 0){const h=new Ge;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Le;n.name&&(r.name=i.createUniqueName(n.name)),Un(r,n),n.extensions&&Ui(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++)r.add(l[u]);const c=u=>{const h=new Map;for(const[f,d]of i.associations)(f instanceof Cn||f instanceof It)&&h.set(f,d);return u.traverse(f=>{const d=i.associations.get(f);d!=null&&h.set(f,d)}),h};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];mi[r.path]===mi.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(o);let c;switch(mi[r.path]){case mi.weights:c=Is;break;case mi.rotation:c=Ps;break;case mi.translation:case mi.scale:c=Ls;break;default:n.itemSize===1?c=Is:c=Ls;break}const u=i.interpolation!==void 0?Sw[i.interpolation]:vr,h=this._getArrayFromAccessor(n);for(let f=0,d=l.length;f<d;f++){const m=new c(l[f]+"."+mi[r.path],t.array,h,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ac(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof Ps?Mw:xp;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Pw(s,e,t){const n=e.attributes,i=new Vn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new I(l[0],l[1],l[2]),new I(c[0],c[1],c[2])),o.normalized){const u=ac(Ss[o.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new I,l=new I;for(let c=0,u=r.length;c<u;c++){const h=r[c];if(h.POSITION!==void 0){const f=t.json.accessors[h.POSITION],d=f.min,m=f.max;if(d!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(m[2]))),f.normalized){const v=ac(Ss[f.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new Gn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function pf(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=rc[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return Qe.workingColorSpace!==Jt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qe.workingColorSpace}" not supported.`),Un(s,e),Pw(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Ew(s,e.targets,t):s})}function Lw(s){const e=new Map,t=new Map,n=s.clone();return yp(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function yp(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)yp(s.children[n],e.children[n],t)}class Dw{constructor(e,t){this.splash=t,e.add(this.root),new ZS().load("/Codex/models/seagull.glb",r=>{const a=r.animations.find(o=>o.name==="ArmatureAction");if(!a){console.error("Martı uçuş animasyonu bulunamadı");return}for(let o=0;o<5;o++){const l=new Le,c=Lw(r.scene);l.add(c);const u=new Vn().setFromObject(c),h=u.getSize(new I),f=u.getCenter(new I),d=.55/Math.max(h.x,h.y,h.z);c.scale.multiplyScalar(d),c.position.addScaledVector(f,-d);const m=new n0(c);m.clipAction(a).play(),m.update(o*.27),this.root.add(l),this.birds.push({root:l,mixer:m,phase:o*1.93})}},void 0,r=>console.error("Martı modeli yüklenemedi",r));const n=new Hn({color:8959413,metalness:.18,roughness:.5}),i=new an(.055,.12,3);for(let r=0;r<2;r++){const a=new Le,o=new Ke(new Ga(.09,7,5),n);o.scale.set(.5,.65,1.7),a.add(o);const l=new Ke(i,n);l.rotation.x=-Math.PI/2,l.position.z=-.18,a.add(l),a.visible=!1,this.root.add(a),this.fish.push({root:a,start:new I,direction:new I,age:-1,wait:5+r*7,duration:1.25})}}splash;root=new Le;birds=[];fish=[];center=new I;radius=4;board=new Map;sync(e){this.board=e;const t=[...e.keys()].map(rt);t.length&&(this.center.set(t.reduce((n,i)=>n+i.x,0)/t.length,0,t.reduce((n,i)=>n+i.z,0)/t.length),this.radius=Math.max(3,...t.map(n=>Math.hypot(n.x-this.center.x,n.z-this.center.z)+1.7)))}reset(){for(let e=0;e<this.fish.length;e++){const t=this.fish[e];t.root.visible=!1,t.age=-1,t.wait=5+e*7}}update(e,t){this.birds.forEach((n,i)=>{const r=e*(.11+i*.007)+n.phase,a=this.radius+Math.sin(e*.09+n.phase)*.8;n.root.position.set(this.center.x+Math.cos(r)*a,2.4+i*.24+Math.sin(e*.6+n.phase)*.14,this.center.z+Math.sin(r)*a*.7),n.root.rotation.set(0,Math.atan2(-Math.sin(r),Math.cos(r)*.7),Math.sin(r+n.phase)*.15),n.mixer.update(t)});for(const n of this.fish){if(n.age<0){if(n.wait-=t,n.wait>0)continue;let a=!1;for(let o=0;o<12;o++){const l=Math.random()*Math.PI*2,c=this.radius*(.75+Math.random()*.65),u=l+Math.PI/2;if(n.start.set(this.center.x+Math.sin(l)*c,ti,this.center.z+Math.cos(l)*c),n.direction.set(Math.sin(u)*1.5,0,Math.cos(u)*1.5),[0,.25,.5,.75,1].every(h=>!this.board.has(Wt(n.start.x+n.direction.x*h,n.start.z+n.direction.z*h)))){a=!0;break}}if(!a){n.wait=3;continue}n.age=0,n.root.visible=!0,this.splash(n.start.x,n.start.z)}n.age+=t;const i=Math.min(1,n.age/n.duration);n.root.position.copy(n.start).addScaledVector(n.direction,i),n.root.position.y+=Math.sin(i*Math.PI)*.65;const r=n.direction.clone();r.y=Math.cos(i*Math.PI)*Math.PI*.65,n.root.quaternion.setFromUnitVectors(new I(0,0,1),r.normalize()),(i>=1||this.board.has(Wt(n.root.position.x,n.root.position.z)))&&(this.splash(n.root.position.x,n.root.position.z),n.root.visible=!1,n.age=-1,n.wait=8+Math.random()*15)}}}class Nw{root=new Le;land=new Map;water=new VS;landMat=new Hn({vertexColors:!0,roughness:1,flatShading:!0,side:Yt});wildlife;last=0;sinking=new Map;pendingBoard=null;constructor(e){e.add(this.root),e.background=new fe(9682891),this.root.add(this.water.root),this.wildlife=new Dw(e,(t,n)=>this.stir(t,n,1,0,.35,.1))}sync(e,t){this.wildlife.sync(e);for(const i of this.land.keys())e.has(i)||this.removeLand(i);this.pendingBoard=t>=0?new Map(e):null;const n=ua(e);this.water.sync(e,n,t);for(const i of e.keys()){const r=n.filter(h=>h.id===i).map(h=>h.side).join(","),a=this.land.get(i);if(a){t<0&&a.signature!==r&&(a.surface.geometry.dispose(),a.surface.geometry=ya(i,e),a.signature=r);continue}const o=rt(i),l=new Le;l.position.set(o.x,i===t?-1.1:0,o.z),i===t&&l.scale.set(.35,1,.35);const c=new Ke(ya(i,e),this.landMat);c.castShadow=!0,c.receiveShadow=!0;const u=kS(i);if(u.position.set(0,st,0),l.add(c,u),i===pt){const h=new Le;h.position.set(.44,st,-.37),lr(h,0,0,1,.47),l.add(h)}l.visible=i!==t,this.root.add(l),this.land.set(i,{root:l,surface:c,signature:r,age:i===t?0:zi})}}demolish(e,t){this.pendingBoard=new Map(e),this.sinking.set(t,0),this.water.sync(e,ua(e),-1,t)}removeLand(e){const t=this.land.get(e);t&&(this.root.remove(t.root),t.surface.geometry.dispose(),t.root.traverse(n=>{n instanceof Ke&&n!==t.surface&&n.material.vertexColors&&(n.geometry.dispose(),n.material.dispose())}),this.land.delete(e))}stir(e,t,n,i,r,a){this.water.stir(e,t,n,i,r,a)}update(e){pp.value=e;const t=Math.max(0,e-this.last);this.last=e,this.water.update(e),this.wildlife.update(e,t);for(const n of this.land.values())if(n.age<zi){n.age=Math.min(zi,n.age+t);const i=Mn(n.age,Ua,zi);n.root.visible=n.age>=Ua,n.root.position.y=-1.1*(1-i),n.root.scale.set(.35+.65*i,1,.35+.65*i)}for(const[n,i]of this.sinking){const r=i+t;this.sinking.set(n,r);const a=this.land.get(n),o=Mn(r,jc,$c);a&&(a.root.position.y=-1.6*o,a.root.scale.set(1-.7*o,1-.18*o,1-.7*o),a.root.rotation.z=Math.sin(r*25)*Math.sin(o*Math.PI)*.025),r>=dp&&(this.removeLand(n),this.sinking.delete(n))}if(this.pendingBoard&&this.sinking.size===0&&[...this.land.values()].every(n=>n.age>=zi)){const n=this.pendingBoard,i=ua(n);for(const[r,a]of this.land){const o=i.filter(l=>l.id===r).map(l=>l.side).join(",");a.signature!==o&&(a.surface.geometry.dispose(),a.surface.geometry=ya(r,n),a.signature=o)}this.pendingBoard=null}}reset(){this.wildlife.reset(),this.pendingBoard=null,this.sinking.clear(),this.water.clearWakes();for(const e of this.land.keys())this.removeLand(e)}}function gi(s,e=st){const{x:t,z:n}=rt(s);return new I(t,e,n)}function Uw(s){return new At().setFromPoints(Array.from({length:6},(e,t)=>{const n=ur(t,s);return new I(n.x,0,n.z)}))}class Fw{root=new Le;markers=new Le;ray=new Qf;plane=new Qn(new I(0,1,0),-st);hit=new I;occupied=new Set;rim=Uw(Si*.94);rimMat=new Ba({color:16578264,transparent:!0,opacity:.9,depthWrite:!1});fillGeo=new Sr(Si*.94,6,Math.PI/2).rotateX(-Math.PI/2);fillMat=new qt({color:12708029,transparent:!0,opacity:.16,depthWrite:!1});hoverMat=new qt({color:12117915,transparent:!0,opacity:.48,depthWrite:!1});hover=new Ke(this.fillGeo,this.hoverMat);constructor(e){this.root.add(this.markers,this.hover),this.hover.visible=!1,e.add(this.root)}rebuild(e){this.occupied=new Set(e.keys()),this.markers.clear();for(const t of Lp(e)){const n=new Le;n.position.copy(gi(t,ti+.055)),n.userData.id=t;const i=new Ke(this.fillGeo,this.fillMat),r=new Xf(this.rim,this.rimMat);i.renderOrder=4,r.renderOrder=5,n.add(i,r),this.markers.add(n)}}pick(e,t,n,i){const r=i.getBoundingClientRect();if(this.ray.setFromCamera(new Oe((e-r.left)/r.width*2-1,1-(t-r.top)/r.height*2),n),this.plane.constant=-st,!this.ray.ray.intersectPlane(this.plane,this.hit))return-1;const a=Wt(this.hit.x,this.hit.z);return this.occupied.has(a)?a:(this.plane.constant=.125,this.ray.ray.intersectPlane(this.plane,this.hit)?Wt(this.hit.x,this.hit.z):-1)}showAvailable(e,t){this.markers.visible=e,this.markers.children.forEach(n=>n.visible=t(n.userData.id))}setHover(e,t,n){this.hover.visible=n&&e>=0,this.hover.visible&&(this.hover.position.copy(gi(e,this.occupied.has(e)?st+.012:ti+.067)),this.hover.renderOrder=6,this.hoverMat.color.setHex(t?11790741:14653320))}}class kw{constructor(e,t,n,i=()=>[]){this.game=e,this.ready=t,this.yaw=n,this.obstacles=i}game;ready;yaw;obstacles;cache=new Map;step=.1;invalidate(){this.cache.clear()}free(e,t){for(const[m,v]of this.game.board)if(v==="fisher"&&this.ready(m)){const g=rt(m),p=this.yaw(m),y=e-g.x,b=t-g.z,_=y*Math.cos(p)-b*Math.sin(p),E=y*Math.sin(p)+b*Math.cos(p);if(Math.abs(_)<.13&&E>.1&&E<1.04)return!0}const n=Wt(e,t),i=this.game.board.get(n);if(!i||!this.ready(n))return!1;const r=rt(n),a=e-r.x,o=t-r.z;for(let m=0;m<6;m++)if(!this.game.board.has(tn(n)[m])&&a*Math.cos(m*Math.PI/3)+o*Math.sin(m*Math.PI/3)>.745)return!1;const l=this.yaw(n),c=Math.cos(l),u=Math.sin(l),h=a*c-o*u,f=a*u+o*c,d=(m,v,g,p,y=qo)=>h>m*y-.075&&h<v*y+.075&&f>g*y-.075&&f<p*y+.075;if(i==="house"||i==="manor"||i==="store"||i==="lumber"){const m=i==="manor"?.54:.43;if(d(-m,m,-.39,.58)||i==="store"&&(d(-.51,-.25,.26,.59)||d(.25,.51,.26,.59))||n===pt&&d(-.6,-.1,-.48,.04))return!1}else if(i==="fisher"){if(d(-.34,.34,-.57,.16))return!1}else if(i==="berry"||i==="farm"){if(d(-.5,.5,-.57,.4,.75))return!1}else if(i==="garden"){if(Math.hypot(h,f)<.44)return!1}else if(i==="forest"||i==="stone"){for(const m of this.obstacles(n))if(Math.hypot(e-m.x,t-m.z)<m.r)return!1}return!0}segment(e,t){const n=Math.max(1,Math.ceil(Math.hypot(t.x-e.x,t.z-e.z)/.055));for(let i=1;i<=n;i++)if(!this.free(e.x+(t.x-e.x)*i/n,e.z+(t.z-e.z)*i/n))return!1;return!0}nearest(e,t,n=(r,a)=>!0,i=.8){let r=null,a=1/0;for(let o=-i;o<=i;o+=this.step)for(let l=-i;l<=i;l+=this.step){const c=Math.round((e+l)/this.step)*this.step,u=Math.round((t+o)/this.step)*this.step,h=(c-e)**2+(u-t)**2;h<a&&this.free(c,u)&&n(c,u)&&(a=h,r={x:c,z:u,tile:Wt(c,u)})}return r}path(e,t,n=()=>0,i=.8){const r=this.nearest(e.x,e.z,(_,E)=>this.segment(e,{x:_,z:E})),a=this.nearest(t.x,t.z,()=>!0,i);if(!r||!a)return null;const o=(_,E)=>`${_},${E}`,l=Math.round(r.x/this.step),c=Math.round(r.z/this.step),u=Math.round(a.x/this.step),h=Math.round(a.z/this.step),f=o(u,h),d=[],m=_=>{d.push(_);for(let E=d.length-1;E>0;){const T=E-1>>1;if(d[T].score<=_.score)break;d[E]=d[T],d[T]=_,E=T}},v=()=>{const _=d[0],E=d.pop();if(d.length){d[0]=E;let T=0;for(;;){let A=T*2+1;if(A>=d.length||(A+1<d.length&&d[A+1].score<d[A].score&&A++,d[T].score<=d[A].score))break;[d[T],d[A]]=[d[A],d[T]],T=A}}return _},g=o(l,c),p=new Map([[g,0]]),y=new Map,b=new Map([[g,{x:l,z:c}]]);m({x:l,z:c,key:g,cost:0,score:Math.hypot(u-l,h-c)});for(let _=0;d.length&&_<14e3;_++){const E=v();if(E.cost===p.get(E.key)){if(E.key===f){const T=[];for(let x=f;;x=y.get(x)){const S=b.get(x);if(T.push({x:S.x*this.step,z:S.z*this.step,tile:Wt(S.x*this.step,S.z*this.step)}),x===g)break}T.reverse();const A=[];let R=0;for(;R<T.length;){let x=Math.min(T.length-1,R+12);for(;x>R&&!this.segment(R?T[R-1]:r,T[x]);)x--;A.push(T[x]),R=x+1}return this.free(t.x,t.z)&&this.segment(A[A.length-1]??r,t)&&A.push({...t,tile:Wt(t.x,t.z)}),A}for(const[T,A]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){const R=E.x+T,x=E.z+A,S=o(R,x),P=R*this.step,F=x*this.step;let z=this.cache.get(S);if(z===void 0&&(z=this.free(P,F),this.cache.set(S,z)),!z||!this.segment({x:E.x*this.step,z:E.z*this.step},{x:P,z:F}))continue;const V=E.cost+Math.hypot(T,A)+n(P,F);V>=(p.get(S)??1/0)||(p.set(S,V),y.set(S,E.key),b.set(S,{x:R,z:x}),m({x:R,z:x,key:S,cost:V,score:V+Math.hypot(u-R,h-x)}))}}}return null}}class Ow{constructor(e,t,n){this.hooks=t,this.overlay=n,e.add(this.root)}hooks;overlay;root=new Le;game=null;nav=null;citizens=[];time=0;spawned=new Set;spawnClock=0;buckets=new Map;assignedTo(e){return this.citizens.filter(t=>t.job?.source===e).length}assignedCounts(){return Object.fromEntries(hr.map(e=>[e,this.citizens.filter(t=>t.job?.category===e).length]))}get working(){return this.citizens.filter(e=>e.job!==null).length}refreshNavigation(){this.nav?.invalidate()}rebalance(){if(!this.game)return;const e=this.game.workTargets(),t=this.assignedCounts();for(const n of[...this.citizens].reverse())n.job?.category&&!["to-store","to-pickup","picking"].includes(n.stage)&&t[n.job.category]>e[n.job.category]&&(t[n.job.category]--,this.releaseJob(n))}releaseJob(e){e.job&&this.hooks.harvestProgress(e.job.source,e.id,0),e.job=null,e.stage="idle",e.path=[],e.retry=.1,e.bundle.visible=!1,e.line.visible=!1,e.bobber.visible=!1,e.fish.visible=!1,e.axe.visible=!1,e.pickaxe.visible=!1,e.rod.visible=!1,e.waitReason="",e.target=null}reset(e){for(const t of this.citizens)t.status.remove(),t.line.geometry.dispose(),t.line.material.dispose(),t.bobber.geometry.dispose(),t.bobber.material.dispose();this.root.clear(),this.citizens=[],this.spawned.clear(),this.game=e,this.time=0,this.spawnClock=0,this.nav=new kw(e,t=>this.hooks.ready(t),t=>this.hooks.yaw(t),t=>this.hooks.obstacles(t))}neighbors(e,t){const n=[],i=Math.floor(e/.32),r=Math.floor(t/.32);for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++)n.push(...this.buckets.get(`${i+a}:${r+o}`)??[]);return n}clear(e,t,n){return this.neighbors(t,n).every(i=>i===e||Math.hypot(i.root.position.x-t,i.root.position.z-n)>.21)}route(e,t,n,i=!1){const r=rt(t),a=this.hooks.yaw(t),o=n??new I(r.x+Math.sin(a)*.65,st,r.z+Math.cos(a)*.65),l=this.nav.path(e.root.position,o,(c,u)=>this.neighbors(c,u).reduce((h,f)=>h+(f!==e&&Math.hypot(f.root.position.x-c,f.root.position.z-u)<.32?4:0),0)+e.avoid.reduce((h,f)=>h+(Math.hypot(f.x-c,f.z-u)<.26?8:0),0),i?.18:.65);return l?.length?(e.nodeMarker="",e.stuck=0,e.bestDistance=1/0,e.path=l,e.target=new I(l[l.length-1].x,st,l[l.length-1].z),this.hooks.trail(l),!0):!1}spawn(e,t){const n=rt(t),i=this.hooks.yaw(t),r=this.nav.nearest(n.x+Math.sin(i)*.65,n.z+Math.cos(i)*.65,(R,x)=>this.citizens.every(S=>Math.hypot(S.root.position.x-R,S.root.position.z-x)>.23),1.1);if(!r)return;const a=new Le,o=new Le;a.add(o),o.position.y=.16,Fe(o,[7969937,11897456,10132338,8229283][e%4],0,.075,0,.115,.15,.075),xt(o,14858897,0,.2,0,.062),xt(o,[6441788,9728847,5130302][e%3],0,.228,-.012,.052);for(const R of[-.022,.022])xt(o,4537906,R,.205,.054,.006);const l=[-1,1].map(R=>{const x=new Le;return x.position.set(R*.083,.125,0),o.add(x),Fe(x,14660235,0,-.065,0,.035,.13,.035),x}),c=[-1,1].map(R=>{const x=new Le;return x.position.set(R*.035,.155,0),a.add(x),Fe(x,5858653,0,-.065,0,.044,.13,.045),Fe(x,6706759,0,-.13,.018,.05,.035,.075),x}),u=new Le;u.position.set(0,.235,.12),u.visible=!1,a.add(u);const h=new Le;Fe(h,9136455,0,-.13,.04,.022,.19,.022),Fe(h,10464938,.025,-.19,.04,.09,.045,.025),l[0].add(h),h.visible=!1;const f=new Le;f.position.set(0,.125,.015),o.add(f),Fe(f,9136455,0,-.095,0,.023,.29,.023);const d=Fe(f,11450290,0,-.25,0,.16,.028,.035);for(const R of[-1,1]){const x=new Ke(new an(.023,.095,4),d.material);x.position.set(R*.112,-.25,0),x.rotation.z=-R*Math.PI/2,f.add(x)}f.visible=!1;const m=new Le;m.position.set(0,-.12,0),Fe(m,8677451,0,.28,0,.013,.58,.013),m.rotation.x=1,l[0].add(m),m.visible=!1;const v=new Ha(new At().setAttribute("position",new Ft(new Float32Array(36),3)),new Ba({color:14869969,transparent:!0,opacity:.8}));v.frustumCulled=!1,v.visible=!1;const g=new Ga(.032,12,12).toNonIndexed(),p=[],y=g.getAttribute("position");for(let R=0;R<y.count;R+=3){const x=(y.getY(R)+y.getY(R+1)+y.getY(R+2))/3,S=new fe(Math.floor((x+.032)/.016)%2===0?14965840:16774623);for(let P=0;P<3;P++)p.push(S.r,S.g,S.b)}g.scale(.85,1.25,.85),g.setAttribute("color",new nt(p,3));const b=new Ke(g,new Hn({vertexColors:!0,roughness:.55}));b.visible=!1;const _=new Le;xt(_,9747131,0,0,0,.055).scale.set(.55,.7,1.6);const T=zw();_.add(T),_.visible=!1,a.position.set(r.x,st,r.z),a.rotation.y=i+Math.PI;const A=document.createElement("div");A.className="citizen-status",A.setAttribute("role","img"),this.overlay.append(A),this.root.add(a,v,b,_),this.spawned.add(e),this.citizens.push({id:e,root:a,body:o,arms:l,legs:c,bundle:u,axe:h,pickaxe:f,rod:m,line:v,bobber:b,fish:_,stage:"idle",path:[],target:null,job:null,clock:0,retry:.6+e%7*.1,phase:e*1.73,birth:e===0?1:0,speed:0,wait:0,status:A,lastStatus:"",eatUntil:0,hungry:!1,waitReason:"",searchUntil:0,stuck:0,bestDistance:1/0,nodeMarker:"",avoid:[]})}findJob(e){const t=this.game,n=Wt(e.root.position.x,e.root.position.z),i=t.workTargets(),r=this.assignedCounts(),a=[...t.board.keys()].map(o=>({source:o,recipe:t.productAt(o),category:t.categoryFor(o)})).filter(({source:o,recipe:l,category:c})=>l&&this.hooks.resourceReady(o)&&this.hooks.ready(o)&&(c?r[c]<i[c]:t.happy<70)&&this.assignedTo(o)<l.capacity).sort((o,l)=>Ea(n,o.source)-Ea(n,l.source));for(const{source:o,recipe:l,category:c}of a){const u=t.storageFor(o).find(d=>this.hooks.ready(d)&&t.canStore(d,l.resource));if(u===void 0)continue;let h=l.resource==="wood"||l.resource==="stone"?-1:e.id%2;if((c==="farm"||c==="berry")&&(h=[0,1].find(d=>!this.citizens.some(m=>m.job?.source===o&&m.job.tree===d&&!["to-store","to-pickup","picking"].includes(m.stage)))??-1,h<0))continue;if(l.resource==="wood"||l.resource==="stone")for(let d=0;d<3;d++){const m=this.hooks.pickTree(o,(e.id+d)%3);if(m>=0&&!this.citizens.some(v=>v.job?.source===o&&v.job.tree===m&&!["to-store","to-pickup","picking"].includes(v.stage))){h=m;break}}if((l.resource==="wood"||l.resource==="stone")&&h<0)continue;const f=t.board.get(o)==="fisher"?this.hooks.fishingSpot(o):null;if(!(t.board.get(o)==="fisher"&&!f)&&this.route(e,o,f?.stand??this.hooks.workPoint(o,h)))return e.job={source:o,store:u,resource:l.resource,amount:l.amount,tree:h,category:c},e.stage="to-work",e.clock=0,!0}return!1}wander(e){const t=Wt(e.root.position.x,e.root.position.z),n=[t,...tn(t)].filter(o=>this.game.board.has(o)&&this.hooks.ready(o));if(!n.length)return;const i=n[Math.floor((Math.sin(this.time+e.phase)+1)*.499*n.length)],r=rt(i),a=this.time*.7+e.phase;this.route(e,i,new I(r.x+Math.sin(a)*.7,st,r.z+Math.cos(a)*.7))}move(e,t){if(!e.path.length)return e.speed*=Math.exp(-10*t),!1;const n=e.path[0];if(!this.nav.free(n.x,n.z))return e.path=[],!1;const i=n.x-e.root.position.x,r=n.z-e.root.position.z,a=Math.hypot(i,r);if(a<.035)return e.path.shift(),e.nodeMarker="",!1;const o=`${n.x}:${n.z}`;if(e.nodeMarker!==o?(e.nodeMarker=o,e.bestDistance=a,e.stuck=0):a<e.bestDistance-.035?(e.bestDistance=a,e.stuck=0):e.stuck+=t,e.stuck>1.1)return this.recover(e),!1;const l=Math.atan2(i,r),c=Ze.euclideanModulo(l-e.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;e.speed+=((.82+e.id%4*.025)*Math.max(.35,1-Math.abs(c)/Math.PI*.65)-e.speed)*(1-Math.exp(-7*t));const u=Math.min(a,e.speed*t),h=i/a,f=r/a,d={x:e.root.position.x,z:e.root.position.z},m=Math.min(.06,t*.8),g=[{x:d.x+h*u,z:d.z+f*u},{x:d.x+h*u-f*m,z:d.z+f*u+h*m},{x:d.x+h*u+f*m,z:d.z+f*u-h*m},{x:d.x-f*m,z:d.z+h*m},{x:d.x+f*m,z:d.z-h*m}].find(p=>this.clear(e,p.x,p.z)&&this.nav.segment(d,p));return g?(e.wait=0,e.root.position.x=g.x,e.root.position.z=g.z,e.root.rotation.y+=c*(1-Math.exp(-15*t)),Math.hypot(n.x-g.x,n.z-g.z)<.035&&e.path.shift(),!0):(e.wait+=t,e.speed*=.8,e.wait>.6&&this.recover(e),!1)}recover(e){if(this.nav.invalidate(),e.searchUntil=this.time+1.5,e.wait=0,e.stuck=0,e.path[0]&&e.avoid.push({x:e.path[0].x,z:e.path[0].z,until:this.time+4}),e.path=[],e.stage==="to-store"){e.target=null,e.job&&(e.job.store=-1),e.retry=0;return}if(e.stage==="to-pickup"){e.target=null,e.retry=.2;return}if(e.job){const t=e.job.category==="fish"?this.hooks.fishingSpot(e.job.source)?.stand:this.hooks.workPoint(e.job.source,e.job.tree);if(t&&this.route(e,e.job.source,t))return;e.retry=.5}else e.retry=.2}carry(e){e.job&&(e.bundle.clear(),e.bundle.add(vp(e.job.resource==="food"?e.job.category==="fish"?"fish":e.job.category==="farm"?"wheat":"berry":e.job.resource)),e.bundle.visible=!0,e.stage="to-store",e.path=[],e.target=null,e.retry=0,e.body.rotation.x=0)}sendToStorage(e){const t=e.job;if(!t)return;const n=this.game;if(t.resource==="happy"&&n.happy>=100){this.releaseJob(e);return}const i=n.storageFor(t.source).filter(o=>this.hooks.ready(o)),r=i.filter(o=>n.canStore(o,t.resource));if(!r.length){e.waitReason=i.length?"full":"path",e.retry=.7;return}if(t.store>=0&&r.includes(t.store)&&e.target&&Math.hypot(e.root.position.x-e.target.x,e.root.position.z-e.target.z)<.1&&Math.hypot(e.root.position.x-rt(t.store).x,e.root.position.z-rt(t.store).z)<1.05){const o=this.hooks.deliver(t.source,t.store,t.resource,t.amount);if(t.amount-=o,t.amount<=0){this.releaseJob(e),e.retry=.35;return}e.target=null,t.store=-1,e.retry=.1;return}const a=r.sort((o,l)=>Math.hypot(e.root.position.x-rt(o).x,e.root.position.z-rt(o).z)-Math.hypot(e.root.position.x-rt(l).x,e.root.position.z-rt(l).z));for(const o of a){const l=rt(o),c=this.hooks.yaw(o),h=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3].map(f=>new I(l.x+Math.sin(c+f)*.67,st,l.z+Math.cos(c+f)*.67)).filter(f=>this.nav.free(f.x,f.z)&&this.clear(e,f.x,f.z)).sort((f,d)=>e.root.position.distanceTo(f)-e.root.position.distanceTo(d));for(const f of h)if(this.route(e,o,f,!0)){t.store=o,e.waitReason="";return}}e.waitReason="path",e.searchUntil=this.time+1.2,e.retry=.6}updateStatuses(e,t,n){const i=new I;for(const r of this.citizens){const a=r.eatUntil>this.time,o=r.bundle.visible,l=a?r.hungry?"hungry":"eat":o?r.waitReason==="full"?"full":"carry":r.job?r.job.category??"garden":"rest",c=l==="carry"?r.job?.category??"garden":l,u=`${l}:${c}`;if(u!==r.lastStatus){r.lastStatus=u,r.status.innerHTML=hn(c),r.status.dataset.state=l;const m=l==="carry"?`Depoya taşıyor · ${mf[c]??""}`:mf[l]??"Dinleniyor";r.status.setAttribute("aria-label",m),r.status.title=m}i.copy(r.root.position),i.y+=.58,i.project(e),r.status.hidden=i.z<-1||i.z>1,r.status.style.left=`${(i.x+1)*t/2}px`,r.status.style.top=`${(1-i.y)*n/2}px`;const h=e,f=n/((h.top-h.bottom)/h.zoom),d=Ze.smoothstep(f,42,100);r.status.style.opacity=String(r.birth*d),r.status.style.setProperty("--status-scale",String(.35+.65*d)),r.status.hidden=r.status.hidden||d<.01}}fishing(e,t){const n=this.hooks.fishingSpot(e.job.source);if(!n)return;const i=e.clock,r=i-t,a=n.water;e.root.rotation.y=Math.atan2(a.x-e.root.position.x,a.z-e.root.position.z),e.rod.visible=!0;const o=Ze.smoothstep(i,.7,1.35),l=Ze.smoothstep(i,5.8,7.2);e.arms[0].rotation.x=i<.7?-.8-i*.5:i<1.35?-.95+o*.9:i>5.8?-.1-l*.9:-.1,e.arms[1].rotation.x=-.35,e.rod.rotation.x=.75,e.root.updateMatrixWorld(!0);const c=e.rod.localToWorld(new I(0,.58,0)),u=e.root.localToWorld(new I(0,.24,.15)),h=new I().lerpVectors(c,a,o);h.y+=Math.sin(o*Math.PI)*.45,i>=1.35&&(h.copy(a),h.y+=Math.sin(this.time*4)*.015),i>5.8&&(h.lerpVectors(a,u,l),h.y+=Math.sin(l*Math.PI)*.38),e.bobber.visible=i>.7&&i<7.25,e.bobber.position.copy(h),e.line.visible=e.bobber.visible;const f=e.line.geometry.getAttribute("position");for(let d=0;d<12;d++){const m=d/11;f.setXYZ(d,Ze.lerp(c.x,h.x,m),Ze.lerp(c.y,h.y,m)-Math.sin(m*Math.PI)*.06,Ze.lerp(c.z,h.z,m))}f.needsUpdate=!0,e.fish.visible=i>5.9&&i<7.2,e.fish.position.copy(h),e.fish.rotation.z=Math.sin(this.time*22)*.25,r<1.35&&i>=1.35&&this.hooks.splash(a.x,a.z),i>1.35&&i<5.8&&Math.floor(i/.9)!==Math.floor(r/.9)&&this.hooks.splash(a.x,a.z)}update(e){const t=this.game;if(!(!t||!this.nav)){this.time+=e,t.tick(e),this.spawnClock-=e;for(const n of t.takeMeals()){const i=this.citizens.find(r=>r.id===n.id);i&&(i.eatUntil=this.time+1.5,i.hungry=!n.ate)}if(this.spawnClock<=0){for(const n of t.residents)!this.spawned.has(n.id)&&this.hooks.ready(n.home)&&this.spawn(n.id,n.home);this.spawnClock=.35}this.buckets.clear();for(const n of this.citizens){const i=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`;this.buckets.has(i)||this.buckets.set(i,[]),this.buckets.get(i).push(n)}for(const n of this.citizens){n.avoid=n.avoid.filter(g=>g.until>this.time),n.birth=Math.min(1,n.birth+e*2),n.root.scale.setScalar(Math.max(.01,n.birth*n.birth*(3-2*n.birth)));const i=Wt(n.root.position.x,n.root.position.z);if(!this.nav.free(n.root.position.x,n.root.position.z)){const g=rt(t.residents[n.id]?.home??pt),p=this.nav.nearest(t.board.has(i)?n.root.position.x:g.x,t.board.has(i)?n.root.position.z:g.z,(y,b)=>this.citizens.every(_=>_===n||Math.hypot(_.root.position.x-y,_.root.position.z-b)>.23),1.2);if(p){const y=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`,b=this.buckets.get(y);if(b){const E=b.indexOf(n);E>=0&&b.splice(E,1)}n.root.position.x=p.x,n.root.position.z=p.z,n.path=[];const _=`${Math.floor(p.x/.32)}:${Math.floor(p.z/.32)}`;this.buckets.has(_)||this.buckets.set(_,[]),this.buckets.get(_).push(n)}else continue}if(n.job&&!t.board.has(n.job.source)&&this.releaseJob(n),n.retry-=e,n.eatUntil>this.time){n.axe.visible=!1,n.pickaxe.visible=!1,n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.body.rotation.x=.06,n.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12,n.arms[1].rotation.x=n.bundle.visible?-.8:-.2,n.legs.forEach(g=>g.rotation.x=0);continue}n.stage==="idle"&&n.retry<=0&&(n.retry=1.5+n.id%3*.2,!this.findJob(n)&&!n.path.length&&this.wander(n));const r=this.move(n,e);if(n.stage==="to-work"&&!n.path.length&&n.job&&n.retry<=0)if(n.target&&Math.hypot(n.target.x-n.root.position.x,n.target.z-n.root.position.z)<.17)n.stage="working",n.clock=0;else{const g=n.job.category==="fish"?this.hooks.fishingSpot(n.job.source)?.stand:this.hooks.workPoint(n.job.source,n.job.tree);(!g||!this.route(n,n.job.source,g))&&(n.retry=.6,n.searchUntil=this.time+1)}n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1;const a=n.stage==="working",o=a&&n.job?.resource==="stone",l=a&&(n.job?.resource==="wood"||n.job?.resource==="stone"),c=a&&n.job?.category==="fish",u=this.time*9+n.phase;n.root.position.y=st+(c?.035:0)+(r?Math.abs(Math.sin(u))*.012:Math.sin(this.time*2+n.phase)*.002),n.body.rotation.x=a?l?.12:.45+Math.sin(n.clock*4)**2*.22:r?.05:Math.sin(this.time*1.4+n.phase)*.02;const h=n.clock*1.7%1,f=Ze.smoothstep(h,0,.6),d=Ze.smoothstep(h,.6,.76),m=Ze.smoothstep(h,.76,1);n.arms[0].rotation.x=l?-.3-f*1.9+d*2.1-m*.2:a?-.9:r?Math.sin(u)*.45:Math.sin(this.time*1.7+n.phase)*.08,n.arms[1].rotation.x=o?n.arms[0].rotation.x:l?-.25:a?-.9:r?-Math.sin(u)*.45:-Math.sin(this.time*1.7+n.phase)*.08,n.arms[0].rotation.z=o?.45:0,n.arms[1].rotation.z=o?-.45:0;const v=-.95-f*1.95+d*1.65+m*.3;if(o&&n.arms.forEach(g=>g.rotation.x=v),n.pickaxe.rotation.x=o?v:0,n.legs[0].rotation.x=r?Math.sin(u)*.55:0,n.legs[1].rotation.x=r?-Math.sin(u)*.55:0,n.axe.visible=!!l&&n.job?.resource==="wood",n.pickaxe.visible=!!l&&n.job?.resource==="stone",a&&n.job){if(c){const p=this.hooks.fishingSpot(n.job.source);if(!p||Math.hypot(n.root.position.x-p.stand.x,n.root.position.z-p.stand.z)>.22){n.clock=0,n.stage="to-work",n.path=[],n.target=null,n.retry=0;continue}}n.clock+=e,l&&n.clock>.3&&Math.floor(n.clock*1.7-.72)!==Math.floor((n.clock-e)*1.7-.72)&&this.hooks.impact(n.job.source,n.job.tree);const g=c?7.5:l?n.job.resource==="stone"?6.8:6:2.4;if(c)n.body.rotation.x=.05,this.fishing(n,e);else{const p=this.hooks.workPoint(n.job.source,n.job.tree);n.root.rotation.y=Math.atan2(p.x-.12-n.root.position.x,p.z-.15-n.root.position.z),this.hooks.harvestProgress(n.job.source,n.id,Math.min(1,n.clock/g))}n.clock>=g&&(this.hooks.harvest(n.job.source,n.job.resource,n.job.tree,n.id)?n.job.resource==="wood"?(n.stage="to-pickup",n.path=[],n.target=null,n.retry=.9):this.carry(n):this.releaseJob(n),n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.rod.visible=!1)}if(n.stage==="to-pickup"&&n.job&&!n.path.length&&n.retry<=0){const g=this.hooks.pickup(n.job.source,n.job.tree,!1);if(!g){this.releaseJob(n);continue}n.target&&n.root.position.distanceTo(n.target)<.17?(n.stage="picking",n.clock=0,n.root.rotation.y=Math.atan2(g.x-n.root.position.x,g.z-.23-n.root.position.z)):this.route(n,n.job.source,g,!0)||(n.retry=.4)}n.stage==="picking"&&n.job&&(n.clock+=e,n.body.rotation.x=Math.sin(Math.min(1,n.clock/.85)*Math.PI)*.85,n.arms.forEach(g=>g.rotation.x=-.8),n.clock>=.85&&(this.hooks.pickup(n.job.source,n.job.tree,!0)?this.carry(n):(n.stage="to-pickup",n.retry=.25))),n.stage==="to-store"&&n.job&&!n.path.length&&n.retry<=0&&this.sendToStorage(n),n.bundle.visible&&n.arms.forEach(g=>g.rotation.x=-.8)}}}}function zw(){const s=new Ke(new an(.05,.065,3),new Hn({color:7576476,roughness:.7}));return s.position.z=-.09,s.rotation.x=Math.PI/2,s}const mf={stone:"Taş çıkarıyor",wood:"Odun kesiyor",berry:"Çilek topluyor",farm:"Buğday biçiyor",fish:"Balık tutuyor",garden:"Çiçek topluyor",carry:"Depoya taşıyor",full:"Depo dolu",rest:"Dinleniyor",eat:"Yemek yiyor",hungry:"Yiyecek yok",search:"Alternatif yol arıyor"};function Bw(){const s=document.createElement("canvas");s.width=64,s.height=64;const e=s.getContext("2d"),t=e.createRadialGradient(32,32,1,32,32,31);t.addColorStop(0,"rgba(50,61,39,.43)"),t.addColorStop(.6,"rgba(55,63,39,.19)"),t.addColorStop(1,"rgba(58,65,42,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);const n=new Mg(s);return n.colorSpace=Ut,new qt({map:n,transparent:!0,depthWrite:!1})}function Hw(){const s=Ma("house"),e=new Le;e.position.set(-.34,0,-.21),s.add(e),ft(e,new kt(.205,.24,.77,8),15062190,0,.405,0),ft(e,new kt(.24,.2,.065,8),9795928,0,.812,0),ft(e,new kt(.16,.16,.29,8),6847604,0,.99,0);for(let i=0;i<4;i++){let r=i*Math.PI/2+.4;Fe(e,12296567,Math.cos(r)*.172,.99,Math.sin(r)*.172,.038,.3,.038)}ft(e,new an(.29,.37,8),5734528,0,1.29,0),Fe(e,9402454,0,1.58,0,.023,.23,.023);const t=new At;t.setAttribute("position",new nt([0,1.69,0,.26,1.62,.018,0,1.56,0],3)),t.computeVertexNormals();const n=new Ke(t,new Cc({color:14394711,side:Yt}));return e.add(n),s}class Vw{constructor(e){this.el=e,this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=wf,this.renderer.toneMapping=rl,this.renderer.toneMappingExposure=1.03,e.append(this.renderer.domElement),this.cameraControl=new DS(this.renderer.domElement),this.scene.add(new Yu(16773592,8689792,1.55),this.root);const t=this.sun;t.position.set(-5,10,4),t.castShadow=!0,Object.assign(t.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31}),t.shadow.mapSize.set(2048,2048),t.shadow.bias=-12e-5,t.shadow.normalBias=.015,this.scene.add(t,t.target),this.environment=new Nw(this.scene),this.villagers=new Ow(this.scene,{ready:r=>this.ready(r),yaw:r=>this.buildings.get(r)?.rotation.y??0,resourceReady:r=>this.resourceReady(r),pickTree:(r,a)=>this.pickTree(r,a),workPoint:(r,a)=>this.workPoint(r,a),obstacles:r=>this.obstacles(r),pickup:(r,a,o)=>this.pickup(r,a,o),harvest:(r,a,o,l)=>this.harvest(r,a,o,l),harvestProgress:(r,a,o)=>{const l=`${r}:${a}`;o?this.harvestParts.set(l,{id:r,progress:o}):this.harvestParts.delete(l)},fishingSpot:r=>this.fishingSpot(r),impact:(r,a)=>this.woodImpact(r,a),splash:(r,a)=>this.environment.stir(r,a,1,0,.45,.1),trail:r=>this.addTrail(r),deliver:(r,a,o,l)=>this.onDelivery(r,a,o,l)},this.el),this.scene.add(this.trails),this.trails.count=0,this.trails.frustumCulled=!1,this.grid=new Fw(this.scene);const n=()=>{const{clientWidth:r,clientHeight:a}=e;this.renderer.setSize(r,a),this.cameraControl.resize(r,a)};new ResizeObserver(n).observe(e),n();const i=this.renderer.domElement;i.addEventListener("pointermove",r=>{this.selected&&!r.buttons&&this.point(r.clientX,r.clientY)}),i.addEventListener("pointerleave",()=>{this.setHover(-1),this.lastSea=null,this.onInspect(-1,0,0,null)}),i.addEventListener("pointermove",r=>{this.stirSea(r),this.inspectPointer(r)}),i.addEventListener("click",r=>{if(r.button===0){if(this.selected){const a=this.point(r.clientX,r.clientY);a>=0&&this.onPick(a)}else if(!this.placing&&!document.querySelector("dialog[open]")){const a=this.grid.pick(r.clientX,r.clientY,this.cameraControl.camera,this.el);this.editTile(this.board.has(a)?a:-1)}}}),window.addEventListener("wheel",r=>{if((!this.selected||this.selected.event)&&this.editing<0||document.querySelector("dialog[open]"))return;r.preventDefault(),r.stopImmediatePropagation();const a=r.deltaY*(r.deltaMode===1?16:r.deltaMode===2?300:1);this.wheelRotation=Ze.clamp(this.wheelRotation+a,-240,240);const o=Math.trunc(this.wheelRotation/60);o&&(this.wheelRotation-=o*60,this.rotateSelection(o))},{capture:!0,passive:!1}),window.addEventListener("keydown",r=>{r.key.toLowerCase()!=="r"||r.repeat||r.ctrlKey||r.metaKey||r.altKey||document.querySelector("dialog[open]")||r.target instanceof Element&&r.target.closest("input,textarea,select,[contenteditable]")||(this.selected&&!this.selected.event||this.editing>=0)&&(r.preventDefault(),this.rotateSelection(r.shiftKey?-1:1))}),this.renderer.setAnimationLoop(this.frame)}el;scene=new Lu;renderer=new Eh({antialias:!0,alpha:!1,powerPreference:"high-performance"});cameraControl;grid;environment;villagers;game=null;fullStores=new Map;treeCycles=new Map;drops=new Map;storageDecor=new Map;fields=new Map;harvestParts=new Map;loaders=new Map;trails=new Ec(new Sr(.055,5).rotateX(-Math.PI/2),new qt({color:13417621,transparent:!0,opacity:.42,depthWrite:!1}),8e3);trailPoints=[];trailKeys=new Set;fisherOffset=0;sparkMat=new qt({color:16768138});stoneChipMat=new Hn({color:10069664,roughness:1});woodHits=new Map;root=new Le;buildings=new Map;editing=-1;rotationTargets=new Map;demolitions=[];ghost=null;ghostModel=null;desiredGhostYaw=0;ghostManualCell=-1;placedManualCell=-1;lastRotationWake=0;wheelRotation=0;placementQueued=!1;previewLand=null;previewLandMat=new Hn({vertexColors:!0,roughness:1,flatShading:!0,side:Yt});seaRay=new Qf;seaPlane=new Qn(new I(0,1,0),-ti);seaPoint=new I;lastSea=null;board=new Map;sun=new Hl(16769463,2.35);ghostPalette=[];ghostTarget=new I;contact=Bw();contactGeo=new Xi(1.48,1.26).rotateX(-Math.PI/2);moteGeo=new wr(.032,0);moteMats=[15321987,12966298,14333578].map(e=>new qt({color:e}));builds=[];motes=[];labels=[];rings=[];ringGeo=new Rc(.47,.49,32).rotateX(-Math.PI/2);projection=new I;selected=null;previousTime=performance.now();time=0;hover=-1;valid=e=>!1;onHover=e=>{};onPick=e=>{};onTileSelect=e=>{};onDelivery=(e,t,n,i)=>0;onInspect=(e,t,n,i)=>{};bindGame(e){this.game=e,this.villagers.reset(e)}ready(e){return this.board.has(e)&&this.buildings.has(e)&&!this.builds.some(t=>t.id===e)&&!this.demolitions.some(t=>t.id===e)}pickTree(e,t){for(let n=0;n<3;n++){const i=(t+n)%3;if(!this.treeCycles.has(`${e}:${i}`)&&this.buildings.get(e)?.children.some(r=>r.userData.treeIndex===i))return i}return-1}workPoint(e,t){const n=rt(e),i=this.buildings.get(e),r=i?.children.find(c=>c.userData.treeIndex===t);if(r){r.updateWorldMatrix(!0,!1);const c=r.getWorldPosition(new I),u=this.board.get(e)==="stone";return new I(c.x+.05,st,c.z+(u?.38:.26))}const a=i?.rotation.y??0,o=["farm","berry"].includes(this.board.get(e)??"")?t%2?-.18:.18:0,l=.62;return new I(n.x+o*Math.cos(a)+l*Math.sin(a),st,n.z-o*Math.sin(a)+l*Math.cos(a))}obstacles(e){const t=this.buildings.get(e);return t?t.children.filter(n=>n.userData.treeIndex!==void 0&&n.visible&&!this.treeCycles.has(`${e}:${n.userData.treeIndex}`)).map(n=>{const i=n.getWorldPosition(new I);return{x:i.x,z:i.z,r:this.board.get(e)==="stone"?.31:.14}}):[]}pickup(e,t,n){const i=`${e}:${t}`,r=this.drops.get(i);if(!r||r.claimed)return null;const a=r.group.position.clone();if(a.z+=.23,a.y=st,n){if(r.age<1.7)return null;r.claimed=!0,this.scene.remove(r.group),this.drops.delete(i)}return a}dust(e,t=18){for(let n=0;n<t;n++){const i=new qt({color:n%2?12891022:14010022,transparent:!0,opacity:.42,depthWrite:!1}),r=new Ke(this.moteGeo,i);r.position.copy(e),r.position.y+=.08,this.scene.add(r),this.motes.push({mesh:r,velocity:new I((Math.random()-.5)*.65,.12+Math.random()*.22,(Math.random()-.5)*.65),life:1.3+Math.random()*.5,dust:!0})}}upgradeStorage(e){const t=this.buildings.get(e);if(!t||!this.game)return;let n=this.storageDecor.get(e);n||(n=new Le,t.add(n),this.storageDecor.set(e,n)),n.clear();const i=this.game.storageLevels.get(e)??1;for(let a=0;a<Math.min(i-1,8);a++){const o=a%2?-.47:.47,l=-.24+Math.floor(a/2)*.16;Fe(n,11766358,o,.12,l,.19,.23,.14),Fe(n,7492411,o,.12,l+.075,.2,.026,.018)}for(let a=0;a<Math.min(i,8);a++)ft(n,new Ac(.04),15121766,-.21+a*.06,.64,.34);n.userData.upgradedAt=this.time,this.burst(e);const r=document.createElement("div");r.className="float bonus",r.textContent=`Depo seviye ${i} · ${this.game.storageCapacity(e)} kapasite`,this.el.append(r),this.labels.push({el:r,position:gi(e,1.1),life:2.5,delay:0})}harvest(e,t,n,i){if(this.harvestParts.delete(`${e}:${i}`),!this.ready(e))return!1;if(t==="wood"||t==="stone"){const r=`${e}:${n}`,a=this.buildings.get(e)?.children.find(o=>o.userData.treeIndex===n);if(!a||this.treeCycles.has(r))return!1;if(this.treeCycles.set(r,{id:e,tree:a,age:0,scale:a.scale.clone()}),this.villagers.refreshNavigation(),t==="wood"){const o=new Le;o.position.copy(a.getWorldPosition(new I)),o.position.z-=.12;const l=vp("wood");o.add(l),l.scale.setScalar(1.65);const c=l.children.map(u=>({mesh:u,velocity:new I((Math.random()-.5)*.14,1+Math.random()*.35,(Math.random()-.5)*.14),spin:new I(Math.random()*3,Math.random()*2,Math.random()*3)}));o.visible=!1,this.scene.add(o),this.drops.set(r,{group:o,age:0,claimed:!1,pieces:c})}a.updateWorldMatrix(!0,!1),this.makeLoader(r,e,a.getWorldPosition(new I).add(new I(0,.5,0)),30)}else if(this.board.get(e)==="berry"||this.board.get(e)==="farm"||this.board.get(e)==="garden"){const r=this.fieldState(e);if(r.stock<=0)return!1;r.stock--;const a=this.workPoint(e,n);if(this.dust(a,6),this.board.get(e)==="berry"){const o=this.buildings.get(e)?.children.filter(l=>l.userData.plantOrder!==void 0)??[];o.slice(Math.floor(r.stock/r.max*o.length),Math.ceil((r.stock+1)/r.max*o.length)).forEach(l=>l.userData.hitAt=this.time)}if(r.stock===0){r.age=0;const o=rt(e);this.makeLoader(`field:${e}`,e,new I(o.x,st+.6,o.z),30)}}else if(this.board.get(e)==="fisher"&&!this.fishingSpot(e))return!1;return!0}updateStorageLabels(){const e=this.game;if(!e)return;const t=this.cameraControl.camera,n=this.el.clientHeight/((t.top-t.bottom)/t.zoom),i=Ze.smoothstep(n,42,100);for(const[r,a]of this.fullStores)(!e.storageStocks.has(r)||e.storageFree(r)>0)&&(a.remove(),this.fullStores.delete(r));for(const r of e.storageStocks.keys()){if(e.storageFree(r)>0||!this.ready(r))continue;let a=this.fullStores.get(r);a||(a=document.createElement("div"),a.className="storage-full",a.innerHTML=`${hn("full")}<span>Depo dolu</span>`,a.setAttribute("role","status"),this.el.append(a),this.fullStores.set(r,a));const o=this.screenPoint(r,1.1);a.style.left=`${o.x}px`,a.style.top=`${o.y}px`,a.style.opacity=String(i),a.style.setProperty("--status-scale",String(.35+.65*i)),a.hidden=i<.01}}woodImpact(e,t){const n=this.buildings.get(e)?.children.find(a=>a.userData.treeIndex===t);if(!n)return;this.woodHits.set(n,.2),n.updateWorldMatrix(!0,!1);const i=n.getWorldPosition(new I),r=this.board.get(e)==="stone";for(let a=0;a<(r?14:7);a++){const o=new Ke(this.moteGeo,r?a<2?this.sparkMat:this.stoneChipMat:this.moteMats[0]);o.scale.setScalar(.85),o.position.copy(i).add(new I(.02,.22,.16)),this.scene.add(o),this.motes.push({mesh:o,velocity:new I((Math.random()-.5)*.9,.65+Math.random()*.55,.25+Math.random()*.65),life:r?1.1:.7})}}fieldState(e){if(!this.fields.has(e)){const t=this.board.get(e)==="farm"?4:3;this.fields.set(e,{stock:t,max:t,age:0})}return this.fields.get(e)}resourceReady(e){const t=this.board.get(e);return t==="forest"||t==="stone"?this.pickTree(e,0)>=0:t==="berry"||t==="farm"||t==="garden"?this.fieldState(e).stock>0:t==="fisher"?!!this.fishingSpot(e):!0}coastalYaw(e,t=0,n=0){const i=rt(e),r=tn(e).filter(f=>!this.board.has(f)).map(f=>{const d=rt(f);return Math.atan2(d.x-i.x,d.z-i.z)});if(!r.length)return t;const a=(f,d)=>Ze.euclideanModulo(f-d+Math.PI,Math.PI*2)-Math.PI;let o=t;if(n&&r.length>1){const f=Math.sign(n);for(let d=0;d<Math.abs(n);d++){const m=r.map(v=>({a:v,d:Ze.euclideanModulo((v-o)*f,Math.PI*2)})).filter(v=>v.d>.04).sort((v,g)=>v.d-g.d)[0];m&&(o+=m.d*f)}return o}const l=[...this.board.keys()].map(rt),c=l.reduce((f,d)=>({x:f.x+d.x/l.length,z:f.z+d.z/l.length}),{x:0,z:0}),u=f=>{const d=i.x+Math.sin(f)*2.8,m=i.z+Math.cos(f)*2.8;return Math.min(...l.map(v=>Math.hypot(d-v.x,m-v.z)))+Math.hypot(d-c.x,m-c.z)*.15},h=r.sort((f,d)=>u(d)-u(f)||Math.abs(a(f,t))-Math.abs(a(d,t)))[0];return t+a(h,t)}alignFisheries(){for(const[e,t]of this.board)if(t==="fisher"){const n=this.buildings.get(e);if(!n)continue;const i=this.rotationTargets.get(e)??n.rotation.y;if(n.userData.manualCoast){const a=rt(e);if(!this.board.has(Wt(a.x+Math.sin(i)*1.75,a.z+Math.cos(i)*1.75)))continue;n.userData.manualCoast=!1}const r=this.coastalYaw(e,i);Math.abs(r-i)>.01&&this.rotationTargets.set(e,r)}}fishingSpot(e){const t=this.buildings.get(e);if(!t||this.board.get(e)!=="fisher"||!this.ready(e))return null;const n=rt(e),i=this.rotationTargets.get(e)??t.rotation.y,r=Math.sin(i),a=Math.cos(i),o=new I(n.x+r*1.75,ti+.03,n.z+a*1.75);return this.board.has(Wt(o.x,o.z))?null:{stand:new I(n.x+r*.94,st,n.z+a*.94),water:o}}makeLoader(e,t,n,i){this.loaders.get(e)?.el.remove();const r=document.createElement("div");r.className="regrowth-loader",r.innerHTML="<i></i><span></span>",r.setAttribute("aria-label","Yeniden büyüyor"),this.el.append(r),this.loaders.set(e,{id:t,el:r,point:n,total:i})}updateLoader(e,t){const n=this.loaders.get(e);if(!n)return;if(!this.board.has(n.id)||t>=n.total){n.el.remove(),this.loaders.delete(e);return}const i=this.cameraControl.camera,r=this.el.clientHeight/((i.top-i.bottom)/i.zoom),a=Ze.smoothstep(r,42,100);n.el.style.opacity=String(a),n.el.hidden=a<.01;const o=n.point.clone().project(i);n.el.style.left=`${(o.x+1)*this.el.clientWidth/2}px`,n.el.style.top=`${(1-o.y)*this.el.clientHeight/2}px`,n.el.style.setProperty("--progress",`${t/n.total*360}deg`),n.el.querySelector("span").textContent=`${Math.ceil(n.total-t)}s`}addTrail(e){const t=new vt;for(let n=1;n<e.length;n++){const i=e[n-1],r=e[n],a=Math.ceil(Math.hypot(r.x-i.x,r.z-i.z)/.16);for(let o=0;o<=a;o++){const l=Ze.lerp(i.x,r.x,o/Math.max(1,a)),c=Ze.lerp(i.z,r.z,o/Math.max(1,a)),u=`${Math.round(l/.13)}:${Math.round(c/.13)}`;if(this.trailKeys.has(u)||this.trailPoints.length>=8e3)continue;this.trailKeys.add(u);const h=Wt(l,c);this.trailPoints.push({tile:h,x:l,z:c}),t.position.set(l,st+.007,c),t.rotation.y=n+o*.8,t.scale.set(1,.7,.8),t.updateMatrix(),this.trails.setMatrixAt(this.trailPoints.length-1,t.matrix)}}this.trails.count=this.trailPoints.length,this.trails.instanceMatrix.needsUpdate=!0}screenPoint(e,t=.7){const n=rt(e),i=new I(n.x,t,n.z).project(this.cameraControl.camera);return{x:(i.x+1)*this.el.clientWidth/2,y:(1-i.y)*this.el.clientHeight/2}}inspectPointer(e){if(this.selected||e.buttons||document.querySelector("dialog[open]")){this.onInspect(-1,0,0,null);return}const t=this.grid.pick(e.clientX,e.clientY,this.cameraControl.camera,this.el);if(!this.board.has(t)){this.onInspect(-1,0,0,null),this.renderer.domElement.style.cursor="";return}this.renderer.domElement.style.cursor="pointer";const n=rt(t),i=Array.from({length:6},(r,a)=>{const o=ur(a),l=new I(n.x+o.x,st,n.z+o.z).project(this.cameraControl.camera);return{x:(l.x+1)*this.el.clientWidth/2,y:(1-l.y)*this.el.clientHeight/2}});this.onInspect(t,e.clientX,e.clientY,{left:Math.min(...i.map(r=>r.x)),right:Math.max(...i.map(r=>r.x)),top:Math.min(...i.map(r=>r.y))-35,bottom:Math.max(...i.map(r=>r.y))})}holdSelection(){this.placementQueued=!0,this.cameraControl.setPlacement(!1)}get placementRotation(){return this.placedManualCell=this.ghostManualCell,this.desiredGhostYaw}rotateSelection(e){if(this.lastRotationWake=this.time-.06,this.villagers.refreshNavigation(),this.selected&&!this.selected.event)this.selected.id==="fisher"&&(this.ghostManualCell=this.hover),this.desiredGhostYaw=this.selected.id==="fisher"&&this.hover>=0?this.coastalYaw(this.hover,this.desiredGhostYaw,e):this.desiredGhostYaw+e*Math.PI/3;else if(this.editing>=0&&!this.placing){const t=this.buildings.get(this.editing);if(t){this.board.get(this.editing)==="fisher"&&(t.userData.manualCoast=!0);const n=this.rotationTargets.get(this.editing)??t.rotation.y;this.rotationTargets.set(this.editing,this.board.get(this.editing)==="fisher"?this.coastalYaw(this.editing,n,e):n+e*Math.PI/3)}}}get placing(){return this.builds.length>0||this.demolitions.length>0}editTile(e){this.editing=e,this.wheelRotation=0,this.grid.setHover(e,!0,e>=0),this.onTileSelect(e)}demolish(e,t){const n=this.buildings.get(t);n&&(this.editTile(-1),this.rotationTargets.delete(t),this.board=e,this.grid.rebuild(e),this.grid.showAvailable(!1,this.valid),this.environment.demolish(e,t),this.demolitions.push({id:t,group:n,time:0}))}point(e,t){if(this.placementQueued)return this.hover;const i=document.elementFromPoint(e,t)===this.renderer.domElement?this.grid.pick(e,t,this.cameraControl.camera,this.el):-1;return this.setHover(i),i}stirSea(e){if(e.buttons||this.selected||e.pointerType==="touch"){this.lastSea=null;return}const t=this.renderer.domElement.getBoundingClientRect();if(this.seaRay.setFromCamera(new Oe((e.clientX-t.left)/t.width*2-1,1-(e.clientY-t.top)/t.height*2),this.cameraControl.camera),!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(Wt(this.seaPoint.x,this.seaPoint.z))){this.lastSea=null;return}const{x:n,z:i}=this.seaPoint,r=performance.now()/1e3,a=this.lastSea;if(a&&r-a.time<.04||(this.lastSea={x:n,z:i,time:r},!a||r-a.time>.25))return;const o=n-a.x,l=i-a.z,c=Math.hypot(o,l);c<.025||c>2||this.environment.stir(n,i,o/c,l/c,Math.min(1,c/(r-a.time)/12),c)}setHover(e,t=!1){if(this.editing>=0&&!this.selected){this.grid.setHover(this.editing,!0,!0);return}if(!t&&e===this.hover)return;this.hover=e;const n=e>=0&&this.valid(e);if(this.grid.setHover(e,n,!!this.selected),this.ghost){const i=this.ghost.visible;this.ghost.visible=e>=0,e>=0&&(this.selected?.id==="fisher"&&this.ghostManualCell!==e&&(this.desiredGhostYaw=this.coastalYaw(e,this.desiredGhostYaw)),this.ghostTarget.copy(gi(e,this.board.has(e)?st+.035:st+.025)),i||this.ghost.position.copy(this.ghostTarget),this.ghostPalette.forEach(({mat:r,base:a})=>{r.color.copy(a).lerp(new fe(n?12969902:15304821),n?.04:.65),r.opacity=n?1:.45,r.transparent=!n,r.depthWrite=n}))}if(this.previewLand&&(this.ghost?.remove(this.previewLand),this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&n&&!this.selected?.event&&!this.board.has(e)){const i=new Map(this.board);i.set(e,this.selected.id),this.previewLand=new Ke(ya(e,i),this.previewLandMat),this.previewLand.position.y=-st-.025/.7,this.previewLand.receiveShadow=!0,this.ghost.add(this.previewLand)}this.onHover(e)}setSelection(e,t=!1){this.ghostManualCell=-1,this.editTile(-1),this.onInspect(-1,0,0,null);const n=!!e&&e===this.selected,i=n?this.desiredGhostYaw:0,r=n?this.ghostModel?.rotation.y??i:0;this.cameraControl.setPlacement(t),this.previewLand&&(this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&(this.scene.remove(this.ghost),this.ghost=null),this.ghostPalette.forEach(a=>a.mat.dispose()),this.ghostPalette=[],this.selected=e,this.fisherOffset=n?this.fisherOffset:0,this.placementQueued=!1,this.ghostModel=null,this.desiredGhostYaw=i,this.wheelRotation=0,e&&(this.ghost=new Le,this.ghostModel=Ma(e.id),this.ghostModel.rotation.y=r,this.ghost.add(this.ghostModel),this.ghost.scale.setScalar(.7),this.ghost.traverse(a=>{if(a instanceof Ke){const o=a.material.clone();this.ghostPalette.push({mat:o,base:o.color.clone()}),o.transparent=!0,o.opacity=.72,o.depthWrite=!1,a.material=o,a.castShadow=!1,a.receiveShadow=!1,a.renderOrder=0}}),this.scene.add(this.ghost),this.ghost.visible=!1),this.grid.showAvailable(!!e&&!e.event,this.valid),this.setHover(-1,!0)}sync(e,t=-1,n=0,i=!1){const r=this.buildings.size===0;if(this.board=e,this.villagers.refreshNavigation(),this.trailPoints.some(a=>!e.has(a.tile))){const a=this.trailPoints.filter(o=>e.has(o.tile));this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const o of a)this.addTrail([o,{...o,x:o.x+.001}])}if(r||t>=0||i){this.grid.rebuild(e),this.environment.sync(e,t);const a=[...e.keys()].map(rt);this.cameraControl.frameIsland(a,r);const o=(Math.max(...a.map(u=>u.x))+Math.min(...a.map(u=>u.x)))/2,l=(Math.max(...a.map(u=>u.z))+Math.min(...a.map(u=>u.z)))/2,c=Math.max(3,...a.map(u=>Math.hypot(u.x-o,u.z-l)+2));this.sun.target.position.set(o,0,l),this.sun.position.set(o-5,10,l+4),Object.assign(this.sun.shadow.camera,{left:-c,right:c,top:c,bottom:-c,far:35+c}),this.sun.shadow.camera.updateProjectionMatrix()}e.forEach((a,o)=>{const l=this.buildings.get(o);if(!a){l&&(this.root.remove(l),this.buildings.delete(o));return}if(l)return;const c=o===pt&&a==="house"?Hw():Ma(a),u=new Ke(this.contactGeo,this.contact);u.position.y=.0025,u.renderOrder=1,c.add(u),c.scale.setScalar(["house","manor","store","lumber","fisher"].includes(a)?qo:["berry","farm"].includes(a)?.75:1),c.position.copy(gi(o)),this.root.add(c),this.buildings.set(o,c),o===t&&(a==="fisher"&&this.placedManualCell===o&&(c.userData.manualCoast=!0),c.rotation.y=n,c.scale.setScalar(.01),c.visible=!1,c.position.y-=.74,this.builds.push({id:o,group:c,time:0,kind:a}))}),this.alignFisheries()}pulse(e,t){const n=new qt({color:t,transparent:!0,opacity:.8,depthWrite:!1}),i=new Ke(this.ringGeo,n);i.position.copy(gi(e,st+.024)),i.renderOrder=4,this.scene.add(i),this.rings.push({mesh:i,time:0})}burst(e){this.pulse(e,16768922);for(let t=0;t<14;t++){const n=t/14*Math.PI*2,i=new Ke(this.moteGeo,this.moteMats[t%3]);i.position.copy(gi(e,.18)),i.position.x+=Math.cos(n)*.22,i.position.z+=Math.sin(n)*.22,this.scene.add(i),this.motes.push({mesh:i,velocity:new I(Math.cos(n)*.62,.62+Math.random()*.7,Math.sin(n)*.62),life:1})}}feedback(e,t,n=[]){e.rows.filter(i=>i.wood||i.food||i.happy||!i.active).forEach((i,r)=>{const a=document.createElement("div");a.className="float"+(i.bonus?" bonus":""),a.textContent=[i.wood&&`+${i.wood} odun`,i.food&&`+${i.food} yiyecek`,i.happy&&`+${i.happy} refah`,!i.active&&"İşçi bekliyor"].filter(Boolean).join(" · "),a.style.opacity="0",this.el.append(a),this.labels.push({el:a,position:gi(i.i,1.05),life:1.4,delay:(i.i===t?1.5:.1)+r*.035}),(n.includes(i.i)||i.bonus&&i.i===t)&&this.pulse(i.i,16242041)})}reset(){for(const e of this.fullStores.values())e.remove();this.fullStores.clear(),this.placedManualCell=-1,this.setSelection(null),this.cameraControl.reset(),this.treeCycles.clear(),this.woodHits.clear(),this.fields.clear(),this.harvestParts.clear(),this.loaders.forEach(e=>e.el.remove()),this.loaders.clear(),this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const e of this.drops.values())this.scene.remove(e.group);this.drops.clear(),this.storageDecor.clear(),this.root.clear(),this.environment.reset(),this.buildings.clear(),this.builds=[],this.demolitions=[],this.rotationTargets.clear();for(const{el:e}of this.labels)e.remove();this.labels=[];for(const{mesh:e,dust:t}of this.motes)this.scene.remove(e),t&&e.material.dispose();this.motes=[];for(const{mesh:e}of this.rings)this.scene.remove(e),e.material.dispose();this.rings=[]}frame=e=>{const t=Math.min(.065,(e-this.previousTime)/1e3);if(this.previousTime=e,this.time+=t,this.cameraControl.update(t),this.environment.update(this.time),this.ghost?.visible&&(this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-32*t)),this.ghostModel)){const n=this.desiredGhostYaw-this.ghostModel.rotation.y;if(this.ghostModel.rotation.y+=n*(1-Math.exp(-16*t)),Math.abs(n)>.025&&this.time-this.lastRotationWake>.05&&this.valid(this.hover)){const i=this.ghostModel.rotation.y,r=Math.sign(n),a=this.ghost.position;this.environment.stir(a.x+Math.cos(i)*.68,a.z+Math.sin(i)*.68,-Math.sin(i)*r,Math.cos(i)*r,.32,.1),this.lastRotationWake=this.time}}for(const[n,i]of this.rotationTargets){const r=this.buildings.get(n);if(!r){this.rotationTargets.delete(n);continue}this.villagers.refreshNavigation();const a=i-r.rotation.y;if(r.rotation.y+=a*(1-Math.exp(-16*t)),Math.abs(a)<.001)r.rotation.y=i,this.rotationTargets.delete(n);else if(this.time-this.lastRotationWake>.05){const o=r.rotation.y,l=Math.sign(a);this.environment.stir(r.position.x+Math.cos(o)*.8,r.position.z+Math.sin(o)*.8,-Math.sin(o)*l,Math.cos(o)*l,.35,.1),this.lastRotationWake=this.time}}this.demolitions=this.demolitions.filter(n=>{n.time+=t;const i=Mn(n.time,jc,$c);return n.group.position.y=st-1.6*i,n.group.scale.setScalar(1-.7*i),n.group.rotation.z=Math.sin(n.time*25)*Math.sin(i*Math.PI)*.035,n.time>=dp?(this.root.remove(n.group),this.buildings.delete(n.id),this.sync(this.board,-1,0,!0),!1):!0}),this.builds=this.builds.filter(n=>{const i=n.time;if(n.time=Math.min(Zs,n.time+t),n.group.visible=n.time>=ca,n.time<ca)return!0;i<1.42&&n.time>=1.42&&this.burst(n.id);const r=Mn(n.time,ca,Zs),a=Math.sin(Math.PI*r)*.14,o=["house","manor","store","lumber","fisher"].includes(n.kind)?qo:["berry","farm"].includes(n.kind)?.75:1;return n.group.scale.set(Math.max(.01,(r+a)*o),Math.max(.01,(r+a*1.6)*o),Math.max(.01,(r+a)*o)),n.group.position.y=st-.24*(1-r),n.kind==="berry"&&n.group.children.forEach(l=>{if(l.userData.plantOrder!==void 0){const c=Mn(n.time,ca+l.userData.plantOrder*.018,Zs);l.scale.setScalar(Math.max(.01,c))}}),n.time>=Zs&&this.villagers.refreshNavigation(),n.time<Zs});for(const[n,i]of this.drops){const r=Number(n.split(":")[0]);if(!this.board.has(r)){this.scene.remove(i.group),this.drops.delete(n);continue}const a=i.age;if(i.age+=t,i.group.visible=i.age>.72,a<=.72&&i.age>.72&&this.dust(i.group.position,28),i.age>.72)for(const l of i.pieces)l.velocity.y-=t*3.5,l.mesh.position.addScaledVector(l.velocity,t),l.mesh.position.y<.035&&(l.mesh.position.y=.035,l.velocity.y=Math.abs(l.velocity.y)*.27,l.velocity.x*=.75,l.velocity.z*=.75,l.spin.multiplyScalar(.65)),l.velocity.x*=Math.exp(-t*1.8),l.velocity.z*=Math.exp(-t*1.8),l.mesh.rotation.x+=l.spin.x*t,l.mesh.rotation.z+=l.spin.z*t;for(let l=0;l<i.pieces.length;l++)for(let c=l+1;c<i.pieces.length;c++){const u=i.pieces[l],h=i.pieces[c],f=h.mesh.position.x-u.mesh.position.x,d=h.mesh.position.z-u.mesh.position.z,m=Math.hypot(f,d);if(m>0&&m<.07&&Math.abs(u.mesh.position.y-h.mesh.position.y)<.055){const v=(.07-m)*.5;u.mesh.position.x-=f/m*v,h.mesh.position.x+=f/m*v,u.mesh.position.z-=d/m*v,h.mesh.position.z+=d/m*v}}const o=rt(r);for(const l of i.pieces){const c=i.group.position.x+l.mesh.position.x*1.65-o.x,u=i.group.position.z+l.mesh.position.z*1.65-o.z,h=Math.hypot(c,u);h>.63&&(l.mesh.position.x=(o.x+c/h*.63-i.group.position.x)/1.65,l.mesh.position.z=(o.z+u/h*.63-i.group.position.z)/1.65,l.velocity.x*=-.2,l.velocity.z*=-.2)}}for(const n of this.storageDecor.values()){const i=this.time-(n.userData.upgradedAt??-99);n.scale.setScalar(1+(i<1?Math.sin(i*Math.PI)*.13:0))}this.villagers.update(document.hidden?0:t),this.villagers.updateStatuses(this.cameraControl.camera,this.el.clientWidth,this.el.clientHeight),this.updateStorageLabels();for(const[n,i]of this.woodHits){const r=i-t;n.rotation.x=Math.sin(r*45)*.035*Math.max(0,r/.2),r<=0?(n.rotation.x=0,this.woodHits.delete(n)):this.woodHits.set(n,r)}for(const[n,i]of this.treeCycles){if(!this.board.has(i.id)){this.updateLoader(n,99),this.treeCycles.delete(n);continue}i.age+=t,this.updateLoader(n,i.age),this.board.get(i.id)==="stone"&&i.age<.85?(i.tree.scale.copy(i.scale).multiplyScalar(1-Mn(i.age,0,.85)),i.tree.position.y=-.08*Mn(i.age,0,.85)):i.age<.85?(i.tree.rotation.z=Mn(i.age,0,.85)*1.5,i.tree.scale.copy(i.scale).multiplyScalar(1-.12*i.age/.85)):i.age<26?i.tree.visible=!1:(i.tree.visible=!0,i.tree.rotation.z=0,i.tree.position.y=0,i.tree.scale.copy(i.scale).multiplyScalar(Math.max(.01,Mn(i.age,26,30)))),i.age>=30&&(i.tree.scale.copy(i.scale),this.treeCycles.delete(n),this.villagers.refreshNavigation())}for(const[n,i]of this.fields){if(!this.board.has(n)){this.updateLoader(`field:${n}`,99),this.fields.delete(n);continue}const r=this.board.get(n),a=30;i.stock===0&&(i.age+=t,this.updateLoader(`field:${n}`,i.age),i.age>=a&&(i.stock=i.max,i.age=0));const o=[...this.harvestParts.values()].filter(u=>u.id===n).reduce((u,h)=>u+h.progress,0),l=i.stock===0?Mn(i.age,a-4,a):Math.max(0,(i.stock-o)/i.max),c=this.buildings.get(n)?.children.filter(u=>u.userData.plantOrder!==void 0||u.userData.cropOrder!==void 0||u.userData.flowerOrder!==void 0)??[];c.forEach((u,h)=>{const f=this.time-(u.userData.hitAt??-99);u.rotation.z=f<.55?Math.sin(f*30)*.16*(1-f/.55):0;const d=Ze.clamp(l*c.length-h,0,1);r==="farm"?u.scale.y=.08+.92*d:u.children.slice(1).forEach(m=>m.scale.setScalar(Math.max(.01,d)))})}this.motes=this.motes.filter(n=>(n.life-=t*(n.dust?1:1.15),n.velocity.y-=t*(n.dust?.12:2.7),n.mesh.position.addScaledVector(n.velocity,t),n.mesh.position.y<st+.015&&(n.mesh.position.y=st+.015,n.velocity.y=Math.abs(n.velocity.y)*.28,n.velocity.x*=.85,n.velocity.z*=.85),n.mesh.scale.setScalar(n.dust?2.5+(1.8-n.life)*3:Math.max(0,Math.min(1.5,n.life))),n.dust&&(n.mesh.material.opacity=Math.min(.42,n.life*.4)),n.life<=0&&(this.scene.remove(n.mesh),n.dust&&n.mesh.material.dispose()),n.life>0)),this.rings=this.rings.filter(n=>{n.time+=t*1.65,n.mesh.scale.setScalar(.4+n.time*1.15);const i=n.mesh.material;return i.opacity=Math.max(0,1-n.time)*.7,n.time>=1&&(this.scene.remove(n.mesh),i.dispose()),n.time<1}),this.labels=this.labels.filter(n=>{if(n.delay>0)return n.delay-=t,!0;n.life-=t,n.position.y+=t*.38;const i=this.projection.copy(n.position).project(this.cameraControl.camera);return n.el.style.left=`${(i.x+1)*.5*this.el.clientWidth}px`,n.el.style.top=`${(1-i.y)*.5*this.el.clientHeight}px`,n.el.style.opacity=String(Math.max(0,Math.min(1,n.life*2.8))),n.life<=0&&n.el.remove(),n.life>0}),this.renderer.render(this.scene,this.cameraControl.camera)};thumbnails(){const e={},t=new Lu;t.add(new Yu(16774109,8557944,1.65));const n=new Hl(16769464,2.55);n.position.set(-3,5,4),t.add(n);const i=new Tr(-.96,.96,.75,-.75,.1,20);i.position.set(2.9,2.25,3.7),i.lookAt(0,.43,0);const r=new Eh({alpha:!0,antialias:!0});r.setSize(280,220),r.toneMapping=rl;for(const a of vi){const o=Ma(a.id);ft(o,new kt(.72,.75,.068,6),10336124,0,-.034,0),t.add(o),r.render(t,i),e[a.id]=r.domElement.toDataURL(),t.remove(o)}return r.dispose(),r.forceContextLoss(),e}}class Gw{constructor(e,t){this.hand=e,this.callbacks=t;const n={signal:this.listeners.signal};e.addEventListener("pointerdown",this.onDown,n),window.addEventListener("pointermove",this.onMove,{...n,passive:!1}),window.addEventListener("pointerup",this.onUp,n),window.addEventListener("pointercancel",this.onPointerCancel,n),e.addEventListener("lostpointercapture",this.onLostCapture,n),e.addEventListener("click",this.onClick,{...n,capture:!0}),e.addEventListener("dragstart",this.onNativeDrag,n),window.addEventListener("keydown",this.onKey,n),window.addEventListener("blur",this.onBlur,n),document.addEventListener("visibilitychange",this.onVisibility,n)}hand;callbacks;gesture=null;listeners=new AbortController;settling=new Set;disposed=!1;animationFrame=0;cardFrom(e){if(!(e instanceof Element))return null;const t=e.closest("[data-card]");return t&&this.hand.contains(t)?t:null}isAvailable(e,t){return Number.isInteger(t)&&!e.matches(':disabled, [disabled], [aria-disabled="true"]')&&this.callbacks.canStart(t)}onDown=e=>{if(this.disposed||this.gesture||!e.isPrimary||e.button!==0)return;const t=this.cardFrom(e.target);if(!t)return;const n=Number(t.dataset.card);if(!this.isAvailable(t,n))return;const i=t.getBoundingClientRect(),r=t.offsetWidth||i.width,a=t.offsetHeight||i.height;this.gesture={pointerId:e.pointerId,index:n,source:t,origin:i,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,width:r,height:a,anchorX:Math.min(1,Math.max(0,(e.clientX-i.left)/i.width)),anchorY:Math.min(1,Math.max(0,(e.clientY-i.top)/i.height)),started:!1,valid:!1,ghost:null,visualX:e.clientX,visualY:e.clientY,tilt:0,visualTilt:0},e.preventDefault();try{this.hand.setPointerCapture(e.pointerId)}catch{}};onMove=e=>{const t=this.gesture;if(!(!t||e.pointerId!==t.pointerId)){if(e.preventDefault(),!t.started){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<4)return;if(!this.isAvailable(t.source,t.index)){this.cancel();return}t.started=!0,t.visualX=e.clientX,t.visualY=e.clientY;const n=t.source.cloneNode(!0);n.removeAttribute("id"),n.removeAttribute("data-card"),n.removeAttribute("aria-pressed"),n.querySelectorAll("[id]").forEach(i=>i.removeAttribute("id")),n.classList.remove("selected","drag-source"),n.classList.add("drag-card"),n.setAttribute("aria-hidden","true"),n.setAttribute("inert",""),n.tabIndex=-1,Object.assign(n.style,{position:"fixed",left:"0",top:"0",margin:"0",width:`${t.width}px`,height:`${t.height}px`,pointerEvents:"none",zIndex:"100",transition:"none",transformOrigin:"50% 50%",willChange:"transform"}),t.ghost=n,document.body.append(n),document.body.classList.add("is-dragging"),this.callbacks.start(t.index),this.hand.querySelector(`[data-card="${t.index}"]`)?.classList.add("drag-source"),t.source.classList.add("drag-source"),this.follow(t,performance.now())}this.gesture===t&&(t.valid=this.callbacks.move(e.clientX,e.clientY),t.ghost?.classList.toggle("drop-valid",t.valid),t.ghost?.classList.toggle("drop-invalid",!t.valid),t.tilt=Math.max(-7,Math.min(7,(e.clientX-t.lastX)*.22)),t.lastX=e.clientX,t.lastY=e.clientY)}};follow(e,t){if(this.gesture!==e||!e.ghost)return;const n=performance.now(),i=Math.min(.05,Math.max(.001,(n-t)/1e3)),r=1-Math.exp(-38*i);e.visualX+=(e.lastX-e.visualX)*r,e.visualY+=(e.lastY-e.visualY)*r,e.visualTilt+=(e.tilt-e.visualTilt)*(1-Math.exp(-22*i)),e.tilt*=Math.exp(-12*i),e.ghost.style.transform=this.followTransform(e),this.animationFrame=requestAnimationFrame(()=>this.follow(e,n))}followTransform(e){const n=e.visualX-e.width*(.5+(e.anchorX-.5)*.84),i=e.visualY-e.height*(.5+(e.anchorY-.5)*.84);return`translate3d(${n}px, ${i}px, 0) rotate(${e.visualTilt}deg) scale(${.84})`}onUp=e=>{const t=this.gesture;if(!t||e.pointerId!==t.pointerId||(!t.started&&Math.hypot(e.clientX-t.startX,e.clientY-t.startY)>=4&&this.onMove(e),this.gesture!==t))return;if(this.release(t),!t.started){this.isAvailable(t.source,t.index)&&this.callbacks.tap(t.index);return}t.lastX=e.clientX,t.lastY=e.clientY;const i=this.callbacks.move(e.clientX,e.clientY)&&this.callbacks.drop(e.clientX,e.clientY);i||this.callbacks.cancel(),this.settle(t,i)};release(e){this.gesture=null,cancelAnimationFrame(this.animationFrame),this.animationFrame=0,document.body.classList.remove("is-dragging"),e.source.classList.remove("drag-source"),this.hand.querySelectorAll(".drag-source").forEach(t=>t.classList.remove("drag-source")),this.hand.hasPointerCapture(e.pointerId)&&this.hand.releasePointerCapture(e.pointerId)}settle(e,t){const n=e.ghost;if(!n)return;if(t){n.remove();return}n.classList.remove("drop-valid","drop-invalid"),this.settling.add(n);const r=this.hand.querySelector(`[data-card="${e.index}"]`)?.getBoundingClientRect()??e.origin,a=r.left+(r.width-e.width)/2,o=r.top+(r.height-e.height)/2,l=t?`translate3d(${e.lastX-e.width/2}px, ${e.lastY-e.height/2}px, 0) scale(.15)`:`translate3d(${a}px, ${o}px, 0) rotate(0deg) scale(1)`,c=matchMedia("(prefers-reduced-motion: reduce)").matches?0:t?180:280;n.animate([{transform:n.style.transform||this.followTransform(e),opacity:1},{transform:l,opacity:t?0:.2}],{duration:c,easing:"cubic-bezier(.2,.8,.25,1)",fill:"forwards"}).finished.catch(()=>{}).then(()=>{n.remove(),this.settling.delete(n)})}cancel(){const e=this.gesture;e&&(this.release(e),e.started&&(this.callbacks.cancel(),this.settle(e,!1)))}onClick=e=>{const t=this.cardFrom(e.target);if(t&&(e.preventDefault(),e.stopImmediatePropagation(),e.detail===0&&!this.gesture)){const n=Number(t.dataset.card);this.isAvailable(t,n)&&this.callbacks.tap(n)}};onNativeDrag=e=>{e.preventDefault()};onPointerCancel=e=>{e.pointerId===this.gesture?.pointerId&&this.cancel()};onLostCapture=e=>{e.pointerId===this.gesture?.pointerId&&this.cancel()};onKey=e=>{e.key==="Escape"&&this.gesture&&(e.preventDefault(),this.cancel())};onBlur=()=>{this.cancel()};onVisibility=()=>{document.hidden&&this.cancel()};dispose(){this.cancel(),this.disposed=!0,this.listeners.abort(),this.settling.forEach(e=>{e.getAnimations().forEach(t=>t.cancel()),e.remove()}),this.settling.clear()}}const gf={hover:[["card-slide-1","card-slide-3"],.16],lift:[["card-fan-1","card-fan-2"],.39],drop:[["card-place-1","card-place-3"],.45],earth:[["footstep_grass_001","footstep_grass_003"],.46],build:[["impactWood_light_000","impactWood_light_003"],.33],reward:[["chip-lay-2"],.22],bonus:[["chips-stack-3"],.3],turn:[["card-shove-2"],.2],invalid:[["impactSoft_medium_002"],.27]},vf=s=>Math.max(0,Math.min(1,s));class Ww{muted=!1;levels={master:.72,sfx:.7,ambience:.36};ctx=null;buses={};wave=null;clips=new Map;live=new Set;pending=new Set;lastHover=0;constructor(){try{const t=JSON.parse(localStorage.getItem("lk-audio-v2")||"{}");this.muted=typeof t.muted=="boolean"?t.muted:localStorage.getItem("lk-mute")==="1";for(const n of Object.keys(this.levels))Number.isFinite(t[n])&&(this.levels[n]=vf(t[n]))}catch{}const e=()=>this.unlock();window.addEventListener("pointerdown",e,{passive:!0}),window.addEventListener("keydown",e),document.addEventListener("visibilitychange",()=>{document.hidden?(this.wave?.pause(),this.cancel()):this.apply()})}unlock(){if(window.AudioContext){if(!this.ctx){this.ctx=new AudioContext;const e=this.ctx.createGain();e.connect(this.ctx.destination),this.buses.master=e;for(const i of["sfx","ambience"]){const r=this.ctx.createGain();r.connect(e),this.buses[i]=r}const t=new Audio(new URL("audio/shore.mp3",document.baseURI).href);t.preload="none",t.loop=!0,this.wave=t,this.ctx.createMediaElementSource(t).connect(this.buses.ambience);const n=new Set(Object.values(gf).flatMap(([i])=>[...i]));for(const i of n)fetch(new URL("audio/"+i+".ogg",document.baseURI)).then(r=>{if(!r.ok)throw Error(i);return r.arrayBuffer()}).then(r=>this.ctx.decodeAudioData(r)).then(r=>this.clips.set(i,r)).catch(()=>{});this.apply()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0&&this.wave.play().catch(()=>{})}}set(e,t){this.levels[e]=vf(t),this.apply(),this.save()}toggle(){this.muted=!this.muted,this.apply(),this.save()}save(){try{localStorage.setItem("lk-audio-v2",JSON.stringify({...this.levels,muted:this.muted}))}catch{}}apply(){if(this.ctx){for(const e of["master","sfx","ambience"]){const t=e==="master"&&this.muted?0:this.levels[e];this.buses[e]?.gain.setTargetAtTime(t*t,this.ctx.currentTime,.035)}this.muted||document.hidden||!this.levels.ambience||!this.levels.master?this.wave?.pause():this.wave?.paused&&this.wave.play().catch(()=>{})}}play(e){if(this.muted||document.hidden||!this.ctx||this.ctx.state!=="running"||this.live.size>=3)return;if(e==="hover"){if(performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}const[t,n]=gf[e],i=this.clips.get(t[Math.floor(Math.random()*t.length)]);if(!i)return;const r=this.ctx.createBufferSource();r.buffer=i,r.playbackRate.value=.92+Math.random()*.1;const a=this.ctx.createGain();a.gain.value=n*(.9+Math.random()*.13),r.connect(a).connect(this.buses.sfx),r.onended=()=>{this.live.delete(r),r.disconnect(),a.disconnect()},this.live.add(r),r.start()}sequence(e,t,n){this.cancel(),this.play("drop");const i=(r,a)=>{const o=window.setTimeout(()=>{this.pending.delete(o),this.play(r)},a);this.pending.add(o)};e||i("earth",145),t&&i("build",325),i(n?"bonus":"reward",520),i("turn",855)}cancel(){for(const e of this.pending)clearTimeout(e);this.pending.clear()}}const qc=document.querySelector("#app");qc.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${hn("help")}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${hn("reset")}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <button id="population-toggle" aria-expanded="false" aria-controls="work-panel">${hn("people")}<span>Görevler</span><b id="population-badge">1</b></button>
 <section id="work-panel" hidden aria-label="Nüfus görev dağılımı"><header><strong>İş öncelikleri</strong><button data-work-balance>Dengele</button><button data-work-close aria-label="Kapat">×</button></header><p id="work-summary"></p><div id="work-rows"></div></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;const Ie=s=>qc.querySelector(s),Yi=Ie("#hand"),Fa=Ie("#placement"),Sa=Ie("#log"),vn=Ie("dialog"),tt=new Vw(Ie("#world")),Xw=tt.thumbnails(),_n=new Ww;let Me=new Mf,Gt=null,Ns,oc,Us=!1,ws=null,Hi=-1;function Kc(s){return s.cost<=Me.wood&&(s.id!=="festival"||Me.food>=3)}function Mi(s,e=!1){s||(ws=null),Gt=s,Ie("#event-target").hidden=!s?.event,tt.setSelection(s,e),Yi.classList.toggle("choosing",!!s),Yi.querySelectorAll("[data-card]").forEach(t=>{const n=!!s&&Me.hand[Number(t.dataset.card)]===s;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),Ie(".hand-label span").textContent=s?s.event?"Adanın üzerine bırak":"Kıyıya bırak · Tekerlek / R ile döndür":"Bir kartı adaya sürükle"}function nr(s){Fa.textContent=s,Fa.hidden=!s}tt.valid=s=>!!Gt&&s>=0&&Me.valid(Gt,s);tt.onHover=s=>{if(!Gt||s<0){nr("");return}if(!tt.valid(s)){nr(Gt.event?"Mevcut karaya bırak":Me.wouldSealFishery(s)?"Balıkçının son kıyısı açık kalmalı":"Yalnızca kıyıdaki boş bir altıgene bırak"),Fa.dataset.valid="false";return}if(Fa.dataset.valid="true",Gt.event){nr(Gt.desc);return}const e=Me.preview(Gt,s),t=[e.stone&&`+${e.stone} taş / teslimat`,e.wood&&`+${e.wood} odun / teslimat`,e.food&&`+${e.food} yiyecek / teslimat`,e.happy&&`+${e.happy} refah / teslimat`,e.people&&`+${e.people} nüfus`].filter(Boolean),n=e.localBonus||e.neighbors.length>0;nr((n?"Komşuluk · ":"")+(t.join("  ·  ")||"Yerleşime uygun"))};function Zc(s){clearTimeout(oc),Sa.textContent=s,Sa.classList.add("visible"),oc=window.setTimeout(()=>Sa.classList.remove("visible"),2400)}function Za(s){if(!Gt||s<0||!tt.valid(s))return!1;if(Us)return ws=s,tt.holdSelection(),nr("Ada hazırlanıyor…"),!0;const e=tt.placementRotation,t=Gt,n=Me.preview(t,s);return Me.play(t,s)?(Us=!0,_n.sequence(!!t.event,["house","manor","store","lumber"].includes(t.id),n.localBonus||n.neighbors.length>0),Mi(null),tt.sync(Me.board,t.event?-1:s,e),t.event&&tt.burst(s),eu(),Zc(t.event?`${t.name} uygulandı`:`${t.name} · yerleşim hazırlanıyor`),Yi.animate([{opacity:.35,transform:"translateY(17px)"},{opacity:1,transform:"translateY(0)"}],{duration:330,easing:"ease-out"}),clearTimeout(Ns),Ns=window.setTimeout(Jc,2e3),!0):!1}function Jc(){if(tt.placing){Ns=window.setTimeout(Jc,100);return}if(Us=!1,ws!==null){const s=ws;ws=null,Za(s)}}tt.onTileSelect=s=>{Hi=s;const e=Ie("#tile-editor");if(e.hidden=s<0,s<0){Ie("#storage-upgrade").hidden=!0;return}Ie("#tile-editor strong").textContent=s===pt?"Krallık merkezi":vi.find(n=>n.id===Me.board.get(s))?.name??"Yerleşim",Ie("#tile-editor small").textContent=s===pt?"Merkez korunur · R / tekerlek ile döndür":"R / tekerlek · Silmede kaynak iadesi yok";const t=Ie("[data-tile-delete]");t.disabled=s===pt,t.title=s===pt?"Krallık merkezi silinemez":"Yapı ve toprak denize çöker",Qc()};function Qc(){const s=Ie("#storage-upgrade"),e=Hi;if(s.hidden=!Me.storageStocks.has(e),s.hidden)return;const t=Me.storageUsed(e),n=Me.storageCapacity(e),i=Me.upgradeCost(e);Ie("#storage-meter").textContent=`Seviye ${Me.storageLevels.get(e)} · ${t} / ${n} dolu`;const r=Ie("#storage-progress");r.max=n,r.value=t;const a=Ie("#upgrade-store");a.innerHTML=`${hn("carry")} ${n} → ${n+(e===pt?80:60)} kapasite <span>${hn("wood")} ${i} · Yükselt</span>`,a.disabled=Me.wood<i,a.title=`Kapasite +${e===pt?80:60}`}Ie("#upgrade-store").onclick=()=>{Me.upgradeStore(Hi)&&(tt.upgradeStorage(Hi),eo(),Qc(),_n.play("build"),Zc(`Depo yükseltildi · Seviye ${Me.storageLevels.get(Hi)} · ${Me.storageCapacity(Hi)} kapasite`))};Ie("[data-tile-left]").onclick=()=>tt.rotateSelection(-1);Ie("[data-tile-right]").onclick=()=>tt.rotateSelection(1);Ie("[data-tile-close]").onclick=()=>tt.editTile(-1);Ie("[data-tile-delete]").onclick=()=>{const s=Hi;tt.placing||!Me.remove(s)||(Us=!0,Ja.cancel(),Mi(null),tt.demolish(Me.board,s),eu(),Zc("Yerleşim kaldırıldı · kaynak iadesi yok"),clearTimeout(Ns),Ns=window.setTimeout(Jc,1500))};tt.onPick=Za;Ie("#event-target").onclick=()=>{Gt?.event&&Za(pt)};function _f(s,e){return Gt?.event&&document.elementFromPoint(s,e)?.closest("#event-target")?pt:tt.point(s,e)}Yi.addEventListener("pointerover",s=>{const e=s.target.closest("button");e&&!e.disabled&&!e.contains(s.relatedTarget)&&!Us&&!Gt&&_n.play("hover")});const Ja=new Gw(Yi,{canStart:s=>ws===null&&!vn.open&&!!Me.hand[s]&&Kc(Me.hand[s]),start:s=>{_n.play("lift"),Mi(Me.hand[s],!0)},move:(s,e)=>tt.valid(_f(s,e)),drop:(s,e)=>Za(_f(s,e)),cancel:()=>{_n.play("invalid"),Mi(null)},tap:s=>{const e=Me.hand[s];Mi(Gt===e?null:e)}}),xf={stone:"Taş",wood:"Odun",berry:"Çilek",farm:"Buğday",fish:"Balık"},jw={stone:"stone",wood:"wood",berry:"berry",farm:"wheat",fish:"fish"};Ie("#work-rows").innerHTML=hr.map(s=>`<label class="work-row" data-work="${s}"><span>${hn(jw[s])}<b>${xf[s]}</b><small></small><em></em></span><input type="range" min="0" max="100" value="${Me.priorities[s]}" aria-label="${xf[s]} iş önceliği" data-priority="${s}"></label>`).join("");function Qa(){const s=tt.villagers.assignedCounts(),e=Me.workTargets();Ie("#population-badge").textContent=String(Me.people),Ie("#work-summary").textContent=`${tt.villagers.working} çalışıyor · ${Math.max(0,Me.people-tt.villagers.working)} boşta`;for(const t of hr){const n=Ie(`[data-work="${t}"]`),i=n.querySelector("input");document.activeElement!==i&&(i.value=String(Me.priorities[t])),n.querySelector("small").textContent=`${s[t]} / ${e[t]} kişi`,n.querySelector("em").textContent=`%${Me.priorities[t]}`,n.classList.toggle("inactive",![...Me.board.keys()].some(r=>Me.categoryFor(r)===t))}}function bp(){const s=Ie("#work-panel");s.hidden=!s.hidden,Ie("#population-toggle").setAttribute("aria-expanded",String(!s.hidden)),Qa()}Ie("#population-toggle").onclick=bp;Ie("[data-work-close]").onclick=()=>{Ie("#work-panel").hidden=!0,Ie("#population-toggle").setAttribute("aria-expanded","false")};Ie("[data-work-balance]").onclick=()=>{Me.priorities={wood:20,stone:20,berry:20,farm:20,fish:20},tt.villagers.rebalance(),Qa()};qc.querySelectorAll("[data-priority]").forEach(s=>s.oninput=()=>{Me.setPriority(s.dataset.priority,Number(s.value)),tt.villagers.rebalance(),Qa()});function Mp(){const s=Ie("#food-details");s.innerHTML=["berry","wheat","fish"].map(e=>`<span>${hn(e)}<small>${e==="berry"?"Çilek":e==="wheat"?"Buğday":"Balık"}</small><b>${Me.foods[e]}</b></span>`).join("")+`<em>−${Me.foodPerMinute} / dk · ${Me.people} sakin</em>`}function yf(){const s=Ie("#food-details"),e=Ie('[data-resource="food"]').getBoundingClientRect();Mp(),s.hidden=!1,s.style.left=`${Math.max(12,Math.min(innerWidth-s.offsetWidth-12,e.left+e.width/2-s.offsetWidth/2))}px`,s.style.top=`${e.bottom+14}px`}const ka=new Map;function $w(s,e){const t=Ie(`[data-resource="${s}"] b`),n=ka.get(s);if(!n){t.textContent=String(e),ka.set(s,{value:e,target:e,frame:0});return}if(n.target===e)return;cancelAnimationFrame(n.frame);const i=n.value,r=n.target,a=performance.now();n.target=e,t.dataset.change=e>r?"up":"down";const o=l=>{const c=Math.min(1,(l-a)/550);n.value=i+(e-i)*(1-(1-c)**3),t.textContent=String(Math.round(n.value)),c<1?n.frame=requestAnimationFrame(o):(t.textContent=String(e),window.setTimeout(()=>{n.target===e&&delete t.dataset.change},500))};n.frame=requestAnimationFrame(o)}function eo(){const s=Ie("#stats");s.children.length||(s.innerHTML=[["wood","Odun"],["stone","Taş"],["food","Yiyecek"],["people","Nüfus"],["happy","Refah"]].map(([t,n])=>`<div class="resource" data-resource="${t}">${hn(t)}<div><small>${n}</small><b>0</b></div><em></em></div>`).join(""));const e=Ie('[data-resource="food"]');e.onmouseenter=yf,e.onmouseleave=()=>Ie("#food-details").hidden=!0,e.onfocus=yf,e.onblur=()=>Ie("#food-details").hidden=!0,e.tabIndex=0,e.setAttribute("aria-describedby","food-details"),Ie('[data-resource="people"]').onclick=bp;for(const t of["wood","stone","food","people","happy"])$w(t,t==="happy"?Math.round(Me.happy):Me[t]),Ie(`[data-resource="${t}"] em`).textContent=t==="people"?`${tt.villagers.working}/${Me.people} çalışıyor`:t==="happy"?"Köyün ruhu":t==="food"?`−${Me.foodPerMinute}/dk`:"Depoda";Yi.querySelectorAll("[data-card]").forEach(t=>{const n=Me.hand[Number(t.dataset.card)];t.disabled=!n||!Kc(n)}),Qa(),Qc(),Ie("#food-details").hidden||Mp()}function eu(){eo(),Yi.innerHTML=Me.hand.map((s,e)=>`<button class="card tone-${s.id}" data-card="${e}" aria-pressed="false" ${Kc(s)?"":"disabled"}>
    <span class="cost" title="${s.cost} odun">${hn("wood")}${s.cost}</span><span class="type">${s.event?"ANLIK":s.workers?"ÜRETİM":"YERLEŞİM"}</span>
    <img src="${Xw[s.id]}" alt="" draggable="false"><strong>${s.name}</strong><span class="rule"></span><span class="effect">${s.desc}</span><small>${s.bonus}</small>
  </button>`).join("")}tt.onDelivery=(s,e,t,n)=>{const i=Me.deliver(s,e,t,n);if(!i)return 0;eo(),_n.play("reward");const r=Ie(`[data-resource="${t}"]`),a=r.getBoundingClientRect(),o=tt.screenPoint(e,.6),l=document.createElement("div");l.className=`delivery-spark ${t}`,l.innerHTML=`${hn(t==="food"?Me.board.get(s)==="fisher"?"fish":Me.board.get(s)==="farm"?"wheat":"berry":t)}<b>+${i}</b>`,document.body.append(l);const c=a.left+a.width/2,u=a.top+a.height/2;return l.animate([{transform:`translate(${o.x}px,${o.y}px) scale(.7)`,opacity:0},{transform:`translate(${o.x}px,${o.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${c}px,${u}px) scale(.5)`,opacity:0}],{duration:950,easing:"cubic-bezier(.3,.65,.3,1)"}).finished.catch(()=>{}).then(()=>l.remove()),r.animate([{transform:"scale(1)",backgroundColor:"transparent"},{transform:"scale(1.10)",backgroundColor:"#d8e6b4"},{transform:"scale(1)",backgroundColor:"transparent"}],{duration:650}),i};tt.onInspect=(s,e,t,n)=>{const i=Ie("#tile-tooltip");if(s<0||!n||Gt||vn.open){i.hidden=!0;return}const r=Me.board.get(s),a=vi.find(g=>g.id===r),o=Me.productAt(s),l=[];s===pt?l.push("Merkez deposu",`${Me.storageUsed(s)} / ${Me.storageCapacity(s)} dolu`):r==="store"?l.push(`${Me.storageUsed(s)} / ${Me.storageCapacity(s)} dolu`,"Tıkla · kapasiteyi yükselt"):o?l.push(`+${o.amount} ${o.resource==="stone"?"taş":o.resource==="wood"?"odun":o.resource==="food"?r==="fisher"?"balık":r==="farm"?"buğday":"çilek":"refah"} / teslimat`,`${tt.villagers.assignedTo(s)} / ${o.capacity} çalışan`,"Ürünler depoya taşınır"):r==="house"||r==="manor"?l.push(`${Me.residents.filter(g=>g.home===s).length} sakinin evi`,"Sakinler yakındaki işlere yürüyerek gider"):r==="lumber"?l.push("Komşu ormanlara +2 odun","Oduncular komşu ormanlarda çalışır"):a&&l.push(a.desc,a.bonus);const c=s===pt?"crest":{forest:"wood",stone:"stone",berry:"berry",farm:"wheat",fisher:"fish",store:"carry",house:"people",manor:"people",lumber:"wood",garden:"garden"}[r??""]??"garden";i.querySelector("strong").innerHTML=`${hn(c)}<span>${s===pt?"Krallık merkezi":a?.name??"Yerleşim"}</span>`,i.querySelector("div").innerHTML=l.map(g=>`<span>${g}</span>`).join(""),i.hidden=!1;const u=i.offsetWidth,h=i.offsetHeight,f=14;let d=e+26,m=t+22;d<n.right+8&&d+u>n.left-8&&m<n.bottom+8&&m+h>n.top-8&&(d=n.right+f,m=t-h/2),d+u>innerWidth-f&&(d=n.left-u-f,m=t-h/2),d<f&&(d=Math.max(f,Math.min(innerWidth-u-f,e-u/2)),m=n.top-h-f,m<f&&(m=n.bottom+f)),i.style.left=`${Math.max(f,Math.min(innerWidth-u-f,d))}px`,i.style.top=`${Math.max(f,Math.min(innerHeight-h-f,m))}px`};window.setInterval(eo,200);function Sp(s){Ja.cancel(),Mi(null),vn.innerHTML=s,vn.open||vn.showModal();const e=vn.querySelector("[data-audio]");e&&(e.onclick=()=>{_n.toggle(),e.textContent=_n.muted?"Ses kapalı":"Ses açık"}),vn.querySelectorAll("input[data-level]").forEach(t=>{t.oninput=()=>_n.set(t.dataset.level,Number(t.value)/100)}),vn.querySelector("[data-close]")?.addEventListener("click",()=>vn.close()),vn.querySelector("[data-new]")?.addEventListener("click",()=>{vn.close(),wp()})}function wp(){clearTimeout(Ns),clearTimeout(oc),Sa.classList.remove("visible"),document.querySelectorAll(".delivery-spark").forEach(s=>s.remove()),Ie("#food-details").hidden=!0,Ie("#work-panel").hidden=!0,Ie("#population-toggle").setAttribute("aria-expanded","false"),Ja.cancel(),_n.cancel();for(const s of ka.values())cancelAnimationFrame(s.frame);ka.clear(),Me=new Mf,Gt=null,Us=!1,tt.reset(),tt.sync(Me.board),tt.bindGame(Me),Mi(null),eu()}Ie("#restart").onclick=()=>Sp("<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>");Ie("#help").onclick=()=>Sp(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Depolar adanın her yerinden ürün kabul eder. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Sağ alttaki Görevler panelinden odun, taş, çilek, buğday ve balık işlerinin önceliğini değiştirebilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek kapasitesini görebilir, odunla yükseltebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · ortala<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><div class="mixer">${["master","sfx","ambience"].map((s,e)=>`<label>${["Genel ses","Efektler","Kıyı ambiyansı"][e]}<input data-level="${s}" aria-label="${["Genel ses","Efektler","Kıyı ambiyansı"][e]}" type="range" min="0" max="100" value="${Math.round(_n.levels[s]*100)}"></label>`).join("")}</div><button data-audio>Ses ${_n.muted?"kapalı":"açık"}</button><button data-close>Oyuna dön</button>`);document.addEventListener("keydown",s=>{s.key==="Escape"&&!vn.open&&(Ja.cancel(),Mi(null))});wp();
