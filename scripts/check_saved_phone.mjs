import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function check() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const globalSettings = await db.collection("globalsettings").find({}).toArray();
  console.log("=== globalsettings ===");
  for (const doc of globalSettings) {
    console.log({
      _id: doc._id,
      primaryPhone: doc.primaryPhone,
      footerPhone: doc.footerPhone,
      primaryEmail: doc.primaryEmail,
      address: doc.address
    });
  }

  const contactpages = await db.collection("contactpages").find({}).toArray();
  console.log("=== contactpages ===");
  for (const doc of contactpages) {
    console.log({
      _id: doc._id,
      locations: doc.locations
    });
  }

  await mongoose.disconnect();
}
check();
