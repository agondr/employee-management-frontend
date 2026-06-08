import React, { useCallback, useEffect } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateTaskDialog from "@/components/shared/dashboard/tasks/CreateTaskDialog";
import TasksList from "@/components/shared/dashboard/tasks/TasksList";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, setTaskQueryParams } from "@/store/tasksSlice";
import { fetchEmployees } from "@/store/employeesSlice";

const TasksPage = () => {
  const dispatch = useDispatch();
  const { data: tasks, loading, error, pagination, paginationParams } = useSelector(
    (state) => state.tasks,
  );
  const { data: employees } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchTasks(paginationParams));
  }, [dispatch, paginationParams]);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 50 }));
  }, [dispatch]);

  const updateFilter = useCallback((key, value) => {
    dispatch(setTaskQueryParams({ [key]: value, page: 1 }));
  }, [dispatch]);

  const updatePage = useCallback((page) => {
    dispatch(setTaskQueryParams({ page }));
  }, [dispatch]);

  const updateLimit = useCallback((limit) => {
    dispatch(setTaskQueryParams({ limit, page: 1 }));
  }, [dispatch]);

  return (
    <Layout>
      <Header
        title="Task manager"
        subtitle="Here's a list of your tasks for this month."
      >
        <CreateTaskDialog />
      </Header>
      <TasksList
        tasks={tasks}
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

export default TasksPage;
