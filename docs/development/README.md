# PRISM Development Docs

Use these docs to keep PRISM development coherent across Cursor, ChatGPT, commits, and new chats.

## Files

- `development-protocol.md` — overall development workflow and Cursor/ChatGPT role split
- `checkin-checklist.md` — checklist before committing coherent changes
- `current-state.md` — rolling snapshot for bootstrapping future chats
- `session-handover-template.md` — fillable template for closing a session
- `end-of-session-protocol.md` — ritual for ending a chat/session cleanly
- `chat-bootstrap-template.md` — template for preparing a new ChatGPT conversation

## Recommended Use

Before a commit:

- check `checkin-checklist.md`
- update `current-state.md`
- record decisions where needed

Before ending a chat:

- follow `end-of-session-protocol.md`
- complete `session-handover-template.md`
- prepare a new-chat prompt using `chat-bootstrap-template.md`

When starting a new chat:

- provide `current-state.md`
- provide the latest handover
- provide relevant task-specific files only
- use `chat-bootstrap-template.md` to keep the new chat bounded

Keep this lightweight. Do not introduce process beyond what supports continuity and consolidation.

