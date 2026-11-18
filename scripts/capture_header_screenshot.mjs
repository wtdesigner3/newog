import { execFile } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputPath = 'C:\\Users\\LENOVO 2\\.gemini\\antigravity\\brain\\b700d335-92ad-4435-9806-0bae16884077\\header_solid_white_verification.png';
const args = [
  '--headless',
  `--screenshot=${outputPath}`,
  '--window-size=1440,350',
  '--hide-scrollbars',
  '--disable-gpu',
  'http://localhost:3000'
];

execFile(EDGE_PATH, args, (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  } else {
    console.log('Screenshot saved to:', outputPath);
    process.exit(0);
  }
});
