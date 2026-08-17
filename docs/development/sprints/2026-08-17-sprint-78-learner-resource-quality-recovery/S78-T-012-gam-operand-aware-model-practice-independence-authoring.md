# S78-T-012 — GAM operand-aware model/practice independence authoring repair

**Task:** S78-T-012  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** GAM Stage-1 prompt-contract repair (S78-WS-2)  
**Depends on:** [S78-T-010](S78-T-010-modelling-practice-independence-solution-design.md), [S78-T-011](S78-T-011-dla-model-practice-independence-commissioning.md)  
**Does not include:** Semantic fingerprinting, Lagrangian regeneration, T-013 integration verification

---

## 1. Implementation summary

Implemented **S78-WS-2 GAM Stage-1** operand-aware model authoring:

- New `lib/gam-practice-independence-prompt.js` — collects authoritative `practice_independence` bindings and builds the **S78-WS-2 MODEL-PRACTICE-INDEPENDENCE (auto-applied)** block
- Injected immediately after authoritative DLA commission JSON in `buildAuthoritativeDlaMaterialCommissionSectionFromPage` (`app.js`) — primary salience surface at material authoring time
- SP-06 / SP-07 cross-reference lines when WS2 bindings exist (no duplicate instructional sections)
- GAM partial contract one-line pointer to WS2 block (`lib/ld-gam-page-enrich-contract.js`)
- Browser load via `index.html`
- Regression tests: `tests/s78-gam-practice-independence-prompt.test.js` (G1–G8 + verification)

**No semantic validators. No DLA changes. No assembly/renderer changes.**

---

## 2. Live GAM prompt assembly path

```text
GAM Copy / Prompt Studio (generate activity materials)
  → buildUpstreamDlaPageEmbedSectionForGamCopy(wf)
      → buildAuthoritativeDlaMaterialCommissionSectionFromPage(partialPage)
          → projectGamAuthoritativeDlaCommissionFromPage(page)   // T-023 JSON incl. practice_independence
          → buildS78Ws2OperandAwareAuthoringBlock(page)        // per-binding operand rules (NEW)
  → instructional-pattern blocks (SP-06 / SP-07) appended to draft when GAM step
  → ld-gam-page-enrich-contract partial contract
  → per-material body authoring
```

The WS2 block sits **directly after** the commission JSON Copilot sees — locally authoritative for each bound model row before SP-06 pattern rules apply.

---

## 3. Authoritative WS2 input consumed

From T-023 projection (`projectGamAuthoritativeDlaCommissionFromPage`):

```json
{
  "material_id": "A3-M2",
  "material_type": "worked_example",
  "practice_independence": {
    "attempt_operand_material_ids": ["A3-M1"]
  }
}
```

GAM reads `attempt_operand_material_ids` from the commission — **does not infer** model/attempt pairing from task verbs.

---

## 4. Exact operand-aware authoring invariant

**Same method + distinct operand + independent reasoning**

For each model row with `practice_independence`:

1. Demonstrate the **same target method/capability** on a **distinct comparable operand**
2. **Must not** use bound attempt operand(s) as the worked instance
3. **Must not** copy, restate, solve, answer, or substantially complete load-bearing reasoning for bound operand(s)
4. Preserve deliberate near transfer

---

## 5. SP-06 / SP-07 changes

| Pattern | Change |
| ------- | ------ |
| **SP-06** | One cross-reference line: when S78-WS-2 block lists a model `material_id`, per-binding operand rules are authoritative; Bridge transfers method only |
| **SP-07** | One cross-reference line: when model row carries `practice_independence`, `sample_output` must not pre-answer bound attempt operands |

Replaced remote-only MP-1 wording with explicit WS2 marker cross-reference — not a second full instructional section.

---

## 6. Bridge semantics

WS2 block and SP-06 retain:

- **Permitted:** method, sequence, decision process, criteria, strategy transfer via **Bridge:**
- **Forbidden:** attempt answer, attempt-specific calculations, final conclusion, completed load-bearing reasoning

Bridge = **“apply this method”** — not **“copy this solution with substitutions.”**

---

## 7. Guided-practice behaviour

No WS2 block emitted when page has no `practice_independence` bindings (G4, G5).

Guided-only activities without DLA binding retain existing SP-06/07 behaviour — no generic prohibition against hints, partial steps, or scaffolded examples where independence is not commissioned.

---

## 8. Multiple-operand behaviour

One model may bind multiple `attempt_operand_material_ids`. Per-binding line lists all learner-owned operands; model must use a **different near-transfer instance** and not disclose/complete **any** bound operand. One illustrative model operand suffices (G6).

---

## 9. WS1 coexistence

WS2 block explicitly preserves `response_fulfilment` blank cells on workspace rows (G7).

Example A3: M2 model + `practice_independence` → M1 attempt + M3 learner workspace with `response_fulfilment` — all three roles preserved in commission JSON and WS2 prose.

---

## 10. P02 / evidence preservation

No changes to `evidence_decision`, `evidence_requirement`, provider closure, or T-009 output-surface repair. Evidence provider relationships remain separate from practice operand bindings.

---

## 11. G1–G8 tests / results

