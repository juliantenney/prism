# Sprint 80 — Next-chat briefing

**Sprint status:** **OPEN** (2026-08-27)
**Opening:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Context (load this first)

| Fact | State |
| ---- | ----- |
| Sprint 80 | **OPEN** — discovery complete; authorised implementation slices in progress |
| S80-T-001 … T-004 | **COMPLETE — ACCEPTED** |
| S80-T-005 | **COMPLETE** (acceptance may still be pending) |
| S80-T-005A | **COMPLETE** (awaiting acceptance) |
| S80-T-005B | **COMPLETE** (awaiting acceptance) |
| S80-T-005B.1 | **COMPLETE** (awaiting acceptance; corrected by T-005B.2) |
| S80-T-005B.2 | **COMPLETE — ACCEPTED** |
| S80-T-006 | **DECIDED** — Option C: Adjustments |
| S80-T-007 | **PLAN — ACCEPTED** |
| **S80-S1** | **COMPLETE — ACCEPTED** — registry + `workflow.adjustments` |
| **S80-S3** | **COMPLETE — ACCEPTED** — per-step Additional Instruction, live via I1 + I2 |
| **S80-S2** | **COMPLETE** — `topic` declared and **live** in all 8 model-driven steps; Henry VIII → Elizabeth I proven on one saved workflow with no regeneration, no AI call and no `resolvedFactors` write |
| **S80-S4** | **COMPLETE** — Settings → **Adjustments**; historical pack catalogue off the active surface (code retained, inert); Instructions (`step.notes`) and Additional Instruction kept as **two distinct supported** capabilities; **Episode Plan now supports Additional Instruction** (explicit operator correction superseding S2/S3); stale step-1 `Goal:` omitted when Topic is adjusted. 28 tests; zero new failing locations |
| Remaining slices (Assessment, S8–S10) | **NOT STARTED** — separate authorisation required each |
| **S80-T-009** | **COMPLETE — discovery only.** Goal vs Topic runtime-authority diagnostic. Headline: **Goal is already author-editable post-Create** (`#workflowGoal` → `wf.workflowOutputSpec.goal`, `app.js:32822`) and **already contradicts frozen Topic** in step-1 prompts (new defect **D4**). Goal also already has non-text runtime effects — cognition-pack selection (`8415`+`8437`) and the learner **page title** (`11824`, new defect **D5**). Deterministic topic extraction from prose is unreliable (**D7**), so Topic cannot be replaced by Goal. Preferred architectural reading: **Option E** — declare a runtime Goal as a `workflowContext` text parameter alongside a retained Topic. **No operator decision recorded** |
| **S80-S5** | **IMPLEMENTED — awaiting review.** Operator adopted T-009 **Option E**. Goal is now a declared Adjustments parameter (`type: text`, `multiline`, `projection: workflowContext`) whose commissioned source is the **frozen** `initialBrief.goal`; runtime Goal persists at `adjustments.parameters.goal`. **Topic retained** as the concise subject label and is now the page-title source. `#workflowGoal` retired to read-only commissioning info (disposition C) and Save no longer gathers it. **D4, D5, D6 fixed**; D7 avoided; D8 repurposed. S4's `supersedesCommissionedContextFields: ["goal"]` on Topic **retired** (mechanism kept, generic). Precedence is positional/generic so future typed Duration/Audience outrank Goal prose with no wording change. **147/147 focused tests; 0 new failing locations vs baseline (393 pre-existing)** |
| **S80-S6** | **IMPLEMENTED — awaiting review.** Duration is a declared Adjustments parameter (`id: duration_minutes`, `type: number`, `units: minutes`, `min/max 10–480`, `projection: workflowContext`), commissioned from the frozen `resolvedFactors.duration_minutes` only. **D1 FIXED**: `buildDlaWorkbookOverlayBlock(options)` now derives target and a **±10** band from the effective duration; the 60-minute default is **byte-identical** to the accepted contract (proven against `git show HEAD:`). LS receives Duration through the shared projector — **no D3 step-param revival**. Ownership preserved: Duration = constraint, **LS = allocator**, renderer copies. **Zero prompt builders edited**; 6 production sites, 4 of them shared architecture. **32 new tests; 230/230 focused; 0 new failing locations vs baseline (393 pre-existing)** |
| **S80-T-010** | **COMPLETE — discovery only.** Audience / learner-level runtime parameter diagnostic. Headline: **Audience and learner level are two concepts with opposite health.** Audience prose is already model-visible (step 1 only) but via the **mutable** `workflowOutputSpec.audience` — the unfixed D4 pattern (**D13**) — while the **only** reliable frozen commissioned source is `initialBrief.audience` — `resolvedFactors.audience` is **never written under the LD pack** (verified on a real saved workflow), so every LD learner page carries the hardcoded constant `"Learners"`, and `page.audience` is **never rendered** (vNext renderer has zero audience references). **Learner level reaches no prompt at all**: 3 read sites in `app.js`, none prompt-related; step-param and `promptInstruction` routes both dead. **No canonical learner-level vocabulary exists** — 5 value sets, the two load-bearing ones share only 2 of 5 values, no converter, and `difficulty_profile` proves a converter is what such a mapping requires (**D14**). Recommends **Option A — free-text Audience only, learner level deferred**; cost LOW, zero prompt-builder edits, no new UI control type. Notes a defensible alternative: defer Audience entirely and use Goal (§19 finds the marginal gain real but narrow). **ACCEPTED as evidence; operator authorised Option A (free-text Audience, learner level deferred), delivered as S80-S7** |
| **S80-S7** | **IMPLEMENTED — awaiting review.** Audience is the fourth governed parameter (`id: audience`, single-line `type: text`, `projection: workflowContext`, `applicability: always`), commissioned from frozen `initialBrief.audience` → `resolvedFactors.audience` → `workflowOutputSpec.audience` **only for records with no `workflowBriefResolution` at all**. Single-line (not `multiline`) is deliberate: it puts Audience in the *authoritative parameters* block, so it structurally outranks contradicting Goal prose and per-step Additional Instruction with **zero** new precedence wording. `#workflowAudience` retired to read-only commissioning info (disposition C, S5 pattern) and no longer gathered on Save. The step-1 `Audience:` line was **removed outright**, not superseded — supersession fires only on provenance `adjustment` and would have left the two-authority defect intact on Auto (documented deviation, S7 §11). `page.audience` now reads the effective governed Audience, so prompts and artefact agree. **D13 and D16 FIXED.** Create-time inference untouched (D18/D20 open); learner level untouched (D14 open); canonical `"Learners"` exemplar investigated and deliberately retained (D22 open). **Zero prompt builders edited. 61 new tests; 238/238 focused; 0 new failing locations vs baseline (394 → 393)** |
| Next | **Operator review of S80-S7, S80-S6 and S80-S5** (all implemented, none reviewed). For S7 specifically, two points need explicit acceptance: the **§11 removal-versus-supersession deviation**, and the **§5 legacy fallback rule** (a record with a frozen brief but no recorded audience now shows an empty commissioning field instead of the mutable spec value). Four parameters are now governed — Topic, Goal, Duration, Audience — through one registry with no per-parameter plumbing. Candidate follow-ons: the **Assessment minimal parameter set** (needs `requiresCapability` to register a resolver, currently failing closed), or a **UI capability cue** (T-009 scenarios D/E — prompts are honest but the UI still does not tell authors what a workflow can produce). **Do not** start learner level (D14), D2, D3, or Create-time inference (D18/D20) without authorisation. Superseded numbering note: Goal = S5, Duration = S6, Audience = S7; T-007's "S5 Duration / S6 Audience" labels no longer apply |
| Superseded | ~~**Operator judgement on S80-T-010 §25 Q1** (does Audience earn a fourth parameter, given Goal already carries prose to every step?), and **operator review of S80-S6.** **D1 is now resolved**, so Duration is no longer blocking. Candidate follow-ons: **Audience** (cheapest remaining parameter, no canonical text touched), or a **UI capability cue** (T-009 scenarios D/E — the prompt is now honest but the UI still does not tell authors what a workflow can produce). Numbering: Goal = S5, Duration = S6; T-007's "S5 Duration / S6 Audience" labels are superseded. New low-severity debt: **D9/D10** (upstream assessment sanitiser leaves residue / incomplete cue coverage), **D11** (legacy workflows without `initialBrief` project no Goal), **D12** (Create-time `>= 45` design-scope inference reads the commissioned duration only, so a 60→30 run keeps `design_scope: session`)~~ — answered: Audience earned the fourth parameter and shipped as S80-S7 |
| Legacy Settings runtime | **Still not authorised** — superseded and inert |
| A/B/C/D | **DECIDED at T-006 — Option C (Adjustments)** |

