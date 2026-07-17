# Sprint 65 Cross-Sample Validation

## Task

**S65-BL-008 — Cross-Sample Validation**

Determine whether the BL-007 bounded prototype generalises across the available corpus **without changing the prototype**.

```text
Prototype complete — not production-ready
Prototype evaluated unchanged
```

## Scope and Constraints

**In scope:** Current vs `s65-prototype` comparison; corpus classification; scoring; residual/unknown/sparse/rich/archetype/page-IA/a11y/mobile/print review; remediation register; acceptance outcome.

**Out of scope:** Expanding or redesigning the prototype; BL-009 hardening; schema/GAM; fixture-specific exceptions; silent fixes.

```text
Known architecture ceiling — not a Sprint 65 renderer defect.
```

## Validation Questions

| Q | Question | Answer (summary) |
| - | -------- | ---------------- |
| Q1 | Improves LX across most samples? | **Partially** — strong where episode-plan beats exist; **neutral** elsewhere |
| Q2 | Consistent gains? | Task/Produce split, role labels, mode cues, residual-before-Check — **on beat-plan pages** |
| Q3 | Rich-data dependent? | Mode cues, Why/Approach, journey dedupe need optional fields |
| Q4 | Sparse disappearance? | Sparse **shape** pages unchanged (no regression); sparse **KS-A4** still on current shell |
| Q5 | Unstable behaviours? | Path coverage gated on `episode_plan.beats` (not unstable ordering) |
| Q6 | Current preferable? | No sample where prototype is worse when it activates; identical pages are preference-neutral |
| Q7 | Before BL-009? | Bounded remediation: wire contract to non-beat activity path; dual framing; deferred page chrome |

## Sample Corpus

**Size:** 12 pages (24 HTML captures) + activity deep-dives on RNA A1/A3/A4/A6, Marx beat activities, KS-A4.

Harness: [`samples/capture-validation-render.js`](samples/capture-validation-render.js)  
Outputs: [`samples/validation/`](samples/validation/)  
Markers: [`samples/validation/comparison-markers.json`](samples/validation/comparison-markers.json)

| Sample ID | Fixture | Included because |
| --------- | ------- | ---------------- |
| rna-hcv | `rna-hcv-assembled-vnext-materials-page.json` | Core rich reference; four archetypes; residuals/orphans |
| rna-assessment | `ld-rna-hcv-assessment-page.json` | Assessment companion |
| kitchen-sink | `renderer-kitchen-sink-page.json` | Unknown materials; KS-A4 sparse; diagnostics |
| marx-beat | `marx-beat-render-page.json` | Beat-first; archetypes; Marx A3-class richness |
| marx-self-study | `marx-self-study-page.json` | Additional Marx learner page (no beats) |
| inflation | `ld-inflation-workshop-page-full.json` | Rich workshop |
| climate | `ld-climate-misconception-discussion-page.json` | Discussion / prompts |
| self-directed | `self-directed-activity-framing-page.json` | Framing / no archetype |
| shape-metadata | `shape-production-metadata.json` | Sparse + metadata-heavy |
| confidence-multitable | `confidence-interval-a2-multitable-page.json` | Multi-table richness |
| sequencing-rollout | `sequencing-rollout-learner-page.json` | Sequencing / timeline |
| shape-assessment-mcq | `shape-structured-assessment-mcq.json` | Assessment-structured sparse |

BL-007 captures under `samples/prototype/` were retained and not overwritten.

## Sample Classification

| Sample | Density | Class tags |
| ------ | ------- | ---------- |
| rna-hcv | Rich | Clean mapping + Residual-heavy + Mixed archetypes |
| rna-assessment | Sparse–Medium | Assessment-heavy |
| kitchen-sink | Rich | Unknown-heavy + Cognition-heavy + Metadata-heavy + Mixed |
| marx-beat | Rich | Cognition-heavy + Clean mapping |
| marx-self-study | Rich | Cognition-heavy (no episode beats) |
| inflation | Rich | Mixed |
| climate | Medium | Mixed |
| self-directed | Medium | Cognition-heavy (framing) |
| shape-metadata | Sparse | Metadata-heavy |
| confidence-multitable | Medium–Rich | Residual-adjacent / tables |
| sequencing-rollout | Medium | Mixed |
| shape-assessment-mcq | Sparse | Assessment-heavy |

