# Sprint 88 — Handover

**Kind:** Open-sprint continuity  
**Sprint status:** **OPEN** — Assessment Pack configuration no longer exposes custom component mix (S88-D28)

Assessment Pack does not currently expose author-controlled component-form allocation. Plan Assessment Evidence selects forms according to the intended learning and evidence plan. Author form constraints may be reconsidered if real use or expert review establishes a concrete need. Component count, depth, use, and feedback timing stay as they were.

Real learner-page use showed matching terms and selects starting at different positions, unfinished native selects, and ordering controls that drifted with statement length. Matching now uses aligned rows. Classification and matching share restrained native-select styling. Ordering movement controls sit before the statement, as compact arrows with the existing accessible names. Judgement, feedback, evidence profile, depth, count, and feedback timing are unchanged.

Assessment depth is Quick, Standard, or Thorough (S88-D27). That is an evidence ambition to test in use, not a calibrated scale and not difficulty. The default component count is chosen by Plan Assessment Evidence. An exact count remains available and is honoured. The learner summary is an evidence profile: how many checked components for an outcome were successful, written out, so one success is not described as broad evidence. Feedback may be shown after each component or only at the end. It is not tied to formative or diagnostic use.

Assessment Pack starting points remain those in S88-D24, and the workflow now ends at Assessment Design Page. Deterministic assembly, not Design Page, builds the learner page from the Author Assessment Components artefact.  
**Opening decision:** [S88-D01](decisions.md#s88-d01--open-sprint-88--default-product-workflows--assessment-architecture)

---

## Start here

Sprint 88 is **OPEN**. The bounded local-instantiation slice is implemented (S88-D11 / S88-T-012).

New Learning Design Self-study, Workshop, and Expository creates build the documented family locally, without a PRISM API key or a design-model call. Saved graphs are not rewritten. Research and model-backed design remain gated.

Assessment Pack starting points are implemented (S88-D24). A topic starts with Generate Learning Content, Model Knowledge, and Define Learning Outcomes. Authoritative source, and a completed Interactive or Expository output used as source material, prefix Normalize Content. Those upstream stages are the existing Learning Design stages. Saved Learning Outcomes are not extracted from another product. Target component count, purpose, diagnostic intent, and weighting do not change the chosen graph. Design Page is not the terminal stage.

[S88-AD-004](ARCHITECTURAL-DEBT.md) records leftover elicitation and model-shaping machinery as maintainability debt. It does not authorise a cleanup investigation. Some of that machinery still serves Custom/Generated workflows, Research, and saved-graph compatibility.

[S88-AD-005](ARCHITECTURAL-DEBT.md) records first-class product family extensibility as maintainability debt, not a current product defect. It does not authorise a refactor or a prescribed extension mechanism. The boundary should emerge from future product additions and ordinary maintenance.

[S88-AD-006](ARCHITECTURAL-DEBT.md) records domain-pack responsibilities after deterministic first-class creation as architectural debt, not a current product defect. It does not authorise a domain-pack refactor or speculative removal. What remains useful should be decided from maintenance, future products, and concrete evidence.

First Assessment Pack run observations, recorded and not fixed (2026-09-28): Author Assessment Components component 2 under-sampled its learning outcome (identification of prior, likelihood, evidence, and posterior was reduced to identification of the prior). Component 6 added the qualifier “independent” to evidence without need. Plan Assessment Evidence mapped six outcomes to six components one-to-one; a later run with unequal counts is required before treating that as systemic. Define Learning Outcomes received no explicit duration or scope, and this run did not show a defect from that absence. Publishing was not implemented.

The charter questions are hypotheses:

1. Whether first-class products should have canonical/default workflow shapes instantiable locally, with model-driven elicitation retained as an advanced capability.  
2. What PRISM's existing assessment architecture and history imply — including Design Assessment, Generate Assessment Items, learner-evidence concepts, current Interactive formative assessment, and a possible future Assessment product.

Neither question is a decision.

---

## Do next

1. Read [S88-ARCHITECTURE-PLAN.md](S88-ARCHITECTURE-PLAN.md), especially the implementation boundary.  
2. Topic and source starts are already implemented. Do **not** treat them as deferred.  
3. Do **not** fix S88-AD-001, S88-AD-002, or the API-key gate until an implementation decision.  
4. Do **not** plan Assessment topology or repair Design Assessment from this handover. The investigation’s open questions are in the report’s final list.  
5. Do **not** open a cleanup of [S88-AD-004](ARCHITECTURAL-DEBT.md). Touch that machinery only when ordinary maintenance shows a specific piece is redundant, with regression protection.
6. Do **not** open a refactor for [S88-AD-005](ARCHITECTURAL-DEBT.md). Do not invent a plugin, registry, or schema for it.
7. Do **not** refactor domain packs, or remove domain-pack behaviour, under [S88-AD-006](ARCHITECTURAL-DEBT.md).

---

## Protected

- Alpha development complete; gate at close **339/339**.  
- Sprint 82–87 **CLOSED**.  
- Interactive prompt family remains a protected baseline under [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline). Sprint 88 does not reopen that decision.
