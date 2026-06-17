# SPRINT-46-INTEGRATED-RUNBOOK.md

## 1) Artefact Header

| Field | Value |
| ----- | ----- |
| Artefact ID | `S46-W3-IRB-GOV-001` |
| Version | `v1.0` |
| Status | Draft - execution artefact (W3) |
| Owner | `ASSIGNMENT REQUIRED (GL-LEAD)` |
| Reviewer | `ASSIGNMENT REQUIRED (SDO-REVIEW)` |
| Authority references | `SPRINT-46-OPERATOR-ROLE-MATRIX.md`; `SPRINT-46-STAGE-IO-SPEC.md`; `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`; `SPRINT-46-ESCALATION-MATRIX.md`; `SPRINT-46-LIFECYCLE-TRACE-MAP.md`; `SPRINT-46-EVIDENCE-PACKET-SPEC.md`; `SPRINT-46-PROVENANCE-CONTROL-SPEC.md`; `SPRINT-46-STAGE-EXIT-CONTROL-CHECKLIST.md`; `SPRINT-46-HANDOFF-VALIDATION-PROTOCOL.md`; `SPRINT-46-ESCALATION-CONTROL-PROTOCOL.md`; `SPRINT-46-DECISION-LOG-INTEGRATION-SPEC.md`; `SPRINT-46-W2-CONTROL-TRACEABILITY-MAP.md`; `SPRINT-46-CHARTER.md`; `SPRINT-46-GOVERNANCE-MODEL.md`; `SPRINT-46-EVIDENCE-STANDARD.md`; `SPRINT-46-DECISION-LOG.md` |
| Traceability key | `S46-W3-IRB-GOV-001` |

---

## 2) Purpose and Scope

### Purpose
Provide the integrated operational runbook for Sprint 46 by defining how Workstream 1 operating semantics and Workstream 2 controls are executed together across the full PRISM lifecycle.

### Scope
- Covers lifecycle execution flow: `GEN -> EVAL -> REP -> REG -> NTC -> GOV`.
- Defines operational sequencing, control application points, handoff and escalation flow, governance interaction, and decision-log integration.
- Uses authoritative Workstream 1, Workstream 2, and governance artefacts as fixed source foundations.

### Out of Scope
- Redefinition of lifecycle stages, role model, handoff semantics, escalation semantics, control behaviour, or governance rules.

---

## 3) Runbook Usage Principles

1. **Integration-not-redesign principle**  
   This runbook coordinates existing authoritative artefacts; it does not replace or redefine them.

2. **Stage-order integrity principle**  
   Execution follows fixed order: `GEN -> EVAL -> REP -> REG -> NTC -> GOV`.

3. **Control-before-progression principle**  
   Stage progression requires execution of applicable Workstream 2 controls at defined checkpoints.

4. **Evidence-and-provenance integrity principle**  
   All operational claims must be evidence-backed and provenance-valid under the evidence and provenance standards.

5. **Governance-linkage principle**  
   Gate-relevant outcomes, authority-routed conditions, and escalation adjudications must be linked to `SPRINT-46-DECISION-LOG.md`.

---

## 4) Lifecycle Execution Overview

Integrated lifecycle model:

1. Stage executes according to Workstream 1 stage semantics.
2. Evidence packet is assembled/updated for stage activity.
3. Provenance controls are applied to evidence-bearing claims.
4. Stage-exit checklist determines criterion-level and stage-level disposition.
5. Handoff validation determines `ACCEPT`, `ACCEPT WITH CONDITIONS`, or `REJECT`.
6. Escalation controls govern any issue requiring routing, monitoring, or closure.
7. Decision-log integration records governance-significant outcomes.
8. Next stage begins only when handoff and blocker controls permit progression.

---

## 5) Stage-by-Stage Operating Sequence

## 5.1 Generation (`GEN`)

