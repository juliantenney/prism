# 38M-2 — Page composition preservation model

**Date:** 2026-06-05  
**Sprint:** 38-M Page Composition Fidelity  
**Phase:** 38M-2 (design/specification only — no implementation)  
**Evidence base:** [38M-1-baseline-page-fidelity-analysis.md](38M-1-baseline-page-fidelity-analysis.md)  
**Builds on:** `lib/page-gam-materials-preserve.js` · `lib/design-page-materials-fidelity.js` · `lib/ld-materials-copy.js`

---

## §1 Executive summary

**Problem (38M-1 confirmed):** On `EV-38L-AFTER`, L4 Design Page LLM compose retains all material **keys** but replaces A4 capstone **bodies** with catalogue synopses, compressed rubrics, and generic table shells. GAM bodies are instructionally sufficient; page JSON is not. Render faithfully exposes page JSON — no secondary loss stage.

**Model purpose:** Define a **programmatic preservation boundary** at L4 compose that makes upstream GAM `activity_materials` the authoritative source for instructional bodies, with deterministic merge rules, synopsis detection, per-material fidelity contracts, and hard proof gates for `EV-38M-AFTER`.

**Core principle — GAM authority:**

```text
Prompt contracts (LD-MATERIALS-COPY) declare verbatim copy.
They are not enforced by the LLM alone on EV-38L-AFTER.
GAM authority is enforced programmatically after compose.
```

**Scope of this model:**

| In scope (38M-2 spec) | Out of scope (later phases) |
|------------------------|----------------------------|
| GAM → page body merge policy | Renderer CSS / styling |
| Synopsis / shell / meta detection | DLA / GAM pack rewrites |
| Material-level fidelity contracts | A3 render sequencing (38M-4) |
| `validate38MPageFidelity` contract | M16 upstream GAM depth fix (38M-3 cross-check) |
| `EV-38M-AFTER` proof gates | Schema / ACM / workflow changes |

**Relationship to 38-L post-work:** `page-gam-materials-preserve.js` implements a subset of this model (length-ratio merge + `validate38LPageGamPreservation`). 38M-2 **formalises, extends, and gates** that layer. Implementation occurs in 38M-3/38M-5 per charter — not in 38M-2.

---

## §2 Architecture — preservation boundary

### Pipeline position

```text
KM → LO → Episode Archetype → IFP → ACM → DLA → GAM → [LLM Design Page compose] → [GAM preserve merge] → Render
                                                              ↑                        ↑
                                                         loss observed            enforcement point
                                                         on EV-38L-AFTER          (this model)
```

### Compose hook (specified, not implemented here)

Merge runs **once**, at the end of `applyPedagogicCognitionSemanticsToComposedPage`, on both cognition-active and cognition-inactive paths:

1. LLM produces composed page JSON (may thin materials).
2. `applyGamMaterialsToComposedPage(page, upstreamGam)` overlays GAM bodies per merge policy (§3).
3. `validate38MPageFidelity(page, { gamSource })` runs — harness **throws** on hard-gate failure.
4. Page metadata records `gam_materials_preserve_applied: true` and `gam_materials_preserve_rows`.

**Upstream resolution:** `options.upstreamActivityMaterials` from harness GAM JSON capture; UI compose path auto-resolves from workflow `activity_materials` when omitted.

**Invariant:** LLM compose may adjust `learner_task`, `expected_output`, `cognition`, and section framing. It may **not** be the final authority for `activity.materials` bodies when upstream GAM provides richer content.

---

## §3 GAM authority rules

### Rule A1 — Body authority

When upstream GAM contains a material body for an activity, the composed page `materials` field for that material must carry **GAM body content** unless the page body already meets the material's fidelity contract (§6).

GAM wins on conflict. Page compose output is a **draft**; preserve merge is the **canonical learner-materials source**.

### Rule A2 — Key survival

All GAM material keys must appear on the composed page (directly or via canonical alias — §5). Key omission is a **hard failure** regardless of body quality.

*38M-1 evidence:* All A4 keys survived on `EV-38L-AFTER`; loss was body-only. Rule retained as regression guard.

