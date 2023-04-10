import { API_URL } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
API_URL

export const registerAction = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      // Replace this with your API call for registration
      const response = await axios.post(API_URL + "/auth/signup", data);
      return {...response.data, status: response.status};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
