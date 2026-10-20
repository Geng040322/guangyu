export const STORAGE_KEY='guangyu.nurture.v1';
export const outfits=['original','moon','rose','gold'];
export const scenes=['night','ice','gold'];
export function shanghaiDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function normalizeState(raw){let s=raw;try{if(typeof s==='string')s=JSON.parse(s)}catch{s=null}if(!s||typeof s!=='object')s={};return {visitDays:Array.isArray(s.visitDays)?[...new Set(s.visitDays.filter(v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)))].slice(-3660):[],memories:Array.isArray(s.memories)?s.memories.filter(m=>m&&typeof m.date==='string'&&typeof m.text==='string').slice(-14).map(m=>({date:m.date.slice(0,10),text:m.text.slice(0,100)})):[],outfit:outfits.includes(s.outfit)?s.outfit:'original',scene:scenes.includes(s.scene)?s.scene:'night'}}
export function visit(state,date=shanghaiDate()){const s=normalizeState(state);const returning=s.visitDays.length>0;const newDay=!s.visitDays.includes(date);if(newDay){s.visitDays.push(date);s.memories.push({date,text:returning?'又一起坐了一小会儿。':'在这里，留下一盏小灯。'});s.memories=s.memories.slice(-14)}return {state:s,newDay,returning}}
export function remember(state,text,date=shanghaiDate()){const s=normalizeState(state);s.memories=[...s.memories,{date,text}].slice(-14);return s}
export function loadState(storage){try{return {state:normalizeState(storage.getItem(STORAGE_KEY)),available:true}}catch{return {state:normalizeState(null),available:false}}}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(normalizeState(state)));return true}catch{return false}}
