import { execFile } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Script to inject evaluation
const scriptToRun = `
  const over = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > 395) {
      over.push({
        tag: el.tagName,
        id: el.id,
        className: el.className?.toString().slice(0, 80),
        right: Math.round(r.right),
        width: Math.round(r.width)
      });
    }
  });
  console.log('OVERFLOWING_ELEMENTS:' + JSON.stringify(over.slice(0, 20)));
`;

// Let's run with --dump-dom or evaluate
execFile(EDGE_PATH, [
  "--headless",
  "--window-size=390,844",
  "--virtual-time-budget=3000",
  "--dump-dom",
  "http://localhost:3000/?slide=0"
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
  if (err) return console.error(err);
  console.log("DOM length:", stdout.length);
});

