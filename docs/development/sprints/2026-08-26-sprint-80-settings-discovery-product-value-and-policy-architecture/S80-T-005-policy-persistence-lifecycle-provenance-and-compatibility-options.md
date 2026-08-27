# S80-T-005 — Policy persistence, lifecycle, provenance and compatibility options

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE** (persistence/lifecycle options delivered 2026-08-26; awaiting operator acceptance)  
**Mode:** Discovery / architecture planning only — **no implementation, schema change, or migration**  
**Predecessor:** [S80-T-004](S80-T-004-policy-authority-and-stage-ownership-architecture-options.md) — COMPLETE / ACCEPTED  
**Next task:** S80-T-006 — Operator product/architecture decision gate (**after acceptance; do not start choosing here**)

---

## 0. Scope and method

**Question answered:** What information must PRISM retain so that author intent, Auto/unset, resolved consequences, generated artefacts, override provenance, and application/staleness remain **honest and distinguishable** over time?

**Not answered:** Final A/B/C/D (T-006); physical schema bytes; migration code; Settings UI implementation.

**Architectural preference from T-004 (not a product UI decision):** Hybrid ownership — small author constraint/context → one stage interpreter → stage-native consequences/artefacts.

**Hard rules:** Do not resurrect DLA pedagogy controls; do not remove/replace `[PRISM_STEP_PARAMS]` in this task; do not treat presence of a JSON field as a behavioural guarantee.

---

## 1. Executive persistence / lifecycle conclusion

Current persistence is a **multi-store divergence problem**, not a missing “Settings JSON field”:

| Store | Typical role today |
| ----- | ------------------ |
| `[PRISM_STEP_PARAMS]` in `workflow.notes` / `step.notes` | Settings/Create **transport** + UI serialization |
| `workflowBriefResolution.resolvedFactors` (+ `resolvedSources`) | Create-time **frozen brief authority** for scaffolds; Settings Save **does not rewrite** |
| `override_prompt_body` | Create/Studio **baked Run text**; often preferred over live params |
| Stage artefacts (page, LS, KM, …) | **Generated pedagogical truth** after runs |
| `workflowOutputSpec.constraints` | Mapped Create residue (string/object lift) |

**What must be distinguishable (conceptually):**

1. Author intent / policy  
2. Auto / unset  
3. Resolved / inferred consequence  
4. Generated artefact state  
5. Override provenance  
6. Application / staleness  

Today: **(1) and (3) are frequently collapsed** in Settings UI (a factor default or Create inference looks like an author choice once mirrored into params). `resolvedSources` (`explicit` \| `elicited` \| `inferred` \| `default`) is the closest existing provenance — but Settings edits do not participate in it.

**Preferred persistence direction (evidence-backed candidate, not T-006):**

**Option C — Hybrid compatibility:** allowlisted typed author-policy state for surviving concepts + retain legacy `[PRISM_STEP_PARAMS]` as **compatibility / inert or migration-read** data + keep stage-native artefacts and resolved consequences **separate**. Do not make notes-tags the semantic SoT for author intent.

**`PRISM_PARAMS` (without STEP):** **no production mechanism** — docs/conversation only.

**A/B/C/D product choice remains open.**

---

## 2. Current persistence topology

```text
Create
  → extract/infer/elicit factors
  → resolveWorkflowBriefFactors → resolvedFactors + resolvedSources
  → applyWorkflowBriefMappings → constraints + stepParamPatch
  → seed step.notes [PRISM_STEP_PARAMS] from patch
  → bake override_prompt_body (often with empty selectedOptions at Create)
  → persist workflow JSON in localStorage promptr.workflows.v1

Settings UI
  → syncUnifiedWorkflowSettingsToStepNotes → notes tags
  → Save: gather notes; copy existing workflowBriefResolution (no factor rewrite)
  → does NOT rebake override_prompt_body

Prompt Studio
  → may upsert notes params
  → rebake can interpolate {{option:…}} into draft
  → explicit save-to-step writes override_prompt_body

Run / Copy
  → resolveStepPromptText prefers local_override body (or V2 assemblers)
  → stripWorkflowStepParamBlock for human prose only
  → scaffolds often read frozen resolvedFactors
  → generally do NOT re-parse Settings params into prompt authority

Export / Import / Duplicate
  → deep copy of workflow JSON (notes + factors + bodies)
```

