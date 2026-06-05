import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const buildEmployeesQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  const allowedKeys = ["page", "limit", "search", "status", "departmentId"];

  allowedKeys.forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (params = {}, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        `/api/employees/all-users${buildEmployeesQuery(params)}`,
        {},
        dispatch,
      );
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
    pagination: defaultPagination,
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    addEmployees: (state, action) => {
      state.pagination.total += 1;
      state.pagination.totalPages = Math.ceil(
        state.pagination.total / state.pagination.limit,
      );
      state.data = [action.payload, ...state.data].slice(0, state.pagination.limit);
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
        state.data = action.payload?.data || [];
        state.pagination = action.payload?.pagination || defaultPagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employees";
      });
  },
});

export const { addEmployees, updateEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
