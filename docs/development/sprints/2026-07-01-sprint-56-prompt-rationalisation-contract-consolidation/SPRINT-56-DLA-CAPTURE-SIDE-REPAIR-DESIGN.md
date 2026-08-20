# Sprint 56 — DLA Capture-Side Scaffold Repair Design

**Status:** Design (not implemented)  
**Date:** 2026-07-01  
**Scope:** DLA learner-page **Copy-path capture only**  
**Predecessors:** [SPRINT-56-DLA-STABILISATION-PASS.md](SPRINT-56-DLA-STABILISATION-PASS.md) · [SPRINT-56-DLA-SSOT-SPEC.md](SPRINT-56-DLA-SSOT-SPEC.md) · [SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md](SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md)

---

## 1. Rationale for stopping prompt tuning

Sprint 56 prompt-side work is **complete and should not be extended**.

| Evidence | Implication |
|----------|-------------|
| Core prompt restored to **~31,932 chars** (≤32k budget) | Further wording risks budget regression without reliability gain |
| Metadata/prose hypothesis **confirmed** | Generation understands genre when it complies; failures are compliance not comprehension |
| Cognition-genre hypothesis **confirmed** | Best run **60%** mandatory pass; cognition fields reach floors when model cooperates |
| Stabilisation batch **mean 13.3%** at temp 0.35 | High run-to-run variance — prompt tuning cannot reliably hit ≥80% |
| Six-probe variance (0–60%) | Same prompt produces preamble collapse, borderline cognition, and missing bridge in different runs |

**Conclusion:** Copy-path generation quality is **stochastic at current temperature/model**. The smallest path to reliable SSOT compliance is **deterministic post-generation repair on capture**, not additional prompt layers or wording.

**Important:** Sprint 55 already introduced a capture repair hook. This design **extends** that mechanism — it is not a new architectural layer.

---

## 2. Current state (existing infrastructure)

### 2.1 What already exists

| Component | Location | Behaviour |
|-----------|----------|-----------|
| SSOT floors + terse detection | `lib/ld-guided-learning-scaffold.js` `FIELD_WORD_RANGES`, `scaffoldLooksLikeTerseLabel`, `preambleFailsQuality` | Authoritative word ranges and anti-terse heuristics |
| Evaluator | `evaluateGuidedLearningScaffoldEvidence()` | Flags **populated** scaffold fields below floor or terse |
| Per-field expanders | `FIELD_EXPANDERS` map | Topic-blob heuristics + `padToWordMin` for RNA/HCV-style content |
| Activity repair | `repairActivityScaffoldFields(row)` | Runs evaluator → expander per flagged field |
| Capture repair | `repairGuidedLearningScaffoldOnDlaCapture(parsed)` | Resolves `activities[]` container, mutates rows in place |
| App wrapper | `app.js` `applyGuidedLearningScaffoldRepairToDlaCapture()` | Gated by `shouldEnforceGuidedLearningScaffoldOnDlaCapture` |
| Capture wiring | `syncWorkflowRunCapturedOutputToState` (~L19809) | Runs after episode-plan enforcement + DLA framing validation |
| Tests | `tests/sprint-55-guided-learning-quality.test.js` | Terse fixture passes after repair; capture path integration |

### 2.2 Gap vs DLA-08 mandatory scoring

DLA-08 probe scoring (`scripts/probe-dla-08-copy-validation.js` `scoreActivity`) enforces **mandatory coverage** that the evaluator + repair loop do not fully mirror:

| Rule | DLA-08 probe | Current evaluator | Current repair |
|------|:------------:|:-----------------:|:--------------:|
| `activity_preamble` ≥50w | ✓ | ✓ (if present) | ✓ `expandActivityPreamble` |
| `expected_output` ≥30w | ✓ | Only if populated & short | ✓ but **replaces** text (loses specificity) |
| ≥1 cognition field ≥35w | ✓ | Only if populated & short | Partial — does not **select** archetype field when all cognition sub-floor |
| `intellectual_coherence_bridge` A2+ ≥30w | ✓ | Only if populated & short | **No expander** |
| Probe runs repair | ✗ | — | Capture path only |

### 2.3 Empirical repair impact (existing code, no changes)

Simulated `repairGuidedLearningScaffoldOnDlaCapture` on DLA-08 fixtures (DLA-08 mandatory scoring):

