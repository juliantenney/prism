# Slice 38B-4 — Materials and table fidelity

**Date:** 2026-06-04  
**Status:** **COMPLETE (planning)** — failure modes, hypotheses, and consolidation requirements documented. **Regression MONITORING** (B4-01, B4-02) — see [B4-CLOSURE-REVIEW.md](B4-CLOSURE-REVIEW.md) (2026-06-04).  
**Wave 2a (GAM authority):** [38B-W2A-GAM-authority-review.md](38B-W2A-GAM-authority-review.md) · pack trim [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md) (**PR-W2a-1 DONE**) · live GAM [EV-38B4-03](EV-38B4-03-inflation-gam-evidence.md) · Design Page [EV-38B4-01](EV-38B4-01-design-page-evidence.md) / [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md) (same-run pipeline).  
**Closure review:** [B4-CLOSURE-REVIEW.md](B4-CLOSURE-REVIEW.md) — **MOVE TO MONITORING** (not formal CLOSE).  
**Wave 3 gate:** [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) — artefact validation **PASS**; disposition unchanged **MONITORING**.  
**Cases:** [probe-38B-4-materials-table-fidelity-cases.md](../fixtures/probe-38B-4-materials-table-fidelity-cases.md)  
**Closure:** [PLANNING-CLOSURE-SUMMARY.md](../PLANNING-CLOSURE-SUMMARY.md)

---

## Success criterion

Document failure modes, expected shapes, root-cause hypotheses, and consolidation requirements for **materials** and **table** fidelity — with a testable good/bad matrix anchored on Inflation.

---

## Regression summary

| Issue | Symptom | Mitigation status |
|-------|---------|-------------------|
| Placeholder materials | “Set of scenarios…”, “Calculation table…” label strings | **Partial** — materials fidelity prompt + placeholder tests |
| **Table flattening** | `Scenario 1,,,` lines; separate `Headers` / `Rows` prose sections | **MONITORING** — live EV PASS; historical shapes not reproduced (see [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md)) |

---

## Observed bad shapes (Inflation rerun)

```text
Scenario 1,,,
Scenario 2,,,
Scenario 3,,,

Headers
Policy Change
Borrowing
Spending
Inflation

Rows
Interest rate increase,,,
Interest rate decrease,,,
```

**Interpretation:** The model is emitting a **pseudo-spreadsheet** or **CSV-style row list**, not a markdown pipe table in a named field such as `materials.analysis_table` or `materials.comparison_table`.

---

## Expected good shapes (upstream reference)

From `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` → `activity_materials` section:

| activity_id | Field | Good shape excerpt |
|-------------|-------|-------------------|
| A2 | `comparison_table` | `\| Measure \| What it tracks \| Limitation \|` + separator row |
| A3 | `analysis_table` | `\| Scenario \| Who is affected? \| Main price pressure \| Policy angle \|` |
| A4 | `impact_table` | `\| Scenario \| Cost pressure \| Revenue pressure \| Short-run response \|` |
| A1 | `classification_table` | Pipe table with Item / Rising price? / Affects students? |

Design Page duty: merge each `activity_materials` block into `learning_activities.content[].materials` **unchanged in table syntax**.

Example target JSON fragment:

```json
{
  "activity_id": "A3",
  "materials": {
    "scenario": "## Household impacts\n\n### Scenario A: …",
    "analysis_table": "| Scenario | Who is affected? | Main price pressure | Policy angle |\n| --- | --- | --- | --- |\n|  |  |  |  |"
  }
}
```

---

## Case matrix (seeded)

