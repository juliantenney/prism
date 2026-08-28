# S81-T-003 — Current learner interaction needs assessment

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator 2026-08-28)  
**Follow-on:** [S81-T-004](S81-T-004-candidate-representation-options-for-unmet-needs.md) — COMPLETE (awaiting operator review of T-004)

---

## 1. Purpose & core question

For each of the six T-002 learner actions, assess whether PRISM’s **current** representation lets the learner perform the action clearly, efficiently, accessibly, and in a way that preserves the intended learning design and feedback/review relationship.

**Allowed finding:** current representation is already appropriate.

This task describes **needs**, not solutions. It does **not** invent surface families, widgets, or a free-text/table diagnostic engine.

---

## 2. Evidence basis (representative experience)

Contracts from T-001/T-002 were treated as background. T-003 inspected **rendered** learner HTML and renderer behaviour.

| Source | Role | Actions covered |
| ------ | ---- | --------------- |
| `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` (cert corpus, authoritative) | Full lesson: moments, text, tables, flat checklists, assessment coexistence | study, compose, table, self-review (flat), select |
| `tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json` | Material/surface coverage | study, compose (multi-field), table, self-review (flat) |
| `tests/fixtures/page-render/prism-authoritative-ordering-page.json` (cert corpus) | Ordering workspace + check | study, order, self-review (flat) |
| `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json` | Tables + text + checklists | study, compose, table, self-review |
| Guided-review body via `parse-material` + `render-material` (S78-T-039 payload shape) | Guided self-review UI (not present as guided JSON in hetero/kitchen renders) | self-review (guided) |
| Renderer modules | Affordances, a11y attributes, feedback wiring | all |
| Embedded vNext CSS in `app.js` (table workspace / table-scroll) | Layout constraints (e.g. horizontal scroll) | table |

**Distinction preserved:** capability inferred from code ≠ experience visible in representative output. Guided review is **code-proven**; flat checklists dominate the cert lesson fixtures inspected here.

---

## 3. Assessment by learner action

Improvement-headroom vocabulary:

| Label | Meaning |
| ----- | ------- |
| **NONE IDENTIFIED** | Current representation already appropriate for the action as modelled |
| **MINOR / PRESENTATIONAL** | Small friction; does not appear to constrain the learning act |
| **MEANINGFUL INTERACTION OPPORTUNITY** | Evidence of real interaction cost or revision awkwardness; not automatically a mandate to change |
| **MATERIAL CURRENT CONSTRAINT** | Strong evidence the representation blocks or seriously distorts the intended act |
| **UNKNOWN / NEEDS EVIDENCE** | Insufficient representative experience |

### 3.1 LA-study — Study / read / inspect

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Strong. Content renders as prose/materials under moment headings such as “Explore the idea” before “Your task” (hetero HTML). |
| **B. Cognitive fit** | Representation matches reading/inspection. Difficulty remains in content, not chrome. |
| **C. Evidence fit** | N/A (no learner evidence) — correct per T-002. |
| **D. Feedback fit** | **none** — correct. |
| **E. Usability** | Linear document reading; long Learn sections are pedagogical length, not proven UI waste. |
| **F. A11y robustness** | Semantic headings/sections/articles; markdown prose; `util-prose-measure` constrains line length. Preserve native document structure and reflow. |
| **G. Variants** | Worked example / scenario / reference table as study — same action; table-as-reference stays static (T-002). |
| **H. Headroom** | **NONE IDENTIFIED** for the study act itself. |

**Verdict:** Current representation is **already appropriate**.

---

### 3.2 LA-compose — Compose written response(s)

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Strong. Native `<textarea>` with explicit `<label>`, optional prompt, `aria-describedby`, and honest draft note (“saved on this device… not submitted”). |
| **B. Cognitive fit** | Writing *is* the task; UI does not add a competing interaction model. |
| **C. Evidence fit** | Clean persisted free text per field (`text_entry`). |
| **D. Feedback fit** | **none** on the text — matches T-002. Does not falsely auto-diagnose. |
| **E. Usability** | Single-field compose (hetero A1: 1 `text_entry`) is clear. Multi-field compose (hetero A4: 5 `text_entry`; kitchen prompt-set activity: 3) increases scanning/typing cost but fields remain labelled. |
| **F. A11y** | Native textareas, labels, describedby. Preserve keyboard entry, focus outlines, linear reading of prompts→fields. |
| **G. Variants** | Single vs labelled multi-field / transfer: **same action**; multi-field raises scanning cost (**variant sensitivity: mild**). No split of action type warranted. |
| **H. Headroom** | **NONE IDENTIFIED**–**MINOR** for compose alone. Combination with self-review: see §4 (**MEANINGFUL**). |

