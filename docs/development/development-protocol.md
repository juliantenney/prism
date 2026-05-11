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

- generate next-chat bootstrap
- prepare bounded context pack

NEW CHAT

- continue bounded architectural task

