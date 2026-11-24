"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const fflate = require("fflate");

const htmlUtils = require("../lib/learner-renderer-vnext/render-html-utils.js");
const vnext = require("../lib/learner-renderer-vnext/index.js");
const learnerPackage = require("../lib/learner-package.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");

const repoRoot = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

function extractAppCssFn(name) {
  const start = appJs.indexOf("function " + name + "(");
  assert.ok(start >= 0, "Expected " + name + " in app.js");
  const end = appJs.indexOf("\n  function ", start + 20);
  const src = appJs.slice(start, end > start ? end : start + 8000);
  // eslint-disable-next-line no-new-func
  return new Function(src + "\nreturn " + name + "();")();
}

function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try {
      return require(candidate);
    } catch (_err) {}
  }
  return null;
}

function startStaticServer(rootDir) {
  const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".json": "application/json; charset=utf-8"
  };
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const cleanPath = decodeURIComponent(String(req.url || "/").split("?")[0]);
      const rel = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
      const filePath = path.resolve(rootDir, rel);
      if (!filePath.startsWith(path.resolve(rootDir)) || !fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({ server, baseUrl: "http://127.0.0.1:" + addr.port + "/" });
    });
  });
}

function buildC01DisclosurePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Interpreting relationships in economic data",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [],
    expository_journey: {
      journey_intent: "Interpret correlation coefficients and scatterplots in economic data."
    },
    sections: [
      {
        section_id: "S1",
        title: "Predicting the correlation before checking the figure",
        order: 1,
        exposition:
          "Before opening the worked check, estimate the direction and strength of the association.\n\n" +
          "<details> <summary>Reveal the coefficient and worked interpretation</summary>\n\n" +
          "The sample correlation is $r = 0.96$, which lies near the upper bound of:\n\n" +
          "$$-1 \\leq r \\leq 1$$\n\n" +
          "- **Strong positive** linear association.\n" +
          "- Typical tuition differences of $500 to $1,200 remain ordinary currency.\n" +
          "- Untrusted markup like <script>alert(1)</script> and <img src=x onerror=alert(1)> stays escaped.\n\n" +
          "</details>\n\n" +
          "<details open>\n" +
          "<summary>Check an authored open disclosure</summary>\n" +
          "Authored open attributes must still default closed.\n" +
          "</details>\n\n" +
          "Inline code like `<details><summary>Literal</summary></details>` remains literal code.",
        materials: []
      }
    ],
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials"]
    }
  };
}

