# S77-T-019 — GAM E learner-facing corruption diagnostic

**Status:** **DIAGNOSTIC RECORDED** — E1/E2 classified; this-run findings operator-authoritative; **no implementation**  
**Mode:** DIAGNOSTIC ONLY  
**Authorised by:** [T-018](S77-T-018-dla-architecture-pilot-gated-and-gam-e-handover.md)  
**Production files changed:** **NO**  
**Tests changed:** **NO**  
**Schema / validator changes:** **NO**

Do not reopen DLA architecture, T-031 **design**, T-033, P01-R1, or P02. Do not add “must be solvable” to DLA. Fresh DLA is the authoritative upstream commission and captured successfully.

---

## Established chain (this update)

Confirmed by the operator:

1. Fresh Lagrangian **EP** supplied.
2. Fresh **DLA** captured successfully after T-016.
3. Final GAM prompt captured from `window.__PRISM_FINAL_GAM_PROMPT.prompt` for this same chain.

E1 is **proven at the final model-visible prompt boundary**, not merely inferred from repository topology.

---

## Fresh DLA — authoritative commission (absent from the final GAM prompt)

These `required_materials` rows (including each row’s **purpose**, **specification**, and **evidence_requirement** where applicable) are the commission GAM is required to fulfil. They are **not** present as authoritative bodies in the captured final GAM prompt.

| Activity | Material | `material_type` |
| -------- | -------- | --------------- |
| A1 | A1-M1 | `scenario_set` |
| A1 | A1-M2 | `explanatory_notes` |
| A2 | A2-M1 | `problem_set` |
| A2 | A2-M2 | `worked_example` |
| A3 | A3-M1 | `lagrangian_exercises` |
| A3 | A3-M2 | `process_guide` |
| A4 | A4-M1 | `equation_set` |
| A4 | A4-M2 | `checklist` |
| A5 | A5-M1 | `interpretation_cases` |
| A5 | A5-M2 | `concept_explanation` |

This table **supersedes** earlier T-019 exhibit commissions (Gate D / first paste) for the live chain. Those earlier rows were a different DLA snapshot and must not be treated as this prompt’s commission.

---

## Model-visible GAM statements (quoted from the captured final prompt)

The captured prompt contains:

> PRISM does not embed stored prior step outputs in this mode. Use Copilot conversation context for upstream instructional continuity.

> Upstream binding bodies are intentionally omitted for this step in partial page output mode.

> Use Copilot conversation context for upstream instructional content; PRISM does not embed stored prior step outputs in this mode.

The same final prompt also requires:

> Honour required_materials[].purpose and treat specification as binding content bounds.

**Live contradiction:** the contract requires GAM to obey authoritative DLA commissioning fields (`purpose`, `specification`, and related `required_materials` bounds) which **PRISM deliberately does not embed**. Conversation context is the implicit transport for a **binding production contract**.

---

## Partial / non-authoritative DLA that *does* reach the prompt

The captured prompt **does** contain derived DLA information via `LD-INSTRUCTIONAL-ARCHETYPE-ROUTING`:

| Material | Routing in final prompt |
| -------- | ----------------------- |
| A1-M2 | `mental_model_building` |
| A2-M2 | `process_walkthrough` |
| A3-M2 | `process_walkthrough` |
| A5-M2 | `mechanism_explanation` |

This is **not** “GAM receives no DLA information.”

It is a **partial / non-authoritative binding** problem:

- selected **derived** routing (archetype + plan crumbs) is Prism-bound and survives into the final prompt;
- the **canonical** `required_materials` commission that GAM is explicitly required to fulfil (types, count, purpose, specification, evidence_requirement) **does not**.

---

## Classification (keep three issues distinct)

### E1 — authoritative DLA commission is not Prism-bound into the GAM final prompt

| | |
| - | - |
| **Class** | **CONFIRMED** architectural binding defect **+ OBSERVED BEHAVIOURAL COMMISSION DRIFT** (T-021 Gate C) |
| **Earlier instrumented run (T-019)** | Drift **NO** (10/10 types via conversation) |
| **T-021 Gate C run** | Drift **YES** — GAM did not fulfil the supplied DLA (types `text` vs commissioned; extra checklists; A5 emitted though DLA had A1–A4 only) |

