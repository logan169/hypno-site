/* ====================================================
   AURÁ NATURAL HEALTH — Interactions & Scripts
   Mobile menu toggle, IntersectionObserver fade-ins,
   testimonial carousel, sticky scroll effects.
   ==================================================== */

(function() {
  'use strict';

  // ── DOM refs ───────────────────────────
  const mobTog = document.getElementById('mobTog');
  const mobMenu = document.getElementById('mobMenu');
  const sitenav = document.getElementById('sitenav');
  const closeMob = mobMenu ? mobMenu.querySelector('.close-mobile') : null;
  const tracks = document.querySelectorAll('#testimonialTrack');
  let currentSlide = 0;

  // ── Mobile menu toggle ─────────────────
  if (mobTog && mobMenu) {
    mobTog.addEventListener('click', function() {
      const isOpen = mobMenu.classList.contains('show');
      mobMenu.classList.toggle('show');
      mobMenu.setAttribute('aria-hidden', isOpen);
      mobTog.setAttribute('aria-expanded', !isOpen);
    });

    closeMob.addEventListener('click', function() {
      mobMenu.classList.remove('show');
      mobMenu.setAttribute('aria-hidden', 'true');
      mobTog.setAttribute('aria-expanded', 'false');
    });

    // Close menu on link click
    mobMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobMenu.classList.remove('show');
        mobMenu.setAttribute('aria-hidden', 'true');
        mobTog.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Sticky nav shadow on scroll ─────────
  let lastScroll = 0;
  function handleScroll() {
    const y = window.scrollY;
    if (sitenav) {
      sitenav.classList.toggle('scrolled', y > 60);
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Fade-in on scroll via IntersectionObserver ──
  function observeFadeEls() {
    var els = document.querySelectorAll('.fade-in-section');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

      els.forEach(function(el) { observer.observe(el); });
    } else {
      // Fallback: just show everything
      els.forEach(function(el) { el.classList.add('visible'); });
    }
  }

  // ── Testimonial carousel ───────────────
  function initCarousel() {
    if (!tracks.length || !tracks[0].children.length) return;
    
    var slides = tracks[0].children;
    currentSlide = 0;

    function showSlide(n) {
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }
      slides[n].classList.add('active');
    }

    // Next button
    var nextBtn = document.getElementById('testNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }

    // Prev button
    var prevBtn = document.getElementById('testPrev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }

    // Auto-advance every 6s
    setInterval(function() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 6000);
  }

  // ── Active nav link highlight on scroll ──
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-list a:not(.nav-cta-btn)');
    if (!sections.length || !navLinks.length) return;

    var scrollY = window.scrollY + 120;
    var current = '';

    sections.forEach(function(sec) {
      if (sec.offsetTop <= scrollY) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ── Smooth scroll for anchor links ───────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = sitenav ? sitenav.offsetHeight : 68;
          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ── Parallax-lite on hero ──────────────
  function parallaxHero() {
    var bg = document.querySelector('.hero .parallax-bg');
    if (!bg) return;
    var scrollY = window.scrollY;
    var speed = 0.3;
    bg.style.backgroundPositionY = scrollY * speed + 'px';
  }

  // ── Boot ───────────────────────────────
  function ready() {
    observeFadeEls();
    initCarousel();
    updateActiveNav();
    initSmoothScroll();
    
    // Parallax on scroll
    window.addEventListener('scroll', parallaxHero, { passive: true });

    // Update active nav periodically
    var navInterval = null;
    function startNavWatch() {
      navInterval = setInterval(updateActiveNav, 250);
    }
    startNavWatch();
    
    // Handle initial state after page load finishes rendering
    setTimeout(observeFadeEls, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

})();
