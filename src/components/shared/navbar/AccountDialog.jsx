import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchEmployees } from "@/store/employeesSlice";

const getUserValue = (user, keys, fallback = "Not available") => {
  const value = keys.map((key) => user?.[key]).find(Boolean);
  return value || fallback;
};

const findEmployeeForUser = (user, employees) => {
  if (!user || !Array.isArray(employees)) return null;

  return employees.find((employee) => {
    const sameId =
      user.user_id && employee.user_id && Number(user.user_id) === Number(employee.user_id);
    const sameEmail =
      user.email && employee.email && user.email.toLowerCase() === employee.email.toLowerCase();
    const sameUsername =
      (user.username || user.user_name) &&
      employee.user_name &&
      (user.username || user.user_name).toLowerCase() === employee.user_name.toLowerCase();

    return sameId || sameEmail || sameUsername;
  });
};

const accountRows = [
  {
    label: "Username",
    keys: ["username", "user_name", "name"],
  },
  {
    label: "Email",
    keys: ["email"],
  },
  {
    label: "Status",
    keys: ["status", "role"],
  },
  {
    label: "Department",
    keys: ["department_name", "department"],
    optional: true,
  },
];

function AccountDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const employees = useSelector((state) => state.employees?.data || []);
  const employeesFetched = useSelector((state) => state.employees?.hasFetched || false);

  useEffect(() => {
    if (open && !employeesFetched) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employeesFetched, open]);

  const user = useMemo(() => {
    const employeeUser = findEmployeeForUser(authUser, employees);

    return {
      ...employeeUser,
      ...authUser,
      status: authUser?.status || employeeUser?.status,
      department_name: authUser?.department_name || employeeUser?.department_name,
      department: authUser?.department || employeeUser?.department,
    };
  }, [authUser, employees]);

  const visibleRows = accountRows.filter((row) => {
    if (!row.optional) return true;
    return getUserValue(user, row.keys, "") !== "";
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>My Account</DialogTitle>
          <DialogDescription>
            Review the account information connected to your session.
          </DialogDescription>
        </DialogHeader>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">
              {getUserValue(user, ["username", "user_name", "name"], "Account")}
            </CardTitle>
            <CardDescription>
              {getUserValue(user, ["email"], "No email available")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="grid gap-3">
              {visibleRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 rounded-md border bg-muted/30 p-3 sm:grid-cols-[140px_1fr] sm:items-center"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold">
                    {getUserValue(user, row.keys)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDialog;
