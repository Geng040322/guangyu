export const ACTIVITIES=[
{id:'water',title:'给身体一点补给',kind:'照顾',energy:1,minutes:2,steps:['准备一杯自己愿意喝的水','坐稳，按舒服的节奏喝几口']},
{id:'window',title:'去窗边停一会儿',kind:'喜欢',energy:1,minutes:2,steps:['走到安全、方便的窗边，或看向一处光','观察眼前的颜色，不用做任何评价']},
{id:'desk',title:'只整理一小块桌面',kind:'日常',energy:1,minutes:3,steps:['只选手掌大小的一块位置','把这块位置上的一样东西放回去']},
{id:'draw',title:'留三条不必好看的线',kind:'喜欢',energy:1,minutes:2,steps:['拿一张纸或打开画画标签','只画三条线，然后决定要不要继续']},
{id:'walk',title:'换一个位置，慢慢走走',kind:'照顾',energy:2,minutes:5,steps:['选择安全、适合身体状况的小范围路线','按自己的步速走一段，不追求步数']},
{id:'connect',title:'和信任的人建立一点联系',kind:'连接',energy:2,minutes:5,steps:['选一个你愿意联系、也尊重你边界的人','写一句你自己的问候或请求；是否发送由你决定']},
{id:'music',title:'认真听一首喜欢的歌',kind:'喜欢',energy:2,minutes:5,steps:['选一首熟悉、此刻听着舒服的歌','暂停其他事情，留意其中一个声音']},
{id:'task',title:'开始一个小得能做的任务',kind:'必要',energy:3,minutes:5,steps:['只打开需要的材料，不要求完成全部','找出现在能做的第一步，只试五分钟']}
];
const str=(v,n=100)=>Array.from(typeof v==='string'?v:'').slice(0,n).join('');
const num=(v,a,b,f)=>Number.isFinite(v)?Math.max(a,Math.min(b,v)):f;
export function cleanPlan(raw={}){if(!raw||typeof raw!=='object')raw={};return {id:str(raw.id,80)||globalThis.crypto?.randomUUID?.()||String(Date.now()),date:/^\d{4}-\d{2}-\d{2}$/.test(raw.date)?raw.date:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date()),mode:raw.mode==='restart'?'restart':'unburden',items:(Array.isArray(raw.items)?raw.items:[]).filter(x=>x&&typeof x.title==='string').slice(0,8).map((x,i)=>({id:String(i),title:str(x.title,60),bucket:['now','later','outside'].includes(x.bucket)?x.bucket:'unsorted'})),target:str(raw.target),options:(Array.isArray(raw.options)?raw.options:[]).filter(x=>x&&typeof x.title==='string').slice(0,3).map(x=>({title:str(x.title),gain:str(x.gain,80),cost:str(x.cost,80)})),choice:Math.floor(num(raw.choice,0,2,0)),first:str(raw.first),when:str(raw.when,60),place:str(raw.place,60),barrier:str(raw.barrier),backup:str(raw.backup),steps:(Array.isArray(raw.steps)?raw.steps:[]).filter(x=>x&&typeof x.text==='string').slice(0,4).map(x=>({text:str(x.text,80),done:x.done===true})),seconds:num(raw.seconds,60,900,300),energy:Math.floor(num(raw.energy,1,3,1)),elapsed:num(raw.elapsed,0,86400,0),outcome:['did','partly','notyet'].includes(raw.outcome)?raw.outcome:'unknown',help:['yes','same','worse','unsure'].includes(raw.help)?raw.help:'unsure',observed:str(raw.observed,180),adjustment:['smaller','later','support','stop'].includes(raw.adjustment)?raw.adjustment:'smaller',next:str(raw.next,100)};}
export function readyToTry(raw){const p=cleanPlan(raw);return !!(p.target.trim()&&p.first.trim()&&p.when.trim()&&p.place.trim());}
export function clockLeft(seconds,startedAt,now){return Math.max(0,Math.ceil(seconds-(now-startedAt)/1000));}
export function reviewFacts(raw){const p=cleanPlan(raw);return `你选择的行动：${p.first||'尚未确定'}\n实际进展：${({did:'按自己的计划尝试了',partly:'做了一部分',notyet:'还没有开始',unknown:'尚未记录'})[p.outcome]}\n你的体验：${({yes:'有一点帮助',same:'暂时没有变化',worse:'现在更难受',unsure:'还说不清'})[p.help]}`;}
const KEY='guangyu.action-plans.v1';
export function readPlans(storage){try{const r=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(r)?r.filter(x=>x&&typeof x==='object').slice(0,12).map(cleanPlan):[];}catch{return [];}}
export function savePlan(storage,raw){try{const p=cleanPlan(raw);const list=[p,...readPlans(storage).filter(x=>x.id!==p.id)].slice(0,12);storage.setItem(KEY,JSON.stringify(list));return true;}catch{return false;}}
export function removePlan(storage,id){try{storage.setItem(KEY,JSON.stringify(readPlans(storage).filter(x=>x.id!==id)));return true;}catch{return false;}}
