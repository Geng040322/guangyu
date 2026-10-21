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
// Fit every captured stroke using one uniform scale, retaining its screen aspect.
export function layoutTraces(paths=[]){
 const real=paths.filter(Array.isArray).map(p=>p.filter(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.y)).map(v=>({...v,x:v.x*(Number.isFinite(v.aspect)&&v.aspect>0?v.aspect:1100/650)}))).filter(p=>p.length>=2);
 if(!real.length)return{strokes:[],width:0,height:0,axis:'empty',center:{x:600,y:835}};
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 for(const p of real.flat()){minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);}
 const dx=maxX-minX,dy=maxY-minY,scale=Math.min(980/Math.max(dx,.00001),690/Math.max(dy,.00001)),width=dx*scale,height=dy*scale;
 const ox=600-width/2,oy=835-height/2;
 return{strokes:real.map(p=>p.map(v=>({...v,x:ox+(v.x-minX)*scale,y:oy+(v.y-minY)*scale}))),width,height,axis:dx>dy*1.3?'wide':dy>dx*1.3?'tall':'balanced',center:{x:600,y:835}};
}
export function paintStarPoster(ctx,paths,atlas,date,variant=0){
 const w=1200,h=1600,layout=layoutTraces(paths),ice=variant%2?'#e3dac4':'#c1e7ec',gold=variant%2?'#a8d4de':'#e8d4a3';ctx.save();stars(ctx,w,h,0);
 ctx.strokeStyle='#c3ac795c';ctx.beginPath();ctx.moveTo(96,130);ctx.lineTo(1104,130);ctx.moveTo(96,1460);ctx.lineTo(1104,1460);ctx.stroke();ctx.fillStyle='#b4c7cf';ctx.font='17px "Microsoft YaHei",sans-serif';ctx.fillText('G U A N G Y U  /  指 尖 星 海',96,92);ctx.textAlign='right';ctx.fillText('DRAWN BY YOUR MOVEMENTS',1104,92);ctx.textAlign='left';ctx.fillStyle='#f0eee6';ctx.font='500 76px "Microsoft YaHei",sans-serif';
 const title=layout.axis==='wide'?'你的方向，\n不止一种。':layout.axis==='tall'?'向着自己的光，\n慢慢生长。':'这一片光，\n由你留下。';textWrap(ctx,title,96,268,1020,108);
 // All visible central geometry comes from real strokes. No replacement spiral.
 const gl=ctx.createRadialGradient(600,835,20,600,835,480);gl.addColorStop(0,'#73aec11c');gl.addColorStop(1,'#73aec100');ctx.fillStyle=gl;ctx.fillRect(80,430,1040,800);
 ctx.lineCap='round';ctx.lineJoin='round';
 for(const points of layout.strokes){
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=ice+'16';ctx.lineWidth=11;ctx.stroke();
  for(let i=1;i<points.length;i++){const p=points[i],a=points[i-1],dt=Number.isFinite(p.t-a.t)?Math.max(1,p.t-a.t):20,speed=Math.hypot(p.x-a.x,p.y-a.y)/dt;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle=ice+'c0';ctx.lineWidth=Math.max(1,Math.min(3.6,3.4/(.8+speed)));ctx.stroke();if(dt>180&&Math.hypot(p.x-a.x,p.y-a.y)<14){ctx.fillStyle=gold;ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,tau);ctx.fill();}}
  for(const p of [points[0],points.at(-1)]){ctx.fillStyle=gold+'bd';ctx.beginPath();ctx.arc(p.x,p.y,2.4,0,tau);ctx.fill();}
 }
 if(!layout.strokes.length){ctx.fillStyle='#a9c3ce';ctx.font='23px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('这一次，留白也是你的选择。',600,835);ctx.textAlign='left';}
 if(atlas)ctx.drawImage(atlas,0,512,512,512,855,1180,220,220);
 ctx.fillStyle='#d5c397';ctx.font='18px "Microsoft YaHei",sans-serif';ctx.fillText('HANDWRITTEN LIGHT / '+layout.strokes.length+' 段真实笔迹',96,1250);ctx.fillStyle='#b9cdd5';ctx.font='25px "Microsoft YaHei",sans-serif';textWrap(ctx,'线条来自你的移动，微光留在停顿与转向。\n这一刻的形状，由你亲手写下。',96,1310,740,43);ctx.fillStyle='#92acba';ctx.font='17px "Microsoft YaHei",sans-serif';ctx.fillText(date,96,1510);ctx.textAlign='right';ctx.fillText('光屿 × 屿安  ·  BY YOU',1104,1510);ctx.restore();
}
