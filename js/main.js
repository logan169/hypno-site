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

  /* ── Témoignages carrousel — glissable (pointer), sans flèches ── */
  var track = document.getElementById('tstTrack');
  if (track) {
    var idx = 0;
    var max = track.children.length - 1; // 1 carte visible à la fois
    function clamp() { idx = Math.max(0, Math.min(max, idx)); }
    function render() { track.style.transform = 'translateX(-' + (idx * 100) + '%)'; }
    // Pointeur (souris) + tactile, via Pointer Events
    var dragging = false, startX = 0, dx = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = e.clientX; dx = 0;
      track.classList.add('dragging');
      track.setPointerCapture(e.pointerId);
      track.style.transform = 'translateX(' + (-(idx * 100)) + '%)';
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      var w = track.clientWidth || 1;
      track.style.transform = 'translateX(' + (-(idx * 100) + (dx / w * 100)) + '%)';
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      if (e && e.type === 'pointercancel') { render(); return; }
      var w = track.clientWidth || 1;
      if (Math.abs(dx) > w * 0.14) {
        clamp();
        idx = (dx < 0 && idx < max) ? idx + 1 : (dx > 0 && idx > 0) ? idx - 1 : idx;
      } else { clamp(); }
      render();
    }
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    // Clavier (accessibilité, car la zone est focusable)
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { if (idx < max) { idx++; render(); } }
      else if (e.key === 'ArrowLeft') { if (idx > 0) { idx--; render(); } }
    });
    render();
  }

  /* ── Contact form — envoi fonctionnel via e-mail
       (mailto natif : aucune back-end, aucune clé exposée, conforme GitHub Pages).
       Le champ data-formaction permet de basculer plus tard vers Formspree/Getform
       en changeant une seule valeur. ── */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var d = new FormData(form);
      var name = String(d.get('nom') || '').trim();
      var mail = String(d.get('email') || '').trim();
      var subject = String(d.get('sujet') || 'Demande de rendez-vous').trim();
      var message = String(d.get('message') || '').trim();

      var body = [
        'Nom : ' + name,
        'Email : ' + mail,
        'Sujet : ' + subject,
        '',
        message,
        '',
        '— Envoyé depuis le site marion-cabin.ca (formulaire de contact) —'
      ].join('\n');

      var base = form.dataset.formaction || 'mailto:bonjour@marion-cabin.ca';
      var mailto = base + '?subject=' + encodeURIComponent('Rendez-vous découverte — ' + subject + ' — ' + name) + '&body=' + encodeURIComponent(body);
      // Si le destinataire est une URL http(s) (basculé vers Formspree/Getform),
      // faire un vrai POST au lieu d'un mailto.
      if (base.indexOf('http') === 0) {
        fetch(base, { method: 'POST', headers: { 'Accept': 'application/json' }, body: d })
          .then(function () { if (note) note.hidden = false; form.reset(); })
          .catch(function () { window.location.href = mailto; if (note) note.hidden = false; });
        return;
      }
      window.location.href = mailto;
      if (note) note.hidden = false;
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
