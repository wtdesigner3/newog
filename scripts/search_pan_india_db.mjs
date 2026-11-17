import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log("Searching collections:", collections.map(c => c.name));

  const regex = /pan[\s\-_]?india/i;

  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).toArray();
    for (const doc of docs) {
      const str = JSON.stringify(doc);
      if (regex.test(str)) {
        console.log(`Match in collection '${col.name}' doc _id: ${doc._id}`);
        // Find which fields match
        for (const [key, val] of Object.entries(doc)) {
          if (typeof val === 'string' && regex.test(val)) {
            console.log(`   field '${key}': "${val}"`);
          } else if (typeof val === 'object' && val !== null) {
            const nestedStr = JSON.stringify(val);
            if (regex.test(nestedStr)) {
              console.log(`   nested field '${key}': ${nestedStr.slice(0, 150)}`);
            }
          }
        }
      }
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