Do **not** claim the exact stale conversation source unless proven. GAM appears to follow conversation/stale context rather than the authoritative supplied DLA.

**Do not close E1** from T-019 evidence alone. **Later closure:** [T-023](S77-T-023-gam-e1-authoritative-dla-commission-binding-implementation.md) implemented; [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md) Gate C **PASS — E1 CLOSED**.

### E2 — learner-facing character / JSON corruption

| | |
| - | - |
| **Class** | **INTERMITTENT / NOT REPRODUCED** in the fresh instrumented run |
| **Historical exhibit** | **VALID** (earlier visible malformed response: `Pur[`, raw newline in a JSON string, `\rtial`) |
| **Cause** | **UNRESOLVED** — do not invent a deterministic cause |

Do not close E2 solely because it did not reproduce.

### NEW — GAM operational-suitability exhibit (separate)

A4-M1 System 3 is **underdetermined**. Fresh **T-031 GAM Case 1 / inherent executability** behavioural breach. **Not** E1. **Not** E2. Do not merge unless later evidence connects them. T-031 **design stays closed**.

---

## Prior pass (superseded for E1 identity)

Repository inspection had already shown partial-mode Copy omits stored DLA JSON (`buildUpstreamDlaPageEmbedSectionForGamCopy` returns `""`). That topology is now **confirmed by the captured `__PRISM_FINAL_GAM_PROMPT.prompt`**. The earlier “STOP — unknown conversation commission” gap is **closed for E1 binding**. E1 *consequence* and E2 for **this** prompt/session are recorded in the next section.

---

## Fresh GAM response — E1 consequence and E2 inspection

Operator supplied the GAM partial page artefact from this prompt/session (valid JSON object: `artifact_type` page, `schema_version` 2.0.0, `assembly_state.current_stage` gam, five `activities`).

### One-for-one vs fresh DLA commission (IDs / types / count)

| DLA commission | GAM `materials[]` | Match |
| -------------- | ----------------- | ----- |
| A1-M1 `scenario_set` | A1-M1 `scenario_set` | YES |
| A1-M2 `explanatory_notes` | A1-M2 `explanatory_notes` | YES |
| A2-M1 `problem_set` | A2-M1 `problem_set` | YES |
| A2-M2 `worked_example` | A2-M2 `worked_example` | YES |
| A3-M1 `lagrangian_exercises` | A3-M1 `lagrangian_exercises` | YES |
| A3-M2 `process_guide` | A3-M2 `process_guide` | YES |
| A4-M1 `equation_set` | A4-M1 `equation_set` | YES |
| A4-M2 `checklist` | A4-M2 `checklist` (`body_format` json, `guided_criteria`) | YES |
| A5-M1 `interpretation_cases` | A5-M1 `interpretation_cases` | YES |
| A5-M2 `concept_explanation` | A5-M2 `concept_explanation` | YES |

Count: **10/10** required rows; **no orphans**; order preserved per activity; two materials each on A1–A5.

**E1 architectural defect = CONFIRMED.**  
**E1 commission drift in this run = NO.**

The model preserved the fresh DLA commission through **Copilot conversation context**. That is transport success, not Prism binding.

This is **not** GAM D. Purpose/specification/evidence_requirement wording is not re-judged here.

### E2 / JSON (this run)

| Check | Result |
| ----- | ------ |
| Parses as a single JSON object | YES (as pasted) |
| Unescaped newline inside a quoted string (`Pur[` split) | **ABSENT** |
| `Pur[` | **ABSENT** |
| `\rtial` | **ABSENT** |
| `\partial` in A3-M2 | Present as JSON-escaped `\\partial` in `\\frac{\\partial L}{\\partial x}` (and y, λ) |
| Capture-layer invention | Not indicated; artefact is well-formed as pasted |

**E2 this run:** not reproduced. Valid-looking JSON; inspected TeX/prose intact.

---

## NEW — A4-M1 System 3 operational-suitability (GAM Case 1)

Operator finding (authoritative):

