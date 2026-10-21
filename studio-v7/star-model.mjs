export const RESEARCH='研究启发：Banholzer等，JMIR，2021。参考鼠标移动速度与方向修正的研究，探索操作行为与当下感受之间的联系。本互动尚未经过压力测量效度验证。';
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.t);
// Browser adaptation: normalize canvas coordinates and resample every 20 ms.
// Short game trajectories (0.15–10 s) differ from the paper's 1–10 s office tracks.
export function samplePath(input=[]){const src=input.filter(finite).filter((p,i,a)=>!i||p.t>a[i-1].t);if(src.length<2)return[];const out=[];let j=1;for(let t=src[0].t;t<=src.at(-1).t;t+=20){while(j<src.length-1&&src[j].t<t)j++;const a=src[j-1],b=src[j],u=(t-a.t)/(b.t-a.t);out.push({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,t});if(out.length>501)break;}return out;}
export function summarize({paths=[],device='unknown',attempts=0,hits=0,skipped=false}={}){
 let distance=0,duration=0,pairs=0,same=0,tracks=0;for(const raw of paths){const p=samplePath(raw);if(p.length<8)continue;const sec=(p.at(-1).t-p[0].t)/1000;if(sec<.15||sec>10)continue;let d=0,prev=null,trackPairs=0,trackSame=0;for(let i=1;i<p.length;i++){const dx=p[i].x-p[i-1].x,dy=p[i].y-p[i-1].y;d+=Math.hypot(dx,dy);if(Math.hypot(dx,dy)<.0008)continue;const dir=[Math.abs(dx)<.0004?0:Math.sign(dx),Math.abs(dy)<.0004?0:Math.sign(dy)];if(prev){trackPairs++;if(dir[0]===prev[0]&&dir[1]===prev[1])trackSame++;}prev=dir;}if(d<.01)continue;tracks++;distance+=d;duration+=sec;pairs+=trackPairs;same+=trackSame;}
 const a=Math.max(0,Number(attempts)||0),h=Math.max(0,Math.min(a,Number(hits)||0));return{device,tracks,attempts:a,hits:h,skipped,speed:duration?distance/duration:null,consistency:pairs?same/pairs:null,hitRate:a?h/a:null,valid:!skipped&&tracks>=5&&a>=5&&pairs>=20&&['mouse','touch','pen'].includes(device)};
}
export function compareRounds(a,b){if(!a?.valid||!b?.valid||a.device!==b.device)return{available:false};return{available:true,speedDelta:(b.speed-a.speed)/a.speed,consistencyDelta:b.consistency-a.consistency};}
export function makeObservation(a,b,feelings={}){
 const compare=compareRounds(a,b),out=[];
 if(compare.available){const change=Math.round(Math.abs(compare.speedDelta)*100);out.push(`在相同目标布局下，第二轮的移动速度${change<5?'与第一轮接近':compare.speedDelta>0?`比第一轮快约${change}%`:`比第一轮慢约${change}%`}；方向保持比例从${Math.round(a.consistency*100)}%变为${Math.round(b.consistency*100)}%。这些是本次操作记录，不是心理分数。`);out.push('熟悉玩法、设备灵敏度、姿势和疲劳都可能影响结果。两轮变化不能单独证明压力增加或减轻，也不代表能力好坏。');}
 else out.push('这次没有足够的同设备有效轨迹完成两轮比较。触屏请按住移动；也可以下次在熟悉的设备上重新体验。没有记录到的数据不会补成零分。');
 const v=Number.isInteger(feelings.valence)&&feelings.valence>=1&&feelings.valence<=7?feelings.valence:null;
 const r=Number.isInteger(feelings.arousal)&&feelings.arousal>=1&&feelings.arousal<=7?feelings.arousal:null;
 if(v!==null||r!==null)out.push(`你自己选择的此刻感受：${[v!==null?`愉快程度 ${v}/7`:null,r!==null?`激活程度 ${r}/7（从低沉到亢奋）`:null].filter(Boolean).join('，')}。这是你的主观记录，与操作指标分开呈现。`);else out.push('你没有填写此刻感受。屿安不会用轨迹替你猜测心情。');
 if(v!==null&&v<=3&&r!==null&&r>=5)out.push('你选择了不太愉快、同时比较激活的状态。刚才的游戏无需成为又一件必须做好的事。你可以结束，也可以回到自由星海，把速度和方向重新交给自己；不必追着每一颗光跑。若这种感受持续影响生活，和你信任的人或专业人员谈谈，比独自解读一个操作结果更有帮助。');
 else if(v!==null&&v<=3)out.push('你说此刻不太愉快。这份感受不需要被一个漂亮的轨迹否定，也不需要马上变好。如果想继续，画画心情里可以留下形状；如果不想继续，收下这片星海就可以离开。你有权决定这次体验停在哪里。');
 else if(v!==null&&v>=5)out.push('你选择了较愉快的感受。可以把这一刻留下，今后再看见它时，记起自己曾亲手创造过这样一片光。无论操作快慢，这件作品都属于你，也不需要与别人的比较。');
 else out.push('这一小段时间里，你点击、移动，也留下了只属于这次体验的轨迹。它是一份记录，无需成为对你的评判。想继续时，屿安还在；想结束时，这张海报替你把这一刻收好。');
 out.push('这项互动提供自我观察与艺术表达，不承诺治疗效果，也不能用于判断慢性压力、心理疾病或压力成因。');return out;
}
