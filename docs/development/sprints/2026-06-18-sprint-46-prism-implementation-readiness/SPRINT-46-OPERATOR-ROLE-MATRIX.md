# SPRINT-46-OPERATOR-ROLE-MATRIX.md

## 1) Artefact Header

| Field | Value |
| ----- | ----- |
| Artefact ID | `S46-W1-ORM-GOV-001` |
| Version | `v1.0` |
| Status | Draft - execution artefact (W1) |
| Owner | `ASSIGNMENT REQUIRED (SO-LEAD)` |
| Reviewer | `ASSIGNMENT REQUIRED (SR-LEAD)` |
| Authority references | `SPRINT-46-CHARTER.md`; `SPRINT-46-GOVERNANCE-MODEL.md`; `SPRINT-46-EVIDENCE-STANDARD.md`; `SPRINT-46-AUTHORITY-RESOLUTION-PACKAGE.md`; Workstream 1 Instantiation Freeze conventions |

---

## 2) Role Definitions

| Role | Definition | Core duties |
| ---- | ---------- | ----------- |
| Stage Operator (SO) | Single accountable execution owner for a lifecycle stage | Execute stage tasks; ensure output completeness; prepare handoff contract; declare blockers/escalations |
| Stage Reviewer (SR) | Independent reviewer for stage outputs (non-self-approval) | Verify completeness/provenance/handoff readiness; validate scope compliance; recommend pass/conditional/fail |
| Decision Authority (DA) | Governance authority for overrides, blocker decisions, and required approvals | Decide blocker closure/override; approve conditional/rejected handoffs; provide gate sign-off per governance model |

---

## 3) Lifecycle Stage Assignments

### Assignment rules applied

- Single accountable owner rule: exactly one SO per stage.
- Reviewer assignment rule: SR cannot be the same person as stage SO.
- DA involvement rule: mandatory for conditional/rejected handoffs, blocker overrides, and gate decisions.

| Stage | Stage code | Accountable owner role | Reviewer role | DA involvement requirement | Handoff authority requirement |
| ----- | ---------- | ---------------------- | ------------- | -------------------------- | ----------------------------- |
| Generation | `GEN` | `SO-GEN` (single accountable owner) | `SR-GEN` (independent reviewer) | Mandatory if handoff is conditional/rejected or blocker exists | Handoff may pass with SR approval when no blocker; DA required for conditional/rejected |
| Evaluation | `EVAL` | `SO-EVAL` | `SR-EVAL` | Mandatory for boundary interpretation conflicts or blocked determination | SR validates pass; DA required for conditional/rejected or unresolved authority conflict |
| Repeatability | `REP` | `SO-REP` | `SR-REP` | Mandatory for blind/protocol exceptions or unresolved discordance | SR validates pass; DA required for exception/conditional/rejected |
| Regression | `REG` | `SO-REG` | `SR-REG` | Mandatory for mapping breaks or scope extension requests | SR validates pass; DA required for conditional/rejected or scope exception |
| Non-Target Check | `NTC` | `SO-NTC` | `SR-NTC` | Mandatory for D3 ambiguity or declaration conflicts | SR validates pass; DA required for conditional/rejected or D3 exception |
| Governance | `GOV` | `SO-GOV` | `SR-GOV` | Always required at gate outcomes and blocker overrides | DA sign-off required for Gate 0/1/2 decisions and any final authority statement |

---

## 4) Responsibility Matrix

### Legend

- `A` = Accountable
- `R` = Responsible
- `C` = Consulted
- `S` = Sign-off required

| Responsibility area | SO | SR | DA |
| ------------------- | -- | -- | -- |
| Stage execution activities | A/R | C | C |
| Stage output completeness check | A/R | R | C |
| Stage review and quality validation | C | A/R | C |
| Handoff decision: pass (no blocker) | R | A | C |
| Handoff decision: conditional/rejected | R | R | A/S |
| Escalation initiation and logging | A/R | C | C |
| Escalation resolution / override | C | C | A/S |
| Scope exception approval | C | C | A/S |
| Gate 0 sign-off | C | C | A/S |
| Gate 1 sign-off | C | C | A/S |
| Gate 2 authority sign-off | C | C | A/S |

---

## 5) Governance Rules

1. **No self-approval rule**
   - The accountable SO for a stage cannot be the approving SR for that same stage output.

2. **Single accountable owner rule**
   - Each lifecycle stage has exactly one accountable SO (`SO-<STAGE>`). Supporting contributors may exist but are not co-accountable.

3. **DA override rule**
   - Any blocker override, scope exception, or conditional/rejected handoff requires explicit DA decision and sign-off entry.

4. **Escalation handling rule**
   - Escalations must be classified as `blocking` or `non-blocking`, logged with owner and status, and resolved before stage exit can be final `PASS` when blocking.

---

## 6) Governance Authority Mapping

- Decision Authority (`DA`) is an operational authority role used for escalation resolution, override handling, and conditional/rejected handoff routing.
- `DA` actions remain subject to formal governance authority requirements defined in approved Sprint 46 governance artefacts.
- Gate approvals must follow the approved Sprint 46 governance model and decision-log sign-off requirements.
- Where applicable, formal sign-off requirements for `SDO`, `GL`, `EL`, and `OR` remain authoritative and are not superseded by operational `DA` involvement.

---

## 7) Gate Sign-Off Clarification

- `DA` involvement shown in responsibility matrices represents operational authority routing, not standalone gate approval authority.
- `DA` notation in Gate 0/1/2 rows does not replace required governance co-signatures defined by Sprint 46 governance artefacts.
- Formal gate approval authority remains governed by `SPRINT-46-GOVERNANCE-MODEL.md`, `SPRINT-46-CHARTER.md`, `SPRINT-46-EVIDENCE-STANDARD.md`, and recorded gate decisions in `SPRINT-46-DECISION-LOG.md`.

---

## 8) Traceability

### Traceability convention applied

Format: `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>`

- Sprint identifier: `S46`
- Workstream identifier: `W1`
- Artefact identifier (this artefact): `ORM`
- Stage identifier: `GOV`
- Sequence: `001`

Current traceability key:
- `S46-W1-ORM-GOV-001`

Related stage-role trace keys (for downstream linkage):
- `S46-W1-ORM-GEN-001`
- `S46-W1-ORM-EVAL-001`
- `S46-W1-ORM-REP-001`
- `S46-W1-ORM-REG-001`
- `S46-W1-ORM-NTC-001`
- `S46-W1-ORM-GOV-001`
