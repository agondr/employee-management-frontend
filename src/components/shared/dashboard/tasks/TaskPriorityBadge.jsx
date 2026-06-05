import { Badge } from "@/components/ui/badge";
import {
    MoveDownRight,
    MoveRight,
    MoveUpRight,
} from "lucide-react";

export function TaskPriorityBadge({ priority }) {
    switch (priority?.toLowerCase()) {
        case "low":
            return (
                <Badge className="bg-green-600">
                    <MoveDownRight className="w-3 h-3 mr-1" />
                    Low
                </Badge>
            );

        case "medium":
            return (
                <Badge className="bg-orange-500">
                    <MoveRight className="w-3 h-3 mr-1" />
                    Medium
                </Badge>
            );

        case "high":
            return (
                <Badge className="bg-red-600">
                    <MoveUpRight className="w-3 h-3 mr-1" />
                    High
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    {priority}
                </Badge>
            );
    }
}