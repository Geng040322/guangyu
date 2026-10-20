export const FEELINGS={tense:{name:'有点紧绷',symbol:'⌁',line:'绷紧的时候，不必再催自己快一点。'},tired:{name:'有些疲惫',symbol:'☾',line:'累了，今天就把步子放小一点。'},sad:{name:'有点低落',symbol:'☂',line:'难过可以先在这里待着，不用急着变好。'},angry:{name:'心里有火',symbol:'✹',line:'先给这股情绪一点空间，我们再决定下一步。'},lonely:{name:'想被陪伴',symbol:'◌',line:'想有人听你说话，是很自然的需要。'},okay:{name:'还算平静',symbol:'✧',line:'平静的一刻，也值得被好好照顾。'},unsure:{name:'还说不清',symbol:'…',line:'说不清也没关系，不用先找到一个准确的词。'}};
export const METHODS={ground:{name:'回到此刻',time:'约 2 分钟',line:'看一看、碰一碰，把注意力带回身边。',icon:'◉'},breathe:{name:'和光一起呼吸',time:'1—5 分钟',line:'按舒适的节奏呼吸，不屏息、不勉强。',icon:'◎'},sort:{name:'给心事松个结',time:'约 3 分钟',line:'把发生的事、脑中的想法和需要分开放。',icon:'⌘'}};
const text=(v,n=240)=>Array.from(typeof v==='string'?v:'').slice(0,n).join('');
const number=(v,f=5)=>Number.isFinite(v)?Math.max(0,Math.min(10,Math.round(v))):f;
export function cleanSession(raw={}){return {mood:Object.hasOwn(FEELINGS,raw.mood)?raw.mood:'unsure',before:number(raw.before),after:raw.after===null||raw.after===undefined?null:number(raw.after),method:Object.hasOwn(METHODS,raw.method)?raw.method:'ground',note:text(raw.note),fact:text(raw.fact,120),thought:text(raw.thought,120),kind:text(raw.kind,120),action:text(raw.action,80)};}
export function reflect(raw){const s=cleanSession(raw);let line=FEELINGS[s.mood].line;if(s.note.trim())line=`你写下「${text(s.note.trim(),42)}${Array.from(s.note.trim()).length>42?'…':''}」。\n`+line;return line;}
export function closing(raw){const s=cleanSession(raw);const change=s.after===null?'不想给感受打分也可以。这段时间，是你留给自己的。':s.after<s.before?'你留意到感受比刚才轻了一点。把这一点变化轻轻记住就好。':s.after===s.before?'感受暂时没有变化，也不代表你做错了。照顾自己不需要立刻交出结果。':'你留意到现在更难受了一些。先停止练习，看看周围，选择让你更舒服的方式，也可以找人陪伴。';
 return change+(s.action?'\n接下来，只做这一件小事：「'+s.action+'」。':'\n今天可以先停在这里，不必再多做一点。');}
export function today(date=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
const KEY='guangyu.reflections.v1';
export function cleanRecord(raw={}){const s=cleanSession(raw);return {date:/^\d{4}-\d{2}-\d{2}$/.test(raw.date)?raw.date:today(),mood:s.mood,before:s.before,after:s.after,method:s.method,action:s.action};}
export function readReflections(storage){try{const rows=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r==='object').slice(0,14).map(cleanRecord):[];}catch{return [];}}
export function saveReflection(storage,raw){const record=cleanRecord(raw);try{const list=[record,...readReflections(storage)].slice(0,14);storage.setItem(KEY,JSON.stringify(list));return true;}catch{return false;}}
export function clearReflections(storage){try{storage.removeItem(KEY);return true;}catch{return false;}}
