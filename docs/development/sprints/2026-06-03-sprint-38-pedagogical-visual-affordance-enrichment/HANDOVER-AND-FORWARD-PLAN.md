# Sprint 37 → Sprint 38 Handover & Forward Plan

**Date:** 2026-06-03  
**Authoritative code:** `app.js`, `tests/`, domain packs under `domains/`  
**Predecessor packs:** Sprint 37 (session framing, **COMPLETE**), Sprint 36 (visual pedagogy + placement hooks, **COMPLETE**), Sprint 35 (activity pedagogy, **COMPLETE**)

**Test floor (current):** `node --test tests/*.test.js` → **642 pass / 0 fail**

---

## 1. Current state after Sprint 37

Sprint 37 closed with **five rhetorical slices** (37-1–37-5) plus workshop recalibration (37-6):

| Layer | State |
|-------|--------|
| **Session rhetoric** | Domain §6g–6k + auto-applied blocks for orientation, tension, progression, synthesis, transfer |
| **Activity pedagogy** | Sprint 35 contracts preserved |
| **Visual placement** | Sprint 36 `.util-visual-affordance` hooks + `data-visual-slot`; VEU v1.1.1 embed rules |
| **Workshop delivery** | Inflation example: intellectual supports visible; facilitator/answer artefacts suppressed |

Sprint 37 **did not** enrich visual affordance **semantics** — only session copy and workshop visibility policy.

---

## 2. Key finding — enhancement is not the primary bottleneck

Economics **Inflation** project validation (live workshop + regenerated learner HTML + Visual Enhancement pass):

| Observation | Interpretation |
|-------------|----------------|
| Figures often **duplicate** tables or prose | Missing `reasoning_supported` / “do not repeat tabular data” |
| Visuals **assert weak or wrong relationships** | Topic-inferred diagrams without canonical economics representation |
| Outputs resemble **illustrated summaries** | No `purpose: distinction \| comparison \| framework` |
| **Too many** image opportunities | No upstream tiering tied to pedagogical job |
| VEU **placement** behaves after v1.1.1 patch | DOM contract is not the main failure mode |

**Conclusion:** Invest in **Generate better pedagogical visual affordances** upstream, not **Generate better images** downstream.

**Planning pack v2 (pre-implementation):** Affordances must support **`visual_decision: generate | defer | reject`**, **`activity_visual_value`** gating, and designer-actionable fields for generate (`must_show`, `source_basis`, `allowed_claims`, etc.). **Intentional no-visual** requires `reject` + `rejection_reason` — not silent omission. See [observations/38-4-affordance-enrichment-design.md](observations/38-4-affordance-enrichment-design.md).

---

## 3. What exists today (placement vs semantics)

### Renderer hooks (Sprint 36 — keep frozen in Sprint 38)

`utilityRenderVisualAffordanceHook(slot, options)` emits hidden block-level anchors:

- Classes: `util-visual-affordance util-visual-affordance--{slot}`
- Attributes today: `data-visual-slot`, optional `data-visual-subject`, `data-visual-activity-id`
- Slots include: `activity-after-header`, `materials-card-grid-after`, `materials-table-pair-between`, `assessment-before-checkpoint`, etc.

Regression: `tests/utility-visual-affordance-hooks.test.js`.

### Enhancement workflow (Sprint 32 utility — consume, do not redesign in 38-5)

**Authoritative repo copy:** [`utilities/visual-enhancement-utility/`](../../../../utilities/visual-enhancement-utility/) — **Visual Enhancement Utility v1.2** (`visual-enhancement-utility-v1.2.json`, unchanged export).

**Current topology (v1.2):**

1. **Create Enhanced HTML Package** — hook-based selection, enhanced HTML download, `image_queue` JSON  
2. **Generate One Image** — one queued PNG per run  

Step 1 infers opportunities from **rendered HTML** (`.util-visual-affordance` hooks) when upstream `visual_affordances[]` is absent. **38-5 not started** — alignment recommendations only; no utility redesign.

**Historical reference:** v1.1.1 three-step bundle (analyse → generate → embed) remains under [`docs/workflow/exports/`](../../workflow/exports/).

