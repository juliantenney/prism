# Sprint 88 — Handover

**Kind:** Open-sprint continuity  
**Sprint status:** **OPEN / investigation beginning**  
**Opening decision:** [S88-D01](decisions.md#s88-d01--open-sprint-88--default-product-workflows--assessment-architecture)

---

## Start here

Sprint 88 is **OPEN**. The bounded local-instantiation slice is implemented (S88-D11 / S88-T-012).

New Learning Design Self-study, Workshop, and Expository creates build the documented family locally, without a PRISM API key or a design-model call. Saved graphs are not rewritten. Research and model-backed design remain gated.

Assessment Pack is adopted as a Learning Design product (S88-D13–D15) and amended (S88-D17–D21). The plan is [S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md](S88-ASSESSMENT-PACK-ARCHITECTURE-PLAN.md). It is not implemented. An existing Interactive Resource may supply outcomes as input. Topic and source use the established Learning Design prefix. Diagnostic intent is not a third purpose and not a stage. Weighting is optional and separate from purpose. The first two component forms are not the product’s scope.

[S88-AD-004](ARCHITECTURAL-DEBT.md) records leftover elicitation and model-shaping machinery as maintainability debt. It does not authorise a cleanup investigation. Some of that machinery still serves Custom/Generated workflows, Research, and saved-graph compatibility.

The charter questions are hypotheses:

1. Whether first-class products should have canonical/default workflow shapes instantiable locally, with model-driven elicitation retained as an advanced capability.  
2. What PRISM's existing assessment architecture and history imply — including Design Assessment, Generate Assessment Items, learner-evidence concepts, current Interactive formative assessment, and a possible future Assessment product.

Neither question is a decision.

---

## Do next

1. Read [S88-ARCHITECTURE-PLAN.md](S88-ARCHITECTURE-PLAN.md), especially the implementation boundary.  
2. Do **not** implement from this handover.  
3. Do **not** fix S88-AD-001, S88-AD-002, or the API-key gate until an implementation decision.  
4. Do **not** plan Assessment topology or repair Design Assessment from this handover. The investigation’s open questions are in the report’s final list.  
5. Do **not** open a cleanup of [S88-AD-004](ARCHITECTURAL-DEBT.md). Touch that machinery only when ordinary maintenance shows a specific piece is redundant, with regression protection.

---

## Protected

- Alpha development complete; gate at close **339/339**.  
- Sprint 82–87 **CLOSED**.  
- Interactive prompt family remains a protected baseline under [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline). Sprint 88 does not reopen that decision.
