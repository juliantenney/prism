# S74 — Programme Review After Sprint 74B

**Programme:** Sprint 74 — Architecture Consolidation and Rationalisation  
**Document:** Post-74B domain readiness review  
**Status:** Review complete (2026-08-07)  
**Mode:** Programme planning only — **no Sprint 74C pack created; 74C remains Not opened**  
**Authority:** Current codebase · [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) · [Sprint 74A final report](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) · [S74B-T-050](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-T-050-final-verification-and-sprint-closure.md) · [decisions.md](decisions.md) · [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

---

## 1. Current architectural state

After **74A** and **74B**, the supported product spine has definitive ownership:

```text
Create Workflow / Run
  → prompt + contracts (partial Design Page contract)
  → capture
  → validation (fail-closed; no legacy always-pass shims)
  → deterministic assemble (assembleVNextPageFromPartials)
  → Authoring Preview / HTML / ZIP / Open
  → learner-renderer-vNext (sole page renderer)
```

| Responsibility | Definitive owner (current) | Programme status |
| -------------- | -------------------------- | ---------------- |
| Learner **page** rendering / export | `PRISM_LEARNER_RENDERER_VNEXT` via Authoring pipeline | **Consolidated** (74A) |
| Non-page `slide_deck` HTML | `buildUtilityStructuredHtml` / `runUtilityRendererByPlan` | **Retained** — current owner, not obsolete Legacy |
| Design Page generation contract | Partial contract only | **Consolidated** (74B) |
| Page construction | Deterministic assemble | **Consolidated** (74B) |
| Capture validation (page partials) | Modern validators; obsolete shapes fail-closed | **Consolidated** (74B) |
| Orchestration / shell / runstate | `app.js` (permanent under `S74-D05`) | **Intentional** — not a consolidation target |
| Workflow Resources persistence | Sprint 73 closed path | **Out of scope** for 74A–C implementation |

74A and 74B both delivered **beyond** the original T-010 first-slice posture (74A removed the obsolete page renderer; 74B removed compose and legacy shims). The original plan’s remaining Domain C was never the next *architectural* ownership problem — it was repository/fixture noise deferred to last.

---

## 2. What architectural responsibilities remain unconsolidated?

**Current code**, not historical ideas:

| Remaining item | Nature | Notes |
| -------------- | ------ | ----- |
| Non-page structured HTML naming / docs (`buildUtilityStructuredHtml*`) | Clarification / naming debt | Ownership already definitive for `slide_deck`; not dual page ownership |
| Assemble-from-current-run when saved runs lack prompts | Product / runstate limitation | Documented 74A/74B qualified gap — not duplicate ownership |
| Broader UI–state pathway duplicates (PB-S-004 remainder) | Possible future rationalisation | Backlog still **low readiness**; not scoped by 74B |
| Schema SSOT relocation (`lib/schemas/`) | Deferred discovery | Explicitly out of 74A–C |
| `utilities*` → Authoring id rename | Product / UX naming | Explicit non-goal of early domains |
| WR orphan / mixed-data cleanup | Policy-blocked research | PB-R-008 — not implementation-ready |
| Broken post-74B probe scripts calling removed compose APIs | Tooling residue | Non-product; not runtime ownership |

**No remaining dual ownership of the supported page path** comparable to pre-74A Legacy vs vNext or pre-74B compose vs partial.

---

## 3. Is original Domain C still correctly bounded?

**No — do not proceed unchanged.**

Original Domain C ([S74-T-010](S74-T-010-rationalisation-domain-refinement.md)): **Repository & fixture hygiene** = scratch/archive audit + PB-S-001 fixture enrichment; WR orphans research-only; PB-FA-004 excluded.

| Concern | Assessment |
| ------- | ---------- |
| Scratch / root noise / `_archive` audit | Still valid **hygiene** work; low architectural value |
| PB-S-001 (`sprint-72-evidence-centred-activity-slice` / `intellectual_coherence_bridge`) | Still backlog **“Investigation needed — not sprint-ready”** |
| Mixing scratch deletion with fixture enrichment | Already **challenged** in T-010; risk profiles differ |
| Framing as next Sprint 74 “architecture consolidation” domain | **Misaligned** after 74A/74B — hygiene ≠ ownership consolidation (`S74-D07`) |

### Boundary recommendation

**Narrow** any future hygiene slice; do **not** broaden.

| Keep (if a hygiene sprint is authorised) | Exclude until separately ready |
| ---------------------------------------- | ------------------------------ |
| Reference-audited deletion of proven-unused root scratch (`test*.txt`, `tmp-*`, dumped HTML) | PB-S-001 fixture enrichment (needs investigation first) |
| Classification of `_archive/` / broken `scripts/probe-*` (delete vs retain-as-historical) | WR orphan auto-cleanup (PB-R-008) |
| Explicit “do not delete” list (`artifacts/`, sprint evidence packs) | PB-FA-004 product work |
| | Runtime/feature changes; pedagogy; export-path redesign |

**Do not merge** Domain C into a new mega-domain with orchestration or generation work.  
**Do not split** into a full architectural domain — there is no coherent ownership problem left at Domain C’s original ambition.

---

## 4. Where remaining work belongs

| Work | Belongs with |
| ---- | ------------ |
| Root scratch / archive reference audit | **Repository hygiene** |
| Broken compose-era probe scripts | **Tooling** (optional hygiene) |
| Compose-negative gate asserts | **Test architecture** — retain as guards |
| Misleading `buildUtilityStructuredHtmlForTest` naming | **Test architecture** / docs — optional |
| Assemble E2E when runs lack prompts | **Orchestration / Authoring** product gap — not 74C |
| PB-S-001 broad-suite failures | **Test architecture + fixtures** — investigation first |
| PB-S-004 UI–state duplicates | Possible future **rationalisation** domain — low readiness |
| WR orphans | **Research** (PB-R-008) — not Sprint 74 implementation |
| `slide_deck` structured HTML | **Rendering** (non-page) — already owned |
| Prompt/contract/capture/validation/assemble/page render | **Done** for supported path (74A/74B) |

---

## 5. Category separation

| Category | Items |
| -------- | ----- |
| **Architectural** | Supported page path ownership — **complete** for 74A/74B scope. Remaining architectural *candidates* (PB-S-004 remainder, schema SSOT) are **not** Domain C and not ready. |
| **Technical debt** | Misleading test helper names; dead probe scripts; optional structured-HTML naming clarity |
| **Repository hygiene** | Root `test*.txt` / `tmp-*` / dumped `page - *.html`; `_archive` retention policy |
| **Historical evidence** | Sprint packs; `_archive/`; compose `doesNotMatch` guards; T-010 discovery text |
| **Optional future improvement** | Assemble live-run E2E when fixtures exist; `utilities*` id rename; PB-FA-004 |

---

## 6. Active residue classification

| Residue | Classification |
| ------- | -------------- |
| Root scratch (`test-out.txt`, `test2`–`test6`, `test-compose.txt`, `tmp-*`, dumped page HTML) | **Should become Sprint work** (hygiene) if capacity is spent on repo noise |
| `_archive/` (small; historical) | **Can remain indefinitely** or **archive only** — delete only after reference audit |
| `scripts/probe-*` calling removed compose APIs | **Should become Sprint work** only if probes are still operator-used; else **can remain indefinitely** as non-product |
| Gate-test compose negative asserts | **Can remain indefinitely** — intentional guardians |
| Sprint discovery/plan docs mentioning removed compose | **Archive only** / historical evidence — do not rewrite |
| Unrelated `artifacts/` / certification JSON drift | **Must not** be deleted as “scratch”; out of Domain C deletion set |
| PB-S-001 failing broad suite | **Must become Sprint work** only after investigation proves approach + AC; today: **not ready** |

---

## 7. Remaining tests

| Finding | Evidence |
| ------- | -------- |
| Obsolete Legacy page / compose **families** already removed or retargeted | 74A T-045/T-050; 74B T-040/T-050 |
| Focused guardians predominantly protect **current** behaviour | 74B supporting **134/134**; phase0/phase1, capture validate, assemble, materials fidelity |
| Historical **naming** and negative compose asserts remain | Harmless / protective — not obsolete families requiring deletion |
| Known broad-suite false confidence | PB-S-001 — separate investigation; do not “greenwash” via careless fixture edits |

**Verdict:** No large obsolete test family remains that blocks architecture. The main test-architecture risk is the **known-failing broad suite**, not leftover compose/Legacy suites.

---

## 8. Estimates (if a narrowed hygiene next step is chosen)

| Dimension | Estimate | Notes |
| --------- | -------- | ----- |
| Implementation complexity | **Low** (scratch audit/delete); **Medium** if PB-S-001 included prematurely | PB-S-001 excluded until ready |
| Architectural risk | **Low** | No supported-path ownership change |
| Regression risk | **Low** for audited scratch deletion; **Medium** for fixture enrichment | Fixture masking remains the T-010 stop condition |

Original Domain C *unchanged* (scratch + PB-S-001 together): complexity **medium**, architectural risk **low**, regression risk **medium** — and readiness for the fixture half is **insufficient**.

---

## 9. Recommended next Sprint

### Explicit recommendation

**Do not open Sprint 74C unchanged.**  
**Replan Sprint 74 before continuing.**

### Rationale

1. Domains A and B delivered the programme’s ownership-consolidation value for the supported spine.  
2. Original Domain C is primarily **repository hygiene**, not the next `S74-D07` architectural domain.  
3. Half of Domain C (PB-S-001) remains **not sprint-ready** per the product backlog planning principle.  
4. Opening 74C “as planned” would mix ready hygiene with unready fixture work and overstate architectural necessity.

### Recommended programme options (operator chooses)

| Option | Description | When |
| ------ | ----------- | ---- |
| **R1 — Replan then narrow hygiene** | Authorise a **narrowed** 74C later: reference-audited scratch/archive/probe classification only; **exclude** PB-S-001, WR orphans, product features | If repo noise is the next capacity priority |
| **R2 — Pause / close architectural programme** | Treat Sprint 74 A+B goals as complete; keep wrapper open only for documentation, or close when operator prefers; schedule hygiene outside “architecture consolidation” framing | If no further ownership domains are justified |
| **R3 — Investigate before any fixture sprint** | Run a **bounded investigation** (not a 74C pack) for PB-S-001 readiness; only then decide fixture work | Before any fixture-enrichment sprint |

**Not recommended:** Open full original Domain C; pull PB-FA-004 / WR cleanup / UI–state PB-S-004 into “74C while we’re here.”

---

## 10. Risks

| Risk | Mitigation |
| ---- | ---------- |
| Treating hygiene as architecture | Keep framing honest; do not claim Domain C completes `S74-D07` for the product spine |
| Fixture masking (PB-S-001) | Investigation + focused guardians authoritative (T-010 stop condition) |
| Premature 74C pack | This review — 74C remains **Not opened** |
| Deleting certification / sprint evidence as “scratch” | Explicit retain list before any deletion |
| Reopening generation/export under hygiene | Charter non-scope; Engineering Disciplines ownership rules |

---

## 11. Closure of this review

| Question | Answer |
| -------- | ------ |
| Should 74C proceed unchanged? | **No** |
| Should Sprint 74 be replanned before continuing? | **Yes** |
| Is 74C opened? | **No** |
| Was a 74C pack created? | **No** |
| Next authorised implementation? | **None** until operator chooses R1 / R2 / R3 (or equivalent) |

**Stop.** Awaiting programme direction.