**Survives browser reload:** full workflow definition in `promptr.workflows.v1` (notes, factors, bodies, outputSpec).  
**Survives duplicate/export:** same.  
**Does not automatically survive as behavioural truth:** Settings edits that only touch notes while Run still uses old body/factors.

---

## 3. `[PRISM_STEP_PARAMS]` exact role

| Classification | Verdict |
| -------------- | ------- |
| UI serialization | **Yes** — Settings reads/writes key=value blocks |
| Transport encoding | **Yes** — Create seeds; Studio may sync |
| Compatibility representation | **Yes** — historical workflows carry it |
| Author-policy authority | **No** (generally) — not Run SoT |
| Studio input | **Partial** — can feed rebake interpolations |
| Create patch target | **Yes** — `stepParamPatch` → notes |
| Historical implementation detail | **Yes** — Sprint 21 contract |

**Strengths:** Simple; works with notes-centric save; shared Settings/Studio infrastructure; zero new schema historically.

**Weaknesses:** Collocates machine params with human instructions (documented smell); no native Auto/unset vs forced default; no application/staleness; dual workflow+step keys; Settings→Run honesty failure; invites global-bag of every pack control.

**Do not remove in this sprint.** Future options may demote it to compatibility.

---

## 4. `resolvedFactors` exact role

| Question | Finding |
| -------- | ------- |
| Author intent? | **Only when** `resolvedSources[id] === "explicit"` (or elicited confirmation) |
| Inferred Create decisions? | **Yes** — `inferred` / pack `default` |
| Frozen commissioning context? | **Yes** — Settings Save preserves; Run scaffolds re-read |
| Runtime authority? | **Often yes** for delivery-shaped scaffolds / brief context |
| Compatibility state? | Persisted with workflow; no schema version on factors |
| Mixture? | **Yes — mixture is the accurate description** |

**Critical:** A resolved factor **must not** be reclassified as an explicit author choice merely because it persists or was mirrored into `[PRISM_STEP_PARAMS]`.

Provenance exists at Create (`resolvedSources`) but is **invisible** to Settings UI and is **not updated** when Settings change.

---

## 5. `override_prompt_body` relationship

| Fact | Detail |
| ---- | ------ |
| Written | Create seed bake; Studio explicit save-to-step |
| Run preference | `local_override` / assembler paths prefer body (or ignore pack body on V2 DLA) |
| Relationship to Settings | **Orthogonal** — Settings notes edit ≠ body update |
| Relationship to factors | Body bake at Create often **empty selectedOptions**; scaffolds may still use factors |
| Staleness vector | High — policy/params can change while body remains old |

Baked body is **generated prompt artefact**, not author-policy storage. Treating it as policy SoT is an anti-pattern.

---

## 6. Author intent vs resolved consequence vs artefact-state

| Layer | Example | Current store | Honesty risk |
| ----- | ------- | ------------- | ------------ |
| Author intent | “Time = 60” chosen | Often indistinguishable from default in Settings | High |
| Auto / unset | “No time specified” | Collapsed into pack defaults / inferred factors | High |
| Resolved consequence | LS allocation 8/12/18… | LS / page activity durations | Medium (artefact-owned) |
| Artefact state | Assembled learner page | Captures / page JSON | OK if not overwritten silently |
| Override provenance | MK facet forced off | Notes boolean without provenance type | Medium–High |
| Application/staleness | Policy 45 vs artefacts 60 | **Not represented** | Critical honesty gap |

`resolvedSources` partially solves Create-time intent vs inference — **not** post-create Settings, not artefact application.

---

## 7. Per-concept persistence / lifecycle ledger

Lifecycle codes: `CREATE_ONLY` · `CREATE_PRIMARY_BUT_PERSISTENT` · `PERSISTENT_PROJECT_CONSTRAINT` · `ADVANCED_OVERRIDE` · `PRODUCT_SELECTION_FIXED_AFTER_CREATE` · `UNCLEAR`

