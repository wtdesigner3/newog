import mongoose from "mongoose";

const ctaSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: "MEP & HVAC ENGINEERING SUPPORT",
  },
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  buttonText: {
    type: String,
    default: "Consult Engineering Desk",
  },
  buttonUrl: {
    type: String,
    default: "/contact-us",
  },
  image: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.Cta) {
  delete mongoose.models.Cta;
}

export default mongoose.models.Cta || mongoose.model("Cta", ctaSchema);
