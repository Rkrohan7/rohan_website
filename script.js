// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== Navbar scroll state =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  })
);

// ===== Typing effect =====
const roles = [
  'Java Full Stack Developer',
  'Spring Boot & Microservices',
  'Angular + NgRx Specialist',
  'Flutter Mobile Developer',
  'REST API Architect',
];
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;
function type() {
  const current = roles[roleIdx];
  if (deleting) {
    charIdx--;
  } else {
    charIdx++;
  }
  typedEl.textContent = current.substring(0, charIdx);
  let delay = deleting ? 45 : 90;
  if (!deleting && charIdx === current.length) {
    delay = 1800; deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350;
  }
  setTimeout(type, delay);
}
type();

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Projects slider =====
(function initSlider() {
  const track = document.getElementById('projTrack');
  if (!track) return;
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('projDots');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');
  let index = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to project ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  prevBtn.addEventListener('click', () => { goTo(index - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); resetAuto(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { goTo(index + (dx < 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });

  // Auto-play
  let timer = setInterval(() => goTo(index + 1), 5000);
  function resetAuto() { clearInterval(timer); timer = setInterval(() => goTo(index + 1), 5000); }
  const slider = document.getElementById('projectSlider');
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetAuto);
})();

// ===== Contact modal + form =====
(function initContact() {
  // 👇 PASTE YOUR FREE WEB3FORMS ACCESS KEY HERE (get it at https://web3forms.com)
  //    Until you do, the form falls back to opening the visitor's email app.
  const WEB3FORMS_ACCESS_KEY = '1a405e71-f8a4-4952-adaf-3db6a1cc24f4';
  const TO_EMAIL = 'rohan.a.kadam19@gmail.com';

  const modal = document.getElementById('contactModal');
  const openBtn = document.getElementById('openContact');
  const closeBtn = document.getElementById('closeContact');
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('cfSubmit');
  const statusEl = document.getElementById('cfStatus');
  if (!modal || !openBtn) return;

  function open() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('cfName').focus(), 100);
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'form__status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    // Fallback: no key yet → open visitor's own email client pre-filled
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
      const subject = encodeURIComponent(data.subject || 'Hello from your portfolio');
      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
      setStatus('Opening your email app…', 'success');
      return;
    }

    // Web3Forms: delivers straight to inbox
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    setStatus('Sending…');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: data.name,
          name: data.name,
          email: data.email,
          subject: `[Portfolio] ${data.subject}`,
          message: `From: ${data.name} <${data.email}>\n\n${data.message}`,
          replyto: data.email,
        }),
      });
      const out = await res.json();
      if (out.success) {
        setStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
        setTimeout(close, 2200);
      } else {
        setStatus('❌ Something went wrong. Please email me directly.', 'error');
      }
    } catch (err) {
      setStatus('❌ Network error. Please try again or email me directly.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();

// ===== Animated stat counters =====
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat__num').forEach(el => statObserver.observe(el));
