import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotPasswordSlice = createSlice({
  name: "forgotPassowrd",
  initialState: {
    isLoading: false,
    message: null,
    error: null,
  },
  reducers: {
    requestStart(state) {
      state.isLoading = true;
    },
    requestFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    forgotPasswordSuccess(state, action) {
      state.isLoading = false;
      state.message = action.payload; // Success message from the API
      state.error = null;
    },
    resetPasswordSuccess(state, action) {
      state.isLoading = false;
      state.message = action.payload; // Success message from the API
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const {
  requestStart,
  requestFailed,
  forgotPasswordSuccess,
  resetPasswordSuccess,
  clearError,
  clearMessage,
} = forgotPasswordSlice.actions;

// Async Actions

export const forgotPassword = (formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    console.log(formData)
    const { data } = await axios.post(
      "http://localhost:8000/api/user/password/forgot",
      { formData },
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(forgotPasswordSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "An error occurred."));
  }
};

export const resetPassword = (token, formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.put(
      `http://localhost:8000/api/user/password/reset/${token}`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(resetPasswordSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "An error occurred."));
  }
};

export default forgotPasswordSlice.reducer;