**Verdict:** Current representation is **already appropriate** for the compose act; revision-with-criteria is a **sequence** issue, not a failure of the textarea.

---

### 3.3 LA-table — Complete / construct table cells

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Strong for comparison/classification/decision/planning semantics — the grid *is* the thinking frame. |
| **B. Cognitive fit** | Helps tabular thinking. Cell textareas (3 rows, resizable) fit short judgements/notes. |
| **C. Evidence fit** | Cell map via `data-learner-cell` / `table_entry` — clean. |
| **D. Feedback fit** | **none** on cells — matches T-002. |
| **E. Usability** | Representative cost is real: hetero “Interpreting Residual Plot Evidence” Do→Check span ~11k HTML chars with **10** textareas (mostly table cells); kitchen analysis/decision activities similarly **9–10** textareas. CSS sets `min-width: 8rem` on cells and provides `.util-table-scroll { overflow-x: auto }` — wide tables imply horizontal scrolling while editing. |
| **F. A11y** | Strengths: `<table>`, `th scope="row"`, `aria-labelledby` / `aria-label` on editable cells, focus styles. Preserve table semantics and non-pointer editing (native textareas). Risk if replaced by canvas/drag grids: loss of cell names and keyboard fill. |
| **G. Variants** | Comparison vs decision vs classification etc. change **column meaning**, not the interaction pattern. Larger blank grids amplify cost (**variant sensitivity: scale**, not type split). |
| **H. Headroom** | **MINOR**–**MEANINGFUL INTERACTION OPPORTUNITY** depending on grid size; not proven as **MATERIAL CURRENT CONSTRAINT** (activities remain completable in fixtures). |

**Verdict:** Representation **fits the learning design**; interaction cost grows with blank-cell count / width. Needs, if any, are about **managing many structured fields** and revision with criteria (§4)—not “tables are the wrong idea.”

---

### 3.4 LA-self-review — Review own work against criteria

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Flat interactive checklists fit self-attestation (fieldset/checkbox + labels). Guided review (code/tests) fits criterion-by-criterion self-check with look-for / repair prose and confirmation. |
| **B. Cognitive fit** | Flat: all criteria visible — low UI metaphor cost. Guided: progressive panels + Prev/Next focus attention on one criterion (pedagogical), at navigation cost. |
| **C. Evidence fit** | Captures attestation only — correct; does not claim to score production (generation contract). |
| **D. Feedback fit** | **self-review / self-attestation** — matches T-002. Does **not** consume compose/table drafts. |
| **E. Usability** | Cert lesson fixtures inspected render **flat** checklists under “Check your response” **below** Do (always `doBeforeCheck: true`). Distance from production workspace to checklist grows with table/learn size (hetero examples ~1k–14k chars). That forces scroll to apply criteria, then scroll back to revise. Guided UI adds panel navigation; simultaneous view of prior response is not structurally provided. |
| **F. A11y** | Native checkboxes + labels; guided has `aria-live` status and button nav (not pointer-only). Preserve operable confirmations and live status. Risk: progressive hiding of panels must not strand keyboard users (nav exists). |
| **G. Variants** | Flat vs guided: **same action**; guided changes stimulus density and navigation (**variant sensitivity: present**). Guided appearance in authoritative lesson fixtures here: **weak** (hetero/kitchen guided count 0) — treat live frequency as **UNKNOWN**. |
| **H. Headroom** | Self-review **widget alone:** **NONE**–**MINOR**. **Revision loop with prior production:** **MEANINGFUL INTERACTION OPPORTUNITY** (§4). |

**Verdict:** Attestation UI is appropriate; the unmet need is **co-availability of response and criteria during revision**, not a missing diagnostic engine.

---

### 3.5 LA-order — Order / sequence / rank

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Strong. Reorderable list with Move up / Move down and optional “Check sequence”. |
| **B. Cognitive fit** | Ordering *is* the task; buttons make mechanics explicit rather than gesture-hidden. |
| **C. Evidence fit** | `itemOrder` persisted — clean. |
| **D. Feedback fit** | **deterministic order check** in-workspace when `exact_order` — matches T-002; independent of `diagnostic_review`. |
| **E. Usability** | Keyboard-operable buttons with per-item `aria-label`; `aria-live` status. Long lists would require many moves (not evidenced as long in the authoritative ordering fixture). Separate flat checklist may still appear in Check moment. |
| **F. A11y** | **Preserve:** button-based reorder (not drag-only), named controls, live announcements, non-pointer operation. |
| **G. Variants** | Sequence vs rank — same interaction pattern in normaliser. |
| **H. Headroom** | **NONE IDENTIFIED**–**MINOR** for typical short lists. Production emission frequency remains **UNKNOWN** (S81-D-003) — experience assessed where capability is present. |

