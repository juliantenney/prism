# Sprint 65 Baseline Learner-Experience Audit

## Task

**S65-BL-001 — Baseline Learner-Experience Audit**

Establish an evidence-backed baseline of the current learner-facing renderer experience using the RNA reference page, without changing production renderer behaviour.

## Scope and Constraints

**In scope:** Observation of current production render output; classification of problems; scoring; traceability; screenshot/HTML capture via a non-production harness.

**Out of scope for this task:**

- Renderer, application, library, schema, or GAM changes
- Sprint 64 prototype code reuse
- Implementation design treated as approved
- S65-BL-002 and later backlog items

**Implementation status remains:**

```text
Not started
```

## Reference Inputs

| Role | Path |
| ---- | ---- |
| Primary page fixture | [`tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`](../../../../tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json) |
| Assessment companion | [`tests/fixtures/page-render/ld-rna-hcv-assessment-page.json`](../../../../tests/fixtures/page-render/ld-rna-hcv-assessment-page.json) |
| Scoring framework | [`evaluation-framework.md`](evaluation-framework.md) |
| Prior provisional findings | [`findings-log.md`](findings-log.md) |

**Fixture note:** The primary fixture is the Sprint 62 material-completeness reference. It is intentionally thin (marker strings, sparse cognition fields). Findings that depend on that thinness are labelled **F1** where they cannot yet be generalised.

## Render Capture Method

| Item | Value |
| ---- | ----- |
| Command | `node docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/capture-baseline-render.js` |
| Harness | [`samples/capture-baseline-render.js`](samples/capture-baseline-render.js) (audit-only; not production) |
| Renderer entry point | `window.__PRISM_TEST_API.buildUtilityStructuredHtmlForTest(page, ["sections"], { applyCompositionValidation: false })` |
| Production sources used | `app.js` (`buildUtilityStructuredHtml` / structured page render) · [`lib/page-render-normalize.js`](../../../../lib/page-render-normalize.js) |
| Capture metadata | [`samples/rna-hcv-baseline-render.capture.json`](samples/rna-hcv-baseline-render.capture.json) |
| Git at capture | head `e0d6b67`, dirty working tree |
| Environment | Node `v24.15.0`, win32, cwd `c:\xampp\htdocs\prism` |
| Structural analysis | [`samples/analyze-baseline-html.js`](samples/analyze-baseline-html.js) → [`samples/rna-hcv-baseline-structure.json`](samples/rna-hcv-baseline-structure.json) |

Screenshots were taken from the captured HTML served via XAMPP (`http://localhost/prism/.../samples/...`). Cursor browser capture used inverted/dark chrome; **contrast failures in screenshots are treated as suspected environment artifacts**, not confirmed production CSS defects, unless reproduced in light mode.

## Baseline Artifacts

### HTML

| Artifact | Path |
| -------- | ---- |
| Primary baseline render | [`samples/rna-hcv-baseline-render.html`](samples/rna-hcv-baseline-render.html) |
| Assessment companion render | [`samples/ld-rna-hcv-assessment-baseline-render.html`](samples/ld-rna-hcv-assessment-baseline-render.html) |

### Screenshots (`screenshots/baseline/`)

| Capture | Path |
| ------- | ---- |
| Desktop first viewport | [`screenshots/baseline/desktop-first-viewport.png`](screenshots/baseline/desktop-first-viewport.png) |
| Desktop understand (A1) | [`screenshots/baseline/desktop-activity-understand-a1.png`](screenshots/baseline/desktop-activity-understand-a1.png) |
| Desktop apply (A3) | [`screenshots/baseline/desktop-activity-apply-a3.png`](screenshots/baseline/desktop-activity-apply-a3.png) |
| Desktop analyse (A4) | [`screenshots/baseline/desktop-activity-analyse-a4.png`](screenshots/baseline/desktop-activity-analyse-a4.png) |
| Desktop evaluate (A6) | [`screenshots/baseline/desktop-activity-evaluate-a6.png`](screenshots/baseline/desktop-activity-evaluate-a6.png) |
| Desktop assessment | [`screenshots/baseline/desktop-assessment-companion.png`](screenshots/baseline/desktop-assessment-companion.png) |
| Desktop About this page | [`screenshots/baseline/desktop-meta-about-this-page.png`](screenshots/baseline/desktop-meta-about-this-page.png) |
| Desktop/mobile wide table | [`screenshots/baseline/desktop-wide-table-planning.png`](screenshots/baseline/desktop-wide-table-planning.png) · [`screenshots/baseline/mobile-wide-table-planning.png`](screenshots/baseline/mobile-wide-table-planning.png) |
| Mobile first viewport | [`screenshots/baseline/mobile-first-viewport.png`](screenshots/baseline/mobile-first-viewport.png) |
| Mobile representative activity | [`screenshots/baseline/mobile-activity-understand.png`](screenshots/baseline/mobile-activity-understand.png) |
| Mobile assessment question | [`screenshots/baseline/mobile-assessment-question.png`](screenshots/baseline/mobile-assessment-question.png) |

