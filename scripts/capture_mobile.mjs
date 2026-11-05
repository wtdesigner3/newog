import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputPath = path.join(projectRoot, "PHASE_8_COMPLETE_WEBSITE_REDESIGN", "screenshots", "typography_update", "header_mobile_clean.png");

const args = [
  "--headless",
  `--screenshot=${outputPath}`,
  "--window-size=412,915",
  "--hide-scrollbars",
  "--disable-gpu",
  "--virtual-time-budget=4000",
  "http://localhost:3000/?slide=0",
];

execFile(EDGE_PATH, args, (err) => {
  if (err) console.error("Error:", err);
  else console.log("Saved mobile screenshot to:", outputPath);
});

