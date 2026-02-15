
import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_CURRENCIES } from '../constants';

interface CurrencySelectorProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedCurrency = POPULAR_CURRENCIES.find(c => c.code === value) || POPULAR_CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = POPULAR_CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 focus:border-indigo-500 transition-all text-left bg-white shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-tight">{selectedCurrency.code}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">{selectedCurrency.name}</span>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-3 w-full min-w-[280px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-slate-50/50">
            <input
              autoFocus
              type="text"
              placeholder="Search major currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium shadow-sm"
            />
          </div>
          
          <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {filteredCurrencies.length > 0 ? filteredCurrencies.map((currency) => (
              <div
                key={currency.code}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all ${value === currency.code ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${value === currency.code ? 'text-indigo-600' : 'text-slate-700'}`}>{currency.code}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{currency.name}</span>
                  </div>
                </div>
                {value === currency.code && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 text-sm">No currencies found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
