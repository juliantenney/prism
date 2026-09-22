# Case 01 — Bayes' theorem (baseline)

**Case ID:** S86-C01  
**Status:** Baseline captured (S86-T-001)  
**Role:** Pre-validation evidence for editorial quality model and Expository QA v0.1  
**Primary artefact:** Preserved learner export (do not modify)

---

## 1. Identifying context

| Field | Value |
| ----- | ----- |
| Product | Expository Resource (`expository_resource`) |
| Topic (Create brief) | Explain Bayes' theorem as a way of updating beliefs when new evidence becomes available. Develop the relationship between prior probability, likelihood, posterior probability and the strength of evidence, using an accessible worked example. Explain why base rates matter and how neglecting them can lead to misleading conclusions. |
| Audience | University staff and postgraduate students comfortable with everyday percentages/probabilities but with little or no formal statistical training |
| Extent (final adjusted) | about a 20-minute read |
| Approximate resulting extent | ~2,931 learner-facing words in export text (just under ~3,000) |
| Title (learner-facing) | Bayes' theorem: updating probability with evidence |
| Persistence page key fragment | `bayes-theorem:-updating-probability-with-evidence` · `no-activities` |

### Baseline export location

| Item | Path |
| ---- | ---- |
| Evidence directory | `docs/development/sprints/2026-09-22-sprint-86-expository-editorial-quality-and-qa/evidence/case-01-bayes/` |
| Preserved ZIP (authoritative, immutable) | [`Bayes.zip`](Bayes.zip) (same folder) |
| Learner HTML inside ZIP | `learner-page.html` |
| Assets | `assets/` (4 PNGs) · `lib/mathjax/` (offline MathJax) |

**Inspection note:** ZIP contents were inspected via a temporary extract only. The baseline ZIP and its contents were **not** modified.

---

## 2. Final intellectual journey (learner-facing sections)

Observed `data-section-id` / H2 titles in the export:

| ID | Learner-facing heading |
| -- | ---------------------- |
| S1 | Updating what seems plausible |
| S2 | The direction of the question matters |
| S3 | Why the starting probability cannot be ignored |
| S4 | Seeing Bayesian updating in 1,000 people |
| S5 | From the population picture to Bayes' theorem |
| S6 | The same evidence, a different starting point |
| S7 | A pattern that extends beyond screening tests |
| S8 | What a Bayesian conclusion depends on |

Journey shape (instructional): intuitive updating → conditional direction → base rates → natural frequencies → formal Bayes → changed-prior comparison → transfer → qualification.

---

## 3. Learner-facing information architecture (observed)

Regions in export:

- **Header** — title + subtitle (administrative/orienting tone)
- **Orientation** — Overview · Learning purpose · Knowledge summary (+ Figure 1 concept map)
- **Exposition** — S1–S8
- **Closing** — `data-region="page-closing"` short carry-away paragraph
- **Activities** — present as empty region (0 activities)

Heading hierarchy: **H1 + many H2; H3 count = 0** in the preserved HTML (weak sub-section hierarchy).

---

## 4. Major representations / materials (observed)

### Visual affordances (rendered figures)

| Figure | Location | Subject (from alt/caption) |
| ---- | -------- | -------------------------- |
| Figure 1 | Knowledge summary | Prior → evidence → posterior concept map; conditional direction / base rate / qualification annotations |
| Figure 2 | After S4 | Natural-frequency diagram for 1,000 people (~9 / ~50 / ~59 positives) |
| Figure 3 | After S5 | Annotated Bayes' theorem |
| Figure 4 | After S6 | Side-by-side 1% vs 20% prevalence comparison |

### Structured materials (learner-facing defect)

The export contains **7** instances of the fallback string:

> Structured material body is not supported for learner rendering.

Classification: **functional / rendering defect** discovered through QA — **not** an editorial-quality finding. See [S86-AD-010](../../ARCHITECTURAL-DEBT.md). Do not fix in WP1–WP3.

---

## 5. Notable instructional strengths (export-evidenced)

- Coherent whole-resource progression matching the section titles above.
- Formula postponed until after population reasoning (S4 → S5).
- Controlled comparison of changed prior (S6) with matched evidence characteristics.
- Strong compression/synthesis moment in S5 prose: *“The formula has not changed the reasoning. It has compressed it.”*
- Closing returns to prior → evidence → posterior with enriched meaning after S8 development.
- Formal notation present via MathJax path; approximate natural-frequency counts retained as approximate.

---

## 6. Related investigation artefacts

- Editorial findings & developmental-edit evidence: [EDITORIAL-FINDINGS.md](EDITORIAL-FINDINGS.md)
- P1–P11 assessment + two-layer finding: [../../WP1-FINDINGS.md](../../WP1-FINDINGS.md)
- Expository QA v0.1: [../../EXPOSITORY-QA-v0.1.md](../../EXPOSITORY-QA-v0.1.md)
- Validation set (cases 02+ selection only): [../../VALIDATION-SET.md](../../VALIDATION-SET.md)
