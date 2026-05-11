# PRISM End-of-Session Protocol

## Purpose

This protocol defines how to close a PRISM work session so continuity is preserved without carrying unnecessary conversational baggage.

It supports:

- preventing architectural drift
- preserving continuity
- maintaining coherent bounded chats
- supporting long-horizon AI-assisted development

---

## When to End a Chat

A chat should usually end when one or more of the following applies:

- an architectural milestone is reached
- a coherent commit/check-in boundary is reached
- context entropy is increasing (too many threads in one chat)
- the current bounded task is complete

A chat is a bounded architectural working context, not permanent conversational history.

---

## End-of-Session Workflow

1. Review completed work
2. Update relevant docs
3. Update `current-state.md`
4. Record important decisions
5. Run checkin checklist
6. Perform verification/smoke-check if needed
7. Check in coherent changes
8. Generate session handover
9. Generate next-chat bootstrap prompt
10. Define next bounded task
11. Prepare bounded context pack

---

## Continuity Rules

- preserve architectural continuity, not full conversation history
- avoid carrying unnecessary implementation archaeology into new chats
- keep next chats tightly scoped
- avoid omnibus chats covering unrelated redesigns
- prepare the context pack only after the next bounded task is known

---

## Cursor Responsibilities

Cursor should help:

- review changed files
- summarise changes
- identify architectural implications
- suggest docs needing updates
- generate handover summaries
- generate bootstrap prompts
- identify likely next focus areas

---

## ChatGPT Responsibilities

ChatGPT should help:

- architectural reasoning
- conceptual synthesis
- workflow semantics
- critique
- continuity interpretation
- strategic prioritisation

