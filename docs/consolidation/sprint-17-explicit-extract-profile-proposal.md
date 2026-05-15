# Sprint 17 — explicit extraction profile (Slice 4 proposal)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-17-explicit-extract-profile-proposal.md`  
**Status:** **Audit / proposal only** — no `explicitExtract` implementation in this slice.

**Related:** [`sprint-17-index.md`](sprint-17-index.md), [`sprint-17-research-elicitation-sparse-brief-prep.md`](sprint-17-research-elicitation-sparse-brief-prep.md).

**Architectural rule:** Runtime interprets policy; domain packs declare policy. Slices 1–3 added pack-driven **validation**, **conflict**, **disclosure**, and **heuristic proceed gates**. Slice 4 documents how to extend that pattern to **explicit factor extraction** without a broad parser rewrite.

**Test baseline at closeout:** `node --test tests/*.test.js` → **85 passed** (unchanged by this doc).

---

## 1. Problem

`extractWorkflowBriefExplicitFactors` in `app.js` (~3574–3763) is a **shared blob parser**. When `selectedDomains` is not general-only, it runs **LD-heavy regex groups** and a **hard-coded Research block** in one function. Research packs cannot declare extraction rules; unsafe or ambiguous extract output is only corrected **after** extraction (validation, conflict, gates).

---

## 2. Current extraction map

| Phase | When | What runs | Output keys (examples) |
|-------|------|-----------|-------------------------|
| **A — Universal** | Always (structured domains) | Field passthrough; `startingArtefact` → `input_strategy`; non-empty `inputs` → `provided_source_content`; `domainExtraValues`; `interpretWorkflowBriefText` | `design_intent`, `audience`, `session_materials`, `learning_environments`, … |
| **Early exit** | `isGeneralOnlySelection` | Return after Phase A | — |
| **B — Shared blob** | Non–general-only | Single lowercased `blob` from goal, design intent, audience, scale, inputs, outputs, constraints | See tables below |

### Phase B — rule groups (today, all in `app.js`)

| Group | Keys | Notes |
|-------|------|--------|
| Duration / pedagogy | `duration_minutes`, `learner_level`, `delivery_mode` | LD session design |
| Assessment | `assessment_required`, `page_profile`, `assessment_type`, `include_answers`, `feedback_required`, `assessment_total_items` | LD assessment packs |
| Topic | `topic`, `workshop_subject` | Regex on goal/design intent (`on` / `about` / workshop phrasing) |
| Session materials (fallback) | `session_materials` | `extractSessionMaterialsFromBriefText` if not set by interpreter |
| Research blob | `objective_type`, `output_depth`, `input_strategy` | Sequential `if` overwrites on `objective_type` |

**Downstream (unchanged by this proposal):** `applyWorkflowBriefInferenceRules` (pack) → `applyWorkflowBriefValidationRules` + chained `conflictPolicies` → `resolveWorkflowBriefFactors` → `applyWorkflowDesignHeuristics` (pack gates).

---

## 3. Research-relevant vs LD-specific

### Research-relevant (pack `requiredFactors` / S1–S6)

| Key | Source today |
|-----|----------------|
| `design_intent`, `audience`, `desired_outputs` | Passthrough |
| `input_strategy` | Passthrough, `startingArtefact`, inputs field, blob cues |
| `objective_type`, `output_depth` | Hard-coded blob regex |
| `topic`, `workshop_subject` | Topic regex (LD-flavoured patterns, generic `on`/`about`) |
| `session_materials` | `interpretWorkflowBriefText` (page cues in S5) |
| `evidence_rigour` etc. | `domainExtraValues` / `extraFields` |

### LD-specific (bleed into Research-only Factory runs)

| Key | Bleed risk |
|-----|------------|
| `duration_minutes`, `learner_level`, `delivery_mode` | Incidental pedagogy wording |
| `assessment_*`, `page_profile` | “Assessment”, “quiz”, “MCQ” in text |
| `learning_environments` | VLE/Moodle mentions in inputs |

Research **requiredFactors** ignore these keys, but they still populate the explicit map and can confuse debugging and future mapping.

