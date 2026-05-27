/**
 * SIVSA app.js — Interacciones principales
 * Cursor glow · Navbar scroll · Mobile nav · IntersectionObserver
 * Contador animado · Smooth scroll
 */
(function initApp() {
  'use strict';

  // ─── Cursor glow (Reflejo effect) ──────────────────────────────────────
  const glow = document.getElementById('cursor-glow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    (function animGlow() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animGlow);
    })();
  }

  // ─── Navbar — add .scrolled class on scroll ────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ─── Mobile nav toggle ─────────────────────────────────────────────────
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── Scroll reveal (IntersectionObserver) ──────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    // Fallback: show all
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // ─── Animated counters ─────────────────────────────────────────────────
  function runCounter(el, target, suffix) {
    const duration = 1600;
    const start    = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);  // cubic ease-out
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const card   = e.target;
          const target = parseInt(card.dataset.count, 10);
          const suffix = card.dataset.suffix || '';
          const numEl  = card.querySelector('.stat-num');
          if (numEl && target) runCounter(numEl, target, suffix);
          counterObs.unobserve(card);
        }
      });
    }, { threshold: 0.55 });

    document.querySelectorAll('.stat-card[data-count]').forEach(el => counterObs.observe(el));
  }

  // ─── Smooth scroll for anchor links ────────────────────────────────────
  const NAV_H = 72;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
