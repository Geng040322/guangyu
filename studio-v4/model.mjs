export const MOODS=[
 {id:'anxious',label:'有点焦虑',short:'焦虑',hint:'脑袋里，好像开了好多窗口',color:'#9caff5',shape:0},
 {id:'tired',label:'电量不足',short:'疲惫',hint:'想暂停一下，再慢慢出发',color:'#afbdd3',shape:1},
 {id:'sad',label:'心里下雨',short:'低落',hint:'有一些说不清的小难过',color:'#81b8dc',shape:2},
 {id:'angry',label:'有点委屈',short:'委屈',hint:'有些感受，想被认真对待',color:'#d5a3b8',shape:3},
 {id:'lost',label:'暂时迷路',short:'迷茫',hint:'不知道下一步，也没关系',color:'#b9a5df',shape:4},
 {id:'calm',label:'还算晴朗',short:'平静',hint:'想把此刻的小确幸留下来',color:'#d8bc88',shape:5},
];
export const NEEDS=[
 {id:'rest',label:'好好休息',small:'今天先不做满分的人',ability:'照顾自己的能力',message:'允许自己暂停，\n也是一种向前。',action:'把屏幕放下两分钟，喝一口水，让肩膀松下来。'},
 {id:'connection',label:'被听见与陪伴',small:'有人愿意听我慢慢说',ability:'与人连接的能力',message:'你不必独自发光，\n也值得被温柔照亮。',action:'给一个信任的人发一句：今天有空听我说说话吗？'},
 {id:'space',label:'一点自己的空间',small:'把边界轻轻放回原处',ability:'守护边界的能力',message:'留一点空间给自己，\n心也会慢慢舒展。',action:'为自己留十分钟，不回复消息，只做一件喜欢的小事。'},
 {id:'clarity',label:'一个清晰的下一步',small:'不用一次想完所有事情',ability:'整理与规划的能力',message:'不必看清整条路，\n先走眼前这一小步。',action:'写下现在能做的一件小事，只花五分钟开始它。'},
 {id:'kindness',label:'对自己温柔一点',small:'少一点责备，多一点理解',ability:'接纳与修复的能力',message:'那些不完美的部分，\n也可以被好好拥抱。',action:'把“我怎么又这样”换成“这次确实不容易”。'},
 {id:'courage',label:'重新出发的勇气',small:'想试试，也想有人鼓励',ability:'探索与生长的能力',message:'慢一点也没关系，\n你正在长成新的自己。',action:'选一件你想尝试的小事，给它一个不必成功的开始。'},
];
export const PALETTES={
 night:{name:'星夜蓝',bg:'#0a1532',ink:'#f3f1e9',muted:'#a9b8d7',accent:'#acbef7',orb:'#5566b1'},
 ice:{name:'冰川蓝',bg:'#eaf0f8',ink:'#263c62',muted:'#6d819d',accent:'#6689b8',orb:'#afc9e7'},
 gold:{name:'晨光金',bg:'#f7eee1',ink:'#59452f',muted:'#9e8467',accent:'#c79e68',orb:'#ebd3aa'},
};
export const HISTORY_KEY='guangyu.studio.cards.v1';
export function toggleMood(selected,id){
 if(!MOODS.some(m=>m.id===id))return selected;
 return selected.includes(id)?selected.filter(x=>x!==id):selected.length<3?[...selected,id]:selected;
}
export function makeCard(state,date=new Date()){
 const moods=[...new Set(state.moods??[])].filter(id=>MOODS.some(m=>m.id===id)).slice(0,3);
 const need=NEEDS.find(n=>n.id===state.need);
 if(!moods.length||!need)throw new Error('请先选择此刻的情绪和需要');
 return {id:globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`,moods,need:need.label,needId:need.id,ability:need.ability,message:need.message,action:need.action,body:String(state.body??'').slice(0,30),weight:Math.min(5,Math.max(1,Number(state.weight)||3)),note:Array.from(String(state.note??'').trim()).slice(0,48).join(''),quote:Math.min(2,Math.max(0,Math.floor(Number(state.quote)||0))),palette:PALETTES[state.palette]?state.palette:'gold',layout:state.layout===1?1:0,seed:Math.floor(Number(state.seed)||Math.random()*10000),date:new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date).replaceAll('/','.')};
}
export function cardMessage(card){return card.quote===1?'每一种情绪，\n都值得一个安心的落点。':card.quote===2?'今天的我，\n已经很努力了。':card.message;}
function validCard(c){return c&&typeof c.id==='string'&&Array.isArray(c.moods)&&c.moods.length>0&&c.moods.length<=3&&c.moods.every(id=>MOODS.some(m=>m.id===id))&&NEEDS.some(n=>n.id===c.needId)&&typeof c.note==='string'&&Array.from(c.note).length<=48&&typeof c.date==='string'&&/^\d{4}\.\d{2}\.\d{2}$/.test(c.date)&&PALETTES[c.palette]&&(c.layout===0||c.layout===1)&&typeof c.message==='string'&&typeof c.need==='string'&&typeof c.ability==='string';}
export function readHistory(storage){try{const list=JSON.parse(storage.getItem(HISTORY_KEY)||'[]');return Array.isArray(list)?list.filter(validCard).slice(0,8):[];}catch{return [];}}
export function saveHistory(storage,cards){try{storage.setItem(HISTORY_KEY,JSON.stringify(cards.filter(validCard).slice(0,8)));return true;}catch{return false;}}
export function wrapText(text,measure,maxWidth){const lines=[];for(const paragraph of String(text).split('\n')){let line='';for(const ch of Array.from(paragraph)){if(line&&measure(line+ch)>maxWidth){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}return lines;}
