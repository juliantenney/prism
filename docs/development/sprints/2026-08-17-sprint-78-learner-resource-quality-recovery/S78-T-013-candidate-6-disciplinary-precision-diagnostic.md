# S78-T-013 Candidate 6 — disciplinary-precision diagnostic

**Task:** Bounded diagnostic / solution-direction within **S78-T-013** (subordinate record; not T-019 / T-023 / T-024)  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSIS / SOLUTION DIRECTION ONLY — no implementation  
**Sprint 78:** OPEN · **Sprint 77:** remains CLOSED · **T-013:** remains OPEN

**Production / prompt / schema / validator / assembly / renderer changes:** **NO**

Do not reopen WS1 / WS2 / WS3. Do not expand the T-017/T-018 verifier. Do not implement Lagrangian-specific tuning. Do not regenerate. Do not start T-019. Do not close Sprint 78.

**Related (separate track):** [Candidate 6 E2 diagnostic](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) — first GAM attempt. This record uses **GAM attempt 2 only** for content quality.

---

## 0. Artefacts inspected

| Artefact | Path / source | Role |
| -------- | ------------- | ---- |
| QA v2.2 | [S78-T-013-candidate-6-qa-report.md](S78-T-013-candidate-6-qa-report.md) | Independent complete-package score |
| GAM attempt 2 | [S78-T-013-candidate-6-gam-attempt-2.json](S78-T-013-candidate-6-gam-attempt-2.json) | Successful GAM (4 activities) |
| DLA | [S78-T-013-candidate-6-dla.json](S78-T-013-candidate-6-dla.json) | Authoritative material commission |
| EP | [S78-T-013-candidate-6-ep.json](S78-T-013-candidate-6-ep.json) | LO1–LO4; archetype beats |
| Rendered QA package | `C:\Users\cczjrt\Desktop\rendered-output-learner-package (17).zip` | Complete learner HTML + 4 instructional images |
| Extracted assets | temp `c6-pkg/rendered/assets/*.png` | Pixel inspection of Figures 1–4 |
| Malformed GAM attempt 1 | [S78-T-013-candidate-6-malformed-gam.txt](S78-T-013-candidate-6-malformed-gam.txt) | **Not** used as a content-quality exhibit |

**Not used as Candidate 6 QA package:** `C:\Users\cczjrt\Desktop\lagrangian multipliers.zip` (different assembled resource: more journey sections / extra transfer activity). Do not substitute.

Verifier on attempt 2: **PASS** (operator-established; this diagnostic does not re-run it).

---

## 1. QA disciplinary criticisms (authoritative)

**Score:** 88/100 Strong. Release ready with minor revisions. 0 Critical / 0 Major / 0 Moderate production defects. All four activities Strong on Orient / Learn / Do / Check / Workspace / Overall.

| QA finding | Dimension | Nature |
| ---------- | --------- | ------ |
| FOCs presented as producing an optimum rather than **candidate** solutions | Subject & Disciplinary Quality **84**; highest-value improvement 1 | Under-qualified optimality language |
| Shadow-price material lacks **conditions and scope** of the marginal interpretation | Subject 84; improvement 2 | Missing qualification, not a tightness overclaim |
| No short transfer/consolidation connecting construction + solution + interpretation | Evidence **78**; improvement 3 | Breadth / transfer |
| Generic **inequality notation in synthesis graphics** vs equality-constrained taught examples | Improvement 4 | Visual representation class mismatch |

Greatest educational risk (QA): learners may carry simplified introductory representations of optimality or shadow prices into contexts where additional conditions matter.

---

## 2. Exact learner-facing manifestations

### 2.1 FOC → optimum

