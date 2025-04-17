const mongoose = require("mongoose");

const SportTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    classi: [
        {
            color: 'red',
            size: []
        }
    ],
    collectionId: { type: Types.ObjectId, ref: "Collection", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", SportTypeSchema);
