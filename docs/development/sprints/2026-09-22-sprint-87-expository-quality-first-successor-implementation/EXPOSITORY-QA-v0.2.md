# Expository QA v0.2

**Status:** **ACCEPTED acceptance instrument** for Sprint 87 onward ([S87-D02](decisions.md#s87-d02--accept-expository-qa-v02))  
**Task:** S87-T-001 · Sprint 86 WP2 carry-forward  
**Predecessor:** [EXPOSITORY-QA-v0.1.md](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/EXPOSITORY-QA-v0.1.md) (frozen historical instrument — do not edit)  
**Quality model:** EQ1–EQ8 · [DRAFT-EDITORIAL-PRINCIPLES.md](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/DRAFT-EDITORIAL-PRINCIPLES.md)  
**Evidence basis:** Frozen C01–C05 synthesis · [T-007](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-007-FIVE-CASE-SYNTHESIS.md) · [T-010](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-010-TYPOGRAPHY-REQUIREMENTS.md) · [T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)

This process is a **diagnostic instrument for human editorial judgement**, not an optimisation target, score programme, compliance certification, or automated lint specification.

---

## Overarching definition

> A high-quality Expository Resource constructs the **commissioned understanding** in its **appropriate epistemic form**, and presents that understanding as **one authored intellectual experience** — progressive, selectively emphasised, representation-aware, and closed once — rather than as an assembly of individually competent instructional components and internal page furniture.

---

## EQ1–EQ8 grounding

| EQ | Principle | Primary dimensions |
| -- | --------- | ------------------ |
| **EQ1** | Purpose & epistemic form | **D1** (also constrains D2, D9, D10) |
| **EQ2** | Open into commissioned intellectual need | **D9** |
| **EQ3** | Progress with attention proportional to difficulty | **D2**, **D3** |
| **EQ4** | Development + productive anchor recurrence | **D7** |
| **EQ5** | Representation warrant & participation | **D6** |
| **EQ6** | Selective emphasis & reader trust | **D5** |
| **EQ7** | Learner value + visible intellectual structure | **D8**, **D14** |
| **EQ8** | One form-appropriate consolidating close | **D10** |

Cross-cutting: **D11** audience · **D12** grounding · **D13** formal correctness · **D15** accessibility · **Defect channel** functional/rendering.

---

## A. Evaluation inputs

**Prefer (primary):**

1. **Learner-facing** rendered/exported resource (HTML package or equivalent).  
2. **Creation context** when judging purpose-fit (topic, audience, intended extent, product type, and the commissioned intellectual question/task).  
3. **Source/grounding material** when the resource claims fidelity to sources.

**Use sparingly (diagnostic only):**

4. Internal workflow artefacts (EJP/XD/XM/DP captures) — only when diagnosing *where* a learner-facing problem likely arises; **not** required to record that a learner-facing problem exists.

**Do not** judge editorial quality primarily from plans or prompts.

**Creation-context rule (S86 / C04):** Internal coherence of the delivered chapter is **not** enough. Judge the resource against the **commissioned intellectual purpose**. A coherent neighbouring lesson is still a purpose-fit failure.

---

## B. Evaluation procedure (repeatable)

Practical sequence — omit a pass only when clearly N/A:

1. **Establish creation context** — record product, topic, audience, intended extent, and the commissioned intellectual purpose / question / task.  
2. **Whole-resource first read** — read as a learner; note global impressions before analytic dissection.  
3. **Identify intended epistemic form** — what *kind* of understanding is commissioned (mechanism, interpretation, uncertainty, comparison, qualification, competing weighting, formal distinction, etc.) — **not** by matching a closed taxonomy label.  
4. **Purpose-fit / epistemic-form pass (D1)** — does the chapter answer the commissioned question in the appropriate epistemic form?  
5. **Intellectual journey & explanatory sufficiency (D2–D3)** — order, threshold moves, attention ∝ difficulty.  
6. **Opening, progression cues, recurrence, close (D9, D7, D10)** — commissioned entry; productive vs harmful recurrence; one form-appropriate consolidating close.  
7. **Representations (D6)** — warrant → explanatory value of form → integration.  
8. **Editorial authorship & emphasis (D4–D5)** — one authored experience; selective emphasis; reader trust.  
9. **Learner-facing structure (D8)** — intellectual structure vs instructional machinery / prospectus furniture.  
10. **Audience / grounding / formal correctness (D11–D13)** — where applicable.  
11. **Typography & accessibility (D14–D15)** — T-010-aligned reading experience; semantic a11y without treating equivalence as redundancy.  
12. **Functional defect triage** — record separately from D1–D15.  
13. **Internal artefacts (optional)** — only for ownership / diagnosis hints.  
14. **Qualitative synthesis (§F)** — no numeric total.

Keep notes short. Prefer evidence quotes and structural observations over vague taste language.

---

## C. QA dimensions (v0.2)

Each dimension is judged independently where applicable. Layers: **instructional** · **editorial** · **both** · **cross-cutting**.

### D1 — Purpose & epistemic form

- **Judges:** Whether the resource constructs the **commissioned** understanding in the **epistemic form** that understanding requires.  
- **Strong:** Answers the intended intellectual question/task; preserves mechanism / interpretation / uncertainty / comparison / qualification / competing weighting / formal distinction / other subject-appropriate form as the commission requires.  
- **Failure modes:** Neighbouring-brief drift; internally coherent chapter for a different question; collapsing competing interpretations into one apparently settled model; topical coverage mistaken for purpose-fit.  
- **Evidence:** Creation context vs delivered spine, section objects, and close.  
- **Layer:** Primarily **instructional**.  
- **EQ:** EQ1.  
- **Note:** Do **not** require matching a fixed taxonomy label. Ask whether the *kind* of understanding is preserved.

### D2 — Intellectual journey

- **Judges:** Whether understanding is constructed in a coherent progressive order the learner can experience — **for the commissioned purpose**.  
- **Strong:** Necessary distinctions appear when needed; later sections depend productively on earlier ones; the journey enacts (not merely announces) the commissioned object.  
- **Failure modes:** Missing threshold moves; premature formalism; arbitrary section order; journey only announced; strong journey for the **wrong** object (also fails D1).  
- **Evidence:** Section sequence; dependency of later explanations on earlier ones.  
- **Layer:** Primarily **instructional**.  
- **EQ:** EQ3.

### D3 — Explanatory sufficiency

- **Judges:** Whether difficult ideas receive enough explanation for the stated audience/extent.  
- **Strong:** Hard distinctions are worked; easy material is not over-explained relative to extent.  
- **Failure modes:** Handwaving at thresholds; padding on routine points; audience mismatch; attention spent on a neighbouring hard object (pair with D1).  
- **Evidence:** Treatment of known hard concepts vs routine ones.  
- **Layer:** Instructional (with editorial density implications).  
- **EQ:** EQ3.

### D4 — Editorial coherence & reading experience

- **Judges:** Whether the resource feels authored as one intellectual experience rather than assembled components.  
- **Strong:** Entry, body, and close belong to one voice and arc; joints create momentum.  
- **Failure modes:** Prospectus tone; disjointed modules; repeated “restarting.”  
- **Evidence:** Whole-resource first read; transition quality.  
- **Layer:** **Editorial**.  
- **Note:** Coherence alone does not override a D1 purpose-fit failure.

### D5 — Selective emphasis & reader trust

- **Judges:** Variation, emphasis, and restraint in prose; whether additional words buy additional understanding.  
- **Strong:** Threshold moments carry more weight; routine moves are quieter; limited metacommentary; established understanding is not restated or “explained again.”  
- **Failure modes:** Even teacherly cadence; claim→explain→restate loops; explaining the explanation; condescending metacommentary.  
- **Evidence:** Marked sentences; paragraph rhythm; restatement of completed work.  
- **Layer:** Editorial.  
- **EQ:** EQ6.

### D6 — Representation warrant, value & integration

- **Judges:** Whether supporting artefacts earn their place and participate in the exposition. Use the sequence:

  1. **Warrant** — Why is a representation appropriate here at all?  
  2. **Explanatory value of form** — What does this form make easier to perceive or understand than prose alone (relationships, patterns, sequences, contrasts, spatial structure, causal ordering, etc.)?  
  3. **Integration** — Does it participate in the exposition rather than merely sit beside it?

- **Strong:** Warranted form; perceptibility gain; prose and artefact compose one explanation where used.  
- **Failure modes:** Decorative or checklist visuals; weak warrant / over-generation; figure dumped after a self-contained prose block; caption that only restates without advancing; trapping essential meaning **only** in an image (also D15).  
- **Do not:** Treat the representation as valuable *only if* removing it would destroy essential understanding — that conflicts with accessibility.  
- **Do not:** Penalise merely because supporting intellectual artefacts (XM commissions) and learner-facing figures are not 1:1.  
- **Accessibility clarification:** Semantic equivalence between accessible prose and a figure is **not** editorial redundancy. Judge duplication negatively only when it repeats **completed explanatory work** without useful representational or accessibility function.  
- **Evidence:** Artefact role, sequencing, mid-argument use, caption function.  
- **Layer:** Both (commission instructional; placement/integration editorial).  
- **N/A:** When the resource legitimately needs few/no graphics.  
- **EQ:** EQ5.

### D7 — Recurrence vs redundancy

- **Judges:** Whether repeated ideas develop understanding or merely repeat completed work. Distinguish:

  | Kind | Treatment |
  | ---- | --------- |
  | **Conceptual-anchor recurrence** | Allowed / often desirable |
  | **Development, qualification, application, contrast, or consolidation** | Preferred |
  | **Repetition of completed explanatory work** | Potentially harmful |

- **Strong:** Recurrence adds a cognitive move or consolidates a central test/formulation.  
- **Failure modes:** Orientation / body / closing synonym loops; reconsolidating figures that add no perceptibility; treating useful anchors as redundancy.  
- **Do not:** Penalise a concept merely for appearing several times.  
- **Evidence:** Parallel passages across regions; each recurrence’s cognitive job.  
- **Layer:** Editorial.  
- **EQ:** EQ4.

### D8 — Learner-facing information architecture

- **Judges:** Whether visible structure reveals the **intellectual structure** of the chapter rather than exposing internal instructional machinery.  
- **Strong:** Visible regions serve reading; internal planning fields are not auto-projected as labelled learner furniture.  
- **Failure modes / concern signals:** Stacked Overview / Learning purpose / Knowledge summary furniture; repeated administrative orientation before substantive entry; flat structure that obscures genuine conceptual substructure; card-like fragmentation of continuous exposition.  
- **Do not:** Require H3s merely because none exist. A subsection heading is warranted only for a genuine intellectual sub-move.  
- **Evidence:** Orientation/closing regions; labelled headings; heading tree vs argument structure.  
- **Layer:** Editorial (Design Page / renderer surface).  
- **EQ:** EQ7.

### D9 — Opening / intellectual entry

- **Judges:** How the resource creates reason to engage with the **commissioned** intellectual need.  
- **Strong:** Subject-appropriate entry (precise conceptual question, tension, contrast, case, phenomenon, etc.) into the *commissioned* problem — not drama, obligatory hooks, or surprise-for-its-own-sake.  
- **Failure modes:** Administrative “this resource will cover…” as primary entry; strong entry into the **wrong** problem (also fails D1).  
- **Evidence:** First screenful / first substantive section; relation to creation context.  
- **Layer:** Editorial (+ instructional via purpose).  
- **EQ:** EQ2.  
- **Note:** Does **not** require a provocative question.

### D10 — Closure / consolidating close

- **Judges:** How the resource ends the intellectual experience — one authoritative, **form-appropriate** consolidating close.  
- **Strong:** Shows what can now be understood that could not at the start; consolidation fits the epistemic object (model integration, conceptual test, or — for interpretive material — how interpretations differ, why weighting differs, what evidence constrains disagreement, what remains legitimately contestable).  
- **Failure modes:** Multiple competing conclusions; mechanical section checklist; restated prospectus; dual close (substantive synthesis + generic page Closing); **false resolution** that collapses legitimate plurality into one neat preferred model.  
- **Do not:** Treat “synthesis” as requiring a single-answer resolution for interpretive commissions.  
- **Evidence:** Final section(s) + any page-level Closing region.  
- **Layer:** Editorial (+ instructional via epistemic form).  
- **EQ:** EQ8.

### D11 — Audience appropriateness

- **Judges:** Register, prerequisites, and example world fit the stated audience.  
- **Strong:** Accessible without condescension; formalism introduced when prepared.  
- **Failure modes:** Jargon dump; fake simplicity that hides the hard move.  
- **Evidence:** Examples, definitions, pacing of formalism.  
- **Layer:** Both.

### D12 — Grounding / fidelity

- **Judges:** Faithfulness to authorised claims/sources where relevant.  
- **Strong:** Qualifications preserved; no invented authority.  
- **Failure modes:** Overclaiming; silent invention; dropped hedges.  
- **Evidence:** Claims vs brief/sources.  
- **N/A:** Pure conceptual resources without external source claims.  
- **Layer:** Instructional / fidelity.

### D13 — Formal / mathematical correctness

- **Judges:** Notation and formal relations where present.  
- **Strong:** Correct, consistent, audience-appropriate formalism.  
- **Failure modes:** Corrupted notation; false precision; inconsistent symbols.  
- **Evidence:** Equations, worked quantities.  
- **N/A:** Non-formal resources.  
- **Layer:** Instructional / correctness.

### D14 — Typography / readability / hierarchy

- **Judges:** Whether presentation helps the reader perceive intellectual structure (aligned with [T-010](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-010-TYPOGRAPHY-REQUIREMENTS.md)).  
- **Strong (qualitative):** Readable measure (~65–75ch; current ~70ch acceptable); calm body typography; meaningful hierarchy; vertical rhythm; restrained emphasis; readable display maths; quiet figure/caption treatment; editorial rather than widget-like tables/lists; narrow/reflowed readability; avoidance of gratuitous cardification.  
- **Failure modes:** Flat hierarchy that hides warranted structure; UI-widget / card-heavy feel; decorative panels competing with argument; typography inventing structure the content does not have.  
- **Do not require:** Serif typography; a particular font; exact pixel values; a particular number of headings.  
- **Evidence:** Heading tree; measure/rhythm; figure/math/table chrome; narrow-layout behaviour.  
- **Layer:** Editorial (renderer).  
- **EQ:** EQ7 (expression).  
- **Note:** Typography should **express** semantic structure, not invent it. Not “make it pretty.”

### D15 — Accessibility baseline

- **Judges:** Ordinary semantic structure and accessible alternatives remain intact.  
- **Strong:** Sensible headings, alt text / equivalents, reading order; essential instructional meaning available without exclusive dependence on seeing an image.  
- **Failure modes:** Broken semantics; missing alternatives for essential figures; meaning trapped only in visuals.  
- **Do not:** Treat accessible prose that preserves the same instructional meaning as a figure as editorial redundancy (see D6).  
- **Evidence:** Structure / alternatives / order.  
- **Layer:** Cross-cutting (not editorial flourish).

### Defect channel (not a quality dimension)

**Functional / rendering defects** are recorded separately from D1–D15 so they do not masquerade as editorial mediocrity.

**Exemplar (S86):** AD-010 — learner-facing “Structured material body is not supported for learner rendering.”

A resource may be instructionally/editorially strong and still contain a functional learner-facing defect. Functional defects can still **block overall acceptance** when they damage the learner experience or lose unique instructional content. Do **not** average them into dimension ratings.

---

## D. Judgement convention

### Quality rating (per applicable dimension)

| Rating | Meaning |
| ------ | ------- |
| **STRONG** | Clearly supports a high-quality authored-chapter experience on this dimension |
| **SATISFACTORY** | Acceptable; not a limiting factor |
| **CONCERN** | Materially limits instructional/editorial quality; evidence cited |
| **N/A** | Dimension does not apply to this resource |

### Severity (for CONCERN findings only)

| Severity | Meaning |
| -------- | ------- |
| **High** | Dominates the reading experience, blocks understanding, or fails purpose-fit |
| **Medium** | Repeated or structurally important drag |
| **Low** | Local / occasional |

Applicability is expressed via **N/A**, not by forcing a weak score.

**No numeric totals. No averaging. No weighted rubric.**

---

## E. Finding format

Record each material finding as:

```text
FINDING-ID: S87-Cxx-Fnn   (or S87-Lxx-Fnn for live pressure cases)
DIMENSION: D# | DEFECT
RATING: STRONG | SATISFACTORY | CONCERN | N/A | — (defects use DEFECT)
SEVERITY: High | Medium | Low | — (if not CONCERN / not defect impact)
OBSERVATION: …
EVIDENCE: … (quote, structural location, figure id, creation-context contrast, etc.)
LEARNER/EDITORIAL CONSEQUENCE: …
OWNERSHIP HINT: … (optional; EJP/XD/XM/DP/assembly/renderer/functional — only if reasonably inferable)
```

Ownership hints are **optional diagnostics**, never required to legitimise a learner-facing finding.

---

## F. Overall synthesis (no numeric total / no composite grade)

After dimensional notes, answer:

1. **Instructional integrity** — Does the resource construct the commissioned understanding, in suitable order, with enough explanation — **including purpose-fit / epistemic form (D1)**?  
2. **Editorial authorship** — Does it read as one authored intellectual experience (entry, pacing, emphasis, recurrence, structure, close, typography)?  
3. **Functional defects** — What learner-facing functional/rendering defects exist, and do they damage experience or lose unique content?  
4. **What is working?**  
5. **What most limits acceptance as a high-quality Expository Resource?**  
6. **Which findings appear systemic vs case-specific?**  
7. **Overall acceptance concerns** — what would block accepting this resource for the intended use (without inventing a composite grade)?

Optional stance lines (not scores; may diverge):

```text
Purpose / epistemic form (D1):     STRONG | SATISFACTORY | CONCERN | N/A
Instructional integrity:           STRONG | SATISFACTORY | CONCERN
Editorial authorship:              STRONG | SATISFACTORY | CONCERN
Functional defects:                none material | material (list)
```

A resource may therefore be:

- instructionally strong but editorially weak;  
- editorially coherent but **purpose-misaligned**;  
- strong in both but **blocked by a functional defect**.

---

## G. Sprint 87 use (pressure cases & first-slice signals)

Use this instrument in **S87-T-007** (and any interim reviews) against live Expository pressure cases covering at least:

- quantitative / maths  
- low-visual prose  
- visual mechanism  
- interpretive / epistemic plurality  
- abstract conceptual material  

The instrument should be able to detect intended first-slice improvements (EQ1 preservation; substantive chapter entry; one authoritative close; AD-010 repair; restrained presentation) **and** still identify regressions or new concerns. Do **not** treat first-slice delivery as automatic pass.

Historical C01–C05 remain useful under the §H mapping; do not re-run or rewrite frozen v0.1 case files.

---

## H. v0.1 → v0.2 mapping

| v0.1 | v0.2 | Change |
| ---- | ---- | ------ |
| — | **D1 Purpose & epistemic form** | **Added** (EQ1; C04) |
| D1 Intellectual journey | **D2** | Refined: commission-aware |
| D2 Explanatory sufficiency | **D3** | Continuity; pair with D1 |
| D3 Editorial coherence | **D4** | Continuity; coherence ≠ purpose-fit |
| D4 Rhetorical quality | **D5** | Renamed/refined toward EQ6 (emphasis + trust) |
| D5 Representation purpose | **D6** (merged) | Warrant → value → integration; drop “remove ⇒ destroy” heuristic |
| D6 Prose–representation integration | **D6** (merged) | Same; a11y equivalence ≠ redundancy |
| D7 Recurrence vs redundancy | **D7** | Explicit three-kind distinction (C05) |
| D8 Learner-facing IA | **D8** | EQ7 furniture / machinery signals; no H3 mandate |
| D9 Opening | **D9** | Into **commissioned** need |
| D10 Closure / synthesis | **D10** | Form-appropriate consolidation; no false single-model resolution; enforce one close |
| D11 Audience | **D11** | Continuity |
| D12 Grounding | **D12** | Continuity |
| D13 Formal correctness | **D13** | Continuity |
| D14 Typography | **D14** | Aligned to T-010 qualitative targets |
| D15 Accessibility | **D15** | Clarifies a11y ≠ editorial redundancy |
| Defect channel | Defect channel | Continuity; AD-010 exemplar retained |
| Synthesis (instructional / editorial) | Synthesis | Adds purpose line, functional defects, acceptance concerns |

---

## I. Stability

v0.2 is the **Sprint 87 acceptance instrument**. Refine only by explicit sprint decision if live evidence shows an instrument problem. Do **not** silently revise criteria mid-validation pass; record misfits as instrument issues for a later revision.