### Rule A3 — Merge trigger conditions

GAM body replaces page body when **any** of the following is true:

| ID | Condition | Rationale (38M-1) |
|----|-----------|-------------------|
| **T1** | Page field missing, null, or empty string | Key present but body absent |
| **T2** | Page body matches `stringLooksPlaceholderOnly` (< 48 chars or catalogue label regex) | Existing fidelity lib guard |
| **T3** | Page len < GAM len × **0.90** on Tier-A or Tier-B materials | M12–M15, M18 compressed 24–41% |
| **T4** | Page len < GAM len × **0.85** on Tier-C materials | M13 moderate compression at 60% |
| **T5** | Synopsis detector positive (§4) | M12/M14 catalogue/meta replace |
| **T6** | Table shell detector positive (§4) | M15 "Partial example" collapse |
| **T7** | Meta-replacement detector positive (§4) | M16 bullet scaffold replaces memo header |

**Existing 38-L rule:** `shouldPreferGamContent` uses T2 + `gamLen > pageLen × 1.1` (equivalent to ~91% threshold). 38M-2 **tightens** capstone materials to explicit 90% and adds marker-based triggers (T5–T7) independent of length ratio.

### Rule A4 — When page wins

Page body is retained only when:

- Page len ≥ GAM len × tier threshold (§6), **and**
- All required substantive markers for that material are present (§6), **and**
- No synopsis / shell / meta detector is positive (§4).

Minor whitespace normalisation (A1 M2 99%, A2 M5 98%) is acceptable — page may win if markers pass and ratio ≥ 99%.

### Rule A5 — Non-destructive framing

Preserve merge must **not** modify:

- `sections[].heading` / pre-activity context
- `learner_task`, `expected_output`, `duration_minutes`
- `cognition.*` fields
- `visual_affordances`, `activities_visual_review`
- Activity order or membership

Only `learning_activities.content[].materials` (and canonical aliases within) are overlay targets.

### Rule A6 — Alias propagation

After merge, set renderer-friendly canonical aliases per existing `applyRendererCanonicalAliases` mapping (§5). Aliases must reference the same GAM-sourced body — no duplicate thinning.

---

## §4 Synopsis detection rules

Synopsis replacement is the primary A4 failure mode on `EV-38L-AFTER`. Detection runs **per material field** before merge decision and in validator post-merge.

### 4.1 Catalogue synopsis patterns (Tier-A scenario, Tier-A worked judgement)

**Positive when** body matches any catalogue phrase **and** lacks required markers:

| Pattern ID | Regex / phrase (case-insensitive) | 38M-1 instance |
|------------|-----------------------------------|----------------|
| **CAT-1** | `/are provided to evaluate/` | M12 page body |
| **CAT-2** | `/\bprovided to evaluate\b/` | M12 variant |
| **CAT-3** | `/\b(?:five\|neutral).{0,40}strateg(?:y\|ies).{0,40}(?:are\|is) provided/` | M12 catalogue pointer |
| **CAT-4** | `/This note shows stepwise reasoning/` | M14 page body |
| **CAT-5** | `/illustrating how to justify strategy choices/` | M14 meta descriptor |
| **CAT-6** | `/contrasting weak.{0,20}strong evaluations?, illustrating/` | M14 synopsis without exemplars |

**Required markers that negate catalogue verdict** (if present, not a synopsis):

| Material | Required markers |
|----------|----------------|
| M12 scenario | `Strategy A:` AND (`Strategy B:` OR `Strategy C:`) AND `Strategy E:` |
| M14 worked judgement | `Weak Evaluation Example` AND `Strong Evaluation Example` |

### 4.2 Table shell collapse (Tier-A guided judgement)

**Positive when** all of:

| Check | Condition |
|-------|-----------|
| **SH-1** | Field key matches `guided_judgement_table` or `decision_table` |
| **SH-2** | Body contains pipe-table syntax (`\|...\|`) |
| **SH-3** | Body contains `Partial example` (or `partial example`) in table cells |
| **SH-4** | Body does **not** contain `Budget Tightening` with adjacent judgement text (≥ 20 chars in same row region) |

