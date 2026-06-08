# 38S Final Architecture Tranche — Residual DLA Prompt Debt Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt or code changes**  
**Type:** Final architecture-tranche DLA sediment audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Authority:** [38S-handover-pack.md](./38S-handover-pack.md) · [Phase 2A DLA sanitisation](./38S-prompt-sanitisation-phase-2a-dla-only.md) · [Phase 1 deletion potential](./38S-prompt-sanitisation-phase-1-deletion-potential.md) · [Responsibility audit](./38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md) · [Phase 2B-b PEL audit](./38S-prompt-sanitisation-phase-2b-b-pel-audit.md)  
**Probe:** `scripts/probe-38b1-ld-workflow-prompt-audit.js` (2026-06-08) · pack §5 `domain-learning-design-step-patterns.md` · `lib/episode-plan-population-contract.js`

**Scope boundary:** Architecture sediment only — **not** teaching-quality optimisation, North Star depth, or LLM prose improvement. Episode Plan, GAM, Page, population contract, and workflow chaining are **out of change scope** for this audit.

---

## Executive summary

**Question:** After Phase 2A removed IFP-00–03/07/08, what DLA prompt debt remains and how much of it conflicts with frozen architecture (`Episode Plan = planning · DLA = population-only · GAM = realisation · Page = compose`)?

**Answer:**

1. **Phase 2A removed ~6.1k chars (~18%) of planning sediment** but **deliberately retained IFP-04–10 + full DLA-WB (~17.2k chars, ~69% of current pack template)** as obligation-quality layers.

2. **Residual debt is architectural, not missing code.** Population contract (`FUNCTION_SPECS`, merge, validators) already owns beat→obligation mapping. The pack still teaches the model to **replan** (`function_sequence`, `replan before emit` ×9), **infer archetypes** (IFP-04 Evaluate drivers), and **design session arc** (DLA-WB-25 ARC-01..06) — behaviours that belong to Episode Plan, Learning Sequence, or post-capture validation.

3. **Triple-stacked gates** — IFP-09/10, DLA-WB-26..31, and PRE-EMIT rows (5)–(8) — repeat the same mandatory material rows (checklist, transfer, independent judgement, worked analytic pass). This preserves obligation depth but costs **~6–8k duplicate chars** and attention decay; the model reads “replan” more often than “populate from upstream `episode_plans`”.

4. **Context/Task framing is still pre-38S.** Opens with *“Design executable learning_activities”* from `learning_outcomes`; `episode_plans` appears only inside IFP header (~char 3970), not in Context. Runtime 38S population block (+789 chars) is correct but **salience-limited** at tail of ~42k augmented prompt.

5. **Runtime DLA augmentation (+~17.7k chars) duplicates pack obligations** — OUTPUT CONTRACT, PEL orientation/reasoning, LD-SELF-DIRECTED-RHETORIC session journey, material-shape checklist cap — without adding population authority. Pack+runtime DLA ≈ **42,190 chars** self-directed (pack 24,491 seeded + 17,699 runtime).

6. **Smallest safe reduction (implementation pass, not this audit):** Compact IFP-04/05/09/10 to **population-contract pointers**; dedupe DLA-WB-26..31 into IFP-10 once; **remove DLA-WB-25** session arc; rewrite Context/Task to population-first; trim PRE-EMIT duplicate rows; slim `defaultPromptNotes`. **Target pack ~14–16k chars (−35–45%)** without weakening `FUNCTION_SPECS` / merge / harness. **Do not** remove IFP-06 anti-spoiler or LD-TABLE-FIDELITY spec role.

**Teaching quality:** Explicitly **out of scope** — this tranche reduces role confusion and prompt mass; depth enforcement stays in population contract + GAM-PRES + validators.

---

## Current measured sizes (2026-06-08)

