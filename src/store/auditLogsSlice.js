import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "@/lib/apiFetch";

const defaultPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

const defaultPaginationParams = {
  page: 1,
  limit: 20,
  search: "",
  action: "all",
  entityType: "all",
  userId: "all",
};

const buildAuditLogsQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  const allowedKeys = ["page", "limit", "search", "action", "entityType", "userId"];

  allowedKeys.forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? "?" + queryString : "";
};

export const fetchAuditLogs = createAsyncThunk(
  "auditLogs/fetchAuditLogs",
  async (params = {}, { dispatch, rejectWithValue }) => {
    try {
      const data = await apiFetch(
        "/api/audit-logs" + buildAuditLogsQuery(params),
        {},
        dispatch,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState: {
    data: [],
    pagination: defaultPagination,
    paginationParams: defaultPaginationParams,
    loading: false,
    error: null,
  },
  reducers: {
    setAuditLogQueryParams: (state, action) => {
      state.paginationParams = {
        ...state.paginationParams,
        ...action.payload,
      };
    },
    resetAuditLogQueryParams: (state) => {
      state.paginationParams = defaultPaginationParams;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
        state.pagination = action.payload?.pagination || defaultPagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch audit logs";
      });
  },
});

export const { setAuditLogQueryParams, resetAuditLogQueryParams } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;
