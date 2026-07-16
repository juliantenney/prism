# Cognitive Manifestation Experiment 2

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Non-production propagation experiment + educational review  
**Date:** 2026-07-16  
**Status:** Complete (discovery)

**Artefacts:** [experiments/experiment-2/](experiments/experiment-2/)  
**Predecessor:** [cognitive-manifestation-experiment-1.md](cognitive-manifestation-experiment-1.md)  
**Evidence bases:** [activity-type-system-inventory.md](activity-type-system-inventory.md) · [cognitive-activity-manifestation-catalogue.md](cognitive-activity-manifestation-catalogue.md)

---

## 1. Objective

Determine whether `instructional_archetype` and `archetype_plan` contain learner-relevant reasoning structure that is currently lost before rendering, and whether preserving that structure produces meaningfully better cognitive manifestation than Tier 2 inference alone.

This is a **propagation experiment**, not a renderer redesign, schema redesign, or production feature.

Primary question:

> Does the information currently lost between GAM and rendering contain useful reasoning structure that cannot be safely reconstructed from render-time signals?

---

## 2. Activity Selection

### Preference order applied

1. **RNA A2** — rejected: assembled RNA fixture has **no** `instructional_archetype` / `archetype_plan` on materials (Experiment 1 ceiling). Cannot run a Tier 1 comparison without inventing a plan.
2. **Enzymes A2 `mechanism_explanation`** — selected: strongest authored Priority-1 mechanism plan in repository fixtures, with validated transfer path (Sprint 59 manual mechanism test PASS).

### Selected case

| Field | Value |
| ----- | ----- |
| Domain | Enzymes and Reaction Rates |
| Activity | `A2` |
| Material | `A2-M1` |
| Instructional archetype | `mechanism_explanation` |
| Episode (experimental Tier 2 signal) | `analyse` |

### Authoritative plan sources (identical values)

- `docs/development/sprints/2026-07-15-sprint-60-instructional-archetype-operationalisation/artefacts/mixed-archetype-acceptance/dla-mixed-priority1.page.json` (A2)
- `docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/artefacts/enzymes-archetype-mvp/mechanism-explanation.required-material.json`
- `lib/ld-instructional-archetype.js` → `ENZYMES_MECHANISM_TEST_PLAN`

### Selection rationale

- Matches recommended candidate (`mechanism_explanation`).
- Plan is **authored**, not synthetic.
- Single activity / single archetype / single propagation path.
- Alternative `process_walkthrough` (A4 on same mixed page) deferred — mechanism is the strongest “reasoning structure lost” case because intervening links are specific and non-obvious from task wording alone.

### Shared activity content (both variants)

| Signal | Authored value |
| ------ | -------------- |
| `learner_task` | Explain why reaction rate rises then falls as temperature increases within and beyond the enzyme's stable range. |
| `expected_output` | A causal chain account connecting temperature change to rate outcome via intervening links. |
| `activity_preamble` | You will explain the temperature–rate relationship as a transmitting process. |
| `purpose` / body stand-in | Teach how temperature affects enzyme reaction rate through a causal chain. |

No GAM-realised prose was invented for this experiment. Body stand-in = authored `purpose` only.

---

## 3. Archetype Trace

### Pipeline

```text
source (fixture / DLA emission)
→ DLA (required_materials row)
→ GAM (routing block consumes plan → material body)
→ assembled page (materials[] without plan)
→ renderer (no plan consumer)
```

### Stage table

| Stage | instructional_archetype | archetype_plan | Present? | Consumed? |
| ----- | ----------------------- | -------------- | -------- | --------- |
| **Source fixtures** | `mechanism_explanation` | start / outcome / required_links (see §4) | Yes | Authoring / test only |
| **DLA page** | On `required_materials[]` | Full object on same row | Yes | Planning SoT; validated |
| **GAM prompt** | Injected as routing line | JSON in routing block | Yes | **Yes** — drives body generation rule |
| **GAM material output** | Not required on body | Not attached to body | No as structured fields | Implicitly “baked into” prose (lossy) |
| **Assembled `materials[]`** | Absent (RNA & preserve path) | Absent | No | No |
| **Assembled `required_materials[]`** | May still exist on shell pages | May still exist if DLA row retained | Sometimes | **Not read by learner renderer** |
| **Renderer / manifestation** | Absent | Absent | No | No |

### Exact loss point

**Structured plan disappears as learner-reachable data at the GAM → assembled materials boundary.**

