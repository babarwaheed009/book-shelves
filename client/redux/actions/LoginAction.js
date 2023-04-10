import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginFailure, loginSuccess, logout } from "../reducers/AuthSlice";
import axios from "axios";
import { API_URL } from "@/config";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "/auth/login", data);
      if (
        response.status === 200 &&
        response.data.message === "Login successful"
      ) {
        let { data, token } = response.data;
        thunkAPI.dispatch(loginSuccess({ ...data, token }));
        return response.data;
      }else{
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// export const logoutAction = createAsyncThunk(
//   "auth/logout",
//   async (token, thunkAPI) => {
//     try {
//       // Replace this with your API call for logout
//       const response = await axios.get(API_URL + "/auth/logout", {
//         headers: {
//           "x-api-key": `${token}`,
//         },
//       });
//       if (response.data.success) {
//         thunkAPI.dispatch(logout());
//       }
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );
