import React from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateTaskDialog from "@/components/shared/dashboard/tasks/CreateTaskDialog";
const TasksPage = () => {
  return (
    <Layout>
      <Header
        title="Task manager"
        subtitle="Here's a list of your tasks for this month."
      >
        <CreateTaskDialog />
      </Header>
    </Layout>
  );
};

export default TasksPage;
