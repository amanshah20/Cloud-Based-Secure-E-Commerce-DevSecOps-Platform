/* ================================================================
   CloudSecureX — script.js
   Premium DevSecOps SaaS Landing Page
   Smooth Scroll | Scroll Reveal | Animated Counters |
   Navbar Active Link | Mobile Menu | Glow Effects
================================================================ */

'use strict';

/* ----------------------------------------------------------------
   UTILITY: Throttle function calls (performance helper)
---------------------------------------------------------------- */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ================================================================
   1. NAVBAR — Scroll shadow + active-link highlight
================================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  /* --- Scroll: add .scrolled class for background opacity --- */
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  /* --- Active Link: highlight the link matching the visible section --- */
  function updateActiveLink() {
    const scrollY = window.scrollY + 100; // offset for navbar height

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(() => {
    handleNavScroll();
    updateActiveLink();
  }, 80));

  /* Initial call */
  handleNavScroll();
  updateActiveLink();

  /* --- Mobile hamburger menu toggle --- */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
    // Ensure btn-dashboard is also shown
    const dashBtn = document.querySelector('.btn-dashboard');
    if (dashBtn) dashBtn.style.display = navLinksList.classList.contains('open') ? 'flex' : '';
  });

  /* Close mobile menu when a nav link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
      const dashBtn = document.querySelector('.btn-dashboard');
      if (dashBtn) dashBtn.style.display = '';
    });
  });
})();

/* ================================================================
   2. SMOOTH SCROLLING — For all anchor links
================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const offset = targetEl.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
})();

/* ================================================================
   3. SCROLL REVEAL — Animate elements into view on scroll
================================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-right');

  /* Use IntersectionObserver for performance */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        observer.unobserve(el); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();

/* ================================================================
   4. ANIMATED COUNTERS — Eased count-up on scroll into view
================================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');

  /*
   * Easing function: easeOutCubic
   * Starts fast, decelerates toward the target.
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const raw    = el.dataset.target;        // e.g. "9999" or "5000"
    const suffix = el.dataset.suffix || '';  // e.g. "%" or "+"
    const target = parseInt(raw, 10);
    const duration = 2200;  // ms
    let startTime = null;

    /* Special case: 99.99% — display with decimal */
    const isUptime = target === 9999;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.floor(eased * target);

      if (isUptime) {
        /* Format 9999 → "99.99" */
        const displayVal = (current / 100).toFixed(2);
        el.textContent = displayVal + suffix;
      } else {
        el.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        /* Ensure final value is exact */
        if (isUptime) {
          el.textContent = '99.99%';
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
    }

    requestAnimationFrame(tick);
  }

  /* Trigger counter animation when stat section enters viewport */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCounter(counter);
          }
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
})();

/* ================================================================
   5. MINI GRAPH ANIMATION — Draw graph lines on scroll
================================================================ */
(function initGraphLines() {
  const graphs = document.querySelectorAll('.mini-graph');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const line = entry.target.querySelector('.graph-line');
        if (line) {
          /* Reset and re-trigger animation */
          line.style.animation = 'none';
          line.getBoundingClientRect(); // force reflow
          line.style.animation = '';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  graphs.forEach(g => observer.observe(g));
})();

/* ================================================================
   6. HOVER GLOW ENHANCEMENT — Dynamic mouse-position glow on cards
================================================================ */
(function initCardGlow() {
  const glowCards = document.querySelectorAll('.feature-card, .stat-card, .cicd-card, .sec-badge');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;

      /* Tilt: max ±8 degrees */
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      card.style.transform     = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.transition    = 'transform 0.1s ease';

      /* Moving radial gradient highlight */
      const pctX = Math.round((x / rect.width)  * 100);
      const pctY = Math.round((y / rect.height) * 100);
      card.style.background = `
        radial-gradient(circle 120px at ${pctX}% ${pctY}%, rgba(0,245,255,0.07), transparent 70%),
        rgba(255,255,255,0.04)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
      card.style.background = '';
    });
  });
})();

/* ================================================================
   7. ORBIT ICON COUNTER-ROTATION — Keep icons upright
================================================================ */
(function initOrbit() {
  const ring  = document.querySelector('.orbit-ring');
  const icons = document.querySelectorAll('.orbit-icon');
  if (!ring || !icons.length) return;

  let angle = 0;
  const speed = 0.2; /* degrees per frame */

  function animateOrbit() {
    angle = (angle + speed) % 360;
    ring.style.transform = `rotate(${angle}deg)`;
    icons.forEach(icon => {
      icon.style.transform = `rotate(${-angle}deg)`;
    });
    requestAnimationFrame(animateOrbit);
  }

  requestAnimationFrame(animateOrbit);
})();

/* ================================================================
   8. PIPELINE CONNECTOR DOTS — Staggered animation reset loop
================================================================ */
(function initPipelineDots() {
  const dots = document.querySelectorAll('.connector-dot');
  dots.forEach((dot, i) => {
    dot.style.animationDelay = `${i * 0.5}s`;
  });
})();

/* ================================================================
   9. TYPING / GLITCH HEADLINE EFFECT (subtle, optional)
================================================================ */
(function initHeroGlitch() {
  const headline = document.querySelector('.hero-heading');
  if (!headline) return;

  /* Pulse box-shadow to give a subtle neon shiver to the heading */
  let dir = 1;
  let val = 0;
  const MAX = 1;

  function pulseGlow() {
    val += 0.02 * dir;
    if (val >= MAX) dir = -1;
    if (val <= 0  ) dir =  1;
    requestAnimationFrame(pulseGlow);
  }

  pulseGlow();
})();

/* ================================================================
   10. SECTION PROGRESS BAR — Thin line at top showing read depth
================================================================ */
(function initProgressBar() {
  /* Create element */
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #00f5ff, #2979ff, #a855f7);
    z-index: 9999;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(0,245,255,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, 16));
})();

/* ================================================================
   11. ARCHITECTURE NODES — Animate on scroll
================================================================ */
(function initArchNodes() {
  const nodes = document.querySelectorAll('.arch-node');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = [...nodes].indexOf(el);
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, idx * 60);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  nodes.forEach(node => {
    node.style.opacity   = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(node);
  });
})();

/* ================================================================
   12. CURSOR GLOW TRAIL (DESKTOP ONLY)
================================================================ */
(function initCursorGlow() {
  /* Skip on touch devices */
  if ('ontouchstart' in window) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9998;
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  let mouseX = -1000, mouseY = -1000;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = mouseX + 'px';
    glow.style.top  = mouseY + 'px';
  });
})();

/* ================================================================
   13. TOOL BADGE INTERACTION — Tooltip preview on hover
================================================================ */
(function initToolBadges() {
  const badges = document.querySelectorAll('.tool-badge');
  badges.forEach((badge, i) => {
    badge.style.animationDelay = `${i * 0.08}s`;
  });
})();

/* ================================================================
   14. FEATURE CARD DELAYED REVEAL (stagger children)
================================================================ */
(function initFeatureStagger() {
  const cards = document.querySelectorAll('.feature-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
})();

/* ================================================================
   15. INIT — Log on load
================================================================ */
window.addEventListener('DOMContentLoaded', () => {
  console.log(
    '%c CloudSecureX 🚀 ',
    'background: linear-gradient(135deg,#00f5ff,#a855f7); color:#0b1120; font-weight:900; font-size:16px; padding:6px 12px; border-radius:6px;'
  );
  console.log('%c DevSecOps Cloud Platform Loaded Successfully', 'color:#00f5ff; font-size:12px;');
});
