import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

export const rootReducer = combineReducers({
  auth: AuthSlice
});
