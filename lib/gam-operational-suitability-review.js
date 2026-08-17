"use strict";

/**
 * S78-OPS-2 — GAM operational suitability review (Stage-2).
 * Structural verdict-artefact validation only — no semantic solving.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_GAM_OPERATIONAL_SUITABILITY_REVIEW = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var ARTIFACT_TYPE = "gam_operational_suitability_review";
    var SCHEMA_VERSION = "1.0.0";
    var FAILURE_CLASSES = Object.freeze(["none", "contradiction", "insufficiency", "incomplete_model"]);
    var FAILURE_CLASS_SET = Object.freeze(
      FAILURE_CLASSES.reduce(function (acc, value) {
        acc[value] = true;
        return acc;
      }, Object.create(null))
    );

    function resolveAuthoringLib() {
      if (typeof require === "function") {
        try {
          return require("./gam-operational-suitability-prompt.js");
        } catch (_) {}
      }
      if (typeof globalThis !== "undefined" && globalThis.PRISM_GAM_OPERATIONAL_SUITABILITY_PROMPT) {
        return globalThis.PRISM_GAM_OPERATIONAL_SUITABILITY_PROMPT;
      }
      return null;
    }

    function collectObligations(dlaPage) {
      var lib = resolveAuthoringLib();
      if (!lib || typeof lib.collectSuitabilityObligationsFromPage !== "function") {
        return [];
      }
      var rows = lib.collectSuitabilityObligationsFromPage(dlaPage);
      return Array.isArray(rows) ? rows : [];
    }

    function nonEmptyString(value) {
      return typeof value === "string" && value.trim().length > 0;
    }

    function materialBodyText(material) {
      if (!material || typeof material !== "object") return "";
      var body = material.body;
      if (typeof body === "string") return body;
      if (body && typeof body === "object") {
        try {
          return JSON.stringify(body);
        } catch (_) {
          return "";
        }
      }
      return "";
    }

    function collectGamMaterialBodies(gamPage) {
      var map = Object.create(null);
      var activities = Array.isArray(gamPage && gamPage.activities) ? gamPage.activities : [];
      activities.forEach(function (activity) {
        var materials = Array.isArray(activity && activity.materials) ? activity.materials : [];
        materials.forEach(function (row) {
          var id = nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";
          if (!id) return;
          map[id] = materialBodyText(row);
        });
      });
      return map;
    }

    var REVIEW_SCOPE_IDENTITY_FIELDS = Object.freeze([
      "activity_id",
      "material_id",
      "material_type",
      "role",
      "commission_mode",
      "learner_task",
      "expected_output",
      "purpose",
      "specification",
      "generated_body"
    ]);

    function compareScopeRows(a, b) {
      var aKey = String((a && a.activity_id) || "") + "\0" + String((a && a.material_id) || "");
      var bKey = String((b && b.activity_id) || "") + "\0" + String((b && b.material_id) || "");
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    }

    function collectOperationalSuitabilityReviewScope(dlaPage, gamPage) {
      var obligations = collectObligations(dlaPage);
      var bodies = collectGamMaterialBodies(gamPage);
      var rows = obligations.map(function (entry) {
        var materialId = String((entry && entry.material_id) || "");
        return {
          activity_id: String((entry && entry.activity_id) || ""),
          material_id: materialId,
          material_type: String((entry && entry.material_type) || ""),
          role: String((entry && entry.role) || ""),
          commission_mode: String((entry && entry.commission_mode) || "determinate"),
          learner_task: String((entry && entry.learner_task) || ""),
          expected_output: String((entry && entry.expected_output) || ""),
          purpose: String((entry && entry.purpose) || ""),
          specification: String((entry && entry.specification) || ""),
          generated_body: Object.prototype.hasOwnProperty.call(bodies, materialId)
            ? bodies[materialId]
            : "",
          practice_independence_present: !!(entry && entry.practice_independence),
          response_fulfilment_present: !!(entry && entry.response_fulfilment)
        };
      });
      rows.sort(compareScopeRows);
      return { rows: rows, obligations: obligations };
    }

    function serializeReviewScope(scope) {
      var rows = Array.isArray(scope && scope.rows) ? scope.rows : [];
      return rows
        .map(function (row) {
          return REVIEW_SCOPE_IDENTITY_FIELDS.map(function (key) {
            var value = row && row[key] != null ? row[key] : "";
            return key + ":" + String(value);
          }).join("\n");
        })
        .join("\0");
    }

    function fnv1aHex(payload) {
      var hash = 2166136261;
      var text = String(payload || "");
      for (var i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
    }

    function fingerprintReviewScope(scope) {
      return fnv1aHex(serializeReviewScope(scope));
    }

    function fingerprintGamMaterials(dlaPage, gamPage) {
      return fingerprintReviewScope(collectOperationalSuitabilityReviewScope(dlaPage, gamPage));
    }

    function formatRoleLabel(role) {
      if (role === "model_complete") return "complete worked/model result";
      if (role === "model_demonstration") return "model demonstration";
      if (role === "learner_operand") return "learner operand";
      return "load-bearing material";
    }

    function parseReviewJson(raw) {
      var text = String(raw || "").trim();
      if (!text) {
        return { ok: false, parsed: null, error: "empty_review_capture" };
      }
      var fenced = text.match(/```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/i);
      if (fenced) text = String(fenced[1] || "").trim();
      try {
        var parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return { ok: false, parsed: null, error: "review_must_be_json_object" };
        }
        return { ok: true, parsed: parsed, error: "" };
      } catch (err) {
        return {
          ok: false,
          parsed: null,
          error: "invalid_json: " + String((err && err.message) || err)
        };
      }
    }

    function buildReviewPromptFromScope(scope, fingerprint) {
      var rows = Array.isArray(scope && scope.rows) ? scope.rows : [];
      if (!rows.length) return "";
      var lines = [
        "S78-OPS-2 OPERATIONAL-SUITABILITY REVIEW",
        "",
        "This is a REVIEW of generated particulars against an authoritative DLA commission.",
        "Do NOT rewrite materials. Do NOT propose improved content as the primary output.",
        "Do NOT judge style, pedagogy, formatting, or general quality.",
        "Do NOT check learner workspace blank cells (WS1).",
        "Do NOT check whether model and attempt operands are distinct (WS2).",
        "Do NOT review learner diagnostic feedback or revision guidance.",
        "",
        "Ask only: are these generated particulars operationally suitable for the commissioned action/result?",
        "",
        "Judgement is commission-relative:",
        "- Consistency: particulars must not contradict each other in a way that prevents commissioned completion.",
        "- Sufficiency: particulars must contain enough coherent information for the commissioned action/result.",
        "- Learner operand: if the learner must perform a load-bearing operation, the operand must make expected_output achievable. Do not require uniqueness unless the commission requires it.",
        "- Model completeness: if purpose/specification promises a complete worked result, the body must reach that result.",
        "- Open-ended/interpretive commissions: multiple defensible answers are NOT a failure.",
        "- Deliberate insufficiency: missing information is NOT a failure when identifying it is the commissioned task.",
        "",
        "failure_class must be one of: none, contradiction, insufficiency, incomplete_model.",
        "If suitable is true, failure_class must be none.",
        "If suitable is false, failure_class must not be none and reason must be a concise non-empty diagnosis.",
        "Review exactly the materials listed below — no extras, no omissions.",
        "",
        "gam_fingerprint (copy unchanged): " + fingerprint,
        "",
        "Materials to review:"
      ];

      rows.forEach(function (entry) {
        lines.push("");
        lines.push("### " + entry.material_id + " (" + formatRoleLabel(entry.role) + ")");
        lines.push("activity_id: " + (entry.activity_id || ""));
        lines.push("material_type: " + (entry.material_type || ""));
        lines.push("commission_mode: " + (entry.commission_mode || "determinate"));
        lines.push("learner_task: " + (entry.learner_task || "(none)"));
        lines.push("expected_output: " + (entry.expected_output || "(none)"));
        lines.push("purpose: " + (entry.purpose || "(none)"));
        lines.push("specification: " + (entry.specification || "(none)"));
        if (entry.practice_independence_present) {
          lines.push(
            "practice_independence: present (WS2 independence is out of scope for this review)"
          );
        }
        if (entry.response_fulfilment_present) {
          lines.push(
            "response_fulfilment: present (WS1 response surface is out of scope for this review)"
          );
        }
        lines.push("generated_body:");
        lines.push(entry.generated_body || "(missing generated body)");
      });

      lines.push("");
      lines.push("RETURN FORMAT — REQUIRED");
      lines.push("");
      lines.push("Return exactly one complete JSON artefact inside one fenced json code block.");
      lines.push("No prose before the fence. No prose after the fence.");
      lines.push("No Markdown explanation outside the JSON.");
      lines.push("Return complete JSON, not excerpts.");
      lines.push("Copy gam_fingerprint exactly from this prompt — do not alter it.");
      lines.push("");
      lines.push("```json");
      lines.push("{");
      lines.push('  "artifact_type": "' + ARTIFACT_TYPE + '",');
      lines.push('  "schema_version": "' + SCHEMA_VERSION + '",');
      lines.push('  "gam_fingerprint": "' + fingerprint + '",');
      lines.push('  "verdicts": [');
      lines.push("    {");
      lines.push('      "activity_id": "<activity_id>",');
      lines.push('      "material_id": "<material_id>",');
      lines.push('      "suitable": true,');
      lines.push('      "failure_class": "none",');
      lines.push('      "reason": ""');
      lines.push("    }");
      lines.push("  ]");
      lines.push("}");
      lines.push("```");

      return lines.join("\n");
    }

    function buildReviewPrompt(dlaPage, gamPage) {
      var scope = collectOperationalSuitabilityReviewScope(dlaPage, gamPage);
      if (!scope.rows.length) return "";
      return buildReviewPromptFromScope(scope, fingerprintReviewScope(scope));
    }

    function validateReviewArtefact(parsed, options) {
      var opts = options && typeof options === "object" ? options : {};
      var obligations = Array.isArray(opts.obligations) ? opts.obligations : [];
      var expectedFingerprint = String(opts.expectedFingerprint || "").trim();
      var errors = [];

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        errors.push("review must be a JSON object");
        return { ok: false, errors: errors, suitableAll: false };
      }
      if (String(parsed.artifact_type || "") !== ARTIFACT_TYPE) {
        errors.push('artifact_type must be "' + ARTIFACT_TYPE + '"');
      }
      if (String(parsed.schema_version || "") !== SCHEMA_VERSION) {
        errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
      }
      var fingerprint = String(parsed.gam_fingerprint || "").trim();
      if (!fingerprint) {
        errors.push("gam_fingerprint is required");
      } else if (expectedFingerprint && fingerprint !== expectedFingerprint) {
        errors.push(
          "S78_OPS2_STALE_REVIEW: gam_fingerprint does not match the current GAM + authoritative review scope; rerun the review"
        );
      }
      if (!Array.isArray(parsed.verdicts)) {
        errors.push("verdicts must be an array");
        return { ok: false, errors: errors, suitableAll: false };
      }

      var expectedIds = obligations
        .map(function (row) {
          return String(row.material_id || "").trim();
        })
        .filter(Boolean);
      var expectedSet = Object.create(null);
      var expectedActivityById = Object.create(null);
      obligations.forEach(function (row) {
        var id = String(row.material_id || "").trim();
        if (!id) return;
        expectedSet[id] = true;
        expectedActivityById[id] = String(row.activity_id || "").trim();
      });

      var seen = Object.create(null);
      var suitableAll = true;
      parsed.verdicts.forEach(function (verdict, index) {
        var path = "verdicts[" + index + "]";
        if (!verdict || typeof verdict !== "object" || Array.isArray(verdict)) {
          errors.push(path + " must be an object");
          suitableAll = false;
          return;
        }
        var materialId = String(verdict.material_id || "").trim();
        var activityId = String(verdict.activity_id || "").trim();
        if (!activityId) {
          errors.push(path + ".activity_id is required");
        }
        if (!materialId) {
          errors.push(path + ".material_id is required");
        } else if (!expectedSet[materialId]) {
          errors.push(path + " unknown material_id " + materialId);
        } else if (seen[materialId]) {
          errors.push(path + " duplicate material_id " + materialId);
        } else {
          seen[materialId] = true;
          var expectedActivity = expectedActivityById[materialId];
          if (expectedActivity && activityId && activityId !== expectedActivity) {
            errors.push(
              path +
                " activity_id " +
                activityId +
                " does not match obligated activity " +
                expectedActivity
            );
          }
        }
        if (typeof verdict.suitable !== "boolean") {
          errors.push(path + ".suitable must be boolean");
          suitableAll = false;
        }
        var failureClass = String(verdict.failure_class || "").trim();
        if (!FAILURE_CLASS_SET[failureClass]) {
          errors.push(
            path + ".failure_class must be one of: " + FAILURE_CLASSES.join(", ")
          );
        }
        if (verdict.suitable === true && failureClass && failureClass !== "none") {
          errors.push(path + ": suitable=true requires failure_class none");
        }
        if (verdict.suitable === false && failureClass === "none") {
          errors.push(path + ": suitable=false must not use failure_class none");
        }
        if (verdict.suitable === false && !nonEmptyString(verdict.reason)) {
          errors.push(path + ": suitable=false requires a non-empty reason");
        }
        if (verdict.suitable === false) suitableAll = false;
      });

      expectedIds.forEach(function (id) {
        if (!seen[id]) {
          errors.push("missing verdict for obligated material_id " + id);
          suitableAll = false;
        }
      });

      return { ok: errors.length === 0, errors: errors, suitableAll: suitableAll && errors.length === 0 };
    }

    function evaluateReviewGate(dlaPage, gamPage, reviewRaw) {
      var scope = collectOperationalSuitabilityReviewScope(dlaPage, gamPage);
      var obligations = scope.obligations;
      var fingerprint = fingerprintReviewScope(scope);
      if (!scope.rows.length) {
        return {
          required: false,
          accepted: true,
          fingerprint: fingerprint,
          obligations: [],
          prompt: "",
          errors: [],
          message: ""
        };
      }
      var prompt = buildReviewPromptFromScope(scope, fingerprint);
      var parsedWrap = parseReviewJson(reviewRaw);
      if (!parsedWrap.ok) {
        var missing = !String(reviewRaw || "").trim();
        return {
          required: true,
          accepted: false,
          fingerprint: fingerprint,
          obligations: obligations,
          prompt: prompt,
          errors: [
            missing
              ? "S78_OPS2_REVIEW_REQUIRED: paste an operational-suitability review before completing GAM"
              : "S78_OPS2_REVIEW_INVALID: " + parsedWrap.error
          ],
          message: missing
            ? "Operational-suitability review required. Copy the review prompt, then paste the review JSON. Do not assemble from this GAM until all obligated rows are suitable. On FAIL, regenerate GAM only from the same DLA."
            : "Operational-suitability review is not valid JSON: " + parsedWrap.error
        };
      }
      var check = validateReviewArtefact(parsedWrap.parsed, {
        obligations: obligations,
        expectedFingerprint: fingerprint
      });
      if (!check.ok) {
        return {
          required: true,
          accepted: false,
          fingerprint: fingerprint,
          obligations: obligations,
          prompt: prompt,
          errors: check.errors.slice(),
          message: "Operational-suitability review failed validation: " + check.errors.join("; ")
        };
      }
      if (!check.suitableAll) {
        var failed = (parsedWrap.parsed.verdicts || [])
          .filter(function (row) {
            return row && row.suitable === false;
          })
          .map(function (row) {
            return String(row.material_id || "?");
          });
        return {
          required: true,
          accepted: false,
          fingerprint: fingerprint,
          obligations: obligations,
          prompt: prompt,
          errors: [
            "S78_OPS2_REVIEW_FAIL: unsuitable materials: " + (failed.join(", ") || "unknown")
          ],
          message:
            "Operational-suitability review FAIL (" +
            (failed.join(", ") || "unknown") +
            "). GAM is not accepted. Regenerate GAM only from the same DLA. Do not edit the rejected GAM. Do not assemble."
        };
      }
      return {
        required: true,
        accepted: true,
        fingerprint: fingerprint,
        obligations: obligations,
        prompt: prompt,
        errors: [],
        message: ""
      };
    }

    return {
      ARTIFACT_TYPE: ARTIFACT_TYPE,
      SCHEMA_VERSION: SCHEMA_VERSION,
      FAILURE_CLASSES: FAILURE_CLASSES,
      REVIEW_SCOPE_IDENTITY_FIELDS: REVIEW_SCOPE_IDENTITY_FIELDS,
      collectObligations: collectObligations,
      collectOperationalSuitabilityReviewScope: collectOperationalSuitabilityReviewScope,
      serializeReviewScope: serializeReviewScope,
      fingerprintReviewScope: fingerprintReviewScope,
      fingerprintGamMaterials: fingerprintGamMaterials,
      buildReviewPrompt: buildReviewPrompt,
      parseReviewJson: parseReviewJson,
      validateReviewArtefact: validateReviewArtefact,
      evaluateReviewGate: evaluateReviewGate
    };
  }
);
