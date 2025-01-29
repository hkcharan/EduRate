import express from "express";
import {
  addCollege,
  deleteCollege,
  getAllReviews,
  getCollege,
  getColleges,
  getMyCollege,
  searchColleges,
  updateCollege,
} from "../controllers/collegeController.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "logo", maxCount: 1 }, // Single logo upload
    { name: "images", maxCount: 10 }, // Multiple images upload
  ]),
  addCollege
);
router.put(
    "/update/:id",
    upload.fields([
      { name: "logo", maxCount: 1 }, // Single logo
      { name: "images", maxCount: 5 }, // Multiple images
    ]),
    updateCollege
  );
router.delete("/delete/:id", deleteCollege);
router.get("/search", searchColleges);
router.get("/getall",getColleges)
router.get("/:id", getCollege);
router.post("/mycollege",getMyCollege)
router.get("/reviews/:id", getAllReviews);

export default router;
