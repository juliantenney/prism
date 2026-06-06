# 38P-6A — GAM → Page instructional fidelity investigation

**Date:** 2026-06-05  
**Status:** **COMPLETE** (investigation only — no code changes)  
**Type:** Causal trace — generation vs composition vs render  
**Evidence run:** `EV-38M-AFTER` (latest full inflation pipeline capture, 2026-06-05T14:10:09Z)  
**Predecessors:** [38P-4-render-role-precedence-implementation.md](38P-4-render-role-precedence-implementation.md) · [38P-5-role-fidelity-validation.md](38P-5-role-fidelity-validation.md)

---

## Executive summary

**Question:** Is remaining learner-experience degradation caused by weak **GAM generation** (A) or **loss during Page composition** (B)?

**Answer:** For the **merged pipeline path** (38M merge + 38P role precedence), **body and role survival are no longer the dominant bottleneck**. The evidence shows:

| Layer | Verdict |
|-------|---------|
| **Page composition (raw LLM output)** | **Was** the severe loss stage (A4 pre-merge **7%** aggregate body ratio) — **G2/G3** |
| **38M merge overlay** | Restores **100%** GAM body length on all 20 materials — converts G2/G3 → **G1** |
| **38P-4 render** | Eliminates duplicate stub blocks; post-38P replay yields **`proofOk: true`** and **`roleOk: true`** |
| **GAM generation** | Produces **all** DLA-specified instructional roles with substantive bodies (700–1,700 chars) — **not G4** for core roles |
| **Remaining UX gap** | **Worksheet-oriented learner experience** driven by **instructional design shape** (DLA→GAM modular table/checklist packages) and **presentation semantics** (“Worksheet” headings for practice tables), not by post-merge omission |

**Dominant bottleneck today:** **Instructional generation architecture (DLA → GAM)**, not Page composition body loss — *provided the 38M merge and 38P render paths are applied*.

**Critical caveat:** Raw Design Page compose **without merge** still thins bodies to stubs/shells. Manual inflation viewing of **compose-only** or **pre-38P render** artefacts will still feel worksheet-oriented and duplicate-heavy even when GAM is rich.

**Scope note:** This inflation workbook has **four activities (A1–A4)**. No A5 artefact exists in `EV-38M-AFTER`.

---

## Evidence base

| Artefact | Path | Role in investigation |
|----------|------|------------------------|
| Knowledge Model | `…/38m/…/EV-38M-AFTER-knowledge-model.json` | 7 concepts — upstream conceptual scaffold |
| DLA | `…/EV-38M-AFTER-dla-learning-activities.json` | Activity specs + `required_materials` obligations |
| GAM | `…/EV-38M-AFTER-gam.json` | 20 generated materials (authoritative bodies) |
| Page (composed) | `…/EV-38M-AFTER-design-page.json` | Post-merge page JSON (`gam_materials_preserve_applied: true`) |
| Page (raw compose) | `…/EV-38M-AFTER-design-page-raw.txt` | LLM output **before** 38M merge |
| Render (stored) | `…/EV-38M-AFTER-render.html` | Captured at 38M-5 — **pre-38P-4** renderer |
| Run log | `…/EV-38M-AFTER-run-log.json` | Pre/post merge fidelity metrics |
| 38I-4 reference | `…/38i/…/38I-4-a4-evaluate-learner-episode.md` | Target Evaluate episode depth/shape |

**Replay checks (investigation scripts, not production code):**

- Post-38P render of merged page: **`proofOk: true`**, **`roleOk: true`**
- Stored `EV-38M-AFTER-render.html`: **`roleOk: false`** (duplicate stub headings visible)

---

## Instructional role survival matrix

Legend: **GAM** = material in upstream GAM JSON · **Page** = substantive body on merged page JSON · **Render (stored)** = visible in 38M-5 HTML · **Render (38P)** = visible after 38P-4 role precedence replay

