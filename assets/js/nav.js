/* MARION — barre de navigation commune aux pages SIMPLES (ecrits, parcours, 404)
   Ces pages ne chargent pas main.js (réservé à l'accueil). Ce script rend
   la barre IDENTIQUE partout :
     - burger mobile (même comportement que main.js) : ouvert/fermé, Échap,
       clic sur un lien → ferme
     - bascule FR ⇄ EN : mêmes libellés que l'accuil (EN_LIST de main.js),
       même clé localStorage ('marion-lang') pour une préférence unique
   Libellés FR (défaut) :
     Signaux · Piliers · Approche · À propos · Comprendre · Prendre rendez-vous
     brand-tag : Hypnose · Santé des femmes · Intégrative
   Libellés EN :
     Signals · Pillars · Approach · About · Understand · Book an appointment
     brand-tag : Hypnotherapy · Women’s health · Integrative */
(function () {
  'use strict';

  /* ---------- burger mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  var nav = document.getElementById('top');
  if (burger && menu && nav) {
    function closeMenu() {
      nav.classList.remove('open');
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', lang() === 'en' ? 'Open menu' : 'Ouvrir le menu');
    }
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', (lang() === 'en'
        ? (open ? 'Close menu' : 'Open menu')
        : (open ? 'Fermer le menu' : 'Ouvrir le menu')));
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- langue FR ⇄ EN ---------- */
  var LS = 'marion-lang';
  var FR = {
    tag: 'Hypnose · Santé des femmes · Intégrative',
    links: ['Signaux', 'Piliers', 'Approche', 'À propos', 'Comprendre', 'Prendre rendez-vous']
  };
  var EN = {
    tag: 'Hypnotherapy · Women\u2019s health · Integrative',
    links: ['Signals', 'Pillars', 'Approach', 'About', 'Understand', 'Book an appointment']
  };
  function store(v) { try { localStorage.setItem(LS, v); } catch (e) {} }
  function stored() { try { return localStorage.getItem(LS); } catch (e) { return null; } }
  function lang() {
    var s = stored();
    if (s === 'en' || s === 'fr') return s;
    return (navigator.language || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';
  }
  function labels() {
    var links = document.querySelectorAll('.nav-links a');
    var tagEl = document.querySelector('.brand-tag');
    function set(set) {
      for (var i = 0; i < links.length && i < set.links.length; i++) links[i].textContent = set.links[i];
      if (tagEl) tagEl.textContent = set.tag;
    }
    set(lang() === 'en' ? EN : FR);
    var bt = document.querySelector('.lang-toggle');
    if (bt) bt.textContent = lang() === 'en' ? 'FR' : 'EN';
    document.documentElement.setAttribute('lang', lang());
  }
  labels();
  var lbtn = document.querySelector('.lang-toggle');
  if (lbtn) lbtn.addEventListener('click', function () {
    store(lang() === 'en' ? 'fr' : 'en');
    labels();
  });
})();
