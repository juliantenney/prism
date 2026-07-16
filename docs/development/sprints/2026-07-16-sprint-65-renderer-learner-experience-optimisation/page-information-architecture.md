# Sprint 65 Page-Level Information Architecture

## Task

**S65-BL-005 — Page-Level Information Architecture**

Define the clearest learner-facing **page** structure using only current renderer-available signals (S1–S3 for structure; S5 for content; S4 gated).

```text
Implementation status: Not started
```

Does **not** authorise production hardening. Does **not** redesign the BL-004 activity contract (S65-D21).

## Scope and Constraints

**In scope:** Page regions; field placement; first-viewport priority; journey; assessment; consolidation; progressive disclosure; sparse/rich fallbacks; static demos under `experiments/page-information-architecture/`.

**Out of scope:** Production `app.js` / `lib` / CSS / tests; schema; GAM; Sprint 64 prototypes; inventing progress state; inventing transition text; rewriting synthesis prose; S65-BL-006 material-role presentation.

**Settled activity contract (unchanged):** Header (± mode) → Why → Your task → Produce → How to approach it → Support → Check and improve → Reflect/Extend (omit empty).

**Page IA may wrap activities; must not replace or duplicate the activity brief.**

## Evidence Base

| Item | Path |
| ---- | ---- |
| Baseline audit | [`baseline-learner-experience-audit.md`](baseline-learner-experience-audit.md) |
| Signal inventory | [`renderer-signal-inventory.md`](renderer-signal-inventory.md) · [`signal-inventory-table.md`](signal-inventory-table.md) |
| Activity contract | [`learner-activity-contract-comparison.md`](learner-activity-contract-comparison.md) |
| Manifestation rules | [`archetype-sensitive-manifestation-rules.md`](archetype-sensitive-manifestation-rules.md) |
| Baseline HTML | [`samples/rna-hcv-baseline-render.html`](samples/rna-hcv-baseline-render.html) |
| Screenshots | [`screenshots/baseline/`](screenshots/baseline/) |
| IA demos | [`experiments/page-information-architecture/`](experiments/page-information-architecture/) |

## Samples Inspected

| Sample | Why selected | Fields present | Problem tested |
| ------ | ------------ | -------------- | -------------- |
| RNA assembled (`rna-hcv-assembled-vnext-materials-page`) + baseline HTML | Primary reference (S65-D03) | title, audience, overview, journey nav, 6 activities, meta; **no** purpose / KS / tips / LO / assessment | First-viewport actionability; overview↔journey duplication |
| RNA assessment companion | Assessment + tips pattern | overview, assessment_check, study/revision guidance, production metadata | Page-level assessment; tips after check; meta tone |
| Kitchen-sink (`renderer-kitchen-sink-page`) | Rich synthesis | overview, purpose, knowledge_summary (+ array), sequence, assessment, study_tips, metadata, 7 activities | Pre-activity wall; KS/purpose discoverability |
| Inflation workshop full | Second rich synthesis | overview, purpose, KS, sequence, assessment, activities | Generalisability of rich rules |
| Marx beat-render | Beat-rich; moderate page chrome | overview, learning_purpose_outcomes slot, activities | Orientation without full KS |
| Self-directed framing | Sparse page chrome | activities (+ cognition on rows) | Sparse omit-empty |
| Shape production metadata | Diagnostic/metadata fixture | production metadata sections | Meta gating |
| Climate discussion | Assessment-oriented sparse shell | overview, activities/assessment patterns | Assessment without activity wall |

**Fixture limitation (unchanged):** RNA lacks a long knowledge summary — S65-F05 remains **rejected on this fixture**, not confirmed page-wide. Rich-page KS conclusions use kitchen-sink / inflation (modest lengths in fixtures; rules still prepare for longer S2 bodies).

## Current Page Architecture

Observed production order (RNA baseline capture):

1. Sticky **page header** — title, overview meta + total duration, compact **journey nav** (Orient → activities)
2. **Learning Journey** section — often reprints the same overview sentence
3. **Learning Activities** — each activity: title → duration/grouping → Success looks like → What to do / Your goal → beat sections → materials
4. **About this page** (`details.util-meta`) — schema / assembly / PrismRenderNormalized
5. Assessment / study tips — **not** on primary RNA; present on companion / kitchen-sink / inflation as separate sections after (or instead of) activities

Conditional behaviour: empty synthesis slots omit; journey nav when ≥2 journey sections; meta collapsed by default; assessment omitted when absent.

