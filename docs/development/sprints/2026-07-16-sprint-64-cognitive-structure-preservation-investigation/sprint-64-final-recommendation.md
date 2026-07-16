# Sprint 64 Final Recommendation

**Sprint:** 64 — Cognitive Structure Preservation Investigation  
**Task:** S64-BL-005  
**Date:** 2026-07-16  
**Status:** Complete  
**Recommended outcome:** **Outcome C** — Sprint 64 complete; recommend a future production-oriented **investigation** charter (not implementation)

---

## Charter

Sprint 64 was authorised to:

> Investigate the smallest viable preservation and manifestation mechanism capable of retaining learner-relevant intermediate reasoning structure beyond the GAM→assembly boundary without implementing production changes or redesigning schemas.

It was **not** authorised to implement production preservation, redesign schemas, redesign renderers, redesign archetypes, or redesign instructional architecture.

Exit criteria (identify preservation approaches, manifestation approaches, location options, trade-offs, and a next-step recommendation) are **met**. This document is that recommendation. It does **not** authorise production work.

**Authoritative inputs:** Sprint 64 reports S64-BL-001 → 004b · Sprint 63 synthesis · Sprint 63 final validation (Outcome A). No experiments were re-run for this task.

---

## Investigation Summary

Uncertainty was reduced in a single chain from “does non-recoverable structure exist?” to “what is the smallest safe experimental path?” to “what remains unknown for product decisions?”

| Investigation | Question | Result | Impact |
| ------------- | -------- | ------ | ------ |
| Sprint 63 Exp 2 | Can archetype-plan fields improve Tier 1 vs Tier 2 for mechanism? | Yes — `required_links` not recoverable from Tier 2; verbatim T1 gains | Proved non-recoverable high-value structure for one archetype |
| Sprint 63 Exp 3 + final validation | Does the class hold across Priority-1 archetypes and production-like flatten? | Yes — `stages`, `key_relationships`/`governing_constraint`; GAM→`materials[]` flatten confirmed | Outcome A — architecture investigation justified; schema redesign not |
| Attachment points (S64-BL-001) | Where could structure attach after flatten? | Structure already on DLA `required_materials`; `materials[]` channel flattens; preserve/normalize unused bridge | Narrowed viable zones; rejected prose recovery |
| Mechanism comparison (S64-BL-002) | Which preservation mechanisms are viable? | Strong: retain `required_materials` (A), opaque `material_id` ref (D), preserve bridge (E); full plan on materials premature | Path variance identified as main unknown → feasibility experiment |
| Correlation feasibility (S64-BL-002b) | Can source and realised materials correlate exactly? | Outcome B: 52/52 exact 1:1 when both sides present; partial/material-only fail closed | Correlation proven under gates; path coverage constrained |
| Manifestation contracts (S64-BL-003) | What contract shapes manifestation safely? | Strong: opaque (A), verbatim envelope (B), ephemeral (F); reject generic projection (C) and instructions-alone (D) | Archetype-specific verbatim envelopes; no universal cognitive schema |
| Location comparison (S64-BL-004) | Where should P/C/E/M run? | Combo 6 (experiment-only) strongest for prototype; Combo 1 longer-term candidate; reject renderer interpretation | Separated preserve from semantic interpretation; ephemeral envelope preferred |
| Bounded prototype (S64-BL-004b) | Can path-gated ephemeral verbatim envelopes drive safe T1? | 3/3 eligible archetypes; 4 exclusions fail closed; full provenance; no production changes | Experimental feasibility proven; production not authorised |

---

## Evidence Summary

### Proven

* Differentiated cognitive structure exists upstream in Priority-1 archetype plans (Sprint 63).
* Learner-relevant intermediate reasoning structure is partially **non-recoverable** after the GAM→assembled `materials[]` boundary (`required_links`, `stages`, `key_relationships` / `governing_constraint`).
* Flattening for the materials channel is real on production-like paths; `required_materials` may remain orphaned (path-dependent).
* Exact `material_id` 1:1 correlation is reliable when source and realised sides coexist (52/52 in the feasibility sample).
* Path-gated, fail-closed operation is feasible (unsupported paths → Tier 2 only).
* Verbatim, archetype-specific manifestation of high-value fields is experimentally feasible via an ephemeral envelope (Combo 6).
* Exact provenance (learner element → source field → value → IDs) can be maintained for every Tier 1–only element.
* Schema redesign is **not** required to explain or experiment on the gap.
* Renderer involvement is **not** required for the smallest experimental manifestation path.
* Generic cognitive projection is **not** justified by available evidence.

