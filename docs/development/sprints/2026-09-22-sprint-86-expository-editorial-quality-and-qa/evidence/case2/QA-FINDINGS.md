# Case 02 — Expository QA v0.1 findings

**Case:** S86-C02 · [CASE-02-RECORD.md](CASE-02-RECORD.md)  
**Instrument:** [EXPOSITORY-QA-v0.1.md](../../EXPOSITORY-QA-v0.1.md) — **frozen; not modified this pass**  
**Evaluator mode:** Independent Case 02 judgement first; short Case 01 comparison afterwards  
**Date:** 2026-09-22

---

## A. Context note

| Item | Value |
| ---- | ----- |
| Product | Expository Resource |
| Topic | Semi-structured interview protocol design for small-scale educational research |
| Audience | Early-career academic / postgraduate qualitative interviewers |
| Intended extent | ~15-minute read |
| Actual extent | ~2,759 words |

---

## B. Whole-resource first read (impression)

Reads as a competent procedural explanation with a clear spine (purpose → topics → questions → evidence). Entry into S1 uses a concrete feedback-study example rather than a dramatic hook. Orientation prospectus still precedes the body. Prose is generally clear and non-checklist in substance, but often even in rhetorical weight. Four figures appear; structured-material fallbacks appear beside several of them. Closing restates the purpose–evidence relationship already synthesised in S7.

---

## C. D1–D15 judgements

### D1 — Intellectual journey — **STRONG**

S1–S7 build a coherent craft progression: alignment bridge → translation → wording → probing → whole-protocol proportion → piloting → integration. Later sections depend on earlier distinctions (e.g. S4 probes presuppose S3 wording room; S5 prioritisation returns to S1 chain).

### D2 — Explanatory sufficiency — **SATISFACTORY**

Hard craft distinctions (leading vs open wording; consistency vs responsive probes; interesting vs research-relevant questions) are worked with examples. Some middle sections remain moderately expansive for a 15-minute brief, but not clearly padded into failure. No major handwaving at thresholds.

### D3 — Editorial coherence & reading experience — **CONCERN** (Medium)

**Observation:** Feels assembled from competent instructional modules plus standard orientation furniture more than authored as one chapter experience.  
**Evidence:** Labelled Overview / Learning purpose / Knowledge summary before S1; S7 synthesis + separate Closing; recurring restatement of the RQ→topics→questions→evidence chain across orientation, S1, S5, S7, Closing.  
**Consequence:** Learner repeatedly re-enters the same prospectus frame; reduced sense of a single developing argument.  
**Finding:** `S86-C02-F01`

### D4 — Rhetorical quality & selective emphasis — **CONCERN** (Medium)

**Observation:** Teacherly even cadence; claim→explain→restate patterns; limited structural privileging of threshold sentences.  
**Evidence:** Recurring moves such as “The important point is…”, “This also helps distinguish…”, “These are not independent rules to tick off” followed by near-paraphrase consolidation within the same section (esp. S7). Strong contrasts exist (e.g. “Did you find the feedback useful?” vs behavioural invitation) but sit in the same rhetorical register as routine connective prose.  
**Consequence:** Threshold craft moves do not stand out as much as their intellectual importance warrants.  
**Finding:** `S86-C02-F02`

### D5 — Representation purpose — **CONCERN** (Medium)

Four figures present in a case selected for **low expected visual need**.

| Figure | Warranted? | Explanatory work | Remove would weaken? |
| ---- | ---------- | ---------------- | -------------------- |
| Fig 1 (S1 four-stage spine) | Plausibly yes | Makes alignment chain perceptible | Partially — prose already states the chain; figure mainly externalises it |
| Fig 2 (S3 wording pairs) | **Yes** | Comparison is the explanatory task; pairs make restrictive vs open wording inspectable | **Yes** — contrast is harder in pure prose |
| Fig 3 (S4 probe branches) | Plausibly yes | Shows probes as optional branches from a response, not a fixed script | Partially — prose example (“more realistic”) carries much of the point |
| Fig 4 (S7 integrated map) | Weakly | Largely reconsolidates Fig 1 + supporting labels already argued | **Unclear / likely no** — risks decorative synthesis |

