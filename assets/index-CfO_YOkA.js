(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const cn=1.03,tc=Math.sqrt(3),Li=64,ds=129,Yc=[{q:1,r:0},{q:0,r:1},{q:-1,r:1},{q:-1,r:0},{q:0,r:-1},{q:1,r:-1}];function Ka(i,t){return Number.isInteger(i)&&Number.isInteger(t)&&Math.abs(i)<=Li&&Math.abs(t)<=Li?(i+Li)*ds+t+Li:-1}const ie=Ka(0,0);function lr(i){return{q:Math.floor(i/ds)-Li,r:i%ds-Li}}function ke(i){if(!Number.isInteger(i)||i<0||i>=ds*ds)return[];const{q:t,r:e}=lr(i);return Yc.map(n=>Ka(t+n.q,e+n.r))}function se(i){const{q:t,r:e}=lr(i);return{x:cn*tc*(t+e/2),z:cn*1.5*e}}function qe(i,t){const e=(i/tc-t/3)/cn,n=2*t/3/cn,s=-e-n;let r=Math.round(e),a=Math.round(n);const o=Math.round(s),l=Math.abs(r-e),c=Math.abs(a-n),h=Math.abs(o-s);return l>c&&l>h?r=-a-o:c>h&&(a=-r-o),Ka(r,a)}function qc(i){const t=new Set;for(const e of i.keys())for(const n of ke(e))n>=0&&!i.has(n)&&t.add(n);return[...t]}function $c(i,t){return t>=0&&!i.has(t)&&ke(t).some(e=>i.has(e))}function zi(i,t=cn){const e=(i-.5)*Math.PI/3;return{x:Math.cos(e)*t,z:Math.sin(e)*t}}function Js(i){const t=[];for(const e of i.keys()){const n=se(e);ke(e).forEach((s,r)=>{if(i.has(s))return;const a=zi(r),o=zi(r+1);t.push({id:e,side:r,ax:n.x+a.x,az:n.z+a.z,bx:n.x+o.x,bz:n.z+o.z})})}return t}const Bn=[{id:"fisher",name:"Balıkçı Kulübesi",cost:7,workers:1,desc:"+3 balık / teslimat",bonus:"Kıyıda iskele · olta balıkçılığı"},{id:"forest",name:"Orman",cost:0,workers:1,desc:"+2 odun / teslimat",bonus:"Komşu orman +1 · oduncu kulübesi +2 odun"},{id:"berry",name:"Çilek Bahçesi",cost:2,workers:1,desc:"+4 yiyecek / teslimat",bonus:"Komşu orman: +1 yiyecek"},{id:"house",name:"Ev",cost:5,workers:0,desc:"+2 nüfus · +2 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"lumber",name:"Oduncu Kulübesi",cost:5,workers:0,desc:"Komşu ormanlara +2 odun",bonus:"Her komşu ormana +2 odun"},{id:"farm",name:"Çiftlik",cost:7,workers:2,desc:"+4 yiyecek / teslimat",bonus:"Komşu depo: +2 yiyecek"},{id:"store",name:"Depo",cost:6,workers:0,desc:"3 altıgen toplama alanı",bonus:"Ürünler teslim edilince depoya eklenir"},{id:"garden",name:"Bahçe",cost:3,workers:1,desc:"+2 refah / teslimat",bonus:"Komşu ev başına +1 refah"},{id:"manor",name:"Büyük Ev",cost:10,workers:0,desc:"+4 nüfus · +4 işçi",bonus:"Komşu bahçe: +1 refah / teslimat"},{id:"festival",name:"Şenlik",cost:4,workers:0,desc:"+16 refah · −3 yiyecek",bonus:"Anında uygulanır · yer kaplamaz",event:!0},{id:"harvest",name:"Acil Hasat",cost:0,workers:0,desc:"+12 yiyecek · −5 refah",bonus:"Anında uygulanır · yer kaplamaz",event:!0}],fs=["wood","berry","farm","fish"],cs=3,sa=.8;function Ii(i,t){const e=lr(i),n=lr(t);return Math.max(Math.abs(e.q-n.q),Math.abs(e.r-n.r),Math.abs(e.q+e.r-n.q-n.r))}class ec{board=new Map([[ie,"house"]]);wood=18;happy=70;foods={berry:8,wheat:4,fish:0};priorities={wood:35,berry:35,farm:20,fish:10};meal=0;mealPerson=0;meals=[];storageLevels=new Map([[ie,1]]);storageStocks=new Map([[ie,{wood:18,berry:8,wheat:4,fish:0}]]);storageCapacity(t){return this.storageStocks.has(t)?(t===ie?80:60)*(this.storageLevels.get(t)??1):0}storageUsed(t){const e=this.storageStocks.get(t);return e?Object.values(e).reduce((n,s)=>n+s,0):0}storageFree(t){return Math.max(0,this.storageCapacity(t)-this.storageUsed(t))}canStore(t,e){return this.storageStocks.has(t)&&(e==="happy"||this.storageFree(t)>0)}upgradeCost(t){return 12*(this.storageLevels.get(t)??1)}upgradeStore(t){return!this.storageStocks.has(t)||this.wood<this.upgradeCost(t)?!1:(this.spendWood(this.upgradeCost(t)),this.storageLevels.set(t,(this.storageLevels.get(t)??1)+1),!0)}spendWood(t){this.wood-=t;let e=t;for(const n of this.storageStocks.values()){const s=Math.min(e,n.wood);if(n.wood-=s,e-=s,!e)break}}addFood(t,e){for(const[n,s]of this.storageStocks){const r=Math.min(e,this.storageFree(n));if(s[t]+=r,this.foods[t]+=r,e-=r,!e)break}}takeMeals(){const t=this.meals;return this.meals=[],t}wouldSealFishery(t){return[...this.board].some(([e,n])=>n==="fisher"&&ke(e).every(s=>s===t||this.board.has(s)))}get food(){return this.foods.berry+this.foods.wheat+this.foods.fish}get foodPerMinute(){return this.people*2}consumeFood(t){let e=0;for(;e<t&&this.food>0;){const n=Object.keys(this.foods).sort((s,r)=>this.foods[r]-this.foods[s])[0];this.foods[n]--;for(const s of this.storageStocks.values())if(s[n]>0){s[n]--;break}e++}return e}tick(t){this.meal+=t*this.people/30;const e=Math.floor(this.meal);if(e){this.meal-=e;for(let n=0;n<e;n++){const s=this.consumeFood(1)>0,r=this.residents[this.mealPerson++%this.people].id;this.meals.push({id:r,ate:s}),s||(this.happy=Math.max(0,this.happy-.35))}}}categoryFor(t){const e=this.board.get(t);return e==="forest"?"wood":e==="berry"?"berry":e==="farm"?"farm":e==="fisher"?"fish":null}workTargets(){const t=fs.filter(a=>[...this.board.keys()].some(o=>this.categoryFor(o)===a&&this.storageFor(o).length)),e={wood:0,berry:0,farm:0,fish:0},n=t.reduce((a,o)=>a+this.priorities[o],0);if(!n)return e;const s=t.map(a=>({c:a,raw:this.people*this.priorities[a]/n}));for(const a of s)e[a.c]=Math.floor(a.raw);let r=this.people-Object.values(e).reduce((a,o)=>a+o,0);for(const a of s.sort((o,l)=>l.raw%1-o.raw%1))r-- >0&&e[a.c]++;return e}setPriority(t,e){e=Math.max(0,Math.min(100,Math.round(e)));const n=fs.filter(a=>a!==t),s=n.reduce((a,o)=>a+this.priorities[o],0);this.priorities[t]=e;let r=100-e;n.forEach((a,o)=>{const l=o===n.length-1?r:Math.min(r,Math.round((100-e)*(s?this.priorities[a]/s:1/n.length)));this.priorities[a]=l,r-=l})}residents=[{id:0,home:ie}];get people(){return this.residents.length}hand=[];rng;constructor(t=Math.random){this.rng=t,this.hand=["forest","berry","house"].map(e=>Bn.find(n=>n.id===e))}neighbors(t){return ke(t)}draw(){const t=Bn.filter(e=>!["farm","manor"].includes(e.id)||this.people>=3);for(this.hand=[];this.hand.length<3;)this.hand.push(t.splice(Math.floor(this.rng()*t.length),1)[0]);this.hand.some(e=>e.cost<=this.wood)||(this.hand[0]=Bn.find(e=>e.id==="forest")),this.people>=3&&![...this.board.values()].includes("fisher")&&!this.hand.some(e=>e.id==="fisher")&&(this.hand[2]=Bn.find(e=>e.id==="fisher"))}production(){return this.calculateProduction(this.board,this.people)}calculateProduction(t,e){let n=0;const s=new Set,r=l=>l==="berry"||l==="farm"||l==="fisher",a=[...t].map(([l,c])=>({k:c,i:l})).sort((l,c)=>Number(r(c.k)||c.i===ie)-Number(r(l.k)||l.i===ie));for(const{k:l,i:c}of a){const h=Bn.find(d=>d.id===l),u=c===ie?0:h?.workers;u!==void 0&&n+u<=e&&(n+=u,s.add(c))}const o=[...t].flatMap(([l,c])=>{if(!c)return[];const h=this.neighbors(l),u=h.map(m=>t.get(m));let d=0,f=0,g=0,_=!1;return s.has(l)&&(c==="forest"&&(d=2+h.filter(p=>t.get(p)==="lumber"&&s.has(p)).length*2+u.filter(p=>p==="forest").length,_=d>2),c==="berry"&&(f=4+u.filter(m=>m==="forest").length,_=f>4),c==="fisher"&&(f=3),c==="farm"&&(f=4+(u.includes("store")?2:0),_=f>9),c==="garden"&&(g=2+u.filter(m=>m==="house"||m==="manor").length,_=g>2),(c==="house"||c==="manor")&&u.includes("garden")&&(g=1,_=!0)),[{i:l,wood:d,food:f,happy:g,active:s.has(l),bonus:_}]});return{wood:o.reduce((l,c)=>l+c.wood,0),food:o.reduce((l,c)=>l+c.food,0),happy:o.reduce((l,c)=>l+c.happy,0),used:n,idle:e-n,rows:o}}valid(t,e){return this.hand.includes(t)&&t.cost<=this.wood&&(t.id!=="festival"||this.food>=3)&&(t.event?this.board.has(e):$c(this.board,e)&&!this.wouldSealFishery(e))&&(t.id!=="fisher"||ke(e).some(n=>!this.board.has(n)))}preview(t,e){if(!this.valid(t,e))return null;const n=ke(e).map(l=>this.board.get(l)),s=t.id==="house"?2:t.id==="manor"?4:0,r=t.id==="forest"?2+n.filter(l=>l==="forest").length+2*n.filter(l=>l==="lumber").length:0,a=t.id==="berry"?4+n.filter(l=>l==="forest").length:t.id==="farm"?4+n.filter(l=>l==="store").length*2:t.id==="fisher"?3:0,o=t.id==="garden"?2+n.filter(l=>l==="house"||l==="manor").length:0;return{wood:r,food:a,happy:o,people:s,neighbors:ke(e).filter(l=>this.board.has(l)),localBonus:r>2||a>4||o>2}}play(t,e=ie){if(!this.valid(t,e))return null;this.spendWood(t.cost),t.event||this.board.set(e,t.id),t.id==="store"&&(this.storageLevels.set(e,1),this.storageStocks.set(e,{wood:0,berry:0,wheat:0,fish:0}));const n=t.id==="house"?2:t.id==="manor"?4:0;for(let s=0;s<n;s++)this.residents.push({id:this.residents.length,home:e});return t.id==="festival"&&(this.happy=Math.min(100,this.happy+16),this.consumeFood(3)),t.id==="harvest"&&(this.addFood("berry",12),this.happy=Math.max(0,this.happy-5)),this.draw(),this.production()}remove(t){if(t===ie||!this.board.has(t))return!1;const e=this.storageStocks.get(t);if(e){this.wood-=e.wood;for(const n of["berry","wheat","fish"])this.foods[n]-=e[n];this.storageStocks.delete(t),this.storageLevels.delete(t)}this.board.delete(t);for(const n of this.residents)n.home===t&&(n.home=ie);return!0}productAt(t){const e=this.board.get(t),n=ke(t).map(s=>this.board.get(s));return e==="fisher"&&ke(t).some(s=>!this.board.has(s))?{resource:"food",amount:3,capacity:1}:e==="forest"?{resource:"wood",amount:2+n.filter(s=>s==="forest").length+2*n.filter(s=>s==="lumber").length,capacity:3}:e==="berry"?{resource:"food",amount:4+n.filter(s=>s==="forest").length,capacity:2}:e==="farm"?{resource:"food",amount:4+n.filter(s=>s==="store").length*2,capacity:2}:e==="garden"?{resource:"happy",amount:2+n.filter(s=>s==="house"||s==="manor").length,capacity:1}:null}storageFor(t){return[...this.board].filter(([e,n])=>(e===ie||n==="store")&&Ii(t,e)<=(e===ie?2:cs)).sort(([e],[n])=>Ii(t,e)-Ii(t,n)).map(([e])=>e)}deliver(t,e,n,s){const r=this.productAt(t);if(!r||r.resource!==n||!this.storageFor(t).includes(e))return 0;const a=Math.max(0,Math.min(r.amount,Math.floor(s),n==="happy"?1/0:this.storageFree(e)));if(n==="happy"){const l=this.happy;return this.happy=Math.min(100,this.happy+a),Number((this.happy-l).toFixed(2))}const o=this.storageStocks.get(e);if(!o)return 0;if(n==="food"){const l=this.board.get(t),c=l==="fisher"?"fish":l==="farm"?"wheat":"berry";this.foods[c]+=a,o[c]+=a}else this.wood+=a,o.wood+=a;return a}}const Za="180",jc=0,Io=1,Kc=2,nc=1,ic=2,En=3,Xn=0,He=1,Le=2,Gn=0,Ui=1,Uo=2,No=3,Fo=4,Zc=5,ei=100,Jc=101,Qc=102,th=103,eh=104,nh=200,ih=201,sh=202,rh=203,ra=204,aa=205,ah=206,oh=207,lh=208,ch=209,hh=210,uh=211,dh=212,fh=213,ph=214,oa=0,la=1,ca=2,ki=3,ha=4,ua=5,da=6,fa=7,Ja=0,mh=1,gh=2,Vn=0,_h=1,vh=2,xh=3,pa=4,Mh=5,yh=6,Sh=7,sc=300,Hi=301,Gi=302,ma=303,ga=304,_r=306,cr=1e3,ri=1001,_a=1002,je=1003,bh=1004,As=1005,en=1006,Tr=1007,kn=1008,_n=1009,rc=1010,ac=1011,ps=1012,Qa=1013,oi=1014,mn=1015,Ss=1016,to=1017,eo=1018,ms=1020,oc=35902,lc=35899,cc=1021,hc=1022,$e=1023,gs=1026,_s=1027,no=1028,io=1029,uc=1030,so=1031,ro=1033,Qs=33776,tr=33777,er=33778,nr=33779,va=35840,xa=35841,Ma=35842,ya=35843,Sa=36196,ba=37492,Ea=37496,wa=37808,Ta=37809,Aa=37810,Ra=37811,Ca=37812,Pa=37813,La=37814,Da=37815,Ia=37816,Ua=37817,Na=37818,Fa=37819,Oa=37820,Ba=37821,za=36492,ka=36494,Ha=36495,Ga=36283,Va=36284,Wa=36285,Xa=36286,Eh=3200,wh=3201,ao=0,Th=1,zn="",Ye="srgb",Vi="srgb-linear",hr="linear",ne="srgb",mi=7680,Oo=519,Ah=512,Rh=513,Ch=514,dc=515,Ph=516,Lh=517,Dh=518,Ih=519,Bo=35044,zo="300 es",gn=2e3,ur=2001;class $i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Re=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ko=1234567;const hs=Math.PI/180,vs=180/Math.PI;function ji(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Re[i&255]+Re[i>>8&255]+Re[i>>16&255]+Re[i>>24&255]+"-"+Re[t&255]+Re[t>>8&255]+"-"+Re[t>>16&15|64]+Re[t>>24&255]+"-"+Re[e&63|128]+Re[e>>8&255]+"-"+Re[e>>16&255]+Re[e>>24&255]+Re[n&255]+Re[n>>8&255]+Re[n>>16&255]+Re[n>>24&255]).toLowerCase()}function Ht(i,t,e){return Math.max(t,Math.min(e,i))}function oo(i,t){return(i%t+t)%t}function Uh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Nh(i,t,e){return i!==t?(e-i)/(t-i):0}function us(i,t,e){return(1-e)*i+e*t}function Fh(i,t,e,n){return us(i,t,1-Math.exp(-e*n))}function Oh(i,t=1){return t-Math.abs(oo(i,t*2)-t)}function Bh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function zh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function kh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Hh(i,t){return i+Math.random()*(t-i)}function Gh(i){return i*(.5-Math.random())}function Vh(i){i!==void 0&&(ko=i);let t=ko+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Wh(i){return i*hs}function Xh(i){return i*vs}function Yh(i){return(i&i-1)===0&&i!==0}function qh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function $h(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jh(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Fe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Zt={DEG2RAD:hs,RAD2DEG:vs,generateUUID:ji,clamp:Ht,euclideanModulo:oo,mapLinear:Uh,inverseLerp:Nh,lerp:us,damp:Fh,pingpong:Oh,smoothstep:Bh,smootherstep:zh,randInt:kh,randFloat:Hh,randFloatSpread:Gh,seededRandom:Vh,degToRad:Wh,radToDeg:Xh,isPowerOfTwo:Yh,ceilPowerOfTwo:qh,floorPowerOfTwo:$h,setQuaternionFromProperEuler:jh,normalize:Fe,denormalize:Pi};class kt{constructor(t=0,e=0){kt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Ht(this.x,t.x,e.x),this.y=Ht(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Ht(this.x,t,e),this.y=Ht(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ht(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ht(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class bs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-o;const p=l*d+c*f+h*g+u*_,b=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const A=Math.sqrt(E),w=Math.atan2(A,p*b);m=Math.sin(m*w)/A,o=Math.sin(o*w)/A}const x=o*b;if(l=l*m+d*x,c=c*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-o){const A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-o*f,t[e+2]=c*g+h*f+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ht(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ho.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ho.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Ht(this.x,t.x,e.x),this.y=Ht(this.y,t.y,e.y),this.z=Ht(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Ht(this.x,t,e),this.y=Ht(this.y,t,e),this.z=Ht(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ht(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ar.copy(this).projectOnVector(t),this.sub(Ar)}reflect(t){return this.sub(Ar.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ht(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ar=new D,Ho=new bs;class Ft{constructor(t,e,n,s,r,a,o,l,c){Ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],b=s[1],E=s[4],x=s[7],A=s[2],w=s[5],T=s[8];return r[0]=a*_+o*b+l*A,r[3]=a*m+o*E+l*w,r[6]=a*p+o*x+l*T,r[1]=c*_+h*b+u*A,r[4]=c*m+h*E+u*w,r[7]=c*p+h*x+u*T,r[2]=d*_+f*b+g*A,r[5]=d*m+f*E+g*w,r[8]=d*p+f*x+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*c-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Rr.makeScale(t,e)),this}rotate(t){return this.premultiply(Rr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Rr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Rr=new Ft;function fc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Kh(){const i=dr("canvas");return i.style.display="block",i}const Go={};function xs(i){i in Go||(Go[i]=!0,console.warn(i))}function Zh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Vo=new Ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wo=new Ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Jh(){const i={enabled:!0,workingColorSpace:Vi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ne&&(s.r=An(s.r),s.g=An(s.g),s.b=An(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(s.r=Ni(s.r),s.g=Ni(s.g),s.b=Ni(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===zn?hr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Vi]:{primaries:t,whitePoint:n,transfer:hr,toXYZ:Vo,fromXYZ:Wo,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ye},outputColorSpaceConfig:{drawingBufferColorSpace:Ye}},[Ye]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:Vo,fromXYZ:Wo,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ye}}}),i}const Kt=Jh();function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ni(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let gi;class Qh{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{gi===void 0&&(gi=dr("canvas")),gi.width=t.width,gi.height=t.height;const s=gi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=gi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=dr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=An(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let tu=0;class lo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=ji(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Cr(s[a].image)):r.push(Cr(s[a]))}else r=Cr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Cr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Qh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eu=0;const Pr=new D;class Ie extends $i{constructor(t=Ie.DEFAULT_IMAGE,e=Ie.DEFAULT_MAPPING,n=ri,s=ri,r=en,a=kn,o=$e,l=_n,c=Ie.DEFAULT_ANISOTROPY,h=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=ji(),this.name="",this.source=new lo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Pr).x}get height(){return this.source.getSize(Pr).y}get depth(){return this.source.getSize(Pr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==sc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cr:t.x=t.x-Math.floor(t.x);break;case ri:t.x=t.x<0?0:1;break;case _a:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cr:t.y=t.y-Math.floor(t.y);break;case ri:t.y=t.y<0?0:1;break;case _a:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ie.DEFAULT_IMAGE=null;Ie.DEFAULT_MAPPING=sc;Ie.DEFAULT_ANISOTROPY=1;class he{constructor(t=0,e=0,n=0,s=1){he.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,x=(f+1)/2,A=(p+1)/2,w=(h+d)/4,T=(u+_)/4,C=(g+m)/4;return E>x&&E>A?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=w/n,r=T/n):x>A?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=w/s,r=C/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=T/r,s=C/r),this.set(n,s,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Ht(this.x,t.x,e.x),this.y=Ht(this.y,t.y,e.y),this.z=Ht(this.z,t.z,e.z),this.w=Ht(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Ht(this.x,t,e),this.y=Ht(this.y,t,e),this.z=Ht(this.z,t,e),this.w=Ht(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ht(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class nu extends $i{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ie(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:en,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new lo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class li extends nu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class pc extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class iu extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ui{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rs.copy(n.boundingBox)),Rs.applyMatrix4(t.matrixWorld),this.union(Rs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qi),Cs.subVectors(this.max,Qi),_i.subVectors(t.a,Qi),vi.subVectors(t.b,Qi),xi.subVectors(t.c,Qi),Ln.subVectors(vi,_i),Dn.subVectors(xi,vi),$n.subVectors(_i,xi);let e=[0,-Ln.z,Ln.y,0,-Dn.z,Dn.y,0,-$n.z,$n.y,Ln.z,0,-Ln.x,Dn.z,0,-Dn.x,$n.z,0,-$n.x,-Ln.y,Ln.x,0,-Dn.y,Dn.x,0,-$n.y,$n.x,0];return!Lr(e,_i,vi,xi,Cs)||(e=[1,0,0,0,1,0,0,0,1],!Lr(e,_i,vi,xi,Cs))?!1:(Ps.crossVectors(Ln,Dn),e=[Ps.x,Ps.y,Ps.z],Lr(e,_i,vi,xi,Cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const xn=[new D,new D,new D,new D,new D,new D,new D,new D],sn=new D,Rs=new ui,_i=new D,vi=new D,xi=new D,Ln=new D,Dn=new D,$n=new D,Qi=new D,Cs=new D,Ps=new D,jn=new D;function Lr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){jn.fromArray(i,r);const o=s.x*Math.abs(jn.x)+s.y*Math.abs(jn.y)+s.z*Math.abs(jn.z),l=t.dot(jn),c=e.dot(jn),h=n.dot(jn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const su=new ui,ts=new D,Dr=new D;class Ki{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):su.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ts.subVectors(t,this.center);const e=ts.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ts,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Dr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ts.copy(t.center).add(Dr)),this.expandByPoint(ts.copy(t.center).sub(Dr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Mn=new D,Ir=new D,Ls=new D,In=new D,Ur=new D,Ds=new D,Nr=new D;class co{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Mn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mn.copy(this.origin).addScaledVector(this.direction,e),Mn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ir.copy(t).add(e).multiplyScalar(.5),Ls.copy(e).sub(t).normalize(),In.copy(this.origin).sub(Ir);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ls),o=In.dot(this.direction),l=-In.dot(Ls),c=In.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ir).addScaledVector(Ls,d),f}intersectSphere(t,e){Mn.subVectors(t.center,this.origin);const n=Mn.dot(this.direction),s=Mn.dot(Mn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mn)!==null}intersectTriangle(t,e,n,s,r){Ur.subVectors(e,t),Ds.subVectors(n,t),Nr.crossVectors(Ur,Ds);let a=this.direction.dot(Nr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;In.subVectors(this.origin,t);const l=o*this.direction.dot(Ds.crossVectors(In,Ds));if(l<0)return null;const c=o*this.direction.dot(Ur.cross(In));if(c<0||l+c>a)return null;const h=-o*In.dot(Nr);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class le{constructor(t,e,n,s,r,a,o,l,c,h,u,d,f,g,_,m){le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,u,d,f,g,_,m)}set(t,e,n,s,r,a,o,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new le().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Mi.setFromMatrixColumn(t,0).length(),r=1/Mi.setFromMatrixColumn(t,1).length(),a=1/Mi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ru,t,au)}lookAt(t,e,n){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),Un.crossVectors(n,We),Un.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Un.crossVectors(n,We)),Un.normalize(),Is.crossVectors(We,Un),s[0]=Un.x,s[4]=Is.x,s[8]=We.x,s[1]=Un.y,s[5]=Is.y,s[9]=We.y,s[2]=Un.z,s[6]=Is.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],E=n[7],x=n[11],A=n[15],w=s[0],T=s[4],C=s[8],M=s[12],y=s[1],L=s[5],F=s[9],B=s[13],W=s[2],V=s[6],Y=s[10],K=s[14],H=s[3],rt=s[7],ct=s[11],bt=s[15];return r[0]=a*w+o*y+l*W+c*H,r[4]=a*T+o*L+l*V+c*rt,r[8]=a*C+o*F+l*Y+c*ct,r[12]=a*M+o*B+l*K+c*bt,r[1]=h*w+u*y+d*W+f*H,r[5]=h*T+u*L+d*V+f*rt,r[9]=h*C+u*F+d*Y+f*ct,r[13]=h*M+u*B+d*K+f*bt,r[2]=g*w+_*y+m*W+p*H,r[6]=g*T+_*L+m*V+p*rt,r[10]=g*C+_*F+m*Y+p*ct,r[14]=g*M+_*B+m*K+p*bt,r[3]=b*w+E*y+x*W+A*H,r[7]=b*T+E*L+x*V+A*rt,r[11]=b*C+E*F+x*Y+A*ct,r[15]=b*M+E*B+x*K+A*bt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*o*d+n*c*d+s*o*f-n*l*f)+_*(+e*l*f-e*c*d+r*a*d-s*a*f+s*c*h-r*l*h)+m*(+e*c*u-e*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-s*o*h-e*l*u+e*o*d+s*a*u-n*a*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],b=u*m*c-_*d*c+_*l*f-o*m*f-u*l*p+o*d*p,E=g*d*c-h*m*c-g*l*f+a*m*f+h*l*p-a*d*p,x=h*_*c-g*u*c+g*o*f-a*_*f-h*o*p+a*u*p,A=g*u*l-h*_*l-g*o*d+a*_*d+h*o*m-a*u*m,w=e*b+n*E+s*x+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=b*T,t[1]=(_*d*r-u*m*r-_*s*f+n*m*f+u*s*p-n*d*p)*T,t[2]=(o*m*r-_*l*r+_*s*c-n*m*c-o*s*p+n*l*p)*T,t[3]=(u*l*r-o*d*r-u*s*c+n*d*c+o*s*f-n*l*f)*T,t[4]=E*T,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*T,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*p-e*l*p)*T,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*f+e*l*f)*T,t[8]=x*T,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*T,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*p+e*o*p)*T,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*f-e*o*f)*T,t[12]=A*T,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*T,t[14]=(g*o*s-a*_*s-g*n*l+e*_*l+a*n*m-e*o*m)*T,t[15]=(a*u*s-h*o*s+h*n*l-e*u*l-a*n*d+e*o*d)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,b=l*c,E=l*h,x=l*u,A=n.x,w=n.y,T=n.z;return s[0]=(1-(_+p))*A,s[1]=(f+x)*A,s[2]=(g-E)*A,s[3]=0,s[4]=(f-x)*w,s[5]=(1-(d+p))*w,s[6]=(m+b)*w,s[7]=0,s[8]=(g+E)*T,s[9]=(m-b)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Mi.set(s[0],s[1],s[2]).length();const a=Mi.set(s[4],s[5],s[6]).length(),o=Mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const c=1/r,h=1/a,u=1/o;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,e.setFromRotationMatrix(rn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=gn,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===gn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ur)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=gn,l=!1){const c=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===gn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===ur)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Mi=new D,rn=new le,ru=new D(0,0,0),au=new D(1,1,1),Un=new D,Is=new D,We=new D,Xo=new le,Yo=new bs;class hn{constructor(t=0,e=0,n=0,s=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ht(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ht(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Xo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Xo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yo.setFromEuler(this),this.setFromQuaternion(Yo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class ho{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ou=0;const qo=new D,yi=new bs,yn=new le,Us=new D,es=new D,lu=new D,cu=new bs,$o=new D(1,0,0),jo=new D(0,1,0),Ko=new D(0,0,1),Zo={type:"added"},hu={type:"removed"},Si={type:"childadded",child:null},Fr={type:"childremoved",child:null};class ye extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ou++}),this.uuid=ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new D,e=new hn,n=new bs,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new le},normalMatrix:{value:new Ft}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.multiply(yi),this}rotateOnWorldAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.premultiply(yi),this}rotateX(t){return this.rotateOnAxis($o,t)}rotateY(t){return this.rotateOnAxis(jo,t)}rotateZ(t){return this.rotateOnAxis(Ko,t)}translateOnAxis(t,e){return qo.copy(t).applyQuaternion(this.quaternion),this.position.add(qo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis($o,t)}translateY(t){return this.translateOnAxis(jo,t)}translateZ(t){return this.translateOnAxis(Ko,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Us.copy(t):Us.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(es,Us,this.up):yn.lookAt(Us,es,this.up),this.quaternion.setFromRotationMatrix(yn),s&&(yn.extractRotation(s.matrixWorld),yi.setFromRotationMatrix(yn),this.quaternion.premultiply(yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zo),Si.child=t,this.dispatchEvent(Si),Si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(hu),Fr.child=t,this.dispatchEvent(Fr),Fr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),yn.multiply(t.parent.matrixWorld)),t.applyMatrix4(yn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zo),Si.child=t,this.dispatchEvent(Si),Si.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,t,lu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,cu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ye.DEFAULT_UP=new D(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new D,Sn=new D,Or=new D,bn=new D,bi=new D,Ei=new D,Jo=new D,Br=new D,zr=new D,kr=new D,Hr=new he,Gr=new he,Vr=new he;class ln{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),an.subVectors(t,e),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){an.subVectors(s,e),Sn.subVectors(n,e),Or.subVectors(t,e);const a=an.dot(an),o=an.dot(Sn),l=an.dot(Or),c=Sn.dot(Sn),h=Sn.dot(Or),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,bn.x),l.addScaledVector(a,bn.y),l.addScaledVector(o,bn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Hr.setScalar(0),Gr.setScalar(0),Vr.setScalar(0),Hr.fromBufferAttribute(t,e),Gr.fromBufferAttribute(t,n),Vr.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Hr,r.x),a.addScaledVector(Gr,r.y),a.addScaledVector(Vr,r.z),a}static isFrontFacing(t,e,n,s){return an.subVectors(n,e),Sn.subVectors(t,e),an.cross(Sn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),an.cross(Sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;bi.subVectors(s,n),Ei.subVectors(r,n),Br.subVectors(t,n);const l=bi.dot(Br),c=Ei.dot(Br);if(l<=0&&c<=0)return e.copy(n);zr.subVectors(t,s);const h=bi.dot(zr),u=Ei.dot(zr);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(bi,a);kr.subVectors(t,r);const f=bi.dot(kr),g=Ei.dot(kr);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Ei,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Jo.subVectors(r,s),o=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Jo,o);const p=1/(m+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(bi,a).addScaledVector(Ei,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const mc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Ns={h:0,s:0,l:0};function Wr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=oo(t,1),e=Ht(e,0,1),n=Ht(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Wr(a,r,t+1/3),this.g=Wr(a,r,t),this.b=Wr(a,r,t-1/3)}return Kt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ye){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ye){const n=mc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=Ni(t.r),this.g=Ni(t.g),this.b=Ni(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ye){return Kt.workingToColorSpace(Ce.copy(this),t),Math.round(Ht(Ce.r*255,0,255))*65536+Math.round(Ht(Ce.g*255,0,255))*256+Math.round(Ht(Ce.b*255,0,255))}getHexString(t=Ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.workingToColorSpace(Ce.copy(this),e);const n=Ce.r,s=Ce.g,r=Ce.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.workingToColorSpace(Ce.copy(this),e),t.r=Ce.r,t.g=Ce.g,t.b=Ce.b,t}getStyle(t=Ye){Kt.workingToColorSpace(Ce.copy(this),t);const e=Ce.r,n=Ce.g,s=Ce.b;return t!==Ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Nn),this.setHSL(Nn.h+t,Nn.s+e,Nn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Nn),t.getHSL(Ns);const n=us(Nn.h,Ns.h,e),s=us(Nn.s,Ns.s,e),r=us(Nn.l,Ns.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ce=new wt;wt.NAMES=mc;let uu=0;class di extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:uu++}),this.uuid=ji(),this.name="",this.type="Material",this.blending=Ui,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ra,this.blendDst=aa,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new wt(0,0,0),this.blendAlpha=0,this.depthFunc=ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Oo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ra&&(n.blendSrc=this.blendSrc),this.blendDst!==aa&&(n.blendDst=this.blendDst),this.blendEquation!==ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Oo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class pn extends di{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Ja,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new D,Fs=new kt;let du=0;class Ke{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:du++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Bo,this.updateRanges=[],this.gpuType=mn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fs.fromBufferAttribute(this,e),Fs.applyMatrix3(t),this.setXY(e,Fs.x,Fs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Pi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),s=Fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),s=Fe(s,this.array),r=Fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bo&&(t.usage=this.usage),t}}class gc extends Ke{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class _c extends Ke{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class $t extends Ke{constructor(t,e,n){super(new Float32Array(t),e,n)}}let fu=0;const Qe=new le,Xr=new ye,wi=new D,Xe=new ui,ns=new ui,Te=new D;class ve extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(fc(t)?_c:gc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ft().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Qe.makeRotationFromQuaternion(t),this.applyMatrix4(Qe),this}rotateX(t){return Qe.makeRotationX(t),this.applyMatrix4(Qe),this}rotateY(t){return Qe.makeRotationY(t),this.applyMatrix4(Qe),this}rotateZ(t){return Qe.makeRotationZ(t),this.applyMatrix4(Qe),this}translate(t,e,n){return Qe.makeTranslation(t,e,n),this.applyMatrix4(Qe),this}scale(t,e,n){return Qe.makeScale(t,e,n),this.applyMatrix4(Qe),this}lookAt(t){return Xr.lookAt(t),Xr.updateMatrix(),this.applyMatrix4(Xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $t(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Xe.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ki);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ns.setFromBufferAttribute(o),this.morphTargetsRelative?(Te.addVectors(Xe.min,ns.min),Xe.expandByPoint(Te),Te.addVectors(Xe.max,ns.max),Xe.expandByPoint(Te)):(Xe.expandByPoint(ns.min),Xe.expandByPoint(ns.max))}Xe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Te.fromBufferAttribute(o,c),l&&(wi.fromBufferAttribute(t,c),Te.add(wi)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ke(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new D,l[C]=new D;const c=new D,h=new D,u=new D,d=new kt,f=new kt,g=new kt,_=new D,m=new D;function p(C,M,y){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,y),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),o[C].add(_),o[M].add(_),o[y].add(_),l[C].add(m),l[M].add(m),l[y].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let C=0,M=b.length;C<M;++C){const y=b[C],L=y.start,F=y.count;for(let B=L,W=L+F;B<W;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const E=new D,x=new D,A=new D,w=new D;function T(C){A.fromBufferAttribute(s,C),w.copy(A);const M=o[C];E.copy(M),E.sub(A.multiplyScalar(A.dot(M))).normalize(),x.crossVectors(w,M);const L=x.dot(l[C])<0?-1:1;a.setXYZW(C,E.x,E.y,E.z,L)}for(let C=0,M=b.length;C<M;++C){const y=b[C],L=y.start,F=y.count;for(let B=L,W=L+F;B<W;B+=3)T(t.getX(B+0)),T(t.getX(B+1)),T(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ke(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,u=new D;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Ke(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ve,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qo=new le,Kn=new co,Os=new Ki,tl=new D,Bs=new D,zs=new D,ks=new D,Yr=new D,Hs=new D,el=new D,Gs=new D;class qt extends ye{constructor(t=new ve,e=new pn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Hs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Yr.fromBufferAttribute(u,t),a?Hs.addScaledVector(Yr,h):Hs.addScaledVector(Yr.sub(e),h))}e.add(Hs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Os.copy(n.boundingSphere),Os.applyMatrix4(r),Kn.copy(t.ray).recast(t.near),!(Os.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(Os,tl)===null||Kn.origin.distanceToSquared(tl)>(t.far-t.near)**2))&&(Qo.copy(r).invert(),Kn.copy(t.ray).applyMatrix4(Qo),!(n.boundingBox!==null&&Kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Kn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=E;x<A;x+=3){const w=o.getX(x),T=o.getX(x+1),C=o.getX(x+2);s=Vs(this,p,t,n,c,h,u,w,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=o.getX(m),E=o.getX(m+1),x=o.getX(m+2);s=Vs(this,a,t,n,c,h,u,b,E,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=E;x<A;x+=3){const w=x,T=x+1,C=x+2;s=Vs(this,p,t,n,c,h,u,w,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const b=m,E=m+1,x=m+2;s=Vs(this,a,t,n,c,h,u,b,E,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function pu(i,t,e,n,s,r,a,o){let l;if(t.side===He?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Xn,o),l===null)return null;Gs.copy(o),Gs.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Gs);return c<e.near||c>e.far?null:{distance:c,point:Gs.clone(),object:i}}function Vs(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Bs),i.getVertexPosition(l,zs),i.getVertexPosition(c,ks);const h=pu(i,t,e,n,Bs,zs,ks,el);if(h){const u=new D;ln.getBarycoord(el,Bs,zs,ks,u),s&&(h.uv=ln.getInterpolatedAttribute(s,o,l,c,u,new kt)),r&&(h.uv1=ln.getInterpolatedAttribute(r,o,l,c,u,new kt)),a&&(h.normal=ln.getInterpolatedAttribute(a,o,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new D,materialIndex:0};ln.getNormal(Bs,zs,ks,d.normal),h.face=d,h.barycoord=u}return h}class fi extends ve{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(u,2));function g(_,m,p,b,E,x,A,w,T,C,M){const y=x/T,L=A/C,F=x/2,B=A/2,W=w/2,V=T+1,Y=C+1;let K=0,H=0;const rt=new D;for(let ct=0;ct<Y;ct++){const bt=ct*L-B;for(let Gt=0;Gt<V;Gt++){const ae=Gt*y-F;rt[_]=ae*b,rt[m]=bt*E,rt[p]=W,c.push(rt.x,rt.y,rt.z),rt[_]=0,rt[m]=0,rt[p]=w>0?1:-1,h.push(rt.x,rt.y,rt.z),u.push(Gt/T),u.push(1-ct/C),K+=1}}for(let ct=0;ct<C;ct++)for(let bt=0;bt<T;bt++){const Gt=d+bt+V*ct,ae=d+bt+V*(ct+1),ue=d+(bt+1)+V*(ct+1),Jt=d+(bt+1)+V*ct;l.push(Gt,ae,Jt),l.push(ae,ue,Jt),H+=6}o.addGroup(f,H,M),f+=H,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Wi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Oe(i){const t={};for(let e=0;e<i.length;e++){const n=Wi(i[e]);for(const s in n)t[s]=n[s]}return t}function mu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function vc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const gu={clone:Wi,merge:Oe};var _u=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends di{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_u,this.fragmentShader=vu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Wi(t.uniforms),this.uniformsGroups=mu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class xc extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new D,nl=new kt,il=new kt;class on extends xc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=vs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(hs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return vs*2*Math.atan(Math.tan(hs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z)}getViewSize(t,e){return this.getViewBounds(t,nl,il),e.subVectors(il,nl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(hs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ti=-90,Ai=1;class xu extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new on(Ti,Ai,t,e);s.layers=this.layers,this.add(s);const r=new on(Ti,Ai,t,e);r.layers=this.layers,this.add(r);const a=new on(Ti,Ai,t,e);a.layers=this.layers,this.add(a);const o=new on(Ti,Ai,t,e);o.layers=this.layers,this.add(o);const l=new on(Ti,Ai,t,e);l.layers=this.layers,this.add(l);const c=new on(Ti,Ai,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Mc extends Ie{constructor(t=[],e=Hi,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Mu extends li{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Mc(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new fi(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:Gn});r.uniforms.tEquirect.value=e;const a=new qt(s,r),o=e.minFilter;return e.minFilter===kn&&(e.minFilter=en),new xu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class Vt extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yu={type:"move"};class qr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Vt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class sl extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class uo extends Ie{constructor(t=null,e=1,n=1,s,r,a,o,l,c=je,h=je,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rl extends Ke{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ri=new le,al=new le,Ws=[],ol=new ui,Su=new le,is=new qt,ss=new Ki;class yc extends qt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new rl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Su)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ui),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ri),ol.copy(t.boundingBox).applyMatrix4(Ri),this.boundingBox.union(ol)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ki),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ri),ss.copy(t.boundingSphere).applyMatrix4(Ri),this.boundingSphere.union(ss)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),t.ray.intersectsSphere(ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ri),al.multiplyMatrices(n,Ri),is.matrixWorld=al,is.raycast(t,Ws);for(let a=0,o=Ws.length;a<o;a++){const l=Ws[a];l.instanceId=r,l.object=this,e.push(l)}Ws.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new rl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new uo(new Float32Array(s*this.count),s,this.count,no,mn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const $r=new D,bu=new D,Eu=new Ft;class wn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=$r.subVectors(n,e).cross(bu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta($r),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Eu.getNormalMatrix(t),s=this.coplanarPoint($r).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zn=new Ki,wu=new kt(.5,.5),Xs=new D;class fo{constructor(t=new wn,e=new wn,n=new wn,s=new wn,r=new wn,a=new wn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=gn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],E=r[13],x=r[14],A=r[15];if(s[0].setComponents(c-a,f-h,p-g,A-b).normalize(),s[1].setComponents(c+a,f+h,p+g,A+b).normalize(),s[2].setComponents(c+o,f+u,p+_,A+E).normalize(),s[3].setComponents(c-o,f-u,p-_,A-E).normalize(),n)s[4].setComponents(l,d,m,x).normalize(),s[5].setComponents(c-l,f-d,p-m,A-x).normalize();else if(s[4].setComponents(c-l,f-d,p-m,A-x).normalize(),e===gn)s[5].setComponents(c+l,f+d,p+m,A+x).normalize();else if(e===ur)s[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(t){Zn.center.set(0,0,0);const e=wu.distanceTo(t.center);return Zn.radius=.7071067811865476+e,Zn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Xs.x=s.normal.x>0?t.max.x:t.min.x,Xs.y=s.normal.y>0?t.max.y:t.min.y,Xs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ms extends di{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const fr=new D,pr=new D,ll=new le,rs=new co,Ys=new Ki,jr=new D,cl=new D;class Sc extends ye{constructor(t=new ve,e=new Ms){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)fr.fromBufferAttribute(e,s-1),pr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=fr.distanceTo(pr);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(s),Ys.radius+=r,t.ray.intersectsSphere(Ys)===!1)return;ll.copy(s).invert(),rs.copy(t.ray).applyMatrix4(ll);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),b=h.getX(_+1),E=qs(this,t,rs,l,p,b,_);E&&e.push(E)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=qs(this,t,rs,l,_,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=qs(this,t,rs,l,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){const _=qs(this,t,rs,l,g-1,f,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function qs(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(fr.fromBufferAttribute(o,s),pr.fromBufferAttribute(o,r),e.distanceSqToSegment(fr,pr,jr,cl)>n)return;jr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(jr);if(!(c<t.near||c>t.far))return{distance:c,point:cl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Ya extends Sc{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Tu extends Ie{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bc extends Ie{constructor(t,e,n=oi,s,r,a,o=je,l=je,c,h=gs,u=1){if(h!==gs&&h!==_s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new lo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ec extends Ie{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Fi extends ve{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new D,h=new kt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(o,3)),this.setAttribute("uv",new $t(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ue extends ve{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;b(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new $t(u,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function b(){const x=new D,A=new D;let w=0;const T=(e-t)/n;for(let C=0;C<=r;C++){const M=[],y=C/r,L=y*(e-t)+t;for(let F=0;F<=s;F++){const B=F/s,W=B*l+o,V=Math.sin(W),Y=Math.cos(W);A.x=L*V,A.y=-y*n+m,A.z=L*Y,u.push(A.x,A.y,A.z),x.set(V,T,Y).normalize(),d.push(x.x,x.y,x.z),f.push(B,1-y),M.push(g++)}_.push(M)}for(let C=0;C<s;C++)for(let M=0;M<r;M++){const y=_[M][C],L=_[M+1][C],F=_[M+1][C+1],B=_[M][C+1];(t>0||M!==0)&&(h.push(y,L,B),w+=3),(e>0||M!==r-1)&&(h.push(L,F,B),w+=3)}c.addGroup(p,w,0),p+=w}function E(x){const A=g,w=new kt,T=new D;let C=0;const M=x===!0?t:e,y=x===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const L=g;for(let F=0;F<=s;F++){const W=F/s*l+o,V=Math.cos(W),Y=Math.sin(W);T.x=M*Y,T.y=m*y,T.z=M*V,u.push(T.x,T.y,T.z),d.push(0,y,0),w.x=V*.5+.5,w.y=Y*.5*y+.5,f.push(w.x,w.y),g++}for(let F=0;F<s;F++){const B=A+F,W=L+F;x===!0?h.push(W,W+1,B):h.push(W+1,W,B),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pn extends Ue{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Pn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class po extends ve{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new $t(r,3)),this.setAttribute("normal",new $t(r.slice(),3)),this.setAttribute("uv",new $t(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const E=new D,x=new D,A=new D;for(let w=0;w<e.length;w+=3)f(e[w+0],E),f(e[w+1],x),f(e[w+2],A),l(E,x,A,b)}function l(b,E,x,A){const w=A+1,T=[];for(let C=0;C<=w;C++){T[C]=[];const M=b.clone().lerp(x,C/w),y=E.clone().lerp(x,C/w),L=w-C;for(let F=0;F<=L;F++)F===0&&C===w?T[C][F]=M:T[C][F]=M.clone().lerp(y,F/L)}for(let C=0;C<w;C++)for(let M=0;M<2*(w-C)-1;M++){const y=Math.floor(M/2);M%2===0?(d(T[C][y+1]),d(T[C+1][y]),d(T[C][y])):(d(T[C][y+1]),d(T[C+1][y+1]),d(T[C+1][y]))}}function c(b){const E=new D;for(let x=0;x<r.length;x+=3)E.x=r[x+0],E.y=r[x+1],E.z=r[x+2],E.normalize().multiplyScalar(b),r[x+0]=E.x,r[x+1]=E.y,r[x+2]=E.z}function h(){const b=new D;for(let E=0;E<r.length;E+=3){b.x=r[E+0],b.y=r[E+1],b.z=r[E+2];const x=m(b)/2/Math.PI+.5,A=p(b)/Math.PI+.5;a.push(x,1-A)}g(),u()}function u(){for(let b=0;b<a.length;b+=6){const E=a[b+0],x=a[b+2],A=a[b+4],w=Math.max(E,x,A),T=Math.min(E,x,A);w>.9&&T<.1&&(E<.2&&(a[b+0]+=1),x<.2&&(a[b+2]+=1),A<.2&&(a[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,E){const x=b*3;E.x=t[x+0],E.y=t[x+1],E.z=t[x+2]}function g(){const b=new D,E=new D,x=new D,A=new D,w=new kt,T=new kt,C=new kt;for(let M=0,y=0;M<r.length;M+=9,y+=6){b.set(r[M+0],r[M+1],r[M+2]),E.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),w.set(a[y+0],a[y+1]),T.set(a[y+2],a[y+3]),C.set(a[y+4],a[y+5]),A.copy(b).add(E).add(x).divideScalar(3);const L=m(A);_(w,y+0,b,L),_(T,y+2,E,L),_(C,y+4,x,L)}}function _(b,E,x,A){A<0&&b.x===1&&(a[E]=b.x-1),x.x===0&&x.z===0&&(a[E]=A/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new po(t.vertices,t.indices,t.radius,t.details)}}class Es extends po{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Es(t.radius,t.detail)}}class ci extends ve{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const b=p*d-a;for(let E=0;E<c;E++){const x=E*u-r;g.push(x,-b,0),_.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const E=b+c*p,x=b+c*(p+1),A=b+1+c*(p+1),w=b+1+c*p;f.push(E,x,w),f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ci(t.width,t.height,t.widthSegments,t.heightSegments)}}class mo extends ve{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=t;const d=(e-t)/s,f=new D,g=new kt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const b=p+m,E=b,x=b+n+1,A=b+n+2,w=b+1;o.push(E,x,w),o.push(x,A,w)}}this.setIndex(o),this.setAttribute("position",new $t(l,3)),this.setAttribute("normal",new $t(c,3)),this.setAttribute("uv",new $t(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class go extends ve{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new D,d=new D,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const b=[],E=p/n;let x=0;p===0&&a===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let A=0;A<=e;A++){const w=A/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+E*o),u.y=t*Math.cos(a+E*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+E*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+x,1-E),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const E=h[p][b+1],x=h[p][b],A=h[p+1][b],w=h[p+1][b+1];(p!==0||a>0)&&f.push(E,x,w),(p!==n-1||l<Math.PI)&&f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new go(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xi extends di{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ao,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class _o extends di{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ao,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Ja,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Au extends di{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ru extends di{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class wc extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hl extends wc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Kr=new le,ul=new D,dl=new D;class Cu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new kt(512,512),this.mapType=_n,this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fo,this._frameExtents=new kt(1,1),this._viewportCount=1,this._viewports=[new he(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ul.setFromMatrixPosition(t.matrixWorld),e.position.copy(ul),dl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dl),e.updateMatrixWorld(),Kr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kr,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Kr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class vr extends xc{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Pu extends Cu{constructor(){super(new vr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fl extends wc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new Pu}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Lu extends on{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const pl=new le;class Tc{constructor(t,e,n=0,s=1/0){this.ray=new co(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ho,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return pl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pl),this}intersectObject(t,e=!0,n=[]){return qa(t,this,n,e),n.sort(ml),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)qa(t[s],this,n,e);return n.sort(ml),n}}function ml(i,t){return i.distance-t.distance}function qa(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)qa(r[a],t,e,!0)}}class Du{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Ht(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ht(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}function gl(i,t,e,n){const s=Iu(n);switch(e){case cc:return i*t;case no:return i*t/s.components*s.byteLength;case io:return i*t/s.components*s.byteLength;case uc:return i*t*2/s.components*s.byteLength;case so:return i*t*2/s.components*s.byteLength;case hc:return i*t*3/s.components*s.byteLength;case $e:return i*t*4/s.components*s.byteLength;case ro:return i*t*4/s.components*s.byteLength;case Qs:case tr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case er:case nr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xa:case ya:return Math.max(i,16)*Math.max(t,8)/4;case va:case Ma:return Math.max(i,8)*Math.max(t,8)/2;case Sa:case ba:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ca:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case La:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Da:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Na:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Fa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Oa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ba:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case za:case ka:case Ha:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ga:case Va:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Wa:case Xa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Iu(i){switch(i){case _n:case rc:return{byteLength:1,components:1};case ps:case ac:case Ss:return{byteLength:2,components:1};case to:case eo:return{byteLength:2,components:4};case oi:case Qa:case mn:return{byteLength:4,components:1};case oc:case lc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Za}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Za);function Ac(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Uu(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Nu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fu=`#ifdef USE_ALPHAHASH
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
#endif`,Ou=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ku=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hu=`#ifdef USE_AOMAP
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
#endif`,Gu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vu=`#ifdef USE_BATCHING
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
#endif`,Wu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$u=`#ifdef USE_IRIDESCENCE
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
#endif`,ju=`#ifdef USE_BUMPMAP
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
#endif`,Ku=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ju=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,td=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ed=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,nd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,id=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sd=`#define PI 3.141592653589793
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
} // validated`,rd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ad=`vec3 transformedNormal = objectNormal;
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
#endif`,od=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ld=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,cd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ud="gl_FragColor = linearToOutputTexel( gl_FragColor );",dd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fd=`#ifdef USE_ENVMAP
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
#endif`,pd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,md=`#ifdef USE_ENVMAP
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
#endif`,gd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_d=`#ifdef USE_ENVMAP
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
#endif`,vd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Md=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sd=`#ifdef USE_GRADIENTMAP
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
}`,bd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ed=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Td=`uniform bool receiveShadow;
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
#endif`,Ad=`#ifdef USE_ENVMAP
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
#endif`,Rd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ld=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dd=`PhysicalMaterial material;
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
#endif`,Id=`struct PhysicalMaterial {
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
}`,Ud=`
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
#endif`,Nd=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Od=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wd=`#if defined( USE_POINTS_UV )
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
#endif`,Xd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$d=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kd=`#ifdef USE_MORPHTARGETS
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
#endif`,Zd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,tf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ef=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sf=`#ifdef USE_NORMALMAP
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
#endif`,rf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,af=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,of=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,lf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,cf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,uf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,df=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ff=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,mf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_f=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Mf=`float getShadowMask() {
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
}`,yf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sf=`#ifdef USE_SKINNING
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
#endif`,bf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ef=`#ifdef USE_SKINNING
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
#endif`,wf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Tf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Af=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Cf=`#ifdef USE_TRANSMISSION
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
#endif`,Pf=`#ifdef USE_TRANSMISSION
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
#endif`,Lf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Df=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,If=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Uf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Nf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ff=`uniform sampler2D t2D;
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
}`,Of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hf=`#include <common>
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
}`,Gf=`#if DEPTH_PACKING == 3200
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
}`,Vf=`#define DISTANCE
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
}`,Wf=`#define DISTANCE
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
}`,Xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qf=`uniform float scale;
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
}`,$f=`uniform vec3 diffuse;
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
}`,jf=`#include <common>
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
}`,Kf=`uniform vec3 diffuse;
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
}`,Zf=`#define LAMBERT
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
}`,Jf=`#define LAMBERT
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
}`,Qf=`#define MATCAP
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
}`,tp=`#define MATCAP
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
}`,ep=`#define NORMAL
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
}`,np=`#define NORMAL
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
}`,ip=`#define PHONG
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
}`,sp=`#define PHONG
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
}`,rp=`#define STANDARD
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
}`,ap=`#define STANDARD
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
}`,op=`#define TOON
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
}`,lp=`#define TOON
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
}`,cp=`uniform float size;
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
}`,hp=`uniform vec3 diffuse;
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
}`,up=`#include <common>
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
}`,dp=`uniform vec3 color;
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
}`,fp=`uniform float rotation;
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
}`,pp=`uniform vec3 diffuse;
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
}`,zt={alphahash_fragment:Nu,alphahash_pars_fragment:Fu,alphamap_fragment:Ou,alphamap_pars_fragment:Bu,alphatest_fragment:zu,alphatest_pars_fragment:ku,aomap_fragment:Hu,aomap_pars_fragment:Gu,batching_pars_vertex:Vu,batching_vertex:Wu,begin_vertex:Xu,beginnormal_vertex:Yu,bsdfs:qu,iridescence_fragment:$u,bumpmap_pars_fragment:ju,clipping_planes_fragment:Ku,clipping_planes_pars_fragment:Zu,clipping_planes_pars_vertex:Ju,clipping_planes_vertex:Qu,color_fragment:td,color_pars_fragment:ed,color_pars_vertex:nd,color_vertex:id,common:sd,cube_uv_reflection_fragment:rd,defaultnormal_vertex:ad,displacementmap_pars_vertex:od,displacementmap_vertex:ld,emissivemap_fragment:cd,emissivemap_pars_fragment:hd,colorspace_fragment:ud,colorspace_pars_fragment:dd,envmap_fragment:fd,envmap_common_pars_fragment:pd,envmap_pars_fragment:md,envmap_pars_vertex:gd,envmap_physical_pars_fragment:Ad,envmap_vertex:_d,fog_vertex:vd,fog_pars_vertex:xd,fog_fragment:Md,fog_pars_fragment:yd,gradientmap_pars_fragment:Sd,lightmap_pars_fragment:bd,lights_lambert_fragment:Ed,lights_lambert_pars_fragment:wd,lights_pars_begin:Td,lights_toon_fragment:Rd,lights_toon_pars_fragment:Cd,lights_phong_fragment:Pd,lights_phong_pars_fragment:Ld,lights_physical_fragment:Dd,lights_physical_pars_fragment:Id,lights_fragment_begin:Ud,lights_fragment_maps:Nd,lights_fragment_end:Fd,logdepthbuf_fragment:Od,logdepthbuf_pars_fragment:Bd,logdepthbuf_pars_vertex:zd,logdepthbuf_vertex:kd,map_fragment:Hd,map_pars_fragment:Gd,map_particle_fragment:Vd,map_particle_pars_fragment:Wd,metalnessmap_fragment:Xd,metalnessmap_pars_fragment:Yd,morphinstance_vertex:qd,morphcolor_vertex:$d,morphnormal_vertex:jd,morphtarget_pars_vertex:Kd,morphtarget_vertex:Zd,normal_fragment_begin:Jd,normal_fragment_maps:Qd,normal_pars_fragment:tf,normal_pars_vertex:ef,normal_vertex:nf,normalmap_pars_fragment:sf,clearcoat_normal_fragment_begin:rf,clearcoat_normal_fragment_maps:af,clearcoat_pars_fragment:of,iridescence_pars_fragment:lf,opaque_fragment:cf,packing:hf,premultiplied_alpha_fragment:uf,project_vertex:df,dithering_fragment:ff,dithering_pars_fragment:pf,roughnessmap_fragment:mf,roughnessmap_pars_fragment:gf,shadowmap_pars_fragment:_f,shadowmap_pars_vertex:vf,shadowmap_vertex:xf,shadowmask_pars_fragment:Mf,skinbase_vertex:yf,skinning_pars_vertex:Sf,skinning_vertex:bf,skinnormal_vertex:Ef,specularmap_fragment:wf,specularmap_pars_fragment:Tf,tonemapping_fragment:Af,tonemapping_pars_fragment:Rf,transmission_fragment:Cf,transmission_pars_fragment:Pf,uv_pars_fragment:Lf,uv_pars_vertex:Df,uv_vertex:If,worldpos_vertex:Uf,background_vert:Nf,background_frag:Ff,backgroundCube_vert:Of,backgroundCube_frag:Bf,cube_vert:zf,cube_frag:kf,depth_vert:Hf,depth_frag:Gf,distanceRGBA_vert:Vf,distanceRGBA_frag:Wf,equirect_vert:Xf,equirect_frag:Yf,linedashed_vert:qf,linedashed_frag:$f,meshbasic_vert:jf,meshbasic_frag:Kf,meshlambert_vert:Zf,meshlambert_frag:Jf,meshmatcap_vert:Qf,meshmatcap_frag:tp,meshnormal_vert:ep,meshnormal_frag:np,meshphong_vert:ip,meshphong_frag:sp,meshphysical_vert:rp,meshphysical_frag:ap,meshtoon_vert:op,meshtoon_frag:lp,points_vert:cp,points_frag:hp,shadow_vert:up,shadow_frag:dp,sprite_vert:fp,sprite_frag:pp},st={common:{diffuse:{value:new wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ft}},envmap:{envMap:{value:null},envMapRotation:{value:new Ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ft},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0},uvTransform:{value:new Ft}},sprite:{diffuse:{value:new wt(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}}},fn={basic:{uniforms:Oe([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Oe([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new wt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Oe([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new wt(0)},specular:{value:new wt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Oe([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Oe([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new wt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Oe([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Oe([st.points,st.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Oe([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Oe([st.common,st.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Oe([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Oe([st.sprite,st.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ft}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:Oe([st.common,st.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:Oe([st.lights,st.fog,{color:{value:new wt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};fn.physical={uniforms:Oe([fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ft},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ft},sheen:{value:0},sheenColor:{value:new wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ft},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ft},attenuationDistance:{value:0},attenuationColor:{value:new wt(0)},specularColor:{value:new wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ft},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ft}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const $s={r:0,b:0,g:0},Jn=new hn,mp=new le;function gp(i,t,e,n,s,r,a){const o=new wt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?e:t).get(x)),x}function _(E){let x=!1;const A=g(E);A===null?p(o,l):A&&A.isColor&&(p(A,1),x=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,x){const A=g(x);A&&(A.isCubeTexture||A.mapping===_r)?(h===void 0&&(h=new qt(new fi(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:Wi(fn.backgroundCube.uniforms),vertexShader:fn.backgroundCube.vertexShader,fragmentShader:fn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Jn.copy(x.backgroundRotation),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(mp.makeRotationFromEuler(Jn)),h.material.toneMapped=Kt.getTransfer(A.colorSpace)!==ne,(u!==A||d!==A.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=A,d=A.version,f=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new qt(new ci(2,2),new Cn({name:"BackgroundMaterial",uniforms:Wi(fn.background.uniforms),vertexShader:fn.background.vertexShader,fragmentShader:fn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(A.colorSpace)!==ne,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||d!==A.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=A,d=A.version,f=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,x){E.getRGB($s,vc(i)),n.buffers.color.setClear($s.r,$s.g,$s.b,x,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,x=1){o.set(E),l=x,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(o,l)},render:_,addToRenderList:m,dispose:b}}function _p(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(y,L,F,B,W){let V=!1;const Y=u(B,F,L);r!==Y&&(r=Y,c(r.object)),V=f(y,B,F,W),V&&g(y,B,F,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,x(y,L,F,B),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function u(y,L,F){const B=F.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let V=W[L.id];V===void 0&&(V={},W[L.id]=V);let Y=V[B];return Y===void 0&&(Y=d(l()),V[B]=Y),Y}function d(y){const L=[],F=[],B=[];for(let W=0;W<e;W++)L[W]=0,F[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:B,object:y,attributes:{},index:null}}function f(y,L,F,B){const W=r.attributes,V=L.attributes;let Y=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){const ct=W[H];let bt=V[H];if(bt===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(bt=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(bt=y.instanceColor)),ct===void 0||ct.attribute!==bt||bt&&ct.data!==bt.data)return!0;Y++}return r.attributesNum!==Y||r.index!==B}function g(y,L,F,B){const W={},V=L.attributes;let Y=0;const K=F.getAttributes();for(const H in K)if(K[H].location>=0){let ct=V[H];ct===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(ct=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(ct=y.instanceColor));const bt={};bt.attribute=ct,ct&&ct.data&&(bt.data=ct.data),W[H]=bt,Y++}r.attributes=W,r.attributesNum=Y,r.index=B}function _(){const y=r.newAttributes;for(let L=0,F=y.length;L<F;L++)y[L]=0}function m(y){p(y,0)}function p(y,L){const F=r.newAttributes,B=r.enabledAttributes,W=r.attributeDivisors;F[y]=1,B[y]===0&&(i.enableVertexAttribArray(y),B[y]=1),W[y]!==L&&(i.vertexAttribDivisor(y,L),W[y]=L)}function b(){const y=r.newAttributes,L=r.enabledAttributes;for(let F=0,B=L.length;F<B;F++)L[F]!==y[F]&&(i.disableVertexAttribArray(F),L[F]=0)}function E(y,L,F,B,W,V,Y){Y===!0?i.vertexAttribIPointer(y,L,F,W,V):i.vertexAttribPointer(y,L,F,B,W,V)}function x(y,L,F,B){_();const W=B.attributes,V=F.getAttributes(),Y=L.defaultAttributeValues;for(const K in V){const H=V[K];if(H.location>=0){let rt=W[K];if(rt===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(rt=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(rt=y.instanceColor)),rt!==void 0){const ct=rt.normalized,bt=rt.itemSize,Gt=t.get(rt);if(Gt===void 0)continue;const ae=Gt.buffer,ue=Gt.type,Jt=Gt.bytesPerElement,q=ue===i.INT||ue===i.UNSIGNED_INT||rt.gpuType===Qa;if(rt.isInterleavedBufferAttribute){const Z=rt.data,dt=Z.stride,Dt=rt.offset;if(Z.isInstancedInterleavedBuffer){for(let St=0;St<H.locationSize;St++)p(H.location+St,Z.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let St=0;St<H.locationSize;St++)m(H.location+St);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let St=0;St<H.locationSize;St++)E(H.location+St,bt/H.locationSize,ue,ct,dt*Jt,(Dt+bt/H.locationSize*St)*Jt,q)}else{if(rt.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z,rt.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Z=0;Z<H.locationSize;Z++)m(H.location+Z);i.bindBuffer(i.ARRAY_BUFFER,ae);for(let Z=0;Z<H.locationSize;Z++)E(H.location+Z,bt/H.locationSize,ue,ct,bt*Jt,bt/H.locationSize*Z*Jt,q)}}else if(Y!==void 0){const ct=Y[K];if(ct!==void 0)switch(ct.length){case 2:i.vertexAttrib2fv(H.location,ct);break;case 3:i.vertexAttrib3fv(H.location,ct);break;case 4:i.vertexAttrib4fv(H.location,ct);break;default:i.vertexAttrib1fv(H.location,ct)}}}}b()}function A(){C();for(const y in n){const L=n[y];for(const F in L){const B=L[F];for(const W in B)h(B[W].object),delete B[W];delete L[F]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;const L=n[y.id];for(const F in L){const B=L[F];for(const W in B)h(B[W].object),delete B[W];delete L[F]}delete n[y.id]}function T(y){for(const L in n){const F=n[L];if(F[y.id]===void 0)continue;const B=F[y.id];for(const W in B)h(B[W].object),delete B[W];delete F[y.id]}}function C(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function vp(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function xp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==$e&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const C=T===Ss&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==_n&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==mn&&!C)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:x,vertexTextures:A,maxSamples:w}}function Mp(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new wn,o=new Ft,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const b=r?0:n,E=b*4;let x=p.clippingState||null;l.value=x,x=h(g,d,E,f);for(let A=0;A!==E;++A)x[A]=e[A];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,x=f;E!==_;++E,x+=4)a.copy(u[E]).applyMatrix4(b,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function yp(i){let t=new WeakMap;function e(a,o){return o===ma?a.mapping=Hi:o===ga&&(a.mapping=Gi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ma||o===ga)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Mu(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Di=4,_l=[.125,.215,.35,.446,.526,.582],ni=20,Zr=new vr,vl=new wt;let Jr=null,Qr=0,ta=0,ea=!1;const ti=(1+Math.sqrt(5))/2,Ci=1/ti,xl=[new D(-ti,Ci,0),new D(ti,Ci,0),new D(-Ci,0,ti),new D(Ci,0,ti),new D(0,ti,-Ci),new D(0,ti,Ci),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Sp=new D;class Ml{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Sp}=r;Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Jr,Qr,ta),this._renderer.xr.enabled=ea,t.scissorTest=!1,js(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Hi||t.mapping===Gi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Jr=this._renderer.getRenderTarget(),Qr=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel(),ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:Ss,format:$e,colorSpace:Vi,depthBuffer:!1},s=yl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=bp(r)),this._blurMaterial=Ep(r,t,e)}return s}_compileMaterial(t){const e=new qt(this._lodPlanes[0],t);this._renderer.compile(e,Zr)}_sceneToCubeUV(t,e,n,s,r){const l=new on(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(vl),u.toneMapping=Vn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new pn({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),m=new qt(new fi,_);let p=!1;const b=t.background;b?b.isColor&&(_.color.copy(b),t.background=null,p=!0):(_.color.copy(vl),p=!0);for(let E=0;E<6;E++){const x=E%3;x===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):x===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const A=this._cubeSize;js(s,x*A,E>2?A:0,A,A),u.setRenderTarget(s),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Hi||t.mapping===Gi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=bl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new qt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;js(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Zr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=xl[(s-r-1)%xl.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new qt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ni-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):ni;m>ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ni}`);const p=[];let b=0;for(let T=0;T<ni;++T){const C=T/_,M=Math.exp(-C*C/2);p.push(M),T===0?b+=M:T<m&&(b+=2*M)}for(let T=0;T<p.length;T++)p[T]=p[T]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const x=this._sizeLods[s],A=3*x*(s>E-Di?s-E+Di:0),w=4*(this._cubeSize-x);js(e,A,w,3*x,2*x),l.setRenderTarget(e),l.render(u,Zr)}}function bp(i){const t=[],e=[],n=[];let s=i;const r=i-Di+1+_l.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Di?l=_l[a-i+Di-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),E=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let w=0;w<f;w++){const T=w%3*2/3-1,C=w>2?0:-1,M=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];b.set(M,_*g*w),E.set(d,m*g*w);const y=[w,w,w,w,w,w];x.set(y,p*g*w)}const A=new ve;A.setAttribute("position",new Ke(b,_)),A.setAttribute("uv",new Ke(E,m)),A.setAttribute("faceIndex",new Ke(x,p)),t.push(A),s>Di&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function yl(i,t,e){const n=new li(i,t,e);return n.texture.mapping=_r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function js(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ep(i,t,e){const n=new Float32Array(ni),s=new D(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vo(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Sl(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vo(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function bl(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function vo(){return`

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
	`}function wp(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ma||l===ga,h=l===Hi||l===Gi;if(c||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Ml(i)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Ml(i)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Tp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&xs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Ap(i,t,e,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const b=f.array;_=f.version;for(let E=0,x=b.length;E<x;E+=3){const A=b[E+0],w=b[E+1],T=b[E+2];d.push(A,w,w,T,T,A)}}else if(g!==void 0){const b=g.array;_=g.version;for(let E=0,x=b.length/3-1;E<x;E+=3){const A=E+0,w=E+1,T=E+2;d.push(A,w,w,T,T,A)}}else return;const m=new(fc(d)?_c:gc)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Rp(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*a),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Cp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Pp(i,t,e){const n=new WeakMap,s=new he;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let y=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let A=o.attributes.position.count*x,w=1;A>t.maxTextureSize&&(w=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const T=new Float32Array(A*w*4*u),C=new pc(T,A,w,u);C.type=mn,C.needsUpdate=!0;const M=x*4;for(let L=0;L<u;L++){const F=p[L],B=b[L],W=E[L],V=A*w*4*L;for(let Y=0;Y<F.count;Y++){const K=Y*M;g===!0&&(s.fromBufferAttribute(F,Y),T[V+K+0]=s.x,T[V+K+1]=s.y,T[V+K+2]=s.z,T[V+K+3]=0),_===!0&&(s.fromBufferAttribute(B,Y),T[V+K+4]=s.x,T[V+K+5]=s.y,T[V+K+6]=s.z,T[V+K+7]=0),m===!0&&(s.fromBufferAttribute(W,Y),T[V+K+8]=s.x,T[V+K+9]=s.y,T[V+K+10]=s.z,T[V+K+11]=W.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new kt(A,w)},n.set(o,d),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Lp(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const Rc=new Ie,El=new bc(1,1),Cc=new pc,Pc=new iu,Lc=new Mc,wl=[],Tl=[],Al=new Float32Array(16),Rl=new Float32Array(9),Cl=new Float32Array(4);function Zi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=wl[s];if(r===void 0&&(r=new Float32Array(s),wl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function xr(i,t){let e=Tl[t];e===void 0&&(e=new Int32Array(t),Tl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Dp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ip(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function Up(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function Np(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function Fp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Cl.set(n),i.uniformMatrix2fv(this.addr,!1,Cl),Ee(e,n)}}function Op(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Rl.set(n),i.uniformMatrix3fv(this.addr,!1,Rl),Ee(e,n)}}function Bp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Al.set(n),i.uniformMatrix4fv(this.addr,!1,Al),Ee(e,n)}}function zp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function kp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function Hp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function Gp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function Vp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Wp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function Xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function Yp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function qp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(El.compareFunction=dc,r=El):r=Rc,e.setTexture2D(t||r,s)}function $p(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Pc,s)}function jp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Lc,s)}function Kp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Cc,s)}function Zp(i){switch(i){case 5126:return Dp;case 35664:return Ip;case 35665:return Up;case 35666:return Np;case 35674:return Fp;case 35675:return Op;case 35676:return Bp;case 5124:case 35670:return zp;case 35667:case 35671:return kp;case 35668:case 35672:return Hp;case 35669:case 35673:return Gp;case 5125:return Vp;case 36294:return Wp;case 36295:return Xp;case 36296:return Yp;case 35678:case 36198:case 36298:case 36306:case 35682:return qp;case 35679:case 36299:case 36307:return $p;case 35680:case 36300:case 36308:case 36293:return jp;case 36289:case 36303:case 36311:case 36292:return Kp}}function Jp(i,t){i.uniform1fv(this.addr,t)}function Qp(i,t){const e=Zi(t,this.size,2);i.uniform2fv(this.addr,e)}function tm(i,t){const e=Zi(t,this.size,3);i.uniform3fv(this.addr,e)}function em(i,t){const e=Zi(t,this.size,4);i.uniform4fv(this.addr,e)}function nm(i,t){const e=Zi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function im(i,t){const e=Zi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function sm(i,t){const e=Zi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function rm(i,t){i.uniform1iv(this.addr,t)}function am(i,t){i.uniform2iv(this.addr,t)}function om(i,t){i.uniform3iv(this.addr,t)}function lm(i,t){i.uniform4iv(this.addr,t)}function cm(i,t){i.uniform1uiv(this.addr,t)}function hm(i,t){i.uniform2uiv(this.addr,t)}function um(i,t){i.uniform3uiv(this.addr,t)}function dm(i,t){i.uniform4uiv(this.addr,t)}function fm(i,t,e){const n=this.cache,s=t.length,r=xr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Rc,r[a])}function pm(i,t,e){const n=this.cache,s=t.length,r=xr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Pc,r[a])}function mm(i,t,e){const n=this.cache,s=t.length,r=xr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Lc,r[a])}function gm(i,t,e){const n=this.cache,s=t.length,r=xr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Cc,r[a])}function _m(i){switch(i){case 5126:return Jp;case 35664:return Qp;case 35665:return tm;case 35666:return em;case 35674:return nm;case 35675:return im;case 35676:return sm;case 5124:case 35670:return rm;case 35667:case 35671:return am;case 35668:case 35672:return om;case 35669:case 35673:return lm;case 5125:return cm;case 36294:return hm;case 36295:return um;case 36296:return dm;case 35678:case 36198:case 36298:case 36306:case 35682:return fm;case 35679:case 36299:case 36307:return pm;case 35680:case 36300:case 36308:case 36293:return mm;case 36289:case 36303:case 36311:case 36292:return gm}}class vm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Zp(e.type)}}class xm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=_m(e.type)}}class Mm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const na=/(\w+)(\])?(\[|\.)?/g;function Pl(i,t){i.seq.push(t),i.map[t.id]=t}function ym(i,t,e){const n=i.name,s=n.length;for(na.lastIndex=0;;){const r=na.exec(n),a=na.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Pl(e,c===void 0?new vm(o,i,t):new xm(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Mm(o),Pl(e,u)),e=u}}}class ir{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);ym(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Ll(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Sm=37297;let bm=0;function Em(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Dl=new Ft;function wm(i){Kt._getMatrix(Dl,Kt.workingColorSpace,i);const t=`mat3( ${Dl.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(i)){case hr:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Il(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Em(i.getShaderSource(t),o)}else return r}function Tm(i,t){const e=wm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Am(i,t){let e;switch(t){case _h:e="Linear";break;case vh:e="Reinhard";break;case xh:e="Cineon";break;case pa:e="ACESFilmic";break;case yh:e="AgX";break;case Sh:e="Neutral";break;case Mh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ks=new D;function Rm(){Kt.getLuminanceCoefficients(Ks);const i=Ks.x.toFixed(4),t=Ks.y.toFixed(4),e=Ks.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(os).join(`
`)}function Pm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Lm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function os(i){return i!==""}function Ul(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Dm=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(Dm,Um)}const Im=new Map;function Um(i,t){let e=zt[t];if(e===void 0){const n=Im.get(t);if(n!==void 0)e=zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $a(e)}const Nm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fl(i){return i.replace(Nm,Fm)}function Fm(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ol(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Om(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ic?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===En&&(t="SHADOWMAP_TYPE_VSM"),t}function Bm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Gi:t="ENVMAP_TYPE_CUBE";break;case _r:t="ENVMAP_TYPE_CUBE_UV";break}return t}function zm(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Gi&&(t="ENVMAP_MODE_REFRACTION"),t}function km(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ja:t="ENVMAP_BLENDING_MULTIPLY";break;case mh:t="ENVMAP_BLENDING_MIX";break;case gh:t="ENVMAP_BLENDING_ADD";break}return t}function Hm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Gm(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Om(e),c=Bm(e),h=zm(e),u=km(e),d=Hm(e),f=Cm(e),g=Pm(r),_=s.createProgram();let m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(os).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(os).join(`
`),p.length>0&&(p+=`
`)):(m=[Ol(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(os).join(`
`),p=[Ol(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Vn?"#define TONE_MAPPING":"",e.toneMapping!==Vn?zt.tonemapping_pars_fragment:"",e.toneMapping!==Vn?Am("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,Tm("linearToOutputTexel",e.outputColorSpace),Rm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(os).join(`
`)),a=$a(a),a=Ul(a,e),a=Nl(a,e),o=$a(o),o=Ul(o,e),o=Nl(o,e),a=Fl(a),o=Fl(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===zo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===zo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=b+m+a,x=b+p+o,A=Ll(s,s.VERTEX_SHADER,E),w=Ll(s,s.FRAGMENT_SHADER,x);s.attachShader(_,A),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(L){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(A)||"",W=s.getShaderInfoLog(w)||"",V=F.trim(),Y=B.trim(),K=W.trim();let H=!0,rt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,A,w);else{const ct=Il(s,A,"vertex"),bt=Il(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+ct+`
`+bt)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(Y===""||K==="")&&(rt=!1);rt&&(L.diagnostics={runnable:H,programLog:V,vertexShader:{log:Y,prefix:m},fragmentShader:{log:K,prefix:p}})}s.deleteShader(A),s.deleteShader(w),C=new ir(s,_),M=Lm(s,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Sm)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=bm++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}let Vm=0;class Wm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Xm(t),e.set(t,n)),n}}class Xm{constructor(t){this.id=Vm++,this.code=t,this.usedTimes=0}}function Ym(i,t,e,n,s,r,a){const o=new ho,l=new Wm,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,y,L,F,B){const W=F.fog,V=B.geometry,Y=M.isMeshStandardMaterial?F.environment:null,K=(M.isMeshStandardMaterial?e:t).get(M.envMap||Y),H=K&&K.mapping===_r?K.image.height:null,rt=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ct=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,bt=ct!==void 0?ct.length:0;let Gt=0;V.morphAttributes.position!==void 0&&(Gt=1),V.morphAttributes.normal!==void 0&&(Gt=2),V.morphAttributes.color!==void 0&&(Gt=3);let ae,ue,Jt,q;if(rt){const Qt=fn[rt];ae=Qt.vertexShader,ue=Qt.fragmentShader}else ae=M.vertexShader,ue=M.fragmentShader,l.update(M),Jt=l.getVertexShaderID(M),q=l.getFragmentShaderID(M);const Z=i.getRenderTarget(),dt=i.state.buffers.depth.getReversed(),Dt=B.isInstancedMesh===!0,St=B.isBatchedMesh===!0,Xt=!!M.map,Ae=!!M.matcap,P=!!K,de=!!M.aoMap,Ut=!!M.lightMap,Pt=!!M.bumpMap,mt=!!M.normalMap,fe=!!M.displacementMap,gt=!!M.emissiveMap,Bt=!!M.metalnessMap,we=!!M.roughnessMap,xe=M.anisotropy>0,R=M.clearcoat>0,v=M.dispersion>0,O=M.iridescence>0,X=M.sheen>0,j=M.transmission>0,G=xe&&!!M.anisotropyMap,Mt=R&&!!M.clearcoatMap,nt=R&&!!M.clearcoatNormalMap,_t=R&&!!M.clearcoatRoughnessMap,vt=O&&!!M.iridescenceMap,tt=O&&!!M.iridescenceThicknessMap,lt=X&&!!M.sheenColorMap,Ct=X&&!!M.sheenRoughnessMap,xt=!!M.specularMap,at=!!M.specularColorMap,Nt=!!M.specularIntensityMap,I=j&&!!M.transmissionMap,et=j&&!!M.thicknessMap,it=!!M.gradientMap,ut=!!M.alphaMap,J=M.alphaTest>0,$=!!M.alphaHash,pt=!!M.extensions;let It=Vn;M.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(It=i.toneMapping);const oe={shaderID:rt,shaderType:M.type,shaderName:M.name,vertexShader:ae,fragmentShader:ue,defines:M.defines,customVertexShaderID:Jt,customFragmentShaderID:q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:St,batchingColor:St&&B._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&B.instanceColor!==null,instancingMorph:Dt&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Vi,alphaToCoverage:!!M.alphaToCoverage,map:Xt,matcap:Ae,envMap:P,envMapMode:P&&K.mapping,envMapCubeUVHeight:H,aoMap:de,lightMap:Ut,bumpMap:Pt,normalMap:mt,displacementMap:d&&fe,emissiveMap:gt,normalMapObjectSpace:mt&&M.normalMapType===Th,normalMapTangentSpace:mt&&M.normalMapType===ao,metalnessMap:Bt,roughnessMap:we,anisotropy:xe,anisotropyMap:G,clearcoat:R,clearcoatMap:Mt,clearcoatNormalMap:nt,clearcoatRoughnessMap:_t,dispersion:v,iridescence:O,iridescenceMap:vt,iridescenceThicknessMap:tt,sheen:X,sheenColorMap:lt,sheenRoughnessMap:Ct,specularMap:xt,specularColorMap:at,specularIntensityMap:Nt,transmission:j,transmissionMap:I,thicknessMap:et,gradientMap:it,opaque:M.transparent===!1&&M.blending===Ui&&M.alphaToCoverage===!1,alphaMap:ut,alphaTest:J,alphaHash:$,combine:M.combine,mapUv:Xt&&_(M.map.channel),aoMapUv:de&&_(M.aoMap.channel),lightMapUv:Ut&&_(M.lightMap.channel),bumpMapUv:Pt&&_(M.bumpMap.channel),normalMapUv:mt&&_(M.normalMap.channel),displacementMapUv:fe&&_(M.displacementMap.channel),emissiveMapUv:gt&&_(M.emissiveMap.channel),metalnessMapUv:Bt&&_(M.metalnessMap.channel),roughnessMapUv:we&&_(M.roughnessMap.channel),anisotropyMapUv:G&&_(M.anisotropyMap.channel),clearcoatMapUv:Mt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:nt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_t&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&_(M.sheenRoughnessMap.channel),specularMapUv:xt&&_(M.specularMap.channel),specularColorMapUv:at&&_(M.specularColorMap.channel),specularIntensityMapUv:Nt&&_(M.specularIntensityMap.channel),transmissionMapUv:I&&_(M.transmissionMap.channel),thicknessMapUv:et&&_(M.thicknessMap.channel),alphaMapUv:ut&&_(M.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(mt||xe),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!V.attributes.uv&&(Xt||ut),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:dt,skinning:B.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:bt,morphTextureStride:Gt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:It,decodeVideoTexture:Xt&&M.map.isVideoTexture===!0&&Kt.getTransfer(M.map.colorSpace)===ne,decodeVideoTextureEmissive:gt&&M.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(M.emissiveMap.colorSpace)===ne,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Le,flipSided:M.side===He,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:pt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&M.extensions.multiDraw===!0||St)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)y.push(L),y.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(b(y,M),E(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function b(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function E(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const y=g[M.type];let L;if(y){const F=fn[y];L=gu.clone(F.uniforms)}else L=M.uniforms;return L}function A(M,y){let L;for(let F=0,B=h.length;F<B;F++){const W=h[F];if(W.cacheKey===y){L=W,++L.usedTimes;break}}return L===void 0&&(L=new Gm(i,y,M,r),h.push(L)),L}function w(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function T(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:A,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:C}}function qm(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function $m(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||$m),n.length>1&&n.sort(d||Bl),s.length>1&&s.sort(d||Bl)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function jm(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new zl,i.set(n,[a])):s>=r.length?(a=new zl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Km(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new wt};break;case"SpotLight":e={position:new D,direction:new D,color:new wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new wt,groundColor:new wt};break;case"RectAreaLight":e={color:new wt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function Zm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Jm=0;function Qm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function tg(i){const t=new Km,e=Zm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new le,a=new le;function o(c){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,E=0,x=0,A=0,w=0,T=0;c.sort(Qm);for(let M=0,y=c.length;M<y;M++){const L=c[M],F=L.color,B=L.intensity,W=L.distance,V=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=F.r*B,u+=F.g*B,d+=F.b*B;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(L.sh.coefficients[Y],B);T++}else if(L.isDirectionalLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const K=L.shadow,H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=V,n.directionalShadowMatrix[f]=L.shadow.matrix,b++}n.directional[f]=Y,f++}else if(L.isSpotLight){const Y=t.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(F).multiplyScalar(B),Y.distance=W,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,n.spot[_]=Y;const K=L.shadow;if(L.map&&(n.spotLightMap[A]=L.map,A++,K.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[_]=K.matrix,L.castShadow){const H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=V,x++}_++}else if(L.isRectAreaLight){const Y=t.get(L);Y.color.copy(F).multiplyScalar(B),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=Y,m++}else if(L.isPointLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){const K=L.shadow,H=e.get(L);H.shadowIntensity=K.intensity,H.shadowBias=K.bias,H.shadowNormalBias=K.normalBias,H.shadowRadius=K.radius,H.shadowMapSize=K.mapSize,H.shadowCameraNear=K.camera.near,H.shadowCameraFar=K.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=L.shadow.matrix,E++}n.point[g]=Y,g++}else if(L.isHemisphereLight){const Y=t.get(L);Y.skyColor.copy(L.color).multiplyScalar(B),Y.groundColor.copy(L.groundColor).multiplyScalar(B),n.hemi[p]=Y,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=st.LTC_FLOAT_1,n.rectAreaLTC2=st.LTC_FLOAT_2):(n.rectAreaLTC1=st.LTC_HALF_1,n.rectAreaLTC2=st.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==b||C.numPointShadows!==E||C.numSpotShadows!==x||C.numSpotMaps!==A||C.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=x+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=b,C.numPointShadows=E,C.numSpotShadows=x,C.numSpotMaps=A,C.numLightProbes=T,n.version=Jm++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const E=c[p];if(E.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(E.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(E.width*.5,0,0),x.halfHeight.set(0,E.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(E.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function kl(i){const t=new tg(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function eg(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new kl(i),t.set(s,[o])):r>=a.length?(o=new kl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const ng=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ig=`uniform sampler2D shadow_pass;
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
}`;function sg(i,t,e){let n=new fo;const s=new kt,r=new kt,a=new he,o=new Au({depthPacking:wh}),l=new Ru,c={},h=e.maxTextureSize,u={[Xn]:He,[He]:Xn,[Le]:Le},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:ng,fragmentShader:ig}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new ve;g.setAttribute("position",new Ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new qt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nc;let p=this.type;this.render=function(w,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=i.getRenderTarget(),y=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Gn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const B=p!==En&&this.type===En,W=p===En&&this.type!==En;for(let V=0,Y=w.length;V<Y;V++){const K=w[V],H=K.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const rt=H.getFrameExtents();if(s.multiply(rt),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/rt.x),s.x=r.x*rt.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/rt.y),s.y=r.y*rt.y,H.mapSize.y=r.y)),H.map===null||B===!0||W===!0){const bt=this.type!==En?{minFilter:je,magFilter:je}:{};H.map!==null&&H.map.dispose(),H.map=new li(s.x,s.y,bt),H.map.texture.name=K.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ct=H.getViewportCount();for(let bt=0;bt<ct;bt++){const Gt=H.getViewport(bt);a.set(r.x*Gt.x,r.y*Gt.y,r.x*Gt.z,r.y*Gt.w),F.viewport(a),H.updateMatrices(K,bt),n=H.getFrustum(),x(T,C,H.camera,K,this.type)}H.isPointLightShadow!==!0&&this.type===En&&b(H,C),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,y,L)};function b(w,T){const C=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new li(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,C,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,C,f,_,null)}function E(w,T,C,M){let y=null;const L=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)y=L;else if(y=C.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const F=y.uuid,B=T.uuid;let W=c[F];W===void 0&&(W={},c[F]=W);let V=W[B];V===void 0&&(V=y.clone(),W[B]=V,T.addEventListener("dispose",A)),y=V}if(y.visible=T.visible,y.wireframe=T.wireframe,M===En?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:u[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=i.properties.get(y);F.light=C}return y}function x(w,T,C,M,y){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===En)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const B=t.update(w),W=w.material;if(Array.isArray(W)){const V=B.groups;for(let Y=0,K=V.length;Y<K;Y++){const H=V[Y],rt=W[H.materialIndex];if(rt&&rt.visible){const ct=E(w,rt,M,y);w.onBeforeShadow(i,w,T,C,B,ct,H),i.renderBufferDirect(C,null,B,ct,w,H),w.onAfterShadow(i,w,T,C,B,ct,H)}}}else if(W.visible){const V=E(w,W,M,y);w.onBeforeShadow(i,w,T,C,B,V,null),i.renderBufferDirect(C,null,B,V,w,null),w.onAfterShadow(i,w,T,C,B,V,null)}}const F=w.children;for(let B=0,W=F.length;B<W;B++)x(F[B],T,C,M,y)}function A(w){w.target.removeEventListener("dispose",A);for(const C in c){const M=c[C],y=w.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const rg={[oa]:la,[ca]:da,[ha]:fa,[ki]:ua,[la]:oa,[da]:ca,[fa]:ha,[ua]:ki};function ag(i,t){function e(){let I=!1;const et=new he;let it=null;const ut=new he(0,0,0,0);return{setMask:function(J){it!==J&&!I&&(i.colorMask(J,J,J,J),it=J)},setLocked:function(J){I=J},setClear:function(J,$,pt,It,oe){oe===!0&&(J*=It,$*=It,pt*=It),et.set(J,$,pt,It),ut.equals(et)===!1&&(i.clearColor(J,$,pt,It),ut.copy(et))},reset:function(){I=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let I=!1,et=!1,it=null,ut=null,J=null;return{setReversed:function($){if(et!==$){const pt=t.get("EXT_clip_control");$?pt.clipControlEXT(pt.LOWER_LEFT_EXT,pt.ZERO_TO_ONE_EXT):pt.clipControlEXT(pt.LOWER_LEFT_EXT,pt.NEGATIVE_ONE_TO_ONE_EXT),et=$;const It=J;J=null,this.setClear(It)}},getReversed:function(){return et},setTest:function($){$?Z(i.DEPTH_TEST):dt(i.DEPTH_TEST)},setMask:function($){it!==$&&!I&&(i.depthMask($),it=$)},setFunc:function($){if(et&&($=rg[$]),ut!==$){switch($){case oa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case ki:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=$}},setLocked:function($){I=$},setClear:function($){J!==$&&(et&&($=1-$),i.clearDepth($),J=$)},reset:function(){I=!1,it=null,ut=null,J=null,et=!1}}}function s(){let I=!1,et=null,it=null,ut=null,J=null,$=null,pt=null,It=null,oe=null;return{setTest:function(Qt){I||(Qt?Z(i.STENCIL_TEST):dt(i.STENCIL_TEST))},setMask:function(Qt){et!==Qt&&!I&&(i.stencilMask(Qt),et=Qt)},setFunc:function(Qt,vn,un){(it!==Qt||ut!==vn||J!==un)&&(i.stencilFunc(Qt,vn,un),it=Qt,ut=vn,J=un)},setOp:function(Qt,vn,un){($!==Qt||pt!==vn||It!==un)&&(i.stencilOp(Qt,vn,un),$=Qt,pt=vn,It=un)},setLocked:function(Qt){I=Qt},setClear:function(Qt){oe!==Qt&&(i.clearStencil(Qt),oe=Qt)},reset:function(){I=!1,et=null,it=null,ut=null,J=null,$=null,pt=null,It=null,oe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,E=null,x=null,A=null,w=null,T=new wt(0,0,0),C=0,M=!1,y=null,L=null,F=null,B=null,W=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,K=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(H)[1]),Y=K>=1):H.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),Y=K>=2);let rt=null,ct={};const bt=i.getParameter(i.SCISSOR_BOX),Gt=i.getParameter(i.VIEWPORT),ae=new he().fromArray(bt),ue=new he().fromArray(Gt);function Jt(I,et,it,ut){const J=new Uint8Array(4),$=i.createTexture();i.bindTexture(I,$),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let pt=0;pt<it;pt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(et,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(et+pt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return $}const q={};q[i.TEXTURE_2D]=Jt(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=Jt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=Jt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=Jt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),a.setFunc(ki),Pt(!1),mt(Io),Z(i.CULL_FACE),de(Gn);function Z(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function dt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Dt(I,et){return u[I]!==et?(i.bindFramebuffer(I,et),u[I]=et,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=et),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=et),!0):!1}function St(I,et){let it=f,ut=!1;if(I){it=d.get(et),it===void 0&&(it=[],d.set(et,it));const J=I.textures;if(it.length!==J.length||it[0]!==i.COLOR_ATTACHMENT0){for(let $=0,pt=J.length;$<pt;$++)it[$]=i.COLOR_ATTACHMENT0+$;it.length=J.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function Xt(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Ae={[ei]:i.FUNC_ADD,[Jc]:i.FUNC_SUBTRACT,[Qc]:i.FUNC_REVERSE_SUBTRACT};Ae[th]=i.MIN,Ae[eh]=i.MAX;const P={[nh]:i.ZERO,[ih]:i.ONE,[sh]:i.SRC_COLOR,[ra]:i.SRC_ALPHA,[hh]:i.SRC_ALPHA_SATURATE,[lh]:i.DST_COLOR,[ah]:i.DST_ALPHA,[rh]:i.ONE_MINUS_SRC_COLOR,[aa]:i.ONE_MINUS_SRC_ALPHA,[ch]:i.ONE_MINUS_DST_COLOR,[oh]:i.ONE_MINUS_DST_ALPHA,[uh]:i.CONSTANT_COLOR,[dh]:i.ONE_MINUS_CONSTANT_COLOR,[fh]:i.CONSTANT_ALPHA,[ph]:i.ONE_MINUS_CONSTANT_ALPHA};function de(I,et,it,ut,J,$,pt,It,oe,Qt){if(I===Gn){_===!0&&(dt(i.BLEND),_=!1);return}if(_===!1&&(Z(i.BLEND),_=!0),I!==Zc){if(I!==m||Qt!==M){if((p!==ei||x!==ei)&&(i.blendEquation(i.FUNC_ADD),p=ei,x=ei),Qt)switch(I){case Ui:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uo:i.blendFunc(i.ONE,i.ONE);break;case No:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Fo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ui:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Uo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case No:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}b=null,E=null,A=null,w=null,T.set(0,0,0),C=0,m=I,M=Qt}return}J=J||et,$=$||it,pt=pt||ut,(et!==p||J!==x)&&(i.blendEquationSeparate(Ae[et],Ae[J]),p=et,x=J),(it!==b||ut!==E||$!==A||pt!==w)&&(i.blendFuncSeparate(P[it],P[ut],P[$],P[pt]),b=it,E=ut,A=$,w=pt),(It.equals(T)===!1||oe!==C)&&(i.blendColor(It.r,It.g,It.b,oe),T.copy(It),C=oe),m=I,M=!1}function Ut(I,et){I.side===Le?dt(i.CULL_FACE):Z(i.CULL_FACE);let it=I.side===He;et&&(it=!it),Pt(it),I.blending===Ui&&I.transparent===!1?de(Gn):de(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const ut=I.stencilWrite;o.setTest(ut),ut&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),gt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):dt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(I){y!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),y=I)}function mt(I){I!==jc?(Z(i.CULL_FACE),I!==L&&(I===Io?i.cullFace(i.BACK):I===Kc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):dt(i.CULL_FACE),L=I}function fe(I){I!==F&&(Y&&i.lineWidth(I),F=I)}function gt(I,et,it){I?(Z(i.POLYGON_OFFSET_FILL),(B!==et||W!==it)&&(i.polygonOffset(et,it),B=et,W=it)):dt(i.POLYGON_OFFSET_FILL)}function Bt(I){I?Z(i.SCISSOR_TEST):dt(i.SCISSOR_TEST)}function we(I){I===void 0&&(I=i.TEXTURE0+V-1),rt!==I&&(i.activeTexture(I),rt=I)}function xe(I,et,it){it===void 0&&(rt===null?it=i.TEXTURE0+V-1:it=rt);let ut=ct[it];ut===void 0&&(ut={type:void 0,texture:void 0},ct[it]=ut),(ut.type!==I||ut.texture!==et)&&(rt!==it&&(i.activeTexture(it),rt=it),i.bindTexture(I,et||q[I]),ut.type=I,ut.texture=et)}function R(){const I=ct[rt];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function X(){try{i.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{i.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Mt(){try{i.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{i.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{i.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{i.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function lt(I){ae.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),ae.copy(I))}function Ct(I){ue.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),ue.copy(I))}function xt(I,et){let it=c.get(et);it===void 0&&(it=new WeakMap,c.set(et,it));let ut=it.get(I);ut===void 0&&(ut=i.getUniformBlockIndex(et,I.name),it.set(I,ut))}function at(I,et){const ut=c.get(et).get(I);l.get(et)!==ut&&(i.uniformBlockBinding(et,ut,I.__bindingPointIndex),l.set(et,ut))}function Nt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},rt=null,ct={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,E=null,x=null,A=null,w=null,T=new wt(0,0,0),C=0,M=!1,y=null,L=null,F=null,B=null,W=null,ae.set(0,0,i.canvas.width,i.canvas.height),ue.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Z,disable:dt,bindFramebuffer:Dt,drawBuffers:St,useProgram:Xt,setBlending:de,setMaterial:Ut,setFlipSided:Pt,setCullFace:mt,setLineWidth:fe,setPolygonOffset:gt,setScissorTest:Bt,activeTexture:we,bindTexture:xe,unbindTexture:R,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:vt,texImage3D:tt,updateUBOMapping:xt,uniformBlockBinding:at,texStorage2D:nt,texStorage3D:_t,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:G,compressedTexSubImage3D:Mt,scissor:lt,viewport:Ct,reset:Nt}}function og(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new kt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,v){return f?new OffscreenCanvas(R,v):dr("canvas")}function _(R,v,O){let X=1;const j=xe(R);if((j.width>O||j.height>O)&&(X=O/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const G=Math.floor(X*j.width),Mt=Math.floor(X*j.height);u===void 0&&(u=g(G,Mt));const nt=v?g(G,Mt):u;return nt.width=G,nt.height=Mt,nt.getContext("2d").drawImage(R,0,0,G,Mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+G+"x"+Mt+")."),nt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function b(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(R,v,O,X,j=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let G=v;if(v===i.RED&&(O===i.FLOAT&&(G=i.R32F),O===i.HALF_FLOAT&&(G=i.R16F),O===i.UNSIGNED_BYTE&&(G=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.R8UI),O===i.UNSIGNED_SHORT&&(G=i.R16UI),O===i.UNSIGNED_INT&&(G=i.R32UI),O===i.BYTE&&(G=i.R8I),O===i.SHORT&&(G=i.R16I),O===i.INT&&(G=i.R32I)),v===i.RG&&(O===i.FLOAT&&(G=i.RG32F),O===i.HALF_FLOAT&&(G=i.RG16F),O===i.UNSIGNED_BYTE&&(G=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RG8UI),O===i.UNSIGNED_SHORT&&(G=i.RG16UI),O===i.UNSIGNED_INT&&(G=i.RG32UI),O===i.BYTE&&(G=i.RG8I),O===i.SHORT&&(G=i.RG16I),O===i.INT&&(G=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGB8UI),O===i.UNSIGNED_SHORT&&(G=i.RGB16UI),O===i.UNSIGNED_INT&&(G=i.RGB32UI),O===i.BYTE&&(G=i.RGB8I),O===i.SHORT&&(G=i.RGB16I),O===i.INT&&(G=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(G=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(G=i.RGBA16UI),O===i.UNSIGNED_INT&&(G=i.RGBA32UI),O===i.BYTE&&(G=i.RGBA8I),O===i.SHORT&&(G=i.RGBA16I),O===i.INT&&(G=i.RGBA32I)),v===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(G=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(G=i.R11F_G11F_B10F)),v===i.RGBA){const Mt=j?hr:Kt.getTransfer(X);O===i.FLOAT&&(G=i.RGBA32F),O===i.HALF_FLOAT&&(G=i.RGBA16F),O===i.UNSIGNED_BYTE&&(G=Mt===ne?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(G=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(G=i.RGB5_A1)}return(G===i.R16F||G===i.R32F||G===i.RG16F||G===i.RG32F||G===i.RGBA16F||G===i.RGBA32F)&&t.get("EXT_color_buffer_float"),G}function x(R,v){let O;return R?v===null||v===oi||v===ms?O=i.DEPTH24_STENCIL8:v===mn?O=i.DEPTH32F_STENCIL8:v===ps&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===oi||v===ms?O=i.DEPTH_COMPONENT24:v===mn?O=i.DEPTH_COMPONENT32F:v===ps&&(O=i.DEPTH_COMPONENT16),O}function A(R,v){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==je&&R.minFilter!==en?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function w(R){const v=R.target;v.removeEventListener("dispose",w),C(v),v.isVideoTexture&&h.delete(v)}function T(R){const v=R.target;v.removeEventListener("dispose",T),y(v)}function C(R){const v=n.get(R);if(v.__webglInit===void 0)return;const O=R.source,X=d.get(O);if(X){const j=X[v.__cacheKey];j.usedTimes--,j.usedTimes===0&&M(R),Object.keys(X).length===0&&d.delete(O)}n.remove(R)}function M(R){const v=n.get(R);i.deleteTexture(v.__webglTexture);const O=R.source,X=d.get(O);delete X[v.__cacheKey],a.memory.textures--}function y(R){const v=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let j=0;j<v.__webglFramebuffer[X].length;j++)i.deleteFramebuffer(v.__webglFramebuffer[X][j]);else i.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)i.deleteFramebuffer(v.__webglFramebuffer[X]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=R.textures;for(let X=0,j=O.length;X<j;X++){const G=n.get(O[X]);G.__webglTexture&&(i.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(O[X])}n.remove(R)}let L=0;function F(){L=0}function B(){const R=L;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function W(R){const v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function V(R,v){const O=n.get(R);if(R.isVideoTexture&&Bt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const X=R.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(O,R,v);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function Y(R,v){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function K(R,v){const O=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){q(O,R,v);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function H(R,v){const O=n.get(R);if(R.version>0&&O.__version!==R.version){Z(O,R,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}const rt={[cr]:i.REPEAT,[ri]:i.CLAMP_TO_EDGE,[_a]:i.MIRRORED_REPEAT},ct={[je]:i.NEAREST,[bh]:i.NEAREST_MIPMAP_NEAREST,[As]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[Tr]:i.LINEAR_MIPMAP_NEAREST,[kn]:i.LINEAR_MIPMAP_LINEAR},bt={[Ah]:i.NEVER,[Ih]:i.ALWAYS,[Rh]:i.LESS,[dc]:i.LEQUAL,[Ch]:i.EQUAL,[Dh]:i.GEQUAL,[Ph]:i.GREATER,[Lh]:i.NOTEQUAL};function Gt(R,v){if(v.type===mn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===en||v.magFilter===Tr||v.magFilter===As||v.magFilter===kn||v.minFilter===en||v.minFilter===Tr||v.minFilter===As||v.minFilter===kn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,rt[v.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,rt[v.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,rt[v.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ct[v.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ct[v.minFilter]),v.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,bt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===je||v.minFilter!==As&&v.minFilter!==kn||v.type===mn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ae(R,v){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",w));const X=v.source;let j=d.get(X);j===void 0&&(j={},d.set(X,j));const G=W(v);if(G!==R.__cacheKey){j[G]===void 0&&(j[G]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),j[G].usedTimes++;const Mt=j[R.__cacheKey];Mt!==void 0&&(j[R.__cacheKey].usedTimes--,Mt.usedTimes===0&&M(v)),R.__cacheKey=G,R.__webglTexture=j[G].texture}return O}function ue(R,v,O){return Math.floor(Math.floor(R/O)/v)}function Jt(R,v,O,X){const G=R.updateRanges;if(G.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,O,X,v.data);else{G.sort((tt,lt)=>tt.start-lt.start);let Mt=0;for(let tt=1;tt<G.length;tt++){const lt=G[Mt],Ct=G[tt],xt=lt.start+lt.count,at=ue(Ct.start,v.width,4),Nt=ue(lt.start,v.width,4);Ct.start<=xt+1&&at===Nt&&ue(Ct.start+Ct.count-1,v.width,4)===at?lt.count=Math.max(lt.count,Ct.start+Ct.count-lt.start):(++Mt,G[Mt]=Ct)}G.length=Mt+1;const nt=i.getParameter(i.UNPACK_ROW_LENGTH),_t=i.getParameter(i.UNPACK_SKIP_PIXELS),vt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let tt=0,lt=G.length;tt<lt;tt++){const Ct=G[tt],xt=Math.floor(Ct.start/4),at=Math.ceil(Ct.count/4),Nt=xt%v.width,I=Math.floor(xt/v.width),et=at,it=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Nt),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),e.texSubImage2D(i.TEXTURE_2D,0,Nt,I,et,it,O,X,v.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,nt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,_t),i.pixelStorei(i.UNPACK_SKIP_ROWS,vt)}}function q(R,v,O){let X=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=i.TEXTURE_3D);const j=ae(R,v),G=v.source;e.bindTexture(X,R.__webglTexture,i.TEXTURE0+O);const Mt=n.get(G);if(G.version!==Mt.__version||j===!0){e.activeTexture(i.TEXTURE0+O);const nt=Kt.getPrimaries(Kt.workingColorSpace),_t=v.colorSpace===zn?null:Kt.getPrimaries(v.colorSpace),vt=v.colorSpace===zn||nt===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let tt=_(v.image,!1,s.maxTextureSize);tt=we(v,tt);const lt=r.convert(v.format,v.colorSpace),Ct=r.convert(v.type);let xt=E(v.internalFormat,lt,Ct,v.colorSpace,v.isVideoTexture);Gt(X,v);let at;const Nt=v.mipmaps,I=v.isVideoTexture!==!0,et=Mt.__version===void 0||j===!0,it=G.dataReady,ut=A(v,tt);if(v.isDepthTexture)xt=x(v.format===_s,v.type),et&&(I?e.texStorage2D(i.TEXTURE_2D,1,xt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,xt,tt.width,tt.height,0,lt,Ct,null));else if(v.isDataTexture)if(Nt.length>0){I&&et&&e.texStorage2D(i.TEXTURE_2D,ut,xt,Nt[0].width,Nt[0].height);for(let J=0,$=Nt.length;J<$;J++)at=Nt[J],I?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,at.width,at.height,lt,Ct,at.data):e.texImage2D(i.TEXTURE_2D,J,xt,at.width,at.height,0,lt,Ct,at.data);v.generateMipmaps=!1}else I?(et&&e.texStorage2D(i.TEXTURE_2D,ut,xt,tt.width,tt.height),it&&Jt(v,tt,lt,Ct)):e.texImage2D(i.TEXTURE_2D,0,xt,tt.width,tt.height,0,lt,Ct,tt.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){I&&et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,xt,Nt[0].width,Nt[0].height,tt.depth);for(let J=0,$=Nt.length;J<$;J++)if(at=Nt[J],v.format!==$e)if(lt!==null)if(I){if(it)if(v.layerUpdates.size>0){const pt=gl(at.width,at.height,v.format,v.type);for(const It of v.layerUpdates){const oe=at.data.subarray(It*pt/at.data.BYTES_PER_ELEMENT,(It+1)*pt/at.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,It,at.width,at.height,1,lt,oe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,at.width,at.height,tt.depth,lt,at.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,xt,at.width,at.height,tt.depth,0,at.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?it&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,at.width,at.height,tt.depth,lt,Ct,at.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,xt,at.width,at.height,tt.depth,0,lt,Ct,at.data)}else{I&&et&&e.texStorage2D(i.TEXTURE_2D,ut,xt,Nt[0].width,Nt[0].height);for(let J=0,$=Nt.length;J<$;J++)at=Nt[J],v.format!==$e?lt!==null?I?it&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,at.width,at.height,lt,at.data):e.compressedTexImage2D(i.TEXTURE_2D,J,xt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,at.width,at.height,lt,Ct,at.data):e.texImage2D(i.TEXTURE_2D,J,xt,at.width,at.height,0,lt,Ct,at.data)}else if(v.isDataArrayTexture)if(I){if(et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,xt,tt.width,tt.height,tt.depth),it)if(v.layerUpdates.size>0){const J=gl(tt.width,tt.height,v.format,v.type);for(const $ of v.layerUpdates){const pt=tt.data.subarray($*J/tt.data.BYTES_PER_ELEMENT,($+1)*J/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,tt.width,tt.height,1,lt,Ct,pt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,lt,Ct,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,xt,tt.width,tt.height,tt.depth,0,lt,Ct,tt.data);else if(v.isData3DTexture)I?(et&&e.texStorage3D(i.TEXTURE_3D,ut,xt,tt.width,tt.height,tt.depth),it&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,lt,Ct,tt.data)):e.texImage3D(i.TEXTURE_3D,0,xt,tt.width,tt.height,tt.depth,0,lt,Ct,tt.data);else if(v.isFramebufferTexture){if(et)if(I)e.texStorage2D(i.TEXTURE_2D,ut,xt,tt.width,tt.height);else{let J=tt.width,$=tt.height;for(let pt=0;pt<ut;pt++)e.texImage2D(i.TEXTURE_2D,pt,xt,J,$,0,lt,Ct,null),J>>=1,$>>=1}}else if(Nt.length>0){if(I&&et){const J=xe(Nt[0]);e.texStorage2D(i.TEXTURE_2D,ut,xt,J.width,J.height)}for(let J=0,$=Nt.length;J<$;J++)at=Nt[J],I?it&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,lt,Ct,at):e.texImage2D(i.TEXTURE_2D,J,xt,lt,Ct,at);v.generateMipmaps=!1}else if(I){if(et){const J=xe(tt);e.texStorage2D(i.TEXTURE_2D,ut,xt,J.width,J.height)}it&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,lt,Ct,tt)}else e.texImage2D(i.TEXTURE_2D,0,xt,lt,Ct,tt);m(v)&&p(X),Mt.__version=G.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Z(R,v,O){if(v.image.length!==6)return;const X=ae(R,v),j=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);const G=n.get(j);if(j.version!==G.__version||X===!0){e.activeTexture(i.TEXTURE0+O);const Mt=Kt.getPrimaries(Kt.workingColorSpace),nt=v.colorSpace===zn?null:Kt.getPrimaries(v.colorSpace),_t=v.colorSpace===zn||Mt===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const vt=v.isCompressedTexture||v.image[0].isCompressedTexture,tt=v.image[0]&&v.image[0].isDataTexture,lt=[];for(let $=0;$<6;$++)!vt&&!tt?lt[$]=_(v.image[$],!0,s.maxCubemapSize):lt[$]=tt?v.image[$].image:v.image[$],lt[$]=we(v,lt[$]);const Ct=lt[0],xt=r.convert(v.format,v.colorSpace),at=r.convert(v.type),Nt=E(v.internalFormat,xt,at,v.colorSpace),I=v.isVideoTexture!==!0,et=G.__version===void 0||X===!0,it=j.dataReady;let ut=A(v,Ct);Gt(i.TEXTURE_CUBE_MAP,v);let J;if(vt){I&&et&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Nt,Ct.width,Ct.height);for(let $=0;$<6;$++){J=lt[$].mipmaps;for(let pt=0;pt<J.length;pt++){const It=J[pt];v.format!==$e?xt!==null?I?it&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt,0,0,It.width,It.height,xt,It.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt,Nt,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt,0,0,It.width,It.height,xt,at,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt,Nt,It.width,It.height,0,xt,at,It.data)}}}else{if(J=v.mipmaps,I&&et){J.length>0&&ut++;const $=xe(lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Nt,$.width,$.height)}for(let $=0;$<6;$++)if(tt){I?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,lt[$].width,lt[$].height,xt,at,lt[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Nt,lt[$].width,lt[$].height,0,xt,at,lt[$].data);for(let pt=0;pt<J.length;pt++){const oe=J[pt].image[$].image;I?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt+1,0,0,oe.width,oe.height,xt,at,oe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt+1,Nt,oe.width,oe.height,0,xt,at,oe.data)}}else{I?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,xt,at,lt[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Nt,xt,at,lt[$]);for(let pt=0;pt<J.length;pt++){const It=J[pt];I?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt+1,0,0,xt,at,It.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,pt+1,Nt,xt,at,It.image[$])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),G.__version=j.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function dt(R,v,O,X,j,G){const Mt=r.convert(O.format,O.colorSpace),nt=r.convert(O.type),_t=E(O.internalFormat,Mt,nt,O.colorSpace),vt=n.get(v),tt=n.get(O);if(tt.__renderTarget=v,!vt.__hasExternalTextures){const lt=Math.max(1,v.width>>G),Ct=Math.max(1,v.height>>G);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?e.texImage3D(j,G,_t,lt,Ct,v.depth,0,Mt,nt,null):e.texImage2D(j,G,_t,lt,Ct,0,Mt,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,j,tt.__webglTexture,0,fe(v)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,j,tt.__webglTexture,G),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(R,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),v.depthBuffer){const X=v.depthTexture,j=X&&X.isDepthTexture?X.type:null,G=x(v.stencilBuffer,j),Mt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=fe(v);gt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,G,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,G,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,G,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Mt,i.RENDERBUFFER,R)}else{const X=v.textures;for(let j=0;j<X.length;j++){const G=X[j],Mt=r.convert(G.format,G.colorSpace),nt=r.convert(G.type),_t=E(G.internalFormat,Mt,nt,G.colorSpace),vt=fe(v);O&&gt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,vt,_t,v.width,v.height):gt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,vt,_t,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,_t,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(R,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(v.depthTexture);X.__renderTarget=v,(!X.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),V(v.depthTexture,0);const j=X.__webglTexture,G=fe(v);if(v.depthTexture.format===gs)gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(v.depthTexture.format===_s)gt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,G):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Xt(R){const v=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){const X=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){const j=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),v.__depthDisposeCallback=j}v.__boundDepthTexture=X}if(R.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const X=R.texture.mipmaps;X&&X.length>0?St(v.__webglFramebuffer[0],R):St(v.__webglFramebuffer,R)}else if(O){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=i.createRenderbuffer(),Dt(v.__webglDepthbuffer[X],R,!1);else{const j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,G)}}else{const X=R.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Dt(v.__webglDepthbuffer,R,!1);else{const j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,G)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(R,v,O){const X=n.get(R);v!==void 0&&dt(X.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Xt(R)}function P(R){const v=R.texture,O=n.get(R),X=n.get(v);R.addEventListener("dispose",T);const j=R.textures,G=R.isWebGLCubeRenderTarget===!0,Mt=j.length>1;if(Mt||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=v.version,a.memory.textures++),G){O.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[nt]=[];for(let _t=0;_t<v.mipmaps.length;_t++)O.__webglFramebuffer[nt][_t]=i.createFramebuffer()}else O.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let nt=0;nt<v.mipmaps.length;nt++)O.__webglFramebuffer[nt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Mt)for(let nt=0,_t=j.length;nt<_t;nt++){const vt=n.get(j[nt]);vt.__webglTexture===void 0&&(vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&gt(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let nt=0;nt<j.length;nt++){const _t=j[nt];O.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[nt]);const vt=r.convert(_t.format,_t.colorSpace),tt=r.convert(_t.type),lt=E(_t.internalFormat,vt,tt,_t.colorSpace,R.isXRRenderTarget===!0),Ct=fe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,lt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,O.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Dt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(G){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Gt(i.TEXTURE_CUBE_MAP,v);for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)dt(O.__webglFramebuffer[nt][_t],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t);else dt(O.__webglFramebuffer[nt],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(v)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let nt=0,_t=j.length;nt<_t;nt++){const vt=j[nt],tt=n.get(vt);let lt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(lt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,tt.__webglTexture),Gt(lt,vt),dt(O.__webglFramebuffer,R,vt,i.COLOR_ATTACHMENT0+nt,lt,0),m(vt)&&p(lt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(nt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,X.__webglTexture),Gt(nt,v),v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)dt(O.__webglFramebuffer[_t],R,v,i.COLOR_ATTACHMENT0,nt,_t);else dt(O.__webglFramebuffer,R,v,i.COLOR_ATTACHMENT0,nt,0);m(v)&&p(nt),e.unbindTexture()}R.depthBuffer&&Xt(R)}function de(R){const v=R.textures;for(let O=0,X=v.length;O<X;O++){const j=v[O];if(m(j)){const G=b(R),Mt=n.get(j).__webglTexture;e.bindTexture(G,Mt),p(G),e.unbindTexture()}}}const Ut=[],Pt=[];function mt(R){if(R.samples>0){if(gt(R)===!1){const v=R.textures,O=R.width,X=R.height;let j=i.COLOR_BUFFER_BIT;const G=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=n.get(R),nt=v.length>1;if(nt)for(let vt=0;vt<v.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer);const _t=R.texture.mipmaps;_t&&_t.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let vt=0;vt<v.length;vt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[vt]);const tt=n.get(v[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,O,X,0,0,O,X,j,i.NEAREST),l===!0&&(Ut.length=0,Pt.length=0,Ut.push(i.COLOR_ATTACHMENT0+vt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Ut.push(G),Pt.push(G),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Pt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let vt=0;vt<v.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[vt]);const tt=n.get(v[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,tt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const v=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function fe(R){return Math.min(s.maxSamples,R.samples)}function gt(R){const v=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Bt(R){const v=a.render.frame;h.get(R)!==v&&(h.set(R,v),R.update())}function we(R,v){const O=R.colorSpace,X=R.format,j=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Vi&&O!==zn&&(Kt.getTransfer(O)===ne?(X!==$e||j!==_n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function xe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.setTexture2D=V,this.setTexture2DArray=Y,this.setTexture3D=K,this.setTextureCube=H,this.rebindTextures=Ae,this.setupRenderTarget=P,this.updateRenderTargetMipmap=de,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=gt}function lg(i,t){function e(n,s=zn){let r;const a=Kt.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===to)return i.UNSIGNED_SHORT_4_4_4_4;if(n===eo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===oc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===lc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===rc)return i.BYTE;if(n===ac)return i.SHORT;if(n===ps)return i.UNSIGNED_SHORT;if(n===Qa)return i.INT;if(n===oi)return i.UNSIGNED_INT;if(n===mn)return i.FLOAT;if(n===Ss)return i.HALF_FLOAT;if(n===cc)return i.ALPHA;if(n===hc)return i.RGB;if(n===$e)return i.RGBA;if(n===gs)return i.DEPTH_COMPONENT;if(n===_s)return i.DEPTH_STENCIL;if(n===no)return i.RED;if(n===io)return i.RED_INTEGER;if(n===uc)return i.RG;if(n===so)return i.RG_INTEGER;if(n===ro)return i.RGBA_INTEGER;if(n===Qs||n===tr||n===er||n===nr)if(a===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===tr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===nr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===va||n===xa||n===Ma||n===ya)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Sa||n===ba||n===Ea)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Sa||n===ba)return a===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ea)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===wa||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ia||n===Ua||n===Na||n===Fa||n===Oa||n===Ba)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ta)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Aa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ra)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ca)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===La)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Da)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ia)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ua)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Na)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Oa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ba)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===za||n===ka||n===Ha)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===za)return a===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ka)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ha)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ga||n===Va||n===Wa||n===Xa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ga)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Va)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Wa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Xa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ms?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const cg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hg=`
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

}`;class ug{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ec(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Cn({vertexShader:cg,fragmentShader:hg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qt(new ci(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dg extends $i{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new ug,p={},b=e.getContextAttributes();let E=null,x=null;const A=[],w=[],T=new kt;let C=null;const M=new on;M.viewport=new he;const y=new on;y.viewport=new he;const L=[M,y],F=new Lu;let B=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Z=A[q];return Z===void 0&&(Z=new qr,A[q]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(q){let Z=A[q];return Z===void 0&&(Z=new qr,A[q]=Z),Z.getGripSpace()},this.getHand=function(q){let Z=A[q];return Z===void 0&&(Z=new qr,A[q]=Z),Z.getHandSpace()};function V(q){const Z=w.indexOf(q.inputSource);if(Z===-1)return;const dt=A[Z];dt!==void 0&&(dt.update(q.inputSource,q.frame,c||a),dt.dispatchEvent({type:q.type,data:q.inputSource}))}function Y(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",K);for(let q=0;q<A.length;q++){const Z=w[q];Z!==null&&(w[q]=null,A[q].disconnect(Z))}B=null,W=null,m.reset();for(const q in p)delete p[q];t.setRenderTarget(E),f=null,d=null,u=null,s=null,x=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,Dt=null,St=null;b.depth&&(St=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=b.stencil?_s:gs,Dt=b.stencil?ms:oi);const Xt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Xt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new li(d.textureWidth,d.textureHeight,{format:$e,type:_n,depthTexture:new bc(d.textureWidth,d.textureHeight,Dt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const dt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,dt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new li(f.framebufferWidth,f.framebufferHeight,{format:$e,type:_n,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(q){for(let Z=0;Z<q.removed.length;Z++){const dt=q.removed[Z],Dt=w.indexOf(dt);Dt>=0&&(w[Dt]=null,A[Dt].disconnect(dt))}for(let Z=0;Z<q.added.length;Z++){const dt=q.added[Z];let Dt=w.indexOf(dt);if(Dt===-1){for(let Xt=0;Xt<A.length;Xt++)if(Xt>=w.length){w.push(dt),Dt=Xt;break}else if(w[Xt]===null){w[Xt]=dt,Dt=Xt;break}if(Dt===-1)break}const St=A[Dt];St&&St.connect(dt)}}const H=new D,rt=new D;function ct(q,Z,dt){H.setFromMatrixPosition(Z.matrixWorld),rt.setFromMatrixPosition(dt.matrixWorld);const Dt=H.distanceTo(rt),St=Z.projectionMatrix.elements,Xt=dt.projectionMatrix.elements,Ae=St[14]/(St[10]-1),P=St[14]/(St[10]+1),de=(St[9]+1)/St[5],Ut=(St[9]-1)/St[5],Pt=(St[8]-1)/St[0],mt=(Xt[8]+1)/Xt[0],fe=Ae*Pt,gt=Ae*mt,Bt=Dt/(-Pt+mt),we=Bt*-Pt;if(Z.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(we),q.translateZ(Bt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),St[10]===-1)q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const xe=Ae+Bt,R=P+Bt,v=fe-we,O=gt+(Dt-we),X=de*P/R*xe,j=Ut*P/R*xe;q.projectionMatrix.makePerspective(v,O,X,j,xe,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function bt(q,Z){Z===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Z.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Z=q.near,dt=q.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(dt=m.depthFar)),F.near=y.near=M.near=Z,F.far=y.far=M.far=dt,(B!==F.near||W!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),B=F.near,W=F.far),F.layers.mask=q.layers.mask|6,M.layers.mask=F.layers.mask&3,y.layers.mask=F.layers.mask&5;const Dt=q.parent,St=F.cameras;bt(F,Dt);for(let Xt=0;Xt<St.length;Xt++)bt(St[Xt],Dt);St.length===2?ct(F,M,y):F.projectionMatrix.copy(M.projectionMatrix),Gt(q,F,Dt)};function Gt(q,Z,dt){dt===null?q.matrix.copy(Z.matrixWorld):(q.matrix.copy(dt.matrixWorld),q.matrix.invert(),q.matrix.multiply(Z.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=vs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(q){return p[q]};let ae=null;function ue(q,Z){if(h=Z.getViewerPose(c||a),g=Z,h!==null){const dt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let Dt=!1;dt.length!==F.cameras.length&&(F.cameras.length=0,Dt=!0);for(let P=0;P<dt.length;P++){const de=dt[P];let Ut=null;if(f!==null)Ut=f.getViewport(de);else{const mt=u.getViewSubImage(d,de);Ut=mt.viewport,P===0&&(t.setRenderTargetTextures(x,mt.colorTexture,mt.depthStencilTexture),t.setRenderTarget(x))}let Pt=L[P];Pt===void 0&&(Pt=new on,Pt.layers.enable(P),Pt.viewport=new he,L[P]=Pt),Pt.matrix.fromArray(de.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(de.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),P===0&&(F.matrix.copy(Pt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Dt===!0&&F.cameras.push(Pt)}const St=s.enabledFeatures;if(St&&St.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const P=u.getDepthInformation(dt[0]);P&&P.isValid&&P.texture&&m.init(P,s.renderState)}if(St&&St.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let P=0;P<dt.length;P++){const de=dt[P].camera;if(de){let Ut=p[de];Ut||(Ut=new Ec,p[de]=Ut);const Pt=u.getCameraImage(de);Ut.sourceTexture=Pt}}}}for(let dt=0;dt<A.length;dt++){const Dt=w[dt],St=A[dt];Dt!==null&&St!==void 0&&St.update(Dt,Z,c||a)}ae&&ae(q,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Jt=new Ac;Jt.setAnimationLoop(ue),this.setAnimationLoop=function(q){ae=q},this.dispose=function(){}}}const Qn=new hn,fg=new le;function pg(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,vc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,E,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===He&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===He&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const b=t.get(p),E=b.envMap,x=b.envMapRotation;E&&(m.envMap.value=E,Qn.copy(x),Qn.x*=-1,Qn.y*=-1,Qn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Qn.y*=-1,Qn.z*=-1),m.envMapRotation.value.setFromMatrix4(fg.makeRotationFromEuler(Qn)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===He&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function mg(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,E){const x=E.program;n.uniformBlockBinding(b,x)}function c(b,E){let x=s[b.id];x===void 0&&(g(b),x=h(b),s[b.id]=x,b.addEventListener("dispose",m));const A=E.program;n.updateUBOMapping(b,A);const w=t.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){const E=u();b.__bindingPointIndex=E;const x=i.createBuffer(),A=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,x),x}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const E=s[b.id],x=b.uniforms,A=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let w=0,T=x.length;w<T;w++){const C=Array.isArray(x[w])?x[w]:[x[w]];for(let M=0,y=C.length;M<y;M++){const L=C[M];if(f(L,w,M,A)===!0){const F=L.__offset,B=Array.isArray(L.value)?L.value:[L.value];let W=0;for(let V=0;V<B.length;V++){const Y=B[V],K=_(Y);typeof Y=="number"||typeof Y=="boolean"?(L.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,F+W,L.__data)):Y.isMatrix3?(L.__data[0]=Y.elements[0],L.__data[1]=Y.elements[1],L.__data[2]=Y.elements[2],L.__data[3]=0,L.__data[4]=Y.elements[3],L.__data[5]=Y.elements[4],L.__data[6]=Y.elements[5],L.__data[7]=0,L.__data[8]=Y.elements[6],L.__data[9]=Y.elements[7],L.__data[10]=Y.elements[8],L.__data[11]=0):(Y.toArray(L.__data,W),W+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,E,x,A){const w=b.value,T=E+"_"+x;if(A[T]===void 0)return typeof w=="number"||typeof w=="boolean"?A[T]=w:A[T]=w.clone(),!0;{const C=A[T];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return A[T]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(b){const E=b.uniforms;let x=0;const A=16;for(let T=0,C=E.length;T<C;T++){const M=Array.isArray(E[T])?E[T]:[E[T]];for(let y=0,L=M.length;y<L;y++){const F=M[y],B=Array.isArray(F.value)?F.value:[F.value];for(let W=0,V=B.length;W<V;W++){const Y=B[W],K=_(Y),H=x%A,rt=H%K.boundary,ct=H+rt;x+=rt,ct!==0&&A-ct<K.storage&&(x+=A-ct),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=K.storage}}}const w=x%A;return w>0&&(x+=A-w),b.__size=x,b.__cache={},this}function _(b){const E={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(E.boundary=4,E.storage=4):b.isVector2?(E.boundary=8,E.storage=8):b.isVector3||b.isColor?(E.boundary=16,E.storage=12):b.isVector4?(E.boundary=16,E.storage=16):b.isMatrix3?(E.boundary=48,E.storage=48):b.isMatrix4?(E.boundary=64,E.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),E}function m(b){const E=b.target;E.removeEventListener("dispose",m);const x=a.indexOf(E.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Hl{constructor(t={}){const{canvas:e=Kh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const b=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let A=!1;this._outputColorSpace=Ye;let w=0,T=0,C=null,M=-1,y=null;const L=new he,F=new he;let B=null;const W=new wt(0);let V=0,Y=e.width,K=e.height,H=1,rt=null,ct=null;const bt=new he(0,0,Y,K),Gt=new he(0,0,Y,K);let ae=!1;const ue=new fo;let Jt=!1,q=!1;const Z=new le,dt=new D,Dt=new he,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function Ae(){return C===null?H:1}let P=n;function de(S,U){return e.getContext(S,U)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Za}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",J,!1),P===null){const U="webgl2";if(P=de(U,S),P===null)throw de(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ut,Pt,mt,fe,gt,Bt,we,xe,R,v,O,X,j,G,Mt,nt,_t,vt,tt,lt,Ct,xt,at,Nt;function I(){Ut=new Tp(P),Ut.init(),xt=new lg(P,Ut),Pt=new xp(P,Ut,t,xt),mt=new ag(P,Ut),Pt.reversedDepthBuffer&&d&&mt.buffers.depth.setReversed(!0),fe=new Cp(P),gt=new qm,Bt=new og(P,Ut,mt,gt,Pt,xt,fe),we=new yp(x),xe=new wp(x),R=new Uu(P),at=new _p(P,R),v=new Ap(P,R,fe,at),O=new Lp(P,v,R,fe),tt=new Pp(P,Pt,Bt),nt=new Mp(gt),X=new Ym(x,we,xe,Ut,Pt,at,nt),j=new pg(x,gt),G=new jm,Mt=new eg(Ut),vt=new gp(x,we,xe,mt,O,f,l),_t=new sg(x,O,Pt),Nt=new mg(P,fe,Pt,mt),lt=new vp(P,Ut,fe),Ct=new Rp(P,Ut,fe),fe.programs=X.programs,x.capabilities=Pt,x.extensions=Ut,x.properties=gt,x.renderLists=G,x.shadowMap=_t,x.state=mt,x.info=fe}I();const et=new dg(x,P);this.xr=et,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const S=Ut.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ut.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(S){S!==void 0&&(H=S,this.setSize(Y,K,!1))},this.getSize=function(S){return S.set(Y,K)},this.setSize=function(S,U,z=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=S,K=U,e.width=Math.floor(S*H),e.height=Math.floor(U*H),z===!0&&(e.style.width=S+"px",e.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(Y*H,K*H).floor()},this.setDrawingBufferSize=function(S,U,z){Y=S,K=U,H=z,e.width=Math.floor(S*z),e.height=Math.floor(U*z),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(L)},this.getViewport=function(S){return S.copy(bt)},this.setViewport=function(S,U,z,k){S.isVector4?bt.set(S.x,S.y,S.z,S.w):bt.set(S,U,z,k),mt.viewport(L.copy(bt).multiplyScalar(H).round())},this.getScissor=function(S){return S.copy(Gt)},this.setScissor=function(S,U,z,k){S.isVector4?Gt.set(S.x,S.y,S.z,S.w):Gt.set(S,U,z,k),mt.scissor(F.copy(Gt).multiplyScalar(H).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(S){mt.setScissorTest(ae=S)},this.setOpaqueSort=function(S){rt=S},this.setTransparentSort=function(S){ct=S},this.getClearColor=function(S){return S.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,z=!0){let k=0;if(S){let N=!1;if(C!==null){const Q=C.texture.format;N=Q===ro||Q===so||Q===io}if(N){const Q=C.texture.type,ot=Q===_n||Q===oi||Q===ps||Q===ms||Q===to||Q===eo,ft=vt.getClearColor(),ht=vt.getClearAlpha(),Rt=ft.r,Lt=ft.g,Et=ft.b;ot?(g[0]=Rt,g[1]=Lt,g[2]=Et,g[3]=ht,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Rt,_[1]=Lt,_[2]=Et,_[3]=ht,P.clearBufferiv(P.COLOR,0,_))}else k|=P.COLOR_BUFFER_BIT}U&&(k|=P.DEPTH_BUFFER_BIT),z&&(k|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",J,!1),vt.dispose(),G.dispose(),Mt.dispose(),gt.dispose(),we.dispose(),xe.dispose(),O.dispose(),at.dispose(),Nt.dispose(),X.dispose(),et.dispose(),et.removeEventListener("sessionstart",un),et.removeEventListener("sessionend",Ao),Yn.stop()};function it(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const S=fe.autoReset,U=_t.enabled,z=_t.autoUpdate,k=_t.needsUpdate,N=_t.type;I(),fe.autoReset=S,_t.enabled=U,_t.autoUpdate=z,_t.needsUpdate=k,_t.type=N}function J(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function $(S){const U=S.target;U.removeEventListener("dispose",$),pt(U)}function pt(S){It(S),gt.remove(S)}function It(S){const U=gt.get(S).programs;U!==void 0&&(U.forEach(function(z){X.releaseProgram(z)}),S.isShaderMaterial&&X.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,z,k,N,Q){U===null&&(U=St);const ot=N.isMesh&&N.matrixWorld.determinant()<0,ft=kc(S,U,z,k,N);mt.setMaterial(k,ot);let ht=z.index,Rt=1;if(k.wireframe===!0){if(ht=v.getWireframeAttribute(z),ht===void 0)return;Rt=2}const Lt=z.drawRange,Et=z.attributes.position;let Wt=Lt.start*Rt,ee=(Lt.start+Lt.count)*Rt;Q!==null&&(Wt=Math.max(Wt,Q.start*Rt),ee=Math.min(ee,(Q.start+Q.count)*Rt)),ht!==null?(Wt=Math.max(Wt,0),ee=Math.min(ee,ht.count)):Et!=null&&(Wt=Math.max(Wt,0),ee=Math.min(ee,Et.count));const ge=ee-Wt;if(ge<0||ge===1/0)return;at.setup(N,k,ft,z,ht);let ce,re=lt;if(ht!==null&&(ce=R.get(ht),re=Ct,re.setIndex(ce)),N.isMesh)k.wireframe===!0?(mt.setLineWidth(k.wireframeLinewidth*Ae()),re.setMode(P.LINES)):re.setMode(P.TRIANGLES);else if(N.isLine){let Tt=k.linewidth;Tt===void 0&&(Tt=1),mt.setLineWidth(Tt*Ae()),N.isLineSegments?re.setMode(P.LINES):N.isLineLoop?re.setMode(P.LINE_LOOP):re.setMode(P.LINE_STRIP)}else N.isPoints?re.setMode(P.POINTS):N.isSprite&&re.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)xs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),re.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ut.get("WEBGL_multi_draw"))re.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Tt=N._multiDrawStarts,pe=N._multiDrawCounts,jt=N._multiDrawCount,Ge=ht?R.get(ht).bytesPerElement:1,pi=gt.get(k).currentProgram.getUniforms();for(let Ve=0;Ve<jt;Ve++)pi.setValue(P,"_gl_DrawID",Ve),re.render(Tt[Ve]/Ge,pe[Ve])}else if(N.isInstancedMesh)re.renderInstances(Wt,ge,N.count);else if(z.isInstancedBufferGeometry){const Tt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,pe=Math.min(z.instanceCount,Tt);re.renderInstances(Wt,ge,pe)}else re.render(Wt,ge)};function oe(S,U,z){S.transparent===!0&&S.side===Le&&S.forceSinglePass===!1?(S.side=He,S.needsUpdate=!0,Ts(S,U,z),S.side=Xn,S.needsUpdate=!0,Ts(S,U,z),S.side=Le):Ts(S,U,z)}this.compile=function(S,U,z=null){z===null&&(z=S),p=Mt.get(z),p.init(U),E.push(p),z.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),S!==z&&S.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const k=new Set;return S.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const Q=N.material;if(Q)if(Array.isArray(Q))for(let ot=0;ot<Q.length;ot++){const ft=Q[ot];oe(ft,z,N),k.add(ft)}else oe(Q,z,N),k.add(Q)}),p=E.pop(),k},this.compileAsync=function(S,U,z=null){const k=this.compile(S,U,z);return new Promise(N=>{function Q(){if(k.forEach(function(ot){gt.get(ot).currentProgram.isReady()&&k.delete(ot)}),k.size===0){N(S);return}setTimeout(Q,10)}Ut.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Qt=null;function vn(S){Qt&&Qt(S)}function un(){Yn.stop()}function Ao(){Yn.start()}const Yn=new Ac;Yn.setAnimationLoop(vn),typeof self<"u"&&Yn.setContext(self),this.setAnimationLoop=function(S){Qt=S,et.setAnimationLoop(S),S===null?Yn.stop():Yn.start()},et.addEventListener("sessionstart",un),et.addEventListener("sessionend",Ao),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(U),U=et.getCamera()),S.isScene===!0&&S.onBeforeRender(x,S,U,C),p=Mt.get(S,E.length),p.init(U),E.push(p),Z.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ue.setFromProjectionMatrix(Z,gn,U.reversedDepth),q=this.localClippingEnabled,Jt=nt.init(this.clippingPlanes,q),m=G.get(S,b.length),m.init(),b.push(m),et.enabled===!0&&et.isPresenting===!0){const Q=x.xr.getDepthSensingMesh();Q!==null&&Er(Q,U,-1/0,x.sortObjects)}Er(S,U,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(rt,ct),Xt=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Xt&&vt.addToRenderList(m,S),this.info.render.frame++,Jt===!0&&nt.beginShadows();const z=p.state.shadowsArray;_t.render(z,S,U),Jt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){const Q=U.cameras;if(N.length>0)for(let ot=0,ft=Q.length;ot<ft;ot++){const ht=Q[ot];Co(k,N,S,ht)}Xt&&vt.render(S);for(let ot=0,ft=Q.length;ot<ft;ot++){const ht=Q[ot];Ro(m,S,ht,ht.viewport)}}else N.length>0&&Co(k,N,S,U),Xt&&vt.render(S),Ro(m,S,U);C!==null&&T===0&&(Bt.updateMultisampleRenderTarget(C),Bt.updateRenderTargetMipmap(C)),S.isScene===!0&&S.onAfterRender(x,S,U),at.resetDefaultState(),M=-1,y=null,E.pop(),E.length>0?(p=E[E.length-1],Jt===!0&&nt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Er(S,U,z,k){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ue.intersectsSprite(S)){k&&Dt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Z);const ot=O.update(S),ft=S.material;ft.visible&&m.push(S,ot,ft,z,Dt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ue.intersectsObject(S))){const ot=O.update(S),ft=S.material;if(k&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Dt.copy(S.boundingSphere.center)):(ot.boundingSphere===null&&ot.computeBoundingSphere(),Dt.copy(ot.boundingSphere.center)),Dt.applyMatrix4(S.matrixWorld).applyMatrix4(Z)),Array.isArray(ft)){const ht=ot.groups;for(let Rt=0,Lt=ht.length;Rt<Lt;Rt++){const Et=ht[Rt],Wt=ft[Et.materialIndex];Wt&&Wt.visible&&m.push(S,ot,Wt,z,Dt.z,Et)}}else ft.visible&&m.push(S,ot,ft,z,Dt.z,null)}}const Q=S.children;for(let ot=0,ft=Q.length;ot<ft;ot++)Er(Q[ot],U,z,k)}function Ro(S,U,z,k){const N=S.opaque,Q=S.transmissive,ot=S.transparent;p.setupLightsView(z),Jt===!0&&nt.setGlobalState(x.clippingPlanes,z),k&&mt.viewport(L.copy(k)),N.length>0&&ws(N,U,z),Q.length>0&&ws(Q,U,z),ot.length>0&&ws(ot,U,z),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Co(S,U,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new li(1,1,{generateMipmaps:!0,type:Ut.has("EXT_color_buffer_half_float")||Ut.has("EXT_color_buffer_float")?Ss:_n,minFilter:kn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const Q=p.state.transmissionRenderTarget[k.id],ot=k.viewport||L;Q.setSize(ot.z*x.transmissionResolutionScale,ot.w*x.transmissionResolutionScale);const ft=x.getRenderTarget(),ht=x.getActiveCubeFace(),Rt=x.getActiveMipmapLevel();x.setRenderTarget(Q),x.getClearColor(W),V=x.getClearAlpha(),V<1&&x.setClearColor(16777215,.5),x.clear(),Xt&&vt.render(z);const Lt=x.toneMapping;x.toneMapping=Vn;const Et=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),Jt===!0&&nt.setGlobalState(x.clippingPlanes,k),ws(S,z,k),Bt.updateMultisampleRenderTarget(Q),Bt.updateRenderTargetMipmap(Q),Ut.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let ee=0,ge=U.length;ee<ge;ee++){const ce=U[ee],re=ce.object,Tt=ce.geometry,pe=ce.material,jt=ce.group;if(pe.side===Le&&re.layers.test(k.layers)){const Ge=pe.side;pe.side=He,pe.needsUpdate=!0,Po(re,z,k,Tt,pe,jt),pe.side=Ge,pe.needsUpdate=!0,Wt=!0}}Wt===!0&&(Bt.updateMultisampleRenderTarget(Q),Bt.updateRenderTargetMipmap(Q))}x.setRenderTarget(ft,ht,Rt),x.setClearColor(W,V),Et!==void 0&&(k.viewport=Et),x.toneMapping=Lt}function ws(S,U,z){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,Q=S.length;N<Q;N++){const ot=S[N],ft=ot.object,ht=ot.geometry,Rt=ot.group;let Lt=ot.material;Lt.allowOverride===!0&&k!==null&&(Lt=k),ft.layers.test(z.layers)&&Po(ft,U,z,ht,Lt,Rt)}}function Po(S,U,z,k,N,Q){S.onBeforeRender(x,U,z,k,N,Q),S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(x,U,z,k,S,Q),N.transparent===!0&&N.side===Le&&N.forceSinglePass===!1?(N.side=He,N.needsUpdate=!0,x.renderBufferDirect(z,U,k,N,S,Q),N.side=Xn,N.needsUpdate=!0,x.renderBufferDirect(z,U,k,N,S,Q),N.side=Le):x.renderBufferDirect(z,U,k,N,S,Q),S.onAfterRender(x,U,z,k,N,Q)}function Ts(S,U,z){U.isScene!==!0&&(U=St);const k=gt.get(S),N=p.state.lights,Q=p.state.shadowsArray,ot=N.state.version,ft=X.getParameters(S,N.state,Q,U,z),ht=X.getProgramCacheKey(ft);let Rt=k.programs;k.environment=S.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(S.isMeshStandardMaterial?xe:we).get(S.envMap||k.environment),k.envMapRotation=k.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,Rt===void 0&&(S.addEventListener("dispose",$),Rt=new Map,k.programs=Rt);let Lt=Rt.get(ht);if(Lt!==void 0){if(k.currentProgram===Lt&&k.lightsStateVersion===ot)return Do(S,ft),Lt}else ft.uniforms=X.getUniforms(S),S.onBeforeCompile(ft,x),Lt=X.acquireProgram(ft,ht),Rt.set(ht,Lt),k.uniforms=ft.uniforms;const Et=k.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Et.clippingPlanes=nt.uniform),Do(S,ft),k.needsLights=Gc(S),k.lightsStateVersion=ot,k.needsLights&&(Et.ambientLightColor.value=N.state.ambient,Et.lightProbe.value=N.state.probe,Et.directionalLights.value=N.state.directional,Et.directionalLightShadows.value=N.state.directionalShadow,Et.spotLights.value=N.state.spot,Et.spotLightShadows.value=N.state.spotShadow,Et.rectAreaLights.value=N.state.rectArea,Et.ltc_1.value=N.state.rectAreaLTC1,Et.ltc_2.value=N.state.rectAreaLTC2,Et.pointLights.value=N.state.point,Et.pointLightShadows.value=N.state.pointShadow,Et.hemisphereLights.value=N.state.hemi,Et.directionalShadowMap.value=N.state.directionalShadowMap,Et.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Et.spotShadowMap.value=N.state.spotShadowMap,Et.spotLightMatrix.value=N.state.spotLightMatrix,Et.spotLightMap.value=N.state.spotLightMap,Et.pointShadowMap.value=N.state.pointShadowMap,Et.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Lt,k.uniformsList=null,Lt}function Lo(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=ir.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function Do(S,U){const z=gt.get(S);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function kc(S,U,z,k,N){U.isScene!==!0&&(U=St),Bt.resetTextureUnits();const Q=U.fog,ot=k.isMeshStandardMaterial?U.environment:null,ft=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Vi,ht=(k.isMeshStandardMaterial?xe:we).get(k.envMap||ot),Rt=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Lt=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Et=!!z.morphAttributes.position,Wt=!!z.morphAttributes.normal,ee=!!z.morphAttributes.color;let ge=Vn;k.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ge=x.toneMapping);const ce=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,re=ce!==void 0?ce.length:0,Tt=gt.get(k),pe=p.state.lights;if(Jt===!0&&(q===!0||S!==y)){const Ne=S===y&&k.id===M;nt.setState(k,S,Ne)}let jt=!1;k.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==pe.state.version||Tt.outputColorSpace!==ft||N.isBatchedMesh&&Tt.batching===!1||!N.isBatchedMesh&&Tt.batching===!0||N.isBatchedMesh&&Tt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Tt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Tt.instancing===!1||!N.isInstancedMesh&&Tt.instancing===!0||N.isSkinnedMesh&&Tt.skinning===!1||!N.isSkinnedMesh&&Tt.skinning===!0||N.isInstancedMesh&&Tt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Tt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Tt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Tt.instancingMorph===!1&&N.morphTexture!==null||Tt.envMap!==ht||k.fog===!0&&Tt.fog!==Q||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==nt.numPlanes||Tt.numIntersection!==nt.numIntersection)||Tt.vertexAlphas!==Rt||Tt.vertexTangents!==Lt||Tt.morphTargets!==Et||Tt.morphNormals!==Wt||Tt.morphColors!==ee||Tt.toneMapping!==ge||Tt.morphTargetsCount!==re)&&(jt=!0):(jt=!0,Tt.__version=k.version);let Ge=Tt.currentProgram;jt===!0&&(Ge=Ts(k,U,N));let pi=!1,Ve=!1,Ji=!1;const me=Ge.getUniforms(),Ze=Tt.uniforms;if(mt.useProgram(Ge.program)&&(pi=!0,Ve=!0,Ji=!0),k.id!==M&&(M=k.id,Ve=!0),pi||y!==S){mt.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),me.setValue(P,"projectionMatrix",S.projectionMatrix),me.setValue(P,"viewMatrix",S.matrixWorldInverse);const Be=me.map.cameraPosition;Be!==void 0&&Be.setValue(P,dt.setFromMatrixPosition(S.matrixWorld)),Pt.logarithmicDepthBuffer&&me.setValue(P,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&me.setValue(P,"isOrthographic",S.isOrthographicCamera===!0),y!==S&&(y=S,Ve=!0,Ji=!0)}if(N.isSkinnedMesh){me.setOptional(P,N,"bindMatrix"),me.setOptional(P,N,"bindMatrixInverse");const Ne=N.skeleton;Ne&&(Ne.boneTexture===null&&Ne.computeBoneTexture(),me.setValue(P,"boneTexture",Ne.boneTexture,Bt))}N.isBatchedMesh&&(me.setOptional(P,N,"batchingTexture"),me.setValue(P,"batchingTexture",N._matricesTexture,Bt),me.setOptional(P,N,"batchingIdTexture"),me.setValue(P,"batchingIdTexture",N._indirectTexture,Bt),me.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&me.setValue(P,"batchingColorTexture",N._colorsTexture,Bt));const Je=z.morphAttributes;if((Je.position!==void 0||Je.normal!==void 0||Je.color!==void 0)&&tt.update(N,z,Ge),(Ve||Tt.receiveShadow!==N.receiveShadow)&&(Tt.receiveShadow=N.receiveShadow,me.setValue(P,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Ze.envMap.value=ht,Ze.flipEnvMap.value=ht.isCubeTexture&&ht.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(Ze.envMapIntensity.value=U.environmentIntensity),Ve&&(me.setValue(P,"toneMappingExposure",x.toneMappingExposure),Tt.needsLights&&Hc(Ze,Ji),Q&&k.fog===!0&&j.refreshFogUniforms(Ze,Q),j.refreshMaterialUniforms(Ze,k,H,K,p.state.transmissionRenderTarget[S.id]),ir.upload(P,Lo(Tt),Ze,Bt)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(ir.upload(P,Lo(Tt),Ze,Bt),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&me.setValue(P,"center",N.center),me.setValue(P,"modelViewMatrix",N.modelViewMatrix),me.setValue(P,"normalMatrix",N.normalMatrix),me.setValue(P,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Ne=k.uniformsGroups;for(let Be=0,wr=Ne.length;Be<wr;Be++){const qn=Ne[Be];Nt.update(qn,Ge),Nt.bind(qn,Ge)}}return Ge}function Hc(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function Gc(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(S,U,z){const k=gt.get(S);k.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),gt.get(S.texture).__webglTexture=U,gt.get(S.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:z,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const z=gt.get(S);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0};const Vc=P.createFramebuffer();this.setRenderTarget=function(S,U=0,z=0){C=S,w=U,T=z;let k=!0,N=null,Q=!1,ot=!1;if(S){const ht=gt.get(S);if(ht.__useDefaultFramebuffer!==void 0)mt.bindFramebuffer(P.FRAMEBUFFER,null),k=!1;else if(ht.__webglFramebuffer===void 0)Bt.setupRenderTarget(S);else if(ht.__hasExternalTextures)Bt.rebindTextures(S,gt.get(S.texture).__webglTexture,gt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Et=S.depthTexture;if(ht.__boundDepthTexture!==Et){if(Et!==null&&gt.has(Et)&&(S.width!==Et.image.width||S.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Bt.setupDepthRenderbuffer(S)}}const Rt=S.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(ot=!0);const Lt=gt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Lt[U])?N=Lt[U][z]:N=Lt[U],Q=!0):S.samples>0&&Bt.useMultisampledRTT(S)===!1?N=gt.get(S).__webglMultisampledFramebuffer:Array.isArray(Lt)?N=Lt[z]:N=Lt,L.copy(S.viewport),F.copy(S.scissor),B=S.scissorTest}else L.copy(bt).multiplyScalar(H).floor(),F.copy(Gt).multiplyScalar(H).floor(),B=ae;if(z!==0&&(N=Vc),mt.bindFramebuffer(P.FRAMEBUFFER,N)&&k&&mt.drawBuffers(S,N),mt.viewport(L),mt.scissor(F),mt.setScissorTest(B),Q){const ht=gt.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,ht.__webglTexture,z)}else if(ot){const ht=U;for(let Rt=0;Rt<S.textures.length;Rt++){const Lt=gt.get(S.textures[Rt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Rt,Lt.__webglTexture,z,ht)}}else if(S!==null&&z!==0){const ht=gt.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ht.__webglTexture,z)}M=-1},this.readRenderTargetPixels=function(S,U,z,k,N,Q,ot,ft=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ht=gt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ot!==void 0&&(ht=ht[ot]),ht){mt.bindFramebuffer(P.FRAMEBUFFER,ht);try{const Rt=S.textures[ft],Lt=Rt.format,Et=Rt.type;if(!Pt.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(Et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-k&&z>=0&&z<=S.height-N&&(S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ft),P.readPixels(U,z,k,N,xt.convert(Lt),xt.convert(Et),Q))}finally{const Rt=C!==null?gt.get(C).__webglFramebuffer:null;mt.bindFramebuffer(P.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(S,U,z,k,N,Q,ot,ft=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ht=gt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ot!==void 0&&(ht=ht[ot]),ht)if(U>=0&&U<=S.width-k&&z>=0&&z<=S.height-N){mt.bindFramebuffer(P.FRAMEBUFFER,ht);const Rt=S.textures[ft],Lt=Rt.format,Et=Rt.type;if(!Pt.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(Et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Wt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Wt),P.bufferData(P.PIXEL_PACK_BUFFER,Q.byteLength,P.STREAM_READ),S.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ft),P.readPixels(U,z,k,N,xt.convert(Lt),xt.convert(Et),0);const ee=C!==null?gt.get(C).__webglFramebuffer:null;mt.bindFramebuffer(P.FRAMEBUFFER,ee);const ge=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Zh(P,ge,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Wt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Q),P.deleteBuffer(Wt),P.deleteSync(ge),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,z=0){const k=Math.pow(2,-z),N=Math.floor(S.image.width*k),Q=Math.floor(S.image.height*k),ot=U!==null?U.x:0,ft=U!==null?U.y:0;Bt.setTexture2D(S,0),P.copyTexSubImage2D(P.TEXTURE_2D,z,0,0,ot,ft,N,Q),mt.unbindTexture()};const Wc=P.createFramebuffer(),Xc=P.createFramebuffer();this.copyTextureToTexture=function(S,U,z=null,k=null,N=0,Q=null){Q===null&&(N!==0?(xs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=N,N=0):Q=0);let ot,ft,ht,Rt,Lt,Et,Wt,ee,ge;const ce=S.isCompressedTexture?S.mipmaps[Q]:S.image;if(z!==null)ot=z.max.x-z.min.x,ft=z.max.y-z.min.y,ht=z.isBox3?z.max.z-z.min.z:1,Rt=z.min.x,Lt=z.min.y,Et=z.isBox3?z.min.z:0;else{const Je=Math.pow(2,-N);ot=Math.floor(ce.width*Je),ft=Math.floor(ce.height*Je),S.isDataArrayTexture?ht=ce.depth:S.isData3DTexture?ht=Math.floor(ce.depth*Je):ht=1,Rt=0,Lt=0,Et=0}k!==null?(Wt=k.x,ee=k.y,ge=k.z):(Wt=0,ee=0,ge=0);const re=xt.convert(U.format),Tt=xt.convert(U.type);let pe;U.isData3DTexture?(Bt.setTexture3D(U,0),pe=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Bt.setTexture2DArray(U,0),pe=P.TEXTURE_2D_ARRAY):(Bt.setTexture2D(U,0),pe=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const jt=P.getParameter(P.UNPACK_ROW_LENGTH),Ge=P.getParameter(P.UNPACK_IMAGE_HEIGHT),pi=P.getParameter(P.UNPACK_SKIP_PIXELS),Ve=P.getParameter(P.UNPACK_SKIP_ROWS),Ji=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ce.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ce.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Rt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Lt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Et);const me=S.isDataArrayTexture||S.isData3DTexture,Ze=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const Je=gt.get(S),Ne=gt.get(U),Be=gt.get(Je.__renderTarget),wr=gt.get(Ne.__renderTarget);mt.bindFramebuffer(P.READ_FRAMEBUFFER,Be.__webglFramebuffer),mt.bindFramebuffer(P.DRAW_FRAMEBUFFER,wr.__webglFramebuffer);for(let qn=0;qn<ht;qn++)me&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,gt.get(S).__webglTexture,N,Et+qn),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,gt.get(U).__webglTexture,Q,ge+qn)),P.blitFramebuffer(Rt,Lt,ot,ft,Wt,ee,ot,ft,P.DEPTH_BUFFER_BIT,P.NEAREST);mt.bindFramebuffer(P.READ_FRAMEBUFFER,null),mt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(N!==0||S.isRenderTargetTexture||gt.has(S)){const Je=gt.get(S),Ne=gt.get(U);mt.bindFramebuffer(P.READ_FRAMEBUFFER,Wc),mt.bindFramebuffer(P.DRAW_FRAMEBUFFER,Xc);for(let Be=0;Be<ht;Be++)me?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Je.__webglTexture,N,Et+Be):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Je.__webglTexture,N),Ze?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ne.__webglTexture,Q,ge+Be):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ne.__webglTexture,Q),N!==0?P.blitFramebuffer(Rt,Lt,ot,ft,Wt,ee,ot,ft,P.COLOR_BUFFER_BIT,P.NEAREST):Ze?P.copyTexSubImage3D(pe,Q,Wt,ee,ge+Be,Rt,Lt,ot,ft):P.copyTexSubImage2D(pe,Q,Wt,ee,Rt,Lt,ot,ft);mt.bindFramebuffer(P.READ_FRAMEBUFFER,null),mt.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Ze?S.isDataTexture||S.isData3DTexture?P.texSubImage3D(pe,Q,Wt,ee,ge,ot,ft,ht,re,Tt,ce.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(pe,Q,Wt,ee,ge,ot,ft,ht,re,ce.data):P.texSubImage3D(pe,Q,Wt,ee,ge,ot,ft,ht,re,Tt,ce):S.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Q,Wt,ee,ot,ft,re,Tt,ce.data):S.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Q,Wt,ee,ce.width,ce.height,re,ce.data):P.texSubImage2D(P.TEXTURE_2D,Q,Wt,ee,ot,ft,re,Tt,ce);P.pixelStorei(P.UNPACK_ROW_LENGTH,jt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ge),P.pixelStorei(P.UNPACK_SKIP_PIXELS,pi),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ve),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ji),Q===0&&U.generateMipmaps&&P.generateMipmap(pe),mt.unbindTexture()},this.initRenderTarget=function(S){gt.get(S).__webglFramebuffer===void 0&&Bt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Bt.setTextureCube(S,0):S.isData3DTexture?Bt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Bt.setTexture2DArray(S,0):Bt.setTexture2D(S,0),mt.unbindTexture()},this.resetState=function(){w=0,T=0,C=null,mt.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}class gg{camera=new vr(-8,8,5,-5,.1,80);element;target=new D(0,.12,0);desiredTarget=new D(0,.12,0);offset=new D;spherical=new Du;right=new D;forward=new D;up=new D(0,1,0);distance=20;yaw=Math.PI/4;desiredYaw=Math.PI/4;pitch=.86;desiredPitch=.86;desiredZoom=1;halfHeight=3.5;desiredHalfHeight=3.5;viewportWidth=1280;shiftFraction=0;islandRadius=2.8;islandCenter=new D(0,.3,0);frameIsland(t,e=!1){if(!t.length)return;const n=t.map(r=>r.x),s=t.map(r=>r.z);this.islandCenter.set((Math.min(...n)+Math.max(...n))/2,.3,(Math.min(...s)+Math.max(...s))/2),this.islandRadius=Math.max(...t.map(r=>Math.hypot(r.x-this.islandCenter.x,r.z-this.islandCenter.z)))+2.65,this.distance=Math.max(20,this.islandRadius*3),this.camera.far=this.distance+this.islandRadius*3+40,this.desiredTarget.copy(this.islandCenter),this.resize(this.viewportWidth,this.viewportHeight),e&&(this.target.copy(this.desiredTarget),this.halfHeight=this.desiredHalfHeight,this.applyProjection(),this.applyTransform())}applyProjection(){const t=this.viewportWidth/this.viewportHeight,e=this.shiftFraction*this.halfHeight;Object.assign(this.camera,{left:-this.halfHeight*t,right:this.halfHeight*t,top:this.halfHeight+e,bottom:-this.halfHeight+e}),this.camera.updateProjectionMatrix()}viewportHeight=900;placement=!1;pointer=null;disposed=!1;cleanup=new AbortController;constructor(t){this.element=t,this.camera.zoom=1;const e=this.cleanup.signal;t.addEventListener("pointerdown",this.onPointerDown,{signal:e}),t.addEventListener("pointermove",this.onPointerMove,{signal:e}),t.addEventListener("pointerup",this.onPointerUp,{signal:e}),t.addEventListener("pointercancel",this.onPointerUp,{signal:e}),t.addEventListener("lostpointercapture",this.onPointerUp,{signal:e}),t.addEventListener("wheel",this.onWheel,{passive:!1,signal:e}),t.addEventListener("contextmenu",this.onContextMenu,{signal:e}),window.addEventListener("keydown",this.onKeyDown,{signal:e}),window.addEventListener("blur",this.onBlur,{signal:e}),this.resize(t.clientWidth||1280,t.clientHeight||900),this.applyTransform()}resize(t,e){const n=Math.max(1,t),s=Math.max(1,e),r=n/s,a=n<700?100:85,o=n<700?205:s<760?190:225,l=Math.max(s*.43,s-a-o);this.viewportWidth=n,this.viewportHeight=s,this.desiredHalfHeight=Math.max(this.islandRadius/(r*.9),(this.islandRadius*.68+.61)*s/l),this.shiftFraction=(a-o)/s,this.applyProjection()}update(t){if(this.disposed)return;const e=Math.min(Math.max(t,0),.1),n=1-Math.exp(-11*e),s=1-Math.exp(-12*e);!this.placement&&Math.abs(this.halfHeight-this.desiredHalfHeight)>1e-4&&(this.halfHeight=Zt.lerp(this.halfHeight,this.desiredHalfHeight,n),this.applyProjection()),this.yaw=Zt.lerp(this.yaw,this.desiredYaw,n),this.pitch=Zt.lerp(this.pitch,this.desiredPitch,n),this.target.lerp(this.desiredTarget,n);const r=Zt.lerp(this.camera.zoom,this.desiredZoom,s);Math.abs(r-this.camera.zoom)>1e-6&&(this.camera.zoom=r,this.camera.updateProjectionMatrix()),this.applyTransform()}setPlacement(t){this.placement=t,t&&(this.releasePointer(),this.desiredYaw=this.yaw,this.desiredPitch=this.pitch,this.desiredTarget.copy(this.target),this.desiredZoom=this.camera.zoom)}reset(){this.releasePointer(),this.desiredTarget.copy(this.islandCenter),this.desiredYaw=Math.PI/4,this.desiredPitch=.86,this.desiredZoom=1}dispose(){this.disposed=!0,this.releasePointer(),this.cleanup.abort()}applyTransform(){this.spherical.set(this.distance,this.pitch,this.yaw),this.offset.setFromSpherical(this.spherical),this.camera.position.copy(this.target).add(this.offset),this.camera.lookAt(this.target),this.camera.updateMatrixWorld()}onPointerDown=t=>{this.placement||t.pointerType==="touch"||t.button!==1&&t.button!==2||t.target instanceof HTMLElement&&t.target.closest("button, input, dialog, [data-card]")||(t.preventDefault(),this.pointer={id:t.pointerId,x:t.clientX,y:t.clientY,pan:t.button===1||t.shiftKey},this.element.setPointerCapture(t.pointerId),this.element.style.cursor="grabbing")};onPointerMove=t=>{if(!this.pointer||t.pointerId!==this.pointer.id)return;const e=t.clientX-this.pointer.x,n=t.clientY-this.pointer.y;if(this.pointer.x=t.clientX,this.pointer.y=t.clientY,this.pointer.pan){const s=2*this.halfHeight/(this.viewportHeight*this.desiredZoom);this.right.set(Math.cos(this.yaw),0,-Math.sin(this.yaw)),this.forward.crossVectors(this.up,this.right),this.desiredTarget.addScaledVector(this.right,-e*s*.8),this.desiredTarget.addScaledVector(this.forward,n*s*.8);const r=Math.hypot(this.desiredTarget.x-this.islandCenter.x,this.desiredTarget.z-this.islandCenter.z);r>.85&&(this.desiredTarget.x=this.islandCenter.x+(this.desiredTarget.x-this.islandCenter.x)*.85/r,this.desiredTarget.z=this.islandCenter.z+(this.desiredTarget.z-this.islandCenter.z)*.85/r)}else this.desiredYaw-=e*.0035,this.desiredPitch=Zt.clamp(this.desiredPitch-n*.0025,.7,1.02)};onPointerUp=t=>{this.pointer?.id===t.pointerId&&this.releasePointer()};releasePointer(){const t=this.pointer;this.pointer=null,t&&this.element.hasPointerCapture(t.id)&&this.element.releasePointerCapture(t.id),this.element.style.cursor=""}onWheel=t=>{if(t.preventDefault(),this.placement)return;const e=t.deltaY*(t.deltaMode===1?16:t.deltaMode===2?this.viewportHeight:1);this.desiredZoom=Zt.clamp(this.desiredZoom*Math.exp(-e*.001),.7,2.6)};onContextMenu=t=>t.preventDefault();onBlur=()=>this.releasePointer();onKeyDown=t=>{t.key.toLowerCase()!=="h"||t.ctrlKey||t.altKey||t.metaKey||this.placement||document.querySelector("dialog[open]")||t.target instanceof HTMLElement&&(t.target.isContentEditable||t.target.closest("input, textarea, select"))||this.reset()}}const mr=.45,ii=1.5,Zs=1.05,as=1.85;function Tn(i,t,e){const n=Math.max(0,Math.min(1,(i-t)/(e-t)));return n*n*(3-2*n)}const xo=.1,Mo=1.25,Dc=1.4,te=.13,Hn=-.18,_g=new wt("#80ac71"),vg=new wt("#b8c982");function xg(i,t,e){const n=.5+.23*Math.sin(i*.94+t*.47)+.16*Math.cos(t*1.27-i*.52)+.09*Math.sin(i*1.8-t*.98);return e.copy(_g).lerp(vg,Zt.smoothstep(n,.1,.9))}const Gl=cn*Math.cos(Math.PI/6);function sr(i,t){const e=ke(i).map(u=>!t.has(u));function n(u,d,f){const g=(u+5)%6,_=u%6,m=g*Math.PI/3,p=_*Math.PI/3,b=Gl+(e[g]?d:0),E=Gl+(e[_]?d:0),x=Math.sin(p-m);return new D((b*Math.sin(p)-E*Math.sin(m))/x,f,(Math.cos(m)*E-Math.cos(p)*b)/x)}const s=se(i),r=[],a=[],o=(u,d,f,g,_=1)=>{const m=new wt(g).multiplyScalar(_);for(const p of[u,d,f])r.push(p.x,p.y,p.z),(g===10795903||g===9546604)&&(xg(s.x+p.x,s.z+p.z,m),p.y<te&&m.multiplyScalar(.89)),a.push(m.r,m.g,m.b)},l=[[-.095,te],[-.035,.074],[.05,-.016],[.15,-.16],[.28,-.37],[.42,-.58]],c=[9546604,11057024,14469014,15257502,14140311];for(let u=0;u<6;u++){const d=l.map(([f,g])=>{const _=n(u,f,g),m=n(u+1,f,g);return Array.from({length:5},(p,b)=>{const E=b/4,x=_.clone().lerp(m,E);if(e[u]&&b>0&&b<4){const A=.025*Math.sin(i*.61+u*2.8+E*Math.PI*2)*Math.sin(E*Math.PI);x.x+=Math.cos(u*Math.PI/3)*A,x.z+=Math.sin(u*Math.PI/3)*A}return x})});for(let f=0;f<4;f++)if(o(new D(0,te,0),d[0][f+1],d[0][f],10795903,1+.009*Math.sin(u+f+i)),!!e[u])for(let g=0;g<l.length-1;g++){const[_,m,p,b]=[d[g][f],d[g][f+1],d[g+1][f],d[g+1][f+1]],E=1+.035*Math.sin(i+u*1.7+f);o(_,m,p,c[g],E),o(p,m,b,c[g],E+.01)}}const h=new ve;return h.setAttribute("position",new $t(r,3)),h.setAttribute("color",new $t(a,3)),h.computeVertexNormals(),h}function Mg(i){const t=new Vt,e=se(i);t.position.set(e.x,te,e.z);const n=[],s=[];function r(o,l){n.push(...o);const c=new wt(l);for(let h=0;h<3;h++)s.push(c.r,c.g,c.b)}for(let o=0;o<21;o++){const l=o*2.399+i*.44,c=.59+.18*(.5+.5*Math.sin(o*12+i)),h=Math.cos(l)*c,u=Math.sin(l)*c,d=m=>{const p=Math.sin(i*17.31+o*71.13+m*29.7)*43758.5453;return p-Math.floor(p)},f=3+Math.floor(d(0)*4),g=d(1)*Math.PI*2,_=[7575134,8824939,10205563,11651210,8365420];for(let m=0;m<f;m++){const p=g+(d(m+2)-.5)*2.4,b=Math.cos(p),E=Math.sin(p),x=h+(d(m+20)-.5)*.06,A=u+(d(m+40)-.5)*.06,w=.035+d(m+60)*.07,T=.009+d(m+80)*.008,C=.012+d(m+100)*.035,M=x+b*C*.3,y=A+E*C*.3,L=x+b*C,F=A+E*C,B=_[Math.floor(d(m+120)*_.length)];r([x-E*T,.004,A+b*T,x+E*T,.004,A-b*T,M+E*T*.55,w*.55,y-b*T*.55],B),r([x-E*T,.004,A+b*T,M+E*T*.55,w*.55,y-b*T*.55,M-E*T*.55,w*.55,y+b*T*.55],B),r([M-E*T*.55,w*.55,y+b*T*.55,M+E*T*.55,w*.55,y-b*T*.55,L,w,F],B)}if(o%4===0&&r([h-.025,.054,u+.012,h+.027,.053,u,h,.083,u-.014],o%2?16045456:15854533),o%5===0){const m=zi(o%6,.05);r([h-.045,.005,u,h+m.x,.029,u+m.z,h+.065,.006,u+.034],13156769)}}const a=new ve;return a.setAttribute("position",new $t(n,3)),a.setAttribute("color",new $t(s,3)),a.computeVertexNormals(),t.add(new qt(a,new _o({vertexColors:!0,side:Le}))),t}const On=7,Vl=3.8,Pe=256,rr=(i,t,e)=>{const n=Math.max(0,Math.min(1,(e-i)/(t-i)));return n*n*(3-2*n)};class Wl{pixels=new Uint8Array(Pe*Pe*4);texture=new uo(this.pixels,Pe,Pe,$e);region=new he;constructor(){this.texture.minFilter=this.texture.magFilter=en,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}rebuild(t,e,n){const s=e.flatMap(g=>[g.ax,g.bx]),r=e.flatMap(g=>[g.az,g.bz]),a=n?.x??Math.min(...s)-On,o=n?.y??Math.min(...r)-On;n?this.region.copy(n):this.region.set(a,o,Math.max(...s)-a+On,Math.max(...r)-o+On);const l=e.map(g=>{const _=g.bx-g.ax,m=g.bz-g.az;return{...g,dx:_,dz:m,inv:1/(_*_+m*m)}}),c=this.region.z/Pe,h=this.region.w/Pe,u=16,d=Math.hypot(c,h)*u*.5;function f(g,_,m){const p=_-g.ax,b=m-g.az,E=Math.max(0,Math.min(1,(p*g.dx+b*g.dz)*g.inv)),x=p-E*g.dx,A=b-E*g.dz;return x*x+A*A}for(let g=0;g<Pe;g+=u)for(let _=0;_<Pe;_+=u){const m=a+(_+u/2)*c,p=o+(g+u/2)*h,b=l.map(A=>f(A,m,p)),E=Math.min(On+d,Math.sqrt(Math.min(...b))+2*d),x=l.filter((A,w)=>b[w]<=E*E);for(let A=g;A<g+u;A++)for(let w=_;w<_+u;w++){const T=a+(w+.5)*c,C=o+(A+.5)*h;let M=On*On;for(const Y of x)M=Math.min(M,f(Y,T,C));const y=Math.sqrt(M)*(t.has(qe(T,C))?-1:1),L=.5+.25*Math.sin(T*.79+C*.36)+.18*Math.cos(C*.94-T*.51)+.07*Math.sin(T*1.41-C*.88),F=rr(.18,2.2+2.3*L,y),B=.31+.23*rr(.24,1.65,y)+F*(1.15+.43*(1-L))+1.55*rr(2.9,6.9,y),W=Math.round(65535*Math.max(0,Math.min(1,(y+1)/(On+1)))),V=(A*Pe+w)*4;this.pixels[V]=W>>8,this.pixels[V+1]=W&255,this.pixels[V+2]=Math.round(255*Math.min(B/Vl,1)),this.pixels[V+3]=255}}this.texture.needsUpdate=!0}depthAt(t,e){const n=Math.max(0,Math.min(Pe-1,(t-this.region.x)/this.region.z*Pe-.5)),s=Math.max(0,Math.min(Pe-1,(e-this.region.y)/this.region.w*Pe-.5)),r=Math.floor(n),a=Math.floor(s),o=Math.min(r+1,Pe-1),l=Math.min(a+1,Pe-1),c=(h,u)=>this.pixels[(u*Pe+h)*4+2]*Vl/255;return Zt.lerp(Zt.lerp(c(r,a),c(o,a),n-r),Zt.lerp(c(r,l),c(o,l),n-r),s-a)}}function yg(){const e=new Uint8Array(589824);let n=70816;const s=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),r=Array.from({length:64},()=>[.15+.7*s(),.15+.7*s()]),a=2*Math.PI;for(let l=0;l<384;l++)for(let c=0;c<384;c++){const h=(c+.5)/384,u=(l+.5)/384,d=h*8,f=u*8,g=Math.floor(d),_=Math.floor(f);let m=10,p=10,b=10;for(let x=-1;x<=1;x++)for(let A=-1;A<=1;A++){const w=r[(_+x+8)%8*8+(g+A+8)%8],T=g+A+w[0]-d,C=_+x+w[1]-f,M=T*T+C*C;M<m?(b=p,p=m,m=M):M<p?(b=p,p=M):M<b&&(b=M)}const E=(l*384+c)*4;e[E]=255*Math.min(1,Math.sqrt(p)-Math.sqrt(m)),e[E+1]=255*(1-rr(.015,.35,Math.sqrt(b)-Math.sqrt(m))),e[E+2]=255*(.5+.21*Math.sin(a*(2*h+u)+.9*Math.sin(a*u))+.16*Math.cos(a*(h-2*u))+.09*Math.sin(a*(3*u-h)+.7)),e[E+3]=255*(.5+.22*Math.cos(a*(u-h)+.7*Math.cos(a*h))+.14*Math.sin(a*(h+2*u)+1.3)+.09*Math.cos(a*(3*h+u)))}const o=new uo(e,384,384,$e);return o.wrapS=o.wrapT=cr,o.minFilter=kn,o.magFilter=en,o.generateMipmaps=!0,o.needsUpdate=!0,o}const Ic=`
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
`,Uc=`
vec3 seaWave(vec2 p) {
  vec2 a=vec2(.88,1.31), b=vec2(1.93,-.62), c=vec2(-2.7,3.8), d=vec2(5.2,2.1);
  float pa=dot(p,a)-uTime*1.05, pb=dot(p,b)+uTime*.81;
  float pc=dot(p,c)-uTime*1.47, pd=dot(p,d)+uTime*1.92;
  float height=.027*sin(pa)+.016*sin(pb)+.007*sin(pc)+.003*sin(pd);
  vec2 gradient=.027*cos(pa)*a+.016*cos(pb)*b+.007*cos(pc)*c+.003*cos(pd)*d;
  return vec3(height,gradient);
}
`,Sg=`
uniform float uTime;
`+Uc+`
varying vec3 vWorld;
void main() {
  vWorld=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=vWorld.xz;
  vWorld.y+=seaWave(p).x;
  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`,bg=Ic+Uc+`
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
}`,Eg=`
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
`,dn=100,Xl=Zt.lerp;class wg{root=new Vt;field=new Wl;previousField=new Wl;previousBoard=new Map;transitionAt=-10;transitionStart=mr;transitionEnd=ii;pendingEdges=null;uniforms={uWakes:{value:Array.from({length:12},()=>new he(0,0,-10,0))},uWakeDirs:{value:Array.from({length:12},()=>new he(1,0,0,0))},uCoastMix:{value:1},uPreviousCoast:{value:this.previousField.texture},uTime:{value:0},uLight:{value:yg()},uCoast:{value:this.field.texture},uRegion:{value:this.field.region},uLanding:{value:new D(0,0,-10)},uMint:{value:new wt("#87efd4")},uTurquoise:{value:new wt("#20d0c6")},uLagoon:{value:new wt("#22b7c7")},uDeep:{value:new wt("#318fc4")}};nextWake=0;sandGeometry=new ci(1,1,dn,dn).rotateX(-Math.PI/2);sandStart=new $t(new Float32Array((dn+1)**2),1);sandStartTint=new $t(new Float32Array((dn+1)**2*3),3);sandTint=new $t(new Float32Array((dn+1)**2*3),3);stones;surface;silhouettes=new Es(1,0);constructor(){const t=new qt(new ci(160,160,180,180),new Cn({uniforms:this.uniforms,vertexShader:Sg,fragmentShader:bg,transparent:!0,depthWrite:!1,toneMapped:!1}));this.surface=t,t.rotation.x=-Math.PI/2,t.position.y=Hn,t.renderOrder=2,this.sandGeometry.setAttribute("color",this.sandTint),this.sandGeometry.setAttribute("aBedStart",this.sandStart),this.sandGeometry.setAttribute("aTintStart",this.sandStartTint);const e=new qt(this.sandGeometry,this.receiver(!0));e.receiveShadow=!0,this.stones=new yc(this.silhouettes,this.receiver(!1),192),this.stones.count=0,this.stones.receiveShadow=!0,this.root.add(e,this.stones,t)}receiver(t){const e=new _o({color:16777215,vertexColors:t,transparent:t,depthWrite:!t});return e.onBeforeCompile=n=>{n.uniforms.uLight=this.uniforms.uLight,n.uniforms.uTime=this.uniforms.uTime,n.uniforms.uWakes=this.uniforms.uWakes,n.uniforms.uWakeDirs=this.uniforms.uWakeDirs,n.uniforms.uLanding=this.uniforms.uLanding,n.vertexShader=`varying vec3 vReceiver;
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
`+Ic+`
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
`+Eg+(t?`
diffuseColor.a *= 1. - smoothstep(.65, 1.65, max(0., -.18-vReceiver.y));`:""))},e.customProgramCacheKey=()=>t?"lagoon-sand-disturbance-v3":"lagoon-rock-disturbance-v3",e}sync(t,e,n,s=-1){this.field.rebuild(t,e),this.surface.position.x=this.field.region.x+this.field.region.z/2,this.surface.position.z=this.field.region.y+this.field.region.w/2,this.surface.scale.setScalar(Math.max(1,this.field.region.z/70,this.field.region.w/70));const r=n>=0?n:s,a=r>=0&&this.previousBoard.size>0;if(this.transitionStart=s>=0?xo:mr,this.transitionEnd=s>=0?Mo:ii,this.previousField.rebuild(a?this.previousBoard:t,a?Js(this.previousBoard):e,this.field.region),this.uniforms.uCoastMix.value=a?0:1,this.transitionAt=a?this.uniforms.uTime.value:-10,this.shapeBed(),a?this.pendingEdges=e:(this.placeStones(e),this.pendingEdges=null),this.previousBoard=new Map(t),r>=0){const o=se(r);this.uniforms.uLanding.value.set(o.x,o.z,this.uniforms.uTime.value)}else this.uniforms.uLanding.value.z=-10}shapeBed(){const t=this.field.region,e=this.sandGeometry.getAttribute("position"),n=new wt("#d4cc9e"),s=new wt("#79b8aa"),r=new wt("#467f87"),a=new wt;for(let o=0;o<=dn;o++)for(let l=0;l<=dn;l++){const c=t.x+t.z*l/dn,h=t.y+t.w*o/dn,u=o*(dn+1)+l,d=this.field.depthAt(c,h),f=this.previousField.depthAt(c,h);this.sandStart.setX(u,Hn-f),a.copy(n).lerp(s,Zt.smoothstep(f,.28,1.1)).lerp(r,Zt.smoothstep(f,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+h*.83)+.02*Math.cos(c*1.88-h*3.2)),this.sandStartTint.setXYZ(u,a.r,a.g,a.b),e.setXYZ(u,c,Hn-d,h),a.copy(n).lerp(s,Zt.smoothstep(d,.28,1.1)).lerp(r,Zt.smoothstep(d,.93,2.6)).multiplyScalar(.98+.027*Math.sin(c*2.73+h*.83)+.02*Math.cos(c*1.88-h*3.2)),this.sandTint.setXYZ(u,a.r,a.g,a.b)}e.needsUpdate=!0,this.sandTint.needsUpdate=!0,this.sandStart.needsUpdate=!0,this.sandStartTint.needsUpdate=!0,this.sandGeometry.computeVertexNormals(),this.sandGeometry.computeBoundingSphere()}placeStones(t){const e=new ye,n=new wt("#99a590"),s=new wt("#467c85"),r=new wt;let a=0;for(const o of t){let l=Math.imul(o.id+1,127)+o.side*317;const c=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296),h=.18+c()*.64,u=.43+c()*.51,d=Math.cos(o.side*Math.PI/3),f=Math.sin(o.side*Math.PI/3),g=.075+c()*.074,_=c()<.33?1:3;for(let m=0;m<_&&a<this.stones.instanceMatrix.count;m++){const p=h+(c()-.5)*.25,b=u+m*.075,E=Xl(o.ax,o.bx,p)+d*b,x=Xl(o.az,o.bz,p)+f*b,A=this.field.depthAt(E,x),w=g/(1+m*.64);e.position.set(E,Hn-A+w*.25,x),e.rotation.set(c()*.32,c()*6.28,c()*.26),e.scale.set(w*(1.25+c()*.45),w*(.6+c()*.18),w),e.updateMatrix(),this.stones.setMatrixAt(a,e.matrix),r.copy(n).lerp(s,Zt.smoothstep(A,.31,1.03)*.84+.09).multiplyScalar(.88+c()*.2),this.stones.setColorAt(a++,r)}}this.stones.count=a,this.stones.instanceMatrix.needsUpdate=!0,this.stones.instanceColor&&(this.stones.instanceColor.needsUpdate=!0),this.stones.computeBoundingSphere()}stir(t,e,n,s,r,a){const o=this.nextWake;this.nextWake=(o+1)%12,this.uniforms.uWakes.value[o].set(t,e,this.uniforms.uTime.value,.15+.85*r),this.uniforms.uWakeDirs.value[o].set(n,s,Math.min(a,1.2),(this.uniforms.uTime.value*1.37+o*.618)%1)}clearWakes(){for(const t of this.uniforms.uWakes.value)t.set(0,0,-10,0)}update(t){this.uniforms.uTime.value=t,this.uniforms.uCoastMix.value=Tn(t-this.transitionAt,this.transitionStart,this.transitionEnd),this.pendingEdges&&this.uniforms.uCoastMix.value>=1&&(this.placeStones(this.pendingEdges),this.pendingEdges=null)}}function Tg(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new ve;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Yl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let _=0;_<a[h].length;++_)f.push(a[h][_][d]);const g=Yl(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Yl(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Ke(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const _=h.getComponent(d,g);o.setComponent(d+u,g,_)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}const ia=new Map,Oi=new Map;function Ag(i){return ia.has(i)||ia.set(i,new Xi({color:i,roughness:.95,flatShading:!0})),ia.get(i)}function _e(i,t,e,n=0,s=0,r=0){const a=new qt(t,Ag(e));return a.position.set(n,s,r),a.castShadow=!0,a.receiveShadow=!0,i.add(a),a}function Ot(i,t,e,n,s,r,a,o){const l=`b${r},${a},${o}`;return Oi.has(l)||Oi.set(l,new fi(r,a,o)),_e(i,Oi.get(l),t,e,n,s)}function Se(i,t,e,n,s,r){const a=`s${r}`;return Oi.has(a)||Oi.set(a,new Es(r,0)),_e(i,Oi.get(a),t,e,n,s)}function ai(i,t,e,n=0,s=1){let r=new Vt;if(r.position.set(t,0,e),r.scale.setScalar(s),i.add(r),_e(r,new Ue(.045,.07,.7,5),7821114,0,.35,0),n%2===0)for(let a=0;a<3;a++)_e(r,new Pn(.35-a*.065,.55,7),[4683098,5735786,3761744][(n+a)%3],0,.55+a*.23,0);else Se(r,7575146,-.12,.78,0,.33),Se(r,9152110,.15,.85,.04,.31),Se(r,6720865,0,1.07,0,.29)}function yo(i,t){for(let e=-.45;e<=.46;e+=.3)Ot(i,12363130,e,.17,t,.045,.34,.045);for(let e=.13;e<.3;e+=.13)Ot(i,13481612,0,e,t,.95,.035,.035)}function Rg(i,t=!1,e=!1,n=!1){let s=t?.83:.64,r=t?.7:.48,a=.62;Ot(i,10718573,0,.06,0,s+.08,.12,a+.08),Ot(i,n?11898459:15851448,0,r/2+.1,0,s,r,a);for(let f of[-s/2,s/2])Ot(i,8807237,f,r/2+.1,.32,.045,r,.025);Ot(i,8807237,0,.2,.325,.16,.32,.035),Ot(i,13083501,.025,.19,.35,.02,.025,.025);for(let f of[-.22,.22])Ot(i,8873281,f,.42,.322,.16,.17,.035),Ot(i,9549746,f,.42,.345,.115,.12,.02),Ot(i,15063216,f,.42,.36,.018,.13,.015);let o=new ve,l=s/2+.12,c=a/2+.1,h=r+.1,u=h+.38;o.setAttribute("position",new $t([-l,h,-c,l,h,-c,0,u,-c,-l,h,c,0,u,c,l,h,c,-l,h,-c,0,u,-c,0,u,c,-l,h,-c,0,u,c,-l,h,c,l,h,-c,l,h,c,0,u,c,l,h,-c,0,u,c,0,u,-c],3)),o.computeVertexNormals();const d=_e(i,o,e?6125944:n?9860693:12218449);d.material.side=Le,Ot(i,14930868,.2,u-.06,-.12,.13,.4,.13),Ot(i,10259058,.2,u+.15,-.12,.17,.06,.17);for(let f=0;f<3;f++)Ot(i,7886140,-.27+f*.24,.11,.48,.19,.035,.16);if(e)for(let f=0;f<4;f++){let g=_e(i,new Ue(.075,.075,.46,7),10451532,.43,.1+f%2*.13,-.16+Math.floor(f/2)*.18);g.rotation.x=Math.PI/2}if(n)for(let f of[-.38,.38])Ot(i,11834206,f,.16,.43,.2,.3,.2),Ot(i,7559999,f,.17,.535,.22,.03,.02);Se(i,7705943,-.43,.13,.32,.16)}function Cg(i){let t=new Vt;if(i==="forest")ai(t,-.23,-.2,0,.88),ai(t,.23,-.03,1,.79),ai(t,-.08,.27,2,.7);else if(i==="house"||i==="manor"||i==="lumber"||i==="store")Rg(t,i==="manor",i==="lumber",i==="store");else if(i==="berry"||i==="farm"){for(let e of[-.3,0,.3]){Ot(t,8478788,0,.035,e,.9,.065,.18);for(let n=-.34;n<.4;n+=.17)if(i==="berry"){Se(t,6261068,n,.15,e,.12);for(let s=0;s<2;s++)Se(t,12737360,n+(s-.5)*.07,.24,e,.037)}else for(let s=0;s<3;s++){let r=n+(s-1)*.035;Ot(t,11836752,r,.2,e,.014,.35,.014),_e(t,new Pn(.035,.14,4),15124342,r,.4,e)}}yo(t,-.49),i==="farm"&&(Ot(t,10652498,.4,.2,.4,.12,.4,.1),Ot(t,14206358,.4,.35,.4,.34,.12,.1))}else if(i==="garden"){_e(t,new Ue(.28,.32,.12,10),12105120,0,.07,0),_e(t,new Ue(.22,.22,.04,12),8302517,0,.15,0),_e(t,new Ue(.05,.08,.28,8),13157033,0,.25,0),Se(t,13554357,0,.42,0,.09);for(let e=0;e<8;e++){let n=e/8*Math.PI*2;Se(t,6785362,Math.cos(n)*.4,.12,Math.sin(n)*.4,.13),Se(t,e%2?14659206:15259562,Math.cos(n)*.4,.24,Math.sin(n)*.4,.055)}}else if(i==="festival"){for(let e of[-.35,.35])Ot(t,9135944,e,.4,0,.04,.8,.04);Ot(t,14203504,0,.73,0,.75,.035,.035);for(let e=0;e<5;e++)_e(t,new Pn(.08,.18,3),e%2?11034965:14993274,-.28+e*.14,.64,0)}else for(let e=0;e<3;e++)Se(t,13018989,(e-1)*.2,.18,0,.2),Ot(t,8162641,(e-1)*.2,.36,0,.04,.15,.04);return t}const ze=new Map;function Pg(){const i=new Vt;let t=0;for(const e of[-.3,0,.3]){Ot(i,8478788,0,.035,e,.9,.065,.18);for(let n=-.34;n<.4;n+=.17){const s=new Vt;s.position.set(n,.065,e),s.userData.plantOrder=t++,Se(s,6261068,0,.085,0,.12);for(let r=0;r<2;r++)Se(s,12737360,(r-.5)*.07,.175,0,.037);i.add(s)}}return yo(i,-.49),i}function Lg(){const i=new Vt;let t=0;for(const e of[-.3,0,.3]){Ot(i,8478788,0,.025,e,.9,.05,.18);for(let n=-.34;n<.4;n+=.17){const s=new Vt;s.position.set(n,0,e),s.userData.cropOrder=t++;for(let r=0;r<3;r++)Ot(s,11904091,(r-1)*.035,.19,0,.015,.32,.018),_e(s,new Pn(.036,.15,4),15191939,(r-1)*.035,.39,0);i.add(s)}}return yo(i,-.49),i}function Dg(){const i=new Vt;_e(i,new Ue(.28,.32,.12,10),12105120,0,.07,0),_e(i,new Ue(.22,.22,.04,12),8302517,0,.15,0),_e(i,new Ue(.05,.08,.28,8),13157033,0,.25,0),Se(i,13554357,0,.42,0,.09);for(let t=0;t<8;t++){const e=t/8*Math.PI*2,n=new Vt;n.position.set(Math.cos(e)*.4,0,Math.sin(e)*.4),n.userData.flowerOrder=t,Se(n,6785362,0,.12,0,.13),Se(n,t%2?14659206:15259562,0,.24,0,.055),i.add(n)}return i}function Ig(){const i=new Vt;Ot(i,8808269,0,.04,-.22,.62,.08,.59),Ot(i,14009496,0,.29,-.24,.48,.5,.42);const t=_e(i,new Pn(.46,.34,4),6720913,0,.68,-.24);t.rotation.y=Math.PI/4,Ot(i,7888455,0,.22,-.01,.15,.34,.025),Ot(i,9222576,-.15,.39,-.015,.12,.13,.025);for(let e=0;e<12;e++)Ot(i,e%2?11836016:13283716,0,.025,.25+e*.095,.39,.045,.087);for(const e of[-.15,.15])for(const n of[.45,1.15])Ot(i,8547410,e,-.18,n,.045,.43,.045);return _e(i,new Ue(.095,.075,.15,8),8362387,.28,.1,.13),Ot(i,13219727,-.27,.14,.03,.13,.25,.15),i}function ar(i){if(i==="garden")return ze.has(i)||ze.set(i,Dg()),ze.get(i).clone();if(i==="fisher"||i==="farm")return ze.has(i)||ze.set(i,i==="fisher"?Ig():Lg()),ze.get(i).clone();if(i==="forest"){if(!ze.has(i)){const e=new Vt;ai(e,-.23,-.2,0,.88),ai(e,.23,-.03,1,.79),ai(e,-.08,.27,2,.7),e.children.forEach((n,s)=>n.userData.treeIndex=s),ze.set(i,e)}return ze.get(i).clone()}if(i==="berry")return ze.has(i)||ze.set(i,Pg()),ze.get(i).clone();let t=ze.get(i);if(!t){const e=Cg(i);e.updateMatrixWorld(!0);const n=new Map;e.traverse(s=>{if(!(s instanceof qt))return;const r=s.material,a=s.geometry.clone().applyMatrix4(s.matrixWorld);n.has(r)||n.set(r,[]),n.get(r).push(a)}),t=new Vt;for(const[s,r]of n){const a=Tg(r,!1);if(r.forEach(l=>l.dispose()),!a)continue;const o=new qt(a,s);o.castShadow=!0,o.receiveShadow=!0,t.add(o)}ze.set(i,t)}return t.clone()}class Ug{root=new Vt;land=new Map;water=new wg;landMat=new Xi({vertexColors:!0,roughness:1,flatShading:!0,side:Le});last=0;sinking=new Map;pendingBoard=null;constructor(t){t.add(this.root),t.background=new wt(9682891),this.root.add(this.water.root)}sync(t,e){for(const s of this.land.keys())t.has(s)||this.removeLand(s);this.pendingBoard=e>=0?new Map(t):null;const n=Js(t);this.water.sync(t,n,e);for(const s of t.keys()){const r=n.filter(u=>u.id===s).map(u=>u.side).join(","),a=this.land.get(s);if(a){e<0&&a.signature!==r&&(a.surface.geometry.dispose(),a.surface.geometry=sr(s,t),a.signature=r);continue}const o=se(s),l=new Vt;l.position.set(o.x,s===e?-1.1:0,o.z),s===e&&l.scale.set(.35,1,.35);const c=new qt(sr(s,t),this.landMat);c.castShadow=!0,c.receiveShadow=!0;const h=Mg(s);if(h.position.set(0,te,0),l.add(c,h),s===ie){const u=new Vt;u.position.set(.44,te,-.37),ai(u,0,0,1,.47),l.add(u)}l.visible=s!==e,this.root.add(l),this.land.set(s,{root:l,surface:c,signature:r,age:s===e?0:ii})}}demolish(t,e){this.pendingBoard=new Map(t),this.sinking.set(e,0),this.water.sync(t,Js(t),-1,e)}removeLand(t){const e=this.land.get(t);e&&(this.root.remove(e.root),e.surface.geometry.dispose(),e.root.traverse(n=>{n instanceof qt&&n!==e.surface&&n.material.vertexColors&&(n.geometry.dispose(),n.material.dispose())}),this.land.delete(t))}stir(t,e,n,s,r,a){this.water.stir(t,e,n,s,r,a)}update(t){const e=Math.max(0,t-this.last);this.last=t,this.water.update(t);for(const n of this.land.values())if(n.age<ii){n.age=Math.min(ii,n.age+e);const s=Tn(n.age,mr,ii);n.root.visible=n.age>=mr,n.root.position.y=-1.1*(1-s),n.root.scale.set(.35+.65*s,1,.35+.65*s)}for(const[n,s]of this.sinking){const r=s+e;this.sinking.set(n,r);const a=this.land.get(n),o=Tn(r,xo,Mo);a&&(a.root.position.y=-1.6*o,a.root.scale.set(1-.7*o,1-.18*o,1-.7*o),a.root.rotation.z=Math.sin(r*25)*Math.sin(o*Math.PI)*.025),r>=Dc&&(this.removeLand(n),this.sinking.delete(n))}if(this.pendingBoard&&this.sinking.size===0&&[...this.land.values()].every(n=>n.age>=ii)){const n=this.pendingBoard,s=Js(n);for(const[r,a]of this.land){const o=s.filter(l=>l.id===r).map(l=>l.side).join(",");a.signature!==o&&(a.surface.geometry.dispose(),a.surface.geometry=sr(r,n),a.signature=o)}this.pendingBoard=null}}reset(){this.pendingBoard=null,this.sinking.clear(),this.water.clearWakes();for(const t of this.land.keys())this.removeLand(t)}}function si(i,t=te){const{x:e,z:n}=se(i);return new D(e,t,n)}function Ng(i){return new ve().setFromPoints(Array.from({length:6},(t,e)=>{const n=zi(e,i);return new D(n.x,0,n.z)}))}class Fg{root=new Vt;markers=new Vt;ray=new Tc;plane=new wn(new D(0,1,0),-te);hit=new D;occupied=new Set;rim=Ng(cn*.94);rimMat=new Ms({color:16578264,transparent:!0,opacity:.9,depthWrite:!1});fillGeo=new Fi(cn*.94,6,Math.PI/2).rotateX(-Math.PI/2);fillMat=new pn({color:12708029,transparent:!0,opacity:.16,depthWrite:!1});hoverMat=new pn({color:12117915,transparent:!0,opacity:.48,depthWrite:!1});hover=new qt(this.fillGeo,this.hoverMat);constructor(t){this.root.add(this.markers,this.hover),this.hover.visible=!1,t.add(this.root)}rebuild(t){this.occupied=new Set(t.keys()),this.markers.clear();for(const e of qc(t)){const n=new Vt;n.position.copy(si(e,Hn+.055)),n.userData.id=e;const s=new qt(this.fillGeo,this.fillMat),r=new Ya(this.rim,this.rimMat);s.renderOrder=4,r.renderOrder=5,n.add(s,r),this.markers.add(n)}}pick(t,e,n,s){const r=s.getBoundingClientRect();if(this.ray.setFromCamera(new kt((t-r.left)/r.width*2-1,1-(e-r.top)/r.height*2),n),this.plane.constant=-te,!this.ray.ray.intersectPlane(this.plane,this.hit))return-1;const a=qe(this.hit.x,this.hit.z);return this.occupied.has(a)?a:(this.plane.constant=.125,this.ray.ray.intersectPlane(this.plane,this.hit)?qe(this.hit.x,this.hit.z):-1)}showAvailable(t,e){this.markers.visible=t,this.markers.children.forEach(n=>n.visible=e(n.userData.id))}setHover(t,e,n){this.hover.visible=n&&t>=0,this.hover.visible&&(this.hover.position.copy(si(t,this.occupied.has(t)?te+.012:Hn+.067)),this.hover.renderOrder=6,this.hoverMat.color.setHex(e?11790741:14653320))}}class Og{constructor(t,e,n){this.game=t,this.ready=e,this.yaw=n}game;ready;yaw;cache=new Map;step=.1;invalidate(){this.cache.clear()}free(t,e){const n=qe(t,e),s=this.game.board.get(n);if(!s||!this.ready(n))return!1;const r=se(n),a=t-r.x,o=e-r.z;for(let g=0;g<6;g++)if(!this.game.board.has(ke(n)[g])&&a*Math.cos(g*Math.PI/3)+o*Math.sin(g*Math.PI/3)>.745)return!1;const l=this.yaw(n),c=Math.cos(l),h=Math.sin(l),u=a*c-o*h,d=a*h+o*c,f=(g,_,m,p,b=sa)=>u>g*b-.075&&u<_*b+.075&&d>m*b-.075&&d<p*b+.075;if(s==="house"||s==="manor"||s==="store"||s==="lumber"){const g=s==="manor"?.54:.43;if(f(-g,g,-.39,.58)||s==="store"&&(f(-.51,-.25,.26,.59)||f(.25,.51,.26,.59))||n===ie&&f(-.6,-.1,-.48,.04))return!1}else if(s==="fisher"){if(f(-.34,.34,-.57,.16))return!1}else if(s==="berry"||s==="farm"){if(f(-.5,.5,-.57,.4,.75))return!1}else if(s==="garden"){if(Math.hypot(u,d)<.44)return!1}else if(s==="forest"){for(const[g,_]of[[-.23,-.2],[.23,-.03],[-.08,.27]])if(Math.hypot(u-g,d-_)<.14)return!1}return!0}segment(t,e){const n=Math.max(1,Math.ceil(Math.hypot(e.x-t.x,e.z-t.z)/.055));for(let s=1;s<=n;s++)if(!this.free(t.x+(e.x-t.x)*s/n,t.z+(e.z-t.z)*s/n))return!1;return!0}nearest(t,e,n=(r,a)=>!0,s=.8){let r=null,a=1/0;for(let o=-s;o<=s;o+=this.step)for(let l=-s;l<=s;l+=this.step){const c=Math.round((t+l)/this.step)*this.step,h=Math.round((e+o)/this.step)*this.step,u=(c-t)**2+(h-e)**2;u<a&&this.free(c,h)&&n(c,h)&&(a=u,r={x:c,z:h,tile:qe(c,h)})}return r}path(t,e,n=()=>0,s=.8){const r=this.nearest(t.x,t.z,(x,A)=>this.segment(t,{x,z:A})),a=this.nearest(e.x,e.z,()=>!0,s);if(!r||!a)return null;const o=(x,A)=>`${x},${A}`,l=Math.round(r.x/this.step),c=Math.round(r.z/this.step),h=Math.round(a.x/this.step),u=Math.round(a.z/this.step),d=o(h,u),f=[],g=x=>{f.push(x);for(let A=f.length-1;A>0;){const w=A-1>>1;if(f[w].score<=x.score)break;f[A]=f[w],f[w]=x,A=w}},_=()=>{const x=f[0],A=f.pop();if(f.length){f[0]=A;let w=0;for(;;){let T=w*2+1;if(T>=f.length||(T+1<f.length&&f[T+1].score<f[T].score&&T++,f[w].score<=f[T].score))break;[f[w],f[T]]=[f[T],f[w]],w=T}}return x},m=o(l,c),p=new Map([[m,0]]),b=new Map,E=new Map([[m,{x:l,z:c}]]);g({x:l,z:c,key:m,cost:0,score:Math.hypot(h-l,u-c)});for(let x=0;f.length&&x<14e3;x++){const A=_();if(A.cost===p.get(A.key)){if(A.key===d){const w=[];for(let M=d;;M=b.get(M)){const y=E.get(M);if(w.push({x:y.x*this.step,z:y.z*this.step,tile:qe(y.x*this.step,y.z*this.step)}),M===m)break}w.reverse();const T=[];let C=0;for(;C<w.length;){let M=Math.min(w.length-1,C+12);for(;M>C&&!this.segment(C?w[C-1]:r,w[M]);)M--;T.push(w[M]),C=M+1}return this.free(e.x,e.z)&&this.segment(T[T.length-1]??r,e)&&T.push({...e,tile:qe(e.x,e.z)}),T}for(const[w,T]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]){const C=A.x+w,M=A.z+T,y=o(C,M),L=C*this.step,F=M*this.step;let B=this.cache.get(y);if(B===void 0&&(B=this.free(L,F),this.cache.set(y,B)),!B||!this.segment({x:A.x*this.step,z:A.z*this.step},{x:L,z:F}))continue;const W=A.cost+Math.hypot(w,T)+n(L,F);W>=(p.get(y)??1/0)||(p.set(y,W),b.set(y,A.key),E.set(y,{x:C,z:M}),g({x:C,z:M,key:y,cost:W,score:W+Math.hypot(h-C,u-M)}))}}}return null}}class Bg{constructor(t,e,n){this.hooks=e,this.overlay=n,t.add(this.root)}hooks;overlay;root=new Vt;game=null;nav=null;citizens=[];time=0;spawned=new Set;spawnClock=0;buckets=new Map;assignedTo(t){return this.citizens.filter(e=>e.job?.source===t).length}assignedCounts(){return Object.fromEntries(fs.map(t=>[t,this.citizens.filter(e=>e.job?.category===t).length]))}get working(){return this.citizens.filter(t=>t.job!==null).length}refreshNavigation(){this.nav?.invalidate()}rebalance(){if(!this.game)return;const t=this.game.workTargets(),e=this.assignedCounts();for(const n of[...this.citizens].reverse())n.job?.category&&n.stage!=="to-store"&&e[n.job.category]>t[n.job.category]&&(e[n.job.category]--,this.releaseJob(n))}releaseJob(t){t.job&&this.hooks.harvestProgress(t.job.source,t.id,0),t.job=null,t.stage="idle",t.path=[],t.retry=.1,t.bundle.visible=!1,t.line.visible=!1,t.bobber.visible=!1,t.fish.visible=!1,t.axe.visible=!1,t.rod.visible=!1,t.waitReason="",t.target=null}reset(t){for(const e of this.citizens)e.status.remove(),e.bundle.geometry.dispose(),e.bundle.material.dispose(),e.line.geometry.dispose(),e.line.material.dispose(),e.bobber.geometry.dispose(),e.bobber.material.dispose();this.root.clear(),this.citizens=[],this.spawned.clear(),this.game=t,this.time=0,this.spawnClock=0,this.nav=new Og(t,e=>this.hooks.ready(e),e=>this.hooks.yaw(e))}neighbors(t,e){const n=[],s=Math.floor(t/.32),r=Math.floor(e/.32);for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++)n.push(...this.buckets.get(`${s+a}:${r+o}`)??[]);return n}clear(t,e,n){return this.neighbors(e,n).every(s=>s===t||Math.hypot(s.root.position.x-e,s.root.position.z-n)>.21)}route(t,e,n,s=!1){const r=se(e),a=this.hooks.yaw(e),o=n??new D(r.x+Math.sin(a)*.65,te,r.z+Math.cos(a)*.65),l=this.nav.path(t.root.position,o,(c,h)=>this.neighbors(c,h).reduce((u,d)=>u+(d!==t&&Math.hypot(d.root.position.x-c,d.root.position.z-h)<.32?4:0),0)+t.avoid.reduce((u,d)=>u+(Math.hypot(d.x-c,d.z-h)<.26?8:0),0),s?.18:.65);return l?.length?(t.nodeMarker="",t.stuck=0,t.bestDistance=1/0,t.path=l,t.target=new D(l[l.length-1].x,te,l[l.length-1].z),this.hooks.trail(l),!0):!1}spawn(t,e){const n=se(e),s=this.hooks.yaw(e),r=this.nav.nearest(n.x+Math.sin(s)*.65,n.z+Math.cos(s)*.65,(w,T)=>this.citizens.every(C=>Math.hypot(C.root.position.x-w,C.root.position.z-T)>.23),1.1);if(!r)return;const a=new Vt,o=new Vt;a.add(o),o.position.y=.16,Ot(o,[7969937,11897456,10132338,8229283][t%4],0,.075,0,.115,.15,.075),Se(o,14858897,0,.2,0,.062),Se(o,[6441788,9728847,5130302][t%3],0,.228,-.012,.052);for(const w of[-.022,.022])Se(o,4537906,w,.205,.054,.006);const l=[-1,1].map(w=>{const T=new Vt;return T.position.set(w*.083,.125,0),o.add(T),Ot(T,14660235,0,-.065,0,.035,.13,.035),T}),c=[-1,1].map(w=>{const T=new Vt;return T.position.set(w*.035,.155,0),a.add(T),Ot(T,5858653,0,-.065,0,.044,.13,.045),Ot(T,6706759,0,-.13,.018,.05,.035,.075),T}),h=new qt(new fi(.11,.1,.09),new Xi({color:11306581,roughness:1}));h.position.set(0,.235,.11),h.visible=!1,a.add(h);const u=new Vt;Ot(u,9136455,0,-.13,.04,.022,.19,.022),Ot(u,10464938,.025,-.19,.04,.09,.045,.025),l[0].add(u),u.visible=!1;const d=new Vt;d.position.set(0,-.12,0),Ot(d,8677451,0,.28,0,.013,.58,.013),d.rotation.x=1,l[0].add(d),d.visible=!1;const f=new Sc(new ve().setAttribute("position",new Ke(new Float32Array(36),3)),new Ms({color:14869969,transparent:!0,opacity:.8}));f.frustumCulled=!1,f.visible=!1;const g=new go(.032,12,12).toNonIndexed(),_=[],m=g.getAttribute("position");for(let w=0;w<m.count;w+=3){const T=(m.getY(w)+m.getY(w+1)+m.getY(w+2))/3,C=new wt(Math.floor((T+.032)/.016)%2===0?14965840:16774623);for(let M=0;M<3;M++)_.push(C.r,C.g,C.b)}g.scale(.85,1.25,.85),g.setAttribute("color",new $t(_,3));const p=new qt(g,new Xi({vertexColors:!0,roughness:.55}));p.visible=!1;const b=new Vt;Se(b,9747131,0,0,0,.055).scale.set(.55,.7,1.6);const x=zg();b.add(x),b.visible=!1,a.position.set(r.x,te,r.z),a.rotation.y=s+Math.PI;const A=document.createElement("div");A.className="citizen-status",A.setAttribute("role","img"),this.overlay.append(A),this.root.add(a,f,p,b),this.spawned.add(t),this.citizens.push({id:t,root:a,body:o,arms:l,legs:c,bundle:h,axe:u,rod:d,line:f,bobber:p,fish:b,stage:"idle",path:[],target:null,job:null,clock:0,retry:.6+t%7*.1,phase:t*1.73,birth:t===0?1:0,speed:0,wait:0,status:A,lastStatus:"",eatUntil:0,hungry:!1,waitReason:"",searchUntil:0,stuck:0,bestDistance:1/0,nodeMarker:"",avoid:[]})}findJob(t){const e=this.game,n=qe(t.root.position.x,t.root.position.z),s=e.workTargets(),r=this.assignedCounts(),a=[...e.board.keys()].map(o=>({source:o,recipe:e.productAt(o),category:e.categoryFor(o)})).filter(({source:o,recipe:l,category:c})=>l&&this.hooks.resourceReady(o)&&this.hooks.ready(o)&&(c?r[c]<s[c]:e.happy<70)&&this.assignedTo(o)<l.capacity).sort((o,l)=>Ii(n,o.source)-Ii(n,l.source));for(const{source:o,recipe:l,category:c}of a){const h=e.storageFor(o).find(f=>this.hooks.ready(f)&&e.canStore(f,l.resource));if(h===void 0)continue;let u=l.resource==="wood"?-1:t.id%2;if((c==="farm"||c==="berry")&&(u=[0,1].find(f=>!this.citizens.some(g=>g.job?.source===o&&g.job.tree===f&&g.stage!=="to-store"))??-1,u<0))continue;if(l.resource==="wood")for(let f=0;f<3;f++){const g=this.hooks.pickTree(o,(t.id+f)%3);if(g>=0&&!this.citizens.some(_=>_.job?.source===o&&_.job.tree===g&&_.stage!=="to-store")){u=g;break}}if(l.resource==="wood"&&u<0)continue;const d=e.board.get(o)==="fisher"?this.hooks.fishingSpot(o):null;if(!(e.board.get(o)==="fisher"&&!d)&&this.route(t,o,d?.stand??this.hooks.workPoint(o,u)))return t.job={source:o,store:h,resource:l.resource,amount:l.amount,tree:u,category:c},t.stage="to-work",t.clock=0,!0}return!1}wander(t){const e=qe(t.root.position.x,t.root.position.z),n=[e,...ke(e)].filter(o=>this.game.board.has(o)&&this.hooks.ready(o));if(!n.length)return;const s=n[Math.floor((Math.sin(this.time+t.phase)+1)*.499*n.length)],r=se(s),a=this.time*.7+t.phase;this.route(t,s,new D(r.x+Math.sin(a)*.7,te,r.z+Math.cos(a)*.7))}move(t,e){if(!t.path.length)return t.speed*=Math.exp(-10*e),!1;const n=t.path[0];if(!this.game.board.has(n.tile)||!this.hooks.ready(n.tile))return t.path=[],!1;const s=n.x-t.root.position.x,r=n.z-t.root.position.z,a=Math.hypot(s,r);if(a<.035)return t.path.shift(),t.nodeMarker="",!1;const o=`${n.x}:${n.z}`;if(t.nodeMarker!==o?(t.nodeMarker=o,t.bestDistance=a,t.stuck=0):a<t.bestDistance-.035?(t.bestDistance=a,t.stuck=0):t.stuck+=e,t.stuck>1.1)return this.recover(t),!1;const l=Math.atan2(s,r),c=Zt.euclideanModulo(l-t.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;t.speed+=((.82+t.id%4*.025)*Math.max(.35,1-Math.abs(c)/Math.PI*.65)-t.speed)*(1-Math.exp(-7*e));const h=Math.min(a,t.speed*e),u=s/a,d=r/a,f={x:t.root.position.x,z:t.root.position.z},g=Math.min(.06,e*.8),m=[{x:f.x+u*h,z:f.z+d*h},{x:f.x+u*h-d*g,z:f.z+d*h+u*g},{x:f.x+u*h+d*g,z:f.z+d*h-u*g},{x:f.x-d*g,z:f.z+u*g},{x:f.x+d*g,z:f.z-u*g}].find(p=>this.clear(t,p.x,p.z)&&this.nav.segment(f,p));return m?(t.wait=0,t.root.position.x=m.x,t.root.position.z=m.z,t.root.rotation.y+=c*(1-Math.exp(-15*e)),Math.hypot(n.x-m.x,n.z-m.z)<.035&&t.path.shift(),!0):(t.wait+=e,t.speed*=.8,t.wait>.6&&this.recover(t),!1)}recover(t){if(this.nav.invalidate(),t.searchUntil=this.time+1.5,t.wait=0,t.stuck=0,t.path[0]&&t.avoid.push({x:t.path[0].x,z:t.path[0].z,until:this.time+4}),t.path=[],t.stage==="to-store"){t.target=null,t.job&&(t.job.store=-1),t.retry=0;return}if(t.job){const e=t.job.category==="fish"?this.hooks.fishingSpot(t.job.source)?.stand:this.hooks.workPoint(t.job.source,t.job.tree);if(e&&this.route(t,t.job.source,e))return;t.retry=.5}else t.retry=.2}sendToStorage(t){const e=t.job;if(!e)return;const n=this.game;if(e.resource==="happy"&&n.happy>=100){this.releaseJob(t);return}const s=n.storageFor(e.source).filter(o=>this.hooks.ready(o)),r=s.filter(o=>n.canStore(o,e.resource));if(!r.length){t.waitReason=s.length?"full":"path",t.retry=.7;return}if(e.store>=0&&r.includes(e.store)&&t.target&&Math.hypot(t.root.position.x-t.target.x,t.root.position.z-t.target.z)<.1&&Math.hypot(t.root.position.x-se(e.store).x,t.root.position.z-se(e.store).z)<1.05){const o=this.hooks.deliver(e.source,e.store,e.resource,e.amount);if(e.amount-=o,e.amount<=0){this.releaseJob(t),t.retry=.35;return}t.target=null,e.store=-1,t.retry=.1;return}const a=r.sort((o,l)=>Math.hypot(t.root.position.x-se(o).x,t.root.position.z-se(o).z)-Math.hypot(t.root.position.x-se(l).x,t.root.position.z-se(l).z));for(const o of a){const l=se(o),c=this.hooks.yaw(o),u=[0,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2,Math.PI,2*Math.PI/3,-2*Math.PI/3].map(d=>new D(l.x+Math.sin(c+d)*.67,te,l.z+Math.cos(c+d)*.67)).filter(d=>this.nav.free(d.x,d.z)&&this.clear(t,d.x,d.z)).sort((d,f)=>t.root.position.distanceTo(d)-t.root.position.distanceTo(f));for(const d of u)if(this.route(t,o,d,!0)){e.store=o,t.waitReason="";return}}t.waitReason="path",t.searchUntil=this.time+1.2,t.retry=.6}updateStatuses(t,e,n){const s=new D;for(const r of this.citizens){const a=r.eatUntil>this.time,o=r.bundle.visible,l=a?r.hungry?"hungry":"eat":r.searchUntil>this.time?"search":o?r.waitReason==="full"?"full":"carry":r.stage==="working"?r.job?.category??"garden":r.path.length?"walk":"rest";if(l!==r.lastStatus){r.lastStatus=l;const c=ql[l==="carry"?r.job?.category??"garden":l]??ql.rest;r.status.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${c}</svg>`,r.status.dataset.state=l,r.status.setAttribute("aria-label",$l[l]??"Dinleniyor"),r.status.title=$l[l]??"Dinleniyor"}s.copy(r.root.position),s.y+=.58,s.project(t),r.status.hidden=s.z<-1||s.z>1,r.status.style.left=`${(s.x+1)*e/2}px`,r.status.style.top=`${(1-s.y)*n/2}px`,r.status.style.opacity=String(r.birth)}}fishing(t,e){const n=this.hooks.fishingSpot(t.job.source);if(!n)return;const s=t.clock,r=s-e,a=n.water;t.root.rotation.y=Math.atan2(a.x-t.root.position.x,a.z-t.root.position.z),t.rod.visible=!0;const o=Zt.smoothstep(s,.7,1.35),l=Zt.smoothstep(s,5.8,7.2);t.arms[0].rotation.x=s<.7?-.8-s*.5:s<1.35?-.95+o*.9:s>5.8?-.1-l*.9:-.1,t.arms[1].rotation.x=-.35,t.rod.rotation.x=.75,t.root.updateMatrixWorld(!0);const c=t.rod.localToWorld(new D(0,.58,0)),h=t.root.localToWorld(new D(0,.24,.15)),u=new D().lerpVectors(c,a,o);u.y+=Math.sin(o*Math.PI)*.45,s>=1.35&&(u.copy(a),u.y+=Math.sin(this.time*4)*.015),s>5.8&&(u.lerpVectors(a,h,l),u.y+=Math.sin(l*Math.PI)*.38),t.bobber.visible=s>.7&&s<7.25,t.bobber.position.copy(u),t.line.visible=t.bobber.visible;const d=t.line.geometry.getAttribute("position");for(let f=0;f<12;f++){const g=f/11;d.setXYZ(f,Zt.lerp(c.x,u.x,g),Zt.lerp(c.y,u.y,g)-Math.sin(g*Math.PI)*.06,Zt.lerp(c.z,u.z,g))}d.needsUpdate=!0,t.fish.visible=s>5.9&&s<7.2,t.fish.position.copy(u),t.fish.rotation.z=Math.sin(this.time*22)*.25,r<1.35&&s>=1.35&&this.hooks.splash(a.x,a.z),s>1.35&&s<5.8&&Math.floor(s/.9)!==Math.floor(r/.9)&&this.hooks.splash(a.x,a.z)}update(t){const e=this.game;if(!(!e||!this.nav)){this.time+=t,e.tick(t),this.spawnClock-=t;for(const n of e.takeMeals()){const s=this.citizens.find(r=>r.id===n.id);s&&(s.eatUntil=this.time+1.5,s.hungry=!n.ate)}if(this.spawnClock<=0){for(const n of e.residents)!this.spawned.has(n.id)&&this.hooks.ready(n.home)&&this.spawn(n.id,n.home);this.spawnClock=.35}this.buckets.clear();for(const n of this.citizens){const s=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`;this.buckets.has(s)||this.buckets.set(s,[]),this.buckets.get(s).push(n)}for(const n of this.citizens){n.avoid=n.avoid.filter(g=>g.until>this.time),n.birth=Math.min(1,n.birth+t*2),n.root.scale.setScalar(Math.max(.01,n.birth*n.birth*(3-2*n.birth)));const s=qe(n.root.position.x,n.root.position.z);if(!e.board.has(s)||!this.nav.free(n.root.position.x,n.root.position.z)){const g=se(e.residents[n.id]?.home??ie),_=this.nav.nearest(e.board.has(s)?n.root.position.x:g.x,e.board.has(s)?n.root.position.z:g.z,(m,p)=>this.citizens.every(b=>b===n||Math.hypot(b.root.position.x-m,b.root.position.z-p)>.23),1.2);if(_){const m=`${Math.floor(n.root.position.x/.32)}:${Math.floor(n.root.position.z/.32)}`,p=this.buckets.get(m);if(p){const E=p.indexOf(n);E>=0&&p.splice(E,1)}n.root.position.x=_.x,n.root.position.z=_.z,n.path=[];const b=`${Math.floor(_.x/.32)}:${Math.floor(_.z/.32)}`;this.buckets.has(b)||this.buckets.set(b,[]),this.buckets.get(b).push(n)}else continue}if(n.job&&!e.board.has(n.job.source)&&this.releaseJob(n),n.retry-=t,n.eatUntil>this.time){n.axe.visible=!1,n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.body.rotation.x=.06,n.arms[0].rotation.x=-1.9+Math.sin(this.time*7)*.12,n.arms[1].rotation.x=n.bundle.visible?-.8:-.2,n.legs.forEach(g=>g.rotation.x=0);continue}n.stage==="idle"&&n.retry<=0&&(n.retry=1.5+n.id%3*.2,!this.findJob(n)&&!n.path.length&&this.wander(n));const r=this.move(n,t);if(n.stage==="to-work"&&!n.path.length&&n.job&&n.retry<=0)if(n.target&&Math.hypot(n.target.x-n.root.position.x,n.target.z-n.root.position.z)<.17)n.stage="working",n.clock=0;else{const g=n.job.category==="fish"?this.hooks.fishingSpot(n.job.source)?.stand:this.hooks.workPoint(n.job.source,n.job.tree);(!g||!this.route(n,n.job.source,g))&&(n.retry=.6,n.searchUntil=this.time+1)}n.rod.visible=!1,n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1;const a=n.stage==="working",o=a&&n.job?.resource==="wood",l=a&&n.job?.category==="fish",c=this.time*9+n.phase;n.root.position.y=te+(l?.035:0)+(r?Math.abs(Math.sin(c))*.012:Math.sin(this.time*2+n.phase)*.002),n.body.rotation.x=a?o?.12:.45+Math.sin(n.clock*4)**2*.22:r?.05:Math.sin(this.time*1.4+n.phase)*.02;const h=n.clock*1.7%1,u=Zt.smoothstep(h,0,.6),d=Zt.smoothstep(h,.6,.76),f=Zt.smoothstep(h,.76,1);if(n.arms[0].rotation.x=o?-.3-u*1.9+d*2.1-f*.2:a?-.9:r?Math.sin(c)*.45:Math.sin(this.time*1.7+n.phase)*.08,n.arms[1].rotation.x=o?-.25:a?-.9:r?-Math.sin(c)*.45:-Math.sin(this.time*1.7+n.phase)*.08,n.legs[0].rotation.x=r?Math.sin(c)*.55:0,n.legs[1].rotation.x=r?-Math.sin(c)*.55:0,n.axe.visible=!!o,a&&n.job){if(l){const _=this.hooks.fishingSpot(n.job.source);if(!_||Math.hypot(n.root.position.x-_.stand.x,n.root.position.z-_.stand.z)>.22){n.clock=0,n.stage="to-work",n.path=[],n.target=null,n.retry=0;continue}}n.clock+=t,o&&n.clock>.3&&Math.floor(n.clock*1.7-.72)!==Math.floor((n.clock-t)*1.7-.72)&&this.hooks.impact(n.job.source,n.job.tree);const g=l?7.5:o?2.2:2.4;if(l)n.body.rotation.x=.05,this.fishing(n,t);else{const _=this.hooks.workPoint(n.job.source,n.job.tree);n.root.rotation.y=Math.atan2(_.x-.12-n.root.position.x,_.z-.15-n.root.position.z),this.hooks.harvestProgress(n.job.source,n.id,Math.min(1,n.clock/g))}n.clock>=g&&(this.hooks.harvest(n.job.source,n.job.resource,n.job.tree,n.id)?(n.bundle.visible=!0,n.bundle.material.color.setHex(n.job.category==="fish"?9088955:n.job.category==="farm"?14137438:n.job.resource==="wood"?10844239:12019029),n.stage="to-store",n.path=[],n.retry=0):this.releaseJob(n),n.line.visible=!1,n.bobber.visible=!1,n.fish.visible=!1,n.rod.visible=!1)}n.stage==="to-store"&&n.job&&!n.path.length&&n.retry<=0&&this.sendToStorage(n),n.bundle.visible&&n.arms.forEach(g=>g.rotation.x=-.8)}}}}function zg(){const i=new qt(new Pn(.05,.065,3),new Xi({color:7576476,roughness:.7}));return i.position.z=-.09,i.rotation.x=Math.PI/2,i}const ql={wood:'<path d="m8 20 5-13m-3-2 8 3 2-5-8-2-2 4Z"/>',berry:'<path d="M6 8c-5 4-1 11 6 14 7-3 11-10 6-14L12 6 6 8Zm2-2 4 3 4-3M8 12h.1m7 0h.1m-4 4h.1"/>',farm:'<path d="M12 22V3m0 7C6 11 5 7 6 4c4 1 6 3 6 6Zm0 6c6 0 7-4 6-7-4 1-6 4-6 7Z"/>',fish:'<path d="M3 12c5-6 10-6 15 0-5 6-10 6-15 0Zm15 0 4-4v8ZM7 11h.1"/>',garden:'<path d="M12 21V11m0 4c-6 0-7-3-7-6 5 0 7 2 7 6Zm0 3c5 0 7-3 7-6-4 0-7 2-7 6Z"/><circle cx="12" cy="6" r="3"/>',carry:'<path d="m4 7 8-4 8 4v11l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v11"/>',full:'<path d="m3 7 7-3 7 3v5M3 7v11l7 3v-10m-7-4 7 4 7-4"/><circle cx="18" cy="17" r="5"/><path d="M18 14v3l2 1"/>',rest:'<path d="M4 9h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Zm12 0h2a3 3 0 0 1 0 6h-2M7 3v3m5-3v3"/>',walk:'<path d="m7 3-2 6 3 3 3 9m6-18 2 6-3 3-3 9M5 14l-2 6m16-6 2 6"/>',eat:'<circle cx="12" cy="12" r="5"/><path d="M2 3v7m3-7v7m-3-3h3m-1 3v11M21 3v18m0-18c-3 3-3 7 0 8"/>',hungry:'<circle cx="12" cy="12" r="7"/><path d="m5 5 14 14M2 3v6m20-6v18"/>',search:'<path d="M4 8a8 8 0 0 1 13-3l3 3m0-5v5h-5M20 16a8 8 0 0 1-13 3l-3-3m0 5v-5h5"/>'},$l={wood:"Odun kesiyor",berry:"Çilek topluyor",farm:"Buğday biçiyor",fish:"Balık tutuyor",garden:"Çiçek topluyor",carry:"Depoya taşıyor",full:"Depo dolu",rest:"Dinleniyor",walk:"Yürüyor",eat:"Yemek yiyor",hungry:"Yiyecek yok",search:"Alternatif yol arıyor"};function kg(){const i=document.createElement("canvas");i.width=64,i.height=64;const t=i.getContext("2d"),e=t.createRadialGradient(32,32,1,32,32,31);e.addColorStop(0,"rgba(50,61,39,.43)"),e.addColorStop(.6,"rgba(55,63,39,.19)"),e.addColorStop(1,"rgba(58,65,42,0)"),t.fillStyle=e,t.fillRect(0,0,64,64);const n=new Tu(i);return n.colorSpace=Ye,new pn({map:n,transparent:!0,depthWrite:!1})}function Hg(){const i=ar("house"),t=new Vt;t.position.set(-.34,0,-.21),i.add(t),_e(t,new Ue(.205,.24,.77,8),15062190,0,.405,0),_e(t,new Ue(.24,.2,.065,8),9795928,0,.812,0),_e(t,new Ue(.16,.16,.29,8),6847604,0,.99,0);for(let s=0;s<4;s++){let r=s*Math.PI/2+.4;Ot(t,12296567,Math.cos(r)*.172,.99,Math.sin(r)*.172,.038,.3,.038)}_e(t,new Pn(.29,.37,8),5734528,0,1.29,0),Ot(t,9402454,0,1.58,0,.023,.23,.023);const e=new ve;e.setAttribute("position",new $t([0,1.69,0,.26,1.62,.018,0,1.56,0],3)),e.computeVertexNormals();const n=new qt(e,new _o({color:14394711,side:Le}));return t.add(n),i}class Gg{constructor(t){this.el=t,this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ic,this.renderer.toneMapping=pa,this.renderer.toneMappingExposure=1.03,t.append(this.renderer.domElement),this.cameraControl=new gg(this.renderer.domElement),this.scene.add(new hl(16773592,8689792,1.55),this.root);const e=this.sun;e.position.set(-5,10,4),e.castShadow=!0,Object.assign(e.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:31}),e.shadow.mapSize.set(2048,2048),e.shadow.bias=-12e-5,e.shadow.normalBias=.015,this.scene.add(e,e.target),this.environment=new Ug(this.scene),this.villagers=new Bg(this.scene,{ready:l=>this.ready(l),yaw:l=>this.buildings.get(l)?.rotation.y??0,resourceReady:l=>this.resourceReady(l),pickTree:(l,c)=>this.pickTree(l,c),workPoint:(l,c)=>this.workPoint(l,c),harvest:(l,c,h,u)=>this.harvest(l,c,h,u),harvestProgress:(l,c,h)=>{const u=`${l}:${c}`;h?this.harvestParts.set(u,{id:l,progress:h}):this.harvestParts.delete(u)},fishingSpot:l=>this.fishingSpot(l),impact:(l,c)=>this.woodImpact(l,c),splash:(l,c)=>this.environment.stir(l,c,1,0,.45,.1),trail:l=>this.addTrail(l),deliver:(l,c,h,u)=>this.onDelivery(l,c,h,u)},this.el);const n=cn*Math.sqrt(3)*cs+.55,s=new qt(new Fi(n,6).rotateX(-Math.PI/2),new pn({color:16047001,transparent:!0,opacity:.065,depthWrite:!1,side:Le})),r=new Ya(new ve().setFromPoints(Array.from({length:6},(l,c)=>new D(Math.cos(c*Math.PI/3)*n,0,Math.sin(c*Math.PI/3)*n))),new Ms({color:16770988,transparent:!0,opacity:.75,depthWrite:!1}));this.storageRange.add(s,r),this.storageRange.visible=!1,this.scene.add(this.storageRange,this.coveredTiles,this.trails),this.trails.count=0,this.trails.frustumCulled=!1,this.grid=new Fg(this.scene);const a=()=>{const{clientWidth:l,clientHeight:c}=t;this.renderer.setSize(l,c),this.cameraControl.resize(l,c)};new ResizeObserver(a).observe(t),a();const o=this.renderer.domElement;o.addEventListener("pointermove",l=>{this.selected&&!l.buttons&&this.point(l.clientX,l.clientY)}),o.addEventListener("pointerleave",()=>{this.setHover(-1),this.lastSea=null,this.onInspect(-1,0,0,null)}),o.addEventListener("pointermove",l=>{this.stirSea(l),this.inspectPointer(l)}),o.addEventListener("click",l=>{if(l.button===0){if(this.selected){const c=this.point(l.clientX,l.clientY);c>=0&&this.onPick(c)}else if(!this.placing&&!document.querySelector("dialog[open]")){const c=this.grid.pick(l.clientX,l.clientY,this.cameraControl.camera,this.el);this.editTile(this.board.has(c)?c:-1)}}}),window.addEventListener("wheel",l=>{if((!this.selected||this.selected.event)&&this.editing<0||document.querySelector("dialog[open]"))return;l.preventDefault(),l.stopImmediatePropagation();const c=l.deltaY*(l.deltaMode===1?16:l.deltaMode===2?300:1);this.wheelRotation=Zt.clamp(this.wheelRotation+c,-240,240);const h=Math.trunc(this.wheelRotation/60);h&&(this.wheelRotation-=h*60,this.rotateSelection(h))},{capture:!0,passive:!1}),window.addEventListener("keydown",l=>{l.key.toLowerCase()!=="r"||l.repeat||l.ctrlKey||l.metaKey||l.altKey||document.querySelector("dialog[open]")||l.target instanceof Element&&l.target.closest("input,textarea,select,[contenteditable]")||(this.selected&&!this.selected.event||this.editing>=0)&&(l.preventDefault(),this.rotateSelection(l.shiftKey?-1:1))}),this.renderer.setAnimationLoop(this.frame)}el;scene=new sl;renderer=new Hl({antialias:!0,alpha:!1,powerPreference:"high-performance"});cameraControl;grid;environment;villagers;game=null;storageRange=new Vt;treeCycles=new Map;fields=new Map;harvestParts=new Map;loaders=new Map;coveredTiles=new Vt;coverageGeo=new Fi(cn*.9,6,Math.PI/2).rotateX(-Math.PI/2);coverageFill=new pn({color:13954474,transparent:!0,opacity:.11,depthWrite:!1,depthTest:!1,side:Le});coverageLine=new Ms({color:16182717,transparent:!0,opacity:.85,depthWrite:!1,depthTest:!1});coverageRim=new ve().setFromPoints(Array.from({length:6},(t,e)=>{const n=zi(e,cn*.94);return new D(n.x,0,n.z)}));trails=new yc(new Fi(.055,5).rotateX(-Math.PI/2),new pn({color:13417621,transparent:!0,opacity:.42,depthWrite:!1}),8e3);trailPoints=[];trailKeys=new Set;fisherOffset=0;woodHits=new Map;root=new Vt;buildings=new Map;editing=-1;rotationTargets=new Map;demolitions=[];ghost=null;ghostModel=null;desiredGhostYaw=0;lastRotationWake=0;wheelRotation=0;placementQueued=!1;previewLand=null;previewLandMat=new Xi({vertexColors:!0,roughness:1,flatShading:!0,side:Le});seaRay=new Tc;seaPlane=new wn(new D(0,1,0),-Hn);seaPoint=new D;lastSea=null;board=new Map;sun=new fl(16769463,2.35);ghostPalette=[];ghostTarget=new D;contact=kg();contactGeo=new ci(1.48,1.26).rotateX(-Math.PI/2);moteGeo=new Es(.032,0);moteMats=[15321987,12966298,14333578].map(t=>new pn({color:t}));builds=[];motes=[];labels=[];rings=[];ringGeo=new mo(.47,.49,32).rotateX(-Math.PI/2);projection=new D;selected=null;previousTime=performance.now();time=0;hover=-1;valid=t=>!1;onHover=t=>{};onPick=t=>{};onTileSelect=t=>{};onDelivery=(t,e,n,s)=>0;onInspect=(t,e,n,s)=>{};bindGame(t){this.game=t,this.villagers.reset(t)}ready(t){return this.board.has(t)&&this.buildings.has(t)&&!this.builds.some(e=>e.id===t)&&!this.demolitions.some(e=>e.id===t)}pickTree(t,e){for(let n=0;n<3;n++){const s=(e+n)%3;if(!this.treeCycles.has(`${t}:${s}`)&&this.buildings.get(t)?.children.some(r=>r.userData.treeIndex===s))return s}return-1}workPoint(t,e){const n=se(t),s=this.buildings.get(t),r=s?.children.find(c=>c.userData.treeIndex===e);if(r){r.updateWorldMatrix(!0,!1);const c=r.getWorldPosition(new D);return new D(c.x+.18,te,c.z+.18)}const a=s?.rotation.y??0,o=["farm","berry"].includes(this.board.get(t)??"")?e%2?-.18:.18:0,l=.62;return new D(n.x+o*Math.cos(a)+l*Math.sin(a),te,n.z-o*Math.sin(a)+l*Math.cos(a))}harvest(t,e,n,s){if(this.harvestParts.delete(`${t}:${s}`),!this.ready(t))return!1;if(e==="wood"){const r=`${t}:${n}`,a=this.buildings.get(t)?.children.find(o=>o.userData.treeIndex===n);if(!a||this.treeCycles.has(r))return!1;this.treeCycles.set(r,{id:t,tree:a,age:0,scale:a.scale.clone()}),a.updateWorldMatrix(!0,!1),this.makeLoader(r,t,a.getWorldPosition(new D).add(new D(0,.5,0)),30)}else if(this.board.get(t)==="berry"||this.board.get(t)==="farm"||this.board.get(t)==="garden"){const r=this.fieldState(t);if(r.stock<=0)return!1;if(r.stock--,r.stock===0){r.age=0;const a=se(t);this.makeLoader(`field:${t}`,t,new D(a.x,te+.6,a.z),30)}}else if(this.board.get(t)==="fisher"&&!this.fishingSpot(t))return!1;return!0}showStorageRange(t,e=!1){const n=t>=0&&(e||t===ie||this.board.get(t)==="store");if(this.storageRange.visible=n,this.coveredTiles.clear(),!n)return;const s=t===ie&&!e?2:cs,r=se(t);this.storageRange.position.set(r.x,te+.025,r.z),this.storageRange.scale.setScalar(s/cs);for(const a of new Set([...this.board.keys(),...e?[t]:[]]))if(Ii(t,a)<=s){const o=se(a),l=new Vt;l.position.set(o.x,te+.045,o.z);const c=new qt(this.coverageGeo,this.coverageFill),h=new Ya(this.coverageRim,this.coverageLine);c.renderOrder=8,h.renderOrder=9,l.add(c,h),this.coveredTiles.add(l)}}woodImpact(t,e){const n=this.buildings.get(t)?.children.find(r=>r.userData.treeIndex===e);if(!n)return;this.woodHits.set(n,.2),n.updateWorldMatrix(!0,!1);const s=n.getWorldPosition(new D);for(let r=0;r<3;r++){const a=new qt(this.moteGeo,this.moteMats[0]);a.scale.setScalar(.45),a.position.copy(s).add(new D(0,.25,0)),this.scene.add(a),this.motes.push({mesh:a,velocity:new D((Math.random()-.5)*.45,.35+Math.random()*.25,(Math.random()-.5)*.45),life:.3})}}fieldState(t){if(!this.fields.has(t)){const e=this.board.get(t)==="farm"?4:3;this.fields.set(t,{stock:e,max:e,age:0})}return this.fields.get(t)}resourceReady(t){const e=this.board.get(t);return e==="forest"?this.pickTree(t,0)>=0:e==="berry"||e==="farm"||e==="garden"?this.fieldState(t).stock>0:e==="fisher"?!!this.fishingSpot(t):!0}coastalYaw(t,e=0,n=0){const s=se(t),r=ke(t).filter(c=>!this.board.has(c)).map(c=>{const h=se(c);return Math.atan2(h.x-s.x,h.z-s.z)});if(!r.length)return e;const a=(c,h)=>Zt.euclideanModulo(c-h+Math.PI,Math.PI*2)-Math.PI;let o=e;if(n&&r.length>1){const c=Math.sign(n);for(let h=0;h<Math.abs(n);h++){const u=r.map(d=>({a:d,d:Zt.euclideanModulo((d-o)*c,Math.PI*2)})).filter(d=>d.d>.04).sort((d,f)=>d.d-f.d)[0];u&&(o+=u.d*c)}return o}const l=r.sort((c,h)=>Math.abs(a(c,e))-Math.abs(a(h,e)))[0];return e+a(l,e)}alignFisheries(){for(const[t,e]of this.board)if(e==="fisher"){const n=this.buildings.get(t);if(!n)continue;const s=this.rotationTargets.get(t)??n.rotation.y,r=this.coastalYaw(t,s);Math.abs(r-s)>.01&&this.rotationTargets.set(t,r)}}fishingSpot(t){const e=this.buildings.get(t);if(!e||this.board.get(t)!=="fisher"||!this.ready(t))return null;const n=se(t),s=this.rotationTargets.get(t)??e.rotation.y,r=Math.sin(s),a=Math.cos(s),o=new D(n.x+r*1.75,Hn+.03,n.z+a*1.75);return this.board.has(qe(o.x,o.z))?null:{stand:new D(n.x+r*.7,te,n.z+a*.7),water:o}}makeLoader(t,e,n,s){this.loaders.get(t)?.el.remove();const r=document.createElement("div");r.className="regrowth-loader",r.innerHTML="<i></i><span></span>",r.setAttribute("aria-label","Yeniden büyüyor"),this.el.append(r),this.loaders.set(t,{id:e,el:r,point:n,total:s})}updateLoader(t,e){const n=this.loaders.get(t);if(!n)return;if(!this.board.has(n.id)||e>=n.total){n.el.remove(),this.loaders.delete(t);return}const s=n.point.clone().project(this.cameraControl.camera);n.el.style.left=`${(s.x+1)*this.el.clientWidth/2}px`,n.el.style.top=`${(1-s.y)*this.el.clientHeight/2}px`,n.el.style.setProperty("--progress",`${e/n.total*360}deg`),n.el.querySelector("span").textContent=`${Math.ceil(n.total-e)}s`}addTrail(t){const e=new ye;for(let n=1;n<t.length;n++){const s=t[n-1],r=t[n],a=Math.ceil(Math.hypot(r.x-s.x,r.z-s.z)/.16);for(let o=0;o<=a;o++){const l=Zt.lerp(s.x,r.x,o/Math.max(1,a)),c=Zt.lerp(s.z,r.z,o/Math.max(1,a)),h=`${Math.round(l/.13)}:${Math.round(c/.13)}`;if(this.trailKeys.has(h)||this.trailPoints.length>=8e3)continue;this.trailKeys.add(h);const u=qe(l,c);this.trailPoints.push({tile:u,x:l,z:c}),e.position.set(l,te+.007,c),e.rotation.y=n+o*.8,e.scale.set(1,.7,.8),e.updateMatrix(),this.trails.setMatrixAt(this.trailPoints.length-1,e.matrix)}}this.trails.count=this.trailPoints.length,this.trails.instanceMatrix.needsUpdate=!0}screenPoint(t,e=.7){const n=se(t),s=new D(n.x,e,n.z).project(this.cameraControl.camera);return{x:(s.x+1)*this.el.clientWidth/2,y:(1-s.y)*this.el.clientHeight/2}}inspectPointer(t){if(this.selected||t.buttons||document.querySelector("dialog[open]")){this.onInspect(-1,0,0,null);return}const e=this.grid.pick(t.clientX,t.clientY,this.cameraControl.camera,this.el);if(!this.board.has(e)){this.onInspect(-1,0,0,null),this.renderer.domElement.style.cursor="";return}this.renderer.domElement.style.cursor="pointer";const n=se(e),s=Array.from({length:6},(r,a)=>{const o=zi(a),l=new D(n.x+o.x,te,n.z+o.z).project(this.cameraControl.camera);return{x:(l.x+1)*this.el.clientWidth/2,y:(1-l.y)*this.el.clientHeight/2}});this.onInspect(e,t.clientX,t.clientY,{left:Math.min(...s.map(r=>r.x)),right:Math.max(...s.map(r=>r.x)),top:Math.min(...s.map(r=>r.y))-35,bottom:Math.max(...s.map(r=>r.y))})}holdSelection(){this.placementQueued=!0,this.cameraControl.setPlacement(!1)}get placementRotation(){return this.desiredGhostYaw}rotateSelection(t){if(this.lastRotationWake=this.time-.06,this.villagers.refreshNavigation(),this.selected&&!this.selected.event)this.desiredGhostYaw=this.selected.id==="fisher"&&this.hover>=0?this.coastalYaw(this.hover,this.desiredGhostYaw,t):this.desiredGhostYaw+t*Math.PI/3;else if(this.editing>=0&&!this.placing){const e=this.buildings.get(this.editing);if(e){const n=this.rotationTargets.get(this.editing)??e.rotation.y;this.rotationTargets.set(this.editing,this.board.get(this.editing)==="fisher"?this.coastalYaw(this.editing,n,t):n+t*Math.PI/3)}}}get placing(){return this.builds.length>0||this.demolitions.length>0}editTile(t){this.editing=t,this.wheelRotation=0,this.grid.setHover(t,!0,t>=0),this.showStorageRange(t),this.onTileSelect(t)}demolish(t,e){const n=this.buildings.get(e);n&&(this.editTile(-1),this.rotationTargets.delete(e),this.board=t,this.grid.rebuild(t),this.grid.showAvailable(!1,this.valid),this.environment.demolish(t,e),this.demolitions.push({id:e,group:n,time:0}))}point(t,e){if(this.placementQueued)return this.hover;const s=document.elementFromPoint(t,e)===this.renderer.domElement?this.grid.pick(t,e,this.cameraControl.camera,this.el):-1;return this.setHover(s),s}stirSea(t){if(t.buttons||this.selected||t.pointerType==="touch"){this.lastSea=null;return}const e=this.renderer.domElement.getBoundingClientRect();if(this.seaRay.setFromCamera(new kt((t.clientX-e.left)/e.width*2-1,1-(t.clientY-e.top)/e.height*2),this.cameraControl.camera),!this.seaRay.ray.intersectPlane(this.seaPlane,this.seaPoint)||this.board.has(qe(this.seaPoint.x,this.seaPoint.z))){this.lastSea=null;return}const{x:n,z:s}=this.seaPoint,r=performance.now()/1e3,a=this.lastSea;if(a&&r-a.time<.04||(this.lastSea={x:n,z:s,time:r},!a||r-a.time>.25))return;const o=n-a.x,l=s-a.z,c=Math.hypot(o,l);c<.025||c>2||this.environment.stir(n,s,o/c,l/c,Math.min(1,c/(r-a.time)/12),c)}setHover(t,e=!1){if(this.editing>=0&&!this.selected){this.grid.setHover(this.editing,!0,!0);return}if(!e&&t===this.hover)return;this.hover=t;const n=t>=0&&this.valid(t);if(this.grid.setHover(t,n,!!this.selected),this.ghost){const s=this.ghost.visible;this.ghost.visible=t>=0,t>=0&&(this.selected?.id==="fisher"&&(this.desiredGhostYaw=this.coastalYaw(t,this.desiredGhostYaw)),this.ghostTarget.copy(si(t,this.board.has(t)?te+.035:te+.025)),s||this.ghost.position.copy(this.ghostTarget),this.ghostPalette.forEach(({mat:r,base:a})=>{r.color.copy(a).lerp(new wt(n?12969902:15304821),n?.04:.65),r.opacity=n?1:.45,r.transparent=!n,r.depthWrite=n}))}if(this.previewLand&&(this.ghost?.remove(this.previewLand),this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&n&&!this.selected?.event&&!this.board.has(t)){const s=new Map(this.board);s.set(t,this.selected.id),this.previewLand=new qt(sr(t,s),this.previewLandMat),this.previewLand.position.y=-te-.025/.7,this.previewLand.receiveShadow=!0,this.ghost.add(this.previewLand)}this.selected?.id==="store"&&this.showStorageRange(n?t:-1,!0),this.onHover(t)}setSelection(t,e=!1){this.editTile(-1),this.onInspect(-1,0,0,null);const n=!!t&&t===this.selected,s=n?this.desiredGhostYaw:0,r=n?this.ghostModel?.rotation.y??s:0;this.cameraControl.setPlacement(e),this.previewLand&&(this.previewLand.geometry.dispose(),this.previewLand=null),this.ghost&&(this.scene.remove(this.ghost),this.ghost=null),this.ghostPalette.forEach(a=>a.mat.dispose()),this.ghostPalette=[],this.selected=t,this.fisherOffset=n?this.fisherOffset:0,this.placementQueued=!1,this.ghostModel=null,this.desiredGhostYaw=s,this.wheelRotation=0,t&&(this.ghost=new Vt,this.ghostModel=ar(t.id),this.ghostModel.rotation.y=r,this.ghost.add(this.ghostModel),this.ghost.scale.setScalar(.7),this.ghost.traverse(a=>{if(a instanceof qt){const o=a.material.clone();this.ghostPalette.push({mat:o,base:o.color.clone()}),o.transparent=!0,o.opacity=.72,o.depthWrite=!1,a.material=o,a.castShadow=!1,a.receiveShadow=!1,a.renderOrder=0}}),this.scene.add(this.ghost),this.ghost.visible=!1),this.grid.showAvailable(!!t&&!t.event,this.valid),this.setHover(-1,!0)}sync(t,e=-1,n=0,s=!1){const r=this.buildings.size===0;if(this.board=t,this.villagers.refreshNavigation(),this.trailPoints.some(a=>!t.has(a.tile))){const a=this.trailPoints.filter(o=>t.has(o.tile));this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0;for(const o of a)this.addTrail([o,{...o,x:o.x+.001}])}if(r||e>=0||s){this.grid.rebuild(t),this.environment.sync(t,e);const a=[...t.keys()].map(se);this.cameraControl.frameIsland(a,r);const o=(Math.max(...a.map(h=>h.x))+Math.min(...a.map(h=>h.x)))/2,l=(Math.max(...a.map(h=>h.z))+Math.min(...a.map(h=>h.z)))/2,c=Math.max(3,...a.map(h=>Math.hypot(h.x-o,h.z-l)+2));this.sun.target.position.set(o,0,l),this.sun.position.set(o-5,10,l+4),Object.assign(this.sun.shadow.camera,{left:-c,right:c,top:c,bottom:-c,far:35+c}),this.sun.shadow.camera.updateProjectionMatrix()}t.forEach((a,o)=>{const l=this.buildings.get(o);if(!a){l&&(this.root.remove(l),this.buildings.delete(o));return}if(l)return;const c=o===ie&&a==="house"?Hg():ar(a),h=new qt(this.contactGeo,this.contact);h.position.y=.0025,h.renderOrder=1,c.add(h),c.scale.setScalar(["house","manor","store","lumber","fisher"].includes(a)?sa:["berry","farm"].includes(a)?.75:1),c.position.copy(si(o)),this.root.add(c),this.buildings.set(o,c),o===e&&(c.rotation.y=n,c.scale.setScalar(.01),c.visible=!1,c.position.y-=.74,this.builds.push({id:o,group:c,time:0,kind:a}))}),this.alignFisheries(),e>=0&&t.get(e)==="store"&&this.showStorageRange(e)}pulse(t,e){const n=new pn({color:e,transparent:!0,opacity:.8,depthWrite:!1}),s=new qt(this.ringGeo,n);s.position.copy(si(t,te+.024)),s.renderOrder=4,this.scene.add(s),this.rings.push({mesh:s,time:0})}burst(t){this.pulse(t,16768922);for(let e=0;e<14;e++){const n=e/14*Math.PI*2,s=new qt(this.moteGeo,this.moteMats[e%3]);s.position.copy(si(t,.18)),s.position.x+=Math.cos(n)*.22,s.position.z+=Math.sin(n)*.22,this.scene.add(s),this.motes.push({mesh:s,velocity:new D(Math.cos(n)*.62,.62+Math.random()*.7,Math.sin(n)*.62),life:1})}}feedback(t,e,n=[]){t.rows.filter(s=>s.wood||s.food||s.happy||!s.active).forEach((s,r)=>{const a=document.createElement("div");a.className="float"+(s.bonus?" bonus":""),a.textContent=[s.wood&&`+${s.wood} odun`,s.food&&`+${s.food} yiyecek`,s.happy&&`+${s.happy} refah`,!s.active&&"İşçi bekliyor"].filter(Boolean).join(" · "),a.style.opacity="0",this.el.append(a),this.labels.push({el:a,position:si(s.i,1.05),life:1.4,delay:(s.i===e?1.5:.1)+r*.035}),(n.includes(s.i)||s.bonus&&s.i===e)&&this.pulse(s.i,16242041)})}reset(){this.setSelection(null),this.cameraControl.reset(),this.treeCycles.clear(),this.woodHits.clear(),this.fields.clear(),this.harvestParts.clear(),this.loaders.forEach(t=>t.el.remove()),this.loaders.clear(),this.trailPoints=[],this.trailKeys.clear(),this.trails.count=0,this.root.clear(),this.environment.reset(),this.buildings.clear(),this.builds=[],this.demolitions=[],this.rotationTargets.clear();for(const{el:t}of this.labels)t.remove();this.labels=[];for(const{mesh:t}of this.motes)this.scene.remove(t);this.motes=[];for(const{mesh:t}of this.rings)this.scene.remove(t),t.material.dispose();this.rings=[]}frame=t=>{const e=Math.min(.065,(t-this.previousTime)/1e3);if(this.previousTime=t,this.time+=e,this.cameraControl.update(e),this.environment.update(this.time),this.ghost?.visible&&(this.ghost.position.lerp(this.ghostTarget,1-Math.exp(-32*e)),this.ghostModel)){const n=this.desiredGhostYaw-this.ghostModel.rotation.y;if(this.ghostModel.rotation.y+=n*(1-Math.exp(-16*e)),Math.abs(n)>.025&&this.time-this.lastRotationWake>.05&&this.valid(this.hover)){const s=this.ghostModel.rotation.y,r=Math.sign(n),a=this.ghost.position;this.environment.stir(a.x+Math.cos(s)*.68,a.z+Math.sin(s)*.68,-Math.sin(s)*r,Math.cos(s)*r,.32,.1),this.lastRotationWake=this.time}}for(const[n,s]of this.rotationTargets){const r=this.buildings.get(n);if(!r){this.rotationTargets.delete(n);continue}this.villagers.refreshNavigation();const a=s-r.rotation.y;if(r.rotation.y+=a*(1-Math.exp(-16*e)),Math.abs(a)<.001)r.rotation.y=s,this.rotationTargets.delete(n);else if(this.time-this.lastRotationWake>.05){const o=r.rotation.y,l=Math.sign(a);this.environment.stir(r.position.x+Math.cos(o)*.8,r.position.z+Math.sin(o)*.8,-Math.sin(o)*l,Math.cos(o)*l,.35,.1),this.lastRotationWake=this.time}}this.demolitions=this.demolitions.filter(n=>{n.time+=e;const s=Tn(n.time,xo,Mo);return n.group.position.y=te-1.6*s,n.group.scale.setScalar(1-.7*s),n.group.rotation.z=Math.sin(n.time*25)*Math.sin(s*Math.PI)*.035,n.time>=Dc?(this.root.remove(n.group),this.buildings.delete(n.id),this.sync(this.board,-1,0,!0),!1):!0}),this.builds=this.builds.filter(n=>{const s=n.time;if(n.time=Math.min(as,n.time+e),n.group.visible=n.time>=Zs,n.time<Zs)return!0;s<1.42&&n.time>=1.42&&this.burst(n.id);const r=Tn(n.time,Zs,as),a=Math.sin(Math.PI*r)*.14,o=["house","manor","store","lumber","fisher"].includes(n.kind)?sa:["berry","farm"].includes(n.kind)?.75:1;return n.group.scale.set(Math.max(.01,(r+a)*o),Math.max(.01,(r+a*1.6)*o),Math.max(.01,(r+a)*o)),n.group.position.y=te-.24*(1-r),n.kind==="berry"&&n.group.children.forEach(l=>{if(l.userData.plantOrder!==void 0){const c=Tn(n.time,Zs+l.userData.plantOrder*.018,as);l.scale.setScalar(Math.max(.01,c))}}),n.time>=as&&this.villagers.refreshNavigation(),n.time<as}),this.villagers.update(document.hidden?0:e),this.villagers.updateStatuses(this.cameraControl.camera,this.el.clientWidth,this.el.clientHeight);for(const[n,s]of this.woodHits){const r=s-e;n.rotation.x=Math.sin(r*45)*.035*Math.max(0,r/.2),r<=0?(n.rotation.x=0,this.woodHits.delete(n)):this.woodHits.set(n,r)}for(const[n,s]of this.treeCycles){if(!this.board.has(s.id)){this.updateLoader(n,99),this.treeCycles.delete(n);continue}s.age+=e,this.updateLoader(n,s.age),s.age<.6?(s.tree.rotation.z=Tn(s.age,0,.6)*1.5,s.tree.scale.copy(s.scale).multiplyScalar(1-.12*s.age/.6)):s.age<26?s.tree.visible=!1:(s.tree.visible=!0,s.tree.rotation.z=0,s.tree.scale.copy(s.scale).multiplyScalar(Math.max(.01,Tn(s.age,26,30)))),s.age>=30&&(s.tree.scale.copy(s.scale),this.treeCycles.delete(n))}for(const[n,s]of this.fields){if(!this.board.has(n)){this.updateLoader(`field:${n}`,99),this.fields.delete(n);continue}const r=this.board.get(n),a=30;s.stock===0&&(s.age+=e,this.updateLoader(`field:${n}`,s.age),s.age>=a&&(s.stock=s.max,s.age=0));const o=[...this.harvestParts.values()].filter(h=>h.id===n).reduce((h,u)=>h+u.progress,0),l=s.stock===0?Tn(s.age,a-4,a):Math.max(0,(s.stock-o)/s.max),c=this.buildings.get(n)?.children.filter(h=>h.userData.plantOrder!==void 0||h.userData.cropOrder!==void 0||h.userData.flowerOrder!==void 0)??[];c.forEach((h,u)=>{const d=Zt.clamp(l*c.length-u,0,1);r==="farm"?h.scale.y=.08+.92*d:h.children.slice(1).forEach(f=>f.scale.setScalar(Math.max(.01,d)))})}this.motes=this.motes.filter(n=>(n.life-=e*1.65,n.velocity.y-=e*2.7,n.mesh.position.addScaledVector(n.velocity,e),n.mesh.scale.setScalar(Math.max(0,n.life)),n.life<=0&&this.scene.remove(n.mesh),n.life>0)),this.rings=this.rings.filter(n=>{n.time+=e*1.65,n.mesh.scale.setScalar(.4+n.time*1.15);const s=n.mesh.material;return s.opacity=Math.max(0,1-n.time)*.7,n.time>=1&&(this.scene.remove(n.mesh),s.dispose()),n.time<1}),this.labels=this.labels.filter(n=>{if(n.delay>0)return n.delay-=e,!0;n.life-=e,n.position.y+=e*.38;const s=this.projection.copy(n.position).project(this.cameraControl.camera);return n.el.style.left=`${(s.x+1)*.5*this.el.clientWidth}px`,n.el.style.top=`${(1-s.y)*.5*this.el.clientHeight}px`,n.el.style.opacity=String(Math.max(0,Math.min(1,n.life*2.8))),n.life<=0&&n.el.remove(),n.life>0}),this.renderer.render(this.scene,this.cameraControl.camera)};thumbnails(){const t={},e=new sl;e.add(new hl(16774109,8557944,1.65));const n=new fl(16769464,2.55);n.position.set(-3,5,4),e.add(n);const s=new vr(-.96,.96,.75,-.75,.1,20);s.position.set(2.9,2.25,3.7),s.lookAt(0,.43,0);const r=new Hl({alpha:!0,antialias:!0});r.setSize(280,220),r.toneMapping=pa;for(const a of Bn){const o=ar(a.id);_e(o,new Ue(.72,.75,.068,6),10336124,0,-.034,0),e.add(o),r.render(e,s),t[a.id]=r.domElement.toDataURL(),e.remove(o)}return r.dispose(),r.forceContextLoss(),t}}class Vg{constructor(t,e){this.hand=t,this.callbacks=e;const n={signal:this.listeners.signal};t.addEventListener("pointerdown",this.onDown,n),window.addEventListener("pointermove",this.onMove,{...n,passive:!1}),window.addEventListener("pointerup",this.onUp,n),window.addEventListener("pointercancel",this.onPointerCancel,n),t.addEventListener("lostpointercapture",this.onLostCapture,n),t.addEventListener("click",this.onClick,{...n,capture:!0}),t.addEventListener("dragstart",this.onNativeDrag,n),window.addEventListener("keydown",this.onKey,n),window.addEventListener("blur",this.onBlur,n),document.addEventListener("visibilitychange",this.onVisibility,n)}hand;callbacks;gesture=null;listeners=new AbortController;settling=new Set;disposed=!1;animationFrame=0;cardFrom(t){if(!(t instanceof Element))return null;const e=t.closest("[data-card]");return e&&this.hand.contains(e)?e:null}isAvailable(t,e){return Number.isInteger(e)&&!t.matches(':disabled, [disabled], [aria-disabled="true"]')&&this.callbacks.canStart(e)}onDown=t=>{if(this.disposed||this.gesture||!t.isPrimary||t.button!==0)return;const e=this.cardFrom(t.target);if(!e)return;const n=Number(e.dataset.card);if(!this.isAvailable(e,n))return;const s=e.getBoundingClientRect(),r=e.offsetWidth||s.width,a=e.offsetHeight||s.height;this.gesture={pointerId:t.pointerId,index:n,source:e,origin:s,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,width:r,height:a,anchorX:Math.min(1,Math.max(0,(t.clientX-s.left)/s.width)),anchorY:Math.min(1,Math.max(0,(t.clientY-s.top)/s.height)),started:!1,valid:!1,ghost:null,visualX:t.clientX,visualY:t.clientY,tilt:0,visualTilt:0},t.preventDefault();try{this.hand.setPointerCapture(t.pointerId)}catch{}};onMove=t=>{const e=this.gesture;if(!(!e||t.pointerId!==e.pointerId)){if(t.preventDefault(),!e.started){if(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)<4)return;if(!this.isAvailable(e.source,e.index)){this.cancel();return}e.started=!0,e.visualX=t.clientX,e.visualY=t.clientY;const n=e.source.cloneNode(!0);n.removeAttribute("id"),n.removeAttribute("data-card"),n.removeAttribute("aria-pressed"),n.querySelectorAll("[id]").forEach(s=>s.removeAttribute("id")),n.classList.remove("selected","drag-source"),n.classList.add("drag-card"),n.setAttribute("aria-hidden","true"),n.setAttribute("inert",""),n.tabIndex=-1,Object.assign(n.style,{position:"fixed",left:"0",top:"0",margin:"0",width:`${e.width}px`,height:`${e.height}px`,pointerEvents:"none",zIndex:"100",transition:"none",transformOrigin:"50% 50%",willChange:"transform"}),e.ghost=n,document.body.append(n),document.body.classList.add("is-dragging"),this.callbacks.start(e.index),this.hand.querySelector(`[data-card="${e.index}"]`)?.classList.add("drag-source"),e.source.classList.add("drag-source"),this.follow(e,performance.now())}this.gesture===e&&(e.valid=this.callbacks.move(t.clientX,t.clientY),e.ghost?.classList.toggle("drop-valid",e.valid),e.ghost?.classList.toggle("drop-invalid",!e.valid),e.tilt=Math.max(-7,Math.min(7,(t.clientX-e.lastX)*.22)),e.lastX=t.clientX,e.lastY=t.clientY)}};follow(t,e){if(this.gesture!==t||!t.ghost)return;const n=performance.now(),s=Math.min(.05,Math.max(.001,(n-e)/1e3)),r=1-Math.exp(-38*s);t.visualX+=(t.lastX-t.visualX)*r,t.visualY+=(t.lastY-t.visualY)*r,t.visualTilt+=(t.tilt-t.visualTilt)*(1-Math.exp(-22*s)),t.tilt*=Math.exp(-12*s),t.ghost.style.transform=this.followTransform(t),this.animationFrame=requestAnimationFrame(()=>this.follow(t,n))}followTransform(t){const n=t.visualX-t.width*(.5+(t.anchorX-.5)*.84),s=t.visualY-t.height*(.5+(t.anchorY-.5)*.84);return`translate3d(${n}px, ${s}px, 0) rotate(${t.visualTilt}deg) scale(${.84})`}onUp=t=>{const e=this.gesture;if(!e||t.pointerId!==e.pointerId||(!e.started&&Math.hypot(t.clientX-e.startX,t.clientY-e.startY)>=4&&this.onMove(t),this.gesture!==e))return;if(this.release(e),!e.started){this.isAvailable(e.source,e.index)&&this.callbacks.tap(e.index);return}e.lastX=t.clientX,e.lastY=t.clientY;const s=this.callbacks.move(t.clientX,t.clientY)&&this.callbacks.drop(t.clientX,t.clientY);s||this.callbacks.cancel(),this.settle(e,s)};release(t){this.gesture=null,cancelAnimationFrame(this.animationFrame),this.animationFrame=0,document.body.classList.remove("is-dragging"),t.source.classList.remove("drag-source"),this.hand.querySelectorAll(".drag-source").forEach(e=>e.classList.remove("drag-source")),this.hand.hasPointerCapture(t.pointerId)&&this.hand.releasePointerCapture(t.pointerId)}settle(t,e){const n=t.ghost;if(!n)return;if(e){n.remove();return}n.classList.remove("drop-valid","drop-invalid"),this.settling.add(n);const r=this.hand.querySelector(`[data-card="${t.index}"]`)?.getBoundingClientRect()??t.origin,a=r.left+(r.width-t.width)/2,o=r.top+(r.height-t.height)/2,l=e?`translate3d(${t.lastX-t.width/2}px, ${t.lastY-t.height/2}px, 0) scale(.15)`:`translate3d(${a}px, ${o}px, 0) rotate(0deg) scale(1)`,c=matchMedia("(prefers-reduced-motion: reduce)").matches?0:e?180:280;n.animate([{transform:n.style.transform||this.followTransform(t),opacity:1},{transform:l,opacity:e?0:.2}],{duration:c,easing:"cubic-bezier(.2,.8,.25,1)",fill:"forwards"}).finished.catch(()=>{}).then(()=>{n.remove(),this.settling.delete(n)})}cancel(){const t=this.gesture;t&&(this.release(t),t.started&&(this.callbacks.cancel(),this.settle(t,!1)))}onClick=t=>{const e=this.cardFrom(t.target);if(e&&(t.preventDefault(),t.stopImmediatePropagation(),t.detail===0&&!this.gesture)){const n=Number(e.dataset.card);this.isAvailable(e,n)&&this.callbacks.tap(n)}};onNativeDrag=t=>{t.preventDefault()};onPointerCancel=t=>{t.pointerId===this.gesture?.pointerId&&this.cancel()};onLostCapture=t=>{t.pointerId===this.gesture?.pointerId&&this.cancel()};onKey=t=>{t.key==="Escape"&&this.gesture&&(t.preventDefault(),this.cancel())};onBlur=()=>{this.cancel()};onVisibility=()=>{document.hidden&&this.cancel()};dispose(){this.cancel(),this.disposed=!0,this.listeners.abort(),this.settling.forEach(t=>{t.getAnimations().forEach(e=>e.cancel()),t.remove()}),this.settling.clear()}}const jl={hover:[["card-slide-1","card-slide-3"],.16],lift:[["card-fan-1","card-fan-2"],.39],drop:[["card-place-1","card-place-3"],.45],earth:[["footstep_grass_001","footstep_grass_003"],.46],build:[["impactWood_light_000","impactWood_light_003"],.33],reward:[["chip-lay-2"],.22],bonus:[["chips-stack-3"],.3],turn:[["card-shove-2"],.2],invalid:[["impactSoft_medium_002"],.27]},Kl=i=>Math.max(0,Math.min(1,i));class Wg{muted=!1;levels={master:.72,sfx:.7,ambience:.36};ctx=null;buses={};wave=null;clips=new Map;live=new Set;pending=new Set;lastHover=0;constructor(){try{const e=JSON.parse(localStorage.getItem("lk-audio-v2")||"{}");this.muted=typeof e.muted=="boolean"?e.muted:localStorage.getItem("lk-mute")==="1";for(const n of Object.keys(this.levels))Number.isFinite(e[n])&&(this.levels[n]=Kl(e[n]))}catch{}const t=()=>this.unlock();window.addEventListener("pointerdown",t,{passive:!0}),window.addEventListener("keydown",t),document.addEventListener("visibilitychange",()=>{document.hidden?(this.wave?.pause(),this.cancel()):this.apply()})}unlock(){if(window.AudioContext){if(!this.ctx){this.ctx=new AudioContext;const t=this.ctx.createGain();t.connect(this.ctx.destination),this.buses.master=t;for(const s of["sfx","ambience"]){const r=this.ctx.createGain();r.connect(t),this.buses[s]=r}const e=new Audio(new URL("audio/shore.mp3",document.baseURI).href);e.preload="none",e.loop=!0,this.wave=e,this.ctx.createMediaElementSource(e).connect(this.buses.ambience);const n=new Set(Object.values(jl).flatMap(([s])=>[...s]));for(const s of n)fetch(new URL("audio/"+s+".ogg",document.baseURI)).then(r=>{if(!r.ok)throw Error(s);return r.arrayBuffer()}).then(r=>this.ctx.decodeAudioData(r)).then(r=>this.clips.set(s,r)).catch(()=>{});this.apply()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{}),this.wave?.paused&&!this.muted&&!document.hidden&&this.levels.ambience*this.levels.master>0&&this.wave.play().catch(()=>{})}}set(t,e){this.levels[t]=Kl(e),this.apply(),this.save()}toggle(){this.muted=!this.muted,this.apply(),this.save()}save(){try{localStorage.setItem("lk-audio-v2",JSON.stringify({...this.levels,muted:this.muted}))}catch{}}apply(){if(this.ctx){for(const t of["master","sfx","ambience"]){const e=t==="master"&&this.muted?0:this.levels[t];this.buses[t]?.gain.setTargetAtTime(e*e,this.ctx.currentTime,.035)}this.muted||document.hidden||!this.levels.ambience||!this.levels.master?this.wave?.pause():this.wave?.paused&&this.wave.play().catch(()=>{})}}play(t){if(this.muted||document.hidden||!this.ctx||this.ctx.state!=="running"||this.live.size>=3)return;if(t==="hover"){if(performance.now()-this.lastHover<160)return;this.lastHover=performance.now()}const[e,n]=jl[t],s=this.clips.get(e[Math.floor(Math.random()*e.length)]);if(!s)return;const r=this.ctx.createBufferSource();r.buffer=s,r.playbackRate.value=.92+Math.random()*.1;const a=this.ctx.createGain();a.gain.value=n*(.9+Math.random()*.13),r.connect(a).connect(this.buses.sfx),r.onended=()=>{this.live.delete(r),r.disconnect(),a.disconnect()},this.live.add(r),r.start()}sequence(t,e,n){this.cancel(),this.play("drop");const s=(r,a)=>{const o=window.setTimeout(()=>{this.pending.delete(o),this.play(r)},a);this.pending.add(o)};t||s("earth",145),e&&s("build",325),s(n?"bonus":"reward",520),s("turn",855)}cancel(){for(const t of this.pending)clearTimeout(t);this.pending.clear()}}const Xg={wood:"M4 15 13 5c2-2 7 0 7 3l-9 11M4 15c2-3 7 0 7 3s-5 3-7 0c-1-1-1-2 0-3Zm9-5 3-3",fish:"M3 12c5-7 11-7 15 0-4 7-10 7-15 0Zm15 0 4-5v10ZM7 11h.1",berry:"M7 7c-7 4-2 12 5 14 7-2 12-10 5-14ZM7 7l5 2 5-2-3-2-2-3-2 3ZM8 12h.1m7-1h.1m-4 5h.1",wheat:"M12 22V4m0 6C4 11 4 7 5 3c4 1 7 3 7 7Zm0 5c7 0 8-4 7-8-4 1-7 3-7 8Zm0 4c-6 0-8-3-7-7 4 1 6 3 7 7Z",food:"M6 21 18 4M10 16c-5 0-6-4-6-7 5 1 7 4 6 7Zm3-5c-3-1-4-4-3-7 3 1 4 4 3 7Zm0 3c4-4 6-4 9-4-1 4-5 6-9 4Z",people:"M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0ZM4 21v-3a8 8 0 0 1 16 0v3M8 18v3m8-3v3",happy:"M12 20S3 14 3 8c0-5 6-6 9-1 3-5 9-4 9 1 0 6-9 12-9 12Z",crest:"M4 12 2 6l6 3 4-7 4 7 6-3-2 6-1 4H5ZM7 20h10",help:"M9 8c0-4 7-4 7 0 0 3-4 3-4 6m0 3v1",reset:"M4 10a8 8 0 1 1 1 8M4 4v6h6"},Rn=i=>`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${Xg[i]}"/></svg>`,So=document.querySelector("#app");So.innerHTML=`<div id="world" aria-label="Kartlarla genişleyen altıgen kıyı adası"></div>
 <div class="vignette"></div>
 <div class="kingdom-hud" aria-label="Krallığın kaynakları"><div id="stats" aria-label="Krallığın kaynakları"></div></div>
 <div id="log" role="status"></div><div id="placement" aria-live="polite"></div>
 <button id="event-target" hidden>Anlık etkiyi burada kullan</button><div class="hand-wrap"><div class="hand-label"><i></i><span>Bir kartı adaya sürükle</span><i></i></div><div id="hand"></div></div>
 <div class="tools"><button id="help" aria-label="Oyun rehberi" title="Oyun rehberi">${Rn("help")}</button><button id="restart" title="Yeni krallık" aria-label="Yeni krallık">${Rn("reset")}</button></div>
 <section id="tile-editor" hidden aria-label="Yerleşimi düzenle"><div class="tile-editor-heading"><strong></strong><button data-tile-close aria-label="Düzenlemeyi kapat">×</button></div><small></small><div id="storage-upgrade" hidden><div><span id="storage-meter"></span><button id="upgrade-store"></button></div><progress id="storage-progress" value="0" max="1" aria-label="Depo kapasitesi"></progress></div><div class="tile-editor-actions"><button data-tile-left aria-label="Yerleşimi sola döndür">↶ Döndür</button><button data-tile-right aria-label="Yerleşimi sağa döndür">Döndür ↷</button><button data-tile-delete>Yık ve sil</button></div></section>
 <button id="population-toggle" aria-expanded="false" aria-controls="work-panel">${Rn("people")}<span>Görevler</span><b id="population-badge">1</b></button>
 <section id="work-panel" hidden aria-label="Nüfus görev dağılımı"><header><strong>İş öncelikleri</strong><button data-work-balance>Dengele</button><button data-work-close aria-label="Kapat">×</button></header><p id="work-summary"></p><div id="work-rows"></div></section>
 <aside id="food-details" hidden role="tooltip"></aside>
 <aside id="tile-tooltip" hidden><strong></strong><div></div></aside><dialog></dialog>`;const At=i=>So.querySelector(i),hi=At("#hand"),gr=At("#placement"),or=At("#log"),tn=At("dialog"),Yt=new Gg(At("#world")),Yg=Yt.thumbnails(),nn=new Wg;let yt=new ec,De=null,Yi,ja,qi=!1,Bi=null,ys=-1;function bo(i){return i.cost<=yt.wood&&(i.id!=="festival"||yt.food>=3)}function Wn(i,t=!1){i||(Bi=null),De=i,At("#event-target").hidden=!i?.event,Yt.setSelection(i,t),hi.classList.toggle("choosing",!!i),hi.querySelectorAll("[data-card]").forEach(e=>{const n=!!i&&yt.hand[Number(e.dataset.card)]===i;e.classList.toggle("selected",n),e.setAttribute("aria-pressed",String(n))}),At(".hand-label span").textContent=i?i.event?"Adanın üzerine bırak":"Kıyıya bırak · Tekerlek / R ile döndür":"Bir kartı adaya sürükle"}function ls(i){gr.textContent=i,gr.hidden=!i}Yt.valid=i=>!!De&&i>=0&&yt.valid(De,i);Yt.onHover=i=>{if(!De||i<0){ls("");return}if(!Yt.valid(i)){ls(De.event?"Mevcut karaya bırak":yt.wouldSealFishery(i)?"Balıkçının son kıyısı açık kalmalı":"Yalnızca kıyıdaki boş bir altıgene bırak"),gr.dataset.valid="false";return}if(gr.dataset.valid="true",De.event){ls(De.desc);return}const t=yt.preview(De,i),e=[t.wood&&`+${t.wood} odun / teslimat`,t.food&&`+${t.food} yiyecek / teslimat`,t.happy&&`+${t.happy} refah / teslimat`,t.people&&`+${t.people} nüfus`].filter(Boolean),n=t.localBonus||t.neighbors.length>0;ls((n?"Komşuluk · ":"")+(e.join("  ·  ")||"Yerleşime uygun"))};function Nc(i){clearTimeout(ja),or.textContent=i,or.classList.add("visible"),ja=window.setTimeout(()=>or.classList.remove("visible"),2400)}function Mr(i){if(!De||i<0||!Yt.valid(i))return!1;if(qi)return Bi=i,Yt.holdSelection(),ls("Ada hazırlanıyor…"),!0;const t=Yt.placementRotation,e=De,n=yt.preview(e,i);return yt.play(e,i)?(qi=!0,nn.sequence(!!e.event,["house","manor","store","lumber"].includes(e.id),n.localBonus||n.neighbors.length>0),Wn(null),Yt.sync(yt.board,e.event?-1:i,t),e.event&&Yt.burst(i),To(),Nc(e.event?`${e.name} uygulandı`:`${e.name} · yerleşim hazırlanıyor`),hi.animate([{opacity:.35,transform:"translateY(17px)"},{opacity:1,transform:"translateY(0)"}],{duration:330,easing:"ease-out"}),clearTimeout(Yi),Yi=window.setTimeout(Eo,2e3),!0):!1}function Eo(){if(Yt.placing){Yi=window.setTimeout(Eo,100);return}if(qi=!1,Bi!==null){const i=Bi;Bi=null,Mr(i)}}Yt.onTileSelect=i=>{ys=i;const t=At("#tile-editor");if(t.hidden=i<0,i<0){At("#storage-upgrade").hidden=!0;return}At("#tile-editor strong").textContent=i===ie?"Krallık merkezi":Bn.find(n=>n.id===yt.board.get(i))?.name??"Yerleşim",At("#tile-editor small").textContent=i===ie?"Merkez korunur · R / tekerlek ile döndür":"R / tekerlek · Silmede kaynak iadesi yok";const e=At("[data-tile-delete]");e.disabled=i===ie,e.title=i===ie?"Krallık merkezi silinemez":"Yapı ve toprak denize çöker",wo()};function wo(){const i=At("#storage-upgrade"),t=ys;if(i.hidden=!yt.storageStocks.has(t),i.hidden)return;const e=yt.storageUsed(t),n=yt.storageCapacity(t),s=yt.upgradeCost(t);At("#storage-meter").textContent=`Depo ${yt.storageLevels.get(t)} · ${e} / ${n}`;const r=At("#storage-progress");r.max=n,r.value=e;const a=At("#upgrade-store");a.innerHTML=`Yükselt ${Rn("wood")} ${s}`,a.disabled=yt.wood<s,a.title=`Kapasite +${t===ie?80:60}`}At("#upgrade-store").onclick=()=>{yt.upgradeStore(ys)&&(Yt.burst(ys),br(),wo(),nn.play("build"))};At("[data-tile-left]").onclick=()=>Yt.rotateSelection(-1);At("[data-tile-right]").onclick=()=>Yt.rotateSelection(1);At("[data-tile-close]").onclick=()=>Yt.editTile(-1);At("[data-tile-delete]").onclick=()=>{const i=ys;Yt.placing||!yt.remove(i)||(qi=!0,yr.cancel(),Wn(null),Yt.demolish(yt.board,i),To(),Nc("Yerleşim kaldırıldı · kaynak iadesi yok"),clearTimeout(Yi),Yi=window.setTimeout(Eo,1500))};Yt.onPick=Mr;At("#event-target").onclick=()=>{De?.event&&Mr(ie)};function Zl(i,t){return De?.event&&document.elementFromPoint(i,t)?.closest("#event-target")?ie:Yt.point(i,t)}hi.addEventListener("pointerover",i=>{const t=i.target.closest("button");t&&!t.disabled&&!t.contains(i.relatedTarget)&&!qi&&!De&&nn.play("hover")});const yr=new Vg(hi,{canStart:i=>Bi===null&&!tn.open&&!!yt.hand[i]&&bo(yt.hand[i]),start:i=>{nn.play("lift"),Wn(yt.hand[i],!0)},move:(i,t)=>Yt.valid(Zl(i,t)),drop:(i,t)=>Mr(Zl(i,t)),cancel:()=>{nn.play("invalid"),Wn(null)},tap:i=>{const t=yt.hand[i];Wn(De===t?null:t)}}),Jl={wood:"Odun",berry:"Çilek",farm:"Buğday",fish:"Balık"},qg={wood:"wood",berry:"berry",farm:"wheat",fish:"fish"};At("#work-rows").innerHTML=fs.map(i=>`<label class="work-row" data-work="${i}"><span>${Rn(qg[i])}<b>${Jl[i]}</b><small></small><em></em></span><input type="range" min="0" max="100" value="${yt.priorities[i]}" aria-label="${Jl[i]} iş önceliği" data-priority="${i}"></label>`).join("");function Sr(){const i=Yt.villagers.assignedCounts(),t=yt.workTargets();At("#population-badge").textContent=String(yt.people),At("#work-summary").textContent=`${Yt.villagers.working} çalışıyor · ${Math.max(0,yt.people-Yt.villagers.working)} boşta`;for(const e of fs){const n=At(`[data-work="${e}"]`),s=n.querySelector("input");document.activeElement!==s&&(s.value=String(yt.priorities[e])),n.querySelector("small").textContent=`${i[e]} / ${t[e]} kişi`,n.querySelector("em").textContent=`%${yt.priorities[e]}`,n.classList.toggle("inactive",![...yt.board.keys()].some(r=>yt.categoryFor(r)===e))}}function Fc(){const i=At("#work-panel");i.hidden=!i.hidden,At("#population-toggle").setAttribute("aria-expanded",String(!i.hidden)),Sr()}At("#population-toggle").onclick=Fc;At("[data-work-close]").onclick=()=>{At("#work-panel").hidden=!0,At("#population-toggle").setAttribute("aria-expanded","false")};At("[data-work-balance]").onclick=()=>{yt.priorities={wood:25,berry:25,farm:25,fish:25},Yt.villagers.rebalance(),Sr()};So.querySelectorAll("[data-priority]").forEach(i=>i.oninput=()=>{yt.setPriority(i.dataset.priority,Number(i.value)),Yt.villagers.rebalance(),Sr()});function Oc(){const i=At("#food-details");i.innerHTML=["berry","wheat","fish"].map(t=>`<span>${Rn(t)}<small>${t==="berry"?"Çilek":t==="wheat"?"Buğday":"Balık"}</small><b>${yt.foods[t]}</b></span>`).join("")+`<em>−${yt.foodPerMinute} / dk · ${yt.people} sakin</em>`}function Ql(){const i=At("#food-details"),t=At('[data-resource="food"]').getBoundingClientRect();Oc(),i.hidden=!1,i.style.left=`${Math.max(12,Math.min(innerWidth-i.offsetWidth-12,t.left+t.width/2-i.offsetWidth/2))}px`,i.style.top=`${t.bottom+14}px`}function br(){const i=At("#stats");i.children.length||(i.innerHTML=[["wood","Odun"],["food","Yiyecek"],["people","Nüfus"],["happy","Refah"]].map(([e,n])=>`<div class="resource" data-resource="${e}">${Rn(e)}<div><small>${n}</small><b>0</b></div><em></em></div>`).join(""));const t=At('[data-resource="food"]');t.onmouseenter=Ql,t.onmouseleave=()=>At("#food-details").hidden=!0,t.onfocus=Ql,t.onblur=()=>At("#food-details").hidden=!0,t.tabIndex=0,t.setAttribute("aria-describedby","food-details"),At('[data-resource="people"]').onclick=Fc;for(const e of["wood","food","people","happy"])At(`[data-resource="${e}"] b`).textContent=String(e==="happy"?Math.round(yt.happy):yt[e]),At(`[data-resource="${e}"] em`).textContent=e==="people"?`${Yt.villagers.working}/${yt.people} çalışıyor`:e==="happy"?"Köyün ruhu":e==="food"?`−${yt.foodPerMinute}/dk`:"Depoda";hi.querySelectorAll("[data-card]").forEach(e=>{const n=yt.hand[Number(e.dataset.card)];e.disabled=!n||!bo(n)}),Sr(),wo(),At("#food-details").hidden||Oc()}function To(){br(),hi.innerHTML=yt.hand.map((i,t)=>`<button class="card tone-${i.id}" data-card="${t}" aria-pressed="false" ${bo(i)?"":"disabled"}>
    <span class="cost" title="${i.cost} odun">${Rn("wood")}${i.cost}</span><span class="type">${i.event?"ANLIK":i.workers?"ÜRETİM":"YERLEŞİM"}</span>
    <img src="${Yg[i.id]}" alt="" draggable="false"><strong>${i.name}</strong><span class="rule"></span><span class="effect">${i.desc}</span><small>${i.bonus}</small>
  </button>`).join("")}Yt.onDelivery=(i,t,e,n)=>{const s=yt.deliver(i,t,e,n);if(!s)return 0;br(),nn.play("reward");const r=At(`[data-resource="${e}"]`),a=r.getBoundingClientRect(),o=Yt.screenPoint(t,.6),l=document.createElement("div");l.className=`delivery-spark ${e}`,l.innerHTML=`${Rn(e==="food"?yt.board.get(i)==="fisher"?"fish":yt.board.get(i)==="farm"?"wheat":"berry":e)}<b>+${s}</b>`,document.body.append(l);const c=a.left+a.width/2,h=a.top+a.height/2;return l.animate([{transform:`translate(${o.x}px,${o.y}px) scale(.7)`,opacity:0},{transform:`translate(${o.x}px,${o.y-25}px) scale(1)`,opacity:1,offset:.2},{transform:`translate(${c}px,${h}px) scale(.5)`,opacity:0}],{duration:950,easing:"cubic-bezier(.3,.65,.3,1)"}).finished.catch(()=>{}).then(()=>l.remove()),r.animate([{transform:"scale(1)",backgroundColor:"transparent"},{transform:"scale(1.10)",backgroundColor:"#d8e6b4"},{transform:"scale(1)",backgroundColor:"transparent"}],{duration:650}),s};Yt.onInspect=(i,t,e,n)=>{const s=At("#tile-tooltip");if(i<0||!n||De||tn.open){s.hidden=!0;return}const r=yt.board.get(i),a=Bn.find(_=>_.id===r),o=yt.productAt(i),l=[];i===ie?l.push("Merkez deposu · 2 altıgen",`${yt.storageUsed(i)} / ${yt.storageCapacity(i)} dolu`):r==="store"?l.push(`${cs} altıgen yarıçap`,`${yt.storageUsed(i)} / ${yt.storageCapacity(i)} dolu`,"Tıkla · kapsam ve yükseltme"):o?l.push(`+${o.amount} ${o.resource==="wood"?"odun":o.resource==="food"?r==="fisher"?"balık":r==="farm"?"buğday":"çilek":"refah"} / teslimat`,`${Yt.villagers.assignedTo(i)} / ${o.capacity} çalışan`,yt.storageFor(i).length?"Depo kapsamında":"Depo kapsamı dışında"):r==="house"||r==="manor"?l.push(`${yt.residents.filter(_=>_.home===i).length} sakinin evi`,"Sakinler yakındaki işlere yürüyerek gider"):r==="lumber"?l.push("Komşu ormanlara +2 odun","Oduncular komşu ormanlarda çalışır"):a&&l.push(a.desc,a.bonus),s.querySelector("strong").textContent=i===ie?"Krallık merkezi":a?.name??"Yerleşim",s.querySelector("div").innerHTML=l.map(_=>`<span>${_}</span>`).join(""),s.hidden=!1;const c=s.offsetWidth,h=s.offsetHeight,u=14;let d=t+26,f=e+22;d<n.right+8&&d+c>n.left-8&&f<n.bottom+8&&f+h>n.top-8&&(d=n.right+u,f=e-h/2),d+c>innerWidth-u&&(d=n.left-c-u,f=e-h/2),d<u&&(d=Math.max(u,Math.min(innerWidth-c-u,t-c/2)),f=n.top-h-u,f<u&&(f=n.bottom+u)),s.style.left=`${Math.max(u,Math.min(innerWidth-c-u,d))}px`,s.style.top=`${Math.max(u,Math.min(innerHeight-h-u,f))}px`};window.setInterval(br,700);function Bc(i){yr.cancel(),Wn(null),tn.innerHTML=i,tn.open||tn.showModal();const t=tn.querySelector("[data-audio]");t&&(t.onclick=()=>{nn.toggle(),t.textContent=nn.muted?"Ses kapalı":"Ses açık"}),tn.querySelectorAll("input[data-level]").forEach(e=>{e.oninput=()=>nn.set(e.dataset.level,Number(e.value)/100)}),tn.querySelector("[data-close]")?.addEventListener("click",()=>tn.close()),tn.querySelector("[data-new]")?.addEventListener("click",()=>{tn.close(),zc()})}function zc(){clearTimeout(Yi),clearTimeout(ja),or.classList.remove("visible"),document.querySelectorAll(".delivery-spark").forEach(i=>i.remove()),At("#food-details").hidden=!0,At("#work-panel").hidden=!0,At("#population-toggle").setAttribute("aria-expanded","false"),yr.cancel(),nn.cancel(),yt=new ec,De=null,qi=!1,Yt.reset(),Yt.sync(yt.board),Yt.bindGame(yt),Wn(null),To()}At("#restart").onclick=()=>Bc("<h1>Yeni krallık?</h1><p>Mevcut koşu sona erecek.</p><button data-new>Yeniden başla</button><button data-close>Oyuna dön</button>");At("#help").onclick=()=>Bc(`<small>YELKEN KOYU</small><h1>Yaşayan bir köy</h1>
 <p>Tur veya süre sınırı yok. Kartları kıyıdaki boş altıgenlere bırak. Her ev iki, büyük ev dört yeni sakin getirir. Boşta kalanlar dolaşır; uygun iş varsa yürüyerek çalışmaya giderler.</p>
 <p>Sakinler ormanda ağaç keser, çilek ve tarladan ürün toplar. Ağaçlar ve meyveler yeniden büyür. Merkez 2, depolar 3 altıgen içindeki kaynakları toplar. Yalnızca depoya ulaşan ürünler kaynaklarına eklenir. Her sakin dakikada 2 yiyecek tüketir; yiyecek göstergesinin üzerine gelerek stokları görebilirsin.</p>
 <p>Sağ alttaki Görevler panelinden odun, çilek, buğday ve balık işlerinin önceliğini değiştirebilirsin. Balıkçı kulübesini kıyıya bakacak şekilde yerleştir.</p>
 <p>Depoyu seçerek veya yerleştirirken toplama alanını görebilirsin. Altıgenin üzerine gelince bilgisi farenin yanında görünür. Tıklayarak döndürebilir ya da yıkabilirsin; yıkım kaynak vermez.</p>
 <p class="controls">Sağ tuş · 360° döndür &nbsp; Orta tuş · kaydır<br>Tekerlek · yakınlaş &nbsp; H · ortala<br>Kart / yapı seçiliyken tekerlek veya R · döndür<br>Shift + R · ters yön &nbsp; Esc · seçimi bırak</p><div class="mixer">${["master","sfx","ambience"].map((i,t)=>`<label>${["Genel ses","Efektler","Kıyı ambiyansı"][t]}<input data-level="${i}" aria-label="${["Genel ses","Efektler","Kıyı ambiyansı"][t]}" type="range" min="0" max="100" value="${Math.round(nn.levels[i]*100)}"></label>`).join("")}</div><button data-audio>Ses ${nn.muted?"kapalı":"açık"}</button><button data-close>Oyuna dön</button>`);document.addEventListener("keydown",i=>{i.key==="Escape"&&!tn.open&&(yr.cancel(),Wn(null))});zc();
