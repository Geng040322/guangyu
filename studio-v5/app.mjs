import {MOODS,NEEDS,PALETTES,toggleMood,makeCard,readHistory,saveHistory,cardMessage,toggleStars,safeDecor,restoreChoices} from './model.mjs';
import {renderPoster,loadArt} from './poster.mjs';
import {yuan} from './art.mjs';
import {prepareAtlas} from './characters.mjs';
import {mountCatcher,mountUntangle,mountScratch} from './games.mjs';

const root=document.querySelector('#app');
const initial=()=>({stage:0,moods:[],weight:3,body:'',need:'',note:'',palette:'gold',layout:0,quote:0,seed:Math.floor(Math.random()*10000),caught:0,untangled:0,revealMode:'knot',stars:[],pose:2,stamp:0,dots:[]});
let state=initial(),currentCard=null,paint=0,toastTimer,previewTimer;
let cleanupPlay=()=>{};
let storage;try{storage=window.localStorage;}catch{storage=null;}
let history=readHistory(storage);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">↗</span>';
const icon='<span class="brand-spark" aria-hidden="true">✧</span>';
const act=(name,value='')=>`data-action="${name}" data-value="${esc(value)}"`;
function notify(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3200);}
function artwork(){return `<svg class="threads" viewBox="0 0 700 700" aria-hidden="true"><defs><linearGradient id="filament"><stop stop-color="#adc9ff" stop-opacity=".05"/><stop offset=".5" stop-color="#c9c4ff" stop-opacity=".65"/><stop offset="1" stop-color="#f5dcb0" stop-opacity=".1"/></linearGradient></defs>${Array.from({length:17},(_,i)=>`<path d="M -90 ${410+i*6} C ${140+i*5} ${700-i*8}, ${410+i*4} ${95+i*10}, 790 ${445+i*6}"/>`).join('')}<ellipse cx="350" cy="450" rx="270" ry="109" transform="rotate(-12 350 450)"/><ellipse cx="350" cy="450" rx="285" ry="119" transform="rotate(-12 350 450)"/></svg>`;}
function crystal(color,shape=0){return `<span class="crystal crystal-${shape}" style="--gem:${color}" aria-hidden="true"><i></i><i></i><i></i></span>`;}
function nav(){return `<header class="nav shell"><button class="brand" ${act('home')} aria-label="光屿首页">${icon}<span>光屿<small>GUANGYU</small></span></button>${state.stage?`<nav class="steps" aria-label="体验进度">${['接住','显影','长成'].map((name,i)=>`<button ${act('step',i+1)} ${i+1>state.stage?'disabled':''} class="${Math.min(state.stage,3)===i+1?'active':''}" ${Math.min(state.stage,3)===i+1?'aria-current="step"':''}><span>0${i+1}</span>${name}</button>`).join('<i></i>')}</nav>`:'<span class="nav-caption">显愈之境 / THE REALM OF MANIFEST HEALING</span>'}<button class="collection" ${act('history')}><span aria-hidden="true">▧</span> 我的收藏<span class="count">${history.length.toString().padStart(2,'0')}</span></button></header>`;}
function footer(){return `<footer class="footer shell"><span>光屿 · 让每一种情绪，安心落地</span><div><span class="private-dot"></span> 无需登录 · 卡片仅存本机 <button ${act('about')}>关于作品 ↗</button></div></footer>`;}
function home(){return `<main id="main" tabindex="-1"><section class="hero shell"><div class="hero-copy"><p class="eyebrow"><span></span> 情绪显影所 · EMOTIONAL ATELIER</p><h1>给此刻的情绪，<br>一个<span class="luminous">温柔的落点。</span></h1><p class="hero-description">接住晶体，揉开线团，点亮星轨。<br>和屿安玩一会儿，把心情做成一张海报。</p><div class="hero-actions"><button class="button primary" ${act('start')}>和屿安玩一会儿 ${arrow}</button><span class="duration">约 3 分钟<br><small>没有标准答案</small></span></div><div class="hero-note"><span>✦</span> 摸摸屿安，它会回应你。</div></div><div class="hero-art">${artwork()}<div class="halo"></div><span class="orbit-caption">A SAFE PLACE TO LAND</span><span class="art-star star-one">✧</span><span class="art-star star-two">✦</span><button class="hero-pet" ${act('pet')} aria-label="摸摸屿安，看看它的回应">${sprite(0,'hero-yuan','屿安向你招手')}</button><span class="floating-label label-one">接住每一种你</span><span class="floating-label label-two"><i></i> 屿安，在这里陪你</span><div class="art-caption"><span>YOUR LITTLE COMPANION</span><b>屿安</b><p>不催你，只陪你慢慢来。</p></div></div></section><section class="chapters shell" aria-label="旅程预告"><div class="section-label"><span>一场温柔的小小旅程</span><span>SCROLL TO EXPLORE ↓</span></div><div class="chapter-grid">${[{n:'01',title:'接住',en:'RECEIVE',desc:'左右移动，接住飘来的情绪晶体。',color:'#a5a9eb'},{n:'02',title:'显影',en:'REVEAL',desc:'揉开线团，亲手连起三颗愿望星。',color:'#b8d3e9'},{n:'03',title:'长成',en:'BECOME',desc:'换动作、盖印记，点亮专属艺术卡片。',color:'#e8c591'}].map((c,i)=>`<article class="chapter chapter-${i}"><span class="chapter-number">${c.n}</span><div class="chapter-gem">${crystal(c.color,i)}</div><div><span class="mini-label">${c.en}</span><h2>${c.title}<span> / </span></h2><p>${c.desc}</p></div></article>`).join('')}</div></section><section class="invitation shell"><p>这里没有通关分数，<br>只收集你的小小开心。</p><button class="text-button" ${act('start')}>开始收集我的光 ${arrow}</button></section></main>`;}
function title(n,en,heading,desc){return `<div class="flow-title"><p class="eyebrow">CHAPTER 0${n} <i></i> ${en}</p><h1 tabindex="-1">${heading}</h1><p>${desc}</p></div>`;}
function receive(){
 return `<main id="main" class="flow shell play-flow" tabindex="-1">${title(1,'RECEIVE','今天的心事，屿安来接。','选一到三种心情，再接住三颗晶体。')}<div class="receive-play-grid"><section class="mood-selection"><p class="mini-label">先选今天的心情</p><div class="mood-grid compact-moods">${MOODS.map(m=>`<button class="mood ${state.moods.includes(m.id)?'selected':''}" ${act('mood',m.id)} aria-pressed="${state.moods.includes(m.id)}">${crystal(m.color,m.shape)}<strong>${m.label}</strong><span class="mood-check">${state.moods.includes(m.id)?'✓':'+'}</span></button>`).join('')}</div><div class="mission-token"><span>01</span><p>把心事交给我，<br>你来决定往哪走。</p></div></section><section class="sky-game-wrap"><div class="game-topline"><span>安心接住站</span><span>DRAG · TAP · CATCH</span></div><div id="catch-game" class="catch-game" aria-label="接住情绪晶体小游戏">${!state.moods.length?`<div class="game-ready">${sprite(0,'ready-sprite','屿安向你招手')}<p>先选一颗心情，<br>我准备好接住啦。</p></div>`:''}</div><div class="game-footline"><span>不计时，不会失败。</span><button class="text-button" ${act('skip-catch')} ${!state.moods.length?'disabled':''}>今天先轻轻路过 ↗</button></div></section></div><div class="flow-bottom"><button class="back" ${act('home')}>← 返回小岛</button><button class="button primary" ${act('next')} ${!state.moods.length||state.caught<3?'disabled':''}>接住了，去松一口气 ${arrow}</button></div></main>`;
}
const BODIES=['肩膀有一点紧','脑袋停不下来','胸口闷闷的','身体软软的','呼吸很轻松','暂时说不清'];
function reveal(){
 const stars=Array.isArray(state.stars)?state.stars:[],selected=stars.map(id=>NEEDS.find(n=>n.id===id)).filter(Boolean),positions=[[17,23],[49,15],[80,28],[18,70],[52,76],[83,69]];
 if(state.revealMode!=='stars')return `<main id="main" class="flow shell play-flow" tabindex="-1">${title(2,'REVEAL','绕成一团？慢慢揉开。','用手指划一划，让打结的光线松下来。')}<div class="untangle-layout"><section id="untangle-game" class="untangle-game" aria-label="揉散情绪线团"></section><aside class="activity-aside"><span class="activity-number">02</span><h2>不用使劲。<br>轻轻的，就可以。</h2><div class="mini-missions"><span class="done">✓ 接住心事</span><span class="${state.untangled>=1?'done':'current'}">${state.untangled>=1?'✓':'◌'} 松开线团</span><span>✧ 点亮星轨</span></div><button class="breath-button" ${act('breathe')}><span class="breath-icon"></span><div>想休息？一起呼吸一下<small>随时都能结束</small></div><span>↗</span></button><button class="text-button" ${act('skip-knot')}>先把线团放在这里 ↗</button></aside></div><div class="flow-bottom"><button class="back" ${act('previous')}>← 回到接住站</button><button class="button primary" ${act('next')} ${state.untangled<1?'disabled':''}>去点亮我的星轨 ${arrow}</button></div></main>`;
 return `<main id="main" class="flow shell play-flow" tabindex="-1">${title(2,'REVEAL','给此刻的你，连一条星轨。','点亮三颗想要的星。第一颗，是你最想收到的。')}<div class="constellation-layout"><section class="constellation-board" aria-label="选择并连接三颗需要之星"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${stars.slice(1).map((id,i)=>{const a=positions[NEEDS.findIndex(n=>n.id===stars[i])],b=positions[NEEDS.findIndex(n=>n.id===id)];return a&&b?`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`:'';}).join('')}</svg>${NEEDS.map((n,i)=>`<button class="wish-star ${stars.includes(n.id)?'lit':''}" ${act('star',n.id)} style="left:${positions[i][0]}%;top:${positions[i][1]}%" aria-pressed="${stars.includes(n.id)}"><span>✦</span><strong>${n.label}</strong><small>${stars[0]===n.id?'最想要的':stars.includes(n.id)?'也想要':''}</small></button>`).join('')}<div class="star-counter">${stars.length} / 3 <span>YOUR OWN CONSTELLATION</span></div></section><aside class="star-companion">${sprite(stars.length===3?4:3,'star-avatar',stars.length===3?'屿安开心庆祝你点亮星轨':'屿安指向一颗星')}<p>${selected.length?`先给自己，<br><b>${esc(selected[0].label)}</b>。`:'不用选“应该”的，<br>选你真正想要的。'}</p><div class="star-tags">${selected.map(n=>`<span>${esc(n.label)}</span>`).join('')}</div></aside></div><div class="flow-bottom"><button class="back" ${act('back-knot')}>← 再待一会儿</button><button class="button primary" ${act('next')} ${stars.length<3?'disabled':''}>带着这束星光，做张海报 ${arrow}</button></div></main>`;
}
function compose(){return `<main id="main" class="flow shell compose" tabindex="-1">${title(3,'BECOME','给这束光，加一点你的样子。','点一下海报，星光会落在你选的位置。')}<div class="compose-grid"><div class="poster-column"><div class="poster-frame"><canvas id="poster" width="1200" height="1600" role="img" aria-label="你的专属情绪海报预览"></canvas><div id="poster-error" hidden></div></div><p class="preview-label"><span>✦</span> 点海报落星光 · 最多 12 颗 <button class="text-button" ${act('clear-dots')}>重新点亮</button></p></div><section class="customize">${playControls()}<div class="custom-section"><p class="question-number">01 / 选一束属于你的光</p><div class="palette-options">${Object.entries(PALETTES).map(([id,p])=>`<button ${act('palette',id)} class="palette ${state.palette===id?'chosen':''}" aria-pressed="${state.palette===id}"><span style="--swatch:${p.bg};--edge:${p.accent}">${state.palette===id?'✓':''}</span>${p.name}</button>`).join('')}</div></div><div class="custom-section"><p class="question-number">02 / 想把哪句话送给自己？</p><div class="quote-options">${[NEEDS.find(n=>n.id===state.need).message,'每一种情绪，\n都值得一个安心的落点。','今天的我，\n已经很努力了。'].map((q,i)=>`<button ${act('quote',i)} class="quote ${state.quote===i?'chosen':''}" aria-pressed="${state.quote===i}"><span>${esc(q).replaceAll('\n','')}</span><i>${state.quote===i?'✓':'○'}</i></button>`).join('')}</div></div><div class="custom-section"><label class="question-number" for="note">03 / 再写一句，只有自己知道的话 <span>可选</span></label><div class="note-wrap"><textarea id="note" rows="2" placeholder="比如：今天也有好好照顾自己。" aria-describedby="note-count">${esc(state.note)}</textarea><span id="note-count">${Array.from(state.note).length} / 48</span></div></div><div class="layout-control"><span>海报构图</span><div>${['星轨环抱','留白心语'].map((v,i)=>`<button ${act('layout',i)} class="${state.layout===i?'active':''}" aria-pressed="${state.layout===i}">${v}</button>`).join('')}</div><button class="shuffle" ${act('shuffle')} title="换一组星光位置">⟳ 换束星光</button></div><button class="button primary finish" ${act('finish')}>封存这束光 ${arrow}</button><p class="privacy-note">无需填写姓名。这一刻，属于你自己。</p></section></div><div class="flow-bottom"><button class="back" ${act('previous')}>← 再听听自己的需要</button><span class="end-note">情绪不会定义你，它只是经过你。</span></div></main>`;}
function result(){return `<main id="main" class="flow shell result" tabindex="-1"><div class="result-copy"><p class="eyebrow">A LITTLE LIGHT, JUST FOR YOU</p><h1 tabindex="-1">看，这是此刻的你。<br><span>值得被温柔收藏。</span></h1><p>情绪被看见之后，<br>我们就多了一点，照顾自己的可能。</p><div class="scratch-caption">屿安偷偷塞来一张小纸条</div><div class="scratch-wrap"><p>${esc(currentCard.action)}</p><canvas id="scratch-note" tabindex="0" role="button" aria-label="擦开屿安的小纸条，也可按回车打开"></canvas></div><div class="download-actions"><button class="button primary" ${act('download')}>保存我的海报 <span aria-hidden="true">↓</span></button><button class="button subtle" ${act('edit')}>再调整一下</button></div><p class="download-hint">高清 PNG · 1200 × 1600<br>手机也可点开图片，长按保存。</p><div class="result-links"><button class="text-button" ${act('image')}>打开海报图片 ↗</button><button class="text-button" ${act('restart')}>再开始一段旅程 ↗</button></div></div><div class="poster-column"><div class="poster-frame"><canvas id="poster" width="1200" height="1600" role="img" aria-label="已完成的专属情绪海报"></canvas><div id="poster-error" hidden></div></div><p class="preview-label">RECEIVED. UNDERSTOOD. BECOMING.</p></div></main>`;}
function render(focus=false){
 cleanupPlay();
 const active=document.activeElement;const focusKey=active?.dataset?.action?[active.dataset.action,active.dataset.value]:null;
 document.body.dataset.theme=state.stage===2?'ice':state.stage>=3?'gold':'night';
 root.innerHTML=nav()+[home,receive,reveal,compose,result][state.stage]()+footer();
 if(focus){window.scrollTo({top:0,behavior:'instant'});(root.querySelector('h1')??root.querySelector('#main')).focus({preventScroll:true});}
 else if(focusKey){[...root.querySelectorAll('[data-action]')].find(b=>b.dataset.action===focusKey[0]&&b.dataset.value===focusKey[1])?.focus({preventScroll:true});}
 cleanupPlay=mountActivities();
 if(state.stage>=3)updatePoster();
}
async function updatePoster(){
 const canvas=document.querySelector('#poster');if(!canvas)return;const seq=++paint;
 const card=state.stage===4?currentCard:buildCard();
 const error=document.querySelector('#poster-error');
 try{await loadArt();if(seq!==paint||!canvas.isConnected)return;await renderPoster(canvas,card);canvas.dataset.ready='true';if(error)error.hidden=true;}
 catch(e){if(seq!==paint||!error)return;error.hidden=false;error.innerHTML=`<p>${esc(e.message)}</p><button class="button subtle" ${act('retry')}>重新生成</button>`;}
}
function go(stage){state.stage=stage;render(true);}
function modal(content,label,extra=''){
 const d=document.createElement('dialog');d.className='dialog '+extra;d.setAttribute('aria-label',label);d.innerHTML=`<button class="dialog-close" aria-label="关闭">×</button>${content}`;document.body.append(d);d.querySelector('.dialog-close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close();});d.addEventListener('close',()=>d.remove(),{once:true});d.showModal();return d;
}
function showHistory(){
 const d=modal(`<p class="eyebrow">MY LITTLE COLLECTION</p><h2>收藏过的，每一种自己。</h2><p class="dialog-desc">最近 8 张海报保存在当前浏览器，清理浏览器数据后会消失。</p><div class="history-list">${history.length?history.map((c,i)=>`<button class="history-card" data-index="${i}" style="--history-bg:${PALETTES[c.palette].bg};--history-ink:${PALETTES[c.palette].ink}"><span>0${i+1}</span><div><b>${esc(c.moods.map(id=>MOODS.find(m=>m.id===id).short).join(' · '))}</b><small>${esc(c.date)} / ${esc(c.need)}</small></div><span>↗</span></button>`).join(''):'<div class="empty-history"><span>✧</span><p>这里还空着。<br>开始旅程，把第一束光留给自己。</p></div>'}</div>`,'我的收藏');
 d.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>{currentCard={...history[Number(b.dataset.index)]};state={...initial(),...restoreChoices(currentCard),caught:3,untangled:1,revealMode:'stars'};d.close();go(4);});
}
function breathe(){
 const d=modal(`<p class="eyebrow">A SOFT LITTLE PAUSE</p><h2>不用赶路，先陪自己一会儿。</h2><div class="breathing-orbit"><div class="breathing-circle"></div>${sprite(5,'breath-avatar','屿安安静地陪你呼吸')}<span id="breathing-word">轻轻吸气</span></div><p class="dialog-desc">舒服地呼吸就好，不用屏息。<br>随时都可以结束。</p><button class="button primary breath-done">我准备好了，继续显影 ↗</button>`,'和屿安一起呼吸','breathing-dialog');
 let inhale=true;const timer=setInterval(()=>{inhale=!inhale;const t=d.querySelector('#breathing-word');if(t)t.textContent=inhale?'轻轻吸气':'慢慢呼气';},4000);d.querySelector('.breath-done').onclick=()=>d.close();d.addEventListener('close',()=>clearInterval(timer),{once:true});
}
async function openImage(){const c=document.querySelector('#poster');if(!c?.dataset.ready){notify('海报还在显影，请稍等一下');return;}const url=c.toDataURL('image/png');modal(`<h2>把这束光留在身边</h2><p class="dialog-desc">手机长按下方图片即可保存，也可以使用下载按钮。</p><img class="save-image" src="${url}" alt="你的完整情绪海报">`,'保存海报','image-dialog');}
async function download(){
 const canvas=document.querySelector('#poster');if(!canvas?.dataset.ready){notify('海报还在显影，请稍等一下');return;}
 const button=root.querySelector('[data-action="download"]');if(button)button.disabled=true;
 try{const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('导出失败')),'image/png'));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`光屿-屿安的情绪海报-${currentCard.date}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);notify('海报已准备好，也可以点开图片长按保存');}
 catch{notify('试试点开图片，长按保存');await openImage();}finally{if(button?.isConnected)button.disabled=false;}
}
root.addEventListener('click',e=>{
 const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const {action,value}=b.dataset;
 switch(action){
 case 'start':state=initial();go(1);break;
 case 'restart':state=initial();currentCard=null;go(1);break;
 case 'home':go(0);break;
 case 'step':{const next=Number(value);if(next<=state.stage&&next<=3)go(next);break;}
 case 'previous':go(state.stage-1);break;
 case 'next':if(state.stage===1&&state.moods.length&&state.caught>=3)go(2);else if(state.stage===2&&state.revealMode!=='stars'&&state.untangled>=1){state.revealMode='stars';render(true);}else if(state.stage===2&&state.stars.length===3&&state.need)go(3);break;
 case 'mood':if(state.moods.length>=3&&!state.moods.includes(value)){notify('安心口袋一次装三颗，点已选晶体可以放回');break;}state.moods=toggleMood(state.moods,value);render();break;
 case 'skip-catch':if(state.moods.length){state.caught=3;go(2);}break;
 case 'skip-knot':state.untangled=1;state.revealMode='stars';render(true);break;
 case 'back-knot':state.revealMode='knot';render(true);break;
 case 'star':if(state.stars.length>=3&&!state.stars.includes(value)){notify('星轨里留三颗就好，点亮的星可以再点一下放回');break;}state.stars=toggleStars(state.stars,value);state.need=state.stars[0]||'';render();break;
 case 'pose':state.pose=Number(value);render();break;
 case 'stamp':state.stamp=Number(value);render();break;
 case 'clear-dots':state.dots=[];updatePoster();notify('星光收好啦，可以重新点亮');break;
 case 'pet':{const a=root.querySelector('.hero-pet');if(a){state.pet=(state.pet||0)+1;a.innerHTML=sprite([0,2,4,5][state.pet%4],'hero-yuan','屿安回应你的轻轻触碰');notify(['嘿，你来啦。','抱抱，充电中。','今天也有小小的开心。','嘘，屿安打了个盹。'][state.pet%4]);}break;}
 case 'need':state.need=value;render();break;
 case 'palette':state.palette=value;render();break;
 case 'quote':state.quote=Number(value);render();break;
 case 'layout':state.layout=Number(value);render();break;
 case 'shuffle':state.seed=Math.floor(Math.random()*10000);updatePoster();notify('新的星光，已经落进你的海报');break;
 case 'finish':currentCard=buildCard();history=[currentCard,...history].slice(0,8);const saved=saveHistory(storage,history);go(4);if(!saved)notify('当前浏览器无法收藏，仍然可以下载海报');break;
 case 'edit':state={...initial(),...restoreChoices(currentCard),caught:3,untangled:1,revealMode:'stars'};go(3);break;
 case 'history':showHistory();break;
 case 'breathe':breathe();break;
 case 'download':download();break;
 case 'image':openImage();break;
 case 'retry':updatePoster();break;
 case 'about':modal('<p class="eyebrow">THE REALM OF MANIFEST HEALING</p><h2>显愈之境 · 光屿</h2><p class="dialog-desc">从“接住”，到“显影”，再到“长成”。<br>我们尝试让难以言说的感受，成为可以看见、理解与收藏的光。</p><p class="dialog-desc">屿安是这段旅程的陪伴者。这里没有标准答案，也不进行心理诊断。所有回应来自你的自主选择。</p><p class="dialog-desc">作品设计：耿王璟<br>你的文字不会发布到公共空间，收藏仅留在当前浏览器。</p>','关于光屿');break;
 }
});
root.addEventListener('input',e=>{
 if(e.target.id==='weight'){state.weight=Number(e.target.value);const label=['轻轻的','一点点','有些分量','有点沉','快要装满'][state.weight-1];document.querySelector('#weight-value').textContent=label;e.target.setAttribute('aria-valuetext',label);}
 if(e.target.id==='note'){const chars=Array.from(e.target.value);if(chars.length>48)e.target.value=chars.slice(0,48).join('');state.note=e.target.value;document.querySelector('#note-count').textContent=`${Array.from(state.note).length} / 48`;clearTimeout(previewTimer);previewTimer=setTimeout(updatePoster,180);}
});
render();
loadArt().catch(()=>{});

function sprite(pose=0,cls='',alt='屿安'){
 pose=Number.isInteger(pose)&&pose>=0&&pose<6?pose:0;
 return `<span class="yuan-sprite ${cls}" role="img" aria-label="${esc(alt)}" style="--pose-x:${[0,50,100][pose%3]}%;--pose-y:${pose<3?0:100}%"><img class="sprite-fallback" src="${yuan}" alt=""></span>`;
}

function playControls(){
 return `<div class="custom-section pose-control"><p class="question-number">让哪个屿安陪你？</p><div class="pose-options">${[[0,'打个招呼'],[2,'抱抱自己'],[4,'开心一下'],[5,'安心歇歇']].map(([p,name])=>`<button ${act('pose',p)} class="${state.pose===p?'chosen':''}" aria-pressed="${state.pose===p}">${sprite(p,'pose-thumb',name)}<span>${name}</span></button>`).join('')}</div></div><div class="stamp-control"><span>今日印记</span>${['慢慢来','有被接住','心有晴光','给自己留白'].map((name,i)=>`<button ${act('stamp',i)} class="${state.stamp===i?'chosen':''}" aria-pressed="${state.stamp===i}">${name}</button>`).join('')}</div>`;
}

function buildCard(){return {...makeCard(state),...safeDecor(state)};}

function mountActivities(){
 const cleanups=[];
 const catchHost=document.querySelector('#catch-game');if(catchHost&&state.moods.length)cleanups.push(mountCatcher(catchHost,{moods:state.moods.map(id=>MOODS.find(m=>m.id===id)).filter(Boolean),already:state.caught,spriteMarkup:sprite,crystalMarkup:crystal,onCatch:n=>{state.caught=n;},onDone:()=>{root.querySelector('[data-action="next"]').disabled=false;notify('接住了，解锁一枚安心印记 ✧');}}));
 const knotHost=document.querySelector('#untangle-game');if(knotHost)cleanups.push(mountUntangle(knotHost,{progress:state.untangled,spriteMarkup:sprite,onProgress:p=>{state.untangled=p;},onDone:()=>{root.querySelector('[data-action="next"]').disabled=false;}}));
 const scratch=document.querySelector('#scratch-note');if(scratch)cleanups.push(mountScratch(scratch,()=>{document.querySelector('.scratch-caption')?.classList.add('opened');}));
 const canvas=document.querySelector('#poster');if(canvas&&state.stage===3){const dot=e=>{if(!canvas.dataset.ready)return;const r=canvas.getBoundingClientRect();state.dots=Array.isArray(state.dots)?state.dots:[];if(state.dots.length>=12){notify('星光已经够多啦，留一点空白也很好');return;}state.dots.push({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height});updatePoster();};canvas.addEventListener('click',dot);cleanups.push(()=>canvas.removeEventListener('click',dot));}
 return ()=>cleanups.forEach(f=>f());
}
prepareAtlas().catch(()=>notify('屿安的动作素材还没到，小游戏照常可以玩'));
