// Official Mandarin K6, Huang & Liu translation. Copyright © Ronald C. Kessler, PhD. 2006.
// https://rckessler.scholars.harvard.edu/k10-and-k6-scales permits use with attribution.
export const SOURCE='https://rckessler.scholars.harvard.edu/k10-and-k6-scales';
export const MANDARIN='https://rckessler.scholars.harvard.edu/sites/g/files/omnuum8166/files/2026-03/Chinese_Mandarin_K6.pdf';
export const SCORING='https://rckessler.scholars.harvard.edu/sites/g/files/omnuum8166/files/2026-03/Scoring_K6_K10.pdf';
export const VALIDATION='https://pubmed.ncbi.nlm.nih.gov/26555498/';
export const ITEMS=['紧张？','绝望？','不安或烦躁？','太沮丧以至于什么都不能让您愉快起来？','做每一件事情都很费劲？','无价值？'];
export const OPTIONS=[{label:'全部时间',value:4},{label:'大部分时间',value:3},{label:'一部分时间',value:2},{label:'偶尔',value:1},{label:'无',value:0}];
const valid=v=>Number.isInteger(v)&&v>=0&&v<=4;
export function scoreK6(answers,adult){return adult===true&&Array.isArray(answers)&&answers.length===6&&answers.every(valid)?answers.reduce((a,b)=>a+b,0):null;}
export function k6Report(answers=[],adult=false){const score=scoreK6(answers,adult),count=ITEMS.filter((_,i)=>valid(answers[i])).length,frequent=ITEMS.filter((_,i)=>valid(answers[i])&&answers[i]>=3),some=ITEMS.filter((_,i)=>valid(answers[i])&&answers[i]>0),quoted=items=>items.map(x=>'「'+x.replace('？','')+'」').join('、');
 const sections=[{title:'这份结果代表什么',text:score===null?(adult?`本次完成${count}/6项，不计算总分。缺少的回答不会补为零，也不据此推测困扰程度。你可以返回补答，或直接结束。`:'本页仅提供18岁及以上成人自评，未使用你的回答计算成人量表分数。若希望了解自己的感受，可以联系学校心理服务或合适的专业人员。'):`本次K6原始总分为${score}/24，回顾过去30天的六项感受。各项按频率0—4分相加；分数越高，代表这六项感受在本次自我报告中的总体频率越高。它衡量非特异性心理困扰，不能单凭总分诊断疾病，也不能推断具体原因。`},
 {title:'你的具体回答',text:!adult||score===null?'这次没有完整的成人自评结果，因此不生成六项感受的汇总解释。':frequent.length?`你将${quoted(frequent)}报告为“大部分时间”或“全部时间”，共${frequent.length}项。这些是你实际报告的频率，不是系统从动作或图片推测出来的结论。`:some.length?`你报告出现过的感受包括${quoted(some)}；这六项中，没有一项被报告为“大部分时间”或“全部时间”。较少出现的感受也可能需要照顾，具体影响仍取决于你的实际生活。`:'你对六项感受均回答“无”。这表示本次未报告这些特定感受，不能据此排除其他困难，也不代表生活中完全没有压力。'},
 {title:'可以怎样使用它',text:'把这份结果当作整理近期经历的起点。若这些感受持续影响睡眠、学习、工作或关系，建议联系学校心理中心或合资格专业人员，并可向对方展示这份回答。单次分数不能替代专业评估。'},
 {title:'关于练习与复测',text:'如果愿意，可以进入放松与睡眠，尝试舒适的呼吸或感官练习。量表结果本身并不构成治疗建议，也不能证明某种练习对你有效。K6回顾过去30天，不适合在几分钟练习前后重复答题来宣称即时疗效；之后再做时，仍需回顾完整30天。'}];
 return{score,count,frequent:frequent.length,sections};}
const KEY='guangyu-k6-history-v1';
function clean(v){return Array.isArray(v)?v.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isInteger(x.score)&&x.score>=0&&x.score<=24).slice(-12).map(x=>({date:x.date,score:x.score})):[];}
export function readCheckins(storage){try{return clean(JSON.parse(storage?.getItem(KEY)||'[]'));}catch{return[];}}
export function saveCheckin(storage,entry){const validEntry=clean([entry]);if(!validEntry.length||!storage)return false;try{const next=[...readCheckins(storage).filter(x=>x.date!==entry.date),validEntry[0]].slice(-12);storage.setItem(KEY,JSON.stringify(next));return true;}catch{return false;}}
export function clearCheckins(storage){try{storage?.removeItem(KEY);return true;}catch{return false;}}
