# S77-T-015 — DLA canonical architecture Phase C atomic switch

**Status:** **COMPLETE** (2026-08-14) — architecture LIVE; Gate D **NOT RUN**  
**Depends on:** T-014 Phase B **ACCEPTED** · T-013 assembler · T-012 plan  
**Live contract:** `77-DLA-CANONICAL-1`  
**Rollback:** `workflowOutputSpec.dlaCanonicalAssembler === false` restores Sprint 76 dual inject (`76-DLA-PARTIAL-9` builders retained)

---

## Phase B acceptance

Recorded in [S77-T-014-dla-invariant-old-vs-target-equivalence-review.md](S77-T-014-dla-invariant-old-vs-target-equivalence-review.md).

- P01-R1, T-033, T-031, P02, Sprint 72 sources/providers: **accepted as equivalent**
- Dropped commissioning step-number prefixes: **accepted** (editorial)
- GAM-fulfils moved to §6: **accepted**
- P01/P02 local reinforcement in §5 and §7: **accepted**
- No protected semantic wording change requested

Phase B: **ACCEPTED / COMPLETE**.

---

## Version / pins

| Item | Value | Rationale |
| ---- | ----- | --------- |
| Live DLA contract version | `77-DLA-CANONICAL-1` | Architecture generation (canonical §§1–11 once), not a schema bump |
| Legacy version constant | `76-DLA-PARTIAL-9` | Rollback builders |
| `index.html` `ld-dla-page-enrich-contract.js` | `?v=20260814-s77-dla-canonical-1` | Live assembly change |
| `index.html` `app.js` | `?v=20260814-s77-dla-canonical-1` | Live assembly change |
| Validator / schema versions | **unchanged** | |

---

## Flag

`workflowOutputSpec.dlaCanonicalAssembler` (also accepted on the workflow object).

- **missing / not false:** canonical assembler **once** (default production)
- **explicit `false`:** Sprint 76 prepend/append contract+shape

---

## Copy / Studio topology

**Copy before:** wrapper → dual contract+shape → pack body → scaffolds/EQF → v2 append → footer.

**Copy after:** path wrapper (partial-mode / Copilot fence) → `assembleDlaCanonicalContract(ctx)` **once** → runner UX / footer. Pack body **not** concatenated.

**Studio before:** pack seed + augmentations including contract+shape.

**Studio after (v2 + flag default):** pack seed **replaced** by the same assembler text (byte-identical §§1–11 to Copy for equivalent context).

**P05:** implemented as this switch — canonical multiplicity = 1. Not an isolated earlier fix.

---

## U-1 / U-2 / U-3

| ID | Result |
| -- | ------ |
| **U-1** | Competing pack denial (“not a learning-design step”) is **not injected** on the canonical path. §1/§2: EP owns plan; DLA consumes beats; DLA owns learner production (T-033). Pack **file** retained for rollback. |
| **U-2** | Workbook/G-gate/IFP obligations live in gated **§9** overlay (`buildDlaWorkbookOverlayBlock`). Overlay does **not** restate T-033 / P01-R1 absence test / P02 particulars. **U-2 workbook vs P01 tension remains visible and is not fixed.** |
| **U-3** | Pack Output dialect (`outcome_alignment`, `delivery_notes` as competing envelope) **not injected**. Authoritative output is §10 partial-page envelope. |

---

## Pack / §9 sizes

| Surface | Chars |
| ------- | ----- |
| Pack `promptTemplate` file (unchanged, rollback) | **14,279** |
| Overlay body (`buildDlaWorkbookOverlayBlock`) | **6,510** |
| §9 section including heading | **6,543** |
| Generic pack prose not live on canonical | ~7.8k (file retained; not a second constitution) |

---

## Multiplicity / sections (live Marx self-study reconstruct)

| Measure | Value |
| ------- | ----- |
| Copy canonical heading `## 1. DLA ROLE` | **1** |
| Studio same heading | **1** |
| Copy vs Studio §§1–11 | **byte-identical** (33862 chars) |
| Title guidance | **1** (canonical §4) |
| Archetype planning essay | **1** (§6) |
| Forbidden bodies | **1** (§10) |
| §10 chars | **1,634** (bare section; live adds math slot) |
| §11 chars | **1,586** |
| Sprint 58 contract+shape hits | **0** live |
| Exact extra canonical duplication | **0** |

Live Copy total **36,441** (wrapper ~741 + canonical 33,862 + runner/footer). Live Studio total **33,862**. Unique ≈ assembled Copy (no pair duplication). T-011 band 40–52k Copy: **observational under-band** (EQF not slotted — see deviations). Not forced.

---

## Production files changed

- `lib/ld-dla-page-enrich-contract.js` — version, overlay, assembler live
- `app.js` — flag, Copy blank pack, `buildDlaV2CopilotSchemaInstructions` / Studio v2 short-circuit
- `index.html` — cache pins
- Tests listed below
- Sprint 77 pack docs

**Unchanged:** schemas, validators, GAM, EP, pack markdown file, legacy `buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet`.

---

## Tests

Gate B batch (2026-08-14): **264 pass / 0 fail**, including:

`ld-dla-canonical-assembler`, `ld-dla-evidence-decision-consistency-prompt`, `s76-dla-p01-p02-p03-contract`, `s76-dla-procedural-task-evidence-validation`, `s75-dla-evidence-decision-false-positive`, `page-dla-enrich` (once + rollback), `ld-activity-title-contract`, `ld-instructional-archetype-production-planning`, `sprint-72-evidence-centred-activity-slice`, `sprint-72-dla-evidence-guidance-ux`, `intellectual-coherence-bridge-coverage`, `dla-38l-obligation-smoke`, `workflow-dla-framing-capture-validation-gate`, `sprint-56-dla-capture-repair`, `sprint-56-dla-ssot-rationalisation`.

Rollback test: flag false restores dual `### Sprint 58 vNext DLA partial-page contract`.

---

## Deviations from T-012

1. Pack markdown **not edited** so rollback still sees U-1/U-3 wording; live path does not inject it.
2. EQF **not** slotted into §4/§6 on the canonical v2 path (avoids a second constitution after §11; Gate D may request a slot).
3. Overlay is a JS extract of workbook/G-gate/IFP, not a mechanical pack split.
4. Sprint 56 SSOT size ceiling raised 32k → 36k for **non-v2** Studio pack+augmentation path only.
5. Framing-gate “compliant” fixture given `intellectual_coherence_bridge` (validator unchanged; fixture was incomplete vs existing coverage rules).

---

## Gates

| Gate | Result |
| ---- | ------ |
| A static architecture | **PASS** |
| B automated regression | **PASS** (264) |
| C measurement | **PASS** (dup=0; sizes reported) |
| D behavioural generation | **NOT RUN** |

---

## Blockers before Gate D

Operator inspection of live Copy/Studio topology and Gate C numbers. EQF absence vs T-012 slot map. U-2 unresolved. Do not delete legacy builders.

**Exact next action:** Operator Gate D (Roman Roads / Lagrangian) — **not this task**.

**Phase D cleanup:** **NOT AUTHORISED**.
