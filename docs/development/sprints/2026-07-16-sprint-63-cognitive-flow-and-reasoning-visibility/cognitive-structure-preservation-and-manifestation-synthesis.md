# Cognitive Structure Preservation & Manifestation Synthesis

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Authoritative sprint conclusion (discovery synthesis)  
**Date:** 2026-07-16  
**Status:** Complete  

**Primary inputs**

| Artefact | Role |
| -------- | ---- |
| [activity-type-system-inventory.md](activity-type-system-inventory.md) | Distributed activity-identity map |
| [cognitive-activity-manifestation-catalogue.md](cognitive-activity-manifestation-catalogue.md) | Cognitive families + Tier 1–4 confidence model |
| [cognitive-manifestation-experiment-1.md](cognitive-manifestation-experiment-1.md) | Render-time manifestation evidence (RNA A1/A2/A6) |
| [cognitive-manifestation-experiment-2-archetype-propagation.md](cognitive-manifestation-experiment-2-archetype-propagation.md) | Archetype-plan preservation evidence (enzymes mechanism) |

**Supporting artefacts:** [experiments/experiment-1/](experiments/experiment-1/), [experiments/experiment-2/](experiments/experiment-2/), Sprint 63 charter Working Hypothesis, Sprint 62 presentation slice (predecessor boundary).

**Nature of this document:** Evidence consolidation and decision thresholds only. It does **not** redesign schemas, propose production architecture, introduce new vocabularies, define Sprint 64 work items, or recommend implementation plans.

**Status note (final validation):** The architecture-investigation threshold in §11 is now **met** by [cognitive-structure-final-validation.md](cognitive-structure-final-validation.md) (cross-archetype + production-like boundary confirmation). Conceptual conclusions in §§1–10 remain authoritative; that validation artefact — not this rewrite — records Outcome A.

---

## 1. Executive Summary

### What question did Sprint 63 investigate?

Whether remaining learner friction after Sprint 62 is primarily:

* presentation / orchestration of existing content, or
* a mismatch between the cognitive process required and information explicitly available in the activity,

and whether existing pipeline signals can support differentiated cognitive manifestation without inventing instructional meaning.

### What evidence was gathered?

1. **Inventory** of all activity-identity vocabularies and their propagation/flatten points.  
2. **Catalogue** of evidence-backed cognitive families and a Tier 1–4 manifestation confidence model.  
3. **Experiment 1** — non-production Tier 2 manifestations for RNA classification, causal analysis, and evaluation.  
4. **Experiment 2** — diagnostic propagation of one authored `mechanism_explanation` plan; Tier 2 vs Tier 1 comparison on the same activity content.

### What conclusions are strongly supported?

* Activities are **not cognitively homogeneous**; a single journey grammar can hide distinct reasoning jobs.  
* Activity identity is **distributed** across multiple vocabularies; there is **no** single pedagogic activity-type SoT.  
* **Tier 2 manifestation is feasible** from render-time signals (material types + beats + episode + task/output) without schema change.  
* Gains at Tier 2 are mainly **grouping, labelling, ordering, and exposing relationships already authored**.  
* **`instructional_archetype` + `archetype_plan` contain learner-relevant structure** that does not reach the learner renderer as structured fields.  
* For `mechanism_explanation`, **`required_links` cannot be safely reconstructed** from render-time signals alone.  
* Verbatim plan surfacing (diagnostic) improved sequence, sufficiency, relationship visibility, and self-explanation **beyond** Tier 2 labelling for that case.  
* **No schema redesign** is required by Sprint 63 evidence.

### What conclusions remain tentative?

* Whether other Priority-1 archetypes (`process_walkthrough`, `mental_model_building`, `evaluation_judgement`) show the same non-recoverability pattern.  
* Whether propagation improves **measured learning outcomes** (not tested).  
* Whether Tier 2 manifestation scales across the full activity corpus (only three RNA activities + one enzymes case).  
* Whether a formal multi-reviewer blind educational panel would confirm implementer scores (panel not run).  
* What proportion of all archetype-plan fields across archetypes is learner-relevant vs authoring-only.

