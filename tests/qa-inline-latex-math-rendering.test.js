"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const fflate = require("fflate");

const mathProtect = require("../lib/math-delimiter-markdown-protection.js");
const htmlUtils = require("../lib/learner-renderer-vnext/render-html-utils.js");
const vnext = require("../lib/learner-renderer-vnext/index.js");
const learnerPackage = require("../lib/learner-package.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const mathJaxAssets = require("../lib/learner-renderer-vnext/mathjax-package-assets.js");

const repoRoot = path.resolve(__dirname, "..");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

const PLAYWRIGHT_CANDIDATES = [
  path.join(__dirname, "fixtures", "sequential-nav-qa", "node_modules", "playwright"),
  "playwright"
];

function loadPlaywright() {
  for (const candidate of PLAYWRIGHT_CANDIDATES) {
    try {
      return require(candidate);
    } catch (_err) {}
  }
  return null;
}

function writeZipToDir(bytes, rootDir) {
  const files = fflate.unzipSync(bytes);
  Object.keys(files).forEach((entry) => {
    const outPath = path.join(rootDir, entry);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, files[entry]);
  });
}

function contentTypeFor(filePath) {
  if (/\.html?$/i.test(filePath)) return "text/html; charset=utf-8";
  if (/\.js$/i.test(filePath)) return "text/javascript; charset=utf-8";
  if (/\.css$/i.test(filePath)) return "text/css; charset=utf-8";
  if (/\.woff2?$/i.test(filePath)) return "font/woff2";
  return "application/octet-stream";
}

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(String((req.url || "/").split("?")[0] || "/"));
    const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "");
    const filePath = path.normalize(path.join(rootDir, relative));
    if (!filePath.startsWith(path.normalize(rootDir))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
    res.end(fs.readFileSync(filePath));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: "http://127.0.0.1:" + address.port + "/"
      });
    });
  });
}

function buildStandaloneMathJaxHead() {
  return [
    "<!-- " + mathJaxAssets.MATHJAX_EXPORT_BOOTSTRAP_MARKER + " -->",
    "<script>",
    "(function(){",
    "  var cfg = window.MathJax && typeof window.MathJax === 'object' ? window.MathJax : {};",
    "  cfg.tex = Object.assign({}, cfg.tex || {}, {",
    "    inlineMath: [['\\\\(','\\\\)']],",
    "    displayMath: [['\\\\[','\\\\]']]",
    "  });",
    "  window.MathJax = cfg;",
    "})();",
    "</script>",
    '<script id="' +
      mathJaxAssets.MATHJAX_EXPORT_LOADER_ID +
      '" async src="' +
      mathJaxAssets.MATHJAX_CDN_LOADER_SRC +
      '"></script>'
  ].join("");
}

test("Inline statistical notation normalizes to canonical \\(...\\) without corrupting subscripts or operators", () => {
  const cases = [
    ["The correlation $r$ is strong.", "The correlation \\(r\\) is strong."],
    ["We found $r=0.96$ across regions.", "We found \\(r=0.96\\) across regions."],
    ["Negative slope $r = -0.82$ and $p < 0.05$.", "Negative slope \\(r = -0.82\\) and \\(p < 0.05\\)."],
    ["Variance $R^2 = 0.92$, terms $x_1 + x_2$, mean $\\bar{x}$, Greek $\\alpha = 0.05$.",
     "Variance \\(R^2 = 0.92\\), terms \\(x_1 + x_2\\), mean \\(\\bar{x}\\), Greek \\(\\alpha = 0.05\\)."],
    ["Existing \\(n = 24\\) and \\[\\sum_{i=1}^n x_i\\] stay intact.",
     "Existing \\(n = 24\\) and \\[\\sum_{i=1}^n x_i\\] stay intact."]
  ];
  for (const [input, expected] of cases) {
    assert.equal(mathProtect.normalizeInlineDollarMath(input), expected);
  }
});

