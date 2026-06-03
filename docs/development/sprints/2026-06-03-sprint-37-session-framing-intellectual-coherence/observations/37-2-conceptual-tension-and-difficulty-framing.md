# Slice 37-2 — Conceptual tension and difficulty framing

**Date:** 2026-06-03  
**Reviewer lens:** learning designer (lead); academic author; assessment designer  
**Anchors:** RNA/HCV fixture; climate fixture; CI golden; Marx self-study; Sprint 35 §6d; Sprint 37-1; Sprint 28 `uncertainty_tension_prompt` probes  
**Change type:** observation + prompt/domain + auto-applied runtime block

## Render / review method

| Anchor | Method |
|--------|--------|
| `ld-rna-hcv-assessment-page.json` | JSON — genome/HCV discrimination absent at page level |
| `ld-climate-misconception-discussion-page.json` | JSON + render test |
| `confidence-interval-a2-multitable-page.json` | JSON — tension in materials/support_note, not `uncertainty_tension_prompt` |
| `marx-self-study-page.json` | JSON — contrast in template/support_note |
| Sprint 28 capture | `probe-p28-01-post-5d.md`, `28-5d-stabilisation-capture.json` — legacy uncertainty tone |
| Sprint 37-1 | `37-1-session-orientation-rhetoric.md` — element (3) why-this-is-hard |

**Regression:** `node --test tests/*.test.js` after guidance changes.

---

## Executive summary

**Signalled well today (activity/materials layer):** Sprint 35 **misconception interruption** — CI golden and Marx fixtures use **Check your thinking**, **Use this when…**, and **conceptual_contrast** in templates to name **discriminating moves** (procedure vs interval; purpose vs plot summary).

**Flattened or missing:** Page-level **overview** still often omits **named tension**; `uncertainty_tension_prompt` when it appears in older probes reads like **reflective diary** (“reflect on uncertainties”), not disciplinary difficulty. RNA assessment fixture has **no tension surfaces** at all.

**37-2 fix:** Taxonomy of difficulty types + field placement rules + **Conceptual tension and difficulty framing (auto-applied)** block. Aligns with 37-1 element (3) without reopening renderer/schema/workflow.

---

## Difficulty taxonomy (for prompts)

| Type | What it is | Learner must learn to… | Example (honest framing) |
|------|------------|------------------------|---------------------------|
| **Conceptual difficulty** | Two ideas merged that must stay separate | Discriminate concepts | Positive-sense RNA is translatable; negative-sense is not — same word “RNA virus” hides different replication logic. |
| **Procedural difficulty** | Steps are learnable but order/guard matters | Apply the right procedure under constraints | Quoting interval **endpoints** for overlap, not midpoints; choosing **α** before comparing p-value. |
| **Interpretive ambiguity** | Two readings sound plausible until a move is applied | Choose interpretation using a stated rule | “95%” in a sentence may mean **this interval** or the **long-run method**. |
| **Disciplinary uncertainty** | Evidence or models have scope limits | Reason under uncertainty without treating it as failure | Sampling variation widens intervals; climate attribution mixes **signal**, **noise**, and **mechanism**. |
| **Competing explanations** | Rival mechanisms or policies | Judge using evidence rules | Sun-only vs greenhouse vs natural variability claims need **different evidence types**. |
| **Plausible misconception** | Intuitive story that fails a discriminating test | Repair with evidence + classification move | “Cold winter disproves warming” confuses **weather** with **climate trend**. |

**Do not conflate:** procedural slips (fixable with a step) vs conceptual merges (need contrast); uncertainty (epistemic) vs misconception (intuitive error).

---

## Current opening / closure (tension lens)

### RNA (`ld-rna-hcv-assessment-page.json`)

| Surface | Tension quality |
|---------|-----------------|
| `overview` | Fail — biology coverage only |
| Activities | Absent in fixture (assessment-only page) |
| `support_notes` | Procedural revision (“re-read summary”) — not discriminating tension |

**Needed:** overview names genome-sense / polymerase / HCV-host dependency as **conceptual merges** learners confuse.