function buildC02TablePresentationPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "What does a causal claim actually mean?",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [],
    expository_journey: {
      journey_intent: "Distinguish association from causation in economic data."
    },
    sections: [
      {
        section_id: "S1",
        title: "One relationship, two different claims",
        order: 1,
        exposition: "Examine the scatterplot and accompanying table.",
        materials: [
          {
            material_id: "M01",
            commission_id: "XM01",
            section_id: "S1",
            kind: "Empirical scatterplot with accessible data table",
            body: {
              title: "Education and annual earnings",
              context: "Eight illustrative employed adults observed during the same year.",
              source_note:
                "These data have been constructed for educational purposes and are not findings from an actual economic study.",
              scatterplot: {
                title: "Education and annual earnings",
                x_axis: {
                  label: "Completed years of formal education (years)",
                  minimum: 10,
                  maximum: 19,
                  tick_interval: 1,
                  scale: "linear"
                },
                y_axis: {
                  label: "Annual gross employment earnings (thousands of GBP)",
                  minimum: 0,
                  maximum: 50,
                  tick_interval: 10,
                  scale: "linear"
                },
                observations: [
                  { person: "P01", x: 11, y: 22 },
                  { person: "P02", x: 12, y: 26 },
                  { person: "P03", x: 18, y: 44 }
                ],
                caption: "Each point represents one person."
              },
              table: {
                caption:
                  "Completed years of formal education and annual gross employment earnings for eight illustrative employed adults.",
                columns: [
                  "Person",
                  "Completed years of formal education (years)",
                  "Annual gross employment earnings (thousands of GBP)"
                ],
                rows: [
                  ["P01", 11, 22],
                  ["P02", 12, 26],
                  ["P03", 18, 44]
                ]
              }
            }
          }
        ]
      },
      {
        section_id: "S4",
        title: "Matching the conclusion to the evidence",
        order: 4,
        exposition: "Compare household disposable income and consumption expenditure.",
        materials: [
          {
            material_id: "M03",
            commission_id: "XM03",
            section_id: "S4",
            kind: "Accessible economic evidence table",
            body: {
              title: "Household disposable income and consumption expenditure",
              context: "Eight illustrative households observed during the same month.",
              table: {
                caption:
                  "Monthly household disposable income and monthly household consumption expenditure for eight illustrative households.",
                columns: [
                  "Household",
                  "Monthly household disposable income (GBP)",
                  "Monthly household consumption expenditure (GBP)"
                ],
                rows: [
                  ["H01", 1500, 1400],
                  ["H02", 2000, 1900],
                  ["H03", 2500, 2250]
                ]
              },
              companion_text:
                "Households with higher monthly disposable income also tend to record higher monthly consumption expenditure.",
              duplicate_caption_echo:
                "Monthly household disposable income and monthly household consumption expenditure for eight illustrative households.",
              source_note: "Illustrative data constructed for educational purposes."
            }
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials"]
    }
  };
}

function buildWideTablePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Wide comparison matrix",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Seven-column comparison",
        exposition: "Review all seven columns.",
        materials: [
          {
            material_id: "M-WIDE",
            kind: "comparison",
            title: "Policy comparison matrix",
            body: {
              columns: [
                "Label",
                "Premises",
                "Conclusion",
                "Test question",
                "Counterexample",
                "Result",
                "Reason"
              ],
              rows: [
                [
                  "Case A",
                  "All P are Q",
                  "This is Q",
                  "Is every P really Q?",
                  "A P that is not Q",
                  "Invalid",
                  "One counterexample defeats a universal claim."
                ]
              ]
            }
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials"]
    }
  };
}

test("C01 Defect 1: paired <details><summary> renders as closed accessible disclosure with Markdown, math, and strict HTML sanitisation", () => {
  const page = buildC01DisclosurePage();
  const rendered = vnext.renderLearnerPageHtml(page);
  assert.ok(rendered && rendered.html);
  const html = String(rendered.html || "");

  // Real accessible disclosures, always closed by default (no `open` attribute)
  const detailsOpenTags = html.match(/<details\b[^>]*>/gi) || [];
  assert.equal(detailsOpenTags.length, 2, "Expected two rendered disclosures");
  for (const tag of detailsOpenTags) {
    assert.match(tag, /class="util-composition-reveal util-prose-measure"/);
    assert.doesNotMatch(tag, /\bopen\b/i, "Disclosures must default closed");
  }

  // Summary label preserved; no escaped <details>/<summary> leakage outside code span
  assert.match(html, /<summary>Reveal the coefficient and worked interpretation<\/summary>/);
  assert.match(html, /<summary>Check an authored open disclosure<\/summary>/);
  assert.match(html, /<code>&lt;details&gt;&lt;summary&gt;Literal&lt;\/summary&gt;&lt;\/details&gt;<\/code>/);

  // Markdown + inline/display math + currency preserved inside disclosure body
  assert.match(html, /\\\(r = 0\.96\\\)/);
  assert.match(html, /\\\[-1 \\leq r \\leq 1\\\]/);
  assert.match(html, /<strong>Strong positive<\/strong>/);
  assert.match(html, /\$500 to \$1,200/);

  // Arbitrary HTML remains strictly sanitised
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/i);
  assert.doesNotMatch(html, /<img\s+src=x/i);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);

  // Unclosed <details> fails closed as escaped text
  const unclosed = htmlUtils.renderMarkdownBlock(
    "<details><summary>Broken</summary>No closing tag"
  );
  assert.doesNotMatch(unclosed, /<details\b/i);
  assert.match(unclosed, /&lt;details&gt;/);
});

