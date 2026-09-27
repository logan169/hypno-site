/* MARION — logo de la barre de navigation adaptatif jour/nuit
   - Le FAVICON reste fixe (static/logo.svg sur toutes les pages) — pas de changement de couleur.
   - Seul le logo nav suit data-theme : MutationObserver → fonctionne même sans main.js.
   - Chemins relatifs au dossier de la page : / → static/… · /revue/ → ../static/… */
(function () {
  'use strict';
  var prefix = location.pathname.indexOf('/revue/') > -1 ? '../static/' : 'static/';
  function markUrl(t) { return prefix + (t === 'dark' ? 'logo-dark.svg' : 'logo.svg'); }
  function apply(t) {
    var mark = document.querySelector('.brand-mark');
    if (mark) mark.src = markUrl(t);
  }
  try {
    apply(document.documentElement.getAttribute('data-theme') || 'light');
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === 'data-theme') apply(document.documentElement.getAttribute('data-theme'));
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();
