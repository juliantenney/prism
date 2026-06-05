# Slice 38H-1 — Workbook Realisation Fidelity Analysis

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Analysis only — no pack, code, schema, or harness changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38H-1  
**Inputs:** [38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) · [38G-6](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md) · [EV-38G-AFTER-*](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/)  
**Comparator (H-04 only):** [EV-38E10-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-dla-learning-activities.json)

---

## 1. Executive Summary

On `EV-38G-AFTER`, **38G-3 ACM richness largely survives** DLA → GAM → Design Page. Remaining learner-visible losses are **narrow and layer-specific** — not systemic compose failure or renderer stripping.

| ID | Genuine defect? | Owner layer | In 38H implementation scope? |
|----|-----------------|-------------|------------------------------|
| **H-01** | **Yes** — spoiler `consolidation_summary` undermines learner-write task | **GAM** (prompt/genre) | **Yes** — 38H-2 |
| **H-02** | **Yes** — table `*Instructions:*` adjunct prose dropped at page | **Design Page compose** (LLM + contract) | **Yes** — 38H-3 |
| **H-03** | **Yes** — evaluation harness omits KM (and related upstream steps) | **Pipeline harness** | **Yes** — 38H-4 |
| **H-04** | **Yes** as pedagogy gap — **not** a fidelity loss | **DLA arc design** | **No** — defer |

**Scope reduction (preferred outcome):**

- **Implement:** H-01, H-02, H-03 only.  
- **Do not implement in 38H:** H-04, DLA activation consistency, inter-activity transitions, KM/LO schema, ACM redesign, renderer, `app.js` (unless 38H-1+charter amendment — **not indicated**).  
- **Hold:** V-01, V-05, 38E-8/9 types, 38G-3 DLA-WB-20/21 · GAM-WB-21, Preservation V-13.

**Headline:** Three fixes, three surfaces — pack §6 (GAM anti-spoiler), pack §13 + `LD-TABLE-FIDELITY` preserve role (table adjunct), harness script (KM step). Everything else traced on this anchor is either **already preserved** or **out of charter**.

---

## 2. H-01 Analysis — GAM Consolidation Discipline

### 2.1 Scope of `consolidation_summary` on `EV-38G-AFTER`

The capture contains **one** `consolidation_summary` material:

| Field | Value |
|-------|--------|
| Activity | A4 — `inflation_wb_04` |
| Material ID | `inflation_wb_04_cs` |
| GAM length | 899 chars |
| Page | **Identical** to GAM (`materials.consolidation_summary` verbatim) |

No other activities list `consolidation_summary`. A1–A3 use worked_example, tables, scenario, checklist, etc. — **not in scope** for consolidation classification.

### 2.2 Classification table (all `consolidation_summary` instances)

| Activity | Material | Classification | Rationale |
|----------|----------|----------------|-----------|
| **A4** `inflation_wb_04` | `inflation_wb_04_cs` | **Spoiler / model essay** | Past-tense session summary (`"In this session, you have learned…"`) stating completed takeaways and named strategies; not a learner-fill scaffold |
| — | — | *Not: instructional summary* | Would be session-level recap **for facilitator** — not present |
| — | — | *Not: learner-supportive reflection* | `prompt_set` (5 prompts) fulfils reflection; consolidation body **pre-answers** reflection |
| — | — | *Not: template scaffold* | DLA spec asks for `"Template requires summarizing ≥3 key ideas"`; GAM delivers **finished prose**, not headings/prompts for learner completion |

**Comparator note:** `EV-38E10-AFTER` A4 `consolidation_summary` (M8) is a **filled first-person template** (`"In this session, I learned three key ideas…"`). Same structural failure class (model answer vs learner-write) with different voice. **Not a 38G regression** — persistent GAM genre mis-realisation.

### 2.3 Spoiler instance detail

| Dimension | Evidence |
|-----------|----------|
| **Activity** | A4 — Consolidation Summary: Managing Inflation Effects on Personal Budgets |
| **Learner task** | `"Write a summary of what you have learned… Reflect on at least two strategies you could use to manage inflation's effects on your personal budget."` |
| **Expected output** | `"A written consolidation summary of at least 80 words… evaluates personal strategies…"` |
| **Spoiler content** | Full paragraph asserting: inflation definition, CPI measurement, household impacts, and strategies (`"budgeting carefully, seeking income adjustments, and controlling expenses"`) in past tense |
| **Conflict** | Learner is asked to **produce** synthesis and strategy evaluation; material **already provides** the synthesis and strategies. Practice component **weakened** (38G-5 Pattern D; GQ-10). `prompt_set` cannot recover — prompts ask "what strategies" after strategies are stated. |

