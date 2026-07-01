# Sprint 57 — Start Here

**One page. Read this first.**

This sprint assumes the Sprint 56 architecture programme is complete and trusted.

---

## What is Sprint 57?

Sprint 57 is **Learner Experience & Product Quality**.

The goal is to improve how learners **experience** exported content — readability, flow, hierarchy, cognitive load, navigation, and confidence — on top of an architecture that Sprint 56 made trustworthy.

Sprint 57 is **not** a prompt-rationalisation sprint. The architecture review programme is **closed**; further architecture work is **evidence-triggered only**.

---

## What happened previously?

**Sprint 55** established that pedagogic architecture is sound when artefacts are intact; remaining gaps are product-layer.

**Sprint 56** (same programme, extended scope):

- Rationalised DLA prompts (49,949 → ~31,932 chars) with scaffold SSOT + PRE-EMIT
- Audited and remediated GAM and Design Page prompt ownership
- Verified cross-prompt authority placement
- Classified orchestration boundaries **GREEN**

See [SPRINT-57-EXECUTIVE-HANDOVER.md](SPRINT-57-EXECUTIVE-HANDOVER.md) for the full story.

---

## What should I read first?

| Order | Document | Why |
| ----- | -------- | --- |
| 1 | [SPRINT-57-ARCHITECTURE-STATE.md](SPRINT-57-ARCHITECTURE-STATE.md) | Who owns what |
| 2 | [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](SPRINT-57-LEARNER-PIPELINE-REFERENCE.md) | How DLA / GAM / Design Page fit together |
| 3 | [SPRINT-57-CHARTER.md](SPRINT-57-CHARTER.md) | What Sprint 57 will and won’t do |
| 4 | [SPRINT-57-BACKLOG.md](SPRINT-57-BACKLOG.md) | Candidate workstreams |

---

## What should I work on?

**Discovery-first** improvements in:

- Learner experience (duplication, over-scaffolding, page flow)
- Presentation (typography, hierarchy, tables, visual rhythm)
- Navigation (progression, guidance, transitions)
- Quality (consistency, instructional clarity, learner confidence)

Start with **fresh workflow exports** and **learner-facing HTML** — not prompt internals.

---

## What should I avoid reopening?

| Do not reopen | Unless |
| ------------- | ------ |
| DLA SSOT / PRE-EMIT rationalisation | Measured governance breach |
| GAM pack rationalisation programme | New material-type authority conflict |
| Design Page compose SSOT | Behaviourally risky misplacement observed |
| Cross-prompt authority audits | New workflow step with unclear ownership |
| “Just make prompts smaller” | No product evidence; architecture is GREEN |

Optional low-priority hygiene (documented, not scheduled): Design Page journey↔rhetoric wrapper dedupe (~1k chars).

---

## Key code entry points

| Concern | Location |
| ------- | -------- |
| Prompt augmentation chain | `app.js` ~`applyWorkflowStepRuntimePromptAugmentations` |
| DLA scaffold SSOT | `lib/ld-guided-learning-scaffold.js` |
| Design Page compose | `lib/ld-design-page-compose-contract.js` |
| GAM instructional patterns | `lib/instructional-pattern-prompt.js` |
| Post-compose repair | `lib/page-gam-materials-preserve.js`, `lib/page-activity-field-preserve.js` |
| Learner HTML export | renderer / export paths (see Sprint 55 design principles) |

---

## Probes (if you must measure prompts)

```bash
node scripts/probe-gam-s57-audit-metrics.js
node scripts/probe-design-page-s57-audit-metrics.js
node --test tests/sprint-56-dla-ssot-rationalisation.test.js
```

Prompt size is **monitoring only** in Sprint 57 — not a success metric.
