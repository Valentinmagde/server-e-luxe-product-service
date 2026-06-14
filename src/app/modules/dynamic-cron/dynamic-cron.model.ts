import mongoose from "mongoose";

const dynamicCronSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cron_expression: { type: String, required: true },
    action: { type: String, enum: ["ld-sync", "webhook"], required: true },
    webhook_url: { type: String },
    webhook_method: { type: String, enum: ["GET", "POST"], default: "POST" },
    enabled: { type: Boolean, default: true },
    status: { type: String, enum: ["idle", "running"], default: "idle" },
    last_run_at: { type: Date, default: null },
    next_run_at: { type: Date, default: null },
    last_result: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const DynamicCron = mongoose.model("dynamic_cron", dynamicCronSchema);
export default DynamicCron;