| Layer | Chars | Notes |
|-------|------:|-------|
| DLA pack `promptTemplate` | **24,826** | Post–2A baseline |
| DLA pack `defaultPromptNotes` | **2,293** | |
| **DLA pack combined** | **27,119** | Was 33,221 pre–2A (−18.4%) |
| DLA seeded (in workflow) | 24,491 | |
| DLA augmented (self-directed) | **42,190** | +17,699 runtime |
| **IFP-04..10 block** (in template) | **~5,404** | IFP-07/08 absent (removed 2A) |
| **DLA-WB block** (in template) | **~11,842** | 31 unique DLA-WB-* row refs |
| Runtime 38S population block | **~789** | `buildDlaPopulationOnlyPromptBlock` |

---

## A. Responsibility map — DLA prompt surfaces

### Pack §5 (`domain-learning-design-step-patterns.md`)

| Block | ~Size | Architectural owner today | DLA population-only? | Verdict |
|-------|------:|---------------------------|:--------------------:|---------|
| **Context + Task + core schema** | ~3,800 | DLA (activity JSON shape) | Partial — still “design” not “populate” | **REWRITE** |
| **IFP header** | ~120 | Episode Plan + runtime 38S | Yes — guard only | **KEEP** (compact) |
| **IFP-04 INFERENCE** | ~1,230 | DLA obligation *wording* + KM/LO inference | Partial — includes archetype/Evaluate replan | **REWRITE** (~60% removable) |
| **IFP-05 ANTI-SHELL** | ~1,035 | Population contract + validators | Partial — `replan function_sequence` | **REWRITE** (~50% removable) |
| **IFP-06 ANTI-SPOILER** | ~730 | DLA spec discipline → GAM handoff | **Yes** | **KEEP** |
| **IFP-09 DEPTH FLOORS** | ~1,070 | DLA L3 specification quality | **Yes** — overlaps `FUNCTION_SPECS` | **REWRITE** → pointer to contract |
| **IFP-10 CLOSURE EMISSION** | ~1,560 | DLA mandatory rows | **Yes** — duplicated 3× | **REWRITE** + dedupe |
| **DLA-WB core (38E–38G)** | ~6,500 | DLA workbook genre obligations | **Yes** (conditional) | **REWRITE** (dedupe) |
| **DLA-WB-22..25 (38J)** | ~1,200 | Gates + session arc | Mixed — WB-25 is LS | **REWRITE / REMOVE WB-25** |
| **DLA-WB-26..31 (38L)** | ~4,100 | Same as IFP-10 G1–G5 | **Yes** — duplicate | **MERGE into IFP-10** |
| **PRE-EMIT + Output JSON** | ~3,500 | DLA output shape | **Yes** | **REWRITE** (dedupe gates) |
| **`defaultPromptNotes`** | 2,293 | Runner summary | Partial | **REWRITE** |

### Runtime augmentation (self-directed learner-page DLA)

| Block | ~Chars | Owner | Duplicates pack? | Verdict |
|-------|-------:|-------|:----------------:|---------|
| Episode Plan population contract | 789 | **38S unique** | No | **KEEP** |
| Self-directed material shape | ~1,450 | DLA formatting | Partial IFP-09 | **MERGE** |
| Self-directed activity framing | ~1,050 | DLA fields | OUTPUT CONTRACT | **MERGE** |
| DLA OUTPUT CONTRACT override | ~2,850 | DLA cognition schema | Pack + IFP | **MERGE** |
| DLA OUTPUT CONTRACT example | ~2,200 | Shape demo | IFP-09 depth | **KEEP** (trim) |
| Timeline sequencing alignment | ~1,522 | DLA→GAM spec | Unique | **KEEP** |
| LD-TABLE-FIDELITY (spec) | ~1,967 | DLA→GAM | Pack line | **KEEP** |
| LD-SELF-DIRECTED-RHETORIC | ~3,412 | Page/activity rhetoric | Session journey | **MERGE** — trim journey |
| LD-MATH-RENDER | ~1,220 | Renderer | Pack ref | **KEEP** |
| PEL orientation (non-workshop) | ~780 | Page / EP arc | IFP removed-07 residue | **REMOVE on DLA** |
| PEL reasoning (non-workshop) | ~520 | Cognition semantics | OUTPUT CONTRACT | **REMOVE on DLA** |

### Code authority (not pack — do not delete)

