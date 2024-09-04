import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants.jsx";

// Thunk to fetch courses
export const getAllCourses = createAsyncThunk(
  "courses/getAllCourses",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/course`); // Replace with your actual API endpoint
    return response.data;
  }
);

// Thunk to fetch course bundles
export const getAllCourseBundles = createAsyncThunk(
  "courses/getAllCourseBundles",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/coursebundles`); // Replace with your actual API endpoint
    return response.data;
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    courseBundles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllCourseBundles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCourseBundles.fulfilled, (state, action) => {
        state.loading = false;
        state.courseBundles = action.payload;
      })
      .addCase(getAllCourseBundles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