- Execute stage responsibilities per `SPRINT-46-STAGE-IO-SPEC.md`.
- Capture stage evidence using `SPRINT-46-EVIDENCE-PACKET-SPEC.md`.
- Apply provenance controls from `SPRINT-46-PROVENANCE-CONTROL-SPEC.md`.
- Run stage exit checks via `SPRINT-46-STAGE-EXIT-CONTROL-CHECKLIST.md`.
- Validate `GEN -> EVAL` handoff through `SPRINT-46-HANDOFF-VALIDATION-PROTOCOL.md`.
- Route/track issues via `SPRINT-46-ESCALATION-CONTROL-PROTOCOL.md`.
- Record decision-log linkage when conditions or governance-relevant outcomes occur.

## 5.2 Evaluation (`EVAL`)

- Consume accepted `GEN` handoff as required input.
- Perform evaluation activities per `SPRINT-46-STAGE-IO-SPEC.md`.
- Update stage evidence packet and apply provenance checks.
- Execute exit checklist and validate `EVAL -> REP` handoff.
- Route unresolved disagreements/authority conflicts through escalation controls.
- Record decision-log entries for governance-impacting outcomes.

## 5.3 Repeatability (`REP`)

- Consume accepted `EVAL` handoff and execute repeatability activities.
- Capture protocol/check evidence in evidence packet.
- Validate provenance and interpretation-sensitive claims where present.
- Execute exit checklist and validate `REP -> REG` handoff.
- Route exceptions/discordance through escalation controls.
- Link governance-significant outcomes to decision log.

## 5.4 Regression (`REG`)

- Consume accepted `REP` handoff and execute regression activities.
- Capture comparison/mapping evidence in packet form.
- Apply provenance and mapping-related validation controls.
- Execute exit checklist and validate `REG -> NTC` handoff.
- Route mapping failures/scope-sensitive issues per escalation protocol.
- Record decision-log entries for authority/gate-relevant impacts.

## 5.5 Non-Target Check (`NTC`)

- Consume accepted `REG` handoff and execute non-target assessment.
- Capture determination evidence and declaration-sensitive records.
- Apply provenance controls to comparator/declaration-linked claims.
- Execute exit checklist and validate `NTC -> GOV` handoff.
- Route D3/declaration conflicts and unresolved blockers via escalation controls.
- Link governance-impacting outcomes to decision log.

## 5.6 Governance (`GOV`)

- Consume accepted `NTC` handoff and consolidate lifecycle evidence.
- Validate governance-ready package completeness, provenance, and linkage integrity.
- Apply final stage exit checks for governance disposition readiness.
- Ensure all authority-routed escalations are resolved/adjudicated and linked.
- Execute decision-log integration for final disposition and next authorised action.
- Produce governance-ready closure or continuation disposition consistent with authoritative governance model.

---

## 6) Control Application Points

Control application checkpoints per stage:

1. **During stage execution**
   - Evidence packet structuring (`W2-C01`)
   - Provenance control (`W2-C02`)

2. **At stage exit**
   - Stage-exit checklist execution (`W2-C03`)

3. **At stage transfer**
   - Handoff validation protocol (`W2-C04`)

4. **When issues/escalations arise**
   - Escalation control protocol (`W2-C05`)

5. **When governance-significant outcomes occur**
   - Decision-log integration specification (`W2-C06`)

6. **Across lifecycle**
   - Control traceability map (`W2 traceability map`) to confirm end-to-end coverage.

---

## 7) Handoff Execution Flow

Handoff flow for each transition:

1. Source stage finalizes exit-check results.
2. Source stage prepares handoff contract package (`SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`).
3. Handoff validation executes using `SPRINT-46-HANDOFF-VALIDATION-PROTOCOL.md`.
4. Disposition assigned:
   - `ACCEPT`
   - `ACCEPT WITH CONDITIONS`
   - `REJECT`
