import { execFile } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Script to inspect header rect
execFile(EDGE_PATH, [
  "--headless",
  "--window-size=412,915",
  "--virtual-time-budget=3000",
  "--dump-dom",
  "http://localhost:3000/?slide=0"
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
  if (err) return console.error(err);
  const headerMatch = stdout.match(/<header[\s\S]*?<\/header>/);
  if (headerMatch) {
    console.log("HEADER HTML:\n", headerMatch[0]);
  }
});
