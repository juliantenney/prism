"use strict";

/**
 * Tiny static server for local S81 R4 preview HTML under ./out/.
 */

var http = require("http");
var fs = require("fs");
var path = require("path");

var outDir = path.join(__dirname, "out");
var defaultPage = "heteroscedasticity-revision-reminder-shell.html";
var port = Number(process.env.PORT || 8765);

http
  .createServer(function (req, res) {
    var urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath === "/") urlPath = "/" + defaultPage;
    var filePath = path.join(outDir, urlPath.replace(/^\//, ""));
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("missing: " + filePath);
        return;
      }
      var ext = path.extname(filePath);
      var type = ext === ".html" ? "text/html; charset=utf-8" : "text/plain";
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", function () {
    console.log(
      "listening http://127.0.0.1:" +
        port +
        "/" +
        defaultPage +
        "\nGenerate first with: node tools/s81-revision-reminder-preview/regen-shell-preview.js"
    );
  });