| Case ID | Anchor | Activity | Field | Bad shape | Good shape | Upstream | Status |
|---------|--------|----------|-------|-----------|------------|----------|--------|
| B4-01 | Inflation | A2/A3/A4 | `*_table` | Comma rows `Scenario 1,,,` | Pipe markdown in named field | `ld-inflation-workshop-page-full.json` | **MONITORING** — EV-38B4-01/02/03 PASS; historical not reproduced |
| B4-02 | Inflation | Policy table activity | table | `Headers` + `Rows` prose blocks | Single `materials.<table_key>` pipe string | Live rerun | **MONITORING** — same |
| B4-03 | Inflation | A3 | `scenario` + `analysis_table` | Scenarios restored; table still CSV | Both fields populated with pipes | Fixture | **MONITORING** — live PASS (was PARTIAL) |
| W3-4 gate | Inflation | A1–A5 | `*_table` | — | 8/8 pipe fields on EV + golden | [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) | **PASS** (fixture); B4 programme still **MONITORING** |
| B4-04 | CI | A2 | multi-table | _TBD_ | `confidence-interval-a2-multitable-page.json` | Fixture | PENDING |
| B4-05 | — | any | placeholder | Label-only string | Full content | `design-page-materials-fidelity.js` | **MITIGATED** |
| B4-06 | — | any | table label | “Calculation table” only | Pipe table body | Tests | **MITIGATED** |

---

## Investigation findings (read-only audit)

### 1. Upstream Generate Activity Materials

- Fixture proves GAM **can** emit correct pipe tables in `activity_materials.content` strings.
- **38B-1 audit:** GAM has the **strongest** pack pipe-table rule and the **only** runtime **table row adequacy** block; **34,482** chars augmented (self-directed) — table author step.
- **Hypothesis (updated):** Corruption may begin at **GAM** (CSV/prose despite rules) **or** at **Design Page** merge under token pressure; Design Page lacks table row adequacy and comma-row bans.

### 1b. Upstream Design Learning Activities

- DLA does **not** emit table content — only `required_materials` specs (`template`, `analysis_table`, etc.).
- **38B-1 audit:** **39,201** chars augmented (self-directed); material shape block references integrated `analysis_table`.
- Weak pipe examples in DLA specs may contribute to ambiguous GAM/Design Page outputs.

### 2. Design Page prompt

| Finding | Detail |
|---------|--------|
| Table rules exist | Pack: “keep tables in named material fields”; “do not place raw markdown tables inside bullet-list strings” |
| Gap | **No explicit forbid** for comma-row lines, `Headers`/`Rows` pseudo-structure, or CSV shorthand |
| Materials fidelity block | Requires “actual tables with headers and cells” but does not show a **canonical pipe example** or anti-patterns |
| Table row adequacy block | **Not applied** on Design Page — only on GAM (`buildSelfDirectedGamTableRowAdequacyPromptBlock`) |
| Token pressure | Self-directed augmented prompt **~46k chars** — likely driver of structural compression |

### 3. Compose / post-process

- `applyPedagogicCognitionSemanticsToComposedPage` / Sprint 38 compose normalise affordances; **no** materials table rewrite identified in audit (deeper pass optional in implementation phase).
- `mergeActivityMaterialObjects` merges objects — does not convert pipes to CSV.

### 4. Renderer expectations (downstream, frozen)

- `utilityMaterialHintIsWorksheetTable` recognises keys: `analysis_table`, `comparison_table`, `impact_table`, etc.
- `utilityRenderMarkdownTable` handles pipe tables.
- `utilityMaterialValueToCsvRowTexts` / `utilityRenderCsvLikeRowsTable` can render **comma-separated row text** when content is already CSV-shaped — renderer follows bad JSON; **root fix is prompt/output JSON**, not renderer (38-B boundary).

**Implication:** Bad `Scenario 1,,,` in page JSON is almost certainly **LLM output shape**, not renderer inventing commas.

---

## Root-cause hypotheses (ranked)

1. **Prompt length / output token budget** — Model shortens tables to CSV/prose under instruction stack pressure. **Post Wave 1:** GAM augmented **16,370** chars (was ~34k); Design Page **27,345** (was ~46k) — pressure reduced but B4 remains OPEN; pack §6 still duplicates weaker table wording than `LD-TABLE-FIDELITY`.  
2. **Missing table anti-pattern in contract** — **Partially addressed (Wave 1):** `LD-TABLE-FIDELITY` forbids comma-rows and Headers/Rows; pack §6 and `Facilitator use:` output template still contradict runtime. **Wave 2a:** pack dedupe + GAM authority — see [38B-W2A](38B-W2A-GAM-authority-review.md) §5.  
3. **Ambiguous “structured object”** — Model interprets tables as `{ headers: [...], rows: [...] }` then serialises as prose `Headers` / `Rows` sections.  
4. **Summarisation clause interaction** — “Preserve structure and shorten only non-essential prose” read as table-flattening permission.  
5. **No canonical one-line pipe example in Design Page augmentation** — Sprint 38 JSON examples dominate “table” token budget without showing `materials.analysis_table` shape.  
6. **Separate `activity_materials` section in upstream** — If model leaves `materials: []` and dumps tables elsewhere in page sections, renderer may still show content but activity cards lack tables (verify live JSON).

