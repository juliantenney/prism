# Workflow Step Settings — Catalogue, Effectiveness and Architecture Diagnostic

**Kind:** Architecture / product diagnostic (not a sprint task)  
**Status:** COMPLETE (2026-08-26)  
**Mode:** DIAGNOSTIC ONLY — no production code, UI, prompts, schemas, validators, or tests changed  
**Sprint 78:** remains **CLOSED**  
**Related backlog:** [PB-FA-005](../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)  
**Related architecture:** [augmentation-paths-diagnostic.md](augmentation-paths-diagnostic.md) · [completeness-validation-audit.md](completeness-validation-audit.md)

---

## Verdict (executive)

PRISM’s Settings tab creates a **strong product promise** (“Tune workflow and step parameters”) backed by a **real pack-declared catalogue** (~21 visible controls on a typical Learning Design learner-page workflow).

That catalogue is **partly the right product surface** (especially workflow-level delivery/scope/duration/input strategy, and some stage tunables).

But **Settings → Save → Run is not a reliable causal path**. Live Run/Copy generation predominantly consumes:

- create-time `override_prompt_body`;
- frozen `workflowBriefResolution.resolvedFactors`;
- runtime contract augmentations keyed off those factors;

while Settings edits persist mainly as `[PRISM_STEP_PARAMS]` in notes. Prompt Studio can re-bake drafts from params; Run does not consistently re-interpret them.

**Decision: C — SETTINGS REQUIRE PRODUCT/ARCHITECTURE REDESIGN**  
(catalogue review + typed policy authority + Run consistency; not merely polish).

**Sequencing: 2 — SETTINGS DESIGN FIRST; GAM REORGANISATION BUILDS THE INGRESS; SETTINGS IMPLEMENTATION AFTERWARD.**

---

## 1. Current settings inventory

### Declaration source

| Source | Role |
| ------ | ---- |
| `domains/learning-design/domain-learning-design-step-patterns.md` → `workflowBriefConfig.workflowParameterControls` / `stepParameterControls` | **Authoritative LD catalogue** |
| `domains/research/domain-research-step-patterns.md` | Brief config present; **0** Settings parameter controls |
| `app.js` | UI render, badge count, persistence helpers, Run/Studio assembly |
| `workflowGenerationContext.js` → `getWorkflowBriefConfig` | Loads pack briefConfig |

Pack-declared LD totals if every controlled step is included: **4 workflow + 37 step = 41**. Typical learner-page graph shows **~21** visible (see §2).

### Workflow-level (4) — all `elicitation: settings-only`

| Key | Label | Type | Default | Values (summary) |
| --- | ----- | ---- | ------- | ---------------- |
| `delivery_context` | Delivery context | select | `blended` | in_person, online_sync, online_async, blended, self_directed |
| `design_scope` | Design scope | select | `session` | single_activity, session, sequence, module |
| `input_strategy` | Input strategy | select | `generate_from_topic` | generate_from_topic, provided_source_content, mixed |
| `duration_minutes` | Session duration (minutes) | number | 60 | min 10 / max 480 |

Persistence: `workflow.notes` `[PRISM_STEP_PARAMS]…[/PRISM_STEP_PARAMS]` (+ workflow JSON in `localStorage` `promptr.workflows.v1`). Brief resolution also maps factors into `workflowOutputSpec.constraints` / `resolvedFactors` **at create/resolve time**.

### Step-level (by canonical step)

| Canonical step | Count | Keys (summary) |
| -------------- | ----- | -------------- |
| `step_model_knowledge` | 3 | `include_relationships`, `include_misconceptions`, `include_processes` |
| `step_normalize_content` | 3 | `structure_mode`, `detail_level`, `keep_examples` |
| `step_define_learning_outcomes` | 4 | `learnerLevel`, `numberOfOutcomes`, `cognitiveEmphasis`, `scope` |
| `step_design_episode_plan` | **0** | — |
| `step_design_learning_activities` | 4 | `activity_pattern_mix`, `grouping_preference`, `difficulty_level`, `coverage_breadth` |
| `step_generate_activity_materials` | 1 | `session_materials` |
| `step_construct_learning_sequence` | 3 | `duration_minutes`, `sequencing_granularity`, `sequencing_style` |
| `step_design_page` | 2 visible | `page_profile`, `include_examples` (other PF `userOptions` not in Settings) |
| `step_design_assessment` | 7 | activity_type, totals, difficulty, cognitive, cadence, feedback… |
| `step_generate_assessment_items` | 10 | item count, formats, difficulty, coverage, composition… |
| Generate Learning Content / many downstream | 0 | coverage gap or non-tunable |

