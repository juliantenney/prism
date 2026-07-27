# Sprint 70 Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Prompt builder drift from VEU reference | inconsistent author experience vs existing Copilot workflow | golden tests from Sprint 38 fixtures; cross-check against `scripts/build-veu-v121-json.js` |
| Hook matching failures (hybrid/legacy mode) | figures in wrong location or missing | authoritative mode first; explicit handover_mode in manifest; fixture tests per mode |
| Asset storage security (path traversal, oversized uploads) | data integrity / XSS via filenames | sanitise filenames; validate MIME/size; store outside web root until export |
| UI scope creep (image editing, batch gen) | sprint slip | enforce non-goals; defer to future work list |
| Export incomplete when jobs pending | broken learner packages | define block-vs-partial policy in DECISIONS; manifest `export_status` |
| Renderer regression from HTML mutation | certification failure | run certification after assembler; do not change vNext render path for base HTML |
| Filename collisions | overwritten assets | affordance_id-based names; assert uniqueness at job creation |
| Browser storage limits | large PNG uploads fail | document size limits; prefer workflow-scoped filesystem if available |

## Explicit non-risk assumptions

- Image generation quality is author responsibility (external tools).
- Sprint 38 affordance schema (`38.4`) is stable for Sprint 70.
- Linked `media/` export is acceptable for all current deployment targets.
