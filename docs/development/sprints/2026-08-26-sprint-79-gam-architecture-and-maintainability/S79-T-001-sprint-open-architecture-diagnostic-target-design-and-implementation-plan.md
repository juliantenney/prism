# S79-T-001 — Sprint open, GAM architecture diagnostic, target design, and implementation plan

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** COMPLETE (opening task)  
**Date:** 2026-08-26  
**Mode:** Documentation and architecture analysis only (no production refactor)

---

## 1) New sprint number and name

- **Sprint 79 — GAM Architecture and Maintainability**

## 2) Sprint objective

Reorganise the current GAM generation architecture so it is easier to understand, maintain, test, and extend while preserving current observable behavior across Run/Copy/Studio/capture/validation/composition/export paths.

## 3) Current live GAM architecture map

```text
Source context (workflow + upstream DLA page)
  -> GAM policy/contract assembly
      - buildWorkflowStepInstructions (Run/Copy)
      - resolveStepPromptText + runtime augmentations (Studio/override path)
      - ld-gam-page-enrich-contract canonical block + shape + final gate
  -> Material authoring instructions + authoritative DLA commission embed
  -> Final live prompt
  -> Model output (GAM page/partial)
  -> Capture normalize + strict parse gate
  -> GAM validation (shape, 1:1 materials, activity-field preservation, blanks)
  -> Composition/preservation (assemble partials, preserve GAM materials, closure transport path)
  -> Downstream consumers (Design Page partial, learner renderer, export pipeline)
```

### Live paths

- **Path A (canonical primary):** Run/Copy GAM v2 prompt in `app.js` via `buildWorkflowStepInstructions`.
- **Path B (live alternate):** Studio/local override draft via `resolveStepPromptText` + `applyWorkflowStepRuntimePromptAugmentations` + GAM contract graft.
- **Path C (compatibility):** pack-text GAM validation/compatibility path in `gam-output-format` + capture bridge/preserve.

### Classification

- **CANONICAL:** `app.js` GAM assembly routers; `lib/ld-gam-page-enrich-contract.js`; `lib/page-gam-enrich.js`; `lib/workflow-page-capture-normalize.js`; `lib/page-vnext-assemble.js`.
- **LIVE DUPLICATION:** GAM contract/gate injection in both Run/Copy and Studio augmentation path.
- **DERIVED COPY:** authoritative DLA commission projection/embed helpers from upstream DLA page.
- **COMPATIBILITY:** pack-text gates and `page-gam-materials-preserve` compensation routes.
- **LEGACY/DEAD:** no hard dead GAM module proven; pack-text branches are likely legacy-heavy but still reachable.
- **TEST-ONLY:** VM bootstrap and regression harnesses under `tests/`.

## 4) GAM responsibility inventory

| Responsibility | Canonical owner | Current implementation locations | Prompt section(s) | Validation counterpart | Downstream consumer | Provenance | Duplicated across live paths |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GAM output shape/envelope | `ld-gam-page-enrich-contract` | `lib/ld-gam-page-enrich-contract.js`, `app.js` | contract block + canonical shape snippet | `validateGamPartialPageCapture`, `validateGamEnrichedPage` | assembler, renderer/export | Sprint 58 + later hardening | Yes |
| DLA commission fulfilment (1:1 required_materials) | GAM enrich validators + commission embed builder | `app.js`, `lib/page-gam-enrich.js` | authoritative DLA commission embed + material rules | GAM enrich validators + strict capture gate | Design Page/composition/export | S77 E1, S78 WS1 | Yes |
| Material type/shape + body authoring | GAM contract + GAM authoring brief | `app.js`, `lib/ld-gam-page-enrich-contract.js` | GAM material authoring body | GAM enrich validators | renderer/export | Sprint 56F/58 | Yes |
| Evidence relationships/reshape | DLA commission semantics + GAM authoring contract | `app.js`, contract libs | evidence-bearing required_material guidance | DLA/GAM closure checks | learner materials | S78 T-050/T-051 era | Partial |
| Learner production/workspace authoring | GAM authoring brief + workspace fidelity rules | `app.js`, `lib/page-gam-enrich.js` | workspace/template/table guidance | blank workspace/table gates | learner renderer | S78 T-007, T-042 | Yes |
| Diagnostic feedback packaging | DLA commissioning + GAM authoring | DLA/GAM libs + `app.js` | MODEL->ATTEMPT->CHECK/REVISE family | DLA diagnostic-review and OPS gates | learner flow | S78 T-021/T-022 | Partial |
| Model/practice independence | dedicated GAM prompt block | `lib/gam-practice-independence-prompt.js`, `app.js` | WS2 block | DLA WS2 closure + review evidence | materials quality | S78 T-011/T-012 | No |
| Transfer production | GAM contract block | `app.js`, contract file | transfer section rules | tests + capture invariants | transfer workspace | S78 T-041 | Yes |
| Closure packaging | GAM owns substance, DP transports | GAM contract + DP contract + preserve path | closure section + DP transport wording | tests (T-032/T-055) | `study_tips`/render | S78-D04, T-032, T-055 | Partial |
| Page synthesis boundary | Design Page ownership guard | GAM contract + validators | explicit no-GAM-page_synthesis semantics | GAM validators | Design Page partial | S56C/S78-D04 | Yes |
| Disciplinary precision | salience blocks in DLA/GAM/DP | prompt libs + `app.js` | disciplinary warrant language | benchmark + regression suites | learner-facing content | S78-D03, T-026 | Partial |
| Quantitative consistency | final silent pre-emit gate | contract constant + assembly resolvers | FINAL SILENT PRE-EMIT CONSISTENCY CHECK | prompt-assembly regressions | first-pass reliability | S78-T-051 | Yes |
| Final pre-emit checks | GAM final gate constant + placement enforcement | `lib/ld-gam-page-enrich-contract.js`, `app.js` | final gate near completion override | tests ensuring presence/order | Copy/Studio prompt delivery | S78-T-051 | Yes |

