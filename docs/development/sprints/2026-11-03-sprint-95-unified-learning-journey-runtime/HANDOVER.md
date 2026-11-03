# Sprint 95 — Handover

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **OPEN** — M1 ready; not started  
**Predecessor:** Sprint 94 **CLOSED — ACCEPTED** — do not reopen

## Resume here

1. [SPRINT-95-START-HERE.md](SPRINT-95-START-HERE.md)  
2. [decisions.md](decisions.md) — S95-D01  
3. [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) — M1 plan  
4. [next-chat-briefing.md](next-chat-briefing.md)

## What is done

- Sprint opened (S95-D01).  
- Charter, map, M1 plan, acceptance/regression criteria, risks documented.  
- No production code.

## Next slice

**M1 — Renderer Lifecycle Demonstrator** (Assessment Pack preferred): container-scoped init/dispose; persist; unmount; remount restore; no duplicate handlers; standalone unchanged; **do not change LJ publishing**.

## Constraints

- http://localhost/prism/ — never `file://` for live QA.  
- Do not modify stored clinical Assessment Pack workflow `e50c39b5-0c33-4869-bf5a-4fc2cef07c70`.  
- Cache-bust after app.js / renderer / canonical changes.  
- Rebuild browser artefact after modular renderer changes: `npm run build:learner-renderer-vnext-browser`.  
- No Git unless asked.
