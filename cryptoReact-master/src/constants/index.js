// API Configuration
export const API_BASE_URL = 'https://api.coingecko.com/api/v3';
export const REFRESH_INTERVAL = 2000; // 2 seconds for main data
export const CHART_REFRESH_INTERVAL = 30000; // 30 seconds for chart data

// Default Values
export const DEFAULT_COIN = 'bitcoin';

// Chart Configuration
export const CHART_COLORS = {
  price: '#fcdf03',
  marketCap: '#ff69f5', 
  volume: '#00ffea',
  positive: 'rgb(51, 255, 0)',
  negative: 'rgb(255, 32, 32)'
};

// Time Range Options
export const TIME_RANGES = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '6M', days: 182 },
  { label: '1Y', days: 365 }
];

// Cryptocurrency Options
export const CRYPTO_OPTIONS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'decentraland', name: 'Decentraland', symbol: 'MANA' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' }
];

// Responsive Breakpoints
export const BREAKPOINTS = {
  xs: '480px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1400px'
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch cryptocurrency data. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_RESPONSE: 'Invalid response from server.',
  COIN_NOT_FOUND: 'Cryptocurrency not found.'
};