### Why Slices 1–3 already address immediate safety

| Risk | Extract may still set | Policy layer (implemented) |
|------|----------------------|----------------------------|
| Upload language, no inputs (S2) | `input_strategy: provided_source_content` | `validationRules` blocks resolve + Planning notice |
| Mixed analysis + briefing (S4) | `objective_type: briefing` (last regex wins) | `conflictPolicies` strips factor + notice |
| Sparse brief, unresolved essentials (S1, S5, S6) | Topic / partial factors | `generateResearchContentHeuristic` + `researchDesignPageAppend` **proceed gates** suppress GRC and Design Page |

**Conclusion:** Planning is **safe** without extract migration; Slice 4 targets **pack authority** and **LD noise reduction**, not an urgent safety gap.

---

## 4. Proposed `workflowBriefConfig.explicitExtract`

Optional sibling of `validationRules` / `conflictPolicies` in the Research pack (`domains/research/domain-research-step-patterns.md` → `### Workflow Brief Config`).

```json
{
  "explicitExtract": {
    "version": "1",
    "blobSources": ["goal", "designIntent", "audience", "scopeScale", "inputs", "desiredOutputs", "scopeConstraints"],
    "passthrough": [
      { "baseKey": "designIntent", "factorId": "design_intent" },
      { "baseKey": "audience", "factorId": "audience" },
      { "baseKey": "scopeScale", "factorId": "scope_scale" },
      { "baseKey": "desiredOutputs", "factorId": "desired_outputs" },
      { "baseKey": "startingArtefact", "factorId": "input_strategy" },
      {
        "baseKey": "inputs",
        "factorId": "input_strategy",
        "setValue": "provided_source_content",
        "onlyIfFactorUnset": true,
        "onlyIfNonempty": true
      }
    ],
    "includeDomainExtraValues": true,
    "builtinModules": {
      "interpretSessionMaterials": true,
      "interpretLearningEnvironments": false
    },
    "suppressLegacyGroups": [
      "ld_assessment",
      "ld_duration",
      "ld_learner_level",
      "ld_delivery_mode",
      "ld_page_profile"
    ],
    "rules": [
      {
        "id": "objective_type_keywords",
        "type": "lastMatchingMention",
        "factorId": "objective_type",
        "signals": [
          { "value": "summary", "mentionAnyOf": ["summary", "summarise", "summarize"] },
          { "value": "analysis", "mentionAnyOf": ["analysis", "analyze", "analyse"] },
          { "value": "briefing", "mentionAnyOf": ["briefing", "briefing note", "brief"] },
          { "value": "questions", "mentionAnyOf": ["research question", "research questions", "questions"] }
        ]
      },
      {
        "id": "output_depth_keywords",
        "type": "firstMatchingMention",
        "factorId": "output_depth",
        "signals": [
          { "value": "concise", "mentionAnyOf": ["concise", "short"] },
          { "value": "detailed", "mentionAnyOf": ["detailed", "deep"] },
          { "value": "standard", "mentionAnyOf": ["standard", "balanced"] }
        ]
      },
      {
        "id": "input_strategy_posture",
        "type": "conditionalSet",
        "onlyIfFactorUnset": "input_strategy",
        "branches": [
          {
            "whenBlobMentionAnyOf": ["no source content", "generate from topic", "topic only", "from topic"],
            "set": { "input_strategy": "generate_from_topic" }
          },
          {
            "whenBlobMentionAnyOf": ["transcript", "article", "notes", "document", "pdf", "slides"],
            "set": { "input_strategy": "provided_source_content" }
          }
        ]
      },
      {
        "id": "topic_from_goal",
        "type": "regexCaptureFirst",
        "factorId": "topic",
        "mirrorFactorIds": ["workshop_subject"],
        "sourceFields": ["goal", "designIntent"],
        "patterns": [
          "(?i)\\b(?:workshop|session|class|quiz|assessment|lesson|module)\\s+(?:on|about)\\s+([^.,;\\n]+)",
          "(?i)\\bon\\s+([^.,;\\n]+)",
          "(?i)\\babout\\s+([^.,;\\n]+)"
        ]
      }
    ]
  }
}
```

