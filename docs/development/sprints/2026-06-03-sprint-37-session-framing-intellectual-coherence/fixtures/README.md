# Sprint 37 — fixtures folder

Sprint 37 does **not** duplicate stable regression fixtures. Authoritative composed-page contracts live under:

```text
tests/fixtures/page-render/
```

Use **this folder** only for:

- **Rhetorical probe pages** — short before/after JSON or markdown excerpts
- **Manual HTML baselines** — e.g. `RNAOriginal.html`, `RNAOLD.html`, `climate change.html` (copies or pointers when not in repo root)
- Slice-linked **brief notes** (`probe-37-X-….md`) that are not yet test-gated
- Annotated opening/closure extracts (paragraph-level diffs, not full page dumps)

---

## Primary evaluation fixtures (repo — do not copy)

| Fixture | Path | Rhetorical surfaces |
|---------|------|---------------------|
| **RNA / HCV assessment** | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | Multi-activity virology session; intro/synthesis gaps vs strong activities |
| **Climate misconception** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Progression model: signal → mechanism → uncertainty → judgement |
| **Confidence intervals (golden)** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Quantitative session frame; template + assessment closure |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | Humanities arc; comparison and study_tips |

---

## Manual anchors (external unless added here)

| File | Use |
|------|-----|
| `RNAOriginal.html` | Original baseline opening/closure |
| `RNAOLD.html` | Older PRISM output baseline |
| `climate change.html` | Live climate learner page rhetoric |
| Enhanced RNA HTML | Latest HCV/RNA run — compare to fixtures above |

Store copies under this folder **only** when needed for slice review; prefer referencing paths in observation notes.

---

## Promotion rule

1. Capture probe output or rhetorical contract notes here.
2. Link from `observations/37-X-….md`.
3. **Promote** to `tests/fixtures/page-render/` + targeted test only when the **wording shape or required fields** are stable and regression-worthy.
4. Do **not** weaken Sprint 34–36 renderer or visual tests for experimental copy.

---

## How to render for manual review

```text
loadPrismTestApi() → buildUtilityStructuredHtmlForTest(parsed, sectionOrder)
```

Reference: `tests/utility-page-render.test.js`.

Inspect **prose fields in JSON** and rendered section/activity openings — not CSS hierarchy (Sprint 36).

---

## Optional additions

| File pattern | Purpose |
|--------------|---------|
| `probe-37-1-rna-opening-excerpt.md` | Opening paragraph before/after |
| `probe-37-4-climate-closure-notes.md` | Synthesis comparison vs fixture |
| `probe-37-5-transfer-durable.md` | Transfer vs closure; anchor transfer/limit table |

Keep files small; large HTML belongs in local review unless essential for git diff.
