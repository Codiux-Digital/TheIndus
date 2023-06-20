import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter a product price"],
    maxLength: [8, "Price should be 8 digits"],
  },
  discount_price: {
    type: Number,
    required: [true, "Please enter a discounted price"],
    maxLength: [8, "Discounted price should be 8 digits"],
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category", // Reference the Category model
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user", // Reference the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const productModel = mongoose.model("Product", productSchema);

export default productModel;
