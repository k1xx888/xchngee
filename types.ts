
export interface CurrencyInfo {
  code: string;
  name: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface HistoryData {
  date: string;
  rate: number;
}

export interface LatestRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: ExchangeRates;
}

export interface HistoricalRatesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [currency: string]: number;
    };
  };
}
