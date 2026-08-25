# S78-T-025 — General disciplinary-precision authoring solution design

**Task:** S78-T-025  
**Status:** **DESIGN COMPLETE** (2026-08-25)  
**Mode:** DESIGN ONLY — no implementation  
**Depends on:** [S78-T-013 Candidate 6 disciplinary-precision diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md)  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

**Production / prompt / schema / validator / assembly / renderer changes in this task:** **NO**

Do not reopen WS1 / WS2 / WS3. Do not expand the T-017/T-018 verifier. Do not close T-013 or Sprint 78. Do not treat Evidence 78 as a release blocker. Do not solve E2 here.

---

## 0. Accepted diagnostic (not reopened)

[C6 disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) established:

| Finding | Owner grain |
| ------- | ----------- |
| Subject Quality **84** with verifier **PASS** | Suitability ≠ warrant |
| FOC → “optimal” under-qualification | Earliest text: **DLA A3**; GAM mixed; synthesis/visual also overclaims |
| Shadow-price interpretation under-scoped | Earliest: **DLA A4**; not the historical λ-tightness error |
| Inequality / KKT-style notation in Figure 1 | **Design Page → image brief → image model**, not GAM markdown |
| Evidence 78 | Intro + benchmark breadth — **not** a Sprint 78 blocker |
| Transfer consolidation | Optional enhancement — **not** a WS reopen |

---

## 1. Design objective

Make **disciplinary warrant** salient at the generation layers that actually overclaim, with the **smallest general authoring change** that can move resources like Candidate 6 from strong-but-under-qualified Subject Quality toward ≥90 — **without** damaging WS1–3 architecture and **without** a new verifier gate.

---

## 2. Canonical invariant (final)

**Name:** **S78-DP — Disciplinary warrant**

> **S78-DP:** Learner-facing content, including visuals, must not present a condition, intermediate result, representation, model output, or interpretation as establishing a **stronger disciplinary conclusion** than the resource’s **stated assumptions**, **taught model class**, and **supplied evidence** warrant. Where an introductory treatment deliberately simplifies the full disciplinary position, that **limitation must be appropriately visible** — not presented as the unrestricted general result.

**Relationship to operational suitability (S78-OPERATIONAL-SUITABILITY / Case 1):**

| Invariant | Question |
| --------- | -------- |
| Suitability | Can the learner **perform** the commissioned action with these particulars? |
| **S78-DP** | Are the **claims / representations** appropriately **warranted**? |

They compose; they do **not** substitute for each other. Candidate 6 proves both can diverge (PASS + Subject 84).

**Not:** “commissioned scope warrants X” alone — that would license C6 A3 because DLA already said “optimal values.” Warrant is relative to **assumptions + taught model class + evidence**, not merely to whatever the commission happened to overstate.

---

## 3. Operational meaning of “stronger conclusion”

For an authoring model, a claim or representation is **stronger** than warranted when it does any of the following relative to what the resource actually teaches and supplies:

| Distortion | Meaning | C6 analogue |
| ---------- | ------- | ----------- |
| **Necessary → sufficient** | Treats a necessary or intermediate condition as establishing the full target conclusion | FOCs → optimum (without second-order / uniqueness / convexity) |
| **Local / conditional → general** | Drops binding assumptions or scope and states the claim as unrestricted | Shadow price as unrestricted “marginal value” without binding/envelope scope |
| **Evidence → established inference** | Presents supplied particulars as already proving the interpretation | Stating interpretations in evidence tables when learners must infer (not C6 failure; related) |
| **Model output → real-world certainty** | Treats solved/feasible model values as proven real-world optima or policy facts | “Optimal values” / “optimal solution” for introductory equality problems |
| **Representation-class broadening** | Depicts a **broader** mathematical/conceptual class than the taught examples | Equality-taught resource; synthesis graphic uses \(g_i(x)\leq 0\) / generic KKT form |
| **Simplification → false assertion** | Omits advanced nuance **and** asserts the simplified claim as the general disciplinary truth | Same as FOC→optimum when unmarked |

**Domain-general:** the table is a typology of over-strength, **not** a set of subject-specific rules. Fixtures should exemplify the typology across disciplines, not hard-code Lagrangian vocabulary.

---

## 4. Introductory simplification rule

The system **must** still teach introductory material without legalistic caveats on every sentence.

### 4.1 Visible limitation required when

Any of the following would otherwise be true in learner-facing text or visuals:

