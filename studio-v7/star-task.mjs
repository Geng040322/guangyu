import {targetAt,guideAt} from './star-art.mjs?rev=task3';
export const TASKS=[
 {name:'点亮三盏灯',seconds:8,goal:3,verb:'依次点亮金色光点，替屿安打开星海。',say:'跟着金色的光点，点亮三盏灯。',pose:0},
 {name:'连起小星座',seconds:10,goal:5,verb:'依次点击5颗亮星，把它们连成一座星桥。',say:'下一颗星已经亮起。沿着它，一步一步连起来。',pose:3},
 {name:'护送星种',seconds:10,goal:5,verb:'按住起点光球，沿箭头穿过5个光环。',say:'按住发光的起点，再跟着箭头走；松手后从当前光环接上。',pose:2},
 {name:'微光归巢',seconds:10,goal:2,verb:'把两颗星种分别拖入右下方的金色灯里。',say:'按住亮起的星种，送到金色灯里，再松手。',pose:1},
 {name:'再架一座星桥',seconds:10,goal:5,verb:'依次点亮同样的5颗星，留下第二段星桥。',say:'还是那五颗星。完成就好，不用追求更快。',pose:4}
];
export const ROUTE=Array.from({length:5},(_,i)=>guideAt(i/4));
export const SEEDS=[{x:.22,y:.31},{x:.36,y:.69}],HOME={x:.78,y:.69};
export const createTask=phase=>({phase,progress:0,goal:TASKS[phase].goal,done:false,held:false,carrying:false,position:null});
export function taskTarget(s){return s.phase===2?ROUTE[Math.min(s.progress,4)]:s.phase===3?(s.carrying?HOME:SEEDS[Math.min(s.progress,1)]):targetAt(s.progress);}
const near=(a,b,r,aspect)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y)<=r;
export function advanceTask(s,event,p,aspect=1){if(s.done)return false;const before=s.progress;
 if(event==='cancel'){s.held=false;s.carrying=false;s.position=null;return false;}
 if(s.phase===2){if(event==='down')s.held=near(p,taskTarget(s),.13,aspect);if((event==='down'||event==='move')&&s.held&&near(p,taskTarget(s),.13,aspect))s.progress++;if(event==='release')s.held=false;}
 else if(s.phase===3){if(event==='down'&&near(p,SEEDS[s.progress],.12,aspect)){s.carrying=true;s.position=p;}if(event==='move'&&s.carrying)s.position=p;if(event==='release'){if(s.carrying&&near(p,HOME,.14,aspect))s.progress++;s.carrying=false;s.position=null;}}
 else if(event==='release'&&near(p,taskTarget(s),.085,aspect))s.progress++;
 s.done=s.progress>=s.goal;return s.progress>before;
}