### What decisions are not yet justified?

* Production renderer redesign or merge of cognitive manifestations.  
* Making instructional archetypes drive production rendering.  
* New activity-type architecture or vocabulary.  
* Schema investigation as a primary next step.  
* Broad architectural commitment to a preservation mechanism.  
* Treating every activity as belonging to exactly one cognitive family.

---

## 2. Evolution of Understanding

### Initial hypothesis

From the Sprint 63 charter Working Hypothesis:

```text
Remaining friction may no longer be primarily renderer correctness or activity structure.
The next bottleneck may be a mismatch between the cognitive process learners must perform
and the information explicitly available in the activity.
```

Supporting intuitions at sprint open:

```text
Activities may not be homogeneous.
Reasoning support may be missing from rendered pages.
Sprint 62 labels improved journey coherence but applied one grammar to different cognitive jobs.
```

### Inventory findings

Activity identity is **distributed**, not centralised. The richest explicit cognitive contracts (`instructional_archetype` + `archetype_plan`) are optional, material-level, and **stop before the learner renderer**. What learners primarily experience is driven by **material types + beat functions + framing fields**. Episode archetypes exist but are often under-expressed in shortened fixture beat lists.

### Catalogue findings

Six families are strongly evidenced in repository signals; several others are weak or unsupported. Cognitive **family ≠ activity ≠ episode archetype ≠ material type**. Safe manifestation is tiered: Tier 1 needs plan availability; Tier 2 uses converging render-time signals; Tier 3–4 must stay generic.

### Experiment 1 findings

Tier 2 differentiation of A1 / A2 / A6 works. Cognitive visibility improves mainly via grouping and labelling. Deeper structure (organising principles, causal link lists, judgement criteria frameworks) is **not safely inventable** downstream. Ceiling identified: archetype plans do not reach render.

### Experiment 2 findings

For enzymes `mechanism_explanation`, structured plan is consumed by GAM then **lost as learner-reachable structure** at the GAM → assembled materials boundary. Start/outcome partially overlap task wording; **`required_links` are not recoverable**. Tier 1 (verbatim plan) produces content-structural gains Tier 2 cannot match for that case.

### Final understanding

Sprint 63’s best-supported position:

```text
PRISM already encodes more cognitive structure upstream than the learner layer receives.
Some of that structure can be manifested today by recombining render-time signals (Tier 2).
Some of that structure exists only in instructional archetype plans and cannot be safely inferred
after it is flattened into prose or omitted from assembled materials (Tier 1 gap).
The problem is not proven absence of meaning system-wide, nor proven need for a new schema —
it is uneven preservation and manifestation of existing meaning.
```

The Working Hypothesis is **partially confirmed**: presentation/orchestration problems are real and improvable without new content; **missing-information / lost-structure problems** are also real for at least one Priority-1 plan shape. Evidence does **not** yet establish which dominates across the corpus.

---

## 3. Activity Identity Findings

### What activity identity systems exist?

| Vocabulary | Production count | Role |
| ---------- | ---------------- | ---- |
| Episode archetypes | 4 (`understand` \| `apply` \| `analyse` \| `evaluate`) | Bloom / episode shell |
| Instructional archetypes | 4 Priority-1 IDs + `archetype_plan` | Material pedagogy / cognitive contract |
| Beat functions | 24 | Episode choreography |
| Pedagogical renderer beats | 10 | Material→UI family (READ, EXAMPLE, PRACTICE, …) |
| Material types (registry) | 50 | Presentation / storage format |
| Activity interaction types | 7 | Modality (sequencing, ranking, classification, …) |
| Assessment / item types | 6+ | Assessment strategy — **not** pedagogic activity kinds |

There is **no** production field `activity_type` / `activity_kind` meaning pedagogic cognitive family.

### Where does activity identity originate?

* Episode Plan → `episode_plan.archetype` + `beats[].function`  
* DLA → `required_materials[]` including optional `instructional_archetype` + `archetype_plan`  
* DLA / authoring → `learner_task`, `expected_output`, `activity_preamble`, interaction types  
* GAM → material bodies typed by `material_type`  
* Assessment steps → assessment item types (separate concern)

