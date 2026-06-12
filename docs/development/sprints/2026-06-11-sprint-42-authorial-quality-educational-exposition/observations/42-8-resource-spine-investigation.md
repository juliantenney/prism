# Sprint 42-8 — Learner Resource Spine Investigation

**Date:** 2026-06-11  
**Type:** Code and contract analysis only (no workflow runs, no new captures, no implementation changes)  
**Builds on:** [42-5 journey context](42-5-design-page-journey-context-investigation.md), [42-6 journey assimilation](sprint-42-slice-6-journey-assimilation.md), [42-7 GAM preservation](42-7-gam-preservation-audit.md)

**Working hypothesis tested:** Design Page is organised primarily around `learning_activities`, producing an Activity → Activity → Activity reader experience rather than Question → Investigation → Evidence → Judgement → Reflection.

---

## Required verdict

### What currently acts as the learner page's organising structure?

**`learning_activities` is the primary organising artefact.** Design Page is architected as an activity-membership compose step: the hard contract is that every upstream `activity_id` appears in `sections[].learning_activities.content[]` with merged `activity.materials.*`. Section wrappers (`overview`, `learning_purpose`, `knowledge_summary`) are optional and subordinate; activity order comes from DLA (with optional `learning_sequence` timing). Post-compose repair and fidelity overlays key off DLA/GAM per activity, not off LC/KM/LS as page spine.

The learner experience therefore **defaults to activity-first organisation** even when upstream journey exists elsewhere.

### Which existing upstream artefact is best positioned to provide the intellectual spine of an authored self-study resource?

**`learning_content` (Generate Learning Content)** — when present and bound — is the closest match to an authored resource: sectioned explanatory prose, central inquiry, and macro progression (e.g. Sprint 30 Marx four-part arc: life → cause-effect → compare works → apply). It is the only upstream artefact that natively reads as a **continuous teaching narrative** rather than a task catalogue.

**`knowledge_model`** is the best **conceptual** spine candidate (`concepts`, `relationships`, `processes`, `misconceptions`) for `knowledge_summary` and inquiry framing when LC is thin or absent.

**Not the primary intellectual spine today:** `learning_activities` + `activity_materials` (execution containers), `episode_plans` (DLA-only beat order, not Design Page input), `learning_sequence` (facilitation timeline; weakly surfaced on page).

---

## 1. Current organising artefact

### 1.1 Primary: `learning_activities`

| Evidence layer | What it enforces |
| -------------- | ---------------- |
| **§13 Design Page Input** | Lists `learning_outcomes`, **`learning_activities`**, `activity_materials` first among named compose inputs |
| **§13 promptTemplate** | “If learning_activities are present, include a **Learning Activities section** with one entry per upstream activity_id”; `learning_activities.content MUST be an array`; **ACTIVITY MEMBERSHIP** hard rule `(U \ X) ⊆ C` |
| **LD-DESIGN-PAGE-COMPOSE-CONTRACT** | “ACTIVITY MEMBERSHIP (hard): every upstream activity_id … learning_sequence **order/timing only**” |
| **LD-MATERIALS-COPY PREC-02** | Materials fidelity overrides overview thinning — **activities + materials** win over wrapper prose |
| **Post-compose repair** | `repairLearnerPageCompositionFromUpstream` / `resolveUpstreamLearningActivitiesForPageStep` — **DLA only** |
| **GAM preserve** | `applyGamMaterialsToComposedPage` — per **activity row** merge |
| **Renderer** | Largest visual block is `learning_activities` → `util-task-block` per activity (`design-page-export-contract.md`) |

**Activity grouping:** All activities live in **one** `learning_activities` section (`content[]` array). There is no first-class page schema for multi-phase chapters, inquiry movements, or evidence/judgement **sections** — only optional wrapper sections plus an activity stack.

**Activity order:** Default = DLA array order. `learning_sequence` may reorder **timing** within the activity flow; it does not replace activity-centric section structure.

### 1.2 Secondary: canonical wrapper sections (weak spine)