| Surface | Exact / near-exact wording | Strength |
| ------- | ------------------------- | -------- |
| EP LO3 / A3 title | “Apply first-order conditions to **solve** a simple constrained optimisation problem.” | Solve, not prove optimum |
| DLA A3 preamble | “learners now use first-order conditions to obtain an **optimal solution**.” | Strong |
| DLA A3 `learner_task` | “calculating the **optimal values**” | Strong |
| DLA A3 `expected_output` | “**valid optimal values** satisfying the constraint” | Strong |
| DLA A3-M2 spec | “calculation of **optimal values**” | Strong |
| GAM A3-M1 (model) | after constraint check: values “form a **feasible solution**” | **Weaker / more precise** than DLA |
| GAM A3-M2 task 4 | “**Obtain the optimal values.**” | Strong (echoes DLA) |
| GAM A3-M3 heading | “**Optimal values**” | Strong |
| GAM A3-M4 | “Have you stated **feasible optimal values**?” | Strong; “feasible” is necessary not sufficient |
| Rendered knowledge summary | FOCs “solved simultaneously to identify **optimal values**” | Strong |
| Figure 1 caption | FOCs “lead to **optimal solutions**” | Strong |
| Figure 1 pixels | arrow “Satisfying conditions gives **candidates**” into a box labelled **Optimal Solution** \(x^*,\lambda^*\) | Mixed: candidate language then optimum box |
| Figure 3 footer | FOC stage labelled “**Optimality conditions**” | Strong; caption is more careful (“candidate values”) |

**Classification:** pedagogically simplified / under-qualified — **not** the crude earlier “FOCs always guarantee a unique global maximum” slogan, and **not** C1/C4 contradictory algebra.

### 2.2 Shadow-price scope

| Surface | Finding |
| ------- | ------- |
| DLA A4 | Interpret multiplier re relaxing constraint / additional unit of scarce resource; A4-M1 must **not** state the interpretation |
| GAM A4-M1 | Three simulated scenarios (λ = 2.4 / 18 / 0.8); no interpretation in the provider table |
| GAM A4-M3 | Multiplier “linked to the value of a relaxed constraint”; “marginal effects”; “additional unit” |
| GAM / DLA | **No** “larger λ = tighter constraint” |
| Knowledge summary | λ as shadow price = “**marginal value of relaxing a constraint**” — defensible intro claim, **unscoped** |
| Figure 4 header | “Constraint is **binding** → Multiplier value exists” — actually introduces a qualification GAM text lacks |
| Figure 4 footer | “Magnitude of change related to multiplier” — under-qualified |

QA is criticising **missing conditions** (binding, local/envelope, equality vs inequality, introductory scope), not an actually false tightness claim.

### 2.3 Inequality in synthesis graphics

GAM markdown and learner HTML text: **no** `≤` / `≥` / `\leq` / `\geq` in activity bodies.

**Figure 1** (`knowledge-summary-after-content.png`) pixels include:

- Constraints \(g_i(x) \leq 0\) (or \(= 0\))
- Feasible set \(\{x \mid g_i(x) \leq 0\}\)
- Lagrangian \(\mathcal{L}(x,\lambda)=f(x)+\sum_i \lambda_i g_i(x)\) (generic KKT-style, not the taught \(L=f+\lambda(\text{limit}-g)\))

Taught GAM/DLA examples are **equality** constraints (`a+b=12`, `2x+y=20`, `x+y=10`). Figure 3 (A3 process) uses \(g(x,y)=0\) — consistent with taught class. Figure 2 (A1) is qualitative comparison without inequality algebra.

---

## 3. Earliest causal layers

### 3.1 FOC / optimality — **DLA commission + GAM echo + synthesis/visual**

Earliest **textual** over-strength: **DLA A3** already names the FOC product as an **optimal** solution/values. EP is weaker (“solve”). GAM **does not originate** the overclaim; A3-M2/M3/M4 **realise** DLA. GAM A3-M1 is **more careful** than the commission. Knowledge-summary / Figure 1 caption are **assembly / Design Page / visual** surfaces, not GAM materials JSON.

**Mix:** **D** (upstream commission too strong for disciplinary warrant) **+ B** (GAM task/checklist salience of “optimal”) **+ E** (visual/synthesis path independently overclaims).

### 3.2 Shadow price — **DLA introductory commission, faithfully realised**

DLA A4 commissions the standard intro envelope reading without scope conditions. GAM A4 realises that commission and does **not** add the historical tightness error. Visual Figure 4 partly **improves** (binding) and partly under-qualifies (magnitude).

**Mix:** **D** (commission under-qualified) **+ A** (no generation invariant requiring scope-marking of interpretive claims).

### 3.3 Inequality visual — **visual generation / Design Page, not GAM text**

