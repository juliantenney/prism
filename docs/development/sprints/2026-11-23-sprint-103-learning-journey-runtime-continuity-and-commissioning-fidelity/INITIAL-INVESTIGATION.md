# Sprint 103 — Initial investigation (103A)

**Status:** **Complete** — read-only continuity map (2026-11-23)  
**Authorisation:** S103-D02 — investigation only; **no** application / prompt / schema edits  
**Not done in 103A:** Live probes, new resources, broad tests, continuity implementation

---

## 1. What Sprint 102 already demonstrated

| Area | Evidence (do not re-claim as runtime-complete) |
| ---- | ----------------------------------------------- |
| Journey + component LO markers; commission-native bind | S102-D06 / S102-D07; LJ Tests 1–2 PASS |
| Shared authoritative source handoff | S102 delivered; Practice GAM shared-source tests |
| Interactive + Practice Learning Journal producer binding | S102E journal handoff tests + live paths (migration notes apply) |
| Expository publication hygiene + journal text ownership | S102E publication defects |
| LJ Test 3 design validation | Six commissions + outcomes + shared material + six journal entries at Design Page — **not** full child generation/runtime |

**S102 qualifications still open for this sprint:** AP/ST commission-native runtime; AP/ST journal capture; cross-component actual previous responses; minor prompt/LO inconsistencies (in-scope only if they block A–C). Clear run data remains **excluded**.

---

## 2. Evidence-backed data-flow map

### 2.1 Contracts (`produces` / `references`)

| Layer | Path | Role |
| ----- | ---- | ---- |
| Normalisation | `lib/learner-renderer-vnext/learner-artefact-contract.js` → `normalizeArtefactContract` | Canonical `produces[]` (`artefactId`, `commissionId`, `workspaceId`, optional `pageKey`, `label`) and `references[]` (`artefactId`, `commissionId`, `usage: "reference"`, labels / missing copy) |
| Produce discovery (per child page) | `learner-artefact-producers.js` → `discoverConstructedTextProducers` | Merges: page-root `learner_artefacts.produces[]` → Assessment Pack `constructed_performance` → Situated `situated_learning.record.entries[].artefact` → Interactive/Practice `response_fulfilment.artefact_elicitation_id` on text surfaces |
| Journey proposal | `proposeArtefactContractFromLearningJourney` | Builds journey-level produce/reference pairs from hydrated constituents + `commission.dependencies` (or forced producer/consumer ids) |
| Assembly | `app.js` unified shell path (~62731–62745) | If no contract supplied, calls `proposeArtefactContractFromLearningJourney`; embeds result in shell |
| Shell enrichment | `learning-journey-unified-shell.js` → `enrichArtefactContract` | Attaches producer `pageKey` from sequence so resolution can load the correct draft |

**Design-time only:** commission `dependencies` text and journal entry `artefact_id` values (`{commission_id}.{elicitation_id}`) describe *intent*. They do not themselves store learner text.

### 2.2 Learner draft / evidence storage

| Step | Path | Behaviour |
| ---- | ---- | --------- |
| Envelope | `learner-draft-envelope.js` → `createEmptyEnvelope` / workspace states | Per-page envelope: `workspaces[workspaceId] = { kind, stateVersion, value }` |
| Constructed text shape | `learner-draft-adapters.js` / `createWorkspaceState("text_entry", …)` | Artefact resolution reads **only** `kind === "text_entry"` → `value.text` (`extractTextFromWorkspaceState`) |
| Persistence | `learner-draft-storage.js` → `createLearnerDraftStorage` | `localStorage` key = `STORAGE_KEY_PREFIX` + `pageKey`; `loadLearnerDraft` / `saveLearnerDraft` / `deleteLearnerDraft` |
| Workspace ids | `constructedTextWorkspaceId` / `assessmentConstructedWorkspaceId` | `learner-constructed-{elicitationId}` (Expository / Practice / Interactive / Situated artefact entries); `assessment-constructed-{elicitationId}` (Assessment Pack) |

Drafts remain **resource-private**. Cross-resource read is allowed only via a declared produce + `resolveArtefactReference`.

### 2.3 Learning Journal persistence and restoration

