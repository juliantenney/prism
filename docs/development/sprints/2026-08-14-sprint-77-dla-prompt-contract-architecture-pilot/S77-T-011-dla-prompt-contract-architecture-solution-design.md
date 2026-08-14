# S77-T-011 — DLA model-visible prompt architecture solution design

**Task:** S77-T-011  
**Status:** **COMPLETE** (2026-08-14) — architecture **DESIGNED**, not implemented  
**Mode:** SOLUTION DESIGN ONLY — no production, prompt, schema, validator, test, P05, or generation changes  
**Depends on:** [S77-T-010](S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md)  
**Live baseline:** `76-DLA-PARTIAL-9` · HEAD `0b5402d` (inventory)

Supporting: [current→target invariant map](S77-T-011-dla-invariant-current-to-target.csv) · [size model](S77-T-011-dla-target-size-model.md)

---

## 0. Design stance

T-010’s highest-cost problem is **multiple instruction authorities + exact dual injection + pack/workbook overlay**, not character count.

The target is **one coherent model-visible DLA instruction contract**. Source may stay modular. The assembled sequence must read as **one specification** with **one owner per invariant**.

This is **not** “put the current ~57k unique characters under headings.”

DLA is the **pilot**. Do not generalise to EP, GAM, Design Page, Graphics, or QA.

**Behaviour preservation precedes compression.** Every protected Sprint 76 invariant maps with **BEHAVIOUR CHANGE = NO**, except issues recorded in §0.1 (not solved here).

### 0.1 Unresolved semantic issues (do not solve in architecture)

These are **live competing authorities** from T-010 §9. Architecture **assigns ownership**; it does **not** rewrite the semantics.

| ID | Issue | Do not do in T-011 |
| -- | ----- | ------------------ |
| **U-1** | Pack says DLA is “not a learning-design step” while T-033 requires mapped-LO production design | Do not weaken T-033. Do not silently delete pack population gates. |
| **U-2** | DLA-WB mandatory rows (e.g. WB-08/06a, G1 checklist every activity, capstone ≥3 LOs) vs P01 “commission only what production needs” | Do not delete WB or P01. Record as **subordinate overlay when workbook flag applies**, pending a later semantic decision if they still conflict after overlay is explicit. |
| **U-3** | Pack Output dialect (`activities, outcome_alignment, delivery_notes`) vs partial-page envelope | Structural dialect conflict. Architecture chooses **partial-page envelope**. Pack Output keys must stop competing. Not a P01–T-031 semantic change. |

Implementation must not “fix” U-1/U-2 by changing learner behaviour. U-3 is **output-contract alignment**, not pedagogical change.

---

## 1. Target architecture summary

**Assemble once. Own once. Order by DLA’s decision process.**

```text
PATH WRAPPER (Copy vs Studio; emission only)
  → CANONICAL DLA CONTRACT (one injection, shared)
       1  Role and authority
       2  Inputs and inherited design
       3  Sources and attachments          ← before production (T-010 + Sprint 72)
       4  Learner production               ← T-033, task, expected_output, titles
       5  Task inputs                      ← P01 / P01-R1
       6  Material commissioning           ← P03, T-031, GAM boundary, archetypes
       7  Evidence decision                ← P02, P01/P02 independence, P04
       8  Provider authoring               ← Sprint 72
       9  Domain / workbook overlay        ← subordinate, gated
      10  Output contract and shape
      11  Illustrative examples
  → PATH FOOTER (fence/footer once)
```

**Top-level model-visible sections in the canonical contract: 11.**  
Path wrapper/footer are **not** additional semantic authorities.

---

## 2. Conceptual information architecture

