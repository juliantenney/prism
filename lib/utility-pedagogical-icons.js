/**
 * Semantic pedagogical icon registry (Lucide SVG, renderer-only).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_UTILITY_PEDAGOGICAL_ICONS = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function () {
    "use strict";

    function registryLib() {
      var g =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
            ? window
            : this;
      return g && g.PRISM_BEAT_MATERIAL_REGISTRY ? g.PRISM_BEAT_MATERIAL_REGISTRY : null;
    }

    var ICON_SIZE_PX = {
      sm: 16,
      md: 18,
      lg: 20
    };

    var LUCIDE_SHAPES = {
      "book-open": [
        { tag: "path", d: "M12 7v14" },
        {
          tag: "path",
          d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
        }
      ],
      lightbulb: [
        {
          tag: "path",
          d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
        },
        { tag: "path", d: "M9 18h6" },
        { tag: "path", d: "M10 22h4" }
      ],
      "messages-square": [
        {
          tag: "path",
          d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        },
        {
          tag: "path",
          d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"
        }
      ],
      pencil: [
        {
          tag: "path",
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        },
        { tag: "path", d: "m15 5 4 4" }
      ],
      hammer: [
        { tag: "path", d: "m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" },
        { tag: "path", d: "m18 15 4-4" },
        {
          tag: "path",
          d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"
        }
      ],
      "clipboard-check": [
        { tag: "rect", width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" },
        {
          tag: "path",
          d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        },
        { tag: "path", d: "m9 14 2 2 4-4" }
      ],
      "play-circle": [
        {
          tag: "path",
          d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"
        },
        { tag: "circle", cx: "12", cy: "12", r: "10" }
      ],
      "circle-check": [
        { tag: "circle", cx: "12", cy: "12", r: "10" },
        { tag: "path", d: "m9 12 2 2 4-4" }
      ],
      search: [
        { tag: "path", d: "m21 21-4.34-4.34" },
        { tag: "circle", cx: "11", cy: "11", r: "8" }
      ],
      library: [
        { tag: "path", d: "m16 6 4 14" },
        { tag: "path", d: "M12 6v14" },
        { tag: "path", d: "M8 8v12" },
        { tag: "path", d: "M4 4v16" }
      ],
      "notebook-pen": [
        {
          tag: "path",
          d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"
        },
        { tag: "path", d: "M2 6h4" },
        { tag: "path", d: "M2 10h4" },
        { tag: "path", d: "M2 14h4" },
        { tag: "path", d: "M2 18h4" },
        {
          tag: "path",
          d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
        }
      ],
      info: [
        { tag: "circle", cx: "12", cy: "12", r: "10" },
        { tag: "path", d: "M12 16v-4" },
        { tag: "path", d: "M12 8h.01" }
      ],
      target: [
        { tag: "circle", cx: "12", cy: "12", r: "10" },
        { tag: "circle", cx: "12", cy: "12", r: "6" },
        { tag: "circle", cx: "12", cy: "12", r: "2" }
      ],
      puzzle: [
        {
          tag: "path",
          d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"
        }
      ],
      "graduation-cap": [
        {
          tag: "path",
          d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
        },
        { tag: "path", d: "M22 10v6" },
        { tag: "path", d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }
      ],
      "life-buoy": [
        { tag: "circle", cx: "12", cy: "12", r: "10" },
        { tag: "path", d: "m4.93 4.93 4.24 4.24" },
        { tag: "path", d: "m14.83 9.17 4.24-4.24" },
        { tag: "path", d: "m14.83 14.83 4.24 4.24" },
        { tag: "path", d: "m9.17 14.83-4.24 4.24" },
        { tag: "circle", cx: "12", cy: "12", r: "4" }
      ],
      "package-open": [
        { tag: "path", d: "M12 22v-9" },
        {
          tag: "path",
          d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"
        },
        {
          tag: "path",
          d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"
        },
        {
          tag: "path",
          d: "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"
        }
      ],
      "list-checks": [
        { tag: "path", d: "M13 5h8" },
        { tag: "path", d: "M13 12h8" },
        { tag: "path", d: "M13 19h8" },
        { tag: "path", d: "m3 17 2 2 4-4" },
        { tag: "path", d: "m3 7 2 2 4-4" }
      ],
      "map-pin": [
        {
          tag: "path",
          d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        },
        { tag: "circle", cx: "12", cy: "10", r: "3" }
      ],
      "file-text": [
        {
          tag: "path",
          d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        },
        { tag: "path", d: "M14 2v5a1 1 0 0 0 1 1h5" },
        { tag: "path", d: "M10 9H8" },
        { tag: "path", d: "M16 13H8" },
        { tag: "path", d: "M16 17H8" }
      ],
      table: [
        { tag: "path", d: "M12 3v18" },
        { tag: "rect", width: "18", height: "18", x: "3", y: "3", rx: "2" },
        { tag: "path", d: "M3 9h18" },
        { tag: "path", d: "M3 15h18" }
      ],
      settings: [
        {
          tag: "path",
          d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
        },
        { tag: "circle", cx: "12", cy: "12", r: "3" }
      ],
      shuffle: [
        { tag: "path", d: "m18 14 4 4-4 4" },
        { tag: "path", d: "m18 2 4 4-4 4" },
        {
          tag: "path",
          d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"
        },
        { tag: "path", d: "M2 6h1.972a4 4 0 0 1 3.6 2.2" },
        { tag: "path", d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" }
      ],
      layers: [
        {
          tag: "path",
          d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
        },
        {
          tag: "path",
          d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
        },
        {
          tag: "path",
          d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
        }
      ]
    };

    var PEDAGOGICAL_ICONS = {
      READ: "book-open",
      REFLECT: "lightbulb",
      DISCUSS: "messages-square",
      PRACTICE: "pencil",
      CREATE: "hammer",
      EVALUATE: "clipboard-check",
      WATCH: "play-circle",
      CHECK: "circle-check",
      EXAMPLE: "search",
      RESOURCE: "library",
      NOTE: "notebook-pen",
      OVERVIEW: "info",
      PURPOSE: "target",
      ACTIVITIES: "puzzle",
      TIPS: "graduation-cap",
      SUPPORT: "life-buoy",
      MATERIALS: "package-open",
      SCENARIO: "map-pin",
      TABLE: "table",
      TEMPLATE: "file-text",
      METADATA: "settings",
      STRATEGY: "shuffle",
      TASK_CARDS: "layers",
      CHECKLIST: "list-checks",
      GENERIC: "file-text"
    };

    var MATERIAL_SEMANTIC_ICONS = buildMaterialSemanticIcons();

    function buildMaterialSemanticIcons() {
      var map = {};
      var registry = registryLib();
      if (registry && typeof registry.materialSemanticIconMap === "function") {
        return registry.materialSemanticIconMap();
      }
      map.task_card = "TASK_CARDS";
      map.task_cards = "TASK_CARDS";
      map.scenario = "SCENARIO";
      map.scenarios = "SCENARIO";
      map.checklist = "CHECKLIST";
      map.checklists = "CHECKLIST";
      map.prompt_set = "DISCUSS";
      map.prompt = "DISCUSS";
      map.prompts = "DISCUSS";
      map.discussion = "DISCUSS";
      map.template = "TEMPLATE";
      map.templates = "TEMPLATE";
      map.worksheet_template = "TEMPLATE";
      map.table = "TABLE";
      map.worksheet = "TABLE";
      map.analysis_table = "TABLE";
      map.output = "CHECK";
      map.expected_output = "CHECK";
      map.support_note = "NOTE";
      map.support = "SUPPORT";
      map.support_notes = "SUPPORT";
      map.materials = "MATERIALS";
      map.what_to_do = "PRACTICE";
      map.guidance = "PRACTICE";
      map.instructions = "PRACTICE";
      map.metadata = "METADATA";
      map.production = "METADATA";
      map.strategy = "STRATEGY";
      map.strategy_options = "STRATEGY";
      return map;
    }

    var SECTION_SEMANTIC_ICONS = {
      overview: "OVERVIEW",
      learning_purpose: "PURPOSE",
      knowledge_summary: "REFLECT",
      learning_activities: "ACTIVITIES",
      assessment_check: "EVALUATE",
      study_tips: "TIPS",
      support_notes: "SUPPORT"
    };

    var BEAT_LABELS = {
      READ: "Read",
      REFLECT: "Reflect",
      DISCUSS: "Discuss",
      PRACTICE: "Practice",
      CREATE: "Create",
      EVALUATE: "Evaluate",
      WATCH: "Watch",
      CHECK: "Check",
      EXAMPLE: "Example",
      RESOURCE: "Resource",
      NOTE: "Note"
    };

    function normalizeSemanticKey(key) {
      return String(key == null ? "" : key)
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");
    }

    function resolveLucideKey(semanticKey) {
      var key = normalizeSemanticKey(semanticKey);
      return PEDAGOGICAL_ICONS[key] || PEDAGOGICAL_ICONS.GENERIC;
    }

    function normalizeSizeToken(size) {
      var token = String(size == null ? "md" : size).toLowerCase();
      if (token === "small" || token === "sm") return "sm";
      if (token === "large" || token === "lg") return "lg";
      return "md";
    }

    function shapeToSvgMarkup(shapes, escapeHtml) {
      return (Array.isArray(shapes) ? shapes : [])
        .map(function (shape) {
          if (!shape || !shape.tag) return "";
          var attrs = [];
          Object.keys(shape).forEach(function (attr) {
            if (attr === "tag") return;
            attrs.push(attr + '="' + escapeHtml(String(shape[attr])) + '"');
          });
          return "<" + shape.tag + (attrs.length ? " " + attrs.join(" ") : "") + "></" + shape.tag + ">";
        })
        .join("");
    }

    function getIconPresentationCss() {
      return [
        ".util-lucide-icon{display:inline-block;vertical-align:-0.15em;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
        ".util-lucide-icon--sm{width:16px;height:16px}",
        ".util-lucide-icon--md{width:18px;height:18px}",
        ".util-lucide-icon--lg{width:20px;height:20px}",
        ".util-pedagogic-beat{display:inline-flex;align-items:center;gap:.4rem;color:inherit}",
        ".util-pedagogic-beat__label{font-size:.875rem;line-height:1.3}",
        ".util-checklist{margin:8px 0 14px 1.1rem;padding:0;list-style:disc}",
        ".util-checklist>li{margin:0 0 6px;line-height:1.45}"
      ].join("");
    }

    function createRenderer(escapeHtml) {
      function getIcon(semanticKey, size) {
        var lucideKey = resolveLucideKey(semanticKey);
        var shapes = LUCIDE_SHAPES[lucideKey] || LUCIDE_SHAPES["file-text"];
        var sizeToken = normalizeSizeToken(size);
        var px = ICON_SIZE_PX[sizeToken] || ICON_SIZE_PX.md;
        return {
          semanticKey: normalizeSemanticKey(semanticKey),
          lucideKey: lucideKey,
          size: sizeToken,
          width: px,
          height: px,
          shapes: shapes
        };
      }

      function renderIconHtml(semanticKey, options) {
        var opts = options && typeof options === "object" ? options : {};
        var icon = getIcon(semanticKey, opts.size);
        var extraClass = String(opts.className || "").trim();
        var classNames = [
          "util-lucide-icon",
          "util-lucide-icon--" + icon.size,
          "util-material-icon",
          extraClass
        ]
          .filter(Boolean)
          .join(" ");
        return (
          '<svg class="' +
          escapeHtml(classNames) +
          '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' +
          icon.width +
          '" height="' +
          icon.height +
          '" aria-hidden="true" focusable="false">' +
          shapeToSvgMarkup(icon.shapes, escapeHtml) +
          "</svg>"
        );
      }

      function semanticIconForMaterialType(materialType) {
        var registry = registryLib();
        if (registry && typeof registry.semanticIconForMaterialType === "function") {
          return registry.semanticIconForMaterialType(materialType);
        }
        var key = String(materialType || "").toLowerCase().trim();
        return MATERIAL_SEMANTIC_ICONS[key] || "GENERIC";
      }

      function modifierClassForMaterialType(materialType) {
        var registry = registryLib();
        if (registry && typeof registry.modifierClassForMaterialType === "function") {
          return registry.modifierClassForMaterialType(materialType);
        }
        return "util-generic-material-icon";
      }

      function semanticIconForSectionKind(sectionKind) {
        var key = String(sectionKind || "").toLowerCase().trim();
        return SECTION_SEMANTIC_ICONS[key] || "GENERIC";
      }

      function renderMaterialIconHtml(materialType, modifierClass, size) {
        var semantic = semanticIconForMaterialType(materialType);
        return renderIconHtml(semantic, {
          size: size || "md",
          className: String(modifierClass || "").trim()
        });
      }

      function renderSectionIconHtml(sectionKind, modifierClass, size) {
        var semantic = semanticIconForSectionKind(sectionKind);
        return renderIconHtml(semantic, {
          size: size || "md",
          className:
            "util-section-icon " + String(modifierClass || "util-section-icon--default").trim()
        });
      }

      function renderBeat(semanticKey, options) {
        var opts = options && typeof options === "object" ? options : {};
        var key = normalizeSemanticKey(semanticKey);
        var label =
          String(opts.label || "").trim() || BEAT_LABELS[key] || key.charAt(0) + key.slice(1).toLowerCase();
        var beatClass =
          "util-pedagogic-beat util-pedagogic-beat--" + key.toLowerCase().replace(/_/g, "-");
        return (
          '<span class="' +
          escapeHtml(beatClass) +
          '" data-pedagogic-beat="' +
          escapeHtml(key) +
          '">' +
          renderIconHtml(key, { size: opts.size || "sm" }) +
          '<span class="util-pedagogic-beat__label">' +
          escapeHtml(label) +
          "</span></span>"
        );
      }

      return {
        PEDAGOGICAL_ICONS: PEDAGOGICAL_ICONS,
        MATERIAL_SEMANTIC_ICONS: MATERIAL_SEMANTIC_ICONS,
        SECTION_SEMANTIC_ICONS: SECTION_SEMANTIC_ICONS,
        ICON_SIZE_PX: ICON_SIZE_PX,
        getIcon: getIcon,
        renderIconHtml: renderIconHtml,
        renderMaterialIconHtml: renderMaterialIconHtml,
        renderSectionIconHtml: renderSectionIconHtml,
        semanticIconForMaterialType: semanticIconForMaterialType,
        modifierClassForMaterialType: modifierClassForMaterialType,
        semanticIconForSectionKind: semanticIconForSectionKind,
        renderBeat: renderBeat,
        getIconPresentationCss: getIconPresentationCss
      };
    }

    return {
      PEDAGOGICAL_ICONS: PEDAGOGICAL_ICONS,
      MATERIAL_SEMANTIC_ICONS: MATERIAL_SEMANTIC_ICONS,
      SECTION_SEMANTIC_ICONS: SECTION_SEMANTIC_ICONS,
      ICON_SIZE_PX: ICON_SIZE_PX,
      createRenderer: createRenderer,
      getIconPresentationCss: getIconPresentationCss
    };
  }
);
