# Slice 42-1 — Exposition Baseline Audit

**Sprint:** 42 — Authorial Quality / Educational Exposition  
**Type:** Investigation only — no production code changes  
**Date:** 2026-06-11  
**Framing question:** How can existing educational structure be presented as a coherent authored experience?

---

## Purpose and method

This audit compares four committed page fixtures that represent Sprint 41 validation workflows:

| Fixture | Role in audit |
| ------- | ------------- |
| `tests/fixtures/page-render/marx-self-study-page.json` | Strong structural exemplar (7/8 EQF); target “authored” quality bar |
| `tests/fixtures/page-render/marx-self-study-design-quality-page.json` | Thin contrast — same topic arc, minimal framing |
| `tests/fixtures/page-render/ld-inflation-workshop-page.json` | Facilitated workshop learner page (5/8 EQF) |
| `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Discussion/judgement workshop page (5/8 EQF) |

Supplementary reference (not primary benchmark): `tests/fixtures/page-render/self-directed-activity-framing-page.json` — illustrates full PEL field population and how framing reads when all schema slots are filled.

**Method:** Section-by-section and activity-by-activity reading of JSON field prose. Focus on learner-visible text in page sections and activity metadata — not materials-body authoring depth (GAM is out of scope for Slice 42-2 unless later rescoped).

**Settled architecture (not challenged by this audit):** EQF integration, PEL contracts, mandatory DLA framing, Design Page preservation repair, renderer layout, workflow steps, schema.

---

## Executive summary

All four primary fixtures are **structurally competent** — they specify activities, tasks, outputs, and (where present) progression. None read as a **coherent authored learning resource** end-to-end.

| Pattern | Marx self-study (full) | Marx (thin) | Inflation workshop | Climate workshop |
| ------- | ---------------------- | ----------- | ------------------ | ---------------- |
| Assembled feel | Medium — rich materials, thin wrappers | High — task stack | High — session blocks | High — single-activity dump |
| Exposition depth | Deep in **materials**; shallow in **page/activity prose** | Procedural only | Overview OK; activities task-led | One-line overview |
| Transitions | Bridges present but imperative/terse | Absent | None between activities | N/A (one activity) |
| Framing integration | Preambles cue tasks; cognition sparse | No framing fields | No framing fields (pre-41 shape) | No framing fields |
| Strongest authored moments | Worked example + step→meaning in A2 materials | — | Learning purpose bullets | Analysis template structure |

**Principal finding:** Educational **structure** and **scaffolded materials** often exceed the quality of **compose-level prose** (overview, purpose, preamble, bridges, study guidance). Sprint 42 should raise the floor on **how the page speaks**, not what fields exist.

**Contrast insight:** `marx-self-study-page.json` vs `marx-self-study-design-quality-page.json` shows that adding intellectual progression (model row → independent application) and rich materials improves **structure** dramatically, but full fixture still leaves **activity-facing exposition** thin compared to what PEL fields could carry (`self-directed-activity-framing-page.json`).

---

## 1. Assembled vs authored — by fixture

### 1.1 Marx self-study (full) — `marx-self-study-page.json`

**Reads as authored (partial):**

- `knowledge_summary` provides a conceptual spine with named relationships before activities.
- Activity sequence A2 → A3 → A4 implements faded scaffolding (modelled row → partial table → independent application).
- Materials bodies (worked example, step→meaning, self-check, closure prompts inside template/checklist) read as **instructional writing**.

**Reads as assembled:**

- Page opens with **glossary block** then **activity cards** — no page-level narrative that welcomes the learner or states the intellectual arc in connected prose.
- Each activity presents a **stack of labelled slots**: `purpose` → `activity_preamble` → `learner_task` → `support_note` → materials — without prose that weaves them together.
- `study_tips` is a **separate section** of bullet reflections; it does not close the journey in narrative form.

**Representative assembled stack (A3):**

| Field | Text (abridged) | Issue |
| ----- | ----------------- | ----- |
| `purpose` | “Complete the comparison using the modelled move.” | Names move; does not teach |
| `activity_preamble` | “The Manifesto row is modelled; add Das Kapital…” | Instructional cue, not orientation |
| `intellectual_coherence_bridge` | “Reuse the purpose-and-difference move…” | Imperative reuse, not narrative carry-forward |
| `learner_task` | “Complete the comparison table…” | Task-led |
| `self_explanation_prompt` | One sentence prompt | Cognition label; not integrated into opening prose |

The learner experiences **correct pedagogy in the wrong genre** — workbook engineering visible, textbook voice absent.

---

### 1.2 Marx self-study (thin) — `marx-self-study-design-quality-page.json`

**Reads as assembled throughout:**

- Single section: `learning_activities` only — no overview, knowledge summary, or study closure.
- Activities are **isomorphic cards**: title, purpose, learner_task, materials, expected_output, support_note.
- No `activity_preamble`, cognition fields, or `intellectual_coherence_bridge`.

**Representative procedural pattern (A3):**

- `purpose`: “Distinguish between Marx's key texts.”
- `learner_task`: “Complete the comparison table using prompts and identify differences and similarities.”
- `support_note`: “Focus especially on political vs analytical purpose.”

This is the **baseline anti-pattern** for Sprint 42: structurally valid LO rows that read like a specification, not a learning resource. It demonstrates that **structure without exposition** is exactly the gap Sprint 41 validation attributed to “design quality variant” (−3 EQF dimensions vs full page).

---

### 1.3 Inflation workshop — `ld-inflation-workshop-page.json`

**Reads as authored (partial):**

- `overview` + `learning_purpose` establish session intent in learner-facing language.
- Learning purpose uses outcome bullets — conventional for workshops, recognisable as “session brief.”

**Reads as assembled:**

- Activities have **no** `activity_preamble`, cognition fields, or bridges (fixture predates Sprint 41 mandatory framing).
- `learner_task` is often bare discussion bullets (A1) or “Complete the table” (A2) with **no orienting prose**.
- `support_note` on A1: *“Circulate during minutes 5–12; prompt groups to use evidence…”* — **facilitator choreography on `page_profile: learner`** (also flagged in 38C richness review for other inflation runs).
- No connective text between A1 warm-up and A2 measures activity — intellectual momentum is **implicit in session order only**.

**Session-shaped, not journey-shaped:** The page reads as a **facilitator run-sheet** adapted for learners, not a resource that carries the learner through an argument about inflation measurement.

---

### 1.4 Climate misconception workshop — `ld-climate-misconception-discussion-page.json`

**Reads as assembled throughout:**

- `overview`: one sentence — *“Discuss and evaluate common climate change misconceptions…”* — no stakes, no conceptual hook, no preview of reasoning moves.
- No `learning_purpose` section.
- Single activity `CC-MIS-1` bundles **task_cards, template, prompts, checklist** in `materials` with one compound `learner_task`.
- `expected_output` is a **markdown-formatted specification** inside a string (`## What you will produce`) — reads as author notes, not learner-facing prose.

