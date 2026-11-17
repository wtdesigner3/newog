import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully!");

  const db = mongoose.connection.db;

  const abouts = await db.collection("abouts").find({}).toArray();
  console.log("Abouts count:", abouts.length);
  abouts.forEach(a => console.log(" - id:", a._id, "slug:", a.slug, "title:", a.title, "section:", a.section));

  const homeabouts = await db.collection("homeabouts").find({}).toArray();
  console.log("Homeabouts count:", homeabouts.length);
  homeabouts.forEach(h => console.log(" - id:", h._id, "title:", h.title, "mission_title:", h.mission_title));

  const faqs = await db.collection("faqs").find({}).toArray();
  console.log("Faqs count:", faqs.length);
  faqs.forEach(f => console.log(" - id:", f._id, "q:", f.question.slice(0, 40), "cat:", f.category, "sort:", f.sort));

  const blogs = await db.collection("blogs").find({}).toArray();
  console.log("Blogs count:", blogs.length);
  blogs.forEach(b => console.log(" - id:", b._id, "slug:", b.slug, "title:", b.title.slice(0, 40)));

  await mongoose.disconnect();
}

main().catch(console.error);