Persistence: matching `step.notes` `[PRISM_STEP_PARAMS]` blocks.

**Not Settings (but related):** optionalFactors / mappingRules (`tone_style`, `depth_level`); Prompt Studio-only options; Create brief elicitation factors.

---

## 2. Explanation of Settings count (“21”)

**Function:** `countUnifiedWorkflowVisibleParameterControls(workflow, briefConfig)` (`app.js`)  
**UI:** `#workflowModeSettingsBadge` via `refreshWorkflowModeSettingsTabBadge`

**Counts:** length of **visible** workflow parameter controls **+** visible step parameter controls for **included** steps that match a `canonical_step_id` with pack declarations. Hidden (`visible: false`) excluded.

**Typical learner-page = 21:**

| Layer | n |
| ----- | - |
| Workflow | 4 |
| Model Knowledge | 3 |
| Learning Outcomes | 4 |
| Episode Plan | 0 |
| DLA | 4 |
| GAM | 1 |
| Learning Sequence | 3 |
| Design Page | 2 |
| **Total** | **21** |

It counts **declarations currently shown**, not proven-active behavioural levers. Adding Assessment / Normalize steps raises the badge (operator reports ~25 match).

---

## 3. Stage-owned degrees of freedom

| Stage | Non-negotiable invariants (operator must not weaken) | Safe degrees of freedom (examples) |
| ----- | ---------------------------------------------------- | ---------------------------------- |
| Workflow / session | Schema validity; one-product intent; fail-closed capture | Delivery context; scope; duration; input strategy |
| Model Knowledge | Honesty of source-bound claims | Optional richness: relationships / misconceptions / processes |
| Episode Plan | FunctionEnum / archetype grammar; no illegal beats | Generally **none** at Settings (deterministic derive) |
| DLA | WS1 production bind; WS2 independence; evidence closure; DP warrant | Scaffold intensity / grouping preference **within** contracts — careful |
| GAM | Materials 1:1; blanks; transfer≠closure; no `page_synthesis` | Session materials product shape (`page` / deck) — topology honesty |
| Learning Sequence | Must reference existing activities only | Duration allocation; granularity/style |
| Design Page | Thin assembly; materials preserve; knowledge_summary | page_profile; optional examples |
| Graphics | VA planning honesty | Deferred/missing assets policy (soft today) |
| Export | Learner-ready page | Presentation options (limited) |

Sprint 78 contracts (independence, fulfilment, transfer/closure, DP) are **policy invariants**, not Settings knobs.

---

## 4. Current UI vs legitimate-choice matrix

| Stage | Legitimate choice | Exposed now? | Control | Verdict |
| ----- | ----------------- | ------------ | ------- | ------- |
| Workflow | Delivery mode | Yes | `delivery_context` | **GOOD FIT** (catalogue); wiring weak at Run |
| Workflow | Design breadth | Yes | `design_scope` | **GOOD FIT** / wiring weak |
| Workflow | Topic vs source | Yes | `input_strategy` | **GOOD FIT** / wiring weak |
| Workflow | Duration | Yes | `duration_minutes` | **GOOD FIT** / wiring weak |
| Model Knowledge | Optional knowledge facets | Yes | include_* | **GOOD FIT** if Studio-baked; **QUESTIONABLE** for Run-as-Settings |
| Episode Plan | Beat/archetype micromanagement | No | — | **SHOULD BE PRISM POLICY** (no Settings) |
| LO | Outcome count/level | Yes | LO controls | **GOOD FIT** if delivered to LO prompt |
| DLA | Grouping / difficulty mix | Yes | DLA controls | **QUESTIONABLE** vs canonical contracts (risk of competing policy) |
| GAM | Page vs slide_deck | Yes | `session_materials` | **QUESTIONABLE** (product topology; PB-FA-008) |
| LS | Timing style | Yes | LS controls | **GOOD FIT** if duration authoritative |
| Design Page | Learner vs facilitator page | Partial | `page_profile` | **GOOD FIT** / incomplete option set |
| Generate Learning Content | Content richness | No | — | **MISSING CONTROL** or intentional none — **INSUFFICIENT EVIDENCE** for add |
| Assessment family | Many item tunables | Yes when steps included | many | Mix — some GOOD FIT for assessment product; LD learner-page often N/A |

