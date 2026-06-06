# 38O-5 — Sprint closure

**Date:** 2026-06-05  
**Sprint:** 38-O Instructional Material Role Preservation  
**Phase:** 38O-5 (documentation and closure only)  
**Status:** **CLOSED**  
**Predecessor:** [Sprint 38-N](../2026-06-05-sprint-38n-page-fidelity-hardening/) (**CLOSED** — [38N-5](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) · **SUCCESS**)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Sprint objective

Determine whether **pedagogically important instructional material roles** generated upstream (GAM) survive into the composed page model and learner render — a concern **distinct from** the body-parity and anti-synopsis guarantees closed in Sprints 38-M and 38-N.

**Programme question addressed:**

> When GAM contains instructional teaching roles, do those roles survive as learner-facing page materials, or are they reduced to readings, worksheets, templates, and checklists?

**Central closure question:**

> Did Sprint 38O establish that instructional role fidelity is a distinct architectural concern worthy of separate treatment from body fidelity?

**38-O answer:** **Yes.** Role fidelity is a distinct, evidence-backed architectural concern. Body fidelity (`proofOk: true`) and role fidelity (`roleOk: false` on A4) are **orthogonal**. The sprint completed its discovery mission without implementation.

---

## Investigation timeline

| Phase | Date | Deliverable | Type | Status |
|-------|------|-------------|------|--------|
| **38O-1** | 2026-06-05 | [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md) | Analysis only | **Complete** |
| **38O-2** | 2026-06-05 | [38O-2-role-taxonomy-page-mapping-analysis.md](38O-2-role-taxonomy-page-mapping-analysis.md) | Analysis only | **Complete** |
| **38O-3** | 2026-06-05 | [38O-3-failure-mode-classification.md](38O-3-failure-mode-classification.md) | Analysis only | **Complete** |
| **38O-4** | 2026-06-05 | [38O-4-preservation-options-recommendation.md](38O-4-preservation-options-recommendation.md) | Design only | **Complete** |
| **38O-5** | 2026-06-05 | This closure record | Docs only | **Complete** |

**Dependency chain executed:**

```text
38O-1 Phenomenon confirmation → 38O-2 Taxonomy + mapping → 38O-3 Failure modes → 38O-4 Options → 38O-5 Closure
```

**Evidence base:** `EV-38M-AFTER-*` (fresh inflation capture) · `EV-38N-AFTER-*` (post-38N replay render) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) (target-state reference)

**Scope respected:** No production code, prompts, renderer logic, validators, or workflow components were modified.

---

## Phase summaries

### 38O-1 — Baseline role-survival trace

| Field | Content |
|-------|---------|
| **Objective** | Trace instructional material roles GAM → Page (raw + merged) → Render; build role-survival matrix; distinguish body fidelity from role fidelity |
| **Findings** | A1–A3: roles largely survive with renaming and alias duplication; body fidelity ≈ role fidelity. A4: teaching roles compressed or role-inverted on raw compose; post-merge full GAM bodies restored on canonical keys **alongside** weaker compose stubs; render surfaces weak blocks before authoritative blocks. `proofOk: true` does not imply role fidelity. |
| **Contribution** | **Confirmed the phenomenon** — role preservation gap exists as a separate concern from 38M/38N body guarantees. Established survival codes (SURVIVE, COMPRESS, ROLE_INVERT, DUPLICATE, etc.) and the A4 primary gap as the capstone evidence case. |

### 38O-2 — Role taxonomy and page-mapping analysis

| Field | Content |
|-------|---------|
| **Objective** | Formalise instructional role taxonomy; map GAM `type`/`purpose` → page keys → render headings |
| **Findings** | Role vocabulary is fragmented across four authorities (GAM type/purpose, page keys, merge contract, render headings). 17+ role families defined. A1–A3 mappings mostly stable with RN/DP noise. A4 evaluative roles show compression, duplication, inversion, and render deprioritisation. Merge contract is body-authoritative; compose keys remain render-order authoritative. |
| **Contribution** | **Named the role system** — provided the vocabulary and mapping model required for failure classification and preservation design. Identified missing role authority on page model as structural gap. |

### 38O-3 — Failure-mode classification

| Field | Content |
|-------|---------|
| **Objective** | Classify observed role losses: lost, compressed, filtered, renamed, merged into weaker roles, render-deprioritised |
| **Findings** | Ten failure modes defined (RN, DP, CP, RI, RD, AP, AB, FI, MS, ST). Systemic noise on all activities: Renamed 85%, Duplicated 70%, Alias-proliferated 60%. A4-specific cluster: Compressed, Role-inverted, Render-deprioritised. **Single unified A4 pattern:** compose weaken → additive merge → render prefer compose keys. Candidate root cause: missing role authority field on page materials. |
| **Contribution** | **Diagnosed the failure architecture** — showed dominant issue is role ambiguity, not GAM content loss. Prepared causal model and hypothesis evaluation for preservation options. |

