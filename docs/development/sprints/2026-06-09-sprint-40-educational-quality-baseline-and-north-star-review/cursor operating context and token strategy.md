# Cursor Operating Context and Token Strategy

## Purpose

This note records a change in the operating environment surrounding PRISM development that emerged during and after Sprint 40 planning.

The purpose is to ensure future development work takes account of current limitations and avoids unnecessary consumption of Cursor resources.

---

# Current Situation

Cursor remains a valuable implementation environment for PRISM.

However, practical experience has demonstrated that:

* Large context windows can become expensive.
* Extensive exploratory discussions consume significant tokens.
* Architectural, educational and conceptual exploration may be better conducted outside Cursor.
* Cursor is most valuable when working on implementation, code generation, refactoring, debugging and focused technical tasks.

This changes how development work should be organised.

---

# Working Assumption

Educational philosophy, North Star development, learning theory exploration and high-level design reasoning do not necessarily need to occur inside Cursor.

These activities can often be undertaken more efficiently elsewhere and distilled into concise artefacts before being introduced into the implementation environment.

---

# Implications for PRISM Development

Future work should seek to preserve Cursor context and token budgets for activities where Cursor provides the greatest value.

Examples include:

* Coding
* Refactoring
* Architecture implementation
* Testing
* Debugging
* Prompt implementation
* Pipeline construction
* Documentation updates tied directly to implementation

Examples of activities that may be undertaken outside Cursor include:

* Educational philosophy development
* North Star exploration
* Learning theory discussions
* Design critiques
* Capability modelling
* Educational quality framework development
* Conceptual exploration
* Early-stage ideation

---

# Recommended Workflow

## Discovery Phase

Undertake exploratory thinking, educational design discussions and conceptual development outside Cursor.

Produce concise artefacts that capture:

* Decisions
* Principles
* Open questions
* Design implications

Store these artefacts in the documentation repository.

---

## Distillation Phase

Convert exploratory discussions into:

* Design notes
* North Star principles
* Educational quality criteria
* Architecture requirements
* Implementation tasks

---

## Cursor Phase

Bring distilled artefacts into Cursor.

Use Cursor for:

* Interpreting requirements
* Updating implementation
* Reviewing architecture
* Generating code
* Executing focused sprint work

---

# Design Principle

Do not use implementation environments as primary thinking environments when equivalent thinking can occur elsewhere.

Implementation environments should receive the outputs of discovery work rather than host all discovery work.

---

# Relationship to PRISM

This operating model aligns with an emerging PRISM principle:

> PRISM should amplify expertise rather than consume effort reproducing activities that can be performed more effectively elsewhere.

The same reasoning applies to the development process itself.

---

# Future Review

This note reflects the current operating environment and may be revised if:

* Cursor pricing changes.
* Context limitations change.
* Tooling improves.
* PRISM development workflows evolve.

The intention is not to avoid Cursor, but to use it deliberately where it provides the greatest value.
