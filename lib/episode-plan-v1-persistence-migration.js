/**
 * Sprint 69 — Persist compressed Episode Plan beat functions to FunctionEnum.
 *
 * Applies at workflow runstate load / assembly selection — not in grammar
 * validation and not as renderer aliases. Material-type labels are untouched.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./episode-plan-v1-vocabulary.js"));
  } else {
    root.PRISM_EPISODE_PLAN_V1_PERSISTENCE_MIGRATION = factory(
      root.PRISM_EPISODE_PLAN_V1_VOCABULARY
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (vocabularyMod) {
  var FUNCTION_ENUM_SET =
    vocabularyMod && vocabularyMod.FUNCTION_ENUM_SET
      ? vocabularyMod.FUNCTION_ENUM_SET
      : {};

  /**
   * Compressed / historical Episode Plan beat → FunctionEnum.
   * Material types such as worked_example / analysis_table are not rewritten.
   */
  var COMPRESSED_EPISODE_PLAN_FUNCTION_MAP = Object.freeze({
    check_understanding: "verification",
    check: "verification",
    practice: "guided_practice",
    application: "guided_practice",
    analysis: "guided_practice",
    worked_example: "worked_thinking",
    evaluation: "guided_practice",
    judgement: "evaluative_judgement",
    consolidation: "reflection",
    feedback: "verification",
    investigation: "guided_inquiry",
    synthesis: "reflection"
  });

  function mapCompressedFunction(fn, archetype) {
    var id = String(fn || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    if (!id) return { function: id, changed: false };
    if (FUNCTION_ENUM_SET[id]) return { function: id, changed: false };
    if (id === "comparison") {
      var mappedComparison =
        String(archetype || "").toLowerCase() === "evaluate"
          ? "worked_judgement"
          : "worked_thinking";
      return { function: mappedComparison, changed: true };
    }
    if (COMPRESSED_EPISODE_PLAN_FUNCTION_MAP[id]) {
      return {
        function: COMPRESSED_EPISODE_PLAN_FUNCTION_MAP[id],
        changed: true
      };
    }
    return { function: id, changed: false };
  }

  function migrateEpisodePlanObject(plan) {
    if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
      return { plan: plan, changed: false, migrations: [] };
    }
    var archetype = String(plan.archetype || "").trim();
    var beats = Array.isArray(plan.beats) ? plan.beats : null;
    if (!beats) return { plan: plan, changed: false, migrations: [] };
    var changed = false;
    var migrations = [];
    var nextBeats = beats.map(function (beat, index) {
      if (!beat || typeof beat !== "object") return beat;
      var current = beat.function;
      var mapped = mapCompressedFunction(current, archetype);
      if (!mapped.changed) return beat;
      changed = true;
      migrations.push({
        index: index,
        from: String(current || ""),
        to: mapped.function,
        archetype: archetype
      });
      var copy = Object.assign({}, beat);
      copy.function = mapped.function;
      return copy;
    });
    if (!changed) return { plan: plan, changed: false, migrations: [] };
    var nextPlan = Object.assign({}, plan);
    nextPlan.beats = nextBeats;
    return { plan: nextPlan, changed: true, migrations: migrations };
  }

  function migratePageLikeArtefact(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      return { page: page, changed: false, migrations: [] };
    }
    var changed = false;
    var migrations = [];
    var next = page;
    function ensureClone() {
      if (next === page) next = Object.assign({}, page);
    }

    if (Array.isArray(page.activities)) {
      var nextActivities = page.activities.map(function (activity) {
        if (!activity || typeof activity !== "object") return activity;
        if (!activity.episode_plan) return activity;
        var migrated = migrateEpisodePlanObject(activity.episode_plan);
        if (!migrated.changed) return activity;
        changed = true;
        migrations.push({
          activityId: String(activity.activity_id || ""),
          migrations: migrated.migrations
        });
        var copy = Object.assign({}, activity);
        copy.episode_plan = migrated.plan;
        return copy;
      });
      if (changed) {
        ensureClone();
        next.activities = nextActivities;
      }
    }

    if (Array.isArray(page.episode_plans)) {
      var nextPlans = page.episode_plans.map(function (row) {
        if (!row || typeof row !== "object" || !row.episode_plan) return row;
        var migrated = migrateEpisodePlanObject(row.episode_plan);
        if (!migrated.changed) return row;
        changed = true;
        migrations.push({
          activityId: String(row.activity_id || ""),
          mirrored: true,
          migrations: migrated.migrations
        });
        var copy = Object.assign({}, row);
        copy.episode_plan = migrated.plan;
        return copy;
      });
      if (changed) {
        ensureClone();
        next.episode_plans = nextPlans;
      }
    }

    return { page: next, changed: changed, migrations: migrations };
  }

  function tryParseJson(text) {
    var raw = String(text || "").trim();
    if (!raw) return { ok: false };
    try {
      return { ok: true, value: JSON.parse(raw) };
    } catch (_err) {
      return { ok: false };
    }
  }

  function migrateCaptureText(text) {
    var parsed = tryParseJson(text);
    if (!parsed.ok || !parsed.value || typeof parsed.value !== "object") {
      return { text: text, changed: false, migrations: [] };
    }
    var migrated = migratePageLikeArtefact(parsed.value);
    if (!migrated.changed) {
      return { text: text, changed: false, migrations: [] };
    }
    return {
      text: JSON.stringify(migrated.page, null, 2),
      changed: true,
      migrations: migrated.migrations,
      page: migrated.page
    };
  }

  function migrateCaptureMap(map) {
    if (!map || typeof map !== "object") {
      return { map: map, changed: false, migrations: [] };
    }
    var changed = false;
    var migrations = [];
    var next = Object.assign({}, map);
    Object.keys(map).forEach(function (stepId) {
      var migrated = migrateCaptureText(map[stepId]);
      if (!migrated.changed) return;
      changed = true;
      next[stepId] = migrated.text;
      migrations.push({ stepId: stepId, migrations: migrated.migrations });
    });
    return { map: next, changed: changed, migrations: migrations };
  }

  function migrateRunStateRecord(rec) {
    if (!rec || typeof rec !== "object") {
      return { record: rec, changed: false, migrations: [] };
    }
    var changed = false;
    var migrations = [];
    var next = Object.assign({}, rec);
    var captured = migrateCaptureMap(rec.capturedOutputs);
    if (captured.changed) {
      changed = true;
      next.capturedOutputs = captured.map;
      migrations = migrations.concat(captured.migrations);
    }
    var capturedRaw = migrateCaptureMap(rec.capturedOutputsRaw);
    if (capturedRaw.changed) {
      changed = true;
      next.capturedOutputsRaw = capturedRaw.map;
      migrations = migrations.concat(
        capturedRaw.migrations.map(function (row) {
          return Object.assign({}, row, { raw: true });
        })
      );
    }
    return { record: next, changed: changed, migrations: migrations };
  }

  function migrateRunStateStore(store) {
    if (!store || typeof store !== "object") {
      return { store: store || {}, changed: false, migrations: [] };
    }
    var changed = false;
    var migrations = [];
    var next = {};
    Object.keys(store).forEach(function (workflowId) {
      var migrated = migrateRunStateRecord(store[workflowId]);
      next[workflowId] = migrated.record;
      if (migrated.changed) {
        changed = true;
        migrations.push({
          workflowId: workflowId,
          migrations: migrated.migrations
        });
      }
    });
    return { store: next, changed: changed, migrations: migrations };
  }

  return {
    COMPRESSED_EPISODE_PLAN_FUNCTION_MAP: COMPRESSED_EPISODE_PLAN_FUNCTION_MAP,
    mapCompressedFunction: mapCompressedFunction,
    migrateEpisodePlanObject: migrateEpisodePlanObject,
    migratePageLikeArtefact: migratePageLikeArtefact,
    migrateCaptureText: migrateCaptureText,
    migrateRunStateRecord: migrateRunStateRecord,
    migrateRunStateStore: migrateRunStateStore
  };
});
