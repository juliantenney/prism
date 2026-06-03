# 35-5 — Metacognitive closure and evaluative judgement exemplar

Concise **closure** and **judgement** prompts in existing fields — not diary reflection or adaptive coaching.

| Fixture | Closure surfaces |
|---------|------------------|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | `study_tips`, A2 ### Closure, A4 ### Debrief, `transfer_or_application_task`, assessment sub-question 5 |
| `tests/fixtures/page-render/marx-self-study-page.json` | `study_tips`, A3 ### Closure, A4 checklist closure + scenario debrief, `transfer_or_application_task` |

---

## study_tips (page end)

```markdown
- Before you finish: what changed in your understanding of interval interpretation?
- Which row or comparison was hardest to justify, and what evidence would make your conclusion more reliable?
- Where else would the procedure-vs-interval move apply (one example)?
```

```markdown
- Before submitting your factory explanation: what changed in your understanding of bourgeoisie vs proletariat?
- Where else would the purpose-and-difference table apply (one example)?
```

---

## materials — ### Closure / ### Debrief

```markdown
### Closure
- Which interpretation was hardest to justify in your table?
- What would make your Yes/No labels more reliable to a peer reviewer?
```

```markdown
### Debrief
- What changed in your understanding after judging interval statements?
- If two groups overlap, what would you need before claiming a clear difference?
- Which evidence is stronger: overlap alone or overlap plus a stated effect size?
```

---

## Cognition fields (existing keys)

```json
"self_explanation_prompt": "Before checking a row, state in one sentence which interpretation you are testing (procedure vs this interval).",
"transfer_or_application_task": "Where else would comparing interval endpoints (not midpoints) matter — name one context in one sentence."
```

One sentence each — not essay reflection.

---

## expected_output (judgement required)

```text
… interprets what overlap implies, and judges whether the evidence supports a strong conclusion — not endpoint listing alone.

… End with one sentence: which row was hardest to justify and why.
```

---

## Formative assessment — evaluative sub-question

```text
5. Which is harder to defend from this information alone — statistical significance or practical significance — and why (one sentence)?
```

---

## checklist closure items

```text
Closure: what changed in your understanding of class struggle after applying the checklist?
Closure: which checklist step had the weakest evidence — and what would strengthen it?
```

---

## Avoid

| Avoid | Why |
|-------|-----|
| “Reflect on your learning journey” | Generic filler |
| Multi-paragraph diary prompts | Not concise |
| Adaptive reflection engine | Out of scope |
| New `reflection_journal` artefact | Schema frozen |

---

## Prompt contract

Auto-applied: **Metacognitive closure and evaluative judgement (auto-applied)**.

Domain: `domain-learning-design-prompt-rules.md` §6f.
