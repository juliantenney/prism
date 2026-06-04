# Sprint 38 → Sprint 39 Handover & Forward Plan

**Date:** 2026-06-03  
**Authoritative Sprint 38 code:** `lib/sprint38-visual-affordances.js`, `lib/sprint38-representation-pedagogical-value.js`, `app.js`, `domains/learning-design/domain-learning-design-step-patterns.md`  
**Test floor:** **697 pass / 0 fail** (`node --test tests/*.test.js`)

---

## 1. Current state after Sprint 38

| Layer | State |
|-------|--------|
| **Design Page** | Emits schema 38.4 root + `visual_affordances[]` with generate/defer/reject; Sprint 38 + 38-6 prompt blocks |
| **Compose** | Strict validation; invalid rows dropped; root keys preserved |
| **Renderer** | Legacy vs authoritative hook gating; `data-affordance-id` passthrough |
| **VEU** | v1.2.1 authoritative / hybrid / legacy; v1.2 frozen |
| **Images** | Queue from Sprint 38 fields when authoritative |
| **Documentation** | [Sprint 38 ARCHITECTURE.md](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md) |

Sprint 38 is **committed and complete**. No further Sprint 38 runtime work is required.

---

## 2. Key finding — pipeline works; cue specificity does not

Validated E2E on Inflation (and programme anchors):

| Observation | Interpretation |
|-------------|----------------|
| Authoritative handover detected | Pipeline plumbing **solved** |
| Valid `generate` rows reach VEU | Schema + prompts **solved** |
| A3 image structurally correct (`classification_matrix`) | Representation token **honoured** |
| A3 image pedagogically weak (blank grid / worksheet duplicate) | **Reasoning cues under-specified** for image model |
| `must_show` lists category labels but not **perceptible discriminating features** | Cue authoring gap |

**Conclusion:** Invest in **reasoning cue specification** upstream in affordance authoring — not renderer, VEU topology, placement, or image model architecture.

---

## 3. Quality chain (Sprint 39 focus)

```text
purpose                 ← Sprint 38 (cognitive job category)
preferred_representation ← Sprint 38 (layout family)
pedagogical_added_value  ← Sprint 38-6 (incremental support vs materials)
reasoning cues           ← Sprint 39 (perceptible cues for image brief)
image                    ← VEU Step 2 (downstream)
```

---

## 4. What Sprint 39 must not do

- Reopen Sprint 38 architecture or schema 38.4 shape without 39-3 audit evidence  
- Redesign renderer, CSS, or Sprint 36 slots  
- Change VEU workflow topology or image models  
- Assume `reasoning_cues[]` is required — **audit first**  
- Skip anchor cases (Inflation, Climate, CI, Marx)

---

## 5. Recommended programme order

| Order | Slice | Outcome |
|-------|-------|---------|
| 1 | **39-1** Reasoning cue audit | Evidence table per generate affordance |
| 2 | **39-2** Taxonomy | Controlled cue-type vocabulary |
| 3 | **39-3** Cue authoring design | Field strategy (existing vs new) |
| 4 | **39-4** Representation cue alignment | Seven-token matrix |
| 5 | **39-5** Authoring guidance | Design Page author questions |
| 6 | **39-6** Validation plan | Success metrics vs Sprint 38 baseline |

**First action in new chat:** Complete 39-1 using [fixtures/probe-39-1-cue-audit-template.md](fixtures/probe-39-1-cue-audit-template.md).

---

## 6. Key file links

| Topic | Path |
|-------|------|
| Sprint 39 pack | `docs/sprints/sprint-39/` |
| Next chat context | `docs/sprints/sprint-39/CONTEXT-FOR-NEXT-CHAT.md` |
| Sprint 38 architecture | `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md` |
| A3 probe affordance | `tests/fixtures/sprint-38/affordance-records.json` → `inflation_a3_generate` |
| Pedagogical value catalog | `lib/sprint38-representation-pedagogical-value.js` |
| Sprint 38 tests | `tests/sprint-38-*.test.js` |

---

## 7. Forward implementation (post-planning only)

After 39-1–39-6 approval, a **future** implementation sprint may:

- Extend Design Page prompts with cue-authoring checklist (no schema change if 39-3 recommends field reuse)  
- Extend VEU Step 1/2 prompt consumption of cue-specific lines (prompt-only)  
- Add compose QA hints (non-blocking) for cue specificity  

All contingent on 39-3 evidence — **not** pre-decided in this handover.
