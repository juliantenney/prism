# Sprint 105 — Milestone 4 Manual Acceptance Checklist

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Gate:** Milestone 4 Live Acceptance (Fresh 90-Minute Economics Learning Journey & Lifecycle Checks)  
**Code baseline:** M1 (`4b698db`), M2 (`09cfbfc`), M3 (`83e7aec`), M4 (`a7ad249`)  
**Status:** **ACCEPTED & CLOSED (2026-11-25)** — All required manual acceptance checks completed and confirmed by user; see [SPRINT-105-CLOSURE.md](SPRINT-105-CLOSURE.md)

---

## Acceptance Outcome Summary (2026-11-25)

- **User-confirmed live Learning Journey generation:**
  - Fresh 90-minute Economics Learning Journey (*Correlation and Causation: Making Sense of Economic Evidence*) completed Steps 1–5 cleanly, assembled deterministically, and is actively commissioning downstream components (adopted as canonical parent workflow for resumed Sprint 104 live acceptance).
  - Substantial 30-hour, 10-week, 50-component Political Economy Learning Journey completed Steps 1–5 cleanly and assembled deterministically (live scalability evidence for progressive LJ capture and assembly; does **not** claim all 50 components have been produced or that its integrated learner runtime has been validated).
- **User-confirmed live Expository C1 acceptance:** Regenerated Economics C1 passed at **91 / 100 (Professional / Excellent)** with `S105-D03` inline material anchors and Workstream 1 representational necessity (archived in [evidence/c1-expository-live-acceptance/](evidence/c1-expository-live-acceptance/C1-LIVE-ACCEPTANCE-QA-RECORD.md)).
- **User-confirmed manual browser checks (6 / 6 passed):**
  1. Reload persistence and restoration of accepted stage captures and assembled Design Page.
  2. Parent Learning Journey Overview preview.
  3. Legacy workflow compatibility and preservation of both historical Economics baselines.
  4. Workflow duplication with correct separation of brief and run-derived state.
  5. Upstream invalidation, authoritative edited captures, downstream prompt propagation, and non-resurrection after reload.
  6. Clear-run behaviour and preservation of brief data.
- **Evidence distinction — brief-provided source material:** Verbatim deterministic transport (`{ status: "provided" }`) and preservation of brief-provided source material across invalidation, duplication, and clear-run are **verified by automated regression tests** (`tests/s105-m1-lj-assembly.test.js`, `tests/s105-m2-prompts-and-continuity.test.js`, `tests/s105-m3-lifecycle-and-orchestration.test.js`, `tests/s96-lj-shared-source-design-page-boundary.test.js`); a separate live manual run specifically exercising brief-provided source material was not separately recorded.

---

## Preservation & Scope Rules

- **Preserve untouched:** Keep both the original pre-intervention *Correlation and Causation: Making Sense of Economic Evidence* baseline and the incomplete Sprint 104 regeneration untouched (do not edit, clear, overwrite, or delete either). *(Confirmed preserved read-only during manual acceptance.)*
- **Single canonical parent for Sprint 104 handback:** Author this fresh 90-minute / 2-week Economics Learning Journey manually and review each stage collaboratively. Once accepted, it will serve directly as the parent Learning Journey for subsequent Sprint 104 live acceptance (`M1` integrated acceptance, `M6`–`M7`), avoiding duplicate generation. *(Completed and adopted for Sprint 104.)*
- **Disposable workflow for destructive lifecycle checks:** Run Section F (invalidation, duplication, clear-run) on a **disposable duplicate** so the accepted Economics parent stays pristine. *(Completed on disposable duplicate.)*

---

## Pre-Flight: Browser Freshness

- [x] Open `http://localhost/prism/index.html` and hard-refresh (`Ctrl+Shift+R`). *(Verified: `112/112` HTTP 200 scripts, `109` globals; live browser runs completed cleanly.)*
- [x] Confirm in DevTools Network / Console: `app.js` and `lib/learning-journey-assemble.js` load HTTP `200` with zero console errors.

---

## A. Progressive Workflow Creation & Five-Stage Prompt Routing

