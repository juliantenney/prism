# Context for next chat — Sprint 38-P

**Pack:** `docs/development/sprints/2026-06-05-sprint-38p-instructional-role-fidelity/`

**Status:** **CHARTERED** — **38P-1 START HERE**

---

## Current status

Sprint 38-P is **chartered** — implementation sprint for instructional role fidelity. No phases started. First deliverable: role authority architecture design (38P-1).

---

## Mission

Implement **F1 — Registry-led hybrid** from 38O-4. Establish `roleOk` as an additive proof dimension alongside existing `proofOk`.

**Target outcome:**

```text
proofOk: true  +  roleOk: true
```

Role guarantees must not weaken 38M/38N body-fidelity guarantees.

---

## Known findings (from 38O)

| Finding | Detail |
|---------|--------|
| Orthogonality | `proofOk: true` coexists with `roleOk: false` on A4 (`EV-38M-AFTER`) |
| Root cause | Missing role authority; split key vocabularies; additive merge; render key-order precedence |
| A4 pattern | Compose weaken → additive merge → render prefer compose keys |
| Taxonomy | 17+ role families; `role_family := f(GAM.type, GAM.purpose)` |
| Failure modes | RN, DP, CP, RI, RD, AP dominant on A4 teaching roles |
| Strategy | F1: registry + explicit metadata + merge supersession + render role precedence |
| Criteria | RF-1..RF-8 (role uniqueness, no weak-first render, stable identity, etc.) |

**38O closure:** [38O-5-sprint-closure.md](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-5-sprint-closure.md)

---

## Success criteria (sprint completion)

- One authoritative role instance per instructional role family  
- No weaker duplicate precedes authoritative role in render  
- Stable role identity GAM → Page → Render  
- No role inversion  
- `roleOk: true` on proof workload  
- `proofOk: true` remains — 38M/38N intact  
- Regression suite passes (existing + new 38P tests)

---

## Open implementation questions (for 38P-1)

| Question | Notes |
|----------|-------|
| Registry module location | New `lib/page-role-registry.js` vs extend `page-gam-materials-preserve.js`? |
| Metadata shape | Structured material entries vs parallel `material_roles{}` map on activity |
| Supersession policy | Delete stub keys vs mark `authority: superseded` and suppress at render |
| Render integration | Extend `materials_order` vs new `role_sequence` field vs registry-driven auto-order |
| Heading authority | Registry heading vs `prettyMaterialHeading(key)` fallback |
| Activity-row roles | How scaffolds (`scaffold_hint`, `learner_task`) relate to material role registry |
| Checklist alias groups | Single `verification_checklist` family vs sub-roles |
| Validator surface | New `validate38PRoleFidelity` module vs extend existing validators |
| Proof harness | Extend `ev-38n-proof-replay.mjs` vs new `ev-38p-proof-replay.mjs` |
| Compose raw path | RF-8 audit only, or in-scope compose weakening fix? |

---

## Phase sequence

| Phase | Focus |
|-------|-------|
| **38P-1** | Role authority architecture (design) |
| **38P-2** | Role registry implementation |
| **38P-3** | Merge supersession implementation |
| **38P-4** | Render role-precedence implementation |
| **38P-5** | roleOk validation and proof harness |
| **38P-6** | Proof run (`EV-38P-AFTER`) |
| **38P-7** | Sprint closure |

---

## Immediate next task — 38P-1

**Deliverable:** `observations/38P-1-role-authority-architecture.md`

Design the role authority model:

1. Registry schema (GAM → role_family → canonical key → heading → sequence)  
2. Page material metadata fields (`role_family`, `authority`)  
3. Supersession rules at merge  
4. Render precedence rules (extend 38N pattern)  
5. Integration map to existing lib surfaces  
6. RF-1..RF-8 → validator mapping sketch  

**No production code in 38P-1.**

---

## Hold conditions

- Do not reopen 38M or 38N missions.  
- Extend only — additive guarantees.  
- F1 is the mandated strategy (not F2 merge-led hybrid unless 38P-1 documents explicit scope reduction with evidence).

---

## Key references

| Doc | Path |
|-----|------|
| Charter | [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) |
| 38O-4 F1 + RF criteria | [38O-4](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md) |
| 38O-2 taxonomy | [38O-2](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-2-role-taxonomy-page-mapping-analysis.md) |
| 38O-3 failure modes | [38O-3](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-3-failure-mode-classification.md) |
| 38I A4 episode | [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| Pre-38P baseline | `EV-38M-AFTER-*`, `EV-38N-AFTER-*` |
