# Voss Hypnosis — Clinical Hypnotherapy Website

A modern, professional website for a clinical hypnotherapist with a developer/tech-inspired design aesthetic. Built as a static site for GitHub Pages deployment.

## 📁 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | Semantic HTML5 |
| Styling | Modern CSS (custom properties, grid, flexbox, clamp) |
| Interactivity | Vanilla ES6+ JavaScript |
| Fonts | Google Fonts (Inter + JetBrains Mono) |
| Deployment | GitHub Pages (static hosting) |

## 🎨 Design Features

- **Dark terminal aesthetic** — deep navy base with cyan/green accent colors
- **Monospace typography** — JetBrains Mono for headings and labels, creating that developer-friendly vibe
- **Gradient accents** — on headers, cards, and interactive elements
- **Scroll animations** — Intersection Observer-powered fade-in effects
- **Responsive layout** — mobile-first, collapses cleanly at 768px breakpoints

## 📄 Sections

1. **Hero** — Animated code terminal mockup + headline CTA
2. **About** — Therapist credentials & qualifications
3. **Services** (6 cards) — Anxiety, Sleep Disorders, Trauma/PTSD, Habits/Addiction, Performance Optimization, Pain Management
4. **Process** — 4-step patient journey timeline
5. **Testimonials** — Patient outcome stories
6. **Contact** — Info cards + inquiry form

## 🚀 Deploying to GitHub Pages

### Option A: Direct Push (Simplest)

```bash
cd hypno-site
git init
git add .
git commit -m "Initial commit: hypnotherapy website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Then enable GitHub Pages:
1. Go to **Settings → Pages** in the repo
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Click Save — your site will be live at `https://USERNAME.github.io/REPO/`

### Option B: gh-pages npm package

```bash
cd hypno-site
npm install --save-dev gh-pages
# Update package.json scripts:
#   "deploy": "gh-pages -d ."
npx gh-pages -d .
```

## ⚙️ Build & Preview

```bash
# Local preview with http-server
npx http-server . -p 8080 --cors

# Or any static server works — this is pure HTML/CSS/JS!
python3 -m http.server 8080  # from within hypno-site/
```

## 📝 Customization Notes

- **Therapist name & credentials**: Edit `index.html` in sections `#about` and header
- **Services**: Modify cards in the `.services__grid` section
- **Colors**: All colors are CSS custom properties in `css/main.css` (search for `--accent-green`, `--accent-cyan`, etc.)
- **Contact form**: Currently does console.log — replace with Formspree, Netlify Forms, or your own backend
- **Images**: Replace avatar placeholder with actual photos (the `.about__image-placeholder` div and `.testimonial__avatar`)

## 📄 License

Private / Client Work — See LICENSE file for usage terms.
