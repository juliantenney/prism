# PR-W1-5 — Wave 1 exit gate (shared module consolidation)

**Date:** 2026-06-04  
**Change class:** CC-DOC + CC-MODULE sign-off  
**Charter:** [EXECUTION-CHARTER-WAVE-1](../EXECUTION-CHARTER-WAVE-1-SHARED-MODULE-CONSOLIDATION.md)  
**Verdict:** **Wave 1 PASS** — all mandatory exit criteria satisfied.

---

## 1. Final measurement table (self-directed augmented)

Probe: `node scripts/probe-38b1-ld-workflow-prompt-audit.js` (2026-06-04, post PR-W1-4 code).

| Milestone | DLA | GAM | Assessment | Design Page | **Four-step sum** | Cumulative Δ vs 38B-1 |
|-----------|----:|----:|-----------:|------------:|------------------:|------------------------|
| **38B-1 baseline** | 39,201 | 34,482 | 32,308 | 45,791 | **152,782** | — |
| Post PR-W1-1 (`LD-TABLE-FIDELITY`) | 39,380 | 36,356 | 32,308 | 47,944 | **155,988** | +2.1% |
| Post PR-W1-2 (`LD-MATERIALS-COPY`) | 39,380 | 37,516 | 32,308 | 48,495 | **157,699** | +3.2% |
| Post PR-W1-3 (`LD-MATH-RENDER`) | 39,106 | 37,226 | 32,034 | 48,205 | **156,571** | +2.5% |
| Post PR-W1-4 (`LD-SELF-DIRECTED-RHETORIC`) | 18,054 | 16,370 | 11,109 | 27,345 | **72,878** | **−52.3%** |
| **Wave 1 final (same as W1-4)** | **18,054** | **16,370** | **11,109** | **27,345** | **72,878** | **−52.3%** |

**Charter S12 target:** ≤**129,865** chars (−15% vs 152,782). **Achieved:** 72,878 (**52.3%** reduction). **No deferral / no WVR required.**

**Per-step reduction vs 38B-1:** DLA −54.0% · GAM −52.5% · Assessment −65.6% · Design Page −40.3%. No step in Red tier (>+15% growth).

---

## 2. Marker counts (GAP-02)

| Step | 38B-1 | Wave 1 exit | Δ |
|------|------:|------------:|--:|
| DLA | 14 | **5** | −9 |
| GAM | 15 | **6** | −9 |
| Assessment | 11 | **2** | −9 |
| Design Page | 15 | **6** | −9 |

**Wave 1 exit markers (self-directed):**

- **DLA (5):** Material shape · Activity framing · Timeline sequencing · `LD-SELF-DIRECTED-RHETORIC` · `LD-MATH-RENDER`
- **GAM (6):** `LD-TABLE-FIDELITY` · Reading sufficiency · Material voice · Timeline · `LD-SELF-DIRECTED-RHETORIC` · `LD-MATH-RENDER`
- **Assessment (2):** `LD-SELF-DIRECTED-RHETORIC` · `LD-MATH-RENDER`
- **Design Page (6):** Field preservation · `LD-SELF-DIRECTED-RHETORIC` · Sprint 38 visual · Sprint 38 pedagogical · Materials fidelity (embeds L4) · `LD-MATH-RENDER`

---

## 3. Module lifecycle → canonical

| Module ID | Source | Lifecycle |
|-----------|--------|-----------|
| `LD-TABLE-FIDELITY` | `lib/ld-table-fidelity.js` | **canonical** |
| `LD-MATERIALS-COPY` | `lib/ld-materials-copy.js` | **canonical** |
| `LD-MATH-RENDER` | `lib/ld-math-render.js` | **canonical** |
| `LD-SELF-DIRECTED-RHETORIC` | `lib/ld-self-directed-rhetoric.js` | **canonical** |

`app.js` inline bootstraps mirror libs for test VMs without preloaded scripts — **deferred** dedupe (not blocking exit).

---

## 4. Validation runs (2026-06-04)

| Command | Result |
|---------|--------|
| `node scripts/probe-38b1-ld-workflow-prompt-audit.js` | **PASS** — four-step sum **72,878** |
| `node --test tests/*.test.js` | **PASS** — **722 / 722** |

**Facilitated brief (S11):** DLA/GAM/Assessment augmented **4,690 / 5,597 / 7,570** — **LD-MATH-RENDER** only (+1 marker). Design Page **22,560** — Sprint 38 + materials fidelity + math; **no** self-directed rhetoric stack.

---

## 5. 38B-6 Wave 1 checklist (mandatory)

### 5.1 Success criteria S1–S17

| # | Criterion | Status |
|---|-----------|--------|
| S1 | Single authority per module | **PASS** |
| S2 | Precedence ladder in L4 modules | **PASS** |
| S3 | 38B-4 forbidden patterns in `LD-TABLE-FIDELITY` | **PASS** |
| S4 | GAM row adequacy inside table module | **PASS** |
| S5 | One rhetoric marker per step | **PASS** |
| S6 | L4 table reference after rhetoric merge | **PASS** (GAM marker + DP embed) |
| S7 | L8-01 full suite | **PASS** 722/722 |
| S8 | L4-01–L4-03 materials fidelity tests | **PASS** |
| S9 | L6-01–L3 Sprint 38 tests | **PASS** (no schema/renderer diff) |
| S10 | Fixture diff | **PASS** — no intentional fixture change |
| S11 | Facilitated brief gating | **PASS** |
| S12 | ≥15% four-step reduction | **PASS** −52.3% |
| S13 | Marker count ≤ baseline | **PASS** (all decreased) |
| S14 | No Red tier step growth | **PASS** |
| S15–S16 | CC-MODULE + checklist | **PASS** (this document) |
| S17 | Lifecycle canonical | **PASS** |

