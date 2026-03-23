"use client";

import React from "react";
import { Control, Controller } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface ICustomSelect {
  name: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  valueKey: string; // key untuk id (misal: "idUnit", "idCategory")
  labelKey: string; // key untuk label (misal: "nameUnit", "nameCategory")
  placeholder?: string;
  disabled?: boolean;
}

const ValueSelect = ({
  label,
  value,
  onChange,
  data,
  valueKey,
  labelKey,
  placeholder = "Pilih...",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  valueKey: string;
  labelKey: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedItem = data.find((item) => item[valueKey] === value);

  return (
    <Popover open={disabled ? false : open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full font-normal text-left",
            disabled &&
              "bg-muted text-muted-foreground opacity-70 cursor-not-allowed",
          )}
        >
          {selectedItem ? selectedItem[labelKey] : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Cari ${label}`} />
          <CommandEmpty>Tidak ada hasil yang ditemukan.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item[valueKey]}
                  value={item[labelKey]}
                  onSelect={() => {
                    onChange(item[valueKey]);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item[valueKey] ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item[labelKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function CustomSelect({
  name,
  label,
  control,
  required = false,
  data,
  valueKey,
  labelKey,
  placeholder,
  disabled = false,
}: Readonly<ICustomSelect>) {
  return (
    <div className="space-y-2">
      {label !== "" && (
        <Label htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <ValueSelect
              label={label.toLocaleLowerCase()}
              value={field.value}
              onChange={field.onChange}
              data={data}
              valueKey={valueKey}
              labelKey={labelKey}
              placeholder={placeholder}
              disabled={disabled}
            />
            {error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}
