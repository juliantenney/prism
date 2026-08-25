# Completeness Validation Specification — Alpha 1.0

**Sprint 78**  
**Status:** Implementation specification  
**Scope:** PRISM Alpha 1.0

## 1. Purpose

Completeness Validation determines whether the instructional design commissioned by PRISM has been structurally fulfilled and preserved through the generation pipeline.

It answers:

> **Did every required part of the designed resource get commissioned, generated, correctly referenced, and carried forward to the assembled resource?**

Completeness Validation is **not a quality score**. It does not determine whether generated content is pedagogically good, accurate, elegant or engaging. Those judgements belong to QA and later semantic-conformance work.

Alpha 1.0 Completeness Validation is deliberately deterministic wherever possible.

---

## 2. Core principle

PRISM stages do not produce equivalent representations of the resource.

Each stage owns particular decisions and may legitimately enrich the resource within that authority.

Therefore:

> **Conformance means preservation and fulfilment of upstream authority, not structural equality between artefacts.**

A downstream artefact may contain considerably more information than its upstream source without violating conformance.

The validator must therefore understand **stage ownership and contractual relationships**, rather than comparing JSON structures for equality.

---

## 3. Pipeline model

For Alpha 1.0 the relevant lineage is:

    Learning Outcomes
            ↓
    Episode Plan
            ↓
    Detailed Learning Activities
            ↓
    Generate Activity Materials
            ↓
    Learning Sequence
            ↓
    Design Page
            ↓
    Assembly / Renderable Page

The primary completeness boundary is:

    DLA → GAM → downstream preservation → assembled resource

LO → EP and EP → DLA provide upstream context but are not the principal target of Alpha 1.0 Completeness Validation.

---

## 4. Authority model

### Episode Plan

EP establishes instructional intent through:

- activity identity;
- learning-outcome mapping;
- activity archetype;
- instructional beats/functions.

EP does **not** need to specify final materials, learner response surfaces or generated content.

### Detailed Learning Activities

DLA converts instructional intent into operational learning-design contracts.

It may establish:

- learner tasks;
- expected learner outputs;
- production requirements;
- required materials;
- material identities and types;
- material instructional roles;
- response/workspace requirements;
- evidence requirements;
- evidence providers;
- independent-practice operands;
- diagnostic/review relationships;
- other explicit material relationships.

For Alpha 1.0, **DLA is the principal commissioning authority for GAM**.

### Generate Activity Materials

GAM fulfils material commissions established by DLA.

It must preserve the identity and ownership of commissioned materials while hydrating them with generated content.

### Learning Sequence / Design Page / Assembly

Downstream stages may enrich presentation, sequencing and page design within their authority.

They must not accidentally:

- remove commissioned content;
- break references;
- change ownership;
- misbind materials or activities;
- leave required elements unavailable in the assembled resource.

---

## 5. Contract graph

Completeness should be understood as validation of a graph of instructional contracts rather than validation of isolated JSON fields.

A typical DLA contract may contain:

    Activity
     │
     ├── learner task
     │
     ├── expected production
     │       └── fulfilled-by → response material
     │
     ├── task input
     │       └── provided-by → material
     │
     ├── evidence requirement
     │       └── provided-by → evidence material
     │
     ├── worked model
     │       └── independent-from → attempt operand
     │
     └── diagnostic review
             └── covers → response material

GAM hydrates appropriate material nodes.

Downstream stages must preserve the graph.

---

## 6. Alpha 1.0 deterministic validation

### 6.1 DLA internal completeness

Before GAM is considered, the validator should determine whether DLA has produced a structurally coherent commission.

Check where applicable:

- every activity has a unique valid activity ID;
- every required material has a unique valid material ID;
- every material belongs to a valid activity;
- every material reference resolves;
- response/workspace references resolve;
- production-to-response bindings resolve;
- diagnostic/review targets resolve;
- independent-practice operand references resolve;
- evidence-provider references resolve;
- where evidence is declared required, at least one evidence provider is identified;
- referenced evidence providers declare the appropriate evidence role/requirement;
- no required contractual reference points to a nonexistent node.

A DLA contract containing unresolved required references is incomplete before generation begins.

### 6.2 DLA → GAM commission fulfilment

For every material DLA commissions GAM to generate:

#### Existence

The corresponding GAM material must exist.

    DLA material A4-M1
            ↓
    GAM material A4-M1

Missing commissioned material = `FAIL`.

#### Identity

The material ID must be preserved.

Material substitution by creating a different ID does not fulfil the original commission unless an explicitly supported transformation permits it.

#### Activity ownership