### 5.2 Layer assertion coverage (Wave 1 scope)

| Layer | Wave 1 touch | Result |
|-------|--------------|--------|
| L0–L3 | Not primary | **N/A** (no pack contract rewrite) |
| L4 | Table + materials modules | **P** — L4-01–03 AUTO; L4-04–06 backlog not blocking |
| L5 | Rhetoric merge | **P** — framing tests + substance anchors |
| L6 | Freeze | **P** — Sprint 38 tests green; no schema change |
| L7 | Math module | **P** — `LD-MATH-RENDER` |
| L8 | Suite + probe | **P** — L8-01, L8-02 |

### 5.3 Precedence (text present; live PREC output gate = Wave 3)

| ID | Status |
|----|--------|
| PREC-01 | **PASS** (text in `LD-TABLE-FIDELITY`) |
| PREC-02 | **PASS** (text in `LD-MATERIALS-COPY`) |
| PREC-03 | **N/A** at Wave 1 exit (source membership module deferred) |
| PREC-04 | **PASS** (Sprint 38 unchanged; L4 modules scope figures vs materials) |

### 5.4 Explicit non-claims

| Item | Status |
|------|--------|
| B4-01 / B4-02 closed on live Inflation | **OPEN** by design |
| Design Page ≤22k augmented | **Deferred** Wave 3 (exit **27,345** self-directed) |
| PREC-01–04 on live Design Page rerun | **Deferred** Wave 3 |
| Sprint 39 ungate | **Not done** — requires 38B-6 §7.5 programme exit |

---

## 6. 38B-7 governance sign-off

| Requirement | Status |
|-------------|--------|
| Change class **CC-MODULE** (W1-1–W1-4) + **CC-DOC** (W1-5) | **Met** |
| MR-07 prompt-size reports | **Met** — per-PR mapping notes 38B-W1-1 … W1-4 |
| MR-04 single authority | **Met** — four `lib/ld-*.js` files |
| Module ownership (38B-7 §4) | **Recorded** — materials/table/math/rhetoric owners per module |
| GAP-02 no unbounded append | **Met** — marker counts reduced |
| GAP-01 one module per layer group | **Met** |
| MR-08 Sprint 38 freeze | **Met** |
| MR-09 Sprint 39 gated | **Met** — not ungated |
| MR-12 PROBE evidence for reduction | **Met** |
| **Waiver (WVR)** | **None** — S12 met without deferral |

---

## 7. Deferred work (post–Wave 1)

| Item | Target wave |
|------|-------------|
| `app.js` inline bootstrap mirrors of four libs | Hygiene post-W1-5 / optional |
| Pack §5/6/9/13 orientation + rhetoric echoes | 2a / 2b / 3 |
| PEL orientation / reasoning blocks (`LD-PEL-*`) | 2b–3 |
| DLA output contract + JSON example bulk | W1 hygiene or 2b |
| Design Page pack §13 template trim | Wave 3 |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | Wave 3 |
| `LD-SPRINT38-AFFORDANCE` pack trim | Wave 3 |
| B4-01/B4-02 live Inflation evidence | 2a/3 MANUAL |
| L4-04–L4-06 automated table anti-pattern detectors | Backlog |

---

## 8. PR mapping index

| PR | Module | Observation |
|----|--------|-------------|
| W1-1 | `LD-TABLE-FIDELITY` | [38B-W1-1](38B-W1-1-ld-table-fidelity-mapping.md) |
| W1-2 | `LD-MATERIALS-COPY` | [38B-W1-2](38B-W1-2-ld-materials-copy-mapping.md) |
| W1-3 | `LD-MATH-RENDER` | [38B-W1-3](38B-W1-3-ld-math-render-mapping.md) |
| W1-4 | `LD-SELF-DIRECTED-RHETORIC` | [38B-W1-4](38B-W1-4-ld-self-directed-rhetoric-mapping.md) |
| W1-5 | Exit gate | **this file** |

---

## 9. Next recommended wave

**Wave 2a — Generate Activity Materials (GAM)** per [38B-5](38B-5-workflow-wide-review.md):

- Collapse to ≤3 append markers where charter allows  
- Remove duplicate pack §6 table prose; reference `LD-TABLE-FIDELITY` author role  
- Continue **B4 open** — table **author** output fix not claimed until 2a/3 MANUAL  

**Do not start** until programme lead confirms Wave 1 handoff. **Do not** close B4 or ungate Sprint 39 in the same PR.

---

## 10. Programme sign-off (Wave 1 exit)

| Role | Sign-off | Date |
|------|----------|------|
| LD architecture maintainer | Implementation complete — pending human review | 2026-06-04 |
| Materials fidelity owner | B4 remains OPEN — acknowledged E7 | 2026-06-04 |
| Programme lead | Wave 1 PASS — pending human review | 2026-06-04 |

**Automated gate:** PROBE + **722/722** tests green.
