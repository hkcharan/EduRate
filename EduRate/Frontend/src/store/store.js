import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userSlice'
import forgotPasswordReducer from "./slices/forgotPasswordSlice";

const store = configureStore({
    reducer : {
        user : userReducer,
        forgotPassword : forgotPasswordReducer,
    }
});

export default store