### Print

Static inspection of embedded `@media print` rules in `app.js` (learning header and journey nav hidden; tables allowed to break; meta retained with border). No separate PDF generated — repository tooling already embeds print CSS in the HTML document.

## Executive Findings

1. **Shared activity shell** — Across understand / apply / analyse / evaluate, the visible grammar is largely the same: title → duration/grouping → Success / What to do or Your goal → beat sections → materials. Materials differ; the shell does not.
2. **Beat label “Understand” undercuts mode** — `explanation` beats always render as learner-facing **Understand** (`lib/beat-material-registry.js` → `LEARNER_FACING_EPISODE_FUNCTION_LABELS`), including on apply/analyse/evaluate activities.
3. **Success ↔ checklist duplication** — `buildLearnerJourneyFrameHtml` promotes checklist criteria (and often expected output) into “Success looks like”, then the checklist material still renders under “Check your work”.
4. **Material-type / fixture-title leakage** — Headings such as **Text**, **Template**, **Transfer Prompt**, and titles like `S62 RNA A3-M2 Outbreak Scenario` appear as learner-facing h4/h5.
5. **Beat–material ordering failures** — Planning table (A3) appears after verification; A4 exposition and A5 worked example appear after checklist (orphan materials via `_render_sequence` residual path).
6. **Page orientation is shallow on this fixture** — Journey nav exists, but Learning Journey body repeats overview meta; knowledge summary / learning outcomes / study tips absent from primary fixture (F1).
7. **Diagnostics** — Collapsed `details.util-meta` “About this page” (Schema Version, Assembly State, PrismRenderNormalized) is D1. Fixture marker strings (`Marker S62-…`, `Criterion S62-…`) are F1/C1 content, not invented by the renderer.
8. **“Body” labels** — Not observed on this capture (0 occurrences). Initial Body hypothesis rejected for this baseline; replaced by Text / fixture-title findings.

## Evaluation Scores

Scale: 1 poor · 2 weak · 3 adequate · 4 strong · 5 excellent.

| Dimension | Score | Evidence (one line) | Reference | Confidence | Limitations |
| --------- | ----- | ------------------- | --------- | ---------- | ----------- |
| Orientation | 3 | Title + sticky journey nav present; Learning Journey duplicates meta; fixture title reads as test artefact | `desktop-first-viewport.png` · HTML h1/nav | High | Thin page synthesis fields |
| Action clarity | 3 | “What to do” / “Your goal” usually clear once scrolled past Success | A1/A3 screenshots · `util-activity-task--primary` | High | Success block often appears first |
| Output clarity | 3 | Success looks like lists criteria + deliverable; overlaps checklist | A1 Success + Checklist | High | Promotion logic in `buildLearnerJourneyFrameHtml` |
| Cognitive mode | 2 | No archetype label; “Understand” beat on non-understand activities | A3/A6 screenshots · beat registry | High | Mode inferred only from titles/materials |
| Progression | 3 | Journey nav + sequence; no why-next / coherence bridges on this fixture | Nav + Learning Journey section | Medium | Missing bridge fields = F1 + possible A1 |
| Material role | 2 | Type labels (Text/Template/Transfer Prompt) and fixture titles dominate role clarity | Material h4/h5 in HTML | High | Richer titles may help on live pages |
| Verification | 3 | Checklist under Check your work; partially pre-consumed by Success | A1/A3 | High | Duplication weakens verification moment |
| Transfer | 2 | Only A6 shows Apply elsewhere / Transfer Prompt; others have none | A6 screenshot | Medium | Absence is mostly source/fixture |
| Density | 2 | Framing + beats + type labels + markers before primary workspace | First viewport / A1 | High | Fixture markers inflate noise |
| Duplication | 2 | Overview↔journey meta; success↔checklist criteria | HTML structure JSON | High | Some reinforcement may be intentional |
| Accessibility | 3 | Landmarks/headings mostly sound; journey text truncated; meta in `details` | Snapshot + print CSS | Medium | No full WCAG audit; contrast env-suspect |
| Resilience | 3 | Missing optional cognition fields omit blocks (no empty “How to think” labels here) | Structure vs fixture fields | Medium | Broader missing-field matrix → BL-002 |

