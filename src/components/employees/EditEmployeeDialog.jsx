import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminChangeEmployeePassword,
  fetchEmployeeTasks,
  updateEmployeeProfile,
} from "@/store/employeesSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const profileSchema = z.object({
  first_name: z.string().max(100, { message: "First name must be 100 characters or less" }).optional(),
  last_name: z.string().max(100, { message: "Last name must be 100 characters or less" }).optional(),
  status: z.enum(["admin", "employee"]),
  department_id: z.string().optional(),
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const sections = [
  { value: "profile", label: "Profile" },
  { value: "account", label: "Account" },
  { value: "tasks", label: "Assigned Tasks" },
];

function PasswordField({ field, visible, onToggle, placeholder }) {
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete="new-password"
        className="pr-10"
        {...field}
        value={field.value || ""}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
        onClick={onToggle}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function EditEmployeeDialog({ employee, departments = [], open, onOpenChange }) {
  const dispatch = useDispatch();
  const [section, setSection] = useState("profile");
  const [isActive, setIsActive] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const taskState = useSelector(
    (state) => state.employees.employeeTasks?.[employee?.user_id] || { data: [], loading: false, error: null },
  );

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      status: "employee",
      department_id: "none",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const employeeName = useMemo(() => {
    const fullName = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ");
    return fullName || employee?.user_name || employee?.email || "employee";
  }, [employee]);

  useEffect(() => {
    if (!open || !employee?.user_id) return;

    setSection("profile");
    setIsActive(employee.is_active !== false);
    profileForm.reset({
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      status: employee.status || "employee",
      department_id: employee.department_id ? String(employee.department_id) : "none",
    });
    passwordForm.reset({ newPassword: "", confirmPassword: "" });
    dispatch(fetchEmployeeTasks(employee.user_id));
  }, [dispatch, employee, open, passwordForm, profileForm]);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      passwordForm.reset({ newPassword: "", confirmPassword: "" });
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
    onOpenChange(nextOpen);
  };

  const onProfileSubmit = async (values) => {
    setSavingProfile(true);
    try {
      await dispatch(
        updateEmployeeProfile({
          userId: employee.user_id,
          updates: {
            first_name: values.first_name || null,
            last_name: values.last_name || null,
            status: values.status,
            department_id: values.department_id === "none" ? null : Number(values.department_id),
            is_active: isActive,
          },
        }),
      ).unwrap();
      toast.success("Employee profile updated");
    } catch (error) {
      toast.error(error || "Failed to update employee profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const saveAccountStatus = async () => {
    setSavingAccount(true);
    try {
      await dispatch(
        updateEmployeeProfile({
          userId: employee.user_id,
          updates: { is_active: isActive },
        }),
      ).unwrap();
      toast.success(isActive ? "Employee account enabled" : "Employee account disabled");
    } catch (error) {
      toast.error(error || "Failed to update account status");
    } finally {
      setSavingAccount(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setSavingPassword(true);
    try {
      await dispatch(
        adminChangeEmployeePassword({
          userId: employee.user_id,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      ).unwrap();
      toast.success("Employee password updated");
      passwordForm.reset({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error || "Failed to update employee password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>{employeeName}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 border-b pb-3">
          {sections.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={section === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSection(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {section === "profile" && (
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input value={employee?.user_name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={employee?.email || ""} readOnly />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Unassigned</SelectItem>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={String(department.id)}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {section === "account" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <p className="font-medium">Account status</p>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Employee can sign in." : "Employee account is disabled."}
                </p>
              </div>
              <Button
                type="button"
                variant={isActive ? "default" : "outline"}
                onClick={() => setIsActive((value) => !value)}
              >
                {isActive ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={saveAccountStatus} disabled={savingAccount}>
                {savingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Account Status
              </Button>
            </div>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5 border-t pt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            field={field}
                            visible={showNewPassword}
                            onToggle={() => setShowNewPassword((value) => !value)}
                            placeholder="New password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            field={field}
                            visible={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword((value) => !value)}
                            placeholder="Confirm password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={savingPassword}>
                    {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                    Change Password
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}

        {section === "tasks" && (
          <div className="space-y-3">
            {taskState.loading ? (
              <div className="flex h-24 items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading assigned tasks...
              </div>
            ) : taskState.error ? (
              <div className="rounded-md border p-4 text-sm text-red-500">{taskState.error}</div>
            ) : taskState.data.length === 0 ? (
              <div className="rounded-md border p-4 text-sm text-muted-foreground">
                No assigned tasks.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskState.data.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditEmployeeDialog;
