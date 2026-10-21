export const RESEARCH='研究启发：Banholzer等，JMIR，2021。参考鼠标移动速度与方向修正的研究，探索操作行为与当下感受之间的联系。本互动尚未经过压力测量效度验证。';
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.t);
// Browser adaptation: normalize canvas coordinates and resample every 20 ms.
// Short game trajectories (0.15–10 s) differ from the paper's 1–10 s office tracks.
export function samplePath(input=[]){const src=input.filter(finite).filter((p,i,a)=>!i||p.t>a[i-1].t);if(src.length<2)return[];const out=[];let j=1;for(let t=src[0].t;t<=src.at(-1).t;t+=20){while(j<src.length-1&&src[j].t<t)j++;const a=src[j-1],b=src[j],u=(t-a.t)/(b.t-a.t);out.push({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,t});if(out.length>501)break;}return out;}
export function summarize({paths=[],device='unknown',attempts=0,hits=0,skipped=false}={}){
 let distance=0,duration=0,pairs=0,same=0,tracks=0,pauses=0,pauseMs=0;for(const raw of paths){const p=samplePath(raw);if(p.length<8)continue;const sec=(p.at(-1).t-p[0].t)/1000;if(sec<.15||sec>10)continue;let d=0,prev=null,trackPairs=0,trackSame=0,still=0,trackPauses=0,trackPauseMs=0;for(let i=1;i<p.length;i++){const dx=p[i].x-p[i-1].x,dy=p[i].y-p[i-1].y;d+=Math.hypot(dx,dy);if(Math.hypot(dx,dy)<.0008){still+=p[i].t-p[i-1].t;continue;}if(still>=200){trackPauses++;trackPauseMs+=still;}still=0;const dir=[Math.abs(dx)<.0004?0:Math.sign(dx),Math.abs(dy)<.0004?0:Math.sign(dy)];if(prev){trackPairs++;if(dir[0]===prev[0]&&dir[1]===prev[1])trackSame++;}prev=dir;}if(d<.01)continue;if(still>=200){trackPauses++;trackPauseMs+=still;}tracks++;pauses+=trackPauses;pauseMs+=trackPauseMs;distance+=d;duration+=sec;pairs+=trackPairs;same+=trackSame;}
 const a=Math.max(0,Number(attempts)||0),h=Math.max(0,Math.min(a,Number(hits)||0));return{device,tracks,attempts:a,hits:h,skipped,pauses:tracks?pauses:null,pauseSeconds:tracks?pauseMs/1000:null,corrections:tracks?pairs-same:null,speed:duration?distance/duration:null,consistency:pairs?same/pairs:null,hitRate:a?h/a:null,valid:!skipped&&tracks>=5&&a>=5&&pairs>=20&&['mouse','touch','pen'].includes(device)};
}
export function compareRounds(a,b){if(!a?.valid||!b?.valid||a.device!==b.device)return{available:false};return{available:true,speedDelta:(b.speed-a.speed)/a.speed,consistencyDelta:b.consistency-a.consistency};}
export function makeObservation(a,b){
 const c=compareRounds(a,b),out=[];
 if(c.available){const change=Math.round(Math.abs(c.speedDelta)*100);out.push(`在相同目标布局下，第二轮的移动速度${change<5?'与第一轮接近':c.speedDelta>0?`比第一轮快约${change}%`:`比第一轮慢约${change}%`}；方向保持比例从${Math.round(a.consistency*100)}%变为${Math.round(b.consistency*100)}%。这些数字直接来自本次轨迹计算。`);}
 else out.push(`这次两轮分别留下${a.tracks}条和${b.tracks}条有效轨迹，尚没有足够的同设备数据完成两轮比较。触屏需要按住移动才能形成连续轨迹；键盘操作、跳过任务或尺寸改变的轮次不参与比较。没有记录到的数据不会补成零分。`);
 const observed=[a,b].filter(s=>s.tracks>0);if(observed.length){const n=observed.reduce((n,s)=>n+s.pauses,0),secs=observed.reduce((n,s)=>n+s.pauseSeconds,0);out.push(`已采集的有效轨迹中，记录到${n}段持续至少200毫秒的低位移片段，合计约${secs.toFixed(1)}秒。这里的“停顿”只描述采集到的动作片段，不代表犹豫、分心或情绪问题。`);}else out.push('本次没有可用于停顿统计的有效轨迹，因此不输出停顿次数。只点击而没有移动时，仍可以完成任务，但不会据此生成动作判断。');
 if(c.available){if(c.speedDelta>.05&&c.consistencyDelta<-.03)out.push('第二轮移动更快，同时方向保持比例下降。这次出现了速度与方向保持比例之间的权衡；它只是操作层面的变化，不能单独解释为紧张或压力。');else if(c.speedDelta<-.05&&c.consistencyDelta>.03)out.push('第二轮移动较慢，同时方向保持比例提高。你为这段轨迹留下了更多移动时间。这个变化可以被记录，但无法说明当时的情绪好坏。');else if(c.speedDelta>.05&&c.consistencyDelta>.03)out.push('第二轮移动更快，同时方向保持比例更高。更熟悉目标布局也可能产生这样的变化，不能据此认定心理状态改善。');else out.push('两轮的速度与方向变化没有呈现上面几种清晰组合。系统保留实际读数，不为这一段动作强行赋予心理类型。');}
 else out.push('屿安会保留能确定的操作记录，不用一段很短的动作替你下结论。这里没有从笔迹猜测压力来源或隐藏情绪的算法。');
 out.push(c.available&&c.speedDelta<-.05?'这一次，后半程的移动速度慢了下来。动作的变化不需要成为另一项成绩：你已经完成了一次尝试，也留下了自己的路线。接下来可以收下海报，让这段体验停在这里；无需为了得到更好看的数字反复重测。':'这一次，你沿着目标留下了自己的路线。无论移动中有多少停顿或转向，这张作品都保留它们。它们是一段经历的形状，不是对你的评价。想结束时，收下海报就可以离开；不需要再完成一项证明自己的任务。');
 out.push('动作会受到设备、姿势、任务熟悉度与疲劳影响。当前短时互动未经压力测量效度验证，不能从这些轨迹判断真实压力水平，也不承诺治疗效果。');return out;
}
