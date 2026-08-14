# Post–Sprint 77 — DLA `material_type` presentation vocabulary

**Status:** **IMPLEMENTED** (2026-08-14)  
**Mode:** Bounded maintenance after Sprint 77 close — **does not reopen Sprint 77**  
**Classification:** A — DLA was using `material_type` as a pedagogical/semantic label; architecture defines it as a presentation/rendering token.

---

## Boundaries (honoured)

- Renderer **unchanged** (no aliases for invented types).
- T-023 GAM commission binding **unchanged**.
- Schema **unchanged**.
- Validators **unchanged**.
- T-031 / P01 / P02 / T-033 wording **untouched**.

---

## Repair

Canonical DLA §6 (material commissioning) now states that every `required_materials[].material_type` MUST be a token from live `MATERIAL_RENDERER_TYPES` (`lib/learner-renderer-vnext/parse-material.js`). Pedagogical meaning stays in `purpose`, `specification`, `instructional_archetype`, and `archetype_plan`.

Live contract version: **`77-DLA-CANONICAL-3`**.

Node assembly requires the renderer registry. Browser has a frozen fallback copy that tests assert equals the registry (duplication risk documented; keep in lockstep if the registry changes).

GAM reminder: **NO** — T-023 already preserves `material_type` and forbids substitution.

---

## Canonical vocabulary (registry)

`text` · `worked_example` · `sample_output` · `checklist` · `analysis_table` · `scenario` · `decision_table` · `modelling_note` · `prompt_set` · `comparison_table` · `classification_table` · `planning_table` · `reference_table` · `data_table` · `impact_table` · `template` · `task_card` · `transfer_prompt` · `consolidation_summary`

---

## Operator retry

From the **current valid Episode Plan**: rerun **DLA → GAM → assemble → Preview HTML**. Do not regenerate EP. If Preview succeeds, continue to QA. Non-blocking quality issues: record for Monday; do not stop the chain today.
