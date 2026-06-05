import React, { useCallback, useEffect, useState } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import CreateTaskDialog from "@/components/shared/dashboard/tasks/CreateTaskDialog";
import TasksList from "@/components/shared/dashboard/tasks/TasksList";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/store/tasksSlice";
import { fetchEmployees } from "@/store/employeesSlice";

const initialFilters = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  priority: "all",
  assignedUserId: "all",
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(initialFilters);
  const { data: tasks, loading, error, pagination } = useSelector(
    (state) => state.tasks,
  );
  const { data: employees } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 50 }));
  }, [dispatch]);

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
        filters={filters}
        pagination={pagination}
        onFilterChange={updateFilter}
        onLimitChange={updateLimit}
        onPageChange={updatePage}
      />
    </Layout>
  );
};

export default TasksPage;
