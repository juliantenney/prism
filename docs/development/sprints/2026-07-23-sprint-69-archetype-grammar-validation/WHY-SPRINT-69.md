# Why Sprint 69 Exists

**Related:** [HANDOVER.md](HANDOVER.md) · [GOALS.md](GOALS.md) · [PLAN.md](PLAN.md) · [ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)

---

## Why isn't the current renderer sufficient?

Sprint 68 delivered a production-certified renderer that composes educational semantics faithfully. The renderer is not broken.

The limitation is architectural: variant binding still requires an **exact match against a finite list of observed beat arrays**. When the producer emits a valid FunctionEnum sequence that was never manually registered, the renderer fails with `UNKNOWN_ARCHETYPE_VARIANT` even though the educational intent may be coherent.

Educational Psychology exposed this after Sprint 68 closeout. The post-closeout repair fixed the immediate producer contract violation; it also showed that chasing registry entries is not a stable long-term strategy.

## Why isn't adding more exact variants the long-term answer?

Each new observed journey adds another registered array. The registry already mixes journey-compressed sequences, Episode Plan V1 templates, and production observations — and still fails on valid unseen combinations.

Enumeration captures **what we have seen**. It does not capture **what is allowed**. Every registry widening is reactive, not principled.

## Why is grammar the correct abstraction?

The producer already thinks in rules: archetype, FunctionEnum beats, ordering constraints, terminal roles. Composition already uses role semantics (Orient / Learn / Do / Check). The missing piece is a **shared contract** that validates legality against educational rules rather than historical examples.

```text
Observed educational journeys
↓
Finite sequence registry
↓
Registry captures observations
↓
Educational grammar captures rules
↓
Rules are the architectural contract
↓
Renderer should validate rules,
not historical examples
```

Grammar validation preserves **exactness**. A sequence either satisfies the rules or it does not. There is no scoring, no nearest match, no tolerance band.

## Why is this not fuzzy matching?

Fuzzy matching asks: *which registered sequence is closest?*

Grammar validation asks: *does this sequence satisfy the archetype's required roles, allowed beats, ordering constraints, and terminal rules?*

The answer remains binary and deterministic. Only the **level of abstraction** changes — from enumerated arrays to validated rules.

## Why is this a natural evolution from Sprint 68?

Sprint 68 established that the renderer **interprets** semantics; it does not author them ([ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)). It proved capability-based surfaces, exactly-once assignment, and fail-closed diagnostics on an authoritative corpus.

Sprint 69 completes the contract model: the same exact validation philosophy, applied at the correct abstraction layer — shared archetype grammar — rather than an ever-growing observation list.

---

Sprint 69 is an **architectural evolution**, not a bug-fix sprint. Educational Psychology is regression evidence, not the sole driver.
