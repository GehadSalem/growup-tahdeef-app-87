
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface UserRegistrationChartProps {
  dateRange?: { from: Date; to: Date };
}

const data = [
  {
    date: "1 مايو",
    registrations: 12,
  },
  {
    date: "2 مايو",
    registrations: 18,
  },
  {
    date: "3 مايو",
    registrations: 15,
  },
  {
    date: "4 مايو",
    registrations: 10,
  },
  {
    date: "5 مايو",
    registrations: 25,
  },
  {
    date: "6 مايو",
    registrations: 22,
  },
  {
    date: "7 مايو",
    registrations: 30,
  },
  {
    date: "8 مايو",
    registrations: 35,
  },
  {
    date: "9 مايو",
    registrations: 28,
  },
  {
    date: "10 مايو",
    registrations: 32,
  },
  {
    date: "11 مايو",
    registrations: 40,
  },
  {
    date: "12 مايو",
    registrations: 45,
  },
  {
    date: "13 مايو",
    registrations: 38,
  },
  {
    date: "14 مايو",
    registrations: 42,
  },
];

export function UserRegistrationChart({ dateRange }: UserRegistrationChartProps) {
  return (
    <div className="h-[300px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#219653"
            strokeWidth={2}
            dot={{ fill: "#219653" }}
            activeDot={{ r: 8 }}
            name="التسجيلات"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
