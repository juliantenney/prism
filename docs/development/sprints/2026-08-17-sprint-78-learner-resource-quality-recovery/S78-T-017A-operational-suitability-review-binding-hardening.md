# S78-T-017A — Operational-suitability review binding hardening

**Task:** S78-T-017A  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Deterministic identity/binding only  
**Depends on:** [S78-T-017](S78-T-017-gam-operational-suitability-review-pass-implementation.md)  
**Does not include:** Stage-2 redesign · Lagrangian regeneration · T-013 · T-003 · JS semantic validation · review-criteria expansion · DLA/WS1/WS2/P02/assembly/renderer changes

Sprint 78 remains **OPEN**. Sprint 77 remains **CLOSED**. T-013 remains **OPEN**.

---

## 1. Previous fingerprint inputs

T-017 `fingerprintGamMaterials(gamPage)` hashed **all** GAM `material_id` + `body` pairs (FNV-1a 8-hex, ids sorted). Commission fields were **not** in the payload.

## 2. Weakness confirmed

**Confirmed.** A review PASS bound the generated bodies, not the authoritative commission those bodies were judged against. Same GAM + changed `expected_output` / purpose / specification / role would keep the old fingerprint. Conversely, a non-obligated workspace body change would stale a review without a commission change.

## 3. Canonical review-scope representation

`collectOperationalSuitabilityReviewScope(dlaPage, gamPage)`:

- Reuses T-015 `collectSuitabilityObligationsFromPage` (no second load-bearing definition).
- Joins each obligated row to the matching GAM body.
- Sorts rows by `activity_id` + `material_id`.

Prompt and fingerprint both derive from this object.

## 4. Fields included (identity)

Stable per-row fields hashed as `REVIEW_SCOPE_IDENTITY_FIELDS`:

- `activity_id`
- `material_id`
- `material_type`
- `role`
- `commission_mode`
- `learner_task`
- `expected_output`
- `purpose`
- `specification`
- `generated_body`

## 5. Fields deliberately excluded

| Excluded | Reason |
| -------- | ------ |
| Page title, audience, `page_profile`, activity title/grouping | Unrelated metadata |
| Non-obligated GAM bodies (workspace rows) | Not supplied for suitability judgement |
| Full page JSON / authoring contract | Presentation / other stages |
| Static review-criteria prose | Presentation-only |
| `practice_independence` / `response_fulfilment` contents | Prompt notes them as **out of scope**; not used to decide suitability |
| Role display labels (`complete worked/model result`) | Presentation of `role` |

## 6. Deterministic serialization

Local serializer only: sorted rows; fixed field order; `field:value` lines joined by `\n`, rows joined by `\0`. Exact string content preserved. No generic canonicalisation framework.

## 7. New fingerprint inputs

Field name remains `gam_fingerprint` (artefact churn avoided). It is now the FNV-1a 8-hex of the serialized **GAM + authoritative review scope**.

`fingerprintGamMaterials(dlaPage, gamPage)` delegates to `fingerprintReviewScope(scope)`.

## 8. Prompt / fingerprint single source of truth

```text
collectOperationalSuitabilityReviewScope
  → serializeReviewScope → fingerprintReviewScope → gam_fingerprint
  → buildReviewPromptFromScope (same rows + same fingerprint)
```

`evaluateReviewGate` collects the scope once and uses it for both.

## 9. GAM-change invalidation

Changed obligated `generated_body` → different fingerprint → `S78_OPS2_STALE_REVIEW`.

## 10. Commission-change invalidation

Changed `expected_output`, purpose, specification, role, `material_type`, or other identity fields → different fingerprint → stale.

## 11. Irrelevant-change stability

Title/audience/activity chrome and non-obligated workspace bodies do **not** change the fingerprint. Obligation row order does not change it.

## 12. Stale-review behaviour

Mismatch → `S78_OPS2_STALE_REVIEW` → review rejected → GAM cannot complete → operator reruns Copilot review. No migration of old fingerprints. No JS semantic interpretation.

## 13. Semantic judgement boundary

Unchanged: Copilot decides suitability; Prism binds identity and validates artefact shape.

## 14. Production files changed

- `lib/gam-operational-suitability-review.js`
- `index.html` (script cache-bust `s78-ops-2a`)

## 15. Test files changed

- `tests/s78-gam-operational-suitability-review.test.js` (T-017A R1–R12; existing T-017 callers updated to `fingerprintGamMaterials(dla, gam)`)

## 16. Documentation files changed

- This record
- `S78-T-017-gam-operational-suitability-review-pass-implementation.md` (§9–10 pointer)
- `STATUS.md`, `PLAN.md`, `SPRINT-78-START-HERE.md`

## 17. Tests run / results

`s78-gam-operational-suitability-review.test.js` — **36/36 PASS** (T-017 R1–R20 + T-017A R1–R12).

## 18. Protected regression results

T-015, T-012, T-011, WS1 DLA/GAM, `page-gam-enrich` — **146/146 PASS** in the combined batch.

## 19. Deviations

None material. Kept `gam_fingerprint` name. WS1/WS2 presence remains prompt-only (not hashed), matching “hash only fields the review uses to judge suitability.”

## 20. Exact recommended next action

**Resume S78-T-013** operator-led (after T-018 UX):

```text
EP → DLA → GAM → Verify generated materials (Check verification) → assembly → QA
```

Do not regenerate in T-017A. Do not start T-003. Do not mark operational suitability closed from unit tests or from regenerate-until-pass. Operator-facing GAM sub-flow: [S78-T-018](S78-T-018-operational-suitability-review-ux-workflow-integration.md). Product rule: [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification).
