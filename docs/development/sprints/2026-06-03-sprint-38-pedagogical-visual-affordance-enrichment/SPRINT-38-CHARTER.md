# Sprint 38 charter — Pedagogical Visual Affordance Enrichment

**Pack path:** `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/`  
**Status:** **CHARTERED** — slices 38-1–38-5 proposed, not yet executed  
**Date:** 2026-06-03  
**Test floor (entry):** **642 pass / 0 fail**

---

## 1. Rationale

Sprints 34–37 established **stable rendering**, **instructionally intentional activities**, **visually choreographed pages**, and **session-level intellectual framing**.

Downstream **Visual Enhancement** (Sprint 32 utility, VEU v1.1.1) can place figures correctly in the DOM yet still produce **pedagogically weak** visuals when upstream affordances only signal **topic** and **slot**, not **cognitive job**, **representation type**, or **spoiler boundaries**.

Economics Inflation validation showed:

- Enhancement utility behaviour is **adequate** relative to placement contracts.
- **Affordance briefs** are often **too shallow** for discipline-faithful instructional diagrams.
- Enhancement therefore **reconstructs intent from page prose**, encouraging topic posters, duplicated summaries, and unsupported causal claims.

Sprint 38 addresses **upstream affordance generation and semantics** — not image models.

---

## 2. Core questions

> Can a human learning designer create the right instructional diagram from the affordance alone — without reading the full page?

> When no visual is appropriate, is that an **intentional pedagogical decision** — not an omission?

Not: “Should we add more images?”  
But: “For each reviewed activity, does the compose output state **generate**, **defer**, or **reject** — with rationale when rejecting?”

And for every `visual_decision: generate` affordance: **why** it exists, **what thinking** it supports, **what it must and must not show**, **what claims are allowed**, and **what representation** is canonical for this discipline.

---

## 3. Pedagogical principles

1. **Purpose before topic** — Every affordance expresses a pedagogical purpose (e.g. distinction, comparison), not only a subject label.
2. **Intentional rejection** — `visual_decision: reject | defer | generate` is a **first-class authored outcome**. Absence of a visual is insufficient; each reviewed activity records why a figure would not help.
3. **Activity value gate** — `activity_visual_value` (high / medium / low / none) gates whether compose even considers figures (warm-ups, narrative-only, debriefs, table-sufficient activities → often **none**).
4. **Representation discipline** — Prefer instructional diagrams, matrices, process flows, and canonical disciplinary forms over decorative illustration.
5. **Spoiler boundaries** — `anti_spoiler` plus structured `spoiler_boundary` (hide answers, keys, model solutions; allow structural hints when appropriate).
6. **Discipline fidelity** — `canonical_form_required`, `discipline_risk_level`, and `requires_subject_expert_review` for high-risk or quantitative visuals; no invented values or unsupported causal claims.
7. **Designer-actionable generate briefs** — `must_show`, `must_not_show`, `allowed_claims`, `disallowed_claims`, `source_basis`, `learner_prompt_connection` for `tier: essential | valuable`.
8. **Enhancement-ready handover** — Enriched JSON is **authoritative** over HTML topic inference; VEU must honour `visual_decision: reject` and cite `rejection_reason`.
9. **Contract respect** — Sprint 36 placement hooks and tests remain the DOM floor; enrichment is **semantic payload**, not layout rework.

---

## 4. In scope

- Observation-led audit of current affordance emission (38-1)
- Pedagogical purpose taxonomy and prompt-rule recommendations (38-2)
- Purpose → representation mapping (38-3)
- Enriched affordance schema / field design and implementation recommendations (38-4)
- Visual Enhancement workflow consumption guidance — prompts only, no model tuning (38-5)
- Probe fixtures under `fixtures/`
- Targeted prompt/domain pack edits on **Design Page**, **Generate Activity Materials**, and related LD compose steps (post–38-4)
- Small **test additions** only when affordance shape is stable (e.g. required `purpose` on emitted affordance objects)

---

## 5. Out of scope

| Item | Reason |
|------|--------|
| Image generation model / provider changes | Charter constraint |
| Renderer layout or CSS changes | Sprint 36 closed; default **no** |
| Visual Enhancement Utility step topology redesign | 38-5 adjusts assumptions, not architecture |
| New workflow steps (unless 38-4 proves minimal compose sub-field only — document, do not assume) | Minimise churn |
| Decorative / aesthetic tuning | Opposes instructional diagram bar |
| Sprint 32 full diagram orchestration | Separate programme |
| Reopening Sprint 37 session rhetoric | Unless alignment note in 38-5 |

**Renderer exception:** Passthrough of enriched affordance metadata on existing `.util-visual-affordance` hooks (`data-*` attributes or JSON in `hidden` hook) — only if 38-4 design requires it, slice-documented, placement tests green.

---

## 6. Success criteria

