import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// A user can't have two categories with the same name
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);