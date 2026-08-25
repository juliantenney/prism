# S78-T-038 — Learner composition and presentation regression diagnostic

**Task:** S78-T-038  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no production changes in this task**  
**Fixture:** Post–T-037 Lagrangian package — independent QA **94**; operator inspection of rendered learner resource  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Evidence boundary:** Generated run artefacts are not in the repository. Findings use operator-rendered specimens, repository contracts/code/tests/history (T-030/T-031/T-032, T-001, T-035, vNext parsers/renderers). Where an exact assembled JSON field is still needed, it is named explicitly below.

---

## 1. Executive finding

The **94** score reflects strong instructional / disciplinary content. Four **learner-facing composition defects** remain, with **independent primary owners**:

| # | Defect | Primary cause class |
| - | ------ | ------------------- |
| 1 | No distinct final transfer production task | **Intentional product packaging + commissioning gap** — T-032 restored page **Study tips** consolidation, not a learner-production transfer surface |
| 2 | Numbered sub-tasks collapse to one paragraph | **Generation / authoring** of single-line numbered `learner_task`, amplified by **vNext model** `parseLearnerTask` (line-start-only markers) |
| 3 | Diagnostic `1. A.` / `2. B.` | **Material renderer** — guided-review features wrap letter keys in `<ol>` |
| 4 | A3 “Solution workspace” bold labels without affordances | **Generation / authoring + interaction capability mismatch** — scaffold authored as bold prose (not `template` / table blanks); true math workspace remains parked |

They are **not** one shared root cause. Defects 2 and (sometimes) 4 share “GAM emits structural intent as flattened Markdown,” but owners and fixes differ. Do **not** merge into one broad implementation.

---

## 2. Defect 1 — Missing final transfer task

### Historical component

| Layer | What existed |
| ----- | ------------ |
| **Activity-level transfer** | EP `transfer` beats → DLA `transfer_or_application_task` + `required_materials` type `transfer_prompt` → GAM body → vNext `text_entry` workspace (`compose-response-parts.js` `partFromTransferText`) |
| **Page-level closure** | `page_synthesis.study_tips` — historically synthesised at Design Page; after Sprint 56C **transport-or-omit**; after [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) / [T-032](S78-T-032-gam-learner-closure-packaging-implementation.md) = transport of GAM `### Page learner-resource closure` (2–4 consolidation bullets; **optional light transfer without worked answer**) |

There is **no** separate schema field `final_synthesis` / `next_steps` (explicitly forbidden in T-032).

### Relation to T-032 Study tips

T-032 **intentionally** restored **page-level epistemic consolidation** in Study tips. It is **not** a distinct learner-production / transfer task and must **not** be turned into one without contradicting S78-D04 (GAM substance → DP transport; no DP instructional authorship).

**Closure / Study tips and final transfer should remain distinct:**

- Study tips = short consolidation (read / reflect bullets).
- Final transfer = activity-owned `transfer_prompt` (or equivalent) with a **learner response affordance**.

### Was transfer deliberately removed?

Not as a renderer retirement. Capabilities remain in vNext and DLA contracts (G2 Transfer → `transfer_prompt`; Evaluate completion pack includes `transfer_prompt`). What changed is **page wrapper ownership**: Design Page no longer authors a closing transfer task; page closure is consolidation packaging.

### Earliest divergence for “no final transfer production”

Likely **commissioning / packaging**, not renderer:

1. Culminating activity may lack a `transfer_prompt` material (or transfer field not rendered as workspace), **and/or**
2. Operator expectation of a **page-level** transfer task was never a durable post-56C Design Page responsibility.

**Exact artefact check still needed (operator):** on the 94 assembled page, final activity `materials[]` — is there a row with `material_type: "transfer_prompt"`? Is `transfer_or_application_task` present? Journey ends at Study tips by design when no later activity exists.

### Smallest correct restoration

| Option | Owner | Notes |
| ------ | ----- | ----- |
| **Preferred** | DLA (+ GAM fulfilment) | Ensure culminating Evaluate/Transfer activity commissions a real `transfer_prompt` (existing type) with learner production; do not invent schema; do not author into Study tips |
| **Not preferred** | Stuff transfer production into `study_tips` | Conflicts with T-032 / S78-D04 |
| **Not preferred** | New page-level transfer section | Schema / DP authorship risk |

