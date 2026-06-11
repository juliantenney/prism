# Sprint 41 Framework Impact Report

## Purpose

This report records the **Framework Impact Validation** phase for Sprint 41: determining whether the Educational Quality Framework (EQF) prompt integration produces **materially different outputs** when the updated prompt architecture is used.

This is distinct from the earlier infrastructure validation (`sprint-41-validation-report.md`), which confirmed:

- EQF prompt contract, step manifestation, evaluator, and diagnostics are implemented
- Pre–Sprint 41 benchmark artefacts score sensibly against the evaluator
- Human review largely aligns with heuristic dimension flags

**This phase asks a different question:** Do outputs generated *after* copying Sprint 41-augmented prompts show observable improvement on the eight EQF dimensions compared with equivalent pre–Sprint 41 outputs?

### Architectural constraint

PRISM does not execute workflows. Users copy prompts and run them externally. Impact validation therefore depends on **manually saved outputs** that can be attributed to Sprint 41 prompt architecture.

### Outcome of this phase

**Impact validation cannot yet be completed.**

A repository-wide search found **no Sprint 41–attributed generated outputs**. There is no `captures/` directory (referenced only as an example path in diagnostics documentation). No saved artefact, prompt export, or HTML/JSON capture contains the Sprint 41 runtime marker `EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)`.

Per sprint instructions: outputs were not invented. Before/after comparisons are documented with **baseline (before) evidence only**; **after** columns remain pending manual capture.

---

## Validation Cases

Five representative cases were identified covering the target learning-design profiles. Each row documents the source brief context, pre–Sprint 41 baseline artefact, and the status of a Sprint 41 counterpart.

| Case | Learning design profile | Source brief / workflow context | Pre–Sprint 41 artefact | Generation era (approx.) | Sprint 41 artefact | Status |
| ---- | ----------------------- | -------------------------------- | ---------------------- | -------------------------- | ------------------ | ------ |
| **VC-1 Inflation** | Self-study workbook / introductory economics | Inflation measurement (CPI vs GDP deflator); Sprint 38-M proof workbook | `docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-workbook.md` | 2026-06 (Sprint 38-M) | — | **Missing** |
| **VC-1 alt** | Facilitated workshop (inflation) | First-year economics workshop fixture | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | Fixture (pre-41) | — | **Missing** |
| **VC-2 Marx** | Self-study learner page | Karl Marx life/ideas self-directed study | `tests/fixtures/page-render/marx-self-study-page.json` | Fixture (Sprint 30–38 lineage) | — | **Missing** |
| **VC-2 alt** | Live Marx pipeline capture | Sprint 30 PEL probe — composed page + render | `docs/.../sprint-30/.../live-artefacts/marx-page.json`, `marx-render.html` | 2026-05 (Sprint 30) | — | **Missing** |
| **VC-3 Feedback literacy** | Feedback on academic writing | Sprint 40 validation exemplar (“Giving Effective Feedback on Academic Writing”) | `docs/educational design/framework/sprint-40-validation-report.md` (narrative only; **no JSON/HTML fixture in repo**) | Sprint 40 manual generation | — | **Missing** |
| **VC-4 STEM / procedural** | Thin procedural DLA | Workflow brief — procedural Marx DLA output shape | `tests/fixtures/workflow-brief/marx-dla-procedural-output.json` | Fixture | — | **Missing** |
| **VC-5 Discussion / evaluation** | Misconception discussion | Climate change misconceptions — structured discussion + formative check | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Fixture | — | **Missing** |

### Sprint 41 output collection — search performed

| Search | Result |
| ------ | ------ |
| `docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/` | Implementation docs, context extracts, validation report — **no generated outputs** |
| `captures/` at repo root | **Directory does not exist** |
| Grep for `EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)` in `docs/`, `tests/` | **No matches** in saved artefacts |
| Git history for artefacts since 2026-06-11 | **No commits** adding post–Sprint 41 generation captures |
| Agent / sprint working files | **No attributed captures** |

### Required capture metadata (for each case when available)

When Sprint 41 outputs are produced, each capture should record:

| Field | Example |
| ----- | ------- |
| Prompt source | PRISM workflow step + step ID (e.g. `step_design_page`) |
| EQF marker present | Confirm `EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)` in copied prompt |
| Output artefact | Saved JSON page, DLA, or exported HTML path under `captures/sprint-41-impact/` |
| Generation method | External LLM (model name), manual paste/save |
| Date generated | ISO date |
| Paired baseline | Path to pre–Sprint 41 artefact from table above |

**Suggested storage:** `captures/sprint-41-impact/<case-id>-after.json` (or `.html`) with a sibling `captures/sprint-41-impact/<case-id>-metadata.json`.

---

## Before vs After Comparisons

