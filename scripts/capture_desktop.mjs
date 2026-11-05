import { execSync } from 'child_process';
import sharp from 'sharp';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sleek_header_desktop.png';

execSync(`"${edge}" --headless --disable-gpu --window-size=1920,1080 --virtual-time-budget=4000 --screenshot="${outFile}" "http://localhost:3000/?slide=0"`);
console.log('Saved sleek_header_desktop.png!');

// Extract just the header region (top 200px)
await sharp(outFile)
  .extract({ left: 0, top: 0, width: 1920, height: 220 })
  .toFile('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sleek_header_pill_zoom.png');

console.log('Header zoom saved!');

