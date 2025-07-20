import mongoose, { Document } from "mongoose";

export interface IProfitGrid extends Document {
  min_amount: number;
  max_amount: number;
  gross_rate: number;
  deduction_rate: number;
  net_rate: number;
  status: string;
}

const profitGridSchema = new mongoose.Schema({
  min_amount: { type: Number, required: true },
  max_amount: { type: Number, required: true },
  gross_rate: { type: Number, required: true }, // Taux brut (ex: 18%)
  deduction_rate: { type: Number, default: 35 }, // Prélèvement (ex: 35%)
  net_rate: { type: Number }, // Taux net calculé (grossRate * (1 - deductionRate))
  status: {
    type: String,
    lowercase: true,
    enum: ["show", "hide"],
    default: "show",
  }},
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Calcul automatique du taux net avant sauvegarde
profitGridSchema.pre("save", function(next) {
  this.net_rate = Number((Number(this.gross_rate) * (1 - Number(this.deduction_rate) / 100)).toFixed(2));
  next();
});

export default mongoose.model<IProfitGrid>("profit_grid", profitGridSchema);