Slot: `knowledge-summary-after-content` (Sprint 38 page-region synthesis). Pipeline: Design Page visual affordance → visual jobs planner → image-brief compiler → image model.

Design Page schema already has `allowed_claims[]`, `disallowed_claims[]`, `canonical_discipline_note`, `discipline_risk_level`. Design Page JSON was **not** in this paste, so the split “commissioned generic KKT” vs “image model invented ≤” is **not fully resolved**. The inspectable defect is in **PNG pixels**, not GAM markdown.

**Do not force a GAM-text repair onto this image problem.**

---

## 4. Did GAM strengthen upstream commissions?

| Claim | Verdict |
| ----- | ------- |
| A3-M1 model body | **No — GAM weakened** toward “feasible solution” |
| A3 independent task / workspace / checklist | **Echo / slight strengthen** of DLA “optimal values” |
| A4 interpretation | **Faithful** to DLA; no tightness overclaim added |
| Inequality notation | **Not GAM text** |

GAM is not the sole owner of Candidate 6’s disciplinary gap.

---

## 5. Comparison with earlier candidates

| Candidate | Failure class | Same as C6 disciplinary? |
| --------- | ------------- | ------------------------ |
| C1 / C4 | Contradictory / underdetermined **particulars** (operational suitability) | **No** |
| Historical λ tightness | False **magnitude → tightness** claim | **No** (C6 lacks that claim) |
| C2 / C6 attempt 1 | E2 malformed JSON | **No** (reliability, separate) |
| C6 attempt 2 | Under-qualified **warrant** (FOC→optimum; unscoped shadow price; visual representation class) | This record |

**Common failure class at operational-suitability grain: no.**  
**Common failure class at epistemic grain: yes, weakly** — generated content (text or image) can present a **stronger representation or conclusion** than the taught model and supplied assumptions warrant. C1/C4 remain a different invariant (can the learner execute the commissioned operation?).

---

## 6. Proposed invariant assessment

Proposed wording:

> Generated instructional content must not present a condition, intermediate result, representation, model output or interpretation as supporting a stronger disciplinary conclusion than the supplied assumptions and commissioned scope warrant.

**Verdict: B — directionally correct, needs refinement.**

Risk if used as-is: “commissioned scope” would **license** C6 A3, because DLA already commissions “optimal values.” The C6 FOC problem is that the **commission itself** overstates disciplinary warrant for introductory equality-constrained problems.

**Refined invariant (smallest clearer wording):**

> Generated instructional content, including visuals, must not present a condition, intermediate result, representation, or interpretation as establishing a stronger disciplinary conclusion than the resource’s stated assumptions, taught model class, and supplied evidence warrant. Where an introductory simplification is pedagogically justified, mark it as limited in scope rather than as the general result.

This keeps DLA from treating “optimal” as an unscoped product of FOCs, keeps GAM from amplifying it, and keeps visuals from introducing inequality/KKT form when the taught class is equality.

**Not C (too broad):** it is operationalisable as authoring salience + fixtures, not as a theorem prover.  
**Not D (redundant):** Case 1 / T-015 asks whether particulars are **usable**, not whether claims are **warranted**.  
**Not E (unsupported):** QA 84 + Figure 1 pixels + DLA “optimal solution” chain are sufficient.

---

## 7. Cross-disciplinary stress test (generality, not new rules)

| Domain | Analogous overclaim | Invariant still useful? |
| ------ | ------------------- | ----------------------- |
| Mathematics | Necessary FOC → sufficient optimum; inequality feasible set when teaching equalities | Yes |
| Statistics / data | Sample association → population / causal certainty | Yes |
| Natural science | Model fit / correlation → mechanism established | Yes |
| Programming | Tests passing → program correctness | Yes |
| Humanities | Source statement → historical fact; one reading → the reading | Yes |
| Social science / economics | Multiplier magnitude → constraint tightness; local shadow price → general policy value | Yes (C6 home domain) |
| Design / creative | Preference / convention → universal principle | Yes |

No discipline-specific validators required. Fixtures should be **cross-topic examples of over-strength**, not Lagrangian solvers.

---

## 8. Existing contract coverage

