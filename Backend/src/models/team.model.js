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

    currentRound: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Round",
    },

    isEliminated: {
      type: Boolean,
      default: false,
    },

    eliminatedInRound: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Round",
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

teamSchema.index(
   {
      tournament: 1,
      registeredBy: 1,
   },
   {
      unique: true,

      partialFilterExpression: {
         registeredBy: {
            $exists: true,
         },
      },
   }
);

teamSchema.index({
   tournament: 1,
   status: 1,
});

teamSchema.index({
   group: 1,
});

teamSchema.index({
   currentRound: 1,
});


const Team = mongoose.model("Team", teamSchema);

export default Team;