import React, { useEffect } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateTaskDialog from "@/components/shared/dashboard/tasks/CreateTaskDialog";
import TasksList from "@/components/shared/dashboard/tasks/TasksList";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/store/tasksSlice";
import { fetchEmployees } from "@/store/employeesSlice";

const TasksPage = () => {
  const dispatch = useDispatch();
  const {
    data: tasks,
    loading,
    error,
    hasFetched: tasksFetched,
  } = useSelector((state) => state.tasks);
  const {
    data: employees,
    hasFetched: employeesFetched,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    if (!tasksFetched) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasksFetched]);

  useEffect(() => {
    if (!employeesFetched) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employeesFetched]);

  return (
    <Layout>
      <Header
        title="Task manager"
        subtitle="Here's a list of your tasks for this month."
      >
        <CreateTaskDialog />
      </Header>
      <TasksList tasks={tasks} employees={employees} loading={loading} error={error} />
    </Layout>
  );
};

export default TasksPage;
