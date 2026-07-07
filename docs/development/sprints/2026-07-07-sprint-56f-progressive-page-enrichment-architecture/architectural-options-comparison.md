# Architectural Options Comparison

## Option 1: Current — Separate artefacts + Design Page LLM merge

### Model

```
Episode Plan ──┐
DLA ───────────┼──► Design Page (LLM) ──► page ──► Renderer
GAM (markdown) ┤
Sequence ──────┘
```

### Pros

- Existing workflow bindings
- Familiar step boundaries
- Extensive prompt investment

### Cons

- Proven unreliable for material fidelity (56D, 56E)
- Markdown GAM requires extraction at merge time
- ID reconciliation burden
- LLM gatekeeping / summarisation under pressure
- Duplicate content representation

### Verdict

**Reject** as target architecture. May remain temporarily during migration only.

---

## Option 2: Separate JSON artefacts + deterministic assembly

### Model

```
DLA (JSON) ──┐
GAM (JSON) ──┼──► deterministic assembler (code/agent) ──► page ──► Renderer
EP + Seq ────┘
```

### Pros

- Eliminates LLM merge
- Structured artefacts enable exact ID lookup
- Agent/Python can perform join when structured
- Lower migration risk than full pipeline rewrite

### Cons

- Still multiple artefacts to coordinate
- Merge step exists (even if deterministic)
- Risk of drift between artefacts and page

### Verdict

**Viable interim** or fallback if progressive enrichment rollout is phased.

---

## Option 3: Progressive enrichment — one evolving page artefact

### Model

```
Episode Plan ──► page (shell)
DLA ──────────► page (activities)
GAM ──────────► page (materials)
Sequence ─────► page (order)
finalise_page ──► page (wrapper only, optional)
Renderer ─────► HTML
```

### Pros

- No merge stage
- Single source of truth
- Bodies written once at GAM enrichment
- Clearest ownership model
- Best fit for PRISM transport constraints

### Cons

- Largest workflow contract change
- Episode Plan gains page-creation responsibility
- Requires rethinking step output bindings

### Verdict

**Preferred target architecture** (Sprint 56F recommendation).

---

## Recommendation summary

| Criterion | Option 1 | Option 2 | Option 3 |
| --------- | -------- | -------- | -------- |
| Material fidelity | Poor | Good | Best |
| LLM assembly risk | High | None | None |
| Migration effort | Low (status quo) | Medium | High |
| Long-term simplicity | Poor | Medium | Best |
| Fits PRISM validation model | Poor | Good | Good |

**Adopt Option 3.** Use Option 2 patterns (structured JSON, deterministic lookup) as implementation techniques within Option 3 enrichment steps.
