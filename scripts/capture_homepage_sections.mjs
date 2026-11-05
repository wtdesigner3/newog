import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const outputDir = path.join(projectRoot, "PHASE_8_COMPLETE_WEBSITE_REDESIGN", "screenshots", "redesigned_homepage");
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
  console.log("Capturing full homepage screenshots from", BASE_URL);
  
  // Full desktop homepage
  const fullDesktopOut = path.join(outputDir, "homepage_full_desktop.png");
  await captureScreenshot(BASE_URL, fullDesktopOut, 1920, 6800);

  // Full mobile homepage
  const fullMobileOut = path.join(outputDir, "homepage_full_mobile.png");
  await captureScreenshot(BASE_URL, fullMobileOut, 390, 9500);

  console.log("Homepage full screenshots captured!");
}

run();

