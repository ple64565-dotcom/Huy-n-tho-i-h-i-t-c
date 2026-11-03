export const A={m:{bg:{},sprites:{},heroBg:{},music:{},sfx:{},videos:{},tips:[]},img:{},aud:{}};
export async function loadManifest(){try{Object.assign(A.m,await (await fetch('data/assets.json')).json())}catch(e){}}
const lim=(k,u)=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>{A.img[k]=u;ok()};i.onerror=no;i.src=u});
const lau=(k,u)=>new Promise((ok,no)=>{const a=new Audio();a.preload='auto';a.oncanplaythrough=()=>{A.aud[k]=a;ok()};a.onerror=no;a.src=u});
const tmo=p=>Promise.race([p,new Promise((_,no)=>setTimeout(no,6000))]);
export async function preload(onp){
const m=A.m,j=[];
for(const[k,u]of Object.entries(m.bg))j.push(()=>lim(`bg_${k}`,u));
for(const[k,u]of Object.entries(m.sprites))j.push(()=>lim(`spr_${k}`,u));
for(const[k,u]of Object.entries(m.heroBg))j.push(()=>lim(`hbg_${k}`,u));
for(const g of['music','sfx'])for(const[k,u]of Object.entries(m[g]))j.push(()=>lau(k,u));
let n=0;
await Promise.all(j.map(f=>tmo(f()).catch(()=>{}).then(()=>onp(++n/j.length))));
onp(1)}