- [x] Create a **fresh** Learning Journey workflow from the original 90-minute / 2-week *Correlation and Causation: Making Sense of Economic Evidence* brief (do not duplicate a legacy workflow). *(User-confirmed live generation; also exercised at scale on 30-hour / 50-component Political Economy LJ.)*
- [x] Confirm five ordered steps appear in Run mode (`Requirements`, `Progression`, `Elements`, `Commissioning`, `Design Page`), each exposing its own structured capture input. *(User-confirmed live + automated M3.)*
- [x] Inspect Copy prompts across Steps 1–5:
  - [x] Steps 1–4 emit compact JSON stage contracts (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`) without legacy 11-section prose checklists. *(User-confirmed live + automated M2.)*
  - [x] Step 5 (`Design Page`) routes to the thin learner-facing editorial prompt with **zero** Interactive `Runner guidance` (`page_synthesis`, `activities[].materials[]`, `visual_affordance_schema_version 38.4`) and **no** raw full-JSON upstream dumps. *(User-confirmed live + automated M2.)*

---

## B. Stage-by-Stage Capture, Validation, Persistence & Authoritative Handoff

Use a single fresh AI chat for Steps 1–5; review each stage collaboratively before pasting.

- [x] **Stage 1 (`Requirements`):** Output is concise structured JSON (not a prose report). Paste → validates & persists cleanly; `journey_allocated_minutes` = `90`; DLO `learning_outcomes` captured as authoritative. *(User-confirmed live + automated M1/M3.)*
- [x] **Stage 2 (`Progression`):** Copy prompt includes compact `AUTHORITATIVE STORED UPSTREAM CAPTURES` from Stage 1 (minutes, purpose, body of knowledge, learner profile/level/scope, constraints, numbered outcomes). Paste → validates phase `indicative_minutes` total = `90` & persists cleanly. *(User-confirmed live + automated M2/M3.)*
- [x] **Stage 3 (`Elements`):** Copy prompt includes compact Stage 1–2 anchors (minutes, body of knowledge, constraints, structure rationale, phases with scaffolding/dependencies). Paste → validates `phase_id` referential integrity & per-phase minutes = `90` & persists cleanly. *(User-confirmed live + automated M1/M2/M3.)*
- [x] **Stage 4 (`Commissioning`):** Copy prompt includes compact Stage 1–3 anchors (minutes, learner profile, constraints, journal orientation, numbered Stage 1 outcomes, progression arc/journal note, Stage 3 elements). Output is economical structured JSON (no ~14,000-word prose sprawl). Paste → validates & persists cleanly: *(User-confirmed live on Economics 90-min & Political Economy 50-component LJs + automated M1/M2/M3.)*
  - [x] All Stage 3 `element_ids` covered; no `interactive` commission; `sum(allocated_minutes) === 90`.
  - [x] Valid `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` blocks on every commission; proportionate commissioning principles honoured.
  - [x] Shared source handled cleanly (`generated`/`none` verified live; brief-provided `{ status: "provided" }` verbatim transport verified by automated M1/M2/M3 regression tests, with separate live brief-provided run not separately recorded).
  - [x] Continuity passes (meaningful preceding-activity descriptions; no automatic-transfer/inspection claims; declared read-only runtime artefacts allowed) and `journal` structure valid.
- [x] **Stage 5 (`Design Page` — thin partial):** Copy prompt provides compact editorial cues only (learner profile, numbered outcomes, continuity summary, compact Stage 3 element focus cues, commission manifest, Journal framing cues) — **zero** `specification_text`, **zero** `journey_context_text`, **zero** `shared_authoritative_material`.
  - [x] Completes comfortably within model output limits. *(User-confirmed live on both 90-min Economics LJ and 50-component Political Economy LJ.)*
  - [x] Paste thin partial → validates 1:1 `sections[]` order and framing-only Journal merge without altering `enabled`, entry order, or `artefact_id`. *(User-confirmed live + automated M1/M3.)*

---

## C. Deterministic Final Design Page Assembly & Unchanged DP Schema

- [x] Confirm final acceptance requires all 5 valid current stages (a partial run or monolithic paste cannot bypass assembly). *(Automated M1/M3 + live progressive assembly.)*
- [x] Inspect the deterministically assembled final LJ Design Page:
  - [x] Exact canonical top-level schema (`artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `activities: []`, `title`, `editorial_opening_image`, `shared_authoritative_material`, `sections[]`, `commissions[]`, `learning_journey`, `assembly_state`). *(Automated M1/M3 + live assembly & downstream intake.)*
  - [x] **Zero** intermediate-only field leakage (`element_ids`, `relevant_journey_outcome_numbers`, `decision_basis`, `feasibility_note`, or Stages 1–3 payloads). *(Automated M1/M3.)*

