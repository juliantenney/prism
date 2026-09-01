# Sprint 82 — Decision Log

**Sprint status:** **OPEN** (opened 2026-09-01)  
**Format:** ID · Decision · Status · Rationale · Consequences

---

## S82-D01 — Open Sprint 82 — Maths Entry & Alpha Completion

- **Decision:** Open Sprint 82 as a **bounded alpha-completion** sprint to close the honesty/functionality gap between commissioned mathematical learner evidence and the interaction PRISM provides to produce it, while preserving existing `text_entry` persistence and Sprint 81 learner architecture conclusions.

- **Status:** **Accepted** (2026-09-01)

- **Rationale:**
  - PRISM is **WORKING ALPHA** with first-class gate **339/339** and D-014 **RESOLVED**.
  - Gate 1 (`input_modality`) is **COMPLETE** — semantic commissioning works; live Lagrangian run validated DLA/GAM label join.
  - Gate 2 diagnostic is **COMPLETE** — renderer seam identified; persistence TeX-ready.
  - Plain textarea for commissioned maths fields is not necessarily appropriate; this is a product blocker, not a polish item.
  - Sprint 81 closed without opening Maths Entry; explicit new opening decision required.

- **Consequences:**
  - First substantive gate: **S82-G2A** MathLive interaction spike ([record](S82-G2A-mathlive-interaction-spike.md)).
  - Gate 2B implementation **not** authorised until 2A outcome recorded.
  - Sprint 81 remains **CLOSED** — no surface-family reopen.
  - Graphics material-role fix recorded as pre-S82 **CLOSED** — not an active stream.
  - Alpha hardening lifecycle pass remains **post-Sprint 82**.

---

## Pending decisions

| ID | Decision | Status |
| -- | -------- | ------ |
| S82-D03 | Close Sprint 82 | **Not satisfied** |

---

## S82-D02 — Gate 2A outcome: GO ALPHA MATHLIVE

- **Decision:** Accept **A — GO ALPHA MATHLIVE**. MathLive is PRISM's **alpha** learner-facing enhancement for commissioned `text_entry` fields with `inputModality: "math"`.

- **Status:** **Accepted** (2026-09-01) — operator decision

- **Rationale:**
  - The interaction is a good conceptual fit for PRISM: a maths-aware text field with TeX as its underlying representation and visual construction assistance for learners who do not know TeX.
  - The implementation remains lightweight and bounded.
  - Existing `text_entry` evidence and draft persistence remain authoritative.
  - Bidirectional synchronization and restore have been demonstrated.
  - Multiple maths fields remain independent.
  - Failure degrades cleanly to the canonical native textarea.
  - Local packaging is feasible at acceptable alpha cost (~1.1 MB under `lib/mathlive-spike/`).
  - The visual keyboard exposes the representative notation required by the current Lagrangian workflow (λ on Greek tab; fraction/superscript templates; ∂ on symbols tab).
  - Remaining keyboard, focus, label, accessibility and packaging issues are **bounded production-hardening concerns** rather than reasons to reject the treatment.

- **Qualification (alpha, not production claim):**
  - This is an **alpha treatment decision**, not a claim that MathLive usability or accessibility has been comprehensively validated.
  - Real learner use may identify future refinements, including virtual-keyboard configuration.
  - G2A browser validation preserved **unresolved findings** (see [evidence](S82-G2A-spike-evidence.md#manual-browser-validation-g2a--2026-09-01)); operator acceptance does not rewrite them as passes.

- **Evidence:** [S82-G2A-spike-evidence.md](S82-G2A-spike-evidence.md) · `tests/s82-g2a-mathlive-interaction-spike.test.js` (12/12) · [S82-G2A record](S82-G2A-mathlive-interaction-spike.md)

- **Consequences:**
  - **S82-G2B authorised** — implement and harden MathLive alpha treatment.
  - Enhanced textarea (Gate 2 diagnostic fallback) **not** selected for alpha.
  - Separate learner MathJax preview **not required** when MathLive is active.
  - Spike naming/assets (`math-entry-spike`, `lib/mathlive-spike/`) removed in G2B, not retroactively.

---

## S82-D03 — Close Sprint 82

- **Status:** **Not satisfied**
