// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/constants.jsx";

// Giả lập một API call để đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error) {
      // Trả về thông báo lỗi nếu đăng nhập thất bại
      console.error(error);
      return thunkAPI.rejectWithValue("Invalid email or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, //include user and organization
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    addEnrollmentToUser: (state, action) => {
      if (state.user) {
        state.user.enrollments.push(action.payload);
      }
    },
    updateEnrollment: (state, action) => {
      if (state.user) {
        state.user.enrollments = state.user.enrollments.map((enrollment) => {
          if (enrollment._id === action.payload._id) {
            return action.payload;
          }
          return enrollment;
        });
      }
    },
    addWalletAddress: (state, action) => {
      if (state.user) {
        state.user.walletAddress = action.payload;
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeEnrollment: (state, action) => {
      if (state.user) {
        state.user.enrollments = state.user.enrollments.map((enrollment) => {
          if (enrollment._id === action.payload) {
            return { ...enrollment, completed: true };
          }
          return enrollment;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logoutUser,
  addEnrollmentToUser,
  updateEnrollment,
  completeEnrollment,
  addWalletAddress,
  updateUser,
  clearError
} = authSlice.actions;
export default authSlice.reducer;
