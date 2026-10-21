const tau=Math.PI*2;
export const targetAt=i=>({x:.18+((i*0.381966+.17)%1)*.64,y:.2+((i*.618034+.31)%1)*.60});
export const guideAt=u=>({x:.12+u*.76,y:.5+Math.sin(u*tau*1.4)*.19});
export function stars(ctx,w,h,time=0){
 const bg=ctx.createRadialGradient(w*.55,h*.48,0,w*.5,h*.5,w*.75);bg.addColorStop(0,'#173449');bg.addColorStop(.5,'#102539');bg.addColorStop(1,'#081523');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(let i=0;i<110;i++){const x=((Math.sin(i*231.71)*43758.5)%1+1)%1*w,y=((Math.cos(i*127.1)*3417.13)%1+1)%1*h;ctx.fillStyle=`rgba(212,228,232,${.12+.25*(.5+.5*Math.sin(i+time*.35))})`;ctx.beginPath();ctx.arc(x,y,i%13===0?1.5:.65,0,tau);ctx.fill();}
 ctx.strokeStyle='#a9cddd18';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(w*.5,h*.5,w*(.22+i*.095),h*(.19+i*.08),-.25,0,tau);ctx.stroke();}
}
export function paintField(ctx,w,h,{time=0,paths=[],pointer,phase=0,particles=[],target}={}){stars(ctx,w,h,time);
 if(phase===2){ctx.beginPath();for(let j=0;j<=100;j++){const p=guideAt(j/100);j?ctx.lineTo(p.x*w,p.y*h):ctx.moveTo(p.x*w,p.y*h);}ctx.strokeStyle='#a5ccd91c';ctx.lineWidth=48;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#b5d7df44';ctx.lineWidth=1;ctx.stroke();}
 for(let s=0;s<paths.length;s++){const path=paths[s];if(path.length<2)continue;ctx.beginPath();path.forEach((p,j)=>j?ctx.lineTo(p.x*w,p.y*h):ctx.moveTo(p.x*w,p.y*h));ctx.strokeStyle=`rgba(174,221,230,${.08+.26*(s/paths.length)})`;ctx.lineWidth=1.1;ctx.stroke();}
 for(const p of particles){ctx.fillStyle=`rgba(${p.gold?'229,202,153':'181,225,238'},${p.life*.75})`;ctx.beginPath();ctx.arc(p.x*w,p.y*h,.7+p.life*1.8,0,tau);ctx.fill();}
 if(pointer){const g=ctx.createRadialGradient(pointer.x*w,pointer.y*h,0,pointer.x*w,pointer.y*h,62);g.addColorStop(0,'#d6f4ff34');g.addColorStop(1,'#b5e7ff00');ctx.fillStyle=g;ctx.fillRect(pointer.x*w-62,pointer.y*h-62,124,124);ctx.fillStyle='#f2ead5';ctx.beginPath();ctx.arc(pointer.x*w,pointer.y*h,3,0,tau);ctx.fill();}
 if(target){const pulse=1+Math.sin(time*2)*.1;ctx.strokeStyle='#e2cf9e66';ctx.lineWidth=1;ctx.beginPath();ctx.arc(target.x*w,target.y*h,28*pulse,0,tau);ctx.stroke();}
}
function textWrap(ctx,text,x,y,width,line=38){let row='',n=0;for(const ch of text){if(ch==='\n'||ctx.measureText(row+ch).width>width){ctx.fillText(row,x,y+n++*line);row=ch==='\n'?'':ch;}else row+=ch;}if(row)ctx.fillText(row,x,y+n++*line);return n;}
export function paintStarPoster(ctx,paths,atlas,date,variant=0){const w=1200,h=1600;ctx.save();stars(ctx,w,h,0);ctx.strokeStyle='#c3ac795c';ctx.beginPath();ctx.moveTo(96,130);ctx.lineTo(1104,130);ctx.moveTo(96,1460);ctx.lineTo(1104,1460);ctx.stroke();ctx.fillStyle='#b4c7cf';ctx.font='17px "Microsoft YaHei",sans-serif';ctx.fillText('G U A N G Y U  /  指 尖 星 海',96,92);ctx.textAlign='right';ctx.fillText('A TRACE OF YOUR OWN',1104,92);ctx.textAlign='left';ctx.fillStyle='#f0eee6';ctx.font='500 79px "Microsoft YaHei",sans-serif';textWrap(ctx,variant%2?'这一片光，\n由你留下。':'不必追上所有星光，\n你自有轨迹。',96,268,1020,110);
 const real=paths.filter(p=>p.length>=2).slice(-32);const gl=ctx.createRadialGradient(600,850,20,600,850,480);gl.addColorStop(0,'#73aec12a');gl.addColorStop(1,'#73aec100');ctx.fillStyle=gl;ctx.fillRect(80,430,1040,850);
 ctx.save();ctx.translate(600,850);ctx.rotate(variant%2?.14:-.13);ctx.translate(-600,-850);
 for(let i=0;i<real.length;i++){const p=real[i];for(let k=0;k<3;k++){ctx.beginPath();p.forEach((v,j)=>{const x=130+v.x*940+(k-1)*5,y=480+v.y*650+(k-1)*8;j?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle=k===1?'#c1e7ecbb':'#8fbacc23';ctx.lineWidth=k===1?1.7:7;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}const p0=p[0],p1=p.at(-1);for(const v of [p0,p1]){ctx.fillStyle='#e8d4a3';ctx.beginPath();ctx.arc(130+v.x*940,480+v.y*650,2.7,0,tau);ctx.fill();}}
 if(!real.length){ctx.fillStyle='#a9c3ce';ctx.font='23px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('这一次，留白也是你的选择。',600,850);ctx.textAlign='left';}ctx.restore();
 if(atlas)ctx.drawImage(atlas,0,512,512,512,855,1070,250,250);
 ctx.fillStyle='#d5c397';ctx.font='18px "Microsoft YaHei",sans-serif';ctx.fillText('ONLY THIS MOMENT / 此刻的星海',96,1260);ctx.fillStyle='#b9cdd5';ctx.font='26px "Microsoft YaHei",sans-serif';textWrap(ctx,'你的每一次停留与转向，都在这里留下形状。\n这张作品记录你的动作，不定义你是谁。',96,1320,780,43);ctx.fillStyle='#92acba';ctx.font='17px "Microsoft YaHei",sans-serif';ctx.fillText(date,96,1510);ctx.textAlign='right';ctx.fillText('光屿 × 屿安  ·  BY YOU',1104,1510);ctx.restore();}
