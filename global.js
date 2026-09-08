const root = document.documentElement;
const themeButton = document.querySelector('[data-theme-toggle]');
const menuButton = document.querySelector('[data-menu]');
const navLinks = document.querySelector('.nav-links');

const savedTheme = localStorage.getItem('theme');
root.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function updateThemeIcon(){
  if(!themeButton) return;
  themeButton.innerHTML = root.dataset.theme === 'dark'
    ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  if(window.lucide) lucide.createIcons();
}
updateThemeIcon();

themeButton?.addEventListener('click',()=>{
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme',root.dataset.theme);
  updateThemeIcon();
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

/* Subtle 3D parallax for the portrait scene. */
document.querySelectorAll('[data-tilt]').forEach(scene=>{
  const card=scene.querySelector('.photo-card');
  if(!card) return;
  scene.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r=scene.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*7}deg) rotateZ(1deg) translateY(-4px)`;
  });
  scene.addEventListener('pointerleave',()=>card.style.transform='');
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
        ctx.fillStyle=dark?`rgba(150,205,255,${p.a})`:`rgba(70,120,210,${p.a*.55})`;
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