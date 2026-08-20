# Sprint 78 --- Artefact-Grounded Generation Forensics

**Status:** Working method discovered during Sprint 78; not yet formal
Prism workflow\
**Purpose:** Preserve a potentially high-value diagnostic technique
discovered while investigating learner-resource quality and EP → DLA
lineage.\
**Scope:** Development methodology only. This record does not authorise
production, prompt, schema, validator, assembly, renderer, or workflow
changes.

------------------------------------------------------------------------

## 1. Why this note exists

Sprint 78 has repeatedly required expensive investigation of failures
that become visible only after generation. A repository-wide Cursor
audit can reconstruct the relevant prompt contracts, validators, tests,
history, and implementation, but that is an unnecessarily expensive
first move when the generation conversation itself can perform useful
semantic triage against the exact artefacts it produced.

During Hydrology and Lagrangian Multipliers investigations, a more
efficient diagnostic pattern emerged:

``` text
natural benchmark run
    ↓
preserve exact prompts + exact artefacts
    ↓
LLM forensic comparison of adjacent workflow stages
    ↓
bounded, falsifiable causal hypothesis
    ↓
Cursor verifies or falsifies that hypothesis against repository/history
    ↓
only then consider repair
```

The LLM forensic step is **not authoritative evidence about
implementation**. Its value is reducing the search space before
repository investigation.

------------------------------------------------------------------------

## 2. Name

Working name:

> **Artefact-Grounded Generation Forensics**

The defining property is **artefact grounding**. The LLM must reason
from the exact prompts and artefacts supplied from the run, not from
memory of the conversation.

------------------------------------------------------------------------

## 3. Why it matters

A generation LLM has unusually useful semantic context for questions
such as:

-   What did the upstream artefact appear to require?
-   Which downstream element appears to realise that obligation?
-   Was a pedagogical function preserved explicitly, woven into another
    element, transformed, weakened, omitted, or misbound?
-   Does the prompt contain an operational rule for the function, or
    only a general instruction to preserve it?
-   Is the observed problem more consistent with model non-compliance,
    contract weakness, permitted transformation, or insufficient
    evidence?

These are expensive questions to begin by asking of the whole
repository.

The forensic pass can instead produce a narrow claim for Cursor to test,
for example:

> Verify whether `revision` has an operational manifestation contract in
> current DLA, and whether that changed during the DLA restructure.

That is materially smaller than:

> Audit the EP → DLA architecture and determine why pedagogical richness
> is being lost.

------------------------------------------------------------------------

## 4. Role in the Prism team

### Generation Forensics Analyst --- Copilot / workflow LLM

**Responsibility:** Examine completed Prism workflow runs using exact
prompts and exact artefacts. Trace obligations and pedagogical intent
across workflow boundaries and identify where they appear to have been
preserved, woven, transformed, weakened, omitted, misbound, or
corrupted.

**Authority boundary:** Findings are diagnostic hypotheses, not
repository truth.

Any finding that would justify a production, prompt, schema, validator,
assembly, renderer, or workflow change must be independently verified
against the repository.

------------------------------------------------------------------------

## 5. Core evidence rules

1.  **Do not diagnose from memory when the artefact can be supplied.**
2.  Use the exact upstream artefact, exact downstream artefact, and
    exact stage prompt as authoritative evidence.
3.  Work boundary-by-boundary where possible: EP → DLA, DLA → GAM, GAM →
    sequence/assembly, etc.
4.  Distinguish:
    -   explicit contract requirement;
    -   permitted transformation;
    -   contract / architecture gap;
    -   apparent generation non-compliance;
    -   insufficient evidence.
5.  Semantic preservation does **not** require structural duplication.
6.  A pedagogical beat may be realised by:
    -   a distinct material;
    -   a learner task;
    -   a workspace;
    -   a review/check;
    -   a bridge;
    -   micro-copy or prose;
    -   a combination of elements.
7.  Do not assume one beat = one component.
8.  Do not assume more beats = better design.
9.  Do not prescribe a production repair during the forensic pass.
10. Preserve malformed output and report corruption separately from
    semantic analysis.

------------------------------------------------------------------------

## 6. Avoiding benchmark pollution

Do **not** prime a normal benchmark run with the suspected failure mode.

Telling the generator in advance that preservation, transfer, revision,
richness, or another suspected property will be audited may change
generation behaviour and invalidate the benchmark as evidence of normal
Prism behaviour.

Preferred protocol:

``` text
run Prism normally
    ↓
preserve artefacts exactly
    ↓
after generation, switch to forensic analysis
```

