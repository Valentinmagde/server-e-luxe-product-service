import mongoose, { Document } from "mongoose";

export interface IExchangeRate extends Document {
  from_currency: string;
  to_currency: string;
  rate: number;
  fee_percentage: number;
  status: string;
}

const exchangeRateSchema = new mongoose.Schema({
  from_currency: { type: String, required: true, enum: ["EUR", "USD", "GBP"] },
  to_currency: { type: String, required: true, enum: ["USD", "EUR", "GBP"] },
  rate: { type: Number, required: true },
  fee_percentage: { type: Number, default: 0.5 },
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

export default mongoose.model<IExchangeRate>("exchange_rate", exchangeRateSchema);
