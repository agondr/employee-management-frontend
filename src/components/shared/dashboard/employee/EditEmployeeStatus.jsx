import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/apiFetch";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { updateEmployee } from "@/store/employeesSlice";

function EditEmployeeStatus({ userId, currentStatus }) {
    const token = localStorage.getItem("token");
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const statuses = [
        { value: "admin", label: "Admin" },
        { value: "employee", label: "Employee" },
    ];
    const handleStatusChange = async (status) => {
        setLoading(true);
        try {
            const response = await apiFetch(
                "/api/employees/update-status",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        user_id: userId,
                        status: status,
                    }),
                },
                dispatch
            );
            const result = await response;

            setStatus(result.data.status);
            dispatch(updateEmployee({ user_id: userId, status: result.data.status }));

            toast.success("Success", {
                description: `Employee status has been updated to ${result.data.status} successfully`,
            });

        } catch (error) {
            toast.error("Error", {
                description: error.message || "Failed to update status",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value)}
            disabled={loading}
        >
            <SelectTrigger className="w-fit h-5 text-xs font-medium border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                {loading ? <SelectItem>Loading...</SelectItem> : null}
                {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                        {status.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default EditEmployeeStatus;
