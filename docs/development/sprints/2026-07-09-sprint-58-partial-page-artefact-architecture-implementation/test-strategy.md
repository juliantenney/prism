# Test Strategy — Sprint 58

## Principles

- **Deterministic assembly** must be fully unit-tested — no LLM in loop.
- **Prompt assembly** tested via string assertions on `buildWorkflowStepInstructions` output.
- **Partial validation** tested with minimal valid/invalid fixtures.
- **Legacy regression** via workflow flag fixtures.
- Human Copilot output quality remains **out of scope** for automated gates.

---

## New test files

### `tests/page-vnext-assemble.test.js`

| Case | Assert |
| ---- | ------ |
| EP shell only | Minimal page structure |
| EP + DLA partial | Activities overlay by `activity_id` |
| EP + DLA + GAM | Materials attached; DLA fields preserved |
| Unknown GAM `activity_id` | Assembly error |
| EP + LS partial | `learning_sequence` on assembled page |
| EP + DP partial | `page_synthesis` / sections present |
| Full chain | Matches monolithic fixture (semantic equivalence) |
| `mergeAssemblyState` | `enriched_by` union correct |
| Render smoke | `buildUtilityStructuredHtmlForTest` succeeds |

### `tests/page-partial-capture-validate.test.js`

| Case | Assert |
| ---- | ------ |
| Partial DLA without `title` | Valid |
| Partial DLA with `materials[].body` | Invalid |
| Partial GAM materials-only activities | Valid |
| Partial GAM with full page top-level | Valid or warn per policy |
| Partial LS without `activities` | Valid |
| Partial DP without `activities` | Valid |
| EP full shell | Existing `validatePageShellAgainstVNextSchema` |

### `tests/page-prompt-no-upstream-injection.test.js`

| Case | Assert |
| ---- | ------ |
| DLA Copy prompt | No `### Upstream page shell` fenced JSON |
| GAM Copy prompt | No `### Upstream DLA page` fenced JSON |
| LS Copy prompt | No `### Upstream GAM page` fenced JSON |
| DP Copy prompt | No `### Upstream Learning Sequence page` fenced JSON |
| Binding list present | Step names only, no capture body |
| Legacy workflow (`partialPageOutputs: false`, v2 off) | Compose injection unchanged |

---

## Updated test files

| File | Changes |
| ---- | ------- |
| `page-gam-enrich.test.js` | Remove upstream embed assertions; add partial contract strings |
| `page-learning-sequence-enrich.test.js` | Same |
| `page-design-page-enrich.test.js` | Same |
| `page-dla-enrich.test.js` | Add partial validation cases |
| `page-render-vnext-adapter.test.js` | Assembled page render case |
| `workflow-ld-episode-plan-step.test.js` | EP unchanged — regression |

---

## Fixtures

```
tests/fixtures/page-assemble/
  ep-shell.json
  dla-partial.json
  gam-partial.json
  ls-partial.json
  dp-partial.json
  assembled-expected.json
```

Derive from existing `page-gam-enrich` / `page-shell-create` test builders where possible.

---

## Manual test plan (human)

1. Run LD workflow in PRISM Run mode.
2. Copy EP prompt → paste shell into EP `runStepOutput`.
3. Copy DLA prompt → paste partial into DLA `runStepOutput` (no EP JSON in prompt).
4. Repeat GAM, LS, DP.
5. Trigger assemble + render (Utilities or future workflow action).
6. Visual review HTML.

---

## Regression scope

Full suite: `node --test tests/*.test.js`

Priority subsets during development:

```bash
node --test tests/page-vnext-assemble.test.js
node --test tests/page-partial-capture-validate.test.js
node --test tests/page-prompt-no-upstream-injection.test.js
node --test tests/page-gam-enrich.test.js
```

---

## External audit (unchanged from 56F)

Post-run instructional quality audit remains human/external — not Sprint 58 automated scope.