**First-viewport verdict (RNA desktop):** The first screen primarily **describes the fixture document** (fixture-titled h1, duplicated overview, Orient highlight) and shows activity chrome (Success) before the high-contrast task box. Journey helps “where,” but **time-to-first-action is weak**. Missing purpose/KS/LO limit how far this single page can prove orientation depth — still enough to reject “show every field equally” and the duplicate journey intro.

## Learner Questions by Page Stage

| Stage | Questions | Primary page answer |
| ----- | --------- | ------------------- |
| Before first activity | What is this? What will I do? How does it progress? Where do I begin? | Title · concise purpose/overview · outcomes (if chrome-available) · journey · start cue |
| During | Where am I? Why this now? What kind of thinking? What’s next? | Journey position · activity mode cue (BL-004) · activity Why/bridge · next journey link |
| After | Consolidate? Assess? Review/transfer? Supporting/tech info? | Consolidation / tips · assessment · Extend inside activities · gated meta |

## Page Content Roles

| Field | Primary role | Secondary role | Preferred placement | Optionality | Duplication risk |
| ----- | ------------ | -------------- | ------------------- | ----------- | ---------------- |
| `title` | Essential orientation | — | Page header h1 | Required-ish | Medium vs document chrome |
| `audience` | Support | Destination context | Header secondary / details | Optional | Low |
| `page_profile` | Diagnostic | — | Meta only | Optional | — |
| Total duration / activity count | Essential orientation | Journey | Header meta | Derived | Low |
| Learning mode (if present) | Journey cue | — | Header secondary | Optional | Low |
| `overview` | Essential orientation | Journey intro | Concise orientation region | Optional | **High** vs journey body |
| `learning_purpose` | Destination | Essential orientation | Orientation (after or with overview) | Optional | Medium vs overview |
| `learning_outcomes` | Destination | Diagnostic today | **Not assumed in primary chrome** — see Outcomes | Optional; folded to meta today | High if raw IDs |
| `knowledge_summary` | Reference | Consolidation | Progressive / after journey or after activities | Optional | Medium vs activity text |
| `study_tips` | Support / Consolidation | — | After activities (or after assessment) | Optional | Medium vs Approach |
| `learning_sequence` | Journey | Orientation | Journey region (not duplicate overview) | Optional | Medium vs nav |
| Journey nav (derived) | Journey | Essential orientation | Header or under orientation | When ≥2 steps | Low |
| Activities | Action | — | Main sequence | Common | — |
| Coherence bridge | Progression (activity Why) | — | **Inside activity**, not journey | Optional | High if copied to journey |
| `assessment_check` | Assessment | Consolidation | After instructional sequence (page-level) | Optional | Medium vs checklist |
| Schema / assembly / diagnostics | Diagnostic | — | Gated meta | Optional | — |

## Page IA A — Current Production

**Hypothesis:** Faithful current structure is adequate.

**Sequence:** title → available synthesis sections (as emitted) → Learning Journey (often overview reprint) → activities → assessment (if any) → study tips (if any) → metadata.

**Benefit:** Source fidelity; known behaviour.  
**Risk:** Weak first-viewport action; overview duplication; rich pages become pre-activity walls; Success-before-task density (activity-level, already addressed by BL-004 but still felt at page level).  
**Best-fit:** Sparse pages that already omit empty slots.  
**Complexity:** Baseline (already shipped).

## Page IA B — Orientation First

**Hypothesis:** Stronger pre-activity orientation improves “what / why / how / begin.”

**Sequence:** compact header → concise session orientation (overview + purpose if distinct) → outcomes summary if available → journey → begin-first-activity cue → activities → assessment → consolidation/tips → gated meta.

**Benefit:** Clear destination before work.  
**Risk:** On kitchen-sink-class pages, full KS + tips still inflate the wall if not disclosed.  
**Best-fit:** Pages with purpose/outcomes and moderate synthesis.  
**Complexity:** Medium.

## Page IA C — Action First Progressive Disclosure

**Hypothesis:** Defer deep reference until the learner has begun.

**Sequence:** compact header → short purpose/overview + journey → **first activity** → optional deeper reference (KS etc.) → remaining activities → assessment → consolidation → gated meta.

**Benefit:** Fastest time-to-first-action; KS cannot block start.  
**Risk:** Learners who need conceptual preview miss it unless disclosure is discoverable; mid-sequence KS can feel odd.  
**Best-fit:** Sparse or fixture-thin pages; very long KS.  
**Complexity:** Medium.