### Generic interpreter (future `app.js`)

| Piece | Role |
|-------|------|
| `normalizeWorkflowBriefConfig` | Preserve `explicitExtract` |
| `applyWorkflowBriefExplicitExtract(config, base)` | Passthrough → modules → pack `rules` |
| `extractWorkflowBriefExplicitFactors(base, options?)` | If `options.briefConfig.explicitExtract`: profile path + Phase A; else **full legacy** |
| Factory ~6016 | Pass `config` from `getWorkflowBriefConfig` into extract |

**No schema redesign:** absent `explicitExtract` → behaviour unchanged (LD + Sprint 11 pass1 fixtures).

---

## 5. Relationship to S1–S6 sparse fixtures

Fixtures: `tests/fixtures/workflow-brief-research-sparse/S1`–`S6.json`; tests: `tests/workflow-research-sparse-briefs.test.js`.

| Fixture | Extract highlights (current) | Policy after extract |
|---------|------------------------------|----------------------|
| **S1** topic-only | `topic` | Gates; no GRC / Design Page |
| **S2** upload, no inputs | `objective_type`, `input_strategy`, `topic` | Validation + gates |
| **S3** source + audience | Explicit required factors | Gates pass → Design Page |
| **S4** mixed intent | `objective_type: briefing` (last win) | Conflict + gates |
| **S5** html-ready page | `session_materials`, `objective_type` | Gates (no resolved `input_strategy`) |
| **S6** minimal | `design_intent` only | Gates |

**Parity tests for any implementation:** explicit subsets in these fixtures + `tests/workflow-brief-pass1.test.js` (LD, must not change).

---

## 6. Migration risks

| Risk | Mitigation |
|------|------------|
| 85-test regression | Dual-run legacy vs profile; switch only on `deepEqual` |
| LD+Research selection | WGC **first structured domain** may be LD — Research profile applies only when Research is first; document, out of Sprint 17 scope |
| `objective_type` order | `lastMatchingMention` must match current sequential `if` order for S2/S4/S5 |
| `topic` regex | Sprint 11 pinned over-capture for LD; keep patterns identical in first rule migration |
| S5 `session_materials` | Keep `interpretSessionMaterials` until pack replaces it |
| Inference overlap | Preserve explicit > elicited > inferred precedence |

---

## 7. Recommended deferment

| Work | When |
|------|------|
| **Slice 4 audit (this doc)** | **Done** — Sprint 17 |
| **Full `explicitExtract` implementation** | **Deferred** (post–Sprint 17 or dedicated pass) |
| **LD profile / split extractors** | **Out of scope** — no LD implementation sprint |

**Rationale:** Extract migration improves clarity and pack authority; Slices 1–3 already make sparse-brief planning safe. Implementation touches a Sprint 11–pinned shared function and needs dual-run discipline.

---

## 8. Optional future implementation path

### 4a — `suppressLegacyGroups` only

Research pack lists LD blob groups to skip; no rule port. Low risk if S1–S6 text does not trigger LD cues.

### 4b — `objective_type` rule migration

Port lines ~3747–3750 to pack `lastMatchingMention`; skip legacy block when profile present. **First semantic migration**; pinned by S2/S4/S5 explicit subsets.

**Do not migrate first:** `input_strategy` blob cues (S2 validation narrative), full topic regex (LD pass1 pins), or `interpretWorkflowBriefText` body into pack v1.

---

## 9. Sprint 17 slice log (reference)

| Slice | Delivered |
|-------|-----------|
| 0 | S1–S6 golden fixtures + `workflow-research-sparse-briefs.test.js` |
| 1 | `validationRules` + `disclosurePolicy` + Planning notices |
| 2 | `conflictPolicies` (chained in validation) |
| 3 | Heuristic proceed gates (`generateResearchContentHeuristic`, `researchDesignPageAppend`) |
| **4** | **Explicit extract audit / proposal (this doc)** — implementation deferred |

---

## 10. Review log

- **2026-05-15** — Slice 4 consolidation note created; `explicitExtract` implementation deferred.
