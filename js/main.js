/* MARION — interactions (vanilla, no dependencies, no-JS safe) */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile menu ── */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var nav = document.querySelector('.site-nav');
  if (burger && mobileMenu && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Témoignages carousel ── */
  var track = document.getElementById('tstTrack');
  var prev = document.getElementById('tstPrev');
  var next = document.getElementById('tstNext');
  if (track && prev && next) {
    var cards = track.querySelectorAll('.tst-card');
    var idx = 0;
    var per = 1;
    var max = Math.max(0, cards.length - per);
    function update() {
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      prev.disabled = idx === 0;
      next.disabled = idx >= max;
      prev.style.opacity = prev.disabled ? '.35' : '1';
      next.style.opacity = next.disabled ? '.35' : '1';
    }
    prev.addEventListener('click', function () { idx = Math.max(0, idx - 1); update(); });
    next.addEventListener('click', function () { idx = Math.min(max, idx + 1); update(); });
    update();
  }

  /* ── Contact form (client-side placeholder — à brancher plus tard sur un service d'envoi) ── */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (note) note.hidden = false;
      form.reset();
    });
  }

  /* ── Reveal-on-scroll (progressive enhancement ; la page est fully visible sans JS) ── */
  var fadeEls = document.querySelectorAll('.fade');
  if (fadeEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('fx-fade');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }
})();
