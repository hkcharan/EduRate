import { FaUser } from "react-icons/fa"; 
import { FaSchool } from "react-icons/fa"; 
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";
import {  FaCheckCircle } from "react-icons/fa";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const Dashboard = () => {

  const [colleges, setColleges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the APIs concurrently using Promise.all
        const [collegesResponse, reviewsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/college/getall', { withCredentials: true }),
          axios.get('http://localhost:8000/api/review/reviews', { withCredentials: true }),
          axios.get('http://localhost:8000/api/user/users', { withCredentials: true })
        ]);

        // Log the response data to debug
        console.log("Colleges response: ", collegesResponse);
        console.log("Reviews response: ", reviewsResponse);
        console.log("Users response: ", usersResponse);

        // Store the responses in respective state variables
        setColleges(collegesResponse.data.colleges);
        setReviews(reviewsResponse.data.reviews);
        setUsers(usersResponse.data.users);
      } catch (err) {
        setError(err.message);
        console.log("Error: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);






  const lineData = {
    labels: colleges.map((college) => college.name),
    datasets: [
      {
        label: "Total Reviews",
        data: colleges.map(
          (college) => reviews.filter((review) => review.collegeId === college._id).length
        ), 
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
      },
    ],
  };
  

  // Bar Chart Data (College Ratings)
  const barData = {
    labels:  colleges.map((college) => college.name),
    
    datasets: [
      {
        label: "Avg Rating",
        data: colleges.map((college) => college.averageRating),
        backgroundColor: "#22c55e",
      },
    ],
  };

// Pie Chart Data 
const unverifiedUsers = users.filter((user) => user.verifiedColleges.length === 0).length;

const pieData = {
  labels: ["Verified Users", "Not Verified Users"],
  datasets: [
    {
      data: [users.length - unverifiedUsers, unverifiedUsers], // ✅ Corrected logic
      backgroundColor: ["#22c55e", "#ef4444"],
    },
  ],
};

const doughnutData = {
  labels: colleges.map((college) => college.name), // College Names
  datasets: [
    {
      label: "Total Reviews",
      data: colleges.map(
        (college) => reviews.filter((review) => review.collegeId === college._id).length
      ), // Number of reviews per college
      backgroundColor: [
        "#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7", "#06b6d4"
      ], // Add more colors if needed
      hoverOffset: 4,
    },
  ],
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaSchool className="text-green-600 text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Colleges</p>
            <p className="text-2xl font-bold">{colleges?.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaCheckCircle className="text-green-600 text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Reviews</p>
            <p className="text-2xl font-bold">{reviews?.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
          <FaUser className="text-green-600 text-4xl" />
          <div>
            <p className="text-lg font-semibold">Total Users</p>
            <p className="text-2xl font-bold">{users?.length}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white  p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">User's Data</h2>
          <Pie data={pieData} />
        </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Total Ratings</h2>
          <Doughnut data={doughnutData} />
        </div>
        <div className="bg-white p-6 md:col-span-2 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Ratings Data</h2>
          <Line data={lineData} />
        </div>
        <div className="bg-white p-6 md:col-span-2 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Average Ratings</h2>
          <Bar data={barData} />
        </div>
      
      </div>
    </div>
  );
};

export default Dashboard;
