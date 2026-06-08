import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";
import Layout from "../Layout";
import Header from "@/components/shared/dashboard/Header";
import AuditLogsTable from "@/components/audit/AuditLogsTable";
import PageSizeSelect from "@/components/shared/table/PageSizeSelect";
import PaginationControls from "@/components/shared/table/PaginationControls";
import TableSearchInput from "@/components/shared/table/TableSearchInput";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAuditLogs, setAuditLogQueryParams } from "@/store/auditLogsSlice";
import { fetchEmployees } from "@/store/employeesSlice";

const ACTION_OPTIONS = [
  "CREATE_EMPLOYEE",
  "ADMIN_CHANGE_EMPLOYEE_PASSWORD",
  "DISABLE_EMPLOYEE",
  "ENABLE_EMPLOYEE",
  "UPDATE_EMPLOYEE_PROFILE",
  "CREATE_TASK",
  "UPDATE_TASK",
  "DELETE_TASK",
  "UPDATE_TASK_ASSIGNEES",
  "CREATE_DEPARTMENT",
  "UPDATE_DEPARTMENT",
  "DELETE_DEPARTMENT",
  "UPDATE_EMPLOYEE_STATUS",
  "UPDATE_EMPLOYEE_DEPARTMENT",
  "CHANGE_PASSWORD",
  "LOGIN_SUCCESS",
];

const ENTITY_OPTIONS = ["task", "department", "employee", "user", "auth"];

function AuditLogsPage() {
  const dispatch = useDispatch();
  const { data: logs, loading, error, pagination, paginationParams } = useSelector(
    (state) => state.auditLogs,
  );
  const employees = useSelector((state) => state.employees?.data || []);
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.status === "admin";

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAuditLogs(paginationParams));
    }
  }, [dispatch, paginationParams, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchEmployees({ page: 1, limit: 50 }));
    }
  }, [dispatch, isAdmin]);

  const updateFilter = useCallback((key, value) => {
    dispatch(setAuditLogQueryParams({ [key]: value, page: 1 }));
  }, [dispatch]);

  const updatePage = useCallback((page) => {
    dispatch(setAuditLogQueryParams({ page }));
  }, [dispatch]);

  const updateLimit = useCallback((limit) => {
    dispatch(setAuditLogQueryParams({ limit, page: 1 }));
  }, [dispatch]);

  if (!isAdmin) {
    return (
      <Layout>
        <Header
          title="Audit Logs"
          subtitle="Review security and activity history across the system."
        />
        <div className="rounded-md border bg-muted/30 p-6 text-sm text-muted-foreground">
          Audit logs are available to admin users only.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        title="Audit Logs"
        subtitle="Review security and activity history across the system."
      >
        <Badge variant="outline" className="gap-2 px-3 py-1">
          <ShieldCheck className="h-4 w-4" />
          Admin
        </Badge>
      </Header>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <TableSearchInput
            value={paginationParams.search}
            placeholder="Search audit logs..."
            onChange={(value) => updateFilter("search", value)}
          />

          <Select
            value={paginationParams.action}
            onValueChange={(value) => updateFilter("action", value)}
          >
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {ACTION_OPTIONS.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paginationParams.entityType}
            onValueChange={(value) => updateFilter("entityType", value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              {ENTITY_OPTIONS.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paginationParams.userId}
            onValueChange={(value) => updateFilter("userId", value)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.user_id} value={String(employee.user_id)}>
                  {employee.user_name || employee.email || "User #" + employee.user_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <PageSizeSelect value={paginationParams.limit} onChange={updateLimit} />
        </div>

        <AuditLogsTable logs={logs} loading={loading} error={error} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {pagination?.total || 0} audit logs found
          </p>
          <PaginationControls
            page={pagination?.page || 1}
            totalPages={pagination?.totalPages || 0}
            disabled={loading}
            onPageChange={updatePage}
          />
        </div>
      </div>
    </Layout>
  );
}

export default AuditLogsPage;
