# Sprint 105 — Milestone 4 Manual Acceptance Checklist

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Gate:** Milestone 4 Live Acceptance (Fresh 90-Minute Economics Learning Journey)  
**Code baseline:** M1 (`4b698db`), M2 (`09cfbfc`), M3 (`83e7aec`), plus `index.html` cache-busting (`?v=20261125-s105-m4`)  
**Status:** Ready for manual authoring and collaborative review — **do not close Sprint 105 until manual acceptance is complete**

---

## Preservation & Scope Rules

- **Preserve untouched:** Keep both the original pre-intervention *Correlation and Causation: Making Sense of Economic Evidence* baseline and the incomplete Sprint 104 regeneration untouched (do not edit, clear, overwrite, or delete either).
- **Single canonical parent for Sprint 104 handback:** Author this fresh 90-minute / 2-week Economics Learning Journey manually and review each stage collaboratively. Once accepted, it will serve directly as the parent Learning Journey for subsequent Sprint 104 live acceptance (`M1` integrated acceptance, `M6`–`M7`), avoiding duplicate generation.
- **Disposable workflow for destructive lifecycle checks:** Run Section F (invalidation, duplication, clear-run) on a **disposable duplicate** so the accepted Economics parent stays pristine.

---

## Pre-Flight: Browser Freshness

- [ ] Open `http://localhost/prism/index.html` and hard-refresh (`Ctrl+Shift+R`).
- [ ] Confirm in DevTools Network / Console: `app.js?v=20261125-s105-m4` and `lib/learning-journey-assemble.js?v=20261125-s105-m4` load HTTP `200` with zero console errors.

---

## A. Progressive Workflow Creation & Five-Stage Prompt Routing

- [ ] Create a **fresh** Learning Journey workflow from the original 90-minute / 2-week *Correlation and Causation: Making Sense of Economic Evidence* brief (do not duplicate a legacy workflow).
- [ ] Confirm five ordered steps appear in Run mode (`Requirements`, `Progression`, `Elements`, `Commissioning`, `Design Page`), each exposing its own structured capture input.
- [ ] Inspect Copy prompts across Steps 1–5:
  - [ ] Steps 1–4 emit compact JSON stage contracts (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`) without legacy 11-section prose checklists.
  - [ ] Step 5 (`Design Page`) routes to the thin learner-facing editorial prompt with **zero** Interactive `Runner guidance` (`page_synthesis`, `activities[].materials[]`, `visual_affordance_schema_version 38.4`) and **no** raw full-JSON upstream dumps.

---

## B. Stage-by-Stage Capture, Validation, Persistence & Authoritative Handoff

Use a single fresh AI chat for Steps 1–5; review each stage collaboratively before pasting.

- [ ] **Stage 1 (`Requirements`):** Output is concise structured JSON (not a prose report). Paste → validates & persists cleanly; `journey_allocated_minutes` = `90`; DLO `learning_outcomes` captured as authoritative.
- [ ] **Stage 2 (`Progression`):** Copy prompt includes compact `AUTHORITATIVE STORED UPSTREAM CAPTURES` from Stage 1 (minutes, purpose, body of knowledge, learner profile/level/scope, constraints, numbered outcomes). Paste → validates phase `indicative_minutes` total = `90` & persists cleanly.
- [ ] **Stage 3 (`Elements`):** Copy prompt includes compact Stage 1–2 anchors (minutes, body of knowledge, constraints, structure rationale, phases with scaffolding/dependencies). Paste → validates `phase_id` referential integrity & per-phase minutes = `90` & persists cleanly.
- [ ] **Stage 4 (`Commissioning`):** Copy prompt includes compact Stage 1–3 anchors (minutes, learner profile, constraints, journal orientation, numbered Stage 1 outcomes, progression arc/journal note, Stage 3 elements). Output is economical structured JSON (no ~14,000-word prose sprawl). Paste → validates & persists cleanly:
  - [ ] All Stage 3 `element_ids` covered; no `interactive` commission; `sum(allocated_minutes) === 90`.
  - [ ] Valid `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` blocks on every commission; proportionate commissioning principles honoured.
  - [ ] Shared source handled cleanly (`provided` verbatim without retranscription if brief-supplied, else concise `generated` or `none`; zero derived-stat contradictions).
  - [ ] Continuity passes (meaningful preceding-activity descriptions; no automatic-transfer/inspection claims; declared read-only runtime artefacts allowed) and `journal` structure valid.
- [ ] **Stage 5 (`Design Page` — thin partial):** Copy prompt provides compact editorial cues only (learner profile, numbered outcomes, continuity summary, compact Stage 3 element focus cues, commission manifest, Journal framing cues) — **zero** `specification_text`, **zero** `journey_context_text`, **zero** `shared_authoritative_material`.
  - [ ] Completes comfortably within model output limits.
  - [ ] Paste thin partial → validates 1:1 `sections[]` order and framing-only Journal merge without altering `enabled`, entry order, or `artefact_id`.

---

## C. Deterministic Final Design Page Assembly & Unchanged DP Schema

- [ ] Confirm final acceptance requires all 5 valid current stages (a partial run or monolithic paste cannot bypass assembly).
- [ ] Inspect the deterministically assembled final LJ Design Page:
  - [ ] Exact canonical top-level schema (`artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `activities: []`, `title`, `editorial_opening_image`, `shared_authoritative_material`, `sections[]`, `commissions[]`, `learning_journey`, `assembly_state`).
  - [ ] **Zero** intermediate-only field leakage (`element_ids`, `relevant_journey_outcome_numbers`, `decision_basis`, `feasibility_note`, or Stages 1–3 payloads).