### 2.4 Layer attribution

| Hypothesis | Verdict | Evidence |
|------------|---------|----------|
| **GAM prompt issue** | **Primary** | DLA `required_materials` purpose: `"template and guidance"`; GAM purpose line matches but **Content** is completed essay. Pack **GAM-WB-06** mandates `≥80 words` and `≥3 key ideas` without explicit **anti-spoiler / template-not-essay** enforcement. **F1** fails missing consolidation, not spoiler genre. **F2** covers prompt_set-only closure only. |
| **GAM material-selection issue** | **No** | Correct type (`consolidation_summary`) on correct activity; single material, correctly labelled. |
| **Design Page compose issue** | **No** | Page copies GAM body **byte-for-byte** (899 chars match). |

### 2.5 Smallest viable fix surface

| Surface | Change |
|---------|--------|
| **Pack §6 GAM** | Narrow clause (extend GAM-WB-06 or add F7): when `learner_task` / `expected_output` require **learner-written** consolidation, `consolidation_summary` must be **scaffold only** — section headings, bullet prompts, word-count cues; **forbid** past-tense completed session essay and pre-stated strategy recommendations. Align with existing `template-only worked FAIL` pattern (inverse: **completed-essay consolidation FAIL**). |
| **Tests** | Prompt-surface assertion for anti-spoiler consolidation row (mirror 38G-4 style). |
| **Out of scope** | `app.js`, renderer, DLA arc redesign, removing `consolidation_summary` type. |

### 2.6 Acceptance test (how we know it is fixed)

On `EV-38H-AFTER` (38H-5):

1. A4 `consolidation_summary` contains **no** past-tense `"you have learned"` / pre-filled strategy list answering the learner task.  
2. A4 `learner_task` + `prompt_set` remain; learner must still write ≥80 words.  
3. GAM-WB-06 still satisfied (material present, ≥3 key-idea **prompts**, not answers).  
4. Page preserves GAM body faithfully (no new compose loss).

---

## 3. H-02 Analysis — Design Page Material Fidelity

### 3.1 Table-based materials inventory

| Activity | Material ID | Type | GAM content (chars) | Page content (chars) | Adjunct in GAM |
|----------|-------------|------|---------------------|----------------------|----------------|
| A2 | `inflation_wb_02_ct` | `analysis_table` | 1056 | 769 | **271** — `*Instructions:* Calculate the annual inflation rate…` |
| A3 | `inflation_wb_03_at` | `analysis_table` | 978 | 778 | **186** — `*Instructions:* Complete the table by assessing…` |

**Non-table materials on same activities:** A2 `prompt_set` (645 chars) — **preserved** on page. A3 `scenario`, `checklist` — **preserved**. Loss is **isolated to `materials.analysis_table` adjunct prose**.

### 3.2 GAM → Design Page trace

```text
GAM analysis_table Content:
  [pipe table rows]  +  [post-table *Instructions:* prose]

Design Page materials.analysis_table:
  [pipe table rows only]
```

**Measured loss:** ~271 chars (A2) + ~186 chars (A3) = **457 chars** of instructional guidance. Pipe rows (7 lines each) survive with minor whitespace normalisation only.

### 3.3 Loss inventory by adjunct type

| Adjunct type | A2 | A3 | Page fate |
|--------------|----|----|-----------|
| **Completion instructions** | Present (`Calculate… Classify… Write notes…`) | Present (`Complete the table…`) | **Lost** |
| **Worked guidance** | Partially duplicated in `prompt_set` (formula) | Partially in `scaffold_hint_sequence` (DLA field, preserved) | Table-local imperative guidance **lost** |
| **Interpretation prompts** | In adjunct + prompt_set | In adjunct + checklist | Table-local interpretation cues **lost** |
| **Formula / calculation guidance** | In `prompt_set` | — | **Preserved** (alternate material) |

**Pedagogical impact:** Learner sees empty table **without** adjacent "how to complete" prose. `learner_task` and `prompt_set` partially compensate on A2; A3 relies more on checklist — **weaker table-adjacent coaching** than GAM authored.

### 3.4 Exact compose behaviour causing loss

