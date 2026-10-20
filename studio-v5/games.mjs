export function mountCatcher(host,{moods,onCatch,onDone,spriteMarkup,crystalMarkup,already=0}){
 let caught=already,stopped=false,raf,lastSpawn=0,x=.5,items=[],spawnCount=0;
 host.innerHTML=`<div class="sky-dust" aria-hidden="true"></div><div class="catch-meter" role="status">已接住 <b>${caught}</b> / 3</div><div class="catch-player" tabindex="0" role="group" aria-label="屿安的接住位置，用左右方向键移动">${spriteMarkup(1,'catch-avatar','屿安伸手接住晶体')}<div class="catch-bowl"></div></div><p class="catch-guide">左右拖动屿安，或直接点晶体</p>`;
 const player=host.querySelector('.catch-player'),meter=host.querySelector('.catch-meter b'),guide=host.querySelector('.catch-guide');
 const setX=v=>{x=Math.max(.12,Math.min(.88,v));player.style.left=`${x*100}%`;};
 const move=e=>{if(e.buttons||e.pointerType==='touch'){const r=host.getBoundingClientRect();setX((e.clientX-r.left)/r.width);}};
 const down=e=>{if(!e.target.closest('.falling-crystal')){host.setPointerCapture(e.pointerId);const r=host.getBoundingClientRect();setX((e.clientX-r.left)/r.width);}};
 const keys=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setX(x+(e.key==='ArrowLeft'?-.08:.08));}};
 function capture(item){
  if(item.done||stopped)return;item.done=true;item.el.remove();caught++;meter.textContent=Math.min(3,caught);
  player.classList.remove('catch-pop');void player.offsetWidth;player.classList.add('catch-pop');onCatch(Math.min(3,caught));
  if(caught>=3){stopped=true;items.forEach(i=>i.el.remove());player.innerHTML=spriteMarkup(4,'catch-avatar','屿安开心地举手庆祝')+'<div class="catch-bowl"></div>';guide.textContent='接住了。先在这里歇一会儿。';host.classList.add('game-complete');onDone();}
 }
 function spawn(now){const m=moods[spawnCount++%moods.length],el=document.createElement('button');el.type='button';el.className='falling-crystal';el.setAttribute('aria-label',`接住${m.short}晶体`);el.innerHTML=crystalMarkup(m.color,m.shape)+`<span>${m.short}</span>`;const item={el,x:.16+Math.random()*.68,start:now,duration:6500+Math.random()*2000,done:false};el.onclick=()=>capture(item);host.append(el);items.push(item);}
 function frame(now){
  if(stopped)return;const r=host.getBoundingClientRect();
  if(!lastSpawn||now-lastSpawn>1450){spawn(now);lastSpawn=now;}
  for(const item of items){if(item.done)continue;const t=(now-item.start)/item.duration;item.el.style.left=`${item.x*100}%`;item.el.style.top=`${-40+t*(r.height+55)}px`;
   if(t>.69&&t<.9&&Math.abs(item.x-x)<Math.max(.1,50/r.width))capture(item);
   else if(t>1){item.done=true;item.el.remove();}
  }
  items=items.filter(i=>!i.done);if(!stopped)raf=requestAnimationFrame(frame);
 }
 host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);player.addEventListener('keydown',keys);
 if(caught>=3){stopped=true;guide.textContent='已经接住了，随时可以继续。';host.classList.add('game-complete');}else raf=requestAnimationFrame(frame);
 return ()=>{stopped=true;cancelAnimationFrame(raf);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);player.removeEventListener('keydown',keys);items.forEach(i=>i.el.remove());};
}

