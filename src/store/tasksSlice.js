import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

const getTaskId = (task) => task?.id ?? task?.task_id;

export const fetchTasks = createAsyncThunk(
  "tasks/",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch("/api/tasks", {}, dispatch);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk to assign single user to task
export const assignTaskUser = createAsyncThunk(
  "tasks/assignUser",
  async ({ taskId, userId }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/tasks/assign",
        {
          method: "POST",
          body: JSON.stringify({ user_id: userId, task_id: taskId }),
        },
        dispatch,
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk to assign multiple users to task
export const assignTaskUsers = createAsyncThunk(
  "tasks/assignUsers",
  async ({ taskId, userIds }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/tasks/assign/multiple",
        {
          method: "PUT",
          body: JSON.stringify({
            task_id: taskId,
            user_ids: userIds,
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

export const updateTaskFields = createAsyncThunk(
  "tasks/updateFields",
  async ({ taskId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/tasks/" + taskId,
        {
          method: "PUT",
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

export const deleteTaskById = createAsyncThunk(
  "tasks/deleteById",
  async (taskOrId, { dispatch, rejectWithValue }) => {
    const taskId = typeof taskOrId === "object" ? getTaskId(taskOrId) : taskOrId;

    try {
      await apiFetch(
        "/api/tasks/" + taskId,
        {
          method: "DELETE",
        },
        dispatch,
      );

      return {
        taskId,
        deletedTask: typeof taskOrId === "object" ? taskOrId : null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    data: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    addTask: (state, action) => {
      state.data.push(action.payload);
    },

    updateTask: (state, action) => {
      const updatedTaskId = getTaskId(action.payload);
      const index = state.data.findIndex(
        (task) => getTaskId(task) === updatedTaskId,
      );

      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },

    deleteTask: (state, action) => {
      state.data = state.data.filter((task) => getTaskId(task) !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = true;
        state.data = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })
      .addCase(assignTaskUser.fulfilled, (state, action) => {
        const assignment = action.payload;
        const task = state.data.find((task) => task.id === assignment.task_id);
        if (task) {
          task.assigned_users = [
            {
              user_id: assignment.user_id,
            },
          ];
        }
      })
      .addCase(assignTaskUsers.fulfilled, (state, action) => {
        const { task_id, assigned_users } = action.payload;

        const task = state.data.find((task) => task.id === task_id);

        if (task) {
          task.assigned_users = assigned_users;
        }
      })
      .addCase(updateTaskFields.fulfilled, (state, action) => {
        const updatedTask =
          action.payload?.task || action.payload?.data || action.payload || {};
        const updatedTaskId =
          getTaskId(updatedTask) ?? action.meta.arg.taskId;
        const index = state.data.findIndex(
          (task) => getTaskId(task) === updatedTaskId,
        );

        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...action.meta.arg.updates,
            ...updatedTask,
          };
        }
      })
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (task) => getTaskId(task) !== action.payload.taskId,
        );
      });
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
