# 38L — DLA obligation run-path diagnosis

**Date:** 2026-06-05  
**Status:** **FIXED** (run path + emission gate + regression guard)  
**Trigger:** Post–KM-fix Inflation DLA missing mandatory 38L §5 rows

---

## §1 Observed failure vs good baseline

| Activity | User-reported failing DLA | `EV-38L-AFTER-dla-learning-activities.json` (38L-5 proof) |
|----------|---------------------------|-----------------------------------------------------------|
| A1 | `text`, `prompt_set` only | `text`, `worked_example`, `sample_output`, **`checklist`** |
| A2 | `text`, `template` | `worked_example`, practice table, **`checklist`** |
| A3 | `scenario`, `template` | `scenario`, **worked analytic pass**, `analysis_table`, **`checklist`** |
| A4 | template/content only; `transfer_or_application_task` field, **no** `transfer_prompt` row | independent judgement **`template`**, **`checklist`**, **`transfer_prompt`**, consolidation |

Missing obligations: **DLA-WB-26** (every-activity checklist), **DLA-WB-27** (A3 worked analytic pass), **DLA-WB-28/31** (A4 completion trio), **IFP-10** closure rows, **depth_floor L3** language.

The on-disk **38L-5 proof artefact still contains all mandatory rows** — the failing DLA came from a **different run path**, not from stale pack §5 content.

---

## §2 Root cause

### Primary: wrong rerun harness / user envelope

After the KM JSON fix ([38L-KM-json-regression-fix.md](38L-KM-json-regression-fix.md)), the documented resume command is the **38L** harness:

```bash
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

The likely alternate path is the **38H** harness (`ev-38h-inflation-pipeline-capture-once.mjs`), which shares `ev-harness-artefact-parse.js` for KM but uses a **weaker DLA user envelope**:

| Surface | 38L harness DLA user block | 38H harness DLA user block |
|---------|---------------------------|---------------------------|
| IFP-09/10, DLA-WB-26..31 | **Explicit** in `ctxHeader` + step user text | **Absent** from `ctxHeader` |
| Checklist rule | **Every activity** (DLA-WB-26) | `checklist/prompt_set on ≥2 activities` (DLA-WB-11 only) |
| Evaluate completion | DLA-WB-28/31 + EV-CAP-04 | Not cited |
| Frozen household Evaluate LO | `loadFrozenLearningOutcomes()` | Live LO generation (policy Summarize risk) |

Pack §5 `dlaAug.augmented` still contains IFP-09/10 and DLA-WB-26..31 on **both** harnesses, but the **38H user message contradicts** universal checklist and Evaluate completion — models often follow the shorter, later user mandate and emit thin shells (`prompt_set` on A1, cognition-only transfer on A4).

### Secondary: Prism UI stale `local_override`

`buildWorkflowStepInstructions` resolves prompts only from `step.override_prompt_body` or library prompts — **not** live pack re-seed. Workflows saved before 38L-2 retain pre-38L seeded bodies without IFP-10/DLA-WB-26..31. `buildWorkflowStepInstructions` returns **empty** when no prompt is configured on a bare step object.

### Tertiary: model emission under full 38L prompt

When the official 38L path is used, markers are present in `dlaAug.augmented` (~31k chars; diagnostic: `node scripts/dump-dla-prompt-surface.mjs`). Residual model omission is addressed by **pack §5 PRE-EMIT rows (5)–(8)** and harness post-parse **`validateDla38LObligations`** (hard fail before GAM).

### Not the cause

- Pack §5 content was **not** stale — all 38L markers present in seeded/augmented prompt.
- Schema, ACM, renderer, §6 GAM — **unchanged** (confirmed by regression tests).
- Runtime self-directed JSON **example block** does **not** append on the inflation harness brief (`hasSelfDirectedExample: false` in dump) — thin example recency bias affects **UI scaffold paths** only when `shouldApplySelfDirectedLearnerPageScaffoldBase` fires.

---

## §3 Prompt inspection (official 38L path)

Diagnostic script: `scripts/dump-dla-prompt-surface.mjs`

| Marker | `seeded` (pack §5) | `dlaAug.augmented` (harness path) | `buildWorkflowStepInstructions` (bare step) |
|--------|-------------------|-----------------------------------|-------------------------------------------|
| IFP-09 | ✓ | ✓ | ✗ (empty) |
| IFP-10 | ✓ | ✓ | ✗ |
| DLA-WB-26..31 | ✓ | ✓ | ✗ |
| transfer_prompt | ✓ | ✓ | ✗ |
| depth_floor | ✓ | ✓ | ✗ |
| PRE-EMIT GATE (post-fix) | ✓ | ✓ | ✗ |

**Conclusion:** Markers are present on the official harness path; failure is **run-path / user-envelope mismatch**, not missing pack §5.

---

## §4 Fixes applied

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§5 only** — Output rows **(5)–(8)** + **PRE-EMIT GATE** before JSON emit |
| `docs/.../ev-38l-inflation-pipeline-capture-once.mjs` | `PRISM_HARNESS_KM_ONLY=1`; `PRISM_HARNESS_RESUME_FROM=km`; post-DLA `validateDla38LObligations` hard fail |
| `lib/dla-38l-obligation-check.js` | **New** — obligation validator (checklist / A3 pass / A4 trio) |
| `app.js` | Self-directed DLA example block: checklist in example + **38L anti-thin pointer** (UI scaffold path) |
| `tests/dla-38l-obligation-smoke.test.js` | **New** — prompt surface + fixture + thin-shell negative |
| `tests/workbook-contract-prompt-surface.test.js` | PRE-EMIT rows (5)–(8) assertion |
| `scripts/dump-dla-prompt-surface.mjs` | **New** — prompt marker diagnostic |

**Unchanged:** JSON schema, ACM, renderer, pack §6 GAM, workflow stage graph.

---

## §5 Correct rerun commands (post–KM fix)

**KM only (after contract fix):**

```bash
set PRISM_HARNESS_KM_ONLY=1
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

