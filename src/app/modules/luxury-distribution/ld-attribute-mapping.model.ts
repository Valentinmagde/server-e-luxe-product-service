import mongoose from "mongoose";

const ldAttributeMappingSchema = new mongoose.Schema(
  {
    ld_value: { type: String, required: true, unique: true, trim: true },
    eluxe_attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "attribute",
      required: true,
    },
    eluxe_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const LdAttributeMapping = mongoose.model(
  "ld_attribute_mapping",
  ldAttributeMappingSchema
);

export default LdAttributeMapping;
