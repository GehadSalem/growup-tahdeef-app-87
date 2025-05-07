
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "إيجابي", value: 65 },
  { name: "محايد", value: 20 },
  { name: "سلبي", value: 15 },
];

const COLORS = ["#219653", "#2F80ED", "#F2994A"];

export function FeedbackAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-2">أكثر الملاحظات تكراراً</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>واجهة المستخدم بسيطة وسهلة</span>
              <span className="text-green-500">+24</span>
            </li>
            <li className="flex justify-between">
              <span>ميزة التقارير مفيدة جداً</span>
              <span className="text-green-500">+18</span>
            </li>
            <li className="flex justify-between">
              <span>أريد خيارات تخصيص أكثر</span>
              <span className="text-yellow-500">+12</span>
            </li>
            <li className="flex justify-between">
              <span>الإشعارات تأتي متأخرة</span>
              <span className="text-red-500">+8</span>
            </li>
          </ul>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-2">اقتراحات التحسين</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>إضافة مخططات بيانية للتقارير</li>
            <li>تحسين سرعة التطبيق</li>
            <li>أوضاع ألوان إضافية</li>
            <li>دعم اللغة الإنجليزية</li>
          </ul>
        </div>
      </div>
      <div className="h-[300px] md:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
