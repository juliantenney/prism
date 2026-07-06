# Sprint 56C — Wave 3 Validation Architecture Definition

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 3 — Validation preparation (frozen architecture)  
**Date:** 2026-07-06  
**Status:** **Frozen** — authoritative for Wave 3 implementation; implementation not authorised by this document alone

**Authority:** [Wave 3 Discovery](SPRINT-56C-WAVE-3-VALIDATION-DISCOVERY.md) · [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md) · [Wave 2 Closure](SPRINT-56C-WAVE-2-CLOSURE-SUMMARY.md) · [CP-4 Approval Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Architecture Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)

**Supersedes:** Informal OQ-24/OQ-25 notes in checklist and discovery candidate tables for architectural decisions. Does not supersede [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md).

**Out of scope:** Runtime code, prompt contracts, domain packs, validators, tests, Copilot runtime proof, Wave 4 compliance audit execution.

---

## Section 1 — Validation problem statement

### 1.1 Context

Sprint 56C Waves 1–2 **closed** the approved Design Page architecture:

| Wave | Outcome |
| ---- | ------- |
| **1** | Removed generative wrapper stack, EQF, VA authoring, synthesis mandates, brevity shaping from DP runtime path |
| **2** | Added sole Layer 3 authority (`LD-THIN-ASSEMBLY-COHERENCE-CONTRACT`); narrowed R-83 to Layer 2 structural delimiter |

Design Page prompts execute in **Copilot**. Prism assembles prompts, hosts frozen contracts, exposes structural validators, and may repair or audit **captured** page JSON — but Prism does **not** observe live model generation.

### 1.2 Problem

Before Wave 4 architecture compliance sign-off, the programme needs a **frozen validation model** that answers:

1. What evidence proves the **implemented architecture** still matches CP-4?  
2. What evidence is **forbidden** to avoid false confidence?  
3. Who owns validation at each boundary (Prism vs Copilot vs human review)?

Without this model, teams conflate prompt-path gate tests with Copilot behavioural proof, or assume nothing can be validated because generation is external.

### 1.3 Objective of Wave 3 (this definition)

Translate discovery into an **implementable, decision-complete** validation architecture. A future implementer must be able to build the Wave 3 framework (fixture registry, dual-path policy, regression inventory, meta-tests, checklist) **without new architecture decisions**.

### 1.4 Non-goals

- Prove Copilot produces correct learner-facing pages  
- Validate educational quality of generated prose  
- Reopen ownership, thin bridge, Wave 1 removals, or Wave 2 implementation  
- Implement validators, tests, or prompt changes (Wave 3 implementation phase)

---

## Section 2 — OQ-24 definition

### 2.1 Identifier

**OQ-24** — *Dual-path structural review framework for Design Page page artefacts*

### 2.2 Precise definition

> **OQ-24** is the documented policy that defines **architecture compliance criteria** for two distinct artefact-provenance paths — **Copilot-primary** and **PRISM-repair** — when evaluating Design Page `artifact_type: page` JSON against Layer 1–2 invariants, **without** claiming runtime generation correctness or pedagogical quality.

OQ-24 answers: *“Given a page JSON from path A or path B, what structural checks apply, what traceability is required, and what may Prism claim about compliance?”*

OQ-24 does **not** answer: *“Did the model behave correctly during generation?”*

### 2.3 Paths (frozen)

| Path | ID | Definition | Primary role |
| ---- | -- | ---------- | ------------ |
| **Copilot-primary** | `PATH-A` | Page JSON produced by Copilot workflow execution and captured into Prism (or held for external review) | Authoritative learner-page source in live workflows |
| **PRISM-repair** | `PATH-B` | Page JSON produced or amended by Prism `repairLearnerPageCompositionFromUpstream` (or equivalent) from known upstream artefacts | Structural backstop when capture is incomplete or upstream is authoritative |

### 2.4 Frozen policy rules

