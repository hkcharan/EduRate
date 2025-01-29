import { BiBookmark } from "react-icons/bi"; 
import { MdVerifiedUser } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import {

  FaPen,
  FaUserTie,
  FaBuilding,
  FaBriefcase,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import {
  FaStar,
  FaSchool,
  FaHome,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
import VerifyEmail from "@/components/VerifyEmail";
import { useSelector } from "react-redux";
import Authentication from "@/components/Authentication";
import ReviewCard from "@/components/ReviewCard";
import { toast } from "react-toastify";

const CollegeDetails = () => {
  const BACKEND_URL = "http://localhost:8000/api";
  const { id } = useParams();
  const [college, setCollege] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getCollege = async () => {
      await axios
        .get(`${BACKEND_URL}/college/${id}`, { withCredentials: true })
        .then((data) => {
          setCollege(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getCollege();
  }, []);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [emailBoxOpen, setEmailBoxOpen] = useState(false);
  const [loginBoxOpen, setLoginBoxOpen] = useState(false);
  const closeModal = () => {
    setLoginBoxOpen(false);
    setEmailBoxOpen(false);
  };

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filter, setFilter] = useState("default");

  const userId = user?._id; // Replace with dynamic user ID from context/auth.

  // Fetch all reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/college/reviews/${id}`
        );
        setReviews(data.reviews);
        setFilteredReviews(data.reviews); // Default view
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on dropdown value
  useEffect(() => {
    let sortedReviews = [...reviews];

    // Sort by recent timestamp by default
    sortedReviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filter === "highest") {
      sortedReviews.sort((a, b) => b.averageRating - a.averageRating); // High to Low
    } else if (filter === "lowest") {
      sortedReviews.sort((a, b) => a.averageRating - b.averageRating); // Low to High
    } else if (filter === "myReview") {
      sortedReviews = reviews
        .filter((review) => review.userId === userId)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort filtered reviews by timestamp
    }

    setFilteredReviews(sortedReviews);
  }, [filter, reviews, userId]);

  const safeRating = Math.max(0, Math.min(college.averageRating || 0, 5)); // Default to 0 if undefined
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(safeRating);


  const onDelete = async (rid) => {
    try {
      console.log(rid)
      // Send DELETE request to the server
      await axios.delete(`${BACKEND_URL}/review/delete`, {
        data: { rid }, // Pass ID in the request body
        withCredentials: true, // Include credentials if needed
      });
  
      // Notify the user about successful deletion
      toast.success("Review deleted successfully!");
  
      // Refetch the reviews and college details
      const updatedReviews = reviews.filter((review) => review._id !== rid);
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews); // Sync filtered list
  
      // Refetch college details
      const { data } = await axios.get(`${BACKEND_URL}/college/${id}`, { withCredentials: true });
      setCollege(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the review. Try again later.");
    }
  };


  const saveCollege = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/save-college`,
        { collegeId: id },
        { withCredentials: true }
      );
  
      console.log(response?.data);
      toast.success(response?.data?.message); 
    } catch (error) {
      console.error("Error while saving college:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  

  

  return (
    <div className="md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white ">
      {/* Header Section */}
      <div className="flex flex-col items-center md:flex-row gap-5 py-10">
        <div className=" overflow-hidden rounded-md">
          <img
            src={college?.logo}
            className="object-cover size-28 md:size-20 "
            alt="logo"
          />
        </div>

        <div className="w-full flex flex-col items-center md:items-start justify-between">
          <div>
            <h1 className="text-green-600 text-center text-xl md:text-2xl font-semibold">
              {college?.name}
            </h1>
          </div>

          <div className="w-full items-center md:items-start flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center flex-col md:flex-row">
                <p>{college.address}</p>
                <div className="flex items-center">
                  <AiFillStar className="ml-3 text-yellow-500 text-xl" />{" "}
                  {safeRating.toFixed(1)}/5 ({reviews?.length} Reviews)
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-nowrap  my-3">
                {college?.info?.map((info, idx)=> (
                  <li key={idx} className="bg-black/10 px-4 py-1 rounded-full">{info}</li>
                ))}
                </div>
            </div>

            <div className="flex gap-3 text-sm text-white">
              <button className="py-2 rounded-full flex items-center gap-2 px-8 bg-green-600 hover:bg-green-800" onClick={saveCollege} >
               <BiBookmark /> SAVE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold ">About the College</h2>
        <p className="text-gray-800 text-sm md:text-base">
          {college?.about}
        </p>
      </div>

      {/* Photos Section */}
      <div className="">
        <h2 className="text-xl font-semibold mb-2">Gallery</h2>
        <div className="grid grid-cols-3 gap-4"></div>
      </div>

      <Swiper
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          // For mobile devices
          0: {
            slidesPerView: 1,
          },
          // For tablets and above
          768: {
            slidesPerView: 2,
          },
          // For larger screens
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[FreeMode, Autoplay]}
        className="mySwiper"
      >
        {college?.images?.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="h-48">
            <img
              src={image}
              alt={`College Photo ${index + 1}`}
              className=" hover:scale-105 transition rounded-lg shadow-md"
            />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-4 md:p-8 my-10 border-2 rounded-2xl  bg-white">
        <h1 className="text-base md:text-xl font-bold text-gray-800 mb-4">
          Average Rating of this Institute
        </h1>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-blue-500">
              {safeRating.toFixed(1)}
            </h1>
            <ul className="flex justify-center text-yellow-500 text-2xl mt-2">
              {/* Full Stars */}
              {[...Array(fullStars)].map((_, index) => (
                <li key={`full-${index}`}>
                  <FaStar />
                </li>
              ))}
              {/* Half Star */}
              {hasHalfStar && (
                <li key="half-star">
                  <FaStarHalfAlt />
                </li>
              )}
              {/* Empty Stars */}
              {[...Array(emptyStars)].map((_, index) => (
                <li key={`empty-${index}`}>
                  <FaRegStar />
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <p className="flex items-center md:gap-2 md:text-base text-sm text-gray-700">
              <MdVerifiedUser className="text-green-500 text-lg md:text-2xl" />{" "}
              ({reviews?.length} Verified Reviews)
            </p>
          </div>
        </div>

        <div className="border my-6"></div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 ">
          {[
            {
              icon: (
                <FaSchool className="text-2xl md:text-4xl text-blue-500 mb-2" />
              ),
              label: "Placements",
              rating: (college?.placementsRating ?? 0).toFixed(1),
            },
            {
              icon: (
                <FaUserTie className="text-2xl md:text-4xl text-blue-500 mb-2" />
              ),
              label: "Faculty",
              rating: (college?.facultyRating ?? 0).toFixed(1),
            },
            {
              icon: (
                <FaBuilding className="text-2xl md:text-4xl text-blue-500 mb-2" />
              ),
              label: "Infrastructure",
              rating: (college?.infrastructureRating ?? 0).toFixed(1),
            },
            {
              icon: (
                <FaHome className="text-2xl md:text-4xl text-blue-500 mb-2" />
              ),
              label: "Value For Money",
              rating: (college?.valueForMoneyRating ?? 0).toFixed(1),
            },
            {
              icon: (
                <FaBriefcase className="text-2xl md:text-4xl text-blue-500 mb-2" />
              ),
              label: "Campus Life",
              rating: (college?.campusLifeRating ?? 0).toFixed(1),
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {item.icon}
              <p className="font-medium text-center text-xs md:text-base text-gray-700">
                {item.label}
              </p>
              <p className="flex items-center font-semibold text-gray-800">
                {item.rating}
                <FaStar className="text-yellow-500 ml-1" />
              </p>
            </div>
          ))}
        </div>

        <div className="border my-4 md:my-6"></div>

        <div className="text-xs md:text-sm">
          The{" "}
          <MdVerifiedUser className="inline-flex text-green-500 text-lg md:text-2xl" />{" "}
          <span className="font-semibold ">Verified</span> badge indicates that
          the reviewer's details have been verified by EduRate, and reviewers
          are bona fide students of this college. These reviews and ratings have
          been given by students.
        </div>
      </div>

      <div className="w-full ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Reviews</h2>

          {reviews.filter((review) => review.userId === userId).length ===
            0 && (
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (user?.verifiedColleges.includes(id)) {
                    navigate(`/review/${id}`);
                  } else {
                    if (isAuthenticated) {
                      setEmailBoxOpen(true);
                    } else {
                      setLoginBoxOpen(true);
                    }
                  }
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <FaPen />
                Add a Review
              </button>
            </div>
          )}
        </div>

        {/* Dropdown for Filtering */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-max text-center p-2 border rounded-md mb-4"
        >
          <option value="default">All Reviews</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="myReview">My Review</option>
        </select>

        <div className="w-full">
          {/* Reviews List */}
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <ReviewCard
                key={index}
                course={review.course}
                year={review.year}
                title={review.title}
                averageRating={review.averageRating}
                facultyRating={review.facultyRating}
                infrastructureRating={review.infrastructureRating}
                placementsRating={review.placementsRating}
                campusLifeRating={review.campusLifeRating}
                valueForMoneyRating={review.valueForMoneyRating}
                placementsComment={review.placementsComment}
                infrastructureComment={review.infrastructureComment}
                facultyComment={review.facultyComment}
                otherComment={review.otherComment}
                timestamp={review.updatedAt}
                isMyReview={filter === "myReview" && true}
                reviewId={review._id}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="text-center">No reviews available</p>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {loginBoxOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Authentication closeModal={closeModal} />
        </div>
      )}

      {emailBoxOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <VerifyEmail closeModal={closeModal} />
        </div>
      )}
    </div>
  );
};

export default CollegeDetails;
