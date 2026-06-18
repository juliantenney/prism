# Sprint 50 — Pedagogic Visibility Gap Analysis

**Mode:** Investigation only — no fixes proposed  
**Evidence corpus:** [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/)  
**Authoritative references:** [SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md](./SPRINT-50-PEDAGOGIC-MANIFESTATION-INVENTORY.md), [SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md](./SPRINT-50-INSTRUCTIONAL-FUNCTION-CLASSIFICATION.md), [SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md](./SPRINT-50-MINIMAL-INSTRUCTIONAL-MANIFESTATION-MODEL.md), [SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md](./SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md), [SPRINT-50-CURRENT-STATE.md](./SPRINT-50-CURRENT-STATE.md)

**Corpus artefacts traced:** `learning_activities.json` → `activity_materials.md` (GAM) → `page.json` → `page.html`

**Corpus age note:** Marx run2 predates Sprint 50 Phase 1B (compose persistence) and Phase 2 (instructional grammar). Where implementation has since changed behaviour, this document separates **run2 as observed** from **expected post-fix behaviour** when PEL fields survive compose and grammar rendering is active.

---

## 1. Executive Summary

PRISM already generates substantial pedagogic value for the Marx self-study workbook: rich GAM materials (exposition, worked examples, model outputs, practice tables, checklists, transfer prompts), complete task specifications, misconception guards, and mandatory DLA framing fields (`activity_preamble`, `reasoning_orientation`) on every activity. Page-level inquiry framing (`overview`, `learning_purpose_outcomes`) also survives compose and renders.

**The largest learner-visible loss in run2 is not generation failure — it is the break between DLA and authoritative `page.json`.** All five activities carry `activity_preamble` and `reasoning_orientation` in `learning_activities.json`, but **none** of these keys appear on activity rows in `page.json`. Because saved HTML is rendered from `page.json` without upstream merge, **zero** framing blocks (`util-activity-framing`, `util-activity-preamble`, `util-pel-reasoning-cue`, `util-cognition`) appear in run2 `page.html`. Learners open each activity at **What to do** with no *Why this activity* or *How to approach this* coaching.

**Second-largest loss is manifestation, not persistence:** even where GAM bodies and task fields are present, run2 HTML uses the **legacy render order** — Do → Materials → Output → Support — so learners meet task instructions **before** study content. Check and expected output are **split** (checklist in materials stack; `util-output-block` after the activity). Instructional function labels are absent. Journey Compass per-activity asides show progress metadata only; they do not compensate for missing PEL because compass field signals are built from row fields that were never persisted.

**What learners do receive** is a workable workbook: substantive exposition and models, practice surfaces, verification checklists, late-session transfer prompts, and page-level purpose. Study, Do, and Check **content** is largely present; Orient, Think, and Reflect **coaching** is thin or hidden; Transfer is present but only on final activities.

**Post-fix expectation (not verified on a fresh Marx run):** Phase 1B should persist PEL onto `page.json` rows; Phase 2 should surface them under grammar headings and reorder Study before Do. Remaining gaps after those fixes are predicted to be **content quality** (thin reasoning_orientation prose), **sparse optional generation** (self_explanation on A1 only; no page `study_tips`), and **weak cross-activity progression** (no `intellectual_coherence_bridge` generated).

---

## 2. Master Trace Table

Legend: **G** = Generated, **P** = Persisted in `page.json`, **R** = Rendered in run2 `page.html`, **LV** = Learner-visible, **EE** = Educationally effective.  
Ratings: **Yes** / **Partial** / **No**. Evidence summarised in the Notes column.

