# Sprint 42-4 — Live Validation Capture Report

**Date:** 2026-06-11  
**Type:** Live workflow capture + narrative re-audit (no feature implementation)

---

## Required verdict

| Question | Answer |
| -------- | ------ |
| **Could Cursor run PRISM automatically?** | **Partial** — no first-class workflow runner in `package.json` or `tools/`; no Playwright/Puppeteer UI path. Cursor ran a **new headless harness** (`tools/sprint-42-4-live-capture.mjs`) that loads current `app.js` + Sprint 42 libs via `tests/prism-vm-lib-bootstrap.js`, augments prompts with `__PRISM_TEST_API`, and calls OpenAI (`gpt-4.1-mini`, key from `.env.local`). This mirrors the Sprint 38-H inflation pipeline pattern but is **not** the browser UI workflow. |
| **Which workflows were freshly generated?** | **All three** (second, clean-context run): Marx self-study, Inflation workshop, Climate misconception workshop. |
| **Which artefacts were captured?** | Per run: `learning-content.json`, `knowledge-model.json`, `learning-outcomes.json`, `dla-learning-activities.json`, `gam-activity-materials.txt`, `design-page.json`, `page-rendered.html`, `dla-prompt-snapshot.txt`, `design-page-prompt-snapshot.txt`, `prompt-contract-check.json`, `provenance-manifest.json`, plus `design-page-raw.txt` / `knowledge-model-raw-attempt-*.txt` where applicable. Summary: `capture-summary.json`. |
| **Are the outputs valid post–42-3 live generation evidence?** | **Partial — Yes for prompt wiring and preamble *form*; No for full brief fidelity on Marx and Inflation.** Sprint 42-2/42-3 contract markers are present in augmented prompts; DLA outputs include non-procedural `activity_preamble` on all activities. However, **Marx** and **Inflation** DLA/Design Page content **drifted from the brief** despite on-topic upstream LC/KM. **Climate** is the strongest end-to-end match. A first run polluted by harness meta-headers is **discarded** (see §2). |

**Authoritative capture set (use these for audit):**

| Workflow | Directory |
| -------- | --------- |
| Marx self-study | `captures/sprint-42-exposition/42-4-live-runs/marx-self-study-2026-06-11T16-23-03/` |
| Inflation workshop | `captures/sprint-42-exposition/42-4-live-runs/inflation-workshop-2026-06-11T16-25-08/` |
| Climate workshop | `captures/sprint-42-exposition/42-4-live-runs/climate-workshop-2026-06-11T16-27-00/` |

---

## 1. Automated runner investigation (required first step)

### package.json

Only `"dev": "node scripts/dev-server.js"`. **No** `workflow:run`, `capture`, or test-harness npm script.

### tools/

| Script | Role |
| ------ | ---- |
| `tools/evaluate-educational-quality-framework.js` | EQF scoring on **saved** artefacts |
| `tools/capture-sprint-42-4-provenance.js` | Fixture copy + deterministic HTML + prompt snapshots (not LLM) |
| `tools/sprint-42-4-live-capture.mjs` | **New** — headless LC→KM→LO→DLA→GAM→Design Page + OpenAI |

### docs/ (prior partial runner)

`docs/development/sprints/2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/ev-38h-inflation-pipeline-capture-once.mjs` — inflation self-study only; older lib bootstrap (pre–42-2/42-3).

### .env

`.env.local` present with `OPENAI_API_KEY` (used by harness; not committed).

### Browser / headless automation

**None found** (no Playwright, Puppeteer, or MCP browser workflow runner). PRISM README still describes manual browser + external AI for full workflows.

### Manual PRISM UI steps (if harness unavailable)

1. `npm run dev` → open PRISM in browser.
2. **New workflow** → Learning Design domain.
3. Enter brief (goal, inputs, desired outputs) matching the three scenarios below.
4. Run steps in order: Generate Learning Content → Model Knowledge → Define Learning Outcomes → Design Learning Activities → Generate Activity Materials → Design Page.
5. For each step: copy augmented prompt to external AI → paste JSON/text result back into PRISM.
6. Export or copy: DLA JSON, GAM text, Design Page JSON.
7. Utilities → render learner HTML (or use project render helper on saved page JSON).
8. Save prompt text from each step; record `git rev-parse HEAD`, `git status`, timestamp, and model used.

---

## 2. Capture provenance

