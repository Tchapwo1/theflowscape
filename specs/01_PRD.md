# 📋 Pillar 1: Product Requirements Document (PRD) — The Flowscape

## 1. Executive Summary & Brand Thesis
**The Flowscape** (`theflowscape.com`) is the master umbrella brand and digital portal curating boutique yoga, meditation, and somatic wellness retreats across Europe and prime global sanctuaries. 

Unlike transactional retreat marketplaces (e.g. BookRetreats, RetreatGuru), **The Flowscape** operates as a high-touch, design-forward luxury hospitality collective. Each retreat is rooted in four non-negotiable operational pillars:
1. **Sense of Place**: Architecture, silence, and landscape immersion tailored to native biomes.
2. **Dual Rhythm Practice**: High-intensity solar morning movement (Vinyasa / Prana Flow) balanced by introspective lunar evening restoration (Yin, Yoga Nidra, Sound Baths).
3. **Soil-to-Table Sustenance**: Hyper-local, seasonal, chef-crafted organic nutrition reflecting regional terroir.
4. **Intimate Scale**: Strict group caps of 12 to 16 guests to preserve psychological safety and personal mentorship.

The digital ecosystem consists of the central umbrella hub (`theflowscape`) unifying three inaugural destinations:
- 🌲 **Schwarzwald Yoga Escape** (Germany) — Forest bathing, timber saunas, alpine meadows.
- 🇫🇷 **Provence Yoga Escape** (France) — 18th-century stone bastide, olive groves, Luberon hills.
- 🇬🇧 **London Yoga Escape** (United Kingdom) — Glasshouse conservatory vinyasa, Richmond & Hampstead parks, Victorian townhouse restoration.

---

## 2. Target Personas & Core Problems

### Persona A: The Urban High-Performer / Creative Professional (Primary Guest)
- **Profile**: 28–48 years old, tech/finance/creative founder, designer, or senior professional based in London, Berlin, Paris, or Zurich.
- **Pain Point**: Chronic sensory overload, shallow breathing, burnout from screen saturation. Wants real restoration without the cliché hippie commercialism or rigid ashram austerity.
- **Core Desire**: Design-led aesthetics, architectural beauty, culinary excellence, and genuine movement science.

### Persona B: The Discerning Solo Retreat Traveler (Secondary Guest)
- **Profile**: Experienced yoga practitioner seeking transformative resets; travels solo but values intimate, warm communal dinners and shared practice.
- **Pain Point**: Feeling lost in massive 50-person retreat factories or isolated in unstructured wellness hotels.
- **Core Desire**: Safe, curated, small-cohort camaraderie (maximum 14–16 guests) guided by master facilitators.

### Persona C: The Retreat Partner & Host Instructor (Facilitator)
- **Profile**: Globally recognized movement educators and sound practitioners partnering with The Flowscape.
- **Pain Point**: Fragmented logistics, low-grade web presence of host venues, unaligned student expectations.
- **Core Desire**: Prestige brand association, turnkey hospitality backing, and clear curriculum frameworks.

---

## 3. Scope & Feature Hierarchy

### Phase 1: MVP Core Features (Current Scope)

#### 1. Umbrella Brand Gateway (`theflowscape`)
- **Global Identity Bar**: Persistent emblem header with Red Lotus SVG, luxury editorial typography, and announcement ribbons for open seasons.
- **Interactive Sanctuary Explorer**: Client-side filtering by terrain type:
  - *All Sanctuaries*
  - *Forest & Mountain* (Schwarzwald)
  - *Mediterranean Terroir* (Provence)
  - *Urban Sanctuaries* (London)
  - *Future Horizons* (Tuscany, Swiss Alps)
- **Cross-Domain Deep Linking**: Seamless 1-click navigation between the master brand portal and regional escape micro-sites.
- **Priority Circle Global Waitlist**: Multi-destination early-access application with preference collection (destinations, season, room preference: single vs. shared).
- **Curatorial Experience Gallery**: Modal/lightbox visualizer of venues, daily schedules, sample menus, and instructors.
- **Legal Compliance**: Standardized Cookie-less Privacy Policy (`privacy.html`), Terms of Booking (`terms.html`), and Schema.org structured data for SEO.

#### 2. Regional Micro-Sites (`*-yoga-escape`)
- **Dedicated Sanctuary Landings**: Standalone high-conversion micro-sites for London, Provence, and Schwarzwald.
- **Micro-Experience Breakdowns**: Day-by-day itinerary timelines (Arrival -> Deepening -> Culmination -> Departure).
- **Venue & Terroir Showcases**: Architectural detail cards, bedroom layouts, dietary philosophy.
- **Local Inquiry & Reservation Gate**: Standalone reservation inquiry forms with client-side verification and fallback routing to central reservation concierge.

---

## 4. Out-of-Scope (Non-Goals for v1.0)
- **Self-Service Multi-Currency Payment Gateway**: Direct checkout with instant credit card charging will not be in v1.0. High-touch retreat hospitality requires pre-screening and concierge intake before invoicing via Stripe Billing.
- **User Accounts & Guest Social Logins**: No passwords or guest profiles; interaction is handled via zero-auth concierge inquiry and secure email magic links.
- **Multi-Vendor Marketplace Submission Portal**: External hosts cannot list random retreats. All properties are strictly curated and operated under The Flowscape brand standards.
- **Real-Time Calendar Room Inventory Sync**: Handled via concierge CRM integration rather than complex real-time PMS socket synchronization in Phase 1.

---

## 5. Success Metrics & Key Results (OKRs)
1. **Performance**: Google Lighthouse score $\ge 95$ on Performance, Accessibility, and Best Practices.
2. **Speed**: First Contentful Paint (FCP) $< 1.2\text{s}$ and Time to Interactive (TTI) $< 2.0\text{s}$ on 4G mobile.
3. **Conversion**: $\ge 12\%$ conversion rate on Priority Circle Waitlist submissions from unique landing page visitors.
4. **Cross-Pollination**: $\ge 25\%$ click-through from master umbrella portal directly into specific regional sanctuary pages.
