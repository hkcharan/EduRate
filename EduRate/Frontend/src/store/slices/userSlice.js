import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:8000/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: false,
    isLoading: false,
    user: null,
  },
  reducers: {
    requestStart(state) {
      state.isLoading = true;
    },
    requestSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
    requestFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailed(state, action) {
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.isLoading = false;
      state.error = action.payload;
    },
    forgotPasswordSuccess(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.error = null;
    },
    resetPasswordSuccess(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  logoutSuccess,
  requestFailed,
  forgotPasswordSuccess,
  resetPasswordSuccess,
} = userSlice.actions;

// Async Actions

export const registerUser = (formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/user/register`,
      formData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(requestSuccess(data));
    toast.success(data.message);
  } catch (error) {
    dispatch(requestFailed());
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export const login = (formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(`${BACKEND_URL}/user/login`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(requestSuccess(data));
    toast.success(data.message);
  } catch (error) {
    dispatch(requestFailed());
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.get(`${BACKEND_URL}/user/me`, {
      withCredentials: true,
    });
    dispatch(requestSuccess(data));
  } catch (error) {
    dispatch(requestFailed());
    console.log(error)
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export const logout = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.get(`${BACKEND_URL}/user/logout`, {
      withCredentials: true,
    });
    dispatch(logoutSuccess(data));
    toast.success(data.message);
  } catch (error) {
    dispatch(requestFailed());
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/user/password/forgot`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(forgotPasswordSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed());
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export const resetPassword = (token, formData) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.put(
      `${BACKEND_URL}/user/password/reset/${token}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(resetPasswordSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed());
    toast.error(error.response?.data?.message || "An error occurred.");
  }
};

export default userSlice.reducer;
