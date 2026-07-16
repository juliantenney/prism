# Sprint 65 — Samples

Stable references to page artefacts. Prefer links over copying large JSON/HTML into this folder.

Rendered HTML and additional captures are added during **S65-BL-001** and **S65-BL-007**.

---

## Primary reference (S65-EV-01)

| Item | Path |
| ---- | ---- |
| Assembled RNA materials page | [`tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`](../../../../../tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json) |

**Role:** Initial reference case for baseline audit and bounded prototype (S65-D03 — not sole acceptance).

**Expected signals (investigate; presence varies by fixture richness):** activity identifiers/titles · preambles · episode archetypes · beat functions · material types · instructional functions · expected outputs · learner tasks · reasoning orientations · self-explanation · bridges · transformation · transfer · checklists · duration · grouping · outcomes · sequence · assessment · page synthesis.

---

## Companion (S65-EV-02)

| Item | Path |
| ---- | ---- |
| RNA assessment page | [`tests/fixtures/page-render/ld-rna-hcv-assessment-page.json`](../../../../../tests/fixtures/page-render/ld-rna-hcv-assessment-page.json) |

---

## Optional historical context (S65-EV-03)

| Item | Path |
| ---- | ---- |
| Sprint 30 RNA page JSON | [`…/live-artefacts/rna-page.json`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-page.json) |
| Sprint 30 RNA render HTML | [`…/live-artefacts/rna-render.html`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-render.html) |

Use only as historical context; may predate current vNext contracts.

---

## Local captures (S65-BL-001)

| Capture | Path | Status |
| ------- | ---- | ------ |
| Primary baseline HTML | [`rna-hcv-baseline-render.html`](rna-hcv-baseline-render.html) | Captured |
| Assessment companion HTML | [`ld-rna-hcv-assessment-baseline-render.html`](ld-rna-hcv-assessment-baseline-render.html) | Captured |
| Capture metadata | [`rna-hcv-baseline-render.capture.json`](rna-hcv-baseline-render.capture.json) | Captured |
| Audit harness | [`capture-baseline-render.js`](capture-baseline-render.js) | Non-production |
| Structure extract | [`rna-hcv-baseline-structure.json`](rna-hcv-baseline-structure.json) | Derived |
| Frequency scan (S65-BL-002) | [`scan-signal-inventory-frequency.js`](scan-signal-inventory-frequency.js) · [`signal-inventory-frequency.json`](signal-inventory-frequency.json) | Captured |
| Baseline screenshots | [`../screenshots/baseline/`](../screenshots/baseline/) | Captured |
| Before/after prototype screenshots | Pending S65-BL-007 | — |

---

## Cross-sample set

Selected during **S65-BL-008**. Candidates include Sprint 62 acceptance pages and other `tests/fixtures/page-render/*` fixtures (marx, inflation, kitchen-sink, climate, etc.).