### Where is activity identity propagated?

* Episode archetype + beats → page compose, role fidelity, framing prompts, renderer beat grouping  
* Material types → registry / renderer UI  
* Instructional archetype + plan → **GAM routing block only** (`buildArchetypeRoutingBlock`)  
* Framing fields → learner HTML when present

### Where is activity identity flattened?

1. **Primary:** instructional archetype + plan at **GAM → assembled `materials[]`** (structured fields not attached; anti-rubric guidance discourages plan-shaped headings in prose).  
2. **Secondary:** shortened beat lists make different episode archetypes look alike (RNA A1 vs A2).  
3. **Tertiary:** renderer does not branch on instructional archetype even if `required_materials` still sits unused on a shell page.

### Which signals reach rendering?

* `material_type`, material bodies  
* `beats[].function` (+ Sprint 62 learner-facing labels)  
* `learner_task`, `expected_output`, preamble / cognition fields when authored  
* Episode archetype (weak UI; present on page)  
* Interaction types on specialised paths  

### Which signals do not?

* `instructional_archetype` as a learner/renderer branch  
* `archetype_plan` fields as structured learner-reachable data  
* Full episode template sequences when fixtures emit shortened lists  
* Docs-only instructional candidate IDs (not in production allowlist)

---

## 4. Cognitive Activity Findings

### Strongly evidenced cognitive families

| Family | Strongest existing signals |
| ------ | -------------------------- |
| Classification | `classification_table` + classify language (RNA A1) |
| Mechanism / causal explanation | `mechanism_explanation` plan SoT; RNA A2 materials at Tier 2 |
| Process walkthrough / process modelling | `process_walkthrough` plan SoT; RNA A3 materials |
| Mental-model / systems modelling | `mental_model_building` plan SoT; RNA A4 materials |
| Comparison | comparison/analysis tables + compare tasks (RNA A5) |
| Evaluation and judgement | episode `evaluate` + decision_table / template / worked_judgement (RNA A6); `evaluation_judgement` plan SoT |

### Weakly evidenced families

* Sequencing / ranking (interaction-led)  
* Transfer / application extension (beat/material overlay, not a full family)  
* Reflection / consolidation  
* Prediction (Tier 3)

### Unsupported families

Catalogue §4.11: diagnosis, design, argumentation, problem solving, retrieval — **insufficient repository evidence** to catalogue as families. Absence of evidence is not evidence of pedagogical impossibility.

### Confidence model

| Tier | Meaning | Sprint 63 status |
| ---- | ------- | ---------------- |
| **1** | Explicit instructional archetype + plan available | Exists upstream; **not** available at learner render in production; Experiment 2 showed diagnostic value when exposed |
| **2** | Converging episode + beats + materials + task/output | **Demonstrated** (Experiment 1) |
| **3** | Sparse verbs / isolated materials | Prefer generic; not used as primary experiment path |
| **4** | Unknown | Generic Sprint 62 journey only |

### Relationship between family and activity

```text
family ≠ activity
family ≠ episode archetype
family ≠ material type
```

Evidence:

* RNA A1 and A2 can share identical shortened beat lists while belonging to different families (material types + task distinguish them).  
* `analyse` episode hosts causal, process, systems, and comparison activities.  
* `analysis_table` can support causal, comparison, or systems work depending on other signals.  
* Instructional archetypes are **material-level** contracts, not activity-level enums.

---

## 5. Manifestation Findings

### What can be manifested today?

Using only assembled-page signals (Experiment 1):

* Classification-shaped journey for A1  
* Causal-shaped journey for A2  
* Evaluation-shaped journey for A6  

without changing bodies or inventing fields.

### What signals support manifestation?

Multi-signal convergence: distinctive `material_type` **plus** at least one of episode archetype, distinctive beat, or task/title verbs. **Beats alone are insufficient** to distinguish A1 from A2.

### What learner-facing improvements were observed?

Implementer educational review (not a multi-reviewer panel): typical +1 on orientation, sequence, relationships, and coherence; meaning preservation held at maximum; A6 also gained self-explanation via existing template structure.

