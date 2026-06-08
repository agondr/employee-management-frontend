import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import departmentsReducer from "./departmentsSlice";
import employeesReducer from "./employeesSlice";
import tasksReducer from "./tasksSlice";
import statsReducer from "./statsSlice";
import auditLogsReducer from "./auditLogsSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentsReducer,
    employees: employeesReducer,
    tasks: tasksReducer,
    stats: statsReducer,
    auditLogs: auditLogsReducer,
  },
});

export default store;
