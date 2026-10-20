let pending;
export function loadAtlas(){
 if(!pending)pending=import('./atlas.mjs').then(({atlas})=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('角色素材暂时没有加载好'));img.src=atlas;})).catch(e=>{pending=null;throw e;});
 return pending;
}
export async function prepareAtlas(){
 const img=await loadAtlas();document.documentElement.style.setProperty('--yuan-atlas','url("'+img.src+'")');document.documentElement.dataset.atlas='ready';return img;
}
