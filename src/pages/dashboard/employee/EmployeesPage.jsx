import React, { useCallback, useEffect } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateEmployeeDialog from "@/components/shared/dashboard/employee/CreateEmployeeDialog";
import EmployeesList from "@/components/shared/dashboard/employee/EmployeesList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, setEmployeeQueryParams } from "@/store/employeesSlice";
import { toast } from "sonner";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const {
    data: employees,
    loading,
    error,
    pagination,
    paginationParams,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees(paginationParams)).catch((error) => {
      toast.error("Error", {
        description: error || "Failed to fetch employees",
      });
    });
  }, [dispatch, paginationParams]);

  const updateFilter = useCallback((key, value) => {
    dispatch(setEmployeeQueryParams({ [key]: value, page: 1 }));
  }, [dispatch]);

  const updatePage = useCallback((page) => {
    dispatch(setEmployeeQueryParams({ page }));
  }, [dispatch]);

  const updateLimit = useCallback((limit) => {
    dispatch(setEmployeeQueryParams({ limit, page: 1 }));
  }, [dispatch]);

  return (
    <Layout>
      <Header
        title="Employees"
        subtitle="Here's a list of all employees from this department."
      >
        <CreateEmployeeDialog />
      </Header>
      <EmployeesList
        employees={employees}
        loading={loading}
        error={error}
        filters={paginationParams}
        pagination={pagination}
        onFilterChange={updateFilter}
        onLimitChange={updateLimit}
        onPageChange={updatePage}
      />
    </Layout>
  );
};

export default EmployeesPage;
