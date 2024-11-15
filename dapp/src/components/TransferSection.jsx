// src/components/TransferSection.jsx
import React, { useState } from 'react';
import { transferTokens } from '../context/TokenService';

const TransferSection = ({ setBalance }) => {
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const handleTransfer = async () => {
    if (transferAddress && transferAmount) {
      await transferTokens(transferAddress, transferAmount);
      setBalance();  // Refresh the balance after transfer
    }
  };

  return (
    <div className="transfer-section">
      <h2>Transfer Tokens</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Recipient Address"
          value={transferAddress}
          onChange={(e) => setTransferAddress(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="input-field"
        />
      </div>
      <button className="send-btn" onClick={handleTransfer}>Send Tokens</button>
    </div>
  );
};

export default TransferSection;