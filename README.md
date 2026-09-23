# Marion — Hypnose, Santé des Femmes & Santé Intégrative

Site vitrine éditorial single-page pour une hypnothérapeute clinique de **Vancouver (C.-B.)**,
spécialisée en **santé des femmes** et **santé intégrative**. Construit en statique
(HTML/CSS/JS vanilla) pour déploiement **GitHub Pages** — aucune back-end, aucun secret côté client.

> **Source de vérité du design : le brief client** (analysant Rio de Ki et Karine Mousseau),
> conservé en pièce jointe : `/attachments/pasted_content_2026-09-23_15-49-51-713_d69302.txt`.
> Ce document est le plan opérationnel qui converge vers ce brief. Tout ajustement de direction
> se décide ici avant d'être codé.

---

## 1. Positionnement — la boussole

**Direction artistique en quatre mots (brief client, verbatim) :**

> ### Organique · Éditorial · Calme · Intellectuel

« À mi-chemin entre le site d'une psychologue contemporaine, une revue scientifique grand public
et un bel hôtel nordique de Colombie-Britannique. » — brief client

Positionnement en une phrase (brief) :

> **La douceur visuelle de Rio de Ki + la spécialisation santé féminine de Karine + la crédibilité d'une professionnelle issue de la science.**

Ce que le visiteur doit ressentir en 5 secondes (« Je suis entre de bonnes mains. Je peux relâcher
un peu. Cette personne sait ce qu'elle fait. ») — **sans** tomber dans l'un des deux extrêmes :

- ❌ Site médical froid : blanc, bleu, clinique, impersonnel
- ❌ Site wellness ésotérique : lune, fleurs séchées, « énergie féminine », promesses vagues

### Règles de contenu (dérivées du brief)

1. **Une identité centrale, pas une liste de disciplines.** Hypnose, santé des femmes et santé
   intégrative sont présentées comme *trois dimensions d'une même approche* — jamais comme
   « Hypnose | Santé des femmes | Santé intégrative | Recherche » juxtaposées.
2. **La science comme réassurance, pas comme froideur.** Citer des bases scientifiques de temps
   en temps (identité intellectuelle) — « pas partout. Juste suffisamment pour installer une
   identité intellectuelle. »
3. **Précision, pas de sur-promesse.** S'éloigner du langage Rio de Ki sur les émotions « stockées
   dans le corps », la survie, « changer à la racine ». Rester dans des formulations soutenues par
   la littérature observable.
4. **Éviter le cliché « santé féminine = rose/beige/fleurs ».** Le vert forêt + ivoire + brun
   profond parle du féminin de manière plus sophistiquée. La terre rosée n'est utilisée **que par
   petites touches**.
5. **Beaucoup d'espace blanc.** La respiration typographique est un matériau de design.
6. **Expérience d'abord, CV ensuite.** On commence par les signaux du corps de la patiente (bloc 02),
   pas par le parcours de la praticienne.
7. **Bilingualisme :** toute la copie du site est **française** (marché Vancouver, brief en FR).
8. **Géographie distincte :** mer + forêt + montagnes (Vancouver) peuvent devenir une partie
   distinctive de l'identité visuelle — sans basculer en « retraite bien-être / yoga ».

---

## 2. Système de design

### Palette (brief client, à reproduire à l'identique)

| Usage | Couleur | Hex |
|---|---|---|
| Fond principal | Ivoire chaud | `#F5F1E9` |
| Fond secondaire | Lin | `#E6DED1` |
| Accent naturel | Sauge grisée | `#A8B0A2` |
| Couleur forte | Vert forêt grisé | `#435249` |
| Accent féminin (touched only) | Terre rosée | `#C5A99D` |
| Texte | Brun anthracite | `#302F2B` |
| Blanc | Blanc crème | `#FBF9F5` |

Tokens CSS (`css/main.css` → `:root`) : `--ivoire`, `--lin`, `--sauge`, `--foret`,
`--terre`, `--ambre`, `--creme`, + dérivés `--foret-700`, `--sauge-100`, bordures `--ligne`,
ombres douces `--ombre-1/2`. **Aucun or/jaune.** Aucune couleur saturée.

### Typographie

| Rôle | Police | Notes |
|---|---|---|
| Titres éditoriaux | **Cormorant Garamond** 500–600 | Serif éditorial, « mais surtout pas trop romantique » |
| Texte, boutons, metadata | **Inter** 400–600 | Création d'une impression « structurée et contemporaine » |
| Overlines / labels | Inter 500, letter-spacing 0.12em, 11–12px, uppercase | Étiquette éditoriale |

Échelle (clamp) : H1 `clamp(2.6rem, 6vw, 4.4rem)` ; H2 `clamp(1.9rem, 3.6vw, 2.9rem)` ;
lignes éditoriales `1.65` ; `text-wrap: balance` sur les titres.

### Espace & composition

- Rythme vertical généreux : sections `padding-block: clamp(5rem, 10vw, 8.5rem)`.
- Largeur de lecture : `72–76ch` maximum le long des textes de section (`.prose`).
- Grilles éditoriales 12 colonnes (`max-width: 1280px`), colonnages asymétriques pour les splits
  (héros 7/5, à-propos 5/7, contact 5/7).
- Bordures fines `1px solid var(--line)` plutôt que les ombres ; ombres réservées aux cartes
  flottantes (tiers, cartes d'articles) — `0 18px 40px -24px rgba(48,47,43,.25)`.
- Micro-interactions sobres : soulignés en survol, lift 4px des cartes, transitions `300ms ease`.

### Direction photographique (2 mondes complémentaires, à mélanger)

| Monde | Sujet | Usage |
|---|---|---|
| **Monde 1 — Nature / corps / contemplation** | Forêts de C.-B., brume, côtes, lumière douce | Fond d'héros, images de sections « calme » |
| **Monde 2 — Portrait / lecture / conversation** | Portrait éditorial (pas « pro souriant bras croisés »), main, livre, thé | À-propos, témoignages, sections « humain » |

« Si toutes les photos sont dans la forêt → naturopathe/yoga. Si toutes les photos sont dans un
bureau → psychologue/clinique. Les deux ensemble racontent quelque chose de beaucoup plus
particulier. » — brief client

> **Action** : les images courantes sont des *placeholders* Unsplash (palette neutre). Le client
> fournira ses propres photos (Monde 1 + Monde 2) ; chaque `img` est taguée commentée
> `<!-- PHOTO WORLD 1 — replace -->` / `<!-- PHOTO WORLD 2 — replace -->` pour faciliter le swap.

---

## 3. Plan de la page (structure fixée par le brief)

Ordre de la section Rio validée par le client : **problème → approche → modalités → offre →
témoignages → FAQ → prise de rendez-vous**, adaptée au cas « hypnose + santé des femmes + science ».

| # | Bloc | Anchor | Contenu attendu |
|---|---|---|---|
| 00 | **Nav sticky** | — | Logo « MARION » + lien « Prendre rendez-vous » ; links sobres |
| 01 | **Héros éditorial** | `#accueil` | Image calme (Monde 1) + ligne simple (« Le corps et l'esprit, en dialogue. ») + méta « Hypnose thérapeutique · Santé des femmes · Approche intégrative » + 2 CTA : **Découvrir mon approche** / **Prendre rendez-vous** |
| 02 | **« Vous êtes peut-être ici parce que… »** | `#signals` | Intro « Votre corps vous envoie des signaux. » + liste des marqueurs (stress, sommeil, douleurs, transitions hormonales, périménopause, rapport au corps, fatigue, changements de vie, besoin d'équilibre) + sentence d'accompagnement global |
| 03 | **Trois piliers** | `#piliers` | **Hypnose** / **Santé des femmes** / **Santé intégrative** — trois dimensions d'une même approche, chacune avec un CTA textuel ; base scientifique citée ponctuellement |
| 04 | **« Ma façon de travailler »** | `#approche` | « Une approche humaine, rigoureuse et intégrative. » + 3 principes : fondée sur les connaissances scientifiques / centrée sur la personne / corps et esprit non séparés |
| 05 | **À propos** | `#apropos` | Photo (Monde 2) + « Bonjour, je suis Marion. » + 2 catégories : **Parcours scientifique** (recherche, psychologie, diplômes) + **Approches thérapeutiques** (hypnose, santé intégrative, formations) + CTA « Découvrir mon parcours » |
| 06 | **« Comprendre » — revue éditoriale** | `#comprendre` | Journal : *Hypnose : que dit réellement la recherche ? · Périménopause : comprendre les changements du corps et du cerveau · Stress chronique et système nerveux · Sommeil et santé hormonale · Le lien entre douleur, attention et cerveau · Santé intégrative : de quoi parle-t-on exactement ?* |
| 07 | **Témoignages** | `#temoignages` | 3–4 témoignages patients sobres, sans revendication de guérison |
| 08 | **FAQ** | `#faq` | 5 questions/réponses (hypnose & science, déroulement d'une séance, à qui s'adresse, distance/C.-B., définition de santé intégrative) |
| 09 | **Rendez-vous / Contact** | `#rendezvous` | Inviterie 1er pas (appel découverte 15 min gratuit) + coordonnées + formulaire (nom, email, sujet, message), mention de confidentialité |
| 10 | **Footer** | — | Nom, nav, Vancouver C.-B., droits — sobre |

### À ne PAS reconstruire (retraits du brief)

- ❌ Bloc de **pricing « membership tiers »** ($350/$450/$950) — hors brief, ton commerciale
- ❌ **Trust bar de stats** (« 2,500+ patients », « $5B+ in clinical studies ») — sur-promesse exacte que le brief dit d'éviter
- ❌ « Portland, OR » — la praticienne est **Vancouver, C.-B.**
- ❌ « Dr. Sarah Chen NMD » — remplacer par **Marion** (prénom du client, dossier `marion_website`)
- ❌ Tabs « MIND/BODY/WOMEN'S HEALTH » en liste disparate — remplacé par les 3 piliers dimensionnels

---

## 4. Architecture technique

| Layer | Tech |
|---|---|
| Structure | HTML5 sémantique, `lang="fr"`, skip-link, landmarks (nav/main/footer) |
| Style | CSS custom properties (`:root`), Grid/Flex, `clamp()`, mobile-first, breakpoints 640/768/1024/1280 |
| JS | Vanilla ESM-free IIFE : mobile-nav, FAQ accordion, slider témoignages, reveals au scroll (IntersectionObserver, **fallback visible si no-JS**), smooth-scroll, form submit client-side (placeholder) |
| Fonts | Google Fonts (Cormorant Garamond + Inter) avec `font-display: swap` |
| Images | `srcset` basique (1200 / 1600), `loading="lazy"` pour tout hors héros |
| Accessibilité | contrastes AA sur tous les textes, `aria-expanded` sur accordion, `rel="noopener"` sur liens externes, focus visible partout, `prefers-reduced-motion` respecté |
| Deploy | GitHub Pages — legacy build, branch `main`, path `/` → `https://logan169.github.io/hypno-site/` |

### Accessibilité & contraintes Pages

- **Aucun secret côté client.** Le form submit est actuellement un placeholder client-side ;
  brancher plus tard sur Formspree/Netlify/EmailJS — jamais d'endpoint avec clé exposée dans
  le HTML.
- **Chemins relatifs** partout (site servi depuis `/<repo>/`).
- **No-JS safe** : l'état visible n'importe pas du JS (les reveals ne masquent rien si le JS échoue).

---

## 5. Build & verification

```bash
# Dev local — n'importe quel serveur statique fonctionne
python3 -m http.server 8080    # depuis marion_website/

# Check syntaxe JS
node --check js/main.js

# Commit + push (identity via environment)
git add .
git commit -m "…"
git -c credential.helper='!gh auth git-credential' push origin main

# Vérification live (CDN cache ~30-60s)
curl -sI https://logan169.github.io/hypno-site/css/main.css | head -5
```

### Check-list de validation (à chaque itération)

- [ ] Tous les blocs 01→09 sont visibles **sans scroll** requis (pas de bloc invisible / opacifié)
- [ ] Palette hex exacte conforme au tableau §2 (aucune couleur hors-système)
- [ ] Copie 100 % française ; pas de revendication exagérée ; 2 CTA seulement dans le héros
- [ ] Le bloc pricing/stats n'existe plus
- [ ] Les 2 images d'héros (Monde 1 + Monde 2) chargent
- [ ] `node --check` passe ; aucun console error dans le navigateur
- [ ] Mobile 390 px : nav burger, grilles empilées, pas de horizontal overflow
- [ ] Contrast AA : texte anthracite sur ivoire, ivoire sur vert forêt
- [ ] Live URL répond 200 et sert le dernier commit

---

## 6. Conventions de travail

- **Un commit par étape** — messages conventionnels (`feat:`, `fix:`, `chore:`), auteur `hermes <logan1691987@gmail.com>`.
- **Budgez** (pas de budget IA) mais chaque itération doit être mesurable — screenshot avant/après,
  checklist §5, et un cycle de validation subagent quand le site « semble bon » selon l'utilisateur.
- Jamais de fabrication de sortie (build, URL live, stat) : chaque claim de vérifiée se fait par outil.
- Secrets : jamais dans le code, jamais committés, jamais imprimés.

---

## 7. Log d'itération

| Commit | Date | Résumé |
|---|---|---|
| `f3a4c02` | — | Draft initiale « Aurá Natural Health » (hors brief — remplacé) |
| `fe19534` | — | Hero gradient lissé (supplanté par la palette du brief) |
| `5cab76f` | — | CSS v31 / JS v5 alignés au HTML réel |
| `af0bf24` | — | Fix overflow carousel |
| `5ff4fd5` | — | Reveal-on-scroll no-JS-safe |
| `c5fb3bf` | — | Fix mojibake bouton |
| _(suivant)_ | — | **Rebuild brief-aligned** : plan §1–§3, FR, Vancouver, retrait pricing/stats |
