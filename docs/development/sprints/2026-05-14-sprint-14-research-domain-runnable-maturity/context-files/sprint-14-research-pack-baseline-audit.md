# Sprint 14 — Research pack baseline audit (read-only)

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-research-pack-baseline-audit.md`

**Role:** Snapshot the **Research** domain pack as represented in-repo **before** Sprint 14 implementation work, to anchor goals and tests. **Documentation only** — no file edits performed to produce this audit.

**Sources:** `domains/domain-manifest.json`; `domains/research/*.md`; cross-read `domains/learning-design/domain-learning-design-step-patterns.md` (headers + policy shape only).

---

## 1. Manifest registration (Research)

| Field | Value |
|-------|--------|
| **Domain id** | `research` |
| **Label** | Research |
| **Pack files** (order in manifest) | `domain-research-principles.md`, `domain-research-artefacts.md`, `domain-research-step-patterns.md`, `domain-research-prompt-rules.md` |
| **Always-on** | Research is **not** in `alwaysOnDomains`; **`general`** is always merged when Research is selected in Factory (normalised selection includes both). |

---

## 2. Research pack structure (files)

| File | Role (high level) |
|------|-------------------|
| **`domain-research-principles.md`** | Research workflow principles (human-readable). |
| **`domain-research-artefacts.md`** | Canonical artefact definitions (`normalized_content`, `argument_structure`, `key_findings`, …) — stable names for dependency graph. |
| **`domain-research-step-patterns.md`** | **`workflowPolicy`**, **`workflowBriefConfig`**, numbered step sections with **Prompt Factory** JSON + **`runnerInstructions`**. |
| **`domain-research-prompt-rules.md`** | Domain-scoped prompt rules for research runs. |

---

## 3. `workflowPolicy` presence (Research)

**Location:** `domains/research/domain-research-step-patterns.md` — fenced JSON under **`### Workflow Policy`**.

**Present:** **Yes.**

**`canonicalSteps` (12 titles, order matters for authoring expectations):**

1. Generate Research Content  
2. Normalize Content  
3. Extract Key Findings  
4. Model Argument Structure  
5. Build Evidence Map  
6. Conduct Thematic Analysis  
7. Build Literature Matrix  
8. Generate Research Questions  
9. Generate Research Summary  
10. Generate Briefing Note  
11. Validate Research Output  
12. Format Final Output  

**Also defined:** `maxOccurrences` (all `1` for listed steps), `dependencies` (requiresAnyOf / produces graph), `precedenceRules`, `triggerRules` (three branches keyed on **`objective_type`**: summary / briefing / questions — **no** branch for **`analysis`**), `stepRoleAnchors`, `finalSteps` (`Format Final Output`).

**`stepRoleAnchors` completeness:** The JSON **`stepRoleAnchors`** map includes anchors for steps such as **Normalize Content** through **Format Final Output** but **does not** include an entry for **`Generate Research Content`**, despite that title being first in **`canonicalSteps`** — likely **oversight** in pack authoring (validate during Sprint 14).

**Risk / gap (baseline):** Large policy surface vs typical short Factory brief — planner may **over-include** steps unless triggers and inference reliably narrow the graph (**assumption not validated** in this audit).

---

## 4. `workflowBriefConfig` / elicitation (Research)

**Location:** Same file — **`### Workflow Brief Config`** JSON.

**Required factors (as defined):** `objective_type`, `input_strategy`, `audience`, `output_depth`.

**Notable shape detail:** `objective_type` **`choices`** are **plain strings** in the JSON array (`"summary"`, `"analysis"`, …), not `{ value, label }` objects — differs from **`input_strategy`** in the same file and from many Learning Design select factors (**potential** UI/normalisation inconsistency; see `sprint-14-current-known-issues.md` **E4.1**).

**Optional factors:** e.g. `citation_style`.

**`uiHints`:** Research-scoped copy for Factory hints (design intent, audience, scope, inputs, outputs, constraints).

**`extraFields`:** e.g. `evidence_rigour` (select: exploratory / standard / strict).

**`inferenceRules`:** At least one rule (goal mentions “brief” / “briefing” / “note” → set `objective_type` briefing).

**`mappingRules`:** Map factors to `workflow.workflowOutputSpec.*` and constraints.

**`stopConditions` / `questionPolicy`:** Present (`all_required_factors_resolved`, max default questions 4).

**Comparison to Learning Design (brief):** LD pack embeds a richer **`workflowBriefConfig`** (including intent classes, refinement profiles, assessment-specific structures in the same step-patterns file per Sprint 10 audit lineage). Research brief is **smaller** but still multi-factor; **post-generation refinement** depth for Research vs LD **not** compared line-by-line in this audit.

---

## 5. Step patterns — prompt factories and `runnerInstructions`

**Location:** `domain-research-step-patterns.md` — numbered sections **`## 1.` … `## 12.`** (titles align with policy; **Generate Research Content** appears as **§2** in file numbering after Normalize — **ordering in file vs `canonicalSteps` list** should be checked during implementation: policy lists **Generate Research Content** first; file orders **Normalize Content** as **## 1**).

**Prompt Factory:** Each surveyed step includes a **`### Prompt Factory`** JSON block with fields such as `configurationMode`, `promptTemplate` / strategy, `userOptions`, `preferredOutputFormat`, **`runnerInstructions.what_this_step_does`**, and optional `defaultOutputStructure`.

**`runnerInstructions`:** Present on the steps inspected in the grep pass (Normalize, Generate Research Content, Extract Key Findings, … Format Final Output).

**Gap:** Whether **every** canonical step has a **complete** prompt factory + runner instruction pair matching policy titles — **not** exhaustively verified in this scaffolding audit (recommend checklist during Sprint 14 implementation).

---

## 6. Artefact flow (Research)

**Declared artefacts (sample from `domain-research-artefacts.md`):** Includes `normalized_content`, `argument_structure`, `key_findings`, and additional research-specific artefacts (full list in file).

**Policy `dependencies`** reference ids such as `research_content`, `normalized_content`, `topic`, `source_material`, `key_findings`, `evidence_map`, `thematic_analysis`, `literature_matrix`, `research_questions`, `research_summary`, `briefing_note`, `validated_research_output`, `final_output`.

**Risk:** **Crosswalk** between policy **produces** keys and artefact doc **definitions** — assumed aligned; **not** machine-verified here.

---

## 7. Comparison with Learning Design (summary)

| Dimension | Research (baseline) | Learning Design (reference) |
|-----------|---------------------|-----------------------------|
| **Policy size** | 12 canonical steps; rich dependency graph | Similar pattern; more LD-specific artefacts and assessment pathways |
| **Brief config** | Smaller; research objective + depth + citation optional | Larger; assessment/page intent classes and refinement queues |
| **App coupling** | Starting-artefact path uses **catalogue** filter for Research (Sprint 13 audit lineage); LD has **trio literals** in `app.js` | Higher **`app.js`** special-case surface historically |
| **Maturity posture** | **Sprint 14 target** — usable/trustworthy runnable domain | **More flight hours** in product copy and elicitation; not Sprint 14 scope to “dumb down” LD |

---

## 8. Currently known risks / gaps (pack-level)

- **K8.1** — **Step order presentation** in markdown vs **`canonicalSteps`** order — author confusion and planner mismatch risk.
- **K8.2** — **`triggerRules`** include **`objective_type`** values **`summary`**, **`briefing`**, and **`questions`** only — there is **no** rule for **`analysis`** despite **`analysis`** being a required **`objective_type`** choice in **`workflowBriefConfig`**. Impact on step inclusion for “analysis” workflows **not validated**.
- **K8.3** — **Bare-string** select choices for `objective_type` vs labelled choices elsewhere.
- **K8.4** — **Long chains** (12 steps) vs **short** Factory briefs — default generation may **skip** or **collapse** steps unpredictably without tests.

---

## 9. Assumptions not yet validated

- **`getWorkflowPolicy`** returns Research policy when `selectedDomains` includes `research` (first structured domain wins — **expected** per v1 reference; **not** re-run in VM here).
- **Real OpenAI** outputs respect Research **`promptFactory`** constraints under token budgets.
- **Post-generation elicitation** matrices for Research are **parity-safe** with LD in `app.js` (unknown until characterised).

---

## Review log

- **2026-05-14** — Initial baseline audit from repository files (documentation only).
