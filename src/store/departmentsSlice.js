import { apiFetch } from "@/lib/apiFetch";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/departments", {}, dispatch);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || error);
    }
  },
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    loading: false,
    error: false,
    hasFetched: false,
  },
  reducers: {
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    deleteDepartment: (state, action) => {
      state.departments = state.departments.filter(
        (department) => department.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch departments";
      });
  },
});

export const { addDepartment, deleteDepartment } = departmentsSlice.actions;
export default departmentsSlice.reducer;
