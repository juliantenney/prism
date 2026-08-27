# S80-T-001 — Sprint opening + Settings history / current-state diagnostic

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator-reviewed 2026-08-26)  
**Mode:** Design / investigation only — **no production Settings behaviour change**  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Next task:** S80-T-002 — Existing Settings catalogue + provenance + supersession audit

---

## 1. Purpose

Establish authoritative opening state for Sprint 80:

1. Reconstruct Settings / elicitation origin and product rationale.  
2. Inventory high-level UI / state / persistence / runtime topology.  
3. Capture initial evidence of inert vs active behaviour.  
4. Situate Settings against **current** architecture (canonical DLA, canonical GAM, post–Phase D).  

**Out of scope for T-001:** full per-setting provenance/supersession ledger (S80-T-002); product A/B/C/D choice (S80-T-006); implementation.

---

## 2. Authoritative opening state

| Item | State |
| ---- | ----- |
| Sprint 79 | CLOSED |
| DLA Phase D | COMPLETE — live DLA canonical-only |
| GAM | Canonical-only; temporary rollback retired (S79-T-008) |
| Sprint 80 | OPEN — discovery/planning |
| Prior Settings diagnostic | [workflow-settings-catalogue-effectiveness-diagnostic.md](../../../architecture/workflow-settings-catalogue-effectiveness-diagnostic.md) — verdict **C — redesign** |
| Backlog lane | [PB-FA-005](../../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) — approach not yet re-defined for post-S79 world |
| Governance | [D-010 Settings](../../../governance/ARCHITECTURAL-DEBT.md) — product capability; now under active discovery |

---

## 3. Historical rationale (reconstructed from repository)

### Product thesis (elicitation → Settings)

From Sprint 21/22 and Sprint 75 operator evidence (also summarised in PB-FA-005):

- Avoid burdening authors with a long mandatory elicitation interview at Create.
- Let PRISM make sensible default / inferred decisions at create/resolve time.
- Expose a **post-creation** surface so experienced users can tweak pack-declared parameters on reusable workflows.

### Delivery history (abbreviated)

| Era | What landed |
| --- | ----------- |
| Sprint 21 | Pack-declared `stepParams` metadata + generic Settings renderer; `[PRISM_STEP_PARAMS]` persistence |
| Sprint 22 | Unified Workflow Settings shell (workflow + included-step aggregation) |
| Sprint 75 | UX evidence: Settings important for reusable workflows; **Settings → Save → Run** not reliable; IA/naming collision with step “Settings…” → Prompt Studio |
| 2026-08-26 diagnostic | Catalogue partly right; causal Run path weak → **C redesign**; sequence Settings design before Workspace Surfaces |

### Important naming note

Live production persistence uses **`[PRISM_STEP_PARAMS]…[/PRISM_STEP_PARAMS]`** in `workflow.notes` / `step.notes`.  
A search of current `app.js` finds **0** occurrences of `PRISM_PARAMS` as a tag. Treat “PRISM_PARAMS” in older conversation as informal/historical shorthand unless T-005 finds a distinct store.

---

## 4. Current high-level topology (repository truth)

```text
Pack declaration (LD)
  domains/learning-design/domain-learning-design-step-patterns.md
    workflowBriefConfig.workflowParameterControls
    stepParameterControls / userOptions / mappingRules
        │
        ▼
UI — My Workflows → Settings tab
  #unifiedWorkflowSettingsPanel / badge via countUnifiedWorkflowVisibleParameterControls
  renderUnified* + renderWorkflowPackParameterControlsSection (shared with Prompt Studio)
        │
        ▼
Persistence
  syncUnifiedWorkflowSettingsToStepNotes
  → [PRISM_STEP_PARAMS] in workflow.notes and/or step.notes
  → workflow JSON in localStorage (promptr.workflows.v1 family)
        │
        ├── Prompt Studio path: can re-bake drafts from params (honour more often)
        │
        └── Run/Copy path: buildWorkflowStepInstructions + resolveStepPromptText
              typically dominated by:
                • create-time override_prompt_body
                • frozen workflowBriefResolution.resolvedFactors
                • stage canonical assemblers (DLA / GAM) + runtime augmentations
              Settings notes often NOT re-interpreted as live Run authority
```

### Approximate catalogue scale (from 2026-08-26 diagnostic; verify in T-002)

- Pack totals if every controlled step included: **~4 workflow + ~37 step ≈ 41**.
- Typical learner-page visible badge: **~21** (workflow 4 + MK 3 + LO 4 + DLA 4 + GAM 1 + LS 3 + DP 2).
- Research pack: brief config present; **0** Settings parameter controls in prior diagnostic.
- Episode Plan: **0** step Settings — intentional (`deterministic_derive`).