**Task-led opening:** *“Work through the misconception cards, complete the analysis template, and discuss using the prompt set.”* — three deliverables listed, no exposition of **why** misconception repair matters or **how** to think before starting.

This fixture has strong **judgement structure** (classify claim, evidence, response) but minimal **authorial voice** at page and activity level.

---

## 2. Thin, procedural, or task-led exposition

| Location | Fixture | Symptom | Example |
| -------- | ------- | ------- | ------- |
| Activity openers | Marx thin | Task-first | “Complete the cause–effect table…” (A2) |
| Activity openers | Marx full | Cue-first, not teach-first | “Study the model row before completing…” (A2 preamble) |
| Page entry | Climate | Minimal | One-sentence overview |
| Page entry | Marx full | Reference-first | Knowledge summary glossary without narrative frame |
| Session framing | Inflation | Bullet LOs only | Learning purpose list — no connecting paragraph |
| Expected output | Climate | Spec-like | `## What you will produce` markdown in JSON string |
| Support notes | Inflation | Facilitator timing | “Circulate during minutes 5–12” |
| Support notes | Marx thin | Generic coaching | “Use cause-and-effect language such as…” |
| Materials vs wrappers | Marx full | Depth inversion | Step→meaning in materials; thin preamble outside |

**Depth inversion (important for Sprint 42):** The most teachable prose in Marx full lives **inside** `materials` (worked examples, step→meaning, closure). Page-level and activity-level fields are **shorter and more procedural** than the materials they introduce. Design Page compose currently **preserves** this split; it does not **integrate** it into a unified reading experience.

