# Sprint 76 — Plan

**Status:** **OPEN** (opened 2026-08-13)  
**Opening decision:** [S76-D01](decisions.md#s76-d01--open-sprint-76--dla-rationalisation-and-content-quality-consistency)  
**Dashboard:** [STATUS.md](STATUS.md) · **Evidence:** [CONTEXT.md](CONTEXT.md)

Task IDs: `S76-T-###`. Decision IDs: `S76-D##` in [decisions.md](decisions.md).

Later implementation structure after T-010 is **evidence-led**. Do not invent detailed rewrite tasks before the audit.

---

## Programme phases

```text
S76-T-001 (pack init) ✅ Done
  → S76-D01 (open Sprint 76) ✅ Accepted
  → S76-T-010 (DLA audit) — Defined; Not started (await authorisation)
  → PHASE 2: Rationalise / fix DLA (from audit evidence) — Not started
  → PHASE 3: Roman Roads control runs (repeated) — Not started
  → PHASE 4: Lagrangian challenge runs (repeated) — Not started
  → PHASE 5: Decision gate — Not started
  → BEFORE CLOSE: Durable prompt-engineering discipline (S76-D03) — Not started
  → Settings (PB-FA-005) — Deferred after this programme lane
```

---

## Phase 1 — Audit

### S76-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-13) |
| **Ownership** | Sprint documentation |
| **Mode** | Documentation only |
| **Approach** | Create Sprint 76 pack; top-level overview; open decision `S76-D01`; define T-010 without executing it; record Sprint 75 CLOSED; capture investigation evidence |
| **Acceptance** | Pack files present; relative links valid; no production code / test product changes in this task; T-010 defined not started; Sprint 76 OPEN; no commit required by operator |
| **Verification** | [S76-T-001-sprint-pack-initialisation.md](S76-T-001-sprint-pack-initialisation.md) |

---

### S76-T-010 — DLA audit

| Field | Content |
| ----- | ------- |
| **Status** | **Defined — Not started** (await explicit authorisation after pack review) |
| **Ownership** | Generation-contract / DLA investigation |
| **Mode** | **DIAGNOSTIC ONLY** — no prompt rewrite, no generation behaviour change, no schema change, no evidence rollback execution |
| **Purpose** | Establish an evidence-based account of current DLA responsibilities, prompt growth **as a historical delta**, duplication, and contract gaps before rationalisation. Include whether current DLA may have **regressed** from the Sprint 71 known-good historical quality baseline (hypothesis only). |

#### Audit scope (minimum)

1. **Current DLA responsibilities** — what DLA is supposed to own vs EP / GAM / Page.  
2. **Current assembled prompt size** — measure and document (observed ~**72,000** characters; verify at audit time).  
3. **Historical delta (required where history permits)** — reconstruct:

   **known-good / previously rationalised DLA → subsequent changes/additions → current ~72k assembled DLA.**

   Anchors: Sprint 56 post-rationalisation DLA core ~**31,932** (2026-07-01); Sprint 71 generation era (2026-07-30/31; post-S56, pre-S72 evidence productisation; **assembled size not pinned in reviews**); Sprint 72 evidence-centred additions onward.

   For each material addition/change identified, record where possible: **what** was added; **when**; **why** / which decision or defect motivated it; **approximate prompt-size contribution**; whether it remains **authoritative**; whether it **duplicates, competes with, or supersedes** another instruction; whether it **belongs in DLA at all**.

   Do not merely classify the current prompt. Report gaps where git/docs cannot identify a change.  
4. **Duplicated / competing / superseded instructions** — including multiple versions of the same contract.  
5. **EP → DLA contract** — what Episode Plan guarantees and what DLA must populate.  
6. **DLA → GAM contract** — what material obligations GAM is commissioned to realise.  
7. **Evidence-injection machinery** — where it lives, what it adds, how it interacts with general DLA signal.  
8. **Evidence validator semantics** — whether machinery may conflate or insufficiently distinguish material vs provenance vs epistemic function; known false-positive classes (including procedural mathematical task material interpreted as evidence-dependent).  
9. **Task–material sufficiency / closure** — whether learner obligations have explicit corresponding materials (quantity, variation, specificity).  
10. **Deterministic vs generative ownership** — responsibilities that may belong in validation rather than prompt prose.  
11. **RECOVER hypothesis** — whether the delta is consistent with regression from the Sprint 71 known-good historical quality baseline (including constructed/generated-content comparison cases); **do not treat regression as established** in T-010 without evidence.

#### Deliverable expectations

- Quantified prompt map by responsibility / section.  
- Historical delta account (known-good / rationalised DLA → additions → current), with per-addition fields above where history permits.  
- Explicit list of duplication / competition / supersession findings.  
- Contract-gap hypotheses for EP → DLA and DLA → GAM (with examples from Lagrangian / Roman Roads where available).  
- Recommendation options for Phase 2 (including whether evidence rollback experiment is warranted; whether **RECOVER** work is indicated) — **recommendations only**.  
- **No** implementation in T-010.

#### Explicit exclusions (T-010)

- Prompt / pack / schema / workflow edits  
- GAM changes  
- Evidence-injection rollback execution  
- Adding a workflow step  
- Settings work  
- Benchmark-score chasing without contract diagnosis  

---

## Phase 2 — Rationalise / fix DLA

**Status:** Not started (blocked on T-010 evidence + operator authorisation)

Based on audit evidence:

- remove duplication;  
- remove superseded machinery;  
- resolve competing instructions;  
- simplify unclear semantics;  
- fix genuine EP → DLA and DLA → GAM contract defects;  
- rationalise or temporarily disable evidence machinery **if justified**.

**Default:** no new workflow step.

---

## Phase 3 — Roman Roads control runs

**Status:** Not started

Generate Roman Roads **afresh multiple times**. Benchmark each run. Assess:

- mean / typical quality;  
- run-to-run variance;  
- regression against historically strong behaviour;  
- intermediate EP / DLA / GAM contract quality.

Do not rely on a single lucky score.

---

## Phase 4 — Lagrangian challenge runs

**Status:** Not started

Generate Lagrangian Multipliers **afresh multiple times**. Benchmark each run. Assess:

- quality;  
- variance;  
- task–material completeness;  
- disciplinary richness;  
- executable learner activities.

---

## Phase 5 — Decision gate

**Status:** Not started

Only after rationalisation and re-benchmarking determine what content-richness problems genuinely remain. Then evaluate:

- existing DLA evidence injection;  
- task–material sufficiency mechanisms;  
- provenance / authenticity handling;  
- evidence semantics;  
- stronger deterministic closure validation;  
- any remaining content-richness intervention.

**Do not pre-commit** Sprint 76 to a particular new mechanism before this evidence exists.

---

## Closure gate — durable prompt-engineering discipline

**Status:** Required before Sprint 76 closure · **Not started** (exact discipline is an **output** of the sprint, informed by T-010)

Sprint 76 **cannot close** after a one-off DLA rationalisation alone. Before closure, document a durable prompt-engineering discipline that prevents recurrence of **APPEND NOW → RATIONALISE LATER**.

Principles the eventual solution should address (not a pre-committed implementation list):

- identify existing authoritative responsibility before adding instructions;  
- modify / replace rather than automatically append;  
- rationalise superseded / overlapping wording in the same change;  
- place requirements in prompt prose vs schema vs validation vs application logic vs another stage, as appropriate;  
- assess net prompt-size impact; make material growth intentional and explainable;  
- protect behavioural contracts with tests rather than defensive prose accretion;  
- observability sufficient to detect unexpected prompt growth.

**Do not** mandate at open: arbitrary character limits, a particular automated guardrail, a specific metric, or a particular implementation.

See [SPRINT-76-CHARTER.md](SPRINT-76-CHARTER.md) · [S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition).

---

## Deferred outside opening scope

| Item | Notes |
| ---- | ----- |
| Settings / PB-FA-005 | After this DLA / quality lane |
| Evidence-injection rollback experiment | Option only — not executed at open |
| New workflow step | Default **no** |
| Transition blocking fixes commit | Working-tree fixes exist; operator reviews separately |

---

## Last updated

2026-08-13 — Pack opened; T-001 done; T-010 defined not started. Pack review: T-010 historical-delta + Sprint 71 baseline framing. Final pre-commit integrity: closure gate for durable prompt-engineering discipline added (`S76-D03`); T-010 still **not started**.
