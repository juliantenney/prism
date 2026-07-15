# Manual mental_model_building transfer test — handoff

**Purpose:** First live validation of the `mental_model_building` MVP contract (thermostat fixture).  
**Status (2026-07-15):** MVP **ready to run** — transfer result **NOT STARTED / not PASS** until a live GAM body is evaluated.

**Methodological guardrail:** Do **not** diagnose archetype quality until delivery-path integrity is verified. A run with routing absent from the Copy prompt is **invalid**, not an archetype-quality failure.

**Opt-in token (required):** `S59_MENTAL_MODEL_TEST`  
**Do not** also enable `S59_MECHANISM_TEST` or `S59_PROCESS_TEST` (any two → fail closed).

---

## Success / failure classes (keep separate)

| Class | Meaning |
| ----- | ------- |
| contract generation failure | DLA missing archetype fields |
| contract persistence failure | stamp / capture lost plan |
| routing or delivery failure | rule absent from `__PRISM_S59_FINAL_GAM_PROMPT` |
| relationship-integration failure | definitions/parts list only |
| single-state explanation only | one contrast state only |
| constraint mentioned but not applied | capacity named but unused |
| contrasting outcome asserted without model-based reasoning | answer asserted without shared model |

Live transfer criterion (only after delivery OK):

```text
relationships integrated
→ normal state explained
→ governing constraint applied
→ contrasting state explained
```

Expected learner inference from the same model:

```text
mild cold → feedback cycling maintains the room near the set point
extreme cold → heat loss may exceed heater capacity → heater remains on → set point may not be reached
```

Do **not** claim PASS until a captured GAM body shows this.

---

## Runtime cache-bust (required)

Hard-reload:

```text
lib/ld-instructional-archetype.js?v=20260715-5
lib/workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1
app.js?v=20260715-s59-mental-1
```

```js
console.log({
  archetype: window.PRISM_LD_INSTRUCTIONAL_ARCHETYPE?.SCRIPT_VERSION,
  scripts: Array.from(document.scripts).map(s => s.src).filter(Boolean)
    .filter(s => /archetype|recognition|app\.js/.test(s))
});
// archetype SCRIPT_VERSION must be "20260715-5"
```

---

## Designated material

| Field | Value |
| ----- | ----- |
| `activity_id` | `A3` |
| `material_id` | `A3-M1` |
| `material_type` | `modelling_note` |
| `instructional_archetype` | `mental_model_building` |

Fixture plan (no `parts`, no `predicted_effect`):

```json
{
  "instructional_archetype": "mental_model_building",
  "archetype_plan": {
    "system": "a room heated by a thermostat-controlled heater",
    "key_relationships": [
      "the thermostat compares room temperature with the set point",
      "the heater switches on when the room is below the set point and off when it reaches it",
      "the room continually loses heat to colder surroundings"
    ],
    "governing_constraint": "the heater has a finite heating capacity",
    "contrast": {
      "state_a": "the outside temperature is mildly cold",
      "state_b": "the outside temperature becomes extremely cold"
    }
  }
}
```

---

## 1. Activation gate (before DLA)

```js
window.__PRISM_S59_MECHANISM_TEST = false;
window.__PRISM_S59_PROCESS_TEST = false;
window.__PRISM_S59_MENTAL_MODEL_TEST = false;

window.__PRISM_TEST_API.resolveS59DlaTestActivation({
  goal: document.querySelector('#workflowGoal')?.value || ''
});
console.log(window.__PRISM_S59_DLA_TEST_ACTIVATION);
```

Pass:

```json
{
  "selected_dla_test": "mental_model",
  "mental_model_requested": true,
  "conflict": false,
  "loaded_archetype_script_version": "20260715-5"
}
```

Workflow goal must include:

```text
S59_MENTAL_MODEL_TEST
```

---

## 2. DLA emission / persistence

Open **Design Learning Activities** Copy/prompt.

**MUST contain:**

```text
LD-INSTRUCTIONAL-ARCHETYPE-DLA-MENTAL-MODEL-TEST
S59_MENTAL_MODEL_TEST is active
"instructional_archetype": "mental_model_building"
thermostat-controlled heater
```

After DLA capture / stamp:

```js
console.log(window.__PRISM_S59_MENTAL_MODEL_TEST_STAMP);
```

Expect `material_id: "A3-M1"`, complete `archetype_plan` unchanged (no `predicted_effect`).

---

## 3. Delivery integrity (before quality)

Hard-reload if needed. Select **Generate Activity Materials** → **Copy**.

```js
const snap = window.__PRISM_S59_FINAL_GAM_PROMPT;
const p = snap?.prompt || "";
({
  snapshotExists: Boolean(snap),
  hasRouting: /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(p),
  hasMentalSelection: p.includes(
    "Selected rule ids for this request: mental_model_building"
  ),
  hasMentalRule: p.includes(
    "Build a coherent account of the named system using the supplied relationships and governing constraint"
  ),
  hasThermostatSystem: p.includes(
    "a room heated by a thermostat-controlled heater"
  ),
  hasConstraint: p.includes("finite heating capacity"),
  hasStateA: p.includes("mildly cold"),
  hasStateB: p.includes("extremely cold"),
  contains_mental_model_rule: snap?.contains_mental_model_rule,
  contains_thermostat_fixture: snap?.contains_thermostat_fixture
})
```

**All must be true.** If any routing field is false → **invalid run** (delivery failure). Do not judge instructional quality.

Canonical recognition: Copy path uses `buildWorkflowStepRecognitionContext` (do not regress).

---

## 4. Live quality evaluation (only after step 3 passes)

Paste into Copilot, generate materials, evaluate A3-M1 body against transfer criterion above. Keep failure classes separate. Do not mark sprint status **PASS** until that evaluation is done and documented.
