# Sprint 80 — Decision Log

**Sprint status:** CLOSED (2026-08-28)  
**Format:** ID · Decision · Status · Rationale · Consequences

---

## S80-D01 — Open Sprint 80 — Settings Discovery, Product Value and Policy Architecture

- **Decision:** Open Sprint 80 as a **discovery/planning** sprint to determine whether Settings should exist, what (if anything) they should contain, how policy authority and persistence should work, and what a future implementation architecture should look like — assessed against **current** PRISM architecture (canonical DLA, canonical GAM, post–Phase D / post–S79).

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Prior diagnostic concluded **C — SETTINGS REQUIRE PRODUCT/ARCHITECTURE REDESIGN**. Recent architecture (S77–S79 + DLA Phase D) materially changed stage ownership. Activating the existing catalogue without re-asking product questions would risk competing with stage-owned pedagogical reasoning.

- **Consequences:** Opening package [S80-T-001](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md) is authoritative for history/topology. Next task after T-001 is **S80-T-002**. No Settings runtime implementation is authorised. Outcomes A/B/C/D remain open until **S80-T-006**.

---

## S80-D02 — Existing Settings catalogue is not assumed authoritative

- **Decision:** Treat the currently exposed Settings catalogue as a set of **hypotheses** and historical product experiments, not as a requirement that each control must be made operational.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Catalogue was exposed before full runtime follow-through; later stage contracts may have superseded many knobs.

- **Consequences:** T-002/T-003 must allow REMOVE / SUPERSEDED / DERIVED classifications. “Wire it because it exists” is forbidden.

---

## S80-D03 — Later architecture may supersede existing settings

- **Decision:** Sprint 80 must evaluate Settings against **current** stage ownership (PEL, canonical DLA, canonical GAM, Design Page, renderer, visual jobs), not the architecture that existed when controls were first declared.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** DLA and GAM are now singular canonical authorities; temporary rollback debt retired. Global pedagogical micromanagement settings may now be obsolete.

- **Consequences:** Supersession audit is mandatory in T-002. Example hypothesis: scaffolding / intensity-like globals may be SUPERSEDED rather than dormant.

---

## S80-D04 — User policy should not compete with stage-owned pedagogical reasoning

- **Decision:** Retained settings (if any) must express authorial **policy / constraint / intent**, or a legitimate **explicit override**, and must have a clear stage interpretation boundary. They must not create a competing global prompt-modifier layer over DLA/GAM/PEL/Design Page.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Programme principle after canonical stage assemblers: stages own pedagogical decisions; users own authorial policy where PRISM cannot (or should not) infer alone.

- **Consequences:** T-004 must reject “one bag of booleans → inject into all prompts” as a default architecture.

---

## S80-D05 — Final product/catalogue choice requires operator decision at T-006

- **Decision:** Cursor/agents prepare evidence and options through T-001–T-005 but **must not** choose strategic outcomes A/B/C/D. Final product, catalogue, framing, authority, and persistence direction are decided at **S80-T-006** by the operator (with ChatGPT discussion as needed).

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Settings survival is a product strategy choice, not a pure engineering optimisation.

- **Consequences:** T-007 is blocked until T-006. Do not define PB-FA-005 implementation prematurely.

---

## S80-D06 — T-006 operator decision: Settings superseded by Adjustments (Option C)

- **Decision:** The historical Settings catalogue and `[PRISM_STEP_PARAMS]` mechanism will **not** define the future product architecture. **Option C — substantially redesign** is adopted. Settings is replaced by **Adjustments**, comprising two deliberately separate mechanisms: (1) a small allowlisted set of **typed workflow parameters** making a workflow reusable with different commissioning values, and (2) an **optional per-step natural-language author instruction** for every model-driven step.

- **Status:** **Accepted** (2026-08-27) — operator decision at the T-006 gate. Record: [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md)

- **Rationale:** Rehabilitating the historical parameter plumbing would create unnecessary complexity and competing authority. T-005B.2 demonstrated this rather than assuming it: the Create bake reads no brief factor (`app.js:5373`, `5381`), `[PRISM_STEP_PARAMS]` has no reachable route to any model (`27107–27109` vs `27126`), and of 44 resolved brief keys only 25 have a proven effect with just 6 model-visible.

- **Consequences:**
  - A/B/C/D is **closed**; Option C is the direction. Option D (further evidence) is discharged.
  - Adjustments' two mechanisms must not be merged into one typed catalogue.
  - Parameters require type, valid values, one owning interpretation point, deterministic runtime semantics and a declared projection before they may ship. A parameter may not ship until its contract is actually honoured at runtime.
  - Author instructions **compose with** canonical prompts; they must not override schemas, validators, typed parameters, upstream artefacts, topology/capability or canonical hard requirements.
  - **No new AI interpretation call** for Adjustments; structured parameters must be editable without model capability.
  - Parameters must not alter workflow topology or capability — that remains a Create concern.
  - Extensibility rule is binding: `declare → type/valid values → owning interpretation point → runtime projection`. Manual multi-prompt patching is forbidden and is the failure test for the T-007 architecture.
  - v1 candidates: **Topic** and **Duration** (strong), **Audience/level** (needs canonical vocabulary), **assessment parameters** (conditional, pending capability investigation).
  - Historical Settings is superseded product design; controls are not preserved for compatibility. Retirement is T-007+.
  - No migration complexity for old workflows unless a genuine technical requirement is found; pre-Alpha workflows may be treated as stale.
  - **Defect D1** (hardcoded DLA `~60` / `50–70` timing text) is a **hard prerequisite** for Duration. **Defect D2** (canonical DLA cognition bypass) is scheduled independently. Neither is fixed by T-006.
  - **T-007 is now unblocked** and is the next task. Implementation begins only on explicit slice authorisation.