| Location | What it covers | Warrant / overclaim? |
| -------- | -------------- | -------------------- |
| `app.js` `buildGamV2CopyMaterialAuthoringBrief` | Enough coherent particulars; no contradiction; no unstated method (Case 1 / T-015) | **Usability, not warrant** |
| `lib/ld-gam-page-enrich-contract.js` | WS1 blank cells, WS2 operand independence, operational suitability | **Not epistemic precision** |
| `lib/instructional-pattern-prompt.js` “disciplinary” bullets | Name reasoning **moves**, not claim strength | Adjacent vocabulary only |
| `lib/guided-review-generation-contract.js` | Observable criteria / repairs | Does not forbid calling FOC outputs “optimal” |
| `lib/ld-design-page-partial-contract.js` | `allowed_claims[]`, `disallowed_claims[]`, `canonical_discipline_note`, `discipline_risk_level` | **Schema present** for visual claims; did not prevent Figure 1 inequality |
| Image-brief `claim_constraints.disallowed` | Compiled into human prompt avoid-list | Present but **not shown to have blocked** generic \(g_i\leq 0\) |

**Classification: E combination**

- **A** for GAM authoring: epistemic-precision invariant **absent**
- **D** for A3 optimality language: DLA commission already too strong
- **B** for visuals: claim-constraint fields exist but are **weak / non-salient** relative to synthesis graphics

---

## 9. Verifier relationship

Operational suitability: *Can the learner perform the commissioned action using these particulars?*  
Disciplinary precision: *Are the claims/representations warranted?*

Candidate 6: verifier **PASS** + QA disciplinary criticism **84** proves they are **not identical**.

**Verifier SHOULD remain unchanged.** Do not add shadow-QA criteria (FOC wording, shadow-price scope, inequality glyphs). That would freeze Lagrangian checks into temporary instrumentation and violate [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification).

---

## 10. QA relationship

Candidate 6 **supports** the preferred architecture:

QA discovers failure class → diagnose general generation weakness → harden generation → fresh benchmark.

It does **not** support a permanent extra verifier stage. 88/100 with 0 production defects shows the quality gap is **warrant/qualification**, which belongs in authoring contracts (GAM + visual commissioning), not in the suitability gate.

---

## 11. Visual-generation ownership

**Owner:** Design Page visual affordance commissioning → `prism-visual-jobs-planner` → `prism-image-brief-compiler` → image generation (`knowledge-summary-after-content`).

**Not owner:** GAM activity `materials[].body` markdown.

The same refined invariant **should be projected into visual commissioning** (salience on `allowed_claims` / `disallowed_claims` / `canonical_discipline_note`: do not introduce a stronger constraint class or optimality claim than the taught examples). Separate from GAM text repair. No implementation in this task.

---

## 12. Evidence & Content Richness (78)

**E — combination of B and C.**

- **B:** Introductory Lagrangian resource legitimately uses authored problems + labelled simulated scenarios (QA: simulated evidence **Strong**; authentic/external **Limited**).
- **C:** Benchmark prefers source diversity / competing interpretations / uncertainty — not required by LO1–LO4.

**Should not block Sprint 78 closure** by itself. Do not add fake external sources to chase the dimension.

Transfer (QA improvement 3) is a **milder** related gap — see §13.

---

## 13. Transfer recommendation

EP A2–A4 already list `transfer` beats. DLA/GAM realise **four** activities (purpose → construct → solve → interpret) with **within-activity** independent problems, not a fifth consolidation that joins all three productions.

**Interpretation:** optional enhancement / **EP beat not realised as a distinct DLA activity**. Not an WS1–3 reopen. Not sufficient alone to justify a new activity-count architecture. If later commissioned, it belongs in **DLA activity design**, not the suitability verifier.

---

## 14. Candidate 6 overall interpretation

Candidate 6 can be all of the following at once:

| Observation | Track |
| ----------- | ----- |
| 88/100; release ready with minor revisions | **Learner-resource quality** — coherent, aligned, Check Strong (F&S **92**) |
| All activities Strong Orient/Learn/Do/Check/Workspace | WS1/WS2/WS3 **capability** on this package |
| Subject Quality 84 | **Disciplinary precision** gap (this record) |
| Evidence 78 | Introductory + benchmark-breadth limitation, not a production defect |
| GAM attempt 1 E2 FAIL | **Pipeline reliability** — [E2 diagnostic](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) |
| GAM attempt 2 valid + verifier PASS | Suitability **capability**; first-pass reliability **not** proven ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) |

