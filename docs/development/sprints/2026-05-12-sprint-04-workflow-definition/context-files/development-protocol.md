# PRISM Development Protocol

## Purpose

PRISM is now in a consolidation/stabilisation phase.

This protocol defines a lightweight, practical way of working that preserves architectural continuity, reduces conceptual drift, and supports smooth handovers between development sessions.

## Core Principles

- consolidation before expansion
- architectural clarity over rapid feature growth
- explicit workflow semantics
- artefact-centric architecture
- HTML-first philosophy
- inspectability over hidden automation
- domain packs as structured constraint systems

## Development Workflow

Typical cycle:

1. clarify architecture
2. implement narrowly
3. verify
4. update docs
5. record decisions
6. perform continuity update
7. check in coherent changes

## Sprint Transition Standard (Canonical)

Every sprint transition should produce one portable sprint folder:

`docs/development/sprints/YYYY-MM-DD-sprint-name/`

Required files inside:

- `SPRINT-CONTEXT.md`
- `GPT-BOOTSTRAP-PROMPT.md`
- `CURRENT-STATE.md`
- `HANDOVER.md`
- `context-files/`

`context-files/` rule:

- contain copied physical snapshots of bounded sprint files
- do not use references/symlinks
- keep set intentionally minimal and directly uploadable to fresh chats

Purpose:

- make fresh chat startup low-friction
- preserve bounded continuity
- avoid ad-hoc file selection each restart

### Canonical vs Legacy

Canonical continuity sources remain:

- `docs/development/current-state.md`
- `docs/development/session-handovers/`
- `docs/development/chat-bootstraps/`
- `docs/consolidation/`

Sprint folders are portable snapshots for restart convenience.

Legacy/superseded pattern:

- `docs/development/context-packs/` naming is now legacy terminology.
- Existing context-pack artifacts remain valid historical references, but new sprint transitions should use sprint folders under `docs/development/sprints/`.

## Cursor / ChatGPT Collaboration Model

### ChatGPT

- architecture
- synthesis
- critique
- continuity
- conceptual modelling

### Cursor

- implementation
- refactoring
- filesystem operations
- runtime verification
- targeted execution tasks

## Important Rules

- avoid uncontrolled feature expansion
- archive before delete
- avoid large conceptual rewrites during implementation work
- preserve manifest/runtime stability during consolidation
- keep domain-pack filenames stable unless explicitly planned

## Chat Lifecycle Model

START CHAT

- bootstrap relevant context
- define bounded task

WORK SESSION

- architecture + implementation + verification

STABILISE

- docs + decisions + continuity update

CHECK-IN

- coherent commit/checkpoint

HANDOVER

- generate sprint bootstrap prompt
- generate portable sprint folder

NEW CHAT

- continue bounded architectural task

## How to Start a Fresh Sprint Chat

1. Open a new chat.
2. Open the latest sprint folder in `docs/development/sprints/`.
3. Upload `context-files/` bounded files plus sprint snapshot docs as needed.
4. Paste `GPT-BOOTSTRAP-PROMPT.md`.
5. Start with architecture-first review before implementation edits.

