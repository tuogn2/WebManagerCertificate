import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

// Async thunk để lấy tất cả các bài test
export const getAllTests = createAsyncThunk(
  'tests/getAllTests',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/test`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching tests');
    }
  }
);

const testSlice = createSlice({
  name: 'tests',
  initialState: {
    tests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(getAllTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testSlice.reducer;
