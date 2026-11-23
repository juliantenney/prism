# Sprint 103 — Initial investigation plan (103A)

**Status:** **Authorised** as read-only investigation / evidence mapping (S103-D02)  
**Not authorised:** Application implementation; speculative coding; regenerating LJ Test 3’s six children for design-only revalidation

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

## 2. What still requires runtime verification

1. Assessment Pack — commission-native first stage through learner export with capture/persist/restore/journal.  
2. Situated Task — same.  
3. Expository / Practice — full round-trip under unified shell after S102 journal fixes (confirm, do not assume).  
4. Cross-component: later constituent reading **actual** earlier draft/artefact content (not only `references` design intent).  
5. Product UI/defaults: new LJ commissions exclude Interactive (Workstream D).

---

## 3. Smallest first investigation (recommended 103A start)

**Goal:** Establish whether the **runtime path** already supports retrieving an earlier constituent’s **saved learner artefact** for a later constituent, and document the exact boundary if not.

### Probe design (read-only map first, then minimal live probe when authorised beyond 103A)

1. **Contract map (103A, no code):** Trace in existing libs/docs only:  
   - `produces` / `references` / journal entry → producer id  
   - draft storage keying (`createLearnerDraftStorage` / envelope)  
   - unified-shell `resolveArtefactReference`  
   - whether any constituent prompt or renderer **reads another constituent’s draft payload** at runtime  
2. **Fixture selection:** Prefer an existing Sprint 102 / 97 journey that already declares journal producers (e.g. Practice or Interactive with `learner-constructed-*`), rather than regenerating LJ Test 3.  
3. **Concrete continuity story (for later 103D):**  
   - C1 Practice — learner records an initial judgement  
   - C2 Expository — conceptual development  
   - C3 Practice or Assessment Pack — revisit/evaluate earlier judgement  
4. **Output of 103A:** A short boundary statement:  
   - design-time continuity (shared context / briefs) — yes/no/evidence  
   - journal visibility — yes/no/evidence  
   - runtime access to earlier learner work — yes/no/missing link  
   - response-aware activity behaviour — yes/no/missing link  
   - smallest viable next step (verify-only vs minimal correction) — **no** adaptive architecture by default

### Why this is smallest

It reuses S97/S102 artefact and journal contracts, answers Workstream C’s critical unknown early, and informs whether Workstream B AP/ST work is “same path” or a separate gap — without opening excluded backlog items.

---

## 4. 103A deliverables

1. Evidence map table (S102 demonstrated / needs verify / unknown).  
2. Continuity boundary note (four distinctions above).  
3. Proposed live probes for 103B–D with acceptance checks from [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).  
4. Feasibility / scope risks logged in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).  
5. Gate recommendation: what (if anything) may proceed to implementation authorisation.

---

## 5. Explicit non-actions in 103A

- No application/prompt/schema edits.  
- No Clear run data, folders, Practice surfaces, precision graphics, assisted briefs, release packaging, branching.  
- No broad test-suite runs as a substitute for the continuity map.  
- No claim that AP/ST are validated.
