# Slice 38G-6 — Sprint closure, retrospective and forward plan

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Sprint:** **38-G — Activity Component Quality** — **CLOSED**  
**Type:** Retrospective only — no pack/code/schema changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Sprint outcome

| Verdict | **SIGNIFICANT SUCCESS** |
|---------|-------------------------|

**Justification:** Sprint 38-G **validated the core architectural hypothesis** — existing KM/LO affordances and DLA/GAM prompt surfaces can drive **materially richer instructional design without schema, application, or renderer changes**. `EV-38G-AFTER` demonstrates a **step-change** from `EV-38F-AFTER` (4 activities, preambles, cognition fields, verification beats, richer scenarios). The **charter primary bar** — full **professional self-study workbook PASS** ([38C-1 R1–R7](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) — is **not yet met** (spoiler consolidation, uneven activation, evaluate-practice thinness). That remaining gap is **selective and traced**, not a failure of the ACM approach. **Preservation PASS** held (38E/38F structural types; regression tests green).

---

## 1. Original hypothesis

### 1.1 What 38G attempted to prove

After Sprint 38-F fixed **structural** workbook contracts (V-01 table family, V-05 scenario Material, 38E-8/9 type retention), [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) showed the Inflation anchor still **failed** as a professional self-study workbook. The page had the right **material types** but not enough **coaching and teaching density** — an **assembled** feel, not a **coached** session.

Sprint 38-G hypothesised:

> The workbook is **not exploiting pedagogical affordances already present** in Knowledge Models and Learning Outcomes — not because material **types** are missing, but because **activity components** (orientation, elucidation, activation, worked reasoning, guidance, practice, verification, reflection, transition) are thin or absent. Pack-level **activity component** obligations can produce a coached workbook on the **existing pipeline** while **retaining** 38-F structural gains.

### 1.2 Relationship model (KM → LO → activity → workbook)

```text
Knowledge Model          Learning Outcomes
(concepts, definitions,  (concept mappings,
 relationships,           cognitive levels,
 processes, groupings,    progression, intent)
 misconceptions)
         \                       /
          \                     /
           v                   v
        Activity Component Model (ACM)
        — pedagogical functions, not material types —
                   |
                   v
        Design Learning Activities (DLA)
        — specs, fields, required_materials —
                   |
                   v
        Generate Activity Materials (GAM)
        — learner-facing bodies —
                   |
                   v
        Design Page → learner workbook
```

**38G-1 finding:** Failure pattern is often **`LO → Task`** instead of **`LO → Required concepts → KM affordances → Instructional decisions → Teaching → Task → Verification → Reflection`**.

**38G mission:** Close that gap through **prompt-layer ACM encoding**, not new schemas or renderer work.

---

## 2. What was implemented

| Phase | Deliverable | What changed |
|-------|-------------|--------------|
| **38G-1** | [38G-1-first-glance-workbook-quality-analysis.md](38G-1-first-glance-workbook-quality-analysis.md) | Formalised 38F-8 gaps; KM→LO traceability lens; gap register GQ-01–GQ-10; professional FAIL / structural PASS |
| **38G-2** | [38G-2-activity-component-model.md](38G-2-activity-component-model.md) | **ACM** — 10 components; KM→component and LO-level minimum bundles; DLA/GAM field mapping; Sprint 28–31 alignment |
| **38G-3** | [38G-3-dla-gam-implementation.md](38G-3-dla-gam-implementation.md) + pack §5/§6 | **DLA-WB-20/21**, **GAM-WB-21**; ACM in `promptTemplate` + `defaultPromptNotes`; cognitive bundles (Understand/Apply/Analyse/Evaluate); anti–LO→Task guidance |
| **38G-4** | [38G-4-regression-and-preservation-review.md](38G-4-regression-and-preservation-review.md) | Hold-condition audit; 12/12 prompt-surface tests PASS; **READY** for pipeline capture |
| **38G-5** | [38G-5-acm-realisation-trace.md](38G-5-acm-realisation-trace.md) + [EV-38G-AFTER](../artefacts/) | End-to-end ACM trace DLA→GAM→page; comparison vs `EV-38F-AFTER` |

**Production code touched:** `domains/learning-design/domain-learning-design-step-patterns.md` **§5 and §6 only** (38G-3). No `app.js`, schema, renderer, or preservation architecture changes.

---

## 3. Evidence

Source: [EV-38G-AFTER](../artefacts/) capture ([run-log](../artefacts/EV-38G-AFTER-run-log.json)) on Inflation anchor, same brief as 38F.

### 3.1 Assumptions (not fully tested in sprint)

| Assumption | Status |
|------------|--------|
| Full KM artefact flows through workflow in production | **Not tested** — capture harness synthesises LOs; no frozen `knowledge_model.json` |
| Design Page always drops preambles | **Falsified on 38G run** — preambles preserved (38F run differed) |
| Renderer is primary quality bottleneck | **Not supported** — losses traced to GAM/page compose before render |
| Single anchor (Inflation) generalises to all topics | **Not claimed** — programme finding provisional |

### 3.2 Observations (artefact evidence)

| Observation | 38F | 38G |
|-------------|-----|-----|
| Activity count | 3 | **4** |
| `activity_preamble` on page | **0/3** | **4/4** |
| Cognition fields on page | Absent | **Present** (A1–A4 where authored) |
| GAM verification types | None | **task_cards, prompt_set, checklist** |
| Scenario depth | Bullet labels | **Named households, income/expense** |
| Hollow “answer questions” (A1) | Yes | **No** — task cards + prompts |
| Spoiler `consolidation_summary` | Yes (A3) | **Yes** (A4) — pattern persists |
| Table instruction prose on page | N/A | **Trimmed** vs GAM (A2, A3) |

### 3.3 Demonstrated outcomes (sprint proved)

| Outcome | Evidence |
|---------|----------|
| ACM prompts change live DLA/GAM output | `EV-38G-AFTER` vs `EV-38F-AFTER` delta |
| 38E/38F structural holds survive ACM layer | 38G-4 hold review; types present in 38G run |
| Most ACM components reach learner page | 38G-5 preservation matrix — 8/10 component types predominantly P/S |
| Pack-only implementation sufficient for uplift | No code/schema changes; measurable page improvement |
| Remaining losses are **localised and layer-attributed** | GAM spoiler; page table trim; harness no KM |

---

## 4. Findings

### 4.1 Can existing KM and LO structures drive richer instructional design?

**Yes — when encoded in DLA/GAM prompts and when upstream artefacts exist.**

- [38G-2](38G-2-activity-component-model.md) mapped KM slots (concepts, relationships, processes, misconceptions) and LO affordances (cognitive level, progression) to **existing** DLA fields and GAM material types.
- [38G-5](38G-5-acm-realisation-trace.md): DLA authored rich cognition fields and KM-aware `required_materials` purposes; GAM realised verification and scenario depth.
- **Limit:** Brief/KM affordances not in the pipeline (e.g. GDP deflator) never reached DLA — exploitation ceiling is **artefact availability**, not schema shape.

### 4.2 Can this be achieved without schema changes?

**Yes — demonstrated.**

All 38G-3 obligations use existing surfaces: `activity_preamble`, cognition-orientation fields, `required_materials` types (`task_cards`, `checklist`, `prompt_set`, etc.). No new JSON schema fields were added.

### 4.3 Can this be achieved without application or renderer changes?

**Yes — demonstrated.**

Sprint scope was pack §5/§6 only. `EV-38G-AFTER` improvement occurred without `app.js` or renderer edits. Preservation lib modules unchanged (38G-4).

### 4.4 Did instructional richness survive to the learner page?

**Mostly yes — with known exceptions.**

| Survived | Lost or weakened |
|----------|------------------|
| Preambles, learner tasks, cognition fields | Table `*Instructions:*` prose (page) |
| Worked example, sample output, scenarios | Full-model `consolidation_summary` (GAM→page) |
| Task cards, prompt sets, checklists | `prior_knowledge_activation` on A2/A3 (never authored) |
| Misconception surfacing where DLA specified | KM-only misconceptions (no KM in harness) |

**Net:** Instructional richness **crossed from sparse (38F) to substantial (38G)** on the learner page; **not yet complete** for professional workbook PASS.

---

## 5. Remaining gaps

### 5.1 Not solved (in scope for follow-up)

| Gap | Layer | 38G pointer |
|-----|-------|-------------|
| **Anti-spoiler consolidation** | GAM | GQ-10; A4 model essay undermines learner-write task |
| **Table adjunct fidelity** | Page compose | GAM table instructions dropped on page |
| **Evaluate-task richness** | DLA arc | Evaluate LO on capstone; no dedicated evaluate activity with criteria/`modelling_note` |
| **KM-enabled harness coverage** | Pipeline | GDP deflator, programme misconceptions absent without KM step |
| **Uneven knowledge activation** | DLA | `prior_knowledge_activation` on A1 only |
| **Weak inter-activity transitions** | DLA | Preambles per activity; few explicit bridges |
| **38C-1 professional PASS** | Composite | R3 improved; R4 spoiler partial; full first-glance PASS not scored PASS |

### 5.2 Out of scope (explicitly not 38G)

| Topic | Notes |
|-------|-------|
| Prerequisite knowledge modelling | Future KM enrichment |
| Threshold concepts | Not in current KM schema |
| Canonical examples library | Not required for ACM proof |
| Concept importance weighting | Not in sprint charter |
| Future KM schema expansion | Deferred until instructional need demonstrated |
| Design Page investigation sprint | Charter non-goal (though table trim may need compose attention) |
| Renderer / layout sprint | Charter non-goal |
| Preservation architecture redesign | V-13 monitor only |
| Sprint 39 reasoning cues | Separate programme |

---

## 6. Strategic outcome

### 6.1 Threshold assessment

| Era | Characterisation | Inflation anchor evidence |
|-----|----------------|---------------------------|
| **Pre-38G** | **Content assembly** | Right material types; thin tasks; no verification beats; preambles dropped (38F page) |
| **Post-38G** | **Instructionally-informed generation** (emerging) | Coached episode structure; KM/LO-aware specs; verification; cognition scaffolding on page |

**Conclusion:** Prism has **crossed an architectural threshold** on the anchor evidence. Generation is no longer only “place the right blocks” — it increasingly **sequences pedagogical functions** through ACM-aware DLA/GAM. The workbook is **closer to coached self-study** but **not yet reliably professional PASS** without follow-up on closure genre and compose fidelity.

### 6.2 Programme arc (38-C → 38-G)

```text
38-C  Define workbook pedagogy (R1–R7)
38-D  Authoring contracts + validation
38-E  Implement contracts in pack
38-F  Structural refinement (V-01/V-05) + quality diagnosis
38-G  Activity component quality (ACM) — prompt-layer composition  ← CLOSED
```

**38-G closes the “what functions must exist” arc** at the **composition** layer. Remaining work is **refinement and harness completeness**, not re-litigating material-type contracts.

---

## 7. Recommendations

### 7.1 Immediate follow-ups (small, targeted)

| # | Action | Rationale | Suggested owner |
|---|--------|-----------|---------------|
| 1 | **Tighten GAM anti-spoiler consolidation** — explicit FAIL when `consolidation_summary` is model essay + learner-write task | Largest remaining learner-visible ACM gap | Pack §6 (narrow clause) |
| 2 | **Design Page table material fidelity** — preserve non-pipe adjunct instruction in `materials.*_table` | Guidance weakened at compose | Compose contract / Design Page step (programme decision) |
| 3 | **Add prompt-surface tests** for DLA-WB-20/21, GAM-WB-21 | 38G-4 noted gap | Tests only |
| 4 | **Include KM step in evaluation harness** | Unblocks KM exploitation claims | Pipeline fixture script |
| 5 | **38D V-10 function-first calibration** (docs) | R3/R4 scoring alignment per 38F-6/38F-7 | Docs parallel track |

### 7.2 Medium-term opportunities (after pipeline stable)

| Opportunity | Preconditions |
|-------------|---------------|
| Richer **Evaluate** activity contract (dedicated activity + `modelling_note` before consolidation) | Stable 4-activity arc on anchor |
| **KM→DLA traceability** checks in validation | KM artefact in standard workflow runs |
| Cross-topic replication (second anchor) | Inflation findings accepted |
| Optional KM enrichments (prerequisite links, misconception registry) | Demonstrated instructional need from traces |

### 7.3 Things not to do

- **Do not** expand KM/LO schema speculatively until a traced gap requires fields not expressible in current surfaces.
- **Do not** reopen V-01 table family or V-05 scenario Material — holds are proven.
- **Do not** default to renderer or `app.js` changes for composition gaps traceable to GAM or Design Page.
- **Do not** conflate **material type PASS** with **professional workbook PASS** — 38G proved they diverge.

---

## 8. Sprint deliverables checklist

| Phase | Deliverable | Status |
|-------|-------------|:------:|
| 38G-1 | First-glance analysis | ✓ |
| 38G-2 | Activity component model | ✓ |
| 38G-3 | Pack §5/§6 + implementation note | ✓ |
| 38G-4 | Regression + preservation review | ✓ |
| 38G-5 | ACM realisation trace + `EV-38G-AFTER` | ✓ |
| 38G-6 | This closure document | ✓ |

---

## 9. Forward plan — recommended next workstream

**Primary recommendation:** **Sprint 38-H (working title) — Workbook Realisation Fidelity** — narrow follow-up focused on **GAM consolidation discipline** and **Design Page material fidelity** (table adjunct, orientation field preservation under all compose paths), with **KM-in-harness** for evaluation. **Not** a broad ACM redesign.

**Alternative parallel track:** **38D V-10 calibration** (documentation) — function-first scoring for R3/R4 without blocking realisation work.

**Frozen comparators (unchanged):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*`

---

## 10. Closure statement

Sprint **38-G** is **CLOSED** (2026-06-05).

The sprint **proved** that activity component quality can be raised through **existing KM/LO affordances and DLA/GAM prompt contracts** without schema or application changes, and that **most** instructional richness **survives to the learner page** on the Inflation anchor. It **did not** fully achieve the charter’s **professional workbook PASS** — spoiler consolidation and selective compose losses remain — but it **established the architectural path** from content assembly toward **instructionally-informed generation**.

**Significant success** — mechanism validated; quality bar partially met; clear, evidence-based forward plan.
