# S80-T-005A — Elicitation-to-workflow-to-Run parameterisation diagnostic

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE** (diagnostic delivered 2026-08-26; awaiting operator acceptance)  
**Mode:** Discovery only — **no implementation, schema, Settings change, or architecture choice**  
**Position:** Evidence insert **before** S80-T-006 (human gate). Does **not** replace S80-T-005.  
**Predecessors:** S80-T-001…T-005 (T-005 still awaiting acceptance unless separately accepted)  
**Next:** Operator review → then S80-T-006 when ready (**Cursor must not choose A/B/C/D**)

---

## 0. Evidence standard

| Tag | Meaning |
| --- | ------- |
| **OBS** | Observed in live code / fixtures |
| **TEST** | Test / fixture evidence |
| **HIST** | Historical intent in docs |
| **INF** | Architectural inference (not claimed as fact) |

---

## 1. Executive conclusion

PRISM Create is a **commissioning / compiler phase**, not a simple form→Settings map.

**OBS:** Learning Design Create combines:

1. **Explicit first-class choices** (notably `ldCreateOutputType`: Self-study vs Workshop; Starting point / `input_strategy`).  
2. **Rich commissioning prose** (`#wfDesignIntent` — “What should this cover?”), which is **composed** with the product prefix and fed to **AI intent interpretation** + **rule inference** + optional **elicitation Q&A**.  
3. That pipeline produces **`resolvedFactors` + `resolvedSources`**, mappings into **constraints / stepParamPatch / notes**, then a second AI call that **generates the workflow topology**, then Create bakes **`override_prompt_body`** and persists **`workflowBriefResolution`**.

**OBS:** At Run, the clearest **late-bound** payload today is **source/transcript content** pasted into Copilot for `provided_source_content` / Normalize paths. Topic, audience, duration, and delivery-shaped product seeds are largely **frozen** in brief resolution, constraints, and/or scaffolds — not a general typed Run interface.

**OBS:** “Settings” and “workflow parameterisation” are **related but not the same problem**. Settings notes are a parallel transport; Create commissioning is the real freeze point for most author intent.

**No product/architecture decision is made here.**

---

## 2. Scope and non-decisions

**In scope:** Current Create → elicitation → workflow → Run behaviour for LD; bake vs late-bind; thought experiments as impact analysis.

**Explicitly not decided:** A/B/C/D; whether workflows should be parameterisable; Settings retain/delete; schemas; elicitation redesign; migrations.

**Compatibility context (operator):** Existing workflows may be deleted/regenerated before Alpha — do not distort target analysis around migration, but document current state honestly.

---

## 3. Complete Create / elicitation input inventory

### 3.1 Visible Workflow Basics (LD) — **OBS** `index.html` ~791–898; `handleStartWorkflowDesign` `app.js` ~21596

| UI label | DOM id | Design-base / state key |
| -------- | ------ | ----------------------- |
| Workflow name | `wfDesignName` | `name` |
| Domain | `wfDesignDomainSelect` | `selectedDomains` |
| What are you creating? | `wfLdCreateOutputType` | `ldCreateOutputType` |
| What should this cover? | `wfDesignIntent` | raw `focusOrIntent` → composed `designIntent` / `goal` |
| Who is this for? | `wfDesignAudience` | `audience` (free text) |
| Scale / scope | `wfDesignScale` | `scopeScale` (free text) |
| Starting point | `wfDesignStartingArtefact` | `startingArtefact` → `input_strategy` values |
| Source-material description | `wfDesignInputs` | `inputs` (description only; not file bind) |

**OBS (S75-D22):** For LD, `desiredOutputs` and `scopeConstraints` are forced empty / hidden. `inputs` cleared unless starting point needs source description.

### 3.2 Values obtained / resolved during elicitation — **OBS** pack + resolve

From `domains/learning-design/domain-learning-design-step-patterns.md` + `resolveWorkflowBriefFactors`:

**Required factors:** `topic`, `learner_level`, `design_scope`, `delivery_pattern`, `input_strategy`  
**Optional:** `duration_minutes`, `delivery_mode`, `delivery_context`, `session_materials`, `page_profile`, `assessment_required`, `learning_environments`, `assessment_strategy`  
**Refinement (selected):** e.g. `coverage_scope`, `cognitive_demand`, `assessment_type`, `difficulty_profile`, `assessment_total_items`, `activity_pattern_mix`, `sequencing_granularity`, `tone_style`, `depth_level`, `include_examples`, … (+ cognition flags via app)

**Not inventing undeclared factors.** Free-text Create `audience` / `scopeScale` are **not** LD `extraFields` lifted into factors (`extraFields: []` for LD — explore brief).

---

## 4. Raw-input type classification (CURRENT behaviour only)

| Input | Origin class | Evidence |
| ----- | ------------ | -------- |
| Workflow name | `STRUCTURED_VALUE` / metadata | Text → `name` |
| Domain | `EXPLICIT_CHOICE` | Domain select |
| What are you creating? | `EXPLICIT_CHOICE` | `self_study_resource` \| `workshop` — **OBS** `LD_CREATE_OUTPUT_TYPE_*` |
| What should this cover? | `RICH_COMMISSIONING_PROSE` | Free text; AI + rules interpret |
| Who is this for? | `FREE_TEXT_PAYLOAD` (+ may feed AI inference of `learner_level`) | Audience string on WOS; enum separate |
| Scale / scope | `FREE_TEXT_PAYLOAD` / `MIXED` | Free text; may cue duration/scope inference; also appended as `scope_scale:` string |
| Starting point | `EXPLICIT_CHOICE` | `generate_from_topic` \| `provided_source_content` \| `mixed` |
| Source description | `FREE_TEXT_PAYLOAD` / commissioning description | Not the Run bytes |
| `topic` (resolved) | `AI_RESOLVED` / `INFERRED_DEFAULT` / elicited | Often inferred from cover prose — **TEST** fixture `resolvedSources.topic: "inferred"` |
| `learner_level` | `MIXED` | Enum; may be explicit/elicited/inferred |
| `design_scope` | `MIXED` | Enum + default `session` |
| Delivery cluster | `MIXED` | **OBS:** LD output-type seed is **explicit** and re-applied last; AI may also propose |
| `duration_minutes` | `MIXED` | Number; prose/scale extraction or elicit |
| `input_strategy` | Usually `EXPLICIT_CHOICE` from Starting point | `startingArtefact` → extract |
| Pack defaults (`session_materials`, `page_profile`, …) | `INFERRED_DEFAULT` | When not explicit |

---

## 5. Create → elicitation → resolution topology

**OBS** ordered pipeline (`app.js`):

```text
handleStartWorkflowDesign (~21596)
  → composeLdCreateDesignIntent(ldCreateOutputType, focusOrIntent) (~18556)
  → buildWorkflowDesignBase (~21257)
  → extractWorkflowBriefExplicitFactors + mergeLdCreateOutputTypeIntoExplicitFactors
  → applyWorkflowBriefInferenceRules
  → callOpenAIForWorkflowIntentInterpretation (~20513)
       AI returns { intent_summary, confidence, factors:[{id,value,confidence}] }
       confidence < 0.45 dropped
  → merge inferred (rules win on overlap)
  → resolveWorkflowBriefFactors (~19459) → resolved + sources + missing
  → [optional] elicitation Q&A: buildWorkflowBriefQuestionText /
       handleWorkflowAnswer → callOpenAIForWorkflowBriefExtraction (~20385)
  → applyWorkflowBriefMappings (~19993) → constraints + stepParamPatch
  → continueWorkflowDesignGeneration (~21328)
       → buildWorkflowDesignBrief (~21279)
       → callOpenAIForWorkflowDesign (~27780)  // topology generation
  → handleSaveDesignedWorkflow (~35315)
       → workflowBriefResolution, workflowOutputSpec,
         [PRISM_STEP_PARAMS] seed, override_prompt_body bake
```

---

## 6. Elicitation AI boundary

| AI call | Role | Deterministic? |
| ------- | ---- | -------------- |
| Intent interpretation | Maps brief prose → candidate factor values | No — probabilistic; filtered by confidence |
| Brief extraction (Q&A) | Captures answers into factor ids | No — structured JSON captures |
| Workflow design generation | Produces step topology / workflow proposal | No — constrained by packs/hints but generative |
| Rule inference / output-type seed | Deterministic overlays | Yes |