### Not Proven

* Production / operational value of Tier 1 manifestation for learners at scale.
* Frequency of eligible (source + realised + correlated) paths in live Priority-1 traffic.
* Cost/benefit or ROI of any production retention strategy.
* Suitability of persistent production envelopes (vs ephemeral experiment-only).
* Necessity or timing of production persistence.
* Maintenance burden under authoring change and multi-path assembly.
* Rollout strategy or feature-flag design.
* Whether Combo 1 / 3 should become production architecture (only candidates, not selected).

### Disproven (for first-step / current evidence)

* Need for a **generic** cognitive projection schema to achieve bounded Tier 1 gains.
* Need for **renderer redesign / renderer-owned interpretation** for the smallest safe experimental path.
* Need for **schema redesign** to explain non-recoverability or to run the prototype.
* Sufficiency of title / position / type matching as correlation (rejected; fail closed on exact ID only).
* Claim that Sprint 64 evidence alone **authorises production implementation**.

---

## Recommendation Options

### Option A — Stop

**For:** Investigation exit criteria met; prototype succeeded; architectural “can it work safely in experiment?” answered.  
**Against:** Operational unknowns (frequency, value, cost) remain; stopping with no recommended future charter leaves product teams without a clear, bounded next question when demand appears.

### Option B — Preserve Findings and Wait

**For:** Architecture question answered within charter; no stated product urgency; findings are retained and reversible.  
**Against:** Waiting without a named future investigation scope risks reopening settled questions or drifting into implementation when urgency appears; frequency/value remain unmeasured.

### Option C — Authorise Future Production-Oriented Investigation

**For:** Separates **architecture feasibility** (done) from **product readiness** (not done); focuses only on unanswered questions; still forbids implementation/schema/renderer work.  
**Against:** Could be deferred until product pull; opening another investigation without demand may compete with higher-priority work.

**Selected:** Option C — because Sprint 64’s own readiness gaps are operational, not architectural, and those gaps are the only evidence-led blockers between “experiment works” and any later production decision.

---

## Production Readiness Assessment

| Area | Status |
| ---- | ------ |
| Architectural feasibility | **Established** (candidate path Combo 6 / 1; responsibilities P/C/E/M/D separated) |
| Experimental feasibility | **Established** (S64-BL-004b success criteria met) |
| Provenance | **Established** (full traces in prototype) |
| Correlation | **Established** under gated conditions (Outcome B) |
| Path coverage | **Partially Established** (supported when both sides present; live frequency unknown) |
| Production design | **Not Investigated** (no production architecture selected) |
| Operational value | **Unknown** |
| Cost/benefit | **Not Investigated** |
| Rollout strategy | **Not Investigated** |
| Maintenance model | **Not Investigated** |

**Interpretation:** Sprint 64 must not be read as production authorisation. Experimental and gated architectural feasibility ≠ production readiness.

---

## Risks

| Risk | Current Evidence | Remaining Unknowns |
| ---- | ---------------- | ------------------ |
| **Architectural** — wrong attachment / flatten boundary | Boundary mapped; Combo 6/1 preferred; renderer interpretation rejected | Whether Combo 1/3 survive live multi-path assembly at volume |
| **Semantic** — invention / paraphrase / generic projection | Verbatim-only + fail-closed proven in prototype; C/D contracts rejected | Label chrome drift if future consumers expand beyond Exp 2/3 patterns |
| **Operational** — rare eligible paths → low value | Path dependence known; partial paths fail closed | Live eligible-path frequency; learner impact |
| **Maintenance** — dual source/material retention cost | Experiment-only reversible today | Cost of retaining `required_materials` + correlating under authoring churn |
| **Product** — shipping without value proof | Explicitly not authorised | Whether any product milestone needs Tier 1 manifestation |

Solved for investigation scope: semantic invention via ungated/generic paths; renderer necessity for first experiments; schema necessity for the gap.  
Unsolved for product: frequency, value, cost, persistence, rollout.

---

## Decision Matrix

| Question | Answer |
| -------- | ------ |
| Does non-recoverable structure exist? | **Yes** |
| Can it be preserved? | **Yes, conditionally** — when `required_materials` (or equivalent source) is retained on a supported path |
| Can it be correlated? | **Yes** — exact `material_id` 1:1 when both sides present |
| Can it be manifested safely? | **Yes, experimentally** — verbatim archetype-specific ephemeral envelope |
| Can it fail closed? | **Yes** |
| Does it require schema redesign? | **No** |
| Does it require renderer redesign? | **No** (for smallest experimental path) |
| Does it require a generic cognitive schema? | **No** |
| Does it justify production implementation? | **No** |
| Does it justify future production investigation? | **Yes** — scoped to unanswered operational/product questions only |

---

## Recommended Outcome

## Outcome C

**Sprint 64 complete. Recommend a future production-oriented investigation charter.**

Justification: Sprint 64 answered the charter’s architecture questions and proved a reversible experimental path. It did **not** establish operational value, eligible-path frequency, cost/benefit, or a production retention design. Those unknowns are the smallest justified next investigation — and they are **not** implementation.

Outcomes A and B are rejected: A ignores remaining product-blocking unknowns; B preserves evidence but does not name the bounded questions that must be answered before any future production decision.

---

## Future Charter (if applicable)

**Recommendation only — do not start this sprint from Sprint 64 close-out.**

### Proposed title

Cognitive Structure — Production Readiness Investigation (frequency, value, retention options)

### Investigate only

* Frequency of eligible paths (source + realised + exact correlation) in Priority-1 live or near-live flows  
* Operational / product value signals for Tier 1 verbatim manifestation (evidence-led, not assumed)  
* Comparative maintenance cost of candidate retention strategies (page retain ± opaque ref vs experiment-only continue)  
* Cost/benefit framing sufficient for a later go/no-go — still without shipping  

### Explicitly exclude

* Production implementation or merge  
* Rollout / feature flags as shipping work  
* Schema redesign  
* Renderer redesign or renderer-owned interpretation  
* Generic cognitive projection schemas  
* Reopening Sprint 63/64 settled architectural conclusions without contradictory evidence  

### Exit criterion

Evidence-based recommendation: **defer**, **continue experiment-only**, or **authorise a separate bounded production design investigation** — never silent authorisation to implement.

---

## Sprint 64 Final Finding

Sprint 64 investigated the smallest viable preservation and manifestation path for learner-relevant intermediate reasoning structure beyond the GAM→assembly boundary, without production changes or schema redesign. Building on Sprint 63 Outcome A, it confirmed that high-value archetype-plan fields already exist upstream, flatten on the materials channel, and cannot be safely reconstructed from Tier 2 signals alone. Attachment and mechanism work narrowed viable options to retaining source plans (especially `required_materials`), correlating by exact `material_id`, and bridging without semantic reinterpretation. Correlation feasibility (Outcome B) showed exact 1:1 joins when both sides coexist and mandated fail-closed behaviour on partial or material-only paths. Manifestation contracts rejected generic cognitive projection and renderer-owned instructions; they retained opaque diagnostic plans and archetype-specific verbatim envelopes as the safe shapes. Location comparison placed the first prototype in an experiment-only path (Combination 6), with page retention plus adapter as a longer-term candidate and renderer interpretation rejected. The bounded ephemeral-envelope prototype then exercised mechanism, process, and mental-model samples: eligible cases produced Tier 1 outputs with complete provenance and no semantic invention; ineligible cases remained Tier 2 with recorded reasons; production artefacts were untouched. Sprint 64 therefore establishes gated architectural and experimental feasibility for path-gated verbatim manifestation, and disproves the necessity of schema redesign, renderer redesign, or a universal cognitive schema for that experimental path. It does not establish production value, eligible-path frequency, cost/benefit, persistence design, rollout, or maintenance under live load. Production implementation is not justified. A future, narrowly scoped production-readiness investigation of frequency, value, and retention options is justified as a recommendation only — and must not be read as authorisation to implement.

---

## Report metadata

**Sprint:** 64 · **Task:** S64-BL-005 · **Outcome:** C · **Date:** 2026-07-16  
**Related:** [bounded-prototype-ephemeral-verbatim-envelope.md](bounded-prototype-ephemeral-verbatim-envelope.md) · [sprint-summary.md](sprint-summary.md)
