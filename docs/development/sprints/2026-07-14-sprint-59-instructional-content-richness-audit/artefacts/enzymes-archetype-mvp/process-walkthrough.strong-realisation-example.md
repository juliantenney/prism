# Process walkthrough — strong realisation example (enzyme fixture)

Reference body demonstrating desired GAM realisation after the process_walkthrough rule refinement.  
Generated from `process-walkthrough.required-material.json` / `ENZYMES_PROCESS_TEST_PLAN`.  
Not a live model capture — a target-shape exemplar for review.

**process_goal:** interpret an enzyme reaction-rate investigation

---

Learners often know the stages of interpreting an investigation but skip how each stage actually changes what they know. Work through this enzyme reaction-rate example so every step of the reasoning stays visible.

### Stage 1 — Identify the manipulated condition and measured outcome

**What is being examined:**  
The investigation’s independent and dependent variables before any pattern talk begins.

**Reasoning demonstrated:**  
The investigation varies **temperature** of the enzyme mixture while holding enzyme amount, substrate amount, and pH fixed. The recorded outcome is **reaction rate** (for example, product formed per minute, or time for a visible colour change).

**Result of this reasoning:**  
Manipulated condition = temperature. Measured outcome = reaction rate. Nothing else has been interpreted yet.

**Transition:**  
With the variables named, the next job is to look at how rate changes across the temperature observations — not to invent a mechanism yet.

### Stage 2 — Inspect the pattern across observations

**What is being examined:**  
The trend in reaction-rate results as temperature changes.

**Reasoning demonstrated:**  
Reading across the data set, rate rises through the moderate temperatures, reaches a highest value in a central band, then falls sharply at the hottest conditions. The pattern is therefore biphasic: increase → peak → decrease — not a simple “hotter is always faster.”

**Result of this reasoning:**  
Observed pattern: reaction rate first increases with temperature, then decreases at high temperature.

**Transition:**  
The pattern is established from the data. The next stage must explain that pattern in terms of enzyme behaviour, not just restate the numbers.

### Stage 3 — Connect the pattern to enzyme behaviour

**What is being examined:**  
How enzyme activity can produce the biphasic temperature–rate pattern.

**Reasoning demonstrated:**  
In the rising limb, higher temperature increases molecular motion and effective collision frequency between enzyme and substrate, so more productive enzyme–substrate encounters occur per unit time and rate rises. Beyond the peak, further heating disrupts the enzyme’s three-dimensional structure; as the active site shape is lost, fewer successful complexes form and rate falls even though collisions are more energetic.

**Result of this reasoning:**  
The increase is linked to kinetic acceleration of enzyme–substrate encounters; the decrease is linked to heat-driven loss of functional enzyme structure.

**Transition:**  
The causal reading of the pattern is in place. The final stage must state a conclusion that stays within what this investigation can support.

### Stage 4 — Form a bounded conclusion

**What is being examined:**  
What claim can legitimately be drawn from this evidence set.

**Reasoning demonstrated:**  
From the identified variables, the biphasic pattern, and the enzyme-behaviour link, the investigation supports: within the tested range, warming speeds the enzyme-catalysed reaction up to an optimum, after which further heating reduces rate as enzyme structure is compromised. The conclusion should not claim a precise numerical optimum for all enzymes or all conditions not tested here.

**Result of this reasoning:**  
Bounded conclusion: for this enzyme reaction-rate investigation, temperature first increases then decreases reaction rate; the rise is consistent with increased collision frequency, and the fall with structural disruption at high temperature, within the conditions recorded.

**Transition:**  
The process goal is met: the investigation has been interpreted as a continuous reasoning path from variables → pattern → enzyme behaviour → bounded claim, not as a checklist of stage labels.

---

## Checklist of stage coverage (review gate)

| Fixture stage | Present as distinct section | Examine / reason / result / transition |
| ------------- | --------------------------- | -------------------------------------- |
| identify the manipulated condition and measured outcome | yes | yes |
| inspect the pattern across observations | yes | yes |
| connect the pattern to enzyme behaviour | yes | yes |
| form a bounded conclusion | yes | yes |
| collapsed checklist-only body | no | — |
