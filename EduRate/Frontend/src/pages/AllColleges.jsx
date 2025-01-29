import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllColleges = () => {
  const [colleges, setColleges] = useState([]);
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

  useEffect(() => {
    fetchColleges();
  }, []);

  return (
    <div className="p-6 bg-white shadow-2xl rounded-2xl max-w-5xl mx-auto py-5">
        <h1 className="text-xl font-bold text-center text-green-600 py-3">
          All Colleges
        </h1>

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
                  <td className="border border-gray-300 px-4 py-4 flex items-center justify-center">
                    <button
                      onClick={() =>
                        navigate(`/college/${college._id}`)
                      }
                      className="bg-green-500 my-3 md:my-0 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-all text-sm font-semibold"
                    >
                      View
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

export default AllColleges;
