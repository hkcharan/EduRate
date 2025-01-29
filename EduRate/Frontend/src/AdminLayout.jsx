import { BsChevronCompactUp } from "react-icons/bs"; 
import { BsChevronCompactDown } from "react-icons/bs"; 

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/slices/userSlice";

const AdminLayout = () => {

const [isOpen, setIsOpen] = useState(false)
const {user} = useSelector((state)=>state.user);
const dispatch = useDispatch();

const onlogout = () => {
  dispatch(logout());
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <nav className="w-full md:w-1/4 sticky z-50 top-0 bg-white shadow-md p-4 pb-2 md:p-6 flex flex-col justify-between">
        {/* Admin Info */}
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <div className="bg-green-500 p-3 rounded-full shadow-md">
              <FiUser className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          <div className="border my-4"></div>

{ isOpen && ( <ul className="space-y-3">
  <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-50 text-gray-800"
                  }`
                }
              >
                <MdSchool className="text-xl" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/manage-colleges"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium  ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-50 text-gray-800"
                  }`
                }
              >
                <MdSchool className="text-xl" />
                <span>Manage Colleges</span>
              </NavLink>
            </li>

            <li>
              <button
                className=
                  "flex w-full items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium bg-red-50 text-red-500"
              
              onClick={onlogout}
              >
                <MdSchool className="text-xl" />
                <span>Logout</span>
              </button>
            </li>
          </ul>) }
          

          <div className="flex items-center justify-center md:hidden text-2xl" onClick={() => {
            setIsOpen(!isOpen)
          }
          }>
{isOpen ? <BsChevronCompactUp /> : <BsChevronCompactDown />}
          </div>

          {/* Navigation Links */}
          <ul className="space-y-4 hidden md:block">
          <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all  font-medium hover:bg-green-100 hover:text-green-700 ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-50 text-gray-800"
                  }`
                }
              >
                <MdSchool className="text-xl" />
                <span>Dashboard</span>
              </NavLink>
            </li>
          
            <li>
              <NavLink
                to="/admin/manage-colleges"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all  font-medium hover:bg-green-100 hover:text-green-700 ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-50 text-gray-800"
                  }`
                }
              >
                <MdSchool className="text-xl" />
                <span>Manage Colleges</span>
              </NavLink>
            </li>

            <button
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg  font-medium bg-gray-50 text-red-600 hover:bg-red-100 transition-all"
          onClick={onlogout}
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
          </ul>
        </div>

       
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:p-6">
        <div className=" relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;