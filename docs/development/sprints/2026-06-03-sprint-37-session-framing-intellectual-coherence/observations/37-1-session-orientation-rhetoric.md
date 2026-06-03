# Slice 37-1 — Session orientation rhetoric

**Date:** 2026-06-03  
**Reviewer lens:** learning designer (lead); academic author; self-study learner  
**Anchors:** RNA/HCV fixture + live probes; climate fixture; CI golden; Marx self-study; Marx live page (positive exemplar)  
**Change type:** observation + prompt/domain + auto-applied runtime block (Sprint 35 pattern)

## Render / review method

| Anchor | Source | Method |
|--------|--------|--------|
| RNA enhanced | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | JSON section review; `tests/utility-ld-rna-assessment-page-render.test.js` |
| RNA live (strong activities, weak page entry) | `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/probe-p30-02-rna-live.md` | Probe rubric + orientation field counts |
| RNA baselines | `RNAOLD.html`, `RNAOriginal.html` | **Not in repo** — referenced in charter; compared via probe narrative vs current fixture |
| Climate | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | JSON + `tests/utility-ld-climate-misconception-page-render.test.js` |
| Climate live | `climate change.html` | **Not in repo** — progression model cited from Sprint 36/37 handover |
| CI golden | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | JSON (strong activity arc; thin overview) |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | JSON (no overview; strong activity + study_tips) |
| Marx positive opening | `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json` | “Introduction and Study Orientation” section |

**Regression:** `node --test tests/*.test.js` after guidance changes.

---

## Executive summary

Sprint 35–36 made **within-activity** and **visual** quality strong. **Page-level openings** still often read as **topic coverage** or **task inventory**, not as a **coherent intellectual journey**.

**Strong opening pattern (Marx live page):** One section names the journey, stakes, progression, time, and mode of inquiry — then activities deepen without repeating the whole welcome.

**Weak opening pattern (RNA fixture, climate fixture):** `overview.content` states what the page is *about* without why the reasoning is hard, what will change in the learner’s thinking, or how activities build.

**Guidance fix (37-1):** Add §6g domain rules and a **Session orientation rhetoric (auto-applied)** block on self-directed DLA / Design Page / GAM / assessment producer steps (same adoption path as Sprint 35 §6b–6f). **No renderer, schema, workflow, or CSS changes.**

---

## Current opening / closure (by anchor)

### RNA (`ld-rna-hcv-assessment-page.json`)

**Opening:**

```text
overview: "Self-study page on RNA viruses with emphasis on hepatitis C virus (HCV) biology."
```

**Closure:** `support_notes` — revision mechanics (“re-read knowledge summary”, “note one misconception”) — procedural, not epistemic synthesis.

| Element | Present? |
|---------|----------|
| Topic | Partial (names topic) |
| Stakes | Fail |
| Why hard | Fail |
| Intellectual work | Fail |
| Progression | Fail |
| `study_orientation` | Absent on page |

**Live RNA probe (P30-02):** Activities gained `activity_preamble` and reasoning fields; **composed `study_orientation` empty**; rubric “sequentially connected: No”. Mid-session quality >> page entry.

### Climate (`ld-climate-misconception-discussion-page.json`)

**Opening:**

```text
overview: "Discuss and evaluate common climate change misconceptions using structured materials and a short formative check."
```

Reads as **activity menu**, not journey. Activity-level `purpose` / materials carry the real intellectual arc (signal → evidence → classification → discussion) — **not signalled at page entry**.

| Element | Present? |
|---------|----------|
| Topic | Partial |
| Stakes | Partial (misconceptions implied, not named) |
| Why hard | Fail at page level |
| Intellectual work | Partial (in activity task) |
| Progression | Fail at page level |

**Positive model (handover):** Live climate progression is the **target arc** to name in overview/`learning_purpose` (variability vs signal → mechanism → uncertainty → judgement).

### CI golden (`confidence-interval-a2-multitable-page.json`)

**Opening:**

```text
overview: "Apply confidence interval ideas to interpretation tasks. Use α = 0.05 …"
```