### Which improvements required only grouping / labelling / ordering / relationship exposure?

**Almost all Experiment 1 gains.** No new instructional content was added. Explicitly:

* **Grouping** — e.g. scenario → model → decision → template  
* **Labelling** — e.g. “Classify the cases”, “Follow the causal chain”, “Weigh the options”  
* **Ordering** — foreground success criteria / model before attempt  
* **Relationship exposure** — e.g. template Claim/Reasons/Limits already authored  

### What risks were observed?

* Causal phase labels can **over-claim** relative to thin bodies.  
* Dual checklist presentation adds minor noise.  
* Inventing goals, principles, link lists, or criteria frameworks is unsafe.

### What cannot be safely manifested today?

| Element | Why |
| ------- | --- |
| Organising principle block (A1) | Not authored as a field |
| Causal `required_links` list (A2 RNA) | No plan on fixture; cannot invent |
| Evaluative decision question as “Your goal” (A6) | Inventory-style task |
| Full `evaluation_judgement` plan criteria/evidence/tradeoffs | Not on assembled page |
| Self-explanation prompts (A1/A2) | Fields absent on fixture |

---

## 6. Preservation Findings

### What instructional structure exists upstream?

For Priority-1 materials, DLA can emit validated:

```text
instructional_archetype
+ archetype_plan  (shape depends on archetype; PLAN_KEYS)
```

Experiment 2 case (`mechanism_explanation`):

```text
start
outcome
required_links[]
```

### What instructional structure reaches rendering?

* Indirectly: whatever GAM embeds in natural-language body prose (lossy, non-structured).  
* Directly as structured fields: **nothing** from the plan in production learner render paths examined.

### What instructional structure is lost?

Structured plan fields as machine-readable, learner-reachable data after GAM. Exact loss boundary: **GAM → assembled `materials[]`**.

### Recoverability analysis

| Information | Recoverable | Notes |
| ----------- | ----------- | ----- |
| `archetype_plan.start` (enzymes mechanism) | Partially | Near-duplicate wording already in `learner_task` |
| `archetype_plan.outcome` | Partially | “Rises then falls” / causal chain in task & expected_output |
| `archetype_plan.required_links[]` | **No** | Specific intervening processes not named in Tier 2 signals; inference invents meaning |
| Instructional archetype ID | Partially | Family cues in preamble/task; ID string itself not required for content |
| RNA A1 organising principle | No | Not authored as structure |
| RNA A6 judgement plan criteria | No (on RNA fixture) | Not present; checklist/table only partial proxies |

Approximate for Experiment 2 plan content: **~40%** partially recoverable (start/outcome overlap); **~60%** (`required_links`) not recoverable safely.

### Highest-value preserved information

**`required_links`** — named intervening causal processes that define the reasoning chain the learner must traverse and can be checked against.

### Lowest-value preserved information

* Archetype ID as learner content (diagnostic/planning cue more than content).  
* `start` / `outcome` when already largely present in `learner_task` (still useful as **structure**, less as novel information in this fixture).

### Why required_links mattered

Task and expected output tell the learner to use “intervening links” but **do not name them**. Without `required_links`:

* the renderer cannot scaffold the chain without inventing science;  
* self-check cannot verify the authored intervening processes;  
* relationship visibility remains abstract.

With verbatim `required_links`, Tier 1 can expose the authored chain and plan-grounded checks. That is **content-structural** improvement, not mere relabelling — and it is exactly the class of information Experiment 1 could not create safely.

---

## 7. Cognitive Structure Model

Current evidence-backed model of cognitive structure in PRISM (descriptive, not a redesign):

```text
cognitive intent
→ instructional planning
→ content generation
→ assembly
→ rendering
→ learner experience
```