**OBS:** After resolution, many factor **meanings** are typed enums/numbers. Replacing an already-resolved enum later would be **deterministic at the value layer** even if stages must regenerate (**§28**).

---

## 7. Resolved-factor inventory (LD core)

| Factor | Type | Typical Create origin |
| ------ | ---- | --------------------- |
| `topic` | text | AI/rules from cover prose |
| `learner_level` | select enum | Prose/audience cues / elicit |
| `design_scope` | select | Infer/default/elicit |
| `delivery_pattern` | select | Output-type seed / infer |
| `input_strategy` | select | Starting point explicit |
| `duration_minutes` | number | Prose/scale / elicit |
| `delivery_mode` | select | Output-type seed |
| `delivery_context` | select | Output-type seed |
| `session_materials` | multi | Default + force `page` |
| `page_profile` | select | Self-study seed `learner` / default |
| `learning_environments` | multi | Seed (vle vs classroom) |
| `assessment_*` | various | Default often `none` for learner-page |
| Refinement set | various | Often skipped if context resolved |

Full choice lists: pack `requiredFactors` / `optionalFactors` / `refinementFactors` (**OBS**).

---

## 8. Enum / valid-choice inventory (selected)

| Key | Allowed values (OBS pack) | Author-direct? | AI/default? | Deterministic after resolve? |
| --- | ------------------------- | -------------- | ----------- | ---------------------------- |
| `ldCreateOutputType` | `self_study_resource`, `workshop` | **Yes** (Create UI) | No | Yes (seeds factors) |
| `input_strategy` / starting point | `generate_from_topic`, `provided_source_content`, `mixed` | **Yes** | Can be inferred | Yes |
| `learner_level` | beginner…postgraduate | Rarely direct Create enum | Often | Yes as enum |
| `design_scope` | single_activity…module | Via scale prose / elicit | Yes | Yes |
| `delivery_context` | in_person…self_directed | Via product seed | Can fight AI then overwritten | Yes |
| `delivery_mode` | live_workshop, seminar, async | Seed | | Yes |
| `delivery_pattern` | face_to_face, blended, mostly_online | Seed | | Yes |
| `page_profile` | learner, facilitator, assessment | Seed/default | | Yes |
| `session_materials` | page, slide_deck | Default+force page | | Yes as set |
| `assessment_strategy` | none…mixed | | Default | Yes |
| `duration_minutes` | 10–480 number | Via prose/scale | | Yes as number |

---

## 9. Free-text semantics inventory

| Text | Treated as | Downstream |
| ---- | ---------- | ---------- |
| Cover / goal (`wfDesignIntent`) | **Rich commissioning prose** | Enters AI intent + design brief; extracted → `topic` etc.; survives in `initialBrief` / often `workflowOutputSpec.goal` |
| Audience | **Free-text payload** (+ cue for `learner_level`) | `workflowOutputSpec.audience`; design brief “Audience:” |
| Scale / scope | **Free-text** cueing duration/scope | `scope_scale:` in constraints string; may drive `duration_minutes` |
| Source description | **Description of future payload** | Brief/inputs; **not** Run transcript bytes |
| Resolved `topic` | **Structured text payload** after resolve | Constraints `topic:`; used as commissioning subject |
| Run transcript paste | **Free-text payload** (late-bound) | Step captures → Normalize / later stages |

**OBS:** Operator observation that detailed cover text steers outputs is consistent with intent-interpretation + design-brief inclusion + topic extraction — not with cover text being a Settings parameter.

---

## 10. Workflow commissioning topology

```text
RAW CREATE INPUTS
  → (compose product prefix)
ELICITATION INPUT (brief JSON + factors catalogue)
  → AI factors + rule inference + optional Q&A
RESOLVED FACTORS / SOURCES
  → mappings (constraints, stepParamPatch)
WORKFLOW COMMISSIONING STATE (design brief + resolved essentials)
  → AI workflow design (topology)
WORKFLOW DEFINITION (steps, deps, domains, WOS, briefResolution)
  → BAKED PROMPT STATE (override_prompt_body)
RUNTIME INPUT (Copilot paste, captures, Settings notes — weak)
  → STAGE ARTEFACTS
```

