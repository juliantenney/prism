# Hotfix — brief resolution defaults for learner-resource workflows

**Date:** 2026-05-21  
**Scope:** Resolver / defaulting / policy cleanup only (no new workflow steps or UI features).

## Problem

RNA transcript and similar **self-study learner-page** briefs could still show resolved assumptions such as `delivery_pattern: face_to_face`, `learning_environments: classroom`, and placeholder topics like “the uploaded transcript” — misleading for async self-directed resources.

## Revised defaulting policy

After explicit factors, inference rules, and factor defaults, **`reconcileWorkflowBriefPedagogicFactors`** applies:

1. **Learner-resource self-directed intent** (when brief signals self-study, uploaded source + learner page, revision resource, generic learner-facing page, etc., and **not** facilitated workshop/seminar/live-session cues):
   - `delivery_context` → `self_directed`
   - `delivery_mode` → `async` (replaces incidental `live_workshop` from generic “session” wording)
   - `delivery_pattern` → `mostly_online` (replaces `face_to_face` default)
   - `learning_environments` → drop `classroom`; default to `vle` for digital learner resources

2. **Facilitated signals preserved** — workshop, seminar, facilitator-led, classroom teaching/session, in-person, synchronous, group activity, etc. skip the alignment and keep classroom / face-to-face defaults where appropriate.

3. **Topic from uploaded material** — placeholder topics (`the uploaded transcript`, etc.) are replaced when inputs/goal contain a semantic subject (e.g. “transcript on RNA viruses and hepatitis C”). If no subject is available at brief-resolution time, placeholder topic is **cleared** rather than shown as a false label (topic may be filled after source modelling).

## Why stabilisation, not a feature

This adjusts precedence of existing brief factors and reconciliation — no new fields, steps, or renderer behaviour.

## Limits

- Topic extraction at brief time is **pattern-based** on goal/inputs text only; rich semantic titles from Normalize/Model Knowledge are **not** available until later steps.
- `learning_environments` uses pack values (`vle`, not a separate `independent_study` enum).

## Tests

`tests/workflow-brief-learner-resource-defaults.test.js`

## Code

- `app.js` — `isWorkflowBriefFacilitatedDeliveryIntent`, `isWorkflowBriefLearnerResourceSelfDirectedIntent`, `applyLearnerResourceBriefDeliveryAlignment`, `reconcileWorkflowBriefTopicFromSource`
- `domains/learning-design/domain-learning-design-step-patterns.md` — inference rules for self-study / learner-resource cues
