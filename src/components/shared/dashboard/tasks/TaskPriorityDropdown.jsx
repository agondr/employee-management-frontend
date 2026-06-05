import { MoveDownRight, MoveRight, MoveUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const priorities = [
    { value: "High", label: "High", icon: MoveUpRight },
    { value: "Medium", label: "Medium", icon: MoveRight },
    { value: "Low", label: "Low", icon: MoveDownRight },
];

export function TaskPriorityDropdown({ value, onChange }) {
    const current =
        priorities.find((priority) => priority.value === value) || priorities[0];

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
                {priorities.map((priority) => {
                    const PriorityIcon = priority.icon;

                    return (
                        <DropdownMenuItem
                            key={priority.value}
                            onClick={() => onChange(priority.value)}
                            className="gap-2"
                        >
                            <PriorityIcon className="h-4 w-4" />
                            {priority.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}