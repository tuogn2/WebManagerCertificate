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
      // console.log(response.data);
      // // Fetch user data using the token
      // const userResponse = await axios.get(
      //   `${API_BASE_URL}/auth/users/66b58d826daa0a6a3cc58a16`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${response.data.token}`,
      //     },
      //   }
      // );

      // Return user data
      console.log(response.data.user);
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
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
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

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
