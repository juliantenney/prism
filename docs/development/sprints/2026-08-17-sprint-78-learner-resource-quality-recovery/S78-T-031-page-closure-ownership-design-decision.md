# S78-T-031 — Page-closure ownership historical/design decision

**Task:** S78-T-031  
**Status:** **DESIGN / DECISION COMPLETE** (2026-08-25)  
**Mode:** Design / decision only — **no production implementation**  
**Depends on:** [S78-T-030](S78-T-030-missing-page-synthesis-closure-diagnostic.md)  
**Decision ID:** [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

---

## Required decision (explicit)

> **Which stage should own learner-resource closure, and why?**

**GAM owns the instructional substance of closure/consolidation/transfer** (as learner-facing material bodies — consolidation, transfer prompts, ### Closure / ### Debrief content on culminating work).  
**Design Page owns only transport (and organisation) of that substance into `page_synthesis.study_tips` when a transportable body exists; it must not synthesise new teaching.**  
**Omission of `study_tips` when no transportable upstream body exists remains architecturally valid** under Sprint 56C — but the current gap is that **upstream packaging to supply that body was deferred (SQ-1/SQ-2) and never completed**, so omit-when-none is firing by default rather than as a rare edge case.

This is **Option B** (with historical precision). **Option A is rejected.** **Option C is rejected as the long-term product stance** for independent learner resources, though it correctly describes short-term compliance of the latest run.

---

## 1. Sprint 56C historical rationale

### Problem transport-only was intended to solve

Pre–CP-4 Design Page emit ran a **multi-author wrapper stack** (journey assimilation + authorial exposition + self-directed rhetoric) that **mandated synthesis** of `knowledge_summary` and `study_tips` at Design Page time ([Wave 1 Architecture Cleanup Analysis](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-WAVE-1-ARCHITECTURE-CLEANUP-ANALYSIS.md)).

For study tips specifically, **R-41** (Assembly-Time Ownership Test) classified closure synthesis as **GAM-owned / transport only**:

> If `study_tips` exists, populate from GAM consolidation/transfer `Content:` verbatim (or dedicated materials field), not synthesis. **Disallowed:** re-authoring GAM outputs. R-42 (reference without embed) **Remove**.

### What Design Page synthesis was causing

| Failure class | Evidence |
| ------------- | -------- |
| **Instructional authoring at wrong stage** | R-41 fails T1; substance available at GAM (T2 = Yes) |
| **Hallucinated / new teaching & paraphrase of GAM** | Assembly-Time §4 disallowed: material summaries; re-authoring GAM consolidation/transfer |
| **Ownership ambiguity** | Triple wrapper stack competing with GAM as content owner (D6) |
| **Drift from GAM / Mode G** | R-42 reference-without-embed risk when DP “cites” closure without embedding |
| **Thin-assembly / PREC-02 violations** | Summarising `materials.*` into wrapper slots |
| **Duplicated instructional content** | Overview/journey/study_tips restating activity substance (audit modes A, G) |

OQ-17 (knowledge_summary) and R-41 (study_tips) were paired **transport-or-omit** policies: Design Page must not become a second instructional author.

### Deferred upstream packaging

Wave 1/2 explicitly deferred **SQ-1 / SQ-2 — transport-or-omit upstream packaging**. Governance closed 56C with that deferral **non-blocking**. Relocations listed:

- Closure / study tips body → **GAM materials** (W2.1 affirmation)
- Packaging work → **deferred**

So 56C **removed DP synthesis** and **named GAM as substance owner**, but **did not finish** making transportable closure reliably present upstream.

### Sprint 56F follow-on (context, not current live stage)

[`finalise_page` responsibility](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/finalise-page-responsibility-definition.md) later assigned **gap-fill** of `study_tips` (2–4 epistemic bullets) when no GAM closure to transport — to a **finalise_page** stage, **not** to thin Design Page. Current Sprint 58 partial pipeline makes **Design Page** the `page_synthesis` writer and retains **56C thin-assembly prohibitions** (no study_tips authoring). The 56F gap-fill owner was never restored onto today’s DP path.

---

## 2. Historical closure ownership

| Era | Closure substance | Page `study_tips` | Notes |
| --- | ----------------- | ----------------- | ----- |
| Pre-56C | Often DP-synthesised + GAM materials | Authored at DP from “journey” signals | Caused R-41 failures |
| 56B/56C target | **GAM** consolidation/transfer/closure materials | **Transport** from GAM `Content:` | SQ packaging deferred |
| 56F plan | GAM transport preferred | Gap-fill at **finalise_page** if empty | finalise not in current partial path |
| Sprint 58–78 live | GAM activity materials (may include ### Closure / transfer) | Transport-or-omit at Design Page; omit common | Matches T-030 exhibit |

Existing GAM structures that historically represent closure **substance** (not a dedicated page_synthesis writer):

- Material bodies with ### Closure / ### Debrief (GAM-PRES-08 depth floors)
- `transfer_prompt` / consolidation materials
- DLA `transfer_or_application_task` (activity-level, not page wrapper)

There is **no** separate GAM field that already **is** `page_synthesis.study_tips`. Transport was always a **projection** from material content (or a dedicated materials field) into the wrapper slot.

---

## 3. Current ownership gap

| Intended | As-built |
| -------- | -------- |
| GAM produces transportable consolidation/closure bodies | Often only activity-embedded transfer/closure; no reliable page-level transport source |
| Design Page transports into `study_tips` | Contract correct; usually **omits** |
| SQ-1/SQ-2 packaging | **Never completed** |
| 56F finalise gap-fill | **Not present** on live partial Design Page path |

**Gap:** Not “renderer forgot Study tips.” Not “Design Page contract missing.”  
**Gap:** **Incomplete upstream supply + unfinished transport packaging** after DP synthesis was correctly removed.

Latest Lagrangian **91/100** (Subject **94**) remains contract-compliant without `study_tips`; independent QA still recommended a brief final synthesis and less-signposted transfer — pedagogically desirable, architecturally optional under omit-when-none.

---

## 4. Option A — Design Page authors fallback closure

| Criterion | Assessment |
| --------- | ---------- |
| Compatibility with 56C | **Poor** — reopens R-41 / thin-assembly prohibition on study_tips synthesis |
| Risk of restoring 56C problem | **High** — instructional authoring at assembly stage; paraphrase/hallucination risk |
| Sufficient context? | Partial mode uses conversation context only — weak for reliable non-teaching consolidation |
| Thin assembly | Direct conflict with PROHIBITED “study_tips synthesis or authoring” |

**Verdict:** **Reject** as default. Would require an explicit architecture reopen of R-41 (and ideally a restored finalise-style bounded gap-fill owner), not a silent salience tweak.

---

## 5. Option B — GAM owns page-level closure/debrief (hypothesis tested)

| Criterion | Assessment |
| --------- | ---------- |
| Natural instructional-content owner? | **Yes** — Assembly-Time Test R-41 T2; 56C relocation table; GAM-PRES-08 |
| Whole-page context? | **Partial** — GAM sees DLA commission + activity set; true cross-page arc is limited, but **culminating consolidation/transfer** does not require full DP rewrite |
| Compact closure without redesigning A1–A5? | **Yes** — strengthen culminating activity materials (closure/consolidation/transfer) and/or a compact transportable body; do not invent new activities |
| Carry to Design Page without schema change? | **Yes in principle** — existing `page_synthesis.study_tips` + verbatim transport; no `final_synthesis`/`next_steps` |
| Design Page remains transport-only? | **Yes** — DP copies designated upstream closure body into `study_tips`; does not invent teaching |

**Caveat:** “Page-level” does **not** mean GAM writes `page_synthesis` directly (GAM must not). It means GAM authors **substance** that DP **transports**. Historical failure mode was DP inventing that substance.

**Verdict:** **Accept** as ownership decision. Implementation (when authorised) is **prompt/contract packaging**, completing the deferred SQ half in miniature.

---

## 6. Option C — Continue omit-when-none

| Criterion | Assessment |
| --------- | ---------- |
| Pedagogically acceptable? | **Partially** — activity-level transfer/reflection can close the arc; latest package scored 91/100 |
| Independent/self-directed resources | Weaker when no Study tips and transfer is heavily signposted inside activities only |
| QA recommendation | Leaves “brief final synthesis” unaddressed as a product gap |
| Architecture | Fully compliant with 56C as written |

**Verdict:** **Accept as interim compliance**, **reject as terminal product stance** for Sprint 78 quality recovery if the operator wants the QA recommendation addressed without new schema.

---

## 7. Design decision

**Adopt Option B — recorded as S78-D04.**

- **Owner of closure substance:** **GAM** (with DLA commissioning bounds where the culminating activity must include consolidation/transfer/closure materials).
- **Owner of `page_synthesis.study_tips` slot fill:** **Design Page transport only** (verbatim / designated field), omit when none.
- **Do not** authorise Design Page instructional fallback (Option A) without a separate architecture decision reopening R-41.
- **Do not** invent `final_synthesis` / `next_steps` / renderer sections.
- **Do not** treat EP transfer beats alone as page_synthesis content.

---

## 8. Minimal proposed change (not implemented)

If a follow-on implementation is authorised:

| Layer | Change? |
| ----- | ------- |
| Prompt/contract | **Yes** — smallest: (1) DLA/GAM salience so a **transportable** culminating consolidation/closure body exists when the resource is self-directed; (2) Design Page partial salience clarifying **what** to transport into `study_tips` (designated culminating closure/consolidation material or ### Closure body), still **no synthesis** |
| Schema | **No** |
| Production validators | **No** (unless a later capture gate is separately justified) |
| Renderer | **No** |
| New page-synthesis fields | **No** |

Closure content constraints (for later implementation brief): consolidate the taught sequence; may encourage transfer; **must not** introduce new teaching or supply a worked transfer answer (aligns with S78-DP / practice independence).

**Not warranted now:** Option A fallback authorship on Design Page.

---

## 9. Risks

| Risk | Mitigation |
| ---- | ---------- |
| GAM adds another long teaching block labelled “closure” | Cap as compact consolidation; forbid new theory |
| DP still omits because transport cue is weak in conversation-only partial mode | Explicit designation in commission + DP transport line; optional later capture check |
| Drift toward Option A under “salience” wording | Keep “do not synthesize” intact; only name transport sources |
| Treating activity transfer as already sufficient (C) | Document as interim; do not claim QA recommendation closed |

---

## 10. Files inspected

- [S78-T-030](S78-T-030-missing-page-synthesis-closure-diagnostic.md)
- `lib/ld-design-page-partial-contract.js`, `lib/ld-thin-assembly-coherence.js`, `lib/ld-self-directed-rhetoric.js`
- Sprint 56B: Assembly-Time Ownership Test (R-41); OQ-17 review; CP-4 brief
- Sprint 56C: Wave 1 architecture cleanup; Wave 1/2 closure; Wave 2 assembly-coherence discovery; governance signoff (SQ-1/SQ-2 deferred)
- Sprint 56F: finalise-page responsibility; page-synthesis vs sections
- Sprint 42 journey-context notes (pre-56C ownership of closure materials)
- Current GAM-PRES-08 / rhetoric closure references

---

## 11. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-031-page-closure-ownership-design-decision.md` | **Added** — this record |
| `decisions.md` | **S78-D04** |
| `STATUS.md` / `PLAN.md` / `SPRINT-78-START-HERE.md` / `HANDOVER.md` / `next-chat-briefing.md` | Minimal pointers |

**Production / tests:** **unchanged**

---

## 12. Sprint 78 state

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-030 | Diagnostic complete |
| T-031 | **Design/decision complete** — S78-D04 accepted in pack |
| Implementation of B | **Not started** (requires separate authorisation) |
| T-019 | Queued — not started |
