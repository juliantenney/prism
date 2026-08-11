# Sprint 75 — Handover

**Kind:** Product/design continuation context (not a coding-agent handoff).  
**Primary pasteable brief:** [next-chat-briefing.md](next-chat-briefing.md)  
**Dashboard:** [STATUS.md](STATUS.md)

**From:** Create UX pass **COMPLETE** (`S75-D22`–`D25`); persistence **SETTLED** (`S75-D21`)  
**To:** **My Workflows** functional / operator audit → then UI simplification → later **Settings** (**PB-FA-005**)

---

## Current state

- Sprint **75** **OPEN** · Sprint **76** **not opened**
- **Create** journey for this pass is **done** (intent → internal resolve → required elicitation → one graph → Proposed workflow → **Save Workflow**)
- **Persistence** is **SETTLED** (`S75-D21`) — IndexedDB payloads; localStorage refs; `storageVersion` ≥ 2; operator-verified; no silent auto-deletion; do not casually reopen
- **Next:** My Workflows walkthrough with screenshots/observations — **behaviour first**, polish second

---

## Established contracts to carry forward

- **One workflow → one product** (Create must not invite sibling final products)
- Create Draft/Refined were non-durable twin scaffolding — **retired**; My Workflows/Run/Authoring never versioned that way
- Factor resolution stays internal; assistant asks only needed questions (`S75-D24`)
- **Rename** must keep identity (known defect today: behaves like duplicate)
- **Duplicate** = new identity + **clean** Run state (decided — do not reopen)
- Delete / Import / Export still need identity-aware audit
- Dormant pack post-generation refinement → consider with **Settings / PB-FA-005**, not casual deletion

---

## Known defects / residuals

- Rename identity bug (priority for My Workflows)
- Delete orphan / resource cleanup behaviour (audit)
- Import/Export semantics unknown in detail (audit)
- Storage usage UX → **PB-FA-007** (usage/capacity bar; explicit cleanup; no silent deletion)
- Settings efficacy / IA / Run propagation → **PB-FA-005**
- Slideshow first-class product → **PB-FA-008**; Research pack → **PB-FA-009**; release process → **PB-S-005**; orphan research → **PB-R-008**

---

## Do not

- Restart Create UX redesign in this conversation  
- Reopen persistence architecture (Sprint 75 question is **SETTLED** under `S75-D21`)  
- Reopen Duplicate Run-state inheritance  
- Implement Settings redesign before My Workflows audit  
- Broadly delete pack refinement machinery without Settings/pack authority  
- Open Sprint 76  