| Concept | Needs persistence? | Where conceptually | Lifecycle class | Provenance needed? | Last-applied / stale? |
| ------- | ------------------ | ------------------ | --------------- | ------------------ | --------------------- |
| **C1 Delivery** | Yes (project) | Author-policy allowlist | `CREATE_PRIMARY_BUT_PERSISTENT` | Yes (explicit vs Create seed vs default) | Yes — scaffolds + rhetoric artefacts |
| **C2 Source stance** | Yes (project) | Author-policy; Create upload truth | `CREATE_PRIMARY_BUT_PERSISTENT` | Yes | Yes — topology / source stages |
| **C3 Available time** | Yes (project, **single**) | Author-policy → LS interprets | `PERSISTENT_PROJECT_CONSTRAINT` | Yes (Auto vs N) | **Yes** — primary staleness demo |
| **C4 Design breadth** | Thin | Often Create residue | `CREATE_PRIMARY_BUT_PERSISTENT` or `CREATE_ONLY` | Yes | If changed: LO/EP/DLA chain |
| **C5 Audience/level** | Yes | Create-primary policy/context | `CREATE_PRIMARY_BUT_PERSISTENT` | Yes | LO + dependents |
| **C7 KM facets** | Override-local | Stage-local override + provenance | `ADVANCED_OVERRIDE` | **Required** | MK + dependents |
| **C9 Surface shape** | Product selection | Create / product declaration | `PRODUCT_SELECTION_FIXED_AFTER_CREATE` (preferred) or Create-primary persistent | Yes | Topology |
| **C10 Page profile** | Yes as shell intent | Create → EP shell artefact | `PRODUCT_SELECTION_FIXED_AFTER_CREATE` / Create-primary | Yes | Shell preserve chain |
| **C11 Assessment** | When in product | Assessment author-policy / DA-local | `PERSISTENT_PROJECT_CONSTRAINT` (assessment workflows) | Yes | DA→GAI |
| **C6 / C8 / C12** | Non-core | — | Not in core persistence model | — | — |

**User-preference persistence:** No surviving concept evidenced as user-level Settings. Delivery/time/source/audience/profile are **project/resource** facts. (Visual chrome prefs are out of scope and not part of this architecture.)

**Session-only:** Not required for primary concepts; session state is for Run captures (`promptr.workflows.runstate.v1`), not policy SoT.

---

## 8. Auto / unset options

| Option | Idea | Pros | Cons |
| ------ | ---- | ---- | ---- |
| **A. Absence = Auto** | Missing key ⇒ PRISM decides | Simple; matches T-003 thesis | Hard to show in UI; migration of old forced defaults ambiguous |
| **B. Explicit AUTO value** | Stored sentinel | UI-visible deferral | Must not collide with real enums; migration noise |
| **C. Author-value + resolution state** | Separate intent vs resolved | Best provenance; aligns with `resolvedSources` spirit | More structure |
| **D. Evidence-backed hybrid** | Absence/Auto for intent + separate resolvedFactors/artefacts | Fits current Create model | Needs clear read rules |

**Assessment:** **C or D** best preserve honesty. **A** acceptable if UI never displays inferred values as “selected.” **B** useful for progressive disclosure “Auto” radios. Physical schema not chosen here.

Implication: old workflows with `delivery_context=blended` in notes may be **Create residue**, not author intent — must not auto-promote to “author chose blended” under a new policy system without provenance.

---

## 9. Default / versioning findings

| Question | Finding |
| -------- | ------- |
| Workflow schema version field? | **No** object-level version; storage key `promptr.workflows.v1` only |
| Params/factors migrators? | **None** dedicated |
| `normalizeWorkflowForV1` | Shape cleanup (bindings, constraints lift) — not policy semantics |
| Sprint 58 page migration | Clears some legacy override bodies — unrelated to Settings catalogue |

**If PRISM judgement changes later:**

| Scenario | Prefer |
| -------- | ------ |
| **Reproduce existing artefact** | Use **artefact + historical bake** as-is; do not re-decide policy under the hood |
| **Regenerate under current PRISM** | Use **current** judgement for Auto/unset; for explicit author intent, respect stored intent; for inferred-only historical factors, **re-resolve** under current rules **or** require explicit Apply |

Do not silently treat historical pack defaults as sacred author policy when regenerating.

---

## 10. Reproduce vs regenerate distinction

| Mode | Authority | Policy role |
| ----- | --------- | ----------- |
| **Reproduce / view existing** | Artefacts + captures + baked bodies | Policy irrelevant to display fidelity |
| **Regenerate / re-run stage** | Owning stage + current allowlisted author intent + Auto | Must know intent vs inferred; Apply if policy changed since last generation |

