# Sprint 70 Implementation Plan (Slice Delivery)

This plan is intentionally incremental. Each slice is independently testable, reviewable, and reversible.

## Global execution rules

- One primary architectural purpose per slice.
- No cross-slice opportunistic refactors.
- No production behavior expansion without tests in the same slice.
- Run renderer regressions after each slice before proceeding.
- Keep commits small and explicit.
- Treat accessibility and progressive enhancement as mandatory gates.

---

## Slice 1 — Planning contract baseline

- **Goal:** Define/validate Sprint 70 planning contracts (activity + page-level synthesis) without changing rendering behavior.
- **In scope:** schema definitions, skip-reason taxonomy, visual-form taxonomy v1, deterministic ID seed rules, identity/lifecycle separation.
- **Out of scope:** job generation, prompt generation, asset storage, rendering output changes.
- **Likely files:** `lib/sprint38-visual-affordances.js` (or new adjacent contract module), new `lib/visual-affordance-pipeline/*contract*`, docs.
- **Contract changes:** add explicit page-level planning structure proposal and validation boundary with `planning_id` and `evidence_anchor_id` semantics.
- **Tests required:** schema validation tests; deterministic contract normalization tests; skip-reason coverage tests.
- **Acceptance criteria:** valid/invalid payloads classify deterministically; no existing renderer regressions.
- **Regression commands:** targeted contract tests + current baseline gates from `SPRINT-70-TEST-PLAN.md` (avoid wildcard-only command forms).
- **Commit boundary:** contract-only commit.
- **Rollback risk:** low (isolated validators).

## Slice 2 — Deterministic visual-job extraction core

- **Goal:** Derive deterministic visual jobs from validated planning contracts.
- **In scope:** job builder, deterministic `job_id`, stable sorting, provenance fields, `evidence_anchor_id` carry-through.
- **Out of scope:** prompt text synthesis, asset storage, HTML mutation.
- **Likely files:** `lib/visual-affordance-pipeline/build-visual-jobs.js`, `lib/visual-affordance-pipeline/visual-job-schema.js`, `lib/visual-affordance-pipeline/index.js`.
- **Contract changes:** introduce job schema version and required identity fields.
- **Tests required:** stable output on repeated runs, collision tests, invalid input handling, no payload mutation tests.
- **Acceptance criteria:** identical inputs produce deep-equal jobs; job identity separation fields present.
- **Regression commands:** new job tests + `node --test tests/hetero-dup-material-dom-identity.test.js`.
- **Commit boundary:** job extraction only.
- **Rollback risk:** low-medium (new module, no renderer write path).

## Slice 3 — Knowledge Summary synthesis planning

- **Goal:** Implement strong-default page-level synthesis planning for Knowledge Summary.
- **In scope:** default-plan decision logic, explicit skip reasons, priority semantics.
- **Out of scope:** final rendering placement and asset integration.
- **Likely files:** new planner module under `lib/visual-affordance-pipeline/`, design-page contract boundary helpers.
- **Contract changes:** page-level planning row for `knowledge_summary` synthesis.
- **Tests required:** default generated when eligible; each skip category tested; deterministic behavior tests.
- **Acceptance criteria:** one high-priority synthesis plan appears when eligible; skip is explainable when ineligible; recommended placement is after complete Knowledge Summary prose.
- **Regression commands:** page-level planning tests + `node --test tests/utility-page-render.test.js`.
- **Commit boundary:** synthesis planning logic only.
- **Rollback risk:** medium (contract behavior change).

## Slice 4 — Activity-level planning reconciliation

- **Goal:** Reconcile Sprint 38 activity-level affordance planning with Sprint 70 job extraction.
- **In scope:** compatibility bridge, gate policy alignment, activity/page planning coexistence.
- **Out of scope:** prompt text details, asset pipeline.
- **Likely files:** `lib/sprint38-visual-affordances.js`, `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js`, job extraction adapter.
- **Contract changes:** explicit coexistence model for activity vs page planning.
- **Tests required:** no regressions to existing affordance gates; mixed planning payload tests.
- **Acceptance criteria:** existing activity affordance tests stay green and coexist with page-level plans.
- **Regression commands:** `node --test tests/utility-visual-affordance-hooks.test.js tests/sprint-38-visual-affordances.test.js`.
- **Commit boundary:** compatibility bridge only.
- **Rollback risk:** medium (touches existing affordance path).

## Slice 5 — Deterministic prompt construction

- **Goal:** Build deterministic prompt payloads from validated jobs and evidence anchors.
- **In scope:** prompt builder, anti-invention constraints, source-evidence references, visual-form rationale recording.
- **Out of scope:** API calls, model execution, rendering.
- **Likely files:** `lib/visual-affordance-pipeline/build-visual-prompt.js`.
- **Contract changes:** prompt metadata, accessibility fields (alt text/caption), and buildability diagnostics schema.
- **Tests required:** deterministic prompt equality tests; prohibited claim safeguards; missing evidence tests.
- **Acceptance criteria:** prompt text is deterministic and constrained to source evidence.
- **Regression commands:** prompt tests + locked fixture tests.
- **Commit boundary:** prompt builder only.
- **Rollback risk:** low-medium.