**Counts:** Rich 5 · Medium 4 · Sparse 3 · Assessment-heavy 2 · Unknown-heavy 1 · Metadata-heavy 2 · Residual-heavy 1 · Cognition-heavy 3.

## Validation Matrix

| Sample | Archetype coverage | Material coverage | Rich/Sparse | Assessment | Residuals | Unknowns | Diagnostics | Included because |
| ------ | ------------------ | ----------------- | ----------- | ---------- | --------- | -------- | ----------- | ---------------- |
| rna-hcv | understand/apply/analyse/evaluate | Full beat materials | Rich | No (companion separate) | Yes (A3/A4) | Fixture markers | Meta yes | Primary reference |
| rna-assessment | Weak/none | Sparse activities | Sparse–Med | Yes | No | No | Meta yes | Assessment-heavy |
| kitchen-sink | None in fixture | Broad + unknown keys | Rich | Yes | Unassigned keys | Yes | Meta yes | Unknown + KS-A4 |
| marx-beat | understand/analyse/evaluate | Beat materials | Rich | No | Low | No | Meta yes | Beat path |
| marx-self-study | None (no beats) | Rich materials | Rich | No | Possible | No | Partial | Non-beat Marx |
| inflation | None | Workshop tables | Rich | Possible | Low | No | Meta yes | Rich workshop |
| climate | None | Prompt sets | Medium | No | Low | No | Low | Discussion |
| self-directed | None | Framing + tables | Medium | No | Low | No | Low | No-archetype |
| shape-metadata | None | Minimal | Sparse | No | No | No | Yes | Sparse+meta |
| confidence-multitable | None | Multi-table | Med–Rich | No | Low | No | Meta | Tables |
| sequencing-rollout | None | Sequence | Medium | No | No | No | Low | Timeline |
| shape-assessment-mcq | None | Assessment shape | Sparse | Yes | No | No | Low | Assessment sparse |

## Evaluation Method

1. Render each fixture with `renderMode: "current"` and `"s65-prototype"` via validation harness (identical source JSON).  
2. Extract structural markers (contract headings, mode badges, residual attrs, journey H2, tables, meta).  
3. Deep-inspect RNA A1/A3/A4/A6 and Marx beat HTML for role/residual/transfer.  
4. Score 1–5 per dimension (evaluation framework); confidence medium (no learner research).  
5. Do **not** average alone — report median/range/worst/best and path-coverage splits.

## Current vs Prototype Results

### Structural delta summary

| Sample | Bit-identical? | Mode badges Δ | Your task Δ | Produce Δ | Success lost | Residual attrs | Journey H2 Δ | Char Δ |
| ------ | -------------- | ------------- | ----------- | --------- | ------------ | -------------- | ------------ | ------ |
| rna-hcv | No | +6 | +6 | +6 | −6 | 3 | −1 | −3750 |
| marx-beat | No | +5 | +5 | +5 | −5 | 0 | 0 | −3943 |
| All other 10 | **Yes** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**Path coverage finding:** Activity contract HTML is only **mounted** when `episode_plan.beats` is non-empty (`app.js` `hasEpisodePlanBeats` gate). Design intent (Composition C for any task-bearing activity) is wider than the implemented mount condition. Recorded as implementation defect / remediation — **not fixed in BL-008**.

### Dimension scores (pages where prototype activates)

Judgement on **rna-hcv** and **marx-beat** (activation class). Confidence medium.