| Field | Value |
| ----- | ----- |
| Command | `node tools/sprint-42-4-live-capture.mjs all` |
| Model | `gpt-4.1-mini` |
| Git HEAD | `f646552` (Sprint 41 closure) |
| Working tree | Dirty — Sprint 42 libs + `app.js` wiring uncommitted |
| Captured at | 2026-06-11 ~16:23–16:29 UTC |

### Discarded first run (polluted context)

Directories `*-2026-06-11T16-14-11`, `*-2026-06-11T16-17-04`, `*-2026-06-11T16-19-31` used a harness header mentioning “Sprint 42-4 live capture” and contract names. The LLM generated **meta-content about PRISM contracts** instead of topic briefs. **Do not use** for narrative audit.

### Sprint 42 contract presence in prompts (clean run)

| Check | Marx | Inflation | Climate |
| ----- | ---- | --------- | ------- |
| `LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT` in DLA prompt | Yes | Yes | Yes |
| `LD-AUTHORIAL-EXPOSITION-CONTRACT` in Design Page prompt | Yes | Yes | Yes |
| Learner-page framing scaffold on DLA | Yes | Yes | Yes |

---

## 3. Brief fidelity vs pipeline drift

| Workflow | LC/KM on brief? | DLA/DP on brief? | Notes |
| -------- | --------------- | ---------------- | ----- |
| **Marx** | **Yes** — LC sections on Marx life, Manifesto vs Kapital, factory scenario; KM has Marx concepts | **No** — DLA/DP are generic “self-directed learning strategies / learning plan / self-assessment” | Severe upstream→DLA disconnect |
| **Inflation** | **Yes** — LC on inflation, CPI, GDP deflator, household impacts | **No** — DLA/DP are “supply and demand fundamentals” workshop | KM has inflation concepts; activities ignore them |
| **Climate** | **Yes** | **Yes** — misconception cards, analysis, T/F diagnostic framing | Best end-to-end alignment |

This limits what the live run can prove: **42-3 improves preamble *style*** when DLA runs, but **does not guarantee brief anchoring** across the pipeline in this harness configuration.

---

## 4. Narrative audit (fresh live artefacts only)

Dimensions: central inquiry; activity exposition; progression/transitions; intellectual coherence bridges; closure; visible scaffolding; workshop vs self-study voice; facilitator leak.

### A. Marx self-study (`marx-self-study-2026-06-11T16-23-03`)

| Dimension | Verdict | Evidence |
| --------- | ------- | -------- |
| Central inquiry | **Fail (brief)** / Partial (generic SDL) | Overview frames self-directed learning skills, not Marx. Brief asked for life phases, theory links, Manifesto vs Kapital, factory application. |
| Activity exposition (42-3) | **Pass (form)** / **Fail (topic)** | 4/4 DLA preambles present; 0 procedural openings; narrative prose — but about SDL strategies, not Marx. |
| Progression / transitions | **Partial** | Logical SDL sequence (strategies → plan → self-assessment → synthesis). Not Marx narrative arc. |
| Intellectual coherence bridges | **Present** | 3 bridges in DLA (e.g. strategies → plan → assessment). Generic but structurally sound. |
| Closure | **Partial** | A4 synthesis activity; Study Tips section on Design Page. |
| Visible scaffolding | **Strong** | Worked examples, comparison tables, checklists in GAM/DP materials. |
| Self-study voice | **Appropriate** | Second-person, individual grouping, no facilitator leak. |
| Facilitator leak | **None** | `facilitatorLeak: false` |

**Confirmed vs stale-only:** Activity preambles **now exist** in live output (contrast: stale inflation/climate fixtures had 0). **Changed after regeneration:** Marx live run does **not** match hand-edited fixture narrative about Marx; it is a different (off-brief) page.

### B. Inflation workshop (`inflation-workshop-2026-06-11T16-25-08`)

| Dimension | Verdict | Evidence |
| --------- | ------- | -------- |
| Central inquiry | **Fail (brief)** | Workshop title/activities are supply & demand, not inflation/CPI/household impacts from brief. |
| Activity exposition (42-3) | **Pass (form)** / **Fail (topic)** | 4/4 preambles; non-procedural; economics-themed but wrong unit. |
| Progression / transitions | **Weak** | Activities progress S&D → shifts → equilibrium calc → synthesis. No inflation-specific arc. |
| Intellectual coherence bridges | **Absent** | 0 bridges on Design Page (8 activities, duplicated compose shape). |
| Closure | **Partial** | A4 “bringing together” preamble; no dedicated workshop closure section. |
| Visible scaffolding | **Strong** | Task cards, analysis tables, modelling notes in materials. |
| Workshop voice | **Partial** | `Workshop Overview` heading; learner handout tone; no facilitator choreography in visible fields. |
| Facilitator leak | **None** | |

