# Sprint 17 — Research Elicitation & Sparse Brief Testing (prep)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md`  
**Status:** **Preparation / audit only** — no implementation charter. Sprint **16** is **closed** (shared `page` renderer; 80 tests green).

**Sprint 17 focus:** Use the **simpler Research domain** to improve **planning, factor-resolution, and elicitation** in a **bounded, reusable** way — **not** renderer work, **not** schema redesign, **not** “Research as complex as LD”.

**Related:** [`sprint-16-renderer-page-contract-stabilisation.md`](sprint-16-renderer-page-contract-stabilisation.md), [`sprint-15-charter.md`](sprint-15-charter.md), [`sprint-14-current-known-issues.md`](sprint-14-current-known-issues.md).

---

## 1. Sprint 17 intent

| In scope | Out of scope |
|----------|----------------|
| Workflow planning robustness under **sparse briefs** | Renderer / Utilities HTML |
| Factor resolution & **assumption visibility** | Workflow schema redesign |
| **Infer vs ask** policy for Research | Domain-pack rewrite |
| Minimum viable briefing thresholds | New orchestration architecture |
| Cross-domain **lessons captured** for future LD | LD as active sprint |
| Bounded semantic/planning fixes (later sprint) | Broad UI redesign |

**Primary question:** When a user gives a thin Research brief, what does PRISM **assume**, what does it **ask**, and what **workflow** does it produce — and is that **safe**?

---

## 2. Audit — current Research workflow-planning behaviour

### 2.1 Pipeline (shared runtime, Research pack config)

```
Factory brief fields (design intent, goal, audience, scope, inputs, outputs, constraints)
  → getWorkflowBriefConfig({ selectedDomains })  // Research pack when LD+Research or Research
  → extractWorkflowBriefExplicitFactors(base)     // shared app.js heuristics (not Research-only)
  → applyWorkflowBriefInferenceRules(pack)      // Research: minimal rules in pack
  → callOpenAIForWorkflowIntentInterpretation   // AI factor merge
  → resolveWorkflowBriefFactors                 // explicit > elicited > inferred > default
  → [elicitation queue if required missing]     // max 4 default questions (pack)
  → map factors → workflowOutputSpec / constraints
  → continueWorkflowDesignGeneration → model steps
  → applyWorkflowDesignHeuristics                 // Research blocks in app.js, signals in pack
  → dependency / precedence / triggerRules → final step list
```

**Sources:** `app.js` (`extractWorkflowBriefExplicitFactors`, `resolveWorkflowBriefFactors`, `applyWorkflowDesignHeuristics`); `domains/research/domain-research-step-patterns.md` (`workflowPolicy`, `workflowBriefConfig`).

### 2.2 Canonical Research factors (pack-declared)

**Required (`workflowBriefConfig.requiredFactors`):**

| id | Type | Asked when missing? |
|----|------|---------------------|
| `objective_type` | select: summary / analysis / briefing / questions | Yes — elicitation queue |
| `input_strategy` | select: generate_from_topic / provided_source_content / mixed | Yes |
| `audience` | text | Yes |
| `output_depth` | select: concise / standard / detailed | Yes |

**Optional:** `citation_style` (apa / mla / chicago / none) — not required; `askOptionalByDefault: false`.

**Settings-only (`extraFields`):** `evidence_rigour` (exploratory / standard / strict) — merged via `mergeWorkflowBriefExtraFieldExplicitIntoResolved`; **not** in required elicitation queue unless user fills UI extra field.

**Free-text UI (`uiHints` only — not formal factors):** `design_intent`, `scope_scale`, `inputs`, `desired_outputs`, `constraints` — passed in `base` brief to workflow generation and heuristics but **not** validated as required factors.

**Refinement factors:** Research pack has **none** (`refinementFactors` absent). `questionPolicy.askRefinementByDefault` is **false** (pack default). Post-generation refinement queue is **LD-oriented** in `getWorkflowRefinementQueue` (assessment factor IDs, `design_scope`, etc.).

### 2.3 Inference & explicit extraction (current)

**Pack `inferenceRules` (Research-only today):**

- Goal mentions `brief`, `briefing`, `note` → `objective_type: briefing`

**Shared `extractWorkflowBriefExplicitFactors` (when Research is active, not general-only):**

| Signal in brief blob | May set |
|----------------------|---------|
| `summary` / `summarise` | `objective_type: summary` |
| `analysis` / `analyze` | `objective_type: analysis` |
| `briefing` / `brief` | `objective_type: briefing` |
| `research question` / `questions` | `objective_type: questions` |
| `concise` / `short` | `output_depth: concise` |
| `detailed` / `deep` | `output_depth: detailed` |
| `standard` / `balanced` | `output_depth: standard` |
| Non-empty `inputs` | `input_strategy: provided_source_content` |
| `no source` / `from topic` | `input_strategy: generate_from_topic` |
| `transcript` / `pdf` / `document` | `input_strategy: provided_source_content` |

