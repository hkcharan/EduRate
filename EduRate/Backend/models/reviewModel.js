import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId:{ type: String, required: true },
  collegeId: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  title: { type: String, required: true },
  averageRating: {type: String, required:true},
  facultyRating: { type: Number, required: true },
  infrastructureRating: { type: Number, required: true },
  placementsRating: { type: Number, required: true },
  campusLifeRating: { type: Number, required: true },
  valueForMoneyRating: { type: Number, required: true },
  placementsComment:{type:String, required: true},
  infrastructureComment:{type:String, required: true},
  facultyComment:{type:String, required: true},
  otherComment: {type:String},
}, {timestamps:true});
  
export const Review = mongoose.model('Review', ReviewSchema);