Design Page **may** emit optional `section_id` values (`overview`, `learning_purpose`, `knowledge_summary`, `study_tips`, `assessment_check`, `support_notes`) per §13 `defaultPromptNotes` and learner-profile output requirements.

| Section | Role in intended model | Actual binding strength |
| ------- | ---------------------- | ------------------------ |
| `overview` | Central inquiry / journey | Prompt + LD-JOURNEY-ASSIMILATION (42-6); **not** hard membership |
| `learning_purpose` | Capability progression | Same; may duplicate LO bullets |
| `knowledge_summary` | Conceptual orientation | Encouraged when LC/KM bound; **often absent** in live Marx pages |
| `study_tips` | Closure / synthesis | Optional; GAM closure may live in **activity materials** instead |
| `learning_sequence` | Phase spine | Recognised in `pageSectionCanonicalKind` + cognition reorder; **rarely emitted** as its own section; not in catalog `sectionOrder` default |

**Cognition reorder** (`COGNITION_PAGE_CANONICAL_SECTION_ORDER` in `app.js`): when cognition composition is active, sections sort to `overview → learning_purpose → knowledge_summary → learning_sequence → **learning_activities** → …` — wrappers **precede** but do not **replace** the activity stack.

### 1.3 Renderer follows `sections[]` composition order

Per Sprint 25 export contract: when `sections[]` is present, it is the **authoritative body**; catalog `sectionOrder` supplies labels and fallback only — **it does not reorder** composed section array entries. What the LLM places in `sections[]` (and how large `learning_activities` is) determines the read experience.

### 1.4 Contrast: hand-edited benchmark vs typical compose output

| Artefact | Spine shape |
| -------- | ------------- |
| `tests/fixtures/page-render/marx-self-study-page.json` | **`knowledge_summary` first**, then `learning_activities` — authored resource shape (concepts → application) |
| Sprint 30 `marx-page.json` | Introduction prose + LO list + **activity stack** — activity-first with thin wrappers |
| `marx-self-study-design-quality-page.json` | **Only** `learning_activities` — pure workbook |

The benchmark fixture shows the **intended** intellectual spine can be expressed in the **existing page schema** without new fields — but typical compose output does not default to it.

---

## 2. Upstream candidates for resource spine

| Upstream artefact | Resource-spine content | Available to Design Page? | Used as page spine today? |
| ----------------- | ---------------------- | ------------------------- | ------------------------- |
| **learning_content** | Sectioned teaching narrative; central inquiry; macro progression | Policy `optionalRequires` / `requiresAnyOf`; embed if bound; named in §13 Context (42-6) | **No** — assimilate into `overview` / `knowledge_summary` only via prompt guidance |
| **knowledge_model** | `concepts`, `relationships`, `groupings`, **`processes`**, **`misconceptions`** | Same | **No** — optional `knowledge_summary`; not structural spine |
| **learning_outcomes** | Outcome list; weak narrative unless author writes arc | Listed in §13 Input | **Partial** — often `learning_purpose` bullet list |
| **episode_plans** | Beat order, archetype, instructional functions | **DLA only** (`ensureDlaEpisodePlanInputBindingsForSteps`) | **No** at Design Page |
| **learning_sequence** | `timeline[]`, `phase_type`, **`transition_to_next`** | Optional bind | **Timing/order only** for activities; transitions assimilated to wrappers (42-6); seldom own section |
| **learning_activities** | `study_orientation`, `intellectual_frame`, bridges, preambles | Core Input + repair upstream | **Yes — primary organise unit** |
| **activity_materials** | Worked examples, modelling notes, consolidation, transfer | Core Input + L4 preserve | **Per-activity bodies**, not page spine |
| **GAM closure / judgement** | `consolidation_summary`, `prompt_set`, debrief in materials | Via merge into activity rows | **Activity-local**, not resource-level reflection section |

---

## 3. Evidence map

