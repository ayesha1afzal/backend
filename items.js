const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  // _id: { type: String, unique: true }, // Unique ID
  // Name: String,
  ItemName: String,
  Category: String,
  Condition: String,
  Description: String,
  Image: String, // URL of the uploaded image
  f_name: String,
  l_name: String,
  email: String,
  Name: String // for display
}, { collection: 'items' });

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
