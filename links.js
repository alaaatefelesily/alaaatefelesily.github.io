
const cards=[...document.querySelectorAll('.platform-card')];
const buttons=[...document.querySelectorAll('.filter-btn[data-filter]')];
const search=document.querySelector('#platformSearch');
function filterLinks(){
  const q=(search?.value||'').toLowerCase();
  const active=document.querySelector('.filter-btn.active')?.dataset.filter||'all';
  cards.forEach(card=>{
    const matchesCat=active==='all'||card.dataset.category===active;
    const matchesText=card.textContent.toLowerCase().includes(q);
    card.style.display=matchesCat&&matchesText?'flex':'none';
  });
  document.querySelectorAll('.link-section').forEach(sec=>{
    const visible=[...sec.querySelectorAll('.platform-card')].some(c=>c.style.display!=='none');
    sec.style.display=visible?'block':'none';
  });
}
buttons.forEach(btn=>btn.addEventListener('click',()=>{
  buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');filterLinks();
}));
search?.addEventListener('input',filterLinks);
