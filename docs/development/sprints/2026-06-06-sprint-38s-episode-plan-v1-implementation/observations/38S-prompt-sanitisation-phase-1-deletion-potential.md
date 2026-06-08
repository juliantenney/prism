# 38S Prompt Sanitisation Phase 1 — Deletion Potential Investigation

**Date:** 2026-06-08  
**Status:** **COMPLETE — investigation only; no prompt changes**  
**Type:** Prompt deletion potential (not improvement)  
**Predecessor:** [38S Prompt Responsibility Audit](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)  
**Inputs:** `domain-learning-design-step-patterns.md` §6 (DLA), §7 (GAM), §11 (Learning Sequence) · `lib/episode-plan-population-contract.js` · `app.js` render path for `learning_sequence`

---

## Executive summary

**Primary question:** If Episode Plan V1 is the planning authority, what DLA/GAM prompt text is no longer required?

**Answer:** Roughly **half to two-thirds of the DLA pack** and **one-third to one-half of the GAM pack** are deletion or heavy-dedupe candidates. The largest removable mass is DLA **IFP-01/02/03/07/08** (planning superseded by Episode Plan + population contract) and the **DLA-WB ↔ IFP-10 duplicate gate stack**. GAM is mostly realisation-correct but carries **GAM-WB ↔ GAM-PRES duplication** and residual episode-shaping language in notes.

**Learning Sequence** is **not** superseded by Episode Plan. It owns **session-level timeline and delivery choreography**; Episode Plan owns **within-activity beat order**. If Learning Sequence disappeared, learners would lose session timeline rendering and time-feasibility omission logic — not beat structure or material bodies.

**Estimated post-sanitisation sizes (pack only, investigation estimate):**

| Step | Current | After Phase 1 sanitisation (range) | Reduction |
|------|--------:|-----------------------------------:|----------:|
| DLA | ~33k | **~10k–14k** | **~55–70%** |
| GAM | ~28k | **~12k–17k** | **~35–45%** |

---

## 1. Responsibility map

### DLA (`domain-learning-design-step-patterns.md` §6)

Measured major blocks from pack `promptTemplate` (~30,550 chars):

| Section | ~Size | Responsibility | Introduced for | Episode Plan supersedes? | Still needed? | Why |
|---------|------:|----------------|----------------|:------------------------:|:-------------:|-----|
| Context + Task + core instructions | ~3,840 | Activity JSON schema, LO mapping, learner_task, cognition fields, KM affordances, delivery constraints | Pre-38J activity design | **Partially** — Task framing still says “design” not “populate” | **REWRITE** | Keep schema/output rules; remove “design sequence/progression” |
| **IFP-00** SEQUENCE | ~1,070 | Orchestrate IFP pipeline before JSON emit | 38J-3 — mandatory internal planning | **Yes** — planning authority moved | **REMOVE** | Population contract + runtime 38S gate replace orchestration |
| **IFP-01** ARCHETYPE SELECTION | ~730 | LO→archetype inference, overrides | 38I-3 / 38J-3 | **Yes** | **REMOVE** | `episode_plan.archetype` from derive |
| **IFP-02** ARCHETYPE TEMPLATES | ~2,030 | Full Understand/Apply/Analyse/Evaluate function orders | 38J-2 / 38J-3 | **Yes** | **REMOVE** | `episode_plan.beats[].function` from derive |
| **IFP-03** KM TRIGGERS | ~1,055 | Replan function_sequence from KM | 38J-3 | **Yes** (beat set) | **REMOVE** from prompt | KM enrichment belongs in derive templates or population `FUNCTION_SPECS`, not LLM replan |
| **IFP-04** INFERENCE CONTRACTS | ~1,230 | Gap-fill from LO/brief; Evaluate anchors | 38J-3 / 38L-4 | **Partially** | **REWRITE** | Obligation *content* hints still needed; archetype/sequence inference not |
| **IFP-05** ANTI-SHELL | ~1,035 | Block LO→task shells | 38J-3 | **Partially** | **REWRITE** | Replace with “every beat → ≥1 obligation row” check |
| **IFP-06** ANTI-SPOILER | ~730 | Scaffold-not-answer in specs | 38H-2 / 38J-3 | No | **KEEP** | DLA spec discipline for GAM handoff |
| **IFP-07** SESSION ARC | ~600 | Cross-activity fade, capstone weight | 38J-3 | **Partially** | **REMOVE** from DLA | Owned by Learning Sequence + brief, not beat population |
| **IFP-08** | ~270 | Derive materials from function plan | 38J-3 | **Yes** | **REMOVE** | `episode-plan-population-contract.js` |
| **IFP-09** DEPTH FLOORS | ~1,070 | L3 content obligations in specs | 38L-2 | No | **REWRITE** | Still DLA job — compact reference to `FUNCTION_SPECS` / depth_floor |
| **IFP-10** CLOSURE EMISSION GATES | ~1,560 | Mandatory material rows before emit | 38L-2 / 38L-4 | **Partially** | **REWRITE** | Validator/post-capture can enforce; prompt duplicate of DLA-WB |
| **DLA-WB** self-study workbook block | ~11,840 | Workbook genre rows, mandatory types, Evaluate pack | 38E → 38G → 38L | **Partially** | **REWRITE** | Keep delivery_notes + genre row checklist; drop archetype-conditioned duplicates |
| Constraints + Output JSON | ~3,500 | User options, output shape, PRE-EMIT gates | Various | **Partially** | **REWRITE** | Trim redundant PRE-EMIT list mirroring IFP-10/DLA-WB |
| `defaultPromptNotes` | ~2,670 | Runner summary | Various | **Partially** | **REWRITE** | Remove IFP references |

