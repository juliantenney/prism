# Sprint 63 — Authoritative Findings

**Status:** Frozen  
**Closed:** 2026-07-16  
**Full close-out:** [sprint-63-closeout.md](sprint-63-closeout.md)  
**Interpretation:** [cognitive-structure-preservation-and-manifestation-synthesis.md](cognitive-structure-preservation-and-manifestation-synthesis.md)  
**Validation:** [cognitive-structure-final-validation.md](cognitive-structure-final-validation.md)

This is the canonical short reference for **what Sprint 63 actually proved**. Prefer this over re-deriving conclusions from experiments.

---

## Strongly Supported Findings

1. Activities are not cognitively homogeneous; a single journey grammar can hide distinct reasoning jobs.  
2. Activity identity is distributed; there is no single pedagogic activity-type SoT.  
3. Cognitive family ≠ activity ≠ episode archetype ≠ material type.  
4. Tier 2 manifestation from render-time signals is feasible without schema change.  
5. Tier 2 gains are primarily grouping, labelling, ordering, and exposing authored relationships.  
6. Priority-1 `archetype_plan` fields encode learner-relevant intermediate reasoning structure.  
7. Structured plans do not reach the learner renderer as structured fields.  
8. High-value structure is not safely recoverable downstream for at least: `required_links`, process `stages`, mental-model `key_relationships` / `governing_constraint`.  
9. The loss boundary is **GAM → assembled `materials[]`** (recurring production-path property).  
10. Architecture investigation of preservation/manifestation is justified; schema redesign is not.

---

## Findings Requiring Further Investigation

1. Smallest viable preservation mechanism and attachment point.  
2. Smallest viable manifestation contract (what reaches the learner layer, how).  
3. Whether `evaluation_judgement` shows the same non-recoverability pattern.  
4. Frequency of Priority-1 plans on live production pages vs RNA-like Tier-2-only assemblies.  
5. Measured learning-outcome effects of preservation (not tested).  
6. Multi-reviewer educational confirmation of Experiment 1–3 scores.

---

## Unsupported Conclusions

* Schema redesign is required.  
* A new activity-type architecture is required.  
* Instructional archetypes should already drive production rendering.  
* Every activity belongs to exactly one cognitive family.  
* The renderer should be rebuilt.  
* Production merge of experimental manifestations is authorised.  
* Tier 2 alone solves all reasoning-visibility needs.  
* Tier 1 propagation alone solves friction without presentation work.

---

## Explicit Non-Decisions

Sprint 63 made **no decision** to:

* redesign schemas  
* implement production propagation of `instructional_archetype` / `archetype_plan`  
* redesign or rewrite the production renderer for cognitive families  
* introduce a new activity-type architecture or vocabulary  

These remain **not approved** unless a later sprint explicitly authorises them after investigation.
