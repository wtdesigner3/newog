import { spawn } from "child_process";
import http from "http";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const edge = spawn(EDGE_PATH, [
  "--headless",
  "--remote-debugging-port=9222",
  "--user-data-dir=C:\\Users\\LENOVO 2\\.gemini\\antigravity\\brain\\b700d335-92ad-4435-9806-0bae16884077\\edge_profile",
  "--window-size=412,915",
  "http://localhost:3000/?slide=0"
]);

setTimeout(() => {
  http.get("http://127.0.0.1:9222/json", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      try {
        const pages = JSON.parse(data);
        console.log("Pages:", pages.map(p => ({ title: p.title, url: p.url })));
      } catch (e) {
        console.error(e);
      }
      edge.kill();
    });
  }).on("error", (e) => {
    console.error("HTTP error:", e.message);
    edge.kill();
  });
}, 2500);
