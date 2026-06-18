# Sprint 51 — Annotated Models Audit

**Mode:** Investigation only — no architecture proposals  
**Question:** Does PRISM show learners (a) what good work looks like, or (b) what good work looks like **and** why it is good?  
**Evidence:** Runtime architecture (`lib/page-role-registry.js`, `lib/instructional-pattern-prompt.js`, `lib/ld-instructional-manifestation-render.js`, `app.js` renderer); Sprint 44-2 depth contracts; Marx run2 corpus; fresh verification run `2026-06-18-marx-self-study`

---

## Executive answer

PRISM **can** deliver both (a) and (b), but **does not guarantee** either.

| Mode | Status |
| ---- | ------ |
| **(a) What good work looks like** | **Supported** — `worked_example`, `sample_output`, partial table/template rows, and `expected_output` routinely show modelled process or product |
| **(b) Why it is good** | **Partially supported** — quality commentary is **embedded in GAM markdown bodies** (`**Why this works:**`, weak/strong judgement prose, exemplar-row explanations), not in a dedicated schema field or renderer annotation layer |

The system is architected for **annotated exemplars inside material bodies**. There is **no separate learner-facing field** for quality commentary. When annotations are absent or thin, learners see models without explicit expert judgement.

---

## Origin → manifestation pipeline

```
Episode Plan (instructional-function beats)
  → DLA: required_materials[] + learner_task + expected_output
  → GAM: activity_materials.md (full material bodies)
  → Design Page compose: page.json materials.* (+ activity-row fields)
  → Renderer: instructional grammar sections (Study / Do / Check)
  → page.html: util-worked-example, util-checklist-block, tables, prose
```

**Authoring channel:** DLA `required_materials[]` specifies *type*, *purpose*, and *specification* — not the exemplar body.  
**Realisation channel:** GAM generates bodies under SP-01–SP-06 pattern blocks and PEL reasoning material prompts.  
**Storage:** All model/exemplar bodies live in `page.json` → `learning_activities[].materials.<key>` (string markdown).  
**No parallel JSON sub-object** exists for annotations vs model text.

---

## Structure inventory

### 1. `worked_example`

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `required_materials.type: worked_example`; GAM realises as `Material: … (worked_example)` |
| **Role registry** | `worked_example`, `worked_calculation`, `worked_analytic_pass`, or `worked_judgement_support` (by `purpose` regex) — `lib/page-role-registry.js` |
| **Learner-facing output** | Numbered steps, intermediate reasoning, completed instance on a **distinct** item from the learner task |
| **Renderer** | `util-worked-example util-material-role-model`; heading *Worked example* (or role-specific); Sprint 50 grammar → **Read and model** section |
| **Quality explicitly explained?** | **Sometimes** — SP-06 requires visible step reasoning + `**Bridge:**`; 44-2 strong realisation includes step→meaning pairs and weak/strong contrast for evaluate arcs |
| **Expert judgement visible?** | **Process judgement** (how to think step-by-step), not product-quality rubric. When `purpose` matches worked judgement, body may include weak vs strong — see §6 |
| **Existing field for quality commentary?** | **Material body only** — markdown subsections (`**Bridge:**`, step labels, inline *because* reasoning). No `annotations[]` field |

**Marx run2 A1:** Four-step historical-materialism walkthrough + Bridge — shows **method**, not annotated product quality.  
**Marx run2 A2/A3:** Step chains + Bridge — same pattern.  
**Fresh run Activity 3:** Thin worked example (steps + embedded checklist) — **(a) yes, (b) minimal**.

---

### 2. `sample_output` (incl. `model_answer`, `model_calculation` roles)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `required_materials.type: sample_output`; GAM `Material: … (sample_output)` |
| **Role registry** | `sample_output`, `model_answer`, or `model_calculation` by purpose — canonical storage key remains `sample_output` |
| **Learner-facing output** | Full exemplar response/product for a parallel (non-spoiler) item; often blockquoted or section-headed |
| **Renderer** | Generic material prose under *Sample output* heading; grammar places in **Study** (pre-check) or **Check** (post-attempt) per `partitionActivityMaterialsForGrammar` |
| **Quality explicitly explained?** | **When GAM authors it** — 44-2 §5.5 requires annotations where possible; Marx run2 A1 includes explicit `**Why this works:**` bullet list + “Use this as a quality guide, not as text to copy” |
| **Expert judgement visible?** | **Yes, when annotated** — lists quality features (“Begins with material conditions”, “Avoids economic determinism”) |
| **Existing field for quality commentary?** | **Material body only** — convention-based markdown (`**Why this works:**`, “strong because…”). No SP pattern in `instructional-pattern-prompt.js` (unevaluated in Sprint 44–45; generation is prompt-contract + 44-2, not SP-07) |