---

## 11. Create-value destination ledger

| Value | Destinations (OBS) |
| ----- | ------------------ |
| Name | Workflow `name` |
| Domain | `selectedDomains` |
| `ldCreateOutputType` | Compose prefix; explicit factor seed; may sit on `initialBrief`; **not** top-level saved wf field in save path |
| Cover prose | `designIntent`/`goal` → intent AI, design brief, `initialBrief`, often `WOS.goal` |
| Audience | `WOS.audience`, `initialBrief.audience`, design brief |
| Scale | `initialBrief.scopeScale`, `scope_scale:` in constraints |
| Starting point | `startingArtefact`, `resolvedFactors.input_strategy`, topology hints |
| Source description | `inputs` / artefacts description when applicable |
| `topic` | `resolvedFactors`, constraints, mapped bindings |
| Delivery cluster | `resolvedFactors`, constraints, Run scaffolds |
| `duration_minutes` | factors, constraints, `stepParamPatch` → LS notes |
| `learner_level` | factors, WOS.audience (mapping), LO stepParams |
| `page_profile` | factors, constraints, later shell artefact |
| Step prompts | `override_prompt_body` (pack templates; goal passed as seed context) |
| Settings twins | `[PRISM_STEP_PARAMS]` from `stepParamPatch` |

---

## 12. Baked-vs-runtime ledger

| Value / consequence | Classification | Evidence |
| ------------------- | -------------- | -------- |
| Self-study/Workshop → delivery/page seeds | `STRUCTURED_BUT_FROZEN` + `BAKED_INTO_COMMISSION` | Seed into factors; Run scaffolds read frozen factors |
| Cover prose / topic | `BAKED_INTO_COMMISSION` (+ constraints) | Brief resolution + WOS; not late Run topic control |
| Audience string / learner_level | `STRUCTURED_BUT_FROZEN` / `BAKED_INTO_COMMISSION` | WOS + factors; LO bake may embed |
| Duration | `STRUCTURED_BUT_FROZEN` + maps to LS params | Dual notes possible; not live Run dial |
| `input_strategy` / topology | `BAKED_INTO_TOPOLOGY` | Design-time step list |
| Actual transcript bytes | `LATE_BOUND` | Copilot paste + captures |
| Self-directed scaffolds | `MIXED` — late-applied from **frozen** factors | `resolvePedagogicCognitionBriefContextForPrompt` |
| Stage artefacts after Run | `ARTEFACT_MEDIATED` | Downstream consumes artefacts |
| Settings notes edits | `NOT_RUNTIME_RELEVANT` (generally) for prompt authority | T-005; strip on Run |

---

## 13. Prompt-baking audit

| Dimension | In generated step prompts? |
| --------- | -------------------------- |
| Topic | Often via **constraints / brief context**, not always literal full cover in every `override_prompt_body` — pack templates frequently say optional topic/source; **OBS** Create seed may pass empty `selectedOptions` |
| Purpose/cover | In **design brief** for topology AI; in `WOS.goal` / `initialBrief`; not guaranteed verbatim in every step body |
| Audience | WOS + LO options mapping; may appear in seeded LO options |
| Duration | Constraints + LS stepParams; LS prompt depends on bake/Studio |
| Product / self-study | Via composed goal prefix + delivery factors/scaffolds more than a dedicated prompt enum |
| Delivery context | Scaffold augmentations from frozen factors |
| Starting point | Topology more than prompt prose |
| Domain | Selected domains / pack binding |
| Resolved factors | Mapped into constraints string; scaffolds; stepParamPatch |

**OBS fixture:** Educational Psychology WOS constraints embed `topic`, `duration_minutes`, `delivery_context: self_directed`, etc.

---

## 14. Rich goal / purpose findings

**OBS:**

