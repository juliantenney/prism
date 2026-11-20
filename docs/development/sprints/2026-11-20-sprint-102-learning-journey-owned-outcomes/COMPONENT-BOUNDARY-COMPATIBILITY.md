# Sprint 102B — Component boundary compatibility check

**Status:** **COMPLETE** (read-only investigation slice)  
**Sprint:** 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring  
**Mode:** Read-only — **no** application / prompt / schema / validator / workflow edits  
**Depends on:** [102A findings](INITIAL-INVESTIGATION.md), [S102-D02](decisions.md#s102-d02--amend-sprint-102-assumptions)  
**Decision:** [S102-D03](decisions.md#s102-d03--component-boundary-compatibility)  
**Not this slice:** Full 102B design / contract drafting — remains incomplete pending further authorisation

---

## Objective

Verify whether **Expository, Interactive, Practice and Assessment Pack** share sufficiently consistent pipeline boundaries to support **one** commission-native entry mechanism at **Episode Plan (EP)**, bypassing GLC → MK → DLO.

**Working assumption under test:** they do.

---

## Compatibility matrix

| Boundary | Expository | Interactive | Practice | Assessment Pack |
| -------- | ---------- | ----------- | -------- | --------------- |
| **Foundation sequence** | GLC → MK → DLO → **EJP** → XD → XM → DP | GLC → MK → DLO → **EP** → DLA → GAM → LS → DP | Same as Interactive (LJ-commissioned only) | GLC → MK → DLO → **Interpret Evidence Purpose** → Elicitation → Formative Return → DP |
| **Has Design Episode Plan?** | **No** | **Yes** | **Yes** | **No** |
| **LO schema (DLO)** | Same strict `learning_outcomes[]` (`statement`, `related_concepts`, `cognitive_level`, …) | Same | Same | Same (from foundation DLO prefix) |
| **Planning-stage input** | **EJP** consumes LO (+ prefers `learning_content`; KM soft in prompt) | **EP** hard-requires structured LO capture | Same as Interactive | **Purpose** prompt: DLO LOs authoritative; maps by id in elicitation |
| **KM/GLC dependency** | **Hard bindings** when producers exist (EJP/XD/DP → LO+KM+GLC; XM → XD+GLC). Prompt prefers learning_content as richness spine | Soft after EP (DLA optional KM/GLC) | Soft after EP | Soft for planning (no EP); foundation DLO is the LO source today |
| **Downstream after planning** | EJP → XD → XM → DP (not DLA/GAM/LS) | DLA → GAM → LS → DP (progressive page from EP shell) | Same as Interactive | Elicitation → Formative → DP (assessment artefacts, not episode_plans) |
| **EP-first feasibility** | **N/A** — wrong stage name; **EJP-first** is the analogue | **Yes** (102A + C4 evidence) | **Yes** | **N/A** — **Purpose-first** is the analogue |
| **Specific exceptions** | Separate sibling prompts; hard `ensureExpositorySiblingInputBindingsForSteps`; topology test asserts no EP | Order gate EP after DLO; commission context → foundation not EP | Not in Create menu; same Interactive titles | `upstreamLearningDesignSteps` always prefixes foundation; no EP in `ASSESSMENT_PACK_STEPS` |

---

## Per-product evidence

### Interactive & Practice (shared EP pipeline)

- Titles: `INTERACTIVE_TITLES` = GLC → MK → DLO → Design Episode Plan → DLA → GAM → LS → DP — `lib/first-class-workflow-family.js` 25–34.  
- Practice reuses that topology; LJ-commissioned only — same file 1020–1052; omitted from `CREATE_DECLARATIONS` 196–235.  
- EP hard-requires upstream `learning_outcomes` — `app.js` `deriveDesignEpisodePlanCaptureJson` 15917–15926; prompt 14116.  
- Strict LO shape — `lib/workflow-artefact-json-strict.js` 198–208, 522–523.  
- Order gate: EP after DLO when both present — `app.js` 8879–8885.  
- DLA: LOs + episode_plans hard; KM/GLC optional — `lib/ld-dla-page-enrich-contract.js` ~284.  
- `ensureEpisodePlanInputBindingsForSteps` binds DLA/DP to EP page/episode_plans — **not** to KM/GLC — `app.js` 28076–28124.

**Verdict:** Literal **EP-first with structured LOs** is meaningful and mechanically coherent for both.

### Expository (parallel foundation, different middle)

- Titles: GLC → MK → DLO → **Expository Journey Plan** → Development → Materials → DP — `lib/first-class-workflow-family.js` 36–44. **No Design Episode Plan.**  
- DLO sibling uses the same LO footer/shape — `lib/expository-sibling-prompts.js` 148–150.  
- EJP authoritative inputs: LO + KM + learning_content “when present”; **prefer learning_content** over MK/LO alone — same file 157.  
- Hard bindings when producers exist — `app.js` `ensureExpositorySiblingInputBindingsForSteps` 28050–28072. If GLC/MK steps are omitted from the graph, those producers are not found and bindings for them are not added (conditional on producer id).  
- Downstream is EJP→XD→XM→DP, not DLA→GAM→LS.

**Verdict:** Cannot “enter at EP”. Commission-native analogue is **EJP-first with authoritative LOs**. Strong prompt preference for `learning_content` is soft/pedagogical unless a concrete failure appears after LO-only EJP-first — do not invent a KM stage from binding code alone when producers are absent.

### Assessment Pack (foundation prefix + different product stages)

- Product-native steps: Interpret Evidence Purpose → Design Evidence Elicitation → Author Formative Return → Design Page — `lib/first-class-workflow-family.js` 84–105.  
- Always prefixed with `upstreamLearningDesignSteps` (GLC→MK→DLO; + Normalize when authoritative source) — same file 747–757, 832–873.  
- **No Design Episode Plan.**  
- Purpose prompt: “Use the Learning Outcomes produced by Define Learning Outcomes… authoritative. Do not replace them.” — same file 623.  
- Elicitation uses `mapped_learning_outcome_ids` (ids only) — same file 671.  
- Commission context includes Interpret Evidence Purpose — `app.js` 6097–6106.  
- Publish resolves upstream `learning_outcomes` into pack — `lib/assessment-pack-publish.js` ~234–305.

**Verdict:** Cannot “enter at EP”. Commission-native analogue is **Purpose-first with authoritative structured LOs** (skip foundation prefix).

---

## Learning Journey compatibility

| Question | Finding |
| -------- | ------- |
| 1. Generate journey-level LOs in established DLO format? | **Not today.** Requirements emit prose **INTENDED LEARNING** / body of knowledge — `lib/learning-journey-sibling-prompts.js` `learning_requirements`. No `learning_outcomes` JSON artefact on the LJ pipeline. |
| 2. Use those outcomes to design progression? | Progression treats Requirements as authoritative prose — same file `learning_progression`. Structured LO allocation is not a current input contract. |
| 3. Generate component-specific outcomes per journey step? | Elements/commissions allocate **educational jobs** in prose, not DLO rows or outcome-id subsets — `learning_elements` / `learning_commissions`; Design Page commissions have no `learning_outcomes[]` — `lib/learning-journey-design-page.js` 407–417, 458–460. |
| 4. Include outcomes in commissioning briefs? | **Transport possible in text:** `specification_text` is free-form educational job/constraints. Intake stamps it to `commission_specification` — `lib/first-class-commission-intake.js` 309–330. **Representation bind missing:** intake does not materialise a `learning_outcomes` capture. |
| New data structures required? | **Not proven necessary for transport.** Existing `specification_text` (or a parseable subsection) can carry DLO-shaped JSON without a new commission field — if and only if a deterministic, non-rewriting bind step validates and stamps the existing capture name. A new structured commission key remains optional if prose proves unreliable (S102-AD-003). |

---

## Soft vs hard dependencies (summary)

| Dependency | Hard (code/topology) | Soft (prompt “when present”) |
| ---------- | -------------------- | ---------------------------- |
| Structured `learning_outcomes` → Interactive/Practice EP | Yes (derive/shell) | — |
| Structured LOs → AP Purpose | Prompt-authoritative; capture expected from DLO prefix | No Expository-style hard sibling binder |
| KM/GLC → Interactive/Practice post-EP | No | Yes (DLA optional) |
| KM/GLC/`learning_content` → Expository EJP/XD/XM | Bindings **if** producers exist | Prefer learning_content as spine |
| EP stage itself on Expository / AP | Absent | — |

---

## Recommendation

### Can all four use one shared mechanism for entering at EP with LJ-commissioned outcomes?

**No.**

The working assumption fails for a **literal** shared EP-first mechanism:

1. **Expository** and **Assessment Pack** do not have a Design Episode Plan stage.  
2. Their post-foundation pipelines diverge (EJP→XD→XM vs assessment evidence stages vs Interactive DLA→GAM→LS).  
3. Expository’s planning stage has a different hard-binding profile when foundation producers exist.

### What *is* shared (smallest accurate claim)

A shared **pattern**, not a shared EP stage:

1. Authoritative structured `learning_outcomes` in the established DLO schema.  
2. Skip child GLC → MK → DLO when those outcomes are bound without rewrite.  
3. Enter at the product’s **planning / purpose** stage:  
   - Interactive / Practice → **Design Episode Plan**  
   - Expository → **Expository Journey Plan**  
   - Assessment Pack → **Interpret Evidence Purpose**  
4. Preserve Create-from-topic foundation for products that have it; Practice remains LJ-only.

**Smallest shared implementation surface (if later authorised):** LO representation bind + foundation-omit + commission-context rebinding onto the product planning stage — with **product-specific entry titles**, not one EP-only code path.

**Do not introduce** a new outcome schema, KM stage, or mandatory readiness classifier on this evidence. Expository’s learning_content preference is noted as a **watchpoint**, not a proven requirement for a compensating knowledge-modelling stage.

### Significance of differences

| Difference | Significant? |
| ---------- | ------------ |
| No EP on Expository / AP | **Yes** — blocks one EP-entry mechanism |
| Interactive/Practice share EP→DLA→… | **No** — they can share EP-first |
| Expository hard bindings when GLC/MK present | **Yes for Create topology**; **conditional** if foundation omitted |
| AP purpose vs EP shell/derive | **Yes** — different capture/publish contracts |

---

## Explicitly incomplete (full 102B design)

This slice answers boundary compatibility only. Still pending for full 102B (when authorised):

- Journey-owned outcome contract design (where/how DLO-shaped authority is authored)  
- Exact representation-bind mechanism  
- Product-scoped rollout order  
- Design approval gates for implementation

**Stop.** No code changes. No regeneration. No commit/push.
