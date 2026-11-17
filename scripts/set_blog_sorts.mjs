import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const liveBlogSlugs = [
    "how-to-choose-which-air-conditioner-brand-should-we-buy",
    "buying-the-perfect-air-conditioner",
    "how-to-identify-when-your-air-conditioner-require-servicing",
    "how-to-save-electricity-while-using-your-air-conditioner",
  ];

  for (let i = 0; i < liveBlogSlugs.length; i++) {
    await db.collection("blogs").updateOne(
      { slug: liveBlogSlugs[i] },
      { $set: { sort: i + 1 } }
    );
  }

  const technicalBlogSlugs = [
    "selecting-high-ambient-air-conditioners-50c-climates",
    "why-100-percent-copper-condenser-coils-matter",
    "commercial-ac-inverter-vs-fixed-speed-savings",
    "preventive-maintenance-cleaning-heavy-duty-coils",
    "cassette-vs-ductable-air-conditioners-commercial-spaces",
    "how-room-heat-load-calculations-prevent-ac-tripping",
  ];

  for (let i = 0; i < technicalBlogSlugs.length; i++) {
    await db.collection("blogs").updateOne(
      { slug: technicalBlogSlugs[i] },
      { $set: { sort: i + 5 } }
    );
  }

  console.log("Updated sort orders for all 10 blogs:");
  const blogs = await db.collection("blogs").find({}).sort({ sort: 1 }).toArray();
  blogs.forEach(b => console.log(`[${b.sort}] ${b.slug} - ${b.title}`));

  await mongoose.disconnect();
}

run().catch(console.error);
