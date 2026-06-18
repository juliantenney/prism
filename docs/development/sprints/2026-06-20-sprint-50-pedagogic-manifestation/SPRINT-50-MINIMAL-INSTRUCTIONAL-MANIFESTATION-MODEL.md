# Sprint 50 — Minimal Instructional Manifestation Model

**Status:** Manifestation design — validated grammar, minimal learner experience  
**Authority:** Inventory, classification, and hypothesis documents in this sprint folder  
**Assumptions (fixed):** Orient → Think → Study → Do → Check → Reflect → Transfer; Activity Flow vs Companion Guidance  
**Mode:** Learner experience only — no implementation, code, CSS, or architecture

---

# Executive Summary

The **simplest viable manifestation model** is a **single-column instructional document** per activity in which:

1. **Page-level Companion** establishes inquiry once (Orient).
2. **Activity entry Companion** answers why and how to think (Orient + Think) — read at the start, not re-encountered.
3. **Activity Flow** runs in **fixed function order**: Study → Do → Check → (Reflect) → (Transfer) — with optional Reflect-before-Check when generative retrieval precedes model comparison.
4. **One primary owner** per function per activity — no duplicate signals across Compass, framing block, cognition block, and materials.
5. **Function labels** (plain-language section purposes) make the grammar visible even without layout styling.

This is **not** a two-column UI model. Companion Guidance means **coaching content that precedes and frames the workflow**, not a persistent sidebar. In the minimal model, “alongside” means **available before the learner commits to the task sequence** — not parallel chrome during completion.

The smallest manifestation shift needed: **make function order explicit in what the learner reads**, collapse duplicate Orient/Think channels, and **place Study before Do** in the activity narrative. No new pedagogy; no new fields.

---

# Instructional Sequence

## Page journey (once)

Before any activity, the learner encounters **page-level Orient**:

- What is this resource about? (inquiry, stakes)
- What will I be able to do by the end? (capability arc)

Optional page-level **Reflect closure** after all activities (`study_tips`) — synthesis of the whole session, not per-activity.

Between activities, a **single Orient bridge** (one sentence: what carries forward) replaces repeated orientation prose.

---

## Activity journey (repeat per activity)

Not every activity contains every function. When present, the learner meets them in this order:

```
1. ORIENT   — Why am I doing this activity?
2. THINK    — How should I approach it intellectually?
3. STUDY    — What should I read, observe, or model?
4. REFLECT* — What should I articulate before checking? (optional; only when generative step precedes model/check)
5. DO       — What am I asked to produce or complete?
6. CHECK    — How do I know I have succeeded?
7. REFLECT  — What have I learned from this? (optional; after work)
8. TRANSFER — Where else does this apply? (optional; often final activity only)
```

\*Reflect-before-Check is a **branch**, not a universal stage. It appears when the instructional design requires explanation in the learner’s own words **before** consulting a model answer or checklist.

**Logistics** (duration, grouping) are metadata — visible but not part of the instructional grammar.

---

## What the learner sees first

| Scope | First encounter |
| ----- | ---------------- |
| **Page** | Governing inquiry and learning purpose (Orient) |
| **Activity** | Activity title, then **Why this activity** (Orient), then **How to approach this** (Think) |
| **Workflow** | Study content before task instructions |

The learner should **not** meet “What to do” before they have been oriented and shown what to read or model — unless the activity is intentionally task-only (rare; not the Marx workbook norm).

---

## What appears alongside the activity

In the **minimal model**, almost nothing persists in parallel.

**“Alongside” reduces to:**

- A **one-line inquiry position** optional at activity open (“Step 2 of 5 — distinguishing mechanisms from outcomes”) — Orient only, not a full signal dashboard.
- **Short Think reminders** only when the activity is long and error-prone (misconception guard near Check) — not a second column.

**Journey Compass** (in current architecture) re-lists Orient/Think/Reflect/Transfer as truncated duplicates. In the minimal model, Compass **collapses to page Orient + optional step label** — it does not compete with activity-owned signals.