---

## S80-D07 — T-007 Adjustments target architecture (plan; corrects D06 chokepoint)

- **Decision:** Adopt the target architecture recorded in [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md): one declarative parameter registry → one deterministic `resolveEffectiveRunContext` resolver → three named projections → **two** prompt-assembly ingress points; plus `step.additional_instruction` as a new dedicated field carrying per-step author steering.

- **Status:** **Plan — awaiting operator review** (2026-08-27)

- **Rationale:** Three structural discoveries make Adjustments materially cheaper than T-006 assumed:
  1. **There is no model call at Run.** All `api.openai.com` requests are design-time (`app.js:20450`, `20578`, `27577`, `27840`, `27892`, `28439`); Run assembles prompt text and copies it to the clipboard (`32063`). "Runtime projection" therefore means prompt-text assembly, and T-006's no-API-key requirement is already structurally satisfied.
  2. **Per-step author text already reaches the model.** `step.notes` minus the param block is injected for every non-GAM step (`app.js:33786–33793`), with an existing textarea at `32442`. Mechanism 2 is largely separation, labelling and precedence framing.
  3. **Topic is not baked into prompt bodies** — verified empirically (zero occurrences in any `override_prompt_body` in the Marx export), so Topic is genuinely late-bindable today.

- **Corrects S80-D06:** T-006 §17C named `applyWorkflowStepRuntimePromptAugmentations` (`app.js:15990`) as the projection point. **That is wrong**: it is always called with an empty option map (`31443`), its context projection exposes only ~10 fixed fields (`15919`), DA/GAI/LS bypass it (`33810–33819`), and GAM early-returns before it (`33424`). The correct ingress is **`buildWorkflowStepInstructions` (`33394`)** plus **`buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`)**.

- **Consequences:**
  - Persistence is `wf.adjustments.parameters` plus `step.additional_instruction`. Absence means Auto. `resolvedFactors` is untouched; Adjustments overlay it at resolution and never rewrite it. Nothing is written to `[PRISM_STEP_PARAMS]`.
  - Existing Settings panel shell, step cards, control factory and declarative control shape are **reused**; the pack-sourced legacy catalogue, the DOM-coupled `syncUnifiedWorkflowSettingsToStepNotes` write path, the canonical-id step filter and the **numeric count badge** are replaced.
  - Assessment parameters are projected as prompt text at the standard chokepoint. **Reviving `selectedOptions` / `{{option:}}` is explicitly rejected** — it is a Create-time bake path and legacy plumbing.
  - **Audience ships as free text in v1**; the learner-level enum is deferred rather than blessing one of three conflicting vocabularies.
  - Episode Plan receives **no** instruction field (deterministic derive). Model-driven detection derives from existing prompt-source predicates, not a manual allowlist.
  - Alpha minimum is **S1+S2+S3+S4**, touching no canonical contract text. Duration (S5) is the only slice that edits canonical DLA and is bounded by a byte-identical default.
  - Two new defects recorded: **D3** (LS duration step param never reaches the model) and confirmation that the **D1** repair is two call sites plus one optional parameter.
  - Prior belief that GAI's prompt is "voided" is **refuted** — only the stored body is; GAI receives the full live pack template, so question format and per-item difficulty are already model-visible.
  - Four operator questions (**Q1–Q4**) gate specific slices; **Q1** alone gates the Alpha minimum.

---

## S80-D07 — Close Sprint 80 — WORKING ALPHA

- **Decision:** Formally **CLOSE Sprint 80**. Accept S80-S5, S80-S6, S80-S7, S80-S8, and S80-T-008. Record PRISM first-class self-study and workshop paths as **WORKING ALPHA** under the T-008 boundary. Remaining debt is **post-alpha** and does not reopen Sprint 80.

- **Status:** **Accepted** (2026-08-28)

- **Rationale:** T-008 found no ALPHA_BLOCKER under the strict Create → Save → Adjust → Run → learner-resource standard. Adjustments architecture (S1–S8) is delivered and accepted. Continuing Sprint 80 for historical debt would violate the closeout rule (keep open only for Adjustments-architecture blockers).

- **Consequences:**
  - Sprint status = **CLOSED**; product status = **WORKING ALPHA**.
  - Alpha boundary remains exactly T-008 (CAI-first assessment; Quantity + Difficulty governed; Question Type / learner level / DA not required for alpha).
  - Immediate next engineering: bounded **D-014** investigation.
  - Next substantive product programme after D-014: **learner-page accessibility**.
  - Do not manufacture new Sprint 80 backlog; do not implement debt under a Sprint 80 label.

---

## Guardrails carried by opening decisions

- Sprint 79 remains CLOSED.
- Sprint 80 is **CLOSED** (S80-D07).
- DLA Phase D remains COMPLETE; do not reopen DLA dual-path work.
- No production Settings behaviour change under a Sprint 80 label; historical Settings remain superseded and inert.
- ~~Outcomes A/B/C/D are all legitimate until T-006.~~ **Superseded by S80-D06:** Option C adopted 2026-08-27.
- ~~Sprint 80 remains open for Adjustments delivery.~~ **Superseded by S80-D07:** CLOSED 2026-08-28; WORKING ALPHA.
