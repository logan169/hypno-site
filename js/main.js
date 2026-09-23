/* ============================================
   VOSSHYPNOSIS — Main JavaScript
   Minimal, dependency-free, vanilla ES6+
   ============================================ */

(() => {
  'use strict';

  // ---- Mobile Navigation Toggle ----
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // ---- Sticky Nav Background on Scroll ----
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
      nav.style.boxShadow = 'none';
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Intersection Observer for Scroll Animations ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe service cards, process steps, and testimonials
  document.querySelectorAll('.service-card, .process-step, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(el);
  });

  // Stagger the animations within each grid
  document.querySelectorAll('.services__grid, .process__steps, .testimonials__grid').forEach(grid => {
    const cards = grid.children;
    Array.from(cards).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ---- Navbar active link highlight on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__links a:not(.btn--nav)');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(item => {
          item.style.color = '';
          if (item.getAttribute('href') === `#${id}`) {
            item.style.color = 'var(--accent-green)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Contact Form Handling ----
  const contactForm = document.querySelector('.contact__form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Placeholder: replace with your actual backend/form endpoint
      console.log('Contact form submission:', data);

      // Show success feedback
      const btn = contactForm.querySelector('.btn--primary');
      const originalText = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--accent-green)';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---- Typing Animation for Terminal ----
  const terminalBody = document.querySelector('.hero__terminal-body');
  if (terminalBody) {
    const fadeElements = terminalBody.querySelectorAll('.fade-in');
    fadeElements.forEach((el, i) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '1';
      }, 2000 + (i * 400));
    });
  }

  // ---- Console Easter Egg ----
  console.log(
    '%c Welcome to Voss Hypnosis ',
    'background: #10b981; color: white; font-size: 16px; padding: 4px 8px; border-radius: 4px;'
  );

})();
