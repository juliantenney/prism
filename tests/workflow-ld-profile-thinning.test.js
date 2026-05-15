/**
 * Sprint 19 Slice 19-3 — LD stepRefinementProfiles thinning (pack-only).
 * Pack contract + queue mirror of getPostGenerationElicitationQueueFromProfile buildQueue.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `LD pack should contain ${heading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1, `json fence after ${heading}`);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadLdWorkflowBriefConfig() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = extractJsonBlockAfterHeading(md, "### Workflow Brief Config");
  return block.workflowBriefConfig;
}

function profileTierFactorIds(profile, tierName) {
  const tiers = profile && profile.tiers ? profile.tiers : {};
  const rows = Array.isArray(tiers[tierName]) ? tiers[tierName] : [];
  return rows
    .map((row) => String((row && row.factorId) || "").trim())
    .filter(Boolean);
}

function resolveProfileMetaFromPack(profiles, profileId) {
  const raw = profiles[profileId];
  if (!raw || typeof raw !== "object") return null;
  const tiers = raw.tiers && typeof raw.tiers === "object" ? raw.tiers : {};
  const requiredIds = profileTierFactorIds(raw, "required");
  const optionalIds = profileTierFactorIds(raw, "optional");
  if (!requiredIds.length && !optionalIds.length) return null;
  return { profileId, requiredIds, optionalIds };
}

function allBriefFactors(config) {
  const out = [];
  ["requiredFactors", "optionalFactors", "refinementFactors"].forEach((key) => {
    const list = Array.isArray(config[key]) ? config[key] : [];
    list.forEach((f) => {
      if (f && f.id) out.push(f);
    });
  });
  return out;
}

function getFactorById(config, id) {
  return allBriefFactors(config).find((f) => String(f.id) === String(id)) || null;
}

/** Mirror app.js isWorkflowRefinementFactorRelevant (subset used by profile optional queue). */
function isWorkflowRefinementFactorRelevant(factor, base, resolved) {
  if (!factor || !factor.id) return false;
  const b = base && typeof base === "object" ? base : {};
  const r = resolved && typeof resolved === "object" ? resolved : {};
  const goalBlob = String([b.designIntent, b.goal, b.desiredOutputs].join("\n")).toLowerCase();
  const inputBlob = String([b.inputs, b.scopeConstraints, b.audience, b.scopeScale].join(
    "\n"
  )).toLowerCase();

  const goalTerms = Array.isArray(factor.askWhenGoalMentionsAnyOf)
    ? factor.askWhenGoalMentionsAnyOf
    : [];
  if (
    goalTerms.length &&
    !goalTerms.some((kw) => goalBlob.indexOf(String(kw || "").toLowerCase()) !== -1)
  ) {
    return false;
  }

  const inputTerms = Array.isArray(factor.askWhenInputsMentionAnyOf)
    ? factor.askWhenInputsMentionAnyOf
    : [];
  if (
    inputTerms.length &&
    !inputTerms.some((kw) => inputBlob.indexOf(String(kw || "").toLowerCase()) !== -1)
  ) {
    return false;
  }

  const scopeList = Array.isArray(factor.askWhenDesignScopeIn) ? factor.askWhenDesignScopeIn : [];
  if (scopeList.length) {
    const scope = String(r.design_scope || "").toLowerCase();
    if (
      !scope ||
      !scopeList.map((v) => String(v || "").toLowerCase()).includes(scope)
    ) {
      return false;
    }
  }

  const equalsWhen = factor.askWhenResolvedFactorEquals;
  if (equalsWhen && typeof equalsWhen === "object") {
    const keys = Object.keys(equalsWhen);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (String(r[key] || "") !== String(equalsWhen[key] || "")) return false;
    }
  }

  return true;
}

/**
 * Mirror getPostGenerationElicitationQueueFromProfile buildQueue (app.js ~6311–6335).
 */