A4-M1 System 3:

```text
20 − 2λ = 0
30 − 3λ = 0
60 − 2x − 3y = 0
```

The first two equations are redundant in the unknowns \(x\) and \(y\): both imply \(\lambda = 10\). The remaining constraint is one relation between \(x\) and \(y\). The system **does not uniquely determine** \(x\), \(y\), and \(\lambda\).

Fresh DLA A4 learner task requires learners to:

- solve supplied systems of first-order conditions;
- identify the solution;
- verify it against the original constraint.

DLA commissioned A4-M1 `equation_set`: “Three introductory systems of equations derived from constrained optimisation problems. Include the original constraint for verification.”

**Ownership (T-031, already established — do not reopen design):**

- DLA commissioned the **correct learner operation**;
- GAM supplied a realised operand that **cannot support** that operation;
- this is **GAM Case 1 / inherent executability**, not a missing DLA pedagogical bound.

Do **not** add “must be solvable” to DLA. Do **not** change validators. Do **not** implement a fix in T-019.

Record as **fresh evidence for outstanding GAM work**, separate from E1 and E2.

---

## Record

| # | Finding |
| - | ------- |
| 1 | Fresh EP → captured DLA (post T-016) → `__PRISM_FINAL_GAM_PROMPT.prompt` confirmed. |
| 2 | E1 proven at the **final model-visible prompt**, not topology-only. |
| 3 | Quoted omission / conversation-transport statements recorded above. |
| 4 | Prompt still requires honouring `required_materials[].purpose` and `specification` as binding bounds. |
| 5 | Authoritative commission = fresh DLA table (A1–A5 types above); those bodies are absent from the prompt. |
| 6 | Archetype routing **is** present (A1-M2, A2-M2, A3-M2, A5-M2) — partial, non-authoritative binding. |
| 7 | E1 = confirmed architectural binding defect; earliest break = final GAM prompt construction. |
| 8 | Risks: commission drift; inconsistent authority (routing vs parent commission). |
| 9 | E2 **INTERMITTENT / NOT REPRODUCED** this run; historical exhibit remains valid; cause unresolved. |
| 10 | T-031 **design not reopened**. A4 System 3 is a **fresh GAM Case-1 exhibit** only. |
| 11 | E1 **CONFIRMED**; T-019 instrumented run drift **NO**. **T-021 Gate C: drift YES** — see T-021 §15. |
| 12 | Production / tests / schema / validators: **NO** changes. |

---

## Next-step recommendation (no implementation from T-019)

Do **not** collapse E1, E2, operational-suitability, and GAM D into one generic “GAM quality” fix.

The next **solution-design / diagnostic decision** must consider four distinct tracks:

| Track | State | Nature of next work |
| ----- | ----- | ------------------- |
| **E1** binding repair | Confirmed architecture defect; no drift this run | Prompt/handoff: bind captured `required_materials` (or equivalent) into model-visible GAM |
| **E2** intermittent corruption | Historical exhibit; not reproduced; cause unknown | Evidence strategy (how to capture raw response next time it appears) — **not** a guessed sanitiser |
| **GAM operational-suitability** | Fresh A4 System 3 underdetermined; T-031 Case 1 | GAM operand executability — DLA already commissioned correctly |
| **GAM D** | OPEN / SEPARATE | Pedagogical-function fulfilment of a known commission |

**Smallest next task:** **S77-T-020 — GAM four-track triage (decision only).** One short decision: which **single** track is authorised first. No code. No DLA edits. No validators.

**Recommended first track if triage picks one:** **GAM operational-suitability (A4 System 3 / Case 1)** — named operand, settled T-031 ownership, behavioural and bounded. E1 is larger prompt-architecture repair (and conversation worked this run). E2 needs a capture protocol, not a fix. GAM D stays separate.

T-019 itself should **not** implement any of the four.

---

## Verdict

**E1 CONFIRMED (NO DRIFT THIS RUN) · E2 INTERMITTENT / NOT REPRODUCED · A4 SYSTEM 3 = GAM CASE-1 EXHIBIT · NEXT = T-020 TRIAGE — NO IMPLEMENTATION**
