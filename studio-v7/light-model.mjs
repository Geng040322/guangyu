import {readArtwork} from './light-reading.mjs?rev=read1';
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const point=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)?{x:clamp(p.x,.04,.96),y:clamp(p.y,.07,.93)}:null;
export function newArtwork(){return{dots:[],threads:[],pieces:[{x:.28,y:.58,kind:'moon',angle:-.3},{x:.52,y:.52,kind:'petal',angle:.2},{x:.72,y:.62,kind:'hill',angle:-.12}],moved:[],lamp:null};}
export function addLight(s,p,strength=.4){p=point(p);if(!p||s.dots.length>=12)return false;s.dots.push({...p,x:clamp(p.x,.08,.92),y:clamp(p.y,.12,.88),r:.018+clamp(Number.isFinite(strength)?strength:.4,0,1)*.055});return true;}
export function addThread(s,points){if(!Array.isArray(points)||s.threads.length>=6)return false;const real=points.map(point).filter(Boolean);if(real.length<2)return false;const step=Math.max(1,Math.ceil(real.length/179));const path=real.filter((_,i)=>i%step===0);if(path.at(-1)!==real.at(-1))path.push(real.at(-1));s.threads.push(path);return true;}
export function placePiece(s,id,p){p=point(p);if(!p||!Number.isInteger(id)||!s.pieces[id])return false;s.pieces[id]={...s.pieces[id],x:clamp(p.x,.16,.84),y:clamp(p.y,.2,.8)};if(!s.moved.includes(id))s.moved.push(id);return true;}
export function setLamp(s,p){p=point(p);if(!p)return false;s.lamp=p;return true;}
export function artworkLetter(s){const d=s.dots.length,t=s.threads.length,m=s.moved.length,any=d+t+m+Number(!!s.lamp)>0;
const reading=readArtwork(s);const title=m?'你可以，\n重新安排一片天地。':t?'路可以弯，\n也可以走成你的样子。':d?'你亲手，\n让这里亮了起来。':'这一页，\n也可以先留白。';
const observations=[d?'你种下了'+d+'枚光点':'',t?'织了'+t+'段线':'',m?'为'+m+'枚光片找到了位置':''].filter(Boolean);
const first=observations.length?observations.join('，')+'。这张画面里，有你亲手决定的距离、走向和位置。':(s.lamp?'你为画面留下一盏灯，其余的部分先留白。你可以决定，让作品停在哪里。':'这一次，你为画面留了一些空白。没有完成的部分，也可以停在这里；不必为了填满而填满。');
const second=m?'刚才，你把光片从原来的地方移开，让它们在新的位置相遇。生活里也可以有这样一点余地：不合适的安排，可以慢慢调整；暂时没有答案的事情，可以先空出一个位置。':t?'刚才那些线，可以转弯、相遇，也可以停下来。愿这幅小小的作品提醒你：前进的样子可以由自己决定，不必每一段都走得笔直。':d?'每一枚光，都是你亲手落下的。不必把整片夜色一次照亮；先让眼前有一点属于自己的亮，也是一件值得留下的小事。':'愿这页留白给你一点不必表现、不必交代的空间。等你愿意的时候，再留下一笔也来得及。';
const lamp=s.lamp?'最后那盏灯，停在画面的'+(s.lamp.x<.4?'左侧':s.lamp.x>.6?'右侧':'中间')+'。愿你也为自己留一个可以靠岸的位置。':'这幅画先停在这里。愿你按自己的节奏，决定下一笔。';
let seed=2166136261;for(const c of JSON.stringify(s))seed=Math.imul(seed^c.charCodeAt(0),16777619);
return{kind:any?'artwork':'open',title:reading.hasData?reading.title:title,paragraphs:[first+(reading.hasData?'我把它读作「'+reading.label+'」。':''),reading.message||second,lamp+'\n—— 屿安'],seed:seed>>>0,motif:'light',pose:m?3:t?2:0};}
