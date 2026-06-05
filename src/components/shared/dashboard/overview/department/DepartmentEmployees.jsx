import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { set } from "zod";
import { useDispatch } from "react-redux";
import { apiFetch } from "@/lib/apiFetch";

function DepartmentEmployees() {
    const { id: selectDepartmentId } = useParams();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeesData, departmentsData] = await Promise.all([
                    apiFetch(
                        `/api/employees/department/${selectDepartmentId}`,
                        {},
                        dispatch
                    ).catch(() => []),

                    apiFetch(
                        "/api/departments",
                        {},
                        dispatch
                    ),
                ]);

                setEmployees(employeesData);
                setDepartments(departmentsData);
            } catch (error) {
                toast.error("Error:", {
                    description:
                        error.message || "An error occurred while fetching data.",
                });
                setEmployees([]);
                setDepartments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectDepartmentId]);

    const handleDepartmentChange = async (userId, newDepartmentId) => {
        try {
            await apiFetch(
                "/api/departments",
                {
                    method: "POST",
                    body: JSON.stringify({
                        user_id: userId,
                        department_id: newDepartmentId,
                    }),
                },
                dispatch
            );

            toast.success("Department changed.", {
                description: "Employee's department has been updated successfully.",
            });
            setEmployees((prev) => prev.filter((emp) => emp.user_id !== userId));
        } catch (error) {
            toast.error("Error:", {
                description:
                    error.message || "An error occurred while changing department.",
            });
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Employees in Department
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(employees) && employees.length > 0 ? (
                                employees.map((employee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{employee.user_name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={String(selectDepartmentId)}
                                                onValueChange={(value) =>
                                                    handleDepartmentChange(employee.user_id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map((dept) => (
                                                        <SelectItem key={dept.id} value={String(dept.id)}>
                                                            {dept.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No employees found in this department.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default DepartmentEmployees;
