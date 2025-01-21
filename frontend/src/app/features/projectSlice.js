import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
export const getUserProjects = createAsyncThunk(
  "user/projects",
  async (_, thunkAPI) => {
    try {
      const response = await axios(`/project/all`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const addProject = createAsyncThunk(
  "user/addProject",
  async (data, thunkAPI) => {
    try {
      console.log(data);
      const response = await axios.post(`/project/add`, data, {
        withCredentials: true,
      });
      thunkAPI.dispatch(getUserProjects());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const getSingleProjectDetaies = createAsyncThunk(
  "user/getAlluser",
  async (id, thunkAPI) => {
    try {
      const response = await axios(`/project/get-project/${id}`, {
        withCredentials: true,
      });
      //   thunkAPI.dispatch(getUserProjects());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
export const addUserInProject = createAsyncThunk(
  "user/adduserinproject",
  async (data, thunkAPI) => {
    try {
      console.log(data);
      const response = await axios.put(`/project/add-user`, data, {
        withCredentials: true,
      });
      thunkAPI.dispatch(getSingleProjectDetaies(data.projectId));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: null,
    project: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {})
      .addCase(getSingleProjectDetaies.fulfilled, (state, action) => {
        state.project = action.payload;
      });
  },
});

export default projectSlice.reducer;
