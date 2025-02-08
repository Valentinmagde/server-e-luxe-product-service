import mongoose from "mongoose";

const tagShema = new mongoose.Schema(
  {
    name: { type: Object, require: true },
    slug: { type: Object, require: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
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

const Tag = mongoose.model("tag", tagShema);

export default Tag;