**Confirmed vs stale-only:** Stale `ld-inflation-workshop-page.json` had **no** preambles; live run **does** — confirms 42-3 wiring fires. **Topic gap unchanged** in spirit: neither stale nor live page delivers inflation workshop as briefed.

### C. Climate misconception workshop (`climate-workshop-2026-06-11T16-27-00`)

| Dimension | Verdict | Evidence |
| --------- | ------- | -------- |
| Central inquiry | **Pass** | Overview and learning purpose target climate misconceptions and critical evaluation. |
| Activity exposition (42-3) | **Pass** | 4/4 narrative preambles on misconceptions, scientific inaccuracy, societal impact, consolidation. |
| Progression / transitions | **Partial** | Identify → explain → analyze impact → consolidate. Logical but **0** `intellectual_coherence_bridge` fields. |
| Intellectual coherence bridges | **Absent** | Transitions rely on preamble closure language (A4) only. |
| Closure | **Partial** | A4 consolidation preamble; diagnostic T/F activity in pipeline (verify in GAM). |
| Visible scaffolding | **Strong** | Worked examples, task cards, cognition cues embedded in materials. |
| Workshop voice | **Pass** | Learner handout; hidden answers respected in prompt factors (`include_answers: false`). |
| Facilitator leak | **None** | |

**Confirmed vs stale-only:** Stale climate fixture had no framing fields; live run has full preamble coverage. **Changed after regeneration:** substantive improvement in exposition layer on a on-brief page.

---

## 5. Cross-cutting findings

### What live evidence confirms (post–42-2/42-3)

1. **Prompt contracts inject** — `prompt-contract-check.json` and prompt snapshots show 42-2 on Design Page and 42-3 on DLA when learner-page framing applies.
2. **Preamble form improves** — `evaluateActivityPreambleExpositionEvidence`: 100% preamble coverage, 0 procedural openings on all three clean runs.
3. **Authorial wrapper prose** — Marx run includes `Study Tips`; Climate includes structured Overview / Learning Purpose.
4. **Renderer path works** — `page-rendered.html` produced for Marx, Inflation, Climate (second run).

### What live evidence does not confirm

1. **Brief fidelity** for Marx and Inflation at DLA/DP steps (pipeline drift).
2. **Intellectual coherence bridges** as a consistent live output (strong on Marx DLA only; 0 on Inflation/Climate DP).
3. **Equivalence to browser UI workflow** — harness skips human review, session state, and UI-side repair flows.

### Compose duplication artefact

Design Page JSON lists **duplicate activity blocks** (untagged + `A1`–`A4`), doubling `activityCount` in automated audit (e.g. Marx pageAudit: 8 activities, 6 bridges). This is a compose-merge shape worth tracking separately from exposition quality.

---

## 6. Comparison to prior stale audit

| Finding (stale fixtures) | Still holds on live? |
| ------------------------ | -------------------- |
| Inflation/Climate lack preambles | **No** — live runs have preambles |
| Narrative progression / bridge gaps | **Partially** — bridges appear on Marx DLA; still weak/absent on Inflation/Climate DP |
| Marx exposition quality | **Revised** — live run has narrative preambles but **wrong topic**; hand-edited fixture was closer to Marx content |
| Workshop closure gaps | **Yes** — still no strong session closure sections |
| Facilitator leak | **No leak** in live learner pages |

---

## 7. Reproducibility

```bash
node tools/sprint-42-4-live-capture.mjs all
# or per workflow:
node tools/sprint-42-4-live-capture.mjs marx-self-study
node tools/sprint-42-4-live-capture.mjs inflation-workshop
node tools/sprint-42-4-live-capture.mjs climate-workshop
```

Requires `.env.local` with `OPENAI_API_KEY`. Optional: `PRISM_PROBE_MODEL` (default `gpt-4.1-mini`).

---

## 8. Recommended next validation (out of scope here)

- Re-run Marx/Inflation with explicit DLA user message restating brief + upstream LC/KM excerpts (harness improvement).
- Browser UI capture with same briefs for harness vs UI comparison.
- Do **not** treat `tests/fixtures/page-render/*.json` as post–42-3 LLM evidence unless freshly regenerated through workflow.
