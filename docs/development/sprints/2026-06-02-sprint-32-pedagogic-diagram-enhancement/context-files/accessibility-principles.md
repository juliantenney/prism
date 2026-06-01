# Accessibility principles — Sprint 32 figures

**Status:** Programme requirements for all embedded visuals  
**Applies when:** Slice 32-4+ implemented

---

## Non-negotiable requirements

Every embedded figure in self-contained learner HTML must provide:

| Requirement | Implementation guidance |
|-------------|---------------------------|
| **Alt text** | Concise; describes pedagogic content, not “image of diagram” |
| **Caption** | Visible `<figcaption>` when figure is referenced in flow |
| **Semantic structure** | `<figure>` wrapping `img` (or accessible SVG if chartered) + caption |
| **Non-colour-only signalling** | Patterns, labels, or legends for colour-encoded meaning |
| **Screen-reader compatibility** | No information only in untagged graphics; avoid image-only instructions |

---

## Alt text guidelines

**Good:** “Diagram of HCV replication cycle showing entry, translation, and assembly with host ribosome labelled.”

**Poor:** “Diagram.” / “Figure 1.” / “See image.”

Alt text should reflect **what the learner must understand**, aligned with the activity’s pedagogic purpose — without rewriting the full lesson.

---

## Captions

- Captions **add** context (source, scale, caveat); they do not replace alt text.  
- Use learner-facing language; avoid developer jargon (`artefact_id`, model names).  
- If the figure is **Essential** tier, caption may reference the activity task briefly.

---

## Colour and contrast

| Rule | Detail |
|------|--------|
| **WCAG-minded contrast** | Text and key lines readable on projected slides |
| **Dual encoding** | Colour + shape/label for categories |
| **Colour-blind safe palettes** | Avoid red/green-only distinctions for critical paths |

---

## Motion and interaction

- **No autoplay** video/GIF in default learner export unless essential and user-controllable.  
- Animated diagrams: provide static fallback or `prefers-reduced-motion` respect (slice charter detail).

---

## Assessment figures

Figures in assessment sections are **high risk**:

- Must not introduce **new** information absent from stem/options.  
- Alt text must not **leak** answers for MCQ items.  
- Prefer placing supporting diagrams in **materials** before assessment when possible.

---

## Validation checklist (per export)

- [ ] Every `img` has meaningful `alt`  
- [ ] Figures use `<figure>` / `<figcaption>` where captions shown  
- [ ] Keyboard / screen reader order matches visual reading order  
- [ ] Self-contained HTML opens offline with figures visible  
- [ ] No information conveyed by colour alone  

---

## Relationship to Sprint 31

Sprint 31 improved **hierarchy and calmness** of text blocks. Sprint 32 must not introduce figures that **compete** with `.util-activity-task--primary` or assessment prompts for visual dominance.
