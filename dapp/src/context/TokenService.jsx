import { ethers } from 'ethers';

const tokenAddress = "0x8649fc3eF8b80097f24c4047eeeCBC0F9BFca3bD"; // Replace with your token's contract address
const tokenABI = [
  // Minimal ABI, just enough to interact with balance and transfers
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];

export const getBalance = async (provider, account) => {
  // Use the provider to create a contract instance (for reading)
  const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
  
  // Fetch the balance and return it formatted
  const balance = await contract.balanceOf(account);
  return ethers.formatUnits(balance, 18); // Assuming 18 decimals
};

export const transferTokens = async (provider, to, amount) => {
  // Get the signer from the provider (this represents the user’s wallet)
  const signer = provider.getSigner();
  
  // Connect the signer to the contract
  const contract = new ethers.Contract(tokenAddress, tokenABI, signer);
  
  // Prepare and send the transfer transaction
  const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
  
  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  return receipt;
};