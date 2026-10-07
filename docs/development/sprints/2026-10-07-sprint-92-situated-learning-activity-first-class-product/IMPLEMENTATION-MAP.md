# Sprint 92 — Implementation map

**Status:** **COMPLETE** — Gate 8 live E2E **PASS**; Sprint 92 **CLOSED**  
**Sprint:** 92 — Situated Task (`situated_task`)  
**Design gates 1–7:** **COMPLETE** ([S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) … [S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract))  
**Product identity:** [S92-D09](decisions.md#s92-d09--product-name-and-identity--situated-task)  
**Gate 8:** **COMPLETE / PASS** (live end-to-end acceptance)  
**Close:** [S92-D10](decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete) · [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md)  
**Contract authority:** [S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract)

This map authorises **implementation planning and bounded coding slices**. Prefer reuse of existing first-class infrastructure over product-specific parallel machinery. Do **not** invent educational-design decisions that S92-D02–D08 left open — flag them below instead.

---

## Current posture

```text
Sprint open (S92-D01)                 COMPLETE
Product design gates 1–7              COMPLETE
Product identity (S92-D09)            Situated Task / situated_task
Implementation map                    AUTHORISED
Gate 8 Slice 1                        COMPLETE (family + pipeline + Design Page)
Gate 8 Slice 2                        COMPLETE (action_support + optional Situated VA)
Gate 8 Slice 3                        COMPLETE (LJ commission allow-list + shared intake)
Gate 8 Slice 4                        COMPLETE (Situated learner package + LJ cN/ inclusion)
Gate 8 Stage 5 wiring fix             COMPLETE (Interactive Sprint 58 Copy fallthrough)
Gate 8 Slice 5                        COMPLETE (enactability + record.entries → shared text_entry)
Gate 8 placement / page-kind          COMPLETE (optional after_section_id; data-page-kind=situated_task)
Gate 8 live E2E acceptance            PASS (standalone accessibility Situated Task)
Gate 8                                COMPLETE / PASS
Sprint 92                             COMPLETE / CLOSED
Durable Record transport              DEFERRED (not a Gate 8 close blocker)
Sprint 91                             COMPLETE / CLOSED — do not reopen
```

### Slice 2 notes (implementation of S92-D08 graphics + S92-D09)

- Shared `purpose` vocabulary += `action_support` (additive; `mechanism` unchanged).
- Situated Stage 5 may omit visual planning or emit section-scoped `visual_affordances` (`section-after-content`, anchors like `{section_id}.exposition`).
- Authoring path reuses planner → compiler → owner-store → `assessRequiredGraphicsJobsFromPage`.
- No compiled briefs/ledgers on the Design Page.

### Slice 3 notes (LJ commissioning)

- `SUPPORTED_PRODUCT_IDS` += `situated_task` (static allow-list; label **Situated Task**).
- Learning Journey commissioning prompt + Design Page `product_id` guidance include Situated Task centre-of-gravity discriminator; no subtypes; no historical unsupported → Situated migration.
- Shared path unchanged: `resolveCommissionFromPage` → `commissionToIntakeEnvelope` → `intakeCommission` → `applyAcceptedCommissionIntake`.
- `acceptsCommission: true` is sufficient for family capability checks; production-status fallback list includes `situated_task`.
- Ordinary Situated workflow + existing provenance (`sourceWorkflowId` / `sourceCommissionId`, commissionIntake, workflowBriefResolved); no auto-run; no Design Page provenance ledger.
- Derived Not commissioned → Production → Authoring → Complete reuses shared graphics assessor (Slice 2).

### Slice 4 notes (learner package + LJ inclusion)

- `situated_task_page` is a page-based LearnerPackage publish route (`isPageBasedLearnerPublishRoute`) alongside `learner_page` / `expository_page`.
- Standalone + LJ constituent packaging reuse authoritative assembled page → `runUtilityPageExportPipeline` → shared `buildLearnerPackage` (no Situated-specific ZIP builder; `situated_learning` not rendered as diagnostics).
- LJ package nests Complete Situated packages under stable `cN/` with local media; Journey Home links follow canonical commission order.
- Preflight reuses Sprint 91 enriched prepare path; Production/Authoring/unsupported block; Complete + zero/satisfied graphics pass.
- Record persistence intentionally deferred.

Pipeline ([S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline)):

```text
Situation → Activity → Support → Learning Return → Design Page
```

Canonical artefact ([S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract)): ordinary `artifact_type: "page"` / `schema_version: "2.0.0"` with product-specific `situated_learning` semantics + `sections[]` composition; `activities: []` unless shared-page evidence requires otherwise.

---

## 1. Vertical slice (definition of “working”)

Prove, end to end, without inventing educational design beyond S92-D08:

1. Author can **Create** this product as an optional first-class declaration (existing Interactive / Expository / Assessment / Learning Journey Create paths unchanged).
2. Predetermined pipeline runs: **Situation → Activity → Support → Learning Return → Design Page** in one continuous model conversation.
3. Stage 5 emits a valid ordinary page (`page` / `2.0.0`) with required `situated_learning` semantic core and coherent `sections[]`.
4. Deterministic validation rejects missing Purpose / Activity / Record / Reconnection semantics; does not invent them.
5. Learner preview/render uses shared `sections[]` Markdown path (including shared display maths when present).
6. When educationally warranted, optional visual planning on the page compiles through the **shared** graphics path; when not warranted, zero-required graphics Complete remains valid.
7. Shared visual `purpose` vocabulary includes the Gate 7 additive token (working name `action_support` unless naming conventions dictate otherwise).
8. Ordinary Authoring → package path works for a constituent workflow; commission intake can seed Create when declared commissionable.
9. Learning Journey deterministic package / status semantics remain unchanged for other products.

Persistence delivery (localStorage, forms, uploads, etc.) is **out of slice** unless needed solely to prove educational Record semantics are present on the page without baking a mechanism into the Design Page.

---

## 2. Modules / components to reuse

| Asset | Role |
| ----- | ---- |
| `lib/first-class-workflow-family.js` | Register product + Create declaration; local pipeline builder; `acceptsCommission` if commissionable; prompt/publish routes |
| `app.js` Create / design / Authoring paths | Same patterns as Expository / LJ / Interactive; no parallel Create architecture |
| Sibling-prompt module pattern (`lib/expository-sibling-prompts.js`, `lib/learning-journey-sibling-prompts.js`) | Product-owned five-stage prompts outside Domain Pack topology |
| Design Page validate/render pattern (`lib/learning-journey-design-page.js`, Expository Design Page helpers) | Stage 5 strict JSON + product semantic validation; shared page render |
| Shared page assemble / `build-page-model` / vNext renderer | `sections[]` learner composition |
| `lib/sprint38-visual-affordances.js` + visual planning / planner / compiler / workspace / owner store | Optional graphics; **additive** `purpose` token only |
| `lib/ld-math-render.js` + MathJax package assets | Shared display maths — no situated-specific maths schema |
| `lib/first-class-commission-intake.js` | Commission → Create seed when product declares `acceptsCommission` |
| `lib/learning-journey-commission-production-status.js` + `assessRequiredGraphicsJobsFromPage` | Graphics Complete / Authoring compatibility for constituents |
| `lib/learner-package.js` | Learner ZIP including optional maths/graphics assets |

---

## 3. Bounded implementation decomposition

Order prefers reuse and early validation seams. Exact WP numbering may be refined in [PLAN.md](PLAN.md).

### A. Family registration and Create surface

- Register first-class product in `FIRST_CLASS_PRODUCTS` / `CREATE_DECLARATIONS` once a working `product_id` and Create label are settled (implementation decision — **not** settled by S92-D08).
- Wire predetermined stage titles: Situation / Activity / Support / Learning Return / Design Page.
- Ensure prompt/publish routes do not fall through to Interactive.
- **Tests:** family registration; Create declaration listing; non-regression of existing products.

### B. Product-specific five-stage prompt contracts

- New sibling-prompt module holding Situation → Activity → Support → Learning Return (+ Design Page synthesis contract).
- Continuous conversation; classification challenge per [S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline) (do not manufacture this product when centre of gravity is a sibling).
- Inject shared `LD-MATH-RENDER` for learner-facing prose where other products do.
- **Tests:** prompt route recognition; stage titles; capture keys / step ids as required by family wiring.

### C. Stage 5 Design Page — generate / validate / store

- Strict JSON page: `artifact_type: "page"`, `schema_version: "2.0.0"`, title, `situated_learning` core, `sections[]`, `activities: []` (default), optional visual planning when warranted, ordinary assembly-state.
- Validate required Purpose / Activity / Record / Reconnection semantics; allow omission of conditional content; forbid exclusions listed in S92-D08.
- Persist/store via existing page-artefact capture path — no special artefact type.
- **Tests:** accept minimal valid page; reject missing semantic core; reject special artefact type; omit-optional vs empty-furniture behaviour; provenance not duplicated onto page.

### D. Learner rendering

- Render `sections[]` through shared vNext Markdown path.
- Do not require section titles to mirror Purpose → Activity → Record → Reconnection.
- Display maths via existing delimiters + MathJax path when present.
- **Tests:** section render fixture; TeX delimiters survive assemble → preview; no Interactive activity chrome forced by empty `activities: []`.

### E. Shared visual-purpose vocabulary addition

- Additive product-neutral `purpose` token (working: `action_support`) in Sprint 38 vocab + planner/compiler acceptance + Authoring UI lists as needed.
- Do **not** redefine `mechanism`.
- Product Design Page prompts may author optional `visual_affordances` when educationally required, including the new purpose where honest.
- **Tests:** new purpose validates; mechanism unchanged; compile → brief carries educational_function; Interactive/Expository fixtures still pass.

### F. Deterministic Authoring / graphics completion / package

- Reuse visual jobs workspace, owner-store association, `assessRequiredGraphicsJobsFromPage`, learner-package media inclusion.
- Zero-required graphics Complete when no generate demand.
- **Tests:** page with no VA → zeroRequired complete; page with generate + attached resource → complete; briefs not stored on Design Page.

### G. Commission intake + Learning Journey compatibility

- Declare `acceptsCommission` (or not) based on product role — default expectation: **commissionable constituent** like Interactive/Expository unless evidence says otherwise (**open** until Create/`product_id` settled).
- Commission intake seeds Create without LJ-specific page provenance.
- LJ assembly/package/status unchanged for other products; this product participates as ordinary constituent when commissioned.
- **Tests:** commission intake → Create seed; unsupported commission visibility unchanged; LJ non-regression.

### H. Live E2E acceptance (charter / Gate 2 matrix)

After focused suites are green, exercise representative live cases from [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md) / charter:

- product-situation investigation;
- evidence gathering;
- bounded product test;
- workplace enquiry;

plus near-neighbour **non**-acceptance where centre of gravity remains Interactive / Assessment / Expository.

Record evidence in [VALIDATION.md](VALIDATION.md).

---

## 4. Likely files requiring modification (indicative)

| Area | Likely touchpoints |
| ---- | ------------------ |
| Family / Create | `lib/first-class-workflow-family.js`, Create UI in `app.js` / `index.html` |
| Prompts | New `lib/*-sibling-prompts.js` (name TBD with `product_id`); prompt routing in `app.js` |
| Design Page validate | New or thin product validate module; storage helpers already used by other pages |
| Visual purpose | `lib/sprint38-visual-affordances.js` (+ contract re-exports, compiler representation set if needed, Authoring prompt lists) |
| Maths | Prompt injection sites only (reuse `ld-math-render.js`) — no new maths engine |
| Commission / LJ status | `lib/first-class-commission-intake.js`; production-status product allow-lists if explicit |
| Tests | Focused suites under `tests/` mirroring Expository/LJ seams |

Exact line edits deferred to coding slices.

---

## 5. Genuinely new modules (expected)

| Proposed | Responsibility |
| -------- | -------------- |
| Product sibling-prompts module | Five-stage + Design Page synthesis contracts |
| Product Design Page validate helper | `situated_learning` semantic validation on ordinary page envelope |

Avoid parallel Authoring, package, maths, or graphics stacks.

---

## 6. Unresolved implementation-only questions

Do **not** silently invent educational design. Resolve in Gate 8 implementation notes / follow-up decisions only when forced by code:

1. **Final `product_id` and Create label** — working title only at S92-D08; required for family registration.
2. **Exact nested field names** under `situated_learning` for Purpose / Activity / Record / Reconnection and for conditional sub-elements (smallest useful representation).
3. **Exact spelling** of the new shared visual `purpose` token (`action_support` is working only).
4. **Whether `acceptsCommission: true`** for this product (expected yes as LJ constituent; confirm at registration).
5. **Whether any shared-page consumer requires non-empty `activities[]` or page-level `product_id`** — default remains `activities: []` and workflow-owned identity per S92-D08.
6. **Classification-challenge UX** — educational requirement exists ([S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline)); runtime switching UX not designed.
7. **Persistence capability** for Record — educational semantics specified; delivery mechanism explicitly deferred.

---

## 7. Explicit non-goals for early Gate 8 slices

- Persistence platform / LMS / account storage as product definition
- Situated subtype taxonomy or delivery-mode taxonomy
- Redefining Interactive / Expository / Assessment / LJ schemas
- Redefining Sprint 38 `mechanism`
- Situated-specific maths representation or MathLive entry as canonical contract
- Reopening Sprint 91

---

## 8. Gate / programme linkage

| Gate | State |
| ---- | ----- |
| 1–7 Design | **COMPLETE** |
| 8 Implementation | **ACTIVE** — this map |
| 9 Commissioning integration | After first vertical slice |
| 10 Authoring / publishing integration | As required by shared Authoring path |
| 11 Learning Journey assembly integration | Ordinary constituent semantics |
| 12 Live end-to-end acceptance | Charter matrix |

Pattern reference: [Sprint 91 IMPLEMENTATION-MAP](../2026-10-06-sprint-91-learning-journey-first-class-implementation/IMPLEMENTATION-MAP.md) — reuse, do not copy Learning Journey pedagogy.
