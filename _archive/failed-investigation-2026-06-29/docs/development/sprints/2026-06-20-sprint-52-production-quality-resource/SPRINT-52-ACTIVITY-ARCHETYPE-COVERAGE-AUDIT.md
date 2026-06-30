# Sprint 52 — Activity Archetype Coverage Audit

**Date:** 2026-06-18  
**Scope:** Implementation gaps, incomplete migrations, placeholder leakage, and generation-path inconsistencies affecting learner experience.  
**Constraints:** Architecture settled (Sprints 50–51). No architectural redesign recommendations.

---

## Executive summary

PRISM generates four frozen **episode-plan archetypes** (`understand`, `apply`, `analyse`, `evaluate`) plus a **`default`** inference fallback. Sprint 51 pedagogic salience (callouts, checklist split) is **renderer-only** and applies to a **narrow set of material keys**. Sprint 48 instructional patterns (SP-01–SP-07) are injected at **GAM only**, and only when **self-directed learner-page** gates pass.

The largest coverage gaps are: (1) **facilitated** and **non–learner-page** workflows bypass GAM pedagogic pattern injection; (2) **Analyse/Evaluate specialist materials** (`worked_analytic_pass`, `worked_judgement_weak_strong`, `modelling_note`) miss Sprint 51 callout wrapping due to material-hint mismatch; (3) **38L mandatory obligations** (checklist, worked analytic pass, independent judgement, transfer) are **harness-validated only**, not production-enforced; (4) **placeholder/stub bodies** can pass assembly when above minimal length thresholds.

---

## 1. Activity archetype inventory

### 1.1 Primary archetypes (frozen V1)

| Archetype | Episode-plan source | Beat count | Typical material obligations (from plan) |
|-----------|---------------------|------------|------------------------------------------|
| **understand** | `lib/episode-plan-v1-templates.js` | 12 | explanation, example, non_example, misconception, guided/independent practice, verification |
| **apply** | same | 12 | criteria_exposition, worked_thinking, guided/independent practice, verification, revision, transfer |
| **analyse** | same | 13 | criteria_exposition, explanation, worked_thinking, guided_inquiry/practice, independent performance, transfer |
| **evaluate** | same | 15 | perspective/criteria construction, worked_judgement, guided reasoning, evaluative_judgement, transfer |
| **default** | `inferActivityArchetype()` in `lib/page-gam-materials-preserve.js` | n/a | Fallback when id/title/material heuristics fail — uses `default` sequence weights in role registry |

Archetype derivation: LO `cognitive_level` → `archetypeFromCognitiveLevel()`, else positional fallback A1–A4 (`deriveEpisodePlanForActivity`).

### 1.2 Optional interaction metadata (not archetypes)

`activity_interaction_type` controlled values (`domains/learning-design/domain-learning-design-artefacts.md`):  
`sequencing`, `ranking`, `classification`, `discussion`, `analysis`, `practice`, `reflection`.

These affect renderer ordering/hints (e.g. task cards, shuffle) but do **not** change episode-plan archetype or GAM pattern injection.

### 1.3 Per-archetype generation and manifestation paths

| Archetype | Generator path | Manifestation path | Expected learner-facing output |
|-----------|----------------|-------------------|--------------------------------|
| **understand** | Episode Plan → DLA population (`episode-plan-population-contract.js` + `episode-plan-dla-integration.js`) → GAM → Design Page compose + GAM preserve (`page-gam-materials-preserve.js`) | Sprint 50 grammar (`ld-instructional-manifestation-render.js`) + Sprint 51 salience on eligible materials (`ld-pedagogic-salience-render.js`, `app.js` `renderMaterialValue`) | Orient (preamble) → Think (reasoning/self-explanation) → Study (text, worked example, sample output) → Do (table/task) → Check (checklist + mistakes/revise callouts) → Reflect |
| **apply** | same | same | Orient → Think (reasoning + transfer field when beat requires) → Study (worked calculation, sample output) → Worksheet/practice table → Check → Transfer prompt on culminating beat |
| **analyse** | same + DLA-WB-27 obligation (worked analytic pass before `analysis_table`) | same; `worked_analytic_pass` in Study band | Orient → Think (conceptual contrast) → Study (worked analytic pass, scenario, analysis table) → Check → Reflect/transfer |
| **evaluate** | same + DLA-WB-28/31 (independent judgement template, transfer_prompt, scenario, worked judgement) | same; evaluate-specific role families in `page-role-registry.js` | Orient → Think (argument structure, uncertainty) → Study (scenario, weak/strong judgement, guided decision table) → Independent template → Check → Transfer |
| **default** | same pipelines; archetype-specific IFP-10 rows may not bind | Role registry uses `default` weights — evaluate-only materials (transfer, independent template) not structurally required | Thin or mis-sequenced activity block; missing capstone pack when evaluate inferred incorrectly |

