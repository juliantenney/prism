# Sprint 85 — Closure Record

**Sprint:** 85 — Expository Resource Implementation  
**Opened:** 2026-09-21  
**Closed:** 2026-09-22  
**Status:** **COMPLETE / CLOSED**  
**Type:** Implementation  
**Backlog:** [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Opening:** [S85-D01](decisions.md#s85-d01--open-sprint-85--expository-resource-implementation)  
**Brief:** [S85-D02](decisions.md#s85-d02--accept-detailed-sprint-85-implementation-brief)  
**Close:** [S85-D08](decisions.md#s85-d08--close-sprint-85--expository-resource-implementation-complete)  
**Predecessor:** [Sprint 84 — CLOSED](../2026-09-21-sprint-84-expository-resource-planning/SPRINT-84-CLOSURE.md)  
**Authoritative design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## 1. Final conclusion

> **S85 establishes functional first-class Expository capability. It does not claim that the learner-facing presentation is polished or final.**

There is **no known functional blocker** to first-class Expository use.

Sprint 85 implemented and manually exercised the first-class Expository Resource journey end-to-end. Existing Interactive behaviour remains the protected baseline ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).

This closeout does **not** reopen Sprint 83 or Sprint 84 decisions, alter the accepted Expository architecture, or invent a polish/refinement programme.

**Alpha development remains complete** (Sprint 82). This is a **post-alpha** first-class product addition.

**Not claimed:** production-ready · formally WCAG conformant · bug-free · feature-complete for every future product/output type.

---

## 2. Authoritative topology delivered

```text
[Normalize?]
→ Generate Learning Content
→ Model Knowledge
→ Learning Outcomes
→ Expository Journey Plan
→ Expository Development
→ Expository Materials
→ Design Page
→ deterministic assembly
→ learner-renderer-vnext
→ export
```

(Interactive EP / DLA / GAM / Learning Sequence bypassed for Expository.)

---

## 3. Final live E2E

Final live journey: **Bayes' theorem**, audience university staff / postgraduate students with everyday probability knowledge and little formal statistical training.

Exercised successfully:

- shared Create elicitation and Expository product routing;
- GLC → MK → understanding-oriented LO;
- EJP → XD (real learner-facing exposition) → XM (structured commissioned artefacts);
- Design Page, graphics / visual affordances, mathematical / formal notation;
- deterministic assembly, learner rendering, learner closing paragraph, standalone export;
- Adjustments **Scope / extent** (not Interactive Duration): Create “about a 10-minute read” → adjusted “about a 20-minute read” → EJP rerun yielded materially deeper explanatory planning that propagated into XD.

### WP4 live integration repair (final E2E)

One genuine Design Page validation defect was found and repaired narrowly:

1. `page_synthesis.closing_paragraph` was missing from the shared visual evidence-anchor allowlist — added **additively**; Interactive `study_tips` preserved.
2. Expository DP sibling prompt did not enumerate canonical `representation_avoid` vocabulary — aligned to the existing Sprint 38 enum; validator remains fail-closed; enum not expanded for free-form model phrases.

Fresh Design Page generation then validated/captured; final learner resource rendered/exported and was manually inspected as functionally sound.

---

## 4. Engineering gates at close

| Gate | Result |
| ---- | ------ |
| Focused Sprint 85 | `node --test tests/s85-*.test.js` → **78/78** |
| First-class (Interactive baseline) | `npm run test:first-class` → **339/339** |

---

## 5. What Sprint 85 established

| Established | Status |
| ----------- | ------ |
| First-class Create product `expository_resource` | **Delivered** |
| Expository topology + sibling EJP/XD/XM pedagogy | **Delivered** |
| Section-primary contracts, capture, assembly | **Delivered** |
| Domain guidance on Expository sibling path | **Delivered** |
| Graphics / VA (section-scoped) + formal-notation survival | **Delivered** |
| DP `closing_paragraph` → learner model → render/export | **Delivered** |
| Adjustments Scope / extent via `expository_extent` | **Delivered** |
| Interactive baseline protected | **Preserved** |
| Learner-facing presentation polish | **Not claimed** |
| Research Synthesis identity | **Open** (non-blocking) |
| Expository → Interactive transformation | **Open** (architectural hypothesis) |

Work packages WP1–WP4 completed under the authorised implementation briefs. There was **no planned WP5**; final capability-preservation and live E2E closed under WP4.

---

## 6. Non-blocking refinement observations

Recorded for later deliberate product/design consideration only — **not Sprint 85 work**, not blockers:

- learner-facing front matter can feel mechanical/repetitive;
- Step 3 workflow purpose wording (“measurable learning outcomes”) remains slightly Interactive/assessment-flavoured;
- Adjustments UI is text-heavy;
- generated prose rhythm may merit later refinement;
- possible overlap/redundancy between XM supporting intellectual artefacts and DP visual affordances;
- existing documented schema/identity/assembly debts remain deferred;
- Research Synthesis relationship remains an open product question;
- Expository → Interactive relationship remains an open architectural hypothesis;
- future maths/CAS/table-maths capabilities remain out of scope ([PB-M-001](../../../backlog/PRODUCT-BACKLOG.md#pb-m-001--future-maths-capabilities)).

Also listed lightly in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

---

## 7. Decisions at close

| ID | Summary |
| -- | ------- |
| S85-D01…D02 | Open pack; accept implementation brief |
| S85-D03…D07 | Topology, contracts, extent, XM/GAM boundary, sibling prompts |
| **S85-D08** | **Close Sprint 85 — Expository Resource Implementation COMPLETE** |

---

## 8. Successor programme

**No active sprint opened by this closeout.**

Next work is selected deliberately from [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) and/or evidenced alpha-use findings. Do not invent an Expository polish programme from these observations.

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

---

## 9. Pack index at close

- [SPRINT-85-CLOSURE.md](SPRINT-85-CLOSURE.md) — this record  
- [decisions.md](decisions.md) — S85-D01…D08  
- [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [HANDOVER.md](HANDOVER.md)  
- [SPRINT-85-START-HERE.md](SPRINT-85-START-HERE.md) · [SPRINT-85-CHARTER.md](SPRINT-85-CHARTER.md)  
- [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)
