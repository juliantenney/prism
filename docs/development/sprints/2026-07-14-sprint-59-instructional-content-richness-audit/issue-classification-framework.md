# Sprint 59 — Issue Classification Framework

Every **finding** gets exactly one **primary** class (A–F). Secondary tags may be recorded when a related factor contributed but was not the principal defect.

**Archetype note:** Thin mechanism/process/concept materials with adequate Evaluate/diagnostic neighbours are typically **primary Class A** (generation under weak archetype support), optionally tagged `secondary: archetype_gap` / `soft_enforcement`. Do not invent a domain-path class without code evidence ([instructional-archetype-audit.md](instructional-archetype-audit.md)).

**Do not** use compound primary labels such as `A/D`, `E and/or A`, or `Generation and/or assembly`.

---

## Primary vs secondary

| Rule | Detail |
| ---- | ------ |
| One primary class | Required for every finding |
| Secondary tags | Optional; note contributing factors (e.g. `secondary: weak validator`) |
| Split findings | Independent defects → separate findings, each with its own primary class |
| Lesson summary | May count findings by primary class; do not assign a compound class to the whole lesson |

**Example:** Thin scenario text (A) persisted because validators did not reject placeholders → **primary A**; optional secondary tag `validator did not enforce richness`.

---

## Classes

### A. Generation problem

Content that should exist (or be richer) was **never produced** (or produced inadequately) by the owning stage’s LLM output.

**Examples**

- Scenario has only two generic sentences → **A**
- Worked example is answer-only → **A**
- Assessment items ignore lesson materials / LOs → **A**
- Assessment design missing evidence model → **A**
- Instructional-flow gap: performance expected without model → **A**

### B. Renderer problem

Content **exists** in assembled (or stage) JSON but is missing, detached, collapsed, poorly ordered, or hard to use in rendered HTML.

**Requires Full evidence** (rendered HTML available). See [audit-plan.md](audit-plan.md#evidence-sufficiency-status).

**Examples**

- Material body in JSON but visually detached → **B**
- Items exist but hidden or poorly ordered in HTML → **B**
- Knowledge summary in `page_synthesis` but not surfaced usefully → **B**

### C. Assembly / transport problem

Owning-stage capture looks adequate, but the **merged** page loses fields, uses wrong keys, or has identity mismatches.

**Requires** comparison of owning-stage capture **and** assembled JSON.

**Examples**

- GAM material in capture; absent from assembled page → **C**
- Activity references `material_id` that never merged → **C** (if material existed in GAM capture)

If material never existed in stage capture → **A**, not C.

### D. Validation problem

Validator behaviour **independently** caused incorrect acceptance, rejection, routing, persistence, or loss against an **existing validator responsibility** — distinct from the learner-facing content defect.

**When to use D as primary**

- Valid partial rejected (false rejection) → **D**
- Wrong validator routed → **D**
- Validator dropped or stripped fields it should preserve → **D**

**When not to use D as primary**

- Content is thin and validators merely failed to enforce instructional richness → **primary A**; optional secondary `validator did not enforce richness`
- Principal learner-facing defect is inadequate generated content → **A**, even if a validator allowed it through

Sprint 59 does **not** propose validator changes.

### E. Content-model / ownership problem

Genuine ambiguity about **which stage should produce** content, or duplicated/missing ownership causing gaps — not routine cross-references between stages.

**Examples**

- Assessment strategy captured; no items; no clear handoff contract → **E**
- Neither DLA nor GAM clearly owns required explanatory material → **E**

**Not E:** DLA instructions reference GAM materials by id when materials exist — that is expected collaboration, not ownership ambiguity.

### F. Expected variation / not a defect

Thinness or brevity appropriate for level, duration, delivery profile, or brief intent.

**Examples**

- Short lesson with intentionally brief overview → **F**
- Facilitator profile omits learner-facing elaboration by design → **F**

---

## Decision procedure

Apply in order. Assign **one primary** class; add secondary tags if needed.

```
1. Is relevant evidence sufficient for the claim?
   Insufficient → do not classify; mark evidence status; limit claims
2. Is the content in owning-stage capture JSON?
   No  → primary A (or E if ownership genuinely unclear)
   Yes → 3
3. Is it in assembled page JSON?
   No  → primary C (or D if validator independently caused loss)
   Yes → 4
4. For renderer claims: is rendered HTML available?
   No  → do not assign B; use Generation-scoreable limits
   Yes → 5
5. Is content adequately visible/usable in rendered HTML?
   No  → primary B
   Yes → If still thin in JSON → primary A or F (acceptable variation)
```

---

## Severity (suggested)

| Code | Meaning |
| ---- | ------- |
| S0 | Nit / cosmetic |
| S1 | Noticeable quality hit; lesson still usable |
| S2 | Undermines activity or assessment intent |
| S3 | Blocks learning or evidence collection |

---

## Anti-patterns

- Scoring HTML only, then blaming generation
- Blaming renderer when JSON body is literally two sentences
- Merging assessment design and item defects into one finding
- Using `A/D` or `E and/or A` as a primary class
- Treating missing captures as missing generated content
- Using class E for legitimate cross-stage references
