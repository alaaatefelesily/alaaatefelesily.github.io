/* v6 effects: loader, split text, hero lens, cursor, magnetic, marquee, parallax */
(()=>{
const root=document.documentElement,ar=root.lang==='ar';
const reduce=false;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const heroH1=$('#top h1');
const ready=()=>{root.classList.add('ready');if(heroH1)setTimeout(()=>heroH1.classList.add('in'),120);};

/* intro loader (home page, once per session) */
let seen=false;try{seen=!!sessionStorage.getItem('ld');}catch(e){}
if(heroH1&&!seen&&!reduce){
  const L=document.createElement('div');L.className='loader';L.setAttribute('aria-hidden','true');
  const ch=(t,o)=>[...t].map((c,i)=>`<span style="--ci:${i+o}">${c}</span>`).join('');
  L.innerHTML='<b><em>'+ch('dev',0)+'</em><u>'+ch('.alaa',3)+'</u></b><small>Software Engineer</small><i></i>';
  document.body.appendChild(L);
  try{sessionStorage.setItem('ld','1');}catch(e){}
  setTimeout(()=>{L.classList.add('out');setTimeout(ready,350);setTimeout(()=>L.remove(),1500);},1350);
}else ready();

/* split text: letters (EN) / words (AR) */
function split(el){
  if(el.dataset.s)return;el.dataset.s=1;
  el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
  let ci=0;
  const walk=node=>[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){
      const f=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t=>{
        if(!t)return;if(/^\s+$/.test(t)){f.append(' ');return;}
        const w=document.createElement('span');w.className='sw';w.setAttribute('aria-hidden','true');
        const mk=(txt,k)=>{const c=document.createElement('span');c.className='ch';c.style.setProperty('--ci',k);c.textContent=txt;w.append(c);};
        if(ar)mk(t,ci++*4);else[...t].forEach(ch=>mk(ch,ci++));
        f.append(w);
      });
      n.replaceWith(f);
    }else if(n.nodeType===1&&n.tagName!=='BR')walk(n);
  });
  walk(el);
}
const targets=$$('#top h1,.section-head h2,.page-hero h1,.cta h2').filter(e=>!e.id);
targets.forEach(split);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.3});
targets.filter(e=>e!==heroH1).forEach(e=>io.observe(e));

/* auto stagger for grouped cards */
$$('.grid,.skills-grid,.jgrid,.bento,.steps,.stat-grid').forEach(p=>{
  [...p.children].filter(c=>c.classList.contains('reveal')).forEach((c,i)=>{if(!c.style.getPropertyValue('--d'))c.style.setProperty('--d',(i*.09)+'s');});
});

/* hero portrait: 3D tilt, glare that follows the cursor, inner parallax */
const pimg=$('.pimg'),pf=$('#top .pframe'),pw=$('#top .pwrap');
if(pimg&&pf&&fine&&!reduce){
  let tx=0,ty=0,cx=0,cy=0,on=false,raf=0;
  const step=()=>{cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;
    pf.style.transform=`perspective(1100px) rotateY(${(cx*9).toFixed(2)}deg) rotateX(${(-cy*7).toFixed(2)}deg)`;
    pimg.style.setProperty('--ix',(cx*-14).toFixed(1)+'px');pimg.style.setProperty('--iy',(cy*-12).toFixed(1)+'px');
    raf=(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)?requestAnimationFrame(step):0;};
  pf.addEventListener('pointermove',e=>{
    const r=pf.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;
    pimg.style.setProperty('--gx',((tx+.5)*100).toFixed(1)+'%');pimg.style.setProperty('--gy',((ty+.5)*100).toFixed(1)+'%');
    pimg.classList.add('on');if(!raf)raf=requestAnimationFrame(step);
  });
  pf.addEventListener('pointerleave',()=>{tx=ty=0;pimg.classList.remove('on');if(!raf)raf=requestAnimationFrame(step);});
  let ppx=0,ppy=0,pq=0;addEventListener('pointermove',e=>{ppx=((e.clientX/innerWidth)-.5)*30;ppy=((e.clientY/innerHeight)-.5)*30;if(!pq)pq=requestAnimationFrame(()=>{pq=0;pw.style.setProperty('--px',ppx.toFixed(2));pw.style.setProperty('--py',ppy.toFixed(2));});},{passive:true});
}

/* magnetic controls (custom cursor removed) */
if(fine&&!reduce){
  $$('.btn,.icon-btn,.social.icon-only,.brand').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();
      el.style.setProperty('--tx',((e.clientX-r.left-r.width/2)*.28).toFixed(1)+'px');
      el.style.setProperty('--ty',((e.clientY-r.top-r.height/2)*.36).toFixed(1)+'px');});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--tx','0px');el.style.setProperty('--ty','0px');});
  });
}

/* footer wordmark: jumping letters that flip fill/outline, plus a marquee */
const fb=$('.site-footer .footer-bottom');
if(fb&&!$('.wordmark')){
  const wm=document.createElement('div');wm.className='wordmark';wm.setAttribute('role','img');wm.setAttribute('aria-label','dev.alaa');
  const items=['dev.alaa','Software Engineer','UI/UX','Web','AI','Problem solving'];
  const track=[...items,...items].map(t=>`<span>${t}</span><span>✦</span>`).join('');
  wm.innerHTML='<span class="wm-in" aria-hidden="true">'+[...'dev.alaa'].map((c,i)=>`<span class="wl" style="--k:${i}"><span>${c}</span></span>`).join('')+'</span><div class="wm-marq" aria-hidden="true"><div>'+track+track+'</div></div>';
  fb.parentElement.insertBefore(wm,fb);
  const go=()=>wm.classList.add('in');
  if(reduce||!('IntersectionObserver' in window))go();
  else{new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){go();o.disconnect();}}),{threshold:.05}).observe(wm);setTimeout(()=>{if(wm.getBoundingClientRect().top<innerHeight)go();},2500);}
  if(fine&&!reduce){
    wm.addEventListener('pointermove',e=>{$$('.wl',wm).forEach(l=>{const r=l.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.width/2)),R=r.width*1.3;
      l.style.setProperty('--lift',d<R?(1-d/R).toFixed(2):0);});});
    wm.addEventListener('pointerleave',()=>$$('.wl',wm).forEach(l=>l.style.setProperty('--lift',0)));
  }
}
/* film grain */
if(!reduce){const g=document.createElement('div');g.className='grain';g.setAttribute('aria-hidden','true');document.body.appendChild(g);}

/* scroll-velocity marquee + image parallax */
const mt=$('.mtrack'),imgs=$$('.about-photo img,.jcard img');
let x=0,vel=0,last=scrollY;
if(mt&&!reduce){mt.parentElement.style.direction='ltr';}
const frame=()=>{
  const dy=scrollY-last;last=scrollY;vel+=(dy-vel)*.08;
  if(mt&&!reduce){const half=mt.scrollWidth/2;x-=(ar?-1:1)*(.7+vel*.45);if(x<=-half)x+=half;if(x>0)x-=half;mt.style.transform=`translate3d(${x}px,0,0) skewX(${Math.max(-8,Math.min(8,-vel*.35))}deg)`;}
  if(!reduce&&(dy!==0||!frame.init)){frame.init=1;
    const H=innerHeight,rs=imgs.map(im=>im.parentElement.getBoundingClientRect());
    imgs.forEach((im,i)=>{const r=rs[i];if(r.bottom<0||r.top>H)return;
      im.style.translate='0 '+(((r.top+r.height/2-H/2)/H)*-8).toFixed(2)+'%';});}
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
})();