## Evidence stack for T-006

| Record | Contribution |
| ------ | ------------ |
| T-003 | Product value / framing; tiny concept set |
| T-004 | Hybrid ownership preferred candidate |
| T-005 | Persistence Option C preferred candidate |
| T-005A | Create commissioning vs Run payload; Settings ≠ parameterisation |
| T-005B | Topic / Duration / Audience are deterministic but have **no Run reader**; feasibility B/B/B; source description commissioning-only |
| **T-007** | **ARCHITECTURE:** registry → one resolver → 3 projections → **2** ingress points (`app.js:33394` + `33293`). **No model call at Run** (copy-to-clipboard). Per-step author text **already** reaches the model via `step.notes` (`33786–33793`). **Topic not baked.** Persistence `wf.adjustments` + `step.additional_instruction`. Alpha minimum S1+S2+S3+S4. New defect **D3** |
| **T-006** | **DECISION:** Settings superseded → **Adjustments** = (1) small allowlisted **typed workflow parameters** + (2) optional **per-step natural-language instruction**. Composition, not replacement. No new AI call. Parameters cannot change topology. v1: Topic, Duration (blocked on defect D1), Audience (needs canonical vocabulary), assessment (conditional). `[PRISM_STEP_PARAMS]` demoted to legacy; no migration complexity |
| T-005B.2 | **44** keys (T-005B.1's 42 + `activities_required`, `materials_required`). Only **25** have a proven effect; **17** have none; only **6** are model-visible. The Create bake reads no factor (`app.js:5373`), and `[PRISM_STEP_PARAMS]` has **no reachable route to a model** (`27107` early return kills the only caller). Topology is where factors actually work |
| T-005B.1 | **42** resolved brief keys, not 28 — 13 exist only in code (8 undeclared passthrough + 5 conditional cognition) + 1 alias. `resolvedSources` `"default"` is overloaded; product seed is laundered into `explicit`. `topic` is the only candidate with no enum conflict, no topology gate and no dependents |

## Do

- Review [S80-T-005B](S80-T-005B-minimal-runtime-parameter-contract-diagnostic.md).
- Review [S80-T-005B.1](S80-T-005B.1-complete-brief-factor-inventory-and-resolution-diagnostic.md) — the complete factor table.
- Review [S80-T-005B.2](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md) — the effectiveness matrix and the proven-effective shortlist.
- **Read [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md) (product decision) then [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) (architecture plan).** T-007 §1.1 **corrects** T-006 §17C on the projection chokepoint. Both are now accepted and authoritative.
- **Read [S80-S1](S80-S1-adjustments-parameter-registry-and-persistence.md), [S80-S3](S80-S3-per-step-additional-instruction.md), [S80-S2](S80-S2-topic-vertical-proof.md) and [S80-S4](S80-S4-adjustments-ui-repurpose.md)** — the four completed implementation slices, including the debt each recorded. Note that S4 **superseded** the S2/S3 Episode Plan exclusion.
- Before starting the next slice, note that the registry declares **`topic` only**, only the **`workflowContext`** projection is implemented, and eligibility is now **two predicates** — steering (every step, Episode Plan included) and parameter projection (derived-shell steps excluded).
- Adding a `workflowContext` parameter should require **no prompt edits** — declare it plus a `resolveCommissioned` reader. If a slice finds itself editing prompt builders to add one, the architecture has been bypassed.
- Compare regressions against a **pristine `git worktree` at the pre-implementation commit**. Whole-suite failure counts alone are unusable while D-014 stands.

## Do not

- Start the remaining slices (Audience, Assessment, S8–S10) without explicit authorisation. S1, S3, S2, S4, S5 and S6 are the only authorised slices so far.
- Re-exclude Episode Plan from Additional Instruction, or merge `step.notes` into `step.additional_instruction`. Both are settled operator decisions.
- Declare a registry parameter live without implementing its projection and tests in the same slice.
- Rehabilitate legacy Settings or `[PRISM_STEP_PARAMS]` — still superseded and inert.
- Fix D2 or D3 opportunistically; each needs its own authorised task. (D1 was fixed under S80-S6, bounded to the timing literals only.)
- Revive the LS `duration_minutes` step parameter. S6 routes around D3 deliberately; the step control's inert 15–240 range retires with the catalogue.
- Change the DLA duration band rule without evidence. ±10 is what reproduces the accepted `50–70` at 60; T-007's "25–35" table row is erroneous.
- Assume all Create fields should become Run parameters.
- Derive `learner_level` from free-text audience. (T-010 found the product **already** does this deterministically, first-token-wins across a seven-field blob — debt **D20**, not a pattern to extend.)
- Ship a typed learner level before **D14** is resolved. T-010 proves no canonical vocabulary exists: the two load-bearing enums share only 2 of 5 values and nothing converts between them. That is a product taxonomy decision, not a parameter slice.
- Refresh a prompt golden to make a diff disappear.
