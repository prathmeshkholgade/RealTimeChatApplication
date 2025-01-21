import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";
// import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export const registerUser = createAsyncThunk(
  "/user/register",
  async (data, thunkAPI) => {
    try {
      console.log(baseURL);
      const response = await axios.post(`${baseURL}/user/register`, data, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const loginUser = createAsyncThunk(
  "/user/login",
  async (data, thunkAPI) => {
    try {
      console.log("this is api", data);
      const response = await axios.post(`${baseURL}/user/login`, data, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const getUserProfile = createAsyncThunk(
  "/user/profile",
  async (_, thunkAPI) => {
    try {
      // console.log("this is api", data);
      const response = await axios(`${baseURL}/user/profile`, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getalluser",
  async (_, thunkAPI) => {
    try {
      const response = await axios(`${baseURL}/user/all-user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    allUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUser = action.payload;
      });
  },
});

export default userSlice.reducer;
