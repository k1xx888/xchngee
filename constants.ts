
import { CurrencyInfo } from './types';

export interface ExtendedCurrencyInfo extends CurrencyInfo {
  flag: string;
}

export const POPULAR_CURRENCIES: ExtendedCurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
];

export const DASHBOARD_PAIRS = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'JPY' },
  { from: 'USD', to: 'IDR' },
  { from: 'EUR', to: 'USD' },
  { from: 'GBP', to: 'USD' },
  { from: 'USD', to: 'CAD' },
  { from: 'USD', to: 'AUD' },
  { from: 'USD', to: 'CHF' },
  { from: 'USD', to: 'INR' },
  { from: 'EUR', to: 'GBP' },
  { from: 'USD', to: 'SGD' },
];

export const COMPARISON_TARGETS = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'IDR', 'INR', 'KRW', 'MXN'];

export const API_BASE_URL = 'https://api.frankfurter.app';
