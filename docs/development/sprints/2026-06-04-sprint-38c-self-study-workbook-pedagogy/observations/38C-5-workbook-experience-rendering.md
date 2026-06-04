# Slice 38C-5 — Workbook experience and rendering

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38C-1](38C-1-workbook-pedagogy-model.md) · [38C-2](38C-2-workbook-gap-analysis.md) · [38C-3](38C-3-dla-workbook-requirements.md) · [38C-4](38C-4-gam-instructional-genres.md)  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38C-5  
**Out of scope:** DLA spec (38C-3) · GAM genre bodies (38C-4) · implementation

---

## 1. Purpose

Describe the **target learner-visible workbook experience** for a 60-minute solo self-study page and the **composition/rendering implications** that affect whether [38C-1](38C-1-workbook-pedagogy-model.md) functions appear **on screen** — without proposing pack, renderer, or `app.js` changes.

**Success for this slice:** A reviewer with only a **rendered HTML export** can use §9 checklist to judge experience quality separately from DLA JSON or GAM text.

---

## 2. Inputs and assumptions

| Input | Use |
|-------|-----|
| [38C-1](38C-1-workbook-pedagogy-model.md) | Functions, MVP, genre classification |
| [38C-2](38C-2-workbook-gap-analysis.md) | EV-01 learner experience; composition gaps |
| [38C-3](38C-3-dla-workbook-requirements.md) | Required workbook functions at spec layer |
| [38C-4](38C-4-gam-instructional-genres.md) | Genre → visible patterns; §10 handoff questions |
| **EV-01-P / EV-01-H** | [ev-38b4-01-design-page.json](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) · [render excerpt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-render-excerpt.html) |
| **GOLDEN** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` — section richness comparator |

**Assumptions:**

1. **Learner sees composed page + renderer output** — not upstream-only fields hidden in JSON.  
2. **Design Page** preserves L4 bodies; experience gaps caused by **missing genres** are **not** fixable by layout alone ([38C-2 §9](38C-2-workbook-gap-analysis.md)).  
3. **`page_profile: learner`** implies workbook experience target unless brief overrides.  
4. Renderer already supports scenario cards, task cards, tables, prompt sets (CSS in EV-01-H) — **genre absence** dominates EV-01 failure, not missing CSS classes.

---

## 3. Learner experience principles

| Principle | Meaning for the learner | If violated (EV-01 signal) |
|-----------|-------------------------|----------------------------|
| **Orientation before activity** | Know session goal, time, and path before first task | Short intro only; no “you are here” progression |
| **Teaching before independent performance** | Encounter explanation or model before solo worksheet | Tables-first; definitions without connective prose |
| **Support before challenge** | Cards, examples, or hints before open-ended capstone | Thin one-line preambles; jump to tables |
| **Reference separated from practice** | Lookup tables visually distinct from blanks learner fills | Long table blocks; pre-filled cells mixed with tasks |
| **Visible progression** | Sense of stages (early → late); support decreases | Flat activity list; A5 repeats all tables |
| **Explicit consolidation** | Clear “session complete” with takeaways | Ends on last activity; no summary section |
| **Self-check opportunities** | Checklists or recall prompts with criteria | Implicit “complete the table” only |
| **Completion and closure** | Emotional and cognitive finish — not abrupt stop | Abrupt ending after A5 tables |

---

## 4. Workbook journey model (60-minute self-study)

Ideal journey — **pedagogical order** may differ from DLA activity IDs but must be **visible** on the page.

| Stage | Learner goal | 38C-1 functions | Typical GAM genres ([38C-4](38C-4-gam-instructional-genres.md)) | Risk if omitted |
|-------|-------------|-----------------|------------------------------------------------------------------|-----------------|
| **1. Orientation** | Understand what, why, how long | Partial teaching | Page intro, outcomes, optional `learning_purpose` / timeline | Feels like arbitrary worksheets |
| **2. Explanatory teaching** | Grasp concepts without instructor | Explanatory teaching | `text`/exposition, rich `scenario` intro prose | Reference-only tables ([EV-01](38C-2-workbook-gap-analysis.md)) |
| **3. Worked example / modelling** | See expert method once | Worked examples **or** modelling | `sample_output`, `modelling_note` | Unsupported practice (R5 fail) |
| **4. Guided practice** | Try with structure | Guided practice | `scenario` + `template` / blank table + `task_cards` | Task-only; missing scenarios (GAP-02) |
| **5. Independent application** | Apply with less scaffolding | Guided practice, fading | Fewer cards; larger open tasks | No fade — same density throughout |
| **6. Retrieval / self-check** | Verify understanding | Retrieval | `checklist`, `retrieval_check`, `prompt_set` | Shallow table completion only |
| **7. Synthesis / transfer** | Integrate + personalise | Synthesis, transfer | `template` (plan), `transfer_prompt` | Reference dump capstone (GAP-08) |
| **8. Consolidation** | Remember and close | Consolidation | `consolidation_summary`, `reflection_prompt` | Abrupt end (GAP-03 critical) |

**Nominal time budget:** Stages 1–8 should fit **~60 minutes** visible to learner ([38C-3 §5](38C-3-dla-workbook-requirements.md)); mislabelled **125 min** damages trust ([38C-2 GAP-06](38C-2-workbook-gap-analysis.md)).

```text
Orientation → Teach → Model/Example → Guided practice → Self-check
    → Independent apply → Synthesis/Transfer → Consolidation (closure)
