const mongoose = require('mongoose');

//const ReviewSchema = new mongoose.Schema({
//  reviewerEmail: String,
//  rating: Number,
//  comment: String,
//  timestamp: Date
//}, { _id: false }); // avoid auto-generating _id for subdocs

const MergedUserSchema = new mongoose.Schema({
  user_id: Number,
  f_name: String,
  l_name: String,
  gender: String,
  age: Number,
  skills_i_want: String,
  category_skills_i_want: String,
  skills_i_have: String,
  category_skills_i_have: String,
  availability: String,
  email: String,
  university: String,
  username: String,
  image: String,
  reviews: [
        {
            reviewerEmail: String,
            rating: Number,
            comment: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]// ✅ Add reviews field here
}, { collection: 'MergedCollection' });

mongoose.model('MergedUser', MergedUserSchema);
