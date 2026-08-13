/**
 * Sprint 56F Phase 3 — DLA enrich-in-place for vNext page artefacts.
 */
(function (root, factory) {
  "use strict";
  var populationContract = null;
  var beatRegistry = null;
  var instructionalArchetype = null;
  var activityTitleContract = null;
  if (typeof module === "object" && module.exports) {
    try {
      populationContract = require("./episode-plan-population-contract.js");
    } catch (_) {}
    try {
      beatRegistry = require("./beat-material-registry.js");
    } catch (_) {}
    try {
      instructionalArchetype = require("./ld-instructional-archetype.js");
    } catch (_) {}
    try {
      activityTitleContract = require("./ld-activity-title-contract.js");
    } catch (_) {}
    module.exports = factory(
      populationContract,
      beatRegistry,
      instructionalArchetype,
      activityTitleContract
    );
  } else {
    populationContract = root.PRISM_EPISODE_PLAN_POPULATION;
    beatRegistry = root.PRISM_BEAT_MATERIAL_REGISTRY;
    instructionalArchetype = root.PRISM_LD_INSTRUCTIONAL_ARCHETYPE;
    activityTitleContract = root.PRISM_LD_ACTIVITY_TITLE_CONTRACT;
    root.PRISM_PAGE_DLA_ENRICH = factory(
      populationContract,
      beatRegistry,
      instructionalArchetype,
      activityTitleContract
    );
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function (populationContract, beatRegistry, instructionalArchetype, activityTitleContract) {
    "use strict";

    function getPopulationContract() {
      if (populationContract) return populationContract;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_EPISODE_PLAN_POPULATION || null;
    }

    function getBeatRegistry() {
      if (beatRegistry) return beatRegistry;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_BEAT_MATERIAL_REGISTRY || null;
    }

    function getInstructionalArchetypeLib() {
      if (instructionalArchetype) return instructionalArchetype;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_LD_INSTRUCTIONAL_ARCHETYPE || null;
    }

    function getActivityTitleContract() {
      if (activityTitleContract) return activityTitleContract;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_LD_ACTIVITY_TITLE_CONTRACT || null;
    }

    function appendArchetypePlanValidationErrors(page, errors) {
      var lib = getInstructionalArchetypeLib();
      if (!lib || typeof lib.validatePageArchetypePlans !== "function") return;
      var result = lib.validatePageArchetypePlans(page);
      if (result && Array.isArray(result.errors) && result.errors.length) {
        result.errors.forEach(function (err) {
          errors.push(err);
        });
      }
    }

    var ENRICH_VERSION = "56F-DLA-ENRICH-1";
    var SHELL_DLA_PLACEHOLDER = "\u2014";
    var SCHEMA_VERSION = "2.0.0";

    var DLA_REQUIRED_STRING_FIELDS = [
      "learner_task",
      "expected_output",
      "activity_preamble",
      "intellectual_coherence_bridge"
    ];

    var DLA_OWNED_COGNITION_FIELDS = [
      "reasoning_orientation",
      "self_explanation_prompt",
      "evidence_use_prompt",
      "argument_structure_hint",
      "conceptual_contrast_prompt",
      "disciplinary_lens",
      "transfer_or_application_task",
      "scaffold_hint_sequence",
      "uncertainty_tension_prompt",
      "prior_knowledge_activation",
      "study_orientation",
      "intellectual_frame",
      "intellectual_coherence_bridge",
      "support_note"
    ];

    var INTERNAL_ACTIVITY_KEYS = [
      "_population_trace",
      "_learner_task_segments",
      "_population_contract_version",
      "episode_plan_ref",
      "materials_order"
    ];

    var FUNCTION_TO_MATERIAL_TYPE = {
      explanation: "text",
      observation: "text",
      criteria_exposition: "text",
      example: "worked_example",
      non_example: "worked_example",
      worked_thinking: "worked_example",
      worked_judgement: "worked_example",
      guided_practice: "template",
      guided_reasoning: "decision_table",
      guided_inquiry: "prompt_set",
      independent_performance: "template",
      verification: "checklist",
      reflection: "consolidation_summary",
      transfer: "transfer_prompt",
      misconception_confrontation: "prompt_set",
      criteria_construction: "template",
      perspective_construction: "template",
      evaluative_judgement: "template",
      revision: "template"
    };
    var PROVENANCE_SIMULATION = "system_generated_simulation";
    var PROVENANCE_SOURCE_BOUND = "conversation_attachment";
    var KNOWN_PROVENANCE = {
      system_generated_simulation: true,
      conversation_attachment: true
    };

    var EVIDENCE_REQUIRED_FUNCTIONS = {
      guided_reasoning: true,
      guided_inquiry: true,
      evaluative_judgement: true
    };
    var RESPONSE_SCAFFOLD_MATERIAL_TYPES = {
      analysis_table: true,
      decision_table: true,
      comparison_table: true,
      template: true,
      task_cards: true,
      prompt_set: true,
      planning_table: true,
      impact_table: true
    };
    var EVIDENCE_PROVIDER_MATERIAL_TYPES = {
      scenario: true,
      data_table: true,
      reference_table: true,
      text: true,
      worked_example: true,
      sample_output: true
    };

    function deepClone(value) {
      if (value == null || typeof value !== "object") return value;
      if (Array.isArray(value)) return value.map(deepClone);
      var out = {};
      Object.keys(value).forEach(function (key) {
        out[key] = deepClone(value[key]);
      });
      return out;
    }

    function nonEmptyString(value, fallback) {
      var text = String(value == null ? "" : value).trim();
      return text || fallback;
    }

    function hasNonEmptyString(value) {
      return typeof value === "string" && value.trim().length > 0;
    }

    function isShellPlaceholder(value) {
      return String(value == null ? "" : value).trim() === SHELL_DLA_PLACEHOLDER;
    }

    function cleanPopulationText(value) {
      var text = String(value == null ? "" : value).trim();
      return text.replace(/^\[population:[^\]]+\]\s*/i, "").trim();
    }

    function resolveMaterialTypeForFunction(fn) {
      var key = String(fn || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      if (!key) return "text";
      if (
        getBeatRegistry() &&
        typeof getBeatRegistry().resolveMaterialTypeForEpisodeFunction === "function"
      ) {
        var resolved = getBeatRegistry().resolveMaterialTypeForEpisodeFunction(key);
        if (resolved) return resolved;
      }
      return FUNCTION_TO_MATERIAL_TYPE[key] || "text";
    }

    function learningOutcomesIndex(page) {
      var map = {};
      var rows = Array.isArray(page && page.learning_outcomes) ? page.learning_outcomes : [];
      rows.forEach(function (row, index) {
        if (typeof row === "string") {
          map["LO" + (index + 1)] = { outcome_id: "LO" + (index + 1), statement: row };
          return;
        }
        if (!row || typeof row !== "object") return;
        var id = nonEmptyString(row.outcome_id || row.id, "LO" + (index + 1));
        map[id] = row;
      });
      return map;
    }

    function resolveLoStatementForActivity(activity, loIndex) {
      var ids = Array.isArray(activity.learning_outcome_ids)
        ? activity.learning_outcome_ids
        : Array.isArray(activity.mapped_learning_outcome_ids)
        ? activity.mapped_learning_outcome_ids
        : [];
      var i;
      for (i = 0; i < ids.length; i += 1) {
        var lo = loIndex[ids[i]];
        if (!lo) continue;
        var statement = nonEmptyString(lo.statement || lo.text || lo.description, "");
        if (statement) return statement;
      }
      return nonEmptyString(activity.title, "the learning outcome");
    }

    function materialPurposeForBeat(fn, loStatement) {
      var label = String(fn || "")
        .replace(/_/g, " ")
        .trim();
      if (!label) return "Support " + loStatement + ".";
      return (
        "Provide " +
        label +
        " material to help learners work toward: " +
        loStatement +
        "."
      );
    }

    function tokenizeInstructionalFunction(fn) {
      return String(fn || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
    }

    function tokenizeMaterialType(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
    }

    function normalizeSpecificationTypeEchoToken(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/[.,;:!?]+$/g, "");
    }

    function isResponseScaffoldType(type) {
      return !!RESPONSE_SCAFFOLD_MATERIAL_TYPES[tokenizeMaterialType(type)];
    }

    function isProviderType(type) {
      return !!EVIDENCE_PROVIDER_MATERIAL_TYPES[tokenizeMaterialType(type)];
    }

    function normalizeObservableFeatureHints(materialType) {
      var type = tokenizeMaterialType(materialType);
      if (type === "scenario" || type === "text") {
        return [
          "condition stated for each case or source extract",
          "observed outcome reported for each condition",
          "explicit contrast between cases without pre-judging which is best"
        ];
      }
      return [
        "counts, proportions, or measured values across conditions",
        "presence or absence of key markers under each condition",
        "reported change between control and disruption without final judgement"
      ];
    }

    function buildEvidenceRequirementForRow(row, options) {
      var opts = options && typeof options === "object" ? options : {};
      var token = tokenizeInstructionalFunction(row && row.instructional_function);
      if (!EVIDENCE_REQUIRED_FUNCTIONS[token]) return null;
      var materialType = nonEmptyString(row && (row.material_type || row.type), "text");
      var responseFields =
        Array.isArray(opts.learner_response_fields) && opts.learner_response_fields.length
          ? opts.learner_response_fields
          : null;
      var fixedFields =
        Array.isArray(opts.fixed_observation_fields) && opts.fixed_observation_fields.length
          ? opts.fixed_observation_fields
          : null;
      var requirement = {
        kind: "learner_evidence",
        purpose:
          "Provide directly inspectable evidence learners must use to complete the reasoning task.",
        learner_action:
          "Inspect the evidence, identify relevant observations, and justify a conclusion with cited particulars.",
        observable_features: normalizeObservableFeatureHints(materialType),
        minimum_suitable_form:
          "Use a concise learner-facing " + materialType + " that is sufficient for this activity.",
        processing_notes:
          "Keep evidence proportionate to activity duration and prerequisite knowledge; avoid unnecessary raw volume.",
        provenance: "system_generated_simulation",
        disclosure_constraint:
          "Do not state the target inference before the learner inspects and responds.",
        evidence_layout: responseFields ? "combined_evidence_workspace" : "separate_provider"
      };
      if (responseFields) {
        requirement.fixed_observation_fields =
          fixedFields || [
            "Condition or case",
            "Observed measurement or signal",
            "Reported change vs comparison"
          ];
        requirement.learner_response_fields = responseFields;
      }
      return requirement;
    }

    function validateEvidenceRequirementShape(value, path, errors) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        errors.push(path + " must be an object when present");
        return;
      }
      var kind = nonEmptyString(value.kind, "");
      if (kind !== "learner_evidence") {
        errors.push(path + '.kind must be "learner_evidence"');
      }
      if (!hasNonEmptyString(value.purpose)) {
        errors.push(path + ".purpose required");
      }
      if (!hasNonEmptyString(value.learner_action)) {
        errors.push(path + ".learner_action required");
      }
      if (!Array.isArray(value.observable_features) || !value.observable_features.length) {
        errors.push(path + ".observable_features must be a non-empty string array");
      } else {
        value.observable_features.forEach(function (item, index) {
          if (!hasNonEmptyString(item)) {
            errors.push(path + ".observable_features[" + index + "] must be a non-empty string");
          }
        });
      }
      [
        "minimum_suitable_form",
        "processing_notes",
        "provenance",
        "disclosure_constraint",
        "evidence_layout"
      ].forEach(function (key) {
        if (value[key] != null && !hasNonEmptyString(value[key])) {
          errors.push(path + "." + key + " must be a non-empty string when present");
        }
      });
      ["fixed_observation_fields", "learner_response_fields"].forEach(function (key) {
        if (value[key] == null) return;
        if (!Array.isArray(value[key]) || !value[key].length) {
          errors.push(path + "." + key + " must be a non-empty string array when present");
          return;
        }
        value[key].forEach(function (entry, index) {
          if (!hasNonEmptyString(entry)) {
            errors.push(path + "." + key + "[" + index + "] must be a non-empty string");
          }
        });
      });
      var layout = nonEmptyString(value.evidence_layout, "");
      if (layout === "combined_evidence_workspace") {
        if (!Array.isArray(value.fixed_observation_fields) || !value.fixed_observation_fields.length) {
          errors.push(
            path +
              ".fixed_observation_fields must be a non-empty string array for combined_evidence_workspace"
          );
        }
        if (!Array.isArray(value.learner_response_fields) || !value.learner_response_fields.length) {
          errors.push(
            path +
              ".learner_response_fields must be a non-empty string array for combined_evidence_workspace"
          );
        }
      }
    }

    function sourceUnitHintPresent(text) {
      return /\b(poem|excerpt|passage|quotation|quote|stanza|line|page|section|variable|unit|attachment|transcript|dataset|policy|source title|from\s+)/i.test(
        String(text || "")
      );
    }

    function sourceBoundSpecLooksSummaryReferenceOnly(hintBlob) {
      var text = String(hintBlob || "").toLowerCase();
      if (!text.trim()) return false;
      var hasInspectableDemand =
        /\b(exact (?:wording|lines?|quotation|values?|structure)|attributed (?:excerpt|quotation|extract)|verbatim|preserve (?:wording|lineation|values?|structure)|inspectable (?:excerpt|quotation|extract|source)|quotation blocks?|quoted lines?|pipe[- ]table (?:of )?values?)\b/.test(
          text
        );
      if (hasInspectableDemand) return false;
      return (
        /\b(evidence summary(?: pack)?|thematic summary|summary pack|summary of (?:the )?(?:evidence|source|poem|text)|representative observations|extract references?|references? to (?:the )?(?:extracts?|excerpts?|sources?)|observation(?:s)? and (?:extract )?references?)\b/.test(
          text
        ) ||
        (/\bsummary\b/.test(text) &&
          /\b(references?|observations?)\b/.test(text) &&
          !/\b(excerpt|quotation|quote|wording|lineation|verbatim|exact)\b/.test(text))
      );
    }

    function materialRoleBlob(row, options) {
      if (!row || typeof row !== "object") return "";
      var evidenceRequirement =
        row.evidence_requirement && typeof row.evidence_requirement === "object"
          ? row.evidence_requirement
          : {};
      var joined = [
        row.purpose,
        row.specification,
        evidenceRequirement.purpose,
        evidenceRequirement.learner_action,
        evidenceRequirement.processing_notes,
        evidenceRequirement.minimum_suitable_form
      ]
        .map(function (part) {
          return String(part || "");
        })
        .join(" ");
      if (options && options.keepCase) return joined;
      return joined.toLowerCase();
    }

    function materialHasInspectableEvidenceRole(row) {
      var blob = materialRoleBlob(row);
      return /\b(excerpt|quotation|quote|observed|observations?|data|dataset|case(?:s)?|scenario(?:s)?|results?|attributed|preserve (?:wording|lineation|values?|structure)|exact (?:wording|lines?|values?)|source extract|raw (?:data|text)|pipe[- ]table|measured|residual|sequence[- ]change)\b/.test(
        blob
      );
    }

    function materialLooksTeachingOnly(row) {
      var ownBlob = (
        nonEmptyString(row && row.purpose, "") +
        " " +
        nonEmptyString(row && row.specification, "")
      ).toLowerCase();
      if (!ownBlob.trim()) return false;
      if (
        !/\b(introduce|explain|explanatory|teaching|overview|guide to|key concepts?|conceptual|teach(?:ing)? (?:learners )?(?:about|how)|introduce key)\b/.test(
          ownBlob
        )
      ) {
        return false;
      }
      return !materialHasInspectableEvidenceRole(row);
    }

    function extractSourceIdentityHints(text) {
      var raw = String(text || "");
      var hints = [];
      var quoted = raw.match(/[“"']([^“"']{3,80})[“"']/g) || [];
      quoted.forEach(function (match) {
        hints.push(match.replace(/^[“"']|[“"']$/g, "").trim());
      });
      var titled =
        raw.match(
          /\b(?:titled|entitled|named|poem|policy|transcript|dataset|attachment|source)\s+[“"']?([A-Za-z][A-Za-z0-9'’\- ]{2,60})/gi
        ) || [];
      titled.forEach(function (match) {
        var cleaned = match
          .replace(
            /^(?:titled|entitled|named|poem|policy|transcript|dataset|attachment|source)\s+[“"']?/i,
            ""
          )
          .trim();
        if (cleaned) hints.push(cleaned);
      });
      var titleCase = raw.match(/\b[A-Z][A-Za-z0-9'’-]{2,}(?:\s+[A-Z][A-Za-z0-9'’-]{2,})+\b/g) || [];
      titleCase.forEach(function (match) {
        hints.push(match.trim());
      });
      var stop = {
        provide: true,
        learner: true,
        evidence: true,
        inspect: true,
        compare: true,
        analyse: true,
        analyze: true,
        evaluate: true,
        activity: true,
        material: true,
        materials: true,
        purpose: true,
        conversation: true,
        attachment: true,
        system: true,
        generated: true,
        simulation: true
      };
      return hints
        .map(function (hint) {
          return String(hint || "")
            .toLowerCase()
            .replace(/[^a-z0-9'’\-\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        })
        .filter(function (hint) {
          if (!hint || hint.length < 4) return false;
          if (stop[hint]) return false;
          return true;
        });
    }

    function uniqueStrings(values) {
      var seen = {};
      var out = [];
      (values || []).forEach(function (value) {
        var key = String(value || "");
        if (!key || seen[key]) return;
        seen[key] = true;
        out.push(key);
      });
      return out;
    }

    function collectPageConversationAttachmentIdentities(page) {
      var identities = [];
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      activities.forEach(function (activity) {
        var requiredMaterials = Array.isArray(activity && activity.required_materials)
          ? activity.required_materials
          : [];
        requiredMaterials.forEach(function (row) {
          if (
            !row ||
            typeof row !== "object" ||
            !row.evidence_requirement ||
            typeof row.evidence_requirement !== "object"
          ) {
            return;
          }
          var provenance = nonEmptyString(row.evidence_requirement.provenance, "").toLowerCase();
          if (provenance !== PROVENANCE_SOURCE_BOUND) return;
          extractSourceIdentityHints(materialRoleBlob(row, { keepCase: true })).forEach(function (hint) {
            identities.push(hint);
          });
        });
      });
      return uniqueStrings(identities);
    }

    function textReferencesSourceIdentities(text, identities) {
      var haystack = String(text || "").toLowerCase();
      if (!haystack) return false;
      return (identities || []).some(function (identity) {
        return identity && haystack.indexOf(identity) !== -1;
      });
    }

    function activityAppearsToContinueEstablishedSources(activity, identities) {
      if (!identities || !identities.length) return false;
      var joined = collectActivityEvidenceContractText(activity);
      if (textReferencesSourceIdentities(joined, identities)) return true;
      return /\b(the (?:same )?(?:poems?|sources?|attachments?|excerpts?|quotations?|texts?)|earlier (?:evidence|excerpts?|quotations?|attachments?)|previously (?:supplied|attached|quoted)|reuse (?:earlier|prior|the) (?:evidence|excerpts?|quotations?))\b/.test(
        joined
      );
    }

    function simulationPurportsNamedAuthoritativeSource(hintBlob) {
      var text = String(hintBlob || "");
      return (
        /\b(attached (?:poem|text|source|material|file|dataset|transcript|policy)|conversation attachment|authoritative (?:source|text|material|poem)|from the attached)\b/i.test(
          text
        ) ||
        /\b(?:poem|policy|transcript|dataset|source text)\s+[“"'][^“"']{3,}[“"']/i.test(text) ||
        /\bfrom\s+[“"'][^“"']{3,}[“"']/i.test(text) ||
        /\b(?:titled|entitled|named)\s+[“"']?[A-Z][^,".]{2,60}/i.test(text)
      );
    }

    function simulationClaimsSourceBoundQuotations(hintBlob) {
      var text = String(hintBlob || "").toLowerCase();
      if (!text.trim()) return false;
      return /\b(poem extracts?|extracts? from (?:the )?(?:supplied|attached|provided)|supporting quotations?|exact (?:quotations?|wording|lines?) from (?:the )?(?:supplied|attached|provided|poems?|texts?|sources?)|quotations? from (?:the )?(?:supplied|attached|provided|poems?|texts?|sources?)|from supplied texts?|from the supplied (?:poems?|texts?|sources?))\b/.test(
        text
      );
    }

    function identityCoveredByInventory(identity, inventory) {
      var needle = String(identity || "").toLowerCase();
      if (!needle) return true;
      return (inventory || []).some(function (known) {
        var hay = String(known || "").toLowerCase();
        if (!hay) return false;
        return hay === needle || hay.indexOf(needle) !== -1 || needle.indexOf(hay) !== -1;
      });
    }

    function readLearnerEvidenceAttachmentDeclaration(page) {
      var notes = page && page.generation_notes && page.generation_notes.learner_evidence_attachments;
      if (!notes || typeof notes !== "object" || Array.isArray(notes)) return null;
      return notes;
    }

    function declarationIndicatesLearnerEvidence(declaration) {
      if (!declaration || declaration.present !== true) return false;
      var role = nonEmptyString(declaration.role, "").toLowerCase();
      return role === "learner_evidence" || role === "both";
    }

    function pageHasConversationAttachmentProvider(page) {
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      return activities.some(function (activity) {
        var requiredMaterials = Array.isArray(activity && activity.required_materials)
          ? activity.required_materials
          : [];
        return requiredMaterials.some(function (row) {
          if (!materialHasEvidenceRequirement(row)) return false;
          return (
            nonEmptyString(row.evidence_requirement && row.evidence_requirement.provenance, "").toLowerCase() ===
            PROVENANCE_SOURCE_BOUND
          );
        });
      });
    }

    function activityLooksSourceAnalytical(activity) {
      if (!taskLooksEvidenceDependent(activity)) return false;
      var joined = collectHardEvidenceObligationText(activity);
      return /\b(poem|poems|quotation|excerpt|attached|supplied (?:text|poem|source|example)|imagery|tone|structure|formal features?|textual features?|source (?:material|text|properties)|from the (?:poems?|texts?|sources?))\b/.test(
        joined
      );
    }

    function activityProvidersAreSimulationOrSummaryOnly(activity) {
      var requiredMaterials = Array.isArray(activity && activity.required_materials)
        ? activity.required_materials
        : [];
      var providers = requiredMaterials.filter(materialHasEvidenceRequirement);
      if (!providers.length) return true;
      return providers.every(function (row) {
        var provenance = nonEmptyString(
          row.evidence_requirement && row.evidence_requirement.provenance,
          ""
        ).toLowerCase();
        if (provenance === PROVENANCE_SOURCE_BOUND) return false;
        var blob = materialRoleBlob(row);
        return (
          provenance === PROVENANCE_SIMULATION ||
          sourceBoundSpecLooksSummaryReferenceOnly(blob) ||
          /\b(thematic summary|summary pack|evidence summary)\b/.test(blob)
        );
      });
    }

    function collectDlaEvidenceQualityDiagnostics(page) {
      var diagnostics = [];
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      var establishedSourceIdentities = collectPageConversationAttachmentIdentities(page);
      var pageHasSourceBound = establishedSourceIdentities.length > 0;
      var priorSourceInventory = [];
      var attachmentDeclaration = readLearnerEvidenceAttachmentDeclaration(page);
      var declaresLearnerEvidence = declarationIndicatesLearnerEvidence(attachmentDeclaration);
      var declaredInventory = uniqueStrings(
        Array.isArray(attachmentDeclaration && attachmentDeclaration.inventoried_units)
          ? attachmentDeclaration.inventoried_units.map(function (unit) {
              return String(unit || "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();
            })
          : []
      );

      if (declaresLearnerEvidence && !pageHasConversationAttachmentProvider(page)) {
        diagnostics.push({
          severity: "warn",
          code: "SOURCE_INTENDED_WITHOUT_ATTACHMENT_PROVIDERS",
          message:
            "generation_notes.learner_evidence_attachments declares learner-evidence material, but no conversation_attachment evidence providers were emitted; analytical activities about that material should use conversation_attachment rather than summaries or simulation alone."
        });
      }

      activities.forEach(function (activity, activityIndex) {
        var requiredMaterials = Array.isArray(activity && activity.required_materials)
          ? activity.required_materials
          : [];
        var usesSimulation = false;
        var usesSourceBound = false;
        var activitySourceIdentities = [];

        requiredMaterials.forEach(function (row, reqIndex) {
          if (!row || typeof row !== "object" || Array.isArray(row)) return;
          if (!row.evidence_requirement || typeof row.evidence_requirement !== "object") return;
          var evidenceRequirement = row.evidence_requirement;
          var pathPrefix =
            "activities[" +
            activityIndex +
            "].required_materials[" +
            reqIndex +
            "].evidence_requirement";
          var materialPath =
            "activities[" + activityIndex + "].required_materials[" + reqIndex + "]";
          var provenance = nonEmptyString(evidenceRequirement.provenance, "").toLowerCase();
          var hintBlob = materialRoleBlob(row);
          var rawHintBlob = materialRoleBlob(row, { keepCase: true });

          if (provenance && !KNOWN_PROVENANCE[provenance]) {
            diagnostics.push({
              severity: "warn",
              code: "EVIDENCE_PROVENANCE_UNKNOWN",
              message:
                pathPrefix +
                " uses unrecognized provenance \"" +
                provenance +
                "\"; preferred controlled values are " +
                PROVENANCE_SIMULATION +
                " and " +
                PROVENANCE_SOURCE_BOUND +
                "."
            });
          }

          if (provenance === PROVENANCE_SOURCE_BOUND) {
            usesSourceBound = true;
            var unitHints = uniqueStrings(extractSourceIdentityHints(rawHintBlob));
            unitHints.forEach(function (hint) {
              activitySourceIdentities.push(hint);
            });
            if (!sourceUnitHintPresent(hintBlob)) {
              diagnostics.push({
                severity: "warn",
                code: "SOURCE_BOUND_SOURCE_UNIT_UNSPECIFIED",
                message:
                  pathPrefix +
                  " with conversation_attachment should name the source unit/excerpt required (title, section, page, variable, or passage)."
              });
            }
            if (sourceBoundSpecLooksSummaryReferenceOnly(hintBlob)) {
              diagnostics.push({
                severity: "warn",
                code: "SOURCE_BOUND_SUMMARY_REFERENCE_ONLY",
                message:
                  pathPrefix +
                  " requests summary/reference-only material; source-bound providers must specify directly inspectable excerpts, wording, structure, or values when those properties are material to learner reasoning."
              });
            }
            if (declaredInventory.length) {
              var outsideDeclared = unitHints.filter(function (hint) {
                return !identityCoveredByInventory(hint, declaredInventory);
              });
              if (outsideDeclared.length) {
                diagnostics.push({
                  severity: "warn",
                  code: "SOURCE_BOUND_UNIT_NOT_IN_INVENTORY",
                  message:
                    materialPath +
                    " names conversation_attachment unit(s) absent from generation_notes.learner_evidence_attachments.inventoried_units (" +
                    outsideDeclared.join(", ") +
                    "); allocate only inventoried available source units."
                });
              }
            }
            if (priorSourceInventory.length) {
              var novelUnits = unitHints.filter(function (hint) {
                return !identityCoveredByInventory(hint, priorSourceInventory);
              });
              if (novelUnits.length) {
                diagnostics.push({
                  severity: "warn",
                  code: "SOURCE_BOUND_UNIT_NOT_IN_INVENTORY",
                  message:
                    materialPath +
                    " names conversation_attachment unit(s) not present in the previously inventoried available source set (" +
                    novelUnits.join(", ") +
                    "); allocate only source units actually available in the Copilot conversation and do not reconstruct unavailable works from model memory."
                });
              }
            }
          }

          if (provenance === PROVENANCE_SIMULATION) {
            usesSimulation = true;
            if (simulationClaimsSourceBoundQuotations(hintBlob)) {
              diagnostics.push({
                severity: "warn",
                code: "MIXED_PROVENANCE_SINGLE_PROVIDER",
                message:
                  pathPrefix +
                  " uses system_generated_simulation while also claiming exact/supplied/attached source quotations or extracts; split into separate conversation_attachment and system_generated_simulation providers listed in evidence_decision.provider_material_ids."
              });
            } else if (
              simulationPurportsNamedAuthoritativeSource(hintBlob) ||
              simulationPurportsNamedAuthoritativeSource(rawHintBlob)
            ) {
              diagnostics.push({
                severity: "warn",
                code: "SIMULATION_DESCRIBES_AUTHORITATIVE_SOURCE",
                message:
                  pathPrefix +
                  " uses system_generated_simulation while purporting to describe a named authoritative source; prefer conversation_attachment when that source is available."
              });
            }
            if (
              pageHasSourceBound &&
              textReferencesSourceIdentities(hintBlob, establishedSourceIdentities)
            ) {
              diagnostics.push({
                severity: "warn",
                code: "SOURCE_BOUND_REPLACED_BY_SIMULATION",
                message:
                  materialPath +
                  " replaces established conversation_attachment evidence with system_generated_simulation for analysis of the same source material."
              });
            }
          }
        });

        if (
          (declaresLearnerEvidence || pageHasSourceBound) &&
          activityLooksSourceAnalytical(activity) &&
          activityProvidersAreSimulationOrSummaryOnly(activity)
        ) {
          diagnostics.push({
            severity: "warn",
            code: "SOURCE_RELATED_ACTIVITY_AVOIDS_ATTACHMENT",
            message:
              "activities[" +
              activityIndex +
              "] appears to analyse/interpret/compare/evaluate source properties or supplied examples but uses only summary/simulation providers; when learner-evidence attachments are available, use conversation_attachment providers for those activities."
          });
        }

        if (
          pageHasSourceBound &&
          usesSimulation &&
          !usesSourceBound &&
          activityAppearsToContinueEstablishedSources(activity, establishedSourceIdentities)
        ) {
          var duplicate = diagnostics.some(function (entry) {
            return (
              entry &&
              entry.code === "SOURCE_BOUND_REPLACED_BY_SIMULATION" &&
              String(entry.message || "").indexOf("activities[" + activityIndex + "]") === 0
            );
          });
          if (!duplicate) {
            diagnostics.push({
              severity: "warn",
              code: "SOURCE_BOUND_REPLACED_BY_SIMULATION",
              message:
                "activities[" +
                activityIndex +
                "] appears to analyse established source-bound material but uses only system_generated_simulation; continue with conversation_attachment unless an explicit pedagogical reason requires generated evidence."
            });
          }
        }

        if (activitySourceIdentities.length) {
          priorSourceInventory = uniqueStrings(
            priorSourceInventory.concat(activitySourceIdentities)
          );
        }
      });
      return diagnostics;
    }

    function listEvidenceProviderMaterialIds(requiredMaterials) {
      if (!Array.isArray(requiredMaterials)) return [];
      return requiredMaterials
        .filter(function (row) {
          return (
            row &&
            typeof row === "object" &&
            !Array.isArray(row) &&
            row.evidence_requirement &&
            typeof row.evidence_requirement === "object"
          );
        })
        .map(function (row) {
          return nonEmptyString(row.material_id, "");
        })
        .filter(Boolean);
    }

    function materialHasEvidenceRequirement(row) {
      return !!(
        row &&
        typeof row === "object" &&
        !Array.isArray(row) &&
        row.evidence_requirement &&
        typeof row.evidence_requirement === "object"
      );
    }

    function activityHasSeparateEvidenceProviderCandidate(requiredMaterials) {
      if (!Array.isArray(requiredMaterials)) return false;
      return requiredMaterials.some(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return false;
        if (!buildEvidenceRequirementForRow(row)) return false;
        return isProviderType(nonEmptyString(row.material_type || row.type, ""));
      });
    }

    /**
     * Hard evidence-dependency uses current learner-production obligations only.
     * Preamble/bridge/rationale references to later evidence are soft context and
     * must not independently trigger a hard contradiction.
     */
    function collectHardEvidenceObligationText(activity) {
      var parts = [];
      function pushText(value) {
        if (value == null) return;
        if (typeof value === "string") {
          var trimmed = value.trim();
          if (trimmed) parts.push(trimmed);
          return;
        }
        if (Array.isArray(value)) {
          value.forEach(pushText);
        }
      }
      pushText(activity && activity.learner_task);
      pushText(activity && activity.expected_output);
      pushText(activity && activity.evidence_use_prompt);
      var requiredMaterials = Array.isArray(activity && activity.required_materials)
        ? activity.required_materials
        : [];
      requiredMaterials.forEach(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return;
        var materialType = nonEmptyString(row.material_type || row.type, "");
        var includeRow =
          materialHasEvidenceRequirement(row) ||
          isResponseScaffoldType(materialType) ||
          tokenizeMaterialType(materialType) === "checklist";
        if (!includeRow) return;
        pushText(row.purpose);
        pushText(row.specification);
        if (row.evidence_requirement && typeof row.evidence_requirement === "object") {
          pushText(row.evidence_requirement.purpose);
          pushText(row.evidence_requirement.learner_action);
          pushText(row.evidence_requirement.processing_notes);
          pushText(row.evidence_requirement.minimum_suitable_form);
        }
      });
      return neutralizeForwardLookingEvidenceReferences(parts.join(" ").toLowerCase());
    }

    function collectActivityEvidenceContractText(activity) {
      var parts = [];
      function pushText(value) {
        if (value == null) return;
        if (typeof value === "string") {
          var trimmed = value.trim();
          if (trimmed) parts.push(trimmed);
          return;
        }
        if (Array.isArray(value)) {
          value.forEach(pushText);
        }
      }
      pushText(activity && activity.learner_task);
      pushText(activity && activity.expected_output);
      pushText(activity && activity.activity_preamble);
      DLA_OWNED_COGNITION_FIELDS.forEach(function (field) {
        pushText(activity && activity[field]);
      });
      var requiredMaterials = Array.isArray(activity && activity.required_materials)
        ? activity.required_materials
        : [];
      requiredMaterials.forEach(function (row) {
        if (!row || typeof row !== "object" || Array.isArray(row)) return;
        pushText(row.purpose);
        pushText(row.specification);
        if (row.evidence_requirement && typeof row.evidence_requirement === "object") {
          pushText(row.evidence_requirement.purpose);
          pushText(row.evidence_requirement.learner_action);
          pushText(row.evidence_requirement.processing_notes);
          pushText(row.evidence_requirement.minimum_suitable_form);
        }
      });
      return parts.join(" ").toLowerCase();
    }

    function neutralizeForwardLookingEvidenceReferences(text) {
      return String(text || "")
        .replace(
          /\b(?:this foundation|this preparation|this context|these concepts?) will help you (?:interpret|use|apply) later\b[^.?!]*/gi,
          " "
        )
        .replace(/\b(?:later|subsequent|upcoming|future)\s+(?:textual\s+)?evidence\b/gi, " ")
        .replace(/\bin later activities?\b/gi, " ")
        .replace(/\bfor later (?:analysis|evaluation|comparison|activities?)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    /**
     * "Structure" alone is ambiguous: mathematical expression structure is a
     * procedural task cue; literary/source structure is evidence-bearing.
     */
    function looksLikeMathematicalStructureWording(joined) {
      return /\bstructure\s+of\s+(?:the\s+|each\s+|an?\s+)?(?:expression|equation|formula|function|lagrangian|objective|constraint|multiplier)\b/.test(
        joined
      ) ||
        /\b(?:expression|equation|formula|function|lagrangian)\s+structure\b/.test(joined) ||
        /\b(?:algebraic|mathematical|procedural)\s+structure\b/.test(joined);
    }

    function looksLikeLiteraryOrSourceStructureWording(joined) {
      if (looksLikeMathematicalStructureWording(joined) &&
        !/\b(imagery|tone|poems?|stanza|lineation|formal features?|textual features?|language features?|quotations?|excerpts?|close[- ]read|poetic)\b/.test(
          joined
        )) {
        return false;
      }
      return (
        /\b(textual structure|poetic structure|formal structure|narrative structure|poem(?:['’]s)? structure)\b/.test(
          joined
        ) ||
        (/\bstructure\b/.test(joined) &&
          /\b(imagery|tone|poems?|stanza|lineation|formal features?|textual features?|language features?|quotations?|excerpts?|close[- ]read|poetic form)\b/.test(
            joined
          ))
      );
    }

    function looksLikeSourcePropertyOrTextualEvidenceAnalysis(joined) {
      if (
        /\b(formal features?|textual features?|imagery|tone|poetic form|language features?|lineation|stanza|metre|meter|quotations?|excerpts?|source (?:material|text|properties)|close[- ]read|poems?|from the poems?)\b/.test(
          joined
        )
      ) {
        return true;
      }
      return looksLikeLiteraryOrSourceStructureWording(joined);
    }

    function looksLikeHardSourceEvidenceProductionDemand(joined) {
      return /\b(support(?:ing|ed)?(?:\s+\w+){0,6}\s+with\s+(?:relevant |textual |supporting )?evidence|with supporting evidence|supporting evidence|cite (?:specific |exact |relevant )?(?:evidence|lines?|quotations?|data|observations?|features?)|quotations?\s+from|evidence from (?:the |[a-z]+(?:['’]s)? )?(?:poems?|texts?|sources?|attachments?)|examples? from (?:the |[a-z]+(?:['’]s)? )?(?:poems?|texts?|sources?|attachments?|dataset|data|cases?))\b/.test(
        joined
      );
    }

    /**
     * Instructional scaffolds (explanations, worked/sample outputs, weak/strong
     * model answers, checklists) are not supplied evidence/source material even
     * when learners review, compare, or interpret conceptually.
     */
    function looksLikeInstructionalScaffoldNotSourceEvidence(joined) {
      if (looksLikeSourcePropertyOrTextualEvidenceAnalysis(joined)) return false;
      if (looksLikeHardSourceEvidenceProductionDemand(joined)) return false;
      if (
        /\b(review|study)\s+(?:the\s+)?(?:explanatory|teaching)\s+(?:summary|material|guide|text|overview)\b/.test(
          joined
        ) ||
        /\bstudy\s+the\s+worked\s+example\b/.test(joined) ||
        /\bcompare\s+(?:the\s+)?weak\s+and\s+strong\s+(?:sample\s+)?(?:answer|interpretation|example|response)s?\b/.test(
          joined
        ) ||
        /\binterpret\s+the\s+(?:economic|conceptual)\s+meaning\s+of\b/.test(joined) ||
        /\binterpret\s+the\s+meaning\s+of\b/.test(joined) ||
        /\buse\s+the\s+checklist\s+to\s+review\b/.test(joined)
      ) {
        return true;
      }
      if (
        /\b(?:weak\s+and\s+strong)\s+(?:sample\s+)?(?:answer|interpretation|example|response)s?\b/.test(
          joined
        ) &&
        /\b(?:compare|contrast|review|study|write|summary|interpretation)\b/.test(joined)
      ) {
        return true;
      }
      if (
        /\b(?:provided|supplied|attached)\s+examples?\b/.test(joined) &&
        !/\b(?:imagery|tone|structure|formal features?|textual features?|poems?|sources?|extracts?|quotations?)\b/.test(
          joined
        ) &&
        (/\b(?:weak|strong|sample|modelled|model|teaching|illustrative|instructional)\b/.test(
          joined
        ) ||
          /\b(?:study|review)\s+(?:the\s+)?(?:provided|supplied|attached)\s+examples?\b/.test(
            joined
          ))
      ) {
        return true;
      }
      if (
        /\b(?:explanatory|consolidation summary|sample output|worked example|modelled|teaching overview)\b/.test(
          joined
        ) &&
        /\b(?:review|study|compare|explain|conceptual|interpretation)\b/.test(joined) &&
        !/\b(?:supplied|provided|attached)\s+(?:dataset|data|source|extract|evidence|observations?|case)\b/.test(
          joined
        )
      ) {
        return true;
      }
      if (
        /\binterpret(?:ation|ations)?\b/.test(joined) &&
        /\b(?:teaching|sample|modelled|model|worked|example|explanatory|consolidation)\b/.test(
          joined
        ) &&
        !/\b(?:supplied|provided|attached)\s+(?:dataset|data|source|extract|evidence|table|observations?|results?)\b/.test(
          joined
        ) &&
        !/\b(?:perturbation|observations?|residual|heteroscedasticity|dataset|simulated)\b/.test(joined)
      ) {
        return true;
      }
      return false;
    }

    /**
     * Task/practice inputs (objectives, constraints, practice problems, worked
     * examples, templates) supplied for construct/apply/solve/compare-transform
     * work are not learner evidence. Epistemic use matters: inferring or
     * justifying from observations, sources, or cases remains evidence-dependent.
     */
    function looksLikeProceduralTaskMaterialPractice(joined) {
      if (looksLikeSourcePropertyOrTextualEvidenceAnalysis(joined)) return false;
      if (looksLikeHardSourceEvidenceProductionDemand(joined)) return false;
      if (
        /\b(analy[sz]e|interpret|evaluat(?:e|ion))\s+(?:the\s+)?(?:supplied|provided|attached)\s+(?:dataset|evidence|observations?|data|source|extract|case)\b/.test(
          joined
        )
      ) {
        return false;
      }
      if (
        /\b(?:historical|archaeological)\s+(?:source|sources)\b/.test(joined) ||
        /\b(?:source|historical)\s+(?:excerpt|extract|material)\b/.test(joined)
      ) {
        return false;
      }
      if (/\b(?:quotations?|source properties)\b/.test(joined)) return false;
      if (/\bcases?\s+as\s+(?:evidential|evidence)\b/.test(joined)) return false;
      if (
        /\b(?:justify(?:ing)?|support(?:ing)?)\s+(?:your\s+)?(?:conclusion|interpretation|claim|judgement|judgment)\b/.test(
          joined
        )
      ) {
        return false;
      }
      if (
        /\bobservations?\b/.test(joined) &&
        /\b(?:infer|determine which|best supported|dataset|data)\b/.test(joined)
      ) {
        return false;
      }

      var proceduralVerb =
        /\b(construct|build|complete|solve|apply|derive|write|formulate|create|calculate|compute|transform|modify|implement|fill in|study|review|compare|use)\b/.test(
          joined
        );
      var taskMaterialNoun =
        /\b(worked example|practice problem|objective function|constraints?|optimisation statement|optimization statement|lagrangian|equation|expression|formula|code snippet|template input|guided construction table|analysis table|checklist|problem statement|completed lagrangian|new examples|multiplier)\b/.test(
          joined
        );
      var suppliedTaskInput =
        /\b(?:provided|supplied|attached|given)\s+(?:objective|constraint|optimisation|optimization|practice|problem|equation|function|examples?|statement|inputs?)\b/.test(
          joined
        ) || /\b(?:each|every)\s+(?:practice problem|problem)\b/.test(joined);

      if (proceduralVerb && (taskMaterialNoun || suppliedTaskInput)) {
        return true;
      }

      if (
        /\bcompare\b/.test(joined) &&
        /\b(?:optimisation statement|optimization statement|problem statement|original (?:problem|statement))\b/.test(
          joined
        ) &&
        /\b(?:completed|constructed|finished|correct|transformation|lagrangian)\b/.test(joined)
      ) {
        return true;
      }

      if (
        /\b(?:using|with)\s+(?:the\s+)?(?:provided|supplied|attached)\s+examples?\b/.test(
          joined
        ) &&
        !/\b(?:imagery|tone|formal features?|textual features?|poems?|sources?|extracts?|quotations?|dataset|observations?)\b/.test(
          joined
        )
      ) {
        return true;
      }

      if (
        /\b(?:interpret|explain)\s+(?:the\s+)?structure\s+of\s+(?:each\s+)?(?:expression|equation|formula|function|lagrangian)\b/.test(
          joined
        )
      ) {
        return true;
      }

      return false;
    }

    function looksLikeConceptualTeachingWithoutSourceInspection(joined) {
      var hasSourceProductionDemand =
        /\b(support(?:ing|ed)?(?:\s+\w+){0,6}\s+with\s+(?:relevant |textual |supporting )?evidence|with supporting evidence|supporting evidence|cite (?:specific |exact |relevant )?(?:evidence|lines?|quotations?|data|observations?|features?)|quotations?\s+from|quotation details?|examples? from (?:the |[a-z]+(?:'s)? )?(?:poems?|texts?|sources?|attachments?|data|dataset|cases?)|evidence from (?:the |[a-z]+(?:'s)? )?(?:poems?|texts?|sources?|attachments?|owen)|inspect (?:the )?(?:supplied|provided|attached)|close[- ]read|exact (?:wording|lines?|quotation)|from the (?:attached|supplied|provided) (?:poem|text|source|extract|data|table|scenario)|using (?:the )?(?:provided|supplied|attached) examples?)\b/.test(
          joined
        );
      if (hasSourceProductionDemand) return false;
      if (
        /\b(analy[sz]e|interpret|compar(?:e|ison)|evaluat(?:e|ion|ive))\b/.test(joined) &&
        /\b(imagery|tone|structure|formal features?|textual features?|quotations?|excerpts?|(?:provided|supplied|attached) examples?)\b/.test(
          joined
        )
      ) {
        return false;
      }
      var conceptualTeach =
        /\b(explain|describe|overview|introduce|study an explanatory|explanatory (?:guide|overview|text|material)|teaching (?:overview|guide|text|material)|how (?:poetic )?form(?: and perspective)? (?:typically )?works?|using (?:brief )?illustrative examples?|classification example|worked example)\b/.test(
          joined
        );
      var abstractCompareClassify =
        /\b(compare|classify|classification|distinguish)\b/.test(joined) &&
        /\b(concepts?|classes|genome|categories|types)\b/.test(joined) &&
        !/\b(formal features?|textual features?|observations?|results?|data|cases?|scenarios?|extracts?|excerpts?|quotations?|quotation details?|attached|supplied evidence|from the poems?|from owen|imagery|tone|(?:provided|supplied|attached) examples?)\b/.test(
          joined
        );
      return conceptualTeach || abstractCompareClassify;
    }

    function taskLooksEvidenceDependent(activity) {
      var joined = collectHardEvidenceObligationText(activity);
      if (!joined) return false;
      if (
        /\banaly[sz]e the (?:supplied|provided|attached) (?:dataset|evidence|results?|data|source|extract|observations?|scenarios?)\b/.test(
          joined
        ) ||
        /\banaly[sz]e the (?:supplied|provided)\b/.test(joined) ||
        /\banaly[sz]e the evidence(?:\s+from|\s+in|\s+using)\b/.test(joined) ||
        /\binspect the (?:supplied|provided) (?:evidence|results?|data|source|extract|observations?)\b/.test(
          joined
        ) ||
        /\buse (?:the )?(?:attached|supplied|provided) case evidence\b/.test(joined) ||
        /\buse evidence from the\b/.test(joined) ||
        /\bsupported by evidence from the (?:supplied|provided)\b/.test(joined) ||
        /\bcompare the (?:two )?(?:provided|supplied|attached) source extracts?\b/.test(joined) ||
        /\bcompare the (?:supplied|provided) (?:observations?|results?|sources?|evidence)\b/.test(
          joined
        ) ||
        /\binterpret the results shown in the (?:supplied|provided|attached) table\b/.test(joined) ||
        /\b(?:quote|interpret) the (?:supplied|provided) extract\b/.test(joined)
      ) {
        return true;
      }
      if (looksLikeInstructionalScaffoldNotSourceEvidence(joined)) {
        return false;
      }
      if (looksLikeProceduralTaskMaterialPractice(joined)) {
        return false;
      }
      if (
        /\b(support(?:ing|ed)?(?:\s+\w+){0,6}\s+with\s+(?:relevant |textual |supporting )?evidence|with supporting evidence|supporting evidence|cite (?:specific |exact |relevant )?(?:evidence|lines?|quotations?|data|observations?|features?)|quotations?\s+from|quotation details?|evidence[- ]supported|textual evidence)\b/.test(
          joined
        )
      ) {
        return true;
      }
      if (
        /\b((?:examples?|evidence|observations?|quotations?|quotation details?|data|values?) from (?:the |[a-z]+(?:['’]s)? )?(?:poems?|texts?|sources?|attachments?|dataset|data|cases?|images?|policy|transcript)|(?:examples?|evidence|observations?|quotations?) from [a-z]+(?:['’]s)? (?:poems?|texts?|sources?|work)|identify examples? from|classify (?:the )?(?:quotation|textual|source|poem|evidence)|classification of (?:quotation|textual|source|poem|evidence)|supported by (?:the )?(?:text|dataset|case|image|source|poem|attachment|supplied material))\b/.test(
          joined
        )
      ) {
        return !looksLikeConceptualTeachingWithoutSourceInspection(joined);
      }
      var productionOverSource =
        /\b(interpret(?:ation|ations)?|analy[sz]e|compar(?:e|ison)|evaluat(?:e|ion|ive)|inspect|close[- ]read|justify|identify|classify|classification)\b/.test(
          joined
        ) &&
        (/\b(formal features?|textual features?|form and (?:structure|perspective)|poetic form|language features?|imagery|tone|lineation|stanza|metre|meter|observations?|observed |results?|data|cases?|scenarios?|extracts?|excerpts?|quotations?|quotation details?|source (?:material|text|properties)|dataset|attached (?:poem|text|source|material)|residual|sequence[- ]change|from the poems?|owen(?:['’]s)? poems?|(?:provided|supplied|attached) examples?)\b/.test(
          joined
        ) ||
          looksLikeLiteraryOrSourceStructureWording(joined));
      if (productionOverSource) {
        return !looksLikeConceptualTeachingWithoutSourceInspection(joined);
      }
      return false;
    }

    function buildEvidenceDecisionForActivity(activity, requiredMaterials) {
      var providers = listEvidenceProviderMaterialIds(requiredMaterials);
      var required = providers.length > 0;
      return {
        required: required,
        reason: required
          ? "Learner must inspect observable particulars before reaching a conclusion."
          : "Task can be completed from teaching/practice scaffolds without separate inspectable evidence.",
        provider_material_ids: required ? providers : []
      };
    }

    function validateEvidenceDecisionShape(value, path, errors) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        errors.push(path + " must be an object");
        return;
      }
      if (typeof value.required !== "boolean") {
        errors.push(path + ".required must be a boolean");
      }
      if (!hasNonEmptyString(value.reason)) {
        errors.push(path + ".reason required");
      }
      if (!Array.isArray(value.provider_material_ids)) {
        errors.push(path + ".provider_material_ids must be an array");
        return;
      }
      value.provider_material_ids.forEach(function (id, index) {
        if (!hasNonEmptyString(id)) {
          errors.push(path + ".provider_material_ids[" + index + "] must be a non-empty string");
        }
      });
    }

    function validateTaskMaterialDecisionClosure(activity, index, errors) {
      var path = "activities[" + index + "].task_material_decision";
      var requiredMaterials = activity && activity.required_materials;
      if (!Array.isArray(requiredMaterials)) {
        errors.push("activities[" + index + "].required_materials must be an array");
        requiredMaterials = [];
      }
      var decision = activity && activity.task_material_decision;
      if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
        errors.push(path + " required");
        return;
      }
      if (typeof decision.separate_inputs_required !== "boolean") {
        errors.push(path + ".separate_inputs_required must be a boolean");
      }
      if (!Array.isArray(decision.task_input_material_ids)) {
        errors.push(path + ".task_input_material_ids must be an array");
        return;
      }
      var ids = [];
      var seen = {};
      decision.task_input_material_ids.forEach(function (rawId, idIndex) {
        if (!hasNonEmptyString(rawId)) {
          errors.push(path + ".task_input_material_ids[" + idIndex + "] must be a non-empty string");
          return;
        }
        var id = String(rawId).trim();
        if (seen[id]) {
          errors.push(path + ".task_input_material_ids must not contain duplicate id " + id);
          return;
        }
        seen[id] = true;
        ids.push(id);
        var exists = requiredMaterials.some(function (row) {
          return nonEmptyString(row && row.material_id, "") === id;
        });
        if (!exists) {
          errors.push(path + " references unknown task-input material_id " + id);
        }
      });
      if (typeof decision.separate_inputs_required !== "boolean") return;
      if (decision.separate_inputs_required) {
        if (!ids.length) {
          errors.push(
            path + ".task_input_material_ids must list at least one id when separate_inputs_required=true"
          );
        }
      } else if (ids.length) {
        errors.push(path + ".task_input_material_ids must be empty when separate_inputs_required=false");
      }
    }

    function validateOrdinaryMaterialCommission(row, pathPrefix, errors) {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        errors.push(pathPrefix + " must be an object");
        return;
      }
      if (!hasNonEmptyString(row.purpose)) {
        errors.push(pathPrefix + ".purpose required");
      }
      if (!hasNonEmptyString(row.specification)) {
        errors.push(pathPrefix + ".specification required");
        return;
      }
      var specToken = normalizeSpecificationTypeEchoToken(row.specification);
      var typeToken = normalizeSpecificationTypeEchoToken(row.material_type || row.type);
      if (specToken && typeToken && specToken === typeToken) {
        errors.push(pathPrefix + ".specification must not be only the material_type token");
      }
    }

    function validateActivityMaterialContracts(activity, index, errors) {
      validateTaskMaterialDecisionClosure(activity, index, errors);
      if (Array.isArray(activity && activity.required_materials)) {
        activity.required_materials.forEach(function (required, reqIndex) {
          var rowPath = "activities[" + index + "].required_materials[" + reqIndex + "]";
          validateOrdinaryMaterialCommission(required, rowPath, errors);
          if (
            required &&
            typeof required === "object" &&
            !Array.isArray(required) &&
            Object.prototype.hasOwnProperty.call(required, "evidence_requirement")
          ) {
            validateEvidenceRequirementShape(
              required.evidence_requirement,
              rowPath + ".evidence_requirement",
              errors
            );
          }
        });
      }
      validateEvidenceDecisionClosure(activity, index, errors);
    }

    function validateEvidenceDecisionClosure(activity, index, errors) {
      var requiredMaterials = Array.isArray(activity && activity.required_materials)
        ? activity.required_materials
        : [];
      var decision = activity && activity.evidence_decision;
      var providerIdsFromRows = listEvidenceProviderMaterialIds(requiredMaterials);
      var decisionPath = "activities[" + index + "].evidence_decision";
      var taskInputSet = {};
      var taskDecision = activity && activity.task_material_decision;
      if (taskDecision && Array.isArray(taskDecision.task_input_material_ids)) {
        taskDecision.task_input_material_ids.forEach(function (rawId) {
          var id = nonEmptyString(rawId, "");
          if (!id) return;
          taskInputSet[id] = true;
        });
      }

      if (!decision) {
        errors.push(decisionPath + " required");
        return;
      }

      validateEvidenceDecisionShape(decision, decisionPath, errors);
      if (typeof decision.required !== "boolean") return;

      var declaredProviders = Array.isArray(decision.provider_material_ids)
        ? decision.provider_material_ids.map(function (id) {
            return nonEmptyString(id, "");
          }).filter(Boolean)
        : [];
      var declaredProviderSet = {};
      declaredProviders.forEach(function (id) {
        declaredProviderSet[id] = true;
      });

      if (decision.required) {
        if (!declaredProviders.length) {
          errors.push(decisionPath + ".provider_material_ids must list at least one provider when required=true");
        }
        declaredProviders.forEach(function (providerId) {
          var providerRow = requiredMaterials.find(function (row) {
            return nonEmptyString(row && row.material_id, "") === providerId;
          });
          if (!providerRow) {
            errors.push(decisionPath + " references missing provider material_id " + providerId);
            return;
          }
          if (!providerRow.evidence_requirement) {
            errors.push(
              decisionPath +
                " provider material_id " +
                providerId +
                " must include evidence_requirement"
            );
          }
          if (!taskInputSet[providerId]) {
            errors.push(
              decisionPath +
                " provider material_id " +
                providerId +
                " must be listed in activities[" +
                index +
                "].task_material_decision.task_input_material_ids"
            );
          }
        });
      } else {
        if (declaredProviders.length) {
          errors.push(decisionPath + ".provider_material_ids must be empty when required=false");
        }
        if (providerIdsFromRows.length) {
          errors.push(decisionPath + " cannot set required=false while evidence_requirement rows exist");
        }
      }

      requiredMaterials.forEach(function (row, reqIndex) {
        if (!materialHasEvidenceRequirement(row)) return;
        var materialId = nonEmptyString(row.material_id, "");
        var pathPrefix =
          "activities[" + index + "].required_materials[" + reqIndex + "]";
        var evidenceRequirement = row.evidence_requirement;
        var layout = nonEmptyString(evidenceRequirement && evidenceRequirement.evidence_layout, "separate_provider");
        var materialType = nonEmptyString(row.material_type || row.type, "");

        if (materialLooksTeachingOnly(row)) {
          errors.push(
            pathPrefix +
              " teaching/explanatory material cannot carry evidence_requirement unless it also supplies clearly distinguished inspectable evidence (provider-role closure)"
          );
        }

        if (materialId && !declaredProviderSet[materialId]) {
          errors.push(
            pathPrefix +
              " carries evidence_requirement but is not listed in " +
              decisionPath +
              ".provider_material_ids (provider/scaffold closure)"
          );
        }

        if (layout === "combined_evidence_workspace") {
          if (materialId && !declaredProviderSet[materialId]) {
            errors.push(
              pathPrefix +
                " combined_evidence_workspace must be listed in " +
                decisionPath +
                ".provider_material_ids"
            );
          }
        } else if (isResponseScaffoldType(materialType) && (!materialId || !declaredProviderSet[materialId])) {
          errors.push(
            pathPrefix +
              " response scaffold must not carry evidence_requirement; attach evidence_requirement only to evidence-provider material(s) named in provider_material_ids, or use combined_evidence_workspace on a provider-listed table (provider/scaffold closure)"
          );
        }
      });

      if (decision.required) {
        var declaredProviderRows = declaredProviders
          .map(function (providerId) {
            return requiredMaterials.find(function (row) {
              return nonEmptyString(row && row.material_id, "") === providerId;
            });
          })
          .filter(Boolean);
        if (
          declaredProviderRows.length &&
          declaredProviderRows.every(function (row) {
            return materialLooksTeachingOnly(row);
          })
        ) {
          errors.push(
            decisionPath +
              " lists only teaching/explanatory provider(s); separate_provider evidence must supply inspectable observation/data/source/case material distinct from teaching text (provider-role closure)"
          );
        }
        providerIdsFromRows.forEach(function (rowId) {
          if (!declaredProviderSet[rowId]) {
            errors.push(
              decisionPath +
                ".provider_material_ids must include every evidence-bearing material_id (missing " +
                rowId +
                "; provider/scaffold closure)"
            );
          }
        });
      }
    }

    function buildEvidenceProviderRowFromScaffold(scaffoldRow, activityId, index) {
      return {
        material_id: activityId + "-ME" + (index + 1),
        material_type: "scenario",
        type: "scenario",
        purpose:
          "Provide observable evidence cases that the learner must inspect before completing the response scaffold.",
        specification:
          "Include at least two contrastive evidence cases with concrete observations and outcomes; do not include the final judgement.",
        instructional_function: nonEmptyString(scaffoldRow && scaffoldRow.instructional_function, ""),
        plan_beat_index:
          typeof scaffoldRow.plan_beat_index === "number" ? scaffoldRow.plan_beat_index : undefined
      };
    }

    function applyEvidenceProviderSelection(requiredMaterials, activityId) {
      var hasSeparateProviderCandidate = activityHasSeparateEvidenceProviderCandidate(requiredMaterials);
      var selected = [];
      var attachedProvider = false;

      requiredMaterials.forEach(function (row, index) {
        if (!row || typeof row !== "object") {
          selected.push(row);
          return;
        }
        var evidenceRequirement = buildEvidenceRequirementForRow(row);
        if (!evidenceRequirement) {
          selected.push(row);
          return;
        }
        var type = nonEmptyString(row.material_type || row.type, "");
        if (isProviderType(type)) {
          row.evidence_requirement = evidenceRequirement;
          selected.push(row);
          attachedProvider = true;
          return;
        }

        if (isResponseScaffoldType(type)) {
          var alreadyHasSeparateProvider =
            attachedProvider ||
            hasSeparateProviderCandidate ||
            selected.some(materialHasEvidenceRequirement);

          if (alreadyHasSeparateProvider) {
            // Prefer separate provider + ordinary response scaffold.
            selected.push(row);
            return;
          }

          if (tokenizeMaterialType(type) === "analysis_table") {
            row.evidence_requirement = buildEvidenceRequirementForRow(row, {
              fixed_observation_fields: [
                "Condition or case",
                "Observed measurement or signal",
                "Reported change vs comparison"
              ],
              learner_response_fields: ["Interpretation", "Consequence or judgement"]
            });
            row.specification =
              nonEmptyString(row.specification, row.purpose || "") +
              " Use fixed observation columns for evidence and keep interpretation/consequence columns blank for learner completion.";
            selected.push(row);
            attachedProvider = true;
            return;
          }

          var providerRow = buildEvidenceProviderRowFromScaffold(row, activityId, index);
          providerRow.evidence_requirement = buildEvidenceRequirementForRow(providerRow);
          selected.push(providerRow);
          selected.push(row);
          attachedProvider = true;
          return;
        }

        row.evidence_requirement = evidenceRequirement;
        selected.push(row);
        attachedProvider = true;
      });
      return selected;
    }

    function buildRequiredMaterialsFromPlan(activityId, episodePlan) {
      var contract = getPopulationContract();
      if (contract && typeof contract.buildObligationScaffoldFromPlan === "function") {
        var scaffold = contract.buildObligationScaffoldFromPlan(episodePlan, {
          activity_id: activityId
        });
        var seq = 0;
        return (scaffold.obligations || []).map(function (row) {
          seq += 1;
          var fn = nonEmptyString(row.instructional_function, "");
          return {
            material_id: activityId + "-M" + seq,
            material_type: resolveMaterialTypeForFunction(fn),
            type: resolveMaterialTypeForFunction(fn),
            purpose: materialPurposeForBeat(fn, activityId),
            specification: nonEmptyString(row.specification, materialPurposeForBeat(fn, activityId)),
            instructional_function: fn,
            plan_beat_index:
              typeof row.plan_beat_index === "number" ? row.plan_beat_index : undefined
          };
        });
      }
      var beats = (episodePlan && episodePlan.beats) || [];
      return beats.map(function (beat, index) {
        var fn = nonEmptyString(beat && beat.function, "explanation");
        return {
          material_id: activityId + "-M" + (index + 1),
          material_type: resolveMaterialTypeForFunction(fn),
          type: resolveMaterialTypeForFunction(fn),
          purpose: materialPurposeForBeat(fn, activityId),
          specification: materialPurposeForBeat(fn, activityId),
          instructional_function: fn,
          plan_beat_index: index
        };
      });
    }

    function buildLearnerTask(activity, loStatement, scaffolded) {
      var fromActivity = cleanPopulationText(activity && activity.learner_task);
      if (fromActivity && !isShellPlaceholder(fromActivity)) {
        return fromActivity;
      }
      var fromScaffold = cleanPopulationText(scaffolded && scaffolded.learner_task);
      if (fromScaffold && !isShellPlaceholder(fromScaffold)) {
        return fromScaffold;
      }
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      var beats = (activity.episode_plan && activity.episode_plan.beats) || [];
      var beatNames = beats
        .map(function (b) {
          return String((b && b.function) || "").replace(/_/g, " ");
        })
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");
      return (
        "Complete this " +
        archetype +
        " activity to " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        (beatNames ? " by working through: " + beatNames + "." : ".")
      );
    }

    function buildExpectedOutput(loStatement, archetype, activity) {
      var fromActivity =
        activity && cleanPopulationText(activity.expected_output);
      if (fromActivity && !isShellPlaceholder(fromActivity)) {
        return fromActivity;
      }
      return (
        "Submit evidence that demonstrates " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        " with reasoning that references the teaching materials and meets the " +
        archetype +
        " quality threshold."
      );
    }

    function buildActivityPreamble(activity, loStatement, scaffolded) {
      var fromActivity = cleanPopulationText(activity && activity.activity_preamble);
      if (fromActivity && !isShellPlaceholder(fromActivity)) {
        return fromActivity;
      }
      var fromScaffold = cleanPopulationText(scaffolded && scaffolded.activity_preamble);
      if (fromScaffold && !isShellPlaceholder(fromScaffold)) {
        return fromScaffold;
      }
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      return (
        "This activity helps you " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        " using a " +
        archetype +
        " learning pathway."
      );
    }

    function buildCognitionFields(activity, loStatement, scaffolded, options) {
      var opts = options && typeof options === "object" ? options : {};
      var activityIndex = Number.isFinite(opts.activityIndex) ? Number(opts.activityIndex) : -1;
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      var out = {};
      DLA_OWNED_COGNITION_FIELDS.forEach(function (field) {
        if (scaffolded && hasNonEmptyString(scaffolded[field]) && !isShellPlaceholder(scaffolded[field])) {
          out[field] = cleanPopulationText(scaffolded[field]);
        }
      });
      if (!out.study_orientation) {
        out.study_orientation =
          "Work through each beat in order, pausing to explain your reasoning before moving to independent practice.";
      }
      if (!out.intellectual_frame) {
        out.intellectual_frame =
          "Frame your work around " + loStatement + " and how the evidence supports your conclusions.";
      }
      if (!out.reasoning_orientation) {
        out.reasoning_orientation =
          "Use " +
          archetype +
          "-level reasoning: state what you know, how the materials support it, and what remains uncertain.";
      }
      if (!out.self_explanation_prompt) {
        out.self_explanation_prompt =
          "Before submitting, explain in your own words how your response demonstrates " +
          loStatement.charAt(0).toLowerCase() +
          loStatement.slice(1) +
          ".";
      }
      if (!out.prior_knowledge_activation) {
        out.prior_knowledge_activation =
          "Recall what you already know about this topic and note one assumption you are testing in this activity.";
      }
      if (!out.evidence_use_prompt) {
        out.evidence_use_prompt =
          "Cite specific details from the required materials when justifying each step of your response.";
      }
      if (!out.argument_structure_hint) {
        out.argument_structure_hint =
          "Structure your response as claim → evidence → reasoning → limitation.";
      }
      if (!out.scaffold_hint_sequence) {
        out.scaffold_hint_sequence = [
          "Orient to the activity goal",
          "Study the teaching materials",
          "Attempt guided practice",
          "Complete independent performance",
          "Verify against the checklist"
        ];
      }
      if (!out.support_note) {
        out.support_note =
          "If stuck, revisit the worked example and compare your reasoning to the model before revising.";
      }
      if (archetype === "apply" && !out.transfer_or_application_task) {
        out.transfer_or_application_task =
          "Apply the procedure from the worked example to a new case with different inputs.";
      }
      if (archetype === "analyse" && !out.conceptual_contrast_prompt) {
        out.conceptual_contrast_prompt =
          "Contrast two plausible interpretations and explain which evidence supports each.";
      }
      if (archetype === "evaluate" && !out.uncertainty_tension_prompt) {
        out.uncertainty_tension_prompt =
          "Identify the main trade-off in your judgement and what would change your conclusion.";
      }
      if (!out.disciplinary_lens) {
        out.disciplinary_lens = "Use discipline-appropriate vocabulary when describing mechanisms and evidence.";
      }
      // Leave missing bridges empty for guided-scaffold repair; do not invent generic LO bridges here.
      return out;
    }

    function stripInternalActivityFields(activity) {
      var out = Object.assign({}, activity || {});
      INTERNAL_ACTIVITY_KEYS.forEach(function (key) {
        delete out[key];
      });
      Object.keys(out).forEach(function (key) {
        if (key.indexOf("_plan_") === 0) delete out[key];
      });
      return out;
    }

    function capitalizeWord(value) {
      var text = nonEmptyString(value, "");
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function candidateTitlePassesSingleChecks(title, loStatement, activity) {
      var titleApi = getActivityTitleContract();
      var trimmed = nonEmptyString(title, "");
      if (!trimmed) return false;
      if (trimmed.length > ((titleApi && titleApi.TITLE_HARD_MAX_CHARS) || 60)) return false;
      if (titleApi) {
        if (typeof titleApi.isGenericActivityPlaceholder === "function" && titleApi.isGenericActivityPlaceholder(trimmed)) {
          return false;
        }
        if (
          typeof titleApi.hasArtificialTerminalEllipsis === "function" &&
          titleApi.hasArtificialTerminalEllipsis(trimmed)
        ) {
          return false;
        }
        if (
          typeof titleApi.titleContainsOwnActivityIdToken === "function" &&
          titleApi.titleContainsOwnActivityIdToken(trimmed, activity && activity.activity_id)
        ) {
          return false;
        }
      }
      var statement = nonEmptyString(loStatement, "");
      if (!statement) return true;
      var normTitle = trimmed.toLowerCase().replace(/\s+/g, " ").trim();
      var normStatement = statement.toLowerCase().replace(/\s+/g, " ").trim();
      if (normTitle === normStatement) return false;
      var withoutEllipsis = trimmed.replace(/(\.\.\.|…)\s*$/, "").trim();
      var normPrefix = withoutEllipsis.toLowerCase().replace(/\s+/g, " ").trim();
      if (
        normPrefix.length >= 12 &&
        normStatement.indexOf(normPrefix) === 0 &&
        normStatement.length > normPrefix.length
      ) {
        return false;
      }
      return true;
    }

    function buildDeterministicFinalActivityTitle(activity, loStatement, options) {
      var opts = options && typeof options === "object" ? options : {};
      var candidate = nonEmptyString(activity && activity.title, "");
      if (candidateTitlePassesSingleChecks(candidate, loStatement, activity)) {
        return candidate;
      }
      var archetype = nonEmptyString(
        activity && activity.episode_plan && activity.episode_plan.archetype,
        "learn"
      );
      var ordinals = [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth"
      ];
      var idx = Number.isFinite(Number(opts.activityIndex)) ? Number(opts.activityIndex) : 0;
      var ordinal = ordinals[idx] || "focus";
      var generated = capitalizeWord(archetype) + " " + ordinal + " pathway";
      return generated.length > 60 ? generated.slice(0, 60) : generated;
    }

    function resolveLearningOutcomesForTitleValidation(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      if (opts.learningOutcomes) return opts.learningOutcomes;
      if (page && page.learning_outcomes) return page.learning_outcomes;
      if (opts.baseline && opts.baseline.learning_outcomes) {
        return opts.baseline.learning_outcomes;
      }
      return null;
    }

    function activitiesForTitleValidation(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      var activities = Array.isArray(page && page.activities) ? page.activities : [];
      var baseline = opts.baseline;
      if (!baseline || !Array.isArray(baseline.activities)) return activities;
      var baseIndex = {};
      baseline.activities.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var id = nonEmptyString(row.activity_id, "");
        if (id) baseIndex[id] = row;
      });
      return activities.map(function (activity) {
        if (!activity || typeof activity !== "object") return activity;
        var id = nonEmptyString(activity.activity_id, "");
        var base = id ? baseIndex[id] : null;
        if (!base) return activity;
        var hasIds =
          (Array.isArray(activity.learning_outcome_ids) && activity.learning_outcome_ids.length) ||
          (Array.isArray(activity.mapped_learning_outcome_ids) &&
            activity.mapped_learning_outcome_ids.length) ||
          (Array.isArray(activity.mapped_learning_outcomes) &&
            activity.mapped_learning_outcomes.length);
        if (hasIds) return activity;
        var out = Object.assign({}, activity);
        if (Array.isArray(base.learning_outcome_ids) && base.learning_outcome_ids.length) {
          out.learning_outcome_ids = base.learning_outcome_ids.slice();
        } else if (
          Array.isArray(base.mapped_learning_outcome_ids) &&
          base.mapped_learning_outcome_ids.length
        ) {
          out.learning_outcome_ids = base.mapped_learning_outcome_ids.slice();
        }
        return out;
      });
    }

    function appendActivityTitleValidationErrors(page, errors, options) {
      var titleApi = getActivityTitleContract();
      if (!titleApi || typeof titleApi.validateActivityTitles !== "function") return;
      var result = titleApi.validateActivityTitles(
        activitiesForTitleValidation(page, options),
        resolveLearningOutcomesForTitleValidation(page, options)
      );
      if (!result || !Array.isArray(result.errors) || !result.errors.length) return;
      result.errors.forEach(function (err) {
        errors.push(err);
      });
    }

    function enrichActivityWithDla(activity, loStatement, options) {
      if (!activity || typeof activity !== "object") {
        throw new Error("enrichActivityWithDla: activity required");
      }
      var episodePlan = activity.episode_plan;
      if (!episodePlan || typeof episodePlan !== "object") {
        throw new Error(
          "enrichActivityWithDla: activities[" +
            nonEmptyString(activity.activity_id, "?") +
            "].episode_plan required"
        );
      }
      var activityId = nonEmptyString(activity.activity_id, "A1");
      var scaffolded = null;
      var contract = getPopulationContract();
      if (contract && typeof contract.applyPopulationScaffoldToActivity === "function") {
        scaffolded = contract.applyPopulationScaffoldToActivity(
          { activity_id: activityId },
          episodePlan
        );
      }
      var requiredMaterials = buildRequiredMaterialsFromPlan(activityId, episodePlan);
      requiredMaterials = applyEvidenceProviderSelection(requiredMaterials, activityId);
      requiredMaterials.forEach(function (row, index) {
        if (!hasNonEmptyString(row.purpose)) {
          row.purpose = materialPurposeForBeat(row.instructional_function, loStatement);
        }
        if (!hasNonEmptyString(row.specification)) {
          row.specification = materialPurposeForBeat(row.instructional_function, loStatement);
        }
        if (!row.material_id) row.material_id = activityId + "-M" + (index + 1);
      });
      var cognition = buildCognitionFields(activity, loStatement, scaffolded || {}, options || {});
      var enriched = stripInternalActivityFields(activity);
      enriched.learner_task = buildLearnerTask(activity, loStatement, scaffolded || {});
      enriched.expected_output = buildExpectedOutput(
        loStatement,
        nonEmptyString(episodePlan.archetype, "understand"),
        activity
      );
      enriched.activity_preamble = buildActivityPreamble(activity, loStatement, scaffolded || {});
      enriched.required_materials = requiredMaterials;
      enriched.evidence_decision = buildEvidenceDecisionForActivity(enriched, requiredMaterials);
      var providerIds = listEvidenceProviderMaterialIds(requiredMaterials);
      enriched.task_material_decision = {
        separate_inputs_required: providerIds.length > 0,
        task_input_material_ids: providerIds.length ? providerIds.slice() : []
      };
      enriched.materials = [];
      Object.keys(cognition).forEach(function (key) {
        enriched[key] = cognition[key];
      });
      if (!Array.isArray(enriched.learning_outcome_ids) && Array.isArray(activity.learning_outcome_ids)) {
        enriched.learning_outcome_ids = activity.learning_outcome_ids.slice();
      }
      enriched.title = buildDeterministicFinalActivityTitle(activity, loStatement, options || {});
      enriched.episode_plan = deepClone(episodePlan);
      return enriched;
    }

    function appendDlaSourceArtefact(sourceArtefacts) {
      var rows = Array.isArray(sourceArtefacts) ? sourceArtefacts.slice() : [];
      var hasDla = rows.some(function (row) {
        return row && row.artefact_type === "design_learning_activities";
      });
      if (!hasDla) {
        rows.push({
          artefact_type: "design_learning_activities",
          source_label: "Design Learning Activities",
          role: "pedagogy"
        });
      }
      return rows;
    }

    function buildDlaValidationReport(activityCount) {
      return {
        activity_coverage: activityCount > 0 ? "dla_enriched" : "none",
        material_coverage: "pending_gam",
        episode_plan_attachment: "attached",
        self_containment: "dla_enriched",
        schema_compliance: "dla_boundary",
        known_issues: activityCount > 0 ? [] : ["No activities after DLA enrichment"]
      };
    }

    function enrichPageWithDla(pageShell, options) {
      if (!pageShell || typeof pageShell !== "object" || Array.isArray(pageShell)) {
        throw new Error("enrichPageWithDla: page shell required");
      }
      if (String(pageShell.artifact_type || "") !== "page") {
        throw new Error('enrichPageWithDla: artifact_type must be "page"');
      }
      if (!Array.isArray(pageShell.activities) || !pageShell.activities.length) {
        throw new Error("enrichPageWithDla: activities[] required");
      }
      var out = deepClone(pageShell);
      var loIndex = learningOutcomesIndex(out);
      out.activities = out.activities.map(function (activity, index) {
        var loStatement = resolveLoStatementForActivity(activity, loIndex);
        return enrichActivityWithDla(
          activity,
          loStatement,
          Object.assign({}, options || {}, { activityIndex: index })
        );
      });
      out.page_synthesis = {};
      out.assembly_state = Object.assign({}, out.assembly_state || {}, {
        current_stage: "dla",
        enriched_by: ["episode_plan", "dla"]
      });
      out.source_artefacts = appendDlaSourceArtefact(out.source_artefacts);
      out.generation_notes = Object.assign({}, out.generation_notes || {}, {
        validation: Object.assign(buildDlaValidationReport(out.activities.length), {
          quality_diagnostics: collectDlaEvidenceQualityDiagnostics(out)
        }),
        notes:
          "Sprint 56F DLA page enrichment (" +
          ENRICH_VERSION +
          ") — materials pending GAM; page_synthesis pending finalise_page"
      });
      return out;
    }

    function extractLearningActivitiesRows(capture) {
      if (!capture || typeof capture !== "object") return [];
      if (Array.isArray(capture.activities)) return capture.activities;
      if (capture.learning_activities && Array.isArray(capture.learning_activities.activities)) {
        return capture.learning_activities.activities;
      }
      if (capture.learning_activities && Array.isArray(capture.learning_activities.content)) {
        return capture.learning_activities.content;
      }
      if (Array.isArray(capture.content)) return capture.content;
      return [];
    }

    function mergeDlaRowsIntoPageShell(shellBaseline, dlaRows) {
      if (!shellBaseline || !Array.isArray(dlaRows) || !dlaRows.length) return null;
      var baseline = deepClone(shellBaseline);
      var rowMap = {};
      dlaRows.forEach(function (row) {
        if (row && row.activity_id) rowMap[String(row.activity_id)] = row;
      });
      baseline.activities = baseline.activities.map(function (activity) {
        var incoming = rowMap[String(activity.activity_id || "")];
        if (!incoming) return activity;
        var merged = Object.assign({}, activity, incoming);
        merged.episode_plan = deepClone(activity.episode_plan || incoming.episode_plan);
        merged.activity_id = activity.activity_id;
        merged.materials = [];
        return merged;
      });
      return enrichPageWithDla(baseline);
    }

    function normalizeDlaCaptureToPage(shellBaseline, capture) {
      if (!capture || typeof capture !== "object") return null;
      if (
        String(capture.artifact_type || "") === "page" &&
        String(capture.schema_version || "") === SCHEMA_VERSION
      ) {
        var page = deepClone(capture);
        if (!page.assembly_state) {
          page.assembly_state = { enriched_by: ["episode_plan", "dla"], current_stage: "dla" };
        }
        return page;
      }
      if (!shellBaseline) return null;
      var rows = extractLearningActivitiesRows(capture);
      if (!rows.length) return null;
      return mergeDlaRowsIntoPageShell(shellBaseline, rows);
    }

    function pageSynthesisHasContent(pageSynthesis) {
      if (!pageSynthesis || typeof pageSynthesis !== "object") return false;
      return ["overview", "learning_purpose", "knowledge_summary", "study_tips", "support_notes"].some(
        function (key) {
          var slot = pageSynthesis[key];
          if (!slot) return false;
          if (typeof slot === "string") return hasNonEmptyString(slot);
          if (typeof slot === "object" && hasNonEmptyString(slot.body)) return true;
          if (key === "knowledge_summary" && slot && Array.isArray(slot.concepts) && slot.concepts.length) {
            return true;
          }
          return false;
        }
      );
    }

    function activityIdsInOrder(page) {
      return (page.activities || []).map(function (row) {
        return String(row.activity_id || "");
      });
    }

    function validateDlaEnrichedPage(page, baseline) {
      var errors = [];
      if (!page || typeof page !== "object" || Array.isArray(page)) {
        return { ok: false, errors: ["page must be an object"] };
      }
      if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
      if (page.schema_version !== SCHEMA_VERSION) {
        errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
      }
      [
        "title",
        "audience",
        "page_profile",
        "assembly_state",
        "page_synthesis",
        "activities",
        "learning_outcomes",
        "source_artefacts",
        "generation_notes"
      ].forEach(function (key) {
        if (!(key in page)) errors.push("missing required top-level key: " + key);
      });
      if (!Array.isArray(page.activities) || !page.activities.length) {
        errors.push("activities[] required");
      }
      if (page.sections != null) errors.push("sections[] must not be written at DLA stage");
      if (page.learning_sequence != null) {
        errors.push("learning_sequence must not be present at DLA stage");
      }
      if (page.assessment_check != null) {
        errors.push("assessment_check must not be present at DLA stage");
      }
      if (pageSynthesisHasContent(page.page_synthesis)) {
        errors.push("page_synthesis must remain empty at DLA stage");
      } else if (!page.page_synthesis || typeof page.page_synthesis !== "object") {
        errors.push("page_synthesis must be an object");
      }
      if (!page.assembly_state || typeof page.assembly_state !== "object") {
        errors.push("assembly_state required");
      } else {
        if (page.assembly_state.current_stage !== "dla") {
          errors.push('assembly_state.current_stage must be "dla"');
        }
        var enrichedBy = Array.isArray(page.assembly_state.enriched_by)
          ? page.assembly_state.enriched_by
          : [];
        if (enrichedBy.indexOf("episode_plan") === -1) {
          errors.push('assembly_state.enriched_by must include "episode_plan"');
        }
        if (enrichedBy.indexOf("dla") === -1) {
          errors.push('assembly_state.enriched_by must include "dla"');
        }
      }
      if (baseline) {
        if (activityIdsInOrder(page).join("|") !== activityIdsInOrder(baseline).join("|")) {
          errors.push("activity_id order must match upstream page shell");
        }
      }
      (page.activities || []).forEach(function (activity, index) {
        if (!activity || typeof activity !== "object") {
          errors.push("activities[" + index + "] must be an object");
          return;
        }
        DLA_REQUIRED_STRING_FIELDS.forEach(function (field) {
          if (!hasNonEmptyString(activity[field]) || isShellPlaceholder(activity[field])) {
            errors.push(
              "activities[" + index + "]." + field + " must be enriched (not placeholder em dash)"
            );
          }
        });
        if (
          hasNonEmptyString(activity.intellectual_coherence_bridge) &&
          !isShellPlaceholder(activity.intellectual_coherence_bridge) &&
          hasNonEmptyString(activity.activity_preamble) &&
          String(activity.intellectual_coherence_bridge).trim() ===
            String(activity.activity_preamble).trim()
        ) {
          errors.push(
            "activities[" +
              index +
              "].intellectual_coherence_bridge must be distinct from activity_preamble"
          );
        }
        var beats =
          activity.episode_plan &&
          Array.isArray(activity.episode_plan.beats) &&
          activity.episode_plan.beats.length
            ? activity.episode_plan.beats
            : [];
        if (beats.length && (!Array.isArray(activity.required_materials) || !activity.required_materials.length)) {
          errors.push(
            "activities[" + index + "].required_materials required when episode_plan has beats"
          );
        }
        validateActivityMaterialContracts(activity, index, errors);
        if (!Array.isArray(activity.materials)) {
          errors.push("activities[" + index + "].materials must be an array");
        } else if (activity.materials.length) {
          activity.materials.forEach(function (material, mIndex) {
            if (material && hasNonEmptyString(material.body)) {
              errors.push(
                "activities[" + index + "].materials[" + mIndex + "].body forbidden at DLA stage"
              );
            }
          });
        }
        if (!activity.episode_plan || typeof activity.episode_plan !== "object") {
          errors.push("activities[" + index + "].episode_plan must be preserved");
        }
      });
      appendArchetypePlanValidationErrors(page, errors);
      appendActivityTitleValidationErrors(page, errors, { baseline: baseline });
      var warnings = collectDlaEvidenceQualityDiagnostics(page);
      return { ok: errors.length === 0, errors: errors, warnings: warnings };
    }

    function baselineActivityIndex(baseline) {
      var map = {};
      (baseline && Array.isArray(baseline.activities) ? baseline.activities : []).forEach(function (row) {
        if (row && row.activity_id) {
          map[String(row.activity_id)] = row;
        }
      });
      return map;
    }

    function mergeActivityWithBaselineForRepair(activity, baselineActivity) {
      if (!baselineActivity) return activity;
      return Object.assign({}, baselineActivity, activity, {
        episode_plan: deepClone(
          (baselineActivity && baselineActivity.episode_plan) ||
            (activity && activity.episode_plan) ||
            null
        ),
        learning_outcome_ids: Array.isArray(activity.learning_outcome_ids)
          ? activity.learning_outcome_ids.slice()
          : Array.isArray(baselineActivity.learning_outcome_ids)
          ? baselineActivity.learning_outcome_ids.slice()
          : undefined
      });
    }

    /**
     * Partial DLA captures must not copy-forward Episode Plan shell placeholders (em dash).
     * When BYO-LLM output includes a DLA-owned field key but leaves the shell placeholder,
     * synthesise the deterministic enrichment fallback so validation and assembly can proceed.
     */
    function repairDlaPartialShellPlaceholderFields(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      if (!page || typeof page !== "object" || Array.isArray(page) || !Array.isArray(page.activities)) {
        return { page: page, repairApplied: false, repairs: [] };
      }
      var out = deepClone(page);
      var baseline = opts.baseline;
      var baseIndex = baselineActivityIndex(baseline);
      var loIndex = learningOutcomesIndex(
        baseline && Array.isArray(baseline.learning_outcomes) ? baseline : out
      );
      var repairs = [];

      out.activities.forEach(function (activity) {
        if (!activity || typeof activity !== "object" || Array.isArray(activity)) return;
        var baselineActivity = baseIndex[String(activity.activity_id || "")] || null;
        var merged = mergeActivityWithBaselineForRepair(activity, baselineActivity);
        var loStatement = resolveLoStatementForActivity(merged, loIndex);
        var archetype = nonEmptyString(
          merged.episode_plan && merged.episode_plan.archetype,
          "understand"
        );

        function repairFieldIfShellPlaceholder(field, buildValue) {
          if (!Object.prototype.hasOwnProperty.call(activity, field)) return;
          if (hasNonEmptyString(activity[field]) && !isShellPlaceholder(activity[field])) return;
          var next = buildValue();
          if (!hasNonEmptyString(next) || isShellPlaceholder(next)) return;
          activity[field] = next;
          repairs.push({
            activity_id: String(activity.activity_id || ""),
            field: field
          });
        }

        repairFieldIfShellPlaceholder("activity_preamble", function () {
          return buildActivityPreamble(merged, loStatement, null);
        });
        repairFieldIfShellPlaceholder("learner_task", function () {
          return buildLearnerTask(merged, loStatement, null);
        });
        repairFieldIfShellPlaceholder("expected_output", function () {
          return buildExpectedOutput(loStatement, archetype, merged);
        });
      });

      return {
        page: out,
        repairApplied: repairs.length > 0,
        repairs: repairs
      };
    }

    function normalizeValidateDlaPartialPageOptions(options) {
      var opts = {};
      if (!options || typeof options !== "object" || Array.isArray(options)) {
        return opts;
      }
      if (
        Object.prototype.hasOwnProperty.call(options, "baseline") ||
        Object.prototype.hasOwnProperty.call(options, "learningOutcomes") ||
        Object.prototype.hasOwnProperty.call(options, "learning_outcomes")
      ) {
        opts = options;
        if (!opts.learningOutcomes && opts.learning_outcomes) {
          opts = Object.assign({}, opts, { learningOutcomes: opts.learning_outcomes });
        }
        return opts;
      }
      if (
        options.artifact_type === "page" ||
        Array.isArray(options.activities) ||
        options.learning_outcomes
      ) {
        return { baseline: options };
      }
      return options;
    }

    function coerceActivitiesArrayForPartialValidation(value) {
      if (Array.isArray(value) && value.length) return value;
      if (typeof value === "string" && hasNonEmptyString(value)) {
        try {
          var parsed = JSON.parse(String(value).trim());
          if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch (_) {}
      }
      return null;
    }

    function hasNonEmptyActivitiesArray(page) {
      return Array.isArray(page && page.activities) && page.activities.length > 0;
    }

    /**
     * Resolve the v2 partial DLA page object that validateDlaPartialPageCapture should inspect.
     * Run paste paths may deliver activities under legacy keys, nested page wrappers, or a
     * stringified JSON array even when the visible capture looks like a canonical partial page.
     */
    function resolveDlaPartialPageCaptureSubject(page, options) {
      var opts = normalizeValidateDlaPartialPageOptions(options);
      var subject = page;
      if (!subject || typeof subject !== "object" || Array.isArray(subject)) {
        return { page: subject, opts: opts };
      }
      if (
        Object.prototype.hasOwnProperty.call(subject, "baseline") &&
        String(subject.artifact_type || "") !== "page" &&
        subject.baseline &&
        typeof subject.baseline === "object" &&
        !Array.isArray(subject.baseline) &&
        String(subject.baseline.artifact_type || "") === "page"
      ) {
        opts = normalizeValidateDlaPartialPageOptions(subject);
        subject = subject.baseline;
      }
      if (
        subject.page &&
        typeof subject.page === "object" &&
        !Array.isArray(subject.page) &&
        String(subject.page.artifact_type || "") === "page" &&
        !hasNonEmptyActivitiesArray(subject) &&
        hasNonEmptyActivitiesArray(subject.page)
      ) {
        subject = Object.assign({}, subject.page, {
          assembly_state: subject.assembly_state || subject.page.assembly_state
        });
      }
      var coercedActivities = coerceActivitiesArrayForPartialValidation(subject.activities);
      if (coercedActivities) {
        subject = Object.assign({}, subject, { activities: coercedActivities });
      }
      if (!hasNonEmptyActivitiesArray(subject)) {
        var extractedRows = extractLearningActivitiesRows(subject);
        if (extractedRows.length) {
          subject = Object.assign({}, subject, { activities: extractedRows });
        }
      }
      if (
        !hasNonEmptyActivitiesArray(subject) &&
        opts.baseline &&
        (String(subject.artifact_type || "") !== "page" ||
          String(subject.schema_version || "") !== SCHEMA_VERSION)
      ) {
        var normalized = normalizeDlaCaptureToPage(opts.baseline, subject);
        if (normalized && hasNonEmptyActivitiesArray(normalized)) {
          subject = normalized;
        }
      }
      return { page: subject, opts: opts };
    }

    function validateDlaPartialPageCapture(page, options) {
      var resolved = resolveDlaPartialPageCaptureSubject(page, options);
      page = resolved.page;
      var opts = resolved.opts;
      var errors = [];
      if (!page || typeof page !== "object" || Array.isArray(page)) {
        return { ok: false, errors: ["page must be an object"] };
      }
      if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
      if (page.schema_version !== SCHEMA_VERSION) {
        errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
      }
      if (!Array.isArray(page.activities) || !page.activities.length) {
        errors.push("partial DLA page must include activities[]");
      }
      if (!page.assembly_state || typeof page.assembly_state !== "object") {
        errors.push("assembly_state required");
      }
      if (page.learning_sequence != null) {
        errors.push("learning_sequence must not be present in DLA partial");
      }
      if (page.assessment_check != null) {
        errors.push("assessment_check must not be present in DLA partial");
      }
      (Array.isArray(page.activities) ? page.activities : []).forEach(function (activity, index) {
        if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
          errors.push("activities[" + index + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(activity.activity_id)) {
          errors.push("activities[" + index + "].activity_id required");
        }
        if (
          Object.prototype.hasOwnProperty.call(activity, "activity_preamble") &&
          (!hasNonEmptyString(activity.activity_preamble) ||
            isShellPlaceholder(activity.activity_preamble))
        ) {
          errors.push(
            "activities[" + index + "].activity_preamble must be enriched when present"
          );
        }
        if (
          Object.prototype.hasOwnProperty.call(activity, "intellectual_coherence_bridge") &&
          (!hasNonEmptyString(activity.intellectual_coherence_bridge) ||
            isShellPlaceholder(activity.intellectual_coherence_bridge))
        ) {
          errors.push(
            "activities[" +
              index +
              "].intellectual_coherence_bridge must be enriched when present"
          );
        }
        if ("materials" in activity && !Array.isArray(activity.materials)) {
          errors.push("activities[" + index + "].materials must be an array when present");
        }
        validateActivityMaterialContracts(activity, index, errors);
        if (Array.isArray(activity.materials)) {
          activity.materials.forEach(function (material, mIndex) {
            if (
              material &&
              typeof material === "object" &&
              !Array.isArray(material) &&
              hasNonEmptyString(material.body)
            ) {
              errors.push(
                "activities[" + index + "].materials[" + mIndex + "].body forbidden at DLA stage"
              );
            }
          });
        }
      });
      appendArchetypePlanValidationErrors(page, errors);
      appendActivityTitleValidationErrors(page, errors, opts);
      return { ok: errors.length === 0, errors: errors };
    }

    function isVNextPageAtDlaStage(page) {
      return (
        page &&
        page.artifact_type === "page" &&
        page.schema_version === SCHEMA_VERSION &&
        page.assembly_state &&
        page.assembly_state.current_stage === "dla"
      );
    }

    return {
      ENRICH_VERSION: ENRICH_VERSION,
      SCHEMA_VERSION: SCHEMA_VERSION,
      SHELL_DLA_PLACEHOLDER: SHELL_DLA_PLACEHOLDER,
      DLA_REQUIRED_STRING_FIELDS: DLA_REQUIRED_STRING_FIELDS.slice(),
      DLA_OWNED_COGNITION_FIELDS: DLA_OWNED_COGNITION_FIELDS.slice(),
      isShellPlaceholder: isShellPlaceholder,
      enrichActivityWithDla: enrichActivityWithDla,
      enrichPageWithDla: enrichPageWithDla,
      normalizeDlaCaptureToPage: normalizeDlaCaptureToPage,
      repairDlaPartialShellPlaceholderFields: repairDlaPartialShellPlaceholderFields,
      resolveDlaPartialPageCaptureSubject: resolveDlaPartialPageCaptureSubject,
      validateDlaEnrichedPage: validateDlaEnrichedPage,
      validateDlaPartialPageCapture: validateDlaPartialPageCapture,
      isVNextPageAtDlaStage: isVNextPageAtDlaStage,
      buildRequiredMaterialsFromPlan: buildRequiredMaterialsFromPlan
    };
  }
);