| Stage | Structure that exists | Preserved? | Lost? | Manifested? |
| ----- | --------------------- | ---------- | ----- | ----------- |
| **Cognitive intent** | LO cognitive verbs; design goals; episode Bloom choice | Partially into Episode Plan | Nuance not always encoded | Rarely as learner-facing “family” |
| **Instructional planning** | Episode archetype + beats; DLA framing fields; optional instructional archetype + plan | Beats/framing often yes; plan validated on DLA row | Plan not treated as learner contract | Planning UI / prompts only |
| **Content generation (GAM)** | Plan injected into routing; RULES shape prose; material_type chosen | Meaning may enter body prose | Structured plan fields not emitted on materials | Prose only; anti-rubric headings discouraged |
| **Assembly** | `materials[]` bodies + types; beats; tasks; sometimes unused `required_materials` | Bodies, types, beats, tasks | Structured instructional contract | Raw assembled page |
| **Rendering** | Beat labels (Sprint 62); material-type UI; task/output framing | Presentation of what arrived | Anything never arrived as structure | Homogeneous journey grammar + material chrome |
| **Learner experience** | One presentation grammar; content-specific tables/templates | Visible materials | Explicit reasoning scaffold when plan-only | Cognitive family often **implicit** |

**Shared architectural understanding:**

```text
Upstream can be cognitively rich.
Mid-pipeline can consume that richness for generation.
Downstream currently manifests format and journey more than cognitive contract.
Tier 2 can re-express what arrived.
Tier 1 needs preservation of what was planned but not carried as structure.
```

---

## 8. Supported Conclusions

### Strongly Supported

* Activities are not cognitively homogeneous.  
* PRISM has no single pedagogic activity-type SoT; identity is distributed.  
* Family ≠ activity ≠ episode archetype ≠ material type.  
* Tier 2 manifestation from existing render-time signals is feasible without schema change.  
* Experiment 1 differentiation of classification / causal / evaluation is reliable when multi-signal convergence is required.  
* Tier 2 learner-facing gains are primarily grouping, labelling, ordering, and relationship exposure of authored content.  
* Instructional archetype plans encode learner-relevant reasoning structure (at least for `mechanism_explanation`).  
* Structured plan does not reach learner rendering as structured fields.  
* Some reasoning structure (`required_links`) is not safely recoverable downstream.  
* Diagnostic Tier 1 surfacing of verbatim plan fields can exceed Tier 2 gains for sequence, sufficiency, relationships, and self-explanation (single-case evidence).  
* Schema redesign is **not** justified by Sprint 63 evidence alone.

### Plausible But Not Yet Proven

* Propagation would improve measured learning outcomes.  
* `process_walkthrough`, `mental_model_building`, and `evaluation_judgement` show the same non-recoverability / value pattern.  
* Cognitive manifestation scales broadly across the corpus.  
* A multi-reviewer blind panel would confirm implementer educational scores.  
* A specific preservation mechanism is the right production response.  
* Missing-information problems dominate presentation/orchestration problems system-wide.  
* Broader architectural investigation is already warranted (see thresholds in §11).

---

## 9. Unsupported Conclusions

Sprint 63 does **not** support:

* Schema redesign is required.  
* A new activity-type architecture or vocabulary is required.  
* Instructional archetypes should drive production rendering (now).  
* Every activity belongs to one cognitive family.  
* The renderer should be rebuilt.  
* Production merge of Experiment 1/2 manifestations.  
* DLA/GAM rewrite.  
* That RNA fixtures define the full set of cognitive patterns.  
* That all plan fields are equally learner-valuable.  
* That Tier 2 alone is sufficient for all cognitive visibility needs.  
* That Tier 1 propagation alone solves friction without presentation work.  
* That inventing missing principles/criteria/links is acceptable if pedagogically desirable.

---

## 10. Open Questions

Highest-value unanswered questions (listed, not answered):

1. Do `process_walkthrough` archetypes show the same recoverability / learner-value pattern as `mechanism_explanation`?  
2. Do `mental_model_building` archetypes (relationships + constraint + contrast) behave similarly?  
3. Do `evaluation_judgement` plan fields (`criteria`, `evidence`, `tradeoffs`, `judgement_focus`) create gains beyond RNA A6’s Tier 2 scaffold?  
4. What proportion of archetype-plan information across Priority-1 shapes is learner-relevant vs authoring-only?  
5. What preservation mechanism would be most appropriate (if any) — without assuming schema change?  
6. Should manifestation decisions occur before rendering, during rendering, or only in experimental overlays?  
7. How often do production pages carry instructional archetypes vs RNA-like Tier 2-only assemblies?  
8. Would external educational reviewers confirm Experiment 1/2 visibility gains?  
9. When start/outcome already appear in `learner_task`, is structural duplication still worth preserving?  
10. Is the Working Hypothesis’s “missing information” component dominant, or co-equal with orchestration, across a broader sample?