Because no Sprint 41 outputs exist, dimension tables show **baseline (before) only**. **After** and **Change** are marked *Pending capture*.

Dimension key: **Y** = evaluator present, **N** = absent.

Evaluations run: `node tools/evaluate-educational-quality-framework.js <artefact>` (threshold 5/8).

---

### Inflation

**Baseline A — self-study workbook (VC-1 primary)**

| Field | Value |
| ----- | ----- |
| Artefact | `EV-38M-AFTER-workbook.md` |
| Score | **8/8** |
| Warnings | none |

| Dimension | Before | After | Change |
| --------- | ------ | ----- | ------ |
| Learner Journey | Y | *Pending* | — |
| Understanding | Y | *Pending* | — |
| Capability | Y | *Pending* | — |
| Judgement | Y | *Pending* | — |
| Independence | Y | *Pending* | — |
| Metacognition | Y | *Pending* | — |
| Learning Success | Y | *Pending* | — |
| Cognitive Activity | Y | *Pending* | — |

**Evaluator observations (before):** Strongest baseline in corpus — progressive activities, worked examples, self-check, transfer cues, explicit learning-success language. High bar for Sprint 41 to improve upon.

**Human observations (before):** Coherent self-study workbook with fading scaffolding and evaluative tasks; reads as developmental journey, not activity list.

**Baseline B — facilitated workshop page (VC-1 alt)**

| Artefact | `ld-inflation-workshop-page.json` | Score | **5/8** |

| Dimension | Before | After | Change |
| --------- | ------ | ----- | ------ |
| Learner Journey | Y | *Pending* | — |
| Understanding | Y | *Pending* | — |
| Capability | Y | *Pending* | — |
| Judgement | Y | *Pending* | — |
| Independence | N | *Pending* | — |
| Metacognition | N | *Pending* | — |
| Learning Success | N | *Pending* | — |
| Cognitive Activity | Y | *Pending* | — |

**Human observations (before):** Workshop/facilitator framing; judgement via compare/interpret prompts; independence and learning success appropriately weak for facilitated profile.

**Sprint 41 after artefact:** Not available. Re-run inflation self-study workbook through full LD pipeline with Sprint 41 prompts (Construct Sequence → DLA → GAM → Design Page) and save composed page JSON or render HTML.

---

### Marx

**Baseline — self-study page fixture (VC-2 primary)**

| Artefact | `marx-self-study-page.json` | Score | **7/8** |

| Dimension | Before | After | Change |
| --------- | ------ | ----- | ------ |
| Learner Journey | Y | *Pending* | — |
| Understanding | Y | *Pending* | — |
| Capability | Y | *Pending* | — |
| Judgement | Y | *Pending* | — |
| Independence | Y | *Pending* | — |
| Metacognition | Y | *Pending* | — |
| Learning Success | N | *Pending* | — |
| Cognitive Activity | Y | *Pending* | — |

**Evaluator observations (before):** Missing learning_success only; modelled comparison → independent application arc detected.

**Human observations (before):** Genuine judgement (`Check your thinking`, defensible comparison); scaffolding fades A2→A4; study_tips hint at progress but lack explicit learning-success synthesis.

**Baseline alt — Sprint 30 live page**

| Artefact | `marx-page.json` | Score | **5/8** | Missing: learner_journey, independence, learning_success |

**Sprint 41 after artefact:** Not available. Re-generate Marx self-study brief using same workflow with Sprint 41-augmented Design Page / DLA steps.

---

### Feedback Literacy

**Baseline**

| Artefact | Sprint 40 validation report (narrative exemplar only) |
| Score | Not machine-evaluable (no fixture file) |

| Dimension | Before (Sprint 40 human review) | After | Change |
| --------- | ------------------------------- | ----- | ------ |
| Learner Journey | Present (per Sprint 40) | *Pending* | — |
| Understanding | Present | *Pending* | — |
| Capability | Present | *Pending* | — |
| Judgement | Present | *Pending* | — |
| Independence | Present | *Pending* | — |
| Metacognition | Present | *Pending* | — |
| Learning Success | Improved via prompt refinement (Sprint 40 narrative) | *Pending* | — |
| Cognitive Activity | Present | *Pending* | — |

**Human observations (before, from Sprint 40 report):** Framework-informed prompting produced visible progress, progressive independence, and learning-success indicators after refinement — but this evidence is **not** paired with a repo fixture or a Sprint 41 re-run.

**Sprint 41 after artefact:** Not available. Generate “Giving Effective Feedback on Academic Writing” through Sprint 41 prompts; save page JSON; run evaluator; compare against a newly captured baseline *without* EQF block if isolating prompt effect.

---

### Additional Cases

#### VC-4 — STEM / procedural (thin DLA)

