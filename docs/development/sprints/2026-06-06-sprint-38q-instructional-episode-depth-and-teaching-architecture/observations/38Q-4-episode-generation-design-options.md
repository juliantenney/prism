# 38Q-4 — Design options for richer episode generation

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Structured option evaluation — docs only; no implementation; no winner selected  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38Q-4  
**Inputs:** [38Q-1](38Q-1-what-good-looks-like-baseline.md) · [38Q-2](38Q-2-episode-taxonomy-catalogue.md) · [38Q-3](38Q-3-dla-gam-gap-analysis.md) · [38I-5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) · EV-38P-AFTER  
**Successor:** 38Q-5 Recommended architecture

---

## Scope

Evaluate alternative educational architectures against the 38Q-1–38Q-3 evidence base.

**This is the first phase where solution options may be discussed.**

| In scope | Out of scope |
|----------|--------------|
| Structured option evaluation | Selecting a winner |
| Trade-off analysis | Final recommendation (38Q-5) |
| Hypothesis alignment (H1/H2/H3) | Implementation |
| Prompt accretion analysis | Reopening 38M–38P |

### Hard constraints (non-negotiable)

| ID | Constraint | Evidence |
|----|------------|----------|
| **F-1** | `fullOk` preserved | EV-38P-AFTER: `proofOk: true`, `roleOk: true`, `fullOk: true` |
| **F-2** | 38M–38P frozen | [38P-7](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md) |
| **F-3** | 38I target states authoritative | Mock-ups + A4 episode |

### Evidence position entering 38Q-4

| Finding | Source |
|---------|--------|
| Native object today: **Activity → `required_materials[]` → `learner_task`** | [38Q-1](38Q-1-what-good-looks-like-baseline.md) |
| Target object: **Instructional Episode → functions → transitions → learner-state changes → materials realise functions** | [38Q-2](38Q-2-episode-taxonomy-catalogue.md) |
| Dominant bottleneck: **G3** (missing transitions) + **G5** (episode-structure gaps) | [38Q-3](38Q-3-dla-gam-gap-analysis.md) |
| Secondary: **G4** (artefact substitution) | [38Q-3](38Q-3-dla-gam-gap-analysis.md) |
| Material bodies often **Strong**; sequencing **Missing** | [38Q-3 §7.1](38Q-3-dla-gam-gap-analysis.md) |
| Hypothesis position: **H1 Low · H2 High · H3 Medium** | [38Q-1 §G](38Q-1-what-good-looks-like-baseline.md) |

### Core evaluation question

> Which educational abstraction best supports instructional functions, transitions, and learner-state progression — while preserving `proofOk`, `roleOk`, and `fullOk`?

---

## Task 1 — Evaluation criteria

Derived from 38Q-1–38Q-3 findings. Each criterion states what “good” means and which evidence motivates it.

| Criterion | Description | Evidence basis |
|-----------|-------------|----------------|
| **Function representation** | Can instructional functions be represented as first-class planning objects — not only as emergent properties of material types? | [38Q-3 §7.1](38Q-3-dla-gam-gap-analysis.md): functions mapping to deliverable prose survive; sequence-native functions do not. [38Q-2 §7](38Q-2-episode-taxonomy-catalogue.md): transition-dominant patterns are edge-weighted. |
| **Transition representation** | Can instructional transitions (Worked→Guided→Independent; Perspective→Criteria→Judgement; Predict→Evidence→Revision) be represented directly and enforced? | [38Q-3 §7.3](38Q-3-dla-gam-gap-analysis.md): priority transitions Missing/Weak all archetypes. Primary bottleneck G3. |
| **Episode planning** | Can learner-state progression be planned before material obligations are generated? | [38Q-3 §7.4](38Q-3-dla-gam-gap-analysis.md): G5 — parallel materials without episode plan. [38I-5 §2.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): ~35% richness from episode structure. |
| **Archetype coverage** | Works across A1–A4 canonical sequences without archetype-specific workarounds? | [38Q-1 Archetype Assessment](38Q-1-what-good-looks-like-baseline.md): all four score DLA/GAM **B**; weaknesses cross-archetype. |
| **Fidelity compatibility** | Preserves post-38M merge + post-38P render guarantees (`fullOk`)? | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md): F-1–F-3. 38M–38P solved preservation; gap is upstream shape. |
| **Complexity** | Relative implementation cost — schema, pipeline, prompt, and operational burden. | [38I-5 §6](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): no schema expansion required for first IFP-class layer. |
| **Migration risk** | Risk to existing DLA/GAM investment, regression suite, and authoring flows. | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md): 58/58 regression floor. EV-38P proves current surfaces work. |
| **Explainability** | Educational model clarity — can authors and reviewers see functions and transitions, not only material lists? | [38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md): function-only episode description possible for A4. [38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): reorder test shows materials lack visible choreography. |
| **Prompt dependence** | Reliance on prompt forcing vs structural guarantees. | Charter prompt accretion challenge; [38Q-1 §Prompt accretion](38Q-1-what-good-looks-like-baseline.md). [38I-5 §2.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): LO guidance alone ~5% richness. |
| **Artefact-substitution resistance** | Reduces tendency for tables/checklists/templates to stand in for reasoning moves (G4). | [38Q-3 Task 3](38Q-3-dla-gam-gap-analysis.md): six G4-class gaps. |
| **KM leverage** | Uses existing KM read paths before inference; does not require new KM slots for first gain. | [38I-5 §1.3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): strongly supported functions map to KM objects. |
| **Inference contractability** | Can high-inference Evaluate functions (criteria, perspectives, trade-offs) be governed by explicit contracts? | [38I-5 §3–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): Evaluate reliability **No** without guidance. |

