# 38O-4 — Preservation options and recommendation

**Date:** 2026-06-05  
**Status:** **COMPLETE** (design and recommendation only)  
**Type:** Discovery — preservation strategy  
**Predecessor:** [38O-3-failure-mode-classification.md](38O-3-failure-mode-classification.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## Executive summary

Sprints 38O-1–38O-3 established that **instructional role fidelity** is a distinct concern from **body fidelity** (38M/38N). The dominant failures on `EV-38M-AFTER` are not GAM content loss but **role ambiguity**: missing authority, additive merge, alias proliferation, and render precedence — especially on **A4 evaluative teaching roles**.

This phase evaluates six candidate preservation models (A–F) against observed failure modes and architectural constraints.

| Finding | Detail |
|---------|--------|
| **No single-layer fix is sufficient** | Each option addresses part of the causal chain; isolation risks fixing symptoms while leaving root ambiguity |
| **Strongest conceptual coverage** | **Option F — Hybrid model** combining role registry, GAM-canonical authority, merge supersession, and render role precedence |
| **Preferred direction** | **F1 — Registry-led hybrid** — formal role contract from GAM through page JSON to render, with supersession at merge and precedence at render |
| **Alternative** | **F2 — Merge-led hybrid** — extend 38M merge contract with supersession + role metadata only (narrower scope, faster path, weaker compose-stage control) |
| **38M/38N compatibility** | All options can preserve existing body-ratio and anti-synopsis guarantees if role logic is **additive** and body authority remains GAM-sourced |
| **Not recommended alone** | Render-only (D) or canonical-key-only (A) without supersession — insufficient for A4 CP/DP/RD cluster |

**Verdict:** Role fidelity should become a **first-class contract dimension** parallel to body fidelity, not a replacement for it. Recommendation is design-only; no implementation, code, prompt, renderer, or validator changes in 38O-4.

---

## Preservation objectives

### What role fidelity should mean

Role fidelity is the guarantee that a pedagogical function authored upstream survives as **one recognisable, correctly labelled, correctly ordered learner-facing instructional instance** — not merely that equivalent characters exist somewhere in page JSON.

| Objective | Definition | Distinction from body fidelity |
|-----------|------------|--------------------------------|
| **Role identity** | Learner-facing label and structure signal the intended instructional function (e.g. worked judgement exemplar, not generic modelling note) | Body fidelity can pass while heading says "Modelling Note" with stub text (A4 M15) |
| **Role continuity** | Same role family traceable GAM → Page → Render without silent function change | Body ratio 100% on canonical key while compose key retains inverted/consolidated learner task (M20 raw RI) |
| **Role prominence** | The authoritative instance is what the learner encounters first for that role | Full judgement at char 16908 while stub at 8995 is body-present but role-failed (RD) |
| **Role uniqueness** | At most one authoritative learner-facing instance per `(activity, role_family)` | Duplicate checklist/worked keys are body-redundant but role-ambiguous (DP) |
| **Learner-facing instructional function** | Material performs the teaching move GAM intended (model, exemplify, verify, transfer) — not a worksheet-native substitute | Shell table vs guided exemplar table: similar keys, different pedagogical function (CP) |

### Non-objectives (explicit)

| Non-objective | Rationale |
|---------------|-----------|
| Replace 38M body preservation | Role layer **extends** L4 fidelity; GAM body authority remains |
| Reopen 38N hardening | Marker/render/schema fixes stay closed |
| Mandate identical GAM `type` strings on page | Renaming acceptable if role family and authority are explicit |
| Optimise general instructional quality | Scope is role survival, not depth/richness scoring |
| Eliminate all alias keys | Aliases may remain for compatibility if non-authoritative and suppressed at render |

### Layered fidelity model (target state concept)

```text
Body fidelity (38M/38N)     — Is the substantive GAM body present at ≥ contract ratio?
Role fidelity (38O target)  — Is exactly one authoritative instance rendered with correct
                              function, label, and order for each declared role family?
Learner fidelity (outcome)  — Does the workbook episode match intended instructional
                              architecture (e.g. 38I-4 sequence)?
```

Role fidelity is **necessary** for learner fidelity when body fidelity alone produces duplicate or mis-labelled instances (proven on A4).

---

## Candidate models

### Option A — Canonical role authority

| Field | Content |
|-------|---------|
| **Concept** | Designate one canonical key per role family per activity, derived from GAM `type`+`purpose` via merge contract (`pageFieldKeyForMaterial`). All other keys are non-authoritative. |
| **Scope** | Merge contract + validator resolution (conceptually extends 38M `pageMaterialText` pattern) |
| **Strengths** | Aligns with existing 38M GAM authority; minimal new vocabulary; directly addresses RN and AP resolution |
| **Weaknesses** | Does not remove compose stubs (DP); does not fix render order (RD); does not prevent raw compose CP/RI; canonical key invisible to renderer unless keyed explicitly |
| **38M/38N compatibility** | **High** — incremental extension of current merge contract |

---

### Option B — Explicit role field on page materials

| Field | Content |
|-------|---------|
| **Concept** | Page materials become structured entries: `{ role_family, source, authority, body }` or parallel metadata map — not untyped `key → string`. |
| **Scope** | Page JSON schema / compose output model |
| **Strengths** | Addresses root cause (38O-3 missing role authority); enables supersession, render precedence, and proof gates by role; disambiguates RN |
| **Weaknesses** | Schema surface change; compose LLM must emit or post-process role tags; migration for existing pages |
| **38M/38N compatibility** | **Medium–High** if additive — body merge still keyed by material_id/contract; role field is metadata, not body substitute |

---

### Option C — Merge supersession model

| Field | Content |
|-------|---------|
| **Concept** | When merge overlay applies GAM body to canonical contract key, **retire** compose keys that map to the same role family (delete stub, or mark `authority: superseded`). Additive merge becomes **substitutive** for role-equivalent keys. |
| **Scope** | `applyGamMaterialsToComposedPage` / merge policy (conceptual) |
| **Strengths** | Directly breaks A4 DP chain (stub + full coexistence); reduces alias proliferation; preserves 38M body injection |
| **Weaknesses** | Requires role equivalence map; risk of over-deleting if mapping wrong; does not fix raw compose CP without merge; no render fix alone |
| **38M/38N compatibility** | **High** — strengthens merge without weakening ratio gates |

---

### Option D — Render role-precedence model

| Field | Content |
|-------|---------|
| **Concept** | Renderer selects **one block per role family** using authority rules (canonical key > contract key > compose key; full body > stub) and orders blocks by pedagogical sequence — not raw `Object.keys` order. |
| **Scope** | Render layer only (extends 38N A3 `materials_order` pattern to role-aware precedence) |
| **Strengths** | Fixes RD immediately for merged pages; can hide superseded stubs without JSON deletion; 38N proved ordering hardening works for A3 |
| **Weaknesses** | Symptom treatment if JSON still carries duplicates; raw/compose-only path still broken; heading still key-derived unless role→heading map added |
| **38M/38N compatibility** | **High** — orthogonal to body validators; extends 38N sequencing approach |

---

### Option E — Role registry / role contract model

| Field | Content |
|-------|---------|
| **Concept** | Central registry maps `(gam_type, gam_purpose)` → `role_family` → `canonical_page_key` → `render_heading` → `episode_sequence_weight`. Single source of truth referenced by compose, merge, render, and proof. |
| **Scope** | Cross-cutting contract document + shared lib (conceptual — not implemented here) |
| **Strengths** | Unifies fragmented vocabulary (38O-2 finding); enables consistent RN/AP handling; supports 38I episode alignment; foundation for proof gates |
| **Weaknesses** | Governance burden; must stay synced with GAM-PRES/IFP evolution; alone does not enforce behaviour without C or D |
| **38M/38N compatibility** | **High** — registry codifies existing `pageFieldKeyForMaterial` + taxonomy; extends rather than replaces |

---

### Option F — Hybrid model

| Field | Content |
|-------|---------|
| **Concept** | Combine **E (registry)** + **B (role metadata)** + **C (merge supersession)** + **D (render precedence)**, with **A (canonical authority)** as the GAM-derived anchor. |
| **Scope** | Full pipeline contract — design coordination across compose post-process, merge, render, proof |
| **Strengths** | Addresses full 38O-3 causal chain; A4 pattern needs multi-stage response; A1–A3 noise (RN/DP) also resolved |
| **Weaknesses** | Highest design complexity; phased adoption required in any future implementation; must guard against 38M regression |
| **38M/38N compatibility** | **High** if phased additively — body preservation remains merge-authoritative |

#### Hybrid variants (for recommendation)

| Variant | Emphasis | Trade-off |
|---------|----------|-----------|
| **F1 — Registry-led hybrid** | E + B first, then C + D | Strongest long-term contract clarity; larger conceptual surface |
| **F2 — Merge-led hybrid** | C + A + minimal B (authority flag only) | Narrower change surface; compose CP/RI still need compose-stage policy |
| **F3 — Render-led hybrid** | D + A only | Fast learner UX improvement on merged pages; JSON ambiguity remains |

---

## Failure-mode evaluation

Conceptual effectiveness (**H** = high, **M** = medium, **L** = low, **—** = negligible):

| Failure mode | A | B | C | D | E | F |
|--------------|---|---|---|---|---|---|
| **Renamed (RN)** | M | H | L | M | H | H |
| **Duplicated (DP)** | L | M | H | M | M | H |
| **Alias-proliferated (AP)** | M | H | H | M | H | H |
| **Compressed (CP)** | L | M | M* | L | L | M* |
| **Role-inverted (RI)** | L | H | M | M | H | H |
| **Render-deprioritised (RD)** | L | M | L | H | M | H |
| **Merge-only survival (MS)** | M | M | L | L | M | M |
| **Filtered (FI)** | L | M | L | L | M | M |

\*CP on **raw compose** requires compose-stage policy or mandatory merge — C alone fixes merged JSON stubs, not LLM raw output.

### Per-option summary

| Option | Best addresses | Poorly addresses |
|--------|----------------|------------------|
| **A** | RN, AP resolution at validator | DP, RD, CP raw, RI |
| **B** | Root ambiguity; RI detection; proof by role | Requires companion enforcement (C/D) |
| **C** | DP, AP (stub retirement), merged-page uniqueness | RD, raw CP, FI |
| **D** | RD, learner prominence | DP in JSON, CP raw, RI at compose |
| **E** | RN, AP, cross-layer vocabulary | Enforcement without C/D/B |
| **F** | Full A4 cluster + systemic RN/DP | Complexity; needs disciplined phasing |

### A4 cluster (38O-3 unified pattern)

| Stage | Failure | Options with meaningful impact |
|-------|---------|-------------------------------|
| Raw compose CP/RI | Stub/shell/inversion | **B**, **E** (role contract for compose validation); compose policy (out of scope here) |
| Merge DP/AP | Dual keys | **C**, **F** |
| Render RD | Weak-first | **D**, **F** |

**Conclusion:** A4 requires **multi-stage** conceptual response; render-only or merge-only alone is insufficient.

---

## Architectural fit analysis

### GAM authority model (38M)

| Aspect | Fit |
|--------|-----|
| GAM remains body source of truth | All options preserve — role layer tags, does not replace, GAM bodies |
| `pageFieldKeyForMaterial` | Becomes seed for **Option A/E** canonical mapping — already partial role authority |
| Tier contracts (FC-M12–M19) | Body-focused; role contracts would be **parallel** tier (role_family + authority), not ratio replacement |
| Anti-synopsis detectors | Unaffected — role logic must not bypass synopsis checks on authoritative body |

### Body preservation contracts (38M/38N)

| Risk | Mitigation (conceptual) |
|------|------------------------|
| Supersession deletes wrong key | Supersede only keys registered as same `role_family`; never delete unrelated keys |
| Role gate weakens ratio | Role proof **additive** — body gates G1–G10 remain mandatory |
| Alias resolution order changes | Authoritative key list precedes alias fallback in **read** paths only |

### Current page model

| Aspect | Assessment |
|--------|------------|
| Untyped `materials{}` map | **Incompatible** with role uniqueness — drives DP/AP (38O-2) |
| Activity-row scaffolds | **Compatible** — remain outside materials; role model should reference but not merge them |
| `materials_order` (A3) | **Precursor** to Option D — activity-specific sequence, not role-family aware |

### Current render model

| Aspect | Assessment |
|--------|------------|
| `prettyMaterialHeading(key)` | **Key-centric** — causes RN and misleading A4 labels |
| Early-path + `Object.keys` iteration | **Causes RD** — compose keys win |
| 38N alias suppression | **Partial D** for A3 when `materials_order` set — pattern extendable by role |

### Proof framework

| Extension (conceptual) | Purpose |
|------------------------|---------|
| Role survival matrix gate | One authoritative instance per `(activity, role_family)` |
| Prominence gate | Authoritative block precedes any superseded alias in render extract |
| Raw-compose role gate | Optional — detect CP/RI before merge (catch manual thin-page path) |
| Coexist with `proofOk` | `proofOk` remains body-level; `roleOk` additive |

### Trade-offs summary

| Trade-off | Choice implied by evidence |
|-----------|----------------------------|
| Schema explicitness vs migration cost | Explicit role metadata (B) pays off — root cause fix |
| JSON cleanliness vs render-only fix | Supersession (C) + precedence (D) both needed |
| Central registry vs sprawl | Registry (E) prevents mapping drift across libs |
| Compose control vs merge repair | Merge repair proven (38M); compose weakening (A4 raw) still needs role-aware compose policy in future |

---

## Role-fidelity success criteria

Measurable outcomes for a future proof framework (definitions only — **not tests**):

| ID | Criterion | Measurement concept |
|----|-----------|---------------------|
| **RF-1** | **Role uniqueness** | For each declared `(activity_id, role_family)` in registry, page merged JSON has exactly one `authority: canonical` entry with substantive body |
| **RF-2** | **No weak-first render** | In activity HTML extract, no superseded/stub instance for role_family appears before authoritative instance (char position or h4 order) |
| **RF-3** | **Stable role identity** | GAM `type`+`purpose` → registry `role_family` → single render heading from registry map (not ad hoc key label) |
| **RF-4** | **Pedagogical function preserved** | Role-family-specific markers present on authoritative body (extends 38N semantic markers to role level — e.g. weak/strong judgement markers on `worked_judgement_support`, not on stub) |
| **RF-5** | **No role inversion** | Consolidation authoritative body is teacher-voice synthesis, not learner-write prompt; inversion detectors keyed by role_family |
| **RF-6** | **Episode sequence alignment** | For capstone activities, render order of role families matches episode model sequence weights (38I-4 reference) within tolerance |
| **RF-7** | **Body–role coherence** | When RF-1 passes, body fidelity ratio on authoritative instance ≥ existing 38M tier minimum (no role fix at expense of body) |
| **RF-8** | **Compose-path transparency** | Raw page records `authority: compose` vs post-merge `authority: gam` for audit — supports manual-path diagnosis |

### Relationship to 38M/38N success

```text
38M proofOk (body)  +  roleOk (RF-1..RF-8)  =  full L4 instructional fidelity (conceptual)
```

On `EV-38M-AFTER` replay: **proofOk true**, **roleOk false** (A4) — demonstrating orthogonality.

---

## Recommended direction

### Primary recommendation: **F1 — Registry-led hybrid**

Adopt a **four-part conceptual strategy**:

1. **Role registry (E)** — Codify 38O-2 taxonomy: GAM type/purpose → role_family → canonical_page_key → learner heading → sequence weight. Extend merge contract table; align with 38I episode roles.

2. **Explicit role authority on page materials (B)** — Each material entry carries `role_family` and `authority` (`gam` | `compose` | `superseded`). Untyped key-only maps become legacy-compatible view.

3. **Merge supersession (C)** — When GAM body wins for role_family, compose stubs and alias duplicates for that family are retired or marked non-renderable. Preserves 38M additive body injection; changes retirement policy only.

4. **Render role precedence (D)** — Emit one block per role_family from highest-authority surviving source; order by registry sequence weights (generalise 38N A3 `materials_order`).

**Rationale (evidence-linked):**

| Evidence | Implication |
|----------|-------------|
| 38O-3 root cause: missing role authority | **B + E** required |
| A4 CP→DP→RD single pattern | **C + D** required alongside metadata |
| 38M merge already body-authoritative | **A** anchor stays; **C** extends policy |
| 38N A3 ordering hardening succeeded | **D** is proven pattern, generalise by role |
| A1–A3 RN/DP benign but noisy | **F1** cleans systemic alias issue without reopening 38M |
| Manual thin-page (38N-5) | **B** authority flags expose compose-only path; **RF-8** |

### Alternative recommendation: **F2 — Merge-led hybrid**

If minimal conceptual surface is preferred:

- Implement **C + A** only (supersession + canonical keys) with lightweight `authority` flag (**minimal B**)
- Defer full registry (**E**) and render precedence (**D**) to a second phase

**Trade-off:** Improves merged JSON and validator coherence faster; **RD may persist** until render phase adopted. Acceptable interim if learner UX reads merged HTML only through a role-aware render pass later.

### Not recommended as standalone

| Option | Reason |
|--------|--------|
| **A alone** | Leaves DP, RD, raw CP unresolved |
| **D alone** | Hides symptoms; JSON and compose path remain ambiguous |
| **C alone** | Fixes merged duplicates but not RI/CP at compose or misleading headings |
| **Prompt-only compose fix** | Out of 38O scope; necessary complement but insufficient without merge/render contract |

### Phasing concept (not implementation plan)

```text
Phase concept 1 — Registry + authority metadata (E, B)
Phase concept 2 — Merge supersession policy (C)
Phase concept 3 — Render role precedence (D)
Phase concept 4 — Role proof gates (RF-1..RF-8) alongside 38M proofOk
```

No sprint charter, no code, no timelines — phasing shown for architectural clarity only.

---

## Risks and unknowns

| Risk / unknown | Description | Mitigation concept |
|----------------|-------------|-------------------|
| **38M regression** | Supersession removes body incorrectly | Supersede only same role_family; body gates on authoritative instance first |
| **Registry drift** | GAM-PRES adds types; registry stale | Version registry; tie to GAM material_id |
| **Compose bypass** | Manual path skips merge | RF-8 authority audit; roleOk fails loudly on compose-only |
| **Over-unification** | Checklist vs verification vs evaluate forced merge | Registry allows sub-roles or single checklist family with one authority |
| **Episode sequence conflicts** | 38I-4 order vs activity materials_order | Registry sequence weights per activity archetype |
| **Scaffold vs material roles** | Duplicate guidance paths | Keep scaffolds on activity row; registry references but does not duplicate |
| **Evidence generalisation** | Single EV run (EV-38M-AFTER) | Future proof should replay multiple runs before implementation commitment |
| **Prompt compose weakening** | A4 raw CP/RI root at LLM compose | Role-aware compose policy may be needed in addition to merge/render — not fully characterised in 38O |

---

## Scope and hold confirmation

| Hold | Status |
|------|--------|
| Do not reopen 38M | ✓ Recommendation extends, not replaces, body preservation |
| Do not reopen 38N | ✓ Render precedence generalises 38N pattern |
| No implementation | ✓ Design and recommendation only |
| No production code / prompts / renderer / validators | ✓ |
| No implementation plans | ✓ Phasing concept is architectural, not a build plan |
| No new implementation sprint charter | ✓ |
| Prepare basis for 38O-5 closure | ✓ |

---

## References

| Document | Path |
|----------|------|
| 38O-1 baseline trace | [38O-1-baseline-role-survival-trace.md](38O-1-baseline-role-survival-trace.md) |
| 38O-2 taxonomy + mapping | [38O-2-role-taxonomy-page-mapping-analysis.md](38O-2-role-taxonomy-page-mapping-analysis.md) |
| 38O-3 failure modes | [38O-3-failure-mode-classification.md](38O-3-failure-mode-classification.md) |
| 38M closure | [38M-6-sprint-closure.md](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) |
| 38N closure | [38N-5-sprint-closure.md](../../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) |
| 38I A4 episode | [38I-4-a4-evaluate-learner-episode.md](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

**Next phase:** [38O-5 — Sprint closure](38O-5-sprint-closure.md) — **Complete**