Prospective / instrumented runs may later be useful as deliberate
experiments, but they must not be confused with blind benchmark
evidence.

------------------------------------------------------------------------

## 7. Hydrology proof of concept

The Hydrology investigation showed why artefact grounding is essential.

An initial retrospective answer reconstructed the Episode Plan
incorrectly. Once the actual artefacts and prompt were supplied, the
diagnosis changed materially.

The grounded comparison identified a more precise hypothesis: EP can
plan pedagogical functions that DLA is told to consume as authoritative,
while some functions lack an equally explicit downstream manifestation
mechanism.

This changed the question from:

> Why is the resource missing a transfer task?

to:

> Which EP pedagogical functions have operational DLA lineage, and which
> are only declaratively preserved?

That is a much more useful repository-verification question.

------------------------------------------------------------------------

## 8. Lagrangian blind replication

A second experiment used Lagrangian Multipliers without telling the
forensic prompt about the Hydrology result.

The purpose was to avoid leading the analysis toward the existing
hypothesis.

The independent comparison again suggested a distinction between:

-   functions with explicit downstream machinery, which are strongly
    preserved; and
-   selected pedagogical functions without equally explicit
    manifestation machinery, which are more weakly represented or
    absent.

The diagnostic also recognised legitimate elaboration and woven
manifestations rather than mechanically treating every structural
difference as a defect.

This is **supporting evidence**, not yet repository proof.

------------------------------------------------------------------------

## 9. Important architectural nuance: richness is not component count

The working hypothesis must **not** be translated into "generate a
separate material for every EP beat".

A beat is a pedagogical function.

Some functions may require substantial learner-facing activity. Others
may be realised by a sentence, prompt refinement, contrast, transition,
reflection cue, or small addition woven into another material.

The desired invariant is closer to:

> **Every pedagogical function deliberately selected by EP should have
> an accountable downstream manifestation appropriate to that
> function.**

This allows richness without component proliferation.

It may also help explain learner-resource "richness" feedback: loss of
several small pedagogical moves can make a resource feel generic even
when its major activities and materials remain sound.

------------------------------------------------------------------------

## 10. Division of labour

  -----------------------------------------------------------------------
  Role                                Primary question
  ----------------------------------- -----------------------------------
  Deterministic validators            What can be proven structurally
                                      wrong?

  QA                                  How good is the learner resource?

  Generation Forensics                What appears to have happened
                                      across the generation artefacts and
                                      contracts?

  Cursor / Repository Investigation   Is the forensic causal hypothesis
                                      true in implementation/history?

  Design Authority                    What behaviour and architecture
                                      should Prism have?

  Governance                          Given the evidence and target, what
                                      are we justified in doing next?
  -----------------------------------------------------------------------

Generation Forensics should narrow Cursor work, not replace it.

------------------------------------------------------------------------

## 11. Cursor economy principle

Repository investigation should begin with the **smallest falsifiable
claim** supported by the forensic evidence.

Preferred:

> Verify whether current Step 5 operationalises `revision` downstream
> from EP, and compare only the immediate pre-restructure
> contract/history required to establish whether this changed.

Avoid by default:

> Audit all DLA architecture, prompts, tests, documentation, and
> history.

Expand only when the bounded evidence genuinely requires it.

------------------------------------------------------------------------

## 12. Candidate formal workflow

Do not implement yet. Refine through manual use first.

A future Prism diagnostic workflow could accept:

1.  upstream artefact;
2.  downstream artefact;
3.  exact generation prompt;
4.  optional adjacent validator output.

It would return a structured forensic record containing:

-   upstream obligations;
-   downstream manifestations;
-   explicit / woven / plausible / absent / insufficient
    classifications;
-   contract lineage strength;
-   model non-compliance candidates;
-   contract-gap candidates;
-   corruption findings;
-   smallest repository-verification questions.

------------------------------------------------------------------------

## 13. Current evidence status

**Technique usefulness:** strongly supported by Sprint 78 experience.

**EP → DLA lineage hypothesis:** supported by two artefact-grounded
investigations; repository/history verification still required.

**Production repair:** not authorised by this note.

------------------------------------------------------------------------

## 14. Next use

When Cursor capacity returns:

1.  use Generation Forensics first for semantic generation failures
    where exact artefacts/prompts are available;
2.  convert findings into the smallest repository-verification
    questions;
3.  ask Cursor to verify/falsify rather than rediscover;
4.  only design a repair after causal verification.

This method should be treated as a candidate standard Prism engineering
practice if repeated use continues to prove reliable and economical.