**Precedence:** explicit > elicited > inferred > default (`resolveWorkflowBriefFactors`). AI intent factors merge **under** deterministic rule inference for conflicts (`Object.assign(aiFactors, ruleInferredValues)` with rules winning on overlap — see `app.js` ~5838).

**Hidden assumptions (no disclosure today):**

- Last matching `objective_type` keyword wins if multiple appear in blob (order of `if` checks).
- `audience` only from explicit field or elicitation — **not** inferred from “for faculty leaders” in goal text unless AI capture succeeds.
- `output_depth` defaults to missing → elicitation, not `standard`.
- `input_strategy` may default to `generate_from_topic` when no upload cues — **dangerous** for “summarise this PDF” if inputs empty.

### 2.4 Workflow selection (Research `workflowPolicy`)

**`triggerRules` (factor-driven step inclusion):**

| `objective_type` | Adds step |
|------------------|---------|
| `summary` | Generate Research Summary |
| `briefing` | Generate Briefing Note |
| `questions` | Generate Research Questions |
| `analysis` | Conduct Thematic Analysis |

**Heuristics in `app.js` (Research domain active):**

| Mechanism | Behaviour |
|-----------|-----------|
| **Normalize prepend** | If ingestion input detected → ensure **Normalize Content** first |
| **Generate Research Content strip** | Upload-authoritative path: `input_strategy === provided_source_content` + source/starting artefact → remove **Generate Research Content** (symmetric to LD I9.1) |
| **Validate Research Output** | Stripped unless `researchValidationIntent` phrase/word-boundary match in goal/outputs/inputs |
| **Design Page append** | Pack `researchDesignPageAppend`: briefing/summary/analysis synthesis + page cues; `excludeObjectiveTypes: [questions]` unless briefing/summary step or page cue + synthesis |
| **Objective infer from brief** | If `objective_type` unresolved, blob regex in heuristic (same family as explicit extract) |

**`finalSteps`:** Format Final Output, Design Page (precedence: Validate → Design Page when Validate present; no Format → Design Page edge — deadlock guard documented in pack).

**Tests (regression, not elicitation):** `tests/workflow-research-validation-intent.test.js`, `tests/workflow-research-design-page-heuristic.test.js`.

### 2.5 Elicitation triggers (current)

| Trigger | Behaviour |
|---------|-----------|
| Any **required** factor unresolved after explicit + inferred + AI | Queue = `firstPass.missing`; ask up to **4** questions (`maxDefaultQuestions`) |
| Optional factors | Not asked by default |
| `evidence_rigour` | Settings dropdown only |
| Refinement | Research: effectively **off** (no refinement factors) |
| High-impact confirm | `getPendingHighImpactInferredFactors` targets LD ids (`topic`, `design_scope`) — **low Research relevance** |
| Stop condition | `all_required_factors_resolved` then workflow generation |

**User-facing copy:** “I’ll fill the missing essentials…” then `buildWorkflowBriefQuestionText` per factor.

---

## 3. Research factor inventory

### 3.1 Grouping (Sprint 17 lens)

| Tier | Factors / fields | Rationale |
|------|------------------|-----------|
| **Essential for workflow correctness** | `objective_type`, `input_strategy` | Drive `triggerRules` and upload/generation heuristics |
| **Strongly output-shaping** | `audience`, `output_depth`, free-text `inputs`, `desired_outputs` | Tone, depth, ingestion path, delivery steps |
| **Useful but safely defaultable** | `citation_style`, `evidence_rigour`, `scope_scale`, `constraints` | Quality polish; can default `citation_style: none`, `evidence_rigour: standard` |
| **Advanced / expert-only** | Explicit validation intent phrases, fine-grained analysis chain (matrix + thematic + argument) | Should not be inferred from casual briefs |

### 3.2 Per-factor behaviour matrix

