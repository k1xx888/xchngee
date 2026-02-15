
import { API_BASE_URL } from '../constants';
import { LatestRatesResponse, HistoricalRatesResponse, HistoryData } from '../types';

export const fetchLatestRates = async (base: string): Promise<LatestRatesResponse> => {
  const response = await fetch(`${API_BASE_URL}/latest?from=${base}`);
  if (!response.ok) throw new Error('Failed to fetch latest rates');
  return response.json();
};

export const fetchHistoricalTrends = async (
  from: string,
  to: string,
  days: number = 7
): Promise<HistoryData[]> => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const response = await fetch(
    `${API_BASE_URL}/${startDate}..${endDate}?from=${from}&to=${to}`
  );
  if (!response.ok) throw new Error('Failed to fetch historical data');

  const data: HistoricalRatesResponse = await response.json();
  
  return Object.entries(data.rates).map(([date, rates]) => ({
    date,
    rate: rates[to],
  }));
};
