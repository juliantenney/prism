# Sprint 102 — Status / work log

**Sprint:** 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring  
**Opened:** 2026-11-20  
**Status:** **OPEN** — 102D complete; **102E in progress** (runtime path fix applied; live E2E pending)  
**Design:** [S102-D04](decisions.md#s102-d04--commission-native-authoring-design) — Accepted  
**Readiness:** [S102-D05](decisions.md#s102-d05--implementation-readiness) — Ready with qualifications  
**Implementation:** [S102-D06](decisions.md#s102-d06--implement-commission-native-authoring-102d) — Accepted

| Item | State |
| ---- | ----- |
| S102-D01 … S102-D05 | **Accepted** |
| S102-D06 Implement 102D | **Accepted** |
| 102A–102C | **COMPLETE** |
| 102D Implementation + automated tests | **COMPLETE** |
| 102E runtime audit + fix | **IN PROGRESS** — browser bind load + navigation fixed; live E2E pending |
| Sprint close | **Pending** — not authorised |

---

## Work log

### 2026-11-20 — 102E Expository publication defects

- **S8 metadata leak:** response/journal contract keys (`response_id`, `producer`, `stable_identifier`, …) omitted from structured-material learner headings.  
- **Figure production prose:** layout-commission language (e.g. “Arrange three substantial nodes”) suppressed from published figure descriptions.  
- **E1 journal text:** Expository can host constructed text via shared page-root `learner_artefacts.produces[]` (assembly ownership + DP guidance + commission injection). No Interactive activities. Already-published pages need DP re-author/reassemble for the field; S8/figure fixes apply on re-export.  
- Tests: `tests/s102e-expository-publication-defects.test.js`; shared artefact contract updated.

### 2026-11-20 — 102E runtime path fix

- **Root cause:** `lib/commission-native-lo-bind.js` was not loaded in `index.html`, so browser intake never bound LOs / never omitted foundation (all four products).  
- **Navigation:** create/save handoff now expands parent LJ before selecting the child (parity with open-product).  
- Hardened marker JSON extract (optional fences). Stamped commissioned LO fields onto brief `initialBrief`.  
- Tests: `tests/s102e-commission-native-runtime-path.test.js`.  
- **Already-created children:** delete and recommission after hard-refresh (bind module + cache-bust). Do not repair topology in place.  
- Sprint 102E remains open for live validation.

### 2026-11-20 — 102D implementation

- Added `lib/commission-native-lo-bind.js`; wired `intakeCommission` topology omit + seed provenance.  
- LJ Requirements/Progression/DP prompts: journey + component LO markers.  
- `app.js`: commissioned LO resolve fallback; planning delivery preamble + embed; Expository grounding note; AP Purpose wording.  
- Tests: `tests/s102-commission-native-lo-bind.test.js` — all passing; related intake/AP regressions green.  
- **Stop.** No commit/push. No 102E. No component regeneration.
