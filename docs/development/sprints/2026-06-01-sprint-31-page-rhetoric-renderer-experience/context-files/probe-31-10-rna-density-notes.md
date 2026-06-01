# Probe 31-10 — RNA / kitchen-sink density (Slice 31-5)

**Date:** 2026-06-01  
**Fixtures:** `ld-rna-hcv-assessment-page.json`, `renderer-kitchen-sink-page.json`, `shape-activity-echo-dedupe.json`  
**Rubric rows:** 1–5, 13–14

## Observations

- **Kitchen-sink KS-A7:** duplicate `evidence_use_prompt` / `argument_structure_hint` still renders once (framing registry).
- **Echo shape:** exact preamble/intellectual-frame echo → one block; task text never suppressed; guidance/support echoes of task omitted; `reference_text` material preserved.
- **RNA fixture:** primary task + meta fold regression smoke; materials stack when present.
- **V31_5 CSS:** tighter cue stack margins; framing→task→materials rhythm.

## Pass criteria

| Check | Result |
|-------|--------|
| Deterministic dedupe only | Pass |
| No material inference dedupe | Pass |
| Assessment section untouched | Pass |
