# Sprint 103 — Manual Learning Journey brief and validation checklist

**Status:** Ready for human authoring + runtime validation  
**Automation:** Focused preflight passed (see [VALIDATION.md](VALIDATION.md)) — **does not** prove end-to-end learner behaviour  
**Do not** manually edit artefact contracts; automatic proposal must wire produce/reference from Design Page `dependencies`

---

## A. Copyable Learning Journey creation brief

Paste the following into PRISM’s normal Learning Journey Create / brief field. Do **not** add product ids, elicitation ids, artefact contracts, or shell internals.

```text
Title (suggested): Judging Evidence in Undergraduate Clinical Decision-Making

Audience: Second-year undergraduate nursing / allied-health students on a campus clinical-skills module (UK higher education). Learners can follow basic research summaries but often over-weight a single striking study or anecdote when forming a clinical recommendation.

Purpose: Enable learners to form, revise and defend an evidence-informed clinical judgement under uncertainty — distinguishing study design strength, applicability to a named patient scenario, and the limits of what available evidence can support.

Intended outcomes (authoritative — preserve):
1. Distinguish stronger from weaker evidence claims for a routine clinical decision, using study design and applicability (not authority of source alone).
2. Form an initial reasoned recommendation for a named patient scenario and justify it with explicit evidence criteria.
3. Apply a short conceptual framework for evidence appraisal to critique and improve that initial recommendation.
4. Carry out a brief authentic application in a simulated ward-handover context, recording a consequential recommendation and the evidence limits that constrain it.
5. Produce an independent written judgement that uses earlier reasoning without merely repeating it, suitable for formative feedback.

Shared scenario (illustrative / fictional — invent consistent details once and keep them fixed):
A 68-year-old inpatient is being considered for an early step-down from continuous pulse oximetry after a minor procedure. Two short evidence extracts disagree about monitoring duration; local practice varies. Learners must recommend whether monitoring should continue overnight and why.

Learning time: approximately 2.5–3 hours total learner effort across one continuous journey (not one giant resource). Prefer four coherent experiences rather than a single long interactive package.

Educational progression (describe jobs, not product internals):
1. An initial activity where learners make and justify a first recommendation before they meet the full appraisal framework.
2. A structured explanation that introduces a concise evidence-appraisal framework and invites learners to reconsider their earlier stance in light of that framework (without replacing their own wording).
3. An authentic application in context (handover / ward decision) where learners use earlier evidence and their developing stance to record a consequential recommendation and its limits.
4. A formative assessment stop that elicits an independent written judgement, with earlier learner work available for reference while the assessed response remains a separate piece of work.

Continuity expectations (educational, not technical):
- Later experiences should meaningfully name what earlier ones asked learners to do (initial recommendation; framework encounter; situated recommendation).
- Learners should bring forward their own earlier written judgements where educationally useful.
- Prefer a lightweight Learning Journal that makes the developmental arc of those written judgements inspectable.

Constraints:
- Do not commission a single large self-contained interactive teaching resource for the whole journey.
- Prefer the specialised Learning Journey product family suited to explanation, practice, situated application, and formative assessment.
- Keep one shared illustrative evidence corpus across experiences; do not invent conflicting study results later.
- Campus / online self-study is fine; no requirement for live clinical placement.
```

---

## B. Test expectations (for validators — not part of the brief)

These are **observability expectations**. Do not paste them into authoring prompts. Do not hand-edit generated contracts to force them.

| Area | Expectation |
| ---- | ----------- |
| Products | Four supported commissions: **Practice → Expository → Situated Task → Assessment Pack**. No new `interactive` commission. |
| Durations (indicative) | Practice ~25–40 min; Expository ~30–45 min; Situated Task ~35–50 min; Assessment Pack ~25–40 min; total ~2.5–3 h |
| Shared material | One fictional evidence corpus / patient scenario retained across commissions |
| Journal | Enabled with ordered entries covering at least the Practice initial judgement, Situated record, and Assessment constructed response (ids will be `{commission_id}.{elicitation_id}` once Design Page emits them) |
| Dependencies | Later commissions name earlier commission ids where bring-forward is educationally required (e.g. Expository→Practice; Situated→Practice; Assessment→Practice and/or Situated) |
| Continuity at runtime | Earlier saved constructed-text appears **read-only** in later constituents that declare dependencies; later editable fields remain separate |
| Interactive | Standalone Create Interactive still available; this journey must not newly commission Interactive |

Exact commission ids (`c1`…), elicitation ids (`E1`), and workspace ids are **system-generated**. Record whatever ids the Design Page actually emits; do not rewrite them by hand.

---

## C. Ordered manual test checklist

Execute **one** journey end-to-end. Record evidence (screenshot / short note / artefact id) per checkpoint.

