const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const menuButton = document.querySelector('[data-menu]');
const navLinks = document.querySelector('.nav-links');
const isAr = root.lang === 'ar';

/* one shared animation-frame loop: every scroll-linked effect runs inside the same frame as the smooth scroller,
   so nothing lags behind the page and nothing runs twice */
const frameHooks = window.frameHooks = [];

/* ===== theme ===== */
let savedTheme=null;try{savedTheme=localStorage.getItem('theme');}catch(e){}
root.dataset.theme = savedTheme || 'dark';
const metaTheme=document.querySelector('meta[name="theme-color"]');
function syncThemeUI(){
  const dark = root.dataset.theme === 'dark';
  if(themeButton){
    themeButton.setAttribute('aria-checked', dark ? 'true' : 'false');
    themeButton.setAttribute('aria-label', isAr ? (dark ? 'الوضع الليلي: مفعّل' : 'الوضع الليلي: متوقف') : (dark ? 'Dark mode: on' : 'Dark mode: off'));
  }
  if(metaTheme) metaTheme.setAttribute('content', dark ? '#000000' : '#f4f4f2');
}
syncThemeUI();

themeButton?.addEventListener('click',()=>{
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply=()=>{
    root.dataset.theme = next;
    try{localStorage.setItem('theme',next);}catch(e){}
    syncThemeUI();
  };
  root.classList.add('no-tr');               /* no element animates while colours swap */
  const done=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('no-tr')));
  if(!document.startViewTransition){apply();done();return;}
  const r=themeButton.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,
    end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  root.classList.add('tt');
  const t=document.startViewTransition(apply);
  t.ready.then(()=>root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${end}px at ${x}px ${y}px)`]},
    {duration:700,easing:'cubic-bezier(.16,1,.3,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
  t.finished.finally(()=>{root.classList.remove('tt');done();});
});

/* ===== menu ===== */
const closeMenu=()=>{navLinks?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');};
menuButton?.addEventListener('click',()=>{
  const o=navLinks?.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',o?'true':'false');
});
document.addEventListener('click',e=>{
  if(navLinks?.classList.contains('open')&&!e.target.closest('.site-header')) closeMenu();
});
addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks?.classList.contains('open')){closeMenu();menuButton?.focus();}});
addEventListener('scroll',()=>{if(navLinks?.classList.contains('open')) closeMenu();},{passive:true});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks?.classList.remove('open')));

/* ===== reveal on scroll (opacity + transform only) ===== */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el=entry.target;
    el.classList.add('visible');
    observer.unobserve(el);
    /* once revealed, drop the stagger delay so hover effects respond instantly */
    if(el.classList.contains('reveal')) setTimeout(()=>el.style.setProperty('--d','0s'),2200);
  });
},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.progress').forEach(p=>observer.observe(p));

/* ===== toast / copy ===== */
function toast(message){
  let el=document.querySelector('.toast');
  if(!el){ el=document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent=message; el.classList.add('show');
  clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200);
}
window.toast=toast;
document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast(isAr?'تم النسخ بنجاح':'Copied successfully');
    }catch(e){ toast(isAr?'تعذّر النسخ':'Copy failed'); }
  });
});

/* ===== glass highlight that follows the cursor (throttled to one write per frame) ===== */
document.querySelectorAll('.card').forEach(card=>{
  let raf=0,ex=0,ey=0;
  card.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    ex=e.clientX;ey=e.clientY;
    if(raf) return;
    raf=requestAnimationFrame(()=>{raf=0;const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${ex-r.left}px`);card.style.setProperty('--my',`${ey-r.top}px`);});
  },{passive:true});
});

