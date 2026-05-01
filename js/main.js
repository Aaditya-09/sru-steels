/* ====================================================
   SRU STEELS — SHARED JAVASCRIPT
   ==================================================== */

// ── Replace this with your Railway URL after deployment ──────────────────────
const API_URL = "sru-steels-production.up.railway.app";
// ─────────────────────────────────────────────────────────────────────────────

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const btt = document.getElementById('btt');

const hasTransparentHero = !!document.getElementById('home-hero');

function updateNavbar() {
  const y = window.scrollY;
  if (hasTransparentHero) {
    navbar.classList.toggle('scrolled', y > 60);
    navbar.classList.toggle('transparent', y <= 60);
  } else {
    navbar.classList.add('solid');
  }
  if (btt) btt.classList.toggle('vis', y > 400);
  revealAll();
}

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

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const s = hamburger.querySelectorAll('span');
    const open = mobileMenu.classList.contains('open');
    s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    s[1].style.opacity = open ? '0' : '';
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

if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

window.addEventListener('scroll', updateNavbar, { passive: true });
window.addEventListener('load', updateNavbar);

/* ===== SMOOTH SCROLL ===== */
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
window.addEventListener('load', runCounters);

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
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.cat-card').forEach(card => {
    const cats = (card.dataset.categories || '').split(',');
    card.classList.toggle('hidden', category !== 'all' && !cats.includes(category));
  });
}

function searchProducts(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.cat-card').forEach(card => {
    card.classList.toggle('hidden', q.length > 0 && !card.textContent.toLowerCase().includes(q));
  });
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
  document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); q.nextElementSibling.style.display = 'none'; });
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
  if (m) m.addEventListener('click', e => { if (e.target === m) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  setActiveNav();
  updateNavbar();
});

/* ===== FORM HELPERS ===== */
function setButtonLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.original;
  }
}

/* ===== CONTACT FORM ===== */
async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  // Collect all named inputs in order
  const inputs = form.querySelectorAll('input, select, textarea');
  const data = {
    name: inputs[0].value.trim(),
    company: inputs[1].value.trim(),
    email: inputs[2].value.trim(),
    phone: inputs[3].value.trim(),
    enquiry_type: inputs[4].value,
    product: inputs[5].value,
    message: inputs[6].value.trim(),
  };

  setButtonLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Server error');
    form.reset();
    if (success) {
      success.style.display = 'block';
      setTimeout(() => success.style.display = 'none', 6000);
    }
  } catch (err) {
    alert('Something went wrong. Please call us directly on +91 11 2668 4500.');
  } finally {
    setButtonLoading(btn, false);
  }
}

/* ===== QUOTE MODAL FORM ===== */
async function submitQuote(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select');

  const data = {
    name: inputs[0].value.trim(),
    phone: inputs[1].value.trim(),
    product: inputs[2].value,
    quantity: inputs[3].value.trim() || 'Not specified',
  };

  setButtonLoading(btn, true);
  try {
    const res = await fetch(`${API_URL}/api/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Server error');
    closeModal();
    setTimeout(() => alert('✅ Quote request sent! Our sales team will call you within 2 hours.'), 300);
    form.reset();
  } catch (err) {
    alert('Something went wrong. Please call us on +91 11 2668 4500.');
  } finally {
    setButtonLoading(btn, false);
  }
}