## 5) Final prompt anatomy (ordered, live)

### Path A — Run/Copy
1. Pipeline opening directive.  
2. Step framing and execution contract.  
3. GAM schema/shape contract block (normative).  
4. Upstream authority embed (DLA page or authoritative commission projection).  
5. GAM material authoring brief (normative + explanatory).  
6. Final silent pre-emit consistency gate (normative high-salience).  
7. GAM completion override (normative).  
8. Literal `STEP N OUTPUT` footer contract.  
9. Post-assembly routing augmentations (archetype/maths safety where applicable).  
10. Pipeline completion directive.

### Path B — Studio/override
1. Library/override base prompt draft.  
2. Shared runtime augmentation chain.  
3. GAM enrich prompt graft (contract + shape + upstream + final gate).  
4. Published final prompt snapshot for observability.

### Prompt anatomy findings

- Repeated instructions exist around GAM gate placement and contract injection.
- Ownership is scattered between canonical contract libs and large `app.js` assemblers.
- Late overrides persist for compatibility with historical prompt paths.
- Some sections remain due to prior Copy/Studio drift and dual path support.
- Placement of final pre-emit gate and output footer is semantically important and explicitly regression-protected.

## 6) DLA vs GAM architecture comparison

| Architectural property | DLA | GAM today | GAM target? |
| --- | --- | --- | --- |
| Stage contract file with canonical sections | Clear in `ld-dla-page-enrich-contract` | Present but split usage | ADOPT |
| Stage enrich validators near contract | Clear `page-dla-enrich` | Present `page-gam-enrich` | ADOPT |
| Explicit commissioning vs production distinction | Strong | Present but diffused | ADAPT |
| Predictable assembled prompt order | Improved post-S77 | Works but dual-path duplication | ADOPT |
| Single assembly authority used by Copy/Studio | Improved | Still split between two active paths | ADAPT |
| Final pre-emit high-salience gate | Present (DLA) | Present (GAM T-051) | ADOPT |
| Legacy compatibility burden | Lower | Higher (pack-text compatibility + preserve overlays) | NOT APPLICABLE (must retain bounded compatibility) |
| Prompt-assembly regression tests | Strong | Strong but somewhat path-coupled | ADOPT |

## 7) Target GAM architecture (design only)

### Proposed internal layers

1. **Inputs/authority**: typed stage input object with authoritative upstream DLA commission projection and current run context.  
   - Clarification: this "typed stage input object" is an **internal GAM assembly/refactoring boundary only** for Sprint 79.
   - It does **not** define PB-FA-005 or any future Settings typed-policy model.
   - It does **not** alter persisted schema.
   - It does **not** change current Settings authority or observable Settings behavior.
2. **Policy ingress seam (future settings-ready)**: neutral policy slot accepted but currently populated from existing behavior-preserving sources only.  
3. **Section builders by responsibility family**:
   - commission interpretation;
   - material authoring;
   - workspace/response-surface rules (current capabilities only);
   - evidence rules;
   - diagnostic/pedagogical relationships;
   - transfer;
   - closure (post-T-055 separation);
   - disciplinary fidelity;
   - quantitative consistency.