---

## 5. Episode Plan settings verdict

**INHERIT WORKFLOW POLICY ONLY** (and **NO SETTINGS NEEDED** at step level).

Evidence:

- Pack declares **zero** `step_design_episode_plan` controls.  
- Prompt factory: `configurationMode: "none"`, `executionMode: "deterministic_derive"`.  
- Live path is v2 shell / deterministic population — archetype & FunctionEnum are **invariants**, not operator knobs.  
- Upstream `delivery_context` / `design_scope` / `duration_minutes` already express session intent.  
- Exposing EP Settings would invite micromanagement of instructional grammar (Sprint 75 intentionally documented no Settings).

---

## 6. End-to-end wiring table (pattern)

| Boundary | Classification |
| -------- | -------------- |
| Settings UI ↔ DOM | **PRESENT** |
| Sync → `[PRISM_STEP_PARAMS]` notes | **PRESENT** (`syncUnifiedWorkflowSettingsToStepNotes`) |
| Save → `localStorage` workflow JSON | **PRESENT** |
| Settings notes → `resolvedFactors` refresh | **DROPPED / IGNORED** after create (factors frozen) |
| Settings notes → Run `buildWorkflowStepInstructions` | **DROPPED / OVERRIDDEN** by override body + contracts |
| Settings notes → Studio draft bake | **TRANSFORMED** (`applyWorkflowStepPromptDefaults` / option map) when operator regenerates |
| Runtime scaffolds (`applyWorkflowStepRuntimePromptAugmentations`) | Read **resolvedFactors** / brief — **LEGACY-ONLY relative to Settings edits** |
| Path-specific | Studio can honour params; Run often does not |

Earliest divergence after Settings edit: **failure to re-resolve brief/factors and re-project into Run prompt authority**.

---

## 7. Final live-request delivery findings

| Setting class | Reaches final Run instructions? | How |
| ------------- | ------------------------------- | --- |
| Workflow delivery/scope/duration/input | **Often yes as create-time residue**, not as live Settings | Frozen factors + constraints + scaffold gating |
| Model Knowledge include_* | **Studio:** inject/strip `promptInstructionWhenTrue`. **Run:** only if override already baked | Instruction lines, not schema fields |
| LO `{{option:*}}` | **Studio** substitutes; **Run** uses baked override | Template placeholders |
| DLA step params | Compete with **canonical DLA contracts** (stronger) | Low salience vs 78-DLA / WS blocks |
| GAM `session_materials` | Topology / output-spec residue | Product shape, not material quality |
| Design Page Settings | Partial; DP heavily contract-driven | |

Changing a Settings value and clicking Run **without** recreate/Studio re-bake frequently yields **no distinct live instruction difference**.

---

## 8. Per-setting effectiveness (summary classes)

| Class | Settings |
| ----- | -------- |
| **EFFECTIVE** (when create-time resolve / Studio bake is current) | `delivery_context` → self-directed scaffolds; `input_strategy` → Model Knowledge inclusion topology; LO options in baked LO prompt; MK include_* after Studio bake |
| **WEAK** | DLA difficulty/grouping vs canonical DLA contracts; Design Page `include_examples` amid thin-assembly rules; duration if LS not re-run |
| **WIRED BUT INERT** (Settings notes present; Run ignores) | Most step params after Settings-only edit without re-bake |
| **NOT DELIVERED** (as Settings→Run) | Same as inert for Run path |
| **PATH-SPECIFIC** | Studio honouring vs Run ignoring |
| **UNKNOWN** | Rare edge packs / Research (no controls) |

Detailed KEEP/HARDEN/REMOVE in §17.

---

## 9. Observable consequence contracts (retained candidates)

| Setting | When changed, should alter | Must remain invariant |
| ------- | -------------------------- | --------------------- |
| `delivery_context` | Facilitation vs self-study rhetoric; grouping assumptions; LS framing | Schema; WS1/WS2; evidence closure; transfer/closure separation |
| `design_scope` | Outcome/activity breadth; sequence vs single-session shape | Validity; independence; DP warrant |
| `input_strategy` | Whether Model Knowledge / source-bound path is in graph | No invented sources; attachment honesty |
| `duration_minutes` | LS timing allocation; activity duration projection | Learning-outcome coverage; required relationships |
| MK `include_misconceptions` | Presence of misconception nodes/prose in KM | Source honesty; no fabricated misconceptions without warrant |
| LO `numberOfOutcomes` | Count of outcomes commissioned | Outcome quality/validity rules |
| `session_materials` | Whether page-only vs sibling deck artefact | One-product honesty (PB-FA-008) |

