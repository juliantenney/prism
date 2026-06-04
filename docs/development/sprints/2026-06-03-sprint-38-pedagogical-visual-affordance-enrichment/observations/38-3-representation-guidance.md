# Slice 38-3 — Representation guidance

**Date:** 2026-06-03  
**Status:** **COMPLETE** (observation + vocabulary only)  
**Reviewer lens:** learning designer; discipline expert  
**Authority:** [38-1-visual-affordance-audit.md](38-1-visual-affordance-audit.md), [38-2-visual-purpose-taxonomy.md](38-2-visual-purpose-taxonomy.md)  
**Change type:** representation vocabulary for 38-4 encode — no code, prompts, renderer, or VEU

---

## Success criterion

> For a given **pedagogical purpose**, what representation would a competent learning designer choose **first**?

A designer (or 38-4 affordance record) should be able to brief a figure from:

```yaml
purpose: distinction
preferred_representation: comparison_framework
discipline: introductory_economics
canonical_discipline_note: >
  Label coverage (consumer basket vs domestic output) and what each index tracks.
representation_avoid:
  - stock_photography
  - summary_table
```

— **without** reading the full page.

**Separation rule:** `purpose` ≠ `preferred_representation`. Never `purpose: framework` or `purpose: causal_model`.

---

## Vocabulary size

**Seven tokens** — smallest set covering all six 38-2 generate purposes and all audited generate activities. No token added without 38-1/38-2 evidence.

| # | Token |
|---|--------|
| 1 | `comparison_framework` |
| 2 | `classification_matrix` |
| 3 | `causal_model` |
| 4 | `evidence_t_chart` |
| 5 | `number_line_segments` |
| 6 | `ordered_bar_strip` |
| 7 | `labelled_contrast_panel` |

Token 7 is an **alias-style minimal variant** of `comparison_framework` for two-construct-only cases; 38-4 may collapse to `comparison_framework` if schema prefers six tokens — both documented for designer clarity.

**Collapsed six-token mode (38-4 optional):** merge `labelled_contrast_panel` → `comparison_framework`.

**Pedagogical added value (38-6):** `preferred_representation` names **layout family only**. Each token below includes `must_add` and `must_not_duplicate` — the figure must satisfy both or the affordance fails human-designer QA even when the token is allow-listed. Author on generate rows as `pedagogical_added_value` (recommended). Catalog: `lib/sprint38-representation-pedagogical-value.js`.

---

## 1. Final representation vocabulary

### `comparison_framework`

| Field | Content |
|-------|---------|
| **Definition** | Labelled diagram organising **two or more constructs** on **named dimensions** (rows/columns or side-by-side panels) — not a topic poster. |
| **Pedagogical use** | Offloads conflation; supports tables by showing structure learners will complete, not answers. |
| **Supported purposes** | `distinction`, `comparison` |
| **Supported disciplines** | Introductory economics, humanities, statistics (non-numeric contrast only) |
| **Anti-patterns** | Money/arrow clip-art; unlabeled axes; filled table cells; author portraits collage |
| **Audit example** | **Inflation A2** CPI/PPI/deflator; **Marx A3** Manifesto vs *Kapital* purpose/difference |

**Designer constraints:** Name each construct; name ≥1 comparison dimension (coverage, aim, audience, interpretation); leave evaluative verdict open.

| **must_add** | comparison dimensions; salient differences; confusable features |
| **must_not_duplicate** | two decorative columns; duplicated table; blank worksheet shell without discriminating cues |

---

### `classification_matrix`

| Field | Content |
|-------|---------|
| **Definition** | Grid with **category headers** and **empty cells** (or placeholder dashes) — structure for typing, not a completed key. |
| **Pedagogical use** | Shows classification space before learner fills worksheet. |
| **Supported purposes** | `classification` |
| **Supported disciplines** | Introductory economics (inflation types), climate (claim typing — only if not duplicating template) |
| **Anti-patterns** | Pre-filled answers; colour-coded “correct” columns; decorative icons per cell |
| **Audit example** | **Inflation CSV A3** — demand-pull / cost-push / built-in rows |

**Designer constraints:** Headers only; no cell content that answers the task; `spoiler_boundary.hide_classification_keys: true`.

| **must_add** | discriminating cues; decision criteria; category distinctions |
| **must_not_duplicate** | blank worksheet duplication; filled answer key; completed classification cells |

**38-6 note (Inflation A3):** An empty grid mirroring the learner `analysis_table` fails — the figure must add **typing cues** the table does not already provide.

