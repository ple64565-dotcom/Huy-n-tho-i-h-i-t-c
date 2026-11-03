import {A} from './assets.js';
let ctx,cur=null,el=null,muted=false;
const ac=()=>ctx||(ctx=new(window.AudioContext||window.webkitAudioContext)());
export const unlock=()=>{try{ac().resume()}catch(e){}};
const T={click:[[880,.05,'square']],open:[[520,.06,'triangle'],[780,.08,'triangle']],summon:[[300,.15],[450,.15],[700,.3]],
get_C:[[500,.12,'triangle']],get_B:[[500,.1,'triangle'],[650,.14,'triangle']],get_A:[[500,.1,'triangle'],[650,.1,'triangle'],[800,.16,'triangle']],
get_S:[[500,.1],[650,.1],[800,.1],[1000,.25]],get_SS:[[400,.12,'sawtooth'],[600,.12,'sawtooth'],[800,.12,'sawtooth'],[1000,.12,'sawtooth'],[1300,.5,'sawtooth']],
levelup:[[600,.08,'triangle'],[900,.14,'triangle']],star:[[1000,.08],[1400,.2]],equip:[[300,.06,'square'],[400,.08,'square']],
hit:[[180,.08,'sawtooth']],crit:[[260,.06,'sawtooth'],[120,.14,'square']],skill:[[400,.1,'sawtooth'],[700,.14,'sawtooth']],
die:[[300,.15,'sawtooth'],[150,.3,'sawtooth']],win:[[523,.15,'triangle'],[659,.15,'triangle'],[784,.3,'triangle']],
lose:[[400,.2],[300,.2],[200,.4]],ult:[[200,.2,'sawtooth'],[400,.2,'sawtooth'],[800,.4,'sawtooth']]};
function synth(n){if(muted)return;try{const c=ac();let t=c.currentTime;for(const[f,d,w]of T[n]||T.skill){const o=c.createOscillator(),g=c.createGain();o.type=w||'sine';o.frequency.value=f;g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+d);t+=d*.9}}catch(e){}}
export function sfx(n){if(muted)return;const a=A.aud[n];if(a){const b=a.cloneNode();b.volume=.8;b.play().catch(()=>{})}else synth(n)}
export function music(n){if(n===cur)return;cur=n;if(el){el.pause();el=null}const a=A.aud[n];if(a&&!muted){el=a;a.loop=true;a.volume=.6;a.currentTime=0;a.play().catch(()=>{})}}
export const duck=on=>{if(el)el.volume=on?.1:.6};
export function mute(){muted=!muted;if(el)muted?el.pause():el.play().catch(()=>{});return muted}
