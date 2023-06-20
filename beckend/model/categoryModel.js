import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  Category_name: {
    type: String,
    required: [true, "Please enter a category name"],
  },
  sorting: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;