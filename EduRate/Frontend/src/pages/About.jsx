import React from "react";
import { FaStar, FaCheckCircle, FaUsers, FaGlobe } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-lg text-gray-200 mt-4">
            Helping students make informed college choices through genuine reviews and ratings.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
        <p className="text-gray-600 mt-4 text-lg">
          Our platform is dedicated to providing transparent, verified, and unbiased college reviews to help students
          make the best decisions for their future.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition">
            <FaStar className="text-green-600 text-5xl mb-4" />
            <h3 className="text-lg font-semibold">Authentic Reviews</h3>
            <p className="text-gray-500 text-sm text-center mt-2">All reviews are verified for authenticity.</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition">
            <FaCheckCircle className="text-green-600 text-5xl mb-4" />
            <h3 className="text-lg font-semibold">Secure Verification</h3>
            <p className="text-gray-500 text-sm text-center mt-2">We ensure only students from respective colleges can review.</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition">
            <FaUsers className="text-green-600 text-5xl mb-4" />
            <h3 className="text-lg font-semibold">Community Driven</h3>
            <p className="text-gray-500 text-sm text-center mt-2">Built by students, for students.</p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition">
            <FaGlobe className="text-green-600 text-5xl mb-4" />
            <h3 className="text-lg font-semibold">Global Reach</h3>
            <p className="text-gray-500 text-sm text-center mt-2">Trusted by students worldwide.</p>
          </div>

        </div>
      </section>

      {/* Team Section (Optional) */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="text-gray-600 text-lg mt-4">Passionate developers and education enthusiasts behind the platform.</p>
          
          {/* Team Grid (You can add real team members here) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <img src="./src/assets/user1.jpg" className="w-24 h-24 rounded-full" alt="Team Member" />
              <h3 className="text-lg font-semibold mt-4">John Doe</h3>
              <p className="text-gray-500 text-sm">Founder & Developer</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="./src/assets/user2.jpg" className="w-24 h-24 rounded-full" alt="Team Member" />
              <h3 className="text-lg font-semibold mt-4">Jane Smith</h3>
              <p className="text-gray-500 text-sm">Marketing Head</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="./src/assets/user3.jpg" className="w-24 h-24 rounded-full" alt="Team Member" />
              <h3 className="text-lg font-semibold mt-4">Alex Johnson</h3>
              <p className="text-gray-500 text-sm">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