| Rule | Statement |
| ---- | --------- |
| **P-A1 Pre-flight** | PATH-A review **requires** Layer 1 prompt-path compliance (Class A) before any artefact audit is meaningful |
| **P-A2 Post-capture audit** | PATH-A artefact audit is **optional** but, when performed, uses Class B validators only; findings are **artefact audit findings**, not generation proof |
| **P-B1 Upstream required** | PATH-B repair must not run without bound upstream artefacts for the fields being restored |
| **P-B2 Non-masking** | PATH-B repair must not clear material-closure or preservation failures without trace in `generation_notes` (or equivalent audit log) |
| **P-EQ1 Layer 1 equivalence** | For OQ-25 canonical fixtures, PATH-A and PATH-B outcomes must be **comparable** on Layer 1 structural dimensions (membership, materials keys, embed presence vs upstream) |
| **P-EQ2 Prose non-equivalence** | Wrapper-slot prose (`overview`, `learning_purpose`) may differ across paths without failing OQ-24 structural review |
| **P-NG1 Non-goal** | OQ-24 does **not** require identical pedagogy, prose, or learner experience across paths |

### 2.5 OQ-24 deliverable (implementation artefact)

`SPRINT-56C-WAVE-3-DUAL-PATH-REVIEW-FRAMEWORK.md` — expands paths, checklists, finding templates, and non-masking rules. This definition is the **normative source**; the deliverable is **descriptive expansion only**.

### 2.6 Resolution status

| Field | Value |
| ----- | ----- |
| **Decision** | **Frozen** — dual-path structural review; no third path without architecture review |
| **Blocks** | Wave 4 sign-off until OQ-24 deliverable exists and checklist §E references it |
| **Does not block** | Wave 3 implementation start |

---

## Section 3 — OQ-25 definition

### 3.1 Identifier

**OQ-25** — *Canonical fixture registry for Design Page structural acceptance preparation*

### 3.2 Precise definition

> **OQ-25** is the authoritative **registry of canonical workflow/page fixture definitions** used to exercise Class B artefact validation, map 56A operational failure modes to structural review criteria, and anchor OQ-24 path equivalence checks — **without** requiring live Copilot re-runs for Wave 3 closure.

Each registry entry specifies: fixture ID, artefact paths, upstream bindings, applicable `page_profile`, structural checklist, mapped failure modes, and PATH-A / PATH-B slot status.

OQ-25 answers: *“Which fixed inputs are the programme’s structural acceptance baseline?”*

OQ-25 does **not** answer: *“Which Copilot runs must pass on a schedule?”*

### 3.3 Minimum fixture classes (frozen — from CP-5 §7)

| Class ID | Purpose | PATH-A slot | PATH-B slot |
| -------- | ------- | ----------- | ----------- |
| `FX-MULTI` | Multi-activity learner page; membership; ordering; multi-material | Required | Required |
| `FX-INFLATION` | Historical summarisation / reference-without-embed regression | Required | Required |
| `FX-KNOWLEDGE` | Knowledge-bound workflow; OQ-17 transport-or-omit structural review | Optional capture | Synthetic/upstream-only |
| `FX-ASSESS` | Assessment-profile; structured item transport | Required | Optional |
| `FX-FACILITATOR` | Facilitator profile policy surface | Deferred until SQ-F1/F2 | Deferred |
| `FX-RICH-DLA-GAM` | Rich DLA+GAM preservation end-to-end | Required | Required |

Exact file paths and workflow IDs are recorded in the registry deliverable — not in this definition.

### 3.4 Per-fixture mandatory fields (frozen)

| Field | Required |
| ----- | -------- |
| `fixture_id` | Yes |
| `class_id` | Yes |
| `description` | Yes |
| `page_json_path` | Yes (or `TBD-CAPTURE` for PATH-A-only slots) |
| `upstream_bindings` | Yes — list of artefact types/paths |
| `page_profile` | Yes |
| `structural_checklist_id` | Yes — references W3 failure-mode / 56A crosswalk |
| `validation_class` | Yes — primary Class B |
| `path_a_status` | `bound` \| `TBD-CAPTURE` \| `N/A` |
| `path_b_status` | `bound` \| `synthetic` \| `N/A` |
| `56a_failure_mode_refs` | Yes — operational modes from 56A catalogue |

### 3.5 OQ-25 deliverable (implementation artefact)

`SPRINT-56C-WAVE-3-FIXTURE-REGISTRY.md`

### 3.6 Resolution status

| Field | Value |
| ----- | ----- |
| **Decision** | **Frozen** — minimum classes and per-fixture schema above |
| **Blocks** | Wave 4 acceptance-invariant structural review |
| **Does not require** | New Copilot captures for Wave 3 closure (TBD-CAPTURE slots documented, not filled) |

---

## Section 4 — Validation classes (A / B / C)

### 4.1 Class A — Architecture-verifiable

