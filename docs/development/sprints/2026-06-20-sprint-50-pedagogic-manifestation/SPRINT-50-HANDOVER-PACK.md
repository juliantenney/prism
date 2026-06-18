# Sprint 50 Handover Pack

**Date:** 2026-06-20  
**Type:** Continuation handover — orientation for fresh chat, not implementation plan  
**Audience:** Agent or human resuming Sprint 50 at **pedagogic manifestation** frontier  
**Supersedes for new chats:** Sprint 49 startup docs for *generation/contract* work — use **this pack** for Sprint 50 entry

---

## Read This First

Sprint 49 is **closed** (**Complete with follow-on work**). Do **not** reopen:

- SP-01 / D-49-01 cognition reconciliation
- DLA Framing Gate v1 design
- LD-COGNITION-ORIENTATION / preamble module authoring
- OUTPUT CONTRACT or schema salience expansion

**Start from:** How pedagogy **manifests** to the learner given that generation and preservation now work on the Marx corpus.

**Primary evidence folder:**

[`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/)

---

## What Sprint 49 Proved

| Capability | Evidence | Confidence |
| ---------- | -------- | ---------- |
| DLA emits `activity_preamble` on all activities | `learning_activities.json` — 5/5 | **Proven** |
| DLA emits ≥1 cognition-orientation field per activity | `reasoning_orientation` all; `self_explanation_prompt` on A1 | **Proven** |
| GAM `text` materials: substantive connective exposition | `activity_materials.md` | **Proven** |
| FM-07: no cognition cues inside `text` bodies | `activity_materials.md` | **Proven** |
| GAM material bodies preserved in page JSON | `page.json` → `materials.*` | **Proven** |
| Renderer surfaces preamble + cognition blocks | `page.html` — `util-activity-preamble`, `util-cognition`, `journey-compass` | **Proven** |
| Bad procedural DLA blocked by framing gate | Test fixture + gate implementation | **Proven** |
| D-49-01 + SP-01–SP-06 runtime stable | Regression test suites | **High** |

**Closure authority:** [`../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-CLOSURE-REPORT.md`](../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-CLOSURE-REPORT.md)

---

## What Remains Uncertain

| Question | Why it matters | Starting evidence |
| -------- | -------------- | ----------------- |
| **Page JSON PEL echo** | Is `page.json` authoritative for PEL, or does render-time merge mask compose gaps? | Run2: HTML has preamble/cognition; `page.json` activity rows may omit some PEL keys |
| **Manifestation quality** | Fields present ≠ learner experience salient | Subjective audit of `page.html` reading flow |
| **Journey Compass utility** | Signposting vs noise | `journey-compass` in HTML; Sprint 43 prototype comparison |
| **Cognition field quality** | Presence gate ≠ archetype match | Only `reasoning_orientation` on 4/5 activities in run2 |
| **Two-column layout** | Sprint 43 direction not fully implemented | 43-05 handover pack |
| **Tier 2 advisory warnings** | Quality/salience hints at capture — deferred | Sprint 49 closure §4 |

**Settled diagnosis (carry forward from Sprints 42–43, confirmed by Sprint 49):**

> Educational structures survive end-to-end. The remaining gap is **manifestation / salience / learner experience** — not absence of structure and not generation quality.

---

## Why `marx-run-artefacts-run2` Matters

This folder is the **primary Sprint 50 planning corpus**. It captures a full Marx self-directed learner-page run **after** Sprint 49 fixes — the first end-to-end evidence that generation and preservation work together.

Use it to audit **manifestation** without re-running the workflow on day one.

### Artefact inventory

| File | Role in investigation |
| ---- | --------------------- |
| `learning_activities.json` | **DLA output** — ground truth for PEL fields (`activity_preamble`, cognition-orientation) |
| `activity_materials.md` | **GAM output** — connective exposition, worked examples, checklists |
| `page.json` | **Design Page compose** — what the page model actually stores |
| `page.html` | **Rendered learner experience** — DOM order, CSS classes, visual hierarchy |
| `learning_outcomes.json` | Upstream LO context |
| `learning_sequence.json` | Sequence / episode structure |
| `learnng_content.json` | LC input (note: filename typo preserved) |
| `episode_plans.json` | Episode plan upstream |
| `knowlege_model.json` | Knowledge model upstream (note: filename typo preserved) |

### Investigation workflow (recommended)

1. Open `learning_activities.json` — note PEL per activity (A1–A5).
2. Open `activity_materials.md` — confirm exposition depth per activity.
3. Open `page.json` — check which PEL keys appear on each `learning_activities` row vs only in materials.
4. Open `page.html` in browser — walk reading order; note framing block salience vs task/material dominance.
5. Document gaps → charter investigation areas → only then design slices.

### Artefact gaps (see Report section)

The folder does **not** currently include exported **DLA prompt**, **GAM prompt**, **Design Page prompt**, or a formal **observations log**. Closure narrative references those; capture them on next Marx refresh if prompt-vs-output tracing is needed.

---

## Major Decisions (carry forward — do not reopen)

| ID | Decision | Status |
| -- | -------- | ------ |
| **D-50-01** | Pedagogic manifestation before architecture expansion | **Accepted** |
| **D-49-01** | GAM `text` exposition-only; cognition cues on non-text materials | **Accepted** |
| **DLA Framing Gate v1** | `meetsMandatoryFraming` blocks Next; no auto-repair | **Accepted** |
| **DLA cognition compliance** | `LD-COGNITION-ORIENTATION` module + schema — not OUTPUT CONTRACT | **Accepted** |
| **C3b** | Self-directed rhetoric wrapper-only on Design Page | **Accepted** |
| **D-49-02** | FM-08 as blocking MUST in SP-01 | **Open** — optional GOOD only |

Full Sprint 49 log: [`../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-DECISION-LOG.md`](../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-DECISION-LOG.md)

---

## Key Implementation Files

| Concern | Location |
| ------- | -------- |
| Page render / PEL blocks | `app.js` — `util-activity-preamble`, `util-cognition`, framing assembly (~30500+, ~35440+) |
| Journey Compass render | `app.js` — `util-journey-compass`, `journeyCompassEnabled` (~33168+, ~35514+) |
| Design Page compose / merge | `app.js` — learner-page compose helpers (search: `mergeLearnerPage`, `designPage`, `page.json`) |
| LD cognition orientation (frozen) | `lib/ld-cognition-orientation.js` |
| Activity preamble (frozen) | `lib/ld-activity-preamble-exposition.js` |
| SP-01 patterns (frozen) | `lib/instructional-pattern-prompt.js` |
| GAM output / gate (frozen) | `lib/gam-output-format.js` |
| DLA framing gate (frozen) | `app.js` — `evaluateLearnerPageDlaActivityFramingCoverage`, Next handler |
| Renderer tests | `tests/utility-page-render.test.js`, `tests/utility-renderer-cognition-fields.test.js`, `tests/utility-self-directed-activity-framing.test.js` |
| Marx design quality | `tests/utility-marx-self-study-design-quality.test.js` |

---

## Known Constraints

1. **Human-mediated workflow** — PRISM augments prompts and validates captures; does not autonomously run Marx.
2. **Scope: self-directed learner-page** — facilitator briefs excluded from gates/scaffolds.
3. **No prompt growth** — manifestation fixes should prefer compose + renderer + fidelity paths.
4. **Gates are frozen** — do not add blocking validators without explicit charter amendment.
5. **Sprint 43 ownership model** — Investigation-primary, Resource-secondary; activities/materials supporting (43-02, 43-05).
6. **Regression suites** — Sprint 48–49 test files must stay green after any Sprint 50 slice.

---

## Authority References

| Topic | Path |
| ----- | ---- |
| Sprint 50 charter | [`SPRINT-50-CHARTER.md`](SPRINT-50-CHARTER.md) |
| Sprint 50 context (fresh chat) | [`SPRINT-50-CONTEXT.md`](SPRINT-50-CONTEXT.md) |
| Sprint 49 closure | [`../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-CLOSURE-REPORT.md`](../2026-06-19-sprint-49-sp-01-text-pattern/SPRINT-49-CLOSURE-REPORT.md) |
| Journey Compass direction | [`../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md`](../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md) |
| Design Page provenance | [`../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md`](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md) |

---

*Handover pack v1 — orientation only.*