### Rating scale (Tasks 3–4)

| Rating | Meaning |
|--------|---------|
| **Strong** | Directly addresses criterion/gap with structural support; evidence suggests reliable delivery |
| **Moderate** | Partially addresses; depends on discipline, prompts, or archetype |
| **Weak** | Unlikely to address reliably; symptom treatment or late-pipeline patch |

---

## Task 2 — Candidate options

Six options evaluated. Descriptions are conceptual — no implementation prescription.

### Option A — Prompt enrichment

**Description:** Retain current architecture (Activity → `required_materials[]` → `learner_task`; DLA obligations; GAM realisation). Improve prompts, pack rules, and inference instructions only.

**Core question:** Can richer prompting solve G3/G5?

**Evidence anchor:** EV-38P-AFTER already produces **Strong** explanation and worked thinking under current prompts + fidelity pipeline. G3/G5 persist at `fullOk: true` — suggesting prompts alone have not closed sequencing gaps. [38I-5 §2.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): LO guidance contributes ~5% of target richness.

**Prompt accretion assessment:** Prompt growth may add **material depth** (longer M1, richer M15) but lacks a **structural object** to enforce transition order, fade arcs, or anti-substitution rules. Risk: accretion compensates for missing episode model without guaranteeing choreography ([38Q-1 prompt accretion challenge](38Q-1-what-good-looks-like-baseline.md)).

---

### Option B — DLA extension

**Description:** Retain DLA as primary planning surface. Add explicit fields or structures for instructional functions, transitions, and learner-state targets within DLA rows (e.g. function tags on materials, transition metadata, ordered obligation segments).

**Core question:** Can current abstractions be extended sufficiently?

**Evidence anchor:** DLA already carries cognition annotations (`scaffold_hint_sequence`, `self_explanation_prompt`) but [38Q-3](38Q-3-dla-gam-gap-analysis.md) classifies these as **not episode beats** (G3/G5). `required_materials[]` is a parallel bundle without sequence metadata ([GAP-13](38Q-3-dla-gam-gap-analysis.md)). Extension would make DLA **episode-aware** while preserving downstream GAM.

---

### Option C — GAM extension

**Description:** Retain DLA shape. Add transition/choreography logic during GAM generation — reordering, linking, or enriching materials at realisation time.

**Core question:** Is GAM too late in the pipeline to solve episode planning?

**Evidence anchor:** 38M–38P fidelity programme operates **downstream** of generation shape. GAM receives DLA obligations; if DLA specifies a parallel bundle, GAM faithfully realises it ([38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): 20/20 materials at 100% char ratio). Choreography at GAM could improve **linking prose** but cannot retroactively plan **missing function obligations** (e.g. perspective construction never requested).

---

### Option D — Episode/function planning layer

**Description:** Introduce a planning abstraction between LOs and DLA. The layer plans ordered functions, transitions, and learner-state progression **before** material obligations are generated. DLA becomes a **realisation target** populated from the plan. No specific implementation named here; aligns conceptually with [38I-5 §6 Instructional Function Plan](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md).

