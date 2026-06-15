# Sprint 43 Chat Continuation Pack

**Date:** 2026-06-12  
**Type:** Synthesis and handover only — no implementation, no new analysis, no new recommendations  
**Audience:** Fresh ChatGPT (or other) discussion continuing Sprint 43 educational-resource exploration  
**Authoritative sprint docs:** [`README.md`](README.md), [`handover-from-sprint-42.md`](handover-from-sprint-42.md), [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md)

---

## Current Position

Sprint 42 (**Authorial Quality / Educational Exposition**) is **closed**. Sprint 43 (**Educational Salience**) is **open — investigation and decision phase**.

Sprint 42 disproved the **missing-ingredients hypothesis**. PRISM generates substantial educational structure upstream — inquiry, exposition, judgement, transfer, PEL, and learner journey — but the **final learner page does not consistently foreground that structure** as the learner's primary experience. The dominant failure mode is **downstream salience / narrative authority**, not pipeline completeness.

Sprint 43 work completed to date:

| Item | Status |
| ---- | ------ |
| Problem reframing (43-00) | Complete — salience vs presence defined |
| Salience baseline plan (43-01) | Published — calibration methodology |
| Ownership model analysis | Complete — planning discussions |
| Ownership model decision (43-02) | **Accepted** — Investigation primary, Resource secondary |
| README decisions section | Updated |
| 43-03 ownership validation notes | **Not present** in repo at pack creation |
| Marx prototype manifestation experiment | Conducted at **learner-resource level** (outside pipeline) |
| Educational review of prototype | Qualitative review completed |
| 43-01 formal salience baseline observation | **Not yet executed** as written deliverable |

**Current agreed focus:** Continue **learner-resource-level exploration** via **Marx Prototype v4** — testing whether synthesis, metacognitive depth, and tutorial voice further strengthen an investigation-owned self-study resource. **No implementation discussion** in this phase.

---

## What We Now Believe

Established conclusions only. Do not re-litigate unless fresh evidence contradicts.

### Presence vs salience

- **Presence** — signal exists in upstream JSON, fields, or prompts.
- **Salience** — learner or reviewer can **encounter, recognise, and experience** the signal as organising the resource on a normal read.

Sprint 42 established **high presence** and **variable salience**. Field presence does not guarantee learner-visible authority.

### Investigation ownership (target)

For self-directed higher-education resources, the **governing inquiry** should be the primary organising unit. The learner should experience:

**Question → Explanation → Investigation → Judgement → Reflection**

Activities should read as **phases within the investigation**, not as the definition of what the resource is.

### Resource ownership (target)

The learner should also experience a **coherent self-study resource** that teaches while the investigation unfolds — orientation, explanation, conceptual development, and synthesis — without replacing embedded activities.

Handover desired inversion:

```text
Current:   Activities → Resource
Target:    Resource → Activities embedded within a larger investigation
```

### Activity dominance findings

Design Page is **structurally activity-centred** today (42-11A Verdict A):

- Hard **ACTIVITY MEMBERSHIP** contract; DLA-only repair
- GAM **verbatim preserve**; PREC-02 materials precedence over wrapper thinning
- `learning_content` influences **wrapper assimilation only** — no structural page mapping or repair path
- Rendered Marx manual run: **Overview → Learning Outcomes → Learning Activities → Activity 1…N** — workbook shape

The inquiry **exists** upstream; the activity stack **owns** what the learner notices first.

### PEL findings

42-12 Verdict **B: PEL implemented but weakly protected**

- **Strong at DLA/GAM** — mandatory framing, cognition fields, PEL orientation/reasoning blocks
- **Weak at Design Page** — no PEL PEC injection at compose; EQF metacognition explicitly **lightweight**
- **Rendered experience** — PEL can exist upstream but be **buried** inside activity/material layout

Confidence, uncertainty, progress awareness, decision reflection, and independence are present in contracts and fields but appear **weakly** in final learner experience.

### Design Page findings

Design Page behaves as a **faithful assembler** of activities and preserved materials — not yet a strong **educational author** of learner-visible structure (42-13).

| Authority type | Sprint 42 assessment |
| -------------- | -------------------- |
| Activity authority | **Dominant** |
| Material authority | **Dominant** (visual weight) |
| Inquiry authority | Present upstream; **no hard page mapping** |
| Page-level authority | **Soft** — subordinate to materials |

---

## Key Evidence

### 42-11A — Design Page static provenance audit

