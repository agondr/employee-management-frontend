import { useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AuditLogDetailsDialog from "./AuditLogDetailsDialog";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (part) => String(part).padStart(2, "0");
  return pad(date.getDate()) + "." + pad(date.getMonth() + 1) + "." + date.getFullYear() + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
};

const ACTION_SUMMARIES = {
  CREATE_EMPLOYEE: "Created employee",
  ADMIN_CHANGE_EMPLOYEE_PASSWORD: "Admin changed employee password",
  DISABLE_EMPLOYEE: "Disabled employee account",
  ENABLE_EMPLOYEE: "Enabled employee account",
  UPDATE_EMPLOYEE_PROFILE: "Updated employee profile",
  CREATE_TASK: "Created task",
  UPDATE_TASK: "Updated task",
  DELETE_TASK: "Deleted task",
  UPDATE_TASK_ASSIGNEES: "Updated task assignees",
  CREATE_DEPARTMENT: "Created department",
  UPDATE_DEPARTMENT: "Updated department",
  DELETE_DEPARTMENT: "Deleted department",
  UPDATE_EMPLOYEE_STATUS: "Updated employee status",
  UPDATE_EMPLOYEE_DEPARTMENT: "Updated employee department",
  CHANGE_PASSWORD: "Changed password",
  LOGIN_SUCCESS: "Successful login",
};

const getSummary = (log) => {
  if (!log) return "-";
  return ACTION_SUMMARIES[log.action] || log.action?.replaceAll("_", " ") || "Audit event";
};

function AuditLogsTable({ logs = [], loading, error }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const selectedLogId = selectedLog?.id;

  const dialogLog = useMemo(
    () => logs.find((log) => log.id === selectedLogId) || selectedLog,
    [logs, selectedLog, selectedLogId],
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px]">Time</TableHead>
            <TableHead className="min-w-[180px]">User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead className="min-w-[180px]">Summary</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="w-[90px] text-right">Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading audit logs...
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No audit logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => {
              const userLabel = log.user_name || log.email || (log.user_id ? "User #" + log.user_id : "System");

              return (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[220px] space-y-0.5">
                      <p className="truncate font-medium">{userLabel}</p>
                      {log.email && (
                        <p className="truncate text-xs text-muted-foreground">{log.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {log.entity_type || "-"}{log.entity_id ? " #" + log.entity_id : ""}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getSummary(log)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">
                    {log.ip_address || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <AuditLogDetailsDialog
        log={dialogLog}
        open={!!selectedLog}
        onOpenChange={(open) => {
          if (!open) setSelectedLog(null);
        }}
      />
    </>
  );
}

export default AuditLogsTable;
