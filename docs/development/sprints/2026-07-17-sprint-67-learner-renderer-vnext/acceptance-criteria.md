# Sprint 67 — Acceptance Criteria

## Golden fixture (heteroscedasticity)

Primary fixture: `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

### Activity order

```text
A1, A2, A3, A4, A5
```

### Content integrity

* Every material ID renders exactly once.  
* Every numbered learner-task step renders exactly once.  
* Every `expected_output` renders exactly once.  
* Every checklist renders exactly once.  
* No empty `.util-beat-section`.  
* No source schema labels as learner headings (e.g. raw `check_understanding`).

### Critical order

```text
A2-M3 before A2-M2
A5-M8 before A5-M7
```

### Associations (material → learner label)

```text
A1-M1 → Understand
A1-M2 → Check your work
A1-M3 → Check your work
A2-M1 → See it modelled
A2-M3 → Your turn
A2-M2 → Your turn
A4-M1 → Understand
A4-M2 → Understand
A4-M3 → Your turn
A5-M4 → Your turn
A5-M5 → Your turn
A5-M8 → Apply elsewhere
A5-M7 → Apply elsewhere
```

### Empty-beat behaviour

* A3/A4 empty orientations omitted from HTML (may appear only as validation warnings).  
* Non-empty rendered beat counts: A1=3, A2=4, A3=3, A4=3, A5=4 (model/HTML).

### Architecture

vNext production sources must not contain:

```text
scoreClauseForBeat
scoreMaterialForBeat
chooseSinkBeatIndex
earliestStepMention
resolveBeatMaterialPlan
orderedMaterialKeysRendered
checklistRendered
insertExpectedOutputGuidanceBeforeChecklist
```

Nor activity-specific branches such as `if (activityId === "A1")`.

### Feature flag

* `rendererVersion: "legacy"` remains default.  
* `rendererVersion: "vnext"` produces only vNext HTML (no mixed path).

### Human review

* At least one human walk of the heteroscedasticity vNext export confirms coherent beat structure and no empty wrappers.
