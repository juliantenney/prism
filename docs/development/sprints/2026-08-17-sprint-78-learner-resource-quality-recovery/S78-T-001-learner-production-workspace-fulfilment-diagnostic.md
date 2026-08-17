# S78-T-001 — Learner production / workspace fulfilment diagnostic

**Task:** S78-T-001  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC ONLY — no repair implemented  
**Workstream:** 1 — Learner production / workspace fulfilment  
**Authorised by:** operator (this task)  
**Production / tests / schema / validators / prompts / renderer:** **UNCHANGED**

---

## Executive summary

Fresh Lagrangian Activity 1 (post–S77 QA package) instructs learners to **enter responses into a comparison table**, but the realised table is **already populated and non-editable**.

**Earliest proven causal layer:** **DLA learner-production commissioning** — the bound post–T-023 Lagrangian run records Activity 1 `required_materials` as **`text` / `explanatory_note` / `checklist` only**, with **no `comparison_table` (or other table-family workspace) row**, while QA confirms a learner-facing comparison-table production task. That is a **commission/design gap** before GAM or renderer can bind an operational workspace.

**Secondary (when a table-family material is present):** **GAM material authorship** — contracts require **blank learner-response cells**, but there is **no capture/validator enforcement**; a fully populated markdown table yields a **non-editable** vNext table workspace by **intentional renderer policy**.

**Renderer:** **Not defective** for supplied content — it correctly maps non-blank cells to fixed cells and blank cells to `table_entry` inputs when a `comparison_table` (etc.) is composed in a Do moment.

**Root-cause classification:** **Primary B** (production commissioned ambiguously — task demands comparison entry; materials do not commission a workspace row) with **secondary C** (GAM may complete table bodies when a table material exists).

**Recommended owner for repair:** **DLA production/commissioning contract + cross-stage fulfilment gate** (with **GAM body validation** as downstream enforcement). Not renderer-first.

---

## 1. Learner-facing failure

| Field | Evidence |
| ----- | -------- |
| **Source** | [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) §Production defects — Major 1 |
| **Activity** | Activity 1 (fresh Lagrangian QA package, 2026-08-14) |
| **Instruction** | Learners are told to **enter responses into a comparison table** |
| **Expected production** | Learner-completed comparison (rows/columns comparing constrained-optimisation concepts — exact row labels **not in git**) |
| **Realised table** | Comparison table **already populated** |
| **Interactivity** | **Non-editable** — no operational cell entry |
| **Affordance** | Learner production/workspace **unusable as instructed** |

**Fresh learner HTML/JSON:** not committed. QA baseline is authoritative for the symptom; exact instruction/table excerpts are **not reconstructable from git**.

---

## 2. Upstream task / production requirement

| Field | Evidence |
| ----- | -------- |
| **DLA-owned fields** | `learner_task`, `expected_output` (commissioned at DLA; not re-emitted by GAM per T-023) |
| **Fresh A1 task text** | **Not in git** |
| **QA implication** | Task explicitly requires **learner entry** into a **comparison table** → load-bearing production is **compare/complete table**, not passive reading |
| **S76 Lagrangian pattern (historical, analogous)** | [S76-T-037](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-037-dla-p04-gate-c-rebenchmark.md) documents A1/A2 as teaching/compare activities; [tests/s76-dla-procedural-task-evidence-validation.test.js](../../../tests/s76-dla-procedural-task-evidence-validation.test.js) uses Lagrangian A2 `learner_task` strings referencing **“Complete the guided construction table”** — shows table-completion production is normal for this topic family |
| **Inference bound** | Production requirement is **evidenced by QA**; exact A1 `learner_task` / `expected_output` strings for the Friday package are **UNPROVEN in-repo** |

---

## 3. DLA commission

### Fresh intermediate artefacts

**Not in git:** DLA JSON, GAM JSON, and assembled page JSON for the 2026-08-14 QA baseline run.

### Best available in-repo bound commission (post–T-023 Lagrangian)

[S77-T-024-gam-e1-and-case-1-bound-gate-c.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-024-gam-e1-and-case-1-bound-gate-c.md) §A — operator inspection of **fresh DLA→GAM** on the bound chain:

| Activity 1 row | `material_type` |
| -------------- | --------------- |
| A1-M1 | `text` |
| A1-M2 | `explanatory_note` |
| A1-M3 | `checklist` |