**Fix type:** prompt-contract / commissioning salience. **Regeneration required** to prove (unless the 94 package already contains an unrendered `transfer_prompt` — then re-export diagnostic first).

---

## 3. Defect 2 — Numbered learner sub-tasks collapse

### Specimen (operator)

> `Inspect each supplied economic optimisation case. 2. Identify the objective, … 3. Classify each case…`

Expected: structured `1.` / `2.` / `3.` steps.

### Trace (repository reproduction)

`parseLearnerTask` only matches markers at **line start** (`(?:^|\n)\s*(\d+)[.)]\s+`).

Single-line authored string:

```text
1. Inspect … 2. Identify … 3. Classify …
```

yields **one** step: `sourceStepNumber: 1`, text = `Inspect … 2. Identify … 3. Classify …`  
→ leading `1.` **consumed**; `2.` / `3.` remain **literal inline**.

Instructions render via `renderInstructionBlock` as escaped HTML in a `<p>` (not Markdown list reconstruction):

```115:126:lib/learner-renderer-vnext/learner-icon-renderer.js
function renderInstructionBlock(instruction) {
  return (
    '<div class="util-beat-instruction …">' +
    renderLabeledText(
      "<p>" + html.escapeHtml(instruction.text) + "</p>",
      …
```

`renderMarkdownBlock` **would** build `<ol>` only for **newline-separated** numbered lines. Same single-line string becomes one `<li>` whose body still contains literal `2.` / `3.`.

### Earliest divergence

**Generation / authoring:** DLA `learner_task` (or material body) emitted as a **single-line numbered sequence** rather than newline-separated list / discrete steps.

**Secondary:** vNext `parseLearnerTask` assumes line-start markers; once it sees a leading `1.`, it does not re-split on mid-line `2.` / `3.`.

**Not** Design Page transport flattening (field is activity-owned). **Not** intentional product removal of numbered tasks. Related to T-035 only as **markdown / list edge-case family**, not as legacy-renderer stranding.

### Smallest fix direction

1. **Parser hardening (domain-general):** split sequential mid-line `\d+[.)]\s+` when numbers are consecutive (preserve authored numbers). Live-path regression with the operator specimen string.  
2. **Authoring salience (DLA):** require newline-separated numbered steps in `learner_task` when ≥2 steps.  

Prefer **both**; parser alone recovers already-generated packages on **re-export**.

---

## 4. Defect 3 — Diagnostic `1. A.` enumeration

### Trace

Guided-review checklist features in `renderGuidedFeatureLists` (`render-material.js`):

- Outer list: **`<ol>`** → browser paints `1.`, `2.`, …  
- Inner label: renderer injects **`A.` / `B.`** via `String.fromCharCode(65 + index)`  
- Result: **`1. A. …` / `2. B. …`**

“If something is missing” already uses **`<ul>`** + `Missing A:` / `Missing B:` — no redundant numeric layer there.

Letter keys are **generated by the renderer**, not required from authored feature text (authored `expected` / `repair` are free prose).

### Earliest divergence / owner

**Material renderer** presentation choice. Numeric `<ol>` index is **not** semantically independent of A/B for this surface.

### Smallest fix

In `renderGuidedFeatureLists` look-for block: use **`<ul>`** (or a non-numbered list) while retaining `A.` / `B.` keys — **do not** globally disable ordered lists.  

**Re-export only.** No regeneration. Low risk if scoped to guided-review feature lists.

No current test asserts `util-guided-review__feature-key` against `<ol>` — add regression that look-for HTML must not nest letter keys inside ordered-list numbering.

---

## 5. Defect 4 — Structured workspace → bold labels

### Specimen (operator): Activity 3 Solution workspace

Successive bold lines (Lagrangian, FOCs, substitution, candidate values, feasibility…) without usable working affordance.

### Intended vs realised

| Path | Behaviour |
| ---- | --------- |
| `material_type: "template"` + `**Label:**` sections | `parseTemplateSections` → `text_entry` workspaces per section |
| `**Label**` **without** trailing `:` | `parseTemplateSections` returns **[]** → static Markdown bold paragraphs |
| Table-family + blank cells | `table_entry` workspaces (T-001 / T-007) |
| `text` / explanatory body with bold lines | Always static |

Repository reproduction: bold-without-colon → no template sections; bold-with-colon → sections with default “Record your response for …” prompts and textareas (not math editors).

