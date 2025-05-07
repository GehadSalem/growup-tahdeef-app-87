
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  {
    month: "يناير",
    الإيرادات: 4000,
    الاشتراكات_الجديدة: 24,
    الاشتراكات_المجددة: 18,
  },
  {
    month: "فبراير",
    الإيرادات: 4500,
    الاشتراكات_الجديدة: 28,
    الاشتراكات_المجددة: 22,
  },
  {
    month: "مارس",
    الإيرادات: 6000,
    الاشتراكات_الجديدة: 35,
    الاشتراكات_المجددة: 26,
  },
  {
    month: "أبريل",
    الإيرادات: 7200,
    الاشتراكات_الجديدة: 42,
    الاشتراكات_المجددة: 30,
  },
  {
    month: "مايو",
    الإيرادات: 9500,
    الاشتراكات_الجديدة: 54,
    الاشتراكات_المجددة: 35,
  },
  {
    month: "يونيو",
    الإيرادات: 12000,
    الاشتراكات_الجديدة: 65,
    الاشتراكات_المجددة: 42,
  },
];

export function RevenueMetrics() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="الإيرادات" fill="#219653" name="الإيرادات (ج.م)" />
          <Bar yAxisId="right" dataKey="الاشتراكات_الجديدة" fill="#1A73E8" name="الاشتراكات الجديدة" />
          <Bar yAxisId="right" dataKey="الاشتراكات_المجددة" fill="#FFC107" name="الاشتراكات المجددة" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