**Strong:** A1→A2→A4 arc, bridges, `study_tips` with closure bullets. **Weak at entry:** overview jumps to notation default, not **why interval interpretation is easy to get wrong** or **model → faded → transfer** plan.

| Element | Present? |
|---------|----------|
| Topic | Yes |
| Stakes | Partial (misconception in study_tips, not opening) |
| Why hard | Fail at overview |
| Intellectual work | Partial (in activities) |
| Progression | Partial (visible only after first activity) |

### Marx self-study (`marx-self-study-page.json`)

**Opening:** No `overview` / `learning_purpose` — starts at `knowledge_summary`. **First activity** has no `study_orientation` in fixture (framing begins at A2 modelled row).

**Closure:** `study_tips` — judgement/transfer bullets (Sprint 35 quality).

| Element | Present? |
|---------|----------|
| Topic | In title + knowledge_summary |
| Stakes | Partial |
| Why hard | Fail at page level |
| Intellectual work | In activities |
| Progression | Partial (bridges inside activities) |

### Marx live (`marx-page.json`) — exemplar

**Opening section** (~4–7 sentences): topic, biographical→theoretical arc, **named progression**, **~2 hours**, **intellectual frame** (historian mode). This is the **bar** for self-directed session orientation.

---

## Intellectual stakes

| Anchor | Stakes signalled? | Gap |
|--------|-------------------|-----|
| RNA | Low | Why misclassifying genome sense / HCV mechanism matters for interpretation not stated at entry |
| Climate | Medium in materials | Why persuasive misconceptions block evidence-based judgement not in overview |
| CI | Medium in activities | Procedure-vs-interval confusion — stakes belong in overview, not only study_tips |
| Marx fixture | Medium in tasks | Page lacks marx-page-style journey paragraph |
| Marx live | High | Exemplar |

---

## Conceptual tension

| Anchor | Why-this-is-hard at opening? |
|--------|------------------------------|
| RNA | No (e.g. positive/negative sense, segmented genomes, HCV host dependency) |
| Climate | No (weather vs climate; attribution) |
| CI | No (frequentist interpretation slip named later in tips) |
| Marx live | Implicit via “biography shapes theory” |

**Principle:** One honest, discipline-specific tension in overview or `learning_purpose` — not drama, not “this is challenging!” filler.

---

## Progression signalling

| Anchor | Cross-activity arc named at page top? |
|--------|--------------------------------------|
| RNA fixture | No |
| Climate | No (arc exists in activity design) |
| CI golden | No (A1 model → A2 fade → A4 transfer only inside activities) |
| Marx fixture | No |
| Marx live | **Yes** |

**Principle:** Overview or `learning_purpose` includes **one sentence** naming the build (e.g. model → practise → transfer; or misconception → evidence → judgement).

---

## Synthesis strength (opening slice — closure out of scope)

Openings do not preview **what should be clearer** by the end. Closure quality (37-4) is separate; CI/Marx `study_tips` already partial.

---

## Transfer quality

Not primary for 37-1. CI/Marx transfer cues appear in final activities / tips, not in openings.

---

## Verbosity risk

| Risk | Seen in anchors? |
|------|------------------|
| Motivational fluff | Low |
| Generic reflection | Low in openings (more in tips) |
| Coverage sentences | **High** — “Self-study page on…”, “Discuss and evaluate…” |
| Duplicate welcome | Marx live risks overlap overview + `study_orientation` if both repeat same paragraph |

**Guard:** `study_orientation` = **working guidance** (sequence, time, effort); overview/`learning_purpose` = **journey contract** — do not paste the same prose twice.

---

## What makes a strong opening (self-directed PRISM learner page)

Use **existing sections/fields** only:

