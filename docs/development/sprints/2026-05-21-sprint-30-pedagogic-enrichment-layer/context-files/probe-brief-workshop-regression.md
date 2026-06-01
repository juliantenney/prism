# Probe P30-03 — Workshop regression (facilitated)

**Purpose:** Ensure PEL / self-directed scaffolds **do not** activate on facilitated briefs.

**Catalogue:** [`../workflow-probe-catalogue.md`](../workflow-probe-catalogue.md)

---

## Brief text

| Field | Value |
|-------|--------|
| **Goal** | Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion. |
| **Inputs** | Uploaded lecture transcript on climate change. |
| **Desired outputs** | Facilitator handout and learner handout |
| **Starting artefact** | `provided_source_content` |

---

## Expected resolution (must hold)

| Factor | Expected |
|--------|----------|
| `delivery_context` | **not** `self_directed` (typically `in_person`) |
| `delivery_mode` | `live_workshop` |
| `delivery_pattern` | `face_to_face` |
| `learning_environments` | includes `classroom` |

---

## Expected prompt behaviour

| Step | Must NOT include |
|------|------------------|
| DLA | Self-directed OUTPUT CONTRACT block |
| DLA | PEL orientation_contract block (when implemented) |
| GAM | Timeline “mixed order” for sequencing (unless activity requires) |

**Must include (Sprint 28):** cognition / peer or misconception patterns as per brief — `tests/workflow-ld-cognition-contracts.test.js`

---

## Automated tests (required on every 30-x PR)

```bash
node --test tests/workflow-brief-learner-resource-defaults.test.js
node --test tests/workflow-ld-cognition-contracts.test.js
```

Workshop row: `workshop brief: keeps facilitated delivery defaults`

---

## Note on “uploaded transcript” in inputs

Transcript language must **not** alone force `self_directed` when goal contains **workshop**, **small group**, **discussion** — see `reconcileFacilitatedBriefDeliveryOverrides` in [`app-generation-hooks.md`](app-generation-hooks.md).