| # | Section | Purpose | Owns | Feeds from today | Does not belong | Neighbours | Target size (unique) | Local reinforcement |
| - | ------- | ------- | ---- | ---------------- | --------------- | ---------- | -------------------- | ------------------- |
| **1** | Role and authority | What DLA is; partial page; not GAM/EP/full replay | Role/boundary; body vs commission | PB-003 opening; Copy wrapper; pack “obligation population” (strip competing claim) | Workbook rows; JSON example | → Inputs | 0.4–0.8k | No |
| **2** | Inputs and inherited design | Consume page shell, LOs, episode beats as given | Mapped LO **as input**; beat order consume-not-replan | Pack Context/Instructions; EP population | Designing production (that is §4) | → Sources | 0.6–1.2k | No |
| **3** | Sources and attachments | Inventory before design; Roman Roads source-use | Attachment classification; conversation_attachment preference; do not invent unattached works | PB-003 attachment inventory; runner upload; legacy embed | Evidence_decision boolean (that is §7) | After inputs, **before** production | 0.8–1.4k | One runner UX line on Copy only |
| **4** | Learner production | What the learner must do and produce | T-033; learner_task; expected_output; titles; cognition/bridge **as production copy** (not a second contract) | PB-003 step 1; OUTPUT CONTRACT; scaffold SSOT; pack AS-05/WB-19; titles ×4 | Operand selection; WB mandatory types | → Task inputs | 2.5–4.0k | Title: once here, not in shape |
| **5** | Task inputs | Object/state acted on | P01; P01-R1; intermediate object; prior-product; TMD | PB-003 step 2; shape contrast | Evidence required boolean | After production, before commissions | 1.2–2.0k | Shape may show TMD **illustration only** |
| **6** | Material commissioning | Bound GAM; purpose/spec; archetypes | P03; T-031 bounds; GAM fulfilment; instructional_archetype / plan | PB-003 step 3; PB-006; pack type lists; table-fidelity **spec** role | Material bodies; “must be solvable” | → Evidence | 2.5–4.5k | Archetype field lists once (not inside full JSON twice) |
| **7** | Evidence decision | Particulars-as-grounds | P02; P04; P01/P02 independence; evidence_decision; provider_material_ids when true | PB-003 steps 4–5; pack notes; runner what_to_check | Provider authoring detail | After commissions | 1.0–1.8k | Runner one-liner OK |
| **8** | Provider authoring | How providers are specified when required | learner_action; observable_features; delayed disclosure; provenance; evidence_layout | PB-003 evidence-provider; shape evidence_requirement | Attachment inventory (§3) | After evidence true | 1.2–2.0k | Example may illustrate layout |
| **9** | Domain / workbook overlay | Gated extra obligations | DLA-WB session mix; G1–G5 **as overlay**; IFP population gates that are **not** generic P01–T-033 | Pack 14,279 minus moved generics | Generic T-033/P01/P02 restatement | After core 4–8 | 6–10k when applied; ~0 if not | Only when workbook/self-directed flags apply |
| **10** | Output contract and shape | Envelope, required fields, forbidden shell | Partial-page JSON; forbidden lists **once**; field names | Wrapper; PB-003 envelope; PB-004; pack Output; schema line | Pedagogical rules | Before examples | 1.5–2.5k | Wrapper fence/footer only |
| **11** | Illustrative examples | Show rules already stated | None new | Shape JSON; Marx example; table GOOD | Hidden dialect (`type` vs `material_type`) | After §10 | 1.0–2.0k | N/A — examples are illustrations |

**Conditional modules** (assembled into §4/§6/§9 when flags apply, not extra top-level authorities): guided-learning scaffold, EQF, timeline sequencing, table-fidelity DLA role, math-render. They **fill** named sections; they must not introduce a second commissioning order.

---

## 3. Reasoning order

Target decision process:

**LO (inherited) → sources known → learner production (T-033) → task inputs (P01-R1) → commissions (P03/T-031) → evidence-role (P02) → providers if required → overlay if flagged → emit.**

| Concern | Where it enters | Why |
| ------- | --------------- | --- |
| Sources/attachments | **§3, before production** | Current contract inspects attachments first; Roman Roads needs inventory before designing activities. Putting sources after providers would hide them until too late. |
| Archetypes | **§6 commissioning** | Per-material pedagogical function, not a page-level competing design step. |
| Workbook | **§9 after core 4–8** | Must not outrank T-033/P01. Overlay: “when workbook_contract_applied, **also** satisfy these rows **without** replacing production/operand decisions.” U-2 remains recorded. |
| Schema/shape | **§10 after decisions** | Structure after semantics so examples cannot become the contract. |
| Examples | **§11 last in contract** | Illustrate; never precede the rule they illustrate. |
| Fence/footer | **Path wrapper/footer** | Once. Not inside §4–8. |

