# Sprint 78 --- Pre-Alpha Hardening and Alpha v1.0 Trajectory

**Status:** Project-position note captured during Sprint 78\
**Purpose:** Record the emerging assessment of Prism's development phase
and why recent discoveries may represent convergence rather than
architectural failure.\
**Scope:** Strategic development context; not an implementation
authorisation.

------------------------------------------------------------------------

## 1. Current project position

The working assessment is:

> **Prism substantially works, but is not yet reliably the product
> described by the vision.**

This distinction matters.

The project is no longer primarily proving that it can generate learning
resources at all. It has:

-   a strong working interface;
-   an architecture that is surviving significant pressure;
-   deterministic validation and rendering layers;
-   a coherent instructional-design direction;
-   increasingly explicit artefact contracts;
-   successful high-quality generation examples;
-   a clearer view of the intended destination.

The dominant pre-Alpha problem is increasingly **reliability and
fidelity through the generative prompt pipeline**.

------------------------------------------------------------------------

## 2. The apparent "two steps forward, one back" pattern

Development can feel non-convergent because two things are improving
simultaneously:

1.  **Product capability is increasing.**
2.  **Our ability to detect deviation from the intended product is
    increasing.**

A resource may now look good and receive a high QA score while still
exposing:

-   missing planned pedagogical functions;
-   incomplete package elements;
-   weak cross-stage lineage;
-   malformed generation;
-   operational-suitability problems;
-   assembly/conformance omissions.

Earlier versions of the project might simply not have detected these
differences.

Therefore:

> Finding a new defect is not, by itself, evidence that Prism is moving
> away from Alpha.

The more useful project-level question is:

> **Is the remaining uncertainty shrinking, and are the Alpha v1.0 exit
> conditions progressively becoming evidenced?**

------------------------------------------------------------------------

## 3. Why the prompt pipeline is now the main hardening surface

The deterministic parts of Prism are comparatively tractable.

If a correctly represented table renders incorrectly, the renderer can
be reproduced, fixed, and regression-tested.

Prompt-pipeline failures are more varied. An observed failure may mean:

-   an obligation was never expressed;
-   an obligation was expressed but not operationalised;
-   an operational obligation was lost between artefacts;
-   the prompt allowed an unintended interpretation;
-   competing instructions reduced salience;
-   the model failed to comply with a clear contract;
-   the output was semantically useful but structurally malformed;
-   downstream validation did not detect the loss.

These causes require different repairs.

The pre-Alpha phase should therefore be understood as **prompt-pipeline
hardening**, not merely prompt wording/tuning.

------------------------------------------------------------------------

## 4. Hardening discipline

Preferred cycle:

``` text
generate
    ↓
benchmark / validate / QA
    ↓
detect a bounded failure
    ↓
artefact-grounded generation forensics
    ↓
repository verification of the causal hypothesis
    ↓
repair the causal boundary
    ↓
regression tests
    ↓
fresh benchmark
```

Do not harden a prompt until evidence distinguishes, as far as possible:

-   contract gap;
-   lineage gap;
-   model non-compliance;
-   deterministic downstream defect.

Avoid accumulating generic exhortations such as "ensure", "always
preserve", or "do not omit" without a clear operational contract.
Excessive salience patches can make a probabilistic pipeline less
coherent.

------------------------------------------------------------------------

## 5. DLA overhaul: working hypotheses, not conclusions

The recent DLA overhaul is a plausible source of some current issues
because it is the major architectural area recently changed.

However, future investigation should not begin with:

> The DLA overhaul broke these things.

At least three categories are plausible.

### A. Genuine regressions

A previously working or explicitly contracted behaviour was weakened or
removed by the overhaul.

### B. Pre-existing gaps now exposed

The earlier system may have appeared to work because the model
generously filled an under-specified contract.

The more explicit DLA architecture may now make that missing guarantee
visible.

### C. Newly enforceable requirements

The overhaul introduced sufficiently explicit concepts --- for example
production, response fulfilment, practice independence, evidence, and
diagnostic review --- that shortcomings can now be represented and
detected as failures.

This is architectural progress even when it initially increases the
visible defect count.

Repository/history evidence is required to classify individual findings.

------------------------------------------------------------------------

## 6. Pedagogical richness and EP → DLA lineage