### 2A. Orient

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `activity_preamble` | Yes | No | No | No | No | All 5 DLA activities; absent every `page.json` row; text not in HTML (`foundation for the session` absent). Post-fix: P+R expected when compose merge runs. |
| `orienting_preamble` / `activity_framing` | No | No | No | No | — | Not generated in Marx run2; aliases only. |
| `study_orientation` | No | No | No | No | — | Not generated (first-activity page orient not emitted as row field). |
| `intellectual_frame` | No | No | No | No | — | Not in DLA OUTPUT for this brief. |
| `intellectual_coherence_bridge` | No | No | No | No | — | Not generated; learners get no explicit “what carries forward” between activities. |
| `prior_knowledge_activation` | Partial | No | No | No | No | A1 only in DLA (`Recall prior ideas…`); not persisted or rendered. |
| Page `overview` | Yes | Yes | Yes | Yes | Partial | Strong inquiry frame at page open; does not substitute per-activity why. |
| Page `learning_purpose_outcomes` | Yes | Yes | Yes | Yes | Yes | Capability arc visible once; adequate page-level Orient. |
| Page `knowledge_summary` | No | No | No | No | — | Section not composed for Marx run2. |
| Page `study_tips` | No | No | No | No | — | Epistemic closure section not composed. |
| Journey Compass header | — | — | Yes | Partial | Partial | Derived from overview + audience; 2 signal bodies (overview excerpt, session duration). |
| Journey Compass per-activity aside | — | — | Yes | Partial | Partial | Step label + duration only; **no** Orient/Think signals (PEL missing from rows). |

### 2B. Think

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `reasoning_orientation` | Yes | No | No | No | No | All 5 activities in DLA; thin one-line strings; not on `page.json` or HTML. |
| `conceptual_contrast_prompt` | No | No | No | No | — | Not generated. Contrast partly embedded in GAM `text` bodies. |
| `argument_structure_hint` | No | No | No | No | — | Not generated. |
| `evidence_use_prompt` | No | No | No | No | — | Not generated; evaluation activities rely on criteria tables instead. |
| `uncertainty_tension_prompt` | No | No | No | No | — | Not generated. |
| `disciplinary_lens` | No | No | No | No | — | Not generated. |
| `scaffold_hint_sequence` | No | No | No | No | — | Not generated. |
| `support_note` | Yes | Yes | Yes | Partial | Partial | Present all activities on row + HTML (`util-support-note`); rendered **after** output block, not as pre-check coaching; easy to miss. |
| GAM inline bridges / “Why this works” | Partial | Yes | Yes | Partial | Partial | Worked-example **Bridge:** and sample-output quality annotations carry implicit Think; not labelled as disciplinary guidance. |

### 2C. Study

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `materials.text` | Yes | Yes | Yes | Yes | Yes | A1–A2 exposition in `page.json` + HTML (`Historical Materialism as a Method`, etc.). |
| `materials.worked_example` | Yes | Yes | Yes | Yes | Yes | All applicable activities; `util-worked-example` blocks present. |
| `materials.sample_output` | Yes | Yes | Yes | Yes | Partial | A1 model answer + annotations in HTML; learner must infer when to consult it (task step 3 references it but Study follows Do in DOM). |
| `materials.scenario` | Yes | Yes | Yes | Yes | Yes | A3, A4 scenarios rendered. |
| `materials.reference_table` | Yes | Yes | Yes | Yes | Yes | Criteria tables in A4, A5 (`Inequality trends`, etc.). |
| `materials.analysis_table` | Yes | Yes | Yes | Yes | Partial | Content in HTML (`Stage of production`); practice tables appear **after** task instructions. |
| `materials.decision_table` | Yes | Yes | Yes | Yes | Partial | A4 decision table present; same ordering issue. |
| `materials.template` | Yes | Yes | Yes | Yes | Partial | A5 judgement memo template in HTML; follows task block. |
| `required_materials[]` (DLA spec) | Yes | No | No | No | — | Authoring channel only; learner sees GAM realisation — correct by design. |

### 2D. Do

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `learner_task` | Yes | Yes | Yes | Yes | Partial | Rendered first in every activity (`util-activity-task` before materials); learners told what to do before seeing what to read — **manifestation weakness**. |
| `expected_output` | Yes | Yes | Yes | Yes | Partial | In `util-output-block` **after** materials, separate from checklist — Check function split. |
| `purpose` (task cue) | No | No | No | No | — | Not on page rows. |
| Practice materials (tables, templates) | Yes | Yes | Yes | Yes | Partial | Present but encountered after task prose in legacy order. |