| Dimension | Current | Prototype | Delta | Confidence | Notes |
| --------- | ------- | --------- | ----- | ---------- | ----- |
| Orientation | 3 | 4 | +1 | Med | Journey overview omit on RNA |
| Action clarity | 3 | 5 | +2 | High | Your task |
| Output clarity | 3 | 5 | +2 | High | Produce ≠ checklist |
| Cognitive mode | 2 | 4 | +2 | High | Badges when archetype present |
| Progression | 3 | 4 | +1 | Med | Role sequence |
| Material role | 2 | 5 | +3 | High | Learner role headings |
| Verification | 3 | 4 | +1 | High | Check region |
| Transfer | 2 | 4 | +2 | Med | Extend on A6 |
| Density | 2 | 4 | +2 | High | Less Success merge |
| Duplication | 2 | 4 | +2 | High | Produce/Check; journey |
| Accessibility | 3 | 4 | +1 | Med | Text cues |
| Resilience | 4 | 5 | +1 | High | Fallback helpers |
| Residual safety | 1 | 5 | +4 | High | A3 plan before Check |
| Unknown-type safety | 4 | 4 | 0 | Med | KS identical (current already shows unknowns) |
| Sparse-input coherence | 4 | 4 | 0 | High | Shape pages identical |
| Rich-input coherence | 3 | 4 | +1 | Med | RNA/Marx denser clarity |
| Source fidelity | 5 | 5 | 0 | High | No content loss |
| Diagnostic preservation | 5 | 5 | 0 | High | util-meta retained |
| Mobile suitability | 3 | 3 | 0 | Med | Structure OK; visual env dark |
| Print suitability | 3 | 3 | 0 | Med | DOM order; print hooks present |

### Aggregate (activation class only: rna-hcv, marx-beat)

| Statistic | Action | Material role | Residual safety | Cognitive mode |
| --------- | ------ | ------------- | --------------- | -------------- |
| Best Δ | +2 | +3 | +4 | +2 |
| Worst Δ | +2 | +3 | +4 | +2 |
| Median Δ | +2 | +3 | +4 | +2 |

### Aggregate (full corpus including identical pages)

Treating identical pages as Δ 0:

| Dimension | Median Δ | Range | Worst | Best |
| --------- | -------- | ----- | ----- | ---- |
| Action clarity | 0 | 0…+2 | 0 | +2 |
| Material role | 0 | 0…+3 | 0 | +3 |
| Residual safety | 0 | 0…+4 | 0 | +4 |
| Cognitive mode | 0 | 0…+2 | 0 | +2 |
| Source fidelity | 0 | 0 | 0 | 0 |

**Interpretation:** Gains are **real and large** on the beat-plan subclass; **corpus-wide median is zero** because 10/12 samples never mount the contract.

## Archetype Validation

| Archetype state | Sample count | Outcome | Stable? |
| --------------- | ------------ | ------- | ------- |
| understand | RNA A1; Marx ×2 | Badge + verb; contract | Yes |
| apply | RNA A3 | Badge; residual Try it | Yes |
| analyse | RNA A2/A4/A5; Marx | Badge | Yes |
| evaluate | RNA A6; Marx ×2 | Badge; Extend/transfer | Yes |
| missing | KS, inflation, shapes, self-directed… | No badge; **no contract mount** (beats absent) | Neutral |
| malformed/unsupported | BL-007 synthetic test | No badge; contract when beats present | Yes (unit-tested) |

**Overfitting risk:** Low on cue content; **coverage risk** high — cues only appear with plan beats + valid archetype.

## Material Validation

| Behaviour | Samples tested | Successes | Failures | Notes |
| --------- | -------------- | --------- | -------- | ----- |
| Role mapping / headings | rna-hcv, marx-beat | 2 | 0 | Idea/Example/Try it/Check/Extend |
| Title treatment | rna-hcv | 1 | 0 | Fixture titles still present as content titles in places |
| Residual placement | rna-hcv A3 | 1 | 0 | Planning before Check |
| Orphan handling | rna-hcv A4 | 1 | 0 | Text remains visible |
| Unknown handling | kitchen-sink | Neutral | — | Identical HTML; unknowns already visible in current |
| Tables | rna, marx, inflation, confidence | All retain scroll wrappers | 0 | No column drop observed |
| Checklist ≠ Produce | rna-hcv | 1 | 0 | Checklist under Check |
| Transfer | rna-hcv A6 | 1 | 0 | Extend / Transfer Prompt |

## Residual Validation

| Case | Current | Prototype | Result |
| ---- | ------- | --------- | ------ |
| RNA A3 planning table | After Check (`plan before check? false`) | Before Check (`data-s65-residual`, Try it) | **Pass** |
| RNA A4 unmatched text | Visible after beats | Still visible | **Pass** |
| Additional residual samples | inflation/confidence identical | No new residual attrs | Neutral — no beat-plan residual path |

**Finding:** Residual policy works where beat plan + unassigned keys exist. Does not invent residuals on pages without that structure.