---

## 11. Decision Framework

Evidence thresholds for **future** work categories (not a schedule; not Sprint 64 items):

### Further manifestation experiments

**Justified when:**

* additional activities show Tier 2 multi-signal convergence, **and**  
* variants can be built without inventing content, **and**  
* comparison to generic Sprint 62 grammar remains informative.

**Not justified when:**

* only Tier 3–4 signals exist, **or**  
* differentiation would require fabricating goals, criteria, or links.

### Further propagation experiments

**Justified when:**

* an authored Priority-1 plan exists, **and**  
* recovery analysis shows at least one high-value field is **not** safely recoverable, **and**  
* Tier 1 vs Tier 2 comparison uses the same underlying activity content, **and**  
* surfacing remains verbatim (no paraphrase of science).

**Not justified when:**

* plans must be synthesised, **or**  
* all plan fields are already recoverable from task/output, **or**  
* gains are only cosmetic relabelling already available at Tier 2.

*(Sprint 63: further propagation investigation meets this bar for other Priority-1 archetypes; production propagation does not.)*

### Architectural investigation

**Justified when:**

* ≥2 Priority-1 archetypes independently show non-recoverable, high learner-value plan structure, **and**  
* the loss point is confirmed on production-like assembly paths (not only fixtures), **and**  
* Tier 2 residual ceiling remains after refined manifestation experiments.

**Not yet justified by Sprint 63 alone** (single archetype deep case + inventory flatten map). Threshold not met for opening architecture design.

### Schema investigation

**Justified when:**

* required learner structure is **absent upstream** (not merely unpropagated), **and**  
* multiple families need fields that no existing vocabulary can express, **and**  
* preservation of existing DLA/plan fields has been shown insufficient.

**Not justified by Sprint 63:** required semantics for the studied case already exist as `archetype_plan`; the demonstrated problem is preservation/manifestation, not missing schema.

---

## 12. Sprint 63 Recommendation

### What has Sprint 63 demonstrated?

That cognitive structure in PRISM is **real, distributed, and unevenly preserved**; that **Tier 2 manifestation can improve reasoning visibility without new content**; and that **at least some instructional archetype-plan structure is learner-relevant, non-recoverable downstream, and educationally consequential when preserved verbatim**.

### What should happen next?

* Treat this synthesis as the authoritative Sprint 63 conclusion.  
* Keep Experiment 1 and 2 artefacts as reference evidence.  
* Further **discovery** work may include additional propagation experiments (other Priority-1 archetypes) and optional external educational review — under the thresholds in §11.  

### What should not happen next?

* Production renderer merge of cognitive manifestations.  
* Schema redesign.  
* New activity-type model.  
* Architecture redesign committed from this sprint alone.  
* Inventing instructional content to fill visibility gaps.

### What architectural position is currently best supported?

```text
Preserve and manifest existing cognitive meaning before inventing new representational systems.
Tier 2 recombination is evidenced and low-risk for experimentation.
Tier 1 preservation is evidenced for one archetype as an information problem, not yet as a production architecture.
```

**Concise close:** Sprint 63 closes as a **discovery success**: the Working Hypothesis is refined into a dual finding (presentation/orchestration **and** lost structured planning information), with clear evidence boundaries and explicit non-decisions.

---

# One-Sentence Conclusion

> Sprint 63 demonstrates that PRISM already encodes differentiated cognitive structure across distributed signals, that render-time recombination can surface some of it safely, and that instructional archetype plans hold additional learner-relevant reasoning structure—especially non-recoverable intervening links—that is currently lost between GAM and rendering without requiring schema redesign to explain the gap.
