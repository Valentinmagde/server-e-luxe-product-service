import mongoose from "mongoose";

const ldTagMappingSchema = new mongoose.Schema(
  {
    ld_tag: { type: String, required: true, unique: true, trim: true },
    eluxe_tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const LdTagMapping = mongoose.model("ld_tag_mapping", ldTagMappingSchema);
export default LdTagMapping;
