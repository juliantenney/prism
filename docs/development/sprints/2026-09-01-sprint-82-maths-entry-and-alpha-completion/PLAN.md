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
S82-G2B  Production MathLive hardening              COMPLETE
S82-G3   Realistic Lagrangian learner validation  NEXT
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

### S82-G2B — Production MathLive hardening

- **Status:** **COMPLETE** — [record](S82-G2B-production-hardening.md)
- **Delivered:** production `math-entry-*` adapter, `lib/mathlive/` assets, conditional learner-package inclusion, label/focus fix, VK manual policy, 19 focused tests + 339/339 first-class
- **Bounded deferrals:** Tab exit automation, 200% zoom, AT tree duplication, physical-keyboard non-TeX entry → G3/G4

### S82-G3 — Realistic Lagrangian learner validation

- **Status:** **NEXT**  
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