Future UI must not imply that opening an old workflow “re-applies Settings” when artefacts are merely displayed.

---

## 11. Project vs user policy findings

| Concept | Level | Evidence |
| ------- | ----- | -------- |
| C1–C5, C9–C11 | **Project / resource** | Bound to workflow brief and artefacts |
| C7 | **Project step override** | Bound to that workflow’s KM generation |
| User chrome / editor prefs | Out of scope | No evidence they belong in PB-FA-005 policy model |

**Do not invent user-level Settings** for this architecture without new evidence.

---

## 12. Create-only vs persistent findings

| Concept | Why editable after Create? | Classification |
| ------- | -------------------------- | -------------- |
| C1 | Reusable workflow retarget (self-study vs workshop) | `CREATE_PRIMARY_BUT_PERSISTENT` |
| C2 | Same workflow, upload vs topic reuse | `CREATE_PRIMARY_BUT_PERSISTENT` |
| C3 | Common retune (“make it 45 minutes”) | `PERSISTENT_PROJECT_CONSTRAINT` |
| C4 | Rare; often inferable | Prefer `CREATE_ONLY` / thin persistent |
| C5 | Audience retarget on reuse | `CREATE_PRIMARY_BUT_PERSISTENT` |
| C7 | Expert exception after seeing KM | `ADVANCED_OVERRIDE` |
| C9 | Changing page↔deck midstream is topology surgery | Prefer `PRODUCT_SELECTION_FIXED_AFTER_CREATE` |
| C10 | Changing learner↔facilitator rewrites voice | Prefer fixed-after-create / explicit rebuild |
| C11 | Assessment blueprint retune | Persistent within assessment product |

Persistent edits require T-004 **Apply / re-run** honesty — not notes mutation alone.

---

## 13. Staleness / application options

Goal: UI honesty, not a reactive build system.

| Option | Idea | Fit |
| ------ | ---- | --- |
| **S1 Explicit dirty + Apply** | On policy edit, mark dirty until Apply regenerates owners | Clear UX; minimal graph |
| **S2 Policy revision vs applied revision** | Monotonic policyRev; stages store appliedPolicyRev | Testable; small metadata |
| **S3 Provenance fingerprint** | Hash allowlisted intent; compare to artefact stamp | Robust; more design |
| **S4 Stage generation metadata** | Each artefact records policy snapshot used | Aligns reproduce vs regenerate |
| **S5 Apply-only, no dirty graph** | Edit does nothing until Apply; no persistent dirty | Simplest; risk of forgotten Apply if UI unclear |
| **S6 Hybrid S1+S2** | Dirty flag for UI + revision for tests | Strong candidate |

**Preferred conceptual lean:** **S6 (dirty UI + revision/applied markers on allowlisted policy)** without building a generic dependency engine. Downstream staleness inferred from owning-stage Apply per T-004 map.

---

## 14. Legacy compatibility risks

| Risk | Harm |
| ---- | ---- |
| Promote all `[PRISM_STEP_PARAMS]` keys to new author-policy SoT | Resurrects 41-bag + false intent |
| Treat every `resolvedFactors` value as explicit author choice | Lies about Auto/inference |
| Re-enable retired DLA keys because they still sit in notes | Violates T-003/T-004 |
| Make notes edits affect Run without Apply/rebake | Continues PB-FA-005 failure mode under new name |
| Drop notes tags without read-compat | Breaks Settings UI / fixtures / exports |
| Reinterpret old `duration_minutes` twins with new single-C3 rules silently | Behaviour change without consent |

---

## 15. Old-project scenario analysis

| Scenario | Future architecture MUST NOT |
| -------- | ---------------------------- |
| **1. Notes params only** | Assume all keys are allowlisted author intent; assume Run already honours them |
| **2. resolvedFactors only** | Relabel inferred/default as author-chosen; delete provenance |
| **3. override_prompt_body only** | Treat body as editable policy object; ignore that regenerate needs intent |
| **4. All three present** | Pick one store as SoT without reconciliation rules; let them silently diverge further |
| **5. No Settings metadata** | Invent constraints from pack defaults and call them author policy |
| **6. Retired DLA controls still in notes** | Grant them authority under any new policy ingress (incl. GAM seam) |

