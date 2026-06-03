# 35-3 — Embedded feedback and misconception interruption exemplar

Regression fixtures demonstrating **timely self-checks** in existing fields only (no feedback engine, no schema expansion).

| Fixture | Feedback surfaces |
|---------|-------------------|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | `support_note`, template self-check bullets, `expected_output` quality signals, assessment `explanation`, `study_tips` |
| `tests/fixtures/page-render/marx-self-study-page.json` | `support_note`, template **Self-check** bullets, checklist guard on final item |

---

## support_note (Check your thinking)

```text
Check your thinking: if your sentence treats the interval like a one-off probability for this sample, revisit whether you are describing the long-run method instead.

Check your thinking: if you compare only the midpoint, revisit the quoted endpoints — overlap depends on both bounds.

Check your thinking: if your difference reads like a plot summary, revisit purpose (author aim) vs narrative events.
```

Pattern: **anticipate error → what it signals → link back to concept/procedure** (1–2 sentences).

---

## materials.template — self-check bullets (with faded table)

```markdown
### Self-check prompts
- If both interpretations sound plausible, ask whether the claim is about this one interval or the long-run method.
- Check your thinking: if your interval gets wider when n increases, revisit how standard error changes with sample size.
```

```markdown
### Self-check
- If your purpose cell could fit either work, ask which author aim is specific to that text.
- Check your thinking: a difference that only describes one book is not a comparison — name the contrast.
```

Use `### Self-check` or `### Self-check prompts` under the same `template` string as the table — no new material type.

---

## materials.checklist — one inline guard

```text
Provide final judgement — if you cannot cite one factory detail, revisit the scenario
```

---

## expected_output (quality signals, not answers)

```text
Both tables completed with defensible Yes/No judgements and brief reasons a peer could review — each reason links procedure to meaning, not only Yes/No labels.

A brief explanation (about 150–250 words) that uses checklist terms, cites one scenario detail, and ends with a defensible judgement — not generic definitions only.
```

---

## Formative assessment explanation

```json
"explanation": "If you rejected H0 because the p-value \"proves\" the effect is large, revisit practical significance — p-value addresses evidence against H0, not effect size."
```

One sentence: **error pattern + correction cue** — not a worked solution.

---

## study_tips

```markdown
- Check your thinking: confusing one-interval probability with the long-run method is the most common slip — name which claim type you are judging before filling each row.
```

---

## Avoid

| Avoid | Why |
|-------|-----|
| Full table pre-filled in faded activity | Answer dump (35-2) |
| Adaptive “if wrong, go to section B” | No branching engine |
| Long explanation paragraphs in MCQ | Tutoring loop |
| Hidden remediation pathways | Not in scope |

---

## Prompt contract

Auto-applied block: **Embedded feedback and misconception interruption (auto-applied)** on self-directed DLA, GAM, Design Page, and assessment producer — same adoption path as 35-1 and 35-2.

Domain reference: `domain-learning-design-prompt-rules.md` §6d.
