/* MARION — interactions (vanilla, no dependencies, no-JS safe)
   1. Thème jour/nuit (persisté, système par défaut, sans flash)
   2. Langue FR ⇄ EN (dictionnaire, persisté, sans flash)
   3. Menu mobile, carrousel glissable, formulaire, reveals */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════ 1 · THÈME (nuit) ═══════ */
  var root = document.documentElement;
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function paintTheme(t) {
    root.setAttribute('data-theme', t);
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#20241F' : '#F5F1E9');
    var tb = document.querySelector('.theme-toggle');
    if (tb) {
      tb.setAttribute('aria-pressed', String(t === 'dark'));
      tb.innerHTML = (t === 'dark')
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
      if (lang() === 'en') tb.setAttribute('aria-label', t === 'dark' ? 'Light mode' : 'Dark mode');
    }
  }
  try { var st0 = localStorage.getItem('marion-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); paintTheme(st0); } catch (e) { paintTheme('light'); }

  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('marion-theme', next); } catch (e) {}
    paintTheme(next);
  });

  /* ═══════ 2 · LANGUE FR ⇄ EN ═══════ */
  /* Éléments "fragiles" (aria/title/meta) en EN — indexés par clé */
  var EN_KEYS = {
    title: 'Marion — Hypnotherapy · Women’s health · Integrative — Vancouver',
    'meta.desc': 'Clinical hypnotherapy in Vancouver, B.C.: an integrative approach uniting therapeutic hypnosis, women’s health and scientific evidence — for stress, sleep, perimenopause and overall balance.',
    'og.title': 'Marion — Hypnotherapy · Women’s health · Integrative',
    'og.desc': 'An integrative, science-based approach to women’s health: therapeutic hypnosis, sleep, perimenopause. Vancouver, B.C.',
    'aria.nav': 'Main navigation',
    'aria.foot': 'Footer navigation',
    'aria.tst': 'Patient testimonials (swipe to browse)'
  };

  // Texte EN correspondant à chaque élément data-i18n, dans l'ordre du DOM.
  var EN_LIST = [
    'Skip to content',                                                              // skip-link
    'Hypnotherapy · Women’s health · Integrative',                                 // brand-tag
    'Signals', 'Pillars', 'Approach', 'About', 'Understand', 'FAQ', 'Book an appointment',   // nav-links (7)
    'Signals', 'Pillars', 'Approach', 'About', 'Understand', 'FAQ', 'Book an appointment',   // mobile menu (7)
    'Clinical hypnotherapy — online: Vancouver & B.C., Québec, across Canada · France soon',            // hero overline
    'Body and mind,<br>in dialogue.',                                              // h1
    'An integrative approach to women’s health, where therapeutic hypnosis is grounded in science rather than clichés.', // hero-sub
    'Hypnotherapeutic&nbsp;·&nbsp;Women’s health&nbsp;·&nbsp;Integrative approach',          // hero-meta
    'Book an appointment',                                                                // hero CTA (C53 : primaire retirée — plus qu'une seule ligne)
    'You may be here because…',                                                    // signals overline
    'Your body is sending you signals.',                                           // h2
    'Sometimes it isn’t one precise ache that brings you in — it’s the feeling that things are coming apart. These themes come up again and again with the people I work with&nbsp;:', // lead
    'Persistent stress and anxiety', 'Disrupted sleep, frequent waking', 'Fatigue that sleep doesn’t fix',
    'Tension, pain, physical discomfort', 'Hormonal shifts, perimenopause',
    'A difficult relationship with your body', 'Life changes that upset your balance',
    'The need, simply, to regain a sense of balance',                              // 8 signals
    'I work with you through an approach that considers health as a whole — physiology, nervous system, emotional experience and life context. No magic promises: proven tools, applied to your story.', // pull
    'What I offer',                                                                // pillars overline
    'Three dimensions of a single approach.',                                      // h2
    'These aren’t three services side by side. It’s one way of thinking about health — seen from three complementary angles.', // lead
    '<span class="pillar-num">01</span> Hypnosis',
    'Understanding the role of the unconscious, of habits, of emotions and of the nervous system in your daily experience. Hypnosis as a precise therapeutic tool — neither mystery nor spectacle.',
    'Discover hypnosis →',
    '<span class="pillar-num">02</span> Women’s health',
    'Particular attention to the physiological and psychological realities that shape women’s lives — cycle, fertility, perimenopause, relationship with the body — with precise language, never decorative.',
    'Discover the support →',
    '<span class="pillar-num">03</span> Integrative health',
    'Bringing together body, psychology, lifestyle and research findings into coherent recommendations. You know the why, not just the how.',
    'Understand my approach →',
    'Note: each working avenue is presented with its level of evidence — including what the literature does not yet allow us to claim.', // fine
    'How I work',                                                                  // approche overline
    'A human, rigorous, integrative approach.',                                    // h2
    'Grounded in knowledge', 'The tools I offer rely, whenever possible, on the available evidence and its level of proof. When the literature is limited, I tell you.',
    'Centre on the person', 'Research gives reference points. Your story, your body and your experience remain unique — and take precedence over the manual.',
    'Body and mind in interaction', 'Stress, sleep, hormones, emotions and physical health constantly interact. Treating them in isolation is refusing to see the whole picture.', // 3 principes
    'About', 'Hello, I’m Marion.',                                                 // apropos
    'Hypnotherapist and integrative health practitioner in Vancouver. My path crosses research and clinical work — and it is precisely that meeting I want to pass on to you&nbsp;:',
    'Scientific background', 'PhD in psychology', 'Research in emotion regulation and sleep', 'Teaching &amp; science communication',
    'Therapeutic approaches', 'Therapeutic hypnosis — certified training', 'Women’s health — cycle, fertility, perimenopause', 'Integrative health — lifestyle, sleep',
    'Discover my background',                                                   // btn → /parcours.html (C43)
    'Understand', 'Marion’s review.',                                              // comprendre
    'Short, clear, sourced notes to better understand the mechanisms before choosing a path. Read to understand — not to convince.',
    'Hypnotherapy', 'Hypnosis: what does the research actually say?', 'What meta-analyses show, what they don’t, and where the honest limits of the method lie.', 'Read →',
    'Women’s health', 'Perimenopause: understanding the changes in body and brain', 'Hormones, sleep, mood — what actually shifts, and what evidence-based tools can do about it.', 'Read →',
    'Nervous system', 'Chronic stress and the nervous system', 'Why anxiety settles into the body, and what nervous-system regulation concretely changes.', 'Read →',
    'Sleep', 'Sleep and hormonal health', 'The two-way link between sleep, cycle and hormones — and the levers that really matter.', 'Read →',
    'Pain', 'The link between pain, attention and the brain', 'What pain research teaches us about attention — and why it changes practice.', 'Read →',
    'Integrative', 'Integrative health: what are we actually talking about?', 'Breaking down the term to separate what is rigorous from what is marketing.', 'Read →', // 6 articles
    'In patients’ own words', 'Patients, in their own words.',                     // temoignages
    '“I thought hypnosis would be vague. In reality, it’s a structured method: goals, tools, follow-up. It helped me regain stable sleep.”', '— Patient, sleep support',
    '“Marion supported me through perimenopause without ever promising miracles, grounding herself in what we know. That honesty is what reassured me.”', '— Patient, women’s health',
    '“A space where I’m listened to, where things are explained. I came in anxious, and left with a clear plan I could understand and follow.”', '— Patient, anxiety and stress',
    'Frequently asked questions', 'Before booking an appointment.',                // faq
    'Does hypnosis have a scientific basis?',
    'Yes — to varying degrees. Meta-analyses support its use for certain pain management, stress and some aspects of sleep. Other areas are less settled in research. For each avenue, I tell you what the data say — and where they stop.',
    'What does a session look like?',
    'It starts with a conversation about what brought you, then shared goals. Hypnosis itself is a natural state of focused attention — you don’t “lose control,” and you leave with concrete tools. A session lasts 60 to 75 minutes.',
    'Is it for me?',
    'If you’re looking for one unique, definitive answer, probably not. If you’re looking for structured support, where things are explained, measured, and your experience is taken seriously — probably yes. A 15-minute discovery call is enough to check together.',
    'Can we work remotely?',
    'Yes. Many sessions happen by video call, including from British Columbia. Quality doesn’t depend on the room — it depends on the relationship and the framework, and we keep both intact at a distance.',
    'What exactly is “integrative health”?',
    'An approach that connects several levels of experience — body, psychology, habits, context — and relies on the available evidence. It differs from conventional medicine in its view of the whole person — and from the “wellness” approach by its demand for proof. I like this position: the centre.', // 5 Q/R
    'First step', 'A discovery call, 15 minutes.',                                 // rdv
    'The first step is a simple conversation. We take stock of what brings you, what you expect, and — where relevant — the options that make sense. No commitment, no script.',
    '<strong>Format</strong><br>By video call — full support, from the comfort of your home',
    'Name', 'Email', 'What brings you in',                                         // form labels
    'Choose…', 'Hypnosis, stress or sleep', 'Women’s health', 'Integrative health', 'Other / I’d rather discuss on a call', // options
    'Message', 'Send my request →',                                                // message + submit
    'Your information stays confidential — never shared, never passed to third parties.',
    'Your message opens in your e-mail app (subject and body pre-filled). Just click “Send” — a reply arrives within 24 business hours.',
    'Hypnotherapy · Women’s health · Integrative',                                 // footer brand-tag
    'Home', 'Approach', 'About', 'Understand', 'Appointment',                       // footer-nav
    'Vancouver, British Columbia', '© 2026 Marion — All rights reserved.',
    'Nothing on this site replaces a physician’s advice.'
  ];

  function lang() {
    try { var v = localStorage.getItem('marion-lang'); if (v) return v; } catch (e) {}
    // C45 : défaut = préférence navigateur, sinon FR.
    var b = (navigator.language || '').toLowerCase();
    return b.indexOf('en') === 0 ? 'en' : 'fr';
  }
  function applyLang(l) {
    // Texte
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
    if (l === 'en') {
      els.forEach(function (el, i) { if (EN_LIST[i] !== undefined) el.innerHTML = EN_LIST[i]; });
      var nav = document.querySelector('.nav-links'); if (nav) nav.setAttribute('aria-label', 'Main navigation');
      var foot = document.querySelector('.footer-nav'); if (foot) foot.setAttribute('aria-label', 'Footer navigation');
      var track = document.getElementById('tstTrack'); if (track) track.setAttribute('aria-label', 'Patient testimonials (swipe to browse)');
      document.title = EN_KEYS.title;
      var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', EN_KEYS['meta.desc']);
      var ogd = document.querySelector('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', EN_KEYS['og.desc']);
      var oglo = document.querySelector('meta[property="og:locale"]'); if (oglo) oglo.setAttribute('content', 'en_CA');
    } else {
      els.forEach(function (el, i) { if (el._fr) el.innerHTML = el._fr; });
      var nav2 = document.querySelector('.nav-links'); if (nav2) nav2.setAttribute('aria-label', 'Navigation principale');
      var foot2 = document.querySelector('.footer-nav'); if (foot2) foot2.setAttribute('aria-label', 'Navigation pied de page');
      var track2 = document.getElementById('tstTrack'); if (track2) track2.setAttribute('aria-label', 'témoignages de patientes (glisser pour parcourir)');
      document.title = 'Marion — Hypnose · Santé des femmes · Santé intégrative — Vancouver';
      var md2 = document.querySelector('meta[name="description"]'); if (md2 && md2._fr) md2.setAttribute('content', md2._fr);
      var ogd2 = document.querySelector('meta[property="og:description"]'); if (ogd2 && ogd2._fr) ogd2.setAttribute('content', ogd2._fr);
      var oglo2 = document.querySelector('meta[property="og:locale"]'); if (oglo2) oglo2.setAttribute('content', 'fr_CA');
    }
    document.documentElement.setAttribute('lang', l);
    var bb = document.querySelector('.lang-toggle'); if (bb) bb.textContent = (l === 'en') ? 'FR' : 'EN';
    // Icône / label thème (re-paint selon la langue courante)
    paintTheme(root.getAttribute('data-theme'));
  }
  // Sauvegarde des textes FR (valeur par défaut) au chargement
  document.querySelectorAll('[data-i18n]').forEach(function (el) { el._fr = el.innerHTML; });
  var _md = document.querySelector('meta[name="description"]'); if (_md) _md._fr = _md.getAttribute('content');
  var _ogd = document.querySelector('meta[property="og:description"]'); if (_ogd) _ogd._fr = _ogd.getAttribute('content');

  var L = lang();
  if (L === 'en') applyLang('en');
  var langBtn = document.querySelector('.lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () {
    var next = lang() === 'en' ? 'fr' : 'en';
    try { localStorage.setItem('marion-lang', next); } catch (e) {}
    applyLang(next);
  });

  /* ═══════ 3 · MENU MOBILE ═══════ */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var nav = document.querySelector('.site-nav');
  if (burger && mobileMenu && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      var en = lang() === 'en';
      burger.setAttribute('aria-label', en ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fermer le menu' : 'Ouvrir le menu'));
    });
    function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  /* ═══════ 4 · CARROUSEL TÉMOIGNAGES (fondu — glissable, 3 s) ═══════ */
  var track = document.getElementById('tstTrack');
  if (track) {
    var cards = [].slice.call(track.children);
    var max = cards.length - 1;
    var idx = 0, pending = null;
    function clamp() { idx = Math.max(0, Math.min(max, idx)); }
    function render() {
      cards.forEach(function (c, i) {
        var on = i === idx;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
    }
    var FADE = 650; // ms — fondu entrant/sortant (3 s total / témoignage, cf. client C32)
    // — Glisser (doigt) : la sortie se fait quand le geste dépasse ~25 % de la largeur —
    var dragging = false, startX = 0, dx = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = e.clientX; dx = 0;
      track.classList.add('dragging');
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
    });
    track.addEventListener('pointermove', function (e) { if (dragging) dx = e.clientX - startX; });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      if (e && e.type === 'pointercancel') return;
      var w = track.clientWidth || 1;
      if (Math.abs(dx) > w * 0.25) {
        var n = idx + (dx < 0 ? 1 : -1);
        if (n >= 0 && n <= max && n !== idx) { idx = n; clearTimeout(pending); render(); bump(); }
      }
    }
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    // — Flèches ‹ › (souris) + clavier ‹ › —
    var prevBtn = document.getElementById('tstPrev');
    var nextBtn = document.getElementById('tstNext');
    function go(dir) {
      clamp();
      var n = idx + dir;
      if (n < 0) n = max;
      if (n > max) n = 0;
      // C47 : render IMMÉDIAT — le fondu 650 ms est géré par la transition
      // CSS (opacity .65s). Avant, un setTimeout(render, 650) ajoutait une
      // zone morte de 650 ms après chaque clic/glissement : l'effet paraissait
      // "bloqué" (le client voyait la carte figée avant qu'elle ne change).
      if (n !== idx) { idx = n; clearTimeout(pending); render(); }
      bump();
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { if (idx < max) go(1); }
      else if (e.key === 'ArrowLeft') { if (idx > 0) go(-1); }
    });
    // — Auto-avance 3 s (boucle), pause au survol / focus / glissement — //
    var timer = null, delay = 3000;
    function bump() { if (timer) { clearInterval(timer); startAuto(); } }
    function startAuto() {
      if (reduceMotion) return;
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(1); }, delay);
    }
    var host = track.closest('.tst-carousel') || track;
    host.addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
    host.addEventListener('mouseleave', function () { if (!timer && !reduceMotion) startAuto(); });
    track.addEventListener('focusin', function () { if (timer) { clearInterval(timer); timer = null; } });
    track.addEventListener('focusout', function () { if (!timer && !reduceMotion) startAuto(); });
    track.addEventListener('pointerdown', function () { if (timer) { clearInterval(timer); timer = null; } });
    render();
    startAuto();
  }

  /* ═══════ 5 · FORMULAIRE (mailto, sans back-end) ═══════ */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var d = new FormData(form);
      var name = String(d.get('nom') || '').trim();
      var mail = String(d.get('email') || '').trim();
      var subject = String(d.get('sujet') || '').trim() || (lang() === 'en' ? 'Discovery appointment' : 'Demande de rendez-vous');
      var message = String(d.get('message') || '').trim();
      var SEP = '\r\n';
      var BLANK = SEP + SEP; // double retour à la ligne = vrai espace visuel dans le client mail
      var body = [
        lang() === 'en' ? 'Name :' : 'Nom :', name,
        lang() === 'en' ? 'Email :' : 'Email :', mail,
        lang() === 'en' ? 'Subject :' : 'Sujet :', subject,
        BLANK, message,
        BLANK, lang() === 'en' ? '— Sent via the marion-cabin.ca contact form —' : '— Envoyé depuis le site marion-cabin.ca (formulaire de contact) —'
      ].join(SEP);
      var base = form.dataset.formaction || 'mailto:bonjour@marion-cabin.ca';
      var sub = lang() === 'en' ? 'Discovery appointment — ' : 'Rendez-vous découverte — ';
      var mailto = base + '?subject=' + encodeURIComponent(sub + subject + ' — ' + name) + '&body=' + encodeURIComponent(body);
      if (base.indexOf('http') === 0) {
        fetch(base, { method: 'POST', headers: { 'Accept': 'application/json' }, body: d })
          .then(function () { if (note) note.hidden = false; form.reset(); })
          .catch(function () { window.location.href = mailto; if (note) note.hidden = false; });
        return;
      }
      window.location.href = mailto;
      if (note) note.hidden = false;
    });
  }

  /* ═══════ 6 · REVEALS ON SCROLL (progressive) ═══════ */
  var fadeEls = document.querySelectorAll('.fade');
  if (fadeEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('fx-fade');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    fadeEls.forEach(function (el) { observer.observe(el); });
  }
  /* ═══════ 7 · SCROLL-SPY NAV (C30 + C40) ═══════
     L'item de menu correspondant à la section la plus en vue
     (34 % du viewport en haut) reçoit .nav-active :
     pastille sauge (liens) / halo sauge (CTA) — la position
     change à chaque section qui prend le dessus, y compris
     « Prendre rendez-vous » sur la section #rendezvous. */
  if (location.pathname.replace(/index\.html$|\/$/, '').indexOf('revue') === -1) {
    var spyLinks = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]')).filter(function (a) {
      // C40 : la CTA « Prendre rendez-vous » participe aussi au spy
      // (avant elle était exclue → la section #rendezvous activait
      // par erreur la dernière entrée du menu).
      return a.getAttribute('href') && a.getAttribute('href').length > 1;
    });
    if (spyLinks.length && 'requestAnimationFrame' in window) {
      var spyTargets = spyLinks
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);
      var ticking = false;
      var setActive = function () {
        // C51 : section « la plus visible » du viewport (hauteur en px)
        // plutôt que le seuil fixe à 34 %. Le seuil de 34 % était correct
        // au milieu de la page, mais avec #rendezvous (dernière section,
        // plus haute que le viewport) le haut de la section restait en
        // dessous du seuil sur une large bande de scroll → c’était
        // « FAQ » qui restait actif alors que l’utilisateur était déjà
        // sur « Prendre rendez-vous ». La règle « la plus visible »
        // active #rendezvous dès qu’elle occupe la majorité du viewport,
        // sans toucher au comportement des autres sections.
        var vh = window.innerHeight;
        var best = null, bestVis = 0;
        for (var i = 0; i < spyTargets.length; i++) {
          var r = spyTargets[i].getBoundingClientRect();
          if (r.bottom < 0) continue;
          var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (vis > bestVis || best === null) { best = spyTargets[i].id; bestVis = Math.max(vis, 1); }
        }
        var activeHref = (best ? '#' + best : null);
        document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]').forEach(function (a) {
          a.classList.toggle('nav-active', activeHref !== null && a.getAttribute('href') === activeHref);
        });
        ticking = false;
      };
      var onScroll = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(setActive); } };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      setActive();
    }
  }
})();
