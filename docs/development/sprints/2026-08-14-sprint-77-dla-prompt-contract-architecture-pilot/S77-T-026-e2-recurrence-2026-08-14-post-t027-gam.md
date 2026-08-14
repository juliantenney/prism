# E2 recurrence exhibit — post–T-027 GAM (record only)

**Recorded:** 2026-08-14  
**Mode:** RECORD ONLY — no implementation  
**Sprint 77:** remains **CLOSED**  
**T-027 body-format repair:** **not reopened**  
**Production / tests / validators:** **UNCHANGED**

Protocol: [S77-T-026](S77-T-026-gam-e2-intermittent-corruption-diagnostic.md) §11. Full Copilot verbatim dump / textarea byte-compare: **not attached in git** (operator exhibit in this chat).

---

## Context

Fresh GAM generation from the **valid current DLA**, after the ordinary-material markdown body-format repair.

**T-027 behaviour observed:** ordinary materials used `body_format: "markdown"` with string bodies. That repair is **not** implicated.

---

## Exhibit 1 — A2-M2 learner-facing corruption

| Field | Value |
| ----- | ----- |
| Material | A2-M2 `reference_note` |
| Title | Constructing a Lagrangian: Worked Walkthrough |

Corrupted sequence (operator-quoted):

`This term carries[x+3yA maximise utility given by \(U(x,y)=xy\) while facing the budget restriction \(x optimised is the utility function, so the central objective function and multiplier expression yields`

Recorded properties:

- prose spliced / truncated;
- unrelated mathematical/text fragments inserted;
- sentence continuity destroyed;
- TeX / prose boundaries damaged.

Capture **fail-closed** with:

`activities[1].materials[1] (A2-M2): math integrity — inline math contains instructional prose; keep TeX contiguous`

That validator message is **detection of already-corrupt output**, not a cause. Do not weaken it. Do not add a sanitiser. Do not “fix” A2-M2 prose in capture.

### Classification vs T-026 E2

Historical E2: `Pur[` + raw newline; `\rtial`; malformed learner-facing / JSON; no deterministic repo mutation; earliest proven layer = operator-visible model/Copilot response.

This exhibit: **same family** — intermittent **learner-facing generation corruption** in the operator-visible GAM response, at the unresolved **model / Copilot / clipboard** boundary. Token pattern **differs** (`Pur[` / `\rtial` vs spliced prose+TeX). Do **not** claim model vs Copilot causality. Do **not** treat as a new named repo defect.

**E2 recurrence:** **YES** (E2-family; E2 remains **OPEN / INTERMITTENT**).

---

## Exhibit 2 — A4 containment / binding anomaly (separate)

In the **same** GAM response:

- top-level A1, A2, A3, A5 exist;
- **no** top-level `activity_id: "A4"` object;
- A4-M1 and A4-M2 appear **inside** the `activity_id: "A3"` materials array.

Do **not** assume the same mechanism as Exhibit 1.

**Commission / prompt (already live, T-023/T-024):** AUTHORITATIVE DLA MATERIAL COMMISSION lists activities as separate rows and forbids reassigning commissioned material rows. Copy also requires output `activities[]` to keep the same `activity_id` values in the same order as input. A4-M1 / A4-M2 are bound to **A4**, not A3.

**Classification:** **output non-compliance** with a correct commission. **E1 not reopened.**

---

## Disposition

| Item | Status |
| ---- | ------ |
| T-027 body-format | Followed on this run |
| E1 | **CLOSED** (unchanged) |
| E2 | **OPEN / INTERMITTENT** — this is a recurrence exhibit |
| Deterministic repo cause | **NOT PROVEN** |
| Sanitiser / validator change | **Forbidden** |
| Operational action | **Discard this GAM response. Regenerate GAM from the same valid DLA.** Do not regenerate EP/DLA unless independently required. |
