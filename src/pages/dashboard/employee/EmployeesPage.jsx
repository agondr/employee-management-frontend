import React from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateEmployeeDialog from "@/components/shared/dashboard/employee/CreateEmployeeDialog";

const EmployeesPage = () => {
  return (
    <Layout>
      <Header
        title="Employees"
        subtitle="Here's a list of all employees from this department."
      >
        <CreateEmployeeDialog />
      </Header>
    </Layout>
  );
};

export default EmployeesPage;
