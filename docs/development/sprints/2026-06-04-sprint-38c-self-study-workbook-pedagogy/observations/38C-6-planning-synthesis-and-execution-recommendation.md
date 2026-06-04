# Slice 38C-6 — Planning synthesis and execution recommendation

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38C-1](38C-1-workbook-pedagogy-model.md) through [38C-5](38C-5-workbook-experience-rendering.md)  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md)  
**Out of scope:** Implementation design, prompt edits, runtime/renderer/test changes

---

## 1. Executive summary

Sprint **38-C** answered the programme question: *How do we move from activity sheets and reference notes to effective self-study workbooks?*

**Finding:** Inflation (EV-01) is a **coherent activity sheet with reference tables**, not a **self-study workbook**. The failure is **instructional genre and upstream specification**, not Design Page content stripping or table syntax loss. Sprint **38-B** preservation and prompt architecture are **necessary but not sufficient** for workbook quality.

**Recommendation:** Charter a single next execution sprint — **Sprint 38-D: Workbook Authoring Contracts** — to translate 38-C planning into **executable DLA and GAM obligations**, a **canonical workbook fixture**, and **before/after validation** on the Inflation anchor. Defer composition/renderer-first and duration-only tracks until authoring contracts produce multi-genre upstream output.

**38-C planning objectives:** **Achieved.** Execution is **justified** when product approves 38-D charter.

---

## 2. What 38C proved

| Proposition | Evidence | Slice |
|-------------|----------|-------|
| **Workbook definition exists** | 11 instructional functions, Present/Partial/Absent rubric, 60-min MVP, PASS/FAIL (R1–R7), adjacent genres (activity sheet, reference notes, …) | [38C-1](38C-1-workbook-pedagogy-model.md) |
| **Inflation fails the workbook bar** | EV-01 scored **FAIL**; consolidation **Absent** (critical); worked examples/modelling **Absent**; genre **activity_sheet + reference_notes** | [38C-2](38C-2-workbook-gap-analysis.md) §5–6 |
| **Preservation hypothesis rejected** | GAM→Design Page `materials.*` **verbatim** on EV-01; B4 gate PASS; learner gap = genres **never authored**, not stripped | [38C-2](38C-2-workbook-gap-analysis.md) §7.1 · [38B richness](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md) |
| **Wrong-genre hypothesis supported** | EV-01-G: **4** table types only; EV-03-G: **8** types (scenario, cards, prompts, checklist); golden workshop shows richer `activity_materials` | [38C-2](38C-2-workbook-gap-analysis.md) §7 · [38C-4](38C-4-gam-instructional-genres.md) §8 |
| **DLA responsibilities clarified** | DLA owns activity set, `required_materials`, solo tasks, duration budget, function coverage; 15 requirement statements; Require/Encourage per function | [38C-3](38C-3-dla-workbook-requirements.md) |
| **GAM responsibilities clarified** | 16 instructional genres; table-only **insufficient** for workbook; DLA→GAM map; anti-patterns AP-01–12 | [38C-4](38C-4-gam-instructional-genres.md) |
| **Learner experience target defined** | 8-stage journey; section-order observations; XP anti-patterns; E1–E17 rendered-page checklist; composition boundaries | [38C-5](38C-5-workbook-experience-rendering.md) |

**Causal chain (planning consensus):**

```text
Brief (self-study workbook intent)
  → DLA under-specifies genres / solo / closure
      → GAM authors table-only bodies
          → Design Page preserves tables faithfully
              → Learner sees activity sheet + reference dump (EV-01)
```

---

## 3. What 38C disproved

| Hypothesis | Why disproved | Evidence |
|------------|---------------|----------|
| **Design Page stripping as primary cause** | Same-run GAM and page share **four table keys** with matching bodies; no scenarios/cards to strip | [38C-2 §7.1](38C-2-workbook-gap-analysis.md) · [38B-W3-4 gate](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md) |
| **Table fidelity as primary workbook problem** | Tables **render and preserve**; problem is **genre mix** (definitions encyclopaedia, pre-filled judgement, capstone reprint) | [38C-4 §5](38C-4-gam-instructional-genres.md) · [38C-2 GAP-08/09](38C-2-workbook-gap-analysis.md) |
| **Prompt-size reduction as explanation for thinness** | 38-B reduced footprint **152,782 → 71,960** while **preserving** materials contract; EV-01 thinness correlates with **4-type GAM output**, not DP token cuts | [38C-3 §2](38C-3-dla-workbook-requirements.md) · [HANDOVER](../HANDOVER.md) |

**Not disproved (out of 38-C scope or deferred):**

- Renderer could improve **visibility** of existing JSON fields — secondary until genres exist ([38C-5 §10.2](38C-5-workbook-experience-rendering.md)).
- Live rerun with full 38C-3/4 obligations — requires execution.

---

## 4. Evidence chain

