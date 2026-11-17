import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import fs from "node:fs";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dnsPromises.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = "mongodb+srv://wtdesigner3_db_user:GCYWITt5EqIBNyXR@ogcluster0.q2x8zb7.mongodb.net/og_heavyduty?retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;

  // ── 1. UPDATE HOMEABOUT (CMS Mission, Vision & About Us Content) ──
  const liveShortDesc = "O.G. HeavyDuty Air Conditioner is a leading Indian brand committed to delivering high-performance, reliable, and energy-efficient air conditioning solutions tailored for the demanding Indian climate. With decades of manufacturing expertise and cutting-edge engineering, we offer an extensive portfolio of Domestic and Light Commercial Air Conditioners engineered for tropical conditions up to 52°C.";

  const liveFullHtml = `<p class="mb-4">O.G. HeavyDuty Air Conditioner is a leading Indian brand committed to delivering high-performance, reliable, and energy-efficient air conditioning solutions tailored for the demanding Indian climate. With decades of manufacturing expertise and cutting-edge engineering, we offer an extensive portfolio of Domestic and Light Commercial Air Conditioners engineered for tropical conditions up to 52°C.</p>
<p class="mb-4">We specialize in both residential and commercial air conditioning applications, offering customized cooling solutions for restaurants, showrooms, offices, villas, banquets, and modern homes. Every O.G. system is crafted with high-grade copper heat exchangers, hydrophilic blue-fin technology, and smart airflow dynamics to provide maximum cooling efficiency with minimal acoustic footprint.</p>
<p class="mb-4">Driven by innovation, robust engineering, and strict quality standards, O.G. HeavyDuty Air Conditioner focuses on delivering superior comfort without compromising on efficiency. From tropical high-ambient survival cooling to inverter energy savings, we engineer air conditioners built to perform relentlessly through extreme heatwaves.</p>
<p>Moreover, we ensure our systems are designed to reduce energy consumption, minimize carbon footprint, and promote sustainable comfort across all sectors. We believe cooling should be powerful, silent, and accessible to every Indian space.</p>`;

  await db.collection("homeabouts").updateOne(
    {},
    {
      $set: {
        badge: "ABOUT OG HEAVY DUTY",
        title: "High-Performance, Reliable & Made-in-India Cooling Solutions",
        short_description: liveShortDesc,
        description: liveFullHtml,
        mission_title: "Our Mission",
        mission_desc: "To provide reliable, energy-efficient, Made-in-India air conditioning solutions with uncompromising quality and service.",
        mission_highlight: "Uncompromising Quality & Service",
        vision_title: "Our Vision",
        vision_desc: "To lead India’s cooling industry through innovation, trust, and sustainable local manufacturing.",
        vision_highlight: "Sustainable Local Manufacturing",
        values_title: "Our Core Values",
        values_desc: "Driven by innovation, robust engineering, and strict quality standards to deliver superior comfort without compromising on efficiency.",
        values_highlight: "100% Made in India",
        image: "/images/about_heritage_manufacturing.jpg",
        alt: "OG Heavy Duty Air Conditioning Manufacturing & Engineering",
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log("Updated HomeAbout collection with live mission, vision, and copy.");

  // ── 2. UPDATE ABOUTS COLLECTION ──
  await db.collection("abouts").updateMany(
    { section: { $in: ["about", "aboutus"] } },
    {
      $set: {
        content: liveFullHtml,
        bannerImage: "/uploads/about/1648793586_vision.jpg",
        image: "/uploads/about/1648793586_mission.jpg",
        updatedAt: new Date(),
      },
    }
  );
  console.log("Updated Abouts collection.");

  // ── 3. UPSERT AUTHENTIC FAQS ──
  const liveFaqs = [
    {
      question: "What are the various mode of payment accepted here?",
      answer: "You can make payment Via Cash, Net Banking, UPI & Debit & Credit Cards.",
      category: "general",
      sort: 1,
    },
    {
      question: "Which is the nearest landmark?",
      answer: "You can easily locate the establishment as it is in close proximity to Dominos, Adarsh Nagar.",
      category: "general",
      sort: 2,
    },
    {
      question: "What are its hours of operation?",
      answer: "The establishment is functional on: Monday: 10:00 Am - 7:00 Pm, Tuesday: 10:00 Am - 7:00 Pm, Wednesday: 10:00 Am - 7:00 Pm, Thursday: 10:00 Am - 7:00 Pm, Friday: 10:00 Am - 7:00 Pm, Saturday: 10:00 Am - 7:00 Pm, Sunday: 10:00 Am - 7:00 Pm.",
      category: "general",
      sort: 3,
    },
    {
      question: "Is EMI option available?",
      answer: "Yes EMI can be made using both debit and credit cards.",
      category: "general",
      sort: 4,
    },
  ];

  for (const faq of liveFaqs) {
    await db.collection("faqs").updateOne(
      { question: faq.question },
      {
        $set: {
          ...faq,
          answerHtml: `<p>${faq.answer}</p>`,
          isVerified: true,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
  console.log("Upserted 4 authentic live FAQs into faqs collection.");

  // ── 4. UPSERT AUTHENTIC BLOGS ──
  const rawBlogs = JSON.parse(
    fs.readFileSync("C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/scratch/final_blogs.json", "utf-8")
  );

  const localCoverMap = {
    "how-to-choose-which-air-conditioner-brand-should-we-buy": "/uploads/blogs/1702016599_WhatsApp_Image.jpg",
    "buying-the-perfect-air-conditioner": "/uploads/blogs/1648793002_blog_3.jpg",
    "how-to-identify-when-your-air-conditioner-require-servicing": "/uploads/blogs/1652094327_AC-Service.png",
    "how-to-save-electricity-while-using-your-air-conditioner": "/uploads/blogs/1652094869_Tips-To-Save-Your-AC-Power-Consumption.jpg",
  };

  const blogCategories = {
    "how-to-choose-which-air-conditioner-brand-should-we-buy": "Buying Guide",
    "buying-the-perfect-air-conditioner": "Buying Guide",
    "how-to-identify-when-your-air-conditioner-require-servicing": "Maintenance & Service",
    "how-to-save-electricity-while-using-your-air-conditioner": "Energy Efficiency",
  };

  for (const b of rawBlogs) {
    const coverImage = localCoverMap[b.slug] || "/uploads/blogs/1648793002_blog_3.jpg";
    const category = blogCategories[b.slug] || "Air Conditioning";
    const plainText = b.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const excerpt = plainText.slice(0, 180) + "...";

    await db.collection("blogs").updateOne(
      { slug: b.slug },
      {
        $set: {
          brandKey: "og-heavy-duty",
          title: b.title,
          slug: b.slug,
          content: b.content,
          excerpt,
          coverImage,
          breadImage: coverImage,
          category,
          tags: ["Air Conditioner", "OG Heavy Duty", category],
          author: "OG Heavy Duty Team",
          authorRole: "Climate Control Specialist",
          status: "published",
          isPublished: true,
          publishedAt: new Date("2022-03-30T00:00:00Z"),
          views: 120,
          likes: 24,
          metaDescription: b.metaDescription || excerpt,
          metaKeywords: b.metaKeywords || "air conditioner, heavy duty cooling",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`Upserted blog: ${b.slug}`);
  }

  console.log("All authentic live website data successfully seeded!");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
