import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPages from "./pages/LandingPages";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OverviewPage from "./pages/dashboard/overview/OverviewPage";
import EmployeesPage from "./pages/dashboard/employee/EmployeesPage";
import TasksPage from "./pages/dashboard/tasks/TasksPage";
import EditDepartment from "./pages/dashboard/overview/EditDepartment";
import { Toaster } from "./components/ui/sonner";
import PrivateRoute from "./lib/PrivateRoute";
export default function App() {
  return (
    <>
      <Router basename="/employee-management-frontend">
        <Routes>
          <Route path="/" element={<LandingPages />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Private Routs */}
          <Route path="/overview" element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
          <Route path="/edit-department/:id" element={<EditDepartment />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}
