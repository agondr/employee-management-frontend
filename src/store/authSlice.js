import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/auth/change-password",
        {
          method: "PATCH",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
        dispatch,
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const storedUser = JSON.parse(localStorage.getItem("user"));
//const storedToken = JSON.parse(localStorage.getItem('token'));
const storedToken = localStorage.getItem("token");
const initialState = {
  isAuthenticated: !!storedToken,
  user: storedUser || null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