1. A **procedure product** is labelled as a full disciplinary **establishment** of a stronger result (e.g. FOC solutions presented as guaranteeing an optimum).
2. An **interpretation** depends on conditions (binding, local/envelope, model class, evidence limits) that are **never** indicated in orientation, model, checklist, knowledge summary, or caption.
3. A **visual** uses notation, feasible-set geometry, or claim labels from a **broader model class** than the taught examples.
4. A synthesis surface (knowledge summary, page concept map) **generalises** activity-level precision into an unrestricted slogan.

**Minimum visibility forms (choose lightest that works):**

- Prefer **weaker accurate verbs**: *candidate*, *solved values*, *feasible solution*, *in this introductory setting*, *for equality constraints of this form*, *when the constraint binds*.
- One short scope clause in preamble, model close, checklist criterion, or knowledge-summary sentence.
- For visuals: `disallowed_claims` / `must_not_show` / caption_intent that keep representation class aligned — not a paragraph of caveats on the image.

### 4.2 Ordinary simplification acceptable without explicit caveat when

- The LO is apply/analyse at introductory level and language stays at **operation strength** (*derive*, *solve*, *verify*, *interpret for these cases*).
- Advanced second-order / constraint-qualification / competing-theory material is **omitted** rather than **misstated**.
- Scope is already clear from the taught examples (all equality problems; all labelled simulations) and no surface asserts a stronger general theorem.

**Rule of thumb:** omit advanced theory freely; **do not upgrade** the strength of what remains.

---

## 5. Ownership matrix

| Layer | Role for S78-DP | Rationale |
| ----- | --------------- | --------- |
| **EP** | **Respect only** | C6 EP already said “solve,” not “prove optimum.” Optional LO wording hygiene later; **not** in minimal change set. |
| **DLA** | **Own** commissioning claim-strength | Earliest textual overclaim (A3 “optimal solution/values”; A4 unscoped interpretation). GAM cannot reliably repair overstrong commissions. |
| **GAM** | **Own** material-body warrant; **respect** DLA | Must not strengthen further; where context supports precision, preserve weaker accurate language (as A3-M1 already did) rather than echo overstrong labels into task/checklist/workspace. |
| **Design Page** | **Own** `page_synthesis` claim strength + visual affordance claim fields | Knowledge-summary FOC→optimum and Figure 1 inequality are Design Page / visual path, not GAM. Schema already has `allowed_claims` / `disallowed_claims` / `canonical_discipline_note`. |
| **Image brief / image model** | **Project / reinforce** | Compiler already passes claim constraints into human prompts; salience must ensure Design Page **emits useful** constraints and image prompt **does not elaborate** beyond taught model class. |
| **Assembly / renderer** | **Not added** | Pass-through of authored content; no claim rewriting. |
| **Verifier (T-017/T-018)** | **Not added** | Remains suitability-only temporary instrumentation ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)). |

**Minimum effective ownership:** **DLA + GAM + Design Page (synthesis + visual claims)**. Image-brief reinforcement is a small projection of the same invariant, not a fourth independent design. EP / assembly / verifier stay out of the minimal set.

---

## 6. DLA design (smallest change)

### 6.1 Decision

**Prompt-contract salience only** in `lib/ld-dla-page-enrich-contract.js` (production § and/or commissioning §). **No** new DLA schema fields. **No** capture-validator claim NLP.

### 6.2 Obligations to add (general)

1. **Result-strength discipline for production fields:** `learner_task`, `expected_output`, `activity_preamble`, and material `specification` must commission the **operation and product strength the LO warrants**, not a stronger disciplinary establishment.
   - Prefer: *derive FOCs, solve the system, report candidate/solved values, verify the constraint*.
   - Avoid as unscoped product of FOCs alone: *obtain an optimal solution / optimal values* when the resource does not teach sufficiency conditions.
2. **Interpretive scope:** when commissioning interpretation of model outputs (multipliers, coefficients, fit, associations), specifications and expected_output must require learners to reason **within stated scenario conditions** — or require the resource to **surface** those conditions — not to treat the interpretation as unrestricted general theory.
3. **Do not force verbose caveats:** one accurate strength verb or one short scope bound in specification/preamble is enough; no mandatory multi-paragraph disclaimer per activity.

### 6.3 Expected C6 effect

Would have reduced A3 “optimal solution/values” commission and nudged A4 toward scoped shadow-price interpretation — removing the licence GAM echoed into A3-M2/M3/M4.

### 6.4 Cross-disciplinary effect

Same wording prevents commissioning “prove causation from correlation,” “establish mechanism from fit,” “prove program correctness from tests,” etc., without naming those domains.

### 6.5 Overconstraint risk

Low if framed as **claim-strength matching LO/model class**, not as “always hedge.” Mitigation: explicit §4 simplification rule in the contract block.