| Asset | Role |
|-------|------|
| `lib/episode-plan-population-contract.js` | `FUNCTION_SPECS`, beat→obligation, depth semantics |
| `lib/episode-plan-dla-integration.js` | Merge, tagging, PF-11 gate, population block |
| `lib/episode-plan-v1-templates.js` | Deterministic derive |
| Post-capture validators / harness | Structural enforcement independent of prompt length |

---

## B. Audit questions — findings

### 1. Which remaining DLA instructions still imply planning, sequencing, archetype selection, transition design, or session choreography?

| Instruction | Location | Planning behaviour implied |
|-------------|----------|---------------------------|
| *“Design executable learning_activities”* | Context/Task | Greenfield activity design |
| IFP-04 *“when primary_archetype=Evaluate”* / *“replan LO mapping or primary_archetype”* | Pack | Archetype selection (Episode Plan) |
| IFP-05 *“replan function_sequence and population BEFORE emitting JSON”* | Pack | Beat replanning |
| IFP-10 *“replan function_sequence and population before JSON emit”* | Pack | Beat replanning |
| IFP-10 EMIT-FAIL *replan* clauses | Pack | Beat replanning |
| PRE-EMIT *“replan IFP-04–10 before JSON”* | Pack | Full IFP replan loop |
| DLA-WB-25 *“session arc … ARC-01..06 … Evaluate finale”* | Pack | Cross-activity fade / capstone choreography (**Learning Sequence**) |
| *“build coached episodes from beat order”* | defaultPromptNotes | Acceptable if read as populate — but coexists with replan |
| *“Use LO affordances first”* before episode_plans | defaultPromptNotes | LO-driven design vs plan-driven population |
| `facilitator_moves` in output schema | PRE-EMIT | Facilitated session choreography (LS / facilitated DLA) |
| LD-SELF-DIRECTED-RHETORIC session journey | Runtime | Overview/arc language on DLA step |
| PEL orientation session progression | Runtime (non-workshop) | Multi-activity arc planning |

**Not present (correctly removed in 2A):** IFP-00 sequence orchestration, IFP-01 archetype selection, IFP-02 templates, IFP-03 KM triggers, IFP-07 session arc block, IFP-08 derive bridge.

### 2. Which instructions duplicate Episode Plan ownership?

| Instruction | EP owns instead |
|-------------|-----------------|
| IFP-04 Evaluate archetype drivers, LO→Evaluate replan | `episode_plan.archetype` + derive |
| IFP-05 AS-01 *“every R function has population entry”* | Beat list in `episode_plans` |
| IFP-05/10 *“replan function_sequence”* | `episode_plan.beats[].function` order |
| IFP-04 INF inference of function mix from LO alone | Frozen derive + EP capture |
| DLA-WB-25 ARC session fade | Per-activity beats only in EP; session arc in brief/LS |
| Context opening on `learning_outcomes` without `episode_plans` | EP step output is authoritative input |
| defaultPromptNotes *“cognitive levels/progression/outcome intent”* before population | EP beats encode progression |

### 3. Which instructions duplicate GAM material-realisation ownership?

| Instruction | GAM owns instead |
|-------------|------------------|
| IFP-06 *“GAM realises in §6”* (correct boundary statement) | **Keep as one-line ref** — not duplicate if singular |
| IFP-09 L3 body minima (worked walkthrough word bands, pipe table shape) | GAM-PRES-07/08 realisation floors |
| DLA-WB exposition/retrieval **word-count** realisation hints | GAM-WB-01/02/05 |
| LD-MATERIALS-COPY *“GAM authors material bodies”* (×2 pack+runtime) | Correct role split — **keep one ref** |
| IFP-09 *“38K-2 five-dimension sufficiency test”* in full prose | Obligation spec in DLA; **body quality** in GAM |

**Note:** DLA **must** specify material **types** and **specification** strings; duplication is where pack repeats GAM **body minima** (≥120w worked, pipe table realisation) that GAM-PRES already enforces.

### 4. Which instructions are still needed for DLA population-only responsibility?

