import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const defaultPaginationParams = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  departmentId: "all",
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
  return queryString ? "?" + queryString : "";
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (params = {}, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/employees/all-users" + buildEmployeesQuery(params),
        {},
        dispatch,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateEmployeeProfile = createAsyncThunk(
  "employees/updateEmployeeProfile",
  async ({ userId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/employees/" + userId,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        },
        dispatch,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const adminChangeEmployeePassword = createAsyncThunk(
  "employees/adminChangeEmployeePassword",
  async ({ userId, newPassword, confirmPassword }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/employees/" + userId + "/password",
        {
          method: "PATCH",
          body: JSON.stringify({ newPassword, confirmPassword }),
        },
        dispatch,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchEmployeeTasks = createAsyncThunk(
  "employees/fetchEmployeeTasks",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/employees/" + userId + "/tasks", {}, dispatch);
      return { userId, tasks: data };
    } catch (error) {
      return rejectWithValue({ userId, message: error.message });
    }
  },
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    pagination: defaultPagination,
    paginationParams: defaultPaginationParams,
    employeeTasks: {},
    loading: false,
    profileLoading: false,
    passwordLoading: false,
    error: null,
    profileError: null,
    passwordError: null,
    hasFetched: false,
  },
  reducers: {
    setEmployeeQueryParams: (state, action) => {
      state.paginationParams = {
        ...state.paginationParams,
        ...action.payload,
      };
    },
    resetEmployeeQueryParams: (state) => {
      state.paginationParams = defaultPaginationParams;
    },
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
      })
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        const updatedEmployee = action.payload?.data || action.payload;
        const index = state.data.findIndex(
          (employee) => employee.user_id === updatedEmployee?.user_id,
        );

        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...updatedEmployee,
          };
        }
      })
      .addCase(updateEmployeeProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to update employee profile";
      })
      .addCase(adminChangeEmployeePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
      })
      .addCase(adminChangeEmployeePassword.fulfilled, (state) => {
        state.passwordLoading = false;
      })
      .addCase(adminChangeEmployeePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload || "Failed to update employee password";
      })
      .addCase(fetchEmployeeTasks.pending, (state, action) => {
        const userId = action.meta.arg;
        state.employeeTasks[userId] = {
          data: state.employeeTasks[userId]?.data || [],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.employeeTasks[action.payload.userId] = {
          data: action.payload.tasks || [],
          loading: false,
          error: null,
        };
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        const userId = action.payload?.userId || action.meta.arg;
        state.employeeTasks[userId] = {
          data: state.employeeTasks[userId]?.data || [],
          loading: false,
          error: action.payload?.message || "Failed to fetch employee tasks",
        };
      });
  },
});

export const {
  addEmployees,
  updateEmployee,
  setEmployeeQueryParams,
  resetEmployeeQueryParams,
} = employeesSlice.actions;
export default employeesSlice.reducer;
