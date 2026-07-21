# Sprint 67 — Rollout Strategy

## Selector

```js
renderLearnerPage(json, {
  rendererVersion: "legacy" | "vnext"
});
```

Production entry: `runUtilityPageExportPipeline` / `buildUtilityStructuredHtmlForTest` /
`renderLearnerPageForTest` (test API). Exact function names follow Utilities export wiring;
behaviour matches the selector above.

### Invalid values

Unsupported `rendererVersion` values (for example `"experimental"`) throw
`Unsupported learner renderer version: …` and do not silently select vNext.

### vNext options

When `rendererVersion` is `"vnext"`, legacy layout/planner options (for example
`sectionOrder`, `presentationMode`, journey header flags) are ignored by the vNext
HTML path. Composition validation still runs when enabled before vNext rendering.

## Browser runtime

The production browser loads the committed UMD bundle:

```text
lib/learner-renderer-vnext-browser.js
```

Script order in `index.html`: bundle **before** `app.js`.

Regenerate after vNext source changes:

```bash
npm run build:learner-renderer-vnext-browser
```

The bundle registers:

```js
window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(parsed)
```

Loading the bundle does **not** select vNext; the default remains legacy until
`rendererVersion: "vnext"` is passed explicitly.

### Utilities UI (manual review)

In the **Utilities** tab, use the **Learner renderer** dropdown:

| Option | Behaviour |
| ------ | --------- |
| **Legacy (default)** | Existing legacy HTML export |
| **vNext (Sprint 67)** | Sprint 67 model → HTML path |

Then **Preview HTML** / **Download HTML** as usual. The selection is passed through
`handleUtilitiesGenerate` → `renderUtilitiesArtefactHtmlAsync` →
`runUtilityPageExportPipeline(..., { rendererVersion })`.

M5 human review (2026-07-21): heteroscedasticity vNext export **PASS WITH MINOR FINDINGS**
— duplicate orientation markdown headings only; see [`findings-log.md`](findings-log.md).

## Defaults

| Environment | Default |
| ----------- | ------- |
| Production / normal Utilities export | `legacy` |
| Explicit opt-in / tests | `vnext` |

## Enablement criteria (all required)

1. Golden fixture automated suite green.  
2. Architecture exclusion tests green.  
3. Human review of heteroscedasticity vNext HTML recorded.  
4. No mixed legacy/vNext content in a single export.  
5. Rollback path documented (set version to `legacy`).

## Non-goals for this sprint

* Global cutover  
* Deleting legacy path  
* Silent default flip without decision log entry  

## Rollback

Any production issue → force `rendererVersion: "legacy"` and open a Sprint 67 finding; do not hotfix by reintroducing heuristics into vNext.
