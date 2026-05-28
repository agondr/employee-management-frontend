import React from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import EditDepartmentCard from "@/components/shared/dashboard/overview/department/EditDepartmentCard";

function EditDepartment() {
  return (
    <Layout>
      <Header
        title="Department Details"
        subtitle="Here you can edit department's"
      ></Header>
      <div className="flex lg:flex-row flex-col gap-5">
        <div>
          <EditDepartmentCard />
        </div>
        <div className="w-full h-screen">Department Employees</div>
      </div>
    </Layout>
  );
}

export default EditDepartment;
