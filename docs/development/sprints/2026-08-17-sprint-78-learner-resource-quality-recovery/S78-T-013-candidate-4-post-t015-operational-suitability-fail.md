# S78-T-013 Candidate 4 — post-T-015 operational suitability FAIL

**Task:** S78-T-013 exhibit  
**Status:** **RECORDED** (2026-08-17) — canonical post-T-015 negative evidence  
**Mode:** Evidence only — no implementation  
**QA:** **NOT RUN** (do not run)

Preserve as:

- GAM structural **PASS**
- WS1 observable **PASS**
- WS2 observable operand separation **PASS**
- Operational suitability **FAIL**
- T-015 Stage-1 salience **INSUFFICIENT**

Full DLA/GAM JSON: **operator-held** (not attached in the T-016 authorisation paste). Do not hand-edit.

---

## Observable A4 practice operand (operator-authoritative)

```text
L = 8x + 4y + λ(30 − x − y)

FOCs:
8 − λ = 0
4 − λ = 0
30 − x − y = 0
```

Commissioned learner action: determine the optimal values implied by this system. Workspace asks for **x, y and λ**.

First two equations require **λ = 8** and **λ = 4** simultaneously. The commissioned action is **impossible**.

---

## Observable A3 worked model (operator-authoritative)

```text
L = 6x + 4y + λ(50 − x − y)

FOCs:
6 − λ = 0
4 − λ = 0
50 − x − y = 0
```

Differentiation is mechanically correct. Generated model operand produces an **inconsistent stationary system**. Model completeness/suitability also FAIL if the commission promises a complete worked result.

---

## Classification vs other candidates

| Candidate | Role |
| --------- | ---- |
| 1 | Pre-T-015: WS2 PASS; suitability FAIL (contradictory λ; incomplete model) |
| 2 | E2 malformed JSON — **not** suitability evidence |
| 3 | Truncated JSON; pre-truncation WS2 + usable A4 operand — capability signal only |
| 4 | Post-T-015 structurally valid; WS1/WS2 observable PASS; suitability FAIL — **Stage-1 threshold met** |

Do not treat Candidate 4 as Lagrangian-specific. Failure class: generated particulars make the commissioned operation impossible.

See [S78-T-016](S78-T-016-operational-suitability-stage-2-enforcement-design.md).