- **No `comparison_table`**, `analysis_table`, `template`, or other table-family **workspace** row.
- E1 binding **PASS** — GAM reproduced these rows faithfully (types preserved; purpose/spec substantively fulfilled per operator).

**Boundary:** Friday QA package may differ from T-024’s type set, but T-024 is the **only in-repo fresh Lagrangian A1 commission inventory**. It already shows a **task/table mismatch class**: compare/enter-table production implied by QA vs teaching/checklist material types only.

### Authoritative DLA contracts (live path)

| Location | Relevant guarantee |
| -------- | ------------------ |
| `lib/ld-dla-page-enrich-contract.js` §4 / §Production | Step 1: define **learner production obligation** (`learner_task` + `expected_output`) covering load-bearing LO operations |
| Same §Task inputs / §Commissioning | **Workspace** role = “place/structure to record or manipulate, **including blank tables**”; `comparison_table` is a presentation token in §6 vocabulary (`77-DLA-CANONICAL-3`) |
| Same `buildDlaWorkbookOverlayBlock()` | **G5**: guided judgement → `comparison_table` \| `analysis_table` \| `decision_table` with **≥1 partial exemplar row** + scoring guide; **DLA-WB-15**: compare/rank tasks forbid **pre-supplied scores**; **DLA-WB-06a**: practice activity should list table-family row whose spec describes **learner-work columns** |
| [S77-T-010 diagnostic.txt](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-010-dla-assembled-prompt-diagnostic.txt) | Example shape includes `minimum_suitable_form: "compact comparison table"` on a material row — illustrative, not validated on output |

### DLA commission answers

| Question | Finding |
| -------- | ------- |
| Did DLA commission an actual learner workspace? | **No `comparison_table` (or table-family workspace) row** on bound A1 inventory (T-024). **UNPROVEN** whether Friday run added one. |
| Commission content *describing* a workspace only? | **Likely** — `learner_task` (QA) vs `text`/`explanatory_note`/`checklist` materials |
| Ambiguous commission? | **YES (proven on T-024 inventory + QA task)** |
| Display-oriented type for input task? | **`text` / `explanatory_note`** — static markdown path if table embedded; not `comparison_table` workspace binding |

---

## 4. GAM realisation

| Field | Evidence |
| ----- | -------- |
| **T-024** | GAM emitted **exactly** A1-M1..M3 with types above; purpose/spec **substantively fulfilled**; E1 **CLOSED** |
| **GAM contract** | `lib/ld-gam-page-enrich-contract.js` — honour DLA `purpose` + `specification`; ordinary materials = **markdown string bodies** |
| **Table authoring** | `app.js` `applyLdTableFidelityContractToDraft()` injects `lib/ld-table-fidelity.js` **author** role on GAM: *“leave response cells empty for learner completion”*; *“Comparison tables: include enough rows for each entity…”* |
| **Classification** | On bound run: GAM appears to follow commission (**instructional `text` / notes / checklist**). If QA table is visible, it is plausibly **inside `text` markdown** as **completed example content** → **instructional/example content**, not a blank workspace |
| **When `comparison_table` is commissioned** | GAM can still emit **completed learner workspace** if all cells are filled — **no validator** rejects zero blank cells |

**GAM supplied answers learner should produce?** **Plausible YES** for embedded table content (secondary **C**). **Not provable** without GAM body JSON. T-024 does not re-score pedagogical function (GAM D closed as no independent live defect on bound run).

---

## 5. Assembly behaviour

| Field | Evidence |
| ----- | -------- |
| **Path** | GAM partial → Design Page preserve (`lib/page-gam-materials-preserve.js`) → learner page model (`lib/learner-renderer-vnext/build-page-model.js`) |
| **`comparison_table` handling** | `page-gam-materials-preserve.js` maps type → `comparison_table` key; tier-D fidelity checks; **no transformation of filled→blank cells** |
| **Semantic change?** | **No evidence** assembly strips editability or converts workspace types to static types. Populated content, if present, is already in GAM markdown **before** assembly |
| **Causality** | **Not attributed to assembly** |

---

## 6. Renderer behaviour and capability

### Mapping