1. Raw `#wfDesignIntent` is required for LD Create.  
2. Composed with product: `"Create a self-study resource: " + focus` (`composeLdCreateDesignIntent`).  
3. Sent to intent AI as `brief.goal` / `brief.design_intent`.  
4. Appears in `buildWorkflowDesignBrief` as Task/Goal lines → topology AI.  
5. Survives in `workflowBriefResolution.initialBrief` and typically `workflowOutputSpec.goal`.  
6. Does **not** become `resolvedFactors.goal`.  
7. Is interpreted into factors (esp. `topic`, often duration/level cues).  
8. **TEST:** Fixture goal contains topic + 60 minute + undergraduate; `topic` inferred; `duration_minutes`/`learner_level` explicit in sources mix.

**INF:** Operator’s experimental observation that detailed cover text steers outputs is explained by (3)+(4)+(7), not by a Settings key named “cover”.

---

## 15. Product Self-study / Workshop findings

**OBS stored values:** `self_study_resource` | `workshop`.

**OBS deterministic seed** (`getLdCreateOutputTypePrimaryFactorSeed`):

| Product | Seeds |
| ------- | ----- |
| Self-study | `delivery_context=self_directed`, `delivery_mode=async`, `delivery_pattern=mostly_online`, `page_profile=learner`; force `session_materials` include `page`; strip classroom → prefer `vle` |
| Workshop | `delivery_mode=live_workshop`, `delivery_context=in_person`, `delivery_pattern=face_to_face`, `learning_environments=["classroom"]`; force `page` in materials |

**OBS:** Seed merged as **explicit**; `applyLdCreateOutputTypePrimaryFactors` re-asserts **last** in pedagogic reconcile — AI does not win primary delivery fields at Create.

**OBS:** Not a separate WOS output-type field; Create-time only control.

**OBS:** No dedicated function that swaps the entire step list solely by output type; topology mainly follows `input_strategy` / scope / assessment packs. Delivery seeds drive constraints + Run scaffolds.

---

## 16. Audience findings

**OBS:** Create audience is free text → `WOS.audience` / brief.  
**OBS:** `learner_level` is a separate enum factor (often inferred from prose).  
**OBS:** Mapping can push `learner_level` into LO `learnerLevel` and overwrite WOS.audience with enum in some paths.  
**INF:** Changing audience after Create is not a single structured Run knob today.

---

## 17. Time / scale findings

**OBS:** Scale field is free text (`scopeScale`); duration is optional number factor.  
**OBS:** Mapped to constraints + LS `stepParamPatch.duration_minutes`.  
**OBS:** Fixture shows `duration_minutes: 60` explicit + `scope_scale: 60 mins` in constraints.  
**INF:** Upstream commissioning (goal prose, design brief, factor set) can encode scale before LS exists — so “LS owns timing artefacts” does **not** mean Create ignored time.

---

## 18. Starting-point findings

**OBS:** Explicit choice → `input_strategy`.  
**OBS:** `provided_source_content` steers Normalize-inclusive topology (**OBS** design policies).  
**OBS:** Source description is optional commissioning text; actual source late-bound at Run.

---

## 19. Source-input findings

**OBS:** Create does not upload/bind files for LD source description.  
**OBS:** Run paste into Copilot + captures = genuine late binding for source bytes.  
**OBS:** Fixed: graph, delivery factors, topic if inferred from Create description, goal/constraints.

---

## 20. Domain findings

**OBS:** `selectedDomains` selects pack / brief config / generation context. Baked into workflow definition. Changing domain post-Create is not a Run parameter.

---

## 21. Current Run input model

| Mechanism | Role |
| --------- | ---- |
| Copilot / chat paste | Primary late-bound content (esp. source) |
| Prior-step captures | Artefact chain |
| Upstream injection in Copy | Artefact-mediated |
| `override_prompt_body` | Frozen prompt authority (or V2 assemblers) |
| Frozen `resolvedFactors` | Scaffold/contracts (delivery etc.) |
| Settings `[PRISM_STEP_PARAMS]` | UI transport; generally **not** Run prompt SoT |
| Studio rebake | **Not** normal Run |

**OBS:** No Create re-elicitation at Run.

---

## 22. Transcript / source reuse trace

**Why it works (OBS):**

