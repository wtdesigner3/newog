import mongoose from "mongoose";

const homeAboutSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: "PIONEERING HIGH-AMBIENT HVAC",
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
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.HomeAbout) {
  delete mongoose.models.HomeAbout;
}

export default mongoose.models.HomeAbout || mongoose.model("HomeAbout", homeAboutSchema);
