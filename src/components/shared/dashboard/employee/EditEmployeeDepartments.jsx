import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/apiFetch";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateEmployee } from "@/store/employeesSlice";
import { moveDepartmentEmployee } from "@/store/departmentsSlice";

const EditEmployeeDepartments = ({ userId,
    currentDepartmentName,
    departments,
    onDepartmentUpdated,
}) => {
    const [selectedDepartment, setSelectedDepartment] = useState(currentDepartmentName);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        setSelectedDepartment(currentDepartmentName);
    }, [currentDepartmentName]);

    const handleDepartmentChange = async (value) => {
        setLoading(true);
        try {
            const department = departments.find((dept) => dept.name === value);
            if (!department) {
                throw new Error("Selected department not found");
            }
            const previousDepartment = departments.find(
                (dept) => dept.name === selectedDepartment
            );
            const newDepartmentId = department ? department.id : null;
            if (!newDepartmentId) {
                throw new Error("Selected department does not have a valid ID");
            }
            const data = await apiFetch(
                "/api/employees/update-department",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        user_id: userId,
                        department_id: newDepartmentId,
                    }),
                },
                dispatch
            );

            setSelectedDepartment(value);
            dispatch(updateEmployee({ user_id: userId, department_name: value }));
            dispatch(moveDepartmentEmployee({
                fromDepartmentId: previousDepartment?.id,
                toDepartmentId: newDepartmentId,
            }));
            onDepartmentUpdated(userId, newDepartmentId);

            toast.success("Success", {
                description: data.message + ` to ${value}` || `Department updated successfully to ${value}`,
            });
        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to update Department",
            });
        } finally {
            setLoading(false);
        }
        setSelectedDepartment(value);
    }
    return <Select value={selectedDepartment} onValueChange={handleDepartmentChange} disabled={loading}>
        <SelectTrigger className="h-5 w-fit font-medium text-sm">
            <SelectValue placeholder={selectedDepartment || "Select department"} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem disabled value="Unassigned">Unassigned</SelectItem>
            {departments.map((department) => (
                <SelectItem key={department.id} value={department.name}>
                    {department.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>;
};

export default EditEmployeeDepartments;
