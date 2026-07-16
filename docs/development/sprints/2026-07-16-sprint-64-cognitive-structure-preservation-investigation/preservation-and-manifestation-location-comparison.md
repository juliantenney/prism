# Preservation and Manifestation Location Comparison

**Sprint:** 64 — Task 4 (S64-BL-004)  
**Type:** Architecture comparison only  
**Date:** 2026-07-16  
**Status:** Complete  

**Inputs:** attachment points · mechanisms · Outcome B feasibility · manifestation contracts · Sprint 63 Exp 2/3.  
**No** production architecture selected or implemented.

---

## 1. Objective

Determine where source preservation, correlation, manifestation-envelope construction, and experimental consumption should occur to minimise coupling, semantic risk, and architectural commitment — and which combination deserves a bounded prototype.

Core question:

> Where should source preservation, correlation, manifestation-envelope construction, and experimental consumption occur to minimise coupling, semantic risk, and architectural commitment?

---

## 2. Current Evidence Position

* Source contract lives in DLA `required_materials[]`.  
* `materials[]` flatten structured plans into prose.  
* Exact `material_id` 1:1 correlation is reliable when both sides coexist (Outcome B).  
* Partial / material-only paths lack source → Tier 1 must be absent.  
* Strong contracts: opaque full plan (diagnostic), verbatim archetype-specific envelope (manifestation), ephemeral projection (prototype).  
* Generic projection and renderer-owned interpretation rejected for first steps.  
* Open question: **architectural location** of P / C / E / M / D.

---

## 3. Architectural Responsibilities

| Responsibility | Inputs | Outputs | Semantic Transformation Allowed? |
| -------------- | ------ | ------- | --------------------------------- |
| **P — Source Preservation** | DLA/GAM page with `required_materials` | Accessible source contract after GAM | **No** — retain authored structure |
| **C — Correlation** | Source + realised `material_id`s | 1:1 match or fail | **No** — structural join only |
| **E — Envelope Construction** | Validated correlated plan + provenance | Path-gated envelope (opaque and/or verbatim subset) | **Structural only** (copy/wrap/select evidence-led keys); no paraphrase |
| **M — Manifestation Consumption** | Envelope + Tier 2 signals | Experimental T1/T2 outputs | **Structural labelling only**; values verbatim (Exp 2/3 rule) |
| **D — Diagnostics** | Gate/correlation/envelope/trace events | Eligibility report, traces, metrics | **No** instructional invention |

**Copying / wrapping / selecting evidence-led keys** = structural.  
**Renaming implications, UI directives, generic projection** = semantic interpretation (not allowed in P/C/E for production; M only with Exp 2/3 discipline).

---

## 4. Candidate Locations

| ID | Location | Exists? | Fit responsibilities |
| -- | -------- | ------- | -------------------- |
| **A** | GAM output construction | Yes | P (full-page retain); not ideal for E |
| **B** | Assembled page-level `required_materials` | Yes (conditional retain) | P; source side of C |
| **C** | Realised material metadata | Yes (fields exist; plans not carried today) | P/C/E if attach |
| **D** | Preserve / normalize layer | Yes | C, structural E, D — **not** semantic M |
| **E** | Dedicated pre-manifestation adapter | Experimental / new tooling only | C, E, D (isolated) |
| **F** | Experiment builder (Exp 2/3 style) | Yes (Sprint 63 pack) | C, E, M, D |
| **G** | Renderer input preparation | Exists as normalize/render prep | E; experimental M via side channel |
| **H** | Renderer | Yes | E+M — high coupling |

Prompt-as-store and prose reconstruction remain out of scope.

---

## 5. Candidate Combinations

### Combination 1 — Page Retention + Experiment Adapter

```text
GAM retains required_materials
→ assembled page has source + materials
→ experimental adapter correlates + builds ephemeral envelope
→ experiment builder consumes
```

### Combination 2 — Page Retention + Preserve/Normalize Bridge

```text
GAM retains required_materials
→ preserve/normalize correlates + structural envelope
→ bounded consumer
```

### Combination 3 — Material-Level Opaque Reference + Adapter

```text
page-level source retained
→ material carries source material_id reference
→ adapter resolves → verbatim envelope → consumer
```

### Combination 4 — Material-Level Full Plan

```text
copy instructional_archetype + archetype_plan onto material
→ consumer reads material metadata
```

### Combination 5 — Material-Level Verbatim Subset

```text
copy selected authored fields onto material
→ consumer reads envelope
```

### Combination 6 — Experiment-Only from Coexisting Inputs