**IFP block total:** ~11,370 chars (~37% of DLA template).

---

### GAM (`domain-learning-design-step-patterns.md` §7)

| Section | ~Size | Responsibility | Introduced for | Episode Plan supersedes? | Still needed? | Why |
|---------|------:|----------------|----------------|:------------------------:|:-------------:|-----|
| Context + Task + core instructions | ~2,230 | Realise materials; no redesign | Pre-38E GAM | No | **KEEP** | Core realisation role |
| **GAM-PRES** (00–10) | ~7,620 | Order, no-collapse, L3 bodies, Evaluate termination | 38J-4 / 38L-3 / 38L-4 | No | **KEEP** (dedupe) | Primary GAM authority; overlaps GAM-WB |
| Material-type realisation guidance | ~4,005 | Per-type body rules (scenario, worked_example, etc.) | 38E–38L accretion | No | **REWRITE** | Merge duplicates already stated in GAM-PRES-03/08 |
| Usability requirements | ~540 | Complete bodies, no “describe” | 38E | No | **KEEP** | Short, high signal |
| **GAM-WB** workbook block | ~10,940 | Workbook F-rules, anti-patterns F1–F9 | 38E-9 → 38L | No | **REWRITE** | ~60% redundant with GAM-PRES + material-type section |
| Scope + Output organisation | ~1,210 | Material: / Content: format | 38E-9 | No | **KEEP** | Downstream merge depends on shape |
| `defaultPromptNotes` | ~1,810 | Runner summary | Various | **Partially** | **REWRITE** | Remove “realise richer instructional episodes” |

---

### Learning Sequence (`domain-learning-design-step-patterns.md` §11)

