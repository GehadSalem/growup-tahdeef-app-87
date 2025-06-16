import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Obligation } from "./AddObligationDialog";

interface ObligationsChartsProps {
  obligations: Obligation[];
}

export function ObligationsCharts({ obligations }: ObligationsChartsProps) {
  const pieChartData = obligations.reduce((acc, obligation) => {
    const amount = obligation.amount || 0;
    const existing = acc.find(item => item.name === obligation.type);
    
    if (existing) {
      existing.value += amount;
    } else {
      acc.push({ name: obligation.type, value: amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

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
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'المبلغ']} />
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
                .filter(o => o.amount > 0)
                .sort((a, b) => (b.amount || 0) - (a.amount || 0))
                .slice(0, 5)
                .map(item => ({ 
                  name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name, 
                  amount: item.amount || 0 
                }))
              }
              layout="vertical"
            >
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount" fill="#8884d8" name="المبلغ" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}