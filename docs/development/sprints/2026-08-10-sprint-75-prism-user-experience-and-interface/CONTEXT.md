# Sprint 75 — Context

**Status:** **OPEN** (opened 2026-08-10)  
**Role:** Durable context for the UX / interaction-design programme  
**Predecessor authority:** Sprint 74 closed programme — **link, do not rewrite evidence**  
**Theme:** PRISM User Experience and Interface

---

## Why this sprint exists

Sprint 74 closed after converging the codebase onto one definitive path per major responsibility (74A sole vNext; 74B partial+assemble; 74C hygiene). Architecture is consolidated enough that the next programme priority is the **product experience**: journeys, interactions, and presentation for eventual users.

This is **not** a continuation of architectural rationalisation. Sprint 74 remains **COMPLETE / Closed**. Do not reopen it.

Related backlog signals (not auto-consumed as Sprint 75 implementation scope):

- [PB-S-003 — Historical UX/runtime friction notes](../../../backlog/PRODUCT-BACKLOG.md)  
- [PB-S-004 — Duplicate / legacy UI–state pathways](../../../backlog/PRODUCT-BACKLOG.md)

---

## Platform phase

| Aspect | State at Sprint 75 open |
| ------ | ------------------------ |
| Architecture consolidation | Sprint 74 **COMPLETE / Closed** |
| Learner renderer | Sole vNext (74A) |
| Page construction | Partial contract → capture → validation → assemble (74B) |
| Repository hygiene | Narrowed R1 complete (74C); Group F deferred |
| Instructional architecture | Productised (Sprint 72); continuous verification (`S72-D14`) |
| Workflow Resources | Shipped (Sprint 73); known limitations retained |
| Emphasis | UX journeys · interaction · presentation · accessibility |
| Release posture | Pre-user / pre-release (`S74-D09`) |

---

## Apparent product narrative (not personas)

At open, the supported author-facing narrative implied by the product chrome and Sprint 74 context is:

**Domain A (Elicitation & Workflow Generation) → Domain B (My Workflows) → Domain C (Authoring, Preview, export)**

Also present in primary navigation as first-class programme domains: **Domain D (Prompt Studio)**, **Domain E (Prompt Library)** — role, audience, and relationship to the primary workflow must be established through evidence (`S75-D02`).

**Insufficient evidence for personas:** Do not invent end-user or author personas. T-010 must record *apparent* users and goals implied by the existing product, and flag gaps for operator discussion.

---

## Programme domains (`S75-D02`)

| Domain | Name |
| ------ | ---- |
| A | Elicitation & Workflow Generation |
| B | My Workflows |
| C | Authoring |
| D | Prompt Studio |
| E | Prompt Library |

Sequential discovery — not one whole-application audit. Domain A: T-010 + **operator observation complete**. Domain B Run + Domain C Authoring: **operator observation recorded** (2026-08-10) — see [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) Parts II–III. **Primary journey A→B→C through export: evidence complete** for discovery purposes.

---

## Domain C product understanding (operator evidence — durable context)

**Not design decisions.** Recorded from operator Authoring pass 2026-08-10.

### B→C handover and entry

- Run completion is **recognisable** (no further steps); **what next** is unclear.
- No explicit navigation from completed Run into Authoring.
- First Authoring entry: JSON empty; user must **Assemble From Current Workflow Run** — purpose and “current” workflow not obvious.
- Return visits: **stale assembled JSON** possible; workflow identity **not shown** in Authoring; reassembly requirement not obvious.
- **Hypothesis only:** “current workflow” exists in system state but is under-exposed in Authoring (continuity/provenance).

### Post-assembly Authoring (positive)

- Assembly populates JSON, auto-generates preview, unlocks Learner Page / Graphics / Video / Resources tabs and export actions.
- Learner preview, Open in New Tab, Preview HTML refresh — work reasonably well after assembly.
- Graphics: job-driven, external generation → paste/upload → refresh — works reasonably well.
- Video / Resources: optional manual enrichment — straightforward (minor duplicated Video heading observed).
- Export: HTML vs learner package distinction meaningful; inspection/export feels like natural endpoint (observation, not decision).

### Authoring IA (observation for later)

- Peer tabs represent **different activity types** (core artefact vs generated jobs vs manual embeds vs attachments) — adequate in walkthrough, not conceptually equivalent.

### Experienced sequence (synthesis — not target IA)

ASSEMBLE → PREVIEW → optional ENRICH → REFRESH/INSPECT → EXPORT

### Future output context (not Sprint 75 scope)

- SCORM expected eventually as additional output format — conceptual room for more packaging formats later.

---

## Domain B product understanding (operator evidence — durable context)

**Not design decisions.** Recorded from operator Run pass 2026-08-10.

### Run as BYO-LLM orchestration

- **Run** is guided orchestration between PRISM and an external LLM (Copilot).
- Operator convention: run each workflow in a **new Copilot conversation** — not adequately surfaced to first-time users.
- Once Copy → Copilot → return is learned, step execution is **consistent** (positive).

### Run UI — control relevance and guidance

- Paste/store-output field often shown when step does **not** require PRISM persistence — misleading.
- **Strong UX direction (not decision):** show paste/store only when step requires artefact capture.
- Dual surfaces: prose above fields + **Instructions** textarea; Instructions often **empty** on observed domain workflow.
- Later-step prose mixes **implementation terminology** with operator guidance — hypothesis: task-oriented guidance should dominate.
- **Do not conclude** Instructions should be removed — custom workflows may depend on it (verify later).

### Mode vs selection persistence

- Workflow **selection** persistence appears useful.
- **Run / Edit / Settings** mode persistence can reopen on last-used sub-tab — orientation problem for inexperienced users.
- **Provisional hypotheses only** — not accepted product decisions (see synthesis §3.14).