**Consequence:** At least one figure (Fig 4) looks under-warranted; overall count exceeds the case’s low-visual intent.  
**Finding:** `S86-C02-F03`  
**Instrument observation:** D5’s “purpose” judgement is clearer when split into *warrant / purpose / integration* (see §Instrument observations). Not a criterion change this pass.

### D6 — Prose–representation integration — **CONCERN** (Medium)

**Observation:** Figures appear after section prose; surrounding prose rarely instructs the reader to use the figure mid-argument.  
**Evidence:** No “as shown / shown above” style uptake; section explanations are largely self-complete before the figure; S7 figure follows an already integrative prose synthesis. Captions restated design logic already in prose.  
**Consequence:** Artefacts often accompany completed explanations rather than participating in them.  
**Finding:** `S86-C02-F04`

### D7 — Recurrence vs redundancy — **CONCERN** (Medium)

**Evidence:** RQ→topics→questions→evidence chain appears in Overview, Knowledge summary, S1, S5, S7, Fig 1, Fig 4, and Closing with limited new cognitive move in several recurrences (especially orientation + Closing + Fig 4).  
**Finding:** `S86-C02-F05`

### D8 — Learner-facing information architecture — **CONCERN** (Medium)

**Evidence:** Explicit Overview / Learning purpose / Knowledge summary / Closing labelled regions; empty activities region present. Internal instructional fields projected as furniture.  
**Finding:** `S86-C02-F06`

### D9 — Opening / intellectual entry — **SATISFACTORY**

S1 creates intellectual need via a concrete feedback-study scenario and the temptation to “start by writing down questions,” without requiring a dramatic hook. Orientation prospectus still precedes this entry (covered under D3/D8), but the body entry itself is subject-appropriate for procedural craft.

### D10 — Closure / synthesis — **CONCERN** (Low–Medium)

**Evidence:** S7 “Bring the design logic together” already consolidates; page Closing restates purpose–evidence relationship in prospectus tone. Dual close.  
**Finding:** `S86-C02-F07`

### D11 — Audience appropriateness — **STRONG**

Register fits early-career academic/postgraduate qualitative researchers; examples (feedback, assessment design) are apt; avoids both condescension and unexplained jargon dumps.

### D12 — Grounding / fidelity — **N/A**

No external source corpus claimed; conceptual/craft explanation.

### D13 — Formal / mathematical correctness — **N/A**

No formal mathematics.

### D14 — Typography / readability / hierarchy — **CONCERN** (Low–Medium)

**Evidence:** H3 count = 0; long section blocks; system UI font stack / even rhythm; figures + fallbacks add chrome noise. Intellectual structure mainly signalled by H2 titles alone.  
**Finding:** `S86-C02-F08`

### D15 — Accessibility baseline — **SATISFACTORY** (with defect-channel caveat)

Semantic regions/headings and figure alt/captions present. Structured-material fallbacks inject non-explanatory error text into the reading stream (recorded in defect channel, not as an editorial D15 failure mode).

---

## D. Defect channel (outside D1–D15)

### Structured-material learner fallback — **CONFIRMED**

| Item | Value |
| ---- | ----- |
| String | `Structured material body is not supported for learner rendering.` |
| Count | **4** |
| Locations | Adjacent to materials/figures for **S1, S3, S4, S7** (`data-expository-structured="unsupported"`) |
| Debt link | **S86-AD-010** — now has **cross-case evidence** (Case 01 ×7; Case 02 ×4) |

Do not fix in this task.

---

## E. Overall synthesis (frozen §F)

### What is working?

- Clear procedural intellectual journey (D1 **STRONG**).  
- Audience-fit examples and craft distinctions (wording; probing; prioritisation) (D11 **STRONG**; D2 **SATISFACTORY**).  
- Avoids becoming a literal checklist worksheet despite procedural topic.  
- S1 intellectual entry works without a dramatic problem-hook (supports selection hypothesis positively).  
- Fig 2 (wording pairs) is a strong candidate for warranted representation.