---

### `causal_model`

| Field | Content |
|-------|---------|
| **Definition** | Inputs → processes → outputs diagram with **explicit directed links** stated in materials (radiation, feedback, stocks/flows only when source supports). |
| **Pedagogical use** | Mechanism before evidence evaluation or misconception classification. |
| **Supported purposes** | `mechanism` |
| **Supported disciplines** | Climate/environmental science |
| **Anti-patterns** | Polar bear / disaster photography; political iconography; arrows implying claims not in source |
| **Audit example** | **Climate CC-MIS-1** — post `util-card-grid`, pre analysis template |

**Designer constraints:** Every arrow maps to a claim in `source_basis`; `representation_avoid: unsupported_causal_arrow`.

| **must_add** | mechanism visibility; directionality; intermediate relationships |
| **must_not_duplicate** | isolated labels; topic diagram; unsupported causal arrows |

---

### `evidence_t_chart`

| Field | Content |
|-------|---------|
| **Definition** | For/against (or supported/contradicted) **evidence structure** with blank or neutral cells — scaffold for weighing, not verdict. |
| **Pedagogical use** | Makes abstract “evidence for / against” lines in template visually scannable. |
| **Supported purposes** | `evidence_structure` |
| **Supported disciplines** | Climate, dialogic/social science evaluation tasks |
| **Anti-patterns** | Biased iconography; pre-weighted scales; slogan posters |
| **Audit example** | **Climate CC-MIS-1** — `analysis_template` for/against + classification checkboxes |

**Designer constraints:** Do not label card claims true/false; pair with `anti_spoiler: true`.

| **must_add** | evidence evaluation criteria; strength distinctions |
| **must_not_duplicate** | copied evidence list; pre-weighted verdict on card claims |

---

### `number_line_segments`

| Field | Content |
|-------|---------|
| **Definition** | One shared axis with **two or more interval segments** positioned by endpoint values from source. |
| **Pedagogical use** | Overlap / separation judgement without mental sketching; aligns with study tips (“sketch on number line”). |
| **Supported purposes** | `data_pattern_reading` (primary); `distinction` when contrast is purely endpoint overlap |
| **Supported disciplines** | Statistics (CI), any discipline with bounded numeric intervals in materials |
| **Anti-patterns** | Invented endpoints; 3D confidence art; p-values not in source; overlap verdict text replacing learner debrief |
| **Audit example** | **CI A4** — Control (66.08, 73.92) vs Treatment (70.01, 78.44) |

**Designer constraints:** **`requires_exact_data_match: true` mandatory**; units on axis; segment labels from table only.

| **must_add** | exact quantitative relationships from source; shared axis with labelled endpoints |
| **must_not_duplicate** | approximate or invented intervals; overlap/significance verdict replacing learner debrief |

---

### `ordered_bar_strip`

| Field | Content |
|-------|---------|
| **Definition** | **Ordered** strips or bars showing relative **width/magnitude** relationship (e.g. confidence level % vs interval width) — not a pie chart. |
| **Pedagogical use** | Links level % to width when two related tables sit in sequence. |
| **Supported purposes** | `distinction` |
| **Supported disciplines** | Statistics (CI) |
| **Anti-patterns** | Pie chart; dual unrelated metrics on one axis; fabricated widths |
| **Audit example** | **CI A2** — “Confidence Levels” table pair (`materials-table-pair-between`) |

**Designer constraints:** Order must match materials (90% < 95% < 99%); qualitative width OK if numbers not given; if numeric widths in source → `requires_exact_data_match: true`.

| **must_add** | ordered magnitude relationship; level-to-width or ordering cue from materials |
| **must_not_duplicate** | pie chart restatement; fabricated bar widths; duplicated statistics table |

---

### `labelled_contrast_panel`

| Field | Content |
|-------|---------|
| **Definition** | **Two-panel** (or two-column) labelled contrast — minimal comparison_framework when exactly two constructs and one dimension suffice. |
| **Pedagogical use** | Procedure vs single-interval interpretation; inflation vs relative price change (if ever generated). |
| **Supported purposes** | `distinction` |
| **Supported disciplines** | Statistics (procedure move), economics (binary contrast) |
| **Anti-patterns** | Venn diagram with implied probability when materials use frequentist procedure language |
| **Audit example** | 36-4 cites CI A1/A2 procedure disambiguation — **38-1 defer** on A1; use token only if promote from defer |

