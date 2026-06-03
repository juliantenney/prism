# Sprint 37 charter — Session framing and intellectual coherence

**Pack path:** `docs/development/sprints/2026-06-03-sprint-37-session-framing-intellectual-coherence/`  
**Status:** **CHARTERED** — slices 37-1–37-5 proposed, not yet executed  
**Date:** 2026-06-03  
**Test floor (entry):** **593 pass / 0 fail**

---

## 1. Rationale

Sprints 34–36 established **stable rendering**, **instructionally intentional activities**, and **visually choreographed** self-study pages.

Learners can still open a page that is **correct, well structured, and visually calm** yet reads like a **competent syllabus summary**: topic named, activities listed, assessment attached — without a felt **intellectual transformation** from opening to close.

Sprint 37 addresses **session-level rhetoric**: orientation, stakes, progression, synthesis, and transfer — **inside existing JSON shapes and prompt/domain levers**, not through new systems.

---

## 2. Core question

> Does the page guide the learner through a **coherent reasoning journey**, or only organise content about a topic?

Not: “Is the overview well written?”  
But: “Does the learner know **why this reasoning is hard**, **how the session builds**, and **what should be clearer** when they finish?”

---

## 3. Rhetorical principles

1. **Orientation before coverage** — Open with intellectual plan and stakes, not a table of contents disguised as prose.
2. **Honest difficulty** — Name conceptual tension and why-the-topic-is-hard without patronising or hype.
3. **Progression signalling** — Activities explicitly advance the arc (orient → challenge → integrate → judge → transfer).
4. **Epistemic closure** — Endings synthesise what should now be clearer, not only what was done.
5. **Transfer without fluff** — Durable understanding and application cues are concise and discipline-appropriate.
6. **Academic self-study tone** — No generic motivation, no reflective diary voice, no facilitator leakage.
7. **Field discipline** — Use existing page/section/activity fields (`purpose`, `study_orientation`, `reasoning_orientation`, `intellectual_coherence_bridge`, `study_tips`, section `content`, etc.) before inventing prose patterns.
8. **Contract respect** — Sprint 35 activity rhetoric and Sprint 36 visual semantics remain the floor.

---

## 4. In scope

- Observation-led rhetorical review (`observations/README.md` template)
- **Prompt shaping** — step-runner blocks, self-directed page compose, LD producer guidance
- **Domain pack copy** — `domains/learning-design/` and related packs where session framing is elicited
- Before/after notes on evaluation anchors (RNA old/new, climate, CI, Marx)
- Small **test additions** only when a rhetorical shape is stable enough to regression-lock (e.g. required opening fields, forbidden filler phrases)
- Cross-links to Sprint 35/36 observations where activity or visual work already succeeded

---

## 5. Out of scope

| Item | Reason |
|------|--------|
| New workflow steps | Charter constraint |
| Schema / PEC expansion | Charter constraint |
| Renderer / CSS changes | Default **no** — not a presentation sprint |
| Adaptive tutoring / branching | Charter constraint |
| Reflective diary or journaling engines | Charter constraint |
| Verbose motivational prose | Opposes concise academic tone |
| Generic “reflect on your learning” filler | Opposes epistemic closure quality bar |
| New artefact types | Charter constraint |
| Sprint 32 diagram pipeline | Separate programme |
| Reopening Sprint 36 visual programme | Separate completed programme |
| Re-litigating Sprint 35 activity-level copy unless session frame requires alignment | Minimise churn |

**Renderer/CSS exception:** Only if observation proves a **field cannot be expressed** in existing shapes and a one-line semantic hook is unavoidable — must be slice-documented and regression-green.

---

## 6. Success criteria

1. **Documented rhetorical review** per slice in `observations/` using the Sprint 37 template.
2. **Targeted prompt/domain changes** that improve openings and closings on evaluation anchors without bloating word count.
3. **0-fail test floor** on every slice that touches code or fixtures (`node --test tests/*.test.js`).
4. **No scope creep** into workflow, schema, renderer, visual design, or tutoring.
5. Learner-facing pages on anchors read as **guided reasoning journeys** on manual review (learning designer + self-study learner lens).
6. Explicit **rejected scope creep** recorded per slice.

**Preferred order:** observation first; prompt/domain edits second; code last and only when justified.

---

## 7. Proposed slices

| Slice | Title | Primary deliverable |
|-------|-------|---------------------|
| **37-1** | Session orientation rhetoric | Strong opening patterns; prompt/domain edits for page/section orientation |
| **37-2** | Conceptual tension / why-this-is-hard framing | Stakes and difficulty framing without misconception theatre |
| **37-3** | Intellectual progression signalling | Cross-activity bridges and sequence cues in existing fields |
| **37-4** | Synthesis and epistemic closure | `study_tips`, debrief, section endings that state what is clearer |
| **37-5** | Transfer, durable understanding, and final comparison review | Application and comparison review rhetoric on humanities/quant anchors |

Each slice should end with:

1. Observation markdown in `observations/`
2. Prompt/domain diff or excerpt documented
3. `node --test tests/*.test.js` → 0 fail (if code touched)
4. Rejected scope creep listed

---

## 8. Regression expectations

**Mandatory when code or fixtures change:**

```bash
node --test tests/*.test.js
```

**Targeted suites (when relevant):**

| Suite | When |
|-------|------|
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Session framing prompt blocks |
| `tests/utility-page-render.test.js` | Only if fixture shape changes (avoid unless necessary) |
| Domain-specific render tests (Marx, climate, RNA, CI) | Anchor pages touched |

**Floor:** Maintain **593+ pass / 0 fail** unless new tests are added with passing assertions.

Do **not** weaken Sprint 34 golden CI or Sprint 36 visual/affordance contracts to accommodate experimental copy.

---

## 9. Review lenses

Rotate these perspectives (one lead lens per slice is fine):

| Lens | Asks |
|------|------|
| **Learning designer** | Does the session arc match intended progression and prerequisite honesty? |
| **Academic author** | Is tone precise, non-fluffy, and discipline-appropriate? |
| **Self-study learner** | Can I orient in one sitting without a tutor — and know what “done” means intellectually? |
| **Assessment designer** | Do openings/closures align with what formative/summative items actually probe? |
| **Session reviewer** | Does the whole page feel like one journey, not a bundle of competent activities? |

---

## 10. Evaluation anchors

| Page | Path |
|------|------|
| RNA (enhanced) | Latest run HTML + `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| RNA (older / original) | `RNAOLD.html`, `RNAOriginal.html` (manual; store under `fixtures/` if needed) |
| Climate | `climate change.html` (probe) + `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| Confidence intervals | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |

**Known strengths to preserve:**

- **Climate:** intellectual progression (signal vs variability → mechanism → uncertainty → policy judgement).
- **RNA rerun:** stronger activity pedagogy than older HTML — improve intro/synthesis, not mid-session scaffolding.
- **CI golden:** quantitative honesty and template integration — session frame should not drown in notation.

---

## 11. Related packs

| Pack | Relevance |
|------|-----------|
| [Sprint 35 — pedagogical refinement](../2026-06-03-sprint-35-pedagogical-refinement/) | Activity-level rhetoric baseline |
| [Sprint 36 — visual pedagogy](../2026-06-03-sprint-36-session-design-visual-pedagogy/) | Visual rhythm; affordance hooks |
| [Sprint 34 — refinement forward plan](../2026-06-03-sprint-34-refinement-forward-plan/) | Renderer contract floor |
| Visual Enhancement Utility v1.1.1 patch note | Figure placement at affordance slots — not Sprint 37 scope |
