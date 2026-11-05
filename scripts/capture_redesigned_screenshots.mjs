import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const outputDir = path.join(projectRoot, "PHASE_8_COMPLETE_WEBSITE_REDESIGN", "screenshots", "redesigned");
fs.mkdirSync(outputDir, { recursive: true });

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE_URL = "http://localhost:3000";

const pages = [
  { name: "01_homepage", path: "/" },
  { name: "02_about_us", path: "/about-us" },
  { name: "03_products_catalog", path: "/products" },
  { name: "04_product_detail", path: "/products/split-ac/og-18s5in" },
  { name: "05_resources", path: "/resources" },
  { name: "06_contact_us", path: "/contact-us" },
  { name: "07_career", path: "/career" },
  { name: "08_blogs", path: "/blogs" },
  { name: "09_clients", path: "/clients" },
  { name: "10_ac_sizing", path: "/ac-sizing" },
];

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
        console.log(`Captured redesigned: ${path.basename(outputPath)} (${width}x${height})`);
        resolve(true);
      }
    });
  });
}

async function run() {
  console.log("Capturing redesigned screenshots from", BASE_URL);
  
  for (const page of pages) {
    const targetUrl = `${BASE_URL}${page.path}`;
    
    // Desktop: 1920 x 1080
    const desktopOut = path.join(outputDir, `${page.name}_desktop.png`);
    await captureScreenshot(targetUrl, desktopOut, 1920, 1080);

    // Mobile: 390 x 844 (iPhone 14 standard mobile)
    const mobileOut = path.join(outputDir, `${page.name}_mobile.png`);
    await captureScreenshot(targetUrl, mobileOut, 390, 844);
  }

  console.log("Redesigned screenshot capture complete!");
}

run();