| Instruction | Why still needed |
|-------------|------------------|
| IFP header *“upstream episode_plans owns archetype and beat order — do not replan”* | Anti-replan guard |
| IFP-06 anti-spoiler spec discipline | DLA must not spec completed learner memos |
| IFP-04 obligation **content** inference (criteria dimensions, scenario constants, Evaluate **spec** shapes) | Population enriches spec text beyond bare `FUNCTION_SPECS` templates |
| IFP-05 anti-shell (no LO→single-task shell) | Quality gate when LLM under-populates beats |
| IFP-09/10 **compact** L3 type/purpose/spec requirements | `required_materials[]` row quality |
| DLA-WB **conditional** genre checklist (worked row, consolidation, scenario, table row, delivery_notes) | Workbook workflows without replanning beats |
| Core JSON schema (activity_id, learner_task, expected_output, required_materials) | Output contract |
| LD-TABLE-FIDELITY spec role | Type→pipe-table **intent** for GAM |
| Runtime population block + upstream JSON injection | Manual workflow PF-11 |
| Timeline sequencing spec (unordered event lists) | Cognitive task spec for GAM |

### 5. KEEP / REWRITE / REMOVE classification

| Surface | Class | Rationale |
|---------|:-----:|-----------|
| Runtime **38S population block** | **KEEP** | Unique architecture authority |
| **IFP header** (do not replan EP) | **KEEP** | Guard |
| **IFP-06** anti-spoiler | **KEEP** | DLA-only spec discipline |
| **Core JSON schema** + activity field list | **KEEP** | Output shape |
| **LD-TABLE-FIDELITY** spec (pack + runtime) | **KEEP** | DLA→GAM handoff |
| **Timeline sequencing** (runtime) | **KEEP** | Spec-only cognitive alignment |
| **LD-MATH-RENDER** | **KEEP** | Renderer contract |
| **DLA-WB core** (38E-8/9 mandatory rows, delivery_notes, F-rules at spec level) | **KEEP** (dedupe) | Workbook obligation checklist |
| **IFP-04** inference | **REWRITE** | Drop archetype/Evaluate replan; keep INF content rules + INF-EVAL-01 anchor |
| **IFP-05** anti-shell | **REWRITE** | Drop `replan function_sequence`; point to population contract + post-capture fail |
| **IFP-09** depth floors | **REWRITE** | Replace essay with `FUNCTION_SPECS` + `depth_floor: L3` pointer |
| **IFP-10** emission gates | **REWRITE** | Single gate list; merge DLA-WB-26..31 |
| **DLA-WB-26..31** | **REMOVE** (merge) | Duplicate of IFP-10 G1–G5 |
| **DLA-WB-22..24** | **REWRITE** | Keep only rows not in IFP-05/10 |
| **DLA-WB-25** session arc ARC-01..06 | **REMOVE** | Learning Sequence / brief owner |
| **PRE-EMIT (5)–(8)** duplicate IFP-10 | **REWRITE** | One PRE-EMIT pointer |
| **Context/Task** | **REWRITE** | Lead with `episode_plans`; Task = populate obligations |
| **`defaultPromptNotes`** | **REWRITE** | Population summary; drop IFP-04–10 essay |
| **PEL orientation/reasoning on DLA** | **REMOVE** | Duplicates OUTPUT CONTRACT; EP/Page own journey |
| **LD-SELF-DIRECTED-RHETORIC on DLA** | **REWRITE** | Trim session journey; keep field-preservation pointers |
| **Material shape checklist ~4 cap** | **REWRITE** | Conflicts IFP-09 ≥4 verification (architecture conflict, not quality tune) |
| **facilitator_moves** in self-directed schema | **REWRITE** | Optional/omit when self_directed (LS owns facilitated) |

### 6. Smallest safe implementation to reduce sediment without weakening obligation depth

**Principle:** Move **replan** semantics to **code validators**; keep **obligation row requirements** as one compact checklist referencing `FUNCTION_SPECS`.

