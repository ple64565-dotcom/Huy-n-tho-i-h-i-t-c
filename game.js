import {A} from './assets.js';
import {sfx,music,mute} from './audio.js';
import {play} from './cutscene.js';
const $=i=>document.getElementById(i),wait=ms=>new Promise(r=>setTimeout(r,ms));
let C,H,S,tab='sum',sel=null,last='',B=null,SP=1,muted=false;
const hh=id=>H.find(x=>x.id===id),save=()=>{try{localStorage.setItem('hmg2',JSON.stringify(S))}catch(e){}};
const pic=h=>A.img['spr_'+h.id]?`<img src="${A.img['spr_'+h.id]}" alt="${h.name}">`:h.emoji;
const TK=()=>Object.keys(C.tiers);
function st(h,o){const m=(1+.06*(o.lv-1))*(1+.08*o.star)*C.tiers[h.tier].mult;return{hp:Math.round(h.hp*m),atk:Math.round(h.atk*m),def:Math.round(h.def*m),spd:h.spd}}
export async function init(){
[C,H]=await Promise.all(['data/config.json','data/heroes.json'].map(u=>fetch(u).then(r=>r.json())));
try{S=JSON.parse(localStorage.getItem('hmg2'))}catch(e){}
S=S||{gold:C.start.gold,gems:C.start.gems,pity:0,own:{[H[0].id]:{lv:1,star:0}},team:[H[0].id],stage:1};
document.addEventListener('click',e=>{if(e.target.closest('button,.c'))sfx('click')});
render()}
function head(){$('res').innerHTML=`<span>🪙 ${S.gold}</span><span>💎 ${S.gems}</span><span>Màn ${S.stage}</span><button onclick="G.mute()">${muted?'🔇':'🔊'}</button>`}
function render(){
const k={sum:'summon',ros:'roster',team:'team',bat:'battle'}[tab],bg=$('bg');
bg.dataset.k=k;bg.style.backgroundImage=A.img['bg_'+k]?`url(${A.img['bg_'+k]})`:'';
music(tab==='bat'?'battle':'menu');head();
$('nav').innerHTML=[['sum','Triệu hồi'],['ros','Tướng'],['team','Đội hình'],['bat','Chiến đấu']].map(([a,b])=>`<button class="${tab===a?'on':''}" onclick="G.go('${a}')">${b}</button>`).join('');
$('main').innerHTML={sum:tSum,ros:tRos,team:tTeam,bat:tBat}[tab]();
if(tab==='bat')draw()}
function pull(){
S.pity++;let t=TK()[0];
if(S.pity>=C.pity.count)t=C.pity.tier;else{let r=Math.random()*100,a=0;for(const k of TK()){a+=C.tiers[k].rate;if(r<a){t=k;break}}}
if(t===C.pity.tier)S.pity=0;
const pool=H.filter(x=>x.tier===t),h=pool.length?pool[Math.random()*pool.length|0]:H[0],o=S.own[h.id];let isNew=false;
if(!o){S.own[h.id]={lv:1,star:0};isNew=true}else if(o.star<C.tiers[h.tier].maxStar){o.star++;setTimeout(()=>sfx('star'),700)}else S.gold+=200;
return{h,isNew}}
function sum(n){
const cost=n===10?C.cost.ten:C.cost.one;
if(S.gems<cost){alert('Không đủ 💎');return}
S.gems-=cost;let html='',best=0;sfx('summon');
for(let i=0;i<n;i++){const{h,isNew}=pull();best=Math.max(best,TK().indexOf(h.tier));
html+=`<div class="c ${h.tier}">${pic(h)}<small>${h.name}<br>${h.tier}${isNew?' · MỚI':' · +1★'}</small></div>`}
const bt=TK()[best];setTimeout(()=>sfx('get_'+bt),500);
last=(bt===C.pity.tier?'<div class="ban">Tướng '+bt+' xuất hiện!</div>':'')+`<div class="g">${html}</div>`;save();render()}
function tSum(){return`<div class="p"><h2>Triệu hồi</h2><p>${TK().map(k=>k+' '+C.tiers[k].rate+'%').join(' · ')}<br>Bảo hiểm ${C.pity.tier}: ${S.pity}/${C.pity.count} lượt</p>
<button class="b" onclick="G.sum(1)">Triệu hồi x1 (${C.cost.one}💎)</button><button class="b" onclick="G.sum(10)">x10 (${C.cost.ten}💎)</button>
<button class="b g2" onclick="G.gem()">+500💎 (thử nghiệm)</button><button class="b g2" onclick="G.reset()">Xóa dữ liệu</button></div>${last}`}
function tRos(){let s='';
if(sel&&S.own[sel]){const h=hh(sel),o=S.own[sel],x=st(h,o),b=A.img['hbg_'+h.id];
s+=`<div class="p big" ${b?`style="background-image:url(${b})"`:''}><div class="em">${pic(h)}</div><h2>${h.name} <b class="t">${h.tier}</b></h2>
<p>LV ${o.lv}/100 · ${'★'.repeat(o.star)}${'☆'.repeat(C.tiers[h.tier].maxStar-o.star)}</p><p>❤️ ${x.hp} &nbsp;⚔️ ${x.atk} &nbsp;🛡️ ${x.def} &nbsp;⚡ ${x.spd}</p>
<p>${h.skills.map((k,i)=>`${i?'Tuyệt chiêu':'Kỹ năng'}: ${k.name} ×${k.mult}${k.aoe?' (diện rộng)':''}`).join('<br>')}</p>
<button class="b" onclick="G.up(1)">Nâng cấp (${o.lv*20}🪙)</button><button class="b" onclick="G.up(10)">+10 cấp</button>
<button class="b g2" onclick="G.tog('${h.id}')">${S.team.includes(h.id)?'Rút khỏi đội':'Vào đội'}</button></div>`}
return s+'<div class="g">'+H.map(h=>{const o=S.own[h.id];return o?`<div class="c ${h.tier}" onclick="G.pick('${h.id}')">${pic(h)}<small>${h.name}<br>${h.tier} · LV${o.lv} · ${o.star}★</small></div>`:`<div class="c lock">❓<small>Chưa có · ${h.tier}</small></div>`}).join('')+'</div>'}
function up(n){const o=S.own[sel];let ok=false;for(let i=0;i<n;i++){const c=o.lv*20;if(o.lv>=100||S.gold<c)break;S.gold-=c;o.lv++;ok=true}if(ok)sfx('levelup');save();render()}
function tog(id){const i=S.team.indexOf(id);if(i>=0)S.team.splice(i,1);else if(S.team.length<3){S.team.push(id);sfx('equip')}else alert('Đội đầy (3 tướng)');save();render()}
function tTeam(){let s='<div class="p"><h2>Đội hình</h2><p>Chạm vào tướng để rút khỏi đội. Chọn tướng ở tab Tướng.</p></div><div class="g">';
for(let i=0;i<3;i++){const id=S.team[i];if(id){const h=hh(id);s+=`<div class="c ${h.tier}" onclick="G.tog('${id}')">${pic(h)}<small>${h.name}<br>Vị trí ${i+1}</small></div>`}else s+='<div class="c lock">➕<small>Trống</small></div>'}
return s+'</div>'}
function tBat(){return`<div class="p"><h2>Màn ${S.stage}</h2><button class="b" onclick="G.start()">Bắt đầu</button><button class="b g2" onclick="G.speed()">Tốc độ x${SP}</button></div><div id="bf" class="p"></div><div id="lg" class="p"></div>`}
function start(){
if(B&&B.run)return;if(!S.team.length){alert('Hãy đưa tướng vào đội');return}
const a=S.team.map(id=>{const h=hh(id),s=st(h,S.own[id]);return{n:h.name,e:pic(h),emoji:h.emoji,hp:s.hp,max:s.hp,atk:s.atk,def:s.def,spd:s.spd,rage:0,side:0,h}});
const e=C.enemyBase,sc=1+e.scale*(S.stage-1);
const en=C.enemies.map(x=>({n:x.n,e:x.e,hp:Math.round(e.hp*sc),max:Math.round(e.hp*sc),atk:Math.round(e.atk*sc),def:Math.round(e.def*sc),spd:x.spd,rage:0,side:1}));
B={a,en,q:[],log:[],run:true,round:0};loop()}
const lg=m=>{B.log.push(m);if(B.log.length>40)B.log.shift()};
async function loop(){while(B&&B.run){await step();draw();await wait(700/SP)}}
async function step(){
if(!B.q.length){B.round++;B.q=[...B.a,...B.en].filter(u=>u.hp>0).sort((x,y)=>y.spd-x.spd);lg('— Hiệp '+B.round+' —')}
const u=B.q.shift();if(!u||u.hp<=0)return;
const foes=(u.side?B.a:B.en).filter(x=>x.hp>0);if(!foes.length)return;
let sk={name:'Tấn công',mult:1,aoe:false,sfx:'skill'};
if(u.h){const ult=u.rage>=100;sk=u.h.skills[ult?1:0];if(ult){u.rage=0;draw();await play({emoji:u.emoji},sk)}}
sfx(sk.sfx||'skill');
const tg=sk.aoe?foes:[foes[Math.random()*foes.length|0]];let tot=0,crit=false;
for(const t of tg){const cr=Math.random()<C.crit;crit=crit||cr;const d=Math.max(1,Math.round((u.atk*sk.mult-t.def*.5)*(.9+Math.random()*.2)*(cr?1.5:1)));t.hp=Math.max(0,t.hp-d);t.rage=Math.min(100,t.rage+15);tot+=d;if(t.hp<=0)setTimeout(()=>sfx('die'),300)}
setTimeout(()=>sfx(crit?'crit':'hit'),150);
lg(`${u.n} dùng ${sk.name}${sk.aoe?' (diện rộng)':' lên '+tg[0].n}: -${tot}${crit?' CHÍ MẠNG':''}`);
u.rage=Math.min(100,u.rage+30);
if(!B.en.some(x=>x.hp>0)){const g=C.reward.gold*S.stage;S.gold+=g;S.gems+=C.reward.gems;lg(`Thắng! +${g}🪙 +${C.reward.gems}💎`);S.stage++;B.run=false;save();head();sfx('win')}
else if(!B.a.some(x=>x.hp>0)){lg('Thua. Hãy nâng cấp tướng rồi thử lại.');B.run=false;sfx('lose')}}
function draw(){if(!$('bf')||!B)return;
const row=u=>`<div class="u ${u.hp<=0?'dead':''}"><div class="em">${u.e}</div><div style="flex:1"><div>${u.n} ${u.hp}/${u.max}</div><div class="bar"><i style="width:${u.hp/u.max*100}%"></i></div>${u.h?`<div class="bar r"><i style="width:${u.rage}%"></i></div>`:''}</div></div>`;
$('bf').innerHTML=B.a.map(row).join('')+'<hr>'+B.en.map(row).join('');$('lg').innerHTML=B.log.slice(-8).join('<br>')}
window.G={go:t=>{tab=t;sfx('open');render()},sum,up,tog,start,pick:id=>{sel=id;render()},speed:()=>{SP=SP%3+1;render()},gem:()=>{S.gems+=500;save();render()},
reset:()=>{if(confirm('Xóa toàn bộ dữ liệu?')){localStorage.removeItem('hmg2');location.reload()}},mute:()=>{muted=mute();head()}};
