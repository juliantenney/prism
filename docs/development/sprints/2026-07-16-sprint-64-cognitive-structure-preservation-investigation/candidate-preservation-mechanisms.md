# Candidate Preservation Mechanisms

**Sprint:** 64 — Task 2 (S64-BL-002)  
**Type:** Architecture investigation (comparison only)  
**Date:** 2026-07-16  
**Status:** Complete  

**Predecessor:** [candidate-preservation-attachment-points.md](candidate-preservation-attachment-points.md)  
**Authority:** Sprint 63 findings + attachment-point map. **No** mechanism selected or implemented.

---

## 1. Objective

Identify and compare the smallest realistic mechanisms by which existing learner-relevant cognitive structure could remain available beyond:

```text
GAM → materials[]
```

Core question:

> What candidate mechanisms could preserve the smallest useful amount of existing cognitive structure beyond GAM, and what are their trade-offs?

---

## 2. Evidence Base

| Source | Role |
| ------ | ---- |
| [candidate-preservation-attachment-points.md](candidate-preservation-attachment-points.md) | Viable / potentially viable zones |
| Sprint 63 authoritative findings / synthesis / final validation | What must be preserved and why |
| `app.js` `buildGamV2CopyMaterialAuthoringBrief` | Partial GAM: materials-only; 1:1 `material_id` hydration rule |
| `app.js` `buildUpstreamDlaPageEmbedSectionForGamCopy` | Full-page GAM: retain `required_materials` verbatim |
| `lib/page-gam-materials-preserve.js` | Merge by `material_id` / slug; no plan fields |
| `lib/ld-instructional-archetype.js` | Plan SoT validation; routing consume |
| Sprint 63 Exp 2–3 diagnostics | Verbatim plan visibility pattern |

---

## 3. Current Preservation Boundary

```text
DLA required_materials[].archetype_plan     ← structured SoT
→ GAM routing (ephemeral consume)
→ materials[].body                          ← structured keys absent
→ required_materials[] may remain orphaned  ← path-dependent
→ preserve/normalize                        ← no plan bridge today
→ renderer                                  ← no plan consumer
```

High-value non-recoverable fields (Sprint 63): `required_links`, `stages`, `key_relationships`, `governing_constraint`.

---

## 4. Candidate Mechanisms

| ID | Mechanism | Zone(s) |
| -- | --------- | ------- |
| **A** | Retain existing post-GAM `required_materials[]` | Attachment D |
| **B** | Carry full `instructional_archetype` + `archetype_plan` onto realised material metadata | F (+ optional G) |
| **C** | Carry high-value plan subset onto realised material metadata | F (+ optional G) |
| **D** | Opaque instructional contract reference (link realised material → matching required row) | D + F correlation |
| **E** | Preserve/normalize bridge (copy or attach from retained source during preserve) | G bridging A/D → F |
| **F** | Pre-manifestation projection into diagnostic learner-facing contract | H experimental only |

No additional families added — prompt-as-store and prose reconstruction remain excluded (attachment-point Reject / Not Viable).

---

## 5. Mechanism Flow Diagrams

### A — Retain `required_materials`

```text
DLA required_materials[] (plan)
→ GAM full-page path retains required_materials[]
→ assembled page holds orphaned plans + materials[] bodies
→ consumer correlates by material_id
→ (optional) later manifestation reads required_materials
```

| Role | Location |
| ---- | -------- |
| Source | DLA `required_materials` |
| Durable store | Same array on page (if retained) |
| Correlation | By `material_id` (+ activity ownership) |
| Consumer | Diagnostic / future manifestation |
| Semantic transform | None if untouched |
| Loss point | Partial/material-only GAM drops array |

### B — Full plan on material metadata

```text
DLA required_materials[i].archetype_plan
→ correlate to materials[j] by material_id
→ copy instructional_archetype + archetype_plan onto material
→ preserve/normalize retain fields
→ renderer input may read material-local plan
```

| Role | Location |
| ---- | -------- |
| Source | Required row plan |
| Durable store | `materials[]` object |
| Correlation | Required before copy |
| Consumer | Material-local |
| Semantic transform | None if verbatim copy |
| Loss point | Failed correlation; partial path without source |

### C — High-value subset on material metadata

Same flow as B, but only selected existing keys (e.g. links / stages / relationships+constraint).

| Loss / transform | Risk of incomplete subset choice; archetype-specific key sets |

### D — Opaque reference

```text
DLA required_materials[i]
→ materials[j] gains reference to material_id / required row identity
→ plan remains only on required_materials (or lookup table)
→ consumer resolves reference when needed
```

