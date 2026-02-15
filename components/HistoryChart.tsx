
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { HistoryData } from '../types';

interface HistoryChartProps {
  data: HistoryData[];
  fromCurrency: string;
  toCurrency: string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data, fromCurrency, toCurrency }) => {
  if (data.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
           </svg>
        </div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No history data found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 800 }}
            dy={15}
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString(undefined, { weekday: 'short' });
            }}
          />
          <YAxis 
            hide={true}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '24px', 
              border: 'none', 
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
              padding: '16px'
            }}
            labelStyle={{ fontWeight: 800, marginBottom: '4px', color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}
            itemStyle={{ fontWeight: 800, color: '#4f46e5' }}
            formatter={(value: number) => [
              new Intl.NumberFormat(undefined, { 
                maximumFractionDigits: 4 
              }).format(value), 
              `Rate:`
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="rate" 
            stroke="#6366f1" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRate)" 
            animationDuration={2000}
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