| Step | Path | Behaviour |
| ---- | ---- | --------- |
| Spec | Design page `learning_journey.journal.entries[]` | Entry titles + `artefact_id`; no separate journal body store |
| Resolve | `resolveLearningJournalEntries` → **same** `resolveArtefactReference` | Displays producer draft text or missing/unavailable copy |
| Mount | Unified shell → `populateLearningJournal` | Replaces journal artefact slots on journal view mount |
| Ack / notify | `evaluateJournalNotifications` / `acknowledgeJournalNotifications` | Separate key prefix `prism:lj-journal:ack:` — fingerprints only; **not** the learner response body |

Journal visibility therefore equals: produce declaration + saved `text_entry` in the producer’s draft + matching journal `artefact_id`. It is not a second copy of the response.

### 2.4 Runtime retrieval (`resolveArtefactReference` + shell)

```text
Producer page save
  → draft envelope[pageKey].workspaces[declared workspaceId].value.text
Consumer / Journal mount
  → produce declaration (artefactId → commissionId + workspaceId + pageKey)
  → resolveArtefactReference
  → injectArtefactReferences (constituent) OR populateLearningJournal (journal)
  → read-only HTML (pre / missing notice)
```

| Function | File | Fact |
| -------- | ---- | ---- |
| `resolveArtefactReference` | `learner-artefact-contract.js` ~153–265 | Loads producer draft; returns actual saved text when declared workspace non-empty; statuses: `resolved` / `missing` / `undeclared` / `unavailable` |
| `injectArtefactReferences` | same ~1013–1103 | For active `commissionId`, resolves each `references[]` row and injects chrome into the mounted constituent root |
| Shell wiring | `learning-journey-unified-shell.js` ~1508–1524 | On journal: `populateLearningJournal`; on constituent: `injectArtefactReferences` with embedded `artefactContract` + resource `pageKey`s |

**Answer to “can a later component access an earlier component’s actual saved learner response?”**

- **Yes, as read-only retrieved text**, when: (1) journey contract declares produce for the earlier artefact and a reference for the later commission; (2) producer draft is saved with the declared workspace; (3) unified shell mounts the consumer and runs injection. Proven in automated form by S95-T-008 / C5→C6 shell embedding (`tests/s95-m3-learner-artefact-handoff.test.js`).
- **No paste / no in-field reuse:** producer signpost and reference chrome explicitly state later activities do **not** paste into answer fields (`buildProducerSignpostHtml`, `renderArtefactReferenceHtml`). There is no call path that writes resolved text into a consumer workspace.

### 2.5 In-activity use of retrieved responses

| Capability | Supported? | Evidence |
| ---------- | ---------- | -------- |
| Show earlier text beside / above later activities | **Supported** (contract-gated) | `injectArtefactReferences` + read-only `lj-artefact-ref` |
| Learner edits earlier text from the later component | **Unsupported** | Reference regions are non-editable; edit only in producer |
| Later activity fields prefilled / scored from earlier text | **Unsupported** | Explicit product copy; no adapter consumes resolved text into workspaces |
| Adaptive / branching on earlier content | **Excluded** (Sprint 103) | Charter / S103-AD-008 |

---

## 3. Four-way continuity boundary

| Distinction | Supported today? | Evidence class |
| ----------- | ---------------- | -------------- |
| **1. Design context** — shared briefs, outcomes, sources, commission `dependencies`, journal entry plan | **Yes** (authoring / design) | S102 LJ Tests 1–3 design; design-page journal rules |
| **2. Journal visibility** — Journal shows actual saved constructed-text for declared producers | **Yes for Interactive/Practice producers when bindings exist**; Expository via page-root `learner_artefacts`; AP/ST discovery exists in code but **runtime unverified** in S102 | S102 demonstrated (I/P); Needs runtime verify (AP/ST) |
| **3. Runtime retrieval** — later constituent loads earlier draft text via contract | **Yes when `references[]` present** (product-agnostic at inject time); **auto-proposal now includes Practice, Expository, Situated Task, Assessment Pack, Interactive** (103B–E correction; focused tests pass; live journey pending) | Code + S95/S96 + S103 focused tests |
| **4. Response-aware activity** — later activity uses retrieved text inside its own task logic / fields | **Unsupported** (not a confirmed defect of missing paste — intentional read-only handoff) | Signpost + reference HTML; no feed-forward into workspaces |

