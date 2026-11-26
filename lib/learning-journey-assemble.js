/**
 * Sprint 105 Milestone 1 — Learning Journey progressive capture contracts
 * and deterministic final Design Page assembly (S105-D02).
 *
 * Architectural invariants:
 * - The final Learning Journey Design Page contract (lib/learning-journey-design-page.js)
 *   is immutable; intermediate stage schemas derive from it.
 * - Zero intermediate-only fields may leak into the assembled final Design Page.
 * - All five accepted, valid, current stage captures are required for progressive assembly.
 * - Strict legacy separation: monolithic Step 5 capture is never accepted as a bypass
 *   for explicitly progressive workflows.
 * - Deterministic transport: Stage 1 learning_outcomes and brief-provided authoritative
 *   source material are transported deterministically by the assembler rather than
 *   regenerated downstream.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_LEARNING_JOURNEY_ASSEMBLE = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function (root) {
    "use strict";

    var STAGE_ARTIFACT_TYPE = "learning_journey_stage";
    var STAGE_SCHEMA_VERSION = "1.0.0";
    var FINAL_PAGE_ARTIFACT_TYPE = "page";
    var FINAL_PAGE_SCHEMA_VERSION = "2.0.0";
    var FINAL_PAGE_PRODUCT_ID = "learning_journey";
    var PROGRESSIVE_CAPTURE_VERSION = "s105_v1";

    var JOURNEY_OUTCOMES_BEGIN = "<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>";
    var JOURNEY_OUTCOMES_END = "<<<JOURNEY_LEARNING_OUTCOMES_END>>>";
    var COMPONENT_OUTCOMES_BEGIN = "<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>";
    var COMPONENT_OUTCOMES_END = "<<<COMPONENT_LEARNING_OUTCOMES_END>>>";
    var JOURNAL_DEFAULT_TITLE = "Your Learning Journal";
    var JOURNAL_ARTEFACT_ID_RE = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/;

    var STAGE_ORDER = [
      "learning_requirements",
      "learning_progression",
      "learning_elements",
      "learning_commissions",
      "design_page"
    ];

    var STAGE_CANONICAL_STEP_IDS = {
      learning_requirements: ["step_journey_requirements"],
      learning_progression: ["step_journey_progression"],
      learning_elements: ["step_journey_elements"],
      learning_commissions: ["step_journey_commissioning"],
      design_page: ["step_design_page"]
    };

    var NEW_JOURNEY_SUPPORTED_PRODUCTS = {
      practice: true,
      expository: true,
      assessment_pack: true,
      situated_task: true
    };

    var ALL_SUPPORTED_PRODUCTS = {
      practice: true,
      expository: true,
      assessment_pack: true,
      situated_task: true,
      interactive: true
    };

    var STAGE1_ALLOWED_KEYS = toKeySet([
      "artifact_type",
      "schema_version",
      "stage",
      "journey_allocated_minutes",
      "learning_outcomes",
      "learner_profile",
      "purpose",
      "body_of_knowledge",
      "constraints_and_tradeoffs",
      "journal_orientation"
    ]);

    var STAGE2_ALLOWED_KEYS = toKeySet([
      "artifact_type",
      "schema_version",
      "stage",
      "journey_structure",
      "developmental_phases",
      "developmental_arc",
      "journal_note"
    ]);

    var STAGE2_STRUCTURE_ALLOWED_KEYS = toKeySet([
      "mode",
      "rationale",
      "constituent_journeys"
    ]);

    var STAGE2_CONSTITUENT_ALLOWED_KEYS = toKeySet([
      "constituent_id",
      "title",
      "purpose",
      "indicative_minutes"
    ]);

    var STAGE2_PHASE_ALLOWED_KEYS = toKeySet([
      "phase_id",
      "title",
      "constituent_id",
      "purpose",
      "indicative_minutes",
      "scaffolding_and_evidence",
      "dependencies"
    ]);

    var STAGE3_ALLOWED_KEYS = toKeySet([
      "artifact_type",
      "schema_version",
      "stage",
      "elements",
      "boundary_notes"
    ]);

    var STAGE3_ELEMENT_ALLOWED_KEYS = toKeySet([
      "element_id",
      "phase_id",
      "title",
      "educational_job",
      "knowledge_focus",
      "indicative_minutes",
      "scaffolding_and_feedback",
      "dependencies",
      "journal_producer_candidate"
    ]);

    var STAGE4_ALLOWED_KEYS = toKeySet([
      "artifact_type",
      "schema_version",
      "stage",
      "shared_authoritative_material",
      "commissions",
      "continuity",
      "journal",
      "feasibility_note"
    ]);

    var STAGE4_SHARED_MATERIAL_ALLOWED_KEYS = toKeySet(["status", "content"]);

    var STAGE4_COMMISSION_ALLOWED_KEYS = toKeySet([
      "commission_id",
      "section_id",
      "order",
      "title",
      "product_id",
      "status",
      "allocated_minutes",
      "specification_text",
      "journey_context_text",
      "dependencies",
      "artefact_references",
      "element_ids",
      "relevant_journey_outcome_numbers"
    ]);

    var STAGE4_JOURNAL_ALLOWED_KEYS = toKeySet([
      "enabled",
      "decision_basis",
      "title",
      "entries"
    ]);

    var STAGE4_JOURNAL_ENTRY_ALLOWED_KEYS = toKeySet([
      "entry_id",
      "order",
      "title",
      "artefact_id",
      "framing"
    ]);

    var DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS = [
      "title",
      "editorial_opening_image",
      "sections",
      "learning_journey",
      "assembly_state"
    ];

    var STAGE5_ALLOWED_KEYS = toKeySet([
      "artifact_type",
      "schema_version",
      "product_id",
      "title",
      "editorial_opening_image",
      "sections",
      "learning_journey",
      "assembly_state"
    ]);

    var STAGE5_SECTION_ALLOWED_KEYS = toKeySet([
      "section_id",
      "title",
      "order",
      "exposition"
    ]);

    var STAGE5_LEARNING_JOURNEY_ALLOWED_KEYS = toKeySet(["design_intent", "journal"]);

    var STAGE5_JOURNAL_ALLOWED_KEYS = toKeySet(["title", "entries"]);

    var STAGE5_JOURNAL_ENTRY_ALLOWED_KEYS = toKeySet(["entry_id", "framing"]);

    var STAGE5_OPENING_IMAGE_ALLOWED_KEYS = toKeySet([
      "decision",
      "subject",
      "context",
      "caption_intent",
      "alt_text",
      "detailed_description",
      "skip_reason"
    ]);

    function toKeySet(keys) {
      var map = Object.create(null);
      var i;
      for (i = 0; i < keys.length; i += 1) {
        map[keys[i]] = true;
      }
      return map;
    }

    function asText(value) {
      return String(value == null ? "" : value).trim();
    }

    function normalizeNewlines(value) {
      return asText(value).replace(/\r\n/g, "\n");
    }

    function isPlainObject(value) {
      return !!value && typeof value === "object" && !Array.isArray(value);
    }

    function deepClone(value) {
      return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }

    function isPositiveInteger(value) {
      return typeof value === "number" && isFinite(value) && value > 0 && Math.floor(value) === value;
    }

    function resolveDesignPageMod() {
      if (typeof module === "object" && module.exports) {
        try {
          return require("./learning-journey-design-page.js");
        } catch (_err) {}
      }
      if (root && root.PRISM_LEARNING_JOURNEY_DESIGN_PAGE) {
        return root.PRISM_LEARNING_JOURNEY_DESIGN_PAGE;
      }
      if (typeof globalThis !== "undefined" && globalThis.PRISM_LEARNING_JOURNEY_DESIGN_PAGE) {
        return globalThis.PRISM_LEARNING_JOURNEY_DESIGN_PAGE;
      }
      return null;
    }

    function resolveSharedSourceMod() {
      if (typeof module === "object" && module.exports) {
        try {
          return require("./learning-journey-shared-source.js");
        } catch (_err) {}
      }
      if (root && root.PRISM_LEARNING_JOURNEY_SHARED_SOURCE) {
        return root.PRISM_LEARNING_JOURNEY_SHARED_SOURCE;
      }
      if (typeof globalThis !== "undefined" && globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE) {
        return globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE;
      }
      return null;
    }

    function resolveLoBindMod() {
      if (typeof module === "object" && module.exports) {
        try {
          return require("./commission-native-lo-bind.js");
        } catch (_err) {}
      }
      if (root && root.PRISM_COMMISSION_NATIVE_LO_BIND) {
        return root.PRISM_COMMISSION_NATIVE_LO_BIND;
      }
      if (typeof globalThis !== "undefined" && globalThis.PRISM_COMMISSION_NATIVE_LO_BIND) {
        return globalThis.PRISM_COMMISSION_NATIVE_LO_BIND;
      }
      return null;
    }

    function parseJsonObjectInput(raw, label) {
      if (raw == null || raw === "") {
        return { ok: false, value: null, error: (label || "capture") + "_missing" };
      }
      if (isPlainObject(raw)) {
        return { ok: true, value: raw, error: "" };
      }
      if (typeof raw === "string") {
        var trimmed = raw.trim();
        var fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
        if (fenceMatch) trimmed = String(fenceMatch[1] || "").trim();
        try {
          var parsed = JSON.parse(trimmed);
          if (!isPlainObject(parsed)) {
            return { ok: false, value: null, error: (label || "capture") + "_must_be_json_object" };
          }
          return { ok: true, value: parsed, error: "" };
        } catch (_err) {
          return { ok: false, value: null, error: (label || "capture") + "_invalid_json" };
        }
      }
      return { ok: false, value: null, error: (label || "capture") + "_must_be_json_object" };
    }

    function collectDisallowedKeys(obj, allowedSet, prefix, errors) {
      if (!isPlainObject(obj)) return;
      var keys = Object.keys(obj);
      var i;
      for (i = 0; i < keys.length; i += 1) {
        if (!allowedSet[keys[i]]) {
          errors.push((prefix ? prefix + "." : "") + "disallowed_field:" + keys[i]);
        }
      }
    }

    function validateStringOrStringList(value, label, required, errors) {
      if (value === undefined || value === null) {
        if (required) errors.push(label + " required");
        return;
      }
      if (typeof value === "string") {
        if (required && !asText(value)) errors.push(label + " required");
        return;
      }
      if (Array.isArray(value)) {
        if (required && !value.length) {
          errors.push(label + " must be non-empty");
          return;
        }
        var i;
        for (i = 0; i < value.length; i += 1) {
          if (typeof value[i] !== "string" || !asText(value[i])) {
            errors.push(label + "[" + i + "] must be a non-empty string");
          }
        }
        return;
      }
      errors.push(label + " must be a string or string array");
    }

    function validateOptionalString(value, label, errors) {
      if (value === undefined || value === null) return;
      if (typeof value !== "string") {
        errors.push(label + " must be a string");
      }
    }

    function validateCanonicalDloObject(dlo, label, errors) {
      if (!isPlainObject(dlo)) {
        errors.push(label + " must be an object in canonical DLO shape");
        return;
      }
      var rows = dlo.learning_outcomes;
      if (!Array.isArray(rows) || !rows.length) {
        errors.push(label + ".learning_outcomes must be a non-empty array");
        return;
      }
      var i;
      for (i = 0; i < rows.length; i += 1) {
        var row = rows[i];
        if (!isPlainObject(row)) {
          errors.push(label + ".learning_outcomes[" + i + "] must be an object");
          continue;
        }
        if (!asText(row.statement)) {
          errors.push(label + ".learning_outcomes[" + i + "].statement required");
        }
        if (row.related_concepts !== undefined && !Array.isArray(row.related_concepts)) {
          errors.push(label + ".learning_outcomes[" + i + "].related_concepts must be an array");
        }
        if (row.cognitive_level !== undefined && typeof row.cognitive_level !== "string") {
          errors.push(label + ".learning_outcomes[" + i + "].cognitive_level must be a string");
        }
        if (row.notes !== undefined && typeof row.notes !== "string") {
          errors.push(label + ".learning_outcomes[" + i + "].notes must be a string");
        }
      }
      validateOptionalString(dlo.learner_level, label + ".learner_level", errors);
      validateOptionalString(dlo.scope, label + ".scope", errors);
      validateOptionalString(dlo.alignment_notes, label + ".alignment_notes", errors);
    }

    function validateStageEnvelope(obj, expectedStage, errors) {
      if (asText(obj.artifact_type) !== STAGE_ARTIFACT_TYPE) {
        errors.push('artifact_type must be "' + STAGE_ARTIFACT_TYPE + '"');
      }
      if (asText(obj.schema_version) !== STAGE_SCHEMA_VERSION) {
        errors.push('schema_version must be "' + STAGE_SCHEMA_VERSION + '"');
      }
      if (asText(obj.stage) !== expectedStage) {
        errors.push('stage must be "' + expectedStage + '"');
      }
    }

    // -------------------------------------------------------------------------
    // Workflow versioning & strict legacy separation (S105-D02 Requirement #6)
    // -------------------------------------------------------------------------

    function readProgressiveCaptureVersion(wf) {
      if (!isPlainObject(wf)) return "";
      var outSpec = isPlainObject(wf.outputSpec) ? wf.outputSpec : null;
      var seed = isPlainObject(wf.deliverySeed) ? wf.deliverySeed : null;
      var brief = isPlainObject(wf.workflowBriefResolution) ? wf.workflowBriefResolution : null;
      var resolved = brief && isPlainObject(brief.resolvedFactors) ? brief.resolvedFactors : null;
      var initial = brief && isPlainObject(brief.initialBrief) ? brief.initialBrief : null;
      var raw =
        (outSpec && (outSpec.progressiveCaptureVersion || outSpec.progressive_capture_version)) ||
        (seed && (seed.progressive_capture_version || seed.progressiveCaptureVersion)) ||
        (resolved &&
          (resolved.progressive_capture_version || resolved.progressiveCaptureVersion)) ||
        (initial && (initial.progressive_capture_version || initial.progressiveCaptureVersion)) ||
        wf.progressive_capture_version ||
        wf.progressiveCaptureVersion ||
        "";
      return asText(raw);
    }

    function isLearningJourneyWorkflowRecord(wf) {
      if (!isPlainObject(wf)) return false;
      var identity = isPlainObject(wf.identity) ? wf.identity : null;
      var seed = isPlainObject(wf.deliverySeed) ? wf.deliverySeed : null;
      var brief = isPlainObject(wf.workflowBriefResolution) ? wf.workflowBriefResolution : null;
      var resolved = brief && isPlainObject(brief.resolvedFactors) ? brief.resolvedFactors : null;
      var product = asText(
        (identity && identity.product) ||
          (seed && (seed.product || seed.product_id)) ||
          (resolved && (resolved.product || resolved.product_id)) ||
          wf.product ||
          wf.product_id ||
          ""
      ).toLowerCase();
      if (product === FINAL_PAGE_PRODUCT_ID) return true;
      var outputType = asText(
        (identity && identity.ldCreateOutputType) ||
          (seed && seed.ld_create_output_type) ||
          (resolved && resolved.ld_create_output_type) ||
          ""
      ).toLowerCase();
      if (outputType === "learning_journey") return true;
      var steps = Array.isArray(wf.steps) ? wf.steps : [];
      var i;
      for (i = 0; i < steps.length; i += 1) {
        var cid = asText(
          steps[i] && (steps[i].canonical_step_id || steps[i].canonicalStepId)
        ).toLowerCase();
        if (cid === "step_journey_requirements" || cid === "step_journey_commissioning") {
          return true;
        }
      }
      return false;
    }

    function isProgressiveLearningJourneyWorkflow(wf) {
      if (!isPlainObject(wf)) return false;
      if (readProgressiveCaptureVersion(wf)) return true;
      var outSpec = isPlainObject(wf.outputSpec) ? wf.outputSpec : null;
      if (outSpec && outSpec.partialPageOutputs === true && isLearningJourneyWorkflowRecord(wf)) {
        return true;
      }
      return false;
    }

    function classifyLearningJourneyWorkflowMode(wf) {
      return isProgressiveLearningJourneyWorkflow(wf) ? "progressive" : "legacy_monolithic";
    }

    function isMonolithicLearningJourneyDesignPageShape(parsed) {
      if (!isPlainObject(parsed)) return false;
      if (asText(parsed.artifact_type).toLowerCase() !== FINAL_PAGE_ARTIFACT_TYPE) return false;
      if (asText(parsed.product_id).toLowerCase() !== FINAL_PAGE_PRODUCT_ID) return false;
      return (
        Object.prototype.hasOwnProperty.call(parsed, "commissions") ||
        Object.prototype.hasOwnProperty.call(parsed, "shared_authoritative_material")
      );
    }

    // -------------------------------------------------------------------------
    // Stage 1 — learning_requirements
    // -------------------------------------------------------------------------

    function validateLearningJourneyRequirementsPartial(input, options) {
      var opts = isPlainObject(options) ? options : {};
      var parsedRes = parseJsonObjectInput(input, "learning_requirements");
      if (!parsedRes.ok) return { ok: false, errors: [parsedRes.error] };
      var obj = parsedRes.value;
      var errors = [];

      validateStageEnvelope(obj, "learning_requirements", errors);
      collectDisallowedKeys(obj, STAGE1_ALLOWED_KEYS, "learning_requirements", errors);

      if (!isPositiveInteger(obj.journey_allocated_minutes)) {
        errors.push("learning_requirements.journey_allocated_minutes must be a positive integer");
      } else if (opts.parentAuthoritativeMinutes != null) {
        if (!isPositiveInteger(opts.parentAuthoritativeMinutes)) {
          errors.push("parent_authoritative_minutes must be a positive integer");
        } else if (obj.journey_allocated_minutes !== opts.parentAuthoritativeMinutes) {
          errors.push(
            "journey_duration_conflict: learning_requirements.journey_allocated_minutes (" +
              obj.journey_allocated_minutes +
              ") disagrees with authoritative Learning Journey duration (" +
              opts.parentAuthoritativeMinutes +
              ")"
          );
        }
      }

      validateCanonicalDloObject(obj.learning_outcomes, "learning_requirements.learning_outcomes", errors);

      if (typeof obj.learner_profile !== "string" || !asText(obj.learner_profile)) {
        errors.push("learning_requirements.learner_profile required");
      }
      if (typeof obj.purpose !== "string" || !asText(obj.purpose)) {
        errors.push("learning_requirements.purpose required");
      }
      validateStringOrStringList(
        obj.body_of_knowledge,
        "learning_requirements.body_of_knowledge",
        true,
        errors
      );
      validateOptionalString(
        obj.constraints_and_tradeoffs,
        "learning_requirements.constraints_and_tradeoffs",
        errors
      );
      validateOptionalString(
        obj.journal_orientation,
        "learning_requirements.journal_orientation",
        errors
      );

      return { ok: errors.length === 0, errors: errors, value: obj };
    }

    // -------------------------------------------------------------------------
    // Stage 2 — learning_progression
    // -------------------------------------------------------------------------

    function validateLearningJourneyProgressionPartial(input, options) {
      var opts = isPlainObject(options) ? options : {};
      var parsedRes = parseJsonObjectInput(input, "learning_progression");
      if (!parsedRes.ok) return { ok: false, errors: [parsedRes.error] };
      var obj = parsedRes.value;
      var errors = [];

      validateStageEnvelope(obj, "learning_progression", errors);
      collectDisallowedKeys(obj, STAGE2_ALLOWED_KEYS, "learning_progression", errors);

      var req = isPlainObject(opts.requirements) ? opts.requirements : null;
      var targetMinutes =
        req && isPositiveInteger(req.journey_allocated_minutes)
          ? req.journey_allocated_minutes
          : isPositiveInteger(opts.parentAuthoritativeMinutes)
            ? opts.parentAuthoritativeMinutes
            : null;

      var constituentMap = Object.create(null);
      var mode = "";
      if (!isPlainObject(obj.journey_structure)) {
        errors.push("learning_progression.journey_structure must be an object");
      } else {
        collectDisallowedKeys(
          obj.journey_structure,
          STAGE2_STRUCTURE_ALLOWED_KEYS,
          "learning_progression.journey_structure",
          errors
        );
        mode = asText(obj.journey_structure.mode).toLowerCase();
        if (mode !== "single" && mode !== "constituent") {
          errors.push('learning_progression.journey_structure.mode must be "single" or "constituent"');
        }
        if (
          typeof obj.journey_structure.rationale !== "string" ||
          !asText(obj.journey_structure.rationale)
        ) {
          errors.push("learning_progression.journey_structure.rationale required");
        }
        var constituents = obj.journey_structure.constituent_journeys;
        if (mode === "constituent") {
          if (!Array.isArray(constituents) || !constituents.length) {
            errors.push(
              "learning_progression.journey_structure.constituent_journeys required when mode is constituent"
            );
          } else {
            var constituentSum = 0;
            var allConstituentMinutesValid = true;
            var ci;
            for (ci = 0; ci < constituents.length; ci += 1) {
              var cRow = constituents[ci];
              var cPrefix = "learning_progression.journey_structure.constituent_journeys[" + ci + "]";
              if (!isPlainObject(cRow)) {
                errors.push(cPrefix + " must be an object");
                allConstituentMinutesValid = false;
                continue;
              }
              collectDisallowedKeys(cRow, STAGE2_CONSTITUENT_ALLOWED_KEYS, cPrefix, errors);
              var cid = asText(cRow.constituent_id);
              if (!cid) errors.push(cPrefix + ".constituent_id required");
              else if (constituentMap[cid]) errors.push("duplicate_constituent_id:" + cid);
              if (typeof cRow.title !== "string" || !asText(cRow.title)) {
                errors.push(cPrefix + ".title required");
              }
              if (typeof cRow.purpose !== "string" || !asText(cRow.purpose)) {
                errors.push(cPrefix + ".purpose required");
              }
              if (!isPositiveInteger(cRow.indicative_minutes)) {
                errors.push(cPrefix + ".indicative_minutes must be a positive integer");
                allConstituentMinutesValid = false;
              } else {
                constituentSum += cRow.indicative_minutes;
                if (cid && !constituentMap[cid]) {
                  constituentMap[cid] = cRow.indicative_minutes;
                }
              }
            }
            if (allConstituentMinutesValid && targetMinutes != null && constituentSum !== targetMinutes) {
              errors.push(
                "progression_constituent_minutes_mismatch: sum of constituent_journeys[].indicative_minutes (" +
                  constituentSum +
                  ") does not equal Stage 1 journey_allocated_minutes (" +
                  targetMinutes +
                  ")"
              );
            }
          }
        } else if (mode === "single" && constituents !== undefined) {
          if (!Array.isArray(constituents) || constituents.length > 0) {
            errors.push(
              "learning_progression.journey_structure.constituent_journeys must be omitted or empty when mode is single"
            );
          }
        }
      }

      if (!Array.isArray(obj.developmental_phases) || !obj.developmental_phases.length) {
        errors.push("learning_progression.developmental_phases must be a non-empty array");
      } else {
        var seenPhase = Object.create(null);
        var phaseSum = 0;
        var allPhaseMinutesValid = true;
        var constituentPhaseSums = Object.create(null);
        var pi;
        for (pi = 0; pi < obj.developmental_phases.length; pi += 1) {
          var phase = obj.developmental_phases[pi];
          var pPrefix = "learning_progression.developmental_phases[" + pi + "]";
          if (!isPlainObject(phase)) {
            errors.push(pPrefix + " must be an object");
            allPhaseMinutesValid = false;
            continue;
          }
          collectDisallowedKeys(phase, STAGE2_PHASE_ALLOWED_KEYS, pPrefix, errors);
          var pid = asText(phase.phase_id);
          if (!pid) errors.push(pPrefix + ".phase_id required");
          else if (seenPhase[pid]) errors.push("duplicate_phase_id:" + pid);
          else seenPhase[pid] = true;

          if (typeof phase.title !== "string" || !asText(phase.title)) {
            errors.push(pPrefix + ".title required");
          }
          if (typeof phase.purpose !== "string" || !asText(phase.purpose)) {
            errors.push(pPrefix + ".purpose required");
          }
          if (!isPositiveInteger(phase.indicative_minutes)) {
            errors.push(pPrefix + ".indicative_minutes must be a positive integer");
            allPhaseMinutesValid = false;
          } else {
            phaseSum += phase.indicative_minutes;
          }
          if (
            typeof phase.scaffolding_and_evidence !== "string" ||
            !asText(phase.scaffolding_and_evidence)
          ) {
            errors.push(pPrefix + ".scaffolding_and_evidence required");
          }
          validateStringOrStringList(phase.dependencies, pPrefix + ".dependencies", false, errors);

          if (mode === "constituent") {
            var pCid = asText(phase.constituent_id);
            if (!pCid) {
              errors.push(pPrefix + ".constituent_id required when journey_structure.mode is constituent");
            } else if (constituentMap[pCid] === undefined) {
              errors.push(pPrefix + ".constituent_id unknown:" + pCid);
            } else if (isPositiveInteger(phase.indicative_minutes)) {
              constituentPhaseSums[pCid] = (constituentPhaseSums[pCid] || 0) + phase.indicative_minutes;
            }
          } else if (phase.constituent_id !== undefined && asText(phase.constituent_id)) {
            errors.push(pPrefix + ".constituent_id forbidden when journey_structure.mode is single");
          }
        }
        if (allPhaseMinutesValid && targetMinutes != null && phaseSum !== targetMinutes) {
          errors.push(
            "progression_phase_minutes_mismatch: sum of developmental_phases[].indicative_minutes (" +
              phaseSum +
              ") does not equal Stage 1 journey_allocated_minutes (" +
              targetMinutes +
              ")"
          );
        }
        if (mode === "constituent" && allPhaseMinutesValid) {
          Object.keys(constituentMap).forEach(function (cidKey) {
            var expected = constituentMap[cidKey];
            var actual = constituentPhaseSums[cidKey] || 0;
            if (actual !== expected) {
              errors.push(
                "progression_constituent_phase_minutes_mismatch:" +
                  cidKey +
                  " (phases " +
                  actual +
                  " vs constituent " +
                  expected +
                  ")"
              );
            }
          });
        }
      }

      if (typeof obj.developmental_arc !== "string" || !asText(obj.developmental_arc)) {
        errors.push("learning_progression.developmental_arc required");
      }
      validateOptionalString(obj.journal_note, "learning_progression.journal_note", errors);

      return { ok: errors.length === 0, errors: errors, value: obj };
    }

    // -------------------------------------------------------------------------
    // Stage 3 — learning_elements
    // -------------------------------------------------------------------------

    function validateLearningJourneyElementsPartial(input, options) {
      var opts = isPlainObject(options) ? options : {};
      var parsedRes = parseJsonObjectInput(input, "learning_elements");
      if (!parsedRes.ok) return { ok: false, errors: [parsedRes.error] };
      var obj = parsedRes.value;
      var errors = [];

      validateStageEnvelope(obj, "learning_elements", errors);
      collectDisallowedKeys(obj, STAGE3_ALLOWED_KEYS, "learning_elements", errors);

      var req = isPlainObject(opts.requirements) ? opts.requirements : null;
      var prog = isPlainObject(opts.progression) ? opts.progression : null;
      var targetMinutes =
        req && isPositiveInteger(req.journey_allocated_minutes)
          ? req.journey_allocated_minutes
          : isPositiveInteger(opts.parentAuthoritativeMinutes)
            ? opts.parentAuthoritativeMinutes
            : null;

      var phaseMap = Object.create(null);
      var hasStage2Phases = false;
      if (prog && Array.isArray(prog.developmental_phases) && prog.developmental_phases.length) {
        hasStage2Phases = true;
        prog.developmental_phases.forEach(function (p) {
          var pid = asText(p && p.phase_id);
          if (pid && isPositiveInteger(p.indicative_minutes)) {
            phaseMap[pid] = p.indicative_minutes;
          }
        });
      }

      if (!Array.isArray(obj.elements) || !obj.elements.length) {
        errors.push("learning_elements.elements must be a non-empty array");
      } else {
        var seenElement = Object.create(null);
        var phaseSums = Object.create(null);
        var phaseCovered = Object.create(null);
        var totalMinutes = 0;
        var allMinutesValid = true;
        var i;
        for (i = 0; i < obj.elements.length; i += 1) {
          var el = obj.elements[i];
          var ePrefix = "learning_elements.elements[" + i + "]";
          if (!isPlainObject(el)) {
            errors.push(ePrefix + " must be an object");
            allMinutesValid = false;
            continue;
          }
          collectDisallowedKeys(el, STAGE3_ELEMENT_ALLOWED_KEYS, ePrefix, errors);
          var eid = asText(el.element_id);
          if (!eid) errors.push(ePrefix + ".element_id required");
          else if (seenElement[eid]) errors.push("duplicate_element_id:" + eid);
          else seenElement[eid] = true;

          var pidRef = asText(el.phase_id);
          if (!pidRef) {
            errors.push(ePrefix + ".phase_id required");
          } else if (hasStage2Phases && phaseMap[pidRef] === undefined) {
            errors.push(ePrefix + ".phase_id unknown_in_progression:" + pidRef);
          } else if (pidRef) {
            phaseCovered[pidRef] = true;
          }

          if (typeof el.title !== "string" || !asText(el.title)) {
            errors.push(ePrefix + ".title required");
          }
          if (typeof el.educational_job !== "string" || !asText(el.educational_job)) {
            errors.push(ePrefix + ".educational_job required");
          }
          validateStringOrStringList(el.knowledge_focus, ePrefix + ".knowledge_focus", true, errors);

          if (!isPositiveInteger(el.indicative_minutes)) {
            errors.push(ePrefix + ".indicative_minutes must be a positive integer");
            allMinutesValid = false;
          } else {
            totalMinutes += el.indicative_minutes;
            if (pidRef) {
              phaseSums[pidRef] = (phaseSums[pidRef] || 0) + el.indicative_minutes;
            }
          }

          validateOptionalString(el.scaffolding_and_feedback, ePrefix + ".scaffolding_and_feedback", errors);
          validateStringOrStringList(el.dependencies, ePrefix + ".dependencies", false, errors);
          if (
            el.journal_producer_candidate !== undefined &&
            typeof el.journal_producer_candidate !== "boolean"
          ) {
            errors.push(ePrefix + ".journal_producer_candidate must be a boolean");
          }
        }

        if (hasStage2Phases) {
          Object.keys(phaseMap).forEach(function (pidKey) {
            if (!phaseCovered[pidKey]) {
              errors.push("progression_phase_uncovered_by_elements:" + pidKey);
            } else if (allMinutesValid && (phaseSums[pidKey] || 0) !== phaseMap[pidKey]) {
              errors.push(
                "element_phase_minutes_mismatch:" +
                  pidKey +
                  " (elements " +
                  (phaseSums[pidKey] || 0) +
                  " vs phase " +
                  phaseMap[pidKey] +
                  ")"
              );
            }
          });
        }

        if (allMinutesValid && targetMinutes != null && totalMinutes !== targetMinutes) {
          errors.push(
            "elements_total_minutes_mismatch: sum of elements[].indicative_minutes (" +
              totalMinutes +
              ") does not equal Stage 1 journey_allocated_minutes (" +
              targetMinutes +
              ")"
          );
        }
      }

      validateOptionalString(obj.boundary_notes, "learning_elements.boundary_notes", errors);

      return { ok: errors.length === 0, errors: errors, value: obj };
    }

    // -------------------------------------------------------------------------
    // Stage 4 — learning_commissions
    // -------------------------------------------------------------------------

    function resolveCanonicalSharedMaterialForStage4(rawMaterial, briefProvidedSourceContext, errors) {
      var briefSource = normalizeNewlines(briefProvidedSourceContext);
      var sharedMod = resolveSharedSourceMod();

      if (!isPlainObject(rawMaterial)) {
        errors.push("learning_commissions.shared_authoritative_material must be an object");
        return null;
      }
      collectDisallowedKeys(
        rawMaterial,
        STAGE4_SHARED_MATERIAL_ALLOWED_KEYS,
        "learning_commissions.shared_authoritative_material",
        errors
      );
      var status = asText(rawMaterial.status).toLowerCase();
      var hasContentProp = Object.prototype.hasOwnProperty.call(rawMaterial, "content");
      var normalizedContentText = "";
      if (hasContentProp && rawMaterial.content != null) {
        if (sharedMod && typeof sharedMod.normalizeSharedMaterialContentValue === "function") {
          normalizedContentText = sharedMod.normalizeSharedMaterialContentValue(rawMaterial.content).text;
        } else {
          normalizedContentText = normalizeNewlines(rawMaterial.content);
        }
      }

      if (briefSource) {
        // Requirement #4: Brief-provided authoritative source is transported deterministically.
        if (status !== "provided") {
          errors.push(
            'brief_provided_source_must_be_preserved_as_provided: expected status "provided" when brief supplies authoritative source material'
          );
          return null;
        }
        if (normalizedContentText && normalizedContentText !== briefSource) {
          errors.push(
            "shared_material_conflicts_with_brief_source: Stage 4 content does not match brief-provided authoritative source material"
          );
          return null;
        }
        return {
          status: "provided",
          content: briefSource
        };
      }

      if (status === "provided") {
        errors.push(
          "shared_material_provided_without_brief_source: status \"provided\" requires brief-provided authoritative source material"
        );
        return null;
      }
      if (status === "none") {
        if (normalizedContentText) {
          errors.push('learning_commissions.shared_authoritative_material.content must be empty when status is "none"');
          return null;
        }
        return { status: "none", content: "" };
      }
      if (status !== "generated") {
        errors.push('learning_commissions.shared_authoritative_material.status must be "generated", "provided", or "none"');
        return null;
      }

      if (sharedMod && typeof sharedMod.extractSharedAuthoritativeMaterialFromPage === "function") {
        var extracted = sharedMod.extractSharedAuthoritativeMaterialFromPage({
          shared_authoritative_material: rawMaterial
        });
        if (!extracted || !extracted.ok || extracted.kind !== "material") {
          var extErrors = (extracted && extracted.errors) || ["shared_authoritative_material_invalid"];
          extErrors.forEach(function (err) {
            errors.push(err);
          });
          return null;
        }
        if (typeof sharedMod.collectContradictoryDerivedStatisticErrors === "function") {
          var statErrors = sharedMod.collectContradictoryDerivedStatisticErrors(extracted.content);
          if (Array.isArray(statErrors) && statErrors.length) {
            statErrors.forEach(function (err) {
              errors.push(err);
            });
            return null;
          }
        }
        return { status: "generated", content: extracted.content };
      }

      if (!normalizedContentText || normalizedContentText.length < 40) {
        errors.push("shared_authoritative_material_too_short");
        return null;
      }
      return { status: "generated", content: normalizedContentText };
    }

    function extractMarkedBlockSimple(text, beginMarker, endMarker) {
      var body = normalizeNewlines(text);
      var bIdx = body.indexOf(beginMarker);
      var eIdx = body.indexOf(endMarker);
      if (bIdx === -1 && eIdx === -1) return { kind: "missing", value: null };
      if (
        bIdx === -1 ||
        eIdx === -1 ||
        eIdx <= bIdx ||
        body.indexOf(beginMarker, bIdx + beginMarker.length) !== -1 ||
        body.indexOf(endMarker, eIdx + endMarker.length) !== -1
      ) {
        return { kind: "malformed", value: null };
      }
      var inner = body.slice(bIdx + beginMarker.length, eIdx).trim();
      var fence = inner.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      if (fence) inner = String(fence[1] || "").trim();
      try {
        return { kind: "present", value: JSON.parse(inner) };
      } catch (_err) {
        return { kind: "malformed", value: null };
      }
    }

    function validateComponentOutcomesBlockInSpecification(specText, prefix, errors) {
      var loBind = resolveLoBindMod();
      if (loBind && typeof loBind.extractComponentLearningOutcomes === "function") {
        var res = loBind.extractComponentLearningOutcomes(specText);
        if (!res || !res.ok) {
          var list = (res && res.errors && res.errors.length) ? res.errors : ["component_outcomes_invalid"];
          list.forEach(function (err) {
            errors.push(prefix + ".specification_text:" + err);
          });
        }
        return;
      }
      var simple = extractMarkedBlockSimple(specText, COMPONENT_OUTCOMES_BEGIN, COMPONENT_OUTCOMES_END);
      if (simple.kind !== "present") {
        errors.push(prefix + ".specification_text:component_outcomes_" + simple.kind);
        return;
      }
      validateCanonicalDloObject(simple.value, prefix + ".component_learning_outcomes", errors);
    }

    function selectJourneyOutcomesSubset(stage1Outcomes, relevantNumbers) {
      if (!isPlainObject(stage1Outcomes) || !Array.isArray(stage1Outcomes.learning_outcomes)) {
        return null;
      }
      var base = deepClone(stage1Outcomes);
      if (!Array.isArray(relevantNumbers) || !relevantNumbers.length) {
        return base;
      }
      base.learning_outcomes = relevantNumbers.map(function (num) {
        return deepClone(stage1Outcomes.learning_outcomes[num - 1]);
      });
      return base;
    }

    function canonicalizeDloForCompare(dlo) {
      if (!isPlainObject(dlo) || !Array.isArray(dlo.learning_outcomes)) return "";
      return JSON.stringify({
        learning_outcomes: dlo.learning_outcomes.map(function (row) {
          return {
            statement: asText(row && row.statement),
            related_concepts: Array.isArray(row && row.related_concepts)
              ? row.related_concepts.map(asText)
              : [],
            cognitive_level: asText(row && row.cognitive_level),
            notes: asText(row && row.notes)
          };
        }),
        learner_level: asText(dlo.learner_level),
        scope: asText(dlo.scope),
        alignment_notes: asText(dlo.alignment_notes)
      });
    }

    function formatJourneyOutcomesBlock(dloObj) {
      return [
        JOURNEY_OUTCOMES_BEGIN,
        JSON.stringify(dloObj, null, 2),
        JOURNEY_OUTCOMES_END
      ].join("\n");
    }

    function validateLearningJourneyCommissionsPartial(input, options) {
      var opts = isPlainObject(options) ? options : {};
      var parsedRes = parseJsonObjectInput(input, "learning_commissions");
      if (!parsedRes.ok) return { ok: false, errors: [parsedRes.error] };
      var obj = parsedRes.value;
      var errors = [];

      validateStageEnvelope(obj, "learning_commissions", errors);
      collectDisallowedKeys(obj, STAGE4_ALLOWED_KEYS, "learning_commissions", errors);

      var req = isPlainObject(opts.requirements) ? opts.requirements : null;
      var elementsStage = isPlainObject(opts.elements) ? opts.elements : null;
      var targetMinutes =
        req && isPositiveInteger(req.journey_allocated_minutes)
          ? req.journey_allocated_minutes
          : isPositiveInteger(opts.parentAuthoritativeMinutes)
            ? opts.parentAuthoritativeMinutes
            : null;
      var stage1OutcomeCount =
        req && isPlainObject(req.learning_outcomes) && Array.isArray(req.learning_outcomes.learning_outcomes)
          ? req.learning_outcomes.learning_outcomes.length
          : 0;

      var elementIdSet = Object.create(null);
      var hasStage3Elements = false;
      if (elementsStage && Array.isArray(elementsStage.elements) && elementsStage.elements.length) {
        hasStage3Elements = true;
        elementsStage.elements.forEach(function (el) {
          var eid = asText(el && el.element_id);
          if (eid) elementIdSet[eid] = true;
        });
      }

      var resolvedShared = resolveCanonicalSharedMaterialForStage4(
        obj.shared_authoritative_material,
        opts.briefProvidedSourceContext,
        errors
      );

      var allowedProducts = opts.allowLegacyInteractiveCommission
        ? ALL_SUPPORTED_PRODUCTS
        : NEW_JOURNEY_SUPPORTED_PRODUCTS;
      var sharedMod = resolveSharedSourceMod();
      var designMod = resolveDesignPageMod();

      var seenCommission = Object.create(null);
      var seenSection = Object.create(null);
      var seenOrder = Object.create(null);
      var coveredElements = Object.create(null);
      var allocatedSum = 0;
      var allAllocatedValid = true;

      if (!Array.isArray(obj.commissions) || !obj.commissions.length) {
        errors.push("learning_commissions.commissions must be a non-empty array");
      } else {
        var c;
        for (c = 0; c < obj.commissions.length; c += 1) {
          var row = obj.commissions[c];
          var cPrefix = "learning_commissions.commissions[" + c + "]";
          if (!isPlainObject(row)) {
            errors.push(cPrefix + " must be an object");
            allAllocatedValid = false;
            continue;
          }
          collectDisallowedKeys(row, STAGE4_COMMISSION_ALLOWED_KEYS, cPrefix, errors);

          var cid = asText(row.commission_id);
          if (!cid) errors.push(cPrefix + ".commission_id required");
          else if (seenCommission[cid]) errors.push("duplicate_commission_id:" + cid);
          else seenCommission[cid] = true;

          var sid = asText(row.section_id);
          if (!sid) errors.push(cPrefix + ".section_id required");
          else if (sid === "journey_intro") errors.push(cPrefix + ".section_id must not be journey_intro");
          else if (seenSection[sid]) errors.push("duplicate_commission_section_id:" + sid);
          else seenSection[sid] = true;

          if (!isPositiveInteger(row.order)) {
            errors.push(cPrefix + ".order must be a positive integer");
          } else if (seenOrder[row.order]) {
            errors.push("duplicate_commission_order:" + row.order);
          } else {
            seenOrder[row.order] = true;
          }

          if (typeof row.title !== "string" || !asText(row.title)) {
            errors.push(cPrefix + ".title required");
          }

          var status = asText(row.status).toLowerCase();
          var productId = asText(row.product_id).toLowerCase();
          if (status === "supported") {
            if (productId === "interactive" && !opts.allowLegacyInteractiveCommission) {
              errors.push(cPrefix + ".product_id interactive_forbidden_for_new_learning_journey");
            } else if (!allowedProducts[productId]) {
              errors.push(cPrefix + ".product_id invalid_for_supported");
            }
          } else if (status === "unsupported") {
            if (productId) {
              errors.push(cPrefix + ".unsupported_must_have_empty_product_id");
            }
          } else {
            errors.push(cPrefix + '.status must be "supported" or "unsupported"');
          }

          if (!isPositiveInteger(row.allocated_minutes)) {
            errors.push(cPrefix + ".allocated_minutes must be a positive integer");
            allAllocatedValid = false;
          } else {
            allocatedSum += row.allocated_minutes;
          }

          var specText = typeof row.specification_text === "string" ? asText(row.specification_text) : "";
          if (!specText) {
            errors.push(cPrefix + ".specification_text required");
          } else if (status === "supported") {
            validateComponentOutcomesBlockInSpecification(specText, cPrefix, errors);
          }

          if (row.journey_context_text !== undefined && typeof row.journey_context_text !== "string") {
            errors.push(cPrefix + ".journey_context_text must be a string");
          }
          var ctxText = typeof row.journey_context_text === "string" ? asText(row.journey_context_text) : "";
          validateOptionalString(row.dependencies, cPrefix + ".dependencies", errors);

          if (row.artefact_references === undefined) {
            if (opts.requireArtefactReferences === true) {
              errors.push(
                cPrefix +
                  ".artefact_references required (use [] when no prior learner artefact is displayed)"
              );
            }
          } else if (!Array.isArray(row.artefact_references)) {
            errors.push(cPrefix + ".artefact_references must be an array of {commission_id}.{elicitation_id} strings");
          } else {
            var seenArtRef = Object.create(null);
            var ari;
            for (ari = 0; ari < row.artefact_references.length; ari += 1) {
              var artRefVal = asText(row.artefact_references[ari]);
              if (!artRefVal) {
                errors.push(cPrefix + ".artefact_references[" + ari + "] must be non-empty");
              } else if (!JOURNAL_ARTEFACT_ID_RE.test(artRefVal)) {
                errors.push(
                  cPrefix +
                    ".artefact_references[" +
                    ari +
                    "] must use {commission_id}.{elicitation_id}"
                );
              } else if (seenArtRef[artRefVal]) {
                errors.push(cPrefix + ".artefact_references duplicate:" + artRefVal);
              } else {
                seenArtRef[artRefVal] = true;
              }
            }
          }

          if (!Array.isArray(row.element_ids) || !row.element_ids.length) {
            errors.push(cPrefix + ".element_ids must be a non-empty array");
          } else {
            var seenElInRow = Object.create(null);
            var ei;
            for (ei = 0; ei < row.element_ids.length; ei += 1) {
              var eidRef = asText(row.element_ids[ei]);
              if (!eidRef) {
                errors.push(cPrefix + ".element_ids[" + ei + "] must be non-empty");
              } else if (seenElInRow[eidRef]) {
                errors.push(cPrefix + ".element_ids duplicate:" + eidRef);
              } else {
                seenElInRow[eidRef] = true;
                if (hasStage3Elements && !elementIdSet[eidRef]) {
                  errors.push(cPrefix + ".element_ids unknown_in_elements:" + eidRef);
                } else {
                  coveredElements[eidRef] = true;
                }
              }
            }
          }

          if (row.relevant_journey_outcome_numbers !== undefined) {
            if (!Array.isArray(row.relevant_journey_outcome_numbers) || !row.relevant_journey_outcome_numbers.length) {
              errors.push(cPrefix + ".relevant_journey_outcome_numbers must be a non-empty positive-integer array when present");
            } else {
              var seenNum = Object.create(null);
              var ni;
              for (ni = 0; ni < row.relevant_journey_outcome_numbers.length; ni += 1) {
                var num = row.relevant_journey_outcome_numbers[ni];
                if (!isPositiveInteger(num)) {
                  errors.push(cPrefix + ".relevant_journey_outcome_numbers[" + ni + "] must be a positive integer");
                } else if (seenNum[num]) {
                  errors.push(cPrefix + ".relevant_journey_outcome_numbers duplicate:" + num);
                } else {
                  seenNum[num] = true;
                  if (stage1OutcomeCount > 0 && num > stage1OutcomeCount) {
                    errors.push(
                      cPrefix +
                        ".relevant_journey_outcome_numbers[" +
                        ni +
                        "] out_of_range (max " +
                        stage1OutcomeCount +
                        ")"
                    );
                  }
                }
              }
            }
          }

          // If Stage 4 manually embedded a JOURNEY_LEARNING_OUTCOMES block, verify it matches Stage 1.
          if (ctxText) {
            var embeddedJourney = extractMarkedBlockSimple(
              ctxText,
              JOURNEY_OUTCOMES_BEGIN,
              JOURNEY_OUTCOMES_END
            );
            if (embeddedJourney.kind === "malformed") {
              errors.push(cPrefix + ".journey_context_text:journey_outcomes_malformed");
            } else if (embeddedJourney.kind === "present" && req && isPlainObject(req.learning_outcomes)) {
              var expectedDlo = selectJourneyOutcomesSubset(
                req.learning_outcomes,
                row.relevant_journey_outcome_numbers
              );
              if (
                expectedDlo &&
                canonicalizeDloForCompare(embeddedJourney.value) !== canonicalizeDloForCompare(expectedDlo)
              ) {
                errors.push(
                  cPrefix +
                    ".journey_context_text:journey_outcomes_conflict_with_stage1"
                );
              }
            }
          }

          if (
            resolvedShared &&
            resolvedShared.content &&
            sharedMod &&
            typeof sharedMod.commissionTextLooksLikeFullSharedDump === "function"
          ) {
            if (sharedMod.commissionTextLooksLikeFullSharedDump(specText, resolvedShared.content)) {
              errors.push(cPrefix + ".specification_text_duplicates_full_shared_source");
            }
            if (sharedMod.commissionTextLooksLikeFullSharedDump(ctxText, resolvedShared.content)) {
              errors.push(cPrefix + ".journey_context_text_duplicates_full_shared_source");
            }
          }
        }

        if (hasStage3Elements) {
          Object.keys(elementIdSet).forEach(function (eidKey) {
            if (!coveredElements[eidKey]) {
              errors.push("learning_element_uncovered_by_commissions:" + eidKey);
            }
          });
        }

        if (allAllocatedValid && targetMinutes != null && allocatedSum !== targetMinutes) {
          errors.push(
            "commission_durations_total_mismatch: sum of commissions[].allocated_minutes (" +
              allocatedSum +
              ") does not reconcile with journey allocation (" +
              targetMinutes +
              ")"
          );
        }

        // Check Stage 4 continuity BEFORE assembler injects Stage 1 journey outcomes block,
        // so missing/generic journey_context_text cannot be masked by injected markers.
        if (designMod && typeof designMod.collectLearningJourneyContinuityErrors === "function") {
          var continuityErrors = designMod.collectLearningJourneyContinuityErrors({
            commissions: obj.commissions
          });
          if (Array.isArray(continuityErrors) && continuityErrors.length) {
            continuityErrors.forEach(function (err) {
              errors.push(err);
            });
          }
        }

        // Cross-commission validation for explicit artefact_references[] (preceding declared commission).
        var orderByCid = Object.create(null);
        for (c = 0; c < obj.commissions.length; c += 1) {
          var rowOrd = obj.commissions[c];
          if (isPlainObject(rowOrd) && asText(rowOrd.commission_id) && isPositiveInteger(rowOrd.order)) {
            orderByCid[asText(rowOrd.commission_id)] = rowOrd.order;
          }
        }
        for (c = 0; c < obj.commissions.length; c += 1) {
          var rowRefCheck = obj.commissions[c];
          if (!isPlainObject(rowRefCheck) || !Array.isArray(rowRefCheck.artefact_references)) continue;
          var consumerCid = asText(rowRefCheck.commission_id);
          var consumerOrd = orderByCid[consumerCid];
          var cRefPrefix = "learning_commissions.commissions[" + c + "]";
          for (var rci = 0; rci < rowRefCheck.artefact_references.length; rci += 1) {
            var refStr = asText(rowRefCheck.artefact_references[rci]);
            var refMatch = JOURNAL_ARTEFACT_ID_RE.exec(refStr);
            if (!refMatch) continue;
            var producerCid = refMatch[1];
            if (!seenCommission[producerCid]) {
              errors.push(cRefPrefix + ".artefact_references[" + rci + "] unknown_commission:" + producerCid);
            } else if (producerCid === consumerCid) {
              errors.push(cRefPrefix + ".artefact_references[" + rci + "] self_reference_forbidden:" + refStr);
            } else if (
              isPositiveInteger(orderByCid[producerCid]) &&
              isPositiveInteger(consumerOrd) &&
              orderByCid[producerCid] >= consumerOrd
            ) {
              errors.push(
                cRefPrefix +
                  ".artefact_references[" +
                  rci +
                  "] producer_must_precede_consumer:" +
                  producerCid +
                  "->" +
                  consumerCid
              );
            }
          }
        }
      }

      if (typeof obj.continuity !== "string" || !asText(obj.continuity)) {
        errors.push("learning_commissions.continuity required");
      }

      if (!isPlainObject(obj.journal)) {
        errors.push("learning_commissions.journal must be an object");
      } else {
        collectDisallowedKeys(obj.journal, STAGE4_JOURNAL_ALLOWED_KEYS, "learning_commissions.journal", errors);
        if (obj.journal.enabled !== true && obj.journal.enabled !== false) {
          errors.push("learning_commissions.journal.enabled must be boolean");
        }
        validateOptionalString(obj.journal.decision_basis, "learning_commissions.journal.decision_basis", errors);
        validateOptionalString(obj.journal.title, "learning_commissions.journal.title", errors);

        var jEntries = obj.journal.entries;
        if (obj.journal.enabled === false) {
          if (jEntries !== undefined && (!Array.isArray(jEntries) || jEntries.length > 0)) {
            errors.push("learning_commissions.journal.entries must be empty when journal.enabled is false");
          }
        } else if (obj.journal.enabled === true) {
          if (!Array.isArray(jEntries) || !jEntries.length) {
            errors.push("learning_commissions.journal.entries required when journal.enabled is true");
          } else {
            var seenEntryId = Object.create(null);
            var seenEntryOrder = Object.create(null);
            var ji;
            for (ji = 0; ji < jEntries.length; ji += 1) {
              var jRow = jEntries[ji];
              var jPrefix = "learning_commissions.journal.entries[" + ji + "]";
              if (!isPlainObject(jRow)) {
                errors.push(jPrefix + " must be an object");
                continue;
              }
              collectDisallowedKeys(jRow, STAGE4_JOURNAL_ENTRY_ALLOWED_KEYS, jPrefix, errors);
              var jeid = asText(jRow.entry_id);
              if (!jeid) errors.push(jPrefix + ".entry_id required");
              else if (seenEntryId[jeid]) errors.push("duplicate_journal_entry_id:" + jeid);
              else seenEntryId[jeid] = true;

              if (!isPositiveInteger(jRow.order)) {
                errors.push(jPrefix + ".order must be a positive integer");
              } else if (seenEntryOrder[jRow.order]) {
                errors.push("duplicate_journal_entry_order:" + jRow.order);
              } else {
                seenEntryOrder[jRow.order] = true;
              }

              if (typeof jRow.title !== "string" || !asText(jRow.title)) {
                errors.push(jPrefix + ".title required");
              }
              validateOptionalString(jRow.framing, jPrefix + ".framing", errors);

              var aid = asText(jRow.artefact_id);
              if (!aid) {
                errors.push(jPrefix + ".artefact_id required");
              } else {
                var aidMatch = JOURNAL_ARTEFACT_ID_RE.exec(aid);
                if (!aidMatch) {
                  errors.push(jPrefix + ".artefact_id must be {commission_id}.{elicitation_id}");
                } else if (!seenCommission[aidMatch[1]]) {
                  errors.push(jPrefix + ".artefact_id unknown_commission:" + aidMatch[1]);
                }
              }
            }
          }
        }
      }

      validateOptionalString(obj.feasibility_note, "learning_commissions.feasibility_note", errors);

      return {
        ok: errors.length === 0,
        errors: errors,
        value: obj,
        resolvedSharedAuthoritativeMaterial: resolvedShared
      };
    }

    // -------------------------------------------------------------------------
    // Stage 5 — design_page (thin learner-facing synthesis partial)
    // -------------------------------------------------------------------------

    function validateEditorialOpeningImage(img, errors) {
      if (!isPlainObject(img)) {
        errors.push("design_page.editorial_opening_image required");
        return;
      }
      collectDisallowedKeys(
        img,
        STAGE5_OPENING_IMAGE_ALLOWED_KEYS,
        "design_page.editorial_opening_image",
        errors
      );
      var decision = asText(img.decision).toLowerCase();
      if (decision === "generate") {
        if (!asText(img.subject)) errors.push("design_page.editorial_opening_image.subject required");
        if (!asText(img.context)) errors.push("design_page.editorial_opening_image.context required");
        if (!asText(img.caption_intent)) {
          errors.push("design_page.editorial_opening_image.caption_intent required");
        }
        if (img.alt_text !== "") {
          errors.push('design_page.editorial_opening_image.alt_text must be "" when decision is generate');
        }
        if (!asText(img.detailed_description)) {
          errors.push("design_page.editorial_opening_image.detailed_description required");
        }
      } else if (decision === "skip") {
        if (!asText(img.skip_reason)) {
          errors.push("design_page.editorial_opening_image.skip_reason required when decision is skip");
        }
      } else {
        errors.push('design_page.editorial_opening_image.decision must be "generate" or "skip"');
      }
    }

    function validateLearningJourneyDesignPagePartial(input, options) {
      var opts = isPlainObject(options) ? options : {};
      var parsedRes = parseJsonObjectInput(input, "design_page");
      if (!parsedRes.ok) return { ok: false, errors: [parsedRes.error] };
      var obj = parsedRes.value;
      var errors = [];

      // Strict legacy separation: reject monolithic Step 5 capture on progressive workflows.
      if (isMonolithicLearningJourneyDesignPageShape(obj)) {
        errors.push("monolithic_capture_rejected_for_progressive_workflow");
      }

      if (asText(obj.artifact_type).toLowerCase() !== FINAL_PAGE_ARTIFACT_TYPE) {
        errors.push('design_page.artifact_type must be "page"');
      }
      if (asText(obj.schema_version) !== FINAL_PAGE_SCHEMA_VERSION) {
        errors.push('design_page.schema_version must be "2.0.0"');
      }
      if (asText(obj.product_id).toLowerCase() !== FINAL_PAGE_PRODUCT_ID) {
        errors.push('design_page.product_id must be "learning_journey"');
      }

      collectDisallowedKeys(obj, STAGE5_ALLOWED_KEYS, "design_page", errors);

      if (typeof obj.title !== "string" || !asText(obj.title)) {
        errors.push("design_page.title required");
      }

      validateEditorialOpeningImage(obj.editorial_opening_image, errors);

      var stage4 = isPlainObject(opts.commissionsStage) ? opts.commissionsStage : null;
      var orderedStage4SectionIds = [];
      var stage4SectionSet = Object.create(null);
      if (stage4 && Array.isArray(stage4.commissions)) {
        var rankedCommissions = stage4.commissions
          .slice()
          .sort(function (a, b) {
            return Number(a && a.order) - Number(b && b.order);
          });
        rankedCommissions.forEach(function (c) {
          var sid = asText(c && c.section_id);
          if (sid) {
            orderedStage4SectionIds.push(sid);
            stage4SectionSet[sid] = true;
          }
        });
      }

      if (!Array.isArray(obj.sections) || !obj.sections.length) {
        errors.push("design_page.sections must be a non-empty array");
      } else {
        var seenSectionId = Object.create(null);
        var seenSectionOrder = Object.create(null);
        var validSections = [];
        var si;
        for (si = 0; si < obj.sections.length; si += 1) {
          var sec = obj.sections[si];
          var sPrefix = "design_page.sections[" + si + "]";
          if (!isPlainObject(sec)) {
            errors.push(sPrefix + " must be an object");
            continue;
          }
          collectDisallowedKeys(sec, STAGE5_SECTION_ALLOWED_KEYS, sPrefix, errors);
          var sidVal = asText(sec.section_id);
          if (!sidVal) errors.push(sPrefix + ".section_id required");
          else if (seenSectionId[sidVal]) errors.push("duplicate_section_id:" + sidVal);
          else seenSectionId[sidVal] = true;

          if (typeof sec.title !== "string" || !asText(sec.title)) {
            errors.push(sPrefix + ".title required");
          }
          if (!isPositiveInteger(sec.order)) {
            errors.push(sPrefix + ".order must be a positive integer");
          } else if (seenSectionOrder[sec.order]) {
            errors.push("duplicate_section_order:" + sec.order);
          } else {
            seenSectionOrder[sec.order] = true;
          }
          if (typeof sec.exposition !== "string" || !asText(sec.exposition)) {
            errors.push(sPrefix + ".exposition required");
          }
          if (sidVal && isPositiveInteger(sec.order)) {
            validSections.push({ section_id: sidVal, order: sec.order });
          }
        }

        if (validSections.length) {
          validSections.sort(function (a, b) {
            return a.order - b.order;
          });
          if (validSections[0].section_id !== "journey_intro") {
            errors.push('design_page.sections first ordered section must be "journey_intro"');
          }
          if (orderedStage4SectionIds.length) {
            var postIntro = validSections.slice(1).map(function (s) {
              return s.section_id;
            });
            // Every Stage 4 commission section_id must appear in exact Stage 4 order,
            // with at most one optional closing section after the final commission section.
            var closingAllowed = postIntro.length === orderedStage4SectionIds.length + 1;
            if (
              postIntro.length < orderedStage4SectionIds.length ||
              postIntro.length > orderedStage4SectionIds.length + 1
            ) {
              errors.push(
                "design_page_sections_count_mismatch: expected journey_intro + " +
                  orderedStage4SectionIds.length +
                  " commissioned sections (+ optional single closing section)"
              );
            } else {
              var k;
              for (k = 0; k < orderedStage4SectionIds.length; k += 1) {
                if (postIntro[k] !== orderedStage4SectionIds[k]) {
                  errors.push(
                    "design_page_section_order_mismatch: expected section_id " +
                      orderedStage4SectionIds[k] +
                      " at position " +
                      (k + 2) +
                      ", got " +
                      postIntro[k]
                  );
                }
              }
              if (closingAllowed) {
                var closingId = postIntro[orderedStage4SectionIds.length];
                if (/^exp_/i.test(closingId)) {
                  errors.push(
                    "design_page_uncommissioned_experience_section_forbidden:" + closingId
                  );
                }
              }
            }
          }
        }
      }

      if (!isPlainObject(obj.learning_journey)) {
        errors.push("design_page.learning_journey required");
      } else {
        collectDisallowedKeys(
          obj.learning_journey,
          STAGE5_LEARNING_JOURNEY_ALLOWED_KEYS,
          "design_page.learning_journey",
          errors
        );
        if (
          typeof obj.learning_journey.design_intent !== "string" ||
          !asText(obj.learning_journey.design_intent)
        ) {
          errors.push("design_page.learning_journey.design_intent required");
        }
        var dpJournal = obj.learning_journey.journal;
        var stage4Journal =
          stage4 && isPlainObject(stage4.journal) ? stage4.journal : null;
        if (dpJournal !== undefined && dpJournal !== null) {
          if (!isPlainObject(dpJournal)) {
            errors.push("design_page.learning_journey.journal must be an object");
          } else {
            collectDisallowedKeys(
              dpJournal,
              STAGE5_JOURNAL_ALLOWED_KEYS,
              "design_page.learning_journey.journal",
              errors
            );
            validateOptionalString(dpJournal.title, "design_page.learning_journey.journal.title", errors);
            if (stage4Journal && stage4Journal.enabled === false) {
              errors.push("design_page_journal_forbidden_when_disabled");
            }
            if (dpJournal.entries !== undefined) {
              if (!Array.isArray(dpJournal.entries)) {
                errors.push("design_page.learning_journey.journal.entries must be an array");
              } else {
                var stage4EntryIds = Object.create(null);
                if (stage4Journal && Array.isArray(stage4Journal.entries)) {
                  stage4Journal.entries.forEach(function (entry) {
                    var id = asText(entry && entry.entry_id);
                    if (id) stage4EntryIds[id] = true;
                  });
                }
                var seenDpEntry = Object.create(null);
                var dei;
                for (dei = 0; dei < dpJournal.entries.length; dei += 1) {
                  var dpEntry = dpJournal.entries[dei];
                  var dePrefix = "design_page.learning_journey.journal.entries[" + dei + "]";
                  if (!isPlainObject(dpEntry)) {
                    errors.push(dePrefix + " must be an object");
                    continue;
                  }
                  collectDisallowedKeys(dpEntry, STAGE5_JOURNAL_ENTRY_ALLOWED_KEYS, dePrefix, errors);
                  var deId = asText(dpEntry.entry_id);
                  if (!deId) {
                    errors.push(dePrefix + ".entry_id required");
                  } else if (seenDpEntry[deId]) {
                    errors.push("duplicate_design_page_journal_entry_id:" + deId);
                  } else {
                    seenDpEntry[deId] = true;
                    if (stage4Journal && stage4Journal.enabled === true && !stage4EntryIds[deId]) {
                      errors.push(dePrefix + ".entry_id unknown_in_stage4_journal:" + deId);
                    }
                  }
                  if (typeof dpEntry.framing !== "string" || !asText(dpEntry.framing)) {
                    errors.push(dePrefix + ".framing required");
                  }
                }
              }
            }
          }
        }
        // When Stage 4 enabled a journal, every Stage 4 entry must end up with non-empty framing.
        if (stage4Journal && stage4Journal.enabled === true && Array.isArray(stage4Journal.entries)) {
          var dpFramingById = Object.create(null);
          if (isPlainObject(dpJournal) && Array.isArray(dpJournal.entries)) {
            dpJournal.entries.forEach(function (row) {
              var id = asText(row && row.entry_id);
              if (id && asText(row && row.framing)) dpFramingById[id] = asText(row.framing);
            });
          }
          stage4Journal.entries.forEach(function (s4Entry) {
            var id = asText(s4Entry && s4Entry.entry_id);
            if (!id) return;
            var resolvedFraming = dpFramingById[id] || asText(s4Entry && s4Entry.framing);
            if (!resolvedFraming) {
              errors.push("design_page_journal_entry_framing_missing:" + id);
            }
          });
        }
      }

      if (!isPlainObject(obj.assembly_state)) {
        errors.push("design_page.assembly_state required");
      } else {
        if (asText(obj.assembly_state.current_stage) !== "design_page") {
          errors.push('design_page.assembly_state.current_stage must be "design_page"');
        }
        if (obj.assembly_state.calls_model !== true) {
          errors.push("design_page.assembly_state.calls_model must be true");
        }
        var enriched = Array.isArray(obj.assembly_state.enriched_by)
          ? obj.assembly_state.enriched_by.map(asText)
          : [];
        if (enriched.indexOf("design_page") === -1) {
          errors.push('design_page.assembly_state.enriched_by must include "design_page"');
        }
      }

      return { ok: errors.length === 0, errors: errors, value: obj };
    }

    // -------------------------------------------------------------------------
    // Deterministic Final Assembly (all 5 stages mandatory)
    // -------------------------------------------------------------------------

    function injectAuthoritativeJourneyOutcomesIntoContext(rawContext, dloSubset) {
      var base = normalizeNewlines(rawContext);
      if (!dloSubset) return base;
      var existing = extractMarkedBlockSimple(base, JOURNEY_OUTCOMES_BEGIN, JOURNEY_OUTCOMES_END);
      if (existing.kind === "present") {
        // Already validated against Stage 1 during Stage 4 validation — preserve once without duplication.
        return base;
      }
      var block = formatJourneyOutcomesBlock(dloSubset);
      return base ? base + "\n\n" + block : block;
    }

    function assembleLearningJourneyPageFromPartials(partialsInput, options) {
      var opts = isPlainObject(options) ? options : {};
      if (!isPlainObject(partialsInput)) {
        return { ok: false, page: null, errors: ["partials_object_required"], warnings: [], diagnostics: [] };
      }

      // Requirement #5: ALL FIVE accepted, valid, current stage captures are mandatory.
      var missingStages = [];
      var i;
      for (i = 0; i < STAGE_ORDER.length; i += 1) {
        var st = STAGE_ORDER[i];
        if (partialsInput[st] == null || partialsInput[st] === "") {
          missingStages.push("missing_required_stage:" + st);
        }
      }
      if (missingStages.length) {
        // Also detect monolithic bypass attempts immediately for clarity.
        if (partialsInput.design_page) {
          var dpProbe = parseJsonObjectInput(partialsInput.design_page, "design_page");
          if (dpProbe.ok && isMonolithicLearningJourneyDesignPageShape(dpProbe.value)) {
            missingStages.unshift("monolithic_capture_rejected_for_progressive_workflow");
          }
        }
        return {
          ok: false,
          page: null,
          errors: missingStages,
          warnings: [],
          diagnostics: []
        };
      }

      var s1 = validateLearningJourneyRequirementsPartial(partialsInput.learning_requirements, {
        parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes
      });
      if (!s1.ok) {
        return { ok: false, page: null, errors: s1.errors, warnings: [], diagnostics: [] };
      }

      var s2 = validateLearningJourneyProgressionPartial(partialsInput.learning_progression, {
        requirements: s1.value,
        parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes
      });
      if (!s2.ok) {
        return { ok: false, page: null, errors: s2.errors, warnings: [], diagnostics: [] };
      }

      var s3 = validateLearningJourneyElementsPartial(partialsInput.learning_elements, {
        requirements: s1.value,
        progression: s2.value,
        parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes
      });
      if (!s3.ok) {
        return { ok: false, page: null, errors: s3.errors, warnings: [], diagnostics: [] };
      }

      var s4 = validateLearningJourneyCommissionsPartial(partialsInput.learning_commissions, {
        requirements: s1.value,
        elements: s3.value,
        parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes,
        briefProvidedSourceContext: opts.briefProvidedSourceContext,
        allowLegacyInteractiveCommission: !!opts.allowLegacyInteractiveCommission
      });
      if (!s4.ok) {
        return { ok: false, page: null, errors: s4.errors, warnings: [], diagnostics: [] };
      }

      var s5 = validateLearningJourneyDesignPagePartial(partialsInput.design_page, {
        commissionsStage: s4.value
      });
      if (!s5.ok) {
        return { ok: false, page: null, errors: s5.errors, warnings: [], diagnostics: [] };
      }

      // Build immutable canonical final LJ Design Page — ZERO intermediate-only fields.
      var orderedSections = s5.value.sections
        .slice()
        .sort(function (a, b) {
          return Number(a.order) - Number(b.order);
        })
        .map(function (sec) {
          return {
            section_id: asText(sec.section_id),
            title: asText(sec.title),
            order: sec.order,
            exposition: String(sec.exposition)
          };
        });

      var orderedCommissions = s4.value.commissions
        .slice()
        .sort(function (a, b) {
          return Number(a.order) - Number(b.order);
        })
        .map(function (row) {
          var status = asText(row.status).toLowerCase();
          var productId = status === "supported" ? asText(row.product_id).toLowerCase() : "";
          var dloSubset = selectJourneyOutcomesSubset(
            s1.value.learning_outcomes,
            row.relevant_journey_outcome_numbers
          );
          var contextWithOutcomes = injectAuthoritativeJourneyOutcomesIntoContext(
            row.journey_context_text,
            dloSubset
          );
          var assembledCommission = {
            commission_id: asText(row.commission_id),
            section_id: asText(row.section_id),
            order: row.order,
            title: asText(row.title),
            product_id: productId,
            status: status,
            allocated_minutes: row.allocated_minutes,
            specification_text: String(row.specification_text),
            journey_context_text: contextWithOutcomes,
            dependencies: typeof row.dependencies === "string" ? row.dependencies : ""
          };
          if (Array.isArray(row.artefact_references)) {
            assembledCommission.artefact_references = row.artefact_references
              .map(asText)
              .filter(Boolean);
          }
          return assembledCommission;
        });

      var s4Journal = s4.value.journal;
      var s5Journal = isPlainObject(s5.value.learning_journey.journal)
        ? s5.value.learning_journey.journal
        : null;
      var finalJournal;
      if (s4Journal.enabled === true) {
        var dpFramingById = Object.create(null);
        if (s5Journal && Array.isArray(s5Journal.entries)) {
          s5Journal.entries.forEach(function (row) {
            var id = asText(row && row.entry_id);
            if (id && asText(row && row.framing)) dpFramingById[id] = asText(row.framing);
          });
        }
        var finalEntries = s4Journal.entries
          .slice()
          .sort(function (a, b) {
            return Number(a.order) - Number(b.order);
          })
          .map(function (entry) {
            var eid = asText(entry.entry_id);
            return {
              entry_id: eid,
              order: entry.order,
              title: asText(entry.title),
              framing: dpFramingById[eid] || asText(entry.framing),
              artefact_id: asText(entry.artefact_id)
            };
          });
        finalJournal = {
          enabled: true,
          title:
            (s5Journal && asText(s5Journal.title)) ||
            asText(s4Journal.title) ||
            JOURNAL_DEFAULT_TITLE,
          entries: finalEntries
        };
      } else {
        finalJournal = {
          enabled: false,
          title: asText(s4Journal.title) || JOURNAL_DEFAULT_TITLE,
          entries: []
        };
      }

      var assembled = {
        artifact_type: FINAL_PAGE_ARTIFACT_TYPE,
        schema_version: FINAL_PAGE_SCHEMA_VERSION,
        product_id: FINAL_PAGE_PRODUCT_ID,
        title: asText(s5.value.title),
        shared_authoritative_material: {
          status: s4.resolvedSharedAuthoritativeMaterial.status,
          content: s4.resolvedSharedAuthoritativeMaterial.content
        },
        editorial_opening_image: deepClone(s5.value.editorial_opening_image),
        activities: [],
        sections: orderedSections,
        commissions: orderedCommissions,
        learning_journey: {
          allocated_minutes: s1.value.journey_allocated_minutes,
          design_intent: asText(s5.value.learning_journey.design_intent),
          continuity: asText(s4.value.continuity),
          journal: finalJournal
        },
        assembly_state: {
          current_stage: "design_page",
          enriched_by: STAGE_ORDER.slice(),
          calls_model: true
        }
      };

      var designMod = resolveDesignPageMod();
      if (designMod && typeof designMod.validateLearningJourneyDesignPage === "function") {
        var finalGate = designMod.validateLearningJourneyDesignPage(assembled, {
          parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes,
          requireStructuredDurations: true
        });
        if (!finalGate || !finalGate.ok) {
          return {
            ok: false,
            page: null,
            errors: (finalGate && finalGate.errors) || ["final_learning_journey_page_invalid"],
            warnings: [],
            diagnostics: []
          };
        }
      }

      return {
        ok: true,
        page: assembled,
        errors: [],
        warnings: [],
        diagnostics: []
      };
    }

    // -------------------------------------------------------------------------
    // Strict mode-aware resolver (progressive vs legacy monolithic)
    // -------------------------------------------------------------------------

    function resolveLearningJourneyPageByMode(wf, input, options) {
      var opts = isPlainObject(options) ? options : {};
      var mode = classifyLearningJourneyWorkflowMode(wf);
      var designMod = resolveDesignPageMod();

      if (mode === "progressive") {
        if (!isPlainObject(input)) {
          return {
            ok: false,
            mode: "progressive",
            page: null,
            errors: ["progressive_stage_captures_required"],
            warnings: [],
            diagnostics: []
          };
        }
        // Reject raw monolithic page object passed directly instead of 5-stage partial map.
        if (isMonolithicLearningJourneyDesignPageShape(input)) {
          return {
            ok: false,
            mode: "progressive",
            page: null,
            errors: ["monolithic_capture_rejected_for_progressive_workflow"],
            warnings: [],
            diagnostics: []
          };
        }
        var res = assembleLearningJourneyPageFromPartials(input, opts);
        return {
          ok: res.ok,
          mode: "progressive",
          page: res.page,
          errors: res.errors,
          warnings: res.warnings,
          diagnostics: res.diagnostics
        };
      }

      // Legacy monolithic workflow mode: validate monolithic Step 5 capture unchanged.
      var legacyRaw =
        isPlainObject(input) && Object.prototype.hasOwnProperty.call(input, "design_page")
          ? input.design_page
          : input;
      var parsedLegacy = parseJsonObjectInput(legacyRaw, "learning_journey_page");
      if (!parsedLegacy.ok) {
        return {
          ok: false,
          mode: "legacy_monolithic",
          page: null,
          errors: [parsedLegacy.error],
          warnings: [],
          diagnostics: []
        };
      }
      if (!designMod || typeof designMod.validateLearningJourneyDesignPage !== "function") {
        return {
          ok: false,
          mode: "legacy_monolithic",
          page: null,
          errors: ["learning_journey_design_page_module_unavailable"],
          warnings: [],
          diagnostics: []
        };
      }
      var legacyGate = designMod.validateLearningJourneyDesignPage(parsedLegacy.value, {
        parentAuthoritativeMinutes: opts.parentAuthoritativeMinutes,
        requireStructuredDurations: !!opts.requireStructuredDurations
      });
      if (!legacyGate || !legacyGate.ok) {
        return {
          ok: false,
          mode: "legacy_monolithic",
          page: null,
          errors: (legacyGate && legacyGate.errors) || ["invalid_learning_journey_page"],
          warnings: [],
          diagnostics: []
        };
      }
      return {
        ok: true,
        mode: "legacy_monolithic",
        page: parsedLegacy.value,
        errors: [],
        warnings: [],
        diagnostics: []
      };
    }

    // -------------------------------------------------------------------------
    // Economical authoritative inter-stage handoff (S105-D02 #7)
    // Accepted stored captures take precedence over conversational context.
    // -------------------------------------------------------------------------

    function tryParseStoredStage(raw) {
      if (raw == null || raw === "") return null;
      var parsed = parseJsonObjectInput(raw, "stage");
      return parsed.ok ? parsed.value : null;
    }

    function buildAuthoritativeStageHandoffSection(targetStage, storedCaptures, options) {
      var stage = asText(targetStage).toLowerCase();
      if (!stage || stage === "learning_requirements") return "";
      var caps = isPlainObject(storedCaptures) ? storedCaptures : {};
      var opts = isPlainObject(options) ? options : {};

      var s1 = tryParseStoredStage(caps.learning_requirements);
      var s2 = tryParseStoredStage(caps.learning_progression);
      var s3 = tryParseStoredStage(caps.learning_elements);
      var s4 = tryParseStoredStage(caps.learning_commissions);

      var lines = [
        "AUTHORITATIVE STORED UPSTREAM CAPTURES (precedence rule)",
        "Accepted structured stage captures take precedence over earlier conversational context — especially after author edits. Honour the authoritative anchors below verbatim; do not regenerate them."
      ];

      var hasAnyAnchor = false;
      var parentMin = isPositiveInteger(opts.parentAuthoritativeMinutes)
        ? opts.parentAuthoritativeMinutes
        : s1 && isPositiveInteger(s1.journey_allocated_minutes)
          ? s1.journey_allocated_minutes
          : null;

      if (parentMin != null) {
        hasAnyAnchor = true;
        lines.push("- Authoritative journey_allocated_minutes: " + parentMin);
      }

      if (stage === "learning_progression") {
        if (s1) {
          hasAnyAnchor = true;
          if (asText(s1.purpose)) lines.push("- Stage 1 purpose: " + asText(s1.purpose));
          if (asText(s1.learner_profile)) {
            lines.push("- Stage 1 learner_profile: " + asText(s1.learner_profile));
          }
          var s1Bok = Array.isArray(s1.body_of_knowledge)
            ? s1.body_of_knowledge.map(asText).filter(Boolean).join("; ")
            : asText(s1.body_of_knowledge);
          if (s1Bok) {
            lines.push("- Stage 1 body_of_knowledge: " + s1Bok);
          }
          if (asText(s1.constraints_and_tradeoffs)) {
            lines.push("- Stage 1 constraints_and_tradeoffs: " + asText(s1.constraints_and_tradeoffs));
          }
          if (asText(s1.journal_orientation)) {
            lines.push("- Stage 1 journal_orientation: " + asText(s1.journal_orientation));
          }
          if (isPlainObject(s1.learning_outcomes)) {
            if (asText(s1.learning_outcomes.learner_level)) {
              lines.push("- Stage 1 learner_level: " + asText(s1.learning_outcomes.learner_level));
            }
            if (asText(s1.learning_outcomes.scope)) {
              lines.push("- Stage 1 scope: " + asText(s1.learning_outcomes.scope));
            }
          }
          var s1Outcomes =
            isPlainObject(s1.learning_outcomes) && Array.isArray(s1.learning_outcomes.learning_outcomes)
              ? s1.learning_outcomes.learning_outcomes
              : [];
          if (s1Outcomes.length) {
            lines.push("- Stage 1 authoritative learning_outcomes (do not regenerate):");
            s1Outcomes.forEach(function (row, idx) {
              var stmt = asText(row && row.statement);
              if (stmt) lines.push("  " + (idx + 1) + ". " + stmt);
            });
          }
        }
      } else if (stage === "learning_elements") {
        if (s1) {
          var s1BokForEl = Array.isArray(s1.body_of_knowledge)
            ? s1.body_of_knowledge.map(asText).filter(Boolean).join("; ")
            : asText(s1.body_of_knowledge);
          if (s1BokForEl) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 body_of_knowledge: " + s1BokForEl);
          }
          if (asText(s1.constraints_and_tradeoffs)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 constraints_and_tradeoffs: " + asText(s1.constraints_and_tradeoffs));
          }
        }
        if (s2) {
          hasAnyAnchor = true;
          if (isPlainObject(s2.journey_structure)) {
            var jsMode = asText(s2.journey_structure.mode || "single");
            var jsRat = asText(s2.journey_structure.rationale);
            lines.push(
              "- Stage 2 journey_structure: " + jsMode + (jsRat ? " — " + jsRat : "")
            );
            if (
              jsMode === "constituent" &&
              Array.isArray(s2.journey_structure.constituent_journeys) &&
              s2.journey_structure.constituent_journeys.length
            ) {
              lines.push("- Stage 2 constituent_journeys:");
              s2.journey_structure.constituent_journeys.forEach(function (cj) {
                if (!isPlainObject(cj)) return;
                lines.push(
                  "  - " +
                    asText(cj.constituent_id) +
                    " (" +
                    cj.indicative_minutes +
                    " min): " +
                    asText(cj.title) +
                    (asText(cj.purpose) ? " — " + asText(cj.purpose) : "")
                );
              });
            }
          }
          if (asText(s2.developmental_arc)) {
            lines.push("- Stage 2 developmental_arc: " + asText(s2.developmental_arc));
          }
          var phases = Array.isArray(s2.developmental_phases) ? s2.developmental_phases : [];
          if (phases.length) {
            lines.push("- Stage 2 authoritative developmental_phases (match phase_id and per-phase indicative_minutes):");
            phases.forEach(function (p) {
              if (!isPlainObject(p)) return;
              var pDeps = Array.isArray(p.dependencies)
                ? p.dependencies.map(asText).filter(Boolean).join(", ")
                : "";
              var pScaff = asText(p.scaffolding_and_evidence);
              lines.push(
                "  - " +
                  asText(p.phase_id) +
                  " (" +
                  p.indicative_minutes +
                  " min" +
                  (asText(p.constituent_id) ? ", constituent " + asText(p.constituent_id) : "") +
                  (pDeps ? ", depends on " + pDeps : "") +
                  "): " +
                  asText(p.title) +
                  " — " +
                  asText(p.purpose) +
                  (pScaff ? " | Scaffolding/evidence: " + pScaff : "")
              );
            });
          }
          if (asText(s2.journal_note)) {
            lines.push("- Stage 2 journal_note: " + asText(s2.journal_note));
          }
        }
      } else if (stage === "learning_commissions") {
        if (s1) {
          if (asText(s1.learner_profile)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 learner_profile: " + asText(s1.learner_profile));
          }
          if (asText(s1.constraints_and_tradeoffs)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 constraints_and_tradeoffs: " + asText(s1.constraints_and_tradeoffs));
          }
          if (asText(s1.journal_orientation)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 journal_orientation: " + asText(s1.journal_orientation));
          }
          if (isPlainObject(s1.learning_outcomes) && Array.isArray(s1.learning_outcomes.learning_outcomes)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 authoritative learning_outcomes (reference by 1-based relevant_journey_outcome_numbers or omit to inherit all; never copy JSON into commissions):");
            s1.learning_outcomes.learning_outcomes.forEach(function (row, idx) {
              var stmt = asText(row && row.statement);
              if (stmt) lines.push("  " + (idx + 1) + ". " + stmt);
            });
          }
        }
        if (s2) {
          if (asText(s2.developmental_arc)) {
            hasAnyAnchor = true;
            lines.push("- Stage 2 developmental_arc: " + asText(s2.developmental_arc));
          }
          if (asText(s2.journal_note)) {
            hasAnyAnchor = true;
            lines.push("- Stage 2 journal_note: " + asText(s2.journal_note));
          }
        }
        if (s3 && Array.isArray(s3.elements) && s3.elements.length) {
          hasAnyAnchor = true;
          lines.push("- Stage 3 authoritative elements (every element_id must be covered by commissions[].element_ids):");
          s3.elements.forEach(function (el) {
            if (!isPlainObject(el)) return;
            var elDeps = Array.isArray(el.dependencies)
              ? el.dependencies.map(asText).filter(Boolean).join(", ")
              : "";
            var elFocus = asText(el.knowledge_focus);
            var elScaff = asText(el.scaffolding_and_feedback);
            lines.push(
              "  - " +
                asText(el.element_id) +
                " [" +
                asText(el.phase_id) +
                ", " +
                el.indicative_minutes +
                " min" +
                (elDeps ? ", depends on " + elDeps : "") +
                (el.journal_producer_candidate ? ", journal_producer_candidate" : "") +
                "]: " +
                asText(el.title) +
                " — " +
                asText(el.educational_job) +
                (elFocus ? " | Focus: " + elFocus : "") +
                (elScaff ? " | Scaffolding/feedback: " + elScaff : "")
            );
          });
          if (asText(s3.boundary_notes)) {
            lines.push("- Stage 3 boundary_notes: " + asText(s3.boundary_notes));
          }
        }
      } else if (stage === "design_page") {
        if (s1) {
          if (asText(s1.purpose)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 purpose: " + asText(s1.purpose));
          }
          if (asText(s1.learner_profile)) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 learner_profile: " + asText(s1.learner_profile));
          }
          var s1OutForDp =
            isPlainObject(s1.learning_outcomes) && Array.isArray(s1.learning_outcomes.learning_outcomes)
              ? s1.learning_outcomes.learning_outcomes
              : [];
          if (s1OutForDp.length) {
            hasAnyAnchor = true;
            lines.push("- Stage 1 authoritative learning_outcomes (editorial orientation only — do not emit learning_outcomes in Stage 5 JSON):");
            s1OutForDp.forEach(function (row, idx) {
              var stmt = asText(row && row.statement);
              if (stmt) lines.push("  " + (idx + 1) + ". " + stmt);
            });
          }
        }
        if (s2 && asText(s2.developmental_arc)) {
          hasAnyAnchor = true;
          lines.push("- Stage 2 developmental_arc: " + asText(s2.developmental_arc));
        }
        var elementJobById = {};
        if (s3 && Array.isArray(s3.elements)) {
          s3.elements.forEach(function (el) {
            if (!isPlainObject(el) || !asText(el.element_id)) return;
            elementJobById[asText(el.element_id)] = asText(el.educational_job || el.title);
          });
        }
        if (s4) {
          hasAnyAnchor = true;
          if (asText(s4.continuity)) {
            lines.push("- Stage 4 journey continuity summary (editorial orientation only — do not emit continuity in Stage 5 JSON): " + asText(s4.continuity));
          }
          var comms = Array.isArray(s4.commissions)
            ? s4.commissions.slice().sort(function (a, b) {
                return Number(a && a.order) - Number(b && b.order);
              })
            : [];
          if (comms.length) {
            lines.push(
              "- Stage 4 authoritative commissions manifest (emit journey_intro first, then exact 1:1 sections[] matching each section_id in this order; do NOT emit commissions[] or shared_authoritative_material):"
            );
            comms.forEach(function (c) {
              if (!isPlainObject(c)) return;
              var elCues = Array.isArray(c.element_ids)
                ? c.element_ids
                    .map(function (eid) {
                      return elementJobById[asText(eid)] || "";
                    })
                    .filter(Boolean)
                    .join("; ")
                : "";
              lines.push(
                "  - order " +
                  c.order +
                  " | " +
                  asText(c.commission_id) +
                  " -> section_id: \"" +
                  asText(c.section_id) +
                  "\" | " +
                  asText(c.title) +
                  " (" +
                  (asText(c.status) === "unsupported" ? "unsupported" : asText(c.product_id)) +
                  ", " +
                  c.allocated_minutes +
                  " min)" +
                  (elCues ? " — Focus: " + elCues : "")
              );
            });
          }
          if (isPlainObject(s4.journal)) {
            if (s4.journal.enabled === true) {
              var entries = Array.isArray(s4.journal.entries)
                ? s4.journal.entries.slice().sort(function (a, b) {
                    return Number(a && a.order) - Number(b && b.order);
                  })
                : [];
              lines.push(
                "- Stage 4 authoritative Journal (enabled: true" +
                  (asText(s4.journal.title) ? ', title: "' + asText(s4.journal.title) + '"' : "") +
                  (asText(s4.journal.decision_basis) ? " | basis: " + asText(s4.journal.decision_basis) : "") +
                  " — emit learner-facing framing for each entry_id below; do NOT emit enabled, order, title on entries, or artefact_id):"
              );
              entries.forEach(function (e) {
                if (!isPlainObject(e)) return;
                lines.push(
                  "  - entry_id: \"" +
                    asText(e.entry_id) +
                    "\" | " +
                    asText(e.title) +
                    " (" +
                    asText(e.artefact_id) +
                    ")" +
                    (asText(e.framing) ? " | Stage 4 framing cue: " + asText(e.framing) : " [framing required]")
                );
              });
            } else {
              lines.push(
                "- Stage 4 authoritative Journal: enabled false — OMIT learning_journey.journal in Stage 5."
              );
            }
          }
          if (asText(s4.feasibility_note)) {
            lines.push("- Stage 4 feasibility_note (reflect concisely in design_intent if feasibility tension exists): " + asText(s4.feasibility_note));
          }
        }
      }

      if (!hasAnyAnchor) {
        lines.push(
          "- Use the accepted upstream stage captures from this workflow (falling back to earlier conversation only where no stored capture is supplied yet)."
        );
      }
      return lines.join("\n");
    }

    return {
      STAGE_ARTIFACT_TYPE: STAGE_ARTIFACT_TYPE,
      STAGE_SCHEMA_VERSION: STAGE_SCHEMA_VERSION,
      FINAL_PAGE_ARTIFACT_TYPE: FINAL_PAGE_ARTIFACT_TYPE,
      FINAL_PAGE_SCHEMA_VERSION: FINAL_PAGE_SCHEMA_VERSION,
      FINAL_PAGE_PRODUCT_ID: FINAL_PAGE_PRODUCT_ID,
      PROGRESSIVE_CAPTURE_VERSION: PROGRESSIVE_CAPTURE_VERSION,
      STAGE_ORDER: STAGE_ORDER.slice(),
      STAGE_CANONICAL_STEP_IDS: Object.keys(STAGE_CANONICAL_STEP_IDS).reduce(function (acc, k) {
        acc[k] = STAGE_CANONICAL_STEP_IDS[k].slice();
        return acc;
      }, {}),
      DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS: DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.slice(),
      readProgressiveCaptureVersion: readProgressiveCaptureVersion,
      isLearningJourneyWorkflowRecord: isLearningJourneyWorkflowRecord,
      isProgressiveLearningJourneyWorkflow: isProgressiveLearningJourneyWorkflow,
      classifyLearningJourneyWorkflowMode: classifyLearningJourneyWorkflowMode,
      isMonolithicLearningJourneyDesignPageShape: isMonolithicLearningJourneyDesignPageShape,
      validateLearningJourneyRequirementsPartial: validateLearningJourneyRequirementsPartial,
      validateLearningJourneyProgressionPartial: validateLearningJourneyProgressionPartial,
      validateLearningJourneyElementsPartial: validateLearningJourneyElementsPartial,
      validateLearningJourneyCommissionsPartial: validateLearningJourneyCommissionsPartial,
      validateLearningJourneyDesignPagePartial: validateLearningJourneyDesignPagePartial,
      assembleLearningJourneyPageFromPartials: assembleLearningJourneyPageFromPartials,
      resolveLearningJourneyPageByMode: resolveLearningJourneyPageByMode,
      buildAuthoritativeStageHandoffSection: buildAuthoritativeStageHandoffSection
    };
  }
);
