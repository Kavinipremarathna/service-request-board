const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Plumbing",
          "Electrical",
          "Painting",
          "Joinery",
          "Roofing",
          "Flooring",
          "Gardening",
          "Cleaning",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
      default: "Other",
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9\s\-()]{7,20}$/, "Please provide a valid phone number"],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Open",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for seeded jobs (no owner)
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search functionality
jobRequestSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("JobRequest", jobRequestSchema);
