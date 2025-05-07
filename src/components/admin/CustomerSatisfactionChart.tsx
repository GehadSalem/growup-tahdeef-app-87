
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    month: "يناير",
    satisfaction: 85,
  },
  {
    month: "فبراير",
    satisfaction: 87,
  },
  {
    month: "مارس",
    satisfaction: 82,
  },
  {
    month: "أبريل",
    satisfaction: 86,
  },
  {
    month: "مايو",
    satisfaction: 90,
  },
  {
    month: "يونيو",
    satisfaction: 93,
  },
];

export function CustomerSatisfactionChart() {
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
            dataKey="month"
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
            domain={[70, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey="satisfaction"
            stroke="#219653"
            activeDot={{ r: 8 }}
            name="نسبة الرضا"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