**Pipeline stages (all archetypes):**

1. **Episode Plan** — `deriveEpisodePlansFromLearningOutcomes`  
2. **Design Learning Activities** — `applyPopulationScaffoldToActivity`; learner-page PEL/output contract when `shouldApplyLearnerPagePedagogicFramingScaffold`  
3. **Generate Activity Materials** — SP-01–SP-07 via `applyInstructionalPatternPromptBlockToDraft` when `shouldApplySelfDirectedLearnerPageGamMaterialScaffold`  
4. **Design Page** — compose + `mergeGamMaterialsIntoPageJson` preservation overlay  
5. **Render** — instructional manifestation sections + pedagogic callouts

---

## 2. Sprint 51 coverage audit

Sprint 51 treatments map to **material types and headings**, not archetypes directly. Coverage below assumes a **self-directed learner-page** workflow (gates pass) and successful GAM generation.

| Treatment | Mechanism | understand | apply | analyse | evaluate | default |
|-----------|-----------|:----------:|:-----:|:-------:|:--------:|:-------:|
| **Annotated models** (SP-07 `## Why this works`) | GAM SP-07 + renderer callout | ✓ (example beat → `sample_output`) | ✓ (`model_calculation` / `sample_output`) | △ (less plan-mandatory) | ✗ (plan uses judgement not sample) | △ |
| **Expert insight** (SP-06 `## What experts notice`) | GAM SP-06 + renderer callout | ✓ (`worked_example`) | ✓ (`worked_example` / calculation) | **△ generation ✓, manifestation ✗** (`worked_analytic_pass` hint not salience-eligible) | **△** (`worked_judgement` / `modelling_note` — different body contract, no SP-06 heading) | △ |
| **Evaluative coaching** | PEL fields + GAM weak/strong judgement prose | △ (self-explanation focus) | △ | △ | ✓ (`argument_structure_hint`, worked judgement sections) | △ |
| **Diagnostic guidance** (SP-05 `## Common mistakes`) | GAM SP-05 + checklist split + callout | ✓ (checklist on every activity) | ✓ | ✓ | ✓ | ✓ if checklist present |
| **Revision guidance** (SP-05 `### If any check is not met`) | same | ✓ | ✓ | ✓ | ✓ | ✓ if checklist present |
| **PEL instructional framing** | DLA output contract + Sprint 50 Orient/Think bands | ✓ | ✓ | ✓ | ✓ | **✗ if learner-page gate fails** |
| **Check-quality support** | Checklist + verification beat + checkbox render | ✓ | ✓ | ✓ | ✓ (+ eval checklist alias) | △ |

**Legend:** ✓ = contractually expected on reference path; △ = partial or conditional; ✗ = not in archetype contract or systematically missing.

### Uncovered or partially covered archetypes / paths

| Gap | Affected archetypes / paths | Missing treatment(s) |
|-----|----------------------------|----------------------|
| **Facilitated learner handout** (`in_person`, `online_sync`, `blended`) | All | GAM SP-01–SP-07, table row adequacy, materials-copy contract — DLA PEL may still apply |
| **Non–learner-page workflow goal** (no “learner page” in outputs) | All | Entire learner-page scaffold stack (PEL, SP patterns, preamble exposition, design-page preservation scaffolds) |
| **Analyse** | analyse | Expert insight callouts on `worked_analytic_pass` (renderer hint gap) |
| **Evaluate** | evaluate | Annotated models (SP-07); Expert insight as SP-06 callout (uses weak/strong sections instead) |
| **default** | mis-inferred activities | Evaluate capstone materials, archetype-aligned PEL field expectations |
| **Interaction-only activities** (sequencing/ranking task cards) | any | SP-06/07 N/A unless paired with worked_example/sample_output; checklists may be thin |