*38M-1 evidence:* M15 page retained table structure but replaced exemplar judgements with generic placeholder cells.

**Negation:** Presence of `A: Budget Tightening` or `Moderate: Focuses on spending cuts` in table body clears shell verdict.

### 4.3 Meta replacement (Tier-C independent template)

**Positive when** all of:

| Check | Condition |
|-------|-----------|
| **MR-1** | Field key matches `independent_judgement_template` or `template` |
| **MR-2** | Body contains `Use this scaffold to write` OR bullet list of section names (`Strategy choice`, `Justification`, `trade-offs`) |
| **MR-3** | Body does **not** contain writable memo header pattern: `**To:**` OR `**Subject:**` with bracket placeholders |

*38M-1 evidence:* M16 page replaced 218-char GAM memo header with 255-char meta bullet list. Length ratio misleading (117%).

**Special case M16:** When GAM itself is thin (< 300 chars) and lacks section bodies, meta-replacement still triggers GAM preference (GAM header beats meta bullets) but **G11 soft gate** may warn — upstream GAM depth may be insufficient for 38I-4 parity.

### 4.4 Severe compression (Tier-B transfer, consolidation)

**Positive when:**

| Check | Condition |
|-------|-----------|
| **SC-1** | Page len < GAM len × 0.50 |
| **SC-2** | Material type is `transfer_prompt` or `consolidation_summary` |
| **SC-3** | GAM body contains ≥ 2 bullet/question lines (`\n- ` or `\n\d+\.`) not present in page body |

*38M-1 evidence:* M18 lost four guiding questions; M19 lost session reflection bullet list.

### 4.5 Detector composition

```text
isSynopsisOrShell(pageBody, gamBody, materialSpec) :=
    catalogueSynopsis(pageBody, materialSpec) OR
    tableShellCollapse(pageBody, materialSpec) OR
    metaReplacement(pageBody, materialSpec) OR
    severeCompression(pageBody, gamBody, materialSpec)
```

If positive → **T5/T6/T7** merge trigger fires → GAM body wins regardless of whether length ratio alone would trigger merge.

---

## §5 Field-key mapping contract

Maps GAM `activity_materials[]` entries to page `materials` object keys. Extends existing `pageFieldKeyForMaterial` — specified here for completeness.

### 5.1 Primary mapping table

| GAM `type` | GAM `purpose` match | Page key | Activity (EV-38L) |
|------------|---------------------|----------|-------------------|
| `text` | concept / elucidation | `concept_exposition` | A1 |
| `worked_example` | worked thinking | `worked_example` | A1, A2 |
| `sample_output` | model learner explanation | `sample_output` | A1 |
| `checklist` | verification (non-evaluate) | `checklist` | A1–A3 |
| `classification_table` | practice table | `classification_table` | A2 |
| `worked_example` | worked analytic pass | `worked_analytic_pass` | A3 |
| `scenario` | practice scenario / households | `scenario_maya_households` | A3 |
| `analysis_table` | learner completes analysis | `analysis_table` | A3 |
| `scenario` | strategy / menu | `scenario_maya_strategy_menu` | A4 |
| `text` | criteria exposition | `criteria_exposition_evaluate` | A4 |
| `modelling_note` | worked judgement | `worked_judgement_weak_strong` | A4 |
| `decision_table` | guided judgement | `guided_judgement_table` | A4 |
| `template` | independent judgement | `independent_judgement_template` | A4 |
| `checklist` | verification rubric / evaluate | `checklist_evaluate` | A4 |
| `transfer_prompt` | transfer to learner context | `transfer_prompt_evaluate` | A4 |
| `consolidation_summary` | session closure | `consolidation_summary` | A4 |

**Fallback:** `slugFromMaterialId(material_id)` when type/purpose unmatched.

### 5.2 Canonical renderer aliases (post-merge)