**Note:** Prefer `comparison_framework` when ≥3 constructs or ≥2 dimensions; this token is optional minimal form.

| **must_add** | named contrast dimension; salient two-construct difference |
| **must_not_duplicate** | decorative two-column poster; duplicated comparison table; topic illustration |

---

## 2. Purpose → representation mapping

| Purpose | Preferred representation | Alternatives (audit-bounded) | Avoid |
|---------|-------------------------|------------------------------|-------|
| **`distinction`** | `comparison_framework` (economics, multi-index) | `ordered_bar_strip` (CI level–width); `labelled_contrast_panel` (two-construct only); `number_line_segments` (overlap-only numeric) | Generic infographic; stock imagery; `summary_table` duplicate |
| **`comparison`** | `comparison_framework` (Marx texts: aim × audience / purpose × difference) | — (table in materials is learner workspace, not figure) | Author portraits; plot-summary panels |
| **`classification`** | `classification_matrix` | — | Filled key; `evidence_t_chart` conflating evaluate + classify |
| **`mechanism`** | `causal_model` | — | Stock photos; `generic_infographic` |
| **`evidence_structure`** | `evidence_t_chart` | — | Mechanism diagram duplicating prior figure |
| **`data_pattern_reading`** | `number_line_segments` | — | Unlabeled chart; invented trends; pie/bar without source |

**Every 38-2 generate purpose maps to ≥1 token** — satisfied.

---

## 3. Discipline → representation mapping

### Economics (inflation workshop)

| Topic / activity (38-1) | Decision | Purpose | Preferred representation | Avoid |
|-------------------------|----------|---------|------------------------|-------|
| **CPI vs GDP deflator** (A2) | generate | `distinction` | `comparison_framework` | Money icons; rising-arrow motif; duplicate of `comparison_table` |
| **Inflation types grid** (CSV A3) | generate | `classification` | `classification_matrix` | Filled type cells; infographic summary |
| **Household scenarios** (A3/A4 full) | reject | — | — (`duplicate_existing_structure`) | Scenario illustration replacing tables |
| **Warm-up / debrief** (A1, A5) | reject | — | — | Any generate token |

**Discipline note (economics):** `canonical_form_required: true`; `discipline_risk_level: medium`; `requires_exact_data_match: false` unless numeric series appear in materials.

---

### Statistics (CI golden)

| Topic / activity (38-1) | Decision | Purpose | Preferred representation | Avoid |
|-------------------------|----------|---------|------------------------|-------|
| **CI level vs width** (A2) | generate | `distinction` | `ordered_bar_strip` | Pie chart; bell-curve clip-art |
| **Interval overlap** (A4) | generate | `data_pattern_reading` | `number_line_segments` | Fabricated endpoints; 3D “confidence” graphics |
| **Procedure move** (A1) | defer | `distinction` (latent) | `labelled_contrast_panel` if promoted | Venn implying Bayesian meaning not in text |
| **p-value / α assessment** | reject | — | — | `threshold_line` not in vocabulary — assessment text-first |

**Discipline note (statistics):** `discipline_risk_level: high` for A4; **`requires_exact_data_match: true`** for `number_line_segments`; `requires_subject_expert_review: false` on fixtures but true if mechanism stats added.

---

### Climate (misconception discussion)

| Topic / activity (38-1) | Decision | Purpose | Preferred representation | Avoid |
|-------------------------|----------|---------|------------------------|-------|
| **Mechanism before template** | generate | `mechanism` | `causal_model` | Polar bear; weather snapshot as “proof” |
| **Evidence for/against** | generate | `evidence_structure` | `evidence_t_chart` | Pre-labelled true/false on cards |
| **Formative T/F** | reject | — | — | Any token — `decorative_only` / `spoiler_risk` |

**Discipline note (climate):** `canonical_form_required: true`; `discipline_risk_level: medium`; two **separate** affordances (mechanism + evidence) — not one combined poster.

---

### Humanities (Marx self-study)

| Topic / activity (38-1) | Decision | Purpose | Preferred representation | Avoid |
|-------------------------|----------|---------|------------------------|-------|
| **Text comparison** (A3) | generate | `comparison` | `comparison_framework` | Portrait collage; plot-summary art |
| **Model row** (A2) | defer | `comparison` (latent) | — (prose row first) | — |
| **Historical chain** (knowledge summary) | reject | — | — | Decorative timeline (`duplicate_existing_structure`) |
| **Factory scenario** (A4) | reject | — | — | Factory sketch (`low_pedagogical_value`) |

