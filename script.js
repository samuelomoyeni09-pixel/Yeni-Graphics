/* ===== mobile menu ===== */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ===== gallery filtering ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.g-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    cards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hide', !show);
    });
  });
});

/* ===== lightbox ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
let visibleCards = [];
let lbIndex = 0;

function getVisible(){
  return [...cards].filter(c => !c.classList.contains('hide'));
}
function showLb(i){
  visibleCards = getVisible();
  if (i < 0) i = visibleCards.length - 1;
  if (i >= visibleCards.length) i = 0;
  lbIndex = i;
  const card = visibleCards[i];
  const img = card.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.innerHTML = card.dataset.title +
    '<small>' + card.dataset.catname + '</small>';
}
cards.forEach(card => {
  card.addEventListener('click', () => {
    visibleCards = getVisible();
    showLb(visibleCards.indexOf(card));
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLb(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', e => {
  e.stopPropagation(); showLb(lbIndex - 1);
});
document.getElementById('lbNext').addEventListener('click', e => {
  e.stopPropagation(); showLb(lbIndex + 1);
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLb();
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  if (e.key === 'ArrowRight') showLb(lbIndex + 1);
});

/* ===== count-up for stats ===== */
function countUp(el){
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.max(1, Math.round(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.querySelectorAll('.count').forEach(countUp);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const statBar = document.querySelector('.hero-stats');
if (statBar) statsObserver.observe(statBar);

/* ===== scroll reveal ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.bar i').forEach(bar => {
        bar.style.width = bar.dataset.w;
      });
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
