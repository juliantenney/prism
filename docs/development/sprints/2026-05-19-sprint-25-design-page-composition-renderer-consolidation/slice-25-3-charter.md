# Sprint 25 Slice 25-3 — Export / pageSections integration contract

**Date:** 2026-05-19  
**Status:** **Closed (documentation)**  
**Sprint:** 25 — Design Page composition and renderer consolidation  
**Slice:** 25-3

**Baseline:** [Composition contract (25-2)](design-page-composition-contract.md)

---

## Objective

Document how Utilities export must consume `page` artefacts without masking or overriding authoritative `page.sections[]`.

**No code, pack, renderer, or test implementation in this slice.**

---

## Deliverable

| Artefact | Path |
|----------|------|
| **Export contract (normative draft)** | [`design-page-export-contract.md`](design-page-export-contract.md) |

---

## Scope delivered

| Task | Section |
|------|---------|
| Export path audit | Contract §2 |
| Production risk assessment | Contract §3 |
| Export authority rules | Contract §4 |
| Renderer/export separation | Contract §5–§6 |
| Future parity test matrix | Contract §7 |
| 25-4 vs 25-5 recommendation | Contract §9 |

---

## Headline findings

| Finding | Detail |
|---------|--------|
| Live path passes `pageSections` | `handleUtilitiesGenerate` → `parsed.sections` |
| `sections[]` authoritative when present | `pageBodyFromSectionsArray` + `shouldSkipPageBodySectionKey` |
| Catalog `sectionOrder` has no `"sections"` key | Body in array; order = document order |
| Historical risk | Top-level keys before unified render — mitigated when `sections[]` exists |
| A2 + export | Export not primary suspect if `sections[]` complete; composition still primary |

---

## Constraints (honoured)

Documentation only. No renderer, export, pack, or test changes.

---

## Follow-on

| Slice | Action |
|-------|--------|
| **25-5** | T1–T4 tests, pack prompt, optional strict probe, architecture doc update |
| **25-4** | Renderer governance doc only until 25-5 lands; visual polish after |

---

## Verification

No code changes. Test floor unchanged.
