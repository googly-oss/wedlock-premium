(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress = $('.progress span');
  const nav = $('.site-nav');
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
    nav.classList.toggle('scrolled', scrollY > 50);
  }, {passive:true});

  const menu = $('.menu'), mobile = $('.mobile-menu');
  menu?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-hidden','true'); document.body.classList.remove('lock');
  }));

  $$('.filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('.filters button').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.g-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.hidden = !show;
    });
  }));

  const items = $$('.g-item');
  const lb = $('.lightbox'), lbImg = $('.lightbox img'), lbCap = $('.lb-caption');
  let current = 0;
  const visibleItems = () => items.filter(i => !i.hidden);
  function openLightbox(item){
    const list = visibleItems(); current = Math.max(0, list.indexOf(item));
    const src = item.dataset.full || $('img', item)?.src;
    lbImg.src = src; lbImg.alt = $('img', item)?.alt || '';
    lbCap.textContent = $('span', item)?.textContent || '';
    lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('lock');
  }
  function move(dir){ const list = visibleItems(); if(!list.length)return; current=(current+dir+list.length)%list.length; const item=list[current]; lbImg.src=item.dataset.full; lbImg.alt=$('img',item)?.alt||''; lbCap.textContent=$('span',item)?.textContent||''; }
  items.forEach(i => i.addEventListener('click',()=>openLightbox(i)));
  $('.lb-close')?.addEventListener('click', closeLightbox);
  $('.lb-prev')?.addEventListener('click',()=>move(-1)); $('.lb-next')?.addEventListener('click',()=>move(1));
  lb?.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
  function closeLightbox(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); lbImg.src=''; }
  addEventListener('keydown', e => { if(!lb.classList.contains('open')) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') move(-1); if(e.key==='ArrowRight') move(1); });
  let touchX=0;
  lb?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
  lb?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)move(dx<0?1:-1)},{passive:true});

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}), {threshold:.12}) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // Native smooth scrolling fallback for browsers where CSS scrolling is disabled.
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id=a.getAttribute('href'); if(!id || id==='#') return; const target=$(id); if(!target)return;
    e.preventDefault(); target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }));

  // Back to top is intentionally explicit and reliable.
  $('.back-top')?.addEventListener('click', e => { e.preventDefault(); scrollTo({top:0,behavior:reduced?'auto':'smooth'}); });
})();
