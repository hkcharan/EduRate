import React, { useState } from "react";
import {
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaUserTie,
  FaBuilding,
  FaBriefcase,
  FaHome,
  FaMoneyBillWave,
  FaEllipsisV,
} from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { useNavigate} from "react-router-dom";

const ReviewCard = ({
  course,
  year,
  title,
  averageRating,
  facultyRating,
  infrastructureRating,
  placementsRating,
  campusLifeRating,
  valueForMoneyRating,
  placementsComment,
  infrastructureComment,
  facultyComment,
  otherComment,
  timestamp,
  isMyReview ,
  reviewId,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the dropdown menu
  const navigate = useNavigate()

  // Format timestamp to a readable date
  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });




  return (
    <div className="p-4 md:p-6 mb-8 bg-white shadow-md hover:shadow-lg rounded-2xl border border-gray-200 transition-shadow duration-300 ease-in-out w-full relative">
      {/* Header Section */}
      <div className="flex justify-between gap-0.5 items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-3xl text-gray-400 md:mr-3" />
          <div>
            <h3 className=" font-bold text-gray-700 flex items-center">
              Anonymous
            </h3>
            <p className="text-sm text-gray-500">
              {course} - {year}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Reviewed on {formattedDate}
            </p>
          </div>
        </div>


        {/* Average Rating */}
        <div className="flex items-center space-x-1">
    <MdVerifiedUser className="text-green-600"/>      
          <span className="text-gray-800 font-bold text-lg">
            {Number(averageRating).toFixed(1)}
          </span>
          <FaStar className="text-yellow-500 text-xl" />
        </div>
      </div>

      <p className="font-semibold pb-3">{title}</p>

      {/* Dropdown Menu */}
      {isMyReview && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaEllipsisV className="text-sm" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-10">
              <button
                onClick={()=>{
                  navigate(`/review/edit/${reviewId}`);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(reviewId)
                }}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-gray-600 text-sm ">
        <p className="flex items-center font-semibold">
          <FaUserTie className="text-blue-500 mr-2 md:text-xl" />
          <span className="font-medium whitespace-pre text-gray-800">Faculty :  </span>{" "}
          {facultyRating.toFixed(1)}<FaStar className="text-lg text-yellow-500"/>
        </p>
        <p className="flex items-center  font-semibold">
          <FaBuilding className="text-blue-500 mr-2 md:text-xl" />
          <span className="font-medium whitespace-pre text-gray-800">Infrastructure :  </span>{""}
          {infrastructureRating.toFixed(1)}<FaStar className="text-lg text-yellow-500"/>
        </p>
        <p className="flex items-center font-semibold">
          <FaBriefcase className="text-blue-500 mr-2 md:text-xl" />
          <span className="font-medium whitespace-pre text-gray-800">Placements :  </span>{" "}
          {placementsRating.toFixed(1)}<FaStar className="text-lg text-yellow-500"/>
        </p>
        <p className="flex items-center font-semibold">
          <FaHome className="text-blue-500 mr-2 md:text-xl" />
          <span className="font-medium whitespace-pre text-gray-800">Campus Life :  </span>{" "}
          {campusLifeRating.toFixed(1)}<FaStar className="text-lg text-yellow-500"/>
        </p>
        <p className="flex items-center font-semibold">
          <FaMoneyBillWave className="text-blue-500 mr-2 md:text-xl" />
          <span className="font-medium whitespace-pre text-gray-800">Value for Money :  </span>{" "}
          {valueForMoneyRating.toFixed(1)}<FaStar className="text-lg text-yellow-500"/>
        </p>
      </div>

      {/* Placements Comment */}
      {placementsComment && (
        <div className="mt-4">
          <span className="block font-medium text-gray-800">Placements:</span>
          <p className={`text-gray-700 text-sm md:text-base${!isExpanded ? "line-clamp-3 text-sm md:text-base" : ""}`}>
            {isExpanded
              ? placementsComment
              : placementsComment.substring(0, 300) + "...."}
          </p>
        </div>
      )}


      {/* Expanded Comments */}
      {isExpanded && (
        <>
          {infrastructureComment && (
            <div className="mt-4">
              <span className="block font-medium text-gray-800">
                Infrastructure:
              </span>
              <p className="text-gray-700 text-sm">{infrastructureComment}</p>
            </div>
          )}
          {facultyComment && (
            <div className="mt-4">
              <span className="block font-medium text-gray-800">Faculty:</span>
              <p className="text-gray-700 text-sm">{facultyComment}</p>
            </div>
          )}
          {otherComment && (
            <div className="mt-4">
              <span className="block font-medium text-gray-800">Other:</span>
              <p className="text-gray-700 text-sm">{otherComment}</p>
            </div>
          )}
        </>
      )}

            {/* Read More/Less Button */}
            <div className="mt-4 flex justify-end">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-all duration-300 transform focus:outline-none flex items-center"
        >
          {isExpanded ? (
            <>
              Read Less <FaChevronUp className="ml-2" />
            </>
          ) : (
            <>
              Read More <FaChevronDown className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
