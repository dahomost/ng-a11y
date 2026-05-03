# WCAG 2.1 AA & Section 508 — Implementation Map

This application targets **WCAG 2.1 Level AA** success criteria commonly required for **Section 508** conformance programs (ICT Refresh aligns 508 with WCAG for web content).

Automated tests (`Playwright` + `@axe-core/playwright`) cover many rules; **manual** verification is still required for cognition, screen reader nuance, and real-device contrast under user settings.

## Perceivable

| Need | What we do |
|------|----------------|
| **1.1.1 Non-text Content** | Icons/decorative elements avoided without text alternatives; buttons use visible text or `aria-label` where needed |
| **1.3.1 Info and Relationships** | Semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<caption>`, table `scope`, labelled headings |
| **1.4.3 Contrast (Minimum)** | Bootstrap defaults + design tokens in `styles.scss`; validate brand overrides manually |
| **1.4.11 Non-text Contrast** | Focus outlines `:focus-visible`; interactive controls use Bootstrap focus styles |

## Operable

| Need | What we do |
|------|----------------|
| **2.1.1 Keyboard** | All interactive controls are native links/buttons/inputs; modal uses CDK focus trap |
| **2.4.1 Bypass Blocks** | “Skip to main content” link targets `#main-content` |
| **2.4.3 Focus Order** | DOM order matches visual order; modal moves focus to first field |
| **2.4.6 Headings and Labels** | Unique `headingId` per card; dialog titles tied via `aria-labelledby` |

## Understandable

| Need | What we do |
|------|----------------|
| **3.3.1 Error Identification** | `aria-invalid` on fields; errors surfaced in `role="alert"` region |
| **3.3.2 Labels or Instructions** | `<label for>` paired with inputs; hints use `aria-describedby` |

## Robust

| Need | What we do |
|------|----------------|
| **4.1.1 Parsing** | Valid Angular templates; avoid duplicate IDs |
| **4.1.2 Name, Role, Value** | Buttons/links expose accessible names; loading uses `aria-busy` |

## Testing

1. **Unit / integration:** `npm run test:ci` (Jest + jest-preset-angular).
2. **Automated a11y:** `npm run e2e` — serves the app and runs Playwright + axe with tags `wcag2a`, `wcag2aa`, `wcag21aa`.
3. **Manual:** NVDA/JAWS/VoiceOver spot checks, keyboard-only flows, 200% zoom, Windows **High Contrast** mode.

## Disclaimer

“WCAG 2.1 AA certified” requires an organizational audit (often including VPAT/ACR). This repo provides engineering controls and automated gates—not legal certification.