---

## What appears inside the activity flow

Everything required to **complete** the activity:

| Inside flow | Functions |
| ----------- | --------- |
| Read/model blocks | Study |
| Scenarios, exposition, worked examples, sample outputs (as models) | Study |
| Practice tables, templates, decision surfaces | Do |
| Task steps | Do |
| Checklists, expected output | Check |
| Reflection prompts, consolidation | Reflect |
| Transfer prompts | Transfer |

Embedded Think cues inside Study materials (bridges, inline cognition labels) **stay inside Study blocks** — they do not appear as separate global sections.

---

## Persistent vs once-and-left-behind

| Persistent during task completion | Encountered once, then left behind |
| --------------------------------- | -------------------------------- |
| The **Do** surface being worked on (table, template, task list) | Page overview and learning purpose |
| **Check** checklist while revising | Activity preamble (Orient) |
| Optional **scaffold hints** only if actively needed mid-task | Reasoning orientation (Think) — assumed internalised at entry |
| | Prior-knowledge activation |
| | Intellectual coherence bridge (absorbed at transition) |
| | Study exposition and worked examples (read before doing; not re-read unless learner chooses) |
| | Transfer (typically closing move) |

**Principle:** Companion functions are **front-loaded**. Activity Flow functions are **progressive** — the learner moves through them and does not return to Orient/Think unless starting a new activity.

---

# Function Manifestation Table

| Function | Learner Purpose | Manifestation Role | Companion or Activity |
| -------- | --------------- | ------------------ | --------------------- |
| **Orient** | Why am I doing this? | Establishes significance, connection to inquiry, and position in the journey | **Companion** (page + activity entry) |
| **Think** | How should I approach this intellectually? | Names reasoning stance, distinctions, evidence discipline, uncertainty | **Companion** (activity entry); short guard near Check only when needed |
| **Study** | What should I observe, read, or model? | Exposition, scenarios, worked examples, analytic passes, model outputs used as models | **Activity Flow** |
| **Do** | What am I being asked to do? | Task steps and completion surfaces (tables, templates, prompts as work) | **Activity Flow** |
| **Check** | How do I know I have done it well? | Checklists, criteria, expected output, verification against model | **Activity Flow** |
| **Reflect** | What have I learned? | Self-explanation, consolidation, explicit reflection prompts | **Activity Flow** (position: before Check OR after Check — never both unless clearly labelled) |
| **Transfer** | Where else does this apply? | Extended application to new context | **Activity Flow** (typically last in activity or page) |

---

# Reading Order Model

## Ideal linear sequence (single column)

Each activity reads as a **numbered instructional story**:

```
[Activity title]

Why this activity
  … activity_preamble; purpose; bridge from previous step …

How to approach this
  … reasoning_orientation; key distinction; argument/evidence cues …

Read and model
  … text → worked example → scenario (as needed) …
  … sample output ONLY when positioned as model before learner attempt …

[Optional] Explain before you check
  … self_explanation_prompt when design requires generative step first …

What to do
  … learner_task …
  … practice tables / templates / decision surfaces …

Check your work
  … checklist …
  … expected output …

What to take away
  … reflection / consolidation (if present) …

Apply elsewhere
  … transfer prompt (if present) …

[Optional] Common mistake
  … support_note — one short Think guard, only if not redundant with checklist …
```

## Page wrapper (before activity list)

```
[Title]

Inquiry
  … overview …

What you will develop
  … learning purpose …

[Optional] Key ideas preview
  … knowledge_summary …

Activities
  … each activity in ideal sequence above …

[Optional] What should now be clearer
  … study_tips …
```

## Learner questions mapped to order

| Question | Where answered in sequence |
| -------- | -------------------------- |
| Why am I doing this? | Orient — first blocks |
| How should I think about it? | Think — before Study |
| What do I do first? | First Study block, then first Do step |
| What do I do next? | Subsequent Study → Do → Check stages in order |
| How do I know I have succeeded? | Check section |
| What should I take away? | Reflect (and page `study_tips`) |
| Where else does this apply? | Transfer (when present) |

