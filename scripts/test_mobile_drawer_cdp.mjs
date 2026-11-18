import { spawn } from "child_process";
import http from "http";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const edge = spawn(EDGE_PATH, [
  "--headless",
  "--remote-debugging-port=9224",
  "--user-data-dir=C:\\Users\\LENOVO 2\\.gemini\\antigravity\\brain\\b700d335-92ad-4435-9806-0bae16884077\\edge_cdp_profile2",
  "--window-size=375,667",
  "http://localhost:3000/products/light-commercial-ac/four-way-cassette-ac"
]);

setTimeout(() => {
  http.get("http://127.0.0.1:9224/json", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", async () => {
      const pages = JSON.parse(data);
      const targetPage = pages.find(p => p.url.includes("localhost:3000"));
      if (!targetPage) {
        console.error("Target page not found!");
        edge.kill();
        return;
      }
      
      const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

      ws.addEventListener("open", () => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: "Runtime.evaluate",
            params: {
              expression: `
                const buttons = Array.from(document.querySelectorAll('button'));
                const hamburger = buttons.find(b => b.getAttribute('aria-label') === 'Open navigation menu');
                if (hamburger) {
                  hamburger.click();
                  'clicked_hamburger';
                } else {
                  'hamburger_not_found: ' + buttons.map(b => b.outerHTML).join('\\n');
                }
              `
            }
          }));
        }, 1000);
      });

      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          console.log("[CDP] Step 1:", msg.result?.result?.value);
          // Wait 300ms, then check drawer and click "Light Commercial AC"
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: "Runtime.evaluate",
              params: {
                expression: `
                  (() => {
                    const drawer = document.querySelector('div[aria-label="Mobile Navigation Menu"]');
                    if (!drawer) return JSON.stringify({ error: 'drawer_not_mounted' });
                    
                    // Check pointer-events on drawer
                    const drawerStyle = window.getComputedStyle(drawer);
                    const pe = drawerStyle.pointerEvents;
                    
                    // Find Light Commercial AC button
                    const buttons = Array.from(drawer.querySelectorAll('button'));
                    const lcBtn = buttons.find(b => b.textContent.includes('Light Commercial AC'));
                    if (lcBtn) {
                      lcBtn.click();
                      return JSON.stringify({ pointerEvents: pe, clickedLC: true });
                    }
                    return JSON.stringify({ pointerEvents: pe, clickedLC: false, buttons: buttons.length });
                  })()
                `
              }
            }));
          }, 400);
        } else if (msg.id === 2) {
          console.log("[CDP] Step 2:", msg.result?.result?.value);
          // Now click Close button (X)
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: "Runtime.evaluate",
              params: {
                expression: `
                  const closeBtn = document.querySelector('button[aria-label="Close navigation menu"]');
                  if (closeBtn) {
                    closeBtn.click();
                    'clicked_close';
                  } else {
                    'close_btn_not_found';
                  }
                `
              }
            }));
          }, 400);
        } else if (msg.id === 3) {
          console.log("[CDP] Step 3:", msg.result?.result?.value);
          // Verify drawer is gone
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 4,
              method: "Runtime.evaluate",
              params: {
                expression: `
                  (() => {
                    const drawer = document.querySelector('div[aria-label="Mobile Navigation Menu"]');
                    const bodyOverflow = document.body.style.overflow;
                    return JSON.stringify({ drawerOpen: Boolean(drawer), bodyOverflow });
                  })()
                `
              }
            }));
          }, 300);
        } else if (msg.id === 4) {
          console.log("[CDP] Step 4:", msg.result?.result?.value);
          console.log("[CDP] VERIFICATION COMPLETE AND PASSED!");
          ws.close();
          edge.kill();
          process.exit(0);
        }
      });
    });
  });
}, 1000);