```

---

## 5. Section ordering observations

*Observation only — not a mandated renderer spec.*

### 5.1 Early (above the fold / first scroll)

| Content | Rationale |
|---------|-----------|
| Title + **honest duration** (50–70 min band) | Orientation |
| Learning outcomes (scannable) | Orientation |
| **Key ideas / exposition** (`knowledge_summary` or equivalent) | Teaching before tables |
| Optional session map (“Stage 1 of 5”) | Visible progression |

**EV-01:** Intro + outcomes only — **no** key ideas section ([38C-2 §4](38C-2-workbook-gap-analysis.md)).

### 5.2 Mid (activity band)

| Order within each activity block (learner-visible) | Rationale |
|--------------------------------------------------|-----------|
| Activity title + time badge | Progression |
| Short framing (preamble) | Orientation |
| **Teaching/model** materials first | Support before challenge |
| **Reference** tables (definitions) | Separated heading style |
| **Practice** template / blank table | Practice |
| **Task cards** / prompts | Guided steps |
| **Checklist** before leaving activity | Self-check |
| Task + expected output (visible) | Success criteria — [38C-2 hidden criteria](38C-2-workbook-gap-analysis.md) |

**Per-activity material order ([38C-4 §5.3](38C-4-gam-instructional-genres.md)):** scenario → example → cards → table → checklist.

### 5.3 Late (end of page)

| Content | Rationale |
|---------|-----------|
| Capstone activity: **synthesis materials only** (plan template, transfer prompts) | Anti reference-dump |
| **Dedicated consolidation section** after all activities | Closure — not buried in capstone |
| Optional formative check (if programme provides) | Retrieval |
| No new teaching after consolidation | Clean ending |

**EV-01:** A5 ends with **four full tables** — **reference dump ending** ([38C-4 AP-08](38C-4-gam-instructional-genres.md)).

### 5.4 Where reference material belongs

| Placement | Learner perception |
|-----------|-------------------|
| **Inside activity**, under “Reference” heading, **above** practice table | Lookup then apply |
| **Not** interleaved as only content type | Avoid encyclopaedia scroll |
| **Not** repeated wholesale on capstone | Avoid dump |

### 5.5 Where consolidation belongs

| Option | Observation |
|--------|-------------|
| **Dedicated top-level section** after `Learning Activities` | Strongest closure signal — satisfies [38C-1 §3.8](38C-1-workbook-pedagogy-model.md) |
| Last-activity material only | Weaker — learner may think more tasks remain |
| Design Page intro only | **Insufficient** — not consolidation |

### 5.6 Where self-checks belong

| Placement | Observation |
|-----------|-------------|
| **End of each major activity** (checklist block) | Retrieval visible per stage |
| **Before capstone** (session review checklist) | Bridges to synthesis |
| **Not** only implicit in table completion | EV-01 pattern |

---

## 6. Experience anti-patterns (learner-visible)

| ID | Anti-pattern | Learner perception | EV-01 |
|----|--------------|-------------------|:-----:|
| **XP-01** | **Table-first overload** | “I read spreadsheets, not a lesson” | **Yes** |
| **XP-02** | **Reference dump ending** | “The finale is the same tables again” | **Yes** (A5) |
| **XP-03** | **Activity without teaching** | “I don’t know how before I do” | **Yes** |
| **XP-04** | **Unsupported independent task** | “Partner/group task but I’m alone” | **Yes** (A2, A4) |
| **XP-05** | **Hidden success criteria** | “What counts as done?” | Partial (`expected_output` in JSON) |
| **XP-06** | **Consolidation absent** | “It just stops” | **Yes** |
| **XP-07** | **Abrupt ending** | No summary after last table | **Yes** |
| **XP-08** | **Workshop group tasks** | “This is for a classroom” | **Yes** |
| **XP-09** | **Duration distrust** | “125 minutes?” vs 60-min intent | **Yes** |
| **XP-10** | **Promised scenarios missing** | Preamble says scenarios; only table | **Yes** (A3) |

Map to GAM AP / 38C-2 GAP where documented — experience layer is **learner perception**, not new root cause.

---

## 7. Inflation interpretation (EV-01)

### 7.1 Actual learner experience (composed + render)

| Dimension | What the learner likely experiences |
|-----------|--------------------------------------|
| **Opening** | Polished title and journey promise (~69 words) |
| **Body** | Five activity blocks, each dominated by a **large pipe table** |
| **Coaching** | One-sentence preamble + short task per activity |
| **Practice** | Fill cells, classify, rank — but **no** scenario stories, **no** step-by-step example |
| **Social cues** | “Partner”, “group” in tasks — confusing solo |
| **Ending** | Long capstone with **repeated tables**, no “what to remember” |
| **Time** | Badges sum to **125 min** — cognitive overload or skip |
| **Genre on screen** | Tables render well (CSS present); **no** scenario cards or checklists to render |

**Genre classification ([38C-1](38C-1-workbook-pedagogy-model.md)):** activity sheet + reference notes — **not** workbook.

### 7.2 Target workbook experience (same topic)

| Dimension | Target perception |
|-----------|-------------------|
| **Opening** | Outcomes + **key ideas** prose + 60-min path |
| **Early activities** | Scenario stories → optional example → cards → small table |
| **Mid** | Reference table **then** prompts **then** checklist |
| **Late** | Open practice with fading hints |
| **Capstone** | Plan template + transfer prompts — **not** four tables |
| **Close** | **Consolidation section** with summary + reflection |
| **Solo** | All tasks completable alone |

### 7.3 Gap summary (learner perception)

| Target stage | EV-01 perceived |
|--------------|-----------------|
| Teaching | Thin |
| Model/example | Missing |
| Self-check | Missing |
| Consolidation | Missing |
| Reference vs practice | Collapsed into tables |
| Progression | Topic sequence only, not support fade |

**Composition note:** EV-01 uses **heading-based** sections (3 only) vs GOLDEN’s `knowledge_summary`, `activity_materials`, `learning_sequence`, `assessment_check` — learner sees **less structure** even before genre gaps ([38C-2 §7.3](38C-2-workbook-gap-analysis.md)).

---

## 8. Composition boundaries

### 8.1 Ownership table (experience-focused)

| Concern | DLA | GAM | Design Page | Renderer |
|---------|-----|-----|-------------|----------|
| **Sequencing** (activity order) | **Owns** activity order | — | Preserves; may add overview | Displays in page order |
| **Grouping** (activity vs materials) | Spec per activity | Authors per-activity blocks | Merges `materials.*` onto activities | Renders per activity card |
| **Section visibility** (consolidation, key ideas) | Requires closure in spec | May author `consolidation_summary` body | **Should** surface dedicated section when upstream provides | Section headings |
| **Workbook flow** (stage labels) | Progression metadata | — | May add journey framing in intro | Optional step UI |
| **Preservation** | — | Full bodies | **Verbatim** merge | No summarisation |
| **Sprint 38 affordances** | — | — | Page-root metadata | Figures if generated |
| **Workshop vs solo wording** | **Owns** `learner_task` | Card text | Preserves | Display as-is |

### 8.2 Design Page — observation limits

| Design Page **should** (observation) | Design Page **must not** (38-B preserve) |
|-----------------------------------|------------------------------------------|
| Place consolidation body in learner-visible section when GAM authored it | Invent consolidation not in upstream |
| Preserve cognition fields on activities when present in JSON | Replace `materials` with figures |
| Include `learning_sequence` / timeline when upstream provides | Re-author table cells |
| Merge all `required_materials` genres onto `activity.materials` | Add scenarios GAM never wrote |

**EV-01 gap:** Missing genres → **nothing to place** for cards/checklists/consolidation regardless of compose rules.

### 8.3 Renderer — observation limits

| Renderer **can** (EV-01-H evidence) | Renderer **cannot** fix |
|-------------------------------------|-------------------------|
| Style tables, task blocks, sections | Absent genre bodies |
| Show `expected_output` if present in JSON export path | Missing JSON fields never exported |
| Apply `render_hints` for card/list dedup | Wrong activity order from spec |

**Render visibility unknowns** (planning — require future evidence):  
`scaffold_hint_sequence`, `reasoning_orientation`, `transfer_or_application_task` on A5 — [38C-2 §5.4](38C-2-workbook-gap-analysis.md); **38C-4 §10 Q6**.

### 8.4 Responses to [38C-4 §10](38C-4-gam-instructional-genres.md) handoff (observation)

| # | Observation (not implementation) |
|---|----------------------------------|
| 1 | **Pedagogical order** should dominate; `learning_sequence` is adjunct timeline when present |
| 2 | **Dedicated consolidation section** strongly preferred for closure visibility |
| 3 | Self-checks should be **visible static** minimum; interactivity is out of scope |
| 4 | **Fading** = fewer material types visible in later activities |
| 5 | **Reference** vs **practice** = distinct headings / material icons (renderer already has table vs card icons in CSS) |
| 6 | Cognition fields must be **in export JSON path** to be reviewable — planning gap |
| 7 | **Exposition** = `knowledge_summary` section or first-activity exposition material — not DP intro alone |
| 8 | Capstone layout = **task zone + plan template**, not four tables |
| 9 | Solo workbook should **not display** required group agreement without adaptation |
| 10 | Display duration consistent with brief (60) or explain 125 |

---

## 9. Workbook experience checklist (rendered page)

**Resource:** _______________ **Date:** _______________  
**Artefact:** HTML export / live page · **Profile:** learner · **Nominal time:** _____ min

### 9.1 Orientation and teaching

| # | Question | Y | Partial | N | Notes |
|---|----------|:-:|---------|:-:|-------|
| E1 | Does the learner see **outcomes** before the first activity? | | | | |
| E2 | Is there **teaching prose** (not only table definitions) before first practice? | | | | |
| E3 | Is **session length** credible for self-study (~50–70 min or explained)? | | | | |
| E4 | Is **progression** visible (stages, sequence, or timeline)? | | | | |

### 9.2 Model, practice, reference

| # | Question | Y | Partial | N | Notes |
|---|----------|:-:|---------|:-:|-------|
| E5 | Is there a **worked example or modelling** stage visible? | | | | |
| E6 | Are **scenarios** visible where tasks refer to cases/households? | | | | |
| E7 | Is **reference** material visually separable from **practice** tables/templates? | | | | |
| E8 | Are **task cards** or stepped prompts visible in early activities? | | | | |

### 9.3 Checks, synthesis, closure

| # | Question | Y | Partial | N | Notes |
|---|----------|:-:|---------|:-:|-------|
| E9 | Are **self-checks** (checklist / retrieval) visible ≥2 times? | | | | |
| E10 | Is **success criteria** visible (expected output near task)? | | | | |
| E11 | Is there a **capstone** integrative task (not only table reprint)? | | | | |
| E12 | Is **transfer** (“your context”) visible on capstone? | | | | |
| E13 | Is **consolidation** visible (summary / reflection section)? | | | | |
| E14 | Does the workbook **end with closure** (not abrupt table stop)? | | | | |

### 9.4 Solo feasibility and anti-patterns

| # | Question | Y | Partial | N | Notes |
|---|----------|:-:|---------|:-:|-------|
| E15 | Can a **solo** learner complete tasks without partner/group? | | | | |
| E16 | **Table-first overload** absent? | | | | |
| E17 | **Reference dump ending** absent? | | | | |

**Experience PASS (planning bar):** E1, E2, E5, E9, E13, E14, E15 = **Y**; E16–E17 = **Y**; aligns with [38C-1](38C-1-workbook-pedagogy-model.md) when cross-walked.

**EV-01 forecast:** E2 Partial, E5 N, E6 N, E9 N, E13 N, E14 N, E15 N, E16 N, E17 N.

---

## 10. Planning conclusions

### 10.1 What Sprint 38-C has established

| Slice | Established |
|-------|-------------|
| **38C-1** | Workbook definition, 11 functions, PASS/FAIL, genre taxonomy |
| **38C-2** | EV-01 fails workbook bar; wrong genre hypothesis **supported**; not DP stripping |
| **38C-3** | DLA must specify genres, solo tasks, duration, consolidation, capstone shape |
| **38C-4** | GAM must author genre bodies; table-only **insufficient** |
| **38C-5** | Target learner journey, section order, experience checklist, composition boundaries |

**Programme answer:** Moving from activity sheets to workbooks requires **aligned DLA specs → GAM genre authoring → composed page shape → renderer visibility** — not Design Page preserve alone.

### 10.2 What remains unknown (planning)

| Unknown | Why it matters |
|---------|----------------|
| Cognition fields in HTML export | A5 scaffolding may be invisible |
| Canonical `section_id` vs `heading` impact on section order | GOLDEN vs EV-01 structural gap |
| Whether `learning_sequence` should render for self-study | Progression visibility |
| Interactive vs static self-checks | Product decision |
| Exposition section ownership (page vs GAM `text`) | R1 visible bar |
| Live rerun with full 38C-3/4 obligations | Validate journey on screen |

### 10.3 Future execution charter — investigation themes

*Themes only — not proposals.*

1. **End-to-end workbook fixture** — DLA spec + GAM + page + HTML scoring E1–E17.  
2. **Export pipeline audit** — which activity JSON fields reach renderer.  
3. **Section contract** for self-study pages (`knowledge_summary`, `consolidation`, `learning_sequence`).  
4. **Duration policy** — normalise activity minutes to session budget.  
5. **Genre mix probe** (planning concept from [38C-4 §8.4](38C-4-gam-instructional-genres.md)) — pre–Design Page gate.  
6. **Solo wording lint** — task + card text.  
7. **Do not reopen** 38-B prompt-size or B4 table syntax unless regression.

---

## 11. Success criteria (slice)

| Criterion | Met? |
|-----------|------|
| Intended learner journey describable | §4 |
| Experience separated from DLA/GAM | §3, §8 |
| Learner-visible anti-patterns documented | §6 |
| Rendered page reviewable via checklist | §9 |
| No implementation proposals | Throughout |
| 38C-4 §10 addressed (observation) | §8.4 |
| Slice 38C-5 | **COMPLETE** |

---

## 12. Sign-off — Sprint 38-C planning phase

| Phase | Status |
|-------|--------|
| 38C-1 … 38C-5 | **COMPLETE** |
| Implementation charter | **Not started** — see §10.3 |

**Next (programme):** [38C-6 planning synthesis](38C-6-planning-synthesis-and-execution-recommendation.md) — recommends Sprint **38-D**.
