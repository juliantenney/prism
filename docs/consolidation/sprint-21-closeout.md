# Sprint 21 — closeout (Pack-defined Step Parameter Controls)

**Date:** 2026-05-15  
**Status:** **Closed — complete for scoped Settings operability programme**  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Prior sprint:** [`sprint-20-closeout.md`](sprint-20-closeout.md) — explainability and Settings UX; **135 tests** at Sprint 20 closeout

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed

---

## Sprint summary

Sprint 21 completed the **parameterised workflow Settings front-end** for PRISM.

**Outcome:**

- Pack-defined `stepParams` are now **first-class editable Settings controls**
- Runtime rendering is **generic and metadata-driven**
- Workflow-mode Prompt Factory is now **deterministic and editor-oriented**
- Prompt authority is **unambiguous**
- Generated workflow context is **inspectable but not editable**

Sprint 21 is the **completion of the parameterised workflow front-end model**, not a new synthesis architecture. Brief elicitation, essentials gating, advisory adequacy, and pack-driven policy interpreters were preserved.

---

## Completed slices

### Slice 21-1

- Parameter metadata contract (`workflowBriefConfig.stepParameterControls`)
- Generic Settings renderer (one code path per `controlType`)
- Persistence through `[PRISM_STEP_PARAMS]` (`upsertWorkflowStepParamBlock`)
- LD pilot controls (five initial entries)
- Prompt Factory workflow-mode UX clarification (hierarchy: parameters → draft → context)

**Closeout:** [`slice-21-1-closeout.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/slice-21-1-closeout.md)

### Slice 21-2

- Visibility (`visible: false` — excluded from render; hidden keys still own `userOptions` dedupe)
- Basic / advanced grouping (`<details>`; advanced collapsed by default)
- Optional `group` section labels
- Metadata-driven summary labels (`resolveWorkflowSettingsParamLabel`)
- Broader LD pilot coverage (+2 controls → **7** total)

**Charter:** [`slice-21-2-charter.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/slice-21-2-charter.md)

### Workflow-mode Prompt Factory simplification

Progressive UX passes (documented in sprint [`review-log.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/review-log.md)):

- Hierarchy and labelling (Editable Prompt Draft, read-only workflow context)
- On-demand refinement polish (later **superseded** by final simplification)
- Read-only provenance document block + **Copy context**
- **Final:** removed conversational refinement from workflow mode; removed **New brief** / **Refine manually**

**Workflow mode now contains only:**

1. Workflow parameters  
2. Editable prompt draft  
3. Save to step  
4. Workflow context (collapsed, read-only provenance)

**Standalone Prompt Factory** retains full conversational refinement and authoring flows.

---

## Final metadata contract

**Location:** `workflowBriefConfig.stepParameterControls[]` on domain packs (LD pilot implemented).

| Field | Role |
|-------|------|
| `key` | Leaf `stepParams` name |
| `canonicalStepId` | Step pattern id (e.g. `step_design_page`) |
| `label` | Settings control label |
| `description` | Helper text under control |
| `controlType` | Renderer branch |
| `default` | Value when absent from persisted notes |
| `options` | Choice list for `select` (`{ value, label? }[]`) |
| `visible` | `false` omits control from render (persisted values untouched) |
| `advanced` | `true` → Advanced group; collapsed by default |
| `elicitation` | `elicited` \| `settings-only` (documentary tier; no new blocking elicitation) |
| `group` | Optional section label (fallback: Basic / Advanced workflow parameters) |

**Supported control types:**

- `select`
- `boolean`
- `number`
- `text`

**Runtime rules:**

- Render by `controlType` and metadata only — **no per-param-key UI branches**
- Pack controls render **before** `promptFactory.configurationMode` gate
- `userOptions` deduped when pack owns the same `key`

---

## Runtime behaviour now supported

| Capability | State after Sprint 21 |
|------------|------------------------|
| Generic pack-defined Settings controls | Yes — LD pilot |
| Grouped parameter rendering | Basic / Advanced + optional `group` |
| Hidden controls | `visible: false` filtered from render |
| Settings persistence | `[PRISM_STEP_PARAMS]` block unchanged contract |
| Step-level prompt overrides | Editable draft + Save to step |
| Metadata-driven summaries | Pack `label` with hard-coded fallback |
| Workflow-mode prompt editing | Single authoritative draft surface |
| Read-only workflow provenance/context | Document block + Copy context |

---

## Preserved architecture

| Area | Sprint 21 touch |
|------|-----------------|
| Lightweight elicitation | **Preserved** — no new blocking questions |
| Essentials gating | **Preserved** — blocking when unsafe / incomplete |
| Advisory adequacy | **Preserved** — interpreters unchanged |
| Synthesis | **No redesign** |
| `applyWorkflowBriefMappings` | **No redesign** |
| Provenance model | **No redesign** — Settings override relabelling deferred |
| Research pack | **Frozen** — no changes |
| Wizard / post-gen profile | **No regression** — required tiers unchanged |

---

## Verification timeline

| Milestone | Tests |
|-----------|-------|
| Sprint 20 closeout | 135 passed |
| Slice 21-1 | 145 passed (+10) |
| Slice 21-2 + UX passes | 149 passed (+4) |
| Sprint 21 closeout | **149 passed**, 0 failed |

```bash
node --test tests/*.test.js
```

---

## Remaining deferrals

| Item | Notes |
|------|--------|
| Provenance relabelling after explicit Settings overrides | Was Slice **21-3** candidate — not implemented |
| Broader LD parameter audit / adoption | Seven pilot controls only |
| Research pack adoption | Frozen unless chartered |
| Pack validation framework | Out of scope |
| Migration away from legacy `userOptions` | Bridge/dedupe only in 21-1 |

---

## Recommended next sprint candidate

**Sprint 22** (charter choice — do not implement without explicit scope):

1. **Provenance alignment** for explicit Settings overrides (complete deferred 21-3 intent), **or**
2. **Parameter audit / adoption expansion** (broader LD surface, pack-centred audit)

See [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) for audit questions.

---

## Key files (implementation)

| File | Role |
|------|------|
| `app.js` | Generic renderer, grouping, workflow-mode PF UX, persistence hooks |
| `index.html` | Workflow context document host, PF structure |
| `style.css` | Workflow-mode layout and provenance styling |
| `domains/learning-design/domain-learning-design-step-patterns.md` | LD `stepParameterControls` |
| `tests/workflow-step-parameter-controls.test.js` | Metadata + render contract tests |

---

## References

| Document | Role |
|----------|------|
| [`sprint-21-index.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/sprint-21-index.md) | Sprint pack index |
| [`review-log.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/review-log.md) | Decisions R21-001+ and implementation log |
| [`HANDOVER.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/HANDOVER.md) | Post-close handover |
| [`CURRENT-STATE.md`](../development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/CURRENT-STATE.md) | Pack snapshot after close |
| [`sprint-20-closeout.md`](sprint-20-closeout.md) | Predecessor programme |
| [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) | Why parameters matter |
