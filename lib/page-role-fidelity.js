/**
 * Instructional role fidelity validation (Sprint 38-P).
 * RF-1..RF-8 gates producing roleOk alongside existing proofOk.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_PAGE_ROLE_FIDELITY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var preserve = null;
  var roleRegistry = null;
  var roleRender = null;

  try {
    preserve = require("./page-gam-materials-preserve.js");
  } catch (e1) {
    preserve = null;
  }
  try {
    roleRegistry = require("./page-role-registry.js");
  } catch (e2) {
    roleRegistry = null;
  }
  try {
    roleRender = require("./page-role-render-sequencing.js");
  } catch (e3) {
    roleRender = null;
  }

  var ROLE_FIDELITY_VERSION = "38P-5";

  var ROLE_FIDELITY_GATES = {
    RF1: "RF1_role_uniqueness",
    RF2: "RF2_no_weak_first_render",
    RF3: "RF3_stable_role_identity",
    RF4: "RF4_pedagogical_function",
    RF5: "RF5_no_role_inversion",
    RF6: "RF6_episode_sequence",
    RF7: "RF7_body_role_coherence",
    RF8: "RF8_compose_transparency"
  };

  var ENFORCED_BODY_MARKERS = {
    worked_judgement_support: ["weak_worked_judgement", "strong_worked_judgement"],
    guided_judgement_table: ["guided_table_exemplar"],
    scenario: ["strategy_a", "strategy_e"],
    transfer_prompt: ["transfer_word_band"],
    consolidation_summary: ["consolidation_reflect"]
  };

  var KNOWN_STUB_KEYS = {
    modelling_note: "worked_judgement_support",
    decision_table: "guided_judgement_table",
    transfer_prompt: "transfer_prompt",
    template: "independent_template",
    worked_example: "worked_judgement_support"
  };

  function resolvePreserve() {
    if (preserve && preserve.findLearningActivitiesRows) return preserve;
    var roots = [typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_PAGE_GAM_MATERIALS_PRESERVE) {
        return roots[i].PRISM_PAGE_GAM_MATERIALS_PRESERVE;
      }
    }
    return null;
  }

  function resolveRegistry() {
    if (roleRegistry && roleRegistry.getSequenceForArchetype) return roleRegistry;
    var roots = [typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_PAGE_ROLE_REGISTRY) {
        return roots[i].PRISM_PAGE_ROLE_REGISTRY;
      }
    }
    return null;
  }

  function resolveRoleRender() {
    if (roleRender && roleRender.buildRolePrecedenceRenderPlan) return roleRender;
    var roots = [typeof globalThis !== "undefined" ? globalThis : null, typeof window !== "undefined" ? window : null];
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (roots[i] && roots[i].PRISM_PAGE_ROLE_RENDER_SEQUENCING) {
        return roots[i].PRISM_PAGE_ROLE_RENDER_SEQUENCING;
      }
    }
    return null;
  }

  function findLearningActivitiesRows(page) {
    var mod = resolvePreserve();
    if (mod && mod.findLearningActivitiesRows) return mod.findLearningActivitiesRows(page);
    return [];
  }

  function pageMaterialText(materials, key) {
    var mod = resolvePreserve();
    if (mod && mod.pageMaterialText) return mod.pageMaterialText(materials, key);
    return String((materials && materials[key]) || "");
  }

  function evaluateMaterialMarkers(body, markers) {
    var mod = resolvePreserve();
    if (mod && mod.evaluateMaterialMarkers) return mod.evaluateMaterialMarkers(body, markers);
    return { found: [], missing: markers || [] };
  }

  function semanticMarkerSatisfied(markerId, text) {
    var mod = resolvePreserve();
    if (mod && mod.semanticMarkerSatisfied) return mod.semanticMarkerSatisfied(markerId, text);
    return false;
  }

  function measurePageGamFidelity(page, options) {
    var mod = resolvePreserve();
    if (mod && mod.measurePageGamFidelity) return mod.measurePageGamFidelity(page, options);
    return [];
  }

  function ROLE_AUTHORITY() {
    return (
      (preserve && preserve.ROLE_AUTHORITY) || {
        CANONICAL: "canonical",
        COMPOSE: "compose",
        ALIAS: "alias",
        SUPERSEDED: "superseded",
        UNRESOLVED: "unresolved"
      }
    );
  }

  function emptyGate() {
    return { ok: true, errors: [], warnings: [] };
  }

  function gateFail(gate, code, detail) {
    gate.ok = false;
    gate.errors.push(code + ":" + detail);
  }

  function gateWarn(gate, code, detail) {
    gate.warnings.push(code + ":" + detail);
  }

  function materialHasBody(val) {
    if (val == null || val === "") return false;
    if (typeof val === "string") return String(val).trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  }

  function extractMaterialHeadings(html) {
    var re = /<h4[^>]*class="[^"]*util-material-heading[^"]*"[^>]*>([\s\S]*?)<\/h4>/gi;
    var headings = [];
    var m;
    while ((m = re.exec(String(html || ""))) !== null) {
      headings.push({
        pos: m.index,
        text: String(m[1] || "")
          .replace(/<[^>]+>/g, "")
          .trim()
      });
    }
    return headings;
  }

  function findActivityHtmlBlock(html, page, rowIndex) {
    var rows = findLearningActivitiesRows(page);
    var row = rows[rowIndex];
    if (!row) return String(html || "");
    var title = String(row.title || row.activity_title || "");
    if (!title) return String(html || "");
    var text = String(html || "");
    var start = text.indexOf(title);
    if (start < 0) return "";
    var nextStart = text.length;
    var i;
    for (i = 0; i < rows.length; i += 1) {
      if (i === rowIndex) continue;
      var otherTitle = String(rows[i].title || rows[i].activity_title || "");
      if (!otherTitle) continue;
      var pos = text.indexOf(otherTitle, start + title.length);
      if (pos > start && pos < nextStart) nextStart = pos;
    }
    return text.substring(start, nextStart);
  }

  function resolveRenderHtmlForActivity(page, renderHtml, rowIndex) {
    if (typeof renderHtml === "string") {
      return findActivityHtmlBlock(renderHtml, page, rowIndex);
    }
    if (renderHtml && typeof renderHtml === "object") {
      var rows = findLearningActivitiesRows(page);
      var row = rows[rowIndex];
      var id = row && (row.activity_id || "A" + (rowIndex + 1));
      if (renderHtml[id]) return String(renderHtml[id]);
      if (renderHtml[rowIndex]) return String(renderHtml[rowIndex]);
    }
    return "";
  }

  function groupIndexByRoleFamily(indexMap) {
    var groups = {};
    Object.keys(indexMap || {}).forEach(function (key) {
      var entry = indexMap[key];
      if (!entry || !entry.role_family) return;
      if (!groups[entry.role_family]) groups[entry.role_family] = [];
      groups[entry.role_family].push({ key: key, entry: entry });
    });
    return groups;
  }

  function authoritativeEntriesForFamily(items) {
    var AUTH = ROLE_AUTHORITY();
    return (items || []).filter(function (item) {
      return (
        item.entry.renderable !== false &&
        (item.entry.authority === AUTH.CANONICAL || item.entry.authority === AUTH.COMPOSE || item.entry.authority === AUTH.UNRESOLVED)
      );
    });
  }

  function getBodyMarkersForRoleFamily(roleFamily) {
    var registry = resolveRegistry();
    if (!registry) return [];
    var rules = registry.getAuthorityRules(roleFamily);
    return rules && rules.body_markers ? rules.body_markers.slice() : [];
  }

  function getInversionMarkersForRoleFamily(roleFamily) {
    var registry = resolveRegistry();
    if (!registry) return [];
    var rules = registry.getAuthorityRules(roleFamily);
    return rules && rules.inversion_markers ? rules.inversion_markers.slice() : [];
  }

  function expectedRegistryHeading(roleFamily, row) {
    var registry = resolveRegistry();
    if (!registry) return null;
    var heading = registry.resolveRoleHeading(roleFamily);
    var order = row && Array.isArray(row.materials_order) ? row.materials_order : [];
    if (roleFamily === "verification_checklist" && order.indexOf("checklist") !== -1) {
      return "Checklist";
    }
    if (order.indexOf("scenario_maya_households") !== -1 && roleFamily === "scenario") {
      return "Scenario Maya households";
    }
    if (roleFamily === "explanatory_guidance") {
      var mats = (row && row.materials) || {};
      if (mats.criteria_exposition_evaluate || mats.criteria_text) {
        return null;
      }
    }
    return heading;
  }

  function headingPatternForRoleFamily(roleFamily, row) {
    var expected = expectedRegistryHeading(roleFamily, row);
    if (!expected) {
      if (roleFamily === "explanatory_guidance") {
        return /Concept exposition|Criteria exposition|Evaluation criteria/i;
      }
      return null;
    }
    return new RegExp("^" + expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
  }

  function stubHeadingPatternForKey(key) {
    var patterns = {
      modelling_note: /^Modelling note$/i,
      decision_table: /^Decision table$/i,
      template: /^Template$/i
    };
    return patterns[key] || null;
  }

  function assertRoleUniqueness(row, activityLabel, gate) {
    var indexMap = (row && row.material_role_index) || {};
    var groups = groupIndexByRoleFamily(indexMap);
    Object.keys(groups).forEach(function (roleFamily) {
      var auth = authoritativeEntriesForFamily(groups[roleFamily]);
      if (auth.length > 1) {
        gateFail(
          gate,
          activityLabel + ":RF1",
          roleFamily + " has " + auth.length + " authoritative entries: " + auth.map(function (a) {
            return a.key;
          }).join(", ")
        );
      }
      var canonical = groups[roleFamily].filter(function (item) {
        return item.entry.authority === ROLE_AUTHORITY().CANONICAL;
      });
      if (canonical.length > 1) {
        gateFail(
          gate,
          activityLabel + ":RF1",
          roleFamily + " has " + canonical.length + " canonical entries"
        );
      }
    });
  }

  function assertNoWeakFirstRender(row, activityLabel, activityHtml, gate) {
    if (!activityHtml) {
      gateWarn(gate, activityLabel + ":RF2", "no render HTML supplied — render order not verified");
      return;
    }
    var indexMap = (row && row.material_role_index) || {};
    var headings = extractMaterialHeadings(activityHtml);
    var groups = groupIndexByRoleFamily(indexMap);

    Object.keys(groups).forEach(function (roleFamily) {
      var items = groups[roleFamily];
      var canonical = items.find(function (item) {
        return item.entry.authority === ROLE_AUTHORITY().CANONICAL && item.entry.renderable !== false;
      });
      if (!canonical) return;

      var authPattern = headingPatternForRoleFamily(roleFamily, row);
      var authPos = -1;
      if (authPattern) {
        headings.forEach(function (h) {
          if (authPos < 0 && authPattern.test(h.text)) authPos = h.pos;
        });
      }

      items.forEach(function (item) {
        if (item.entry.authority !== ROLE_AUTHORITY().SUPERSEDED) return;
        var stubPattern = stubHeadingPatternForKey(item.key);
        if (stubPattern) {
          headings.forEach(function (h) {
            if (stubPattern.test(h.text)) {
              if (authPos < 0 || h.pos < authPos) {
                gateFail(
                  gate,
                  activityLabel + ":RF2",
                  "superseded stub heading " + item.key + " appears before authoritative " + canonical.key
                );
              }
            }
          });
        }
        var stubBody = pageMaterialText(row.materials, item.key);
        if (stubBody && stubBody.length >= 40 && authPos >= 0) {
          var snippet = String(stubBody).substring(0, 60).replace(/\s+/g, " ");
          if (activityHtml.indexOf(snippet) >= 0) {
            var stubPos = activityHtml.indexOf(snippet);
            if (stubPos < authPos) {
              gateFail(
                gate,
                activityLabel + ":RF2",
                "superseded body for " + item.key + " precedes authoritative render for " + roleFamily
              );
            }
          }
        }
      });
    });
  }

  function renderPlanKeysForRow(row) {
    var renderMod = resolveRoleRender();
    if (!renderMod || !renderMod.buildRolePrecedenceRenderPlan) return {};
    var plan = renderMod.buildRolePrecedenceRenderPlan(row, row.materials || {});
    var keys = {};
    plan.forEach(function (item) {
      keys[item.key] = true;
    });
    return keys;
  }

  function assertStableRoleIdentity(row, activityLabel, activityHtml, gate) {
    var registry = resolveRegistry();
    if (!registry) {
      gateWarn(gate, activityLabel + ":RF3", "role registry unavailable");
      return;
    }
    if (!activityHtml) {
      gateWarn(gate, activityLabel + ":RF3", "no render HTML supplied");
      return;
    }
    var indexMap = (row && row.material_role_index) || {};
    var headings = extractMaterialHeadings(activityHtml);
    var plannedKeys = renderPlanKeysForRow(row);
    Object.keys(indexMap).forEach(function (key) {
      var entry = indexMap[key];
      if (entry.authority !== ROLE_AUTHORITY().CANONICAL || entry.renderable === false) return;
      if (!entry.role_family) return;
      if (Object.keys(plannedKeys).length && !plannedKeys[key]) return;
      var pattern = headingPatternForRoleFamily(entry.role_family, row);
      if (!pattern) return;
      var found = headings.some(function (h) {
        return pattern.test(h.text);
      });
      if (!found) {
        gateFail(
          gate,
          activityLabel + ":RF3",
          "canonical " + key + " missing registry heading for " + entry.role_family
        );
      }
    });

    Object.keys(indexMap).forEach(function (key) {
      var entry = indexMap[key];
      if (entry.authority !== ROLE_AUTHORITY().SUPERSEDED) return;
      if (!KNOWN_STUB_KEYS[key]) return;
      var stubPattern = stubHeadingPatternForKey(key);
      if (!stubPattern) return;
      if (headings.some(function (h) {
        return stubPattern.test(h.text);
      })) {
        gateFail(gate, activityLabel + ":RF3", "superseded stub heading " + key + " visible in render");
      }
    });
  }

  function enforcedMarkersForEntry(entry, row) {
    var family = entry.role_family;
    var archetype = (row && row.activity_archetype) || "default";
    if (!ENFORCED_BODY_MARKERS[family]) return [];
    if (family === "scenario" && archetype !== "evaluate") return [];
    if (
      (family === "worked_judgement_support" ||
        family === "guided_judgement_table" ||
        family === "transfer_prompt" ||
        family === "consolidation_summary") &&
      archetype !== "evaluate"
    ) {
      return [];
    }
    return ENFORCED_BODY_MARKERS[family].slice();
  }

  function assertPedagogicalFunctionMarkers(row, activityLabel, gate) {
    var indexMap = (row && row.material_role_index) || {};
    Object.keys(indexMap).forEach(function (key) {
      var entry = indexMap[key];
      if (!entry.role_family) return;
      var markers = enforcedMarkersForEntry(entry, row);
      if (!markers.length) return;

      if (entry.authority === ROLE_AUTHORITY().CANONICAL && entry.renderable !== false) {
        var body = pageMaterialText(row.materials, key);
        var evalResult = evaluateMaterialMarkers(body, markers);
        if (evalResult.missing.length) {
          gateFail(
            gate,
            activityLabel + ":RF4",
            "canonical " + key + " missing markers: " + evalResult.missing.join(", ")
          );
        }
      }

      if (entry.authority === ROLE_AUTHORITY().SUPERSEDED) {
        var stubBody = pageMaterialText(row.materials, key);
        var stubEval = evaluateMaterialMarkers(stubBody, markers);
        if (stubEval.found.length === markers.length) {
          gateWarn(
            gate,
            activityLabel + ":RF4",
            "superseded " + key + " carries full marker set — audit only"
          );
        }
      }
    });
  }

  function assertNoRoleInversion(row, activityLabel, gate) {
    var indexMap = (row && row.material_role_index) || {};
    Object.keys(indexMap).forEach(function (key) {
      var entry = indexMap[key];
      if (entry.authority !== ROLE_AUTHORITY().CANONICAL || entry.renderable === false) return;
      if (!entry.role_family) return;
      var inversionMarkers = getInversionMarkersForRoleFamily(entry.role_family);
      if (!inversionMarkers.length) return;
      var body = pageMaterialText(row.materials, key);
      inversionMarkers.forEach(function (markerId) {
        if (markerId === "learner_write_prompt") {
          if (/^Write\s+(a|your|an)\s+/im.test(body) && !/Reflect on/i.test(body)) {
            gateFail(gate, activityLabel + ":RF5", key + " reads as learner-write prompt not teacher synthesis");
          }
          if (/Complete the following prompt/i.test(body)) {
            gateFail(gate, activityLabel + ":RF5", key + " contains learner-task inversion pattern");
          }
        } else if (semanticMarkerSatisfied(markerId, body)) {
          gateFail(gate, activityLabel + ":RF5", key + " matches inversion marker " + markerId);
        }
      });
    });
  }

  function assertEpisodeSequence(row, activityLabel, activityHtml, gate) {
    var registry = resolveRegistry();
    var renderMod = resolveRoleRender();
    if (!registry || !renderMod) {
      gateWarn(gate, activityLabel + ":RF6", "registry or render sequencing unavailable");
      return;
    }
    if (!activityHtml) {
      gateWarn(gate, activityLabel + ":RF6", "no render HTML supplied");
      return;
    }
    var plan = renderMod.buildRolePrecedenceRenderPlan(row, row.materials || {});
    if (!plan.length) {
      gateWarn(gate, activityLabel + ":RF6", "empty role precedence plan");
      return;
    }
    var headings = extractMaterialHeadings(activityHtml);
    var positions = [];
    plan.forEach(function (item) {
      var pattern = headingPatternForRoleFamily(item.role_family, row);
      if (!pattern) return;
      var pos = -1;
      headings.forEach(function (h) {
        if (pos < 0 && pattern.test(h.text)) pos = h.pos;
      });
      positions.push({ role_family: item.role_family, key: item.key, pos: pos });
    });
    for (var i = 1; i < positions.length; i += 1) {
      if (positions[i].pos < 0 || positions[i - 1].pos < 0) continue;
      if (positions[i].pos <= positions[i - 1].pos) {
        gateFail(
          gate,
          activityLabel + ":RF6",
          positions[i - 1].role_family + " must precede " + positions[i].role_family + " in render"
        );
      }
    }
  }

  function assertBodyRoleCoherence(row, activityLabel, page, options, gate) {
    var indexMap = (row && row.material_role_index) || {};
    var metrics = measurePageGamFidelity(page, options || {});
    var canonicalKeys = Object.keys(indexMap).filter(function (key) {
      var entry = indexMap[key];
      return entry.authority === ROLE_AUTHORITY().CANONICAL && entry.renderable !== false;
    });

    canonicalKeys.forEach(function (key) {
      var entry = indexMap[key];
      var enforced = enforcedMarkersForEntry(entry, row);
      if (!enforced.length) return;

      var matched = metrics.filter(function (m) {
        if (entry.material_id && m.material_id) {
          return (
            String(m.material_id) === String(entry.material_id) ||
            String(m.material_id).indexOf(String(entry.material_id) + "_") === 0
          );
        }
        if (m.page_key !== key) return false;
        var act = String(m.activity_id || "").toLowerCase();
        return act === activityLabel.toLowerCase();
      });
      if (!matched.length) return;
      matched.forEach(function (m) {
        if (m.ratio != null && m.ratio < 50) {
          gateFail(gate, activityLabel + ":RF7", key + " ratio " + m.ratio + "% below minimum");
        }
        if (m.markersMissing && m.markersMissing.length) {
          gateFail(
            gate,
            activityLabel + ":RF7",
            key + " missing 38M markers: " + m.markersMissing.join(", ")
          );
        }
      });
    });
  }

  function assertComposeTransparency(page, gate) {
    var rows = findLearningActivitiesRows(page);
    if (!page.metadata || page.metadata.role_supersession_applied !== true) {
      gateFail(gate, "page:RF8", "metadata.role_supersession_applied not true");
    }
    rows.forEach(function (row, index) {
      var activityLabel = "A" + (index + 1);
      var indexMap = (row && row.material_role_index) || {};
      if (!Object.keys(indexMap).length) {
        gateFail(gate, activityLabel + ":RF8", "missing material_role_index");
        return;
      }
      var mats = (row && row.materials) || {};
      Object.keys(mats).forEach(function (key) {
        if (!materialHasBody(mats[key])) return;
        if (!indexMap[key]) {
          gateFail(gate, activityLabel + ":RF8", "material key " + key + " missing index entry");
        }
      });
      Object.keys(indexMap).forEach(function (key) {
        var entry = indexMap[key];
        if (!entry.authority) {
          gateFail(gate, activityLabel + ":RF8", key + " missing authority");
        }
        if (!entry.source) {
          gateFail(gate, activityLabel + ":RF8", key + " missing source");
        }
        if (entry.authority === ROLE_AUTHORITY().SUPERSEDED && !entry.superseded_by) {
          gateFail(gate, activityLabel + ":RF8", key + " superseded without superseded_by");
        }
      });
    });
  }

  function measureRoleCoverage(page) {
    var rows = findLearningActivitiesRows(page);
    var registry = resolveRegistry();
    var report = {
      activities: [],
      totals: {
        role_families: 0,
        canonical: 0,
        superseded: 0,
        unresolved: 0
      }
    };
    rows.forEach(function (row, index) {
      var indexMap = (row && row.material_role_index) || {};
      var families = {};
      var activityReport = {
        activity_id: row && row.activity_id,
        index: index,
        archetype: row && row.activity_archetype,
        role_families: [],
        canonical: [],
        superseded: [],
        unresolved: []
      };
      Object.keys(indexMap).forEach(function (key) {
        var entry = indexMap[key];
        if (entry.role_family) {
          families[entry.role_family] = true;
        }
        if (entry.authority === ROLE_AUTHORITY().CANONICAL) {
          activityReport.canonical.push({ key: key, role_family: entry.role_family });
        } else if (entry.authority === ROLE_AUTHORITY().SUPERSEDED) {
          activityReport.superseded.push({ key: key, role_family: entry.role_family, superseded_by: entry.superseded_by });
        } else if (entry.authority === ROLE_AUTHORITY().UNRESOLVED) {
          activityReport.unresolved.push({ key: key });
        }
      });
      activityReport.role_families = Object.keys(families);
      report.totals.role_families += activityReport.role_families.length;
      report.totals.canonical += activityReport.canonical.length;
      report.totals.superseded += activityReport.superseded.length;
      report.totals.unresolved += activityReport.unresolved.length;
      if (registry && row.activity_archetype) {
        activityReport.expected_sequence = registry.getSequenceForArchetype(row.activity_archetype);
      }
      report.activities.push(activityReport);
    });
    return report;
  }

  function measureRenderedRoles(page, renderHtml) {
    var rows = findLearningActivitiesRows(page);
    var registry = resolveRegistry();
    var renderMod = resolveRoleRender();
    var report = { activities: [] };

    rows.forEach(function (row, index) {
      var activityHtml = resolveRenderHtmlForActivity(page, renderHtml, index);
      var headings = extractMaterialHeadings(activityHtml);
      var plan =
        renderMod && renderMod.buildRolePrecedenceRenderPlan
          ? renderMod.buildRolePrecedenceRenderPlan(row, row.materials || {})
          : [];
      var mapped = headings.map(function (h) {
        var roleFamily = null;
        if (registry) {
          var families = registry.listRoleFamilies();
          var fi;
          for (fi = 0; fi < families.length; fi += 1) {
            var pattern = headingPatternForRoleFamily(families[fi], row);
            if (pattern && pattern.test(h.text)) {
              roleFamily = families[fi];
              break;
            }
          }
        }
        return { pos: h.pos, text: h.text, role_family: roleFamily };
      });
      report.activities.push({
        activity_id: row && row.activity_id,
        index: index,
        headings: mapped,
        planned_order: plan.map(function (p) {
          return p.role_family;
        }),
        duplicate_suppression: {
          stub_headings_found: mapped.filter(function (m) {
            return (
              m.text.match(/^Modelling note$|^Decision table$|^Template$/i) &&
              plan.some(function (p) {
                return p.role_family === "worked_judgement_support" || p.role_family === "guided_judgement_table" || p.role_family === "independent_template";
              })
            );
          })
        }
      });
    });
    return report;
  }

  function measureRoleFidelity(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var validation = validate38PRoleFidelity(page, opts);
    var coverage = measureRoleCoverage(page);
    var rendered = opts.renderHtml ? measureRenderedRoles(page, opts.renderHtml) : null;
    var supersession =
      preserve && preserve.measureRoleSupersession
        ? preserve.measureRoleSupersession(page, opts)
        : null;
    return {
      roleOk: validation.ok,
      validation: validation,
      coverage: coverage,
      rendered: rendered,
      supersession: supersession
    };
  }

  function validate38PRoleFidelity(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var gates = {
      RF1_role_uniqueness: emptyGate(),
      RF2_no_weak_first_render: emptyGate(),
      RF3_stable_role_identity: emptyGate(),
      RF4_pedagogical_function: emptyGate(),
      RF5_no_role_inversion: emptyGate(),
      RF6_episode_sequence: emptyGate(),
      RF7_body_role_coherence: emptyGate(),
      RF8_compose_transparency: emptyGate()
    };
    var errors = [];
    var warnings = [];
    var diagnostics = {
      version: ROLE_FIDELITY_VERSION,
      activities_checked: 0,
      render_html_supplied: !!opts.renderHtml
    };

    if (!page || typeof page !== "object") {
      errors.push("page:RF0:invalid page object");
      return { ok: false, roleOk: false, errors: errors, warnings: warnings, gates: gates, diagnostics: diagnostics };
    }

    var rows = findLearningActivitiesRows(page);
    var hasAnyIndex = rows.some(function (row) {
      return row && row.material_role_index && Object.keys(row.material_role_index).length > 0;
    });

    if (!hasAnyIndex) {
      if (opts.allowLegacy !== true) {
        gateFail(gates.RF8_compose_transparency, "page:RF8", "no material_role_index on any activity");
      } else {
        gateWarn(gates.RF8_compose_transparency, "page:RF8", "legacy page without role index — role gates skipped");
        return {
          ok: false,
          roleOk: false,
          errors: [],
          warnings: ["page:RF8:legacy mode without material_role_index"],
          gates: gates,
          diagnostics: diagnostics,
          legacy: true
        };
      }
    }

    assertComposeTransparency(page, gates.RF8_compose_transparency);

    rows.forEach(function (row, index) {
      if (!row || !row.material_role_index || !Object.keys(row.material_role_index).length) return;
      diagnostics.activities_checked += 1;
      var activityLabel = "A" + (index + 1);
      var activityHtml = resolveRenderHtmlForActivity(page, opts.renderHtml, index);

      assertRoleUniqueness(row, activityLabel, gates.RF1_role_uniqueness);
      assertNoWeakFirstRender(row, activityLabel, activityHtml, gates.RF2_no_weak_first_render);
      assertStableRoleIdentity(row, activityLabel, activityHtml, gates.RF3_stable_role_identity);
      assertPedagogicalFunctionMarkers(row, activityLabel, gates.RF4_pedagogical_function);
      assertNoRoleInversion(row, activityLabel, gates.RF5_no_role_inversion);
      assertEpisodeSequence(row, activityLabel, activityHtml, gates.RF6_episode_sequence);
      assertBodyRoleCoherence(row, activityLabel, page, opts, gates.RF7_body_role_coherence);
    });

    Object.keys(gates).forEach(function (gateName) {
      var gate = gates[gateName];
      gate.errors.forEach(function (err) {
        errors.push(err);
      });
      gate.warnings.forEach(function (warn) {
        warnings.push(warn);
      });
    });

    var ok = errors.length === 0;
    return {
      ok: ok,
      roleOk: ok,
      errors: errors,
      warnings: warnings,
      gates: gates,
      diagnostics: diagnostics,
      passed: Object.keys(gates).filter(function (name) {
        return gates[name].ok;
      }),
      failed: Object.keys(gates).filter(function (name) {
        return !gates[name].ok;
      })
    };
  }

  function computeRoleOk(page, options) {
    return validate38PRoleFidelity(page, options).ok;
  }

  function computeProofDimensions(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    var mod = resolvePreserve();
    var proof38M =
      mod && mod.validate38MPageFidelity
        ? mod.validate38MPageFidelity(page, opts)
        : { ok: false, errors: ["38M validator unavailable"] };
    var role38P = validate38PRoleFidelity(page, opts);
    var proofOk = proof38M.ok === true;
    if (opts.include38L !== false && mod && mod.validate38LPageGamPreservation) {
      var check38L = mod.validate38LPageGamPreservation(page, opts);
      proofOk = proofOk && check38L.ok === true;
    }
    return {
      proofOk: proofOk,
      roleOk: role38P.ok,
      fullOk: proofOk && role38P.ok,
      validation38M: {
        ok: proof38M.ok,
        errors: proof38M.errors || [],
        warnings: proof38M.warnings || []
      },
      validation38P: role38P,
      diagnostics: measureRoleFidelity(page, opts)
    };
  }

  return {
    ROLE_FIDELITY_VERSION: ROLE_FIDELITY_VERSION,
    ROLE_FIDELITY_GATES: ROLE_FIDELITY_GATES,
    validate38PRoleFidelity: validate38PRoleFidelity,
    computeRoleOk: computeRoleOk,
    computeProofDimensions: computeProofDimensions,
    measureRoleFidelity: measureRoleFidelity,
    measureRenderedRoles: measureRenderedRoles,
    measureRoleCoverage: measureRoleCoverage,
    extractMaterialHeadings: extractMaterialHeadings
  };
});