| Section | ~Size | Responsibility | Introduced for | Episode Plan supersedes? | Still needed? | Why |
|---------|------:|----------------|----------------|:------------------------:|:-------------:|-----|
| Context + Task | ~400 | Build `learning_sequence` JSON | Core LD workflow | **No** | **KEEP** | Different layer (session timeline) |
| Activity set discipline | ~800 | No new/rename activities; time omission | Core | **No** | **KEEP** | Session feasibility |
| Material traceability rules | ~1,200 | Exact material_id references in facilitator script | Facilitated delivery | **No** | **KEEP** (facilitated) | GAM/Page do not produce facilitator timeline |
| Timeline block schema | ~900 | start_minute, duration, facilitator/learner actions, transitions | Core | **No** | **KEEP** | Unique output shape |
| Pedagogic session shaping | ~1,000 | Increasing complexity, plenary moments, cognitive timing | HE/facilitated | **Partially** vs DLA IFP-07 | **REWRITE** | Trim overlap; LS is correct owner |
| Output requirements + checks | ~770 | Fenced JSON, validation keys | Core | No | **KEEP** | |
| `defaultPromptNotes` | ~250 | Self-directed progression framing | Blended | No | **KEEP** | |

**Learning Sequence total:** ~5,320 chars — small relative to DLA/GAM; **not a Phase 1 deletion target**.

---

## 2. Section classification summary

| Class | DLA | GAM | Learning Sequence |
|-------|-----|-----|-------------------|
| **A. KEEP** | IFP-06; core JSON schema; LD-MATERIALS-COPY spec role; anti-descriptive activity rules | GAM-PRES core; usability; output organisation | Timeline schema; activity-set discipline; output checks |
| **B. REWRITE** | Context/Task; IFP-04/05/09/10; DLA-WB (slim); Constraints/Output; defaultPromptNotes | Material-type (dedupe); GAM-WB (slim); defaultPromptNotes | Pedagogic session shaping (dedupe IFP-07 language if any added at runtime) |
| **C. REMOVE** | IFP-00; IFP-01; IFP-02; IFP-03; IFP-07; IFP-08 | Residual episode-replan phrases in notes; duplicate GAM-WB rows that repeat GAM-PRES | — (none major) |

---

## 3. DLA IFP focus — beat-by-beat deletion analysis

| Block | Owned by Episode Plan now? | Still required in DLA prompt? | Action |
|-------|:----------------------------:|:-----------------------------:|--------|
| **IFP-00** | Orchestration of planning — **yes, superseded** | No — runtime 38S block + population contract | **REMOVE** |
| **IFP-01** | **Yes** — `archetype` | No | **REMOVE** |
| **IFP-02** | **Yes** — ordered `beats[].function` | No | **REMOVE** |
| **IFP-03** | **Yes** — beat set (KM upgrades were replanning) | No in prompt; KM may inform spec *wording* via population contract | **REMOVE** |
| **IFP-04** | Archetype/Evaluate driver rules — **yes** for structure | Partial — obligation *content* inference only | **REWRITE** (~70% removable) |
| **IFP-05** | Beat coverage — **partially** in population contract | Yes — as compact “no shell obligations” | **REWRITE** (~60% removable) |
| **IFP-06** | No | **Yes** — DLA must not spec completed learner memos | **KEEP** |
| **IFP-07** | Cross-activity arc — **not Episode Plan** (EP is per-activity) | No in DLA — belongs Learning Sequence / brief | **REMOVE from DLA** |
| **IFP-08** | **Yes** — population contract derives rows | No | **REMOVE** |
| **IFP-09** | No — spec depth is DLA obligation quality | **Yes** — but reference code/constants, not 38K essay | **REWRITE** (~50% removable) |
| **IFP-10** | Row existence — **partially** in contract validators | Partial — prefer post-capture validation | **REWRITE** (~70% removable) |

**Net IFP:** Remove **~7,700 chars** outright (IFP-00,01,02,03,07,08); rewrite **~3,700 chars** down to **~1,200** compact.

---

## 4. Learning Sequence — unique responsibility

### What Episode Plan does *not* cover

Episode Plan V1 (per activity): `archetype` + `beats[].function` — **intra-episode** instructional order.

### What Learning Sequence uniquely owns

