import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: false,
    },
    description: {
      type: Object,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  }
);

const attributeSchema = new mongoose.Schema(
  {
    title: { type: Object, required: true },
    name: { type: Object, required: true },
    option: { type: String, enum: ["Dropdown", "Radio", "Checkbox"] },
    variants: [variantSchema],
    type: {
      type: String,
      default: "Button",
      enum: ["TextColor", "Image", "Button"],
    },
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

const Attribute = mongoose.model("attribute", attributeSchema);

export default Attribute;
