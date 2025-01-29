import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(null); // Track loading state for deleting college
  const navigate = useNavigate();

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/college/getall"
      );
      setColleges(response.data.colleges);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch colleges.");
    }
  };

  const deleteCollege = async (id) => {
    setLoading(id); // Set loading for the specific college
    try {
      await axios.delete(`http://localhost:8000/api/college/delete/${id}`);
      toast.success("College deleted successfully!");
      fetchColleges();
    } catch (error) {
      toast.error("Failed to delete college.");
    } finally {
      setLoading(null); // Reset loading after operation completes
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  return (
    <div className="p-6 bg-white shadow-2xl rounded-2xl max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 mb-5 items-center justify-between">
        <h1 className="text-xl font-bold text-center text-green-600">
          Manage Colleges
        </h1>
        <button
          className="bg-blue-500 w-full md:w-auto rounded-md md:text-sm text-white font-semibold px-6 py-2 "
          onClick={() => {
            navigate("/admin/add-college");
          }}
        >
          Add College
        </button>
      </div>
      <div className="overflow-x-auto">
        {Array.isArray(colleges) && colleges.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-green-100 text-left text-gray-700">
                <th className="border border-gray-300 px-4 py-3 text-base font-medium text-center">
                  Logo
                </th>
                <th className="border border-gray-300 px-4 py-3 text-base font-medium text-center">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-base font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((college) => (
                <tr key={college._id} className="hover:bg-green-50">
                  <td className="border border-gray-300  text-gray-800 font-medium ">
                    <img
                      className="size-12 mx-auto"
                      src={college.logo}
                      alt=""
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-gray-800 font-medium text-center">
                    {college.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-4 flex flex-col md:flex-row md:justify-center md:space-x-3 space-y-3 md:space-y-0">
                    <button
                      onClick={() =>
                        navigate(`/admin/edit-college/${college._id}`)
                      }
                      className="bg-green-500 md:w-1/3 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCollege(college._id)}
                      disabled={loading === college._id} // Disable button if deleting
                      className={`${
                        loading === college._id ? "bg-gray-500" : "bg-red-500"
                      } md:w-1/3 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm font-semibold`}
                    >
                      {loading === college._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No colleges found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageColleges;