| Responsibility | Layer |
|----------------|-------|
| **Session timeline** (`start_minute`, `duration_minutes`, `timeline[]`) | Cross-activity |
| **Total duration compliance** (fit N activities into 60 min) | Session logistics |
| **`activities_omitted[]`** with time/feasibility reasons | Session logistics |
| **`facilitator_actions` / `learner_actions`** per timeline block | Facilitated delivery script |
| **`transition_to_next`** between session blocks | Session choreography (not beat transitions) |
| **`sequencing_style`** (progressive_scaffold / spiral_revisit / assessment_anchored) | Session-level pedagogy |
| **Material reference traceability** in facilitator script (`material_id` + title) | Delivery ops |
| **Rendered “Session timeline”** section (`app.js` render path) | Learner/facilitator UX |

### Comparison matrix

| Concern | Episode Plan | DLA | GAM | Learning Sequence | Page |
|---------|:------------:|:---:|:---:|:-----------------:|:----:|
| Archetype | ✓ | ~~IFP-01~~ | — | — | — |
| Beat order within activity | ✓ | ~~IFP-02~~ | preserve | — | — |
| Material obligations | — | ✓ | — | — | — |
| Material bodies | — | — | ✓ | — | preserve |
| Activity order across session | — | ~~IFP-07~~ | — | **✓** | order only |
| Minutes / time blocks | — | duration fields | — | **✓** | timing display |
| Omit activity for time | — | — | — | **✓** | via `activities_omitted` notes |
| Facilitator live script | — | facilitator_moves | — | **✓** | — |

### If Learning Sequence disappeared tomorrow

**Lost (specific):**

1. **`learning_sequence` artefact** — no fenced JSON with `timeline`, `activities_used`, `activities_omitted`, `checks`.
2. **Page/render “Session timeline” section** — `renderLearningSequenceBlocks` / `renderLinkedJourneyBlocks` produce nothing (`app.js` ~33115–33127).
3. **Time-feasibility omission record** — no structured `{ activity_id, reason }` when session exceeds duration.
4. **Facilitated delivery choreography** — no per-block `facilitator_actions`, `learner_actions`, `grouping`, `transition_to_next`.
5. **Page timing enrichment** — Design Page uses sequence for **order/timing only**; activities would still appear but without session minute map.
6. **Sequencing style variants** — progressive vs spiral vs assessment-anchored session shapes.

**Not lost:**

- Within-activity beat order (Episode Plan + DLA tags).
- Material obligation structure (DLA).
- Material bodies (GAM).
- Page activity membership or materials merge (Page + GAM preserve).
- Overview / learning_purpose journey (Page + LD-SELF-DIRECTED-RHETORIC).

**Verdict:** Learning Sequence remains **architecturally necessary** for session-timed and facilitated workflows. It is **not** prompt sediment in the same sense as IFP. Phase 1 sanitisation should **not** delete the step — at most trim **~200–400 chars** of pedagogy overlap with removed DLA IFP-07.

---

## 5. Prompt reduction estimate

### Method

Pack `promptTemplate` + `defaultPromptNotes` sizes measured 2026-06-08. Estimates assume **deletion + dedupe**, not new prose (rewrites shrink in place).

### DLA

| Deletion / action | ~Chars removed |
|-------------------|---------------:|
| Remove IFP-00, 01, 02, 03, 07, 08 | ~5,750 |
| Rewrite IFP-04, 05, 09, 10 (net) | ~3,500 |
| DLA-WB dedupe (keep genre checklist + delivery_notes) | ~6,500 |
| Core Task/Context rewrite (net) | ~1,200 |
| Output PRE-EMIT dedupe | ~1,500 |
| defaultPromptNotes trim | ~1,500 |
| **Total removed** | **~19,950** |

| Scenario | DLA total (pack) |
|----------|-----------------:|
| Current | ~33,220 |
| **Phase 1 target (central)** | **~12,000** |
| Optimistic (aggressive dedupe) | ~10,000 |
| Conservative (keep more WB gates) | ~14,500 |

### GAM

| Deletion / action | ~Chars removed |
|-------------------|---------------:|
| GAM-WB dedupe against GAM-PRES | ~6,000 |
| Material-type dedupe against GAM-PRES-03/08 | ~1,500 |
| defaultPromptNotes + header trim | ~1,000 |
| GAM-PRES internal dedupe (EV-GAM mirrors) | ~1,500 |
| **Total removed** | **~10,000** |