## Optional Page IA D — Adaptive Hybrid (recommended model)

**Hypothesis:** One shared skeleton; **deterministic adaptation** by field presence / synthesis weight — not subjective “looks long.”

**Shared skeleton:**

1. Compact page header (title + secondary meta)
2. Concise orientation region (overview and/or purpose — dedupe policy)
3. Journey (nav and/or sequence summary — no overview reprint)
4. Begin cue → activities (BL-004 contract)
5. Page-level assessment (if present)
6. Consolidation / study tips (if present)
7. Reference block for knowledge summary when deferred
8. Gated developer metadata

**Adaptation proxies (safe, structural):**

| Condition | Adaptation |
| --------- | ---------- |
| Only title + activities (± overview) | Sparse: omit empty orientation slots; journey if ≥2 activities |
| overview **and** learning_purpose both present and **near-identical** | Show one in orientation; do not auto-merge prose — prefer purpose as destination if distinct job unclear, keep overview if purpose absent |
| `knowledge_summary` present | Default: **collapsible Reference after journey** (visible summary line if a short title/lead exists; else closed details with descriptive label). If KS is the **only** substantive orientation besides title, keep a short lead visible |
| `study_tips` present | After activities (or after assessment if both) |
| assessment present, 0 activities | Assessment-first page (companion pattern): header → overview → assessment → tips → meta |
| ≥3 synthesis slots among purpose / KS / tips / sequence prose | Treat as **rich**: collapse KS + tips; keep overview/purpose concise; journey visible |

**Benefit:** Combines B’s orientation clarity with C’s anti-wall behaviour.  
**Risk:** Slightly higher implementation branching — mitigated by explicit proxies.  
**Complexity:** Medium–high (prototype-worthy).

## Page Header

| Signal | Treatment |
| ------ | --------- |
| title | **Essential** — single h1 |
| audience | Secondary — one line or details |
| duration / activity count | Useful secondary in header meta |
| page_profile | Diagnostic only |
| learning mode | Secondary if present |
| schema / assembly | Never primary chrome |

**S65-PIA-001** (PIA-MUST): One primary page heading (`title`).  
**S65-PIA-002** (PIA-MUST-NOT): Do not put schema_version, assembly_state, PrismRenderNormalized, or generation diagnostics in the header.

## Session Orientation

Answers “what is this session?” and “why does it matter?”

| Section | Question | Above first activity? | Progressive? | Omit if empty? |
| ------- | -------- | --------------------- | ------------- | -------------- |
| overview | What does this cover / how organised? | Yes (concise) | Maybe if very long | Yes |
| learning_purpose | Why it matters / transferable understanding | Yes when present | Prefer visible | Yes |
| knowledge_summary | Concept reference | Usually not full open | **Yes** | Yes |
| study_tips | How to study / close | Prefer after activities | Optional | Yes |
| learning_outcomes | What I will be able to do | Only if available as learner chrome | Prefer summary | Yes |

Do **not** rewrite or synthesise new orientation text in the renderer.

## Overview and Learning Purpose

**Roles:**

- **Overview** — what the session covers and how it is organised  
- **Learning purpose** — why it matters and what transferable understanding it supports  

| Case | Treatment |
| ---- | --------- |
| Only overview | Show in orientation |
| Only purpose | Show in orientation |
| Both, distinct | Overview then purpose (or purpose first if overview is purely organisational and purpose is short) |
| Both, near-identical | Show **one**; do not concatenate blindly (**S65-PIA-010**) |
| Neither | Title + journey + begin |

Prefer shared **Session orientation** region with two labelled subparts when both exist — not two equal-weight wall sections.

## Learning Outcomes

BL-002: `learning_outcomes` **fold into metadata** when present (0/8 inventory samples in primary chrome) — **S65-F15**.

| Question | Answer for Sprint 65 |
| -------- | -------------------- |
| Visible learner orientation? | **Recommended later** only if retained data is already available to the renderer without new normalisation |
| All outcomes above activities? | No — prefer concise list or disclosure |
| Mapped outcomes at activity? | Optional secondary if field present; not observed in samples |
| Absent? | Omit heading |
| Raw outcome IDs? | **Must not** be primary learner text |

**Classification:** *Page-IA recommendation requiring existing retained data / later renderer use of already available data* — **unavailable as primary chrome under current folding**. Do not assume LOs on pages where they are absent or meta-only.

**S65-PIA-011** (PIA-SHOULD): If LOs become chrome-eligible, show as Destination under orientation (collapsible when >3).  
**S65-PIA-012** (PIA-MUST-NOT): Do not invent outcomes; do not surface raw IDs as the only label.

