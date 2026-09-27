/* MARION — favicon + logo nav adaptatifs jour/nuit
   - Le FAVICON est TOUJOURS identique au logo de la barre de navigation :
     même fichier (même couleur), fond transparent — light : logo.svg (encre),
     dark : logo-dark.svg (crème).
   - MutationObserver sur data-theme → fonctionne même sans main.js.
   - Chemins relatifs au dossier de la page : / → static/… · /revue/ → ../static/… */
(function () {
  'use strict';
  var prefix = location.pathname.indexOf('/revue/') > -1 ? '../static/' : 'static/';
  function markUrl(t) { return prefix + (t === 'dark' ? 'logo-dark.svg' : 'logo.svg'); }
  function apply(t) {
    var mark = document.querySelector('.brand-mark');
    if (mark) mark.src = markUrl(t);
    /* favicon : le <link rel="icon" ...svg...> sans taille = le seul qui suit le thème.
       Les PNG (apple-touch-icon, PWA) gardent leur carré — iOS réclame un fond opaque. */
    var fav = document.querySelector('link[rel="icon"]:not([sizes])');
    if (fav) fav.href = markUrl(t);
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
