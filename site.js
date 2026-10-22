(()=>{
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- scroll-driven items: word reveal, hero pin, horizontal trip gallery ---- */
const items=[];
document.querySelectorAll('.words').forEach(el=>{
  el.setAttribute('aria-label',el.textContent.trim());
  const w=el.textContent.trim().split(/\s+/);const hl=(el.dataset.hl||'').split(',').map(t=>t.trim()).filter(Boolean);el.innerHTML=w.map(x=>`<span aria-hidden="true"${hl.includes(x.replace(/[.,،]/g,''))?' class="hl"':''}>${x}</span>`).join('');
  items.push({el,kind:'w',spans:[...el.children],cur:0,tgt:0});
});
document.querySelectorAll('.pin').forEach(el=>items.push({el,kind:'pin',cur:0,tgt:0}));
const gallery=document.querySelector('.pin-x');
function layoutGallery(){
  if(!gallery||reduce)return;
  const track=gallery.querySelector('.jtrack');
  const travel=Math.max(0,track.scrollWidth-document.documentElement.clientWidth);
  gallery.style.setProperty('--travel',travel+'px');
  gallery.style.height=Math.round(innerHeight+travel*1.15)+'px';
}
const measure=it=>{
  const r=it.el.getBoundingClientRect(),h=innerHeight;
  it.tgt=it.kind==='pin'?clamp(-r.top/Math.max(1,r.height-h)):clamp((h*.88-r.top)/(h*.5+r.height*.9));
};
const paint=it=>{
  if(it.kind==='pin') it.el.style.setProperty('--p',it.cur.toFixed(4));
  else{const n=it.spans.length;it.spans.forEach((s,i)=>s.style.opacity=(.16+.84*clamp(it.cur*(n+3)-i)).toFixed(3));}
};
let raf=0;
function tick(){
  let busy=false;
  for(const it of items){
    const d=it.tgt-it.cur;
    if(window.lenis||reduce||Math.abs(d)<.0004){it.cur=it.tgt;}else{it.cur+=d*.16;busy=true;}
    paint(it);
  }
  raf=busy?requestAnimationFrame(tick):0;
}

/* ---- nav: sliding glass pill + scroll-spy ---- */
const nav=document.querySelector('.nav-links');
const links=[...document.querySelectorAll('.nav-links a[href^="#"]')];
let pill=null,active=null;
if(nav){pill=document.createElement('span');pill.className='nav-pill';pill.setAttribute('aria-hidden','true');nav.prepend(pill);}
function place(a){
  if(!pill)return;
  if(!a){pill.style.opacity='0';return;}
  pill.style.opacity='1';
  pill.style.width=a.offsetWidth+'px';pill.style.height=a.offsetHeight+'px';
  pill.style.transform=`translate3d(${a.offsetLeft}px,${a.offsetTop}px,0)`;
}
function setActive(a){
  if(a===active)return;
  active=a;links.forEach(l=>l.classList.toggle('on',l===a));place(a);
  if(pill&&!pill.classList.contains('ready'))requestAnimationFrame(()=>requestAnimationFrame(()=>pill.classList.add('ready')));
}
function spy(){
  let cur=null;
  for(const a of links){const s=document.getElementById(a.hash.slice(1));if(s&&s.getBoundingClientRect().top<=innerHeight*.42)cur=a;}
  setActive(cur);
}
nav?.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const a=e.target.closest('a');if(a)place(a);});
nav?.addEventListener('pointerleave',()=>place(active));
nav?.addEventListener('focusin',e=>{const a=e.target.closest('a');if(a)place(a);});
nav?.addEventListener('focusout',()=>place(active));

const par=[];
const doPar=()=>{if(reduce)return;par.forEach(im=>{const r=im.parentElement.getBoundingClientRect();const c=(r.top+r.height/2-innerHeight/2)/innerHeight;im.style.transform=`translate3d(0,${(c*-7).toFixed(2)}%,0) scale(1.14)`;});};
const kick=()=>{
  items.forEach(measure);spy();doPar();
  if(!raf)raf=requestAnimationFrame(tick);
};
function relayout(){layoutGallery();place(active);kick();}
addEventListener('scroll',kick,{passive:true});
addEventListener('resize',relayout);
addEventListener('load',relayout);
document.fonts&&document.fonts.ready.then(relayout);
layoutGallery();kick();
})();