| Role family (focus) | A1 | A2 | A3 | A4 |
|---------------------|----|----|----|----|
| **Worked examples / model reasoning** | GAM ✓ Page ✓ Render ✓ / 38P ✓ | GAM ✓ Page ✓ Render ✓ / 38P ✓ | GAM ✓ (M9 analytic pass) Page ✓ Render ✓ as “Worked analytic pass” / 38P ✓ | GAM ✓ (M15 weak/strong) Page ✓ Render stored: stub **+** body / 38P ✓ single “Worked judgement” |
| **Model answers / sample output** | GAM ✓ Page ✓ Render ✓ | GAM ✓ Page ✓ Render ✓ | — | — |
| **Guided reasoning / judgement tables** | — | GAM ✓ (classification table) Page ✓ Render as **“Worksheet”** | GAM ✓ (analysis table) Page ✓ Render as **“Worksheet”** | GAM ✓ (M16 full table) Page ✓ Render stored: shell **+** full / 38P ✓ “Guided judgement table” |
| **Scenario / decision context** | — | — | GAM ✓ Page ✓ Render ✓ | GAM ✓ (M13 strategy menu) Page ✓ Render ✓ |
| **Evaluative structures** (criteria, checklist, template) | GAM ✓ Page ✓ Render ✓ | GAM ✓ Page ✓ Render ✓ | GAM ✓ Page ✓ Render ✓ | GAM ✓ Page ✓ Render ✓ / 38P ✓ |
| **Transfer structures** | — | — | — | GAM ✓ Page ✓ Render ✓ / 38P ✓ |
| **Misconception repair** (weak vs strong) | — | — | — | GAM ✓ in M15 Page ✓ Render stored: **Modelling Note stub + body** / 38P ✓ canonical only |
| **Consolidation / closure** | — | — | — | GAM ✓ Page ✓ Render ✓ / 38P ✓ |

### A5

Not applicable — inflation workbook terminates at A4 Evaluate capstone.

---

## Activity-by-activity trace

### A1 — Understand (CPI vs GDP deflator)

| Stage | Finding |
|-------|---------|
| **DLA** | Obliges concept text, worked example, sample output, verification checklist (M1–M4) |
| **GAM** | 4 materials; 1,459–1,713 chars each; stepwise worked thinking present |
| **Page pre-merge** | Concept + checklist **omitted** (0% ratio); worked example **98%** — **G2/G3** |
| **Page post-merge** | All four at **100%** ratio — **G1** |
| **Render** | All roles visible; duplicate alias keys (`concept_text` + `concept_exposition`) inflate heading noise pre-38P |
| **UX shape** | Exposition + worked example + model answer + checklist — **not table-first** |

### A2 — Apply (CPI calculation)

| Stage | Finding |
|-------|---------|
| **DLA** | Worked calculation, model calculation, **practice/classification table**, checklist |
| **GAM** | Full worked steps + completed sample + learner table scaffold (1,184 chars) |
| **Page pre-merge** | Classification table + checklist **omitted** (0%) — **G3** |
| **Page post-merge** | **100%** on all materials — **G1** |
| **Render** | Table material labelled **“Worksheet”** — learner-facing frame is worksheet-oriented despite full GAM body |
| **UX shape** | **Table-centric Apply** by design (DLA specifies `classification_table` practice) |

### A3 — Analyse (household inflation impact)

| Stage | Finding |
|-------|---------|
| **DLA** | Worked analytic pass, analysis table, Maya scenarios, checklist |
| **GAM** | All four materials present (610–1,313 chars); distribution lens language in M9 |
| **Page pre-merge** | Worked pass + scenario **0%**; table **99%** — **G3** |
| **Page post-merge** | **100%** char ratio; `substantive: false` on some rows due to **marker phrasing**, not length loss |
| **Render (stored)** | **Ordering regression**: checklist h4 precedes worked pass (duplicate alias keys bypass `materials_order`) |
| **Render (38P)** | Correct role sequence when role precedence active |
| **UX shape** | **Worksheet + table completion** dominates; analytic pass present but framed alongside “Worksheet” |

### A4 — Evaluate (household strategy capstone)