## Knowledge Summary

| Aspect | Finding |
| ------ | ------- |
| Purpose | Concept reference / preview — not the primary task |
| Typical length in fixtures | Modest (kitchen-sink ~hundreds of chars; inflation short) |
| Before activity | Full open KS risks wall on rich pages |
| After activity | Useful as consolidation **or** mid-page reference after journey |
| Progressive disclosure | **Preferred default when present** |
| Print | Expand / include full body |
| Sparse | Omit when absent (RNA) |

**Recommended:** Collapsible **Reference: knowledge summary** after journey (or after all activities if also used as consolidation and not needed mid-session). Never truncate destructively. Never claim RNA proved top-heavy KS (F05 fixture limit).

**S65-PIA-013** (PIA-SHOULD): KS default collapsed with accessible disclosure when present alongside other orientation.  
**S65-PIA-014** (PIA-MUST): Retain full source content; no semantic summarisation.

## Learning Journey

**Purpose:** Answer “how will this progress?” and “where am I?” without reprinting overview.

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-PIA-015 | PIA-MUST | Journey labels from activity titles (and Orient/Assessment anchors when those sections exist) |
| S65-PIA-016 | PIA-SHOULD | Number steps 1…n in list form; compact nav may abbreviate visually but accessible name keeps full title |
| S65-PIA-017 | PIA-MAY | Show archetype/mode as short text cue in journey only when valid enum present |
| S65-PIA-018 | PIA-SHOULD | Show duration when known; omit unknown — do not invent |
| S65-PIA-019 | PIA-MUST-NOT | Invent completed/current progress state beyond scroll/hash position the UI already supports |
| S65-PIA-020 | PIA-MUST | Anchor navigation to activity ids; focus target on activate |
| S65-PIA-021 | PIA-MUST-NOT | Reprint overview (or purpose) as Learning Journey body |
| S65-PIA-022 | PIA-MUST-NOT | Expose beat enums (`explanation`, `guided_practice`, …) in page journey |
| S65-PIA-023 | PIA-SHOULD | Single-activity pages: omit journey nav or reduce to one step |
| S65-PIA-024 | PIA-SHOULD | Include Assessment in journey when page-level assessment section exists |
| S65-PIA-025 | PIA-MUST-NOT | Include metadata/diagnostics in journey |

Mobile: prefer stacked/list journey over horizontal scroll-only chips unless overflow has accessible alternative. Print: static numbered list.

## Activity Sequence

| Rule | Detail |
| ---- | ------ |
| Separation | One region per activity; clear heading + id anchor |
| Numbering | Visible activity number matching journey when useful |
| Mode cues | Per BL-004 — activity-local, not page themes |
| Duration/grouping | Secondary under title |
| Bridges | Inside activity Why only |
| Prev/next | Optional micro-nav using **existing titles only** — no generated “why next” from archetype |
| Journey anchors | Do not repeat full journey under each activity |
| Rhythm | Avoid identical Success-first shells (BL-004 already) |
| Fatigue | Progressive disclosure inside activities (PEL), not page-level activity collapse of task |

**S65-PIA-026** (PIA-MUST): Do not re-print the full journey inside each activity.  
**S65-PIA-027** (PIA-MUST-NOT): Generate coherence/transition copy from archetype alone.

## Coherence Bridges

- Journey may show abstract progression (titles/order) only  
- Full `intellectual_coherence_bridge` belongs in activity **Why** (BL-004)  
- Do not duplicate bridge text in the journey  
- Short bridge preview outside the activity: **not recommended** (risk of duplication and orphaned context)

**S65-PIA-028** (PIA-MUST): Bridge → activity Why; not journey body.

## Assessment

| Pattern | When | Placement |
| ------- | ---- | --------- |
| Embedded formative | Only if artifact clearly associates items with an activity | Inside that activity (rare in samples) |
| Page-level | Distinct `assessment_check` / section | **After** instructional activities |
| Companion assessment-only | No activities | Header → overview → assessment → tips → meta |

**Answers / explanations:** Default **collapsed** / learner-controlled disclosure unless product field explicitly requires open. Print: include explanations when present. Do not guess association. Separate diagnostic metadata from assessment content.

**S65-PIA-029** (PIA-MUST): Page-level assessment after activities when both exist.  
**S65-PIA-030** (PIA-MUST-NOT): Expose answers by default without explicit product intent.  
**S65-PIA-031** (PIA-MUST-NOT): Invent assessment–activity linkage.

