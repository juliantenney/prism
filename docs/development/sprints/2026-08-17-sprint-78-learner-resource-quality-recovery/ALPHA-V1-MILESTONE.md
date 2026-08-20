# Prism --- Alpha v1.0 Milestone

**Status:** Proposed milestone definition\
**Created during:** Sprint 78 --- Learner Resource Quality Recovery\
**Purpose:** Define the evidence-backed boundary for Prism Alpha v1.0
and prevent desirable post-Alpha work from silently moving the
milestone.

## 1. Milestone intent

Alpha v1.0 is the point at which Prism can reasonably be described as
the product envisaged by its current core vision, at Alpha maturity.

Alpha does **not** mean feature-complete, defect-free, finished, ready
for every user/use case, or that every desirable workflow or setting has
been implemented. It means the core learning-resource generation system
works sufficiently reliably, faithfully, completely and safely to
justify a named Alpha release.

## 2. Alpha v1.0 product claim

> **Across a deliberately varied benchmark set, Prism reliably carries
> intended instructional design through the complete prompt pipeline
> into a structurally complete, pedagogically faithful, operationally
> usable assembled resource, with known failure classes detected and
> failed closed.**

## 3. Alpha capability claims

### A1 --- Complete

Prism produces and assembles the complete resource required by its
authoritative artefacts, contracts and schema.

The final assembled page/package must not silently lose required
activities, materials, learner-response surfaces, evidence providers,
pedagogical functions, page-level elements, or other
schema/contract-required components.

This claim requires deterministic **whole-resource
completeness/conformance validation** distinct from instructional QA.
Completeness validation must establish what Prism was obliged to produce
and verify that the assembled result contains it.

### A2 --- Faithful

Instructional intent established upstream survives downstream generation
and assembly.

This includes appropriate preservation or legitimate transformation of
learning outcomes, activity purpose, pedagogical functions/beats,
learner production, evidence requirements, practice, review, transitions
and other authoritative instructional obligations.

Faithfulness does **not** require one downstream component per upstream
pedagogical function. Small functions may legitimately be woven into
prose, prompts, materials, workspaces or other learner-facing elements.

Current EP → DLA lineage findings remain subject to repository/history
verification and pre-Alpha hardening.

### A3 --- Operational

Learner activities can actually be completed using the resource Prism
provides.

Required materials, evidence, response surfaces, instructions, worked
support, independent practice, review mechanisms and other operational
dependencies must be usable rather than merely plausible or descriptive.

Sprint 78 operational-suitability work contributes directly to this
claim.

### A4 --- Instructionally good

Representative generated resources consistently demonstrate an
acceptable Alpha instructional-quality floor.

QA remains responsible for instructional-quality judgement. Alpha does
not require perfection or uniformly exceptional scores; it requires
evidence that Prism reliably produces worthwhile learner resources
rather than isolated high-quality demonstrations.

QA is **not** a substitute for structural completeness/conformance
validation.

### A5 --- Robust and safe in failure

Known malformed or contract-invalid artefacts are detected and rejected
at the appropriate boundary.

Prism must not silently continue through verification, assembly or
downstream generation when an authoritative artefact is invalid. Known
failure classes should fail closed where appropriate.

Recovery/regeneration paths should preserve valid upstream work when
possible rather than requiring unnecessary workflow restart.

No Alpha requirement implies sanitising or inferring repairs to
malformed generated JSON.

### A6 --- Repeatable

Alpha claims must be demonstrated across a deliberately varied benchmark
set.

The benchmark set should exercise meaningfully different instructional
and content demands rather than repeatedly proving one favourable case.

Lagrangian Multipliers and Water Cycle/Hydrology are useful benchmark
candidates because they provide contrasting but relatively clean test
domains.

The final benchmark set and required evidence threshold remain to be
defined.

## 4. Alpha release prerequisite --- reproducible deployment package

Alpha v1.0 must be releasable as a defined product.

Before the milestone closes, Prism needs a reproducible mechanism that
can take a known-good project/source state and create the intended
deployment folder/package.

This is a **release prerequisite**, not a learner-resource capability
claim.

Alpha should not mean "deploy whatever happens to be in the development
project folder".

A more sophisticated release/CI/CD architecture is not required unless
evidence shows it is necessary.

## 5. Current pre-Alpha work

The remaining pre-Alpha programme is expected to concentrate primarily
on:

1.  current Sprint 78 quality/reliability closure;
2.  prompt-pipeline hardening where evidence identifies contract,
    lineage or model-compliance weaknesses;
3.  whole-resource deterministic completeness/conformance validation;
4.  representative Alpha benchmark evidence;
5.  reproducible Alpha deployment packaging.

This list may change when evidence demonstrates a genuine Alpha blocker.
New work should not enter the Alpha critical path merely because it is
desirable.

## 6. GAM restructure --- conditional only

A GAM restructure is **not currently an Alpha requirement**.

Do not undertake it before Alpha unless:

1.  evidence demonstrates that the current GAM architecture prevents one
    or more Alpha capability claims from being satisfied; **or**