| Fixture | Before | After repair | `meetsGuidedLearningScaffoldQuality` |
|---------|-------:|-------------:|:------------------------------------:|
| `rna-hcv-dla-08-cognition-best-run.json` | 60% | **80%** | false (A4 bridge 28w still flagged) |
| `rna-hcv-dla-08-run.json` (stab #3) | 40% | **100%** | true |
| `rna-hcv-dla-08-stab-run-1.json` | 0% | **100%** | true |

**Takeaway:** Existing repair already closes most Copy-path gaps when capture runs; remaining failures are **bridge under-floor**, **evaluator/repair misalignment**, and **expected_output replacement** quality.

---

## 3. Repair targets

All floors from SSOT (`FIELD_WORD_RANGES` in `lib/ld-guided-learning-scaffold.js`):

| Field | Floor | Ceiling | Mandatory | Repair priority |
|-------|------:|--------:|:---------:|:---------------:|
| `activity_preamble` | 50 | 120 | Yes | P1 — high variance |
| `expected_output` | 30 | 70 | Yes | P1 — label-to-prose |
| `reasoning_orientation` | 35 | 80 | Cognition candidate | P1 |
| `self_explanation_prompt` | 35 | 80 | Cognition candidate | P1 — highest variance |
| `conceptual_contrast_prompt` | 35 | 80 | Cognition candidate | P1 |
| `argument_structure_hint` | 35 | 80 | Cognition candidate | P1 |
| `transfer_or_application_task` | 35 | 80 | Cognition candidate | P2 |
| `intellectual_coherence_bridge` | 30 | 60 | A2+ in multi-activity | P1 — missing expander |
| `support_note` | 20 | 70 | Optional when used | P3 |

**Out of scope for repair:** `learner_task`, `required_materials`, `title`, `duration_minutes`, cognition fields not in SSOT table (`uncertainty_tension_prompt`, `intellectual_frame`, etc.).

---

## 4. Repair type classification

| Field | Primary repair type | Secondary | Generic fallback |
|-------|---------------------|-----------|:----------------:|
| `activity_preamble` | **Expand** existing short fragment (`padToWordMin` + topic clause) | Synthesize from `learner_task` + first `required_materials` purpose | Topic-agnostic orienting sentence only if blob empty |
| `reasoning_orientation` | **Expand** existing (append reasoning-move sentence) | Synthesize from `learner_task` verbs + material `specification` | One-sentence mistake-to-avoid clause |
| `self_explanation_prompt` | **Expand** borderline 32–34w (append generative clause) | Synthesize from task + contrast/material cue | “Before checking, explain in your own words…” |
| `conceptual_contrast_prompt` | **Expand** + inject comparison criteria | Synthesize from task comparison language | Criteria + novice-confusion clause |
| `argument_structure_hint` | **Expand** arrow chains into sentences | Synthesize from Evaluate/transfer task structure | Claim → evidence → implication unpack |
| `transfer_or_application_task` | **Expand** existing | Synthesize from prior activity reasoning move | Transfer template with topic from title |
| `expected_output` | **Convert** label → quality-threshold prose (preserve deliverable noun) | Expand from `learner_task` outcome verbs | Quality-threshold wrapper around title |
| `intellectual_coherence_bridge` | **Synthesize** from prior activity preamble/task + current activity purpose | Expand scheduling-only bridge into carried-reasoning | Prior-move + escalation clause |
| `support_note` | **Expand** existing misconception cue | Pull from material `specification` guard hints | Function-link revision prompt |

**Never:** replace compliant fields; invent new `required_materials`; add activities; rename keys.

---

## 5. Source hierarchy

For each repair, consult sources in order until floor met (stop early if compliant):

```
1. existing field text          — expand in place; preserve nouns, LO refs, mechanism terms
2. learner_task                 — action verbs, deliverable shape, step sequence
3. required_materials[]         — purpose, specification depth_floor, instructional_function
4. activity archetype           — episode_plan.archetype or inferred from cognition field presence
5. episode-plan beat            — episode_plan.beats[].function for obligation-aligned clause
6. mapped learning outcome      — mapped_learning_outcomes / LO statement from upstream capture
7. domain topic                 — workflow goal / brief goal keywords (last resort for topic anchoring)
8. generic SSOT fallback        — only when 1–7 yield no extractable tokens
```

**Topic specificity rule:** Repairs must reuse **at least one** token from sources 1–6 (title noun, mechanism term, material type, LO id) before applying source 8.

**Obligation rule:** Do not add material types, beat functions, or task steps not present in `learner_task` or `required_materials`.

---

## 6. Deterministic constraints

| Constraint | Enforcement |
|------------|-------------|
| Learner-facing voice | Second person where natural; no facilitator scheduling |
| Preserve meaning | Expand-in-place first; replacement only when terse-label detection fires |
| Topic specificity | `activityTopicContext(row)` + source hierarchy token reuse |
| No new obligations | Repair functions read-only on `required_materials`; no array mutation |
| No new activities | Repair iterates existing `activities[]` only |
| SSOT floors | `wordCount(field) >= FIELD_WORD_RANGES[field].min` after repair |
| Ceiling guard | `trimToWordMax` after expansion |
| JSON stability | No new keys; string values only; avoid runaway padding (max 4 pad iterations — existing `padToWordMin` guard) |
| Anti-terse | Re-run `scaffoldLooksLikeTerseLabel` / `preambleFailsQuality` after repair |
| Compose downstream | Repaired capture becomes upstream for Design Page — repair quality matters for preservation chain |

---

## 7. Repair algorithm sketch

### 7.1 Entry points (unchanged)

```
syncWorkflowRunCapturedOutputToState
  → sanitizeWorkflowRunCapturedOutputForStep
  → applyEpisodePlanPopulationEnforcementToDlaCapture
  → applyLearnerPageDlaFramingValidationToCapture
  → applyGuidedLearningScaffoldRepairToDlaCapture   ← enhance internals only
```

### 7.2 Enhanced pipeline (proposed)

```
repairGuidedLearningScaffoldOnDlaCapture(parsed):
  activities ← resolve container
  context ← buildRepairContext(activities, upstreamCaptures)  // NEW: LO statements, episode_plans

  for each activity row (index i):
    issues ← evaluateMandatoryScaffoldIssues(row, i, activities.length)  // NEW: DLA-08 parity

    for each issue in priority order [preamble, expected_output, cognition, bridge, optional]:
      if issue.type == missing_mandatory_cognition:
        fieldId ← selectCognitionField(row, context)  // archetype map
        row[fieldId] ← synthesizeCognitionField(fieldId, row, context)
      else if issue.fieldId:
        row[fieldId] ← repairField(issue.fieldId, row, activities[i-1], context)

    // second pass: populated-but-terse (existing evaluator)
    repairActivityScaffoldFields(row)

  return { parsed, repaired[], evidence: evaluateGuidedLearningScaffoldEvidence(activities) }
```

### 7.3 Core helpers (new / refactored in lib)

| Function | Responsibility |
|----------|----------------|
| `evaluateMandatoryScaffoldIssues(row, index, total)` | DLA-08 mandatory rules: missing bridge, sub-floor mandatory fields, no cognition ≥35w |
| `buildRepairContext(activities, options)` | Extract LO statements, episode_plan beats, workflow goal |
| `repairField(fieldId, row, priorRow, ctx)` | Dispatch expand → synthesize → fallback |
| `expandInPlace(text, min, max, appendClauses[])` | Prefer padding with sourced clauses over full replacement |
| `convertExpectedOutputLabel(text, row, ctx)` | Preserve deliverable noun; append quality-threshold sentences |
| `synthesizeBridge(row, priorRow, ctx)` | Carried reasoning from prior task/preamble → current purpose |
| `selectCognitionField(row, ctx)` | Map `episode_plan.archetype` → preferred cognition field |

### 7.4 Cognition field selection (archetype map)

| Archetype (episode plan) | Preferred field when missing / all sub-floor |
|--------------------------|---------------------------------------------|
| Understand / Orient | `reasoning_orientation` |
| Contrast / Discriminate | `conceptual_contrast_prompt` |
| Analyse / Apply | `self_explanation_prompt` |
| Evaluate / Judge | `argument_structure_hint` |
| Transfer | `transfer_or_application_task` |
| Fallback | First populated cognition field, else `reasoning_orientation` |

### 7.5 Borderline expansion pattern (32–34w cognition)

```
expandInPlace(existing, min=35, max=80,
  clauseFromLearnerTask(row) ||
  "State why your answer follows from the mechanism or evidence in the materials, not only what the correct label is.")
```

Do **not** repeat word-count instructions — append one substantive learner-facing sentence.

### 7.6 Bridge synthesis pattern

```
synthesizeBridge(current, prior, ctx):
  priorMove ← extractReasoningMove(prior.activity_preamble || prior.learner_task)
  currentPurpose ← extractPurpose(current.activity_preamble || current.title)
  return trimToWordMax(
    "You established " + priorMove + ". This activity extends that reasoning by " + currentPurpose +
    ", so carry forward the same explanatory standard when you work with the new materials.",
    60)
```

Reject scheduling-only bridges (`Then do…`, `Move to Activity…`) — replace via synthesize, not pad.

---

## 8. Field-specific repair strategies

### 8.1 `activity_preamble`

| Condition | Strategy |
|-----------|----------|
| 41–49w (borderline) | `expandInPlace` — append “As you work, explain why…” using material specification topic |
| Procedural opener | Strip opener prefix if safe; expand with conceptual problem sentence from LO |
| Empty / generic LO placeholder | Synthesize from LO statement + first material purpose |
| RNA/HCV topic blob | Keep existing topic templates as **last resort** after in-place expansion fails |

### 8.2 `expected_output`

| Condition | Strategy |
|-----------|----------|
| Deliverable label (“Completed table…”) | `convertExpectedOutputLabel` — keep deliverable noun, add format/depth/quality threshold |
| 25–29w substantive | `expandInPlace` with quality clause from `learner_task` |
| Missing | Synthesize from task outcome verbs (not full replacement template) |

**Fix existing `expandExpectedOutput`:** Replace-all behaviour loses generated meaning — refactor to expand-in-place first.

### 8.3 Cognition fields (borderline + missing)

| Condition | Strategy |
|-----------|----------|
| 32–34w, not terse | `expandInPlace` with one sourced clause |
| Terse label / arrow chain | Rewrite to three short sentences using existing tokens |
| Missing mandatory cognition | `selectCognitionField` + `synthesizeCognitionField` |
| Wrong field populated sub-floor | Expand populated field; do not populate second cognition field |

### 8.4 `intellectual_coherence_bridge`

| Condition | Strategy |
|-----------|----------|
| Missing on A2+ | `synthesizeBridge` |
| 28–29w | `expandInPlace` with carried-reasoning clause |
| Scheduling-only content | Replace via `synthesizeBridge` |
| Generic template (“foundational understanding”) | Accept if ≥30w and not scheduling-only; optional future: inject topic token from LO |

### 8.5 `support_note`

| Condition | Strategy |
|-----------|----------|
| Populated <20w | `expandInPlace` with misconception guard from materials |
| Missing | **No-op** (optional field) |

---

## 9. Proposed implementation location

### 9.1 Primary (lib — all repair logic)

**File:** `lib/ld-guided-learning-scaffold.js`

| Change | Nature |
|--------|--------|
| Add `evaluateMandatoryScaffoldIssues` | Extends evaluator parity with DLA-08 |
| Add `buildRepairContext`, `expandInPlace`, `synthesizeBridge`, `convertExpectedOutputLabel` | New helpers |
| Add `intellectual_coherence_bridge` to `FIELD_EXPANDERS` | New expander |
| Refactor `repairGuidedLearningScaffoldOnActivities` | Two-pass: mandatory → terse |
| Refactor `expandExpectedOutput` | Expand-in-place before fallback |
| Generalise topic templates | Move RNA/HCV blobs behind source hierarchy (keep as fallback tier) |

**Rationale:** SSOT module already owns floors, evaluator, and repair — smallest surface; no new contract marker.

### 9.2 Secondary (app.js — wiring only)

**File:** `app.js`

| Change | Nature |
|--------|--------|
| `applyGuidedLearningScaffoldRepairToDlaCapture` | Pass upstream capture context into `buildRepairContext` (LO, episode_plans from `state.workflowRunCapturedOutputs`) |
| No new prompt blocks | — |

### 9.3 Probe alignment (optional, test infra)

**File:** `scripts/probe-dla-08-copy-validation.js`

| Change | Nature |
|--------|--------|
| Add `--post-repair` scoring mode | Report pre- vs post-capture-repair mandatory pass for parity with production |

### 9.4 Files explicitly not changed

- Output schema / field names
- `lib/ld-design-page-compose-contract.js` (preservation rules unchanged)
- `lib/page-activity-field-preserve.js`
- Prompt augmentation chain
- `required_materials` population / episode-plan enforcement

---

## 10. Test plan

### 10.1 New tests (`tests/sprint-56-dla-capture-repair.test.js` proposed)

| Test | Assertion |
|------|-----------|
| **Missing bridge repair** | A2+ row without bridge → after repair, `wordCount(bridge) >= 30`, not scheduling-only |
| **Borderline cognition expansion** | 33w `self_explanation_prompt` → ≥35w; retains original tokens |
| **expected_output label-to-prose** | “Completed analysis table…” → ≥30w; contains quality-threshold language; retains “table” |
| **No-op when compliant** | Rich fixture → `repairApplied: false`; field strings unchanged |
| **No schema change** | `Object.keys(row)` identical before/after (per activity) |
| **No required_materials mutation** | `JSON.stringify(required_materials)` identical before/after |
| **Sprint 55 preservation compatibility** | Repaired DLA → Design Page compose path preserves scaffold fields verbatim per `page-activity-field-preserve` |
| **Mandatory cognition when all sub-floor** | Row with 20w `self_explanation_prompt` only → one cognition field ≥35w |
| **DLA-08 fixture regression** | `stab-run-1` and `cognition-best-run` → ≥80% mandatory after repair |
| **Capture path integration** | `applyGuidedLearningScaffoldRepairToDlaCapture` clears `workflowRunGuidedLearningScaffoldValidation` |

### 10.2 Existing suite expectations

| Suite | Expected impact |
|-------|-----------------|
| `sprint-55-guided-learning-quality.test.js` | Continue passing; may tighten assertions on expand-in-place |
| `sprint-55-content-preservation.test.js` | No regression — repair runs pre-compose only |
| `sprint-56-dla-ssot-rationalisation.test.js` | Unaffected (prompt budget) |

### 10.3 Fixture sources

- `tests/fixtures/dla/rna-hcv-terse-scaffold-dla.json` — baseline terse
- `tests/fixtures/dla/rna-hcv-dla-08-cognition-best-run.json` — 60% → 80%+ target
- `tests/fixtures/dla/rna-hcv-dla-08-stab-run-1.json` — preamble collapse
- Synthetic minimal rows for no-op and materials-immutability

---

## 11. Risks and guardrails

| Risk | Mitigation |
|------|------------|
| Generic RNA/HCV prose on non-virology briefs | Source hierarchy before topic templates; require token reuse from row |
| Meaning drift via full replacement | `expandInPlace` default; replacement only when terse-label detected |
| Over-repair on good captures | No-op when `evaluateMandatoryScaffoldIssues` empty and evaluator clean |
| Bridge sounds generic | Inject prior/current activity tokens; forbid scheduling templates |
| Evaluator false negative after repair | Two-pass repair + final `evaluateGuidedLearningScaffoldEvidence` |
| JSON gate interaction | Repair runs before strict JSON validation; no structural changes |
| Design Page double-editing | Compose preserves repaired capture verbatim — repair must be publication-quality |
| False confidence in probes | Add `--post-repair` probe mode; distinguish generation vs capture compliance |

**Guardrail:** Log `repaired[]` field ids per activity (existing shape) for observability — no new user-facing gate message beyond current scaffold validation string.

---

## 12. Recommendation: Sprint 56 or defer?

| Factor | Assessment |
|--------|------------|
| Prompt tuning exhausted | Yes — stabilisation complete |
| Infrastructure exists | Yes — ~70% of pipeline implemented |
| Empirical uplift | Existing repair: 0–40% → 100% on stab fixtures; cognition-best 60% → 80% |
| Remaining work | Bridge expander, mandatory evaluator parity, expand-in-place refactor, context passing |
| Scope size | **Small** — one lib file + tests + thin app context pass |

### Recommendation: **Implement in Sprint 56** (focused capture repair enhancement)

**Not defer** because:

1. Capture repair is already wired — users pasting Copy output get partial repair today with blind spots (bridge, mandatory cognition).
2. DLA-08 failure is misreported if probes score raw LLM output without repair — production capture path is stricter than probe.
3. Work is lib-local, testable, and does not violate “no prompt layers” constraint.

**Defer** only the optional probe `--post-repair` flag if timeboxed — production path is the authoritative metric.

### Success criteria (implementation phase)

| Metric | Target |
|--------|--------|
| DLA-08 mandatory pass **post-repair** on 3 probe fixtures | ≥80% each |
| `meetsGuidedLearningScaffoldQuality` after repair | true on same fixtures |
| No-op on compliant rich fixture | zero field mutations |
| `required_materials` byte-identical | 100% |
| Sprint 55 preservation tests | pass |

---

## 13. Traceability

| Artefact | Role |
|----------|------|
| `lib/ld-guided-learning-scaffold.js` | SSOT floors, evaluator, repair (extend) |
| `app.js` `applyGuidedLearningScaffoldRepairToDlaCapture` | Capture hook (context pass) |
| `scripts/probe-dla-08-copy-validation.js` | External generation scorer (add post-repair mode) |
| [SPRINT-56-DLA-STABILISATION-PASS.md](SPRINT-56-DLA-STABILISATION-PASS.md) | Prompt tuning terminus |
| [SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md](SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md) | §9.4 recommends capture-side repair |