---

## 3. Transitions and intellectual momentum

| Fixture | Transition mechanism | Momentum assessment |
| ------- | -------------------- | ------------------- |
| Marx full | `intellectual_coherence_bridge` on A3, A4 | **Present but weak** — imperative (“Reuse…”, “Move from…”) rather than narrative (“Having established X, you now…”) |
| Marx full | Faded scaffolding in materials | **Strong structurally** — model row → open row → no model |
| Marx thin | None | **Absent** |
| Inflation | Section order only | **Weak** — A1→A2 is chronological session block, not conceptual escalation |
| Climate | N/A | **Not attempted** at page level |

**Failure mode:** Transitions read as **instructions to reuse a move**, not as **story of the inquiry**. A learner can follow the sequence without feeling carried forward by an argument.

**Stronger counter-example (materials layer, A3 template):**

> “If your difference could describe only one book → you have not yet compared the two works.”

This teaches **discriminative thinking** in prose. `intellectual_coherence_bridge` on the same activity does not reach the same explanatory depth.

---

## 4. Framing visible as scaffolding vs integrated prose

Sprint 41 mandates `activity_preamble` + cognition fields. Fixtures show **two different problems**:

### 4.1 Missing framing (workshop fixtures)

Inflation and climate pages have **no** preamble or cognition fields. The learner sees tasks and materials only — framing must be inferred from structure.

### 4.2 Thin framing (Marx full)

Preambles exist but function as **stage directions**:

- A2: “Study the model row before completing the full comparison table.”
- A4: “No model row — apply checklist terms directly to the case.”

These describe **scaffolding state**, not **why the capability matters** or **how this step fits the journey**.

### 4.3 Full framing stack (supplementary fixture)

`self-directed-activity-framing-page.json` populates `study_orientation`, `intellectual_frame`, `reasoning_orientation`, `conceptual_contrast_prompt`, etc. Even here, each field is a **discrete paragraph** under renderer labels (“Study orientation”, “How to think”, “Key distinction”). The architecture **surfaces scaffolding** — it does not **merge** it into unified activity introduction prose.

**Sprint 42 goal (clarified):** Keep fields for preservation and renderer contracts; improve **compose-time prose** so fields **say teachable things** and **do not repeat each other** — integration is achieved through **authorial discipline at compose**, not by collapsing schema.

---

## 5. Redundancy hotspots

| Redundancy type | Where observed | Example |
| --------------- | -------------- | ------- |
| `purpose` ↔ `activity_preamble` | Marx full | Both state what the activity does; preamble rarely adds journey context beyond purpose |
| `purpose` ↔ `learner_task` | Marx thin, Inflation | Purpose names skill; task immediately repeats execution |
| `overview` ↔ `learning_purpose` | Inflation | Overview session summary; purpose repeats outcomes — no distinct narrative roles |
| `knowledge_summary.use_in_activities` ↔ activity tasks | Marx full | Summary pre-announces comparison/application moves that activities repeat |
| `support_note` ↔ materials self-check | Marx full | “Check your thinking…” in support_note; similar cues inside template |
| `study_tips` ↔ closure in materials | Marx full | End-of-activity closure prompts in checklist; study_tips repeats reflection at page level |
| PEL orientation ↔ preamble (risk) | Framing fixture | `study_orientation` + `activity_preamble` + `intellectual_frame` — three orientation layers before task |

**Compose opportunity:** Assign **distinct rhetorical jobs** to each surviving field — e.g. overview = stakes and arc; learning_purpose = measurable outcomes; preamble = teach why this activity now; bridge = one sentence of carried reasoning; task = actions only.

---

## 6. Stronger authored moments already present

These are **models to elevate**, not new structure to invent.

### Marx full — materials-layer instruction

**Worked example + step→meaning (A2):**

```text
### Step → meaning
- Fill Purpose → states the author's aim (what the text tries to do), not plot events.
- Fill One difference → contrasts the two works on a defensible dimension.
```

**Self-check with repair path (A3 template):**

```text
If your difference could describe only one book → you have not yet compared the two works.
```

