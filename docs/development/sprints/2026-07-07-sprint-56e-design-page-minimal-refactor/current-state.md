# Current State

## Core framing
- Design Page is primarily an assembler stage.
- DLA owns activity structure and activity semantics.
- GAM owns learner-facing material bodies.
- Episode Plans own choreography/beats.
- Learning Sequence owns ordering/timing.

## Practical implication
Design Page should assemble authoritative upstream artefacts into a learner-facing page representation and preserve upstream payloads without transformation.

## Current implementation concern
The existing Design Page prompt has accumulated extensive defensive instruction layers (preservation clauses, anti-summarisation rules, anti-regeneration rules, validation declarations, and historical safeguards), which makes behavior difficult to reason about and hard to verify.
