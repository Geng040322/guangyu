// K10 Chinese wording: Huang & Liu translation distributed by Ronald C. Kessler.
// Copyright © Ronald C. Kessler, PhD. 2006. Free use terms and source on result page.
export const K10_ITEMS=['无法解释的筋疲力尽？','紧张？','太紧张以至于什么都不能让您平静下来？','绝望？','不安或烦躁？','太不安以至于静坐不能？','沮丧的？','太沮丧以至于什么都不能让您愉快起来？','做每一件事情都很费劲？','无价值？'];
export const FREQUENCY=['全部时间','大部分时间','一部分时间','偶尔','无'];
export const SOURCES={study:'学业与考试',work:'工作与责任',money:'经济与生活',people:'关系与沟通',care:'照顾他人',future:'未来与变化',health:'身体与健康',self:'对自己的要求',other:'暂时说不清'};
export const SCENES=[['sea','有潮声的海湾','留一点宽阔'],['forest','透光的林间','慢一点生长'],['rain','安静的雨窗','暂时躲一场雨'],['room','亮着灯的小屋','有人为你留灯'],['cloud','漂浮的云岛','把重量放轻'],['dawn','将亮的天际','给明天一点余地']];
const opts=(...labels)=>labels.map((label,value)=>({label,value}));
const q=(id,chapter,title,labels,extra={})=>({id,chapter,title,options:opts(...labels),...extra});
export function journeySteps(age){const base=[
q('age','出发前','先为你选择合适的体验范围',['未满18岁','18—64岁','65岁及以上'],{hint:'不收集姓名或生日。成人量表仅用于成人自评；未成年人只做生活探索，不输出成人量表分数。'}),
q('role','出发前','最近，你更多地处在哪一种生活里？',['学习与备考','工作与求职','照顾家人与孩子','退休后的生活','休养或生活转换期','不想归类']),
{id:'scene',chapter:'选一处停靠',title:'第一眼，你想走进哪里？',options:SCENES.map(([value,label,desc])=>({value,label,desc})),hint:'这题只决定你的海报氛围，不推测压力或人格。',type:'scene'},
{id:'stress',chapter:'给感受一个刻度',title:'此刻，你自己感到的压力有多大？',options:Array.from({length:11},(_,value)=>({value,label:String(value)})),hint:'0＝完全没有，10＝非常强烈。它是你此刻的主观自评，不是医学检测值。',type:'scale'},
{id:'sources',chapter:'心力背包',title:'哪些事情，最近最占你的心力？',options:Object.entries(SOURCES).map(([value,label])=>({value,label})),type:'multi',hint:'最多选三项。可以没有明确来源，也可以跳过。'},
q('sleep','生活的回声','过去一周，你醒来后通常觉得休息够了吗？',['大多休息够了','有时够，有时不够','常常没有休息够','不确定']),
q('break','生活的回声','过去一周，你能有不被打扰的休息时间吗？',['通常可以','偶尔可以','很难有这样的时间','不确定']),
q('body','生活的回声','过去一周，紧绷或疲惫对日常安排的影响是？',['几乎没有','偶尔影响','经常影响','不确定'],{hint:'身体不适可能有多种原因，这道生活问题不能判断病因。'}),
q('control','手里的方向盘','事情堆在一起时，你通常能确定先做什么吗？',['通常能','有时能','常常不知道从哪里开始','看具体情况']),
q('change','手里的方向盘','计划突然被打乱时，哪种描述更贴近你？',['能慢慢重新安排','会乱一会儿，再找办法','很久都难以重新开始','每次不太一样']),
q('roleload','生活岔路','你所处的生活里，最消耗你的通常是什么？',['同时要顾太多事','担心自己做得不够好','别人不理解我的需要','变化太多，难以确定','暂时没有明显消耗'],{roleSpecific:true}),
q('rolehelp','生活岔路','当责任超出精力时，你通常会？',['减少或延后一部分','和相关的人商量','先全部接住，之后再说','不知道可以找谁商量','没有遇到这种情况'])
];
if(age!==0)base.push(...K10_ITEMS.map((text,i)=>({id:'k'+i,chapter:'近期感受 · K10',title:'上个月中，您经常会感到……'+text,options:FREQUENCY.map((label,index)=>({label,value:4-index})),hint:'请回想过去30天。以下10题为K10中文正式题目，按原顺序呈现；可暂不回答，缺项不计总分。',clinical:true})));
base.push(
q('boundary','留一点余地','有人临时向你求助，但你已经很累了。你更可能？',['说明自己能帮到哪里','先答应，再挤出时间','拒绝后仍反复自责','取决于对方和事情']),
q('mistake','留一点余地','一次没做好时，你通常会怎样对待自己？',['复盘一件可以改的事','反复想着自己不够好','先休息，之后再想','看事情的分量']),
q('recovery','补给小站','如果现在只留十分钟给自己，你更想？',['安静独处','让身体动一动','做一点自由创作','找人说说话','暂时什么都不做']),
q('method','补给小站','最近，哪种方式确实让你觉得有所恢复？',['睡眠或休息','散步或活动','画画、音乐或游戏','得到理解或实际帮助','还没有找到','不确定'],{hint:'按真实经历选择。选某种方式不代表它对所有人都有效。'}),
q('support','灯光在哪边','需要支持时，你知道可以找谁吗？',['有愿意联系的人','有人可找，但很难开口','暂时想不到合适的人','不想回答']),
q('impact','灯光在哪边','这些感受是否持续影响你的日常生活？',['很少影响','有影响，但大多能应对','持续影响睡眠、学习或工作','不确定'],{hint:'若持续影响生活，可以考虑学校心理中心或合资格专业人员；本体验不能作诊断。'}),
q('priority','最后带走一件事','如果只先照顾一个需要，你想选？',['休息与恢复','把事情理出先后','给关系留出边界','找到可以支持我的人','留一点自由表达的时间'])
);return base;}
export function scoreK10(answers){const values=K10_ITEMS.map((_,i)=>answers['k'+i]);if(values.some(v=>!Number.isInteger(v)||v<0||v>4))return null;return values.reduce((a,b)=>a+b,0);}
export function validAnswer(step,value){return step.type==='multi'?Array.isArray(value)&&value.length<=3&&value.every(v=>step.options.some(o=>o.value===v)):step.options.some(o=>o.value===value);}
export function journeyResult(a){const adult=a.age===1||a.age===2,score=adult?scoreK10(a):null;const priority=Number.isInteger(a.priority)?a.priority:0;
const needs=[{name:'先补回一点能量',action:'给自己留一段不处理事务的休息时间。若一直疲惫或睡不好，可寻求专业评估。',why:'你把休息与恢复放在了第一位。',title:'不用一直发光，\n也可以先休息。'},
{name:'把下一步缩小',action:'列出眼前的一件事，把第一步缩小到几分钟内可开始。其余事情暂时另放。',why:'你更希望先理清事情的先后。',title:'先走一小步，\n不必一次走完。'},
{name:'给自己留出边界',action:'选一件可以协商的事，说清自己现在能承担的部分。必要时请对方一起调整期待。',why:'你想先照顾关系中的边界。',title:'温柔待人，\n也别漏掉自己。'},
{name:'让支持靠近一点',action:'如果愿意，给一个可信任的人发一句具体请求，例如“你能听我说十分钟吗？”',why:'你希望找到能支持自己的人。',title:'不必一个人，\n把所有重量接住。'},
{name:'给表达留一个位置',action:'用十分钟画画、听音乐或记录一段感受。它不需要好看，也不必公开。',why:'你想给自由表达留一点时间。',title:'有些心情，\n值得被轻轻看见。'}][priority];
const facts=[];if(a.sleep===2)facts.push('你报告过去一周常常没有休息够');if(a.break===2)facts.push('你报告很难获得不被打扰的休息');if(a.control===2)facts.push('你报告常常不知道从哪里开始');if(a.boundary===1)facts.push('你选择了即使疲惫也先答应请求');if(a.support===2)facts.push('你暂时想不到合适的支持对象');return{adult,k10:score,stress:Number.isInteger(a.stress)&&a.stress>=0&&a.stress<=10?a.stress:null,sources:Array.isArray(a.sources)?a.sources.filter(k=>Object.hasOwn(SOURCES,k)).map(k=>SOURCES[k]):[],scene:SCENES.some(s=>s[0]===a.scene)?a.scene:'sea',need:needs,facts,affected:a.impact===2};}
export function resultNarrative(a){const r=journeyResult(a),values=K10_ITEMS.map((_,i)=>a['k'+i]),answered=values.filter(v=>Number.isInteger(v)&&v>=0&&v<=4),frequent=answered.filter(v=>v>=3).length,absent=answered.filter(v=>v===0).length;
const prominent=values.map((v,i)=>({v,i})).filter(x=>Number.isInteger(x.v)&&x.v>0).sort((x,y)=>y.v-x.v||x.i-y.i).slice(0,3).map(x=>'「'+K10_ITEMS[x.i].replace('？','')+'」');
const measure=r.k10===null?(r.adult?'你没有答完全部10道K10题，因此本次不计算量表总分，也不会把未回答的题目当成零分。你仍然可以参考自己明确表达的压力来源、生活感受和支持需要。':'这次是生活探索版本，没有使用成人量表，也不提供成人心理困扰分数。下面的反馈只复述你选出的生活感受和需要，不判断心理疾病或人格。'):`你的K10总分是${r.k10}/40，依据过去30天的10项回答逐项相加。${absent===10?'这10项感受在你本次报告中均为“无”。这不等于生活中完全没有压力，也不能据此排除其他困难。':frequent?`其中有${frequent}项感受被你选为“大部分时间”或“全部时间”，说明这些感受在你的报告里较常出现，值得认真照顾。`:`你没有把任何一项选为“大部分时间”或“全部时间”；不过，偶尔或一部分时间出现的困扰也可能值得被理解。`}${prominent.length?'你报告频率相对靠前的感受包括'+prominent.join('、')+'，这只是本次回答的排序，并非识别出的病因。':''}K10反映非特异性心理困扰，不是压力百分比；它不能凭一个总分诊断疾病，也不能给你贴人格标签。`;
const present=r.stress===null?'你没有填写此刻压力刻度，本次不会替你推算一个数字。':`你给此刻压力的自评是${r.stress}/10。这个刻度代表你现在的主观感受，而K10回顾过去30天，两者时间范围和测量内容不同，不需要一致，也不能互相替代。${r.stress>=8?'你把眼前的感受放在刻度较强的一端。如果此刻很难独自应对，可以先联系可信任的人，或寻找合资格专业支持。':r.stress<=2?'此刻你报告的压力不强。你仍然可以为自己保留休息和支持，而不用等到非常难受才照顾自己。':'可以留意哪些时刻会让这个感受加重或减轻，而不必要求自己立刻把数字降下来。'}`;
const sources=r.sources.length?`你选出的心力来源是${r.sources.join('、')}。这是你自己标记的生活关注点，并不是测试识别出的病因。${r.sources.length>1?'多件事情同时占用心力时，可以先挑最能影响、也最想照顾的一件，其余暂缓，而不必一次解决全部。':'可以先区分这件事中哪些部分能由你调整，哪些需要他人配合或更多时间。'}`:'你暂时没有明确标记压力来源。这可能只是现在不想归类，也可能是感受还没整理清楚；不需要为了得到结果而强行找出一个原因。';
const observations=r.facts.length?`从你的具体选择看，${r.facts.join('；')}。这些信息比一个创意称号更有助于理解你目前的处境。但它们都是自我报告，不能单独证明因果关系，身体不适也不能全部归为心理因素。`:'你没有在这些生活问题里选出明确的突出困难，或者跳过了相关问题。因此这里不替你编造“隐藏问题”。如果文字与你的真实体验不符，以你的感受为准。';
const need=`你最想先照顾的是「${r.need.name}」。${r.need.why}${r.need.action}这只是与你的选择对应的可选尝试，并非治疗处方。试过之后，可以观察它是否有帮助；没有帮助时，换一种方式或寻求支持都可以。`;
const support=a.support===2?'你表示暂时想不到合适的支持对象。可以从门槛较低、职责清楚的支持开始，例如学校心理中心、社区心理服务或合资格专业人员，而不必立刻向所有人说明自己的经历。':a.support===1?'你表示有人可找，但开口不容易。可以先提出一个小而具体的请求，或者先问对方现在是否方便听你说一会儿；你有权决定说多少。':a.support===0?'你表示有愿意联系的人。具体的陪伴、分担或倾听可能是可用的资源，但这并不意味着你必须马上联系，也不意味着对方能替代专业服务。':'你没有明确选择支持资源，这里不假定你一定有人可以联系。如果之后想获得帮助，可以优先寻找可信任、边界清楚且合适的支持。';
return[{title:'这份分数说明什么',text:measure},{title:'此刻与最近一个月',text:present},{title:'心力被哪些事占据',text:sources},{title:'你的具体回答',text:observations},{title:'可以先照顾的一个方向',text:need},{title:'让支持更容易一点',text:support+(r.affected?'你也报告这些感受持续影响日常生活，建议考虑获得专业评估，而不只依靠本测试。':'')}];}