5. If conditional/rejected or authority-sensitive, escalate via approved pathway.
6. Record decision-log linkage when required.
7. Target stage starts only when progression conditions are satisfied.

---

## 8) Escalation Execution Flow

Escalation flow:

1. Detect and initiate escalation record.
2. Capture escalation evidence and provenance-valid support.
3. Validate category/severity/routing preconditions against escalation matrix.
4. Route:
   - stage-resolvable path, or
   - authority-routed path.
5. Monitor status/owner/dependency impact through closure.
6. Apply blocking vs non-blocking handling rules.
7. Close with explicit outcome and linkage to affected handoff/stage.
8. Record decision-log linkage for governance-significant escalation events.

---

## 9) Decision-Log Interaction Model

Decision-log interaction points:

- Stage exit outcomes with governance impact.
- Handoff outcomes `ACCEPT WITH CONDITIONS` or `REJECT`.
- Authority-routed escalations and adjudications.
- Scope/authority interpretation-sensitive decisions.
- Supersession of prior accepted decisions.
- Governance-stage final disposition and next authorised action.

Interaction rule:
- Where decision-log linkage is required by Workstream 2 controls, disposition is not considered governance-complete until linkage is recorded.

---

## 10) Governance Interaction Model

- This runbook operates within governance constraints in `SPRINT-46-GOVERNANCE-MODEL.md`.
- Operational `SO`/`SR` actions follow role assignments from `SPRINT-46-OPERATOR-ROLE-MATRIX.md`.
- Authority-routed conditions use DA pathways while preserving formal governance sign-off requirements.
- Gate-relevant exceptions, scope actions, and unresolved critical conditions require governance-consistent handling and decision-log recording.

---

## 11) Traceability and Evidence Requirements

- Evidence records must follow packet structure in `SPRINT-46-EVIDENCE-PACKET-SPEC.md`.
- Provenance must satisfy `SPRINT-46-PROVENANCE-CONTROL-SPEC.md` including interpretation declaration requirements where applicable.
- Stage/handoff/escalation/decision records must maintain traceability links using frozen conventions.
- Cross-stage claims must remain reproducible and independently re-checkable.
- Supersession chains for controls/decisions must preserve historical lineage.

---

## 12) Runbook Integrity Constraints

1. No stage bypass is permitted.
2. No handoff progression without validated handoff disposition.
3. No pass-ready progression with unresolved blocking escalation unless formally adjudicated per approved pathways.
4. No governance-complete status for required events without decision-log linkage.
5. No semantic or control redefinition via runbook updates.
6. All runbook uses must remain consistent with authoritative source artefacts.

---

## 13) References to Authoritative Source Artefacts

### Workstream 1 (Operating Semantics)
- `SPRINT-46-OPERATOR-ROLE-MATRIX.md`
- `SPRINT-46-STAGE-IO-SPEC.md`
- `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`
- `SPRINT-46-ESCALATION-MATRIX.md`
- `SPRINT-46-LIFECYCLE-TRACE-MAP.md`

### Workstream 2 (Control Layer)
- `SPRINT-46-EVIDENCE-PACKET-SPEC.md`
- `SPRINT-46-PROVENANCE-CONTROL-SPEC.md`
- `SPRINT-46-STAGE-EXIT-CONTROL-CHECKLIST.md`
- `SPRINT-46-HANDOFF-VALIDATION-PROTOCOL.md`
- `SPRINT-46-ESCALATION-CONTROL-PROTOCOL.md`
- `SPRINT-46-DECISION-LOG-INTEGRATION-SPEC.md`
- `SPRINT-46-W2-CONTROL-TRACEABILITY-MAP.md`

### Governance and Standards
- `SPRINT-46-CHARTER.md`
- `SPRINT-46-GOVERNANCE-MODEL.md`
- `SPRINT-46-EVIDENCE-STANDARD.md`
- `SPRINT-46-DECISION-LOG.md`
