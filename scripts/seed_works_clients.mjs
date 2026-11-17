import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

const PRESTIGIOUS_CLIENTS = [
  { title: "State Bank of India (SBI)", logo: "/uploads/client/1691642872_sbi.jpg", category: "Industry", sort: 1 },
  { title: "Delhi University (DU)", logo: "/uploads/client/1691581726_Du.jpg", category: "Application", sort: 2 },
  { title: "IIT Jodhpur", logo: "/uploads/client/1691581741_IIT jodhpur.jpg", category: "Application", sort: 3 },
  { title: "Ministry of Railways", logo: "/uploads/client/1696507279_ministry-railways.jpg", category: "Industry", sort: 4 },
  { title: "Central Public Works Department (CPWD)", logo: "/uploads/client/1696507495_cpwd.jpg", category: "Industry", sort: 5 },
  { title: "Oil and Natural Gas Corporation (ONGC)", logo: "/uploads/client/1696507114_ongc.jpg", category: "Industry", sort: 6 },
  { title: "Indian Oil Corporation (IOCL)", logo: "/uploads/client/1696507092_io.jpg", category: "Industry", sort: 7 },
  { title: "Bharat Petroleum (BPCL)", logo: "/uploads/client/1696507002_bp.jpg", category: "Industry", sort: 8 },
  { title: "Hindustan Petroleum (HPCL)", logo: "/uploads/client/1696507025_hp.jpg", category: "Industry", sort: 9 },
  { title: "Punjab National Bank (PNB)", logo: "/uploads/client/1691642854_pnb.jpg", category: "Industry", sort: 10 },
  { title: "Bank of Baroda", logo: "/uploads/client/1691642816_bob bank.jpg", category: "Industry", sort: 11 },
  { title: "Canara Bank", logo: "/uploads/client/1691642824_canara bank.jpg", category: "Industry", sort: 12 },
  { title: "Border Security Force (BSF)", logo: "/uploads/client/1696507338_bsf.jpg", category: "Industry", sort: 13 },
  { title: "Jawaharlal Nehru University (JNU)", logo: "/uploads/client/1691581759_jnu.jpg", category: "Application", sort: 14 },
  { title: "Jamia Millia Islamia", logo: "/uploads/client/1691581751_Jamia.jpg", category: "Application", sort: 15 },
  { title: "IRCTC", logo: "/uploads/client/1696507201_irctc.jpg", category: "Industry", sort: 16 },
  { title: "Life Insurance Corporation (LIC)", logo: "/uploads/client/1696506201_lic.jpg", category: "Industry", sort: 17 },
  { title: "Employees' State Insurance Corporation (ESIC)", logo: "/uploads/client/1696506179_esic.jpg", category: "Industry", sort: 18 },
  { title: "Kendriya Vidyalaya (KV School)", logo: "/uploads/client/1691647786_kv school.jpg", category: "Application", sort: 19 },
  { title: "Doordarshan (National Broadcaster)", logo: "/uploads/client/1691648263_durdarshan.jpg", category: "Industry", sort: 20 },
  { title: "All India Radio (AIR)", logo: "/uploads/client/1691648243_air.jpg", category: "Industry", sort: 21 },
  { title: "Quality Council of India (QCI)", logo: "/uploads/client/1696507600_qci.jpg", category: "Industry", sort: 22 },
  { title: "Northern Railway", logo: "/uploads/client/1696507295_north-railway.jpg", category: "Industry", sort: 23 },
  { title: "Western Railway", logo: "/uploads/client/1696507303_western-railway.jpg", category: "Industry", sort: 24 },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  const db = mongoose.connection.db;

  // Clear out old dummy works
  await db.collection("works").deleteMany({});
  console.log("Deleted old dummy works.");

  // Insert all 24 prestigious clients
  const docs = PRESTIGIOUS_CLIENTS.map(c => ({
    title: c.title,
    logo: c.logo,
    category: c.category,
    status: "active",
    sort: c.sort,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const res = await db.collection("works").insertMany(docs);
  console.log(`Inserted ${res.insertedCount} new authentic clients into works collection!`);

  await mongoose.disconnect();
}

run().catch(console.error);