| Factor | Finding |
|--------|---------|
| **Runtime `app.js` stripping** | **Not implicated** — capture uses **LLM Design Page step** output directly; no post-compose table sanitizer in harness. |
| **Design Page LLM behaviour** | Model emitted pipe-only strings; `constraints_applied` includes `"Maintained pipe table fidelity"` — **narrow interpretation** of table fidelity. |
| **Contract gap** | `LD-TABLE-FIDELITY` preserve role: *"copy each **pipe block** verbatim"* (`lib/ld-table-fidelity.js` PRESERVE_LINES). **Explicitly silent** on post-pipe adjunct prose in the same material field. Precedence line allows "summarisation" to drop non-table prose. |
| **GAM authoring** | **Correct** — adjunct after pipe table is valid GAM output per LD-TABLE-FIDELITY author role. |

**Conclusion:** **Design Page compose contract issue** (pack §13 prompt + `LD-TABLE-FIDELITY` preserve role), **not** GAM regression, **not** renderer.

### 3.5 Smallest viable fix surface

| Surface | Change |
|---------|--------|
| **`LD-TABLE-FIDELITY` preserve role** | One clause: when upstream `materials.<table_key>` contains pipe table **and** trailing instructional prose (e.g. `*Instructions:*`), copy **full material string** verbatim — adjunct is part of L4 fidelity, not L7 shorten-able prose. |
| **Pack §13 Design Page** | Mirror clause in `promptTemplate` / compose block — "do not strip post-table instructions from `analysis_table` / `comparison_table` fields". |
| **Out of scope** | `app.js` compose rewrite, moving instructions to separate material type, GAM changes (GAM already authors correctly). |

### 3.6 Acceptance test

On `EV-38H-AFTER`:

1. A2 and A3 `materials.analysis_table` on page **include** `*Instructions:*` blocks matching GAM.  
2. Pipe rows unchanged vs `EV-38G-AFTER` (no regression on V-01 table family).  
3. Char length page ≥ GAM for each table material (minus whitespace-only diffs).

---

## 4. H-03 Analysis — Evaluation Harness Fidelity

### 4.1 `EV-38G-AFTER` capture review

**Script:** `ev-38g-inflation-pipeline-capture-once.mjs`

| Step | Production workflow step | In 38G harness? | Artefact persisted? |
|------|--------------------------|-----------------|---------------------|
| Brief | Workflow brief | ✓ (inline `BRIEF`) | ✓ `run-log.json` |
| Normalize content | §3 | ✗ | ✗ |
| **Model knowledge** | **§4** | **✗** | **✗** `knowledge_model.json` |
| Define learning outcomes | §4 (LO) | ✓ (synthetic one-shot) | ✗ (inline in script only) |
| Design learning activities | §5 DLA | ✓ | ✓ `EV-38G-AFTER-dla-learning-activities.json` |
| Generate activity materials | §6 GAM | ✓ | ✓ `EV-38G-AFTER-gam.txt` |
| Design page | §13 | ✓ | ✓ `EV-38G-AFTER-design-page.json` |
| Run metadata | — | ✓ | ✓ `EV-38G-AFTER-run-log.json` |

**Captured:** DLA, GAM, design page, run log (4 files).  
**Omitted:** `knowledge_model`, `normalized_content`, `learning_outcomes` file, `learning_content`, assessment artefacts.

### 4.2 Current vs intended evaluation path

```text
CURRENT (EV-38G harness):
  Brief → LO (synthetic JSON) → DLA → GAM → Design Page

INTENDED (production-aligned evaluation):
  Brief → [Normalize] → Model Knowledge → LO → DLA → GAM → Design Page
```

Same limitation documented in [38G-5 §capture note](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) and [38G-6 §3.1](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md). **`EV-38E10` harness shares the same omission** — not introduced by 38G.

### 4.3 Does KM omission affect evaluation validity?

| Claim type | Affected? | Example on anchor |
|------------|-----------|-------------------|
| DLA→GAM→page **fidelity** (H-01, H-02) | **No** | Spoiler and table trim reproduce with or without KM artefact |
| **KM exploitation** / misconception surfacing | **Yes** | Brief mentions GDP deflator, policy communication — **absent** from DLA/GAM/page (38G-5 Pattern E) |
| LO→DLA cognitive arc | **Partially** | LOs synthesised without KM concept mappings; cannot test full KM→LO→DLA chain |
| Regression vs frozen comparators | **Low** | Comparators (38F, 38E10) also lack KM in harness |

