# Sprint 56A — Executive Handover

**Audience:** Future developers, sprint planning, new Cursor sessions, new ChatGPT conversations  
**Date:** 2026-07-06  
**Sprint type:** Planning only

---

## Investigation summary

After Sprint 56 closed the architecture review programme, live Design Page runs continued to show learner-content loss at assembly time despite:

- correct upstream GAM `Content:` bodies
- correct destination field identification
- available Copilot conversation context
- extensive preservation prompt patches (opaque transport, multi-material enumeration, full body preservation, page optimisation override, final learner output, context access)

**Pattern:** the model locates materials, enumerates fields, then **transforms** bodies into summaries, labels, placeholders, or references — sometimes documenting condensation in `generation_notes`.

**Working hypothesis (accepted for planning):**

> Design Page simultaneously acts as assembler, author, narrator, optimiser, and presentation layer. Competing responsibilities create pressure to transform or omit learner content. Preservation failures are architectural symptoms, not isolated defects.

---

## Architecture findings

Source: [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md)

| Finding | Detail |
| ------- | ------ |
| **Five concurrent jobs** | Payload transport, schema assembly, wrapper authoring, renderer metadata (VA), quality enforcement |
| **Core job identified** | Transport + organise upstream learner content into final page JSON |
| **High-conflict areas** | Triple wrapper stack (journey + authorial + rhetoric); knowledge_summary re-authoring; visual affordance specification; `output_density` / brevity params |
| **Essential transport** | GAM materials, DLA activity rows, assessment items, episode plans (verbatim) |
| **Recommended direction** | Three layers: Hard transport → Organise → Optional thin bridge |

Sprint 56 remediation (pack thinning, L4 embed, compose-only scaffold) improved **prompt hygiene** but did not **reduce responsibility count** on the step.

---

## Current confidence levels

| Claim | Confidence | Notes |
| ----- | ---------- | ----- |
| Pipeline upstream of Design Page works | **HIGH** | Generation, elicitation, GAM bodies verified |
| Failures occur primarily at Design Page assembly | **HIGH** | Repeated live + forensic evidence |
| Responsibility conflict is root cause | **MEDIUM–HIGH** | Accepted diagnosis; needs migration plan validation |
| More preservation patches alone will fix the problem | **LOW** | Patches help but accretion continues |
| Sprint 56 GREEN orchestration map is wrong | **LOW** | Stage ownership (DLA→GAM→DP) remains valid; **Design Page internal scope** is overstuffed |
| Target-state architecture is decided | **LOW** | Sprint 56A must produce and approve it |

---

## Objectives

1. Consolidate failure modes and responsibility analysis into sprint-owned artefacts.
2. Define target-state Design Page architecture (transport-first).
3. Produce dependency-aware migration plan with validation strategy.
4. Resolve open architectural questions before implementation.
5. Determine impact on Sprint 57 scope (defer, narrow, or parallelise).

---

## Expected outputs

| Deliverable | File |
| ----------- | ---- |
| Orientation | [SPRINT-56A-START-HERE.md](SPRINT-56A-START-HERE.md) |
| Fresh-session onboarding | [SPRINT-56A-CONTEXT-FOR-NEW-CHAT.md](SPRINT-56A-CONTEXT-FOR-NEW-CHAT.md) |
| Charter | [SPRINT-56A-CHARTER.md](SPRINT-56A-CHARTER.md) |
| Planning backlog | [SPRINT-56A-BACKLOG.md](SPRINT-56A-BACKLOG.md) |
| Open questions | [SPRINT-56A-OPEN-QUESTIONS.md](SPRINT-56A-OPEN-QUESTIONS.md) |
| Failure catalogue | [DESIGN-PAGE-FAILURE-MODES.md](DESIGN-PAGE-FAILURE-MODES.md) |
| Responsibility analysis | [DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md](DESIGN-PAGE-RESPONSIBILITY-ANALYSIS.md) |
| Migration plan (approved) | [SPRINT-56A-IMPLEMENTATION-PLAN.md](SPRINT-56A-IMPLEMENTATION-PLAN.md) |

---

## Inherited references (do not duplicate)

| Topic | Authoritative doc |
| ----- | ----------------- |
| Pipeline model | [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-LEARNER-PIPELINE-REFERENCE.md) |
| Ownership map | [SPRINT-57-ARCHITECTURE-STATE.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-STATE.md) |
| Architecture decisions | [SPRINT-57-ARCHITECTURE-DECISIONS.md](../2026-07-01-sprint-57-learner-experience-product-quality/SPRINT-57-ARCHITECTURE-DECISIONS.md) |
| Sprint 56 closure | [SPRINT-56-CLOSURE-REPORT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-CLOSURE-REPORT.md) |
| Design Page audits | `docs/development/audits/DESIGN-PAGE-*.md` |

---

## Exit signal

Sprint 56A closes when the migration plan is **reviewed and approved** and implementation can begin in a separate sprint with clear scope, risks, and validation gates.
