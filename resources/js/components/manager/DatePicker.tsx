import { format, isValid, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value: string; // ISO date string or empty
    onChange: (iso: string) => void;
    placeholder?: string;
    error?: string;
    withTime?: boolean; // if true, also pick time
}

export default function DatePicker({
    value,
    onChange,
    placeholder = 'Pilih tanggal',
    error,
    withTime = false,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);

    // Parse the ISO string to a Date
    const selected: Date | undefined = value
        ? parse(
              value,
              withTime ? "yyyy-MM-dd'T'HH:mm" : 'yyyy-MM-dd',
              new Date(),
          )
        : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (!date) {
            onChange('');
            setOpen(false);
            return;
        }
        const formatted = withTime
            ? format(date, "yyyy-MM-dd'T'HH:mm")
            : format(date, 'yyyy-MM-dd');
        onChange(formatted);
        if (!withTime) setOpen(false);
    };

    const displayValue =
        selected && isValid(selected)
            ? format(
                  selected,
                  withTime ? 'd MMMM yyyy, HH:mm' : 'd MMMM yyyy',
                  { locale: id },
              )
            : null;

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            'flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors outline-none',
                            'focus:ring-2',
                            error
                                ? 'border-red-400'
                                : 'border-gray-200 hover:border-gray-300 focus:border-(--singgah-green-500) focus:ring-(--singgah-green-100)',
                            !displayValue && 'text-gray-400',
                        )}
                    >
                        <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="flex-1 truncate">
                            {displayValue ?? placeholder}
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        initialFocus
                        locale={id}
                    />
                    {/* Time input if withTime */}
                    {withTime && selected && isValid(selected) && (
                        <div className="border-t px-3 py-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-500">
                                Waktu (HH:MM)
                            </label>
                            <input
                                type="time"
                                defaultValue={format(selected, 'HH:mm')}
                                onChange={(e) => {
                                    const [h, m] = e.target.value
                                        .split(':')
                                        .map(Number);
                                    const newDate = new Date(selected);
                                    newDate.setHours(h, m);
                                    onChange(
                                        format(newDate, "yyyy-MM-dd'T'HH:mm"),
                                    );
                                }}
                                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-(--singgah-green-500) focus:outline-none"
                            />
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
