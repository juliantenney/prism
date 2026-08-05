# Sprint 72 — Charter

**Sprint:** 72 — Productising the Instructional Architecture Validated in Sprint 71  
**Status:** **COMPLETE / CLOSED** (2026-08-05)  
**Opened:** 2026-07-31  
**Predecessor:** Sprint 71 — COMPLETE / Closed (2026-07-31)  
**Closure:** [SPRINT-72-CLOSURE.md](SPRINT-72-CLOSURE.md) · [SPRINT-72-FINAL-REPORT.md](SPRINT-72-FINAL-REPORT.md)  
**Start here (historical):** [SPRINT-72-START-HERE.md](SPRINT-72-START-HERE.md)  
**Next:** [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) · [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)

---

## Purpose

Move from Sprint 71 **evaluation and attribution** to **implementation and productisation**: embed validated instructional architecture into Prism’s generation pipeline, contracts, elicitation, and evidence handling so instructional quality is produced by default.

---

## Problem statement

Sprint 71 established that instructional quality is **materially steerable** through pedagogically informed workflow guidance, and that remaining critical limitations increasingly concern **evidence availability**. Residual Critical issues (especially `S71-F-001`) often cannot be solved by richer free-text prompts alone.

The product problem is therefore three-fold:

1. **Platform** — instructional principles are not yet first-class defaults in generation contracts and stage responsibilities.  
2. **Elicitation** — brief fields are arcane; authors are not guided to supply only what the system genuinely needs.  
3. **Author evidence** — copyrighted, organisational, proprietary, and authentic materials lack a clear request → store → associate → consume path.

Collapsing all of this into “prompt improvement” would hide responsibility and recreate the wrong author burden.

---

## Central question

How do we embed the validated Sprint 71 principles into Prism so that high-quality instructional design is produced by default, authors are asked only for information the system genuinely needs, and discipline-specific evidence can be supplied and retained where Prism cannot generate it appropriately?

---

## Goals

1. Make **Evidence-Centred Learning** a first-class Prism design principle (umbrella: Evidence Sufficiency · Evidence-Centred Activity Design · Discipline-Appropriate Evidence Evaluation).  
2. Productise validated Sprint 71 candidate architectural principles into the responsible pipeline stages and contracts (not one undifferentiated prompt).  
3. Materially improve **diagnostic feedback** beyond checklist confirmation.  
4. Fully categorise Sprint 71 carry-forwards by responsibility destination (see [findings-traceability.md](findings-traceability.md)).  
5. Document (and preferably prototype) clearer **workflow elicitation**.  
6. Define **evidence architecture** for author-supplied artefacts.  
7. Specify paths for **image consistency**, **image persistence**, **programming/code representation**, **heading hierarchy**, and **navigation**.  
8. Investigate raising already-strong (~90–91) resources toward an aspirational **95–98** quality ceiling.  
9. Validate changes with Benchmark + Validation Review and matched comparisons where practical — not total score alone.

---

## Workstreams

| ID | Workstream | Priority | Layer |
| -- | ---------- | -------- | ----- |
| WS1 | Platform instructional architecture & generation contracts | **1 — committed focus** | Layer 1 |
| WS2 | Diagnostic feedback & related system improvements | **1 — committed focus** | Layer 1 |
| WS3 | Workflow elicitation redesign | **2** | Layer 2 |
| WS4 | Evidence architecture (author-supplied artefacts) | **3** | Layer 3 |
| WS5 | Product / UX (images, representations, headings, nav) | **4** | Mixed (UX / renderer / contracts) |
| WS6 | Raise the ceiling (~90–91 → 95–98 investigation) | **5 — cross-cutting** | Cross-layer |
| WS7 | Cross-disciplinary regression & sprint synthesis | Closing discipline | Method |

---

## Ordered roadmap (binding unless changed by recorded decision)

