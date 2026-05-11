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
- prepare a minimal bounded context pack with only the files required for the next chat

When starting a new chat:

- provide `current-state.md`
- provide the latest handover
- provide relevant task-specific files only
- use `chat-bootstrap-template.md` to keep the new chat bounded

## Consolidation and Backlog

- `docs/consolidation/` defines current bounded consolidation sprint work.
- `docs/backlog/` captures deferred ideas/issues to avoid scope drift during active consolidation.

Keep this lightweight. Do not introduce process beyond what supports continuity and consolidation.

