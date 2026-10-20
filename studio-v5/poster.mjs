import {MOODS,PALETTES,cardMessage,wrapText} from './model.mjs';
import {loadAtlas} from './characters.mjs';
import {safeDecor} from './model.mjs';
export function loadArt(){return loadAtlas();}
function line(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function star(ctx,x,y,r,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-r);ctx.quadraticCurveTo(x+1,y-1,x+r,y);ctx.quadraticCurveTo(x+1,y+1,x,y+r);ctx.quadraticCurveTo(x-1,y+1,x-r,y);ctx.quadraticCurveTo(x-1,y-1,x,y-r);ctx.fill();ctx.restore();}
export function drawCrystal(ctx,x,y,size,color,rotation=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.shadowColor=color;ctx.shadowBlur=24;
 const points=[[0,-size],[size*.54,-size*.1],[size*.35,size*.52],[0,size],[-size*.42,size*.38],[-size*.53,-size*.18]];
 const g=ctx.createLinearGradient(-size,-size,size,size);g.addColorStop(0,'#ffffff');g.addColorStop(.35,color);g.addColorStop(.65,'#f2f4ff');g.addColorStop(1,color);
 ctx.fillStyle=g;ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.fill();ctx.shadowBlur=0;
 ctx.strokeStyle='#ffffffaa';ctx.lineWidth=1.5;ctx.stroke();for(const [px,py] of points)line(ctx,0,0,px,py);line(ctx,points[1][0],points[1][1],points[5][0],points[5][1]);ctx.restore();
}
export async function renderPoster(canvas,card){
 const img=await loadArt();canvas.width=1200;canvas.height=1600;const c=canvas.getContext('2d');if(!c)throw Error('当前浏览器暂不支持生成海报');
 const p=PALETTES[card.palette]??PALETTES.gold;const dark=card.palette==='night';
 c.fillStyle=p.bg;c.fillRect(0,0,1200,1600);
 let g=c.createRadialGradient(600,650,0,600,650,620);g.addColorStop(0,p.orb+(dark?'aa':'88'));g.addColorStop(.6,p.orb+'33');g.addColorStop(1,p.bg+'00');c.fillStyle=g;c.fillRect(0,120,1200,1200);
 // Fine luminous orbits and flowing threads echo the exhibition boards.
 c.save();c.globalAlpha=dark?.34:.28;c.strokeStyle=p.accent;c.lineWidth=1;
 for(let i=0;i<12+(card.weight||3)*2;i++){c.beginPath();c.moveTo(-80,620+i*11);c.bezierCurveTo(260,1030-i*9,860,180+i*15,1300,670+i*13);c.stroke();}
 for(let i=0;i<3;i++){c.beginPath();c.ellipse(600,720,430+i*40,180+i*24,-.18,0,Math.PI*2);c.stroke();}c.restore();
 let seed=(card.seed||17)+1;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<90;i++){const x=80+rnd()*1040,y=210+rnd()*820,r=1+rnd()*3;c.fillStyle=dark?'#ecedff88':p.accent+'66';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();if(i%13===0)star(c,x,y,r*4,dark?'#fff5dc':p.accent);}
 c.strokeStyle=p.accent+'77';c.lineWidth=1;c.strokeRect(38,38,1124,1524);line(c,70,144,1130,144);line(c,70,1455,1130,1455);
 c.fillStyle=p.ink;c.textAlign='left';c.font='500 31px "Microsoft YaHei","PingFang SC",sans-serif';c.fillText('光屿',76,108);c.font='17px sans-serif';c.fillText('GUANGYU / EMOTIONAL ATELIER',164,106);
 c.textAlign='right';c.fillStyle=p.muted;c.font='18px sans-serif';c.fillText('显愈之境 · 情绪显影所',1124,106);
 c.textAlign='center';c.fillStyle=p.muted;c.font='19px sans-serif';c.fillText('A LITTLE LIGHT, JUST FOR YOU',600,222);
 c.fillStyle=p.ink;c.font='500 52px "Microsoft YaHei","PingFang SC",sans-serif';c.fillText(card.layout===0?'把此刻，轻轻收藏':'让每一种情绪，安心落地',600,310);
 const centerY=card.layout===0?679:644;
 // Contain the complete original character, with no crop or distortion.
 const maxW=card.layout===0?650:570,maxH=card.layout===0?680:600;
 const decor=safeDecor(card),cellW=img.naturalWidth/3,cellH=img.naturalHeight/2;
 const scale=Math.min(maxW/cellW,maxH/cellH),w=cellW*scale,h=cellH*scale;
 c.save();c.shadowColor=dark?'#9bb4ff33':'#7988b020';c.shadowBlur=30;c.drawImage(img,(decor.pose%3)*cellW,Math.floor(decor.pose/3)*cellH,cellW,cellH,600-w/2,centerY-h/2,w,h);c.restore();
 card.moods.forEach((id,i)=>{const m=MOODS.find(v=>v.id===id);const x=[235,978,265][i],y=[520,710,865][i];drawCrystal(c,x,y,25+(card.weight||3)*2+i*4,m.color,(i-.5)*.3);c.fillStyle=p.muted;c.font='22px "Microsoft YaHei",sans-serif';c.textAlign='center';c.fillText(m.short,x,y+68);});
 c.fillStyle=p.accent;c.font='18px sans-serif';c.fillText('RECEIVE  /  REVEAL  /  BECOME',600,1030);
 const message=cardMessage(card);c.fillStyle=p.ink;c.font='500 43px "Microsoft YaHei","PingFang SC",sans-serif';
 const messageLines=wrapText(message,t=>c.measureText(t).width,970);messageLines.forEach((s,i)=>c.fillText(s,600,1112+i*66));
 c.fillStyle=p.muted;c.font='24px "Microsoft YaHei","PingFang SC",sans-serif';c.fillText(`此刻想要 · ${card.need}`,600,1274);
 if(card.note){c.font='25px "Microsoft YaHei","PingFang SC",sans-serif';const lines=wrapText(card.note.replace(/[\r\n]+/g,' '),t=>c.measureText(t).width,960);lines.forEach((s,i)=>c.fillText(s,600,1340+i*38));}else{c.font='24px "Microsoft YaHei","PingFang SC",sans-serif';c.fillText(`正在长成 · ${card.ability}`,600,1356);}
 c.fillStyle=p.muted;c.font='18px sans-serif';c.textAlign='left';c.fillText(card.date,76,1504);c.textAlign='right';c.fillText('屿安，陪你慢慢来。',1124,1504);
 for(const dot of decor.dots)star(c,dot.x*1200,dot.y*1600,13,dark?'#f6e2b4':p.accent);
 c.save();c.translate(1030,232);c.rotate(.1);c.strokeStyle=p.accent+'88';c.lineWidth=1.3;c.beginPath();c.arc(0,0,47,0,Math.PI*2);c.stroke();c.beginPath();c.arc(0,0,40,0,Math.PI*2);c.stroke();c.fillStyle=p.accent;c.textAlign='center';c.font='15px "Microsoft YaHei",sans-serif';c.fillText(['慢慢来','有被接住','心有晴光','给自己留白'][decor.stamp],0,5);c.restore();
 if(decor.stars.length){c.save();c.strokeStyle=p.accent+'99';c.lineWidth=1;const coords=[[110,340],[160,370],[210,345]];c.beginPath();coords.slice(0,decor.stars.length).forEach(([x,y],i)=>{i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();for(const [x,y] of coords.slice(0,decor.stars.length))star(c,x,y,5,p.accent);c.restore();}
 return canvas;
}
