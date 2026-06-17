# SPRINT-46-PROVENANCE-CONTROL-SPEC.md

## 1) Artefact Header

| Field | Value |
| ----- | ----- |
| Artefact ID | `S46-W2-PCS-GOV-001` |
| Version | `v1.0` |
| Status | Draft - execution artefact (W2) |
| Owner | `ASSIGNMENT REQUIRED (EL-LEAD)` |
| Reviewer | `ASSIGNMENT REQUIRED (GL-LEAD)` |
| Authority references | `SPRINT-46-EVIDENCE-STANDARD.md`; `SPRINT-46-EVIDENCE-PACKET-SPEC.md`; `SPRINT-46-OPERATOR-ROLE-MATRIX.md`; `SPRINT-46-STAGE-IO-SPEC.md`; `SPRINT-46-HANDOFF-CONTRACT-TEMPLATE.md`; `SPRINT-46-ESCALATION-MATRIX.md`; `SPRINT-46-LIFECYCLE-TRACE-MAP.md`; `SPRINT-46-GOVERNANCE-MODEL.md`; `SPRINT-46-DECISION-LOG.md`; Workstream 1 Instantiation Freeze conventions |
| Traceability key | `S46-W2-PCS-GOV-001` |

---

## 2) Purpose and Scope

### Purpose
Define the authoritative provenance-control model used to ensure evidence claims are traceable, verifiable, and reproducible throughout Sprint 46 execution.

### Scope
- Applies to all evidence-bearing claims across stages `GEN`, `EVAL`, `REP`, `REG`, `NTC`, and `GOV`.
- Applies to provenance records in stage outputs, handoff contracts, escalation records, evidence packets, and governance decision-support records.
- Defines provenance validation, linkage, failure handling, remediation, and decision-log integration requirements.

### Out of Scope
- Redefinition of lifecycle stages, role model, stage semantics, handoff semantics, escalation semantics, or governance rules.
- Definition of new stage behaviour outside the approved Workstream 1 operating-model layer.

---

## 3) Mandatory Provenance Fields

Every evidence-bearing claim must include the following mandatory provenance fields:

1. **Source artefact(s)**  
   - Specific artefact path(s), ID(s), or both.
2. **Claim type**  
   - `fact|interpretation|boundary-sensitive|other`.
3. **Retrieval/record date**  
   - Date evidence was retrieved or recorded (`YYYY-MM-DD`).
4. **Recorder/author role**  
   - Role responsible for recording the claim (for example `SO`, `SR`, `DA`, or approved governance/evidence role).

Supporting provenance fields (required where applicable):
- Source section/table references.
- Source version or snapshot identifier.
- Authority document reference(s) for interpretation-sensitive claims.
- Linked traceability key(s).
- Interpretation Rule Declaration (required for interpretation-dependent claims).
- Declaration Source Reference (required for interpretation-dependent or boundary-sensitive claims).

---

## 4) Provenance Validation Rules

A provenance record is valid only when all rules below are satisfied:

1. All mandatory provenance fields are present and non-empty.
2. Source references resolve to existing artefacts and relevant sections/tables.
3. Claim type is appropriate to the claim content and review context.
4. Recorder/author role is consistent with assigned operational/governance roles.
5. Retrieval/record date is present and logically consistent with artefact timeline.
6. Version/snapshot reference is present for mutable or supersedable sources.
7. Boundary-sensitive or interpretation claims cite governing authority documents.
8. Linked traceability keys are syntactically valid and resolvable.
9. Interpretation-dependent claims include both:
   - Interpretation Rule Declaration, and
   - Declaration Source Reference.

Validation outcome states:
- `VALID`
- `VALID WITH CONDITIONS`
- `INVALID`

---

## 5) Source-to-Claim Linkage Requirements

- Each claim must map to one or more explicit source references.
- Linkage must include section/table-level anchors where available.
- Derived claims must show source chain (`primary source -> intermediate interpretation -> final claim`).
- Cross-stage claims must identify predecessor handoff or packet linkage.
- Claims without source-to-claim linkage are non-acceptable for gate-relevant use.

