import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { getUser } from "@/store/slices/userSlice";

const SavedColleges = () => {
  const [savedColleges, setSavedColleges] = useState([]);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch()

useEffect(()=>{
    dispatch(getUser())
},[])

  useEffect(() => {
    
    const fetchSavedColleges = async () => {
      if (!user || !user.savedColleges) return; // Wait until user data is available

      try {
        const savedCollegeIds = user.savedColleges;

        // Get all college details
        const response = await axios.get(
          "http://localhost:8000/api/college/getall",
          { withCredentials: true }
        );

        // Filter colleges based on saved IDs
        const filteredColleges = response.data.colleges?.filter((college) =>
          savedCollegeIds.includes(college._id)
        );

        setSavedColleges(filteredColleges);
      } catch (error) {
        console.error("Error fetching saved colleges:", error);
        toast.error("Failed to fetch saved colleges");
      }
    };

    fetchSavedColleges();
    
  }, [user]);

  // Handle delete college
  const deleteCollege = async (collegeId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/user/remove-college/${collegeId}`,
        { withCredentials: true }
      );

      toast.success(response.data.message);

      // Update the state to remove the deleted college
      setSavedColleges((prev) =>
        prev.filter((college) => college._id !== collegeId)
      );

    } catch (error) {
      console.error("Error deleting college:", error);
      toast.error(error.response?.data?.message || "Failed to delete college");
    }
  };

  return (
    <div className="md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-8">
      <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Your Saved Colleges
      </h1>

      {savedColleges.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          {user?.savedColleges?.length > 0
            ? "Loading your saved colleges..."
            : "No colleges saved yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <div
              key={college._id}
              className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={college.logo}
                  alt={college.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {college.name}
                  </h2>
                  <p className="text-sm text-gray-500">{college.address}</p>
                  <div className="flex items-center text-yellow-500 mt-2">
                    <AiFillStar className="text-xl" />{" "}
                    <span className="ml-1">
                      {college.rating?.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteCollege(college._id)}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedColleges;