## Consolidation and Study Support

| Content | Placement |
| ------- | --------- |
| knowledge_summary (if deferred) | After journey and/or after activities as Reference |
| study_tips / revision guidance | After activities; after assessment if assessment-only page |
| Activity-level Extend / Reflect | Stay inside activities (BL-004) |
| Duplicative tips vs Approach | Prefer activity Approach for task-specific; page tips for session-level |

**S65-PIA-032** (PIA-SHOULD): Study tips after the instructional sequence.  
**S65-PIA-033** (PIA-MUST): Omit empty consolidation headings.

## Metadata and Diagnostics

| Field | Learner | Developer |
| ----- | ------- | --------- |
| schema_version, assembly_state, PrismRenderNormalized | Hidden from primary chrome | `details` / gated panel |
| generation notes, closure warnings | No | Gated |
| Fixture / production metadata strings | Prefer gated | Visible in meta |
| Print | Exclude diagnostics by default | — |

**S65-PIA-034** (PIA-MUST): Preserve developer observability in gated meta (S65-D06).  
**S65-PIA-035** (PIA-MUST-NOT): Diagnostic content must not interrupt orientation → journey → activities.

## First-Viewport Rules

**Principle:** Learner should normally see page identity, concise purpose/orientation, clear journey or start cue, and a visible path to the first activity — **not** multiple long prose blocks, full KS, diagnostics, detailed tips, or duplicated summaries.

| Element | Current (RNA) | IA B | IA C | Recommendation (D) |
| ------- | ------------- | ---- | ---- | ------------------ |
| Title | Yes | Yes | Yes | Yes |
| Overview reprint in Journey | Yes (problem) | No | No | **No** |
| Full KS | N/A | Open | Deferred | Collapsed / deferred when present |
| Journey nav | Yes | Yes | Yes | Yes |
| Begin cue | Implicit Orient | Explicit | Explicit | Explicit link to `#activity-1` |
| First task | Below Success chrome | After orientation | Earlier | After compact orientation |
| Meta | Collapsed | Collapsed | Collapsed | Collapsed |

Desktop: orientation + journey should leave room to glimpse first activity title.  
Mobile: same priority; accept journey as list; do not require sticky UI without evidence.

**S65-PIA-003** (PIA-MUST): First-viewport priority = identity → concise orientation → journey/start → path to first activity.  
**S65-PIA-004** (PIA-MUST-NOT): Diagnostics, full KS, and study tips must not dominate the first viewport when alternatives exist.

## Progressive Disclosure

| Content | Visible by default | Collapsible | Deferred | Print |
| ------- | ------------------ | ----------- | -------- | ----- |
| Title | Yes | No | No | Include |
| Concise overview/purpose | Yes | Long overflow MAY | No | Include |
| Journey | Yes | No | No | Numbered list |
| First activity title + task | Yes | No | No | Include |
| Produce | Yes when present | No | No | Include |
| Knowledge summary | Lead optional | **Yes** | After journey/activities OK | Expand full |
| Full outcomes list | Summary | Yes if many | — | Include |
| Study tips | No (prefer later) | Optional | After activities | Include |
| Assessment answers | No | Yes | — | Include when present |
| Metadata | No | Gated details | End | Exclude default |

**S65-PIA-005** (PIA-MUST): Never hide primary task / expected output behind disclosure.  
**S65-PIA-006** (PIA-MUST): Disclosure controls are semantic, keyboard-operable, with visible focus and descriptive labels.

## Duplication Precedence

| Overlap | Distinct jobs? | Recommended | Unsafe |
| ------- | -------------- | ----------- | ------ |
| title vs repeated document heading | No | One h1 | Multiple competing titles |
| overview vs purpose | Sometimes | Keep both only if distinct; else one | Blind concat |
| overview vs journey | No when same string | Journey = titles/order only | Reprint overview in journey |
| KS vs activity explanation | Often yes | KS reference; activity Support for task | Delete activity text |
| outcomes vs journey labels | Yes | Outcomes = destination; journey = steps | Replace journey with LO IDs |
| study tips vs Approach | Session vs task | Tips page-level; Approach activity | Duplicate tips into every activity |
| consolidation vs KS | Related | One reference region | Two full copies |
| journey vs bridge | Yes | Bridge in Why | Bridge in nav |
| assessment explanation vs checklist | Yes | Keep both roles | Merge |
| page metadata vs orientation | No | Gate meta | Meta as orientation |

## Sparse-Page Rules