1. **Documented audit** (38-1) answering the five review questions on inflation + two quantitative/humanities anchors.
2. **Purpose taxonomy** (38-2) where every affordance type maps to ≥1 allowed purpose — topic-only affordances classified as **defect**.
3. **Representation guidance** (38-3) linking purposes (including quantitative-reading purposes) to diagram families and anti-patterns.
4. **Enrichment design** (38-4) where a competent learning designer can **generate or reject** from the affordance alone — without reading the full page.
5. **Explicit rejection** — `visual_decision: reject` with `rejection_reason` documented; decorative rejection is authored, not implied by missing hooks.
6. **Workflow alignment** (38-5) — VEU analyse treats enriched JSON as authoritative; honours reject decisions; respects claim boundaries.
7. **QA rules** documented for compose/validation (see §12).
8. **642+ pass / 0 fail** on every slice that touches code or fixtures.
9. Explicit **rejected scope creep** per slice.

**Preferred order:** observation → taxonomy/guidance → design → prompt/domain implementation → optional renderer passthrough → workflow prompt patch.

---

## 7. Proposed slices

| Slice | Title | Primary deliverable | Success criterion |
|-------|-------|---------------------|-------------------|
| **38-1** | Visual affordance audit | `observations/38-1-visual-affordance-audit.md` | Failure modes on inflation documented with infer-vs-explicit matrix |
| **38-2** | Affordance purpose taxonomy | `observations/38-2-visual-purpose-taxonomy.md` | Every affordance must express purpose, not merely topic |
| **38-3** | Representation guidance | `observations/38-3-representation-guidance.md` | Appropriate representation type indicated per purpose |
| **38-4** | Affordance enrichment design | `observations/38-4-affordance-enrichment-design.md` | Generate/reject brief sufficient for human designer |
| **38-5** | Workflow alignment | `observations/38-5-workflow-alignment.md` | VEU honours reject + claim boundaries; JSON authoritative |

Each slice ends with:

1. Completed or updated observation markdown  
2. Prompt/domain diff paths documented (when implementation starts)  
3. `node --test tests/*.test.js` → 0 fail (if code touched)  
4. Rejected scope creep section filled  

---

## 8. Review lenses (38-1 audit)

Use all five when scoring affordances **Pass / Partial / Fail**:

| Question | Pass indicator |
|----------|----------------|
| Why is this visual here? | `purpose` + `reasoning_supported` explicit |
| What cognitive job should it perform? | Maps to taxonomy category with verbs (compare, classify, trace mechanism…) |
| Is purpose explicit or inferred? | Explicit in affordance object / hook metadata — not scraped from heading text |
| Is anti-spoiler intent explicit? | `anti_spoiler` + `spoiler_boundary` when before learner submission / classification |
| Would a human LD know what to create? | `must_show` / `must_not_show` + `preferred_representation` + `source_basis` — or explicit `visual_decision: reject` |
| Is “no visual” intentional? | `activity_visual_value.decision: none` or affordance `visual_decision: reject` with `rejection_reason` |

---

## 9. Anti-patterns (reject in generation)

Emit `visual_decision: reject` with an appropriate `rejection_reason` (do not leave the activity visually “empty” without a decision record).

| Anti-pattern | `rejection_reason` (typical) |
|--------------|------------------------------|
| Topic poster / hero image | `decorative_only` |
| Generic infographic summarising prose | `duplicate_existing_material` |
| Visual that reveals worksheet answers | `spoiler_risk` |
| Unsupported quantitative claims | `insufficient_source_basis` or `non_canonical` |
| Non-canonical metaphor replacing standard diagram | `non_canonical` |
| Duplicate of existing table | `duplicate_existing_material` |
| Warm-up / debrief with no cognitive gain | `low_value_activity` |
| Narrative-only section | `low_value_activity` |

**Not sufficient:** omitting hooks or affordances without `visual_decision` and rationale.

---

## 10. Compose / validation QA rules (38-4 implementation)

Validation or compose QA should **fail** when:

| Condition | Action |
|-----------|--------|
| `purpose` missing on any affordance record | Fail |
| `visual_decision` missing on any affordance record | Fail |
| `visual_decision: generate` without designer-actionable fields (38-4 required set for `essential` / `valuable`) | Fail |
| Affordance only restates `topic` or activity `title` | Fail |
| `tier: decorative-rejected` listed as a **generation** opportunity (should be `visual_decision: reject`) | Fail |
| Quantitative visual (`discipline_risk_level: high` or stats/econ purpose) without `requires_exact_data_match` | Fail |
| Activity reviewed but no `activity_visual_value` | Fail |
| `activity_visual_value.decision: none` yet `visual_decision: generate` present | Fail |

---

## 11. Regression and anchors

**Command:**

```bash
node --test tests/*.test.js
```

**Floor:** Maintain **642+ pass / 0 fail** unless new affordance-contract tests are added with passing assertions.

**Do not** weaken Sprint 34 golden CI, Sprint 36 affordance placement tests, or Sprint 37 rhetorical contracts.

---

## 12. Related documentation

| Doc | Path |
|-----|------|
| Sprint 38 README | [README.md](README.md) |
| Sprint 38 handover | [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) |
| Sprint 37 handover (closed) | [../2026-06-03-sprint-37-session-framing-intellectual-coherence/HANDOVER-AND-FORWARD-PLAN.md](../2026-06-03-sprint-37-session-framing-intellectual-coherence/HANDOVER-AND-FORWARD-PLAN.md) |
| Sprint 36 affordance placement | [../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md](../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md) |
| VEU v1.1.1 patch note | [../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md](../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md) |
| Observations template | [observations/README.md](observations/README.md) |
