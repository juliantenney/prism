# Sprint 38 — Pedagogical Visual Affordance Enrichment

**Pack path:** `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/`  
**Status:** **COMPLETE** — architecture implemented and validated E2E (Design Page → Compose → Renderer → VEU → images)  
**Date:** 2026-06-03  
**Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)  
**Test floor:** **706 pass / 0 fail** (after materials-fidelity patch)  
**Successor (active):** [Sprint 38-B — LD Prompt Architecture & Materials Fidelity](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/README.md) (planning)  
**Successor (gated):** [Sprint 39 — Reasoning Cue Specification](../../../sprints/sprint-39/README.md) (deferred until 38-B audit)  
**Predecessor:** [Sprint 37 — session framing and intellectual coherence](../2026-06-03-sprint-37-session-framing-intellectual-coherence/) (**COMPLETE**)

---

## Sprint overview

Sprint 38 improves the **pedagogical richness, specificity, and instructional value** of visual affordances emitted by PRISM’s learning-design workflow so that downstream **Visual Enhancement** can make better visual decisions **without reconstructing learning intent from page content**.

This is **not** an image-generation sprint, **not** a renderer sprint, and **not** a visual-enhancement architecture sprint.

| Focus | Not focus |
|-------|-----------|
| Upstream affordance semantics in LD / page compose | Image model quality or prompts |
| Purpose, representation, anti-spoiler, staging metadata | Renderer hooks, CSS, DOM placement (Sprint 36 — stable) |
| Handover to enhancement workflow consumption | Decorative styling or aesthetic tuning |

**Core principle:**

> Visuals should be selected because they **support thinking**, not because a **topic** is present.

---

## Problem statement (Economics Inflation validation)

Recent validation on the **Economics Inflation** project showed that the Visual Enhancement Utility performs reasonably well when placement and DOM contracts are respected. Failures cluster upstream:

| Symptom | Likely cause |
|---------|----------------|
| Visuals duplicate rather than support reasoning | Affordance lacks `reasoning_supported` / activity relationship |
| Visuals assert questionable relationships | Topic-only brief; no canonical representation guidance |
| Illustrated summaries instead of instructional diagrams | Missing `purpose` + `preferred_representation` |
| Generic clip-art / topic posters | Enhancement infers intent from prose (`topic: inflation`) |
| Too many indiscriminate image opportunities | No `activity_visual_value` gate or authored `reject` |
| “No visual” without rationale | Missing `visual_decision: reject` — omission treated as acceptable |

**Shallow affordance (current risk):**

```yaml
visual_affordance:
  topic: inflation
```

**Target affordance (north star — generate):**

```yaml
activity_visual_value:
  decision: high
  rationale: "Comparison indices are confused; framework supports table without replacing it."

visual_decision: generate
purpose: distinction
concepts: [inflation, relative price change, consumer price index, GDP deflator]
learner_stage: pre-classification
anti_spoiler: true
spoiler_boundary:
  hide_answers: true
  hide_classification_keys: true
  hide_model_solution: true
  allow_structural_hint: true
preferred_representation: comparison_framework
must_show: ["coverage dimension", "CPI vs deflator as distinct constructs"]
must_not_show: ["filled comparison cells", "which index is universally correct"]
source_basis: "comparison_table in activity_materials"
canonical_form_required: true
discipline_risk_level: medium
```

**Intentional no-visual (north star — reject):**

```yaml
activity_visual_value:
  decision: none
  rationale: "Warm-up cards carry inquiry; table is not yet canonical."

visual_decision: reject
rejection_reason: low_value_activity
```

See [fixtures/probe-38-4-enriched-affordance-example.yaml](fixtures/probe-38-4-enriched-affordance-example.yaml).

---

## Why this follows Sprint 36 and 37

| Sprint | Contribution | What Sprint 38 adds |
|--------|----------------|---------------------|
| **34** | Stable renderer contracts | Floor to preserve |
| **35** | Activity pedagogy, anti-spoiler copy patterns | Align affordance `anti_spoiler` with assessment/worksheet policy |
| **36** | DOM placement hooks (`.util-visual-affordance`, `data-visual-slot`) | **Semantic payload** for those slots — not new placement logic |
| **37** | Session framing, intellectual arc | Visuals support the **reasoning journey**, not topic decoration |
| **32 / VEU** | Enhancement workflow (v1.2: HTML+queue → generate images) | **Richer inputs** to Step 1; no VEU architecture change in 38-5 |

---

## Boundaries

| In scope | Out of scope |
|----------|--------------|
| Visual affordance generation in LD / Design Page / compose prompts | Image generation model changes |
| Affordance semantics, purpose taxonomy, representation guidance | Renderer changes (`utilityRenderVisualAffordanceHook` placement rules — frozen unless 38-4 mandates `data-*` passthrough only) |
| `visual_decision` / `rejection_reason`, `activity_visual_value`, spoiler boundaries, claim lists | Visual Enhancement Utility architecture redesign |
| Compose QA rules (purpose, generate field completeness, quantitative `requires_exact_data_match`) | Image model or CSS changes |
| Workflow handover guidance (38-5) | CSS / UI / aesthetic tuning |
| Observation-led audit on inflation + CI + climate anchors | Sprint 32 diagram orchestration (separate programme) |

