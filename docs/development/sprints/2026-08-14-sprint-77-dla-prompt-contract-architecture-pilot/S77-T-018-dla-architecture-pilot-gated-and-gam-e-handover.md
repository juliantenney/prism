# S77-T-018 — DLA architecture pilot gated; backlog and GAM E handover

**Status:** **COMPLETE** (2026-08-14) — documentation / transition only  
**Mode:** DOCUMENTATION ONLY — no production, prompt, validator, schema, test, pack, EP, DLA, or GAM changes  
**Depends on:** [T-017](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) Gate D **PASS**  
**Live DLA contract:** `77-DLA-CANONICAL-2` (unchanged this task)

---

## A. DLA Prompt Contract Architecture pilot — principal objective achieved

The DLA architecture pilot has achieved its intended outcome. Sprint 77 **remains OPEN** for the transferred functional queue; the **architecture detour is gated**.

| Result | State |
| ------ | ----- |
| Canonical 11-section DLA architecture live | YES |
| Copy canonical multiplicity | 1 |
| Studio canonical multiplicity | 1 |
| Copy/Studio canonical contract equivalent | YES (T-015/T-016) |
| P05 dual-inject | **Resolved** as T-015 architectural consequence — not an open functional repair |
| Capture migration defect (`evidence_requirement.kind` / `purpose`) | Found in Gate D; repaired T-016; capture PASS |
| Behavioural Gate D | **PASS** ([T-017](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md)) |
| Protected Sprint 76 semantics (P01-R1, T-033, T-031, P02, P03, P04 evidence, Sprint 72 sources/providers) | Preserved / remain CLOSED |

**Do not claim** Phase D legacy cleanup is complete. Legacy builders and rollback remain.

### Phase D (bounded later cleanup)

Stop calling Sprint 76 dual contract+shape from production; keep functions until a cleanup commit. **Not required** before returning to the outstanding functional queue. **Not authorised** until a separate operator decision. Rollback (`dlaCanonicalAssembler: false`) **must remain** until that decision.

---

## B. Future prompt-contract architecture backlog

Recorded as **[PB-FA-010](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-010--prompt-contract-architecture-method-after-dla-pilot)** and on [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).

**Method (reference, not a template to copy):**

inventory → invariant/authority mapping → canonical section architecture → additive assembler → semantic-equivalence review → atomic production switch → behavioural gate → legacy cleanup

**Principles:**

1. DLA is the reference implementation for the **METHOD**, not a prompt template to copy mechanically.
2. Each prompt retains its own semantic responsibilities.
3. Later work should seek: clear model-visible sections; canonical ownership of invariants; deterministic/single assembly where appropriate; controlled overlays; defect-to-instruction traceability; removal of duplicate/competing authorities; reduced size as a **consequence** of architecture, not the primary objective.
4. Do **not** begin a system-wide prompt rewrite now.
5. Rationalise prompts individually in later bounded work.
6. **GAM prompt architecture** should be reconsidered **after GAM D/E diagnostics**, so those investigations can reveal invariants and failure modes the eventual GAM architecture must preserve.

---

## C. Outstanding functional queue (Sprint 76 transfer)

Architecture detour complete enough to return to this queue. **P05 is not on it.**

| Item | Status |
| ---- | ------ |
| **GAM E** — learner-facing corruption | **OPEN** — **next** |
| **GAM D** — pedagogical-function fulfilment | **OPEN / SEPARATE** |
| Graphics / image lifecycle | **OPEN / SEPARATE** |
| T-032 constructive-alignment residual | **OPEN** diagnostic / separate |
| Settings (PB-FA-005), Continue-to-Authoring, RECOVER, other deferred | remain deferred per existing docs |

Do not silently close or reorder unrelated deferred items.

---

## D. Selected next task

**GAM E — learner-facing corruption diagnostic** ([T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md) — **defined, not executed**).

Reason: fresh Lagrangian Gate D exhibit on A5 (`Pur[`, `\rtial`). Avoid reconstructing the historical GAM D case first.

Keep GAM E separate from DLA architecture, T-031, GAM D, and graphics.

**This task does not diagnose GAM E.**

---

## E. GAM E next-task brief (do not execute here)

See [S77-T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md).

**Question:** Where is learner-facing GAM content first corrupted between the model-visible GAM commission/prompt, model response, capture/post-processing, stored artefact, and rendered learner material?

**Primary fresh exhibit (Lagrangian A5, Gate D run):**

- `Simulated Evidence for Learning Pur[ poses`
- malformed TeX containing `\rtial` (intended `\partial`)

---

## Files this task

Sprint 77 pack STATUS / PLAN / HANDOVER / START-HERE / README / briefing · top-level sprint-77 / NEXT-SPRINT / sprints README · PRODUCT-BACKLOG PB-FA-010 · T-018 · T-019 (defined only) · S77-D02.

No production or test changes.
