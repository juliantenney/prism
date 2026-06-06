# 38O-2 — Role taxonomy and page-mapping analysis

**Date:** 2026-06-05  
**Status:** **COMPLETE** (analysis only)  
**Type:** Discovery — taxonomy and mapping  
**Predecessor:** [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Executive summary

This phase formalises the **instructional role system** operating across GAM → Page (raw + merged) → Render on **`EV-38M-AFTER`** / **`EV-38N-AFTER`**.

| Finding | Detail |
|---------|--------|
| **Role vocabulary is fragmented** | No single authority defines instructional role; GAM uses `type`+`purpose`, page uses free-form keys, merge uses `pageFieldKeyForMaterial`, render uses `prettyMaterialHeading(key)` |
| **A1–A3 mappings are mostly stable** | Roles survive with **renaming** and **alias duplication**; body fidelity ≈ role fidelity |
| **A4 mappings are unstable** | Five evaluative roles show **compression**, **duplication**, **role inversion** (raw), and **render deprioritisation** (merged) |
| **Merge contract is authoritative for body** | `pageFieldKeyForMaterial` + 38M merge restores GAM bodies on canonical keys |
| **Compose keys remain authoritative for render order** | Renderer emits LLM compose keys first; merged canonical keys appear later as duplicate blocks |
| **Scaffold/reasoning live outside materials** | `scaffold_hint_sequence`, `reasoning_orientation` on activity row — not in GAM materials list |

**Verdict:** A formal role taxonomy is established. Role identity problems cluster on **A4 evaluative judgement roles** and on **cross-layer many-to-many key aliasing**. Evidence supports 38O-3 failure-mode classification. **No fixes proposed.**

---

## Instructional role taxonomy

### Definition

An **instructional role family** is the pedagogical function a material performs for the learner (e.g. model a calculation, contrast weak/strong judgement), **independent of** storage key, GAM `type` label, or render heading.

### Core role families (charter minimum)

| Role family | Pedagogical function | Typical learner signal |
|-------------|---------------------|------------------------|
| **explanatory_guidance** | Concept exposition, criteria framing, reading text | Prose explaining ideas or rubric dimensions |
| **worked_example** | Stepwise worked thinking (non-calculation) | Numbered steps showing reasoning process |
| **worked_calculation** | Stepwise worked numeric procedure | Calculation steps with intermediate values |
| **worked_analytic_pass** | Multi-lens analytic demonstration | Lens-by-lens analysis of a scenario |
| **model_answer** | Reference prose answer (non-numeric) | Complete exemplar explanation |
| **model_calculation** | Reference completed calculation | Filled table / final numeric result |
| **sample_output** | *Umbrella storage role* — page key name for model_answer or model_calculation | Same as model_*; disambiguated by GAM `purpose` |
| **scenario** | Case context, decision menu, household narrative | Scenario cards / strategy menu |
| **practice_table** | Learner worksheet, classification, analysis grid | Empty or partial-fill table for learner completion |
| **checklist** | Verification / self-assessment checklist | Checkbox list with remediation hints |
| **scaffold_hint** | Step hints sequencing learner work | Bullet list of progressive hints (activity row) |
| **reasoning_support** | Orientation to reasoning method (not full exemplar) | Short framing: how to reason, not full worked pass |
| **worked_judgement_support** | Contrasting weak vs strong evaluative exemplars | Side-by-side judgement quality demonstration |
| **guided_judgement_table** | Partially exemplified decision/ranking grid | Table with hints, exemplar rows, ranking column |
| **independent_template** | Scaffold for learner's own judgement product | Memo / letter template with sections |
| **transfer_prompt** | Apply method to learner's own context | Transfer task with word-band |
| **consolidation_summary** | Teacher consolidation / session closure prose | Reflective summary (teacher voice) |

### Additional role families (evidence-supported)

| Role family | Source | Notes |
|-------------|--------|-------|
| **learner_task** | Activity row `learner_task` | Markdown task spec; rendered as "What to do" — not a GAM material |
| **reasoning_orientation** | Activity row field | One-line cognition framing; complements scaffold_hint |
| **self_explanation_prompt** | Activity row field | Metacognitive prompt; present on all activities in EV-38M-AFTER |
| **evaluative_judgement_episode** | 38I-4 A4 reference | *Composite* — scenario + criteria + worked judgement + guided table + template + transfer + consolidation |

### Role assignment rule (38O trace)

```text
role_family := f(GAM.type, GAM.purpose)
```

When `type` alone is ambiguous (e.g. `worked_example`, `sample_output`, `text`, `scenario`), **`purpose` disambiguates**.

### Roles absent from EV-38M-AFTER GAM

No materials mapped to **misconception_check** or standalone **reasoning_support** GAM type in this run. Reasoning support appears via activity-row fields and thin A4 `modelling_note` stub (mis-tagged — see A4 deep dive).

---

## GAM → Page → Render mapping table

**Evidence run:** `EV-38M-AFTER` (GAM, page raw, page merged) · `EV-38N-AFTER` (render)  
**Legend — identity status:** ST=stable · RN=renamed · DP=duplicated · CP=compressed · RI=role-inverted · RD=render-deprioritised

### A1 — Understand (M1–M4)

| Mat | GAM type | GAM purpose | Role family | Page raw key(s) | Page merged key(s) | Merge contract key | Render heading(s) | Identity |
|-----|----------|-------------|-------------|-----------------|-------------------|--------------------|--------------------|----------|
| M1 | text | concept elucidation | explanatory_guidance | `concept_text` | `concept_text`, `concept_exposition` | `concept_exposition` | Concept Text · Concept Exposition | RN, DP |
| M2 | worked_example | worked thinking | worked_example | `worked_example` | `worked_example` | `worked_example` | Worked Example | ST |
| M3 | sample_output | model answer reference | model_answer | `sample_output` | `sample_output` | `sample_output` | Sample Output | ST |
| M4 | checklist | verification | checklist | `verification_checklist` | `verification_checklist`, `checklist`, `checklist_evaluate`, `evaluation_checklist` | `checklist_evaluate` | Checklist · Verification Checklist · Checklist Evaluate | RN, DP, RD |
| — | activity_row | scaffold_hint_sequence | scaffold_hint | `scaffold_hint_sequence` | `scaffold_hint_sequence` | — | *(activity row)* | ST |

### A2 — Apply CPI calculation (M5–M8)

| Mat | GAM type | GAM purpose | Role family | Page raw key(s) | Page merged key(s) | Merge contract key | Render heading(s) | Identity |
|-----|----------|-------------|-------------|-----------------|-------------------|--------------------|--------------------|----------|
| M5 | worked_example | worked thinking | worked_calculation | `worked_example` | `worked_example` | `worked_example` | Worked Example | ST *(RN label)* |
| M6 | sample_output | model calculation reference | model_calculation | `sample_output` | `sample_output` | `sample_output` | Sample Output | ST |
| M7 | classification_table | practice table | practice_table | `practice_table` | `practice_table`, `classification_table`, `worksheet` | `classification_table` | Worksheet · Practice Table | RN, DP |
| M8 | checklist | verification | checklist | `verification_checklist` | `verification_checklist`, `checklist`, `checklist_evaluate` | `checklist_evaluate` | Checklist · Verification Checklist · Checklist Evaluate | RN, DP, RD |
| — | activity_row | scaffold_hint_sequence | scaffold_hint | `scaffold_hint_sequence` | `scaffold_hint_sequence` | — | *(activity row)* | ST |

### A3 — Analyse households (M9–M12)

| Mat | GAM type | GAM purpose | Role family | Page raw key(s) | Page merged key(s) | Merge contract key | Render heading(s) | Identity |
|-----|----------|-------------|-------------|-----------------|-------------------|--------------------|--------------------|----------|
| M9 | worked_example | worked analytic pass | worked_analytic_pass | `worked_example` | `worked_analytic_pass`, `worked_example` | `worked_analytic_pass` | Worked analytic pass | RN, DP |
| M10 | analysis_table | practice analysis | practice_table | `analysis_table` | `analysis_table` | `analysis_table` | Worksheet | RN |
| M11 | scenario | case study | scenario | `scenario` | `scenario`, `scenario_maya_households`, `scenarios[]` | `scenario_maya_households` | Scenario Maya households | RN, DP |
| M12 | checklist | verification | checklist | `verification_checklist` | `checklist`, `verification_checklist`, `checklist_evaluate` | `checklist_evaluate` | Checklist | RN, DP |
| — | activity_row | scaffold_hint_sequence | scaffold_hint | `scaffold_hint_sequence` | `scaffold_hint_sequence` | — | *(activity row)* | ST |

*A3 render order governed by `materials_order` (38N) — worked pass precedes checklist.*

### A4 — Evaluate strategies (M13–M20)

| Mat | GAM type | GAM purpose | Role family | Page raw key / len | Page merged key(s) / len (% GAM) | Merge contract | Render heading(s) / order pos | Identity |
|-----|----------|-------------|-------------|-------------------|----------------------------------|----------------|------------------------------|----------|
| M13 | scenario | decision context | scenario | `scenario` 828 (98%) | `scenario` 828, `scenario_maya_households` 842, `scenarios[]` 842 | `scenario_maya_households`* | Scenarios (3199) · Scenario Maya households (14687) | RN, DP, RD |
| M14 | text | criteria exposition | explanatory_guidance | `criteria_text` 530 (71%) | `criteria_text` 530, `concept_exposition` 745 (100%) | `criteria_exposition_evaluate` | Criteria Text (8151) · Concept Exposition (15847) | CP, DP, RD |
| M15 | modelling_note | worked judgement | worked_judgement_support | `modelling_note` 273 (25%) | `modelling_note` 273, `worked_judgement_weak_strong` 1082 (100%), `worked_example` 1082 | `worked_judgement_weak_strong` | Modelling Note (8995) · Worked Judgement Weak Strong (16908) · Worked Example (22182) | CP, DP, RD |
| M16 | decision_table | guided judgement | guided_judgement_table | `decision_table` 1047 (68%) shell | `decision_table` 1047, `guided_judgement_table` 1542 (100%) | `guided_judgement_table` | Decision Table (9495) · Guided Judgement Table (18261) | CP, DP, RD |
| M17 | template | independent judgement | independent_template | `independent_judgement_template` 345 (26%) | `independent_judgement_template` 1352 (100%), `template` 1352 | `independent_judgement_template` | Template (6329) · Independent Judgement Template (10496) | CP, DP, RD |
| M18 | checklist | verification | checklist | `verification_checklist` 417 (63%) | `verification_checklist` 417, `checklist` 663 (100%), `checklist_evaluate` 663 | `checklist_evaluate` | Checklist (4513) · Verification Checklist (12315) · Checklist Evaluate (19784) | CP, DP, RD |
| M19 | transfer_prompt | transfer | transfer_prompt | `transfer_prompt` 234 (31%) | `transfer_prompt` 234, `transfer_prompt_evaluate` 752 (100%) | `transfer_prompt_evaluate` | Transfer Prompt (13301) · Transfer Prompt Evaluate (21140) | CP, DP, RD |
| M20 | consolidation_summary | session closure | consolidation_summary | `consolidation_summary` 230 (31%) **RI** | `consolidation_summary` 738 (100%) | `consolidation_summary` | Consolidation Summary (13748) | RI (raw), ST (merged) |
| — | activity_row | scaffold_hint_sequence | scaffold_hint | 384 chars | 384 chars | — | *(activity row)* | ST |

\*Merge maps A4 scenario to `scenario_maya_households` contract though GAM purpose is `decision context` not `case study` — contract uses type-only branch when purpose lacks "strategy/menu".

---

## Role identity analysis

Aggregate identity classification **per role family** across EV-38M-AFTER:

| Role family | ST | RN | DP | CP | RI | RD | Primary activities |
|-------------|----|----|----|----|----|----|--------------------|
| explanatory_guidance | ✓ A1 | ✓ | ✓ A1,A4 | ✓ A4 | — | ✓ A4 | A1 stable; A4 degraded raw |
| worked_example | ✓ A1 | — | — | — | — | — | A1 |
| worked_calculation | ✓ | ✓ label | — | — | — | — | A2 uses `worked_example` key |
| worked_analytic_pass | — | ✓ | ✓ | — | — | — | A3 |
| model_answer | ✓ | — | — | — | — | — | A1 |
| model_calculation | ✓ | — | — | — | — | — | A2 |
| sample_output | ✓ | — | — | — | — | — | Storage key for model_* |
| scenario | ✓ | ✓ | ✓ | — | — | ✓ A4 | A3 ordered; A4 duplicate headings |
| practice_table | ✓ | ✓ | ✓ | — | — | — | Renamed to analysis/classification/worksheet |
| checklist | ✓ | ✓ | ✓ | ✓ A4 | — | ✓ all | 4–5 keys per activity post-merge |
| scaffold_hint | ✓ | — | — | — | — | — | Activity row only |
| reasoning_support | — | — | — | ✓ | ✓ A4 | — | Row fields + mis-tagged modelling_note stub |
| worked_judgement_support | — | ✓ | ✓ | ✓ A4 | — | ✓ A4 | A4 only |
| guided_judgement_table | — | ✓ | ✓ | ✓ A4 | — | ✓ A4 | A4 only |
| independent_template | — | ✓ | ✓ | ✓ A4 | — | ✓ A4 | A4 only |
| transfer_prompt | — | ✓ | ✓ | ✓ A4 | — | ✓ A4 | A4 only |
| consolidation_summary | ✓ merged | — | — | ✓ raw | ✓ raw | — | Raw learner-write prompt |

### Identity problem definitions (38O-3 prep)

| Problem | Definition | Example |
|---------|------------|---------|
| **Stable** | Same role family, key, heading, ≥90% body | A1 M2 worked_example |
| **Renamed** | Role survives; page key ≠ GAM type | M9 → `worked_example` raw, `worked_analytic_pass` merged |
| **Duplicated** | ≥2 keys same role family post-merge | A4 `modelling_note` + `worked_judgement_weak_strong` |
| **Compressed** | Key present; body <50% GAM | A4 raw `modelling_note` 25% |
| **Role-inverted** | Key name implies role A; body performs role B | A4 raw `consolidation_summary` = learner write task |
| **Render-deprioritised** | Weaker instance renders before stronger | A4 Modelling Note pos 8995 before Worked Judgement 16908 |

---

## A4 deep dive

Evaluative judgement episode — five charter roles traced GAM → Raw → Merged → Render.

### 1. Worked judgement (`M15` — worked_judgement_support)

| Stage | Representation | Body / function |
|-------|----------------|-----------------|
| **GAM** | `modelling_note` / purpose `worked judgement` | 1082 chars — full weak/strong contrasting exemplars |
| **Page raw** | `modelling_note` | 273 chars — definitional stub ("Weak Judgement: slogans… Strong Judgement: criteria…") |
| **Page merged** | `modelling_note` 273 + `worked_judgement_weak_strong` 1082 + `worked_example` 1082 | Full GAM body on merge contract keys; **stub not removed** |
| **Render** | h4 **Modelling Note** (8995) then **Worked Judgement Weak Strong** (16908) then **Worked Example** (22182) | Learner sees stub first under misleading "Modelling Note" label |

**Role transformation:** GAM **worked judgement exemplar** → raw **reasoning_support stub** → merged **duplicate triple** → render **deprioritised stub**.

---

### 2. Guided judgement (`M16` — guided_judgement_table)

| Stage | Representation | Body / function |
|-------|----------------|-----------------|
| **GAM** | `decision_table` / `guided judgement` | 1542 chars — exemplar hints, strategy rows A–E, ranking column |
| **Page raw** | `decision_table` | 1047 chars — empty ranking grid, no exemplar rows (**table shell**) |
| **Page merged** | `decision_table` 1047 + `guided_judgement_table` 1542 | Full table on merge key; shell retained |
| **Render** | **Decision Table** (9495) before **Guided Judgement Table** (18261) | Shell precedes full guided table |

**Role transformation:** GAM **guided exemplar table** → raw **practice_table shell** → merged duplicate → render shell first.

---

### 3. Independent judgement (`M17` — independent_template)

| Stage | Representation | Body / function |
|-------|----------------|-----------------|
| **GAM** | `template` / `independent judgement` | 1352 chars — full memo template with sections + word band |
| **Page raw** | `independent_judgement_template` | 345 chars — bullet scaffold only |
| **Page merged** | `independent_judgement_template` 1352 + `template` 1352 | Merge overwrites with full body; alias duplicated |
| **Render** | **Template** (6329) before **Independent Judgement Template** (10496) | Generic "Template" heading appears early (possible empty/generic block) |

**Role transformation:** GAM **independent memo template** → raw **meta scaffold** → merged full + alias → render generic label first.

---

### 4. Transfer (`M19` — transfer_prompt)

| Stage | Representation | Body / function |
|-------|----------------|-----------------|
| **GAM** | `transfer_prompt` / `transfer` | 752 chars — structured transfer task, 80-word band |
| **Page raw** | `transfer_prompt` | 234 chars — shortened prompt |
| **Page merged** | `transfer_prompt` 234 + `transfer_prompt_evaluate` 752 | Full on merge contract key |
| **Render** | **Transfer Prompt** (13301) before **Transfer Prompt Evaluate** (21140) | Compressed compose version first |

---

### 5. Consolidation (`M20` — consolidation_summary)

| Stage | Representation | Body / function |
|-------|----------------|-----------------|
| **GAM** | `consolidation_summary` / `session closure` | 738 chars — teacher-voice session synthesis |
| **Page raw** | `consolidation_summary` | 230 chars — **"Write at least 80 words synthesizing…"** (learner task) |
| **Page merged** | `consolidation_summary` 738 | Merge replaces with GAM teacher prose |
| **Render** | **Consolidation Summary** (13748) — single block post-merge | Raw inversion corrected in JSON; learner task wording lost |

**Role transformation:** GAM **teacher consolidation** → raw **learner synthesis task** (**role inversion**) → merged restored → render shows teacher prose (if merge applied).

---

### A4 render sequence (material h4 positions)

```text
682   What to do
3199  Scenarios              ← structural
4513  Checklist              ← structural (early)
6329  Template               ← weak/generic
8151  Criteria Text          ← compressed raw (71%)
8995  Modelling Note         ← compressed stub (25%)  ★ worked judgement weakened
9495  Decision Table         ← shell (68%)             ★ guided judgement weakened
10496 Independent Judgement Template ← full? (merged)
12315 Verification Checklist
13301 Transfer Prompt        ← compressed (31%)        ★ transfer weakened
13748 Consolidation Summary  ← full post-merge
15847 Concept Exposition     ← full merge (criteria)
16908 Worked Judgement Weak Strong ← full (100%)         ★ should precede Modelling Note
18261 Guided Judgement Table ← full (100%)
19784 Checklist Evaluate
21140 Transfer Prompt Evaluate ← full (100%)
22182 Worked Example         ← alias duplicate
```

**Pattern:** Compose structural roles (scenario, checklist, template) and **weakened teaching roles** render in first ~13k chars; **merge-restored teaching roles** render in chars 15k–22k.

---

## Canonical authority analysis

Where does **role authority** currently reside?

| Layer | Mechanism | Authority scope | Limitation |
|-------|-----------|-----------------|------------|
| **GAM `type`** | GAM-PRES material typing | Upstream generation intent | Ambiguous (`worked_example`, `text`, `scenario`) |
| **GAM `purpose`** | Sub-type disambiguation | Distinguishes analytic pass vs thinking vs judgement | **Not carried** to page JSON |
| **Page key (raw compose)** | LLM Design Page output | What compose *claims* the role is | May compress/invert (A4) |
| **Merge contract** | `pageFieldKeyForMaterial(type, purpose)` in `page-gam-materials-preserve.js` | Canonical key for body overlay | Additive — does not delete compose keys |
| **Merge aliases** | `applyRendererCanonicalAliases`, `PAGE_MATERIAL_KEY_ALIASES` | Cross-key body resolution for validators | Many-to-many; first alias wins in `pageMaterialText` |
| **Render heading** | `prettyMaterialHeading(key)` + `utilityLabelFromKey(key)` | Learner-facing label | Derived from **page key string**, not GAM purpose |
| **Activity row** | `scaffold_hint_sequence`, `reasoning_orientation`, `learner_task` | Scaffolding and task framing | Outside materials object; not in GAM list |
| **38I episode model** | Target-state reference | Expected A4 role sequence | Not enforced on page JSON |

### Authority chain (observed)

```text
GAM type + purpose  ──► merge contract key     (body authority post-merge)
                     ╳ page raw key            (compose authority — overwrites nothing)
                     ╳ render key iteration    (display authority — compose keys first)

Page key string     ──► render heading         (no GAM purpose lookup)
                     ╳ instructional role       (no explicit role field)
```

**Conclusion:** Role authority is **split** with no single owner. **Body authority** post-merge rests with merge contract + GAM source. **Display authority** rests with compose page keys and renderer key order. **Pedagogical role identity** is implicit and lossy at every transition.

### Merge contract reference (`pageFieldKeyForMaterial`)

| GAM type | GAM purpose pattern | Merge contract key |
|----------|---------------------|-------------------|
| text | concept/elucidation | `concept_exposition` |
| text | criteria | `criteria_exposition_evaluate` |
| worked_example | analytic pass | `worked_analytic_pass` |
| worked_example | judgement | `worked_judgement_weak_strong` |
| worked_example | *(default)* | `worked_example` |
| modelling_note | worked judgement | `worked_judgement_weak_strong` |
| sample_output | * | `sample_output` |
| decision_table | * | `guided_judgement_table` |
| template | independent | `independent_judgement_template` |
| transfer_prompt | * | `transfer_prompt_evaluate` |
| scenario | strategy/menu | `scenario_maya_strategy_menu` |
| scenario | *(default)* | `scenario_maya_households` |
| checklist | verification/evaluate | `checklist_evaluate` |
| consolidation_summary | * | `consolidation_summary` |

Compose LLM uses **different** key vocabulary (`criteria_text`, `modelling_note`, `decision_table`, `independent_judgement_template`) — overlap is partial, not isomorphic.

---

## Hypotheses for 38O-3

Evidence-backed failure-mode hypotheses for classification phase:

### H1 — Many-to-many mapping without role registry

**Evidence:** A4 merged page carries 19 substantive material keys for 8 GAM materials; checklist alone maps to 4 keys.  
**Prediction:** Failure mode **DUPLICATE** and **RENAMED** dominate; no machine-readable role field to collapse aliases.

### H2 — Missing role authority field on page model

**Evidence:** Page JSON stores `{ materials: { key: body } }` with no `role`, `gam_type`, or `purpose` metadata on entries.  
**Prediction:** Failure modes **FILTERED** (compose omits role) vs **COMPRESSED** (compose weakens role) indistinguishable without GAM crosswalk.

### H3 — Additive merge behaviour

**Evidence:** 38M merge overlays GAM bodies on contract keys via `shouldPreferGamContent` / `mergeMaterialsFromGamList` but never removes compose stubs (`modelling_note` 273 coexists with `worked_judgement_weak_strong` 1082).  
**Prediction:** Failure mode **DUPLICATE** is systematic on A4; body fidelity passes while role fidelity fails.

### H4 — Render precedence follows compose key order

**Evidence:** A4 render positions — all compose keys (chars 3k–14k) precede merge-canonical keys (15k–22k); `Object.keys(materials)` iteration in renderer.  
**Prediction:** Failure mode **RENDER-DEPRIORITISED** whenever merge adds canonical keys without suppressing compose keys.

### H5 — Alias proliferation from merge + compose + renderer

**Evidence:** `applyRendererCanonicalAliases` copies merge keys to legacy aliases (`worked_example`, `template`, `decision_table`, `transfer_prompt`); compose already emitted overlapping keys.  
**Prediction:** Failure mode **MERGED_INTO_WEAKER_ROLE** — alias `worked_example` on A4 carries full judgement body but heading says "Worked Example" not "Worked Judgement".

### H6 — Compose favours worksheet-native roles on Evaluate

**Evidence:** A4 raw retains scenario, criteria stub, modelling note stub, empty decision table, bullet template, checklist, short transfer, learner-write consolidation — structural workbook pattern.  
**Prediction:** Failure modes **COMPRESS** and **ROLE_INVERT** originate at **L4 LLM compose**, not GAM or DLA.

### H7 — Scaffold hints compensate partially

**Evidence:** A4 `scaffold_hint_sequence` (384 chars) references modelling note, guided table, template, transfer — survives raw and merged.  
**Prediction:** Failure mode **NEVER_REPRESENTED** avoided for *task flow* but not for *material bodies* — learner told to use materials that are stubs in raw path.

### H8 — Manual inflation path may skip merge

**Evidence:** 38N-5 follow-on; raw A4 materials match manual "templates + checklists only" observation.  
**Prediction:** Failure mode **ABSENT** for teaching roles when compose-only path inspected; **DUPLICATE** when merge path inspected.

---

## Scope and hold confirmation

| Hold | Status |
|------|--------|
| Do not reopen 38M | ✓ Body preservation treated as closed |
| Do not reopen 38N | ✓ Marker/render/schema hardening not revisited |
| No implementation | ✓ Analysis and taxonomy only |
| No prompt / renderer / validator changes | ✓ References existing code for authority analysis only |
| No fix proposals | ✓ Hypotheses for 38O-3 only |
| Role survival focus | ✓ Not general instructional quality |

---

## References

| Document / artefact | Path |
|---------------------|------|
| 38O-1 baseline trace | [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md) |
| Merge contract | `lib/page-gam-materials-preserve.js` — `pageFieldKeyForMaterial`, `PAGE_MATERIAL_KEY_ALIASES` |
| Render headings | `app.js` — `prettyMaterialHeading`, `renderMaterialsForActivity` |
| GAM | [EV-38M-AFTER-gam.json](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-gam.json) |
| Page raw | [EV-38M-AFTER-design-page-raw.txt](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-design-page-raw.txt) |
| Page merged | [EV-38M-AFTER-design-page.json](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-design-page.json) |
| Render | [EV-38N-AFTER-render.html](../../2026-06-05-sprint-38n-page-fidelity-hardening/artefacts/EV-38N-AFTER-render.html) |
| 38I A4 target roles | [38I-4-a4-evaluate-learner-episode.md](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

**Next phase:** [38O-3 — Failure-mode classification](38O-3-failure-mode-classification.md) (not started)
