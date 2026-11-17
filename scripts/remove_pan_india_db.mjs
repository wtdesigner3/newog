import dns from "node:dns";
import { promises as dnsPromises } from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log("Connected to MongoDB:", db.databaseName);

  // 1. Update otherctas
  const otherctasRes = await db.collection("otherctas").updateMany(
    { content: { $regex: /pan[\s\-_]?india/i } },
    {
      $set: {
        content: "Turnkey cooling solutions for commercial, industrial, and high-ambient institutions. Engineered to endure 52°C extreme climates."
      }
    }
  );
  console.log("Updated otherctas:", otherctasRes.modifiedCount);

  // 2. Update homeextras
  const homeextrasRes = await db.collection("homeextras").updateMany(
    { contact_subtitle: { $regex: /pan[\s\-_]?india/i } },
    {
      $set: {
        contact_subtitle: "Turnkey cooling solutions for commercial, industrial, and high-ambient institutions. Engineered to endure 52°C extreme climates."
      }
    }
  );
  console.log("Updated homeextras:", homeextrasRes.modifiedCount);

  // 3. Update milestones if any have Pan-India
  const milestonesRes = await db.collection("milestones").updateMany(
    { textValue: { $regex: /pan[\s\-_]?india/i } },
    {
      $set: {
        textValue: "Delhi NCR",
        badge: "Regional Reach"
      }
    }
  );
  console.log("Updated milestones:", milestonesRes.modifiedCount);

  // 4. Update any other collection where string contains pan-india
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    for (const doc of docs) {
      let docModified = false;
      const updates = {};
      for (const [key, value] of Object.entries(doc)) {
        if (typeof value === "string" && /pan[\s\-_]?india/i.test(value)) {
          const replaced = value.replace(/pan[\s\-_]?india/gi, "regional");
          updates[key] = replaced;
          docModified = true;
          console.log(`Replacing in collection ${name}, doc ${doc._id}, field ${key}: ${value} -> ${replaced}`);
        }
      }
      if (docModified) {
        await db.collection(name).updateOne({ _id: doc._id }, { $set: updates });
      }
    }
  }

  console.log("Finished updating database.");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