---

## D. Authoritative Outcomes, Shared Source, Duration, Continuity & Journal Integrity

- [x] Every assembled `commissions[].journey_context_text` carries deterministically injected Stage 1 outcomes (`<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> … <<<JOURNEY_LEARNING_OUTCOMES_END>>>`) with no conflicting duplicate blocks. *(Automated M1/M3 + live commissioning intake.)*
- [x] `shared_authoritative_material` matches Stage 4's locked corpus cleanly (live) and brief-provided source verbatim without retranscription (automated M1/M2/M3; separate live brief-provided source check not separately recorded).
- [x] `sum(commissions[].allocated_minutes) === 90`; any workload feasibility notices are advisory only and grounded in authoritative structured durations. *(Automated M1/M3 + live Economics LJ.)*
- [x] Continuity metadata and `learning_journey.journal` (`enabled`, ordered `{commission_id}.{elicitation_id}` entries, optional Stage 5 `title`/`framing`) are intact. *(Automated M1/M3 + live Economics LJ.)*

---

## E. Reload Persistence, Preview & Commissioning Readiness

- [x] **Reload persistence:** Hard-reload the browser and re-open the Economics workflow → all 5 stage captures restore identically, zero phantom captures appear, and the assembled Design Page stays accepted. *(User-confirmed manual acceptance check #1 — PASS, 2026-11-25.)*
- [x] **Preview:** Open learner Preview → Overview renders cleanly (title, editorial opening if enabled, sections, zero raw commissioning/continuity metadata). *(User-confirmed manual acceptance check #2 — PASS, 2026-11-25.)*
- [x] **Commissioning readiness:** Inspect single/batch component creation controls → all commissions appear in order with exact `allocated_minutes`, component LOs, journey LOs, shared source, and dependencies ready for Sprint 104 live acceptance. *(User-confirmed live — Economics LJ actively generating downstream components, including accepted regenerated C1.)*
- [x] **Legacy compatibility (read-only spot-check):** Open the untouched pre-Sprint 105 Economics baseline read-only → legacy chat Steps 1–4 and monolithic Step 5 remain intact without mutation; both historical Economics baselines preserved. *(User-confirmed manual acceptance check #3 — PASS, 2026-11-25.)*

---

## F. Lifecycle Checks (Use a Disposable Duplicate)

- [x] **Workflow duplication (`S105-AD-004`):** Duplicate the accepted Economics workflow → verify the duplicate preserves the brief and progressive mode, while cleanly separating brief from run-derived state (**zero** copied stage captures, **zero** cached assembled page, **zero** run-derived durations/source). *(User-confirmed manual acceptance check #4 — PASS, 2026-11-25; brief-provided source preservation on duplication additionally verified by automated M3 tests.)*
- [x] **Upstream invalidation & author-edit authority:** On the disposable duplicate, edit an upstream stage → confirm: *(User-confirmed manual acceptance check #5 — PASS, 2026-11-25.)*
  - [x] Downstream stages, cached assembled page, and commissioning readiness invalidate immediately.
  - [x] Downstream Copy prompt reflects the edited upstream capture (authoritative over chat).
  - [x] Reloading does **not** resurrect invalidated downstream captures.
- [x] **Clear run data:** On the disposable duplicate, run `Clear run data` → confirm all stage captures, validation states, cached assembled page, and run-derived metadata clear cleanly while brief data stays intact; reload confirms zero phantom captures. *(User-confirmed manual acceptance check #6 — PASS, 2026-11-25; brief-provided source preservation on clear-run additionally verified by automated M3 tests.)*
- [x] Disposable duplicate checks completed without disturbing the accepted Economics parent or historical baselines.