**Transfer limit (A4):**

```text
transfer_or_application_task: Name one assumption in your factory explanation that might fail in a different workplace
```

### Marx full — progression design

- A2 modelled → A3 partial completion → A4 independent application is **authored sequencing** even when preambles are thin.

### Inflation — session clarity

- Learning purpose bullets are **clear and assessable** — suitable as outcomes anchor if wrapped in brief connective prose.

### Climate — judgement scaffold

- Analysis template sections (claim, evidence, classification, response) embody **evaluation architecture** — the page wrapper fails to **introduce** them narratively.

### Framing fixture — orientation vocabulary

- `intellectual_frame`: *“You are thinking like a historian connecting biography, texts, and social change.”* — short, disciplinary, learner-facing (quality target for preamble/orientation **content**, even if label remains).

---

## 7. Workshop vs self-study voice needs

| Dimension | Self-study (Marx full) | Workshop (Inflation, Climate) |
| --------- | ---------------------- | ------------------------------- |
| **Reader model** | Solo learner working asynchronously | Learner in group/session context |
| **Time rhetoric** | Duration per activity; study_tips | Session overview (60 minutes); grouping on rows |
| **Legitimate reference** | “Work through at your pace”, note-taking, self-check | “Discuss in your group”, scenarios, templates |
| **Independence** | Faded scaffolding, transfer tasks | Judgement/discussion; independence = reasoned consensus not solo transfer |
| **Voice risk** | Over-explains or reads like textbook | Reads like facilitator run-sheet |
| **Framing need** | `study_orientation`, intellectual arc, self-explanation | Activity preambles that orient **within** discussion (not facilitator timing) |
| **Anti-pattern** | — | `support_note` with circulate/timing (Inflation A1, A2) |

**Shared need:** Both profiles need **conceptual narrative** — why this topic, why this order, what reasoning move is being practised.

**Profile-specific compose rule (proposed):** Workshop voice may reference collaboration; it must not export facilitator choreography into learner-visible notes. Self-study voice must **teach before task** because no live tutor repairs thin orientation.

---

## 8. Exposition success criteria for Sprint 42

Measurable at **page JSON / compose** level without new schema, EQF dimensions, or renderer changes. Intended for Slice 42-2+ validation (human review + optional fixture diff).

### 8.1 Page-level

| ID | Criterion | Pass indicator |
| -- | --------- | -------------- |
| P1 | **Entry narrative** | `overview` and/or `learning_purpose` include at least one connective paragraph (not bullets alone) stating stakes + arc |
| P2 | **Distinct section roles** | Overview does not repeat learning_purpose outcome list verbatim; each section has a defined rhetorical job |
| P3 | **Closure** | Self-study pages end with synthesis prose (study_tips or equivalent) that names what changed, not only reflection prompts |
| P4 | **No facilitator leakage** | Learner `page_profile` has no timing/circulate/debrief choreography in `support_note` or activity prose |

### 8.2 Activity-level

| ID | Criterion | Pass indicator |
| -- | --------- | -------------- |
| A1 | **Preamble teaches** | `activity_preamble` explains why + capability + journey link in 1–3 sentences — not only what to do first |
| A2 | **Task separation** | `learner_task` does not repeat `activity_preamble` sentences |
| A3 | **Cognition integration** | At least one cognition field adds **how to think** not restated in preamble/task |
| A4 | **Bridge as narrative** | `intellectual_coherence_bridge` names carried distinction + escalation — avoids bare “reuse move” imperatives |
| A5 | **Purpose non-redundant** | `purpose` names learning move; does not duplicate preamble opening sentence |

### 8.3 Cross-activity

| ID | Criterion | Pass indicator |
| -- | --------- | -------------- |
| C1 | **Momentum** | Each activity after the first has bridge or preamble sentence referencing prior reasoning (not only title order) |
| C2 | **Escalation visible in prose** | Reader can paraphrase “what kind of thinking deepens” from A1→last without reading materials |

### 8.4 Voice profile

| ID | Criterion | Pass indicator |
| -- | --------- | -------------- |
| V1 | **Workshop** | Group references appear in task/materials; orientation stays learner-reasoning focused |
| V2 | **Self-study** | Orientation addresses sequence, effort, note-taking; no phantom classroom |

