import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    placementPoints: {
      type: Number,
      default: 0,
    },

    kills: {
      type: Number,
      default: 0,
    },

    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    round: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    matchNumber: {
      type: Number,
      required: true,
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    map: {
      type: String,
      enum: ["Erangel", "Miramar", "Rondo"],
      default: "Erangel",
      required: true,
    },

    roomId: {
      type: String,
    },

    roomPassword: {
      type: String,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },

    results: [resultSchema],
  },
  {
    timestamps: true,
  }
);

matchSchema.index(
   {
      group: 1,
      matchNumber: 1,
   },
   {
      unique: true,
   }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;