## Unknown-Type Validation

Kitchen-sink unknown/unregistered keys remain visible in both modes (Reading Text / experimental keys in materials). `Also available` label count in prototype captures: **0** on kitchen-sink because prototype path did not remount material role grouping for that page (bit-identical).

**Also available** remains adequate **where role mapping runs** (helper + RNA/Marx). Corpus-wide unknown pages did not exercise a distinct prototype unknown grouping UI — **gap recorded**, not fixed.

## Sparse Input Validation

| Sample | Prototype vs current | Intentional when sparse? |
| ------ | -------------------- | ------------------------ |
| shape-metadata | Identical | Yes — no filler invented |
| shape-assessment-mcq | Identical | Yes |
| rna-assessment | Identical | Yes |
| KS-A4 (inside kitchen-sink) | Still “What to do” shell | Coherent current shell; **Composition C not applied** |

```text
Does the prototype still look intentional when very little data exists?
```

**Yes for pages without beats** (unchanged current). **Partially for KS-A4** — intentional current fallback, but design-goal contract not activated (path gap).

## Rich Input Validation

| Sample | Result |
| ------ | ------ |
| rna-hcv | Clearer task/output; role labels; less Success duplication; source retained |
| marx-beat | Same pattern; 5 mode badges; dense cognition still present (dual framing risk) |
| inflation / marx-self-study | Identical — rich but **no** LX gain |

```text
Does the prototype reduce clutter without hiding source content?
```

**Yes on activation-class pages.** Elsewhere: neither clutter reduction nor hiding.

## Page IA Validation

| Expectation | Outcome | Classification |
| ----------- | ------- | -------------- |
| Journey overview not reprinted | RNA: Learning Journey H2 −1 | Rule success (activation) |
| Assessment after activities | Unchanged placement | Neutral |
| Metadata gated | util-meta retained both modes | Rule success |
| Full adaptive hybrid chrome | Deferred PROT-009/010 | **Prototype limitation** |
| KS disclosure | Deferred | **Prototype limitation** |

## Accessibility Validation

| Check | Status |
| ----- | ------ |
| Headings hierarchy | Partially validated (RNA/Marx snapshots) |
| Nav label | Validated (`aria-label="Learning journey"`) |
| Mode cue text | Validated (not colour-only) |
| Role labels text | Validated on activation pages |
| Table semantics | Validated retained |
| Disclosures keyboard | Partially validated (native details for meta) |
| Focus order | Not fully validated |
| WCAG certification | **Not claimed** |

## Mobile Validation

Desktop validation screenshots + structure: role sections / tables stack via existing CSS. No prototype-specific mobile breakage on identical pages. Dedicated mobile captures for BL-008 limited; treat as **partially validated**.

## Print Validation

S65 CSS includes print disclosure expansion hooks; meta remains end/collapsed; order follows DOM. **Print order independent of UI state** — supported by static CSS design; full print PDF not regenerated in BL-008 (**partially validated**).

## Regression Analysis

| Regression | Samples | Severity | Action required |
| ---------- | ------- | -------- | --------------- |
| No LX change on non-beat pages | 10/12 | Moderate | Remediation: mount contract without requiring beats |
| Dual Orient/Think + S65 Why/Approach | rna-hcv, marx-beat | Moderate | Validate/trim dual framing in BL-009 |
| Title/fixture markers still visible | rna-hcv | Low | Title policy already partial; monitor |
| Also available unused on KS | kitchen-sink | Low–Moderate | Path coverage for role grouping |
| Grammar + contract density on rich Marx | marx-beat | Moderate | Rich-input disclosure |

No **Blocking** regression found (no source loss, no broken HTML in validation captures after BL-007 orient fix).

## Failure Taxonomy

| Issue | Type |
| ----- | ---- |
| Contract requires `episode_plan.beats` to mount | **Implementation defect** (vs design intent) |
| Full page chrome / KS disclosure | **Prototype limitation** (PROT-009/010) |
| Dual grammar framing | **Rule weakness / implementation choice** needing BL-008→009 validation |
| Sparse pages unchanged | Neutral — not a defect |
| Missing Sprint 63 plan fields | Known architecture ceiling — not a Sprint 65 renderer defect. |

## Rule Traceability Audit

