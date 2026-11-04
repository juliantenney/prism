# Sprint 96 — M5 verification plan

**Status:** **OPEN** — prepared after qualified acceptances of S96-D13 / S96-D15 / S96-D16  
**Sprint:** 96 remains **OPEN**. M5 is **not accepted**.  
**Authoritative gates:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) § M5  
**Do not** create `SPRINT-96-CLOSURE.md` from this document alone.

This plan reuses existing evidence where valid and lists only genuinely missing checks. It does not invent pass results.

---

## M5.1 — Consolidated DUU experience verification

**Goal:** Author-accepted unified *Deciding Under Uncertainty* experience after S96 polish (nav, artefacts, persistence, zoom/responsive).

| Check | Existing evidence | Provenance | Still required? |
| ----- | ----------------- | ---------- | --------------- |
| Journey TOC / resource transitions | M1 browser; fidelity browser | **S96** | Light re-smoke on current export |
| Resource section nav | Cross-archetype nav tests | **S96** | Reuse unless regression suspected |
| C5→C6 labelled read-only artefact | S95-D06 live DUU | **S95 live** | Confirm still true on **current** S96 unified export |
| Missing-response behaviour when C5 empty | S95 browser + S96 artefact tests | **S95** + **S96 auto** | Confirm once on current export |
| Draft persistence across resource switches | Fidelity browser (C2↔C4) | **S96** | Reuse; optional C5 draft→reload |
| Reload restores drafts | S95 M4/M5 browser patterns; M4 maths reload | **S95/S96** | Confirm once on DUU export |
| Zoom / responsive ordinary use | M1/M2/D15 evidence | **S96** | Reuse ordinary desktop/narrow; **do not** claim 400% a11y |
| Graphics + editable tables | S96-D11 fidelity gate | **S96** | Reuse |

**Missing for M5.1 close:** A single short author/live checklist pass on the **current** unified DUU ZIP, recorded in [VALIDATION.md](VALIDATION.md), distinguishing reused S95 C5→C6 proof from this S96 confirmation.

**Not required for M5.1:** C5/C6 source regeneration (deferred per S96-D13).

---

## M5.2 — Mathematics journey acceptance

**Decision reference:** [S96-D16](decisions.md#s96-d16--accept-m4-mathematics-compatibility-qualified) — **Accepted (qualified)**.

| Check | Status |
| ----- | ------ |
| M4 packaging / offline / enhance / remount / typeset | **Accepted under D16** — evidence in VALIDATION M4 |
| Fixture ≠ DUU-native maths | **Qualification stands** — do not claim DUU embeds maths resources |
| Additional M5-specific requirement | **Author confirm:** whether M5.2 is satisfied by D16 alone for sprint closure, **or** whether a DUU-packaged (or other journey) maths smoke is still required |

Default engineering recommendation: treat **D16 as closing M5.2 for S96** with the documented fixture qualification, unless the author requires a DUU-native maths resource check.

---

## M5.3 — Accessibility smoke (bounded)

**Prefer perform** this short smoke rather than defer without investigation. Comprehensive a11y remains [S95-AD-020](ARCHITECTURAL-DEBT.md) / [S96-AD-007](ARCHITECTURAL-DEBT.md).

### Protocol (unified DUU export, desktop)

1. **Keyboard:** Tab through sidebar toggle → TOC → into active resource; Escape collapses expanded sidebar when focus is in sidebar (existing M1 behaviour).  
2. **Focus:** After resource switch, focus lands on resource title / main (existing shell behaviour); no keyboard trap in TOC or section nav.  
3. **Landmarks:** Single `<main>`; journey nav labelled; resource section nav distinguishable.  
4. **MathLive (if present in package):** Enhanced field reachable and labelled — else N/A for DUU.  
5. **Screen-reader (representative):** One pass (e.g. NVDA/VoiceOver): announce current resource on TOC activate; announce C6 artefact available or missing state; do **not** claim full audit.

Record: tool, OS, date, pass/fail per step, and that this is **smoke only**.

---

## M5.4 — Standalone + multi-document regressions

| Check | Status |
| ----- | ------ |
| Standalone resource ZIP path | **Passed** — publishing / fidelity / S82 maths suites |
| Multi-doc assembler retained & callable | **Passed** — S96-D14 evidence; internal only |

**Action:** No unnecessary re-run unless M5.1 export work touches packaging. Cite existing green suites at M5 accept time.

---

## M5.5 / M5.6 — Default unified download + explicit decision

| Gate | Status |
| ---- | ------ |
| M5.5 Unified default download; multi-doc fallback | **Satisfied by S96-D14** (Accepted) |
| M5.6 Explicit decision records switch | **Satisfied by S96-D14** |

**Action:** Reconcile at M5 accept — do not re-test UI. Note M5.5–M5.6 were advanced ahead of remaining M5.1–M5.3 gates.

---

## Educational QA v1.2 (supporting evidence, not an M5 map gate alone)

Archive location: [evidence/lj-qa-v1.2-calibration/](evidence/lj-qa-v1.2-calibration/).

Author-reported (not yet independently filed): Run 1 **86/100**, Run 2 **87/100**, both *Ready with qualifications*.

Until source reports are supplied and checked, do **not** treat scores as repo-evidenced. After archive: mark v1.2 **provisionally calibrated and frozen pending cross-journey validation**.

---

## Exit to sprint closure (future — not authorised here)

Only after M5.1 recorded, M5.2 disposition confirmed, M5.3 smoke recorded (or explicit author deferral), M5.4–M5.6 cited, and author approves: write `SPRINT-96-CLOSURE.md` and close decision.