**Discipline note (humanities):** `canonical_form_required: true`; `discipline_risk_level: low`–`medium`; `requires_exact_data_match: false`.

---

## 4. Representation avoidance vocabulary

Formal `representation_avoid` tokens — use as **array** on generate affordances; cite in VEU negative prompts.

| Token | Reject / avoid when | Audit evidence |
|-------|---------------------|----------------|
| **`summary_table`** | Markdown/HTML table already carries the information; figure would **duplicate** (**F1**). | Inflation A2, A3, A4; Marx comparison table |
| **`filled_worksheet`** | Cells or classification outcomes pre-filled (**F6** spoiler). | Inflation A3 CSV generate uses **empty** matrix only |
| **`stock_photography`** | No cognitive job; topic decoration (**F4**). | Inflation programme; climate polar-bear class |
| **`generic_infographic`** | Unlabeled disciplinary structure (**F3** illustrated summary). | Inflation overview heroes |
| **`unsupported_causal_arrow`** | Arrow implies causation not stated in materials (**F2**). | Climate mechanism guard |
| **`numeric_claim_without_source`** | Number, endpoint, or trend not in `source_basis` (**F2**). | CI A4 — use `requires_exact_data_match` instead |
| **`topic_hero_image`** | Activity/section title illustration; maps to `decorative_only` reject. | Inflation A1, A5 |
| **`assessment_answer_visual`** | Visual encodes T/F or MCQ key. | Climate formative |
| **`author_portrait_collage`** | Humanities “comparison” becomes biography not purpose/difference. | Marx A3 |
| **`duplicate_mechanism_and_evidence`** | Single figure tries to do mechanism + evidence template jobs. | Climate — split into two affordances |

**Compose rule:** At least **one** `representation_avoid` entry required on every `visual_decision: generate` affordance (38-4).

---

## 5. Discipline fidelity fields

Use **with** `preferred_representation` — not instead of `purpose`.

### `canonical_form_required`

| Value | When required |
|-------|----------------|
| **`true`** | Discipline has standard instructional diagram form (CPI/deflator axes, radiative balance, CI number line, text comparison dimensions). **All six 38-1 generate rows.** |
| **`false`** | Not used for audited generates — default to `true` for Sprint 38 programme |

VEU/image brief: when `true`, do not substitute metaphor (money bags, polar bears, generic charts).

### `discipline_risk_level`

| Level | When | Audit examples |
|-------|------|----------------|
| **`low`** | Qualitative humanities comparison; no numeric claims in figure | Marx A3 |
| **`medium`** | Labelled frameworks; mechanisms without quantitative prediction | Inflation A2, Climate mechanism/evidence |
| **`high`** | Numeric endpoints, overlap, or statistical interpretation | CI A4 (`number_line_segments`); CI A2 if numeric widths used |

### `requires_subject_expert_review`

| Value | When |
|-------|------|
| **`true`** | Canonical form disputed, politically sensitive mechanism, or high-stakes quantitative diagram beyond fixture norms |
| **`false`** | Audited fixtures with clear `canonical_discipline_note` |

**Programme default:** `false` on fixtures; `true` when adding new disciplines or contested diagrams.

---

## 6. Quantitative fidelity guidance

### Rule (programme)

> Visuals **may not invent** values, trends, intervals, or relationships absent from **`source_basis`**.

When a figure displays numbers or endpoints:

```yaml
requires_exact_data_match: true
```

### When mandatory

| Representation | Condition |
|----------------|-----------|
| `number_line_segments` | **Always** when segments encode interval endpoints |
| `ordered_bar_strip` | When bar widths or labels imply numeric values from materials |
| `comparison_framework` | When axis or scale shows numeric index levels (rare in intro econ fixtures) |
| `causal_model` | When quantitative flux or temperature claims appear (not in audited climate fixture) |

### Audited quantitative cases

#### CI overlap (A4) — `number_line_segments`

```yaml
purpose: data_pattern_reading
preferred_representation: number_line_segments
requires_exact_data_match: true
source_basis: >
  scenario table Control (66.08, 73.92) and Treatment (70.01, 78.44) only
must_show:
  - shared axis with consistent units
  - two segments matching those endpoints
must_not_show:
  - p-values, sample sizes, or overlap verdict not in materials
disallowed_claims:
  - statistical significance declarations
  - invented midpoint comparisons
```

**Interval displays:** Table remains authoritative; figure **supports** sketching described in study tips — does not replace table or debrief.

