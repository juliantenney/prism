# LD bespoke Prompt Factory controls (runtime references)

**Canonical source (authoritative):** `app.js` (functions below)

**Why this matters for Sprint 23:** Slice **23-3** audits **bespoke** PF behaviour that is **not** fully expressed in pack `stepParameterControls`. These branches predate unified Settings and implement **cross-step assessment inheritance** and **title/canonical matching** — candidates for pack-declared policy or retirement after parity.

---

## Inventory (LD-relevant bespoke PF / WGC hooks)

| Symbol / area | Approx. lines | Role |
|---------------|---------------|------|
| `isGenerateAssessmentItemsContext` | **1065–1075** | Detect generate-items step for special PF UI |
| `resolveAssessmentItemsInheritedOptions` | **3473–3552** | Walk back to Design Assessment; map params |
| `mapDesignAssessmentActivityTypeToResponseFormats` | **1085–1097** | `activity_type` → `response_formats` |
| `mapDesignAssessmentDifficultyToItemsDifficultyProfile` | **1099–1108** | `difficulty_level` → `difficulty_profile` |
| `mapDesignAssessmentCoverageToItemsCoverageMode` | **1110–1118** | `coverage_breadth` → `coverage_mode` |
| `renderWorkflowStepPromptConfigUI` (assessment branch) | **3612–3665** | Inherited notice + advanced toggle |
| `applyWorkflowStepPromptDefaults` (assessment branch) | **4053–4074** | Merge inherited values into prompt options |
| `isGenerateAssessmentItemsStep` (duplicate detector) | **4564–4574** | Inner scope duplicate of context check |
| `isDesignLearningActivitiesStep` | **4575–4585** | LD step detector (activities) |
| `isMcqLikeAssessmentContext` | **4586+** | MCQ intent heuristics from draft/notes |
| WGC step pruning — `design assessment` | **10870–10876** | Optional-step inclusion rules |

**Pack-side bespoke (not runtime):** Design Assessment and Generate Assessment Items have **large** `userOptions` arrays in `domain-learning-design-step-patterns.md` §7–§9 while Settings metadata is thinner — see [`ld-design-assessment-excerpts.md`](ld-design-assessment-excerpts.md).

---

## Excerpt — step detection (generate assessment items)

```javascript
function isGenerateAssessmentItemsContext(context) {
  var title = String(
    (context && (context.stepCanonicalTitle || context.stepTitle)) || ""
  ).toLowerCase();
  var canonicalId = String((context && context.stepCanonicalStepId) || "").toLowerCase();
  return (
    canonicalId === "step_generate_assessment_items" ||
    title === "generate assessment items" ||
    title.indexOf("generate assessment") !== -1
  );
}
```

---

## Excerpt — inheritance resolution (Design Assessment → generate items)

```javascript
// Inside resolveAssessmentItemsInheritedOptions — find prior Design Assessment step
if (canonicalId === "step_design_assessment" || title === "design assessment") {
  step4 = row;
  break;
}
// ...
var translated = {
  response_formats: mapDesignAssessmentActivityTypeToResponseFormats(step4Params.activity_type),
  number_of_items: normalizeAssessmentItemCount(step4Params.total_items),
  difficulty_profile: mapDesignAssessmentDifficultyToItemsDifficultyProfile(step4Params.difficulty_level),
  coverage_mode: mapDesignAssessmentCoverageToItemsCoverageMode(step4Params.coverage_breadth)
};
```

**Key mismatch for Sprint 23:** Pack `stepParameterControls` use `activity_type` / `total_items`; inheritance reads `difficulty_level` and `coverage_breadth` from Design Assessment **step notes** (PF `userOptions` ids, not Settings control keys).

---

## Excerpt — PF UI (inherited assessment notice)

```javascript
if (isAssessmentItemsStep) {
  // Appends muted notice: "Core assessment settings are inherited from Design Assessment by default."
  // + checkbox: "Show advanced options (including inherited overrides)"
  // Hides response_formats, number_of_items, difficulty_profile, coverage_mode
  // unless state.assessmentItemsShowAdvancedOptions
}
```

---

## Excerpt — WGC optional-step pruning (Design Assessment)

```javascript
if (
  title === "design assessment" &&
  (assessmentItemsRequested || formativeAssessmentPackDefaultIntent) &&
  !assessmentBlueprintRequested &&
  !workshopRichWorkflowIntent
) {
  return false; // exclude step from generated workflow
}
```

**Sprint 23 link:** Topology is driven by elicitation/intent signals, not Settings — align with `assessment_required` / `assessment_strategy` factors.

---

## Retirement criteria (from sprint bootstrap)

1. Pack `stepParameterControls` (+ workflow controls) cover all inherited keys with documented precedence.  
2. Unified Settings exposes tunables users need without PF-only fields.  
3. Cross-step inheritance declared in pack or generic mapping — not title-string walks in `app.js`.  
4. Tests prove generate-items behaviour unchanged.
