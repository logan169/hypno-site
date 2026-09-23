/* MARION — thème jour/nuit (pages de la revue)
   Le choix est appliqué AVANT le paint par un script inline dans <head>
   (aucun flash). Ce fichier ne câble que le bouton. Pas de dépendance. */
(function () {
  'use strict';
  var root = document.documentElement;
  var metaT = document.querySelector('meta[name="theme-color"]');
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/></svg>';
  function store() {
    var s = { get: function () { return null; }, set: function () {} };
    try {
      s = {
        get: function () { return localStorage.getItem('marion-theme'); },
        set: function (v) { localStorage.setItem('marion-theme', v); }
      };
    } catch (e) {}
    return s;
  }
  var st = store();
  function paint(t) {
    root.setAttribute('data-theme', t);
    if (metaT) metaT.setAttribute('content', t === 'dark' ? '#20241F' : '#F5F1E9');
    var b = document.querySelector('.theme-toggle');
    if (b) { b.setAttribute('aria-pressed', String(t === 'dark')); b.innerHTML = (t === 'dark') ? SUN : MOON; }
  }
  var cur = st.get() || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  paint(cur);
  var b = document.querySelector('.theme-toggle');
  if (b) b.addEventListener('click', function () {
    var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    st.set(n); paint(n);
  });
})();
