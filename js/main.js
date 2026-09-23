/* ====================================================
   AURÁ NATURAL HEALTH — INTERACTIONS v5
   Mobile menu, sticky nav, service tabs, testimonial
   carousel, smooth anchor scroll, hero parallax,
   IntersectionObserver reveals. All handlers guarded
   against missing elements.
   ==================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sticky nav on scroll ── */
  var sitenav = document.querySelector('.site-nav');
  if (sitenav) {
    var handleScroll = function () {
      sitenav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Mobile menu toggle ── */
  var mobTog = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (mobTog && navLinks && sitenav) {
    mobTog.addEventListener('click', function () {
      var open = sitenav.classList.toggle('nav-open');
      mobTog.setAttribute('aria-expanded', String(open));
      navLinks.setAttribute('aria-hidden', String(!open));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        sitenav.classList.remove('nav-open');
        mobTog.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Service tabs (Mind / Body / Women's Health) ── */
  var tabBtns = document.querySelectorAll('.tab-btn[role="tab"]');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('aria-controls'));
        if (!target) return;
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.service-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === target.id);
        });
      });
    });
  }

  /* ── Testimonial carousel (single card per slide) ── */
  var track = document.querySelector('#testimonialCarousel') ||
              document.querySelector('.testimonial-track');
  if (track) {
    var slides = track.children;
    var count = slides.length;
    var index = 0;
    if (count > 1) {
      var move = function (n) {
        index = (n + count) % count;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        track.setAttribute('aria-hidden', String(index !== 0));
      };
      var nextBtn = track.parentElement.querySelector('.carousel-btn.next');
      var prevBtn = track.parentElement.querySelector('.carousel-btn.prev');
      if (nextBtn) nextBtn.addEventListener('click', function () { move(index + 1); });
      if (prevBtn) prevBtn.addEventListener('click', function () { move(index - 1); });
      if (!reduceMotion) {
        var timer = setInterval(function () { move(index + 1); }, 6000);
        var car = track.closest('.testimonial-carousel');
        if (car) {
          car.addEventListener('mouseenter', function () { clearInterval(timer); });
          car.addEventListener('leave', function () {
            timer = setInterval(function () { move(index + 1); }, 6000);
          });
        }
      }
      move(0);
    }
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = sitenav ? sitenav.offsetHeight : 68;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ── Reveal-on-scroll (fade-in sections + inner reveals) ── */
  var revealEls = document.querySelectorAll('.fade-in-section, .reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Hero parallax-lite ── */
  var heroBefore = document.querySelector('.hero');
  if (heroBefore && !reduceMotion) {
    window.addEventListener('scroll', function () {
      var y = Math.min(window.scrollY, window.innerHeight);
      heroBefore.style.getPropertyValue('--parallax');
      // subtle: shift hero content slightly relative to scroll
      var content = heroBefore.querySelector('.hero-content');
      if (content) content.style.transform = 'translateY(' + (y * 0.18) + 'px)';
    }, { passive: true });
  }

  /* ── Active nav link highlight on scroll ── */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-link:not(.cta-btn)'));
  if (sections.length && navAnchors.length) {
    var setActive = function () {
      var y = window.scrollY + 140;
      var current = '';
      sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
      navAnchors.forEach(function (link) {
        var match = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', match);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
})();