| Step | Action | Est. Δ pack | Risk |
|:----:|--------|------------:|:----:|
| **1** | Rewrite **Context/Task**: Context = `learning_outcomes`, **`episode_plans` (required)**, optional KM; Task = *“Populate `learning_activities` obligations from upstream episode_plans — do not replan beats or archetypes”* | +200 net | Low |
| **2** | Compact **IFP-04/05** to ~400 chars each: content inference + anti-shell without `replan function_sequence` / archetype selection | −1,400 | Low — merge still runs |
| **3** | Replace **IFP-09/10** essays with single **“OBLIGATION POPULATION (38S)”** block: cite `FUNCTION_SPECS`, `depth_floor: L3`, G1–G5 row list once | −2,500 | Med — keep harness assertions |
| **4** | **Merge DLA-WB-26..31 into IFP-10** successor; delete duplicate rows | −3,500 | Med — update workbook tests to new anchor text |
| **5** | **Remove DLA-WB-25** (ARC session arc) | −400 | Low — LS retains arc |
| **6** | Dedupe **PRE-EMIT (5)–(8)** → *“See OBLIGATION POPULATION gates”* | −800 | Low |
| **7** | Trim **`defaultPromptNotes`** to ~800 chars (population + workbook pointer) | −1,500 | Low |
| **8** | Runtime (separate sub-pass): remove **PEL orientation/reasoning** on DLA; merge OUTPUT CONTRACT with pack schema | −3,500 runtime | Med — workshop gating unchanged |

**Estimated pack after steps 1–7:** **~14,000–16,000 chars** (−35–45% from 24,826).  
**Estimated augmented DLA after step 8:** **~38,000 chars** (−10% runtime dedupe).

**Must not remove in this tranche:**

- Population contract merge path or PF-11 injection  
- IFP-06 anti-spoiler  
- Workbook **mandatory row types** (worked_example, consolidation_summary, scenario, table row) — compress wording only  
- `instructional_function` / `plan_beat_index` tagging semantics (code)  
- Harness `ev-38s-production-pipeline-chase.mjs` green bar  

**Explicitly out of scope:** Teaching prose quality, GAM-PRES edits, Page preserve, PEC gating, Episode Plan derive.

---

## C. Direct mapping — residual risk areas

| Risk | Mechanism | Severity | Mitigation (future pass) |
|------|-----------|:--------:|--------------------------|
| **Model replans beats despite EP** | IFP-05/10/PRE-EMIT *replan* ×9 | **High** | Remove replan verbs; rely on merge + PF-11 |
| **EP JSON low salience** | Context leads with LO; IFP at char ~4000 | **High** | Context/Task rewrite + population block placement (already at runtime tail — consider pack lead) |
| **Triple gate stack** | IFP-10 + DLA-WB-26..31 + PRE-EMIT (5)–(8) | **Medium** | Single obligation gate section |
| **Session arc on DLA** | DLA-WB-25 ARC-01..06 | **Medium** | Remove; LS owns timeline |
| **Archetype inference** | IFP-04 Evaluate replan language | **Medium** | Keep INF content rules only |
| **DLA specifies GAM body floors** | IFP-09 L3 word bands duplicated in GAM-PRES | **Low** (signal competition) | Pointer: *“specify depth_floor; GAM-PRES realises bodies”* |
| **Runtime duplication** | ~18k runtime repeats pack + PEL | **Medium** | PEL removal on DLA (2B-b follow-on) |
| **Checklist cap vs IFP-09** | Runtime material shape ~4 items | **Medium** | Align cap with verification ≥4 or scope to “short writing task” only |
| **facilitator_moves on self-directed** | Output schema | **Low** | Omit when self_directed |
| **Teaching depth (North Star)** | Not architecture | **N/A — out of scope** | Separate quality sprint |

---

## D. Duplication vs other steps (pack wording)

| DLA pack text | Duplicates |
|---------------|------------|
| *“pipe tables in GAM”* / LD-MATERIALS-COPY | **GAM** realisation (correct one-line boundary) |
| *“GAM realises per LD-MATERIALS-COPY”* | **GAM** (correct) |
| DLA-WB-25 session arc / fade | **Learning Sequence** + brief duration |
| Session journey / study_orientation rules | **Page** overview + **EP** beats (runtime PEL/rhetoric) |
| IFP-09 body word minima | **GAM-PRES-08** |
| Anti-spoiler consolidation rules | **GAM-WB-06b** (DLA spec vs GAM realisation — **valid split**) |
| `facilitator_moves` field | **Learning Sequence** facilitator script |
| `duration_minutes` + grouping | **Learning Sequence** timing (activity metadata retained for LS input — **keep field**, drop choreography prose) |