test("Economics currency notation is preserved verbatim, including alongside inline math in the same paragraph", () => {
  const samples = [
    ["Ice cream sales rose from $500 to $1,200 when temperatures increased, while $r = 0.96$.",
     "Ice cream sales rose from $500 to $1,200 when temperatures increased, while \\(r = 0.96\\)."],
    ["A household earning $40,000 spends $12,000 on housing ($r = 0.82$, $R^2 = 0.67$).",
     "A household earning $40,000 spends $12,000 on housing (\\(r = 0.82\\), \\(R^2 = 0.67\\))."],
    ["Prices ranged from $10-$20 (or $10.50–$25.00), with $p < 0.05$.",
     "Prices ranged from $10-$20 (or $10.50–$25.00), with \\(p < 0.05\\)."],
    ["Costs $50 ($r = 0.96$) and revenue grew from $5M to $10M.",
     "Costs $50 (\\(r = 0.96\\)) and revenue grew from $5M to $10M."],
    ["Profit is $500 + $200 = $700 with no maths here.",
     "Profit is $500 + $200 = $700 with no maths here."],
    ["Single value $100 and US$50 remain untouched.",
     "Single value $100 and US$50 remain untouched."]
  ];
  for (const [input, expected] of samples) {
    assert.equal(mathProtect.normalizeInlineDollarMath(input), expected);
  }
});

test("Markdown inline/block rendering preserves Markdown, code spans, HTML escaping, and subscripts inside math", () => {
  const md =
    "**Important:** compute $x_1 + x_2$ when $p < 0.05$, keep *emphasis* and `echo $r`, and escape <script>alert(1)</script>.";
  const html = htmlUtils.renderMarkdownInline(md);
  assert.match(html, /<strong>Important:<\/strong>/);
  assert.match(html, /\\\(x_1 \+ x_2\\\)/);
  assert.doesNotMatch(html, /<em>1 \+ x<\/em>/);
  assert.match(html, /\\\(p &lt; 0\.05\\\)/);
  assert.match(html, /<em>emphasis<\/em>/);
  assert.match(html, /<code>echo \$r<\/code>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/i);
});

test("Learning Journey exposition Markdown renders inline math alongside currency and headings", () => {
  const html = ljDesign.renderExpositionMarkdown(
    "## Economic context\n\nSales rose from $500 to $1,200 with **$r = 0.96$** and $x_1 + x_2$.",
    { baseHeadingLevel: 3 }
  );
  assert.match(html, /<h3>Economic context<\/h3>/);
  assert.match(html, /from \$500 to \$1,200/);
  assert.match(html, /<strong>\\\(r = 0\.96\\\)<\/strong>/);
  assert.match(html, /\\\(x_1 \+ x_2\\\)/);
  assert.doesNotMatch(html, /<em>1 \+ x<\/em>/);
});