---

# Companion Guidance Model

## Which functions belong in Companion Guidance?

| Function | In Companion? | Why |
| -------- | ------------- | --- |
| Orient | **Yes** | Frames the activity without being a step to complete |
| Think | **Yes** | Coaching stance — supports interpretation of Study and Do |
| Study | **No** | Learner must engage with content to complete the activity |
| Do | **No** | The activity itself |
| Check | **No** | Verification is part of completion |
| Reflect | **No** (default) | Reflection is a generative act — part of flow; exception: page-level `study_tips` is Companion closure |
| Transfer | **No** | Application task is a completion act |

## Why Companion must not interrupt

Companion content answers **interpretive** questions (“why”, “how to think”). If it is **re-inserted** between Do and Check, or **duplicated** in a side column while the learner works, it competes with Activity Flow and obscures signal ownership.

**Minimal rule:** Companion is **front matter for the activity** — read before Study begins. The only Companion exception during flow is a **single short Think guard** (`support_note`) adjacent to Check when misconception risk is high — framed as “watch for this error”, not a second orientation.

## Page-level Companion

- `overview`, `learning_purpose`, `knowledge_summary` (preview only), `learning_sequence` (journey map)
- These are **read once** at page entry
- They do not repeat inside each activity

---

# Activity Flow Model

## Which functions belong in Activity Flow?

| Function | In Activity Flow? | Why |
| -------- | ----------------- | --- |
| Orient | **No** (except step label) | Significance belongs in Companion entry |
| Think | **No** (except inline Study bridges) | Global Think belongs in Companion; material-inline Think stays with the material it annotates |
| Study | **Yes** | Core read/model phase |
| Do | **Yes** | Core completion phase |
| Check | **Yes** | Core verification phase |
| Reflect | **Yes** | Generative consolidation |
| Transfer | **Yes** | Applied completion |

## Internal Study → Do → Check ordering

Within materials, **Study types precede Do types**:

1. Exposition and scenario (read)
2. Worked example / analytic pass (model)
3. Learner task reference and practice surfaces (do)
4. Checklist and expected output (check)

When `learner_task` enumerates steps (“1. Read… 2. Study… 3. Write…”), the **manifestation must not contradict** the flow by rendering Do heading above Study bodies.

## Optional functions

- **Reflect-before-Check:** Only when `self_explanation_prompt` (or equivalent) requires articulation before model/check exposure.
- **Transfer:** Usually one per page or final activity — not every activity.
- **Reflect-after-Check:** `consolidation_summary`, `reflection_prompt` — after Check, before Transfer.

---

# Signal Ownership

One **primary learner-facing owner** per function per activity. Secondary sources defer or merge into the owner.

| Function | Primary owner | Secondary (subordinate) |
| -------- | ------------- | ------------------------ |
| **Orient** (page) | `overview` + `learning_purpose` | `knowledge_summary` (preview); Compass `governing_inquiry` |
| **Orient** (activity) | `activity_preamble` | `intellectual_coherence_bridge`; `purpose`; step label only in Compass |
| **Think** | `reasoning_orientation` | `conceptual_contrast_prompt`, `argument_structure_hint`, `evidence_use_prompt`, `uncertainty_tension_prompt`, `disciplinary_lens`, `intellectual_frame` — **merge into one “How to approach this” block** |
| **Study** | Ordered `materials` Study types (`text`, `worked_example`, `scenario`, `worked_analytic_pass`) | `sample_output` when used as model; `modelling_note`; inline cognition in material bodies |
| **Do** | `learner_task` | Practice materials (`analysis_table`, `decision_table`, `template`, `prompt_set` as work) |
| **Check** | `materials.checklist` | `expected_output`; `sample_output` when used as quality exemplar after attempt |
| **Reflect** | `materials.reflection_prompt` or `materials.consolidation_summary` | `self_explanation_prompt` when post-work; pack `reconciliation_prompt` |
| **Reflect** (page closure) | `study_tips` | — |
| **Transfer** | `materials.transfer_prompt` | `transfer_or_application_task` (row cue subordinate when material exists) |
| **Think guard** | `support_note` | Inline checklist “if not met, revise” lines (subordinate to Check) |