### 2E. Check

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `materials.checklist` | Yes | Yes | Yes | Yes | Partial | All 5 activities; `Self‑Check` headings in HTML; appears late in materials stack, after task. |
| `expected_output` (as success spec) | Yes | Yes | Yes | Partial | Partial | Separate **Output** block — success criteria not unified with checklist (legacy renderer). |
| `assessment_check` (page section) | No | No | No | No | — | Not composed (`assessment_strategy: none`). |
| Sample output quality annotations | Yes | Yes | Yes | Partial | Yes | “Why this works” in A1 educates on quality **if** learner reaches Study section after reading task. |

### 2F. Reflect

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `self_explanation_prompt` | Partial | No | No | No | No | A1 only in DLA; not persisted; no `util-cognition--explain` in HTML. |
| `materials.reflection_prompt` | No | No | No | No | — | Not in GAM for Marx run2. |
| `materials.consolidation_summary` | Yes | Yes | Yes | Yes | Partial | A5 only; prompt text in HTML (`take forward`); buried in materials after task; no dedicated Reflect section label. |
| Page `study_tips` | No | No | No | No | — | No session-level Reflect closure. |
| Pack fields (revision, repair, transformation) | No | No | No | No | — | `self_study_cognition_pack` only; no peer/misconception packs in this brief. |

### 2G. Transfer

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `materials.transfer_prompt` | Partial | Partial | Partial | Partial | Partial | A4, A5 only in GAM/`page.json`; rendered in HTML; A4 task step 6 references it; not labelled *Apply elsewhere* in run2. |
| `transfer_or_application_task` (row) | No | No | No | No | — | Not generated on DLA rows; transfer lives in GAM materials only. |
| `source_to_application_prompt` | No | No | No | No | — | Not generated. |

### 2H. Infrastructure (non-instructional by design)

| Structure | G | P | R | LV | EE | Notes |
| --------- | - | - | - | -- | -- | ----- |
| `mapped_learning_outcomes` | Yes | No | No | No | — | DLA traceability; correctly not learner-facing. |
| `facilitator_moves`, `failure_mode` | No | — | No | No | — | Self-directed path; not applicable. |
| `metadata.cognition_profile`, `generation_notes` | Partial | Yes | No | No | — | Compose trace only. |
| `visual_affordances[]` | No | Yes (empty) | No | No | — | Hooks present but hidden/disabled in export. |

---

## 3. Hidden Pedagogy Inventory

*Educational value **Generated = Yes** but **Learner-visible = Partial or No** in Marx run2.*

| Structure | Function | Hidden by | Evidence |
| --------- | -------- | --------- | -------- |
| `activity_preamble` (×5) | Orient | **Persistence** → rendering | DLA: all activities. `page.json`: key absent all rows. HTML: 0 `class="util-activity-preamble"` body nodes; DLA phrases absent. |
| `reasoning_orientation` (×5) | Think | **Persistence** → rendering | DLA: all activities. `page.json`: absent. HTML: 0 `util-pel-reasoning-cue` body nodes. |
| `prior_knowledge_activation` (A1) | Orient | **Persistence** → rendering | DLA only; not on row or HTML. |
| `self_explanation_prompt` (A1) | Reflect (pre-check) | **Persistence** → rendering | DLA only; no `util-cognition` blocks in HTML. |
| Per-activity Orient/Think via Compass | Orient / Think | **Persistence** (upstream) | Compass aside shows step meta only; field-derived signals not emitted when row PEL empty. |
| Instructional grammar sections | All functions | **Rendering** (corpus age) | 0 `util-instructional-section` in run2 HTML; grammar not active in exported artefact. |
| Study-before-Do ordering | Study / Do | **Manifestation** | DOM order all activities: `util-activity-task` → `util-activity-materials` → `util-output-block`. |
| Unified Check (checklist + output) | Check | **Manifestation** | Separate `util-output-block` after materials; checklist not co-located with success spec under one heading. |
| `support_note` coaching timing | Think / Support | **Manifestation** | Present but after output; functions as footnote not pre-task guard. |
| Page `study_tips` | Reflect (closure) | **Generation** (upstream) | Not composed in Design Page output for this run. |
| `intellectual_coherence_bridge` | Orient | **Generation** | Not in DLA for Marx brief. |
| Optional Think fields (`conceptual_contrast_prompt`, `evidence_use_prompt`, etc.) | Think | **Generation** | Not emitted by DLA for this corpus. |