test(
  "Browser acceptance: standalone Practice/Interactive export typesets inline $r$, $r=0.96$, display math, and dynamic assessment rationale offline while preserving currency",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const pageJson = {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Interpreting relationships in economic data",
      activities: [],
      learning_outcomes: [
        {
          id: "LO1",
          statement: "Interpret $r$ and $r=0.96$ alongside economic spending from $500 to $1,200."
        }
      ],
      sections: [
        {
          section_id: "overview",
          title: "Economic Scatterplots",
          exposition:
            "When household spending rises from $500 to $1,200, the sample correlation $r$ reaches $r=0.96$ with $p < 0.05$, $x_1 + x_2$, and $\\alpha = 0.05$. Existing \\(n = 24\\) and display math:\n\n\\[\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i\\]"
        }
      ],
      assessment_check: {
        items: [
          {
            item_type: "mcq",
            stem: "What does $r=0.96$ indicate when spending moves from $500 to $1,200?",
            options: [
              "A strong positive linear association ($r > 0.9$)",
              "Direct proof of causation"
            ],
            correct_answer: "A strong positive linear association ($r > 0.9$)",
            explanation:
              "A value of $r = 0.96$ shows a strong positive linear association across the $500 to $1,200 range, without proving causation."
          }
        ]
      }
    };

    const rendered = vnext.renderLearnerPageHtml(pageJson, { pageKey: "qa-inline-math-standalone" });
    assert.ok(rendered && rendered.html);
    assert.equal(mathJaxAssets.pageHtmlNeedsMathJaxDisplay(rendered.html), true);

    const fullHtml = [
      "<!doctype html><html><head><meta charset='utf-8'><title>Math QA</title>",
      buildStandaloneMathJaxHead(),
      "</head><body>",
      '<div id="host">' + rendered.html + "</div>",
      '<script src="runtime.js"></script>',
      "<script>",
      "(function(){var h=document.getElementById('host');if(h&&window.PRISM_LEARNER_RENDERER_VNEXT&&window.PRISM_LEARNER_RENDERER_VNEXT.mountLearnerResource){window.PRISM_LEARNER_RENDERER_VNEXT.mountLearnerResource(h,{html:h.innerHTML});}})();",
      "</script>",
      "</body></html>"
    ].join("");

    const built = learnerPackage.buildLearnerPackage({
      html: fullHtml,
      title: "Interpreting relationships in economic data",
      repoRoot
    });
    assert.equal(built.ok, true, built.error && built.error.message);
    assert.ok(built.package.assets.some((a) => a.path === "lib/mathjax/es5/tex-chtml.js"));

    const zipEntries = {
      "index.html": Buffer.from(built.package.html, "utf8"),
      "runtime.js": Buffer.from(runtimeScript, "utf8")
    };
    built.package.assets.forEach((a) => {
      zipEntries[a.path] = Buffer.isBuffer(a.bytes) ? a.bytes : Buffer.from(a.bytes);
    });
    const zipBytes = fflate.zipSync(zipEntries);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-inline-math-standalone-"));
    writeZipToDir(zipBytes, tempDir);
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    const cdnRequests = [];
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.route("**/*", async (route) => {
        const url = route.request().url();
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/i.test(url)) {
          cdnRequests.push(url);
          await route.abort();
          return;
        }
        await route.continue();
      });

      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", (e) => pageErrors.push(String(e && e.message || e)));
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

      // Wait for MathJax to typeset the page
      try {
        await page.waitForFunction(
          () => document.querySelectorAll("mjx-container").length >= 1,
          null,
          { timeout: 10000 }
        );
      } catch (waitErr) {
        const diag = await page.evaluate(() => ({
          hasMJ: !!window.MathJax,
          hasTypeset: !!(window.MathJax && window.MathJax.typesetPromise),
          mjx: document.querySelectorAll("mjx-container").length,
          head: document.head.innerHTML.slice(0, 400),
          body: document.body.innerText.slice(0, 400)
        }));
        throw new Error("MathJax did not typeset: " + JSON.stringify({ diag, pageErrors }));
      }
      await page.waitForTimeout(400);

      const staticCheck = await page.evaluate(() => {
        const text = document.body.innerText || "";
        return {
          mjxCount: document.querySelectorAll("mjx-container").length,
          hasLiteralDollarR: /\$r\b|\$r=0\.96\$|\$p\s*<|\$x_1|\$\\alpha/.test(text),
          hasRawParenDelims: /\\\(|\\\[/.test(text),
          has500: text.includes("$500"),
          has1200: text.includes("$1,200")
        };
      });

      assert.ok(staticCheck.mjxCount >= 7, "expected >=7 MathJax containers, got " + staticCheck.mjxCount);
      assert.equal(staticCheck.hasLiteralDollarR, false, "no literal $r$ / $r=0.96$ in rendered text");
      assert.equal(staticCheck.hasRawParenDelims, false, "no raw \\( or \\[ in rendered text");
      assert.equal(staticCheck.has500, true, "currency $500 must be preserved");
      assert.equal(staticCheck.has1200, true, "currency $1,200 must be preserved");

      // Now trigger dynamically inserted assessment rationale
      const checkBtn = page.locator("[data-assessment-check]").first();
      if (!(await checkBtn.isVisible())) {
        const nextBtn = page.locator('[data-seq-nav-action="next"], .util-seq-nav__btn--next').first();
        if (await nextBtn.count()) {
          await nextBtn.click();
        } else {
          await page.evaluate(() => {
            document.querySelectorAll("[hidden]").forEach((el) => {
              if (el.querySelector && el.querySelector("[data-assessment-check]")) {
                el.hidden = false;
                el.removeAttribute("hidden");
              }
            });
          });
        }
      }
      const firstRadio = page.locator('.util-assessment-item--interactive input[type="radio"]').first();
      await firstRadio.check();
      await checkBtn.click();

      try {
        await page.waitForFunction(
          () => {
            const res = document.querySelector("[data-assessment-result]");
            return res && !res.hidden && res.querySelectorAll("mjx-container").length >= 1;
          },
          null,
          { timeout: 5000 }
        );
      } catch (_err) {
        const resDiag = await page.evaluate(() => {
          const res = document.querySelector("[data-assessment-result]");
          const item = document.querySelector(".util-assessment-item--interactive");
          return {
            found: !!res,
            hidden: res ? res.hidden : null,
            html: res ? res.innerHTML : null,
            rationaleAttr: item ? item.getAttribute("data-assessment-rationale") : null
          };
        });
        throw new Error("Dynamic rationale did not typeset: " + JSON.stringify(resDiag));
      }

      const dynamicCheck = await page.evaluate(() => {
        const res = document.querySelector("[data-assessment-result]");
        const text = res ? res.innerText || "" : "";
        return {
          mjxCount: res ? res.querySelectorAll("mjx-container").length : 0,
          hasLiteralDollarR: /\$r\s*=/.test(text),
          has500: text.includes("$500"),
          has1200: text.includes("$1,200")
        };
      });

      assert.ok(dynamicCheck.mjxCount >= 1, "dynamically inserted rationale must be typeset by MathJax");
      assert.equal(dynamicCheck.hasLiteralDollarR, false, "no literal $r = 0.96$ in dynamic rationale");
      assert.equal(dynamicCheck.has500, true, "currency $500 preserved in dynamic rationale");
      assert.equal(dynamicCheck.has1200, true, "currency $1,200 preserved in dynamic rationale");
      assert.equal(cdnRequests.length, 0, "zero CDN requests allowed");
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);

test(
  "Browser acceptance: unified Learning Journey export typesets inline $r$ and $r=0.96$ in both Overview and mounted Practice component offline while preserving currency",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const journey = ljDesign.buildLearningJourneyDesignPageFixture({
      title: "Correlation and Causation",
      sections: [
        {
          section_id: "journey_intro",
          title: "Overview",
          order: 1,
          exposition:
            "Explore why spending changes from $500 to $1,200 can show $r=0.96$ without proving causation."
        },
        {
          section_id: "s1",
          title: "Interpreting relationships in economic data",
          order: 2,
          exposition: "Practice interpreting $r$."
        }
      ],
      commissions: [
        {
          commission_id: "c1",
          section_id: "s1",
          order: 1,
          title: "Interpreting relationships in economic data",
          product_id: "practice",
          status: "supported",
          specification_text: "Interpret scatterplots and $r$."
        }
      ]
    });
    assert.equal(journey.ok, true);

    const practiceRendered = vnext.renderLearnerPageHtml(
      {
        artifact_type: "page",
        schema_version: "2.0.0",
        title: "Interpreting relationships in economic data",
        activities: [],
        sections: [
          {
            section_id: "task",
            title: "Reading the scatterplot",
            exposition:
              "Spending rose from $500 to $1,200 while correlation $r$ was $r=0.96$ ($R^2 = 0.92$)."
          }
        ]
      },
      { pageKey: "v1::qa-lj-math::c1" }
    );

    const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
      page: journey.page,
      constituents: [
        {
          commissionId: "c1",
          title: "Interpreting relationships in economic data",
          productId: "practice",
          fragmentHtml: practiceRendered.html
        }
      ],
      fflate,
      runtimeScript
    });
    assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
    assert.equal(assembled.mathRequirements.needsMathJax, true);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-inline-math-lj-"));
    writeZipToDir(assembled.bytes, tempDir);
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    const cdnRequests = [];
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.route("**/*", async (route) => {
        const url = route.request().url();
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/i.test(url)) {
          cdnRequests.push(url);
          await route.abort();
          return;
        }
        await route.continue();
      });

      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => document.querySelectorAll("#lj-shell-main mjx-container").length >= 1,
        { timeout: 20000 }
      );

      const overviewCheck = await page.evaluate(() => {
        const text = document.getElementById("lj-shell-main").innerText || "";
        return {
          mjxCount: document.querySelectorAll("#lj-shell-main mjx-container").length,
          hasLiteralDollarR: /\$r=0\.96\$|\$r\$/.test(text),
          has500: text.includes("$500"),
          has1200: text.includes("$1,200")
        };
      });
      assert.ok(overviewCheck.mjxCount >= 1);
      assert.equal(overviewCheck.hasLiteralDollarR, false);
      assert.equal(overviewCheck.has500, true);
      assert.equal(overviewCheck.has1200, true);

      // Navigate to Practice component C01
      await page.locator('[data-lj-nav-id="c1"]').click();
      await page.waitForFunction(() => window.__PRISM_LJ_SHELL__.currentId === "c1");
      await page.waitForFunction(
        () => document.querySelectorAll("#lj-shell-main mjx-container").length >= 3,
        { timeout: 20000 }
      );

      const c1Check = await page.evaluate(() => {
        const text = document.getElementById("lj-shell-main").innerText || "";
        return {
          mjxCount: document.querySelectorAll("#lj-shell-main mjx-container").length,
          hasLiteralDollarR: /\$r\$|\$r=0\.96\$|\$R\^2/.test(text),
          has500: text.includes("$500"),
          has1200: text.includes("$1,200")
        };
      });
      assert.ok(c1Check.mjxCount >= 3, "expected >=3 MathJax expressions in C01, got " + c1Check.mjxCount);
      assert.equal(c1Check.hasLiteralDollarR, false);
      assert.equal(c1Check.has500, true);
      assert.equal(c1Check.has1200, true);
      assert.equal(cdnRequests.length, 0);
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);