The generated material must remain associated with the activity that commissioned it.

#### Material type

Where DLA establishes an authoritative material type, GAM must preserve that type unless an explicitly supported transformation permits otherwise.

#### Cardinality

The validator should detect:

- missing materials;
- duplicate IDs;
- unexpected duplicate fulfilment;
- ambiguous mappings.

For the Hydrology reference case, DLA commissioned 19 materials and GAM generated all 19 with preserved identity, type and activity ownership.

This is a structural completeness PASS.

### 6.3 Evidence contracts

Where DLA declares:

    evidence_decision.required = true

Alpha validation should establish:

1. one or more provider material IDs exist;
2. every provider ID resolves to a material;
3. each provider belongs to the appropriate activity;
4. the provider survives GAM;
5. the provider survives downstream assembly;
6. required references to that evidence remain resolvable.

For example:

    Activity A4
       evidence required
            ↓
          A4-M1
            ↓
          GAM
            ↓
     assembled resource

A missing evidence provider is a completeness failure, irrespective of the overall QA score.

### 6.4 Response/workspace contracts

Where DLA requires learner production to be captured through a material or workspace:

- the response material must exist;
- its ID must resolve;
- it must belong to the correct activity;
- GAM must fulfil it where GAM owns its generation;
- it must remain available downstream;
- diagnostics or reviews referencing it must still resolve.

The validator does not need to judge whether the workspace is *good* in Alpha 1.0.

It determines whether the commissioned response mechanism exists and survives.

### 6.5 Practice-independence structure

Where DLA explicitly distinguishes a worked example/model from an independent learner operand:

- the worked-example material must exist;
- the attempt-operand material must exist;
- their references must resolve;
- the relationship must survive GAM and assembly.

Determining whether the generated worked example **semantically reveals the answer** to the independent task is outside deterministic Alpha validation.

That belongs to semantic conformance.

### 6.6 Diagnostic/review contracts

Where DLA commissions diagnostic or review material covering learner production:

- the diagnostic material must exist;
- every response/workspace target it references must exist;
- the target must belong to the expected activity;
- both diagnostic and target must survive downstream processing.

A diagnostic pointing to a nonexistent learner response is incomplete even if both the page and diagnostic text render successfully.

---

## 7. Downstream preservation

A successfully generated GAM contract can subsequently be damaged.

Completeness Validation must therefore continue beyond GAM.

For every required commissioned/generated node, determine whether it remains present and correctly referenced through the available downstream artefacts.

Where possible, identify the **first-loss boundary**.

For example:

    DLA       A3-M2 ✓
    GAM       A3-M2 ✓
    Sequence  A3-M2 ✓
    Design    A3-M2 ✗
    Assembly  A3-M2 ✗

should report something equivalent to:

    FAIL
    Material: A3-M2
    Failure: required material lost downstream
    First observed loss: Design Page

This is substantially more useful than reporting only that A3-M2 is missing from the final page.

---

## 8. Final-resource completeness

The assembled resource should be checked for unresolved structural incompleteness, including where applicable:

- missing required activities;
- missing required materials;
- empty required generated bodies;
- unresolved material references;
- unresolved activity references;
- unresolved response/workspace references;
- missing evidence providers;
- missing diagnostic targets;
- unresolved placeholders;
- required elements generated upstream but absent from assembly.

A resource may render successfully while still failing Completeness Validation.

**Renderable does not imply complete.**

---

## 9. Result model

Alpha 1.0 should not produce a numerical completeness score.

Individual checks should return:

    PASS
    FAIL
    NOT CHECKED

`NOT CHECKED` is important. The validator must not claim conformance where the necessary evidence or capability does not exist.

An overall result may therefore be:

    Completeness: FAIL

    PASS        19/19 commissioned materials generated
    PASS        19/19 material identities preserved
    PASS        19/19 activity bindings preserved
    PASS        5/5 required learner-response contracts resolve
    PASS        2/2 required evidence providers resolve
    FAIL        1 required material absent from assembled page
    NOT CHECKED semantic fulfilment of material contracts

The report should favour **specific evidence over aggregate scoring**.

---

## 10. Failure reporting

Every failure should identify as much of the following as is deterministically available:

    severity / result
    stage
    activity_id
    material_id
    contract/reference involved
    expected state
    observed state
    first-loss boundary

Example:

    FAIL

    Activity: A4
    Material: A4-M1
    Contract: evidence_provider
    Expected: required evidence provider present in assembled page
    Observed: generated by GAM but absent after Design Page
    First-loss boundary: GAM → Design Page

The aim is not merely to reject incomplete resources.

