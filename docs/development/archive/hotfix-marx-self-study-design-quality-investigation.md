# Marx self-study — activity design quality investigation

**Date:** 2026-05-21  
**Evidence:** Generated learner page (`page (24).html`), PRISM renderer after formatting hotfix  
**Scope:** Pedagogic/design quality only (not renderer CSS). Assessment omission handled elsewhere.

---

## Executive summary

| Question | Finding |
|----------|---------|
| Are structured fields hidden by the renderer? | **No.** Task cards, tables, prompts, checklist, and scenario all render when present in page JSON. |
| Where do the three UX issues originate? | **Primarily activity generation (Design Learning Activities)** and **material realisation (Generate Activity Materials)**, with **faithful passthrough** at Design Page assembly. |
| Does sequencing cause this? | **No.** Four activities appear in a sensible progression (life map → experience–theory → works compare → concept apply). |
| Is cognition/scaffolding infrastructure unused? | **Partially.** Sprint 28 cognition packs can add `self_explanation_prompt` / `scaffold_hint_sequence`, but they are **not reliably activated** for briefs like this unless `cognitive_engagement_required` or `adaptive_scaffolding_required` resolves true. The Marx page shows **no** `util-cognition` blocks. |

**Smallest test-backed fix (applied 2026-05-21):** `applyPedagogicCognitionContractScaffoldToDraft` in `app.js` appends **Self-directed learner-page material shape (auto-applied)** when DLA runs with `delivery_context` `self_directed` / `async` / `online_async` and learner-page output signals. Does **not** add workflow steps, change renderer/Design Page/GAM, or reopen Sprint 29.

### Timeline ordering hotfix (2026-05-21)

**Observed:** Activity A1 asks learners to arrange key life events chronologically, but **Key Life Events** source text lists years already ascending (1818 → … → 1883), so the ordering task is hollow.

**Fix:** **Self-directed timeline sequencing alignment (auto-applied)** on DLA and GAM prompts — mixed-order event lists when `learner_task` requires sequencing; interpretation tasks may keep chronological reference text. Heuristic: `evaluateTimelineSequencingMaterialAlignment` in tests.

**Tests:** `tests/workflow-self-directed-learner-page-formatting.test.js`

---

## Evidence map (rendered page)

### Activity 2 — Linking Experience to Theory

**Rendered:** Six generic `util-task-card` prompts *plus* a three-row cause–effect `util-table-scroll` table. Learner task says: *“Complete the cause–effect table using task cards.”*

**Design issue:** Cards are disconnected (“What challenges did Marx face?” / “How did this influence his ideas?”) while the table already defines integrated rows (Exile, Collaboration, Industrial Context). For self-directed study, the table alone (with row-embedded prompts) would be clearer.

**Upstream cause:** `required_materials` almost certainly specified **`task_cards` + `template`/`analysis_table`** (or equivalent). GAM realised both literally. Design Page copied both. Renderer correctly shows both as first-class patterns.

### Activity 3 — Comparing Marx’s Major Works

**Rendered:** `Comparison Prompts` (purpose, audience, style, focus) and empty comparison table (Manifesto vs Das Kapital) **before** any orienting prose on what each work is.

**Design issue:** Comparison prompts assume prior knowledge of the texts. Knowledge summary lists concepts, not work summaries.

**Upstream cause:** Activity design ordered **comparison before orientation**; materials likely lack a **`text`** (or `sample_output`) intro material. Not a renderer omission — no hidden `text` block in HTML.

### Activity 4 — Explaining Marx’s Core Concepts

**Rendered:** Seven-item checklist (capitalism, bourgeoisie, proletariat, class struggle, alienation, Industrial Revolution, final judgement) + factory scenario + single 150–200 word task.

**Design issue:** Cognitive load: all abstract concepts in one short writing task.

**Upstream cause:** Activity + checklist material specification bundles every LO concept into one checklist. No staged sub-tasks or `self_explanation_prompt` / phased `learner_task` steps on the page.

---

## Layer responsibility matrix

