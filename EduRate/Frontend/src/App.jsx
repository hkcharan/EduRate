import React, { useEffect } from "react";
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./pages/ResetPassword";
import Review from "./pages/review";
import CollegeDetails from "./pages/CollegeDetails";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import EditReview from "./pages/editReview";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./AdminLayout";
import AddCollege from "./pages/AddCollege";
import ManageColleges from "./pages/ManageColleges";
import EditCollege from "./pages/EditCollege";
import SavedColleges from "./pages/SavedColleges";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AllColleges from "./pages/AllColleges";


const App = () => {
const dispatch = useDispatch()

useEffect(()=>{
  dispatch(getUser())
},[])

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/colleges" element={<AllColleges/>} />
      <Route path="/review/:id" element={<Review/>} />
      <Route path="/review/edit/:reviewId" element={<EditReview/>}/>
      <Route path="/college/:id" element={<CollegeDetails />} />
      <Route path="/college/:id" element={<CollegeDetails />} />
      <Route path="/saved-colleges" element={<SavedColleges/>} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
      <Route path="/admin/dashboard" element={<Dashboard/>} />
      <Route path="/admin/add-college" element={<AddCollege/>} />
      <Route path="/admin/manage-colleges" element={<ManageColleges/>} />
      <Route path="/admin/edit-college/:id" element={<EditCollege/>} />
      </Route>
      <Route path="/password/reset/:token" element={<ResetPassword/>} />
    </Routes>
    <ToastContainer theme="colored" hideProgressBar position="bottom-right" closeOnClick icon/>
   </Router>
  );
};

export default App;
