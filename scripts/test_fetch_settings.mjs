import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import dns from "node:dns";
import dnsPromises from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import { connectDB } from "../src/app/lib/config.js";
import GlobalSetting from "../src/app/models/GlobalSetting.js";

async function test() {
  const t0 = Date.now();
  try {
    await connectDB();
    console.log("Connected in", Date.now() - t0, "ms");
    const settings = await GlobalSetting.findOne().lean();
    console.log("Settings fetched in", Date.now() - t0, "ms");
    console.log("Settings primaryPhone:", settings?.primaryPhone);
    console.log("Settings footerPhone:", settings?.footerPhone);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
test();
