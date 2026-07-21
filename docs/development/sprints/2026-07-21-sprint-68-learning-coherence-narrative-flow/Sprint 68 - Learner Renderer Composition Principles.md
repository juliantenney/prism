# Sprint 68 – Learner Renderer Composition Principles

## Purpose

Sprint 68 marks a transition in the evolution of the learner renderer.

Previous sprints focused on reliably exposing authoritative instructional content. That objective has now largely been achieved. The renderer faithfully presents the artefacts produced by the instructional pipeline, and the pipeline itself demonstrates a clear separation of concerns.

The objective of Sprint 68 is therefore different.

The goal is no longer to improve the instructional content.

The goal is to improve how authoritative instructional content is experienced by learners.

This document establishes the rendering principles that should guide the sprint.

---

# Architectural Principle

> **The instructional pipeline authors. The renderer composes.**

The renderer must never invent pedagogy, learning objectives, explanations, or instructional reasoning that are not present in authoritative artefacts.

Rendering is not serialisation.

Rendering requires the composition of multiple authoritative pedagogical objects into a coherent learner experience.

The renderer therefore has responsibility for presentation, sequencing, grouping, emphasis, and learner flow.

---

# Findings

A review of the complete instructional pipeline (Episode Plan → DLA → GAM → Learning Sequence → Assessment → Renderer) showed that each upstream stage is performing its intended responsibility well.

* Episode Planning defines instructional structure.
* Design Learning Activities defines pedagogical intent.
* Generate Activity Materials realises instructional resources.
* Learning Sequence defines lesson progression.
* Assessment validates achievement.

The rendered learner page is the first artefact that combines all of these simultaneously.

Most observed weaknesses therefore originate during **composition**, not **content generation**.

---

# Validation of the Authoring Pipeline

As part of Sprint 68, the complete authoring pipeline was reviewed to determine whether the observed learner experience issues originated in instructional generation or final presentation.

The review covered:

* Episode Plan
* Design Learning Activities
* Generate Activity Materials
* Assessment Items
* Learning Sequence
* Design Page

The review concluded that the authoring pipeline is mature, semantically rich, and operating as intended.

Each stage has a clear responsibility, contributes instructional information that was not available to earlier stages, and produces artefacts that are internally coherent.

* Episode Plan provides instructional architecture and beat progression.
* Design Learning Activities provides pedagogical intent, learner actions, reasoning orientation, and expected outputs.
* Generate Activity Materials provides faithful instructional realisation and supporting resources.
* Assessment Items provides outcome-aligned checks of learner understanding.
* Learning Sequence provides cognitive progression, activity purpose, study phases, and capstone structure.
* Design Page provides page-level synthesis that can only be produced once the preceding instructional information is available.

The review did not identify a need to redesign, simplify, or materially extend the authoring pipeline for Sprint 68.

Instead, it demonstrated that most learner experience issues arise when the rich outputs of the pipeline are composed into the final rendered lesson.

This is a positive architectural finding.

It validates the substantial investment made in the pipeline and confirms that the system has reached the intended level of maturity: the pipeline already authors rich and coherent pedagogy.

Sprint 68 should therefore focus on unlocking the value of those existing semantics through better renderer composition, while preserving the pipeline and its separation of concerns.

A useful summary is:

> **The pipeline is not the constraint. The pipeline is the asset Sprint 68 should now fully exploit.**

---

# Core Principles

## 1. Render learner experience rather than artefacts

The renderer should answer:

> *What should I do now?*

rather than

> *What object comes next?*

Instructional artefacts are implementation structures.

Learner activities are educational experiences.

---

## 2. Compose activity entry

Activity introductions are currently assembled from several pedagogically distinct components, including:

* activity preamble
* reasoning orientation
* self-explanation prompt
* opening beat

These should be experienced as one coherent instructional introduction rather than multiple independent sections.

The goal is fewer visible restarts—not fewer pedagogical ideas.

---

## 3. Make learner work explicit

Whenever the instructional design expects learners to produce work—explaining, comparing, evaluating, writing, completing a table, making a judgement—the rendered page should make that activity obvious.

Learners should never have to wonder:

* *When do I do this?*
* *Where does my answer go?*

Learning resources should host learning, not merely describe it.

---

## 4. Preserve pedagogical distinctions

Fields such as:

* activity_preamble
* reasoning_orientation
* self_explanation_prompt

exist because they serve different educational purposes.

Those distinctions should remain.

The renderer should compose them into a single instructional conversation rather than exposing them as unrelated visual blocks.

---

## 5. Reveal lesson narrative

The Learning Sequence already defines the narrative of the lesson through:

* study phases
* activity purposes
* progression logic
* capstone structure

The renderer should reveal this narrative rather than presenting activities as isolated exercises.

---

## 6. Distinguish reading from doing

Learners should be able to recognise whether they are expected to:

* read
* observe
* reflect
* produce
* verify

Transitions between these modes should be explicit.

---

## 7. Compose vertically

Within each activity the renderer should compose:

* introductory framing
* instructional beats
* learner tasks
* worked examples
* independent work
* expected outputs
* verification

into one continuous learner experience.

---

## 8. Compose horizontally

Across activities the renderer should maintain continuity.

Each activity should help learners understand:

* where they have come from;
* what they have just achieved;
* why the next activity matters.

---

## 9. Prefer existing semantics

Sprint 68 should first exploit semantics already authored by the pipeline before introducing new generated content.

Examples include:

* study phases
* activity purposes
* learner tasks
* reasoning orientations
* expected outputs
* coherence bridges
* instructional archetypes

---

## 10. Separate semantics from presentation

The instructional pipeline defines educational meaning.

The renderer defines educational experience.

Renderer improvements should primarily come from better composition of existing semantics rather than additional authoring.

---

# Renderer Responsibilities

Sprint 68 establishes the learner renderer as responsible for:

* composing pedagogical objects into coherent learner moments;
* making learner actions explicit;
* preserving lesson continuity;
* revealing instructional progression;
* reducing presentation fragmentation;
* improving cognitive flow while preserving authoritative content.

---

# Non-Goals

Sprint 68 does **not** seek to:

* rewrite instructional content;
* generate new pedagogy;
* redesign learning outcomes;
* redesign assessment;
* duplicate responsibilities already owned by upstream pipeline stages.

---

# Success Criteria

Sprint 68 will be successful when learners experience the rendered lesson as a coherent instructional journey rather than a sequence of independently rendered artefacts.

The instructional pipeline should remain unchanged.

The improvement should arise from better composition, not additional content generation.

A useful shorthand for Sprint 68 is:

> **The pipeline authors. The renderer composes.**
