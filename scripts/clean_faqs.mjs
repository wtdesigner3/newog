import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection("faqs").updateMany(
    {},
    {
      $set: {
        status: "active",
        isActive: true,
      },
    }
  );

  const faqs = await db.collection("faqs").find({ status: "active" }).sort({ sort: 1 }).toArray();
  console.log("Active FAQs count:", faqs.length);
  faqs.forEach(f => console.log(`[${f.sort}] [${f.status}] ${f.question}`));

  await mongoose.disconnect();
}

run().catch(console.error);