| Step | Observation | Delivers |
|------|-------------|----------|
| **38C-1** | Normative **what** a workbook is | Model, rubric, PASS/FAIL, reviewer template |
| **38C-2** | **Where** EV-01 fails vs model | Gap taxonomy, origins, comparators (EV-03-G, GOLDEN) |
| **38C-3** | **What DLA must specify** | Ownership, 15 requirements, function→DLA stance |
| **38C-4** | **What GAM must author** | Genre catalogue, sequences, table rules, DLA→GAM map |
| **38C-5** | **What the learner should see** | Journey, ordering, checklist E1–E17, layer boundaries |

**Inflation anchor (programme):** EV-01-P/G/H remain the **before** baseline; EV-03-G and GOLDEN are **ceiling comparators** proving the platform **can** produce richer materials when upstream shape differs — not proof that current briefs do.

---

## 5. Ranked execution candidates

*Planning assessment only — no implementation design.*

### Candidate A — Workbook authoring contracts

| Dimension | Assessment |
|-----------|------------|
| **Problem addressed** | Upstream does not **require** or **author** workbook genres; table-only specs propagate to thin learner pages |
| **Evidence** | EV-01-G 4 types vs EV-03-G 8; [38C-3](38C-3-dla-workbook-requirements.md) §8; [38C-4](38C-4-gam-instructional-genres.md) §7–8; AP-01 table-only |
| **Expected impact** | **High** — fixes root cause for teaching, examples, retrieval, consolidation bodies |
| **Dependencies** | 38-B modules (`LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`) stable; domain `required_materials` types |
| **Risks** | Pack/prompt scope creep if framed as “another 38-B”; must stay **workbook contract** not architecture reopen |

### Candidate B — Workbook experience composition

| Dimension | Assessment |
|-----------|------------|
| **Problem addressed** | Learner-visible structure (consolidation section, `knowledge_summary`, reference vs practice separation) |
| **Evidence** | EV-01 **3** sections vs GOLDEN richness; [38C-5](38C-5-workbook-experience-rendering.md) §5–8 |
| **Expected impact** | **Medium** — improves closure and progression **when content exists**; **low** if GAM still table-only |
| **Dependencies** | **Requires A** (or equivalent) for bodies to compose |
| **Risks** | Composition cannot invent scenarios/checklists; may mask ongoing genre failure |

### Candidate C — Duration and feasibility controls

| Dimension | Assessment |
|-----------|------------|
| **Problem addressed** | EV-01 **125 min** labelled vs 60-min product intent; solo feasibility |
| **Evidence** | [38C-2 GAP-06](38C-2-workbook-gap-analysis.md); partner/group tasks A2/A4 |
| **Expected impact** | **Medium** for trust and solo usability; **low** for pedagogical depth |
| **Dependencies** | DLA session economics ([38C-3 §5](38C-3-dla-workbook-requirements.md)) |
| **Risks** | Trimming minutes without genre change leaves thin workbook |

### Candidate D — Workbook validation and gates

| Dimension | Assessment |
|-----------|------------|
| **Problem addressed** | No automated **workbook PASS** separate from B4 table syntax |
| **Evidence** | [38C-1](38C-1-workbook-pedagogy-model.md) reviewer template; [38C-5](38C-5-workbook-experience-rendering.md) E1–E17; [38C-4](38C-4-gam-instructional-genres.md) genre-mix audit concept |
| **Expected impact** | **High** long-term — prevents regression; **low** until contracts define pass rules |
| **Dependencies** | **Requires A** (normative contracts) + fixture; optionally B for HTML checks |
| **Risks** | Gate without contract change → chronic FAIL noise on Inflation |

### Ranking summary

| Rank | Candidate | Rationale |
|:----:|-----------|-----------|
| **1** | **A — Authoring contracts** | Addresses root cause; EV-03 proves uplift path when spec/genre align |
| **2** | **D — Validation and gates** | Locks in A; enables Inflation before/after |
| **3** | **B — Experience composition** | Multiplier after genres exist |
| **4** | **C — Duration controls** | Necessary hygiene; insufficient alone |

---

## 6. Recommendation

**Recommend one next sprint: Candidate A (+ essential elements of D), packaged as Sprint 38-D.**

| Criterion | Assessment |
|-----------|------------|
| **Impact** | Highest — without multi-genre upstream output, B/C/D cannot deliver workbook PASS |
| **Confidence** | **Strong** — same-topic comparators (EV-03-G, golden) isolate spec/authoring from preserve/render |
| **Scope** | **Focused** — DLA + GAM contracts, fixture, validation; not full renderer redesign |
| **Dependency alignment** | Builds on 38-B preserve stack; does not reopen prompt-size programme |

**Defer to follow-on (38-E or 38-D phase 2):** Composition/section contract (B), duration normalisation (C), full HTML experience gate (D extended).

**Do not start with B or C alone** — evidence shows EV-01 failure is **empty genre slots**, not layout.

