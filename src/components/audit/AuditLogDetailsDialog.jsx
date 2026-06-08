import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (part) => String(part).padStart(2, "0");
  return pad(date.getDate()) + "." + pad(date.getMonth() + 1) + "." + date.getFullYear() + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
};

const formatJson = (value) => {
  if (value === null || value === undefined) return "No data";
  return JSON.stringify(value, null, 2);
};

function DetailItem({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{children || "-"}</div>
    </div>
  );
}

function JsonBlock({ label, value }) {
  const empty = value === null || value === undefined;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {empty ? (
        <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          No data
        </div>
      ) : (
        <pre className="max-h-[260px] overflow-auto rounded-md border bg-slate-950 p-3 text-xs leading-relaxed text-slate-50">
          {formatJson(value)}
        </pre>
      )}
    </div>
  );
}

function AuditLogDetailsDialog({ log, open, onOpenChange }) {
  const userLabel = log?.user_name || log?.email || (log?.user_id ? "User #" + log.user_id : "System");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Full metadata and JSON values for the selected audit event.
          </DialogDescription>
        </DialogHeader>

        {log && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Action">
                <Badge variant="outline">{log.action}</Badge>
              </DetailItem>
              <DetailItem label="Entity type">{log.entity_type}</DetailItem>
              <DetailItem label="Entity ID">{log.entity_id || "-"}</DetailItem>
              <DetailItem label="User">
                <div className="space-y-0.5">
                  <p>{userLabel}</p>
                  {log.email && <p className="text-xs text-muted-foreground">{log.email}</p>}
                </div>
              </DetailItem>
              <DetailItem label="IP address">{log.ip_address}</DetailItem>
              <DetailItem label="Created at">{formatDateTime(log.created_at)}</DetailItem>
            </div>

            <DetailItem label="User agent">
              <p className="break-words text-sm text-muted-foreground">
                {log.user_agent || "-"}
              </p>
            </DetailItem>

            <div className="grid gap-4 lg:grid-cols-2">
              <JsonBlock label="Old value" value={log.old_value} />
              <JsonBlock label="New value" value={log.new_value} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AuditLogDetailsDialog;