| Condition | Architecture |
| --------- | ------------ |
| Title + activities only | Title → journey (if ≥2) → activities |
| Single activity | Title → activity; journey optional omit |
| No synthesis | Title → journey/start → activities |
| No LOs / assessment / tips / meta | Omit those regions entirely |
| Assessment-only | Title → overview? → assessment → tips? → meta |

**S65-PIA-007** (PIA-MUST): Omit empty page regions (S65-D05 / D20 analogue at page level).

## Rich-Page Rules

When overview + purpose + KS + sequence + tips + assessment all exist:

1. Compact orientation (overview/purpose; dedupe)  
2. Journey visible  
3. KS in disclosure or after journey  
4. Tips after activities  
5. Assessment after activities  
6. Meta gated  
7. Retain all source content  

**S65-PIA-008** (PIA-MUST): Do not delete rich content merely to shorten the page.  
**S65-PIA-009** (PIA-SHOULD): Use hierarchy + disclosure, not character truncation.

## Mobile Rules

- Compact header; wrap long titles  
- Journey as vertical list preferred over scroll-trapped horizontal chips  
- Full-width activity regions; tables in scroll containers  
- No mandatory sticky chrome without evidence  
- First activity reachable without endless pre-prose  
- Assessment options as lists  
- Meta remains end/gated  

**S65-PIA-036** (PIA-SHOULD): Prefer stacked journey on narrow viewports.

## Print Rules

Order: title + orientation → journey summary → activities → assessment → consolidation/reference → study tips → diagnostics **excluded by default**.

- Expand learner-relevant collapsed guidance (KS, tips, answer explanations if product includes them)  
- Page breaks between activities where practical  
- Tables may overflow; preserve headers  
- Independent of interactive open/closed state where possible (print CSS expands)

**S65-PIA-037** (PIA-MUST): Print order must not depend solely on ephemeral UI state.

## Accessibility Rules

- One primary page heading; section headings for orientation, journey, activities, assessment  
- `nav` labelled “Learning journey” (or equivalent)  
- Landmark structure coherent  
- Journey comprehensible without colour (text labels; current position not colour-only)  
- Disclosure semantics for collapsed regions  
- Reading order = visual order  
- Meta isolated from main  
- Skip link to first activity **MAY** if sticky header is retained  

No WCAG conformance claim.

**S65-PIA-038** (PIA-MUST): No colour-only journey or mode meaning at page level.  
**S65-PIA-039** (PIA-SHOULD): Provide accessible names for truncated journey labels.

## Evaluation Scores

Scale 1–5. Evidence: RNA baseline screenshots/HTML; kitchen-sink/inflation field presence; BL-001 scores; mockups A/B/C.

| Dimension | A Current | B Orientation | C Action-first | Evidence |
| --------- | --------- | ------------- | -------------- | -------- |
| Orientation | 3 | **5** | 4 | RNA: title+nav but thin/duplicative; B strengthens purpose slot |
| Progression | 3 | 4 | 4 | Nav S1; bridges rare; B/C remove overview reprint |
| Density | 2 | 4 | **5** | BL-001 density 2; C defers KS |
| Duplication | 2 | **4** | **5** | F06 overview↔journey |
| Accessibility | 3 | 4 | 4 | Truncation; colour progress on nav |
| Resilience | 4 | 4 | 4 | Empty omit already |
| First-viewport usefulness | 2 | 4 | **5** | `desktop-first-viewport.png` |
| Time-to-first-action | 2 | 3 | **5** | Success/chrome before task today |
| Reference discoverability | 4 | 4 | 3 | C risks hiding KS if label weak |
| Source fidelity | 5 | 5 | 5 | No rewrite |
| Mobile suitability | 3 | 4 | 4 | Truncated journey labels |
| Print suitability | 3 | 4 | 4 | Need expand rules |
| Implementation complexity | **5** | 3 | 3 | A shipped |
| Generality | 3 | 4 | 4 | Rich vs sparse |

**Aggregate read:** A inadequate on density/duplication/first viewport; B best orientation; C best time-to-action; **hybrid D** targets B+C strengths.

## Recommended Architecture

### Recommendation 4 — Adaptive hybrid

Adopt the **shared skeleton** in Page IA D with deterministic adaptation proxies (field presence / synthesis-slot count). Stance:

- **Orientation-first for essential signals** (title, concise overview and/or purpose, journey, begin cue)  
- **Action-protecting disclosure for reference** (knowledge summary, long tips)  
- **Assessment and tips after the instructional sequence**  
- **Metadata gated**  
- **Activity interiors = BL-004 only**

