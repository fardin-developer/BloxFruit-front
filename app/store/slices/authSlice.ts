// src/app/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  verified: boolean;
  walletBalance: number;
  role: string;
  profilePicture: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  email: string;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    logOut(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    clearEmail(state) {
      state.email = "";
    },
  },
});

export const { setEmail, clearEmail, setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;