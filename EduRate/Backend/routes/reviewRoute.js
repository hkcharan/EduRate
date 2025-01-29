import express from "express"
import { addReview, deleteReview, getReview, getReviews, updateReview } from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add",isAuthenticated, addReview);
router.get("/reviews",isAuthenticated,getReviews);
router.get("/:id",isAuthenticated,getReview);
router.put("/update/:id",isAuthenticated, updateReview);
router.delete("/delete",isAuthenticated, deleteReview);


export default router;