This is **not** Recommendation 1 (retain current) — first viewport and journey duplication are evidence-backed problems (F06, first-viewport scores).

**Recommended page sequence (canonical):**

1. Compact header (title + secondary meta)  
2. Session orientation (overview ± purpose; LO only if chrome-eligible)  
3. Learning journey (titles/order/durations — no overview reprint)  
4. Begin cue → activities (BL-004)  
5. Assessment (if any)  
6. Study tips / consolidation (if any)  
7. Knowledge summary if not already placed as post-journey reference  
8. Developer metadata (gated)

## Field Placement Summary

| Page field | Current | IA B | IA C | Recommended (D) |
| ---------- | ------- | ---- | ---- | --------------- |
| title | Header | Header | Header | Header |
| overview | Header meta + Journey body | Orientation | Short orientation | Orientation only (once) |
| learning_purpose | Section if present | Orientation | Short orientation | Orientation |
| knowledge_summary | Early section if present | Orientation open | After first activity / disclosure | Post-journey disclosure (default) |
| learning_outcomes | Meta fold | Orientation | Disclosure | Chrome only if available; else meta |
| journey nav | Header | Header/orientation | Header | Header or under orientation |
| activities | Main | Main | Main (earlier) | Main |
| assessment | After / companion | After | After | After activities |
| study_tips | Variable / companion end | After | After | After activities (± after assessment) |
| metadata | End details | Gated end | Gated end | Gated end |

## Page-Level Rule Register

| Rule ID | Level | Rule | Applies to | Evidence | Prototype validation? |
| ------- | ----- | ---- | ---------- | -------- | --------------------- |
| S65-PIA-001 | PIA-MUST | Single page h1 from title | Header | SIG-P01 | No |
| S65-PIA-002 | PIA-MUST-NOT | No diagnostics in header | Header | F08a | No |
| S65-PIA-003 | PIA-MUST | First-viewport priority stack | Viewport | BL-001 screenshots | Yes |
| S65-PIA-004 | PIA-MUST-NOT | KS/tips/meta must not dominate first viewport | Viewport | F05/F06 | Yes |
| S65-PIA-005 | PIA-MUST | Task/output never default-hidden | Disclosure | BL-004 MR-002 | Yes |
| S65-PIA-006 | PIA-MUST | Accessible disclosure controls | Disclosure | A11y | Yes |
| S65-PIA-007 | PIA-MUST | Omit empty page regions | Sparse | D05 | Yes |
| S65-PIA-008 | PIA-MUST | Retain rich source content | Rich | PREC materials | Yes |
| S65-PIA-009 | PIA-SHOULD | Hierarchy/disclosure not truncation | Rich | Kitchen-sink | Yes |
| S65-PIA-010 | PIA-MUST-NOT | Blind-merge overview+purpose | Orientation | F06 analogue | Yes |
| S65-PIA-011 | PIA-SHOULD | LOs as destination if chrome-eligible | Outcomes | F15 | Yes |
| S65-PIA-012 | PIA-MUST-NOT | Invent LOs / raw ID-only labels | Outcomes | F15 | No |
| S65-PIA-013 | PIA-SHOULD | KS collapsible when present with other orientation | KS | Kitchen-sink | Yes |
| S65-PIA-014 | PIA-MUST | Full KS retention | KS | Source fidelity | No |
| S65-PIA-015 | PIA-MUST | Journey labels from titles | Journey | SIG-P10 | No |
| S65-PIA-016 | PIA-SHOULD | Numbering + accessible full titles | Journey | Truncation F | Yes |
| S65-PIA-017 | PIA-MAY | Mode cue in journey when valid | Journey | BL-004 | Yes |
| S65-PIA-018 | PIA-SHOULD | Duration when known | Journey | SIG-A04 | No |
| S65-PIA-019 | PIA-MUST-NOT | Invent progress completion state | Journey | Charter | No |
| S65-PIA-020 | PIA-MUST | Anchor + focus targets | Journey | Nav HTML | Yes |
| S65-PIA-021 | PIA-MUST-NOT | Overview reprint as journey body | Journey | F06 | Yes |
| S65-PIA-022 | PIA-MUST-NOT | Beat enums in journey | Journey | F03 | No |
| S65-PIA-023 | PIA-SHOULD | Omit/simplify journey for 1 activity | Sparse | — | Yes |
| S65-PIA-024 | PIA-SHOULD | Assessment in journey when present | Assessment | Companion | Yes |
| S65-PIA-025 | PIA-MUST-NOT | Meta in journey | Meta | D06 | No |
| S65-PIA-026 | PIA-MUST | No full journey repeat per activity | Activities | Density | Yes |
| S65-PIA-027 | PIA-MUST-NOT | Invent transition text from archetype | Bridges | BL-004 | No |
| S65-PIA-028 | PIA-MUST | Bridge in activity Why only | Bridges | BL-004 | Yes |
| S65-PIA-029 | PIA-MUST | Page assessment after activities | Assessment | Companion/KS | Yes |
| S65-PIA-030 | PIA-MUST-NOT | Answers open by default w/o intent | Assessment | SIG-V04 | Yes |
| S65-PIA-031 | PIA-MUST-NOT | Guess assessment–activity link | Assessment | — | No |
| S65-PIA-032 | PIA-SHOULD | Tips after instructional sequence | Tips | Companion | Yes |
| S65-PIA-033 | PIA-MUST | Omit empty consolidation | Tips | D20 | No |
| S65-PIA-034 | PIA-MUST | Gated developer meta retained | Meta | D06 | Yes |
| S65-PIA-035 | PIA-MUST-NOT | Diagnostics interrupt journey | Meta | F08a | Yes |
| S65-PIA-036 | PIA-SHOULD | Stacked journey on mobile | Mobile | mobile screenshots | Yes |
| S65-PIA-037 | PIA-MUST | Print independent of UI state | Print | — | Yes |
| S65-PIA-038 | PIA-MUST | No colour-only page meaning | A11y | MR-011 | Yes |
| S65-PIA-039 | PIA-SHOULD | Accessible names for truncated labels | A11y | Journey truncate | Yes |
| S65-PIA-040 | PIA-MUST | Page IA must not alter BL-004 activity slots | Activities | D21 | No |
| S65-PIA-041 | PIA-MUST | Use only S1–S3 for page structure cues | Signals | D01/D13 | No |
| S65-PIA-042 | PIA-SHOULD | Explicit begin link/button to first activity | Viewport | First-viewport | Yes |