| Scenario | GAM total (pack) |
|----------|-----------------:|
| Current | ~28,350 |
| **Phase 1 target (central)** | **~14,500** |
| Optimistic | ~12,000 |
| Conservative | ~17,000 |

### Runtime (Phase 2 — not pack, noted for completeness)

| Block | ~Size | Action |
|-------|------:|--------|
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | ~1,400 | **REWRITE/REMOVE** “short/concise” lines |
| `buildPelOrientationContractPromptBlock` on DLA | ~1,200 | **REMOVE from DLA** after IFP-07 gone |
| 38S population block | ~790 | **KEEP** — move to top when DLA rewritten |

---

## 6. Prompt sediment register

| Prompt block | Introduced for | Superseded by | Candidate action |
|--------------|----------------|---------------|------------------|
| IFP-01 LO-ARC | 38I-3 archetype from LO verb | Episode Plan derive (`episode_plan.archetype`) | **REMOVE** |
| IFP-02 archetype templates | 38J-2 function sequences | Episode Plan `beats[].function` templates | **REMOVE** |
| IFP-03 KM-T01…T08 replan | 38J-3 KM-driven sequence upgrades | Frozen derive + population contract | **REMOVE** |
| IFP-07 session arc | 38J-3 multi-activity fade | Learning Sequence + brief `design_scope` | **REMOVE from DLA** |
| IFP-08 derive from function plan | 38J-3 planning→population | `episode-plan-population-contract.js` | **REMOVE** |
| IFP-00 orchestration | 38J-3 gate order | 38S runtime block + post-capture validators | **REMOVE** |
| DLA-WB-22…31 Evaluate/Analyse packs | 38J/38L archetype-conditioned rows | Beat-mapped obligations from plan | **REWRITE** (genre-only checklist) |
| IFP-10 EMIT-FAIL + Output PRE-EMIT | 38L-2 emission gates | Same rules in DLA-WB + validators | **DEDUPE** |
| DLA “progression understanding→evaluation” | Pre-38J session design | Episode Plan per activity + Learning Sequence | **REMOVE** |
| GAM notes “richer instructional episodes” | 38G ACM trace | Episode Plan + GAM-PRES realisation-only | **REMOVE** |
| GAM-WB-22…31 function-order | 38J-4 | GAM-PRES-01/02 (duplicate) | **REMOVE** |
| GAM-WB F1–F9 + GAM-PRES DEPTH-COLLAPSE | 38E-9 + 38L-3 | Single failure taxonomy | **DEDUPE** |
| Material-type section vs GAM-PRES-03 | 38E accretion | GAM-PRES-03 map | **DEDUPE** |
| Runtime PEL “short micro-example” | Sprint 30 enrichment | GAM-PRES-08 ≥120w | **REMOVE/align** |
| Runtime PEL orientation on DLA | Sprint 30 session journey | Page overview + Learning Sequence | **REMOVE from DLA** |
| 38S population block at prompt tail | 38S-3 | Correct but low salience vs IFP | **REORDER** (implementation phase) |

---

## 7. Ranked deletion plan (highest value first)

### DLA — Phase 1

