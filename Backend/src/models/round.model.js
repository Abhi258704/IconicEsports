import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    roundNumber: {
      type: Number,
      required: true,
    },

    qualificationCount: {
      type: Number,
      default: 4,
    },
    
    previousRound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
    },
    
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

roundSchema.index(
   {
      tournament: 1,
      roundNumber: 1,
   },
   {
      unique: true,
   }
);

const Round = mongoose.model("Round", roundSchema);

export default Round;