---

## D. Authoritative Outcomes, Shared Source, Duration, Continuity & Journal Integrity

- [ ] Every assembled `commissions[].journey_context_text` carries deterministically injected Stage 1 outcomes (`<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> … <<<JOURNEY_LEARNING_OUTCOMES_END>>>`) with no conflicting duplicate blocks.
- [ ] `shared_authoritative_material` matches brief-provided source verbatim (if supplied) or Stage 4's locked corpus cleanly.
- [ ] `sum(commissions[].allocated_minutes) === 90`; any workload feasibility notices are advisory only and grounded in authoritative structured durations.
- [ ] Continuity metadata and `learning_journey.journal` (`enabled`, ordered `{commission_id}.{elicitation_id}` entries, optional Stage 5 `title`/`framing`) are intact.

---

## E. Reload Persistence, Preview & Commissioning Readiness

- [ ] **Reload persistence:** Hard-reload the browser and re-open the Economics workflow → all 5 stage captures restore identically, zero phantom captures appear, and the assembled Design Page stays accepted.
- [ ] **Preview:** Open learner Preview → Overview renders cleanly (title, editorial opening if enabled, sections, zero raw commissioning/continuity metadata).
- [ ] **Commissioning readiness:** Inspect single/batch component creation controls → all commissions appear in order with exact `allocated_minutes`, component LOs, journey LOs, shared source, and dependencies ready for Sprint 104 live acceptance.
- [ ] **Legacy compatibility (read-only spot-check):** Open the untouched pre-Sprint 105 Economics baseline read-only → legacy chat Steps 1–4 and monolithic Step 5 remain intact without mutation.

---

## F. Lifecycle Checks (Use a Disposable Duplicate)

- [ ] **Workflow duplication (`S105-AD-004`):** Duplicate the accepted Economics workflow → verify the duplicate preserves the brief, brief-provided source (if any), and progressive mode, while having **zero** copied stage captures, **zero** cached assembled page, **zero** `commissioned_component_durations`, and **zero** run-generated `source_context`.
- [ ] **Upstream invalidation & author-edit authority:** On the disposable duplicate, paste valid Stages 1–5, then edit Stage 1 (e.g. refine `purpose` or an outcome wording) → confirm:
  - [ ] Downstream stages (2–5), cached assembled page, and commissioning readiness invalidate immediately.
  - [ ] Step 2 Copy prompt reflects the edited Stage 1 capture (authoritative over chat).
  - [ ] Reloading does **not** resurrect invalidated downstream captures.
- [ ] **Clear run data:** On the disposable duplicate, run `Clear run data` → confirm all stage captures, validation states, cached assembled page, and run-derived metadata clear cleanly while brief and brief-provided source (if any) stay intact; reload confirms zero phantom captures.
- [ ] Delete the disposable duplicate when finished, leaving the accepted Economics parent clean for Sprint 104 handback.
