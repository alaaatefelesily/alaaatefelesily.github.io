/* Links page: search + category filter + live map loader (no dependencies) */
(()=>{
  const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
  const cards=$$('.lk-card'),groups=$$('.lk-group'),chips=$$('.lk-chip'),input=$('#lkSearch'),
        empty=$('#lkEmpty'),live=$('#lkCount'),total=cards.length;
  let cat='all';

  function apply(){
    const q=(input?.value||'').trim().toLowerCase();
    const words=q.split(/\s+/).filter(Boolean);
    let shown=0;
    cards.forEach(c=>{
      const okCat=cat==='all'||c.dataset.cat===cat;
      const hay=c.dataset.search||'';
      const okText=words.every(w=>hay.includes(w));
      const show=okCat&&okText;
      c.closest('li').hidden=!show;
      if(show)shown++;
    });
    groups.forEach(g=>{g.hidden=!$$('.lk-card',g).some(c=>!c.closest('li').hidden);});
    empty.hidden=shown>0;
    if(live)live.textContent=shown?`${shown} of ${total} platforms shown`:'No platforms match your search';
  }

  function setCat(next){
    cat=next;
    chips.forEach(b=>{const on=b.dataset.filter===cat;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');
      if(on&&b.scrollIntoView)b.scrollIntoView({inline:'nearest',block:'nearest',behavior:'smooth'});});
    apply();
  }

  chips.forEach(b=>b.addEventListener('click',()=>{
    setCat(b.dataset.filter);
    try{history.replaceState(null,'',cat==='all'?location.pathname:'#'+cat);}catch(e){}
  }));
  input?.addEventListener('input',apply);
  input?.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';apply();input.blur();}});
  $('#lkReset')?.addEventListener('click',()=>{if(input)input.value='';setCat('all');});
  addEventListener('keydown',e=>{
    if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName)&&!e.metaKey&&!e.ctrlKey){e.preventDefault();input?.focus();}
  });

  /* deep link: links.html#social  /  #github */
  const h=decodeURIComponent(location.hash.slice(1));
  if(h&&chips.some(b=>b.dataset.filter===h))setCat(h);
  else apply();

  /* live map: loaded only on request (fast page, no Google requests until the visitor asks) */
  const map=$('#lkMap'),btn=$('#lkLoadMap');
  btn?.addEventListener('click',()=>{
    if(!map||map.classList.contains('live'))return;
    const f=document.createElement('iframe');
    f.src=map.dataset.src;f.title='Map of Ehnasia City, Beni Suef, Egypt';f.loading='lazy';
    f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;
    map.appendChild(f);map.classList.add('live');
  });
})();
