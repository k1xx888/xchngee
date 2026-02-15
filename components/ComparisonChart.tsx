
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ComparisonChartProps {
  data: { code: string; rate: number }[];
  baseCurrency: string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, baseCurrency }) => {
  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="code" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 800 }}
            dy={15}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#cbd5e1' }}
            tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(1)}k` : value}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9', radius: 12 }}
            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
            itemStyle={{ fontWeight: 800, fontSize: '14px' }}
            labelStyle={{ fontWeight: 800, marginBottom: '4px', color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}
            formatter={(value: number) => [value.toLocaleString(undefined, { maximumFractionDigits: 4 }), `1 ${baseCurrency} =`]}
          />
          <Bar dataKey="rate" radius={[12, 12, 4, 4]} barSize={44}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