```mermaid
flowchart LR
  subgraph intellectual [Intellectual spine candidates — upstream]
    LC[learning_content<br/>authored narrative]
    KM[knowledge_model<br/>concepts / processes / misconceptions]
    LS[learning_sequence<br/>phases / transitions]
  end

  subgraph execution [Execution spine — what Design Page optimises]
    DLA[learning_activities<br/>activity_id rows]
    GAM[activity_materials<br/>per-activity bodies]
  end

  subgraph page [Composed page structure]
    WRAP[overview / purpose / knowledge_summary<br/>optional wrappers]
    ACT[learning_activities.content[]<br/>PRIMARY ORGANISER]
    TIPS[study_tips / assessment_check]
  end

  LC -. weak prompt assimilate .-> WRAP
  KM -. weak prompt assimilate .-> WRAP
  LS -. order + wrapper hints .-> ACT
  DLA -->|hard membership| ACT
  GAM -->|verbatim merge| ACT
  WRAP --> page
  ACT --> page
  TIPS --> page
```

### 3.1 Generate Content — strongest **authored resource** analogue

42-4B Marx audit: LC holds four-section inquiry arc (life → theory links → compare works → factory application) **before** LO domain shift. This is the only upstream artefact that mirrors a **self-study chapter** rather than a session plan.

**Design Page usage:** Not in original §13 Input list; added to Context in 42-6. No schema field maps LC sections 1:1 to page sections — assimilation is prompt-level into wrappers.

### 3.2 Knowledge Model — strongest **conceptual** spine

KM keys include `processes` and `misconceptions` (`domain-learning-design-step-patterns.md` Model Knowledge output). 42-4B: typed `relationships`, process steps, misconception judgements — **structured** journey graph.

**Design Page usage:** Optional bind; `knowledge_summary` when prompted. Not authoritative for section layout or activity grouping.

### 3.3 Learning Outcomes — list spine, not narrative spine

LO provides outcome statements and order hints. 42-4B: LO can **replace** LC inquiry with a new meta-learning arc when domain drifts. Composes into `learning_purpose` as bullets — **checklist spine**, not inquiry spine.

### 3.4 Episode Plans — instructional spine for DLA only

Frozen beat order drives DLA population; explicitly **not** replanned at Design Page. Never wired to Design Page `inputBindings`. Cannot act as learner page spine without workflow/schema change.

### 3.5 Learning Sequence — session spine, weak page spine

Produces `timeline[]` with `phase_type` and `transition_to_next` (§10 Construct Learning Sequence). VLE Structure and Slide Deck prompts use LS for **pedagogic progression**; Design Page prompt historically limited LS to **activity order/timing** (42-5, 42-6 extends wrapper assimilation).

`learning_sequence` is in `COGNITION_PAGE_CANONICAL_SECTION_ORDER` but **absent** from catalog default `sectionOrder` (`design-page-export-contract.md`). Live Marx captures often omit LS entirely (42-4B).

### 3.6 DLA + GAM — activity execution spine

DLA: one row per `activity_id` with `learner_task`, preambles, bridges.  
GAM: richest **local** exposition (worked examples, modelling notes, consolidation) — 42-7: preserved in `materials.*`, but **inside** activity blocks.

Sprint 30 Marx: page reads as workbook **despite** full GAM prose because **structure** is `learning_activities` articles with task headers + tables dominating scan path (`marx-render.html`).

---

## 4. Constraints analysis

### 4.1 Is Design Page structurally biased toward activity-first organisation?

**Yes.** Bias is **multi-layer** — not a single bug.

| Layer | Activity-first bias |
| ----- | ------------------- |
| **Prompt** | Longest mandatory instructions: ACTIVITY MEMBERSHIP, materials merge, per-activity fields; wrappers “when applicable” |
| **Contract** | LD-DESIGN-PAGE-COMPOSE: hard activity set; LS “order/timing only” |
| **Data model** | Page body = `sections[]`; only `learning_activities.content[]` carries the full task + materials payload |
| **Composition guidance** | LD-MATERIALS-COPY PREC-02: materials > overview; journey modules (42-6) apply to wrappers only |
| **Repair / preserve** | DLA + GAM per activity; no LC/KM/LS spine repair |
| **Section templates** | Canonical ids list `learning_activities` as the substantive core; learner profile minimum stresses “rich learning activities” |
| **Renderer** | Task-block layout per activity; tables/checklists visually dominate (42-7) |