| Prototype behaviour | Rule IDs | Samples validated | Outcome |
| ------------------- | -------- | ----------------- | ------- |
| Feature switch default off | D07/D51 | All 12 | Pass |
| Activity contract | MR-001–003, D21 | rna-hcv, marx-beat | Pass where mounted |
| Mode cue + fallback | MR-013/014, D22–23 | rna/marx + BL-007 unit | Pass |
| Role headings | MBP-003/004 | rna/marx | Pass |
| Residual before Check | MBP-014/020 | rna A3 | Pass |
| Title policy | MBP-006–008 | rna | Partial |
| Journey overview omit | PIA-021 | rna | Pass |
| Unknown → Also available | MBP-016 | kitchen-sink | **Not exercised** (path) |
| Full page chrome | PIA-* | — | Deferred |

No unsupported learner behaviour observed beyond documented deferred items.

## Remediation Register

| Issue ID | Severity | Type | Sample | Recommended action | Required before BL-009? |
| -------- | -------- | ---- | ------ | ------------------ | ----------------------- |
| S65-REM-001 | Moderate | Implementation defect | kitchen-sink, inflation, shapes, self-directed… | Mount Composition C when task/output exist **without** requiring `episode_plan.beats` | **Yes** (investigate) |
| S65-REM-002 | Moderate | Implementation choice | rna-hcv, marx-beat | Resolve Orient/Think vs Why/Approach dual framing | Yes |
| S65-REM-003 | Low–Mod | Path coverage | kitchen-sink | Ensure unknown residual role grouping runs on non-beat stacks | Yes |
| S65-REM-004 | Low | Prototype limitation | rich pages | PROT-009/010 page chrome — decide include vs defer past BL-009 | No (can defer) |
| S65-REM-005 | Low | Title policy | rna-hcv | Tighten learner heading vs fixture titles | Optional |

Do **not** implement in BL-008.

## Biggest Wins

1. Residual-before-Check on RNA A3 (current fails this).  
2. Task/Produce clarity replacing Success looks like merge.  
3. Archetype mode cues on understand/apply/analyse/evaluate.  
4. Learner role headings vs beat enum “Understand/Your turn”.  
5. Zero source-fidelity regressions; bit-identical pages prove non-destructive default path.

## Biggest Surprises

1. **10/12 samples bit-identical** — generalisation is path-gated, not rule-gated.  
2. Kitchen-sink unknowns already safe in current; prototype adds no further unknown chrome there.  
3. marx-self-study (rich) unchanged while marx-beat changes — beats gate dominates richness.

## Weakest Areas

1. Non-beat activity path coverage (REM-001).  
2. Deferred page IA chrome.  
3. Dual framing density on rich beat pages.  
4. Incomplete mobile/print visual certification.

### Most robust behaviours

Residual reorder · Produce≠Check · mode cue fallback · source fidelity · meta gating.

### Most fragile behaviours

Contract mounting · Also available manifestation · page-level adaptive hybrid.

### Behaviours dependent on rich data

Mode cues · Why/Approach · journey omit · Extend/transfer.

### Behaviours resilient to sparse data

No filler on shape pages · identical assessment companion · no invented progress.

## Prototype Acceptance Review

**Outcome B — Prototype validated with bounded issues.**

Evidence:

- Activation-class pages show clear LX gains and pass residual/orphan/source-fidelity checks.  
- No blocking regressions or content loss.  
- Corpus-wide median gain is zero due to mount gate — must be remediated or explicitly accepted as limitation before claiming broad hardening.  
- Deferred chrome is prototype limitation, not rule failure.

**Not Outcome A** (not fully general).  
**Not Outcome C/D** (no severe failure; do not reject or restore).

## Recommendation for BL-009

Proceed to **S65-BL-009** with mandatory investigation of **S65-REM-001–003** before any production default-on discussion. Production readiness remains **not established**. Feature switch stays default **`current`**.

## Conclusion

The BL-007 prototype **works where it mounts** (episode-plan beat activities) and is **harmless elsewhere**. Cross-sample validation therefore supports **cautious progression to hardening investigation (Outcome B)**, contingent on fixing path coverage so Composition C is not accidentally limited to beat-bearing rows.

**Next:** S65-BL-009 — Production hardening (**with remediation list**).