export function mountUntangle(host,{progress=0,onProgress,onDone,spriteMarkup}){
 let value=Math.max(0,Math.min(1,progress)),drawing=false,last=null,finished=value>=1;
 const paths=Array.from({length:22},(_,i)=>{const a=i*.69,x=210+Math.cos(a)*100,y=170+Math.sin(a)*95;return `<path d="M ${x} ${y} C ${60+i*9} ${-20+i*13}, ${420-i*10} ${360-i*8}, ${210+Math.sin(a)*105} ${170+Math.cos(a)*92} C ${300-i*3} ${20+i*3}, ${20+i*8} ${290-i*4}, ${x} ${y}"/>`;}).join('');
 host.innerHTML=`<div class="knot-art" role="img" aria-label="缠绕的情绪光线"><svg viewBox="0 0 420 340" aria-hidden="true">${paths}</svg><div class="knot-core">✦</div></div><div class="knot-yuan">${spriteMarkup(finished?2:3,'','屿安陪你解开线团')}</div><div class="knot-progress" role="progressbar" aria-label="松开线团进度" aria-valuemin="0" aria-valuemax="100"><i></i></div><button class="knot-tap">轻点一下，也能松开</button><span class="knot-status" role="status"></span>`;
 const art=host.querySelector('.knot-art'),svg=host.querySelector('svg'),bar=host.querySelector('.knot-progress'),status=host.querySelector('.knot-status'),tap=host.querySelector('.knot-tap');
 const update=()=>{const percent=Math.round(value*100);bar.setAttribute('aria-valuenow',percent);bar.querySelector('i').style.width=percent+'%';svg.style.opacity=1-value*.9;svg.style.transform=`scale(${1-value*.25}) rotate(${value*50}deg)`;host.style.setProperty('--untangled',value);status.textContent=finished?'松开了。给自己一个抱抱。':`${percent}% · 轻轻划过光线`;onProgress(value);};
 function add(amount){if(finished)return;value=Math.min(1,value+amount);if(value>=1){finished=true;host.classList.add('game-complete');tap.textContent='已经松开了 ✧';host.querySelector('.knot-yuan').innerHTML=spriteMarkup(2,'','屿安闭眼抱住晶体');onDone();}update();}
 const down=e=>{drawing=true;last=[e.clientX,e.clientY];art.setPointerCapture(e.pointerId);};
 const move=e=>{if(!drawing||!last)return;const distance=Math.hypot(e.clientX-last[0],e.clientY-last[1]);last=[e.clientX,e.clientY];add(Math.min(40,distance)/650);};
 const up=()=>{if(drawing)add(.055);drawing=false;last=null;};
 art.addEventListener('pointerdown',down);art.addEventListener('pointermove',move);art.addEventListener('pointerup',up);art.addEventListener('pointercancel',up);tap.onclick=()=>add(.15);if(finished)host.classList.add('game-complete');update();
 return ()=>{art.removeEventListener('pointerdown',down);art.removeEventListener('pointermove',move);art.removeEventListener('pointerup',up);art.removeEventListener('pointercancel',up);tap.onclick=null;};
}

export function mountScratch(canvas,onReveal){
 const c=canvas.getContext('2d');if(!c){onReveal();return ()=>{};}
 canvas.width=640;canvas.height=200;
 const g=c.createLinearGradient(0,0,640,200);g.addColorStop(0,'#b6c7e6');g.addColorStop(.55,'#e2e7f1');g.addColorStop(1,'#bdcbe0');c.fillStyle=g;c.fillRect(0,0,640,200);
 c.fillStyle='#61799d';c.textAlign='center';c.font='24px sans-serif';c.fillText('✧  擦一擦，拆开屿安的小纸条',320,112);
 let down=false,last=null,distance=0,done=false;
 function reveal(){if(done)return;done=true;canvas.hidden=true;onReveal();}
 const start=e=>{down=true;last=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);erase(e);};
 function erase(e){if(!down||done)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*640/r.width,y=(e.clientY-r.top)*200/r.height;c.globalCompositeOperation='destination-out';c.beginPath();c.arc(x,y,34,0,Math.PI*2);c.fill();if(last)distance+=Math.hypot(e.clientX-last[0],e.clientY-last[1]);last=[e.clientX,e.clientY];if(distance>280)reveal();}
 const stop=()=>{down=false;last=null;};const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal();}};
 canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',erase);canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('keydown',key);
 return ()=>{canvas.removeEventListener('pointerdown',start);canvas.removeEventListener('pointermove',erase);canvas.removeEventListener('pointerup',stop);canvas.removeEventListener('pointercancel',stop);canvas.removeEventListener('keydown',key);};
}
