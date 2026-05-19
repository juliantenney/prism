const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "app.js");
let s = fs.readFileSync(file, "utf8");

const oldTemplate = `return '<article class="util-template-block"><h5>' +
                      utilityEscapeHtml(secHeading) +
                      '</h5><motion class="util-template-note-line" aria-hidden="true"></div></article>';`;

const newTemplate = `return (
                      '<article class="util-template-block">' +
                      utilityRenderIconHeading("h5", secHeading, "template", "util-icon-heading util-template-block-heading") +
                      '<motion class="util-template-note-line" aria-hidden="true"></motion></article>'
                    );`;
