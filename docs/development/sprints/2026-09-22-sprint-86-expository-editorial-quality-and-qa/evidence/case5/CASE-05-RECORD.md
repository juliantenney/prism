# Case 05 — Deductive validity vs everyday persuasiveness (evidence record)

**Case ID:** S86-C05  
**Status:** Generated · evaluated under frozen Expository QA v0.1 (**S86-T-006 COMPLETE** with C01–C05)  
**Role:** Abstract conceptual · plausibly low-visual validation case  
**Primary artefact:** Preserved learner export (do not modify)

---

## 1. Frozen creation context (from VALIDATION-SET)

| Field | Value |
| ----- | ----- |
| Product | Expository Resource |
| Topic / prompt | Explain what it means for an argument to be **deductively valid**, and how that differs from an argument merely being **persuasive or plausible** in everyday discussion. Use short plain-language examples. Clarify that validity concerns **form/support relation**, not whether premises are true, and that everyday **strength-of-reasons** judgements are a **different kind of appraisal**. |
| Audience | University staff and postgraduate students across disciplines with little or no formal logic training |
| Intended extent | about a 15-minute read |
| Selection rationale | Abstract conceptual; plausibly excellent with little/no graphics; challenges Bayes-style dramatised openings |

---

## 2. Actual learner-facing identity (from export)

| Field | Value |
| ----- | ----- |
| Title | When Does a Conclusion Really Follow? |
| Subtitle | This resource introduces deductive validity as a precise way of examining whether a conclusion follows from its premises. |
| Approximate resulting extent | ~2,120 learner-facing words (main region; within ~15-minute band) |

### Baseline export location

| Item | Path |
| ---- | ---- |
| Evidence directory | `docs/development/sprints/2026-09-22-sprint-86-expository-editorial-quality-and-qa/evidence/case5/` |
| Immutable ZIP | [`case5.zip`](case5.zip) (~3.7 MB) |
| Learner HTML inside ZIP | `learner-page.html` |
| Assets | `assets/` — **2** PNGs |

**Inspection note:** ZIP inspected via temporary extract only. **case5.zip was not modified.**

---

## 3. Intellectual journey (learner-facing sections)

| ID | Heading |
| -- | ------- |
| S1 | What does it mean for a conclusion to follow? |
| S2 | Validity asks about necessity, not whether the claims happen to be true |
| S3 | Testing the guarantee: could the premises be true and the conclusion false? |
| S4 | Why structure matters: similar arguments can behave differently |
| S5 | From validity to argument appraisal |

Plus orientation (Overview / Learning purpose / Knowledge summary) and page-level **Closing**.

Heading hierarchy: **H1 + H2; H3 count = 0**.

**Journey shape:** argument/premise/conclusion → truth ≠ validity → counterexample test → form (MP vs affirming the consequent) → appraisal sequence + soundness + non-deductive boundary.

---

## 4. Representations / materials observed

### Visual affordances (2 figures)

| Figure | After section | Subject (from alt/caption) |
| ---- | ------------- | -------------------------- |
| Figure 1 | S4 | Side-by-side conditional forms: valid `If P then Q; P; therefore Q` vs invalid `If P then Q; Q; therefore P` |
| Figure 2 | S5 | Appraisal process: identify premises/conclusion → grant premises → counterexample test → separate premise-acceptability |

### Structured materials (functional defect channel)

**5** instances of:

> Structured material body is not supported for learner rendering.

| Material ID | Kind | Section | Realised as learner figure? |
| ----------- | ---- | ------- | --------------------------- |
| `XM-MAT-S2-01` | concept contrast | S2 | **No** (fallback only) |
| `XM-MAT-S3-01` | worked counterexample | S3 | **No** (fallback only) |
| `XM-MAT-S4-01` | side-by-side argument-form comparison | S4 | **Yes** — Fig 1 (with fallback still shown) |
| `XM-MAT-S5-01` | truth-validity-soundness synthesis | S5 | Unclear / not as dedicated figure |
| `XM-MAT-S5-02` | argument-appraisal sequence | S5 | **Likely Fig 2** (with fallback still shown) |

**Diagnostic:** 5 structured-material commissions → 2 learner-facing figures (not 1:1). See QA findings + **S86-AD-010**.

---

## 5. Minimal reproducibility context

- Generated via normal PRISM first-class Expository workflow (manual operator generation).  
- Evaluation inputs: frozen VALIDATION-SET Case 05 brief + this immutable `case5.zip`.  
- No external source corpus required for D12 (logic pedagogy from export-internal examples).

---

## 6. Related artefacts

- Frozen QA evaluation: [QA-FINDINGS.md](QA-FINDINGS.md)  
- Validation-set entry: [../../VALIDATION-SET.md](../../VALIDATION-SET.md)  
- QA instrument (frozen): [../../EXPOSITORY-QA-v0.1.md](../../EXPOSITORY-QA-v0.1.md)
