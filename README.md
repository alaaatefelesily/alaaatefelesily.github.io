# Alaa Atef Elesily — Portfolio (EN / AR)

- `index.html` English, `ar/index.html` Arabic (RTL), linked with hreflang.
- `links.html`, `tools.html` shared pages. `about.html` / `contact.html` redirect to the home sections.
- SEO: canonical, Open Graph / Twitter cards, JSON-LD (Person, WebSite, ProfilePage), `sitemap.xml`, `robots.txt`.
- Deploy: upload everything to the root of the `alaaatefelesily.github.io` repo.
- After deploy: add the site in Google Search Console and submit `https://alaaatefelesily.github.io/sitemap.xml`.

## v3 changes
- Palette "Lapis & Sand", fonts: Bricolage Grotesque + Hanken Grotesk (EN), Cairo (AR). Default theme: dark.
- Hero: official introduction + social accounts (inline SVG icons, no external icon dependency for brands).
- Smooth inertial scrolling and smooth anchor navigation via `lenis.min.js` (Lenis 1.3.27, MIT, vendored). Sliding nav pill, scroll progress bar, cross-page fade (View Transitions).
- `img/` holds the optimized photos; the horizontal "Trip" gallery lives in the `#journey` section.
- Language switch button removed from all pages (the Arabic page still exists at `/ar/`).
- Lucide is pinned to 0.469.0 (newer major versions dropped brand icons).

## v6 changes — Mono + Lime
- Palette: black / white + lime (highlighted words) + periwinkle (4th colour). Variables at the top of the v6 block in `global.css` (`--hl`, `--hlbg`, `--c4`).
- Hero portrait: duotone arch with a colour "lens" that follows the cursor (auto-roams on touch), halftone, scan line, rotating text ring, floating chips.
- Icons are monochrome; colour appears on hover only.
- New `fx.js`: intro loader (once per session), split-text headings, custom cursor, magnetic buttons, scroll-velocity marquee, image parallax, film grain; theme toggle uses a circular wipe.

## v7 changes
- Logo: official emblem (monogram "A" drawn on load) + full name and role instead of the short `dev.alaa` handle. The loader shows the full name too.
- Hero portrait: tighter crop, curtain reveal, slow Ken-Burns, rotating light ring, cursor-driven 3D tilt + glare, periodic shine, soft glow and dotted depth layer. The old black "lens" was removed.
- Spacing: one system at the top of the v7 block in `global.css` (`--sec`, `--gap`) controls section, card, grid and footer spacing.
- Footer `dev.alaa` wordmark: only two colours (`--wA`, `--wB`), hard-edged wipe (no blending), letters rise on scroll, bob, lift near the cursor, plus a sliding two-colour bar.

## v7.1 changes
- Logo is text only (`dev.alaa`), no icon. Glow around the hero portrait removed.
- Fonts: Bricolage Grotesque (display) + Manrope (body) + JetBrains Mono; Cairo for Arabic. Variables at the top of the v7.1 block in `global.css`.
- Shorter hero introduction (EN/AR).
- Footer wordmark: jumping letters that flip between solid white and lime outline, plus a scrolling marquee. Colours: `--wA`, `--wB`.

## v7.2 – v7.4 changes
- New hero portrait (`img/hero.webp`), favicon / `profile-hero.*`, share card `og.jpg` and PWA icons (`img/icon-192.png`, `icon-512.png`) built from the new photo; `site.webmanifest` added.
- Animations no longer switch off when the OS asks for "reduced motion" (that was why they only ran on phones). Heavy desktop effects (backdrop blur on cards, parallax reads) were lightened.
- Custom cursor circle removed.
- Mobile: scroll-blur on the hero text removed, hero portrait smaller, new dropdown menu (closes on outside tap, scroll, Esc).
- Robustness: `localStorage` is wrapped in try/catch (private mode no longer breaks the menu/theme); mobile address-bar resize no longer re-lays out the Trip gallery.
- Added `404.html`, a "Skip to content" link, `theme-color` + manifest on every page.
