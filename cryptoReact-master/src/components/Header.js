import React from 'react';

// Constants for cryptocurrency options
const CRYPTO_OPTIONS = [
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

const Header = ({ onCoinChange, loading = false, selectedCoin = 'bitcoin', onRefresh, lastUpdated }) => {
  const formatLastUpdated = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#fcdf03" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <label htmlFor="coinSelect" className="visually-hidden">
              Select Cryptocurrency
            </label>
            <select 
              id="coinSelect"
              className="form-select form-select-lg me-3" 
              aria-label="Select cryptocurrency"
              name="selectCoin"
              style={{ width: "fit-content", minWidth: "200px" }} 
              onChange={onCoinChange}
              disabled={loading}
              value={selectedCoin}
            >
              {CRYPTO_OPTIONS.map(({ id, name, symbol }) => (
                <option key={id} value={id}>
                  {name} ({symbol})
                </option>
              ))}
            </select>
            
            <button
              type="button"
              className="btn btn-dark me-3"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh data"
              aria-label="Refresh cryptocurrency data"
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                </svg>
              )}
              <span className="ms-2">Refresh</span>
            </button>

            {lastUpdated && (
              <small className="text-dark me-3">
                Last updated: {formatLastUpdated(lastUpdated)}
              </small>
            )}
            
            {loading && (
              <div className="spinner-border spinner-border-sm text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>

          <h1 
            className="navbar-brand d-flex ms-auto mb-0 display-2 text-dark fs-2 fw-bold text-uppercase"
            style={{ fontFamily: 'NHaasGroteskDSPro-65Md' }}
          >
            Crypto Dashboard
          </h1>
        </div>
      </nav>
    </header>
  );
};

export default Header;