**Preserve:** Sprint 34 golden contracts, Sprint 35 pedagogical fields, Sprint 36 affordance **placement** tests (`tests/utility-visual-affordance-hooks.test.js`), Sprint 37 session rhetoric, VEU embed DOM rules (v1.1.1 patch note; v1.2 hook placement contract).

---

## Proposed slices

| Slice | Title | Primary deliverable |
|-------|-------|---------------------|
| **38-1** | Visual affordance audit | [observations/38-1-visual-affordance-audit.md](observations/38-1-visual-affordance-audit.md) + [fixtures/probe-38-1-inflation-visual-affordance-audit.md](fixtures/probe-38-1-inflation-visual-affordance-audit.md) |
| **38-2** | Affordance purpose taxonomy | [observations/38-2-visual-purpose-taxonomy.md](observations/38-2-visual-purpose-taxonomy.md) |
| **38-3** | Representation guidance | [observations/38-3-representation-guidance.md](observations/38-3-representation-guidance.md) |
| **38-4** | Affordance enrichment design | [observations/38-4-affordance-enrichment-design.md](observations/38-4-affordance-enrichment-design.md) |
| **38-5** | Workflow alignment | [observations/38-5-workflow-alignment.md](observations/38-5-workflow-alignment.md) + [fixtures/probe-38-5-visual-enhancement-consumer-checklist.md](fixtures/probe-38-5-visual-enhancement-consumer-checklist.md) |

Charter detail: [SPRINT-38-CHARTER.md](SPRINT-38-CHARTER.md).

---

## Evaluation anchors

| Anchor | Path | Visual affordance focus |
|--------|------|-------------------------|
| **Inflation workshop** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`, `ld-inflation-workshop-csv-worksheet-page.json` | CPI/deflator distinction, classification matrix, household scenarios |
| **Climate misconception** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Evidence structure, mechanism vs slogan |
| **CI golden** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Interval overlap, level–width relationship |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | Comparison framework, causal chain |
| **Rendered HTML** | `buildUtilityStructuredHtmlForTest` + VEU Step 1 on export | Slot + subject today; enriched metadata tomorrow |

**Cross-references:**

- **VEU (authoritative repo copy):** [`utilities/visual-enhancement-utility/`](../../../../utilities/visual-enhancement-utility/) — **v1.2** frozen; **v1.2.1** Sprint 38 handover (`visual-enhancement-utility-v1.2.1.json`)
- Sprint 36 placement inventory: [36-4-imaging-placement-affordances.md](../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md)
- VEU v1.1.1 (historical three-step + embed patch): [visual-enhancement-utility-v1.1.1-patch-note.md](../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md)
- Sprint 37 inflation workshop policy: [37-6-workshop-pedagogical-support-recalibration.md](../2026-06-03-sprint-37-session-framing-intellectual-coherence/observations/37-6-workshop-pedagogical-support-recalibration.md)

---

## Suggested first prompt (38-1)

> **Context:** Sprint 38 planning pack complete; Sprint 37 closed; test floor **642 pass / 0 fail**.  
> **Task:** 38-1 — visual affordance audit.  
> **Review:** Inflation workshop (live + fixtures), CI golden, climate fixture; render HTML and inspect `.util-visual-affordance` hooks plus any upstream JSON affordance fields.  
> **Answer:** What does each affordance contain today? What must the enhancement workflow infer? Where did inflation visuals fail (duplicate, spoiler, wrong representation)?  
> **Deliver:** Completed `observations/38-1-visual-affordance-audit.md` and populated probe fixture.  
> **Constraints:** No renderer/CSS/image-model changes in 38-1.  
> **Success:** A learning designer could read the audit and see the gap between topic labels and instructional briefs.

Full handover: [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md).

---

## Pack contents

| File / folder | Purpose |
|---------------|---------|
| [README.md](README.md) | Overview (this file) |
| [SPRINT-38-CHARTER.md](SPRINT-38-CHARTER.md) | Governance, principles, success criteria |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Post–Sprint 37 state → Sprint 38 programme |
| [ARCHITECTURE.md](ARCHITECTURE.md) | End-to-end architecture and code map |
| [NOTES.md](NOTES.md) | Programme notes and slice log |
| [observations/](observations/) | Slice templates and audit/taxonomy/design notes |
| [fixtures/](fixtures/) | Probes and enriched-affordance examples |

---

## Regression command

When any code or test fixture changes:

```bash
node --test tests/*.test.js
```

**Current floor:** 697 pass / 0 fail.