### 8.5 Anti-patterns (fail)

- Task-only activity openers with no orienting prose
- Facilitator timing on learner page
- Markdown specification strings in `expected_output` meant for authors
- Three-field repetition of the same orientation idea (overview / study_orientation / preamble)
- Preamble = scaffolding status only (“No model row…”)

---

## Cross-fixture scorecard (qualitative)

| Criterion cluster | Marx full | Marx thin | Inflation | Climate |
| ----------------- | --------- | --------- | --------- | ------- |
| P1 Entry narrative | Partial (knowledge_summary only) | Fail | Partial | Fail |
| A1 Preamble teaches | Fail–Partial | Fail | Fail (no preamble) | Fail |
| A4 Bridge narrative | Partial | Fail | Fail | N/A |
| C1 Momentum | Partial (materials > prose) | Fail | Fail | Fail |
| P4 No facilitator leakage | Pass | Pass | **Fail** | Pass |
| Authored materials depth | **Strong** | Weak | Moderate | Moderate |

---

## Recommended direction for Slice 42-2

### Focus: Design Page authorial exposition contract

**Rationale (from this audit):**

1. **Final learner experience is composed on Design Page** — overview, learning_purpose, study_tips, and activity wrapper prose are merged here from upstream.
2. **Preservation is settled** — `repairLearnerPageCompositionFromUpstream` and field lists must remain; Slice 42-2 adds **how to write**, not **what fields**.
3. **Materials depth already exists** in exemplars — compose should **signal relationship** between wrappers and materials (e.g. preamble teaches the move; materials practise it) without duplicating bodies.
4. **Workshop fixtures show wrapper gap most clearly** — inflation/climate need preamble/cognition **prose quality** when Sprint 41 fields appear on regeneration; Marx full needs **richer preamble/bridge content**, not new slots.

### Proposed Slice 42-2 deliverable (implementation — not in 42-1)

| Item | Description |
| ---- | ----------- |
| **Module** | `lib/ld-authorial-exposition.js` (or bounded extension to `ld-design-page-compose-contract.js`) |
| **Marker** | `LD-AUTHORIAL-EXPOSITION-CONTRACT (auto-applied)` on Design Page step only |
| **Prose-composition rules** | Section roles (P1–P2); preamble/bridge/task separation (A1–A5); redundancy bans; workshop vs self-study voice (V1–V2); facilitator leakage ban (P4) |
| **Integration guidance** | How to write preamble + cognition so they read as one orientation when rendered sequentially — without schema merge |
| **Wire-up** | `applyLdDesignPageComposeContractToDraft` or adjacent augmenter in `applyWorkflowStepRuntimePromptAugmentations` |
| **Tests** | Prompt presence; no regression on preservation tests; optional golden-string checks on compose instructions |

### Explicitly deferred to later slices

| Slice | Focus |
| ----- | ----- |
| **42-3** | DLA exposition — improve source text for preamble/cognition at origin |
| **42-4** | Before/after captures; optional exposition diagnostic CLI |

### Non-goals for 42-2

- Schema changes
- Renderer label or layout changes
- New EQF dimensions
- GAM materials body rewrite
- Weakening mandatory framing or preservation repair

---

## Audit conclusion

The benchmark fixtures confirm the Sprint 42 hypothesis: **educational architecture is stable; authorial quality is not.**

Pages read as **correct assemblies of educational components** — activities, purposes, tasks, materials, checks — rather than as **one author's guided path through an inquiry**. The strongest writing already lives inside **materials** (Marx full) and **outcome anchors** (Inflation purpose); Sprint 42 should raise **compose-level prose** to the same standard while keeping Sprint 40–41 structure intact.

**Slice 42-1 gate:** Success criteria §8 are approved for use in Slice 42-2 design. Proceed to Design Page authorial exposition contract implementation.

---

## References

- Sprint 42 handover: `../handover-from-sprint-41.md`
- Sprint 41 closure: `../../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md`
- Sprint 41 validation: `../../2026-06-11-sprint-41-educational-framework-integration/sprint-41-validation-report.md`
- 38C richness review (facilitator leakage): `../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md`
- Framing exemplar: `tests/fixtures/page-render/self-directed-activity-framing-page.json`