| Test | Result |
| ---- | ------ |
| G1 bound model | **PASS** — distinct-operand + learner-owned language in commission section |
| G2 method continuity | **PASS** — same target method/capability requirement |
| G3 bridge | **PASS** — method transfer permitted; attempt answer forbidden |
| G4 no binding | **PASS** — no WS2 block without `practice_independence` |
| G5 guided practice | **PASS** — no binding inferred without authoritative metadata |
| G6 multiple operands | **PASS** — all bound ids listed; distinct-from-all requirement |
| G7 WS1 coexistence | **PASS** — `response_fulfilment` + `practice_independence` both present |
| G8 Lagrangian-shaped | **PASS** — near-transfer instance / do-not-disclose operands |

**Suite:** `tests/s78-gam-practice-independence-prompt.test.js` — **13/13 pass**

---

## 12. Existing suites run / results

| Suite | Result |
| ----- | ------ |
| `s78-gam-practice-independence-prompt.test.js` | 13/13 |
| `s78-dla-practice-independence.test.js` | 16/16 |
| `s78-dla-response-fulfilment.test.js` | pass |
| `s78-gam-workspace-blank-cell.test.js` | pass |
| `workflow-instructional-pattern-prompt.test.js` | pass (SP-06/07 unchanged structure) |
| `page-gam-enrich.test.js` | pass |
| `page-gam-materials-projection.test.js` | pass |
| `ld-instructional-archetype-assembled-gam-prompt.test.js` | pass |
| `ld-dla-canonical-assembler.test.js` | pass |
| `ld-dla-evidence-decision-consistency-prompt.test.js` | pass |

**Combined regression batch:** **185/185 pass** (includes new T-012 tests). No unrelated pre-existing failures observed.

---

## 13. Assembled GAM prompt verification

Representative Lagrangian-shaped WS2 commission (A3-M2 model → A3-M1 operand → A3-M3 workspace) verified in assembled `buildAuthoritativeDlaMaterialCommissionSectionFromPage` output:

1. **Model material:** `A3-M2 (worked_example)` in per-binding line ✓
2. **Attempt operand(s):** `A3-M1 (scenario)` listed as learner-owned ✓
3. **Distinct operand:** “author this model on a different near-transfer instance” ✓
4. **Same method:** “demonstrate the same target method/capability on a DISTINCT comparable operand” ✓
5. **No attempt disclosure:** “MUST NOT copy, restate, solve, answer, or substantially complete load-bearing reasoning” ✓
6. **Learner workspace:** “preserve response_fulfilment blank cells on workspace rows” + JSON retains A3-M3 binding ✓

---

## 14. Prompt size before / after

| Surface | Delta |
| ------- | ----- |
| WS2 auto-applied block (1 binding) | **+1,055 chars** |
| SP-06 cross-reference line | **+1 line** (~230 chars in full SP-06 block) |
| SP-07 cross-reference line | **+1 line** (~130 chars in full SP-07 block) |
| GAM partial contract | **+1 line** |
| Authoritative commission section (Lagrangian-shaped fixture) | JSON ~1,400 chars + WS2 ~1,055 chars |

Repair is **bounded** — primary salience via post-commission block; SP-06/07 strengthened by cross-reference rather than duplicated sections.

---

## 15. DLA changes

**None** (T-011 owns DLA WS2 commissioning).

---

## 16. GAM production / prompt files changed

| File | Role |
| ---- | ---- |
| `lib/gam-practice-independence-prompt.js` | **NEW** — WS2 block builder |
| `lib/instructional-pattern-prompt.js` | SP-06 / SP-07 cross-references |
| `lib/ld-gam-page-enrich-contract.js` | Contract pointer |
| `app.js` | Commission-section injection + test API |
| `index.html` | Script load |
| `tests/prism-vm-lib-bootstrap.js` | Test sandbox load |

---

## 17. GAM validator changes

**None** — existing capture validators unchanged.

---

## 18. Assembly changes

**None**

---

## 19. Renderer changes

**None**

---

## 20. Semantic fingerprint / leak validation

**None** — Stage 1 prompt-contract only.

---

## 21. Test files changed

| File | Change |
| ---- | ------ |
| `tests/s78-gam-practice-independence-prompt.test.js` | **NEW** — G1–G8 + verification |
| `tests/prism-vm-lib-bootstrap.js` | Load new lib |

---

## 22. Documentation files changed

| File | Change |
| ---- | ------ |
| `S78-T-012-gam-operand-aware-model-practice-independence-authoring.md` | **NEW** (this record) |
| `STATUS.md` | T-012 complete; T-013 queued |
| `PLAN.md` | T-012 section + programme phase |
| `SPRINT-78-START-HERE.md` | Immediate priority update |

---

## 23. Deviations from T-010 / T-011

None material. Implementation follows T-010 Stage-1 GAM design and consumes T-011 `78-DLA-WS-2` bindings without redesign.

---

## 24. Remaining WS2 gap

- **No semantic proof** that GAM-authored model bodies honour operand independence on regeneration
- Fresh-generation reliability unverified until **S78-T-013**
- If T-013 shows prompt-contract insufficient, Stage 2 (semantic guard) would be designed separately — out of T-012 scope

---

## 25. Recommended next task

> **S78-T-013 — Workstream 2 integration verification using fresh generation, followed by benchmark QA.**

Do **not** regenerate Lagrangian benchmark until T-013 is authorised and executed.
