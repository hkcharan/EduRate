import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { College } from "../models/collegeModel.js";
import mongoose from "mongoose";

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("All Fields are required", 404));
    }

    if (password.length < 8) {
      return next(
        new ErrorHandler("Password length should be greater than 8", 404)
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 404));
    }

    const userData = {
      name,
      email,
      password,
    };

    const user = await User.create(userData);
    sendToken(user, 200, "User registered successfully.", res);
  } catch (error) {
    next(error);
  }
});

export const verifyCollegeEmail = catchAsyncError(async (req, res, next) => {
  const { collegeEmail } = req.body;
  const { id } = req.params;

  // Validate inputs
  if (!collegeEmail || !collegeEmail.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Invalid college email.",
    });
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid college ID.",
    });
  }

  const domain = collegeEmail.split("@")[1];

  const college = await College.findById(id);
  if (!college) {
    return res.status(404).json({
      success: false,
      message: "College not found.",
    });
  }

  if (domain !== college.emailDomain) {
    return res.status(400).json({
      success: false,
      message: `${collegeEmail} does not belong to ${college.name}.`,
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated.",
    });
  }

  const generateVerificationCode = () => {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + remainingDigits);
  };

  const verificationCode = generateVerificationCode();
  req.user.verificationCode = verificationCode;
  req.user.collegeEmail = collegeEmail;

  await req.user.save({ validateModifiedOnly: true });

  try {
    await sendVerificationCode(verificationCode, collegeEmail);
    res.status(200).json({
      success: true,
      message: `Verification email successfully sent to ${collegeEmail}`,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
});


async function sendVerificationCode(verificationCode, collegeEmail) {
  const message = generateEmailTemplate(verificationCode);
  await sendEmail({
    email: collegeEmail,
    subject: "Your Verification Code",
    message,
  });
}

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { otp, collegeId } = req.body;

  try {
    if (!otp) {
      return next(new ErrorHandler("Please Enter OTP", 404));
    }

    if (otp.length < 5) {
      return next(new ErrorHandler("Please Enter All the digits", 404));
    }

    if (!req.user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    if (req.user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }

    if (!collegeId) {
      return next(new ErrorHandler("College Id required", 400));

    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { verifiedColleges: collegeId } }, // $addToSet avoids duplicates
      { new: true } // Return the updated document
    );

    if (!user) {
      return next(new ErrorHandler("User Not Found", 400));
    }

    req.user.verificationCode = null;
    await req.user.save({ validateModifiedOnly: true });

    sendToken(req.user, 200, "Account Verified.", res);
    req.user.verificationCode = null;
    await req.user.save();

  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User logged in successfully.", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email
  });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = resetPasswordLinkTemplate(resetPasswordUrl);

  try {
    sendEmail({
      email: user.email,
      subject: "Reset Your Password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(
        error.message ? error.message : "Cannot send reset password token.",
        500
      )
    );
  }
});

function resetPasswordLinkTemplate(resetToken) {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">EduRank</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">We received a request to reset the password for your account. You can reset your password by clicking the link below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href=${resetToken} style="display: inline-block; text-decoration:none; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          Click Here
        </a>
      </div>
      <p style="font-size: 16px; color: #333;">If you didn’t request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      <p style="font-size: 16px; color: #333;">For security reasons, the link will expire in 10 Minutes. If the link has expired, you’ll need to request a new one.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
`;
}

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & confirm password do not match.", 400)
    );
  }
  
  user.password = await req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, "Reset Password Successfully.", res);
});



export const saveCollege = async (req, res) => {
  try {
    const { collegeId } = req.body; 
    const userId = req.user._id; 

    if (!collegeId) {
      return res.status(400).json({ message: "College ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedColleges: collegeId } }, // Add only if not already present
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "College saved successfully",
      savedColleges: user.savedColleges,
    });
  } catch (error) {
    console.error("Error saving college:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const removeSavedCollege = async (req, res) => {
  try {
    const { collegeId } = req.params; 
  const userId = req.user._id; 

  // Check if the college ID is provided
  if (!collegeId) {
    return res.status(400).json({message:"College ID is required"});
  }

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({message:"User Not Found"});
  }

  // Check if the college is in the savedColleges array
  if (!user.savedColleges.includes(collegeId)) {
    return res.status(400).json({message:"College not found in saved list"});

  }

  // Remove the college from the savedColleges array
  user.savedColleges = user.savedColleges.filter(
    (id) => id.toString() !== collegeId
  );

  // Save the updated user document
  await user.save();

   return res.status(200).json({
    success: true,
    message: "College removed successfully",
    savedColleges: user.savedColleges,
  });
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
  }
};


export const getUsers =async (req, res) => {
  try {
    const users = await User.find();
  
    return res.status(201).json({users})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
  }
  
  }



