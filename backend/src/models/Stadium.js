import mongoose from "mongoose";

const stadiumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    sections: [
      {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        capacity: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Stadium", stadiumSchema);
