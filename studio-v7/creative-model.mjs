export const COLORS={ice:{name:'冰蓝',hex:'#8ec9ed'},lilac:{name:'雾紫',hex:'#c5b1ed'},gold:{name:'暖金',hex:'#ebc887'},rose:{name:'浅粉',hex:'#eaa6bb'},mint:{name:'薄荷绿',hex:'#9bd6c4'},milk:{name:'月光白',hex:'#f0edf7'}};
export const THEMES={night:{name:'星夜小岛',bg:'#101d3b',ink:'#e9edf7',accent:'#becbf0'},ice:{name:'云上房间',bg:'#e8f0f7',ink:'#365474',accent:'#8caac8'},gold:{name:'落日花园',bg:'#f7ecdb',ink:'#71563a',accent:'#c09e6f'}};
export const OBJECTS={star:'星星',moon:'月亮',cloud:'云朵',bubble:'泡泡',flower:'小花',door:'一扇门'};
export const MAX_POINTS=6000,MAX_STROKES=48;
const clamp=(n,a,b,f=(a+b)/2)=>typeof n==='number'&&Number.isFinite(n)?Math.max(a,Math.min(b,n)):f;
const text=(v,n)=>Array.from(typeof v==='string'?v:'').slice(0,n).join('');
export function cleanCreation(raw={}){
 let budget=MAX_POINTS;const strokes=[];
 for(const s of (Array.isArray(raw.strokes)?raw.strokes:[]).slice(0,MAX_STROKES)){
  if(!s||!Object.hasOwn(COLORS,s.color))continue;
  const points=(Array.isArray(s.points)?s.points:[]).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)).slice(0,Math.min(800,budget)).map(p=>({x:clamp(p.x,0,1),y:clamp(p.y,0,1)}));
  if(!points.length)continue;budget-=points.length;strokes.push({color:s.color,brush:['light','ribbon','pearl','stardust'].includes(s.brush)?s.brush:'light',size:clamp(s.size,.005,.04,.014),points});
 }
 return {id:text(raw.id,80)||globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,strokes,objects:(Array.isArray(raw.objects)?raw.objects:[]).filter(o=>o&&Object.hasOwn(OBJECTS,o.type)).slice(0,14).map(o=>({type:o.type,x:clamp(o.x,.04,.96),y:clamp(o.y,.06,.94),scale:clamp(o.scale,.65,1.6,1)})),theme:Object.hasOwn(THEMES,raw.theme)?raw.theme:'night',expression:['gentle','happy','sleepy','curious'].includes(raw.expression)?raw.expression:'gentle',name:text(raw.name,12),note:text(raw.note,60),face:{x:clamp(raw.face?.x,.08,.92,.5),y:clamp(raw.face?.y,.08,.92,.5)},variant:Math.floor(clamp(raw.variant,0,2,0)),date:/^\d{4}\.\d{2}\.\d{2}$/.test(raw.date)?raw.date:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('/','.')};
}
export function describeCreation(raw){
 const c=cleanCreation(raw),points=c.strokes.flatMap(s=>s.points);if(!points.length)return {colors:[],movement:'第一笔',space:'留白',bounds:{x:.5,y:.5,w:0,h:0}};
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),w=maxX-minX,h=maxY-minY;
 const counts={};for(const s of c.strokes)counts[s.color]=(counts[s.color]||0)+s.points.length;
 const colors=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).slice(0,2);
 let loop=false;for(const s of c.strokes){if(s.points.length<12)continue;let length=0;for(let i=1;i<s.points.length;i++)length+=Math.hypot(s.points[i].x-s.points[i-1].x,s.points[i].y-s.points[i-1].y);const a=s.points[0],b=s.points.at(-1),dia=Math.hypot(w,h);if(length>dia*2.2&&Math.hypot(a.x-b.x,a.y-b.y)<dia*.3)loop=true;}
 const movement=Math.hypot(w,h)<.05?'轻轻落下的小点':loop?'绕回自己的圆线':w>h*1.6?'向两边舒展的线':h>w*1.6?'向上伸展的线':'自在绕开的弯线';
 return {colors,movement,space:w*h<.22?'留白':'铺展',bounds:{x:(minX+maxX)/2,y:(minY+maxY)/2,w,h}};
}
export function makeReply(raw){
 const c=cleanCreation(raw),d=describeCreation(c),name=c.name?`「${c.name}」`:'这个小家伙',colors=d.colors.map(id=>COLORS[id].name).join('和');
 const object=c.objects[0]?`你还为它放了${({star:'一颗星星',moon:'一轮月亮',cloud:'一朵云',bubble:'一个泡泡',flower:'一朵小花',door:'一扇门'})[c.objects[0].type]}。`:d.space==='留白'?'你没有把画面填满，空白也成为了它的小天地。':'这些线条把小小的画面，变成了有自己节奏的世界。';
 const observation=`你用${colors||'自己的颜色'}和${d.movement}，让${name}有了模样。${object}`;
 let answer;
 if(c.note.trim()){
  const words=Array.from(c.note.trim()).slice(0,28).join('')+(Array.from(c.note.trim()).length>28?'…':'');
  answer=`你写下「${words}」。`;
  if(/累|疲|困|休息/.test(c.note))answer+=['让它先替你守着这个小世界，你可以歇一会儿。','今天不用再添一笔了，给自己一点恢复的时间。','就让它陪你安静待着，把休息也留进今天。'][c.variant];
  else if(/开心|快乐|喜欢|高兴/.test(c.note))answer+=['这一点开心，被你亲手变成了看得见的东西。','这份喜欢已经有了自己的形状，值得被留下。','把这点小小的亮光，带到接下来的日子里吧。'][c.variant];
  else answer+=['这句话可以先放在这里，不急着变成答案。','愿你也能像安放它一样，为自己留一个位置。','你已经用自己的方式，让这一刻有了落点。'][c.variant];
 }else answer=['你不必解释它。你愿意画下来的这一刻，已经值得被认真看见。','它不需要像谁，来自你的那一点不同，就是它的名字之外的故事。','愿你也像照顾这个小家伙一样，给自己一点空间，慢慢长成喜欢的样子。'][c.variant];
 return observation+'\n'+answer;
}
const HISTORY='guangyu.creations.v1';
export function readCreations(storage){try{const raw=JSON.parse(storage.getItem(HISTORY)||'[]');return Array.isArray(raw)?raw.filter(c=>c&&Array.isArray(c.strokes)).slice(0,6).map(cleanCreation).filter(c=>c.strokes.length):[];}catch{return [];}}
export function saveCreations(storage,list){try{storage.setItem(HISTORY,JSON.stringify(list.slice(0,6).map(cleanCreation)));return true;}catch{return false;}}
