# Probe 38B-1 — Prompt audit template

Copy rows into [observations/38B-1-prompt-audit.md](../observations/38B-1-prompt-audit.md).

**Automated probes:**

- Full priority steps: `node scripts/probe-38b1-ld-workflow-prompt-audit.js`
- Design Page only: `node scripts/probe-38b1-design-page-prompt-size.js`

---

## Design Page — measured 2026-06-04

| Field | Value |
|-------|--------|
| Pack `promptTemplate` chars | 9818 |
| Pack `defaultPromptNotes` chars | 8476 |
| Seeded chars | 9648 |
| Augmented (self-directed) chars | 45791 |
| Augmented (generic workshop) chars | 20146 |
| Auto-applied blocks (self-directed) | 15 |

---

## Per-step row

| Field | Value |
|-------|--------|
| **workflow step** | |
| **canonical_step_id** | |
| **prompt source files** | |
| **pack promptTemplate chars** | |
| **pack defaultPromptNotes chars** | |
| **runtime augmentations** | |
| **augmented total chars** | |
| **auto-applied block count** | |
| **duplicated rules** | |
| **contradiction risks** | |
| **known regressions** | |
| **risk level** | |

---

## Priority steps (complete all)

- [x] Model Knowledge  
- [x] Define Learning Outcomes  
- [x] Design Learning Activities  
- [x] Generate Activity Materials  
- [x] Generate Assessment Items  
- [x] Construct Learning Sequence  
- [x] Design Page  
