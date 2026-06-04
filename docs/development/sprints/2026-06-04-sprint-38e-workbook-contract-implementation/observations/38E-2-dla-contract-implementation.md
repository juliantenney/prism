# Slice 38E-2 — DLA workbook contract implementation

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-2  
**Authority:** [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) · [38E-1](38E-1-implementation-target-audit.md) · [CW-REF DLA outline](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md)  
**Out of scope:** GAM §6 · `app.js` · `lib/ld-*` · tests · Design Page

---

## 1. Purpose

Enact **DLA-WB-01 … 19** in the **Design Learning Activities** pack surface so `self_directed` + learner-workbook briefs emit **multi-genre `required_materials` specifications** — not table-only activity shapes — while preserving DLA’s spec-only role (GAM authors bodies in **38E-3**).

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) | Normative DLA-WB clauses |
| [38E-1](38E-1-implementation-target-audit.md) | Allowed target: pack §5 only; `app.js` **NO** |
| [canonical-workbook-dla-outline.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md) | `delivery_notes` shape · per-activity material map |
| [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V1 DLA layer (V-08, V-09) |

**Applicability gate (in prompt):** `delivery_context` is `self_directed` **and** brief/desired outputs imply ~60-minute independent learner workbook or learner session page.

---

## 3. Files changed

| File | Section | Change |
|------|---------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§5 Design Learning Activities** only | `promptTemplate`: Self-study workbook contract (DLA-WB) block + extended `delivery_notes` / activity output schema |
| Same | §5 `defaultPromptNotes` | Workbook summary pointer to DLA-WB block |

**Not changed:** §6 GAM · §13 Design Page · `app.js` · `lib/*` · tests · fixtures

---

## 4. Contract clauses implemented

| DLA-WB clause | Level | Implementation location | Summary | Evidence |
|---------------|-------|-------------------------|---------|----------|
| **01** Intent | Mandatory | `promptTemplate` DLA-WB block + Output `delivery_notes` | `resource_intent`, `session_duration_target_minutes`, `consolidation_requirement`, `workbook_contract_applied` | `DLA-WB-01:` bullet; Output schema bullets |
| **02** Outcomes mapped | Mandatory | DLA-WB block + existing Instructions | Every activity ≥1 outcome; capstone ≥3 when ≥3 exist | `DLA-WB-02:` |
| **03** Duration | Mandatory | DLA-WB block | Sum `duration_minutes` 50–70; anti-EV-01 inflation note | `DLA-WB-03:` |
| **04** Solo feasibility | Mandatory | DLA-WB block | Individual default; no partner/facilitator requirement | `DLA-WB-04 / DLA-WB-17:` |
| **05** Progression / fading | Mandatory | DLA-WB block | A1…An fading; capstone synthesis not table archive | `DLA-WB-05:` |
| **06** Non-table diversity | Mandatory | DLA-WB block | ≥2 type families; table-only session **prohibited** | `DLA-WB-06:` |
| **07** Exposition | Mandatory | DLA-WB block | `text` + exposition purpose session-wide | `DLA-WB-07:` |
| **08** Worked example | Mandatory | DLA-WB block | `sample_output` or stepped `template` + learner_task link | `DLA-WB-08:` |
| **09** Modelling | Recommended | DLA-WB block | Alternate path via `reasoning_orientation` + spec | `DLA-WB-09 (recommended):` |
| **10** Guided practice | Mandatory | DLA-WB block | Task + materials; ≥2 practice-oriented activities | `DLA-WB-10:` |
| **11** Retrieval | Mandatory | DLA-WB block | ≥2 activities with task_cards / prompt_set / checklist | `DLA-WB-11:` |
| **12** Consolidation | Mandatory | DLA-WB block + `delivery_notes` | `consolidation_requirement` + final activity closure spec | `DLA-WB-12:` |
| **13** Synthesis capstone | Mandatory | DLA-WB block | Last activity integrative `expected_output` | `DLA-WB-13:` |
| **14** Transfer | Recommended | DLA-WB block | `transfer_or_application_task` / personal context on capstone | `DLA-WB-14 (recommended):` |
| **15** Evaluative judgement | Mandatory (when applicable) | DLA-WB block + optional `activity_interaction_type` | No pre-filled scores; justification in spec/output; rubric purpose for GAM | `DLA-WB-15:`; Output optional fields |
| **16** Capstone anti-dump | Prohibited | DLA-WB block | Capstone must not re-list all prior `*_table` types | `DLA-WB-16 (prohibited on capstone):` |
| **17** Partner/group | Prohibited | Merged with **04** in DLA-WB block | Same as solo feasibility | `DLA-WB-04 / DLA-WB-17:` |
| **18** Scenario | Mandatory (when applicable) | DLA-WB block | `scenario` material when case language in task/preamble | `DLA-WB-18:` |
| **19** Observable output | Mandatory | DLA-WB block + Output schema | Non-empty observable `expected_output` every activity | `DLA-WB-19:`; Output `expected_output` bullet |

**Crosswalk to canonical fixture:** [canonical-workbook-dla-outline.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md) session metadata and A1–A5 material shapes are **aligned** with the DLA-WB block (types/purposes; GAM token `consolidation_summary` deferred to **38E-3**).

---

## 5. Non-goals respected

| Non-goal | Status |
|----------|--------|
| §6 GAM edits | **Not touched** |
| `app.js` runtime scaffolds | **Not touched** |
| `LD-TABLE-FIDELITY` / `LD-MATERIALS-COPY` modules | **Not touched** |
| Design Page §13 | **Not touched** |
| Tests / probes | **Not touched** |
| GAM material bodies in DLA | **Explicitly forbidden** in DLA-WB intro + existing LD-MATERIALS-COPY ref |
| Workshop-only briefs | Workbook block **gated** on self_directed + workbook/learner-page signals |

---

## 6. `app.js` status

| Question | Answer |
|----------|--------|
| **Edited?** | **No** |
| **Rationale** | Per [38E-1 §7](38E-1-implementation-target-audit.md): pack §5 is sufficient to encode DLA-WB obligations; runtime OUTPUT CONTRACT remains supplementary. |
| **Follow-up** | If live DLA JSON still omits `delivery_notes` workbook fields after rerun, consider charter amendment for `buildSelfDirectedLearnerPageDlaOutputContractOverrideBlock` — **not required for 38E-2 completion**. |

---

## 7. Risks / follow-ups for 38E-3

| Item | Notes |
|------|--------|
| **GAM must realise DLA types** | DLA now mandates `text`, `scenario`, `sample_output`, retrieval types, consolidation **purpose** — GAM §6 must author bodies including `consolidation_summary` where closure purpose applies ([38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md)). |
| **Type token gap** | DLA enum unchanged (`text`, not `consolidation_summary`); closure specified via **purpose** + final-activity materials — GAM maps purpose → `Material: consolidation_summary` in 38E-3. |
| **Prompt size** | DLA-WB block adds ~2.5k chars to seeded template — monitor with `probe-38b1-ld-workflow-prompt-audit.js` in 38E-4. |
| **Brief gate** | Model must detect workbook intent from brief; weak briefs may skip block — evaluate on Inflation AFTER (38E-5). |
| **LD-SELF-DIRECTED-RHETORIC** | Runtime rhetoric still applies — no duplication of closure/worked-example **prose** in pack. |

---

## 8. Validation notes for 38E-4

| Check | Method |
|-------|--------|
| Pack contains `DLA-WB-01` and `DLA-WB-06` | Grep §5 `promptTemplate` / tests on resolved DLA prompt (38E-4) |
| `delivery_notes` schema | Assert prompt mentions `resource_intent`, `workbook_contract_applied` |
| V-08 duration | Score DLA JSON sum 50–70 after pipeline |
| V-09 material diversity | Score `required_materials` type families on DLA output |
| No §6 regression | GAM prompt unchanged — grep absence of `DLA-WB` in §6 |
| V-13 | Unchanged — preservation validated on AFTER GAM/DP only |

---

## 9. Completion statement

| Criterion | Met? |
|-----------|------|
| Every mandatory DLA-WB clause has pack location | **Yes** — §4 table |
| Recommended clauses documented | **Yes** — 09, 14 |
| Prohibited clauses documented | **Yes** — 16, 17 |
| Only §5 changed | **Yes** |
| No GAM / app.js / tests | **Yes** |
| 38E-3 can target GAM against DLA specs | **Yes** |
| Slice **38E-2** | **COMPLETE** |

**Next slice:** **38E-3** — GAM workbook genre contract in `domain-learning-design-step-patterns.md` **§6 only**.