**Why not the user’s listed default of sources after providers:** T-010 shows source-use is a **pre-design** constraint, not a post-evidence annotation.

---

## 4. Current → target invariant map

Full table: [S77-T-011-dla-invariant-current-to-target.csv](S77-T-011-dla-invariant-current-to-target.csv).

Every listed protected invariant has **exactly one canonical home**. **BEHAVIOUR CHANGE = NO** for all protected Sprint 76 items. U-1/U-2/U-3 are **not** treated as closed semantic redesigns.

**Invariants without canonical home:** **none** among the protected set.

---

## 5. Nine duplication clusters — design recommendation

| Cluster | Recommendation | Why |
| ------- | -------------- | --- |
| Dual contract+shape | **DEFER TO P05** as **assembly consequence of this architecture** (single inject) | Second copy is byte-identical; skip-regex never sees Copy wrapper. No distinct pedagogical purpose. |
| Title ×4 | **KEEP ONCE** in §4 | Validators close length/forbidden patterns; one prose home. |
| Output/fence/footer restatement | **KEEP CANONICAL + PATH WRAPPER** | One semantic “emit partial page JSON”; Copy/Studio wrapper states fence/footer **once**. |
| Forbidden-field lists | **KEEP ONCE** in §10 | D6 today (wrapper + contract + shape). |
| PRE-EMIT remnants | **STRUCTURAL COMPRESSION CANDIDATE** | Point to validators; do not rebuild P04 self-audit. Keep one line: missing required fields fail capture. |
| Pack/core overlap (titles, evidence notes, purpose/spec) | **CONSOLIDATE** into §§4–7 | Pack keeps only overlay-specific gates. |
| Evidence/provider restatements | **KEEP CANONICAL + LOCAL REMINDER** | Canonical §7/§8; runner what_to_check one line. |
| Schema/shape repetition | **STRUCTURAL COMPRESSION CANDIDATE** | One field contract + **one** example in §11; not 6.7k JSON twice. |
| Shape JSON vs Marx JSON | **REPLACE** Marx; **REDUCE** shape | Marx is D5 (wrong dialect). Shape example KEEP as illustration of TMD+evidence after rules. |
| Table GOOD example | **KEEP EXAMPLE ONLY** in table-fidelity module mapped into §6 | D4; GAM-flavoured — keep DLA-spec wording only. |
| Commissioning vs pack obligation/WB | **CONSOLIDATE** generics; **KEEP** overlay §9 | D2/D7; U-1/U-2 not silently deleted. |

**DO NOT TOUCH** as semantics: P01-R1 absence test, T-033 load-bearing operations, T-031 “this commissioned operation only,” P02 particulars-as-grounds, Sprint 72 provider fields.

---

## 6. Domain / workbook target role

**Become a gated overlay (§9), not a second DLA constitution.**

| Content | Future |
| ------- | ------ |
| Generic titles, evidence_decision restatement, purpose/spec, expected_output 30–70w, LD-MATERIALS-COPY | **Move to canonical §§4–7** |
| Consume episode_plans beat order; do not replan archetypes | **§2 inputs** (one statement) |
| DLA-WB-01..19 session mix, duration 50–70, capstone ≥3 LOs, WB-08/12/06a/18 | **Remain modular in pack source**; assemble into **§9** when flags apply |
| G1–G5 / IFP population gates that specify **extra rows** | **§9**; must not redefine T-033 |
| “Not a learning-design step” | **Must not remain as a competing authority** (U-1: wording change is **authority cleanup**, not T-033 change) |
| Pack Output `delivery_notes` top-level dialect | **Must not compete** with §10 (U-3) |

**Can pack become parameter/data-like?** **Partially.** WB flags and required type families can be data. G1–G5 still need short prose. Do not flatten all WB into JSON flags in this design’s first implementation — keep modular **source**, one **slot** in the assembled contract.