**Convenience average (not authoritative):** ≈ **2.6 / 5**.

## Page-Level Audit

| Element | Present on primary fixture? | Manifestation | Problem / note | Class |
| ------- | --------------------------- | ------------- | -------------- | ----- |
| Title | Yes | h1 includes “Material Completeness Fixture” | Reads as test/dev page | F1 (+ mild D1) |
| Overview / meta | Yes | Subtitle under h1 | Repeated in Learning Journey | R1 |
| Learning purpose | No | — | Absent | F1 |
| Knowledge summary | No | — | Top-heavy summary hypothesis not testable here | F1 |
| Learning outcomes | No | — | Absent | F1 |
| Learning journey | Yes | h2 + duplicated overview text + sticky nav | Nav truncates labels (`util-journey-nav--compact`) | R1 |
| Study tips | No on primary; Yes on assessment companion | Assessment: “Study and Revision Guidance” | Companion richer than primary | F1 |
| Assessment | Companion only | Formative Assessment Check + MCQs | Primary page has no assessment section | F1 |
| Metadata / diagnostics | Yes | `details.util-meta` About this page | Collapsed by default; developer-oriented | D1 |

## Activity-Level Audit

Representative activities: **A1** understand · **A3** apply · **A4** analyse · **A6** evaluate.

| Element | Observation | Renderer path (primary) | Class |
| ------- | ----------- | ----------------------- | ----- |
| Activity title | Clear instructional titles | Activity article header in `renderLearningActivitiesBlocks` | OK |
| Archetype | In JSON (`archetype`) but not learner-visible as mode label | Episode plan / activity row; no dedicated mode chrome | R1 (signalling) / A1 (deep plan fields) |
| Grouping / duration | Shown (“Individual”, “10 mins”) | Activity meta strip | OK |
| Activity preamble | Absent on this fixture | `renderActivityFramingForActivity` | F1 |
| Coherence bridge | Absent | Same | F1 / A1 if never present post-GAM |
| Reasoning orientation | Absent | `renderCognitionFieldsForActivity` | F1 |
| Learner task | Present as What to do / Your goal | `buildLearnerJourneyFrameHtml` + framing | R1 (order vs Success) |
| Expected output | Often folded into Success looks like | `buildLearnerJourneyFrameHtml` | R1 |
| Transformation activity | Not separately labelled | Materials/beats | F1 |
| Self-explanation / transfer | Transfer only on A6 as material | Beat `transfer` → “Apply elsewhere” | R1 labelling · F1 coverage |
| Success / verification | Success looks like + Checklist | Journey frame + checklist material | R1 duplication |
| Mapped LOs | Not visible | — | F1 / A1 |

## Archetype Comparison

| Dimension | Understand (A1) | Apply (A3) | Analyse (A4) | Evaluate (A6) |
| --------- | --------------- | ---------- | ------------ | ------------- |
| Visible mode signalling | Title only; first beat “Understand” | Title only; still opens with “Understand” | Title only; starts “See it modelled” (no explanation beat first) | Title only; opens “Understand” |
| Primary action | Study materials + classification table | Read scenario + planning table | Modelling note + scenario + analysis table | Decision table + memo + transfer |
| Support-material order | Explain → model → practice → check | Explain → scenario → **check then table** (broken) | Model → scenario → table → check → **orphan Text** | Explain → model → practice → transfer → check |
| Expected learner product | Classification table + checklist | Planning table + checklist | Analysis table + checklist | Decision table + memo + transfer + checklist |
| Verification | Checklist (dup Success) | Checklist then table after | Checklist then orphan text | Checklist after transfer |
| Transfer | None | None | None | Transfer Prompt under Apply elsewhere |
| Visual / semantic differentiation | Material mix differs; shell same | Same shell; scenario title leak | Same shell; orphan material | Same shell + transfer beat |

