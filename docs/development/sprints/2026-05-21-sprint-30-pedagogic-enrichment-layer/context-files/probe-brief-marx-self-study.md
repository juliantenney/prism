# Probe P30-01 — Marx self-study page

**Catalogue:** [`../workflow-probe-catalogue.md`](../workflow-probe-catalogue.md)

---

## Brief text

| Field | Value |
|-------|--------|
| **Goal** | Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts. |
| **Inputs** | Undergraduate (self-directed study) |
| **Desired outputs** | Learner-facing page |
| **Domains** | learning-design |

---

## Expected resolution

| Factor | Expected |
|--------|----------|
| `delivery_context` | `self_directed` |
| `delivery_pattern` | not `face_to_face` |
| `learning_environments` | not `classroom` alone |
| `session_materials` | includes `page` |
| `activities_required` | true (implicit from goal) |

---

## Expected workflow topology (minimum)

```
Normalize Content (optional)
→ Model Knowledge
→ Define Learning Outcomes
→ Design Learning Activities
→ Generate Activity Materials
→ [Generate Assessment Items if assessment_required]
→ Design Page
```

---

## Known quality gaps (pre–30-1)

From [`../../../../hotfix-marx-self-study-design-quality-investigation.md`](../../../../hotfix-marx-self-study-design-quality-investigation.md):

- Activity 2: redundant task cards + table
- Activity 3: comparison before orienting prose
- Activity 4: checklist overload
- A1: timeline source order vs sequencing task (hotfix scaffold — verify live)

---

## Sprint 30 targets (30-1)

- [ ] Every activity has topic-specific `activity_preamble`
- [ ] Page-level or sectional `study_orientation`
- [ ] `intellectual_coherence_bridge` between activities where useful
- [ ] No facilitator_moves in learner-facing output

---

## Tests

- `tests/workflow-self-directed-activity-framing-adoption.test.js`
- `tests/utility-marx-page-render.test.js` (when page fixture updated)

---

## Live capture

Save run notes to: `context-files/probe-p30-01-marx-live.md` (create on first live run)
