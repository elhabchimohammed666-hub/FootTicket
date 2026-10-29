import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 0 },
    reservedCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    homeTeam: { type: String, required: true, trim: true },
    awayTeam: { type: String, required: true, trim: true },
    homeLogoUrl: { type: String, trim: true },
    awayLogoUrl: { type: String, trim: true },
    competition: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    offers: { type: [offerSchema], default: [] },
  },
  { timestamps: true }
);

matchSchema.index({ startsAt: 1, status: 1 });
matchSchema.index({ competition: 1, startsAt: 1 });

export default mongoose.model("Match", matchSchema);