4. **Output contract block**: canonical GAM output shape and boundaries.  
5. **Final silent pre-emit gate builder**: single owner, single insertion point.  
6. **Assembler**: deterministic explicit order; Copy/Studio both consume same assembly function.  
7. **Compatibility adapters**: isolated wrappers for pack-text and historical path bridges.  
8. **Capture/validation/composition remain fail-closed** with unchanged boundaries.

### Design intent

- One obvious owner per normative rule.
- Minimise duplication while preserving exact current behavior.
- Keep extension seams obvious without speculative new features.

## 8) Behavior-preservation baseline

### Must preserve

- **Fulfilment:** 1:1 `required_materials` fulfilment; no uncommissioned substitution; empty synthesis at GAM; evidence reshape rules; blank workspace/table behavior.
- **Learning design:** model/practice independence; diagnostic check/revision relationships; current feedback packaging; transfer behavior; closure behavior; transfer/closure separation.
- **Workspace authoring:** canonical `**Label:**` template behavior; table-family preservation; no invented editable maths capability.
- **Fidelity:** disciplinary precision, conceptual role/status continuity, quantitative consistency gate semantics.
- **Live paths:** V2 Copy, Studio, workflow execution, capture, validation, composition, export.
- **Sprint 78 protections:** preserve behavior introduced/strengthened across T-039 to T-055 where GAM participates.

## 9) Regression estate

### Coverage strengths

- Strong GAM contract/validation suites (`page-gam-enrich`, capture gates, prompt hardening tests).
- Strong sprint-regression suites for transfer/closure/workspace/first-pass hardening.
- Composition/preservation and export paths are represented in tests.

### Gaps or caution

- Dedicated GAM Studio-only end-to-end tests are less explicit than Run/Copy tests.
- Some prompt tests assert wording/placement; refactor should prefer behavior/equivalence assertions where possible while retaining critical order checks.
- Compatibility paths (pack-text) need explicit preservation checks per slice.

### Sprint regression strategy

- Keep external behavioral guards unchanged.
- Add equivalence/snapshot checks around assembled live prompts for both Copy and Studio.
- Migrate tests only when ownership is clarified; do not delete guard tests to simplify refactor.

## 10) Completeness hand-off

Use `docs/architecture/completeness-validation-audit.md` as binding architectural reference:

- preserve 1:1 fulfilment, empty synthesis, blank workspace requirements, evidence reshape/closure, fail-closed capture, and current conditionality;
- do not implement optional hygiene items now;
- do not expand classifier heuristics;
- do not add freshness fingerprinting in this sprint.

## 11) Augmentation hand-off

Use `docs/architecture/augmentation-paths-diagnostic.md` as binding architectural reference:

- preserve partial-enrichment semantics;
- preserve intentional materials preservation/restoration ownership;
- preserve closure/study_tips transport ownership;
- preserve distinction between canonical enrichment and associative augmentation;
- do not create a generic augmentation layer.

## 12) Settings policy-ingress hand-off

Use `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md` as binding architectural reference:

- settings implementation is out of scope for Sprint 79;
- add a clear neutral **future policy ingress seam** in GAM architecture only;
- do not make inert settings effective;
- do not change Run behavior;
- do not implement PB-FA-005 here;
- do not add new schema/validator settings dependence.

## 13) Workspace-surfaces hand-off

- isolate current workspace/material-shape authoring rules under explicit owners;
- avoid scattering response-surface assumptions across unrelated prompt sections;
- preserve current template/table/text-entry behavior;
- avoid inventing future interaction types;
- keep schema unchanged.

## 14) Structural smell inventory

| Smell class | Evidence | Risk | Target treatment |
| --- | --- | --- | --- |
| DUPLICATED RULE | same GAM contract/gate intent in two live assembly routes | drift and accidental behavior skew | unify assembly authority behind shared builder |
| SCATTERED RESPONSIBILITY | normative GAM rules split across `app.js` and several libs | difficult safe edits | consolidate into named section builders |
| ORDER-DEPENDENT PATCH | final gate and completion overrides depend on insertion order | subtle regressions | explicit assembly order contract + tests |
| LIVE-PATH DRIFT | Run/Copy vs Studio assembly differences | inconsistent operator outcomes | both paths consume same canonical assembled GAM block |
| LEGACY COMPATIBILITY | pack-text/bridge logic mixed with modern v2 path | accidental breakage or hidden coupling | isolate compatibility adapter boundaries |
| MONOLITHIC BUILDER | `app.js` orchestration concentration | high change blast radius | extract stage-owned composition helpers |
| TEST COUPLING | some tests coupled to wording | brittle refactor experience | preserve critical wording checks; prefer behavioral equivalence checks elsewhere |

