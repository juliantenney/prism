# Sprint 99 — M2 focused investigation (read-only)

**Date:** 2026-11-16  
**Status:** Complete (documentation only — no code)  
**Decision:** [S99-D03](decisions.md#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope)  
**Cases (M1):** *From gradients to equations*; *What makes a claim true?*; *What Changed, and Why It Matters*

---

## A. Academic Plain English reach

**Definition (Sprint 98):** Academic Plain English communicates complex ideas using the clearest language appropriate to the learner's level, while preserving conceptual precision, disciplinary terminology and intellectual challenge.

### Pipeline reach map

| Stage | APE (`LD-GAM-INSTRUCTIONAL-DEPTH` APE block) | Related editorial guidance that *does* reach |
| ----- | ------------------------------------------- | -------------------------------------------- |
| GLC (Expository sibling) | **No** | Judgement elaboration; avoid filler; audience/level; **S98-D08** typography |
| LO | **No** | Understanding-oriented outcomes; **S98-D08**; EQF only if LO step id matches Interactive EQF target list |
| MK | **No** | Domain guidance; **S98-D08** |
| EJP | **No** | Extent as planning constraint; purpose-fit; **S98-D08**; EQF **does not** target EJP |
| XD | **No** | EQ register (restrained metacommentary); continuity; commissioning complementarity; consolidation; **S98-D08**; EQF **does not** target XD |
| XM | **No** — confirmed by `tests/interactive-academic-plain-english-guidance.test.js` | Structured-label honesty; complementary fields; **S98-D08**; EQF **does not** target XM |
| Design Page | **No** | Thin chapter presentation; **S98-D08** |
| Assembly | N/A (no prose rewrite) | Passthrough |
| Renderer | N/A | Does not inject APE |

**Confirmed:** Interactive APE is GAM-only and does not apply on `promptRoute === "expository"`. Expository sibling templates do not contain the Academic Plain English definition or the Interactive layer-purpose / repetition-economy blocks.

### Adequacy against APE expectations

| Expectation | Expository coverage today |
| ----------- | ------------------------- |
| Prefer direct, intelligible sentences over inflated academic prose | **Partial** — EQ register discourages stock metacommentary; no explicit APE clarity principle |
| Introduce disciplinary terms clearly and use them consistently | **Partial** — audience/level and domain guidance; no explicit “introduce then reuse” APE rule |
| Explain difficult relationships rather than merely simplifying terminology | **Stronger** — richness / intervening explanation culture in XD; judgement elaboration |
| Progressive development via examples, contrasts, representations | **Stronger** — EJP/XD journey + selective commissions |
| Necessary reinforcement vs avoidable repetition | **Partial** — EQ8 consolidation + XM complementary rules; no shared APE productive/unproductive repetition block |
| Avoid unnecessary metadiscourse / procedural narration | **Partial** — EQ6 restrained register |
| Preserve uncertainty, qualifications, notation, difficulty | **Stronger** — epistemic_form binding; EQ6 epistemic confidence |
| Respect S98-D08 discretionary-emphasis ban | **Present** (guidance inject) — **not generation-validated** on these cases’ assembled JSON |

### Transferable vs Interactive-specific

| Transferable (adapt for Expository) | Interactive-specific (do **not** transplant) |
| ----------------------------------- | -------------------------------------------- |
| APE definition | Orientation / teaching / instructions / hints / feedback layer purposes |
| Direct language; introduce terms; keep qualifications | Attempt-before-scaffold / discovery-dependent GAM sequencing |
| Intellectual vs linguistic complexity | Learn/Do/Check restatement economy |
| No arbitrary word / sentence quotas | Weak-vs-stronger exemplar anti-leakage as GAM-internal contract (Expository already has subject-matter EQ register) |
| Productive vs unproductive repetition (exposition ↔ XM) | Activity itinerary duplication across Interactive layers |

### Smallest recommended guidance change (for M3)

Add an **Expository-specific Academic Plain English** block (shared definition + Expository manifestations) into prose-producing sibling surfaces — primarily **XD** and **XM**, with a light echo in **GLC** — without Interactive layer purposes.

Preferred boundary: `lib/expository-sibling-prompts.js` (and optionally a tiny shared constants helper for testability). Do **not** route Expository through `LD-GAM-INSTRUCTIONAL-DEPTH`. Do **not** add word limits. Cross-reference S98-D08.

---

## B. Structured-field corruption (`"[object Object]"`)

### Fields

`sections[].invitations_to_think[]` and `sections[].continuity_hooks[]` on Expository Development / assembled page sections.

### Earliest introduction point

**Confirmed code defect** in `lib/expository-contracts.js` → `normalizeExpositoryDevelopment`:

```text
invitations_to_think: asArray(...).map(str).filter(Boolean)
continuity_hooks: asArray(...).map(str).filter(Boolean)
```

`str(value)` is `String(value).trim()`. For a plain object, JavaScript yields `"[object Object]"`.

Capture path `parseExpositoryArtefactCaptureForStorage` always validates via `validateExpositoryArtefactShape` → normalize, so **object-valued list items become the literal string at XD capture**, before assembly.

Assembly (`mergeExpositoryDevelopmentOntoPage`) then `deepClone`s those arrays — it does not create the coercion, but preserves the corrupted strings.

### Same-class risk (related, not user-reported)

EJP `normalizeExpositoryJourneyPlan` uses the same `.map(str)` pattern on `dependencies`, `lo_refs`, `elaboration_intentions`, `representation_needs`, and `connections`.

By contrast, XM `normalizeMaterialBody` / `normalizeFormalNotes` **already** preserve objects (historical Sprint 85 fix).

### Original structured values

Not recoverable from the corrupted string alone. Recoverable only from pre-normalize model output (Raw before capture normalize) or from object shapes if a future normalizer extracts `prompt` / `text` / `body` / `statement` / `content` / `hook` keys. **Assembled JSON for the three M1 cases was not copied into the workspace**, so live object shapes for these runs are unverified here; the coercion mechanism is confirmed.

### Learner-facing?

| Field | Intended role | Rendered today? |
| ----- | ------------- | --------------- |
| `invitations_to_think` | Optional learner thinking prompts (XD guidance) | **No** — `buildExpositionSections` ignores the field |
| `continuity_hooks` | Authoring continuity metadata; prose should enact relationships | **No** — not rendered; intended to be woven into exposition |

**Learner HTML ZIPs for all three M1 cases:** zero `[object Object]` strings; no invitation UI chrome.

### Content loss vs metadata-only

- **Silent content loss** of any invitation/hook text that was authored as a structured object (the inner prompt is destroyed).  
- **Current learner-facing impact:** none, because fields are not rendered.  
- **Artefact integrity impact:** real — assembled/captured XD is polluted; future renderer use would surface garbage; planning continuity metadata may be lost.

### Renderer handling of *valid* strings

Renderer never consumes these fields. Valid string invitations would also be invisible today. That is **acceptable existing behaviour** until a separate decision to surface invitations.

### Recommended minimal correction (M3)

At **`normalizeExpositoryDevelopment`** (earliest appropriate boundary; same family as XM object preservation):

1. Replace blind `str` mapping with a list normalizer that:
   - keeps non-empty strings;
   - for plain objects, extracts the first non-empty among a small allow-list of string keys (`text`, `prompt`, `body`, `statement`, `content`, `invitation`, `hook`);
   - drops empty / unusable values;
   - **never** emits `"[object Object]"`.
2. Apply the same helper to the analogous EJP string-list fields (same coercion class).
3. Do **not** add invitation rendering, new schemas, or renderer redesign in this fix.
4. Focused tests: structured object → extracted string; valid string preserved; malformed object filtered; assembled/normalized output contains no `"[object Object]"`.

---

## C. Learner effort estimates vs extent

### Intended mechanism

- Scale/scope → `normalizeExpositoryScopeExtent` (S85-D05): planning constraint (`words_equivalent`, optional `reading_minutes` at **200 WPM assumption**, qualitative hints).  
- EJP/XD/XM prompts: extent guides coverage and emphasis — **not** a prose quota; diagrams/tables/examples also consume attention.  
- Stamped on page as `expository_extent` / `expository_journey.extent` — metadata, not learner furniture.

### What assembly / rendering produce

- Expository pages have **no activities**, so header `durationMinutes` resolves empty.  
- All three M1 learner HTML exports: **no page-level duration**.  
- Body effort language only on *What Changed…* S4: “Allow approximately **10 minutes**…” for independent reflection.

### Observed approximate HTML word mass (rough extract)

| Resource | ~words | Materials | Notes |
| -------- | ------ | --------- | ----- |
| From gradients to equations | ~4012 | 4 XM | Derivation + tables/figure; high reasoning demand |
| What makes a claim true? | ~2984 | 3 XM | Distinctions + comparison tables |
| What Changed, and Why It Matters | ~1672 | 0 XM | Shorter; includes timed reflection |

### Classification

**Educational concern / guidance clarification — not a confirmed truncation defect.**

Reading-speed alone understates effort (examining tables, working examples, revisiting, independent comparison). No evidence that assembly expands beyond commission; variability across generations remains. Do **not** propose mechanical truncation or rigid word limits. Do **not** invent a header duration from `words_equivalent`.

Optional M3 guidance: remind EJP/XD that extent allocates **attention** across reading, representation study, and reflection — not reading minutes alone.

---

## D. Explanatory duplication (XD exposition vs XM)

### Commissioning rules already present

XD/XM already require commissions that add distinct explanatory/perceptual function; forbid commissioning materials that merely restate completed exposition; ask comparative prose + table to be complementary.

### M1 HTML observations (not controlled A/B)

| Case | Likely complementary | Likely near-restatement |
| ---- | -------------------- | ----------------------- |
| Gradients | S2 figure; S3 derivative tables; S7 diagnosis matrix | S5 two-λ comparison table after prose already states both cases |
| Claim true | S3 evidence/location comparison | S2 four-questions table; S6 three-approaches table after prose enumerations |
| What Changed | N/A (no XM) | N/A |

### Classification

**Educational concern requiring further evidence** — not grounds for broad redesign given provisional positive M1 judgement. Some tables are productive alternative representations; some appear close to redundant restatement. Preserve explanation-first Expository character; do **not** import Interactive attempt-before-scaffold.

Optional M3: tighten XD/XM complementary wording for “already enumerated in prose → prefer distinct perceptual/organisational value or omit commission” — guidance only.

---

## E. Finding classifications (summary)

| ID | Finding | Class |
| -- | ------- | ----- |
| S99-E11 | Interactive APE does not reach Expository prose stages | **Confirmed editorial guidance gap** |
| S99-E12 | XD normalize coerces object list items to `"[object Object]"` | **Confirmed defect** |
| S99-E13 | Invitations/hooks not learner-rendered today | **Acceptable existing behaviour** (with integrity caveat) |
| S99-E14 | Extent/WPM is planning-only; no Expository header duration; effort ≠ reading speed | **Educational concern / clarification** |
| S99-E15 | Some XM tables near-restate prose; others complementary | **Educational concern requiring further evidence** |
| S99-E16 | M1 educational quality provisionally positive — no broad redesign | **Acceptable existing behaviour** (qualified) |
| S99-E17 | Assembled JSON for M1 cases not in workspace | **Evidence gap** |
| S99-E18 | EJP string-lists share `str` coercion risk | **Separate architectural debt** (same class as E12) |
| S99-E19 | EQF manifestations do not target EJP/XD/XM step ids | **Separate architectural debt** / monitoring |

---

## F. Proposed M3 scope (implementation — **not authorised by M2 alone**)

Ordered by educational importance and risk:

### M3-1 — Fix string-list coercion (highest integrity; low pedagogical risk)

- **Files:** `lib/expository-contracts.js` (+ focused tests e.g. `tests/s99-expository-string-list-coercion.test.js`)  
- **Effect:** Preserve usable invitation/hook (and EJP list) text; eliminate `"[object Object]"` pollution  
- **Guardrails:** No new schemas; no invitation rendering; no XM body behaviour change  
- **Tests:** object / string / malformed / no `[object Object]`

### M3-2 — Expository Academic Plain English guidance (essential editorial)

- **Files:** `lib/expository-sibling-prompts.js` (XD/XM/GLC); optional tiny shared helper; update `tests/interactive-academic-plain-english-guidance.test.js` or new `tests/s99-expository-academic-plain-english.test.js`  
- **Effect:** Equivalent editorial expectations to Interactive APE definition, adapted for exposition  
- **Guardrails:** No Interactive layer purposes; no word limits; no GAM depth transplant; keep S98-D08  
- **Tests:** Expository XM/XD drafts contain APE definition; still must **not** receive Interactive GAM depth contract

### M3-3 — Mild XD/XM complementarity reinforcement (optional; evidence-soft)

- **Files:** `lib/expository-sibling-prompts.js` (commissioning + XM quality bullets only)  
- **Effect:** Fewer near-duplicate comparison tables when prose already enumerated the same set  
- **Guardrails:** Preserve productive alternative representations; no truncation; no attempt-before-scaffold  
- **Tests:** Prompt-presence regressions only unless a fixture case is authorised

### M3-4 — Extent / effort clarification (optional; lowest urgency)

- **Files:** EJP/XD extent bullets in sibling prompts only  
- **Effect:** Authors/models treat extent as multi-mode attention, not reading-speed alone  
- **Guardrails:** Do not emit fabricated header durations; no mechanical word caps  

**Out of M3:** Assessment Pack; Situated Task; renderer redesign; invitation UI; Sprint 98 reopen; commit/push without separate authorisation.
