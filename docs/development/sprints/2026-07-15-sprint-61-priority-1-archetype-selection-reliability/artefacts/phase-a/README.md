# Sprint 61 — Phase A Artefact Folder Convention

**Authority:** [PHASE-A-PROTOCOL.md](../PHASE-A-PROTOCOL.md) §8 · S61-D09

---

## Directory layout

```text
artefacts/
  phase-a/
    README.md                 ← this file
    S61-B01/
      A-S61-B01-r1/
        … required files …
      A-S61-B01-r2/
      A-S61-B01-r3/
    S61-B02/
      A-S61-B02-r1/
      …
    …
    S61-B10/
      A-S61-B10-r1/
      A-S61-B10-r2/
      A-S61-B10-r3/
    _smoke/                   ← optional non-scored dry-runs (excluded from bar)
      B09-smoke-1/
      B01-smoke-1/
```

**Run ID pattern:** `A-S61-B0n-r1` | `…-r2` | `…-r3`

Create folders **when the run starts**. Do not invent missing files — mark the run `INVALID_TEST` if evidence is incomplete.

---

## Required files per scored run folder

| File | Purpose |
| ---- | ------- |
| `meta.json` | benchmark ID, run ID, phase, timestamp, operator, workflow, harness flags |
| `brief.txt` | verbatim sparse brief used |
| `activation.json` | `selected_dla_test`, S59 window flags, stamps absent/present |
| `dla-prompt-excerpt.txt` | DLA Copy excerpt: no S59 tokens / emission markers |
| `dla-capture.json` | raw DLA capture |
| `dla-validation.json` | capture validation (+ archetype plan errors) |
| `persisted-page.json` | post-persist SoT (or note identical to capture) |
| `expected-set.json` | `{ "expected_set": [...], "actual_set": [...] }` |
| `classification.json` | machine-readable classification (from template) |
| `classification.md` | human run record (from [templates/benchmark-run-record.md](../templates/benchmark-run-record.md)) |

### When delivery check applies

Required whenever `actual_set` is non-empty **and** plans / capture validate:

| File | Purpose |
| ---- | ------- |
| `gam-prompt-final.txt` | final GAM prompt text |
| `prism-final-gam-prompt.json` | `window.__PRISM_FINAL_GAM_PROMPT` snapshot |

If delivery does not apply (`CORRECT_OMISSION` / `UNDER_SELECTION` with empty `actual_set`), omit these two files and set `archetype_delivery_pass` to `null` / NA in classification.

---

## Templates

| Template | Use |
| -------- | --- |
| [templates/benchmark-run-record.md](../templates/benchmark-run-record.md) | Copy → `classification.md` |
| [templates/classification.template.json](../templates/classification.template.json) | Copy → `classification.json` |

---

## Smoke runs

Store under `artefacts/phase-a/_smoke/`. Do **not** count toward the 30 scored runs or the provisional bar.