**Could a learner identify the intended kind of thinking without reading implementation metadata?**

**Mostly no.** Titles and workspaces hint at classify / plan / analyse / evaluate, but shared shell + universal “Understand” beat (where explanation materials exist) and absent archetype chrome mean mode is not structurally signalled. Answer based on rendered HTML/screenshots, not on JSON `archetype` fields.

## Material-Level Audit

| Element | Manifestation | Problem | Class |
| ------- | ------------- | ------- | ----- |
| Material title | Often type label or fixture title | “Text”; `S62 RNA … Scenario` | R1 / F1 |
| Material type | Shown as heading (Text, Template, Worked Example, …) | Implementation-facing for some types | R1 |
| Instructional function | Not separately shown | Relies on beat + type | R2 |
| Beat association | `util-beat-section` + `data-episode-function` | Learner sees phase label, not function id | OK / R1 for label map |
| Explanation prose | Under Understand → Text | Marker prefixes | F1/C1 |
| Worked example / sample output | Under See it modelled | Clearer role than Text | Partial OK |
| Scenario | Under Your turn → Scenarios → fixture h5 | Title leak | R1/F1 |
| Modelling note | Present on A4 | Good role signal | OK |
| Learner table / template | Classification / Planning / Decision / Template | A3 table after verification | R1 order |
| Checklist | Check your work | Dup with Success; criterion IDs | R1 + F1 |
| Unknown-material fallback | Not triggered on this fixture | — | Unknown — requires S65-BL-002 signal inventory or later cross-sample validation |

## Information Density and Duplication

| Item A | Item B | Exact overlap | Useful reinforcement or avoidable? | Likely owner |
| ------ | ------ | ------------- | ---------------------------------- | ------------ |
| Header meta | Learning Journey body | Same overview sentence | Avoidable | Renderer (R1) |
| Success looks like bullets | Checklist criteria | Same criterion text | Mostly avoidable double presentation | Renderer promotion (R1) |
| Success looks like deliverable | Expected output | Expected output appended into Success | Useful condensation if checklist not also shown | Renderer (R1) |
| Activity title | Journey nav label | Same title (truncated in nav) | Useful reinforcement | OK |
| Fixture markers in body | Criterion IDs | Parallel test IDs | Avoidable for learners | Content/fixture (F1/C1) |
| Overview vs learning purpose | — | N/A (purpose absent) | — | F1 |
| Transfer vs application instruction | — | Only A6 transfer material | N/A | F1 |

## Progression and Sequencing

- Sticky journey nav provides **where am I** with current link state.
- Compact mode truncates labels (visual “typos” such as Outbreal/Treatmer in some captures are **CSS truncation**, not content errors).
- Learning Journey intro does not explain progression logic.
- No intellectual coherence bridges on this fixture.
- Residual material render after beat groups breaks in-activity sequence (A3/A4/A5).

## Diagnostics and Metadata

| Content | Default visibility | Developer value | Learner value | Risk | Gating | Status |
| ------- | ------------------ | --------------- | ------------- | ---- | ------ | ------ |
| About this page (`details.util-meta`) | Collapsed | High (schema, assembly, normalize flag) | Low | Discovery if expanded; print may show | Native `<details>` | D1 — R1 gating/prominence |
| Schema Version / Assembly State / PrismRenderNormalized | Inside meta | High | None | Confuses authenticity | Same | D1 |
| Fixture title “Material Completeness Fixture” | Always | High for tests | Negative | Trust / tone | Source title | F1 |
| Marker / Criterion ID strings | Always | High for completeness tests | Negative | Noise | Source body | F1/C1 |
| Beat-render console diagnostic | Console only | High | None | None in HTML | `console.log` in beat path | OK (not learner-visible) |
| Assessment Production Metadata / Fixture Id | Visible on companion | High | Low | Tone | Meta section | D1 |