| Factor / field | Essential? | Resolved via | If sparse brief gap | Risk |
|----------------|------------|--------------|---------------------|------|
| `objective_type` | Yes | explicit blob / AI / pack rule / **ask** | Often **inferred** from “briefing” | Wrong type if “questions” also mentioned |
| `input_strategy` | Yes | explicit / blob / **ask** | Often **wrong default** (topic-only) | Skips normalize path |
| `audience` | Yes | explicit field / **ask** | Often **missing** | Generic stakeholder assumed in prompts? |
| `output_depth` | Yes | blob / **ask** | Often **missing** | Model picks depth arbitrarily |
| `citation_style` | Optional | explicit / default empty | Ignored | Low |
| `evidence_rigour` | Settings | `domainExtraValues` | Hidden default **standard** | User unaware of rigour |
| `design_intent` | UI text | `base.goal` / `designIntent` | Usually present (sparse but non-empty) | — |
| `scope_scale` | UI text | `base.scopeScale` | Often empty | No elicitation |
| `inputs` | UI text | `base.inputs` | Often empty | Drives upload heuristics |
| `desired_outputs` | UI text | `base.desiredOutputs` | May say “briefing page” | Drives Design Page append |
| `constraints` | UI text | `base.scopeConstraints` | Often empty | — |
| `session_materials` | LD-oriented extract | Rare in Research | N/A | — |

### 3.3 Unused / weakly resolved (Research)

| Item | Notes |
|------|--------|
| `refinementFactors` | **Not defined** for Research |
| `topic` / `workshop_subject` | LD-style extract may set in shared blob path — **not** Research required factor |
| `page_profile` | LD assessment/page heuristics in shared extract — **not** Research pack factor |
| `duration_minutes`, `delivery_mode` | LD workshop fields from shared extract — inert for Research triggers |
| Pack `inferenceRules` | Only **one** rule (briefing) — under-powered vs LD rule set |

---

## 4. Sparse brief audit

### 4.1 Example prompts

| # | Sparse prompt | Likely current behaviour | Missing / weak | Infer vs ask (recommended) | Dangerous hidden assumptions |
|---|---------------|------------------------|----------------|---------------------------|------------------------------|
| S1 | “Need a briefing on AI policy for universities” | `objective_type: briefing`; may elicit `audience`, `input_strategy`, `output_depth` | `audience` (“universities” not formal audience); `input_strategy`; sources | **Ask:** input_strategy, audience. **Infer:** objective_type=briefing | **generate_from_topic** if no inputs; long analysis chain without sources |
| S2 | “Summarise evidence on hybrid learning” | `objective_type: summary` (summarise); possible `analysis` if “evidence” triggers analysis keyword | `input_strategy`, `audience`, `output_depth` | **Ask:** input_strategy. **Infer:** summary vs analysis (disambiguate) | Thematic + summary without normalize if no upload |
| S3 | “Create a research briefing for faculty leaders” | `objective_type: briefing`; “faculty leaders” may not fill `audience` field | `input_strategy`, `output_depth` | **Ask:** input_strategy. **Infer:** audience from goal via AI capture if enabled | Design Page if “html/page” absent but briefing step added |
| S4 | “Need questions for evaluating digital inclusion” | `objective_type: questions` | `input_strategy`, `audience`, scope of question set | **Ask:** audience, input_strategy, question purpose/quantity | **Design Page suppressed** (questions excluded) but may still add thematic path if analysis inferred |
| S5 | “Briefing page on climate evidence, html-ready, no validation” | `objective_type: briefing`; page cues → **Design Page**; Validate **stripped** | `input_strategy`, `audience` | **Infer:** delivery from “html-ready”. **Ask:** input_strategy | Large step chain from defaults; rigour unknown |
| S6 | “Analyse uploaded PDFs and produce a detailed summary for policymakers” | `objective_type` **conflict** (analysis + summary); `output_depth: detailed`; `input_strategy: provided` if “pdf” in inputs | `audience` (“policymakers” in goal only) | **Ask:** primary objective (summary vs analysis). **Infer:** upload path | Both **Conduct Thematic Analysis** and **Generate Research Summary** may trigger |

### 4.2 Ambiguity / conflict patterns observed

1. **Dual objective keywords** — shared extract uses sequential `if` without disambiguation (summary vs analysis vs briefing vs questions).
2. **Audience in goal vs audience field** — not promoted to required `audience` factor automatically.
3. **Thin brief + rich workflow** — four required factors may be partially inferred → workflow generates **many** steps with only pack `triggerRules` (+ model steps).
4. **Questions + briefing** — `excludeObjectiveTypes: questions` helps Design Page but not step bloat from model draft.
5. **Assumption opacity** — resolved panel shows sources but user may not see **why** Validate absent or Design Page present.

---

## 5. Elicitation strategy review (candidate rules — not implemented)

### 5.1 When to infer (proceed without asking)

- **High-confidence phrase** maps declared in Research pack (expand `inferenceRules` cautiously): e.g. “briefing note” → `briefing`, “uploaded PDF” → `provided_source_content`.
- **Delivery cues** for Design Page only (`pageDeliveryTextSignals`) — do not infer full methodology.
- **output_depth** only when explicit adjective present (`concise` / `detailed`); otherwise apply pack default **`standard`** after minimum threshold met (candidate).

### 5.2 When to ask (blocking)