**Severity:** **Medium** for programme evaluation and KM-claims testing; **Low** for 38H realisation fixes (H-01/H-02 are downstream of authored DLA/GAM).

### 4.4 Smallest viable fix surface

| Surface | Change |
|---------|--------|
| **Harness script** (`ev-38h-*` or extend pattern) | Add **Model Knowledge** step; persist `knowledge_model.json`; pass KM into DLA/GAM/LO prompts per pack. Document harness contract in 38H-4. |
| **Out of scope** | KM schema expansion, changing DLA-WB-21 semantics, production `app.js` workflow UI. |

### 4.5 Acceptance test

1. `EV-38H-AFTER` artefact set includes **`knowledge_model.json`** (or equivalent frozen file).  
2. Run log records KM step execution and char counts.  
3. DLA/GAM prompts receive KM JSON (logged or hash-verified).  
4. Optional: GDP deflator or brief-mentioned constructs appear in KM output (exploitation **measurable** — not required for harness PASS).

---

## 5. H-04 Analysis — Evaluate-Level Practice

### 5.1 Trace across chain

| Layer | Evaluate LO evidence |
|-------|----------------------|
| **Learning outcomes** (synthesised) | Fourth outcome: *"Evaluate various strategies to manage and mitigate the effects of inflation on personal budgets."* |
| **DLA** | **A4 only** maps Evaluate LO (plus all others). **No** activity with sole Evaluate mapping. **No** `modelling_note` in any `required_materials`. A3 title says "Evaluating" in learner_task heading but maps **Assess** LO (household impacts). |
| **GAM** | No `modelling_note` material. A4 `prompt_set` asks strategy questions; `consolidation_summary` **asserts** strategies (spoiler). |
| **Page** | Same as GAM; Evaluate practice = capstone write task **competed with spoiler body**. |

### 5.2 Comparator: `EV-38E10-AFTER`

| Aspect | 38E10 | 38G |
|--------|-------|-----|
| Activity count | 4 | 4 |
| Dedicated Evaluate activity | **A3** — `modelling_note` + `prompt_set` | **None** |
| Evaluate LO mapping | A3 (single) + A4 (all) | A4 only (all LOs) |
| `modelling_note` | **Yes** (M7) | **Absent** |

38G improved many ACM components vs 38F but **did not restore** the 38E10 evaluate-activity pattern.

### 5.3 Failure class

| Class | Applies? | Reason |
|-------|----------|--------|
| **A. Fidelity issue** | **No** | Nothing authored for evaluate practice was dropped at compose — `modelling_note` was **never specified** in DLA |
| **B. Activity-design issue** | **Yes — primary** | DLA arc compresses Evaluate into capstone; missing dedicated evaluate episode |
| **C. Outcome-set issue** | **No** | Four LOs are coherent; failure is **activity mapping**, not bad outcomes |
| **D. Evaluation artefact limitation** | **Partial** | Harness does not enforce 38E10 arc; synthetic LOs may weaken arc pressure |

### 5.4 Recommendation

**Defer H-04 to a future pedagogy / DLA-arc workstream** — not 38H core.

**Rationale:** 38H charter is **DLA → GAM → Page preservation**. H-04 is **upstream design** (which activities exist), not mis-realisation of existing instructional components. Fixing H-01 (spoiler) improves A4 **without** adding evaluate practice. Adding `modelling_note` + dedicated A3 evaluate activity is **DLA pack / arc** work — risks scope expansion and overlaps 38G medium-term recommendation (38G-6 §7.2).

**Optional monitor:** After H-01 fix, re-score A4 practice component on 38H-5 trace — expect **partial** improvement only.

---

## 6. Layer Ownership Matrix

| Issue | Genuine defect | Owner | Fix surface | 38H phase |
|-------|----------------|-------|-------------|-----------|
| Spoiler consolidation (A4) | Yes | GAM generation | Pack §6 anti-spoiler clause | 38H-2 |
| Table `*Instructions:*` dropped (A2, A3) | Yes | Design Page compose | Pack §13 + `LD-TABLE-FIDELITY` preserve | 38H-3 |
| KM absent in evaluation runs | Yes | Pipeline harness | Capture script + harness contract doc | 38H-4 |
| Thin Evaluate practice | Yes (pedagogy) | DLA arc | **Deferred** — not 38H | — |
| `prior_knowledge_activation` A2/A3 only | Omission at DLA | DLA generation | **Out of 38H** | — |
| Weak inter-activity transitions | Authoring choice | DLA | **Out of 38H** | — |
| Preambles / cognition / cards / prompts | — | — | **No change needed** — preserved on 38G | — |
| Renderer / layout | — | — | **No change needed** — no evidence of strip | — |