**Primary hidden-by-persistence cluster:** mandatory PEL fields that pass DLA gate but never reach authoritative `page.json`, therefore cannot render from saved artefact.

**Primary hidden-by-manifestation cluster:** GAM and task content that **is** on `page.json` but legacy render order and split Check/Output weaken educational signalling even though bodies appear in HTML.

---

## 4. Weakly Manifested Pedagogy Inventory

*Learner-visible = Yes or Partial, but **Educationally Effective = Partial or No**.*

| Structure | Function | Weakness | Evidence |
| --------- | -------- | -------- | -------- |
| `reasoning_orientation` (content) | Think | One-line abstractions | e.g. A1: “Conceptual explanation using a structured analytical method.” — even if persisted, low coaching density. |
| `activity_preamble` (content) | Orient | Thin but valid | Single sentence per activity; orients topic not intellectual move. |
| `learner_task` as first block | Do | Task-before-study | Learners instructed to “read explanatory text” before text appears in reading order. |
| `materials.sample_output` | Check / Study | Implicit quality model | Annotations educate (“Why this works”) but no grammar label; easy to skip if learner starts writing after step 4. |
| `materials.checklist` | Check | Late placement | Verification after full materials scroll; not framed as unified success gate with `expected_output`. |
| `support_note` | Support | Low salience | Muted styling; end of activity; one sentence misconception guard. |
| `materials.transfer_prompt` | Transfer | Late + narrow | Only A4–A5; criteria referenced but transfer coaching not session-wide. |
| `materials.consolidation_summary` | Reflect | A5 only; unlabelled | Substantive prompt present but no *What to take away* heading in run2. |
| Page `overview` | Orient | Page-only | Strong session frame; does not answer “why this activity now?” per step. |
| Journey Compass | Orient | Progress without coaching | Step N of M visible; no truncated preamble/reasoning excerpts in run2. |
| GAM **Bridge:** lines | Think | Implicit | Embedded in worked examples; learner must infer methodological lesson. |
| Cross-activity progression | Orient | Absent | No bridge prose between A1→A2→…; learner infers arc from titles and page overview. |

---

## 5. Learner Inference Burden Analysis

Places where learners must **infer** rather than being explicitly coached.

| Inference | What learner must infer | What exists upstream | Gap |
| --------- | ------------------------ | -------------------- | --- |
| **Why** (per activity) | Purpose of each activity within the session arc | `activity_preamble` on every DLA row | Not persisted or rendered in run2; only page overview + activity titles |
| **How** (disciplinary thinking) | Which reasoning mode applies (conceptual, causal, evaluative, synthetic) | `reasoning_orientation` on every DLA row | Not persisted or rendered; partial substitute in GAM bridges |
| **How** (prior knowledge) | What to activate before A1 | `prior_knowledge_activation` (A1) | Hidden |
| **Quality** | What a strong explanation looks like | `sample_output` + annotations (A1) | Visible but after task; no pre-check self-explanation (A1 prompt hidden) |
| **Success** | Whether work meets standard | `expected_output` + checklist | Split across Output block and checklist; not unified Check section |
| **Mistakes to avoid** | Common errors | `support_note` | Present but low-salience placement |
| **When to reflect** | Generative step before model comparison | `self_explanation_prompt` (A1) | Hidden; task step 3 implies comparison but not metacognitive pause |
| **What to take away** | Session synthesis | `consolidation_summary` (A5), `study_tips` (missing) | Consolidation only on final activity; no page closure |
| **Transfer** | Applying criteria elsewhere | `transfer_prompt` (A4, A5) | Present late; learner infers transfer is optional capstone not session habit |
| **Reading order** | Read/model before doing | Instructional grammar (Study → Do) | Legacy order contradicts task numbering |

**Highest inference burden:** per-activity **why** and **how to think** (Orient + Think) — architecture generates owners; run2 learner experience does not surface them.

