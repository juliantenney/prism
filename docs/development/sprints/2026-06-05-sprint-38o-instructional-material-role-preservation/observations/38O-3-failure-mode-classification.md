# 38O-3 — Failure-mode classification

**Date:** 2026-06-05  
**Status:** **COMPLETE** (analysis only)  
**Type:** Discovery — failure-mode classification  
**Predecessor:** [38O-2-role-taxonomy-page-mapping-analysis.md](38O-2-role-taxonomy-page-mapping-analysis.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Executive summary

This phase classifies **instructional-role preservation failures** observed on **`EV-38M-AFTER`** / **`EV-38N-AFTER`**, building on [38O-1](38O-1-baseline-role-survival-trace.md) (body vs role fidelity) and [38O-2](38O-2-role-taxonomy-page-mapping-analysis.md) (taxonomy and mapping).

| Finding | Detail |
|---------|--------|
| **Failure modes are layered** | Most A4 defects share one causal chain; A1–A3 show milder, systemic alias/renaming noise |
| **Dominant modes (all activities)** | **Renamed** (17/20 materials), **Duplicated** (14/20), **Alias-proliferated** (12/20) |
| **A4-specific modes** | **Compressed** (6/8 materials raw), **Role-inverted** (1), **Render-deprioritised** (7/8 materials) |
| **Isolated modes** | **Filtered** (1 — A2 M7 raw), **Merge-only survival** (1 — A2 M7) |
| **Candidate root cause** | **Missing role authority** on page model — no field binds a material body to GAM `type`/`purpose` or role family |
| **Primary mechanisms** | L4 compose role weakening (A4); additive merge; alias propagation; render key-order precedence |
| **Primary symptoms** | Duplicate keys in JSON; weak blocks before strong blocks in render; manual “thin page” when merge skipped |

**Verdict:** A4 evaluative teaching roles fail through **one underlying pattern** (compose weaken → merge overlay → render prefer compose keys), not five independent defects. Evidence prepared for 38O-4 preservation options. **No solutions proposed.**

---

## Failure-mode taxonomy

### Definitions

| Mode | Code | Definition | Detection criterion |
|------|------|------------|---------------------|
| **Renamed** | RN | Role family survives but page key or render heading ≠ GAM type/purpose label | Key/heading mismatch; body ≥90% GAM |
| **Duplicated** | DP | Same role family present on ≥2 page keys with overlapping function | ≥2 keys carry same role body or stub+full pair |
| **Compressed** | CP | Role slot retained but body &lt;50% GAM or pedagogical function collapsed | Ratio &lt;50% or shell/stub pattern |
| **Role-inverted** | RI | Key name implies role A; body performs role B | e.g. consolidation key with learner-write task |
| **Render-deprioritised** | RD | Weaker or duplicate instance appears before authoritative instance in render | h4 position order on EV-38N-AFTER |
| **Alias-proliferated** | AP | Merge or compose copies body to legacy/generic alias keys with misleading labels | e.g. `worked_example` holds judgement body; `template` duplicates memo |
| **Absent** | AB | No page key carries substantive body for role at stage inspected | No key with body ≥80 chars for role |
| **Filtered** | FI | GAM material role never emitted by compose (key missing on raw page) | Raw page lacks role slot entirely |
| **Merge-only survival** | MS | Role body appears only after `applyGamMaterialsToComposedPage`, not in raw compose | Present merged, absent raw |
| **Stable** | ST | Role family, recognisable body, single authoritative key, acceptable heading | No code above applies (or RN only, body intact, no RD) |

### Mode relationships

```text
Candidate ROOT          INTERMEDIATE MECHANISM           LEARNER-FACING SYMPTOM
─────────────────────────────────────────────────────────────────────────────────
Missing role authority  Compose role weakening (A4)      Compressed / Role-inverted
Split key vocabulary    Additive merge (no supersede)    Duplicated
Many-to-many mapping    Alias proliferation              Alias-proliferated / Renamed
No render role binding  Key-order render iteration       Render-deprioritised
Merge hook skipped      —                                Absent / Filtered (UX)
```

---

## Failure inventory

**Evidence run:** EV-38M-AFTER · **Stages:** GAM (reference) · Page Raw · Merge · Render

### A1 — Understand (M1–M4)

| Mat | Role family | Failure mode(s) | Stage(s) of occurrence |
|-----|-------------|-----------------|------------------------|
| M1 | explanatory_guidance | RN, DP, AP | Raw/Merge: `concept_text` vs `concept_exposition`; Render: duplicate headings |
| M2 | worked_example | ST | — |
| M3 | model_answer | ST | — |
| M4 | checklist | RN, DP, RD | Raw/Merge: 4 checklist keys; Render: Checklist before Verification Checklist |
| — | scaffold_hint | ST | Activity row; stable raw and merged |

### A2 — Apply CPI calculation (M5–M8)

| Mat | Role family | Failure mode(s) | Stage(s) of occurrence |
|-----|-------------|-----------------|------------------------|
| M5 | worked_calculation | RN | Raw/Merge: stored under `worked_example` key (label mismatch) |
| M6 | model_calculation | ST | — |
| M7 | practice_table | **FI**, **MS**, RN, AP | **Raw: absent**; Merge: `classification_table` + `worksheet`; Render: Worksheet + Practice Table |
| M8 | checklist | RN, DP, RD | Same pattern as A1 M4 |
| — | scaffold_hint | ST | — |

### A3 — Analyse households (M9–M12)

| Mat | Role family | Failure mode(s) | Stage(s) of occurrence |
|-----|-------------|-----------------|------------------------|
| M9 | worked_analytic_pass | RN, DP | Raw: `worked_example`; Merge: + `worked_analytic_pass`; Render: ordered (38N) — **no RD** |
| M10 | practice_table | RN | Render heading "Worksheet" vs GAM `analysis_table` |
| M11 | scenario | RN, DP | Merge: `scenario`, `scenario_maya_households`, `scenarios[]` |
| M12 | checklist | RN, DP | Merge: 3+ checklist keys; Render: single Checklist (ordered — **no RD**) |
| — | scaffold_hint | ST | — |

### A4 — Evaluate strategies (M13–M20)

| Mat | Role family | Failure mode(s) | Stage(s) of occurrence |
|-----|-------------|-----------------|------------------------|
| M13 | scenario | RN, DP, RD | Merge: 3 scenario keys; Render: Scenarios (3199) before Scenario Maya households (14687) |
| M14 | explanatory_guidance | **CP**, DP, AP, RD | Raw: `criteria_text` 71%; Merge: + `concept_exposition`; Render: Criteria Text before Concept Exposition |
| M15 | worked_judgement_support | **CP**, DP, AP, RD | Raw: stub `modelling_note` 25%; Merge: + full keys; Render: Modelling Note (8995) ≪ Worked Judgement (16908) |
| M16 | guided_judgement_table | **CP**, DP, RD | Raw: table shell 68%; Merge: + `guided_judgement_table`; Render: Decision Table (9495) before Guided Table (18261) |
| M17 | independent_template | **CP**, DP, AP, RD | Raw: scaffold 26%; Merge: full + `template`; Render: Template (6329) before Independent Judgement Template (10496) |
| M18 | checklist | CP (raw), DP, AP, RD | Raw 63%; Merge restores; Render: Checklist (4513) early + duplicates later |
| M19 | transfer_prompt | **CP**, DP, RD | Raw 31%; Merge: stub + `transfer_prompt_evaluate`; Render: Transfer Prompt (13301) before Evaluate (21140) |
| M20 | consolidation_summary | **RI**, CP (raw), ST (merged) | Raw: learner-write task; Merge: GAM teacher prose; Render: single Consolidation Summary |
| — | scaffold_hint | ST | References materials that are stubs on raw path |

---

## Frequency analysis

### Counts by failure mode (20 GAM materials)

| Mode | Count | % of materials | Primary locus |
|------|-------|----------------|---------------|
| **Renamed (RN)** | 17 | 85% | System-wide (all activities) |
| **Duplicated (DP)** | 14 | 70% | System-wide; severe on A4 |
| **Alias-proliferated (AP)** | 12 | 60% | Merge stage; peaks A4 |
| **Render-deprioritised (RD)** | 10 | 50% | Render; A1/A2 checklists + all A4 teaching roles |
| **Compressed (CP)** | 7 | 35% | **A4 only** (M14–M19 raw; M18 raw) |
| **Stable (ST)** | 5 | 25% | A1 M2–M3, A2 M6, A3 scaffold, A4 M20 post-merge |
| **Role-inverted (RI)** | 1 | 5% | **A4 only** (M20 raw) |
| **Filtered (FI)** | 1 | 5% | **A2 only** (M7 raw) |
| **Merge-only survival (MS)** | 1 | 5% | **A2 only** (M7) |
| **Absent (AB)** | 0* | 0% | *At merged+render with merge hook applied |

### Counts by activity

| Activity | Materials | Any failure | Severe failure (CP/RI/RD) | Dominant pattern |
|----------|-----------|-------------|---------------------------|------------------|
| **A1** | 4 | 2 (M1, M4) | RD on checklist | RN + DP (benign) |
| **A2** | 4 | 3 (M5, M7, M8) | FI/MS on M7 | RN + DP + one filtered slot |
| **A3** | 4 | 4 (all) | None post-38N order | RN + DP only |
| **A4** | 8 | 8 (all) | CP×6, RI×1, RD×7 | Full failure stack |

### Common vs isolated

| Category | Modes | Examples |
|----------|-------|----------|
| **System-wide (common)** | RN, DP, AP | Checklist quad-keys A1–A4; scenario alias keys A3–A4 |
| **A4-confined (common within A4)** | CP, RD, RI | All evaluative teaching roles compressed on raw compose |
| **Isolated** | FI, MS | A2 M7 practice table missing from raw compose only |
| **Absorbed by merge** | CP (partial), RI | A4 bodies restored on contract keys — **role still fails** via DP+RD |

### Stage heat map (where failures originate)

| Stage | Failure modes introduced | Materials affected |
|-------|-------------------------|-------------------|
| **GAM** | — (reference) | 0 failures |
| **Page Raw** | CP, RI, FI, RN | A4 all teaching roles; A2 M7 filtered |
| **Merge** | DP, AP, MS | All activities; additive overlay A4 |
| **Render** | RD | A1/A2 checklists; A4 all duplicate pairs |

---

## Root causes vs symptoms

### Classification matrix

| Observation | Classification | Rationale |
|-------------|----------------|-----------|
| **Missing role authority on page JSON** | **Candidate root cause** | No `role`/`gam_type`/`purpose` on material entries; cannot enforce single representation |
| **Split vocabulary (GAM vs compose vs merge contract)** | **Candidate root cause** | Enables RN and AP without detection |
| **L4 compose worksheet-native bias (A4)** | **Candidate root cause** (activity-specific) | Raw compose systematically weakens teaching roles while retaining structural keys |
| **Additive merge (overlay, no supersede)** | **Intermediate mechanism** | Explains DP: stubs coexist with full bodies |
| **applyRendererCanonicalAliases + PAGE_MATERIAL_KEY_ALIASES** | **Intermediate mechanism** | Explains AP: copies to generic keys |
| **Renderer key iteration / early paths** | **Intermediate mechanism** | Compose keys emitted before merge contract keys |
| **Duplicated keys in page JSON** | **Symptom** | Visible artefact of additive merge + aliases |
| **Compressed / stub bodies on raw page** | **Symptom** | Visible artefact of compose weakening |
| **Render-deprioritised ordering** | **Symptom** | Learner sees weak block first |
| **38M body fidelity pass with role fail** | **Symptom** | Validators resolve canonical alias; learner path does not |
| **Manual “thin page” observation** | **Symptom** | Compose-only or early-render inspection (38N-5 follow-on) |
| **Scaffold hints referencing stub materials** | **Symptom** | Task flow intact; material bodies thin on raw path |

### Causal layering (summary)

```text
ROOT (structural)
  └─ No authoritative instructional-role field on page model
  └─ Non-isomorphic key vocabularies across pipeline layers
  └─ (A4) Compose transforms teaching roles → workbook-native forms

MECHANISM (behavioural)
  └─ Merge adds GAM bodies without retiring compose keys
  └─ Alias propagation duplicates bodies under generic headings
  └─ Renderer orders by compose key presence, not role precedence

SYMPTOM (observable)
  └─ Compression, inversion, duplication in JSON
  └─ Weak-then-strong render blocks
  └─ Body-fidelity pass ∧ role-fidelity fail
```

---

## A4 cluster analysis

### Charter roles — failure profile

| Role | Mat | Raw failure | Merge failure | Render failure | Independent defect? |
|------|-----|-------------|---------------|----------------|---------------------|
| **Worked judgement** | M15 | CP (stub) | DP, AP | RD | No — same pattern |
| **Guided judgement** | M16 | CP (shell) | DP | RD | No — same pattern |
| **Independent template** | M17 | CP (scaffold) | DP, AP | RD | No — same pattern |
| **Transfer** | M19 | CP | DP | RD | No — same pattern |
| **Consolidation** | M20 | RI, CP | ST (body restored) | ST (single block) | Partial — inversion is raw-only |

### Unified A4 failure pattern

All five roles follow the **same three-step sequence**:

```text
1. PAGE RAW — Compose retains key slot, weakens pedagogical function
      (stub / shell / learner-task / shortened prompt)

2. MERGE — GAM body overlay on contract key; compose key NOT removed
      (duplicate weak + strong in JSON)

3. RENDER — Compose key path emits first; contract key emits later
      (learner sees weakened role first)
```

**Exception nuance:** M20 consolidation is **role-inverted** on raw (unique RI) but merge **replaces** body on same key — so merge is substitutive for M20 body text but **not** for other keys' stubs. M13 scenario and M18 checklist follow duplicate pattern without raw CP on scenario.

### One pattern vs multiple defects

| Interpretation | Evidence |
|----------------|----------|
| **One underlying pattern** | Same CP→DP→RD chain on M14–M19; same compose→merge→render architecture |
| **Multiple symptoms** | RI (M20), early checklist/scenario RD (M13, M18), criteria partial degrade (M14) |
| **Conclusion** | **Single root pattern** with **varying severity** per role; not five unrelated bugs |

### A4 vs 38I-4 target episode

[38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) expects sequential **teaching roles** (perspectives → criteria → worked judgement → guided table → template → transfer → consolidation). Observed render order prioritises **structural workbook elements** (Scenarios, Checklist, Template) and **weakened compose roles** before **full teaching bodies** — role **sequence** fidelity fails as well as role **body** fidelity.

---

## Hypothesis evaluation

Evidence from 38O-2 §Hypotheses, evaluated on EV-38M-AFTER.

| ID | Hypothesis | Verdict | Evidence |
|----|------------|---------|----------|
| **O2-H1** | Many-to-many mapping without role registry | **Supported** | 14/20 materials DP; A4 has 19 keys for 8 materials; no role field |
| **O2-H2** | Page model lacks role authority field | **Supported** | Materials are untyped key→body maps; GAM purpose not carried |
| **O2-H3** | Additive merge (no supersede) | **Supported** | M15 `modelling_note` 273 + `worked_judgement_weak_strong` 1082 coexist post-merge |
| **O2-H4** | Render precedence follows compose key order | **Supported** | A4 h4 positions: compose keys 3199–13748 before contract keys 15847–21140 |
| **O2-H5** | Alias proliferation causes misleading headings | **Supported** | A4 `worked_example` at 22182 with judgement body; `template` at 6329 |
| **O2-H6** | Compose favours worksheet-native roles on A4 | **Supported** | Raw A4: shells, stubs, learner-write consolidation; structural keys intact |
| **O2-H7** | Scaffold hints compensate for missing bodies | **Partially supported** | A4 scaffold references modelling note/table/template; hints survive raw+merged but materials are stubs on raw |
| **O2-H8** | Manual path may skip merge | **Partially supported** | Raw A4 matches manual “thin page” report; not directly observed in EV artefact set — inferred from 38N-5 + raw vs merged delta |

### Additional hypothesis (from 38O-1)

| ID | Hypothesis | Verdict | Evidence |
|----|------------|---------|----------|
| **O1-H3** | Render prefers weaker keys first | **Supported** | Same as O2-H4; quantified positions in 38O-2 A4 deep dive |

---

## Provisional causal model

### Pipeline model (EV-38M-AFTER)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ GAM — role authority: type + purpose (20 materials, rich teaching bodies)    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    role identity LOST (purpose not carried forward)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PAGE RAW (LLM compose)                                                       │
│  A1–A3: roles mostly intact (RN noise)                                       │
│  A4: CP + RI — teaching roles → stubs / shells / learner tasks                 │
│  A2 M7: FI — practice_table slot missing                                     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    additive overlay; stubs NOT removed
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ MERGE (applyGamMaterialsToComposedPage)                                       │
│  Body authority: pageFieldKeyForMaterial → contract keys                     │
│  DP + AP: full bodies added alongside weak compose keys                      │
│  MS: A2 M7 table appears here only                                           │
│  38M validators: pass on canonical alias resolution                            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                    key-order + early renderer paths
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RENDER (buildUtilityStructuredHtmlForTest)                                   │
│  Heading authority: prettyMaterialHeading(page_key)                            │
│  A1–A2: RD on checklist duplicates                                           │
│  A3: materials_order mitigates RD (38N)                                      │
│  A4: RD on all teaching-role pairs — weak compose block before strong merge    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LEARNER EXPERIENCE                                                           │
│  With merge: full bodies exist in JSON but weak blocks seen first (A4)       │
│  Without merge: A4 teaching roles appear absent or stub-only (manual report) │
│  A1–A3: acceptable role fidelity; checklist duplication minor                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Degradation locus summary

| Rank | Stage | Role fidelity impact | Affected activities |
|------|-------|---------------------|---------------------|
| **1 (primary)** | **Page Raw compose** | CP, RI, FI — pedagogical function weakened or slot omitted | **A4** (all teaching roles); A2 M7 |
| **2** | **Merge** | DP, AP — dual representation; role ambiguity | All; critical A4 |
| **3** | **Render** | RD — wrong prominence and heading | A1, A2, **A4**; mitigated A3 |
| **4 (none)** | **GAM** | No degradation observed | — |

### Body fidelity vs role fidelity divergence point

```text
                    Body fidelity OK          Role fidelity FAIL
                    ─────────────────         ─────────────────
Merge validators    Canonical key ≥90%        Stubs coexist (DP)
Render output       Full text reachable       Weak block first (RD)
Manual raw inspect  N/A                       Stubs only (CP)
```

---

## Scope and hold confirmation

| Hold | Status |
|------|--------|
| Do not reopen 38M | ✓ Body preservation out of scope |
| Do not reopen 38N | ✓ Hardening out of scope |
| No implementation | ✓ Classification only |
| No prompt / renderer / validator changes | ✓ |
| No recommendations or fixes | ✓ Prepared for 38O-4 only |
| Role survival focus | ✓ |

---

## References

| Document | Path |
|----------|------|
| 38O-1 baseline trace | [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md) |
| 38O-2 taxonomy + mapping | [38O-2-role-taxonomy-page-mapping-analysis.md](38O-2-role-taxonomy-page-mapping-analysis.md) |
| EV-38M-AFTER artefacts | [38M artefacts](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/) |
| EV-38N-AFTER render | [EV-38N-AFTER-render.html](../../2026-06-05-sprint-38n-page-fidelity-hardening/artefacts/EV-38N-AFTER-render.html) |

**Next phase:** [38O-4 — Preservation options / recommendation](38O-4-preservation-options-recommendation.md) (not started)