1. DLA emits plan on `required_materials[]` (`lib/ld-dla-page-enrich-contract.js` guidance; validation in `lib/ld-instructional-archetype.js` `validateMaterialArchetypePlan` / `PLAN_KEYS`).
2. GAM receives plan via `buildArchetypeRoutingBlock()` → prompt lines `instructional_archetype=…` + `archetype_plan: {…}` + `RULES.mechanism_explanation`.
3. GAM is instructed to realise intervening links in **natural prose** and **not** emit Cause:/Mechanism:/Outcome: rubric headings (`RULES` anti-label guidance).
4. Post-GAM `materials[]` hold body text; `page-gam-materials-preserve.js` and `page-render-normalize.js` have **no** `archetype_plan` / `instructional_archetype` handling.
5. `ld-instructional-manifestation-render.js` does **not** reference these fields.
6. Learner renderer therefore cannot surface start / outcome / required_links as structure — even if `required_materials` still sits on the page object unused.

### Citations

| Role | Location |
| ---- | -------- |
| Contract / schema guidance | `lib/ld-dla-page-enrich-contract.js` (mechanism_explanation plan shape) |
| SoT + routing + validation | `lib/ld-instructional-archetype.js` (`PLAN_KEYS`, `buildArchetypeRoutingBlock`, `RULES`, `ENZYMES_MECHANISM_TEST_PLAN`) |
| Preserve / normalize | `lib/page-gam-materials-preserve.js`, `lib/page-render-normalize.js` (no archetype consumers) |
| Manifestation render | `lib/ld-instructional-manifestation-render.js` (no archetype consumers) |
| Inventory confirmation | `activity-type-system-inventory.md` (flatten finding) |

---

## 4. Archetype Plan Analysis

### Archetype

```text
mechanism_explanation
```

### Plan fields (verbatim — not paraphrased)

```json
{
  "start": "temperature increases within and beyond the enzyme's stable range",
  "outcome": "reaction rate first increases and then decreases",
  "required_links": [
    "molecular kinetic energy and collision frequency",
    "enzyme-substrate complex formation",
    "disruption of enzyme structure at high temperature"
  ]
}
```

(`PLAN_KEYS.mechanism_explanation` = `["start", "outcome", "required_links"]`.)

### Field-by-field learner relevance

| Field | Authored value (summary) | Learner-relevant? | Classification |
| ----- | ------------------------ | ----------------- | -------------- |
| `start` | temperature increases within and beyond the enzyme's stable range | Yes — names the causal starting condition | **learner-visible** (if surfaced); also planning |
| `outcome` | reaction rate first increases and then decreases | Yes — names the target effect pattern | **learner-visible** / planning |
| `required_links[0]` | molecular kinetic energy and collision frequency | Yes — names a required intervening process | **learner-visible** (scaffold) / planning |
| `required_links[1]` | enzyme-substrate complex formation | Yes — same | **learner-visible** / planning |
| `required_links[2]` | disruption of enzyme structure at high temperature | Yes — same | **learner-visible** / planning |
| `instructional_archetype` | mechanism_explanation | Indirect — orientation label, not content | **planning-only** as ID; useful as diagnostic family cue |

No purely authoring-only fields in this three-field plan. Purpose/specification on the material row are authoring artefacts **outside** the plan object (not analysed as plan fields).

---

## 5. Information Recovery Analysis

Attempt to reconstruct plan fields from **Tier 2 render-time signals only** (episode, preamble, learner_task, expected_output, purpose, material type). No use of `debug_instructional_contract`.

