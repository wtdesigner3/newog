#!/usr/bin/env node
/**
 * CMS Content Seeder for OG Heavy Duty
 * Seeds all empty CMS collections (Banners, Blogs, HomeAbout, WhyChoose, Work, Contact, PageBanners, About, HomeSeo)
 * with authentic, production-grade OG Heavy Duty HVAC data.
 */

import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env.local") });
dotenv.config({ path: path.join(projectRoot, ".env") });

import Banner from "../src/app/models/Banner.js";
import Blog from "../src/app/models/Blog.js";
import HomeAbout from "../src/app/models/HomeAbout.js";
import WhyChoose from "../src/app/models/whyChoose.js";
import Work from "../src/app/models/Work.js";
import ContactPage from "../src/app/models/ContactPage.js";
import PageBanner from "../src/app/models/PageBanner.js";
import Section from "../src/app/models/Section.js";
import About from "../src/app/models/About.js";
import HomeSeo from "../src/app/models/HomeSeo.js";
import { FALLBACK_BLOGS } from "../src/lib/services/blogService.js";
const CLIENT_LOGOS = [
  { id: 1, image: "/uploads/clients/1648791211_1.jpg", name: "Institutional Client 1" },
  { id: 2, image: "/uploads/clients/1648791222_2.jpg", name: "Institutional Client 2" },
  { id: 3, image: "/uploads/clients/1648791233_3.jpg", name: "Institutional Client 3" },
  { id: 4, image: "/uploads/clients/1648791243_4.jpg", name: "Institutional Client 4" },
  { id: 5, image: "/uploads/clients/1648791254_5.jpg", name: "Institutional Client 5" },
  { id: 6, image: "/uploads/clients/1648791263_6.jpg", name: "Institutional Client 6" },
  { id: 7, image: "/uploads/clients/1648791275_7.jpg", name: "Institutional Client 7" },
  { id: 8, image: "/uploads/clients/1648791286_8.jpg", name: "Institutional Client 8" },
  { id: 9, image: "/uploads/clients/1648791297_9.jpg", name: "Institutional Client 9" },
  { id: 10, image: "/uploads/clients/1648791308_10.jpg", name: "Institutional Client 10" },
  { id: 11, image: "/uploads/clients/1648791323_11.jpg", name: "Institutional Client 11" },
  { id: 12, image: "/uploads/clients/1648791338_12.jpg", name: "Institutional Client 12" },
];

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function seedCMS() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  console.log("Connected to:", mongoose.connection.name);

  // 1. Seed Banners
  const bannerCount = await Banner.countDocuments();
  if (bannerCount === 0) {
    console.log("Seeding Banners...");
    await Banner.insertMany([
      {
        title: "Whisper-Quiet Precision Cooling for Modern Workspaces",
        subtitle: "High-efficiency ceiling cassettes and inverter split systems engineered with hydrophilic blue fin coils and 4-way laminar airflow for corporate headquarters, luxury hotels, and hospitals.",
        buttonText: "Explore Split & Cassette AC",
        url: "/products/split-ac",
        image: "/images/banner_ac_commercial.jpg",
        alt: "100% Inner-Grooved Copper",
        status: "active",
        sort: 1,
        showCertifications: true,
      },
      {
        title: "Robust High-Tonnage Industrial HVAC Chillers & Ducted Units",
        subtitle: "Engineered for massive cooling loads across manufacturing hubs, server facilities, and commercial buildings with multi-stage compressor staging and 145V–285V voltage tolerance.",
        buttonText: "Consult HVAC Engineers",
        url: "#quote",
        image: "/images/banner_ac_industrial.jpg",
        alt: "Heavy-Gauge Anti-Rust Chassis",
        status: "active",
        sort: 2,
        showCertifications: true,
      },
      {
        title: "Rapid High-Throw Airflow Circulation for Large Facilities",
        subtitle: "Vertical floor-standing column towers and rugged window air conditioners delivering long-distance air throw for high-density auditoriums, banquet halls, and educational campuses.",
        buttonText: "Request Equipment Sizing",
        url: "#quote",
        image: "/images/banner_ac_tower.jpg",
        alt: "Pan-India Support & Commissioning",
        status: "active",
        sort: 3,
        showCertifications: true,
      },
    ]);
    console.log("  ✓ Seeded 3 Hero Banners");
  } else {
    console.log(`  - Banners already has ${bannerCount} records.`);
  }

  // 2. Seed Blogs
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    console.log("Seeding Blogs...");
    const blogDocs = FALLBACK_BLOGS.map((b, idx) => ({
      brandKey: "og-heavy-duty",
      title: b.title,
      slug: b.slug,
      coverImage: b.image || "/images/slide1.jpg",
      breadImage: "/uploads/breadcrumb/1648811523_download.jpg",
      bread_heading: b.category || "HVAC Engineering",
      excerpt: b.excerpt,
      content: b.content,
      author: b.author || "OG Heavy Duty Technical Team",
      category: b.category || "HVAC Engineering",
      tags: b.tags || ["High Ambient", "50°C Cooling", "Tropical HVAC"],
      status: "published",
      isPublished: true,
      sort: idx + 1,
      publishedAt: b.publishedAt || new Date().toISOString(),
      metatag: `${b.title} | OG Heavy Duty HVAC Blog`,
      metaDescription: b.excerpt,
      canonicalUrl: `https://ogheavyduty.in/blogs/${b.slug}`,
      ogTitle: b.title,
      ogDescription: b.excerpt,
      twitterCard: "summary_large_image",
      robots: "index, follow",
    }));
    await Blog.insertMany(blogDocs);
    console.log(`  ✓ Seeded ${blogDocs.length} Blogs`);
  } else {
    console.log(`  - Blogs already has ${blogCount} records.`);
  }

  // 3. Seed HomeAbout
  const homeAboutCount = await HomeAbout.countDocuments();
  if (homeAboutCount === 0) {
    console.log("Seeding HomeAbout...");
    await HomeAbout.create({
      title: "Engineered to Cool Where Ordinary Air Conditioners Fail",
      description: "The world contains an infinite number of spaces. O.G. HEAVY DUTY believes that the air in each of them should be ideally suited to the environment they support. Thus, we make it possible to manage the air- to control its temperature, humidity, and flow. O.G. HEAVY DUTY has been supplying a wide range of products to India with some of its most significant technological innovations, creating a symphonic, harmonious, and comfortable world for mankind in the last 30 years of experience & expertise.",
      image: "/images/home1/about-img.jpg",
      alt: "OG Heavy Duty Manufacturing & Precision Engineering",
    });
    console.log("  ✓ Seeded HomeAbout");
  } else {
    console.log(`  - HomeAbout already has ${homeAboutCount} records.`);
  }

  // 4. Seed WhyChoose
  const whyCount = await WhyChoose.countDocuments();
  if (whyCount === 0) {
    console.log("Seeding WhyChoose Us pillars...");
    await WhyChoose.insertMany([
      {
        title: "52°C Severe Ambient Cooling",
        content: "Uninterrupted cooling pull-down with zero thermal tripping during peak 52°C tropical heatwaves.",
        icon: "thermometer-snowflake",
        status: "active",
        sort: 1,
      },
      {
        title: "100% Inner-Grooved Copper",
        content: "Full Cu-DHP rifled copper condenser & evaporator coils for 2x faster heat transfer and zero corrosion risk.",
        icon: "layers",
        status: "active",
        sort: 2,
      },
      {
        title: "Heavy-Gauge Galvanized Casing",
        content: "7-stage zinc phosphatized powder-coated steel chassis built to endure monsoons, salt, and humidity.",
        icon: "shield-check",
        status: "active",
        sort: 3,
      },
      {
        title: "145V – 285V Voltage Stability",
        content: "High-torque windings and contactors withstand severe industrial sags and surges stabilizer-free.",
        icon: "zap",
        status: "active",
        sort: 4,
      },
      {
        title: "Hydrophilic Blue Fin Shield",
        content: "Moisture-repelling barrier prevents fin bridging, stops mold buildup, and optimizes laminar airflow.",
        icon: "wind",
        status: "active",
        sort: 5,
      },
      {
        title: "24/7 Heavy-Duty Duty Cycle",
        content: "Commercial continuous-duty engineering built for non-stop cooling in hospitals, server hubs, and banquets.",
        icon: "cpu",
        status: "active",
        sort: 6,
      },
    ]);
    console.log("  ✓ Seeded 6 WhyChoose pillars");
  } else {
    console.log(`  - WhyChoose already has ${whyCount} records.`);
  }

  // 5. Seed Work (Clientele)
  const workCount = await Work.countDocuments();
  if (workCount === 0) {
    console.log("Seeding Clientele Work...");
    const workDocs = CLIENT_LOGOS.map((c, idx) => ({
      title: c.name || `Institutional Client ${idx + 1}`,
      logo: c.image,
      category: "Industry",
      status: "active",
      sort: idx + 1,
    }));
    await Work.insertMany(workDocs);
    console.log(`  ✓ Seeded ${workDocs.length} Clientele logos`);
  } else {
    console.log(`  - Work already has ${workCount} records.`);
  }

  // 6. Seed ContactPage
  const contactCount = await ContactPage.countDocuments();
  if (contactCount === 0) {
    console.log("Seeding ContactPage CMS...");
    await ContactPage.create({
      headerTitle: "Contact OG Heavy Duty",
      headerImage: "/uploads/breadcrumb/1648811523_download.jpg",
      contactSubTitle: "Direct Commercial & Institutional Enquiries",
      contactTitle: "Contact Us",
      contactDescription: "Looking for heavy-duty commercial HVAC solutions or institutional equipment quotes? Our certified cooling engineers and distribution partners are ready to assist you.",
      mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.789234857492!2d77.17208137631722!3d28.71092698050965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d023c723f5083%3A0xe21f08cb3ea58c89!2sAdarsh%20Nagar%2C%20Delhi%2C%20110033!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      locations: [
        {
          title: "Corporate Headquarters & Support Center",
          address: "D-14, Rajan Babu Road, Adarsh Nagar, New Delhi - 110033",
          phone: "011-35727834 / +91 93199 77568",
          email: "info@ogheavyduty.in / sales@ogheavyduty.in",
          isActive: true,
        },
      ],
      metatag: "Contact OG Heavy Duty | Customer Care, Sales & Dealer Enquiries",
      metaDescription: "Contact OG Heavy Duty Air Conditioners. Reach our New Delhi headquarters for institutional cooling enquiries, dealer partnerships, warranty support, and technical assistance.",
      canonicalUrl: "https://ogheavyduty.in/contact",
      ogTitle: "Contact Us | OG Heavy Duty Air Conditioners",
      ogDescription: "Get in touch with OG Heavy Duty for industrial and commercial air conditioning inquiries, technical support, and dealer distribution.",
      twitterCard: "summary_large_image",
      robots: "index, follow",
    });
    console.log("  ✓ Seeded ContactPage CMS");
  } else {
    console.log(`  - ContactPage already has ${contactCount} records.`);
  }

  // 7. Seed PageBanners
  const pageBannerCount = await PageBanner.countDocuments();
  if (pageBannerCount === 0) {
    console.log("Seeding Page Banners...");
    await PageBanner.insertMany([
      {
        pageKey: "blog",
        title: "HVAC Engineering Insights & Technical Guides",
        image: "/uploads/breadcrumb/1648811523_download.jpg",
        isActive: true,
      },
      {
        pageKey: "contact",
        title: "Contact OG Heavy Duty Customer Care & Project Sizing",
        image: "/uploads/breadcrumb/1648811523_download.jpg",
        isActive: true,
      },
      {
        pageKey: "certifications",
        title: "Engineering Compliance & Quality Certifications",
        image: "/uploads/breadcrumb/1648811523_download.jpg",
        isActive: true,
      },
      {
        pageKey: "gallery",
        title: "High-Ambient Air Conditioners Gallery",
        image: "/uploads/breadcrumb/1648811523_download.jpg",
        isActive: true,
      },
    ]);
    console.log("  ✓ Seeded 4 Page Banners");
  } else {
    console.log(`  - PageBanner already has ${pageBannerCount} records.`);
  }

  // 8. Seed Section & About
  const sectionCount = await Section.countDocuments();
  if (sectionCount === 0) {
    console.log("Seeding Inner Page Section...");
    await Section.create({
      name: "About Us",
      slug: "aboutus",
      bannerImage: "/uploads/breadcrumb/1648811523_download.jpg",
      sort: 1,
      isActive: true,
    });
    console.log("  ✓ Seeded About Us Section");
  } else {
    console.log(`  - Section already has ${sectionCount} records.`);
  }

  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    console.log("Seeding About Us Content...");
    await About.create({
      section: "aboutus",
      slug: "corporate-heritage",
      title: "30+ Years of Heavy-Duty Climate Engineering",
      b_heading: "About OG Heavy Duty",
      content: `
        <h2>Pioneering Heavy-Duty Climate Control in India</h2>
        <p>OG Heavy Duty is India's leading indigenous manufacturer of high-ambient commercial and residential air conditioners. Engineered specifically to tackle extreme 52°C subcontinental heatwaves, our systems incorporate 100% inner-grooved rifled copper coils, oversized tropicalized compressors, and corrosion-resistant hydrophilic blue-fin technology.</p>
        <h2>Executive Leadership & Engineering Rigor</h2>
        <p>Led by visionary founders with decades of frontline HVAC engineering leadership, OG Heavy Duty bridges Japanese precision thermal dynamics with ruggedized Indian electrical tolerances (145V–285V stabilizer-free operation).</p>
      `,
      bannerImage: "/uploads/breadcrumb/1648811523_download.jpg",
      image: "/images/home1/about-img.jpg",
      alt: "OG Heavy Duty Corporate Heritage & Engineering",
      sort: 1,
      isActive: true,
      metatag: "About Us | OG Heavy Duty — Heavy-Duty Commercial & Industrial Air Conditioners",
      metaDescription: "Discover OG Heavy Duty's manufacturing heritage, executive leadership, Make in India commitment, and heavy-duty HVAC systems engineered for severe tropical climates.",
      canonicalUrl: "https://ogheavyduty.in/about-us",
      ogTitle: "About Us | OG Heavy Duty",
      ogDescription: "Discover OG Heavy Duty's 30+ years of high-ambient cooling heritage.",
      twitterCard: "summary_large_image",
      robots: "index, follow",
    });

    // Also seed section: "about" for about-us page direct query
    await About.create({
      section: "about",
      slug: "heritage",
      title: "30+ Years of Heavy-Duty Climate Engineering",
      b_heading: "About OG Heavy Duty",
      content: `
        <h2>Pioneering Heavy-Duty Climate Control in India</h2>
        <p>OG Heavy Duty is India's leading indigenous manufacturer of high-ambient commercial and residential air conditioners. Engineered specifically to tackle extreme 52°C subcontinental heatwaves, our systems incorporate 100% inner-grooved rifled copper coils, oversized tropicalized compressors, and corrosion-resistant hydrophilic blue-fin technology.</p>
        <h2>Executive Leadership & Engineering Rigor</h2>
        <p>Led by visionary founders with decades of frontline HVAC engineering leadership, OG Heavy Duty bridges Japanese precision thermal dynamics with ruggedized Indian electrical tolerances (145V–285V stabilizer-free operation).</p>
      `,
      bannerImage: "/uploads/breadcrumb/1648811523_download.jpg",
      image: "/images/home1/about-img.jpg",
      alt: "OG Heavy Duty Corporate Heritage & Engineering",
      sort: 1,
      isActive: true,
      metatag: "About Us | OG Heavy Duty — Heavy-Duty Commercial & Industrial Air Conditioners",
      metaDescription: "Discover OG Heavy Duty's manufacturing heritage, executive leadership, Make in India commitment, and heavy-duty HVAC systems engineered for severe tropical climates.",
      canonicalUrl: "https://ogheavyduty.in/about-us",
      ogTitle: "About Us | OG Heavy Duty",
      ogDescription: "Discover OG Heavy Duty's 30+ years of high-ambient cooling heritage.",
      twitterCard: "summary_large_image",
      robots: "index, follow",
    });

    console.log("  ✓ Seeded 2 About documents");
  } else {
    console.log(`  - About already has ${aboutCount} records.`);
  }

  // 9. Seed HomeSeo
  const homeSeoCount = await HomeSeo.countDocuments();
  if (homeSeoCount === 0) {
    console.log("Seeding HomeSeo...");
    await HomeSeo.create({
      pageSlug: "home",
      title: "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions",
      metaDescription: "OG Heavy Duty is India's premier manufacturer of high-ambient heavy-duty air conditioners, including Window ACs, Split ACs, Cassette ACs, and Commercial HVAC systems engineered for severe tropical high-ambient climates.",
      metaKeywords: ["Heavy Duty AC", "High Ambient AC", "Commercial HVAC India", "Split AC", "Window AC", "52°C Air Conditioner"],
      canonicalUrl: "https://ogheavyduty.in",
      ogTitle: "OG Heavy Duty | Heavy-Duty Air Conditioners & Commercial HVAC Solutions",
      ogDescription: "Discover heavy-duty air conditioning engineered with 100% inner-grooved copper coils for 52°C extreme climates.",
      ogImage: "/uploads/banner/1649073538_download.jpg",
      twitterCard: "summary_large_image",
      robots: "index, follow",
      h1: "OG Heavy Duty Air Conditioners",
    });
    console.log("  ✓ Seeded HomeSeo");
  } else {
    console.log(`  - HomeSeo already has ${homeSeoCount} records.`);
  }

  console.log("\n=========================================");
  console.log("CMS SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=========================================\n");

  await mongoose.disconnect();
}

seedCMS().catch((err) => {
  console.error("CMS Seeding Failed:", err);
  process.exit(1);
});