**Marx run2 A1:** Strongest **(b)** example in corpus — annotated sample explanation.  
**Fresh run:** No `sample_output` on `page.json` for inflation activities — DLA obligations not fully realised in that run.

---

### 3. `modelling_note` / `reasoning_support`

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `required_materials.type: modelling_note` |
| **Role registry** | Default `reasoning_support` (*Modelling note*); if `purpose` matches `/worked judgement/i` → `worked_judgement_support` → canonical `worked_judgement_weak_strong` |
| **Learner-facing output** | Expert think-aloud: criteria, checks, decision order; strong realisation = weak vs strong contrast |
| **Renderer** | Material prose in **Read and model**; judgement variant heading *Worked judgement (weak vs strong)* when role precedence applies |
| **Quality explicitly explained?** | **Intended yes** — 44-2 §5.3: decision rules, criterion application, weak/strong evaluation |
| **Expert judgement visible?** | **Primary architecture slot** for evaluative judgement visibility |
| **Existing field for quality commentary?** | **Body markers** enforced in `page-role-fidelity.js` / `gam-output-format.js`: `weak_worked_judgement`, `strong_worked_judgement` — semantic content in markdown, not separate fields |

**Marx run2:** A4 uses criteria `reference_table` + `decision_table` exemplar row instead of full M14-style weak/strong note in the excerpted materials.  
**Fresh run A2:** DLA specifies `modelling_note`; learner_task references it; **body absent** from composed `page.json` — generation/compose gap, not missing architecture.

---

### 4. `worked_judgement_weak_strong` (canonical judgement material)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | GAM `modelling_note` or `worked_example` when purpose = worked judgement; merged to canonical key via role registry |
| **Learner-facing output** | Side-by-side or sequential weak vs strong exemplar responses with criteria-linked reasoning |
| **Renderer** | Same as modelling_note / worked_example; heading *Worked judgement (weak vs strong)* |
| **Quality explicitly explained?** | **Yes, by design** — body markers require both weak and strong patterns |
| **Expert judgement visible?** | **Yes** — clearest existing structure for “why one response is better” |
| **Existing field for quality commentary?** | Entire body is commentary; markers validated, not stored separately |

**Workbook corpus (38L/38M):** Full weak/strong bodies (~1050 chars) when GAM + compose preserve.  
**Marx run2 / fresh inflation run:** Often **absent or thin** despite DLA specs — coverage is **generation-dependent**.

---

### 5. `decision_table` / `guided_judgement_table` (partial exemplar row)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `decision_table`; GAM SP-02 |
| **Learner-facing output** | Table with **one exemplar row** modelling evidence → reasoning; judgement/rating columns empty on all rows |
| **Renderer** | `util-table-scroll util-material-table` in **What to do** (grammar) or materials stack (legacy) |
| **Quality explicitly explained?** | **Partial** — exemplar *Explanation* cell shows expert reasoning for one criterion; not labelled “why this is strong” |
| **Expert judgement visible?** | **Implicit** — learner infers quality from populated evidence/reasoning cells |
| **Existing field for quality commentary?** | Table cell content only; marker `guided_table_exemplar` in fidelity layer |

**Marx run2 A4:** One row with evidence + explanation (“Suggests limits to immiseration thesis”) — **(a)+(b) for one criterion only**.

---

### 6. `template` / `independent_judgement_template` (faded / partial model rows)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `template`; GAM realises scaffold with blank learner cells |
| **Learner-facing output** | Structure of a strong response (sections, rating slots, justification prompts) — sometimes one pre-filled exemplar row per SP-02 / fading rules |
| **Renderer** | `util-template-block util-material-role-practice` in **What to do** |
| **Quality explicitly explained?** | **Rarely** — shows form, not annotated quality |
| **Expert judgement visible?** | **Structural** — “what good looks like” as shape, not scored exemplar |
| **Existing field for quality commentary?** | Section labels and pre-filled model rows in markdown body |

