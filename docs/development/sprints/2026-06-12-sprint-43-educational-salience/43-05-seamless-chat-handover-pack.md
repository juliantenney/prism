# Sprint 43 Seamless Chat Handover Pack

**Date:** 2026-06-12  
**Type:** Continuation handover only — not a sprint summary, investigation plan, or implementation proposal  
**Supersedes for new chats:** [`43-04-chat-continuation-pack.md`](43-04-chat-continuation-pack.md) — use **this document** as the single entry point  
**Audience:** Fresh ChatGPT conversation continuing Sprint 43 **learner-resource work** at Marx Prototype v4

---

## Read This First — Do Not Restart the Investigation

**The investigation phase for the main problem is complete.** A fresh chat must **not**:

- Ask the user to **re-run the Marx workflow** or re-paste upstream artefacts
- Request **GLC, EP, DLA, GAM, CLS, Design Page JSON, or rendered HTML** again — all were already reviewed in the live discussion
- Re-argue the **ownership model** (43-02 is accepted)
- Re-explain or re-decide the **two-column manifestation model** — it is settled as the current prototype direction
- Re-diagnose **missing pedagogy**, missing workflow stages, or missing PEL architecture
- Propose **implementation**, prompts, schema, renderer, or workflow changes unless the user **explicitly** asks

**Start from the frontier:** produce **Marx Resource Prototype v4** — a complete learner-facing resource, not a plan.

If the user pastes this pack, treat every section below as **authoritative settled ground**.

---

## Settled Findings

Short evidence notes only. Do not re-investigate.

| Finding | Evidence | Status |
| ------- | -------- | ------ |
| Workflow is **not** missing a stage | 42-8, 42-10, 42-13 | **Settled** |
| Source-ingest parity achieved — `learning_content` on both routes before KM | 42-10 | **Settled** |
| Educational structure **exists** end-to-end on Marx | Fresh manual run + 42-13 | **Settled** |
| Inquiry **survives** upstream | GLC very strong; DLA operationalises without destroying inquiry | **Settled** |
| Exposition **survives** | GAM strong — real exposition, worked examples, tables | **Settled** |
| Judgement **survives** | LO/EP/DLA/GAM; strong in A5 | **Settled** |
| Transfer **survives** | GAM transfer prompts, EP beats | **Settled** |
| PEL **survives weakly** | Present but shallow; 42-12 Verdict B | **Settled** |
| **Gap is salience / ownership**, not generation quality | Design Page + render make activities dominant; 42-11A | **Settled** |
| **Presence ≠ salience** | Structure in JSON ≠ structure owning learner experience | **Settled** |
| GLC aligns with target model | Investigation very strong, Resource strong on fresh run | **Settled** |
| DLA shifts organising labels toward activity titles | A1–A5 titles vs LC question arc — nuance: "workbook" is delivery label, not proof of wrong ownership upstream | **Settled** |
| GAM is closer to Resource + Investigation than expected | Does not destroy inquiry | **Settled** |
| CLS preserves intellectual movement | Transitions describe understanding → application → analysis → evaluation | **Settled** |
| Design Page / render are the **manifestation bottleneck** | Overview → LO → Learning Activities → A1…A5 | **Settled** |
| Two-column prototype **educationally validates** ownership model | Blind review 8–9/10; no criticism of fragmented activities or missing journey | **Settled** |

**Current confirmed diagnosis (do not re-derive):**

> Educational structures survive end-to-end. The gap is **manifestation / salience / ownership** at Design Page and render — not absence of structure and not generation quality.

---

## Settled Decisions

### Sprint decision (43-02) — **Accepted, not open**

| Role | Owner |
| ---- | ----- |
| **Primary** | **Investigation** — governing inquiry organises the learner experience |
| **Secondary** | **Resource** — coherent self-study voice teaches while investigation unfolds |
| **Supporting only** | Capability, Judgement, PEL, Activities, Materials |

**Desired learner experience:**

`Question → Explanation → Investigation → Judgement → Reflection`

**Current pipeline learner experience (confirmed on fresh run):**

`Overview → Learning Purpose → Learning Activities → Activity 1…N`

Reference: [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md)

### Prototype / design decisions — **Accepted for learner-resource work only**

These are **manifestation / prototype** decisions. They are **not** implementation, schema, renderer, or workflow decisions.

| Decision | Meaning |
| -------- | ------- |
| **Two-column manifestation model** | Current direction for manual prototypes |
| **Left column = learner journey compass** | Lightweight signposting — not teaching, not activities |
| **Right column = actual disciplinary resource** | Full exposition, activities, materials, tables, tasks |
| **Preserve actual GAM substance** | Prototypes use real activity/material content, not summaries |
| **Signposts must be short** | Orientation beside the resource, not instead of it |

---

## Artefacts Already Reviewed

