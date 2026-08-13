# Sprint 75 — Plan

**Status:** **COMPLETE / Closed** (closed 2026-08-12)  
**Closure:** [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md) · [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Next:** [Sprint 76 — OPEN](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/SPRINT-76-START-HERE.md) → Settings (**PB-FA-005**) later

Task IDs: `S75-T-###`. Decision IDs: `S75-D##` in [decisions.md](decisions.md).

Later implementation tasks are **intentionally not detailed** yet. Programme structure after T-010 is **evidence-led**.

---

## Programme domains (`S75-D02`)

| Domain | Name | T-010 posture |
| ------ | ---- | ------------- |
| **A** | Elicitation & Workflow Generation | **Detailed decomposition** (first detailed area) |
| **B** | My Workflows | Programme-map + **Run operator evidence** (2026-08-10); Settings investigation **complete** — implementation **PB-FA-005** |
| **C** | Authoring | Programme-map + **operator evidence** (2026-08-10) — entry/provenance strongest gap |
| **D** | Prompt Studio | Programme-map level only |
| **E** | Prompt Library | Programme-map level only |

Domains are programme boundaries, not fixed implementation slices. Equal effort is **not** assumed.

---

## Execution order (authorised so far)

```text
S75-T-001 (pack init) ✅ Done
  → S75-D02 (programme structure refinement) ✅ Accepted
  → S75-T-010 (primary journey map + Domain A decomposition) ✅ Done
  → Domain B Run operator evidence ✅ Recorded
  → B→C handover + Domain C Authoring evidence ✅ Recorded
  → Primary operator journey A→B→C→export — evidence complete
  → S75-T-020 cross-journey synthesis ✅ Done
  → S75-D03 generic Create Workflow reviewer retired ✅
  → S75-D04 C-01/C-02 Run→Authoring handoff + provenance ✅
  → S75-D05 Edit validateWorkflow false-positive fix ✅
  → S75-D06 C-03 persistent lightweight Run orientation ✅
  → S75-D07 C-04 Run capture relevance (page-structure producers) ✅
  → S75-D08 Run UX simplification (operator copy + execution bar) ✅
  → S75-D09 Create Workflow API-key prerequisite (C-05) ✅
  → S75-D10 My Workflows default / handoff mode (C-07) ✅
  → S75-D11 C-06 LD Create output honesty ✅
  → S75-D12–D20 Authoring / Run-capture durability sequence ✅ (see decisions.md)
  → S75-D21 Run capture migration to IndexedDB / ref-only runtime ✅
     → Persistence SETTLED (do not casually reopen)
  → S75-D22–D25 Create UX pass ✅
     → one product · progressive assistant · hide resolved-brief UI · Proposed workflow read-only
     → Create UX pass COMPLETE
  → My Workflows Run UX, lifecycle, progress indication ✅
  → Prompt Studio + Prompt Library UX ✅ (S75-D26–D32)
  → Sprint 75 programme COMPLETE (2026-08-12)
  → Sprint 76 OPEN (2026-08-13) — DLA audit / content-quality consistency
  → THEN: Settings / parameterisation (PB-FA-005)
  → Deferred: T-020 C-09 / C-11 / C-12 · advanced Edit overhaul (if warranted)
```

Authoritative historical snapshot: [STATUS.md](STATUS.md). Live programme: [Sprint 76 STATUS](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/STATUS.md).

---

## Tasks

### S75-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-10) |
| **Ownership** | Sprint documentation |
| **Approach** | Create Sprint 75 pack; top-level overview; open decision `S75-D01`; define T-010 without executing it; record Sprint 74 as COMPLETE predecessor |
| **Acceptance** | Pack files present; relative links valid; no UI/runtime/test/fixture product changes; T-010 defined not started; Sprint 75 OPEN |
| **Verification** | [S75-T-001-sprint-pack-initialisation.md](S75-T-001-sprint-pack-initialisation.md) |

Post-init refinement (`S75-D02`, T-010 reframe): recorded in T-001 §11 — not part of original T-001 scope.

---

### S75-T-010 — Primary journey map and Domain A decomposition

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-10) |
| **Ownership** | UX discovery |
| **Mode** | **DISCOVERY ONLY** |
| **Deliverable** | [S75-T-010-primary-journey-map-and-domain-a-decomposition.md](S75-T-010-primary-journey-map-and-domain-a-decomposition.md) |
| **Outcome** | 12 Domain A stages (A0–A11); A–E journey map; operator synthesis recorded; T-011/012/013 **not authorised** (boundaries under reconsideration) |

*(Full task definition preserved above for reference.)*

---

### S75-T-020 — Cross-journey UX evidence synthesis and intervention framing

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-10) |
| **Ownership** | UX discovery / synthesis |
| **Mode** | **SYNTHESIS ONLY** — no implementation |
| **Deliverable** | [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md) |
| **Outcome** | Nine cross-journey themes; experienced journey model; T-011/012/013 reassessment; twelve candidate slices (C-01…C-12). Later Sprint 75 work implemented/resolved many slices (see [STATUS.md](STATUS.md) / [decisions.md](decisions.md)). **C-09 / C-11 / C-12** remain **deferred**. Create UX pass **COMPLETE**; persistence **SETTLED**; **NEXT** My Workflows functional audit. |

---

*(S75-T-010 full task definition below.)*

#### Purpose

