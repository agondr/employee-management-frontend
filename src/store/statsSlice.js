import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";
import { addDepartment, deleteDepartment, fetchDepartments } from "./departmentsSlice";
import { addEmployees, fetchEmployees } from "./employeesSlice";
import {
  addTask,
  deleteTaskById,
  fetchTasks,
  updateTaskFields,
} from "./tasksSlice";

const initialStats = {
  departments: 0,
  totalUsers: 0,
  totalTasks: 0,
  doneTasks: 0,
};

const isDone = (status) => String(status || "").toLowerCase() === "done";

export const fetchOverviewStats = createAsyncThunk(
  "stats/fetchOverview",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/stats/overview", {}, dispatch);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    data: initialStats,
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewStats.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.data = {
          departments: action.payload.departments || 0,
          totalUsers: action.payload.totalUsers || 0,
          totalTasks: action.payload.totalTasks || 0,
          doneTasks: action.payload.doneTasks || 0,
        };
      })
      .addCase(fetchOverviewStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch overview stats";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.data.departments = Array.isArray(action.payload)
          ? action.payload.length
          : state.data.departments;
      })
      .addCase(addDepartment, (state) => {
        state.data.departments += 1;
      })
      .addCase(deleteDepartment, (state) => {
        state.data.departments = Math.max(0, state.data.departments - 1);
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.data.totalUsers = Array.isArray(action.payload)
          ? action.payload.length
          : state.data.totalUsers;
      })
      .addCase(addEmployees, (state) => {
        state.data.totalUsers += 1;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const tasks = Array.isArray(action.payload) ? action.payload : [];
        state.data.totalTasks = tasks.length;
        state.data.doneTasks = tasks.filter((task) => isDone(task.status)).length;
      })
      .addCase(addTask, (state, action) => {
        state.data.totalTasks += 1;
        if (isDone(action.payload?.status)) {
          state.data.doneTasks += 1;
        }
      })
      .addCase(updateTaskFields.fulfilled, (state, action) => {
        const previousStatus = action.meta.arg.previousTask?.status;
        const nextStatus =
          action.payload?.status ||
          action.payload?.task?.status ||
          action.payload?.data?.status ||
          action.meta.arg.updates?.status;

        if (!nextStatus || previousStatus === nextStatus) return;

        if (!isDone(previousStatus) && isDone(nextStatus)) {
          state.data.doneTasks += 1;
        }

        if (isDone(previousStatus) && !isDone(nextStatus)) {
          state.data.doneTasks = Math.max(0, state.data.doneTasks - 1);
        }
      })
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        state.data.totalTasks = Math.max(0, state.data.totalTasks - 1);
        if (isDone(action.payload?.deletedTask?.status)) {
          state.data.doneTasks = Math.max(0, state.data.doneTasks - 1);
        }
      });
  },
});

export default statsSlice.reducer;
