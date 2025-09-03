const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  address:     { type: String, required: true },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status:       { type: Number, default: 1 }, // 1 = active, 2 = inactive, 3 = given away
  image:        { type: String },
  category:     { type: String },
  availableUntil: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;