If a contract cannot be stated, the control should not remain as Settings.

---

## 10. Workflow-level settings audit

### Delivery context

- **Actual:** Strong effect via **resolvedFactors** on self-directed scaffold injection and rhetoric contracts; create-time topology.  
- **Settings edit alone:** Often **does not** refresh those factors.  
- **Should:** Own cross-stage delivery policy interpreted by DLA/GAM/LS/DP owners — not arbitrary sentence splicing everywhere.

### Design scope

- **Actual:** MappingRules → constraints / graph expectations at resolve.  
- **Should:** Bound activity/outcome breadth; not weaken completeness.

### Input strategy

- **Actual:** Affects whether Model Knowledge / source path is included.  
- **Should:** Remain workflow topology policy.

### Session duration

- **Actual:** Mapped into constraints + LS duration defaults at resolve; T-037 projects timing when present.  
- **Should:** Drive LS allocation; not invent fake durations without LS re-run.

---

## 11. Step-level settings audit

| Step | Ownership fit | Notes |
| ---- | ------------- | ----- |
| Model Knowledge | Good optional richness | Run inert unless baked |
| Normalize | Legitimate when step present | Same authority gap |
| Learning Outcomes | Good | Template options; bake required |
| Episode Plan | None | Correct |
| DLA | Risky | Stage owns contracts; many Settings compete with canonical DLA |
| GAM | Thin | `session_materials` is product topology more than GAM pedagogy |
| Learning Sequence | Good timing policy | Needs authoritative duration |
| Design Page | Partial | Contracts dominate |
| Assessment* | Dense catalogue | Appropriate for assessment product workflows |

---

## 12. Apparent-choice risk

| Risk | Examples |
| ---- | -------- |
| **HIGH** | Editing any of the ~21 controls and expecting Run to change immediately — UI copy implies it |
| **MEDIUM** | DLA difficulty/grouping appearing to override Sprint 78 contracts |
| **LOW** | Advanced-only MK `include_processes` when unused |

---

## 13. Execution-path consistency

| Path | Settings consumption |
| ---- | -------------------- |
| Settings tab edit + Save | Persist notes — **CONSISTENT** for storage |
| Prompt Studio step config | Can bake params into draft/override — **PARTIAL** |
| Workflow Run / Copy | Frozen factors + overrides + runtime contracts — **PATH-SPECIFIC / NOT USED** for live Settings notes |
| Saved-workflow re-open | Shows Settings values — **CONSISTENT** display |
| Manual Utilities paste | Settings N/A |

---

## 14. Persistence / provenance

- **Saved:** notes param blocks + `workflowBriefResolution.briefConfig` metadata + localStorage workflows.  
- **Downstream stale:** Changing Settings does **not** invalidate captured stage artefacts (completeness/freshness hand-off).  
- **Artefact provenance:** Generated pages do **not** generally record “settings fingerprint” of influencing values.  
- **Single-step rerun after workflow Settings change:** High risk of incompatible mix of old factors and new notes.

---

## 15. Existing test coverage

| Suite | Proves |
| ----- | ------ |
| `tests/unified-workflow-settings.test.js` | UI aggregation, visibility, sync to notes — **UI / STATE** |
| `tests/workflow-step-parameter-controls.test.js` | Control normalization / section render — **UI / STATE** |
| `tests/workflow-settings-discoverability.test.js` | Discoverability — **UI** |
| Sprint 75 / PB-FA-005 notes | Document Run authority gap — **not automated Run consequence** |

**False confidence:** passing Settings tests ≠ Settings change Run output.

---

## 16. Historical intent

| Era | Intent |
| --- | ------ |
| Sprint 20–22 | Unified Settings surface; pack-declared tunables; badge; notes persistence |
| Prompt Factory | Step `userOptions` / template options for Studio |
| Brief resolve / mappingRules | Create-time factor → constraint topology |
| Sprint 75 / PB-FA-005 | Confirmed Settings important **and** Run authority broken; deferred redesign |
| Post–Sprint 77–78 | Canonical DLA/GAM contracts dominate generation — Settings must not bypass them |

Settings began as **genuine operator steering + pack configurability**, but authority fragmented as runtime contracts grew.