Hydrology and Lagrangian investigations have produced a supported
hypothesis that some EP-selected pedagogical functions may have weaker
operational lineage into DLA than functions with explicit downstream
machinery.

This may help explain some "richness" feedback.

Important qualification:

> **Richness is not the number of materials or page components.**

Many pedagogical functions are intentionally small and should be woven
into prose, prompts, transitions, comparisons, reflection cues, or
existing materials.

The desired property is not component proliferation.

The desired property is **faithful manifestation of deliberately planned
pedagogical functions**.

This hypothesis still requires repository/history verification before
repair.

------------------------------------------------------------------------

## 7. Structural completeness is distinct from instructional QA

Sprint 78 benchmark experience has reinforced a distinction between:

### Instructional QA

> Is this a high-quality learner resource?

and:

### Whole-package deterministic conformance

> Did Prism actually produce and assemble the elements that its
> schema/contracts say should exist?

A resource can score highly while still omitting expected page/package
elements.

Whole-package conformance is therefore a separate concern from QA and is
a strong candidate for promotion in the post-Sprint-78 / Sprint-79
planning horizon.

The existing schema is likely to be an important authority for that
deterministic review.

------------------------------------------------------------------------

## 8. Alpha v1.0 working target

The exact milestone definition should be created through Governance
rather than silently fixed by this note.

A useful working statement is:

> **Across a deliberately varied benchmark set, Prism reliably carries
> intended instructional design through the complete prompt pipeline
> into a structurally complete, pedagogically faithful, operationally
> usable assembled resource, with known failure classes detected and
> failed closed.**

Candidate Alpha dimensions include:

-   end-to-end workflow reliability;
-   structural conformance;
-   pedagogical lineage;
-   material operational suitability;
-   complete assembly;
-   instructional-quality floor;
-   safe failure handling;
-   representative benchmark coverage;
-   acceptable/known Alpha limitations.

These are candidate dimensions, not yet approved release gates.

------------------------------------------------------------------------

## 9. Why the current position is encouraging

Recent problems often do **not** demonstrate absence of capability.

Prism has already demonstrated, across different runs, capabilities such
as:

-   strong instructional-quality scores;
-   high-quality generated graphics;
-   correct tables/workspaces;
-   complete packages;
-   strong model/practice independence;
-   strong diagnostic review;
-   operationally suitable generated materials.

The recurring issue is often that an existing capability is not yet
**reliably commissioned, preserved, bound, generated, validated, or
assembled**.

That is a different engineering problem from discovering that the
underlying architecture cannot support the vision.

The architecture is being stressed and, so far, is more often revealing
hardening needs than requiring fundamental replacement.

------------------------------------------------------------------------

## 10. Two development practices discovered during Sprint 78

Two complementary practices may materially improve the route to Alpha.

### Artefact-Grounded Generation Forensics

Reduces the cost of answering:

> Why did this generation outcome happen?

It uses exact prompts/artefacts to narrow the causal hypothesis before
Cursor investigates implementation/history.

### Governance

Improves the ability to answer:

> Are we actually getting closer to the milestone?

It maintains project trajectory, milestone evidence, sprint alignment,
debt, and curated programme memory.

Together:

> **Forensics reduces the cost of understanding failure. Governance
> makes convergence visible.**

------------------------------------------------------------------------

## 11. Implication for the remaining pre-Alpha period

The likely dominant work pattern is:

-   fewer new foundational capabilities;
-   more prompt-contract hardening;
-   more cross-stage lineage verification;
-   more deterministic conformance;
-   more benchmark repetition;
-   targeted repair of proven causal boundaries;
-   explicit classification of accepted Alpha limitations;
-   deliberate protection against scope growth.

This should be treated as a phase of **reliability engineering for a
probabilistic pipeline**.

------------------------------------------------------------------------

## 12. Turning-point hypothesis

Sprint 78 may prove significant for more than the individual WS1/WS2/WS3
repairs.

It has also exposed or clarified:

-   the need to distinguish QA from deterministic whole-package
    conformance;
-   the value of artefact-grounded generation forensics;
-   the need for project/milestone governance above the sprint layer;
-   the importance of curated programme-level memory;
-   a clearer conception of Alpha v1.0 as an evidence-backed milestone;
-   the shift from capability-building toward prompt-pipeline hardening.

Whether this is genuinely a turning point should be judged
retrospectively by later evidence.

For now, preserve it as a working project-position record rather than
declaring success in advance.