## 15) Refactoring invariants

- **R1:** Same valid GAM input must produce the same valid output contract behavior.
- **R2:** Sprint 78 pedagogical protections remain intact (no weakening).
- **R3:** Every normative rule has one canonical owner.
- **R4:** Copy and Studio consume canonical GAM assembly rather than divergent rule copies.
- **R5:** Assembly order is explicit and test-protected.
- **R6:** No schema migration required.
- **R7:** Settings behavior remains unchanged in this sprint.
- **R8:** Workspace capabilities remain unchanged in this sprint.
- **R9:** Validators remain fail-closed at the same boundaries.
- **R10:** DLA behavior and Design Page ownership boundaries remain unchanged.
- **R11:** OPS verifier is not removed in this sprint.
- **R12:** Temporary GAM rollback/dual-assembly path is retired in-sprint after behavioural gate (not deferred as optional Phase D). Genuine product-required compatibility adapters may remain.

## 16) Prompt-preservation strategy

**Recommended strategy: STRICT TEXT PRESERVATION** for Sprint 79 refactor slices by default.

Rationale:
- recent benchmark evidence is strong (Lagrangian 94, HR 92, first-pass PASS/PASS signal);
- sprint goal is maintainability reorganisation, not quality re-tuning;
- duplicated wording can be consolidated only where byte-level equivalence for final assembled prompt is proven or intentionally deferred.

If semantic-only consolidation is proposed later, it must be isolated into a dedicated slice with additional benchmark evidence gates.

## 17) Proposed implementation slices/tasks (design only)

**Binding method:** inventory → canonical ownership → equivalence baseline → off-path assembly → OLD vs TARGET acceptance → live switch → deterministic gates → fresh benchmark → **explicit legacy/rollback retirement** → final closure.

**DLA Phase D lesson:** temporary rollback deferred as optional cleanup became standing dual-path debt. Sprint 79 must retire GAM temporary rollback **in-sprint** after the behavioural gate. Do **not** retire DLA Phase D code here — record it as separate deferred/backlog evidence only.

**TEMPORARY ROLLBACK PATH** ≠ **GENUINE COMPATIBILITY PATH**. Product-required adapters (e.g. pack-text) may remain; temporary old GAM assembly/rollback must not.

**Run/Copy vs Studio switch decision (required during T-002/T-003):** atomic switch **or** sequential under a tightly controlled temporary dual-path state. Do not drift into indefinite mixed authority.

| Slice | Likely files | Behavior preserved | Proof tests | Rollback boundary |
| --- | --- | --- | --- | --- |
| S79-T-002 Canonical section inventory + equivalence baseline | docs + test harness | all | prompt snapshot + existing regressions | docs/test-only |
| S79-T-003 Off-path canonical section-builder | new `lib/*` + tests | all | unit + equivalence | feature-flag/off-path |
| S79-T-004 OLD vs TARGET equivalence acceptance gate | docs + equivalence harness | all | ledger + byte/order checks; operator acceptance | no production switch yet |
| S79-T-005 Live-path switch (Run/Copy + Studio) | `app.js` + builder + tests | all | live path parity + S78 regressions | revert switch commit(s) |
| S79-T-006 Deterministic integration + genuine compatibility isolation + pre-emit ownership | libs + `app.js` + tests | all | deterministic GAM suites | restore adapters / gate wiring |
| S79-T-007 Fresh behavioural benchmark | benchmark docs only | all | Lagrangian (+ HR as needed) | no code rollback required |
| S79-T-008 Post-benchmark temporary rollback/legacy retirement | old path + obsolete owners + rollback-only tests | all (canonical remains) | deterministic regression after retirement | restore retirement commit |
| S79-T-009 Final regression + closure gate | tests + closure docs | all | full deterministic suite | sprint rollback decision |

### Pre-switch equivalence gate (T-004) — explicit

Before first production switch, require:

1. OLD vs TARGET section/invariant ledger;
2. byte/text equivalence where strict preservation is expected;
3. ordering equivalence for high-salience sections;
4. operator acceptance that protected GAM invariants are preserved.

