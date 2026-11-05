import { execFile } from "child_process";
import fs from "fs";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Use dump-dom or a small evaluation to see what is causing width > 412
execFile(EDGE_PATH, [
  "--headless",
  "--window-size=412,915",
  "--virtual-time-budget=3000",
  "--dump-dom",
  "http://localhost:3000/?slide=0"
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
  if (err) return console.error(err);
  fs.writeFileSync("dom_412.html", stdout);
  console.log("DOM written, size:", stdout.length);
});

