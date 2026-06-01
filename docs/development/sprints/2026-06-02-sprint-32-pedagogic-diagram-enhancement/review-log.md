# Sprint 32 review log

**Format:** `R32-NNN` — decision · evidence · follow-up

**Programme status:** **PLANNED** — **NOT STARTED**

---

| ID | Date | Decision | Evidence | Follow-up |
|----|------|----------|----------|-----------|
| R32-001 | 2026-06-02 | **Sprint 32 pack created — governance baseline only** — programme is a **workflow + self-contained export** track for pedagogically justified diagrams; **no** implementation slices approved; **no** workflow JSON or renderer changes; **no** base64-in-prompts; existing SVG workflow is historical context only; inherited test floor **502** from Sprint 31 close | [`sprint-32-charter.md`](sprint-32-charter.md); [`SPRINT-32-PLANNING-NOTES.md`](SPRINT-32-PLANNING-NOTES.md); [Sprint 31 R31-999](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/review-log.md) | Approve slice 32-1 charter after workflow audit; do not implement until R32-002+ |

---

## Pending decisions (planning phase)

| Topic | Options | Decide by |
|-------|---------|-----------|
| Artefact persistence model | In-workflow file refs vs manual re-upload fallback | Before slice 32-1 implementation |
| Image generation provider / step type | Dedicated generation step vs external tool hook | Charter 32-1 |
| Placement authority | Workflow HTML transform vs renderer figure slots | Charter 32-5 |
| STEM scope | Include 32-7 in programme vs separate quantitative sprint | Programme planning |
| SVG legacy workflow | Deprecate vs parallel vs migrate | After audit (`visual-enhancement-workflow-analysis.md`) |

---

## Deferred (outside Sprint 32 unless re-chartered)

| Item | Notes |
|------|--------|
| `metacognition_contract` | Sprint 30 Phase 3 — generation layer |
| Sprint 31 renderer rhetoric | **CLOSED** — regression fixes only |
| Pure quantitative/math rendering programme | May overlap 32-7 or separate charter — see `future-quantitative-rendering-notes.md` |