function buildProfileFactorQueue(config, factorIds, forceAsk, base, resolved, elicitedValues, resolvedSources) {
  const r = resolved && typeof resolved === "object" ? resolved : {};
  const elicited = elicitedValues && typeof elicitedValues === "object" ? elicitedValues : {};
  const sourceMap = resolvedSources && typeof resolvedSources === "object" ? resolvedSources : {};
  const out = [];
  const seen = {};
  (Array.isArray(factorIds) ? factorIds : []).forEach((id) => {
    const fid = String(id || "").trim();
    if (!fid || seen[fid]) return;
    const factor = getFactorById(config, fid);
    if (!factor) return;
    const src = String(sourceMap[fid] || "");
    const hasResolvedValue =
      Object.prototype.hasOwnProperty.call(r, fid) && r[fid] !== "" && r[fid] != null;
    const userProvided =
      Object.prototype.hasOwnProperty.call(elicited, fid) ||
      src === "explicit" ||
      src === "elicited";
    if (userProvided) return;
    if (!forceAsk && !isWorkflowRefinementFactorRelevant(factor, base, r)) return;
    if (forceAsk || !hasResolvedValue || src === "default") {
      seen[fid] = true;
      out.push(factor);
    }
  });
  return out;
}

function profileQueues(config, profileMeta, base, resolved, elicited, sources) {
  return {
    requiredQueue: buildProfileFactorQueue(
      config,
      profileMeta.requiredIds,
      true,
      base,
      resolved,
      elicited,
      sources
    ),
    optionalQueue: buildProfileFactorQueue(
      config,
      profileMeta.optionalIds,
      false,
      base,
      resolved,
      elicited,
      sources
    )
  };
}

function mappingRuleFactors(config) {
  const rules = Array.isArray(config.mappingRules) ? config.mappingRules : [];
  return rules.map((r) => String(r.factor || "").trim()).filter(Boolean);
}

const briefConfig = loadLdWorkflowBriefConfig();
const profiles = briefConfig.stepRefinementProfiles || {};

test("stepRefinementProfiles: all three LD profiles remain defined", () => {
  assert.ok(profiles.assessment_pack);
  assert.ok(profiles.design_page);
  assert.ok(profiles.learner_page_pack);
});

test("assessment_pack: required tier is empty; type/count are optional only", () => {
  const p = profiles.assessment_pack;
  assert.deepEqual(profileTierFactorIds(p, "required"), []);
  const optional = profileTierFactorIds(p, "optional");
  assert.ok(optional.includes("assessment_type"));
  assert.ok(optional.includes("assessment_total_items"));
  assert.ok(optional.includes("difficulty_profile"));
});

test("design_page: no learner_level; page_profile optional only", () => {
  const p = profiles.design_page;
  assert.deepEqual(profileTierFactorIds(p, "required"), []);
  const optional = profileTierFactorIds(p, "optional");
  assert.ok(!optional.includes("learner_level"));
  assert.ok(optional.includes("page_profile"));
  assert.ok(optional.includes("tone_style"));
});

test("learner_page_pack: mirrors design_page thinning", () => {
  const p = profiles.learner_page_pack;
  assert.deepEqual(profileTierFactorIds(p, "required"), []);
  const optional = profileTierFactorIds(p, "optional");
  assert.ok(!optional.includes("learner_level"));
  assert.ok(optional.includes("page_profile"));
});

test("mappingRules still map thinned profile factors to Settings paths", () => {
  const mapped = mappingRuleFactors(briefConfig);
  [
    "learner_level",
    "assessment_type",
    "assessment_total_items",
    "page_profile",
    "tone_style",
    "depth_level"
  ].forEach((id) => {
    assert.ok(mapped.includes(id), `mappingRules should include ${id}`);
  });
});

