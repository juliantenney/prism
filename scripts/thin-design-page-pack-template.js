const fs = require("fs");
const path = require("path");
const mdPath = path.join(
  __dirname,
  "..",
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const md = fs.readFileSync(mdPath, "utf8");
const m = md.match(
  /## 13\. Design Page[\s\S]*?### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/
);
if (!m) throw new Error("Design Page Prompt Factory not found");
const factory = JSON.parse(m[1].trim());
const oldLen = factory.promptTemplate.length;
factory.promptTemplate = [
  "Context:",
  "You are provided with learning_outcomes, learning_activities, activity_materials, episode_plans (when the workflow includes Design Episode Plan), and may also receive learning_sequence, learning_content, knowledge_model, assessment_items, feedback_pack, marking_rubric, and assessment_blueprint.",
  "",
  "Task:",
  "Assemble one readable, self-contained page artefact with artifact_type = page.",
  "",
  "Instructions:",
  "- Read-only composition step — assemble section structure, headings, ordering, and wrapper prose from upstream artefacts; do not redesign pedagogy",
  "- Treat workflow goal, desired outputs, and step notes as hard constraints (component types, quantities, exclusions)",
  "- Set page_profile using {{option:page_profile}}; include audience; ground sections in provided upstream artefacts only; exclude unsupported content",
  "- Page JSON must be self-contained for downstream rendering",
  "- Runtime canonical authorities (obey all appended blocks): LD-DESIGN-PAGE-COMPOSE-CONTRACT (activity membership, materials fidelity via embedded LD-MATERIALS-COPY and LD-TABLE-FIDELITY preserve roles, field preservation, portable episode_plans schema); LD-JOURNEY-ASSIMILATION and LD-SELF-DIRECTED-RHETORIC when learner page_profile; Sprint 38 visual affordance contract (schema 38.4); LD-MATH-RENDER",
  "- Use meaningful section headings; avoid schema-style labels in learner-facing content",
  "- Coherent section ordering: overview, learning purpose/outcomes, knowledge_summary when LC/KM bound, learning activities, assessment check, support notes as applicable",
  "- learning_activities.content MUST be an array of activity objects with structured materials.<field> objects — not labels-only references",
  "- If assessment_items present: Formative Assessment Check with assessment_check.content.items[]; MCQ stems and options; respect include_answers, include_marking_guidance, include_feedback_guidance options",
  "- If learning_sequence present: use timeline for activity order/timing only",
  "- Record non-material constraint gaps in generation_notes.limitations — never excuse material-body loss (compose contract governs)",
  "- Apply step notes: {{stepNotes}}",
  "",
  "Output:",
  '- Return {{preferredOutputFormat}} only — JSON object: artifact_type page, title, audience, page_profile, sections[], episode_plans (when upstream provided), source_artefacts, constraints_applied, visual_affordance_schema_version "38.4", activities_visual_review[], visual_affordances[], generation_notes',
  "- Learner profile: substantive overview/learning_purpose, knowledge_summary when bound, full activity-linked materials (not placeholder-only)",
  "- Facilitator profile: run guidance and facilitation/logistics notes",
  "- Assessment profile: structured items section — do not flatten to prose",
  "- Record generation_notes.activities_omitted[] with activity_id, title, reason, authority for intentional omissions"
].join("\n");
factory.defaultPromptNotes =
  "Assemble one profile-aware self-contained page; strict JSON sections[] (section_id, heading, content). Canonical section_ids when applicable: overview, learning_purpose, knowledge_summary, learning_activities, assessment_check, support_notes. LD-DESIGN-PAGE-COMPOSE-CONTRACT at runtime owns membership, materials fidelity (embedded LD-MATERIALS-COPY / LD-TABLE-FIDELITY preserve roles), field preservation, and portable episode_plans schema. Learner page_profile: LD-JOURNEY-ASSIMILATION, LD-SELF-DIRECTED-RHETORIC, LD-GUIDED-LEARNING-SCAFFOLD compose preservation. Visual affordances: Sprint 38 runtime (schema 38.4). Maths: LD-MATH-RENDER.";
const newJson = JSON.stringify(factory, null, 2);
const newMd = md.replace(m[0], m[0].replace(m[1], "\n" + newJson + "\n"));
fs.writeFileSync(mdPath, newMd);
console.log(
  JSON.stringify({ oldTemplateChars: oldLen, newTemplateChars: factory.promptTemplate.length })
);