**Core question:** Does upstream planning address G3/G5 while preserving DLA/GAM as fidelity surfaces?

**Evidence anchor:** [38I-5 §2.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): episode structure ~35% of target richness; generation does not yet follow archetype plans. [38Q-3 §7.4](38Q-3-dla-gam-gap-analysis.md): functions exist as nodes but are unconnected — planning layer targets the connection problem directly.

---

### Option E — Episode-native redesign

**Description:** Replace activity-centred planning with episode-centred planning. **Instructional Episode** becomes the primary planning object; materials are secondary realisations. Activity/`learner_task` may be reframed as episode segments or outcomes rather than the unit of design.

**Core question:** Would this address G3/G5 directly? What are the costs?

**Evidence anchor:** [38Q-1 native-object diagnosis](38Q-1-what-good-looks-like-baseline.md): current unit-of-design mismatch is structural (H3 signal). [38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md): rich episodes describable function-only without material types. Redesign cost: migration of DLA-centric authoring, tests, and pack contracts; risk to fidelity if episode layer bypasses proven merge path.

---

### Option F — Hybrid path

**Description:** Introduce episode/function planning (as in Option D) while preserving DLA and GAM as downstream **realisation and fidelity surfaces**. Episode plan → DLA population → GAM realisation → Page compose (unchanged preservation).

**Core question:** Can transition planning be added without discarding existing investment?

**Evidence anchor:** [38I-5 §6 flow](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) already sketches this hybrid. [38Q-1 §G H3 Medium](38Q-1-what-good-looks-like-baseline.md): full replacement may be overstated if GAM remains valid realisation layer. 38M–38P investment preserved on merge/render path.

---

## Task 3 — Option scoring matrix

Qualitative ratings with evidence-based rationale. **No winner selected.**

| Option | Functions | Transitions | Episode planning | Fidelity compatibility | Complexity | Risk |
|--------|:---------:|:-----------:|:----------------:|:----------------------:|:----------:|:----:|
| **A — Prompt enrichment** | Moderate | Weak | Weak | **Strong** | **Strong** (low cost) | **Strong** (low risk) |
| **B — DLA extension** | Moderate | Moderate | Moderate | **Strong** | Moderate | Moderate |
| **C — GAM extension** | Moderate | Weak | Weak | **Strong** | Moderate | Moderate |
| **D — Planning layer** | **Strong** | **Strong** | **Strong** | **Strong** | Moderate | Moderate |
| **E — Episode-native redesign** | **Strong** | **Strong** | **Strong** | Moderate | Weak (high cost) | Weak (high risk) |
| **F — Hybrid** | **Strong** | **Strong** | **Strong** | **Strong** | Moderate | Moderate |

### Rationale summaries

| Option | Rationale |
|--------|-----------|
| **A** | Can deepen existing Strong functions (Explanation, Worked thinking) and add optional fields content. Cannot structurally enforce transitions or fade — DLA has no transition object today. Low risk because no pipeline change. |
| **B** | Function tags on `required_materials[]` could make functions visible and ordered. Moderate transition support if transition metadata is first-class. Risk: DLA row still activity-centric; may recreate planning layer **inside** DLA without clean separation ([38Q-1 H3 signal](38Q-1-what-good-looks-like-baseline.md)). |
| **C** | GAM can add connective tissue (transitions prose, sequencing hints) to existing materials. Cannot plan functions never obligated by DLA. Too late for GAP-03 (perspective construction), GAP-02 (fade as separate guided/independent obligations). Preservation path unchanged — fidelity **Strong**. |
| **D** | Directly targets G3/G5: plan functions and transitions before DLA. [38I-5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) argues no schema expansion required for first implementation. DLA/GAM unchanged as surfaces — fidelity **Strong**. |
| **E** | Strongest educational alignment — episode is native object per 38I. High migration risk: reframes all LO→activity flows, pack contracts, and tests. Fidelity **Moderate** — must prove episode plan still feeds proven merge path without bypass. |
| **F** | Combines D’s planning strength with preservation of 38M–38P investment. Conceptually same as D with explicit commitment to DLA/GAM as realisation only. Slightly higher design clarity than B (planning not buried in DLA). |

### Secondary criteria (summary)