**No significant Page-compose or visual-affordance duplication** found in DLA pack (correct).

---

## E. `defaultPromptNotes` — residual debt

Current notes (~2,293 chars) still:

- Open with *“Design executable, directly runnable activities”* (design framing).  
- Prioritise *“Use knowledge_model + learning_outcomes affordances first”* before population.  
- List full **IFP-04–10** and **DLA-WB-26..31** gate names (runner essay).  
- Include *“Page-focused: concise self-directed tasks”* — Page voice leaking into DLA.  
- Reference **38L/38J** sprint IDs — useful for maintainers, noise for model.

**Recommendation:** **REWRITE** to ~600–900 chars: population-only task, EP authority, workbook conditional pointer, runtime module refs, link to `FUNCTION_SPECS` — no IFP enumeration.

---

## F. Comparison to Phase 1 estimate

| Metric | Phase 1 estimate | Post–2A actual | Remaining tranche target |
|--------|-----------------:|---------------:|-------------------------:|
| DLA pack total | ~33k → ~10–14k | **27k** (partial) | **~14–16k** |
| IFP removed outright | IFP-00–08 | 00–03, 07–08 only | — |
| DLA-WB dedupe | ~6.5k savings | **Not done** | ~4–5k in merge step |
| Planning authority clarity | Full | **Partial** | Context/Task + replan removal |

Phase 2A correctly **stopped early** to preserve harness proof; this audit is the **Phase 3 / final architecture tranche** scope for remaining pack sediment.

---

## G. Recommended implementation order (future — not executed here)

1. **Pack Context/Task population-first rewrite** (highest architectural clarity).  
2. **Single OBLIGATION POPULATION block** replacing IFP-09/10 + DLA-WB-26..31 + PRE-EMIT duplicate rows.  
3. **IFP-04/05 compact** — remove replan/archetype language.  
4. **Remove DLA-WB-25** session arc.  
5. **defaultPromptNotes** slim.  
6. Update **`workbook-contract-prompt-surface.test.js`** anchors (gate text moves, not semantics).  
7. Run **`episode-plan-dla-integration`**, **`workflow-ld-episode-plan-step`**, **`ev-38s-production-pipeline-chase.mjs`**.  
8. **Runtime sub-pass (optional):** DLA PEL dedupe per Phase 2B-b (no PEC gate change).  
9. Manual Inflation DLA copy — confirm `### Upstream episode_plans` + no replan language in copied prompt.

---

## H. Success criteria (audit)

| Criterion | Met? |
|-----------|:----:|
| IFP-04–10 audited | ✓ |
| DLA-WB audited | ✓ |
| defaultPromptNotes audited | ✓ |
| Cross-step duplication identified | ✓ |
| KEEP / REWRITE / REMOVE table | ✓ |
| Smallest safe plan without weakening obligation depth | ✓ |
| No code/prompt changes | ✓ |
| Teaching quality explicitly out of scope | ✓ |

---

## Related artefacts

- [38S-handover-pack.md](./38S-handover-pack.md)  
- [38S-prompt-sanitisation-phase-2a-dla-only.md](./38S-prompt-sanitisation-phase-2a-dla-only.md)  
- [38S-prompt-sanitisation-phase-1-deletion-potential.md](./38S-prompt-sanitisation-phase-1-deletion-potential.md)  
- [38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md](./38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)  
- [38S-prompt-sanitisation-phase-2b-b-pel-audit.md](./38S-prompt-sanitisation-phase-2b-b-pel-audit.md)  
- `../artefacts/EV-38S-2A-dla-prompt-metrics.json`  
- `scripts/probe-38b1-ld-workflow-prompt-audit.js`  
- `lib/episode-plan-population-contract.js`  

---

*End of final architecture-tranche DLA residual audit (read-only).*
