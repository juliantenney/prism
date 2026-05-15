#!/usr/bin/env node
/**
 * Sprint 19 post-19-3 LD Factory validation harness.
 * Uses __PRISM_TEST_API + pack profile mirror (same rules as workflow-ld-profile-thinning.test.js).
 * Complements live Factory UI runs on npm run dev (127.0.0.1:8787).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const http = require("http");

const ROOT = path.resolve(__dirname, "..");
const ldPath = path.join(ROOT, "domains", "learning-design", "domain-learning-design-step-patterns.md");
const appPath = path.join(ROOT, "app.js");

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  if (idx === -1) throw new Error("missing heading: " + heading);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadApi() {
  const source = fs.readFileSync(appPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("missing __PRISM_TEST_API");
  return api;
}

function profileTierFactorIds(profile, tierName) {
  const tiers = profile && profile.tiers ? profile.tiers : {};
  const rows = Array.isArray(tiers[tierName]) ? tiers[tierName] : [];
  return rows.map((row) => String((row && row.factorId) || "").trim()).filter(Boolean);
}

function resolveProfileMeta(profiles, profileId) {
  const raw = profiles[profileId];
  if (!raw) return null;
  const requiredIds = profileTierFactorIds(raw, "required");
  const optionalIds = profileTierFactorIds(raw, "optional");
  if (!requiredIds.length && !optionalIds.length) return null;
  return { profileId, requiredIds, optionalIds };
}

function allBriefFactors(config) {
  const out = [];
  ["requiredFactors", "optionalFactors", "refinementFactors"].forEach((key) => {
    (Array.isArray(config[key]) ? config[key] : []).forEach((f) => {
      if (f && f.id) out.push(f);
    });
  });
  return out;
}

function getFactorById(config, id) {
  return allBriefFactors(config).find((f) => String(f.id) === String(id)) || null;
}

function isWorkflowRefinementFactorRelevant(factor, base, resolved) {
  if (!factor || !factor.id) return false;
  const goalBlob = String([base.designIntent, base.goal, base.desiredOutputs].join("\n")).toLowerCase();
  const inputBlob = String([base.inputs, base.scopeConstraints, base.audience, base.scopeScale].join(
    "\n"
  )).toLowerCase();
  const goalTerms = Array.isArray(factor.askWhenGoalMentionsAnyOf) ? factor.askWhenGoalMentionsAnyOf : [];
  if (
    goalTerms.length &&
    !goalTerms.some((kw) => goalBlob.indexOf(String(kw || "").toLowerCase()) !== -1)
  ) {
    return false;
  }
  const equalsWhen = factor.askWhenResolvedFactorEquals;
  if (equalsWhen && typeof equalsWhen === "object") {
    for (const key of Object.keys(equalsWhen)) {
      if (String(resolved[key] || "") !== String(equalsWhen[key] || "")) return false;
    }
  }
  const scopeList = Array.isArray(factor.askWhenDesignScopeIn) ? factor.askWhenDesignScopeIn : [];
  if (scopeList.length) {
    const scope = String(resolved.design_scope || "").toLowerCase();
    if (!scopeList.map((v) => String(v || "").toLowerCase()).includes(scope)) return false;
  }
  return true;
}

function buildProfileFactorQueue(config, factorIds, forceAsk, base, resolved, elicited, sources) {
  const out = [];
  const seen = {};
  (Array.isArray(factorIds) ? factorIds : []).forEach((id) => {
    const fid = String(id || "").trim();
    if (!fid || seen[fid]) return;
    const factor = getFactorById(config, fid);
    if (!factor) return;
    const src = String((sources || {})[fid] || "");
    const hasResolvedValue =
      Object.prototype.hasOwnProperty.call(resolved, fid) &&
      resolved[fid] !== "" &&
      resolved[fid] != null;
    const userProvided =
      Object.prototype.hasOwnProperty.call(elicited || {}, fid) ||
      src === "explicit" ||
      src === "elicited";
    if (userProvided) return;
    if (!forceAsk && !isWorkflowRefinementFactorRelevant(factor, base, resolved)) return;
    if (forceAsk || !hasResolvedValue || src === "default") {
      seen[fid] = true;
      out.push(fid);
    }
  });
  return out;
}

function resolvePass(api, briefConfig, base) {
  const config = api.normalizeWorkflowBriefConfig(briefConfig);
  const explicit = api.extractWorkflowBriefExplicitFactors(base);
  const ruleInferred = api.applyWorkflowBriefInferenceRules(
    config,
    [base.designIntent, base.goal, base.desiredOutputs].join("\n"),
    [base.inputs, base.scopeConstraints, base.audience, base.scopeScale].join("\n")
  );
  const validated = api.applyWorkflowBriefValidationRules(config, base, explicit, ruleInferred);
  const resolvedState = api.resolveWorkflowBriefFactors(
    config,
    validated.explicitValues,
    {},
    validated.inferredValues,
    base
  );
  return { config, resolvedState, validated };
}

function checkDevApiKey() {
  return new Promise((resolve) => {
    const req = http.get("http://127.0.0.1:8787/__prism/dev-api-key", { timeout: 3000 }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          const j = JSON.parse(body);
          resolve(!!(j && j.openaiApiKey && String(j.openaiApiKey).length > 10));
        } catch (_e) {
          resolve(false);
        }
      });
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

const SCENARIOS = [
  {
    id: "M1",
    label: "Sparse LD session brief",
    base: {
      designIntent:
        "Design a single face-to-face teaching session on climate adaptation for undergraduate students.",
      goal:
        "Design a single face-to-face teaching session on climate adaptation for undergraduate students.",
      desiredOutputs: "learning activities, session flow",
      audience: "undergraduate students",
      scopeScale: "session",
      inputs: "",
      scopeConstraints: "90 minutes, face to face classroom",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    },
    modelSteps: [
      { title: "Define Learning Outcomes" },
      { title: "Design Learning Activities" },
      { title: "Construct Learning Sequence" }
    ],
    activeProfile: null
  },
  {
    id: "M2",
    label: "Assessment-pack brief",
    base: {
      designIntent:
        "Create a 10-question MCQ formative assessment pack for revision on cell biology.",
      goal: "Create a 10-question MCQ formative assessment pack for revision on cell biology.",
      desiredOutputs: "assessment items, quiz",
      audience: "first-year undergraduate biology students",
      scopeScale: "session",
      inputs: "",
      scopeConstraints: "online formative assessment",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    },
    modelSteps: [
      { title: "Define Learning Outcomes" },
      { title: "Generate Assessment Items" }
    ],
    activeProfile: "assessment_pack"
  },
  {
    id: "M3",
    label: "Design page / learner page brief",
    base: {
      designIntent:
        "Build a learner-facing revision page on ethics in AI summarizing key concepts with short practice questions.",
      goal:
        "Build a learner-facing revision page on ethics in AI summarizing key concepts with short practice questions.",
      desiredOutputs: "learner page, revision page",
      audience: "postgraduate seminar students",
      scopeScale: "session",
      inputs: "",
      scopeConstraints: "",
      startingArtefact: "generate_from_topic",
      selectedDomains: ["learning-design"]
    },
    modelSteps: [
      { title: "Define Learning Outcomes" },
      { title: "Design Page" }
    ],
    activeProfile: "design_page"
  },
  {
    id: "M4",
    label: "Source-provided brief",
    base: {
      designIntent:
        "Design a project management workshop using the uploaded case study PDF to produce facilitator guidance.",
      goal: "Design a project management workshop using the uploaded case study PDF to produce facilitator guidance.",
      desiredOutputs: "facilitator guide, workshop activities",
      audience: "professional learners",
      scopeScale: "session",
      inputs: "Attached PDF case study on project management; use as primary source material.",
      scopeConstraints: "half-day workshop",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    },
    modelSteps: [
      { title: "Normalize Content" },
      { title: "Define Learning Outcomes" },
      { title: "Design Learning Activities" }
    ],
    activeProfile: null
  }
];

async function main() {
  const md = fs.readFileSync(ldPath, "utf8");
  const briefConfig = extractJsonBlockAfterHeading(md, "### Workflow Brief Config").workflowBriefConfig;
  const profiles = briefConfig.stepRefinementProfiles || {};
  const api = loadApi();
  const devKey = await checkDevApiKey();

  const results = [];
  for (const sc of SCENARIOS) {
    const pass = resolvePass(api, briefConfig, sc.base);
    const missing = pass.resolvedState.missing || [];
    const resolved = pass.resolvedState.resolved || {};
    const sources = pass.resolvedState.sources || {};
    const design = { summary: "", steps: sc.modelSteps };
    const ctx = api.buildWorkflowRefinementContext({
      brief: sc.base,
      resolvedFactors: resolved,
      stepTitles: design.steps.map((s) => s.title),
      designSteps: design.steps
    });
    const adequacy = api.evaluateWorkflowBriefPlanningAdequacyChecks(
      pass.config,
      ctx
    );
    const adequacyIds = adequacy.map((r) => r.id);
    const afterDesign = api.applyWorkflowBriefPlanningAdequacyAfterDesign(
      pass.config,
      {
        resolved,
        missing,
        sources,
        inferredFactors: pass.validated.inferredValues || {}
      },
      sc.base,
      design
    );
    const profileId = sc.activeProfile;
    const meta = profileId ? resolveProfileMeta(profiles, profileId) : null;
    const requiredQueue = meta
      ? buildProfileFactorQueue(
          pass.config,
          meta.requiredIds,
          true,
          sc.base,
          resolved,
          {},
          sources
        )
      : [];
    const optionalQueue = meta
      ? buildProfileFactorQueue(
          pass.config,
          meta.optionalIds,
          false,
          sc.base,
          resolved,
          {},
          sources
        )
      : [];
    const genericRefinementOff = briefConfig.questionPolicy?.askRefinementByDefault === false;

    results.push({
      id: sc.id,
      label: sc.label,
      essentialsMissing: missing,
      adequacyIds,
      planningDisclosureCategories: (afterDesign.planningDisclosures || []).map((d) => d.category),
      profileId: profileId || "(none)",
      requiredPostGenFactorIds: requiredQueue,
      optionalPostGenFactorIds: optionalQueue,
      readyWouldBlock: requiredQueue.length > 0,
      learnerLevelInRequiredQueue: requiredQueue.includes("learner_level"),
      assessmentTypeInRequiredQueue: requiredQueue.includes("assessment_type"),
      pageProfileInRequiredQueue: requiredQueue.includes("page_profile"),
      genericRefinementQueueDisabled: genericRefinementOff,
      inferredAssessmentType: resolved.assessment_type,
      inferredAssessmentTypeSource: sources.assessment_type || null
    });
  }

  console.log(JSON.stringify({ devApiKeyFromEnvLocal: devKey, results }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
