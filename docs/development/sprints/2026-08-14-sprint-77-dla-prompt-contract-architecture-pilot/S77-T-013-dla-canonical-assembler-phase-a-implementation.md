# S77-T-013 — Phase A canonical DLA assembler implementation

**Task:** S77-T-013  
**Status:** **COMPLETE** (2026-08-14) — Phase A only  
**Live production:** still **LEGACY** `76-DLA-PARTIAL-9`  
**Phase B:** equivalence review **pending** ([T-014](S77-T-014-dla-invariant-old-vs-target-equivalence-review.md))  
**Phase C / P05 / pack / switch:** **not authorised**

---

## Files changed

| Path | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Added canonical section builders + `assembleDlaCanonicalContract`. **Did not** change `CONTRACT_VERSION`, `buildDlaPageEnrichContractBlock`, or `buildCanonicalDlaPageShapeSnippet`. |
| `tests/ld-dla-canonical-assembler.test.js` | **CREATE** — architecture tests |
| `S77-T-014-dla-invariant-old-vs-target-equivalence-review.md` | **CREATE** — operator review draft |
| Sprint 77 STATUS/PLAN/HANDOVER pointers | This record |

**Unchanged:** `app.js`, DLA pack markdown, schemas, validators, cache pins, GAM/EP/Design Page/Graphics/QA.

---

## Functions added

- `DLA_CANONICAL_SECTION_IDS` / `DLA_CANONICAL_SECTION_HEADINGS`
- `assembleDlaCanonicalContract(ctx)`
- `buildDlaSectionRole|Inputs|Sources|Production|TaskInputs|Commissioning|Evidence|Providers|Overlay|Output|Examples`

**Assembler API:**

```text
assembleDlaCanonicalContract(ctx) → {
  text, sections, sectionOrder, headings,
  version,        // still "76-DLA-PARTIAL-9" (no bump)
  multiplicity: 1,
  liveProduction: false
}
```

`ctx.path` is ignored (Copy/Studio equality).  
`ctx.workbookOverlay` + `ctx.overlayText` gate §9.  
`ctx.productionSlot|commissioningSlot|outputSlot` fill named sections.  
`ctx.includeExamples` gates §11 body.

---

## Section order

1. Role and authority  
2. Inputs and inherited design  
3. Sources and attachments  
4. Learner production  
5. Task inputs  
6. Material commissioning  
7. Evidence decision  
8. Provider authoring  
9. Domain/workbook overlay  
10. Output contract and shape  
11. Illustrative examples  

---

## Section sizes (chars, §9 off unless noted)

| Section | Chars |
| ------- | ----- |
| role | 584 |
| inputs | 502 |
| sources | 2339 |
| production | 2130 |
| task_inputs | 1499 |
| commissioning | 4678 |
| evidence | 1190 |
| providers | 2047 |
| overlay off | 31 (heading only) |
| overlay on (test fixture) | 374 |
| output §10 | 1634 |
| examples §11 | 1400 |
| **canonical total §9 off** | **18,054** |
| **canonical total §9 fixture on** | **18,397** |

Live unique pair still 12,174 + 6,698 = 18,872. Canonical 18,054 is **below** current unique ~57,118 (STOP threshold). It is also **below** T-012 unique 38–48k because pack/scaffolds are **not** migrated yet — diagnostic only.

---

## Coverage

| Check | Result |
| ----- | ------ |
| Protected invariants in TARGET | **YES** (ledger homes; T-014) |
| Missing invariant | **none** among protected set |
| Copy/Studio assembler equality | **PASS** |
| Architecture tests | **18 pass** `tests/ld-dla-canonical-assembler.test.js` |
| Legacy regression listed in T-013 | **196 pass** (evidence-decision, P01–P03, procedural, titles, archetypes, Sprint 72 slice+UX, bridge, page-dla-enrich) |
| Live `CONTRACT_VERSION` | `76-DLA-PARTIAL-9` |
| Live Copy multiplicity | **unchanged** (app.js still 2× contract + 2× shape call sites) |
| Live Studio | **unchanged** (no assembler call in `app.js`) |
| P05 | **not implemented** |

---

## U handling (TARGET only)

- **U-1:** TARGET §1/§2: EP owns plan; DLA owns learner production. No “not a learning-design step”. Live pack untouched.  
- **U-2:** §9 gated slot; fixture can hold WB/G-gates; obligations not deleted or resolved.  
- **U-3:** TARGET §10 partial-page envelope; no `outcome_alignment` / `delivery_notes` emit dialect. Live pack Output untouched.

---

## Deviations from T-012

- No `workflowOutputSpec.dlaCanonicalAssembler` in `app.js` (would be live-assembly adjacent; deferred to Phase C).  
- §9 not filled from production pack; adapter `overlayText` only.  
- Feature flag default true **not** set.

---

## Blockers before Phase B/C

- Operator must review [T-014](S77-T-014-dla-invariant-old-vs-target-equivalence-review.md) (editorial flags: drop `2)` prefix; GAM-fulfils moved to §6).  
- Phase C **not** authorised. Do not switch, edit pack, implement P05, or generate.

---

## Verdict

Phase A **COMPLETE**. Production **LEGACY**. Ready for semantic equivalence review.
