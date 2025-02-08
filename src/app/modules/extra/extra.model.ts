import mongoose from "mongoose";

const extraSchema = new mongoose.Schema(
  {
    title: { type: Object, required: true },
    name: { type: Object, required: false },
    description: { type: Object },
    price: { type: Number },
    related_product: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, // Pour les extras produits
    options: { type: Object }, // Pour les extras personnalisables
    type: {
      type: String,
      enum: ["Simple", "Product", "Custom", "Grouped"],
      required: true,
    },
    group_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }], // Pour les extras groupés
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// module.exports = attributeSchema;

const Extra = mongoose.model("extra", extraSchema);

export default Extra;
