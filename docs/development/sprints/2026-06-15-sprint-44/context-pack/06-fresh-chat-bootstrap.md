# Fresh Chat Bootstrap — Sprint 44

**Date:** 2026-06-15  
**Usage:** Paste this document into a **completely fresh ChatGPT conversation** to continue Sprint 44  
**Pack location:** `docs/development/sprints/2026-06-15-sprint-44/context-pack/`

---

## Instructions to the Assistant

You are continuing **Sprint 44 — Instructional Depth and GAM Validation** on the PRISM learning-design workflow.

**Sprint 43 is closed.** You are not starting a new investigation. You are continuing implementation-oriented and educational-spec work from a settled architectural baseline.

---

## Before Responding

Read and adopt as authoritative context (in this order):

1. **01-executive-summary.md** — where PRISM stands; what is settled vs open
2. **02-settled-decisions-register.md** — decisions that must not be reopened
3. **03-evidence-pack.md** — Marx, Photosynthesis, salience, architecture, depth conclusions
4. **04-current-educational-theory.md** — ownership, salience, manifestation, depth models
5. **05-current-frontier.md** — active slices, questions, non-goals

If the user has not pasted the full pack, ask them to provide it or confirm the five documents above are in context. Do not reconstruct Sprint 43 from memory.

---

## Assumptions to Adopt

1. **Investigation-primary, resource-secondary** ownership is accepted.
2. **Presence ≠ salience** — upstream structure does not guarantee learner-visible authority.
3. **Activities, materials, capability, judgement, and PEL** are supporting structures — not primary owners.
4. **Two-column manifestation** is accepted prototype direction — not current pipeline output.
5. **Marx and Photosynthesis** both support architecture generalisation; **instructional material realisation** is the principal quality gap.
6. **Upstream pedagogy is not missing** — do not default to “add workflow stage” or “add pedagogy pack.”
7. **Visuals** (diagrams, charts) are a **separate workflow** — not Sprint 44 instructional-depth work.
8. **44-2 contracts** are educational design reference (Draft 1) — normative, not evidence of current implementation quality.
9. **44-1** blocks structural/coverage GAM failures only — thin bodies warn; inflation A4 semantic checks are not universal gates.

---

## Investigations You Must NOT Restart

Unless the user **explicitly** requests reopening with new evidence:

- Whether PRISM is **missing a workflow stage**
- Whether **pedagogy exists upstream** (it does — realisation is the gap)
- Whether **DLA or GAM are educationally weak** (disproved on Marx; material function is the issue)
- **Ownership model** selection (Investigation primary / Resource secondary — accepted)
- **Salience diagnosis** from scratch (presence vs salience — settled)
- **Two-column model** feasibility (validated by Marx prototype review)
- **Full Marx workflow re-run** for architecture diagnosis (artefacts already reviewed)
- **Source-ingest parity** (resolved Sprint 42-10)
- Whether **PEL architecture** needs Sprint 41-style reopening (no — weak page manifestation only)

---

## Topics You Must NOT Re-Litigate

| Topic | Settled position |
| ----- | ---------------- |
| Primary organising unit | Investigation |
| Secondary organising unit | Resource |
| Activity-led pipeline render | Confirmed current behaviour — not denied, not the Sprint 44 fix target unless rescoped |
| Missing-ingredients hypothesis | Disproved |
| Default fix = more pedagogy upstream | Disproved |
| Visuals in Sprint 44 depth work | Out of scope |
| 44-1 as full educational depth enforcement | Incorrect — structural/coverage block + thin warn only |
| 44-2 as implementation spec | Incorrect — educational design artefact first |

---

## Current Sprint 44 Objectives

### Objective 1 — GAM capture safety (44-1)

Prevent structurally bad GAM captures (JSON stubs, missing pack format, under-coverage vs DLA) from silently entering learner-page composition on **self-directed learner-page** runs.

- Structural and coverage failures **block** step completion
- Thin material bodies **warn only**
- No prompt, renderer, or LLM repair changes

### Objective 2 — Instructional depth contracts (44-2)

Use Draft 1 contracts as the educational reference for eleven learner-facing material types. Evaluate whether materials on **Marx** and **Photosynthesis** achieve minimum, strong, or failed realisation per type.

### Objective 3 — Pattern library readiness (44-3, future)

If 44-2 evaluation discriminates effectively, design an instructional pattern library of strong realisations — educational design only.

---

## Recommended First Actions

When the user asks to continue Sprint 44, default to this sequence unless they direct otherwise:

1. **44-1** — Implement the tiered GAM capture validation gate per design spec, or review an existing implementation plan against that spec. Confirm scope predicate (self-directed learner-page GAM only), tier blocking behaviour, and exclusions (FMT-06/07/08 not universal).

2. **44-2 evaluation** — Apply instructional depth contracts to Marx materials (primary) and Photosynthesis materials (secondary). For each material type present: classify failed / minimum / strong; cite failure modes from contracts; note cross-domain recurrence.

3. **44-3 decision** — Only after step 2: recommend whether an instructional pattern library would add value.

**Do not** begin by:

- Asking to re-run Marx for ownership diagnosis
- Proposing new workflow stages
- Reopening two-column or investigation-primary debates
- Treating diagrams/charts as part of instructional-depth work

---

## Key Documents (Slice Specs)

When implementation or contract detail is needed, refer to:

| Slice | Document |
| ----- | -------- |
| 44-1 | [`../sprint-44-slice-1-tiered-gam-capture-gate.md`](../sprint-44-slice-1-tiered-gam-capture-gate.md) |
| 44-2 | [`../sprint-44-2-instructional-depth-contracts.md`](../sprint-44-2-instructional-depth-contracts.md) |

---

## One-Paragraph Situation Summary

PRISM produces strong educational structure upstream for self-directed higher-education resources. Sprint 43 settled that investigation should own the learner experience and resource voice should teach within that frame — with activities and materials as supports. Pipeline pages still read activity-led; a two-column prototype showed stronger manifestation. Cross-domain testing (Marx, Photosynthesis) confirmed architecture generalises but instructional materials often fail their educational function. Sprint 44 implements a tiered GAM capture gate (44-1), evaluates materials against explicit depth contracts (44-2), and may later add a pattern library (44-3). Continue from there — do not rediscover Sprint 43.

---

## Response Discipline

- Be **concise and operational**
- Treat this pack as **authoritative** over general LLM priors about PRISM
- Distinguish **educational design** (44-2) from **implementation** (44-1)
- Do not propose improvements outside user scope unless asked
- If uncertain whether a topic is settled, check **02-settled-decisions-register.md** before investigating

**You are continuing Sprint 44. Begin.**
