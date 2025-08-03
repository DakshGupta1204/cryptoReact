import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock ApexCharts to avoid rendering issues in tests
jest.mock('react-apexcharts', () => {
  return function MockChart() {
    return <div data-testid="mock-chart">Chart Component</div>;
  };
});

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders crypto dashboard title', () => {
    render(<App />);
    const titleElement = screen.getByText(/crypto dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders loading state initially', () => {
    render(<App />);
    const loadingElements = screen.getAllByText(/loading/i);
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  test('renders cryptocurrency selector', () => {
    render(<App />);
    const selector = screen.getByLabelText(/select cryptocurrency/i);
    expect(selector).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  test('allows user to change cryptocurrency', async () => {
    const mockData = {
      name: 'Ethereum',
      market_data: {
        current_price: { usd: 2000 },
        market_cap_change_percentage_24h: 5.5,
        ath: { usd: 4800 },
        atl: { usd: 0.42 },
        high_24h: { usd: 2100 },
        low_24h: { usd: 1900 }
      },
      sentiment_votes_up_percentage: 75,
      community_data: {
        twitter_followers: 100000
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const user = userEvent.setup();
    render(<App />);

    const selector = screen.getByLabelText(/select cryptocurrency/i);
    await user.selectOptions(selector, 'ethereum');

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('ethereum')
      );
    });
  });

  test('displays current price when data is loaded', async () => {
    const mockData = {
      name: 'Bitcoin',
      market_data: {
        current_price: { usd: 50000 },
        market_cap_change_percentage_24h: 2.5,
        ath: { usd: 69000 },
        atl: { usd: 1 },
        high_24h: { usd: 51000 },
        low_24h: { usd: 49000 }
      },
      sentiment_votes_up_percentage: 80,
      community_data: {
        twitter_followers: 50000
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/\$50,000\.00/)).toBeInTheDocument();
    });
  });
});
