import React from 'react';

// Helper function to format numbers
const formatNumber = (num, decimals = 2) => {
  if (!num || num === 0) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Helper function to format percentage
const formatPercentage = (num) => {
  if (!num || num === 0) return '0';
  return Number(num).toFixed(2);
};

// Individual metric card component
const MetricCard = ({ title, value, color = "#fcdf03", prefix = "", suffix = "", loading }) => (
  <div className="card text-white text-center m-3" 
       style={{ width: "11rem", backgroundColor: "rgb(43, 43, 43)" }}>
    <div className="card-body">
      <h6 className="card-title" style={{ fontFamily: 'NHaasGroteskDSPro-65Md' }}>
        {title}
      </h6>
      {loading ? (
        <div className="spinner-border spinner-border-sm" style={{ color }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <p className="card-text fw-bold fs-5" style={{ color }}>
          {prefix}{value}{suffix}
        </p>
      )}
    </div>
  </div>
);

// Loading skeleton for current price
const PriceLoadingSkeleton = () => (
  <div className="text-center">
    <div className="placeholder-glow">
      <div className="placeholder col-6 mx-auto" style={{ 
        height: '90px', 
        backgroundColor: 'rgba(252, 223, 3, 0.3)' 
      }}></div>
    </div>
  </div>
);

const CardSection = ({ 
  coinName, 
  currentPrice, 
  mCap24, 
  ath, 
  atl, 
  sentiment, 
  high24, 
  low24, 
  loading = false 
}) => {
  return (
    <main>
      {/* Coin Name */}
      <div className="fs-1 fw-bold m-3 text-capitalize"
           style={{ 
             fontFamily: 'NHaasGroteskDSPro-65Md', 
             marginTop: '3px !important', 
             marginBottom: '0px !important' 
           }}>
        {loading ? (
          <div className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </div>
        ) : (
          coinName || 'Select a cryptocurrency'
        )}
      </div>

      {/* Metrics Cards */}
      <section className="row m-3 mb-0" style={{ marginTop: '2px !important' }}>
        <MetricCard 
          title="Market Cap 24Hrs"
          value={formatPercentage(mCap24)}
          suffix=" %"
          loading={loading}
        />
        
        <MetricCard 
          title="All Time High"
          value={formatNumber(ath)}
          prefix="$"
          loading={loading}
        />
        
        <MetricCard 
          title="All Time Low"
          value={formatNumber(atl)}
          prefix="$"
          loading={loading}
        />

        <MetricCard 
          title="Positive Sentiment"
          value={formatPercentage(sentiment)}
          suffix=" %"
          loading={loading}
        />
        
        <MetricCard 
          title="High 24Hrs"
          value={formatNumber(high24)}
          prefix="$"
          color="rgb(51, 255, 0)"
          loading={loading}
        />
        
        <MetricCard 
          title="Low 24Hrs"
          value={formatNumber(low24)}
          prefix="$"
          color="rgb(255, 32, 32)"
          loading={loading}
        />
      </section>

      {/* Current Price Display */}
      <div className="mt-4 mb-5">
        <div className="text-white text-center"
             style={{ 
               fontFamily: 'NHaasGroteskDSPro-65Md', 
               overflow: 'visible', 
               height: '2px', 
               marginTop: "1%" 
             }}>
          Current Price
        </div>
        
        {loading ? (
          <PriceLoadingSkeleton />
        ) : (
          <div style={{
            fontFamily: 'NHaasGroteskDSPro-65Md', 
            fontSize: 'clamp(3rem, 8vw, 90px)', // Responsive font size
            fontWeight: '700', 
            color: "#fcdf03", 
            textAlign: 'center',
            lineHeight: '1',
            marginBottom: '2rem', // Added margin bottom
            marginTop: '1rem'
          }}>
            ${formatNumber(currentPrice)}
          </div>
        )}
      </div>
    </main>
  );
};

export default CardSection;