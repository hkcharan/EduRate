import React, { useState, useEffect } from "react";
import { GoSearch } from "react-icons/go";
import { AiOutlineClose } from "react-icons/ai"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { FaSearch, FaEnvelope, FaEdit, FaBullhorn } from "react-icons/fa";


const Home = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topColleges, setTopColleges] = useState([]); // State to store top-rated colleges
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopColleges = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/college/getall");
    
        // If response.data is an object, access the correct key
        const colleges = Array.isArray(response.data) ? response.data : response.data.colleges;
  
        if (!colleges || !Array.isArray(colleges)) {
          console.error("Invalid data format: Expected an array.");
          return;
        }
  
        // Sort by rating and get top 3
        const sortedColleges = colleges.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
        setTopColleges(sortedColleges);
      } catch (error) {
        console.error("Error fetching colleges:", error.response?.data || error.message);
      }
    };
  
    fetchTopColleges();
  }, []);
  
  

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/college/search`, {
        params: { query: value },
      });

      setSuggestions(response.data);
    } catch (error) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleSearch = (college) => {
    try {
      navigate(`/college/${college._id}`);
    } catch {
      toast.error("No College Found!");
    }
  };

  const handleSuggestionClick = (college) => {
    setQuery(college.name);
    setSuggestions([]);
    handleSearch(college);
  };

  const handleClearInput = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div>
      <header className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rate Your College</h1>
          <p className="text-lg md:text-xl mb-6">
            Share your college experience and help others make informed decisions.
          </p>
          <div className="flex justify-center z-40 items-center mt-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search colleges..."
                className="w-full rounded-full py-3 pl-4 md:pl-8 md:pr-20 pr-16 text-gray-600 font-medium shadow-md focus:outline-none transition"
              />
              {query && (
                <button
                  onClick={handleClearInput}
                  className="absolute inset-y-0 right-6 md:right-10 flex items-center justify-center text-gray-500 hover:text-red-500 px-4 py-2 rounded-full transition"
                  aria-label="Clear"
                >
                  <AiOutlineClose className="text-lg" />
                </button>
              )}
              <button
                className="absolute inset-y-0 right-0 md:right-2 flex items-center justify-center text-gray-500 hover:text-green-500 px-4 py-2 rounded-full transition"
                aria-label="Search"
                onClick={() => handleSearch(suggestions[0])}
              >
                <GoSearch className="text-lg" />
              </button>
              {suggestions.length > 0 && (
                <ul className="absolute z-40 bg-white border border-gray-200 rounded-md mt-2 w-full shadow-lg">
                  {suggestions.map((college) => (
                    <li
                      key={college._id}
                      onClick={() => handleSuggestionClick(college)}
                      className="px-4 py-2 w-full text-black text-left cursor-pointer rounded-md hover:bg-green-100"
                    >
                      {college.name}
                    </li>
                  ))}
                </ul>
              )}
              {loading && <p className="absolute mt-2 text-gray-500">Loading...</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="py-16 max-w-7xl mx-auto">
        <div className=" px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Rated Colleges</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {topColleges.length > 0 ? (
              topColleges.map((college) => (
                <div
                key={college._id}
                className="bg-white flex flex-col items-center shadow-lg rounded-2xl p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                {/* College Logo */}
                <div className="bg-gray-100 p-3 rounded-full">
                  <img src={college.logo} className="size-24 object-contain rounded-full" alt="College Logo" />
                </div>
              
                {/* College Name */}
                <h3 className="text-xl font-semibold text-gray-900 mt-4">{college.name}</h3>
              
                {/* College Address */}
                <p className="text-gray-500 text-sm mt-1">{college.address}</p>
              
                {/* Rating Section */}
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-yellow-500 text-lg font-bold">{college.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">/ 5</span>
                  <div className="flex ml-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.round(college.averageRating) ? "text-yellow-400" : "text-gray-300"}>
                        <FaStar className="text-lg"/>
                      </span>
                    ))}
                  </div>
                </div>
              
                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/college/${college._id}`)}
                  className="mt-5 bg-green-600 text-white font-medium rounded-full px-6 py-2 text-sm hover:bg-green-700 transition duration-200 ease-in-out"
                >
                  View Details
                </button>
              </div>
              
              ))
            ) : (
              <p className="text-center text-gray-500">No top-rated colleges found.</p>
            )}
          </div>
        </div>
      </main>


      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-7xl mx-auto">
  <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
  <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
    Follow these simple steps to share your college experience.
  </p>

  <div className="mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    
    {/* Step 1 */}
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition">
      <FaSearch className="text-green-600 text-5xl mb-4" />
      <h3 className="text-lg font-semibold">Find Your College</h3>
      <p className="text-gray-500 text-sm mt-2">Search for your college in our database.</p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition">
      <FaEnvelope className="text-green-600 text-5xl mb-4" />
      <h3 className="text-lg font-semibold">Verify College Email</h3>
      <p className="text-gray-500 text-sm mt-2">Confirm your identity using your college email.</p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition">
      <FaEdit className="text-green-600 text-5xl mb-4" />
      <h3 className="text-lg font-semibold">Write Your Review</h3>
      <p className="text-gray-500 text-sm mt-2">Rate your college and share your experience.</p>
    </div>

    {/* Step 4 */}
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition">
      <FaBullhorn className="text-green-600 text-5xl mb-4" />
      <h3 className="text-lg font-semibold">Publish & Help Others</h3>
      <p className="text-gray-500 text-sm mt-2">Submit your review to guide future students.</p>
    </div>
</div>
  </div>
</section>



    </div>
  );
};

export default Home;
