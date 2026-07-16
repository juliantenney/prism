/**
 * Sprint 65 S65-BL-002 — non-production fixture signal frequency scan.
 * Does not modify production code.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../../../..");
const FIXTURE_DIR = path.join(ROOT, "tests/fixtures/page-render");

const SAMPLE_SET = [
  "rna-hcv-assembled-vnext-materials-page.json",
  "ld-rna-hcv-assessment-page.json",
  "renderer-kitchen-sink-page.json",
  "marx-beat-render-page.json",
  "ld-inflation-workshop-page-full.json",
  "ld-climate-misconception-discussion-page.json",
  "self-directed-activity-framing-page.json",
  "shape-production-metadata.json"
];

const COGNITION_FIELDS = [
  "activity_preamble",
  "orienting_preamble",
  "activity_framing",
  "study_orientation",
  "intellectual_frame",
  "intellectual_coherence_bridge",
  "prior_knowledge_activation",
  "prior_knowledge_prompt",
  "disciplinary_lens",
  "reasoning_orientation",
  "reasoning_orientation_prompt",
  "evidence_use_prompt",
  "argument_structure_hint",
  "conceptual_contrast_prompt",
  "self_explanation_prompt",
  "transformation_activity",
  "source_to_application_prompt",
  "transfer_or_application_task",
  "scaffold_hint_sequence",
  "uncertainty_tension_prompt",
  "support_note",
  "support_notes"
];

const TASK_FIELDS = [
  "learner_task",
  "task",
  "instructions",
  "expected_output",
  "output",
  "deliverable",
  "artefact"
];

function hasText(v) {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    return Object.keys(v).some((k) => hasText(v[k]));
  }
  return true;
}

function firstNonEmpty(obj, keys) {
  for (const k of keys) {
    if (obj && hasText(obj[k])) return obj[k];
  }
  return null;
}

function getActivities(page) {
  if (Array.isArray(page.activities) && page.activities.length) return page.activities;
  const sections = Array.isArray(page.sections) ? page.sections : [];
  for (const sec of sections) {
    const id = String(sec.section_id || sec.id || "").toLowerCase();
    if (id === "learning_activities" || id === "activities") {
      const c = sec.content;
      if (Array.isArray(c)) return c;
      if (c && Array.isArray(c.activities)) return c.activities;
      if (c && Array.isArray(c.items)) return c.items;
    }
  }
  return [];
}

function materialEntries(activity) {
  const mats = activity.materials;
  if (!mats) return [];
  if (Array.isArray(mats)) {
    return mats.map((m, i) => ({
      key: String((m && (m.material_id || m.id || m.type)) || i),
      type: String((m && (m.material_type || m.type || m.kind)) || "").toLowerCase(),
      title: m && (m.title || m.name),
      instructional_function: m && m.instructional_function,
      plan_beat_index: m && (m.plan_beat_index != null ? m.plan_beat_index : m.beat_index),
      body: m && (m.body || m.content || m.text)
    }));
  }
  if (typeof mats === "object") {
    return Object.keys(mats)
      .filter((k) => !k.startsWith("_"))
      .map((k) => {
        const m = mats[k];
        const type =
          (mats._material_types && mats._material_types[k]) ||
          (m && (m.material_type || m.type || m.kind)) ||
          k;
        return {
          key: k,
          type: String(type || "").toLowerCase(),
          title: m && (m.title || m.name),
          instructional_function: m && m.instructional_function,
          plan_beat_index: m && (m.plan_beat_index != null ? m.plan_beat_index : m.beat_index),
          body: typeof m === "string" ? m : m && (m.body || m.content || m.text || m)
        };
      });
  }
  return [];
}

function pageHasSlot(page, slot) {
  if (hasText(page[slot])) return true;
  if (page.page_synthesis && hasText(page.page_synthesis[slot])) return true;
  const sections = Array.isArray(page.sections) ? page.sections : [];
  return sections.some((s) => {
    const id = String(s.section_id || s.id || "").toLowerCase().replace(/[\s-]+/g, "_");
    return id === slot && hasText(s.content != null ? s.content : s.body);
  });
}

function hasAssessment(page) {
  if (page.assessment_check && hasText(page.assessment_check)) return true;
  const sections = Array.isArray(page.sections) ? page.sections : [];
  return sections.some((s) => {
    const id = String(s.section_id || s.id || "").toLowerCase();
    return id === "assessment_check" || id === "assessment";
  });
}

function scan() {
  const pages = [];
  const activities = [];
  const materials = [];
  const archetypes = {};
  const materialTypes = {};
  const beatFunctions = {};

  for (const name of SAMPLE_SET) {
    const full = path.join(FIXTURE_DIR, name);
    const page = JSON.parse(fs.readFileSync(full, "utf8"));
    const acts = getActivities(page);
    const pageRec = {
      name,
      title: hasText(page.title || page.name),
      audience: hasText(page.audience),
      page_profile: hasText(page.page_profile),
      schema_version: hasText(page.schema_version),
      assembly_state: hasText(page.assembly_state),
      overview: pageHasSlot(page, "overview"),
      learning_purpose: pageHasSlot(page, "learning_purpose"),
      knowledge_summary: pageHasSlot(page, "knowledge_summary"),
      study_tips: pageHasSlot(page, "study_tips"),
      learning_outcomes: Array.isArray(page.learning_outcomes) && page.learning_outcomes.length > 0,
      learning_sequence: hasText(page.learning_sequence),
      assessment: hasAssessment(page),
      activity_count: acts.length
    };
    pages.push(pageRec);

    acts.forEach((a, idx) => {
      const arche =
        (a.episode_plan && a.episode_plan.archetype) ||
        a.archetype ||
        a.primary_archetype ||
        "";
      const archeKey = String(arche || "(none)").toLowerCase();
      archetypes[archeKey] = (archetypes[archeKey] || 0) + 1;

      const beats =
        (a.episode_plan && Array.isArray(a.episode_plan.beats) && a.episode_plan.beats) ||
        (Array.isArray(a.beats) ? a.beats : []);
      beats.forEach((b) => {
        const fn = String((b && (b.function || b.beat || b.id)) || "").toLowerCase();
        if (fn) beatFunctions[fn] = (beatFunctions[fn] || 0) + 1;
      });

      const cog = {};
      COGNITION_FIELDS.forEach((f) => {
        cog[f] = hasText(a[f]);
      });
      const task = {};
      TASK_FIELDS.forEach((f) => {
        task[f] = hasText(a[f]);
      });

      const mats = materialEntries(a);
      mats.forEach((m) => {
        const t = m.type || "(untyped)";
        materialTypes[t] = (materialTypes[t] || 0) + 1;
        materials.push({
          page: name,
          activity: a.activity_id || a.id || `idx-${idx}`,
          ...m,
          has_title: hasText(m.title),
          has_if: hasText(m.instructional_function),
          has_pbi: m.plan_beat_index != null && m.plan_beat_index !== "",
          has_body: hasText(m.body)
        });
      });

      activities.push({
        page: name,
        activity_id: a.activity_id || a.id || `idx-${idx}`,
        title: hasText(a.title || a.activity_title || a.name),
        archetype: archeKey,
        has_episode_plan: !!(a.episode_plan && typeof a.episode_plan === "object"),
        beat_count: beats.length,
        duration: hasText(a.duration_minutes || a.duration || a.minutes),
        grouping: hasText(a.grouping || a.group_size || a.grouping_mode),
        mapped_los: Array.isArray(a.mapped_learning_outcomes) && a.mapped_learning_outcomes.length > 0,
        learner_task: !!(firstNonEmpty(a, ["learner_task", "task", "instructions"])),
        expected_output: !!(firstNonEmpty(a, ["expected_output", "output", "deliverable", "artefact"])),
        material_count: mats.length,
        ...Object.fromEntries(Object.entries(cog).map(([k, v]) => [`cog_${k}`, v])),
        ...Object.fromEntries(Object.entries(task).map(([k, v]) => [`task_${k}`, v]))
      });
    });
  }

  function pageFreq(key) {
    const n = pages.filter((p) => p[key]).length;
    return `${n}/${pages.length} pages`;
  }
  function actFreq(pred) {
    const n = activities.filter(pred).length;
    return `${n}/${activities.length} activities`;
  }
  function matFreq(pred) {
    const n = materials.filter(pred).length;
    return `${n}/${materials.length} materials`;
  }

  const cognitionFreq = {};
  COGNITION_FIELDS.forEach((f) => {
    cognitionFreq[f] = actFreq((a) => a[`cog_${f}`]);
  });

  const out = {
    sample_set: SAMPLE_SET,
    denominators: {
      pages: pages.length,
      activities: activities.length,
      materials: materials.length
    },
    page_presence: {
      title: pageFreq("title"),
      audience: pageFreq("audience"),
      page_profile: pageFreq("page_profile"),
      schema_version: pageFreq("schema_version"),
      assembly_state: pageFreq("assembly_state"),
      overview: pageFreq("overview"),
      learning_purpose: pageFreq("learning_purpose"),
      knowledge_summary: pageFreq("knowledge_summary"),
      study_tips: pageFreq("study_tips"),
      learning_outcomes: pageFreq("learning_outcomes"),
      learning_sequence: pageFreq("learning_sequence"),
      assessment: pageFreq("assessment")
    },
    activity_presence: {
      title: actFreq((a) => a.title),
      episode_plan: actFreq((a) => a.has_episode_plan),
      duration: actFreq((a) => a.duration),
      grouping: actFreq((a) => a.grouping),
      mapped_los: actFreq((a) => a.mapped_los),
      learner_task: actFreq((a) => a.learner_task),
      expected_output: actFreq((a) => a.expected_output)
    },
    cognition_presence: cognitionFreq,
    material_presence: {
      has_title: matFreq((m) => m.has_title),
      instructional_function: matFreq((m) => m.has_if),
      plan_beat_index: matFreq((m) => m.has_pbi),
      has_body: matFreq((m) => m.has_body)
    },
    archetypes,
    beat_functions: beatFunctions,
    material_types: materialTypes,
    pages,
    activities_summary: activities.map((a) => ({
      page: a.page,
      activity_id: a.activity_id,
      archetype: a.archetype,
      beats: a.beat_count,
      materials: a.material_count,
      learner_task: a.learner_task,
      expected_output: a.expected_output,
      preamble: a.cog_activity_preamble || a.cog_orienting_preamble || a.cog_activity_framing,
      reasoning: a.cog_reasoning_orientation || a.cog_reasoning_orientation_prompt,
      bridge: a.cog_intellectual_coherence_bridge,
      self_explanation: a.cog_self_explanation_prompt,
      transfer: a.cog_transfer_or_application_task,
      transformation: a.cog_transformation_activity
    }))
  };

  const outPath = path.join(__dirname, "signal-inventory-frequency.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ wrote: outPath, denominators: out.denominators }, null, 2));
  console.log("page_presence", out.page_presence);
  console.log("activity_presence", out.activity_presence);
  console.log("archetypes", out.archetypes);
  console.log("material_types", out.material_types);
  console.log("cognition (selected)", {
    activity_preamble: cognitionFreq.activity_preamble,
    reasoning_orientation: cognitionFreq.reasoning_orientation,
    intellectual_coherence_bridge: cognitionFreq.intellectual_coherence_bridge,
    self_explanation_prompt: cognitionFreq.self_explanation_prompt,
    transfer_or_application_task: cognitionFreq.transfer_or_application_task,
    transformation_activity: cognitionFreq.transformation_activity
  });
}

scan();