| Dimension | Definition |
| --------- | ---------- |
| **Scope** | Governance text, prompt emit path, contract modules, domain factory surfaces, wiring, static exclusion patterns |
| **Evidence source** | Source files, governance docs, VM-sandbox prompt augmentation, lib unit tests, gate tests |
| **Validation owner** | **Prism** (automated tests + doc review) |
| **Determinism** | Fully deterministic — same inputs → same pass/fail |

**Permitted claims**

- “Design Page runtime prompt includes/excludes marker X”  
- “Contract order: compose before thin bridge”  
- “Domain §13 contains R-83 delimiter wording”  
- “Augment chain matches frozen Wave 2 architecture”  
- “Deprecation register records retired authority Y”

**Prohibited claims**

- “Learner will receive full material bodies” (artefact/runtime)  
- “Generated page is acceptable”  
- “Model complied with transport-first”

**Examples (frozen in Class A)**

| Example | Detection |
| ------- | --------- |
| Prompt composition | `applyWorkflowStepRuntimePromptAugmentations` output |
| Contract presence | Marker regex in augmented prompt / lib block |
| Contract order | String index ordering in augmented prompt |
| Ownership boundaries | MODULE_ID lines; DP-only bridge gating |
| Exclusions | Absence of removed module markers on DP |
| Schema requirements | `defaultOutputStructure.keys` in domain §13 |
| Bridge placement | Compose index < bridge index; bridge absent on DLA/GAM |

---

### 4.2 Class B — Artefact-verifiable

| Dimension | Definition |
| --------- | ---------- |
| **Scope** | Page JSON structure and embed invariants evaluated against **known** upstream snapshots or OQ-25 fixtures |
| **Evidence source** | Fixture files, captured run outputs, Prism validators (`validatePage*Closure`, materials fidelity, repair functions) |
| **Validation owner** | **Prism** (validators + fixture tests); **human** for adjudication of ambiguous structural warnings |
| **Determinism** | Deterministic given fixture + upstream; **not** deterministic for arbitrary Copilot captures without upstream binding |

**Permitted claims**

- “Fixture FX-MULTI passes materials closure vs bound upstream GAM”  
- “Captured page JSON fails enumeration invariant (Class B finding FM-E)”  
- “PATH-B repair restored membership per OQ-24 P-B2 trace”  
- “Structural acceptance checklist item N satisfied for registry fixture”

**Prohibited claims**

- “Copilot generation session was successful”  
- “Summary text is pedagogically adequate”  
- “Navigation prose meets quality bar”  
- “Learner achieved outcomes”

**Examples (frozen in Class B)**

| Example | Detection |
| ------- | --------- |
| Captured JSON | `applyPageCompositionValidationForCapturedPage` |
| Fixture validation | Closure tests with `tests/fixtures/page-render/*` |
| Membership closure | `validatePageActivityClosure` |
| Materials preservation | `validatePageMaterialsClosure` + fidelity lib |
| Transport-first (structural) | No synthesis fields without upstream body; slot omission rules |
| Anti-condense (structural) | Length/pattern vs upstream Content; placeholder detectors |

**Prerequisite:** Class A must pass for the same architecture revision before Class B findings are attributed to artefact drift rather than wrong prompt path.

---

### 4.3 Class C — Runtime-generation-only

| Dimension | Definition |
| --------- | ---------- |
| **Scope** | Model behaviour, prose quality, pedagogical adequacy, learner experience during/after live Copilot execution |
| **Evidence source** | Copilot conversation, human review, learner testing — **outside Prism observability** |
| **Validation owner** | **Copilot environment** + **human/product review** — not Prism |
| **Determinism** | Non-deterministic; not automatable in Prism CI |

**Permitted claims** (outside Prism compliance reports)

- “Copilot review found acceptable navigation” (Copilot runbook)  
- “Pilot learner completed activities” (user research)

**Prohibited claims** (in Prism/Wave 3/4 compliance artefacts)

- “Prism validated generation quality”  
- “Architecture compliance implies learner-effective output”  
- “Gate tests prove Copilot obeys thin bridge caps at runtime”  
- “Validated summaries/transitions/navigation”

**Examples (frozen in Class C)**

| Example | Owner |
| ------- | ----- |
| Prose quality | Copilot / human |
| Transition quality | Copilot / human |
| Summary quality | Copilot / human |
| Navigation quality | Copilot / human |
| Learner effectiveness | Product / user research |
| Educational outcomes | Out of programme automation scope |

---

### 4.4 Class summary matrix

| Class | Question answered | Prism role |
| ----- | ----------------- | ---------- |
| **A** | Is the **architecture as built** correct? | Full owner |
| **B** | Does this **artefact instance** meet structural invariants? | Owner when fixture/upstream bound |
| **C** | Did **generation** produce good education? | None |

---

## Section 5 — Validation layers (0–3)

Layers are **orthogonal** to classes: Layer 1 is mostly Class A; Layer 2 is Class B; Layer 3 is Class C. Layer 0 governs all.

### Layer 0 — Governance

| Field | Definition |
| ----- | ---------- |
| **Scope** | CP-4 D1–D7, architecture guardrails §A–D, Assembly-Time Ownership Test policy, wave closure summaries, deprecation register, generation visibility constraint |
| **Owner** | Architecture / programme governance |
| **Evidence** | Signed closure docs, checklist, approval brief, frozen bridge definition |
| **Validation class** | A (documentary) |
| **Limitations** | Governance drift detected only on review cadence or gate failure — not continuous |

**Compliance question:** *Do frozen decisions still describe the intended system?*

---

### Layer 1 — Prompt / contract path

| Field | Definition |
| ----- | ---------- |
| **Scope** | `app.js` augment chain, contract libs, domain §13 Prompt Factory, `index.html` / VM bootstrap wiring, `__PRISM_TEST_API` exports |
| **Owner** | Prism engineering — automated gate tests |
| **Evidence** | `sprint-56c-wave{1,2}-*.test.js`, lib unit tests, regression inventory |
| **Validation class** | **A** |
| **Limitations** | Proves instructions sent to Copilot path in Prism test harness; does not prove Copilot received or obeyed them |

**Compliance question:** *Does Prism still emit the frozen prompt architecture for Design Page?*

**Frozen DP path (reference — not re-decided here)**

```
guided scaffold (compose-only) → cognition (not DP)
→ design page compose (+ L4 embed + R-83 delimiter)
→ thin assembly-coherence bridge (DP only)
→ math render → strict JSON
```

---

### Layer 2 — Artefact structure

| Field | Definition |
| ----- | ---------- |
| **Scope** | Page JSON shape, activity membership, materials embed, field preservation, episode_plans portable schema, PATH-A/PATH-B audits per OQ-24 |
| **Owner** | Prism validators + fixture tests; optional human adjudication |
| **Evidence** | OQ-25 fixtures, closure validators, capture pipeline, repair trace logs |
| **Validation class** | **B** |
| **Limitations** | Requires bound upstream; cannot certify all live Copilot outputs; structural pass ≠ pedagogical pass |

**Compliance question:** *Does this page JSON instance satisfy Layer 1 preservation and organisation invariants?*

---

### Layer 3 — Runtime behaviour

| Field | Definition |
| ----- | ---------- |
| **Scope** | Live Copilot generation, model adherence, prose quality, learner experience |
| **Owner** | Copilot operators, instructional designers, product — **explicitly not Prism** |
| **Evidence** | Copilot captures (optional inputs to Layer 2), manual review notes, pilot feedback |
| **Validation class** | **C** |
| **Limitations** | Out of Prism CI; must not appear in Prism compliance sign-off language |

**Compliance question:** *Did the generation event produce acceptable education?* — **Delegated outside Wave 3 Prism framework.**

---

### Layer dependency rule (frozen)

```
Layer 0 ──► Layer 1 ──► Layer 2 ──► (Layer 3 delegated)
```

- Layer 2 findings on captures are **invalid** for architecture attribution if Layer 1 fails on the same revision.  
- Layer 3 may not override Layer 0–2 frozen architecture.

---

## Section 6 — Failure-mode taxonomy

Formal taxonomy for **Wave 3 validation findings**. Distinct from [56A operational failure modes](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-FAILURE-MODES.md) (summarisation, metadata substitution, etc.) — crosswalk in implementation artefact `SPRINT-56C-WAVE-3-FAILURE-MODE-STRUCTURAL-REVIEW.md`.

### FM-A — Governance drift

| Field | Definition |
| ----- | ---------- |
| **Definition** | Frozen CP-4, guardrails, wave closure, or deprecation register no longer describes as-built intent |
| **Detection method** | Governance doc audit; checklist §F; inventory reconciliation |
| **Evidence source** | Closure summaries, DEPRECATION-REGISTER, checklist, approval tracker |
| **Validation class** | A |
| **Example** | Wave 2 marked closed but checklist §D shows thin bridge unchecked |

---

### FM-B — Prompt-path drift

| Field | Definition |
| ----- | ---------- |
| **Definition** | Design Page augment chain, contract inject order, or marker presence deviates from frozen Layer 1 architecture |
| **Detection method** | Gate test failure; regression inventory gap; prompt diff review |
| **Evidence source** | `sprint-56c-wave*.test.js`, augmented prompt capture from `__PRISM_TEST_API` |
| **Validation class** | A |
| **Example** | Rhetoric marker reappears on DP path; bridge precedes compose |

---

### FM-C — Ownership drift

| Field | Definition |
| ----- | ---------- |
| **Definition** | Generative responsibility appears on DP path outside thin bridge, or removed modules reassert authority in contracts/domain |
| **Detection method** | Ownership residue patterns; deprecation register violation; Assembly-Time Ownership Test audit |
| **Evidence source** | Domain factory parse, compose/domain tests, authorial/journey/EQF/VA marker scans |
| **Validation class** | A (prompt); B if manifested in generated wrapper synthesis on capture |
| **Example** | `LD-AUTHORIAL-EXPOSITION` marker on DP runtime prompt |

---

### FM-D — Schema drift

| Field | Definition |
| ----- | ---------- |
| **Definition** | Page artefact root keys, `artifact_type`, section model, or domain `defaultOutputStructure` diverge from frozen schema contract |
| **Detection method** | Domain pack parse; page parse validators; fixture schema tests |
| **Evidence source** | Domain §13, `tryParseWorkflowArtefactJson`, closure validators |
| **Validation class** | A (schema spec); B (instance) |
| **Example** | Missing `episode_plans` key when domain requires it for portable schema |

---

### FM-E — Preservation failure

| Field | Definition |
| ----- | ---------- |
| **Definition** | Layer 1 embed invariants violated — materials bodies, DLA scaffold fields, enumeration, anti-condense (56A modes A–E, G operational) |
| **Detection method** | Materials/field/beat closure validators; fidelity lib; placeholder detectors |
| **Evidence source** | OQ-25 fixtures with upstream GAM/DLA; captured page JSON |
| **Validation class** | B |
| **Example** | `materials.text` is synopsis not Content body; multi-material enumeration failure |

---

### FM-F — Transport violation

| Field | Definition |
| ----- | ---------- |
| **Definition** | Transport-first or transport-or-omit policy violated in artefact — synthesis where upstream absent, archival fields paraphrased, study_tips/knowledge_summary authored |
| **Detection method** | Structural slot audit vs upstream LC/KM/GAM; compose obligation cross-check |
| **Evidence source** | Captured sections[] vs upstream bindings; OQ-17 checklist on fixture |
| **Validation class** | B (artefact); A for reintroduced synthesis **mandates** in prompts |
| **Example** | `knowledge_summary` section populated with model-authored synthesis when LC unbound |

---

### FM-G — Generation-visibility violation

| Field | Definition |
| ----- | ---------- |
| **Definition** | Compliance report, test name, or checklist claims Class C outcome as Prism-validated, or conflates Layer 1 pass with Copilot generation proof |
| **Detection method** | Documentation audit; prohibited-phrase scan in reports; meta-test policy hooks |
| **Evidence source** | Wave 3/4 reports, CI output descriptions, checklist language |
| **Validation class** | Meta — applies to **evidence claims**, not page JSON |
| **Example** | “Wave 2 gates prove Copilot produces compliant pages” |

---

### Taxonomy quick reference

| ID | Name | Class | Primary layer |
| -- | ---- | ----- | ------------- |
| FM-A | Governance drift | A | 0 |
| FM-B | Prompt-path drift | A | 1 |
| FM-C | Ownership drift | A / B | 1 / 2 |
| FM-D | Schema drift | A / B | 0–2 |
| FM-E | Preservation failure | B | 2 |
| FM-F | Transport violation | A / B | 1 / 2 |
| FM-G | Generation-visibility violation | Meta | All |

---

## Section 7 — Evidence model

### 7.1 Primary questions (frozen answers)

