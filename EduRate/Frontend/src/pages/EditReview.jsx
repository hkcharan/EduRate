import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditReview = () => {
  const [step, setStep] = useState(1);
  const { reviewId } = useParams();
  const [college, setCollege] = useState("");
  const [formData, setFormData] = useState({
    collegeId: "",
    course: "",
    year: "",
    title: "",
    placementsRating: 0,
    infrastructureRating: 0,
    facultyRating: 0,
    valueForMoneyRating: 0,
    campusLifeRating: 0,
    placementsComment: "",
    infrastructureComment: "",
    facultyComment: "",
    otherComment: "",
  });


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); 
  const steps = ["Personal Details", "Your Review", "More Details"];


  let id  = formData?.collegeId
  console.log(id)

  useEffect(() => {
    // Fetch college details
    const getCollege = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/college/mycollege",
           // Send the id directly here
          {id, withCredentials: true }
        );
        setCollege(res.data);
        console.log("College Details:", res.data);
      } catch (error) {
        console.error("Frontend Error:", error.response?.data || error.message);
      }
    };
      

    // Fetch the existing review details
    const getReview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/review/${reviewId}`,
          { withCredentials: true }
        );
        setFormData(res.data.data);
      } catch (error) {
        console.error("Error fetching review details:", error);
      }
    };

    getReview();
    if (formData?.collegeId) {
        getCollege();
      }
  }, [reviewId, id]);

  

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.course) newErrors.course = "Course is required.";
      if (!formData.year) newErrors.year = "Year is required.";
      if (!formData.title) newErrors.title = "Title is required.";
    } else if (step === 2) {
      [
        "placementsRating",
        "infrastructureRating",
        "facultyRating",
        "valueForMoneyRating",
        "campusLifeRating",
      ].forEach((field) => {
        if (!formData[field])
          newErrors[field] = `${field.replace(
            /Rating/,
            ""
          )} rating is required.`;
      });
    } else if (step === 3 ) {
      ["placementsComment", "infrastructureComment", "facultyComment"].forEach(
        (field) => {
          if (!formData[field])
            newErrors[field] = `${field.replace(
              /Comment/,
              ""
            )} comment is required.`;
        }
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitting(true);  
      try {
        await axios.put(
          `http://localhost:8000/api/review/update/${reviewId}`,
          formData,
          { withCredentials: true }
        );
        navigate(`/college/${id}`);
        toast.success("Review updated successfully");
      } catch (error) {
        console.error("Error updating review:", error);
      }finally {
        setIsSubmitting(false);  
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="flex items-center mb-6">
          {/* Step 1 */}
          <div className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full text-white font-semibold transition-all ${
                step >= 1 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              1
            </div>
            {step >= 1 && (
              <div
                className={`flex-1 h-1 transition-all ${
                  step > 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full text-white font-semibold transition-all ${
                step >= 2 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              2
            </div>
            {step >= 1 && (
              <div
                className={`flex-1 h-1 transition-all ${
                  step > 2 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>

          {/* Step 3 */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 flex justify-center items-center rounded-full text-white font-semibold transition-all ${
                step >= 3 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Personal Details
              </h2>
              <p className="text-sm text-gray-600">
                Provide your basic details to proceed.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={"Anonymous"}
                    disabled
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your name will remain anonymous to others.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={college.name || ""}
                    disabled
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Automatically fetched from the college you are reviewing.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course
                  </label>
                  <select
                    name="course"
                    value={formData.course || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a course</option>
                    {college?.courses?.map((course, idx) => (
                      <option key={idx} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="text-sm text-red-500">{errors.course}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Select the course you are pursuing or have pursued at this
                    college.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.year || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a year</option>
                    {Array.from(
                      { length: 9 },
                      (_, i) => new Date().getFullYear() - 4 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-sm text-red-500">{errors.year}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Choose the year you enrolled in or graduated from the
                    course.
                  </p>
                </div>

                <div className=" md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Title of review
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.course && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Give a short headline that summarizes your college review.
                    e.g. Absolutely dissatisfied because of faculty, good
                    placements in 2015, really good infrastructure and
                    facilities etc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">Your Review</h2>
              <p className="text-sm text-gray-600">
                Your honest & detailed review on Placements, Infrastructure, and
                Facilities will help thousands of students make an informed
                college decision.
              </p>
              {[
                {
                  label: "Placements",
                  name: "placementsRating",
                  instructions:
                    "Rate based on placement statistics, company presence, and opportunities provided.",
                },
                {
                  label: "Infrastructure",
                  name: "infrastructureRating",
                  instructions:
                    "Evaluate facilities like labs, classrooms, hostels, and other amenities.",
                },
                {
                  label: "Faculty",
                  name: "facultyRating",
                  instructions:
                    "Judge based on faculty qualifications, teaching methods, and engagement.",
                },
                {
                  label: "Value for Money",
                  name: "valueForMoneyRating",
                  instructions:
                    "Consider the worth of the course against fees charged.",
                },
                {
                  label: "Campus Life",
                  name: "campusLifeRating",
                  instructions:
                    "Think about extracurricular activities, events, and overall campus vibe.",
                },
              ].map((aspect, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-sm font-medium">
                    {aspect.label} Rating
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {aspect.instructions}
                  </p>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FaStar
                        key={value}
                        className={`cursor-pointer transition-transform transform hover:scale-125 text-4xl ${
                          value <= formData[aspect.name]
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleRatingChange(aspect.name, value)}
                      />
                    ))}
                  </div>
                  {errors[aspect.name] && (
                    <p className="text-sm text-red-500">
                      {errors[aspect.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700">More Details</h2>
              <p className="text-sm text-gray-600">
                Provide detailed comments to help others make informed
                decisions.
              </p>
              {[
                {
                  label: "Placements",
                  name: "placementsComment",
                  instructions: `What percent of students were placed in your course?
What was the highest, lowest and the average package offered in your course?
Top Recruiting companies for your course?
What percent of students got internship from your course and in which companies?
Top Roles offered in your course?
(At least 2-3 lines)`,
                },
                {
                  label: "Infrastructure",
                  name: "infrastructureComment",
                  instructions: `Describe the facilities and infrastructure available for your course/department (e.g. Wi-Fi, Labs, Classrooms, Library)?
What is/was the quality of the facilities in your hostel, the quality of food available in the mess and canteen, medical facilities, sports and games?
(At least 2-3 lines)`,
                },
                {
                  label: "Faculty, Curriculum & Exams",
                  name: "facultyComment",
                  instructions: `Were the teachers helpful, qualified, and knowledgeable? How was the teaching quality?
Is this course curriculum relevant? Does it make the students industry ready?
How difficult are the semester exams in this college? What is the pass percentage?
(At least 2-3 lines)`,
                },
                {
                  label: "Any other information that you would like to share",
                  name: "otherComment",
                  instructions: ` Why did you choose this course? What are the best things about your course?
                What things you wish would be better/improve about your course?
                Events, Fest, Campus Crowd, Connectivity, Campus Surroundings, Scholarship, Extracurricular Activities, etc.
(At least 2-3 lines)`,
                },
              ].map((aspect, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium mb-1">
                    {aspect.label}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {aspect.instructions}
                  </p>
                  <textarea
                    name={aspect.name}
                    value={formData[aspect.name]}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="5"
                  ></textarea>
                  {errors[aspect.name] && (
                    <p className="text-sm text-red-500">
                      {errors[aspect.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Next
              </button>
            ) : (
              <button
              type="submit"
              disabled={isSubmitting}  
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReview;
