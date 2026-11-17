import mongoose from "mongoose";

const homeAboutSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: "PIONEERING HIGH-AMBIENT COOLING",
  },
  title: {
    type: String,
    default: "Engineered to Cool Where Ordinary Air Conditioners Fail",
  },
  short_description: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "OG Heavy Duty Manufacturing & Precision Engineering",
  },
  experience_years: {
    type: String,
    default: "30+ Years",
  },
  experience_text: {
    type: String,
    default: "Severe Tropical Heatwave Resilience (52°C Tested)",
  },
  button_text: {
    type: String,
    default: "Explore Full Heritage Story",
  },
  button_url: {
    type: String,
    default: "/about-us",
  },
  // Strategic Direction: Mission, Vision & Core Values (About Us Page)
  mission_title: {
    type: String,
    default: "High-Ambient Reliability",
  },
  mission_desc: {
    type: String,
    default: "To engineer robust, heavy-duty climate control systems that maintain deep thermal pull-down under India's severe 52°C tropical extremes without compressor tripouts.",
  },
  mission_highlight: {
    type: String,
    default: "52°C Non-Tripping Operation",
  },
  vision_title: {
    type: String,
    default: "Sustainable Cold Innovation",
  },
  vision_desc: {
    type: String,
    default: "To be India's benchmark heavy-duty air conditioning brand, championing low-GWP refrigerants (R32 / R410A) and energy-conserving inverter drives for industrial decarbonization.",
  },
  vision_highlight: {
    type: String,
    default: "Zero-ODP & High-SEER Inverters",
  },
  values_title: {
    type: String,
    default: "Integrity & Engineering Rigor",
  },
  values_desc: {
    type: String,
    default: "100% pure inner-grooved rifled copper coils, Japanese-standard thermal balance testing, and transparent industrial specifications.",
  },
  values_highlight: {
    type: String,
    default: "100% Pure Inner-Grooved Copper",
  },
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.HomeAbout) {
  delete mongoose.models.HomeAbout;
}

export default mongoose.models.HomeAbout || mongoose.model("HomeAbout", homeAboutSchema);