| Option | Artefact-substitution resistance | Prompt dependence | Explainability | Archetype coverage |
|--------|:--------------------------------:|:-----------------:|:--------------:|:------------------:|
| **A** | Weak | Weak (high dependence) | Weak | Moderate |
| **B** | Moderate | Moderate | Moderate | Moderate |
| **C** | Weak | Moderate | Weak | Moderate |
| **D** | **Strong** | **Strong** (structural) | **Strong** | **Strong** |
| **E** | **Strong** | **Strong** | **Strong** | **Strong** |
| **F** | **Strong** | **Strong** | **Strong** | **Strong** |

---

## Task 4 — Stress-test against key gaps

Five thematic gaps selected for cross-option stress-testing. Cross-reference to [38Q-3 GAP register](38Q-3-dla-gam-gap-analysis.md) shown in parentheses.

| Gap theme | 38Q-3 IDs |
|-----------|-----------|
| No prediction/revision cycle | GAP-15 |
| Missing fade | GAP-01, GAP-06 |
| Missing perspective→criteria→judgement | GAP-02, GAP-03, GAP-04 |
| Artefact substitution | GAP-08–GAP-12 (G4 class) |
| Parallel material bundles | GAP-13 (G5 class) |

| Gap | A Prompt | B DLA ext. | C GAM ext. | D Planning | E Redesign | F Hybrid |
|-----|:--------:|:----------:|:----------:|:----------:|:----------:|:--------:|
| **GAP-01 — No prediction/revision** | Weak | Moderate | Weak | **Strong** | **Strong** | **Strong** |
| **GAP-02 — Missing fade** | Weak | Moderate | Weak | **Strong** | **Strong** | **Strong** |
| **GAP-03 — Perspective→Criteria→Judgement** | Weak | Moderate | Weak | **Strong** | **Strong** | **Strong** |
| **GAP-04 — Artefact substitution** | Weak | Moderate | Moderate | **Strong** | **Strong** | **Strong** |
| **GAP-05 — Parallel material bundles** | Weak | Moderate | Weak | **Strong** | **Strong** | **Strong** |

### Per-gap evidence notes

#### GAP-01 — No prediction/revision cycle (GAP-15)

| Option | Assessment |
|--------|------------|
| **A** | Prompts can request prediction prompts — but without planned **Predict→Evidence→Revision** transition, revision remains optional prose. [38Q-1 §C](38Q-1-what-good-looks-like-baseline.md): historical D9 absent in EV-38P. |
| **B** | DLA could add `prediction` / `revision` function slots with ordering — **Moderate** if transition metadata enforced. |
| **C** | GAM could insert prediction/revision materials if DLA omits them — **Weak** (reactive, not planned). |
| **D/E/F** | Planning layer can mandate cycle as archetype transition — **Strong** when Evaluate/Understand sequences require it. |

#### GAP-02 — Missing fade (GAP-01, GAP-06)

| Option | Assessment |
|--------|------------|
| **A** | Prompts can ask for “guided then independent” — EV-38P shows single-table substitution instead ([38Q-3 A2](38Q-3-dla-gam-gap-analysis.md)). **Weak.** |
| **B** | Separate material obligations for guided vs independent with fade metadata — **Moderate**; requires DLA schema/contract extension. |
| **C** | GAM cannot split one DLA table obligation into fade arc — **Weak.** |
| **D/E/F** | Function plan specifies Guided practice → Independent performance as ordered obligations before DLA population — **Strong**; matches [38I-2 Apply arc](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md). |

#### GAP-03 — Perspective→Criteria→Judgement (GAP-02–04)

| Option | Assessment |
|--------|------------|
| **A** | A4 already has modular bodies (M13–M17) but chain is **Missing** ([38Q-3 A4](38Q-3-dla-gam-gap-analysis.md)) — material presence ≠ transition. **Weak.** |
| **B** | Ordered function tags could enforce chain — **Moderate**; inference contracts still needed for perspective/criteria content. |
| **C** | GAM can improve linking between existing modules — **Weak** for missing perspective **construction** (GAP-03). |
| **D/E/F** | Plan mandates Perspective construction → Criteria construction → Evaluative judgement before material mapping — **Strong**; addresses G1+G3 together. |

#### GAP-04 — Artefact substitution (G4 class)

| Option | Assessment |
|--------|------------|
| **A** | Prompt anti-patterns (no checklist-without-modelling) — fragile; EV-38P shows checklists dominate verification. **Weak.** |
| **B** | Function-tagged obligations + anti-substitution rules in DLA — **Moderate.** |
| **C** | GAM can enrich checklist/table bodies — improves **G2** not **G4** root cause. **Moderate** at best. |
| **D/E/F** | Plan specifies **learner-state change** per function; materials are realisations — checklist only when Verification function explicitly allows audit pattern — **Strong.** |

