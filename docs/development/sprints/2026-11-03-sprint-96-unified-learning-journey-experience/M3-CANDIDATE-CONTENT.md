# Sprint 96 M3 — Candidate educational wording (C5 / C6)

**Status:** Candidate for author review — **not applied** to the stored real journey  
**Date:** 2026-11-03  
**Constraint:** Do not overwrite the author's stored *Deciding Under Uncertainty* journey without explicit confirmation.

## Why regeneration is gated

The live journey lives in the author's browser/owner store. Available packaging workflows assemble from that store. There is no safe automated path in this chat to write a separate stored version without risking overwrite of protected workflows.

**Runtime fix already corrects unified learner presentation** for the existing exported HTML (delivery-mechanics sentences are neutralized when an artefact contract applies). Pipeline prompt changes prevent future generations from embedding the same contradiction.

Optional content regeneration cleans the **source prose** so standalone HTML and future exports no longer carry obsolete transfer sentences at all.

## Affected fields (smallest boundary)

| Commission | Field path (Assessment Pack page) | Role |
| ---------- | --------------------------------- | ---- |
| **C5** | `attempt_instructions` | Producer attempt guidance |
| **C5** | `assessment_evidence.pack_forward_orientation` | What to take forward |
| **C6** | synthesis / overview learner-facing intro (rendered overview) | Consumer orientation |
| **C6** | first activity `activity_preamble` (or equivalent constructed preamble) | Consumer bring-forward |

Do **not** regenerate C1–C4. Do **not** change workspace IDs, elicitation IDs, or the C5→C6 artefact contract (`c5.E1` / `assessment-constructed-E1`).

## Before (current exported wording — excerpts)

**C5 attempt / pack-forward:**
> Save or copy your completed response somewhere you can retrieve it. You will need your own traffic-management judgement for self-evaluation in c6. Your response will not automatically transfer between learning products.

**C6 overview / preamble:**
> Begin by retrieving your retained response from activity c5… Your earlier response is not transferred automatically into this resource. Keep it available throughout.
>
> If you completed the earlier independent traffic-management judgement activity (c5), retrieve your saved response and keep it available… PRISM does not automatically transfer your earlier response into this resource.

## After (candidate educational-only wording)

**C5 `attempt_instructions` (replace the save/copy + transfer sentences; keep the educational task steps):**
> … Your written judgement will not receive an automatic correctness mark.  
> 5. You will use your own traffic-management judgement later for self-evaluation. Complete a coherent recommendation before you finish.

**C5 `pack_forward_orientation`:**
> Keep your traffic-management judgement available for the later self-evaluation activity. You will examine how effectively you recognised evidence, compared alternatives, justified your recommendation, and noticed remaining uncertainty.

**C6 overview (opening):**
> This self-directed resource helps you examine the quality of your completed independent judgement about temporary traffic-management measures near a school. If you completed the earlier independent judgement activity, use that work while you evaluate evidence use, defensibility, and remaining uncertainty.

**C6 activity preamble:**
> If you completed the earlier independent traffic-management judgement activity, use your own wording to evaluate how well you distinguished evidence from assumptions and recognised limitations.

**C6 `learner_context.bring_forward` (if regenerating Bind/purpose):**
```json
[{
  "what": "Your independent traffic-management judgement from the earlier assessment",
  "how_used": "Use your own wording to evaluate evidence use, defensibility, and remaining uncertainty"
}]
```

## Preservation plan if the author regenerates

1. Export / snapshot the current C5 and C6 packages (and design-page commission rows) before any regenerate.  
2. Regenerate **only** C5 and C6 Assessment Pack learner-facing fields (or re-run those constituent workflows with the updated commissioning prompts).  
3. Confirm workspace id `assessment-constructed-E1` (or current produce workspace) is unchanged.  
4. Re-download Unified Learning Journey and verify artefact handoff still resolves.  
5. Spot-check C2/C4 tables and graphics (fidelity gate).

## Author action required

To apply cleaned source content to the **real** stored journey, please confirm one of:

1. **Approve overwrite** of C5/C6 constituent outputs only after a backup snapshot; or  
2. **Author regenerates** C5/C6 in the UI after pulling these prompt changes; or  
3. **Leave source as-is** — unified runtime guidance remains sufficient for M3 acceptance of the delivery experience.