- **Verdict A:** Static evidence strongly supports DLA/activity dominance.
- Hard contracts centre composed page on `learning_activities` + `activity.materials.*`.
- LC, KM, LS influence wrapper assimilation and ordering hints only — no structural authority, repair paths, or precedence over materials.
- GAM can **dominate scan path** (tables, worked examples, checklists inside task blocks).
- Episode plans are **not** Design Page input.

### 42-12 — PEL manifestation audit

- **Verdict B:** PEL implemented but weakly protected at learner page.
- PEL authored at DLA/GAM; copied through Design Page; not generated at compose.
- Metacognition explicitly **lightweight** in EQF at Design Page.
- Risk: PEL fields **present** but read as **labels** buried below materials.

### Marx manual workflow audit

Primary evidence: **manual end-to-end self-study run** — "Was Marx Right?" (higher confidence than Sprint 30 fixtures or harness captures).

| Stage | Structure present | Salience downstream |
| ----- | ----------------- | ------------------- |
| `learning_content` | Strong inquiry arc | **Low** structural authority on page |
| `learning_activities` | Operational journey | **High** — owns activity section |
| `activity_materials` | Rich exposition | **High** visual weight |
| Rendered page | Inquiry/judgement/PEL inside activities | **Activity-led** workbook experience |

**Reader experience:** Inquiry exists; activity stack owns first impression.

### Ownership discussions (early Sprint 43)

Models evaluated: Activity-owned, Investigation-owned, Resource-owned, Capability-owned, Judgement-owned, Material-owned, Hybrid.

**Accepted decision (43-02):** Investigation **primary**, Resource **secondary**; Capability, Judgement, PEL, Activities, Materials as **supporting structures**.

Activity-owned rejected as **current state**, not target. Capability-owned rejected as **progression spine**, not investigation frame. Unprioritised hybrid rejected — activity + material authority wins by contract default (42-11A).

---

## Ownership Decision

**Record:** [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md) — **Accepted**

### Primary owner: Investigation

The governing inquiry is the primary organising unit. Learner arc:

**Question → Explanation → Investigation → Judgement → Reflection**

### Secondary owner: Resource

Coherent self-study resource voice — orientation, explanation, conceptual development, synthesis — teaching while the investigation unfolds, without replacing activities.

### Supporting structures (essential, not primary owners)

| Structure | Role under decision |
| --------- | --------------------- |
| **Capability** | Progression the investigation develops (LO, scaffold fade, independence) |
| **Judgement** | Evaluative movement across the resource, not only final task |
| **PEL** | Sustained self-monitoring across the investigation |
| **Activities** | Operational phases of the inquiry (DLA) |
| **Materials** | Exposition and practice within phases (GAM) |

---

## Marx Prototype Experiment

A **manually created investigation-owned Marx resource** ("Was Marx Right?") was produced at **learner-resource level** to test whether the accepted ownership model can **manifest** in a readable self-study experience — **not** to test or change the PRISM pipeline.

**Purpose:** Manifestation testing. Explore what an investigation-owned, resource-voiced page **could read like** before any compose, prompt, schema, renderer, or workflow work.

**Design concepts explored:**

| Concept | Intent |
| ------- | ------ |
| **Two-column layout** | Separate **investigation spine** (governing question, phase arc, where-you-are-in-the-inquiry) from **resource spine** (teaching prose, explanation, conceptual development) so both ownership targets are visibly co-present |
| **Instructional signposts** | Learner-visible cues linking each section/phase to the investigation movement — not only activity titles |
| **Investigation spine** | Governing question and arc own the reader's frame; activities embedded as investigative phases |
| **Resource spine** | Continuous self-study voice — teach before task; exposition and synthesis supporting the inquiry |

**Relationship to pipeline output:** Sprint 42 Marx **pipeline** run had strong upstream structure but **activity-led** rendered experience. The prototype asks: if ownership is Investigation + Resource, what does the **learner read** look like when authored directly at resource level?

**Not in scope of prototype:** Implementation back into Design Page, prompts, schema, or renderer.

---

## Educational Review Outcome

Qualitative educational review of the investigation-owned Marx prototype (manifestation experiment). **No formal numeric rubric scores were recorded** in sprint artefacts; findings are directional.

### Strengths observed

| Dimension | Finding |
| --------- | ------- |
| **Inquiry coherence** | Governing question and investigation arc readable as primary frame — closer to Sprint 43 target than pipeline-rendered Marx |
| **Exposition** | Resource spine carries teaching and explanation within the investigation |
| **Judgement** | Evaluative movement more legible across the resource than activity-local judgement alone |
| **Learner journey** | Phases read as one investigation with embedded work, not disconnected tasks |

