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
const BASE_URL = "http://localhost:3000";

function captureScreenshot(url, outputPath, width, height) {
  return new Promise((resolve) => {
    const args = [
      "--headless",
      `--screenshot=${outputPath}`,
      `--window-size=${width},${height}`,
      "--hide-scrollbars",
      "--disable-gpu",
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
  console.log("Capturing banner screenshots...");
  
  // 1. Laptop view (1366x768) matching user's exact screen
  await captureScreenshot(BASE_URL, path.join(outputDir, "banner_laptop_1366x768.png"), 1366, 768);

  // 2. Full HD view (1920x1080)
  await captureScreenshot(BASE_URL, path.join(outputDir, "banner_desktop_1920x1080.png"), 1920, 1080);

  // 3. Mobile view (390x844)
  await captureScreenshot(BASE_URL, path.join(outputDir, "banner_mobile_390x844.png"), 390, 844);

  console.log("Done capturing banner screenshots!");
}

run();
