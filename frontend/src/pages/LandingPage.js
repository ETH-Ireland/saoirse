import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

function LandingPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        console.log('Connected account:', address);
        setWalletAddress(address);
        setWalletConnected(true);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.log('Please install MetaMask!');
      alert('Please install MetaMask to use this feature');
    }
  };

  const handleOptionClick = (path) => {
    if (walletConnected) {
      navigate(path);
    } else {
      alert('Please connect your wallet first.');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to the Health Data Marketplace</h1>
        <button onClick={connectWallet} disabled={walletConnected} className="connect-wallet-btn">
          {walletConnected 
            ? `Wallet Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
            : 'Login with Wallet'
          }
        </button>

        <div className="options">
          <button 
            onClick={() => handleOptionClick('/seller-dashboard')}
            className="option"
          >
            <h2>Sell Data</h2>
            <p>Control Your Health Data</p>
          </button>
          <button 
            onClick={() => handleOptionClick('/buyer-dashboard')}
            className="option"
          >
            <h2>Buy Data</h2>
            <p>Fuel Research and Innovation</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