#### GAP-05 — Parallel material bundles (GAP-13)

| Option | Assessment |
|--------|------------|
| **A** | Prompts listing “generate in order” — no structural enforcement; [38Q-1 reorder test](38Q-1-what-good-looks-like-baseline.md) fails. **Weak.** |
| **B** | Ordered `required_materials[]` with function metadata — **Moderate** if order is canonical, not cosmetic. |
| **C** | GAM sequencing (38N) improves render order but not pedagogical order if DLA bundle is parallel — **Weak.** |
| **D/E/F** | Episode plan is the ordering authority; DLA inherits plan order — **Strong.** |

---

## Task 5 — Hypothesis alignment

For each option: does the path primarily support H1, H2, or H3?

| Option | H1 (implementation deficiency) | H2 (abstraction extension) | H3 (abstraction misalignment) | Dominant alignment |
|--------|:------------------------------:|:----------------------------:|:-----------------------------:|:------------------:|
| **A — Prompt enrichment** | **Primary** | Weak | Weak | **H1** |
| **B — DLA extension** | Partial | **Primary** | Partial | **H2** |
| **C — GAM extension** | **Primary** | Weak | Weak | **H1** |
| **D — Planning layer** | Weak | **Primary** | Partial | **H2** |
| **E — Episode-native redesign** | Weak | Partial | **Primary** | **H3** |
| **F — Hybrid** | Weak | **Primary** | Partial | **H2** |

### Per-option explanation

| Option | Why |
|--------|-----|
| **A** | Assumes abstractions are sound; gap is generation behaviour. **Contradicted as primary** by 38Q-3: Strong material bodies coexist with Missing transitions — not pure implementation failure. Can support H1 for **material depth** only. |
| **B** | Extends DLA with function/transition structures without new top-level object — classic H2. May blur into H3 if activity-centred shape persists. |
| **C** | Implementation improvement at realisation stage — H1. Does not add planning abstraction; weak vs G3/G5 evidence. |
| **D** | Adds planning layer between LO and DLA — direct H2 match to [38Q-1 leading interim hypothesis](38Q-1-what-good-looks-like-baseline.md). Preserves DLA/GAM — not full H3. |
| **E** | Replaces activity as unit-of-design — H3. Addresses misalignment directly; highest cost. |
| **F** | H2 with explicit preservation thesis — episode plan extends; DLA/GAM remain valid (38Q-1 H3 Medium: replacement may be overstated). |

---

## Task 6 — Option failure modes

Unbiased weaknesses, educational risks, and implementation risks.

### Option A — Prompt enrichment

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | Improves prose length, not sequence integrity. Prompt accretion without structural object. |
| **Educational risks** | Checklist/table substitution persists ([38Q-3 G4](38Q-3-dla-gam-gap-analysis.md)). Fade and perspective chains remain absent. |
| **Implementation risks** | Low technical risk; high **false-confidence** risk — `fullOk` masks unchanged worksheet architecture. |
| **May not solve** | G3, G5, GAP-01–05 — evidence: current prompts already produce Strong exposition at `fullOk`. |

### Option B — DLA extension

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | Function metadata on activity rows may duplicate a planning layer without cleaner separation. Activity remains primary object. |
| **Educational risks** | Tags become cosmetic if GAM/DLA population ignores transition rules. Cognition fields repeat today’s pattern (present but not episode beats). |
| **Implementation risks** | Schema/contract churn on DLA; regression risk to 38M–38P if merge assumptions change. |
| **May not solve** | G5 if `learner_task` shell still collapses plan into “Complete table → Checklist”. |

### Option C — GAM extension

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | Downstream patch — cannot obligate functions DLA never requested. |
| **Educational risks** | Connective prose between weak modules ≠ perspective construction or fade. |
| **Implementation risks** | 38M body-fidelity constraints; choreography logic may fight preservation proofs. |
| **May not solve** | GAP-02 (fade needs separate obligations), GAP-03 (perspective construction), GAP-05 (planning authority). |

### Option D — Planning layer

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | New layer complexity; archetype selection and inference contracts must be maintained. |
| **Educational risks** | Plan could devolve into material checklist with function labels — repeating G5 in new vocabulary. |
| **Implementation risks** | Integration contract LO→Plan→DLA must be enforced; plan bypass would orphan layer. |
| **May not solve** | G2 weak realisation (e.g. M15 depth) without GAM quality rules; session-level fade across activities ([38I-5 §4.1 scaffold fading](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)). |