test("C02 Defect 2: table companion prose omits schema labels, renders source attribution as restrained source note, and avoids duplicate captions", () => {
  const page = buildC02TablePresentationPage();
  const rendered = vnext.renderLearnerPageHtml(page);
  assert.ok(rendered && rendered.html);
  const html = String(rendered.html || "");

  // No schema-derived labels exposed
  assert.doesNotMatch(html, /<dt>\s*Context\s*<\/dt>/i);
  assert.doesNotMatch(html, /<dt>\s*Source note\s*<\/dt>/i);
  assert.doesNotMatch(html, /<dt>\s*Companion text\s*<\/dt>/i);
  assert.doesNotMatch(html, /<strong>\s*(Context|Source note|Companion text)\s*<\/strong>/i);

  // Context renders as ordinary prose BEFORE the table; companion text AFTER the table
  const m03Start = html.indexOf('data-material-id="M03"');
  assert.ok(m03Start >= 0, "Expected M03 material");
  const m03Slice = html.slice(m03Start, html.indexOf("</article>", m03Start) + 10);

  const contextPos = m03Slice.indexOf(
    "Eight illustrative households observed during the same month."
  );
  const tablePos = m03Slice.indexOf("<table ");
  const companionPos = m03Slice.indexOf(
    "Households with higher monthly disposable income also tend to record higher monthly consumption expenditure."
  );
  const sourceNotePos = m03Slice.indexOf(
    '<p class="util-exposition-source-note"><small>Illustrative data constructed for educational purposes.</small></p>'
  );

  assert.ok(contextPos > 0 && tablePos > contextPos, "Context prose should precede the table");
  assert.ok(companionPos > tablePos, "Companion prose should follow the table");
  assert.ok(sourceNotePos > companionPos, "Restrained source note should follow companion prose");

  // Duplicate caption echo is suppressed (caption appears once inside <caption>)
  const captionText =
    "Monthly household disposable income and monthly household consumption expenditure for eight illustrative households.";
  const captionOccurrences = m03Slice.split(captionText).length - 1;
  assert.equal(captionOccurrences, 1, "Table caption should not be repeated in companion prose");

  // Deterministic inline SVG scatterplot in M01 remains intact
  assert.match(html, /<svg\b[^>]*class="util-scatterplot-svg"/);
  assert.match(html, /<table class="util-exposition-structured-table">/);
});

test("C02 Defect 3: simple 3-column tables omit breakout class while genuinely wide tables retain breakout", () => {
  const c02Html = String(vnext.renderLearnerPageHtml(buildC02TablePresentationPage()).html || "");
  assert.match(c02Html, /util-exposition-table-scroll/);
  assert.doesNotMatch(
    c02Html,
    /util-exposition-table-breakout/,
    "Simple 3-column C02 tables should not break out beyond the reading column"
  );

  const wideHtml = String(vnext.renderLearnerPageHtml(buildWideTablePage()).html || "");
  assert.match(
    wideHtml,
    /util-exposition-table-scroll util-exposition-table-breakout/,
    "Genuinely wide 7-column tables must retain breakout handling"
  );
});

