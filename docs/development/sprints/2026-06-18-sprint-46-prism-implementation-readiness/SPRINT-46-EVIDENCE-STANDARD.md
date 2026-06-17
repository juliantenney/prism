# SPRINT-46 EVIDENCE STANDARD

**Sprint:** 46 - PRISM Implementation Readiness  
**Status:** Draft evidence standard (pre-execution)

---

## Evidence Requirements

Any artefact submitted for governance or execution-authority review must include:

1. Purpose statement (why this artefact exists).
2. Scope statement (what it covers and what it does not).
3. Authority references (source artefacts governing its claims).
4. Decision relevance (which gate/decision it supports).
5. Status marker (draft/final/superseded).

---

## Provenance Requirements

Each evidence-bearing claim must be traceable to:

- a specific artefact path,
- a specific section/table where applicable,
- a known authority document (contracts, status, addendum, closure summary, etc.).

Minimum provenance fields:
- Source artefact(s)
- Claim type
- Retrieval/record date
- Recorder/author role

Untraceable claims are non-acceptable for gate decisions.

---

## Reproducibility Requirements

For governance-stage evidence:

- Another reviewer should be able to re-check the same claim from referenced artefacts without hidden context.
- Interpretation-dependent claims must declare interpretation rule (for consistency).
- Boundary-sensitive interpretations must cite declaration source.

For any future execution-stage evidence (if authorised later):
- Inputs, outputs, and decision rules must be replayable by a human operator using documented steps.

---

## Artefact Completeness Checks

An artefact is complete for review only if all apply:

- Required sections are present and non-empty.
- Internal references resolve to existing files.
- Status is explicit.
- Non-goals/exclusions are explicit where relevant.
- Decision dependencies and blockers (if any) are explicitly stated.

---

## Acceptance Criteria

Evidence is accepted for gate decisions when:

1. It is in-scope for the current gate.
2. Provenance is complete and verifiable.
3. Reproducibility conditions are met.
4. No unresolved contradiction with governing artefacts exists.
5. Required sign-off roles confirm acceptance.

Evidence is rejected when:
- provenance is missing,
- scope is ambiguous,
- claims depend on unstated assumptions,
- or required declarations are absent.