/* ===== subtle 3D tilt ===== */
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(1000px) rotateY(${x*7}deg) rotateX(${-y*6}deg)`;
  },{passive:true});
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

if(window.lucide) lucide.createIcons();

/* ===== contact form -> opens the visitor's email app with the message prefilled ===== */
const cf=document.getElementById('contactForm');
cf?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(cf),body=`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nProject type: ${d.get('type')}\n\n${d.get('details')}`;
  location.href=`mailto:${cf.dataset.mailto}?subject=${encodeURIComponent('Portfolio inquiry from '+d.get('name'))}&body=${encodeURIComponent(body)}`;
  toast(cf.dataset.toast||'Opening your email app…');
});

/* ===== Smooth scrolling (Lenis, lerp mode) + smooth anchor navigation + shared frame loop ===== */
(()=>{
  const bar=document.createElement('div');bar.className='scroll-bar';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  document.querySelectorAll('textarea,.calc-display').forEach(el=>el.setAttribute('data-lenis-prevent',''));

  let lenis=null;
  if(window.Lenis){
    /* lerp mode = the scroll position glides toward the target every frame (feels like iOS inertia).
       Touch devices keep their native momentum scrolling, which is already the smoothest possible there. */
    lenis=new Lenis({lerp:.09,smoothWheel:true,wheelMultiplier:.95,syncTouch:false});
    window.lenis=lenis;
  }
  const loop=t=>{
    if(lenis) lenis.raf(t);
    const y=scrollY;
    for(let i=0;i<frameHooks.length;i++) frameHooks[i](y,t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* page height is measured only when the layout changes, never inside the scroll loop */
  let docMax=0;
  const measureDoc=()=>{docMax=Math.max(0,root.scrollHeight-innerHeight);};
  if(window.ResizeObserver) new ResizeObserver(measureDoc).observe(document.body);
  addEventListener('resize',measureDoc);addEventListener('load',measureDoc);measureDoc();
  window.docMax=()=>docMax;

  /* progress bar + header shadow */
  const hdr=document.querySelector('.site-header');
  let lastBar=-1,scrolled=false;
  frameHooks.push(y=>{
    if(y===lastBar) return;lastBar=y;
    bar.style.setProperty('--sp',docMax>0?Math.min(1,Math.max(0,y/docMax)).toFixed(4):0);
    const s=y>8;if(hdr&&s!==scrolled){scrolled=s;hdr.classList.toggle('scrolled',s);}
  });

  const ease=t=>1-Math.pow(1-t,4);
  const norm=p=>p.replace(/index\.html$/,'');
  const goTo=(hash,instant)=>{
    const id=decodeURIComponent(hash.slice(1));
    const el=id&&id!=='top'?document.getElementById(id):null;
    if(id&&id!=='top'&&!el)return false;
    if(lenis){ lenis.scrollTo(el||0,{offset:el?-12:0,duration:instant?0:1.6,immediate:!!instant,easing:ease}); }
    else{ if(el) el.scrollIntoView({behavior:instant?'auto':'smooth',block:'start'}); else scrollTo({top:0,behavior:instant?'auto':'smooth'}); }
    return true;
  };
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;
    const u=new URL(a.href,location.href);
    if(u.origin!==location.origin||norm(u.pathname)!==norm(location.pathname)||!u.hash)return;
    if(goTo(u.hash)){e.preventDefault();history.pushState(null,'',u.hash);}
  });
  if(location.hash) addEventListener('load',()=>setTimeout(()=>goTo(location.hash,true),60),{once:true});
})();

/* ===== custom site scrollbar (native scrollbar is hidden in CSS) ===== */
(()=>{
  const track=document.createElement('div');track.className='cscroll';track.setAttribute('aria-hidden','true');
  const thumb=document.createElement('div');thumb.className='cscroll-thumb';track.appendChild(thumb);document.body.appendChild(track);
  const de=root;let drag=null,lastY=-1,lastWake=0,shown=false,thumbH=0,vh=innerHeight,visible=true;
  const max=()=>window.docMax?window.docMax():Math.max(0,de.scrollHeight-innerHeight);
  const jump=y=>{y=Math.max(0,Math.min(max(),y));if(window.lenis)window.lenis.scrollTo(y,{immediate:true,force:true});else scrollTo(0,y);};
  const layout=()=>{
    vh=innerHeight;const m=max();
    visible=m>=8;track.style.display=visible?'':'none';
    thumbH=Math.max(44,Math.round(vh*vh/de.scrollHeight));thumb.style.height=thumbH+'px';lastY=-1;
  };
  const wake=t=>{lastWake=t||performance.now();if(!shown){shown=true;track.classList.add('on');}};
  frameHooks.push((y,t)=>{
    if(y!==lastY){lastY=y;wake(t);
      if(visible){const m=max();thumb.style.transform='translate3d(0,'+((vh-thumbH)*(m?y/m:0)).toFixed(1)+'px,0)';}}
    if(shown&&!drag&&t-lastWake>1100){shown=false;track.classList.remove('on');}
  });
  if(window.ResizeObserver)new ResizeObserver(layout).observe(document.body);
  addEventListener('resize',layout);addEventListener('load',layout);layout();
  addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&(e.clientX>innerWidth-40||(e.clientX<40&&de.dir==='rtl')))wake();},{passive:true});
  thumb.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();drag={y:e.clientY,s:scrollY};track.classList.add('drag');de.classList.add('cs-drag');thumb.setPointerCapture(e.pointerId);});
  thumb.addEventListener('pointermove',e=>{if(!drag)return;const room=vh-thumbH;if(room>0)jump(drag.s+(e.clientY-drag.y)*(max()/room));});
  const end=()=>{if(!drag)return;drag=null;track.classList.remove('drag');de.classList.remove('cs-drag');wake();};
  thumb.addEventListener('pointerup',end);thumb.addEventListener('pointercancel',end);
  track.addEventListener('pointerdown',e=>{if(e.target!==track)return;const room=vh-thumbH;if(room>0)jump(((e.clientY-thumbH/2)/room)*max());});
})();
