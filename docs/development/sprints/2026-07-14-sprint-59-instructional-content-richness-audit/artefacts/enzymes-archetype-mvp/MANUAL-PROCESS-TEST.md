# Manual process_walkthrough transfer test — handoff

**Purpose:** Evidence whether the archetype-contract pattern transfers from `mechanism_explanation` to `process_walkthrough`.  
**Do not** treat this as a full quality rubric; score only stage-transition teaching vs collapsed numbered facts.

**Opt-in token (required):** `S59_PROCESS_TEST`  
**Do not** also enable `S59_MECHANISM_TEST` in the same run (keep one archetype under test).

Soft-reload so `lib/ld-instructional-archetype.js?v=20260714-3` is loaded.

---

## Designated material

| Field | Value |
| ----- | ----- |
| `activity_id` | `A4` |
| `material_id` | `A4-M1` |
| `material_type` | `worked_example` |
| `instructional_archetype` | `process_walkthrough` |

**Why process (not mechanism):** The job is an ordered investigation-interpretation sequence (identify → inspect → connect → conclude), not a temperature→rate causal transmission chain.

**Plan:**

```text
process_goal: interpret an enzyme reaction-rate investigation
stages:
  1. identify the manipulated condition and measured outcome
  2. inspect the pattern across observations
  3. connect the pattern to enzyme behaviour
  4. form a bounded conclusion
```

---

## How to trigger

1. Open the existing enzymes (or equivalent) workflow — do not create a new workflow.
2. Put in workflow **goal** (or title/notes):

```text
Enzymes — S59_PROCESS_TEST
```

Optional: `window.__PRISM_S59_PROCESS_TEST = true`

3. Ensure Episode Plan includes activity **A4** (or let stamp attach `A4-M1` to A4 / first activity).
4. Run **Design Learning Activities**.
5. Confirm DLA prompt contains:

```text
LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST (auto-applied)
```

6. Paste/sync DLA capture.

---

## Inspect DLA capture

In DLA step output, find `A4-M1` and confirm:

```json
"instructional_archetype": "process_walkthrough",
"archetype_plan": {
  "process_goal": "interpret an enzyme reaction-rate investigation",
  "stages": [ "...four stages..." ]
}
```

Optional: `window.__PRISM_S59_PROCESS_TEST_STAMP`

Save as:  
`artefacts/enzymes-archetype-mvp/manual-run-process-dla-capture.json`

---

## Inspect GAM routing

1. Open **Generate Activity Materials** and copy the prompt.
2. Confirm routing contains only:

```text
Selected rule ids for this request: process_walkthrough.
```

3. Confirm **no** `mechanism_explanation` / `mental_model_building` rules.
4. Console / window:

```js
window.__PRISM_S59_ARCHETYPE_ROUTING_DEBUG
```

Expect one selection: `process_walkthrough` on `A4` / `A4-M1`.

---

## Inspect generated body

GAM capture:

```text
activities[] → A4 → materials[] → A4-M1 → body
```

Score only whether each stage is taught as a transition (what happens + why it advances), not as unsupported numbered facts.

Save: `artefacts/enzymes-archetype-mvp/manual-run-process-gam-capture.json`

---

## Blockers

- Missing `S59_PROCESS_TEST` → no emission/stamp.
- No A4 and stamp falls back to first activity — note activity id in stamp debug.
- DLA not synced to runstate before GAM → no routing.
- Cache: hard-refresh if `?v=20260714-3` not loaded.
