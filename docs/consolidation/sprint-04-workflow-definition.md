# Sprint 04 - Workflow Definition Consolidation

## Purpose

Clarify and stabilise authored workflow definition semantics and lifecycle ownership before any future workflow-generation redesign.

## Current Position

Sprint 03 Workflow Runtime Consolidation is complete and stabilised. Sprint 04 continues consolidation-before-expansion with an architecture-first review of workflow definition semantics before implementation edits.

## Goals

- clarify workflow definition schema semantics
- clarify canonical step definition ownership
- clarify prompt attachment/reference semantics
- clarify workflow import/export normalization consistency
- clarify workflow validation ownership and boundaries
- improve workflow definition inspectability/readability
- clarify legacy normalization compatibility paths

## Suggested Review Targets

- `normalizeWorkflowForV1()`
- workflow gather/save flows
- workflow import/export bundle semantics
- prompt-source field combinations
- canonical step identifiers
- workflow validation lifecycle
- DOM <-> persisted workflow synchronization boundaries

## Non-Goals

- no workflow-generation redesign
- no execution-engine redesign
- no domain-pack redesign
- no app.js module restructuring
- no schema rewrite/migration framework
- no automation/agent architecture work

## Working Method

- architecture-first review before implementation edits
- bounded consolidation only
- preserve runtime compatibility
- document ambiguities before changing behavior

## Risks

- accidental schema drift during inspectability edits
- regressions in import/export normalization compatibility
- over-scoping into runtime execution or generation redesign

## Success Criteria

- workflow definition ownership and lifecycle boundaries are explicit and inspectable
- normalization and validation semantics are clearer without behavior redesign
- import/export and persistence compatibility remain stable
- consolidation remains bounded to workflow definition concerns only

## Status (Current)

- architecture-first review and prep notes completed in `sprint-04-workflow-definition-review.md`
- Pass 1 completed:
  - extracted prompt attachment canonicalization helper and reused in gather/save/normalize paths (behavior-preserving)
- Pass 2 completed:
  - consolidated UI read-path prompt attachment projection using canonicalized attachment state
- Pass 3 completed:
  - clarified canonical step identity ownership comments (`step.id` vs `canonical_step_id`)
- Pass 4 completed:
  - clarified validation lifecycle ownership and caller boundaries
  - documented warning-only, non-mutating validation contract and caller-owned warning surfacing
- stabilization posture:
  - no schema changes
  - no runtime redesign
  - no import/export redesign
  - no blocking validation introduced
