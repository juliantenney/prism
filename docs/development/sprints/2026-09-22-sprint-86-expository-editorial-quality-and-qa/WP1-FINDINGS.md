# Sprint 86 — WP1 findings (working)

**Status:** Working investigation record after S86-T-001…T-003  
**Not accepted:** Final editorial model remains **provisional** pending cross-case challenge (T-006/T-007)  
**Evidence base:** [evidence/case-01-bayes/](evidence/case-01-bayes/) only so far  
**Draft principles source:** [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md)

---

## S86-T-003 — Instructional architecture vs editorial architecture

### Finding (provisional)

Bayes supports treating these as **two related quality layers** (not cosmetics vs substance):

| Layer | What is judged | Bayes evidence |
| ----- | -------------- | -------------- |
| **Instructional architecture** | Whether the resource constructs the right understanding, in a suitable order, with sufficient explanation and representation for the audience and extent | S1–S8 journey is coherent; formula after frequencies; changed-prior comparison; qualifications in S8; useful figures exist; extent appropriate |
| **Editorial architecture** | Whether the reading experience is coherent and authored: entry, pacing, emphasis, rhetorical variation, transitions, representation *use*, controlled recurrence, hierarchy, typography, and closure | Front matter heavy; orientation/body/closing redundancy; even teacherly rhythm; figures often afterthought-adjacent; no H3 hierarchy; multiple closures; UI-font publishing feel |

A resource can be **factually sound, pedagogically well sequenced, sufficiently explanatory, and functionally rendered** yet still fall short of high-quality educational publishing because the **composition of the reading experience** fails: the learner is repeatedly told what they will learn / have learned, equal rhetorical weight is given to routine and threshold moments, and artefacts sit beside rather than inside the argument.

### Formulation note

“Two layers” is retained for now because it explains mediocrity-despite-correctness cleanly. Alternative framings (two perspectives on one quality object; “compositional quality” vs “pedagogical design”) remain open. Do **not** reduce editorial architecture to visual polish — typography is one instrument among entry, pacing, emphasis, recurrence, and closure.

### Test question retained

> Can the quality model explain why a resource feels mediocre even when it is factually correct, pedagogically sensible and technically valid?

**Case 01 answer (provisional):** Yes — via editorial-architecture failures listed above while instructional architecture remains strong.

---

## S86-T-002 — P1–P11 assessment against case 01

Legend for status language (single-case discipline):

- **supported by case 01** — Bayes shows a real quality difference the principle names  
- **provisional** — plausible but needs cross-case challenge  
- **requires cross-case challenge** — risk of Bayes-specificity  
- **weakly evidenced** — little direct export evidence yet  
- **potentially overlapping** — may collapse with another P  

| P | Assessment | Bayes support | Classification notes | Suggested refinement (provisional) | Confidence |
| - | ---------- | ------------- | -------------------- | ---------------------------------- | ---------- |
| **P1** Begin by creating an intellectual need | **supported by case 01** | Resource opens with administrative Overview/Learning purpose before S1’s engaging question; developmental edit replacing admin opening improved entry | **provisional** / **requires cross-case challenge** — “intellectual need” device is subject-dependent; not every resource needs a provocative question | Reframe as: prefer subject-appropriate intellectual entry over administrative prospectus; **do not** prescribe device type | Medium |
| **P2** Journey perceptible without excessive narration | **supported by case 01** | Section titles carry journey; orientation + in-body “we first need / this resource develops” metacommentary over-narrates | **provisional**; overlaps P8 | Merge consideration with P8 as “trust progression / reduce metacommentary” vs keep separate “journey perceptibility” | Medium |
| **P3** Attention ∝ intellectual difficulty | **supported by case 01** (partly instructional) | Extent allocation across S1–S8 is largely sensible; editorial unevenness is more about equal *rhetorical* weight than wrong topic mix | **provisional**; partly instructional-layer; editorial facet is emphasis density | Split instructional “extent allocation” from editorial “emphasis density” in QA dimensions | Medium |
| **P4** Prefer development over repetition | **supported by case 01** | Orientation / body / closing recur prior–evidence–posterior and base rates with limited new development in front matter/closing | **provisional**; overlaps P8/P11 | Keep; define “productive recurrence” test: each recurrence must add a new cognitive move | Medium-high |
| **P5** Representations perform explanatory work | **supported by case 01** | Figures 2–4 are purposeful (frequencies, equation, comparison); still some “present because commissioned” feel if unused mid-prose | **provisional** | Keep; success = learner needs the artefact to follow the argument | Medium |
| **P6** Compose prose and representations as one explanation | **supported by case 01** | Strong motivation for XD→XM seam; figures often after section rather than woven | **provisional**; overlaps P5; **requires cross-case challenge** for low-visual domains | Keep as integration principle distinct from “artefact exists for a reason” (P5) | Medium |
| **P7** Rhetorical emphasis selectively | **supported by case 01** | Compression line is excellent but not structurally privileged; most paragraphs share similar weight | **provisional** | Keep; pair with typography/hierarchy instruments | Medium |
| **P8** Trust the reader | **supported by case 01** | Restatement and “explanation of the explanation” frequent | **provisional**; overlaps P2/P4 | Keep as anti-restatement / semantic-density principle | Medium-high |
| **P9** Expose learner value, not internal machinery | **supported by case 01** | Explicit Overview / Learning purpose / Knowledge summary / Closing as labelled furniture | **provisional** / **requires cross-case challenge** — some domains may want visible orientation | Reframe: visible regions must earn learner-facing value; internal fields ≠ automatic UI | Medium |
| **P10** Typography reveals intellectual structure | **supported by case 01** | No H3; system font stack; limited signalling of threshold moments | **provisional**; partly deferred to WP5 | Keep as requirements input, not font fashion | Medium |
| **P11** End by consolidating developed understanding | **supported by case 01** | S8 + Closing + orientation summary = multiple closures; developmental edit consolidating helped | **provisional**; overlaps P4/P9 | Prefer single consolidating close that shows gained understanding | Medium-high |

### Overlaps flagged (case 01)

- **P2 ↔ P8** — metacommentary vs trust  
- **P4 ↔ P8 ↔ P11** — recurrence / restatement / multiple closure  
- **P5 ↔ P6** — purpose of artefact vs integration into prose  

Do **not** collapse yet — cross-case evidence may show they pull apart (especially P5 vs P6 when visuals are sparse).

### Missing principles / dimensions suggested by case 01 (candidates only)

Not added to the accepted set — candidates for QA v0.1 and later model revision:

1. **Forward momentum / section joints** — how endings create need for the next section (appeared in developmental-edit list; weakly named by P2 alone).  
2. **Semantic density** — words should buy understanding (adjacent to P8; may deserve explicit QA dimension).  
3. **Single authoritative close** — stronger than P11’s general consolidation wording.  
4. **Audience-calibrated register** — Bayes register is mostly appropriate; still needed as QA check to avoid over-claiming generality of “trust the reader.”

### Explicit non-conclusion

**No principle is validated** from case 01 alone. P1–P11 remain hypotheses. Bayes must not become a template.

---

## Implications for later WPs

- WP2 QA v0.1 should separate instructional-journey judgements from editorial-composition judgements.  
- WP3 cases must challenge P1 device-type, P5/P6 under low-visual conditions, and P9 orientation norms.  
- WP4 should treat P6 as a primary driver of the XD→XM integration investigation.  
- Functional fallback defect must stay on a separate debt track (S86-AD-010).
