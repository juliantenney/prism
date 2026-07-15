/**
 * LD-INSTRUCTIONAL-ARCHETYPE — Priority-1 instructional archetype routing.
 * Planning fields live on DLA required_materials; GAM receives only selected compact rules.
 * Material type remains independent of instructional_archetype.
 *
 * Production selection (Sprint 60 Phase A): authoritative SoT is
 * required_materials[].instructional_archetype + required_materials[].archetype_plan
 * emitted by normal DLA planning (see lib/ld-dla-page-enrich-contract.js).
 *
 * Legacy Sprint 59 lab activation (kept for regression only — not the production path):
 * S59_*_TEST tokens, window flags, selected_dla_test, DLA test emission blocks, and
 * capture stamps (is*TestOptIn / resolveS59DlaTestSelection / applyDla*TestEmissionBlock*
 * / apply*TestPlanToDlaPage). Do not use those for product archetype selection.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_INSTRUCTIONAL_ARCHETYPE = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var MODULE_ID = "LD-INSTRUCTIONAL-ARCHETYPE";
    /**
     * Cache-bust / observability version for Sprint 59 manual test activation.
     * Module bump for mental_model_building MVP; process_walkthrough rule text remains the
     * validated 20260715-4 wording (unchanged).
     */
    var SCRIPT_VERSION = "20260715-5";
    var PROCESS_RULE_FROZEN_VERSION = "20260715-4";
    var MARKER = "LD-INSTRUCTIONAL-ARCHETYPE-ROUTING (auto-applied)";
    /* --- Legacy Sprint 59 test-activation markers / tokens (regression-only) --- */
    var DLA_MECHANISM_TEST_MARKER =
      "LD-INSTRUCTIONAL-ARCHETYPE-DLA-MECHANISM-TEST (auto-applied)";
    var DLA_PROCESS_TEST_MARKER =
      "LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST (auto-applied)";
    var DLA_MENTAL_MODEL_TEST_MARKER =
      "LD-INSTRUCTIONAL-ARCHETYPE-DLA-MENTAL-MODEL-TEST (auto-applied)";
    var MECHANISM_TEST_OPT_IN_TOKEN = "S59_MECHANISM_TEST";
    var PROCESS_TEST_OPT_IN_TOKEN = "S59_PROCESS_TEST";
    var MENTAL_MODEL_TEST_OPT_IN_TOKEN = "S59_MENTAL_MODEL_TEST";
    var DESIGNATED_ACTIVITY_ID = "A2";
    var DESIGNATED_MATERIAL_ID = "A2-M1";
    var DESIGNATED_PROCESS_ACTIVITY_ID = "A4";
    var DESIGNATED_PROCESS_MATERIAL_ID = "A4-M1";
    var DESIGNATED_MENTAL_MODEL_ACTIVITY_ID = "A3";
    var DESIGNATED_MENTAL_MODEL_MATERIAL_ID = "A3-M1";

    /** Legacy S59 fixture — enzymes mechanism (manual transfer / regression only). */
    var ENZYMES_MECHANISM_TEST_PLAN = {
      start: "temperature increases within and beyond the enzyme's stable range",
      outcome: "reaction rate first increases and then decreases",
      required_links: [
        "molecular kinetic energy and collision frequency",
        "enzyme-substrate complex formation",
        "disruption of enzyme structure at high temperature"
      ]
    };

    /** Fixed enzymes process-walkthrough contract for the transfer test (planning only). */
    var ENZYMES_PROCESS_TEST_PLAN = {
      process_goal: "interpret an enzyme reaction-rate investigation",
      stages: [
        "identify the manipulated condition and measured outcome",
        "inspect the pattern across observations",
        "connect the pattern to enzyme behaviour",
        "form a bounded conclusion"
      ]
    };

    /** Fixed thermostat mental-model contract for the manual transfer test (planning only). */
    var THERMOSTAT_MENTAL_MODEL_TEST_PLAN = {
      system: "a room heated by a thermostat-controlled heater",
      key_relationships: [
        "the thermostat compares room temperature with the set point",
        "the heater switches on when the room is below the set point and off when it reaches it",
        "the room continually loses heat to colder surroundings"
      ],
      governing_constraint: "the heater has a finite heating capacity",
      contrast: {
        state_a: "the outside temperature is mildly cold",
        state_b: "the outside temperature becomes extremely cold"
      }
    };

    var ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS = {
      material_id: DESIGNATED_MATERIAL_ID,
      material_type: "text",
      purpose:
        "Teach how temperature affects enzyme reaction rate through a causal chain.",
      specification:
        "Explain temperature→rate rise then fall with intervening links; natural prose only."
    };

    var ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS = {
      material_id: DESIGNATED_PROCESS_MATERIAL_ID,
      material_type: "worked_example",
      purpose: "Model expert interpretation of an enzyme reaction-rate investigation.",
      specification:
        "Ordered process walkthrough from condition identification to bounded conclusion."
    };

    var THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS = {
      material_id: DESIGNATED_MENTAL_MODEL_MATERIAL_ID,
      material_type: "modelling_note",
      purpose:
        "Help learners assemble a durable working model of thermostat-controlled heating.",
      specification:
        "Relationship-and-constraint model that contrasts mild vs extreme cold; natural prose only."
    };

    var ALLOWED = {
      mechanism_explanation: true,
      process_walkthrough: true,
      mental_model_building: true
    };

    var RULES = {
      mechanism_explanation:
        "Explain how the stated start produces the outcome. Realise every entry in required_links as a distinct intelligible transition in the causal chain, using connected learner-facing prose rather than a labelled list. If the outcome contains more than one phase, explain each phase using the relevant supplied links; do not stop after the first phase or omit an intermediate link.",
      process_walkthrough:
        "Realise the process_goal as one continuous worked walkthrough of a single investigation or evidence set, covering every supplied stage in order. For each stage: perform the reasoning for that stage on the investigation itself; produce an explicit intermediate finding; then carry that finding forward so the next stage uses it. Each later stage must consume information generated by earlier stages, and the final conclusion must depend on those findings. Show the reasoning being performed in connected learner-facing prose — do not restate stage labels as procedural Step/how-to instructions, do not write advice about what a learner should do, and do not produce a how-to guide, procedural checklist, numbered label list, or a short example that only summarises the stages after the fact.",
      mental_model_building:
        "Build a coherent account of the named system using the supplied relationships and governing constraint. Use the same system model to explain how behaviour differs between the two supplied states. Do not merely define components, narrate a sequence, or explain only one causal chain. Write connected learner-facing prose — do not emit System:/Relationships:/Constraint:/State A:/State B: rubric headings."
    };

    var PLAN_KEYS = {
      mechanism_explanation: ["start", "outcome", "required_links"],
      process_walkthrough: ["process_goal", "stages"],
      mental_model_building: [
        "system",
        "key_relationships",
        "governing_constraint",
        "contrast"
      ]
    };

    function nonEmptyString(value) {
      return String(value == null ? "" : value).trim();
    }

    function isPlainObject(value) {
      return !!value && typeof value === "object" && !Array.isArray(value);
    }

    function isAllowedArchetype(value) {
      return !!ALLOWED[nonEmptyString(value)];
    }

    function materialTypeOf(material) {
      if (!isPlainObject(material)) return "";
      return nonEmptyString(
        material.material_type || material.type || material.materialType || ""
      );
    }

    function nonEmptyStringList(value) {
      if (!Array.isArray(value)) return [];
      return value
        .map(function (entry) {
          return nonEmptyString(entry);
        })
        .filter(Boolean);
    }

    function pathLabel(activityId, materialId, field) {
      var base =
        "activities[].required_materials" +
        (materialId ? "[" + materialId + "]" : "") +
        (activityId ? " (activity " + activityId + ")" : "");
      return field ? base + "." + field : base;
    }

    /**
     * Validate a single required_materials row when instructional_archetype is present.
     * Materials without the field are skipped by callers (legacy path unchanged).
     */
    function validateMaterialArchetypePlan(material, options) {
      var opts = options && typeof options === "object" ? options : {};
      var activityId = nonEmptyString(opts.activityId);
      var materialId = nonEmptyString(
        (material && (material.material_id || material.materialId)) || opts.materialId
      );
      var errors = [];
      var warnings = [];

      if (!isPlainObject(material)) {
        return { ok: true, errors: errors, warnings: warnings, active: false };
      }

      var hasArchetypeKey = Object.prototype.hasOwnProperty.call(
        material,
        "instructional_archetype"
      );
      if (!hasArchetypeKey) {
        return { ok: true, errors: errors, warnings: warnings, active: false };
      }

      var archetype = nonEmptyString(material.instructional_archetype);
      if (!archetype) {
        errors.push(
          pathLabel(activityId, materialId, "instructional_archetype") +
            " is present but empty"
        );
        return { ok: false, errors: errors, warnings: warnings, active: false };
      }

      if (!isAllowedArchetype(archetype)) {
        errors.push(
          pathLabel(activityId, materialId, "instructional_archetype") +
            ' has unknown value "' +
            archetype +
            '" (allowed: mechanism_explanation, process_walkthrough, mental_model_building); no archetype rule will activate'
        );
        return { ok: false, errors: errors, warnings: warnings, active: false };
      }

      var plan = material.archetype_plan;
      if (!isPlainObject(plan)) {
        errors.push(
          pathLabel(activityId, materialId, "archetype_plan") +
            " object required for instructional_archetype=" +
            archetype
        );
        return { ok: false, errors: errors, warnings: warnings, active: false };
      }

      if (archetype === "mechanism_explanation") {
        if (!nonEmptyString(plan.start)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.start") + " required (non-empty)"
          );
        }
        if (!nonEmptyString(plan.outcome)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.outcome") +
              " required (non-empty)"
          );
        }
        if (nonEmptyStringList(plan.required_links).length < 1) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.required_links") +
              " requires at least one non-empty entry"
          );
        }
      } else if (archetype === "process_walkthrough") {
        if (!nonEmptyString(plan.process_goal)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.process_goal") +
              " required (non-empty)"
          );
        }
        if (nonEmptyStringList(plan.stages).length < 2) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.stages") +
              " requires at least two non-empty stages"
          );
        }
      } else if (archetype === "mental_model_building") {
        if (!nonEmptyString(plan.system)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.system") + " required (non-empty)"
          );
        }
        if (nonEmptyStringList(plan.key_relationships).length < 1) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.key_relationships") +
              " requires at least one non-empty entry"
          );
        }
        if (!nonEmptyString(plan.governing_constraint)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.governing_constraint") +
              " required (non-empty)"
          );
        }
        if (!isPlainObject(plan.contrast)) {
          errors.push(
            pathLabel(activityId, materialId, "archetype_plan.contrast") +
              " object required with state_a and state_b"
          );
        } else {
          if (!nonEmptyString(plan.contrast.state_a)) {
            errors.push(
              pathLabel(activityId, materialId, "archetype_plan.contrast.state_a") +
                " required (non-empty)"
            );
          }
          if (!nonEmptyString(plan.contrast.state_b)) {
            errors.push(
              pathLabel(activityId, materialId, "archetype_plan.contrast.state_b") +
                " required (non-empty)"
            );
          }
        }
      }

      return {
        ok: errors.length === 0,
        errors: errors,
        warnings: warnings,
        active: errors.length === 0,
        archetype: archetype,
        material_type: materialTypeOf(material)
      };
    }

    function collectRequiredMaterialsFromPage(page) {
      var rows = [];
      if (!isPlainObject(page) || !Array.isArray(page.activities)) return rows;
      page.activities.forEach(function (activity, aIndex) {
        if (!isPlainObject(activity)) return;
        var activityId = nonEmptyString(activity.activity_id) || "activities[" + aIndex + "]";
        var mats = Array.isArray(activity.required_materials)
          ? activity.required_materials
          : [];
        mats.forEach(function (material, mIndex) {
          rows.push({
            activityId: activityId,
            materialId:
              nonEmptyString(material && (material.material_id || material.materialId)) ||
              "M" + (mIndex + 1),
            material: material
          });
        });
      });
      return rows;
    }

    function validatePageArchetypePlans(page) {
      var errors = [];
      var warnings = [];
      var active = [];
      collectRequiredMaterialsFromPage(page).forEach(function (row) {
        var result = validateMaterialArchetypePlan(row.material, {
          activityId: row.activityId,
          materialId: row.materialId
        });
        errors = errors.concat(result.errors || []);
        warnings = warnings.concat(result.warnings || []);
        if (result.active) {
          active.push({
            activityId: row.activityId,
            materialId: row.materialId,
            archetype: result.archetype,
            material_type: result.material_type,
            plan: row.material.archetype_plan
          });
        }
      });
      return {
        ok: errors.length === 0,
        errors: errors,
        warnings: warnings,
        activeAssignments: active
      };
    }

    function planPayloadForPrompt(archetype, plan) {
      if (!isPlainObject(plan)) return {};
      if (archetype === "mechanism_explanation") {
        return {
          start: nonEmptyString(plan.start),
          outcome: nonEmptyString(plan.outcome),
          required_links: nonEmptyStringList(plan.required_links)
        };
      }
      if (archetype === "process_walkthrough") {
        return {
          process_goal: nonEmptyString(plan.process_goal),
          stages: nonEmptyStringList(plan.stages)
        };
      }
      if (archetype === "mental_model_building") {
        var contrast = isPlainObject(plan.contrast) ? plan.contrast : {};
        return {
          system: nonEmptyString(plan.system),
          key_relationships: nonEmptyStringList(plan.key_relationships),
          governing_constraint: nonEmptyString(plan.governing_constraint),
          contrast: {
            state_a: nonEmptyString(contrast.state_a),
            state_b: nonEmptyString(contrast.state_b)
          }
        };
      }
      return {};
    }

    /**
     * Build compact routing block for materials with valid Priority-1 archetypes only.
     * Unknown archetypes add zero rules. Empty input → empty string (no prompt growth).
     */
    function buildArchetypeRoutingBlock(pageOrAssignments) {
      var assignments = [];
      if (Array.isArray(pageOrAssignments)) {
        assignments = pageOrAssignments;
      } else if (isPlainObject(pageOrAssignments)) {
        var validated = validatePageArchetypePlans(pageOrAssignments);
        assignments = validated.activeAssignments || [];
      }

      if (!assignments.length) return "";

      var selected = {};
      var lines = [
        "",
        MARKER + ":",
        "- Module: " +
          MODULE_ID +
          " | Apply only the selected Priority-1 instructional archetype rule(s) below.",
        "- instructional_archetype is a pedagogical planning field from DLA; material type remains independent presentation format.",
        "- Do not invent archetypes. Do not apply rules for materials that lack a valid instructional_archetype + archetype_plan.",
        "- Retain anti-rubric-gaming and anti-exemplar-leakage guidance from LD-GAM-INSTRUCTIONAL-DEPTH; do not emit Cause:/Mechanism:/Outcome: learner-facing labels.",
        ""
      ];

      assignments.forEach(function (row) {
        var archetype = nonEmptyString(row.archetype || row.instructional_archetype);
        if (!isAllowedArchetype(archetype) || !RULES[archetype]) return;
        selected[archetype] = true;
        var plan = planPayloadForPrompt(archetype, row.plan || row.archetype_plan);
        var materialType = nonEmptyString(row.material_type || row.materialType || "");
        lines.push(
          "- Material " +
            nonEmptyString(row.materialId || row.material_id || "?") +
            " (activity " +
            nonEmptyString(row.activityId || row.activity_id || "?") +
            ")" +
            (materialType ? "; material_type=" + materialType : "") +
            "; instructional_archetype=" +
            archetype
        );
        lines.push("  archetype_plan: " + JSON.stringify(plan));
        lines.push("  Rule: " + RULES[archetype]);
        lines.push("");
      });

      var selectedKeys = Object.keys(selected);
      if (!selectedKeys.length) return "";

      lines.push(
        "- Selected rule ids for this request: " + selectedKeys.sort().join(", ") + "."
      );
      return lines.join("\n").trim();
    }

    function archetypeRoutingAlreadyPresent(draftText) {
      return /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING \(auto-applied\)/i.test(
        String(draftText || "")
      );
    }

    /**
     * Remove a previously injected routing block so rule updates always reach the
     * assembled prompt (local overrides / re-augmentation must not freeze stale RULES).
     */
    function stripArchetypeRoutingBlockFromDraft(draftText) {
      var text = String(draftText || "");
      if (!archetypeRoutingAlreadyPresent(text)) return text.trim();
      var stripped = text.replace(
        /\n*LD-INSTRUCTIONAL-ARCHETYPE-ROUTING \(auto-applied\):[\s\S]*?(?=\n(?:[A-Z][A-Z0-9_-]+ \(auto-applied\)|#{1,3}\s)|$)/i,
        "\n"
      );
      return stripped.replace(/\n{3,}/g, "\n\n").trim();
    }

    function applyArchetypeRoutingBlockToDraft(draftText, page, context) {
      var draftBody = String(draftText || "").trim();
      if (!context || !context.isGenerateActivityMaterialsStep) {
        return draftBody;
      }
      draftBody = stripArchetypeRoutingBlockFromDraft(draftBody);
      var block = buildArchetypeRoutingBlock(page);
      if (!block) return draftBody;
      return (draftBody + "\n\n" + block).trim();
    }

    /**
     * Compact runtime snapshot for Sprint 59 manual verification of the loaded rule.
     */
    function buildS59GamArchetypeRuntimeSnapshot(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      var materialId = nonEmptyString(opts.material_id || opts.materialId) ||
        DESIGNATED_PROCESS_MATERIAL_ID;
      var validated = validatePageArchetypePlans(page);
      var hit = null;
      (validated.activeAssignments || []).forEach(function (row) {
        if (!hit && nonEmptyString(row.materialId) === materialId) {
          hit = row;
        }
      });
      if (!hit && (validated.activeAssignments || []).length === 1) {
        hit = validated.activeAssignments[0];
      }
      var archetype = hit ? nonEmptyString(hit.archetype) : "";
      var plan = hit
        ? planPayloadForPrompt(archetype, hit.plan)
        : null;
      return {
        loaded_archetype_script_version: SCRIPT_VERSION,
        selected_instructional_archetype: archetype || null,
        selected_rule_text: archetype && RULES[archetype] ? RULES[archetype] : null,
        material_id: hit ? hit.materialId : materialId,
        archetype_plan_received: plan,
        routing_block_chars: buildArchetypeRoutingBlock(page).length
      };
    }

    /**
     * Optional soft diagnostics only — never a hard gate.
     */
    function softDiagnoseRubricLabelsInBody(body) {
      var text = String(body || "");
      var warnings = [];
      if (/^\s*Cause\s*:/im.test(text) || /\n\s*Cause\s*:/i.test(text)) {
        warnings.push('learner-facing "Cause:" label detected (soft)');
      }
      if (/^\s*Mechanism\s*:/im.test(text) || /\n\s*Mechanism\s*:/i.test(text)) {
        warnings.push('learner-facing "Mechanism:" label detected (soft)');
      }
      if (/^\s*Outcome\s*:/im.test(text) || /\n\s*Outcome\s*:/i.test(text)) {
        warnings.push('learner-facing "Outcome:" label detected (soft)');
      }
      return { ok: true, warnings: warnings };
    }

    function estimateRoutingPromptGrowth(page) {
      var block = buildArchetypeRoutingBlock(page);
      var growth = measureArchetypeRoutingPromptGrowth(page);
      return {
        chars: block ? block.length : 0,
        lines: block ? block.split("\n").length : 0,
        selectedRules: growth.selectedRules,
        compactRuleChars: growth.compactRuleChars,
        planningValueChars: growth.planningValueChars,
        formattingOverheadChars: growth.formattingOverheadChars
      };
    }

    /**
     * Explicit opt-in only — never inferred from topic/domain.
     * Accepts true, a string haystack, or a workflow/context object.
     */
    function workflowOptInHaystack(source) {
      if (!isPlainObject(source)) return "";
      var parts = [
        source.goal,
        source.notes,
        source.title,
        source.name,
        source.desiredOutputs,
        source.workflowGoal,
        source.stepNotes,
        source.stepTitle
      ];
      if (Array.isArray(source.workflowOutputs)) {
        parts = parts.concat(source.workflowOutputs);
      }
      if (
        source.workflowBriefResolution &&
        source.workflowBriefResolution.resolvedFactors &&
        typeof source.workflowBriefResolution.resolvedFactors === "object"
      ) {
        try {
          parts.push(JSON.stringify(source.workflowBriefResolution.resolvedFactors));
        } catch (_) {}
      }
      return parts.filter(Boolean).join("\n");
    }

    /**
     * Legacy Sprint 59 lab opt-in (regression-only).
     * Production archetype selection does not use these tokens or window flags.
     */
    function isMechanismTestOptIn(source) {
      if (source === true) return true;
      if (typeof source === "string") {
        return new RegExp("\\b" + MECHANISM_TEST_OPT_IN_TOKEN + "\\b", "i").test(source);
      }
      if (!isPlainObject(source)) return false;
      if (source.__PRISM_S59_MECHANISM_TEST === true) return true;
      if (source.s59MechanismTest === true) return true;
      return isMechanismTestOptIn(workflowOptInHaystack(source));
    }

    /** Legacy Sprint 59 lab opt-in (regression-only). */
    function isProcessTestOptIn(source) {
      if (source === true) return true;
      if (typeof source === "string") {
        return new RegExp("\\b" + PROCESS_TEST_OPT_IN_TOKEN + "\\b", "i").test(source);
      }
      if (!isPlainObject(source)) return false;
      if (source.__PRISM_S59_PROCESS_TEST === true) return true;
      if (source.s59ProcessTest === true) return true;
      return isProcessTestOptIn(workflowOptInHaystack(source));
    }

    /** Legacy Sprint 59 lab opt-in (regression-only). */
    function isMentalModelTestOptIn(source) {
      if (source === true) return true;
      if (typeof source === "string") {
        return new RegExp("\\b" + MENTAL_MODEL_TEST_OPT_IN_TOKEN + "\\b", "i").test(
          source
        );
      }
      if (!isPlainObject(source)) return false;
      if (source.__PRISM_S59_MENTAL_MODEL_TEST === true) return true;
      if (source.s59MentalModelTest === true) return true;
      return isMentalModelTestOptIn(workflowOptInHaystack(source));
    }

    /**
     * Legacy Sprint 59 DLA-test selection (regression-only).
     * Fail-closed when any two of mechanism / process / mental_model are requested.
     * Production pages may carry multiple Priority-1 archetypes on different materials —
     * that path does not use this function.
     */
    function resolveS59DlaTestSelection(input) {
      var mechanismRequested = false;
      var processRequested = false;
      var mentalModelRequested = false;
      if (
        isPlainObject(input) &&
        ("mechanism_requested" in input ||
          "process_requested" in input ||
          "mental_model_requested" in input)
      ) {
        mechanismRequested = !!input.mechanism_requested;
        processRequested = !!input.process_requested;
        mentalModelRequested = !!input.mental_model_requested;
      } else {
        mechanismRequested = isMechanismTestOptIn(input);
        processRequested = isProcessTestOptIn(input);
        mentalModelRequested = isMentalModelTestOptIn(input);
      }
      var requestedCount =
        (mechanismRequested ? 1 : 0) +
        (processRequested ? 1 : 0) +
        (mentalModelRequested ? 1 : 0);
      var conflict = requestedCount > 1;
      var selected = "none";
      if (!conflict && mechanismRequested) selected = "mechanism";
      if (!conflict && processRequested) selected = "process";
      if (!conflict && mentalModelRequested) selected = "mental_model";
      return {
        mechanism_requested: mechanismRequested,
        process_requested: processRequested,
        mental_model_requested: mentalModelRequested,
        selected_dla_test: selected,
        conflict: conflict,
        loaded_archetype_script_version: SCRIPT_VERSION
      };
    }

    function buildS59DlaTestActivationSnapshot(input) {
      var selection = resolveS59DlaTestSelection(input);
      var goal = "";
      if (isPlainObject(input)) {
        goal = nonEmptyString(
          input.workflow_goal ||
            input.goal ||
            input.workflowGoal ||
            (input.workflowOutputSpec && input.workflowOutputSpec.goal)
        );
      } else if (typeof input === "string") {
        goal = nonEmptyString(input);
      }
      return {
        workflow_goal: goal,
        mechanism_requested: selection.mechanism_requested,
        process_requested: selection.process_requested,
        mental_model_requested: selection.mental_model_requested,
        selected_dla_test: selection.selected_dla_test,
        loaded_archetype_script_version: SCRIPT_VERSION,
        conflict: selection.conflict
      };
    }

    /** Legacy S59 DLA prompt emission (regression-only; not production selection). */
    function buildDlaMechanismTestEmissionBlock() {
      var planJson = JSON.stringify(
        {
          instructional_archetype: "mechanism_explanation",
          archetype_plan: ENZYMES_MECHANISM_TEST_PLAN
        },
        null,
        2
      );
      return [
        "",
        DLA_MECHANISM_TEST_MARKER + ":",
        "- Explicit opt-in token " +
          MECHANISM_TEST_OPT_IN_TOKEN +
          " is active. Emit mechanism planning fields on ONE designated required_materials row only.",
        "- Designated row: activity_id \"" +
          DESIGNATED_ACTIVITY_ID +
          "\", material_id \"" +
          DESIGNATED_MATERIAL_ID +
          "\" (create that material_id on A2 if missing; material_type stays text / independent).",
        "- Copy these planning fields exactly (planning skeleton only — do not write the learner-facing explanation body):",
        planJson,
        "- Do not emit process_walkthrough or mental_model_building.",
        "- Do not invent other instructional_archetype values.",
        "- Do not attach instructional_archetype to other materials."
      ].join("\n");
    }

    /** Legacy S59 DLA prompt emission (regression-only; not production selection). */
    function buildDlaProcessTestEmissionBlock() {
      var planJson = JSON.stringify(
        {
          instructional_archetype: "process_walkthrough",
          archetype_plan: ENZYMES_PROCESS_TEST_PLAN
        },
        null,
        2
      );
      return [
        "",
        DLA_PROCESS_TEST_MARKER + ":",
        "- Explicit opt-in token " +
          PROCESS_TEST_OPT_IN_TOKEN +
          " is active. Emit process_walkthrough planning fields on ONE designated required_materials row only.",
        "- Designated row: activity_id \"" +
          DESIGNATED_PROCESS_ACTIVITY_ID +
          "\", material_id \"" +
          DESIGNATED_PROCESS_MATERIAL_ID +
          "\" (create that material_id on A4 if missing; material_type stays worked_example / independent).",
        "- Copy these planning fields exactly (planning skeleton only — do not write the learner-facing walkthrough body):",
        planJson,
        "- Do not emit mechanism_explanation or mental_model_building.",
        "- Do not invent other instructional_archetype values.",
        "- Do not attach instructional_archetype to other materials."
      ].join("\n");
    }

    /** Legacy S59 DLA prompt emission (regression-only; not production selection). */
    function buildDlaMentalModelTestEmissionBlock() {
      var planJson = JSON.stringify(
        {
          instructional_archetype: "mental_model_building",
          archetype_plan: THERMOSTAT_MENTAL_MODEL_TEST_PLAN
        },
        null,
        2
      );
      return [
        "",
        DLA_MENTAL_MODEL_TEST_MARKER + ":",
        "- Explicit opt-in token " +
          MENTAL_MODEL_TEST_OPT_IN_TOKEN +
          " is active. Emit mental_model_building planning fields on ONE designated required_materials row only.",
        "- Designated row: activity_id \"" +
          DESIGNATED_MENTAL_MODEL_ACTIVITY_ID +
          "\", material_id \"" +
          DESIGNATED_MENTAL_MODEL_MATERIAL_ID +
          "\" (create that material_id on A3 if missing; material_type stays modelling_note / independent).",
        "- Copy these planning fields exactly (planning skeleton only — do not write the learner-facing model body; do not invent predicted_effect outcomes):",
        planJson,
        "- Do not emit mechanism_explanation or process_walkthrough.",
        "- Do not invent other instructional_archetype values.",
        "- Do not attach instructional_archetype to other materials."
      ].join("\n");
    }

    function dlaMechanismTestEmissionAlreadyPresent(draftText) {
      return new RegExp(
        DLA_MECHANISM_TEST_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      ).test(String(draftText || ""));
    }

    function dlaProcessTestEmissionAlreadyPresent(draftText) {
      return new RegExp(
        DLA_PROCESS_TEST_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      ).test(String(draftText || ""));
    }

    function dlaMentalModelTestEmissionAlreadyPresent(draftText) {
      return new RegExp(
        DLA_MENTAL_MODEL_TEST_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      ).test(String(draftText || ""));
    }

    function applyDlaMechanismTestEmissionBlockToDraft(draftText, context) {
      var draftBody = String(draftText || "").trim();
      if (!context || !context.isDesignLearningActivitiesStep) return draftBody;
      if (!context.mechanismTestOptIn) return draftBody;
      if (dlaMechanismTestEmissionAlreadyPresent(draftBody)) return draftBody;
      return (draftBody + "\n" + buildDlaMechanismTestEmissionBlock()).trim();
    }

    function applyDlaProcessTestEmissionBlockToDraft(draftText, context) {
      var draftBody = String(draftText || "").trim();
      if (!context || !context.isDesignLearningActivitiesStep) return draftBody;
      if (!context.processTestOptIn) return draftBody;
      if (dlaProcessTestEmissionAlreadyPresent(draftBody)) return draftBody;
      return (draftBody + "\n" + buildDlaProcessTestEmissionBlock()).trim();
    }

    function applyDlaMentalModelTestEmissionBlockToDraft(draftText, context) {
      var draftBody = String(draftText || "").trim();
      if (!context || !context.isDesignLearningActivitiesStep) return draftBody;
      if (!context.mentalModelTestOptIn) return draftBody;
      if (dlaMentalModelTestEmissionAlreadyPresent(draftBody)) return draftBody;
      return (draftBody + "\n" + buildDlaMentalModelTestEmissionBlock()).trim();
    }

    function clonePlan() {
      return {
        start: ENZYMES_MECHANISM_TEST_PLAN.start,
        outcome: ENZYMES_MECHANISM_TEST_PLAN.outcome,
        required_links: ENZYMES_MECHANISM_TEST_PLAN.required_links.slice()
      };
    }

    function cloneProcessPlan() {
      return {
        process_goal: ENZYMES_PROCESS_TEST_PLAN.process_goal,
        stages: ENZYMES_PROCESS_TEST_PLAN.stages.slice()
      };
    }

    function cloneMentalModelPlan() {
      return {
        system: THERMOSTAT_MENTAL_MODEL_TEST_PLAN.system,
        key_relationships: THERMOSTAT_MENTAL_MODEL_TEST_PLAN.key_relationships.slice(),
        governing_constraint: THERMOSTAT_MENTAL_MODEL_TEST_PLAN.governing_constraint,
        contrast: {
          state_a: THERMOSTAT_MENTAL_MODEL_TEST_PLAN.contrast.state_a,
          state_b: THERMOSTAT_MENTAL_MODEL_TEST_PLAN.contrast.state_b
        }
      };
    }

    function findDesignatedMechanismMaterial(page) {
      var rows = collectRequiredMaterialsFromPage(page);
      var i;
      for (i = 0; i < rows.length; i += 1) {
        if (
          rows[i].activityId === DESIGNATED_ACTIVITY_ID &&
          rows[i].materialId === DESIGNATED_MATERIAL_ID
        ) {
          return rows[i];
        }
      }
      for (i = 0; i < rows.length; i += 1) {
        if (rows[i].materialId === DESIGNATED_MATERIAL_ID) return rows[i];
      }
      return null;
    }

    function findDesignatedProcessMaterial(page) {
      var rows = collectRequiredMaterialsFromPage(page);
      var i;
      for (i = 0; i < rows.length; i += 1) {
        if (
          rows[i].activityId === DESIGNATED_PROCESS_ACTIVITY_ID &&
          rows[i].materialId === DESIGNATED_PROCESS_MATERIAL_ID
        ) {
          return rows[i];
        }
      }
      for (i = 0; i < rows.length; i += 1) {
        if (rows[i].materialId === DESIGNATED_PROCESS_MATERIAL_ID) return rows[i];
      }
      return null;
    }

    function findDesignatedMentalModelMaterial(page) {
      var rows = collectRequiredMaterialsFromPage(page);
      var i;
      for (i = 0; i < rows.length; i += 1) {
        if (
          rows[i].activityId === DESIGNATED_MENTAL_MODEL_ACTIVITY_ID &&
          rows[i].materialId === DESIGNATED_MENTAL_MODEL_MATERIAL_ID
        ) {
          return rows[i];
        }
      }
      for (i = 0; i < rows.length; i += 1) {
        if (rows[i].materialId === DESIGNATED_MENTAL_MODEL_MATERIAL_ID) return rows[i];
      }
      return null;
    }

    /**
     * Deterministic stamp for the explicit mechanism transfer test.
     * Does not infer archetypes for unmarked workflows — call only when opt-in is true.
     */
    /** Legacy S59 capture stamp (regression-only; not production selection). */
    function applyEnzymesMechanismTestPlanToDlaPage(page) {
      if (!isPlainObject(page) || !Array.isArray(page.activities) || !page.activities.length) {
        return {
          ok: false,
          changed: false,
          page: page,
          errors: ["page.activities[] required to apply mechanism test plan"]
        };
      }

      var existing = findDesignatedMechanismMaterial(page);
      var targetActivity = null;
      var targetMaterial = null;

      if (existing) {
        targetActivity = page.activities.find(function (act) {
          return nonEmptyString(act && act.activity_id) === existing.activityId;
        });
        targetMaterial = existing.material;
      } else {
        targetActivity =
          page.activities.find(function (act) {
            return nonEmptyString(act && act.activity_id) === DESIGNATED_ACTIVITY_ID;
          }) || page.activities[0];
        if (!targetActivity || typeof targetActivity !== "object") {
          return {
            ok: false,
            changed: false,
            page: page,
            errors: ["no activity available for designated mechanism material"]
          };
        }
        if (!Array.isArray(targetActivity.required_materials)) {
          targetActivity.required_materials = [];
        }
        targetMaterial = {
          material_id: DESIGNATED_MATERIAL_ID,
          material_type: ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.material_type,
          purpose: ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.purpose,
          specification: ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.specification
        };
        targetActivity.required_materials.push(targetMaterial);
      }

      var before = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype || null,
        archetype_plan: targetMaterial.archetype_plan || null
      });
      targetMaterial.material_id = DESIGNATED_MATERIAL_ID;
      if (!nonEmptyString(targetMaterial.material_type || targetMaterial.type)) {
        targetMaterial.material_type = ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.material_type;
      }
      if (!nonEmptyString(targetMaterial.purpose)) {
        targetMaterial.purpose = ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.purpose;
      }
      if (!nonEmptyString(targetMaterial.specification)) {
        targetMaterial.specification = ENZYMES_MECHANISM_TEST_MATERIAL_DEFAULTS.specification;
      }
      targetMaterial.instructional_archetype = "mechanism_explanation";
      targetMaterial.archetype_plan = clonePlan();
      var after = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype,
        archetype_plan: targetMaterial.archetype_plan
      });

      var validation = validateMaterialArchetypePlan(targetMaterial, {
        activityId: nonEmptyString(targetActivity.activity_id),
        materialId: DESIGNATED_MATERIAL_ID
      });

      return {
        ok: validation.ok,
        changed: before !== after,
        page: page,
        activity_id: nonEmptyString(targetActivity.activity_id),
        material_id: DESIGNATED_MATERIAL_ID,
        instructional_archetype: "mechanism_explanation",
        archetype_plan: clonePlan(),
        errors: validation.errors || []
      };
    }

    /**
     * Deterministic stamp for the explicit process_walkthrough transfer test.
     * Call only when process opt-in is true.
     */
    /** Legacy S59 capture stamp (regression-only; not production selection). */
    function applyEnzymesProcessTestPlanToDlaPage(page) {
      if (!isPlainObject(page) || !Array.isArray(page.activities) || !page.activities.length) {
        return {
          ok: false,
          changed: false,
          page: page,
          errors: ["page.activities[] required to apply process test plan"]
        };
      }

      var existing = findDesignatedProcessMaterial(page);
      var targetActivity = null;
      var targetMaterial = null;

      if (existing) {
        targetActivity = page.activities.find(function (act) {
          return nonEmptyString(act && act.activity_id) === existing.activityId;
        });
        targetMaterial = existing.material;
      } else {
        targetActivity =
          page.activities.find(function (act) {
            return nonEmptyString(act && act.activity_id) === DESIGNATED_PROCESS_ACTIVITY_ID;
          }) || page.activities[0];
        if (!targetActivity || typeof targetActivity !== "object") {
          return {
            ok: false,
            changed: false,
            page: page,
            errors: ["no activity available for designated process material"]
          };
        }
        if (!Array.isArray(targetActivity.required_materials)) {
          targetActivity.required_materials = [];
        }
        targetMaterial = {
          material_id: DESIGNATED_PROCESS_MATERIAL_ID,
          material_type: ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.material_type,
          purpose: ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.purpose,
          specification: ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.specification
        };
        targetActivity.required_materials.push(targetMaterial);
      }

      var before = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype || null,
        archetype_plan: targetMaterial.archetype_plan || null
      });
      targetMaterial.material_id = DESIGNATED_PROCESS_MATERIAL_ID;
      if (!nonEmptyString(targetMaterial.material_type || targetMaterial.type)) {
        targetMaterial.material_type = ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.material_type;
      }
      if (!nonEmptyString(targetMaterial.purpose)) {
        targetMaterial.purpose = ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.purpose;
      }
      if (!nonEmptyString(targetMaterial.specification)) {
        targetMaterial.specification = ENZYMES_PROCESS_TEST_MATERIAL_DEFAULTS.specification;
      }
      targetMaterial.instructional_archetype = "process_walkthrough";
      targetMaterial.archetype_plan = cloneProcessPlan();
      var after = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype,
        archetype_plan: targetMaterial.archetype_plan
      });

      var validation = validateMaterialArchetypePlan(targetMaterial, {
        activityId: nonEmptyString(targetActivity.activity_id),
        materialId: DESIGNATED_PROCESS_MATERIAL_ID
      });

      return {
        ok: validation.ok,
        changed: before !== after,
        page: page,
        activity_id: nonEmptyString(targetActivity.activity_id),
        material_id: DESIGNATED_PROCESS_MATERIAL_ID,
        instructional_archetype: "process_walkthrough",
        archetype_plan: cloneProcessPlan(),
        errors: validation.errors || []
      };
    }

    /**
     * Deterministic stamp for the explicit mental_model_building transfer test.
     * Call only when mental-model opt-in is true.
     */
    /** Legacy S59 capture stamp (regression-only; not production selection). */
    function applyThermostatMentalModelTestPlanToDlaPage(page) {
      if (!isPlainObject(page) || !Array.isArray(page.activities) || !page.activities.length) {
        return {
          ok: false,
          changed: false,
          page: page,
          errors: ["page.activities[] required to apply mental-model test plan"]
        };
      }

      var existing = findDesignatedMentalModelMaterial(page);
      var targetActivity = null;
      var targetMaterial = null;

      if (existing) {
        targetActivity = page.activities.find(function (act) {
          return nonEmptyString(act && act.activity_id) === existing.activityId;
        });
        targetMaterial = existing.material;
      } else {
        targetActivity =
          page.activities.find(function (act) {
            return (
              nonEmptyString(act && act.activity_id) === DESIGNATED_MENTAL_MODEL_ACTIVITY_ID
            );
          }) || page.activities[0];
        if (!targetActivity || typeof targetActivity !== "object") {
          return {
            ok: false,
            changed: false,
            page: page,
            errors: ["no activity available for designated mental-model material"]
          };
        }
        if (!Array.isArray(targetActivity.required_materials)) {
          targetActivity.required_materials = [];
        }
        targetMaterial = {
          material_id: DESIGNATED_MENTAL_MODEL_MATERIAL_ID,
          material_type: THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.material_type,
          purpose: THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.purpose,
          specification: THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.specification
        };
        targetActivity.required_materials.push(targetMaterial);
      }

      var before = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype || null,
        archetype_plan: targetMaterial.archetype_plan || null
      });
      targetMaterial.material_id = DESIGNATED_MENTAL_MODEL_MATERIAL_ID;
      if (!nonEmptyString(targetMaterial.material_type || targetMaterial.type)) {
        targetMaterial.material_type =
          THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.material_type;
      }
      if (!nonEmptyString(targetMaterial.purpose)) {
        targetMaterial.purpose = THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.purpose;
      }
      if (!nonEmptyString(targetMaterial.specification)) {
        targetMaterial.specification =
          THERMOSTAT_MENTAL_MODEL_TEST_MATERIAL_DEFAULTS.specification;
      }
      targetMaterial.instructional_archetype = "mental_model_building";
      targetMaterial.archetype_plan = cloneMentalModelPlan();
      var after = JSON.stringify({
        instructional_archetype: targetMaterial.instructional_archetype,
        archetype_plan: targetMaterial.archetype_plan
      });

      var validation = validateMaterialArchetypePlan(targetMaterial, {
        activityId: nonEmptyString(targetActivity.activity_id),
        materialId: DESIGNATED_MENTAL_MODEL_MATERIAL_ID
      });

      return {
        ok: validation.ok,
        changed: before !== after,
        page: page,
        activity_id: nonEmptyString(targetActivity.activity_id),
        material_id: DESIGNATED_MENTAL_MODEL_MATERIAL_ID,
        instructional_archetype: "mental_model_building",
        archetype_plan: cloneMentalModelPlan(),
        errors: validation.errors || []
      };
    }

    function collectRoutingDebugSnapshots(page) {
      var validated = validatePageArchetypePlans(page);
      return (validated.activeAssignments || []).map(function (row) {
        var ruleText = String(RULES[row.archetype] || "");
        return {
          activity_id: row.activityId,
          material_id: row.materialId,
          instructional_archetype: row.archetype,
          archetype_plan: planPayloadForPrompt(row.archetype, row.plan),
          rule_selected: true,
          selected_rule_text: ruleText,
          rule_preview: ruleText.slice(0, 80),
          loaded_archetype_script_version: SCRIPT_VERSION
        };
      });
    }

    function measureArchetypeRoutingPromptGrowth(page) {
      var validated = validatePageArchetypePlans(page);
      var assignments = validated.activeAssignments || [];
      if (!assignments.length) {
        return {
          chars: 0,
          compactRuleChars: 0,
          planningValueChars: 0,
          formattingOverheadChars: 0,
          selectedRules: [],
          legacyPathGrowth: 0
        };
      }
      var compactRuleChars = 0;
      var planningValueChars = 0;
      var selected = {};
      assignments.forEach(function (row) {
        var arch = row.archetype;
        if (!RULES[arch]) return;
        selected[arch] = true;
        compactRuleChars += RULES[arch].length;
        planningValueChars += JSON.stringify(
          planPayloadForPrompt(arch, row.plan)
        ).length;
      });
      var block = buildArchetypeRoutingBlock(page);
      var total = block.length;
      var formattingOverheadChars = Math.max(
        0,
        total - compactRuleChars - planningValueChars
      );
      return {
        chars: total,
        compactRuleChars: compactRuleChars,
        planningValueChars: planningValueChars,
        formattingOverheadChars: formattingOverheadChars,
        selectedRules: Object.keys(selected).sort(),
        legacyPathGrowth: 0
      };
    }

    var ACCEPTANCE_RULE =
      "Do not evaluate archetype quality until archetype_delivery.pass is true.";
    var ARCHETYPE_ID_PATTERN =
      "(mechanism_explanation|process_walkthrough|mental_model_building)";

    function uniqueSortedArchetypeIds(ids) {
      var seen = {};
      var out = [];
      (ids || []).forEach(function (id) {
        var key = nonEmptyString(id);
        if (!key || seen[key]) return;
        seen[key] = true;
        out.push(key);
      });
      return out.sort();
    }

    /**
     * Expected Priority-1 archetypes from persisted DLA required_materials (SoT).
     */
    function collectExpectedInstructionalArchetypesFromPage(page) {
      var validated = validatePageArchetypePlans(page);
      var ids = (validated.activeAssignments || []).map(function (row) {
        return nonEmptyString(row.archetype);
      });
      return uniqueSortedArchetypeIds(ids);
    }

    /**
     * Delivered Priority-1 archetypes inferred from the final constructed GAM prompt.
     */
    function collectDeliveredInstructionalArchetypesFromPrompt(promptText) {
      var text = String(promptText || "");
      var ids = [];
      var materialRe = new RegExp(
        "instructional_archetype=" + ARCHETYPE_ID_PATTERN,
        "gi"
      );
      var match;
      while ((match = materialRe.exec(text)) !== null) {
        ids.push(match[1]);
      }
      var selectedRe = text.match(
        /Selected rule ids for this request:\s*([^\n.]+)/i
      );
      if (selectedRe && selectedRe[1]) {
        selectedRe[1].split(",").forEach(function (part) {
          var id = nonEmptyString(part);
          if (id && ALLOWED[id]) ids.push(id);
        });
      }
      return uniqueSortedArchetypeIds(ids);
    }

    function analyzePromptArchetypeRuleFlags(promptText) {
      var text = String(promptText || "");
      return {
        contains_archetype_routing: /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(text),
        contains_mechanism_rule:
          text.indexOf(RULES.mechanism_explanation) >= 0 ||
          /Realise every entry in required_links/i.test(text),
        contains_process_rule:
          /Realise the process_goal as .+worked walkthrough/i.test(text) ||
          text.indexOf(RULES.process_walkthrough) >= 0,
        contains_mental_model_rule:
          /Build a coherent account of the named system using the supplied relationships and governing constraint/i.test(
            text
          ) || text.indexOf(RULES.mental_model_building) >= 0
      };
    }

    /**
     * Delivery verification: compare DLA SoT expectations vs final GAM prompt.
     * Does not use activation flags or S59 test tokens.
     */
    function buildArchetypeDeliveryVerification(page, promptText) {
      var expected = isPlainObject(page)
        ? collectExpectedInstructionalArchetypesFromPage(page)
        : [];
      var delivered = collectDeliveredInstructionalArchetypesFromPrompt(promptText);
      var missing = expected.filter(function (id) {
        return delivered.indexOf(id) < 0;
      });
      return {
        expected: expected,
        delivered: delivered,
        missing: missing,
        pass: missing.length === 0
      };
    }

    /**
     * Sprint-neutral final GAM prompt observability snapshot (Sprint 60 Phase B).
     */
    function buildFinalGamPromptObservabilitySnapshot(promptText, meta, page) {
      var text = String(promptText || "");
      var info = meta && typeof meta === "object" ? meta : {};
      var pageObj = isPlainObject(page) ? page : null;
      var ruleFlags = analyzePromptArchetypeRuleFlags(text);
      var delivered = collectDeliveredInstructionalArchetypesFromPrompt(text);
      var archetype_delivery = buildArchetypeDeliveryVerification(pageObj, text);
      var archMatch = text.match(
        new RegExp("instructional_archetype=" + ARCHETYPE_ID_PATTERN, "i")
      );

      return {
        prompt: text,
        source: info.source ? String(info.source) : "unknown",
        step_title: String(info.step_title || info.stepTitle || "").trim(),
        canonical_step_id: String(
          info.canonical_step_id || info.stepCanonicalStepId || ""
        ).trim(),
        archetype_script_version: SCRIPT_VERSION,
        contains_depth_contract: /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/i.test(text),
        contains_archetype_routing: ruleFlags.contains_archetype_routing,
        contains_mechanism_rule: ruleFlags.contains_mechanism_rule,
        contains_process_rule: ruleFlags.contains_process_rule,
        contains_mental_model_rule: ruleFlags.contains_mental_model_rule,
        contains_process_goal: /process_goal/i.test(text),
        contains_thermostat_fixture:
          /a room heated by a thermostat-controlled heater/i.test(text) &&
          /governing_constraint/i.test(text),
        selected_instructional_archetypes: delivered,
        selected_instructional_archetype: archMatch
          ? archMatch[1]
          : delivered[0] || null,
        archetype_delivery: archetype_delivery,
        acceptance_rule: ACCEPTANCE_RULE,
        prompt_length: text.length,
        timestamp: new Date().toISOString(),
        at: Date.now()
      };
    }

    return {
      MODULE_ID: MODULE_ID,
      SCRIPT_VERSION: SCRIPT_VERSION,
      PROCESS_RULE_FROZEN_VERSION: PROCESS_RULE_FROZEN_VERSION,
      MARKER: MARKER,
      DLA_MECHANISM_TEST_MARKER: DLA_MECHANISM_TEST_MARKER,
      DLA_PROCESS_TEST_MARKER: DLA_PROCESS_TEST_MARKER,
      DLA_MENTAL_MODEL_TEST_MARKER: DLA_MENTAL_MODEL_TEST_MARKER,
      MECHANISM_TEST_OPT_IN_TOKEN: MECHANISM_TEST_OPT_IN_TOKEN,
      PROCESS_TEST_OPT_IN_TOKEN: PROCESS_TEST_OPT_IN_TOKEN,
      MENTAL_MODEL_TEST_OPT_IN_TOKEN: MENTAL_MODEL_TEST_OPT_IN_TOKEN,
      DESIGNATED_ACTIVITY_ID: DESIGNATED_ACTIVITY_ID,
      DESIGNATED_MATERIAL_ID: DESIGNATED_MATERIAL_ID,
      DESIGNATED_PROCESS_ACTIVITY_ID: DESIGNATED_PROCESS_ACTIVITY_ID,
      DESIGNATED_PROCESS_MATERIAL_ID: DESIGNATED_PROCESS_MATERIAL_ID,
      DESIGNATED_MENTAL_MODEL_ACTIVITY_ID: DESIGNATED_MENTAL_MODEL_ACTIVITY_ID,
      DESIGNATED_MENTAL_MODEL_MATERIAL_ID: DESIGNATED_MENTAL_MODEL_MATERIAL_ID,
      ENZYMES_MECHANISM_TEST_PLAN: ENZYMES_MECHANISM_TEST_PLAN,
      ENZYMES_PROCESS_TEST_PLAN: ENZYMES_PROCESS_TEST_PLAN,
      THERMOSTAT_MENTAL_MODEL_TEST_PLAN: THERMOSTAT_MENTAL_MODEL_TEST_PLAN,
      ALLOWED_ARCHETYPES: Object.keys(ALLOWED).slice(),
      RULES: RULES,
      PLAN_KEYS: PLAN_KEYS,
      isAllowedArchetype: isAllowedArchetype,
      materialTypeOf: materialTypeOf,
      validateMaterialArchetypePlan: validateMaterialArchetypePlan,
      validatePageArchetypePlans: validatePageArchetypePlans,
      buildArchetypeRoutingBlock: buildArchetypeRoutingBlock,
      archetypeRoutingAlreadyPresent: archetypeRoutingAlreadyPresent,
      stripArchetypeRoutingBlockFromDraft: stripArchetypeRoutingBlockFromDraft,
      applyArchetypeRoutingBlockToDraft: applyArchetypeRoutingBlockToDraft,
      softDiagnoseRubricLabelsInBody: softDiagnoseRubricLabelsInBody,
      estimateRoutingPromptGrowth: estimateRoutingPromptGrowth,
      measureArchetypeRoutingPromptGrowth: measureArchetypeRoutingPromptGrowth,
      collectRequiredMaterialsFromPage: collectRequiredMaterialsFromPage,
      buildS59GamArchetypeRuntimeSnapshot: buildS59GamArchetypeRuntimeSnapshot,
      isMechanismTestOptIn: isMechanismTestOptIn,
      isProcessTestOptIn: isProcessTestOptIn,
      isMentalModelTestOptIn: isMentalModelTestOptIn,
      resolveS59DlaTestSelection: resolveS59DlaTestSelection,
      buildS59DlaTestActivationSnapshot: buildS59DlaTestActivationSnapshot,
      buildDlaMechanismTestEmissionBlock: buildDlaMechanismTestEmissionBlock,
      buildDlaProcessTestEmissionBlock: buildDlaProcessTestEmissionBlock,
      buildDlaMentalModelTestEmissionBlock: buildDlaMentalModelTestEmissionBlock,
      applyDlaMechanismTestEmissionBlockToDraft: applyDlaMechanismTestEmissionBlockToDraft,
      applyDlaProcessTestEmissionBlockToDraft: applyDlaProcessTestEmissionBlockToDraft,
      applyDlaMentalModelTestEmissionBlockToDraft: applyDlaMentalModelTestEmissionBlockToDraft,
      applyEnzymesMechanismTestPlanToDlaPage: applyEnzymesMechanismTestPlanToDlaPage,
      applyEnzymesProcessTestPlanToDlaPage: applyEnzymesProcessTestPlanToDlaPage,
      applyThermostatMentalModelTestPlanToDlaPage: applyThermostatMentalModelTestPlanToDlaPage,
      collectRoutingDebugSnapshots: collectRoutingDebugSnapshots,
      ACCEPTANCE_RULE: ACCEPTANCE_RULE,
      collectExpectedInstructionalArchetypesFromPage:
        collectExpectedInstructionalArchetypesFromPage,
      collectDeliveredInstructionalArchetypesFromPrompt:
        collectDeliveredInstructionalArchetypesFromPrompt,
      analyzePromptArchetypeRuleFlags: analyzePromptArchetypeRuleFlags,
      buildArchetypeDeliveryVerification: buildArchetypeDeliveryVerification,
      buildFinalGamPromptObservabilitySnapshot: buildFinalGamPromptObservabilitySnapshot
    };
  }
);