**Safe postures (options, not implemented):** preserve legacy params as **inert compatibility**; migrate **only allowlisted** concepts when provenance ≥ explicit/elicited; otherwise leave frozen until operator Apply / re-resolve; keep DLA pedagogy keys permanently non-authoritative.

---

## 16. Persistence Option A — Continue notes tags

`[PRISM_STEP_PARAMS]` remains principal persistence for policy.

| Criterion | Assessment |
| --------- | ---------- |
| Semantic clarity | Poor — params ≠ intent ≠ applied |
| Author-vs-inferred provenance | Weak |
| Compatibility | Best short-term |
| Migration cost | Lowest immediate |
| Save/load fit | Native |
| Versioning | None semantic |
| Testability | Hard (notes parsing + divergence) |
| Bag-creep risk | **Highest** |
| Workflow JSON fit | Status quo |
| Artefact interaction | Weak coupling |
| Extensibility | Accidental |

---

## 17. Persistence Option B — Typed project policy object

Dedicated structured `authorPolicy` (name illustrative only) on workflow/project for allowlisted concepts; artefacts remain separate; notes tags unused for new authority.

| Criterion | Assessment |
| --------- | ---------- |
| Semantic clarity | Strong |
| Provenance | Can encode Auto/explicit/override |
| Compatibility | Needs migration/read layer |
| Migration cost | Higher |
| Save/load fit | Natural in workflow JSON |
| Versioning | Can version policy object |
| Testability | Strong |
| Bag-creep risk | Medium (needs allowlist governance) |
| Artefact interaction | Clear separation if enforced |
| Extensibility | Good with allowlist |

---

## 18. Persistence Option C — Hybrid compatibility (preferred candidate)

1. **New typed allowlisted author-policy / context state** for C1–C5, C7, C9–C11 (as applicable).  
2. **Legacy `[PRISM_STEP_PARAMS]` retained** for Settings/Studio compatibility and migration reads — **not** expanded as SoT.  
3. **`resolvedFactors` / consequences** remain distinct (or evolve into “resolved snapshot” with sources).  
4. **Artefacts** remain stage-native truth for reproduce.  
5. **Apply / revision** ties policy to regeneration.  
6. Retired DLA keys in notes stay **inert forever**.

| Criterion | Assessment |
| --------- | ---------- |
| Semantic clarity | **Best practical** |
| Provenance | Strong if typed intent ≠ resolved |
| Compatibility | Explicit strategy |
| Migration cost | Medium (allowlist only) |
| Save/load fit | Good |
| Versioning | Policy object + leave notes as-is |
| Testability | Strong for allowlist + Apply |
| Bag-creep risk | Controlled |
| Artefact interaction | Matches T-004 Hybrid ownership |
| Extensibility | Controlled |

---

## 19. Comparative option matrix

| | A Notes | B Typed only | C Hybrid compat |
| - | ------- | ------------ | --------------- |
| Fixes Settings→Run honesty | No (alone) | Only with Apply wiring | Designed for Apply + allowlist |
| Protects Auto provenance | No | Yes | Yes |
| Old workflow safety | Accidental | Needs careful import | **Best** |
| Matches T-004 Hybrid ownership | Poor | Good | **Best** |
| Implementation later cost | Low now / high debt | Higher upfront | Medium |
| Risk resurrecting DLA dials | High | Low if allowlist | Low if allowlist |

---

## 20. Preferred persistence direction

**Preferred candidate: Option C (Hybrid compatibility).**

Evidence: notes are transport not authority; factors mix intent/inference; bodies diverge; Dual stores already exist; T-004 Hybrid ownership needs a typed intent layer **without** discarding compatibility data.

**Not decided:** whether a Settings UI survives (product A/B/C/D). Option C works with Create-only UI **or** a tiny Constraints surface.

---

## 21. PB-FA-005 implications

PB-FA-005 should **no longer** mean “make current Settings values affect Run.”

Under Option C, a future PB-FA-005 meaning becomes approximately:

1. Allowlisted author-policy concepts only.  
2. Explicit provenance (author vs Auto vs inferred vs override).  
3. One-owner interpretation (T-004).  
4. Apply / re-resolution with staleness honesty.  
5. Compatibility: legacy notes inert or migrated allowlist-only; DLA pedagogy keys never authoritative.  
6. Separate reproduce (artefacts) from regenerate (policy + owners).  
7. Dual duration collapsed to single C3 intent.  
8. IA: Constraints/Adjustments/Overrides — not 41-control panel.