### What most limits this resource from feeling like a high-quality authored chapter?

Editorial architecture: prospectus orientation furniture, even rhetorical cadence, recurring restatement of the alignment chain, dual closure, and figures that often sit after already-complete explanations — plus under-warranted late synthesis graphics.

### Which findings appear systemic vs case-specific? *(two-case caution)*

See §Cross-case below. Not declared universally systemic; several now have **cross-case evidence**.

### What requires further evidence?

- Whether low-visual cases can complete with 0–1 figures when generation is unconstrained.  
- Whether Fig 2-style comparison visuals generalise as the “earn your place” pattern.  
- Humanities / abstract cases (C04/C05) for opening and closure norms.  
- Whether D5 should formally separate warrant vs purpose vs integration (instrument).

### Provisional overall stance (allowed by QA v0.1)

| Layer | Stance |
| ----- | ------ |
| Instructional architecture | **STRONG** |
| Editorial architecture | **CONCERN** |

---

## F. Cross-case observations (Case 01 ↔ Case 02)

### A. Recurring across both (cross-case evidence; not yet universal)

- Orientation furniture (Overview / Learning purpose / Knowledge summary) preceding body.  
- Multiple closure (final section synthesis + page Closing).  
- Even teacherly rhetorical cadence / restatement.  
- Flat hierarchy below H2 (0×H3).  
- Figures often adjacent to self-complete prose (integration weakness).  
- Functional structured-material fallback in learner export (**S86-AD-010**).

### B. Apparently more Case 02–specific

- Procedural craft succeeds without becoming a checklist (positive).  
- Non-dramatic, example-led S1 entry works well (positive for P1 flexibility).  
- **Over-production of figures** relative to low-visual selection intent (esp. Fig 4).  
- No maths path; D12/D13 N/A cleanly.

### C. Case 01 hypotheses Case 02 weakens or qualifies

- “Intellectual entry must be problem/surprise-like” — **weakened**; procedural example-led entry is effective.  
- “Low-visual cases will lack representations” — **qualified / inverted**; PRISM still emitted four figures.  
- P5/P6 remain relevant even when graphics were expected to be scarce — scarcity was not observed.

### D. New candidate findings

- **Representation over-generation under low-visual briefs** (warrant question).  
- Possible distinct evaluation questions: warrant → purpose → integration.  
- Positive: procedural Expository can develop judgement rather than rules-to-tick (S7 explicitly argues against tick-lists).

### E. QA instrument observations (for later v0.2 / T-007 — **no v0.1 edit**)

1. **D5/D6 fairness:** Dimensions remain usable with N/A available, but Case 02 shows the harder problem is not N/A — it is judging **when figures appear despite low need**. A future instrument may explicitly ask *Was any representation warranted?* before purpose/integration.  
2. **D9:** Case 02 supports keeping “subject-appropriate entry” rather than requiring dramatic hooks — already in v0.1 note; reinforced.  
3. Do **not** treat checklist-avoidance as automatic D1 success without reading substance (this case earned it).

---

## G. Finding index (material CONCERNs)

| ID | Dim | Sev | One-line |
| -- | --- | --- | -------- |
| S86-C02-F01 | D3 | Medium | Assembled prospectus + modular body feel |
| S86-C02-F02 | D4 | Medium | Even teacherly cadence; limited selective emphasis |
| S86-C02-F03 | D5 | Medium | Over-warrant risk; Fig 4 weak; four figures vs low-visual intent |
| S86-C02-F04 | D6 | Medium | Figures adjacent to complete prose |
| S86-C02-F05 | D7 | Medium | Alignment-chain recurrence without enough new moves |
| S86-C02-F06 | D8 | Medium | Orientation/Closing furniture |
| S86-C02-F07 | D10 | Low–Medium | Dual closure (S7 + Closing) |
| S86-C02-F08 | D14 | Low–Medium | Flat hierarchy / functional typography |

Defect: structured-material fallback ×4 → S86-AD-010 (cross-case).
