import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  ign: String,
  uid: String,
  phone: String,
});

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },

    leaderName: String,

    leaderPhone: String,

    players: [playerSchema],

    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    qualifiedRounds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Round",
      },
    ],

    qualified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;