---

## Consolidation requirements (38B-3 layer 4 — planning only)

Add to consolidated Design Page contract (do not implement yet):

```text
TABLE FIDELITY (hard)
- Every table lives in materials.<named_table_field> as a markdown pipe table string OR
  a structured rows array with explicit column keys — never CSV comma rows in prose.
- FORBIDDEN in materials:
  • Lines matching /^[^|\n]+,,,\s*$/
  • Prose sections titled "Headers" and "Rows" instead of a single table field
  • Bullet lists of comma-separated cells
- REQUIRED when upstream activity_materials has pipe tables: copy the pipe block verbatim
  into the matching activity materials field key (analysis_table, comparison_table, …).
- Include one compact GOOD example (≤6 lines) in the contract; move Sprint 38 JSON examples
  to an appendix or single truncated sample.
```

Future tests (38B-6):

- Extend `lib/design-page-materials-fidelity.js` with `stringLooksLikeCommaRowTableAntiPattern`  
- Fixture assert: merged Inflation page materials contain `\n| --- |` per activity with upstream tables  

---

## Planning closure — B4-01 and B4-02 evidence

### Is live Inflation JSON required before planning formally closes?

**No.** Planning success (charter + 38B-4 success criterion) requires documented failure modes, good/bad shapes, ranked hypotheses, and consolidation requirements — all present. Fixing the regression or attaching a committed JSON artefact is **implementation** work ([38B-6](38B-6-regression-validation-plan.md) L4 MANUAL, Wave 3 gate).

### Why existing evidence is sufficient for planning

| Case | Evidence already on record | Planning outcome |
|------|---------------------------|------------------|
| **B4-01** | Bad shape prose from Inflation rerun (§ observed bad shapes); good shapes from `ld-inflation-workshop-page-full.json` `activity_materials`; GAM-can-emit-pipes from fixture audit; anti-pattern regex in probe fixture | Requirements → `LD-TABLE-FIDELITY` + 38B-3 L4 |
| **B4-02** | Same rerun excerpt (`Headers` / `Rows` blocks); interpretation as pseudo-spreadsheet; renderer does not invent commas (§4) | Forbidden patterns in consolidation requirements § |
| **B4-03** | PARTIAL — scenarios improved; table still CSV | Documents mitigation limit of placeholder-only fix |

**Open regression status** does not block planning close; it **mandates** Wave 1–3 implementation order (38B-5, 38B-7).

### Optional evidence request (implementation phase — not planning)

Capture before **Design Page Wave 3** PR merge (recommended, not planning gate):

| ID | Request | Purpose |
|----|---------|---------|
| **EV-38B4-01** | Export latest Inflation Design Page JSON after self-directed rerun | Attach redacted excerpt to probe fixture § evidence; golden diff for B4-01 |
| **EV-38B4-02** | For each affected activity: JSON path to bad table (`materials.<key>` vs orphan section) | Close hypothesis #6; pin B4-02 `activity_id` |
| **EV-38B4-03** | Optional: GAM `activity_materials` artefact from same workflow run | Separate GAM vs Design Page corruption |

Store under `fixtures/` or PR description per [38B-6](38B-6-regression-validation-plan.md) §7.2 — no committed file required for **planning** sign-off.

---

## Outputs

