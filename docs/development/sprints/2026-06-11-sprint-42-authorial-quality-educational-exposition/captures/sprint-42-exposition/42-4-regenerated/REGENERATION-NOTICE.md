# Sprint 42-4 capture notice

These captures are **not** fresh LLM workflow outputs.

- `page.json` — copy of committed/working fixture at capture time
- `page-rendered.html` — deterministic render via `buildUtilityStructuredHtmlForTest`
- `dla-prompt-snapshot.txt` / `design-page-prompt-snapshot.txt` — prompt augmentation from current `app.js` + libs
- `upstream-learning-activities.json` — existing fixture where available

**GAM / activity_materials JSON was not captured** — no separate material artefact exists for Marx/Climate; inflation upstream has empty materials arrays.

To obtain true post-42-3 workflow artefacts, run Marx / Inflation / Climate workflows in PRISM UI after loading current code and save captures manually.