- **`input_strategy` unset** and no strong upload/generate cue — always ask (one select).
- **`audience` unset** and stakeholder role only in free-text goal — ask or AI-extract with confirm.
- **`objective_type` unset** and goal has **competing** objective keywords — ask single select.
- **Sparse brief** below minimum viable threshold (candidate): fewer than 2 of {goal intent, audience, input posture, desired output} resolved → ask bundled essentials (max 4 questions preserved).

### 5.3 When to proceed autonomously

- All **required** factors resolved (current stop condition).
- User explicitly says “use defaults” / recommend intent (existing recommend path).
- **Non-blocking** optional factors (`citation_style`, `evidence_rigour`) — apply defaults and list in resolved panel.

### 5.4 Minimum viable briefing threshold (candidate)

| Tier | Minimum for autonomous planning |
|------|----------------------------------|
| **MVP** | `objective_type` + `input_strategy` resolved (explicit, elicited, or inferred with confidence) |
| **Better** | Above + `audience` + one of {`desired_outputs`, `design_intent`} |
| **Stretch** | Above + `output_depth` or explicit “concise/detailed” |

### 5.5 Ambiguity escalation

1. Detect **conflicting** objective signals → one clarifying question (don’t pick last-regex-wins).
2. Detect **upload language** without `inputs` field → confirm upload vs topic-only.
3. Detect **delivery** (“page”, “html”) without synthesis objective → confirm briefing vs summary.

### 5.6 Assumption disclosure (candidate UX — planning only)

Before workflow generation, show compact **“Planning assumptions”** block:

- Inferred factors with source (`inferred` / `default`)
- Steps **excluded** (e.g. Validate Research Output) and why
- Steps **appended** (Design Page) and why
- Defaults applied (`evidence_rigour`, `output_depth`)

No UI implementation in this prep pass.

---

## 6. Cross-domain lessons (for future LD — not Sprint 17 scope)

| Observation (Research audit) | LD parallel | Transferable lesson |
|------------------------------|-------------|---------------------|
| Only **4** required factors vs LD’s larger set + **refinementFactors** | LD asks more post-essentials | Research is the right **elicitation lab** — test policies here first |
| Research has **no refinement queue** | LD has long refinement list | LD may **over-elicit**; progressive disclosure could gate refinement |
| Shared `extractWorkflowBriefExplicitFactors` | LD-specific fields leak into Research blob | Split **domain-scoped extractors** or guard by `selectedDomains` |
| `extraFields` / settings invisible in elicitation | LD `evidence_rigour`-style fields | Surface **settings-only** params in assumption disclosure |
| `getPendingHighImpactInferredFactors` LD-centric | Research doesn’t benefit | Domain-tag high-impact ids per pack |
| Rich `triggerRules` + model over-generation | LD same | **Sparse brief step budget** — cap or template chains per objective_type |
| Design Page / Validate heuristics pack-driven | LD delivery rules complex | Pack-authored signals work; document in pack not app |

---

## 7. Sprint 17 proposed work packages (implementation — deferred)

| Priority | Package | Type |
|----------|---------|------|
| P0 | Sparse-brief **fixture tests** (brief text → resolved factors + step titles) | Regression |
| P1 | Research **`inferenceRules`** expansion + conflict resolution for `objective_type` | Pack + small app guard |
| P1 | **Assumption disclosure** in resolved panel (read-only) | UI-light |
| P2 | **Minimum viable threshold** before auto-continue | Planning logic |
| P2 | Domain-scoped explicit extract (Research subset) | app.js refactor (bounded) |
| P3 | Optional factor defaults documented in pack | Docs + defaults |

**Explicitly deferred:** renderer, schema, orchestration rewrite, LD refinement overhaul.

---

## 8. Verification baseline (closure of prep)

| Check | Result |
|-------|--------|
| `node --test tests/*.test.js` | **80 passed**, 0 failed (2026-05-15) |
| Renderer regression | Sprint **16** closed — **out of Sprint 17 scope** |
| Research planning tests | Existing: validation intent, design-page heuristic, brief pass fixtures — **extend** in Sprint 17 implementation |

---

## 9. Recommended first implementation task (when sprint starts)

1. Add **sparse-brief fixture table** (S1–S6) under `tests/fixtures/workflow-brief-research-sparse/` with expected `resolvedFactors` + allowed step sets (golden, pack-sensitive).
2. Run against current behaviour to **pin baseline** before changing inference.
3. Implement **one** P1 change: `objective_type` conflict detection OR assumption disclosure panel.

---

## 10. Review log

- **2026-05-15** — Sprint 17 prep: Research planning audit, factor inventory, sparse brief table, candidate elicitation heuristics, cross-domain notes. **No code changes** (prep only).