**A fresh Marx self-study workflow was already run manually.** All artefacts below were reviewed. **Do not ask for them again.**

| # | Artefact | Finding (one line) |
| - | -------- | ------------------ |
| 1 | **Generate Learning Content** | Investigation very strong, Resource strong, Judgement strong; Activity absent; PEL weak — **already aligned with 43-02** |
| 2 | **Episode Plans** | Capability progression preserved (understand → understand → apply → analyse → evaluate); supports journey, does not own page |
| 3 | **Design Learning Activities** | Operationalises investigation; does not destroy it; organising labels shift toward A1–A5 activity framing |
| 4 | **Generate Activity Materials** | Strong exposition, worked examples, tables, checklists, transfer, judgement scaffolds; Resource + Investigation; judgement strong in A5; PEL shallow |
| 5 | **Construct Learning Sequence** | Intellectual movement preserved; transitions are pedagogical, not administrative |
| 6 | **Design Page JSON** | **Ownership mismatch visible** — Overview → Learning purpose → **Learning activities** → A1…A5 → Study tips; inquiry subordinated |
| 7 | **Rendered HTML** | Confirms Design Page — educationally strong but **visually and structurally activity-owned** |

---

## Design Discoveries To Carry Forward

**Critical — do not re-discuss in a new chat.**

### Two-column model (manifestation only)

```
┌─────────────────────────┬──────────────────────────────────────┐
│  LEFT: Journey compass  │  RIGHT: Actual learning resource      │
│  (lightweight signposts)│  (full disciplinary content)          │
└─────────────────────────┴──────────────────────────────────────┘
```

### Left column — learner journey compass

**IS:**

- Lightweight instructional signposting
- Investigation orientation and current focus
- Key question / governing inquiry reminders
- Progress awareness through the investigation
- Judgement prompts, confidence checks, reflection prompts
- Transfer / next-step awareness
- **Where am I? Why am I here? What am I deciding? What should I pay attention to?**

**IS NOT:**

- A PEL column (PEL contributes, but left column ≠ PEL only)
- A second lesson or second resource
- A place for lengthy teaching, examples, or activity content
- A substitute for the right column

**Also contributes to left column (not only PEL):**

- Investigation structure
- Learning sequence transitions
- Judgement scaffolding
- Capability progression signals
- Self-monitoring, confidence, reflection, transfer readiness

### Right column — disciplinary resource

**IS:**

- The actual learning resource — teaches Marx (or topic)
- Full exposition, worked examples, activities, tables, cases
- Outputs, checklists, transfer tasks, judgement tasks
- **All activity and material substance lives here**

**Principle:** Learner guidance lives **beside** the resource, **not instead of** it.

---

## Marx Prototype v3

**What it was:** Manually authored **"Marx Resource Prototype v3"** using **actual GAM materials** — not pipeline output, not a summary document.

**Structure:**

- Investigation phases with lightweight left-column signposts
- Full right-column resource content (actual activities, worked examples, tables, self-checks, transfer prompts, final reflection)
- Reorganised Marx content under investigation ownership while preserving GAM substance

**Purpose:** Test whether Investigation-primary / Resource-secondary presentation feels **stronger educationally** than activity-led pipeline render.

**What it achieved:** Educational validation that the ownership model and signposting approach are on good ground (see review below). **Not** an implementation proposal.

---

## Educational Review Findings

**Already completed.** Blind review using Professor of Distance Education / self-study resources persona. **Do not request another baseline review of v3 unless the user asks.**

### Ratings

| Dimension | Score |
| --------- | ----- |
| Educational quality | **8.5 / 10** |
| Self-study suitability | **8 / 10** |
| Judgement-development quality | **9 / 10** |
| Learner-journey coherence | **8.5 / 10** |

### Strengths (review did NOT criticise)

- Fragmented activities
- Weak learner journey
- Activity dominance
- Missing exposition
- Weak judgement
- Unclear purpose

**Review praised:**

- Strong overarching inquiry spine
- Coherent intellectual arc; phase structure pedagogically meaningful
- Activities embedded within narrative
- Strong exposition and worked examples; clear learner guidance
- Strong self-study suitability; exceptional judgement development
- Strong Bloom-like progression; improvement over activity-led formats

### Remaining weaknesses (v4 must address)

1. **Synthesis** — interim synthesis points; cumulative sense-making; stronger return to central question across phases
2. **Metacognitive depth** — what changed in understanding; where uncertainty remains; how judgement evolved; clearer independence development
3. **Authorial / tutorial voice** — guided intellectual apprenticeship; tutor-like conversational guidance; less procedural completion; more "why this matters now"
4. **Judgement criteria** — explicit criteria (explanatory power, empirical support, scope, limitations); meta-commentary on stronger/weaker reasoning

---

## Remaining Design Problems

**Only these four.** The main diagnostic problem is **closed**.