**De-duplication rules (minimal model):**

- Journey Compass does **not** re-own Orient/Think/Reflect/Transfer — page Orient + optional step label only.
- Row cognition block and framing block do **not** both surface the same function — merge into Companion entry.
- `transfer_or_application_task` and `materials.transfer_prompt` — **material wins** when both exist.

---

# Accessibility Review

## Would the model remain coherent as a single-column linear document?

**Yes — by design.**

The minimal model is **defined as** a linear document. Every instructional function appears as a **sequential section with a plain-language heading** (or equivalent semantic structure). No function depends on:

- two-column layout
- sidebar Compass
- badge chrome
- colour or icon alone

If all styling were removed, the learner would still read:

1. Inquiry (page)
2. For each activity: Why → How to think → Read/model → Do → Check → Take away → Apply

**Accessibility risks in current manifestation (observed, not prescribed fixes):**

- Task before materials breaks linear sense (“do this” before “here is what to read”)
- Duplicate Orient/Think in framing, cognition, and Compass — screen-reader and cognitive load cost
- `expected_output` after materials but task at top — Check signal split from Do
- Unlabelled material stack — Study/Do/Check indistinguishable without headings

The **minimal model** resolves these by **order and labels**, not by new components.

---

# Minimal Viable Manifestation

The **smallest change** required to make the instructional grammar **visible** to learners:

## 1. Explicit function labels in reading order

Each activity exposes **recognisable section purposes** aligned to Orient → Think → Study → Do → Check → Reflect → Transfer. The learner can skim headings and know where they are in the journey.

*Does not require new content — labels make existing content legible.*

## 2. Front-load Companion (Orient + Think)

Merge activity Orient and Think sources into **two entry blocks** before Study. Do not scatter Think across cognition block, Compass, and post-output support.

*Does not require new fields — requires collapsing duplicate manifestation channels.*

## 3. Study before Do in the activity narrative

Study bodies (exposition, worked example, scenario) **precede** the task heading and practice surfaces. Task steps that say “read first” must match DOM/read order.

*Does not require new generation — reorder manifestation of existing materials.*

## 4. Unify Check

Bring **checklist** and **expected output** into one Check section, adjacent to each other, after Do surfaces.

*Uses existing `checklist` and `expected_output`.*

## 5. Single owners — remove duplicate signals

Retire Compass as multi-function signal repeater; use page Orient + optional step label. One transfer owner; one reflect owner per activity.

*Reduces noise; does not remove pedagogy.*

## 6. Compose echo of Companion fields

Orient and Think owners (`activity_preamble`, `reasoning_orientation`, etc.) must **reach the activity manifestation** — not only exist in DLA. This is a **manifestation fidelity** requirement, not generation.

*Ensures Companion entry blocks have content to display.*

## What minimal manifestation is **not**

- Not a new two-column layout
- Not new workflow steps or contracts
- Not new cognition ontology
- Not more prompt layers
- Not a full Compass redesign — **simplification** of Compass to page/step Orient only

---

# Success Criterion Check

| Learner question | Minimal model answer location |
| ---------------- | ----------------------------- |
| Why am I doing this? | Page inquiry + activity “Why this activity” (Companion entry) |
| How to approach it? | “How to approach this” (Companion entry) |
| What to do? | “What to do” after Study (Activity Flow) |
| What to do next? | Next section in Study → Do → Check sequence |
| How do I know I have succeeded? | “Check your work” |
| What to take away? | “What to take away” + page closure |

A learner opening any activity should **recognise the grammar from section order alone** — even on a stylesheet-free linear page.

---

*Minimal manifestation model v1 — Sprint 50 design artefact. Implementation deliberately out of scope.*