### Relation to parked issues

[T-001](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md) already separated:

- **WS1 table fulfilment** (commission + blank cells) — largely addressed by T-005/T-007 for table-family.  
- **A3 mathematical workspace** — “Markdown-like table scaffolding vs structured mathematical workspace” — **logged lower priority**; **not** the same mechanism as comparison-table blank cells. Editable maths input remains **explicitly parked**.

### Earliest divergence

**Generation / authoring:** Solution workspace authored as **bold prose scaffold** (and/or wrong material type), not as `template` / blank table that vNext can bind.

**Secondary:** **interaction capability** — even a correct `template` yields **text areas**, not mathematical derivation UI. That capability gap must stay named, not “fixed” by pretend textareas as math workspaces.

### A3 / A4 / A5

Likely **same authoring pattern family** (bold/heading scaffolds or weak workspace binding) with **shared renderer fallback to static Markdown**, not three unrelated bugs. Confirm with material_type + body shape on the 94 package for A3–A5.

### Smallest fix direction (without implementing math input)

1. **GAM/DLA salience:** derivation / solution workspaces use `template` with `**Step label:**` (or table-family blanks) when learner production is required.  
2. **Optional renderer:** accept bold labels without colon **only** for `template` materials (narrow).  
3. **Product honesty:** document that true symbolic math workspace is out of scope; textareas are interim fidelity for labelled steps.

**Regeneration** for authoring shape; **re-export** can prove renderer-only template parsing broaden.

---

## 6. A3 / A4 / A5 comparison

| Activity | Likely shared cause | Distinct notes |
| -------- | ------------------- | -------------- |
| A3 Solution workspace | Bold/scaffold without template/table binding | Strongest “stranded labels” specimen |
| A4 / A5 | Same static-Markdown fallback when structure isn’t a bound workspace type | May also mix guided-review (Defect 3) or numbered tasks (Defect 2) |

Treat as **one presentation-fidelity workstream** with per-activity specimens, not three separate ownership debates — unless artefact check shows different material types.

---

## 7. Root-cause classification table

| Defect | Earliest divergence | Primary owner | Existing capability? | Fix type |
| ------ | ------------------- | ------------- | -------------------- | -------- |
| Final transfer | Page closure restored as Study tips consolidation (T-032); distinct transfer production not commissioned/surfaced as terminal task | DLA/GAM commissioning (activity `transfer_prompt`); **not** DP / Study tips | **Yes** — `transfer_prompt` + text_entry | Prompt-contract / commissioning |
| Numbered tasks | Single-line numbered `learner_task` authored | Generation (DLA); secondary `parseLearnerTask` | **Partial** — newline lists work; single-line fails | Parser + authoring salience |
| `1. A.` diagnostics | Guided-review feature list uses `<ol>` + letter keys | vNext `render-material.js` | **Yes** — change list element only | Material renderer |
| Workspace labels | Bold scaffold / non-template body; no math workspace | Generation + capability gap | **Partial** — `template`/tables exist; math UI parked | Authoring + optional parser; capability documented |

**Primary cause classes (required vocabulary):**

1. Final transfer — **intentional product decision** (Study tips ≠ transfer task) + **prompt-contract / generation** gap for activity transfer.  
2. Numbered tasks — **generation / authoring** (+ **vNext model** secondary).  
3. `1. A.` — **material renderer**.  
4. Workspace labels — **generation / authoring** + **interaction capability** (math) secondary.

---

## 8. QA blind spots demonstrated

Independent QA at **94** praised low-complexity workspaces and treated text areas / structured tables as sufficient. Operator inspection shows QA did **not** reliably catch:

| Blind spot | Evidence |
| ---------- | -------- |
| Collapsed numbered task sequences | Single-paragraph instructions with literal `2.` / `3.` |
| Redundant enumeration | Guided-review `1. A.` |
| Missing response / workspace affordances | Bold labels without inputs |
| Semantically stranded workspace labels | A3 Solution workspace |
| Missing final **production** transfer (vs consolidation Study tips) | Journey ends at Study tips; QA still asked for transfer scenario / synthesis |

**Do not modify QA in this task.** Recommend a later QA-instrument note: structural presentation checks distinct from content quality.

---

## 9. Recommended implementation tasks (priority)

### P1 — S78-T-039 (proposed): Guided-review feature list enumeration

