---
layout: default
title: 'Marion — Hypnose · Santé des femmes · Intégrative — redirige vers votre version'
permalink: /
comments: false
---

<!-- ACCUEIL REDIRECTEUR
     Choisit la langue (paramètre ?lang= > préférence navigateur) et la région
     (géolocalisation IP) puis redirige vers la bonne variante:
       /fr/loc_bc/  Vancouver, C.-B.   (défaut quand la région est indéterminée)
       /fr/loc_qc/  Québec
       /fr/loc_fr/  France
       /en/...      idem en anglais
     Sans JavaScript: liens directs ci-dessous. -->

<div style="max-width:34rem;margin:4rem auto;padding:0 1.25rem;font-family:Inter,system-ui,sans-serif">
  <p style="font-size:.7rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;opacity:.65">Un instant</p>
  <h1 style="font-family:'Cormorant Garamond',serif;font-size:1.9rem;margin:.6rem 0 .3rem">Je vous oriente vers votre version du site…</h1>
  <p style="line-height:1.6;opacity:.8">Vous devriez être redirigé·e automatiquement. Si ce n’est pas le cas, choisissez&nbsp;:</p>
  <p style="margin:1.4rem 0 .4rem;font-weight:600">Français — Vancouver, C.-B. / Québec / France</p>
  <p>
    <a href="{{ site.baseurl }}/fr/loc_bc/">Vancouver, C.-B.</a> ·
    <a href="{{ site.baseurl }}/fr/loc_qc/">Québec</a> ·
    <a href="{{ site.baseurl }}/fr/loc_fr/">France</a>
  </p>
  <p style="margin:1.4rem 0 .4rem;font-weight:600">English — B.C. / Québec / France</p>
  <p>
    <a href="{{ site.baseurl }}/en/loc_bc/">B.C.</a> ·
    <a href="{{ site.baseurl }}/en/loc_qc/">Québec</a> ·
    <a href="{{ site.baseurl }}/en/loc_fr/">France</a>
  </p>
  <p style="margin-top:2rem;font-size:.8rem;opacity:.6">Vos données de position sont utilisées uniquement par votre navigateur pour choisir la variante; rien n’est enregistré sur ce site.</p>
</div>

<script>
(function () {
  'use strict';
  var BASE = location.protocol + '//' + location.host + '{{ site.baseurl }}';
  var t0 = Date.now();
  function go(loc) {
    var target = BASE + '/' + (window.__lang || '') + '/loc_' + loc + '/';
    var waited = Date.now() - t0;
    // L'utilisateur qui est arrivé avec ?lang= a fait un choix conscient:
    // on lui laisse le temps de relire la page avant de basculer.
    var delay = (location.search.indexOf('&lang=') > -1 || location.search.indexOf('?lang=') > -1) ? Math.max(0, 1500 - waited) : 0;
    setTimeout(function () { window.location.replace(target); }, delay);
  }
  window.__lang = null;
  try {
    var p = new URLSearchParams(location.search);
    var l = (p.get('lang') || '').toLowerCase();
    if (l === 'en' || l === 'fr') { window.__lang = l; }
  } catch (e) {}
  if (!window.__lang) {
    var b = (navigator.language || '').toLowerCase();
    window.__lang = (b.indexOf('en') === 0) ? 'en' : 'fr';
  }
  function fromIp(data, hasRegionCode) {
    var cc = (data.country_code || '').toUpperCase();
    var region = (data.region_code || '').toUpperCase();
    var regionName = (data.region_name || data.region || '').toLowerCase();
    if (cc === 'FR') { go('fr'); return true; }
    if (cc === 'CA') {
      if (hasRegionCode ? (region === 'CA-QC' || region === 'QC') : regionName.indexOf('quebec') > -1) { go('qc'); }
      else { go('bc'); }
      return true;
    }
    return false;
  }
  function attempt(url, cb) {
    try {
      var ctrl = (window.AbortController && new AbortController());
      var timer = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, 2500);
      fetch(url, ctrl ? { signal: ctrl.signal } : undefined).then(function (r) { return r.json(); })
        .then(cb).catch(function () { cb(null); }).finally(function () { clearTimeout(timer); });
    } catch (e) { cb(null); }
  }
  function fallback() {
    attempt('https://freegeoip.app/json/', function (d) {
      if (d && fromIp(d, true)) return;
      go('bc'); // indétectable -> variante C.-B. (défaut exigé)
    });
  }
  attempt('https://ipwhois.app/json/', function (d) { if (d && fromIp(d, false)) return; fallback(); });
  // Filet de sécurité: si les deux API échouent lentement, on bascule sur C.-B.
  setTimeout(function () { go('bc'); }, 6000);
})();
</script>
