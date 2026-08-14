# Sprint 76 — Decision Log

**Sprint status:** **COMPLETE / Closed** (opened 2026-08-13; closed 2026-08-14)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); Engineering Disciplines — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md).

Sprint 75 remains **COMPLETE / Closed**. Run persistence **SETTLED** (`S75-D21`) — do not casually reopen.

---

## S76-D01 Open Sprint 76 — DLA Rationalisation and Content-Quality Consistency

- **Decision:** Operator approval has **opened Sprint 76** — **DLA Rationalisation and Content-Quality Consistency** — as a **new programme** focused on DLA audit/rationalisation, task–material sufficiency, evidence/provenance semantics, and run-to-run content-quality consistency. Sprint **75** remains **COMPLETE / Closed**. Pack initialisation is task **S76-T-001**. The first investigation task is **S76-T-010 — DLA audit** — **defined only**; it must **not** be executed until explicitly authorised after pack review. T-001 authorises **no** production code, test product, generation, schema, or Settings changes. Evidence-injection rollback is recorded as an **investigation option**, not an opening action. Settings (**PB-FA-005**) remains **deferred**. Default: **no new workflow step**. Strategic quality direction: improve underlying educational quality toward mid-90s **consistency** without benchmark gaming.

- **Status:** **Accepted** (2026-08-13)

- **Rationale:** Post–Sprint 75 Lagrangian investigation bounded the problem around DLA complexity, task–material closure, evidence semantics, and consistency (latest release score **79** with a Major intermediate-artefact defect; architecture dimensions remain relatively strong). Opening a dedicated sprint makes the audit and subsequent control/challenge re-benchmarks programme-owned rather than ad hoc transition work.

- **Consequences:** Work proceeds under [PLAN.md](PLAN.md) and [CONTEXT.md](CONTEXT.md). Stop after T-001 until T-010 is authorised. Further decisions: `S76-D##`. Transition blocking fixes in the working tree are **out of band** for this opening decision and require separate operator commit review.

---

## S76-D02 Sprint 71 known-good historical quality baseline + RECOVER / ADVANCE framing

- **Decision:** Record Sprint 71’s validated corpus as a **known-good historical quality baseline** for Sprint 76. Typical documented scores cluster **85.3–91/100** (Benchmark v2.1 + Validation v2.0; all **Release Ready with Minor Revisions**), including Roman Roads **90** and constructed/generated-content STEM **87–90** as useful comparison evidence. Sprint 71 did **not** define a formal “general-content” or “non-evidence-dependent” scoring category. Sprint 76 investigation order is **RECOVER** (whether current DLA has regressed from that known-good historical quality baseline — **hypothesis only**) then **ADVANCE** (remaining task–material / richness work toward consistent mid-90s). T-010 must reconstruct DLA growth as a **historical delta** (known-good / previously rationalised DLA → subsequent additions → current ~72k), not merely classify the current prompt. Evidence-machinery wording is an **audit question** (may conflate or insufficiently distinguish material / provenance / epistemic function), not a settled finding.

- **Status:** **Accepted** (2026-08-13, pack-review amendment)

- **Rationale:** Operator pack review required an evidence-backed Sprint 71 inspection before commit. Repository evidence supports stronger historical typical performance than the current Lagrangian release cluster (~79), but does **not** support a documented **92** overall score, nor a Sprint 71 category of “non-evidence-dependent” 91/92 runs. `S71-R-011` **91** is an evidence-availability literature intervention. Per-review DLA commits were not recorded. Framing must stay epistemically honest.

- **Consequences:** [CONTEXT.md §2](CONTEXT.md) is the score table of record. T-010 specification in [PLAN.md](PLAN.md) includes the historical-delta reconstruction. Do **not** execute T-010 under this decision. Do **not** claim regression established. Sprint 75 CLOSED / Sprint 76 OPEN unchanged.

---

## S76-D03 Durable prompt-engineering discipline as Sprint 76 exit condition

- **Decision:** Sprint 76 **cannot close** after merely rationalising DLA once. Before closure, the sprint must **establish and document** a durable prompt-engineering discipline intended to prevent recurrence of **APPEND NOW → RATIONALISE LATER**. The discipline is an **exit condition / programme output**, informed by T-010 and subsequent rationalisation evidence. Opening does **not** pre-commit arbitrary character limits, a particular automated guardrail, a specific metric, or a particular implementation.

- **Status:** **Accepted** (2026-08-13, final pre-commit pack integrity)

- **Rationale:** The ~72k DLA growth anomaly and post-rationalisation accretion pattern make a one-off cleanup insufficient. Without an explicit exit discipline, the same failure mode can recur after Sprint 76.

- **Consequences:** Recorded in [SPRINT-76-CHARTER.md](SPRINT-76-CHARTER.md) and [PLAN.md](PLAN.md) closure gate. T-010 remains diagnostic only and does **not** invent the discipline. Closure review must verify the discipline is documented.

---

## S76-D04 Close Sprint 76; transfer prompt-architecture discipline to the next sprint

- **Decision:** Sprint 76 is **CLOSED** (2026-08-14). The DLA semantic repair chain (P04, P01-R1, T-033, T-031) is complete. P05, GAM D/E, and Graphics are **not** started inside Sprint 76. [S76-D03](#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition) is **satisfied as a handover**: the next sprint’s working title is **Prompt Contract Architecture**, beginning with a diagnostic inventory, not a length-reduction implementation.

- **Status:** **Accepted** (2026-08-14, operator close-out)

- **Rationale:** Remaining work is instruction-architecture / maintainability (and separate GAM/Graphics defects), not unfinished local DLA semantics. Continuing P05 inside 76 would optimise accidental assembly before the desired architecture is known.

- **Consequences:** [S76-T-049](S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md). Do not reopen T-031. Do not add a generic DLA “must be solvable” clause. Next programme: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).