**Resume DLA → GAM → Page from saved KM (38L user envelope + frozen LO):**

```bash
set PRISM_HARNESS_RESUME_FROM=km
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

**Do not use** `ev-38h-inflation-pipeline-capture-once.mjs` for 38L DLA proof — its user ctx weakens DLA-WB-26..31.

**Prism UI:** Re-seed DLA step from pack (Prompt Studio → workflow step) or regenerate workflow scaffold so `override_prompt_body` includes current §5.

---

## §6 Tests added / updated

| Suite | Result |
|-------|--------|
| `tests/dla-38l-obligation-smoke.test.js` | **5/5 pass** |
| `tests/workbook-contract-prompt-surface.test.js` | **43/43 pass** (incl. PRE-EMIT rows) |

Validator checks on `EV-38L-AFTER-dla-learning-activities.json`: **pass**.

Thin shell fixture (user-reported pattern): **fail** as expected.

---

## §7 Success criterion

Before GAM/page inspection, DLA must pass `validateDla38LObligations`:

- ≥1 **`checklist`** per activity  
- A3 **`worked analytic pass`** before **`analysis_table`**  
- A4 **`template`** (independent judgement) + **`checklist`** + **`transfer_prompt`**

The 38L harness now **throws** if the model omits these rows. Re-run with `PRISM_HARNESS_RESUME_FROM=km` after KM fix to produce a fresh DLA under the official envelope.

### Fresh rerun verification (2026-06-05)

```bash
PRISM_HARNESS_RESUME_FROM=km node docs/.../ev-38l-inflation-pipeline-capture-once.mjs
```

| Check | Result |
|-------|--------|
| `validateDla38LObligations` on new DLA | **PASS** |
| A1–A4 each have `checklist` | **PASS** |
| A3 worked analytic pass before `analysis_table` | **PASS** |
| A4 `template` + `checklist` + `transfer_prompt` | **PASS** |
| Harness continued to GAM (19 materials incl. transfer_prompt) | **PASS** |

---

**Parent:** [observations/README.md](README.md)
