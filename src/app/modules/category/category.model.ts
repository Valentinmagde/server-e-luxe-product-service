import mongoose from "mongoose";

const categoryShema = new mongoose.Schema(
  {
    name: { type: Object, require: true },
    slug: { type: String, require: true },
    description: { type: Object, required: false },
    parent_id: { type: String, required: false },
    parent_name: { type: String, required: false },
    id: { type: String, required: false },
    icon: { type: String, required: false },
    image: { type: String, required: false },
    is_top_category: { type: Boolean, default: false },
    status: { type: String, lowercase: true, enum: ['show', 'hide'], default: 'show' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Category = mongoose.model("category", categoryShema);

export default Category;