| Primary key | Aliases set (if absent) |
|-------------|-------------------------|
| `checklist_evaluate` | `checklist`, `evaluation_checklist` |
| `transfer_prompt_evaluate` | `transfer_prompt` |
| `worked_analytic_pass` | `worked_example` |
| `worked_judgement_weak_strong` | `worked_example` |
| `scenario_maya_strategy_menu` | `scenario` |
| `scenario_maya_households` | `scenarios` (array wrap) |
| `independent_judgement_template` | `template` |
| `guided_judgement_table` | `decision_table` |
| `classification_table` | `worksheet` |

### 5.3 Activity matching

Match page activity row → GAM activity by normalised key equality on `activity_id`, `activityId`, or `title`. Fallback: index position in `learning_activities.content[]`.

---

## §6 Material-level fidelity contracts

Per-material obligations derived from 38M-1 fidelity matrix and compression examples. Each contract defines: **tier**, **minimum char ratio**, **required markers**, **forbidden patterns**, and **merge mandatory**.

### Tier definitions

| Tier | Policy | 38M-1 materials |
|------|--------|-----------------|
| **A — Capstone** | GAM authority strict; 90% ratio; marker gates blocking | M12, M14, M15 |
| **B — High** | GAM authority; 80% ratio; marker gates blocking | M18 |
| **B2 — Closure** | GAM authority; 70% ratio; soft gate | M19 |
| **C — Supporting** | GAM authority on thin; 85% ratio | M13, M16 |
| **D — Regression** | Preserve if thinned below 99%; blocking on A3 only | M8–M11, A1–A2 |
| **E — Stable** | Merge only on T1/T2; no extra gates | M17, M4, M7, M11 |

### Contract table

| ID | Material | Page key | Tier | Min ratio | Required markers | Forbidden patterns | Merge mandatory |
|----|----------|----------|------|-----------|------------------|--------------------|-----------------|
| **FC-M12** | M12 scenario | `scenario_maya_strategy_menu` | A | 90% | `Strategy A:`, `Strategy E:` | CAT-1..CAT-3 | Yes |
| **FC-M14** | M14 worked judgement | `worked_judgement_weak_strong` | A | 90% | `Weak Evaluation Example`, `Strong Evaluation Example` | CAT-4..CAT-6 | Yes |
| **FC-M15** | M15 guided table | `guided_judgement_table` | A | 90% | `Budget Tightening` + table exemplar row | SH-1..SH-4 | Yes |
| **FC-M18** | M18 transfer | `transfer_prompt_evaluate` | B | 80% | `at least 80 words` | SC-1..SC-3 | Yes |
| **FC-M19** | M19 consolidation | `consolidation_summary` | B2 | 70% | `Reflect on the key` OR ≥ 3 session topic bullets | SC-1..SC-3 | Yes |
| **FC-M13** | M13 criteria | `criteria_exposition_evaluate` | C | 85% | `Depth`, `Adaptability`, `Transferability` as criteria headings | — | Yes if below ratio |
| **FC-M16** | M16 independent template | `independent_judgement_template` | C | max(GAM, 218) | Writable `**To:**` OR `**Subject:**` header | MR-1..MR-3 | Yes on meta replace |
| **FC-M8** | M8 worked pass | `worked_analytic_pass` | D | 99% | `Distribution Lens` or `Stepwise Analysis` | — | Yes if below ratio |
| **FC-M9** | M9 scenario | `scenario_maya_households` | D | 99% | `Fixed-Income Household` | — | Yes if below ratio |
| **FC-M10** | M10 analysis table | `analysis_table` | D | 99% | Pipe table + `Learner Entry` | — | Yes if below ratio |
| **FC-M11** | M11 checklist | `checklist` | E | — | `Verification Checklist` | — | T1/T2 only |
| **FC-M17** | M17 checklist | `checklist_evaluate` | E | — | `Evaluation Quality` | — | T1/T2 only |

A1–A2 materials follow Tier D defaults (99% regression guard). No additional markers beyond substantive length.

### Substantive body definition

A page material body is **substantive** iff:

1. `pageLen / gamLen ≥ tier minimum ratio` (or GAM len unavailable: `pageLen ≥ 200` for Tier A text), **and**
2. All required markers present, **and**
3. `isSynopsisOrShell(pageBody, gamBody, spec) === false`.