- [x] Bad/good shapes documented  
- [x] Case matrix seeded in probe fixture  
- [x] Hypotheses ranked with prompt/renderer/upstream notes  
- [x] Consolidation requirements (layer 4) for 38B-3  
- [x] B4-01/B4-02 planning evidence assessment (§ above)  
- [x] **EV-38B4-03** — live GAM capture — [EV-38B4-03-inflation-gam-evidence.md](EV-38B4-03-inflation-gam-evidence.md) (**L4-07 PASS** at GAM; see §2.3 prompt-stack caveat)
- [x] **EV-38B4-01** — Design Page JSON (DLA → GAM → DP same run) — [EV-38B4-01-design-page-evidence.md](EV-38B4-01-design-page-evidence.md)
- [x] **EV-38B4-02** — GAM → DP preservation analysis — [EV-38B4-02-table-preservation-analysis.md](EV-38B4-02-table-preservation-analysis.md)

---

## Wave 2a — GAM authority (2026-06-04)

Full audit: [38B-W2A-GAM-authority-review.md](38B-W2A-GAM-authority-review.md).

| Question | Conclusion |
|----------|------------|
| Table **author** | **GAM** + `LD-TABLE-FIDELITY` (author role); Design Page **preserve-only** |
| B4-01 / B4-02 at GAM (EV-38B4-03) | **PASS** on 2026-06-04 live capture — no comma-rows or Headers/Rows in GAM text |
| B4-01 / B4-02 at Design Page (EV-38B4-01) | **PASS** on same-run pipeline — pipes in `materials.*`; historical bad shapes **not reproduced** |
| B4 closed in Wave 2a only? | **No** — Wave 3 compose contract + production Factory gate still required |
| Programme B4 disposition (closure review) | **MONITORING** — [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md); formal **CLOSE** after §9 evidence checklist |
| Pack trim (PR-W2a-1) | **DONE** — GAM augmented **15,806** chars (−564 vs W1 exit); B4 one-liner in pack; `Facilitator use` gated for self_directed |
| L4-07 / EV-38B4-03 | **PASS** at GAM author — [EV-38B4-03](EV-38B4-03-inflation-gam-evidence.md); full augmented stack parity note in EV §2.3 |
| EV-38B4-01/02 | **DONE** — [fixtures/ev-38b4-01-design-page.json](../fixtures/ev-38b4-01-design-page.json); **no Design Page degradation** this run |
| Programme B4 risk | **Reduced** — not **closed**; monitor until L4 AUTO + Wave 3 gate (38B-6) |
| Smallest safe scope (remaining) | Wave 3 `LD-DESIGN-PAGE-COMPOSE-CONTRACT`; production Factory rerun with `section_id` page shape |

**Implementation order unchanged:** GAM (2a) → DLA (2b) → Design Page (3) per [38B-5](38B-5-workflow-wide-review.md).

---

## EV-38B4-01 / EV-38B4-02 — Design Page same-run (2026-06-04)

| Finding | Detail |
|---------|--------|
| Pipeline | DLA → GAM → Design Page on Inflation self-directed brief |
| Malformed tables at DP? | **No** — comma-row and Headers/Rows **absent** in composed JSON |
| Preservation | GAM pipe tables → `learning_activities[].materials.<table_key>` **unchanged in syntax** |
| `activity_materials` section | **Not used** — tables embedded on activity rows (hypothesis #6 not triggered) |
| Historical CONTEXT bad shapes | **Not reproduced** in this capture |
| B4-01 / B4-02 / B4-03 (this run) | **PASS** / **PASS** / **PASS** |

See [EV-38B4-01](EV-38B4-01-design-page-evidence.md) and [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md).

---

## B4 closure review (2026-06-04)

Full analysis: [B4-CLOSURE-REVIEW.md](B4-CLOSURE-REVIEW.md).

| Outcome | Detail |
|---------|--------|
| **Recommendation** | **MOVE TO MONITORING** — not CLOSE (Wave 3 / L4 AUTO pending); not KEEP OPEN (live regression not reproduced) |
| **Historical B4-01/02 prose** | **Not reproducible** on 2026-06-04 captures; **partially** reproducible via CSV-array fixture class |
| **Formal CLOSE requires** | Production Factory full-stack rerun, canonical `section_id` page, L4-04–06 AUTO, PREC gate, renderer `<table>` — see B4-CLOSURE-REVIEW §9 |
