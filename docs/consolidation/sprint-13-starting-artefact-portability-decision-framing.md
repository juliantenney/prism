# Sprint 13 — starting artefact / Learning Design starting-point portability (decision framing)

**Date:** 2026-05-13  
**Basis:** `docs/consolidation/sprint-13-starting-artefact-ld-starting-point-portability-audit.md`  
**Role:** Frame **decision space** for future work on Workflow Factory **starting artefact / starting-point** coupling — **without** selecting policy, **without** approving implementation, and **without** expanding Sprint 13 charter by implication.

**No implementation:** This note is **documentation only**. **No** code, domain-pack, prompt, persistence, import/export, or orchestration edits were performed to produce it.

---

## 1. Summary of the audit finding

The audit maps **`renderWorkflowFactoryStartingArtefactOptions`** in **`app.js`**: a **hardcoded** **`STARTING_ARTEFACT_ALLOWLIST`** ( **`general`** and **`learning-design`** only), a **`learning-design`–only** branch that **short-circuits** to **three** fixed **`startingArtefact` values** and labels, and **alternate** paths that draw options from **`getWorkflowBriefConfig`** (**`input_strategy.choices`**) or **`getDomainArtefactOptions`** (pack artefact markdown via **WGC**). **Research** has **no** allowlist row and therefore **different** filtering behaviour than **general** / **learning-design** on the **`getDomainArtefactOptions`** path. **Learning Design** does **not** share the same option pipeline as other domains when it is the visible structured domain.

---

## 2. Current split (four buckets)

| Bucket | What it is |
|--------|------------|
| **`app.js`-owned allowlists** | **`STARTING_ARTEFACT_ALLOWLIST`** — id lists for **`general`** and **`learning-design`** only; used by **`getAllowSetForDomain`** to filter **`getDomainArtefactOptions`** output when **`allowSet`** is non-null. |
| **Learning Design–only starting-point branch** | When **`getVisibleDomainId()`** is **`learning-design`**, **`renderLearningDesignStartingPointOptions`** runs and **returns** — **bypasses** **`getDomainArtefactOptions`** and the **`renderFromBriefConfig`** success path for that render. |
| **Domain-pack–owned artefact / brief config** | **`input_strategy`** **`choices`** from **`workflowBriefConfig`** (via **`getWorkflowBriefConfig`**); artefact catalogue entries parsed from domain **`*artefacts*`** markdown referenced by manifest. |
| **WGC `getDomainArtefactOptions`** | Loads manifest, normalises **`selectedDomains`**, loads artefact files, **`extractArtefactCatalogFromText`** — returns **`{ id, label, domainId }`** items consumed by **`renderOptions`** after **`app.js`** filters. |

---

## 3. Why this is not parity-safe like S13-01

**S13-01** bounded **`#wfDesignDomainSelect`** with a **single** control surface, **two** clear sources (**`getDomainOptions`** vs **`fallbackDomains`**) and a **documented** parity matrix + runtime baseline for **ordered options, labels, selection, and fallbacks**.

Starting-point behaviour **instead**:

- **Branches by domain id** with **different option sources** (LD trio vs brief vs WGC catalogue).
- **No** single matrix equating **Research**, **General**, and **Learning Design** paths.
- **Pack drift** and **`app.js`** allowlist drift can **diverge** independently.
- **Semantic** **`startingArtefact`** values (brief, save, heuristics) are **tied** to which branch authored them.

Therefore the same **“strict parity before de-hardcoding”** bar as S13-01 is **not** currently evidenced for this surface.

---

## 4. Candidate future decision models (descriptive only)

| Model | Description |
|-------|-------------|
| **Status quo documented** | Keep behaviour; record pack vs **`app.js`** split in charters / runbooks only. |
| **Strict-parity helper extraction only** | Move literals into **named helpers** or constants **without** changing **which** ids appear per branch — would still require **parity proof** equivalent to S13-01 if framed as “no behaviour change.” |
| **Manifest / domain-pack–owned starting artefact config** | Declare allowlists, LD trio, or unified option lists in **manifest or pack JSON**, loaded by **`app.js`** / **WGC** — **schema** and **migration** governance required. |
| **Defer until prompt / config portability is audited** | Treat starting-point **value** semantics as dependent on **`briefLines`**, extraction, and **`workflowBriefConfig`** contracts — postpone structural moves until those channels are explicitly chartered. |

---

## 5. Risks / tradeoffs by model (non-exhaustive)

| Model | Risks / tradeoffs |
|-------|-------------------|
| **Status quo documented** | **Stability**; continued **dual ownership** (pack + **`app.js`**); authors may **misread** which domains use which path. |
| **Strict-parity helper extraction** | **Low** mechanical risk **if** truly no behaviour change; **easy to accidentally** alter order/filtering during extraction without matrix-style proof. |
| **Manifest / pack–owned config** | **Single source of truth** potential; **high** governance cost (schema, versioning, import/export); **must** align **`getDomainArtefactOptions`**, **`getWorkflowBriefConfig`**, and **`app.js`** filters. |
| **Defer** | **Avoids** premature coupling changes; **leaves** LD special-case and allowlist drift **unaddressed** until other audits complete. |

---

## 6. Required evidence before implementation

- **Per-domain / per-branch matrix** of visible options and **`value`** set for **`["general"]`**, **`["general","learning-design"]`**, **`["general","research"]`**, WGC missing, and **`input_strategy`** present vs absent.
- **Fixture or inventory** of **saved** **`startingArtefact`** values in the wild (or representative exports).
- **Trace** each **`startingArtefact`** value through **`buildWorkflowDesignBrief`** and **`applyWorkflowDesignHeuristics`** (and any other consumers located in charter prep).
- **Written charter** naming **in/out** scope for pack vs **`app.js`** moves and **rollback** posture.

---

## 7. Stop conditions

**Halt** and return to decision framing when:

- A change **touches** **`briefLines`**, extraction, or **prompt bodies** **without** a **separate** approved charter.
- **`startingArtefact`** **values** or **normalisation** rules change **without** saved-workflow / import **evidence**.
- **Learning Design** branch is removed **without** a **documented** replacement for the **trio** semantics.
- **Sprint 12** tests or obligations are **reopened** to “fix” portability (**not** allowed under this framing note).

---

## 8. Explicitly deferred items

- **S13-01** — no extension of delivered **`#wfDesignDomainSelect`** slice to starting-point controls **without** new review artefacts.
- **S13-02** / **S13-03** — remain on their **own** decision gates; this note **does not** subsume them.
- **Domain-pack edits**, **prompt** edits, **persistence** / import/export contract changes — **unless** separately chartered.
- **Full drop-in portability** — **not** claimed (see §10).

---

## 9. Sprint 12

**Sprint 12** first-pass structural observability (**A–E**) remains **closed**. This framing note **does not** reopen Sprint 12.

---

## 10. No full portability claim

**Full drop-in domain-pack portability** is **not** claimed, scheduled, or implied as an outcome of any model in §4.

---

## Review log

- **2026-05-13** — Starting artefact / LD starting-point portability decision-framing note added (`sprint-13-starting-artefact-portability-decision-framing.md`).
