# Sprint 61 — Charter

**Sprint:** 61 — Priority-1 Archetype Selection Reliability  
**Status:** Open — Phase A protocol **frozen**; scored baseline authorised (2026-07-15)  
**Opened:** 2026-07-15  
**Type:** Measurement and calibration (selection reliability)  
**Architecture baseline:** [Sprint 58 — closed](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)  
**Immediate predecessors (closed):**  
- [Sprint 59 closure](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CLOSURE.md)  
- [Sprint 60 closure](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CLOSURE.md)  
**Decisions:** [decisions.md](decisions.md)  
**Benchmark:** [acceptance-matrix.md](acceptance-matrix.md)  
**Phase A protocol (frozen):** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md)

---

## 1. Core research question

Can ordinary DLA planning **reliably infer and emit** the correct Priority-1 instructional archetype and a **complete** `archetype_plan` from **sparse learning-design inputs**, without:

- explicit author triggers (“use a mechanism explanation”, etc.)
- Sprint 59 test tokens (`S59_MECHANISM_TEST` / `S59_PROCESS_TEST` / `S59_MENTAL_MODEL_TEST`)
- `window.__PRISM_S59_*_TEST` flags
- fixture emission blocks
- capture stamps
- manual `instructional_archetype` JSON insertion

---

## 2. Framing (locked)

Sprint 61 is a **measurement-and-calibration sprint first**, not an architecture or expansion sprint.

| Prior proof | What Sprint 61 does **not** re-prove |
| ----------- | ------------------------------------ |
| Sprint 59 | Priority-1 MVP transfer under lab activation |
| Sprint 60 | Production SoT, mixed-archetype **routing/delivery** when valid plans already exist |

**Unmistakable distinction:**

- **Sprint 60** proved routing and delivery **when valid plans exist**.
- **Sprint 61** tests whether DLA **creates those plans unaided** from sparse briefs.

Do **not** use hand-authored DLA partials (including Sprint 60 Phase C `dla-mixed-priority1.page.json`) as evidence of spontaneous selection.

---

## 3. Starting state

| Fact | Status |
| ---- | ------ |
| Priority-1 archetypes validated (`mechanism_explanation`, `process_walkthrough`, `mental_model_building`) | Proven (Sprint 59) |
| Chain DLA → persistence → GAM routing → materials | Proven (Sprint 59/60) |
| Production SoT = `required_materials[].instructional_archetype` + `archetype_plan` | Locked (S60-D01) |
| Mixed-archetype routing + delivery without `S59_*_TEST` | PASS (Sprint 60 Phase C) |
| Durable gate `window.__PRISM_FINAL_GAM_PROMPT.archetype_delivery.pass` | Shipped (Sprint 60 Phase B) |
| Spontaneous selection from ordinary sparse briefs | **Unproven** |
| Production selection behaviour | Soft prompt guidance only (`ld-dla-page-enrich-contract.js`) |
| Omission of archetype fields | Legal; safer than incomplete plan |
| Leading hypothesis | **Under-selection** |

Sprint 58 partial-page architecture remains the baseline. Do not reopen Sprint 58, 59, or 60 closed workstreams.

---

## 4. Primary goals

1. Establish a **repeatable benchmark** for spontaneous Priority-1 selection ([acceptance-matrix.md](acceptance-matrix.md)).
2. Run ordinary DLA planning with **sparse briefs** and **no** explicit archetype instruction.
3. Measure: correct selection · omission · wrong archetype · invalid/incomplete plan · correct no-archetype omission.
4. Separate failure classes: selection · contract · persistence · delivery · (only later) generated-material quality.
5. Change guidance **only after** baseline evidence shows a reproducible failure pattern.
6. Re-run the **same** benchmark after any calibration change.
7. Decide whether selection is:
   - already reliable enough to close,
   - adequately fixable through prompt-contract calibration, or
   - requires a **separately chartered** deterministic planning mechanism.

---

## 5. Non-goals

- Priority-2 archetypes  
- Full Priority-1 support packages (purpose…validation strategy)  
- Author-facing archetype picker UI  
- Renderer work  
- Workflow-factory redesign  
- Deterministic keyword classifier in Phase A  
- Hard capture validators beyond existing schema validation  
- Generated-body quality corpus expansion  
- Removal of legacy S59 helpers unless required for benchmark integrity  
- Changes to GAM archetype rules  
- Changes to `buildWorkflowStepRecognitionContext`  
- Changes to archetype routing logic  

---

## 6. Methodological rules

1. **Measure before changing.**
2. **Sparse brief** means no explicit archetype trigger wording.
3. **Absence of an archetype is not automatically a failure** (especially on no-archetype briefs; positive briefs may still classify as `UNDER_SELECTION`).
4. Validate **contract and delivery** before evaluating teaching quality.
5. Do **not** use hand-authored DLA partials as spontaneous-selection evidence.
6. Do **not** change benchmark wording between baseline and calibration runs.
7. Do **not** treat one successful run as reliability evidence; retain raw run artefacts.

**Delivery quality rule (carry-forward):** Do not evaluate archetype quality until `archetype_delivery.pass` is true.

---

## 7. Phases

### Phase A — Baseline measurement

- Run the 10 sparse briefs with the **current** production contract.
- **Harness:** partial-page only — [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) · S61-D05.
- **Replication:** 3 runs per brief (30 scored) — S61-D06.
- **No** code or prompt changes.
- Record raw results and failure classifications in [acceptance-matrix.md](acceptance-matrix.md).

### Phase B — Minimal calibration (only if warranted)

