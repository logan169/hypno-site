/* MARION — favicon + logo nav adaptatifs jour/nuit
   Le FAVICON est TOUJOURS identique au logo de la barre de navigation :
   même fichier (même couleur), fond transparent — light : logo.svg (encre),
   dark : logo-dark.svg (crème). MutationObserver sur data-theme. */
(function () {
  'use strict';
  /* Pages : / (accueil, 0 niveau) et /revue/<slug>/ (2 niveaux).
     → prefixe relatif résolu par le navigateur : '' | '../../'.
     (fonctionne local ET prod — baseurl=/hypno-site) */
  var base = location.pathname.indexOf('/revue/') > -1 ? '../../' : '';
  function markUrl(t) { return base + 'assets/img/' + (t === 'dark' ? 'logo-dark.svg' : 'logo.svg'); }
  function apply(t) {
    var mark = document.querySelector('.brand-mark');
    if (mark) mark.src = markUrl(t);
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
