# Prism Architectural Debt

**Status:** Programme-level Governance artefact  
**Purpose:** Track unresolved architectural questions, temporary mechanisms, accepted debt, deferred work and retired directions whose rationale must remain visible.

---

# A. Open architectural questions (post-alpha)

**Programme note (2026-09-03):** Alpha development is **complete**. Items below are **not** retroactive Alpha blockers and are **not** automatically product-backlog planning obligations. Current planning authority: [PRODUCT-BACKLOG.md](../../backlog/PRODUCT-BACKLOG.md). Handle evidenced defects from alpha use; do not invent work from historical debt alone.

## D-001 — Episode Plan → DLA lineage status

**Priority:** High (if reopened)  
**State:** Historical open verification question — not a current planning item unless alpha use evidences a lineage defect  
**Milestone relevance:** Post-alpha (was Alpha-facing pre-close)

Historical Sprint 38S implemented explicit beat → DLA obligation traceability and anti-collapse rules.

Current status must be established for:

- `instructional_function`;
- `plan_beat_index`;
- `_learner_task_segments[]`;
- `_population_trace[]`;
- `episode_plan_ref`;
- `buildBeatTraceMatrix(...)`;
- population rules;
- anti-collapse rules.

For each mechanism classify:

```text
CURRENT
RELOCATED
SUPERSEDED
REMOVED DELIBERATELY
REGRESSED
UNKNOWN
```

Then identify what current mechanism, if any, preserves the same guarantee.

**Do not assume regression until repository evidence establishes it.**

---

## D-002 — Episode Plan selection adequacy

**Priority:** Medium  
**State:** Open generation/quality observation — promote only with fresh evidence  
**Milestone relevance:** Post-alpha

Recent runs show materially different Episode Plan richness.

Need to distinguish:

- legitimate pedagogical discrimination;
- underplanning;
- generation variability;
- weak planning contract.

Do not introduce minimum beat counts.

Assess whether the selected journey is appropriate to the learning outcome and activity.

---

## D-003 — Whole-resource conformance and lineage validation

**Priority:** Medium  
**State:** Historical design question — not standing product work; address evidenced conformance defects if they arise in use  
**Milestone relevance:** Post-alpha (was Alpha-facing pre-close)

Need deterministic evidence that required instructional obligations:

1. were selected/commissioned;
2. were emitted by the owning stage;
3. retained correct identity/binding;
4. survived capture/assembly;
5. reached the final learner resource;
6. manifest the intended function where deterministically testable.

Validation must be conditional and function-based, not maximalist component counting.

It should be capable of detecting, where evidence permits:

- missing obligations;
- wrong identity/binding;
- wrong order;
- collapsed functions;
- lost learner workspaces;
- missing evidence providers;
- model/practice leakage;
- missing required review/verification/transfer/closure.

---

## D-004 — GAM malformed-output E2 family

**Priority:** Medium while recurring  
**State:** Open / intermittent — fail-closed policy retained; not a standing backlog programme  
**Milestone relevance:** Post-alpha operational observation

Known malformed-output family.

Current policy:

- fail closed;
- preserve evidence;
- no silent sanitisation.

Continue narrowing provenance between generation, capture and other tooling.

---

## D-005 — Temporary operational-suitability verifier

**Priority:** Low  
**State:** Temporary instrumentation — retire/reduce when no longer useful  
**Milestone relevance:** Post-alpha

Useful for identifying systemic GAM failure classes.

Target state is first-pass suitable generation, not permanent reliance on post-generation repair or checking.

Retire or reduce once failure classes are understood and generation is reliably suitable.

---

## D-006 — Release packaging