| Plan Field | Recoverable From Render-Time Signals? | Confidence | Notes |
| ---------- | ------------------------------------- | ---------- | ----- |
| `start` | **partially** | High | Learner_task already contains nearly the same clause (“as temperature increases within and beyond the enzyme's stable range”). Distinct *field* not present; content largely duplicated. |
| `outcome` | **partially** | High | Task says “rises then falls”; plan says “first increases and then decreases”. Same idea; exact plan wording not required for rough recovery. |
| `required_links[0]` | **no** | High | Not named in task, expected_output, preamble, or purpose. Inferring it invents domain content. |
| `required_links[1]` | **no** | High | Same. |
| `required_links[2]` | **no** | High | Same. |
| Archetype ID | **partially** | Medium | “Causal chain” / “transmitting process” strongly suggest mechanism family; ID string itself not needed for manifestation if structure is present. |

### Critical answers

| Question | Answer |
| -------- | ------ |
| Could the renderer infer `required_links`? | **No**, not safely. |
| Could a reviewer infer them from task alone? | Only by **domain expertise invention**, not from authored render signals. |
| Would inference risk invented meaning? | **Yes** — naming specific molecular steps without an authored list invents instructional content. |

### Recoverability summary

- **Plan fields:** 3 top-level keys; of informational units (start + outcome + 3 links = **5**), **0 fully recoverable as distinct structure**, **2 partially recoverable as paraphrased content**, **3 not recoverable**.
- **Approximate recoverable share of plan information content:** **~40%** (start + outcome as overlapping task paraphrase).  
- **Non-recoverable share (distinctive intervening structure):** **~60%** (`required_links`).

---

## 6. Experimental Propagation

Diagnostic-only artefact (no production renderer changes):

[experiments/experiment-2/experimental-assembled-page.json](experiments/experiment-2/experimental-assembled-page.json)

Exposes:

```json
activity.debug_instructional_contract = {
  "material_id": "A2-M1",
  "instructional_archetype": "mechanism_explanation",
  "archetype_plan": { ...verbatim... }
}
```

Also mirrors Tier 2 signals under `experimental_metadata.tier2_signals`.

**Objective:** visibility for T1 manifestation. **Not** production implementation.

---

## 7. Tier 2 Manifestation

**Artefact:** [experiments/experiment-2/variant-T2-tier2-only.html](experiments/experiment-2/variant-T2-tier2-only.html)

Aligned with Experiment 1 causal grammar, using enzymes A2 Tier 2 signals only:

- Orientation ← preamble  
- Your goal ← learner_task  
- Success looks like ← expected_output  
- Start with the mechanism ← purpose stand-in; **no** start field  
- Follow the causal chain ← generic placeholders; **unnamed** intervening links  
- Test your explanation ← expected_output shape only  

Explicit exclusions note missing `archetype_plan` structure (same honesty pattern as Experiment 1 C2).

---

## 8. Tier 1 Manifestation

**Artefact:** [experiments/experiment-2/variant-T1-with-archetype-plan.html](experiments/experiment-2/variant-T1-with-archetype-plan.html)

Same shell as T2, plus **verbatim** plan surfacing:

| Manifestation Element | Source Field | Safe? |
| --------------------- | ------------ | ----- |
| Starting condition box | `archetype_plan.start` | yes |
| Ordered link list item 1 | `required_links[0]` | yes |
| Ordered link list item 2 | `required_links[1]` | yes |
| Ordered link list item 3 | `required_links[2]` | yes |
| Outcome box | `archetype_plan.outcome` | yes |
| Plan-based self-check bullets | start + links + outcome | yes |
| Meta archetype id | `instructional_archetype` | yes (diagnostic) |

No paraphrased science; no invented links.

---

## 9. Learner-Relevant Differences

### Difference 1 — Named starting condition as structure

| | |
| - | - |
| **What changed?** | T1 shows a distinct “Starting condition” block with plan.start. T2 only has overlapping wording inside the goal sentence. |
| **Information source** | `archetype_plan.start` |
| **Learner value** | Minor–useful for **reasoning orientation** and **sequence** (start of chain). Overlap with task limits novelty. |
| **Risk** | Low if verbatim; medium if rephrased into stronger claims. |

### Difference 2 — Named outcome as structure

| | |
| - | - |
| **What changed?** | T1 shows outcome as the chain terminus. T2 relies on “rises then falls” in the goal. |
| **Information source** | `archetype_plan.outcome` |
| **Learner value** | Minor–useful for **output clarity** / **self-explanation** target. Partially redundant with task. |
| **Risk** | Low. |

### Difference 3 — Named intervening links (decisive)

| | |
| - | - |
| **What changed?** | T1 lists the three authored intervening processes. T2 cannot name them without invention. |
| **Information source** | `archetype_plan.required_links` |
| **Learner value** | **Substantial** for **relationship visibility**, **reasoning sequence**, **information sufficiency**, and **self-explanation** (checkable chain). Directly addresses Experiment 1 ceiling. |
| **Risk** | Low if listed as authored scaffold; **High** if GAM/renderer paraphrases into new links. Overstatement risk if presented as the *only* possible science rather than the *required* authored chain for this activity. |

### Difference 4 — Plan-grounded self-check

| | |
| - | - |
| **What changed?** | T1 checklist quotes plan strings; T2 checklist is generic “use intervening links.” |
| **Information source** | start + required_links + outcome |
| **Learner value** | Useful–substantial for **self-explanation** and **coherence**. |
| **Risk** | Low if quotes remain verbatim. |

---

## 10. Educational Review

| Dimension | Tier 2 | Tier 1 | Difference |
| --------- | ------ | ------ | ---------- |
| Reasoning orientation | Good (preamble + causal framing) | Slightly clearer (explicit start) | Small |
| Reasoning sequence | Weak (unnamed links) | Strong (ordered authored links → outcome) | **Large** |
| Information sufficiency | Insufficient for complete chain | Sufficient for authored chain | **Large** |
| Relationship visibility | Abstract “intervening links” | Concrete named relationships | **Large** |
| Output clarity | Good (expected_output) | Better (outcome + check against links) | Medium |
| Self-explanation support | Generic | Plan-checkable | **Large** |
| Coherence | Causal grammar present | Grammar + content scaffold aligned | Medium–Large |
| Meaning preservation | Preserves task meaning; cannot preserve plan meaning | Preserves plan meaning verbatim | **Large** (plan-specific) |

**Relative to Experiment 1:** Experiment 1 gains were mainly **grouping/labelling**. Experiment 2 gains (when plan exists) are **content-structural** — especially `required_links` — not achievable by Tier 2 manifestation alone for this case.

---

## 11. Propagation Cost Assessment

Assessment only — **no implementation recommendation**.

| Risk / cost | Level | Notes |
| ----------- | ----- | ----- |
| **Technical cost** | **Low–Medium** | Carry `debug_instructional_contract` or equivalent from DLA row onto activity/material for diagnostic/learner paths; avoid schema redesign. |
| **Semantic risk** | **Low** (verbatim) / **High** (if paraphrased or inferred) | Verbatim surfacing is safe; regenerating links from body is not. |
| **Coupling risk** | **Medium** | Renderer or presentation layer would know about instructional-archetype plan shape. |
| **Maintenance risk** | **Medium** | Four Priority-1 plan shapes; manifestation must stay field-faithful per archetype. |

---

## 12. Findings

### Required answers

1. **What instructional information is currently lost?**  
   Structured `instructional_archetype` + `archetype_plan` (`start`, `outcome`, `required_links`) as machine-readable learner-reachable fields after GAM. At most, meaning may survive diffusely inside generated prose.

2. **Can that information be reconstructed safely?**  
   **Partially** for start/outcome (already in task). **No** for `required_links` without inventing domain content.

3. **Which plan fields create learner value?**  
   **`required_links`** (highest). Then `outcome` and `start` (useful but partially redundant with task in this fixture).

4. **Which plan fields are purely authoring artefacts?**  
   None of the three plan keys are purely authoring-only in this case. The archetype **ID** is primarily planning/diagnostic. Material `purpose` / `specification` (outside plan) remain authoring artefacts.

5. **What cognitive improvements require propagation?**  
   Named intervening-link scaffold; plan-grounded self-check; relationship visibility for the mechanism chain.

6. **Which improvements are already achievable with Tier 2?**  
   Causal orientation, goal framing, expected-output shape, Experiment 1-style phase labelling — without naming specific links.

7. **Is archetype-plan propagation educationally justified?**  
   **Yes, for further investigation** on cases where `required_links` (or equivalent non-recoverable structure) exist — gains exceed Experiment 1’s labelling gains for this activity.

8. **Is it technically proportionate?**  
   **Yes for continued experiments** (diagnostic carry-forward). Not yet proportionate as a production feature without more cases.

9. **Does evidence support broader propagation experiments?**  
   **Yes** — next: one `process_walkthrough` and/or `mental_model_building` case with the same recovery test. Do not generalise production yet.

10. **Does any schema change appear necessary?**  
    **No.** Experimental / optional carry of existing DLA fields is sufficient to continue investigation. Do not recommend schema redesign from this experiment.

---

## 13. Recommendation

Per decision rules:

| Rule | Result |
| ---- | ------ |
| Most plan fields recoverable? | **No** — `required_links` are not |
| Learner benefit marginal? | **No** — large gains on sequence, sufficiency, relationships, self-explanation |
| Gains primarily Tier 2? | **No** — decisive gains require plan |
| Meaningful structure only in plans + unsafe to recover + gains > Exp 1 + low semantic risk if verbatim? | **Yes** |

**Recommend:** further **propagation investigation** (Experiment 2b / catalogue Experiment 3 scope) on additional archetypes — **not** production merge, **not** schema redesign, **not** architecture commitment yet.

**Do not recommend:** production renderer consumption, DLA/GAM logic changes beyond experimental artefacts, or schema changes.

---

## Artefact index

| Artefact | Path |
| -------- | ---- |
| Experimental page | `experiments/experiment-2/experimental-assembled-page.json` |
| Variant T2 | `experiments/experiment-2/variant-T2-tier2-only.html` |
| Variant T1 | `experiments/experiment-2/variant-T1-with-archetype-plan.html` |
| Folder README | `experiments/experiment-2/README.md` |
