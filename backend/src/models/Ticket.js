import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qrToken: { type: String, required: true, unique: true, select: false },
    status: {
      type: String,
      enum: ["valid", "used", "cancelled"],
      default: "valid",
    },
  },
  { timestamps: true }
);

ticketSchema.index({ booking: 1 });

export default mongoose.model("Ticket", ticketSchema);