1. **Platform instructional architecture** — highest priority  
2. **Workflow elicitation redesign** — second  
3. **Evidence architecture and author-supplied artefacts** — third  
4. **Product and UX improvements** — image consistency, image persistence, disciplinary representations, headings, navigation  
5. **Raise excellent resources** from ~90–91 toward 95–98 — cross-cutting optimisation  

### Dependency chain

```text
Sprint 71 evidence
→ classify responsibility (traceability A–F)
→ system-side implementation where possible (Layer 1)
→ elicitation where information is genuinely missing (Layer 2)
→ author-supplied evidence where generation is inappropriate (Layer 3)
→ validate through regenerated resources
→ Benchmark + Validation Review (matched/controlled where practical)
→ refine toward higher quality ceiling
```

---

## Principles to productise (from Sprint 71)

### Evidence-Centred Learning (first-class umbrella)

Sprint 72 productises **Evidence-Centred Learning** as the first-class platform umbrella:

- **Evidence Sufficiency** — sufficient directly analysable evidence for evidence-based tasks (`S71-F-001` route A)  
- **Evidence-Centred Activity Design** — activities require explicit use of supplied evidence  
- **Discipline-Appropriate Evidence Evaluation** — evaluate evidence quality through discipline profiles  

**Evidence-Based Learning** (Sprint 71 complementary framing, retained as distinct): learners must reason *with* authentic artefacts, not merely about them. It is not a duplicate label for Evidence-Centred Activity Design — the latter is the activity-design obligation; Evidence-Based Learning is the complementary learning stance that authentic artefacts are the objects of reasoning (see Sprint 71 design-principles complementary framing). Sprint 72 nests productisation work under **Evidence-Centred Learning** and keeps this S71 distinction explicit.

### `S71-F-001` dual routing (binding)

One Sprint 71 ID; ordered Sprint 72 treatments (`S72-D08`):

1. **A** — Evidence Sufficiency instructional: platform makes activities evidence-completable  
2. **B** — elicitation when Prism must ask what evidence exists  
3. **C** — author-supplied artefacts when Prism cannot or must not generate the material  

### Other principles to productise

Consider (attribution via Sprint 71 map — not all in one prompt):

- Diagnostic Feedback  
- Pedagogical Timing  
- Disciplinary Uncertainty  
- Disciplinary Representation  
- Evidence-Based Learning (complementary framing — see above)  
- constructive alignment · sustained reasoning · supported-to-independent progression · transfer  
- independent-study effectiveness · worked-example progression · quality-calibrated self-checks  

**Diagnostic feedback** is a specific Priority-1 product priority: move beyond checklist confirmation toward distinctions such as description vs analysis; assertion vs evidence-supported inference; task completion vs reasoning quality; structurally complete vs convincing; correct answer vs misconception diagnosis; weak / adequate / strong disciplinary reasoning.

Pipeline stages to consider for ownership (non-exhaustive): Generate Learning Content · Model Knowledge · Define Learning Outcomes · Design Episode Plan · Design Learning Activities · Generate Activity Materials · Construct Learning Sequence · Design Page · assessment and feedback stages · generation contracts · discipline profiles · artefact contracts and stage handoffs.

---

## In scope

- Platform design principles and generation-contract / stage improvements attributed per Sprint 71 model  
- Diagnostic feedback system improvements with validation  
- Elicitation redesign discovery and preferably prototype (natural questions, progressive disclosure, defaults)  
- Evidence architecture definition (request, upload/select, store, associate, reuse, version, reference, persist across refresh/navigation, distinguish illustrative vs author-supplied)  
- Product/UX specifications and implementation **as capacity allows** for images, code representation path, headings, navigation  
- Raise-the-ceiling investigation on at least one strong existing resource  
- Full S71 → S72 findings categorisation  
- Evidence-disciplined validation loops  

## Out of scope (unless a recorded Sprint 72 decision expands)