1. **Remove IFP-01** archetype selection (~730 chars) — Episode Plan owns `archetype`.
2. **Remove IFP-02** function sequencing templates (~2,030 chars) — Episode Plan owns `beats[]`.
3. **Remove IFP-03** KM-trigger replanning (~1,055 chars) — no LLM beat mutation.
4. **Remove IFP-07** session arc (~600 chars) — Learning Sequence / brief own cross-activity arc.
5. **Remove IFP-08** derive-from-plan bridge (~270 chars) — population contract code.
6. **Remove IFP-00** planning orchestration (~1,070 chars) — replace with single population-only gate reference.
7. **Dedupe IFP-10 + DLA-WB-26…31 + Output PRE-EMIT** (~8,000+ chars net) — one obligation checklist + validator.
8. **Collapse DLA-WB** to delivery_notes + mandatory row types (~6,500 chars removed) — drop archetype-conditional duplicates.
9. **Rewrite IFP-04** — delete Evaluate/archetype driver rules; keep brief-only content inference (~860 chars removed).
10. **Rewrite IFP-05** — beat-coverage shell check only (~620 chars removed).
11. **Compact IFP-09** — pointer to L3/`FUNCTION_SPECS` (~535 chars removed).
12. **Rewrite Context/Task** — lead with `episode_plans`; delete “design progression” (~1,200 chars removed).
13. **Trim defaultPromptNotes** — remove IFP/WB essay (~1,500 chars removed).

**Keep without deletion:** IFP-06; LD-MATERIALS-COPY spec role; activity JSON schema; `depth_floor` obligation (compact).

### GAM — Phase 1

1. **Remove GAM-WB-22…25** — duplicate GAM-PRES order/collapse (~1,200 chars).
2. **Merge GAM-WB F1–F9 with GAM-PRES-09/10** (~2,500 chars).
3. **Dedupe material-type section against GAM-PRES-03/08** (~1,500 chars).
4. **Remove defaultPromptNotes episode-shaping line** (~200 chars).
5. **Trim GAM-WB core** — table/scenario/worked/consolidation rules already in GAM-PRES (~2,000 chars).
6. **Compact GAM-PRES EV-GAM / AS-GAM mirrors** (~1,500 chars).
7. **Remove redundant anti-pattern AP-* list** where F-rules repeat (~800 chars).

**Keep without deletion:** GAM-PRES-00–10 (deduped); usability; output organisation; LD-MATERIALS-COPY author role.

### Learning Sequence — Phase 1

1. **No major deletion** — step retains unique responsibility.
2. Optional: trim “increasing complexity / plenary” if DLA IFP-07 removed (~300 chars) — low priority.

### Runtime (Phase 1b — separate from pack)

1. Stop injecting **PEL orientation** on DLA after IFP-07 removal.
2. **Align or remove** GAM PEL reasoning “short/concise” lines.

---

## 8. What must not be deleted (constraints)

Per charter — **do not remove or weaken:**

- Episode Plan V1 schema and derive behaviour (not in DLA/GAM pack anyway).
- Population contract logic in code (`lib/episode-plan-population-contract.js`).
- FunctionEnum / beat vocabulary.
- GAM **realisation** bars (L3 bodies, anti-collapse semantics) — **dedupe only**, do not delete depth intent.
- Page preserve contracts (out of scope).
- Learning Sequence step for session-timed workflows.

---

## 9. Acceptance criteria

| Criterion | Met? |
|-----------|:----:|
| Responsibility map for DLA, GAM, Learning Sequence | ✅ |
| Every major section classified A/B/C | ✅ |
| IFP-00…10 analysed for deletion | ✅ |
| Learning Sequence unique role + loss analysis | ✅ |
| DLA/GAM reduction estimated | ✅ |
| Sediment table | ✅ |
| Ranked deletion plan | ✅ |
| No prompts modified | ✅ |

---

## Appendix — measured block sizes (2026-06-08)

```
DLA template: 30,550 chars | notes: 2,671 | total: 33,221
  Context+core:     3,838
  IFP (all):       11,372
  DLA-WB:          11,842
  Constraints+Out:  3,498

GAM template: 26,544 chars | notes: 1,810 | total: 28,354
  Header+core:      2,228
  GAM-PRES:         7,617
  Material-type:    4,005
  Usability:          542
  GAM-WB:          10,944
  Output org:       1,208

Learning Sequence: 5,067 chars | notes: 250 | total: 5,317
```

**Reference:** IFP introduced 38J-3 ([sprint 38J](../../2026-06-05-sprint-38j-instructional-function-planning/)); Episode Plan planning authority 38R/38S; population contract 38S-2.