**Not biased at renderer for spine choice:** Renderer renders `sections[]` in array order; `knowledge_summary`-first benchmark fixture is valid without renderer changes.

### 4.2 Could a stronger resource spine use existing artefacts (no new stages/schemas/renderer)?

**Yes — within existing page schema and prompt surface:**

| Lever | Existing artefact | Mechanism (already available) |
| ----- | ----------------- | ----------------------------- |
| Inquiry + macro arc | `learning_content` | Compose into `overview` / `learning_purpose`; section order in `sections[]` |
| Conceptual problem | `knowledge_model` | `knowledge_summary` with `concepts` / `relationships` / `use_in_activities` (benchmark fixture pattern) |
| Phase / transition language | `learning_sequence` | Wrapper assimilation + activity order (42-6); optional `learning_sequence` section |
| Cross-activity progression | DLA bridges + A1 `study_orientation` | Preserve fields; assimilate into overview (42-6) |
| Judgement / closure | GAM `consolidation_summary`, transfer prompts | `study_tips` synthesis + preserve in A4 materials |
| Section ordering | `sections[]` array | Prompt: `knowledge_summary` before `learning_activities` (benchmark order) |

**Cannot become page spine without architectural change:**

| Artefact | Blocker |
| -------- | ------- |
| `episode_plans` | Not Design Page input; beat model not learner-facing sections |
| LC/KM as **structural** sections | No automatic 1:1 mapping — prompt discipline only |

**Constraints that remain even with stronger spine guidance:**

- Activity membership and materials verbatim rules still force a full **activity stack**
- PREC-02 still caps wrapper length vs materials volume
- LLM may still emit duplicate activity rows or thin wrappers (42-7, 42-4 captures)

---

## 5. Hypothesis evaluation

| Claim | Verdict |
| ----- | ------- |
| Design Page organised primarily around `learning_activities` | **Confirmed** |
| Reader experience defaults to Activity → Activity → Activity | **Confirmed** for typical compose output and render scan path |
| Upstream journey exists but does not organise the page | **Confirmed** (42-5) — journey in LC/KM/DLA/LS/GAM; **page spine** = activities |
| Workbook feel = materials loss | **Partially rejected** (42-7) — often **structure + visual weight**, not GAM stripping |
| Stronger intellectual spine possible without new architecture | **Confirmed** — prompt/section-order use of LC/KM/LS + benchmark `knowledge_summary`-first pattern |

---

## 6. Summary table — spine vs organiser

| Role | Artefact |
| ---- | -------- |
| **Page organiser (structural)** | `learning_activities` (+ `activity_materials` merge) |
| **Best intellectual spine (authored narrative)** | `learning_content` |
| **Best conceptual spine (structured)** | `knowledge_model` |
| **Best phase/transition spine (when present)** | `learning_sequence` (secondary to activities) |
| **Instructional beat spine (upstream of DLA)** | `episode_plans` (not exposed on page) |
| **Execution + local exposition** | DLA + GAM (activity-scoped) |

---

## 7. Key references

| Topic | Location |
| ----- | -------- |
| Design Page §13 Input, membership, section ids | `domains/learning-design/domain-learning-design-step-patterns.md` (~3378–3452) |
| Compose contract membership | `lib/ld-design-page-compose-contract.js` |
| Cognition section order | `app.js` `COGNITION_PAGE_CANONICAL_SECTION_ORDER` (~11246) |
| Section kind detection | `app.js` `pageSectionCanonicalKind` (~35471) |
| Export / render authority | `docs/development/sprints/2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-export-contract.md` |
| Journey context | `observations/42-5-design-page-journey-context-investigation.md` |
| GAM preservation | `observations/42-7-gam-preservation-audit.md` |
| Benchmark resource shape | `tests/fixtures/page-render/marx-self-study-page.json` |
| Sprint 30 activity-first page | `docs/.../live-artefacts/marx-page.json`, `marx-render.html` |

---

**Investigation complete.** No workflows run. No implementation changes. No fix recommendations (per scope).
