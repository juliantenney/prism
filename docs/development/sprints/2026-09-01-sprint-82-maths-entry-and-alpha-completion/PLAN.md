# Sprint 82 — Plan

**Status:** **OPEN**  
**Dashboard:** [STATUS.md](STATUS.md)  
**Handover:** [HANDOVER.md](HANDOVER.md)

Gate IDs: `S82-G#`. Task/decision IDs: `S82-T-###`, `S82-D##`.

---

## Programme sequence

```text
S82-G1   Semantic learner input modality          COMPLETE (pre-sprint)
S82-G2   Learner interaction diagnostic           COMPLETE (T-001)
S82-G2A  MathLive interaction spike               COMPLETE (D02 accepted)
S82-G2B  Implement alpha MathLive treatment       NEXT / AUTHORISED
S82-G3   Realistic Lagrangian learner validation  NOT STARTED
S82-G4   Focused a11y / keyboard / persistence    NOT STARTED
S82-G5   First-class gate + sprint closeout       NOT STARTED
```

Gate 2A outcome recorded ([S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive)). G2B implements and hardens the accepted MathLive alpha treatment.

---

## Gate definitions

### S82-G1 — Semantic learner input modality

- **Status:** **COMPLETE** (before sprint formalisation)  
- **Authority:** [semantic-learner-input-modality-gate-1.md](../../governance/semantic-learner-input-modality-gate-1.md)  
- **Tests:** 11/11 modality tests; first-class 339/339  
- **Did not change:** learner UI, persistence, surfaceKind, table entry  

### S82-G2 — Gate 2 learner interaction diagnostic

- **Status:** **COMPLETE**  
- **Record:** [S82-T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md)  
- **Governance:** [semantic-learner-input-modality-gate-2-diagnostic.md](../../governance/semantic-learner-input-modality-gate-2-diagnostic.md)  
- **Key finding:** modality lost at `workspaceFromResponsePart()`; persistence TeX-ready  

### S82-G2A — MathLive interaction spike

- **Status:** **COMPLETE**  
- **Record:** [S82-G2A-mathlive-interaction-spike.md](S82-G2A-mathlive-interaction-spike.md) · [evidence](S82-G2A-spike-evidence.md)  
- **Outcome:** **A — GO ALPHA MATHLIVE** — [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) **accepted** (2026-09-01)

### S82-G2B — Implement alpha MathLive treatment

- **Status:** **NEXT / AUTHORISED**
- **Decision:** [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) — MathLive for `inputModality: math` on `text_entry`
- **Scope:**
  - Promote/harden `inputModality` propagation (G2A scaffolding → production behaviour)
  - Ship MathLive enhancement with canonical textarea authority and fallback unchanged
  - Remove spike-only naming/assets (`math-entry-spike`, `lib/mathlive-spike/` path strategy → production naming/packaging)
  - **From G2A evidence — bounded hardening (not retroactively passed):**
    - Label / `math-field` focus association (`for` vs primary control)
    - Keyboard Tab / Shift+Tab exit behaviour
    - Virtual-keyboard policy (on-focus vs icon; learner discoverability)
    - Accessibility-tree / duplicate-control review
    - 200% zoom/reflow check
    - Learner-package MathLive asset copying and path verification
    - Realistic generated Lagrangian workflow validation (construction without TeX typing)
  - Focused automated tests; do not add custom PRISM keyboard or rich-text editor
- **Does not change:** draft envelope, DLA, GAM, `surfaceKind`, assessment architecture

### S82-G3 — Realistic Lagrangian learner validation

- **Status:** **NOT STARTED**  
- **Intent:** End-to-end completion of commissioned maths fields in realistic Lagrangian activity  

### S82-G4 — Focused verification

- **Status:** **NOT STARTED**  
- **Intent:** Keyboard-only, a11y labelling/focus, persistence restore, multi-field independence, fallback  

### S82-G5 — Engineering gate + closeout

- **Status:** **NOT STARTED**  
- **Intent:** `npm run test:first-class` green; sprint closure record; programme pointers updated  

---

## Pre-S82 closed work (record only)

**Graphics material-role grounding** — discovered during Maths Entry validation; fixed pre-S82. Not an active Sprint 82 stream. Observe future visuals in normal use; do not extend architecture without new material defect.

---

## Explicitly not in Sprint 82

See [SPRINT-82-CHARTER.md](SPRINT-82-CHARTER.md) §Non-goals.

Sprint 81 architecture (surface families, criterion→field mapping, free-text diagnosis) remains **closed**.

---

## Task index

| ID | Title | Status |
| -- | ----- | ------ |
| [S82-T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md) | Gate 2 learner interaction diagnostic | **COMPLETE** |
| [S82-G2A](S82-G2A-mathlive-interaction-spike.md) | MathLive interaction spike | **COMPLETE** |

G2B task record to be added when implementation opens.
