/* ====================================================
   SRU STEELS — SHARED JAVASCRIPT
   ==================================================== */

/* ===== NAVBAR ===== */
const navbar   = document.getElementById('navbar');
const mobileMenu  = document.getElementById('mobileMenu');
const hamburger   = document.getElementById('hamburger');
const btt         = document.getElementById('btt');

// Determine if page starts with a transparent hero
const hasTransparentHero = !!document.getElementById('home-hero');

function updateNavbar() {
  const y = window.scrollY;
  if (hasTransparentHero) {
    navbar.classList.toggle('scrolled',     y > 60);
    navbar.classList.toggle('transparent', y <= 60);
  } else {
    navbar.classList.add('solid');
  }
  if (btt) btt.classList.toggle('vis', y > 400);
  revealAll();
}

// Set active nav link based on current page
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a[data-page]').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href') || '';
    if (
      (page === 'index.html' || page === '') && (href === 'index.html' || href === '#' || href === './') ||
      href.replace('./', '') === page
    ) {
      a.classList.add('active');
    }
  });
}

// Hamburger
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const s = hamburger.querySelectorAll('span');
    const open = mobileMenu.classList.contains('open');
    s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    s[1].style.opacity   = open ? '0' : '';
    s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  const s = hamburger.querySelectorAll('span');
  s[0].style.transform = s[2].style.transform = '';
  s[1].style.opacity = '';
}

// Back to top
if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Scroll listener
window.addEventListener('scroll', updateNavbar, { passive: true });
window.addEventListener('load',   updateNavbar);

/* ===== SMOOTH SCROLL (same-page anchors) ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); closeMobileMenu(); }
  });
});

/* ===== SCROLL REVEAL ===== */
function revealAll() {
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 72) el.classList.add('visible');
  });
}
window.addEventListener('load', revealAll);

/* ===== COUNTER ANIMATION ===== */
let countersRun = false;
function runCounters() {
  if (countersRun) return;
  const hero = document.getElementById('home-hero');
  if (!hero || hero.getBoundingClientRect().top > window.innerHeight) return;
  countersRun = true;
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isFloat = String(target).includes('.');
    const duration = 2000;
    const step = target / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = isFloat ? cur.toFixed(1) : Math.floor(cur).toLocaleString('en-IN');
    }, 16);
  });
}
window.addEventListener('scroll', runCounters, { passive: true });
window.addEventListener('load',   runCounters);

/* ===== INVESTOR TABS ===== */
function switchTab(id) {
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.inv-panel').forEach(p => p.classList.remove('active'));
  const clickedTab = document.querySelector(`.inv-tab[onclick*="${id}"]`);
  if (clickedTab) clickedTab.classList.add('active');
  const panel = document.getElementById('panel-' + id);
  if (panel) { panel.classList.add('active'); setTimeout(revealAll, 50); }
}

/* ===== PRODUCT FILTER ===== */
function filterProducts(category, btn) {
  // Update pills
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  // Filter cards
  document.querySelectorAll('.cat-card').forEach(card => {
    const cats = (card.dataset.categories || '').split(',');
    if (category === 'all' || cats.includes(category)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.cat-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.classList.toggle('hidden', q.length > 0 && !text.includes(q));
  });
  // Reset filter pills to 'All' when searching
  if (q.length > 0) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    const allPill = document.querySelector('.filter-pill[onclick*="all"]');
    if (allPill) allPill.classList.add('active');
  }
}

/* ===== FAQ ACCORDION ===== */
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); q.nextElementSibling.style.display = 'none'; });
  // Open clicked (if wasn't open)
  if (!isOpen) { el.classList.add('open'); answer.style.display = 'block'; }
}

/* ===== MODAL ===== */
function openModal() {
  const m = document.getElementById('quoteModal');
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal() {
  const m = document.getElementById('quoteModal');
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('DOMContentLoaded', () => {
  const m = document.getElementById('quoteModal');
  if (m) {
    m.addEventListener('click', e => { if (e.target === m) closeModal(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  setActiveNav();
  updateNavbar();
});

/* ===== FORM HANDLERS ===== */
function submitContact(e) {
  e.preventDefault();
  const ok = document.getElementById('formSuccess');
  if (ok) { ok.style.display = 'block'; e.target.reset(); setTimeout(() => ok.style.display = 'none', 6000); }
}
function submitQuote(e) {
  e.preventDefault();
  closeModal();
  setTimeout(() => alert('Thank you! Our sales team will call you within 2 hours with a competitive quote.'), 300);
}