---

## 17. Per-setting KEEP / HARDEN / … (pre-alpha posture)

| Control | Action |
| ------- | ------ |
| `delivery_context`, `design_scope`, `input_strategy`, `duration_minutes` | **KEEP + HARDEN** (typed workflow policy → Run) |
| MK include_* | **KEEP + HARDEN** (stage authoring policy) or hide until wired |
| LO options | **KEEP + HARDEN** |
| LS duration/granularity/style | **KEEP + HARDEN** |
| DLA grouping/difficulty/mix/breadth | **REDESIGN** or **REMOVE/HIDE** until safe bounds defined vs contracts |
| GAM `session_materials` | **MOVE** toward product topology / Create honesty (PB-FA-008) |
| Design Page `page_profile`, `include_examples` | **KEEP + HARDEN** / complete option set carefully |
| Assessment dense set | **KEEP** for assessment workflows; **INSUFFICIENT EVIDENCE** for LD learner-page |
| Episode Plan | **NONE** |
| Unwired / inert after Settings-only edit | Treat as **REMOVE/HIDE** until authority fixed |

---

## 18. Missing-setting recommendations (evidence-led)

| Proposal | Stage | Why | Pre-alpha? |
| -------- | ----- | --- | ---------- |
| (None mandatory) | — | Fix authority before expanding catalogue | — |
| Optional: “Settings apply after re-resolve / re-bake” honesty | Workflow UI | Restores trust | Yes (design) |
| Generate Learning Content richness | GLC | Only if step remains LLM-driven and tunable | After authority |
| Episode Plan Settings | EP | **Not justified** | No |

Do not add micromanagement of WS1/WS2/transfer as Settings.

---

## 19. Proposed settings architecture

Preferred shape:

```text
UI setting
  → typed workflow/stage policy object (single source of truth)
  → stage-owned interpretation (DLA/GAM/LS/DP/MK owners)
  → deterministic prompt/operation projection + runtime contracts
  → generated artefact
  → optional provenance (settings/policy fingerprint)
```

**Avoid:** dropdown → free-text sentence → append somewhere in prompt.

Compare to today: UI → notes blob → **divergent** factors/overrides/contracts.

---

## 20. Typed policy model

| Category | Examples | Current support |
| -------- | -------- | --------------- |
| Workflow design policy | delivery, scope, duration, input | Declared; resolve-time only |
| Stage authoring policy | MK includes; LO count | Declared; Studio/bake partial |
| Execution settings | model/provider | Largely elsewhere |
| Optional-stage policy | include MK step | Topology via input_strategy |
| Presentation policy | page_profile | Partial |

Infrastructure **conflates** pack controls, brief factors, override bodies, and runtime contracts — does **not** cleanly separate these types.

---

## 21. Validation interaction

Default: **Settings must not weaken Sprint 78 / schema invariants.**

If a setting legitimately changes requirements (e.g. misconceptions off → optional KM field), validators need **policy-aware optionality** — do not implement now; design must specify.

Duration changes should imply LS/timing recompute — completeness/freshness concern.

---

## 22. Non-negotiable invariants vs operator freedom

| Area | Operator may influence | Operator must not override |
| ---- | ---------------------- | -------------------------- |
| Delivery framing | self-study vs facilitated rhetoric | Fail-closed capture; accessibility |
| Scope/duration | breadth/timing allocation | Outcome coverage honesty |
| Knowledge richness | optional facets | Source fabrication |
| DLA/GAM pedagogy | limited scaffold preferences | WS1/WS2/evidence/transfer≠closure/DP |
| Materials product | page vs future slideshow topology | Schema validity |
| Episode Plan | — | Archetype/FunctionEnum grammar |

---

## 23. GAM reorganisation hand-off

**Preserve behaviourally:** current GAM contracts (1:1 materials, blanks, closure host, enrich partial).

**Do not bake into new GAM:** ad-hoc reading of inert Settings notes; free-text setting splicing.

**Build ingress for:** typed **workflow design policy** + optional **stage authoring policy** block consumed by GAM fulfilment (e.g. delivery rhetoric already partly via scaffolds — centralise).

**Tests to preserve:** pack-text / enrich / blank-cell / T-055 separation — not Settings UI tests as Run authority proof.

**Defer Settings implementation** until policy contract designed; GAM reorg only adds a clean **policy input slot**.

---

## 24. DLA lessons

DLA’s clearer shape:

