import React, { useCallback, useEffect, useState } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateEmployeeDialog from "@/components/shared/dashboard/employee/CreateEmployeeDialog";
import EmployeesList from "@/components/shared/dashboard/employee/EmployeesList";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "@/store/employeesSlice";
import { toast } from "sonner";

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  departmentId: "all",
};

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(initialFilters);
  const {
    data: employees,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees(filters)).catch((error) => {
      toast.error("Error", {
        description: error || "Failed to fetch employees",
      });
    });
  }, [dispatch, filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => {
      if (current[key] === value && current.page === 1) return current;

      return {
        ...current,
        [key]: value,
        page: 1,
      };
    });
  }, []);

  const updatePage = useCallback((page) => {
    setFilters((current) => {
      if (current.page === page) return current;

      return {
        ...current,
        page,
      };
    });
  }, []);

  const updateLimit = useCallback((limit) => {
    setFilters((current) => {
      if (current.limit === limit && current.page === 1) return current;

      return {
        ...current,
        limit,
        page: 1,
      };
    });
  }, []);

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
        filters={filters}
        pagination={pagination}
        onFilterChange={updateFilter}
        onLimitChange={updateLimit}
        onPageChange={updatePage}
      />
    </Layout>
  );
};

export default EmployeesPage;
