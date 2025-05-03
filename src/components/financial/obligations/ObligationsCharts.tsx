
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Obligation } from "./AddObligationDialog";

interface ObligationsChartsProps {
  obligations: Obligation[];
}

export function ObligationsCharts({ obligations }: ObligationsChartsProps) {
  // بيانات للرسم البياني حسب النوع
  const pieChartData = () => {
    const data: { [key: string]: number } = {};
    
    obligations.forEach(obligation => {
      if (data[obligation.type]) {
        data[obligation.type] += obligation.amount;
      } else {
        data[obligation.type] = obligation.amount;
      }
    });
    
    return Object.keys(data).map(type => ({
      name: type,
      value: data[type],
    }));
  };

  // ألوان الرسم البياني حسب النوع
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo">توزيع الالتزامات حسب النوع</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => `${name}: ${value} ريال`}
              >
                {pieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} ريال`} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo">أكثر الالتزامات استنزافاً للراتب</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={obligations
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map(item => ({ name: item.name, amount: item.amount }))
              }
              layout="vertical"
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(value) => `${value} ريال`} />
              <Bar dataKey="amount" fill="#8884d8" name="المبلغ" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
