# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static HTML landing page for **Davi Lima Advogados**, a law firm offering a free eligibility check for doctors who may have overpaid INSS (Brazilian social security contributions) due to holding multiple employment ties ("vínculos"). The page's goal is to capture a lead's name/WhatsApp number, show a simulated estimate of recoverable amount, then push them to WhatsApp to talk to the firm.

The `src/` directory is empty and unused — do not assume a build pipeline exists.

## Architecture

There is no build system, package manager, or framework — just three plain files, loaded directly by the browser with no bundler:

- **[style.css](style.css)**: all CSS, using custom properties defined on `:root` for a graphite/orange theme modeled on lomazy.com.br: `--black`/`--black2`/`--black3` backgrounds, `--orange` accent, `--border*` hairlines, and `--font-display` (Barlow Condensed, uppercase headings) / `--font-body` (Barlow). Sections default to `--black`; `section.alt` switches to `--black2`, and `.centered` centers a section's eyebrow + `h2`. Other section-level classes: `.hero`, `.promise`, `.midcta`, `.about`. The fixed `<header>` gets `.scrolled` from `script.js` once the page scrolls.
- **[index.html](index.html)**: a sequence of `<section>` elements in narrative order — hero/lead form → problem explanation → 3-step process → audience fit → risk-free promise → mid-page CTA → FAQ → lawyer bio → footer. Links `style.css` in `<head>` and loads `script.js` before `</body>`.
- **[script.js](script.js)**: IIFE, vanilla JS, no dependencies; drives the lead-capture flow.

### Lead-capture flow (the core interactive piece)

The hero section (`#verificar`) contains three mutually-exclusive panels toggled via `display` (never removed from the DOM):

1. `#stForm` — inputs `#fNome` (name), `#fZap` (WhatsApp number), and selects `#fVinc` (number of employment ties), `#fRenda` (income bracket, keys `1`-`4`), `#fAnos` (years in this situation). Submit button `#btnVerificar` validates name is non-empty and phone has ≥10 digits (`#fError` shown otherwise).
2. `#stAnalysis` — a fake staged "analyzing" animation (`#as1`-`#as4` gain `.active`/`.done` classes on staggered `setTimeout`s) purely for UX pacing before the result appears.
3. `#stResult` — computed estimate, rendered into `#rExc`, `#rMeses`, `#rSelic`, `#rTotal`, and a WhatsApp deep link `#rWa` prefilled with a message summarizing the lead's inputs and estimate.

The estimate math (in the script's `showResult`): `faixas` maps income bracket → `[min, max]` monthly overpayment range (BRL). Total months = years × 12. Base recoverable = bracket range × months. A flat 15% is added on top to represent estimated Selic interest correction. All figures are estimates for lead-gen purposes, not real legal/actuarial calculations — treat this logic as marketing copy, not something to "fix" for numeric rigor unless asked.

The WhatsApp target number is hardcoded as `5581999898760` in the `wa.me` link inside `showResult`; the same number appears in the footer as `(81) 99989-8760`.

## Working in these files

- Images live in [img/](img/): `logo-horizontal.svg` (header and footer logo — same file, referenced twice; text converted to outlines, transparent background, metallic-orange gradients), the favicon set (`favicon.svg` = the logo symbol centered in a square, `favicon-192.png`, `apple-touch-icon.png`, plus `/favicon.ico` at the repo root with 16/32px PNGs; bump the `?v=` query in `<head>` when they change so browsers drop the cached icon), and `davi-lima.jpg` (lawyer photo in the about section). Reference them by relative path; don't reintroduce inline base64 data URIs.
- Element IDs are the wiring between `index.html` and `script.js`; if you rename or restructure form/result elements, update the corresponding `getElementById` calls in `script.js`.
- Copy is in Brazilian Portuguese and addresses doctors specifically (medical multi-employment is the whole premise) — preserve tone and domain framing when editing copy.
- No tests, linter, or build/dev-server command exist for this repo. Verify changes by opening [index.html](index.html) directly in a browser — it loads `style.css`, `script.js`, and `img/*` via relative paths, so keep the directory layout intact.

## Deployment

[CNAME](CNAME) (`recuperacaoinssacimadoteto.com.br`) indicates this is served via GitHub Pages from this repo. Pushing to the default branch is effectively a deploy — treat commits accordingly.
