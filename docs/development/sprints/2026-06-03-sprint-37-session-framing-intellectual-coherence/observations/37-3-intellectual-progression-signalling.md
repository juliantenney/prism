# Slice 37-3 — Intellectual progression signalling

**Date:** 2026-06-03  
**Reviewer lens:** learning designer (lead); session reviewer; self-study learner  
**Anchors:** climate, RNA/HCV, CI golden, Marx self-study; Sprint 37-1/37-2; Sprint 35 fading/closure; PEL orientation contract  
**Change type:** observation + prompt/domain + auto-applied runtime block

## Render / review method

| Anchor | Progression surfaces reviewed |
|--------|------------------------------|
| `confidence-interval-a2-multitable-page.json` | A1→A2→A4 bridges; `knowledge_summary` preview; assessment Q1; `study_tips` |
| `marx-self-study-page.json` | `use_in_activities`; A2→A3→A4 bridges; materials closure |
| `ld-climate-misconception-discussion-page.json` | Single activity; materials order; assessment T/F |
| `ld-rna-hcv-assessment-page.json` | Assessment-only; item theme sequence |
| Sprint 37-1 / 37-2 | Elements (5) arc + tension evolution |
| `app.js` | `intellectual_coherence_bridge` render as “Connection to previous activity” |

**Regression:** `node --test tests/*.test.js` after guidance changes.

---

## Executive summary

**Strong today:** CI and Marx fixtures show **cumulative arcs** via `intellectual_coherence_bridge` sentences that name **carried moves** (procedure-vs-interval; purpose-and-difference) and **escalation** (less scaffolding, new context). Sprint 35 **model → fade → transfer** sequencing aligns with bridges.

**Weak today:** **Overviews** rarely state the arc; climate **single-activity** page reads as a **materials bundle** without named within-session progression; RNA assessment page is **item list** without diagnostic arc; bridges sometimes **only structural** (“building on previous”) in live outputs (guarded in 37-3 prompts).

**37-3 fix:** Progression phase vocabulary + bridge/preamble/overview rules + **Intellectual progression signalling (auto-applied)** block. Ties 37-2 tensions to **tools that sharpen** across activities.

---

## Session phase map (signalling vocabulary)

| Phase | Learner work | Typical activity shape | Bridge should name… |
|-------|--------------|------------------------|---------------------|
| **Orienting** | Frame stakes, activate prior ideas | Preamble, first model row | What distinction or move enters |
| **Distinguishing** | Separate concepts that merge | Contrast prompts, cards, first table | The named move from orienting |
| **Testing** | Apply move with partial scaffolding | Faded template, checklist rows | What is now tested without full model |
| **Integrating** | Combine earlier ideas | Multi-column tables, mechanism + evidence | Which earlier tools combine |
| **Judging** | Defensible verdict under criteria | Scenario debrief, formative with justification | Higher evidence standard |
| **Transferring** | New context, fewer cues | Independent scenario, application task | What carries forward and what is new |

Not every page needs six activities — phases may **compress** (CI: orient+model → test → judge+transfer in three activities).

---

## Anchor progression evaluation

### CI golden — **strong (activity layer)**

| Stage | Activity | Progression signal |
|-------|----------|-------------------|
| Orient + model | A1 | Worked example names **move** |
| Test (fade) | A2 | Bridge: *Apply procedure-vs-probability move…*; preamble: modelled first row |
| Judge + transfer | A4 | Bridge: *compare without worked row*; overlap judgement |
| Section | `knowledge_summary` | **In activities:** previews judgement + endpoints |
| Gap | `overview` | No arc sentence (37-1/37-3) |
| Assessment | Q1 | Escalates to practical vs statistical significance |
| Closure | `study_tips` | Names slip + transfer — aligns with arc (37-4 partial) |

**Target overview line (illustrative):** *You will model one interpretation move, practise labelling claims, then judge interval overlap in a new scenario.*

### Marx self-study — **strong (bridges + summary)**

| Stage | Activity | Signal |
|-------|----------|--------|
| Model | A2 | Worked comparison row |
| Integrate | A3 | Bridge: *Reuse purpose-and-difference move…* |
| Transfer + judge | A4 | Bridge: *Move from comparing texts to applying concepts…* |
| Preview | `knowledge_summary.use_in_activities` | Maps concepts → comparison → scenario |
| Gap | No `overview` | Arc not at page entry |

### Climate fixture — **sequential materials, weak arc signalling**

| Order | Material block | Intellectual role (implicit) |
|-------|----------------|------------------------------|
| 1 | Task cards | Distinguish plausible claims |
| 2 | Analysis template | Test/classify with evidence |
| 3 | Discussion prompts | Judge + explain to peers |
| 4 | Checklist | Integrate completion criteria |

**Task island risk:** `learner_task` lists components without **encounter → classify → discuss** arc. **Overview** does not name signal/variability → mechanism → uncertainty → policy judgement (handover model for live climate).

**37-3 for single-activity pages:** Overview + `purpose` + ordered `learner_task` must name **within-activity progression**.

### RNA assessment fixture — **weak progression**

- One section of MCQ items — **sequential but not cumulative** in prose.
- No bridges (single implicit “activity”).
- **Target:** overview names diagnostic arc (genome class → HCV mechanism → replication → compare virus families) and how items escalate.

