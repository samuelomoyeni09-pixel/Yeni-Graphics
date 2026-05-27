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

/* ===== scroll reveal (mobile-safe) ===== */
const revealEls = document.querySelectorAll('.reveal');
function revealEl(el){
  el.classList.add('in');
  el.querySelectorAll('.bar i').forEach(bar => {
    bar.style.width = bar.dataset.w;
  });
}
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        revealEl(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 120px 0px' });
  revealEls.forEach(el => io.observe(el));
  setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('in')) revealEl(el);
    });
  }, 3000);
} else {
  revealEls.forEach(revealEl);
}

/* =========================================================
   ORDER FORM  ->  WhatsApp / Email
   --- To change where orders go, edit the two lines below ---
   ========================================================= */
const WHATSAPP_NUMBER = '2348054965524';                 // your WhatsApp number, no + or spaces
const ORDER_EMAIL     = 'samuelomoyeni.09@gmail.com';     // your email address

const orderForm = document.getElementById('orderForm');

function buildOrderMessage(){
  const name    = document.getElementById('cName').value.trim();
  const phone   = document.getElementById('cPhone').value.trim();
  const type    = document.getElementById('cType').value;
  const pkg     = document.getElementById('cPackage').value;
  const details = document.getElementById('cDetails').value.trim();
  return "Hello Yeni Graphics! I'd like to order a design.\n\n"
    + "Name: " + name + "\n"
    + "Phone: " + phone + "\n"
    + "Design type: " + type + "\n"
    + "Package: " + pkg + "\n"
    + "Details: " + (details || "-");
}

if (orderForm){
  /* Submit -> open WhatsApp with the order pre-filled.
     The browser checks required fields before this runs. */
  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const url = 'https://wa.me/' + WHATSAPP_NUMBER +
                '?text=' + encodeURIComponent(buildOrderMessage());
    window.open(url, '_blank');
  });

  /* "Send by email instead" link */
  const emailLink = document.getElementById('emailInstead');
  if (emailLink){
    emailLink.addEventListener('click', e => {
      e.preventDefault();
      const name  = document.getElementById('cName').value.trim();
      const phone = document.getElementById('cPhone').value.trim();
      const type  = document.getElementById('cType').value;
      if (!name || !phone || !type){
        alert('Please fill in your name, phone number and design type first.');
        return;
      }
      const subject = 'New design order from ' + name;
      const url = 'mailto:' + ORDER_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(buildOrderMessage());
      window.location.href = url;
    });
  }
}

/* Pricing buttons -> preselect package + scroll to the form */
document.querySelectorAll('.price-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = document.getElementById('cPackage');
    if (sel) sel.value = btn.dataset.package;
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
  });
});
