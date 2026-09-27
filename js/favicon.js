/* MARION — marque adaptative jour/nuit (favicon + logo de la barre de nav)
   - Écoute data-theme sur <html> (MutationObserver) → fonctionne même sans main.js.
   - Jour : static/logo.svg (encre sur ivoire) · Nuit : static/logo-dark.svg (couleurs inversées).
   - Chemins relatifs au dossier de la page : / → static/… · /revue/ → ../static/…
   - Chargé sur toutes les pages, avant main.js, pour aucun flash et cohérence. */
(function () {
  'use strict';
  var prefix = location.pathname.indexOf('/revue/') > -1 ? '../static/' : 'static/';
  function markUrl(t) { return prefix + (t === 'dark' ? 'logo-dark.svg' : 'logo.svg'); }
  function apply(t) {
    // 1) Favicon
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    link.href = markUrl(t);
    // 2) Logo de la barre de navigation
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
