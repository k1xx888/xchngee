
import React from 'react';
import { POPULAR_CURRENCIES } from '../constants';

interface DashboardRate {
  from: string;
  to: string;
  rate: number;
}

interface CurrencyDashboardProps {
  rates: DashboardRate[];
  loading: boolean;
}

const CurrencyDashboard: React.FC<CurrencyDashboardProps> = ({ rates, loading }) => {
  const getFlag = (code: string) => POPULAR_CURRENCIES.find(c => c.code === code)?.flag || '🏳️';

  if (loading) {
    return (
      <section className="mb-16">
        <div className="h-6 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Market Overview</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time performance of global currency pairs</p>
        </div>
        <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
           Live Market
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {rates.map((item, idx) => {
          const isUp = idx % 2 === 0;
          return (
            <div key={`${item.from}-${item.to}`} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="text-xl drop-shadow-sm z-10">{getFlag(item.from)}</span>
                    <span className="text-xl drop-shadow-sm">{getFlag(item.to)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.from} / {item.to}</span>
                    <span className="text-xs font-bold text-slate-700">FX Spot</span>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg ${isUp ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isUp ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                   </svg>
                </div>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">
                  {item.rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                </span>
                <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isUp ? '+0.12%' : '-0.08%'}
                </span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-medium flex justify-between">
                <span>1 {item.from} = {item.rate.toFixed(4)} {item.to}</span>
                <span className="group-hover:text-indigo-500 transition-colors">Trade →</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CurrencyDashboard;
