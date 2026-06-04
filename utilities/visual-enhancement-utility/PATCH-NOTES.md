# Visual Enhancement Utility — patch notes

**Repository path:** `utilities/visual-enhancement-utility/`

---

## Versions in the repository

| Version | Location | Topology | Status |
|---------|----------|----------|--------|
| **v1.2.1** | `visual-enhancement-utility-v1.2.1.json` | 2 steps (unchanged) | **Current for Sprint 38** — authoritative affordance consumption |
| **v1.2** | `visual-enhancement-utility-v1.2.json` | 2 steps | **Frozen reference** (byte-stable export; legacy prompts) |
| **v1.1.1** | `docs/workflow/exports/visual-enhancement-utility-v1.1.1.json` | 3 steps | Historical |

---

## v1.2.1 (Sprint 38-8) — prompt patch only

**Name:** Visual Enhancement Utility v1.2.1  
**Change type:** Step 1 + Step 2 `override_prompt_body` only — **no** new steps, image models, or renderer changes.

| Area | v1.2 | v1.2.1 |
|------|------|--------|
| Topology | 2 steps | **Same** |
| Second input | HTML only (operational: attach JSON in chat) | Sprint 38 handover documented in Step 1 prompt |
| Modes | Inference only | **legacy \| hybrid \| authoritative** |
| Generate | Inferred purpose/representation | **Consume** 38-4 fields when JSON present |
| Reject/defer | Implicit | **rejected_affordances[]** / **deferred_affordances[]** ledgers |
| Queue | id, filename, prompt | + **affordance_id**, **requires_exact_data_match** |
| Accessibility | Generic alt | **caption_intent** + boundaries → figcaption + alt |
| Quantitative | Discipline conventions | **requires_exact_data_match** + **source_basis** enforcement |

**Import:** Use `visual-enhancement-utility-v1.2.1.json` for new Sprint 38 enhancement runs.

**Builder:** `node scripts/build-veu-v121-json.js` regenerates v1.2.1 from frozen v1.2 + patch fragments.

---

## v1.2 — summary

**Preservation:** `visual-enhancement-utility-v1.2.json` remains the unchanged user-supplied export.

---

## v1.1.1 — figure placement patch (still relevant)

See [`docs/workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md`](../../docs/workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md).

Figures must not be inserted inside `.util-activity-header`.
