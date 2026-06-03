# 35-2 — Worked-example and faded-support exemplar

Regression fixtures demonstrating **modelled → faded → independent** using existing material keys only.

| Fixture | Progression |
|---------|-------------|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | A1 `worked_example` → A2 faded `template` (one model row) → A4 `scenario` |
| `tests/fixtures/page-render/marx-self-study-page.json` | A2 `worked_example` → A3 faded `template` → A4 scenario + checklist |

---

## required_materials (DLA specification — prefer)

```text
M1 type worked_example — one model row showing purpose/difference reasoning for Manifesto vs Kapital.
M2 type template — same table shape with Manifesto row filled; Das Kapital row empty for learner.
M3 type scenario — factory case for independent application without model row.
```

---

## materials.worked_example (modelled — show moves)

```markdown
### Worked example: one row
| Statement | Correct? | Reason |
| Method captures mean 95% of time | Yes | Describes the **sampling method** over many repeats, not a one-off probability for this interval. |

**Move to reuse:** Decide whether the sentence describes the procedure or a probability claim about one interval.
```

```markdown
### Model row: Manifesto vs Kapital
| Work | Purpose (one line) | One difference |
| Communist Manifesto | Mobilise workers for immediate political change | Short programme aimed at revolution now |

**Move:** Purpose = author aim; difference = contrast between the two works.
```

---

## materials.template (faded — partial fill only)

```markdown
| Statement | Correct? | Reason |
| 95% probability true mean lies in interval | | |
| Method captures mean 95% of time | Yes | Describes the method over repeated samples, not a one-off probability. |
```

```markdown
| Work | Purpose | One difference |
| Communist Manifesto | Mobilise workers for immediate political change | Short programme aimed at revolution now |
| Das Kapital | | |
```

---

## learner_task (paired with stage)

| Stage | Task cue |
|-------|----------|
| Modelled | Read the worked example; write one sentence naming the reasoning move. |
| Faded | Complete the **remaining empty** cells; use the modelled row as a pattern. |
| Independent | Using the scenario table only, decide … Quote endpoints (no model row). |

---

## support_note (faded / independent)

```text
Reuse the modelled move: frequentist interpretation, not single-interval probability claims.
Difference must compare the two works, not repeat the model row verbatim.
```

---

## Avoid (answer dump)

```markdown
| Statement | Correct? | Reason |
| 95% probability true mean lies in interval | No | ... |
| Method captures mean 95% of time | Yes | ... |
| 90% level is narrower | Yes | ... |
| 95% level is ... | Yes | ... |
| 99% level is ... | Yes | ... |
```
(Entire task pre-answered in materials — belongs only in dedicated worked_example, not faded template.)

---

## Renderer note

`materials.worked_example` renders inside `util-worked-example` (existing V31_4 CSS). No schema or renderer changes in 35-2.

**Single-row modelled examples:** prefer labelled prose or a short table in `materials.template` — not a full pipe table crammed into `worked_example` strings (table normalisation differs from `template`).

**Faded prompts (Marx):** list `Key Difference:` / `Second Difference:` / `Similarity:` as consecutive bullets; avoid `---` between prompt bullets (prevents `--- - Key Difference` render artefact).
