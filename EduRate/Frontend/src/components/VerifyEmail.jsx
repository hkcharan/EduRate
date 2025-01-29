import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CgClose } from "react-icons/cg";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const VerifyEmail = ({closeModal}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60); 
  const otpInputsRef = useRef([]);
  const {id} = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }


    try {
    
      const response = await axios.post(`http://localhost:8000/api/user/verify-college-email/${id}`, { collegeEmail:email },{withCredentials:true});
      if (response.data.success) {
        setError("");
        setOtpSent(true);
        setTimer(60); // Reset timer
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response.data.message || "Failed to send OTP");
      console.log(err)
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Automatically focus on the next input
      if (value !== "" && index < otp.length - 1) {
        otpInputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      setError("Please enter all 5 digits");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/user/otp-verification", {
        otp: otp.join(""),
        collegeId : id
      }, {withCredentials:true});
      if (response.data.success) {
        setError("");
        setIsSubmitted(true);
        toast.success(`${email} is verified`)
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response.data.message || "Invalid OTP");
      toast.error(err.response.data.message)
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/user/verify-college-email/${id}`, { collegeEmail:email },{withCredentials:true});
      if (response.data.success) {
        setError("");
        setOtp(new Array(5).fill(""));
        setTimer(60); // Reset timer
        setOtpSent(true);
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("An error occurred while resending OTP");
    }
  };


  



  return (
    <div className="relative z-50 flex flex-col mx-3 mt-16 bg-white shadow-2xl rounded-2xl p-5 md:max-w-sm">
      <p
        className="absolute top-4 right-4 text-black text-xl cursor-pointer"
        onClick={closeModal}
      >
        <CgClose />
      </p>

      <h2 className="text-xl font-bold text-center text-gray-800 pb-4">
        Verify College
      </h2>

      {!isSubmitted ? (
        <>
          {!otpSent ? (
            <>
              <p className="text-gray-500 text-center text-sm mb-4">
                Enter your email address, and we'll send you an OTP to verify your college email.
              </p>
              <form onSubmit={handleEmailSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 text-sm border rounded-md placeholder-gray-400 ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {error && (
                    <span className="text-xs text-red-500 mt-1">{error}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white text-sm font-medium py-3 mt-4 rounded-lg hover:bg-green-600 transition"
                >
                  Send OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-center text-sm mb-4">
                Enter the 5-digit OTP sent to <span className="font-semibold">{email}</span>.
              </p>
              <form onSubmit={handleOtpSubmit}>
                <div className="flex justify-between gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      maxLength="1"
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      className="w-12 h-12 text-center text-lg border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ))}
                </div>
                {error && (
                  <span className="text-xs text-red-500 block text-center mb-2">
                    {error}
                  </span>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white text-sm font-medium py-3 mt-2 rounded-lg hover:bg-green-600 transition"
                >
                  Verify OTP
                </button>
                <div className="text-center mt-4 text-gray-500">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`text-green-500 font-medium ${
                      timer > 0 ? "cursor-not-allowed opacity-50" : "hover:underline"
                    }`}
                    disabled={timer > 0}
                  >
                    Resend OTP
                  </button>
                  {timer > 0 && (
                    <p className="text-sm mt-1">You can resend OTP in {timer}s</p>
                  )}
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="flex justify-center items-center bg-green-100 w-16 h-16 rounded-full mx-auto mb-4">
            <MdOutlineMailOutline className="text-green-500 text-3xl" />
          </div>
          <p className="text-gray-700 text-sm">
            Email <span className="font-semibold">{email}</span> has been successfully verified.
          </p>
          <button
            onClick={() => {
              closeModal();
              navigate(`/review/${id}`)
            }}
            className="w-full bg-green-500 text-white text-sm font-medium py-3 mt-4 rounded-lg hover:bg-green-600 transition"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
