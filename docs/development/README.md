# PRISM Development Docs

Use these docs to keep PRISM development coherent across Cursor, ChatGPT, commits, and new chats.

## Files

- `development-protocol.md` — overall development workflow and Cursor/ChatGPT role split
- `checkin-checklist.md` — checklist before committing coherent changes
- `current-state.md` — rolling snapshot for bootstrapping future chats
- `session-handover-template.md` — fillable template for closing a session
- `end-of-session-protocol.md` — ritual for ending a chat/session cleanly
- `chat-bootstrap-template.md` — template for preparing a new ChatGPT conversation
- `shared-vocabulary.md` — operational shorthand and continuity phrases used across PRISM development sessions

## Recommended Use

Before a commit:

- check `checkin-checklist.md`
- update `current-state.md`
- record decisions where needed
- prepare a coherent commit/check-in message as part of continuity workflow

Before ending a chat:

- follow `end-of-session-protocol.md`
- complete `session-handover-template.md`
- prepare a new-chat prompt using `chat-bootstrap-template.md`
- prepare a sprint folder under `docs/development/sprints/YYYY-MM-DD-sprint-name/`

When starting a new chat:

- use the latest sprint folder in `docs/development/sprints/`
- upload bounded copied files from `context-files/` plus sprint snapshot docs
- paste `GPT-BOOTSTRAP-PROMPT.md`
- keep the chat architecture-first and bounded

## Sprint Folder Standard (Official)

Each sprint transition should produce one portable folder containing:

- `SPRINT-CONTEXT.md`
- `GPT-BOOTSTRAP-PROMPT.md`
- `CURRENT-STATE.md`
- `HANDOVER.md`
- `context-files/`

`context-files/` should hold copied physical snapshot files (not references/symlinks) so sprint folders are directly uploadable.

Canonical continuity sources remain in their existing locations (`current-state`, `session-handovers`, `chat-bootstraps`, `consolidation` docs). Sprint folders are operational snapshots for low-friction restart.

Legacy note:

- `context-packs` naming remains as historical artifacts from Sprint 01.
- New sprint transitions should use the sprint-folder workflow.

## Consolidation and Backlog

- `docs/consolidation/` defines current bounded consolidation sprint work.
- `docs/backlog/` captures deferred ideas/issues to avoid scope drift during active consolidation.

Keep this lightweight. Do not introduce process beyond what supports continuity and consolidation.

