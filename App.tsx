
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
        <section className="relative mb-24">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-14 lg:p-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Value to Convert</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="block w-full px-7 py-5 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 transition-all text-3xl font-black text-slate-900 bg-slate-50/50 shadow-inner"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-4">
                  <CurrencySelector label="From" value={fromCurrency} onChange={setFromCurrency} />
                </div>
                <div className="md:col-span-1 flex justify-center pt-6">
                  <button onClick={handleSwap} className="p-5 rounded-full bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-xl active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
                <div className="md:col-span-4">
                  <CurrencySelector label="To" value={toCurrency} onChange={setToCurrency} />
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-slate-50">
                {loading ? (
                  <div className="h-20 bg-slate-100 rounded animate-pulse"></div>
                ) : error ? (
                  <div className="p-6 bg-rose-50 text-rose-600 rounded-3xl font-bold">{error}</div>
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
                    </div>
                    <button onClick={performConversion} className="px-10 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-xl transition-all active:scale-95 flex items-center gap-4">
                      SYNC RATES
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <CurrencyDashboard rates={dashboardRates} loading={dashboardLoading} />

        <section className="bg-white rounded-[3.5rem] shadow-xl border border-slate-50 p-8 md:p-16">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-10 mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Market Visualization</h2>
            <div className="flex bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
              <button onClick={() => setChartView('comparison')} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${chartView === 'comparison' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}>
                Comparison
              </button>
              <button onClick={() => setChartView('trend')} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${chartView === 'trend' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}>
                Trend
              </button>
            </div>
          </div>

          <div className="relative min-h-[480px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">Loading...</div>
            ) : chartView === 'comparison' ? (
              <ComparisonChart data={comparisonData} baseCurrency={fromCurrency} />
            ) : (
              <HistoryChart data={history} fromCurrency={fromCurrency} toCurrency={toCurrency} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
