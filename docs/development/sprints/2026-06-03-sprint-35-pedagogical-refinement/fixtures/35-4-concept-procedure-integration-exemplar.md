# 35-4 — Concept/procedure integration exemplar

Pair **procedural moves with conceptual purpose** using existing fields only.

| Fixture | Integration surfaces |
|---------|---------------------|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | `knowledge_summary`, `worked_example`, `template`, `learner_task`, `expected_output`, assessment stem |
| `tests/fixtures/page-render/marx-self-study-page.json` | `knowledge_summary.use_in_activities`, `worked_example`, `template`, `checklist`, `expected_output` |

---

## knowledge_summary — preview (not full theory dump)

```text
… links sample spread to interval width (compute standard error → estimates uncertainty from sampling variation).

**In activities:** judge statements (procedure vs one-interval probability); compare interval endpoints (overlap depends on bounds, not midpoints only).
```

```json
"use_in_activities": "Compare texts using purpose-and-difference moves; apply class struggle and alienation to the factory scenario."
```

One line per idea on **how** the concept shows up in the procedure — do not paste the whole summary into each activity.

---

## Step → meaning (template / worked_example / checklist)

```markdown
### Step → meaning
- Judge Correct? → separates claims about the **long-run method** from claims about **this one interval**.
- Fill Purpose → states the author's aim (what the text tries to do), not plot events.
- Quote endpoints → overlap depends on bounds, not midpoints only.
```

```text
Identify capitalism → names the economic system in the case
Describe bourgeoisie → who controls production in this factory
```

---

## Use this when…

```markdown
### Use this when…
- The sentence mentions "95%" but you are unsure **which** interpretation applies → use the procedure-vs-interval move before filling Correct?.
- Your difference could describe only one book → you have not yet compared the two works.
```

---

## learner_task + expected_output (result + interpretation)

```text
learner_task: … decide … overlap; explain what overlap would mean for comparing the groups. Quote both endpoints.

expected_output: … quotes both intervals, states narrow/wider and overlap, and interprets what overlap implies — not endpoint listing alone.
```

---

## Formative assessment — why, not only what

```text
3. Why is comparing the p-value to α the appropriate procedure here (one sentence)?
```

Stem sub-question requires **procedure justification**, not only the decision label.

---

## Avoid

| Avoid | Why |
|-------|-----|
| Long theory section in `knowledge_summary` | Concise preview only |
| Whole summary copied into `materials` | Duplication |
| Checklist without purpose (`Identify capitalism` only) | Mechanical procedure |
| Concept label with no learner action | 35-1 rhetoric |

---

## Prompt contract

Auto-applied: **Concept/procedure integration (auto-applied)** on self-directed DLA, GAM, Design Page, assessment producer.

Domain: `domain-learning-design-prompt-rules.md` §6e.