| Role | Location |
| ---- | -------- |
| Source | Required row |
| Durable store | Reference on material + plan on required (or deferred lookup) |
| Correlation | Reference **is** the correlation |
| Consumer | Late binding |
| Semantic transform | Deferred |
| Loss point | Broken reference; missing required row on partial paths |

**Viability of D:** Supported insofar as GAM brief already mandates one hydrated material per `required_materials.material_id` — a stable shared key exists for intended 1:1 cases.

### E — Preserve/normalize bridge

```text
Page with required_materials (plan) + materials (bodies)
→ preserve/normalize correlates and attaches (full, subset, or reference)
→ materials path carries structure downstream
```

| Role | Bridge strategy over A/B/C/D storage choices |
| Durable store | Whatever E writes onto materials (or leaves on required) |
| Consumer | Downstream of preserve |
| Loss point | No source plan on page → must no-op (not invent) |

### F — Pre-manifestation projection (experimental)

```text
Authored structure available (via A–E)
→ experimental projection of verbatim fields into diagnostic contract
→ experiment HTML / tooling only
→ not production renderer
```

Matches Sprint 63 `debug_instructional_contract` pattern.

---

## 6. Correlation Analysis

Intended production rule (GAM V2 brief):

> exactly one hydrated material object per `required_materials.material_id`

Preserve merge keys bodies by `material_id` / slug.

| Mechanism | Correlation Method | Existing Stable Key? | Ambiguity Risk | Failure Mode |
| --------- | ------------------ | -------------------- | -------------- | ------------ |
| **A** | Lookup `required_materials` by `material_id` within activity | **Yes** (`material_id`) | Medium if orphans/duplicates | Plan present, no matching material / wrong row |
| **B** | Same key before copy onto material | **Yes** | Medium | Copy to wrong material; skip if ID mismatch |
| **C** | Same as B | **Yes** | Medium | Same + subset omits needed keys |
| **D** | Explicit reference = `material_id` (or activity_id+material_id) | **Yes** | Low–Medium | Dangling reference if required row dropped |
| **E** | Uses A–D correlation inside preserve | **Yes** (same key) | Medium | Bridge runs without source → empty attach |
| **F** | Inherits upstream correlation | Depends on A–E | Medium | Projects wrong plan into experiment |

### Non–one-to-one cases (do not assume)

| Case | Status in evidence |
| ---- | ------------------ |
| Multiple materials from one requirement | **Not** the GAM V2 contract intent; if it occurs, correlation by single `material_id` breaks |
| One material, multiple requirements | Not supported by 1:1 ID rule |
| Reordered materials | **OK** if keyed by `material_id`, not array index |
| Partial GAM | `required_materials` may be absent → correlation source missing |
| Optional / dropped materials | Plan row without body, or body without plan |
| Transformed material types | Type may change; **ID** is the stable key, not type |

**Finding:** Stable source-to-material correlation **is intended** via `material_id` under activity ownership, but **not proven** across partial paths, orphans, and contract violations. Index-based correlation would be fragile; ID-based is the only realistic existing key.

---

## 7. Full Plan vs Subset vs Opaque Reference

| Representation | Fidelity | Coupling | Semantic Safety | Consumer Complexity | Maintenance |
| -------------- | -------- | -------- | --------------- | ------------------- | ----------- |
| Full plan | Highest | Higher (all `PLAN_KEYS` shapes) | High if verbatim | Higher | Higher |
| High-value subset | High for Sprint 63 gains | Medium (archetype-specific keys) | High if verbatim | Medium | Medium — subset policy must stay evidence-led |
| Opaque reference | Full fidelity at source | Lowest at assembly | Highest (no projection) | Higher at consume time | Lower at assembly; validation still needed |

### Answers (no winner)

1. **Does full-plan retention keep authoring-only fields?** Yes — endpoint/overlap fields and archetype ID may be low novelty for learners; still useful for validation/routing parity.  
2. **Does subset risk archetype-specific branching?** Yes — different keys per archetype; premature universal subset would be a hidden contract.  
3. **Does opaque reference avoid premature contract design?** **Yes** — defers field selection to manifestation investigation.  
4. **Best preserves authored meaning?** Full plan or opaque-to-full-source; subset preserves meaning only for chosen keys.  
5. **Least irreversible architectural commitment?** Opaque reference (D) and/or retain-required (A) — reversible, minimal projection.

---

## 8. Pipeline Path Compatibility