---

## Strong progression patterns (keep)

1. **Bridge names a move, not a location:** *Apply the procedure-vs-probability move from the worked example to new statements.*
2. **Bridge states escalation:** *You now compare two intervals without a worked row; still quote endpoints…*
3. **Preamble states activity contribution:** *The first row is modelled; complete remaining cells using the same reasoning move.*
4. **`knowledge_summary` / `use_in_activities`:** One line mapping ideas → activity roles.
5. **37-1 element (5) in overview:** Named build (when present after 37-3 guidance).
6. **Fading sequence (35-2):** Model → fade → transfer matches phase shift.
7. **Formative check foreshadows judgement standard** (CI Q1).

---

## Weak “task island” patterns (reject)

| Pattern | Example | Fix |
|---------|---------|-----|
| Component inventory task | “Work through cards, template, and prompts” | Name arc: encounter → classify → discuss |
| Title-only bridge | “Building on the previous activity…” | Name move + escalation |
| Facilitator transition | “Now you will compare…” | Intellectual carry-forward sentence |
| Structural “next” | “In the next section…” | Phase + contribution |
| Repeated preamble | Same welcome every activity | Vary contribution sentence |
| Overview without arc | “Apply confidence interval ideas…” | Model → practise → judge sentence |
| Assessment bolt-on | Items unrelated to activity moves | Align item style to final phase |

---

## Effective bridge sentence structures

**Carry move + apply:**  
*Apply the [move] from [prior activity/material] to [new artefact].*

**Escalate scaffolding:**  
*You now [harder task] without [removed scaffold]; still [non-negotiable discipline rule].*

**Shift evidence standard:**  
*Use the classification you practised on cards when you complete the template for one focal claim.*

**Shift mode (compare → apply):**  
*Move from comparing texts to applying [concepts] to a new scenario.*

**Tension evolution (37-2):**  
*The procedure-vs-interval distinction you labelled in the table now governs whether overlap supports a strong conclusion.*

---

## Failed transition rhetoric

- “In this activity you will…”
- “Next, we will explore…”
- “Continue to the next task”
- “Building on Activity 2” (title only)
- “This section contains…”
- Long paragraph bridges (>2 sentences)

---

## Field evaluation (37-3)

| Field | Current use | 37-3 expectation |
|-------|-------------|------------------|
| `overview` / `learning_purpose` | Often coverage | One **arc sentence** (37-1 §5) + optional phase labels |
| `intellectual_coherence_bridge` | Strong on CI/Marx; missing in probes | Every follow-on activity when 2+; names move + escalation |
| `activity_preamble` | Strong on CI | Activity **contribution** to arc; not duplicate of bridge |
| `purpose` | Sometimes duplicates task | Stage label: model / practise / transfer / repair |
| `knowledge_summary` | CI/Marx preview good | `use_in_activities` maps ideas → phases |
| `study_orientation` | Working plan (37-1) | May list activity order — not full arc essay |
| `assessment_check` | CI aligns | Foreshadow judgement phase |
| Materials order (single activity) | Climate implicit | Match learner_task order to arc |

---

## Closure alignment (boundary)

Full **epistemic synthesis** is **37-4**. `study_tips` and ### Closure bullets may **reference the arc** in one line (CI already does) — do not expand into diary reflection.

---

## Tension evolution (37-2 link)

| Page | Tension introduced | How progression sharpens it |
|------|-------------------|----------------------------|
| CI | Procedure vs interval | Table labels → overlap judgement |
| Marx | Purpose vs plot | Comparison → factory judgement |
| Climate | Persuasive vs evidence-based | Cards → template classification → discussion |
| RNA | Genome/HCV discrimination | Items increase integrative demand |

---

## Before / after judgement

| Anchor | Before | After (37-3 target) |
|--------|--------|---------------------|
| CI overview | Notation-first | Arc sentence; bridges unchanged |
| Marx | Bridges good; no overview arc | overview/`learning_purpose` names model→compare→apply |
| Climate | Task inventory | Overview names encounter→classify→discuss; task order explicit |
| RNA | Item list | Overview names diagnostic progression |

---

## Proposed changes (implemented)

| Layer | Path |
|-------|------|
| Domain | `domain-learning-design-prompt-rules.md` — §6i |
| Design Page notes | `domain-learning-design-step-patterns.md` |
| Runtime | `app.js` — `buildSelfDirectedIntellectualProgressionPromptBlock()`; strengthen DLA/PEL bridge lines |
| Tests | `workflow-self-directed-activity-framing-adoption.test.js` |
| Probe | `fixtures/probe-37-3-progression-arcs.md` |

---

## Rejected scope creep

- Renderer / CSS / schema / workflow  
- New progression artefact types or phase enum fields  
- Adaptive sequencing or tutoring  
- Verbose transition paragraphs between activities  
- Facilitator “now you will” narration  
- Replacing Sprint 35 fading or 37-1/37-2 contracts  
- Mandatory six activities per page  

---

## Regression

```bash
node --test tests/*.test.js
```

**Target:** 593+ pass / 0 fail.

---

## Forward (37-4)

- Synthesis: what should be clearer **after** the arc completes — `study_tips`, section closings, debrief bullets.
