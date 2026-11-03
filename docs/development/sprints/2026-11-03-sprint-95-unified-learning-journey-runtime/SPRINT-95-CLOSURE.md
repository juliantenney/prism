# Sprint 95 — Closure Record

**Sprint:** 95 — Unified Learning Journey Runtime  
**Opened:** 2026-11-03  
**Closed:** 2026-11-03  
**Status:** **CLOSED — ACCEPTED**  
**Type:** Architectural foundations → bounded implementation  
**Opening:** [S95-D01](decisions.md#s95-d01--open-sprint-95--unified-learning-journey-runtime)  
**Close:** [S95-D07](decisions.md#s95-d07--close-sprint-95--unified-learning-journey-runtime-accepted)  
**Predecessor:** [Sprint 94 — CLOSED — ACCEPTED](../2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-023](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-023--unified-learning-journey-runtime)

## Closure statement

Sprint 95 closed with a **unified, accessible, single-document Learning Journey runtime** accepted as an **additive** publishing capability, including author-facing unified download and automatic explicit artefact handoff.

Authors can download a self-contained unified shell ZIP through PRISM's normal **Download Unified Learning Journey** action. Constituent resources mount with container-scoped lifecycle; journey Overview and TOC navigation coexist with resource-level section navigation; declared produce/reference artefacts (including Assessment Pack → Interactive) resolve as labelled read-only references without exposing undeclared drafts.

**Closing Sprint 95 does not mean** any of the following have been done:

- replacing multi-document Learning Journey ZIP as the default download;
- presentation-sprint visual/nav polish (overlapping component nav, sidebar refinement, collapsible TOC, responsive/zoom);
- context-sensitive C5/C6 instructions about manual artefact transfer (multi-doc path);
- full keyboard / screen-reader audit beyond automated landmarks and author smoke;
- MathLive remount verification or MathJax/MathLive asset bundling in the unified ZIP;
- Learning Journey prompt-pipeline changes or regeneration of *Deciding Under Uncertainty*;
- Interactive V2, Course Home, server learner accounts, or AI marking.

Those are deferred (see [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)). Do not begin presentation-sprint implementation without separate authorisation.

---

## Completed scope

| ID | Title | Status |
| -- | ----- | ------ |
| M1 | Renderer Lifecycle Demonstrator (Assessment Pack) | **ACCEPTED** (S95-D02) |
| M2 | Unified Learning Journey Shell (additive) | **ACCEPTED** (S95-D03) |
| M3 | Explicit Learner Artefact Handoff | **ACCEPTED** (S95-D04) |
| M4 | Compatibility / Integration (qualified) | **ACCEPTED** (S95-D05) |
| M5 | Author-facing Unified Publishing | **ACCEPTED** (S95-D06) |

Acceptance criteria in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) are met for M1–M5.

---

## Architecture recorded at close

### Additive unified shell

- Package API: `assembleLearningJourneyUnifiedShellPackage` / `buildLearningJourneyUnifiedShellHtml` (`lib/learning-journey-unified-shell.js`).
- ZIP: `index.html` + `runtime/learner-renderer-vnext-browser.js` + media; Overview destination; persistent TOC; single `<main>`.
- Mount API: `renderLearnerResourceFragment` / `mountLearnerResource` / `unmountLearnerResource` (`lib/learner-renderer-vnext/resource-lifecycle.js`).
- Multi-document LJ ZIP and standalone publishing remain fully supported and are still the default LJ download path.

### Explicit artefact handoff

- Contract module: `lib/learner-renderer-vnext/learner-artefact-contract.js`.
- Authoring assemble proposes `produces` / `references` from explicit `commission.dependencies` + hydrated constructed workspaces (Assessment Pack and Interactive consumers).
- Live read-only resolution from the producer’s saved draft workspace only; missing-input UI; standalone fallback copy preserved.

### Author publishing (M5)

- Control: **Download Unified Learning Journey** in Utilities Learning Journey commissioning preview.
- Reuses prep/hydrate/preflight; readiness and unresolved-relationship feedback via toasts.
- No developer-console requirement for the author path.

---

## Verification evidence

| Date | Evidence | Result |
| ---- | -------- | ------ |
| 2026-11-03 | Sprint 95 focused suite (M1–M5 unit + browser + sequential nav + runtime script) | **41 passed, 0 failed** |
| 2026-11-03 | Adjacent AP render/persistence + LJ package + LJ home | **40 passed, 0 failed** |
| 2026-11-03 | Author live *Deciding Under Uncertainty* via **Download Unified Learning Journey** | **Accepted** — UI download; resources render; journey + component nav; C5→C6 labelled read-only artefact; automatic contract without manual commission ids |

Full ledger: [VALIDATION.md](VALIDATION.md). Real-journey notes: [REAL-JOURNEY-INTEGRATION.md](REAL-JOURNEY-INTEGRATION.md).

---

## Exit-criteria assessment

| Criterion | Assessment |
| --------- | ---------- |
| Container-scoped mount/unmount/remount for Assessment Pack | **Met** — M1 |
| Additive unified single-document shell with persistent navigation | **Met** — M2 |
| Explicit produce/reference artefact handoff (no implicit draft dump) | **Met** — M3 |
| Wider product lifecycle compatibility (synthetic + inventory) | **Met (qualified)** — M4; MathLive packaging remain debt |
| Author-facing unified publishing without console | **Met** — M5 |
| Real DUU C5→C6 automatic handoff in live browser | **Met** — author acceptance |
| Standalone + multi-document publishing preserved | **Met** — regressions green; unified non-default |
| Accessibility baseline for shell landmarks / nav | **Met (partial)** — automated + author smoke; full SR deferred |

---

## Debt at close

See [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md). Presentation-sprint polish and MathLive remount/packaging are **explicitly deferred** — not reopen triggers for Sprint 95.