| Mechanism | Full GAM Path | Partial GAM Path | Material-Only Path | Missing Source Contract Behaviour |
| --------- | ------------- | ---------------- | ------------------ | --------------------------------- |
| **A** | **Native** (instructed retain) | **Fragile / unsupported** (array often absent) | **Unsupported** | No plan → no structure (correct silence) |
| **B** | **Adaptable** (if source retained or available at copy time) | **Fragile** (needs source at attach time) | **Unsupported** unless upstream still has plan | Must no-op — never invent |
| **C** | Same as B | Same as B | Same as B | Same |
| **D** | **Adaptable** | **Fragile** without required row | **Unsupported** | Dangling/absent ref → no resolve |
| **E** | **Adaptable** (natural bridge) | **Fragile** without source | **Unsupported** | No-op bridge |
| **F** | **Adaptable** experimentally | Same limits | Same | Empty diagnostic |

**Principle:** A viable mechanism must **not** silently fabricate structure when the upstream plan is unavailable.

---

## 9. Semantic Safety

| Mechanism | Verbatim Preservation | Transformation Required | Invention Risk | Drift Risk |
| --------- | --------------------- | ----------------------- | -------------- | ---------- |
| **A** | Yes (untouched SoT) | No | Low | Low if not rewritten |
| **B** | Yes if exact copy | Copy only | Low | Medium if plan edited after body |
| **C** | Yes for selected keys | Selection = policy | Low–Medium (omission) | Medium if subset policy drifts |
| **D** | At source | Resolve-time only | Low | Low at assembly |
| **E** | Depends on A–D payload | Bridge copy | Low if verbatim | Medium if dual stores diverge |
| **F** | Yes if verbatim projection | Framing labels only | Low–Medium if labels overclaim | Low if experiment-scoped |

---

## 10. Consumer Compatibility

| Mechanism | Diagnostic Use | Manifestation Use | Requires Renderer Awareness | Consumer Coupling |
| --------- | -------------- | ----------------- | --------------------------- | ----------------- |
| **A** | Strong (inspect orphan plans) | Needs correlation step | Only if renderer reads required_materials | Medium |
| **B** | Strong | Direct material-local | Yes for learner use | Higher |
| **C** | Strong | Direct, narrower | Yes | Medium–Higher (subset rules) |
| **D** | Strong (trace links) | Resolve then manifest | Optional (late bind) | Lower at store, higher at resolve |
| **E** | Strong (bridge reports) | Enables B/C/D on materials path | Indirect | Medium |
| **F** | Strong (experiments) | Experimental only | No production | Low |

---

## 11. Trade-Off Matrix

Scale: **1** favourable / low burden → **5** unfavourable / high burden.

| Dimension | A | B | C | D | E | F | Notes |
| --------- | - | - | - | - | - | - | ----- |
| Technical complexity | 2 | 3 | 3 | 2 | 3 | 2 | A/D reuse existing arrays/keys; B/C/E need attach logic |
| Semantic risk | 1 | 2 | 2 | 1 | 2 | 2 | Verbatim low; subset selection adds policy risk |
| Correlation risk | 3 | 3 | 3 | 2 | 3 | 3 | Shared `material_id` dependency; D makes it explicit |
| Pipeline coupling | 2 | 4 | 4 | 2 | 4 | 1 | B/C/E touch materials path; F experiment-only |
| Archetype coupling | 2 | 4 | 4 | 1 | 3 | 2 | Full/subset shapes; opaque defers |
| Maintenance burden | 2 | 4 | 4 | 2 | 3 | 2 | Four Priority-1 shapes if projected early |
| Partial-path compatibility | 4 | 4 | 4 | 4 | 4 | 3 | All weak without source plan |
| Diagnostic usefulness | 2 | 2 | 2 | 1 | 2 | 1 | Opaque + experimental projection excel for traces |
| Manifestation usefulness | 3 | 2 | 2 | 3 | 2 | 3 | Material-local easier later; opaque needs resolve |
| Reversibility | 1 | 3 | 3 | 1 | 3 | 1 | A/D/F easiest to undo |

---

## 12. Failure Modes