## Accessibility

| Topic | Status | Note |
| ----- | ------ | ---- |
| Heading hierarchy | Confirmed mostly sound | h1 → h2 sections → h3 activities → h4 beats/materials; meta uses h2 inside details (awkward) |
| Landmarks | Confirmed | `nav[aria-label=Learning journey]`, articles/sections |
| Semantic lists | Confirmed | Success / checklist / assessment options as lists |
| Table headings | Confirmed present | Planning table has headers; one header cell contains marker text (content) |
| Form / worksheet affordances | Suspected weak | Tables are display worksheets, not inputs |
| Keyboard / focus | Not assessed | Interactive set mostly links + details summary |
| Colour-independent meaning | Suspected OK | Journey uses text + current state; green accent supplementary |
| Collapsible meta semantics | Confirmed | `<details>`/`<summary>` |
| Responsive reading order | Confirmed | Single column; sticky header reduces viewport |
| Print reading order | Suspected adequate | Header/nav hidden; content retained — not PDF-verified |
| Contrast in screenshots | Suspected environment artifact | Do not treat as confirmed production defect |

No full WCAG conformance claim.

## Responsive and Print Behaviour

- **Mobile:** First viewport and activity readable; journey labels more truncated; wide planning table remains horizontally constrained (scroll container classes exist in CSS).
- **Print:** `@media print` hides `.util-learning-header` and `.util-journey-nav`; softens cards; keeps meta with border. Activity `break-inside` rules present. Print fragmentation risk for long activities with many beat sections — **suspected**, not confirmed via PDF.

## Resilience and Fallback Behaviour

On this fixture, absent optional framing/cognition fields simply omit those blocks (no empty “Study orientation” / “How to think” labels observed).

Orphan materials after verification show residual sequencing rather than empty containers.

Broader missing-field behaviour:

```text
Unknown — requires S65-BL-002 signal inventory or later cross-sample validation.
```

## Traceability Table

| Learner-facing element | Source field | Renderer path | Current manifestation | Problem | Renderer-addressable? |
| ---------------------- | ------------ | ------------- | --------------------- | ------- | --------------------- |
| Page title | `title` / page name | `buildUtilityStructuredHtml` header | Fixture-named h1 | Test tone | Partial (display) / F1 (source) |
| Overview meta | overview / description | Header meta + journey intro | Duplicated sentence | Redundant journey body | **R1** |
| Learning journey nav | Activity titles + order | `buildLearnerJourneyNavHtml` · `.util-journey-nav` | Sticky truncated links | Truncation; no why-next | **R1** (presentation) |
| About this page | assembly / schema meta | `details.util-meta` ~`app.js` meta section | Collapsed technical summary | Learner-facing residue | **D1 → R1** gating |
| Activity title | activity title | Activity header | Clear h3 | — | OK |
| Duration / grouping | duration, grouping | Activity meta | Visible | — | OK |
| Success looks like | checklist criteria + `expected_output` | `buildLearnerJourneyFrameHtml` | Bulleted success block | Dup with checklist; often first | **R1** |
| What to do / Your goal | `learner_task` / task | Same + primary task classes | Clear action when present | Order vs success | **R1** |
| Beat “Understand” | `episode_plan.beats[].function` = explanation | `learnerFacingBeatLabel` ← `LEARNER_FACING_EPISODE_FUNCTION_LABELS` | h4 Understand | Mode confusion on non-understand | **R1** |
| Material “Text” | material type / key | `prettyMaterialHeading` / type heading | h4 Text | Generic label | **R1** |
| Scenario fixture title | material title | Scenario card h5 | `S62 RNA A3-M2…` | Dev title leak | **R1** filter / F1 source |
| Checklist | checklist material | Checklist block under Check your work | Criteria with IDs | Dup + IDs | **R1** + F1 |
| Planning table position | beat plan + residual sequence | Beat loop then `_render_sequence` | Table after checklist | Broken closure | **R1** |
| Transfer Prompt label | transfer material | Beat Apply elsewhere + type heading | “Transfer Prompt” | Implementation-facing | **R1** |
| Marker body text | material body | Markdown/body render | `Marker S62-…` | Noise | **F1/C1** |
| Deep archetype plan fields | upstream plan | Not in page artifact | Unavailable | Cannot signal stages/links/constraints | **A1** — Known architecture ceiling — not a Sprint 65 renderer defect. |