### Climate (`ld-climate-misconception-discussion-page.json`)

| Surface | Tension quality |
|---------|-----------------|
| `overview` | Partial — “misconceptions” label without **weather vs climate** or **evidence vs persuasion** |
| Materials | **Strong** — cards + analysis template imply **classification under evidence** |
| `uncertainty_tension_prompt` | Absent in fixture |

**Needed:** overview one-liner: intuitive claims vs **discriminating evidence**; arc ties to card → template → discussion.

### CI golden

| Surface | Tension quality |
|---------|-----------------|
| `overview` | Fail for tension — notation default |
| `knowledge_summary` | **Good** — previews procedure vs interval judgement |
| A1–A4 | **Strong** — interpretive ambiguity + procedural guards |
| `study_tips` | Names common slip (procedure vs interval) |
| `uncertainty_tension_prompt` | Absent — tension carried by `support_note` + template (acceptable pattern) |

**Exemplar sentence (interpretive ambiguity):** *If both interpretations sound plausible, ask whether the claim is about this one interval or the long-run method.*

### Marx self-study

| Surface | Tension quality |
|---------|-----------------|
| Page entry | No overview tension (37-1 gap) |
| A3 template | **Good conceptual difficulty** — purpose vs plot summary |
| `support_note` | **Good** — Check your thinking on comparison moves |
| `uncertainty_tension_prompt` | Absent |

---

## Intellectual stakes

Tension framing should answer: **what breaks if the learner does not discriminate?**

| Anchor | Stakes named? |
|--------|----------------|
| CI | Partial — wrong interval interpretation misstates evidence strength |
| Marx | Partial — comparison collapses to plot summary |
| Climate | Partial in materials; weak at overview |
| RNA | No |

---

## Conceptual tension (37-2 focus)

### Good patterns (keep and require)

1. **Named distinction + discriminating move** (CI template self-check; Marx “Use this when…”).
2. **Check your thinking:** links wrong surface answer to **wrong concept** (35-3) — reactive, mid-activity.
3. **conceptual_contrast_prompt** naming two concepts + one merge error (DLA contract).
4. **knowledge_summary** one-line preview of the procedure–meaning link (CI).
5. **37-1 overview element (3)** — one honest tension at page entry (prompt now enforced).

### Failed patterns (reject)

| Pattern | Example | Why it fails |
|---------|---------|--------------|
| Coverage prose | “Discuss and evaluate misconceptions” | No named merge or move |
| Motivational difficulty | “This challenging topic…” | No discrimination task |
| Generic struggle | “Students often struggle with…” | Not discipline-specific |
| Misconception theatre | Long myth lists without repair column | Activity menu, not reasoning |
| Diary uncertainty | “Reflect on uncertainties you encountered…” (Sprint 28 probes) | Reflective, not discriminating |
| Patronising reassurance | “Don’t worry if this seems hard” | Undermines honest framing |
| Duplicate tension | Same paragraph in overview + `uncertainty_tension_prompt` + `support_note` | Cognitive noise |

### Honest difficulty framing examples (target prose shapes)

**Interpretive ambiguity (statistics):**  
*Confidence statements are easy to misread: the same “95%” can describe a long-run method or sound like a probability about one interval. This session trains you to label which meaning a sentence uses before you judge Correct?.*

**Conceptual difficulty (virology):**  
*Genome polarity and virion polymerase requirements are often merged into one “RNA virus” label. You will separate which genomes can be translated directly and which require polymerase in the virion.*

**Plausible misconception (climate):**  
*Persuasive climate claims often mix weather events with long-term trend evidence. You will classify claims using data type, not rhetorical plausibility.*

**Conceptual difficulty (humanities):**  
*Comparing Marx’s works fails when purpose is treated as plot summary. You will state each author’s aim before you name a defensible difference.*

**Disciplinary uncertainty (climate/evidence):**  
*Evidence strength differs by claim type (mechanism, attribution, policy trade-off). Uncertainty here means weighing incomplete evidence — not abandoning judgement.*

---

## Progression signalling

Tension should **match the arc** (37-1 element 5):

