# Sprint 18 — Slice 3C proposal (docs only)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-18-slice-3c-adequacy-proposal.md`  
**Status:** **Design reference** — Slice 3C **chartered** for implementation; see [`sprint-18-slice-3c-charter.md`](sprint-18-slice-3c-charter.md). **Not yet implemented.**

**Chartered scope (3C-2 only):** checks **A** and **B**; fixtures **S8**, **S9**. Checks **C–E** and fixtures **S10–S12** deferred.

**Prerequisite:** Slices 1–2 closed — `topic_scope_under_specified` live; **91 tests green**; S7 proves post-synthesis `planning_adequacy` surfacing.

**Pack:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Charter boundary (unchanged):** No new required factors; no chat; no dismiss state; no AI phrasing; no LD; no renderer/schema redesign. All candidates remain **assistive** (`planning_adequacy`, `severity: recommendation`).

---

## 1. Selection criteria

Slice 3C should add **3–5** rules that:

1. Use **workflow-semantic** signals (step titles, chain shape, heuristics flags) — not only factor IDs.
2. Complement **S7** (`topic_scope_under_specified`) without duplicating it.
3. Fire only when **essentials are resolved** and a **post-heuristic design snapshot** exists (Slice 2 contract).
4. Stay **deterministic** and **pack-declared** (RQ-P1).
5. Keep false-positive rate manageable (assistive notices, not blocking validation).

**Deprioritized for 3C:** Rules that repeat Sprint 17 **blocking** validation (upload-without-inputs, mixed objective conflict) or need conversational follow-up.

---

## 2. Recommended candidate checks (priority order)

### Candidate A — `evidence_language_generate_from_topic_mismatch`

| Field | Detail |
|-------|--------|
| **Focus** | Synthesis / input posture mismatch |
| **User-visible question** | “You asked to work from evidence, but the plan generates content from a topic — is that intended?” |
| **Value** | Separates **S7 topic breadth** from **corpus vs generate** ambiguity; common in executive briefs (“analyse the evidence…”) |

**Trigger semantics (proposed `when`):**

| Clause | Value |
|--------|--------|
| `resolvedFactorEquals` | `input_strategy: generate_from_topic` |
| `briefFieldMentionAnyOf` *(new)* | Fields: `designIntent`, `goal`, `desiredOutputs` — terms: `evidence`, `analyse the evidence`, `analyze the evidence`, `from sources`, `source material`, `corpus`, `literature`, `sector report`, `uploaded` |
| `stepsIncludeAny` | `Normalize Content` **or** `Extract Key Findings` (plan assumes ingest path) |
| **Must not fire when** | `input_strategy` is `provided_source_content` or `mixed` |

**Example brief (positive — S8):**

> Design intent: *“Analyse the evidence and produce an executive briefing on AI governance risks for the board.”*  
> Inputs empty; essentials resolved to `generate_from_topic`, `objective_type: briefing`, `output_depth: standard`.

**False-positive risks:**

| Risk | Mitigation |
|------|------------|
| User intentionally uses “evidence” rhetorically while accepting generated grounding | Assistive only; action text offers “confirm topic-only generation” |
| Overlap with **S7** on same brief | **Stacking policy:** allow both notices; cap **3** `planning_adequacy` rows per evaluation (3C charter) |
| **S2**-style unsafe upload | Essentials path should stay on validation; rule requires resolved `generate_from_topic` |

**Severity:** `recommendation`  
**Assistive-only:** **Yes** — do not block save/run; do not add a required factor.

**Fixture:** **S8** — same smoke narrative as S7 with explicit `planningAdequacy` row for this id; **S3** negative (provided sources).

---

### Candidate B — `plan_heavy_for_output_depth`

| Field | Detail |
|-------|--------|
| **Focus** | Workflow heaviness vs requested depth |
| **User-visible question** | “You asked for a concise output, but the plan includes deep synthesis steps — trim the chain or raise depth?” |
| **Value** | Addresses “executive / concise” briefs that still receive full analysis chain (Sprint 18 research Q §2 / bootstrap §5) |

**Trigger semantics:**

| Clause | Value |
|--------|--------|
| `resolvedFactorEquals` | `output_depth: concise` |
| `stepsIncludeAny` | `Conduct Thematic Analysis` **or** `Build Literature Matrix` |
| `stepsIncludeAny` (second group) | `Generate Briefing Note` **or** `Generate Research Summary` |
| **Optional tighten** | `stepCountAtLeast` *(new)* `minSteps: 7` to avoid firing on abbreviated test chains |

**Example brief (positive — S9):**

> *“Concise executive briefing on university AI policy for provosts.”*  
> Resolved: `objective_type: briefing`, `input_strategy: generate_from_topic`, `output_depth: concise`, audience set.

**False-positive risks:**

| Risk | Mitigation |
|------|------------|
| User wants concise **deliverable** but accepts backstage analysis | Message frames trade-off; action: “Set depth to standard/detailed or remove thematic/matrix steps in edit” |
| **S6** minimal brief | Missing `output_depth` → no fire (essentials gate) |
| Heuristic chain varies by model | Pin `expectedCurrent.heuristics.stepTitles` in fixture like S7 |

**Severity:** `recommendation`  
**Assistive-only:** **Yes**

**Fixture:** **S9** positive; **S7** negative if `output_depth: standard` (only topic_scope fires).

---

### Candidate C — `page_delivery_without_design_page`

| Field | Detail |
|-------|--------|
| **Focus** | Delivery mismatch (HTML/page/export cues vs plan) |
| **User-visible question** | “The brief asks for an HTML-ready page, but Design Page is not in the plan.” |
| **Value** | Surfaces **S5-class** intent after essentials complete when heuristics omit terminal renderer step |

**Trigger semantics:**

| Clause | Value |
|--------|--------|
| `briefFieldMentionAnyOf` | Reuse pack `workflowPolicy.researchDesignPageAppend.pageDeliveryTextSignals` (or duplicate list in adequacy `when` for pack-only declaration) |
| `stepsExclude` *(new)* or `stepsLackAny` *(new)* | `Design Page` absent from `design.steps` |
| `resolvedFactorEquals` | `objective_type` in `briefing` \| `summary` (exclude `questions` unless page + synthesis cues) |
| **Must not fire when** | `objective_type: questions` and pack `excludeObjectiveTypes` policy intentionally suppresses page |

**Example brief (positive — S10):**

> Desired outputs: *“HTML-ready structured page for utilities export.”*  
> Design intent: *“Climate evidence briefing for institutional leaders.”*  
> Resolved essentials including `objective_type: summary` (mis-inferred) **or** briefing with heuristic chain ending at `Format Final Output` only (no Design Page).

**False-positive risks:**

| Risk | Mitigation |
|------|------------|
| Design Page appended on next re-generation | Re-evaluate on each synthesis (Slice 2 behaviour) |
| “Structured” appears in non-page context | Tie to `pageDeliveryTextSignals` list only |
| **S5** before elicitation complete | `missingFactorIds.length > 0` gate |

**Severity:** `recommendation`  
**Assistive-only:** **Yes** — suggest confirming delivery format, not forcing renderer work in 3C.

**Fixture:** **S10** positive (resolved + no Design Page); **S5** negative pre-design; resolved S5-like brief **with** Design Page negative.

---

### Candidate D — `objective_synthesis_path_mismatch`

| Field | Detail |
|-------|--------|
| **Focus** | Synthesis mismatch (primary objective vs dominant chain) |
| **User-visible question** | “Primary objective is a summary, but the plan centres on thematic analysis and evidence mapping.” |
| **Value** | Catches **safe but misaligned** plans after conflict resolution (distinct from **S4** blocking conflict) |

**Trigger semantics (two pack rows or one parameterized row):**

| Variant | When |
|---------|------|
| **D1 — summary objective, analysis-heavy plan** | `resolvedFactorEquals.objective_type: summary` + `stepsIncludeAny`: `Conduct Thematic Analysis` + `stepsIncludeAny`: `Build Evidence Map` |
| **D2 — questions objective, briefing-heavy plan** | `resolvedFactorEquals.objective_type: questions` + `stepsIncludeAny`: `Generate Briefing Note` + `stepsExclude`: `Generate Research Questions` |

**Example brief (positive — S11):**

> *“Short literature summary for programme leads.”* → resolved `objective_type: summary`, heuristic plan includes Thematic Analysis + Evidence Map + Summary.

**False-positive risks:**

| Risk | Mitigation |
|------|------------|
| Summary intended to be evidence-deep | Assistive copy; action to switch objective to `analysis` or remove steps |
| Model adds optional steps | Fixture pins step set; use `stepsIncludeAll` for critical subset |
| **S4** unresolved conflict | Blocked at validation — adequacy only when essentials complete |

**Severity:** `recommendation`  
**Assistive-only:** **Yes**

**Fixture:** **S11** (D1 positive); optional **S12** for D2; **S4** negative while conflict disclosure active.

---

### Candidate E — `audience_generic_for_executive_delivery`

| Field | Detail |
|-------|--------|
| **Focus** | Audience adequacy |
| **User-visible question** | “Audience is very broad (e.g. executives / leadership) for a decision briefing — specify sector or role?” |
| **Value** | Complements **S7** topic scope with **stakeholder** precision for executive workflows |

**Trigger semantics:**

| Clause | Value |
|--------|--------|
| `resolvedFactorEquals` | `objective_type: briefing` |
| `weakAudienceCue` *(new)* | Audience factor text matches generic terms: `executive`, `leadership`, `board`, `senior stakeholders`, `decision makers`, `C-suite` — and lacks sector/org cues in audience + `scopeCueFields` |
| `stepsIncludeAny` | `Generate Briefing Note` |
| **Must not fire when** | Audience contains specific sector/org (`university`, `NHS`, `faculty`, `ministry`, etc.) |

**Example brief (positive — S12):**

> Audience: *“Executive leadership”*; briefing on AI governance; essentials complete (may also fire **S7** — test stacking).

**False-positive risks:**

| Risk | Mitigation |
|------|------------|
| “Executive leadership” is correct for internal corp comms | Assistive only; action to add sector or confirm |
| Duplicate noise with **S7** | Different disclosure id/message; shared category `planning_adequacy` |
| **S3** “Faculty leaders” | Specific enough — negative |

**Severity:** `recommendation`  
**Assistive-only:** **Yes**

**Fixture:** **S12** positive; **S3** negative; **S7** may assert **two** adequacy rows when both fire (document in charter).

---

## 3. Deferred candidates (post–3C or need more design)

| Id | Idea | Why deferred |
|----|------|----------------|
| **F** | `validate_step_without_validation_intent` | Needs negative match against `researchValidationIntent` signals — new `briefLacksValidationIntent` interpreter |
| **G** | `generate_content_step_without_topic_posture` | Overlaps GRC gate + S7; low marginal value |
| **H** | `mixed_objective_resolved_but_chain_bloated` | Too close to **S4** + Candidate D; wait for dismiss/lifecycle (3B) before noisy post-conflict notices |

---

## 4. Runtime extensions (3C implementation charter)

Current `workflowBriefAdequacyWhenMatches` supports: `resolvedFactorEquals`, `stepsIncludeAny`, `stepsIncludeAll`, `weakTopicScope`.

| Extension | Used by | Semantics sketch |
|-----------|---------|------------------|
| `briefFieldMentionAnyOf` | A, C | `{ fields: string[], terms: string[] }` — case-insensitive substring on brief fields |
| `briefLacksMentionAnyOf` | F (deferred) | True when none of terms appear in fields |
| `stepsLackAny` / `stepsExclude` | C, D2 | True when normalized step title absent |
| `stepCountAtLeast` | B | `design.steps.length >= n` |
| `weakAudienceCue` | E | Mirror `weakTopicScope` for `audience` factor + sector terms list |
| `packPolicyRef` *(optional)* | C | Resolve term list from `workflowPolicy.researchDesignPageAppend.pageDeliveryTextSignals` by path — avoids drift |

**Rule:** Pack declares lists; runtime interprets generically (no per-scenario `app.js` branches).

---

## 5. Proposed fixture coverage (S8+)

| Fixture | Scenario | Primary check | Adequacy expected | Negative reuse |
|---------|----------|---------------|-------------------|----------------|
| **S8** | Evidence-language + `generate_from_topic` + analysis chain | A | `evidence_language_generate_from_topic_mismatch` | S3 (provided source) |
| **S9** | `output_depth: concise` + full synthesis + briefing | B | `plan_heavy_for_output_depth` | S7 (`standard` depth) |
| **S10** | Page/export cues; resolved essentials; no Design Page | C | `page_delivery_without_design_page` | S5 pre-design; resolved w/ Design Page |
| **S11** | `objective_type: summary` + analysis-heavy steps | D1 | `objective_synthesis_path_mismatch` | S4 (blocking conflict) |
| **S12** | Generic executive audience + briefing chain | E | `audience_generic_for_executive_delivery` | S3 (`Faculty leaders`) |

**S7:** Unchanged — continues to prove `topic_scope_under_specified` only (unless S12 stacked intentionally).

**Test file:** Extend `tests/workflow-research-adequacy.test.js` (+5–8 tests) or add `workflow-research-adequacy-s8-s12.test.js` if file size warrants — charter decision.

**Estimated test count after 3C:** 91 + ~8–12 → **~99–103** (charter to confirm per-rule negatives).

---

## 6. Cross-cutting policies (locked in charter)

| Policy | Value |
|--------|--------|
| **Max notices per evaluation** | **3** `planning_adequacy` rows (pack declaration order) |
| **Severity** | All `recommendation` in 3C |
| **Assistive-only** | **All yes** — RQ-B1 locked |
| **Evaluation gate** | Same as Slice 2: `missing.length === 0` + design snapshot |
| **Disclosure copy** | New `disclosurePolicy.messages` + `entries` per id (deterministic) |
| **S1–S6** | Do not edit golden sparse semantics; negatives only |

---

## 7. Implementation phases (chartered — see charter)

| Phase | Deliverable | Status |
|-------|-------------|--------|
| **3C-1** | Runtime predicates + cap at 3 rows | **Chartered, not implemented** |
| **3C-2** | Pack checks **A**, **B**; fixtures **S8**, **S9**; tests + negatives S3, S7-standard-depth | **Chartered, not implemented** |
| **3C-pass-2** *(deferred)* | Checks **C–E**; fixtures **S10–S12** | Not chartered |

**Charter:** [`sprint-18-slice-3c-charter.md`](sprint-18-slice-3c-charter.md)

**Out of scope:** dismiss (3B), chat, AI phrasing, LD, renderer/schema.

---

## 8. Summary matrix

| ID | Check id | Focus | Severity | Assistive | Fixture |
|----|----------|-------|----------|-----------|---------|
| A | `evidence_language_generate_from_topic_mismatch` | Synthesis / input mismatch | recommendation | Yes | **S8** (3C-2) |
| B | `plan_heavy_for_output_depth` | Heaviness vs depth | recommendation | Yes | **S9** (3C-2) |
| C | `page_delivery_without_design_page` | Delivery mismatch | recommendation | Yes | S10 *(deferred)* |
| D | `objective_synthesis_path_mismatch` | Objective vs chain | recommendation | Yes | S11 *(deferred)* |
| E | `audience_generic_for_executive_delivery` | Audience adequacy | recommendation | Yes | S12 *(deferred)* |

---

## 9. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-18-slice-3c-charter.md`](sprint-18-slice-3c-charter.md) | **Slice 3C implementation charter** |
| [`sprint-18-slice-1-charter.md`](sprint-18-slice-1-charter.md) | Slice 1 contract + S7 |
| [`SPRINT-18-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) | Slices 1–2 closeout |
| [`sprint-18-research-questions.md`](../exploration/sprint-18-research-questions.md) | Timing / blocking framing |
| `domains/research/domain-research-step-patterns.md` | Live pack (Slice 1 rule) |
| `tests/fixtures/workflow-brief-research-sparse/S7-*.json` | Existing adequacy golden |
