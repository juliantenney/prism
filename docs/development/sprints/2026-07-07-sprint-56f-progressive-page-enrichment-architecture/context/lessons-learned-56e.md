# Lessons Learned — Sprint 56E

## Summary

Sprint 56E investigated whether a **schema-led minimal Design Page prompt** could reliably assemble upstream artefacts. It could not. The sprint correctly froze investigation and triggered architectural redesign (56F).

## What worked

- Contract extraction (`design-page-contract.md`) clarified responsibilities
- Schema freeze process produced authoritative page schema reference
- External validation model aligned with PRISM constraints
- Iterative test runs produced precise failure taxonomy
- Subtraction rewrite of v2 prompt removed auditor/gatekeeper language

## What failed

### Material fidelity

- Summarised bodies instead of verbatim GAM content
- Empty `material.body` with correct `material_id`
- Opening-excerpt copies (heading only, not full body)
- Placeholder descriptions ("Lifecycle stage mapping table.")

### ID integrity

- `A1` → `LO1`, `A1-M1` → `LO1-M1` remapping
- Regenerated activities from concepts instead of transporting DLA

### LLM behavior modes

- Auditor/gatekeeper: refused to emit due to length, authority, validation
- False failures: "registry not supplied", "machine-readable mappings not provided"
- False success: validation flags pass while bodies incomplete

### Architecture assumptions

- Asking LLM to parse markdown GAM at assembly time is fragile
- Late-stage merge of independent artefacts duplicates truth
- More prompt rules did not fix deterministic join failures

## Key insight

> LLMs are good at content generation. LLMs are poor at deterministic join/copy/assembly.

Design Page was performing **transport**, not **authoring** — wrong tool for the job.

## Prompt evolution lesson

Each failure triggered prompt patches that increased size and defensive language. Subtraction toward minimal assembler helped clarity but could not overcome merge architecture.

## Schema lesson

Schema validity is necessary but not sufficient. Schema-valid output with summarised bodies is contract-invalid.

## Validation lesson

PRISM cannot post-validate workflow outputs. `generation_notes.validation` self-reports are unreliable when model claims pass despite fidelity failure.

## Recommendation carried into 56F

- Retire LLM Design Page merge
- GAM writes structured bodies into page at enrichment time
- One evolving page artefact
- Deterministic operations via structured JSON + agent tooling
- External audit for fidelity proof

## 56E artefacts to reuse

- `design-page.schema.json` — page schema starting point
- `design-page-contract.md` — responsibility reference (reassigned in 56F)
- `validation-report-template.md` — external audit template
- `schema-source-audit.md` — field inventory reference

## 56E artefacts not to extend

- `design-page-v2.prompt.md` — investigation only; do not deploy
- Production Design Page prompt patches for merge fidelity
