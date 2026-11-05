import fs from "fs";

const html = fs.readFileSync("dom_412.html", "utf8");
const classRegex = /class="([^"]+)"/g;
let match;
const found = new Set();

while ((match = classRegex.exec(html)) !== null) {
  const cls = match[1];
  const tokens = cls.split(/\s+/);
  for (const t of tokens) {
    if (t.startsWith("w-[") || t.startsWith("min-w-[") || t.startsWith("w-") && t.includes("96") || t.includes("120") || t.includes("500") || t.includes("600") || t.includes("700")) {
      found.add(t);
    }
  }
}

console.log("Found potentially wide tokens:", Array.from(found));