test(
  "Browser acceptance: C01 disclosure opens cleanly with offline MathJax and C02 3-column tables stay within reading column",
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright) {
      t.skip("Playwright not installed");
      return;
    }

    const expositoryCss = extractAppCssFn("getUtilityExpositoryPublishingCss");
    const baseCss =
      ":root{--learner-reading-width:70ch;--learner-page-gutter:1rem;--learner-space-1:.5rem;--learner-space-2:.75rem;--learner-space-3:1rem;--learner-space-4:1.5rem;--learner-space-5:2rem;--learner-text-sm:.875rem;--learner-text-base:1rem;--learner-text-md:1.0625rem;--learner-text-title:1.75rem;--learner-leading-tight:1.25;--learner-leading-heading:1.35;--learner-leading-body:1.65}" +
      "body{margin:0;padding:1rem;font-family:system-ui,sans-serif}" +
      ".util-learner-page{width:min(100%,var(--learner-reading-width));margin:0 auto}" +
      ".util-prose-measure{max-width:var(--learner-reading-width)}" +
      expositoryCss;

    // 1) Package C01 with offline MathJax and verify closed-by-default disclosure + MathJax typesetting
    const c01Page = buildC01DisclosurePage();
    const c01Render = vnext.renderLearnerPageHtml(c01Page);
    const c01FullHtml =
      "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\" />" +
      "<title>" + c01Page.title + "</title>" +
      "<style>" + baseCss + "</style>" +
      '<script>window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]],processEscapes:true},options:{skipHtmlTags:["script","noscript","style","textarea","pre","code"]}};</script>' +
      '<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js"></script>' +
      "</head><body class=\"util-page-export util-page-export--vnext util-page-export--expository\">" +
      c01Render.html +
      "</body></html>";
    const c01Built = learnerPackage.buildLearnerPackage({
      html: c01FullHtml,
      title: c01Page.title,
      repoRoot
    });
    assert.equal(c01Built.ok, true, c01Built.error && c01Built.error.message);
    const c01Dir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-c01-disc-"));
    fs.writeFileSync(path.join(c01Dir, "index.html"), c01Built.package.html, "utf8");
    c01Built.package.assets.forEach((a) => {
      const dest = path.join(c01Dir, a.path);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.isBuffer(a.bytes) ? a.bytes : Buffer.from(a.bytes));
    });

    // 2) Package C02 standalone + unified Learning Journey to verify 3-column table width
    const c02Page = buildC02TablePresentationPage();
    const c02Render = vnext.renderLearnerPageHtml(c02Page);
    const c02FullHtml =
      "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\" />" +
      "<title>" + c02Page.title + "</title>" +
      "<style>" + baseCss + "</style>" +
      "</head><body class=\"util-page-export util-page-export--vnext util-page-export--expository\">" +
      c02Render.html +
      "</body></html>";
    const c02Dir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-c02-tbl-"));
    fs.writeFileSync(path.join(c02Dir, "index.html"), c02FullHtml, "utf8");

    const journey = ljDesign.buildLearningJourneyDesignPageFixture({
      title: "Economics causal reasoning journey",
      journeyIntent: "Interpret economic relationships and evaluate causal claims.",
      components: [
        {
          commissionId: "c02",
          title: c02Page.title,
          productId: "expository"
        }
      ]
    });
    const ljAssembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c02",
          title: c02Page.title,
          productId: "expository",
          fragmentHtml: c02Render.html,
          stylesCss: baseCss
        }
      ],
      fflate,
      runtimeScript
    });
    assert.equal(ljAssembled.ok, true, ljAssembled.error && ljAssembled.error.message);
    const ljFiles = fflate.unzipSync(ljAssembled.bytes);
    const ljDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-lj-tbl-"));
    for (const [rel, bytes] of Object.entries(ljFiles)) {
      const dest = path.join(ljDir, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(bytes));
    }

    const srv1 = await startStaticServer(c01Dir);
    const srv2 = await startStaticServer(c02Dir);
    const srv3 = await startStaticServer(ljDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      srv1.server.close();
      srv2.server.close();
      srv3.server.close();
      fs.rmSync(c01Dir, { recursive: true, force: true });
      fs.rmSync(c02Dir, { recursive: true, force: true });
      fs.rmSync(ljDir, { recursive: true, force: true });
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    try {
      // C01 disclosure + MathJax check (offline, aborting any CDN)
      const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await ctx1.route("**/*", async (route) => {
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/i.test(route.request().url())) {
          await route.abort();
          return;
        }
        await route.continue();
      });
      const page1 = await ctx1.newPage();
      await page1.goto(srv1.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page1.waitForFunction(() => document.querySelectorAll("mjx-container").length >= 2, {
        timeout: 15000
      });
      const beforeOpen = await page1.evaluate(() => {
        const d = document.querySelector("details.util-composition-reveal");
        return {
          exists: !!d,
          open: d ? d.open : null,
          summaryText: d && d.querySelector("summary") ? d.querySelector("summary").textContent.trim() : ""
        };
      });
      assert.equal(beforeOpen.exists, true);
      assert.equal(beforeOpen.open, false, "Disclosure must start closed");
      assert.equal(beforeOpen.summaryText, "Reveal the coefficient and worked interpretation");

      await page1.locator("details.util-composition-reveal summary").first().click();
      const afterOpen = await page1.evaluate(() => {
        const d = document.querySelector("details.util-composition-reveal");
        const bodyText = d ? d.querySelector(".util-composition-reveal__body").textContent : "";
        return {
          open: d ? d.open : false,
          mjxCount: d ? d.querySelectorAll("mjx-container").length : 0,
          hasRawDollars: bodyText.includes("$$"),
          hasCurrency: bodyText.includes("$500 to $1,200")
        };
      });
      assert.equal(afterOpen.open, true, "Clicking summary opens disclosure");
      assert.ok(afterOpen.mjxCount >= 2, "Inline and display math typeset inside disclosure");
      assert.equal(afterOpen.hasRawDollars, false, "No raw $$ inside disclosure");
      assert.equal(afterOpen.hasCurrency, true, "Currency preserved inside disclosure");
      await ctx1.close();

      // C02 standalone 3-column table width check at 1280x800
      const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await page2.goto(srv2.baseUrl, { waitUntil: "load" });
      const c02Widths = await page2.evaluate(() => {
        const main = document.querySelector("main.util-learner-page");
        const mainRect = main.getBoundingClientRect();
        const wraps = Array.from(document.querySelectorAll(".util-exposition-table-scroll"));
        return {
          mainWidth: mainRect.width,
          tables: wraps.map((w) => ({
            width: w.getBoundingClientRect().width,
            overflowX: getComputedStyle(w).overflowX,
            hasBreakout: w.classList.contains("util-exposition-table-breakout")
          }))
        };
      });
      assert.ok(c02Widths.tables.length >= 2, "Expected M01 and M03 tables");
      for (const tbl of c02Widths.tables) {
        assert.equal(tbl.hasBreakout, false);
        assert.equal(tbl.overflowX, "auto");
        assert.ok(
          tbl.width <= c02Widths.mainWidth + 2,
          `Expected ordinary 3-column table (${tbl.width}px) to stay within reading column (${c02Widths.mainWidth}px)`
        );
      }
      await page2.close();

      // C02 unified Learning Journey 3-column table width check at 1280x800
      const page3 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await page3.goto(srv3.baseUrl, { waitUntil: "load" });
      await page3.locator('[data-lj-nav-id="c02"]').click();
      await page3.waitForSelector(".util-exposition-table-scroll");
      const ljWidths = await page3.evaluate(() => {
        const pageEl = document.querySelector("#lj-shell-main .util-learner-page");
        const pageWidth = pageEl.getBoundingClientRect().width;
        const wraps = Array.from(
          document.querySelectorAll("#lj-shell-main .util-exposition-table-scroll")
        );
        return {
          pageWidth,
          tables: wraps.map((w) => ({
            width: w.getBoundingClientRect().width,
            hasBreakout: w.classList.contains("util-exposition-table-breakout")
          }))
        };
      });
      assert.ok(ljWidths.tables.length >= 2);
      for (const tbl of ljWidths.tables) {
        assert.equal(tbl.hasBreakout, false);
        assert.ok(
          tbl.width <= ljWidths.pageWidth + 2,
          `Unified journey 3-column table (${tbl.width}px) should stay within reading column (${ljWidths.pageWidth}px)`
        );
      }
      await page3.close();
    } finally {
      await browser.close();
      srv1.server.close();
      srv2.server.close();
      srv3.server.close();
      fs.rmSync(c01Dir, { recursive: true, force: true });
      fs.rmSync(c02Dir, { recursive: true, force: true });
      fs.rmSync(ljDir, { recursive: true, force: true });
    }
  }
);
