import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import EditEmployeeStatus from "./EditEmployeeStatus";
import EditEmployeeDepartments from "./EditEmployeeDepartments";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "@/store/departmentsSlice";
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

const EmployeesList = ({
    employees,
    loading,
    error,
    filters,
    pagination,
    onFilterChange,
    onLimitChange,
    onPageChange,
}) => {
    const dispatch = useDispatch();
    const {
        departments,
        loading: departmentsLoading,
        error: departmentsError,
        hasFetched,
    } = useSelector((state) => state.departments);
    const pageStart = ((pagination?.page || 1) - 1) * (pagination?.limit || 10);

    useEffect(() => {
        if (!hasFetched) {
            dispatch(fetchDepartments());
        }
    }, [dispatch, hasFetched]);

    const handleDepartmentUpdated = () => { };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <TableSearchInput
                    value={filters.search}
                    placeholder="Search employees..."
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
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="employee">employee</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.departmentId}
                    onValueChange={(value) => onFilterChange("departmentId", value)}
                    disabled={departmentsLoading}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        {departments.map((department) => (
                            <SelectItem key={department.id} value={String(department.id)}>
                                {department.name}
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
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Department</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Loading Employees...
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-red-500">
                                {error}
                            </TableCell>
                        </TableRow>
                    ) : employees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No Employees found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        employees.map((employee, index) => (
                            <TableRow key={employee.user_id || index}>
                                <TableCell>{pageStart + index + 1}</TableCell>
                                <TableCell>{employee.user_name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    <EditEmployeeStatus
                                        userId={employee.user_id}
                                        currentStatus={employee.status}
                                    />
                                </TableCell>
                                <TableCell>
                                    {departmentsLoading && <span>Loading...</span>}
                                    {departments.length === 0 && !departmentsLoading && !departmentsError && (
                                        <span>No Departments</span>
                                    )}
                                    {!departmentsLoading && !departmentsError && departments.length > 0 ? (
                                        <EditEmployeeDepartments
                                            userId={employee.user_id}
                                            currentDepartmentName={employee.department_name || "Unassigned"}
                                            departments={departments}
                                            onDepartmentUpdated={handleDepartmentUpdated}
                                        />
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {pagination?.total || 0} employees found
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

export default EmployeesList;
