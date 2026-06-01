const fs = require("fs");
const vm = require("vm");
const path = require("path");
const repoRoot = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const sb = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  document: { readyState: "loading", addEventListener: () => {} },
  window: {}
};
sb.window = sb;
vm.createContext(sb);
vm.runInContext(src, sb, { filename: "app.js" });
const api = sb.window.__PRISM_TEST_API;
const md = fs.readFileSync(
  path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
  "utf8"
);
const idx = md.indexOf("### Workflow Brief Config");
const fence = md.indexOf("```json", idx);
const close = md.indexOf("```", fence + 7);
const cfg = api.normalizeWorkflowBriefConfig(
  JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig
);
const PEER_GOAL =
  "Peer instruction session: individual answer, pair discussion, then revise answers after discussion.";
const brief = { goal: PEER_GOAL, selectedDomains: ["learning-design"] };
const explicit = api.extractWorkflowBriefExplicitFactors(brief);
const { resolved } = api.resolveWorkflowBriefFactors(cfg, explicit, {}, {}, brief);
const packs = api.resolvePedagogicCognitionPackIds(cfg, resolved, explicit, brief);
const contract = api.resolvePedagogicCognitionContractRequirements(
  packs,
  resolved,
  explicit,
  cfg,
  brief
);
console.log("resolved", {
  delivery_context: resolved.delivery_context,
  delivery_mode: resolved.delivery_mode,
  reasoning_revision_required: resolved.reasoning_revision_required,
  cognitive_engagement_required: resolved.cognitive_engagement_required,
  input_strategy: resolved.input_strategy
});
console.log("packs", packs);
console.log("dlaFieldIds", contract && contract.dlaFieldIds);
console.log("gamSections", contract && contract.gamSections);
const full = {
  activities: [
    {
      activity_id: "a1",
      initial_position_prompt: "State your prediction.",
      reasoning_revision_prompt: "Revise your answer using pair evidence.",
      revision_trigger: "After pair discussion"
    }
  ]
};
console.log("dla eval", api.evaluatePedagogicCognitionContractSatisfaction(full, contract, "dla"));
const gamText = [
  "Activity: Peer predict",
  "Cognition cues",
  "Initial position: Write your first prediction.",
  "Reasoning revision: Update your explanation.",
  "Revision trigger: After pair discussion."
].join("\n");
console.log("gam eval", api.evaluatePedagogicCognitionContractSatisfaction(gamText, contract, "gam"));
