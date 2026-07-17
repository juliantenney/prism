# Sprint 67 — Rollout Strategy

## Selector

```js
renderLearnerPage(json, {
  rendererVersion: "legacy" | "vnext"
});
```

(Exact production function name may wrap existing Utilities export; behaviour must match.)

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
