/**
 * Sprint 38-S — GAM pack text capture with validation and retry.
 */
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const gamFormat = require(path.join(repoRoot, "lib", "gam-output-format.js"));

export async function captureGamPackText(options) {
  const {
    callOpenAI,
    apiKey,
    api,
    ctxHeader,
    gamAugmented,
    learningActivities,
    knowledgeModel,
    sanitizeCtx,
    maxAttempts = 3,
    minMaterials = 12
  } = options;

  let lastValidation = { ok: false, errors: ["no attempt"] };
  let gamTextRaw = "";
  let retryHint = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    gamTextRaw = await callOpenAI(
      apiKey,
      gamFormat.buildGamOutputContractSystemPrompt(),
      ctxHeader +
        retryHint +
        "\n\nMandatory GAM-PRES (38J-4 + 38L-3/38L-4): preserve DLA required_materials order; one Material per row; no function collapse; GAM-PRES-10 Evaluate completion — guided judgement insufficient without independent memo scaffold + verification checklist + transfer_prompt realised separately.\n\nEvaluate A4 household benchmark (38I-4): Maya/fixed-income perspectives, operational criteria rubric, weak/strong worked judgement, guided partial table, independent memo scaffold, verification rubric, transfer to learner household; policy communication at most one perspective lens — not capstone substance.\n\nGAM-WB-06b scaffold when learner-write; GAM-PRES-08/09 depth-shaped bodies; EV-GAM-FAIL-07 if guided-only Evaluate.\n\nPreserve upstream instructional_function and plan_beat_index order from DLA required_materials when emitting Material blocks.\n\nUpstream learning_activities:\n" +
        JSON.stringify(slimLearningActivitiesForGam(learningActivities), null, 2) +
        "\n\nUpstream knowledge_model:\n" +
        JSON.stringify(knowledgeModel, null, 2) +
        "\n\n---\n\n" +
        gamAugmented,
      16000
    );

    const sanitized = api.sanitizeSelfDirectedGamMaterialsOutput(gamTextRaw, sanitizeCtx);
    let gamText = String(sanitized.text != null ? sanitized.text : gamTextRaw);
    gamText = gamFormat.normalizeGamPackTextForCompose(gamText);
    lastValidation = gamFormat.validateGamPackTextOutput(gamText, {
      minMaterials: minMaterials,
      minActivities: 4,
      learningActivities: learningActivities
    });

    if (lastValidation.ok) {
      return {
        gamTextRaw,
        gamText,
        sanitized,
        validation: lastValidation,
        attempts: attempt,
        materials: gamFormat.parseGamMaterialsFromText(gamText)
      };
    }

    retryHint = "\n\n" + gamFormat.buildGamOutputContractRetryHint(lastValidation) + "\n";
  }

  const err = new Error(
    "GAM pack text validation failed after " +
      maxAttempts +
      " attempts: " +
      lastValidation.errors.join("; ")
  );
  err.validation = lastValidation;
  err.gamTextRaw = gamTextRaw;
  throw err;
}

export { gamFormat };

function slimLearningActivitiesForGam(learningActivities) {
  const acts = Array.isArray(learningActivities?.activities)
    ? learningActivities.activities
    : Array.isArray(learningActivities)
      ? learningActivities
      : [];
  return {
    activities: acts.map((act) => ({
      activity_id: act.activity_id,
      title: act.title,
      required_materials: (act.required_materials || []).map((m) => ({
        material_id: m.material_id,
        type: m.type,
        purpose: m.purpose,
        instructional_function: m.instructional_function,
        plan_beat_index: m.plan_beat_index,
        specification: m.specification || m.content || ""
      }))
    }))
  };
}
