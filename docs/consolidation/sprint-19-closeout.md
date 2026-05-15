# Sprint 19 — closeout (Learning Design Workflow Rationalisation)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation complete  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Prior sprint:** [Sprint 18 checkpoint](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) — Research contextual refinement (**100** tests at closeout)

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **118 passed**, 0 failed

---

## 1. Sprint outcome

Sprint 19 rationalised the Learning Design Factory workflow path using **pack policy only** — no runtime rewrite. Three implementation slices shipped on top of an audit-first bootstrap:

| Slice | Deliverable | Tests at close |
|-------|-------------|----------------|
| **19-0** | LD workflow audit + sprint pack | 100 |
| **19-1** | `askRefinementByDefault: false` — generic post-synthesis `refinementFactors` queue off | 100 |
| **19-2** | LD `disclosurePolicy` + 4 structural `planningAdequacyChecks` | 108 |
| **19-3** | `stepRefinementProfiles` tier thinning (empty required tiers) | **118** |

**Architectural rule (unchanged):** Runtime interprets policy; domain packs declare policy. LD reuses the Sprint 18 Research adequacy interpreter.

**Four guidance layers after Sprint 19:**

| Layer | Role |
|-------|------|
| **Required essentials** | Blocking when missing — pre-synthesis |
| **Planning adequacy** | Assistive structural notices — Planning panel after synthesis |
| **Step Settings** | Primary advanced tuning (`mappingRules` → `stepParams`) |
| **Profile post-gen** | Optional opt-in only — no empty-tier blocking |

---

## 2. What changed (LD pack only)

| Area | Change |
|------|--------|
| `questionPolicy.askRefinementByDefault` | **`false`** (19-1) |
| `disclosurePolicy` + `planningAdequacyChecks` | **4 rules** (19-2) |
| `stepRefinementProfiles` | Required tiers **emptied**; factors demoted to optional (19-3) |

**Frozen:**

| Path | Note |
|------|------|
| `app.js` | **Unchanged** across Sprint 19 |
| Research pack, tests, fixtures **S1–S13** | **Untouched** |
| Renderer, schema, Prompt Studio | Out of scope |
| LD `validationRules` / `conflictPolicies` | **Not ported** (Slice 19-4 not run) |

---

## 3. Implemented LD adequacy rules (19-2)

| `id` | Intent |
|------|--------|
| `ld_generate_without_source` | Topic-only strategy vs source language + `Normalize Content` |
| `ld_scope_step_mismatch` | Session scope vs long step chain |
| `ld_assessment_generate_step_missing` | Assessment brief without `Generate Assessment Items` |
| `ld_page_profile_facilitator_mismatch` | Facilitator brief vs learner `page_profile` |

Cap: **3** rows per evaluation — pack declaration order matters.

---

## 4. Profile thinning summary (19-3)

| Profile | Before (required) | After (required) |
|---------|-------------------|------------------|
| `assessment_pack` | `assessment_type`, `assessment_total_items` | **`[]`** |
| `design_page` | `page_profile`, `learner_level` | **`[]`** |
| `learner_page_pack` | `page_profile`, `learner_level` | **`[]`** |

Mechanism: `tiers.required` → runtime `forceAsk: true`; empty required → **Ready** without blocking post-gen chat; optional tiers remain for opt-in refinement.

---

## 5. Manual validation

**Recorded:** [`sprint-19-manual-validation-post-19-3.md`](sprint-19-manual-validation-post-19-3.md)

| Result | Detail |
|--------|--------|
| **Passed** | Harness M1–M4 + pack contract tests |
| **Limitation** | Live API synthesis not fully automated in browser session; confirm API key **Loaded** on `npm run dev` for optional confidence run |
| **M1–M4** | No required post-gen block; no forced `learner_level` / assessment type/count / `page_profile`; adequacy non-blocking |

---

## 6. Test progression

| Milestone | Result |
|-----------|--------|
| Sprint 19 bootstrap | 100 passed |
| After 19-1 | 100 passed |
| After 19-2 | 108 passed (+8 `workflow-ld-adequacy.test.js`) |
| **Sprint 19 closeout** | **118 passed** (+10 `workflow-ld-profile-thinning.test.js`) |

**Research regression:** S1–S13 semantics unchanged; Research adequacy and conflict suites green.

---

## 7. Slice closeouts

| Slice | Document |
|-------|----------|
| 19-1 | [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) |
| 19-2 | [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md) |
| 19-3 | [`sprint-19-slice-3-closeout.md`](sprint-19-slice-3-closeout.md) |

**Audit:** [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../audits/ld-workflow-generation-rationalisation-audit.md)

---

## 8. Future backlog (not in Sprint 19 scope)

| Item | When |
|------|------|
| **Optional live API M2 confidence run** | Confirm API key Loaded; full assessment-pack synthesis end-to-end on `127.0.0.1:8787` |
| **Optional profile copy cleanup** | Shorten assessment optional list / opt-in prompts if Factory still feels noisy |
| **LD validation / conflict policies** | **Only if evidence emerges** — separate charter (planned 19-4, not implemented) |
| **Richer parameter adequacy predicates** | Only if needed; prefer Settings over new predicates |

---

## 9. Success criteria (programme)

| Criterion | Met |
|-----------|-----|
| LD post-synthesis noise reduced | **Yes** — generic queue off + profiles thinned |
| Structural guidance without blocking Ready | **Yes** — planning adequacy assistive only |
| Research stable | **Yes** — S1–S13 frozen, tests green |
| No runtime rewrite | **Yes** — `app.js` unchanged |
| Automated regression | **Yes** — **118** tests |

---

## 10. References

| Document | Role |
|----------|------|
| [`SPRINT-19-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) | Sprint folder checkpoint |
| [`review-log.md`](../development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/review-log.md) | Decisions R19-001–R19-010 |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Shared four-layer model |
