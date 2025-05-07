
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface OverviewProps {
  dateRange?: { from: Date; to: Date };
}

const data = [
  {
    date: "Jan",
    revenue: 4000,
    subscriptions: 240,
  },
  {
    date: "Feb",
    revenue: 4200,
    subscriptions: 260,
  },
  {
    date: "Mar",
    revenue: 5800,
    subscriptions: 330,
  },
  {
    date: "Apr",
    revenue: 7200,
    subscriptions: 440,
  },
  {
    date: "May",
    revenue: 8200,
    subscriptions: 490,
  },
  {
    date: "Jun",
    revenue: 9600,
    subscriptions: 560,
  },
  {
    date: "Jul",
    revenue: 11200,
    subscriptions: 620,
  },
  {
    date: "Aug",
    revenue: 13500,
    subscriptions: 740,
  },
];

export function Overview({ dateRange }: OverviewProps) {
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
            dataKey="revenue"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="الإيرادات"
          />
          <Line 
            type="monotone" 
            dataKey="subscriptions" 
            stroke="#219653" 
            name="الاشتراكات"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