- Reopening or rewriting Sprint 71 evidence  
- Implementing every specialist renderer (music, chemistry, engineering diagrams, etc.) without evidence + capacity justification — architecture/prioritisation path only unless capacity supports a thin slice  
- Treating “longer author prompts” as the primary fix  
- Claiming score-alone success  
- Completing every roadmap item in a single sprint (distinguish committed / stretch / discovery / deferred)  
- Sprint 72 closure / final report (opened later when work completes)

---

## Constraints

- Preserve Design Page vs deterministic assembly vs renderer distinctions.  
- Do not silently reclassify Sprint 71 findings; record rationale in traceability.  
- Keep Confirmed vs Partially Confirmed distinct; retain Resolved items as resolved.  
- Do not invent Sprint 71 IDs; new operator items use Sprint 72 IDs only (`S72-B-*`, `S72-T-*`, `S72-D-*`).  
- Sprint 70 methodological authority remains binding for QA method where applicable (`S70-D01`…`S70-D10`); Sprint 72 **authorises** elicitation redesign for this successor (see `S72-D06`) without reopening Sprint 71’s evaluation-only scope.  
- Prefer smallest coherent system change → regenerate → validate.

---

## Validation method

1. Select a validated principle or issue.  
2. Confirm responsible pipeline stage/layer.  
3. Define expected generation or UX behaviour.  
4. Implement the smallest coherent system change.  
5. Regenerate suitable test resources.  
6. Run Benchmark and Validation Review.  
7. Compare against an appropriate baseline (matched/controlled where practical).  
8. Check for regressions across disciplines.  
9. Record whether targeted dimensions improved and whether new regressions appeared.  
10. Update STATUS and traceability.

Do **not** treat a higher total benchmark score alone as proof.

---

## Success criteria

**Status: ACCEPTED** (`S72-D07` — operator approval recorded 2026-07-31, incorporating pre-implementation amendments: `S71-F-001` dual routing, committed Layer-1 slice `S72-T-013`/`T-014`, Evidence-Centred Learning umbrella terminology, shared workflow asset-persistence model)

1. Evidence-Centred Learning is represented as a first-class platform design principle (umbrella over Evidence Sufficiency, Evidence-Centred Activity Design, and Discipline-Appropriate Evidence Evaluation).  
2. At least one major validated Sprint 71 instructional principle is implemented in the responsible generation stage or contract and tested (`S72-T-013` + `S72-T-014` — **committed**).  
3. Diagnostic feedback is materially improved and validated on suitable resources.  
4. Sprint 71 findings are fully categorised by system, elicitation, author evidence, UX/renderer, methodology, or no-action destination.  
5. Workflow elicitation has a documented and preferably prototyped direction clearer than current arcane brief fields.  
6. Evidence architecture defines how author-supplied materials are requested, stored, associated with workflows, and consumed by generation.  
7. Generated image persistence has a documented implementation path (implementation included if scope and dependencies permit), aligned with the shared workflow asset-persistence model used for author-evidence associations.  
8. A consistent image-style approach is specified and tested or prepared for implementation.  
9. Programming/code representation requirements are defined and prioritised.  
10. Heading hierarchy and long-title navigation issues have clear ownership and acceptance criteria.  
11. At least one strong existing resource is used to investigate movement from ~90–91 toward the 95–98 range.  
12. Changes are validated using benchmark plus independent validation rather than benchmark score alone.  
13. No unresolved responsibility ambiguity is hidden inside generic “prompt improvement” wording.

Treat **95–98** as an aspirational quality ceiling and design target, subject to benchmark validity, discipline, and task context — not a requirement that every resource automatically scores exactly 98.

---

## Relationship to Sprint 71

Sprint 71 answered *how Prism can generate better learner-facing resources* through evidence and attribution. Sprint 72 **implements** that evidence base. Authoritative Sprint 71 artefacts are linked from [links-to-predecessors.md](links-to-predecessors.md); they are not duplicated here.
