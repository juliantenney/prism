# Sprint 18 — Slice 3A: manual validation & adequacy copy polish

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-18-slice-3a-manual-validation.md`  
**Status:** **Planned (docs only)** — no implementation in this slice document; execution is manual Factory validation + optional pack copy PR.

**Prerequisite:** Slices 1–2 and 3C-1/3C-2 **closed** — three live `planning_adequacy` checks; **95 automated tests** green.

**Pack:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Out of scope for 3A:** `app.js` changes, new adequacy rules (C–E), fixtures/tests, dismiss/chat/grouping UI, LD, renderer/schema, AI phrasing.

---

## 1. Purpose

Slice 3A answers: *Do assistive adequacy notices feel helpful after real workflow synthesis in Factory, and is the copy clear without becoming form-wizard noise?*

| In scope | Out of scope |
|----------|----------------|
| Manual Factory pass with scripted briefs | Runtime predicate changes |
| Planning panel behaviour verification | Dismiss / suppress (Slice 3B) |
| Copy polish proposals for `disclosurePolicy` | Chat clarification flows |
| Observations on weak/strong checks | Checks C–E implementation |
| “Intelligent vs bureaucratic” rubric | Grouping/collapse **implementation** |

**Deliverable:** Completed manual matrix (pass/fail/notes) + approved copy tweaks in Research pack (optional follow-up PR, pack-only).

---

## 2. Manual test matrix

Run in **Workflow Factory** with **Research** domain selected. For each row: complete essentials elicitation if prompted, trigger workflow design generation, then inspect **Planning** notices (category order 1–6). Record: essentials outcome, step list snapshot, adequacy ids surfaced, copy quality (1–5), bureaucratic? (Y/N).

### 2.1 Core Sprint 18 scenarios (required)

| ID | Theme | Brief / inputs (paste into Factory) | Essentials to set | Automated analogue | Expected adequacy (post-synthesis) | Blocking categories first? |
|----|-------|--------------------------------------|---------------------|--------------------|----------------------------------|----------------------------|
| **3A-M0** | Broad executive briefing | Design intent: *Analyse the evidence and produce an executive briefing on AI governance risks.* Audience: *Executive leadership.* Desired outputs: *executive briefing.* Inputs: empty. | `generate_from_topic`, `briefing`, `standard` depth | S7, S8 | `topic_scope_under_specified` **and** `evidence_language_generate_from_topic_mismatch` (≤3 rows) | None after essentials complete |
| **3A-M1** | Concise but analysis-heavy | *Concise executive briefing on university AI policy for provosts.* Audience: *University provosts.* Desired: *briefing note.* | `generate_from_topic`, `briefing`, **`concise`** depth | S9 | `plan_heavy_for_output_depth`; topic scope **unlikely** (sector cue “university”) | None after essentials complete |
| **3A-M2** | Page delivery | *Climate evidence briefing for institutional leaders.* Desired outputs: *HTML-ready structured page for utilities export.* Scope constraints: *no validation pass.* | Resolve essentials; note Design Page timing | S5 | **No** `plan_heavy` unless concise; page adequacy (check C) **not live** — observe whether user **expects** page notice | May show missing essentials / gates first |
| **3A-M3** | Scoped topic | *Thematic analysis of NHS England waiting-list policy for operational leads, UK, 2023–2025.* Audience: *Operational leads.* | `generate_from_topic`, `analysis` or `briefing`, `standard` | — (negative for scope) | **No** `topic_scope_under_specified` if scope cues present | None when complete |
| **3A-M4** | Unscoped topic | *Research on AI ethics.* Audience: *Researchers.* | `generate_from_topic`, essentials complete | S1 analogue (essentials path) | After complete: likely `topic_scope` if analysis steps present | Essentials may block first |
| **3A-M5** | Sparse brief | *Research help* (minimal) | Answer essentials only | S6 | **No** adequacy until essentials resolved; then depends on resolved strategy | `missing_essential` until filled |
| **3A-M6** | Conflicting intent | *Produce an analysis briefing on digital inclusion evidence.* | Do **not** force-resolve conflict silently | S4 | `conflicting_intent` / `objective_type_mixed_signals`; **no** adequacy while conflict unresolved | **Blocking** conflict before adequacy |

### 2.2 Regression anchors (Sprint 17 — required)

| ID | Brief | Expected |
|----|-------|----------|
| **3A-R2** | *Summarise uploaded PDFs on climate policy* — empty inputs | `blocked_unsafe_inference` / upload disclosure; **no** adequacy |
| **3A-R3** | S3: sources + audience in fields | Provided source; **no** evidence-language or topic-scope mismatch for generate-from-topic |
| **3A-R4** | Re-run M6 until single objective chosen | Adequacy may appear **after** conflict cleared |

### 2.3 Optional depth (time permitting)

| ID | Focus |
|----|--------|
| **3A-O1** | M0 with `provided_source_content` + PDF listed — evidence-language should **not** fire |
| **3A-O2** | M0 with `output_depth: concise` — may add `plan_heavy` (stack ≤3) |
| **3A-O3** | Re-generate design after brief edit — adequacy refreshes, no stale ids |

---

## 3. Expected Planning-panel behaviour

### 3.1 Category order (unchanged Sprint 17 → 18)

| Order | Category | Blocking? |
|-------|----------|-----------|
| 1 | Still needed (`missing_essential`) | Yes — essentials incomplete |
| 2 | Conflicting intent | Yes — factor conflict |
| 3 | Blocked unsafe inference | Yes — unsafe posture |
| 4 | Inferred but not used | Transparent |
| 5 | Planning steps withheld (`gated_planning`) | Proceedability |
| 6 | **Planning adequacy** | **No** — assistive only |

### 3.2 When adequacy appears

| Condition | Behaviour |
|-----------|-----------|
| Essentials missing | **No** `planning_adequacy` rows |
| Essentials complete, **before** design generation | **No** adequacy (Slice 2 contract) |
| Essentials complete, **after** heuristic + design snapshot | Adequacy evaluated and merged into `planningDisclosures` |
| Save / run | **Not** blocked by adequacy |

### 3.3 Live adequacy ids (copy source: Research pack)

| ID | Message intent | Action intent |
|----|----------------|---------------|
| `topic_scope_under_specified` | Broad topic + analysis steps | Narrow scope or confirm broad scan |
| `evidence_language_generate_from_topic_mismatch` | Evidence wording vs generate-from-topic | Attach sources or confirm topic-only |
| `plan_heavy_for_output_depth` | Concise depth vs heavy chain | Raise depth or trim steps |

### 3.4 Panel rendering checklist

- [ ] Section header reads **Planning adequacy** (order 6, after gates).
- [ ] Each row shows **message** then **Action:** line (from pack).
- [ ] Adequacy rows do **not** show as missing essentials.
- [ ] Re-opening workflow after design: panel matches latest synthesis.

---

## 4. Stacking expectations

| Scenario | Expected ids (max **3**) | Notes |
|----------|--------------------------|-------|
| **M0** (smoke) | `topic_scope_under_specified`, `evidence_language_generate_from_topic_mismatch` | Same brief as S7/S8; **2 rows** typical |
| **M0 + concise depth** | Above + possibly `plan_heavy_for_output_depth` | **3 rows** = at cap; verify no silent drop of topic_scope |
| **M1** (S9 shape) | `plan_heavy_for_output_depth` only | University cue suppresses weak topic |
| **M3** (scoped) | 0 adequacy ideal | If analysis steps + generate_from_topic but scoped copy |
| **M6** (conflict) | 0 adequacy until conflict resolved | Safety categories dominate |

**Pack evaluation order:** declaration order in `planningAdequacyChecks[]` — topic scope → evidence language → plan heavy. Cap keeps **first three matches**.

**Manual pass criteria for stacking:**

- Stacked notices must feel **distinct** (not three ways to say “narrow your brief”).
- If two rows feel redundant, log under §5 noise observations.

---

## 5. Noise / redundancy observations to watch for

Use this log during manual runs (copy into review-log or session notes).

| Observation | Where to log | Example trigger |
|-------------|--------------|-----------------|
| **Duplicate concern** | M0, M0+concise | Topic scope + evidence language both mention “broad” / “sources” |
| **Late surprise** | Any | User surprised adequacy appeared **after** seeing long step list |
| **False calm** | M3 | Scoped brief still shows topic_scope |
| **False alarm** | M1 | Concise + light chain still shows plan_heavy |
| **Category fatigue** | M6 → resolved | Many categories at once before adequacy |
| **Cap truncation** | M0 + concise | Fourth rule would fire but cap hides it — note if user never sees plan_heavy |
| **Jargon** | All | “Thematic analysis”, “evidence map” in user-facing copy |
| **Instruction vs invitation** | All | “You must” vs “Consider” tone |

**Hypothesis to validate:** M0 stacking is **acceptable** (2 notices) if messages reference **different decisions** (scope vs corpus vs depth).

---

## 6. Criteria: “feels intelligent vs bureaucratic”

Score each adequacy row **after** manual run (1 = bureaucratic, 5 = intelligent). Team median ≥4 to keep copy; ≤2 triggers copy revision in 3A polish PR.

| Criterion | Intelligent (target) | Bureaucratic (avoid) |
|-----------|----------------------|----------------------|
| **Grounding** | References **plan shape** (analysis steps, depth, sources) | Generic “your brief is incomplete” |
| **Agency** | Offers **proceed** path (“confirm broad scan”) | Implies user error or non-compliance |
| **Timing** | Appears when plan makes tradeoff visible | Feels like extra form field |
| **Density** | One clear idea per notice | Same idea repeated across rows |
| **Voice** | Improvement suggestion | Audit / QA checklist tone |
| **Proportionality** | Matches stakes (executive briefing) | Same weight for trivial briefs |

**Slice 3A pass bar:**

- M0 and M1 each have ≥1 adequacy row scoring **≥4**.
- No required scenario scores **≤2** on all rows.
- M6 shows blocking behaviour **unchanged** (Sprint 17 safety).

---

## 7. Candidate message / copy refinements (pack-only, deterministic)

Current pack text is in `domains/research/domain-research-step-patterns.md` → `disclosurePolicy`. Below are **candidates** for 3A polish PR — do not implement until manual log confirms need.

### 7.1 `topic_scope_under_specified`

| | Text |
|---|------|
| **Current message** | This workflow includes analysis steps (for example thematic analysis or an evidence map) from a broad topic. Narrowing by sector, jurisdiction, timeframe, or policy frame can sharpen the plan—or confirm you want a broad exploratory scan. |
| **Current action** | Add sector, jurisdiction, timeframe, or policy frame to the brief—or proceed if a broad exploratory scan is intended. |
| **Candidate message** | Your plan includes deep analysis steps, but the topic is still broad. Adding sector, region, or timeframe—or confirming a broad exploratory scan—will align the workflow with your intent. |
| **Candidate action** | Add scope to the brief, or continue if a wide-ranging scan is what you want. |

### 7.2 `evidence_language_generate_from_topic_mismatch`

| | Text |
|---|------|
| **Current message** | The brief uses evidence or source-material language, but the plan is set to generate from a topic without attached sources. |
| **Current action** | Attach source files in Inputs, list corpus materials, or confirm you want topic-only generation without existing evidence. |
| **Candidate message** | You asked to work from evidence, but sources are not attached and the plan will generate grounding from the topic instead. |
| **Candidate action** | Add inputs in the brief, or confirm topic-only generation is intended. |

### 7.3 `plan_heavy_for_output_depth`

| | Text |
|---|------|
| **Current message** | A concise output depth was requested, but the draft plan includes a relatively heavy analysis and synthesis chain. |
| **Current action** | Set output depth to standard or detailed, or remove deep synthesis steps if you want a lighter plan. |
| **Candidate message** | You asked for a concise deliverable; the draft plan still includes several analysis and synthesis steps. |
| **Candidate action** | Switch depth to standard, or edit the plan to drop steps you do not need backstage. |

**Polish rules:** Shorten first sentence; keep **Action:** imperative but friendly; preserve deterministic pack-only policy (no AI rewrite in 3A).

---

## 8. Future grouping / collapse ideas (docs only)

Not implemented in 3A. Capture for Slice 3B+ or UX charter.

| Idea | Benefit | Depends on |
|------|---------|------------|
| **Bundle “scope & sources”** | Reduce M0 double-notice fatigue | Dismiss state + grouping key |
| **Collapsible Planning adequacy** | Less vertical scroll when 3 rows | Panel UI only |
| **Severity chip** | “Suggestion” vs “Review” | Schema for `severity` display |
| **Related step links** | Tie notice to Thematic Analysis card | Step list annotations (deferred) |
| **“Acknowledge & continue”** | One click for assistive rows | Dismiss lifecycle (3B) |
| **Summary line** | “2 planning suggestions” header | Grouping in `formatWorkflowBriefPlanningNoticesLines` |

**Constraint:** Grouping must not hide **blocking** categories (orders 1–5).

---

## 9. Adequacy checks — weak / strong signals from manual use

Record per check after matrix completion.

| Check | May feel **too weak** if… | May feel **too strong** if… | 3A action |
|-------|---------------------------|-----------------------------|-----------|
| `topic_scope_under_specified` | User had clear scope in prose but not cue list | Fires on every short topic label | Tune `scopeCueMentionAnyOf` / token count (future pack) |
| `evidence_language_generate_from_topic_mismatch` | “Evidence” used metaphorically | Fires whenever M0 brief used | Narrow `briefFieldMentionAnyOf` terms |
| `plan_heavy_for_output_depth` | User wanted concise **output** not light **plan** | Any 7-step chain with concise | Raise `minSteps` or require delivery step (pack) |

**Deferred checks (manual preview only — not live):**

| Check | Preview question for M2 / M11 |
|-------|-------------------------------|
| C `page_delivery_without_design_page` | Does user notice missing Design Page without a notice? |
| D `objective_synthesis_path_mismatch` | After M6 resolve, does summary+analysis mismatch appear? |
| E `audience_generic_for_executive_delivery` | Does M0 “Executive leadership” deserve a fourth notice? |

---

## 10. Execution checklist (Slice 3A closeout)

| Step | Owner | Done? |
|------|-------|-------|
| Run `node --test tests/*.test.js` — **95 passed** before manual session | Dev | ☐ |
| Complete matrix §2.1 + §2.2 in Factory | QA / dev | ☐ |
| Score §6 rubric for M0, M1, M6 | QA / dev | ☐ |
| Fill §5 noise log | QA / dev | ☐ |
| Fill §9 weak/strong table | QA / dev | ☐ |
| Decide copy: keep current vs §7 candidates (pack PR optional) | Product / dev | ☐ |
| Update `review-log.md` with 3A manual outcome | Dev | ☐ |

**Automated regression floor:** **95 passed**, 0 failed — must hold after any pack-only copy PR.

---

## 11. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-18-bootstrap.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md) §13 | Original M0–M8 list |
| [`SPRINT-18-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) | Sprint closeout + slice status |
| [`sprint-18-slice-3c-charter.md`](sprint-18-slice-3c-charter.md) | Checks A/B live |
| `tests/fixtures/workflow-brief-research-sparse/S7`–`S9` | Automated expectations for M0/M1 |
