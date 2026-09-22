# Sprint 86 — Closure Record

**Sprint:** 86 — Expository Editorial Quality & QA  
**Opened:** 2026-09-22  
**Closed:** 2026-09-22  
**Status:** **COMPLETE / CLOSED**  
**Type:** Investigation / Design — **not** implementation  
**Backlog:** [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)  
**Opening:** [S86-D01](decisions.md#s86-d01--open-sprint-86--expository-editorial-quality--qa)  
**Close:** [S86-D02](decisions.md#s86-d02--close-sprint-86--expository-editorial-quality--qa)  
**Predecessor:** [Sprint 85 COMPLETE / CLOSED](../2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md)

---

## 1. Final conclusion

> **Sprint 86 establishes an evidence-backed Expository editorial quality model (EQ1–EQ8), a frozen validation-set QA instrument (v0.1), pipeline responsibility findings, seam and typography designs, and a bounded first successor implementation slice. It does not implement that slice.**

Sprint 86 was post-alpha investigation/design under [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa). Production Expository capability remains the **Sprint 85** first-class delivery until a successor sprint implements T-011.

**Alpha development remains complete** (Sprint 82).

**Not claimed:** production-ready · formally WCAG conformant · bug-free · feature-complete · polished Expository presentation already shipped.

---

## 2. Overarching quality definition (accepted)

> A high-quality Expository Resource constructs the **commissioned understanding** in its **appropriate epistemic form**, and presents that understanding as **one authored intellectual experience** — progressive, selectively emphasised, representation-aware, and closed once — rather than as an assembly of individually competent instructional components and internal page furniture.

---

## 3. EQ1–EQ8 (accepted)

1. **Purpose & epistemic form**  
2. **Open into commissioned intellectual need**  
3. **Progress with attention proportional to difficulty**  
4. **Development + productive anchor recurrence**  
5. **Representation warrant & participation**  
6. **Selective emphasis & reader trust**  
7. **Learner value + visible intellectual structure**  
8. **One form-appropriate consolidating close**

Authoritative: [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md) · [T-007-FIVE-CASE-SYNTHESIS.md](T-007-FIVE-CASE-SYNTHESIS.md)

---

## 4. Pipeline conclusions (accepted)

- Existing Expository topology is **broadly sound**.  
- **No** additional generative stage is currently justified.  
- **EJP** owns the intellectual journey and should preserve purpose/epistemic form.  
- **XD** owns learner-facing exposition.  
- **XM** realises commissioned supporting intellectual artefacts.  
- **Design Page** performs bounded downstream editorial/visual planning — not a second pedagogical author.  
- **Renderer** remains deterministic.  
- Improve **responsibility and information transport** before expanding topology.

**Preserve:** Protect Interactive · Reuse PRISM capabilities · Give Expository its own pedagogy ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).

Authoritative: [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md)

---

## 5. T-009 / T-010 / T-011 handoffs

### T-009 Option B (accepted follow-on — **not** first slice)

Richer commission semantics; perceptibility intent; prose participation intent; stable commission identity; optional VA↔commission binding; no forced material↔figure 1:1; no post-XM rewrite.  
→ [T-009-XD-XM-SEAM.md](T-009-XD-XM-SEAM.md)

### T-010 restrained publishing grammar (accepted requirements)

~65–75ch (70ch OK); calm long-form type; H1/H2 with optional genuine H3 later; spacing-led hierarchy; quiet figures/captions; editorial tables/lists; unboxed maths; light supporting-material treatment; one continuous close; narrow first-class; avoid cardification / AI-document emphasis / component proliferation.  
→ [T-010-TYPOGRAPHY-REQUIREMENTS.md](T-010-TYPOGRAPHY-REQUIREMENTS.md)

### T-011 first successor implementation slice (accepted design — **not implemented**)

1. EQ1 — small purpose / epistemic-form contract  
2. EQ7 — remove default Expository prospectus orientation stack  
3. EQ8 — XD owns one substantive close; omit default page Closing  
4. AD-010 — repair unsupported structured-material rendering without losing unique content  
5. Restrained T-010 CSS/renderer presentation improvements  
6. DP `sections` patch safety  

**Product outcome:** First-class Expository Resources preserve the commissioned intellectual purpose, open and close as chapters rather than prospectus packs, eliminate the systematic structured-material rendering defect, and present with restrained non-card educational publishing chrome — without a new generative stage and without destabilising Interactive.

→ [T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md](T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)

**Dependency order for successor implementation:**

```text
contracts / authority
  → Expository sibling prompts
  → assembly policy
  → renderer / AD-010 / presentation
  → tests
  → live E2E
```

---

## 6. Explicitly not in first slice / deferred

- Full T-009 Option B  
- Semantic H3/subsection generation  
- Font/serif programme  
- Callout kits  
- New AI stage / post-XM rewrite  
- Mandatory material↔figure 1:1  
- Changing 70ch for its own sake  
- Design-system programme  
- CAS / per-cell table maths  
- Broad Interactive prompt generalisation  

---

## 7. Work-package status at close

| WP | Status | Notes |
| -- | ------ | ----- |
| WP1 | **COMPLETE** | EQ1–EQ8 · instructional vs editorial |
| WP2 | **HANDOFF / CARRY-FORWARD** | QA v0.1 frozen & used; **QA v0.2 not drafted** — draft at **start of successor implementation sprint**, before coding |
| WP3 | **COMPLETE** | C01–C05 frozen under QA v0.1 |
| WP4 | **COMPLETE** | T-008 map + T-009 Option B design |
| WP5 | **COMPLETE** | T-010 requirements + T-011 first-slice design |

Sprint 86 can close with WP2 incomplete on v0.2 because that remaining work is **deliberately transferred** into successor-sprint acceptance instrumentation rather than left as an unacknowledged unfinished investigation obligation.

---

## 8. Task status at close

| Task | Status |
| ---- | ------ |
| T-001…T-006 | COMPLETE |
| T-007 | COMPLETE |
| T-008 | COMPLETE |
| T-009 | COMPLETE |
| T-010 | COMPLETE |
| T-011 | COMPLETE |
| **T-012** | **COMPLETE** (this record) |

---

## 9. Evidence & instruments

| Artefact | Role at close |
| -------- | ------------- |
| [EXPOSITORY-QA-v0.1.md](EXPOSITORY-QA-v0.1.md) | Frozen validation instrument (C01–C05) |
| Frozen C01–C05 evidence | Validation set — do not reopen judgements |
| QA v0.2 candidates (T-007) | Purpose-fit; epistemic form; a11y ≠ redundancy; anchor recurrence; interpretive close; warrant→value→integration |

**AD-010:** Systematic learner-facing functional defect — **5/5** exports, **23** occurrences; unsupported structured XM shapes; **in first successor slice**; repair without dropping unique content.

---

## 10. Production & Alpha status

| Item | State |
| ---- | ----- |
| Sprint 86 production code/prompts/contracts/renderer/CSS | **Unchanged** (investigation/design only) |
| Current Expository product | **Sprint 85** first-class functional delivery |
| T-011 first slice | **Designed — not implemented** |
| Interactive baseline | **Protected** (S83-D04) |
| First-class gate (at S85 close) | **339/339** |
| Alpha | **Complete** (Sprint 82) — unchanged by S86 |

---

## 11. Successor-sprint starting point (do not open here)

When authorised, the next implementation sprint should:

1. Create/open the successor implementation sprint (not created in T-012).  
2. **Draft QA v0.2** from S86 evidence **before coding**.  
3. Implement the bounded **T-011 first slice** in dependency order.  
4. Run focused/new tests plus protected Interactive baseline.  
5. Manually exercise contrasting Expository pressure cases (maths / low-visual / mechanism / interpretive / abstract).  
6. Decide from live evidence whether Option B / semantic H3s deserve subsequent work.

**Sprint 87 was not created or begun in this closure.**

---

## 12. Authoritative S86 output index

| Document | Role |
| -------- | ---- |
| [T-007-FIVE-CASE-SYNTHESIS.md](T-007-FIVE-CASE-SYNTHESIS.md) | Five-case synthesis → EQ1–EQ8 |
| [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md) | EQ→pipeline map |
| [T-009-XD-XM-SEAM.md](T-009-XD-XM-SEAM.md) | Option B seam design (follow-on) |
| [T-010-TYPOGRAPHY-REQUIREMENTS.md](T-010-TYPOGRAPHY-REQUIREMENTS.md) | Typography requirements |
| [T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md](T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) | First-slice design |
| [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md) | EQ1–EQ8 |
| [EXPOSITORY-QA-v0.1.md](EXPOSITORY-QA-v0.1.md) | Frozen QA instrument |
| [WP1-FINDINGS.md](WP1-FINDINGS.md) | WP1 final |
| `evidence/case*` | Frozen C01–C05 |

---

## 13. Closure checklist

- [x] T-007–T-011 conclusions represented accurately  
- [x] WP2 / QA v0.2 carry-forward explicit  
- [x] No production files changed in this closure pass  
- [x] No Sprint 87 artefacts created  
- [x] First slice matches T-011  
- [x] Option B remains follow-on  
- [x] AD-010 in first slice  
- [x] Interactive remains protected  
- [x] Sprint status **COMPLETE / CLOSED**  
