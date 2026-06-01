# Probe P30-02 — RNA transcript self-study

**Catalogue:** [`../workflow-probe-catalogue.md`](../workflow-probe-catalogue.md)  
**Case study:** [`../../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/context-files/rna-virus-brief-case.md`](../../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/context-files/rna-virus-brief-case.md)

---

## Brief text (canonical test)

| Field | Value |
|-------|--------|
| **Goal** | create a one hour self-study session for undergraduate students based on uploaded transcript |
| **Inputs** | Uploaded lecture transcript on RNA viruses and hepatitis C (HCV). |
| **Desired outputs** | Learner-facing page |
| **Starting artefact** | `provided_source_content` |

---

## Variant (fixture topology test)

From `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json`:

**Goal:** Create a one hour follow up session for individual to build on the knowledge they gained in the lecture. Include some short learning activities and a short formative assessment.

**Inputs:** Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).

---

## Expected resolution

| Factor | Expected |
|--------|----------|
| `input_strategy` | `provided_source_content` |
| `delivery_mode` | `async` |
| `delivery_context` | `self_directed` |
| `delivery_pattern` | `mostly_online` (not `face_to_face`) |
| `learning_environments` | not `classroom` |
| `topic` | RNA viruses / hepatitis C — **not** “the uploaded transcript” |
| `activities_required` | true |
| `assessment_required` | true (formative variant) |

---

## Topology requirement

Must include **Design Learning Activities** and **Generate Activity Materials** — not assessment-only lean path.

**Test:** `tests/workflow-ld-rna-sparse-brief-topology.test.js`

---

## Sprint 30 targets

- [ ] Orientation for **source-based** independent study (`source_handling_note` in 30-2)
- [ ] 30-1: `study_orientation` referencing transcript use
- [ ] Brief panel shows self-directed delivery (not classroom)

---

## Tests

- `tests/workflow-brief-learner-resource-defaults.test.js` (transcript row)
- `tests/workflow-ld-rna-sparse-brief-topology.test.js`

---

## Live capture

Save to: `context-files/probe-p30-02-rna-live.md`