| Mechanism | Failure Mode | Detectability | Severity | Possible Guardrail |
| --------- | ------------ | ------------- | -------- | ------------------ |
| A | Partial path drops `required_materials` | High (absent array) | High for A-only | Detect path; do not invent |
| A | Plan retained, never consumed | Medium | Low–Medium (orphan) | Diagnostic consumer / explicit non-use |
| B/C | Wrong `material_id` correlation | Medium | High | Require ID match; refuse fuzzy match |
| B/C | Stale plan after body rewrite | Low–Medium | Medium | Generation stamp / validate plan still matches material_id |
| B/C | Authoring-only fields leaked to learners | Medium | Medium | Manifestation whitelist (later) |
| B | Renderer depends on full plan shapes | Medium | High coupling | Keep consumer optional |
| C | Premature subset omits needed field | Low until review | Medium | Evidence-led subset only; no universal enum yet |
| D | Dangling reference | High | Medium | Resolve fails closed |
| E | Dual store divergence (required vs material) | Medium | Medium | Single-writer rule; prefer copy-once |
| E | Bridge invents plan when missing | Must be prevented | **Critical** | Hard no-op if no validated source |
| F | Overclaiming labels in projection | Medium | Medium | Verbatim values only; experiment banner |
| All | Unvalidated / invalid plans preserved | Medium | Medium | Reuse `validateMaterialArchetypePlan` |
| All | Plan consumed twice (GAM + learner) | Low | Low | Distinct consume contexts |

---

## 13. Smallest Reversible Tests

| Mechanism | Smallest diagnostic step (no production commit) |
| --------- | ----------------------------------------------- |
| **A** | Fixture/path survey: how often post-GAM pages retain plan-bearing `required_materials`? |
| **B** | Offline copy of full plan onto materials in a **diagnostic** assembled JSON (experiment folder) |
| **C** | Same as B with Sprint 63 high-value keys only — compare size/utility |
| **D** | Correlation report: for each activity, map `required_materials.material_id` ↔ `materials.material_id` (match / orphan / dangling) |
| **E** | Pseudo-bridge dry-run: given a page with both arrays, list what preserve *would* attach (document only) |
| **F** | Reuse Exp 2/3 `debug_instructional_contract` pattern on one retained-required page |

**Recommendation:** Run a **bounded feasibility experiment** focused on **A retention frequency + D/ID correlation report** before locking manifestation contracts — path variance is the main unknown.

---

## 14. Candidate Classification

### Strong Candidate for Further Investigation

* **A — Retain `required_materials`** (native on full path; reversible; no new fields)  
* **D — Opaque reference** (defers contract; uses existing `material_id`; reversible)  
* **E — Preserve/normalize bridge** (as strategy to make A/D useful on materials path — investigate with A/D, not alone)

### Conditional Candidate

* **B — Full plan on material metadata** (high fidelity; higher coupling; needs reliable source + correlation)  
* **C — High-value subset on material metadata** (proportionate to Sprint 63 gains; **premature to freeze subset** until manifestation needs are clear)  
* **F — Pre-manifestation projection** (strong for experiments; not a production preservation store)

### Weak Candidate

* None beyond the excluded classes.

### Reject

* Prompt text as durable store  
* Reconstructing structure from prose  
* Index-only correlation  
* Fabricating plans when source missing  

**No single preferred production mechanism.** Bounded next experiments should stress **A + D correlation**, with **E** as optional bridge framing.

---

## 15. Findings

1. Six mechanisms in-scope; two storage anti-patterns rejected.  
2. **`material_id` is the only realistic stable correlation key**; 1:1 is **contract-intended**, not failure-proof.  
3. Full-plan on materials is high fidelity but **not clearly proportionate** as a first commitment.  
4. Subset preservation matches Sprint 63 value but is **premature to universalise** before manifestation-contract work.  
5. Opaque reference is **viable** and reduces irreversible commitment.  
6. Retain-required is **native** on full GAM, **fragile** on partial/material-only.  
7. Lowest semantic risk: A / D verbatim. Highest manifestation convenience later: B/C if correlation holds.  
8. Main systemic failure mode: **missing source on partial paths** + **silent wrong correlation**.  
9. Nothing here challenges Sprint 63 or Sprint 64 starting assumptions; path-dependence of A is a refinement already noted in Task 1.

---

## 16. Recommended Next Investigation

**Insert bounded feasibility experiment before manifestation-contract analysis (S64-BL-003):**

1. Correlation report on representative pages (`material_id` match / orphan / dangling).  
2. Retention survey: full vs partial vs material-only presence of plan-bearing `required_materials`.  
3. Optional dry-run note for what an E-bridge would attach (document only).

Then proceed to **S64-BL-003** (manifestation contracts) using Strong candidates A/D/(E) and Conditional B/C/F as inputs — still without selecting production architecture.

---

## Score-rationale appendix (selected)

* **A partial-path = 4:** Full-page retain is instructed; partial brief omits `required_materials`.  
* **B/C pipeline coupling = 4:** Touches learner materials objects and future renderer expectations.  
* **D correlation = 2:** Reference makes the join explicit vs implicit lookup.  
* **F reversibility = 1:** Experiment-scoped; proven in Sprint 63 diagnostics.
