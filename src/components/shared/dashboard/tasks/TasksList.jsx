import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  assignTaskUsers,
  deleteTaskById,
  updateTaskFields,
} from "@/store/tasksSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageSizeSelect from "@/components/shared/table/PageSizeSelect";
import PaginationControls from "@/components/shared/table/PaginationControls";
import TableSearchInput from "@/components/shared/table/TableSearchInput";
import { TaskUsersMultiSelect } from "./TaskUsersMultiSelect";
import { TaskStatusDropdown } from "./TaskStatusDropdown";
import { TaskPriorityDropdown } from "./TaskPriorityDropdown";

const getTaskId = (task) => task?.id ?? task?.task_id;

const getAssignedUserIds = (task) => {
  return (
    task.assigned_users
      ?.map((user) => user.user_id ?? user.useri_id)
      .filter(Boolean) || []
  );
};

function InlineTaskTitle({ title, disabled, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title || "");
  const cancelBlurRef = useRef(false);

  const startEditing = () => {
    if (disabled) return;
    setDraft(title || "");
    setEditing(true);
  };

  const cancelEditing = () => {
    cancelBlurRef.current = true;
    setDraft(title || "");
    setEditing(false);
  };

  const saveTitle = async () => {
    const nextTitle = draft.trim();

    if (!nextTitle) {
      setDraft(title || "");
      setEditing(false);
      return;
    }

    if (nextTitle === title) {
      setEditing(false);
      return;
    }

    await onSave(nextTitle);
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        autoFocus
        disabled={disabled}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={async () => {
          if (cancelBlurRef.current) {
            cancelBlurRef.current = false;
            return;
          }

          await saveTitle();
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            await saveTitle();
          }

          if (event.key === "Escape") {
            event.preventDefault();
            cancelEditing();
          }
        }}
        className="h-8 min-w-[220px]"
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={startEditing}
      className="max-w-[360px] truncate rounded-sm px-1 py-0.5 text-left font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      title="Rename task"
    >
      {title || "Untitled task"}
    </button>
  );
}

function DeleteTaskButton({ task, disabled, onDelete }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const taskTitle = task.title || "this task";

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await onDelete();
      setOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled || deleting}
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
        title="Delete task"
      >
        {deleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{taskTitle}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const TasksList = ({
  tasks = [],
  employees = [],
  loading,
  error,
  filters,
  pagination,
  onFilterChange,
  onLimitChange,
  onPageChange,
}) => {
  const dispatch = useDispatch();
  const [updatingTaskIds, setUpdatingTaskIds] = useState([]);
  const [assigningTaskIds, setAssigningTaskIds] = useState([]);
  const pageStart = ((pagination?.page || 1) - 1) * (pagination?.limit || 10);

  const setTaskUpdating = (taskId, updating) => {
    setUpdatingTaskIds((current) =>
      updating
        ? [...new Set([...current, taskId])]
        : current.filter((id) => id !== taskId),
    );
  };

  const setTaskAssigning = (taskId, assigning) => {
    setAssigningTaskIds((current) =>
      assigning
        ? [...new Set([...current, taskId])]
        : current.filter((id) => id !== taskId),
    );
  };

  const handleAssignUsers = async (taskId, userIds) => {
    setTaskAssigning(taskId, true);

    try {
      await dispatch(
        assignTaskUsers({
          taskId,
          userIds,
        }),
      ).unwrap();

      toast.success("Task assignees updated");
    } catch (error) {
      toast.error(error || "Failed to update assignees");
    } finally {
      setTaskAssigning(taskId, false);
    }
  };

  const handleUpdateTask = async (taskId, updates, previousTask = null) => {
    setTaskUpdating(taskId, true);

    try {
      await dispatch(updateTaskFields({ taskId, updates, previousTask })).unwrap();
      toast.success("Task updated");
    } catch (error) {
      toast.error(error || "Failed to update task");
      throw error;
    } finally {
      setTaskUpdating(taskId, false);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await dispatch(deleteTaskById(task)).unwrap();
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error || "Failed to delete task");
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <TableSearchInput
          value={filters.search}
          placeholder="Search tasks..."
          onChange={(value) => onFilterChange("search", value)}
        />

        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="todo">todo</SelectItem>
            <SelectItem value="in-progress">in-progress</SelectItem>
            <SelectItem value="done">done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => onFilterChange("priority", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.assignedUserId}
          onValueChange={(value) => onFilterChange("assignedUserId", value)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Assigned user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.user_id} value={String(employee.user_id)}>
                {employee.user_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <PageSizeSelect value={filters.limit} onChange={onLimitChange} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-1/5">Assigned To</TableHead>
            <TableHead className="w-[90px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading Tasks...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No Tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => {
              const taskId = getTaskId(task);
              const isUpdating = updatingTaskIds.includes(taskId);
              const isAssigning = assigningTaskIds.includes(taskId);

              return (
                <TableRow key={taskId || index}>
                  <TableCell>{pageStart + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex min-w-[240px] items-center gap-2">
                      <InlineTaskTitle
                        title={task.title}
                        disabled={isUpdating}
                        onSave={(title) => handleUpdateTask(taskId, { title })}
                      />
                      {isUpdating && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TaskStatusDropdown
                      value={task.status}
                      onChange={(status) => handleUpdateTask(taskId, { status }, task)}
                    />
                  </TableCell>

                  <TableCell>
                    <TaskPriorityDropdown
                      value={task.priority}
                      onChange={(priority) =>
                        handleUpdateTask(taskId, { priority })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TaskUsersMultiSelect
                        employees={employees}
                        value={getAssignedUserIds(task)}
                        onChange={(userIds) => handleAssignUsers(taskId, userIds)}
                      />
                      {isAssigning && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteTaskButton
                      task={task}
                      disabled={isUpdating || isAssigning}
                      onDelete={() => handleDeleteTask(task)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {pagination?.total || 0} tasks found
        </p>
        <PaginationControls
          page={pagination?.page || 1}
          totalPages={pagination?.totalPages || 0}
          disabled={loading}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default TasksList;
