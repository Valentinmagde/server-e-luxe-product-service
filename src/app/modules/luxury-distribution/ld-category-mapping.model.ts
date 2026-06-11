import mongoose from "mongoose";

const ldCategoryMappingSchema = new mongoose.Schema(
  {
    ld_category: { type: String, required: true, unique: true, trim: true },
    eluxe_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const LdCategoryMapping = mongoose.model(
  "ld_category_mapping",
  ldCategoryMappingSchema
);

export default LdCategoryMapping;
