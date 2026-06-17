# Sprint 49 Open Questions

## SP-01 / cognition reconciliation (blocking 49-2)

1. **Which reconciliation option** scopes cognition cues away from `text` bodies — A (app.js cognition builder), B (SP-01 override only), C (route to `prompt_set`), or D (material-type-aware injection)?
2. Should cognition cues remain **per activity** but **never inside `text` Content**, or move to a **single designated material per activity**?
3. Does reconciliation require changing **visible** cognition contract text on copied GAM prompts, or only adding SP-01 pattern block?
4. Is FM-08 (applied integrative illustration) mentioned as **optional GOOD shape** only, or omitted entirely from runtime block?

## SP-01 implementation

5. Minimal SP-01 slice: **lib-only** after reconciliation elsewhere, or **single slice** touching cognition + lib together?
6. Maintain-test expectation: Marx M1 already Strong — what observable delta counts as success (FM-07 absence on all `text` slots)?

## Marx validation

7. Run full Marx workflow post–SP-01, or targeted GAM `text` materials only?
8. Should Sprint 49 produce a formal **observation log** artefact (Sprint 48 runs were informal)?

## Presentation (secondary — do not block SP-01)

9. Investigation entry point: `design_page` JSON, rendered HTML, or manual prototype diff?
10. Is two-column work **renderer** (`style.css` / page compose) or **design_page prompt** contract first?

## Hygiene (non-blocking)

11. Strict JSON empty-capture UX on Model Knowledge — separate hygiene slice or defer?
12. Slice 2 commit message says “Sprint 45” — annotate in decision log or leave as-is?
