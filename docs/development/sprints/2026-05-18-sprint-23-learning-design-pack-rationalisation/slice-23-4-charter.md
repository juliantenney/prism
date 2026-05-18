# Sprint 23 Slice 23-4 — Workflow vs step parameter ownership

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-4

**Baselines:** Slices 23-1–23-3 audit artefacts  
**Deliverable:** [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md)

---

## Objective

Define parameter **ownership**, **precedence**, **inheritance**, and **edit-surface** responsibility across workflow/step metadata, PF, mappingRules, and runtime — governance only, no implementation.

---

## Approved model (charter)

- Elicitation initialises state; Settings operational after synthesis.  
- Design Assessment = canonical assessment authority.  
- Generate Assessment Items inherits from DA by default unless overridden.  
- Runtime inheritance preserved until post-23-5/23-6 parity.

---

## Scope

| In scope | Out of scope |
|----------|--------------|
| Ownership vocabulary, precedence, inheritance doctrine | Pack edits (23-6) |
| Assessment ownership model | Runtime retirement |
| Alias/naming policy | Settings redesign |
| Master ownership matrix | Research packs |

---

## Outcomes

| Outcome | Status |
|---------|--------|
| `ld-parameter-ownership-model.md` | **Done** |
| No pack/runtime delta | **Verified** |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## Handoff

- **23-5:** Design Assessment semantics (§7)  
- **23-6:** Pack metadata (§11, §10)  
- Runtime inheritance retirement: separate charter after 23-6
