# Heteroscedasticity interactive workflow storage

This folder holds a **production localStorage-shaped** bundle for the heteroscedasticity interactive path:

- `promptr.workflows.v1`
- `promptr.workflows.runstate.v1`

It is **not** a certification page-render golden substitute. Tests load it only through the production workflow/runstate keys and loaders.

## Provenance

Episode Plan beat functions were taken from the committed HEAD page artefact sequences that failed interactive validation with `MIXED_EPISODE_PLAN_VOCABULARY` after Phase 5B:

```text
A1 orientation → explanation → check_understanding
A2 orientation → worked_example → analysis → check_understanding
A3 orientation → worked_example → practice → reflection
A4 orientation → explanation → application → check_understanding
A5 orientation → comparison → evaluation → reflection
```

Those sequences are the same compressed Episode Plan vocabulary observed in the live interactive failure. The live browser profile used by the operator was not readable from the agent environment (Cursor browser had only a smoke-test workflow; Chrome/Edge Default LevelDB had no heteroscedasticity / `check_understanding` markers).

## Expected after persistence migration

```text
A1 orientation → explanation → verification
A2 orientation → worked_thinking → guided_practice → verification
A3 orientation → worked_thinking → guided_practice → reflection
A4 orientation → explanation → guided_practice → verification
A5 orientation → worked_judgement → guided_practice → reflection
```