---

## 4. Four-product boundary

| Product | Producer path (constructed text) | Auto-consumer in `proposeArtefactContractFromLearningJourney` | Capture / restore notes |
| ------- | -------------------------------- | ------------------------------------------------------------- | ----------------------- |
| **Expository** | Page-root `learner_artefacts.produces[]` → `learner-constructed-*`; page-level text_entry | **No** | S102 journal text ownership fixed for new assembly; already-published pages may need re-author |
| **Practice** | Same Interactive fulfilment path: `response_fulfilment.artefact_elicitation_id` and/or `learner_artefacts`; workspace `learner-constructed-*` | **No** | S102E Practice journal producer binding **demonstrated**; does **not** prove Practice-as-consumer |
| **Assessment Pack** | `assessment_evidence.elicitations` with `delivery.kind === "constructed_performance"` → `assessment-constructed-*` | **Yes** | Unit/assembly path proven (S95/S96); **commission-native LJ live path Needs runtime verify** |
| **Situated Task** | `situated_learning.record.entries[].artefact` with constructed_text → `learner-constructed-*`; composeDeclared skips AP/ST (own surfaces) | **No** | Discovery + gaps messaging exist; **runtime Needs runtime verify** |

**Proposal filter (authoritative):**

```1331:1334:lib/learner-renderer-vnext/learner-artefact-contract.js
  var supportedArtefactConsumerProducts = {
    assessment_pack: true,
    interactive: true
  };
```

Forced `producerCommissionId` + `consumerCommissionId` **bypass** that filter and can still emit a Practice→Practice pair if elicitations resolve — but default unified publish (`app.js`) only uses forced ids when callers pass them; dependency-driven assembly will **not** create C3 Practice references.

**Do not infer runtime success** from shared produce discovery types alone: AP/ST share discovery helpers and journal gap messages, but S102 did not validate their commission-native round-trips.

---

## 5. Confirmed defects vs unimplemented capabilities

| Finding | Classification | Notes |
| ------- | -------------- | ----- |
| Later constituent can resolve earlier saved `text_entry` when contract declares produce+reference | **Supported capability** (S95/S96 automated; live Practice→Practice **Needs runtime verify**) | |
| Resolved text is read-only chrome only; not pasted into later fields | **Intentional boundary** — not a paste defect | Treat “revise in C3 fields while viewing C1” as the supported story if contract exists |
| Default proposal omits Practice / Expository / Situated Task as artefact **consumers** | **Unimplemented / product-filter gap** for Workstream C if C3 is Practice | Documented in proposal message; may need smallest assembly extension **after** gate — or use AP as C3 consumer for first live proof |
| AP / ST journal + runtime round-trip under commission-native LJ | **Needs runtime verify** (S102 qualification) — not yet confirmed defects | Workstream B |
| Cross-component **live** C1→C3 with actual learner typing | **Needs runtime verify** | Workstream C / proposed probe below |
| Response-aware scoring / prefilling / branching from earlier answers | **Enhancement / excluded** | Do not treat as Sprint 103 defect |

No new confirmed application defects were opened in 103A (read-only). S103-AD-003 remains open until the live probe runs.

---

## 6. Minimal live-test proposal (C1 Practice → C2 Expository → C3 Practice)

**Do not** regenerate LJ Test 3’s six children. Prefer a **new three-commission fixture** or a trimmed reuse of S102 LJ Test 2 structures (Practice producer bindings) if one already has a journalable constructed-text elicitation.

### 6.1 What must be authored

| Commission | Product | Requirements |
| ---------- | ------- | ------------ |
| **C1** | Practice | One constructed-text judgement: bindable surface with `response_fulfilment.artefact_elicitation_id` (e.g. `E1`) so export mounts `learner-constructed-E1`; journal entry `C1.E1` (or matching ids); optional producer signpost via journey contract |
| **C2** | Expository | Conceptual framework only; **no** dependency on consuming C1 text required for this probe |
| **C3** | Practice | Own revised-judgement elicitation (separate id, e.g. `E1` on C3 → artefact `C3.E1`); commission `dependencies` **name C1**; journey artefact contract must include `references[]` for C3 → `C1.E1` |

