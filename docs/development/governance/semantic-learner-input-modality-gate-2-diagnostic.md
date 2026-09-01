# Semantic learner input modality — Gate 2 diagnostic

**Status:** **COMPLETE** (2026-09-01)  
**Mode:** Diagnostic only — no production UI implemented  
**Sprint record:** [S82-T-001](../sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md)  
**Prerequisite:** [Gate 1](semantic-learner-input-modality-gate-1.md) — COMPLETE  

---

## Question

What is the smallest appropriate learner interaction for `surfaceKind: text_entry` + `inputModality: math`?

---

## Critical renderer finding

`ResponsePart.inputModality` is set at composition but **lost** at `workspaceFromResponsePart()` because `WorkspaceRequirement` does not carry it. `renderLearnerWorkspace()` therefore renders all `text_entry` workspaces as identical plain textareas.

**Gate 2 seam:**

```text
ResponsePart.inputModality
  → WorkspaceRequirement.inputModality
  → renderLearnerWorkspace() / DOM / PE runtime
```

---

## Persistence finding

Existing draft persistence is **TeX/string-compatible**. No schema migration.

```json
{ "kind": "text_entry", "value": { "text": "<opaque string>" } }
```

Learner TeX is **untrusted**. Never route through Markdown emphasis transforms (see S78-T-033).

---

## Live Lagrangian commissioning shape

- Structured multi-part template (M4)  
- ~4–10 labelled fields per derivation activity  
- Predominantly one mathematical artefact per maths-labelled field  
- Rich mixed prose+math **not** evidenced as requirement  

---

## Maths infrastructure (repository state)

| Component | State |
| --------- | ----- |
| MathJax 3.2.2 | Display for authored content; CDN on export/preview |
| TeX delimiters | `\(...\)`, `\[...\]` per LD-MATH-RENDER |
| Maths editor | **None installed** |
| MathLive / MathQuill | Parked since Sprint 78; not in `package.json` |

Display renderer and learner editor are **separate concerns**.

---

## Diagnostic treatment recommendation (preliminary — not final)

**Enhanced existing textarea:**

- Propagate `inputModality` to workspace/DOM  
- Keep canonical `<textarea>`  
- Bounded symbol-insert toolbar  
- On-blur MathJax preview (not live)  
- Monospace/hint for TeX mode  
- Native textarea fallback on PE failure  

**Classification:** Gate 2B implementation likely **B — MODERATE / BOUNDED**.

---

## Open decision — Gate 2A required

The preliminary recommendation may assume too much **TeX literacy**. Sprint 82 **S82-G2A** must spike **MathLive** to test whether visual construction without TeX expertise is required before accepting the treatment.

**Outcomes:** GO MathLive · GO enhanced textarea · STOP / reassess.

See [S82-G2A](../sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/S82-G2A-mathlive-interaction-spike.md).

---

## What Gate 2 did not authorise

- Production maths UI  
- Persistence changes  
- New `surfaceKind`  
- Table maths  
- Rich mixed editor  

---

## Propagation trace (target state after G2B)

```
ResponsePart.inputModality
  → WorkspaceRequirement.inputModality
  → renderLearnerWorkspace() branch
  → data-input-modality="math"
  → enhancement runtime (MathLive or toolbar+preview)
  → textarea.value → text_entry persistence (unchanged)
```