**Verdict:** Current representation is **already appropriate** where ordering is offered; keyboard-first design is a strength to keep.

---

### 3.6 LA-select — Select an objective answer

| Facet | Finding |
| ----- | ------- |
| **A. Task fit** | Strong. Radios in `fieldset`/`legend` for MCQ/TF. |
| **B. Cognitive fit** | Selecting among options matches the assessment act. |
| **C. Evidence fit** | `assessment_selection` — clean. |
| **D. Feedback fit** | **deterministic correctness** + optional rationale; `aria-live` result — matches T-002. |
| **E. Usability** | Feedback adjacent to the item (hetero A5 coexists with other workspaces on the page). Low mechanical cost. |
| **F. A11y** | Native radios, legend, live result region. Preserve these over custom clickable cards. |
| **G. Variants** | TF synthesised options — same action. Multi-answer / short_answer interactive paths: **not** assessed as current experience (S81-D-005 / T-002 unknowns). |
| **H. Headroom** | **NONE IDENTIFIED** for current MCQ/TF interactive path. |

**Verdict:** Current representation is **already appropriate** for first-class objective items.

---

## 4. Common sequences / cross-surface findings

| Sequence | Observation (from rendered structure) | Need (if any) |
| -------- | ------------------------------------- | ------------- |
| study → compose → self-review | Learn → “Your task” (textarea) → “Check your response” (checklist). Short compose: small gap. | When revising, learner needs **criteria and response available together** without losing place — gap grows with content above checklist |
| study → table → self-review | Same linear pattern; Do→Check distances largest when tables dominate (hetero/kitchen ~9–14k chars) | Same co-availability need, amplified by **many cells** to revisit while applying criteria |
| study → order → deterministic check | Order check is **in-workspace**; optional checklist still below | Lower cross-surface friction than compose/table→self-review |
| study → select → correctness/rationale | Feedback local to item | Sequence works; **NONE IDENTIFIED** |

**Cross-cutting finding (not owned by one widget):**  
PRISM’s moment composition correctly separates Explore / Task / Check, but **revision after self-review** depends on browser scroll memory. That is an interaction need about **stateful co-reference during revision**, not evidence that textareas or tables are pedagogically wrong.

---

## 5. Unmet interaction needs inventory

Needs only — **no solutions**.

| ID | Need statement | Grounded in | Headroom |
| -- | -------------- | ----------- | -------- |
| **N1** | During revision after self-review, the learner needs ready access to **both** their produced response (text and/or table cells) **and** the criterion currently being applied, without the interface forcing a long scroll-away / scroll-back loop. | Linear Do→Check distances in hetero/kitchen/ordering renders; T-002 feedback map (attestation does not read drafts) | **MEANINGFUL INTERACTION OPPORTUNITY** |
| **N2** | When a table contains many learner-owned cells, the learner needs a manageable way to **enter and revisit** structured responses without interaction mechanics dominating the comparison/decision task. | 9–16 textareas in table-heavy activities; cell min-widths + horizontal scroll CSS | **MEANINGFUL INTERACTION OPPORTUNITY** (scale-dependent) |
| **N3** | When compose uses several labelled fields, the learner needs clear ongoing association between **each prompt/label and its field** while drafting and revising. | Multi `text_entry` activities (hetero A4; kitchen prompt-set) | **MINOR**–**MEANINGFUL** (milder than N1/N2) |
| **N4** | If guided self-review is used, the learner needs to apply **one criterion’s** look-for/repair guidance without losing access to the response being judged (same family as N1; progressive UI may intensify it). | Guided render sample + runtime nav; guided rare in cert lesson fixtures inspected | **MEANINGFUL** where guided is present; live frequency **UNKNOWN** |

**Explicitly not unmet needs (on current evidence):**

- A runtime engine that diagnoses free-text/table content (`diagnostic_review` remains commission-only).  
- Replacement of study prose with interactive widgets.  
- Replacement of MCQ/TF radios for LA-select.  
- Drag-only ordering (current button model is a strength).

---

## 6. Current strengths to preserve

