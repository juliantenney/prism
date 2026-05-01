# PRISM – Explainer & Design Rationale

## Why this exists

PRISM was created to solve a very specific problem:

> AI can generate outputs, but it does not reliably generate *well-designed processes*.

In domains like instructional design, the quality of the *process* matters more than the output. A quiz, lesson, or activity is only as good as the thinking behind it.

PRISM captures that thinking.

It turns:

* tacit expertise
* best practice
* design judgement

into something that can be:

* structured
* reused
* executed

---

## What PRISM actually is

PRISM is:

> **a system for generating and executing structured workflows using AI**

Each workflow:

* takes an input (e.g. transcript, document)
* processes it through multiple steps
* produces structured outputs (artefacts)

Each step is driven by:

* a prompt
* defined inputs
* defined outputs

---

## The key shift

Most AI use looks like this:

> Input → Prompt → Output

PRISM changes that to:

> Input → Workflow → Multiple Steps → Structured Artefacts → Output

This is a fundamental shift from:

* generating answers
  to
* generating *processes*

---

## The three-layer model

PRISM works because it separates concerns into three layers.

---

### 1. Platform Layer (How it works)

This defines the mechanics of workflows.

It includes:

* the JSON structure
* how steps are connected
* how prompts are defined
* how artefacts flow

This layer answers:

> “What is a valid workflow?”

---

### 2. Domain Layer (What good looks like)

This defines expertise.

For pedagogy, it includes:

* instructional design principles
* canonical artefacts (e.g. knowledge_model)
* standard step patterns (e.g. Model Knowledge)
* prompt rules

This layer answers:

> “What does good design look like?”

---

### 3. Task Layer (What we want now)

This is the user’s intent.

Examples:

* create a quiz
* build a lesson
* generate activities

This layer answers:

> “What should this workflow do?”

---

## The system in one sentence

> **Intent + Domain Knowledge + Platform Rules → Workflow**

---

## The role of artefacts

Artefacts are the most important concept in PRISM.

Examples:

* normalized_content
* knowledge_model
* learning_outcomes
* assessment_blueprint

They are:

* the outputs of steps
* the inputs to other steps

They act as:

> **the API between steps**

This makes workflows:

* composable
* reusable
* inspectable

---

## Why workflows are broken into steps

Each step represents a meaningful transformation.

For example:

* Normalize Content → clean and structure input
* Model Knowledge → extract concepts and relationships
* Design Assessment → generate questions

This separation:

* improves clarity
* improves quality
* allows reuse

---

## Why the domain pack matters

Without a domain pack, AI relies on general knowledge.

With a domain pack, you define:

* what principles to follow
* what artefacts to produce
* what steps to include
* how prompts should behave

This means:

> the system produces consistent, expert-level outputs

---

## What has been created

At this point, PRISM includes:

### Platform

* workflow specification
* authoring guidance
* generation template
* pattern library

### Pedagogy domain pack

* principles
* artefacts
* step patterns
* prompt rules

Together, these form:

> **a complete system for generating pedagogically sound workflows**

---

## How it is used

1. A user provides an intent
   e.g. “create a quiz from a transcript”

2. The system provides:

   * platform rules
   * domain pack
   * task brief

3. The AI generates a workflow bundle (JSON)

4. The workflow is executed step-by-step

5. Outputs are produced

---

## What makes this powerful

PRISM enables:

### 1. Consistency

Workflows follow the same rules and patterns.

### 2. Reuse

Artefacts and steps can be reused across workflows.

### 3. Scalability

Expertise can be applied across many contexts.

### 4. Transparency

Each step and output can be inspected.

---

## What this is not

PRISM is not:

* a single prompt
* a content generator
* a black box

It is:

> a structured system for reasoning and transformation

---

## The deeper insight

PRISM effectively acts as:

> **a compiler for domain expertise**

Where:

* domain knowledge = rules
* workflows = programs
* prompts = execution logic
* artefacts = data structures

---

## What happens next

From here, the system can be extended by:

* adding more domain packs
* creating reusable core workflows
* building gold-standard examples
* refining prompts and patterns

---

## Final reflection

This moment represents a shift from:

> using AI to generate outputs

to:

> using AI to generate *well-designed processes*

That is what makes PRISM valuable.

It captures how experts think — and makes that thinking reusable.
