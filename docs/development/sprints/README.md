# PRISM Sprint Folders

Canonical location for portable sprint restart bundles:

- `docs/development/sprints/YYYY-MM-DD-sprint-name/`

Required structure per sprint folder:

- `SPRINT-CONTEXT.md`
- `GPT-BOOTSTRAP-PROMPT.md`
- `CURRENT-STATE.md`
- `HANDOVER.md`
- `context-files/`

`context-files/` must contain copied physical snapshots of bounded sprint files (no references/symlinks), so the folder is directly portable for fresh-chat upload.

Use:

1. Open a fresh chat.
2. Upload bounded files listed in `context-files/`.
3. Upload sprint snapshot docs if useful.
4. Paste `GPT-BOOTSTRAP-PROMPT.md`.
5. Start architecture-first review before implementation edits.

Compatibility:

- Legacy `docs/development/context-packs/` artifacts are retained for history.
- New sprint transitions should use this sprint-folder workflow.