2.  the value proposition becomes sufficiently overwhelming that the
    pre-Alpha disruption/risk is explicitly accepted.

Default position:

> **Harden the current GAM sufficiently for Alpha and use Alpha as a
> regression baseline for any later restructure.**

## 7. Known work that does not currently block Alpha

### Settings

**Post-Alpha.** Settings are not required for Alpha v1.0. Likely
candidate for Beta or later product maturity.

### Image consistency

**Post-Alpha by default.** Promote only if benchmark evidence
demonstrates inconsistency severe enough to invalidate the Alpha
instructional-quality or usability claim.

### Slideshow / narrated MP4 workflow

**Post-Alpha new capability.** Concept: a slideshow workflow capable of
producing narrated MP4 output from slides using text-to-speech,
effectively creating a simple still-image movie. Potentially valuable,
but expansion of Prism capability rather than completion of the current
Alpha core.

### Formal Governance workflow

**Use the method during pre-Alpha; productisation does not block
Alpha.**

### Formal Generation Forensics workflow

**Use the method during pre-Alpha; productisation does not block
Alpha.** Artefact-grounded generation forensics may support Alpha
hardening without requiring a fixed forensic procedure; investigations
should remain context-driven.

### GAM restructure

**Conditional / post-Alpha by default.** See Section 6.

## 8. Alpha blockers versus later improvements

An issue is an **Alpha blocker** when credible evidence shows that it
prevents one or more Alpha capability claims or the release prerequisite
from being satisfied.

An issue is a **post-Alpha improvement** when resolving it would improve
Prism but is not necessary to substantiate the Alpha claim.

The discovery of a desirable improvement is not, by itself, authority to
move the Alpha milestone.

## 9. Accepted Alpha limitations

Alpha is expected to have known limitations.

A limitation is compatible with release when it is understood, its
impact is bounded, it does not invalidate an Alpha capability claim, it
is explicitly accepted rather than silently ignored, and follow-up work
is recorded where appropriate.

The accepted-limitations list should be finalised during Alpha readiness
review rather than invented prematurely.

## 10. Unknown / unproven is not PASS

For milestone purposes, absence of evidence must not silently become
evidence of success.

Useful milestone evidence states:

-   **PROVEN** --- deterministic/repository evidence establishes the
    claim;
-   **SUPPORTED** --- multiple credible observations support it, but
    further evidence remains appropriate;
-   **UNPROVEN** --- insufficient evidence;
-   **BLOCKED** --- evidence currently demonstrates that the claim
    cannot be made;
-   **ACCEPTED LIMITATION** --- known issue explicitly judged compatible
    with Alpha.

Governance should maintain these distinctions during Alpha readiness
assessment.

## 11. Working Alpha readiness dimensions

  -----------------------------------------------------------------------
  Dimension                           Alpha expectation
  ----------------------------------- -----------------------------------
  End-to-end workflow                 Reliably reaches valid assembled
                                      resource

  Structural completeness             Deterministically verified against
                                      authoritative obligations

  Pedagogical faithfulness            Planned instructional intent
                                      survives generation/assembly

  Operational suitability             Learner can perform the
                                      commissioned work

  Instructional quality               Representative resources clear
                                      agreed Alpha quality floor

  Failure handling                    Known invalid states fail
                                      safely/closed

  Repeatability                       Claims demonstrated across varied
                                      benchmarks

  Release packaging                   Known-good source produces defined
                                      deployment package

  Known limitations                   Explicitly understood and accepted
  -----------------------------------------------------------------------

Exact evidence thresholds remain to be agreed before milestone closure.

## 12. Milestone closure rule

> **Alpha v1.0 is reached when every Alpha capability claim has
> sufficient evidence, no unresolved blocker invalidates those claims,
> the release package can be reproducibly produced, and remaining known
> limitations have been explicitly accepted as compatible with Alpha
> status.**

Completion of every backlog item is **not** an Alpha exit condition.

## 13. Governance questions for future sprint openings

Until Alpha closes, sprint-opening governance should ask:

1.  Which Alpha capability claim or blocker does this sprint advance?
2.  What evidence should exist at sprint closure if it succeeds?
3.  Is proposed work necessary for Alpha, or merely desirable?
4.  Does the sprint introduce unnecessary architectural disruption
    before Alpha?
5.  Are we addressing a verified cause or reacting to a symptom?
6.  Has new evidence genuinely changed the Alpha boundary?
7.  Is the project measurably closer to satisfying the milestone than at
    the previous sprint boundary?

## 14. Current strategic position

Prism already substantially works.

The remaining pre-Alpha challenge appears increasingly to be reliability
engineering around a probabilistic prompt pipeline rather than
construction of the core product from scratch.

The current architecture, interface, deterministic renderer/validation
layers and instructional model provide a substantial base.

The pre-Alpha objective is therefore to make the existing capability:

> **complete, faithful, operational, good, robust, repeatable and
> releasable.**

That is the Alpha v1.0 target.