### 38O-4 — Preservation options and recommendation

| Field | Content |
|-------|---------|
| **Objective** | Evaluate preservation models (A–F); recommend conceptual direction for potential future work |
| **Findings** | No single-layer fix sufficient. Options A–E each address part of causal chain. **F1 — Registry-led hybrid** recommended: role registry + explicit authority metadata + merge supersession + render role precedence. Alternative F2 (merge-led hybrid). RF-1..RF-8 role-fidelity success criteria defined. All options compatible with 38M/38N if additive. |
| **Contribution** | **Defined the preservation strategy space** — established that role fidelity should become a first-class contract dimension parallel to body fidelity, with measurable criteria and a preferred conceptual direction. No implementation proposed. |

---

## Hypothesis assessment

**Original hypothesis (38O charter):**

> Instructional material roles can degrade independently of body fidelity.

| Verdict | **Supported** |
|---------|---------------|

### Evidence

| Source | Observation |
|--------|-------------|
| **38O-1 §6** | On A4, 38M post-merge achieves 100% body ratio on canonical keys while role identity, prominence, and single-authoritative-representation fail |
| **38O-1 §5** | EV-38N-AFTER render: `Modelling Note` stub (273 chars) at char ~9156 before `Worked Judgement Weak Strong` (1082 chars) at ~17221 — body present, role failed |
| **38O-3 §Body vs role divergence** | `validate38MPageFidelity` resolves one body per canonical contract — sufficient for body fidelity, insufficient for one learner-facing role with correct pedagogical framing |
| **38O-4 §Role-fidelity success criteria** | On `EV-38M-AFTER` replay: **proofOk true**, **roleOk false** (A4) — demonstrating orthogonality |
| **38N-5 follow-on** | Manual inflation reports "thin page" despite GAM richness — consistent with role degradation when merge skipped or compose path dominates UX |

### Qualification

The hypothesis is **fully supported on A4** (capstone evaluative episode) and **partially supported on A1–A3**, where body and role fidelity largely align but systemic RN/DP/AP noise persists. The distinction is **architecturally universal** (split authority model) but **learner-impact severity** concentrates on A4 teaching roles.

**Not unsupported in any activity.** No activity showed role fidelity failure without a corresponding architectural explanation in the split-authority model.

---

## Key discoveries

### 1. Body fidelity vs role fidelity distinction

| Dimension | Body fidelity (38M/38N) | Role fidelity (38O) |
|-----------|-------------------------|---------------------|
| Question | Is the GAM body present at ≥ contract ratio? | Is exactly one authoritative, correctly labelled, correctly ordered learner-facing instance rendered per role? |
| A4 on EV-38M-AFTER | **Passes** post-merge | **Fails** — duplicates, weak-first render, mis-labelled headings |
| Proof gate | `proofOk` | `roleOk` (conceptual — not yet implemented) |

Body fidelity is **necessary but not sufficient** for instructional fidelity.

### 2. Role taxonomy

17+ instructional role families formalised (38O-2), including: `explanatory_guidance`, `worked_example`, `worked_calculation`, `worked_analytic_pass`, `model_answer`, `worked_judgement_support`, `guided_judgement_table`, `independent_template`, `transfer_prompt`, `consolidation_summary`, `verification_checklist`, `practice_table`, `scenario`, and activity-row roles (`scaffold_hint`, `learner_task`, `reasoning_orientation`).

Assignment rule: `role_family := f(GAM.type, GAM.purpose)`.

### 3. Failure-mode catalogue

| Mode | Code | Prevalence (20 materials) | A4-specific |
|------|------|---------------------------|-------------|
| Renamed | RN | 85% | Yes |
| Duplicated | DP | 70% | Yes |
| Alias-proliferated | AP | 60% | Yes |
| Render-deprioritised | RD | 50% | Yes (7/8 materials) |
| Compressed | CP | — | Yes (6/8 raw) |
| Role-inverted | RI | — | Yes (M20 raw) |
| Filtered | FI | — | A2 M7 only |
| Merge-only survival | MS | — | A2 M7 only |

### 4. A4 unified failure pattern

All five A4 teaching roles (M14–M19) follow the same three-step sequence:

```text
1. PAGE RAW  — Compose retains key slot, weakens pedagogical function (stub / shell / learner-task)
2. MERGE     — GAM body overlay on contract key; compose key NOT removed (duplicate weak + strong)
3. RENDER    — Compose key path emits first; contract key emits later (learner sees weakened role first)
```

Not five independent defects — **one underlying pattern** with varying severity per role.

### 5. Split authority model

Four independent authorities govern role signals with no cross-layer binding:

| Layer | Authority | Role signal |
|-------|-----------|-------------|
| GAM | `type` + `purpose` | Authoritative pedagogical intent |
| Page Raw | LLM compose keys | Untyped key → body map; no purpose carried |
| Merge | `pageFieldKeyForMaterial` | Body-authoritative; additive, not substitutive |
| Render | `prettyMaterialHeading(key)` + key iteration order | Key-centric; compose keys precede contract keys |

Role identity is **lost at page raw** (purpose not carried forward) and **ambiguity accumulates** through merge and render.

### 6. roleOk concept

Role fidelity should be expressed as an **additive proof dimension** alongside `proofOk`:

```text
38M proofOk (body)  +  roleOk (RF-1..RF-8)  =  full L4 instructional fidelity (conceptual)
```

RF-1..RF-8 criteria defined in 38O-4: role uniqueness, no weak-first render, stable identity, pedagogical function preserved, no role inversion, episode sequence alignment, body–role coherence, compose-path transparency.

---

## Recommended disposition

### Evidence sufficiency assessment

| Question | Assessment |
|----------|------------|
| Does the phenomenon exist? | **Yes** — proven on A4 with quantified render positions |
| Is it distinct from body fidelity? | **Yes** — orthogonal proof dimensions |
| Is the root cause identified? | **Yes (conceptual)** — missing role authority; split key vocabularies; additive merge; render key-order precedence |
| Is a preservation direction defined? | **Yes** — F1 registry-led hybrid with RF-1..RF-8 criteria |
| Is multi-run generalisation proven? | **No** — single primary evidence run (`EV-38M-AFTER`); 38O-4 records this as unknown |
| Is compose-stage root cause fully characterised? | **Partial** — A4 raw CP/RI observed; prompt/compose policy not investigated |

**Overall:** Evidence is **sufficient to justify a future implementation sprint** for role fidelity. Residual unknowns (multi-run generalisation, compose policy) are **implementation-phase risks**, not blockers to chartering — they should be addressed within an implementation sprint's proof framework, not via additional open-ended discovery.

### Options evaluated

| Option | Description | Assessment |
|--------|-------------|------------|
| **Option 1 — No further action** | Accept current state; rely on 38M/38N body fidelity | **Not recommended.** A4 capstone role failure is pedagogically significant; 38I-4 episode sequence not achieved; manual thin-page reports persist |
| **Option 2 — Additional discovery** | Further analysis before any implementation commitment | **Not recommended as primary path.** Core phenomenon, taxonomy, failure modes, and preservation direction are established. Remaining unknowns are bounded and testable during implementation proof |
| **Option 3 — Implementation charter for role fidelity** | Charter a future sprint to implement F1 registry-led hybrid with RF-1..RF-8 proof gates | **Recommended.** Evidence base, causal model, and conceptual strategy are sufficient. Implementation sprint should be separately chartered — not designed in 38O |

### Recommendation

**Charter a future implementation sprint** focused on instructional role fidelity, using **F1 — Registry-led hybrid** (38O-4) as the conceptual starting point:

1. Role registry (GAM → role_family → canonical key → heading → sequence)
2. Explicit `role_family` + `authority` on page materials
3. Merge supersession (retire compose stubs when GAM wins)
4. Render role precedence (generalise 38N A3 ordering by role family)
5. Additive `roleOk` proof gates (RF-1..RF-8) alongside existing `proofOk`

**Alternative if scope must be minimised:** F2 — Merge-led hybrid (C + A + minimal B), accepting RD may persist until render phase.

**Not in scope for 38O or implied by this recommendation:** prompt changes, compose LLM policy, schema redesign beyond role metadata, or reopening 38M/38N.

---

## Lessons learned

### Discovery process

- Tracing GAM → Page Raw → Merge → Render as **separate stages** was essential. Analysing merged JSON alone would have missed raw compose CP/RI and concluded body fidelity implies role fidelity.
- Starting from a **38N follow-on observation** (manual thin-page reports) and validating against frozen `EV-38M-AFTER` artefacts produced reproducible, quantified evidence without new inflation runs.
- Phased discovery (phenomenon → taxonomy → failure modes → options) prevented premature solution design and kept each phase's conclusions evidence-bound.

### 38M/38N relationship

- 38M/38N success is **real and must not be reopened**. Body preservation, anti-synopsis, semantic markers, and A3 render ordering hardening remain closed guarantees.
- 38O revealed that 38M merge contract is **body-authoritative but not role-authoritative** — it restores GAM bodies without retiring compose stubs or binding render precedence.
- 38N A3 `materials_order` hardening is a **proven precursor** to render role precedence (Option D) — role fidelity extends 38N patterns rather than contradicting them.

### Role authority insight