### Option E — Episode-native redesign

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | Highest migration cost; long parallel operation of old and new models. |
| **Educational risks** | Redesign may over-correct — discard working material realisation patterns. |
| **Implementation risks** | Fidelity regression if episode object bypasses proven DLA→GAM→Page path; 58/58 suite exposure. |
| **May not solve** | Evaluate inference burden without inference contracts; KM sparsity for misconceptions. |

### Option F — Hybrid

| Category | Failure mode |
|----------|--------------|
| **Likely weaknesses** | Two-world mental model (plan vs activity) if boundaries unclear. |
| **Educational risks** | Plan honoured in authoring but stripped at generation — hybrid becomes nominal. |
| **Implementation risks** | Plan→DLA mapping errors; duplicate specification in plan and DLA. |
| **May not solve** | Same as D if plan layer is weakly enforced; same session-level fade gap as D. |

---

## Task 7 — Comparative synthesis

### 1. Which options primarily improve **materials**?

| Tier | Options | Evidence |
|------|---------|----------|
| **Primary** | **A**, **C** | Target generation content and realisation quality. EV-38P already Strong on exposition — diminishing returns for G3/G5. |
| **Secondary** | **B** | Can improve material obligations if function-tagged. |
| **Tertiary** | **D**, **E**, **F** | Improve materials **indirectly** via planned functions — primary gain is sequencing. |

### 2. Which options primarily improve **transitions**?

| Tier | Options | Evidence |
|------|---------|----------|
| **Primary** | **D**, **E**, **F** | First-class transition planning before material generation ([38Q-3 §7.3](38Q-3-dla-gam-gap-analysis.md)). |
| **Moderate** | **B** | If transition metadata enforced on ordered obligations. |
| **Weak** | **A**, **C** | No structural transition object. |

### 3. Which options make **learner-state progression** first-class?

| Tier | Options | Evidence |
|------|---------|----------|
| **Primary** | **D**, **E**, **F** | Episode plan encodes progression ([38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md) function-only description). |
| **Partial** | **B** | If progression encoded in DLA obligation order + function tags. |
| **Weak** | **A**, **C** | Progression implied in prompts or prose links only. |

### 4. Which options preserve the **most existing investment**?

| Tier | Options | Evidence |
|------|---------|----------|
| **Highest** | **A** | Zero pipeline change; fidelity untouched. |
| **High** | **C**, **F**, **D** | D/F preserve DLA/GAM/38M–38P path; C preserves DLA shape. |
| **Moderate** | **B** | Extends DLA contracts. |
| **Lowest** | **E** | Reframes primary planning object. |

### 5. Which options most directly address **G3/G5**?

| Tier | Options | Evidence |
|------|---------|----------|
| **Strongest** | **D**, **E**, **F** | Task 4: **Strong** on all five thematic gaps. |
| **Moderate** | **B** | Structural potential; activity-centred risk. |
| **Weakest** | **A**, **C** | Task 4: **Weak** on GAP-01, 02, 03, 05. |

### Synthesis diagram (conceptual — not a recommendation)

```text
Material quality          Transition / episode structure
     ↑                                ↑
  A, C ─────────────┬──────────── D, E, F
                    │
                    B (bridge — depends on enforcement)
                    │
              E (highest structure gain, highest cost)
```

**No winner selected.** Evidence clusters: **A/C** = low-risk material improvement; **D/F** = G3/G5 alignment with fidelity preservation; **E** = strongest educational native object, highest migration risk.

---

## Prompt accretion analysis (charter requirement)

| Question | Finding | Evidence |
|----------|---------|----------|
| Is prompt growth a symptom or solution? | **Primarily symptom** for G3/G5 | Strong bodies already at current prompt depth; transitions still Missing |
| Can prompts alone enforce fade? | **No** reliably | A2: single M7 table substitutes guided+independent ([38Q-3](38Q-3-dla-gam-gap-analysis.md)) |
| Can prompts alone enforce Evaluate chain? | **No** reliably | A4: 8/8 material types; 0/5 priority transitions Strong |
| When is prompt enrichment justified? | **G2** weak realisation (depth, integration) | M15 weak/strong partial; not primary bottleneck |
| Minimum structural alternative | Ordered function plan before DLA | [38I-5 §6](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) |