---

## 7. GAM design

### 7.1 Decision

Add **S78-DP** salience to GAM authoring:

1. One compact pointer in `lib/ld-gam-page-enrich-contract.js` (parallel to suitability/WS2 pointers).
2. One short global line in `app.js` `buildGamV2CopyMaterialAuthoringBrief` (parallel to Case 1 / suitability cross-ref).
3. Optional small auto-applied block **only if** implementation finds global lines insufficient — prefer **not** inventing a second collector like T-015 unless needed. Default design: **brief + enrich-contract lines**, not a new obligation-collector module.

### 7.2 Boundary (critical)

| GAM must | GAM must not |
| -------- | ------------ |
| Honour pedagogy and operational bounds of the commission | Treat overstrong DLA labels as a licence to **overclaim sufficiency** in model/task/checklist prose when the taught procedure only yields candidates/feasible solutions |
| Preserve or choose **accurate claim strength** when local context supports it (as A3-M1 did) | Silently “correct” every upstream error by rewriting the commission |
| Avoid **unsupported strengthening** beyond DLA and beyond taught model class | Invent new pedagogical constraints the commission omits (still Case 1) |
| Keep interpretive claims scoped to supplied evidence/conditions | Add domain solvers or Lagrangian-specific banned-word lists |

**Following commissioned pedagogy ≠ copying overstrong epistemic labels into every surface.**

### 7.3 Expected C6 effect

Reduces A3-M2/M3/M4 “optimal values” echo; encourages checklist language aligned with “feasible / candidate / verified against constraint”; does **not** fix Figure 1 inequality (wrong owner).

### 7.4 Overconstraint risk

Medium if GAM is told to refuse DLA. Mitigation: “preserve warrant; do not strengthen; prefer accurate strength verbs when filling bodies” — not “ignore DLA.”

---

## 8. Design Page + visual generation design

### 8.1 Page synthesis (`knowledge_summary` and related)

**Owner:** Design Page partial contract (`lib/ld-design-page-partial-contract.js`).

Add salience: wrapper synthesis must obey **S78-DP** — do not upgrade activity-level procedure products into unrestricted disciplinary slogans (e.g. “FOCs lead to optimal solutions” when activities only derive/solve/verify candidates).

### 8.2 Visual affordances (reuse existing schema)

Fields already required on `generate` rows:

- `allowed_claims[]`
- `disallowed_claims[]`
- `canonical_discipline_note`
- `must_show[]` / `must_not_show[]`
- `caption_intent`
- `discipline_risk_level`

**Gap:** fields exist and validate as non-empty arrays, but **substantive warrant / model-class fidelity** is not salient — C6 Figure 1 still introduced \(g_i\leq 0\) while teaching equalities.

**Design:** prompt salience (Design Page partial + Sprint 38 visual affordance authoring contract append) requiring:

1. `allowed_claims` / `disallowed_claims` / `canonical_discipline_note` must encode **taught model-class bounds** and **claim-strength bounds**, not filler.
2. Generated visuals **must not silently broaden** the taught representation class (constraint type, variable set, optimality status, evidence strength).
3. Captions, alt text, detailed descriptions, and on-image labels are in scope for S78-DP (same warrant as body text).
4. Image-model elaboration beyond authored `must_show` / claims is forbidden when it introduces stronger notation or conclusions.

### 8.3 Image brief / human prompt projection

`prism-image-brief-compiler` / `utilities-visual-jobs-workspace.buildVisualJobHumanPrompt` already surface claim constraints. Implementation should:

- Ensure disallowed claims and model-class exclusions remain **high-salience** in the human prompt (not buried).
- Add one general line: do not introduce mathematical/conceptual forms stronger or broader than the brief’s claims and exclusions.

**No new schema.** No pixel OCR verifier.

### 8.4 Expected C6 effect

Figure 1 would be steered toward equality-consistent notation (as Figure 3 already was) and captions that keep “candidates” aligned with solution status. Knowledge summary would avoid FOC→optimum slogans.

---

## 9. Validation boundary

| Mechanism | Role |
| --------- | ---- |
| Prompt/contract salience (DLA, GAM, Design Page, image brief) | **Primary repair** |
| Prompt-contract unit tests + cross-disciplinary fixtures | Prove wording present / not Lagrangian-only |
| Independent QA (Benchmark v2.2 Subject & Disciplinary Quality) | **Residual discovery** after regeneration |
| T-017/T-018 verifier | **Unchanged** — suitability only |

