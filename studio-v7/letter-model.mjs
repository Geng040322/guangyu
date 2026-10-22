// Original supportive writing. The K6 measures remain unchanged; this letter is not a clinical interpretation.
const NOTES=[
 {title:'先松一口气，\n再向前一点。',body:'如果心里那根弦又绷起来，先不用催自己镇定。把眼前需要完成的事缩小一点，留一个可以停下来的位置。你不必靠一直紧绷，才能把生活过好。',short:'心里的弦可以慢慢松，不必要求自己立刻平静。',motif:'tide'},
 {title:'今天，\n只走眼前这一步。',body:'当往后的一切都显得很远，今天可以只安排眼前的一小步。先不回答“以后会怎样”，也不强迫自己马上乐观。愿意的话，把难以承受的部分告诉一个可以信任的人。',short:'看不清很远的路时，只处理眼前的一小步也可以。',motif:'horizon'},
 {title:'不必立刻，\n整理好所有心绪。',body:'如果心绪像风一样停不下来，不用急着把它们全部整理好。可以给手边的事排一个很短的顺序，其余先放一放。片刻的杂乱，不需要变成你对自己的责备。',short:'心绪有些杂乱时，也不必急着为每一件事找到答案。',motif:'orbit'},
 {title:'没有力气快乐，\n也值得被温柔对待。',body:'如果这阵子很难从事情里感到愉快，不需要勉强自己表现得开心。可以先选择一件不太耗力、也不令你难受的小事。快乐暂时很远的时候，照顾自己仍然值得。',short:'暂时没有快乐的力气，也不用勉强自己露出笑脸。',motif:'petal'},
 {title:'今天的你，\n已经很用力了。',body:'当每一件小事都显得费劲，不必再用别人的步速要求自己。把一件事拆小一点，能做多少就从多少开始；需要分担时，也可以向合适的人提出具体的请求。',short:'事情做起来很费劲的时候，慢一点并不需要被责备。',motif:'shelter'},
 {title:'你的价值，\n不靠表现来证明。',body:'如果最近很难看见自己的价值，我想把这句话留给你：你不需要一直有用、一直做好，才值得被认真对待。一次没做到，不足以定义一个人。对自己的评价，可以先留一点余地。',short:'你的价值，不需要通过每一次表现来重新证明。',motif:'light'}
];
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export function composeLetter(input=[]){const a=Array.from({length:6},(_,i)=>Number.isInteger(input[i])&&input[i]>=0&&input[i]<=4?input[i]:null),complete=a.every(v=>v!==null),rank=a.map((v,i)=>({v,i})).filter(x=>x.v>0).sort((x,y)=>y.v-x.v||x.i-y.i),seed=hash(JSON.stringify(a));
 if(!complete)return{kind:'open',title:'有些感受，\n可以慢慢说。',paragraphs:['这封信，先为还没有说完的部分留一页空白。你可以决定说到哪里，也可以改天再回来。','不需要急着填满每个空白。此刻先找一个舒适的位置，让自己有一点余地；想继续时，屿安还在这里。'],seed,motif:'horizon',pose:2};
 if(!rank.length)return{kind:'clear',title:'把这份平常的光，\n留给往后的自己。',paragraphs:['不必等到某一天变得特别，才允许自己拥有片刻安静。平常的一天，也值得被好好对待。','把愿意做的小事、想见的人，慢慢留进生活。以后再看到这张卡片，愿你能记起：照顾自己，不需要等到撑不住的时候才开始。'],seed,motif:'light',pose:0};
 const first=NOTES[rank[0].i],second=rank[1]?NOTES[rank[1].i]:null;
 const opening=rank[0].v>=3?'这些感受常常出现的时候，生活里的小事也可能需要更多力气。先不用急着把自己变成另一个样子。':'你在回答里提到的那些感受，值得被认真听见。你不需要因为它们出现，就否定自己已经走过的路。';
 const ending='这张卡片不用提醒你变得更好，只想给你留一点被理解的空间。—— 屿安';
 return{kind:'personal',title:first.title,paragraphs:[opening,first.body+(second?'\n'+second.short:''),ending],seed,motif:first.motif,pose:rank[0].i===5?0:2};
}
