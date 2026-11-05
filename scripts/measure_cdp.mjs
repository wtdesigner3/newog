import { spawn } from "child_process";
import http from "http";
import fs from "fs";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const edge = spawn(EDGE_PATH, [
  "--headless",
  "--remote-debugging-port=9222",
  "--user-data-dir=C:\\Users\\LENOVO 2\\.gemini\\antigravity\\brain\\b700d335-92ad-4435-9806-0bae16884077\\edge_profile",
  "http://localhost:3000/?slide=0"
]);

setTimeout(() => {
  http.get("http://127.0.0.1:9222/json", (res) => {
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
        ws.send(JSON.stringify({
          id: 1,
          method: "Emulation.setDeviceMetricsOverride",
          params: {
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            mobile: true
          }
        }));
      });

      ws.addEventListener("message", (event) => {
        const res = JSON.parse(event.data);
        if (res.id === 1) {
          ws.send(JSON.stringify({
            id: 2,
            method: "Runtime.evaluate",
            params: {
              expression: "document.getElementById('clientele')?.scrollIntoView({ behavior: 'instant', block: 'start' })"
            }
          }));
        } else if (res.id === 2) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: "Page.captureScreenshot",
              params: { format: "png" }
            }));
          }, 1000);
        } else if (res.id === 3) {
          const buffer = Buffer.from(res.result.data, "base64");
          fs.writeFileSync("C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/mobile_clientele_cdp.png", buffer);
          console.log("Mobile clientele screenshot captured!");
          ws.close();
          edge.kill();
        }
      });
    });
  });
}, 3000);
