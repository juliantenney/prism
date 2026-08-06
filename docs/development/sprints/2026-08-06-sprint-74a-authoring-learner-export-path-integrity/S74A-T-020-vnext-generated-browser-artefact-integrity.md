# S74A-T-020 — vNext Generated Browser Artefact Integrity

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-020  
**Status:** **Done** (2026-08-06)  
**Mode:** Development/test tooling + documentation — **no** obsolete-renderer removal; **no** export/routing/Authoring behaviour changes  
**Authority:** [PLAN.md](PLAN.md) · [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## 1. Executive summary

T-020 establishes a trustworthy **source → generated browser artefact** chain for the definitive vNext renderer:

| Role | Path |
| ---- | ---- |
| **Authoritative source** | `lib/learner-renderer-vnext/*` |
| **Generation mechanism** | **One** builder: `scripts/build-learner-renderer-vnext-browser.js` |
| **Browser-loaded artefact** | `lib/learner-renderer-vnext-browser.js` → `window.PRISM_LEARNER_RENDERER_VNEXT` |
| **Companion artefacts** (same builder) | `lib/learner-renderer-vnext-export-runtime.js`, `lib/learner-renderer-vnext-export-runtime-source.js` |
| **Browser / production loading** | `index.html` script tags (static deployment) |
| **Rebuild** | `npm run build:learner-renderer-vnext-browser` |
| **Freshness gate** | `npm run check:learner-renderer-vnext-browser` + focused freshness test |

Stale-artefact risk is reduced by an automated freshness check that fails when committed artefacts diverge from a rebuild of current source. No obsolete-renderer work; no functional export/renderer behaviour changes.

---

## 2. Audit answers (evidence)

| # | Question | Finding |
| - | -------- | ------- |
| 1 | Authoritative renderer source | `lib/learner-renderer-vnext/*` — edit here; CommonJS modules; browser entry `browser-entry.js` |
| 2 | Browser-generated artefact | Primary: `lib/learner-renderer-vnext-browser.js`. Companions from same build: export-runtime + export-runtime-source |
| 3 | Generation mechanism | Single script `scripts/build-learner-renderer-vnext-browser.js` (custom CommonJS→UMD bundler) |
| 4 | Rebuild trigger | Manual/dev: `npm run build:learner-renderer-vnext-browser`. Alias: `npm run pretest:learner-renderer-vnext` (named script — **not** an automatic npm `pretest` for all tests; there is no `test:learner-renderer-vnext` script that auto-invokes it) |
| 5 | Current verification (before T-020) | Rebuild-before-some-suites by convention; browser-registration tests load the committed bundle; **no** automated stale gate |
| 6 | Stale artefact risks | Edit source without rebuild; commit source without generated outputs; browser HTTP cache via long-lived `?v=` on `index.html` script tags |
| 7 | Duplicate generation mechanisms | **None** for the shell browser bundle. Kitchen-sink fixture builder is unrelated. `learner-renderer-vnext-standalone-embed.js` is **hand-maintained** inject helper (not a second generator) |
| 8 | Manual steps | Rebuild after source edits; commit three generated files; optionally bump `index.html` `?v=` cache-busters |
| 9 | Browser loading path | `index.html` loads `lib/learner-renderer-vnext-browser.js` (then export-runtime-source + standalone-embed) before `app.js` |
| 10 | Production loading path | Same static `index.html`-driven path; Node is not involved at runtime |

---

## 3. Changes made

| File | Change |
| ---- | ------ |
| `scripts/build-learner-renderer-vnext-browser.js` | Export `generateTargetOutputs` for in-memory rebuild; clearer header; `require.main` guard |
| `scripts/check-learner-renderer-vnext-browser.js` | **New** freshness checker (exit 1 if stale/missing) |
| `package.json` | Add `check:learner-renderer-vnext-browser` |
| `tests/learner-renderer-vnext-browser-artefact-freshness.test.js` | **New** focused Node-based evidence (freshness + `index.html` load) |
| `docs/architecture/learner-renderer-vnext.md` | Artefact discipline section |
| `docs/architecture/renderer-export-behavior.md` | Freshness gate in layers table |
| Root `README.md` | Rebuild / check commands under Authoring export |

**Not changed:** obsolete renderer; routing; Authoring UI; Preview/HTML/ZIP behaviour; `app.js` export logic; `index.html` cache-bust query values (documented as remaining debt).

---

## 4. Verification performed

| Step | Result |
| ---- | ------ |
| `npm run check:learner-renderer-vnext-browser` | OK — artefacts match source |
| `npm run build:learner-renderer-vnext-browser` | Wrote three artefacts; no unexpected dirty generated tree beyond tooling |
| `node --test tests/learner-renderer-vnext-browser-artefact-freshness.test.js tests/learner-renderer-vnext-browser-registration.test.js` | **13/13 pass** |
| Scope review | No Legacy removal; no routing/export behaviour edits |

**Label:** Node-based results above are **supporting evidence**. Production browser-path confidence for Assemble/Preview/HTML/ZIP/Open remains **S74A-T-030**.

---

## 5. Remaining technical debt (deferred)

| Item | Owner |
| ---- | ----- |
| `index.html` `?v=` cache-bust not auto-bumped on rebuild | Documented; optional discipline for operators; not automated in T-020 |
| `pretest:learner-renderer-vnext` name implies npm lifecycle but is a **manual alias** | Documented; do not confuse with automatic pretest for all tests |
| Production browser-path baseline of full export spine | **S74A-T-030** |
| Obsolete renderer inventory/removal | **S74A-T-040** / **T-045** |

---

## 6. AC contribution

Contributes to **AC-04** (artefact reproducible, current, verification-gated), **AC-12** (Node evidence labelled), **AC-13** (static/browser-only intact). Does **not** claim AC-05 or obsolete-removal ACs.

---

## 7. Next task

**S74A-T-030** — Definitive vNext production-browser baseline. Do not begin until T-020 is accepted as Done.