```text
policy/commission → owned sections → authoring rules → output contract → silent pre-emit
```

Settings should inject **typed policy at the front**, not compete mid-contract. DLA should remain the model for stage-owned interpretation.

---

## 25. Workspace-surfaces hand-off

Settings architecture may later support **coarse** workspace policy (e.g. prefer structured vs text production) only if evidence justifies — **not** per-widget operator selection. Completeness invariant “production → surface” stays validation, not a Settings escape hatch.

---

## 26. Completeness / freshness hand-off

| Issue | Risk |
| ----- | ---- |
| Settings change without invalidating captures | **MEDIUM–HIGH** apparent coherence |
| No settings provenance on artefacts | **MEDIUM** |
| Validators unaware of policy-optional fields | **LOW–MEDIUM** until policy typed |
| Stale Run under old factors after Settings edit | **HIGH** product trust |

Reference completeness + augmentation diagnostics; do not implement fingerprints here.

---

## 27. Proposed pre-alpha settings catalogue

| Level/stage | Current | Proposed | Action | Rationale |
| ----------- | ------- | -------- | ------ | --------- |
| Workflow | 4 core | Same 4 | **HARDEN** | Right catalogue; fix authority |
| Model Knowledge | 3 | Same 3 | **HARDEN** or hide until wired | Legitimate richness |
| Episode Plan | 0 | 0 | **NONE** | Correct |
| LO | 4 | Keep | **HARDEN** | Meaningful |
| DLA | 4 | Reduce/redesign | **REDESIGN** | Avoid fighting contracts |
| GAM | 1 | Topology elsewhere or harden | **MOVE/HARDEN** | Product honesty |
| LS | 3 | Keep | **HARDEN** | Timing policy |
| Design Page | 2 | Keep (+ review missing options) | **HARDEN** | Partial fit |
| Assessment* | many | Keep for assessment graphs | **KEEP** | Product-specific |
| Honesty layer | — | Explicit Run authority / re-resolve | **ADD** (design) | Trust |

---

## 28. Decision

**C. SETTINGS REQUIRE PRODUCT/ARCHITECTURE REDESIGN**

The UI creates a meaningful configurability promise; the catalogue is partially sound; causal wiring and authority are not coherent enough for implementation-first hardening alone. A design task (PB-FA-005) is required before coding. Interim honesty measures belong in that design.

Not **A** (Run authority broken). Not **B** alone (catalogue also needs pruning/redesign at DLA/GAM). Not **D** as sole answer (workflow-level controls should remain after redesign — but honesty/hide of inert controls is part of C).

---

## 29. Sequencing recommendation

**2. SETTINGS DESIGN FIRST; GAM REORGANISATION BUILDS THE INGRESS; SETTINGS IMPLEMENTATION AFTERWARD**

Why:

- Behaviour-preserving GAM reorg must not entrench notes-blob Settings.  
- Typed policy contract must exist before a clean GAM (and DLA/LS) ingress.  
- Implementing Settings against today’s divergent authority wastes work.  
- Hypothesis confirmed by PB-FA-005 + live path split (Studio bake vs Run factors).

---

## 30. Smallest justified next action

1. Treat this record + **PB-FA-005** as the Settings programme brief.  
2. Open a **design-only** task (not Sprint 78): define typed workflow/stage policy, Run authority, KEEP/HIDE list, honesty UX.  
3. Hand GAM reorg a **policy ingress** requirement — no Settings feature work inside that reorg.  
4. Do **not** expand the Settings catalogue meanwhile.

---

## 31. Files inspected

- `app.js` — Settings UI, count, sync, prompt defaults, Run assembly, runtime augmentations  
- `workflowGenerationContext.js` — briefConfig load  
- `domains/learning-design/domain-learning-design-step-patterns.md` — catalogue  
- `domains/research/domain-research-step-patterns.md` — no controls  
- `tests/unified-workflow-settings.test.js`, `workflow-step-parameter-controls.test.js`  
- `docs/backlog/PRODUCT-BACKLOG.md` PB-FA-005  
- Sprint 22 CURRENT-STATE; Sprint 75 S75-T-010 / Settings observations  
- Completeness + augmentation architecture diagnostics  

---

## 32. Files changed (docs only)

- This record: `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`

---

## 33. Sprint 78 confirmation

**Sprint 78 remains CLOSED.** This diagnostic does not reopen it or alter Final Gate / T-013 dispositions.