```text
unmodified source + realised artefacts (same page or DLA↔GAM captures)
→ experiment builder correlates
→ ephemeral envelope
→ T1/T2 + provenance
```

### Combination 7 — Renderer Interpretation

```text
source plan reaches renderer
→ renderer branches on archetype plan shapes
```

---

## 6. Responsibility Placement

| Combination | P | C | E | M | D |
| ----------- | - | - | - | - | - |
| **1** | GAM/page retain | Adapter | Adapter | Experiment | Adapter |
| **2** | GAM/page retain | Preserve | Preserve (structural) | Bounded consumer | Preserve sidecar |
| **3** | Page + ref on material | Adapter | Adapter | Experiment | Adapter |
| **4** | Copy at GAM/bridge | Implicit by attach | At copy (full) | Any consumer | Weak unless added |
| **5** | Copy subset | Implicit | At copy (subset) | Consumer | Weak unless added |
| **6** | None new (use captures) | Experiment | Experiment | Experiment | Experiment |
| **7** | Must reach renderer | Renderer or upstream | Renderer | Renderer | Poor |

| Combination | Separation quality |
| ----------- | ------------------ |
| **1** | Clean — P on page; C/E/M/D in adapter/experiment |
| **2** | Mixed — C/E in production pipeline layer |
| **3** | Clean if ref is non-semantic |
| **4/5** | Coupled — E early; risk of dual stores |
| **6** | Cleanest isolation |
| **7** | Hidden semantic decisions in renderer |

**Flag:** Combos **4/5/7** force archetype-shape interpretation (or readiness for it) outside a dedicated experimental consumer.

---

## 7. Data Lifetime

| Combination | Source Lifetime | Envelope Lifetime | Provenance Lifetime | Irreversible Commitment |
| ----------- | --------------- | ----------------- | ------------------- | ----------------------- |
| **1** | Persisted on page if retained | Ephemeral | Diagnostic artefact | Low |
| **2** | Persisted if retained | Ephemeral or sidecar | Sidecar | Medium (pipeline touch) |
| **3** | Persisted + ref | Ephemeral at resolve | Diagnostic | Low–medium |
| **4** | Copied onto materials | Persistent on materials | Optional | **High** (derived on canonical materials) |
| **5** | Copied subset | Persistent | Optional | **High** if subset becomes de facto contract |
| **6** | Unchanged upstream artefacts | Ephemeral | Experiment outputs | **Lowest** |
| **7** | Must be available at render | Implicit in render logic | Weak | **Highest** |

Prefer: **source preservation ≠ derived envelope persistence ≠ rendered HTML persistence**.

---

## 8. Path Compatibility

| Combination | Full Page | Partial | Material Only | Legacy | Gating Complexity |
| ----------- | --------- | ------- | ------------- | ------ | ----------------- |
| **1** | supported with gate | unsupported (no source) | unsupported | fail closed | Low–medium |
| **2** | supported with gate | unsupported | unsupported | fail closed | Medium |
| **3** | supported with gate | fragile | unsupported | fail closed | Medium |
| **4** | native if copy runs | unsupported without source | unsupported | fail closed | Medium |
| **5** | same as 4 | same | same | fail closed | Medium (+ subset policy) |
| **6** | supported with gate | supported **only** via external DLA capture join | unsupported alone | fail closed | Low |
| **7** | unsafe / fragile | unsupported | unsupported | unsafe | High |

---

## 9. Semantic Boundaries

| Combination | First Interpretation Point | Learner-Labelling Point | Traceability | Semantic Risk |
| ----------- | -------------------------- | ----------------------- | ------------ | ------------- |
| **1** | Experiment M (structural labels) | Experiment | High | Low |
| **2** | Must stay structural in preserve; labels in consumer | Consumer | High if sidecar | Medium if preserve overreaches |
| **3** | Adapter/consumer | Experiment | High | Low |
| **4** | At consumer (full shapes) | Consumer/renderer | Medium | Medium–high coupling |
| **5** | At selection policy | Consumer | High if keys named | Medium (premature subset freeze) |
| **6** | Experiment M | Experiment | High (Exp 2/3 proven) | Low |
| **7** | Renderer | Renderer | Weak | **High** |

---

## 10. Coupling

| Combination | Primary Coupling | Secondary Coupling | Change Sensitivity |
| ----------- | ---------------- | ------------------ | ------------------ |
| **1** | Assembled page + `required_materials` | Experiment tooling | Medium |
| **2** | Preserve/normalize | Page shapes | **High** (production path) |
| **3** | `material_id` + page source | Adapter | Medium |
| **4** | Material metadata + full `PLAN_KEYS` | All consumers | **High** |
| **5** | Material metadata + subset policy | Archetypes | High |
| **6** | Experiment tooling only | Capture formats | Low |
| **7** | Renderer + all plan shapes | UI | **Highest** |

