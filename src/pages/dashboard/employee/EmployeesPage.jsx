import React, { useEffect } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateEmployeeDialog from "@/components/shared/dashboard/employee/CreateEmployeeDialog";
import EmployeesList from "@/components/shared/dashboard/employee/EmployeesList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/store/employeesSlice";
import { toast } from "sonner";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const {
    data: Employees,
    loading,
    error,
    hasFetched,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchEmployees()).catch((error) => {
        toast.error("Error", {
          description: error || "Failed to fetch employees",
        });
      });
    }
  }, [dispatch, hasFetched]);

  return (
    <Layout>
      <Header
        title="Employees"
        subtitle="Here's a list of all employees from this department."
      >
        <CreateEmployeeDialog />
      </Header>
      <EmployeesList employees={Employees} loading={loading} error={error} />
    </Layout>
  );
};

export default EmployeesPage;
