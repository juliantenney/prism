# Sprint 75 — Handover

**Kind:** Continuation context for the next programme of work (coding or product).  
**Sprint status:** **COMPLETE / Closed** (2026-08-12)  
**Final report:** [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Closure:** [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Pasteable brief:** [next-chat-briefing.md](next-chat-briefing.md)

---

## Start here

> **Sprint 75 is complete. Sprint 76 is OPEN — see [Sprint 76 HANDOVER](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/HANDOVER.md). Begin with S76-T-010 DLA audit when authorised. Settings follows after the Sprint 76 decision gate.**

Do **not** reconstruct Sprint 75 from chat history — use this handover and the Final Report for historical context. For live work, use the **Sprint 76** pack.

---

## Why the Lagrangian / DLA investigation became Sprint 76

Post–Sprint 75 investigation of **Lagrangian Multipliers** resource quality bounded a consistency and task–material-closure problem (plus DLA prompt growth / evidence semantics). That investigation lane is now the opening theme of **Sprint 76** — not an informal post-closeout only.

Authoritative Sprint 76 evidence and plan: [CONTEXT.md](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/CONTEXT.md) · [PLAN.md](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/PLAN.md).

### Historical investigation notes (preserved)

A PRISM-generated **Lagrangian Multipliers** learning resource received a **substantially lower QA/benchmark score** than other PRISM resources. Weak early generated material is a **product-retention risk**.

Investigation across the generation chain remains the right method. Known early signal (hypothesis at Sprint 75 closeout): missing independent Lagrangian-construction practice — later investigation also established task–material sufficiency failures (e.g. Activity 4 lambda exercises) and DLA complexity concerns. See Sprint 76 CONTEXT for the fuller bounded problem statement.

Methodology reference: Sprint 71 benchmark / validation corpus — [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle).

---

## Following priority — Settings

After Sprint 76 reaches its decision gate with evidence-backed findings, move to **Settings** — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency).

Settings investigation was largely complete during Sprint 75; **implementation** remains deferred. Do **not** begin Settings work before the Sprint 76 DLA / quality lane completes its authorised phases (unless the operator re-prioritises).

---

## Sprint 75 — what was delivered (carry-forward context)

| Area | Summary |
| ---- | ------- |
| **Create** | One-product LD brief; progressive assistant; Proposed read-only workflow; Save Workflow (`S75-D22`–`D25`) |
| **My Workflows** | Run UX, display-only progress, persisted-output indication, lifecycle fixes, control grouping |
| **Authoring** | Run handoff; learner-ready assembly (`S75-D04`, `D13`) |
| **Run persistence** | IndexedDB resource-backed captures — **SETTLED** (`S75-D21`) |
| **Prompt Studio** | Paste (default) / Generate split; progressive Generate; Library-aligned saves (`S75-D30`, `D31`) |
| **Prompt Library** | Header action grouping (`S75-D32`) |

Detail: [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md) · [decisions.md](decisions.md).

---

## Durable product decisions (do not casually undo)

| Decision | One-line |
| -------- | -------- |
| **S75-D27** | Run segmented progress is **display-only** |
| **S75-D28** | Persisted capture indication ≠ merely visiting a step |
| **S75-D29** | Generate/run workflows is primary; custom Edit is the **advanced** route |
| **S75-D30** | Prompt Studio: Paste + lightweight Generate; not primary sophisticated prompt IDE |
| **S75-D31** | Prompt Library authoritative; `Library` abstraction for persistence |
| **S75-D21** | Run capture persistence **SETTLED** — IndexedDB payloads, ref-only runstate |

Create one-product model (`S75-D22`), Duplicate = clean Run state, Duplicate ≠ Rename — all remain binding.

---

## Deferred (not reopened at closeout)

- **Advanced custom-workflow Edit machinery** — may receive its own future sprint if evidence shows substantial work is needed; do not reopen casually.  
- **T-020 C-09 / C-11 / C-12** — deferred.  
- **QA lifecycle productisation** — PB-FA-006.  
- **Storage management UX** — PB-FA-007.  
- **Settings** — PB-FA-005 (after Sprint 76 decision gate).

---

## Do not

- Reopen Sprint 75 implementation scope without a new programme decision  
- Reopen Run-capture persistence architecture (`S75-D21`) casually  
- Begin Settings redesign before Sprint 76’s authorised DLA / quality phases complete (unless re-prioritised)  
- Fix generation behaviour based on benchmark score alone without tracing root cause  
- Use this Sprint 75 handover as the live Sprint 76 dashboard — use the Sprint 76 pack  

---

## Testing note for next session

Authoritative Sprint 75 regression batch: **114 / 114 pass** (2026-08-12).  
Extended `s75-*` suite: one stale cache-bust assertion in `s75-d26-compact-prism-status-control.test.js` (test maintenance).  
`workflow-design-page-upstream-prompt.test.js`: **3 / 3 pass** at closeout (prior `visual_need` failure not reproduced).
