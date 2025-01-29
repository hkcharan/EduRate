import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    toast.success("Form submitted")
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold">Contact Us</h1>
          <p className="text-xl text-gray-200 mt-4">
            We'd love to hear from you! Reach out for any questions or feedback.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900">Get in Touch</h2>
        <p className="text-center text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
          Have questions or suggestions? Drop us a message, and we'll get back to you as soon as possible.
        </p>
        <div className="mt-12 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 shadow-lg rounded-lg w-full max-w-xl space-y-8"
          >
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 mt-2 border rounded-md text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 mt-2 border rounded-md text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold text-lg">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 mt-2 border rounded-md text-gray-900"
                rows="6"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>



      {/* Contact Info Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Other Ways to Reach Us</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold text-gray-700">Email</p>
              <p className="text-gray-500">support@edurate.com</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold text-gray-700">Phone</p>
              <p className="text-gray-500">+1 (555) 123-4567</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold text-gray-700">Address</p>
              <p className="text-gray-500">1234 College Rd, City, State, 56789</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