* Source-shape coupling: unavoidable for T1 content; confine to envelope consumer.  
* Pipeline coupling: **2/4/5/7** higher than **1/3/6**.  
* UI coupling: avoid until after prototype (**7** worst).

---

## 11. Ownership

| Concern | Candidate Owner (bounded prototype) | Why | Risks |
| ------- | ----------------------------------- | --- | ----- |
| Eligibility gating | Experiment adapter / builder | Isolated; fail closed | Must mirror Outcome B rules |
| Correlation validation | Same | `material_id` 1:1 proven | Don’t use index/title |
| Plan validation | Same (call existing validators conceptually) | Reuse `PLAN_KEYS` rules | Don’t fork validation |
| Provenance recording | Same | Observability requirement | Don’t drop traces |
| Envelope construction | Same (ephemeral) | Contract B/F | Don’t persist to canonical page |
| Manifestation transformation | Experiment HTML builder | Exp 2/3 pattern | Label discipline |
| Diagnostic reporting | Same outputs folder | Metrics | — |

**Ambiguous ownership:** Combo **2** (preserve owns C/E while also owning body fidelity) and **7** (renderer owns everything).

---

## 12. Failure Containment

| Combination | Failure Scope | Falls Back to Tier 2? | Can Fail Closed? | Learner Impact |
| ----------- | ------------- | --------------------- | ---------------- | -------------- |
| **1** | Adapter only | Yes | Yes | Baseline page untouched |
| **2** | Preserve layer | Yes if coded | Yes | Risk if merge path errors |
| **3** | Adapter | Yes | Yes | Baseline untouched |
| **4/5** | Material objects | Harder | Possible | Canonical data changed |
| **6** | Experiment only | Yes | Yes | **None** on production pages |
| **7** | All renders | Unclear | Hard | Direct learner impact |

Strong prototype requirement: **failure must not change the baseline learner page** → **6** and **1** (experiment consumer) excel.

---

## 13. Observability

| Combination | Diagnostic Observability | Traceability | Comparison Support |
| ----------- | ------------------------ | ------------ | ------------------ |
| **1** | High | High | T1 vs T2 easy |
| **2** | Medium–high (if sidecar) | High | Good |
| **3** | High | High | Good |
| **4/5** | Medium unless logs added | Medium | Possible |
| **6** | **Highest** (designed outputs) | **Highest** | **Native** (Exp 2/3) |
| **7** | Low | Weak | Poor |

---

## 14. Reversibility

| Combination | Reversible? | Persistent Commitment | Hidden Contract Risk |
| ----------- | ----------- | --------------------- | -------------------- |
| **1** | Yes | Low (if retain already native) | Low |
| **2** | Medium | Pipeline behaviour | Medium |
| **3** | Yes if ref experimental | Low–medium | Low |
| **4** | Harder | **High** | High |
| **5** | Harder | High | High (subset as schema) |
| **6** | **Yes** | None on canonical data | Lowest |
| **7** | Hard | Renderer contract | Highest |

---

## 15. Trade-Off Matrix

Scale: **1** favourable → **5** unfavourable.  
**Proto** = suitability for bounded prototype. **Future** = suitability as possible later production direction (separate).

| Dimension | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --------- | - | - | - | - | - | - | - |
| Source fidelity | 2 | 2 | 2 | 1 | 2 | 1 | 3 |
| Semantic safety | 1 | 2 | 1 | 3 | 3 | 1 | 5 |
| Path-gating safety | 2 | 2 | 2 | 3 | 3 | 1 | 5 |
| Correlation reliability | 1 | 1 | 1 | 2 | 2 | 1 | 3 |
| Provenance quality | 1 | 2 | 1 | 3 | 3 | 1 | 5 |
| Diagnostic observability | 2 | 2 | 2 | 3 | 3 | 1 | 5 |
| Implementation isolation | 2 | 4 | 2 | 4 | 4 | 1 | 5 |
| Pipeline coupling | 2 | 4 | 3 | 4 | 4 | 1 | 5 |
| Archetype coupling | 2 | 2 | 2 | 4 | 3 | 2 | 5 |
| Renderer coupling | 1 | 1 | 1 | 3 | 3 | 1 | 5 |
| Maintenance burden | 2 | 4 | 2 | 4 | 4 | 1 | 5 |
| Reversibility | 2 | 3 | 2 | 4 | 4 | 1 | 5 |
| Future migration cost | 2 | 3 | 2 | 4 | 4 | 1 | 5 |
| **Proto suitability** | **2** | 4 | **2** | 4 | 4 | **1** | 5 |
| **Future-direction suitability** | **2** | 3 | **2** | 3 | 3 | 4* | 5 |

