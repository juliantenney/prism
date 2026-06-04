# Slice 39-6 — Validation plan

**Date:** _pending_  
**Status:** **PENDING**  
**Authority:** Sprint 38 E2E baseline — [ARCHITECTURE.md](../../development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)

---

## Success criterion

Define how to judge Sprint 39 **authoring guidance** and (future) prompt changes against Sprint 38 outputs — without new automated test requirements in discovery phase.

---

## Baseline (Sprint 38)

| Metric | Sprint 38 state |
|--------|-----------------|
| Pipeline | E2E pass |
| Schema validity | Invalid rows dropped at compose |
| Authoritative VEU | `generate` rows queue images |
| A3 first image | Structurally valid; **cue-weak** |

All Sprint 39 comparisons are **relative to this baseline**, not to pre-38 hook inference.

---

## Validation dimensions

| Dimension | Definition | Method |
|-----------|------------|--------|
| **Cue visibility** | A designer can name ≥3 perceptible cues the figure must show | Human-designer test |
| **Reasoning support** | Figure supports the reasoning move in `purpose` without duplicating materials | Side-by-side materials + image |
| **Duplicate structure rate** | % figures that mirror blank worksheet/table | Rubric on anchor set |
| **Human-designer judgement** | Pass/Fail per [SPRINT-39-CHARTER.md](../SPRINT-39-CHARTER.md) test | 2 reviewers |
| **Anti-spoiler preservation** | No answers/keys in image when `anti_spoiler: true` | Checklist from `spoiler_boundary` |
| **Discipline fidelity** | No disallowed claims visible | `disallowed_claims` + expert review |

---

## Anchor replay protocol

1. Re-run Design Page on Inflation (and subset: Climate A mechanism, CI A4, Marx A3) with **39-5-guided** affordance authoring.  
2. Compose → render HTML → VEU authoritative → generate images.  
3. Compare to Sprint 38 baseline images and `selection_notes`.  
4. Record pass/fail per dimension in [probe-39-6-validation-checklist.md](../fixtures/probe-39-6-validation-checklist.md).

---

## Minimum pass bar (proposed)

| Anchor | Generate rows | Pass requirement |
|--------|---------------|------------------|
| Inflation A3 | 1 | No worksheet duplicate; ≥2 discriminating cues visible |
| Inflation A2 | 1 | Comparison dimensions visible; table not duplicated |
| Climate | 2 | Mechanism + evidence cues distinct |
| CI A4 | 1 | Endpoints exact; no invented interval |
| Marx A3 | 1 | Text comparison dimensions visible |

Programme pass: **≥4/5** anchor generates pass human-designer test after cue authoring update.

---

## Non-goals (validation)

- Pixel-level aesthetic scoring  
- Image model A/B across providers  
- Automated computer-vision cue detection (future research)

---

## Deliverables

- [ ] Completed checklist template usage  
- [ ] Rubric scoring sheet  
- [ ] Recommendation for post-39 implementation slice (prompt-only vs validator hints)
