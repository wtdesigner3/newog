import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: true,
    default: "Milestone",
  },
  valueType: {
    type: String,
    enum: ["number", "text"],
    default: "number",
  },
  target: {
    type: Number,
    default: 0,
  },
  suffix: {
    type: String,
    default: "",
  },
  formatNumber: {
    type: Boolean,
    default: false,
  },
  textValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  subtext: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "Award",
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

if (process.env.NODE_ENV !== "production" && mongoose.models.Milestone) {
  delete mongoose.models.Milestone;
}

export default mongoose.models.Milestone || mongoose.model("Milestone", milestoneSchema);