| # | Question | Answer |
| - | -------- | ------ |
| 1 | What is OQ-24? | Dual-path **structural** review framework (PATH-A Copilot-primary, PATH-B PRISM-repair) — Section 2 |
| 2 | What is OQ-25? | Canonical **fixture registry** for Class B acceptance preparation — Section 3 |
| 3 | What belongs to Prism? | Layers 0–2; Classes A and B; FM-A–FM-F detection in Prism scope — Sections 4–5 |
| 4 | What belongs outside Prism? | Layer 3; Class C; live Copilot generation proof — Section 4.3 |
| 5 | Required evidence for architecture compliance? | See §7.2 |
| 6 | Prohibited evidence? | See §7.3 |
| 7 | How classify findings? | FM-A–FM-G + Class A/B/C — Section 6 |

---

### 7.2 Required evidence to claim architecture compliance

Claims **“Design Page architecture is compliant”** (Wave 4 or interim) **require all**:

| # | Evidence type | Layer | Class |
| - | ------------- | ----- | ----- |
| E1 | Wave 1–2 closure summaries current | 0 | A |
| E2 | Checklist §B–D retained items satisfied | 0 | A |
| E3 | Layer 1 gate bundle pass (named regression inventory) | 1 | A |
| E4 | OQ-24 dual-path framework document published | 0–2 | A/B policy |
| E5 | OQ-25 fixture registry published with minimum classes | 2 | B prep |
| E6 | Per canonical fixture: Class B checklist executed OR `TBD-CAPTURE` explicitly recorded | 2 | B |
| E7 | No FM-G violations in compliance artefacts | Meta | — |
| E8 | Deprecation register reflects Wave 1–2 retired authorities | 0 | A |

**Wording template (required):**

> “Design Page **architecture** is compliant with CP-4 through Layer 0–2 evidence. **Runtime generation quality is not validated by Prism.**”

---

### 7.3 Prohibited evidence (must not support compliance claims)

| Prohibited evidence | Why | FM |
| ------------------- | --- | -- |
| Single gate test pass cited as Copilot proof | Conflates Layer 1 with Layer 3 | FM-G |
| “Validated learner experience” without external study | Class C in Prism report | FM-G |
| PATH-B repair pass without upstream binding cited as PATH-A equivalent | OQ-24 violation | FM-E / policy |
| Missing `generation_notes` on repair masking closure failure | OQ-24 P-B2 | FM-E |
| Ad-hoc page JSON without registry ID cited as canonical | OQ-25 violation | FM-D |
| Subjective prose review labeled “Prism validation” | Class C mislabeled | FM-G |
| Copilot session logs not captured in artefact form cited as structural pass | No Class B evidence | FM-G |

---

### 7.4 Finding record schema (frozen — for implementation)

Each validation finding **must** include:

| Field | Required |
| ----- | -------- |
| `finding_id` | Yes |
| `failure_mode` | FM-A … FM-G |
| `validation_class` | A \| B \| C |
| `layer` | 0–3 |
| `evidence_ref` | File path, test name, or fixture ID |
| `path` | PATH-A \| PATH-B \| N/A |
| `claim_permitted` | Exact compliant sentence |
| `remediation_owner` | Prism \| Copilot ops \| Architecture |

---

## Section 8 — Readiness criteria

### 8.1 Wave 3 definition complete (this document)

| Criterion | Status |
| --------- | ------ |
| OQ-24 frozen definition | **Complete** — Section 2 |
| OQ-25 frozen definition | **Complete** — Section 3 |
| Classes A/B/C formalised | **Complete** — Section 4 |
| Layers 0–3 specified | **Complete** — Section 5 |
| Failure taxonomy FM-A–FM-G | **Complete** — Section 6 |
| Evidence model | **Complete** — Section 7 |

**Wave 3 architecture definition is frozen.** Implementation may proceed.

---

### 8.2 Wave 3 implementation complete (future — not this task)

Wave 3 **closes** when **all** deliverables exist:

