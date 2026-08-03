"use strict";

/**
 * Build synthetic vNext header variants and measure layout in Chromium.
 * Run from repo root: node tests/fixtures/header-layout-qa/build-and-capture.js
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("../../prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "../../..");
const outDir = __dirname;
const outHtml = path.join(outDir, "header-layout-qa.html");
const outReport = path.join(outDir, "header-layout-qa-report.json");

const OWEN_SUBTITLE =
  "This self-study lesson explores how Wilfred Owen presents the realities of war through poetic technique, voice, and imagery.";
const LONG_SUBTITLE =
  "This self-study lesson explores how Wilfred Owen presents the realities of war through poetic technique, voice, and imagery across Dulce et Decorum Est, Anthem for Doomed Youth, and Exposure, helping you build a transferable close-reading framework for unseen war poetry.";

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractCss(html) {
  const m = String(html).match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : "";
}

function variantBlock(id, title, subtitle, duration) {
  const parts = [
    `<section class="qa-variant" id="${id}" data-qa-variant="${id}">`,
    '<header class="util-learning-header"><div class="util-learning-header__intro">'
  ];
  if (title) parts.push(`<h1 class="util-learning-header__title">${title}</h1>`);
  if (subtitle || duration) {
    parts.push('<p class="util-learning-header__subtitle">');
    if (subtitle) parts.push(subtitle);
    if (duration) {
      if (subtitle) parts.push(" ");
      parts.push(`<span class="util-learning-header__duration">${duration}</span>`);
    }
    parts.push("</p>");
  }
  parts.push("</div></header>");
  parts.push(
    '<div class="util-learner-page util-learner-renderer-vnext"><p class="qa-body-probe">Body reading measure probe paragraph used to compare alignment with the header intro container.</p></div>'
  );
  parts.push("</section>");
  return parts.join("");
}

function buildHtml(css) {
  return [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "<title>Header layout QA</title>",
    `<style>${css}
.qa-variant{border-bottom:1px solid #e2e8f0;padding-bottom:1.5rem;margin-bottom:1.5rem}
.qa-label{font:600 .8rem/1.3 system-ui;color:#64748b;text-align:center;margin:0 0 .5rem}
</style>`,
    "</head>",
    '<body class="util-page-export util-page-export--vnext util-page-export--with-learning-header">',
    '<p class="qa-label">1 short title / short subtitle</p>',
    variantBlock("short", "Heteroscedasticity", "A short overview sentence for layout.", "20 mins."),
    '<p class="qa-label">2 long title</p>',
    variantBlock(
      "long-title",
      "Why Does the Spread of Regression Errors Matter? Understanding Heteroscedasticity",
      "This self-study lesson introduces heteroscedasticity, a common issue in applied economic regression analysis.",
      "60 mins."
    ),
    '<p class="qa-label">3 Owen-like subtitle</p>',
    variantBlock(
      "owen",
      "How does Wilfred Owen present the realities of war?",
      OWEN_SUBTITLE,
      "60 mins."
    ),
    '<p class="qa-label">4 long subtitle</p>',
    variantBlock(
      "long-subtitle",
      "How does Wilfred Owen present the realities of war?",
      LONG_SUBTITLE,
      "90 mins."
    ),
    '<p class="qa-label">5 no duration</p>',
    variantBlock(
      "no-duration",
      "How does Wilfred Owen present the realities of war?",
      OWEN_SUBTITLE,
      ""
    ),
    "</body></html>"
  ].join("\n");
}

async function measure(page, label) {
  return page.evaluate((labelInner) => {
    function box(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        width: Math.round(r.width * 10) / 10,
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        textAlign: cs.textAlign,
        maxWidth: cs.maxWidth,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        whiteSpace: cs.whiteSpace,
        display: cs.display,
        lineClamp: cs.webkitLineClamp || cs.lineClamp,
        textOverflow: cs.textOverflow,
        color: cs.color,
        lineCount: Math.max(1, Math.round(r.height / (parseFloat(cs.lineHeight) || 20)))
      };
    }
    const readingWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--learner-reading-width")
      .trim();
    const variants = [...document.querySelectorAll(".qa-variant")].map((section) => {
      const intro = section.querySelector(".util-learning-header__intro");
      const title = section.querySelector(".util-learning-header__title");
      const subtitle = section.querySelector(".util-learning-header__subtitle");
      const duration = section.querySelector(".util-learning-header__duration");
      const body = section.querySelector(".util-learner-page");
      const introBox = box(intro);
      const bodyBox = box(body);
      return {
        id: section.id,
        intro: introBox,
        title: box(title),
        subtitle: box(subtitle),
        duration: box(duration),
        body: bodyBox,
        introMatchesBodyWidth:
          introBox && bodyBox ? Math.abs(introBox.width - bodyBox.width) < 2 : null,
        introCenteredWithBody:
          introBox && bodyBox ? Math.abs(introBox.left - bodyBox.left) < 2 : null,
        durationPresent: !!duration,
        durationInsideSubtitle: !!(duration && subtitle && subtitle.contains(duration)),
        durationTag: duration ? duration.tagName.toLowerCase() : null,
        emptyDurationPlaceholder: !!(
          duration && !String(duration.textContent || "").trim()
        ),
        subtitleText: subtitle ? subtitle.textContent.trim() : "",
        titleText: title ? title.textContent.trim() : ""
      };
    });
    return {
      label: labelInner,
      vw: window.innerWidth,
      vh: window.innerHeight,
      readingWidthToken: readingWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      variants
    };
  }, label);
}

async function main() {
  const api = loadPrismTestApi();
  const fixture = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"),
      "utf8"
    )
  );
  const rendered = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  if (!rendered || rendered.error) throw new Error(rendered && rendered.error);
  const css = extractCss(rendered.html);
  fs.writeFileSync(outHtml, buildHtml(css), "utf8");
  console.log("Wrote", outHtml);

  let chromium;
  try {
    ({ chromium } = require(path.join(
      repoRoot,
      "tests/fixtures/sequential-nav-qa/node_modules/playwright"
    )));
  } catch {
    try {
      ({ chromium } = require("playwright"));
    } catch {
      console.log("Playwright not available; HTML written for manual inspection.");
      return;
    }
  }

  const browser = await chromium.launch({ headless: true });
  const target = "file://" + outHtml.replace(/\\/g, "/");
  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "w390", width: 390, height: 844 },
    { name: "w320", width: 320, height: 568 },
    { name: "zoom200", width: 720, height: 450, deviceScaleFactor: 2 },
    { name: "text-spacing", width: 390, height: 844, textSpacing: true }
  ];
  const all = [];
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor || 1
    });
    const page = await context.newPage();
    await page.goto(target, { waitUntil: "domcontentloaded" });
    if (vp.textSpacing) {
      await page.addStyleTag({
        content:
          "*{letter-spacing:0.12em!important;word-spacing:0.16em!important;line-height:1.5!important;}"
      });
    }
    all.push(await measure(page, vp.name));
    await page.screenshot({
      path: path.join(outDir, `header-${vp.name}.png`),
      fullPage: true
    });
    await context.close();
  }
  await browser.close();

  fs.writeFileSync(outReport, JSON.stringify(all, null, 2), "utf8");
  console.log("Wrote", outReport);

  const failures = [];
  for (const row of all) {
    if (row.horizontalOverflow) failures.push(`${row.label}: horizontal overflow`);
    for (const v of row.variants) {
      if (v.intro && v.title && v.title.textAlign !== "center") {
        failures.push(`${row.label}/${v.id}: title not centred`);
      }
      if (v.subtitle && v.subtitle.textAlign !== "left") {
        failures.push(`${row.label}/${v.id}: subtitle text-align ${v.subtitle.textAlign}`);
      }
      if (v.duration && v.duration.whiteSpace !== "nowrap") {
        failures.push(`${row.label}/${v.id}: duration not nowrap`);
      }
      if (v.duration && v.duration.display === "block") {
        failures.push(`${row.label}/${v.id}: duration still block`);
      }
      if (v.durationPresent && !v.durationInsideSubtitle) {
        failures.push(`${row.label}/${v.id}: duration not inside subtitle`);
      }
      if (v.durationPresent && v.durationTag !== "span") {
        failures.push(`${row.label}/${v.id}: duration tag ${v.durationTag}`);
      }
      if (v.introMatchesBodyWidth === false && row.vw >= 900) {
        failures.push(
          `${row.label}/${v.id}: intro width ${v.intro.width} != body ${v.body.width}`
        );
      }
      if (v.introCenteredWithBody === false && row.vw >= 900) {
        failures.push(`${row.label}/${v.id}: intro not aligned with body`);
      }
      if (v.subtitle && (v.subtitle.lineClamp && v.subtitle.lineClamp !== "none")) {
        failures.push(`${row.label}/${v.id}: subtitle clamped`);
      }
      if (v.subtitle && v.subtitle.textOverflow === "ellipsis") {
        failures.push(`${row.label}/${v.id}: subtitle ellipsis`);
      }
      if (v.id === "no-duration" && v.durationPresent) {
        failures.push(`${row.label}/${v.id}: duration element present`);
      }
      if (v.emptyDurationPlaceholder) {
        failures.push(`${row.label}/${v.id}: empty duration placeholder`);
      }
      if (row.label === "desktop" && v.id === "owen" && v.subtitle) {
        if (v.subtitle.lineCount < 2 || v.subtitle.lineCount > 3) {
          failures.push(
            `${row.label}/${v.id}: expected ~2-3 subtitle lines, got ${v.subtitle.lineCount} (width ${v.subtitle.width})`
          );
        }
      }
      if (row.label === "desktop" && v.id === "long-title" && v.subtitle) {
        if (v.subtitle.lineCount < 2 || v.subtitle.lineCount > 3) {
          failures.push(
            `${row.label}/${v.id}: expected ~2-3 subtitle lines for fixture overview, got ${v.subtitle.lineCount}`
          );
        }
      }
    }
  }

  const desktop = all.find((r) => r.label === "desktop");
  if (desktop) {
    const owen = desktop.variants.find((v) => v.id === "owen");
    const longTitle = desktop.variants.find((v) => v.id === "long-title");
    console.log("Desktop summary:");
    console.log("  reading-width token:", desktop.readingWidthToken);
    console.log("  intro/title container width:", longTitle?.intro?.width);
    console.log("  body width:", longTitle?.body?.width);
    console.log("  subtitle max-width CSS:", longTitle?.subtitle?.maxWidth);
    console.log("  Owen subtitle width:", owen?.subtitle?.width, "lines:", owen?.subtitle?.lineCount);
    console.log("  title margin-bottom:", longTitle?.title?.marginBottom);
    console.log("  duration margin-top:", longTitle?.duration?.marginTop);
  }

  if (failures.length) {
    console.log("FAILURES:");
    failures.forEach((f) => console.log(" -", f));
    process.exitCode = 1;
  } else {
    console.log("All header layout checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
