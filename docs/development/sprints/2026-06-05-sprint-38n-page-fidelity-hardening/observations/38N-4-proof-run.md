# 38N-4 — Proof run

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Proof replay — harness + artefacts  
**Harness:** `artefacts/ev-38n-proof-replay.mjs`  
**Run ID:** `EV-38N-AFTER`  
**Source artefacts:** `EV-38M-AFTER` (38M fresh capture)  
**Harness version:** `38N-4`

---

## §1 Executive summary

Sprint 38-N is a **hardening** sprint, not discovery. Proof replays the fresh 38M capture through hardened validators and renderer.

| Question | Answer |
|----------|--------|
| R1 — marker generalisation | **Resolved** — G4/G5 pass on `Weak Judgement (Slogan-style)` phrasing |
| R2 — render alias sequencing | **Resolved** — A3 render order: worked → worksheet → scenario → checklist |
| R3 — validator/schema alignment | **Resolved** — 38M + 38L validators pass on alias-key layout |
| `proofOk` | **true** (no conditional exceptions) |
| 38M preservation regression | **21/21** tests pass |

**Verdict:** **SUCCESS** — all charter success criteria met.

---

## §2 Harness configuration

| Setting | Value |
|---------|-------|
| Script | `artefacts/ev-38n-proof-replay.mjs` |
| Version | `38N-4` |
| Mode | Artefact replay (no LLM pipeline) |
| Source | `../38m-…/artefacts/EV-38M-AFTER-{gam,design-page}.json` |
| Output dir | `artefacts/` (this sprint) |

**Pipeline path (replay):**

```text
EV-38M-AFTER design-page.json + gam.json
  → validate38MPageFidelity
  → validate38LPageGamPreservation
  → validateA3MaterialsSequencing
  → buildUtilityStructuredHtmlForTest
  → validateA3RenderMaterialOrder (A3 block via fixed findActivityTitles)
```

**Command:**

```bash
node docs/development/sprints/2026-06-05-sprint-38n-page-fidelity-hardening/artefacts/ev-38n-proof-replay.mjs
```

**Regression tests:**

```bash
node --test tests/page-38n-fidelity-hardening.test.js tests/page-38m-a3-sequencing.test.js tests/page-38m-gam-preservation.test.js tests/page-38l-gam-preservation.test.js
```

---

## §3 Artefacts written

| Artefact | Purpose |
|----------|---------|
| `EV-38N-AFTER-design-page.json` | Copy of composed page (source: EV-38M-AFTER) |
| `EV-38N-AFTER-gam.json` | GAM authority source |
| `EV-38N-AFTER-render.html` | Re-render with 38N renderer hardening |
| `EV-38N-AFTER-run-log.json` | Validation metrics + `proofOk` |

---

## §4 Validation results

| Check | EV-38M-AFTER (pre-38N) | EV-38N-AFTER (post-38N) |
|-------|------------------------|-------------------------|
| `proofOk` | **false** | **true** |
| `validation38M.ok` | false (G4/G5 markers) | **true** |
| `validation38LRegression.ok` | false (schema) | **true** |
| `a3Sequencing.pageJson.ok` | true | **true** |
| `a3Sequencing.render.ok` | false | **true** |
| Regression tests | 17/17 | **21/21** |

### Gate matrix (post-38N replay)

| Gate | Result |
|------|--------|
| G1 M14 ratio ≥90% | **PASS** (100%) |
| G2 M15 ratio ≥90% | **PASS** (100%) |
| G3 Strategy A + E | **PASS** (semantic, via `scenarios[]`) |
| G4 Weak/Strong exemplars | **PASS** (semantic markers) |
| G5 Guided table exemplar | **PASS** (`hasGuidedTableExemplar`) |
| G6–G10 | **PASS** (unchanged from 38M) |
| G15/G16 A3 page JSON order | **PASS** |
| A3 render order | **PASS** |

---

## §5 Residual disposition

No new residuals introduced. R1–R3 from 38M-6 are **closed**. 38M L4 preservation guarantees (100% post-merge parity, anti-synopsis) remain intact.