| ID | Deliverable | Closes |
| -- | ----------- | ------ |
| W3.1 | `SPRINT-56C-WAVE-3-FIXTURE-REGISTRY.md` (OQ-25) | OQ-25 |
| W3.2 | `SPRINT-56C-WAVE-3-DUAL-PATH-REVIEW-FRAMEWORK.md` (OQ-24) | OQ-24 |
| W3.3 | `SPRINT-56C-WAVE-3-FAILURE-MODE-STRUCTURAL-REVIEW.md` (56A ↔ FM crosswalk) | FM taxonomy operational |
| W3.4 | `SPRINT-56C-WAVE-3-REGRESSION-INVENTORY.md` | Layer 1 traceability |
| W3.5 | `tests/sprint-56c-wave3-validation-readiness.test.js` | Meta-bundle |
| W3.6 | `SPRINT-56C-EXECUTION-CHECKLIST.md` §E all items ☑ | Governance |
| W3.7 | Optional: Copilot capture playbook (external) | PATH-A capture procedure |

**Checklist §E mapping (frozen)**

| §E item | Satisfied by |
| ------- | ------------ |
| OQ-24 dual-path review framework documented | W3.2 |
| OQ-25 canonical fixtures identified | W3.1 |
| Fixture coverage (multi-activity, knowledge, assessment, paths) | W3.1 minimum classes |
| Acceptance invariant structural checklist | W3.3 + per-fixture checklists in W3.1 |
| Failure modes mapped | W3.3 |
| Compliance evidence Wave 3 recorded | W3.6 + governance closure report |
| Runtime acceptance delegated to Copilot | W3.2 + Generation Visibility Constraint citation |

---

### 8.3 Wave 4 prerequisite (frozen)

Wave 4 may begin when Wave 3 implementation complete (§8.2). Wave 4 adds full guardrails audit and stakeholder sign-off — out of scope for this definition.

---

## Section 9 — Recommended implementation scope

Implementation **must** follow this scope — no additional architecture decisions.

| Work package | Input (frozen) | Output | Class |
| ------------ | -------------- | ------ | ----- |
| **W3.1 Registry** | §3 minimum classes, §3.4 fields | OQ-25 deliverable | B |
| **W3.2 Dual-path** | §2 paths and policy rules | OQ-24 deliverable | Policy |
| **W3.3 Failure crosswalk** | §6 FM-A–G + 56A catalogue | Structural review doc | B |
| **W3.4 Inventory** | §5 Layer 1 + existing `sprint-56c-*` tests | Regression matrix | A |
| **W3.5 Meta-test** | §8.2 deliverable list | Readiness test file | A |
| **W3.6 Checklist** | §8.2 §E mapping | Checklist update | Governance |
| **W3.7 Capture playbook** | §2 PATH-A, optional | External runbook | C delegation |

### Implementation constraints (frozen)

1. **No** `app.js`, contract lib, domain, or validator changes unless a **separate** sprint authorises defect fix — not Wave 3 validation prep.  
2. **No** new prompt contracts or augment-chain edits.  
3. **No** Class C claims in automated test descriptions.  
4. Meta-test (W3.5) verifies **artefact existence and schema**, not Copilot behaviour.  
5. Regression inventory cites **existing** tests first; new tests only for gaps explicitly listed in inventory.  
6. `TBD-CAPTURE` PATH-A slots are **valid** for Wave 3 closure.  
7. SQ-1/SQ-2 remain **out of scope** — note in registry as known limitation.

### Named validation bundle (frozen label)

```
56C-VALIDATION-READINESS-BUNDLE
```

Contents: Layer 1 gate tests (wave 1–2) + W3.5 meta-test + registry path existence checks. Not the full `tests/*.test.js` corpus.

### Success criterion (from programme)

> A future implementer can build the entire Wave 3 validation framework from this definition + discovery + frozen Waves 1–2 architecture **without making any new architecture decisions.**

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md` |
| Type | **Frozen architecture definition** |
| Precedes | Wave 3 implementation authorisation |
| Runtime changes | **None** |
| Related | [Discovery](SPRINT-56C-WAVE-3-VALIDATION-DISCOVERY.md) (exploratory; this doc normative) |

---

## Appendix — Responsibility split (single table)

| Responsibility | Prism | Outside Prism |
| -------------- | ----- | ------------- |
| Governance frozen state | Audit (L0) | Architecture approval |
| Prompt/contract path | Gate tests (L1, A) | — |
| Fixture structural review | Validators (L2, B) | — |
| OQ-24 policy documentation | Author | — |
| OQ-25 registry maintenance | Author | — |
| Copilot live generation | — | Copilot |
| Prose/transition/navigation quality | — | Copilot + human |
| Learner effectiveness | — | Product / research |
| PATH-A capture procedure | — | Copilot ops (W3.7) |
| FM-G compliance language | Enforce in reports | — |