## Slice 6 — Asset persistence and session state

- **Goal:** Persist visual asset state safely without mutating planning contracts.
- **In scope:** session model, attach/replace/remove flows, stale/orphan detection, digest/MIME/provenance metadata capture.
- **Out of scope:** final HTML insertion and package export.
- **Likely files:** `lib/visual-affordance-pipeline/visual-asset-session.js`, `lib/visual-affordance-pipeline/intake-visual-asset.js`, `app.js` UI state boundary.
- **Contract changes:** asset record schema with separate `asset_id`, digest, MIME, alt text, caption, provenance.
- **Tests required:** persistence round-trip tests; deterministic merge after reassembly; orphan handling tests.
- **Acceptance criteria:** asset lifecycle state changes are explicit and non-destructive.
- **Regression commands:** session tests + workflow persistence tests (`node --test tests/workflow-persistence-pass2.test.js`).
- **Commit boundary:** session persistence only.
- **Rollback risk:** medium-high (stateful/browser-touching).

## Slice 7 — Renderer placement integration

- **Goal:** Integrate visual placement for activity-level and Knowledge Summary page-level contexts.
- **In scope:** placement mapping, no duplicate placement, DOM identity safeguards.
- **Out of scope:** package zip export and browser UI polish.
- **Likely files:** `lib/learner-renderer-vnext/build-visual-affordance-placements.js`, `lib/learner-renderer-vnext/render-visual-affordance.js`, potential page rendering region hooks.
- **Contract changes:** deterministic placement key schema.
- **Tests required:** duplicate placement prevention tests; DOM identity assertions; fallback render tests; accessibility render checks.
- **Acceptance criteria:** page remains complete without assets; no duplicate DOM identities introduced.
- **Regression commands:** `node --test tests/utility-visual-affordance-hooks.test.js tests/hetero-dup-material-dom-identity.test.js`.
- **Commit boundary:** placement layer only.
- **Rollback risk:** high (renderer path touches).

## Slice 8 — Failure and fallback hardening

- **Goal:** Ensure progressive enhancement and resilient degradation across all failure points.
- **In scope:** clear diagnostics, non-blocking learner render, export readiness policy.
- **Out of scope:** external generation integration.
- **Likely files:** `lib/visual-affordance-pipeline/build-visual-package.js`, readiness validators, `app.js` status messaging.
- **Contract changes:** failure reason taxonomy and manifest fields.
- **Tests required:** no-asset, partial-asset, invalid-asset, missing-planning tests, assistive-tech fallback checks.
- **Acceptance criteria:** learner text path remains intact; failures are surfaced without data loss.
- **Regression commands:** package tests + utilities export pipeline tests.
- **Commit boundary:** fallback behavior only.
- **Rollback risk:** medium.

## Slice 9 — Browser Utilities integration

- **Goal:** Expose Sprint 70 controls in Utilities path without destabilizing existing flow.
- **In scope:** job list, prompt copy, asset attach/remove, preview integration.
- **Out of scope:** net-new workflow generation features.
- **Likely files:** `app.js`, `index.html`, `style.css`.
- **Contract changes:** none beyond previously defined interfaces.
- **Tests required:** browser-path integration tests via Prism test API; UI state transition tests.
- **Acceptance criteria:** Utilities preview path remains functional with and without visual assets.
- **Regression commands:** `node --test tests/utility-utilities-page-export-pipeline.test.js`.
- **Commit boundary:** UI integration only.
- **Rollback risk:** medium-high (large app surface).

## Slice 10 — End-to-end certification and handover close-out

- **Goal:** certify full Sprint 70 behavior against deterministic fixtures and regression suites.
- **In scope:** certification fixture(s), consolidated test runbook, closeout docs.
- **Out of scope:** new product capabilities.
- **Likely files:** `tests/sprint-70-*.test.js`, `docs/development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/*`.
- **Contract changes:** lock schema versions and compatibility statement.
- **Tests required:** full Sprint 70 suite + core renderer suite + browser smoke checklist.
- **Acceptance criteria:** all gates green; documented residual risks only.
- **Regression commands:** see `SPRINT-70-TEST-PLAN.md`.
- **Commit boundary:** certification/docs only.
- **Rollback risk:** low (tests/docs).

---

## Dependency order summary

1. S1 contract
2. S2 jobs
3. S3 synthesis default
4. S4 activity compatibility
5. S5 prompt builder
6. S6 asset session
7. S7 placement integration
8. S8 fallback hardening
9. S9 Utilities integration
10. S10 certification

No later slice should start with failing gates from prior slices.

## Command verification notes (Windows/PowerShell)

- `npm run pretest:learner-renderer-vnext` exists and is valid.
- Explicit file-based `node --test <file>` commands are preferred.
- Avoid wildcard-only commands (for example `tests/sprint-70-*.test.js`) in this plan because they can silently execute zero tests in PowerShell.
- Broad wildcard suite `node --test "tests/learner-renderer-vnext*.test.js"` executes but currently has unrelated pre-existing failures; treat it as planned broad audit, not mandatory per-slice gate.
