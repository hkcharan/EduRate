import { College } from "../models/collegeModel.js";
import { Review } from "../models/reviewModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

// Add a new college
export const addCollege = async (req, res) => {
  try {
    const { emailDomain, name , address,about} = req.body; // Include courses from the request body
    const courses = JSON.parse(req.body.courses || "[]"); // Parse JSON string to array
    const info = JSON.parse(req.body.info || "[]"); // Pa
    const files = req.files;

    // Check if the college already exists
    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists!" });
    }

    let logoUrl = "";
    let imageUrls = [];

    // Upload logo to Cloudinary
    if (files && files.logo) {
      const result = await cloudinary.uploader.upload(files.logo[0].path, {
        folder: "college_logos",
      });
      logoUrl = result.secure_url;

      // Delete temporary file
      await fs.unlink(files.logo[0].path);
    }

    // Upload images to Cloudinary
    if (files && files.images) {
      for (const image of files.images) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "college_images",
        });
        imageUrls.push(result.secure_url);

        // Delete temporary file
        await fs.unlink(image.path);
      }
    }

    // Create a new college
    const college = await College.create({
      emailDomain,
      name,
      address,
      about,
      courses: Array.isArray(courses) ? courses : [], // Ensure courses is an array or set it to an empty array
      info: Array.isArray(info) ? info : [], // Ensure courses is an array or set it to an empty array
      logo: logoUrl,
      images: imageUrls,
    });

    res.status(201).json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};


// Update college details
export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, emailDomain,about, address} = req.body; 
    const courses = JSON.parse(req.body.courses || "[]"); // Parse JSON string to array
    const info = JSON.parse(req.body.info || "[]"); // Pa// Include courses from the request body
    const files = req.files;

    // Find the college by ID
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found!" });
    }

    let logoUrl = college.logo; // Keep the existing logo by default
    let imageUrls = college.images; // Keep the existing images by default

    // Upload and update the logo if provided
    if (files && files.logo) {
      // Delete the existing logo from Cloudinary
      if (college.logo) {
        const publicId = college.logo.split("/").pop().split(".")[0]; // Extract public ID from the URL
        await cloudinary.uploader.destroy(`college_logos/${publicId}`);
      }

      // Upload the new logo to Cloudinary
      const result = await cloudinary.uploader.upload(files.logo[0].path, {
        folder: "college_logos",
      });
      logoUrl = result.secure_url;

      // Delete temporary file
      await fs.unlink(files.logo[0].path);
    }

    // Upload and update images if provided
    if (files && files.images) {
      // Delete the existing images from Cloudinary
      for (const image of college.images) {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public ID from the URL
        await cloudinary.uploader.destroy(`college_images/${publicId}`);
      }

      imageUrls = []; // Reset the images array

      // Upload the new images to Cloudinary
      for (const image of files.images) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "college_images",
        });
        imageUrls.push(result.secure_url);

        // Delete temporary file
        await fs.unlink(image.path);
      }
    }

    // Validate courses if provided
    let updatedCourses = college.courses; // Keep existing courses by default
    if (courses) {
      if (!Array.isArray(courses) || courses.some(course => typeof course !== 'string')) {
        return res.status(400).json({ message: "Courses must be an array of strings." });
      }
      updatedCourses = courses; // Update with new courses
    }
    // Validate info if provided
    let updatedInfo = college.info; // Keep existing courses by default
    if (info) {
      if (!Array.isArray(info) || info.some(info => typeof info !== 'string')) {
        return res.status(400).json({ message: "info must be an array of strings." });
      }
      updatedInfo = info; // Update with new courses
    }

    // Update college details
    college.name = name || college.name;
    college.emailDomain = emailDomain || college.emailDomain;
    college.address = address || college.address;
    college.about = about || college.about;
    college.info = updatedInfo;
    college.courses = updatedCourses;
    college.logo = logoUrl;
    college.images = imageUrls;

    // Save the updated college
    await college.save();

    res.status(200).json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};



export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the college by ID
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found!" });
    }

    // Delete logo from Cloudinary
    if (college.logo) {
      const publicId = college.logo.split("/").pop().split(".")[0]; // Extract public ID from the URL
      await cloudinary.uploader.destroy(`college_logos/${publicId}`);
    }

    // Delete images from Cloudinary
    if (college.images && college.images.length > 0) {
      for (const image of college.images) {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public ID from the URL
        await cloudinary.uploader.destroy(`college_images/${publicId}`);
      }
    }

    // Delete the college from the database
    await College.findOneAndDelete({_id : id});

    res.status(200).json({ message: "College deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};



// Get college details
export const getCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found!" });
    }

    res.status(200).json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get My college details

export const getMyCollege = async (req, res) => {
  try {
    const { id } = req.body; // Extract id from the request body
    if (!id) {
      return res.status(400).json({ error: "College ID is required" });
    }

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found!" });
    }

    res.status(200).json(college);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



// Get all reviews for a specific college
export const getAllReviews = async (req, res) => {
  try {
    const { id } = req.params; // Get collegeId from request parameters

    // Fetch all reviews for the specified college
    const reviews = await Review.find({ collegeId: id });

    // If no reviews are found, return a message
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this college." });
    }

    // Send the reviews as the response
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const searchColleges = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the query
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required." });
    }


    // Perform search
    const colleges = await College.find({
      name: { $regex: query, $options: "i" },
    });

    if (colleges.length === 0) {
      return res.status(404).json({ message: "No colleges found!" });
    }

    res.status(200).json(colleges);
  } catch (error) {
    console.error("Search Colleges Error:", error.message);
    res.status(500).json({ error: "An unexpected server error occurred." });
  }
};


export const getColleges =async (req, res) => {
try {
  const colleges = await College.find();

  return res.status(201).json({colleges})
} catch (error) {
  return res.status(500).json({message:"Internal Server Error"})
}

}