### Executable integrity (refinement / QA)

- Operator evidence of incoherent refinement-inserted review/QA steps **confirmed** by investigation (historical observations retained in synthesis).
- Generic Create Workflow reviewer **retired** (`S75-D03`, 2026-08-10).
- Future closed-loop QA/refinement → **[PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle)** (now explicitly carries **Sprint 71** Benchmark/Validation corpus-review prior art).
- **Do not** reinstate freeform in-workflow QA insertion.

### B→C handover gap

- After final Run step, **no clear next action** into Authoring — **confirmed and extended** by Domain C entry evidence (assemble, provenance).
- **Design hypothesis only:** completion may warrant explicit onward navigation — examine separately from post-assembly coherence.

*(Domain C entry/provenance detail — see Domain C section above.)*

### Settings / parameterisation (investigation complete — deferred)

- Operator evidence (Part I/II, §§3.5–3.7, 3.21): Settings is intentionally important for reusable workflows; ~25 controls observed; full elicitation is **not** the target model — see synthesis (historical record; **not rewritten**).
- **Architecture investigation complete** (2026-08-10): Settings UI persists pack parameters, but **Settings → Save → Run** does not reliably consume edited values — fragmented source-of-truth across brief resolution, output spec, workflow/step `[PRISM_STEP_PARAMS]`, baked `override_prompt_body`, Prompt Studio drafts, and runtime augmentations.
- **Implementation deferred** to product backlog **[PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)**. Detailed Settings UX redesign should preferably follow or coordinate with parameter-contract resolution.
- Sprint 75 may continue other UX synthesis where underlying behaviour is sufficiently stable. **Not** assigned to Sprint 76.

---

## Domain A product understanding (operator evidence — durable context)

**Not design decisions.** Recorded from operator pass 2026-08-10 for later discovery.

### Reusable / parameterised workflows

- Workflows are not necessarily one-off topic designs.
- Workflows may be **generic and reusable** (e.g. transcript in → learner resource out).
- Parameterisation should allow topic/input to change while structure remains.
- Unresolved boundaries: creation-time decisions · reusable defaults · per-run parameters · step-specific tuning.

### Elicitation vs Settings

- **Full elicitation is not the product target** (deliberate prior intent).
- Elicitation should obtain enough **consequential** information for a viable workflow; **defaults** handle many parameters.
- **Settings** exposes deeper parameterisation **later** for reusable workflows.
- Observed example: **25 Settings** on generated LD workflow — asking ~25 elicitation questions would be too lengthy.
- **Do not infer** all Settings should move into elicitation.

### Experienced vs implementation journey

- **A0–A11:** implementation/state map (T-010) — retained.
- **DEFINE → UNDERSTAND → DESIGN → IMPROVE → COMMIT:** provisional user-experienced model from operator evidence — not target IA.

*(Settings: operator evidence in synthesis; parameter-contract scope in PB-FA-005.)*

---

## Core UX lens (standing)

| Layer | Question |
| ----- | -------- |
| Journey | Can the user accomplish their goal coherently? |
| Interaction | Are the right choices and actions at the right moment? |
| Presentation | Clear, accessible, consistent, visually effective? |

---

## Experience before implementation (standing)

**Actual use of Prism is the primary source of UX evidence.**

Operator observation while exercising real product journeys is first-class evidence. Implementation inspection is **supporting** evidence — to explain behaviour, locate UI/state, identify constraints, and distinguish presentation from interaction/journey issues. Do not substitute code inspection for experiencing the product.

---

## Cross-cutting UX concerns

Assessed in context within each domain; later across the product where useful. Not disconnected implementation workstreams at programme opening:

navigation · orientation · terminology · progress/state feedback · errors/recovery · empty/disabled/enabled states · discoverability · cognitive load · accessibility · consistency · responsive behaviour · visual hierarchy · engineering/implementation concept leakage

---

## Binding constraints (inherited — link)

**Authoritative:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

| ID | Carry-forward for Sprint 75 |
| -- | --------------------------- |
| `S74-D03` | Browser-only runtime + static deployment |
| `S74-D07` | One definitive codebase — UX must not casually fork architectures |
| `S74-D09` | Pre-release Compatibility not default — including historical UI |
| `S74C-D02` | Git history is the default archive |
| Engineering Disciplines | Evidence → decide → small reversible slices → verify |

Sprint 75 **may** eventually change IA, navigation, interaction, terminology, visual design, feedback, accessibility, and responsive behaviour — only after authorised tasks. It must **not** casually change generation architecture, partial/capture/validation/assemble, learner renderer, pedagogic contracts, or workflow semantics.

---

## Working posture

- Create UX pass **COMPLETE**; persistence **SETTLED** (`S75-D21`) — do not casually reopen  
- **NEXT:** My Workflows functional / operator audit → UI simplification after behaviour is understood → later Settings / **PB-FA-005**  
- Historical discovery (T-010 / T-020) retained; do not rewrite evidence to match current UI  
- Evidence before decisions; decisions before implementation  
- Do not invent unauthorised implementation scope  
- Stop and report if a proposed UX change requires architectural redesign without operator authorisation  

Current snapshot: [STATUS.md](STATUS.md) · [next-chat-briefing.md](next-chat-briefing.md).

---

## Related

- Charter: [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
- Plan: [PLAN.md](PLAN.md)  
- Cross-journey synthesis: [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)  
- Operator synthesis: [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md)  
- Pack init: [S75-T-001-sprint-pack-initialisation.md](S75-T-001-sprint-pack-initialisation.md)  
- Predecessor closure: [S74C-T-050](../2026-08-07-sprint-74c-repository-hygiene-and-historical-residue-rationalisation/S74C-T-050-final-verification-and-programme-closure.md)
