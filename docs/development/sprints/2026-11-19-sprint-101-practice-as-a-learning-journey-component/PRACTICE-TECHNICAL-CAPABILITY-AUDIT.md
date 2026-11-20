# Sprint 101C-3 — Practice Technical Capability Audit and Implementation Readiness

**Status:** **ACCEPTED** (authorised and used for 101D)  
**Date:** 2026-11-19  
**Mode:** Documentation + read-only code investigation (pre-101D)  
**Depends on:** 101A investigation · 101B contract (accepted) · 101C wireframe (accepted as design foundation, refined here)  
**Decision:** [S101-D04](decisions.md#s101-d04--propose-practice-technical-capability-audit-101c-3) **Accepted**  
**Implementation:** [101D-IMPLEMENTATION-REPORT.md](101D-IMPLEMENTATION-REPORT.md)

Label discipline: **CONFIRM** = observed in code; **ASSUME** = planning judgement.

---

## 1. Consolidated instructional decisions (accepted)

Practice is a **distinct Learning Journey-commissioned resource type**, not a simplified mode of Interactive.

| Decision | Binding statement |
| -------- | ----------------- |
| Distinct type | Own product / workflow identity (`product_id: "practice"` when implemented) |
| Availability (v1) | Commissioned **only within Learning Journeys** |
| Interactive | Standalone Interactive remains **unchanged** |
| Capability inheritance | Practice inherits Interactive’s established **instructional and technical** capabilities where appropriate |
| Presentation | Lighter, **task-led** learner presentation — not Interactive’s dense, table-led defaults |
| Sophistication | Retain Interactive’s instructional sophistication (scaffolding, feedback, revision, maths, sequencing) even when presentation conventions change |
| Commission role | The LJ commission determines Practice’s instructional role |
| Foundation stages | GLC → MK → DLO retained |
| v1 posture | Establish a **working v1** before extensive refinements or new interaction types |
| Wireframe | 101C Lagrange C2 wireframe is a **worked example**, **not** a mandatory four-activity template |
| Validation | 101E uses a **new** Learning Journey generated after Practice exists; existing Lagrange LJ remains an untouched baseline |

### Design grammar (flexible — not a fixed page template)

```text
Conceptual hook → purposeful setup → meaningful learner activity
  → feedback and improvement → progression or transfer
```

Activities may be one substantial stop or several connected stops. Interaction surfaces follow the intellectual task.

### Capability classes (instructional vs presentation)

| Class | Meaning | Practice v1 examples |
| ----- | ------- | -------------------- |
| **Required instructional capabilities** | Must be available on the generation→learner path | Unambiguous tasks; consequential response surfaces; substantive feedback; coherent sequencing; maths display; accessibility; packaging/export; commission inheritance |
| **Optional instructional capabilities** | Available when the commission/task warrants | Purposeful preambles; conceptual/editorial imagery; essential working-knowledge apparatus; worked examples; hints; cognitive scaffolds; revision; criterion-based self-review; structured tables/matrices; selection-based items; math input |
| **Optional presentation features** | Presentation choices, not capability gaps | Compact orientation; knowledge-support graphics; reveal-after model panels; collapsed scaffolds |
| **Deliberately omitted from Practice v1** | Not part of the Practice contract | Mandatory Overview / Learning purpose / Knowledge summary / Study tips stack; default dense comparison tables; ritual repeated preambles; Interactive self-study “complete teaching resource” posture; Create-standalone Practice; new interaction types; auto-migration of legacy Interactive commissions |
| **Future interaction extensions** | Out of sprint unless separately authorised | New workspace kinds beyond Interactive’s existing set; Assessment Pack consuming Practice outputs; Create-standalone Practice; automatic Interactive→Practice migration |

**Clarification:** “Omit mandatory knowledge-summary *ceremony*” does **not** mean “omit essential working knowledge.” Practice may supply the formulae, representations and point-of-need apparatus the attempt requires.

**Clarification:** “Lighter presentation” does **not** mean “thin pedagogy.” Purposeful preambles, scaffolding, feedback and revision remain first-class when instructionally justified.

---

## 2. Capability-retention matrix

**Path under audit:** generation contracts/prompts → page assembly → learner-renderer-vnext → export/package runtime.

Sharing the renderer alone is **not** sufficient: Interactive Design Page / DLA contracts currently **mandate** furniture Practice must not require (CONFIRM: `lib/ld-design-page-partial-contract.js` mandates `knowledge_summary` and `editorial_opening_image` generate; DLA mandates `intellectual_coherence_bridge` on every activity).

| Capability | Current implementation (CONFIRM) | Reuse unchanged? | Practice prompt/contract? | Renderer/schema? | Risks / regression tests |
| ---------- | -------------------------------- | ---------------- | ------------------------- | ---------------- | ------------------------ |
| **Math rendering (MathJax/LaTeX)** | Delimiter protection + typeset in `lib/learner-renderer-vnext-browser.js`; package rewrite via `lib/learner-package.js` + `mathjax-package-assets` | **Yes** (runtime/packaging) | Ensure Practice DP/GAM still emit TeX in materials | None if `pageKind` still hits math path; verify Practice pages trigger package MathJax collect | Package test: TeX page ships local MathJax, no CDN leftover |
| **Math input (MathLive)** | `data-input-modality="math"` / math-field wiring in renderer-browser; assets packaged when needed (`learner-package.js`) | **Yes** | DLA/GAM must still commission math modality where needed | None expected for v1 | Round-trip MathLive ↔ textarea TeX; fallback textarea if MathLive absent |
| **Editorial opening images** | DP root `editorial_opening_image`; Interactive contract **always generate** (`ld-design-page-partial-contract.js`); rendered as editorial region | **No as mandatory** | Practice DP: **optional** conceptual/editorial image when useful; allow skip | Soften/omit mandatory generate for Practice `pageKind`/`product_id` | Interactive still always-generate; Practice skip must not break render |
| **Knowledge-summary + instructional graphics** | `page_synthesis.knowledge_summary` mandatory for Interactive DP; KS visual affordances (`region: knowledge_summary`) | **Ceremony: no**; **graphics: selective yes** | Practice: no mandatory KS section; allow knowledge-support graphics / compact apparatus without answer spoilers | Orientation section optional/empty for Practice | Interactive KS still required; Practice must not fail capture without KS |
| **Other media / diagrams** | Activity materials + `visual_affordances[]`; PNG/SVG in packages | **Yes** | Commission only when task needs; discovery protections remain | Reuse | No forced visual planning tax |
| **Activity sequencing / transitions** | EP beats → DLA activities → LS → compose moments (`compose-page-model.js`); bridges via `intellectual_coherence_bridge` | **Reuse machinery; change obligations** | Practice: coherent sequence without mandatory bridge-every-activity ceremony | `pageKind: "practice"` should still compose Do/Check; decide whether Sprint 98 scaffold relocation applies to Practice | Interactive bridges unchanged; Practice capture without mandatory bridges |
| **Cognitive scaffolding / hints / worked examples** | DLA cognition fields; GAM materials (`worked_example`, modelling notes); reveal-after; attempt-before scaffolds | **Yes (capability)** | Practice-owned depth rules: proportionate, not Interactive IFP word-count stacks | Prefer reuse; optional collapsed scaffolds | Interactive scaffold suites unchanged |
| **Free-text + structured responses** | `text_entry`, templates, `response_fulfilment`, table_entry | **Yes** | Keep production obligations; fewer ritual fields | Reuse | Fulfilment binding tests |
| **Selection-based interactions** | Assessment selection / MCQ-style paths in renderer; Interactive may use selection materials | **Yes where already supported** | Do not invent new kinds in 101D | Reuse | Determinate check honesty |
| **Structured tables / matrices** | Table-family materials; editable table_entry; comparison tables in DLA/GAM | **Yes when justified** | Practice contracts: **not default**; allow for evaluation/synthesis | Reuse | Avoid regenerating table-led Interactive defaults |
| **Criterion-based self-review** | Guided criteria / “My response now meets this criterion” (`learner-renderer-vnext-browser.js`) | **Yes (optional)** | Proportionate use; not mandatory chrome on every field | Reuse | Interactive criteria unchanged |
| **Feedback / model explanations** | Check materials, sample_output, reveal-after; compose Check moments | **Required capability** | Practice: substantive return always; model after attempt | Reuse | Discovery-sequence protections regression |
| **Revision opportunities** | Revision-against-guidance patterns; evidence-driven revision in DLA | **Optional yes** | When outcomes warrant | Reuse | |
| **Persistence / navigation** | `learner-draft-persistence.js` / export-runtime localStorage; section nav in rendered page | **Yes** | None | Ensure Practice HTML includes runtime hooks like Interactive packages | Persistence identity tests |
| **Accessibility / keyboard** | focus-visible, math-field a11y, workspace labels | **Yes** | Authoring must keep labels | Reuse | Smoke keyboard on Practice package |
| **Learner-page packaging / export** | `lib/learner-package.js`; LJ nests via `learning-journey-learner-package.js` + unified shell | **Yes** if Practice publishes as page-based learner route | Register publish route (likely `learner_page`) | `pageKind`/`product_id` recognition in package gates | LJ package includes Practice constituents; Interactive nest unchanged |

### Critical path finding (CONFIRM)

| Stage | Interactive-specific obligation that would break “share prompts unchanged” |
| ----- | -------------------------------------------------------------------------- |
| Design Page | Mandatory `knowledge_summary`; mandatory editorial opening generate |
| DLA | Mandatory `intellectual_coherence_bridge` every activity; heavy anti-shell / teaching-depth stacks |
| Runtime prompts | `app.js` `applyWorkflowStepRuntimePromptAugmentations` only when `promptRoute === "interactive"` |
| Renderer | Unknown non-assessment/expository/situated pages default `pageKind: "interactive"` (`build-page-model.js`) |
| Compose | Attempt-before scaffold relocation only for `pageKind === "interactive" \|\| ""` |

**Conclusion:** Technical capabilities **can** be preserved, but Practice needs **Practice-owned instructional/presentation contracts** (and explicit `pageKind` / `promptRoute`) so Interactive mandates are not silently applied—or worse, Interactive mandates are not globally weakened.

---

## 3. Architecture and reuse boundaries

### 3.1 Recommended architecture

**Practice as a first-class product** with:

- `id: "practice"`
- `promptRoute: "practice"`
- `publishRoute: "learner_page"` (same page-based packaging family as Interactive — **ASSUME** best fit)
- `acceptsCommission: true`
- **No** Create-declaration / standalone Create in v1

**Workflow topology:** Reuse GLC → MK → DLO → EP → DLA → GAM → LS → DP **stage titles/order** (same `INTERACTIVE_TITLES` / middle), driven by **Practice** identity and Practice prompt/contract overlays — **not** by mutating Interactive’s `promptRoute === "interactive"` augmentations.

**Boundary rule:** Prefer Practice-owned contract modules / promptRoute branches that **call shared assemblers**. Avoid `if (commissionedFromLj)` inside Interactive. Avoid thinning shared Interactive scaffolds globally.

### 3.2 Minimum registration / intake changes (CONFIRM today’s gaps)

| Surface | Today | Needed for Practice |
| ------- | ----- | ------------------- |
| `FIRST_CLASS_PRODUCTS` | No `practice` | Add product record |
| `buildFirstClassWorkflowFamily` | Unknown product → `{ ok:false, code:"unknown_product" }` (**no silent Interactive fallback** — CONFIRM) | Accept `practice`; build titles/middle like Interactive without claiming Interactive identity |
| `intakeCommission` | Uses `envelope.productId`; rejects unknown / non-commissionable | Works once product registered; keep topology check `identity.product === envelope.productId` |
| `resolveInteractiveCreateType` | Maps to self_study/workshop | Practice must not be forced through Interactive create types; LJ-only seed path |
| LJ `SUPPORTED_PRODUCT_IDS` | interactive \| expository \| assessment_pack \| situated_task | Add `practice` |
| LJ Design Page field guidance / Step 4–5 prompts | Prefer Interactive for activity | Prefer **Practice** for purposeful intellectual activity; keep Interactive supported |
| `productAcceptsCommission` | Family-declared | Practice `acceptsCommission: true`; unsupported products stay unsupported |
| Preview create-product | Re-validates commission product identity (`app.js`) | Must pass `practice` through without remapping to Interactive |
| Workload adapter | Special-cases `interactive` | Additive Practice mapping |
| AP `acceptsProductOutputFrom` | interactive, expository | **Do not** add Practice in 101D unless authorised |
| Journal producers | Interactive response ids recognised | Additive later if Practice artefacts are journalable — not a v1 blocker |

### 3.3 Fallback / footgun check (CONFIRM)

| Risk | Behaviour today | Practice requirement |
| ---- | --------------- | -------------------- |
| Unknown product in family builder | Fails closed (`unknown_product`) | Keep fail-closed; never map Practice→Interactive |
| Supported id without acceptsCommission | Preview shows “commission intake not declared” | Practice must declare acceptsCommission |
| Unsupported commission | Empty product_id + unsupported status | Unchanged |
| Renderer default pageKind | Falls through to `"interactive"` | Practice pages must set explicit `pageKind: "practice"` (and product_id) so furniture/compose rules are intentional |
| Sharing Interactive promptRoute | Would inherit Interactive DP/DLA mandates via `app.js` augmentations | **Do not** reuse `promptRoute: "interactive"` for Practice |

### 3.4 Smallest Practice-owned boundary

| Shared (reuse) | Practice-owned |
| -------------- | -------------- |
| Page envelope / assemblers (`page-vnext-assemble`, dla/gam enrich) | Practice promptRoute + DP/DLA/GAM presentation contracts |
| Response/math/persistence/render composition | Which furniture is mandatory vs optional |
| Learner package + LJ nest/shell | Product registration, commissioning centre-of-gravity, workload mapping |
| GLC/MK/DLO | Completeness definition without Interactive KS/tips |

---

## 4. Learning Journey commissioning implications

### 4.1 Existing fields remain sufficient for v1 (CONFIRM + ASSUME)

| Field | Role for Practice |
| ----- | ----------------- |
| `product_id: "practice"` | Type selection |
| `specification_text` | Learning job, actions/evidence, explanation licence, feedback expectations, time envelope |
| `journey_context_text` | Prior learning, do-not-reteach, bring-forward |
| `dependencies` | Earlier commission pointers |
| Shared source / `source_context` | Authoritative corpus when present |
| `sections[].exposition` | Journey-home framing (not Practice-page dump) |

**No new commission JSON keys required for v1** unless later commissioning quality fails (unchanged from 101B).

### 4.2 Selection behaviour (implementation intent — not yet coded)

When 101D updates Step 4/5 guidance:

- **Practice** — purposeful intellectual activity / capability development through action, feedback, improvement.  
- **Expository** — explanation / organisation of knowledge.  
- **Assessment Pack** — formative evidence of learner state/capability.  
- **Situated Task** — authentic situated performance.  
- **Interactive** — remains commissionable for legacy and any explicit self-contained interactive need; **not** auto-replaced in existing journeys.

### 4.3 Backwards compatibility (binding)

- Existing LJ pages with `product_id: "interactive"` remain valid.  
- Existing exemplar packages untouched.  
- No retrofit of Practice into *Understanding Lagrange Multipliers*.  
- Unsupported types must not silently become Interactive or Practice.

---

## 5. Practice v1 presentation requirements → minimum change surface

### 5.1 Presentation contract (v1)

| Requirement | Generation implication | Render implication |
| ----------- | ---------------------- | ------------------ |
| Conceptual hook when useful | Optional short orientation / optional conceptual image | Do not require Overview quartet |
| Purposeful setup | Compact working knowledge + stimulus; optional purposeful preamble | Show apparatus adjacent to task |
| Meaningful activity | Strong `learner_task` + response surfaces | Do/Check composition |
| Feedback & improvement | Post-attempt model/check; optional revision/self-review | Reveal-after / Check moments |
| Progression / transfer | Optional next-activity hinge or transfer prompt | No mandatory study tips/closing essay |
| Tables | Only when cognitively justified | Existing table renderers |
| Maths | TeX + optional MathLive | Existing math paths |

### 5.2 Minimum prompt/rendering changes (proposed for 101D — not implemented)

1. Register Practice product + LJ supported id + commissioning preference text.  
2. Practice `promptRoute` with Practice DP contract: KS/study tips/closing **not mandatory**; editorial image **optional**; title + activities required.  
3. Practice DLA/GAM overlays: keep production, feedback, discovery protections, maths; relax mandatory bridges / dense table defaults / Interactive anti-shell stacks that force pre-teach ceremony.  
4. Emit `product_id: "practice"` and `pageKind: "practice"` on Design Page.  
5. Renderer: recognise `practice` explicitly (do not rely on Interactive default); decide compose behaviours intentionally.  
6. Packaging: treat Practice like other `learner_page` products.  
7. Workload adapter: map Practice commissions.

**No new interaction types in this sprint.**

---

## 6. Proposed 101D implementation slices

Prioritise a **complete working Practice generation path**. Interactive stays unchanged.

### Slice D0 — Product identity & fail-closed wiring

| | |
| - | - |
| **Files** | `lib/first-class-workflow-family.js`, `lib/first-class-commission-intake.js`, `lib/learning-journey-design-page.js`, LJ sibling/design-page prompt guidance, possibly `app.js` create-product labels |
| **Contracts** | Product record; SUPPORTED_PRODUCT_IDS; commissioning centre-of-gravity text |
| **Tests** | Intake accepts `practice`; unknown products still fail; Interactive intake unchanged; unsupported ≠ Interactive |
| **Acceptance** | LJ can declare `product_id: "practice"` and Create opens a Practice-identity workflow |
| **Regression** | Existing Interactive/Expository/AP/ST/LJ create + commission paths |

### Slice D1 — Practice workflow topology + promptRoute skeleton

| | |
| - | - |
| **Files** | `first-class-workflow-family.js`, `app.js` promptRoute augmentations gate |
| **Contracts** | Practice uses GLC→…→DP titles; `promptRoute: "practice"` does not enter Interactive-only augmentations |
| **Tests** | Family build identity.product === `practice`; promptRoute resolution |
| **Acceptance** | Workflow steps exist; Interactive promptRoute behaviour byte-stable |
| **Regression** | Interactive runtime augmentations |

### Slice D2 — Practice instructional/presentation contracts (DP/DLA/GAM)

| | |
| - | - |
| **Files** | New Practice contract modules **or** gated overlays invoked only for Practice; capture validators |
| **Contracts** | Practice DP/DLA/GAM presentation rules (§5) |
| **Tests** | Practice DP capture succeeds without mandatory KS/tips; Interactive DP still requires KS/editorial generate |
| **Acceptance** | Author can capture a lean Practice page JSON meeting Practice rules |
| **Regression** | Interactive DLA/DP/GAM validators |

### Slice D3 — Renderer + package recognition

| | |
| - | - |
| **Files** | `build-page-model.js`, `render-page.js`, compose gates, `learner-package.js` if product gates exist |
| **Contracts** | Explicit `pageKind: "practice"` |
| **Tests** | Render Practice page with maths, response, feedback; package MathJax/MathLive hooks; empty KS does not break |
| **Acceptance** | Exported Practice learner-page usable offline |
| **Regression** | Interactive/Expository/AP/ST render/package suites |

### Slice D4 — End-to-end LJ Practice commission → nested package

| | |
| - | - |
| **Files** | Production status, LJ learner-package, unified shell, workload adapter |
| **Contracts** | Production ladder treats Practice like other supported commissions |
| **Tests** | Fixture LJ with Practice commission packages; Interactive commission fixture still packages |
| **Acceptance** | Complete working path from commission to nested learner HTML |
| **Regression** | Lagrange-style Interactive LJ packaging baseline (untouched exemplars) |

### Slice D5 — Focused hardening (only as needed for working v1)

| | |
| - | - |
| **Files** | Journal producer recognition (if blocking), workload copy, minor compose flags |
| **Out of slice** | New interaction types; AP accepts Practice; Create-standalone; migrating Lagrange |

**Stop condition for 101D:** One newly commissioned Practice constituent can be generated, rendered, packaged, and nested in an LJ package without changing Interactive behaviour.

---

## 7. Required tests and non-regression checks

| Area | Must prove |
| ---- | ---------- |
| Interactive isolation | Interactive promptRoute augmentations, DP mandatory KS/editorial, DLA bridges unchanged |
| Fail-closed products | Unknown / non-commissionable products never become Interactive or Practice |
| Practice intake | `product_id: "practice"` → identity.product `practice` |
| Practice capture | Lean DP valid; maths materials valid; feedback materials valid |
| Renderer | `pageKind: "practice"`; math display/input; persistence scripts present when workspaces exist |
| Package | Local MathJax; MathLive when needed; no CDN leftovers |
| LJ package | Practice nest + Interactive nest both work; unsupported still blocked |
| Workload | Practice commissions estimate without throwing; Interactive mapping unchanged |
| Backwards compat | Existing Interactive LJ commission fixtures remain valid |

---

## 8. 101E validation plan

**Cannot** retrofit Practice into *Understanding Lagrange Multipliers*.

### Method

1. After 101D working path exists, author a **completely new** Learning Journey from brief → requirements → progression → elements → commissions → design page.  
2. Commissioning must select types by instructional purpose (Practice for activity; Expository for explanation; others as warranted).  
3. Generate Practice (and other) constituents via normal Create/intake.  
4. Produce complete learner-facing unified journey package.  
5. Human review against: progression, scaffolding, mathematical support, feedback, usability, presentation economy, commission fidelity.  
6. Keep original Lagrange journey **untouched** as comparison baseline (Interactive-era design).

### Non-assumptions

- New journey need not mirror Lagrange’s component count or C2’s four activities.  
- Wireframe is illustrative, not a scoring rubric for structure.  
- 101E is validation/closure evidence, not a second implementation phase.

---

## 9. Genuinely blocking questions (before 101D coding)

| ID | Question | Recommendation if unanswered |
| -- | -------- | ---------------------------- |
| Q1 | Confirm `publishRoute: "learner_page"` and `pageKind: "practice"` for v1? | **Recommend yes** |
| Q2 | Confirm Practice reuses Interactive **stage titles** with Practice contracts, rather than renaming steps? | **Recommend reuse titles** for speed/safety |
| Q3 | Should Practice apply Sprint 98 Interactive-only attempt-before scaffold relocation, or a Practice-specific compose rule? | **Recommend explicit Practice decision in D3**; default to same learner benefit if low risk |
| Q4 | Are conceptual images represented as optional `editorial_opening_image`, activity visual affordances, or both? | **Recommend both allowed; neither mandatory** |
| Q5 | Is journal producer support for Practice artefacts in scope for 101D? | **Recommend defer** unless a new LJ Step 4 requires it for 101E |
| Q6 | Any objection to additive workload mapping for Practice in 101D? | **Recommend include in D4** |

Non-blocking (already decided): LJ-only v1; no Interactive mutation; no new interaction types; no Lagrange retrofit; no new commission fields unless proved necessary.

---

## 10. Readiness verdict

| Question | Verdict |
| -------- | ------- |
| Can existing technical capabilities be preserved? | **Yes**, via shared runtime/packaging/assemblers, **if** Practice-owned contracts prevent Interactive furniture mandates from being applied or globally deleted |
| Recommended architecture | First-class `practice` product; own promptRoute; reuse GLC…DP topology; Practice contracts; explicit pageKind; LJ additive commissioning |
| Minimum viable Practice v1 | LJ-commissionable Practice workflow → lean task-led page with maths, response, feedback, optional scaffolds/imagery/tables → render/package/nest — Interactive unchanged |
| 101D | Ready to plan slices above **after this audit is approved**; still **blocked** until approval |
| 101E | New LJ from scratch; Lagrange baseline preserved |

---

## 11. Documentation touched by 101C-3

- This file: `PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md`  
- Updates: instructional contract classifications; decisions (`S101-D04`); STATUS; README; implementation map; VALIDATION; programme pointers as needed