**Moderate inference burden:** **quality** and **success** — content exists in materials but reading order and split Check weaken explicit coaching.

**Lower inference burden:** **Study content** and **Do surfaces** — GAM delivery is substantively strong for Marx run2.

---

## 6. Generated Yes → Not Fully Visible: Root Cause Matrix

| Item | Persistence? | Rendering? | Manifestation? | Present but weak? |
| ---- | ------------ | ---------- | -------------- | ----------------- |
| `activity_preamble` | **Yes** | Secondary (needs row) | Secondary (grammar labels) | Partial (thin copy) |
| `reasoning_orientation` | **Yes** | Secondary | Secondary | **Yes** (thin copy) |
| `prior_knowledge_activation` | **Yes** | Secondary | — | — |
| `self_explanation_prompt` | **Yes** | Secondary | Secondary (pre-check section) | — |
| GAM study bodies | No | No | **Yes** (Do-before-Study) | Partial (ordering) |
| Checklists + expected_output | No | Partial (split blocks) | **Yes** | Partial |
| `support_note` | No | No | **Yes** (placement) | Partial |
| `transfer_prompt` | No | No | Partial | Partial (A4–A5 only) |
| `study_tips`, bridges, optional Think fields | N/A (not generated) | — | — | **Yes** (generation sparsity) |

---

## 7. Priority Ranking (Educational Impact)

| Rank | Issue | Impact | Dominant cause |
| ---- | ----- | ------ | -------------- |
| **P0** | Per-activity Orient (`activity_preamble`) invisible | Learners lack explicit why before each activity; undermines self-directed workbook model | Persistence |
| **P0** | Per-activity Think (`reasoning_orientation`) invisible | Learners lack explicit disciplinary stance; must infer from materials | Persistence |
| **P1** | Study-after-Do render order | Task steps reference unread content; contradicts workbook pedagogy | Manifestation (run2 legacy; Phase 2 addresses) |
| **P1** | Check / success spec split | Learners must connect checklist and output block themselves | Manifestation |
| **P2** | `self_explanation_prompt` hidden (A1) | Misses generative retrieval before model comparison | Persistence |
| **P2** | `prior_knowledge_activation` hidden (A1) | Misses activation before first concept activity | Persistence |
| **P2** | Reflect coverage sparse | Only A5 consolidation; no session `study_tips`; no reflection materials | Generation + manifestation |
| **P3** | Transfer only on A4–A5 | Transfer not normalised across session | Generation (GAM placement) |
| **P3** | Thin PEL prose | Even when visible, reasoning_orientation is one line | Content quality |
| **P3** | `support_note` salience | Misconception guards easy to miss | Manifestation |
| **P4** | No `intellectual_coherence_bridge` | Weak between-activity progression | Generation |
| **P4** | Optional Think fields absent | No explicit contrast, evidence-use, argument-structure coaching | Generation |

---

## 8. Architectural Assessment

| Layer | Verdict for remaining gaps |
| ----- | -------------------------- |
| **Generation (DLA/GAM/Design Page)** | **Partially adequate.** Mandatory PEL generated for all activities; GAM materials strong. Gaps: optional cognition fields sparse (`self_explanation` A1 only); no `study_tips`, `knowledge_summary`, or `intellectual_coherence_bridge`; transfer as material not row field. |
| **Persistence (compose)** | **Primary failure in run2.** `mergeLearnerPageActivityFramingFieldsIntoPageActivities` path exists but Marx run2 `page.json` rows omit all PEL/cognition keys while preserving `learner_task`, `support_note`, `materials`. Phase 1/1B implemented to fix; **fresh-run verification still open** (per CURRENT-STATE P0). |
| **Rendering** | **Secondary failure in run2.** Renderer can surface PEL when on rows; run2 export shows 0 framing/cognition body nodes because rows lack fields. Phase 2 grammar adds section labels and ordering when active. |
| **Manifestation** | **Significant even when content present.** Legacy order (Do → Materials → Output), split Check, low-salience support notes, compass without field signals. Phase 2 targets this layer for grammar-enabled pages. |
| **Content quality** | **Residual after architecture fixes.** `reasoning_orientation` strings are terse; preambles are single-sentence; not a persistence/render bug but limits educational effectiveness when made visible. |

