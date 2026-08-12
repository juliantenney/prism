# Sprint 75 — Handover

**Kind:** Continuation context for the next programme of work (coding or product).  
**Sprint status:** **COMPLETE / Closed** (2026-08-12)  
**Final report:** [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Closure:** [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Pasteable brief:** [next-chat-briefing.md](next-chat-briefing.md)

---

## Start here

> **Sprint 75 is complete. Begin next with the Lagrangian Multipliers resource quality investigation. Settings follows after that.**

Do **not** reconstruct Sprint 75 from chat history — use this handover and the Final Report.

---

## Why the Lagrangian investigation matters

A PRISM-generated **Lagrangian Multipliers** learning resource received a **substantially lower QA/benchmark score** than other PRISM resources. Weak early generated material is a **product-retention risk**: if a user’s first experience produces poor learning resources, they may not return.

**Do not prescribe a fix yet.** The next task is to determine **why** the resource scored poorly by tracing the generation chain systematically.

### Investigate across (where relevant)

- Initial user input / source material  
- Generated learning outcomes  
- Episode / design plan  
- Learning-content generation  
- Activity design  
- Assessment / practice opportunities  
- Mathematical correctness and optimality reasoning  
- Sequencing / scaffolding  
- Evidence / source use  
- Prompt behaviour  
- Upstream artefacts feeding downstream generation  
- Final QA / benchmark report and validation review  

### Distinguish failure modes

1. Source / input weakness  
2. Workflow / design weakness  
3. Individual prompt weakness  
4. Upstream artefact weakness propagating downstream  
5. Model-generation variance  
6. QA / benchmark calibration problems  
7. Genuine pedagogical / content-quality problems  

Known benchmark signal: **missing independent Lagrangian-construction practice** — treat as a **hypothesis**, not the assumed sole root cause.

**Goal:** determine whether PRISM is producing educationally weak resources, **why**, and what intervention would improve resource quality **reliably** — not merely raise a benchmark score.

Methodology reference: Sprint 71 benchmark / validation corpus — [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle).

---

## Following priority — Settings

After the Lagrangian investigation concludes with evidence-backed findings, move to **Settings** — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency).

Settings investigation was largely complete during Sprint 75; **implementation** was intentionally deferred. Do **not** begin Settings work during Sprint 75 closeout or before the resource-quality investigation.

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
- **Sprint 76** — **not opened**.

---

## Do not

- Reopen Sprint 75 implementation scope without a new programme decision  
- Reopen Run-capture persistence architecture (`S75-D21`) casually  
- Begin Settings redesign before Lagrangian investigation  
- Fix generation behaviour based on benchmark score alone without tracing root cause  
- Open Sprint 76 from this handover  

---

## Testing note for next session

Authoritative Sprint 75 regression batch: **114 / 114 pass** (2026-08-12).  
Extended `s75-*` suite: one stale cache-bust assertion in `s75-d26-compact-prism-status-control.test.js` (test maintenance).  
`workflow-design-page-upstream-prompt.test.js`: **3 / 3 pass** at closeout (prior `visual_need` failure not reproduced).
