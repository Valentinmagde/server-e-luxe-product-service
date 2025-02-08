import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const shippingSchema = new mongoose.Schema(
  {
    weight: Number,
    dimension: {
      length: Number,
      width: Number,
      height: Number,
    },
    class: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: false },
    sku: { type: String, required: false },
    barcode: { type: String, required: false },
    name: { type: String, required: false },
    title: { type: Object, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, required: false },
    slug: { type: String, required: true },
    image: { type: [String], required: false },
    brand: { type: String, required: false },
    short_description: { type: Object, required: false },
    description: { type: Object, required: false },
    price: { type: Number, required: false },
    prices: {
      original_price: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: false,
      },
    },
    promotional_price: { type: Number, required: false },
    discount: { type: Number, required: false },
    initial_stock: { type: Number, required: false },
    current_stock: { type: Number, required: false },
    sales_count: { type: Number, default: 0, required: false },
    featured: { type: Boolean, default: false },
    promotional: { type: Boolean, default: false },
    date_from_promo: { type: Date, require: false },
    date_to_promo: { type: Date, require: false },
    rating: { type: Number, required: false },
    num_reviews: { type: Number, required: false },
    reviews: [reviewSchema],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    tag: [String],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    variants: [{}],
    is_combination: { type: Boolean, required: true },
    status: { type: String, default: "show", enum: ["show", "hide"] },
    related_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    upsells: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    cross_sells: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    extras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "extra",
      },
    ],
    store: { type: mongoose.Schema.Types.ObjectId },
    shipping: shippingSchema,
    translations: { type: Object, required: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Product = mongoose.model("product", productSchema);

export default Product;
