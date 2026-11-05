import { execFile } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

execFile(EDGE_PATH, [
  "--headless",
  "--window-size=390,844",
  "--dump-dom",
  "http://localhost:3000/?slide=0"
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
  if (err) return console.error(err);
  
  // Find any elements with style or class that might be wide
  const matches = stdout.match(/class="[^"]*w-\[[^"]*\][^"]*"/g);
  console.log("Custom w-[...] classes:", matches);

  const minWMatches = stdout.match(/class="[^"]*min-w-\[[^"]*\][^"]*"/g);
  console.log("Custom min-w-[...] classes:", minWMatches);
});