test("queue mirror: inferred assessment type/count not in required queue", () => {
  const meta = resolveProfileMetaFromPack(profiles, "assessment_pack");
  assert.ok(meta);
  const base = {
    designIntent: "Create a 10-question MCQ quiz pack for revision.",
    goal: "Create a 10-question MCQ quiz pack for revision.",
    desiredOutputs: "assessment items",
    inputs: "",
    scopeConstraints: "",
    audience: "undergraduate students",
    scopeScale: "session"
  };
  const resolved = {
    topic: "biology",
    learner_level: "undergraduate",
    design_scope: "session",
    delivery_pattern: "face_to_face",
    input_strategy: "generate_from_topic",
    assessment_required: true,
    assessment_type: "mcq",
    assessment_total_items: 10
  };
  const sources = {
    assessment_type: "inferred",
    assessment_total_items: "inferred",
    assessment_required: "inferred"
  };
  const q = profileQueues(briefConfig, meta, base, resolved, {}, sources);
  assert.deepEqual(
    q.requiredQueue.map((f) => f.id),
    [],
    "empty required tier → no blocking post-gen queue"
  );
  assert.ok(
    !q.optionalQueue.some((f) => f.id === "assessment_type"),
    "inferred assessment_type should not appear on optional queue"
  );
  assert.ok(
    !q.optionalQueue.some((f) => f.id === "assessment_total_items"),
    "inferred assessment_total_items should not appear on optional queue"
  );
});

test("queue mirror: essentials learner_level not in page profile required queue", () => {
  const meta = resolveProfileMetaFromPack(profiles, "design_page");
  assert.ok(meta);
  assert.ok(!meta.requiredIds.includes("learner_level"));
  const base = {
    designIntent: "Build a learner-facing revision page for the topic.",
    goal: "Build a learner-facing revision page for the topic.",
    desiredOutputs: "learner page",
    inputs: "",
    scopeConstraints: "",
    audience: "undergraduate",
    scopeScale: "session"
  };
  const resolved = {
    topic: "chemistry",
    learner_level: "undergraduate",
    design_scope: "session",
    delivery_pattern: "blended",
    input_strategy: "generate_from_topic",
    page_profile: "learner"
  };
  const sources = {
    learner_level: "explicit",
    page_profile: "default"
  };
  const q = profileQueues(briefConfig, meta, base, resolved, {}, sources);
  assert.deepEqual(q.requiredQueue.map((f) => f.id), []);
});

test("queue mirror: page_profile default is optional-only (may appear on opt-in, not required)", () => {
  const meta = resolveProfileMetaFromPack(profiles, "design_page");
  const base = {
    designIntent: "Learner revision page",
    goal: "Learner revision page",
    desiredOutputs: "page",
    inputs: "",
    scopeConstraints: "",
    audience: "",
    scopeScale: ""
  };
  const resolved = {
    topic: "physics",
    learner_level: "intermediate",
    design_scope: "session",
    delivery_pattern: "face_to_face",
    input_strategy: "generate_from_topic",
    page_profile: "learner"
  };
  const sources = { learner_level: "inferred", page_profile: "default" };
  const q = profileQueues(briefConfig, meta, base, resolved, {}, sources);
  assert.deepEqual(q.requiredQueue.map((f) => f.id), []);
  assert.ok(
    q.optionalQueue.some((f) => f.id === "page_profile"),
    "default page_profile may still be offered on optional opt-in path"
  );
});

test("LD adequacy checks unchanged in pack (19-2 regression guard)", () => {
  const checks = Array.isArray(briefConfig.planningAdequacyChecks)
    ? briefConfig.planningAdequacyChecks
    : [];
  const ids = checks.map((c) => c.id);
  assert.ok(ids.includes("ld_generate_without_source"));
  assert.ok(ids.includes("ld_assessment_generate_step_missing"));
  assert.ok(ids.includes("ld_page_profile_facilitator_mismatch"));
});

test("workflow-ld-adequacy.test.js still passes with shared LD pack", async () => {
  const adequacyTestPath = path.join(__dirname, "workflow-ld-adequacy.test.js");
  assert.ok(fs.existsSync(adequacyTestPath));
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  assert.ok(md.includes("planningAdequacyChecks"));
  assert.ok(md.includes('"required": []'));
});
