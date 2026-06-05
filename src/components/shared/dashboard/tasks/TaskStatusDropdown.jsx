import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statuses = [
    { value: "todo", label: "ToDo", icon: CircleDashed },
    { value: "in-progress", label: "In Progress", icon: Loader2 },
    { value: "done", label: "Done", icon: CheckCircle2 },
];

export function TaskStatusDropdown({ value, onChange }) {
    const current = statuses.find((status) => status.value === value) || statuses[0];
    const Icon = current.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge variant="outline" className="cursor-pointer gap-1">
                    <Icon className="h-3 w-3" />
                    {current.label}
                </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                {statuses.map((status) => {
                    const StatusIcon = status.icon;

                    return (
                        <DropdownMenuItem
                            key={status.value}
                            onClick={() => onChange(status.value)}
                            className="gap-2"
                        >
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}