import mongoose, { Document } from "mongoose";

export interface IAssociatedCost extends Document {
  title: any;
  amount: any;
  currency: string;
  description?: any;
  amount_type: string;
  percentage: any;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const associatedCostSchema = new mongoose.Schema(
  {
    title: { type: Object, required: true },
    amount: { type: Number, required: false },
    currency: { type: String, enum: ["EUR", "USD", "GBP"], required: false },
    description: { type: Object, required: false },
    amount_type: { type: String, enum: ["fixed", "percentage"], required: false, default: "fixed" },
    percentage: { type: Number, required: false },
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

export default mongoose.model<IAssociatedCost>(
  "associated_cost",
  associatedCostSchema
);
