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

// ===== Projects grid + detail modal =====
(function initProjects() {
  const grid = document.getElementById('projectsGrid');
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('projectModalBody');
  if (!grid || !modal) return;

  const projects = [
    {
      badge: '🏢 Real Estate · Mobile',
      title: 'MDOC — Real Estate CRM, DMS & Booking Platform',
      desc: 'A production-grade Flutter mobile app — live on both the Google Play Store and Apple App Store — powering enterprise-scale real estate CRM, document management and booking workflows, backed by Spring Boot REST APIs.',
      points: [
        'Built modules for Lead Management, Pre/Post-Sales, Token (EOI), Booking Events, Customer & Document Management (DMS).',
        'Engineered 8+ app flavors from a single codebase for client-specific branding & workflows.',
        'Implemented dashboards, follow-ups, calendar scheduling, analytics & secure file management.',
        'Integrated JWT + Spring Security auth; optimized performance & stability across Android and iOS.',
      ],
      tags: ['Flutter', 'Java', 'Spring Boot', 'Spring Security', 'JWT', 'REST APIs', 'MySQL', 'AWS', 'Git'],
      links: [
        { label: 'Google Play', icon: '▶', url: 'https://play.google.com/store/apps/details?id=com.mdocbox' },
        { label: 'App Store', icon: '', url: 'https://apps.apple.com/in/app/mymdoc/id1609352325' },
      ],
    },
    {
      badge: '🎬 Talent Hiring · Live',
      title: 'iCastar — Talent Hiring & Artist Job Portal',
      desc: 'A production talent-hiring platform connecting artists with recruiters and casting agencies, built with Spring Boot REST APIs and a React.js frontend — live and serving real users.',
      points: [
        'Recruiter modules for job posting, applicant management & talent discovery.',
        'Artist features — profile & portfolio management, job search & application tracking.',
        'Secure auth with Spring Security + JWT; scalable DB & API design.',
        'Delivered end-to-end: development, testing, deployment & production support.',
      ],
      tags: ['Java', 'Spring Boot', 'React.js', 'Spring Security', 'JWT', 'REST APIs', 'MySQL', 'AWS', 'Git'],
      links: [{ label: 'Visit Live Site', icon: '🌐', url: 'https://icastar.com/' }],
    },
    {
      badge: '🤖 Automation · MERN',
      title: 'AutoJozy — Job Search & Application Automation',
      desc: 'A job-application automation platform that streamlines job discovery and applying across recruitment portals — built on a React.js + Node.js stack with intelligent profile matching.',
      points: [
        'Built automation workflows for job discovery, profile updates & application management.',
        'Auto-identifies recommended jobs via user preferences & profile-matching criteria.',
        'Responsive React.js dashboards to monitor activities, status & workflows.',
        'Secure Node.js/Express REST APIs for workflow orchestration & user management.',
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'MySQL', 'Automation', 'Git'],
      links: [],
    },
    {
      badge: '🏦 Banking Domain',
      title: 'Credit Processing System',
      desc: 'Engineered Spring Boot microservices for borrower onboarding and credit-processing workflows, with secure REST APIs and role-based access control via Spring Security.',
      points: [
        'Built Angular (v8–15) modules with NgRx for complex forms & workflows.',
        'Implemented role-based access control with Spring Security.',
        'Migrated legacy JSP modules to Angular.',
        'Optimized DB queries to improve API response time.',
      ],
      tags: ['Java', 'Spring Boot', 'Microservices', 'Angular', 'NgRx', 'RxJS', 'MySQL'],
      links: [],
    },
    {
      badge: '🌾 GovTech / Land Records',
      title: 'Bhoomi22 — Land Records Management',
      desc: 'Architected backend REST APIs for land-record processing and built React.js UI components for data entry and visualization, deployed on AWS.',
      points: [
        'Integrated AWS S3 for document upload & download.',
        'Implemented Redis caching to reduce API response time by ~40%.',
        'Built React.js components for data entry & visualization.',
        'Handled production deployments & issue resolution on AWS.',
      ],
      tags: ['Java 8', 'Spring Boot', 'Hibernate', 'React.js', 'MySQL', 'AWS', 'Redis'],
      links: [],
    },
  ];

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Build a compact card element for project index i
  function buildCard(p, i) {
    const card = document.createElement('article');
    card.className = 'pcard';
    card.tabIndex = 0;
    card.dataset.index = i;
    card.setAttribute('role', 'button');
    card.innerHTML = `
      <span class="pcard__badge">${esc(p.badge)}</span>
      <h3 class="pcard__title">${esc(p.title)}</h3>
      <p class="pcard__desc">${esc(p.desc)}</p>
      <span class="pcard__more">…more <span aria-hidden="true">→</span></span>
      <div class="pcard__tags">${p.tags.slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</div>`;
    return card;
  }

  // Render cards twice for a seamless infinite marquee loop
  projects.forEach((p, i) => grid.appendChild(buildCard(p, i)));
  projects.forEach((p, i) => {
    const clone = buildCard(p, i);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    grid.appendChild(clone);
  });

  // Delegated open (works for originals + clones)
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.pcard');
    if (card) openProject(+card.dataset.index);
  });
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.pcard');
    if (card) { e.preventDefault(); openProject(+card.dataset.index); }
  });

  function openProject(i) {
    const p = projects[i];
    body.innerHTML = `
      <span class="pm__badge">${esc(p.badge)}</span>
      <h3 class="pm__title" id="pmTitle">${esc(p.title)}</h3>
      <p class="pm__desc">${esc(p.desc)}</p>
      <ul class="pm__points">${p.points.map(pt => `<li>${esc(pt)}</li>`).join('')}</ul>
      <div class="pm__tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      ${p.links.length ? `<div class="pm__links">${p.links.map(l =>
        `<a href="${l.url}" target="_blank" rel="noopener" class="store-btn"><span>${l.icon}</span> ${esc(l.label)}</a>`).join('')}</div>` : ''}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeProject() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('closeProject').addEventListener('click', closeProject);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProject));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProject(); });
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
