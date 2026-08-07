# Sprint 74C — Charter

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Status:** **COMPLETE / Closed** (2026-08-07)  
**Opened:** 2026-08-07  
**Closed:** 2026-08-07 — [S74C-T-050](S74C-T-050-final-verification-and-programme-closure.md)  
**Type:** Repository hygiene (final narrowed Sprint 74 phase)  
**Parent programme:** Sprint 74 — **COMPLETE / Closed**  
**Start here:** [SPRINT-74C-START-HERE.md](SPRINT-74C-START-HERE.md)  
**Scope authority:** [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) (narrowed R1 — not original Domain C unchanged)  
**Historical Domain C sketch:** [S74-T-010 Domain C](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#domain-c--repository--fixture-hygiene-recommended-sprint-74c) — **superseded for boundary** by post-74B review  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Opening decision:** [S74C-D01](decisions.md#s74c-d01-open-sprint-74c-for-repository-hygiene--historical-residue-rationalisation)  
**Closure decision:** [S74C-D03](decisions.md#s74c-d03--close-sprint-74c)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited — not duplicated)*

---

## Mission

Reduce **repository noise and ambiguous historical residue** — scratch files, obsolete probes/tools, unclassified `_archive/` contents — so the tree is clean and well-classified before Sprint 75 UI work.

Governing principle:

> If removing something requires reasoning about current product behaviour, it does not belong in 74C.

## Target state

- Root scratch and temporary outputs removed after reference audit  
- Obsolete compose/Legacy-era probes/tools removed or explicitly retained with reason  
- `_archive/` and historical residue classified under a concise archive policy  
- Certification artefacts, sprint evidence, current fixtures, and test guardians **protected**  
- No ambiguous residue without classification  
- **No product behaviour change**  
- Sprint 74 can close cleanly after verification  

Line-count reduction is **descriptive only**, never a target.

## Historical retention principle

Git history is the **default historical archive** for Prism.

Active repository copies of historical material (for example archives, snapshots, probe scripts, superseded implementations, or generated artefacts) must have a **current operational justification**, such as:

- supporting active tooling;
- preserving authoritative sprint evidence;
- certification artefacts;
- current fixtures or build assets;
- ongoing maintenance activities.

Historical existence alone is **not** sufficient justification for retaining active repository copies.

Repository copies should exist because they serve today's product or engineering process, not simply because they once existed.

## Problem statement

After 74A and 74B, supported page-path ownership is consolidated. Remaining noise is primarily **repository hygiene**: root `test*.txt` / `tmp-*` / dumped HTML, broken probe scripts calling removed APIs, and unclassified archive/historical residue. Mixing this with PB-S-001 fixture enrichment (not sprint-ready) was rejected by the post-74B review. 74C is the narrowed hygiene phase only.

## Goals (ordered)

1. **Initialise** pack (`S74C-T-001`).  
2. **Inventory** repository residue with classifications (`S74C-T-010`).  
3. **Decide** retain / archive / delete / rename / defer (`S74C-T-020`).  
4. **Plan** small reversible hygiene slices (`S74C-T-030`).  
5. **Execute** approved hygiene (`S74C-T-040`).  
6. **Verify** and close 74C (and programme if appropriate) (`S74C-T-050`).

## Supported product paths affected

**None intended.** Runtime Create Workflow / My Workflows / Authoring / export / generation paths must remain unchanged.

## Scope

- Root scratch files (`test*.txt`, similar)  
- Temporary test outputs (`tmp-*`, logs)  
- Dumped HTML / JSON / obsolete local helper output  
- `_archive/` classification and concise archive policy  
- Broken or obsolete `scripts/probe-*` and related tooling  
- Stale `tools/*` calling removed compose/Legacy APIs  
- Historical residue that is neither authoritative evidence nor current tooling  
- Safe naming cleanup in non-runtime hygiene/test tooling  
- Explicit retain/delete/archive classification  
- Repository cleanliness and final residue sweep  

## Explicit non-scope

- **PB-S-001** fixture enrichment / broad-suite repair  
- Current runtime code / product behaviour  
- Workflow formation; prompt/contract architecture  
- Capture / validation logic; deterministic assembly  
- Renderer / export; UI / state redesign  
- WR orphan cleanup (PB-R-008); **PB-FA-004**  
- Schema redesign; pedagogy changes  
- Opening **Sprint 75**  
- Architectural redesign under `S74-D07` framing  

## Binding constraints

**Do not duplicate.** Inherit:

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**, **`S74-D09`**)

**Do not duplicate.** Inherit working practice from:

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

## Relationship to Sprint 74

Sprint 74 remains the governing programme wrapper. Sprint 74A and 74B are **COMPLETE / Closed**. Sprint 74C is the **final narrowed hygiene phase** (post-74B review option **R1**). Original Domain C planning text is historical evidence — **not** the active boundary. Sprint 75 remains **not opened**.

## Success / acceptance criteria

| ID | Criterion |
| -- | --------- |
| AC-01 | Repository hygiene inventory complete **before** any deletion or move |
| AC-02 | Every inventory class has retain / archive / delete / rename / defer decision with rationale |
| AC-03 | Removals follow reference audit — not “looks old” alone |
| AC-04 | Scratch noise removed only after T-020/T-030 approval |
| AC-05 | Obsolete probes/tools removed or explicitly retained |
| AC-06 | `_archive/` / historical residue classified; concise archive policy recorded |
| AC-07 | Sprint evidence, certification artefacts, current fixtures, build outputs, and test guardians protected |
| AC-08 | No product behaviour change; no current guardian weakened |
| AC-09 | No dead compose/Legacy-era tooling masquerades as current without classification |
| AC-10 | No ambiguous residue remains without classification |
| AC-11 | PB-S-001, WR orphans, PB-FA-004, and Sprint 75 remain out of scope |
| AC-12 | Engineering Disciplines inherited — not duplicated inconsistently |
| AC-13 | Sprint 74C closure evidence complete; programme close only if authorised at T-050 |

## Decision / task IDs

- Decisions: `S74C-D##` in [decisions.md](decisions.md)  
- Tasks: `S74C-T-###` in [PLAN.md](PLAN.md)  

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Deleting certification / sprint evidence as “scratch” | Explicit protect list in T-010; AC-07 |
| Fixture/tooling change that weakens guardians | Non-scope; stop if product/test behaviour reasoning required |
| Scope bleed into PB-S-001 or architecture | Charter non-scope; post-74B R1 boundary |
| Premature deletion before inventory | T-010 inventory-only; T-040 only after T-030 |
