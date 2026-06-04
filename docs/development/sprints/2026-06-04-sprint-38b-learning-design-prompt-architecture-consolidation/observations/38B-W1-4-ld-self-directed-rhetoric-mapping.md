# PR-W1-4 — LD-SELF-DIRECTED-RHETORIC mapping and size accounting

**Date:** 2026-06-04  
**Change class:** CC-MODULE  
**Baseline (pre-W1-4):** post PR-W1-3 four-step sum **156,571** (self-directed augmented)  
**38B-1 baseline:** **152,782**  
**Canonical source:** `lib/ld-self-directed-rhetoric.js`

---

## 1. Inventory → taxonomy

| Former block (10 markers) | Layer | → Canonical section |
|---------------------------|-------|---------------------|
| Learner-action rhetoric | L7 | Learner voice |
| Worked-example / faded | L5 | Worked example / fading |
| Embedded feedback / misconception | L5 | Misconception |
| Concept/procedure integration | L5 | Concept/procedure |
| Metacognitive closure | L5 | Closure / transfer (merged) |
| Session orientation | L5 | Session journey |
| Conceptual tension / difficulty | L5 | Difficulty types |
| Intellectual progression | L5 | Progression |
| Epistemic synthesis / closure | L5 | Closure |
| Transfer / durable understanding | L5 | Transfer |

**Not in module:** DLA material shape, activity framing, output contract, timeline; GAM reading/voice; Design Page field preservation; Sprint 38; `LD-TABLE-FIDELITY`, `LD-MATERIALS-COPY`, `LD-MATH-RENDER`.

**Role riders (1 line each):** `design_page`, `gam`, `assessment`; DLA uses core only (`dla` / `core`).

---

## 2. Measured probe (`probe-38b1-ld-workflow-prompt-audit.js`, self-directed)

| Step | Post W1-3 | Post W1-4 | Δ W1-4 | Markers W1-3 → W1-4 |
|------|----------:|----------:|-------:|---------------------|
| DLA | 39,106 | **18,054** | **−21,052** | 14 → **5** |
| GAM | 37,226 | **16,370** | **−20,856** | 15 → **6** |
| Assessment | 32,034 | **11,109** | **−20,925** | 11 → **2** |
| Design Page | 48,205 | **27,345** | **−20,860** | 15 → **6** |
| **Four-step sum** | **156,571** | **72,878** | **−83,693 (−53.5%)** | — |

**vs 38B-1 (152,782):** **−79,904 (−52.3%)** — Wave 1 charter **−15%** target (**≤129,865**) **met**.

**Canonical block sizes (lib):** core **3,412**; + design_page rider **3,604**; + gam **3,608**; + assessment **3,539**.

---

## 3. Marker list (post W1-4, self-directed)

**DLA (5):** Material shape, Activity framing, Timeline sequencing, `LD-SELF-DIRECTED-RHETORIC`, `LD-MATH-RENDER`.

**GAM (6):** `LD-TABLE-FIDELITY`, Reading sufficiency, Material voice, Timeline sequencing, `LD-SELF-DIRECTED-RHETORIC`, `LD-MATH-RENDER`.

**Assessment (2):** `LD-SELF-DIRECTED-RHETORIC`, `LD-MATH-RENDER`.

**Design Page (6):** Field preservation, `LD-SELF-DIRECTED-RHETORIC`, Sprint 38 visual, Sprint 38 pedagogical, Materials fidelity (embeds L4 modules), `LD-MATH-RENDER`.

---

## 4. Remaining duplication (W1-5 / Waves 2–3)

| Location | Wave |
|----------|------|
| DLA output contract + JSON example (~large) | W1-5 trim / pack |
| Pack session-orientation / rhetoric echoes | 2a–3 |
| PEL orientation / reasoning blocks | 2b–3 (`LD-PEL-*`) |
| `app.js` inline bootstrap mirrors four `lib/ld-*.js` | post W1-5 |
| Design Page pack §13 template bulk | Wave 3 |
| Pedagogic cognition scaffold (brief-gated) | keep / consolidate later |

---

## 5. Validation (38B-6 / 38B-7)

| Check | Status |
|-------|--------|
| L8-01 | **PASS** — **722/722** |
| MR-04 single lib authority | **Met** |
| GAP-02 markers | **Decreased** on all four heavy steps |
| S12 −15% four-step | **Met** (72,878 ≤ 129,865) |
| S5 one rhetoric marker | **Met** |
| No Sprint 38 / renderer / VEU / schema changes | **Met** |

---

## 6. Wiring

| File | Change |
|------|--------|
| `lib/ld-self-directed-rhetoric.js` | Canonical module |
| `app.js` | `applyLdSelfDirectedRhetoricContractToDraft`; ten builders → deprecated wrappers; ~25k lines removed from builder bodies |
| `index.html` | Script tag |
| `tests/prism-vm-lib-bootstrap.js` | Preload |
| Probes + fidelity/formatting tests | Preload |
| `stripInternalPromptContractsFromVisibleText` | LD-SELF-DIRECTED-RHETORIC + legacy rhetoric leak patterns |
| `tests/ld-self-directed-rhetoric.test.js` | 4 tests |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Marker → module ID; substance anchors retained |
