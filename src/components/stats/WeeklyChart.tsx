
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface DayData {
  name: string;
  value: number;
  label?: string;
  index?: number; // Add index to the interface
}

interface WeeklyChartProps {
  data: DayData[];
  className?: string;
  barColor?: string;
}

export function WeeklyChart({ data, className, barColor = "#219653" }: WeeklyChartProps) {
  // Add index to each data point
  const dataWithIndex = data.map((item, index) => ({
    ...item,
    index // Add index property
  }));
console.log("WeeklyChart data:", data);

  return (
    <div className={cn("w-full h-40", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataWithIndex}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis 
  dataKey="name" 
  axisLine={false}
  tickLine={false}
  interval={0} // <<< دي مهمة عشان يطبع كل الأيام
  tick={{ fontSize: 12, fill: '#828282', fontFamily: 'Cairo Variable' }}
/>

          <Tooltip
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px',
              fontFamily: 'Cairo Variable',
              textAlign: 'right',
              direction: 'rtl'
            }}
            formatter={(value, name, props) => {
              if (props && props.payload) {
                // Safely access label
                const label = props.payload.label || 'إنجاز';
                return [`${value}%`, label];
              }
              return [`${value}%`, 'إنجاز'];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar 
            dataKey="value" 
            fill={barColor}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
