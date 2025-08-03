import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Chart from "react-apexcharts";

// Constants
const TIME_RANGES = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '6M', days: 182 },
  { label: '1Y', days: 365 }
];

const CHART_COLORS = {
  price: "#fcdf03",
  marketCap: "#ff69f5", 
  volume: "#00ffea"
};

// Custom hook for chart data
const useChartData = (coinId, timeRange) => {
  const [chartData, setChartData] = useState({
    prices: [],
    market_caps: [],
    total_volumes: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId || !timeRange) return;

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeRange}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch on mount or when coinId/timeRange changes
    fetchChartData();
  }, [coinId, timeRange]); // Only depend on coinId and timeRange

  return { chartData, loading, error };
};

// Base chart options
const createChartOptions = (title, color, yAxisFormatter = (val) => val.toFixed(2)) => ({
  chart: {
    id: `chart-${title.toLowerCase().replace(/\s+/g, '-')}`,
    toolbar: { show: false },
    background: 'transparent'
  },
  grid: { show: false },
  title: {
    text: title,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      color
    }
  },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { 
    type: "datetime",
    labels: { show: false }
  },
  yaxis: { show: false },
  dataLabels: { enabled: false },
  colors: [color],
  tooltip: {
    theme: "dark",
    y: { formatter: yAxisFormatter }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1
    }
  }
});

// Time range button component
const TimeRangeButton = ({ range, isActive, onClick, disabled }) => (
  <button
    type="button"
    className={`btn btn-sm me-2 ${isActive ? 'btn-warning' : 'btn-outline-warning'}`}
    onClick={() => onClick(range.days)}
    disabled={disabled}
    aria-pressed={isActive}
  >
    {range.label}
  </button>
);

// Metric display component
const MetricDisplay = ({ title, value, loading }) => (
  <div className="card-body">
    <h6 className="card-title" style={{ fontFamily: 'NHaasGroteskDSPro-65Md' }}>
      {title}
    </h6>
    {loading ? (
      <div className="spinner-border spinner-border-sm text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    ) : (
      <p className="card-text fw-bold" 
         style={{ 
           fontFamily: 'NHaasGroteskDSPro-65Md', 
           color: 'rgb(255, 255, 255)', 
           fontSize: 'small' 
         }}>
        {value}
      </p>
    )}
  </div>
);

const ChartSection = ({ 
  coinId, 
  priceChange24, 
  marketCap, 
  totalVolume, 
  circulatingSupply, 
  twitterFollowers,
  loading: parentLoading = false 
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(365);
  const { chartData, loading: chartLoading } = useChartData(coinId, selectedTimeRange);

  // Memoized chart configurations
  const chartConfigs = useMemo(() => ({
    price: {
      options: createChartOptions("Market Price (USD)", CHART_COLORS.price),
      series: [{
        name: 'Market Price',
        data: chartData.prices || []
      }]
    },
    marketCap: {
      options: createChartOptions("Market Cap (USD)", CHART_COLORS.marketCap, (val) => `$${(val / 1e9).toFixed(2)}B`),
      series: [{
        name: 'Market Cap',
        data: chartData.market_caps || []
      }]
    },
    volume: {
      options: createChartOptions("Total Volume", CHART_COLORS.volume, (val) => `$${(val / 1e6).toFixed(2)}M`),
      series: [{
        name: 'Volume',
        data: chartData.total_volumes || []
      }]
    }
  }), [chartData]);

  const handleTimeRangeChange = useCallback((days) => {
    setSelectedTimeRange(days);
  }, []);

  // Format helper functions
  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const isLoading = parentLoading || chartLoading;

  return (
    <section className="container mt-4">
      <div className="row">
        {/* Main Chart Column */}
        <div className="col-lg-6">
          <div className="card bg-dark text-white">
            <div className="card-header">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {TIME_RANGES.map((range) => (
                  <TimeRangeButton
                    key={range.days}
                    range={range}
                    isActive={selectedTimeRange === range.days}
                    onClick={handleTimeRangeChange}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
            <div className="card-body p-2">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading chart...</span>
                  </div>
                </div>
              ) : (
                <Chart
                  options={chartConfigs.price.options}
                  series={chartConfigs.price.series}
                  type="area"
                  height={400}
                  width="100%"
                />
              )}
            </div>
          </div>
        </div>

        {/* Metrics Column */}
        <div className="col-lg-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <MetricDisplay 
                title="Market Cap"
                value={formatCurrency(marketCap)}
                loading={isLoading}
              />
              
              <MetricDisplay 
                title="Price Change 24hrs"
                value={formatCurrency(priceChange24)}
                loading={isLoading}
              />
              
              <MetricDisplay 
                title="Total Volume"
                value={formatCurrency(totalVolume)}
                loading={isLoading}
              />
              
              <MetricDisplay 
                title="Circulating Supply"
                value={formatNumber(circulatingSupply)}
                loading={isLoading}
              />
              
              <MetricDisplay 
                title="Twitter Followers"
                value={formatNumber(twitterFollowers)}
                loading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Secondary Charts Column */}
        <div className="col-lg-3">
          <div className="mb-3">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center bg-dark rounded" style={{ height: '200px' }}>
                <div className="spinner-border spinner-border-sm text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Chart
                options={chartConfigs.marketCap.options}
                series={chartConfigs.marketCap.series}
                type="line"
                height={200}
                width="100%"
              />
            )}
          </div>
          
          <div>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center bg-dark rounded" style={{ height: '200px' }}>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Chart
                options={chartConfigs.volume.options}
                series={chartConfigs.volume.series}
                type="line"
                height={200}
                width="100%"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartSection;