# Sprint 83 — Handover

**Kind:** Closed-sprint handover  
**Sprint status:** **CLOSED / COMPLETE**  
**Closure:** [SPRINT-83-CLOSURE.md](SPRINT-83-CLOSURE.md)  
**Authoritative findings:** [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md)

---

## Start here

Sprint 83 is **CLOSED**. Operator accepted the investigation report ([S83-D03](decisions.md#s83-d03--accept-investigation-report-and-close-sprint-83)).

**No Expository implementation was authorised or performed.**  
**No production behaviour changed.**

Planning handoff constraints ([S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)):

- **Sibling prompt-family** — Expository gets its own coherent prompts/contracts where needed; do not branch or weaken Interactive prompts.
- **Protected baseline** — do not modify Interactive prompts merely so Expository can work; additive infrastructure only if Interactive behaviour is preserved.

---

## Do next

1. Open an **Expository Resource Planning** sprint only via an **explicit opening decision** — not assumed by this file.  
2. Planning inputs: [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) + [S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) + [SPRINT-83-CLOSURE.md](SPRINT-83-CLOSURE.md).  
3. Do **not** decide topology/schemas/prompt text/naming from this handover alone.  
4. Do **not** reopen Sprint 82 or treat historical debt as automatic work.

---

## Protected

- Alpha development complete; gate at close **339/339**.  
- Sprint 82 **CLOSED**.  
- Interactive prompt family = protected baseline for Expository work.
