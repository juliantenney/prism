# S80-S1 — Adjustments parameter registry + persistence contract

**Slice:** S1 (of the S80-T-007 plan)
**Status:** **COMPLETE**
**Type:** Implementation (architecture only — no parameter is live)
**Authorised by:** S80-T-006 (DECIDED) + S80-T-007 (ACCEPTED)
**Date:** 2026-08-27
**Tests:** `tests/s80-s1-adjustments-parameter-registry.test.js` — 16 tests, all passing

---

## 1. What S1 delivers

S1 is the declarative substrate for typed Adjustments parameters. It deliberately
ships **no live parameter**: the registry is empty, so nothing is model-visible.
Topic (S2), Duration (S5), Audience (S6) and assessment parameters (S7) remain
unimplemented.

| Delivered | Not delivered (later slices) |
| --------- | ---------------------------- |
| Declaration contract + validation | Any concrete parameter declaration |
| Value coercion/validation per type | Runtime projection into prompts |
| `resolveEffectiveRunContext(wf)` resolver | Adjustments UI for parameters (S4) |
| `workflow.adjustments` persistence shape | Capability resolvers (S7) |
| Registry-is-prompt-neutral guarantee | D1/D2/D3 defect repairs |

---

## 2. Parameter registry architecture

Location: `app.js`, section header *"Sprint 80 S1 — Adjustments: typed
workflow-parameter registry + resolver"*, immediately above `normalizeWorkflowForV1`.

The registry is an **explicit allowlist**, not a projection of the historical
44-key brief-factor vocabulary or the retired 41-control Settings catalogue. It is
literally `var ADJUSTMENTS_PARAMETER_REGISTRY = [];`.

### Declaration shape

| Field | Required | Purpose |
| ----- | -------- | ------- |
| `id` | yes | lower_snake_case identifier; also the persistence key |
| `label` | yes | user-facing name |
| `help` / `description` | no | UI help text |
| `type` | yes | `text` \| `number` \| `enum` |
| `options` | enum only | allowed values (`{value,label}` or scalar shorthand) |
| `min` / `max` | number only | inclusive bounds; `min <= max` enforced |
| `applicability` | no | `{always:true}` (default) or `{requiresCapability:"…"}` |
| `owner` | yes | the single stage/point that interprets the value |
| `projection` | yes | `workflowContext` \| `stepScoped` |
| `validate` | no | extra predicate, `(value) => boolean \| {ok,error}` |
| `resolveCommissioned` | no | read-only commissioned fallback reader |

`validateAdjustmentsParameterDeclaration(raw)` returns `{ok, errors[]}` so failures
are specific and assertable. `normalizeAdjustmentsParameterDeclaration(raw)` returns
`null` for any invalid declaration — a malformed parameter cannot enter the registry.

### Extensibility test (T-007 §4)

Adding a future parameter requires: declare the row → pick `type`/`options` →
name the `owner` → pick one of the two shared `projection` strategies → add a test.
Because projection strategies are shared, no unrelated prompt or stage is edited.

### Applicability fails closed

`requiresCapability` consults `ADJUSTMENTS_CAPABILITY_RESOLVERS`, which is empty in
S1. An unregistered capability therefore resolves to **not applicable**, so a
capability-gated parameter can never be silently exposed before S7 registers the
detector.

---

## 3. Resolver architecture

`resolveEffectiveRunContext(wf)` returns:

```
{ version: 1, parameters: { <id>: <value> }, provenance: { <id>: <source> } }
```

Precedence per declared, applicable parameter:

1. explicit stored value that passes `validateAdjustmentsParameterValue` → `"adjustment"`
2. otherwise `declaration.resolveCommissioned(wf)` if it yields a value → `"commissioned"`
3. otherwise no entry in `parameters` → `"absent"`
4. not applicable to this workflow → `"not_applicable"`

Guarantees, each covered by a test:

- **No AI, no fetch.** Purely synchronous field reads; the test harness records
  every `fetch` and asserts zero calls.
- **No mutation.** The workflow record is byte-identical before/after (JSON
  compare), so `resolvedFactors` and `resolvedSources` are untouched.
- **No `[PRISM_STEP_PARAMS]` write.** The persisted record contains no step-param
  block anywhere.
- **Provenance preserved.** Author intent and commissioned fallback are
  distinguishable, which is exactly what T-005 §6 required.

An invalid stored value does **not** defeat the commissioned fallback — it is
ignored and provenance reports `"commissioned"`, so a corrupt value can never make
a workflow behave as though the author chose something.

---

## 4. Persistence implementation

Shape, exactly as specified:

```
workflow.adjustments = { version: 1, parameters: { … } }
```

Rules:

- **Absence means Auto.** No `"AUTO"` sentinel was needed; the repository imposed
  no constraint that made absence impossible.
- **Empty is omitted, not stored.** `normalizeWorkflowAdjustments` returns `null`
  when nothing explicit remains, and `normalizeWorkflowForV1` then `delete`s the
  key. A workflow with no Adjustments keeps its existing serialized JSON exactly,
  so S1 introduces **no serialization churn** for historical records.
- **Only allowlisted keys survive.** Unknown or invalid keys are dropped during
  normalization. A retired control such as `include_examples` or
  `difficulty_profile` cannot gain authority by being written into `parameters`.
- **No migration.** Historical workflows are read as-is; nothing is inferred from
  `[PRISM_STEP_PARAMS]` or `resolvedFactors` into the new container.

### Wiring points

| Path | Behaviour |
| ---- | --------- |
| `normalizeWorkflowForV1` | normalizes/validates on load and import; drops when empty |
| `gatherWorkflowDetailFormData` | **carries the persisted record forward** |
| `handleSaveWorkflow` | persists the gathered draft unchanged |

The gather carry-forward matters: gather rebuilds the workflow draft from the DOM,
and because S1 ships no parameter editor, an un-wired gather would have silently
destroyed `workflow.adjustments` on every Save. A test asserts the carry-forward.

Duplicate and export/import both run through the same structural copy plus
`normalizeWorkflowForV1`, so they inherit the behaviour rather than needing
bespoke handling.

---

## 5. Acceptance against the S1 brief

| Requirement | Status |
| ----------- | ------ |
| Declarative registry supporting the full declaration shape | met |
| Allowlisted, not derived from the 44-factor vocabulary | met (registry is empty) |
| No parameter exposed to the live model | met |
| `resolveEffectiveRunContext(wf)` skeleton | met |
| Reads explicit values; falls back to commissioned | met |
| Preserves provenance | met (four provenance states) |
| No AI, no fetch | met (proven) |
| Does not mutate `resolvedFactors` | met (proven) |
| Does not write `[PRISM_STEP_PARAMS]` | met (proven) |
| `workflow.adjustments = {version, parameters}` | met |
| Absence means Auto, no sentinel | met |
| Survives save/reload, duplicate, export/import | met |
| Old workflows load normally | met |
| No speculative complexity | met (no framework, no reactive graph) |

---

## 6. Architectural debt recorded (not fixed)

| Item | Note |
| ---- | ---- |
| Capability resolution absent | `requiresCapability` fails closed until S7 registers a resolver. Intentional. |
| No parameter editor | Parameters are only editable programmatically until S4. Values persist correctly meanwhile. |
| `handleSaveWorkflow` bypasses `normalizeWorkflowForV1` | Pre-existing. The gather path normalizes the carried record, so S1 is safe, but Save-path normalization remains inconsistent with load-path normalization. |
