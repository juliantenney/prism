# Sprint 97 — Initial investigation (M1 architectural baseline)

**Date:** 2026-11-12  
**Status:** Complete — informs IMPLEMENTATION-MAP; **journal implementation not authorised**  
**Baseline:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`  
**Opening:** [S97-D01](decisions.md#s97-d01--open-sprint-97--learning-journal-and-design-pattern-foundations)  
**Contract lock:** [S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract) (Q1–Q7 resolved)  
**Incremental workflow:** [S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star)  
**Data-model compatibility:** [S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)

---

## 1. Sprint identity and protocol

| Authority | Finding |
| --------- | ------- |
| [docs/sprints/NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) | No open sprint; last closed = **Sprint 96**. Next allocated number is **97**. |
| [development-protocol.md](../../development-protocol.md) | Open under `docs/development/sprints/`; define goals/non-goals; investigate before implement; close with evidence; promote only programme-significant deltas to Governance. |
| Sprint pack convention (S95/S96) | START-HERE, CHARTER, IMPLEMENTATION-MAP, INITIAL-INVESTIGATION, decisions, STATUS, PLAN, VALIDATION, ARCHITECTURAL-DEBT, HANDOVER, next-chat-briefing, programme stub under `docs/sprints/`. |

**Working-tree note:** Baseline is the last committed HEAD. The tree also contains uncommitted post-96 work (including unified artefact carry-forward signposting). M2+ must treat that work as present context and avoid conflicting rewrites of the artefact contract.

---

## 2. Architecture and integration points

### Unified shell (primary runtime host)

`lib/learning-journey-unified-shell.js`

- TOC is an ordered list of destinations: optional **overview**, then commission resources.  
- Overview uses sentinel id `overview` (`OVERVIEW_NAV_ID`) and `kind: "overview"`.  
- Mount path: `mountLearnerResource` for commissions; overview is template HTML, not a product mount.  
- Artefact contract is embedded as `#lj-shell-artefact-contract` JSON; on mount, `injectArtefactReferences` runs for the active commission.  
- Sequence rows carry `commissionId`, `title`, `pageKey`, `productId`, `kind`.

**Journal implication (locked):** Add a permanent TOC destination **after** constituent resources. TOC order: Overview (if present) → resources → Learning Journal. Distinct `kind: "journal"` and stable nav id `journal`. Mount a shell-owned read-only view — not a first-class product commission.

### Artefact contract and retrieval

`lib/learner-renderer-vnext/learner-artefact-contract.js`

| Mechanism | Behaviour |
| --------- | --------- |
| `normalizeArtefactContract` | Dedupes `produces[]` / `references[]` |
| `produces` | `{ artefactId, commissionId, workspaceId, label, pageKey? }` |
| `references` | Consumer commission → artefactId for read-only use |
| `resolveArtefactReference` | Loads producer draft from browser storage; returns only the declared workspace |
| `injectArtefactReferences` | Inserts consumer reference regions + producer signposts (unified only) |
| `proposeArtefactContractFromLearningJourney` | Derives pairs from `commission.dependencies` + constructed Assessment Pack workspaces |

**Persistence guarantees (unchanged):**

- Drafts saved via existing learner-draft controls → `learner-renderer-vnext:draft:<pageKey>`.  
- Same browser / same device only.  
- Missing, empty, or unavailable storage → truthful unresolved status.  
- Manual copy remains the standalone / fallback path.

**Journal implication (locked):** Each journal entry references an `artefactId` present in `produces[]` (declared producer). Eligibility is **not** limited to artefacts that a later resource consumes. Population = `resolveArtefactReference` (or equivalent shared helper). Do **not** invent a second learner-work storage schema; do **not** expose undeclared workspaces or arbitrary draft fields.

**Data-model compatibility ([S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)):** Treat constituents, `produces`, `references`, and `learning_journey.journal` as one reusable journey-level model with stable identities and explicit relationships. Keep contracts separable from unified-shell presentation. Evolve schemas additively and only as required by the journal — not as speculative scaffolding for conditional logic, branching, or extra learner-state (out of Sprint 97 scope).

### Design / commissioning pipeline

`lib/learning-journey-design-page.js`

- Authoritative journey page: `product_id: "learning_journey"` with `sections[]`, `commissions[]`, `learning_journey.{design_intent,continuity}`, `assembly_state`.  
- `commissions[]` is non-rendering metadata for constituent products.  
- Design Page prompt currently has **no** journal field — **M3 must add normal commissioning**.

**Locked home for journal specification ([S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract)):**

```text
page.learning_journey.journal = {
  enabled: true,
  title: "Your Learning Journal",   // learner-facing TOC / heading
  entries: [
    {
      entry_id: "j1",
      order: 1,
      title: "…",                    // learner-facing
      framing: "…",                  // pipeline-authored narrative (intended progression)
      artefact_id: "c1.E1"           // must match a declared produce declaration
    }
  ]
}
```

Rationale (accepted):

- Journey-level concern (not a product commission).  
- Sits beside `design_intent` / `continuity`.  
- Assembly can pass the object into the unified shell without inventing a new commission product.  
- Journeys omitting `journal` (or `enabled: false`) remain compatible — no journal TOC.

**Rejected:** A synthetic `commissions[]` row with `product_id: "learning_journal"`.

**Pipeline honesty:** Framing describes intended cognitive progression / pedagogical purpose. It must not claim actual cognitive changes or improvements that cannot be established from learner work.

### Package assembly

`lib/learning-journey-learner-package.js` + unified shell package API