Do not treat attempt-2 success as closing E2 or as “regenerate until pass” reliability.

---

## 15. Smallest justified repair direction

**Canonical owners (split):**

1. **GAM authoring contract** (`buildGamV2CopyMaterialAuthoringBrief` / GAM enrich contract) — salience of the refined invariant; do not treat DLA “optimal” as licence to overclaim FOC sufficiency; qualify interpretive claims.
2. **DLA commissioning salience** (secondary, A3 wording) — commission **candidate** solutions / solved values + constraint check, not unscoped “optimal solution from FOCs.”
3. **Design Page / image-brief visual commissioning** — do not render a stronger constraint class than taught examples; project the same invariant into `disallowed_claims` / discipline notes.

Prefer (1)+(3) salience over new schema. DLA (2) is justified because C6’s FOC language **starts** there; keep it **wording/salience**, not new metadata.

| Question | Answer |
| -------- | ------ |
| Deterministic validation? | **No** (would become Lagrangian/NLP shadow QA) |
| Prompt/contract change? | **Yes** (salience) |
| New schema? | **No** |
| New verifier? | **No** |
| Domain-specific logic / solvers? | **No** |
| Architecture vs salience? | **Salience** on existing GAM + visual claim fields; optional DLA A3 commission wording |

Expected cross-disciplinary behaviour: fewer unscoped “therefore X is established” leaps; visuals stay inside the taught representation class.

---

## 16. Next implementation task (not started)

**S78-T-025 — general disciplinary-precision authoring solution design** (DESIGN ONLY when authorised), then a bounded implementation task.

Scope when implemented:

- one general invariant (refined wording above);
- GAM authoring salience;
- DLA commission wording guidance for result-strength (not Lagrangian-only rules);
- visual-commissioning salience (`allowed_claims` / `disallowed_claims` / `canonical_discipline_note`);
- cross-disciplinary fixtures;
- Candidate-6-shaped regressions (FOC≠optimum as general “necessary≠sufficient”; representation-class match);
- **no** domain solvers, **no** verifier expansion, **no** new schema.

Fresh benchmark **after** implementation, not inside the design task.

E2 upstream-response architecture diagnostic remains a **separate reliability track**.

---

## 17. Sprint 78 remaining work (do not close)

| Track | After Candidate 6 | Blocks exit? |
| ----- | ----------------- | ------------ |
| A. Learner-resource quality | 88/100; 0 C/M; Strong activity consistency | Remaining quality gap ≈ disciplinary precision toward ≥90 |
| B. First-pass GAM reliability | Attempt 1 E2; attempt 2 PASS | **Yes** as reliability (S78-D02) — not closed by regen |
| C. E2 malformed-output | Confirmed C6 attempt 1; queued architecture diagnostic | Yes, separate |
| D. Operational suitability | C6 attempt 2 PASS; C4 historical FAIL | Positive evidence; not identical to precision |
| E. Disciplinary precision | This diagnostic; T-025 not started | Yes for ≥90 quality, not for production-defect cap |
| F. T-019 activity timing | Queued | No (logged) |
| G. Settings / backlog | Outside sprint | No |

**T-013 remains OPEN:** first-pass reliability (E2) and “regenerate until pass is not closure.” WS2 independence on C6 attempt 2 is **positive** (distinct A2/A3 operands). Do not reopen WS2 architecture.

---

## 18. Files

**Inspected:** this paste (QA, GAM attempt 2, EP, zips); C6 DLA; C6 E2 record; `lib/ld-gam-page-enrich-contract.js`; `app.js` GAM copy brief; `lib/instructional-pattern-prompt.js`; `lib/ld-design-page-partial-contract.js`; `lib/prism-image-brief-compiler.js`; `lib/sprint38-visual-affordances.js`; STATUS / PLAN / START-HERE / T-013.

**Changed:** this record; GAM/EP/QA exhibits; STATUS / PLAN / START-HERE / T-013 pointers only.

**Production / prompt / schema / validator / assembly / renderer:** **none**.
