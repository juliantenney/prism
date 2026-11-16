# Sprint 99 — Validation ledger

**Sprint:** 99 — Expository Instructional Quality and Academic Plain English  
**Opening:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)  
**M3 impl:** [S99-D04](decisions.md#s99-d04--implement-m3-1-and-m3-2-only)

---

## M3-1 / M3-2 focused verification (2026-11-16)

```text
node --test tests/s99-expository-string-list-coercion.test.js tests/s99-expository-academic-plain-english.test.js tests/interactive-academic-plain-english-guidance.test.js tests/s85-wp2-expository-contracts.test.js tests/s85-wp3-expository-sibling-prompts.test.js tests/s98-learner-facing-prose-typography.test.js
```

**Result:** **44 pass / 0 fail**

| Claim | Check |
| ----- | ----- |
| Object list items no longer become `"[object Object]"` | **Claimed** — XD + EJP normalisation |
| Valid strings preserved; malformed dropped | **Claimed** |
| Field shape remains `string[]` | **Claimed** |
| Expository GLC/XD/XM receive Expository APE | **Claimed** |
| Interactive GAM APE / layer purposes absent on Expository | **Claimed** |
| Interactive still receives Interactive APE | **Claimed** |
| S98-D08 typography still reaches Expository runtime path | **Claimed** |
| Renderer invitation display changed | **Not claimed** — unchanged (still not rendered) |

---

## Broader regression subset (2026-11-16)

```text
node --test tests/s99-expository-string-list-coercion.test.js tests/s99-expository-academic-plain-english.test.js tests/interactive-academic-plain-english-guidance.test.js tests/s85-wp2-expository-contracts.test.js tests/s85-wp3-expository-sibling-prompts.test.js tests/s85-expository-structured-xm-materials.test.js tests/s85-expository-assembled-learner-page-sections.test.js tests/s87-t002-eq1-purpose-epistemic-form.test.js tests/s98-learner-facing-prose-typography.test.js tests/s96-interactive-editorial-opening.test.js tests/learner-renderer-vnext-compose-a5.test.js
```

**Result:** **83 tests · 79 pass · 4 fail**

| Failure | Classification |
| ------- | -------------- |
| `learner-renderer-vnext-compose-a5.test.js` ×3 | **Known baseline** (S98-AD-015 / heteroscedasticity compose drift) — not introduced by M3-1/M3-2 |
| `s96-interactive-editorial-opening.test.js` figcaption | **Known baseline** (S98-E07) — not introduced by M3-1/M3-2 |

All new M3 tests and Expository contract / sibling / typography / Interactive APE suites in this set **passed**.

---

## M4 — Normal regeneration review (at close)

**Decision:** [S99-D05](decisions.md#s99-d05--close-sprint-99--accepted-with-qualifications)

| Claim | Check |
| ----- | ----- |
| Normal Expository regeneration reviewed (assembled JSON + learner export) | **Claimed** — author evaluation at close |
| M3-1 / M3-2 adequate for qualified acceptance | **Claimed** — with qualifications below |
| Exact original M1 object-shaped XD payloads re-verified | **Not claimed** — unrecovered |
| M3-3 / M3-4 implemented | **Not claimed** — deferred |
| Sprint 99 regressions in broader suite | **Not claimed** — 4 fails = known baselines |

---

## Final close integrity (S99-D05)

| Claim | Check |
| ----- | ----- |
| Accepted outcomes recorded | **Claimed** — [SPRINT-99-CLOSURE.md](SPRINT-99-CLOSURE.md) |
| Qualifications / deferred M3-3/M3-4 preserved | **Claimed** |
| Interactive LS fidelity → programme D-015 | **Claimed** — S98 M5 Option C · S98-AD-004 · S99-AD-012 |
| Sprint 98 not reopened | **Claimed** |
| Successor Sprint 100 planned (not opened) | **Claimed** — [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) |

---

## Prior milestones

- M0–M2: [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) · [M2-INVESTIGATION.md](M2-INVESTIGATION.md) · S99-D01…D03  
- M3: S99-D04  
- M4 / Close: S99-D05
