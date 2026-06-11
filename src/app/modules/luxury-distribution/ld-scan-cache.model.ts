import mongoose from "mongoose";

const ldScanCacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    cached_at: { type: Date, required: true },
  },
  { timestamps: false }
);

const LdScanCache = mongoose.model("ld_scan_cache", ldScanCacheSchema);
export default LdScanCache;
