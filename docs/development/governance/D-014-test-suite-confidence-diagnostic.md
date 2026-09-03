# D-014 — Test-suite confidence diagnostic

**Date:** 2026-08-28 (diagnostic) · **Repair:** 2026-08-28 (RC1/RC2 bounded)  
**Mode:** Diagnostic accepted → **bounded RC1/RC2 repair implemented** (this record)  
**Sprint context:** Sprint 80 is **CLOSED**. This record is **post-alpha engineering**. It does **not** reopen Sprint 80.  
**Debt ID:** [D-014](ARCHITECTURAL-DEBT.md#d-014--test-suite-baseline-instability-and-order-dependence) (governance ledger)  
**Disposition:** **A — D-014 CONFIDENCE ISSUE RESOLVED** (see §11)

---

## Verdict (one screen)

| Question | Answer |
| -------- | ------ |
| Does D-014 block the working-alpha product claim? | **No.** First-class journey tests remain green. |
| What was D-014 mainly? | **RC1** missing vNext inject in app.js vm sandboxes; **RC2** inventory artefact race; residual stale contracts. |
| Repair status | **RC1/RC2 done.** True `Learner renderer vNext is not available` asserts = **0**. Inventory flake = **0** across two full runs. |
| First-class CI gate | `npm run test:first-class` → **339/339** (includes S80 **229/229**). |
| Historical full suite | Still noisy (**419** stable failing locations). Absolute count is **not** the confidence criterion. |
| Disposition | **A — CONFIDENCE ISSUE RESOLVED** |

---

## 1. Baseline

### Reproduction command / environment

```text
node --test "tests/**/*.test.js"
```

- Node: `v24.15.0` (Windows / PowerShell host; UTF-8 capture via `cmd /c … > file`)
- Definition of **failing location:** unique `^test at <file>:<line>:` line from Node’s failing-tests summary (not raw assertion count; not suite name alone).

### Two equivalent runs (default concurrency)

| Run | tests | pass | fail | skipped | unique failing locations |
| --- | ----- | ---- | ---- | ------- | ------------------------ |
| 1 | 4014 | 3619 | 394 | 1 | **394** |
| 2 | 4014 | 3620 | 393 | 1 | **393** |

- Intersection: **393** locations stable across both runs.
- Only run-1 exclusive location: `tests\learner-renderer-vnext-support-note-family-phase6.test.js:212:1` (inventory rebuild assertion — see §3).
- Baseline remains **≈393** (matches Sprint 80 S8 closeout). Absolute fail count alone is still slightly run-variant; **set membership** is the useful signal.

### Serial full suite (`--test-concurrency=1`)

| Metric | Value |
| ------ | ----- |
| tests / pass / fail | 4014 / 3620 / **393** |
| phase6 inventory flake | **absent** |
| `Learner renderer vNext is not available…` | still **~201** occurrences in the failure dump |

Serialisation removes the inventory race flake; it does **not** clear the dominant harness cluster.

---

## 2. Failure clustering (root-cause map)

~393 locations collapse into a small number of clusters.

### Cluster RC1 — Missing vNext inject in app.js vm sandboxes (**~197 locations, 26 files**)

| Field | Evidence |
| ----- | -------- |
| Message | `Learner renderer vNext is not available in this runtime.` |
| Product code | `app.js` `runLearnerRendererVNextExport` requires `window.PRISM_LEARNER_RENDERER_VNEXT` (no Node `require` fallback). |
| Test pattern | Many suites load `app.js` in `vm` via `runPrismLibScriptsInSandbox(…, PEDAGOGICAL_ICON_LIBS)` **without** `injectLearnerRendererVNextInSandbox` / `loadLearnerRendererVNextBrowserInSandbox`. |
| Top files | `utility-renderer-kitchen-sink` (43), `utility-page-render` (24), `utility-ld-inflation-page-render` (19), marx/RNA/markdown/self-directed/sprint-38/50/51 render suites, … |
| Alone? | **Fails in isolation** (kitchen-sink 44/45 fail; utility-page-render 24/25 fail) — **not** order-dependent. |
| Cascade? | Yes within file: one missing global → almost every render assertion fails. Secondary symptoms in suites that ignore `r.error` and assert on empty HTML (e.g. beat-first “expected A1 activity block”). |
| Diagnostic probe | Throwaway inject probe (deleted after run): without inject → exact unavailable error; with `injectLearnerRendererVNextInSandbox` → unavailable cleared and HTML produced. |

**Classification:** **A. TEST-HARNESS DEFECT** (setup incomplete relative to current product path).

### Cluster RC2 — Shared inventory artefact race (**1–few flake locations**)

| Field | Evidence |
| ----- | -------- |
| Suites | `learner-renderer-vnext-*-phase{2,3,6,7,8}`, kitchen-sink inventory checks — each `execFileSync(scripts/build-gam-renderer-type-inventory.js)` then reads the **same** docs artefact JSON paths. |
| Alone? | phase3 / phase6 **pass 100% in isolation**. |
| Full suite? | phase6 `:212` appeared in run 1, absent in run 2 and in serial run. |
| Mechanism | Concurrent writers/readers of one inventory file under default test concurrency. |

**Classification:** **B. TEST-ISOLATION / SHARED-STATE DEFECT**.

### Cluster RC3 — Sections-only / non-activities fixtures vs vNext validate-input (**~12**)

| Field | Evidence |
| ----- | -------- |
| Message | `Page activities must be an array.` (`INVALID_ACTIVITIES`) |
| Suites | `mathjax-delimiter-preservation` (11 alone), part of `page-render-vnext-adapter` |
| Alone? | **Fails in isolation** even when adapter injects vNext. |
| Nature | Fixtures/calls still feed section-shaped pages into a path that now requires `activities[]`. |

**Classification:** mostly **C. STALE TEST / SUPERSEDED CONTRACT** (post-vNext). Confirm case-by-case before rewriting product.

### Cluster RC4 — Historical learner-renderer compose / golden / certification (**~40–60**)

| Field | Evidence |
| ----- | -------- |
| Suites | `learner-renderer-vnext-compose-a*`, golden, multipart, certification, kitchen-sink mapping, interaction-improvements, … |
| Alone? | e.g. compose-a2 **6 fail / 10** in isolation (direct `require` of vNext — not RC1). |
| Nature | Strict equality / deep-equal / HTML regex against older composition shapes. |

**Classification:** predominantly **C**; residual **D/F** only if a supported export path is proven wrong (not shown for alpha journey proxies).

### Cluster RC5 — S78 workspace unbound production gates (**~12**)

| Message | `S78_WS_UNBOUND_PRODUCTION: … requires response_kind=text_compose…` |
| Suites | s75/s76/s72/ld-instructional-archetype mixed acceptance |
| Alone? | Deterministic contract assertions (product gate vs older fixtures). |

**Classification:** **C** and/or intentional **D** for older fixtures — **not** first-class Adjustments/CAI alpha path.

### Cluster RC6 — Prompt / pack string contracts (**~10+**)

| Examples | “Execution mode: autonomous…”, PEL/DLA role prose, cognition pack step titles, cache-bust `app.js?v=…` |
| Nature | Frozen string expectations vs evolved pack/prompt text. |

**Classification:** **C. STALE TEST**.

### Cluster RC7 — Typography / CSS export expectations (**~10**)

| Suite | `sprint-55-typography-foundation` (injects vNext; still fails `max-width:68ch` etc. in isolation) |
| Classification | **C** or minor **D** for export CSS — **not** Create→Adjust→Run alpha blocker. |

### Cluster RC8 — Residual mixed (**remainder**)

Bool/count mismatches in page-38*, sequencing, workflow framing, hetero fixtures, etc. Mix of **C** and **F**; none observed in the first-class alpha suites below.

---

## 3. Order dependence (evidence)

| Probe | Result |
| ----- | ------ |
| phase6 alone | 11/11 pass |
| phase3 alone | 4/4 pass |
| kitchen-sink then phase6 | kitchen fails (RC1); **phase6 still passes** |
| math then phase6 | math fails (RC3); **phase6 still passes** |
| Two full parallel runs | **1** location flips (phase6 inventory) |
| Full serial | inventory flake **gone**; RC1 unchanged |

**Conclusion:** Order/concurrency dependence is **real but narrow** (shared inventory file writers). The bulk of D-014 is **deterministic harness / stale-contract failure**, not mysterious cross-suite renderer pollution.

Earlier Sprint 80 notes that phase3/phase6 “pass alone, fail in suite” remain valid; this diagnostic pins the mechanism to **inventory rebuild races**, not general DOM/global leakage.

---

## 4. First-class alpha signal

Supported journey (T-008): Create → Save → Adjust → Run/Copy → capture → assemble → learner render for self-study / workshop / governed Adjustments / CAI default assessment.

| Suite / proxy | Result | In full-suite failing locations? |
| ------------- | ------ | -------------------------------- |
| Focused S80 S1–S8 (`tests/s80-s*.test.js`) | **229/229** | **No** |
| `unified-workflow-settings.test.js` | **38/38** | **No** |
| `s75-authoring-assembly-learner-ready.test.js` | **10/10** | **No** |
| `s75-new-workflow-lifecycle` + `s75-run-capture-persistence` + `page-vnext-assemble` | **52/52** | **No** |

**D-014 impact on first-class tests:**

| Mode | Finding |
| ---- | ------- |
| Genuine fail under D-014 | **Not observed** for the above |
| Fail only through contamination | **Not observed** |
| Unreliable under full suite | **No** — they do not appear in the failing-location set |
| Independently trustworthy | **Yes** |

Highest-priority answer: **D-014 does not conceal failures in the first-class working-alpha journeys.** It **does** drown the engineering signal in historical utility/renderer noise.

---

## 5. Root-cause classification summary

| ID | Cluster | Class | Alpha journey impact | Immediate repair? |
| -- | ------- | ----- | -------------------- | ----------------- |
| RC1 | Missing vNext inject (~197) | **A harness** | None (tests wrong setup) | **Yes — bounded** |
| RC2 | Inventory file race | **B isolation** | None | Yes — small (tmpdir/lock/serialise those tests) |
| RC3 | activities[] contract | **C stale** (mostly) | None for governed path | After RC1; do not silently weaken |
| RC4 | Compose/golden history | **C** (+F) | Not shown on alpha proxies | Backlog; retire or refresh deliberately |
| RC5 | S78 unbound gates | **C/D** on old fixtures | Not Adjustments/CAI alpha | Separate honesty programme |
| RC6 | Prompt string freezes | **C** | None | Retire/update with pack owners |
| RC7 | Typography CSS | **C/D** minor | None | Optional |
| — | Real alpha product defect | **Not proven** | — | — |

No **E environment/tooling** defect beyond normal Node test concurrency. No classification of “393 product bugs.”

---

## 6. Minimum confidence target

**Do not** target “0 failures in the entire historical suite” as the confidence criterion.

**Smallest evidence-backed target:**

1. **Repair RC1** so utility/page `buildUtilityStructuredHtmlForTest` sandboxes always inject vNext (shared helper preferred over 26 copy-pastes). Expect collapse of ~197 failing locations and many empty-HTML secondaries.
2. **Pin a first-class CI suite** as the merge/gate signal, e.g. S80 focused set + unified workflow settings + authoring/assemble/capture proxies (+ optional `learner-renderer-vnext-browser-registration`). Require green on that set every change.
3. **Neutralise RC2** (inventory isolation) so full-suite location diffs stop flickering by ±1.
4. Treat remaining historical failures as a **known backlog** measured by location-set diff, not vanity zero.

If after (1)+(3) the residual set is still large, that is acceptable **provided** (2) stays green.

---

## 7. Implementation decision

### **A. BOUNDED FIX RECOMMENDED**

One proven harness cause (RC1) plus a tiny isolation fix (RC2) can be repaired safely in a small post-alpha engineering task without reopening Sprint 80, redesigning Adjustments, or rewriting renderer architecture.

**Not chosen:**

- **B** — broader isolation programme is useful later, but the primary mass is a concrete missing inject, not ambient pollution.
- **C** — no proven supported-alpha product defect from this diagnostic.
- **D** — remaining noise still justifies a small RC1/RC2 cleanup so location-diff method stays cheap.
- **E** — evidence is sufficient to act on RC1/RC2 and to trust the first-class suite.

**STOP:** no repair implemented in this diagnostic (probe only; deleted afterward).

---

## 8. Boundaries respected

Did **not:** reopen Sprint 80; redesign Adjustments; clean Settings/factors; fix D2/D3; change assessment scope; begin accessibility; mass-update snapshots; skip/suppress/weaken tests; rewrite renderer architecture.

---

## 9. Record / files

### Documentation

| File | Action |
| ---- | ------ |
| This diagnostic | Created |
| `docs/development/governance/ARCHITECTURAL-DEBT.md` (D-014) | Updated pointer + state |
| Sprint 80 `ARCHITECTURAL-DEBT.md` / `STATUS.md` / `next-chat-briefing.md` | Pointers only |

### Tests / probes run (not committed)

- Full suite ×2 (parallel) + ×1 serial
- Isolation: kitchen-sink, utility-page-render, mathjax, beat-first, phase3/6, adapter, typography, compose-a2, S80 focused, unified settings, s75 authoring/lifecycle/capture, page-vnext-assemble
- Order pairs: kitchen↔phase6, beat→phase3, math→phase6
- Inject probe (temporary; removed)

### Local artefacts (untracked; disposable)

`tmp-d014-run1.out`, `tmp-d014-run2.out`, `tmp-d014-serial.out`, `tmp-d014-*-locs.txt`, isolation/order outs, `tmp-d014-failures.json`, `tmp-d014-rc.json`, …

---

## 10. Recommended next task (operator) — SUPERSEDED

Bounded RC1/RC2 repair authorised and completed — see §11. Do **not** open RC3–RC8 cleanup from this record. **Historical sequencing note:** an earlier draft pointed “next product programme” at learner-page accessibility; that is **not** current programme direction. After Sprint 82, Alpha development is complete; current planning authority is [PRODUCT-BACKLOG.md](../../backlog/PRODUCT-BACKLOG.md) (alpha-use period; no automatic next sprint).

---

## 11. Bounded RC1/RC2 repair record (2026-08-28)

### Implementation

| Item | Detail |
| ---- | ------ |
| Product behaviour | **Unchanged.** No `app.js` production fallback; no renderer/Adjustments/assessment semantics edits. |
| RC1 architecture | `runPrismLibScriptsInSandbox` **auto-injects** `PRISM_LEARNER_RENDERER_VNEXT` via existing `injectLearnerRendererVNextInSandbox` (real `lib/learner-renderer-vnext`). Opt-out: `skipLearnerRendererVNextInject` (used by browser-registration load-order proof). Also added `loadPrismAppJsTestApi` helper; remaining duplicate loaders that never called bootstrap received a one-line inject before `app.js`. |
| RC2 architecture | `scripts/build-gam-renderer-type-inventory.js` honours `PRISM_GAM_INVENTORY_OUT_DIR`. Tests use `tests/gam-renderer-inventory-test-helper.js` → `buildGamRendererTypeInventoryIsolated()` (temp dir per call). Default committed artefacts path unchanged when env unset. |
| First-class CI | `npm run test:first-class` (also `npm run test:full` documented for historical suite). |

### Files changed (harness / tests / docs)

- `tests/prism-vm-lib-bootstrap.js` — auto-inject + `loadPrismAppJsTestApi`
- `tests/gam-renderer-inventory-test-helper.js` — **new**
- `scripts/build-gam-renderer-type-inventory.js` — env out-dir override only
- `package.json` — `test:first-class`, `test:full`
- `tests/learner-renderer-vnext-browser-registration.test.js` — skip inject for load-order proof
- Inventory consumers: phase2/3/6/7/8 + `learner-renderer-vnext-kitchen-sink.test.js`
- Duplicate-loader inject: utility-* / sprint-38 / workflow-ld-assessment-semantics-e2e (list in git diff)
- This diagnostic + governance/sprint pointers

### Validation

| Check | Result |
| ----- | ------ |
| Representative formerly-RC1 (marx / markdown / sprint-38) | **0** true unavailable; residual HTML/contract asserts remain |
| Phase2–8 inventory suites (concurrent) | **44/44** |
| `npm run test:first-class` | **339/339** |
| S80 focused | **229/229** |
| True unavailable asserts in full suite | **0** (two soft-assert tests mention the regex in expected patterns only) |

### Full-suite failing locations (D-014 definition)

| Measure | Value |
| ------- | ----- |
| Before (diagnostic run 2) | **393** (+1 observed flake historically) |
| After run 1 | **419** |
| After run 2 | **419** |
| Intersection after | **419** (stable; **no** ±1 inventory flake) |
| Locations removed vs before | **98** (incl. line-shifts + former RC1 sites) |
| Locations newly introduced vs before | **124** (unmasked RC3+ / soft-assert paths / line-shifts from edits) |
| RC1 unavailable eliminated? | **Yes** (true assert count 0) |
| RC2 flake eliminated? | **Yes** |

Absolute location count **rose** because clearing RC1 unmasked sections-only / HTML-shape / soft-assert residuals (e.g. `Page activities must be an array.`). That is expected and **out of scope** for this task (RC3–RC8).

### Residual classification (not repaired)

| Cluster | Status |
| ------- | ------ |
| RC3 INVALID_ACTIVITIES / sections-only fixtures | Known backlog |
| RC4 compose/golden history | Known backlog |
| RC5 S78 unbound | Known backlog |
| RC6 prompt string freezes | Known backlog |
| RC7 typography CSS | Known backlog |
| Soft-assert “if error then must be unavailable” (guided-learning / framing-adoption) | Stale RC1 workaround; now fails on real render errors — backlog |
| page-partial-capture-validate newly failing under inject | Secondary unmasked — classify, do not mass-fix here |

### Disposition

### **A. D-014 CONFIDENCE ISSUE RESOLVED**

- First-class gate is deterministic and green.
- RC1/RC2 removed as confidence problems.
- Residual historical failures are understood backlog; **do not** chase suite zero.

**STOP.** No RC3–RC8 cleanup; no further engineering debt item from this task.
