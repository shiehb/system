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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_level: string;
}

interface PersonnelSelectorProps {
  selected: User | null;
  onSelect: (user: User | null) => void;
  userLevel?: string;
}

const mockUsers: User[] = [
  { id: 1, first_name: "John", last_name: "Doe", user_level: "inspector" },
  { id: 2, first_name: "Jane", last_name: "Smith", user_level: "inspector" },
  { id: 3, first_name: "Robert", last_name: "Johnson", user_level: "chief" },
];

export default function PersonnelSelector({
  selected,
  onSelect,
  userLevel,
}: PersonnelSelectorProps) {
  const [open, setOpen] = useState(false);

  const filteredUsers = userLevel
    ? mockUsers.filter((user) => user.user_level === userLevel)
    : mockUsers;

  const handleSelect = (user: User) => {
    if (selected?.id === user.id) {
      onSelect(null); // Deselect if same user is clicked
    } else {
      onSelect(user); // Select new user
    }
    setOpen(false); // Close dropdown after selection
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected
              ? `${selected.first_name} ${selected.last_name}`
              : "Select inspector..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search inspectors..." />
            <CommandList>
              <CommandEmpty>No inspectors found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect(user)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected?.id === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.user_level}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selected && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onSelect(null);
                      setOpen(false);
                    }}
                    className="text-red-600"
                  >
                    Clear selection
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
