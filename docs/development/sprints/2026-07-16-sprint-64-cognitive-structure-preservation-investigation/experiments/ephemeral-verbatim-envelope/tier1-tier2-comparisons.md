# Tier 1 vs Tier 2 Comparisons (Ephemeral Envelope Prototype)

**Status:** Non-production experiment (S64-BL-004b)  
**Eligible:** 3 · **Excluded:** 4

## E1 — Mechanism explanation (Exp2 enzymes A2-M1)

Archetype: `mechanism_explanation`

### Tier 2

- **Orientation:** You will explain the temperature–rate relationship as a transmitting process.
- **Your goal:** Explain why reaction rate rises then falls as temperature increases within and beyond the enzyme's stable range.
- **Success looks like:** A causal chain account connecting temperature change to rate outcome via intervening links.
- **Authored overview:** Teach how temperature affects enzyme reaction rate through a causal chain.
- **High-value structure:** (unavailable at Tier 2 — plan fields not used)

### Tier 1 (path-gated ephemeral envelope)

- **Orientation:** You will explain the temperature–rate relationship as a transmitting process.
- **Your goal:** Explain why reaction rate rises then falls as temperature increases within and beyond the enzyme's stable range.
- **Success looks like:** A causal chain account connecting temperature change to rate outcome via intervening links.
- **Causal link 1:** molecular kinetic energy and collision frequency  
  _source: `archetype_plan.required_links[0]`_
- **Causal link 2:** enzyme-substrate complex formation  
  _source: `archetype_plan.required_links[1]`_
- **Causal link 3:** disruption of enzyme structure at high temperature  
  _source: `archetype_plan.required_links[2]`_

### Delta

- Added: Causal link 1; Causal link 2; Causal link 3
- Source fields: `archetype_plan.required_links[0]`, `archetype_plan.required_links[1]`, `archetype_plan.required_links[2]`
- T1 adds only verbatim high-value plan fields; Tier 2 shell unchanged

## E2 — Process walkthrough (mixed DLA A4-M1 + diagnostic stand-in)

Archetype: `process_walkthrough`

### Tier 2

- **Orientation:** Model how an expert reads the evidence set.
- **Your goal:** Work through expert interpretation of an enzyme reaction-rate investigation from condition to conclusion.
- **Success looks like:** A continuous walkthrough that transfers findings across stages to a bounded conclusion.
- **Authored overview:** Model expert interpretation of an enzyme reaction-rate investigation.
- **High-value structure:** (unavailable at Tier 2 — plan fields not used)

### Tier 1 (path-gated ephemeral envelope)

- **Orientation:** Model how an expert reads the evidence set.
- **Your goal:** Work through expert interpretation of an enzyme reaction-rate investigation from condition to conclusion.
- **Success looks like:** A continuous walkthrough that transfers findings across stages to a bounded conclusion.
- **Stage 1:** identify the manipulated condition and measured outcome  
  _source: `archetype_plan.stages[0]`_
- **Stage 2:** inspect the pattern across observations  
  _source: `archetype_plan.stages[1]`_
- **Stage 3:** connect the pattern to enzyme behaviour  
  _source: `archetype_plan.stages[2]`_
- **Stage 4:** form a bounded conclusion  
  _source: `archetype_plan.stages[3]`_

### Delta

- Added: Stage 1; Stage 2; Stage 3; Stage 4
- Source fields: `archetype_plan.stages[0]`, `archetype_plan.stages[1]`, `archetype_plan.stages[2]`, `archetype_plan.stages[3]`
- T1 adds only verbatim high-value plan fields; Tier 2 shell unchanged

## E3 — Mental model building (mixed DLA A3-M1 + diagnostic stand-in)

Archetype: `mental_model_building`

### Tier 2

- **Orientation:** Hold a durable model; then apply it across states.
- **Your goal:** Build a working model of thermostat-controlled heating and use it to contrast mild vs extreme cold.
- **Success looks like:** A coherent system model that explains both contrast states with the same relationships and constraint.
- **Authored overview:** Help learners assemble a durable working model of thermostat-controlled heating.
- **High-value structure:** (unavailable at Tier 2 — plan fields not used)

### Tier 1 (path-gated ephemeral envelope)

- **Orientation:** Hold a durable model; then apply it across states.
- **Your goal:** Build a working model of thermostat-controlled heating and use it to contrast mild vs extreme cold.
- **Success looks like:** A coherent system model that explains both contrast states with the same relationships and constraint.
- **Key relationship 1:** the thermostat compares room temperature with the set point  
  _source: `archetype_plan.key_relationships[0]`_
- **Key relationship 2:** the heater switches on when the room is below the set point and off when it reaches it  
  _source: `archetype_plan.key_relationships[1]`_
- **Key relationship 3:** the room continually loses heat to colder surroundings  
  _source: `archetype_plan.key_relationships[2]`_
- **Governing constraint:** the heater has a finite heating capacity  
  _source: `archetype_plan.governing_constraint`_

### Delta

- Added: Key relationship 1; Key relationship 2; Key relationship 3; Governing constraint
- Source fields: `archetype_plan.key_relationships[0]`, `archetype_plan.key_relationships[1]`, `archetype_plan.key_relationships[2]`, `archetype_plan.governing_constraint`
- T1 adds only verbatim high-value plan fields; Tier 2 shell unchanged

## Excluded (Tier 2 only)

- **X1** gam-partial.json materials: `unsupported_path` — partial/material-only; no required_materials on artefact
- **X2** RNA assembled vnext materials: `unsupported_path` — material-only assembled page; no source contract
- **X3** dla-mixed A1 ordinary row: `no_archetype` — required material without instructional_archetype / plan
- **X4** Ed Psych/Marx GAM materials alone: `unsupported_path` — GAM capture lacks required_materials; plans absent even on DLA join
