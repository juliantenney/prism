# Sprint 50 Decision Log

| ID | Date | Decision | Rationale | Status |
| -- | ---- | -------- | --------- | ------ |
| D-50-01 | 2026-06-20 | **Pedagogic manifestation before architecture expansion** | Sprint 49 demonstrated preservation and generation improvements on the Marx corpus; remaining work should focus on learner experience (visibility, reading order, compose fidelity, renderer salience) before introducing new contracts, ontology, or prompt layers | **Accepted** |
| D-50-02 | 2026-06-20 | **Seven-function instructional model accepted** | Orient, Think, Study, Do, Check, Reflect, Transfer (+ optional Support) validated against inventory and Marx corpus | **Accepted** |
| D-50-03 | 2026-06-20 | **Single-column instructional manifestation accepted** | Companion before Activity Flow; no two-column Compass sidebar for grammar pages | **Accepted** |
| D-50-04 | 2026-06-20 | **Compose + Renderer are primary manifestation ownership layers** | Scope confirmation: upstream generates; compose persists; renderer orders and labels | **Accepted** |
| D-50-05 | 2026-06-20 | **Instructional sequencing: Why → How → Study → Do → Check → Reflect → Transfer** | Minimal model + implementation spec; Phase 2 grammar | **Accepted** |
| D-50-06 | 2026-06-20 | **Study before Do when study materials exist** | Legacy renderer inverted order; grammar corrects | **Accepted** |
| D-50-07 | 2026-06-20 | **Unified Check** — checklist + expected output in one section | Eliminates duplicate Check/Output blocks | **Accepted** |
| D-50-08 | 2026-06-20 | **Reduced Compass responsibility** — progress-only | De-duplicates Orient/Think/Transfer signals | **Accepted** |
| D-50-09 | 2026-06-20 | **Remaining work prioritises learner experience over architecture** | Post-implementation: structure coherent; quality/richness is Sprint 51 | **Accepted** |

**Sprint status:** Closed — see [SPRINT-50-CLOSURE-REPORT.md](./SPRINT-50-CLOSURE-REPORT.md)

---

## Decision template

```
| D-50-NN | YYYY-MM-DD | <decision> | <rationale> | Accepted / Superseded / Deferred |
```

---

## Carry-forward decisions (Sprint 49 — do not re-litigate)

| ID | Decision | Status |
| -- | -------- | ------ |
| D-49-01 | GAM `text` exposition-only; cognition cues on non-text materials | **Accepted** |
| D-49-02 | FM-08 as blocking MUST in SP-01 | **Open** (optional GOOD in implementation) |
| — | DLA Framing Gate v1 — blocking mandatory framing, no auto-repair | **Accepted** |
| — | LD-COGNITION-ORIENTATION module + schema alignment | **Accepted** |

Reference: [`../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-DECISION-LOG.md`](../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-DECISION-LOG.md)

---

*Log finalised at Sprint 50 closure.*
