# Fresh Chat Bootstrap — Sprint 45

**Date:** 2026-06-18  
**Usage:** Paste this document into a **completely fresh conversation** to continue PRISM after Sprint 44 closure  
**Pack location:** `docs/development/sprints/2026-06-18-sprint-45-pattern-guided-generation/context-pack/`

---

## Instructions to the Assistant

You are continuing **PRISM** after **Sprint 44 — Instructional Depth and GAM Validation** (closed).

**Sprint 45 — Pattern-Guided Generation** is **proposed, not yet started, and not automatically approved.**

You are **not** starting a new architectural investigation. You are continuing from a settled educational baseline with a **proposed** experimental frontier: whether validated instructional patterns can influence GAM generation quality.

---

## Before Responding

Read and adopt as authoritative context (in this order):

1. **01-executive-summary.md** — Sprint 44 closure; Pattern Library v1; why Sprint 45 is proposed
2. **02-settled-decisions-register.md** — decisions that must not be reopened
3. **03-evidence-pack.md** — benchmark corpus, evaluation, patterns, why SP-02/SP-03 are first candidates
4. **04-current-educational-theory.md** — patterns as operational architecture; learner ownership; body vs composition
5. **05-current-frontier.md** — proposed Sprint 45 slices, non-goals, recommended first action

If the user has not pasted the full pack, ask them to provide it or confirm the five documents above are in context. Do not reconstruct Sprint 43 or Sprint 44 from memory.

---

## Assumptions to Adopt

1. **Sprint 44 is closed** — contracts, corpus, patterns, and evaluation chain are settled evidence.
2. **Investigation-primary, resource-secondary** ownership is accepted.
3. **Presence ≠ salience** — upstream structure does not guarantee learner-visible authority.
4. **Missing workflow stage** and **missing upstream pedagogy** hypotheses are **disproved**.
5. **Material realisation** is the validated quality frontier — not architecture.
6. **44-2 contracts** (Draft 1) govern evaluation verdicts — patterns are subordinate.
7. **Pattern Library Draft 1** (SP-01–SP-06) and **MP-1–MP-8** are documentary synthesis — MPs do not add verdict tiers.
8. **FM-01, FM-12** are capture/channel artefacts — not instructional patterns.
9. **Sprint 45 is proposed** — do not treat slices as approved or in progress unless the user confirms.
10. **Do not modify code** or start implementation without **explicit user instruction**.

---

## Investigations You Must NOT Restart

Unless the user **explicitly** requests reopening with new evidence:

- Whether PRISM is **missing a workflow stage**
- Whether **pedagogy exists upstream** (it does — realisation is the gap)
- **Ownership model** selection (Investigation primary / Resource secondary)
- **Salience diagnosis** from scratch (presence vs salience — settled)
- **44-2 contract redesign**
- **Pattern Library architecture redesign**
- **Two-column model** feasibility (validated Sprint 43)
- Full **Marx workflow re-run** for architecture diagnosis

---

## Topics You Must NOT Re-Litigate

| Topic | Settled position |
| ----- | ---------------- |
| Primary organising unit | Investigation |
| Secondary organising unit | Resource |
| Missing-ingredients hypothesis | Disproved |
| Default fix = more pedagogy upstream | Disproved |
| Patterns as unvalidated prompts | Not allowed — injection must be measured |
| Meta-principles as verdict criteria | Incorrect — 44-2 governs |
| Capture artefacts as SP entries | Incorrect — FM-01/FM-12 are channel issues |
| Sprint 45 auto-approved | Incorrect — proposal only |
| Broaden to all six patterns immediately | Incorrect — 45-1 scopes SP-02 + SP-03 first |

---

## Proposed Sprint 45 Objectives (If Approved)

### 45-1 — Pattern Injection Experiment

Test whether **SP-02** (`decision_table`) and **SP-03** (`transfer_prompt`) can be deliberately induced in generated GAM materials.

### 45-2 — Pattern-Aware Evaluation

Evaluate generated bodies for pattern Detection Signals, failure-mode absence, and 44-2 verdicts.

### 45-3 — Regression Against Benchmark Corpus

Compare generation outputs to frozen Marx / Photosynthesis corpus.

### 45-4 — Material-Level Repair Strategy

Explore repair of weak bodies without full workflow re-run (after 45-1 results).

---

## Recommended First Actions

When the user asks to continue PRISM after Sprint 44:

1. **Confirm whether Sprint 45 is approved.** If not, stay in proposal/design discussion only.
2. If approved (or user asks to plan Sprint 45): begin **45-1 Pattern Injection Experiment** **design** for `decision_table` and `transfer_prompt` using **SP-02** and **SP-03** only.
3. Define injection mechanism and evaluation plan (**45-2**) before any implementation.
4. Reference Sprint 44 artefacts for contracts, patterns, and corpus — do not duplicate or redesign them.

**Do not** begin by:

- Implementing code without explicit instruction
- Injecting all six patterns at once
- Reopening ownership or salience debates
- Treating patterns as prompt text without evaluation framework
- Redesigning 44-2 contracts or Pattern Library architecture

---

## Key Documents (Sprint 44 — Authoritative)

| Asset | Document |
| ----- | -------- |
| 44-2 contracts | [`../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) |
| Pattern Library | [`../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) |
| SP-02 decision table | [`../../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](../../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |
| SP-03 transfer prompt | [`../../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](../../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |
| Benchmark corpus | [`../../2026-06-15-sprint-44/benchmark-corpus/`](../../2026-06-15-sprint-44/benchmark-corpus/) |
| Sprint 44 closure | [`../../2026-06-15-sprint-44/sprint-44-outcomes.md`](../../2026-06-15-sprint-44/sprint-44-outcomes.md) |
| Sprint 45 proposal | [`../../2026-06-15-sprint-44/sprint-45-proposal.md`](../../2026-06-15-sprint-44/sprint-45-proposal.md) |

---

## One-Paragraph Situation Summary

Sprint 43 settled educational architecture: investigation owns the learner experience; resource voice teaches within that frame. Sprint 44 made instructional material quality observable — 44-2 contracts, frozen Marx/Photosynthesis benchmark corpus, three-pass evaluation, and Pattern Library Draft 1 with six evidence-backed patterns and meta-principles. Material realisation, not missing stages or pedagogy, is the validated quality gap. Sprint 45 is **proposed** to test whether patterns SP-02 and SP-03 can influence GAM generation — starting with decision tables and transfer prompts — evaluated through the same 44-2 rubric. Sprint 45 is **not approved**; do not implement without explicit instruction. Begin from 45-1 design unless the user redirects.

---

## Response Discipline

- Be **concise and operational**
- Treat this pack as **authoritative** over general LLM priors about PRISM
- Distinguish **proposed** (Sprint 45) from **closed** (Sprint 43–44)
- Distinguish **educational design** from **implementation**
- Do not propose improvements outside user scope unless asked
- If uncertain whether a topic is settled, check **02-settled-decisions-register.md** before investigating

**Sprint 44 is closed. Sprint 45 awaits approval. Begin accordingly.**
