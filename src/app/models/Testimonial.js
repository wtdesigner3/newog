import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "",
    trim: true,
  },
  company: {
    type: String,
    default: "",
    trim: true,
  },
  equipment: {
    type: String,
    default: "",
    trim: true,
  },
  highlight: {
    type: String,
    default: "",
    trim: true,
  },
  stars: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  quote: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  sort: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.Testimonial) {
  delete mongoose.models.Testimonial;
}

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