Do **not** finalise or implement PB-FA-005 in Sprint 80.

---

## 22. T-006 decision matrix (evidence prepared; no choice)

### PRODUCT

| Option | Persistence implication |
| ------ | ----------------------- |
| **A Delete Settings UI** | Still need Create capture + Option C (or B) for intent/Auto; notes demoted |
| **B Tiny Constraints/Adjustments** | Option C + Apply semantics; allowlist UI |
| **C Substantial redesign** | Option C (or B) + new IA naming; not “rewire 41” |
| **D Prototype first** | Prototype Auto+C1–C3 Apply on Option C sketch before locking |

### ARCHITECTURE

| Option | Status |
| ------ | ------ |
| T-004 Hybrid ownership | Preferred candidate entering T-006 |
| Central bag / Create-only extremes | Documented alternatives |

### PERSISTENCE

| Option | Status |
| ------ | ------ |
| A Notes principal | Compatible short-term; weak long-term |
| B Typed only | Clean; higher migration |
| **C Hybrid compat** | **Preferred persistence candidate** |

### LIFECYCLE (by concept)

| Pattern | Concepts |
| ------- | -------- |
| Create-primary persistent | C1, C2, C5 |
| Persistent project constraint | C3 (+ C11 if assessment) |
| Create-only / thin | C4 |
| Product selection fixed-after-create | C9, C10 (preferred) |
| Advanced override | C7 (+ C8 footnote) |
| Non-core | C6, C12 |

---

## 23. Questions requiring operator judgement

1. Accept **Option C** as persistence preference for T-006?  
2. Product surface: delete Settings vs tiny Constraints (A vs B) given Option C works for both?  
3. For old notes without provenance: **inert until Apply**, migrate allowlist, or prompt?  
4. Auto representation: absence vs explicit AUTO vs dual intent/resolution?  
5. On regenerate with inferred-only historical factors: re-resolve under current PRISM or freeze historical resolution?  
6. Fix C9/C10 as **immutable after Create** without rebuild?  
7. Prototype (D) before locking persistence preference?  
8. Confirm retired DLA keys remain **permanently non-authoritative** even if present in notes?

---

## 24. Files / code / history inspected

- S80-T-001 … T-004  
- `app.js` — `parse`/`upsert`/`syncUnified`/`resolveWorkflowBriefFactors`/`resolvedSources`/`override_prompt_body`/`normalizeWorkflowForV1`/`WORKFLOW_STORAGE_KEY`/`handleDuplicateWorkflow`  
- `docs/backlog/PRODUCT-BACKLOG.md` — PB-FA-005  
- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`  
- Fixture `tests/fixtures/educational-psychology-post-s68/workflow.json` (shape)  
- Grep: `PRISM_PARAMS` absent in production; `PRISM_STEP_PARAMS` present  

---

## 25. Files changed

- This record (new)  
- Sprint STATUS / START-HERE / PLAN / HANDOVER / briefing / README / NEXT-SPRINT  
- S80-T-004 status → **COMPLETE — ACCEPTED**  

No production code; no migrations.

---

## 26. Sprint records updated

Yes — pointers set to **S80-T-005 COMPLETE** (await acceptance) → next **S80-T-006** (human gate).

---

## 27. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Six-way state distinction analysed | MET |
| Current topology traced with evidence | MET |
| `[PRISM_STEP_PARAMS]` role classified | MET |
| `resolvedFactors` mixture documented | MET |
| `override_prompt_body` relationship | MET |
| `PRISM_PARAMS` confirmed absent | MET |
| Per-concept persistence ledger | MET |
| Auto/unset options | MET |
| Reproduce vs regenerate | MET |
| Staleness options | MET |
| Old-project scenarios | MET |
| Persistence options A/B/C compared | MET |
| Preferred persistence candidate without choosing A/B/C/D | MET |
| PB-FA-005 refined (not implemented) | MET |
| T-006 decision matrix prepared | MET |
| No implementation / no T-006 start | MET |

---

## 28. Exact next action

Operator acceptance of S80-T-005 → begin **S80-T-006** (human decision gate) using T-003–T-005 evidence. Cursor prepares options only; **must not choose** product A/B/C/D.

**STOP — T-006 not started as a decision. No Settings implementation. No migration.**
