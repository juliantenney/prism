# PRISM Shared Operational Vocabulary

These phrases are lightweight operational shorthand used across PRISM development sessions involving:

- Julian
- ChatGPT
- Cursor

The goal is:

- continuity
- consistency
- bounded architectural work
- reduced conversational overhead
- coherent architectural traceability

These are conventions, not strict commands.

## "Close this chat down"

Meaning:

Perform end-of-session workflow including:

- docs updates
- continuity updates
- handover preparation
- bootstrap preparation
- next bounded task definition
- commit/check-in preparation

## "Prepare the next chat"

Meaning:

Generate:

- suggested next bounded task
- bootstrap prompt
- relevant file list
- constraints/context for the next chat

## "Prepare context pack"

Meaning:

Create a bounded file bundle for the next architectural chat including:

- core continuity files
- latest handover/bootstrap
- relevant sprint definition
- relevant implementation files
- relevant architecture/spec docs only

Clarification:

Context packs should remain intentionally minimal and tightly aligned to the next bounded task. They are not archives, backups, or full project exports.

## "Run continuity update"

Meaning:

Review and update:

- `current-state.md`
- decisions log (if needed)
- handover docs/templates
- relevant continuity information

## "Bootstrap this task"

Meaning:

Create:

- bounded task definition
- recommended files
- architectural constraints
- suggested starting prompt

## "Consolidation pass"

Meaning:

Focus on:

- cleanup
- clarification
- rationalisation
- consistency
- stability

Avoid:

- major feature expansion
- speculative redesign
- unrelated refactors

## "Architectural review"

Meaning:

Prioritise:

- conceptual clarity
- semantics
- responsibilities
- system boundaries
- contracts/schemas

Implementation should remain secondary.

## "Smoke-check"

Meaning:

Perform lightweight runtime/path/UI verification without broad testing or refactoring.

## "Bounded task"

Meaning:

A tightly scoped architectural or implementation objective suitable for a single coherent chat/session.

Clarification:

Chats should generally focus on one bounded task at a time.

## "Prepare check-in"

Meaning:

Generate:

- concise coherent commit/check-in message
- summary of architectural significance
- summary of major changes
- reminder to verify checklist/docs continuity before commit

Clarification:

Check-ins should represent coherent architectural or consolidation progress, not arbitrary file edits.

