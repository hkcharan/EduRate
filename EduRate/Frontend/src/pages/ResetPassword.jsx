import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword} from "../store/slices/userSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Get the reset token from the URL

  const { isLoading, error, message } = useSelector((state) => state.user);

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(resetPassword(token, data));
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="relative md:w-1/4 flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
      <div className="flex flex-col w-full justify-center p-8 md:p-14">
        <span className="mb-3 text-2xl text-center font-bold">Reset Password</span>
        <span className=" text-center text-gray-400 mb-8">
          Enter your new password to reset
        </span>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <label className="mb-2 text-md">New Password</label>
            <input
              type="password"
              className={`w-full p-2 border rounded-md  ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your new password"
              {...register("password", {
                required: "New Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="py-4">
            <label className="mb-2  text-md">Confirm Password</label>
            <input
              type="password"
              className={`w-full p-2 border rounded-md  ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-green-500 border hover:border-gray-300"
          >
            {isLoading ? "Submitting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;