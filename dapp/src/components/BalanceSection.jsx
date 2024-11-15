// src/components/BalanceSection.jsx
import React from 'react';

const BalanceSection = ({ balance, updateBalance }) => {
  return (
    <div className="balance-section">
      <p className="balance-text">Your Token Balance: <strong>{balance}</strong></p>
      <button className="refresh-btn" onClick={updateBalance}>Refresh Balance</button>
    </div>
  );
};

export default BalanceSection;