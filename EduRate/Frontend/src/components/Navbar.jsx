import { RxCross2 } from "react-icons/rx"; 
import { MdOutlineSchool } from "react-icons/md";
import React, { useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import Authentication from "./Authentication";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const activeClass = "text-green-600";
  const defaultClass = "text-gray-700 hover:text-green-600";

  const { user} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
 
  const onlogout = () => {
    dispatch(logout());
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white text-gray-700  shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-lg flex items-center gap-1 font-bold tracking-wide">
                <MdOutlineSchool className="text-green-600 text-3xl" />
                EduRate
              </span>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeClass : defaultClass
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? activeClass : defaultClass
                }
              >
                About Us
              </NavLink>

              <NavLink
                to="/colleges"
                className={({ isActive }) =>
                  isActive ? activeClass : defaultClass
                }
              >
Colleges
              </NavLink>
              
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? activeClass : defaultClass
                }
              >
                Contact
              </NavLink>
            </div>

            {/* User Icon and Dropdown */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                  >
                    <FiUser className="text-2xl " />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute overflow-hidden right-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        className="w-full text-left hover:bg-gray-100 px-4 py-2"
                        onClick={() => {navigate("/saved-colleges")}}
                      >
                        Saved Colleges
                      </button>
                      <button
                        className="w-full text-red-500 hover:bg-red-100 text-left px-4 py-2"
                        onClick={onlogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="px-4 py-1 border text-green-600 border-green-600 hover:bg-green-600 hover:text-white rounded text-sm"
                  onClick={()=>{openModal(); setIsMenuOpen(false)}}
                >
                  Login
                </button>
              )}

              {/* Hamburger Menu */}
              
                <button
                  onClick={() => {
                    toggleMenu();
                    setIsDropdownOpen(false);
                  }}
                  className="md:hidden focus:outline-none text-2xl"
                >
                  {isMenuOpen ? <RxCross2 /> : <FiMenu className="" />}
                  
                </button>
            
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute flex flex-col gap-4 pb-5 w-full bg-white text-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? activeClass : defaultClass
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? activeClass : defaultClass
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/colleges"
              className={({ isActive }) =>
                isActive ? activeClass : defaultClass
              }
            >
              Colleges
            </NavLink>
           
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? activeClass : defaultClass
              }
            >
              Contact
            </NavLink>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Authentication closeModal={closeModal} />
        </div>
      )}
    </>
  );
}

export default Navbar;