### Post-benchmark legacy retirement (T-008) — mandatory

After live switch, deterministic gates, and fresh benchmark with no material regression:

- remove or hard-disable temporary old GAM assembly/rollback path;
- remove duplicated normative owners made obsolete by the canonical path;
- retire or rewrite tests whose only purpose is rollback retention;
- preserve genuinely required compatibility adapters;
- run the relevant deterministic regression suite.

## 18) Benchmark strategy

- **Per slice:** run deterministic regression subsets (prompt assembly + capture/validation + composition + Sprint 78 GAM regressions).
- **Prompt equivalence:** use assembled prompt snapshot/equivalence checks whenever assembly internals move; T-004 is the formal pre-switch acceptance.
- **Benchmark cadence:** avoid expensive benchmark reruns after every internal slice if deterministic prompt/contract equivalence holds.
- **Fresh benchmark:** T-007 after live switch and deterministic integration; required before T-008 retirement.
- **Most informative benchmarks:** Lagrangian as primary continuity benchmark; HR Essentials as domain-shift corroboration.

## 19) Sprint success/closure criteria

- target GAM architecture implemented (as designed for this sprint);
- canonical ownership clear for normative GAM responsibilities;
- live paths consume canonical assembly;
- no known duplicated normative-rule ownership left active;
- temporary GAM rollback/dual-assembly path retired (T-008 complete — not deferred);
- Sprint 78 GAM regressions pass;
- completeness invariants preserved;
- settings policy ingress seam documented/present with behavior unchanged;
- workspace behavior preserved;
- no schema migration;
- no validator weakening;
- benchmark evidence indicates no material learner-resource regression;
- DLA Phase D cleanup remains separate (not absorbed).

## 20) Forward programme

1. **After Sprint 79:** Settings architecture design sprint (typed policy authority and Run consistency; PB-FA-005 lane).  
2. **Then:** Settings implementation sprint.  
3. **Then:** Learner Workspace Surfaces planning sprint (major product/architecture design).  
4. **Then:** Workspace Surfaces implementation sprint.  
5. **Separate deferred:** DLA Phase D legacy cleanup (rollback builders / `dlaCanonicalAssembler: false` branches) — backlog evidence; **not** Sprint 79 scope.  
6. **Parked hygiene:** completeness classifier blind spots, freshness/provenance, graphics brief drift, study_tips freshness, A6 export assumptions, grouping prettification, OPS retirement, editable maths, rubric weighting, structured-HTML residue.

## 21) Opening-task decision

**A — READY TO REFACTOR**

Target architecture, invariants, and regression strategy are sufficiently defined to begin bounded implementation slices without reopening Sprint 78.

## 22) Exact recommended next task

**S79-T-002 — Canonical GAM section inventory and byte-equivalence baseline harness (design + tests only, no production behavior switch).**

## 23) Files inspected

- `app.js`
- `lib/ld-gam-page-enrich-contract.js`
- `lib/page-gam-enrich.js`
- `lib/page-gam-materials-preserve.js`
- `lib/workflow-page-capture-normalize.js`
- `lib/page-vnext-assemble.js`
- `lib/gam-output-format.js`
- `lib/ld-materials-copy.js`
- `lib/gam-practice-independence-prompt.js`
- `lib/gam-operational-suitability-prompt.js`
- `lib/gam-operational-suitability-review.js`
- `lib/ld-dla-page-enrich-contract.js`
- `lib/page-dla-enrich.js`
- `lib/learner-renderer-vnext-export-runtime-source.js`
- `lib/learner-renderer-vnext-standalone-embed.js`
- `tests/prism-vm-lib-bootstrap.js`
- GAM and sprint-regression suites under `tests/` (prompt assembly, capture, validation, composition, export)
- `docs/architecture/augmentation-paths-diagnostic.md`
- `docs/architecture/completeness-validation-audit.md`
- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`
- Sprint 77/78 pack records for provenance and protections

## 24) Files changed (docs/sprint scaffolding only)

- `docs/development/sprints/2026-08-26-sprint-79-gam-architecture-and-maintainability/*` (new sprint pack docs)
- `docs/sprints/NEXT-SPRINT.md`
- `docs/sprints/README.md`
- `docs/sprints/sprint-79-gam-architecture-and-maintainability.md`

## 25) Sprint 78 closure confirmation

**Confirmed:** Sprint 78 remains **CLOSED** and unchanged by this opening task.