---

## 3. Placeholder leakage audit

### 3.1 Detection surfaces

| Location | What it catches | What it misses |
|----------|-----------------|----------------|
| `design-page-materials-fidelity.js` `stringLooksPlaceholderOnly` | Strings &lt; 24 chars; label-only synopsis patterns; “example showing…”, “see full…” | `"as above"` (8 chars) flagged; longer generic stubs pass |
| `page-gam-materials-preserve.js` | Uses fidelity helper before merge; re-merges when page body is placeholder | Compose can win if upstream GAM also stubbed |
| GAM prompts FM-01 / SP-05 | Forbids `"as above"`, pointer checklists | Prompt-only — no post-generation rejection |
| `episode-plan-population-contract.js` | `[population:function]` prefix on cognition fields when scaffold applied | Leaks if DLA merge drops LLM fill |
| `app.js` assessment placeholder strip | `___`, `--`, `...` in HTML export | Only on specific export paths |

### 3.2 Leakage paths to rendered learner page

1. **GAM stub bodies** — `"as above"`, `"see checklist above"`, single-line material descriptions (FM-01 class); assembly accepts any non-empty string in `activity.materials.*`.  
2. **Design Page compose thinning** — LLM summarises materials; preserve merge restores when upstream is substantive, but **both** thin → placeholder reaches page.  
3. **`[population:…]` cognition stubs** — visible on activity card if LLM never replaced scaffold placeholders.  
4. **Synopsis-as-content** — 48–159 char definition-only strings pass fidelity (e.g. “inflation refers to…”).  
5. **Checklist without pedagogic sections** — pointer checklist or &lt;4 items may still render; Sprint 51 split/callouts only activate when `## Common mistakes` / `### If any check is not met` headings exist.  
6. **Task-card placeholder rows** — `Q1 ___` pattern used in some assessment card builders (`app.js` ~35016).  
7. **Empty/partial tables** — row adequacy enforced in prompt (`evaluateTableRowAdequacyForLearnerTask`) but default `minRows = 1` when learner_task does not encode counts.

---

## 4. Cardinality and completeness audit

| Element | Contract / expectation | Assembly behaviour | Underspecified cases that pass |
|---------|------------------------|-------------------|-------------------------------|
| **Task cards** | Distinct sub-activities only (`app.js` DLA shape rules) | Renders array cards | Single-card collections; duplicate table prompts |
| **Checklists** | SP-05: ≥4 criteria-linked items + mistakes + revise | Renders any checklist body | 1–3 items; no `## Common mistakes`; `"as above"` if &gt;24 chars unlikely |
| **Examples** | Understand: example + non_example beats; DLA-WB-08 early worked + sample | No runtime count gate | Activities with zero `worked_example` / `sample_output` in GAM output |
| **Scenarios** | DLA-WB-18 when session uses scenario language | Renders if key present | Label-only scenario string (&lt;80 chars) may pass preserve |
| **Worksheets / tables** | LD-TABLE-FIDELITY: row count matches learner_task | Prompt + `evaluateTableRowAdequacyForLearnerTask` | Single blank row when task does not state cardinality |
| **Evaluate capstone** | DLA-WB-28/31: independent template + transfer_prompt + checklist | `validateDla38LObligations` in **tests/harness only** | Final activity missing template/transfer still composes |
| **Analyse depth** | DLA-WB-27: worked analytic pass **before** analysis_table | Harness checker | Production DLA step does not hard-fail |
| **Reasoning chain** | AC-01: worked → guided → independent distinct | `detectAcViolations` in population contract (soft validation) | Collapsed T1 triple in merged DLA (38S merge history) |

---

## 5. Richness consistency audit

