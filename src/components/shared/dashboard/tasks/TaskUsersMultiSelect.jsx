import { useMemo, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function TaskUsersMultiSelect({
    employees = [],
    value = [],
    onChange,
    placeholder = "Assign employees",
}) {
    const [open, setOpen] = useState(false);

    const selectedEmployees = useMemo(() => {
        return employees.filter((employee) =>
            value.includes(employee.user_id)
        );
    }, [employees, value]);

    const toggleUser = (userId) => {
        const exists = value.includes(userId);

        const newValue = exists
            ? value.filter((id) => id !== userId)
            : [...value, userId];

        onChange(newValue);
    };

    const removeUser = (userId) => {
        onChange(value.filter((id) => id !== userId));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="min-h-10 h-auto w-[320px] justify-between"
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedEmployees.length > 0 ? (
                            selectedEmployees.map((employee) => (
                                <Badge
                                    key={employee.user_id}
                                    variant="secondary"
                                    className="gap-1"
                                >
                                    {employee.user_name}

                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeUser(employee.user_id);
                                        }}
                                        className="ml-1 rounded-sm hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </span>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </div>

                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] p-0">
                <Command>
                    <CommandInput placeholder="Search employee..." />

                    <CommandList>
                        <CommandEmpty>No employee found.</CommandEmpty>

                        <CommandGroup>
                            {employees.map((employee) => {
                                const isSelected = value.includes(employee.user_id);

                                return (
                                    <CommandItem
                                        key={employee.user_id}
                                        value={`${employee.user_name} ${employee.email}`}
                                        onSelect={() => toggleUser(employee.user_id)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span>{employee.user_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {employee.email}
                                            </span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}