/* MARION — navigation commune aux pages de la revue
   - Thème jour/nuit : appliqué AVANT le paint par le script inline du <head>
     (aucun flash). Ce câble le bouton + garde le meta theme-color synchronisé.
   - Langue FR ⇄ EN : mêmes clés localStorage que l'accueil ('marion-lang'),
     donc le choix fait sur l'accueil est repris ici et réciproquement.
     (Le corps de la note reste en français — seul le libellé de la nav bascule.)
   - Menu mobile : le bouton burger + .mobile-menu, mêmes règles que main.js.
   Pas de dépendance. */
(function () {
  'use strict';
  var root = document.documentElement;
  var metaT = document.querySelector('meta[name="theme-color"]');

  /* ── 1 · Thème ── */
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/></svg>';
  var st = (function () {
    var s = { get: function () { return null; }, set: function () {} };
    try { s = { get: function () { return localStorage.getItem('marion-theme'); },
                set: function (v) { localStorage.setItem('marion-theme', v); } }; } catch (e) {}
    return s;
  })();
  function paint(t) {
    root.setAttribute('data-theme', t);
    if (metaT) metaT.setAttribute('content', t === 'dark' ? '#302F2B' : '#F5F1E9');
    var b = document.querySelector('.theme-toggle');
    if (b) { b.setAttribute('aria-pressed', String(t === 'dark')); b.innerHTML = (t === 'dark') ? SUN : MOON; }
  }

  /* ── 2 · Langue (libellés de la nav uniquement) ── */
  var LS = {};
  try {
    LS = {
      lang: function () { return localStorage.getItem('marion-lang') || 'fr'; },
      set:  function (v) { localStorage.setItem('marion-lang', v); }
    };
  } catch (e) {}
  var NAV = {
    fr: { sig:'Signaux', pil:'Piliers', app:'Approche',
          aprop:'À propos', comp:'Comprendre', faq:'FAQ', cta:'Prendre rendez-vous',
          tag:'Hypnose · Santé des femmes · Intégrative', back:'← Accueil' },
    en: { sig:'Signals', pil:'Pillars', app:'Approach',
          aprop:'About', comp:'Understand', faq:'FAQ', cta:'Book an appointment',
          tag:'Hypnotherapy · Women’s health · Integrative', back:'← Home' }
  };
  // Liens de la nav (desktop + mobile), dans .site-nav — SANS la marque « Marion »
  // (la marque n'est jamais traduite telle quelle : seul son libellé .brand-tag
  // l'est, cf. plus bas. C35 : une ancienne entrée 'home' ciblabait la marque
  // et remplacait « Marion + sous-titre » par le mot « Accueil »).
  var LINKS = [
    ['.revue .site-nav a[href="../#signals"]',            'sig'],
    ['.revue .site-nav a[href="../#piliers"]',            'pil'],
    ['.revue .site-nav a[href="../#approche"]',            'app'],
    ['.revue .site-nav a[href="../#apropos"]',            'aprop'],
    ['.revue .site-nav a[href="../#comprendre"]',         'comp'],
    ['.revue .site-nav a[href="../#faq"]',                'faq']
  ];
  function applyLang(l) {
    var m = NAV[l] || NAV.fr;
    for (var i = 0; i < LINKS.length; i++) {
      var els = document.querySelectorAll(LINKS[i][0]);
      for (var k = 0; k < els.length; k++) els[k].textContent = m[LINKS[i][1]];
    }
    var ctas = document.querySelectorAll('.revue .site-nav .nav-cta');
    for (var j = 0; j < ctas.length; j++) ctas[j].textContent = m.cta;
    var bt = document.querySelector('.revue .brand-tag'); if (bt) bt.textContent = m.tag;
    var bb = document.querySelector('.revue .btn-back'); if (bb) bb.textContent = m.back;
    var btg = document.querySelector('.revue .lang-toggle'); if (btg) btg.textContent = (l === 'en') ? 'FR' : 'EN';
    root.setAttribute('lang', (l === 'en') ? 'en' : 'fr');
    if (typeof pinBack === 'function') pinBack();
  }

  /* ── 3 · Menu mobile ── */
  function wireBurger() {
    var burger = document.getElementById('burger-revue');
    var menu = document.getElementById('mobileMenu-revue');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a) { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ── init ── */
  var d = st.get() || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  paint(d);
  var tt = document.querySelector('.theme-toggle');
  if (tt) tt.addEventListener('click', function () {
    var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    st.set(n); paint(n);
  });

  // C45 : défaut = préférence navigateur (en → langue AN), sinon FR.
  // Le choix explicite (bouton EN/FR) est ensuite persisté dans localStorage
  // et reste prioritaire au-dessus de la préférence système.
  function lang() {
    try { var v = localStorage.getItem('marion-lang'); if (v) return v; } catch (e) {}
    var b = (navigator.language || '').toLowerCase();
    return b.indexOf('en') === 0 ? 'en' : 'fr';
  }
  var cur = lang();
  applyLang(cur);
  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () {
    var next = cur === 'en' ? 'fr' : 'en'; cur = next;
    try { LS.set(next); } catch (e) {}
    applyLang(next);
  });
  wireBurger();

  /* C37 (2) — bouton retour collé au bord DROIT de la colonne de TEXTE
     (.revue-article, max 62ch), pas au bord du viewport.
     Le JS mesure la distance depuis le bord droit du texte jusqu'au
     bord du viewport (= innerWidth − article.right) et l'expose comme
     --btn-back-inset, lu par le CSS. Recalculé au resize et après
     changement de langue (la largeur du texte varie). */
  function pinBack(){
    var b = document.querySelector('.btn-back');
    var a = document.querySelector('.revue-article');
    if(!b || !a) return;
    var inset = innerWidth - a.getBoundingClientRect().right;
    if(isFinite(inset) && inset > 16){
      b.style.setProperty('--btn-back-inset', Math.round(inset) + 'px');
    }
  }
  if(document.readyState !== 'loading') pinBack();
  else document.addEventListener('DOMContentLoaded', pinBack);
  window.addEventListener('resize', pinBack);
})();
