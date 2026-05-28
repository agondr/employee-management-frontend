import React, { useState } from "react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListCheck, Logs, Plus } from "lucide-react";
import Stats from "@/components/shared/dashboard/overview/stats/Stats";
import DepartmentsList from "@/components/shared/dashboard/overview/department/DepartmentsList";
import CreateDepartmentDialog from "@/components/shared/dashboard/overview/department/CreateDepartmentDialog";
const OverviewPage = () => {
  const [isListView, setIsListView] = useState(true);
  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Here you can manage all the departments, users and tasks."
      >
        {/*  <Button>
          <Plus />
          Create new Department
        </Button> */}
        <CreateDepartmentDialog />
      </Header>
      <Stats />
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">List of all departments</h1>
          <div className="flex flex-nowrap gap-2">
            <Button
              onClick={() => setIsListView(true)}
              variant={isListView ? "" : "outline"}
              size="icon"
            >
              <Logs />
            </Button>
            <Button
              onClick={() => setIsListView(false)}
              variant={isListView ? "outline" : ""}
              size="icon"
            >
              <LayoutDashboard />
            </Button>
          </div>
        </div>
        <DepartmentsList isListView={isListView} />
      </div>
    </Layout>
  );
};

export default OverviewPage;
