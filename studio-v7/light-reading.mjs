// Descriptive geometry plus original aesthetic interpretation, never a psychological measurement.
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1;
const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*.6);
const segmentDistance=(p,a,b)=>{const dx=b.x-a.x,dy=(b.y-a.y)*.6,n=dx*dx+dy*dy;if(!n)return distance(p,a);const u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*.6*dy)/n));return distance(p,{x:a.x+u*dx,y:a.y+u*(b.y-a.y)});};
const SPACE={
 cluster:{name:'聚光',title:'有些光，\n聚在一起就很好。',evidence:'光点与已安放的光片聚在较近的范围，画面形成了一个小小的重心。',meaning:'我把这幅构图读成一种“收拢”：先让重要的东西相互靠近，四周仍然可以留白。',message:'这幅聚在一起的光，让我想到一件事：有时不必同时照顾所有方向。可以先把注意力交给眼前最重要的一件事，也给暂时放下的部分一个位置。愿这张卡片替你保留一点聚拢的力量，而不是催你把每一处空白都填满。'},
 open:{name:'舒展',title:'给新的光，\n留一个位置。',evidence:'光点与已安放的光片向画面不同区域延展，整体分布跨度较大。',meaning:'我把这幅构图读成一种“打开”：不同位置都能留下亮点，它们不必挤在同一个答案里。',message:'这片向外展开的光，让我想到：生活也可以容纳不同的方向。眼前的一种安排，并不需要成为唯一的安排；你可以保留一种可能，也给另一种想法留一点地方。愿你在需要作决定时，仍记得自己可以慢慢选择。'},
 balanced:{name:'有间',title:'光与光之间，\n可以留一点余地。',evidence:'光点与已安放的光片分布在一段适中的范围，彼此之间留出了距离。',meaning:'我把这些间隔读成一种“有余地”：画面里的元素可以相遇，也可以各自保留位置。',message:'我喜欢光与光之间的间隔。它让这幅作品不用靠填满来显得完整。愿你也给日常留一点这样的余地：事情可以有先后，联系可以有距离，休息不必等到所有事情都结束以后。照顾自己的边界，也可以是一种温柔。'},
 single:{name:'一束微光',title:'一束小小的光，\n也值得被留下。',evidence:'这次只有一处可用的位置记录，尚不足以比较元素的聚散关系。',meaning:'我把这一处光当作画面的起点；关于聚散的判断，先留在空白里。',message:'一处小小的光，也能成为一幅作品的开始。此刻不需要给所有事情安排一个完整的结尾。先留住一件愿意做的小事、一个想停靠的位置，就已经可以开始。剩下的部分，等你愿意时再慢慢添上。'},
 none:{name:'留白',title:'这一页，\n也可以先留白。',evidence:'没有足够的位置记录，因此不判断这次构图的聚散。',meaning:'我先把这一页读作留白，让它保留尚未决定的可能。',message:'这页空白并不需要急着交出一个答案。你可以决定说到哪里、画到哪里，也可以决定先停在这里。愿这张卡片给你留下一点不必表现、不必交代的空间；下一笔，可以等到你愿意的时候。'}
};
const FLOW={
 straight:{name:'直行的风',evidence:'线条总长度接近起点到终点的直线距离，走向比较直接。',meaning:'我把它读成一种清晰的连接：两处光之间，有一条可以看见的路。',message:'这段直接相连的线，让我想到：有些时候，把一件在意的事说清楚、把下一步缩小一点，就能让眼前的路更明确。愿你不必一次安排好全部，也能找到一个可以开始的方向。'},
 curve:{name:'弯行的风',evidence:'线条经过了弯曲的路径，比起终点之间的直线距离更长。',meaning:'我把这些弯曲读成一种延展：相遇的方式，可以不只有最短的一种。',message:'这段带着弯曲的线，让我想到：有些经历并不会按最短的路线展开。绕过一处、停留片刻，再换一种办法，也可以是前进的样子。愿你不用因为走得不够笔直，就否定自己已经走过的那一段。'},
 turning:{name:'回旋的风',evidence:'线条有较明显的绕行或折返，路径长度明显大于起终点之间的距离。',meaning:'我把这段线读成一种回旋：它让画面多了一层来回展开的节奏。',message:'这段回旋的线，让我想到：反复走过同一处，也可以成为重新看见它的机会。暂时没有找到合适的办法时，允许自己换个角度，给过程一点余地。愿这幅作品提醒你，路径可以调整，已经走过的部分也仍然属于你。'},
 none:{name:'未留下风线',evidence:'这次没有足够的有效线条，无法判断线条走向。',meaning:'我不会替没有画出的线条补一个性格或情绪含义。',message:''}
};
export function readArtwork(input={}){
const dots=(Array.isArray(input.dots)?input.dots:[]).filter(valid).slice(0,12),pieces=Array.isArray(input.pieces)?input.pieces:[],ids=[...new Set(Array.isArray(input.moved)?input.moved:[])].filter(i=>Number.isInteger(i)&&i>=0&&i<3&&valid(pieces[i])),lamp=valid(input.lamp)?input.lamp:null;
let points=[...dots,...ids.map(i=>pieces[i])],pathOnly=false;
const paths=(Array.isArray(input.threads)?input.threads:[]).slice(0,6).filter(Array.isArray).map(p=>p.filter(valid).slice(0,180));
if(!points.length){points=paths.filter(p=>p.length>1&&p.some(x=>distance(x,p[0])>.01)).flat();pathOnly=points.length>0;}if(!points.length&&lamp)points=[lamp];
let spread=null;if(points.length>=2){const xs=points.map(p=>p.x),ys=points.map(p=>p.y);spread=Math.hypot(Math.max(...xs)-Math.min(...xs),.6*(Math.max(...ys)-Math.min(...ys)))/Math.hypot(1,.6);}
const spaceCode=!points.length?'none':points.length===1?'single':spread<.28?'cluster':spread>.65?'open':'balanced';
let length=0,chord=0,count=0;for(const p of paths){let n=0;for(let i=1;i<p.length;i++)n+=distance(p[i-1],p[i]);if(n<.015)continue;length+=n;chord+=distance(p[0],p.at(-1));count++;}
const ratio=count?length/Math.max(chord,.001):null,flowCode=!count?'none':ratio<=1.15?'straight':ratio<=1.8?'curve':'turning';
const space={code:spaceCode,...SPACE[spaceCode]};space.evidence=space.evidence.replace('光点与已安放的光片',pathOnly?'实际线条覆盖的区域':dots.length&&ids.length?'光点与已安放的光片':dots.length?'光点':'已安放的光片');const flow={code:flowCode,...FLOW[flowCode]};
const side=lamp?(lamp.x<.4?'left':lamp.x>.6?'right':'center'):'none',names={left:'左侧',right:'右侧',center:'中间'},neighbours=[...dots,...ids.map(i=>pieces[i]),...paths.flat()],near=lamp&&(neighbours.some(p=>distance(p,lamp)<.2)||paths.some(path=>path.some((p,i)=>i>0&&segmentDistance(lamp,path[i-1],p)<.2)));
const lampReading=lamp?{code:side,name:near?'靠近的归航灯':'独立的归航灯',evidence:'你把最后一盏灯留在画面的'+names[side]+'，'+(!neighbours.length?'周围没有其他已记录元素。':near?'靠近已有的画面元素。':'与已有的画面元素拉开了一些距离。'),meaning:near?'我把这盏靠近的灯读作画面里的呼应：一处亮光，回应着另一处亮光。':'我把这盏独立的灯读作一个单独的落点：它可以照亮自己的位置，不必依附于其他元素。'}:{code:'none',name:'尚未亮起的灯',evidence:'这次没有放下归航灯。',meaning:'我为这个位置保留空白，不替你猜一个尚未作出的决定。'};
const hasData=points.length>0||count>0;const label=flowCode==='none'?space.name:space.name+' · '+flow.name;
const summary=space.meaning+(flowCode==='none'?'':flow.meaning);
return{hasData,label,summary,space,flow,lamp:lampReading,title:flowCode==='turning'?'绕一点路，\n也能抵达自己的光。':space.title,message:flowCode==='turning'||(ids.length===0&&count>0)?flow.message:space.message};
}
export function readingMarkup(r){const panels=[['01','光的聚散',r.space],['02','线的走向',r.flow],['03','灯的位置',r.lamp]];
return '<section class="li-reading" aria-label="屿安的创作测评"><span class="eyebrow">YUAN’S READING / 本次作品解读</span><div class="li-heading"><h1>屿安眼中的这幅作品：<br><em>'+r.label+'</em></h1><span class="li-tag">原创观点 · 画面解读</span></div><p class="li-intro">'+(r.hasData?'这是我的读画方式：先看你实际留下的形状，再说出它让我想到什么。':'这次记录较少，我会把没有依据的部分留白。')+'</p><div class="li-grid">'+panels.map(([n,title,p])=>'<article><span class="li-number">'+n+' / '+title+'</span><h2>'+p.name+'</h2><p><b>我看到的</b>'+p.evidence+'</p><p class="li-opinion"><b>我的解读</b>'+p.meaning+'</p></article>').join('')+'</div><p class="li-boundary">这些是屿安对作品的原创比喻，不是对你真实情绪、人格或压力程度的判断。</p><details class="li-sources"><summary>研究启发与解读方法 ↗</summary><p><b>活动设计参考：</b>WHO欧洲区域办事处（2019）艺术与健康综述，汇集3000余项研究；Kaimal、Ray与Muniz（2016）研究39名健康成人在45分钟艺术创作前后的唾液皮质醇变化。后者报告组内皮质醇下降，为进一步研究创作与身心状态的联系提供了线索。</p><p><b>与本站的区别：</b>上述研究不验证本网站每段最多10秒的活动效果，也没有验证根据线条、留白或摆放位置判断个人心理状态的方法。本站未测皮质醇，未评估临床疗效；“聚光”“舒展”等是光屿自定的画面分类，不是心理学类型或临床截点。</p><p><b>怎样读画：</b>聚散来自光点和已移动光片的位置跨度，线条走向来自实际路径与起终点距离的关系，灯的位置来自你最后放下的位置。设备、操作习惯和审美选择都可能影响画面；同一个人的不同作品，也会得到不同解读。</p><div><a href="https://www.who.int/europe/publications/i/item/9789289054553" target="_blank" rel="noopener">WHO艺术与健康综述 ↗</a><a href="https://pubmed.ncbi.nlm.nih.gov/27695158/" target="_blank" rel="noopener">Kaimal等，2016 原始研究 ↗</a></div></details></section>';}