---

## §7 Preservation validators

### 7.1 Validator contract

```text
validate38MPageFidelity(page, options) → {
  ok: boolean,
  errors: string[],      // hard gate failures (blocking)
  warnings: string[],    // soft gate failures (G9–G12)
  metrics: MaterialMetric[]
}

options: {
  gamSource: GamJson,           // required for ratio/marker checks
  activityFilter?: string[],    // optional: ['A3','A4']
  strict?: boolean              // default true: warnings promoted to errors
}
```

```text
MaterialMetric: {
  activity_id: string,
  material_id: string,
  page_key: string,
  tier: 'A'|'B'|'B2'|'C'|'D'|'E',
  gamLen: number,
  pageLen: number,
  ratio: number,                // pageLen/gamLen × 100
  markersFound: string[],
  markersMissing: string[],
  lossType: 'none'|'minor_whitespace'|'moderate_compression'|'severe_compression'|
            'synopsis_replacement'|'table_shell_collapse'|'meta_replacement',
  mergeApplied: boolean,
  substantive: boolean
}
```

### 7.2 Relationship to `validate38LPageGamPreservation`

| Aspect | 38L validator | 38M validator |
|--------|---------------|---------------|
| Scope | Inflation workbook A1–A4 smoke checks | Per-material metrics + tier contracts |
| A4 scenario | `Strategy A:` + len > 400 | FC-M12 + ratio ≥ 90% |
| A4 worked judgement | Weak/Strong example + len > 400 | FC-M14 + ratio ≥ 90% |
| A4 guided table | Not checked | FC-M15 + shell detector |
| Transfer | Presence only | FC-M18 + ratio ≥ 80% |
| Consolidation | Not checked | FC-M19 soft gate |
| A3 regression | Worked analytic pass presence | FC-M8–M10 ratio ≥ 99% |
| Output | `{ ok, errors }` | `{ ok, errors, warnings, metrics }` |

**Migration:** `validate38MPageFidelity` **supersedes** `validate38LPageGamPreservation` for `EV-38M-AFTER`. 38L validator remains as regression subset until 38M-5 proof passes.

### 7.3 Pre-merge vs post-merge validation

| Stage | Function | Purpose |
|-------|----------|---------|
| **Pre-merge** (diagnostic) | `measurePageGamFidelity(page, gamSource)` | Populate metrics without merge; detect thinning |
| **Post-merge** (blocking) | `validate38MPageFidelity(mergedPage, { gamSource })` | Hard gates before artefact capture |

Harness must run **post-merge only** for pass/fail. Pre-merge metrics captured in run log for forensics.

### 7.4 Error message contract

Errors use format: `{activity}:{material_id}:{gate_id}:{detail}`

Example: `A4:M14_Worked_Judgement_Weak_Strong:G4:missing marker 'Weak Evaluation Example'`

---

## §8 EV-38M-AFTER proof gates

Formalised from [38M-1 §7](38M-1-baseline-page-fidelity-analysis.md). Applied to **post-merge** `EV-38M-AFTER-design-page.json` and render spot-check.

### 8.1 Hard gates (blocking — harness throws)

| Gate | Name | Check | Threshold | Contract |
|------|------|-------|-----------|----------|
| **G1** | A4 worked judgement parity | `pageLen / gamLen` | ≥ **90%** | FC-M14 |
| **G2** | A4 guided table parity | `pageLen / gamLen` | ≥ **90%** | FC-M15 |
| **G3** | A4 scenario markers | `Strategy A:` AND `Strategy E:` in page body | present | FC-M12 |
| **G4** | Anti-synopsis capstone | `Weak Evaluation Example` AND `Strong Evaluation Example` | present | FC-M14 |
| **G5** | Anti-table-shell | `Budget Tightening` in guided table; no shell-only `Partial example` | per §4.2 | FC-M15 |
| **G6** | Transfer body survival | ratio ≥ **80%**; `at least 80 words` | present | FC-M18 |
| **G7** | A3 regression guard | M8–M11 each ratio ≥ **99%** | per material | FC-M8–M10 |
| **G8** | Checklist A1–A4 | checklist key present; len ≥ **80** | per activity | FC-M11, M17 |
| **G9** | Preserve metadata | `metadata.gam_materials_preserve_applied === true` | required | §2 |
| **G10** | No synopsis on Tier-A | `isSynopsisOrShell` false for M12, M14, M15 | required | §4 |