1. Create sets `input_strategy=provided_source_content` and description-only `inputs`.  
2. Topology includes Normalize (and dependents).  
3. Each Run, user supplies **new** transcript via Copilot.  
4. Prompt bodies are largely **source-independent instructions**; source is payload.  
5. No AI reinterpretation of workflow **commissioning** required for a new transcript.

This is **genuine late binding** for source bytes — a product proof for **payload-slot reuse**, not proof that all Create dimensions are late-bound.

---

## 23. Topic-generated workflow trace

**OBS:** `generate_from_topic` workflows freeze `topic` in `resolvedFactors` + constraints; goal often names the topic; stages generate content from topic/commission, not from a Run topic control.

---

## 24. Topic-change thought experiment (Lagrange → Photosynthesis)

**OBS stale dependencies if only “thinking” of a new topic without redesign:**

| Store | Still encodes Lagrange? |
| ----- | ----------------------- |
| `resolvedFactors.topic` | Yes |
| Constraints `topic:` | Yes |
| `initialBrief.goal` / `WOS.goal` | Often yes |
| Topology | Same graph (usually) |
| `override_prompt_body` | Usually not topic-specific prose, but context/constraints may still carry old topic into augmentations |
| Stage artefacts from prior Run | Yes — old content |

**Classification impact:** Not `SIMPLE_RUNTIME_SUBSTITUTION` today. Would need at least factor/constraint rewrite + regenerate stages — closer to `RERESOLVE` / `REBUILD_AFFECTED_PROMPTS` / `RECOMMISSION` depending on how deep topic is baked. **No implementation performed.**

---

## 25. Audience-change thought experiment

**OBS dependencies:** `WOS.audience`, `initialBrief.audience`, `learner_level`, LO stepParams / possibly baked LO prompts, shell audience.

**OBS:** Replacing one structured value is **not** sufficient today — multiple stores; LO/downstream artefacts remain old.

**INF:** Some stages could reinterpret a new audience **if** recommissioned/regenerated; existing bodies stay stale otherwise.

---

## 26. Time-change thought experiment (60 → 30)

**OBS dependencies:** `resolvedFactors.duration_minutes`, constraints, `scope_scale` string, LS stepParams, goal prose if it said “60 minute”, design brief history in `initialBrief`.

**OBS:** Changing only LS input/notes would leave contradictions in factors/constraints/goal.

**OBS:** Downstream timing after LS is partly `ARTEFACT_MEDIATED`, but Create already commissioned around scale.

---

## 27. Self-study → Workshop thought experiment

**OBS consequences of original Self-study commission:**

- Frozen delivery_context/mode/pattern, page_profile learner, learning_environments vle  
- Constraints string  
- Composed goal prefix in brief  
- Run self-directed scaffolds from frozen factors  
- Topology **may** be similar if `input_strategy` unchanged — **OBS** no automatic step-list flip by output type alone  

**OBS:** The same saved workflow does **not** expose a live “Workshop” typed control. Alternating product kind is a **Create-time commission**, not a demonstrated late-bound Run enum.

**INF:** Theoretical response to an alternate typed value would require rewriting frozen factors + scaffold behaviour + likely regenerate artefacts; may still share topology — but that is not current product behaviour.

---

## 28. AI reinterpretation vs ordinary regeneration

| Change type | Needs AI to **understand the new value**? | Needs AI stages to **regenerate artefacts**? |
| ----------- | ----------------------------------------- | -------------------------------------------- |
| Duration 60→30 (typed number) | **A — No** | **C — Yes** (LS and possibly upstream scale-sensitive stages) |
| `learner_level` undergrad→postgrad (enum) | **A — No** | **C — Yes** |
| Self-study→Workshop (typed enum + seed) | **A — No** for the enum itself | **C — Yes**; possibly topology/scaffold set changes |
| New cover prose “completely different brief” | **B — Yes** (re-interpret intent) | Yes after re-resolve |
| New transcript paste | **A — No** (payload) | Stages process new payload (**C** for content stages) |
| Topic string replace without re-interpret | **A** if treated as opaque topic payload | **C**; if topic was only one facet of rich cover, full brief may still need **B** |

**OBS:** Enums must remain enums after resolution — free prose ≠ supplying `delivery_context`.

