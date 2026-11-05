import { execFile } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Script to inspect elements in edge
const js = `
  const h = document.querySelector('header');
  const pill = h ? h.children[0] : null;
  const logo = pill ? pill.children[0] : null;
  const nav = pill ? pill.children[1] : null;
  const rightControls = pill ? pill.children[2] : null;
  const hamburger = rightControls ? rightControls.querySelector('button') : null;
  
  console.log('MEASUREMENTS:' + JSON.stringify({
    windowInnerWidth: window.innerWidth,
    bodyScrollWidth: document.body.scrollWidth,
    headerRect: h ? h.getBoundingClientRect() : null,
    pillRect: pill ? pill.getBoundingClientRect() : null,
    logoRect: logo ? logo.getBoundingClientRect() : null,
    navComputedDisplay: nav ? getComputedStyle(nav).display : null,
    navRect: nav ? nav.getBoundingClientRect() : null,
    rightControlsRect: rightControls ? rightControls.getBoundingClientRect() : null,
    hamburgerRect: hamburger ? hamburger.getBoundingClientRect() : null
  }));
`;

execFile(EDGE_PATH, [
  "--headless",
  "--window-size=412,915",
  "--virtual-time-budget=3000",
  "--dump-dom",
  "http://localhost:3000/?slide=0"
], (err) => {
  // Let's write a script that outputs console log
});

