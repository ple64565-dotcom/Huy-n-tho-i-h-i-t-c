import {A} from './assets.js';
import {sfx,duck} from './audio.js';
export function play(h,sk){return new Promise(res=>{
const o=document.getElementById('cut');let done=false;
const end=()=>{if(done)return;done=true;o.hidden=true;o.innerHTML='';duck(false);res()};
o.hidden=false;o.innerHTML='';duck(true);
const skip=document.createElement('button');skip.className='skip';skip.textContent='Bỏ qua';skip.onclick=end;
const fb=()=>{if(done)return;o.innerHTML=`<div class="fx"><div class="big">${h.emoji}</div><div class="nm">${sk.name}</div></div>`;o.appendChild(skip);sfx('ult');setTimeout(end,2400)};
const url=sk.video&&A.m.videos[sk.video];
if(!url)return fb();
const v=document.createElement('video');v.playsInline=true;v.src=url;v.onended=end;v.onerror=fb;
o.append(v,skip);v.play().catch(fb)})}
