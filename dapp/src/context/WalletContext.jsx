import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../utils/axiosConfig';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [jwt, setJwt] = useState(localStorage.getItem('jwt') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  // Check if JWT token exists and is valid on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (jwt) {
        try {
          const response = await axiosInstance.get('/api/user/me', {
            headers: {
              Authorization: `Bearer ${jwt}`, // Attach JWT token to request
            },
          });

          const user = Object.values(response.data);
          setAccount(user);  // Assuming the user object contains the account info
          localStorage.setItem('account', user); // Store account in localStorage
          navigate('/myhouse');
        } catch (error) {
          console.error("JWT token is invalid, please log in again.");
          setJwt(null);  // Clear JWT from state
          setAccount(null);  // Clear account from state
          localStorage.removeItem('jwt');  // Remove JWT from localStorage
          localStorage.removeItem('account');  // Remove account from localStorage
        }
      }
    };
    checkTokenValidity();
  }, [jwt]);  // Only rerun when `jwt` changes

  // Handle wallet connection (MetaMask or others)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        localStorage.setItem('account', account); // Store account in localStorage

        const message = 'Authenticate wallet connection'; // Customize this message
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, account],
        });

        const response = await axiosInstance.post('/api/auth/authenticate', { account, signature });
        const { token } = response.data;

        setJwt(token);  // Set JWT in state
        localStorage.setItem('jwt', token); // Store JWT in localStorage
      } catch (error) {
        console.error("Failed to connect wallet or authenticate", error);
        setError("Connection failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('MetaMask is not installed');
      setError('MetaMask is not installed');
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    setAccount(null);
    setJwt(null);
    localStorage.removeItem('jwt');  // Clear JWT from localStorage
    localStorage.removeItem('account');  // Clear account from localStorage
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, jwt, isLoading, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);