/**
 * Lightweight pedagogical beat classification (renderer-only).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_UTILITY_PEDAGOGICAL_BEATS = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    var BEAT_RULES = [
      { beat: "CHECK", pattern: /\b(check(?:list)?|self[- ]?check|review your|check your understanding|formative check)\b/i },
      { beat: "EXAMPLE", pattern: /\b(worked example|model answer|sample answer|example)\b/i },
      { beat: "DISCUSS", pattern: /\b(discuss|discussion|debate|talk about|group conversation)\b/i },
      { beat: "WATCH", pattern: /\b(watch|video|view the|observe the recording)\b/i },
      { beat: "CREATE", pattern: /\b(create|build|design|draft|produce|make a)\b/i },
      { beat: "EVALUATE", pattern: /\b(evaluate|assess|judge|rate|critique|appraise)\b/i },
      { beat: "PRACTICE", pattern: /\b(try it yourself|practice|apply|complete the task|have a go|attempt)\b/i },
      { beat: "READ", pattern: /\b(read|study the|review the text|read through)\b/i },
      {
        beat: "REFLECT",
        pattern: /\b(reflect|think about|consider why|self[- ]?explain|why this matters|how to approach)\b/i
      },
      { beat: "NOTE", pattern: /\b(note|remember|tip|takeaway|jot down)\b/i }
    ];

    function normalizeBeatText(text) {
      return String(text == null ? "" : text)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function registryLib() {
      var g =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
            ? window
            : this;
      return g && g.PRISM_BEAT_MATERIAL_REGISTRY ? g.PRISM_BEAT_MATERIAL_REGISTRY : null;
    }

    function classifyPedagogicalBeat(text, materialType) {
      var registry = registryLib();
      if (registry && materialType && typeof registry.resolveBeatForMaterialType === "function") {
        var typeHit = registry.resolveBeatForMaterialType(materialType);
        if (typeHit && typeHit.beat) return typeHit.beat;
      }
      var source = normalizeBeatText(text);
      if (!source) return null;
      for (var i = 0; i < BEAT_RULES.length; i += 1) {
        if (BEAT_RULES[i].pattern.test(source)) return BEAT_RULES[i].beat;
      }
      return null;
    }

    function classifyPedagogicalBeatFromFields(fields, materialType) {
      if (materialType) {
        var byType = classifyPedagogicalBeat("", materialType);
        if (byType) return byType;
      }
      var list = Array.isArray(fields) ? fields : [fields];
      var i;
      for (i = 0; i < list.length; i += 1) {
        var beat = classifyPedagogicalBeat(list[i], materialType);
        if (beat) return beat;
      }
      return null;
    }

    return {
      BEAT_RULES: BEAT_RULES,
      classifyPedagogicalBeat: classifyPedagogicalBeat,
      classifyPedagogicalBeatFromFields: classifyPedagogicalBeatFromFields,
      normalizeBeatText: normalizeBeatText
    };
  }
);