test("Double-dollar display math (single-line and multiline) normalizes to \\[...\\] before Markdown, preserving currency, escaped dollars, code spans, and canonical delimiters", () => {
  const single = "The correlation is bounded:\n\n$$-1 \\leq r \\leq 1$$\n\nSales rose from $500 to $1,200.";
  const singleHtml = htmlUtils.renderMarkdownBlock(single);
  assert.match(singleHtml, /\\\[-1 \\leq r \\leq 1\\\]/);
  assert.doesNotMatch(singleHtml, /\$\$/);
  assert.match(singleHtml, /from \$500 to \$1,200/);

  const multiline = [
    "Consider the quadratic expression:",
    "$$",
    "x_1 - 4x_2 - 5 = 0",
    "$$",
    "Keep `$$code$$`, escaped \\$$literal\\$$, and existing \\[a^2 + b^2\\]."
  ].join("\n");
  const multiHtml = htmlUtils.renderMarkdownBlock(multiline);
  assert.match(multiHtml, /\\\[\s*x_1 - 4x_2 - 5 = 0\s*\\\]/);
  assert.doesNotMatch(multiHtml, /<li>/i);
  assert.doesNotMatch(multiHtml, /<em>/i);
  assert.match(multiHtml, /<code>\$\$code\$\$<\/code>/);
  assert.match(multiHtml, /\\\[a\^2 \+ b\^2\\\]/);
});