---

## Inputs to 38Q-5

### Strongest candidate options (by evidence cluster — not ranked as winner)

| Cluster | Options | Why surfaced |
|---------|---------|--------------|
| **G3/G5 alignment + fidelity preservation** | **D**, **F** | Task 3–4: Strong on transitions, episode planning, fidelity. 38I-5 conceptual flow. H2 alignment. |
| **Low-risk incremental** | **A** (+ targeted **C**) | Lowest complexity/risk; justified for G2 depth only — insufficient alone for stated bottleneck. |
| **Structural DLA change without new layer** | **B** | H2 moderate path; risk of duplicating D without separation clarity. |
| **Full native-object alignment** | **E** | H3 primary; only if 38Q-5 judges H3 dominance over H2 preservation argument. |

### Unresolved questions for 38Q-5

1. **Planning layer vs DLA extension:** Is a separate episode/function plan layer ([D/F](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)) materially different from making DLA episode-aware ([B](38Q-4-episode-generation-design-options.md)), or the same abstraction at different boundaries?
2. **Activity object fate:** Does hybrid ([F](38Q-4-episode-generation-design-options.md)) retain Activity as container, or demote it to segment within episode?
3. **Session-level fade:** Within-episode fade may be plan-addressable; cross-activity session fade has no KM/LO field ([38I-5 §4.1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)) — session arc contract scope?
4. **Inference contracts:** Can Evaluate perspective/criteria/trade-off functions reach reliability without new KM slots ([38I-5 §5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md))?
5. **Blank-sheet test:** Would a greenfield Prism use Activity→Materials→Task or Episode→Functions→Transitions ([38Q-1 counterfactual](38Q-1-what-good-looks-like-baseline.md))?
6. **Anti-substitution enforcement:** What obligation rules prevent checklist/table/template substitution under each option?

### Evidence still needed (before final recommendation)

| ID | Evidence gap | Suggested 38Q-5 input |
|----|--------------|---------------------|
| **E-1** | Prototype function-plan → DLA trace for one archetype (e.g. A4) | Paper walkthrough or dry-run against 38I-4 A4 episode |
| **E-2** | Regression impact model per option | Which options touch 38M–38P proof paths |
| **E-3** | Authoring UX | Can reviewers see transitions under B vs D/F |
| **E-4** | Prompt budget comparison | A-only vs D/F — accretion delta estimate |
| **E-5** | Archetype selector reliability | LO verb vs cognitive_level mismatch (A2 Apply) |

### Key trade-offs (decision basis — not resolution)

| Trade-off | Pole A | Pole B |
|-----------|--------|--------|
| **Risk vs structure** | A/C: low risk, weak G3/G5 | D/F/E: structural gain, integration cost |
| **H2 vs H3** | Extend with planning layer (D/F) | Redesign episode-native (E) |
| **Preservation vs clarity** | Keep DLA as planning (B) | Separate plan layer (D/F) |
| **Prompt vs structure** | Prompt accretion (A) | Structural guarantees (D/F) |
| **Material vs episode** | Improve bodies (A/C) | Improve choreography (D/E/F) |

---

## Success condition

At end of 38Q-4 it is possible to answer:

> **If the dominant bottleneck is missing transitions and episode structure, what architectural options exist, and what are their trade-offs?**

**Answer (evidence-led):**

Six options span a spectrum from **prompt-level improvement (A, C)** — low risk, weak on G3/G5 — through **DLA extension (B)** — moderate structural potential — to **planning-layer and hybrid paths (D, F)** — strongest G3/G5 alignment with `fullOk` preservation — to **episode-native redesign (E)** — strongest educational alignment, highest migration risk.

**G3/G5 dominance** from 38Q-3 steers option evaluation toward **planning-first paths (D, F)** and away from **prompt-only (A)** as sole strategy. **Fidelity compatibility** is **Strong** for A, B, C, D, F — **Moderate** for E until merge-path proof is shown.

No architecture selected. Decision basis prepared for 38Q-5.

---

## Hold conditions

- No winner, no implementation, no IFP specification.  
- 38M–38P not reopened.  
- `fullOk` remains hard constraint for all options.  
- Options evaluated against 38Q-3 GAP register — not new baselines.

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38Q-4 |
| Status | **COMPLETE** |
| Next | **38Q-5** — recommended architecture |
