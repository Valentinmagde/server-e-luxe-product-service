import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    title: { type: Object, required: true },
    logo: { type: String, required: false },
    coupon_code: { type: String, required: true },
    start_time: { type: String, required: false },
    end_time: { type: String, required: true },
    discount_type: { type: Object, required: false },
    minimum_amount: { type: Number, required: true },
    product_type: { type: String, required: false },
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

const Coupon = mongoose.model("coupon", couponSchema);

export default Coupon;
