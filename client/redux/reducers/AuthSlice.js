import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  user: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      return { ...state, isAuthenticated: true, user: action.payload };
    },
    logout: (state) => {
      return { ...state, isAuthenticated: false, user: null };
    },
    resetSlicer: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

export const { loginSuccess, logout, resetSlicer } = authSlice.actions;

export default authSlice.reducer;