**Priority:** High (post-alpha planning)  
**State:** Genuine future requirement — canonical planning item **[PB-S-005](../../backlog/PRODUCT-BACKLOG.md#pb-s-005--release--deployment-packaging)**  
**Milestone relevance:** Post-alpha (was Alpha release prerequisite framing pre-close)

Need a reproducible method for producing a deployment package/folder from known-good project source rather than deploying directly from the working project folder.

The release process should establish what is shipped and from which verified state.

---

# B. Queued / conditional debt

## D-007 — Activity/session timing

**State:** Historical queued note; session-level Duration Adjustments delivered in Sprint 80; further per-activity timing only if alpha use evidences a concrete need

Duration may exist upstream without explicit per-activity allocation.

If timing becomes a requirement, establish authoritative ownership and lineage from session duration through planning/sequence/assembly.

Do not assign it to the renderer by default.

---

## D-008 — GAM restructure

**State:** Conditional; post-Alpha by default

Do not restructure GAM while DLA/conformance behaviour remains unsettled.

Promote before Alpha only if evidence shows:

- current GAM architecture blocks Alpha reliability; or
- restructuring offers overwhelming risk-reduction/value.

Avoid architecture work driven solely by aesthetic symmetry.

---

## D-009 — Image consistency

**State:** Post-Alpha by default

Promote only if representative benchmark evidence shows image inconsistency materially invalidates Alpha instructional quality or usability.

Keep distinct from pedagogical-diagram architecture.

---

## D-010 — Settings → Adjustments

**State:** **Architectural question answered** — Sprint 80 delivered **Adjustments** as the supported variability model and closed WORKING ALPHA ([Sprint 80 CLOSED](../sprints/2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/SPRINT-80-START-HERE.md)).

The S80-T-006 gate decided **Option C**: the historical 41-control Settings catalogue is **superseded product design**, replaced by **Adjustments** — a small allowlisted set of typed workflow parameters plus an optional per-step natural-language author instruction. `[PRISM_STEP_PARAMS]` is demoted to legacy with no reachable route to a model.

**Delivered in Sprint 80 (accepted):** parameter registry and resolution (`resolveEffectiveRunContext`), `workflow.adjustments` persistence, per-step Additional Instruction, Topic / Duration / Audience / Assessment Quantity+Difficulty and related governed Adjustments slices through closeout (S1–S8 as accepted). Historical pack Settings UI removed from the active surface; inert parsing retained safely under tests.

**Planning disposition (2026-09-03):** Former product-backlog **PB-FA-005** is **retired**. Do **not** preserve a generic “remaining parameterisation” programme. Add a concrete Adjustment only when alpha use evidences a specific need. Residual observations in the Sprint 80 architectural-debt ledger remain **historical** — not canonical planning obligations.

Do not treat pack-declared Settings as requirements to activate, and do not declare a registry parameter live without implementing its projection and tests in the same slice.

---

## D-011 — Slideshow / narrated MP4 / Presentation

**State:** Lightweight future product idea only — see [PRODUCT-BACKLOG](../../backlog/PRODUCT-BACKLOG.md) § Lightweight future product ideas. Former PB-FA-008 “Slideshow as architecture extensibility test” is **superseded**.

Concept notes (historical): narrated video from slides/stills using TTS may be valuable later; not a current architecture programme.

---

## D-012 — Formal productisation of Governance

**State:** Method now; implementation later

Governance can operate as a curated workflow/prompts before becoming a Prism-integrated feature.

Immediate value does not depend on agent implementation.

---

## D-013 — Formal productisation of Generation Forensics

**State:** Method now; implementation later

Use LLM/Copilot artefact-grounded diagnostics to localise likely first loss, then use Cursor/repository inspection to verify bounded findings.

Investigations should remain context-driven rather than forced into a rigid universal checklist.

---

## D-014 — Test-suite baseline instability and order dependence

**State:** **Confidence issue resolved** 2026-08-28 (bounded RC1/RC2 repair). Full write-up:
[D-014-test-suite-confidence-diagnostic.md](D-014-test-suite-confidence-diagnostic.md) (§11 repair record).

**Working-alpha impact:** None. Gate: `npm run test:first-class` (**339/339**, includes S80 **229/229**).

**Repair:**

1. **RC1** — vm bootstrap auto-injects `PRISM_LEARNER_RENDERER_VNEXT` (test harness only; no production `app.js` fallback). True unavailable asserts eliminated.
2. **RC2** — inventory builds use isolated temp dirs via `PRISM_GAM_INVENTORY_OUT_DIR` + test helper; ±1 flake eliminated.
3. Historical full suite remains noisy (**419** stable failing locations post-repair) as **understood backlog** (RC3–RC8). Absolute count is not the confidence criterion.

**Disposition:** **A — D-014 CONFIDENCE ISSUE RESOLVED.** Sprint 80 stays **CLOSED**.

---

# C. Superseded / retired directions

These are retained as negative programme knowledge.

## R-001 — Whole-page progressive LLM enrichment

**Status:** Retired / empirically disproven

At realistic page sizes, LLM stages failed to preserve complete growing page state reliably despite prompt hardening.

Do not reintroduce without materially new evidence/capability.

---

## R-002 — LLM-owned final merge/composition

**Status:** Retired

Deterministic assembly is canonical.

---

## R-003 — Parallel/legacy learner rendering path

**Status:** Retired

The deterministic vNext learner renderer is canonical.

---

## R-004 — Heuristic renderer recovery of missing pedagogy

**Status:** Rejected

Do not reconstruct upstream semantics from prose, titles, IDs or fuzzy matching in the renderer.

---

## R-005 — Maximal pedagogical ontology / scaffold saturation

**Status:** Rejected

Prism deliberately uses proportional instructional support.

More fields/elements are not inherently better.

---

## R-006 — Silent repair/sanitisation of malformed authoritative generation

**Status:** Rejected

Fail closed and preserve evidence.

---

## R-007 — Append-now / rationalise-prompts-later

**Status:** Rejected engineering practice

Prompt architecture must be intentionally owned and behaviourally gated.

---

## R-008 — Standing temporary DLA rollback (Sprint 76 dual builders)

**Status:** Retired (Phase D, post–Sprint 79 maintenance)

Sprint 77 retained `buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet` and `dlaCanonicalAssembler: false` as a temporary rollback rail after the canonical assembler switch. Canonical DLA later absorbed Sprint 78 commissioning; the rollback path became an obsolete normative fork.

Phase D removed the production rollback selector, dual-inject/append paths, and obsolete builders. Live V2 DLA fails closed if `assembleDlaCanonicalContract` is unavailable. Historical sprint records retain the migration narrative.

Do not reintroduce a standing temporary dual DLA constitution.

---

# D. Historical mechanisms not automatically considered debt

Do not convert every superseded historical mechanism into backlog.

Examples include:

- older Design Page ownership mechanisms;
- early two-column manifestation prototypes;
- legacy renderer affordances;
- obsolete pattern-library coverage gaps;
- earlier cognition-projection experiments.

Governance should preserve their rationale where useful while recognising that later architecture may already solve the underlying problem differently.

---

# E. Debt governance rules

At sprint opening/end, review this file and ask:

- Did evidence promote a hypothesis to proven debt?
- Did a temporary mechanism become permanent accidentally?
- Did a debt item become milestone-critical?
- Did a later architecture supersede an item?
- Has a retired idea reappeared without new evidence?
- Is an item merely desirable product development rather than architectural debt?

Keep the list bounded. Implementation tasks belong in sprint plans/backlogs; this file records programme-significant debt and rationale.