| Strength | Why it matters |
| -------- | -------------- |
| Moment structure (Explore / Your task / Check / Transfer) | Clear pedagogical sequence |
| Native form controls (textarea, checkbox, radio, button) | Keyboard, AT, focus, names |
| Honest draft persistence (“not submitted”) | Matches evidence model; no false submission/scoring claim |
| Table semantics + labelled editable cells | Structured evidence without fake diagnosis |
| Ordering via named Move up/down + `aria-live` | Non-pointer reorder + announced state |
| Assessment fieldset/legend + live correctness/rationale | Evidence-consuming feedback done correctly |
| Guided-review confirmations + look-for/repair as **authored guidance** | Self-review without pretending Prism scored free text |
| Prose measure / document headings | Readable study content |

---

## 7. Accessibility constraints (interaction-derived)

Not a WCAG audit. Alpha baseline context: accessibility is a design constraint; remediation is not this sprint’s programme (S80-T-008).

| Preserve | Risk if future alternatives ignore it |
| -------- | ------------------------------------- |
| Native textareas for compose/table cells | Custom editors that break AT names/caret/keyboard |
| Native radios/checkboxes | Click-div “cards” without roles/state |
| Button-based ordering | Pointer-only drag without keyboard equivalent |
| Live regions for order/assessment/guided status | Silent state changes |
| Table row headers + cell accessible names | Grid/canvas without 2D navigation semantics |
| Linearisable content / reflow (incl. table scroll container) | Fixed-pixel canvases that don’t reflow |
| Focus-visible styles on workspace inputs | Undiscoverable keyboard focus |

---

## 8. Unknowns / evidence gaps

1. Live frequency of **guided** vs **flat** self-review on first-class Create→DLA→GAM output (cert lesson fixtures here were flat).  
2. Real learner/time-on-task data for large tables — fixture HTML shows cost, not observed abandonment.  
3. How often LA-order appears in routine first-class generation (S81-D-003).  
4. Short_answer/essay/multi-answer as interactive learner experience — not assessed (unsupported or unclear).  
5. Visual viewport behaviour on small screens for wide tables — CSS implies horizontal scroll; device testing not run in this task.  
6. Workshop vs self-study **experience** differences beyond voice — same surfaces (T-001); no separate UX gap evidenced.

---

## 9. Evidence-supported questions for the next task

1. For actions with **NONE/MINOR** headroom (study, select, typical compose, typical order), should candidate work explicitly prefer **retain current representation**?  
2. For **N1** (and N4), what **representation options** (including “retain linear document”) could improve co-availability of response + criteria **without** inventing automated diagnosis?  
3. For **N2**, is the need about **fewer/larger response units**, better orientation within the grid, or simply accepting high cell counts as pedagogical load?  
4. Should surface-family candidates be scoped **only** to actions/needs with MEANINGFUL headroom, rather than redesigning all six actions?  
5. How should uncertain emission of LA-order and guided review weight any candidate that assumes those actions are common?

---

## 10. Recommended next task (not executed)

### S81-T-004 — Candidate representation options for unmet interaction needs

- **Mode:** investigation / options only — still no product implementation; still no forced A/B/C/D pick.  
- **Input:** T-002 action model + this T-003 needs assessment.  
- **Job:** For each need N1–N4 (and explicitly for actions with NONE/MINOR headroom), list **candidate representation options** including **retain current**; map options to LA-* actions; state what pedagogical info / a11y strengths must be preserved; do **not** implement and do **not** invent a compose/table diagnostic engine.  
- **Out of scope:** selecting final A/B/C/D (later recommendation task); building widgets.

---

## 11. Acceptance check

| Question | Answer |
| -------- | ------ |
| What already works well? | Study, select, order (where present), compose/table as production affordances, attestation-shaped self-review, honest non-scoring of free text/tables |
| What is merely adequate? | Multi-field compose; flat checklists in linear flow for short activities |
| What creates friction? | Scroll distance between substantial production and criteria; many table cell fields; guided progressive review intensifying co-reference difficulty |
| What constrains learning design? | No **MATERIAL CURRENT CONSTRAINT** proven; costs are interaction/revision friction, not wrong pedagogy of text/table/self-check |
| What needs are unmet? | N1–N4 above — needs, not solutions |

---

## 12. Debt note

No new architectural debt beyond context already in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) (S81-D-001…D-007). T-003 **uses** D-001/D-003/D-005 as constraints; does not solve them.

---

## 13. Out of scope (confirmed not done)

Future surface-family design; cards/canvases/drag systems/split panes/new editors/new feedback engines; A/B/C/D recommendation; production code; WCAG remediation programme.
