
import React, { useState, useEffect, useCallback } from 'react';
import { POPULAR_CURRENCIES, DASHBOARD_PAIRS, COMPARISON_TARGETS } from './constants';
import { HistoryData } from './types';
import { fetchLatestRates, fetchHistoricalTrends } from './services/currencyApi';
import HistoryChart from './components/HistoryChart';
import CurrencyDashboard from './components/CurrencyDashboard';
import ComparisonChart from './components/ComparisonChart';
import CurrencySelector from './components/CurrencySelector';

const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('IDR');
  const [rate, setRate] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'comparison' | 'trend'>('comparison');
  const [dashboardRates, setDashboardRates] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const [usdBase, eurBase, gbpBase] = await Promise.all([
        fetchLatestRates('USD'),
        fetchLatestRates('EUR'),
        fetchLatestRates('GBP')
      ]);

      const results = DASHBOARD_PAIRS.map(pair => {
        let r = 0;
        if (pair.from === 'USD') r = usdBase.rates[pair.to];
        else if (pair.from === 'EUR') r = eurBase.rates[pair.to];
        else if (pair.from === 'GBP') r = gbpBase.rates[pair.to];
        return { ...pair, rate: r || 0 };
      });
      
      setDashboardRates(results);
    } catch (e) {
      console.error("Dashboard fetch failed", e);
    } finally {
      setDashboardLoading(false);
    }
  };

  const performConversion = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ratesData = await fetchLatestRates(fromCurrency);
      const currentRate = ratesData.rates[toCurrency];
      
      if (currentRate) {
        setRate(currentRate);
      } else if (fromCurrency === toCurrency) {
        setRate(1);
      } else {
        throw new Error("Currency rate not found");
      }

      const compData = COMPARISON_TARGETS
        .filter(code => code !== fromCurrency)
        .map(code => ({
          code,
          rate: ratesData.rates[code] || 0
        }))
        .filter(item => item.rate > 0);
      setComparisonData(compData);

      const trendData = await fetchHistoricalTrends(fromCurrency, toCurrency);
      setHistory(trendData);

    } catch (err: any) {
      setError(err.message || "Failed to sync market data.");
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchDashboardData();
    performConversion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      performConversion();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const getFlag = (code: string) => POPULAR_CURRENCIES.find(c => c.code === code)?.flag || '🏳️';

  const result = rate ? amount * rate : 0;

  return (
    <div className="min-h-screen pb-20">
      
      {/* Header Section */}
      <header className="pt-12 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
             </svg>
          </div>
          <span className="text-slate-900 text-lg font-black tracking-tight">Exchange Pro</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Currency <span className="text-indigo-600">Intelligence.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
          Monitor global markets with real-time conversion and professional visual analytics.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* 1. Converter Section */}
        <section className="relative mb-24">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-14 lg:p-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Amount Input */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Value to Convert</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="block w-full px-7 py-5 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 transition-all text-3xl font-black text-slate-900 bg-slate-50/50 shadow-inner group-hover:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* From Selector */}
                <div className="md:col-span-4">
                  <CurrencySelector 
                    label="From" 
                    value={fromCurrency} 
                    onChange={setFromCurrency} 
                  />
                </div>

                {/* Swap Control */}
                <div className="md:col-span-1 flex justify-center pt-6">
                  <button
                    onClick={handleSwap}
                    className="p-5 rounded-full bg-slate-900 text-white hover:bg-indigo-600 hover:rotate-180 transition-all duration-500 shadow-xl active:scale-90"
                    aria-label="Swap currencies"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Selector */}
                <div className="md:col-span-4">
                  <CurrencySelector 
                    label="To" 
                    value={toCurrency} 
                    onChange={setToCurrency} 
                  />
                </div>
              </div>

              {/* Enhanced Conversion Display with Flags */}
              <div className="mt-16 pt-12 border-t border-slate-50">
                {loading ? (
                  <div className="flex flex-col gap-6 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-48"></div>
                    <div className="h-20 bg-slate-100 rounded w-full"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 font-bold flex items-center gap-4">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {error}
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">
                        <span>{amount.toLocaleString()}</span>
                        <span className="text-xl">{getFlag(fromCurrency)}</span>
                        <span>{fromCurrency} equals</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-3xl md:text-4xl">{getFlag(toCurrency)}</span>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none break-all">
                          {formatCurrency(result, toCurrency)}
                        </h2>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-indigo-100">
                          1 {fromCurrency} = {rate?.toFixed(6)} {toCurrency}
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Market Active
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={performConversion}
                      className="group px-10 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-4 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      SYNC RATES
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Popular Pairs (Market Summary) */}
        <CurrencyDashboard rates={dashboardRates} loading={dashboardLoading} />

        {/* 3. Analytics Section */}
        <section className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-50 p-8 md:p-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[11px] font-black uppercase tracking-widest mb-5 border border-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Advanced Analytics
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Market Visualization</h2>
              <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest">{fromCurrency} Performance Index</p>
            </div>
            
            <div className="flex bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100 self-start sm:self-center shadow-inner">
              <button 
                onClick={() => setChartView('comparison')}
                className={`px-8 py-3 rounded-2xl text-xs font-black transition-all duration-300 ${chartView === 'comparison' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Comparison
              </button>
              <button 
                onClick={() => setChartView('trend')}
                className={`px-8 py-3 rounded-2xl text-xs font-black transition-all duration-300 ${chartView === 'trend' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Historical Trend
              </button>
            </div>
          </div>

          <div className="relative min-h-[480px]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white/80 backdrop-blur-md z-10 rounded-[3rem]">
                <div className="animate-spin h-14 w-14 border-[6px] border-indigo-600 border-t-transparent rounded-full shadow-lg shadow-indigo-100"></div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregating Data</span>
              </div>
            ) : chartView === 'comparison' ? (
              <ComparisonChart data={comparisonData} baseCurrency={fromCurrency} />
            ) : (
              <HistoryChart data={history} fromCurrency={fromCurrency} toCurrency={toCurrency} />
            )}
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-[2rem] bg-indigo-50/40 border border-indigo-50 group hover:bg-indigo-600 transition-all duration-500">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3 group-hover:text-indigo-200 transition-colors">Risk Index</span>
              <div className="text-2xl font-black text-slate-800 group-hover:text-white transition-colors">Low Volatility</div>
            </div>
            <div className="p-7 rounded-[2rem] bg-emerald-50/40 border border-emerald-50 group hover:bg-emerald-600 transition-all duration-500">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-3 group-hover:text-emerald-200 transition-colors">Market Bias</span>
              <div className="text-2xl font-black text-slate-800 group-hover:text-white transition-colors">Bullish Momentum</div>
            </div>
            <div className="p-7 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-slate-900 transition-all duration-500">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 group-hover:text-slate-400 transition-colors">Spread Range</span>
              <div className="text-2xl font-black text-slate-800 group-hover:text-white transition-colors">Optimal Entry</div>
            </div>
          </div>
        </section>

      </div>

      {/* Simplified Modern Footer */}
      <footer className="mt-24 text-center px-6">
         <div className="max-w-6xl mx-auto pt-12 border-t border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © 2025 Exchange Pro Intelligence. Built for high-frequency financial monitoring.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;