| Artefact | `marx-dla-procedural-output.json` | Score | **3/8** |

| Dimension | Before | After | Change |
| --------- | ------ | ----- | ------ |
| Learner Journey | N | *Pending* | — |
| Understanding | N | *Pending* | — |
| Capability | Y | *Pending* | — |
| Judgement | Y | *Pending* | — |
| Independence | N | *Pending* | — |
| Metacognition | N | *Pending* | — |
| Learning Success | N | *Pending* | — |
| Cognitive Activity | Y | *Pending* | — |

**Human observations (before):** Intentionally thin procedural shape — useful as **floor** case; Sprint 41 should lift journey, understanding, and metacognition without bloating task count.

#### VC-5 — Discussion / evaluation (climate misconceptions)

| Artefact | `ld-climate-misconception-discussion-page.json` | Score | **5/8** |

| Dimension | Before | After | Change |
| --------- | ------ | ----- | ------ |
| Learner Journey | Y | *Pending* | — |
| Understanding | Y | *Pending* | — |
| Capability | Y | *Pending* | — |
| Judgement | Y | *Pending* | — |
| Independence | N | *Pending* | — |
| Metacognition | N | *Pending* | — |
| Learning Success | N | *Pending* | — |
| Cognitive Activity | Y | *Pending* | — |

**Human observations (before):** Strong evaluation/discussion structure (misconception cards, classification checklist); weak metacognition and learning-success closure — prime candidates for Sprint 41 impact if prompts add lightweight reflection and progress synthesis.

#### Reference — Sprint 38S design-page replay (not in target list but high baseline)

| Artefact | `EV-38S-AFTER-4-design-page-replay.json` | Score | **7/8** | Missing: learning_success only |

---

## Dimension Analysis

Analysis below synthesises **baseline (before) corpus** and infrastructure validation findings. **No after data** exists to measure Sprint 41 prompt impact per dimension.

### Learner Journey

**Baseline pattern:** Strong in self-study exemplars (Marx 7/8, 38M workbook 8/8, 38S replay 7/8); present in workshop overview fixtures; absent in thin procedural DLA.

**Impact hypothesis (untested):** Sprint 41 core prompt line — *“generate a coherent learner-development journey, not disconnected content pages”* — should strengthen journey framing in Design Page and DLA outputs that currently score N on live Marx DLA.

**Cannot confirm impact** without paired regeneration.

### Understanding

**Baseline pattern:** Consistently strong (Y) in all content-designed cases except procedural DLA.

**Impact hypothesis:** Marginal gains possible where understanding is already high; Sprint 41 may improve **depth** rather than **presence** — requires human review, not score alone.

### Capability

**Baseline pattern:** Nearly all non-smoke artefacts score Y via `learner_task` / `expected_output` structure.

**Impact hypothesis:** Sprint 41 unlikely to move capability from N→Y in rich fixtures; may improve **quality of practice tasks** (human review dimension).

### Judgement

**Baseline pattern:** Strong in Marx self-study, climate discussion, 38M workbook; weak in live Marx DLA (evaluator false negative suspected in infrastructure validation).

**Impact hypothesis:** Sprint 41 judgement manifestation lines target compare/evaluate/justify — highest expected lift in procedural/thin cases (VC-4) and DLA steps.

### Independence

**Baseline pattern:** Weakest dimension in workshop/discussion profiles; present only in self-study Marx and 38M workbook.

**Impact hypothesis:** Sprint 41 progressive-independence prompt block should be most visible here — **key impact dimension to watch** in before/after capture.

### Metacognition

**Baseline pattern:** Present in PEL-enriched Marx lineage; absent in inflation workshop and climate discussion.

**Impact hypothesis:** Sprint 41 specifies *lightweight* metacognition — expect +1 dimension in cases scoring N, without intrusive volume. Human review must guard against bloat.

### Learning Success

**Baseline pattern:** Weakest overall — N in Marx self-study (7/8), climate (5/8), most workshop artefacts; Y only in 38M workbook.

**Impact hypothesis:** Sprint 41 explicit learning-success line — *“what they now understand, can do, can judge, and can manage independently”* — targets the most common gap. **Highest priority for impact measurement.**

### Cognitive Activity

**Baseline pattern:** Broad Y across corpus due to evaluator verb breadth; absent only in thinnest fixtures.

**Impact hypothesis:** Score may not move; human review should assess **reasoning depth** vs interface activity (Sprint 41 cognitive-over-interface principle).

---

## Observed Improvements

**None attributable to Sprint 41 prompt integration.**

No post–Sprint 41 artefacts exist for comparison. Infrastructure validation confirmed diagnostics **can** detect dimension differences (e.g. Marx design-quality vs self-study compare: +3 score delta on `--compare`), but that compares **pre-existing fixtures**, not Sprint 41 prompt effect.

