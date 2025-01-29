import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddCollege = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailDomain: "",
    address: "",
    about: "",
    courses: "",
    info: "",
  });
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "logo") {
      setLogo(e.target.files[0]);
    } else {
      setImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const data = new FormData();
    data.append("logo", logo);
    images.forEach((image, index) => {
      console.log(`Appending image ${index + 1}:`, image.name); 
      data.append("images", image);
    });
    
    const formattedCourses = formData.courses.split(",").map((item) => item.trim());
    const formattedInfo = formData.info.split(",").map((item) => item.trim());

    data.append("name", formData.name);
    data.append("emailDomain", formData.emailDomain);
    data.append("address", formData.address);
    data.append("about", formData.about);
    data.append("courses", JSON.stringify(formattedCourses));
    data.append("info", JSON.stringify(formattedInfo));

    try {
      await axios.post("http://localhost:8000/api/college/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("College added successfully!");
      setFormData({
        name: "",
        emailDomain: "",
        address: "",
        about: "",
        courses: "",
        info: "",
      });
      setLogo(null);
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add college. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-40 flex flex-col mx-3 mt-10 bg-white shadow-2xl rounded-2xl p-5 ">
      <h2 className="text-xl text-center pb-4 font-bold text-green-600">Add College</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 space-y-4">
        <div className="py-2">
          <label htmlFor="name" className="font-medium text-sm block mb-2">
            College Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="Enter college name"
          />
        </div>

        <div className="py-2">
          <label htmlFor="emailDomain" className="font-medium text-sm block mb-2">
            Email Domain
          </label>
          <input
            type="text"
            name="emailDomain"
            id="emailDomain"
            value={formData.emailDomain}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="e.g., @example.edu"
          />
        </div>

        <div className="py-2">
          <label htmlFor="address" className="font-medium text-sm block mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="Enter college address"
          />
        </div>

        <div className="py-2">
          <label htmlFor="about" className="font-medium text-sm block mb-2">
            About the College
          </label>
          <textarea
            name="about"
            id="about"
            value={formData.about}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="Provide a brief description"
          ></textarea>
        </div>

        <div className="py-2">
          <label htmlFor="courses" className="font-medium text-sm block mb-2">
            Courses (comma-separated)
          </label>
          <textarea
            name="courses"
            id="courses"
            value={formData.courses}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="e.g., Computer Science, Engineering, Business"
          ></textarea>
        </div>

        <div className="py-2">
          <label htmlFor="info" className="font-medium text-sm block mb-2">
            Additional Info (comma-separated)
          </label>
          <textarea
            name="info"
            id="info"
            value={formData.info}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border rounded-md border-gray-300 focus:outline-green-500"
            placeholder="e.g., Hostel, Sports facilities"
          ></textarea>
        </div>

        <div className="py-2">
          <label htmlFor="logo" className="font-medium text-sm block mb-2">
            Upload Logo
          </label>
          <input
            type="file"
            name="logo"
            id="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border rounded-md border-gray-300 focus:outline-green-500"
          />
        </div>

        <div className="py-2">
          <label htmlFor="images" className="font-medium text-sm block mb-2">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            id="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border rounded-md border-gray-300 focus:outline-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full text-sm bg-green-500 text-white p-3 rounded-lg my-3 hover:bg-green-600 transition"
        >
          {loading ? "Adding College..." : "Add College"} 
        </button>
      </form>
    </div>
  );
};

export default AddCollege;