---

### 7. `reference_table` / criteria exposition (quality framework, not exemplar)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `text` or table materials with criteria purpose |
| **Learner-facing output** | Dimensions of quality (“What to look for”) without a completed learner product |
| **Quality explicitly explained?** | **Defines criteria**, not exemplar quality |
| **Expert judgement visible?** | **Framework only** — supports later judgement; not a model answer |
| **Commentary field?** | N/A — not an annotated model |

Included because learners often conflate criteria tables with exemplars; architecturally they are **Orient/Study**, not Check exemplars.

---

### 8. `expected_output` (activity row — deliverable spec)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA activity row |
| **Learner-facing output** | Observable success description (“Completed classification matrix…”, “≥80 words…”) |
| **Renderer** | Sprint 50 grammar → inside **Check your work** (`util-check-expected-output`); legacy → `util-output-block` |
| **Quality explicitly explained?** | **Structural only** — what to produce, not why a instance is strong |
| **Expert judgement visible?** | **No** — success shape, not exemplar |
| **Commentary field?** | Could hold prose, but convention is deliverable spec, not annotation |

---

### 9. `checklist` / `verification_checklist`

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `checklist`; GAM SP-05 |
| **Learner-facing output** | Criteria-linked verification items + “If any check is not met” remediation |
| **Renderer** | `util-checklist-block` in **Check your work** |
| **Quality explicitly explained?** | **Indirect** — defines quality checks, not a model response |
| **Expert judgement visible?** | **Rubric-like** — “Have you linked evidence to criteria?” teaches what experts notice without showing an exemplar |
| **Commentary field?** | Checklist body only |

---

### 10. `self_explanation_prompt` (activity row — generative, not exemplar)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA cognition fields |
| **Learner-facing output** | Prompt for learner to articulate reasoning before consulting model/check |
| **Renderer** | **Explain before you check** section (grammar) |
| **Quality explicitly explained?** | **No** — elicits learner judgement; does not show expert model |
| **Expert judgement visible?** | **Metacognitive** — supports calibration, not demonstration |
| **Commentary field?** | Row field; could theoretically hold coach text, but used as learner prompt |

---

### 11. `support_note` (activity row — inverse quality)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | DLA `support_note` |
| **Learner-facing output** | Misconception guard / common error |
| **Renderer** | **Watch for this mistake** (grammar) |
| **Quality explicitly explained?** | **Negative exemplar** — what to avoid, not what strong work looks like |
| **Expert judgement visible?** | Partial — expert “what not to do” |

---

### 12. Assessment items (`assessment_check` section)

| Attribute | Detail |
| --------- | ------ |
| **Origin** | Composed page assessment section |
| **Learner-facing output** | MCQ / items; optional `explanation` when feedback mode allows |
| **Renderer** | `util-assessment-explanation` when present |
| **Quality explicitly explained?** | **Per-item**, when explanations generated — “why B is correct” |
| **Expert judgement visible?** | Item-level, not activity deliverable quality |
| **Fresh Marx run:** Formative items **without** answer explanations in export |

---

### 13. Contract types not in runtime role registry

Sprint 44-2 documents but **does not wire** to `page-role-registry.js`:

| Type | 44-2 intent | Runtime status |
| ---- | ----------- | -------------- |
| `rubric` | Quality dimensions + levels | **No GAM role / renderer heading** — would appear as generic material if generated |
| `quality_criteria` | Explicit quality features | Same |
| `misconception_note` | Error pattern + repair | Same |

These could carry quality commentary **as markdown bodies** if DLA listed them and GAM generated them — no dedicated annotation channel today.

---

## Summary matrix

