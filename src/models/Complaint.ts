import mongoose, { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // "Product" | "Service" | "Support"
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    dateSubmitted: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Complaint || model("Complaint", ComplaintSchema);