**Why not deterministic validation / new permanent gate:** claim warrant is semantic and domain-general; automated FOC/shadow-price/inequality checks would become Lagrangian shadow-QA, inflate temporary instrumentation, and violate S78-D02 intent. Preferred loop remains: QA discovers → diagnose → harden generation → fresh benchmark.

---

## 10. Proposed change set (diff-level guidance — do not implement here)

### Change 1 — DLA production / commissioning salience

| Field | Content |
| ----- | ------- |
| **Owner** | `lib/ld-dla-page-enrich-contract.js` — `buildDlaSectionProduction` and/or `buildDlaSectionCommissioning` |
| **Location** | After existing WS1/WS2/WS3 bullets in production; short parallel block in commissioning |
| **Proposed wording (approx.)** | `S78-DP disciplinary warrant: learner_task, expected_output, activity_preamble, and required_materials specifications must not commission a stronger disciplinary conclusion than the mapped LO, taught model class, and intended assumptions warrant. Commission the learner operation at accurate strength (e.g. derive/solve/verify candidate or feasible results) rather than unscoped establishment language (e.g. “obtain an optimal solution from first-order conditions alone”) when sufficiency conditions are not taught. For interpretive productions, require scope tied to stated conditions or scenario bounds — one short bound is enough; do not force legalistic caveats on every activity. Introductory omission of advanced theory is allowed; upgrading remaining claims is not.` |
| **Reason** | Earliest C6 textual overclaim |
| **C6 effect** | Softens A3/A4 commissions |
| **Cross-discipline** | General claim-strength discipline |
| **Risk** | Hedge inflation — mitigated by “one short bound” |

### Change 2 — GAM enrich contract pointer

| Field | Content |
| ----- | ------- |
| **Owner** | `lib/ld-gam-page-enrich-contract.js` |
| **Location** | Required payload bullets beside WS2 / suitability lines |
| **Proposed wording (approx.)** | `- honour S78-DP disciplinary warrant: do not present conditions, intermediate results, representations, or interpretations as establishing stronger conclusions than stated assumptions, taught model class, and supplied evidence warrant; do not strengthen claim strength beyond the commission; when local context supports accurate weaker strength (candidate/feasible/scoped interpretation), prefer that over echoing overstrong establishment labels` |
| **Reason** | Material-body echo (A3-M2/M3/M4) |
| **C6 effect** | Aligns task/workspace/checklist strength |
| **Risk** | Conflict with DLA — mitigated by “do not strengthen / prefer accurate strength,” not “rewrite commission” |

### Change 3 — GAM Copy material authoring brief

| Field | Content |
| ----- | ------- |
| **Owner** | `app.js` — `buildGamV2CopyMaterialAuthoringBrief` |
| **Location** | After Case 1 / suitability sentence |
| **Proposed wording (approx.)** | `S78-DP: realised instructional claims (including headings and checklist stems) must match warranted strength for the taught model class and evidence; do not upgrade necessary or intermediate results into unrestricted optima, general causal/policy conclusions, or broader representation classes than the commission and examples support. Prefer accurate scoped language over establishment slogans.` |
| **Reason** | Global salience at authoring surface |
| **C6 effect** | Same as Change 2 |
| **Risk** | Prompt length — keep to 1–2 sentences |

### Change 4 — Design Page partial + visual claim salience

| Field | Content |
| ----- | ------- |
| **Owner** | `lib/ld-design-page-partial-contract.js` (+ Sprint 38 visual affordance authoring contract append where live) |
| **Location** | After page_synthesis hygiene; adjacent to generate-row claim field list |
| **Proposed wording (approx.)** | `S78-DP: page_synthesis (especially knowledge_summary) must not upgrade activity procedures into unrestricted disciplinary slogans. For visual_affordances generate rows, allowed_claims, disallowed_claims, and canonical_discipline_note must encode taught model-class and claim-strength bounds (not filler). Visuals, captions, alt text, and on-image labels must not introduce stronger conclusions or broader notation/representation classes than upstream taught examples and claims warrant.` |
| **Reason** | Knowledge-summary + Figure 1 |
| **C6 effect** | Targets synthesis overclaim and inequality broadening |
| **Risk** | Empty-but-valid claim arrays persist — tests should require substantive model-class examples in fixtures, not only non-empty arrays |

### Change 5 — Image human-prompt reinforcement (small)

| Field | Content |
| ----- | ------- |
| **Owner** | `lib/utilities-visual-jobs-workspace.js` `buildVisualJobHumanPrompt` (and/or compiler notes) |
| **Location** | Near claim / avoid sections |
| **Proposed wording (approx.)** | `Do not introduce mathematical forms, constraint classes, or optimality/evidence claims stronger or broader than the allowed claims, disallowed claims, and exclusions in this brief.` |
| **Reason** | Image-model elaboration path |
| **C6 effect** | Backstop if Design Page claims are good but model elaborates |
| **Risk** | Low |

