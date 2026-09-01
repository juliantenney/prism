# Semantic learner input modality — Gate 1

## Purpose

PRISM can now state truthfully, at commissioning time, that a structured learner
response field expects mathematical input (`input_modality: math`) or ordinary text
(`input_modality: text`).

This is **semantic commissioning data**. It does not select a renderer, editor, or
persistence format.

## Authority

- **DLA** is the sole semantic authority via optional
  `required_materials[].response_fields[]`.
- **GAM** preserves DLA-owned `required_materials` unchanged and continues authoring
  the existing markdown `**Label:**` template body. GAM must not reinterpret
  modality.
- **vNext composition** joins commissioned metadata to parsed template sections and
  exposes `inputModality` on composed `ResponsePart` objects.

## Field identity

Sections are joined by **exact label match** (trimmed string equality) between:

1. DLA `response_fields[].label`
2. Parsed template section label from GAM markdown `**Label:**`

This follows S78-T-042 governed label fidelity. No fuzzy matching, keyword inference,
or label semantics are used.

## Renderer and persistence

- `input_modality: math` **does not** imply `surfaceKind: math_entry`.
- Mathematical parts still render through the existing `text_entry` surface.
- Learner draft persistence is unchanged (plain strings).
- No maths editor has been selected or implemented.

## Table maths (future)

Template rows carry field-level modality today. The same semantic concept is
intended to apply later to editable table cells via an analogous per-cell or
per-column commission on the table `required_materials` row — not implemented in
Gate 1.

## Rich mixed prose + maths

This change does **not** imply a rich-text or inline-formula editor. Structured
multi-field templates remain the supported decomposition pattern.

## Design principle

> A first-class learner activity must provide an interaction surface capable of
> producing the evidence specified by its commissioning contract.

Gate 1 establishes the semantic prerequisite for that rule; specialised input
surfaces remain a subsequent decision.

## Propagation trace

```
DLA required_materials[].response_fields[]
  → page partial (DLA-owned, immutable at GAM)
  → GAM commission JSON pass-through
  → learner model sourceActivity.required_materials
  → compose-response-parts (template sections)
  → ResponsePart.inputModality
```

## Defaults and failure behaviour

- `response_fields` absent → unchanged legacy behaviour (`inputModality: text`).
- `input_modality` omitted → `text`.
- Unknown modality at DLA capture → fail closed.
- Label mismatch at composition → `text` + diagnostic (no unsupported UI).