---

## 29. Reuse-feasibility ledger (impact analysis — NOT recommendations)

| Dimension | Current technical implication |
| --------- | ----------------------------- |
| Source/transcript bytes | `SIMPLE_RUNTIME_SUBSTITUTION` (proven) |
| Topic (resolved text) | `RERESOLVE_STRUCTURED_FACTORS` + `REBUILD_AFFECTED_PROMPTS` / regenerate stages — **not** simple today |
| Audience / learner_level | `RERESOLVE` + `RERUN_OWNING_STAGE` (LO+) |
| Duration | `RERESOLVE` + `RERUN_OWNING_STAGE` (LS) + risk of upstream contradiction |
| Self-study ↔ Workshop | `RECOMMISSION_WORKFLOW` (factors/scaffolds/goal); topology `REBUILD_TOPOLOGY` **unclear / not automatic** |
| Starting point / input_strategy | `REBUILD_TOPOLOGY` if switching topic↔source paths |
| Domain | `RECOMMISSION_WORKFLOW` |
| Rich cover prose | `RECOMMISSION_WORKFLOW` (re-elicitation) |
| Settings knobs | `NOT_ENOUGH_EVIDENCE` of honest Run effect without rebake |

---

## 30. Current stale-state risks

1. Settings notes ≠ factors ≠ bodies (T-005).  
2. Goal/topic/duration encoded in multiple stores.  
3. Artefacts from prior Run survive topic/audience mental “swap”.  
4. Self-directed scaffolds trust frozen factors after Settings edits.  
5. Dual duration (workflow vs LS).  

---

## 31. Evidence for / against general parameterisable workflows

**For (feasibility of “elicitation as compiler → typed Run interface”):**

- Typed factor catalogue already exists.  
- `resolvedSources` provenance exists at Create.  
- Output-type and starting point are already deterministic enums.  
- Source late-binding proves payload slots can work.  
- Hybrid ownership (T-004) aligns with typed intent → stage interpreters.

**Against (as current architecture):**

- No general Run typed interface.  
- Rich prose is central to commissioning; many values are AI-resolved once.  
- Topology + baked bodies + frozen factors diverge.  
- Topic/audience/time not late-bound today.  
- Settings catalogue is a false parameter surface.

**Missing primitives:** typed Run contract; Apply/recommission API; clear intent vs resolved vs artefact; single SoT for allowlisted fields.

---

## 32. Evidence for / against payload-only reuse

**For:** Transcript reuse works; many step prompts are instruction-shaped; Alpha corpus can regenerate.

**Against:** Operators also commission topic/audience/time/product in Create; treating only source as variable leaves those frozen — which may be acceptable product-wise but is a **choice**, not current completeness for “reuse everything.”

---

## 33. No-API-key / shared-workflow implications

**Operator context:** Designer commissions with AI; later user runs without design API.

**OBS required for safe execute-without-recommission today:**

- Persisted workflow definition + baked prompts / V2 assemblers  
- Ability to supply **runtime payload** (source) where topology expects it  
- Captures / Copy execution path  
- **No** dependence on Create elicitation AI at Run  

**OBS gaps for broader reuse:** no typed Run form for topic/audience/time/product; changing those currently implies redesign AI or manual Studio surgery.

**Do not design auth/API here.**

---

## 34. Relationship to `resolvedFactors`

Create-time **resolved intent / commissioning context**; often Run scaffold authority; mixture of explicit/inferred/default; **not** a live Run parameter sheet.

---

## 35. Relationship to `override_prompt_body`

Baked prompt artefact from Create/Studio; Run prefers it (or assemblers); orthogonal to Settings; usually **not** full cover-prose dump.

---

## 36. Relationship to `[PRISM_STEP_PARAMS]`

Create seeds from `stepParamPatch`; Settings edits transport; **not** the Create elicitation SoT; weak Run authority.

---

## 37. Relationship to old Settings

