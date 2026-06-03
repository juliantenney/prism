# Sprint 34-4 — Golden composed page fixtures

**Date:** 2026-06-03  
**Outcome:** `node --test tests/*.test.js` → **588 pass / 0 fail** (+1 test)

## Fixture

`tests/fixtures/page-render/confidence-interval-a2-multitable-page.json`

RNA/statistics-style self-study page combining post-Sprint-33/34 renderer shapes:

| Section | Contract exercised |
|---------|-------------------|
| `overview` + `knowledge_summary` | Inline `\( \alpha \)`, block `\[ \bar{x} \pm ... \]`, `\(n = 10\)` |
| `learning_activities` A2 | String `materials.template` with **two** `###` sections + multiline tables |
| `learning_activities` A4 | Singular `materials.scenario` object with `heading` + compressed one-line pipe table |
| `assessment_check` | `question` with MathJax + intro + numbered sub-questions → `<ol>` |
| Per activity | `expected_output`, `support_note`, primary task, materials stack |

## Test

`tests/utility-page-render.test.js` — `golden composed page: confidence-interval multi-table, scenario, MathJax, assessment`

## Why this protects regressions

1. **Table leaks** — Catches `<p>| ... |</p>` if template/scenario paths bypass `renderMaterialMarkdownBlock` / `renderPlainStructuredText`.
2. **Multi-heading templates** — Regression target for Sprint 34-2 `renderTableHintHeadingSections`.
3. **Scenario headings** — `Interval Comparison` must not collapse to `Scenario 1` only.
4. **MathJax** — Delimiters must survive page render (not dollar, not stripped).
5. **Assessment markdown** — Prompt must not collapse numbered lines into one `<p>`.
6. **Learner chrome** — Task/output/support-note/material CSS classes remain on composed pages.

## `app.js` fix (real bug from golden fixture)

`utilityRestoreProtectedMathDelimiters` was restoring **both** `@@PRISMMATHBLOCKn@@` and `@@PRISMMATHINLINEn@@` from the same token index. Inline-only restore inside `utilityRenderMarkdownInline` therefore overwrote block placeholders with the first inline math span (e.g. `\(n = 10\)`), dropping `\[...\]` in knowledge-summary prose.

- Restore now accepts `{ kind: "inline" | "block" | "both" }`.
- `utilityRenderMarkdownInline` also shields `@@PRISM…@@` placeholders from underscore-emphasis rules.

Regression: `mathjax-delimiter-preservation.test.js` — block math in prose paragraph.

## Deliberately not in fixture

- Workflow generation / JSON schema validation
- Linked `activity_resources` section (covered in `utility-markdown-bullet.test.js`)
- Dollar-delimiter MathJax (out of policy)
