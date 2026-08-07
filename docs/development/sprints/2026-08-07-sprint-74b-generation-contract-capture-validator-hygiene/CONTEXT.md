# Sprint 74B — Context

**Status:** **COMPLETE / Closed** (opened 2026-08-07; closed 2026-08-07)  
**Role:** Durable context for generation-contract & capture-validator hygiene  
**Parent:** Sprint 74 wrapper — **OPEN**; 74C **Not opened**  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Predecessor:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) — sole vNext learner export **closed**  
**Closure evidence:** [S74B-T-050](S74B-T-050-final-verification-and-sprint-closure.md)

---

## Why this sprint existed

Sprint 74B applied `S74-D07` to **generation surfaces**: prompt builders, generation contracts, capture validators, and compose / partial roles. Sprint 74A proved duplicate **ownership** inside a supported path can be as harmful as obsolete implementations.

**Pre-release Compatibility (`S74-D09` / `S74B-D03`):** Old local workflows/runstate do **not** block rationalisation. Preserve current intended functionality — not historical pre-release shapes.

---

## Definitive architecture (post-T-040, verified T-050)

```text
applyLdDesignPagePartialContractToDraft
  → external LLM capture
  → validatePagePartialCapture (fail-closed on obsolete shapes)
  → assembleVNextPageFromPartials
  → learner-renderer-vNext (Authoring export — Sprint 74A)
```

Durable facts:

- **Partial + `assembleVNextPageFromPartials`** is the **sole definitive** supported page-construction architecture ([S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture)).  
- **Full Design Page compose** (`lib/ld-design-page-compose-contract.js`) **removed** — no supported runtime ownership remains.  
- **PR-W deprecated prompt aliases** and **`buildMathSafeOutputContractPromptBlock`** **removed** from active runtime.  
- **Four legacy `{ ok: true, legacy: true }` capture-validator shims** **removed** — modern validators fail-closed.  
- **`partialPageOutputs: false`** is **obsolete** — not retained for old local state; only appears in tests exercising fail-closed behaviour.  
- Domain B hygiene targets **prompt/contract & capture-validation** — not Create Workflow redesign or the learner renderer.

Design Page partial owns title / `page_synthesis` / visual planning. Activities, materials, sequence, and assessment content are owned by upstream partials + assemble + P11a.

---

## Authoritative documents

| Document | Role |
| -------- | ---- |
| [S74B-T-010](S74B-T-010-generation-pipeline-architectural-discovery.md) | Pre-removal pipeline map |
| [S74B-T-020](S74B-T-020-compose-vs-partial-contract-role-documentation.md) | Compose vs partial role proof |
| [S74B-T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md) | Removal plan |
| [S74B-T-040](S74B-T-040-execute-evidenced-removals-evidence.md) | Implementation evidence |
| [S74B-T-050](S74B-T-050-final-verification-and-sprint-closure.md) | Acceptance / closure |

---

## Binding constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) — browser-only; static deployment; one definitive implementation (`S74-D07`); pre-release Compatibility not default (`S74-D09`).

---

## Engineering disciplines (inherited)

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) — **do not duplicate** in this pack.

---

## Deferred residue (non-blocker)

Probe scripts (`scripts/probe-*`, `tools/capture-sprint-42-4-provenance.js`) and archive copies may still reference removed compose APIs — **not active product paths**. Gate tests retain `doesNotMatch` compose markers as **intentional guards**.

---

## Out of scope (unchanged)

- Learner-renderer-vNext / Authoring export (74A closed)  
- Workflow Resources persistence  
- Prompt Library product model  
- Repository / fixture hygiene (**74C — not opened**)  
- Pedagogy redesign  