### Phase 1 — Design and commissioning

| # | Step | Expected observable | Record |
| - | ---- | ------------------- | ------ |
| 1.1 | Create Learning Journey with §A brief; run Requirements → Progression → Elements → Commissioning → Design Page | Journey Design Page emits **four** supported commissions with product_ids `practice`, `expository`, `situated_task`, `assessment_pack` (order may match educational progression) | Product ids + titles |
| 1.2 | Inspect commissions | No `interactive` among new commissions; each has educational job, journey/component outcomes markers (or equivalent S102 handoff), shared-scenario continuity, and `dependencies` where later work builds on earlier work | Note any Interactive or missing dependency |
| 1.3 | Inspect Learning Journal plan | Journal enabled with entries covering the developmental written judgements (initial / situated / assessment as designed) | Entry titles + artefact_id values |
| 1.4 | Inspect shared material | One consistent illustrative corpus; later specs do not invent conflicting facts | Shared status + short excerpt |

**Stop if 1.1 fails (Interactive commissioned or wrong family):** treat as commissioning-fidelity defect before generating children.

### Phase 2 — Component generation and rendering

| # | Step | Expected observable | Record |
| - | ---- | ------------------- | ------ |
| 2.1 | Create/generate each commission in order | Each child workflow starts commission-native (no unnecessary foundation when LO bind ok) and publishes a learner-ready page | Workflow ids |
| 2.2 | Open unified Learning Journey learner package / shell | Four constituents + overview (+ journal if enabled); titles match commissions | Shell nav labels |
| 2.3 | Spot-check product identity | Practice looks activity-oriented; Expository explanation-led; Situated Task contextual/application; Assessment Pack evidence elicitation — not four clones of Interactive | One-line note per product |

### Phase 3 — Distinctive learner responses

Use unique strings so continuity is unambiguous (examples below — substitute freely).

| # | Step | Action | Expected | Record |
| - | ---- | ------ | -------- | ------ |
| 3.1 | Practice | Type `S103-PRACTICE-JUDGEMENT-ALPHA` (or similar) into the constructed-text / journalable response; **save draft** | Draft save succeeds; text remains after in-page navigation | Exact string + workspace/elicitation if visible |
| 3.2 | Expository | Complete reading / light interactions; if a constructed contribution exists, use a different string; otherwise continue | Expository purpose remains explanatory; earlier Practice string may appear as **read-only** reference if dependencies named Practice | Whether reference chrome present |
| 3.3 | Situated Task | Record `S103-SITUATED-NOTE-BETA` in the situated constructed artefact; save | Text persists in Situated Task | Exact string |
| 3.4 | Assessment Pack | Write `S103-ASSESS-JUDGEMENT-GAMMA` in constructed performance; save | Assessed response is **separate** from Practice/Situated strings | Exact string |

### Phase 4 — Journal, restore, cross-component continuity

| # | Step | Expected observable | Record |
| - | ---- | ------------------- | ------ |
| 4.1 | Open Learning Journal | Entries show saved Practice / Situated / Assessment texts where producers were declared; missing entries show honest missing copy, not fabricated text | Per-entry status + snippet |
| 4.2 | Reload browser; return to Practice | Practice distinctive string restored | Pass/fail |
| 4.3 | Return to Situated Task and Assessment Pack | Their distinctive strings restored | Pass/fail |
| 4.4 | Open Expository (and/or Situated / Assessment) | Earlier Practice (and other declared) texts appear in **read-only** artefact reference regions (`data-lj-artefact-status="resolved"` when present) | Which constituents showed which strings |
| 4.5 | Confirm separation | Editable fields in later components do **not** auto-contain the earlier strings; learner can write new content alongside the reference | Pass/fail |
| 4.6 | Optional: edit Practice text, save, revisit later constituent + Journal | Updated Practice text appears in references/journal; later components’ own fields unchanged | Pass/fail |

### Phase 5 — Product-family / policy checks

| # | Step | Expected | Record |
| - | ---- | -------- | ------ |
| 5.1 | Confirm this journey | No Interactive constituent created for this brief | Pass/fail |
| 5.2 | Smoke standalone Interactive Create (separate from this journey) | Interactive Create still available and starts normally | Pass/fail (do not deep-author) |

---

## D. Pass / fail guidance for the whole journey

**READY for close consideration** when Phases 1–4 largely pass, including AP and Situated Task restore + journal visibility, and cross-component read-only continuity for at least Practice→later constituents.

**Partial / qualified** when commissioning and Practice/Expository continuity pass but AP or Situated Task show a specific capture/journal gap — record as Workstream B defect, not as continuity assembly failure.

**Not ready** if Design Page commissions Interactive for this new journey, or if later constituents never receive automatic `references[]` despite clear `dependencies` (assembly regression).