### Remaining weaknesses observed

| Dimension | Finding |
| --------- | ------- |
| **Synthesis** | Resource-closing synthesis still thin — investigation completes but integrative "what you now understand and decided" voice weak |
| **Metacognitive depth** | PEL/self-monitoring present but not yet a **sustained** spine — aligns with 42-12 upstream-strong / page-weak pattern even in manual prototype |
| **Authorial / tutorial voice** | Closer to authored investigation than pipeline workbook, but not yet consistent **tutorial** voice — teach-before-task and connected prose still uneven |

**Review implication:** Investigation + Resource ownership **can manifest** at learner-resource level with clearer inquiry coherence than pipeline output. **Synthesis, metacognitive depth, and tutorial voice** remain the main gaps — motivating **Marx Prototype v4**.

---

## Next Investigation

### Marx Prototype v4

**Goal:** Explore whether adding:

- **synthesis**
- **metacognitive depth**
- **tutorial voice**

further strengthens an investigation-owned self-study resource.

**Constraints:**

- No implementation discussion
- No schema changes
- No renderer changes
- No workflow changes
- Work entirely at **learner-resource level** (manual educational resource authoring / review)

**Evaluation lens:** Sprint 43 success criteria in [`README.md`](README.md) — especially inquiry trajectory, structural coherence, metacognitive meaningfulness, judgement development — judged by **educational review**, not upstream artefact completeness.

**Not in scope for v4 exploration:** Translating prototype patterns into PRISM compose, prompts, or contracts.

---

## Suggested Starting Prompt For New Chat

Copy and paste the block below into a fresh ChatGPT conversation:

---

**Sprint 43 — Educational Salience (continuation)**

You are continuing PRISM Sprint 43. This is **learner-resource exploration only** — no implementation, no prompt/schema/renderer/workflow changes.

**Background (established — do not re-investigate):**

Sprint 42 closed with: educational structure exists upstream (inquiry, exposition, judgement, transfer, PEL, journey) but final pipeline-rendered pages remain **activity-led** workbooks. Gap is **salience / narrative authority**, not missing stages or pedagogy. Evidence: 42-11A (activity dominance), 42-12 (PEL weak at page), Marx manual pipeline run.

**Accepted decision (43-02):**

- **Primary owner:** Investigation — learner arc: Question → Explanation → Investigation → Judgement → Reflection; activities are phases within the inquiry.
- **Secondary owner:** Resource — coherent self-study voice teaching while the investigation unfolds.
- **Supporting only:** Capability, Judgement, PEL, Activities, Materials.

**Work completed:**

A manually authored **investigation-owned Marx prototype** ("Was Marx Right?") tested manifestation at learner-resource level using a **two-column** concept (investigation spine + resource spine) and **instructional signposts**. Educational review found **strengths** in inquiry coherence, exposition, judgement, and learner journey. **Remaining weaknesses:** synthesis, metacognitive depth, authorial/tutorial voice.

**Current task — Marx Prototype v4:**

Explore whether strengthening **synthesis**, **metacognitive depth**, and **tutorial voice** further improves an investigation-owned self-study resource. Work at learner-resource level only. Evaluate against Sprint 43 success criteria (inquiry trajectory, one-investigation-with-embedded-activities, metacognitive meaningfulness, judgement development).

**Constraints:** No PRISM implementation. No architecture proposals. Educational design and review only.

**Key docs (if available):** Sprint 43 `43-02-ownership-model-decision.md`, `43-04-chat-continuation-pack.md`, Sprint 42 `42-13` synthesis, `42-11A`, `42-12`.

---

## Related documents

| Document | Role |
| -------- | ---- |
| [`README.md`](README.md) | Sprint scope, decisions, success criteria |
| [`handover-from-sprint-42.md`](handover-from-sprint-42.md) | Sprint 42 → 43 entry |
| [`43-01-investigation-plan.md`](43-01-investigation-plan.md) | Salience baseline methodology |
| [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md) | Accepted ownership decision |
| [43-00 problem reframing](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/43-00-problem-reframing-educational-salience.md) | Salience definitions |
| [42-13 synthesis](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md) | Sprint 42 closure |
| [42-11A](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md) | Activity dominance |
| [42-12](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-12-pel-manifestation-audit.md) | PEL manifestation |

**Note:** User query referenced `43-01-ownership-model-investigation-plan.md` — repo file is [`43-01-investigation-plan.md`](43-01-investigation-plan.md). No `43-03` artefact exists at pack creation.