---

## 6) Authority-Reference Requirements

- Claims involving scope boundaries, authority interpretation, conditional/rejected disposition, or escalation adjudication must reference governing authority artefacts.
- Authority references must include at minimum one applicable source from:
  - `SPRINT-46-GOVERNANCE-MODEL.md`
  - `SPRINT-46-EVIDENCE-STANDARD.md`
  - `SPRINT-46-DECISION-LOG.md`
  - relevant Workstream 1 semantic artefact(s)
- DA-routed or gate-impacting claims must include explicit governance linkage reference and disposition path.

---

## 7) Version and Snapshot Requirements

### Version Requirements
- Provenance records must include source version for versioned artefacts.
- If source and claim are recorded at different versions, the claim must state which version was used.
- Superseded-source usage requires explicit successor linkage and impact note.

### Snapshot Requirements
- For dynamic or mutable records, capture a stable snapshot reference (ID, timestamp, or frozen copy reference).
- Snapshot metadata must include capture time and recorder role.
- Re-checkable claims must be reconstructable from recorded snapshot/version information.

---

## 8) Provenance Failure Conditions

A provenance failure exists if one or more conditions occur:

1. Missing mandatory provenance field(s).
2. Unresolvable source artefact or source section reference.
3. Missing or invalid authority reference for interpretation-sensitive claims.
4. Mismatched source version/snapshot relative to claim statement.
5. Claim type inconsistent with evidence content.
6. Traceability linkage missing or invalid.
7. Provenance chain broken by unlinked supersession.

Failure severity classification (operational handling only):
- `BLOCKING`: failure prevents reliable claim verification or affects stage/handoff/gate disposition.
- `NON-BLOCKING`: failure is bounded, does not invalidate current disposition, and has logged remediation.

---

## 9) Provenance Remediation Workflow

### Step 1: Detect and Record
- Record provenance issue in evidence packet and/or handoff issue block.
- Assign owner and initial severity.

### Step 2: Validate Impact
- Determine whether failure impacts stage exit, handoff disposition, escalation path, or governance decision readiness.
- Confirm whether condition is `BLOCKING` or `NON-BLOCKING` using approved escalation conventions.

### Step 3: Correct Provenance
- Populate or correct missing/invalid fields.
- Restore source-to-claim linkage and authority references.
- Add version/snapshot linkage where missing.

### Step 4: Re-Review
- Reviewer validates corrected provenance record.
- If unresolved or authority-sensitive, route through DA pathway per approved model.

### Step 5: Close and Link
- Record remediation outcome (`resolved|accepted with conditions|rejected`).
- Update evidence packet/handoff/escalation references.
- Add decision-log linkage where governance-impacting.

---

## 10) Decision-Log Linkage Requirements

Decision-log linkage is mandatory when provenance issues:
- affect conditional/rejected handoff outcomes,
- require DA or governance adjudication,
- impact gate-relevant evidence acceptance,
- involve scope/authority interpretation conflicts,
- supersede previously accepted provenance for governance-significant claims.

Linkage record must include:
- decision-log entry reference,
- impacted claim/artefact reference,
- remediation/adjudication outcome,
- effective version/snapshot after resolution.

---

## 11) Traceability Requirements

Frozen traceability conventions apply and must be preserved:
- `S46-W1-<ARTEFACT>-<STAGE>-<SEQ>` for Workstream 1 semantic anchors.
- `S46-W2-<ARTEFACT>-<STAGE>-<SEQ>` for Workstream 2 control artefacts.

Provenance traceability controls:
- Every provenance record must link claim -> source artefact -> source section/table -> authority reference (where required).
- Every provenance record must include related stage code and linked handoff/evidence packet IDs where applicable.
- Supersession trace chains must remain explicit and auditable (`prior -> successor`).
- Provenance traces must be reproducible by an independent reviewer without hidden context.
