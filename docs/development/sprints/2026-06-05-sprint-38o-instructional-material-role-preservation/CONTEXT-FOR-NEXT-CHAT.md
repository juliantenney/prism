# Context for next chat — Sprint 38-O

**Pack:** `docs/development/sprints/2026-06-05-sprint-38o-instructional-material-role-preservation/`

**Status:** **CLOSED** — [38O-5-sprint-closure.md](observations/38O-5-sprint-closure.md) · **SUCCESS**

---

## Mission (completed)

Discovery sprint — instructional material **role preservation** distinct from 38M/38N body fidelity.

**Answer:** Role fidelity **is** a distinct architectural concern. Future implementation sprint recommended.

---

## Closure summary

| Item | Outcome |
|------|---------|
| **Verdict** | SUCCESS |
| **Hypothesis** | Supported — roles degrade independently of body fidelity |
| **Root cause** | Missing role authority; split key vocabularies; additive merge; render precedence |
| **Recommendation** | F1 registry-led hybrid; charter implementation sprint separately |
| **Proof concept** | `roleOk` additive to `proofOk` (RF-1..RF-8) |

**Full closure:** [38O-5-sprint-closure.md](observations/38O-5-sprint-closure.md)

---

## If continuing role fidelity work

Start from 38O-4 recommendation (F1) and 38O-5 disposition. Implementation sprint: [Sprint 38-P](../2026-06-05-sprint-38p-instructional-role-fidelity/) — do not reopen 38O, 38M, or 38N.

**Key artefacts:**

- [38O-1](observations/38O-1-baseline-role-survival-trace.md) — evidence  
- [38O-2](observations/38O-2-role-taxonomy-page-mapping-analysis.md) — taxonomy  
- [38O-3](observations/38O-3-failure-mode-classification.md) — failure modes  
- [38O-4](observations/38O-4-preservation-options-recommendation.md) — preservation strategy  
