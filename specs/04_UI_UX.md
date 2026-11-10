# 🎨 Pillar 4: UI/UX & Design System — The Flowscape

## 1. Visual Philosophy: Earthy Architectural Luxury
The Flowscape visual aesthetic is defined by **quiet luxury, architectural stillness, and organic serenity**. It deliberately rejects generic wellness clichés (oversaturated neon sunsets, pastel gradients, spiritual kitsch) in favor of museum-grade editorial layout, generous negative space, tactile borders, and rich natural tones.

---

## 2. Core Color Palette & Design Tokens

```css
:root {
  /* Brand Accents */
  --color-lotus: #b42d32;            /* Signature Lotus Crimson */
  --color-lotus-light: #cf3b3b;      /* Hover gradient peak */
  --color-lotus-deep: #881e22;       /* Active / Shadow crimson */
  --color-lotus-glow: rgba(180, 45, 50, 0.18);

  /* Primary Tonal Canvas */
  --color-bg: #f7f4ee;               /* Mineral Ivory / Natural Linen */
  --color-bg-card: #ffffff;          /* Pure Gallery White */
  --color-surface-warm: #f0ebe1;     /* Warm Limestone */
  --color-surface-contrast: #1e2521; /* Deep Evergreen / Obsidian Forest */

  /* Typography Colors */
  --color-text-main: #1e2521;        /* Forest Pine text */
  --color-text-muted: #5e6b63;       /* Earthy Sage gray */
  --color-text-light: #f7f4ee;       /* Light text on dark backgrounds */

  /* Architectural Accents */
  --color-terroir: #d4a373;          /* Warm Terracotta / Raw Ochre */
  --color-border-subtle: rgba(30, 37, 33, 0.10);
  --color-border-strong: rgba(30, 37, 33, 0.22);

  /* Elevation Shadows */
  --shadow-subtle: 0 4px 20px rgba(30, 37, 33, 0.05);
  --shadow-card: 0 12px 36px rgba(30, 37, 33, 0.08);
  --shadow-float: 0 24px 64px rgba(30, 37, 33, 0.14);

  /* Radii & Transitions */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --transition-smooth: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Typography Scale & Pairings

| Role | Font Family | Weight | Size Range (`clamp`) | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `Playfair Display` | 500 / 600 | `clamp(2.75rem, 5.5vw, 4.5rem)` | `-0.02em` | `1.15` |
| **Section Title** | `Playfair Display` | 600 | `clamp(1.85rem, 3.2vw, 2.75rem)` | `-0.01em` | `1.22` |
| **Card / Subheading**| `Playfair Display` | 500 | `clamp(1.25rem, 1.8vw, 1.6rem)` | `0.00em` | `1.30` |
| **Overline / Eyebrow**| `DM Sans` | 600 | `0.75rem` (`12px`) | `+0.16em` | `1.4` (Uppercase) |
| **Body Primary** | `DM Sans` | 400 | `clamp(0.975rem, 1.1vw, 1.125rem)`| `+0.01em` | `1.65` |
| **Button / Navigation**| `DM Sans` | 500 / 600 | `0.875rem` (`14px`) | `+0.06em` | `1.0` |

---

## 4. Regional Sanctuary Sub-Themes

Each regional retreat maintains Flowscape brand unity while adopting a site-specific atmospheric accent:

```
┌────────────────────────────────────────────────────────┐
│  The Flowscape Umbrella Hub: Deep Evergreen & Crimson  │
├────────────────────┬───────────────────┬───────────────┤
│ 🌲 Schwarzwald     │ 🇫🇷 Provence       │ 🇬🇧 London     │
│ Spruce Green       │ Warm Terracotta   │ Racing Ivy    │
│ Alpine Mist        │ Sunlit Limestone  │ London Stone  │
│ Black Forest Fir   │ Lavender Blossom  │ Antique Brass │
└────────────────────┴───────────────────┴───────────────┘
```

1. **Schwarzwald Yoga Escape**:
   - Primary: Spruce Green (`#16281e`), Timber Bark (`#3e2c1e`), Snow Mist (`#f1f5f2`).
2. **Provence Yoga Escape**:
   - Primary: Luberon Ochre (`#c97b53`), Provençal Olive (`#61694f`), Sunlit Bastide (`#fbf7ee`).
3. **London Yoga Escape**:
   - Primary: British Ivy (`#1b382b`), Hampstead Clay (`#3a3532`), Portland Stone (`#eae6dd`).

---

## 5. UI Component Specifications

### 1. The Red Lotus Brand Icon
- Constructed as an ultra-crisp scalable SVG composed of 7 petal paths.
- Linear gradient fill (`#cf3b3b` to `#881e22`) with a radiant coral center spark (`#ff7e77`).
- Retains distinct legibility down to $24\text{px} \times 24\text{px}$ favicons and up to $200\text{px}$ hero watermarks.

### 2. Primary Action Buttons
- **Default State**: Solid Evergreen background (`#1e2521`), white text, `6px` radius, `0.9rem` uppercase DM Sans, subtle inset border.
- **Hover State**: Elevates with `--shadow-card`, lotus crimson highlight line or background wash, smooth `0.2s` transition.
- **Active State**: Subtle $0.98$ scale compression for physical tactile feedback.

### 3. Sanctuary Card Architecture
- 16:10 aspect ratio photography with progressive zoom on card hover (`scale(1.03)` within `overflow: hidden`).
- Top-left floating biome badge (e.g., `FOREST & MOUNTAIN · GERMANY`).
- Bottom metadata drawer showing:
  - Duration (e.g. *4 Days / 3 Nights*)
  - Cohort size badge (e.g. *Limited to 14 Guests*)
  - Season/Date window (e.g. *May 14–17, 2026*)
  - Clear text link: `Explore Escape →`
