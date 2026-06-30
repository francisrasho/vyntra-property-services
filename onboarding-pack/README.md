# Vyntra Property Services — Contractor Declaration & Agreement

A premium, 20-page contractor onboarding handbook for Vyntra Property Services.
Navy / gold / white corporate design, plain-English copy, icons, checklists, tables,
a job-lifecycle flow, a plain-English contractor agreement, and a fillable
declaration page.

## Deliverables (`dist/`)

| File | What it is |
| --- | --- |
| `Vyntra-Contractor-Declaration-and-Agreement.pdf` | **Interactive PDF** — the version you send to subcontractors. 19 pages, 24 fillable AcroForm fields (9 document-checklist boxes incl. availability, plus 8 declaration checkboxes incl. an accuracy/currency confirmation, 6 detail fields and a signature box). Fill on screen in any PDF reader, or print and sign. Footer page numbers auto-increment (CSS counter). |
| `Vyntra-Contractor-Declaration-and-Agreement.docx` | **Editable Microsoft Word** version for future updates — branded headings, tables, callouts and checklists. Opens in Word or Google Docs. |

## Editable design master (`src/`)

| File | What it is |
| --- | --- |
| `onboarding.html` | **Self-contained design master** — the full layout with fonts embedded as base64. This is the editable design file: open in any browser, edit the markup/CSS, and re-export. |
| `onboarding.template.html` | Same document with fonts kept external (a `/*__FONTS__*/` marker) — easier to edit copy without the large embedded font blocks. |

### Using it in Figma or Canva

There is no native binary design step in this pipeline — `onboarding.html` **is**
the editable design source. To bring it into a visual editor:

- **Figma** — install the free *html.to.design* plugin, paste the URL or import
  `onboarding.html`; it rebuilds the pages as editable Figma frames (fonts: Outfit
  for display, Work Sans for body — both free on Google Fonts).
- **Canva** — create A4 pages, drop in the page previews from `previews/` as a
  visual reference, and rebuild with Canva text/shape elements using the brand
  palette below. (Canva has no direct HTML import.)

## Brand

| Token | Value |
| --- | --- |
| Navy (ink) | `#0F172A` |
| Gold | `#D4AF37` |
| White | `#FFFFFF` |
| Light grey | `#F8FAFC` |
| Display font | Outfit |
| Body font | Work Sans |

**Logo** — the official Vyntra "VP | VYNTRA PROPERTY SERVICES" lockup
(`src/assets/logo-source.webp`). `build/process-logo.mjs` keys out the navy
background, erases the "Professional • Reliable • Results" tagline, and produces
three assets: `logo-clear.png` (transparent lockup, white wordmark — cover),
`logo-on-navy.png` (lockup flattened on brand navy — DOCX cover) and
`logo-light.png` (lockup with the wordmark recoloured navy for light backgrounds —
used in every page header).

## Rebuilding from source

```sh
cd onboarding-pack
npm install                      # playwright, pdf-lib, pdfjs-dist, @napi-rs/canvas
pip3 install python-docx

node build/make-fonts.js          # embed fonts -> build/fonts.css
node build/process-logo.mjs       # key navy from src/assets/logo-source.webp -> logo assets
node build/assemble.js            # inject fonts + logos -> src/onboarding.html
node build/render-and-measure.js  # render base PDF + measure field positions
node build/add-fields.js          # overlay fillable AcroForm fields -> dist/*.pdf
python3 build/docx_build.py       # build dist/*.docx
node build/previews.js            # render previews/page-XX.png
node build/contact-sheet.mjs      # previews/_contact-sheet.png
```

Chromium is driven via Playwright using the system browser
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`); adjust the path in the
build scripts if your environment differs.

## Page map

1. Cover · 2. Table of Contents (auto-generated) · 3. Welcome · 4. How Vyntra Works ·
5–7. Code of Conduct · 8–10. Payment Policy (incl. Customer Payments) · 11. Break Policy ·
12. Vyntra Subcontractor Portal · 13. Required Documents · 14–17. Independent Contractor
Agreement · 18. FAQ · 19. Declaration & Agreement (fillable) · 20. What Happens Next.

The Table of Contents page numbers are computed automatically at build time
(`build/assemble.js`) from section order, so they stay correct when pages change.
The PDF footer page numbers use a CSS counter; the DOCX uses a live Word TOC field.

## Editable placeholders to confirm

- **Legal entity** — set to the sole-trader trading name "Vyntra Property Services".
  To switch to a company, see the BRAND/LEGAL note at the top of
  `src/onboarding.template.html` (3 places to change).
- **Public Liability minimum** — set to **$20 million** on p.9 and in Agreement
  clause 5. Adjust both if a different minimum is required.

---
Version 1.0 (final) · Effective 26 June 2026 · Vyntra Property Services · ABN 69 252 402 831
