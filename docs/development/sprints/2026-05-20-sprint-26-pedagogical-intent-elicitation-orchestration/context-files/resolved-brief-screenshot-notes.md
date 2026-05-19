# Resolved brief — screenshot / UI notes

**Authoritative UI:** Factory workflow brief panel in `app.js` (workflow brief resolution + elicitation)  
**Why it matters:** Shows which assumptions PRISM **committed to** before workflow generation — explicit vs inferred vs defaulted.

---

## What to capture in 26-1 (from live rerun)

For the RNA virus case, record:

| Field | Resolved value | Source tag (if shown) |
|-------|----------------|------------------------|
| `input_strategy` | e.g. `provided_source_content` | explicit / inferred / default |
| `assessment_required` | true / false | |
| `page_profile` | learner / assessment / facilitator | |
| `session_materials` | includes `page`? | |
| `delivery_context` | `self_directed`? | |
| `design_scope` | lesson / session / module | |
| `learning_environments` | | |

**Screenshot placeholders (describe if no image file):**

- Resolved assumptions accordion / panel title
- Any **warnings** or **assumption chips**
- Whether **learning activities** appear as a resolved factor (today: may not exist as named factor)

---

## Known gap (investigation target)

Sprint 23 documented **`assessment_required`** as a **workflow topology** gate. There is **no symmetric `activities_required`** in pack `workflowBriefConfig` at open — activity intent may only appear as:

- free-text goal/desired outputs
- heuristic `hasIntent` regexes
- pack `whenGoalMentionsAnyOf` trigger rule lists

**26-1:** confirm whether activity intent appears anywhere in resolved JSON or only in prose fields.

---

## Related code

| Function | Path |
|----------|------|
| Factor resolution | `app.js` — `resolveWorkflowBriefFactors` (~7459) |
| Explicit extract | `app.js` — `extractWorkflowBriefExplicitFactors` (~7226) |
| UI labels | `app.js` — workflow brief panel render helpers (~3600–3900 region; search `workflowBriefResolved`) |

See [`brief-resolution-ui-notes.md`](brief-resolution-ui-notes.md).
