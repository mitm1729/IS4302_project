import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletContext } from '../../context/WalletContext';
import './Wallet.css';  // We'll create this CSS file next

// Token contract configuration
const tokenAddress = "0x8649fc3eF8b80097f24c4047eeeCBC0F9BFca3bD"; // Replace with your token's contract address 
const tokenABI = [
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];

const Wallet = () => {
  const { 
    user, 
    account, 
    connectWallet, 
    disconnectWallet, 
    isLoading 
  } = useWalletContext();

  const [balance, setBalance] = useState("0");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isTransacting, setIsTransacting] = useState(false);

  // Initialize provider and contract
  const getProvider = () => {
    if (window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error("No ethereum provider found");
  };

  const getContract = async (withSigner = false) => {
    const provider = getProvider();
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(tokenAddress, tokenABI, signer);
    }
    return new ethers.Contract(tokenAddress, tokenABI, provider);
  };

  // Function to get balance
  const updateBalance = async () => {
    if (account) {
      try {
        const contract = await getContract();
        const bal = await contract.balanceOf(account);
        setBalance(ethers.formatUnits(bal, 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setTransactionStatus({
          type: "error",
          message: "Failed to fetch balance"
        });
      }
    }
  };

  // Function to handle top-up
  const handleTopUp = async () => {
    setIsTransacting(true);
    setTransactionStatus(null);
    
    try {
      const contract = await getContract(true);
      const tx = await contract.transfer(account, ethers.parseUnits(topUpAmount, 18));
      
      setTransactionStatus({
        type: "info",
        message: "Transaction pending..."
      });
      
      await tx.wait();
      
      setTransactionStatus({
        type: "success",
        message: "Top up successful!"
      });
      
      setTopUpAmount("");
      updateBalance();
    } catch (error) {
      console.error("Top up error:", error);
      setTransactionStatus({
        type: "error",
        message: "Top up failed. Please try again."
      });
    } finally {
      setIsTransacting(false);
    }
  };

  // Function to handle withdrawal
  const handleWithdraw = async () => {
    setIsTransacting(true);
    setTransactionStatus(null);
    
    try {
      const contract = await getContract(true);
      const tx = await contract.transfer(tokenAddress, ethers.parseUnits(withdrawAmount, 18));
      
      setTransactionStatus({
        type: "info",
        message: "Transaction pending..."
      });
      
      await tx.wait();
      
      setTransactionStatus({
        type: "success",
        message: "Withdrawal successful!"
      });
      
      setWithdrawAmount("");
      updateBalance();
    } catch (error) {
      console.error("Withdrawal error:", error);
      setTransactionStatus({
        type: "error",
        message: "Withdrawal failed. Please try again."
      });
    } finally {
      setIsTransacting(false);
    }
  };

  useEffect(() => {
    updateBalance();
  }, [account]);

  if (!account) {
    return (
      <div className="wallet-connect">
        <div className="wallet-card">
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to access your account</p>
          <button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="connect-button"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="wallet-header">
          <h2>Wallet Dashboard</h2>
          <button 
            className="disconnect-button"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>

        {/* Account Info */}
        <div className="account-info">
          <label>Account</label>
          <p className="account-address">{account}</p>
        </div>

        {/* Balance */}
        <div className="balance-info">
          <label>Balance</label>
          <p className="balance-amount">{balance} Tokens</p>
        </div>

        {/* Transaction Status */}
        {transactionStatus && (
          <div className={`status-message ${transactionStatus.type}`}>
            {transactionStatus.message}
          </div>
        )}

        {/* Top Up Section */}
        <div className="transaction-section">
          <label>Top Up</label>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount to top up"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              disabled={isTransacting}
            />
            <button 
              onClick={handleTopUp} 
              disabled={!topUpAmount || isTransacting}
              className="action-button"
            >
              {isTransacting ? "Processing..." : "Top Up"}
            </button>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="transaction-section">
          <label>Withdraw</label>
          <div className="input-group">
            <input
              type="number"
              placeholder="Amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={isTransacting}
            />
            <button 
              onClick={handleWithdraw} 
              disabled={!withdrawAmount || isTransacting}
              className="action-button"
            >
              {isTransacting ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;