# Sprint 20 bootstrap — Workflow Explainability and Settings UX

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Sprint title:** Sprint 20 — Workflow Explainability and Settings UX  
**Status:** **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 20-1 chartered.

**Portable handover:** **`GPT-BOOTSTRAP-PROMPT.md`** + **`HANDOVER.md`**.

**Predecessor:** [`docs/consolidation/sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md)

---

## 1. Executive summary

**Sprint 18 (closed)** established **assistive planning adequacy** on Research after synthesis. **Sprint 19 (closed)** applied the same discipline to Learning Design: less chat, structural adequacy in the Planning panel, profile required tiers emptied, **118 tests green**, **`app.js` unchanged**.

**Sprint 20 (bootstrap)** addresses the **UX gap** left when interrogation drops: users need **explainability** (what was assumed) and **Settings discoverability** (where to tune) without bringing back a form wizard.

**One-sentence thesis:**  
*Generate with minimal questions; then make assumptions and tuning affordances obvious in the Factory UI.*

---

## 2. Why Sprint 20 follows Sprint 19

| Sprint 19 outcome | Sprint 20 use |
|-------------------|---------------|
| Generic refinement queue off | Tuning moves to **Settings** — must be **findable** |
| LD planning adequacy live | Adequacy can **link** to Settings, not re-ask factors |
| Profile required tiers empty | **Ready** fast — users need post-Ready guidance |
| `mappingRules` unchanged | Surface existing mappings in UI |
| Runtime frozen in 19 | Prefer **UI-first** slices; justify any runtime hook |

**Do not reopen Sprint 19 pack policy** except explicit defects or copy that references Settings paths.

---

## 3. Architectural inheritance

| Layer | Role in Sprint 20 |
|-------|-------------------|
| **Required essentials** | Still **blocking** — do not weaken |
| **Workflow synthesis** | Still creates the **concrete** workflow |
| **Planning adequacy** | **Advisory only** — refine presentation, not blocking |
| **Step Settings** | **Authoritative** for tuning — **primary Sprint 20 focus** |
| **Optional profile refinement** | **Convenience only** — do not restore required tiers |

---

## 4. Sprint 20 problem statement

After Sprint 19, **fewer questions are asked**, but **Settings now carry more of the tuning burden**. Users need clearer visibility into:

- **Assumptions** — inferred, defaulted, and explicit resolved values.  
- **Where to tune** — which steps expose assessment, page, and activity parameters.  
- **How adequacy relates to Settings** — structural notices should point to actionable controls, not duplicate chat.

---

## 5. Candidate goals

| Goal | Description | Typical slice |
|------|-------------|---------------|
| **A. Settings discoverability** | Badges, links, summaries, quick access to common `stepParams` | **20-1** |
| **B. Workflow explainability** | Provenance / assumptions panel for resolved brief + key mappings | **20-2** |
| **C. Adequacy UX refinement** | Clearer Planning-panel layout, actions, Settings deep-links | **20-3** |

---

## 6. Recommended slice sequence

| Slice | Title | Intent |
|-------|-------|--------|
| **20-1** | **Settings Discoverability** | Make Settings visible and actionable post-design |
| **20-2** | **Workflow Assumptions / Provenance** | Show what was inferred/defaulted and why it matters |
| **20-3** | **Adequacy UX Refinement** | Improve adequacy presentation without new blocking rules |

---

## 7. Recommended first slice — Slice 20-1

### Sprint 20 Slice 20-1 — Settings Discoverability

**Purpose:** Make step **Settings** visible and actionable so users can tune generated workflows **without** needing chat elicitation.

**Possible scope (charter to narrow):**

| Idea | Description |
|------|-------------|
| Step-level **Settings badges** | Indicate configurable steps in the suggested workflow list |
| **“Editable in Settings”** indicators | Inline hint on steps with non-empty `mappingRules` targets |
| **Planning-panel links** | Adequacy actions deep-link or scroll focus to relevant step Settings |
| **Settings summaries** | Compact read-only summary of key `stepParams` per step |
| **Quick access** | Common parameters: `assessment_type`, `assessment_total_items`, `page_profile`, `tone_style`, `depth_level`, `include_examples` |

**Non-goals:**

- No runtime rewrite (unless minimal hook justified in charter)  
- No workflow schema redesign  
- No Prompt Studio merge  
- No AI-generated adequacy  
- No return to heavy pre/post-design elicitation  
- No Research changes unless explicitly chartered  

**Success signals:**

- User can find Settings for **Generate Assessment Items** and **Design Page** within one or two clicks from Planning.  
- No new **required** post-gen questions.  
- **Ready** remains non-blocking.

---

## 8. Slice 20-2 outline (deferred)

**Workflow Assumptions / Provenance**

- Resolved brief panel: factor id, value, source (`explicit` / `inferred` / `default`).  
- Highlight factors that map to active steps.  
- Optional: “changed since design” if user edits Settings.

---

## 9. Slice 20-3 outline (deferred)

**Adequacy UX Refinement**

- Group `planning_adequacy` disclosures.  
- Pair each action string with Settings navigation where applicable.  
- Avoid adequacy row cap feeling like arbitrary truncation — consider priority ordering doc.

---

## 10. Out of scope for Sprint 20 bootstrap

- Implementation  
- Runtime rewrite  
- Renderer / schema redesign  
- Validation / conflict framework  
- Prompt Studio merge  

---

## 11. Risks

| Risk | Mitigation |
|------|------------|
| Settings become hidden expert mode | Slice 20-1 first |
| Adequacy becomes a second wizard | Keep non-blocking; link out to Settings |
| Explainability overwhelms users | Summaries + progressive disclosure in 20-2 |
| UX complexity creeps back | One slice per charter; test floor per PR |

---

## 12. Success criteria (programme)

| Criterion | Target |
|-----------|--------|
| Configurable steps visible | Yes — badges or equivalent |
| Key assumptions understandable | Yes — post 20-2 |
| Tune without chat | Yes — via Settings |
| Ready non-blocking | Preserved |
| Test floor | **118+** green |
| Sprint 18/19 architecture | Preserved |

---

## 13. Verification

```bash
node --test tests/*.test.js
```

**Bootstrap:** **118 passed**, 0 failed expected.

---

## 14. References

| Document | Role |
|----------|------|
| [`sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md) | Prior sprint |
| [`contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) | Four layers |
| [`sprint-19-manual-validation-post-19-3.md`](../../../consolidation/sprint-19-manual-validation-post-19-3.md) | Factory validation notes |