| Layer | Role | Marx page verdict |
|-------|------|-------------------|
| **Activity generation (DLA)** | Chooses `required_materials` types, `learner_task`, grouping, duration | **Primary owner** — task_cards vs integrated scaffold; missing orienting `text`; overloaded checklist scope |
| **Material generation (GAM)** | Fills specs; cannot redesign activities | **Secondary** — faithfully produces six cards + table; no work intro unless specified |
| **Design Page assembly** | Read-only compose; copy `activity_materials` into `materials` | **Not at fault** — prompt forbids pedagogy redesign |
| **Learning sequence** | Order/timing only | **Not at fault** — order is reasonable |
| **Renderer** | Present named material fields | **Not at fault** — displays what JSON contains |

---

## Prompt / contract gaps (why generation defaults fail)

### Design Learning Activities

- `defaultPromptNotes` already says: *when `delivery_context` is self_directed, prioritise independently completable tasks* — but **does not** constrain **material type mix** (e.g. avoid `task_cards` + parallel table for one integrated scaffold).
- Controlled `required_materials.type` values include `task_cards`, `prompt_set`, `scenario`, `checklist`, `template`, `sample_output`, `text` — **`text` is valid** for orienting blurbs but is not prompted for comparison-before-table patterns.
- **Page-task mode guidance** (auto on page-focused goals) steers away from classroom choreography but **not** toward integrated scaffolds or staged concept application.

### Generate Activity Materials

- Explicit: *“do not redesign activities”* — so six cards + table stay separate if DLA requested both.
- Material-type guidance maps `task_cards` → card text, `template` → fillable layout — **no rule** to merge card prompts into table rows when both exist for one activity.

### Design Page

- Explicit: *“read-only composition; do not redesign pedagogy”* — cannot insert orienting prose or split Activity 4 unless upstream provides it.

### Cognition packs (Sprint 28, not Sprint 29 renderer)

- `self_study_cognition_pack` adds `self_explanation_prompt`, `transfer_or_application_task` on DLA when pack is active (`delivery_context` self_directed + `cognitive_engagement_required` or `adaptive_scaffolding_required`).
- Marx-style briefs may **not** resolve those factors without explicit “cognitive engagement” / “scaffolding” language → pack inactive → **no staged cognition fields** on activities.

---

## Smallest test-backed fix (applied)

### Change (one place)

Appended a **Self-directed learner-page material shape** block in `applyPedagogicCognitionContractScaffoldToDraft` when:

- `isWorkflowStepDesignLearningActivities(context)`, and  
- resolved `delivery_context` is `self_directed` / `async`, and  
- session materials include `page` / learner-facing output.

**Suggested rules (prompt text):**

1. **Integrated scaffolds:** For cause–effect / table-completion tasks, prefer a single `template` or `analysis_table` with prompts in row labels — **do not** add parallel `task_cards` unless each card maps to a distinct sub-activity.
2. **Compare after orient:** For comparison activities, include a short `text` or `sample_output` material introducing each entity **before** `prompt_set` or comparison table prompts.
3. **Staged application:** Cap checklist items to ≤4 per writing task, or split application across numbered sub-steps in `learner_task`; avoid listing every course concept in one checklist for a single short response.

### Tests

| Test | File | Asserts |
|------|------|---------|
| Renderer fidelity | `tests/utility-marx-self-study-design-quality.test.js` | Reconstructed page JSON renders upstream materials — fields **not hidden** |
| Brief → cognition | same | Marx-like brief: `delivery_context` self-directed; cognition pack inactive without engagement cues |
| DLA scaffold | same | Marx-like DLA draft includes material-shape rules; omitted for `in_person` and GAM |

**Out of scope for this hotfix:** GAM restructure, Design Page pedagogy rewrite, new workflow steps, renderer changes.

---

## References

- `domains/learning-design/domain-learning-design-step-patterns.md` — DLA, GAM, Design Page prompts  
- `app.js` — `applyPedagogicCognitionContractScaffoldToDraft`, page-task mode guidance (~4858), `mergeUpstreamCognitionFieldsIntoPageActivities`  
- `tests/fixtures/page-render/marx-self-study-page.json` — partial regression fixture  
- Sprint 28 `activity-materials-quality-notes.md` — self-study compensation problem (H7)
