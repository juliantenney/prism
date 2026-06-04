# Probe 39-1 — Reasoning cue audit template

**Date:** 2026-06-03  
**Slice:** 39-1 — **PENDING**  
**Authority:** [../observations/39-1-reasoning-cue-audit.md](../observations/39-1-reasoning-cue-audit.md)

Copy one block per `generate` affordance.

---

## Row template

```markdown
### {anchor} — {activity_id} — {affordance_id}

| Field | Value |
|-------|-------|
| **reasoning move** | |
| **reasoning cues currently specified** | (list fields: must_show, pedagogical_added_value, allowed_claims, …) |
| **cue specificity** | low \| medium \| high |
| **missing cue information** | |
| **anti-spoiler boundary** | (from spoiler_boundary + must_not_show) |
| **representation token** | |
| **likely failure mode** | |
| **VEU queue prompt excerpt** | (if available) |
| **Image review note** | (Pass/Fail + one sentence) |
```

---

## Priority rows (complete first)

1. **Inflation A3** — `va-A3-classification-01` / `inflation_a3_generate`  
2. **Inflation A2** — `va-A2-cpi-deflator-distinction`  
3. **CI A4** — `va-A4-interval-overlap`  
4. **Climate** — mechanism + evidence generates  
5. **Marx A3** — comparison generate  

---

## Sources

| Source | Path |
|--------|------|
| Affordance JSON | `tests/fixtures/sprint-38/affordance-records.json` |
| Page HTML/JSON | `tests/fixtures/page-render/*.json` |
| 38-1 audit | `docs/development/sprints/.../observations/38-1-visual-affordance-audit.md` |
| Live VEU output | project `enhanced-learner-page.html` + Step 1 JSON (when available) |

---

## Cue specificity rubric

| Level | Definition |
|-------|------------|
| **high** | Designer can name ≥3 perceptible cues; image brief would be unambiguous |
| **medium** | Some perceptible cues; image may default to generic layout |
| **low** | Topic/category labels only; image likely duplicates materials structure |