**Count:** 42 rules (S65-PIA-001 … S65-PIA-042).

## Rules Requiring Prototype Validation

PIA-003–009, 010, 011, 013, 016–017, 020–021, 023–024, 026, 028–030, 032, 034–039, 042 — especially overview dedupe, KS disclosure placement, journey truncation a11y, assessment answer defaults, print expansion, mobile journey stacking.

## Rejected Alternatives

| Alternative | Why rejected |
| ----------- | ------------ |
| Retain current IA unchanged (Rec 1) | First-viewport and overview↔journey duplication confirmed |
| Always open full KS before activities | Recreates pre-activity wall on rich pages; RNA didn’t prove need |
| Force action-first for all pages (pure Rec 3) | Under-serves destination when purpose/outcomes exist and KS absent |
| Journey-led hub / SPA shell | Requires new application shell — out of scope |
| Reference sidebar layout | New layout system; mobile failure risk |
| Invent progress % / completed ticks without data | PIA-019 |
| Promote learning_outcomes from meta without confirming chrome availability | F15 — do not assume |
| Auto-summarise KS/overview | Forbidden content invention |
| Colour-coded page themes per archetype | Conflicts with MR-011 / PIA-038 |
| Duplicate activity Why from page overview | Page must not replace activity contract |

## Constraints for S65-BL-006 and S65-BL-007

**BL-006 (material role / beat presentation):** Operates **inside** activities; must respect page journey (no beat enums in page nav) and residual policies from BL-004.

**BL-007 (prototype):** Implement adaptive hybrid skeleton + BL-004 activities on RNA first; validate kitchen-sink rich disclosure; assessment companion; sparse framing page; no schema/GAM; reversible; meta gated.

## Unknowns

- True long-form knowledge-summary behaviour on live (non-fixture) pages  
- Whether `learning_outcomes` can be lifted to chrome without normalisation change  
- Sticky-header necessity vs scroll-cost on mobile  
- Product intent for assessment answer default-open on specific programmes  

## Conclusion

Current production page IA is navigable but **first-viewport-weak** and **duplicative** on the RNA reference. The recommended architecture is **Recommendation 4 — Adaptive hybrid**: essential orientation + journey before activities; knowledge summary and tips handled by disclosure/placement rules; assessment after the sequence; metadata gated; activities unchanged from BL-004.

**Next:** S65-BL-006 — Material role and beat presentation.