**Genuine pedagogical differentiation to keep:** workbook session shape, table-not-only mix, consolidation_summary vs capstone template, scenario pairing when case language is used.

**Do not rewrite the pack in T-011.**

---

## 7. Shape / schema target role

**Minimum coherent model-visible structural contract:**

1. Envelope bullets (artifact_type, schema_version, assembly_state, activities[] required field **names**).  
2. Forbidden shell/body list **once**.  
3. **One** compact example in §11 that includes TMD + evidence_requirement **and** a one-line contrast for `required: false` practice operands.  
4. Archetype **plan field lists** live in §6 (not duplicated inside a second JSON blob).  
5. Validators remain the fail-close for missing keys / empty purpose/spec / TMD object presence.

**Do not** assume validators let the model emit valid JSON with no field names. **Do not** keep 6,698 × 2.

**Not a schema change.**

---

## 8. Example policy

**Illustrate explicit rules. Never introduce a second dialect.**

| Current example | Action | Supports |
| --------------- | ------ | -------- |
| Canonical shape JSON | **REDUCE** + **MOVE** to §11 | TMD, evidence_requirement, envelope |
| Title “Activity A1” forbids | **KEEP** inside §4 title bullets (tiny) | Titles |
| Marx/compare OUTPUT CONTRACT JSON | **REPLACE** (wrong `type`, no TMD/evidence_decision) | Cognition/bridge — replace with dialect-aligned miniature **after** implementation planning, not here |
| Table fidelity GOOD pipe | **KEEP** in table module → §6 | Table **specification** intent |
| Archetype field skeletons | **KEEP** in §6 as lists, **not** a second full activity JSON | Archetype_plan completeness |

No final replacement examples written in this task.

---

## 9. Validator boundary

| Category | Model must know | Validators already close | Prompt audit to drop | Cannot delegate |
| -------- | --------------- | ------------------------ | -------------------- | --------------- |
| Envelope / stage | Field names, partial vs full | Shape/stage | Triple restatement | Choosing DLA-owned fields |
| TMD object | What the fields **mean** | Object present, ids empty-if-false | Repeating JSON schema | P01-R1 classification |
| purpose/spec non-empty | What a sufficient spec **is** (T-031) | Non-empty, not type-token-only | PRE-EMIT laundry lists | Which bounds to state |
| evidence_decision object | Particulars-as-grounds meaning | Object present | Dual restatement | P02 judgement |
| Titles | Distinct, not LO, no IDs | Length, some patterns | ×4 copies | Semantic distinctness |
| Forbidden bodies | Do not write materials.body | Reject bodies | Triple forbidden lists | — |
| Archetype_plan | When to select; required keys | Key completeness if selected | JSON blob twice | Selection judgement |
| WB rows | Overlay obligations | Some row-type presence | Competing with P01 | Whether overlay applies |

**Do not recreate pre-P04 self-audit.** One PRE-EMIT pointer at most.

---

## 10. P05 in the target architecture

| Question | Answer |
| -------- | ------ |
| How many times should the coherent DLA contract appear in Copy? | **Once.** |
| Where injected? | After thin path wrapper ( Copilot/pipeline ), before path footer. |
| What did the second injection serve? | **No distinct purpose.** Accident: Copy prepends pair; augmentations append pair because pack lacks the heading. |
| Does new architecture eliminate that purpose? | **Yes** — single assembler emits the canonical contract. |
| Separate follow-up vs architecture implementation? | **Part of architecture implementation**, not a lone P05 PR that leaves pack/WB as a second constitution. Mechanical de-dupe **without** §9 ownership would still leave multiple authorities. |

**Recommendation:** Implement single injection when switching to the new assembler (Option 3). Update the test that currently **requires two** call sites. Do not ship P05 alone first.

---

## 11. Copy vs Prompt Studio

**Both consume the same canonical DLA contract (sections 1–11).**

| | Copy | Studio |
| - | ---- | ------ |
| Shared | Canonical §§1–11; gated overlays | Same |
| Different | Pipeline open/close; runner what_to_expect (upload UX); literal `STEP N OUTPUT` footer | Draft/template chrome; no dual prepend |
| Must not differ | P01–T-033, evidence, sources, overlay semantics | Same |