- Builds resource fragments, proposes/enriches artefact contract, emits unified `index.html`.  
- Journal spec should be assembled into the shell payload next to `artefactContract` (e.g. `#lj-shell-journal-spec` script JSON).

### Compatibility without journal specs

| Case | Required behaviour |
| ---- | ------------------ |
| No `learning_journey.journal` | No journal TOC item; shell behaviour identical to Sprint 96 |
| `enabled: false` | Same as absent |
| Entries reference unknown artefactId | Entry renders truthful missing/unavailable; do not invent content |
| Standalone resource HTML | Unchanged — no journal chrome |
| Multi-doc internal packager | Unchanged / out of journal scope |

---

## 3. Reference journeys

| Pattern | Journey | Role in Sprint 97 |
| ------- | ------- | ----------------- |
| Progressive Evidence Disclosure | *The Decision That Went Wrong* / *Deciding Under Uncertainty* | Journal + catalogue established pattern #1 |
| Draft, Judge, Revise | *Explaining Research: From First Draft to Better Judgement* | Journal + catalogue established pattern #2 |

**Do not** reopen educational QA or regenerate unchanged constituents for journal work. Development/testing uses three levels ([S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star)):

1. **M2 runtime** — hand-authored journal fixtures + existing contracts/drafts.  
2. **M3 journal commissioning** — Design Page generate/revise of journal specs without regenerating constituents.  
3. **M5 integration** — journey-level pipeline journal generation from original LJ briefs + incremental unified reassembly reusing constituent outputs.

**M2** fixtures prove runtime only; they do not satisfy sprint acceptance.

Likely artefact anchors (illustrative — confirm against live contracts at M3/M5):

- DUU: C5 independent judgement (declared producer; journalable even beyond later consumption).  
- Explaining Research: C1 original explanation; C5 revised explanation (declared producers).

---

## 4. Notifications (locked — S97-D03)

Implementation in M2 must honour:

- Fingerprints of **resolved learner-visible artefact content** (not `savedAt` alone).  
- Count missing→populated and **substantive content changes**; ignore repeated saves of unchanged content.  
- Opening the journal acknowledges the **currently displayed** state.  
- Acknowledgement state is **journey-scoped** and **separate from constituent draft storage**.  
- Counts exposed accessibly.  
- Exact hash/normalisation algorithm is an M2 implementation detail ([S97-AD-008](ARCHITECTURAL-DEBT.md)).

---

## 5. Design Pattern Catalogue (Workstream B)

**Locked location:** `docs/design-patterns/` ([S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract) Q6).

**Standard pattern fields:**

1. Purpose  
2. Distinctive cognitive mechanism  
3. Sequence  
4. Learner artefacts  
5. Journal opportunities  
6. Implementation constraints  
7. Example applications  

**Standard demonstrator fields:**

1. Working Learning Journey (title / status)  
2. Actual PRISM commissioning brief / form fields (reuse real values; do not invent missing history)  
3. Pedagogical rationale  
4. Cognitive journey map  
5. Artefact / journal map  
6. Adaptation guidance  
7. Copyable **Create Your Own** LLM conversation prompt  

**Provisional patterns:** Listed and pedagogically distinct, but **not** claimed technically validated or demonstrated until demonstrators develop.

**Relationship to PB-FA-026:** Catalogue + offline prompts in scope. Assisted brief-development service remains out of scope ([S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract) Q7).

---

## 6. Smallest coherent implementation sequence

```text
M1  docs + baseline + S97-D03/D04 lock   ← complete
 │
 ├─► M2  Level 1 runtime — TOC + journal view + notifications
 │        (hand-authored fixture journal JSON; no pipeline)
 │
 ├─► M3  Level 2 — schema + assembly + Design Page journal commission/revise
 │        (no constituent regen; fixtures do not satisfy acceptance)
 │
 ├─► M4  catalogue at docs/design-patterns/ (2 established + 10 provisional)
 │        (pedagogical north star informs pattern specs)
 │
 └─► M5  Level 3 — journey-level journal generation from original briefs
          + incremental unified reassembly + regressions + closure
```

Prefer existing assembly APIs that reuse constituent outputs. If incremental reassembly is blocked, document the limitation and propose the smallest correction — no new caching/regeneration framework.

---

## 7. Targeted tests (planned)

| Area | Planned focus |
| ---- | ------------- |
| M2 | Level 1: TOC; journal mount; content-fingerprint badges; missing work; absent/disabled spec; safe rendering — fixtures only |
| M3 | Level 2: schema; assembly embed; Design Page generate/revise journal without constituent regen; old journeys unchanged |
| M4 | Catalogue at `docs/design-patterns/`; established patterns; 10 provisionals unvalidated; real briefs; north-star alignment |
| M5 | Level 3: journey-level pipeline journals from original briefs; incremental reassembly; Level 1 vs Level 3 evidence separated; regressions |

---

## 8. Risks and residual open items

Q1–Q7 are **resolved** by [S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract). Incremental workflow is **resolved** by [S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star). Data-model extensibility as a compatibility principle is **recorded** by [S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle) (not Sprint 97 feature scope).

Remaining implementation details (not product blockers for M2 authorisation):

1. Exact content-fingerprint hash/normalisation ([S97-AD-008](ARCHITECTURAL-DEBT.md)).  
2. Coordination with uncommitted post-96 shell/artefact-signposting work ([S97-AD-005](ARCHITECTURAL-DEBT.md)).  
3. Availability of original LJ briefs / form-field captures for M4/M5 without inventing missing values.  
4. Confirm at M3/M5 that existing unified assembly APIs support journal-spec swap + constituent reuse; if not, document smallest gap ([S97-AD-010](ARCHITECTURAL-DEBT.md)).