| Problem | v4 improvement target |
| ------- | --------------------- |
| Synthesis | Interim synthesis; cumulative sense-making; return to governing question |
| Metacognitive depth | Self-monitoring, understanding change, residual uncertainty, judgement evolution, independence |
| Tutorial / authorial voice | Conversational tutor framing; why-this-matters-now |
| Explicit judgement criteria | Named criteria + meta-commentary on reasoning quality |

---

## Do Not Reopen

**Unless the user explicitly requests it, do not:**

| Do not… | Because… |
| ------- | -------- |
| Ask to **run Marx again** | Fresh manual run complete; all artefacts reviewed |
| Ask for **GLC / EP / DLA / GAM / CLS** again | Findings settled in this pack |
| Ask **what belongs in the two columns** | Settled in Design Discoveries section |
| Re-argue **PEL vs left column** | Left column = journey compass; PEL contributes but is not the whole column |
| **Revisit ownership decision** | 43-02 accepted |
| Diagnose **missing pedagogy** | Disproved in Sprint 42; confirmed on fresh run |
| Propose **new workflow stages** | Out of scope |
| Discuss **implementation** | Unless user explicitly asks |
| Re-audit **whether inquiry/PEL/judgement exist** | Presence confirmed; gap is salience |
| Treat **"workbook"** as proof of failure | Delivery-mode label; nuance documented for DLA |
| Produce **plans instead of the resource** | v4 deliverable is the full learner-facing resource |

---

## Immediate Next Task

### Produce Marx Resource Prototype v4

**Take v3 and improve** the four remaining design problems. Output a **complete learner-facing resource** — not an outline, not a plan, not a discussion document.

### v4 must preserve

- Investigation primary, Resource secondary (43-02)
- Lightweight **left-column** signposts (journey compass)
- Full **right-column** learning resource
- **Actual** activities and materials (GAM-style substance — not summaries)
- Activity/material fidelity in content terms
- Two-column manifestation model as established

### v4 must improve

- **Synthesis**
- **Metacognitive depth**
- **Tutorial / authorial voice**
- **Explicit judgement criteria**

### Constraints

- **Learner-resource level only**
- No implementation, schema, renderer, workflow, or prompt engineering
- No architecture recommendations

---

## Suggested Opening Prompt For Fresh Chat

Copy everything below the line into a new ChatGPT conversation:

---

**Sprint 43 — Educational Salience — continue at v4**

Read the **Sprint 43 Seamless Chat Handover Pack** (`43-05-seamless-chat-handover-pack.md`) in full. Treat it as authoritative settled ground.

**Do not restart the investigation.** Do not ask me to re-run Marx, re-paste GLC/DLA/GAM/Design Page artefacts, re-argue the ownership model, or re-discuss the two-column layout. All of that is complete.

**Settled:** Investigation primary, Resource secondary (43-02). Gap is salience/ownership at Design Page/render, not missing pedagogy. Two-column prototype model: left = lightweight journey compass (not PEL-only, not teaching); right = full disciplinary resource with actual activities and GAM-style materials. Marx Prototype v3 reviewed at 8–9/10 — ownership approach validated.

**Your task now:** Produce **Marx Resource Prototype v4** — a complete learner-facing resource, not a plan.

**Preserve:** investigation spine, two-column structure, short left signposts, full right-column content, actual activity/material substance from v3/GAM.

**Improve over v3:**
1. Synthesis (interim synthesis, cumulative sense-making, return to central question)
2. Metacognitive depth (understanding change, uncertainty, judgement evolution, independence)
3. Tutorial / authorial voice (conversational tutor, why-this-matters-now)
4. Explicit judgement criteria (explanatory power, empirical support, scope, limitations; meta-commentary on reasoning)

**Constraints:** Learner-resource level only. No PRISM implementation, schema, renderer, workflow, or prompt discussion unless I explicitly ask.

Begin by producing v4 directly.

---

## Related documents

| Document | Role |
| -------- | ---- |
| [`43-05-seamless-chat-handover-pack.md`](43-05-seamless-chat-handover-pack.md) | **This pack — use for new chats** |
| [`43-02-ownership-model-decision.md`](43-02-ownership-model-decision.md) | Accepted ownership decision |
| [`43-04-chat-continuation-pack.md`](43-04-chat-continuation-pack.md) | Earlier pack — superseded for chat handover |
| [`README.md`](README.md) | Sprint scope and success criteria |
| [`handover-from-sprint-42.md`](handover-from-sprint-42.md) | Sprint 42 → 43 context |
| [42-13 synthesis](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-13-sprint-synthesis-authorial-quality-findings.md) | Sprint 42 closure |
| [42-11A](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-11A-design-page-static-provenance-audit.md) | Activity dominance (static) |
| [42-12](../2026-06-11-sprint-42-authorial-quality-educational-exposition/observations/42-12-pel-manifestation-audit.md) | PEL weak at page (static) |
