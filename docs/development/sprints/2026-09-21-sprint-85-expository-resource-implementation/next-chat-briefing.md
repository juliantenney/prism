# Sprint 85 — Next-chat briefing

**Sprint status:** **OPEN** — WP1+WP2 complete; WP3 **not started**  
**Brief:** [S85-D02](decisions.md#s85-d02--accept-detailed-sprint-85-implementation-brief) **accepted**  
**Extent:** [S85-D05](decisions.md#s85-d05--expository-scale--scope--explanatory-attention-extent-wp2) **accepted**

---

## One-liner

WP2 gate complete: EJP/XD/XM contracts, Expository extent normalisation (S85-D05), native capture wiring, section-primary assembly. Ready for WP3 pedagogical prompts when authorised. Do not commit unless instructed.

## Verified

- Extent: Scale/scope preserved; Expository-only words / 200 wpm / qualitative normalisation → EJP `extent`
- Capture: native `expository_*` artefacts normalize/validate on Run sync
- Assembly: EJP→XD→XM → ordered `sections[]`, `activities: []`
- Focused: `tests/s85-wp2-expository-contracts.test.js` + WP1 + page-vnext-assemble

## Next

Authorise WP3 sibling prompt authoring (EJP extent/depth semantics already scaffolded).

## Do not

- Reopen S84 architecture / redesign Create form  
- Change Interactive scale/scope semantics  
- Commit without operator instruction  
