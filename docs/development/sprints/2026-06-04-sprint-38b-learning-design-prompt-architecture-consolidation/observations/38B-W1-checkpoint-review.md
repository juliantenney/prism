# Wave 1 checkpoint review — after PR-W1-1 (`LD-TABLE-FIDELITY`)

**Date:** 2026-06-04  
**Reviewer role:** Programme checkpoint (pre PR-W1-2)  
**Inputs:** [EXECUTION-CHARTER-WAVE-1](EXECUTION-CHARTER-WAVE-1-SHARED-MODULE-CONSOLIDATION.md), [38B-W1-1 mapping](38B-W1-1-ld-table-fidelity-mapping.md), [38B-6](38B-6-regression-validation-plan.md), [38B-7](38B-7-governance-and-maintenance.md)  
**Constraint:** Read-only — no code or prompt edits in this review.

---

## Verdict (historical — post W1-1)

**PR-W1-1 achieved canonicalisation** (single module ID, GAM author wiring, Design Page preserve embed, tests/probes green). **Avoidable growth is limited but real:** most of the +2.1% four-step footprint is **new L4 clarifiers**, not failed deduplication. **Proceed to PR-W1-2 unchanged**; defer pack/runtime table echo removal to W1-2–W1-4 and Wave 2 pack trims.

---

## Wave 1 exit update (PR-W1-5, 2026-06-04)

**Wave 1 COMPLETE — PASS.** See [38B-W1-5-wave-1-exit-gate.md](38B-W1-5-wave-1-exit-gate.md).

| Metric | Value |
|--------|------:|
| Four-step augmented sum (final) | **72,878** |
| vs 38B-1 (152,782) | **−52.3%** |
| vs S12 target (≤129,865) | **Met** |
| Tests | **722 / 722** |
| Module lifecycle | All four **canonical** |
| B4-01/B4-02 | **OPEN** (by design) |
| Sprint 39 | **Gated** (unchanged) |

**Next wave:** **2a GAM** — not started until programme handoff.

---

## 1. `LD-TABLE-FIDELITY` content classification

| Class | Content (approx.) | Notes |
|-------|-------------------|--------|
| **Genuinely new (38B-4 / governance)** | ~1,450–1,650 chars per consumer of **core** | Precedence ladder; PREC-01; FORBIDDEN comma-row / Headers+Rows / label-only; GOOD pipe example (≤6 lines); explicit figure-vs-table scope; preserve anti-flatten (Design Page). Intentional per charter GAP-06 L4 clarifiers while B4 open. |
| **Migrated (existing behaviour)** | GAM **835** → author rider inside module | Row-adequacy bullets preserved verbatim in substance. |
| **Migrated (partial)** | Design Page **298** removed bullet (“actual tables with headers and cells”) → **2,190** embed (preserve + core, no second marker) | Net **+1,892** on materials fidelity body; not a failed migration — embed adds full core. |
| **Migrated (pointer only)** | DLA **+178** | One material-shape cross-ref to `LD-TABLE-FIDELITY`; no module append. |
| **Duplicated elsewhere (still)** | See §3 | Pack, material-shape, math, Sprint 38, materials verbatim lines — expected until Wave 1 exit / Wave 2–3. |
| **Technical duplicate (not prompt)** | `app.js` inline bootstrap mirrors `lib/ld-table-fidelity.js` | Runtime uses one effective text via lib or bootstrap; **MR-04** maintenance echo, not a second append. |

**Core vs pack overlap:** Core line “complete pipe table with header, divider…” **repeats** GAM pack §6 (by design in W1-1; pack trim deferred).

---

## 2. Size-accounting table (self-directed augmented)

Probe baseline 38B-1; post PR-W1-1 from [38B-W1-1 §5](38B-W1-1-ld-table-fidelity-mapping.md). Block-level estimates from `lib/ld-table-fidelity.js` string lengths.

| Step | Removed (est.) | Added (est.) | Net (probe) | Tier (38B-7 §6.3) |
|------|---------------:|-------------:|------------:|-------------------|
| **GAM** | 835 (old row-adequacy block) | 2,709 (`LD-TABLE-FIDELITY` author) | **+1,874** | Yellow (~+5.4%) |
| **Design Page** | 298 (one materials bullet) | 2,190 (core+preserve embed) + wording | **+2,153** | Green (~+4.7%) |
| **DLA** | 0 | 178 (spec cross-ref line) | **+179** | Green (~+0.5%) |
| **Assessment** | 0 | 0 | **0** | — |
| **Four-step sum** | ~1,133 | ~4,339 | **+3,206 (+2.1%)** | Green aggregate |

**Interpretation:** GAM net equals **core (~1,738) + new author wrapper (~100) + migrated row adequacy (835)**. Design Page net is **core+preserve embed** minus one short bullet — **no separate marker**, so growth is almost entirely **new L4 text**, not duplicate append units.

---

## 3. Remaining table-related instructions (remove after Wave 1)

| Location | Remove when | Owner PR |
|----------|-------------|----------|
| GAM / Design Page **pack** pipe-table and `markdown tables in named fields` | Pack trim / CC-CONTRACT | Wave 2a / 3 |
| DLA **material shape** multiline table bullets (6 lines) | Replace with `LD-TABLE-FIDELITY` ref | W1-2 or 2b |
| **Math** block pipe-table coexistence line | `LD-MATH-RENDER` single ref | W1-3 ✓ |
| **Sprint 38** pedagogical duplicate-table / materials fidelity “figures only” | Consolidate L6 rider; one scope statement | W1-2 / Wave 3 |
| **Materials fidelity** “markdown tables” in verbatim-copy bullet | `LD-MATERIALS-COPY` | W1-2 ✓ |
| **Rhetoric** worked-example pipe-table hints | Scope under `LD-SELF-DIRECTED-RHETORIC` | W1-4 ✓ |
| `app.js` **inline bootstrap** duplicate of lib module | Optional tech cleanup | Post W1-5 |

---

## 4. Is +2.1% expected, temporary, recoverable?

| Question | Assessment |
|----------|------------|
| **Expected?** | **Yes.** Charter and 38B-W1-1 deferral note: W1-1 deploys **authority + 38B-4 gaps**, not −15% reduction. |
| **Temporary?** | **Yes.** Footprint peaked after W1-1/2 for L4 modules; **W1-4 rhetoric merge** delivered −52.3% net. |
| **Recoverable in W1-2–W1-4?** | **Yes — achieved.** |

---

## 5. Wave 1 success criteria snapshot

| Criterion | Status |
|-----------|--------|
| S1 Single authority `lib/ld-*.js` | **Met** |
| S3 38B-4 forbidden + GOOD example | **Met** |
| S4 Row adequacy in module | **Met** |
| S7–S9 Tests / Sprint 38 | **Met** (722 tests) |
| S13 Marker budget | **Met** (decreased) |
| S12 −15% four-step | **Met** (72,878) |
| S17 Canonical lifecycle | **Met** PR-W1-5 |

---

## 6. Recommendation

| Option | Decision |
|--------|----------|
| **Wave 1** | **COMPLETE** |
| **Proceed to Wave 2a** | **Recommended next** — await programme handoff |
| Adjust strategy | Not required |
