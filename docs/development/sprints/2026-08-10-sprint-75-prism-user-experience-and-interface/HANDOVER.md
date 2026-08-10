# Sprint 75 — Handover

**From:** `S75-D14` Run capture persistence non-destructive merge  
**To:** Operator review of remaining S75-T-020 candidate slices — **no automatic further implementation**

---

## Current state

- Sprint **75** **OPEN**  
- **Latest:** `S75-D14` — persisted Run captures are cumulative durable state; ordinary persist merges durable+live (absent live keys are not deletion); Authoring Assemble reconciles before assembly; explicit Clear remains destructive.  
- Prior: `S75-D03`…`S75-D13` (including Authoring assembly readiness; Learning object retirement; C-04–C-07)  
- **Sprint 76** — **not opened**

---

## Residual (not implemented)

- Rename currently creates new workflow identity  
- Duplicate creates new identity without copying runstate  
- Delete can leave orphan runstate  
- No browser unload flush for never-persisted pastes  

---

## Do not

- Reintroduce Authoring Learning object presentation mode without a new product decision  
- Treat missing live capture keys as durable deletion  
- Open Sprint 76  