1. Establish the current Prism **product journey** at a useful high level.  
2. Confirm the **five programme domains** (A–E) and their transitions.  
3. Inspect **Domain A — Elicitation & Workflow Generation** enough to decompose it into meaningful UX stages.  
4. Identify the **first detailed UX discovery task(s)** for Domain A.  
5. Do **NOT** perform detailed UX auditing of Domains B–E yet.

#### Domain A — initial scope hypotheses (discovery refines; not final)

Evidence should determine whether Domain A contains stages such as:

- application entry / orientation into workflow creation  
- initial brief entry  
- elicitation interaction  
- elicitation progress / completion  
- transition from elicitation into workflow generation  
- workflow generation progress / feedback  
- generated workflow review / confirmation  
- saving / transition into My Workflows or execution  

These are **hypotheses for discovery**, not predetermined task boundaries.

#### Domains B–E — programme-map level only in T-010

| Domain | Record at map level | Detailed audit in T-010 |
| ------ | ------------------- | ----------------------- |
| B. My Workflows | Yes | **No** |
| C. Authoring | Yes | **No** |
| D. Prompt Studio | Yes | **No** |
| E. Prompt Library | Yes | **No** |

Do not invent implementation tasks for B–E in T-010.

#### Evidence sources (priority order)

| Source | Role |
| ------ | ---- |
| **A. Operator observation** | **Primary** — actual use of Prism while exercising real product journeys; reported friction |
| **B. Supporting implementation inspection** | Explain observed behaviour; locate responsible UI/state; identify constraints; distinguish presentation vs interaction/journey issues — **inspect only; do not change** |
| **C. Product intent** | Existing documentation, architectural constraints, current supported workflows |

**Experience before implementation:** Do not derive usability findings solely from static code inspection where behaviour can be observed directly.

#### Cross-cutting concerns (assessed in T-010 as noted in charter)

Assessed **in context within Domain A** where they arise; **programme-map notes** for whole-product assessment later. Not separate implementation workstreams at programme opening:

navigation · orientation · terminology · progress/state feedback · errors/recovery · empty/disabled/enabled states · discoverability · cognitive load · accessibility · consistency · responsive behaviour · visual hierarchy · engineering/implementation concept leakage

#### User perspectives

- Do **not** assume a single persona.  
- Record apparent users and goals **implied by the existing product**.  
- Where evidence is insufficient, **flag for operator discussion** — do not invent personas.

#### Explicit exclusions

- Detailed UX audit of Domains B–E  
- UI / interaction / visual redesign  
- Runtime, generation, renderer, pedagogic-contract, or workflow-semantics changes  
- Opening implementation tasks beyond identifying first Domain A discovery task(s)  
- Reopening Sprint 74 architecture  

---

## Deferred (not tasks yet)

| Topic | Status / trigger |
| ----- | ---------------- |
| **S75-T-011** (A0–A3) | **Superseded** — see S75-T-020 §9 |
| **S75-T-012** (A4–A6) | **Retired** as discovery boundary |
| **S75-T-013** (A7–A11) | **Superseded** — see S75-T-020 §9 |
| **S75-T-020 intervention slices (C-01…C-12)** | Through Create/Run/Authoring work many slices **Done/Resolved** (see [STATUS.md](STATUS.md)); **C-09 / C-11 / C-12 deferred**; **NEXT** My Workflows functional audit (distinct from historical C-09 framing) |
| **QA / refinement lifecycle** | Deferred to [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) (Sprint 71 prior art explicit) |
| **Provisional slice A** — Intent, capability & brief formation | Not a task — operator may authorise revised discovery |
| **Provisional slice B** — Generated design, refinement & parameterisation | Generic graph reviewer retired (`S75-D03`); Create Draft/Refined chrome retired (`S75-D25`); remaining parameterisation → PB-FA-005 / PB-FA-006 |
| **Provisional slice C** — Workflow commitment & handoff | Not a task |
| **Domain B — Settings / parameterisation** | Investigation **complete** 2026-08-10 — **deferred** to [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency); major review **after** My Workflows audit |
| **Domain B — My Workflows functional audit** | **NEXT** — behaviour first; UI simplification after understanding; Rename defect known; Duplicate = clean Run state (decided) |
| **Domain B — Run UX (observation only)** | Recorded 2026-08-10 — see operator synthesis Part II |
| **Domain B — custom workflow Instructions** | Empty Run Instructions hidden (`S75-D07`); meaningful custom notes preserved |
| **Domain C — Authoring + B→C handover (observation only)** | Recorded 2026-08-10 — see operator synthesis Part III |
| **Primary journey A→B→C→export** | Evidence complete — historical discovery; Create pass later completed separately |
| **Persistence architecture (Sprint 75)** | **SETTLED** under `S75-D21` — do not casually reopen |
| **SCORM / additional export formats** | Future product context — not Sprint 75 task |
| Domains D–E detailed discovery | Not started |
| Implementation slices (IA, navigation, interaction, terminology, visual, a11y, feedback) | After domain discovery + decisions + operator authorisation |
| Architectural work triggered by UX | Only if evidence shows genuine product requirement **and** operator authorises |
| Sprint 76 | **OPEN** (2026-08-13) — see Sprint 76 pack; not part of Sprint 75 delivery |
| Group F tooling / PB-S-001 / WR orphans / PB-FA-004 | Remain outside Sprint 75 open scope unless separately authorised |
