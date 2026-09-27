/* MARION — favicon adaptatif jour/nuit (chargé sur toutes les pages, avant main.js)
   - Écoute data-theme sur <html> (MutationObserver) → fonctionne même sans main.js.
   - Jour : static/logo.svg (encre sur ivoire) · Nuit : version inversée (marron clair + encre).
   - Chemins relatifs au dossier de la page : / → static/… · /revue/ → ../static/… */
(function () {
  'use strict';
  var prefix = location.pathname.indexOf('/revue/') > -1 ? '../static/' : 'static/';
  function setFavicon(t) {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    link.href = prefix + (t === 'dark' ? 'logo-dark.svg' : 'logo.svg');
  }
  try {
    setFavicon(document.documentElement.getAttribute('data-theme') || 'light');
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === 'data-theme') setFavicon(document.documentElement.getAttribute('data-theme'));
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();