#### CI level–width (A2) — `ordered_bar_strip`

- If figure shows **only ordinal** relationship (higher level → wider band): `requires_exact_data_match: false` acceptable.
- If figure labels **numeric widths** from template cells: `requires_exact_data_match: true`.

#### Economics indices (A2)

- Comparison framework is **qualitative** (coverage, what is tracked) — `requires_exact_data_match: false`.
- Do not plot CPI level time series unless series provided in JSON.

### Data-derived diagrams checklist

- [ ] Every number traceable to `source_basis` field path  
- [ ] Axis units match materials  
- [ ] No trend lines without coordinates in source  
- [ ] Caption does not add claims outside `allowed_claims` (38-4)  

---

## 7. Human-designer sufficiency review

> Could a competent learning designer create the intended figure from **`preferred_representation` + `purpose` + discipline note** alone?

| Token | Sufficiency | Gap closed in this doc |
|-------|-------------|-------------------------|
| `comparison_framework` | **Pass** (with discipline note) | Named dimensions + constructs for CPI/Marx |
| `classification_matrix` | **Pass** | Empty cells + header semantics |
| `causal_model` | **Pass** | Radiative balance; arrow discipline |
| `evidence_t_chart` | **Pass** | For/against structure; no verdict |
| `number_line_segments` | **Pass** | Endpoints + exact-match rule |
| `ordered_bar_strip` | **Pass** | Ordered level–width relationship |
| `labelled_contrast_panel` | **Partial** | Collapse to `comparison_framework` for 38-4 if needed |

**Versus 38-1 baseline (0/4 Pass on hooks):** Using **purpose + preferred_representation + discipline row + representation_avoid + quantitative flags**, all **six generate audit rows** reach **Pass** on designer-only brief test.

**Still requires page read for:** `source_basis` field population (material paths), not for choosing diagram **type**.

---

## 8. Example affordance snippets (38-4 ready)

### Inflation A2

```yaml
purpose: distinction
preferred_representation: comparison_framework
canonical_form_required: true
discipline_risk_level: medium
requires_exact_data_match: false
representation_avoid:
  - summary_table
  - stock_photography
  - generic_infographic
  - numeric_claim_without_source
```

### Climate mechanism + evidence (two affordances)

```yaml
# Affordance 1
purpose: mechanism
preferred_representation: causal_model
# Affordance 2
purpose: evidence_structure
preferred_representation: evidence_t_chart
```

### CI A4

```yaml
purpose: data_pattern_reading
preferred_representation: number_line_segments
requires_exact_data_match: true
discipline_risk_level: high
representation_avoid:
  - numeric_claim_without_source
  - generic_infographic
```

---

## 9. Cross-walk: 38-1 generate rows → tokens

| Audit row | `preferred_representation` |
|-----------|---------------------------|
| Inflation A2 | `comparison_framework` |
| Inflation CSV A3 | `classification_matrix` |
| Climate mechanism | `causal_model` |
| Climate evidence | `evidence_t_chart` |
| CI A2 level–width | `ordered_bar_strip` |
| CI A4 overlap | `number_line_segments` |
| Marx A3 | `comparison_framework` |

---

## Sprint 38-3 conclusion

| Deliverable | Status |
|-------------|--------|
| Final vocabulary (7 tokens, 6-mode collapsible) | Done |
| Purpose → representation map | Done — 6/6 purposes |
| Discipline map (econ, stats, climate, humanities) | Done — includes reject rows |
| `representation_avoid` | Done — 10 tokens |
| Quantitative fidelity | Done — `requires_exact_data_match` rules |
| Human-designer sufficiency | **Pass** on generate rows vs 38-1 **Fail** on hooks |

**Recommendation for 38-4:** Allow-list `preferred_representation` to the seven tokens; require `representation_avoid` ≥1 on generate; auto-set `requires_exact_data_match: true` when `preferred_representation: number_line_segments`.

**Recommendation for 38-5:** VEU analyse step maps `purpose` → `suggested_figure_type` using this table only; honour `representation_avoid` as hard negatives.

---

## Rejected scope creep (38-3)

- Visual design catalogue (colour, typography, icon sets)  
- New tokens without audit (`threshold_line`, `process_flow`, `concept_map`, `small_multiples_strip` as separate)  
- `purpose` / `representation` conflation  
- Code / schema / prompts / renderer / VEU  

---

## Regression

Observation-only — **642 pass / 0 fail** unchanged.
