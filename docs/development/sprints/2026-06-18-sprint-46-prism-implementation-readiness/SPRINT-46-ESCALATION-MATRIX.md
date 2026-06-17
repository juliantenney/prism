# SPRINT-46-ESCALATION-MATRIX.md

## 1) Artefact Header

| Field | Value |
| ----- | ----- |
| Artefact ID | `S46-W1-ESC-GOV-001` |
| Version | `v1.0` |
| Status | Draft - execution artefact (W1) |
| Owner | `ASSIGNMENT REQUIRED (SO-LEAD)` |
| Reviewer | `ASSIGNMENT REQUIRED (SR-LEAD)` |
| Authority references | `SPRINT-46-OPERATOR-ROLE-MATRIX.md`; `SPRINT-46-STAGE-IO-SPEC.md`; `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`; `SPRINT-46-CHARTER.md`; `SPRINT-46-GOVERNANCE-MODEL.md`; `SPRINT-46-EVIDENCE-STANDARD.md`; `SPRINT-46-DECISION-LOG.md`; Workstream 1 Instantiation Freeze conventions |
| Traceability key | `S46-W1-ESC-GOV-001` |

---

## 2) Escalation Model Overview

### Purpose
Provide the authoritative operational routing model for escalation detection, handling, authority involvement, and closure across the Sprint 46 human-mediated lifecycle.

### Scope
- Applies to lifecycle stages `GEN`, `EVAL`, `REP`, `REG`, `NTC`, and `GOV`.
- Applies to escalations that affect stage entry, stage exit, handoff disposition, or governance decision readiness.
- Uses frozen conventions for severity classes, stage ownership, reviewer independence, authority routing, and traceability.

### Relationship to Handoffs
- Escalation status is a mandatory input to handoff disposition in `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`.
- Unresolved `BLOCKING` escalations prevent final `Pass`-equivalent stage exit and block normal handoff progression.
- `NON-BLOCKING` escalations may permit conditional handoff when explicitly recorded with owner, status, and resolution path.

### Relationship to Governance Controls
- Operational escalation handling is executed by stage owners/reviewers under `SPRINT-46-OPERATOR-ROLE-MATRIX.md`.
- Authority-routed escalations follow DA pathways while remaining subject to formal Sprint 46 governance sign-off requirements.
- Gate-relevant escalations must be linked to `SPRINT-46-DECISION-LOG.md` and handled under `SPRINT-46-GOVERNANCE-MODEL.md`.

---

## 3) Severity Classes

Frozen severity convention:
- `BLOCKING`
- `NON-BLOCKING`

Handling expectations:
- **BLOCKING:** Must be resolved or formally adjudicated before stage exit can be final pass-ready for downstream progression.
- **NON-BLOCKING:** Must be logged with owner, status, and resolution plan; may proceed under conditional handoff where authorised.

---

## 4) Escalation Categories

Minimum operational categories:
- Missing input
- Incomplete output
- Provenance deficiency
- Authority conflict
- Scope exception
- Unresolved disagreement
- Mapping failure
- Governance inconsistency

---

## 5) Escalation Routing Matrix

