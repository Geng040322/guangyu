export const MOODS=['很低落','有点累','平平的','还不错','很开心'];
export const TRACKS=[
{id:'breathe',title:'跟着屿安，慢一点',kind:'放松',minutes:5,scene:'sea',pose:2,desc:'轻柔呼吸 · 不屏息，不勉强',steps:['找一个舒服的姿势，眼睛睁着也可以。','让空气自然地进来、出去。不需要吸得很深。','如果舒服，吸气时缓缓数到五，再呼气数到五。','走神很正常。发现了，就轻轻回到这一口呼吸。','不舒服时恢复平常呼吸，随时可以结束。']},
{id:'ground',title:'把自己带回此刻',kind:'放松',minutes:3,scene:'wind',pose:3,desc:'感官停靠 · 看见身边的小事',steps:['感受脚下的支撑。轻轻看看四周。','找三样你看得见的东西，留意它们的颜色。','听一听远处，再听一听身边的声音。','注意手掌与衣服接触的感觉。无需改变它。','带着现在的心情，选一件接下来想做的小事。']},
{id:'body',title:'今天先松开肩膀',kind:'放松',minutes:8,scene:'rain',pose:2,desc:'身体觉察 · 舒适范围内放松',steps:['让身体被椅子或床托住。不必保持标准姿势。','注意额头、下颌。如果愿意，松开一点。','把注意力移到肩膀和双手。无需用力绷紧。','感受背部、腿和脚。哪里不舒服就跳过哪里。','动一动手指，看看周围。按自己的节奏回来。']},
{id:'sleep',title:'月光岛的最后一班船',kind:'睡眠',minutes:15,scene:'sea',pose:5,desc:'原创睡前文字 · 配合海浪声阅读',steps:['夜色落在岛上。屿安把码头的小灯调暗，留下刚好能看清脚边的光。今天的船不赶时间，你可以慢慢走。','船沿着海湾轻轻前行。岸边的窗一扇一扇暗下来。你不用数它们，也不用记住走过了哪里。风把白天留下的纸片翻过去。','屿安把一条软毯放在旁边。船舷外，浪花聚起来，又散开。没有哪一道浪需要一直发亮。你也可以暂时放下还没想明白的事。','远处的小屋留着一盏灯。门口有一张空椅子，一杯温水。到了这里，不需要汇报今天做得怎么样。你可以坐下，让肩膀歇一会儿。','潮水还会继续走动。屿安把船系好，坐在灯下翻书。夜晚不要求你立刻睡着。此刻，只需要让自己待得舒服一点。']},
{id:'focus',title:'陪你做一小会儿',kind:'专注',minutes:25,scene:'rain',pose:3,desc:'25 分钟安静陪伴 · 无打卡压力',steps:['选一件眼下想做的事。只做一点也可以。','如果被打断，记住刚才停在哪里，再回来。','把不急着处理的想法暂放一边。','看看身体是否舒服，喝一点水。','时间快到了。由你决定继续，还是歇一歇。']},
{id:'pause',title:'不用赶路的两分钟',kind:'放松',minutes:2,scene:'wind',pose:0,desc:'不必填写 · 留一点空白给自己',steps:['这两分钟，不需要交出答案。','看看屏幕里的光，也看看身边的光。','允许现在的感觉待在这里。','没有变轻松也没关系。','如果愿意，伸个懒腰，再回到你的生活。']}
];
export function cleanMessages(v){return Array.isArray(v)?v.filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string').slice(-16).map(x=>({role:x.role,content:Array.from(x.content).slice(0,2000).join('')})):[];}
export function readState(storage){try{const v=JSON.parse(storage?.getItem('guangyu.wellness.v1')||'{}');return{favorites:Array.isArray(v.favorites)?v.favorites.filter(id=>TRACKS.some(t=>t.id===id)):[],recent:Array.isArray(v.recent)?v.recent.filter(id=>TRACKS.some(t=>t.id===id)).slice(0,8):[],moods:Array.isArray(v.moods)?v.moods.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isInteger(x.value)&&x.value>=0&&x.value<5).slice(-90):[]};}catch{return{favorites:[],recent:[],moods:[]};}}
export function dayKey(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function writeState(storage,state){try{storage.setItem('guangyu.wellness.v1',JSON.stringify(state));return true;}catch{return false;}}
export function posterFacts(messages,mood,track){const users=cleanMessages(messages).filter(m=>m.role==='user');return{quote:users.at(-1)?.content.slice(0,90)||'',mood:MOODS[mood]||'',activity:track?.title||'',generatedAt:dayKey()};}
