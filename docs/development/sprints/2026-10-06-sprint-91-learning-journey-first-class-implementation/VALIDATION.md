# Sprint 91 — Validation / test evidence

**Status:** **COMPLETE / CLOSED** — close-out gate recorded  
**Sprint:** 91 — Learning Journey First-Class Implementation  
**Dashboard:** [STATUS.md](STATUS.md)  
**Closure:** [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md)

Canonical place for focused automated results, live Create/Run checks, and commission-intake proof evidence. Append rows; do not overwrite history.

---

## Protected baselines (record when next measured)

| Gate | Last known | Notes |
| ---- | ---------- | ----- |
| First-class gate | **339/339** (2026-10-06, Sprint 91 close) | `npm run test:first-class` — pass 339 / fail 0 |
| Broad suite | **3705 / 3704 / 0 / 1** (PB-S-007) | Re-measure only if a later sprint changes warrant |

---

## Focused Sprint 91 tests

| Date | Suite / command | Result | Notes |
| ---- | --------------- | ------ | ----- |
| 2026-10-06 | WP1/WP2 focused | **24/24 pass** | Registration, pipeline, prompts, commissionability |
| 2026-10-06 | WP1–WP3 focused | **26/26 pass** | + Design Page assembly |
| 2026-10-06 | `node --test tests/s91-learning-journey-wp4-commission-intake.test.js tests/s91-learning-journey-wp3-design-page.test.js tests/s91-learning-journey-wp1-wp2.test.js tests/s89-product-family-boundary.test.js` | **40/40 pass** | WP4 intake: Interactive accepted; LJ/unknown/Expository unsupported with spec preserved; Interactive topology via family path; no Journey stage splice; no prose parsing; direct Create unchanged |
| 2026-10-06 | Close-out focused S91 (design page, direct commission, intake, hierarchy, production status, learner package, spoiler_boundary, commissioning preview, display labels, wp1–wp4) | **106/106 pass** | Full Sprint 91 focused gate before close |
| 2026-10-06 | `npm run test:first-class` | **339/339 pass** | Full first-class gate green at Sprint 91 close |

---

## Live / manual validation

| Date | Scenario | Result | Evidence / notes |
| ---- | -------- | ------ | ---------------- |
| 2026-10-06 | Create → Learning Journey pipeline | **Met (live)** | Real short Learning Journey designed and run |
| 2026-10-06 | Commission → Interactive / Expository / Assessment Pack | **Met (live)** | Three supported commissions instantiated as ordinary workflows; parallel production in separate GPT conversations |
| 2026-10-06 | Workflow hierarchy | **Met (live)** | Constituents nested under source Learning Journey |
| 2026-10-06 | Production status ladder | **Met (live)** | not_commissioned → production → authoring → Complete ×3 |
| 2026-10-06 | Final learner package | **Met (live) — PASSED** | Preflight → ZIP with Journey Home + c1/c2/c3 nested packages; media resolved; in-browser launch OK |
| — | Unsupported commission remains visible | **Met** | WP3 Elements markdown + WP4 intake preserves specification on unsupported |
| — | Direct Interactive / Expository / Assessment Create unchanged | **Met** | Focused + first-class gate |

---

## Sign-off checklist (at close)

| Criterion | State |
| --------- | ----- |
| Vertical slice proven | **Met — live E2E PASSED** |
| Interactive / Expository / Assessment commission intake | **Met (live + automated)** |
| Existing first-class products non-regressed | **Focused 106/106 + first-class 339/339** |
| Prompt bodies are authenticated experimental ports (S91-D03) | **Met** — export unmodified |
| Design Page GPT synthesis → PRISM validates/renders | **Met** — Step 5 same-chat model stage; deterministic consume after accept |
| Derived production status + prepare boundary | **Met** — Preview ≡ package preflight |
| Final learner package | **Met (live)** — Journey Home + nested cN packages |
| Automatic commission extraction | **Not claimed** — deferred |
| Situated / Independent Task | **Not claimed** — future work |