| Escalation Category | Severity Class | Originating Stage(s) | Initial Owner | Reviewer Involvement | DA Involvement Requirement | Resolution Path | Handoff Impact |
| ------------------- | -------------- | -------------------- | ------------- | -------------------- | -------------------------- | --------------- | -------------- |
| Missing input | `BLOCKING` (default), `NON-BLOCKING` if explicitly bounded and non-critical | `GEN`, `EVAL`, `REP`, `REG`, `NTC`, `GOV` | `SO-<STAGE>` | `SR-<STAGE>` validates input sufficiency disposition | Required if unresolved at stage level or handoff becomes conditional/rejected | Validate expected input set against `SPRINT-46-STAGE-IO-SPEC.md`; acquire missing item or authority-approved exception; update handoff record | Blocks normal handoff when unresolved and blocking; may allow conditional handoff when non-blocking and approved |
| Incomplete output | `BLOCKING` (default), `NON-BLOCKING` for bounded partial outputs with approved conditions | `GEN`, `EVAL`, `REP`, `REG`, `NTC` | `SO-<STAGE>` | `SR-<STAGE>` confirms completeness status and condition set | Required for conditional/rejected disposition or unresolved completion conflict | Reconcile against produced-output requirements; complete required output set or raise authority-routed exception | Blocks pass handoff if blocking; conditional handoff only with explicit conditions |
| Provenance deficiency | `BLOCKING` unless deficiency is non-material and explicitly accepted | `GEN`, `EVAL`, `REP`, `REG`, `NTC`, `GOV` | `SO-<STAGE>` | `SR-<STAGE>` verifies provenance fields and traceability evidence | Required when provenance gap cannot be closed at stage level or affects decision validity | Populate mandatory provenance fields and trace links per `SPRINT-46-EVIDENCE-STANDARD.md`; re-check by reviewer | Blocks handoff where evidence claims are untraceable; otherwise conditional with logged remediation |
| Authority conflict | `BLOCKING` | `EVAL`, `REP`, `REG`, `NTC`, `GOV` | `SO-<STAGE>` initiates conflict record | `SR-<STAGE>` records review position and unresolved point | Mandatory | Route through DA operational authority pathway; align with governance authority mapping and formal sign-off requirements | Handoff set to conditional/rejected pending authority resolution |
| Scope exception | `BLOCKING` | `GEN`, `EVAL`, `REP`, `REG`, `NTC`, `GOV` | `SO-<STAGE>` | `SR-<STAGE>` verifies scope deviation claim | Mandatory | Submit scope-exception escalation; resolve through governance process and logged approval before use | No normal handoff progression until approved scope treatment is logged |
| Unresolved disagreement | `BLOCKING` if impacts disposition, otherwise `NON-BLOCKING` with documented residual | `EVAL`, `REP`, `REG`, `NTC`, `GOV` | `SO-<STAGE>` | `SR-<STAGE>` is direct counterparty in disagreement record | Mandatory when disagreement affects pass/conditional/rejected outcome | Record disputed determination, route to DA when unresolved, capture final adjudication and rationale | Handoff conditional/rejected until adjudication if disposition-affecting |
| Mapping failure | `BLOCKING` | `REG` (primary), `NTC` (secondary impact), `GOV` (gate impact) | `SO-REG` (or current stage SO if detected elsewhere) | `SR-<STAGE>` validates mapping break and impact scope | Mandatory for unresolved mapping break or scope extension request | Validate mapping references, repair mapping integrity, or route scope-affecting exception to DA/governance | Blocks downstream non-target and governance-ready handoff when unresolved |
| Governance inconsistency | `BLOCKING` | `GOV` (primary), any stage when detected | `SO-GOV` (or detecting stage SO until GOV takeover) | `SR-GOV` (or stage reviewer pre-transfer) validates inconsistency claim | Mandatory | Reconcile inconsistency against governance artefacts, record adjudication path, and log required decision entry | Blocks gate-linked handoff/closure actions until resolved and logged |

---

## 6) Escalation Resolution Rules

### Closure Requirements
- Each escalation must have a unique escalation reference, owner, severity, status, and closure state.
- Closure requires explicit resolution outcome (`resolved`, `accepted with conditions`, or authority-routed rejection outcome) recorded in stage and handoff records.
- `BLOCKING` escalations must be resolved or formally adjudicated before final pass-ready handoff.

### Evidence Requirements
- Resolution claims must include traceable supporting evidence aligned to `SPRINT-46-EVIDENCE-STANDARD.md`.
- Minimum provenance fields must be present for escalation evidence:
  - Source artefact(s)
  - Claim type
  - Retrieval/record date
  - Recorder/author role
- Resolution rationale must reference authoritative artefacts and impacted stage outputs.

### Decision-Log Requirements
- Gate-relevant, authority-routed, scope, and unresolved blocker escalations must be linked to `SPRINT-46-DECISION-LOG.md`.
- Escalation records must include decision-log reference when adjudication affects handoff disposition or governance outcomes.
- Final governance-stage dispositions must retain escalation-to-decision-log linkage for independent re-check.

### Supersession Requirements
- If escalation handling supersedes a prior handoff decision or stage package, predecessor and successor references must be explicit.
- Supersession entries must preserve historical chain (`prior ID/version -> successor ID/version`) and traceability keys.
- Superseded escalation records remain retained; they are not deleted or overwritten.

---

## 7) Governance Linkage

### Operational Escalation Handling
- Stage-level escalation detection, logging, and first-line routing are operational responsibilities under `SO`/`SR` roles in `SPRINT-46-OPERATOR-ROLE-MATRIX.md`.
- Handoff decisions and conditions must reflect current escalation state using `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`.

### Formal Governance Escalation
- DA-routed escalations operate within formal governance authority requirements and do not replace required governance co-signatures.
- Scope exceptions, authority conflicts, and governance inconsistencies require governance-consistent adjudication and documentation.

### Gate Escalation Handling
- Gate-affecting escalations are governed by `SPRINT-46-GOVERNANCE-MODEL.md` and must be reflected in `SPRINT-46-DECISION-LOG.md`.
- No gate-linked approval action may proceed with unresolved critical escalation contradictions.

---

## 8) Traceability Requirements

Frozen traceability convention applied:
- Format: `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>`

Operational requirements:
- Every escalation record must include:
  - escalation reference ID,
  - stage code,
  - affected artefact identifiers and versions,
  - associated traceability keys,
  - linked handoff ID/version.
- Cross-stage escalations must preserve predecessor/successor trace links through handoff contracts and decision-log references.
- Escalation resolution records must be reproducible by an independent reviewer using cited artefact paths and section/table references.
