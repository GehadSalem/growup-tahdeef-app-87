
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateDropdowns } from "@/components/ui/DateDropdowns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { arSA } from 'date-fns/locale';
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  className?: string;
  align?: "center" | "start" | "end";
}

export function DateRangePicker({
  date,
  setDate,
  className,
  align = "start",
}: DateRangePickerProps) {
  const [fromDate, setFromDate] = React.useState(
    date?.from ? format(date.from, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );
  const [toDate, setToDate] = React.useState(
    date?.to ? format(date.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );

  const handleDateChange = () => {
    setDate({
      from: new Date(fromDate),
      to: new Date(toDate),
    });
  };

  React.useEffect(() => {
    handleDateChange();
  }, [fromDate, toDate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: arSA })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: arSA })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: arSA })
              )
            ) : (
              <span>اختر المدى الزمني</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align={align}>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">من تاريخ:</Label>
              <DateDropdowns
                value={fromDate}
                onChange={setFromDate}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">إلى تاريخ:</Label>
              <DateDropdowns
                value={toDate}
                onChange={setToDate}
                className="mt-2"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
