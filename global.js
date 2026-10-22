const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const menuButton = document.querySelector('[data-menu]');
const navLinks = document.querySelector('.nav-links');

const savedTheme = localStorage.getItem('theme');
root.dataset.theme = savedTheme || 'dark';

function updateThemeIcon(){
  if(!themeButton) return;
  themeButton.innerHTML = root.dataset.theme === 'dark'
    ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  if(window.lucide) lucide.createIcons();
}
updateThemeIcon();

themeButton?.addEventListener('click',()=>{
  const apply=()=>{root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme',root.dataset.theme);updateThemeIcon();};
  if(!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches){apply();return;}
  const r=themeButton.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,
    end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  root.classList.add('tt');
  const t=document.startViewTransition(apply);
  t.ready.then(()=>root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${end}px at ${x}px ${y}px)`]},
    {duration:1000,easing:'cubic-bezier(.16,1,.3,1)',pseudoElement:'::view-transition-new(root)'}));
  t.finished.finally(()=>root.classList.remove('tt'));
});

menuButton?.addEventListener('click',()=>{
  navLinks?.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>navLinks?.classList.remove('open'));
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.10});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function toast(message){
  let el=document.querySelector('.toast');
  if(!el){ el=document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent=message; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2200);
}
window.toast=toast;

document.querySelectorAll('[data-copy]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText(btn.dataset.copy);
      toast('Copied successfully');
    }catch(e){ toast('Copy failed'); }
  });
});

/* Premium glass interaction: cards follow the cursor with a soft highlight. */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',`${e.clientX-r.left}px`);
    card.style.setProperty('--my',`${e.clientY-r.top}px`);
  });
});

/* Subtle 3D tilt for the portrait. */
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(1000px) rotateY(${x*7}deg) rotateX(${-y*6}deg)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

/* Lightweight ambient particles — no library required. */
const canvas=document.getElementById('ambient-canvas');
if(canvas){
  const ctx=canvas.getContext('2d');
  const isMobile=matchMedia('(max-width:760px)').matches;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2), particles=[];
  let lastWidth=innerWidth, running=!document.hidden;

  function resize(){
    w=innerWidth; h=innerHeight; canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);
    const density=isMobile?26000:18000, cap=isMobile?35:90;
    const count=Math.min(cap,Math.floor(w*h/density));
    particles=Array.from({length:count},()=>({
      x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.7+.3,
      vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,a:Math.random()*.45+.08
    }));
  }

  function frame(){
    if(running){
      ctx.clearRect(0,0,w,h);
      const dark=root.dataset.theme==='dark';
      for(const p of particles){
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=dark?`rgba(255,255,255,${p.a})`:`rgba(10,10,12,${p.a*.5})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }

  function debounce(fn,wait){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),wait);};}

  // On mobile, scrolling hides/shows the browser's address bar, which fires a
  // 'resize' event even though the page WIDTH never changed. Rebuilding the
  // canvas on every one of those events is exactly what caused the repeated
  // flicker — so we only react when the width actually changes.
  function handleResize(){
    if(Math.abs(innerWidth-lastWidth)<2) return;
    lastWidth=innerWidth;
    resize();
  }

  document.addEventListener('visibilitychange',()=>{running=!document.hidden;});
  addEventListener('resize',debounce(handleResize,150),{passive:true});

  resize();
  if(!reduceMotion) frame(); else ctx.clearRect(0,0,w,h);
}
if(window.lucide) lucide.createIcons();
/* header shadow on scroll */
const hdr=document.querySelector('.site-header');
if(hdr){const f=()=>hdr.classList.toggle('scrolled',scrollY>8);f();addEventListener('scroll',f,{passive:true});}
/* contact form -> opens the visitor's email app with the message prefilled */
const cf=document.getElementById('contactForm');
cf?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(cf),body=`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nProject type: ${d.get('type')}\n\n${d.get('details')}`;
  location.href=`mailto:${cf.dataset.mailto}?subject=${encodeURIComponent('Portfolio inquiry from '+d.get('name'))}&body=${encodeURIComponent(body)}`;
  toast(cf.dataset.toast||'Opening your email app…');
});
/* skill bars fill when visible */
document.querySelectorAll('.progress').forEach(p=>observer.observe(p));


/* ===== Smooth, inertial scrolling + smooth anchor navigation (Lenis) ===== */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar=document.createElement('div');bar.className='scroll-bar';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  const setBar=()=>{const m=root.scrollHeight-innerHeight;root.style.setProperty('--sp',m>0?Math.min(1,Math.max(0,scrollY/m)).toFixed(4):0);};
  addEventListener('scroll',setBar,{passive:true});addEventListener('resize',setBar);setBar();
  document.querySelectorAll('textarea,.calc-display').forEach(el=>el.setAttribute('data-lenis-prevent',''));
  let lenis=null;
  if(window.Lenis&&!reduce){
    lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});
    window.lenis=lenis;
    const loop=t=>{lenis.raf(t);requestAnimationFrame(loop);};requestAnimationFrame(loop);
  }
  const norm=p=>p.replace(/index\.html$/,'');
  const goTo=(hash,instant)=>{
    const id=decodeURIComponent(hash.slice(1));
    const el=id&&id!=='top'?document.getElementById(id):null;
    if(id&&id!=='top'&&!el)return false;
    if(lenis){ if(el) lenis.scrollTo(el,{offset:-12,duration:instant?0:1.6,immediate:!!instant,easing:t=>1-Math.pow(1-t,4)}); else lenis.scrollTo(0,{duration:instant?0:1.6,immediate:!!instant,easing:t=>1-Math.pow(1-t,4)}); }
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
