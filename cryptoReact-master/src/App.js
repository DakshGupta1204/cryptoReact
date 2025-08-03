import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CardSection from './components/CardSection';
import ChartSection from './components/ChartSection';
import Header from './components/Header';

// Constants for better maintainability
const DEFAULT_COIN = "bitcoin";

// Custom hook for crypto data fetching
const useCryptoData = (coinId, refreshTrigger = 0) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!coinId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setLastUpdated(new Date());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching crypto data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch on mount or when coinId/refreshTrigger changes
    fetchData();
  }, [coinId, refreshTrigger]); 

  const refetch = useCallback(async () => {
    if (!coinId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching crypto data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  return { data, loading, error, refetch, lastUpdated };
};

const App = () => {
  const [selectedCoinId, setSelectedCoinId] = useState(DEFAULT_COIN);
  const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);
  const { data, loading, error, lastUpdated } = useCryptoData(selectedCoinId, manualRefreshTrigger);

  // Memoized data extraction to prevent unnecessary re-renders
  const coinData = useMemo(() => {
    const marketData = data.market_data || {};
    const communityData = data.community_data || {};
    
    return {
      name: data.name || '',
      currentPrice: marketData.current_price?.usd || 0,
      marketCapChange24h: marketData.market_cap_change_percentage_24h || 0,
      allTimeHigh: marketData.ath?.usd || 0,
      allTimeLow: marketData.atl?.usd || 0, // Fixed: was showing ATH for ATL
      sentiment: data.sentiment_votes_up_percentage || 0,
      high24h: marketData.high_24h?.usd || 0,
      low24h: marketData.low_24h?.usd || 0,
      priceChange24h: marketData.price_change_24h_in_currency?.usd || 0,
      marketCap: marketData.market_cap?.usd || 0,
      totalVolume: marketData.total_volume?.usd || 0,
      circulatingSupply: marketData.circulating_supply || 0,
      twitterFollowers: communityData.twitter_followers || 0
    };
  }, [data]);

  const handleCoinChange = useCallback((event) => {
    const newCoinId = event.target.value;
    // eslint-disable-next-line no-console
    console.log('Selected coin:', newCoinId);
    setSelectedCoinId(newCoinId);
  }, []);

  const handleManualRefresh = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Manual refresh triggered');
    setManualRefreshTrigger(prev => prev + 1);
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <h4>Error loading data</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header 
        onCoinChange={handleCoinChange} 
        loading={loading} 
        selectedCoin={selectedCoinId}
        onRefresh={handleManualRefresh}
        lastUpdated={lastUpdated}
      />
      <CardSection 
        coinName={coinData.name}
        currentPrice={coinData.currentPrice}
        mCap24={coinData.marketCapChange24h}
        ath={coinData.allTimeHigh}
        atl={coinData.allTimeLow}
        sentiment={coinData.sentiment}
        high24={coinData.high24h}
        low24={coinData.low24h}
        loading={loading}
      />
      <ChartSection 
        coinId={selectedCoinId}
        priceChange24={coinData.priceChange24h}
        marketCap={coinData.marketCap}
        totalVolume={coinData.totalVolume}
        circulatingSupply={coinData.circulatingSupply}
        twitterFollowers={coinData.twitterFollowers}
        loading={loading}
      />
    </div>
  );
};

export default App;
