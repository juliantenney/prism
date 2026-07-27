# Sprint 70 Implementation Roadmap

**Related:** [WHY-SPRINT-70.md](WHY-SPRINT-70.md) · [HANDOVER.md](HANDOVER.md) · [TASKS.md](TASKS.md)

---

Sprint 70 delivers a minimal Prism-owned visual affordance pipeline. Completion measured against [Definition of Done](HANDOVER.md#sprint-70-definition-of-done).

## Phase 1 — Visual job model and prompt builder

- **Objective:** generate one job per approved `generate` affordance with deterministic prompt.
- **Dependencies:** Sprint 38 compose output on page JSON.
- **Risks:** prompt parity drift vs VEU reference.
- **Expected outputs:** `lib/visual-affordance-pipeline/*` modules + unit tests.
- **Completion criteria:** N affordances → N jobs; same input → same prompt.

## Phase 2 — Filename convention

- **Objective:** auto-assign stable filenames per job.
- **Dependencies:** Phase 1 job model.
- **Risks:** collision on duplicate affordance ids (should not occur if schema valid).
- **Expected outputs:** filename assigner + decision record in DECISIONS.
- **Completion criteria:** every job has `filename` before UI render.

## Phase 3 — Asset storage

- **Objective:** persist uploaded images against affordance/job id.
- **Dependencies:** Phase 1–2; storage location decision.
- **Risks:** browser storage limits; path traversal on upload.
- **Expected outputs:** storage adapter + validation (type, size).
- **Completion criteria:** upload/replace/remove updates job status and binary store.

## Phase 4 — UI

- **Objective:** author-facing job list with copy prompt, upload, replace, remove.
- **Dependencies:** Phases 1–3.
- **Risks:** UX clutter in Utilities panel.
- **Expected outputs:** app.js UI section + smoke test.
- **Completion criteria:** all four actions work per job; status visible.

## Phase 5 — Package assembly

- **Objective:** insert figures at hooks; build `media/` folder.
- **Dependencies:** rendered learner HTML + uploaded assets.
- **Risks:** hook matching edge cases (hybrid/legacy mode).
- **Expected outputs:** assembler module + fixture HTML tests.
- **Completion criteria:** `<img src="media/...">` paths correct; figcaption from caption_intent.

## Phase 6 — Export

- **Objective:** downloadable package (`index.html`, `media/`, `visual-manifest.json`).
- **Dependencies:** Phase 5.
- **Risks:** incomplete job blocking policy.
- **Expected outputs:** export action + end-to-end test.
- **Completion criteria:** exported package opens locally with images loading.

## Phase 7 — Regression and closeout

- **Objective:** certification green; documentation complete.
- **Dependencies:** all prior phases.
- **Risks:** renderer regression from HTML mutation.
- **Expected outputs:** test suite additions, STATUS/HANDOVER updated.
- **Completion criteria:** Definition of Done satisfied.

---

## Suggested commit sequence

See [TASKS.md — Suggested commits](TASKS.md#suggested-commits).
