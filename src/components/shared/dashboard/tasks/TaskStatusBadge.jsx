import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

export function TaskStatusBadge({ status }) {
    switch (status?.toLowerCase()) {
        case "todo":
            return (
                <Badge variant="secondary">
                    <CircleDashed className="w-3 h-3 mr-1" />
                    ToDo
                </Badge>
            );

        case "inprogress":
        case "in-progress":
            return (
                <Badge className="bg-blue-500">
                    <Loader2 className="w-3 h-3 mr-1" />
                    In Progress
                </Badge>
            );

        case "done":
            return (
                <Badge className="bg-green-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    {status}
                </Badge>
            );
    }
}