- The dominant failure is **role ambiguity**, not content loss. GAM teaching bodies survive merge; learners still see wrong instances first.
- **Missing role authority** on the page model is the structural root cause. Without `role_family` and `authority` metadata, no layer can reliably distinguish authoritative from superseded instances.
- Renaming (RN) is benign when body is intact and no duplicate exists; it becomes harmful when combined with DP and RD.

### Architectural implications

- Instructional fidelity requires **two parallel contract dimensions**: body fidelity (38M/38N) and role fidelity (38O).
- A role registry bridging GAM vocabulary to page keys and render headings is the conceptual anchor — without it, each layer invents its own key vocabulary.
- Merge policy must evolve from **additive overlay** to **supersession-aware overlay** for role-equivalent keys, while preserving 38M body injection on authoritative instances.
- Proof framework should report `proofOk` and `roleOk` independently — full L4 fidelity requires both.

---

## Success assessment

### Sprint success criteria (charter)

| Criterion | Target | Met? |
|-----------|--------|------|
| Role-survival matrix | Evidence-backed across A1–A4 on ≥1 inflation run | **Yes** — 38O-1 |
| Body vs role fidelity | Explicitly distinguished | **Yes** — 38O-1 §6, 38O-4 layered model |
| Failure modes | Classified with hypotheses | **Yes** — 38O-3 (10 modes, causal model) |
| Scope | No 38M/38N reopen; no implementation | **Yes** — zero production changes |
| Closure | Discovery verdict with recommendation | **Yes** — this document |

### Closure verdict

| Outcome | **SUCCESS** |
|---------|-------------|

**Justification:**

Sprint 38O successfully determined the **existence**, **nature**, and **significance** of instructional-role fidelity as a distinct architectural concern:

- **Existence:** Confirmed on A4 with quantified evidence; partially present as systemic noise on A1–A3
- **Nature:** Role ambiguity from split authority model — not GAM content loss; unified A4 CP→DP→RD pattern
- **Significance:** Capstone A4 evaluative teaching roles fail learner-facing sequence and prominence despite `proofOk: true`; 38I-4 target episode not achieved
- **Preservation direction:** F1 registry-led hybrid with RF-1..RF-8 criteria; 38M/38N compatible
- **Disposition:** Future implementation sprint recommended; no further open-ended discovery required

The sprint did not implement fixes — by design. Discovery mission complete.

---

## Closure recommendation

| Field | Value |
|-------|-------|
| **Sprint status** | **CLOSED** |
| **Verdict** | **SUCCESS** |
| **Central question answer** | Instructional role fidelity **is** a distinct architectural concern worthy of separate treatment from body fidelity |
| **Hypothesis** | **Supported** — roles degrade independently of body fidelity |
| **Future disposition** | **Option 3** — Charter implementation sprint for role fidelity (F1 preferred; F2 alternative) |
| **Hold** | Do not reopen 38M or 38N; do not implement within 38O |

---

## Future work

| Item | Type | Notes |
|------|------|-------|
| **Role fidelity implementation sprint** | Implementation | [Sprint 38-P](../../2026-06-05-sprint-38p-instructional-role-fidelity/) — F1 registry-led hybrid; RF-1..RF-8 proof gates; additive to `proofOk` |
| **Multi-run proof replay** | Implementation-phase validation | Extend beyond single `EV-38M-AFTER` run before declaring roleOk stable |
| **Compose-stage role policy** | Implementation-phase investigation | A4 raw CP/RI may require compose prompt or post-compose role tagging — not fully characterised in 38O |
| **38I episode alignment** | Proof criterion | RF-6 episode sequence alignment against 38I-4 A4 reference |
| **Manual-path diagnosis** | Proof criterion | RF-8 compose-path transparency for merge-skipped thin-page scenarios |

**Not recommended:**

- Additional open-ended discovery sprint (phenomenon and direction established)
- No further action (A4 capstone failure is pedagogically significant)

**Explicit non-goals for future work (carry forward from 38O):**

- Reopen 38M body preservation mission
- Reopen 38N marker/render/schema hardening
- General instructional quality review beyond role survival

---

## References

| Document | Path |
|----------|------|
| 38O-1 baseline trace | [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md) |
| 38O-2 taxonomy + mapping | [38O-2-role-taxonomy-page-mapping-analysis.md](38O-2-role-taxonomy-page-mapping-analysis.md) |
| 38O-3 failure modes | [38O-3-failure-mode-classification.md](38O-3-failure-mode-classification.md) |
| 38O-4 preservation options | [38O-4-preservation-options-recommendation.md](38O-4-preservation-options-recommendation.md) |
| 38M closure | [38M-6-sprint-closure.md](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) |
| 38N closure | [38N-5-sprint-closure.md](../../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) |
| 38I A4 episode | [38I-4-a4-evaluate-learner-episode.md](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
