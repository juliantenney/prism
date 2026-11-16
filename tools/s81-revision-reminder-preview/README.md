# S81 revision-reminder preview utilities

Operator helpers for regenerating a local HTML preview of the Sprint 81 R4
compact revision reminder (heteroscedasticity beat-assignment page).

Automated coverage lives in `tests/s81-t-008-revision-criterion-accompaniment.test.js`.
These scripts remain for optional browser verification of sticky-nav + reminder PE.

## Generate

```bash
node tools/s81-revision-reminder-preview/regen-shell-preview.js
# or bare fragment:
node tools/s81-revision-reminder-preview/regen-bare-preview.js
```

Outputs are written under `out/` (gitignored).

## Inspect / serve

```bash
node tools/s81-revision-reminder-preview/inspect-preview.js
node tools/s81-revision-reminder-preview/serve-preview.js
```

Open the printed `http://127.0.0.1:8765/...` URL, hard-refresh, then exercise
Revise → scroll → compact reminder.