---

## 7. Proposed Sprint 38-D — Workbook Authoring Contracts

**Working title:** Sprint 38-D — Workbook Authoring Contracts  
**Type:** Execution (when chartered) — observation here only.

### Mission

Translate 38-C findings into **executable** DLA and GAM requirements so a self-study brief produces **workbook-grade** `learning_activities` and `activity_materials`, verifiable on the Inflation anchor.

### Potential work areas (charter themes — not implementation design)

| Area | Derives from | Intent |
|------|--------------|--------|
| **Workbook-oriented DLA obligations** | [38C-3](38C-3-dla-workbook-requirements.md) | Encode Require/Encourage into pack/step contract: `required_materials` diversity, solo tasks, consolidation activity, capstone anti-dump |
| **Workbook-oriented GAM genre obligations** | [38C-4](38C-4-gam-instructional-genres.md) | Per-genre authoring rules; table-only rejection for `page_profile: learner` workbook briefs |
| **Canonical workbook fixture** | [38C-5 §10.3](38C-5-workbook-experience-rendering.md) | End-to-end reference: DLA spec + expected GAM types + page shape targets |
| **Workbook quality validation** | [38C-1](38C-1-workbook-pedagogy-model.md) §6 · [38C-5](38C-5-workbook-experience-rendering.md) §9 | Function rubric + genre-mix check + optional E1–E17 on render export |
| **Inflation before/after comparison** | EV-01 baseline | Same brief, post-contract run vs committed EV-01-P/G |

### Explicit non-goals for 38-D (unless product expands charter)

- Sprint 39 reasoning cues
- 38-B prompt-size reduction
- Renderer UX redesign (reference tabs, interactivity)
- B4 pipe-table programme reopen (except regression on new outputs)

### Success signals (execution phase — planning targets)

| Signal | Planning bar |
|--------|----------------|
| GAM organised output | **>4** material type families on workbook brief |
| 38C-1 function score | PASS on rubric for rerun anchor |
| 38C-5 checklist | E1, E2, E5, E9, E13, E14, E15 = Y on render |
| Preserve | No regression vs 38-B GAM→DP table fidelity |

---

## 8. Risks and open questions

| Risk | Mitigation (planning) |
|------|------------------------|
| 38-D conflated with 38-B architecture | Charter names **workbook contracts** only; reference existing LD modules |
| Contracts without live validation | Require Inflation before/after in charter exit criteria |
| Workshop briefs break | Scope contracts to `self_directed` + `page_profile: learner` |
| Over-scoped 38-D (renderer + packs + CI) | Phase 1 = authoring + fixture + genre gate; phase 2 = composition |

| Open question | Owner in execution |
|---------------|-------------------|
| Where session exposition lives (page section vs GAM `text`) | 38-D + optional 38-E composition |
| Consolidation: dedicated section vs last-activity material | 38-D spec + 38-E compose |
| Cognition fields in HTML export path | Export audit in 38-D or 38-E |
| Committed DLA JSON for EV-01 | Capture on 38-D baseline run |

---

## 9. Planning closure statement

| 38-C planning objective ([PLANNING-CHARTER](../PLANNING-CHARTER.md)) | Status |
|----------------------------------------------------------------------|--------|
| Workbook model documented | **Achieved** — 38C-1 |
| Gaps evidenced (Inflation + comparators) | **Achieved** — 38C-2 |
| DLA/GAM requirements drafted | **Achieved** — 38C-3, 38C-4 |
| Experience slice documented | **Achieved** — 38C-5 |
| Coherent narrative 38C-1 → 38C-5 | **Achieved** — this document §4 |
| Single execution recommendation | **Achieved** — §6–7 |
| No scope creep (runtime/prompt/test in planning) | **Achieved** |
| No implementation in planning pack | **Achieved** |

**Sprint 38-C:** **CLOSED** (planning).  
**Execution:** **Justified** — product may charter **Sprint 38-D: Workbook Authoring Contracts** per §7.

---

## 10. Success criteria (slice 38C-6)

| Criterion | Met? |
|-----------|------|
| Coherent narrative 38C-1 → 38C-5 | §4 |
| Most evidence-supported execution path identified | §5–6 |
| Single next sprint recommended | §6–7 |
| No implementation detail | Throughout |
| Slice 38C-6 | **COMPLETE** |

---

## 11. Sign-off

| Item | Link |
|------|------|
| Pedagogy model | [38C-1](38C-1-workbook-pedagogy-model.md) |
| Gap analysis | [38C-2](38C-2-workbook-gap-analysis.md) |
| DLA requirements | [38C-3](38C-3-dla-workbook-requirements.md) |
| GAM genres | [38C-4](38C-4-gam-instructional-genres.md) |
| Learner experience | [38C-5](38C-5-workbook-experience-rendering.md) |
| **Recommended next sprint** | **38-D — Workbook Authoring Contracts** |
