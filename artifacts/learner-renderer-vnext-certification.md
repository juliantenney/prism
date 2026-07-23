# Learner-renderer-vNext production certification

## Certification outcome

**CERTIFIED**

- Certification version: `s68-imp-020`
- Corpus version: `s68-imp-020-v1`
- Generated at: `2026-07-23T08:29:45.575Z`
- Git revision: `3157a62d95facf39dfeed48117ac1c989b6ffdb1`

## Corpus summary

- **VideoTranscriptTest** (`videotranscripttest`): pass — activities 6, moments 19
- **Heteroscedasticity** (`heteroscedasticity`): pass — activities 5, moments 20
- **Kitchen Sink** (`kitchen-sink`): pass — activities 5, moments 20
- **RNA episode-plan-v1** (`rna-episode-plan-v1`): pass — activities 6, moments 18
- **Generic moments** (`generic-moments-new01`): pass — activities 1, moments 4
- **Authoritative PRISM ordering** (`authoritative-ordering`): pass — activities 2, moments 7

## Capability coverage

```text
text_entry: 31
table_entry: 18
ordering: 1
```

## Archetype coverage

analyse, apply, evaluate, understand

## Invariant totals

- workflows: 6
- activities: 25
- moments: 88
- beatFallbacks: 0
- materialsUnassigned: 0
- materialsDuplicated: 0
- taskStepsDuplicated: 0
- expectedOutputsMissing: 0
- expectedOutputsDuplicated: 0
- fails: 0
- warnings: 0

## Diagnostics

Catalogue size: 25; unexpected production diagnostics: 0

## Browser/Node parity

Workflows compared: 0; mismatches: 0

## Persistence

Scenarios passed: 28; failed: 0

## Accessibility

Checks passed: 31; failed: 0

## Responsive verification

Automated geometry checks are limited in Node. Manual verification: open heteroscedasticity and ordering exports at ~375px width; confirm textareas, table scroll/stack strategy, ordering controls wrap, and draft controls remain usable.

## Print verification

Automated: draft controls and ordering move/check controls are hidden in print CSS. Manual: print heteroscedasticity and ordering pages; confirm learner values remain visible and expected answers stay hidden.

## Tests

Run `node --test tests/learner-renderer-vnext-*.test.js` for package regression. IMP-020 adds certification tests.

## Known unrelated failures

- tests/workflow-self-directed-learner-page-formatting.test.js: Learning purpose section does not render expected `<ul>` list markup.
  - Evidence: Reproduces with learner-renderer-vNext IMP-019/IMP-020 changes stashed; not classified as an IMP-020 regression.

## Release recommendation

Learner-renderer-vNext is ready for production use on the certified corpus.

CERTIFIED