**Contract gap to plan for:** default `proposeArtefactContractFromLearningJourney` will **not** auto-add C3 Practice as consumer. For the first probe, either:

1. **Preferred smallest proof of runtime path:** assemble with explicit `producerCommissionId=C1` / `consumerCommissionId=C3` (forced pair bypasses product filter), **or** supply a hand-authored `artefactContract`; or  
2. **Substitute C3 with Assessment Pack** for the first continuity proof (matches S95 C5→C6), then separately test Practice-as-consumer after any assembly fix.

Probe **must** record which of (1)/(2) was used.

### 6.2 Where the original response is stored

- Browser draft for **C1’s pageKey**: `workspaces["learner-constructed-E1"].value.text` (assuming elicitation `E1`).  
- Not stored in the journal document; journal **reads** that workspace via produce declaration.

### 6.3 How C3 should retrieve it

1. Unified package embeds artefact contract with produce `{ artefactId: "C1.E1", commissionId: "C1", workspaceId: "learner-constructed-E1", pageKey: <C1> }` and reference `{ artefactId: "C1.E1", commissionId: "C3", usage: "reference" }`.  
2. On C3 mount, shell calls `injectArtefactReferences` → `resolveArtefactReference` → read-only `lj-artefact-ref` showing the saved C1 text.

### 6.4 Observable pass

1. Learner types a distinctive string in C1 and saves draft.  
2. After visiting C2, opening C3 shows that **exact** string in a read-only artefact reference region (`data-lj-artefact-status="resolved"`).  
3. C3’s own answer field is **empty** (not auto-filled). Learner can type a revision there and save.  
4. Learning Journal entry for C1 shows the same original string after save.  
5. Reload / re-enter C1 and C3: C1 text and C3 revision restore; C3 reference still shows C1 text.

### 6.5 Observable failure or unsupported

| Observation | Interpret as |
| ----------- | ------------ |
| C3 has no reference chrome and missing notice never appears, with empty `references[]` in embedded contract | **Unsupported under default proposal** for Practice consumer (assembly gap) — not a renderer bug |
| Reference shows missing though C1 was saved | **Confirmed defect** candidate (pageKey / workspace id / produce mismatch) |
| Reference shows text but differs from what was typed | **Confirmed defect** (wrong workspace / collision) |
| C3 editable field already contains C1 text without learner action | Unexpected vs current design — investigate before calling “pass” |
| Journal empty though C1 saved and entry declared | Producer/journal binding defect (S102 class) — separate from consumer reference |

---

## 7. Evidence map (103A close)

| Claim | Class |
| ----- | ----- |
| Constructed-text produce discovery across four products (code) | Mapped — AP/ST runtime still **Needs runtime verify** |
| Draft save/load + `resolveArtefactReference` returns actual text | **S95 demonstrated** (automated); live LJ Practice→Practice **Needs runtime verify** |
| Journal uses same resolve path | **S97/S102 demonstrated** for I/P producers |
| Shell injects references for any commission with `references[]` | **S95/S96 demonstrated** (AP consumers); Practice consumer **Needs runtime verify** |
| Default proposal consumers = AP + Interactive only | **Code-confirmed boundary** |
| Response-aware in-activity use | **Unsupported** (intentional) |

---

## 8. Gate recommendation (after 103A)

1. **Next manual step (103D prep / first live probe):** Run the §6 C1→C2→C3 probe with an **explicit artefact contract** (forced ids or hand contract) so runtime retrieval is tested independently of the Practice-consumer proposal filter.  
2. **Do not** authorise response-aware prefilling or branching.  
3. **Implementation gate** only if live probe shows: (a) missing reference with contract present → defect fix; or (b) product decision to extend `supportedArtefactConsumerProducts` to Practice (smallest assembly change) after documenting educational need.  
4. Workstream B AP/ST round-trips remain parallel verification, not prerequisites for the continuity boundary statement above.  
5. **No application implementation authorised by this document alone.**

---

## 9. Explicit non-actions completed / upheld in 103A

- No application / prompt / schema edits.  
- No Clear run data, folders, Practice surfaces, precision graphics, assisted briefs, release packaging, branching.  
- No broad test-suite runs as a substitute for this map.  
- No claim that AP/ST are validated.  
- No regeneration of LJ Test 3 six children.
