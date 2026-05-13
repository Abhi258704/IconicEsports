import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    game: {
      type: String,
      default: "BGMI",
    },

    prizePool: {
      type: Number,
      required: true,
    },

    entryFee: {
      type: Number,
      default: 0,
    },

    maxTeams: {
      type: Number,
      default: 64,
    },

    teamSize: {
      type: Number,
      default: 4,
    },

    teamsPerGroup: {
      type: Number,
      default: 16,
    },

    maps: [
      {
        type: String,
        enum: [
          "Erangel",
          "Miramar",
          "Sanhok",
          "Livik",
          "Rondo",
        ],
      },
    ],

    banner: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "registration-open",
        "ongoing",
        "completed",
      ],
      default: "upcoming",
    },

    registrationOpen: {
      type: Boolean,
      default: true,
    },

    rules: [
      {
        type: String,
      },
    ],

    startDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    rounds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Round",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Tournament = mongoose.model(
  "Tournament",
  tournamentSchema
);

export default Tournament;