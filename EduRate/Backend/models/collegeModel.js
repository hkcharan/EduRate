import mongoose from 'mongoose';
import { Review } from './reviewModel.js';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailDomain: { type: String, required: true,  },
  address: { type: String, required: true,  },
  about: { type: String, required: true,  },
  info: { type: [String], default: [] },
  courses: { type: [String], default: [] },
  averageRating: { type: Number, default: 0 },
  facultyRating: { type: Number, default: 0 },
  infrastructureRating: { type: Number, default: 0 },
  placementsRating: { type: Number, default: 0 },
  campusLifeRating: { type: Number, default: 0 },
  valueForMoneyRating: { type: Number, default: 0 },
  logo: { type: String, default: "" }, // Logo URL
  images: { type: [String], default: [] }, // Array of image URLs
});


collegeSchema.pre("findOneAndDelete", async function (next) {
  const collegeId = this.getQuery()._id;

  // Delete all reviews associated with this college
  await Review.deleteMany({ collegeId });
  next();
  
});
  
  
export const College = mongoose.model('College', collegeSchema);