| Surviving concept (T-003/4) | Current resemblance |
| --------------------------- | ------------------- |
| C1 Delivery | Resolved factor / product seed — **commissioning**, Settings twin weak |
| C2 Source stance | Create starting point — commissioning + topology; Settings twin |
| C3 Time | Resolved factor + LS params — commissioning; Settings duplicate |
| C4 Breadth | Resolved `design_scope` — commissioning |
| C5 Audience/level | Free text + `learner_level` — commissioning |
| C7 KM facets | Advanced override / step params — not Create core |
| C9 Surface | `session_materials` — product selection / default |
| C10 Profile | Seeded factor — commissioning |
| C11 Assessment | Factors when assessment product |
| DLA pedagogy dials | Obsolete / PRISM-owned — must not regain authority |

**OBS conclusion:** “Settings” ≠ “workflow parameterisation”. Parameterisation question is about **Create commissioning vs Run payload**; Settings was an incomplete/false attempt to expose pack knobs.

---

## 38. Implications for T-004 Hybrid architecture

Hybrid (small author constraint → one interpreter → artefacts) remains compatible with this diagnostic:

- Create already produces typed factors.  
- Run scaffolds already consume frozen delivery factors.  
- Source proves artefact/payload late binding.  
- Do **not** equate Hybrid with “wire Settings notes.”

---

## 39. Implications for T-005 persistence analysis

Reinforces Option C lean:

- Persist **author intent** (explicit Create choices + confirmed factors) separately from AI-inferred fill.  
- Persist artefacts separately.  
- Notes tags = compatibility.  
- Cover prose may need retention as commissioning record even if not a Run parameter.

---

## 40. Missing architectural primitives

1. Typed Run interface (if product wants reuse beyond source).  
2. Recommission vs Run-payload distinction in UX/API.  
3. Apply / stale markers (T-005).  
4. Single allowlisted intent SoT.  
5. Explicit “this workflow’s runtime slots” declaration.  
6. Separation of rich prose archive vs typed slots.

---

## 41. Risks / anti-patterns

- Treating AI-resolved factors as author choices in UI.  
- Exposing cover prose as a “parameter” without recommission.  
- Assuming self-study↔workshop is a Settings toggle.  
- Assuming LS-only duration edit is coherent.  
- Equating Settings survival with parameterisation.  
- Building a second elicitation at Run for shared no-API users.

---

## 42. Questions requiring operator judgement

1. Is **payload-only reuse** (source) enough for Alpha shared workflows?  
2. Which Create dimensions, if any, should become **typed Run slots** vs require **recommission**?  
3. Should rich cover prose remain Create-only forever?  
4. Is Self-study↔Workshop a product fork (separate workflows) rather than a parameter?  
5. For no-API runners: source-only, or also topic/audience/time?  
6. Proceed to T-006 with this evidence, or prototype one reuse path first (product D)?  

---

## 43. Files / code / tests / history inspected

- `app.js` — Create/elicitation/save/Run symbols listed in §§5–15  
- `index.html` — Workflow Basics DOM  
- `domains/learning-design/domain-learning-design-step-patterns.md` — factor catalogue  
- `tests/fixtures/educational-psychology-post-s68/workflow.json`  
- `tests/s75-c06-ld-create-output-selection.test.js` (referenced)  
- S80-T-001…T-005 records  

---

## 44. Files changed

- This record (new)  
- Sprint STATUS / START-HERE / PLAN / HANDOVER / briefing / README / NEXT-SPRINT (T-005A insert)  

No production code.

---

## 45. Sprint records updated

Yes — T-005A recorded as evidence insert before T-006; **T-006 not started**; A/B/C/D not chosen.

---

## 46. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Create inventory complete | MET |
| Pipeline traced with functions | MET |
| Rich goal traced | MET |
| Self-study/Workshop traced | MET |
| Destination + bake/runtime ledgers | MET |
| Run model + transcript reuse | MET |
| Thought experiments evidence-bound | MET |
| A vs B vs C reinterpretation distinction | MET |
| Parameterisation hypotheses assessed without choice | MET |
| Settings relationship clarified | MET |
| No implementation / no T-006 decision | MET |

---

## 47. Exact next action

Operator accepts S80-T-005A (and S80-T-005 if still pending) → open **S80-T-006** as **human decision gate** using T-003–T-005A evidence.

**STOP — T-006 not decided. No Settings/parameterisation implementation.**
