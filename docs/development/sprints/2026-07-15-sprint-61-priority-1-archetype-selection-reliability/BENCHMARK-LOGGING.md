# Sprint 61 — Benchmark Logging Procedure

**Audience:** Human operator completing Phase A scored runs  
**Authority:** [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) · [acceptance-matrix.md](acceptance-matrix.md)

---

## 1. After finishing one run

1. Create folder `artefacts/phase-a/<benchmark-id>/<run-id>/`.
2. Save all mandatory evidence files ([artefacts/phase-a/README.md](artefacts/phase-a/README.md)).
3. Copy [templates/benchmark-run-record.md](templates/benchmark-run-record.md) → `classification.md` and fill every field.
4. Copy [templates/classification.template.json](templates/classification.template.json) → `classification.json` and fill (same facts).
5. Walk precedence [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §7; assign **one** classification code.
6. If evidence incomplete → **`INVALID_TEST`** (do not invent a softer code).

---

## 2. Update `acceptance-matrix.md`

### A. Phase A run table (30 rows)

For the matching `benchmark ID` + `run ID` row, set:

| Column | From |
| ------ | ---- |
| expected_set | matrix / `expected-set.json` |
| actual_set | `expected-set.json` |
| capture valid | Y/N |
| persisted | Y/N |
| delivery.pass | true/false/NA |
| classification | single code |
| artefact path | `artefacts/phase-a/<benchmark-id>/<run-id>/` |
| notes | short pointer or ambiguity flag |

Keep **one classification code only** — never PASS/FAIL collapse.

### B. Brief-level outcomes (after r1–r3 for that brief)

| Column | Rule |
| ------ | ---- |
| r1 / r2 / r3 | Copy classification from each run |
| brief outcome | Majority (≥2 of 3 same code); else `SPLIT` |
| bar contribution | Leave labels as in matrix (positive / false-positive gate) |

### C. Summary counts

Update **only when all 30 scored runs are complete** (or at an interim checkpoint labeled as interim):

1. **Run-level counts** — tally each of the ten codes across 30 rows.  
2. **Brief-level bar verdict** — apply S61-D10 rules in [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md) §9.  
3. Do **not** treat interim partial tallies as bar Met/Not met.

---

## 3. How to link evidence

In the matrix `artefact path` column use a **relative pack path**, e.g.:

```text
artefacts/phase-a/S61-B09/A-S61-B09-r1/
```

In `classification.md` Notes, optional one-liner:

```text
See artefact folder; activation.selected_dla_test=none.
```

Do not paste large JSON into the matrix.

---

## 4. Smoke runs

- Log under `_smoke/` only.  
- May add a note in matrix Notes that smoke was done.  
- **Never** overwrite scored r1–r3 rows with smoke results.

---

## 5. Escalation (ambiguous classification)

1. Stop writing a “best guess” code.  
2. Set `ambiguous: true` in `classification.json`; leave classification blank or `INVALID_TEST` if protocol conditions failed.  
3. Note the conflict in Notes (which two codes competed).  
4. Do not change product code or prompts.  
5. Resolve via second operator read of artefacts + protocol §6–7, or record temporary `INVALID_TEST` until adjudication (adjudication run uses next free run ID only if protocol allows SPLIT resolution — prefer re-scoring from existing artefacts without a new Copilot run when evidence is complete).
