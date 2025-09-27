import mongoose from "mongoose";

const categoryShema = new mongoose.Schema(
  {
    name: { type: Object, required: true },
    slug: { type: String, required: false },
    description: { type: Object, required: false },
    parent_id: { type: String, required: false },
    parent_name: { type: Object, required: false },
    id: { type: String, required: false },
    icon: { type: String, required: false },
    image: { type: String, required: false },
    is_top_category: { type: Boolean, default: false },
    show_products_on_homepage: { type: Boolean, default: false },
    status: { type: String, lowercase: true, enum: ['show', 'hide'], default: 'show' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    position: { type: Number, default: 0 },
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
