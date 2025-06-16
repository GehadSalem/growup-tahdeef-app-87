
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import type { Obligation } from "@/lib/types";

interface AddObligationDialogProps {
  onAddObligation: (obligation: Obligation) => void;
}

interface ObligationsChartsProps {
  obligations: Obligation[];
}

export function ObligationsCharts({ obligations }: ObligationsChartsProps) {
  // Helper function to safely convert to number
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  // بيانات للرسم البياني حسب النوع
  const pieChartData = () => {
    const data: { [key: string]: number } = {};
    
    obligations.forEach(obligation => {
      const amount = safeNumber(obligation.amount);
      if (amount > 0) {
        if (data[obligation.type]) {
          data[obligation.type] += amount;
        } else {
          data[obligation.type] = amount;
        }
      }
    });
    
    return Object.keys(data)
      .map(type => ({
        name: type,
        value: data[type],
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  // بيانات الرسم البياني الشريطي
  const barChartData = () => {
    return obligations
      .map(item => ({ 
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name, 
        amount: safeNumber(item.amount),
        fullName: item.name
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  // ألوان الرسم البياني حسب النوع
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

  const pieData = pieChartData();
  const barData = barChartData();

  console.log("ObligationsCharts Debug:", {
    obligationsCount: obligations.length,
    pieDataCount: pieData.length,
    barDataCount: barData.length,
    pieData,
    barData
  });

  // التأكد من وجود بيانات صالحة للعرض
  if (pieData.length === 0 && barData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo">توزيع الالتزامات حسب النوع</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 font-cairo">لا توجد بيانات كافية للعرض</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo">أكثر الالتزامات استنزافاً للراتب</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 font-cairo">لا توجد بيانات كافية للعرض</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo">توزيع الالتزامات حسب النوع</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value.toLocaleString('ar-SA')} ريال`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString('ar-SA')} ريال`, 'المبلغ']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 font-cairo h-[250px] flex items-center justify-center">
              لا توجد بيانات كافية للعرض
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo">أكثر الالتزامات استنزافاً للراتب</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={120}
                />
                <Tooltip 
                  formatter={(value: number, name, props) => [
                    `${value.toLocaleString('ar-SA')} ريال`, 
                    'المبلغ'
                  ]}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="amount" fill="#8884d8" name="المبلغ" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 font-cairo h-[250px] flex items-center justify-center">
              لا توجد بيانات كافية للعرض
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
