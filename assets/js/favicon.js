/* MARION — favicon + logo nav adaptatifs jour/nuit
   Le FAVICON est TOUJOURS identique au logo de la barre de navigation :
   même fichier (même couleur), fond transparent — light : logo.svg (encre),
   dark : logo-dark.svg (crème). MutationObserver sur data-theme. */
(function () {
  'use strict';
  /* On ne change QUE le nom de fichier (logo.svg / logo-dark.svg) et on dérive
     la base absolue depuis le src déjà correct du .brand-mark (posé par Jekyll
     avec site.baseurl). Ça marche à tous les niveaux de profondeur, local et prod. */
  function markUrl(t) {
    var mark = document.querySelector('.brand-mark');
    var file = (t === 'dark' ? 'logo-dark.svg' : 'logo.svg');
    if (mark && mark.src) {
      var i = mark.src.lastIndexOf('/');
      if (i > -1) return mark.src.slice(0, i + 1) + file;
    }
    return 'assets/img/' + file; /* fallback */
  }
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
