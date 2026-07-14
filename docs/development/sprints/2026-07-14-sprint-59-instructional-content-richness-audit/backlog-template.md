# Sprint 59 — Backlog Template

One row (or one ticket file) per actionable finding cluster. Prefer clustering duplicates across lessons with a `frequency` note.

**Active backlog:** [backlog.md](backlog.md) (Priority 1–2 Instructional Archetype Framework + first-audit carry-forwards).

**Timing:** During lesson review, record observable evidence and **primary classification** only. Develop `future_fix_hypothesis` entries during **backlog consolidation** — not while scoring individual lessons.

**Note:** `target_sprint` for archetype packages is **Sprint 59** (in-stream). Do not invent Sprint 60 solely for instructional-quality follow-on.

---

## Ticket fields

| Field | Description |
| ----- | ----------- |
| `id` | e.g. `S59-BL-003` |
| `finding` | One-sentence problem statement (observable) |
| `severity` | S0–S3 (see issue-classification) |
| `frequency` | How many samples / % of reviewed |
| `content_type` | From rubric |
| `canonical_owner` | EP / DLA / GAM / Assess-design / Assess-items / LS / DP / Assembly / Renderer |
| `primary_class` | A–F (one only) |
| `secondary_tags` | optional |
| `evidence` | Finding file ids + artefact paths + evidence status |
| `future_fix_hypothesis` | Future fix idea recorded at consolidation — **not** developed during lesson review |
| `dependency` | e.g. needs renderer sprint; needs prompt sprint |
| `target_sprint` | Prefer Sprint 59 for archetype packages; e.g. later renderer sprint only for Class B |
| `acceptance_test` | Observable check when fixed |

---

## Markdown ticket sketch

```markdown
## S59-BL-XXX — Title

- **Finding:** (observable)
- **Severity:** S_
- **Frequency:**
- **Content type:**
- **Canonical owner:**
- **Primary class:** A|B|C|D|E|F
- **Secondary tags:**
- **Evidence:** (paths + evidence status)
- **Future fix hypothesis:** (consolidation only)
- **Dependency:**
- **Target sprint:**
- **Acceptance test:**
```

---

## Prioritisation hint (suggested)

1. S3 / S2 with high frequency  
2. Primary A that blocks assessment evidence  
3. Primary B with rich JSON (high renderer ROI; Full evidence required)  
4. Primary E ownership clarifying work (often deferred)  
5. S0 / F  

Do not implement fixes in Sprint 59 except agreed non-invasive audit tooling.

---

## Renderer backlog linkage

Class B items destined for a renderer sprint should also appear in [renderer-input-template.md](renderer-input-template.md) with matching IDs.
