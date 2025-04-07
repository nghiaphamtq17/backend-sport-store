const mongoose = require("mongoose");

const SportTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    collectionId: { type: Types.ObjectId, ref: "Collection", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SportType", SportTypeSchema);
