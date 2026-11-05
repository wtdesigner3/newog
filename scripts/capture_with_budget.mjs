import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const outputDir = path.join(projectRoot, "PHASE_8_COMPLETE_WEBSITE_REDESIGN", "screenshots", "banner_fixes");
fs.mkdirSync(outputDir, { recursive: true });

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function captureScreenshot(url, outputPath, width, height) {
  return new Promise((resolve) => {
    const args = [
      "--headless",
      `--screenshot=${outputPath}`,
      `--window-size=${width},${height}`,
      "--hide-scrollbars",
      "--disable-gpu",
      "--virtual-time-budget=4000",
      url,
    ];
    execFile(EDGE_PATH, args, (err) => {
      if (err) {
        console.error(`Failed to capture ${outputPath}:`, err.message);
        resolve(false);
      } else {
        console.log(`Captured: ${path.basename(outputPath)} (${width}x${height})`);
        resolve(true);
      }
    });
  });
}

async function run() {
  console.log("Capturing all 4 individual slides with virtual-time-budget=4000...");
  
  await captureScreenshot("http://localhost:3000/?slide=0", path.join(outputDir, "slide_0_factory_loaded.png"), 1366, 768);
  await captureScreenshot("http://localhost:3000/?slide=1", path.join(outputDir, "slide_1_commercial_loaded.png"), 1366, 768);
  await captureScreenshot("http://localhost:3000/?slide=2", path.join(outputDir, "slide_2_industrial_loaded.png"), 1366, 768);
  await captureScreenshot("http://localhost:3000/?slide=3", path.join(outputDir, "slide_3_tower_loaded.png"), 1366, 768);

  console.log("All 4 slides fully captured!");
}

run();