---

## 7. Recommended 38H-2 Scope (GAM — H-01)

**In scope:**

- Pack §6: anti-spoiler `consolidation_summary` discipline when learner must write consolidation (scaffold vs completed essay).  
- Prompt-surface test for new/extended fail rule.  
- Observation note `38H-2-gam-consolidation-discipline.md`.

**Out of scope:**

- Changing `consolidation_summary` material type or removing ≥80-word requirement (reframe as **prompted** words, not authored answer).  
- DLA arc / fourth-activity redesign.  
- `app.js` GAM sanitizers (none implicated).

**Dependencies:** None beyond 38H-1.

---

## 8. Recommended 38H-3 Scope (Design Page — H-02)

**In scope:**

- `lib/ld-table-fidelity.js` PRESERVE_LINES: full material field including post-pipe adjunct.  
- Pack §13 Design Page: matching compose instruction.  
- Observation note `38H-3-design-page-material-fidelity.md`.

**Out of scope:**

- Splitting instructions into separate material types.  
- GAM changes (already correct).  
- `app.js` unless compose augmentation path proven insufficient in 38H-5 ( **not expected** ).

**Dependencies:** None beyond 38H-1; **may parallel** 38H-2.

---

## 9. Recommended 38H-4 Scope (Harness — H-03)

**In scope:**

- New or extended inflation capture script for 38H evaluation runs.  
- Persist `knowledge_model.json`; wire KM into LO/DLA/GAM prompts.  
- Document harness contract (current vs intended path).  
- Observation note `38H-4-evaluation-harness-fidelity.md`.

**Out of scope:**

- KM schema changes.  
- Mandating KM-driven content in DLA (measurement only on 38H-5).  
- Production workflow UI changes.

**Dependencies:** None beyond 38H-1; **may parallel** 38H-2 / 38H-3.

---

## 10. Risks and Hold Conditions

### 10.1 Hold conditions (do not regress)

| Hold | Monitor on 38H-5 |
|------|------------------|
| V-01 table family | Pipe tables remain valid markdown pipes |
| V-05 scenario Material | A3 scenario body preserved |
| 38E-8/9 mandatory types | worked_example, sample_output, consolidation_summary, scenario, tables |
| 38G-3 ACM rows | DLA-WB-20/21, GAM-WB-21 present in pack tests |
| Preservation V-13 | `workbook-contract-prompt-surface.test.js` green |
| Frozen comparators | Do not overwrite EV-01 … EV-38G |

### 10.2 Implementation risks

| Risk | Mitigation |
|------|------------|
| Anti-spoiler rule **conflicts** with GAM-WB-06 ≥80-word body | Reframe rule: ≥80 words of **scaffold prompts**, not model answer |
| Table adjunct fix **duplicates** `prompt_set` | Acceptable — adjunct is table-local; duplication better than loss |
| KM in harness **changes** DLA/GAM outputs vs EV-38G | Capture `EV-38H-AFTER` separately; fidelity trace compares H-01/H-02 fixes, not full byte identity |
| Scope creep via H-04 | **Explicitly deferred** in charter amendment if needed |

### 10.3 What does NOT need changing

- `app.js` (default charter position)  
- Renderer / layout pipeline  
- KM or LO JSON schemas  
- ACM model ([38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md))  
- DLA-WB-20/21 · GAM-WB-21 rows (hold)  
- GAM realisation for worked_example, sample_output, task_cards, prompt_set, checklist, scenario (working)  
- Design Page field preservation for preambles and cognition fields (working on 38G)  
- H-04 evaluate arc (defer)

---

## 11. Success Criterion Check

| Question | Answer |
|----------|--------|
| Exactly what must be changed? | GAM anti-spoiler consolidation; Design Page table-adjunct preserve contract; harness KM step |
| Exactly where? | Pack §6 · Pack §13 + `ld-table-fidelity.js` · evaluation capture script |
| Exactly what does NOT need changing? | See §10.3; H-04 deferred |
| Scope reduced or expanded? | **Reduced** — H-04 excluded; three targeted surfaces only |

**Slice 38H-1:** **COMPLETE**  
**Next:** **38H-2** / **38H-3** / **38H-4** (may run in parallel per charter)