| Stage | Finding |
|-------|---------|
| **DLA** | Full Evaluate episode obligations: scenario menu, criteria, weak/strong modelling, guided table, template, checklist, transfer, consolidation (M13–M20) |
| **GAM** | **8 materials, 7,716 chars total**; M15 contains weak/strong contrast; M16 full guided table with Strategy A–E rows |
| **Page pre-merge (raw compose)** | **Aggregate 7%** — stubs only: modelling_note ~273 chars (bullet slogans), decision_table empty shell, transfer/consolidation heavily cut — **G2/G3** |
| **Page post-merge** | **100%** char ratio on all capstone keys; GAM bodies restored including `worked_judgement_weak_strong`, `guided_judgement_table` |
| **Render (stored)** | **Duplicate role failure**: Modelling Note stub, Decision Table shell, Template alias **and** authoritative bodies — **`roleOk: false`** |
| **Render (38P replay)** | Single authoritative headings: Scenario → Worked judgement → Guided judgement table → Template → Checklist → Consolidation → Transfer — **`roleOk: true`** |
| **vs 38I-4 target** | GAM modules cover role **types** but not **integrated narrative depth** (perspectives, multi-step exposition, pause-and-write moves) of 38I-4 episode doc |

---

## Compression and omission analysis

### Quantified GAM → Page (pre-merge vs post-merge)

| Activity | GAM materials | Pre-merge aggregate ratio | Post-merge aggregate ratio | Interpretation |
|----------|---------------|---------------------------|----------------------------|----------------|
| A1 | 4 | 56% | **100%** | Compose omitted concept + checklist; merge restored |
| A2 | 4 | 54% | **100%** | Compose omitted table + checklist; merge restored |
| A3 | 4 | 30% | **100%** | Compose omitted worked pass + scenario; merge restored |
| A4 | 8 | **7%** | **100%** | Compose replaced Tier-A with stubs/shells; merge restored |

**Pre-merge:** **15/20** materials show `severe_compression` (ratio &lt; 50%).  
**Post-merge:** **15/15** formerly lost materials restored to **100%** ratio.

### A4 capstone — raw compose vs GAM (illustrative)

| Material | GAM len | Raw compose pattern | Post-merge |
|----------|---------|---------------------|------------|
| M15 modelling / weak-strong | 1,082 | ~273-char bullet stub (“Weak Judgement: slogans…”) | Full 1,082-char GAM body on `worked_judgement_weak_strong` |
| M16 decision / guided table | 1,542 | Empty shell table (headers only) | Full 1,542-char guided table |
| M17 template | 1,352 | ~345-char scaffold fragment | Full 1,352-char memo template |
| M19 transfer | 752 | Omitted (0%) | Full 752 chars |
| M20 consolidation | 738 | ~230-char synopsis | Full 738 chars |

### Structural element survival (A4 GAM content scan)

| Structure | In GAM? | Survives post-merge Page? | Visible post-38P Render? |
|-----------|---------|---------------------------|-------------------------|
| Weak + strong judgement contrast | ✓ M15 | ✓ | ✓ |
| Strategy A–E scenario menu | ✓ M13 | ✓ | ✓ |
| Guided ranking table + hints | ✓ M16 | ✓ | ✓ |
| Criteria exposition (≥3 criteria) | ✓ M14 | ✓ | ✓ (not in role render plan — activity-row/criteria path) |
| Transfer ≥80 words | ✓ M19 | ✓ | ✓ |
| Consolidation synthesis | ✓ M20 | ✓ | ✓ |
| 38I-4-style narrative perspectives | ✗ | ✗ | ✗ — **never generated** |

### Render presentation (worksheet-oriented UX)

Even when bodies are **G1 preserved**:

- A2/A3 table materials render under h4 **“Worksheet”** (registry `practice_table` heading)
- DLA learner tasks explicitly instruct “Complete the analysis table” / “classification table”
- Checklist blocks appear early when alias keys bypass ordering (stored render)

This explains **worksheet-oriented feel despite proofOk/roleOk passing** on the corrected pipeline.

---

## Loss-locus classification (G1–G4)

