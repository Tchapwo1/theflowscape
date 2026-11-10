# 🛠️ Pillar 2: Technical Requirements Document (TRD) — The Flowscape

## 1. Technical Architecture & Philosophy
The Flowscape digital architecture prioritizes **extreme load speed, zero runtime overhead, timeless aesthetics, and bulletproof uptime**. 

Rather than introducing bulky single-page application (SPA) frameworks that incur hydration lag and JavaScript execution overhead on mobile devices, The Flowscape uses a modern **Semantic Modern Static Architecture (SMSA)**:
- **Markup**: Validated Semantic HTML5, ARIA roles, microdata, and OpenGraph/Twitter Cards.
- **Styling**: Native CSS3 with CSS Custom Properties (Design Tokens), CSS Grid, Subgrid, Flexbox, and fluid typography via `clamp()`. Zero utility bloat.
- **Scripting**: Vanilla ES6+ modules with event delegation, IntersectionObserver for lazy reveal animations, and native form validation.
- **Hosting & CDN**: Edge-deployed via Cloudflare Pages, Netlify, or Vercel with zero server maintenance.

---

## 2. Directory Tree & Monorepo Organization

```
d:\Downloads\the flowscape project\
├── specs\                             # 6-Pillar Spec Blueprint
│   ├── 01_PRD.md
│   ├── 02_TRD.md
│   ├── 03_APP_FLOW.md
│   ├── 04_UI_UX.md
│   ├── 05_SCHEMA.md
│   └── 06_IMPLEMENTATION_PLAN.md
├── theflowscape\                      # Umbrella Brand Hub (theflowscape.com)
│   ├── index.html                     # Flagship portal & sanctuary explorer
│   ├── styles.css                     # Master design tokens & umbrella styling
│   ├── script.js                      # Sanctuary filtering, modal, waitlist handler
│   ├── gallery.css                    # Modal & gallery layout styles
│   ├── gallery.js                     # Lightbox and visual asset navigator
│   ├── favicon.svg                    # Red Lotus vector brand icon
│   ├── CNAME                          # DNS mapping (theflowscape.com)
│   ├── privacy.html                   # Cookieless GDPR-compliant privacy policy
│   ├── terms.html                     # Booking & retreat terms
│   └── images\                        # Local optimized brand assets
├── london-yoga-escape\                # Urban Sanctuary (Richmond & Hampstead, UK)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── favicon.svg
│   └── README.md
├── provence-yoga-escape\              # Terroir Bastide (Luberon Valley, France)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── favicon.svg
│   └── README.md
└── schwarzwald-yoga-escape\           # Forest Flow (Black Forest, Germany)
    ├── index.html
    ├── page.html
    ├── styles.css
    ├── script.js
    ├── favicon.svg
    ├── destinations\
    ├── instructors\
    └── classes-and-packages\
```

---

## 3. Tech Stack & Library Decisions

| Layer | Selection | Rationale |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic Living Standard | Maximum crawlability, native accessibility, instant parsing. |
| **CSS Architecture** | Native CSS Variables + BEM naming | Zero build step required, instant hot reloading, predictable scoping. |
| **Typography** | Google Fonts (`Playfair Display` + `DM Sans`) | Preconnected via `font-display: swap` to prevent layout shift (CLS $< 0.05$). |
| **Vector Graphics** | Inline SVG with embedded gradients | Pixel-perfect on high-DPI/Retina screens, zero HTTP roundtrips. |
| **Media Assets** | Unsplash CDN + WebP with srcset | Dynamic parameter sizing (`auto=format&fit=crop&q=85`) for bandwidth saving. |
| **Forms & Ingestion** | Native HTML5 Constraints API + Fetch API | Validates without third-party form bloat; ready for Formspree/Netlify Forms/Resend. |
| **SEO Structured Data**| JSON-LD (`schema.org/LodgingBusiness` & `Event`) | Enables Google Rich Snippets for retreat dates, locations, and pricing tiers. |

---

## 4. Performance & Quality Budgets

### Hard Engineering Budgets:
- **Total Critical CSS**: $< 25\text{ KB}$ minified per page.
- **Total Vanilla JS**: $< 15\text{ KB}$ uncompressed per page.
- **First Contentful Paint (FCP)**: $< 1.2\text{s}$ on simulated 4G mobile.
- **Cumulative Layout Shift (CLS)**: $0.00$ (explicit image aspect-ratios and font fallbacks).
- **Interactive Framerate**: Constant $60\text{ FPS}$ during smooth scrolling, modal opening, and sanctuary filter transitions.

---

## 5. Security & Browser Privacy Standards
- **Zero Third-Party Trackers**: No intrusive advertising pixels, Google Tag Manager, or third-party cookies.
- **Content Security Policy (CSP)**:
  ```http
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://images.unsplash.com; font-src https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline';
  ```
- **Referrer Policy**: `strict-origin-when-cross-origin`.
- **Form Sanitization**: All input fields strip leading/trailing whitespace and sanitize control characters before payload serialization.