test(
  "Browser acceptance: page containing ONLY double-dollar display math ($$-1 \\leq r \\leq 1$$) triggers offline MathJax packaging and typesets cleanly",
  { skip: process.env.PRISM_SKIP_BROWSER_E2E === "1" },
  async (t) => {
    const playwright = loadPlaywright();
    if (!playwright || !playwright.chromium) {
      t.skip("playwright is unavailable");
      return;
    }

    const displayOnlyPage = {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Correlation bounds",
      activities: [],
      sections: [
        {
          section_id: "bounds",
          title: "Bounds of Pearson correlation",
          exposition: "For any paired observations with spending from $500 to $1,200:\n\n$$-1 \\leq r \\leq 1$$"
        }
      ]
    };

    const rendered = vnext.renderLearnerPageHtml(displayOnlyPage, { pageKey: "qa-display-only-math" });
    assert.ok(rendered && rendered.html);
    assert.equal(mathJaxAssets.pageHtmlNeedsMathJaxDisplay(rendered.html), true);
    assert.match(rendered.html, /\\\[-1 \\leq r \\leq 1\\\]/);
    assert.doesNotMatch(rendered.html, /\$\$/);

    const fullHtml = [
      "<!doctype html><html><head><meta charset='utf-8'><title>Display Only</title>",
      buildStandaloneMathJaxHead(),
      "</head><body>",
      rendered.html,
      "</body></html>"
    ].join("");

    const built = learnerPackage.buildLearnerPackage({
      html: fullHtml,
      title: "Correlation bounds",
      repoRoot
    });
    assert.equal(built.ok, true, built.error && built.error.message);
    assert.ok(built.package.assets.some((a) => a.path === "lib/mathjax/es5/tex-chtml.js"));

    const zipEntries = { "index.html": Buffer.from(built.package.html, "utf8") };
    built.package.assets.forEach((a) => {
      zipEntries[a.path] = Buffer.isBuffer(a.bytes) ? a.bytes : Buffer.from(a.bytes);
    });
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-qa-display-dollar-"));
    writeZipToDir(fflate.zipSync(zipEntries), tempDir);
    const staticServer = await startStaticServer(tempDir);

    let browser;
    try {
      browser = await playwright.chromium.launch({ headless: true, channel: "chrome" });
    } catch (err) {
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
      t.skip("Chrome channel unavailable for Playwright: " + String(err && err.message));
      return;
    }

    const cdnRequests = [];
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.route("**/*", async (route) => {
        const url = route.request().url();
        if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/i.test(url)) {
          cdnRequests.push(url);
          await route.abort();
          return;
        }
        await route.continue();
      });

      const page = await context.newPage();
      await page.goto(staticServer.baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => document.querySelectorAll("mjx-container").length >= 1,
        null,
        { timeout: 15000 }
      );

      const check = await page.evaluate(() => {
        const text = document.body.innerText || "";
        return {
          mjxCount: document.querySelectorAll("mjx-container").length,
          hasDoubleDollar: text.includes("$$"),
          hasRawBracket: /\\\[|\\\]/.test(text),
          has500: text.includes("$500"),
          has1200: text.includes("$1,200")
        };
      });

      assert.equal(check.mjxCount >= 1, true);
      assert.equal(check.hasDoubleDollar, false);
      assert.equal(check.hasRawBracket, false);
      assert.equal(check.has500, true);
      assert.equal(check.has1200, true);
      assert.equal(cdnRequests.length, 0);
    } finally {
      await browser.close();
      staticServer.server.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
);