---

## No Observable Change

**Not applicable** — impact comparison not performed.

Baseline-only observation: pre–Sprint 41 strong exemplars (38M workbook 8/8, Marx self-study 7/8) already manifest most dimensions. Sprint 41 impact on these cases may be **incremental or nil on evaluator score** even if prompt quality improves — human review and learning_success dimension are critical for marginal cases.

---

## Regressions

**None identified** — no after artefacts to compare.

**Risk note:** If Sprint 41 prompts add framework language without structural enrichment, outputs could become **more verbose without deeper journey or independence**. Human review in capture phase should explicitly check for verbosity regression.

---

## Recommendations

### Prompt Refinements

*(To validate once captures exist — from infrastructure validation, not impact evidence)*

1. Emphasise **learning success closures** in Design Page and self-directed GAM manifestation lines.
2. Require explicit **fading labels** (modelled → guided → independent) in DLA for self-study profiles.
3. Keep metacognition **phrase-based** in generated learner text (`Reflect`, `Check your thinking`) not only schema field names.
4. For workshop profiles, scope independence/learning-success expectations to realistic facilitated outcomes.

### Architectural Changes

1. **Establish `captures/sprint-41-impact/`** with metadata sidecars — process change, not generation logic.
2. **Optional evaluator tuning** after first capture pass (underscore field names, learning_success vs metacognition boundary) — see `sprint-41-validation-report.md` false negatives.
3. **Feedback literacy fixture** — export Sprint 40 exemplar to JSON for machine-evaluable before/after pairing.
4. Longer term: user paste/import path for external outputs (documented in `educational-quality-diagnostics.md` as out of scope for Sprint 41).

### No Further Action

- EQF runtime prompt contract, manifestation map, evaluator, and CLI tooling — ready for capture phase.
- Pre–Sprint 41 baselines documented above — sufficient for pairing when after artefacts arrive.

---

## Capture Protocol (to unblock impact validation)

1. **Open PRISM** with Sprint 41 code loaded (EQF module in prompt augmentation chain).
2. **Select validation case** (VC-1 through VC-5).
3. **Copy augmented prompt** for target step(s); verify marker `EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)` in prompt text.
4. **Run externally** (same model/settings as baseline where possible).
5. **Save output** to `captures/sprint-41-impact/<case>-after.json` (or `.html`).
6. **Record metadata** (prompt step, model, date, brief hash).
7. **Evaluate:**
   ```bash
   node tools/evaluate-educational-quality-framework.js <before-artefact> --compare captures/sprint-41-impact/<case>-after.json
   ```
8. **Human review** against judgement, independence, learning success, metacognition lightness, journey coherence.
9. **Update this report** with after columns and final assessment.

Minimum viable capture set: **VC-1 inflation self-study**, **VC-2 Marx self-study**, **VC-4 procedural DLA**, **VC-5 climate discussion** (four cases spanning workbook, exemplar page, thin STEM, discussion).

---

## Final Assessment

### Has Sprint 41 produced observable improvements?

**Unknown — not demonstrated.** No Sprint 41–attributed generated outputs exist in the repository.

### Which dimensions improved most?

**Cannot determine** without after artefacts. Baseline gaps suggest **learning success**, **independence**, and **metacognition** are the dimensions most likely to show lift if prompts are effective.

### Which dimensions remain weak?

In pre–Sprint 41 baselines: **learning success** (most often N), **independence** (N in workshop/discussion), **metacognition** (N outside PEL-enriched content).

### Is further framework integration required?

**Not before impact capture.** Implementation (Slices 1–4) is complete in the working tree. Additional framework **logic** should wait until impact validation establishes whether prompt contract alone is sufficient.

### Can Sprint 41 be considered complete?

| Aspect | Status |
| ------ | ------ |
| Implementation (Slices 1–4) | Complete (pending commit) |
| Infrastructure validation | Complete (`sprint-41-validation-report.md`) |
| **Framework impact validation** | **Blocked — manual captures required** |

### Verdict

## **Further implementation required before validation**

Interpretation: Sprint 41 **impact validation** cannot close until real post–Sprint 41 outputs are captured and compared. This is **not** a request for more EQF code changes — it is a **manual generation and capture gate**.

Once captures exist:

- If dimensions improve on target cases → **Sprint 41 validated successfully** or **validated with recommended refinements**
- If no material change → prompt refinement cycle before further integration
- If regressions (verbosity without depth) → targeted manifestation tightening

---

*Report date: 2026-06-11. Impact validation phase only — no prompts, evaluator, schemas, renderers, or workflow architecture were modified.*

*Related: `sprint-41-validation-report.md` (infrastructure), `educational-quality-diagnostics.md` (CLI usage).*
