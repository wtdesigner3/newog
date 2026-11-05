#!/usr/bin/env node
/**
 * Section Headings & CTA Content Seeder
 * Populates HomeExtra, Cta, and Othercta collections with authentic OG Heavy Duty content
 * including section tagline pill badges, titles, and descriptions.
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

import HomeExtra from "../src/app/models/HomeExtra.js";
import Cta from "../src/app/models/Cta.js";
import Othercta from "../src/app/models/Othercta.js";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function seedHeadings() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  console.log("Connected to:", mongoose.connection.name);

  // 1. Seed or Update HomeExtra
  const existingHomeExtra = await HomeExtra.findOne();
  const homeExtraData = {
    product_badge: "HEAVY-DUTY HVAC CLASSIFICATIONS",
    product_title: "Our Complete Product Range",
    product_subtitle: "From severe high-ambient window and split units built for 52°C tropical heatwaves to commercial ceiling cassettes, high-throw towers, and central ductables.",

    choose_badge: "ENGINEERING BENCHMARK",
    choose_title: "Heavy-Duty Architecture For Demanding Climates",
    choose_subtitle: "Six verified engineering benchmarks that keep OG Heavy Duty systems performing where standard air conditioners degrade.",

    certified_badge: "PROVEN SCALE",
    certified_title: "Engineered For Peak Performance",
    certified_subtitle: "Four core milestones defining 30+ years of frontline industrial HVAC leadership across India.",

    work_badge: "TRUSTED BY INDUSTRY LEADERS",
    work_title: "Prestigious Commercial & Institutional Clientele",
    work_subtitle: "OG Heavy Duty equipment is installed across premier state institutions, private corporate towers, high-density banquet facilities, and multi-speciality medical centres.",

    blog_badge: "TECHNICAL ARTICLES & GUIDES",
    blog_title: "HVAC Engineering & Cooling Insights",
    blog_subtitle: "Educational cooling guides, 52°C tropical engineering benchmarks, and commercial equipment maintenance insights from our certified HVAC engineering team.",

    contact_badge: "Get a Quote",
    contact_title: "Heavy-duty engineering, uninterrupted continuous cooling.",
    contact_subtitle: "Pan-India turnkey solutions for commercial, industrial, and high-ambient institutions. Engineered to endure 52°C extreme climates.",
  };

  if (existingHomeExtra) {
    await HomeExtra.findByIdAndUpdate(existingHomeExtra._id, homeExtraData);
    console.log("  ✓ Updated HomeExtra with authentic tagline pills, titles & descriptions");
  } else {
    await HomeExtra.create(homeExtraData);
    console.log("  ✓ Created HomeExtra with authentic tagline pills, titles & descriptions");
  }

  // 2. Seed Cta (Some CTA / CTA One)
  const existingCta = await Cta.findOne();
  const ctaData = {
    title: "Turnkey Heavy-Duty Commercial HVAC Solutions",
    content: "Engineered for factories, hospitals, auditoriums, and commercial complexes with custom ducting, central sizing, and direct OEM technical submittals.",
    image: "/images/banner_ac_commercial.jpg",
  };
  if (existingCta) {
    await Cta.findByIdAndUpdate(existingCta._id, ctaData);
    console.log("  ✓ Updated CTA One");
  } else {
    await Cta.create(ctaData);
    console.log("  ✓ Created CTA One");
  }

  // 3. Seed Othercta (Something CTA / CTA Two)
  const existingOthercta = await Othercta.findOne();
  const otherctaData = {
    subtitle: "Turnkey HVAC Projects",
    title: "Heavy-duty engineering, uninterrupted continuous cooling.",
    content: "Pan-India turnkey solutions for commercial, industrial, and high-ambient institutions. Engineered to endure 52°C extreme climates.",
    buttonText1: "Request a Quotation",
    url1: "/contact",
    buttonText2: "Download Catalogue",
    url2: "/uploads/OG Heavy Duty-updated.pdf",
    image: "/images/banner_ac_industrial.jpg",
  };
  if (existingOthercta) {
    await Othercta.findByIdAndUpdate(existingOthercta._id, otherctaData);
    console.log("  ✓ Updated CTA Two");
  } else {
    await Othercta.create(otherctaData);
    console.log("  ✓ Created CTA Two");
  }

  console.log("\nAll Section Tagline Pills, Headings & CTA records seeded successfully!");
  await mongoose.disconnect();
}

seedHeadings().catch((err) => {
  console.error("Headings Seeding Failed:", err);
  process.exit(1);
});
