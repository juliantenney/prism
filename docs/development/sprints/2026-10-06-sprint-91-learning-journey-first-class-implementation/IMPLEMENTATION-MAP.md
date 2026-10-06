# Sprint 91 — Implementation Map

**Status:** Review decisions recorded (S91-D02…D05); **B1 RESOLVED**; **WP1–WP4 COMPLETE**; Independent Task not started (WP4 stop)  
**Date:** 2026-10-06  
**Authenticated prompt source:** [JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json) — use each prompt object’s **current top-level `body`**, not `versions[]`  
**Decisions:** [S91-D02](decisions.md#s91-d02--learning-journey-product-identity) · [S91-D03](decisions.md#s91-d03--experimental-prompt-source) · [S91-D04](decisions.md#s91-d04--first-commission-intake-target) · [S91-D05](decisions.md#s91-d05--commissionability-is-family-declared)

This map describes the smallest end-to-end path to a working first-class Learning Journey and a reusable commission→product boundary. It is not a speculative risk register.

---

## 1. Vertical slice (definition of “working”)

Prove, end to end:

1. Author can **Create → Learning Journey** (optional product; existing Interactive / Expository / Assessment Create paths unchanged).  
2. Predetermined pipeline runs: **Requirements → Progression → Elements → Commissioning → Design Page**.  
3. Design Page presents **Rationale / Journey / Elements (commissions)** sufficiently for author use.  
4. A **supported** commission can initialise Create for **Interactive** via shared commission intake — not LJ-specific per-product switches ([S91-D04](decisions.md#s91-d04--first-commission-intake-target)).  
5. An **unsupported** commission remains visible (not collapsed to invisible “VLE activity”).  
6. Direct Create of Interactive / Expository / Assessment without Learning Journey still works.

Independent Task and full persistence platform are **not** required for this slice. Assessment Pack is **not** the first commission-intake proof target.

---

## 2. Modules / components to reuse

| Asset | Role for Sprint 91 |
| ----- | ------------------ |
| `lib/first-class-workflow-family.js` | Product registry (`FIRST_CLASS_PRODUCTS`, `CREATE_DECLARATIONS`), local pipeline builder (`buildFirstClassWorkflowFamily`), identity (`product` / `variant` / `startingPoint`), prompt/publish routes; extend with family-declared **`acceptsCommission`** ([S91-D05](decisions.md#s91-d05--commissionability-is-family-declared)); Assessment `product_output` remains a separate specialised path |
| `app.js` — Create path | `isNormalFirstClassLearningDesignCreate`, `applyLocalFirstClassWorkflowDesign`, `handleStartWorkflowDesign`, `syncWorkflowFactoryLdCreateOutputTypeUi`, `listCreateDeclarations` consumption |
| Assessment `startingPoint: "product_output"` + `sourceWorkflowId` + `readFirstClassProductOutput` | Specialised **finished product output → Assessment** path. Do **not** use as the first proof of commission intake (S91-D04). Keep alongside the new generic commission contract |
| `lib/expository-sibling-prompts.js` | Pattern for product-owned stage prompts living outside Domain Pack topology |
| Expository / Interactive Design Page + assembly paths | Downstream products keep owning design once commissioned; LJ must not redesign them |
| Authenticated Prompt Studio export ([JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json)) | Authoritative source for production LJ reasoning prompt bodies — top-level current `body` only ([S91-D03](decisions.md#s91-d03--experimental-prompt-source)); **B1 resolved** |
| Adjustments (existing) | Author iteration; no new LJ iteration architecture |

**Namespaces:** First-class product id `learning_journey` ([S91-D02](decisions.md#s91-d02--learning-journey-product-identity)) is **not** the Interactive page-section id `learning_journey` in `lib/page-render-normalize.js`. Disambiguate renderer/publish usage locally; do not rename the product.

---

## 3. Likely files requiring modification

| File | Likely change |
| ---- | ------------- |
| `lib/first-class-workflow-family.js` | Register `learning_journey` product + Create declaration; LJ predetermined titles; `acceptsCommission` (or equivalent) on Interactive / Expository / Assessment as appropriate; shared commission-intake helpers resolving only family-declared commissionable products |
| `app.js` | Create UI option; brief fields for learning time + duration (distinct); local design apply path; prompt-route / recognition points; commission “Create this resource” handoff into Interactive Create/briefing first |
| `index.html` (Create factory UI) | Product selector entry; LJ factual elicitation fields only |
| Prompt / publish routing call sites in `app.js` (and any thin helpers) | Recognise LJ without defaulting unknown products to Interactive (S89 Investigation 2 finding) |
| Focused tests under `tests/` | Family registration, pipeline titles, Create declaration, commission intake → Interactive, non-regression of existing products |

Exact line edits are deferred until implementation; the S89 fourth-product diagnostic remains the map of handwritten recognition points.

---

## 4. Genuinely new modules / files (expected)

| New module (proposed) | Responsibility |
| --------------------- | -------------- |
| `lib/learning-journey-sibling-prompts.js` (name TBD) | Hold the four stage prompts ported from authenticated Prompt Studio experimental versions (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`). **Minimum production wiring only** — do not reconstruct or improve from docs (S91-D03) |
| `lib/learning-journey-design-page.js` (or assemble helper) | Learning Journey Design Page **prompt + validate**: GPT same-chat Step 5 synthesis produces ordinary shared `artifact_type: "page"` (`product_id: learning_journey`) with `sections[].exposition` + non-rendering `commissions[]`; PRISM validates LJ semantics, then renders via shared `renderLearnerPageHtml`. Steps 1–4 reasoning lives in the continuous chat |
| `lib/first-class-commission-intake.js` (or functions inside family module) | Shared, minimal contract: `{ productId, specificationText, focus?, sourceContext?, constraints?, dependencies?, journeyContextText?, unsupported? }` → seeds Create for products with `acceptsCommission: true`. Learning Journey itself is **not** commissionable by default (S91-D05) |

Optional later in-sprint (only if boundary already works and remains small):

| New module | Responsibility |
| ---------- | -------------- |
| Independent Task family entry + sibling prompts + thin publish/runtime | Brief → purposeful activity → Record → Reconnect (+ Design Page). Declare `acceptsCommission: true` via the same mechanism |

---

## 5. How Learning Journey enters the first-class product family

```
FIRST_CLASS_PRODUCTS += {
  id: "learning_journey",          // S91-D02 — canonical product id
  label: "Learning Journey",
  promptRoute: "learning_journey", // must not fall through to interactive
  publishRoute: "learning_journey_page" // or equivalent LJ author-facing publish
  // acceptsCommission: omit / false — LJ does not commission LJ by default (S91-D05)
}

CREATE_DECLARATIONS += {
  value: "learning_journey",
  label: "Learning Journey",
  product: "learning_journey",
  variant: ""
}

// Example — commissionability is explicit, not implied by first-class status:
// interactive / expository / assessment_pack may set acceptsCommission: true (S91-D05)
```

- Create remains a **declaration** of a predetermined product (S89).  
- Learning Journey is **optional** — existing declarations for Interactive (self_study / workshop), Expository, Assessment Pack stay.  
- Domain Pack `canonicalSteps` are **not** the source of LJ topology (same as current first-class path).

---

## 6. Predetermined pipeline representation

Local instantiation via `buildFirstClassWorkflowFamily` when `product === "learning_journey"` (same pattern as Assessment’s dedicated builder branch):

| Stage title (production) | Artefact / role |
| ------------------------ | --------------- |
| Journey Requirements | Model stage → human-readable `learning_requirements` |
| Journey Progression | Model stage → `learning_progression` |
| Journey Elements | Model stage → `learning_elements` |
| Journey Commissioning | Model stage → `learning_commissions` |
| Design Page | **Model stage** (same continuous chat) → ordinary shared `page` (`product_id: learning_journey`) + `commissions[]`; PRISM then validates/renders/publishes |

Elicitation (Create form) supplies facts only: learners / purpose / learning time / duration / sources / constraints / optional preferences. No mandatory outcomes field. Educational reasoning begins at Journey Requirements.

Port authenticated Prompt Studio experimental prompt bodies from [JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json) (top-level current `body` only) into the sibling-prompt module with the smallest production wiring (capture keys, step ids, Adjustments surfaces). **Do not** rewrite pedagogy. **B1 resolved** — bodies are no longer an external missing input.

---

## 7. Learning Journey Design Page (GPT synthesis → deterministic consume)

In the normal Run flow, Steps 1–4 build authoritative reasoning in one continuous GPT chat. Those prose outputs are **not** pasted into PRISM as separate captures.

Step 5 Copy supplies a Learning Journey–specific Design Page prompt. GPT synthesises an ordinary shared PRISM page (`artifact_type: "page"`, `product_id: "learning_journey"`) with learner-facing `sections[].exposition` and machine-readable `commissions[]` from that conversational context. After PRISM accepts the JSON, deterministic behaviour validates, routes through the shared learner renderer, and publishes it (and exposes commission intake).

The page carries Rationale / Journey / Elements markdown (including unsupported commissions) with `assembly_state.calls_model: true`. Do not invent PRISM capture identifiers (`source_capture` / `source_captures`) under this conversational architecture.

Do **not** invent a comprehensive JSON schema beyond the minimal fields needed for:

- author HTML presentation;  
- commission intake for Create.

---

## 8. Commission → downstream Create (without hard-coding the catalogue)

### What exists today

- Assessment can start from `product_output`: reads Interactive/Expository **terminal Design Page** text (`readFirstClassProductOutput`) when `acceptsProductOutputFrom` allows.  
- That is **finished product output → Assessment**, not **commission specification → product briefing**. Keep it; do not use it as the first generic-commission proof (S91-D04).

### What Sprint 91 must add (minimal)

A **shared commission intake** used by Create:

| Field | Purpose |
| ----- | ------- |
| `productId` | Must match a declared first-class product id **and** that product must declare `acceptsCommission` (or equivalent); otherwise unsupported |
| `specificationText` | Authoritative educational commission (traceable through the product pipeline) |
| `focus` / topic seed | Populate existing Create focus |
| `sourceContext` | Optional sources / brief excerpts |
| `constraints` / `dependencies` | Pass through as briefing extras where Create already accepts seed fields |
| `journeyContextText` | Learner-facing transition text travels with the commission |
| `sourceJourneyWorkflowId` / commission id | Traceability (ingestion, not splicing) |

**First proof (S91-D04):** Learning Journey commission → shared intake → **Interactive** Create/briefing → existing Interactive pipeline.

**Resolution rule:** if `productId` is registered **and** `acceptsCommission` → open/build that product’s Create briefing with seed fields. If not registered or not commissionable → remain **unsupported** in the Journey Design Page (visible). First-class status alone is insufficient (S91-D05).

Prefer extending family declarations:

- `acceptsCommission: true` on Interactive (required for first proof), and on Expository / Assessment Pack where appropriate;  
- later Independent Task via the same flag;  
- optional `commissionStartingPoint: "commission"` (or map commission text into existing focus / authoritative_source seed — choose the smaller integration after inspecting Create briefing fields).

Avoid `if (product === 'interactive') … else if (expository) …` chains inside Learning Journey UI for every product.

### Transfer principle

> Learning Journey commissions; the product workflow designs.  
> Transfer is source/input ingestion, not workflow splicing.

---

## 9. Where Independent Task attaches

After the commission boundary works:

1. Add `independent_task` to `FIRST_CLASS_PRODUCTS` + Create declaration.  
2. Predetermined pipeline: Brief → Purposeful activity → Record → Reconnect → Design Page (titles TBD; grammar fixed).  
3. Sibling prompts + thin publish/runtime for the learner record surface.  
4. Set `acceptsCommission: true` via the same family mechanism (S91-D05).  
5. Learning Journey commissioning already emits Independent Task–shaped unsupported commissions today — once registered and commissionable, those commissions resolve to Create without LJ-specific branching.

**Not a prerequisite** for the Learning Journey reasoning vertical slice. Implement in-sprint only if still a small extension.

Definition (authoritative): frames purposeful learner activity substantially outside the product; structured place to record thinking / findings / observations / conclusions. Grammar: brief → purposeful activity → record → reconnect. Do not split into separate products per activity form.

---

## 10. Suggested implementation sequence

1. **Family registration + Create declaration + local empty/titled pipeline** (`learning_journey`; declare Interactive `acceptsCommission`).  
2. **Sibling prompt module + prompt route** so LJ ≠ Interactive fallthrough — bodies ported from authenticated export top-level `body` (S91-D03 / B1).  
3. **Design Page prompt + validate/render** — GPT same-chat Step 5 → shared `artifact_type: "page"` (`product_id: learning_journey`) + `commissions[]`; PRISM validates/renders via shared renderer; unsupported commissions remain structured — **COMPLETE** (`lib/learning-journey-design-page.js`).  
4. **Shared commission intake** — initialise **Interactive** Create from one supported commission (S91-D04).  
5. **Regression gate** — existing first-class Create paths + focused LJ tests; record in [VALIDATION.md](VALIDATION.md).  
6. **Optional:** Independent Task registration if step 4 proved the boundary is product-agnostic and remaining work is small.

---

## 11. Concrete implementation blockers (only)

| # | Blocker | Why it matters |
| - | ------- | -------------- |
| B1 | **RESOLVED (2026-10-06).** Authenticated Prompt Studio export is in-pack: [JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json). Production ports use each prompt’s **current top-level `body`** (JourneyRequirements, JourneyProgression, JourneyElements, JourneyCommissioning) — not `versions[]`. | Ported into `lib/learning-journey-sibling-prompts.js`. Export itself unmodified. |
| B2 | Interactive page-section id `learning_journey` shares a string with the product id (S91-D02). | **Not** a reason to rename the product. Implementation must disambiguate renderer/publish namespaces so section identity is not treated as product identity. |
| B3 | **No generic commission→Create briefing path exists today.** Assessment `product_output` is specialised and must not be the first proof (S91-D04). | Sprint 91 must invent a *minimal* shared intake with family-declared `acceptsCommission` (S91-D05). |
| B4 | **Unknown-product fallthrough to Interactive** (S89 Investigation 2). | Learning Journey must be recognised at each fallthrough point, or the family module must be the single resolver before LJ ships. |
| B5 | **Create brief lacks distinct learning-time / duration fields** for LJ elicitation. | Small factual field extension only — not educational reasoning. |

**Non-blockers for starting WP1 wiring after map approval:** Independent Task absence; Course Home; persistence platform; full Design Page schema; converting intermediate artefacts to JSON; Assessment Pack as first commission target.

---

## 12. Out of scope (reminder)

Interactive/Expository redesign; Assessment Pack expansion beyond transfer/integration; Course Home; programme design; generic workflow generation; Research architecture; comprehensive persistence before the slice needs it; fixed duration rules; opportunistic prompt rewrites; speculative field catalogues; fabricating experimental prompts.

---

## 13. Review decisions (resolved)

| Topic | Decision |
| ----- | -------- |
| Product id | **`learning_journey`** — S91-D02 |
| Prompt source | Authenticated Prompt Studio experimental versions only — S91-D03 |
| First commission proof | **Interactive** — S91-D04 |
| Commissionability | Family-declared `acceptsCommission` (or equivalent); LJ not commissionable by default — S91-D05 |

Production code remains blocked only by explicit go-ahead after this corrected pack; WP1 may proceed once approved without waiting for Assessment Pack or Independent Task.
