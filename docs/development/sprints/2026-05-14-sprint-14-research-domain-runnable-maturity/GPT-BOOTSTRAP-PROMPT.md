# GPT bootstrap — Sprint 14 (Research domain runnable maturity)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-14-sprint-14-research-domain-runnable-maturity/`

**Use this document** to start a **fresh chat** for Sprint 14 **implementation and verification** work focused on **Research** as a **runnable** workflow domain.

**Snapshots:** Read from **`context-files/`** in this pack when the repo root is not attached; filenames match the inventory in `SPRINT-CONTEXT.md`.

---

## 1. Assistant role

You assist with **Sprint 14 — Research Domain Runnable Maturity**: improve **Research** so authors who pick **Research** in Workflow Factory get **coherent, trustworthy** generation (pack text, brief/elicitation, `workflowPolicy` / triggers, prompt factories, `runnerInstructions`, artefact flow) with **bounded** `app.js` changes **only when necessary** and **explicitly aligned** to the charter.

---

## 2. Read-first order

1. **`context-files/sprint-14-charter.md`** — goals, non-goals, hard exclusions.
2. **`context-files/sprint-14-research-pack-baseline-audit.md`** — documented gaps (e.g. `objective_type: analysis` vs `triggerRules`; `Generate Research Content` vs `stepRoleAnchors`; section order vs `canonicalSteps`).
3. **`context-files/sprint-14-current-known-issues.md`** — hypothesis register to validate or close.
4. **`context-files/domain-research-step-patterns.md`** — source of truth for Research policy + brief + step JSON.
5. **`context-files/domain-research-artefacts.md`**
6. **`context-files/workflowGenerationContext.js`** — structured-domain selection, `getWorkflowBriefConfig`, catalogues.
7. **`context-files/app.js`** — Factory + generation paths touching Research (surgical edits preferred).
8. **`context-files/domain-learning-design-step-patterns.md`** — **comparison only**; do not scope-creep into LD elicitation overhaul.
9. **`context-files/current-state.md`**, **`context-files/development-protocol.md`**, **`context-files/shared-vocabulary.md`**

---

## 3. Boundaries

- **Sprint 12** and **Sprint 13** are **closed** — do **not** reopen their obligations or restyle Sprint 14 as a portability umbrella.
- **General** is **baseline-only** — do **not** reintroduce General as a user-selectable runnable Factory domain.
- **Not in scope unless a new charter says so:** orchestration rewrite, portability / manifest architecture redesign, persistence/import/export **schema** redesign, workflow chaining, broad `app.js` decomposition.
- **No broad rewrite** of `app.js` or cross-domain refactors **unless** the user explicitly approves a wider pass in chat.

---

## 4. Likely first task

Pick **one** high-leverage, charter-aligned thread and land it with tests:

- **Pack correctness:** fix Research **`workflowPolicy`** inconsistencies flagged in **`sprint-14-research-pack-baseline-audit.md`** (e.g. missing **`analysis`** `triggerRules`, missing **`stepRoleAnchors`** for **Generate Research Content**, clarify **`canonicalSteps`** vs markdown section ordering); **or**
- **Brief / elicitation:** align **`objective_type`** choice shape and inference with UI expectations; **or**
- **Targeted `app.js`:** only where Research Factory UX or generation **requires** core changes—pair with **`node --test`**.

---

## 5. Constraints

- Preserve **Learning Design** runnable behaviour and **General** baseline-only Factory behaviour.
- Prefer **minimal diffs**; every change should trace to charter goals or a logged known issue.
- Run **`node --test tests/*.test.js`** (or a sprint-agreed subset) after substantive changes.
- Do **not** claim **drop-in** domain-pack portability as an outcome of Sprint 14.

---

## Copy-paste block for the assistant

You are assisting with **Sprint 14 — Research Domain Runnable Maturity** for PRISM. Read the pack at **`docs/development/sprints/2026-05-14-sprint-14-research-domain-runnable-maturity/`** — use **`context-files/`** snapshots when the full repo is not mounted. **Sprint 12** first-pass observability and **Sprint 13** first-pass portability consolidation are **closed**; **do not reopen** them. **General** is **baseline-only** (not a user-selectable runnable Factory domain). **Runnable v1** domains are **Learning Design** and **Research**; this sprint focuses on **Research** usability and trustworthiness. **Sprint 14 is practical implementation/verification**, **not** a portability architecture redesign: **no** orchestration rewrite, **no** schema redesign, **no** workflow chaining, **no** broad `app.js` decomposition unless the user **explicitly** approves a wider scope in this chat. Read-first: `context-files/sprint-14-charter.md`, then `sprint-14-research-pack-baseline-audit.md`, then `sprint-14-current-known-issues.md`, then Research pack markdown, then `workflowGenerationContext.js` and targeted `app.js`. Likely first task: fix a **documented** Research pack inconsistency (e.g. `triggerRules` / `stepRoleAnchors` / ordering) **or** a bounded Factory/generation issue with tests. Keep diffs minimal; preserve LD + General baseline behaviour; run **`node --test tests/*.test.js`** after substantive edits.

---

## Review log

- **2026-05-14** — Bootstrap prompt added for Sprint 14 portable pack.