| Code | Meaning | Count (EV-38M-AFTER, post-merge view) | Examples |
|------|---------|---------------------------------------|----------|
| **G1** | Generated and preserved end-to-end | **20/20** materials at 100% char ratio after merge | A4 worked judgement, guided table, transfer |
| **G2** | Generated then compressed at Page compose | **0** post-merge (was ~5 pre-merge partial) | A1 worked example 98% pre-merge |
| **G3** | Generated then omitted/thinned at compose, **restored by merge** | **15** pre-merge severe losses → G1 after merge | A4 Tier-A stubs, A3 worked pass |
| **G4** | Never generated by GAM | **Episodic/narrative structures** vs modular materials | 38I-4 multi-step perspective exposition; integrated “pause and write” arc |

**Important distinction:** Some G1 rows show `substantive: false` in 38M metrics (A3 scenario markers, A4 marker literals) due to **phrasing variance in GAM**, not body omission — a **generation quality** issue, not compose loss.

---

## Dominant bottleneck assessment

| Layer | Contribution to UX gap | Evidence |
|-------|------------------------|----------|
| **KM** | Low — provides 7 concepts | Concepts present; does not drive episode-shaped exposition |
| **DLA** | **High** — shapes modular table/checklist activity design | Every activity specifies tables/checklists; A4 task list is table-completion sequenced |
| **GAM** | **Medium–High** — fulfils DLA specs but not 38I-4 depth | 20/20 materials generated with substantive bodies; lacks narrative integration and some marker literals |
| **Page composition (raw)** | **High pre-merge**, **mitigated post-38M** | A4 7% pre-merge; 100% post-merge |
| **Page composition (merged JSON)** | **Low** (bodies present) | `fidelityMetrics` 100% ratios |
| **Render (pre-38P)** | **High** for role UX | Duplicate stubs; worksheet headings; ordering regression |
| **Render (post-38P)** | **Low** for role duplication | `roleOk: true`; authoritative headings only |

### Answer to A vs B

| Hypothesis | Supported? |
|------------|------------|
| **A — Weak GAM generation** | **Partially.** GAM generates all required **role types** with substantive modular content. Weakness is **instructional shape and depth** (table-first packages, short consolidation, no 38I-4 narrative arc), not absence of materials. |
| **B — Loss at Page composition** | **Yes for raw compose path** (G2/G3 dominant pre-merge). **No for merged page JSON** after 38M — bodies are preserved. |

**If the user views compose-only or unmerged pages:** B dominates.  
**If the user views merged page + 38P render:** A (instructional generation shape) + presentation semantics dominate.

---

## Recommendation

1. **Do not reopen 38M merge logic** for body survival — investigation confirms merge closes the L4 cliff on this run.

2. **Treat 38P-4/38P-5 as required path** for learner-facing output — stored `EV-38M-AFTER-render.html` is pre-38P and misrepresents current role fidelity.

3. **Next investment area: upstream instructional generation (DLA + GAM)**, not Page body preservation:
   - Shift DLA material specs from table-completion-first to **episode-shaped sequences** aligned with 38I-4
   - GAM prompts: require narrative perspective blocks, criteria construction moves, and integrated weak/strong exemplars — not only modular stubs
   - Consider `practice_table` presentation heading (“Analysis table” / “Guided comparison”) vs generic “Worksheet”

4. **38P-6 proof run** should replay with **38P merge + render + dual validation** and capture new render artefact — expect `proofOk` + `roleOk` true while **qualitative** comparison to 38I-4 still shows depth gap.

5. **Manual inflation workflow audit:** Confirm UI applies `applyGamMaterialsToComposedPage` before display; if users inspect raw compose JSON/HTML, they will correctly perceive “worksheet stubs” that merged JSON no longer contains.

---

## Risks and follow-on work

| Item | Owner |
|------|-------|
| 38P-6 formal proof replay (`EV-38P-AFTER`) | 38P-6 |
| DLA/GAM episode-depth sprint (38I alignment) | Future — upstream generation |
| Registry heading review for `practice_table` | Future — presentation |
| A5 not in scope for this workbook | N/A |

---

## Investigation constraints ( honoured )

- No production code modified  
- No renderer, merge, or validator changes  
- Evidence-only causal trace from `EV-38M-AFTER` artefacts and controlled replays
