import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import EditEmployeeStatus from "./EditEmployeeStatus";
import EditEmployeeDepartments from "./EditEmployeeDepartments";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "@/store/departmentsSlice";

const EmployeesList = ({ employees }) => {
    const dispatch = useDispatch();
    const { departments, loading, error, hasFetched } = useSelector((state) => state.departments);

    useEffect(() => {
        if (!hasFetched) {
            dispatch(fetchDepartments());
        }
    }, [dispatch, hasFetched]);

    const [updatedEmployees, setUpdatedEmployees] = useState(employees);

    useEffect(() => {
        setUpdatedEmployees(employees);
    }, [employees]);

    const handleDepartmentUpdated = () => {

    };
    return (
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
                ) : updatedEmployees.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No Employees found.
                        </TableCell>
                    </TableRow>
                ) : (
                    updatedEmployees.map((employee, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{employee.user_name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                                <EditEmployeeStatus
                                    userId={employee.user_id}
                                    currentStatus={employee.status}
                                />
                            </TableCell>
                            <TableCell>
                                {loading && <span>Loading...</span>}
                                {departments.length === 0 && !loading && !error && (
                                    <span>No Departments</span>
                                )}
                                {!loading && !error && departments.length > 0 ? (

                                    <EditEmployeeDepartments
                                        userId={employee.user_id}
                                        currentDepartmentName={employee.department_name || "Unassigned"}
                                        departments={departments}
                                        onDepartmentUpdated={
                                            handleDepartmentUpdated
                                        }
                                    />
                                ) : null}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
};

export default EmployeesList;
