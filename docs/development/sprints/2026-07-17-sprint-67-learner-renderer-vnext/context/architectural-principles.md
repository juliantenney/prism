# Architectural Principles — Sprint 67

Binding constraints for all Sprint 67 implementation work.

1. **Deterministic pipeline** — `PRISM JSON → validated learner-page view model → HTML`.  
2. **Single canonical page model** — one intermediate representation; one render path.  
3. **No parallel beat planners** — no compose/registry dual emit.  
4. **No heuristic beat scoring** — no English keyword assignment.  
5. **No activity-specific mappings** — rules are archetype/beat-sequence declarative.  
6. **No post-render content insertion** — expected output and materials owned in the model.  
7. **No material-consumption flag machines** for association.  
8. **Render from view model only** — render functions must not re-read source JSON.  
9. **Empty beats omitted** — `hasLearnerFacingContent` is the emit gate.  
10. **Explicit ownership** — every task step, prompt, material, and expected output has exactly one owner beat when assigned.  
11. **Hard errors on ambiguity** — unassigned / multiply assigned materials fail validation with diagnostics.  
12. **Legacy coexistence** — feature flag; default legacy; exclusive paths.  
13. **CSS is presentation, not association** — no `order` / hide-to-fix-structure.

Violating these requires a written decision and charter amendment — not a silent patch.
