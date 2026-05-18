# app.js — assessment UI & configuration excerpts

**Canonical source (authoritative):** `app.js`

**Why this matters for Sprint 23:** These are the **runtime** surfaces Sprint 23 must review before retiring bespoke logic. Unified Settings (Sprint 22) renders pack controls generically; assessment still uses **special-case** inheritance and PF toggles below.

---

## 1. Design Assessment → Generate Assessment Items mappers

**Lines ~1085–1118**

```javascript
function mapDesignAssessmentActivityTypeToResponseFormats(value) {
  var map = {
    mcq: "single_answer_mcq",
    short_answer: "short_answer",
    essay: "essay",
    problem: "short_answer",
    case_study: "essay",
    mixed: "all_formats_mix"
  };
  return map[v] || "";
}

function mapDesignAssessmentDifficultyToItemsDifficultyProfile(value) {
  var map = {
    introductory: "foundational",
    moderate: "balanced",
    advanced: "higher_order"
  };
  return map[v] || "";
}

function mapDesignAssessmentCoverageToItemsCoverageMode(value) {
  var map = {
    narrow: "selected_themes",
    balanced: "balanced",
    broad: "broad_coverage"
  };
  return map[v] || "";
}
```

**Review focus:** Vocabulary bridge between Design Assessment PF options and generate-items param names — should live in pack mapping policy long-term.

---

## 2. resolveAssessmentItemsInheritedOptions (core inheritance)

**Lines ~3473–3552** — see [`ld-bespoke-pf-controls.md`](ld-bespoke-pf-controls.md).

**Behaviour summary:**

1. Start from brief `stepParamPatch` for `step_generate_assessment_items`.  
2. Walk **backward** in workflow `steps[]` for `step_design_assessment` / title match.  
3. Translate Design Assessment step notes into `response_formats`, `number_of_items`, `difficulty_profile`, `coverage_mode`.  
4. Merge with current step params; explicit user overrides win when advanced toggle enabled.

**Inherited key set:**

```javascript
var inheritedKeys = {
  response_formats: true,
  number_of_items: true,
  difficulty_profile: true,
  coverage_mode: true
};
```

---

## 3. renderWorkflowStepPromptConfigUI — pack controls + PF fallback

**Lines ~3555–3665 (assessment subset)**

**Order of rendering:**

1. Pack `stepParameterControls` via `renderWorkflowPackParameterControlsSection` (when declared).  
2. Filter PF `userOptions` with `filterUserOptionsExcludingPackKeys` (avoid duplicate DOM for pack-owned ids).  
3. For generate-items: show inheritance notice + **advanced options** checkbox.  
4. Apply `resolveAssessmentItemsInheritedOptions` before rendering remaining `userOptions`.

**State:** `state.assessmentItemsShowAdvancedOptions` (default `false`) — line ~207.

---

## 4. applyWorkflowStepPromptDefaults — prompt template hydration

**Lines ~4053–4074**

When `isGenerateAssessmentItemsContext(ctx)`, effective option values passed to prompt template use inherited resolution (same helper as PF UI).

---

## 5. Workflow generation — Design Assessment step pruning

**Lines ~10869–10876**

```javascript
if (
  title === "design assessment" &&
  (assessmentItemsRequested || formativeAssessmentPackDefaultIntent) &&
  !assessmentBlueprintRequested &&
  !workshopRichWorkflowIntent
) {
  return false;
}
```

**Not PF UI** but affects whether Design Assessment exists for inheritance — ties elicitation intent to graph shape.

---

## Sprint 23 review checklist

| Question | Where to look |
|----------|----------------|
| Can `difficulty_level` / `coverage_breadth` move to `stepParameterControls`? | Pack §7 + this inheritance |
| Does Settings show generate-items params users expect? | Only `number_of_items` in pack metadata today |
| Can inheritance use `canonical_step_id` only (no title fallback)? | `resolveAssessmentItemsInheritedOptions` |
| What breaks if bespoke branch removed? | Manual LD workflow: Design Assessment → Generate Assessment Items |