### 8.2 Soft gates (warning — recorded in run log)

| Gate | Name | Check | Threshold | Notes |
|------|------|-------|-----------|-------|
| **G11** | Criteria exposition | M13 ratio | ≥ **85%** | FC-M13 |
| **G12** | Consolidation summary | M19 ratio | ≥ **70%** | FC-M19 |
| **G13** | Independent template depth | M16 writable header OR len ≥ 300 | conditional | May need upstream GAM fix |
| **G14** | Render reflects page | G3–G5 markers in `buildUtilityStructuredHtmlForTest` HTML | spot-check | Confirms no render loss |

### 8.3 A3 sequencing gates (38M-4 — record only at proof time)

| Gate | Name | Target |
|------|------|--------|
| **G15** | A3 render order | worked pass → scenario → table → checklist |
| **G16** | A3 page key order | Align with `scaffold_hint_sequence` where schema permits |

Not blocking for 38M-5 unless 38M-4 complete. 38M-1 established A3 body fidelity is already 100%.

### 8.4 Proof artefact requirements

| Artefact | Requirement |
|----------|-------------|
| `EV-38M-AFTER-gam.json` | Upstream GAM comparator (19 materials) |
| `EV-38M-AFTER-design-page.json` | Post-merge page; `gam_materials_preserve_applied: true` |
| `EV-38M-AFTER-run-log.json` | `validate38MPageFidelity` metrics array |
| Render capture | HTML snippet proving G3–G5 markers present |

### 8.5 Expected pass profile vs frozen baseline

| Material | EV-38L-AFTER ratio | EV-38M-AFTER target |
|----------|-------------------|---------------------|
| M12 | 27% | ≥ 90% |
| M14 | 24% | ≥ 90% |
| M15 | 40% | ≥ 90% |
| M18 | 41% | ≥ 80% |
| M19 | 34% | ≥ 70% (soft) |
| M8–M11 | 100% | ≥ 99% (unchanged) |

---

## §9 Merge algorithm specification

Pseudocode for 38M-3 implementation. **Not executed in 38M-2.**

```text
function apply38MPagePreservation(page, gamSource):
  rows = findLearningActivitiesRows(page)
  gamActivities = normalize(gamSource.activities)
  metrics = []

  for each (row, index) in rows:
    gamAct = matchGamActivity(gamActivities, row, index)
    if not gamAct: continue

    gamMaterials = buildMaterialsObjectFromGamList(gamAct.materials)
    pageMaterials = row.materials or {}

    for each (pageKey, gamBody) in gamMaterials:
      pageBody = pageMaterials[pageKey]
      spec = resolveFidelityContract(pageKey, gamAct, gamBody)
      shouldMerge = (
        shouldPreferGamContent(pageBody, gamBody) OR          // T1, T2, legacy ratio
        pageBody.len < gamBody.len * spec.minRatio OR         // T3, T4
        isSynopsisOrShell(pageBody, gamBody, spec)            // T5, T6, T7
      )
      if shouldMerge:
        pageMaterials[pageKey] = gamBody
        recordMerge(metrics, spec, merged=true)

    row.materials = applyRendererCanonicalAliases(pageMaterials)

  page.metadata.gam_materials_preserve_applied = true
  page.metadata.gam_materials_preserve_schema = '38M-2'
  return page
```

**Ordering:** Merge runs field-by-field; no cross-field synthesis. GAM bodies are copied verbatim — no re-authoring, truncation, or summarisation at merge time.

---

## §10 LD-MATERIALS-COPY alignment

Prompt contracts alone failed on `EV-38L-AFTER` (page cited `LD-MATERIALS-COPY` in `constraints_applied` yet thinned A4). The preservation model **does not replace** LD-MATERIALS-COPY; it provides **programmatic enforcement** of the same obligations.