**Minimise semantic drift:** one builder function; paths only wrap. Do not change either path in this task.

---

## 12. Source modularity vs model-visible coherence

**A. Source (may stay modular)**  
- `ld-dla-page-enrich-contract.js` split by section builders (or equivalent modules).  
- Title, archetype, scaffold, EQF, table, math as libraries.  
- Pack markdown for **§9 overlay data/prose only**.  
- Path wrappers in `app.js`.

**B. Model-visible**  
One `assembleDlaCanonicalContract(ctx)` (name illustrative) concatenates sections **in the order in §1**, applying gates. Copy/Studio call it **once**.

One coherent prompt ≠ one enormous source string.

---

## 13. Target prompt skeleton

```text
# (PATH) EXECUTION WRAPPER
Autonomous run; this step is Design Learning Activities; partial page artefact; fence+footer once.

# 1. DLA ROLE AND AUTHORITY
DLA commissions activities and materials on a partial v2 page. EP owns plan. GAM owns bodies/executability. Not a full-page replay.

# 2. INPUTS AND INHERITED DESIGN
Consume learning_outcomes, page/episode beats as given. Do not replan beat order or page-level archetypes.

# 3. SOURCES AND ATTACHMENTS
Inventory conversation attachments before designing. Classify supporting knowledge vs learner evidence. Do not invent unattached works. Roman Roads: conversation_attachment for inventoried units.

# 4. LEARNER PRODUCTION
Define expected_output and learner_task. Completing production must require every load-bearing mapped-LO operation (T-033). Quality-threshold expected_output. Final activities[].title rules (once). Learner-facing preamble/bridge/cognition as production copy when learner-page.

# 5. TASK INPUTS
Decide separate operands/stimuli (P01). Task input = object/state acted on, including system-supplied intermediates; workspace ≠ operand; prior-product ≠ new GAM commission (P01-R1). Emit task_material_decision.

# 6. MATERIAL COMMISSIONING
Commission required_materials with purpose + specification (P03). Include pedagogical method/scope/bounds for this operation only (T-031). Do not write bodies. GAM fulfils. Archetype_plan when pedagogical job matches.

# 7. EVIDENCE DECISION
Independently decide particulars-as-grounds (P02). Not nouns; not “has materials.” P01 and P02 independent. If true: provider_material_ids + evidence_requirement on those rows.

# 8. PROVIDER AUTHORING
When required: learner_action, observable_features, provenance, delayed disclosure, evidence_layout. Teaching/scaffold ≠ provider.

# 9. DOMAIN / WORKBOOK OVERLAY
If and only if workbook/self-directed session flags: additional row/mix obligations (DLA-WB / G-gates). Overlay does not replace §§4–8.

# 10. OUTPUT CONTRACT AND SHAPE
Required envelope and field names. Forbidden shell/bodies once.

# 11. ILLUSTRATIVE EXAMPLES
One dialect-aligned activity miniature (TMD + evidence). Optional required:false contrast. No second JSON dialect.

# (PATH) EMISSION FOOTER
Pretty-printed fenced JSON; exact STEP N OUTPUT line; stop.
```

Implementation planner maps every T-010 PB-* into a numbered section or path wrap.

---

## 14. Size model

See [S77-T-011-dla-target-size-model.md](S77-T-011-dla-target-size-model.md).

| | |
| - | - |
| Current Copy assembled | **75,991** |
| Current unique (minus second pair) | **~57,118** |
| Expected exact-duplication removal | **~18,873** (P05 / single inject) |
| Expected semantic-consolidation range | **~8k–16k** unique (titles, pack overlap, shape blob, examples, wrapper D6) |
| Target unique range | **~38k–48k** |
| Target Copy assembled range | **~40k–52k** (unique + thin wrapper, **no** second pair) |
| Uncertainty | **HIGH** on §9 remainder (how much WB prose is irreducibly distinct) |

No target percentage manufactured. Not “headings on 57k.”

---

## 15. Traceability counterfactual