- Identify the smallest recurring selection failure from Phase A.
- Change **DLA planning guidance only** (`buildInstructionalArchetypePlanningGuidance` / enrich-contract surface).
- Do **not** change routing, persistence, GAM rules, renderer, or schemas.
- Rerun the **unchanged** benchmark.

### Phase C — Confirmation and closure

- Confirm improvements are repeatable.
- Run a small **holdout** set not copied from benchmark wording.
- Document remaining limits.
- Recommend: close (selection adequate) **or** open a new sprint for deterministic selection.

---

## 8. Initial benchmark (10 sparse briefs)

See [acceptance-matrix.md](acceptance-matrix.md) for full rows. Summary:

| ID | Class | Sparse brief (stem) |
| -- | ----- | ------------------- |
| S61-B01 | Mechanism | Enzyme temperature mechanism |
| S61-B02 | Mechanism | Interest-rate transmission |
| S61-B03 | Mechanism | Greenhouse effect |
| S61-B04 | Process | Controlled-investigation interpretation |
| S61-B05 | Process | Empirical-paper critique |
| S61-B06 | Process | Service-outage triage |
| S61-B07 | Mental model | Thermostat-controlled heating |
| S61-B08 | Mental model | Supply-and-demand equilibrium |
| S61-B09 | No-archetype | Vocabulary orientation |
| S61-B10 | No-archetype | Lesson completion criteria |

### Benchmark conditions (every run)

- No `S59_MECHANISM_TEST` / `S59_PROCESS_TEST` / `S59_MENTAL_MODEL_TEST`
- No `window.__PRISM_S59_*_TEST`
- `selected_dla_test === "none"`
- No fixture emission block; no capture stamp
- No manual `instructional_archetype` JSON insertion
- No instruction such as “use a mechanism explanation / process walkthrough / mental model”
- Ordinary workflow inputs only
- Validate DLA capture **before** downstream delivery judgement
- Evaluate material quality **only** when `archetype_delivery.pass` is true

---

## 9. Result classifications (do not collapse to PASS/FAIL)

Ten codes. Apply **precedence** from [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §7 (S61-D08).

| Classification | Meaning |
| -------------- | ------- |
| `INVALID_TEST` | Benchmark conditions violated or incomplete artefact pack |
| `INVALID_PLAN` | Priority-1 present; plan incomplete/invalid |
| `PERSISTENCE_FAILURE` | Valid emit lost after capture/persist |
| `DELIVERY_FAILURE` | Valid persisted plans; routing/`archetype_delivery.pass` failed |
| `FALSE_POSITIVE` | Expected none; any Priority-1 emitted |
| `OVER_SELECTION` | Expected ID present with valid plan; plus extra Priority-1 IDs |
| `WRONG_ARCHETYPE` | Expected non-empty; actual excludes expected |
| `UNDER_SELECTION` | Expected Priority-1; fields omitted |
| `CORRECT_SELECTION` | `actual_set === expected_set`; plans valid |
| `CORRECT_OMISSION` | Expected none; none emitted |

---

## 10. Provisional acceptance bar

Not a hard product gate until reviewed after baseline. Measured at **brief level** after 3 runs per brief — [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §9 · S61-D10.

1. **No false positives** on B09–B10: **all 3 runs** each must be `CORRECT_OMISSION`.
2. **No** `INVALID_PLAN` results across all 30 runs.
3. **No** `PERSISTENCE_FAILURE` or `DELIVERY_FAILURE` in Phase A baseline execution.
4. **Strong majority:** ≥6 of 8 positive briefs have brief-level outcome `CORRECT_SELECTION` (majority ≥2/3 runs).
5. Each Priority-1 ID has **≥1** positive brief with brief-level `CORRECT_SELECTION`.
6. Every failure classified **before** any prompt change.
7. Holdout set supports the same conclusion (Phase C; not worse on the same dimensions).

If baseline misses this bar and calibration cannot reach it without schema/routing/UI changes, **do not stretch Sprint 61** — recommend a successor sprint for deterministic selection.

---

## 11. Exit criteria

- [ ] Benchmark completed under valid no-trigger conditions (30 scored partial-page runs)
- [ ] Every result classified (no collapsed PASS/FAIL-only logging)
- [ ] Baseline selection behaviour documented
- [ ] Any calibration supported by Phase A evidence (or Phase B explicitly skipped)
- [ ] Benchmark rerun after calibration, if calibration occurs
- [ ] Holdout confirmation completed
- [ ] No routing / persistence regressions vs Sprint 60 baseline
- [ ] `current-state.md`, decisions, and handoff docs updated
- [ ] Explicit recommendation recorded:
  - selection reliable enough to close, **or**
  - open a new sprint for a deterministic selection mechanism

---

## 12. Pipeline / ownership (unchanged)

```text
LO → EP shell → DLA partial → GAM partial → Assessment → LS partial → DP synthesis → assembly → render
```

| Owner | Owns |
| ----- | ---- |
| DLA | Activity scaffolds + optional Priority-1 planning on `required_materials` |
| GAM | `materials[]` + conditional archetype routing when plans present |
| Assembly / Renderer | Deterministic merge / presentation only |

**Material type ≠ instructional archetype.**

---

## 13. Links

- [SPRINT-61-START-HERE.md](SPRINT-61-START-HERE.md)  
- [next-chat-briefing.md](next-chat-briefing.md)  
- [acceptance-matrix.md](acceptance-matrix.md)  
- [backlog.md](backlog.md)  
- [decisions.md](decisions.md)  
- [links-to-predecessors.md](links-to-predecessors.md)  
- [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md)  
- [Sprint 59 closure](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CLOSURE.md)  
- [Sprint 60 closure](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CLOSURE.md)  
- [Sprint 58 closure](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/SPRINT-58-CLOSURE.md)