- **Owner:** `lib/learner-renderer-vnext/render-material.js`  
- **Minimal change:** look-for features → non-ordered list; keep A/B keys; leave Missing-* as-is  
- **Regression:** live export HTML must not show ordered-list numbering around `util-guided-review__feature-key`  
- **Risk:** low  
- **Prove:** **re-export** existing package  

### P2 — S78-T-040 (proposed): Numbered `learner_task` structure recovery

- **Owner:** `parse-learner-task.js` (+ optional DLA salience)  
- **Minimal change:** split sequential mid-line numbered markers; do not invent steps when no numbers  
- **Regression:** operator specimen → three instructions / steps; live export path  
- **Risk:** medium (false splits on decimals / versions — constrain to `N.` / `N)` with whitespace)  
- **Prove:** **re-export** for parser fix; regen if only salience  

### P3 — S78-T-041 (proposed): Culminating transfer production commissioning

- **Owner:** DLA contract (+ GAM fulfilment of `transfer_prompt`)  
- **Minimal change:** salience that self-study culminating activity includes learner-facing `transfer_prompt` (existing type); Study tips remain consolidation only  
- **Regression:** assembled page final activity has `transfer_prompt`; export shows transfer workspace before/near Study tips  
- **Risk:** medium (prompt pressure)  
- **Prove:** **fresh generation**  

### P4 — S78-T-042 (proposed): Derivation / solution workspace material fidelity (no math editor)

- **Owner:** GAM/DLA material-shape salience; optional `parseTemplateSections` broaden for `template` only  
- **Minimal change:** commission `template` with `**Label:**` (or blank tables); document math UI still parked  
- **Regression:** A3-shaped fixture → text_entry per label, not bold-only stack  
- **Risk:** medium–high if over-broadened parser  
- **Prove:** regen for authoring; re-export for parser-only  

**Do not** open one mega “presentation cleanup” task. **Do not** start T-035 residue cleanup here.

---

## 10. Regeneration vs re-export

| Fix | Re-export enough? | Regeneration required? |
| --- | ----------------- | ---------------------- |
| P1 guided-review `1. A.` | **Yes** | No |
| P2 numbered-task parser | **Yes** (if artefact has single-line numbers) | Salience-only needs regen |
| P3 final transfer production | Only if `transfer_prompt` already present but mis-rendered | **Usually yes** |
| P4 workspace labels | Parser broaden only | **Usually yes** for type/shape |

---

## 11. Tests required (for later implementation)

1. Guided-review look-for: letter keys present; **no** `<ol>` wrapping those keys.  
2. `parseLearnerTask` + live `renderLearnerPageForTest`: single-line `1. … 2. … 3. …` → three steps; no literal mid-prose `2.` in instruction text.  
3. Culminating activity fixture: `transfer_prompt` material → transfer workspace in export.  
4. Template fixture: `**FOC wrt x:**` → textarea; bold-without-structure regression named.  

---

## 12. Files inspected

| Area | Paths |
| ---- | ----- |
| Closure / transfer history | T-030, T-031, T-032, S78-D04, PLAN moderate findings |
| Workspace history | T-001 |
| Markdown parity | T-035 |
| Task parsing | `parse-learner-task.js`, `parse-prompt-set-items.js`, `build-beat-model.js` |
| Instructions | `learner-icon-renderer.js` `renderInstructionBlock` |
| Markdown | `render-html-utils.js` `renderMarkdownBlock` |
| Guided review | `render-material.js` `renderGuidedFeatureLists`, `parse-guided-checklist.js` |
| Templates / transfer | `parse-template-sections.js`, `compose-response-parts.js`, `completion-table-workspace.js` |
| Contracts | `ld-dla-page-enrich-contract.js`, `ld-gam-page-enrich-contract.js` |

---

## 13. Files changed

| File | Change |
| ---- | ------ |
| `S78-T-038-learner-composition-presentation-regression-diagnostic.md` | **Created** (this record) |
| `STATUS.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `SPRINT-78-START-HERE.md` | Minimal navigation |

**No production code, tests, schemas, or prompts changed.**

---

## 14. Sprint 78 / T-013 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-037 | Timing restore complete (prior) |
| T-038 | **Diagnostic complete** — implementations not authorised here |

Do **not** close T-013 or Sprint 78 from this diagnostic. Do **not** start T-019.