\*Combo **6** is excellent as prototype, weak as *permanent* production home (by design — ephemeral tooling).

### Score notes

* **6 proto=1:** matches Exp 2/3; zero production touch.  
* **2 pipeline=4:** preserve is production-critical.  
* **7 all high:** renderer awareness unjustified.  
* **4 future=3:** possible later if correlation+gates proven in prototype, not first step.

---

## 16. Candidate Classification

### Strong for Bounded Prototype

* **Combination 6** — Experiment-only from coexisting inputs  
* **Combination 1** — Page retention + experiment adapter (when same-artefact source+materials available)

### Conditional for Bounded Prototype

* **Combination 3** — Opaque material reference + adapter (needs experimental ref attach or resolve-from-page without new canonical fields)

### Architecture Candidate for Later Study

* **Combination 2** — Preserve/normalize structural bridge (after prototype proves value; keep semantic interpretation out)  
* **Combination 4 / 5** — Material-level full/subset copy (only after envelope shape and gates proven; high commitment)

### Reject

* **Combination 7** — Renderer interpretation (coupling, semantic risk, irreversibility)  
* Any combo that reconstructs from prose or ungated partial paths

**No production solution selected.**

---

## 17. Smallest Bounded Prototype

### Prototype Objective

Test whether a **path-gated, ephemeral verbatim envelope** (Contract B/F) built by an **experiment-only correlator** can reproduce Exp 2/3 T1 gains with **full provenance**, without touching production renderer or canonical persistence.

### Eligible Path

```text
full source + realised materials available
(same artefact OR validated DLA↔GAM capture join with exact material_id 1:1)
```

### Source Inputs

* Sprint 60/63 plan-bearing DLA rows (mechanism / process / mental model)  
* Matching realised materials (Exp 2 both-arrays; Exp 3 stand-ins; optional Ed Psych-style joins **without** inventing plans)

### Correlation Gate

All of: source present · both IDs · unique in activity · exact 1:1 · plan validates · path supported. Else Tier 1 absent.

### Envelope

```text
ephemeral verbatim archetype-specific envelope
(+ opaque full plan allowed in diagnostic layer)
```

Not persisted on canonical page/materials.

### Consumers

Diagnostic report + experiment builder only (HTML/JSON under `experiments/`).

### Outputs

```text
Tier 2 output
Tier 1 path-gated output
provenance trace (field → element)
eligibility report (include / exclude reasons)
```

### Exclusions

Partial paths · material-only alone · invalid plans · production renderer · persisted generic contract · prose inference.

### Success Criteria (evidence only)

1. Eligible cases emit T1 with every element traced to one authored field.  
2. Ineligible cases emit Tier 2 only + diagnostic reason.  
3. Baseline production pages unchanged.  
4. Three archetypes covered (mechanism, process, mental model).  
5. No schema or renderer changes required.

---

## 18. Findings

1. Separate P / C / E / M / D; keep semantic interpretation out of preserve and renderer.  
2. **Strongest prototype combo: 6** (then **1**).  
3. **Strongest longer-term candidates: 1 or 3** (page retain ± opaque ref), with **2** as structural bridge only later.  
4. Reject renderer-owned interpretation (**7**).  
5. Recommended prototype placements:  
   - **P:** existing page/`required_materials` when present (no new store)  
   - **C:** experiment adapter  
   - **E:** experiment adapter (ephemeral)  
   - **M:** experiment builder  
6. Envelope should be **ephemeral** for the first prototype.  
7. **Do not** copy full plans onto materials for the first prototype.  
8. Preserve/normalize should **not** own semantic interpretation.  
9. Renderer awareness **not** justified now.  
10. Primary coupling risk: early material-level persistence (**4/5**) or renderer (**7**).  
11. Primary failure-containment advantage: experiment-only path leaves baseline untouched.  
12. Prior Sprint 64 conclusions **unchallenged**; location question now answered enough to prototype.

---

## 19. Recommended Next Task

### Option A — Run Bounded Prototype

Implement the §17 experiment-only prototype (Combination **6**, optionally exercising Combination **1** when same-artefact both-arrays exist). Documentation + experiment artefacts only; no production merge.

Then proceed to **S64-BL-005** recommendation using prototype evidence.

---

## Success condition met

Safest informative location combination for a bounded prototype identified (**Combo 6 / 1**); production architecture not selected.