| Defect | Inspect first | Canonical sections | Ownership obvious? | Expected |
| ------ | ------------- | ------------------ | ------------------ | -------- |
| **P01-R1** | §5 Task inputs | 1 (§5; glance §11 example) | Yes | **EASY** (was HARD) |
| **T-033** | §4 Learner production | 1 (§4; §9 only if overlay suspected) | Yes vs pack | **EASY** (was MODERATE) |
| **T-031** | §6 Material commissioning | 1 (§6; GAM not in DLA contract) | Yes | **EASY** (was MODERATE) |

Material improvement depends on implementation actually moving pack generics out of competition.

---

## 16. Future change test

Hypothetical: “A new rule modifies how DLA decides whether a supplied diagram is an operand or a model.”

| Question | Answer under this architecture |
| -------- | ------------------------------ |
| Owning section | **§5 Task inputs** (P01-R1 family) |
| Pack changes? | **No**, unless workbook-specific diagram genre (then §9) |
| Example changes? | **§11** only if we illustrate diagrams |
| Validator changes? | Only if a new **structural** field; meaning stays prompt |
| Regression surface | T-041/P01 suites; not WB or T-033 |

Engineer should not search the entire prompt if section map and assembler are inspectable.

---

## 17. Migration risk

| Risk | Rank | Mitigation |
| ---- | ---- | ---------- |
| Accidental semantic deletion | **HIGH** | Invariant map as checklist; Gate B suites T-041/044/047/P01–P03/Sprint 72 |
| Order change → behaviour | **HIGH** | Keep decision order of §§4–8 = current contract steps 1–5; sources stay before production |
| Weakening useful reinforcement | **MEDIUM** | Allow runner one-liners; do not strip T-033/P01-R1 to a heading |
| Pack/core divergence | **HIGH** | Pack becomes overlay-only; Gate A forbids generic restatement in pack |
| Copy/Studio drift | **MEDIUM** | Single `assembleDlaCanonicalContract` |
| Examples losing implicit contracts | **MEDIUM** | Replace Marx before deleting; Gate B dialect checks |
| P01/P02/P03 regression | **HIGH** | Existing prompt tests + Gate D |
| Source/attachment regression | **HIGH** | Roman Roads in Gate D; §3 not optional |
| Output validity regression | **MEDIUM** | Schema validators unchanged; §10 field names retained |

---

## 18. Implementation strategies

| | Option 1 Big-bang rewrite | Option 2 Section-by-section behind old assembly | Option 3 Modular canonical assemble, atomic switch, then strip old authorities |
| - | ------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Behavioural risk | HIGH | MEDIUM (long dual-authority window) | MEDIUM then LOW after strip |
| Complexity | HIGH | HIGH (N migrations) | MEDIUM–HIGH |
| Testability | Weak until end | Per-section but Copy still dual | Gate A on assembler; compare unique/assembled |
| Rollback | Hard | Easy per section | Feature-flag assembler |
| Size benefit | Fast if it works | Slow; P05 remains | Exact-dup gone at switch |
| Prove preservation | Poor | Mixed | Best: map + suites + flag |

**Recommend Option 3.** Do not big-bang prose. Do not leave dual inject while “migrating sections into 57k.”

---

## 19. Acceptance gates (later — not run now)

**Gate A — static architecture:** sections 1–11 present; invariant map complete; no protected invariant lost; Copy/Studio multiplicity = 1 canonical contract.

**Gate B — automated:** existing DLA suites; P01/P02/P03; Sprint 72; T-041; T-044; T-047; output validity / partial capture.

**Gate C — measurements:** unique; assembled; duplication = 0 extra pair; Copy vs Studio semantic equality of §§1–11.

**Gate D — generation:** Roman Roads; Lagrangian; explicit P01-R1, T-033, T-031, P02/source.

---

## 20. Out of scope (this task)

No implementation, P05 code, GAM/EP/Graphics/QA/Design Page, schema/validator/test/product edits, generation, or generalisation.

---

## 21. Next task

**S77-T-012 (recommended):** DLA prompt-contract architecture **implementation plan** (Option 3): section-to-source map, assembler sketch, test/pin updates including retiring “exactly two call sites,” Gate A–D mapping. **Still no production prompt rewrite.**