| Thinner experience | vs reference (understand/apply) | Root cause |
|--------------------|-----------------------------------|------------|
| **Evaluate activities** | Fewer annotated-model callouts; different coaching shape | **Generator contract** — SP-07 targets `sample_output`; evaluate uses judgement/template/scenario materials |
| **Analyse worked analytic pass** | Expert insight prose may exist but renders as plain markdown | **Manifestation omission** — `utilityShouldApplyPedagogicSalience` excludes `worked_analytic_pass` key |
| **Facilitated workshop pages** | Thinner checklists, no guaranteed mistakes/revise blocks | **Missing enrichment stage** — self-directed GAM gate skips SP-05–07 |
| **default-archetype activities** | Missing transfer, independent template, weak/strong judgement | **Generator contract** — IFP-10 rows bind to evaluate capstone detection |
| **Text / concept exposition** | No Sprint 51 callouts (by design) | **Different generator contract** — SP-01 connective prose, not callout pattern |
| **consolidation_summary / transfer_prompt** | No pedagogic callout styling | **Manifestation omission** — not in salience hint list |
| **Post-compose pages** | Regression vs GAM upstream | **Preservation failure** when preserve merge not triggered or upstream equally thin |

---

## 6. Top five functional defects (learner experience)

| # | Defect | Impact | Cause class |
|---|--------|--------|-------------|
| **1** | **Facilitated / blended delivery skips GAM pedagogic patterns (SP-01–SP-07)** | Checklists, worked examples, and sample outputs lack guaranteed Common mistakes, What experts notice, Why this works sections on workshop handouts | **Missing enrichment stage** — `shouldApplySelfDirectedLearnerPageGamMaterialScaffold` requires self-directed delivery |
| **2** | **`worked_analytic_pass` and evaluate judgement materials do not receive Sprint 51 callout wrapping** | Analyse and Evaluate “Study” blocks look flat despite GAM possibly emitting SP-06-style headings | **Manifestation omission** — `utilityShouldApplyPedagogicSalience` only matches `worked_example`, `sample_output`, `checklist` keys |
| **3** | **38L mandatory rows (checklist, analytic pass, independent judgement, transfer) not enforced at runtime** | Capstone evaluate and analyse activities can ship without verification, transfer, or modelling materials | **Implementation gap** — `validateDla38LObligations` used in harness/tests only; DLA step stores validation errors but does not block emit |
| **4** | **Placeholder/stub GAM bodies (`as above`, synopsis labels) reach learner page** | Learners see pointer text or empty-feeling materials | **Content-generation weakness** + **preservation failure** — prompt FAIL markers not backed by post-capture rejection; fidelity helper misses short stubs only |
| **5** | **Checklist pedagogic split depends on exact markdown headings** | Checklists with valid items but free-text mistakes/revise sections render as monolithic checkbox list without diagnostic/revision callouts | **Manifestation omission** — Sprint 51 split requires `## Common mistakes` and `### If any check is not met:` literally; generation often omits or paraphrases headings |

---

## 7. Recommended Sprint 52 investigation follow-ups (implementation-only)

These are **not** architecture changes — targeted fixes aligned with settled Sprints 50–51:

1. Extend `utilityShouldApplyPedagogicSalience` / `utilityIsWorkedExampleMaterialHint` to include `worked_analytic_pass`, `worked_judgement_weak_strong`, and `modelling_note` when body contains SP-06 headings.  
2. Wire `validateDla38LObligations` into DLA post-capture (mirror population contract validation pattern) or GAM preflight.  
3. Add post-GAM stub scanner for FM-01 patterns (`as above`, `see above`, purpose-only rows) before Design Page compose.  
4. Audit facilitated learner-page workflows: either narrow the self-directed gate for SP patterns or document explicit exclusion.  
5. Normalise checklist heading aliases in `splitChecklistPedagogicSections` (e.g. “Common errors”, “If you missed any checks”).

---

## Appendix — Key code references

| Concern | Primary file(s) |
|---------|-----------------|
| Archetype templates | `lib/episode-plan-v1-templates.js` |
| GAM pattern injection gate | `app.js` `applyInstructionalPatternPromptBlockToDraft`, `shouldApplySelfDirectedLearnerPageGamMaterialScaffold` |
| SP-05–07 contracts | `lib/instructional-pattern-prompt.js` |
| Sprint 51 renderer | `lib/ld-pedagogic-salience-render.js`, `app.js` `utilityApplyPedagogicSalienceHtml` |
| Sprint 50 manifestation | `lib/ld-instructional-manifestation-render.js` |
| 38L obligations checker | `lib/dla-38l-obligation-check.js` |
| Placeholder detection | `lib/design-page-materials-fidelity.js` |
| GAM → page preserve | `lib/page-gam-materials-preserve.js` |
| Role/archetype sequencing | `lib/page-role-registry.js` |