### Explicitly out of minimal set

- EP grammar / LO rewriter  
- Assembly / renderer claim rewriting  
- Verifier criteria for FOC/shadow-price/inequality  
- New schema fields  
- Domain solvers / banned-term lists  
- Fifth transfer activity architecture  
- Evidence-richness chasing  

---

## 11. Design decision (authoritative)

> **Smallest general intervention:** adopt **S78-DP** as a cross-cutting **prompt/contract salience** invariant owned at **DLA commissioning**, **GAM material authoring**, and **Design Page synthesis + visual claim fields**, with a **small image-prompt projection** — **no** schema, **no** verifier expansion, **no** deterministic disciplinary validation, **no** domain-specific logic.

This preserves WS1–3 architecture, keeps suitability instrumentation in its lane, and attacks the actual C6 causal layers (DLA overclaim → GAM echo; Design Page/visual representation broadening).

| Requirement | Needed? |
| ----------- | ------- |
| Prompt/contract change | **Yes** |
| Schema change | **No** |
| Production-code change beyond prompt assembly | **No** (except optional one-line human-prompt string) |
| Verifier change | **No** |
| Deterministic validation | **No** |
| Domain-specific logic | **No** |

---

## 12. Explicitly rejected changes

1. Expanding T-017/T-018 into disciplinary/QA shadow checks  
2. New permanent verifier gate for warrant  
3. New DLA/GAM/Design Page schema metadata for “claim_strength”  
4. Deterministic parsers for “optimal,” “≤,” shadow-price scope  
5. Lagrangian-specific banned phrases or solvers  
6. Patching GAM markdown to fix image-generation ownership  
7. Reopening WS1 / WS2 / WS3 for this failure class  
8. Treating Evidence 78 or optional transfer as design drivers for T-025  
9. Closing T-013 or Sprint 78 on design completion  

---

## 13. Unresolved risks

| Risk | Mitigation |
| ---- | ---------- |
| Salience insufficient (models still echo “optimal”) | Fresh benchmark after T-026; if needed, tighten DLA examples — still no verifier |
| Hedge inflation / legalistic tone | §4 simplification rule; “one short bound” |
| Design Page emits non-empty but vacuous claim arrays | Fixture tests for model-class-bound claim content |
| Image model ignores brief | Human-prompt reinforcement; residual → QA |
| First-pass E2 reliability still open | Separate track; T-013 remains OPEN |
| Subject 84 → ≥90 not guaranteed by salience alone | Accepted; QA remains residual detector |

---

## 14. Recommended implementation task

**S78-T-026 — General disciplinary-precision authoring salience implementation**

| Field | Content |
| ----- | ------- |
| **Mode** | Implementation when authorised |
| **Depends on** | This design |
| **Scope** | Changes 1–5 as bounded prompt/contract salience; prompt-contract tests; cross-disciplinary fixtures; Candidate-6-shaped regressions (necessary≠sufficient; representation-class match; scoped interpretation) |
| **Exclude** | Verifier expansion · new schema · domain solvers · E2 work · T-019 · Lagrangian hand-edits · regeneration inside the impl task unless separately authorised |
| **After** | Fresh Lagrangian benchmark (operator); assess Subject Quality / FOC & shadow-price & visual class |

---

## 15. Sprint handling

- T-025 = **design complete**  
- T-013 = **still OPEN**  
- T-019 = **not started**  
- Sprint 78 = **OPEN**  
- Formal decision: [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp)  

---

## 16. Files inspected (this design)

- `S78-T-013-candidate-6-disciplinary-precision-diagnostic.md`  
- `S78-T-014-gam-operational-suitability-solution-design.md`  
- `S78-T-015-gam-operational-suitability-authoring-salience-implementation.md`  
- `lib/ld-dla-page-enrich-contract.js`  
- `lib/ld-gam-page-enrich-contract.js`  
- `lib/ld-design-page-partial-contract.js`  
- `lib/gam-operational-suitability-prompt.js`  
- `lib/prism-image-brief-compiler.js`  
- `lib/utilities-visual-jobs-workspace.js` (human prompt / claim constraints)  
- `lib/sprint38-visual-affordances.js`  
- `app.js` (`buildGamV2CopyMaterialAuthoringBrief`)  
- Sprint 78 STATUS / PLAN / START-HERE / HANDOVER / decisions  

**Files changed by this task:** design record + minimal sprint navigation + S78-D03 — listed in the completion report.
