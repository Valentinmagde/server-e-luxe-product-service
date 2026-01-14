import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: false },
    font: { type: String, required: false },
    color: { type: String, required: false },
    position: { type: String, required: false },
    fileUrl: { type: String, required: false },
    notes: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "rejected",
        "approved",
        "cancelled",
        "processing",
        "completed",
      ],
      default: "pending",
    },
    completed_at: { type: Date, required: false }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Customization = mongoose.model("customization", customizationSchema);

export default Customization;
