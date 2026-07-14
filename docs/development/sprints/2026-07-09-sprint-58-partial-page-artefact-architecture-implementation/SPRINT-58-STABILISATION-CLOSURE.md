# Sprint 58 — Stabilisation Closure

**Date:** 2026-07-14  
**Scope:** Pre–Phase 0 stabilisation (prompt resolution + partial validation routing)  
**Status:** Complete — ready for Phase 0 Design Page partial contract

---

## Verification runs

Command:

```bash
node --test tests/sprint-58-stabilisation-e2e.test.js \
         tests/page-partial-capture-validate.test.js \
         tests/page-vnext-assemble.test.js \
         tests/workflow-ld-source-ingest-learning-content-parity.test.js
```

### 1. Video / transcript workflow (RNA viruses brief)

| Check | Result |
| ----- | ------ |
| Brief topology | **Pass** — `Normalize Content` → `Generate Learning Content` → `Model Knowledge` inserted for `provided_source_content` |
| Partial page capture (EP→DP fixtures) | **Pass** — all seven steps paste, validate, persist without gate errors |
| Assembly | **Pass** — `resolvePageForRenderOrAssembly` produces full v2 page with hydrated materials |
| Render | **Pass** — Utilities HTML export non-empty; inflation/CPI/activity content present |

**Note:** Copilot generation steps were not re-run live; fixture partial captures represent post-EP pipeline outputs after transcript-origin upstream stages complete.

### 2. Simple topic workflow (inflation / generate_from_topic)

| Check | Result |
| ----- | ------ |
| Brief topology | **Pass** — no `Normalize Content`; `Generate Learning Content` before `Model Knowledge` |
| Partial page capture | **Pass** — all steps save; DP partial accepts `page_synthesis` only (no `sections[]` in capture) |
| Assembly | **Pass** — `page_synthesis.knowledge_summary` survives assembly |
| Render | **Pass** — HTML export from synthesis-only DP partial |

---

## Stabilisation fixes shipped

| Fix | Files |
| --- | ----- |
| Normalize Content prompt factory JSON parse (transcript prompt resolution) | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Step-identity partial validation routing | `app.js` |
| Regression tests (mislabeled `assembly_state`, E2E pipeline) | `tests/page-partial-capture-validate.test.js`, `tests/sprint-58-stabilisation-e2e.test.js` |

---

## Explicit non-changes (preserved)

- Compose closure stack (`applyPageCompositionValidationForCapturedPage`)
- Rollback path (`partialPageOutputs: false`)
- Legacy compose workflow (`pageEnrichmentV2: false`)
- `LD-DESIGN-PAGE-COMPOSE-CONTRACT` on Design Page prompts (Phase 0 target)
- Renderer dual-read adapter (`page-render-normalize.js`)

---

## Next: Phase 0

Replace compose contract injection with vNext-native partial Design Page contract when `partialPageOutputs: true`. See migration plan in sprint handover context.

**Update 2026-07-14:** Phase 0 implemented — see `lib/ld-design-page-partial-contract.js` and `tests/sprint-58-phase0-design-page-partial-gates.test.js`.
