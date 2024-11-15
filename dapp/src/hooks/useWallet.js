import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

const useWallet = (walletType) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);

    const getProvider = useCallback(() => {
        if (walletType === 'metamask') {
            return window.ethereum;
        } else if (walletType === 'coinbase') {
            return window.coinbaseWallet;
        }
        return null;
    }, [walletType]);

    const handleAccountsChanged = useCallback((accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            setWeb3(null);
            setAccount(null);
            setError('Wallet disconnected');
        } else {
            // Update the current account
            setAccount(accounts[0]);
        }
    }, []);

    const handleChainChanged = useCallback(() => {
        // Reload the page when the chain changes, as recommended by MetaMask
        window.location.reload();
    }, []);

    const connectWallet = useCallback(async () => {
        const currentProvider = getProvider();

        if (!currentProvider) {
            setError(`${walletType} wallet not found. Please install it.`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Always request accounts to trigger the MetaMask popup
            const accounts = await currentProvider.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                const web3Instance = new Web3(currentProvider);
                setWeb3(web3Instance);
                setAccount(accounts[0]);
                setProvider(currentProvider);
                setError(null);

                // Set up event listeners
                currentProvider.on('accountsChanged', handleAccountsChanged);
                currentProvider.on('chainChanged', handleChainChanged);
            }
        } catch (err) {
            console.error('Wallet connection error:', err);
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setIsLoading(false);
        }
    }, [walletType, handleAccountsChanged, handleChainChanged, getProvider]);

    const disconnect = useCallback(async () => {
        if (provider) {
            // Remove event listeners
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('chainChanged', handleChainChanged);

            // Clear state
            setWeb3(null);
            setAccount(null);
            setProvider(null);
            setError(null);
        }
    }, [provider, handleAccountsChanged, handleChainChanged]);

    useEffect(() => {
        // Check if already connected
        const checkConnection = async () => {
            const currentProvider = getProvider();
            if (currentProvider) {
                try {
                    const accounts = await currentProvider.request({
                        method: 'eth_accounts'
                    });
                    if (accounts.length > 0) {
                        const web3Instance = new Web3(currentProvider);
                        setWeb3(web3Instance);
                        setAccount(accounts[0]);
                        setProvider(currentProvider);

                        // Set up event listeners
                        currentProvider.on('accountsChanged', handleAccountsChanged);
                        currentProvider.on('chainChanged', handleChainChanged);
                    }
                } catch (err) {
                    console.error('Error checking wallet connection:', err);
                }
            }
        };

        checkConnection();

        // Cleanup on unmount
        return () => {
            if (provider) {
                provider.removeListener('accountsChanged', handleAccountsChanged);
                provider.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [getProvider, handleAccountsChanged, handleChainChanged, provider]);

    return {
        web3,
        account,
        isLoading,
        error,
        connectWallet,
        disconnect,
        isConnected: !!account
    };
};

export default useWallet;