import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    game: {
      type: String,
      default: "BGMI",
    },

    prizePool: {
      type: Number,
      required: true,
    },

    maxTeams: {
      type: Number,
      default: 64,
    },

    teamSize: {
      type: Number,
      default: 4,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    rules: [String],

    startDate: Date,
  },
  {
    timestamps: true,
  }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;