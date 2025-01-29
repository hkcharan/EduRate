import { College } from "../models/collegeModel.js";
import { Review } from "../models/reviewModel.js";

// Add a new review
export const addReview = async (req, res) => {
  try {
    const {
      course,
      year,
      collegeId,
      title,
      facultyRating,
      infrastructureRating,
      placementsRating,
      campusLifeRating,
      valueForMoneyRating,
      facultyComment,
      placementsComment,
      infrastructureComment,
      otherComment,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated or userId missing." });
    }

    // Calculate average rating
    const averageRating =
      (facultyRating + infrastructureRating + placementsRating + campusLifeRating + valueForMoneyRating) / 5;

    // Create new review
    const review = await Review.create({
      userId,
      course,
      year,
      collegeId,
      title,
      facultyRating,
      infrastructureRating,
      placementsRating,
      campusLifeRating,
      valueForMoneyRating,
      averageRating,
      facultyComment,
      placementsComment,
      infrastructureComment,
      otherComment,
    });

    // Recalculate ratings for the college
    const reviews = await Review.find({ collegeId });
    const totalReviews = reviews.length;

    const facultyAvg = reviews.reduce((sum, r) => sum + r.facultyRating, 0) / totalReviews;
    const infraAvg = reviews.reduce((sum, r) => sum + r.infrastructureRating, 0) / totalReviews;
    const placementAvg = reviews.reduce((sum, r) => sum + r.placementsRating, 0) / totalReviews;
    const campusAvg = reviews.reduce((sum, r) => sum + r.campusLifeRating, 0) / totalReviews;
    const moneyAvg = reviews.reduce((sum, r) => sum + r.valueForMoneyRating, 0) / totalReviews;
    const overallAvg = (facultyAvg + infraAvg + placementAvg + campusAvg + moneyAvg) / 5;

    await College.findOneAndUpdate(
      { _id: collegeId },
      {
        facultyRating: facultyAvg,
        infrastructureRating: infraAvg,
        placementsRating: placementAvg,
        campusLifeRating: campusAvg,
        valueForMoneyRating: moneyAvg,
        averageRating: overallAvg,
      }
    );

    res.status(201).json({ message: "Review added successfully and ratings updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update an existing review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course,
      year,
      title,
      facultyRating,
      infrastructureRating,
      placementsRating,
      campusLifeRating,
      valueForMoneyRating,
      placementsComment,
      facultyComment,
      infrastructureComment,
      otherComment,
    } = req.body;

    // Calculate average rating
    const averageRating =
      (facultyRating + infrastructureRating + placementsRating + campusLifeRating + valueForMoneyRating) / 5;

    const review = await Review.findByIdAndUpdate(
      id,
      {
        course,
        year,
        title,
        facultyRating,
        infrastructureRating,
        placementsRating,
        campusLifeRating,
        valueForMoneyRating,
        averageRating,
        placementsComment,
        facultyComment,
        infrastructureComment,
        otherComment,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }

    // Recalculate college ratings
    const reviews = await Review.find({ collegeId: review.collegeId });
    const totalReviews = reviews.length;

    const facultyAvg = reviews.reduce((sum, r) => sum + r.facultyRating, 0) / totalReviews;
    const infraAvg = reviews.reduce((sum, r) => sum + r.infrastructureRating, 0) / totalReviews;
    const placementAvg = reviews.reduce((sum, r) => sum + r.placementsRating, 0) / totalReviews;
    const campusAvg = reviews.reduce((sum, r) => sum + r.campusLifeRating, 0) / totalReviews;
    const moneyAvg = reviews.reduce((sum, r) => sum + r.valueForMoneyRating, 0) / totalReviews;
    const overallAvg = (facultyAvg + infraAvg + placementAvg + campusAvg + moneyAvg) / 5;

    await College.findOneAndUpdate(
      { _id: review.collegeId },
      {
        facultyRating: facultyAvg,
        infrastructureRating: infraAvg,
        placementsRating: placementAvg,
        campusLifeRating: campusAvg,
        valueForMoneyRating: moneyAvg,
        averageRating: overallAvg,
      }
    );

    res.status(200).json({ message: "Review updated successfully and ratings recalculated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { rid } = req.body;
    const review = await Review.findByIdAndDelete({_id:rid});
    if (!review) {
      return res.status(404).json({ message: "Review not found!" });
    }

    // Recalculate college ratings
    const reviews = await Review.find({ collegeId: review.collegeId });
    const totalReviews = reviews.length;

    let facultyAvg = 0,
      infraAvg = 0,
      placementAvg = 0,
      campusAvg = 0,
      moneyAvg = 0,
      overallAvg = 0;
    

    if (totalReviews > 0) {
      facultyAvg =
        reviews.reduce((sum, r) => sum + r.facultyRating, 0) / totalReviews;
      infraAvg =
        reviews.reduce((sum, r) => sum + r.infrastructureRating, 0) /
        totalReviews;
      placementAvg =
        reviews.reduce((sum, r) => sum + r.placementsRating, 0) / totalReviews;
        campusAvg =
        reviews.reduce((sum, r) => sum + r.campusLifeRating, 0) / totalReviews;
        moneyAvg =
        reviews.reduce((sum, r) => sum + r.valueForMoneyRating, 0) / totalReviews;
      overallAvg = (facultyAvg + infraAvg + placementAvg + campusAvg + moneyAvg) / 5;
    }

    await College.findOneAndUpdate(
      { _id: review.collegeId },
      {
        facultyRating: facultyAvg,
        infrastructureRating: infraAvg,
        placementsRating: placementAvg,
        campusLifeRating: campusAvg,
        valueForMoneyRating: moneyAvg,
        averageRating: overallAvg,
      }
    );

    res
      .status(200)
      .json({
        message: "Review deleted successfully and ratings recalculated!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getReview = async (req, res)=>{
try {

  const {id} = req.params

  const data = await Review.findById(id);

  if(!data){
    return res.status(400).json({message:"Review Not Found"});
  }

  res.status(201).json({data})
  
} catch (error) {
  console.error(error);
  res.status(500).json({message: "some error occurred while fetching review"})
}

}


export const getReviews =async (req, res) => {
  try {
    const reviews = await Review.find();
  
    return res.status(201).json({reviews})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
  }
  
  }