# Sprint 74B — Next-chat briefing

**Pack status:** **OPEN**  
**Decisions:** S74B-D01 · **S74B-D02 Accepted** · **S74B-D03 Accepted**  
**Programme:** **S74-D09 Accepted** (pre-release Compatibility not default)  
**Removal plan:** [S74B-T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md) (reconciled)  
**Parent:** Sprint 74 — **OPEN** · 74C **Not opened**

---

## One-line mission

When authorised, execute **S74B-T-040** using reconciled T-030 slices (compose path, PR-W\* aliases, legacy capture shims, dead `partialPageOutputs: false` branches). Do not rewrite assemble or open 74C.

> Preserve current intended functionality, not historical pre-release data shapes or superseded implementation behaviour.

---

## Read first

1. [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) · [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation)  
2. [S74B-T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md)  
3. [decisions.md — S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture)  
4. [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  

---

## Current task

**S74B-T-040** — Execute evidenced removals (**Not started**). Do not begin until authorised.

Keep every intermediate commit green: retarget/delete compose-dependent tests **before or atomically with** module deletion.

---

## Hard rules

- D02/D03 do **not** authorise assemble rewrite, pedagogy redesign, renderer changes, or 74C  
- Historical pre-release state does **not** require Compatibility migrations  
- Live non-deprecated self-directed scaffolds are **not** PR-W thin aliases  
- Node suites = supporting evidence; browser path for Authoring spot-check after capture/compose slices  
