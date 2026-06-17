# SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md

## 1) Artefact Header

| Field | Value |
| ----- | ----- |
| Artefact ID | `S46-W1-HCT-GOV-001` |
| Version | `v1.0` |
| Status | Draft - execution artefact template (W1) |
| Owner | `ASSIGNMENT REQUIRED (SO-LEAD)` |
| Reviewer | `ASSIGNMENT REQUIRED (SR-LEAD)` |
| Authority references | `SPRINT-46-OPERATOR-ROLE-MATRIX.md`; `SPRINT-46-STAGE-IO-SPEC.md`; `SPRINT-46-CHARTER.md`; `SPRINT-46-GOVERNANCE-MODEL.md`; `SPRINT-46-EVIDENCE-STANDARD.md`; `SPRINT-46-DECISION-LOG.md`; Workstream 1 Instantiation Freeze conventions |
| Traceability key | `S46-W1-HCT-GOV-001` |

---

## 2) Handoff Metadata

| Field | Value |
| ----- | ----- |
| Handoff ID | `S46-W1-HO-<SOURCE_STAGE>-<SEQ>` |
| Version | `vX.Y` |
| Source Stage | `<GEN|EVAL|REP|REG|NTC>` |
| Target Stage | `<EVAL|REP|REG|NTC|GOV>` |
| Date/Time | `<YYYY-MM-DDThh:mm:ssZ>` |
| Stage Operator | `<SO-<SOURCE_STAGE> / assignee>` |
| Stage Reviewer | `<SR-<SOURCE_STAGE> / assignee>` |
| Decision Authority (if applicable) | `<DA assignee or N/A>` |

Allowed stage transitions for this template:
- `GEN -> EVAL`
- `EVAL -> REP`
- `REP -> REG`
- `REG -> NTC`
- `NTC -> GOV`

---

## 3) Input Artefact Inventory

| Artefact Identifier | Version | Traceability Key | Status |
| ------------------- | ------- | ---------------- | ------ |
| `<input-artefact-01>` | `vX.Y` | `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>` | `<draft|final|superseded>` |
| `<input-artefact-02>` | `vX.Y` | `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>` | `<draft|final|superseded>` |

Notes:
- Include all predecessor-stage artefacts required by `SPRINT-46-STAGE-IO-SPEC.md`.
- If an input is superseded, include successor reference in this record or supersession section.

---

## 4) Output Artefact Inventory

| Artefact Identifier | Version | Traceability Key | Status |
| ------------------- | ------- | ---------------- | ------ |
| `<output-artefact-01>` | `vX.Y` | `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>` | `<draft|final|superseded>` |
| `<output-artefact-02>` | `vX.Y` | `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>` | `<draft|final|superseded>` |

Notes:
- Outputs must satisfy the stage produced-output expectations in `SPRINT-46-STAGE-IO-SPEC.md`.
- Status and version must be explicit for all outputs.

---

## 5) Exit Criteria Checklist

Use frozen exit-check convention from `SPRINT-46-STAGE-IO-SPEC.md`.

| Exit Criterion | Pass | Pass With Conditions | Fail | Notes / Conditions |
| -------------- | ---- | -------------------- | ---- | ------------------ |
| Completeness | `[ ]` | `[ ]` | `[ ]` | `<required outputs present/non-empty>` |
| Provenance | `[ ]` | `[ ]` | `[ ]` | `<provenance completeness and traceability status>` |
| Handoff Readiness | `[ ]` | `[ ]` | `[ ]` | `<target-stage readiness and dependency status>` |
| Unresolved Blockers | `[ ]` | `[ ]` | `[ ]` | `<blocking/non-blocking status and references>` |

Checklist rule:
- Exactly one state must be selected per criterion (`Pass`, `Pass With Conditions`, or `Fail`).

---

## 6) Provenance Block

Mandatory provenance fields (per `SPRINT-46-EVIDENCE-STANDARD.md`):

| Field | Value |
| ----- | ----- |
| Source artefact(s) | `<path(s) or artefact IDs>` |
| Claim type | `<fact|interpretation|boundary-sensitive|other>` |
| Retrieval/record date | `<YYYY-MM-DD>` |
| Recorder/author role | `<SO|SR|DA|other approved role>` |

Supporting traceability context:

| Field | Value |
| ----- | ----- |
| Source section/table references | `<section/table anchors>` |
| Authority document linkage | `<governing artefact reference(s)>` |

---

## 7) Open Issues and Escalations

### 7.1 Blocking Issues

| Issue ID | Description | Escalation Reference | Owner | Status |
| -------- | ----------- | -------------------- | ----- | ------ |
| `<BLK-01>` | `<blocking issue>` | `<escalation ID / decision ref>` | `<owner>` | `<open|resolved>` |

### 7.2 Non-Blocking Issues

| Issue ID | Description | Escalation Reference | Owner | Status |
| -------- | ----------- | -------------------- | ----- | ------ |
| `<NBL-01>` | `<non-blocking issue>` | `<escalation ID / decision ref or N/A>` | `<owner>` | `<open|resolved>` |

Escalation handling note:
- Escalation routing and authority handling must follow `SPRINT-46-OPERATOR-ROLE-MATRIX.md` and `SPRINT-46-GOVERNANCE-MODEL.md`.

---

## 8) Handoff Decision

Select one:
- `[ ]` ACCEPT
- `[ ]` ACCEPT WITH CONDITIONS
- `[ ]` REJECT

Decision rationale:
- `<rationale text>`

Conditions (if applicable):
- `<condition 01>`
- `<condition 02>`

---

## 9) Approval Section

| Approval Role | Name/ID | Decision | Date/Time | Signature/Record Reference |
| ------------- | ------- | -------- | --------- | -------------------------- |
| SO confirmation | `<SO-<SOURCE_STAGE>>` | `<confirm>` | `<YYYY-MM-DDThh:mm:ssZ>` | `<record ref>` |
| SR confirmation | `<SR-<SOURCE_STAGE>>` | `<confirm>` | `<YYYY-MM-DDThh:mm:ssZ>` | `<record ref>` |
| DA confirmation (when required) | `<DA or N/A>` | `<confirm|N/A>` | `<YYYY-MM-DDThh:mm:ssZ or N/A>` | `<record ref or N/A>` |

Authority note:
- DA confirmation in this template reflects operational authority routing and does not replace formal governance sign-off requirements where applicable.

---

## 10) Decision Log Linkage

| Field | Value |
| ----- | ----- |
| Decision-log reference | `<SPRINT-46-DECISION-LOG.md entry ID/link>` |
| Related gate references | `<Gate 0|Gate 1|Gate 2|Gate 3+|N/A>` |
| Supersession references | `<prior handoff ID/version or N/A>` |

Linkage requirements:
- Gate-relevant outcomes, exceptions, and authority decisions must be linked to `SPRINT-46-DECISION-LOG.md`.
- If this handoff supersedes a prior handoff, include explicit predecessor and successor references.
