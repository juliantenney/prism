# Sprint 38S Handover Pack

**Date:** 2026-06-08 · **Sprint status:** Implementation **CLOSED — SUCCESS** (harness); **Phase 2 prompt sanitisation + manual workflow hardening in progress**

**Index:** [README.md](README.md) · **Charter:** [../IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## 1. Current architecture state

**Prism** builds prompts for a **manual Copilot workflow**: copy step prompt → run in Copilot → paste output into step capture textareas. Downstream prompts must embed upstream artefacts in the **final copied text**.

**Frozen pipeline:** `KM → LO → Design Episode Plan → DLA → GAM → Page`

**Episode Plan V1 (frozen):** `activity_id` + `episode_plan { archetype, beats[{ function }] }` — archetypes `understand|apply|analyse|evaluate` only; beat order is authoritative.

**Responsibility:** Episode Plan = planning · DLA = population-only · GAM = realisation · Page = compose/render.

**Key code:** `lib/episode-plan-dla-integration.js`, `lib/episode-plan-population-contract.js`, `lib/episode-plan-v1-validation.js`, `lib/workflow-artefact-json-strict.js`, `app.js` (chaining, runtime augmentation, copy handler).

---

## 2. Completed phases

| Area | Status |
|------|--------|
| 38S-1–6 Implementation + harness proof | ✅ `EV-38S-AFTER-4` fullOk |
| First-class Design Episode Plan step | ✅ |
| Phase 2A DLA subtraction | ✅ |
| Phase 2B GAM dedupe (first 3 items) | ✅ |
| Phase 2B-b PEL audit | ✅ Read-only |
| Phase 2B-b.1 Runtime thinness alignment | ✅ |
| PF-11 chaining fixes (rounds 1–2) | ✅ Code + tests |
| EP strict fenced JSON + STEP footer | ✅ |

---

## 3. Prompt reductions achieved

| Layer | Δ |
|-------|---|
| DLA pack (2A) | **−6,102 chars (−18.4%)** |
| GAM pack (2B) | **−6,435 chars (−22.7%)** |
| Runtime DLA (2B-b.1) | −203 chars |
| Runtime GAM (2B-b.1) | +122 chars (closure aligned to GAM-PRES-08) |

Phase 1 estimated larger DLA reduction if DLA-WB also deduped; 2A removed IFP-00–03, 07, 08 only.

---

## 4. Runtime alignment (2B-b.1)

- DLA output contract: depth_floor L3 wording (removed “short/concise”)
- Example JSON: ≥150-word excerpt spec
- PEL orientation/reasoning → pointers to OUTPUT CONTRACT
- LD-SELF-DIRECTED-RHETORIC closure → GAM-PRES-08 minima
- **Not changed:** `buildSelfDirectedGamPelReasoningMaterialPromptBlock` (deferred 2B-b.2)

---

## 5. Known working components

- Deterministic EP derive + V1 validation gate
- Population contract + obligation tagging
- Additive merge on harness path (R1)
- GAM pack-text + pre-compose validation
- Strict JSON capture (KM/LS/LO/EP; STEP footer stripped at validation)
- DLA auto-bindings for `episode_plans`
- Tests + `ev-38s-production-pipeline-chase.mjs` green

---

## 6. Known open issues

1. Manual **Inflation UI re-run** not confirmed post all Phase 2 + copy fixes
2. Large prompt debt: DLA IFP-04–10 + DLA-WB; GAM sediment (~35–50% per audit)
3. GAM PEL reasoning materials block not aligned (2B-b.2)
4. DLA checklist ~4-item cap vs L3 depth (PEL audit conflict)
5. PF-11 round 2 not yet in a dedicated observation doc

---

## 7. Active hypotheses

- Shallow materials = **signal competition + length**, not missing GAM depth rules (GAM-PRES-07/08 strong)
- **`workshop` in brief** suppresses worst GAM PEL block via facilitated-delivery gate
- PF-11 latest = **prompt injection failure**, not missing capture

---

## 8. Known non-problems

- V1 schema — frozen and working
- Harness M-01–M08 + fullOk on EV-38S-AFTER-4
- Population contract semantics
- 38S-6 closure valid for **implementation + harness** (not manual re-verification)

---

## 9. Latest PF-11 diagnosis and fix

**Symptom:** Valid `episode_plans` in capture; Copilot returns `{ "error": "PF-11: missing episode_plans upstream" }`.

**Round 1:** Capture sync, bindings, resolver alignment — [38S-episode-plan-dla-chaining-fix.md](38S-episode-plan-dla-chaining-fix.md), [38S-pf11-dla-upstream-resolution-fix.md](38S-pf11-dla-upstream-resolution-fix.md).

**Round 2 root cause:** `applyEpisodePlanDlaPopulationPromptBlockToDraft` deduped with `/upstream episode_plans/i`. DLA pack already contains that phrase (*“upstream episode_plans owns archetype…”*), so `### Upstream episode_plans` JSON was **never injected**. Copilot obeyed population gate → PF-11.

**Round 2 fixes (in code):**

1. Dedup → `/### Upstream episode_plans/i`
2. Bindings embed normalizes valid capture to pretty JSON
3. Copy diagnostic: `[PRISM DLA copy diagnostic]` in console + `state.workflowRunDlaCopyDiagnostic`

**EP footer:** `STEP N OUTPUT: episode_plans` restored **outside** fenced JSON block.

**Manual verify:** Copy DLA → expect `has_authoritative_upstream_section: true`, `has_pf11_guard: false`.

---

## 10. PEL audit summary (2B-b)

Runtime adds ~18k DLA / ~12k GAM on self-directed learner-page workflows. **Keep:** population block, LD-TABLE-FIDELITY, LD-MATERIALS-COPY, math render, timeline, reading sufficiency. **Merge/remove:** duplicated PEL blocks, thin closure bullets, GAM PEL reasoning materials (often gated off for Inflation `workshop` briefs).

---

## 11. Inflation workflow status

| Aspect | Status |
|--------|--------|
| Harness `EV-38S-AFTER-4` | ✅ fullOk |
| Manual step-by-step UI | ⚠️ Re-run pending |
| Expected path | LO → EP (fenced JSON + STEP footer) → DLA (must include `### Upstream episode_plans`) → GAM → Page |

---

## 12. Recommended next actions

1. Manual Inflation re-run + DLA copy diagnostic check
2. Write observation doc for PF-11 round 2
3. Phase 2B-b.2 — GAM PEL reasoning materials alignment
4. Phase 2B-c — GAM notes rewrite + further dedupe
5. Optional DLA-WB dedupe (Phase 1 larger reduction target)

---

## Quick paths

| Item | Path |
|------|------|
| Phase 2 index | [README.md](README.md) |
| 2A | [38S-prompt-sanitisation-phase-2a-dla-only.md](38S-prompt-sanitisation-phase-2a-dla-only.md) |
| 2B audit / dedupe | [38S-prompt-sanitisation-phase-2b-gam-audit.md](38S-prompt-sanitisation-phase-2b-gam-audit.md) |
| PEL audit | [38S-prompt-sanitisation-phase-2b-b-pel-audit.md](38S-prompt-sanitisation-phase-2b-b-pel-audit.md) |
| Runtime 2B-b.1 | [38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md](38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md) |
| EV chase | [../artefacts/ev-38s-production-pipeline-chase.mjs](../artefacts/ev-38s-production-pipeline-chase.mjs) |

**Constraints:** V1 frozen · EP owns planning · DLA population-only · inspect **final copied prompt text** for manual workflow bugs.