The aim is to make incompleteness **diagnosable**.

---

## 11. Validation failure behaviour

A validator failure must never unnecessarily prevent forensic inspection of artefacts that already exist.

Therefore:

> **Validation may gate progression or new generation. It must not gate access to persisted artefacts.**

If GAM validation fails but Learning Sequence, Design Page, QA or assembled-page artefacts already exist from that run, the user must still be able to inspect and retrieve them.

The current behaviour observed during the Hydrology investigation—where the GAM validator prevented access to later persisted artefacts—should not be retained.

This is both a usability and Generation Forensics requirement.

---

## 12. Semantic conformance — explicitly outside Alpha 1.0

Some genuine conformance failures cannot be detected through structural integrity alone.

The Hydrology run provides a concrete example.

Design Page associated a visual affordance with activity `A3`, but its subject concerned **human influences on the water cycle**, which belongs to A5.

Structurally:

    activity_id = A3

is valid.

Semantically, the content is misbound.

A deterministic ID/reference validator cannot reliably discover this.

Likewise, Alpha 1.0 should not attempt to determine whether:

- teaching text genuinely fulfils its pedagogical archetype;
- evidence genuinely affords the intended inference;
- a worked example leaks the independent answer;
- evaluation guidance performs the learner's evaluation for them;
- a visual semantically represents the activity to which it is bound.

These are candidates for a later **Semantic Conformance** layer.

They must not be silently treated as PASS merely because Alpha does not inspect them.

Report them as `NOT CHECKED` where appropriate.

---

## 13. QA — separate concern

Completeness Validation must remain separate from QA.

Completeness asks:

> **Did the pipeline deliver the resource that was commissioned?**

Semantic conformance asks:

> **Does what was delivered actually fulfil the meaning of those contracts?**

QA asks:

> **How good is the resulting learning resource?**

A resource can therefore be:

    Structurally complete       YES
    Semantically conformant     UNKNOWN / PARTIAL
    QA quality                  HIGH

or:

    Structurally complete       NO
    QA score                    92

The latter must still be regarded as incomplete.

This is one reason Alpha 1.0 should not establish a numerical QA threshold for completeness.

---

## 14. Hydrology reference case

The Hydrology run should be retained as an initial validator fixture.

It demonstrates several useful conditions.

### Positive DLA → GAM case

DLA commissioned 19 materials.

GAM generated all 19 while preserving:

- material identity;
- material type;
- activity ownership.

Evidence-provider, response, diagnostic and independent-practice structures were also substantially preserved.

This provides a strong expected-PASS fixture for structural DLA → GAM validation.

### Semantic downstream defect

Design Page associated an A3 visual affordance with subject matter belonging to A5.

This should **not** be expected to fail deterministic Alpha validation if all structural references remain valid.

It should become a future Semantic Conformance test case.

### EP alignment anomalies

The run also contains questionable relationships between learning-outcome cognitive demand and selected EP archetypes.

These are valuable future EP-alignment cases but are outside the principal Alpha completeness scope.

---

## 15. Alpha 1.0 non-goals

Completeness Validation Alpha 1.0 does **not** attempt to:

- assign pedagogical quality scores;
- replace QA;
- determine factual correctness of generated teaching content;
- assess prose quality;
- assess visual quality;
- judge whether instructional archetypes were pedagogically optimal;
- perform general semantic comparison of generated materials;
- determine whether evidence is intellectually sufficient;
- determine whether examples are pedagogically effective;
- establish a QA passing threshold;
- restructure GAM;
- compensate for external model/platform failures.

These may be addressed separately as evidence and requirements mature.

---

## 16. Implementation principle

The Alpha validator should be built from **explicit contracts already present in PRISM artefacts**, not from inferred expectations about what a good learning resource ought to contain.

Where an invariant can be established deterministically from IDs, references, ownership and required fields, validate it.

Where fulfilling the invariant requires interpreting meaning, do not fake certainty.

    Known structural contract
            ↓
    deterministic validation
            ↓
        PASS / FAIL

    Semantic judgement required
            ↓
        NOT CHECKED
            ↓
    future semantic conformance

This keeps Alpha 1.0 narrow, explainable and trustworthy.

---

## 17. Alpha 1.0 acceptance proposition

Completeness Validation Alpha 1.0 is sufficient when PRISM can take an existing completed run and deterministically answer:

> **What did DLA require, did GAM generate all of it with its contractual identity intact, did downstream processing preserve it, and if not, where can we first prove that something was lost or broken?**

It does not need to determine whether every generated item is *good enough*.

That comes later.