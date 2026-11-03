import {loadManifest,preload,A} from './assets.js';
import {unlock} from './audio.js';
import {init} from './game.js';
const $=i=>document.getElementById(i),wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
await loadManifest();
const tips=A.m.tips;let ti=0;const showTip=()=>{if(tips.length)$('tip').textContent='💡 '+tips[ti++%tips.length]};
showTip();const iv=setInterval(showTip,2500);
await Promise.all([preload(p=>{$('lbar').style.width=p*100+'%';$('pct').textContent=Math.round(p*100)+'%'}),wait(1800)]);
clearInterval(iv);$('lbar').style.width='100%';$('pct').textContent='100%';
const b=$('go');b.hidden=false;
b.onclick=async()=>{unlock();$('load').hidden=true;await init()};
})();