| LD-MATERIALS-COPY rule | Programmatic enforcement |
|------------------------|--------------------------|
| "not catalogue descriptions of what could be provided" | CAT-1..CAT-6 detectors (§4.1) |
| "Do not summarise, thin, or replace materials bodies" | T3/T4 ratio triggers (§3) |
| "Copy concrete delivery content verbatim or near-verbatim" | GAM authority Rule A1 |
| "Forbidden placeholder-only phrasing" | T2 + `stringLooksPlaceholderOnly` |
| Table pipe syntax preserved | SH shell detector + FC-M15 |

**Optional 38M-3 pack note:** If LLM compose continues to thin despite contracts, consider appending `LD-MATERIALS-COPY role: preserve_merge` block explicitly stating programmatic merge will overwrite thin bodies. Pack change is **optional** and deferred to 38M-3 only if implementation testing shows prompt gap persists.

---

## §11 Implementation handoff

### 38M-3 — A4 Evaluate fidelity implementation

| Task | Spec reference |
|------|----------------|
| Extend `page-gam-materials-preserve.js` with §4 detectors | §4, §9 |
| Implement `validate38MPageFidelity` | §7 |
| Apply tier contracts FC-M12..M19 | §6 |
| Hard gates G1–G10 in tests | §8.1 |
| Replay `EV-38L-AFTER-design-page.json` → pass after merge | §8.5 |

### 38M-4 — A3 sequencing (parallel after 38M-2)

Body preservation not required (100% on baseline). Gates G15–G16 only.

### 38M-5 — Proof harness

| Task | Spec reference |
|------|----------------|
| Fork `ev-38l-inflation-pipeline-capture-once.mjs` → `ev-38m-*` | §8.4 |
| Post-page `validate38MPageFidelity` throw | §7.3 |
| Capture metrics in run log | §7.1 |
| Prefix artefacts `EV-38M-AFTER-*` | §8.4 |

### Files expected to change (38M-3/38M-5 only — not 38M-2)

| File | Change |
|------|--------|
| `lib/page-gam-materials-preserve.js` | Detectors, `validate38MPageFidelity`, tier contracts |
| `app.js` | Compose hook (existing; verify options path) |
| `tests/page-38m-gam-preservation.test.js` | New — gate coverage |
| `artefacts/ev-38m-inflation-pipeline-capture-once.mjs` | New — proof harness |

---

## §12 Out of scope and holds

| Item | Disposition | Source |
|------|-------------|--------|
| Renderer CSS / styling redesign | Hold | Charter |
| DLA / GAM pack §5/§6 rewrite | Hold unless G13 fails | 38M-1 M16 gap |
| Schema / ACM / workflow changes | Hold | 38L-6 |
| A3 body preservation | Not needed — 100% baseline | 38M-1 §3 |
| A3 render sequencing | 38M-4 | 38M-1 §3 |
| Word-count gaming without marker checks | Forbidden — gates require markers | Charter F1 |
| Workbook.md as QA source | Diagnostic only; gates use design-page + render | 38M-1 §4 |

---

## §13 Success condition check (38M-2)

| Criterion | Status |
|-----------|--------|
| GAM authority rules specified | ✓ §3 |
| Synopsis detection rules specified | ✓ §4 |
| Preservation validators contract defined | ✓ §7 |
| Material-level fidelity contracts defined | ✓ §6 |
| EV-38M-AFTER proof gates defined | ✓ §8 |
| Evidence traceable to 38M-1 only | ✓ |
| No production code / test / pack / harness changes | ✓ |

**38M-2 complete.** Next phase: **38M-3** A4 Evaluate fidelity implementation (and **38M-4** A3 sequencing in parallel per charter).

---

## References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)
- [HANDOVER.md](../HANDOVER.md)
- [38M-1 baseline page fidelity analysis](38M-1-baseline-page-fidelity-analysis.md)
- [38L page preservation fix](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md)
- [38I-4 A4 evaluate learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)
- `lib/page-gam-materials-preserve.js` · `lib/design-page-materials-fidelity.js` · `lib/ld-materials-copy.js`