### Related but not the same UI

| Surface | Role |
| ------- | ---- |
| My Workflows → **Settings** tab | Unified pack-parameter editor (this sprint’s primary subject) |
| Step header **“Settings…”** | Opens Prompt Studio workflow-step mode — naming collision (S75) |
| Create brief / optionalFactors | Elicitation / mappingRules (`tone_style`, `depth_level`, etc.) — not identical to Settings tab |

---

## 5. Initial inert vs active evidence

| Class | Evidence (opening) |
| ----- | ------------------ |
| **UI PRESENT** | Settings tab, badge, controls render from pack metadata |
| **PERSISTENCE PRESENT** | `[PRISM_STEP_PARAMS]` sync on Save |
| **RUN OFTEN INERT / WEAK** | Diagnostic: Settings edit without recreate/Studio re-bake frequently yields **no distinct** Run instruction difference; Run consumes frozen factors + baked bodies + stage contracts |
| **STUDIO PATH-SPECIFIC ACTIVE** | Param-driven draft bake / option substitution can honour params when operator regenerates |
| **CREATE-TIME RESIDUE ACTIVE** | `delivery_context` / `input_strategy` etc. can affect scaffolds via **frozen** `resolvedFactors`, not necessarily via later Settings edits |
| **STAGE CONTRACTS DOMINATE** | Canonical DLA (`78-DLA-WS-3`) and canonical GAM assemblers are now singular normative authorities — DLA step Settings (e.g. difficulty/grouping mix) risk **competing policy** / low salience |

Hypothesis for T-002 (not decided): many DLA/GAM “pedagogical intensity” style controls are **SUPERSEDED** or **QUESTIONABLE**, while workflow-level delivery/scope/duration/input may remain **GENUINE USER POLICY** candidates **if** wiring is redesigned.

---

## 6. Architecture context change since Settings were exposed

| Change | Implication for Settings |
| ------ | ------------------------ |
| Canonical DLA only (S77 + Phase D) | No dual DLA constitution; Settings must not become a second DLA prompt owner |
| Canonical GAM only (S79) | Same for GAM; policy ingress may exist as a seam — not a competing constitution |
| Sprint 78 contracts (WS, DP, independence, fulfilment, …) | Stage invariants — not Settings knobs |
| PEL / guided-learning scaffolds | Contextual scaffolding may supersede global “scaffolding level” style ideas |
| Fail-closed assemblers | Missing stage authority fails closed — Settings must not silently bypass |

---

## 7. Strategic outcomes (remain open)

A Delete · B Reduced override surface · C Redesign · D Further evidence/prototype  

Prior diagnostic preferred redesign (**C**) under then-current evidence; Sprint 80 **re-opens** A–D against post-S79/DLA Phase D reality and must not treat C as predetermined.

---

## 8. Explicit T-001 boundaries honoured

- No full per-setting ledger (deferred to T-002).  
- No product A/B/C/D choice.  
- No production code changes for Settings behaviour.  
- No PB-FA-005 implementation plan written as if decided.

---

## 9. Sources inspected (opening)

- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`
- `docs/backlog/PRODUCT-BACKLOG.md` (PB-FA-005)
- `docs/sprints/NEXT-SPRINT.md`
- `docs/development/governance/ARCHITECTURAL-DEBT.md` (D-010)
- Sprint 79 pack (closure / forward programme)
- `app.js` symbol scan: `PRISM_STEP_PARAMS`, `syncUnifiedWorkflowSettings*`, `countUnifiedWorkflowVisibleParameterControls` (present); `PRISM_PARAMS` tag (absent)
- `domains/learning-design/domain-learning-design-step-patterns.md` (control declarations sample)

---

## 10. Acceptance for T-001

| Criterion | Status |
| --------- | ------ |
| Sprint 80 pack opened with START-HERE / PLAN / STATUS / decisions | MET |
| History / rationale reconstructed at opening depth | MET |
| High-level UI/state/persistence/runtime topology recorded | MET |
| Initial inert/active evidence recorded | MET |
| Current architecture context (DLA/GAM canonical) reflected | MET |
| Full catalogue audit | **Deferred to T-002** |

When operator/agent marks T-001 **COMPLETE**, STATUS must point **S80-T-002** as next.

---

## 11. Exact next action

Complete any remaining T-001 polish if needed, mark T-001 **COMPLETE** in STATUS, then open **S80-T-002** — existing Settings catalogue + provenance + supersession audit.

**Do not** begin T-002 in the same turn as pack creation unless STATUS already shows T-001 COMPLETE (this opening leaves T-001 **IN PROGRESS** for explicit completion).
