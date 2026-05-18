import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
    },

    round: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
    },

    maxTeams: {
      type: Number,
      default: 16,
    },

    qualificationLocked: {
      type: Boolean,
      default: false,
    },

    qualifiedTeams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    }],

    movedToRound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

  },
  {
    timestamps: true,
  }
);

groupSchema.index({
  round: 1,
});

groupSchema.index({
  tournament: 1,
});

groupSchema.index(
  {
    round: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;