**Summary answer to the success criterion:**

> *What pedagogic value does PRISM already possess that learners are still not fully experiencing?*

1. **Mandatory activity orientation and reasoning coaching** — fully generated in DLA, lost at compose persistence in run2, therefore entirely absent from learner HTML.  
2. **Pre-check metacognition** (`self_explanation_prompt`, `prior_knowledge_activation`) — generated for A1, same persistence break.  
3. **Instructional reading order and function signalling** — rich GAM Study and Check content is on the page but legacy manifestation presents Do first and splits success criteria.  
4. **Session Reflect closure and cross-activity bridges** — not generated for this brief (`study_tips`, coherence bridges).  
5. **Coaching density** — even fields that would become visible are often thin one-liners; educational effectiveness would remain Partial without richer upstream prose.

**Post Phase 1B + Phase 2 (expected, not run2-proven):** items 1–3 should largely move from Hidden to Visible; items 4–5 remain as generation quality and optional-field coverage gaps.

---

## 9. Focus Area Summaries

### Orient

Upstream: strong page-level (`overview`, `learning_purpose_outcomes`); strong activity-level in DLA (`activity_preamble` ×5, `prior_knowledge_activation` A1). Learner receives page Orient once; **does not** receive per-activity Orient or prior-knowledge activation in run2. Compass provides step progress, not purpose coaching.

### Think

Upstream: `reasoning_orientation` all activities; `support_note` misconception guards; implicit bridges in GAM. Learner receives support notes weakly; **does not** receive explicit reasoning_orientation, conceptual contrast, evidence-use, or argument-structure coaching.

### Study

Upstream and persistence: strong — text, worked examples, scenarios, tables, templates in `page.json` and HTML. Learner receives substantive models **but** often after task instructions; educates on content, not always on when/how to use models in workflow order.

### Check

Upstream: checklists all activities; `expected_output` all activities; A1 sample with quality annotations. Learner can determine success **with effort** — criteria exist but are not unified or optimally placed; must infer relationship between Output block and Self‑Check lists.

### Reflect

Upstream: sparse — `self_explanation_prompt` (A1), `consolidation_summary` (A5 material). Learner sees A5 consolidation prompt in materials; no labelled Reflect section; no session study tips; no self-explanation block.

### Transfer

Upstream: `materials.transfer_prompt` A4, A5; learner task on A4 references transfer. Learner receives transfer prompts on late activities; transfer is not explicit across earlier analytical activities; no row-level `transfer_or_application_task`.

---

## 10. Evidence Index (Marx run2)

| Check | Result |
| ----- | ------ |
| DLA `activity_preamble` on A1–A5 | Present all |
| `page.json` `activity_preamble` on any row | Absent all |
| HTML `class="util-activity-preamble"` (body) | 0 |
| DLA `reasoning_orientation` on A1–A5 | Present all |
| `page.json` `reasoning_orientation` | Absent all |
| HTML `class="util-pel-reasoning-cue"` (body) | 0 |
| HTML `class="util-instructional-section"` | 0 (pre-grammar export) |
| Activity DOM order (all 5) | task → materials → output → support |
| Page sections composed | `overview`, `learning_purpose_outcomes`, `learning_activities` only |
| GAM material types in corpus | text×2, worked_example×3, sample_output×1, checklist×5, analysis_table×2, scenario×2, reference_table×2, decision_table×1, transfer_prompt×2, template×1, consolidation_summary×1 |
| Materials in HTML (spot checks) | Exposition, worked examples, sample output, tables, template, transfer, consolidation text present |
| PEL phrase spot checks in HTML | `foundation for the session`, `structured analytical method`, `Which step in the worked`, `Recall prior ideas` — all absent |

---

*Investigation artefact — Sprint 50. No solutions recommended. Verify P0 persistence and grammar manifestation on a post–Phase 1B Marx workflow export before treating rows 1–3 in §8 as closed.*
