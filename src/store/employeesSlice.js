import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/employees/all-users", {}, dispatch);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    addEmployees: (state, action) => {
      state.data.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const updatedEmployee = action.payload;
      const index = state.data.findIndex(
        (employee) => employee.user_id === updatedEmployee.user_id,
      );

      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedEmployee,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employees";
      });
  },
});

export const { addEmployees, updateEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