| Item | Location |
| ---- | -------- |
| **`comparison_table` token** | `lib/learner-renderer-vnext/parse-material.js` `MATERIAL_RENDERER_TYPES` |
| **Do-moment table workspace** | `lib/learner-renderer-vnext/completion-table-workspace.js` — `comparison_table` is **unconditional** completion type in Do moments |
| **Beat binding** | `lib/learner-renderer-vnext/archetype-canonical-binding.js` — `comparison_table` owned by **`guided_practice` / `guided_inquiry` / `guided_reasoning`** beats |
| **Composition** | `lib/learner-renderer-vnext/compose-generic-moments.js` sets `tableWorkspace: shouldComposeTableWorkspaceMaterial(material)` on Do materials |
| **Render** | `lib/learner-renderer-vnext/render-composed-moment.js` Do branch → `renderTableWorkspace()` when `item.tableWorkspace` |
| **Cell policy** | `lib/learner-renderer-vnext/render-table-workspace.js` L110–112: **non-blank cell → fixed (non-editable)**; blank → `<textarea class="util-learner-table-workspace__input">` |
| **Static fallback** | Non–table-family materials (e.g. `text`) → `renderMaterial()` — markdown pipe tables are **display-only** (see `tests/learner-renderer-vnext-compose-a2-table-workspace.test.js` — A2-M1 reference static, no inputs) |

### Renderer capability questions

| Question | Answer |
| -------- | ------ |
| Could vNext produce a **usable workspace** from material **actually supplied** (fully populated table body)? | **NO** — by design all filled cells render fixed; a fully populated `comparison_table` yields **zero** inputs (`tests/learner-renderer-vnext-table-subtypes-coverage.test.js` — populated `comparison_table` still routes to workspace, but cell policy removes inputs) |
| Could vNext produce a usable workspace if **correct upstream** semantics were supplied? | **YES** — `comparison_table` in Do moment with **blank learner-response cells** (± partial exemplar row) → `table_entry` with persistence (`lib/learner-renderer-vnext/learner-draft-persistence.js`) |
| Wrong moment? | If table material lands in **Learn** beat only, workspace metadata may not apply; **`text`-embedded tables never gain inputs** regardless of moment |

---

## 7. Relevant existing guarantees

| Guarantee | Location | What it ensures | Authoritative on fresh path? | Downstream propagation | Validates instruction→affordance? |
| --------- | -------- | --------------- | ---------------------------- | ---------------------- | --------------------------------- |
| Learner production obligation | DLA §4 step 1 | Task must cover load-bearing LO ops | Yes | `learner_task`/`expected_output` on page model | **No** — does not require matching workspace material |
| Workspace role | DLA §4 step 2 / commissioning | “blank tables” as workspace role | Yes | Via `required_materials` purpose/spec/type | **No** — prompt-only |
| G5 / DLA-WB-15 / WB-06a | DLA workbook overlay | Table-family row; no pre-supplied scores; learner-work columns | When overlay applies | Types/specs to GAM via T-023 projection | **No** deterministic validator |
| LD-TABLE-FIDELITY author | GAM prompt (`app.js` L14620–14632) | Blank response cells in table bodies | When self-directed scaffold applies | GAM markdown bodies | **No** capture check |
| GAM honour purpose/spec | `lib/ld-gam-page-enrich-contract.js` | Body fulfils commission text | Yes | Materials on page | **No** editability check |
| vNext table_entry | `render-table-workspace.js` + tests | Blanks→inputs; filled→fixed | Yes | Render time | **N/A** — assumes correct body |
| Audit helper | `lib/learner-renderer-vnext/audit-learner-surfaces.js` L275–277 | Infers “compare in comparison_table” action | Audit tooling | Not generation gate | **No** |

**Gap:** No authoritative **fail-closed** rule that `learner_task` requiring table/compare/enter production must have a table-family workspace material with ≥1 blank learner-response cell (or declared `combined_evidence_workspace` column split).

---

## 8. Historical behaviour / regression evidence

| Question | Finding |
| -------- | ------- |
| Did this ever work end-to-end on generated Lagrangian? | **UNPROVEN** for post–S77 canonical path — no pinned passing A1 workspace artefact in git |
| Table workspace capability | Sprint 68+ commits (`88c33b2`, `134b45d`, `6853376`) **added/stabilised** table workspace — not removed |
| LD-TABLE-FIDELITY blank-cell rule | Present in `lib/ld-table-fidelity.js` since Sprint 38-B; **never validator-enforced** on GAM output |
| Regression vs ineffectual guarantee | **G — existing guarantees present but non-salient / non-enforced** is stronger than “guarantee removed” |
| T-024 vs QA | Material inventory **without** `comparison_table` while QA cites comparison-table **entry** task → **commission drift or run variance UNPROVEN**; mismatch class is stable |

---

## 9. Earliest proven causal layer

**DLA learner-production commissioning / material-type binding** — Activity 1 QA task requires comparison-table **entry**, but the bound fresh Lagrangian commission inventory lists only **`text` / `explanatory_note` / `checklist`** (no workspace row). GAM and renderer faithfully realise what was commissioned or authored as markdown content.

---

## 10. Root-cause classification

| Class | Applicability |
| ----- | ------------- |
| **A** Production never commissioned | Partial — no workspace row on T-024 inventory |
| **B** Production commissioned ambiguously | **PRIMARY** — task demands production; materials are teaching/checklist genres |
| **C** Workspace commissioned but GAM completed it | **SECONDARY** — when table body exists; prompt says blank cells; no enforcement |
| **D** Wrong presentation/material type | **SECONDARY** — table content in `text`/static path vs `comparison_table` |
| **E** Assembly lost semantics | **Not evidenced** |
| **F** Renderer cannot realise correct commission | **No** — renderer supports blank-cell workspaces |
| **G** Guarantee ineffective/non-salient | **YES** — DLA + LD-TABLE-FIDELITY + vNext exist but **no fulfilment gate** |
| **H** Other | — |

**Primary: B** · **Secondary: C, D, G**

---

## 11. Canonical repair owner

1. **Primary:** **DLA production + commissioning contract** (bind `learner_task`/`expected_output` table/compare/enter verbs to an explicit table-family workspace row and specification semantics for blank learner cells / partial exemplar).
2. **Secondary:** **GAM output validation** (enforce LD-TABLE-FIDELITY blank-cell rule on table-family bodies when purpose/spec implies learner completion).
3. **Not primary owner:** Renderer (behaviour correct given inputs); assembly (no semantic mutation evidenced).

---

## 12. Smallest semantically correct repair direction — DESIGN ONLY

1. **DLA — workspace fulfilment invariant (prompt + optional validator):** When step-1 production requires compare/complete/enter/fill a table (detect via `learner_task`/`expected_output` or explicit operator flag), require ≥1 `required_materials` row with `material_type` ∈ `{comparison_table, analysis_table, decision_table, classification_table, planning_table, data_table, impact_table, template}` whose `specification` states **learner-response columns/rows remain blank** (G5 partial exemplar allowed; DLA-WB-15 forbids pre-supplied scores).
2. **GAM — capture guard:** For those rows, reject (or fail-closed warn) markdown table bodies with **zero** blank learner-completion cells when specification implies learner entry (`lib/learner-renderer-vnext/table-material-parse.js` `materialHasBlankTableCells()` logic reusable).
3. **Regression:** Protected test with Lagrangian-shaped A1 commission → assembled HTML must contain `util-learner-table-workspace__input` when task requires comparison entry; must **not** hand-edit benchmark package.
4. **Preserve partial exemplar policy** from heteroscedasticity fixture (`tests/learner-renderer-vnext-compose-a2-table-workspace.test.js` — exemplar row fixed, blanks editable).
5. **Do not** Lagrangian-hand-edit; **do not** weaken renderer to force inputs over authored content without upstream contract change.

---

## 13. Activity 3 moderate finding relationship

**DIFFERENT**

Activity 3 moderate issue (Markdown-like table scaffolding in **multiple free-text fields** for mathematical workspace) concerns **`template` / `prompt_set` / text_entry** presentation, not `comparison_table` `table_entry` fulfilment. Same sprint family (workspace fulfilment) but **not the same causal mechanism** proven here. Do not merge into WS1 repair without separate T-001 evidence.

---

## 14. Fresh artefact gaps (explicit)

| Artefact | Status |
| -------- | ------ |
| Friday QA A1 `learner_task` / `expected_output` verbatim | **Not in git** |
| Friday QA DLA A1 `required_materials` JSON | **Not in git** |
| Friday QA GAM A1 material bodies | **Not in git** |
| Assembled learner HTML for A1 table | **Not in git** |
| T-024 bound run inventory | **In git** — partial proxy only |

Absence does **not** justify renderer or assembly repair; contract/trace analysis above is sufficient for bounded **design** next step.

---

## 15. Verification

Diagnostic complete. **No implementation.** Next: operator authorisation of **S78-T-004** (proposed solution design) or equivalent bounded design task.

**References:** [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) · [S77-T-024](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-024-gam-e1-and-case-1-bound-gate-c.md) · [SPRINT-78-CHARTER.md](SPRINT-78-CHARTER.md)
