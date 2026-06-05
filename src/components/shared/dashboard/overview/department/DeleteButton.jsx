import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { apiFetch } from "@/lib/apiFetch";
import { deleteDepartment } from "@/store/departmentsSlice";

function DeleteButton({ departmentId, departmentName, onDelete }) {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDeleteConfirm = async () => {
        setLoading(true);
        try {
            await apiFetch(
                `/api/departments/${departmentId}`,
                {
                    method: "DELETE",
                },
                dispatch
            );
            toast.success("Department deleted.", {
                description: `The department "${departmentName}" has been deleted successfully.`,
            });
            dispatch(deleteDepartment(departmentId));
            onDelete();
        } catch (error) {
            toast.error("Error:", {
                description: error.message || "An error occurred while deleting the department.",
            });
        } finally {
            setLoading(false);
            setShowDialog(false);
        }
    };

    return (
        <>
            <Button variant="destructive" onClick={() => setShowDialog(true)}>
                <Trash />
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the department "
                            <strong>{departmentName}</strong>"? <br />
                            <strong>This action cannot be undone.</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DeleteButton;
