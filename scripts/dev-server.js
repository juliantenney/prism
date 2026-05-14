#!/usr/bin/env node
/**
 * Local-only dev server: serves PRISM static files and exposes OPENAI_API_KEY
 * from repo-root .env.local at GET /__prism/dev-api-key (JSON, no-store).
 * Listens on 127.0.0.1 only. Use: npm run dev
 */
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

var ROOT = path.resolve(__dirname, "..");
var PORT = Number(process.env.PORT || 8787);

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2"
};

function readEnvLocalOpenAiKey() {
  var envPath = path.join(ROOT, ".env.local");
  try {
    var raw = fs.readFileSync(envPath, "utf8");
  } catch (_e) {
    return "";
  }
  var lines = String(raw || "").split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = String(lines[i] || "").trim();
    if (!line || line.indexOf("#") === 0) continue;
    var m = /^OPENAI_API_KEY\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    var v = String(m[1] || "").trim();
    if (
      (v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') ||
      (v.charAt(0) === "'" && v.charAt(v.length - 1) === "'")
    ) {
      v = v.slice(1, -1).trim();
    }
    return v;
  }
  return "";
}

function safeFilePathFromUrlPathname(pathname) {
  var rel = String(pathname || "").split("?")[0];
  if (rel.indexOf("\0") !== -1) return null;
  if (!rel || rel === "/") return path.join(ROOT, "index.html");
  var joined = path.resolve(ROOT, "." + rel);
  var relTo = path.relative(ROOT, joined);
  if (relTo.indexOf("..") === 0) return null;
  return joined;
}

function sendDevApiKey(res) {
  var key = readEnvLocalOpenAiKey();
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify({ openaiApiKey: key }));
}

function serveStatic(res, filePath) {
  fs.stat(filePath, function (err, st) {
    if (err) {
      res.writeHead(404);
      res.end();
      return;
    }
    var fp = filePath;
    if (st.isDirectory()) {
      fp = path.join(filePath, "index.html");
    }
    fs.readFile(fp, function (errRead, buf) {
      if (errRead) {
        res.writeHead(404);
        res.end();
        return;
      }
      var ext = path.extname(fp).toLowerCase();
      var ct = MIME[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": ct, "Cache-Control": "no-cache" });
      res.end(buf);
    });
  });
}

var server = http.createServer(function (req, res) {
  var parsed = url.parse(req.url || "", false);
  var pathname = decodeURIComponent(parsed.pathname || "/");

  if (pathname === "/__prism/dev-api-key") {
    sendDevApiKey(res);
    return;
  }

  var filePath = safeFilePathFromUrlPathname(pathname);
  if (!filePath) {
    res.writeHead(403);
    res.end();
    return;
  }
  serveStatic(res, filePath);
});

server.listen(PORT, "127.0.0.1", function () {
  console.log("PRISM dev: http://127.0.0.1:" + PORT + " (OPENAI_API_KEY from .env.local if present)");
});
