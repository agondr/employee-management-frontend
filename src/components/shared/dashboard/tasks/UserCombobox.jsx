import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function UserCombobox({ users = [], value, onChange }) {
    const [open, setOpen] = useState(false);

    const selectedUser = users.find((user) => user.user_id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-[260px] justify-between"
                >
                    {selectedUser ? selectedUser.user_name : "Assign user..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[260px] p-0">
                <Command>
                    <CommandInput placeholder="Search employee..." />

                    <CommandList>
                        <CommandEmpty>No employee found.</CommandEmpty>

                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    key={user.user_id}
                                    value={`${user.user_name} ${user.email}`}
                                    onSelect={() => {
                                        onChange(user.user_id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span>{user.user_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>

                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === user.user_id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}