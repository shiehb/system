import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface YearPickerProps {
  value: string;
  onChange: (year: string) => void;
  className?: string;
  error?: boolean;
}

export function YearPicker({
  value,
  onChange,
  className,
  error,
}: YearPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Update internal state when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (search: string) => {
    const numericValue = search.replace(/\D/g, "").slice(0, 4);
    setInputValue(numericValue);
    onChange(numericValue);
    return numericValue;
  };

  const isValidYear = (year: string) => {
    return (
      year.length === 4 && Number(year) >= 1900 && Number(year) <= currentYear
    );
  };

  // Show all years when input is focused (empty search)
  const filteredYears = inputValue
    ? years.filter((year) => year.includes(inputValue))
    : years;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            error && "border-destructive",
            className
          )}
          onClick={() => {
            setOpen(true);
            setInputValue(""); // Clear input when opened to show all years
          }}
        >
          {value || "Select year..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search year..."
            value={inputValue}
            onValueChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            onFocus={() => setInputValue("")} // Show all years on focus
          />
          <CommandEmpty>
            {inputValue.length === 4 && !isValidYear(inputValue)
              ? `Enter a year between 1900-${currentYear}`
              : "Type a 4-digit year"}
          </CommandEmpty>
          <CommandGroup className="max-h-[150px] overflow-y-auto">
            {filteredYears.map((year) => (
              <CommandItem
                key={year}
                value={year}
                onSelect={() => {
                  onChange(year);
                  setInputValue(year);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === year ? "opacity-100" : "opacity-0"
                  )}
                />
                {year}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