| Page | Arc | Tension should track |
|------|-----|----------------------|
| CI | Model → fade → transfer | Procedure-vs-interval move across tables and scenario |
| Climate | Cards → template → discussion | Persuasion → evidence → classification |
| Marx | Model row → table → scenario | Purpose/difference → application |
| RNA | (to be designed) | Genome class → HCV mechanism → misconception repair |

---

## Synthesis / transfer (37-2 boundary)

37-2 does **not** own epistemic closure (37-4). `study_tips` may **name** the common slip (CI already does) — do not expand into diary reflection.

---

## Verbosity risk

| Risk | Mitigation in guidance |
|------|------------------------|
| Misconception theatre | Require discriminating move per myth/card, not lists alone |
| Duplicate tension | overview once; `uncertainty_tension_prompt` only if different facet |
| Reflective uncertainty | Ban “reflect on uncertainties” without a task-linked discriminating question |

---

## Field placement map

| Field | Role | 37-2 rule |
|-------|------|-----------|
| `overview` / `learning_purpose` | Primary tension (1 sentence + type) | Required when page involves interpretation, comparison, misconception, or evidence judgement |
| `uncertainty_tension_prompt` | Optional 1–2 activities — ambiguity or evidence limits | One sentence: what is unstable + what move resolves; **not** diary |
| `conceptual_contrast_prompt` | Activity-level concept pair + merge error | Pairs with reasoning contract |
| `reasoning_orientation` | Thinking mode | Not a substitute for naming the tension |
| `support_note` / `prompt_set` (35-3) | Reactive slip guard | Do not repeat overview tension verbatim |
| `materials` task_cards | Misconception pressure | Claim text + template columns for repair |

---

## Before / after judgement

| Anchor | Before | After (37-2 target) |
|--------|--------|---------------------|
| CI overview | Notation-first | One interpretive-ambiguity sentence; body unchanged |
| Climate overview | Task inventory | Names weather/climate or evidence-vs-persuasion tension |
| Marx | Tension only in A3+ | overview or `learning_purpose` names purpose-vs-summary |
| RNA | None | overview names primary genome/HCV discrimination |
| Sprint 28-style `uncertainty_tension_prompt` | Reflective | Discriminating, task-linked |

---

## Proposed changes (implemented)

| Layer | Path |
|-------|------|
| Domain | `domain-learning-design-prompt-rules.md` — §6h |
| Design Page notes | `domain-learning-design-step-patterns.md` — `defaultPromptNotes` clause |
| Runtime | `app.js` — `buildSelfDirectedConceptualTensionDifficultyPromptBlock()`; cross-ref in embedded-feedback block; `uncertainty_tension_prompt` hint in DLA output contract |
| Tests | `workflow-self-directed-activity-framing-adoption.test.js` |
| Probe | `fixtures/probe-37-2-difficulty-types.md` |

**Why `app.js`:** Same enforcement path as 37-1 and Sprint 35; domain §6h alone is insufficient for step prompts.

---

## Rejected scope creep

- Renderer / CSS / schema / workflow steps  
- New fields beyond existing PEC (`uncertainty_tension_prompt`, etc.)  
- Adaptive tutoring, branching remediation, journaling  
- Long myth anthologies without repair moves  
- Replacing Sprint 35 Check your thinking patterns  
- Reopening 37-1 five-element contract (only deepens element 3)  
- Verbose “misconception theatre” or hype  

---

## Regression

```bash
node --test tests/*.test.js
```

**Target:** 593+ pass / 0 fail.

---

## Review lenses

| Lens | Verdict |
|------|---------|
| Learning designer | Tension type must match activity design |
| Academic author | Precise distinctions; no struggle filler |
| Self-study learner | Know what mistake to watch for before working |
| Assessment designer | Tension foreshadows what items discriminate |
| Session reviewer | CI materials = gold; overviews = primary gap |

---

## Forward (37-3+)

- **37-3:** Progression signalling across activities (`intellectual_coherence_bridge` density and overview arc alignment)  
- **37-4:** Synthesis — what should be clearer (build on CI `study_tips` pattern)
