import { MdOutlineMailOutline } from "react-icons/md"; 
import { CgClose } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, login, forgotPassword } from "../store/slices/userSlice";

// Login Form Component
const LoginForm = ({ onSubmit, setFormType, closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="relative z-50 flex flex-col mx-3 mt-16 bg-white shadow-2xl rounded-2xl p-5 max-w-sm md:min-w-96">
      <p
        className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        onClick={closeModal}
      >
        <CgClose />
      </p>
      <h2 className="text-xl text-center pb-2 font-bold">Log In</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <label htmlFor="email" className="mb-2 font-medium text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={` w-full p-3  text-sm border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="py-2">
          <label htmlFor="password" className="mb-2 font-medium text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full p-3 text-sm border rounded-md  ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setFormType("forgot-password")}
            className="font-semibold cursor-pointer text-sm text-green-500"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full text-sm bg-green-500 text-white p-3 rounded-lg my-3  hover:bg-green-600 transition"
        >
          Log In
        </button>
      </form>

      <button className="w-full flex items-center justify-center border border-gray-300 text-sm p-3 rounded-lg mb-2 hover:bg-green-500 hover:text-white transition">
        <FcGoogle className="text-lg mr-2" />
        Sign In with Google
      </button>

      <p className="text-center mt-3 text-xs text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={() => setFormType("register")}
          className="font-bold text-sm text-green-500"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

// Register Form Component
const RegisterForm = ({ onSubmit, setFormType, closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="relative z-50 flex flex-col mx-3 mt-16 bg-white shadow-2xl rounded-2xl p-5 max-w-sm md:min-w-96">
      <p
        className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        onClick={closeModal}
      >
        <CgClose />
      </p>
      <h2 className=" text-xl text-center pb-2 font-bold">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <label htmlFor="name" className="mb-2 font-medium text-sm">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full  p-3 text-sm border rounded-md placeholder-gray-400 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
            {...register("name", { required: "Full Name is required" })}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="py-2">
          <label htmlFor="email" className="mb-2 font-medium text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full p-3  text-sm border rounded-md placeholder-gray-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="py-2">
          <label htmlFor="password" className="mb-2 font-medium text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full p-3 text-sm border rounded-md placeholder-gray-400 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-sm bg-green-500 text-white p-3 rounded-lg my-4  hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      </form>

      <button className="w-full flex items-center justify-center border border-gray-300 text-sm p-3 rounded-lg mb-2 hover:bg-green-500 hover:text-white transition">
        <FcGoogle className="text-lg mr-2" />
        Sign up with Google
      </button>

      <p className="text-center mt-3 text-xs text-gray-400">
        Already have an account?{" "}
        <button
          onClick={() => setFormType("login")}
          className="font-bold text-sm text-green-500"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};


const ForgotPasswordForm = ({
  onSubmit,
  isSubmitted,
  setIsSubmitted,
  Email,
  setFormType,
  closeModal,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="relative z-50 flex flex-col mx-3 mt-16 bg-white shadow-2xl rounded-2xl p-5 md:max-w-sm ">
      <p
        className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        onClick={closeModal}
      >
        <CgClose />
      </p>

      <h2 className="text-xl font-bold text-center text-gray-800 pb-4">
        Forgot Password
      </h2>

      {!isSubmitted ? (
        <>
          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-2">
              <label
                htmlFor="email"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-3 text-sm border rounded-md placeholder-gray-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white text-sm font-medium py-3 mt-4 rounded-lg hover:bg-green-600 transition"
            >
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="flex justify-center items-center bg-green-100 w-16 h-16 rounded-full mx-auto mb-4">
            <MdOutlineMailOutline className="text-green-500 text-3xl" />
          </div>
          <p className="text-gray-700 text-sm">
            If an account exists for <span className="font-semibold">{Email}</span>, you will receive a password reset link shortly.
          </p>
          <button
            onClick={closeModal}
            className="w-full bg-green-500 text-white text-sm font-medium py-3 mt-4 rounded-lg hover:bg-green-600 transition"
          >
            OK
          </button>
        </div>
      )}

      <p
        className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:underline"
        onClick={() => {
          setFormType("login");
          setIsSubmitted(false)
        }}
      >
        Back to Login
      </p>
    </div>
  );
};




// Main Authentication Component
const Authentication = ({ closeModal }) => {
  const [formType, setFormType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading , user} = useSelector((state) => state.user);
  const [Email, setEmail] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    if (formType === "forgot-password") {
      dispatch(forgotPassword({ email: data.email }));
      setEmail(data.email);
      setIsSubmitted(true);
    } else if (formType === "register") {
      dispatch(registerUser(data));
    } else {
      dispatch(login(data));
      
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      closeModal();
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated]);

  return (
    <div>
      {formType === "login" && (
        <LoginForm
          onSubmit={onSubmit}
          setFormType={setFormType}
          closeModal={closeModal}
        />
      )}
      {formType === "register" && (
        <RegisterForm
          onSubmit={onSubmit}
          setFormType={setFormType}
          closeModal={closeModal}
        />
      )}
      {formType === "forgot-password" && (
        <ForgotPasswordForm
          onSubmit={onSubmit}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          Email={Email}
          setFormType={setFormType}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Authentication;