### Page JSON (gap)

Composed pages and activity materials carry rich **text** and **tables**; a first-class **`visual_affordances[]`** pedagogical brief on the page/activity is **not** consistently emitted by LD steps today. Sprint 38-4 designs that shape; 38-1 audits the gap.

---

## 4. Stable foundations to preserve

| Foundation | Detail |
|------------|--------|
| Renderer contracts | Sprint 34 golden fixture, MathJax, material markdown |
| Placement hooks | Sprint 36 slots + hidden affordance CSS |
| Session rhetoric | Sprint 37 §6g–6k blocks |
| Workshop visibility | `resolveLearnerWorkshopMaterialVisibilityPolicy` (37-6) |
| VEU embed DOM rules | No figures inside `.util-activity-header` |
| **Test floor** | **642 pass / 0 fail** |

---

## 5. Forward work (Sprint 38)

| Slice | Focus |
|-------|--------|
| **38-1** | Audit current affordance emission; inflation failure catalogue |
| **38-2** | Pedagogical purpose taxonomy + prompt rules |
| **38-3** | Purpose → representation guidance |
| **38-4** | Enriched affordance structure, QA rules, reject/generate semantics |
| **38-5** | VEU prompt handover — JSON authoritative; honour reject + claim boundaries |

**Deliverable pattern per slice:**

1. Complete `observations/38-X-….md` (templates seeded in planning pack)  
2. Update `fixtures/probe-38-*` when probes are run  
3. Prompt/domain edits documented with paths (implementation phase)  
4. Optional: passthrough enriched fields on existing hooks (38-4+)  
5. Full suite green if code or fixtures change  

**Do not** change image models, renderer layout, or VEU step count without re-charter.

---

## 6. Non-goals (Sprint 38)

- Image generation quality tuning  
- Renderer / CSS / UI redesign  
- Visual Enhancement Utility architecture replacement  
- Decorative illustration programmes  
- Sprint 32 full diagram factory (may **align** in 38-5, not reopen wholesale)  
- Weakening Sprint 36 placement tests for experimental metadata  

---

## 7. Evaluation anchors for Sprint 38

| Anchor | Path |
|--------|------|
| Inflation workshop (full) | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Inflation CSV worksheets | `tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json` |
| Climate misconception | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| CI golden | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |
| Placement regression | `tests/utility-visual-affordance-hooks.test.js` |

---

## 8. Opening prompt for 38-1

Copy into the first implementation session:

> **Context:** Sprint 38 chartered; Sprint 37 complete; **642 pass / 0 fail**.  
> **Task:** 38-1 — visual affordance audit.  
> **Review:** Render inflation fixtures + CI + climate; inspect `utilityRenderVisualAffordanceHook` output and any LD-emitted visual fields; run or simulate VEU analyse step on export HTML.  
> **Document:** What affordances contain vs what enhancement must infer; inflation failure modes (duplicate, spoiler, wrong representation, indiscriminate opportunities).  
> **Answer charter questions:** Why here? Cognitive job? Explicit or inferred purpose? Anti-spoiler explicit? LD-actionable brief?  
> **Constraints:** No renderer/CSS/image-model changes.  
> **Success:** Completed `observations/38-1-visual-affordance-audit.md` + updated `fixtures/probe-38-1-inflation-visual-affordance-audit.md`.

---

## 9. Related documentation

| Doc | Path |
|-----|------|
| Sprint 38 charter | [SPRINT-38-CHARTER.md](SPRINT-38-CHARTER.md) |
| Sprint 38 README | [README.md](README.md) |
| Sprint 37 handover (closed) | [../2026-06-03-sprint-37-session-framing-intellectual-coherence/HANDOVER-AND-FORWARD-PLAN.md](../2026-06-03-sprint-37-session-framing-intellectual-coherence/HANDOVER-AND-FORWARD-PLAN.md) |
| Sprint 36 imaging inventory | [../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md](../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md) |
| VEU v1.2 (repo) | [../../../../utilities/visual-enhancement-utility/](../../../../utilities/visual-enhancement-utility/) |
| VEU v1.1.1 (historical) | [../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md](../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md) |