| # | Element | Where | Learner question answered |
|---|---------|-------|---------------------------|
| 1 | **Topic & focus** | `overview` and/or `learning_purpose` | What reasoning domain is this? |
| 2 | **Stakes** | Same | Why does getting this wrong matter? |
| 3 | **Why-this-is-hard** | Same (one tension) | What confusion is the session designed to repair? |
| 4 | **Intellectual work** | Same | What will I *do* (compare, judge, trace, apply)? |
| 5 | **Progression** | Same | How do activities build? |
| 6 | **Mode of inquiry** | `intellectual_frame` once (optional) | What kind of thinking is this? |
| 7 | **Working plan** | `study_orientation` on first activity (2+ activities) | How long / in what order should I work? |

**Anti-patterns (forbid in prompts):**

- “This page covers…” / “This session will explore…” without stakes or arc  
- “Welcome to this module” / “In this session we will…”  
- Overview that lists components (cards, template, check) without intellectual sequence  
- `study_orientation` that repeats the entire overview paragraph  

**Positive template (prose shape, not literal boilerplate):**

> This self-study session examines [topic] by [intellectual moves]. The reasoning is easy to misjudge when [tension]. You will [activity arc in brief]. Allow about [time] if timings exist. [Optional: Thinking as a …]

---

## Before / after judgement

| Anchor | Before (37-1) | After (expected from guidance) |
|--------|---------------|--------------------------------|
| RNA fixture | Coverage overview | Overview names genome-classification + HCV mechanism journey + formative check role |
| Climate fixture | Task inventory overview | Overview names misconception → evidence → classification arc |
| CI golden | Notation-first overview | Overview names interpretation slip + model→fade→transfer |
| Marx fixture | No overview | overview or learning_purpose with journey paragraph (may promote fixture in later slice) |

**Keep:** Sprint 35 activity rhetoric, Sprint 36 visual contracts, CI golden render tests.

**Reject:** New sections, schema fields, renderer hooks, reflective diary voice.

---

## Proposed changes (implemented in 37-1)

| Layer | Path | Change |
|-------|------|--------|
| Domain rules | `domains/learning-design/domain-learning-design-prompt-rules.md` | §6g Session orientation rhetoric |
| Design Page notes | `domains/learning-design/domain-learning-design-step-patterns.md` | `defaultPromptNotes` clause for overview/`learning_purpose` journey |
| Runtime (unavoidable) | `app.js` | `buildSelfDirectedSessionOrientationRhetoricPromptBlock()` + adoption in `applySelfDirectedLearnerPageStepScaffoldsToDraft`; tighten `study_orientation` in DLA output contract and PEL orientation block |
| Tests | `tests/workflow-self-directed-activity-framing-adoption.test.js` | Assert session-orientation block on DLA + Design Page |
| Fixture notes | `fixtures/probe-37-1-opening-anchor-notes.md` | Anchor table (non-CI) |

**Why `app.js`:** Sprint 35 established that domain §6x rules alone do not reach step prompts; auto-applied blocks on `applySelfDirectedLearnerPageStepScaffoldsToDraft` are the enforced delivery path (see `tests/workflow-self-directed-activity-framing-adoption.test.js`).

---

## Rejected scope creep

- Renderer / CSS / affordance placement  
- New `sections[]` ids or PEC ids  
- Workflow topology or new steps  
- `learning_purpose` schema shape change (object vs string — use existing shapes)  
- Verbose motivational or generic reflection openings  
- Reopening Sprint 36 visual programme  

---

## Regression

```bash
node --test tests/*.test.js
```

**Target:** 593+ pass / 0 fail (no fixture weakening).

---

## Review lenses (summary)

| Lens | Verdict |
|------|---------|
| Learning designer | Openings must state arc and stakes before materials |
| Academic author | Concise journey prose; no syllabus tone |
| Self-study learner | Can orient without tutor when overview + first `study_orientation` differ correctly |
| Assessment designer | Opening should foreshadow what formative items probe |
| Session reviewer | Marx live page = reference; fixtures = gap list for 37-1 guidance |

---

## Forward (37-2+)

- **37-2:** Expand `uncertainty_tension_prompt` / overview tension without duplicating 37-1  
- **37-4:** Epistemic synthesis in `study_tips` / section closings (CI/Marx already partial)  
- Optional: promote Marx/CI overview exemplar lines into `tests/fixtures/page-render/` when stable