## Renderer-Addressable Findings

| ID | Finding | Class |
| -- | ------- | ----- |
| S65-F00 | Repetitive activity shells across archetypes | **R1** Confirmed |
| S65-F03 | Incomplete archetype / mode differentiation (esp. Understand beat) | **R1** Confirmed |
| S65-F04b | Generic type labels (Text, Template, Transfer Prompt) and fixture titles | **R1** Confirmed (refined from Body) |
| S65-F06 | Overview/journey duplication; Success↔checklist duplication | **R1** Confirmed |
| S65-F09 | Beat–material residual ordering / orphan materials | **R1** Confirmed |
| S65-F08a | About this page / production metadata prominence | **D1** Confirmed (gating is R1) |
| S65-F02 | Primary task diluted by Success-first ordering and material density | **R1** Partial |

## Partial or Content-Owned Findings

| Finding | Class | Note |
| ------- | ----- | ---- |
| Marker / Criterion ID strings | **F1/C1** | Fixture content for completeness tests |
| Missing preamble / reasoning / bridges / LO / knowledge summary | **F1** (possibly **A1** if never post-GAM) | Not inventable by renderer |
| Transfer sparse except A6 | **F1** | Source coverage |
| Thin instructional prose | **C1/F1** | Content quality |
| Mode signalling without new plan fields | **R2** | Renderer can improve composition; cannot restore missing plan depth |

## Fixture Limitations

- Primary fixture is Sprint 62 **material completeness** fixture, not a rich live synthesis page.
- Cognition framing fields largely absent → under-tests fragmented-purpose and top-heavy knowledge-summary hypotheses.
- Marker strings exaggerate diagnostic noise relative to production content.
- Assessment lives on a **companion** fixture, not the primary page.

## Known Architecture Ceilings

Where required instructional structure is unavailable after GAM (Sprint 63 settled):

```text
Known architecture ceiling — not a Sprint 65 renderer defect.
```

Applies to attempting to restore or invent: `required_links`, `stages`, `key_relationships`, `governing_constraint`, and other non-recoverable archetype-plan detail. Sprint 65 may only compose **available** page fields.

## Rejected Initial Hypotheses

| Provisional | Disposition | Counter-evidence |
| ----------- | ----------- | ---------------- |
| S65-F04 “Body” labels | **Rejected** for this capture | Zero “Body” headings in baseline HTML; replaced by Text/type/fixture-title finding |
| S65-F05 top-heavy knowledge summary | **Rejected** on this fixture | No knowledge summary section present (F1 — may reappear on richer pages) |
| S65-F01 heavily fragmented labelled cognition blocks | **Weakened** | Few framing/cognition blocks on this fixture; still no single coherent contract when framing is thin — retain refined provisional for richer samples |

## Implications for S65-BL-002 to S65-BL-006

| Backlog | Implication from baseline |
| ------- | ------------------------- |
| **S65-BL-002** | Inventory stable fields actually present vs absent on RNA + note A1 ceilings; include beat label map and success-promotion inputs |
| **S65-BL-003** | Compare activity-contract compositions that elevate primary task and reduce Success↔checklist collision without new schema |
| **S65-BL-004** | Archetype-sensitive rules must address universal “Understand” beat labelling and shell sameness |
| **S65-BL-005** | Page IA: journey intro vs overview; sticky-nav truncation; assessment companion integration patterns |
| **S65-BL-006** | Material role presentation: suppress/relabel Text/Template/Transfer Prompt; fix residual beat ordering; scenario title policy |

Do **not** treat these as approved designs — only audit implications.

## Conclusion

The current production renderer produces a coherent, navigable learning page with useful journey framing and beat structure, but the learner experience is weakened by **shared shells**, **mode-confusing beat labels**, **success/checklist duplication**, **material-type and fixture-title leakage**, and **residual material ordering**. Several charter hypotheses were confirmed; Body labels and top-heavy knowledge summary were not supported on this fixture. Deep plan restoration remains an architecture ceiling. **Implementation remains not started**; next work is **S65-BL-002 — Renderer Signal Inventory**.
