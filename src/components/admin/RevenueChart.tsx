
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface RevenueChartProps {
  dateRange?: { from: Date; to: Date };
}

const data = [
  {
    name: "يناير",
    monthly: 2400,
    yearly: 1800,
  },
  {
    name: "فبراير",
    monthly: 2100,
    yearly: 2200,
  },
  {
    name: "مارس",
    monthly: 2800,
    yearly: 3000,
  },
  {
    name: "أبريل",
    monthly: 3200,
    yearly: 3500,
  },
  {
    name: "مايو",
    monthly: 4200,
    yearly: 4300,
  },
  {
    name: "يونيو",
    monthly: 4800,
    yearly: 5200,
  },
];

export function RevenueChart({ dateRange }: RevenueChartProps) {
  return (
    <div className="h-[300px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="name"
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
          <Bar 
            dataKey="monthly" 
            name="إيرادات الاشتراك الشهري" 
            fill="#219653" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="yearly" 
            name="إيرادات الاشتراك السنوي" 
            fill="#2F80ED" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
