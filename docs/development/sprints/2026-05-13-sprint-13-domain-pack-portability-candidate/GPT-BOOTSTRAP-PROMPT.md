# GPT bootstrap — Sprint 13 candidate (domain-pack portability)

**Role:** authoritative for **this pack only** (candidate/prep continuity).

**Candidate/prep only. Sprint 13 is not approved and not started.**

**Use this prompt to start a fresh chat** for Sprint 13 preparation and bounded first-pass **planning/review** work. This pack is for `2026-05-13-sprint-13-domain-pack-portability-candidate`.

**Pack path:** `docs/development/sprints/2026-05-13-sprint-13-domain-pack-portability-candidate/`

---

## 1. Current status and boundary

- **Sprint 12 — first-pass structural observability (Phases A–E)** is **closed separately**. Do **not** reopen Sprint 12 scope, tests, or closure artefacts.
- **Closure record:** `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
- **Sprint 13** is **candidate/prep only**: not approved, not started as an umbrella program.
- **No implementation** before explicit written first-pass scope acceptance (when/if the program moves from prep to execution).

This pack supports **continuity and preparation**; it does **not** authorize code changes, domain-pack edits, prompt rewrites, persistence changes, or orchestration behaviour changes **unless** a future written charter supersedes this gate.

---

## 2. Candidate focus (Sprint 13)

**Long-term goal:** A new domain pack should be **droppable** into PRISM and function with **minimal/no core-code changes**.

**Near-term (v1-safe):** Reduce **hardcoded domain assumptions** in core; move toward **manifest / domain-pack–owned configuration**; keep **General**, **Learning Design**, and **Research** as **functioning v1 packs** without a **broad architecture rewrite**.

**Primary first-pass candidates (when chartered):**

- **S13-07:** Document **General / baseline / `alwaysOnDomains` / first-structured-domain** behaviour (descriptive; no policy change in doc-only work).
- **S13-01:** **Manifest-driven domain UI** with **strict parity** for **clearly scoped** controls (evidence-first).

**Decision-gated only (not default first-pass):**

- **S13-02:** Default domain rule.
- **S13-03:** Display-only hint neutralisation — **only if** provably **non–prompt-facing** (no `briefLines`, extraction, or model payload changes).

---

## 3. Read-first order

1. `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
2. `docs/development/current-state.md`
3. `docs/consolidation/sprint-12-candidate-prep-note.md`
4. `domains/domain-manifest.json`
5. `workflowGenerationContext.js`
6. `app.js` — domain selection, Workflow Factory, domain UI call sites (evidence gathering only while prep)
7. Relevant domain pack files under `domains/general/`, `domains/learning-design/`, `domains/research/` (read-only while prep)

Supporting: `docs/consolidation/sprint-10-contract-audit.md`; `docs/consolidation/sprint-11-closure.md`; pack charter summary `CHARTER-FIRST-PASS-SUMMARY.md` in this folder.

---

## 4. Guardrails (candidate first-pass)

- **Evidence-first**; v1-safe; **no semantic prompt changes** unless a **separate** charter.
- **No generated-output assertions** as a Sprint 13 prep default (unless a future pass explicitly charters tests).
- **No domain-pack schema redesign** unless separately approved.
- **No claim** that full **drop-in domain-pack portability** is complete after any single pass.

---

## 5. Explicitly deferred (do not implement under prep-only gate)

- Starting artefact relocation; Learning Design starting-point trio relocation; title-based domain injection replacement.
- `getGeneralFallbackBriefConfig` relocation; multi-domain brief config merging; semantic prompt migration.
- Broad `app.js` refactor; persistence/import/export migration.
- Fallback/cache/`manifestPromise`/`textCache` work.
- **Reopening Sprint 12 A–E.**

---

## Copy-paste block for the assistant

You are working on **Sprint 13 candidate/prep continuity** for PRISM — **domain-pack portability and manifest-driven configuration (v1)**. **Sprint 12 first-pass structural observability (A–E) is closed** (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`) — **do not reopen** it. **Sprint 13 is candidate/prep only** — **not approved, not started**; **do not implement code**, **do not edit domain packs**, **do not refactor `app.js`**, **do not rewrite prompts**, **do not change persistence/import/export**, **do not change runtime orchestration behaviour** unless explicit written charter approval says otherwise. Read this pack: `docs/development/sprints/2026-05-13-sprint-13-domain-pack-portability-candidate/`. Primary first-pass targets when approved: **S13-07** documentation + **S13-01** manifest-driven domain UI (strict parity). **S13-02** and **S13-03** are decision-gated only. Keep evidence-first and v1-safe guardrails; do not claim full drop-in portability is done.

---

## Review log

- **2026-05-13** — Sprint 13 domain-pack portability candidate pack created (prep/continuity only; no implementation authorized).
