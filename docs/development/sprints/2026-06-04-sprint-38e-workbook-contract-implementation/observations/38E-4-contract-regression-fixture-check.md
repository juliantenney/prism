# Slice 38E-4 — Contract regression and fixture check

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-4  
**Authority:** [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)  
**Implementation:** [38E-2](38E-2-dla-contract-implementation.md) · [38E-3](38E-3-gam-contract-implementation.md)  
**Out of scope:** Inflation AFTER run · prompt edits · `app.js` · preservation module edits

---

## 1. Purpose

Verify that **38E-2** (DLA pack §5) and **38E-3** (GAM pack §6) provide **traceable coverage** for the [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) validation model and **`CW-REF-38D3`** fixture **before** a live Inflation AFTER evaluation (**38E-5**).

This slice is a **readiness and regression review** — not an evaluation of pipeline output quality.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V-01 … V-13 rules and layer model |
| [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) · [fixtures](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/) | `CW-REF-38D3` PASS shape |
| [NEG-EV-01](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/negative-exemplar-ev01-index.md) | AP-01 floor |
| `domains/learning-design/domain-learning-design-step-patterns.md` §5 · §6 | Implemented contracts |
| `lib/ld-table-fidelity.js` · `lib/ld-materials-copy.js` · `lib/ld-design-page-compose-contract.js` | V-13 preserve stack (read-only audit) |
| [38D-5 §10–11](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | AFTER execution criteria |

**Method:** Static pack text review · crosswalk to 38D-4 · automated prompt-surface tests · no pipeline invocation.

---

## 3. DLA coverage review

Primary evidence: `domain-learning-design-step-patterns.md` §5 `promptTemplate` + `defaultPromptNotes` ([38E-2](38E-2-dla-contract-implementation.md)).

| Validation rule | DLA implementation evidence | Coverage |
|-----------------|----------------------------|----------|
| **V-08** Duration 50–70 | `DLA-WB-03`; sum `duration_minutes` 50–70 | **Full** (prompt) |
| **V-09** DLA-WB Mandatory Pass | `DLA-WB-01` … `19` block; `delivery_notes` schema | **Full** (prompt — compliance is runtime) |
| **V-02** (upstream) Non-table spec | `DLA-WB-06` table-only prohibited at spec layer | **Full** (prompt) |
| **V-03** Consolidation (upstream) | `DLA-WB-12`; `consolidation_requirement` in `delivery_notes` | **Full** (prompt) |
| **V-04** Worked example (upstream) | `DLA-WB-08`; `sample_output` / `template` | **Full** (prompt) |
| **V-05** Scenario (upstream) | `DLA-WB-18` | **Full** (prompt; N/A when no case language) |
| **V-06** Capstone anti-dump (upstream) | `DLA-WB-16` prohibited; `DLA-WB-13` synthesis | **Full** (prompt) |
| **V-07** Judgement (upstream) | `DLA-WB-15` empty cells in spec | **Full** (prompt; when applicable) |
| **V-01** Genre diversity | `DLA-WB-06` ≥2 type families | **Full** (spec layer) |
| **V-10** Page R1–R7 | Outcome of V1+V2 — not DLA-prompt-verifiable alone | **Indirect** |
| **V-11** Render E1–E17 | Downstream — 38E-5 | **N/A** (this slice) |
| **V-12** ≠ EV-01-only | Programme rule — needs GAM output inventory | **Indirect** |
| **V-13** B4 preserve | DLA unchanged preserve modules; spec-only role preserved | **Full** (no regression) |

**DLA-WB clause → V-rule map (summary):** All [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) **Mandatory** clauses have explicit pack bullets; **Recommended** 09, 14 documented.

---

## 4. GAM coverage review

Primary evidence: `domain-learning-design-step-patterns.md` §6 `promptTemplate` + `defaultPromptNotes` ([38E-3](38E-3-gam-contract-implementation.md)).

| Validation rule | GAM implementation evidence | Coverage |
|-----------------|----------------------------|----------|
| **V-02** Not table-only (AP-01) | `Table-only workbook is contractually invalid`; `GAM-WB-MIX-01`; `AP-01` | **Full** (prompt) |
| **V-01** ≥4 type families | `GAM-WB-MIX-02`; material-type guidance breadth | **Full** (prompt) |
| **V-03** Consolidation | `consolidation_summary`; `GAM-WB-06`; `MIX-03` | **Full** (prompt) |
| **V-04** Worked example | `sample_output` / `worked_example`; `GAM-WB-02`; `MIX-04` | **Full** (prompt) |
| **V-05** Scenario | `scenario:` guidance; `GAM-WB-10`; `AP-04` | **Full** (prompt) |
| **V-06** Capstone anti-dump | `GAM-WB-20`; `AP-02`; `MIX-06` | **Full** (prompt) |
| **V-07** No pre-filled judgement | `GAM-WB-09`; `AP-03`; table guidance | **Full** (prompt) |
| **V-12** Type inventory ≠ EV-01 | Implied when V-02 Pass on AFTER run | **Indirect** |
| **V-09** DLA precondition | `GAM-WB-00` realise 100% DLA entries | **Full** (prompt) |
| **V-10** Page functions | Requires composed page — 38E-5 | **N/A** (this slice) |
| **V-11** Render | 38E-5 | **N/A** (this slice) |
| **V-13** B4 preserve | Obey LD modules; `do not weaken` in GAM-WB block | **Full** (no module edit) |

**GAM-WB-00 … 21:** All clauses in [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) mapped in [38E-3 §4](38E-3-gam-contract-implementation.md).

---

## 5. Canonical fixture alignment (`CW-REF-38D3`)

Compared [canonical-workbook-reference-manifest.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-reference-manifest.md), [canonical-workbook-dla-outline.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-dla-outline.md), [canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md) to 38E implementation.

| Fixture element | 38E implementation | Status |
|-----------------|-------------------|--------|
| `resource_intent` / 60 min / consolidation metadata | DLA `delivery_notes` fields (38E-2) | **Covered** |
| A1 orientation: text, task_cards, checklist | DLA-WB-07, 11; GAM material guidance | **Covered** |
| A2 exposition + sample_output + reference table | DLA-WB-08; GAM-WB-01, 02, 16 | **Covered** |
| A3 scenario + template + task_cards | DLA-WB-18; GAM-WB-10, 11, 17 | **Covered** |
| A4 scenario + table + rubric + rank empty | DLA-WB-15; GAM-WB-09, 14, 16 | **Covered** |
| A5 template + transfer + consolidation_summary | DLA-WB-12, 13, 14; GAM-WB-06, 07, 08 | **Covered** |
| Capstone ≤1 table; no four-table dump | DLA-WB-16; GAM-WB-20, MIX-06 | **Covered** |
| ≥4 type families / MIX rules | GAM-WB-MIX-01 … 06 | **Covered** |
| `modelling_note` optional | GAM material guidance; DLA-WB-09 recommended | **Partial** (optional path only — acceptable) |
| `misconception_note` optional | GAM-WB-15 when requested | **Partial** (optional — acceptable) |
| `reflection_prompt` with consolidation | GAM-WB-19 not substitute for retrieval | **Covered** |
| Live 5-activity inflation topic binding | Not in pack (structural reference only) | **N/A** (by design) |

**Missing from pack (acceptable):** Topic-specific content; automated enforcement of 5-activity skeleton — **model/runtime** responsibility in 38E-5.

---

## 6. Negative exemplar protection

| AP | How implementation addresses | Expected on NEG-EV-01 replay |
|----|------------------------------|----------------------------|
| **AP-01** Table-only workbook | DLA `DLA-WB-06` prohibits table-only **spec**; GAM `AP-01` / `MIX-01` **contractually invalid** | Should fail V-02 if model obeys prompts |
| **AP-02** Reference-dump capstone | DLA `DLA-WB-16`; GAM `GAM-WB-20`, `AP-02`, `MIX-06` | Capstone should not re-list four tables |
| **AP-03** Pre-filled judgement | DLA `DLA-WB-15`; GAM empty rating cells + rubric | A4-style pre-fill should be blocked |
| **AP-04** Scenario not authored | DLA `DLA-WB-18`; GAM `GAM-WB-10`, `AP-04` | Case language requires `Material: scenario` |

**Note:** Protection is **contractual in prompts** — not proven until AFTER artefacts scored ([38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)).

---

## 7. Preservation regression review

| Module | File | 38E-2/38E-3 change? | Risk | V-13 implication |
|--------|------|---------------------|------|------------------|
| **LD-MATERIALS-COPY** | `lib/ld-materials-copy.js` | **No edit** | **Low** | GAM §6 references obey; preserve role unchanged |
| **LD-TABLE-FIDELITY** | `lib/ld-table-fidelity.js` | **No edit** | **Low** | Table author/preserve unchanged; workbook adds genre mix only in pack |
| **LD-DESIGN-PAGE-COMPOSE-CONTRACT** | `lib/ld-design-page-compose-contract.js` | **No edit** | **Low** | Design Page §13 untouched — no compose creep |
| **Runtime augmentation** | `app.js` | **No edit** (38E-1 … 38E-4) | **Low** | Existing LD-* injection unchanged |

**Confirmation:** Pack §6 states **obey LD-MATERIALS-COPY and LD-TABLE-FIDELITY — do not weaken**. No workbook text added to `lib/*`.

**V-13:** Still evaluated **separately** on AFTER GAM→DP artefacts; workbook PASS must not be inferred from V-13 alone ([38D-4 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)).

---

## 8. Test / readiness assessment

### Tests added

| File | Purpose | 38D-4 tie-in |
|------|---------|--------------|
| [tests/workbook-contract-prompt-surface.test.js](../../../tests/workbook-contract-prompt-surface.test.js) | Pack §5/§6 contain gated DLA-WB / GAM-WB / AP-01 strings; § boundary; CW-REF genre tokens; lib modules free of workbook IDs | **V-02**, **V-08**, **V-09** (surface), **V-03–V-07** (GAM guidance), **V-13** (no lib drift) |

**Run:** `node --test tests/workbook-contract-prompt-surface.test.js` — **4/4 pass** (2026-06-04).

### Tests not added (and why)

| Candidate | Why deferred |
|-----------|--------------|
| GAM output genre parser on fixtures | Requires AFTER capture — **38E-5** |
| Full DLA JSON schema validator | No committed DLA export; **38E-5** scores V-09 |
| Design Page / render regression | Out of 38E-4 charter; V-10/V-11 in **38E-5** scorecard |
| Probe prompt size gate | Informational only; not pass/fail for readiness |

---

## 9. Inflation AFTER readiness

### Decision: **READY**

| Criterion | Assessment |
|-----------|------------|
| DLA contract coverage | **Sufficient** — V-08, V-09 prompt surface; DLA-WB-01 … 19 in §5 |
| GAM contract coverage | **Sufficient** — V-02 critical path; GAM-WB + MIX + AP in §6 |
| Fixture alignment | **Sufficient** — `CW-REF-38D3` elements covered or optional; no blocking gaps |
| Preservation protection | **Sufficient** — `lib/*` and §13 untouched; V-13 monitor on AFTER |

**READY means:** **38E-5 may proceed** to run Inflation AFTER and fill [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) scorecard.

**READY does not mean:** Workbook **PASS** is guaranteed — model compliance and brief gating remain risks (§10).

**NOT READY would require:** Missing AP-01 in pack, DLA/GAM boundary violation, or preservation module edits — **none observed**.

---

## 10. Risks

| Risk | Severity | Mitigation in 38E-5 |
|------|----------|---------------------|
| **Prompt interpretation** — model skips gated block | High | Score GAM type inventory; compare to `NEG-EV-01` |
| **Workbook gating failure** — brief without `workbook_contract_applied` | Medium | Use inflation brief with explicit self-study workbook intent |
| **Token / prompt pressure** | Medium | Monitor augmented size; watch truncation |
| **Weak genre realisation** — labels without bodies | High | Apply [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-04, V-05, V-03 on bodies |
| **Over-generation** — too many tables still | Medium | V-02 + V-06 on AFTER |
| **DLA without GAM follow-through** | Medium | Dual verdict Workbook + Preservation |
| **Partial PASS (EV-03-shaped)** | Medium | Use §7 tiers in 38D-5 — not binary failure |

---

## 11. Completion statement

| Criterion | Met? |
|-----------|------|
| Readiness decision explicit | **Yes** — **READY** |
| Preservation review complete | **Yes** — §7 |
| Implementation coverage mapped | **Yes** — §3–§5 |
| AP-01 protections exist | **Yes** — §6 |
| Traceability to 38D-4 | **Yes** — §3–§4 tables |
| 38E-5 can proceed | **Yes** |
| Slice **38E-4** | **COMPLETE** |

**Next slice:** **38E-5** — Inflation AFTER run; capture to [artefacts/](../artefacts/); complete scorecard; report **Workbook:** and **Preservation:** separately.