| Structure | Shows what good looks like (a) | Explains why it is good (b) | Quality commentary carrier |
| --------- | ------------------------------ | ----------------------------- | -------------------------- |
| `worked_example` | **Yes** (process model) | **Partial** (step reasoning, Bridge) | Markdown body |
| `sample_output` | **Yes** (product model) | **Yes when annotated** (`Why this works`) | Markdown body |
| `modelling_note` | **Partial** (decision rules) | **Yes when strong** | Markdown body |
| `worked_judgement_weak_strong` | **Yes** (contrast exemplars) | **Yes** (weak vs strong) | Markdown body + fidelity markers |
| `decision_table` exemplar row | **Partial** (one row) | **Partial** (Explanation cell) | Table cell |
| `template` (faded) | **Structural** | **Rarely** | Pre-filled rows in body |
| `expected_output` | **Spec only** | **No** | Deliverable description |
| `checklist` | **Criteria checks** | **Indirect** | Checklist items |
| `reference_table` | **Criteria framework** | **No exemplar** | Table prose |
| `self_explanation_prompt` | **No** | **Elicits learner** | Row field |
| `support_note` | **Anti-pattern** | **Partial** (what to avoid) | Row field |
| `rubric` / `quality_criteria` | **Contract only** | **Intended** | Not runtime-registered |

---

## Where explanatory commentary could be added (existing structures only)

No new fields required — commentary is already specified to live **inside material bodies**:

| Mechanism | Already specified | Example convention |
| --------- | ----------------- | ------------------ |
| GAM `sample_output` body | 44-2 §5.5 strong realisation | `**Why this works:**` bullet list (Marx run2 A1) |
| GAM `worked_example` body | SP-06 + 44-2 §5.2 | Step labels + `**Bridge:**` + because/so reasoning between steps |
| GAM `modelling_note` / judgement | 44-2 §5.3 + body markers | Weak/Strong evaluation sections |
| GAM `decision_table` | SP-02 | Exemplar row Evidence + Explanation cells |
| GAM `checklist` | SP-05 | Criteria-linked checks + remediation block |
| DLA `expected_output` | Possible but **wrong semantic** | Would blur deliverable spec with exemplar |
| Activity-row Think fields | `reasoning_orientation`, `evidence_use_prompt` | Disciplinary framing, not product annotation |

**Renderer:** No separate annotation parser — markdown subheadings render as plain prose in `util-worked-example` / material blocks. Commentary visibility is **entirely a generation + salience** question within existing bodies.

---

## Corpus comparison

| Corpus | Worked examples | Sample outputs | Annotated quality (`Why this works` / weak-strong) |
| ------ | --------------- | -------------- | ------------------------------------------------ |
| **Marx run2** | A1–A3 substantive step models | A1 annotated sample | A1 **(b)**; A4 table exemplar row partial **(b)**; no full weak/strong note in export |
| **Fresh 2026-06-18 run** | Activity 3 thin WE; A1–A4 DLA rows reference modelling/judgement | **None on page.json** | **Mostly (a) only**; tasks reference expert modelling not present in materials |

---

## Success criterion determination

### Does PRISM show learners what good work looks like?

**Yes — architecturally and often in practice.**

- Worked examples, sample outputs, partial table rows, and templates are first-class GAM material types with compose preservation and renderer support.
- Sprint 50 grammar places Study materials before Do, improving access to models.

**Caveat:** Generation and compose fidelity determine whether models are **substantive** or thin procedural stubs.

### Does PRISM show learners what good work looks like **and why it is good?

**Sometimes — not by default.**

- The **only established pattern** for explicit product-quality annotation in the architecture is **markdown inside `sample_output`** (e.g. `**Why this works:**`) and **weak/strong bodies** in `worked_judgement_weak_strong` / judgement-purpose `modelling_note`.
- Worked examples teach **process** (steps + Bridge) more reliably than **product quality**.
- Checklists and `expected_output` define verification and shape, not annotated exemplars.
- No dedicated annotation field, renderer callout, or SP pattern guarantees quality commentary on every model.

**Verdict:** PRISM operates at **(a) with optional (b)** embedded in material prose. It does **not** systematically deliver **(b)** across all annotated-model structures.

---

## Implications for Sprint 51 (orientation only)

1. **Annotated models are a generation and body-authoring problem first** — structures exist; commentary conventions are prompt/contract-driven, not schema-driven.
2. **`sample_output` and `worked_judgement_weak_strong` are the natural carriers** for “why it is good” without new fields.
3. **`worked_example` carries “how to do it”** more than “why this product is strong” — distinct instructional jobs per 44-2 §6.1.
4. **Renderer treats annotations as plain markdown** — if (b) is weak, cause is usually missing/thin GAM body content, not missing render capability.
5. **`rubric` / `quality_criteria`** remain contract-level types — unused in current role registry and Marx corpora.

---

*Audit v1 — investigation only; no architecture changes proposed.*
